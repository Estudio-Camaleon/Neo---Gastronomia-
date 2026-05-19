"use client";

import {
  Smartphone,
  Truck,
  MessageCircle,
  XCircle,
  Check,
  CheckCircle2,
  Loader2,
  UtensilsCrossed,
} from "lucide-react";
import { PedidoData } from "./PedidosRadar";

interface PedidoCardProps {
  pedido: PedidoData;
  onUpdateStatus: (id: string, nuevoEstado: PedidoData["estado"]) => void;
  loadingId: string | null;
}

export function PedidoCard({
  pedido,
  onUpdateStatus,
  loadingId,
}: PedidoCardProps) {
  const isLoading = loadingId === pedido.id;

  return (
    <div className="admin-card overflow-hidden flex flex-col h-full !p-0">
      {/* HEADER DE CANAL DE DESPACHO */}
      <div
        className={`px-5 py-3 border-b border-[var(--admin-border)] flex justify-between items-center ${pedido.estado === "en_preparacion" ? "bg-[var(--admin-accent)]/5" : "bg-white"}`}
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--admin-text)]">
          {pedido.es_delivery ? (
            <Truck size={16} className="text-blue-500" />
          ) : (
            <Smartphone size={16} className="text-orange-500" />
          )}
          <span className="truncate max-w-[200px]">
            {pedido.es_delivery
              ? `Envío: ${pedido.direccion_entrega}`
              : "Retiro Local"}
          </span>
        </div>
        <span className="font-mono text-xs text-[var(--admin-text-muted)] font-medium">
          #{pedido.id.slice(0, 6)}
        </span>
      </div>

      {/* CUERPO DE DATOS */}
      <div className="p-5 space-y-5 flex-1">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h4 className="font-bold text-lg text-[var(--admin-text)] leading-tight mb-1">
              {pedido.cliente_nombre}
            </h4>
            <p className="text-xs text-[var(--admin-text-muted)] flex items-center gap-1.5">
              <span className="capitalize">{pedido.metodo_pago}</span> •{" "}
              <span className="font-semibold text-[var(--admin-accent)] text-sm">
                ${Number(pedido.total).toFixed(2)}
              </span>
            </p>
          </div>
          <a
            href={`https://wa.me/${pedido.cliente_whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors shrink-0 border border-green-200 shadow-sm"
            title="Contactar por WhatsApp"
          >
            <MessageCircle size={18} />
          </a>
        </div>

        {/* COMANDA INTERNA */}
        <div className="bg-gray-50/50 rounded-xl border border-gray-100 p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider mb-2">
            <UtensilsCrossed size={14} />
            <span>Comanda</span>
          </div>
          <div className="space-y-3 divide-y divide-gray-100 text-sm">
            {pedido.pedido_items?.map((item) => (
              <div key={item.id} className="pt-3 first:pt-0">
                <div className="flex items-start gap-2">
                  <span className="bg-[var(--admin-surface-accent)] text-[var(--admin-text)] px-1.5 py-0.5 rounded text-xs font-bold shrink-0">
                    {item.cantidad}x
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-[var(--admin-text)] leading-tight">
                      {item.nombre_producto}
                    </p>
                    {item.detalles && (
                      <p className="text-xs text-[var(--admin-text-muted)] mt-1 bg-white p-1.5 rounded-md border border-gray-100 inline-block">
                        Nota: {item.detalles}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {pedido.notas && (
          <div className="bg-amber-50 rounded-xl border border-amber-100 p-3 text-sm">
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider block mb-1">
              Aclaraciones extra
            </span>
            <p className="text-amber-900 leading-relaxed">{pedido.notas}</p>
          </div>
        )}
      </div>

      {/* CONTROLADORES DE ESTADO */}
      <div className="p-4 bg-gray-50/80 border-t border-[var(--admin-border)] flex gap-3">
        {pedido.estado === "pendiente" ? (
          <>
            <button
              onClick={() => onUpdateStatus(pedido.id, "cancelado")}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-white border border-red-200 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <XCircle size={16} />
              )}{" "}
              Rechazar
            </button>
            <button
              onClick={() => onUpdateStatus(pedido.id, "en_preparacion")}
              disabled={isLoading}
              className="flex-[2] flex items-center justify-center gap-2 px-3 py-2.5 bg-[var(--admin-accent)] text-white rounded-xl text-sm font-semibold hover:bg-[var(--admin-accent)]/90 shadow-sm transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Check size={16} />
              )}{" "}
              Preparar
            </button>
          </>
        ) : (
          <button
            onClick={() => onUpdateStatus(pedido.id, "entregado")}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[var(--admin-text)] text-white rounded-xl text-sm font-bold hover:bg-gray-800 shadow-md transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <CheckCircle2 size={18} />
            )}{" "}
            Marcar como Entregado
          </button>
        )}
      </div>
    </div>
  );
}
