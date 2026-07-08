import { ReactNode } from "react";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import Script from "next/script";
import Head from "next/head";
import { UserDataProvider } from "@/contexts/UserDataContext";
// import PremiumFloatingButton from "@/components/PremiumFloatingButton";
import "./globals.css";

const poppins = localFont({
  src: "./fonts/Poppins.woff2",
  variable: "--font-poppins",
  weight: "400",
  preload: false,
});
const raleway = localFont({
  src: "./fonts/Raleway.woff2",
  variable: "--font-raleway",
  weight: "100 900",
});

const opensans = localFont({
  src: "./fonts/Open Sans.woff2",
  variable: "--font-open-sans",
  weight: "100 800",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://shopcartvn.vercel.app"),
  title: {
    template: "%s | ShopCart - Mua sắm trực tuyến cao cấp",
    default: "ShopCart - Điểm đến mua sắm trực tuyến tin cậy của bạn",
  },
  description:
    "Khám phá các sản phẩm tuyệt vời tại ShopCart, địa chỉ mua sắm trực tuyến đáng tin cậy của bạn với các mặt hàng chất lượng và dịch vụ chăm sóc khách hàng đặc biệt. Mua sắm đồ điện tử, thời trang, đồ gia dụng và nhiều thứ khác với tốc độ giao hàng nhanh chóng.",
  keywords: [
    "mua sắm trực tuyến",
    "thương mại điện tử",
    "mua hàng online",
    "đồ điện tử",
    "thời trang",
    "đồ gia dụng",
    "khuyến mãi",
    "giảm giá",
    "ShopCart",
  ],
  authors: [{ name: "ShopCart" }],
  creator: "ShopCart",
  publisher: "ShopCart",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://shopcartvn.vercel.app",
    siteName: "ShopCart",
    title: "ShopCart - Điểm đến mua sắm trực tuyến tin cậy của bạn",
    description:
      "Khám phá các sản phẩm tuyệt vời tại ShopCart, địa chỉ mua sắm trực tuyến đáng tin cậy của bạn với các mặt hàng chất lượng và dịch vụ chăm sóc khách hàng đặc biệt.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ShopCart Cửa hàng trực tuyến",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ShopCart - Điểm đến mua sắm trực tuyến tin cậy của bạn",
    description:
      "Khám phá các sản phẩm tuyệt vời tại ShopCart, địa chỉ mua sắm trực tuyến đáng tin cậy của bạn với các mặt hàng chất lượng và dịch vụ chăm sóc khách hàng đặc biệt.",
    images: ["/og-image.jpg"],
    creator: "@shopcart",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "ks5p73t0IJaeod4lghmwspmEYg-9QwoatNixBeywJ4c",
  },
  alternates: {
    canonical: "https://shopcartvn.vercel.app",
  },
};

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const GADSENSE_CLIENT_ID = "ca-pub-6542623777003381"; // Define it once
  return (
    <ClerkProvider>
      <html lang="vi">
        <Head>
          <meta name="google-adsense-account" content={GADSENSE_CLIENT_ID} />
        </Head>
        <body
          className={`${poppins.variable} ${raleway.variable} ${opensans.variable} antialiased`}
        >
          <UserDataProvider>{children}</UserDataProvider>
          {/* <PremiumFloatingButton /> */}
          <Toaster
            position="bottom-right"
            richColors
            closeButton
            toastOptions={{
              style: {
                background: "#ffffff",
                color: "#1f2937",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "14px",
              },
              className: "sonner-toast",
            }}
          />

          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${GADSENSE_CLIENT_ID}`}
            strategy="beforeInteractive"
          />
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
