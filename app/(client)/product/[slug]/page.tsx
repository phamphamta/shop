import { Suspense } from "react";
import ProductPageSkeleton from "@/components/ProductPageSkeleton";
import {
  getProductBySlug,
  getRelatedProducts,
  getBrand,
} from "@/sanity/queries";
import { notFound } from "next/navigation";
import ProductContent from "@/components/ProductContent";
import { Product } from "@/sanity.types";
import { Metadata } from "next";
import {
  generateProductMetadata,
  generateProductSchema,
  generateBreadcrumbSchema,
} from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Không tìm thấy sản phẩm",
      description: "Sản phẩm bạn đang tìm kiếm không tồn tại.",
    };
  }

  // Fetch brand data if needed
  const brand = await getBrand(slug);
  const productWithBrand = { ...product, brand };

  return generateProductMetadata(productWithBrand);
}

const ProductPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  return (
    <div>
      <Suspense fallback={<ProductPageSkeleton />}>
        <ProductPageContent slug={slug} />
      </Suspense>
    </div>
  );
};

const ProductPageContent = async ({ slug }: { slug: string }) => {
  const product = await getProductBySlug(slug);

  if (!product) {
    return notFound();
  }

  // Fetch related data on the server side
  const categoryIds =
    product?.categories?.map(
      (cat: { _ref: string; _type: string; _key: string }) => cat._ref
    ) || [];
  const [relatedProducts, brand] = await Promise.all([
    getRelatedProducts(categoryIds, product?.slug?.current || "", 4),
    getBrand(product?.slug?.current as string),
  ]);

  // Convert null values to undefined for TypeScript compatibility
  const productWithReviews = {
    ...product,
    averageRating: product.averageRating ?? undefined,
    totalReviews: product.totalReviews ?? undefined,
  };

  const productWithBrand = { ...productWithReviews, brand };

  // Generate structured data
  const productSchema = generateProductSchema(productWithBrand);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Trang chủ", url: "/" },
    { name: "Cửa hàng", url: "/shop" },
    { name: productWithReviews.name || "Sản phẩm", url: `/product/${slug}` },
  ]);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <ProductContent
        product={productWithReviews}
        relatedProducts={(relatedProducts || []) as unknown as Product[]}
        brand={brand}
      />
    </>
  );
};

export default ProductPage;