import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { urlFor } from "@/sanity/lib/image";
// Removed unused imports

export const POST = async (request: NextRequest) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  try {
    const reqBody = await request.json();
    const { orderId, orderNumber, items, email, shippingAddress, orderAmount } =
      reqBody;

    // Validate required fields
    if (!orderId) {
      return NextResponse.json(
        { error: "Yêu cầu phải có ID đơn hàng" },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Không có sản phẩm nào được cung cấp" }, { status: 400 });
    }

    // Convert cart items to Stripe line items
    const extractingItems = items.map(
      (item: {
        product: {
          _id: string;
          name?: string;
          description?: string;
          price?: number;
          images?: string[];
        };
        quantity: number;
      }) => {
        const itemPrice = item.product.price || 0;
        const unitAmount = Math.round(itemPrice * 100); // Convert to cents

        // Convert Sanity image objects to URLs for Stripe
        let productImages: string[] = [];
        if (
          item.product.images &&
          Array.isArray(item.product.images) &&
          item.product.images.length > 0
        ) {
          try {
            // Convert first image to URL
            const imageUrl = urlFor(item.product.images[0])
              .width(800)
              .height(600)
              .url();
            if (imageUrl) {
              productImages = [imageUrl];
            }
          } catch (error) {
            console.warn("Failed to convert image URL:", error);
            productImages = [];
          }
        }

        return {
          quantity: item.quantity || 1,
          price_data: {
            currency: "usd",
            unit_amount: unitAmount,
            product_data: {
              name: item.product.name || "Sản phẩm",
              description:
                item.product.description || `Sản phẩm từ đơn hàng ${orderId}`,
              images: productImages,
              metadata: {
                productId: item.product._id?.toString() || "",
                orderId: orderId.toString(),
                quantity: item.quantity.toString(),
              },
            },
          },
        };
      }
    );

    // Validate line items
    if (!extractingItems || extractingItems.length === 0) {
      throw new Error("Không tìm thấy sản phẩm hợp lệ nào");
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: extractingItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}&orderNumber=${orderNumber}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/user/orders/${orderId}?cancelled=true`,
      metadata: {
        orderId: orderId.toString(),
        orderNumber: orderNumber.toString(),
        email,
        orderDate: new Date().toISOString(),
        itemCount: items.length.toString(),
        shippingAddress: JSON.stringify(shippingAddress),
        orderAmount: orderAmount?.toString() || "",
      },
      customer_email: email,
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
      message: "Tạo phiên thanh toán Stripe thành công",
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Lỗi không xác định";
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: errorMessage || "Tạo phiên thanh toán Stripe thất bại" },
      { status: 500 }
    );
  }
};