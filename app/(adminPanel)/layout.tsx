import { Sidebar } from "@/components/adminPanel/layout/Sidebar";
import { ErrorModal } from "@/components/adminPanel/configuracion/ui/ErrorModal";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // 1. Control perimetral de sesión activa antes de interrogar a la base de datos
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 2. Deshidratación del contexto comercial del inquilino
  const { data: negocio, error } = await supabase
    .from("negocios")
    .select("slug, nombre")
    .eq("user_id", user.id)
    .single();

  if (error || !negocio) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
        <ErrorModal
          title="Configuración Requerida"
          message="Tu cuenta está activa, pero no detectamos ningún negocio vinculado. Necesitás configurar tu local para acceder a las herramientas de gestión."
          action={
            <Link
              // CAMBIO CLAVE: Apuntamos a una ruta que SÍ existe en tu proyecto
              href="/configuracion" 
              className="block w-full py-4 bg-primary text-black font-black uppercase tracking-widest italic rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all text-center"
            >
              Configurar mi negocio
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="flex min-h-screen bg-bg-main dark:bg-bg-dark text-text-primary dark:text-text-inverse transition-colors duration-300">
        {/* CORREGIDO: Sidebar limpio libre de props de estadísticas estáticas muertas */}
        <Sidebar slug={negocio.slug} negocioNombre={negocio.nombre} />

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </ThemeProvider>
  );
}
