"use client";

import { useState } from "react";
import Container from "./Container";
import Title from "./Title";
import FeatureModal from "./FeatureModal";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Headphones,
  RefreshCw,
  Award,
  Clock,
  Heart,
  LucideIcon,
} from "lucide-react";

interface FeatureType {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  iconColor: string;
  details: string[];
  benefits: string[];
}

const ShopFeatures = () => {
  const [selectedFeature, setSelectedFeature] = useState<FeatureType | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const features: FeatureType[] = [
    {
      icon: ShieldCheck,
      title: "Thanh toán an toàn",
      description: "Thanh toán 100% an toàn với mã hóa SSL",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      details: [
        "Mã hóa SSL tiên tiến bảo vệ mọi giao dịch và thông tin cá nhân của bạn trong quá trình thanh toán.",
        "Hệ thống xử lý thanh toán tuân thủ tiêu chuẩn PCI DSS, đảm bảo các biện pháp bảo mật đạt chuẩn quốc tế.",
        "Cổng thanh toán an toàn từ các nhà cung cấp uy tín như Stripe và PayPal.",
        "Kiểm tra và giám sát bảo mật thường xuyên để phát hiện và ngăn chặn các hành vi gian lận.",
        "Thông tin tài chính của bạn không bao giờ được lưu trữ trên máy chủ của chúng tôi.",
      ],
      benefits: [
        "Mua sắm với sự an tâm tuyệt đối",
        "Bảo vệ thông tin cá nhân",
        "Thanh toán an toàn",
        "Hệ thống phòng chống gian lận",
        "Truyền dữ liệu được mã hóa",
        "Quy trình thanh toán được xác minh bảo mật",
      ],
    },
    {
      icon: Truck,
      title: "Vận chuyển miễn phí",
      description: "Miễn phí vận chuyển trên 100.000đ",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      details: [
        "Miễn phí vận chuyển tiêu chuẩn cho tất cả đơn hàng từ 50 USD trở lên trên toàn quốc.",
        "Theo dõi đơn hàng theo thời gian thực với hệ thống theo dõi hiện đại của chúng tôi.",
        "Hợp tác với các đơn vị vận chuyển uy tín để đảm bảo giao hàng nhanh chóng và an toàn.",
        "Sử dụng vật liệu đóng gói thân thiện với môi trường nhằm giảm thiểu tác động đến môi trường.",
        "Thời gian giao hàng từ 3–7 ngày làm việc, tùy thuộc vào khu vực của bạn.",
      ],
      benefits: [
        "Miễn phí vận chuyển",
        "Theo dõi đơn hàng theo thời gian thực",
        "Đối tác vận chuyển uy tín",
        "Bao bì thân thiện với môi trường",
        "Giao hàng tận nơi",
        "Không phát sinh phí ẩn",
      ],
    },
    {
      icon: CreditCard,
      title: "Thanh toán tiện lợi",
      description: "Nhiều tùy chọn thanh toán",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      details: [
        "Chấp nhận tất cả các loại thẻ tín dụng và thẻ ghi nợ phổ biến như Visa, Mastercard và American Express.",
        "Hỗ trợ các ví điện tử như PayPal, Apple Pay và Google Pay để thanh toán nhanh hơn.",
        "Hỗ trợ hình thức Mua trước - Trả sau thông qua các đối tác uy tín.",
        "Thanh toán chỉ với một lần nhấp dành cho khách hàng đã quay lại mua sắm.",
        "Hỗ trợ nhiều phương thức thanh toán quốc tế cho khách hàng trên toàn thế giới.",
      ],
      benefits: [
        "Đa dạng phương thức thanh toán",
        "Thanh toán nhanh chỉ với một lần nhấp",
        "Linh hoạt lựa chọn hình thức thanh toán",
        "Lưu thông tin phương thức thanh toán",
        "Chấp nhận thẻ thanh toán quốc tế",
        "Xác nhận thanh toán tức thì",
      ],
    },
    {
      icon: Headphones,
      title: "Hỗ trợ 24/7",
      description: "Hỗ trợ khách hàng 24/7",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      details: [
        "Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ 24/7 qua trò chuyện trực tuyến, email và điện thoại.",
        "Đội ngũ hỗ trợ giàu kinh nghiệm luôn sẵn sàng giải đáp mọi thắc mắc và xử lý các vấn đề của bạn.",
        "Thời gian phản hồi trung bình dưới 2 phút đối với các yêu cầu hỗ trợ qua trò chuyện trực tuyến.",
        "Hỗ trợ đa ngôn ngữ để phục vụ khách hàng trên toàn thế giới.",
        "Trung tâm trợ giúp và câu hỏi thường gặp (FAQ) đầy đủ giúp bạn dễ dàng tự tìm kiếm giải pháp.",
      ],
      benefits: [
        "Hỗ trợ 24/7",
        "Phản hồi nhanh chóng",
        "Đội ngũ hỗ trợ chuyên nghiệp",
        "Nhiều kênh liên hệ",
        "Hỗ trợ đa ngôn ngữ",
        "Tài liệu và hướng dẫn hữu ích",
      ],
    },
    {
      icon: RefreshCw,
      title: "Chính sách đổi trả",
      description: "Miễn phí đổi trả trong vòng 30 ngày",
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50",
      iconColor: "text-pink-600",
      details: [
        "Hỗ trợ đổi trả theo chính sách của cửa hàng.",
        "Quy trình đổi trả đơn giản và nhanh chóng.",
        "Nhân viên sẽ hướng dẫn bạn hoàn tất thủ tục đổi trả khi cần.",
        "Hoàn tiền theo điều kiện và thời gian quy định.",
        "Hỗ trợ đổi sản phẩm nếu đáp ứng các điều kiện bảo hành hoặc đổi trả.",
      ],
      benefits: [
        "Chính sách đổi trả rõ ràng",
        "Thủ tục đơn giản",
        "Hỗ trợ tận tình",
        "Hoàn tiền theo quy định",
        "Dễ dàng đổi sản phẩm",
        "Đảm bảo quyền lợi khách hàng",
      ],
    },
    {
      icon: Award,
      title: "Sản phẩm chất lượng",
      description: "Đảm bảo 100% sản phẩm chính hãng",
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
      details: [
        "Tất cả sản phẩm đều được nhập trực tiếp từ các nhà sản xuất và nhà phân phối được ủy quyền.",
        "Mỗi sản phẩm đều trải qua quy trình kiểm tra chất lượng nghiêm ngặt trước khi giao đến khách hàng.",
        "Cung cấp chứng nhận chính hãng đối với các sản phẩm cao cấp và có giá trị lớn (nếu áp dụng).",
        "Cam kết không kinh doanh hàng giả, hàng nhái hoặc hàng kém chất lượng.",
        "Chất lượng sản phẩm được đảm bảo thông qua chính sách bảo hành toàn diện của chúng tôi.",
      ],
      benefits: [
        "100% sản phẩm chính hãng",
        "Kiểm tra chất lượng nghiêm ngặt",
        "Nhập từ nhà cung cấp uy tín",
        "Chính sách bảo hành rõ ràng",
        "Cam kết nguồn gốc sản phẩm",
        "Tiêu chuẩn chất lượng cao",
      ],
    },
    {
      icon: Clock,
      title: "Đóng gói sản phẩm nhanh chóng",
      description: "Đơn hàng được xử lý trong vòng 24 giờ",
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
      details: [
        "Tất cả đơn hàng được đặt trước 15:00 sẽ được xử lý và giao cho đơn vị vận chuyển ngay trong ngày.",
        "Xác nhận đơn hàng sẽ được gửi ngay sau khi bạn hoàn tất thanh toán.",
        "Hỗ trợ các tùy chọn giao hàng nhanh cho những đơn hàng cần giao gấp.",
        "Hệ thống quản lý tồn kho theo thời gian thực giúp hạn chế tình trạng hết hàng và chậm trễ.",
        "Ưu tiên xử lý đơn hàng cho khách hàng thành viên và khách hàng thân thiết.",
      ],
      benefits: [
        "Xử lý đơn hàng trong ngày",
        "Xác nhận đơn hàng ngay lập tức",
        "Nhiều lựa chọn giao hàng nhanh",
        "Cập nhật trạng thái theo thời gian thực",
        "Ưu tiên xử lý đơn hàng",
        "Không chậm trễ trong quá trình xử lý",
      ],
    },
    {
      icon: Heart,
      title: "Giá tốt nhất",
      description: "Giá cả cạnh tranh với nhiều ưu đãi",
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
      details: [
        "Cam kết giá tốt nhất - chúng tôi sẽ so sánh giá và mang đến cho bạn mức giá cạnh tranh nhất.",
        "Giảm giá độc quyền dành cho thành viên và ưu tiên tiếp cận các chương trình khuyến mãi.",
        "Các ưu đãi đặc biệt hàng ngày và giảm giá chớp nhoáng cho các sản phẩm phổ biến.",
        "Chương trình khuyến mãi theo mùa và ưu đãi đặc biệt vào các dịp lễ, tết.",
        "Chương trình khách hàng thân thiết - tích lũy điểm cho mỗi lần mua hàng để nhận ưu đãi đặc biệt.",
      ],
      benefits: [
        "Giá cả cạnh tranh",
        "Cam kết giá tốt nhất",
        "Ưu đãi độc quyền",
        "Chương trình khuyến mãi thường xuyên",
        "Phần thưởng khách hàng thân thiết",
        "Giá trị tốt nhất cho số tiền bỏ ra",
      ],
    },
  ];

  const handleFeatureClick = (feature: FeatureType) => {
    setSelectedFeature(feature);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedFeature(null), 300);
  };

  return (
    <Container className="my-16 lg:my-24">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="h-1 w-12 bg-gradient-to-r from-shop_light_blue to-shop_dark_blue rounded-full"></div>
          <Title className="text-3xl lg:text-4xl font-bold text-dark-color">
            Tại sao nên mua sắm tại chúng tôi
          </Title>
          <div className="h-1 w-12 bg-gradient-to-l from-shop_light_blue to-shop_dark_blue rounded-full"></div>
        </div>
        <p className="text-light-color text-lg max-w-2xl mx-auto">
          Trải nghiệm mua sắm trực tuyến tốt nhất với cam kết về chất lượng, an toàn và dịch vụ tận tâm
        </p>
      </div>

      {/* Features Grid */}
      <div className="bg-gradient-to-br from-white via-shop_light_bg to-shop_light_pink p-8 lg:p-12 rounded-3xl shadow-xl border border-shop_light_blue/20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <button
                key={index}
                onClick={() => handleFeatureClick(feature)}
                className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl border border-gray-100 hover:border-shop_light_blue hoverEffect transform hover:-translate-y-2 cursor-pointer text-left w-full"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Icon Container */}
                <div className="flex justify-center mb-5">
                  <div
                    className={`relative w-16 h-16 rounded-2xl ${feature.bgColor} flex items-center justify-center group-hover:shadow-lg hoverEffect`}
                  >
                    <IconComponent
                      className={`w-8 h-8 ${feature.iconColor} group-hover:scale-110 hoverEffect`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-shop_light_blue/10 to-transparent opacity-0 group-hover:opacity-100 hoverEffect rounded-2xl"></div>
                  </div>
                </div>

                {/* Content */}
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-bold text-dark-color group-hover:text-shop_dark_blue hoverEffect">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-light-color leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="text-xs text-shop_dark_blue font-medium pt-2 opacity-0 group-hover:opacity-100 hoverEffect">
                    Click to learn more →
                  </div>
                </div>

                {/* Decorative Bottom Bar */}
                <div className="mt-4 w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className={`bg-gradient-to-r ${feature.color} h-1.5 rounded-full hoverEffect group-hover:w-full transition-all duration-500`}
                    style={{ width: "40%" }}
                  ></div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Stats Section */}
        <div className="mt-12 pt-8 border-t border-shop_light_blue/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-shop_dark_blue to-shop_light_blue bg-clip-text text-transparent mb-2">
                50K+
              </div>
              <div className="text-sm text-light-color font-medium">
                Khách hàng hài lòng
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-shop_dark_blue to-shop_light_blue bg-clip-text text-transparent mb-2">
                100K+
              </div>
              <div className="text-sm text-light-color font-medium">
                Đơn hàng đã bán
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-shop_dark_blue to-shop_light_blue bg-clip-text text-transparent mb-2">
                99%
              </div>
              <div className="text-sm text-light-color font-medium">
                Mức độ hài lòng
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-shop_dark_blue to-shop_light_blue bg-clip-text text-transparent mb-2">
                24/7
              </div>
              <div className="text-sm text-light-color font-medium">
                Hỗ trợ khách hàng
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-shop_light_pink to-shop_light_bg rounded-2xl border border-shop_light_blue/20 shadow-md">
            <ShieldCheck className="w-6 h-6 text-shop_dark_blue" />
            <span className="text-dark-text font-semibold">
              Được hàng nghìn khách hàng hài lòng trên toàn thế giới tin tưởng
            </span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className="w-5 h-5 text-yellow-400 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Feature Modal */}
      <FeatureModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        feature={selectedFeature}
      />
    </Container>
  );
};

export default ShopFeatures;
