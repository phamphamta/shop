"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  CreditCard,
  Loader2,
  CheckCircle2,
  XCircle,
  Wallet,
  Lock,
  ArrowLeft,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PriceFormatter from "@/components/PriceFormatter";
import { toast } from "sonner";

export default function ClerkPaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useUser();

  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("order_id");
  const orderNumber = searchParams.get("orderNumber");
  const amount = parseFloat(searchParams.get("amount") || "0");

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "processing" | "success" | "failed"
  >("pending");

  useEffect(() => {
    if (!sessionId || !orderId || !orderNumber) {
      toast.error("Phiên thanh toán không hợp lệ");
      router.push("/cart");
    }
  }, [sessionId, orderId, orderNumber, router]);

  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentStatus("processing");

    try {
      // Giả lập xử lý thanh toán (2 giây)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Cập nhật đơn hàng với chi tiết thanh toán Clerk qua API
      const response = await fetch("/api/checkout/clerk/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          sessionId,
          status: "completed",
        }),
      });

      if (!response.ok) {
        throw new Error("Không thể hoàn tất thanh toán");
      }

      const result = await response.json();

      setPaymentStatus("success");
      toast.success("Thanh toán thành công! 🎉", {
        description: "Đơn hàng của bạn đã được thanh toán thành công",
      });

      // Chuyển hướng đến trang thành công sau một khoảng trì hoãn ngắn
      setTimeout(() => {
        router.push(
          `/success?session_id=${sessionId}&order_id=${orderId}&orderNumber=${orderNumber}&payment_method=clerk`
        );
      }, 1500);
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      setPaymentStatus("failed");
      toast.error("Thanh toán thất bại", {
        description: "Vui lòng thử lại hoặc liên hệ bộ phận hỗ trợ",
      });
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    router.push(`/user/orders/${orderId}`);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Tiêu đề */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-4">
            <Wallet className="w-10 h-10 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Thanh toán Clerk
          </h1>
          <p className="text-gray-600">
            Thanh toán an toàn được bảo mật bởi xác thực Clerk
          </p>
        </motion.div>

        {/* Thẻ Trạng thái Thanh toán */}
        {paymentStatus === "success" ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-8"
          >
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-green-900 mb-2">
                    Thanh toán thành công!
                  </h3>
                  <p className="text-green-700">
                    Đang chuyển hướng đến trang xác nhận đơn hàng...
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : paymentStatus === "failed" ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-8"
          >
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-red-900 mb-2">
                    Thanh toán thất bại
                  </h3>
                  <p className="text-red-700 mb-4">
                    Đã xảy ra lỗi. Vui lòng thử lại.
                  </p>
                  <Button
                    onClick={() => setPaymentStatus("pending")}
                    variant="outline"
                    className="border-red-300"
                  >
                    Thử lại
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : null}

        {/* Thẻ Chi tiết Thanh toán */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Chi tiết thanh toán
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">Mã đơn hàng:</span>
                <Badge variant="secondary" className="font-mono">
                  {orderNumber}
                </Badge>
              </div>

              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">Khách hàng:</span>
                <span className="font-medium">
                  {user.firstName} {user.lastName}
                </span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium text-sm">
                  {user.emailAddresses[0]?.emailAddress}
                </span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">Phương thức thanh toán:</span>
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-purple-600" />
                  <span className="font-medium">Thanh toán Clerk</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-lg font-semibold text-gray-900">
                  Tổng số tiền:
                </span>
                <span className="text-2xl font-bold text-purple-600">
                  <PriceFormatter amount={amount} />
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Thông báo bảo mật */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">
                  Thanh toán an toàn
                </h4>
                <p className="text-sm text-blue-700">
                  Thanh toán của bạn được bảo mật bằng xác thực Clerk. Thông tin cá nhân của bạn được mã hóa và bảo vệ tuyệt đối.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Các nút hành động */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          {paymentStatus === "pending" && (
            <>
              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full h-14 text-lg font-semibold bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-purple-200"
                size="lg"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Đang xử lý thanh toán...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Wallet className="w-5 h-5" />
                    Hoàn tất thanh toán ({<PriceFormatter amount={amount} />})
                  </div>
                )}
              </Button>

              <Button
                onClick={handleCancel}
                disabled={isProcessing}
                variant="outline"
                className="w-full h-12"
                size="lg"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Hủy & Quay lại danh sách đơn hàng
              </Button>
            </>
          )}

          {paymentStatus === "processing" && (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
              <p className="text-gray-600">Đang xử lý thanh toán của bạn...</p>
              <p className="text-sm text-gray-500 mt-2">
                Vui lòng không đóng cửa sổ này
              </p>
            </div>
          )}
        </motion.div>

        {/* Thông tin bổ sung */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center text-sm text-gray-500"
        >
          <p>
            Bằng việc hoàn tất thanh toán này, bạn đồng ý với các điều khoản và điều kiện của chúng tôi
          </p>
          <p className="mt-1">Mã phiên (Session ID): {sessionId?.slice(0, 30)}...</p>
        </motion.div>
      </div>
    </div>
  );
}