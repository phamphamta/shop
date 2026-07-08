import { UserIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const authorType = defineType({
  name: "author",
  title: "Tác giả",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "name",
      title: "Tên tác giả",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Đường dẫn",
      type: "slug",
      options: {
        source: "name",
      },
    }),
    defineField({
      name: "image",
      title: "Ảnh đại diện",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "bio",
      title: "Tiểu sử",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [{ title: "Thường", value: "normal" }],
          lists: [],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "image",
    },
  },
});
