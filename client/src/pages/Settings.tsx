import { Layout } from "@/components/layout/Layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Lock, Bell } from "lucide-react";

export default function Settings() {
  return (
    <Layout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">Cài đặt</h1>
          <p className="text-muted-foreground mt-1">Quản lý tài khoản và tùy chọn hệ thống</p>
        </div>

        <Tabs defaultValue="account" className="w-full">
          <TabsList className="bg-white/50 p-1 rounded-2xl border border-border/50">
            <TabsTrigger value="account" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <User className="w-4 h-4 mr-2" /> Tài khoản
            </TabsTrigger>
            <TabsTrigger value="security" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Lock className="w-4 h-4 mr-2" /> Bảo mật
            </TabsTrigger>
            <TabsTrigger value="notifications" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Bell className="w-4 h-4 mr-2" /> Thông báo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="mt-6">
            <Card className="border-none shadow-lg shadow-black/5">
              <CardHeader>
                <CardTitle>Thông tin cá nhân</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Họ và tên</Label>
                    <Input defaultValue="Nguyễn Văn A" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input defaultValue="admin@logitrack.com" className="rounded-xl" disabled />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Số điện thoại</Label>
                  <Input defaultValue="0912345678" className="rounded-xl" />
                </div>
                <div className="pt-4 flex justify-end">
                  <Button className="rounded-xl bg-primary shadow-lg shadow-primary/25">Lưu thay đổi</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="mt-6">
            <Card className="border-none shadow-lg shadow-black/5">
              <CardHeader>
                <CardTitle>Đổi mật khẩu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Mật khẩu hiện tại</Label>
                  <Input type="password" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Mật khẩu mới</Label>
                  <Input type="password" className="rounded-xl" />
                </div>
                <div className="pt-4 flex justify-end">
                  <Button className="rounded-xl bg-primary shadow-lg shadow-primary/25">Cập nhật mật khẩu</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
