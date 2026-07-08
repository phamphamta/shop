import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/sanity/lib/backendClient";

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 401 });
    }

    const body = await request.json();
    const { firstName, lastName, phone, dateOfBirth, clerkUserId } = body;

    // Update or create user in Sanity
    const sanityUser = {
      _type: "user",
      clerkUserId: clerkUserId || userId,
      email: "", // We'll get this from Clerk
      firstName,
      lastName,
      phone,
      dateOfBirth,
      updatedAt: new Date().toISOString(),
    };

    // Check if user exists in Sanity
    const existingUser = await backendClient.fetch(
      `*[_type == "user" && clerkUserId == $clerkUserId][0]`,
      { clerkUserId: clerkUserId || userId }
    );

    let result;
    if (existingUser) {
      // Update existing user
      result = await backendClient
        .patch(existingUser._id)
        .set({
          firstName,
          lastName,
          phone,
          dateOfBirth,
          updatedAt: new Date().toISOString(),
        })
        .commit();
    } else {
      // Create new user
      result = await backendClient.create({
        ...sanityUser,
        createdAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      message: "Cập nhật thông tin cá nhân thành công",
      user: result,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Lỗi hệ thống nội bộ" },
      { status: 500 }
    );
  }
}