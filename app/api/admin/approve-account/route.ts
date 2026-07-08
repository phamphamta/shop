import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { client } from "@/sanity/lib/client";
import { backendClient } from "@/sanity/lib/backendClient";

export async function POST(request: NextRequest) {
  try {
    // Add admin authentication check
    const { userId: adminUserId } = await auth();
    if (!adminUserId) {
      return NextResponse.json(
        { success: false, message: "Yêu cầu xác thực quản trị viên" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { userId, type } = body;

    if (!userId || !type) {
      return NextResponse.json(
        { success: false, message: "Thiếu thông tin bắt buộc" },
        { status: 400 }
      );
    }

    if (!["premium", "business"].includes(type)) {
      return NextResponse.json(
        { success: false, message: "Loại tài khoản không hợp lệ" },
        { status: 400 }
      );
    }

    const accountTypeLabel = type === "premium" ? "Cao cấp" : "Doanh nghiệp";

    // Verify user exists and has pending status
    const user = await client.fetch(
      `
      *[_type == "userType" && _id == $userId][0] {
        _id,
        firstName,
        lastName,
        email,
        premiumStatus,
        businessStatus,
        rejectionReason
      }
    `,
      { userId }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy người dùng" },
        { status: 404 }
      );
    }

    const currentStatus =
      type === "premium" ? user.premiumStatus : user.businessStatus;

    if (currentStatus !== "pending") {
      return NextResponse.json(
        {
          success: false,
          message: `Tài khoản ${accountTypeLabel} không ở trạng thái chờ duyệt`,
        },
        { status: 400 }
      );
    }

    // For business accounts, ensure user has premium status first
    if (type === "business" && user.premiumStatus !== "active") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Người dùng cần có tài khoản Cao cấp đang hoạt động trước khi đăng ký tài khoản Doanh nghiệp",
        },
        { status: 400 }
      );
    }

    // Update the user status
    const updateData: Record<string, string | null> = {
      [`${type}Status`]: "active",
      [`${type}ApprovedAt`]: new Date().toISOString(),
    };

    // Clear rejection reason if it exists
    if (user.rejectionReason) {
      updateData.rejectionReason = null;
    }

    // Try with both methods to see which one works
    try {
      const result = await backendClient.patch(userId).set(updateData).commit();
      console.log(
        "Successfully updated user with backendClient:",
        userId,
        result
      );
    } catch (backendError) {
      console.log(
        "backendClient failed, trying with writeClient...",
        backendError
      );
      // Import writeClient locally to avoid import issues
      const { writeClient } = await import("@/sanity/lib/client");
      const result = await writeClient.patch(userId).set(updateData).commit();
      console.log(
        "Successfully updated user with writeClient:",
        userId,
        result
      );
    }
    return NextResponse.json({
      success: true,
      message: `🎉 Tài khoản ${accountTypeLabel} của ${user.firstName} ${user.lastName} đã được phê duyệt thành công!`,
    });
  } catch (error) {
    console.error("Error approving account:", error);
    return NextResponse.json(
      { success: false, message: "Không thể phê duyệt tài khoản" },
      { status: 500 }
    );
  }
}