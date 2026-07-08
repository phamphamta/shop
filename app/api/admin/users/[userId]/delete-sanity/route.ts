import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { isUserAdmin } from "@/lib/adminUtils";
import { writeClient } from "@/sanity/lib/client";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // Get authenticated user
    const { userId: currentUserId } = await auth();

    if (!currentUserId) {
      return NextResponse.json(
        { error: "Không có quyền truy cập - Chưa đăng nhập" },
        { status: 401 }
      );
    }

    // Get current user details to check admin status
    const clerk = await clerkClient();
    const currentUser = await clerk.users.getUser(currentUserId);
    const adminEmail = currentUser.primaryEmailAddress?.emailAddress;

    // Check if current user is admin
    if (!adminEmail || !isUserAdmin(adminEmail)) {
      return NextResponse.json(
        { error: "Bị từ chối truy cập - Yêu cầu quyền Quản trị viên" },
        { status: 403 }
      );
    }

    const { userId: targetUserId } = await params;

    // Get target user from Clerk
    const targetUser = await clerk.users.getUser(targetUserId);
    if (!targetUser) {
      return NextResponse.json(
        { error: "Không tìm thấy người dùng này trên Clerk" },
        { status: 404 }
      );
    }

    const userEmail = targetUser.primaryEmailAddress?.emailAddress;
    if (!userEmail) {
      return NextResponse.json(
        { error: "Không tìm thấy email của người dùng" },
        { status: 400 }
      );
    }

    // Check if user exists in Sanity
    const existingUser = await writeClient.fetch(
      `*[_type == "user" && clerkUserId == $clerkUserId][0]`,
      { clerkUserId: targetUserId }
    );

    if (!existingUser) {
      return NextResponse.json(
        { error: "Không tìm thấy người dùng này trên Sanity" },
        { status: 404 }
      );
    }

    // Delete user from Sanity
    await writeClient.delete(existingUser._id);

    return NextResponse.json({
      success: true,
      message: `Người dùng ${targetUser.firstName} ${targetUser.lastName} đã được xóa thành công khỏi Sanity`,
      user: {
        id: targetUserId,
        email: userEmail,
        firstName: targetUser.firstName,
        lastName: targetUser.lastName,
        deleted: true,
      },
    });
  } catch (error) {
    console.error("Error deleting user from Sanity:", error);
    return NextResponse.json(
      { error: "Lỗi hệ thống nội bộ" },
      { status: 500 }
    );
  }
}