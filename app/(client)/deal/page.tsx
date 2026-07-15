import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import Title from "@/components/Title";
import DealCountdown from "@/components/DealCountdown";
import DynamicBreadcrumb from "@/components/DynamicBreadcrumb";
import { DEAL_PRODUCTS_RESULT, Product } from "@/sanity.types";
import { getDealProducts, getCategories } from "@/sanity/queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Clock,
  Flame,
  TrendingDown,
  Zap,
  ShoppingBag,
  Star,
  Users,
  Heart,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Khuyến mãi | ShopCart",
  description:
    "Các chương trình giảm giá mới nhất tại ShopCart.",
  alternates: {
    canonical: "https://shopcartvn.vercel.app/deal",
  },
};
const DealPage = async () => {
  const [products] = await Promise.all([getDealProducts(), getCategories()]);

  // Calculate deal statistics
  const totalProducts = products?.length || 0;
  const avgDiscount =
    products?.reduce((acc, product) => acc + (product?.discount || 0), 0) /
    totalProducts || 0;
  const maxDiscount = Math.max(
    ...(products?.map((p) => p?.discount || 0) || [0])
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-orange-50">
      {/* Breadcrumb */}
      <Container className="pt-6">
        <DynamicBreadcrumb />
      </Container>

      {/* Hero Section */}
      <Container className="py-8 sm:py-12">
        <Card className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 shadow-xl overflow-hidden">
          <CardContent className="p-6 sm:p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-8">
              <div className="flex-1 space-y-4 sm:space-y-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-1 sm:gap-2 bg-white/20 rounded-full px-3 sm:px-4 py-1 sm:py-2">
                    <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" />
                    <span className="text-xs sm:text-sm font-semibold">
                      ƯU ĐÃI HOT
                    </span>
                  </div>
                  <Badge variant="destructive" className="text-xs sm:text-sm">
                    Giảm đến {maxDiscount}%
                  </Badge>
                </div>

                <div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4">
                    Ưu đãi Hot trong tuần
                  </h1>
                  <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-2xl">
                    Đừng bỏ lỡ những ưu đãi có giới hạn thời gian cực kỳ hấp dẫn này!
                    Tiết kiệm lớn cho các sản phẩm yêu thích của bạn với mức giảm giá lên đến{" "}
                    {maxDiscount}%. Số lượng sản phẩm có hạn.
                  </p>
                </div>

                {/* Deal Statistics */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
                    <div className="flex items-center gap-2 text-white/80 mb-1">
                      <ShoppingBag className="w-4 h-4" />
                      <span className="text-xs sm:text-sm">Sản phẩm</span>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold">
                      {totalProducts}
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
                    <div className="flex items-center gap-2 text-white/80 mb-1">
                      <TrendingDown className="w-4 h-4" />
                      <span className="text-xs sm:text-sm">Giảm giá TB</span>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold">
                      {avgDiscount.toFixed(0)}%
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 col-span-2 sm:col-span-1">
                    <div className="flex items-center gap-2 text-white/80 mb-1">
                      <Users className="w-4 h-4" />
                      <span className="text-xs sm:text-sm">
                        Khách hàng hài lòng
                      </span>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold">2.5K+</p>
                  </div>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="lg:flex-shrink-0">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
                  <DealCountdown />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Container>

      {/* Deal Features */}
      <Container className="py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              icon: Zap,
              title: "Ưu đãi chớp nhoáng",
              description: "Flash sale với các ưu đãi giới hạn thời gian",
              color: "text-yellow-600",
              bg: "bg-yellow-50 border-yellow-200",
            },
            {
              icon: Star,
              title: "Chất lượng cao cấp",
              description: "Các sản phẩm hàng đầu với đánh giá tốt nhất",
              color: "text-purple-600",
              bg: "bg-purple-50 border-purple-200",
            },
            {
              icon: Heart,
              title: "Khách hàng yêu thích",
              description: "Những mặt hàng được yêu thích nhất bởi khách hàng",
              color: "text-pink-600",
              bg: "bg-pink-50 border-pink-200",
            },
            {
              icon: Clock,
              title: "Thời gian có hạn",
              description: "Nhanh chân lên! Những ưu đãi này sẽ không kéo dài lâu",
              color: "text-red-600",
              bg: "bg-red-50 border-red-200",
            },
          ].map((feature, index) => (
            <Card
              key={index}
              className={`${feature.bg} border-2 hover:shadow-lg transition-all duration-300`}
            >
              <CardContent className="p-4 sm:p-6 text-center">
                <feature.icon
                  className={`w-8 h-8 sm:w-10 sm:h-10 ${feature.color} mx-auto mb-3`}
                />
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>

      {/* Products Section */}
      <Container className="py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4">
            <Flame className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
            <Title className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-0">
              Bộ sưu tập Ưu đãi Hot
            </Title>
            <Flame className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
          </div>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Khám phá những ưu đãi tuyệt vời cho các sản phẩm cao cấp. Số lượng có hạn
            với mức giá đặc biệt này.
          </p>
        </div>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {products.map((product: DEAL_PRODUCTS_RESULT[0]) => (
              <div
                key={product?._id}
                className="transform hover:scale-105 transition-transform duration-300"
              >
                <ProductCard product={product as unknown as Product} />
              </div>
            ))}
          </div>
        ) : (
          <Card className="p-8 sm:p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  Hiện chưa có ưu đãi nào
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4">
                  Vui lòng quay lại sau để cập nhật những ưu đãi và giảm giá tuyệt vời!
                </p>
                <Button asChild>
                  <Link href="/shop">Xem tất cả sản phẩm</Link>
                </Button>
              </div>
            </div>
          </Card>
        )}
      </Container>

      {/* Call to Action */}
      <Container className="py-8 sm:py-12">
        <Card className="bg-gradient-to-r from-shop_dark_green to-shop_light_green text-white">
          <CardContent className="p-6 sm:p-8 lg:p-12 text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">
              Đừng bỏ lỡ những ưu đãi tuyệt vời này!
            </h2>
            <p className="text-sm sm:text-base text-white/90 mb-6 max-w-2xl mx-auto">
              Đăng ký nhận bản tin của chúng tôi để nhận thông báo về các chương trình flash sale,
              ưu đãi độc quyền và các sản phẩm mới về.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                variant="secondary"
                asChild
                className="w-full sm:w-auto"
              >
                <Link href="/shop">Khám phá tất cả sản phẩm</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-shop_dark_green w-full sm:w-auto"
              >
                Đăng ký nhận ưu đãi
              </Button>
            </div>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default DealPage;