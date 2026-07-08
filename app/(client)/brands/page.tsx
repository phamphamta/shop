import Container from "@/components/Container";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

const BrandsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-shop_light_bg via-white to-shop_light_pink">
      <Container className="py-10">
        {/* Thanh điều hướng (Breadcrumb) */}
        <div className="mb-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Trang chủ</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Thương hiệu</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Nội dung thông báo */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-shop_dark_green mb-4">
            Mua sắm theo Thương hiệu
          </h1>
          <p className="text-lg text-dark-text">
            Sắp ra mắt - Tính năng tìm kiếm sản phẩm theo thương hiệu yêu thích của bạn
          </p>
        </div>
      </Container>
    </div>
  );
};

export default BrandsPage;