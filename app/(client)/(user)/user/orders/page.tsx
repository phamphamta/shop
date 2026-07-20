import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getMyOrders } from "@/sanity/helpers";
import Title from "@/components/Title";
import OrdersClient from "@/components/OrdersClient";

interface OrdersPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

async function UserOrdersPage({ searchParams }: OrdersPageProps) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { page } = await searchParams;
  const currentPage = parseInt(page || "1", 10);
  const ordersPerPage = 20;

  const orderData = await getMyOrders(user.id, currentPage, ordersPerPage);
  const { orders, totalCount, totalPages, hasNextPage, hasPrevPage } =
    orderData;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Đơn hàng của tôi
        </h1>
        {totalCount > 0 && (
          <p className="text-sm text-muted-foreground mt-2">
            Hiển thị {orders.length} trên tổng số {totalCount} đơn hàng
          </p>
        )}
      </div>

      <OrdersClient
        initialOrders={orders}
        totalPages={totalPages}
        currentPage={currentPage}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
      />
    </div>
  );
}

export default UserOrdersPage;