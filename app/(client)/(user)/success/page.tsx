"use client";

import { Check, Home, Package, ShoppingBag, Calendar, Eye } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { MY_ORDERS_QUERY_RESULT } from "@/sanity.types";
import { client } from "@/sanity/lib/client";
import { defineQuery } from "next-sanity";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PriceFormatter from "@/components/PriceFormatter";
import { format } from "date-fns";
import { vi } from "date-fns/locale"; // Import thêm locale tiếng Việt nếu muốn định dạng ngày tiếng Việt

const SuccessPage = () => {
  const [orders, setOrders] = useState<MY_ORDERS_QUERY_RESULT>([]);
  const [showAllOrders, setShowAllOrders] = useState(false);
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");

  const { user } = useUser();
  const userId = user?.id;

  const query =
    defineQuery(`*[_type == 'order' && clerkUserId == $userId] | order(orderDate desc){
  ...,products[]{
    ...,product->
  }
}`);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        console.log("Không tìm thấy mã người dùng. Không thể tải danh sách đơn hàng.");
        return;
      }

      try {
        const ordersData = await client.fetch(query, { userId });
        setOrders(ordersData as MY_ORDERS_QUERY_RESULT);
      } catch (error) {
        console.error("Lỗi khi tải danh sách đơn hàng:", error);
      }
    };

    fetchData();
  }, [userId, query]);

  // Hàm dịch trạng thái đơn hàng sang tiếng Việt
  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "Đang xử lý",
      completed: "Đã hoàn thành",
      delivered: "Đã giao hàng",
      cancelled: "Đã hủy",
    };
    return statusMap[status] || status;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <Check className="text-white w-12 h-12" />
          </motion.div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Đặt hàng thành công!
          </h1>

          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Cảm ơn bạn đã mua sắm! Đơn hàng của bạn đã được xác nhận và
            chúng tôi đang chuẩn bị để giao hàng. Bạn sẽ sớm nhận được một email xác nhận.
          </p>

          {orderNumber && (
            <div className="bg-white rounded-lg p-6 shadow-md inline-block">
              <div className="flex items-center justify-center gap-3">
                <Package className="w-5 h-5 text-green-600" />
                <span className="text-gray-700 font-medium">Mã đơn hàng:</span>
                <span className="text-xl font-bold text-green-600">
                  {orderNumber}
                </span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Order Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Điều gì xảy ra tiếp theo?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    Xử lý đơn hàng
                  </h3>
                  <p className="text-sm text-gray-600">
                    Chúng tôi đang chuẩn bị các mặt hàng của bạn để giao đi
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Vận chuyển</h3>
                  <p className="text-sm text-gray-600">
                    Đơn hàng sẽ được gửi đi trong vòng 2-3 ngày làm việc
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Giao hàng</h3>
                  <p className="text-sm text-gray-600">
                    Giao đến tận tay bạn đi kèm với các cập nhật mã theo dõi
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Orders */}
        {orders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Đơn hàng gần đây của bạn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(showAllOrders ? orders : orders.slice(0, 2)).map(
                    (order) => (
                      <div
                        key={order?._id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              Đơn hàng #
                              {order.orderNumber?.slice(-8) ||
                                order._id.slice(-8)}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {order.orderDate
                                  ? format(
                                    new Date(order.orderDate),
                                    "dd/MM/yyyy",
                                    { locale: vi }
                                  )
                                  : "Không rõ"}
                              </div>
                              <PriceFormatter amount={order.totalPrice || 0} />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            variant={
                              order.status === "completed" ||
                                order.status === "delivered"
                                ? "default"
                                : "secondary"
                            }
                            className="capitalize"
                          >
                            {getStatusLabel(order.status || "pending")}
                          </Badge>
                          <Button asChild size="sm" variant="outline">
                            <Link href={`/user/orders/${order._id}`}>
                              <Eye className="w-3 h-3 mr-1" />
                              Xem
                            </Link>
                          </Button>
                        </div>
                      </div>
                    )
                  )}

                  {orders.length > 2 && (
                    <div className="text-center pt-2">
                      <Button
                        variant="ghost"
                        onClick={() => setShowAllOrders(!showAllOrders)}
                        className="text-sm"
                      >
                        {showAllOrders
                          ? "Ẩn bớt"
                          : `Xem tất cả ${orders.length} đơn hàng`}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto"
        >
          <Button asChild size="lg" className="h-12">
            <Link href="/" className="flex items-center justify-center gap-2">
              <Home className="w-5 h-5" />
              Tiếp tục mua sắm
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="h-12">
            <Link
              href="/user/orders"
              className="flex items-center justify-center gap-2"
            >
              <Package className="w-5 h-5" />
              Theo dõi đơn hàng
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="h-12">
            <Link
              href="/shop"
              className="flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Xem thêm sản phẩm
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default SuccessPage;