import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/employee/",
          "/user/",
          "/dashboard/",
          "/studio/",
          "/_next/",
          "/cart",
          "/wishlist",
          "/checkout/",
          "/success",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/employee/",
          "/user/",
          "/dashboard/",
          "/studio/",
          "/_next/",
          "/cart",
          "/wishlist",
          "/checkout/",
          "/success",
        ],
      },
    ],
    sitemap: "https://shopcartvn.vercel.app/sitemap.xml",
  };
}