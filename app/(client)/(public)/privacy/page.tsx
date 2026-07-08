"use client";

import { motion } from "motion/react";
import {
  Shield,
  Eye,
  Lock,
  Cookie,
  Database,
  UserCheck,
  AlertTriangle,
  Download,
  Trash2,
  Settings,
  Mail,
  Clock,
} from "lucide-react";
import Container from "@/components/Container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

const PrivacyPage = () => {
  const privacyHighlights = [
    {
      icon: Shield,
      title: "Bảo vệ dữ liệu",
      description: "Thông tin của bạn được mã hóa và lưu trữ an toàn",
      color: "text-shop_dark_green",
    },
    {
      icon: Eye,
      title: "Tính minh bạch",
      description: "Thông tin rõ ràng về cách dữ liệu của bạn được sử dụng",
      color: "text-shop_light_green",
    },
    {
      icon: UserCheck,
      title: "Quyền kiểm soát",
      description: "Quản lý cài đặt quyền riêng tư và tùy chọn cá nhân",
      color: "text-shop_orange",
    },
    {
      icon: Lock,
      title: "Xử lý an toàn",
      description: "Bảo mật chuẩn công nghiệp cho mọi giao dịch",
      color: "text-shop_dark_green",
    },
  ];

  const dataTypes = [
    {
      category: "Thông tin tài khoản",
      items: [
        "Tên và thông tin liên hệ",
        "Thông tin đăng nhập tài khoản",
        "Tùy chọn hồ sơ cá nhân",
        "Lịch sử trao đổi thông tin",
      ],
      icon: UserCheck,
    },
    {
      category: "Dữ liệu mua hàng",
      items: [
        "Lịch sử đơn hàng",
        "Thông tin thanh toán",
        "Địa chỉ giao hàng",
        "Đánh giá sản phẩm",
      ],
      icon: Database,
    },
    {
      category: "Phân tích sử dụng",
      items: [
        "Tương tác trên website",
        "Xu hướng sử dụng tính năng",
        "Chỉ số hiệu suất",
        "Nhật ký lỗi hệ thống",
      ],
      icon: Eye,
    },
    {
      category: "Thông tin thiết bị",
      items: [
        "Trình duyệt và loại thiết bị",
        "Địa chỉ IP",
        "Hệ điều hành",
        "Cookies và theo dõi",
      ],
      icon: Settings,
    },
  ];

  const userRights = [
    {
      right: "Truy cập dữ liệu",
      description:
        "Yêu cầu một bản sao của tất cả các thông tin cá nhân chúng tôi có về bạn",
      icon: Download,
      action: "Yêu cầu xuất dữ liệu",
    },
    {
      right: "Cập nhật thông tin",
      description: "Sửa đổi hoặc cập nhật bất kỳ thông tin cá nhân nào chưa chính xác",
      icon: Settings,
      action: "Quản lý hồ sơ",
    },
    {
      right: "Xóa tài khoản",
      description:
        "Yêu cầu xóa bỏ hoàn toàn tài khoản và dữ liệu liên quan của bạn",
      icon: Trash2,
      action: "Xóa tài khoản",
    },
    {
      right: "Kiểm soát thông báo",
      description: "Quản lý các tùy chọn email và thông tin truyền thông tiếp thị",
      icon: Mail,
      action: "Cài đặt Email",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-shop_light_bg to-white min-h-screen">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-shop_dark_green to-shop_light_green text-white">
        <Container className="max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Shield className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Chính sách bảo mật
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Quyền riêng tư của bạn là nền tảng cốt lõi trong cách chúng tôi vận hành. Tìm hiểu cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn.
            </p>
            <Badge className="mt-6 bg-white/20 text-white border-white/30">
              Cập nhật lần cuối: Tháng 1 năm 2024
            </Badge>
          </motion.div>
        </Container>
      </section>

      {/* Privacy Highlights */}
      <section className="py-12 -mt-8">
        <Container className="max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-center text-shop_dark_green">
                  Cam kết bảo mật của chúng tôi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {privacyHighlights.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="text-center group"
                    >
                      <div className="p-3 bg-shop_light_green/10 rounded-lg w-fit mx-auto mb-3 group-hover:bg-shop_light_green/20 transition-colors">
                        <item.icon
                          className={`w-8 h-8 ${item.color} group-hover:scale-110 transition-transform`}
                        />
                      </div>
                      <h3 className="font-semibold text-shop_dark_green mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-dark-text">
                        {item.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </Container>
      </section>

      {/* Data Collection */}
      <section className="py-12">
        <Container className="max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-shop_light_green/10 text-shop_dark_green hover:bg-shop_light_green/20">
              Dữ liệu chúng tôi thu thập
            </Badge>
            <h2 className="text-3xl font-bold text-shop_dark_green mb-4">
              Các loại thông tin chúng tôi xử lý
            </h2>
            <p className="text-lg text-dark-text max-w-3xl mx-auto">
              Chúng tôi thu thập các loại thông tin khác nhau nhằm mang lại cho bạn trải nghiệm mua sắm tốt nhất trong khi vẫn tôn trọng quyền riêng tư của bạn.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {dataTypes.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-shop_dark_green">
                      <div className="p-2 bg-shop_light_green/10 rounded-lg">
                        <category.icon className="w-5 h-5 text-shop_light_green" />
                      </div>
                      {category.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {category.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-shop_light_green rounded-full mt-2 flex-shrink-0" />
                          <span className="text-dark-text text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Detailed Privacy Policy */}
      <section className="py-12 bg-shop_light_bg">
        <Container className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-shop_dark_green mb-4">
              Chính sách bảo mật chi tiết
            </h2>
            <p className="text-lg text-dark-text">
              Thông tin đầy đủ về cách chúng tôi xử lý dữ liệu của bạn
            </p>
          </motion.div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="collection">
              <Card>
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-white/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-shop_light_green" />
                    <span className="text-lg font-semibold text-shop_dark_green">
                      Thu thập & Sử dụng thông tin
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <Separator className="mb-4" />
                  <div className="space-y-4 text-dark-text">
                    <p>
                      Chúng tôi thu thập thông tin để cung cấp dịch vụ tốt hơn cho mọi người dùng. Thông tin chúng tôi thu thập được phân chia thành các danh mục sau:
                    </p>
                    <ul className="space-y-2 pl-4">
                      <li>
                        • Thông tin bạn cung cấp khi tạo tài khoản hoặc thực hiện mua hàng
                      </li>
                      <li>
                        • Thông tin tự động được thu thập qua cookies và các công nghệ tương tự
                      </li>
                      <li>
                        • Dữ liệu trao đổi thông tin khi bạn liên hệ với đội ngũ hỗ trợ của chúng tôi
                      </li>
                      <li>
                        • Phân tích sử dụng để cải thiện website và dịch vụ của chúng tôi
                      </li>
                    </ul>
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>

            <AccordionItem value="sharing">
              <Card>
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-white/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-shop_light_green" />
                    <span className="text-lg font-semibold text-shop_dark_green">
                      Chia sẻ & Tiết lộ thông tin
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <Separator className="mb-4" />
                  <div className="space-y-4 text-dark-text">
                    <p>
                      Chúng tôi không bán, trao đổi hoặc cho bên thứ ba thuê thông tin cá nhân của bạn. Chúng tôi chỉ có thể chia sẻ thông tin trong một số trường hợp giới hạn sau đây:
                    </p>
                    <ul className="space-y-2 pl-4">
                      <li>
                        • Với các nhà cung cấp dịch vụ hỗ trợ vận hành (xử lý thanh toán, vận chuyển)
                      </li>
                      <li>
                        • Khi pháp luật yêu cầu hoặc để bảo vệ quyền lợi và sự an toàn của chúng tôi
                      </li>
                      <li>
                        • Khi có sự đồng ý rõ ràng của bạn cho các mục đích cụ thể
                      </li>
                      <li>
                        • Liên quan đến việc chuyển nhượng kinh doanh hoặc sáp nhập doanh nghiệp
                      </li>
                    </ul>
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>

            <AccordionItem value="security">
              <Card>
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-white/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-shop_light_green" />
                    <span className="text-lg font-semibold text-shop_dark_green">
                      An ninh & Bảo mật dữ liệu
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <Separator className="mb-4" />
                  <div className="space-y-4 text-dark-text">
                    <p>
                      Chúng tôi triển khai các biện pháp bảo mật chuẩn công nghiệp để bảo vệ thông tin của bạn:
                    </p>
                    <ul className="space-y-2 pl-4">
                      <li>• Mã hóa SSL cho mọi hoạt động truyền tải dữ liệu</li>
                      <li>
                        • Lưu trữ dữ liệu an toàn cùng các đợt kiểm tra bảo mật định kỳ
                      </li>
                      <li>
                        • Kiểm soát quyền truy cập để giới hạn những ai có thể xem thông tin của bạn
                      </li>
                      <li>• Tập huấn bảo mật định kỳ cho các thành viên trong đội ngũ của chúng tôi</li>
                      <li>
                        • Quy trình ứng phó sự cố đối với các rủi ro rò rỉ dữ liệu tiềm ẩn
                      </li>
                    </ul>
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>

            <AccordionItem value="cookies">
              <Card>
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-white/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Cookie className="w-5 h-5 text-shop_light_green" />
                    <span className="text-lg font-semibold text-shop_dark_green">
                      Cookies & Công nghệ theo dõi
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <Separator className="mb-4" />
                  <div className="space-y-4 text-dark-text">
                    <p>
                      Chúng tôi sử dụng cookies và các công nghệ tương tự để cải thiện trải nghiệm duyệt web của bạn:
                    </p>
                    <ul className="space-y-2 pl-4">
                      <li>• Cookies thiết yếu để đảm bảo chức năng hoạt động của website</li>
                      <li>• Cookies phân tích để hiểu rõ xu hướng sử dụng của người dùng</li>
                      <li>
                        • Cookies tiếp thị phục vụ cho quảng cáo cá nhân hóa (khi có sự đồng ý)
                      </li>
                      <li>• Cookies tùy chọn để ghi nhớ các thiết lập cá nhân của bạn</li>
                    </ul>
                    <p className="mt-4">
                      Bạn có thể tùy chỉnh các tùy chọn cookie thông qua cài đặt trình duyệt hoặc trung tâm tùy chỉnh cookie của chúng tôi.
                    </p>
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>
          </Accordion>
        </Container>
      </section>

      {/* Your Rights */}
      <section className="py-16">
        <Container className="max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-shop_orange/10 text-shop_orange hover:bg-shop_orange/20">
              Quyền riêng tư của bạn
            </Badge>
            <h2 className="text-3xl font-bold text-shop_dark_green mb-4">
              Kiểm soát dữ liệu của bạn
            </h2>
            <p className="text-lg text-dark-text max-w-3xl mx-auto">
              Bạn có quyền kiểm soát cách thông tin cá nhân của mình được thu thập, sử dụng và chia sẻ. Dưới đây là những gì bạn có thể thực hiện:
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {userRights.map((right, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-2 bg-shop_light_green/10 rounded-lg group-hover:bg-shop_light_green/20 transition-colors">
                        <right.icon className="w-5 h-5 text-shop_light_green" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-shop_dark_green mb-2">
                          {right.right}
                        </h3>
                        <p className="text-dark-text text-sm mb-4">
                          {right.description}
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-shop_light_green text-shop_light_green hover:bg-shop_light_green/5"
                        >
                          {right.action}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-shop_light_bg">
        <Container className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="text-center">
              <CardContent className="p-8">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-shop_orange" />
                <h3 className="text-2xl font-bold text-shop_dark_green mb-4">
                  Bạn có thắc mắc hoặc lo ngại về bảo mật?
                </h3>
                <p className="text-dark-text mb-6 max-w-2xl mx-auto">
                  Đội ngũ chuyên trách về quyền riêng tư của chúng tôi luôn sẵn sàng giúp bạn hiểu rõ quyền lợi của mình và hỗ trợ thực hiện bất kỳ yêu cầu hay thắc mắc nào liên quan đến dữ liệu.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    asChild
                    className="bg-shop_dark_green hover:bg-shop_btn_dark_green"
                  >
                    <Link href="/contact">Liên hệ Đội ngũ Bảo mật</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-shop_light_green text-shop_light_green hover:bg-shop_light_green/5"
                  >
                    <Link href="/faq">FAQ về Bảo mật</Link>
                  </Button>
                </div>
                <p className="text-sm text-light-text mt-6">
                  Gửi email trực tiếp cho chúng tôi tại{" "}
                  <a
                    href="mailto:privacy@shopcart.com"
                    className="text-shop_light_green hover:underline"
                  >
                    privacy@shopcart.com
                  </a>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </Container>
      </section>

      {/* Footer Note */}
      <section className="py-8 border-t border-gray-200">
        <Container className="max-w-4xl">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-shop_light_green" />
              <p className="text-sm text-light-text">
                Chính sách bảo mật này được cập nhật lần cuối vào ngày 15 tháng 1 năm 2024
              </p>
            </div>
            <p className="text-xs text-light-text">
              Chúng tôi có thể cập nhật chính sách này theo định kỳ. Chúng tôi sẽ thông báo cho bạn về những thay đổi quan trọng qua email hoặc thông báo trực tiếp trên website.
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default PrivacyPage;