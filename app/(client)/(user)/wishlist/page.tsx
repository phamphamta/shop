import { currentUser } from "@clerk/nextjs/server";
import Container from "@/components/Container";
import NoAccessToCart from "@/components/NoAccessToCart";
import WishlistProducts from "@/components/WishlistProducts";
import { Heart } from "lucide-react";
import DynamicBreadcrumb from "@/components/DynamicBreadcrumb";

const WishListPage = async () => {
  const user = await currentUser();

  return (
    <Container className="py-6">
      {/* Thanh điều hướng (Breadcrumb) */}
      <DynamicBreadcrumb />

      {/* Tiêu đề trang */}
      <div className="flex items-center gap-2 mb-8">
        <Heart className="w-6 h-6 text-red-500" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Danh sách yêu thích</h1>
          <p className="text-gray-600 mt-1">
            Lưu lại những sản phẩm bạn yêu thích để mua sau
          </p>
        </div>
      </div>

      {/* Nội dung */}
      {user ? (
        <WishlistProducts />
      ) : (
        <NoAccessToCart details="Đăng nhập để lưu và xem các sản phẩm yêu thích của bạn. Đừng bỏ lỡ những món đồ mà bạn yêu thích nhé!" />
      )}
    </Container>
  );
};

export default WishListPage;