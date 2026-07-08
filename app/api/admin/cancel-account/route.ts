import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { backendClient } from "@/sanity/lib/backendClient";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 401 });
    }

    const { accountId, type, reason } = await req.json();

    if (!accountId || !type || !reason) {
      return NextResponse.json(
        { error: "ID tài khoản, loại tài khoản và lý do là bắt buộc" },
        { status: 400 }
      );
    }

    if (!["premium", "business"].includes(type)) {
      return NextResponse.json(
        { error: "Loại tài khoản không hợp lệ" },
        { status: 400 }
      );
    }

    // First, verify the user document exists and has active status
    const existingUser = await backendClient.fetch(
      `*[_type == "userType" && _id == $accountId][0]`,
      { accountId }
    );

    if (!existingUser) {
      return NextResponse.json({ error: "Không tìm thấy người dùng" }, { status: 404 });
    }

    const currentStatus =
      type === "premium"
        ? existingUser.premiumStatus
        : existingUser.businessStatus;

    if (currentStatus !== "active") {
      return NextResponse.json(
        { error: `Tài khoản ${type} hiện không hoạt động` },
        { status: 400 }
      );
    }

    // Prepare the update data to cancel the account
    const updateData =
      type === "premium"
        ? {
          premiumStatus: "cancelled",
          premiumCancelledAt: new Date().toISOString(),
          premiumCancellationReason: reason,
        }
        : {
          businessStatus: "cancelled",
          businessCancelledAt: new Date().toISOString(),
          businessCancellationReason: reason,
        };

    // Use a transaction to update the user document
    const result = await backendClient
      .transaction()
      .patch(accountId, { set: updateData })
      .commit();

    return NextResponse.json({
      success: true,
      message: `Hủy tài khoản ${type} thành công`,
      result,
    });
  } catch (error) {
    console.error("Error cancelling account:", error);

    // Detailed error logging
    if (error && typeof error === "object") {
      const err = error as {
        message?: string;
        statusCode?: number;
        responseBody?: unknown;
        details?: unknown;
      };
      console.error("Error details:", {
        message: err.message,
        statusCode: err.statusCode,
        responseBody: err.responseBody,
        details: err.details,
      });
    }

    return NextResponse.json(
      {
        error: "Hủy tài khoản thất bại",
        details: error instanceof Error ? error.message : "Lỗi không xác định",
        type: "server_error",
      },
      { status: 500 }
    );
  }
}