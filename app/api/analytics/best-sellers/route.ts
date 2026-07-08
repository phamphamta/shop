// API Analytics để theo dõi các sản phẩm bán chạy nhất và phân tích toàn diện
import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/sanity/lib/backendClient";

interface OrderProduct {
  product: {
    _id: string;
    name: string;
    category: string;
    price?: number;
    images?: Array<{
      asset?: {
        url?: string;
      };
    }>;
  };
  quantity: number;
  price: number;
}

interface Order {
  status: string;
  products?: OrderProduct[];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get("timeframe") || "monthly"; // weekly, monthly, yearly
    const limit = parseInt(searchParams.get("limit") || "10");

    // Tính toán khoảng thời gian dựa trên timeframe
    const now = new Date();
    let startDate: Date;

    switch (timeframe) {
      case "weekly":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "yearly":
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default: // monthly
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Truy vấn lấy danh sách sản phẩm bán chạy nhất
    const bestSellingQuery = `
      *[_type == "order" && orderDate >= $startDate] {
        products[] {
          product->,
          quantity
        },
        totalPrice,
        status
      }
    `;

    const orders = await backendClient.fetch(bestSellingQuery, {
      startDate: startDate.toISOString(),
    });

    // Xử lý dữ liệu để lấy thống kê doanh số sản phẩm
    const productStats = new Map();

    orders.forEach((order: Order) => {
      if (order.status === "delivered" || order.status === "paid") {
        order.products?.forEach((item: OrderProduct) => {
          if (item.product) {
            const productId = item.product._id;
            const existing = productStats.get(productId) || {
              productId,
              name: item.product.name,
              category: item.product.category,
              salesCount: 0,
              revenue: 0,
              imageUrl: item.product.images?.[0]?.asset?.url || null,
            };

            existing.salesCount += item.quantity;
            existing.revenue += (item.product.price || 0) * item.quantity;
            productStats.set(productId, existing);
          }
        });
      }
    });

    // Chuyển thành mảng và sắp xếp theo số lượng bán ra
    const bestSellers = Array.from(productStats.values())
      .sort((a, b) => b.salesCount - a.salesCount)
      .slice(0, limit);

    // Gửi log theo dõi dữ liệu phân tích này
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        }/api/analytics/track`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventName: "best_selling_products",
            eventParams: {
              products: bestSellers,
              timeframe,
              totalProducts: bestSellers.length,
              totalRevenue: bestSellers.reduce((sum, p) => sum + p.revenue, 0),
              totalSales: bestSellers.reduce((sum, p) => sum + p.salesCount, 0),
            },
          }),
        }
      );
    } catch (analyticsError) {
      console.error(
        "Failed to track best selling products analytics:",
        analyticsError
      );
    }

    // Lấy dữ liệu phân tích tổng quan
    const totalOrdersQuery = `count(*[_type == "order" && orderDate >= $startDate])`;
    const revenueOrdersQuery = `
      *[_type == "order" && orderDate >= $startDate && (status == "delivered" || status == "paid")].totalPrice
    `;

    const [totalOrders, revenuePrices] = await Promise.all([
      backendClient.fetch(totalOrdersQuery, {
        startDate: startDate.toISOString(),
      }),
      backendClient.fetch(revenueOrdersQuery, {
        startDate: startDate.toISOString(),
      }),
    ]);

    // Tính toán thủ công tổng doanh thu
    const totalRevenue = Array.isArray(revenuePrices)
      ? revenuePrices.reduce((sum, price) => sum + (price || 0), 0)
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        bestSellers,
        analytics: {
          timeframe,
          totalOrders: totalOrders || 0,
          totalRevenue,
          totalProducts: bestSellers.length,
          averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
        },
      },
    });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: "Lấy dữ liệu phân tích thất bại" }, // Đã đổi text hiển thị ở đây
      { status: 500 }
    );
  }
}