import { defineField, defineType } from "sanity";

export const userAccessRequestType = defineType({
  name: "userAccessRequest",
  title: "Yêu cầu truy cập của người dùng",
  type: "document",
  fields: [
    defineField({
      name: "clerkUserId",
      title: "Mã người dùng Clerk",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "firstName",
      title: "Tên",
      type: "string",
    }),
    defineField({
      name: "lastName",
      title: "Họ",
      type: "string",
    }),
    defineField({
      name: "status",
      title: "Trạng thái",
      type: "string",
      options: {
        list: [
          { title: "Chờ xử lý", value: "pending" },
          { title: "Đã phê duyệt", value: "approved" },
          { title: "Bị từ chối", value: "rejected" },
        ],
      },
      initialValue: "pending",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "requestedAt",
      title: "Yêu cầu lúc",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "approvedAt",
      title: "Phê duyệt lúc",
      type: "datetime",
    }),
    defineField({
      name: "approvedBy",
      title: "Phê duyệt bởi",
      type: "reference",
      to: [{ type: "user" }],
    }),
    defineField({
      name: "rejectedAt",
      title: "Từ chối lúc",
      type: "datetime",
    }),
    defineField({
      name: "rejectedBy",
      title: "Từ chối bởi",
      type: "reference",
      to: [{ type: "user" }],
    }),
    defineField({
      name: "notes",
      title: "Ghi chú của admin",
      type: "text",
      description: "Ghi chú nội bộ cho admin xem xét",
    }),
  ],
  preview: {
    select: {
      title: "email",
      subtitle: "status",
      firstName: "firstName",
      lastName: "lastName",
    },
    prepare(selection) {
      const { title, subtitle, firstName, lastName } = selection;
      const name = firstName && lastName ? `${firstName} ${lastName}` : title;
      const statusMap: Record<string, string> = {
        pending: "Chờ xử lý",
        approved: "Đã phê duyệt",
        rejected: "Bị từ chối",
      };
      const statusDisplay = statusMap[subtitle] || subtitle;
      return {
        title: name,
        subtitle: `Trạng thái: ${statusDisplay}`,
      };
    },
  },
  orderings: [
    {
      title: "Ngày yêu cầu (Mới nhất trước)",
      name: "requestedAtDesc",
      by: [{ field: "requestedAt", direction: "desc" }],
    },
    {
      title: "Trạng thái",
      name: "statusAsc",
      by: [{ field: "status", direction: "asc" }],
    },
  ],
});
