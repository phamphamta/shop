"use client";

import { motion } from "motion/react";
import {
  FileText,
  ShoppingCart,
  Shield,
  CreditCard,
  Truck,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Mail,
  Scale,
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

const TermsPage = () => {
  const quickLinks = [
    { icon: ShoppingCart, title: "Đơn hàng & Mua sắm", href: "#orders" },
    { icon: CreditCard, title: "Điều khoản thanh toán", href: "#payment" },
    { icon: Truck, title: "Vận chuyển & Đổi trả", href: "#shipping" },
    { icon: Shield, title: "Bảo mật & Dữ liệu", href: "#privacy" },
    { icon: Scale, title: "Pháp lý & Tranh chấp", href: "#legal" },
  ];

  const termsData = [
    {
      id: "acceptance",
      title: "Chấp thuận điều khoản",
      icon: CheckCircle2,
      content: [
        "Bằng cách truy cập và sử dụng trang web cũng như các dịch vụ của ShopCart, bạn xác nhận rằng bạn đã đọc, hiểu và đồng ý chịu sự ràng buộc bởi các Điều khoản dịch vụ này.",
        "Các điều khoản này cấu thành một thỏa thuận có tính ràng buộc pháp lý giữa bạn và ShopCart. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, bạn không được sử dụng dịch vụ của chúng tôi.",
        "Chúng tôi có thể cập nhật các điều khoản này theo thời gian. Việc tiếp tục sử dụng dịch vụ của chúng tôi sau khi có thay đổi đồng nghĩa với việc bạn chấp thuận các điều khoản đã được sửa đổi.",
        "Các điều khoản này áp dụng cho tất cả người dùng, bao gồm người duyệt web, nhà cung cấp, khách hàng, thương gia và những người đóng góp nội dung.",
      ],
    },
    {
      id: "orders",
      title: "Đơn hàng & Mua sắm",
      icon: ShoppingCart,
      content: [
        "Tất cả các đơn đặt hàng đều phụ thuộc vào tình trạng sẵn có của hàng hóa và sự xác nhận từ hệ thống. Chúng tôi bảo lưu quyền từ chối hoặc hủy bất kỳ đơn hàng nào theo quyết định của mình.",
        "Giá cả có thể thay đổi mà không cần thông báo trước. Mức giá được tính sẽ là mức giá hiển thị tại thời điểm mua hàng.",
        "Chúng tôi nỗ lực hiển thị thông tin sản phẩm chính xác, nhưng chúng tôi không đảm bảo rằng mô tả sản phẩm hoặc giá cả hoàn toàn không có sai sót.",
        "Bằng cách đặt hàng, bạn đảm bảo rằng mình đã đủ ít nhất 18 tuổi và có đầy đủ năng lực pháp lý để tham gia vào các hợp đồng có tính ràng buộc.",
      ],
    },
    {
      id: "payment",
      title: "Điều khoản thanh toán",
      icon: CreditCard,
      content: [
        "Chúng tôi chấp nhận các loại thẻ tín dụng lớn, thẻ ghi nợ, PayPal và các phương thức thanh toán khác được hiển thị khi thanh toán.",
        "Tất cả các khoản thanh toán phải được xác nhận trước khi đơn hàng được xử lý và vận chuyển. Việc ủy quyền thanh toán có thể được thực hiện trước khi giao hàng.",
        "Bạn chịu trách nhiệm cho tất cả các chi phí phát sinh trên tài khoản của mình, bao gồm các khoản thuế áp dụng và phí vận chuyển.",
        "Trong trường hợp xảy ra tranh chấp thanh toán, chúng tôi sẽ phối hợp với bạn và các đơn vị xử lý thanh toán để giải quyết vấn đề một cách công bằng và nhanh chóng.",
      ],
    },
    {
      id: "shipping",
      title: "Vận chuyển & Đổi trả",
      icon: Truck,
      content: [
        "Chúng tôi cung cấp nhiều tùy chọn vận chuyển với thời gian giao hàng khác nhau. Chi phí và thời gian vận chuyển thay đổi tùy thuộc vào vị trí và dịch vụ được chọn.",
        "Rủi ro mất mát và quyền sở hữu đối với sản phẩm sẽ được chuyển giao cho bạn ngay khi chúng tôi bàn giao cho đơn vị vận chuyển. Chúng tôi không chịu trách nhiệm về các kiện hàng bị thất lạc hoặc hư hỏng sau khi đã giao cho bên vận chuyển.",
        "Yêu cầu trả hàng được chấp nhận trong vòng 30 ngày kể từ ngày mua đối với các sản phẩm chưa qua sử dụng và còn nguyên bao bì gốc. Khách hàng chịu trách nhiệm thanh toán chi phí vận chuyển hoàn trả trừ khi sản phẩm bị lỗi.",
        "Các khoản hoàn tiền sẽ được xử lý trong vòng 5-10 ngày làm việc sau khi chúng tôi nhận được và kiểm tra sản phẩm hoàn trả.",
      ],
    },
    {
      id: "privacy",
      title: "Bảo mật & Bảo vệ dữ liệu",
      icon: Shield,
      content: [
        "Quyền riêng tư của bạn rất quan trọng đối với chúng tôi. Vui lòng xem lại Chính sách bảo mật của chúng tôi để hiểu cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn.",
        "Chúng tôi triển khai các biện pháp bảo mật chuẩn công nghiệp để bảo vệ dữ liệu của bạn, nhưng không thể đảm bảo an toàn tuyệt đối cho thông tin truyền tải qua internet.",
        "Bạn có quyền truy cập, cập nhật hoặc xóa thông tin cá nhân của mình. Vui lòng liên hệ với đội ngũ hỗ trợ của chúng tôi để được trợ giúp về các yêu cầu dữ liệu.",
        "Chúng tôi có thể sử dụng cookies và các công nghệ tương tự để cải thiện trải nghiệm mua sắm của bạn và phân tích xu hướng sử dụng trang web.",
      ],
    },
    {
      id: "conduct",
      title: "Hành vi & Trách nhiệm người dùng",
      icon: AlertCircle,
      content: [
        "Bạn đồng ý chỉ sử dụng dịch vụ của chúng tôi cho các mục đích hợp pháp và tuân thủ các điều khoản này cũng như các quy định pháp luật hiện hành.",
        "Bạn không được cố gắng can thiệp, gây gián đoạn hoặc truy cập trái phép vào hệ thống hoặc mạng lưới của chúng tôi.",
        "Việc cung cấp thông tin sai lệch trong quá trình đăng ký hoặc thanh toán bị nghiêm cấm và có thể dẫn đến việc đình chỉ hoặc chấm dứt tài khoản.",
        "Bạn có trách nhiệm bảo mật thông tin đăng nhập tài khoản của mình và chịu trách nhiệm cho mọi hoạt động diễn ra dưới tài khoản của bạn.",
      ],
    },
    {
      id: "intellectual",
      title: "Quyền sở hữu trí tuệ",
      icon: FileText,
      content: [
        "Tất cả nội dung, nhãn hiệu, logo và sở hữu trí tuệ trên trang web của chúng tôi đều thuộc sở hữu của ShopCart hoặc các bên cấp phép của chúng tôi và được bảo hộ bởi luật bản quyền và nhãn hiệu.",
        "Bạn không được sao chép, phân phối, sửa đổi hoặc tạo ra các sản phẩm phái sinh từ nội dung của chúng tôi mà không có sự cho phép bằng văn bản rõ ràng.",
        "Hình ảnh sản phẩm, mô tả và đánh giá được cung cấp nhằm mục đích thông tin và có thể thuộc quyền sở hữu trí tuệ của bên thứ ba.",
        "Nếu bạn tin rằng quyền sở hữu trí tuệ của mình bị vi phạm, vui lòng liên hệ với chúng tôi kèm theo thông tin chi tiết về hành vi vi phạm bị cáo buộc.",
      ],
    },
    {
      id: "legal",
      title: "Pháp lý & Trách nhiệm pháp lý",
      icon: Scale,
      content: [
        "Các điều khoản này được điều chỉnh và giải thích theo luật pháp hiện hành. Mọi tranh chấp sẽ được giải quyết thông qua trọng tài có tính ràng buộc ở những nơi luật pháp cho phép.",
        "Trách nhiệm pháp lý của chúng tôi được giới hạn ở mức tối đa mà pháp luật cho phép. Chúng tôi không chịu trách nhiệm cho các thiệt hại gián tiếp, mang tính hệ quả hoặc bị phạt răn đe.",
        "Trong mọi trường hợp, tổng trách nhiệm pháp lý của chúng tôi không vượt quá số tiền bạn đã thanh toán cho sản phẩm hoặc dịch vụ cụ thể là đối tượng của khiếu nại.",
        "Chúng tôi từ chối tất cả các bảo đảm ngoại trừ những điều được tuyên bố rõ ràng trong các điều khoản này hoặc theo yêu cầu của pháp luật.",
      ],
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
            <FileText className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Điều khoản dịch vụ
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Vui lòng đọc kỹ các điều khoản này trước khi sử dụng dịch vụ của chúng tôi. Chúng xác định rõ quyền và trách nhiệm của bạn với tư cách là người dùng ShopCart.
            </p>
            <Badge className="mt-6 bg-white/20 text-white border-white/30">
              Cập nhật lần cuối: Tháng 1 năm 2024
            </Badge>
          </motion.div>
        </Container>
      </section>

      {/* Quick Navigation */}
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
                  Chuyển hướng nhanh
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {quickLinks.map((link, index) => (
                    <motion.a
                      key={index}
                      href={link.href}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex flex-col items-center p-4 rounded-lg hover:bg-shop_light_green/5 transition-colors group"
                    >
                      <link.icon className="w-8 h-8 text-shop_light_green mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium text-center text-dark-text group-hover:text-shop_dark_green">
                        {link.title}
                      </span>
                    </motion.a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </Container>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <Container className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-8"
          >
            <Accordion type="single" collapsible className="space-y-4">
              {termsData.map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <AccordionItem value={section.id} id={section.id}>
                    <Card className="overflow-hidden">
                      <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-shop_light_bg/50 transition-colors">
                        <div className="flex items-center gap-4 text-left">
                          <div className="p-2 bg-shop_light_green/10 rounded-lg">
                            <section.icon className="w-5 h-5 text-shop_dark_green" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-shop_dark_green">
                              {index + 1}. {section.title}
                            </h3>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-6">
                        <Separator className="mb-4" />
                        <div className="space-y-4">
                          {section.content.map((paragraph, pIndex) => (
                            <p
                              key={pIndex}
                              className="text-dark-text leading-relaxed"
                            >
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </AccordionContent>
                    </Card>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
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
                <Mail className="w-12 h-12 mx-auto mb-4 text-shop_light_green" />
                <h3 className="text-2xl font-bold text-shop_dark_green mb-4">
                  Bạn có câu hỏi về các điều khoản?
                </h3>
                <p className="text-dark-text mb-6 max-w-2xl mx-auto">
                  Nếu bạn có bất kỳ thắc mắc nào về Điều khoản dịch vụ này hoặc cần làm rõ về bất kỳ phần nào, đội ngũ pháp lý của chúng tôi luôn sẵn sàng hỗ trợ bạn.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    asChild
                    className="bg-shop_dark_green hover:bg-shop_btn_dark_green"
                  >
                    <Link href="/contact">Liên hệ Đội ngũ Pháp lý</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-shop_light_green text-shop_light_green hover:bg-shop_light_green/5"
                  >
                    <Link href="/faq">Xem Câu hỏi thường gặp</Link>
                  </Button>
                </div>
                <p className="text-sm text-light-text mt-6">
                  Để được hỗ trợ ngay lập tức, vui lòng gửi email cho chúng tôi tại{" "}
                  <a
                    href="mailto:legal@shopcart.com"
                    className="text-shop_light_green hover:underline"
                  >
                    legal@shopcart.com
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
              <Calendar className="w-4 h-4 text-shop_light_green" />
              <p className="text-sm text-light-text">
                Các điều khoản này được cập nhật lần cuối vào ngày 15 tháng 1 năm 2024
              </p>
            </div>
            <p className="text-xs text-light-text">
              Bằng việc tiếp tục sử dụng ShopCart, bạn đồng ý với phiên bản mới nhất của các điều khoản này.
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default TermsPage;