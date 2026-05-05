"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PedidoCard } from "./PedidoCard";
import { Radio, Loader2, Inbox } from "lucide-react";

// Tipamos exactamente igual que en PedidoCard para garantizar la consistencia en el mapeo
interface PedidoItem {
  id: string;
  cantidad: number;
  nombre_producto: string;
  precio_unitario: number;
}

interface PedidoData {
  id: string;
  estado: "pendiente" | "preparando" | "enviado" | "entregado" | "cancelado";
  cliente_nombre: string;
  metodo_pago: string;
  total: number | string;
  cliente_whatsapp: string;
  es_delivery: boolean;
  direccion_entrega?: string | null;
  notas?: string | null;
  pedido_items: PedidoItem[];
}

interface PedidosRadarProps {
  initialPedidos: PedidoData[];
  negocioId: string;
}

export function PedidosRadar({ initialPedidos, negocioId }: PedidosRadarProps) {
  const [pedidos, setPedidos] = useState<PedidoData[]>(initialPedidos);
  const [isSyncing, setIsSyncing] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel(`radar-pedidos-${negocioId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT", // Escuchamos específicamente inserciones
          schema: "public",
          table: "pedidos",
          filter: `negocio_id=eq.${negocioId}`,
        },
        async (payload) => {
          console.log("¡Nuevo pedido detectado!", payload);
          setIsSyncing(true);

          // Fetch de los datos frescos incluyendo los items relacionales
          // Eliminamos la variable 'error' que no se usaba para limpiar el warning del linter
          const { data } = await supabase
            .from("pedidos")
            .select("*, pedido_items(*)")
            .eq("negocio_id", negocioId)
            .order("created_at", { ascending: false })
            .limit(50);

          if (data) {
            setPedidos(data as unknown as PedidoData[]);
          }
          setIsSyncing(false);
        },
      )
      .subscribe((status) => {
        console.log("Estado de la suscripción:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [negocioId, supabase]);

  const pendientes = pedidos.filter(
    (p) => p.estado === "pendiente" || p.estado === "preparando",
  );

  return (
    <div className="space-y-8">
      {/* Indicador de Estado del Radar */}
      <div className="flex items-center justify-between bg-bg-main dark:bg-white/5 p-4 rounded-neo border-2 border-border border-dashed">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Radio className="text-primary animate-pulse" size={20} />
            <div className="absolute inset-0 bg-primary/20 blur-lg animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-primary italic">
              Radar Operativo
            </p>
            <p className="text-xs font-bold text-text-muted">
              ESCUCHANDO NUEVOS PEDIDOS EN VIVO
            </p>
          </div>
        </div>
        {isSyncing && (
          <div className="flex items-center gap-2 text-text-muted animate-in fade-in">
            <Loader2 className="animate-spin" size={14} />
            <span className="text-[9px] font-black uppercase italic">
              Sincronizando...
            </span>
          </div>
        )}
      </div>

      {/* Grid de Pedidos Activos */}
      {pendientes.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendientes.map((pedido) => (
            <PedidoCard key={pedido.id} pedido={pedido} />
          ))}
        </div>
      ) : (
        <div className="py-24 flex flex-col items-center justify-center text-center space-y-4 border-2 border-dashed border-border rounded-super bg-gray-50/50">
          <div className="p-6 bg-white rounded-full shadow-xl">
            <Inbox className="text-border" size={48} />
          </div>
          <div className="space-y-1">
            <p className="font-black uppercase italic text-xl tracking-tighter">
              Sin pedidos pendientes
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
              El radar está despejado por ahora
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
