import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOrderById } from "@/sanity/queries";
import { currentUser } from "@clerk/nextjs/server";
import OrderDetailsPage from "@/components/OrderDetailsPage";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    return {
      title: "Không tìm thấy đơn hàng",
    };
  }

  return {
    title: `Đơn hàng ${order.orderNumber} - Shopcart`,
    description: `Chi tiết đơn hàng của khách hàng ${order.customerName}`,
  };
}

export default async function OrderDetailsPageRoute({ params }: Props) {
  const user = await currentUser();
  const { id } = await params;

  if (!user) {
    notFound();
  }

  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  // Kiểm tra bảo mật: đảm bảo người dùng chỉ có thể xem đơn hàng của chính họ
  if (order.clerkUserId !== user.id) {
    notFound();
  }

  return (
    <div className="w-full">
      <OrderDetailsPage order={order} />
    </div>
  );
}