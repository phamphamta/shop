import { defineField, defineType } from "sanity";
import { MessageCircle } from "lucide-react";

export const contactType = defineType({
  name: "contact",
  title: "Tin nhắn liên hệ",
  type: "document",
  icon: MessageCircle,
  fields: [
    defineField({
      name: "name",
      title: "Họ và tên",
      type: "string",
      validation: (Rule) => Rule.required().min(2).max(100),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "subject",
      title: "Tiêu đề",
      type: "string",
      validation: (Rule) => Rule.required().min(5).max(200),
    }),
    defineField({
      name: "message",
      title: "Nội dung tin nhắn",
      type: "text",
      validation: (Rule) => Rule.required().min(10).max(1000),
    }),
    defineField({
      name: "status",
      title: "Trạng thái",
      type: "string",
      options: {
        list: [
          { title: "Mới", value: "new" },
          { title: "Đã đọc", value: "read" },
          { title: "Đã trả lời", value: "replied" },
          { title: "Đã đóng", value: "closed" },
        ],
      },
      initialValue: "new",
    }),
    defineField({
      name: "priority",
      title: "Độ ưu tiên",
      type: "string",
      options: {
        list: [
          { title: "Thấp", value: "low" },
          { title: "Trung bình", value: "medium" },
          { title: "Cao", value: "high" },
          { title: "Khẩn cấp", value: "urgent" },
        ],
      },
      initialValue: "medium",
    }),
    defineField({
      name: "submittedAt",
      title: "Gửi lúc",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
    defineField({
      name: "ipAddress",
      title: "Địa chỉ IP",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "userAgent",
      title: "User Agent (Trình duyệt)",
      type: "text",
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "email",
      status: "status",
      submittedAt: "submittedAt",
    },
    prepare({ title, subtitle, status, submittedAt }) {
      const date = new Date(submittedAt).toLocaleDateString();
      return {
        title: `${title} (${status?.toUpperCase()})`,
        subtitle: `${subtitle} • ${date}`,
      };
    },
  },
  orderings: [
    {
      title: "Mới nhất trước",
      name: "newestFirst",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
    {
      title: "Cũ nhất trước",
      name: "oldestFirst",
      by: [{ field: "submittedAt", direction: "asc" }],
    },
    {
      title: "Độ ưu tiên",
      name: "priority",
      by: [{ field: "priority", direction: "desc" }],
    },
  ],
});
