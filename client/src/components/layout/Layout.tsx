import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { type ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-secondary/30 font-sans text-foreground">
      <Sidebar />
      <Header />
      <main className="lg:pl-72 pt-4 lg:pt-0">
        <div className="p-4 lg:p-8 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
