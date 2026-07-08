import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Hệ thống Quản trị Bán hàng",
  description: "Được tạo bởi create next app",
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export default RootLayout;