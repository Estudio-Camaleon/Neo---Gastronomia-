"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Beaker, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface TestOrderButtonProps {
  negocioId: string;
}

export function TestOrderButton({ negocioId }: TestOrderButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const supabase = createClient();

  const createTestOrder = async () => {
    setIsPending(true);

    try {
      // 1. Inserción atómica del registro de Pedido (Entidad Padre)
      const { data: pedido, error: pedidoError } = await supabase
        .from("pedidos")
        .insert([
          {
            negocio_id: negocioId,
            cliente_nombre: "Facundo (Test Neo)",
            cliente_whatsapp: "381000000",
            total: 4500.5,
            metodo_pago: "Efectivo",
            es_delivery: true,
            direccion_entrega: "Av. Siempre Viva 123, Tucumán",
            notas:
              "Esto es un pedido de prueba para verificar Realtime en NEO.",
            estado: "pendiente",
          },
        ])
        .select()
        .single();

      if (pedidoError) throw pedidoError;

      // 2. Inserción en lote de los ítems asociados (Entidad Hija)
      const { error: itemsError } = await supabase.from("pedido_items").insert([
        {
          pedido_id: pedido.id,
          nombre_producto: "Hamburguesa Neo Double",
          precio_unitario: 3500,
          cantidad: 1,
        },
        {
          pedido_id: pedido.id,
          nombre_producto: "Papas Fritas Medianas",
          precio_unitario: 1000.5,
          cantidad: 1,
        },
      ]);

      if (itemsError) throw itemsError;

      toast.success("ORDEN DE PRUEBA GENERADA", {
        description: "Debería impactar de inmediato en el centro de monitoreo.",
      });
    } catch (error: unknown) {
      console.error("Error detallado en simulación:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error inesperado de base de datos";

      toast.error("Error al generar test", {
        description: errorMessage,
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      type="button" // Semántica de botón estricta para evitar burbujeo de submits
      onClick={createTestOrder}
      disabled={isPending}
      className="flex items-center gap-2 bg-purple-600 dark:bg-purple-700 text-white px-4 py-2 rounded-neo font-black uppercase italic text-[10px] tracking-widest hover:bg-purple-700 dark:hover:bg-purple-800 transition-all active:scale-95 disabled:opacity-50 select-none font-sans"
    >
      {isPending ? (
        <Loader2 className="animate-spin text-white" size={14} />
      ) : (
        <Beaker size={14} />
      )}
      Simular Pedido
    </button>
  );
}
