import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const categoryType = defineType({
  name: "category",
  title: "Danh mục",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "Tên danh mục",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Đường dẫn",
      type: "slug",
      options: {
        source: "title",
      },
    }),
    defineField({
      name: "description",
      title: "Mô tả",
      type: "text",
    }),
    defineField({
      name: "range",
      title: "Khoảng bắt đầu từ",
      type: "number",
      description: "Mức giá khởi điểm",
    }),
    defineField({
      name: "featured",
      title: "Nổi bật",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "image",
      title: "Hình ảnh danh mục",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
      media: "image",
    },
  },
});
