"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Interfaz para el retorno de las acciones
interface ActionResponse {
  success: boolean;
  error?: string;
  mensaje?: string;
}

// Interfaz estricta para mapear la consulta relacional con el inner join de Supabase
interface PedidoConNegocio {
  negocio_id: string;
  negocios: {
    user_id: string;
  } | null;
}

/**
 * Actualiza el estado de un pedido (ej: de 'pendiente' a 'preparando').
 * Valida que el usuario autenticado sea el dueño del negocio asociado al pedido.
 */
export async function actualizarEstadoPedido(
  pedidoId: string,
  nuevoEstado: string,
): Promise<ActionResponse> {
  const supabase = await createClient();

  // 1. Obtener el usuario actual
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return {
      success: false,
      error: "No autorizado. Inicie sesión nuevamente.",
    };
  }

  try {
    // 2. Verificación de seguridad:
    // Forzamos el tipado de la respuesta relacional de Supabase usando nuestra interfaz
    const { data, error: fetchError } = await supabase
      .from("pedidos")
      .select("negocio_id, negocios!inner(user_id)")
      .eq("id", pedidoId)
      .single();

    // Hacemos un cast seguro para que TypeScript sepa exactamente la estructura del join
    const pedido = data as unknown as PedidoConNegocio;

    if (fetchError || !pedido) {
      return { success: false, error: "Pedido no encontrado." };
    }

    // Validación de seguridad estricta y tipada sin necesidad de deshabilitar el linter
    if (!pedido.negocios || pedido.negocios.user_id !== user.id) {
      return { success: false, error: "No tienes permisos sobre este pedido." };
    }

    // 3. Ejecutar la actualización
    const { error: updateError } = await supabase
      .from("pedidos")
      .update({
        estado: nuevoEstado.toLowerCase(),
      })
      .eq("id", pedidoId);

    if (updateError) throw updateError;

    // 4. Revalidar la ruta para actualizar el radar y el historial en tiempo real
    revalidatePath("/(adminPanel)/pedidos");

    return {
      success: true,
      mensaje: `Pedido marcado como ${nuevoEstado.toUpperCase()}`,
    };
  } catch (err) {
    // En las versiones modernas de TS, los errores de catch son 'unknown'.
    // Evaluamos si viene con un mensaje de error para reportarlo limpiamente sin usar 'any'.
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("Critical Order Error:", errorMessage);
    return {
      success: false,
      error: "Error interno al procesar el cambio de estado.",
    };
  }
}

/**
 * Elimina o cancela un pedido del registro (Solo si el flujo de negocio lo permite).
 * Generalmente se prefiere cambiar el estado a 'cancelado', pero incluimos
 * la función por si necesitas una purga administrativa.
 */
export async function eliminarPedido(
  pedidoId: string,
): Promise<ActionResponse> {
  const supabase = await createClient();

  const { error } = await supabase.from("pedidos").delete().eq("id", pedidoId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/(adminPanel)/pedidos");
  return { success: true };
}
