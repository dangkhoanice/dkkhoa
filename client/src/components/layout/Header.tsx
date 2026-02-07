import { Bell, Search, UserCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="h-16 lg:h-20 bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-40 px-6 flex items-center justify-between lg:pl-80 lg:pr-8">
      <div className="flex-1 max-w-md hidden md:block relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Tìm kiếm kho, bãi, đơn hàng..." 
          className="pl-10 bg-secondary/50 border-transparent focus:bg-white focus:border-primary transition-all rounded-xl"
        />
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </Button>
        <div className="h-8 w-[1px] bg-border mx-2" />
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-foreground">Nguyễn Văn A</p>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-blue-400 p-[2px] cursor-pointer hover:shadow-lg transition-shadow">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <UserCircle className="w-9 h-9 text-gray-300" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
