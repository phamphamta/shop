"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Mail, Loader2, CheckCircle2, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { checkSubscriptionStatus } from "@/actions/subscriptionActions";

export default function NewsletterSubscription() {
  const { user } = useUser();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const userEmail = user?.emailAddresses?.[0]?.emailAddress;

  useEffect(() => {
    const checkStatus = async () => {
      if (!userEmail) {
        setIsLoading(false);
        return;
      }

      try {
        const status = await checkSubscriptionStatus(userEmail);
        setIsSubscribed(status.subscribed);
      } catch (error) {
        console.error("Lỗi kiểm tra trạng thái đăng ký:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, [userEmail]);

  const handleSubscribe = async () => {
    if (!userEmail) {
      toast.error("Không tìm thấy email");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubscribed(true);
        toast.success(data.message || "Đăng ký bản tin thành công!");
      } else {
        if (data.alreadySubscribed) {
          setIsSubscribed(true);
          toast.info(data.error || "Bạn đã đăng ký trước đó rồi!");
        } else {
          toast.error(data.error || "Đăng ký thất bại");
        }
      }
    } catch (error) {
      console.error("Lỗi khi đăng ký:", error);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUnsubscribe = async () => {
    if (!userEmail) {
      toast.error("Không tìm thấy email");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubscribed(false);
        toast.success(
          data.message || "Đã hủy đăng ký bản tin thành công"
        );
      } else {
        toast.error(data.error || "Hủy đăng ký thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi hủy đăng ký:", error);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="mr-2 h-5 w-5" />
            Đăng ký bản tin
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Mail className="mr-2 h-5 w-5" />
          Đăng ký bản tin
        </CardTitle>
        <CardDescription>
          Quản lý tùy chọn đăng ký bản tin của bạn
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Trạng thái hiện tại */}
        <div className="flex items-center justify-between p-4 rounded-lg border bg-gray-50">
          <div className="flex items-center space-x-3">
            {isSubscribed ? (
              <>
                <div className="shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Đã đăng ký bản tin
                  </p>
                  <p className="text-sm text-gray-600">{userEmail}</p>
                </div>
              </>
            ) : (
              <>
                <div className="shrink-0">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <XCircle className="h-5 w-5 text-gray-500" />
                  </div>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Chưa đăng ký</p>
                  <p className="text-sm text-gray-600">{userEmail}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Phần lợi ích */}
        {!isSubscribed && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 text-sm mb-3">
              Lợi ích khi đăng ký:
            </h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <span className="mr-2">🎁</span>
                <span>Ưu đãi độc quyền & giảm giá lên đến 50%</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">🚀</span>
                <span>Truy cập sớm các sản phẩm mới</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">📦</span>
                <span>Ưu đãi miễn phí vận chuyển</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">💡</span>
                <span>Mẹo mua sắm & xu hướng mới nhất</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">🎂</span>
                <span>Bất ngờ trong ngày sinh nhật</span>
              </li>
            </ul>
          </div>
        )}

        {/* Nút hành động */}
        <div className="pt-2">
          {isSubscribed ? (
            <Button
              variant="outline"
              onClick={handleUnsubscribe}
              disabled={isProcessing}
              className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang hủy...
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Hủy đăng ký bản tin
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleSubscribe}
              disabled={isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang đăng ký...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Đăng ký bản tin
                </>
              )}
            </Button>
          )}
        </div>

        {/* Văn bản thông tin */}
        <p className="text-xs text-gray-500 text-center">
          {isSubscribed
            ? "Bạn có thể đăng ký lại bất cứ lúc nào"
            : "Tham gia cùng 50.000+ người đăng ký và không bao giờ bỏ lỡ ưu đãi"}
        </p>
      </CardContent>
    </Card>
  );
}