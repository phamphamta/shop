import { BasketIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const orderType = defineType({
  name: "order",
  title: "Đơn hàng",
  type: "document",
  icon: BasketIcon,
  fields: [
    defineField({
      name: "orderNumber",
      title: "Số đơn hàng",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    {
      name: "invoice",
      type: "object",
      fields: [
        { name: "id", type: "string" },
        { name: "number", type: "string" },
        { name: "hosted_invoice_url", type: "url" },
      ],
    },
    defineField({
      name: "stripeCheckoutSessionId",
      title: "ID phiên thanh toán Stripe",
      type: "string",
      hidden: ({ document }) => document?.paymentMethod !== "stripe",
    }),
    defineField({
      name: "stripeCustomerId",
      title: "ID khách hàng Stripe",
      type: "string",
      hidden: ({ document }) => document?.paymentMethod !== "stripe",
    }),
    defineField({
      name: "clerkUserId",
      title: "ID người dùng",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "clerkPaymentId",
      title: "ID thanh toán Clerk",
      type: "string",
      description: "ID phiên hoặc giao dịch thanh toán Clerk",
      hidden: ({ document }) => document?.paymentMethod !== "clerk",
    }),
    defineField({
      name: "clerkPaymentStatus",
      title: "Trạng thái thanh toán Clerk",
      type: "string",
      description: "Trạng thái thanh toán Clerk",
      hidden: ({ document }) => document?.paymentMethod !== "clerk",
    }),
    defineField({
      name: "customerName",
      title: "Tên khách hàng",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email khách hàng",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "stripePaymentIntentId",
      title: "ID thanh toán Stripe",
      type: "string",
      hidden: ({ document }) => document?.paymentMethod !== "stripe",
    }),
    defineField({
      name: "products",
      title: "Sản phẩm",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "product",
              title: "Sản phẩm đã mua",
              type: "reference",
              to: [{ type: "product" }],
            }),
            defineField({
              name: "quantity",
              title: "Số lượng đã mua",
              type: "number",
            }),
          ],
          preview: {
            select: {
              product: "product.name",
              quantity: "quantity",
              image: "product.image",
              price: "product.price",
              currency: "product.currency",
            },
            prepare(select) {
              return {
                title: `${select.product} x ${select.quantity}`,
                subtitle: `${select.price * select.quantity}`,
                media: select.image,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "subtotal",
      title: "Tạm tính",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "tax",
      title: "Thuế",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "shipping",
      title: "Phí vận chuyển",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "totalPrice",
      title: "Tổng cộng",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "currency",
      title: "Đơn vị tiền tệ",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "amountDiscount",
      title: "Số tiền giảm giá",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "address",
      title: "Địa chỉ giao hàng",
      type: "object",
      fields: [
        defineField({ name: "state", title: "Tỉnh/Thành phố", type: "string" }),
        defineField({ name: "zip", title: "Mã bưu chính", type: "string" }),
        defineField({ name: "city", title: "Thành phố", type: "string" }),
        defineField({ name: "address", title: "Địa chỉ", type: "string" }),
        defineField({ name: "name", title: "Tên", type: "string" }),
      ],
    }),
    defineField({
      name: "status",
      title: "Trạng thái đơn hàng",
      type: "string",
      options: {
        list: [
          { title: "Chờ xử lý", value: "pending" },
          { title: "Đã xác nhận địa chỉ", value: "address_confirmed" },
          { title: "Đã xác nhận đơn hàng", value: "order_confirmed" },
          { title: "Đã đóng gói", value: "packed" },
          { title: "Sẵn sàng giao hàng", value: "ready_for_delivery" },
          { title: "Đang giao hàng", value: "out_for_delivery" },
          { title: "Đã giao hàng", value: "delivered" },
          { title: "Hoàn thành", value: "completed" },
          { title: "Đã hủy", value: "cancelled" },
          { title: "Đặt lại lịch giao", value: "rescheduled" },
          { title: "Giao hàng thất bại", value: "failed_delivery" },
        ],
      },
      initialValue: "pending",
    }),
    defineField({
      name: "orderDate",
      title: "Ngày đặt hàng",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "paymentStatus",
      title: "Trạng thái thanh toán",
      type: "string",
      options: {
        list: [
          { title: "Chờ xử lý", value: "pending" },
          { title: "Đã thanh toán", value: "paid" },
          { title: "Thất bại", value: "failed" },
          { title: "Đã hủy", value: "cancelled" },
        ],
      },
      initialValue: "pending",
    }),
    defineField({
      name: "paymentMethod",
      title: "Phương thức thanh toán",
      type: "string",
      options: {
        list: [
          { title: "Tiền mặt khi nhận hàng", value: "cash_on_delivery" },
          { title: "Stripe", value: "stripe" },
          { title: "Clerk", value: "clerk" },
          { title: "Thẻ ngân hàng", value: "card" },
        ],
      },
    }),
    // Employee tracking fields
    defineField({
      name: "addressConfirmedBy",
      title: "Xác nhận địa chỉ bởi",
      type: "string",
      description: "Nhân viên call center đã xác nhận địa chỉ",
    }),
    defineField({
      name: "addressConfirmedAt",
      title: "Xác nhận địa chỉ lúc",
      type: "datetime",
    }),
    defineField({
      name: "orderConfirmedBy",
      title: "Xác nhận đơn hàng bởi",
      type: "string",
      description: "Nhân viên call center đã xác nhận đơn hàng",
    }),
    defineField({
      name: "orderConfirmedAt",
      title: "Xác nhận đơn hàng lúc",
      type: "datetime",
    }),
    defineField({
      name: "packedBy",
      title: "Đóng gói bởi",
      type: "string",
      description: "Nhân viên đóng gói đơn hàng",
    }),
    defineField({
      name: "packedAt",
      title: "Đóng gói lúc",
      type: "datetime",
    }),
    defineField({
      name: "packingNotes",
      title: "Ghi chú đóng gói",
      type: "text",
      description: "Ghi chú của nhân viên đóng gói",
    }),
    defineField({
      name: "assignedWarehouseBy",
      title: "Chuyển kho bởi",
      type: "string",
      description: "Nhân viên chuyển đơn hàng vào kho",
    }),
    defineField({
      name: "assignedWarehouseAt",
      title: "Chuyển kho lúc",
      type: "datetime",
    }),
    defineField({
      name: "dispatchedBy",
      title: "Xuất kho bởi",
      type: "string",
      description: "Nhân viên kho xuất hàng",
    }),
    defineField({
      name: "dispatchedAt",
      title: "Xuất kho lúc",
      type: "datetime",
    }),
    defineField({
      name: "assignedDeliverymanId",
      title: "ID nhân viên giao hàng",
      type: "string",
      description: "ID nhân viên giao hàng được phân công",
    }),
    defineField({
      name: "assignedDeliverymanName",
      title: "Tên nhân viên giao hàng",
      type: "string",
      description: "Tên nhân viên giao hàng được phân công",
    }),
    defineField({
      name: "deliveredBy",
      title: "Giao hàng bởi",
      type: "string",
      description: "Nhân viên đã thực hiện giao hàng",
    }),
    defineField({
      name: "deliveredAt",
      title: "Giao hàng lúc",
      type: "datetime",
    }),
    defineField({
      name: "deliveryNotes",
      title: "Ghi chú giao hàng",
      type: "text",
      description: "Ghi chú của nhân viên giao hàng",
    }),
    defineField({
      name: "deliveryAttempts",
      title: "Số lần thử giao hàng",
      type: "number",
      initialValue: 0,
      description: "Số lần đã cố giao hàng",
    }),
    defineField({
      name: "rescheduledDate",
      title: "Ngày giao hàng lại",
      type: "datetime",
      description: "Ngày giao hàng mới nếu đặt lại lịch",
    }),
    defineField({
      name: "rescheduledReason",
      title: "Lý do đổi lịch",
      type: "text",
      description: "Lý do đặt lại lịch giao hàng",
    }),
    defineField({
      name: "cashCollected",
      title: "Đã thu tiền mặt",
      type: "boolean",
      initialValue: false,
      description: "Đã thu tiền mặt từ khách hàng chưa",
    }),
    defineField({
      name: "cashCollectedAmount",
      title: "Số tiền mặt đã thu",
      type: "number",
      description: "Số tiền mặt đã thu được",
    }),
    defineField({
      name: "cashCollectedAt",
      title: "Thu tiền mặt lúc",
      type: "datetime",
    }),
    // Cash submission to accounts tracking
    defineField({
      name: "cashSubmittedToAccounts",
      title: "Đã nộp tiền mặt về kế toán",
      type: "boolean",
      initialValue: false,
      description: "Nhân viên giao hàng đã nộp tiền mặt cho kế toán chưa",
    }),
    defineField({
      name: "cashSubmittedBy",
      title: "Nộp tiền bởi",
      type: "string",
      description: "Nhân viên giao hàng đã nộp tiền",
    }),
    defineField({
      name: "cashSubmittedAt",
      title: "Nộp tiền lúc",
      type: "datetime",
      description: "Thời điểm nộp tiền cho kế toán",
    }),
    defineField({
      name: "cashSubmissionNotes",
      title: "Ghi chú nộp tiền",
      type: "text",
      description: "Ghi chú của nhân viên giao hàng khi nộp tiền",
    }),
    defineField({
      name: "assignedAccountsEmployeeId",
      title: "ID nhân viên kế toán",
      type: "string",
      description: "ID nhân viên kế toán được phân công nhận tiền",
    }),
    defineField({
      name: "assignedAccountsEmployeeName",
      title: "Tên nhân viên kế toán",
      type: "string",
      description: "Tên nhân viên kế toán được phân công nhận tiền",
    }),
    defineField({
      name: "cashSubmissionStatus",
      title: "Trạng thái nộp tiền",
      type: "string",
      options: {
        list: [
          { title: "Chưa nộp", value: "not_submitted" },
          { title: "Chờ xác nhận", value: "pending" },
          { title: "Đã xác nhận", value: "confirmed" },
          { title: "Bị từ chối", value: "rejected" },
        ],
      },
      initialValue: "not_submitted",
      description: "Trạng thái nộp tiền cho kế toán",
    }),
    defineField({
      name: "cashSubmissionRejectionReason",
      title: "Lý do từ chối nộp tiền",
      type: "text",
      description: "Lý do kế toán từ chối phiếu nộp tiền",
    }),
    defineField({
      name: "paymentReceivedBy",
      title: "Nhận thanh toán bởi",
      type: "string",
      description: "Nhân viên kế toán nhận tiền từ shipper",
    }),
    defineField({
      name: "paymentReceivedAt",
      title: "Nhận thanh toán lúc",
      type: "datetime",
    }),
    // Cancellation tracking fields
    defineField({
      name: "cancellationRequested",
      title: "Yêu cầu hủy đơn",
      type: "boolean",
      initialValue: false,
      description:
        "Khách hàng đã yêu cầu hủy đơn hàng (chờ admin phê duyệt)",
    }),
    defineField({
      name: "cancellationRequestedAt",
      title: "Yêu cầu hủy lúc",
      type: "datetime",
      description: "Thời điểm khách hàng yêu cầu hủy đơn",
    }),
    defineField({
      name: "cancellationRequestReason",
      title: "Lý do yêu cầu hủy",
      type: "text",
      description: "Lý do khách hàng cung cấp khi yêu cầu hủy đơn",
    }),
    defineField({
      name: "cancelledAt",
      title: "Đã hủy lúc",
      type: "datetime",
      description: "Thời điểm đơn hàng bị hủy",
    }),
    defineField({
      name: "cancelledBy",
      title: "Hủy bởi",
      type: "string",
      description: "Người hủy đơn hàng (khách hàng, email admin hoặc hệ thống)",
    }),
    defineField({
      name: "cancellationReason",
      title: "Lý do hủy đơn",
      type: "text",
      description: "Lý do hủy đơn cuối cùng (dùng khi đơn đã bị hủy)",
    }),
    defineField({
      name: "amountPaid",
      title: "Số tiền đã thanh toán",
      type: "number",
      description: "Tổng số tiền khách hàng đã trả (dùng để theo dõi hoàn tiền)",
    }),
    defineField({
      name: "refundedToWallet",
      title: "Đã hoàn tiền vào ví",
      type: "boolean",
      initialValue: false,
      description: "Đã hoàn tiền vào ví của khách hàng chưa",
    }),
    defineField({
      name: "refundAmount",
      title: "Số tiền hoàn",
      type: "number",
      description: "Số tiền đã hoàn vào ví",
    }),
    defineField({
      name: "statusHistory",
      title: "Lịch sử trạng thái",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "status",
              title: "Trạng thái",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "changedBy",
              title: "Thay đổi bởi",
              type: "string",
              description: "Email nhân viên hoặc admin đã thay đổi trạng thái",
            }),
            defineField({
              name: "changedByRole",
              title: "Vai trò người thay đổi",
              type: "string",
              options: {
                list: [
                  { title: "Admin", value: "admin" },
                  { title: "Call Center", value: "callcenter" },
                  { title: "Đóng gói", value: "packer" },
                  { title: "Kho hàng", value: "warehouse" },
                  { title: "Giao hàng", value: "deliveryman" },
                  { title: "Phụ trách", value: "incharge" },
                  { title: "Kế toán", value: "accounts" },
                  { title: "Hệ thống", value: "system" },
                ],
              },
            }),
            defineField({
              name: "changedAt",
              title: "Thay đổi lúc",
              type: "datetime",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "notes",
              title: "Ghi chú",
              type: "text",
            }),
          ],
          preview: {
            select: {
              status: "status",
              changedBy: "changedBy",
              changedAt: "changedAt",
            },
            prepare(select) {
              return {
                title: select.status,
                subtitle: `Bởi ${select.changedBy} lúc ${new Date(
                  select.changedAt
                ).toLocaleDateString()}`,
              };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      name: "customerName",
      amount: "totalPrice",
      currency: "currency",
      orderId: "orderNumber",
      email: "email",
      status: "status",
      paymentStatus: "paymentStatus",
    },
    prepare(select) {
      const orderIdSnippet = `${select.orderId.slice(
        0,
        5
      )}...${select.orderId.slice(-5)}`;

      // Format status for display
      const statusMap: Record<string, string> = {
        pending: "🔴 Chờ xử lý",
        address_confirmed: "🟡 Đã xác nhận địa chỉ",
        order_confirmed: "🟢 Đã xác nhận đơn hàng",
        packed: "📦 Đã đóng gói",
        ready_for_delivery: "🏭 Sẵn sàng giao",
        out_for_delivery: "🚚 Đang giao hàng",
        delivered: "✅ Đã giao hàng",
        completed: "✔️ Hoàn thành",
        cancelled: "❌ Đã hủy",
        rescheduled: "🔄 Đặt lại lịch",
        failed_delivery: "⚠️ Giao hàng thất bại",
      };

      const statusDisplay = statusMap[select.status] || select.status;
      const paymentDisplay =
        select.paymentStatus === "paid"
          ? "💳 Đã thanh toán"
          : "💰 " + select.paymentStatus;

      return {
        title: `${select.name} (${orderIdSnippet})`,
        subtitle: `${statusDisplay} | ${select.amount} ${select.currency} | ${paymentDisplay}`,
        media: BasketIcon,
      };
    },
  },
});
