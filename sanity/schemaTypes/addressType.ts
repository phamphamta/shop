import { HomeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const addressType = defineType({
  name: "address",
  title: "Địa chỉ",
  type: "document",
  icon: HomeIcon,
  fields: [
    defineField({
      name: "name",
      title: "Họ và tên",
      type: "string",
      description: "Họ và tên đầy đủ cho địa chỉ này",
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: "email",
      title: "Email người dùng",
      type: "email",
      description: "Email của người dùng sở hữu địa chỉ này",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "user",
      title: "Người dùng",
      type: "reference",
      to: [{ type: "user" }],
      description: "Liên kết đến người dùng sở hữu địa chỉ này",
    }),
    defineField({
      name: "phone",
      title: "Số điện thoại",
      type: "string",
      description: "Số điện thoại cho địa chỉ này (tùy chọn)",
    }),
    defineField({
      name: "address",
      title: "Địa chỉ đường phố",
      type: "string",
      description: "Địa chỉ đường phố bao gồm số căn hộ/phòng",
      validation: (Rule) => Rule.required().min(5).max(200),
    }),
    defineField({
      name: "city",
      title: "Thành phố",
      type: "string",
      validation: (Rule) => Rule.required().max(50),
    }),
    defineField({
      name: "state",
      title: "Tỉnh/Thành",
      type: "string",
      description: "Tỉnh, thành phố hoặc khu vực",
      validation: (Rule) => Rule.required().max(50),
    }),
    defineField({
      name: "zip",
      title: "Mã bưu chính",
      type: "string",
      description: "Mã bưu chính cho địa chỉ này",
      validation: (Rule) => Rule.required().max(20),
    }),
    defineField({
      name: "country",
      title: "Quốc gia",
      type: "string",
      description: "Quốc gia cho địa chỉ này",
      initialValue: "United States",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "countryCode",
      title: "Mã quốc gia",
      type: "string",
      description: "Mã quốc gia gồm 2 chữ cái (ví dụ: VN, US, CA)",
      validation: (Rule) => Rule.max(2),
    }),
    defineField({
      name: "stateCode",
      title: "Mã bang/tỉnh",
      type: "string",
      description: "Mã bang/tỉnh cho địa chỉ quốc tế",
      validation: (Rule) => Rule.max(10),
    }),
    defineField({
      name: "subArea",
      title: "Khu vực con",
      type: "string",
      description: "Khu vực nhỏ, quận/huyện hoặc khu dân cư",
      validation: (Rule) => Rule.max(100),
    }),
    defineField({
      name: "type",
      title: "Loại địa chỉ",
      type: "string",
      description: "Loại địa chỉ (nhà riêng, văn phòng, khác)",
      options: {
        list: [
          { title: "Nhà riêng", value: "home" },
          { title: "Văn phòng", value: "office" },
          { title: "Khác", value: "other" },
        ],
      },
      initialValue: "home",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "default",
      title: "Địa chỉ mặc định",
      type: "boolean",
      description: "Đây có phải là địa chỉ giao hàng mặc định không?",
      initialValue: false,
    }),
    defineField({
      name: "createdAt",
      title: "Ngày tạo",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "address",
      city: "city",
      state: "state",
      isDefault: "default",
      type: "type",
    },
    prepare({ title, subtitle, city, state, isDefault, type }) {
      return {
        title: `${title} ${isDefault ? "(Mặc định)" : ""}`,
        subtitle: `${type}: ${subtitle}, ${city}, ${state}`,
      };
    },
  },
});
