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
      <aside className="w-72 bg-[var(--admin-surface)] border-r-2 border-[var(--admin-border)]" />
    );

  return (
    <>
      <aside className="admin-sidebar p-6 z-40">
        <SidebarLogo />
        <div className="my-8 border-t border-[var(--admin-border)]" />
        <SidebarRadar negocioId={negocioId} />

        <SidebarNavigation />

        <div className="mt-auto pt-6 border-t border-[var(--admin-border)]" />

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
        <div className="fixed inset-0 bg-[#0f4023]/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-[var(--admin-bg)] border-2 border-[var(--admin-border)] p-8 max-w-sm w-full shadow-[8px_8px_0px_0px_var(--admin-border)] relative">
            <div className="mx-auto w-14 h-14 bg-[var(--admin-danger)]/10 text-[var(--admin-danger)] flex items-center justify-center mb-6 border-2 border-[var(--admin-danger)] rounded-full">
              <AlertCircle size={28} strokeWidth={2.5} />
            </div>

            <h3 className="font-black text-xl text-[var(--admin-text)] text-center uppercase italic tracking-tighter mb-2">
              Desconectar{" "}
              <span className="text-[var(--admin-accent)]">Terminal</span>
            </h3>

            <p className="text-[10px] font-bold text-[var(--admin-text-muted)] text-center uppercase tracking-widest leading-tight mb-8 opacity-70">
              ¿Confirmás la salida de <br />
              <span className="text-[var(--admin-text)] font-black">
                {negocioNombre || "la unidad actual"}
              </span>
              ?
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleSignOut}
                className="w-full py-4 bg-[var(--admin-border)] text-[var(--admin-bg)] font-black uppercase italic text-xs tracking-[0.2em] hover:bg-[var(--admin-accent)] transition-all shadow-[4px_4px_0px_0px_var(--admin-accent)]/20"
              >
                Cerrar Terminal
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full py-4 border-2 border-[var(--admin-border)] text-[var(--admin-text)] font-black uppercase italic text-[10px] tracking-[0.2em] hover:bg-[var(--admin-surface-accent)] transition-all"
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
