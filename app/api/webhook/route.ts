import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import stripe from "@/lib/stripe";
import { backendClient } from "@/sanity/lib/backendClient";
import { ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/orderStatus";
import { sendOrderStatusNotification } from "@/lib/notificationService";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      {
        error: "Không tìm thấy chữ ký xác thực (signature)",
      },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      {
        error: "Biến môi trường STRIPE_WEBHOOK_SECRET chưa được thiết lập",
      },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (error) {
    console.error("Xác thực chữ ký Webhook thất bại:", error);
    return NextResponse.json(
      {
        error: `Lỗi Webhook: ${error}`,
      },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      // Get orderId from session metadata
      const orderId = session.metadata?.orderId;

      if (orderId) {
        // Generate invoice if not already exists
        let invoice: Stripe.Invoice | null = null;

        if (session.invoice) {
          invoice = await stripe.invoices.retrieve(session.invoice as string);
        } else if (session.customer && session.payment_intent) {
          // Get order details for invoice creation
          const order = await backendClient.fetch(
            `*[_type == "order" && _id == $orderId][0]{
              _id,
              orderNumber,
              products[]{ product->{_id, name, price, currency}, quantity },
              subtotal,
              tax,
              shipping,
              totalPrice,
              currency
            }`,
            { orderId }
          );

          if (order) {
            // Create and finalize invoice
            invoice = await createAndFinalizeInvoice(
              orderId,
              session.customer as string,
              order.products || [],
              {
                totalAmount: order.totalAmount || 0,
                customerEmail: order.email || "",
                orderNumber: order.orderNumber,
                currency: order.currency,
                tax: order.tax || 0,
                shipping: order.shipping || 0,
              }
            );
          }
        }

        await updateOrderWithPaymentCompletion(orderId, session, invoice);
      } else {
        console.error("Không tìm thấy orderId trong metadata của session");
        return NextResponse.json(
          {
            error: "Không tìm thấy orderId trong metadata của session",
          },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error("Lỗi khi xử lý đơn hàng:", error);
      return NextResponse.json(
        {
          error: `Lỗi khi xử lý đơn hàng: ${error}`,
        },
        { status: 400 }
      );
    }
  }

  return NextResponse.json({ received: true });
}

// Helper function to create and finalize an invoice
async function createAndFinalizeInvoice(
  orderId: string,
  stripeCustomerId: string,
  products: {
    product: { _id?: string; name: string; price?: number };
    quantity: number;
  }[],
  orderData: {
    totalAmount: number;
    customerEmail: string;
    orderNumber?: string;
    currency?: string;
    tax?: number;
    shipping?: number;
  }
) {
  try {
    // Validate required data
    if (!stripeCustomerId) {
      console.error(`Thiếu stripeCustomerId cho đơn hàng: ${orderId}`);
      return null;
    }

    if (!products || products.length === 0) {
      console.error(`Không tìm thấy sản phẩm nào cho đơn hàng: ${orderId}`);
      return null;
    }

    // Validate currency
    const currency = (orderData.currency || "USD").toLowerCase();
    if (!["usd", "eur", "gbp", "cad", "aud"].includes(currency)) {
      console.warn(`Tiền tệ không được hỗ trợ: ${currency}, tự động chuyển về USD`);
    }

    // Create the invoice
    const invoice = await stripe.invoices.create({
      customer: stripeCustomerId,
      description: `Hóa đơn cho Đơn hàng ${orderData.orderNumber || orderId}`,
      metadata: {
        orderId: orderId,
        orderNumber: orderData.orderNumber || "",
        source: "webhook",
      },
      auto_advance: false,
      collection_method: "charge_automatically",
    });

    // Add invoice items for products
    for (const item of products) {
      if (!item.product || !item.product.name || !item.product.price) {
        console.warn(`Bỏ qua sản phẩm không hợp lệ trong đơn hàng ${orderId}:`, item);
        continue;
      }

      try {
        await stripe.invoiceItems.create({
          customer: stripeCustomerId,
          invoice: invoice.id,
          amount: Math.round(item.product.price * item.quantity * 100),
          currency: currency,
          description: `${item.product.name} x ${item.quantity}`,
          metadata: {
            productId: item.product._id || "",
            quantity: item.quantity.toString(),
          },
        });
      } catch (error) {
        console.error(`Thêm mục hóa đơn thất bại:`, error);
        throw error;
      }
    }

    // Add tax if any
    if (orderData.tax && orderData.tax > 0) {
      try {
        await stripe.invoiceItems.create({
          customer: stripeCustomerId,
          invoice: invoice.id,
          amount: Math.round(orderData.tax * 100),
          currency: currency,
          description: "Thuế",
          metadata: { type: "tax" },
        });
      } catch (error) {
        console.error(`Thêm tiền thuế vào hóa đơn thất bại:`, error);
        throw error;
      }
    }

    // Add shipping if any
    if (orderData.shipping && orderData.shipping > 0) {
      try {
        await stripe.invoiceItems.create({
          customer: stripeCustomerId,
          invoice: invoice.id,
          amount: Math.round(orderData.shipping * 100),
          currency: currency,
          description: "Phí vận chuyển",
          metadata: { type: "shipping" },
        });
      } catch (error) {
        console.error(`Thêm phí vận chuyển vào hóa đơn thất bại:`, error);
        throw error;
      }
    }

    // Finalize the invoice
    if (!invoice.id) {
      throw new Error("Tạo hóa đơn thất bại - không có ID hóa đơn");
    }

    const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);

    return finalizedInvoice;
  } catch (error) {
    console.error(`Lỗi khi tạo hóa đơn cho đơn hàng ${orderId}:`, error);
    return null;
  }
}

async function updateOrderWithPaymentCompletion(
  orderId: string,
  session: Stripe.Checkout.Session,
  invoice: Stripe.Invoice | null
) {
  const { id, customer, payment_intent } = session;

  // First, get the order to check its current status and payment method
  const existingOrder = await backendClient.fetch(
    `*[_type == "order" && _id == $orderId][0]{
      status,
      paymentMethod,
      paymentStatus
    }`,
    { orderId }
  );

  // Prepare update data
  const updateData: Record<string, unknown> = {
    paymentStatus: PAYMENT_STATUSES.PAID,
    stripeCheckoutSessionId: id,
    stripePaymentIntentId: payment_intent as string,
    stripeCustomerId: customer as string, // Store the correct Stripe customer ID
    paymentCompletedAt: new Date().toISOString(),
  };

  // Order status logic:
  // 1. For COD orders paid later: Keep current delivery status (packed, out_for_delivery, etc.)
  // 2. For new checkout orders: Set status to "pending" to start the fulfillment workflow
  // 3. For orders already in processing: Keep current status
  if (existingOrder?.paymentMethod === "cash_on_delivery") {
    // COD order paid online - keep current status
    // Don't update status at all
  } else {
    // New checkout order or card payment - set to pending to start workflow
    updateData.status = ORDER_STATUSES.PENDING;
  }

  // Add invoice data if available
  if (invoice) {
    updateData.invoice = {
      id: invoice.id,
      number: invoice.number,
      hosted_invoice_url: invoice.hosted_invoice_url,
    };
  }

  try {
    // Update the existing order in Sanity
    await backendClient.patch(orderId).set(updateData).commit();

    // Get the order to access products for stock updates and user info
    const order = await backendClient.fetch(
      `*[_type == "order" && _id == $orderId][0]{
        _id,
        orderNumber,
        clerkUserId,
        status,
        products,
        user -> {
          clerkUserId
        }
      }`,
      { orderId }
    );

    if (order) {
      // Update stock levels for purchased products
      if (order.products) {
        await updateStockLevels(order.products);
      }

      // Send payment confirmation notification
      try {
        const userClerkId = order.clerkUserId || order.user?.clerkUserId;

        if (userClerkId) {
          await sendOrderStatusNotification({
            clerkUserId: userClerkId,
            orderNumber: order.orderNumber,
            orderId: orderId,
            status: order.status || ORDER_STATUSES.PENDING,
          });
        }
      } catch (notificationError) {
        console.error(
          "Gửi thông báo xác nhận thanh toán thất bại:",
          notificationError
        );
        // Don't fail the webhook if notification fails
      }
    }
  } catch (error) {
    console.error(`Cập nhật đơn hàng ${orderId} thất bại:`, error);
    throw error;
  }
}

// Function to update stock levels
async function updateStockLevels(
  orderProducts: Array<{
    product: { _ref: string };
    quantity: number;
  }>
) {
  for (const orderProduct of orderProducts) {
    try {
      const productId = orderProduct.product._ref;
      const quantity = orderProduct.quantity;

      // Fetch current stock
      const product = await backendClient.getDocument(productId);

      if (!product || typeof product.stock !== "number") {
        console.warn(
          `Không tìm thấy sản phẩm có ID ${productId} hoặc số lượng tồn kho không hợp lệ.`
        );
        continue;
      }

      const newStock = Math.max(product.stock - quantity, 0); // Ensure stock does not go negative

      // Update stock in Sanity
      await backendClient.patch(productId).set({ stock: newStock }).commit();
    } catch (error) {
      console.error(
        `Cập nhật kho hàng cho sản phẩm ${orderProduct.product._ref} thất bại:`,
        error
      );
    }
  }
}