import { DocumentTextIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const blogType = defineType({
  name: "blog",
  title: "Bài viết Blog",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      title: "Tiêu đề",
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
      name: "author",
      title: "Tác giả",
      type: "reference",
      to: { type: "author" },
    }),
    defineField({
      name: "mainImage",
      title: "Ảnh chính",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "blogcategories",
      title: "Danh mục Blog",
      type: "array",
      of: [
        defineArrayMember({ type: "reference", to: { type: "blogcategory" } }),
      ],
    }),
    defineField({
      name: "publishedAt",
      title: "Ngày xuất bản",
      type: "datetime",
    }),
    defineField({
      name: "isLatest",
      title: "Blog mới nhất",
      type: "boolean",
      description: "Bật/Tắt trạng thái Mới nhất",
      initialValue: true,
    }),
    defineField({
      name: "body",
      title: "Nội dung",
      type: "blockContent",
    }),
  ],
  preview: {
    select: {
      title: "title",
      author: "author.name",
      media: "mainImage",
      isLatest: "isLatest",
    },
    prepare(selection) {
      const { author, isLatest } = selection;
      return {
        ...selection,
        subtitle: author && `${isLatest ? "Mới nhất | " : ""} Viết bởi ${author}`,
      };
    },
  },
});
