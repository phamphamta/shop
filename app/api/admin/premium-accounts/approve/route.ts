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

    if (approve) {
      // Approve the premium account
      const result = await writeClient
        .patch(accountId)
        .set({
          isActive: true,
          premiumStatus: "active",
          membershipType: "premium",
          premiumApprovedBy: adminEmail,
          premiumApprovedAt: new Date().toISOString(),
          loyaltyPoints: 100, // Welcome bonus
          updatedAt: new Date().toISOString(),
        })
        .commit();

      return NextResponse.json({
        success: true,
        message: "Tài khoản Premium đã được phê duyệt thành công",
        account: result,
      });
    } else {
      // Reject the premium account
      const result = await writeClient
        .patch(accountId)
        .set({
          isActive: false,
          premiumStatus: "rejected",
          premiumApprovedBy: adminEmail,
          premiumApprovedAt: new Date().toISOString(),
          rejectionReason: reason || "Không có lý do nào được cung cấp",
          updatedAt: new Date().toISOString(),
        })
        .commit();

      return NextResponse.json({
        success: true,
        message: "Tài khoản Premium đã bị từ chối",
        account: result,
      });
    }
  } catch (error) {
    console.error("Error updating premium account:", error);
    return NextResponse.json(
      { error: "Không thể cập nhật tài khoản premium" },
      { status: 500 }
    );
  }
}