// Contact configuration using environment variables

export const contactConfig = {
  company: {
    name: process.env.NEXT_PUBLIC_COMPANY_NAME || "ShopCart",
    email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || "support@shopcart.com",
    phone: process.env.NEXT_PUBLIC_COMPANY_PHONE || "+1 (555) 123-4567",
    address:
      process.env.NEXT_PUBLIC_COMPANY_ADDRESS ||
      "123 Đường Mua Sắm, Khu Thương Mại",
    city: process.env.NEXT_PUBLIC_COMPANY_CITY || "New York, NY 10001, USA",
    description:
      process.env.NEXT_PUBLIC_COMPANY_DESCRIPTION ||
      "ShopCart cung cấp sản phẩm chất lượng, mua sắm trực tuyến tiện lợi cùng nhiều ưu đãi hấp dẫn.",
  },
  businessHours: {
    weekday:
      process.env.NEXT_PUBLIC_COMPANY_BUSINESS_HOURS_WEEKDAY ||
      "Thứ Hai - Thứ Sáu: 9:00 - 18:00 (EST)",
    weekend:
      process.env.NEXT_PUBLIC_COMPANY_BUSINESS_HOURS_WEEKEND ||
      "Thứ Bảy - Chủ Nhật: 10:00 - 16:00 (EST)",
  },
  emails: {
    support: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@shopcart.com",
    sales: process.env.NEXT_PUBLIC_SALES_EMAIL || "sales@shopcart.com",
  },
  responseTime: {
    standard:
      process.env.NEXT_PUBLIC_CONTACT_RESPONSE_TIME ||
      "Chúng tôi sẽ phản hồi trong vòng 24 giờ",
    quick:
      process.env.NEXT_PUBLIC_QUICK_RESPONSE_TIME ||
      "Phản hồi từ 2-4 giờ trong giờ làm việc",
  },
  socialMedia: {
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "#",
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL || "#",
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "#",
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || "#",
  },
  legal: {
    copyright:
      process.env.NEXT_PUBLIC_COPYRIGHT_TEXT ||
      `© ${new Date().getFullYear()} ShopCart. Toàn bộ bản quyền được bảo lưu.`,
    privacyPolicy: process.env.NEXT_PUBLIC_PRIVACY_POLICY_URL || "/privacy",
    terms: process.env.NEXT_PUBLIC_TERMS_URL || "/terms",
  },
  support: {
    helpCenter: "/help",
    faq: "/faqs",
    trackOrder: "/track-order",
    returns: "/returns",
    shipping: "/shipping",
    sizeGuide: "/size-guide",
  },
};

// Contact information for different sections
export const contactInfo = [
  {
    icon: "MapPin",
    title: "Ghé Thăm Cửa Hàng",
    details: contactConfig.company.address,
    subDetails: contactConfig.company.city,
    color: "text-shop_dark_green",
    bgColor: "bg-shop_dark_green/10",
    href: `https://maps.google.com/?q=${encodeURIComponent(`${contactConfig.company.address}, ${contactConfig.company.city}`)}`,
  },
  {
    icon: "Phone",
    title: "Gọi Cho Chúng Tôi",
    details: contactConfig.company.phone,
    subDetails: contactConfig.businessHours.weekday,
    color: "text-shop_light_green",
    bgColor: "bg-shop_light_green/10",
    href: `tel:${contactConfig.company.phone.replace(/\D/g, "")}`,
  },
  {
    icon: "Mail",
    title: "Email Hỗ Trợ",
    details: contactConfig.emails.support,
    subDetails: contactConfig.responseTime.standard,
    color: "text-shop_orange",
    bgColor: "bg-shop_orange/10",
    href: `mailto:${contactConfig.emails.support}`,
  },
  {
    icon: "Clock",
    title: "Giờ Làm Việc",
    details: contactConfig.businessHours.weekday,
    subDetails: contactConfig.businessHours.weekend,
    color: "text-purple-600",
    bgColor: "bg-purple-600/10",
    href: null,
  },
];