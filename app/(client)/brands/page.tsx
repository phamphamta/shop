import Container from "@/components/Container";
import Title from "@/components/Title";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getAllBrands } from "@/sanity/queries";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Package, Tag } from "lucide-react";

export const revalidate = 10;

const BrandsPage = async () => {
  const brands = await getAllBrands();

  return (
    <div className="min-h-screen bg-gradient-to-br from-shop_light_bg via-white to-shop_light_pink">
      <Container className="py-10">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Trang chủ</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Thương hiệu</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="text-center mb-10">
          <Title className="text-3xl lg:text-4xl font-bold text-shop_dark_green mb-3">
            Mua sắm theo Thương hiệu
          </Title>
          <p className="text-base lg:text-lg text-dark-text max-w-2xl mx-auto mb-6">
            Khám phá hàng loạt sản phẩm từ các thương hiệu hàng đầu thế giới mà chúng tôi phân phối chính hãng.
          </p>

          <div className="flex justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 bg-shop_dark_green hover:bg-shop_light_green text-white px-8 py-3 rounded-full font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Package className="w-5 h-5" />
              Xem tất cả sản phẩm
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {brands.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {brands.map((brand) => (
                <Link
                  key={brand._id}
                  href={`/brands/${brand.slug?.current}`}
                  className="group relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-shop_light_green transform hover:-translate-y-1 flex flex-col justify-between"
                >
                  {/* Brand Image */}
                  <div className="relative h-32 sm:h-36 lg:h-40 bg-gradient-to-br from-shop_light_pink to-shop_light_bg overflow-hidden p-6 flex items-center justify-center">
                    {brand.image ? (
                      <Image
                        src={urlFor(brand.image).url()}
                        alt={brand.title || "Thương hiệu"}
                        width={180}
                        height={120}
                        className="object-contain max-h-full max-w-full group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Tag className="w-8 h-8 lg:w-10 lg:h-10 text-shop_light_green opacity-60" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/[0.02] group-hover:bg-black/[0.05] transition-colors duration-300" />
                  </div>

                  {/* Brand Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between border-t border-gray-50">
                    <div>
                      <div className="flex items-start justify-between mb-1.5">
                        <h3 className="text-base font-bold text-shop_dark_green group-hover:text-shop_light_green transition-colors duration-300 line-clamp-1">
                          {brand.title}
                        </h3>
                        <ArrowRight className="w-4 h-4 text-shop_light_green group-hover:translate-x-0.5 transition-transform duration-300 flex-shrink-0 ml-2" />
                      </div>

                      {brand.description && (
                        <p className="text-dark-text text-xs mb-2 line-clamp-2">
                          {brand.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-shop_light_green via-shop_orange to-shop_light_green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 shadow-md border border-gray-100/50 max-w-md mx-auto">
              <Tag className="w-16 h-16 text-light-text mx-auto mb-4" />
              <h3 className="text-xl font-bold text-shop_dark_green mb-3">
                Hiện chưa có thương hiệu nào
              </h3>
              <p className="text-dark-text text-sm mb-6">
                Có vẻ như chưa có thương hiệu nào được thiết lập. Hãy quay lại sau để xem nhé!
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-shop_light_green hover:bg-shop_dark_green text-white px-6 py-2.5 rounded-full font-medium text-sm transition-colors duration-300"
              >
                <Package className="w-4 h-4" />
                Xem tất cả sản phẩm
              </Link>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default BrandsPage;