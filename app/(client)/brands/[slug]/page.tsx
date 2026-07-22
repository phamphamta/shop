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
import { client } from "@/sanity/lib/client";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { ArrowLeft, ArrowRight, Package, Tag, Grid3X3, Filter } from "lucide-react";
import BrandProducts from "@/components/product/BrandProducts";
import { generateBreadcrumbSchema } from "@/lib/seo";

export const revalidate = 10;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const brands = await getAllBrands();

  const currentBrand = brands.find(
    (b: any) =>
      b.slug?.current?.trim().toLowerCase() === slug.trim().toLowerCase()
  );

  if (!currentBrand) {
    return {
      title: "Không tìm thấy thương hiệu",
      description: "Thương hiệu bạn đang tìm kiếm không tồn tại.",
    };
  }

  return {
    title: `${currentBrand.title} - Cửa hàng | ShopCart`,
    description:
      currentBrand.description ||
      `Khám phá các sản phẩm chính hãng từ thương hiệu ${currentBrand.title} tại ShopCart. Mua sắm điện thoại, laptop, phụ kiện và linh kiện máy tính với giá tốt, nhiều ưu đãi và bảo hành chính hãng.`,

    alternates: {
      canonical: `/brands/${slug}`,
    },

    openGraph: {
      title: `${currentBrand.title} - Cửa hàng | ShopCart`,
      description:
        currentBrand.description ||
        `Khám phá các sản phẩm chính hãng từ thương hiệu ${currentBrand.title} tại ShopCart. Mua sắm điện thoại, laptop, phụ kiện và linh kiện máy tính với giá tốt, nhiều ưu đãi và bảo hành chính hãng.`,
      url: `/brands/${slug}`,
      type: "website",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: `${currentBrand.title} - ShopCart`,
        },
      ],
    },
  };
}

const BrandPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const brands = await getAllBrands();

  const currentBrand = brands.find((b: any) => b.slug?.current?.trim().toLowerCase() === slug.trim().toLowerCase());
  const brandTitle = currentBrand?.title || slug;
  const querySlug = currentBrand?.slug?.current || slug;

  // Fetch products for the current brand
  const query = `
    *[_type == "product" && lower(brand->slug.current) == lower($slug)] {
      ...,
      brand->{
        _id,
        title,
        slug
      }
    }
  `;
  const products = await client.fetch(query, { slug: querySlug });

  // Generate structured data for SEO
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Trang chủ", url: "/" },
    { name: "Thương hiệu", url: "/brands" },
    { name: brandTitle, url: `/brands/${slug}` },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-shop_light_bg via-white to-shop_light_pink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

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
                <BreadcrumbLink asChild>
                  <Link href="/brands">Thương hiệu</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{brandTitle}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Brand Header */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 lg:p-8 shadow-md border border-gray-100/50 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-4">
                {currentBrand?.image && (
                  <div className="flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-shop_light_pink to-shop_light_bg rounded-xl overflow-hidden p-2 flex items-center justify-center border border-gray-100">
                    <Image
                      src={urlFor(currentBrand.image).url()}
                      alt={brandTitle}
                      width={80}
                      height={80}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h1 className="text-2xl lg:text-3xl font-bold text-shop_dark_green mb-2">
                    {brandTitle}
                  </h1>
                  {currentBrand?.description && (
                    <p className="text-dark-text text-sm lg:text-base line-clamp-2">
                      {currentBrand.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/brands"
                  className="inline-flex items-center gap-2 text-shop_dark_green hover:text-shop_light_green transition-colors duration-300 text-sm font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Quay lại Thương hiệu
                </Link>
                <div className="h-4 w-px bg-gray-300" />
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-shop_light_green hover:bg-shop_dark_green text-white px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <Package className="w-4 h-4" />
                  Xem tất cả sản phẩm
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-3 lg:items-end">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs text-dark-text bg-white/60 px-3 py-1.5 rounded-full">
                  <Grid3X3 className="w-3 h-3" />
                  <span>Xem theo thương hiệu</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-dark-text bg-white/60 px-3 py-1.5 rounded-full">
                  <Filter className="w-3 h-3" />
                  <span>Kết quả đã lọc</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Products Listing */}
        <BrandProducts
          brands={brands}
          slug={slug}
          initialProducts={products}
        />
      </Container>
    </div>
  );
};

export default BrandPage;
