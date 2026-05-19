"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Users,
  Settings,
} from "lucide-react";

const LINKS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Pedidos", href: "/pedidos", icon: ClipboardList },
  { name: "Productos", href: "/productos", icon: Package },
  { name: "Clientes", href: "/clientes", icon: Users },
  { name: "Ajustes", href: "/configuracion", icon: Settings },
];

export function SidebarNavigation() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 mt-8 space-y-2 overflow-y-auto custom-scrollbar">
      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--admin-text-muted)] ml-2 mb-4 block opacity-50">
        Main Terminal
      </span>
      {LINKS.map((link) => {
        const isActive =
          pathname === link.href ||
          (link.href !== "/dashboard" && pathname.startsWith(link.href));
        const Icon = link.icon;

        return (
          <Link
            key={link.name}
            href={link.href}
            className={`
              flex items-center gap-4 px-4 py-3 border-2 transition-all duration-200 group relative
              ${
                isActive
                  ? "bg-[var(--admin-accent)] text-white shadow-md"
                  : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-border)]/20 hover:text-[var(--admin-text)]"
              }
            `}
          >
            <Icon
              size={18}
              strokeWidth={isActive ? 3 : 2}
              className={
                isActive
                  ? "text-[var(--admin-bg)]"
                  : "text-[var(--admin-accent)] opacity-60 group-hover:opacity-100"
              }
            />
            <span className="text-xs font-black uppercase tracking-widest italic">
              {link.name}
            </span>
            {isActive && (
              <div className="absolute right-2 w-1.5 h-1.5 bg-[var(--admin-bg)] rounded-full animate-pulse" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
