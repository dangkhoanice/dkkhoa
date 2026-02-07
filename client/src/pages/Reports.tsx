import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { FileChartColumn, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Reports() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold font-display text-foreground">Báo cáo & Thống kê</h1>
            <p className="text-muted-foreground mt-1">Xuất các báo cáo hoạt động định kỳ</p>
          </div>
          <Button variant="outline" className="gap-2 rounded-xl">
            <Download className="w-4 h-4" /> Xuất Excel
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-none shadow-lg shadow-black/5 hover:shadow-xl transition-all">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-primary">
                  <FileChartColumn className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Báo cáo tồn kho tháng {i}</h3>
                  <p className="text-sm text-muted-foreground mt-1">Cập nhật: 12/05/2024</p>
                </div>
                <Button className="w-full bg-secondary/50 hover:bg-secondary text-foreground rounded-xl">
                  Xem chi tiết
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-3xl border border-dashed border-border">
          <FileChartColumn className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-xl font-semibold text-muted-foreground">Tính năng báo cáo nâng cao đang được phát triển</h3>
          <p className="text-muted-foreground/60 mt-2">Vui lòng quay lại sau</p>
        </div>
      </div>
    </Layout>
  );
}
