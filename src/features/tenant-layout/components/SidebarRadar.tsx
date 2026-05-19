"use client";
import { Activity } from "lucide-react";

export function SidebarRadar({ negocioId }: { negocioId?: string | null }) {
  return (
    <div className="bg-[var(--admin-surface-accent)]/20 border border-[var(--admin-border)]/30 rounded-xl p-4 shadow-sm relative overflow-hidden">
      <div className="flex items-center gap-3 relative z-10">
        <div className="relative flex items-center justify-center p-1.5 bg-white rounded-lg shadow-sm">
          <Activity size={16} className="text-[var(--admin-accent)]" />
          <div className="absolute inset-0 bg-[var(--admin-accent)] opacity-20 blur-md animate-pulse rounded-lg" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold tracking-wide text-[var(--admin-text)]">
            Radar de Enlace
          </span>
          <span className="text-[10px] font-medium text-[var(--admin-accent)] animate-pulse">
            Sincronizando...
          </span>
        </div>
      </div>
      {/* Detalle decorativo de datos */}
      <div className="mt-3 flex gap-1 opacity-20">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="w-0.5 h-3 bg-[var(--admin-accent)] rounded-full"
            style={{ height: `${Math.random() * 12 + 4}px` }}
          />
        ))}
      </div>
    </div>
  );
}
