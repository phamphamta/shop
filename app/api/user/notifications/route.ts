import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import {
  getUserNotifications,
  markNotificationAsRead,
  deleteUserNotification,
} from "@/sanity/queries/userQueries";

interface UserNotification {
  sentAt: string;
  read: boolean;
}

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 401 });
    }

    const notifications = await getUserNotifications(user.id);

    // Sort notifications by date (newest first)
    const sortedNotifications = notifications.sort(
      (a: UserNotification, b: UserNotification) =>
        new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
    );

    return NextResponse.json({
      success: true,
      notifications: sortedNotifications,
      unreadCount: notifications.filter((n: UserNotification) => !n.read)
        .length,
    });
  } catch (error) {
    console.error("Error fetching user notifications:", error);
    return NextResponse.json(
      { error: "Không thể lấy danh sách thông báo" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 401 });
    }

    const { notificationId } = await request.json();

    if (!notificationId) {
      return NextResponse.json(
        { error: "Yêu cầu cung cấp ID của thông báo" },
        { status: 400 }
      );
    }

    const result = await markNotificationAsRead(user.id, notificationId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return NextResponse.json(
      { error: "Không thể đánh dấu thông báo là đã đọc" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get("id");

    if (!notificationId) {
      return NextResponse.json(
        { error: "Yêu cầu cung cấp ID của thông báo" },
        { status: 400 }
      );
    }

    const result = await deleteUserNotification(user.id, notificationId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json(
      { error: "Không thể xóa thông báo" },
      { status: 500 }
    );
  }
}