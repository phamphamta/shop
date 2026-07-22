import Shop from "@/components/shopPage/Shop";
import { getAllBrands, getCategories } from "@/sanity/queries";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cửa hàng | ShopCart",
  description:
    "Khám phá tất cả sản phẩm chính hãng tại ShopCart, bao gồm điện thoại, laptop, máy tính để bàn, màn hình, linh kiện và phụ kiện công nghệ với giá tốt.",

  alternates: {
    canonical: "https://shopcartvn.vercel.app/shop",
  },

  openGraph: {
    title: "Cửa hàng | ShopCart",
    description:
      "Khám phá tất cả sản phẩm chính hãng tại ShopCart, bao gồm điện thoại, laptop, máy tính để bàn, màn hình, linh kiện và phụ kiện công nghệ với giá tốt.",
    url: "https://shopcartvn.vercel.app/shop",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ShopCart Cửa hàng trực tuyến",
      },
    ],
  },
};

const ShopPage = async () => {
  const categories = await getCategories();
  const brands = await getAllBrands();

  return (
    <div className="bg-white min-h-screen">
      <Suspense
        fallback={
          <div className="min-h-96 bg-gray-50 animate-pulse rounded-lg" />
        }
      >
        <Shop categories={categories} brands={brands} />
      </Suspense>
    </div>
  );
};

export default ShopPage;