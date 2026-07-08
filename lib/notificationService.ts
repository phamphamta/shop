import { writeClient } from "@/sanity/lib/client";
import { v4 as uuidv4 } from "uuid";

export type NotificationType =
  | "promo"
  | "order"
  | "system"
  | "marketing"
  | "general";
export type NotificationPriority = "low" | "medium" | "high" | "urgent";

interface CreateNotificationParams {
  clerkUserId: string;
  title: string;
  message: string;
  type: NotificationType;
  priority?: NotificationPriority;
  actionUrl?: string;
  sentBy?: string;
}

interface OrderStatusNotificationParams {
  clerkUserId: string;
  orderNumber: string;
  orderId: string;
  status: string;
  previousStatus?: string;
}

/**
 * Creates a notification for a user in Sanity
 */
export const createNotification = async (params: CreateNotificationParams) => {
  try {
    const {
      clerkUserId,
      title,
      message,
      type,
      priority = "medium",
      actionUrl,
      sentBy = "System",
    } = params;

    // Fetch the user from Sanity
    const user = await writeClient.fetch(
      `*[_type == "user" && clerkUserId == $clerkUserId][0]`,
      { clerkUserId }
    );

    if (!user) {
      console.error("User not found:", clerkUserId);
      return { success: false, error: "User not found" };
    }

    // Create the notification object
    const notification = {
      id: uuidv4(),
      title,
      message,
      type,
      read: false,
      priority,
      sentAt: new Date().toISOString(),
      sentBy,
      ...(actionUrl && { actionUrl }),
    };

    // Get existing notifications or initialize empty array
    const existingNotifications = user.notifications || [];

    // Add new notification to the beginning of the array
    const updatedNotifications = [notification, ...existingNotifications];

    // Update the user document with the new notification
    await writeClient
      .patch(user._id)
      .set({ notifications: updatedNotifications })
      .commit();

    return { success: true, notification };
  } catch (error) {
    console.error("Error creating notification:", error);
    return { success: false, error: "Failed to create notification" };
  }
};

/**
 * Get notification message based on order status
 */
