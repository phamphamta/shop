"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  Search,
  HelpCircle,
  ShoppingBag,
  CreditCard,
  Truck,
  RotateCcw,
  User,
  MessageCircle,
} from "lucide-react";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  // Shopping FAQs
  {
    id: "shopping-1",
    question: "Làm thế nào để tôi đặt mua hàng?",
    answer:
      "Để đặt hàng, bạn vui lòng duyệt xem các sản phẩm của chúng tôi, thêm các mặt hàng muốn mua vào giỏ hàng và tiến hành thanh toán. Bạn sẽ cần tạo một tài khoản hoặc đăng nhập, sau đó cung cấp thông tin giao hàng và chi tiết thanh toán để hoàn tất việc mua sắm.",
    category: "shopping",
  },
  {
    id: "shopping-2",
    question: "Tôi có thể thay đổi hoặc hủy đơn hàng sau khi đã đặt không?",
    answer:
      "Bạn có thể thay đổi hoặc hủy đơn hàng của mình trong vòng 30 phút kể từ khi đặt hàng. Sau thời gian này, nếu đơn hàng của bạn chưa được xử lý, vui lòng liên hệ ngay với đội ngũ chăm sóc khách hàng của chúng tôi. Một khi đơn hàng đã đi vào giai đoạn chuẩn bị hoặc vận chuyển, việc thay đổi có thể không còn thực hiện được nữa.",
    category: "shopping",
  },
  {
    id: "shopping-3",
    question: "Làm thế nào để tôi theo dõi đơn hàng của mình?",
    answer:
      "Ngay sau khi đơn hàng được vận chuyển, bạn sẽ nhận được mã vận đơn qua email. Bạn cũng có thể theo dõi đơn hàng bằng cách đăng nhập vào tài khoản và truy cập mục 'Đơn hàng của tôi'. Thông tin theo dõi theo thời gian thực sẽ được cập nhật đầy đủ tại đó.",
    category: "shopping",
  },
  {
    id: "shopping-4",
    question: "Tôi phải làm sao nếu sản phẩm tôi muốn mua đã hết hàng?",
    answer:
      "Nếu một mặt hàng đã hết hàng, bạn có thể đăng ký nhận thông báo khi có hàng lại ngay trên trang sản phẩm. Chúng tôi sẽ gửi email cho bạn ngay khi sản phẩm sẵn sàng phục vụ. Bạn cũng có thể kiểm tra mục 'Sắp ra mắt' để cập nhật lịch bổ sung hàng sắp tới.",
    category: "shopping",
  },

  // Payment FAQs
  {
    id: "payment-1",
    question: "Các phương thức thanh toán nào được chấp nhận?",
    answer:
      "Chúng tôi chấp nhận hầu hết các loại thẻ tín dụng lớn (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay và chuyển khoản ngân hàng. Tất cả các giao dịch thanh toán đều được xử lý an toàn thông qua hệ thống thanh toán mã hóa của chúng tôi.",
    category: "payment",
  },
  {
    id: "payment-2",
    question: "Thông tin thanh toán của tôi có được bảo mật không?",
    answer:
      "Có, hoàn toàn bảo mật. Chúng tôi sử dụng công nghệ mã hóa SSL tiêu chuẩn công nghiệp và tuân thủ chứng nhận bảo mật PCI DSS. Thông tin thanh toán của bạn không bao giờ được lưu trữ trên máy chủ của chúng tôi và được xử lý an toàn thông qua các cổng thanh toán đáng tin cậy như Stripe.",
    category: "payment",
  },
  {
    id: "payment-3",
    question: "Khi nào tôi sẽ bị trừ tiền cho đơn hàng của mình?",
    answer:
      "Phương thức thanh toán của bạn sẽ được tính tiền ngay sau khi bạn đặt hàng thành công. Đối với các đơn hàng đặt trước (pre-order), bạn sẽ được tính tiền khi sản phẩm bắt đầu giao. Nếu có bất kỳ vấn đề gì phát sinh trong quá trình xử lý thanh toán, chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ.",
    category: "payment",
  },
  {
    id: "payment-4",
    question: "Tôi có thể nhận lại tiền hoàn nếu không hài lòng với sản phẩm?",
    answer:
      "Có, chúng tôi cung cấp chính sách đảm bảo hoàn tiền trong vòng 30 ngày. Nếu không hoàn toàn hài lòng với sản phẩm đã mua, bạn có thể gửi trả lại hàng trong vòng 30 ngày kể từ lúc nhận để được hoàn tiền đầy đủ. Sản phẩm đổi trả phải còn nguyên vẹn trạng thái ban đầu kèm theo đầy đủ bao bì.",
    category: "payment",
  },

  // Shipping FAQs
  {
    id: "shipping-1",
    question: "Chi phí vận chuyển được tính như thế nào?",
    answer:
      "Chi phí vận chuyển sẽ thay đổi tùy thuộc vào vị trí của bạn và phương thức giao hàng bạn chọn. Miễn phí vận chuyển tiêu chuẩn cho các đơn hàng có giá trị trên $50. Các tùy chọn giao hàng hỏa tốc cũng sẽ có sẵn tại bước thanh toán với mức phí tương ứng được hiển thị rõ ràng.",
    category: "shipping",
  },
  {
    id: "shipping-2",
    question: "Thời gian giao hàng mất bao lâu?",
    answer:
      "Vận chuyển tiêu chuẩn thường mất từ 3-7 ngày làm việc trong phạm vi nội địa Mỹ. Vận chuyển hỏa tốc mất từ 1-3 ngày làm việc. Việc giao hàng quốc tế có thể mất từ 7-14 ngày làm việc tùy thuộc vào quốc gia đến.",
    category: "shipping",
  },
  {
    id: "shipping-3",
    question: "Các bạn có giao hàng quốc tế không?",
    answer:
      "Có, chúng tôi có giao hàng đến hầu hết các quốc gia trên thế giới. Chi phí vận chuyển quốc tế và thời gian giao hàng sẽ khác nhau tùy theo điểm đến. Thuế hải quan và các loại phí nhập khẩu có thể được áp dụng và sẽ do người nhận chịu trách nhiệm chi trả.",
    category: "shipping",
  },
  {
    id: "shipping-4",
    question: "Tôi phải làm sao nếu kiện hàng bị hư hỏng hoặc thất lạc?",
    answer:
      "Nếu kiện hàng của bạn bị hư hỏng khi đến nơi hoặc bị thất lạc, vui lòng liên hệ ngay với chúng tôi kèm theo mã đơn hàng của bạn. Chúng tôi sẽ làm việc với đơn vị vận chuyển để giải quyết sự cố, tiến hành gửi bù sản phẩm mới hoặc hoàn trả lại toàn bộ tiền cho bạn.",
    category: "shipping",
  },

  // Returns FAQs
  {
    id: "returns-1",
    question: "Chính sách đổi trả hàng của các bạn là gì?",
    answer:
      "Chúng tôi áp dụng chính sách đổi trả hàng trong vòng 30 ngày kể từ ngày giao hàng thành công. Các sản phẩm phải chưa qua sử dụng, còn nguyên trạng thái ban đầu và bao gồm đầy đủ bao bì, phụ kiện đi kèm. Một số mặt hàng đặc biệt như sản phẩm cá nhân hóa thiết kế riêng có thể sẽ không được áp dụng đổi trả.",
    category: "returns",
  },
  {
    id: "returns-2",
    question: "Làm thế nào để tôi hoàn trả lại một sản phẩm?",
    answer:
      "Để hoàn trả sản phẩm, hãy đăng nhập vào tài khoản của bạn và gửi yêu cầu đổi trả từ lịch sử đơn hàng. Chúng tôi sẽ cung cấp cho bạn một nhãn gửi trả hàng trả trước và các hướng dẫn chi tiết. Hãy đóng gói sản phẩm cẩn thận và gửi lại tại bất kỳ điểm tiếp nhận vận chuyển nào được ủy quyền.",
    category: "returns",
  },
  {
    id: "returns-3",
    question: "Khi nào tôi sẽ nhận được tiền hoàn trả?",
    answer:
      "Khoản hoàn tiền được xử lý trong vòng 2-3 ngày làm việc sau khi chúng tôi nhận lại và kiểm tra xong sản phẩm hoàn trả của bạn. Tiền sẽ được hoàn về phương thức thanh toán gốc của bạn trong vòng 5-10 ngày làm việc, tùy thuộc vào ngân hàng hoặc đơn vị phát hành thẻ của bạn.",
    category: "returns",
  },
  {
    id: "returns-4",
    question: "Tôi có thể đổi hàng thay vì trả hàng hoàn tiền không?",
    answer:
      "Có, bạn hoàn toàn có thể đổi sản phẩm sang kích cỡ hoặc màu sắc khác nếu kho hàng còn sẵn. Hãy chọn tùy chọn đổi hàng khi bắt đầu thực hiện quy trình hoàn trả, và chúng tôi sẽ gửi sản phẩm mới cho bạn ngay sau khi nhận được sản phẩm gốc gửi về.",
    category: "returns",
  },

  // Account FAQs
  {
    id: "account-1",
    question: "Làm thế nào để tôi tạo một tài khoản?",
    answer:
      "Nhấp vào mục 'Đăng ký' ở phía trên cùng của bất kỳ trang nào, cung cấp địa chỉ email của bạn và tạo một mật khẩu. Bạn cũng có thể đăng ký nhanh bằng tài khoản Google hoặc Facebook để tiết kiệm thời gian. Việc tạo tài khoản là hoàn toàn miễn phí và giúp bạn có quyền theo dõi đơn hàng, lưu danh sách yêu thích cũng như nhận các ưu đãi độc quyền.",
    category: "account",
  },
  {
    id: "account-2",
    question: "Tôi bị quên mật khẩu. Làm cách nào để đặt lại?",
    answer:
      "Nhấp vào 'Đăng nhập' và chọn 'Quên mật khẩu'. Nhập địa chỉ email của bạn vào và chúng tôi sẽ gửi cho bạn một liên kết đặt lại mật khẩu. Làm theo các hướng dẫn trong email để tạo mật khẩu mới. Nếu bạn không nhận được email, vui lòng kiểm tra thêm trong thư mục thư rác (spam).",
    category: "account",
  },
  {
    id: "account-3",
    question: "Làm thế nào để tôi cập nhật thông tin tài khoản cá nhân?",
    answer:
      "Đăng nhập vào tài khoản của bạn và đi đến mục 'Cài đặt tài khoản' hoặc 'Hồ sơ'. Tại đây, bạn có thể cập nhật thông tin cá nhân, địa chỉ giao hàng, phương thức thanh toán và tùy chọn nhận thông báo. Các thay đổi sẽ được tự động lưu lại.",
    category: "account",
  },
  {
    id: "account-4",
    question: "Tôi có thể xóa tài khoản cá nhân của mình không?",
    answer:
      "Có, bạn có thể xóa tài khoản bất cứ lúc nào trong phần cài đặt tài khoản của mình. Xin lưu ý rằng hành động này là vĩnh viễn và sẽ xóa bỏ toàn bộ lịch sử đơn hàng, danh sách yêu thích cũng như các thông tin đã lưu trữ của bạn. Liên hệ với đội ngũ hỗ trợ nếu bạn cần trợ giúp.",
    category: "account",
  },
];

