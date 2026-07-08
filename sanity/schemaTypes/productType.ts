import { TrolleyIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const productType = defineType({
  name: "product",
  title: "Sản phẩm",
  type: "document",
  icon: TrolleyIcon,
  fields: [
    defineField({
      name: "name",
      title: "Tên sản phẩm",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "images",
      title: "Hình ảnh sản phẩm",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "description",
      title: "Mô tả ngắn",
      type: "text",
      rows: 3,
      description: "Mô tả ngắn hiển thị gần tên sản phẩm",
    }),
    defineField({
      name: "detailDescription",
      title: "Mô tả chi tiết",
      type: "text",
      rows: 8,
      description: "Mô tả chi tiết hiển thị trong phần Mô tả",
    }),
    defineField({
      name: "weight",
      title: "Cân nặng",
      type: "string",
      description: "Ví dụ: 1.7 kg",
    }),
    defineField({
      name: "dimensions",
      title: "Kích thước",
      type: "string",
      description: "Ví dụ: 35.8 × 23.5 × 1.9 cm",
    }),
    defineField({
      name: "price",
      title: "Giá",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "discount",
      title: "Giảm giá",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "categories",
      title: "Danh mục",
      type: "array",
      of: [{ type: "reference", to: { type: "category" } }],
    }),
    defineField({
      name: "stock",
      title: "Tồn kho",
      type: "number",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "brand",
      title: "Thương hiệu",
      type: "reference",
      to: { type: "brand" },
    }),

    defineField({
      name: "status",
      title: "Trạng thái sản phẩm",
      type: "string",
      options: {
        list: [
          { title: "Mới", value: "new" },
          { title: "Hot", value: "hot" },
          { title: "Khuyến mãi", value: "sale" },
        ],
      },
    }),
    defineField({
      name: "variant",
      title: "Loại sản phẩm",
      type: "string",
      options: {
        list: [
          { title: "Thiết bị", value: "gadget" },
          { title: "Thiết bị gia dụng", value: "appliances" },
          { title: "Tủ lạnh", value: "refrigerators" },
          { title: "Khác", value: "others" },
        ],
      },
    }),
    defineField({
      name: "isFeatured",
      title: "Sản phẩm nổi bật",
      type: "boolean",
      description: "Bật/Tắt trạng thái Nổi bật",
      initialValue: false,
    }),
    defineField({
      name: "averageRating",
      title: "Đánh giá trung bình",
      type: "number",
      readOnly: true,
      description: "Đánh giá trung bình được tính toán từ các đánh giá đã duyệt",
      validation: (Rule) => Rule.min(0).max(5),
    }),
    defineField({
      name: "totalReviews",
      title: "Tổng số đánh giá",
      type: "number",
      readOnly: true,
      initialValue: 0,
      description: "Tổng số đánh giá đã được duyệt",
    }),
    defineField({
      name: "ratingDistribution",
      title: "Phân phối đánh giá",
      type: "object",
      readOnly: true,
      description: "Phân phối đánh giá (1-5 sao)",
      fields: [
        defineField({
          name: "fiveStars",
          title: "5 Sao",
          type: "number",
          initialValue: 0,
        }),
        defineField({
          name: "fourStars",
          title: "4 Sao",
          type: "number",
          initialValue: 0,
        }),
        defineField({
          name: "threeStars",
          title: "3 Sao",
          type: "number",
          initialValue: 0,
        }),
        defineField({
          name: "twoStars",
          title: "2 Sao",
          type: "number",
          initialValue: 0,
        }),
        defineField({
          name: "oneStar",
          title: "1 Sao",
          type: "number",
          initialValue: 0,
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "images",
      subtitle: "price",
    },
    prepare(selection) {
      const { title, subtitle, media } = selection;
      const image = media && media[0];
      return {
        title: title,
        subtitle: `$${subtitle}`,
        media: image,
      };
    },
  },
});
