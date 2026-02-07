import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useYards, useCreateYard, useUpdateYard, useDeleteYard } from "@/hooks/use-yards";
import { useWarehouses } from "@/hooks/use-warehouses";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Search, Container, Map } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type InsertYard, type Yard } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertYardSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Yards() {
  const { data: yards, isLoading } = useYards();
  const { data: warehouses } = useWarehouses();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingYard, setEditingYard] = useState<Yard | null>(null);

  const deleteMutation = useDeleteYard();
  const { toast } = useToast();

  const filteredYards = yards?.filter(y => 
    y.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    y.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa bãi này?")) {
      try {
        await deleteMutation.mutateAsync(id);
        toast({ title: "Thành công", description: "Đã xóa bãi" });
      } catch (error) {
        toast({ title: "Lỗi", description: "Không thể xóa bãi", variant: "destructive" });
      }
    }
  };

  const getWarehouseName = (id: number | null) => {
    return warehouses?.find(w => w.id === id)?.name || "N/A";
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display text-foreground">Quản lý Bãi chứa</h1>
            <p className="text-muted-foreground mt-1">Danh sách các bãi chứa container</p>
          </div>
          <Button 
            onClick={() => setIsCreateOpen(true)}
            className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 rounded-xl px-6"
          >
            <Plus className="w-5 h-5 mr-2" />
            Thêm bãi mới
          </Button>
        </div>

        <Card className="border-none shadow-lg shadow-black/5 overflow-hidden">
          <div className="p-4 border-b border-border/50 bg-white flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Tìm kiếm bãi..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-secondary/50 border-transparent focus:bg-white focus:border-primary transition-all rounded-lg"
              />
            </div>
            <div className="flex items-center gap-2 ml-auto text-sm text-muted-foreground">
              <Container className="w-4 h-4" />
              <span>{filteredYards?.length || 0} Bãi</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary/30">
                <TableRow>
                  <TableHead className="w-[100px]">Mã bãi</TableHead>
                  <TableHead>Tên bãi</TableHead>
                  <TableHead>Thuộc kho</TableHead>
                  <TableHead>Diện tích (m²)</TableHead>
                  <TableHead>Loại</TableHead>
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
                ) : filteredYards?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-32 text-muted-foreground">
                      Không tìm thấy bãi nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredYards?.map((yard) => (
                    <TableRow key={yard.id} className="group hover:bg-blue-50/50 transition-colors">
                      <TableCell className="font-medium font-mono text-primary">{yard.code}</TableCell>
                      <TableCell className="font-semibold">{yard.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Map className="w-3 h-3" />
                          {getWarehouseName(yard.warehouseId)}
                        </div>
                      </TableCell>
                      <TableCell>{yard.area.toLocaleString()}</TableCell>
                      <TableCell>{yard.type}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          yard.status === "active" 
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                            : "bg-gray-100 text-gray-500 border-gray-200"
                        }>
                          {yard.status === "active" ? "Hoạt động" : "Dừng"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => setEditingYard(yard)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(yard.id)}
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

        <YardFormDialog 
          open={isCreateOpen} 
          onOpenChange={setIsCreateOpen} 
          mode="create"
        />
        
        <YardFormDialog 
          open={!!editingYard} 
          onOpenChange={(open) => !open && setEditingYard(null)} 
          mode="edit"
          initialData={editingYard || undefined}
        />
      </div>
    </Layout>
  );
}

function YardFormDialog({ 
  open, 
  onOpenChange, 
  mode, 
  initialData 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  mode: "create" | "edit";
  initialData?: Yard;
}) {
  const { toast } = useToast();
  const createMutation = useCreateYard();
  const updateMutation = useUpdateYard();
  const { data: warehouses } = useWarehouses();

  const form = useForm<InsertYard>({
    resolver: zodResolver(insertYardSchema),
    defaultValues: initialData || {
      code: "", name: "", warehouseId: null,
      area: 0, type: "container", status: "active", notes: ""
    }
  });

  if (open && initialData && form.getValues().id !== initialData.id) {
    form.reset(initialData);
  }

  const onSubmit = async (data: InsertYard) => {
    try {
      if (mode === "create") {
        await createMutation.mutateAsync(data);
        toast({ title: "Thành công", description: "Đã thêm mới bãi" });
      } else {
        if (!initialData) return;
        await updateMutation.mutateAsync({ id: initialData.id, ...data });
        toast({ title: "Thành công", description: "Đã cập nhật bãi" });
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
            {mode === "create" ? "Thêm Bãi Mới" : "Cập Nhật Bãi"}
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
                    <Label>Mã bãi</Label>
                    <FormControl>
                      <Input placeholder="Y-001" {...field} className="rounded-lg" />
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
                    <Label>Tên bãi</Label>
                    <FormControl>
                      <Input placeholder="Bãi A1" {...field} className="rounded-lg" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="warehouseId"
              render={({ field }) => (
                <FormItem>
                  <Label>Thuộc kho</Label>
                  <Select 
                    onValueChange={(val) => field.onChange(parseInt(val))} 
                    value={field.value ? String(field.value) : undefined}
                  >
                    <FormControl>
                      <SelectTrigger className="rounded-lg">
                        <SelectValue placeholder="Chọn kho" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {warehouses?.map(w => (
                        <SelectItem key={w.id} value={String(w.id)}>{w.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <Label>Loại bãi</Label>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-lg">
                          <SelectValue placeholder="Chọn loại" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="container">Container</SelectItem>
                        <SelectItem value="bulk">Hàng rời</SelectItem>
                        <SelectItem value="liquid">Chất lỏng</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
