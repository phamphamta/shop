import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  sendOrderConfirmationEmail,
  OrderConfirmationData,
} from "@/lib/emailService";
import { getEmailImageUrl } from "@/lib/emailImageUtils";

// Extended interface for email preparation that can handle Sanity images
interface EmailOrderItem {
  name: string;
  price: number;
  quantity: number;
  image?: string | { asset?: { _ref?: string; url?: string } }; // Can be string URL or Sanity image object
}

interface EmailOrderData {
  customerName: string;
  customerEmail: string;
  orderId: string;
  orderDate: string;
  items: EmailOrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  estimatedDelivery?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      // Thay đổi: "Unauthorized" -> "Không có quyền truy cập"
      return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 401 });
    }

    const { orderData }: { orderData: EmailOrderData } = await request.json();

    if (!orderData) {
      // Thay đổi: "Order data is required" -> "Dữ liệu đơn hàng là bắt buộc"
      return NextResponse.json(
        { error: "Dữ liệu đơn hàng là bắt buộc" },
        { status: 400 }
      );
    }

    // Convert EmailOrderData to OrderConfirmationData with proper image URLs
    const emailDataWithImages: OrderConfirmationData = {
      ...orderData,
      items: orderData.items.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: getEmailImageUrl(item.image),
      })),
    };

    const emailResult = await sendOrderConfirmationEmail(emailDataWithImages);

    if (emailResult.success) {
      return NextResponse.json({
        success: true,
        messageId: emailResult.messageId,
        // Thay đổi: "Email sent successfully" -> "Gửi email thành công"
        message: "Gửi email thành công",
      });
    } else {
      console.error(
        "Failed to send order confirmation email:",
        emailResult.error
      );
      return NextResponse.json(
        {
          success: false,
          // Thay đổi: "Failed to send email" -> "Gửi email thất bại"
          error: emailResult.error || "Gửi email thất bại",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    // Thay đổi: "Unknown error occurred" -> "Đã xảy ra lỗi không xác định"
    const errorMessage =
      error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định";
    console.error("Email sending error:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}