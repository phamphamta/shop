import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  getUserAddressesByEmail,
  getUserOrdersByEmail,
} from "@/sanity/queries/emailUserQueries";

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 401 });
    }

    // Get email from query parameters
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Tham số email là bắt buộc" },
        { status: 400 }
      );
    }

    // Fetch user data from Sanity
    const [addresses, orders] = await Promise.all([
      getUserAddressesByEmail(email),
      getUserOrdersByEmail(email),
    ]);

    return NextResponse.json({
      addresses,
      orders,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Lấy dữ liệu người dùng thất bại" },
      { status: 500 }
    );
  }
}