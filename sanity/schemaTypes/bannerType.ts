import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const bannerType = defineType({
  name: "banner",
  title: "Banner quảng cáo",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "Tiêu đề khuyến mãi",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Mô tả khuyến mãi",
      type: "text",
    }),
    defineField({
      name: "badge",
      title: "Huy hiệu giảm giá",
      type: "string",
      description: "Tỷ lệ hoặc văn bản hiển thị trên huy hiệu",
    }),
    defineField({
      name: "discountAmount",
      title: "Mức giảm giá",
      type: "number",
      description: "Phần trăm giảm giá hoặc giá trị cố định",
    }),
    defineField({
      name: "image",
      title: "Hình ảnh sản phẩm",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    select: {
      title: "title",
      discountAmount: "discountAmount",
      couponCode: "couponCode",
    },
    prepare(select) {
      const { title, discountAmount, couponCode } = select;

      return {
        title,
        subtitle: `Giảm ${discountAmount}% - Mã: ${couponCode}`,
      };
    },
  },
});
