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
    <nav className="flex-1 mt-8 space-y-2 overflow-y-auto custom-scrollbar px-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-[var(--admin-text-muted)] ml-2 mb-4 block opacity-70">
        Menú Principal
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
              flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group relative
              ${
                isActive
                  ? "bg-[var(--admin-accent)] text-white shadow-md shadow-[var(--admin-accent)]/30"
                  : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-surface-accent)]/50 hover:text-[var(--admin-text)]"
              }
            `}
          >
            <Icon
              size={20}
              strokeWidth={isActive ? 2.5 : 2}
              className={
                isActive
                  ? "text-white"
                  : "text-[var(--admin-accent)] opacity-70 group-hover:opacity-100 transition-opacity"
              }
            />
            <span className="text-sm font-medium tracking-wide">
              {link.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
