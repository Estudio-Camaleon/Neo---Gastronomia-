"use client";

import { Sun, Moon, ExternalLink, LogOut } from "lucide-react";

interface SidebarFooterProps {
  slug?: string;
  negocioNombre?: string;
  theme: string;
  setTheme: (theme: string) => void;
  onSignOutTrigger: () => void;
}

export function SidebarFooter({
  slug,
  negocioNombre,
  theme,
  setTheme,
  onSignOutTrigger,
}: SidebarFooterProps) {
  return (
    <div className="space-y-4">
      {/* SWITCHER DE TEMA */}
      <div className="flex bg-[var(--admin-bg)] rounded-xl p-1 shadow-inner border border-[var(--admin-border)]/50">
        <button
          onClick={() => setTheme("light")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
            theme === "light"
              ? "bg-[var(--admin-surface)] text-[var(--admin-text)] shadow-sm"
              : "text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-surface)]/50"
          }`}
        >
          <Sun size={14} /> Claro
        </button>
        <button
          onClick={() => setTheme("dark")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
            theme === "dark"
              ? "bg-[var(--admin-surface)] text-[var(--admin-text)] shadow-sm"
              : "text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-surface)]/50"
          }`}
        >
          <Moon size={14} /> Oscuro
        </button>
      </div>

      {/* MODULO DE ACCESO RÁPIDO */}
      {slug && (
        <div className="bg-[var(--admin-surface-accent)]/20 rounded-xl p-3 group transition-all border border-[var(--admin-border)]/30">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--admin-accent)]">
              Tu Tienda
            </span>
            <ExternalLink
              size={12}
              className="text-[var(--admin-accent)] opacity-50 group-hover:opacity-100 transition-all"
            />
          </div>
          <a
            href={`/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-[var(--admin-text)] truncate block hover:text-[var(--admin-accent)] transition-colors"
          >
            neo.app/{slug}
          </a>
        </div>
      )}

      {/* IDENTIDAD DE SESIÓN */}
      <button
        type="button"
        onClick={onSignOutTrigger}
        className="w-full flex items-center gap-3 p-3 rounded-xl group transition-all hover:bg-red-50 border border-transparent hover:border-red-100"
      >
        <div className="p-2 rounded-lg bg-[var(--admin-surface-accent)]/50 text-[var(--admin-text-muted)] group-hover:bg-red-100 group-hover:text-red-500 transition-colors">
          <LogOut size={16} />
        </div>
        <div className="flex flex-col items-start overflow-hidden">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--admin-text-muted)] group-hover:text-red-500 transition-colors">
            Cerrar Sesión
          </span>
          <span className="text-xs font-medium text-[var(--admin-text)] truncate w-full text-left opacity-70">
            {negocioNombre || "Administrador"}
          </span>
        </div>
      </button>
    </div>
  );
}
