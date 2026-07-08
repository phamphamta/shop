"use client";

import { Product } from "@/sanity.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, Shield, Award } from "lucide-react";

interface ProductSpecsProps {
  product: Product;
}

const ProductSpecs = ({ product }: ProductSpecsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
      {/* Product Features */}
      <Card className="border-2 border-gray-100 hover:border-shop_light_green/30 transition-colors">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-shop_orange" />
            <CardTitle className="text-sm font-semibold">
              Thông tin sản phẩm
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tồn kho:</span>
            <Badge
              variant={product?.stock === 0 ? "destructive" : "default"}
              className={
                product?.stock === 0
                  ? ""
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              }
            >
              {product?.stock === 0
                ? "Hết hàng"
                : `Còn ${product?.stock} sản phẩm`}
            </Badge>
          </div>
          {product?.brand && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Thương hiệu:</span>
              <span className="font-medium">Thương hiệu</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">SKU:</span>
            <span className="font-medium text-xs text-gray-500">
              #{product?.slug?.current?.slice(-8).toUpperCase()}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Info */}
      <Card className="border-2 border-gray-100 hover:border-shop_light_green/30 transition-colors">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-shop_orange" />
            <CardTitle className="text-sm font-semibold">Vận chuyển</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-medium">✓ Miễn phí vận chuyển</span>
          </div>
          <div className="text-gray-600">Ước tính: 2-5 ngày làm việc</div>
          <div className="text-gray-600">Hỏa tốc: 1-2 ngày làm việc</div>
        </CardContent>
      </Card>

      {/* Warranty */}
      <Card className="border-2 border-gray-100 hover:border-shop_light_green/30 transition-colors">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-shop_orange" />
            <CardTitle className="text-sm font-semibold">Bảo hành</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="text-gray-600">
            Bảo hành nhà sản xuất{" "}
            <span className="font-medium text-shop_dark_green">1 năm</span>
          </div>
          <div className="text-gray-600">
            Chính sách đổi trả{" "}
            <span className="font-medium text-shop_dark_green">30 ngày</span>
          </div>
          <div className="text-gray-600">Hỗ trợ kỹ thuật miễn phí</div>
        </CardContent>
      </Card>

      {/* Quality Assurance */}
      <Card className="border-2 border-gray-100 hover:border-shop_light_green/30 transition-colors">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-shop_orange" />
            <CardTitle className="text-sm font-semibold">Chất lượng</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-medium">✓ Đã kiểm định chất lượng</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-medium">
              ✓ Sản phẩm chính hãng
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-medium">
              ✓ Đóng gói an toàn
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductSpecs;
