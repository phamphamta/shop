import { BellIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const sentNotificationType = defineType({
  name: "sentNotification",
  title: "Thông báo đã gửi",
  type: "document",
  icon: BellIcon,
  fields: [
    defineField({
      name: "notificationId",
      title: "Mã thông báo",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Tiêu đề",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "message",
      title: "Nội dung thông báo",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "type",
      title: "Loại thông báo",
      type: "string",
      options: {
        list: [
          { title: "Khuyến mãi", value: "promo" },
          { title: "Cập nhật đơn hàng", value: "order" },
          { title: "Hệ thống", value: "system" },
          { title: "Tiếp thị", value: "marketing" },
          { title: "Chung", value: "general" },
        ],
      },
      validation: (Rule) => Rule.required(),
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sentAt",
      title: "Đã gửi lúc",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sentBy",
      title: "Gửi bởi",
      type: "string",
      description: "Email admin đã gửi thông báo này",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "actionUrl",
      title: "Đường dẫn hành động",
      type: "url",
      description: "Đường dẫn tùy chọn cho hành động của thông báo",
    }),
    defineField({
      name: "recipientCount",
      title: "Số lượng người nhận",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "recipients",
      title: "Danh sách người nhận",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "email",
              title: "Email",
              type: "string",
              validation: (Rule) => Rule.required().email(),
            }),
            defineField({
              name: "name",
              title: "Tên người nhận",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "delivered",
              title: "Đã giao",
              type: "boolean",
              initialValue: false,
            }),
            defineField({
              name: "read",
              title: "Đã đọc",
              type: "boolean",
              initialValue: false,
            }),
            defineField({
              name: "readAt",
              title: "Đọc lúc",
              type: "datetime",
            }),
          ],
          preview: {
            select: {
              email: "email",
              name: "name",
              delivered: "delivered",
              read: "read",
            },
            prepare(select) {
              const { email, name, delivered, read } = select;
              return {
                title: name,
                subtitle: `${email} • ${delivered ? "Đã giao" : "Thất bại"} • ${
                  read ? "Đã đọc" : "Chưa đọc"
                }`,
              };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      type: "type",
      sentAt: "sentAt",
      recipientCount: "recipientCount",
    },
    prepare(select) {
      const { title, type, sentAt, recipientCount } = select;
      return {
        title: title,
        subtitle: `${type} • ${recipientCount} người nhận • ${new Date(
          sentAt
        ).toLocaleDateString()}`,
        media: BellIcon,
      };
    },
  },
});
