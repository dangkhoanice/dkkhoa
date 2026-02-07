import { Layout } from "@/components/layout/Layout";
import { useStats } from "@/hooks/use-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Warehouse, Container, Activity, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";

function StatCard({ title, value, icon: Icon, color, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className="border-none shadow-lg shadow-black/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden relative">
        <div className={`absolute top-0 right-0 p-4 opacity-10`}>
          <Icon className="w-24 h-24" />
        </div>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground mt-1">
            +2.5% so với tháng trước
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

const data = [
  { name: 'T1', warehouse: 4000, yard: 2400 },
  { name: 'T2', warehouse: 3000, yard: 1398 },
  { name: 'T3', warehouse: 2000, yard: 9800 },
  { name: 'T4', warehouse: 2780, yard: 3908 },
  { name: 'T5', warehouse: 1890, yard: 4800 },
  { name: 'T6', warehouse: 2390, yard: 3800 },
  { name: 'T7', warehouse: 3490, yard: 4300 },
];

export default function Dashboard() {
  const { data: stats, isLoading } = useStats();

  if (isLoading) {
    return (
      <Layout>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground font-display">Tổng quan</h2>
            <p className="text-muted-foreground">Chào mừng trở lại! Đây là tình hình hoạt động hôm nay.</p>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-right text-muted-foreground">Cập nhật lần cuối: Hôm nay, 09:41 AM</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Tổng số kho"
            value={stats?.totalWarehouses || 0}
            icon={Warehouse}
            color="bg-blue-500"
            delay={0}
          />
          <StatCard
            title="Tổng số bãi"
            value={stats?.totalYards || 0}
            icon={Container}
            color="bg-emerald-500"
            delay={0.1}
          />
          <StatCard
            title="Kho đang hoạt động"
            value={stats?.activeWarehouses || 0}
            icon={Activity}
            color="bg-indigo-500"
            delay={0.2}
          />
          <StatCard
            title="Cảnh báo sức chứa"
            value="2"
            icon={AlertCircle}
            color="bg-rose-500"
            delay={0.3}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="col-span-4"
          >
            <Card className="h-full border-none shadow-lg shadow-black/5">
              <CardHeader>
                <CardTitle>Hiệu suất sử dụng</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient id="colorWarehouse" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#135bec" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#135bec" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="warehouse" 
                        stroke="#135bec" 
                        fillOpacity={1} 
                        fill="url(#colorWarehouse)" 
                        strokeWidth={3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="col-span-3"
          >
            <Card className="h-full border-none shadow-lg shadow-black/5">
              <CardHeader>
                <CardTitle>Phân bổ tải trọng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <Tooltip cursor={{fill: '#F3F4F6'}} />
                      <Bar dataKey="yard" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
