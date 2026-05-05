import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Package } from "lucide-react";
import { AddProductSection } from "@/components/adminPanel/productos/AddProductSection"; // Importación de la sección unificada

/**
 * Panel de Gestión de Inventario NEO.
 * Punto de entrada del Server Component encargado únicamente del control de accesos y contexto de negocio.
 */
export default async function ProductosAdminPage() {
  const supabase = await createClient();

  // 1. Verificación estricta de sesión activa
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. Obtención del contexto comercial del usuario (Inquilino)
  const { data: negocio } = await supabase
    .from("negocios")
    .select("id, nombre")
    .eq("user_id", user.id)
    .single();

  if (!negocio) redirect("/configuracion");

  return (
    <div className="p-6 md:p-10 space-y-10 min-h-screen pb-32 max-w-7xl mx-auto font-sans">
      {/* Encabezado Semántico de la Sección */}
      <header className="animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-2 mb-2">
          <Package className="text-primary w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">
            Inventory & Catalog System
          </span>
        </div>
        <h1 className="text-5xl font-black text-text-primary dark:text-text-inverse uppercase tracking-tighter italic leading-none">
          Menú & Stock
        </h1>
        <p className="text-text-muted text-xs font-bold uppercase tracking-widest mt-2">
          Administrando el catálogo de{" "}
          <span className="text-primary">{negocio.nombre}</span>
        </p>
      </header>

      {/* Orquestador Raíz del Módulo de Inventario */}
      {/* Absorbe de forma asincrónica y Realtime las tablas, modales y formularios */}
      <section className="animate-in fade-in duration-500 delay-150">
        <AddProductSection negocioId={negocio.id} />
      </section>

      {/* Footer Técnico */}
      <footer className="pt-12 border-t border-dashed border-border dark:border-border-dark opacity-30 flex justify-between items-center">
        <p className="text-[9px] font-black uppercase tracking-widest italic text-text-primary dark:text-text-inverse">
          NEO Catalog Engine v1.3
        </p>
        <div className="flex gap-4 items-center">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[9px] font-bold uppercase tracking-widest text-text-primary dark:text-text-inverse font-mono">
            Database Linked
          </span>
        </div>
      </footer>
    </div>
  );
}
