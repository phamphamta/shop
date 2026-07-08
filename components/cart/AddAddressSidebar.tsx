"use client";

import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AddAddressSidebarProps {
  userEmail: string;
  isOpen: boolean;
  onClose: () => void;
  onAddressAdded?: () => Promise<void>;
  isFirstAddress?: boolean;
}

export function AddAddressSidebar({
  userEmail,
  isOpen,
  onClose,
  onAddressAdded,
  isFirstAddress = false,
}: AddAddressSidebarProps) {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    isDefault: isFirstAddress, // First address is default by default
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.zip
    ) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc");
      return;
    }

    startTransition(async () => {
      try {
        // Use API route instead of server action for better error handling
        const response = await fetch("/api/user/addresses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Không thể tạo địa chỉ");
        }

        await response.json();
        toast.success("Đã lưu địa chỉ thành công!");
        setFormData({
          name: "",
          address: "",
          city: "",
          state: "",
          zip: "",
          phone: "",
          isDefault: false,
        });
        onClose();

        // Call the callback to refresh addresses if provided
        if (onAddressAdded) {
          await onAddressAdded();
        } else {
          // Fallback to page refresh if no callback provided
          window.location.reload();
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Không thể thêm địa chỉ"
        );
        console.error("Address creation error:", error);
      }
    });
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && !isPending) {
      onClose();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            {isFirstAddress ? "Thêm địa chỉ đầu tiên của bạn" : "Thêm địa chỉ mới"}
          </SheetTitle>
          <SheetDescription>
            Thêm địa chỉ giao hàng cho {userEmail}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col h-full px-3">
          <div className="flex-1 space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Tên địa chỉ *
              </Label>
              <Input
                id="name"
                placeholder="Ví dụ: Nhà riêng, Công ty, Văn phòng"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={isPending}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Số điện thoại
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="0901 234 567"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                disabled={isPending}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium">
                Địa chỉ đường phố *
              </Label>
              <Input
                id="address"
                placeholder="Số nhà, Tên đường, Phường/Xã"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                disabled={isPending}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium">
                  Thành phố *
                </Label>
                <Input
                  id="city"
                  placeholder="Hà Nội"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  disabled={isPending}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state" className="text-sm font-medium">
                  Tỉnh/Thành phố *
                </Label>
                <Input
                  id="state"
                  placeholder="HN"
                  maxLength={2}
                  value={formData.state}
                  onChange={(e) =>
                    handleInputChange("state", e.target.value.toUpperCase())
                  }
                  disabled={isPending}
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="zip" className="text-sm font-medium">
                Mã bưu chính *
              </Label>
              <Input
                id="zip"
                placeholder="12345"
                value={formData.zip}
                onChange={(e) => handleInputChange("zip", e.target.value)}
                disabled={isPending}
                className="w-full"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={formData.isDefault}
                onChange={(e) =>
                  handleInputChange("isDefault", e.target.checked)
                }
                disabled={isPending || isFirstAddress}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="isDefault" className="text-sm">
                {isFirstAddress
                  ? "Đây sẽ là địa chỉ mặc định của bạn"
                  : "Đặt làm địa chỉ mặc định"}
              </Label>
            </div>
          </div>

          <SheetFooter className="flex-shrink-0">
            <div className="flex gap-2 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={() => onClose()}
                disabled={isPending}
                className="flex-1"
              >
                Hủy bỏ
              </Button>
              <Button type="submit" disabled={isPending} className="flex-1">
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  "Thêm địa chỉ"
                )}
              </Button>
            </div>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
