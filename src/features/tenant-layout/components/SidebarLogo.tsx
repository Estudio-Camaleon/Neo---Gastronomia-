"use client";
import { Zap } from "lucide-react";

export function SidebarLogo() {
  return (
    <div className="flex items-center gap-3 group px-2">
      <div className="relative">
        <div className="w-10 h-10 bg-[var(--admin-accent)] rounded-xl shadow-lg flex items-center justify-center transition-transform group-hover:scale-105">
          <Zap size={20} className="text-white fill-current" />
        </div>
        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-xl tracking-tight leading-none text-[var(--admin-text)]">
          NEO <span className="text-[var(--admin-accent)] font-medium">System</span>
        </span>
        <span className="text-[10px] font-medium tracking-wider text-[var(--admin-text-muted)] mt-1">
          Admin Dashboard
        </span>
      </div>
    </div>
  );
}
