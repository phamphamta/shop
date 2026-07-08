import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 401 });
    }

    // Mock data dữ liệu mẫu tiếng Việt (Thay thế bằng truy vấn database thực tế khi sẵn sàng)
    const orders = [
      {
        _id: "1",
        orderNumber: "ORD-2023-1001",
        totalAmount: 299.99,
        status: "Đang xử lý",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        items: [
          {
            name: "Tai nghe không dây",
            quantity: 1,
            price: 199.99,
          },
          {
            name: "Ốp lưng điện thoại",
            quantity: 2,
            price: 50.0,
          },
        ],
      },
      {
        _id: "2",
        orderNumber: "ORD-2023-1000",
        totalAmount: 159.99,
        status: "Đang vận chuyển",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        items: [
          {
            name: "Loa Bluetooth",
            quantity: 1,
            price: 159.99,
          },
        ],
      },
      {
        _id: "3",
        orderNumber: "ORD-2023-0999",
        totalAmount: 89.99,
        status: "Đã giao hàng",
        createdAt: new Date(
          Date.now() - 10 * 24 * 60 * 60 * 1000
        ).toISOString(),
        items: [
          {
            name: "Cáp sạc USB",
            quantity: 3,
            price: 29.99,
          },
        ],
      },
    ];

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return NextResponse.json(
      { error: "Lỗi hệ thống nội bộ" },
      { status: 500 }
    );
  }
}