"use client";

import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "./Sidebar";

interface MobileSidebarProps {
  slug: string;
  negocioNombre: string;
}

export function MobileSidebar({ slug, negocioNombre }: MobileSidebarProps) {
  const [open, setOpen] = useState(false);

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

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Abrir menú de navegación"
        aria-expanded={open}
        aria-controls="mobile-sidebar-panel"
        className="relative flex items-center justify-center p-2 bg-[var(--admin-accent)]/5 text-[var(--admin-accent)] rounded-xl hover:bg-[var(--admin-accent)]/10 transition-all duration-200 cursor-pointer outline-none active:scale-95"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
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
            className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-[var(--admin-surface)] shadow-2xl animate-in slide-in-from-left duration-300 overflow-y-auto"
          >
            <div className="relative h-full">
              <button
                onClick={close}
                aria-label="Cerrar menú"
                className="absolute top-4 right-4 p-2 rounded-xl text-[var(--admin-text-muted)] hover:bg-[var(--admin-bg)] hover:text-[var(--admin-text)] transition-colors outline-none z-10"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              <Sidebar slug={slug} negocioNombre={negocioNombre} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
