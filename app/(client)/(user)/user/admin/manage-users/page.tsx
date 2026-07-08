"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User, Crown, Building2 } from "lucide-react";

export default function AdminUserManagement() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSetPremium = async (setPremium: boolean) => {
    if (!email.trim()) {
      toast.error("Vui lòng nhập địa chỉ email");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/admin/manage-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          setPremium,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setEmail(""); // Xóa nội dung ô input
      } else {
        toast.error(data.error || "Không thể cập nhật trạng thái người dùng");
      }
    } catch (error) {
      console.error("Lỗi khi quản lý người dùng:", error);
      toast.error("Đã xảy ra lỗi khi cập nhật người dùng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Quản lý người dùng Admin
        </h1>
        <p className="text-gray-600">
          Quản lý trạng thái tài khoản Premium và các cài đặt tài khoản của người dùng
        </p>
      </div>

      <div className="max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Trạng thái tài khoản Premium
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email người dùng</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <Button
                onClick={() => handleSetPremium(true)}
                disabled={loading}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                <Crown className="w-4 h-4 mr-2" />
                {loading ? "Đang xử lý..." : "Đặt làm Thành viên Premium"}
              </Button>

              <Button
                onClick={() => handleSetPremium(false)}
                disabled={loading}
                variant="outline"
              >
                <User className="w-4 h-4 mr-2" />
                {loading ? "Đang xử lý..." : "Đặt làm Thành viên Thường"}
              </Button>
            </div>

            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <strong>Tài khoản Premium:</strong> isActive = true, nhận được các tính năng cao cấp
              </p>
              <p>
                <strong>Tài khoản Thường:</strong> isActive = false, chỉ sử dụng các tính năng cơ bản
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Truy cập nhanh</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button
                onClick={() => setEmail("dev.reactbd@gmail.com")}
                variant="outline"
                size="sm"
              >
                Chọn người dùng hiện tại (dev.reactbd@gmail.com)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}