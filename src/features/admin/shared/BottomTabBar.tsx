"use client";

import { usePathname } from "next/navigation";
import { TransitionLink } from "@/components/ui/transition-link";
import { useOrderNotifications } from "@/features/admin/orders/OrderNotificationProvider";
import {
  LayoutDashboard,
  ClipboardList,
  Package,
  Users,
  Percent,
} from "lucide-react";

const TAB_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Pedidos", href: "/pedidos", icon: ClipboardList },
  { name: "Productos", href: "/productos", icon: Package },
  { name: "Promos", href: "/promos", icon: Percent },
  { name: "Clientes", href: "/clientes", icon: Users },
];

export function BottomTabBar() {
  const pathname = usePathname();
  const { unreadCount } = useOrderNotifications();

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[var(--admin-surface)]/90 backdrop-blur-xl border-t border-[var(--admin-border)] safe-bottom">
      <div className="flex items-center justify-around px-2 py-1">
        {TAB_ITEMS.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <TransitionLink
              key={item.name}
              href={item.href}
              className={`relative flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all duration-200 active:scale-95 touch-target min-w-0 ${
                active
                  ? "text-[var(--admin-accent)]"
                  : "text-[var(--admin-text-muted)] hover:text-[var(--admin-text)]"
              }`}
            >
              <div className="relative">
                <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                {item.name === "Pedidos" && unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[8px] font-bold px-1 rounded-full min-w-[14px] text-center leading-tight">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] font-bold leading-tight ${
                  active
                    ? "text-[var(--admin-accent)]"
                    : "text-[var(--admin-text-muted)]"
                }`}
              >
                {item.name}
              </span>
            </TransitionLink>
          );
        })}
      </div>
    </nav>
  );
}
