import AdminOrders from "@/components/admin/AdminOrders";
import { auth } from "@clerk/nextjs/server";

const AdminOrdersPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-600">
          Vui lòng đăng nhập để truy cập trang này
        </p>
      </div>
    );
  }

  // Admin view - no employee check needed as this is admin-only route
  return <AdminOrders />;
};

export default AdminOrdersPage;