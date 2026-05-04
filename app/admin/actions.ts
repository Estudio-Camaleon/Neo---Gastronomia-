"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * ACCIONES DE PRODUCTOS
 */

// Crear un nuevo producto
export async function crearProducto(data: any, negocioId: string) {
  const supabase = await createClient();

  // Validamos sesión para evitar escrituras anónimas
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) return { success: false, error: "No autorizado" };

  const { error } = await supabase.from("productos").insert([
    {
      nombre: data.nombre,
      precio: parseFloat(data.precio),
      descripcion: data.descripcion,
      categoria_id: data.categoriaId,
      negocio_id: negocioId,
      disponible: true,
    },
  ]);

  if (error) {
    console.error("Error al crear producto:", error.message);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/productos");
  return { success: true };
}

// Actualizar disponibilidad (Optimistic Update support)
export async function updateProductAvailability(
  id: string,
  disponible: boolean,
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("productos")
    .update({ disponible })
    .eq("id", id);

  if (error) {
    console.error("Error al actualizar disponibilidad:", error.message);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/productos");
  return { success: true };
}

// Eliminar producto
export async function eliminarProducto(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("productos").delete().eq("id", id);

  if (error) {
    console.error("Error al eliminar producto:", error.message);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/productos");
  return { success: true };
}

/**
 * ACCIONES DE NEGOCIO / CONFIGURACIÓN
 */

// Actualizar datos del negocio (ConfigForm)
export async function updateNegocioConfig(negocioId: string, data: any) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("negocios")
    .update({
      nombre: data.nombre,
      slug: data.slug,
      telefono_whatsapp: data.telefono,
      direccion: data.direccion,
      configuracion: data.configuracion, // JSON con colores, horarios, etc.
    })
    .eq("id", negocioId);

  if (error) {
    console.error("Error al actualizar negocio:", error.message);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/configuracion");
  return { success: true };
}
