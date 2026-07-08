"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  Heart,
  Bell,
  Star,
  TrendingUp,
  Clock,
  ArrowRight,
  User,
  CheckCircle,
  Wallet,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import PremiumBanner from "@/components/ui/premium-banner";
import PremiumBadge from "@/components/ui/premium-badge";
import ApplicationSuccessNotification from "@/components/ui/application-success-notification";
import { toast } from "sonner";

interface UserStats {
  ordersCount: number;
  wishlistCount: number;
  notificationsCount: number;
  unreadNotifications: number;
  rewardPoints: number;
  walletBalance: number;
}

interface RecentActivity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: "order" | "notification" | "wishlist";
}

interface UserProfile {
  _id: string;
  isActive: boolean; // Trạng thái tài khoản Premium
  isBusiness: boolean; // Trạng thái tài khoản Doanh nghiệp
  premiumStatus: "none" | "pending" | "active" | "rejected" | "cancelled";
  businessStatus: "none" | "pending" | "active" | "rejected" | "cancelled";
  membershipType: string;
  firstName?: string;
  lastName?: string;
  businessApprovedBy?: string;
  businessApprovedAt?: string;
  premiumAppliedAt?: string;
  premiumApprovedBy?: string;
  premiumApprovedAt?: string;
  businessAppliedAt?: string;
  rejectionReason?: string;
}

