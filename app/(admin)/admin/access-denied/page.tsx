import AccessDeniedContent from "@/components/admin/AccessDeniedContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Truy cập bị từ chối - Bảng quản trị",
  description: "Bạn không có quyền truy cập vào bảng quản trị",
};

export default function AccessDeniedPage() {
  return <AccessDeniedContent />;
}
