import { NextRequest, NextResponse } from "next/server";
import { saveContactMessage } from "@/sanity/helpers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Vui lòng nhập đầy đủ tất cả các trường" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Vui lòng cung cấp một địa chỉ email hợp lệ" },
        { status: 400 }
      );
    }

    // Get client info
    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Save to Sanity
    const result = await saveContactMessage({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      ipAddress,
      userAgent,
    });

    if (result.success) {
      return NextResponse.json(
        {
          message: "Gửi tin nhắn thành công! Chúng tôi sẽ phản hồi bạn sớm.",
          id: result.data?._id,
        },
        { status: 200 }
      );
    } else {
      console.error("Sanity save failed:", result.error);
      return NextResponse.json(
        { error: result.error || "Gửi tin nhắn thất bại. Vui lòng thử lại." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Contact API Error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}