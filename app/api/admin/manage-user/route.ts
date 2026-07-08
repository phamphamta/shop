import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { writeClient, client } from "@/sanity/lib/client";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 401 });
    }

    const { email, setPremium } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email là bắt buộc" }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await client.fetch(
      `*[_type == "userType" && email == $email][0]`,
      { email }
    );

    if (existingUser) {
      // Update existing user
      const result = await writeClient
        .patch(existingUser._id)
        .set({
          isActive: setPremium || existingUser.isActive,
          updatedAt: new Date().toISOString(),
        })
        .commit();

      return NextResponse.json({
        success: true,
        message: `Cập nhật trạng thái premium của người dùng thành: ${setPremium ? "Kích hoạt" : "Vô hiệu hóa"
          }`,
        user: result,
      });
    } else {
      // Create new user
      const newUser = await writeClient.create({
        _type: "userType",
        email,
        isActive: setPremium || true, // Default to premium
        isBusiness: false,
        membershipType: setPremium ? "premium" : "standard",
        activatedAt: new Date().toISOString(),
        activatedBy: "admin-creation",
        rewardPoints: 0,
        loyaltyPoints: setPremium ? 100 : 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        preferences: {
          newsletter: true,
          emailNotifications: true,
          smsNotifications: false,
          preferredCurrency: "USD",
          preferredLanguage: "en",
        },
      });

      return NextResponse.json({
        success: true,
        message: "Người dùng mới đã được tạo thành công với trạng thái premium",
        user: newUser,
      });
    }
  } catch (error) {
    console.error("Error managing user:", error);
    return NextResponse.json(
      { error: "Quản lý người dùng thất bại" },
      { status: 500 }
    );
  }
}