"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import {
  Bell,
  Info,
  Package,
  ShoppingCart,
  Gift,
  Settings,
  ExternalLink,
  Clock,
  Trash2,
  Eye,
  X,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Link from "next/link";
import { toast } from "sonner";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "promo" | "order" | "system" | "marketing" | "general";
  read: boolean;
  priority: "low" | "medium" | "high" | "urgent";
  sentAt: string;
  readAt?: string;
  sentBy?: string;
  actionUrl?: string;
}

const NOTIFICATIONS_PER_PAGE = 10;

export default function UserNotificationsPage() {
  const { user } = useUser();
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>(
    []
  );
  const [isDeletingBulk, setIsDeletingBulk] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/user/notifications");
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const allNotifs = data.notifications || [];
          setAllNotifications(allNotifs);
          setUnreadCount(data.unreadCount || 0);
          setTotalPages(Math.ceil(allNotifs.length / NOTIFICATIONS_PER_PAGE));

          // Lấy thông báo theo phân trang
          const startIndex = (currentPage - 1) * NOTIFICATIONS_PER_PAGE;
          const endIndex = startIndex + NOTIFICATIONS_PER_PAGE;
          setNotifications(allNotifs.slice(startIndex, endIndex));
        }
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Không thể tải danh sách thông báo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Cập nhật thông báo hiển thị khi thay đổi trang
  useEffect(() => {
    const startIndex = (currentPage - 1) * NOTIFICATIONS_PER_PAGE;
    const endIndex = startIndex + NOTIFICATIONS_PER_PAGE;
    setNotifications(allNotifications.slice(startIndex, endIndex));
  }, [currentPage, allNotifications]);

  const openNotificationDetails = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsSidebarOpen(true);

    // Đánh dấu là đã đọc khi mở
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch("/api/user/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notificationId }),
      });

      if (response.ok) {
        const updatedNotifs = allNotifications.map((notification) =>
          notification.id === notificationId
            ? {
              ...notification,
              read: true,
              readAt: new Date().toISOString(),
            }
            : notification
        );
        setAllNotifications(updatedNotifs);
        setUnreadCount((prev) => Math.max(0, prev - 1));

        // Cập nhật thông báo đang chọn nếu trùng id
        if (selectedNotification?.id === notificationId) {
          setSelectedNotification((prev) =>
            prev
              ? { ...prev, read: true, readAt: new Date().toISOString() }
              : null
          );
        }
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(
        `/api/user/notifications?id=${notificationId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        const updatedNotifs = allNotifications.filter(
          (notification) => notification.id !== notificationId
        );
        setAllNotifications(updatedNotifs);
        setTotalPages(Math.ceil(updatedNotifs.length / NOTIFICATIONS_PER_PAGE));

        const notification = allNotifications.find(
          (n) => n.id === notificationId
        );
        if (notification && !notification.read) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }

        // Đóng sidebar nếu thông báo bị xóa đang được chọn
        if (selectedNotification?.id === notificationId) {
          setIsSidebarOpen(false);
          setSelectedNotification(null);
        }

        // Loại bỏ khỏi danh sách được chọn nếu có
        setSelectedNotifications((prev) =>
          prev.filter((id) => id !== notificationId)
        );

        toast.success("Đã xóa thông báo");
      } else {
        toast.error("Xóa thông báo thất bại");
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Xóa thông báo thất bại");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedNotifications.length === 0) {
      toast.error("Chưa chọn thông báo nào");
      return;
    }

    setIsDeletingBulk(true);
    try {
      const deletePromises = selectedNotifications.map((id) =>
        fetch(`/api/user/notifications?id=${id}`, { method: "DELETE" })
      );

      const results = await Promise.all(deletePromises);
      const successCount = results.filter((r) => r.ok).length;

      if (successCount > 0) {
        const updatedNotifs = allNotifications.filter(
          (notification) => !selectedNotifications.includes(notification.id)
        );
        setAllNotifications(updatedNotifs);
        setTotalPages(Math.ceil(updatedNotifs.length / NOTIFICATIONS_PER_PAGE));

        // Cập nhật số lượng chưa đọc
        const deletedUnreadCount = allNotifications.filter(
          (n) => selectedNotifications.includes(n.id) && !n.read
        ).length;
        setUnreadCount((prev) => Math.max(0, prev - deletedUnreadCount));

        setSelectedNotifications([]);
        toast.success(`Đã xóa thành công ${successCount} thông báo`);

        // Điều chỉnh trang nếu cần thiết
        if (
          notifications.length === selectedNotifications.length &&
          currentPage > 1
        ) {
          setCurrentPage(currentPage - 1);
        }
      }

      if (results.length > successCount) {
        toast.error(
          `Xóa thất bại ${results.length - successCount} thông báo`
        );
      }
    } catch (error) {
      console.error("Error deleting notifications:", error);
      toast.error("Lỗi khi thực hiện xóa hàng loạt");
    } finally {
      setIsDeletingBulk(false);
    }
  };

  const toggleNotificationSelection = (notificationId: string) => {
    setSelectedNotifications((prev) =>
      prev.includes(notificationId)
        ? prev.filter((id) => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const toggleSelectAll = () => {
    if (
      selectedNotifications.length === notifications.length &&
      notifications.length > 0
    ) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(notifications.map((n) => n.id));
    }
  };

  const getNotificationIcon = (type: string) => {
    const iconClass = "h-5 w-5";
    switch (type) {
      case "order":
        return <Package className={`${iconClass} text-blue-600`} />;
      case "promo":
        return <Gift className={`${iconClass} text-purple-600`} />;
      case "marketing":
        return <ShoppingCart className={`${iconClass} text-green-600`} />;
      case "system":
        return <Settings className={`${iconClass} text-gray-600`} />;
      case "general":
      default:
        return <Info className={`${iconClass} text-blue-600`} />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "order":
        return "bg-blue-100 text-blue-800";
      case "promo":
        return "bg-purple-100 text-purple-800";
      case "marketing":
        return "bg-green-100 text-green-800";
      case "system":
        return "bg-gray-100 text-gray-800";
      case "general":
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return (
          <Badge variant="destructive" className="text-xs">
            Khẩn cấp
          </Badge>
        );
      case "high":
        return (
          <Badge className="bg-orange-500 hover:bg-orange-600 text-xs">
            Cao
          </Badge>
        );
      case "medium":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600 text-xs">
            Trung bình
          </Badge>
        );
      case "low":
      default:
        return (
          <Badge variant="secondary" className="text-xs">
            Thấp
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Vừa xong";
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    if (diffInMinutes < 10080)
      return `${Math.floor(diffInMinutes / 1440)} ngày trước`;

    return date.toLocaleDateString("vi-VN");
  };

  const truncateMessage = (message: string, maxLength: number = 100) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
        </div>
        <div className="space-y-4">
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <Skeleton className="h-6 w-6 rounded" />
                      <div className="flex-1">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-32 mt-2" />
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4 mt-2" />
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Thông báo</h1>
            <div className="text-gray-600 flex items-center gap-2">
              <span>Cập nhật các hoạt động mới nhất về tài khoản của bạn</span>
              {unreadCount > 0 && (
                <Badge variant="destructive">{unreadCount} chưa đọc</Badge>
              )}
            </div>
          </div>
          <Button
            onClick={fetchNotifications}
            variant="outline"
            size="sm"
            disabled={loading}
          >
            <Bell className="h-4 w-4 mr-2" />
            Làm mới
          </Button>
        </div>

        {allNotifications.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Bell className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Không có thông báo nào
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Tuyệt vời! Bạn đã đọc hết tất cả thông báo. Hãy quay lại sau nhé.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Thao tác hàng loạt */}
            {selectedNotifications.length > 0 && (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      Đang chọn {selectedNotifications.length} thông báo
                    </p>
                    <div className="flex item-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedNotifications([])}
                      >
                        Bỏ chọn
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleBulkDelete}
                        disabled={isDeletingBulk}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {isDeletingBulk ? "Đang xóa..." : "Xóa mục đã chọn"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Chọn tất cả */}
            <div className="flex items-center gap-3 px-1">
              <Checkbox
                id="select-all"
                checked={
                  selectedNotifications.length === notifications.length &&
                  notifications.length > 0
                }
                onCheckedChange={toggleSelectAll}
              />
              <label
                htmlFor="select-all"
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                Chọn tất cả trên trang này
              </label>
            </div>

            <div className="grid gap-3">
              {notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`hover:shadow-md transition-shadow ${!notification.read
                    ? "border-l-4 border-l-blue-500 bg-blue-50/20"
                    : ""
                    } ${selectedNotifications.includes(notification.id)
                      ? "ring-2 ring-blue-500"
                      : ""
                    }`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <Checkbox
                          checked={selectedNotifications.includes(
                            notification.id
                          )}
                          onCheckedChange={() =>
                            toggleNotificationSelection(notification.id)
                          }
                          className="mt-1"
                        />
                        <div className="mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <CardTitle className="text-base font-semibold">
                              {notification.title}
                            </CardTitle>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge
                              className={`text-xs ${getNotificationColor(
                                notification.type
                              )}`}
                            >
                              {notification.type}
                            </Badge>
                            {getPriorityBadge(notification.priority)}
                            <span className="text-xs text-gray-500 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDate(notification.sentAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                          className="text-gray-400 hover:text-red-600 h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 pb-3">
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3 ml-10">
                      {truncateMessage(notification.message)}
                    </p>
                    <div className="ml-10">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openNotificationDetails(notification)}
                        className="w-full sm:w-auto"
                      >
                        Xem chi tiết
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Phân trang */}
            {totalPages > 1 && (
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Trang {currentPage} trên {totalPages} (Tổng số{" "}
                      {allNotifications.length} thông báo)
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Trước
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(totalPages, prev + 1)
                          )
                        }
                        disabled={currentPage === totalPages}
                      >
                        Sau
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>

      {/* Sidebar chi tiết thông báo */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {selectedNotification && (
            <>
              <SheetHeader>
                <div className="flex items-start gap-3">
                  {getNotificationIcon(selectedNotification.type)}
                  <div className="flex-1 min-w-0">
                    <SheetTitle className="text-xl mb-2">
                      {selectedNotification.title}
                    </SheetTitle>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        className={`text-xs ${getNotificationColor(
                          selectedNotification.type
                        )}`}
                      >
                        {selectedNotification.type}
                      </Badge>
                      {getPriorityBadge(selectedNotification.priority)}
                      {selectedNotification.read ? (
                        <Badge variant="outline" className="text-xs">
                          Đã đọc
                        </Badge>
                      ) : (
                        <Badge className="text-xs bg-blue-500">Chưa đọc</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </SheetHeader>

              <div className="mt-6 space-y-6 px-5">
                {/* Dữ liệu bổ sung */}
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="font-medium mr-2">Đã gửi:</span>
                    <span>{formatDate(selectedNotification.sentAt)}</span>
                  </div>
                  {selectedNotification.sentBy && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Info className="h-4 w-4 mr-2" />
                      <span className="font-medium mr-2">Gửi bởi:</span>
                      <span>{selectedNotification.sentBy}</span>
                    </div>
                  )}
                  {selectedNotification.read && selectedNotification.readAt && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Eye className="h-4 w-4 mr-2" />
                      <span className="font-medium mr-2">Đã đọc lúc:</span>
                      <span>{formatDate(selectedNotification.readAt)}</span>
                    </div>
                  )}
                </div>

                {/* Nội dung thông báo */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    Nội dung
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {selectedNotification.message}
                    </p>
                  </div>
                </div>

                {/* Nút hành động nhanh */}
                {selectedNotification.actionUrl && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">
                      Hành động nhanh
                    </h3>
                    <Button
                      asChild
                      className="w-full"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <Link
                        href={selectedNotification.actionUrl}
                        target={
                          selectedNotification.actionUrl.startsWith("http")
                            ? "_blank"
                            : undefined
                        }
                        rel={
                          selectedNotification.actionUrl.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className="flex items-center justify-center"
                      >
                        {selectedNotification.actionUrl.startsWith("http") ? (
                          <>
                            Mở liên kết
                            <ExternalLink className="h-4 w-4 ml-2" />
                          </>
                        ) : (
                          <>
                            Đi đến trang
                            <ChevronRight className="h-4 w-4 ml-2" />
                          </>
                        )}
                      </Link>
                    </Button>
                  </div>
                )}

                {/* Các thao tác xử lý */}
                <div className="flex gap-2 pt-4 border-t">
                  {!selectedNotification.read && (
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        markAsRead(selectedNotification.id);
                        toast.success("Đã đánh dấu là đã đọc");
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Đánh dấu đã đọc
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      deleteNotification(selectedNotification.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}