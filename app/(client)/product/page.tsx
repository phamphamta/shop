import React, { Suspense } from "react";
import Container from "@/components/Container";
import Title from "@/components/Title";
import { getAllProducts, getCategories, getAllBrands } from "@/sanity/queries";
import ProductCatalog from "@/components/ProductCatalog";

import { ArrowRight, Package, Filter, Search } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const ProductPage = async () => {
  const [products, categories, brands] = await Promise.all([
    getAllProducts(),
    getCategories(),
    getAllBrands(),
  ]);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-shop_dark_green to-shop_light_green">
        <Container>
          <div className="py-16 text-white">
            <div className="mb-6">
              <Breadcrumb>
                <BreadcrumbList className="text-white/80">
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/" className="hover:text-white">
                      Trang chủ
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-white/60" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-white font-medium">
                      Sản phẩm
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <Package className="w-8 h-8" />
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-0">
                  Danh mục sản phẩm
                </h1>
              </div>

              <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-8">
                Khám phá bộ sưu tập đầy đủ các sản phẩm cao cấp của chúng tôi. Từ
                các thiết bị điện tử tiên tiến đến phụ kiện thời trang, tìm thấy mọi
                thứ bạn cần ở một nơi duy nhất.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {products?.length || 0}+ Sản phẩm
                    </p>
                    <p className="text-sm text-white/70">
                      Hàng chính hãng cao cấp
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Filter className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {categories?.length || 0} Danh mục
                    </p>
                    <p className="text-sm text-white/70">Dễ dàng tìm kiếm</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Bộ lọc nâng cao</p>
                    <p className="text-sm text-white/70">Tìm đúng nhu cầu</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <Container className="py-10">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20">
              <div className="flex items-center gap-2 text-shop_dark_green">
                <div className="w-6 h-6 border-2 border-shop_dark_green border-t-transparent rounded-full animate-spin"></div>
                <span className="font-medium">Đang tải sản phẩm...</span>
              </div>
            </div>
          }
        >
          <ProductCatalog
            initialProducts={products}
            categories={categories}
            brands={brands}
          />
        </Suspense>
      </Container>

      {/* Bottom CTA Section */}
      <div className="bg-shop_light_bg border-t">
        <Container>
          <div className="py-12 text-center">
            <Title className="text-2xl mb-4">
              Không tìm thấy sản phẩm bạn mong muốn?
            </Title>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Đội ngũ hỗ trợ khách hàng của chúng tôi luôn sẵn sàng giúp bạn tìm kiếm
              sản phẩm hoàn hảo nhất. Liên hệ ngay để nhận gợi ý mua sắm phù hợp.
            </p>
            <button className="inline-flex items-center gap-2 bg-shop_dark_green text-white px-8 py-3 rounded-lg font-semibold hover:bg-shop_dark_green/90 transition-colors">
              Liên hệ hỗ trợ
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default ProductPage;