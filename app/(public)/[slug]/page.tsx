import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { MenuContent } from "@/components/menu/MenuContent";

/**
 * Página Principal del Menú Público - Versión Estable.
 * Solo solicita columnas confirmadas para evitar errores de base de datos.
 */
export default async function PublicMenuPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  // 1. Obtención de datos del negocio
  // Hemos omitido 'descripcion' y 'banner_url' para asegurar la compatibilidad con tu esquema actual.
  const { data: negocio, error: negocioError } = await supabase
    .from("negocios")
    .select("id, nombre, logo_url, slug")
    .eq("slug", slug)
    .single();

  // Si hay error en la consulta o el negocio no existe, disparamos el 404 de Next.js
  if (negocioError || !negocio) {
    console.error(
      "DEBUG NEO -> Error al cargar negocio:",
      negocioError?.message,
    );
    return notFound();
  }

  // 2. Carga de categorías y productos vinculados
  const { data: categorias } = await supabase
    .from("categorias")
    .select(
      `
      id,
      nombre,
      productos (
        id,
        nombre,
        descripcion,
        precio,
        imagen_url,
        disponible
      )
    `,
    )
    .eq("negocio_id", negocio.id)
    .order("nombre", { ascending: true });

  // 3. Procesamiento de datos para el Menú
  // Filtramos productos no disponibles y categorías que queden vacías tras el filtro.
  const menuData =
    categorias
      ?.map((cat) => ({
        ...cat,
        productos: cat.productos.filter((p: any) => p.disponible),
      }))
      .filter((cat) => cat.productos.length > 0) || [];

  return (
    <div className="min-h-screen bg-bg-main dark:bg-bg-dark selection:bg-primary">
      {/* Header Neo-Brutalista Minimalista */}
      <header className="relative h-48 md:h-64 bg-black flex flex-col items-center justify-center overflow-hidden border-b-4 border-primary">
        {/* Fondo con gradiente estético ante la falta de banner_url */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-black to-black opacity-60" />

        <div className="relative z-10 text-center px-4 flex flex-col items-center">
          {negocio.logo_url && (
            <div className="mb-4">
              <img
                src={negocio.logo_url}
                alt="Logo Negocio"
                className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white bg-white shadow-2xl object-contain animate-in zoom-in duration-500"
              />
            </div>
          )}

          <h1 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter drop-shadow-xl">
            {negocio.nombre}
          </h1>

          <div className="mt-3 flex items-center gap-2">
            <span className="h-[2px] w-8 bg-primary rounded-full" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] italic">
              Menu Digital
            </span>
            <span className="h-[2px] w-8 bg-primary rounded-full" />
          </div>
        </div>
      </header>

      {/* Contenido Principal: Listado de Productos y Carrito */}
      <main className="max-w-5xl mx-auto px-4 py-12">
        <MenuContent negocioId={negocio.id} categorias={menuData} />
      </main>

      {/* Footer con Identidad NEO */}
      <footer className="py-20 border-t border-border/30 flex flex-col items-center justify-center opacity-30 select-none">
        <p className="text-[9px] font-black uppercase tracking-[0.5em] mb-2 text-text-muted">
          Plataforma de gestión
        </p>
        <h2 className="text-4xl font-black italic tracking-tighter text-text-primary">
          NEO
        </h2>
      </footer>

      {/* Capa de textura sutil para el acabado visual */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-[100] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}
