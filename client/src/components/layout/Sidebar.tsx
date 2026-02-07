import { Link, useLocation } from "wouter";
import { LayoutDashboard, Warehouse, Container, FileChartColumn, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [location] = useLocation();

  const links = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/warehouses", label: "Kho hàng", icon: Warehouse },
    { href: "/yards", label: "Bãi chứa", icon: Container },
    { href: "/reports", label: "Báo cáo", icon: FileChartColumn },
    { href: "/settings", label: "Cài đặt", icon: Settings },
  ];

  return (
    <div className="hidden lg:flex flex-col w-72 bg-white h-screen border-r border-border fixed left-0 top-0 z-50">
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30">
            L
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-foreground">LogiTrack</h1>
            <p className="text-xs text-muted-foreground font-medium">Logistics Management</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        <div className="px-4 mb-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Menu Chính</p>
        </div>
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            <div className={cn(
              "sidebar-link cursor-pointer",
              location === link.href ? "active" : ""
            )}>
              <link.icon className="w-5 h-5" />
              <span>{link.label}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="p-4 border-t border-border/50">
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}
