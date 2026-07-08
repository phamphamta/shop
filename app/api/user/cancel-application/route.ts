import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { writeClient, client } from "@/sanity/lib/client";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 401 });
    }

    const { email, applicationType } = await request.json(); // applicationType: "premium" | "business"

    if (!email || !applicationType) {
      return NextResponse.json(
        { error: "Yêu cầu cung cấp email và loại hồ sơ đăng ký" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await client.fetch(
      `*[_type == "userType" && email == $email][0]`,
      { email }
    );

    if (!existingUser) {
      return NextResponse.json({ error: "Không tìm thấy người dùng" }, { status: 404 });
    }

    if (applicationType === "premium") {
      // Cancel premium application - only if pending or rejected
      if (
        existingUser.premiumStatus !== "pending" &&
        existingUser.premiumStatus !== "rejected"
      ) {
        return NextResponse.json(
          { error: "Không thể hủy hồ sơ đăng ký Premium ở trạng thái hiện tại" },
          { status: 400 }
        );
      }

      const result = await writeClient
        .patch(existingUser._id)
        .set({
          premiumStatus: "cancelled",
          updatedAt: new Date().toISOString(),
        })
        .commit();

      return NextResponse.json({
        success: true,
        message: "Đã hủy hồ sơ đăng ký Premium. Bạn có thể gửi lại yêu cầu mới.",
        user: result,
      });
    } else if (applicationType === "business") {
      // Cancel business application - only if pending or rejected
      if (
        existingUser.businessStatus !== "pending" &&
        existingUser.businessStatus !== "rejected"
      ) {
        return NextResponse.json(
          { error: "Không thể hủy hồ sơ đăng ký Business ở trạng thái hiện tại" },
          { status: 400 }
        );
      }

      const result = await writeClient
        .patch(existingUser._id)
        .set({
          businessStatus: "cancelled",
          updatedAt: new Date().toISOString(),
        })
        .commit();

      return NextResponse.json({
        success: true,
        message: "Đã hủy hồ sơ đăng ký Business. Bạn có thể gửi lại yêu cầu mới.",
        user: result,
      });
    } else {
      return NextResponse.json(
        { error: "Loại hồ sơ đăng ký không hợp lệ" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error cancelling application:", error);
    return NextResponse.json(
      { error: "Không thể hủy hồ sơ đăng ký" },
      { status: 500 }
    );
  }
}