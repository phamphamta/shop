import AccountRequestsClient from "@/components/admin/AccountRequestsClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yêu cầu tài khoản - Bảng điều khiển quản trị",
  description: "Quản lý hồ sơ đăng ký tài khoản cao cấp và tài khoản doanh nghiệp",
};

export default function AccountRequestsPage() {
  return <AccountRequestsClient />;
}