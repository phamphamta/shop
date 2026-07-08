"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { showToast } from "@/lib/toast";
import LocationSelector from "@/components/ui/location-selector";
import { MapPin, Save, X, Trash2 } from "lucide-react";

interface Address {
  _id?: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  default: boolean;
  type: "home" | "office" | "other";
  phone?: string;
  subArea?: string;
  countryCode?: string;
  stateCode?: string;
}

interface AddressEditSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  address?: Address | null;
  userId: string;
  onAddressChange?: () => void;
}

export default function AddressEditSidebar({
  isOpen,
  onClose,
  address,
  userId,
  onAddressChange,
}: AddressEditSidebarProps) {
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formData, setFormData] = useState<Address>({
    _id: address?._id || "",
    name: address?.name || "",
    address: address?.address || "",
    city: address?.city || "",
    state: address?.state || "",
    zip: address?.zip || "",
    country: address?.country || "",
    countryCode: address?.countryCode || "",
    stateCode: address?.stateCode || "",
    subArea: address?.subArea || "",
    default: address?.default || false,
    type: address?.type || "home",
    phone: address?.phone || "",
  });

  const isEditing = !!address?._id;

  const handleLocationChange = (location: {
    country: string;
    countryCode: string;
    state: string;
    stateCode: string;
    city: string;
    subArea?: string;
    zipCode?: string;
  }) => {
    setFormData((prev) => ({
      ...prev,
      country: location.country,
      countryCode: location.countryCode,
      state: location.state,
      stateCode: location.stateCode,
      city: location.city,
      subArea: location.subArea || "",
      zip: location.zipCode || "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.zip ||
      !formData.country
    ) {
      showToast.error(
        "Lỗi xác thực",
        "Vui lòng điền đầy đủ các trường bắt buộc bao gồm thông tin địa điểm."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/user/addresses", {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userId,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        showToast.success(
          isEditing ? "Đã cập nhật địa chỉ" : "Đã thêm địa chỉ",
          `Địa chỉ của bạn đã được ${isEditing ? "cập nhật" : "thêm"}`
        );
        onClose();
        if (onAddressChange) {
          onAddressChange();
        }
      } else {
        console.error("API Error:", result);
        throw new Error(
          result.error || `Không thể ${isEditing ? "cập nhật" : "thêm"} địa chỉ`
        );
      }
    } catch (error) {
      console.error("Error saving address:", error);
      showToast.error(
        "Lỗi",
        error instanceof Error
          ? error.message
          : `Không thể ${isEditing ? "cập nhật" : "thêm"} địa chỉ. Vui lòng thử lại.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditing || !address?._id) return;

    if (!confirm("Bạn có chắc chắn muốn xóa địa chỉ này không?")) return;

    setDeleteLoading(true);

    try {
      const response = await fetch(`/api/user/addresses`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ addressId: address._id }),
      });

      if (response.ok) {
        showToast.success(
          "Đã xóa địa chỉ",
          "Địa chỉ của bạn đã được xóa thành công."
        );
        onClose();
        if (onAddressChange) {
          onAddressChange();
        }
      } else {
        throw new Error("Không thể xóa địa chỉ");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      showToast.error("Lỗi", "Không thể xóa địa chỉ. Vui lòng thử lại.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleInputChange = (field: keyof Address, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="sticky top-0 bg-white z-10 pb-4 border-b">
          <SheetTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>{isEditing ? "Chỉnh sửa" : "Thêm"} địa chỉ giao hàng</span>
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Cập nhật thông tin địa chỉ giao hàng của bạn."
              : "Thêm địa chỉ giao hàng mới vào tài khoản của bạn."}
          </SheetDescription>
        </SheetHeader>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Tên địa chỉ *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Ví dụ: Nhà riêng, Công ty, Nhà bố mẹ"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Ví dụ: 0901234567"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="type">Loại địa chỉ</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  handleInputChange(
                    "type",
                    value as "home" | "office" | "other"
                  )
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Chọn loại địa chỉ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">Nhà riêng</SelectItem>
                  <SelectItem value="office">Công ty</SelectItem>
                  <SelectItem value="other">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="address">Địa chỉ đường *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Nhập địa chỉ của bạn (số nhà, tên đường, căn hộ/tầng)"
                required
                className="mt-1"
              />
            </div>

            <div>
              <LocationSelector
                value={{
                  country: formData.country,
                  countryCode: formData.countryCode || "",
                  state: formData.state,
                  stateCode: formData.stateCode || "",
                  city: formData.city,
                  subArea: formData.subArea || "",
                  zipCode: formData.zip,
                }}
                onChange={handleLocationChange}
                className="mt-1"
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <Label htmlFor="default" className="text-sm font-medium">
                  Đặt làm địa chỉ mặc định
                </Label>
                <p className="text-xs text-gray-500">
                  Địa chỉ này sẽ được sử dụng làm địa chỉ giao hàng chính của bạn
                </p>
              </div>
              <Switch
                id="default"
                checked={formData.default}
                onCheckedChange={(checked) =>
                  handleInputChange("default", checked)
                }
              />
            </div>

            <div className="flex space-x-3 pt-6 border-t">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{isEditing ? "Đang cập nhật..." : "Đang thêm..."}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Save className="h-4 w-4" />
                    <span>{isEditing ? "Cập nhật" : "Thêm"} địa chỉ</span>
                  </div>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading || deleteLoading}
              >
                <X className="h-4 w-4 mr-2" />
                Hủy
              </Button>
            </div>

            {isEditing && (
              <div className="pt-4 border-t">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteLoading || loading}
                  className="w-full"
                >
                  {deleteLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Đang xóa...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Trash2 className="h-4 w-4" />
                      <span>Xóa địa chỉ</span>
                    </div>
                  )}
                </Button>
              </div>
            )}
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}