"use client";

import { useState } from "react";
import { Bell, Shield, Trash2, Download } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import NewsletterSubscription from "@/components/profile/NewsletterSubscription";

export default function UserSettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    orderUpdates: true,
    marketingEmails: false,
    twoFactorAuth: false,
    profileVisibility: true,
  });

  const handleSettingChange = async (key: string, value: boolean) => {
    try {
      const response = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [key]: value }),
      });

      if (response.ok) {
        setSettings((prev) => ({ ...prev, [key]: value }));
        toast.success("Cài đặt đã được cập nhật thành công");
      } else {
        toast.error("Không thể cập nhật cài đặt");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật cài đặt:", error);
      toast.error("Không thể cập nhật cài đặt");
    }
  };

  const handleExportData = async () => {
    try {
      const response = await fetch("/api/user/export-data");
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "user-data.json";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success("Dữ liệu đã được xuất thành công");
      } else {
        toast.error("Không thể xuất dữ liệu");
      }
    } catch (error) {
      console.error("Lỗi khi xuất dữ liệu:", error);
      toast.error("Không thể xuất dữ liệu");
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn xóa tài khoản không? Hành động này không thể hoàn tác."
      )
    ) {
      try {
        const response = await fetch("/api/user/delete-account", {
          method: "DELETE",
        });

        if (response.ok) {
          toast.success("Đã bắt đầu quy trình xóa tài khoản");
        } else {
          toast.error("Không thể xóa tài khoản");
        }
      } catch (error) {
        console.error("Lỗi khi xóa tài khoản:", error);
        toast.error("Không thể xóa tài khoản");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cài đặt</h1>
        <p className="text-gray-600">
          Quản lý các tùy chọn tài khoản và cài đặt quyền riêng tư
        </p>
      </div>

      {/* Thông báo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Tùy chọn thông báo
          </CardTitle>
          <CardDescription>
            Chọn cách bạn muốn nhận thông báo về hoạt động tài khoản
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Thông báo qua Email</Label>
              <p className="text-sm text-gray-500">
                Nhận thông báo qua email
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) =>
                handleSettingChange("emailNotifications", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Thông báo đẩy (Push)</Label>
              <p className="text-sm text-gray-500">
                Nhận thông báo đẩy trên trình duyệt của bạn
              </p>
            </div>
            <Switch
              checked={settings.pushNotifications}
              onCheckedChange={(checked) =>
                handleSettingChange("pushNotifications", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Cập nhật đơn hàng</Label>
              <p className="text-sm text-gray-500">
                Nhận thông báo về trạng thái đơn hàng
              </p>
            </div>
            <Switch
              checked={settings.orderUpdates}
              onCheckedChange={(checked) =>
                handleSettingChange("orderUpdates", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email tiếp thị</Label>
              <p className="text-sm text-gray-500">
                Nhận các ưu đãi khuyến mãi và cập nhật
              </p>
            </div>
            <Switch
              checked={settings.marketingEmails}
              onCheckedChange={(checked) =>
                handleSettingChange("marketingEmails", checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Bảo mật */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Bảo mật & Quyền riêng tư
          </CardTitle>
          <CardDescription>
            Quản lý bảo mật tài khoản và tùy chọn quyền riêng tư của bạn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Xác thực hai yếu tố (2FA)</Label>
              <p className="text-sm text-gray-500">
                Thêm một lớp bảo mật cho tài khoản của bạn
              </p>
            </div>
            <Switch
              checked={settings.twoFactorAuth}
              onCheckedChange={(checked) =>
                handleSettingChange("twoFactorAuth", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Hiển thị hồ sơ</Label>
              <p className="text-sm text-gray-500">
                Làm cho hồ sơ của bạn hiển thị với người dùng khác
              </p>
            </div>
            <Switch
              checked={settings.profileVisibility}
              onCheckedChange={(checked) =>
                handleSettingChange("profileVisibility", checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Đăng ký nhận bản tin */}
      <NewsletterSubscription />

      {/* Quản lý dữ liệu */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Download className="mr-2 h-5 w-5" />
            Quản lý dữ liệu
          </CardTitle>
          <CardDescription>Xuất hoặc xóa dữ liệu tài khoản của bạn</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Xuất dữ liệu</Label>
              <p className="text-sm text-gray-500">
                Tải xuống bản sao dữ liệu tài khoản của bạn
              </p>
            </div>
            <Button variant="outline" onClick={handleExportData}>
              <Download className="mr-2 h-4 w-4" />
              Xuất
            </Button>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="flex items-start space-x-3">
                <Trash2 className="h-5 w-5 text-red-500 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-red-800">
                    Xóa tài khoản
                  </h3>
                  <p className="text-sm text-red-700 mt-1">
                    Một khi bạn xóa tài khoản, sẽ không thể hoàn tác. Hãy chắc chắn về quyết định này.
                  </p>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="mt-3"
                    onClick={handleDeleteAccount}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Xóa tài khoản
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}