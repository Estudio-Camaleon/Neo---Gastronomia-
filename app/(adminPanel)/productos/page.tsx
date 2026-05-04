import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProductsTable } from "@/components/adminPanel/ProductsTable";
import { AddProductSection } from "@/components/adminPanel/AddProductSection";

export default async function ProductosPage() {
  const supabase = await createClient();

  // 1. Verificación de usuario (Mantiene la sesión fresca con getUser)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. Obtener el negocio (Usamos .single() para eficiencia)
  const { data: negocio, error: negocioError } = await supabase
    .from("negocios")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (negocioError || !negocio) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-xl font-black uppercase italic text-primary">
          Negocio no configurado
        </h2>
        <p className="text-text-muted text-sm mt-2">
          Por favor, completa tu perfil para gestionar productos.
        </p>
      </div>
    );
  }

  // 3. Obtener productos con Join a Categorías
  // Optimizamos la selección de campos para consumir menos ancho de banda
  const { data: productosRaw } = await supabase
    .from("productos")
    .select(
      `
      id, 
      nombre, 
      precio, 
      disponible,
      categorias (nombre)
    `,
    )
    .eq("negocio_id", negocio.id)
    .order("created_at", { ascending: false });

  // 4. Transformación de datos (Data Mapping)
  const productos = (productosRaw || []).map((p: any) => ({
    id: p.id,
    nombre: p.nombre || "Sin nombre",
    precio: Number(p.precio) || 0,
    disponible: !!p.disponible,
    categoria: p.categorias?.nombre || "General",
  }));

  return (
    <div className="p-6 md:p-10 mx-auto min-h-screen pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-text-primary uppercase tracking-tighter italic">
            Mis Productos
          </h1>
          <p className="text-text-muted text-sm font-bold uppercase tracking-widest mt-1">
            Control de inventario y carta digital
          </p>
        </div>

        {/* Sección de acción con ID del negocio verificado */}
        <AddProductSection negocioId={negocio.id} />
      </header>

      {/* Tabla de productos con estado inicial hidratado desde el servidor */}
      <section className="bg-white dark:bg-bg-darker rounded-super border-2 border-border dark:border-border-dark overflow-hidden shadow-sm">
        <ProductsTable initialProducts={productos} />
      </section>
    </div>
  );
}
