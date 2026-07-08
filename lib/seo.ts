import { Metadata } from "next";
import { Product, Category } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";

const BASE_URL = "https://shopcartvn.vercel.app";

/**
 * Tạo metadata cho trang chi tiết sản phẩm
 */
export function generateProductMetadata(product: any): Metadata {
  const title = product.name || "Sản phẩm";
  const description =
    product.description ||
    `Mua ngay ${title} trực tuyến giá tốt tại ShopCart. ${product.price ? `Giá: $${product.price}` : ""
    }`;
  const imageUrl = product.images?.[0]
    ? urlFor(product.images[0]).url()
    : "/og-image.jpg";
  const url = `${BASE_URL}/product/${product.slug?.current}`;

  // Trích xuất tên thương hiệu nếu có dữ liệu liên kết
  const brandName =
    typeof product.brand === "object" ? product.brand?.name : "";

  return {
    title,
    description,
    keywords: [
      product.name || "",
      brandName || "",
      "mua hàng trực tuyến",
      "cửa hàng",
      "thương mại điện tử",
      "giá rẻ",
      "chính hãng"
    ].filter(Boolean),
    openGraph: {
      type: "website",
      url,
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName: "ShopCart",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
    },
  };
}

/**
 * Tạo metadata cho trang danh mục sản phẩm
 */
export function generateCategoryMetadata(
  category: Category,
  productCount: number = 0
): Metadata {
  const title = category.title || "Danh mục";
  const description =
    category.description ||
    `Khám phá ngay ${productCount} sản phẩm thuộc danh mục ${title} tại ShopCart. Săn deal hot giá tốt và sản phẩm chất lượng cao ngay hôm nay.`;
  const imageUrl = category.image
    ? urlFor(category.image).url()
    : "/og-image.jpg";
  const url = `${BASE_URL}/category/${category.slug?.current}`;

  return {
    title,
    description,
    keywords: [
      category.title || "",
      "danh mục",
      "mua sắm",
      "mua hàng trực tuyến",
      "thương mại điện tử",
      "sản phẩm",
    ].filter(Boolean),
    openGraph: {
      type: "website",
      url,
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName: "ShopCart",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
    },
  };
}

/**
 * Tạo Product Schema (JSON-LD) để hiển thị Rich Snippets trên Google Search
 */
export function generateProductSchema(product: any) {
  const imageUrl = product.images?.[0] ? urlFor(product.images[0]).url() : "";

  // Trích xuất tên thương hiệu nếu có dữ liệu liên kết
  const brandName =
    typeof product.brand === "object" ? product.brand?.name : "ShopCart";

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: imageUrl,
    sku: product._id,
    brand: {
      "@type": "Brand",
      name: brandName,
    },
    offers: {
      "@type": "Offer",
      url: `${BASE_URL}/product/${product.slug?.current}`,
      priceCurrency: "USD",
      price: product.price,
      priceValidUntil: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      )
        .toISOString()
        .split("T")[0],
      availability:
        product.stock && product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    ...(product.averageRating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.averageRating,
        reviewCount: product.totalReviews || 0,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };
}

/**
 * Tạo BreadcrumbList Schema (JSON-LD) định vị thanh điều hướng
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  };
}

/**
 * Tạo Organization Schema (JSON-LD) định danh doanh nghiệp ShopCart
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ShopCart",
    url: BASE_URL,
    logo: `${BASE_URL}/seo-logo.png`,
    description:
      "Điểm đến mua sắm trực tuyến đáng tin cậy của bạn với các mặt hàng chất lượng cao cùng dịch vụ chăm sóc khách hàng vượt trội.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-555-123-4567",
      contactType: "customer service",
      areaServed: "US",
      availableLanguage: "en",
    },
    sameAs: [
      "https://facebook.com/shopcart",
      "https://twitter.com/shopcart",
      "https://instagram.com/shopcart",
      "https://linkedin.com/company/shopcart",
    ],
  };
}

/**
 * Tạo WebSite Schema (JSON-LD) tích hợp tính năng thanh tìm kiếm trên Google
 */
export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ShopCart",
    url: BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/shop?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Tạo ItemList Schema định danh danh sách sản phẩm hiển thị
 */
export function generateItemListSchema(products: any[], listName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${BASE_URL}/product/${product.slug?.current}`,
      name: product.name,
    })),
  };
}

/**
 * Tạo Review Schema thu thập dữ liệu đánh giá sản phẩm
 */
export function generateReviewSchema(reviews: any[], product: Product) {
  if (!reviews || reviews.length === 0) return null;

  const reviewSchemas = reviews.map((review) => ({
    "@type": "Review",
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.rating,
      bestRating: 5,
      worstRating: 1,
    },
    author: {
      "@type": "Person",
      name: review.userName || "Người dùng ẩn danh",
    },
    reviewBody: review.comment,
    datePublished: review._createdAt,
  }));

  return reviewSchemas;
}

/**
 * Tạo FAQ Schema hiển thị các câu hỏi thường gặp
 */
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Helper tạo đường dẫn Canonical chuẩn hóa URL gốc
 */
export function getCanonicalUrl(path: string): string {
  return `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Tạo metadata mặc định cho trang chủ
 */
export function generateHomeMetadata(): Metadata {
  return {
    title: "ShopCart - Hệ Thống Mua Sắm Trực Tuyến Đáng Tin Cậy",
    description:
      "Khám phá hàng ngàn sản phẩm tuyệt vời tại ShopCart - nền tảng mua sắm trực tuyến uy tín hàng đầu cho các mặt hàng chất lượng cao. Sắm ngay đồ điện tử, thời trang, đồ gia dụng cùng dịch vụ giao hàng siêu tốc.",
    keywords: [
      "mua sắm trực tuyến",
      "thương mại điện tử",
      "mua hàng online",
      "chợ trực tuyến",
      "săn deal hot",
      "đồ điện tử chính hãng",
      "thời trang cao cấp",
      "đồ gia dụng tiện ích",
    ],
    openGraph: {
      type: "website",
      url: BASE_URL,
      title: "ShopCart - Hệ Thống Mua Sắm Trực Tuyến Đáng Tin Cậy",
      description:
        "Khám phá hàng ngàn mặt hàng tuyệt vời tại ShopCart. Mua sắm đồ điện tử, thời trang, đồ gia dụng chính hãng giao hàng nhanh chóng.",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "Cửa hàng trực tuyến ShopCart",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "ShopCart - Hệ Thống Mua Sắm Trực Tuyến Đáng Tin Cậy",
      description:
        "Khám phá hàng ngàn mặt hàng tuyệt vời tại ShopCart. Mua sắm sản phẩm đồ điện tử, thời trang, đồ gia dụng chất lượng cao.",
      images: ["/og-image.jpg"],
    },
    alternates: {
      canonical: BASE_URL,
    },
  };
}