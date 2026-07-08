import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 401 });
    }

    const body = await request.json();

    // Here you would update the user settings in your database
    // For now, we'll just return success
    console.log(`Updating settings for user ${userId}:`, body);

    return NextResponse.json({
      success: true,
      message: "Cập nhật cài đặt thành công",
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Lỗi hệ thống nội bộ" },
      { status: 500 }
    );
  }
}