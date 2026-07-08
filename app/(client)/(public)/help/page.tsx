"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  Mail,
  Phone,
  MessageSquare,
  Clock,
  ChevronRight,
  Search,
  ShoppingBag,
  CreditCard,
  Truck,
  RotateCcw,
  Shield,
  BookOpen,
  Video,
} from "lucide-react";
import Link from "next/link";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const HelpPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const helpCategories = [
    {
      title: "Bắt đầu sử dụng",
      icon: BookOpen,
      description: "Tìm hiểu các bước mua sắm cơ bản cùng chúng tôi",
      color: "from-shop_light_green to-shop_dark_green",
      links: [
        { title: "Cách tạo tài khoản", href: "/faq#account-1" },
        { title: "Đặt đơn hàng đầu tiên", href: "/faq#shopping-1" },
        { title: "Thiết lập phương thức thanh toán", href: "/faq#payment-1" },
        { title: "Quản lý thông tin cá nhân", href: "/faq#account-3" },
      ],
    },
    {
      title: "Đơn hàng & Mua sắm",
      icon: ShoppingBag,
      description: "Mọi thông tin về việc đặt hàng và quản lý đơn hàng",
      color: "from-shop_orange to-shop_light_orange",
      links: [
        { title: "Cách đặt mua hàng", href: "/faq#shopping-1" },
        { title: "Thay đổi thông tin đơn hàng", href: "/faq#shopping-2" },
        { title: "Theo dõi đơn hàng", href: "/faq#shopping-3" },
        { title: "Sản phẩm hết hàng", href: "/faq#shopping-4" },
      ],
    },
    {
      title: "Thanh toán & Hóa đơn",
      icon: CreditCard,
      description: "Các phương thức thanh toán, hóa đơn và hoàn tiền",
      color: "from-light-blue to-dark-blue",
      links: [
        { title: "Phương thức thanh toán được chấp nhận", href: "/faq#payment-1" },
        { title: "Bảo mật thanh toán", href: "/faq#payment-2" },
        { title: "Thời điểm bị trừ tiền", href: "/faq#payment-3" },
        { title: "Hoàn tiền & Trả hàng", href: "/faq#payment-4" },
      ],
    },
    {
      title: "Vận chuyển & Giao hàng",
      icon: Truck,
      description: "Các tùy chọn vận chuyển, chi phí và thông tin giao hàng",
      color: "from-shop_light_green to-light-green",
      links: [
        { title: "Chi phí vận chuyển", href: "/faq#shipping-1" },
        { title: "Thời gian giao hàng", href: "/faq#shipping-2" },
        { title: "Giao hàng quốc tế", href: "/faq#shipping-3" },
        { title: "Đơn hàng bị thất lạc hoặc hư hỏng", href: "/faq#shipping-4" },
      ],
    },
    {
      title: "Đổi trả & Hoàn tiền",
      icon: RotateCcw,
      description: "Chính sách đổi trả, quy trình đổi hàng và hoàn tiền",
      color: "from-dark-red to-light-orange",
      links: [
        { title: "Chính sách đổi trả", href: "/faq#returns-1" },
        { title: "Cách gửi trả lại sản phẩm", href: "/faq#returns-2" },
        { title: "Thời gian nhận lại tiền hoàn", href: "/faq#returns-3" },
        { title: "Chính sách đổi sản phẩm", href: "/faq#returns-4" },
      ],
    },
    {
      title: "Tài khoản & Bảo mật",
      icon: Shield,
      description: "Quản lý tài khoản và các tính năng bảo mật",
      color: "from-shop_dark_green to-shop_btn_dark_green",
      links: [
        { title: "Bảo mật tài khoản", href: "/faq#account-1" },
        { title: "Đặt lại mật khẩu", href: "/faq#account-2" },
        { title: "Cập nhật thông tin", href: "/faq#account-3" },
        { title: "Xóa tài khoản", href: "/faq#account-4" },
      ],
    },
  ];

  const quickActions = [
    {
      title: "Theo dõi đơn hàng",
      description: "Kiểm tra trạng thái các đơn hàng gần đây của bạn",
      icon: Search,
      action: "Tra cứu đơn hàng",
      href: "/orders",
      color: "bg-shop_light_green",
    },
    {
      title: "Liên hệ hỗ trợ",
      description: "Nhận trợ giúp từ đội ngũ chăm sóc khách hàng",
      icon: MessageSquare,
      action: "Liên hệ ngay",
      href: "/contact",
      color: "bg-shop_orange",
    },
    {
      title: "Đổi trả sản phẩm",
      description: "Bắt đầu quy trình yêu cầu trả hàng hoặc đổi hàng",
      icon: RotateCcw,
      action: "Yêu cầu đổi trả",
      href: "/orders",
      color: "bg-dark-blue",
    },
  ];

  const supportChannels = [
    {
      title: "Chat trực tuyến",
      description: "Trò chuyện trực tiếp với đội ngũ hỗ trợ theo thời gian thực",
      icon: MessageSquare,
      availability: "Hỗ trợ 24/7",
      response: "Phản hồi ngay lập tức",
      action: "Bắt đầu chat",
      color:
        "border-shop_light_green text-shop_light_green hover:bg-shop_light_green",
    },
    {
      title: "Hỗ trợ qua Email",
      description: "Gửi thông tin chi tiết về sự cố bạn đang gặp phải",
      icon: Mail,
      availability: "Luôn mở cửa",
      response: "Trong vòng 2 giờ",
      action: "Gửi Email",
      color: "border-shop_orange text-shop_orange hover:bg-shop_orange",
      href: "/contact",
    },
    {
      title: "Hỗ trợ qua điện thoại",
      description: "Trao đổi trực tiếp với nhân viên tư vấn hỗ trợ",
      icon: Phone,
      availability: "Thứ 2 - Thứ 6, 9AM-6PM EST",
      response: "Kết nối ngay",
      action: "Gọi ngay",
      color: "border-dark-blue text-dark-blue hover:bg-dark-blue",
      phone: "+1 (555) 123-4567",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-shop_light_bg to-white min-h-screen">
      {/* Hero Banner Section */}
      <section className="py-20 bg-gradient-to-r from-shop_dark_green to-shop_light_green text-white">
        <Container className="max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
              Hỗ trợ 24/7
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">Trung tâm hỗ trợ</h1>
            <p className="text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Tìm kiếm câu trả lời, nhận hỗ trợ và giải quyết các vấn đề nhanh chóng. Chúng tôi luôn sẵn sàng đồng hành để mang đến cho bạn trải nghiệm mua sắm tuyệt vời nhất.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Main Content */}
      <Container className="py-12 lg:py-16">
        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto mb-16"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            <Input
              type="text"
              placeholder="Tìm kiếm chủ đề hỗ trợ, đơn hàng, hoặc sự cố..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-14 py-6 text-lg border-2 border-gray-200 focus:border-shop_light_green rounded-xl shadow-sm"
            />
            <Button
              className="absolute right-2 top-2 bg-shop_light_green hover:bg-shop_dark_green"
              size="lg"
            >
              Tìm kiếm
            </Button>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-shop_dark_green mb-8 text-center">
            Thao tác nhanh
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                >
                  <Link href={action.href}>
                    <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-white/70 backdrop-blur-sm">
                      <CardContent className="p-6 text-center">
                        <div
                          className={`inline-flex items-center justify-center w-16 h-16 ${action.color} rounded-full mb-4`}
                        >
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-shop_dark_green mb-2">
                          {action.title}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {action.description}
                        </p>
                        <Button
                          variant="outline"
                          className="border-shop_light_green text-shop_light_green hover:bg-shop_light_green hover:text-white"
                        >
                          {action.action}
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Help Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-shop_dark_green mb-8 text-center">
            Danh mục trợ giúp
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 * index }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <div
                        className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${category.color} rounded-lg mb-3`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-shop_dark_green">
                        {category.title}
                      </CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {category.links.map((link, linkIndex) => (
                        <Link
                          key={linkIndex}
                          href={link.href}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 transition-colors group"
                        >
                          <span className="text-sm text-gray-700 group-hover:text-shop_dark_green">
                            {link.title}
                          </span>
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-shop_light_green" />
                        </Link>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Support Channels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-shop_dark_green mb-8 text-center">
            Nhận hỗ trợ cá nhân
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {supportChannels.map((channel, index) => {
              const Icon = channel.icon;
              return (
                <motion.div
                  key={channel.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                >
                  <Card className="h-full text-center hover:shadow-lg transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-100 rounded-full mb-4 mx-auto">
                        <Icon className="w-7 h-7 text-gray-600" />
                      </div>
                      <CardTitle className="text-shop_dark_green">
                        {channel.title}
                      </CardTitle>
                      <CardDescription className="mb-4">
                        {channel.description}
                      </CardDescription>
                      <div className="space-y-1">
                        <div className="text-sm text-gray-600">
                          <Clock className="w-4 h-4 inline mr-1" />
                          {channel.availability}
                        </div>
                        <div className="text-sm text-gray-600">
                          Phản hồi: {channel.response}
                        </div>
                      </div>
                    </CardHeader>
                    <CardFooter>
                      <Link
                        href={channel.href || "/contact"}
                        className="w-full"
                      >
                        <Button
                          variant="outline"
                          className={`w-full ${channel.color} hover:text-white transition-all duration-200`}
                        >
                          {channel.action}
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Additional Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-shop_light_green to-shop_dark_green text-white shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-2">Bạn cần thêm trợ giúp?</CardTitle>
              <CardDescription className="text-white/80">
                Khám phá thêm các nguồn tài liệu và hướng dẫn chi tiết của chúng tôi
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <Link href="/faq">
                  <Button
                    variant="secondary"
                    className="w-full bg-white text-shop_dark_green hover:bg-gray-100"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Xem Câu hỏi thường gặp
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    variant="secondary"
                    className="w-full bg-white text-shop_dark_green hover:bg-gray-100"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Liên hệ với chúng tôi
                  </Button>
                </Link>
                <Button
                  variant="secondary"
                  className="w-full bg-white text-shop_dark_green hover:bg-gray-100"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Hướng dẫn bằng Video
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </div>
  );
};
export default HelpPage;