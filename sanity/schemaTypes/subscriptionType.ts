import { EnvelopeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const subscriptionType = defineType({
  name: "subscription",
  title: "Đăng ký nhận bản tin",
  type: "document",
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: "email",
      title: "Địa chỉ Email",
      type: "email",
      description: "Địa chỉ email của người đăng ký",
      validation: (Rule) =>
        Rule.required().custom((email) => {
          // Normalize email for uniqueness check
          const normalizedEmail = email?.toLowerCase().trim();
          return true; // Validation passes, uniqueness is enforced by GROQ query
        }),
    }),
    defineField({
      name: "status",
      title: "Trạng thái đăng ký",
      type: "string",
      description: "Trạng thái hiện tại của đăng ký nhận tin",
      options: {
        list: [
          { title: "Đang hoạt động", value: "active" },
          { title: "Đã hủy nhận tin", value: "unsubscribed" },
          { title: "Chờ xử lý", value: "pending" },
        ],
      },
      initialValue: "active",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subscribedAt",
      title: "Đăng ký lúc",
      type: "datetime",
      description: "Ngày và giờ người dùng đăng ký nhận tin",
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "unsubscribedAt",
      title: "Hủy đăng ký lúc",
      type: "datetime",
      description: "Ngày và giờ người dùng hủy đăng ký nhận tin (nếu có)",
    }),
    defineField({
      name: "source",
      title: "Nguồn đăng ký",
      type: "string",
      description: "Đăng ký này được tạo từ nguồn nào",
      options: {
        list: [
          { title: "Form chân trang", value: "footer" },
          { title: "Popup", value: "popup" },
          { title: "Thanh toán", value: "checkout" },
          { title: "Khác", value: "other" },
        ],
      },
      initialValue: "footer",
    }),
    defineField({
      name: "ipAddress",
      title: "Địa chỉ IP",
      type: "string",
      description: "Địa chỉ IP của người đăng ký",
    }),
    defineField({
      name: "userAgent",
      title: "User Agent (Trình duyệt)",
      type: "string",
      description: "Thông tin trình duyệt/thiết bị",
    }),
  ],
  preview: {
    select: {
      email: "email",
      status: "status",
      subscribedAt: "subscribedAt",
    },
    prepare({ email, status, subscribedAt }) {
      const date = subscribedAt
        ? new Date(subscribedAt).toLocaleDateString()
        : "Không có";
      const statusMap: Record<string, string> = {
        active: "Đang hoạt động",
        unsubscribed: "Đã hủy nhận tin",
        pending: "Chờ xử lý",
      };
      const statusDisplay = statusMap[status] || status;
      return {
        title: email,
        subtitle: `${statusDisplay} - Đăng ký: ${date}`,
      };
    },
  },
});
