import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { writeClient, client } from "@/sanity/lib/client";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 401 });
    }

    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "Yêu cầu cung cấp ID đơn hàng" },
        { status: 400 }
      );
    }

    // Fetch the order
    const order = await client.fetch(
      `*[_type == "order" && _id == $orderId][0]{
        _id,
        orderNumber,
        totalPrice,
        paymentMethod,
        paymentStatus,
        status,
        stripePaymentIntentId,
        clerkUserId,
        customerName,
        email
      }`,
      { orderId }
    );

    if (!order) {
      return NextResponse.json({ error: "Không tìm thấy đơn hàng" }, { status: 404 });
    }

    // Verify the order belongs to the user
    if (order.clerkUserId !== userId) {
      return NextResponse.json({ error: "Quyền truy cập bị từ chối" }, { status: 403 });
    }

    // Check if order is already cancelled
    if (order.status === "cancelled") {
      return NextResponse.json(
        { error: "Đơn hàng này đã được hủy trước đó" },
        { status: 400 }
      );
    }

    // Check if order can be cancelled (not delivered or completed)
    if (["delivered", "completed"].includes(order.status)) {
      return NextResponse.json(
        { error: "Không thể hủy đơn hàng đã giao hoặc đã hoàn thành" },
        { status: 400 }
      );
    }

    let refundAmount = 0;
    let stripeRefundId = null;

    // Process refund for Stripe payments
    if (
      order.paymentMethod === "stripe" &&
      order.paymentStatus === "paid" &&
      order.stripePaymentIntentId
    ) {
      try {
        // Create refund in Stripe
        const refund = await stripe.refunds.create({
          payment_intent: order.stripePaymentIntentId,
          reason: "requested_by_customer",
        });

        stripeRefundId = refund.id;
        refundAmount = refund.amount / 100; // Convert from cents to dollars

        console.log(`Stripe refund created: ${refund.id}`, refund);
      } catch (stripeError) {
        console.error("Stripe refund error:", stripeError);
        // If Stripe refund fails, still cancel the order but add to user wallet
        refundAmount = order.totalPrice || 0;
      }
    } else if (
      order.paymentMethod === "stripe" &&
      order.paymentStatus === "paid"
    ) {
      // Paid via Stripe but no payment intent (add to wallet)
      refundAmount = order.totalPrice || 0;
    }

    // Update order status to cancelled
    await writeClient
      .patch(orderId)
      .set({
        status: "cancelled",
        cancelledAt: new Date().toISOString(),
        cancelledBy: userId,
        stripeRefundId: stripeRefundId || undefined,
      })
      .commit();

    // If there's a refund amount, add it to user's wallet
    if (refundAmount > 0) {
      // Get user document
      const user = await client.fetch(
        `*[_type == "user" && clerkUserId == $userId][0]{
          _id,
          walletBalance,
          email,
          firstName,
          lastName
        }`,
        { userId }
      );

      if (user) {
        const currentBalance = user.walletBalance || 0;
        const newBalance = currentBalance + refundAmount;
        const transactionId = `TXN-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)
          .toUpperCase()}`;

        // Create wallet transaction
        const transaction = {
          id: transactionId,
          type: "credit_refund",
          amount: refundAmount,
          balanceBefore: currentBalance,
          balanceAfter: newBalance,
          description: `Hoàn tiền cho đơn hàng đã hủy #${order.orderNumber}`,
          orderId: order._id,
          createdAt: new Date().toISOString(),
          status: "completed",
          processedBy: "system",
        };

        // Update user wallet
        await writeClient
          .patch(user._id)
          .set({ walletBalance: newBalance })
          .setIfMissing({ walletTransactions: [] })
          .append("walletTransactions", [transaction])
          .commit();

        console.log(
          `Added $${refundAmount} to user wallet. New balance: $${newBalance}`
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Hủy đơn hàng thành công",
        refundAmount,
        refundedToWallet: refundAmount > 0,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("Error processing refund:", error);
    return NextResponse.json(
      { error: "Lỗi hệ thống nội bộ" },
      { status: 500 }
    );
  }
}