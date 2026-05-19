"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/core/lib/supabase/client";
import { useTheme } from "@/core/providers/ThemeProvider";
import { AlertCircle } from "lucide-react";

import { SidebarLogo } from "./SidebarLogo";
import { SidebarRadar } from "./SidebarRadar";
import { SidebarFooter } from "./SidebarFooter";
import { SidebarNavigation } from "./SidebarNavigation";

export function Sidebar({
  slug,
  negocioNombre,
  negocioId,
}: {
  slug?: string;
  negocioNombre?: string;
  negocioId?: string | null;
}) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  if (!mounted)
    return (
      <aside className="w-72 bg-[var(--admin-surface)] border-r border-[var(--admin-border)]" />
    );

  return (
    <>
      <aside className="admin-sidebar p-6 z-40 relative">
        <SidebarLogo />
        <div className="my-8 border-t border-[var(--admin-border)]/50" />
        <SidebarRadar negocioId={negocioId} />

        <SidebarNavigation />

        <div className="mt-auto pt-6 border-t border-[var(--admin-border)]/50" />

        <SidebarFooter
          slug={slug}
          negocioNombre={negocioNombre}
          theme={theme}
          setTheme={setTheme}
          onSignOutTrigger={() => setShowLogoutConfirm(true)}
        />
      </aside>

      {/* MODAL DE DESCONEXIÓN */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-[#0f4023]/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-[var(--admin-surface)] rounded-2xl p-8 max-w-sm w-full shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative border border-[var(--admin-border)]">
            <div className="mx-auto w-14 h-14 bg-red-50 text-red-500 flex items-center justify-center mb-6 rounded-full">
              <AlertCircle size={28} />
            </div>

            <h3 className="font-bold text-xl text-[var(--admin-text)] text-center tracking-tight mb-2">
              Desconectar <span className="text-[var(--admin-accent)]">Terminal</span>
            </h3>

            <p className="text-sm font-medium text-[var(--admin-text-muted)] text-center leading-relaxed mb-8">
              ¿Confirmás la salida de <br />
              <span className="text-[var(--admin-text)] font-semibold">
                {negocioNombre || "la unidad actual"}
              </span>
              ?
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleSignOut}
                className="w-full py-3.5 bg-red-500 text-white rounded-xl font-semibold tracking-wide hover:bg-red-600 transition-colors shadow-sm"
              >
                Cerrar Terminal
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full py-3.5 border border-[var(--admin-border)] bg-transparent text-[var(--admin-text)] rounded-xl font-medium tracking-wide hover:bg-[var(--admin-bg)] transition-colors"
              >
                Cancelar y Volver
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