export default function UserDashboardPage() {
  const { user } = useUser();
  const [stats, setStats] = useState<UserStats>({
    ordersCount: 0,
    wishlistCount: 0,
    notificationsCount: 0,
    unreadNotifications: 0,
    rewardPoints: 0,
    walletBalance: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userExists, setUserExists] = useState<boolean>(false);
  const [isApplyingBusiness, setIsApplyingBusiness] = useState<boolean>(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<
    "premium" | "business"
  >("premium");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Tải trạng thái người dùng trước
        const statusResponse = await fetch("/api/user/status");
        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          setUserExists(statusData.userExists);
          setUserProfile(statusData.userProfile);
        }

        // Tải số liệu thống kê tổng quan
        const response = await fetch("/api/user/dashboard/stats");
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setStats(data.stats);
            setRecentActivity(data.recentActivity);
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const handlePremiumRegister = () => {
    setNotificationType("premium");
    setShowSuccessNotification(true);
    setUserExists(true);
  };

  const handleBusinessAccountApply = async () => {
    if (!user?.emailAddresses?.[0]?.emailAddress) {
      toast.error("Không thể lấy email người dùng");
      return;
    }

    setIsApplyingBusiness(true);
    try {
      const response = await fetch("/api/user/business-apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.emailAddresses[0].emailAddress,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setNotificationType("business");
        setShowSuccessNotification(true);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error(
          data.error || "Gửi đơn đăng ký tài khoản doanh nghiệp thất bại"
        );
      }
    } catch (error) {
      console.error("Error applying for business account:", error);
      toast.error("Lỗi khi gửi đơn đăng ký");
    } finally {
      setIsApplyingBusiness(false);
    }
  };

  const handleCancelApplication = async (
    applicationType: "premium" | "business"
  ) => {
    if (!user?.emailAddresses?.[0]?.emailAddress) {
      toast.error("Không thể lấy email người dùng");
      return;
    }

    setIsApplyingBusiness(true);
    try {
      const response = await fetch("/api/user/cancel-application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.emailAddresses[0].emailAddress,
          applicationType,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        window.location.reload();
      } else {
        toast.error(data.error || "Hủy đơn đăng ký thất bại");
      }
    } catch (error) {
      console.error("Error cancelling application:", error);
      toast.error("Lỗi khi hủy đơn đăng ký");
    } finally {
      setIsApplyingBusiness(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "order":
        return <Package className="h-4 w-4 text-blue-500" />;
      case "notification":
        return <Bell className="h-4 w-4 text-purple-500" />;
      case "wishlist":
        return <Heart className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="animate-pulse">
          <div className="space-y-4 mb-8">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-36 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-80 bg-gray-200 rounded-lg"></div>
            <div className="h-80 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Tiêu đề chào mừng */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900">
                  Chào mừng trở lại,{" "}
                  {user?.firstName ||
                    user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] ||
                    "Thành viên"}
                  !
                </h1>
                {userProfile?.isActive && (
                  <PremiumBadge
                    membershipType={userProfile.membershipType}
                    size="md"
                  />
                )}
                {userProfile?.isBusiness && (
                  <div className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    Tài khoản doanh nghiệp
                  </div>
                )}
              </div>
              <p className="text-gray-600 mt-1">
                Dưới đây là cập nhật về tài khoản của bạn hôm nay
              </p>
            </div>
          </div>
        </div>
        <Separator className="my-6" />

        {/* Banner Premium cho người dùng thường */}
        {(!userProfile ||
          (!userProfile.isActive &&
            userProfile.premiumStatus !== "pending" &&
            userProfile.premiumStatus !== "rejected")) && (
            <PremiumBanner
              onRegister={handlePremiumRegister}
              onDismiss={() => { }}
            />
          )}

        {/* Trạng thái đơn đăng ký Premium */}
        {userProfile && userProfile.premiumStatus === "pending" && (
          <div className="mb-6 p-6 bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-400 rounded-lg shadow-sm">
            <div className="flex items-start gap-4">
              <div className="shrink-0">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <Clock className="h-5 w-5 text-amber-600 animate-pulse" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-amber-900 text-lg">
                    🎉 Đã gửi đơn đăng ký Premium!
                  </h3>
                  <div className="px-3 py-1 bg-amber-200 text-amber-800 text-xs font-medium rounded-full">
                    ĐANG CHỜ DUYỆT
                  </div>
                </div>
                <p className="text-amber-800 text-sm mb-3">
                  Tin vui! Đơn đăng ký tài khoản cao cấp của bạn đã được gửi thành công và hiện đang được ban quản trị xét duyệt.
                </p>
                <div className="bg-white/60 p-3 rounded-md border border-amber-200">
                  <h4 className="font-semibold text-amber-900 text-sm mb-2">
                    Điều gì xảy ra tiếp theo?
                  </h4>
                  <ul className="text-amber-700 text-xs space-y-1">
                    <li>
                      • Đội ngũ admin sẽ xem xét yêu cầu của bạn trong vòng 24-48 giờ
                    </li>
                    <li>
                      • Bạn sẽ nhận được thông báo qua email ngay khi trạng thái thay đổi
                    </li>
                    <li>
                      • Sau khi được phê duyệt, các tính năng cao cấp sẽ được kích hoạt ngay lập tức
                    </li>
                  </ul>
                </div>
                {userProfile.premiumAppliedAt && (
                  <p className="text-amber-600 text-xs mt-3">
                    Ngày gửi đơn:{" "}
                    {new Date(userProfile.premiumAppliedAt).toLocaleDateString(
                      "vi-VN",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {userProfile && userProfile.premiumStatus === "rejected" && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-red-900">
                  Đơn đăng ký Premium bị từ chối
                </h3>
                <p className="text-red-700 text-sm">
                  Yêu cầu nâng cấp tài khoản cao cấp của bạn không được phê duyệt. Bạn có thể hủy để gửi lại đơn mới.
                </p>
                {userProfile.rejectionReason && (
                  <p className="text-red-600 text-xs mt-1">
                    Lý do: {userProfile.rejectionReason}
                  </p>
                )}
              </div>
              <Button
                onClick={() => handleCancelApplication("premium")}
                disabled={isApplyingBusiness}
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                Hủy & Đăng ký lại
              </Button>
            </div>
          </div>
        )}

        {/* Trạng thái tài khoản Premium đang hoạt động */}
        {userProfile &&
          userProfile.isActive &&
          userProfile.premiumStatus === "active" &&
          !userProfile.isBusiness && (
            <div className="mb-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400 rounded-lg shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-green-900 text-lg">
                      ✨ Tài khoản Premium đã được kích hoạt!
                    </h3>
                    <div className="px-3 py-1 bg-green-200 text-green-800 text-xs font-medium rounded-full">
                      ĐÃ PHÊ DUYỆT
                    </div>
                  </div>
                  <p className="text-green-800 text-sm mb-3">
                    Xin chúc mừng! Tài khoản cao cấp của bạn hiện đang hoạt động và bạn đã có quyền truy cập vào tất cả các tính năng dành riêng cho Premium.
                  </p>
                  <div className="bg-white/60 p-3 rounded-md border border-green-200">
                    <h4 className="font-semibold text-green-900 text-sm mb-2">
                      Quyền lợi Premium:
                    </h4>
                    <ul className="text-green-700 text-xs space-y-1">
                      <li>• Quyền truy cập độc quyền vào các tính năng nâng cao</li>
                      <li>• Ưu tiên hỗ trợ khách hàng</li>
                      <li>• Tăng điểm thưởng và ưu đãi thành viên</li>
                      <li>• Đủ điều kiện nâng cấp lên Tài khoản Doanh nghiệp</li>
                    </ul>
                  </div>
                  {userProfile.premiumApprovedAt &&
                    userProfile.premiumApprovedBy && (
                      <p className="text-green-600 text-xs mt-3">
                        Được duyệt bởi {userProfile.premiumApprovedBy} vào ngày{" "}
                        {new Date(
                          userProfile.premiumApprovedAt
                        ).toLocaleDateString("vi-VN", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    )}
                </div>
              </div>
            </div>
          )}

        {/* Đăng ký Tài khoản Doanh nghiệp (Chỉ dành cho Premium đã kích hoạt) */}
        {userProfile &&
          userProfile.isActive &&
          !userProfile.isBusiness &&
          userProfile.businessStatus !== "pending" &&
          userProfile.businessStatus !== "rejected" && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Nâng cấp lên Tài khoản doanh nghiệp
                  </h3>
                  <p className="text-blue-700 text-sm mb-3">
                    Nhận thêm 2% giảm giá trên mọi đơn hàng với gói Tài khoản Doanh nghiệp của chúng tôi. Giải pháp hoàn hảo cho các công ty và đơn hàng số lượng lớn.
                  </p>
                  <ul className="text-blue-600 text-sm space-y-1 mb-4">
                    <li>• Giảm giá thêm 2% cho tất cả đơn hàng</li>
                    <li>• Ưu tiên hỗ trợ khách hàng tối đa</li>
                    <li>• Quản lý đơn hàng số lượng lớn</li>
                    <li>• Hỗ trợ xuất hóa đơn doanh nghiệp</li>
                  </ul>
                </div>
                <Button
                  onClick={handleBusinessAccountApply}
                  disabled={isApplyingBusiness}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isApplyingBusiness ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang đăng ký...
                    </div>
                  ) : (
                    "Đăng ký Tài khoản doanh nghiệp"
                  )}
                </Button>
              </div>
            </div>
          )}

        {/* Trạng thái đơn đăng ký Doanh nghiệp */}
        {userProfile && userProfile.businessStatus === "pending" && (
          <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 rounded-lg shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="h-5 w-5 text-blue-600 animate-pulse" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-blue-900 text-lg">
                    🚀 Đã gửi đơn đăng ký Doanh nghiệp!
                  </h3>
                  <div className="px-3 py-1 bg-blue-200 text-blue-800 text-xs font-medium rounded-full">
                    ĐANG CHỜ DUYỆT
                  </div>
                </div>
                <p className="text-blue-800 text-sm mb-3">
                  Tuyệt vời! Đơn đăng ký tài khoản doanh nghiệp của bạn đã được gửi thành công và đang được ban quản trị xem xét.
                </p>
                <div className="bg-white/60 p-3 rounded-md border border-blue-200">
                  <h4 className="font-semibold text-blue-900 text-sm mb-2">
                    Quyền lợi tài khoản doanh nghiệp (Sau khi duyệt):
                  </h4>
                  <ul className="text-blue-700 text-xs space-y-1">
                    <li>• Giảm giá thêm 2% cho tất cả đơn hàng</li>
                    <li>• Ưu tiên hỗ trợ khách hàng tối đa</li>
                    <li>• Quản lý đơn hàng số lượng lớn dễ dàng</li>
                    <li>• Tính năng xuất hóa đơn doanh nghiệp chuyên nghiệp</li>
                  </ul>
                </div>
                {userProfile.businessAppliedAt && (
                  <p className="text-blue-600 text-xs mt-3">
                    Ngày gửi đơn:{" "}
                    {new Date(userProfile.businessAppliedAt).toLocaleDateString(
                      "vi-VN",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Trạng thái tài khoản Doanh nghiệp đang hoạt động */}
        {userProfile &&
          userProfile.isBusiness &&
          userProfile.businessStatus === "active" && (
            <div className="mb-6 p-6 bg-gradient-to-r from-emerald-50 to-green-50 border-l-4 border-emerald-400 rounded-lg shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-emerald-900 text-lg">
                      💼 Tài khoản Doanh nghiệp đã kích hoạt!
                    </h3>
                    <div className="px-3 py-1 bg-emerald-200 text-emerald-800 text-xs font-medium rounded-full">
                      ĐÃ PHÊ DUYỆT
                    </div>
                  </div>
                  <p className="text-emerald-800 text-sm mb-3">
                    Tuyệt vời! Tài khoản doanh nghiệp của bạn đã hoạt động. Giờ đây bạn có thể tận hưởng các đặc quyền doanh nghiệp độc quyền.
                  </p>
                  <div className="bg-white/60 p-3 rounded-md border border-emerald-200">
                    <h4 className="font-semibold text-emerald-900 text-sm mb-2">
                      Quyền lợi doanh nghiệp hiện tại:
                    </h4>
                    <ul className="text-emerald-700 text-xs space-y-1">
                      <li>
                        • Tự động áp dụng giảm giá thêm 2% khi thanh toán đơn hàng
                      </li>
                      <li>• Ưu tiên hỗ trợ khách hàng cao nhất</li>
                      <li>• Quản lý đơn hàng sỉ nâng cao</li>
                      <li>• Xuất hóa đơn thương mại chuyên nghiệp</li>
                    </ul>
                  </div>
                  {userProfile.businessApprovedAt &&
                    userProfile.businessApprovedBy && (
                      <p className="text-emerald-600 text-xs mt-3">
                        Được duyệt bởi {userProfile.businessApprovedBy} vào ngày{" "}
                        {new Date(
                          userProfile.businessApprovedAt
                        ).toLocaleDateString("vi-VN", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    )}
                </div>
              </div>
            </div>
          )}

        {userProfile && userProfile.businessStatus === "rejected" && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-red-900">
                  Đơn đăng ký doanh nghiệp bị từ chối
                </h3>
                <p className="text-red-700 text-sm">
                  Yêu cầu tài khoản doanh nghiệp của bạn không được phê duyệt. Bạn có thể hủy để gửi lại đơn mới.
                </p>
                {userProfile.rejectionReason && (
                  <p className="text-red-600 text-xs mt-1">
                    Lý do: {userProfile.rejectionReason}
                  </p>
                )}
              </div>
              <Button
                onClick={() => handleCancelApplication("business")}
                disabled={isApplyingBusiness}
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                Hủy & Đăng ký lại
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Các thẻ thống kê số liệu */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium">Tổng số đơn hàng</CardTitle>
            <Package className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">{stats.ordersCount}</div>
            <p className="text-xs text-blue-100">Đơn hàng đã đặt</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium">Thông báo</CardTitle>
            <Bell className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">
              {stats.notificationsCount}
            </div>
            <p className="text-xs text-purple-100">
              {stats.unreadNotifications} chưa đọc
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium">Danh sách yêu thích</CardTitle>
            <Heart className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">{stats.wishlistCount}</div>
            <p className="text-xs text-red-100">Sản phẩm đã lưu</p>
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium">Điểm thưởng tích lũy</CardTitle>
            <Star className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">{stats.rewardPoints}</div>
            <p className="text-xs text-green-100">Điểm hiện có khả dụng</p>
          </CardContent>
        </Card>

        {stats.walletBalance > 0 && (
          <Card className="bg-linear-to-br from-emerald-500 to-teal-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium">
                Số dư ví
              </CardTitle>
              <Wallet className="h-5 w-5" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">
                ${stats.walletBalance.toFixed(2)}
              </div>
              <p className="text-xs text-emerald-100">Từ tiền hoàn lại</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Khu vực nội dung chi tiết */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hoạt động gần đây */}
        <Card className="shadow-lg border-0">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-gray-600" />
                <CardTitle className="text-lg">Hoạt động gần đây</CardTitle>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/user/notifications">
                  Xem tất cả
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <CardDescription>Các hoạt động tài khoản mới nhất của bạn</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {recentActivity.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">Không có hoạt động gần đây</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.slice(0, 5).map((activity, index) => (
                  <div key={activity.id}>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 leading-tight">
                          {activity.title}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatTimeAgo(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                    {index < recentActivity.slice(0, 5).length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Thao tác nhanh */}
        <Card className="shadow-lg border-0 h-fit">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-gray-600" />
              <CardTitle className="text-lg">Thao tác nhanh</CardTitle>
            </div>
            <CardDescription>Các tính năng thường dùng</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 gap-3">
              <Link href="/user/orders">
                <Button
                  variant="outline"
                  className="w-full justify-start h-12 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                >
                  <Package className="mr-3 h-4 w-4 text-blue-500" />
                  <span className="font-medium">Xem đơn hàng</span>
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Button>
              </Link>

              <Link href="/user/notifications">
                <Button
                  variant="outline"
                  className="w-full justify-start h-12 hover:bg-purple-50 hover:border-purple-200 transition-colors"
                >
                  <Bell className="mr-3 h-4 w-4 text-purple-500" />
                  <span className="font-medium">Trung tâm thông báo</span>
                  {stats.unreadNotifications > 0 && (
                    <Badge variant="destructive" className="ml-auto">
                      {stats.unreadNotifications}
                    </Badge>
                  )}
                  {stats.unreadNotifications === 0 && (
                    <ArrowRight className="ml-auto h-4 w-4" />
                  )}
                </Button>
              </Link>

              <Link href="/wishlist">
                <Button
                  variant="outline"
                  className="w-full justify-start h-12 hover:bg-red-50 hover:border-red-200 transition-colors"
                >
                  <Heart className="mr-3 h-4 w-4 text-red-500" />
                  <span className="font-medium">Danh sách yêu thích</span>
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Button>
              </Link>

              <Link href="/user/profile">
                <Button
                  variant="outline"
                  className="w-full justify-start h-12 hover:bg-green-50 hover:border-green-200 transition-colors"
                >
                  <User className="mr-3 h-4 w-4 text-green-500" />
                  <span className="font-medium">Cài đặt hồ sơ</span>
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Thông báo đăng ký thành công */}
      <ApplicationSuccessNotification
        isVisible={showNotification}
        onClose={() => setShowNotification(false)}
        type={notificationType}
      />
    </div>
  );
}