import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { isUserAdmin } from "@/lib/adminUtils";
import { writeClient } from "@/sanity/lib/client";

// Disable caching to ensure changes are reflected immediately
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(
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
    const { action } = await req.json(); // "activate" or "deactivate"

    if (!["activate", "deactivate"].includes(action)) {
      return NextResponse.json(
        { error: "Hành động không hợp lệ. Vui lòng dùng 'activate' hoặc 'deactivate'" },
        { status: 400 }
      );
    }

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

    if (action === "activate") {
      if (existingUser) {
        // Update existing user to active
        await writeClient
          .patch(existingUser._id)
          .set({
            isActive: true,
            activatedAt: new Date().toISOString(),
            activatedBy: adminEmail,
            updatedAt: new Date().toISOString(),
          })
          .commit();
      } else {
        // Create new user in Sanity with active status
        await writeClient.create({
          _type: "user",
          clerkUserId: targetUserId,
          email: userEmail,
          firstName: targetUser.firstName || "",
          lastName: targetUser.lastName || "",
          profileImageUrl: targetUser.imageUrl || "",
          isActive: true,
          activatedAt: new Date().toISOString(),
          activatedBy: adminEmail,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          preferences: {
            emailNotifications: true,
            smsNotifications: false,
            newsletter: false,
            preferredCurrency: "USD",
            preferredLanguage: "en",
          },
          loyaltyPoints: 0,
          totalSpent: 0,
          notifications: [],
          wishlist: [],
          cart: [],
          orders: [],
        });
      }

      return NextResponse.json({
        success: true,
        message: `Người dùng ${targetUser.firstName} ${targetUser.lastName} đã được kích hoạt thành công trên Sanity`,
        user: {
          id: targetUserId,
          email: userEmail,
          firstName: targetUser.firstName,
          lastName: targetUser.lastName,
          isActive: true,
        },
      });
    } else {
      // Deactivate user
      if (existingUser) {
        await writeClient
          .patch(existingUser._id)
          .set({
            isActive: false,
            updatedAt: new Date().toISOString(),
          })
          .commit();

        return NextResponse.json({
          success: true,
          message: `Người dùng ${targetUser.firstName} ${targetUser.lastName} đã bị vô hiệu hóa trên Sanity`,
          user: {
            id: targetUserId,
            email: userEmail,
            firstName: targetUser.firstName,
            lastName: targetUser.lastName,
            isActive: false,
          },
        });
      } else {
        return NextResponse.json(
          { error: "Không tìm thấy người dùng này trên Sanity" },
          { status: 404 }
        );
      }
    }
  } catch (error) {
    console.error("Error activating/deactivating user:", error);
    return NextResponse.json(
      { error: "Lỗi hệ thống nội bộ" },
      { status: 500 }
    );
  }
}