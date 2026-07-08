import { Metadata } from "next";
import EmployeeManagement from "@/components/admin/EmployeeManagement";

export const metadata: Metadata = {
  title: "Quản lý nhân viên | Bảng điều khiển quản trị",
  description: "Quản lý vai trò và quyền của nhân viên",
};

export default function EmployeeManagementPage() {
  return <EmployeeManagement />;
}