const categories = [
  { id: "all", label: "Tất cả câu hỏi", icon: HelpCircle, count: faqs.length },
  {
    id: "shopping",
    label: "Mua sắm",
    icon: ShoppingBag,
    count: faqs.filter((faq) => faq.category === "shopping").length,
  },
  {
    id: "payment",
    label: "Thanh toán",
    icon: CreditCard,
    count: faqs.filter((faq) => faq.category === "payment").length,
  },
  {
    id: "shipping",
    label: "Vận chuyển",
    icon: Truck,
    count: faqs.filter((faq) => faq.category === "shipping").length,
  },
  {
    id: "returns",
    label: "Đổi trả hàng",
    icon: RotateCcw,
    count: faqs.filter((faq) => faq.category === "returns").length,
  },
  {
    id: "account",
    label: "Tài khoản",
    icon: User,
    count: faqs.filter((faq) => faq.category === "account").length,
  },
];

const FAQPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

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
            <HelpCircle className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Câu hỏi thường gặp
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-6">
              Tìm câu trả lời cho các thắc mắc phổ biến về mua sắm, thanh toán, vận chuyển và nhiều chủ đề khác. Không tìm thấy thông tin bạn đang cần? Hãy liên hệ với đội ngũ hỗ trợ của chúng tôi.
            </p>
            <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              Cập nhật hàng ngày
            </Badge>
          </motion.div>
        </Container>
      </section>

      {/* Main Content */}
      <Container className="py-12 max-w-6xl">
        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Tìm kiếm câu trả lời..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-4 text-lg border-2 border-gray-200 focus:border-shop_light_green rounded-xl shadow-sm"
            />
          </div>
          {searchTerm && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-gray-600 mt-2"
            >
              Tìm thấy {filteredFAQs.length} kết quả cho &quot;{searchTerm}&quot;
            </motion.p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-1"
          >
            <Card className="sticky top-8 shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-shop_dark_green flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  Danh mục
                </CardTitle>
                <CardDescription>Duyệt theo chủ đề</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${activeCategory === category.id
                        ? "bg-shop_light_green text-white shadow-md"
                        : "hover:bg-shop_light_green/10 text-gray-700 hover:text-shop_dark_green"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span className="font-medium">{category.label}</span>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${activeCategory === category.id
                          ? "bg-white/20"
                          : "bg-gray-200"
                          }`}
                      >
                        {category.count}
                      </span>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>

          {/* FAQ Content */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {filteredFAQs.length > 0 ? (
                <Accordion type="single" collapsible className="space-y-4">
                  {filteredFAQs.map((faq, index) => (
                    <motion.div
                      key={faq.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <AccordionItem
                        value={faq.id}
                        className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 px-6 py-2 hover:shadow-md transition-shadow"
                      >
                        <AccordionTrigger className="text-left text-shop_dark_green font-semibold hover:text-shop_light_green transition-colors">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-700 leading-relaxed pt-4">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    </motion.div>
                  ))}
                </Accordion>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Không tìm thấy kết quả phù hợp
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Hãy thử thay đổi từ khóa tìm kiếm hoặc duyệt qua các danh mục khác nhau.
                  </p>
                  <Button
                    onClick={() => {
                      setSearchTerm("");
                      setActiveCategory("all");
                    }}
                    variant="outline"
                    className="border-shop_light_green text-shop_light_green hover:bg-shop_light_green hover:text-white"
                  >
                    Xóa tìm kiếm
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Contact Support Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16"
        >
          <Card className="bg-gradient-to-r from-shop_light_green to-shop_dark_green text-white shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-2 flex items-center justify-center gap-2">
                <MessageCircle className="w-6 h-6" />
                Bạn vẫn cần trợ giúp?
              </CardTitle>
              <CardDescription className="text-white/80">
                Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn giải quyết bất kỳ thắc mắc nào chưa có trong trang Câu hỏi thường gặp.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/contact">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-white text-shop_dark_green hover:bg-gray-100"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Liên hệ Hỗ trợ
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white text-shop_dark_green hover:bg-white/90"
                  >
                    <MessageCircle className="w-5 h-5 mr-2 shrink-0" />
                    <span className="whitespace-nowrap">Trung tâm trợ giúp</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </div>
  );
};

export default FAQPage;