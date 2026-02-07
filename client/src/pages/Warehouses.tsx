import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useWarehouses, useCreateWarehouse, useUpdateWarehouse, useDeleteWarehouse } from "@/hooks/use-warehouses";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Search, MapPin, Building2, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type InsertWarehouse, type Warehouse } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertWarehouseSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Warehouses() {
  const { data: warehouses, isLoading } = useWarehouses();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);

  const deleteMutation = useDeleteWarehouse();
  const { toast } = useToast();

  const filteredWarehouses = warehouses?.filter(w => 
    w.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    w.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa kho này?")) {
      try {
        await deleteMutation.mutateAsync(id);
        toast({ title: "Thành công", description: "Đã xóa kho hàng" });
      } catch (error) {
        toast({ title: "Lỗi", description: "Không thể xóa kho", variant: "destructive" });
      }
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display text-foreground">Quản lý Kho hàng</h1>
            <p className="text-muted-foreground mt-1">Danh sách các kho hàng trong hệ thống</p>
          </div>
          <Button 
            onClick={() => setIsCreateOpen(true)}
            className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 rounded-xl px-6"
          >
            <Plus className="w-5 h-5 mr-2" />
            Thêm kho mới
          </Button>
        </div>

        <Card className="border-none shadow-lg shadow-black/5 overflow-hidden">
          <div className="p-4 border-b border-border/50 bg-white flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Tìm kiếm theo tên hoặc mã..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-secondary/50 border-transparent focus:bg-white focus:border-primary transition-all rounded-lg"
              />
            </div>
            <div className="flex items-center gap-2 ml-auto text-sm text-muted-foreground">
              <Building2 className="w-4 h-4" />
              <span>{filteredWarehouses?.length || 0} Kho</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary/30">
                <TableRow>
                  <TableHead className="w-[100px]">Mã kho</TableHead>
                  <TableHead>Tên kho</TableHead>
                  <TableHead>Địa chỉ</TableHead>
                  <TableHead>Diện tích (m²)</TableHead>
                  <TableHead>Quản lý</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-32 text-muted-foreground">
                      Đang tải dữ liệu...
                    </TableCell>
                  </TableRow>
                ) : filteredWarehouses?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-32 text-muted-foreground">
                      Không tìm thấy kho nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredWarehouses?.map((warehouse) => (
                    <TableRow key={warehouse.id} className="group hover:bg-blue-50/50 transition-colors">
                      <TableCell className="font-medium font-mono text-primary">{warehouse.code}</TableCell>
                      <TableCell className="font-semibold">{warehouse.name}</TableCell>
                      <TableCell className="max-w-[250px] truncate text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          {warehouse.address}
                        </div>
                      </TableCell>
                      <TableCell>{warehouse.area.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="w-3 h-3" />
                          {warehouse.manager}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          warehouse.status === "active" 
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                            : "bg-gray-100 text-gray-500 border-gray-200"
                        }>
                          {warehouse.status === "active" ? "Hoạt động" : "Dừng"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => setEditingWarehouse(warehouse)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(warehouse.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        <WarehouseFormDialog 
          open={isCreateOpen} 
          onOpenChange={setIsCreateOpen} 
          mode="create"
        />
        
        <WarehouseFormDialog 
          open={!!editingWarehouse} 
          onOpenChange={(open) => !open && setEditingWarehouse(null)} 
          mode="edit"
          initialData={editingWarehouse || undefined}
        />
      </div>
    </Layout>
  );
}

function WarehouseFormDialog({ 
  open, 
  onOpenChange, 
  mode, 
  initialData 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  mode: "create" | "edit";
  initialData?: Warehouse;
}) {
  const { toast } = useToast();
  const createMutation = useCreateWarehouse();
  const updateMutation = useUpdateWarehouse();

  const form = useForm<InsertWarehouse>({
    resolver: zodResolver(insertWarehouseSchema),
    defaultValues: initialData || {
      code: "", name: "", address: "", manager: "",
      area: 0, capacity: 0, status: "active", notes: ""
    }
  });

  // Reset form when dialog opens/closes or initialData changes
  if (open && initialData && form.getValues().id !== initialData.id) {
    form.reset(initialData);
  }

  const onSubmit = async (data: InsertWarehouse) => {
    try {
      if (mode === "create") {
        await createMutation.mutateAsync(data);
        toast({ title: "Thành công", description: "Đã thêm mới kho hàng" });
      } else {
        if (!initialData) return;
        await updateMutation.mutateAsync({ id: initialData.id, ...data });
        toast({ title: "Thành công", description: "Đã cập nhật kho hàng" });
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast({ 
        title: "Lỗi", 
        description: "Có lỗi xảy ra, vui lòng thử lại", 
        variant: "destructive" 
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white p-0 overflow-hidden gap-0 rounded-2xl">
        <DialogHeader className="p-6 pb-2 bg-gradient-to-r from-blue-50 to-white">
          <DialogTitle className="text-xl font-display text-primary">
            {mode === "create" ? "Thêm Kho Mới" : "Cập Nhật Kho"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <Label>Mã kho</Label>
                    <FormControl>
                      <Input placeholder="WH-001" {...field} className="rounded-lg" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <Label>Tên kho</Label>
                    <FormControl>
                      <Input placeholder="Kho Trung Tâm" {...field} className="rounded-lg" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <Label>Địa chỉ</Label>
                  <FormControl>
                    <Input placeholder="123 Đường ABC..." {...field} className="rounded-lg" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <Label>Diện tích (m²)</Label>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={e => field.onChange(parseInt(e.target.value))}
                        className="rounded-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <Label>Sức chứa</Label>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value))}
                        className="rounded-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="manager"
                render={({ field }) => (
                  <FormItem>
                    <Label>Người phụ trách</Label>
                    <FormControl>
                      <Input placeholder="Nguyễn Văn A" {...field} className="rounded-lg" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <Label>Trạng thái</Label>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-lg">
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Hoạt động</SelectItem>
                        <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
                Hủy bỏ
              </Button>
              <Button type="submit" disabled={isPending} className="bg-primary hover:bg-primary/90 text-white rounded-xl shadow-md shadow-primary/20">
                {isPending ? "Đang xử lý..." : mode === "create" ? "Tạo mới" : "Lưu thay đổi"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
