import { NextRequest, NextResponse } from "next/server";
import { subscribeToNewsletter } from "@/actions/subscriptionActions";
import { sendMail } from "@/lib/emailService";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = body;

        // Validate email presence
        if (!email) {
            return NextResponse.json({ error: "Vui lòng cung cấp địa chỉ email" }, { status: 400 });
        }

        // Get client info
        const ipAddress =
            request.headers.get("x-forwarded-for") ||
            request.headers.get("x-real-ip") ||
            "unknown";
        const userAgent = request.headers.get("user-agent") || "unknown";

        // Subscribe to newsletter
        const result = await subscribeToNewsletter({
            email,
            source: "footer",
            ipAddress,
            userAgent,
        });

        // If subscription failed or already subscribed
        if (!result.success) {
            return NextResponse.json(
                {
                    error: result.message,
                    alreadySubscribed: result.alreadySubscribed || false,
                },
                { status: result.alreadySubscribed ? 200 : 400 }
            );
        }

        // Send welcome email
        const emailResult = await sendMail({
            email,
            subject: "Chào mừng bạn đến với Bản tin ShopCart! 🎉",
            text: `Cảm ơn bạn đã đăng ký nhận bản tin của chúng tôi! Bạn hiện đã là một phần của cộng đồng độc quyền của chúng tôi.`,
            html: generateWelcomeEmailHTML(email),
        });

        if (!emailResult.success) {
            console.error("Failed to send welcome email:", emailResult.error);
            // Still return success for subscription even if email fails
        }

        return NextResponse.json(
            {
                message: result.message,
                subscriptionId: result.data?.subscriptionId,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Newsletter subscription API error:", error);
        return NextResponse.json(
            { error: "Đã xảy ra lỗi. Vui lòng thử lại sau." },
            { status: 500 }
        );
    }
}

