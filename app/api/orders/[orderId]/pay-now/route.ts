import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { writeClient } from "@/sanity/lib/client";
import stripe from "@/lib/stripe";
import { urlFor } from "@/sanity/lib/image";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 401 });
    }

    const { orderId } = await params;
    if (!orderId) {
      return NextResponse.json(
        { error: "Yêu cầu cung cấp ID đơn hàng" },
        { status: 400 }
      );
    }

    // Get the order from Sanity
    const order = await writeClient.fetch(
      `*[_type == "order" && _id == $orderId && clerkUserId == $clerkUserId][0]{
        _id,
        orderNumber,
        clerkUserId,
        customerName,
        email,
        products[]{
          product->{
            _id,
            name,
            price,
            currency,
            images
          },
          quantity
        },
        subtotal,
        tax,
        shipping,
        totalPrice,
        currency,
        status,
        paymentStatus,
        stripeCustomerId,
        stripePaymentIntentId,
        address
      }`,
      { orderId, clerkUserId: user.id }
    );

    if (!order) {
      console.error(`Order not found: ${orderId}`);
      return NextResponse.json({ error: "Không tìm thấy đơn hàng" }, { status: 404 });
    }

    // Check if order is already paid
    if (order.paymentStatus === "paid" || order.status === "paid") {
      return NextResponse.json(
        { error: "Đơn hàng này đã được thanh toán" },
        { status: 400 }
      );
    }

    // Validate order has products and total
    if (!order.products || order.products.length === 0) {
      console.error(`No products found for order: ${orderId}`);
      return NextResponse.json(
        { error: "Không tìm thấy sản phẩm nào trong đơn hàng" },
        { status: 400 }
      );
    }

    if (!order.totalPrice || order.totalPrice <= 0) {
      console.error(`Invalid total price for order: ${orderId}`);
      return NextResponse.json(
        { error: "Tổng tiền đơn hàng không hợp lệ" },
        { status: 400 }
      );
    }

    // Handle Stripe customer - create or find existing customer
    let stripeCustomerId = order.stripeCustomerId;

    // If we don't have a valid Stripe customer ID, create one
    if (
      !stripeCustomerId ||
      stripeCustomerId.includes("@") ||
      !stripeCustomerId.startsWith("cus_")
    ) {
      try {
        // First, try to find existing customer by email
        const existingCustomers = await stripe.customers.list({
          email: order.email,
          limit: 1,
        });

        if (existingCustomers.data.length > 0) {
          stripeCustomerId = existingCustomers.data[0].id;
        } else {
          // Create new customer
          const customer = await stripe.customers.create({
            email: order.email,
            name: order.customerName,
            metadata: {
              clerkUserId: order.clerkUserId,
              orderId: order._id,
            },
          });
          stripeCustomerId = customer.id;
        }

        // Update order with correct Stripe customer ID
        await writeClient.patch(order._id).set({ stripeCustomerId }).commit();
      } catch (customerError) {
        console.error(`Failed to create/find Stripe customer:`, customerError);
        return NextResponse.json(
          { error: "Không thể tạo hoặc tìm thấy khách hàng trên Stripe" },
          { status: 500 }
        );
      }
    }

    // Create Stripe checkout session for the order
    const currency = (order.currency || "USD").toLowerCase();

    try {
      // Prepare line items for the checkout session
      const lineItems = order.products.map(
        (item: {
          product: { name: string; images?: string[]; price?: number };
          quantity: number;
        }) => ({
          price_data: {
            currency,
            product_data: {
              name: item.product.name,
              images:
                item.product.images && item.product.images.length > 0
                  ? [urlFor(item.product.images[0]).url()]
                  : [],
            },
            unit_amount: Math.round((item.product.price || 0) * 100),
          },
          quantity: item.quantity,
        })
      );

      // Add tax as a line item if exists
      if (order.tax && order.tax > 0) {
        lineItems.push({
          price_data: {
            currency,
            product_data: {
              name: "Thuế",
            },
            unit_amount: Math.round(order.tax * 100),
          },
          quantity: 1,
        });
      }

      // Add shipping as a line item if exists
      if (order.shipping && order.shipping > 0) {
        lineItems.push({
          price_data: {
            currency,
            product_data: {
              name: "Phí vận chuyển",
            },
            unit_amount: Math.round(order.shipping * 100),
          },
          quantity: 1,
        });
      }

      const checkoutSession = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}&orderId=${order._id}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/orders`,
        metadata: {
          orderId: order._id,
          orderNumber: order.orderNumber || "",
          customerName: order.customerName || "",
        },
      });

      // Update order with checkout session ID
      await writeClient
        .patch(order._id)
        .set({
          stripeCheckoutSessionId: checkoutSession.id,
          stripeCustomerId, // Ensure we have the correct customer ID
        })
        .commit();

      return NextResponse.json(
        {
          success: true,
          checkoutUrl: checkoutSession.url,
          sessionId: checkoutSession.id,
          message: "Tạo phiên thanh toán thành công",
        },
        { status: 200 }
      );
    } catch (checkoutError) {
      console.error(`Failed to create checkout session:`, checkoutError);
      return NextResponse.json(
        { error: "Không thể khởi tạo phiên thanh toán" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Direct payment error:", error);

    // Provide more specific error messages
    let errorMessage = "Xử lý thanh toán thất bại";
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes("No such customer")) {
        errorMessage = "Không tìm thấy khách hàng trên Stripe. Vui lòng liên hệ bộ phận hỗ trợ.";
        statusCode = 400;
      } else if (error.message.includes("currency")) {
        errorMessage = "Đơn vị tiền tệ được chỉ định không hợp lệ";
        statusCode = 400;
      } else if (error.message.includes("amount")) {
        errorMessage = "Số tiền được chỉ định không hợp lệ";
        statusCode = 400;
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : String(error)
            : undefined,
      },
      { status: statusCode }
    );
  }
}