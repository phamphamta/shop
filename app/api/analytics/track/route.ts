// API Analytics phía Server để theo dõi các sự kiện từ backend
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // const body = await request.json();
    // const { eventName, eventParams } = body;

    // Ghi log sự kiện analytics ra console trong môi trường development
    // if (process.env.NODE_ENV === "development") {
    //   console.log(`[Server Analytics] ${eventName}`, eventParams);
    // }

    // Tại đây bạn có thể thêm logic theo dõi dữ liệu phân tích phía server
    // Ví dụ: gửi đến Google Analytics 4 Measurement Protocol
    // hoặc các dịch vụ analytics khác

    // Hiện tại, chúng ta chỉ ghi log và trả về thành công
    // Trong môi trường production, bạn có thể muốn gửi dữ liệu đến:
    // - Google Analytics 4 Measurement Protocol
    // - Firebase Admin SDK
    // - Các dịch vụ analytics khác

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics tracking error:", error);
    return NextResponse.json(
      { error: "Ghi nhận sự kiện thất bại" }, // Đã đổi text hiển thị ở đây
      { status: 500 }
    );
  }
}