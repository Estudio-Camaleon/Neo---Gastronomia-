"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { TransitionLink } from "@/components/ui/transition-link";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Users,
  Settings,
  X,
  Menu,
} from "lucide-react";

interface MobileSidebarProps {
  slug: string;
  negocioNombre: string;
}

const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Pedidos", href: "/pedidos", icon: ClipboardList },
  { name: "Productos", href: "/productos", icon: Package },
  { name: "Clientes", href: "/clientes", icon: Users },
  { name: "Ajustes", href: "/configuracion", icon: Settings },
];

export function MobileSidebar({ slug, negocioNombre }: MobileSidebarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [close]);

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Abrir menú de navegación"
        aria-expanded={open}
        aria-controls="mobile-sidebar-panel"
        className="touch-target flex items-center justify-center p-3 bg-[var(--admin-accent)]/5 text-[var(--admin-accent)] rounded-xl hover:bg-[var(--admin-accent)]/10 transition-all duration-200 cursor-pointer outline-none active:scale-95"
      >
        <Menu size={22} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div
            className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={close}
            aria-hidden="true"
          />

          <div
            id="mobile-sidebar-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
            className="fixed inset-y-0 left-0 w-full max-w-[300px] sm:max-w-[320px] bg-[var(--admin-surface)] shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col safe-bottom"
          >
            {/* Header del drawer */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--admin-border)] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[var(--admin-accent)] flex items-center justify-center text-white font-bold text-xs shadow-sm">
                  N
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[var(--admin-text)] leading-tight">
                    NEO Admin
                  </span>
                  <span className="text-[10px] font-semibold text-[var(--admin-text-muted)] truncate max-w-[180px]">
                    {negocioNombre || "Panel de control"}
                  </span>
                </div>
              </div>
              <button
                onClick={close}
                aria-label="Cerrar menú"
                className="touch-target flex items-center justify-center p-2 rounded-xl text-[var(--admin-text-muted)] hover:bg-[var(--admin-bg)] hover:text-[var(--admin-text)] transition-colors outline-none"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navegación */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              {NAV_ITEMS.map((link) => {
                const active = isActive(link.href);
                const Icon = link.icon;
                return (
                  <TransitionLink
                    key={link.name}
                    href={link.href}
                    onClick={close}
                    className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 font-semibold text-sm active:scale-[0.97] touch-target ${
                      active
                        ? "bg-[var(--admin-accent)] text-white shadow-sm"
                        : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-accent)]/5 hover:text-[var(--admin-text)]"
                    }`}
                  >
                    <Icon
                      size={20}
                      strokeWidth={active ? 2.5 : 2}
                      className="shrink-0"
                    />
                    <span>{link.name}</span>
                  </TransitionLink>
                );
              })}
            </nav>

            {/* Footer del drawer */}
            <div className="border-t border-[var(--admin-border)] px-4 py-3 shrink-0">
              <a
                href={`/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-1 py-2 text-sm font-medium text-[var(--admin-text-muted)] hover:text-[var(--admin-accent)] transition-colors"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                <span className="truncate">neo.app/{slug}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
