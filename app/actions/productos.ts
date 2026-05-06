"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Interfaz estricta para tipar los datos entrantes del formulario de productos
interface ProductoInput {
  nombre: string;
  descripcion?: string | null;
  precio: string | number; // Soportamos string si viene directo del input de texto
  imagen_url?: string | null;
  categoria_id?: string | null;
  disponible: boolean;
}

interface ActionResponse {
  success: boolean;
  error?: string;
}

/**
 * Server Action unificada para crear o actualizar un producto en el inventario.
 */
export async function guardarProducto(
  negocioId: string,
  data: ProductoInput,
  productoId?: string,
): Promise<ActionResponse> {
  const supabase = await createClient();

  // Construimos el objeto payload con tipado estricto e inferido
  const payload = {
    negocio_id: negocioId,
    nombre: data.nombre,
    descripcion: data.descripcion || null,
    precio:
      typeof data.precio === "string" ? parseFloat(data.precio) : data.precio,
    imagen_url: data.imagen_url || null,
    categoria_id: data.categoria_id || null,
    disponible: data.disponible,
  };

  if (productoId) {
    // Actualizar producto existente
    const { error } = await supabase
      .from("productos")
      .update(payload)
      .eq("id", productoId);

    if (error) return { success: false, error: error.message };
  } else {
    // Insertar nuevo producto
    const { error } = await supabase.from("productos").insert([payload]);
    if (error) return { success: false, error: error.message };
  }

  // Revalidamos la ruta para actualizar el listado del inventario al instante
  revalidatePath("/(adminPanel)/productos");
  return { success: true };
}