const getOrderStatusMessage = (
  status: string,
  orderNumber: string,
  previousStatus?: string
): { title: string; message: string; priority: NotificationPriority } => {
  switch (status.toLowerCase()) {
    case "pending":
      return {
        title: "Đơn hàng đã được tiếp nhận ✅",
        message: `Cảm ơn bạn đã đặt hàng, mã đơn #${orderNumber}! Chúng tôi đã tiếp nhận đơn hàng và sẽ sớm xác nhận.`,
        priority: "medium",
      };
    case "address_confirmed":
      return {
        title: "Địa chỉ đã được xác nhận",
        message: `Địa chỉ giao hàng cho đơn hàng #${orderNumber} đã được xác nhận. Chúng tôi đang tiến hành xử lý đơn hàng của bạn.`,
        priority: "medium",
      };
    case "order_confirmed":
      return {
        title: "Đơn hàng đã được xác nhận ✅",
        message: `Tin vui đây! Đơn hàng #${orderNumber} của bạn đã được xác nhận và sẽ sớm được đóng gói.`,
        priority: "high",
      };
    case "packed":
      return {
        title: "Đơn hàng đã đóng gói 📦",
        message: `Đơn hàng #${orderNumber} của bạn đã được đóng gói cẩn thận và sẽ sớm được bàn giao cho đơn vị vận chuyển.`,
        priority: "high",
      };
    case "ready_for_delivery":
      return {
        title: "Sẵn sàng giao hàng",
        message: `Đơn hàng #${orderNumber} đã sẵn sàng để đi giao và đã được bàn giao cho đối tác vận chuyển của chúng tôi.`,
        priority: "high",
      };
    case "processing":
      return {
        title: "Đơn hàng đang được xử lý",
        message: `Tin vui đây! Đơn hàng #${orderNumber} của bạn hiện đang được xử lý. Chúng tôi đang chuẩn bị các sản phẩm của bạn để gửi đi.`,
        priority: "medium",
      };
    case "paid":
      return {
        title: "Xác nhận thanh toán thành công ✅",
        message: `Thanh toán cho đơn hàng #${orderNumber} đã được xác nhận thành công. Đơn hàng của bạn sẽ được xử lý trong giây lát.`,
        priority: "high",
      };
    case "shipped":
      return {
        title: "Đơn hàng đang được giao! 🚚",
        message: `Tin cực vui! Đơn hàng #${orderNumber} của bạn đã được gửi đi và đang trên đường tới chỗ bạn. Bạn có thể theo dõi kiện hàng bằng thông tin tra cứu đơn vận.`,
        priority: "high",
      };
    case "out_for_delivery":
      return {
        title: "Đơn hàng sắp được giao đến ",
        message: `Đơn hàng #${orderNumber} của bạn đang được shipper đi giao! Đơn hàng dự kiến sẽ đến tay bạn trong hôm nay. Vui lòng chú ý điện thoại để nhận hàng.`,
        priority: "urgent",
      };
    case "delivered":
      return {
        title: "Giao hàng thành công! 🎉",
        message: `Đơn hàng #${orderNumber} của bạn đã được giao thành công. Hy vọng bạn sẽ yêu thích sản phẩm đã mua! Hãy để lại đánh giá nếu bạn cảm thấy hài lòng nhé.`,
        priority: "high",
      };
    case "completed":
      return {
        title: "Đơn hàng hoàn thành",
        message: `Đơn hàng #${orderNumber} đã được hoàn thành. Cảm ơn bạn đã mua sắm cùng chúng tôi!`,
        priority: "medium",
      };
    case "cancelled":
      return {
        title: "Đơn hàng đã hủy",
        message: `Đơn hàng #${orderNumber} của bạn đã bị hủy. Nếu bạn không yêu cầu hủy đơn này hoặc có bất kỳ thắc mắc nào, vui lòng liên hệ với đội ngũ hỗ trợ của chúng tôi.`,
        priority: "urgent",
      };
    case "rescheduled":
      return {
        title: "Thay đổi lịch giao hàng",
        message: `Lịch giao hàng cho đơn hàng #${orderNumber} đã được thay đổi. Chúng tôi sẽ liên tục cập nhật cho bạn về ngày giao hàng mới.`,
        priority: "high",
      };
    case "failed_delivery":
      return {
        title: "Giao hàng không thành công",
        message: `Chúng tôi đã không thể giao đơn hàng #${orderNumber} đến bạn. Đội ngũ của chúng tôi sẽ liên hệ lại để hẹn lịch giao hàng mới.`,
        priority: "urgent",
      };
    default:
      return {
        title: "Cập nhật trạng thái đơn hàng",
        message: `Trạng thái đơn hàng #${orderNumber} của bạn đã được cập nhật thành: ${status}.`,
        priority: "medium",
      };
  }
};

/**
 * Send order status notification to user
 */
export const sendOrderStatusNotification = async (
  params: OrderStatusNotificationParams
) => {
  try {
    const { clerkUserId, orderNumber, orderId, status, previousStatus } =
      params;

    const { title, message, priority } = getOrderStatusMessage(
      status,
      orderNumber,
      previousStatus
    );

    // Get base URL from environment or fallback to localhost
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const actionUrl = `${baseUrl}/user/orders/${orderId}`;

    const result = await createNotification({
      clerkUserId,
      title,
      message,
      type: "order",
      priority,
      actionUrl,
      sentBy: "ShopCart System",
    });

    return result;
  } catch (error) {
    console.error("Error sending order status notification:", error);
    return { success: false, error: "Failed to send notification" };
  }
};

/**
 * Send bulk notifications to multiple users
 */
export const sendBulkNotifications = async (
  userIds: string[],
  notificationData: Omit<CreateNotificationParams, "clerkUserId">
) => {
  try {
    const results = await Promise.allSettled(
      userIds.map((userId) =>
        createNotification({
          clerkUserId: userId,
          ...notificationData,
        })
      )
    );

    const successful = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    return {
      success: true,
      total: userIds.length,
      successful,
      failed,
    };
  } catch (error) {
    console.error("Error sending bulk notifications:", error);
    return { success: false, error: "Failed to send bulk notifications" };
  }
};