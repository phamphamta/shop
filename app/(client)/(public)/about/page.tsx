"use client";

import { motion } from "motion/react";
import {
  Heart,
  Users,
  Award,
  ShoppingBag,
  Target,
  Globe,
  Zap,
  Shield,
  Star,
  ArrowRight,
} from "lucide-react";
import Container from "@/components/Container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const AboutPage = () => {
  const stats = [
    { number: "10K+", label: "Khách hàng hài lòng", icon: Users },
    { number: "500+", label: "Sản phẩm", icon: ShoppingBag },
    { number: "50+", label: "Thương hiệu", icon: Award },
    { number: "99%", label: "Tỉ lệ hài lòng", icon: Heart },
  ];

  const values = [
    {
      icon: Target,
      title: "Khách hàng là trên hết",
      description: "Mọi quyết định của chúng tôi đều bắt nguồn từ lợi ích của khách hàng.",
      color: "text-shop_light_green",
    },
    {
      icon: Shield,
      title: "Đảm bảo chất lượng",
      description: "Chúng tôi đảm bảo mọi sản phẩm đều đáp ứng các tiêu chuẩn cao nhất.",
      color: "text-shop_dark_green",
    },
    {
      icon: Zap,
      title: "Đổi mới liên tục",
      description: "Không ngừng phát triển để mang đến cho bạn những trải nghiệm tuyệt vời nhất.",
      color: "text-shop_orange",
    },
    {
      icon: Globe,
      title: "Phát triển bền vững",
      description: "Cam kết thực hiện các quy trình thân thiện với môi trường và nguồn cung ứng có trách nhiệm.",
      color: "text-shop_light_green",
    },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Nhà sáng lập",
      image: "/images/team/ceo.jpg",
      description: "Nhà lãnh đạo tầm nhìn với hơn 15 năm kinh nghiệm trong ngành thương mại điện tử.",
    },
    {
      name: "Michael Chen",
      role: "Giám đốc công nghệ (CTO)",
      image: "/images/team/cto.jpg",
      description: "Chuyên gia đổi mới công nghệ dẫn dắt quá trình chuyển đổi số của chúng tôi.",
    },
    {
      name: "Emily Rodriguez",
      role: "Trưởng bộ phận thiết kế",
      image: "/images/team/design.jpg",
      description: "Lực lượng sáng tạo đứng sau những trải nghiệm tuyệt vời của người dùng.",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-shop_light_bg to-white min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-shop_dark_green to-shop_light_green text-white">
        <Container className="max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
              Thành lập năm 2025
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Về ShopCart
            </h1>
            <p className="text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Chúng tôi đang cách mạng hóa trải nghiệm mua sắm trực tuyến với các sản phẩm tuyển chọn,
              dịch vụ xuất sắc và công nghệ tiên tiến luôn đặt khách hàng làm trung tâm.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-16 -mt-10">
        <Container className="max-w-6xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center bg-white shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="pt-6">
                    <stat.icon className="w-8 h-8 mx-auto mb-3 text-shop_light_green" />
                    <h3 className="text-3xl font-bold text-shop_dark_green mb-1">
                      {stat.number}
                    </h3>
                    <p className="text-dark-text font-medium">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <Container className="max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 bg-shop_light_green/10 text-shop_dark_green hover:bg-shop_light_green/20">
                Câu chuyện của chúng tôi
              </Badge>
              <h2 className="text-4xl font-bold text-shop_dark_green mb-6">
                Kiến tạo tương lai của Thương mại điện tử
              </h2>
              <p className="text-lg text-dark-text mb-6 leading-relaxed">
                Được thành lập vào năm 2020 với một sứ mệnh đơn giản: giúp cho việc mua sắm trực tuyến
                trở nên cá nhân hóa hơn, dễ tiếp cận hơn và thú vị hơn cho tất cả mọi người. Từ một đội ngũ
                nhỏ mang những giấc mơ lớn, chúng tôi đã phát triển thành một nền tảng được hàng ngàn khách hàng
                trên toàn thế giới tin tưởng.
              </p>
              <p className="text-lg text-dark-text mb-8 leading-relaxed">
                Chúng tôi tin rằng mua sắm phải là một trải nghiệm đáng giá, chứ không chỉ là một giao dịch thuần túy.
                Đó là lý do tại sao chúng tôi cẩn thận chọn lọc từng sản phẩm, hợp tác với các thương hiệu tử tế
                và không ngừng đổi mới để phục vụ bạn tốt hơn.
              </p>
              <Button
                asChild
                className="bg-shop_dark_green hover:bg-shop_btn_dark_green"
              >
                <Link href="/contact">
                  Liên hệ ngay <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-shop_light_green to-shop_dark_green rounded-2xl p-8 text-white">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <Star className="w-6 h-6 mx-auto mb-2" />
                    <p className="font-semibold">Chất lượng cao cấp</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <Shield className="w-6 h-6 mx-auto mb-2" />
                    <p className="font-semibold">Mua sắm an toàn</p>
                  </div>
                </div>
                <blockquote className="text-lg italic">
                  &quot;Mua sắm là để tận hưởng, không phải là một công việc nhàm chán. Chúng tôi
                  ở đây để khiến mỗi đơn hàng của bạn đều trở nên đặc biệt.&quot;
                </blockquote>
                <p className="mt-4 font-semibold">- Sarah Johnson, Nhà sáng lập</p>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-shop_light_bg">
        <Container className="max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-shop_orange/10 text-shop_orange hover:bg-shop_orange/20">
              Giá trị cốt lõi
            </Badge>
            <h2 className="text-4xl font-bold text-shop_dark_green mb-4">
              Những giá trị chúng tôi hướng tới
            </h2>
            <p className="text-lg text-dark-text max-w-2xl mx-auto">
              Những giá trị cốt lõi này định hình mọi công việc chúng tôi làm, từ khâu lựa chọn sản phẩm
              cho đến dịch vụ chăm sóc khách hàng.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all group cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <value.icon
                      className={`w-12 h-12 mx-auto mb-4 ${value.color} group-hover:scale-110 transition-transform`}
                    />
                    <h3 className="text-xl font-bold text-shop_dark_green mb-3">
                      {value.title}
                    </h3>
                    <p className="text-dark-text leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <Container className="max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-shop_light_green/10 text-shop_dark_green hover:bg-shop_light_green/20">
              Đội ngũ lãnh đạo
            </Badge>
            <h2 className="text-4xl font-bold text-shop_dark_green mb-4">
              Những mảnh ghép tạo nên ShopCart
            </h2>
            <p className="text-lg text-dark-text max-w-2xl mx-auto">
              Đội ngũ chuyên gia đầy nhiệt huyết của chúng tôi luôn làm việc không mệt mỏi để mang lại
              trải nghiệm mua sắm tốt nhất cho bạn.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center hover:shadow-lg transition-all group">
                  <CardContent className="p-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-shop_light_green to-shop_dark_green rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold group-hover:scale-105 transition-transform">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <h3 className="text-xl font-bold text-shop_dark_green mb-1">
                      {member.name}
                    </h3>
                    <Badge className="mb-3 bg-shop_orange/10 text-shop_orange border-none">
                      {member.role}
                    </Badge>
                    <p className="text-dark-text text-sm leading-relaxed">
                      {member.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-shop_dark_green to-shop_light_green text-white">
        <Container className="max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold mb-4">
              Sẵn sàng trải nghiệm sự khác biệt?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Tham gia cùng hàng ngàn khách hàng hài lòng đã tin tưởng và lựa chọn ShopCart cho nhu cầu
              mua sắm của mình.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-shop_dark_green hover:bg-white/90"
              >
                <Link href="/shop">
                  Mua sắm ngay <ShoppingBag className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-white text-shop_dark_green hover:bg-white/90"
              >
                <Link href="/contact">
                  Liên hệ với chúng tôi <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
};

export default AboutPage;