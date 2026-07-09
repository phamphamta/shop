"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  Truck,
  MapPin,
  ShoppingBag,
  Package,
  Loader2,
  X,
  Wallet,
} from "lucide-react";
import useCartStore, { CartItem } from "@/store";
import PriceFormatter from "@/components/PriceFormatter";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { toast } from "sonner";
import { PAYMENT_METHODS, PaymentMethod } from "@/lib/orderStatus";
import { OrderAddressSelector } from "@/components/checkout/OrderAddressSelector";
import { useOrderPlacement } from "@/hooks/useOrderPlacement";
import { CheckoutSkeleton } from "@/components/checkout/CheckoutSkeleton";
import { OrderPlacementOverlay } from "@/components/cart/OrderPlacementSkeleton";
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { cn } from "@/lib/utils";

interface OrderAddress {
  _id: string;
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  default: boolean;
  createdAt: string;
  lastUsed: string;
  orderNumber: string;
  source: "order";
}

export function CheckoutContent() {
  const { user, isLoaded } = useUser();
  const searchParams = useSearchParams();
  const {
    items: cart,
    resetCart,
    getSubTotalPrice,
    getTotalDiscount,
  } = useCartStore();
  const { placeOrder, isPlacingOrder, orderStep } = useOrderPlacement({
    user: user!,
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>(PAYMENT_METHODS.STRIPE);
  const [selectedAddress, setSelectedAddress] = useState<OrderAddress | null>(
    null
  );
  const [addresses, setAddresses] = useState<OrderAddress[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [actionType, setActionType] = useState<"pay" | "order" | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [hasInitialCart, setHasInitialCart] = useState<boolean | null>(null);
  const [userProfile, setUserProfile] = useState<{
    isBusiness: boolean;
    isActive: boolean;
  } | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // New pricing structure
  const grossSubtotal = getSubTotalPrice(); // Gross amount (before discount)
  const totalDiscount = getTotalDiscount(); // Total discount amount
  const currentSubtotal = grossSubtotal - totalDiscount; // After discount

  // Business account discount (2% additional discount)
  const businessDiscount = userProfile?.isBusiness ? currentSubtotal * 0.02 : 0;
  const finalSubtotal = currentSubtotal - businessDiscount;

  const shipping = finalSubtotal > 100 ? 0 : 10;
  const tax = finalSubtotal * (parseFloat(process.env.TAX_AMOUNT || "0") || 0);
  const total = finalSubtotal + shipping + tax;

  // Fetch user profile for business account status
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.emailAddresses?.[0]?.emailAddress) return;

      try {
        const response = await fetch("/api/user/status");
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setUserProfile({
              isBusiness: data.user.isBusiness || false,
              isActive: data.user.isActive || false,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    if (user && isLoaded) {
      fetchUserProfile();
    }
  }, [user, isLoaded]);

  // Fetch user addresses from previous orders
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user?.emailAddresses?.[0]?.emailAddress) return;

      try {
        const response = await fetch(
          `/api/orders/addresses?email=${encodeURIComponent(
            user.emailAddresses[0].emailAddress
          )}`
        );
        if (response.ok) {
          const data = await response.json();
          setAddresses(data.addresses || []);

          // Set default address (most recently used)
          const defaultAddress = data.addresses?.find(
            (addr: OrderAddress) => addr.default
          );
          if (defaultAddress) {
            setSelectedAddress(defaultAddress);
          } else if (data.addresses?.length > 0) {
            setSelectedAddress(data.addresses[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    if (isLoaded && user) {
      fetchAddresses();
    }
  }, [isLoaded, user]);

  // Read address from URL parameters (when coming from cart)
  useEffect(() => {
    const addressParam = searchParams.get("address");
    if (addressParam) {
      try {
        const decodedAddress = JSON.parse(decodeURIComponent(addressParam));
        // Convert regular address to OrderAddress format
        const orderAddress: OrderAddress = {
          _id: decodedAddress._id,
          name: decodedAddress.name,
          email: decodedAddress.email,
          address: decodedAddress.address,
          city: decodedAddress.city,
          state: decodedAddress.state,
          zip: decodedAddress.zip,
          default: decodedAddress.default,
          createdAt: decodedAddress.createdAt,
          lastUsed: new Date().toISOString(),
          orderNumber: "cart-selected",
          source: "order" as const,
        };
        setSelectedAddress(orderAddress);

        // Show success message
        toast.success("Sẵn sàng thanh toán! 🛒", {
          description:
            "Hoàn tất đơn hàng bằng cách chọn phương thức thanh toán bên dưới",
          duration: 4000,
        });
      } catch (error) {
        console.error("Error parsing address from URL:", error);
        toast.error("Lỗi khi tải địa chỉ từ giỏ hàng");
      }
    }
  }, [searchParams]);

  // Track initial cart state and redirect if empty
  useEffect(() => {
    if (hasInitialCart === null && isLoaded && cart !== undefined) {
      setHasInitialCart(cart.length > 0);

      // If cart is empty on initial load, redirect to cart
      if (cart.length === 0) {
        window.location.href = "/cart";
        return;
      }
    }
  }, [cart, hasInitialCart, isLoaded]);

  const handlePayNowClick = () => {
    if (!selectedAddress) {
      toast.error("Vui lòng chọn địa chỉ giao hàng");
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentMethodSelect = async (method: "stripe" | "clerk") => {
    setShowPaymentModal(false);

    if (method === "clerk") {
      // Process Clerk payment
      await handlePlaceOrder("pay", "clerk");
    } else {
      // Process Stripe payment
      await handlePlaceOrder("pay", "stripe");
    }
  };

  const handlePlaceOrder = async (
    action: "pay" | "order",
    paymentGateway?: "stripe" | "clerk"
  ) => {
    if (!selectedAddress) {
      toast.error("Vui lòng chọn địa chỉ giao hàng");
      return;
    }

    setActionType(action);

    // Determine payment method based on action and gateway
    let paymentMethodToUse = selectedPaymentMethod;
    if (action === "pay" && paymentGateway === "clerk") {
      paymentMethodToUse = PAYMENT_METHODS.CLERK;
    } else if (action === "pay" && paymentGateway === "stripe") {
      paymentMethodToUse = PAYMENT_METHODS.STRIPE;
    }

    const result = await placeOrder(
      selectedAddress,
      paymentMethodToUse,
      finalSubtotal, // Pass final subtotal (includes business discount)
      shipping,
      tax,
      total
    );

    if (result?.success && result.redirectTo) {
      setIsRedirecting(true);
      if (
        action === "pay" &&
        (result.isStripeRedirect || result.isClerkRedirect)
      ) {
        // Direct payment - clear cart and redirect
        resetCart();
        window.location.href = result.redirectTo;
      } else {
        // Order placed - clear cart and redirect with appropriate delay
        setTimeout(
          () => {
            resetCart();
            window.location.href = result.redirectTo;
          },
          action === "order" ? 1500 : 500
        );
      }
    }

    setActionType(null);
  };

  if (!isLoaded) {
    return <CheckoutSkeleton />;
  }

  if (!user) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">
          Vui lòng đăng nhập để tiến hành thanh toán.
        </p>
      </div>
    );
  }

  // Show loading during redirect process
  if (isRedirecting) {
    return (
      <div className="text-center py-10">
        <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-primary" />
        <h2 className="text-xl font-semibold mb-2">Đang xử lý đơn hàng của bạn...</h2>
        <p className="text-muted-foreground">
          Vui lòng chờ trong giây lát khi chúng tôi chuyển hướng bạn để hoàn tất thanh toán.
        </p>
      </div>
    );
  }

  // If cart is empty and we had an initial cart, show loading (likely during order processing)
  if ((!cart || cart.length === 0) && hasInitialCart) {
    return <CheckoutSkeleton />;
  }

  // If cart is empty and no initial cart, this shouldn't happen due to redirect
  // But show fallback just in case
  if (!cart || cart.length === 0) {
    return (
      <div className="text-center py-10 animate-in fade-in-0 duration-500">
        <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-semibold mb-2">Giỏ hàng của bạn đang trống</h2>
        <p className="text-muted-foreground mb-4">
          Hãy thêm sản phẩm để tiếp tục thanh toán
        </p>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <a href="/shop">Tiếp tục mua sắm</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Order Items */}
      <div className="lg:col-span-2 space-y-6">
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
            </RadioGroup>
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
            {isLoadingAddresses ? (
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse mt-1"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-48"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-40"></div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse mt-1"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-28"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-52"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-36"></div>
                  </div>
                </div>
              </div>
            ) : searchParams.get("address") ? (
              // Show only selected address when coming from cart
              selectedAddress && (
                <div className="p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">{selectedAddress.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedAddress.address}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedAddress.city}, {selectedAddress.state}{" "}
                        {selectedAddress.zip}
                      </p>
                      {selectedAddress.email && (
                        <p className="text-sm text-muted-foreground">
                          {selectedAddress.email}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
                      ✓ Đã chọn
                    </div>
                  </div>
                </div>
              )
            ) : (
              <OrderAddressSelector
                addresses={addresses}
                selectedAddress={selectedAddress}
                onAddressSelect={setSelectedAddress}
                isLoading={isLoadingAddresses}
              />
            )}
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle>Sản phẩm ({cart.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cart.map((item: CartItem) => (
              <div
                key={item.product._id}
                className="flex gap-3 p-3 border rounded-lg"
              >
                <div className="w-16 h-16 shrink-0">
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
                      amount={(item.product.price || 0) * item.quantity}
                    />
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <PriceFormatter amount={item.product.price || 0} /> / sản phẩm
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Order Summary */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Tóm tắt đơn hàng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Tạm tính ({cart.length} sản phẩm)</span>
              <PriceFormatter amount={grossSubtotal} />
            </div>
            {totalDiscount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Giảm giá</span>
                <span>
                  -<PriceFormatter amount={totalDiscount} />
                </span>
              </div>
            )}
            {businessDiscount > 0 && (
              <div className="flex justify-between text-blue-600">
                <span>Chiết khấu Tài khoản Doanh nghiệp (2%)</span>
                <span>
                  -<PriceFormatter amount={businessDiscount} />
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Phí vận chuyển</span>
              {shipping === 0 ? (
                <span className="text-green-600 font-medium">Miễn phí</span>
              ) : (
                <PriceFormatter amount={shipping} />
              )}
            </div>
            <div className="flex justify-between">
              <span>Thuế</span>
              <PriceFormatter amount={tax} />
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Tổng cộng</span>
              <PriceFormatter amount={total} />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Button
            onClick={handlePayNowClick}
            disabled={isPlacingOrder || !selectedAddress || cart.length === 0}
            className="w-full h-12 text-lg font-semibold"
            size="lg"
          >
            {isPlacingOrder && actionType === "pay" ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang xử lý...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Thanh toán ngay
              </div>
            )}
          </Button>

          <Button
            onClick={() => handlePlaceOrder("order")}
            disabled={isPlacingOrder || !selectedAddress || cart.length === 0}
            variant="outline"
            className="w-full h-12 text-lg font-semibold"
            size="lg"
          >
            {isPlacingOrder && actionType === "order" ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang đặt hàng...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Đặt hàng (Thanh toán sau)
              </div>
            )}
          </Button>
        </div>

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

      {/* Order Placement Overlay */}
      {isPlacingOrder && (
        <OrderPlacementOverlay
          step={orderStep}
          isCheckoutRedirect={actionType === "pay"}
        />
      )}

      {/* Payment Method Selection Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogPortal>
          <DialogOverlay />
          <DialogPrimitive.Content
            className={cn(
              "fixed left-[50%] top-[50%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg"
            )}
          >
            <VisuallyHidden.Root>
              <DialogTitle>Chọn phương thức thanh toán</DialogTitle>
            </VisuallyHidden.Root>
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 border-4 border-blue-100">
                <CreditCard className="h-8 w-8 text-blue-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900">
                  Chọn cổng thanh toán
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Vui lòng chọn cổng thanh toán bạn muốn để hoàn tất đơn hàng
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3 pt-6">
              <Button
                onClick={() => handlePaymentMethodSelect("stripe")}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 font-semibold shadow-lg hover:shadow-blue-200"
                disabled={isPlacingOrder}
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Thanh toán qua Stripe
              </Button>
              <Button
                onClick={() => handlePaymentMethodSelect("clerk")}
                className="w-full h-12 bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 font-semibold shadow-lg hover:shadow-purple-200"
                disabled={isPlacingOrder}
              >
                <Wallet className="w-5 h-5 mr-2" />
                Thanh toán qua Clerk
              </Button>
            </div>
            <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </DialogPrimitive.Content>
        </DialogPortal>
      </Dialog>
    </div>
  );
}
