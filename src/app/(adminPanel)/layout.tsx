/**
 * NEO SYSTEM v3.0 - Admin Panel Maestro Layout
 * Server Component de misión crítica. Controla accesos, sesiones y contingencias Multi-tenant.
 */
import { Sidebar } from "@/features/tenant-layout/components/Sidebar";
import { ErrorModal } from "@/components/ui/errorModal";
import { ThemeProvider } from "@/core/providers/ThemeProvider";
import { createClient } from "@/core/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Menu } from "lucide-react";
import "./style/admin-panel.css";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // 1. Candado de Frontera: Verificación única de sesión en servidor
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    redirect("/login");
  }

  // 2. Obtención de Contexto Multi-tenant
  const { data: negocio, error: businessError } = await supabase
    .from("negocios")
    .select("slug, nombre")
    .eq("user_id", user.id)
    .single();

  // 3. Contingencia: Si no tiene local asignado, bloquea la terminal e induce registro
  if (businessError || !negocio) {
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[99999] flex items-center justify-center p-4 font-sans">
        <ErrorModal
          title="Terminal Incompleta"
          message="Necesitás inicializar la infraestructura operativa de tu local antes de acceder a las herramientas de control maestro."
          action={
            <Link
              href="/configuracion"
              className="block w-full py-4 bg-[var(--admin-accent)] text-white font-bold rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all text-center"
            >
              Inicializar Mi Negocio
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="flex min-h-screen bg-[var(--admin-bg)] text-[var(--admin-text)] font-sans antialiased relative overflow-hidden transition-colors duration-300">
        {/* ELEMENTOS GEOMÉTRICOS DECORATIVOS DE FONDO */}
        <div className="fixed top-[-10%] left-[-5%] w-96 h-96 bg-[var(--admin-border)] rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-pulse" />
        <div className="fixed top-[20%] right-[-10%] w-[500px] h-[500px] bg-[var(--admin-accent)] rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] opacity-20" />
        <div className="fixed bottom-[-10%] left-[20%] w-[400px] h-[400px] bg-[var(--admin-surface-accent)] rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-10" />

        {/* SIDEBAR DESKTOP */}
        <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 z-20">
          <Sidebar slug={negocio.slug} negocioNombre={negocio.nombre} />
        </aside>

        {/* CONTENEDOR DE TRABAJO PRINCIPAL */}
        <div className="flex-1 flex flex-col lg:pl-72 z-10">
          {/* HEADER EXCLUSIVO PARA DISPOSITIVOS MÓVILES */}
          <header className="flex lg:hidden items-center justify-between p-4 border-b border-[var(--admin-border)] bg-[var(--admin-surface)] backdrop-blur-md sticky top-0 z-30 shadow-sm transition-colors duration-300">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[var(--admin-accent)] rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                N
              </div>
              <span className="font-bold text-lg text-[var(--admin-text)] tracking-tight">
                NEO <span className="text-[var(--admin-text-muted)] font-normal">Admin</span>
              </span>
            </div>
            <button className="p-2 bg-[var(--admin-surface-accent)] text-[var(--admin-accent)] rounded-lg hover:bg-[var(--admin-border)] transition-colors">
              <Menu size={24} />
            </button>
          </header>

          {/* ÁREA DE TRABAJO NETO EN RENDER CONTROLADO */}
          <main className="flex-1 p-4 md:p-6 lg:p-10 w-full max-w-7xl mx-auto animate-in fade-in duration-500 relative">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
