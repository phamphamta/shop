"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  Truck,
  MapPin,
  Package,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import PriceFormatter from "@/components/PriceFormatter";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { toast } from "sonner";
import { PAYMENT_METHODS, PaymentMethod } from "@/lib/orderStatus";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface OrderProduct {
  product: {
    _id: string;
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    images?: any[];
    price: number;
    currency: string;
  };
  quantity: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  products: OrderProduct[];
  subtotal: number;
  tax: number;
  shipping: number;
  totalPrice: number;
  currency: string;
  address: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  status: string;
  paymentStatus: string;
  orderDate: string;
}

interface OrderCheckoutContentProps {
  order: Order;
}

export function OrderCheckoutContent({ order }: OrderCheckoutContentProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>(PAYMENT_METHODS.STRIPE);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayNow = async () => {
    setIsProcessing(true);

    try {
      const response = await fetch(`/api/orders/${order._id}/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok && data.success && data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Không thể tạo phiên thanh toán");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Không thể khởi tạo thanh toán");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCODPayment = async () => {
    setIsProcessing(true);

    try {
      // Here you could implement COD logic if needed
      // For now, just show a message
      toast.success("Đơn hàng đã được xác nhận với phương thức Thanh toán khi nhận hàng (COD)");

      setTimeout(() => {
        window.location.href = `/user/orders/${order._id}`;
      }, 1500);
    } catch (error) {
      console.error("COD payment error:", error);
      toast.error("Không thể xử lý thanh toán COD");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Order Details */}
      <div className="lg:col-span-2 space-y-6">
        {/* Order Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Đơn hàng #{order.orderNumber?.slice(-8)}
              </CardTitle>
              <Badge variant="outline" className="capitalize">
                {order.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Khách hàng</p>
                <p className="font-medium">{order.customerName}</p>
                <p className="text-muted-foreground">{order.email}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Ngày đặt hàng</p>
                <p className="font-medium">
                  {new Date(order.orderDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Địa chỉ nhận hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="font-medium">{order.address.name}</p>
              <p className="text-muted-foreground">{order.address.address}</p>
              <p className="text-muted-foreground">
                {order.address.city}, {order.address.state} {order.address.zip}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Phương thức thanh toán
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={selectedPaymentMethod}
              onValueChange={(value) =>
                setSelectedPaymentMethod(value as PaymentMethod)
              }
              className="space-y-3"
            >
              <div className="flex items-start space-x-3 p-3 border rounded-lg">
                <RadioGroupItem
                  value={PAYMENT_METHODS.STRIPE}
                  id="stripe"
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label htmlFor="stripe" className="cursor-pointer">
                    <div className="flex items-center gap-2 font-medium">
                      <CreditCard className="w-4 h-4" />
                      Thẻ tín dụng / Thẻ ghi nợ
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Thanh toán an toàn bằng thẻ tín dụng hoặc thẻ ghi nợ của bạn qua Stripe
                    </p>
                  </Label>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 border rounded-lg">
                <RadioGroupItem
                  value={PAYMENT_METHODS.CASH_ON_DELIVERY}
                  id="cod"
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label htmlFor="cod" className="cursor-pointer">
                    <div className="flex items-center gap-2 font-medium">
                      <Truck className="w-4 h-4" />
                      Thanh toán khi giao hàng (COD)
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Thanh toán bằng tiền mặt khi đơn hàng được giao đến tận tay bạn
                    </p>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle>Sản phẩm ({order.products.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.products.map((item, index) => (
              <div key={index} className="flex gap-3 p-3 border rounded-lg">
                <div className="w-16 h-16 flex-shrink-0">
                  <Image
                    src={
                      item.product.images?.[0]
                        ? urlFor(item.product.images[0]).url()
                        : "/placeholder.jpg"
                    }
                    alt={item.product.name || "Product"}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{item.product.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Số lượng: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    <PriceFormatter
                      amount={item.product.price * item.quantity}
                    />
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <PriceFormatter amount={item.product.price} /> / sản phẩm
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Order Summary & Actions */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Tóm tắt đơn hàng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Tạm tính ({order.products.length} sản phẩm)</span>
              <PriceFormatter amount={order.subtotal} />
            </div>
            <div className="flex justify-between">
              <span>Phí vận chuyển</span>
              {order.shipping === 0 ? (
                <span className="text-green-600 font-medium">Miễn phí</span>
              ) : (
                <PriceFormatter amount={order.shipping} />
              )}
            </div>
            <div className="flex justify-between">
              <span>Thuế</span>
              <PriceFormatter amount={order.tax} />
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Tổng cộng</span>
              <PriceFormatter amount={order.totalPrice} />
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={
            selectedPaymentMethod === PAYMENT_METHODS.STRIPE
              ? handlePayNow
              : handleCODPayment
          }
          disabled={isProcessing}
          className="w-full h-12 text-lg font-semibold"
          size="lg"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Đang xử lý...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {selectedPaymentMethod === PAYMENT_METHODS.STRIPE ? (
                <>
                  <CreditCard className="w-5 h-5" />
                  Thanh toán <PriceFormatter amount={order.totalPrice} />
                </>
              ) : (
                <>
                  <Truck className="w-5 h-5" />
                  Xác nhận đơn hàng COD
                </>
              )}
            </div>
          )}
        </Button>

        <Button asChild variant="outline" className="w-full">
          <Link href="/user/orders" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Quay lại danh sách đơn hàng
          </Link>
        </Button>

        <div className="text-center text-xs text-muted-foreground">
          {selectedPaymentMethod === PAYMENT_METHODS.STRIPE ? (
            <>
              <p>🔒 Thanh toán an toàn qua Stripe</p>
              <p>Thông tin thanh toán của bạn được mã hóa bảo mật</p>
            </>
          ) : (
            <>
              <p>💵 Thanh toán khi nhận hàng (COD)</p>
              <p>Thanh toán bằng tiền mặt cho nhân viên giao hàng</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
