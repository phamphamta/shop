import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { client } from "@/sanity/lib/client";
import { isUserAdmin } from "@/lib/adminUtils";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 401 });
    }

    // Check if user is admin (you may need to adjust this based on your admin check)
    // For now, we'll fetch the user and check
    const user = await client.fetch(
      `*[_type == "user" && clerkUserId == $userId][0]`,
      { userId }
    );

    if (!user) {
      return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 401 });
    }

    // Check if admin using the helper function
    const isAdmin = isUserAdmin(user.email);
    if (!isAdmin) {
      return NextResponse.json({ error: "Bị từ chối truy cập" }, { status: 403 });
    }

    // Fetch all subscriptions
    const subscriptions = await client.fetch(
      `*[_type == "subscription"] | order(subscribedAt desc) {
        _id,
        email,
        status,
        subscribedAt,
        unsubscribedAt,
        source,
        ipAddress,
        userAgent
      }`
    );

    return NextResponse.json(
      {
        subscriptions,
        total: subscriptions.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json(
      { error: "Không thể tải danh sách gói đăng ký" },
      { status: 500 }
    );
  }
}