import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { writeClient } from "@/sanity/lib/client";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 401 });
    }

    const { accountId, approve, adminEmail, reason } = await request.json();

    if (!accountId || typeof approve !== "boolean" || !adminEmail) {
      return NextResponse.json(
        { error: "Thiếu các thông tin bắt buộc" },
        { status: 400 }
      );
    }

    // Check if user is admin (implement your own admin check logic)
    // For now, we'll assume the request is valid

    if (approve) {
      // Approve the business account
      const result = await writeClient
        .patch(accountId)
        .set({
          isBusiness: true,
          businessStatus: "active",
          membershipType: "business",
          businessApprovedBy: adminEmail,
          businessApprovedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .commit();

      return NextResponse.json({
        success: true,
        message: "Tài khoản doanh nghiệp đã được phê duyệt thành công",
        account: result,
      });
    } else {
      // Reject the business account
      const result = await writeClient
        .patch(accountId)
        .set({
          isBusiness: false,
          businessStatus: "rejected",
          businessApprovedBy: adminEmail,
          businessApprovedAt: new Date().toISOString(),
          rejectionReason: reason || "Không có lý do nào được cung cấp",
          updatedAt: new Date().toISOString(),
        })
        .commit();

      return NextResponse.json({
        success: true,
        message: "Tài khoản doanh nghiệp đã bị từ chối",
        account: result,
      });
    }
  } catch (error) {
    console.error("Error updating business account:", error);
    return NextResponse.json(
      { error: "Cập nhật tài khoản doanh nghiệp thất bại" },
      { status: 500 }
    );
  }
}