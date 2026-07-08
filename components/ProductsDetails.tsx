"use client";

type ProductsDetailsProps = {
  detailDescription?: string | null;
  weight?: string | null;
  dimensions?: string | null;
};

const ProductsDetails = ({
  detailDescription,
  weight,
  dimensions,
}: ProductsDetailsProps) => {
  return (
    <div className="w-full space-y-8 mb-10">
      {/* Description Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-shop_dark_green mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-shop_orange rounded-full"></span>
          Mô tả chi tiết
        </h2>

        <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-line leading-7">
          {detailDescription || "Không có mô tả chi tiết."}
        </div>
      </div>

      {/* Additional Information Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-shop_dark_green mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-shop_orange rounded-full"></span>
          Thông tin bổ sung
        </h2>

        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 w-1/3">
                  Cân nặng
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {weight || "Cập nhật"}
                </td>
              </tr>

              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 w-1/3">
                  Kích thước
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {dimensions || "Cập nhật"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductsDetails;