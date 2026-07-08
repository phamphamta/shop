import { StarIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const reviewType = defineType({
  name: "review",
  title: "Đánh giá sản phẩm",
  type: "document",
  icon: StarIcon,
  fields: [
    defineField({
      name: "product",
      title: "Sản phẩm",
      type: "reference",
      to: [{ type: "product" }],
      validation: (Rule) => Rule.required(),
      description: "Sản phẩm được đánh giá",
    }),
    defineField({
      name: "user",
      title: "Người dùng",
      type: "reference",
      to: [{ type: "user" }],
      validation: (Rule) => Rule.required(),
      description: "Người dùng đã viết đánh giá",
    }),
    defineField({
      name: "rating",
      title: "Đánh giá (sao)",
      type: "number",
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .max(5)
          .integer()
          .error("Đánh giá phải từ 1 đến 5 sao"),
      description: "Đánh giá từ 1 đến 5 sao",
    }),
    defineField({
      name: "title",
      title: "Tiêu đề đánh giá",
      type: "string",
      validation: (Rule) =>
        Rule.required()
          .min(5)
          .max(100)
          .error("Tiêu đề phải từ 5 đến 100 ký tự"),
      description: "Tiêu đề ngắn gọn cho bài đánh giá",
    }),
    defineField({
      name: "content",
      title: "Nội dung đánh giá",
      type: "text",
      validation: (Rule) =>
        Rule.required()
          .min(20)
          .max(1000)
          .error("Nội dung đánh giá phải từ 20 đến 1000 ký tự"),
      description: "Văn bản đánh giá chi tiết",
    }),
    defineField({
      name: "isVerifiedPurchase",
      title: "Mua hàng đã xác minh",
      type: "boolean",
      initialValue: false,
      description: "Đánh giá này có phải từ người mua hàng đã xác minh hay không",
      readOnly: true,
    }),
    defineField({
      name: "status",
      title: "Trạng thái đánh giá",
      type: "string",
      options: {
        list: [
          { title: "Chờ duyệt", value: "pending" },
          { title: "Đã duyệt", value: "approved" },
          { title: "Từ chối", value: "rejected" },
        ],
        layout: "radio",
      },
      initialValue: "pending",
      validation: (Rule) => Rule.required(),
      description: "Trạng thái phê duyệt của quản trị viên",
    }),
    defineField({
      name: "helpful",
      title: "Số lượt hữu ích",
      type: "number",
      initialValue: 0,
      validation: (Rule) => Rule.min(0),
      description: "Số lượng người dùng thấy đánh giá này hữu ích",
    }),
    defineField({
      name: "helpfulBy",
      title: "Được đánh dấu hữu ích bởi",
      type: "array",
      of: [{ type: "reference", to: [{ type: "user" }] }],
      description: "Những người dùng đã đánh dấu đánh giá này là hữu ích",
      hidden: true,
    }),
    defineField({
      name: "adminNotes",
      title: "Ghi chú của quản trị viên",
      type: "text",
      description: "Ghi chú nội bộ cho quản trị viên (không hiển thị cho người dùng)",
    }),
    defineField({
      name: "createdAt",
      title: "Ngày tạo",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
    defineField({
      name: "updatedAt",
      title: "Ngày cập nhật",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "approvedAt",
      title: "Ngày duyệt",
      type: "datetime",
      readOnly: true,
      description: "Thời điểm đánh giá được phê duyệt",
    }),
    defineField({
      name: "approvedBy",
      title: "Duyệt bởi",
      type: "string",
      readOnly: true,
      description: "Quản trị viên đã duyệt đánh giá này",
    }),
  ],
  preview: {
    select: {
      title: "title",
      rating: "rating",
      status: "status",
      userName: "user.firstName",
      userLastName: "user.lastName",
      productName: "product.name",
    },
    prepare(selection) {
      const { title, rating, status, userName, userLastName, productName } =
        selection;
      const stars = "★".repeat(rating || 0) + "☆".repeat(5 - (rating || 0));
      const reviewer =
        userName && userLastName
          ? `${userName} ${userLastName}`
          : "Người dùng ẩn danh";

      return {
        title: title || "Đánh giá chưa có tiêu đề",
        subtitle: `${stars} - ${reviewer} | ${
          productName || "Sản phẩm không xác định"
        }`,
        description: `Trạng thái: ${status || "pending"}`,
      };
    },
  },
  orderings: [
    {
      title: "Ngày tạo, mới nhất",
      name: "createdDateDesc",
      by: [{ field: "createdAt", direction: "desc" }],
    },
    {
      title: "Ngày tạo, cũ nhất",
      name: "createdDateAsc",
      by: [{ field: "createdAt", direction: "asc" }],
    },
    {
      title: "Đánh giá, cao nhất",
      name: "ratingDesc",
      by: [{ field: "rating", direction: "desc" }],
    },
    {
      title: "Đánh giá, thấp nhất",
      name: "ratingAsc",
      by: [{ field: "rating", direction: "asc" }],
    },
    {
      title: "Hữu ích nhất",
      name: "helpfulDesc",
      by: [{ field: "helpful", direction: "desc" }],
    },
  ],
});
