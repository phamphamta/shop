import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { writeClient, client } from "@/sanity/lib/client";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 401 });
    }

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email là bắt buộc" }, { status: 400 });
    }

    // Check if user exists in Sanity
    const existingUser = await client.fetch(
      `*[_type == "userType" && email == $email][0]`,
      { email }
    );

    if (!existingUser) {
      return NextResponse.json(
        { error: "Vui lòng đăng ký dịch vụ cao cấp trước" },
        { status: 404 }
      );
    }

    if (!existingUser.isActive) {
      return NextResponse.json(
        { error: "Vui lòng kích hoạt tài khoản cao cấp của bạn trước" },
        { status: 400 }
      );
    }

    // Check business account status
    if (existingUser.businessStatus === "rejected") {
      return NextResponse.json(
        {
          error:
            "Yêu cầu mở tài khoản doanh nghiệp đã bị từ chối. Vui lòng liên hệ quản trị viên để được hỗ trợ.",
        },
        { status: 400 }
      );
    }

    if (existingUser.businessStatus === "pending") {
      return NextResponse.json(
        { error: "Yêu cầu mở tài khoản doanh nghiệp đang trong quá trình chờ phê duyệt." },
        { status: 400 }
      );
    }

    if (existingUser.isBusiness) {
      return NextResponse.json(
        { error: "Tài khoản doanh nghiệp đã được phê duyệt trước đó" },
        { status: 400 }
      );
    }

    // Apply for business account
    const result = await writeClient
      .patch(existingUser._id)
      .set({
        businessStatus: "pending",
        businessAppliedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .commit();

    return NextResponse.json({
      success: true,
      message:
        "🚀 Gửi yêu cầu mở tài khoản doanh nghiệp thành công! Yêu cầu của bạn đang được xem xét, bạn sẽ nhận được thêm 2% chiết khấu ngay sau khi được phê duyệt.",
      user: result,
    });
  } catch (error) {
    console.error("Error applying for business account:", error);
    return NextResponse.json(
      { error: "Gửi yêu cầu mở tài khoản doanh nghiệp thất bại" },
      { status: 500 }
    );
  }
}