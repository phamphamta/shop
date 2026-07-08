import AdminPremiumFeature from "@/components/admin/AdminPremiumFeature";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý đăng ký nhận tin - Bảng điều khiển quản trị",
  description: "Quản lý các đăng ký nhận tin",
};

export default function SubscriptionsPage() {
  return (
    <AdminPremiumFeature
      featureName="Quản lý đăng ký"
      description="Quản lý các đăng ký nhận tin, phân nhóm đối tượng của bạn và gửi các chiến dịch được nhắm mục tiêu với các công cụ quản lý đăng ký cao cấp của chúng tôi."
    />
  );
}