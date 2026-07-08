import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/sanity/lib/backendClient";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 401 });
    }

    const body = await request.json();
    const { clerkUserId, email, firstName, lastName } = body;

    // Check if user request already exists
    const existingRequest = await backendClient.fetch(
      `*[_type == "userAccessRequest" && clerkUserId == $clerkUserId][0]`,
      { clerkUserId }
    );

    if (existingRequest) {
      return NextResponse.json({
        success: false,
        message: "Yêu cầu cấp quyền truy cập đã tồn tại trên hệ thống",
      });
    }

    // Create access request in Sanity
    const accessRequest = await backendClient.create({
      _type: "userAccessRequest",
      clerkUserId,
      email,
      firstName,
      lastName,
      status: "pending",
      requestedAt: new Date().toISOString(),
      approvedAt: null,
      approvedBy: null,
      notes: "",
    });

    return NextResponse.json({
      success: true,
      message: "Gửi yêu cầu cấp quyền truy cập thành công",
      requestId: accessRequest._id,
    });
  } catch (error) {
    console.error("Error creating access request:", error);
    return NextResponse.json(
      { error: "Lỗi hệ thống nội bộ" },
      { status: 500 }
    );
  }
}