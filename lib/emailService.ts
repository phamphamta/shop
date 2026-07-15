import nodemailer, { Transporter, SentMessageInfo } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const transporter: Transporter<SMTPTransport.SentMessageInfo> =
    nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env.SENDER_EMAIL_ADDRESS || "reactjsbd@gmail.com",
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        },
    });

// Type definitions
interface OrderItem {
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

interface ShippingAddress {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

interface OrderConfirmationData {
    customerName: string;
    customerEmail: string;
    orderId: string;
    orderDate: string;
    items: OrderItem[];
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    shippingAddress: ShippingAddress;
    estimatedDelivery?: string;
}

interface EmailResponse {
    success: boolean;
    messageId?: string;
    error?: string;
}

interface SendMailParams {
    email: string;
    subject: string;
    text: string;
    html?: string;
}

const generateOrderConfirmationHTML = (data: OrderConfirmationData): string => {
    const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

    return `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác nhận đơn hàng - ${data.orderId}</title>
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
            max-width: 800px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #063c28 0%, #3b9c3c 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 10px;
        }
        
        .header p {
            font-size: 16px;
            opacity: 0.9;
        }
        
        .content {
            padding: 30px 20px;
        }
        
        .greeting {
            margin-bottom: 25px;
        }
        
        .greeting h2 {
            color: #063c28;
            font-size: 22px;
            margin-bottom: 10px;
        }
        
        .order-summary {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 12px;
            padding: 25px;
            margin: 25px 0;
            border: 1px solid #dee2e6;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        
        .order-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #e9ecef;
        }
        
        .order-id {
            font-weight: 700;
            color: #063c28;
            font-size: 18px;
        }
        
        .order-date {
            color: #6c757d;
            font-size: 14px;
        }
        
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .items-table th {
            background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
            color: #495057;
            font-weight: 700;
            padding: 15px 12px;
            text-align: left;
            border-bottom: 2px solid #dee2e6;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .items-table td {
            padding: 18px 12px;
            border-bottom: 1px solid #e9ecef;
            background: white;
        }
        
        .items-table tr:hover td {
            background: #f8f9fa;
        }
        
        .item-image {
            width: 60px;
            height: 60px;
            object-fit: cover;
            border-radius: 8px;
            border: 2px solid #dee2e6;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .item-name {
            font-weight: 600;
            color: #495057;
            margin-bottom: 5px;
        }
        
        .quantity {
            background-color: #3b9c3c;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
        }
        
        .price {
            font-weight: 700;
            color: #063c28;
        }
        
        .totals {
            margin-top: 25px;
            padding: 25px;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 12px;
            border: 1px solid #dee2e6;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .total-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            padding: 8px 0;
            font-size: 16px;
            line-height: 1.5;
        }
        
        .total-row span:first-child {
            font-weight: 600;
            color: #495057;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .total-row span:last-child {
            font-weight: 700;
            color: #063c28;
            font-size: 18px;
        }
        
        .total-row.final {
            background: linear-gradient(135deg, #063c28 0%, #3b9c3c 100%);
            color: white;
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
            border: none;
            box-shadow: 0 4px 8px rgba(6, 60, 40, 0.3);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .total-row.final span:first-child {
            color: rgba(255, 255, 255, 0.9);
            font-size: 16px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .total-row.final span:last-child {
            color: white;
            font-size: 24px;
            font-weight: 800;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }
        
        .shipping-info {
            background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%);
            border-radius: 12px;
            padding: 25px;
            margin: 25px 0;
            border: 1px solid #c3e6cb;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .shipping-info h3 {
            color: #063c28;
            margin-bottom: 15px;
            font-size: 18px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .address {
            color: #495057;
            line-height: 1.8;
            background: white;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #e9ecef;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .address strong {
            color: #063c28;
            font-size: 16px;
        }
        
        .delivery-info {
            background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
            border-radius: 12px;
            padding: 25px;
            margin: 25px 0;
            border: 1px solid #ffeeba;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .delivery-info h3 {
            color: #856404;
            margin-bottom: 15px;
            font-size: 18px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .delivery-info p {
            color: #664d03;
            font-weight: 600;
            background: white;
            padding: 12px;
            border-radius: 6px;
            margin-bottom: 0;
            border: 1px solid #f5c842;
        }
        
        .next-steps {
            background: linear-gradient(135deg, #d1ecf1 0%, #b8e6ff 100%);
            border-radius: 12px;
            padding: 25px;
            margin: 25px 0;
            border: 1px solid #bee5eb;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .next-steps h3 {
            color: #0c5460;
            margin-bottom: 15px;
            font-size: 18px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .next-steps ul {
            list-style: none;
            padding-left: 0;
        }
        
        .next-steps li {
            padding: 8px 0;
            padding-left: 25px;
            position: relative;
            color: #0c5460;
        }
        
        .next-steps li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #17a2b8;
            font-weight: bold;
        }
        
        .support-section {
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
            text-align: center;
        }
        
        .support-section h3 {
            color: #063c28;
            margin-bottom: 15px;
        }
        
        .contact-info {
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
            gap: 20px;
            margin-top: 15px;
        }
        
        .contact-item {
            text-align: center;
        }
        
        .contact-item strong {
            color: #063c28;
            display: block;
            margin-bottom: 5px;
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
        
        .social-links {
            margin-top: 20px;
        }
        
        .social-links a {
            color: #ffffff;
            text-decoration: none;
            margin: 0 10px;
            opacity: 0.8;
            transition: opacity 0.3s;
        }
        
        .social-links a:hover {
            opacity: 1;
        }
        
        @media (max-width: 600px) {
            .container {
                margin: 0;
            }
            
            .header, .content, .footer {
                padding: 20px 15px;
            }
            
            .items-table {
                font-size: 14px;
            }
            
            .items-table th,
            .items-table td {
                padding: 8px 4px;
            }
            
            .order-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 10px;
            }
            
            .contact-info {
                flex-direction: column;
                gap: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>Đơn hàng đã được xác nhận!</h1>
            <p>Cảm ơn bạn đã mua sắm tại ShopCart</p>
        </div>
        
        <!-- Main Content -->
        <div class="content">
            <!-- Greeting -->
            <div class="greeting">
                <h2>Xin chào ${data.customerName}!</h2>
                <p>Chúng tôi rất vui mừng thông báo rằng đơn hàng của bạn đã được xác nhận và đang được chuẩn bị để vận chuyển. Bạn sẽ nhận được một email khác khi đơn hàng bắt đầu được giao đi.</p>
            </div>
            
            <!-- Order Summary -->
            <div class="order-summary">
                <div class="order-header">
                    <span class="order-id">Đơn hàng #${data.orderId}</span>
                    <span class="order-date">Đặt ngày ${data.orderDate}</span>
                </div>
                
                <table class="items-table">
                    <thead>
                        <tr>
                            <th style="width: 60px;">Ảnh</th>
                            <th>Sản phẩm</th>
                            <th style="width: 80px; text-align: center;">SL</th>
                            <th style="width: 100px; text-align: right;">Giá</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.items
            .map(
                (item) => `
                            <tr>
                                <td>
                                    ${item.image
                        ? `<img src="${item.image}" alt="${item.name}" class="item-image" />`
                        : `<div class="item-image" style="background-color: #e9ecef; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #6c757d;">Không có ảnh</div>`
                    }
                                </td>
                                <td>
                                    <div class="item-name">${item.name}</div>
                                </td>
                                <td style="text-align: center;">
                                    <span class="quantity">${item.quantity
                    }</span>
                                </td>
                                <td style="text-align: right;">
                                    <span class="price">${formatCurrency(
                        item.price * item.quantity
                    )}</span>
                                </td>
                            </tr>
                        `
            )
            .join("")}
                    </tbody>
                </table>
                
                <div class="totals">
                    <div class="total-row">
                        <span>Tạm tính:</span>
                        <span>${formatCurrency(data.subtotal)}</span>
                    </div>
                    <div class="total-row">
                        <span>Phí vận chuyển:</span>
                        <span>${formatCurrency(data.shipping)}</span>
                    </div>
                    <div class="total-row">
                        <span>Thuế:</span>
                        <span>${formatCurrency(data.tax)}</span>
                    </div>
                    <div class="total-row final">
                        <span>Tổng cộng:</span>
                        <span>${formatCurrency(data.total)}</span>
                    </div>
                </div>
            </div>
            
            <!-- Shipping Information -->
            <div class="shipping-info">
                <h3>📦 Địa chỉ giao hàng</h3>
                <div class="address">
                    <strong>${data.shippingAddress.name}</strong><br>
                    ${data.shippingAddress.street}<br>
                    ${data.shippingAddress.city}, ${data.shippingAddress.state
        } ${data.shippingAddress.zipCode}<br>
                    ${data.shippingAddress.country}
                </div>
            </div>
            
            ${data.estimatedDelivery
            ? `
            <!-- Delivery Information -->
            <div class="delivery-info">
                <h3>🚚 Thời gian giao hàng dự kiến</h3>
                <p>${data.estimatedDelivery}</p>
            </div>
            `
            : ""
        }
            
            <!-- Next Steps -->
            <div class="next-steps">
                <h3>Điều gì xảy ra tiếp theo?</h3>
                <ul>
                    <li>Chúng tôi sẽ chuẩn bị đơn hàng của bạn để vận chuyển</li>
                    <li>Bạn sẽ nhận được mã vận đơn qua email sau khi hàng được gửi đi</li>
                    <li>Theo dõi tiến độ gói hàng của bạn theo thời gian thực</li>
                    <li>Đơn hàng sẽ được giao đến địa chỉ bạn đã cung cấp</li>
                </ul>
            </div>
            
            <!-- Support Section -->
            <div class="support-section">
                <h3>Bạn cần hỗ trợ?</h3>
                <p>Đội ngũ chăm sóc khách hàng của chúng tôi luôn sẵn sàng hỗ trợ mọi thắc mắc về đơn hàng của bạn.</p>
                
                <div class="contact-info">
                    <div class="contact-item">
                        <strong>Email</strong>
                        <span>support@shopcart.com</span>
                    </div>
                    <div class="contact-item">
                        <strong>Điện thoại</strong>
                        <span>+1 (555) 123-4567</span>
                    </div>
                    <div class="contact-item">
                        <strong>Thời gian</strong>
                        <span>Thứ 2 - Thứ 6: 9AM - 6PM</span>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <p><strong>ShopCart</strong></p>
            <p>123 Shopping Street, Commerce District<br>
               New York, NY 10001, USA</p>
            <p>Cảm ơn bạn đã lựa chọn ShopCart!</p>
            
            // <div class="social-links">
            //     <a href="https://www.youtube.com/@reactjsBD">Facebook</a> |
            //     <a href="https://www.youtube.com/@reactjsBD">Twitter</a> |
            //     <a href="https://www.youtube.com/@reactjsBD">Instagram</a> |
            //     <a href="https://www.youtube.com/@reactjsBD">Hỗ trợ</a>
            // </div>
        </div>
    </div>
</body>
</html>`;
};

const sendOrderConfirmationEmail = async (
    data: OrderConfirmationData
): Promise<EmailResponse> => {
    try {
        const htmlContent = generateOrderConfirmationHTML(data);

        const mailOptions = {
            from: `"ShopCart Ecommerce" <${process.env.SENDER_EMAIL_ADDRESS || "reactjsbd@gmail.com"
                }>`,
            to: data.customerEmail,
            subject: `Xác nhận đơn hàng - ${data.orderId} | Cảm ơn bạn đã mua hàng!`,
            html: htmlContent,
            // Fallback text version
            text: `
Xin chào ${data.customerName}!

Cảm ơn bạn đã đặt hàng! Dưới đây là thông tin chi tiết:

Mã đơn hàng: ${data.orderId}
Ngày đặt hàng: ${data.orderDate}
Tổng cộng: $${data.total.toFixed(2)}

Sản phẩm đã đặt:
${data.items
                    .map(
                        (item) =>
                            `- ${item.name} (Số lượng: ${item.quantity}) - $${(
                                item.price * item.quantity
                            ).toFixed(2)}`
                    )
                    .join("\n")}

Địa chỉ giao hàng:
${data.shippingAddress.name}
${data.shippingAddress.street}
${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zipCode
                }
${data.shippingAddress.country}

${data.estimatedDelivery ? `Thời gian giao hàng dự kiến: ${data.estimatedDelivery}` : ""}

Chúng tôi sẽ gửi một email khác kèm theo thông tin theo dõi sau khi đơn hàng được gửi đi.

Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua support@shopcart.com hoặc +1 (555) 123-4567.

Cảm ơn bạn đã lựa chọn ShopCart!
      `,
        };

        const result = await transporter.sendMail(mailOptions);

        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error("Failed to send order confirmation email:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred",
        };
    }
};

// Simple email function for other purposes
const sendMail = async ({
    email,
    subject,
    text,
    html,
}: SendMailParams): Promise<EmailResponse> => {
    try {
        const mailOptions = {
            from: `"ShopCart Ecommerce" <${process.env.SENDER_EMAIL_ADDRESS || "reactjsbd@gmail.com"
                }>`,
            to: email,
            subject,
            text,
            ...(html && { html }),
        };

        const result = await transporter.sendMail(mailOptions);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error("Failed to send email:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred",
        };
    }
};

export { sendOrderConfirmationEmail, sendMail };
export type {
    OrderConfirmationData,
    OrderItem,
    ShippingAddress,
    EmailResponse,
    SendMailParams,
};