import { Metadata } from "next";
import { contactConfig } from "@/config/contact";

export const metadata: Metadata = {
  title: `Xác thực tài khoản - ${contactConfig.company.name}`,
  description: `Đăng nhập hoặc tạo tài khoản tại ${contactConfig.company.name} để nhận ưu đãi độc quyền, theo dõi đơn hàng và tận hưởng trải nghiệm mua sắm được cá nhân hóa.`,
  keywords: [
    "đăng nhập",
    "đăng ký",
    "tài khoản",
    "xác thực",
    "mua sắm",
    "theo dõi đơn hàng",
  ],
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="auth-layout">{children}</div>;
}