// Generate beautiful welcome email HTML
function generateWelcomeEmailHTML(email: string): string {
    return `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chào mừng bạn đến với Bản tin ShopCart</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8f9fa;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #063c28 0%, #3b9c3c 100%);
            color: white;
            padding: 40px 20px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 10px;
        }
        
        .header p {
            font-size: 18px;
            opacity: 0.95;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .welcome-message {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .welcome-message h2 {
            color: #063c28;
            font-size: 28px;
            margin-bottom: 15px;
        }
        
        .welcome-message p {
            color: #495057;
            font-size: 16px;
            line-height: 1.8;
        }
        
        .benefits {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 12px;
            padding: 30px;
            margin: 30px 0;
            border: 1px solid #dee2e6;
        }
        
        .benefits h3 {
            color: #063c28;
            font-size: 22px;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .benefit-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 20px;
            padding: 15px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .benefit-icon {
            font-size: 24px;
            margin-right: 15px;
            min-width: 30px;
        }
        
        .benefit-text h4 {
            color: #063c28;
            font-size: 16px;
            margin-bottom: 5px;
        }
        
        .benefit-text p {
            color: #6c757d;
            font-size: 14px;
            line-height: 1.6;
        }
        
        .cta-section {
            text-align: center;
            margin: 40px 0;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #063c28 0%, #3b9c3c 100%);
            color: white;
            padding: 15px 40px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 4px 8px rgba(6, 60, 40, 0.3);
            transition: transform 0.3s;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
        }
        
        .social-proof {
            background: linear-gradient(135deg, #d1ecf1 0%, #b8e6ff 100%);
            border-radius: 12px;
            padding: 25px;
            margin: 30px 0;
            text-align: center;
            border: 1px solid #bee5eb;
        }
        
        .social-proof h3 {
            color: #0c5460;
            font-size: 20px;
            margin-bottom: 10px;
        }
        
        .social-proof p {
            color: #0c5460;
            font-size: 14px;
        }
        
        .footer {
            background: linear-gradient(135deg, #343a40 0%, #495057 100%);
            color: #ffffff;
            padding: 40px 20px;
            text-align: center;
            border-top: 4px solid #063c28;
        }
        
        .footer p {
            margin-bottom: 15px;
            opacity: 0.9;
            font-size: 14px;
        }
        
        .footer a {
            color: #ffffff;
            text-decoration: none;
            opacity: 0.8;
            transition: opacity 0.3s;
        }
        
        .footer a:hover {
            opacity: 1;
        }
        
        .social-links {
            margin-top: 20px;
        }
        
        .social-links a {
            margin: 0 10px;
        }
        
        .unsubscribe {
            margin-top: 20px;
            font-size: 12px;
            opacity: 0.7;
        }
        
        @media (max-width: 600px) {
            .container {
                margin: 0;
            }
            
            .header, .content, .footer {
                padding: 20px 15px;
            }
            
            .benefits {
                padding: 20px 15px;
            }
            
            .benefit-item {
                flex-direction: column;
                text-align: center;
            }
            
            .benefit-icon {
                margin: 0 0 10px 0;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>🎉 Chào mừng bạn đến với ShopCart!</h1>
            <p>Cảm ơn bạn đã tham gia vào cộng đồng nhận bản tin của chúng tôi</p>
        </div>
        
        <!-- Main Content -->
        <div class="content">
            <!-- Welcome Message -->
            <div class="welcome-message">
                <h2>Mọi thứ đã sẵn sàng! 🌟</h2>
                <p>
                    Cảm ơn bạn đã đăng ký nhận bản tin từ ShopCart! Chúng tôi rất vui mừng khi có bạn đồng hành cùng cộng đồng. 
                    Hãy sẵn sàng để nhận các ưu đãi độc quyền, thông báo sản phẩm mới và các mẹo mua sắm hữu ích được gửi trực tiếp đến hộp thư của bạn.
                </p>
            </div>
            
            <!-- Benefits Section -->
            <div class="benefits">
                <h3>Quyền lợi của bạn khi đăng ký thành viên</h3>
                
                <div class="benefit-item">
                    <div class="benefit-icon">🎁</div>
                    <div class="benefit-text">
                        <h4>Ưu đãi & Giảm giá Độc quyền</h4>
                        <p>Trở thành người đầu tiên biết về các chương trình khuyến mãi đặc biệt, flash sale và ưu đãi giảm giá lên đến 50% chỉ dành riêng cho người đăng ký!</p>
                    </div>
                </div>
                
                <div class="benefit-item">
                    <div class="benefit-icon">🚀</div>
                    <div class="benefit-text">
                        <h4>Trải nghiệm sớm Sản phẩm Mới</h4>
                        <p>Nhận thông tin xem trước và cơ hội mua sớm các dòng sản phẩm mới nhất của chúng tôi trước những người khác.</p>
                    </div>
                </div>
                
                <div class="benefit-item">
                    <div class="benefit-icon">📦</div>
                    <div class="benefit-text">
                        <h4>Ưu đãi Miễn phí Vận chuyển</h4>
                        <p>Tận hưởng các chương trình miễn phí vận chuyển độc quyền và các gói giao hàng đặc biệt dành riêng cho thành viên.</p>
                    </div>
                </div>
                
                <div class="benefit-item">
                    <div class="benefit-icon">💡</div>
                    <div class="benefit-text">
                        <h4>Mẹo Mua sắm & Xu hướng</h4>
                        <p>Cập nhật liên tục các xu hướng mua sắm mới nhất, hướng dẫn chọn sản phẩm và các mẹo hữu ích để tối ưu hóa trải nghiệm mua sắm của bạn.</p>
                    </div>
                </div>
                
                <div class="benefit-item">
                    <div class="benefit-icon">🎂</div>
                    <div class="benefit-text">
                        <h4>Quà tặng Sinh nhật Bất ngờ</h4>
                        <p>Nhận những món quà sinh nhật đặc biệt và ưu đãi chiết khấu độc quyền để cùng chúng tôi đón chào ngày đặc biệt của bạn!</p>
                    </div>
                </div>
            </div>
            
            <!-- CTA Section -->
            <div class="cta-section">
                <p style="margin-bottom: 20px; color: #495057;">Bắt đầu khám phá những ưu đãi tuyệt vời ngay hôm nay!</p>
                <a href="${process.env.NEXT_PUBLIC_BASE_URL || "https://shopcart.com"
        }" class="cta-button">
                    Mua sắm ngay →
                </a>
            </div>
            
            <!-- Social Proof -->
            <div class="social-proof">
                <h3>Tham gia cùng hơn 50.000+ người đăng ký hài lòng!</h3>
                <p>Bạn hiện đã là một phần của cộng đồng những người mua sắm thông thái ngày càng lớn mạnh, những người không bao giờ bỏ lỡ một ưu đãi tuyệt vời nào.</p>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <p><strong>ShopCart</strong></p>
            <p>123 Shopping Street, Khu Thương Mại<br>
               New York, NY 10001, USA</p>
            <p>
                Bạn có câu hỏi? Liên hệ với chúng tôi tại 
                <a href="mailto:support@shopcart.com">support@shopcart.com</a> hoặc 
                gọi <a href="tel:+15551234567">+1 (555) 123-4567</a>
            </p>
            
            // <div class="social-links">
            //     <a href="https://www.youtube.com/@reactjsBD">Facebook</a> |
            //     <a href="https://www.youtube.com/@reactjsBD">Twitter</a> |
            //     <a href="https://www.youtube.com/@reactjsBD">Instagram</a> |
            //     <a href="https://www.youtube.com/@reactjsBD">YouTube</a>
            // </div>
            
            <div class="unsubscribe">
                <p>
                    Bạn nhận được email này vì bạn đã đăng ký nhận Bản tin ShopCart với địa chỉ ${email}.<br>
                    <a href="${process.env.NEXT_PUBLIC_BASE_URL ||
        "https://shopcartpro.org"
        }/unsubscribe?email=${encodeURIComponent(
            email
        )}">Hủy đăng ký</a>
                </p>
            </div>
        </div>
    </div>
</body>
</html>
  `;
}