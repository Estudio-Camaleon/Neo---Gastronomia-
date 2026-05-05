"use client";

import { Trash2, Minus, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";

// Interfaz estricta para liquidar el any de raíz
interface CartItemData {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
}

interface CartItemProps {
  item: CartItemData;
  isClosed?: boolean;
}

export function CartItem({ item, isClosed }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="animate-in fade-in slide-in-from-right-2 duration-300">
      <div className="flex justify-between items-start gap-4">
        <span className="uppercase flex-1 leading-tight text-[11px] font-black italic">
          {item.cantidad}X {item.nombre}
        </span>
        <span className="font-black whitespace-nowrap text-[11px] italic">
          造型: ${(item.precio * item.cantidad).toLocaleString("es-AR")}
        </span>
      </div>

      <div className="flex items-center gap-4 mt-2 opacity-50 hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-2 border border-black/10 px-2 py-1 rounded-sm bg-white dark:bg-bg-dark font-mono">
          <button
            type="button"
            onClick={() => updateQuantity(item.id, -1)}
            className="hover:text-primary p-0.5 disabled:opacity-30 transition-colors"
            disabled={isClosed}
            title="Disminuir cantidad"
          >
            <Minus size={10} strokeWidth={3} />
          </button>

          <span className="text-[10px] min-w-[12px] text-center font-black">
            {item.cantidad}
          </span>

          <button
            type="button"
            onClick={() => updateQuantity(item.id, 1)}
            className="hover:text-primary p-0.5 disabled:opacity-30 transition-colors"
            disabled={isClosed}
            title="Aumentar cantidad"
          >
            <Plus size={10} strokeWidth={3} />
          </button>
        </div>

        <button
          type="button"
          onClick={() => removeFromCart(item.id)}
          className="text-[8px] flex items-center gap-1 hover:text-error font-black uppercase tracking-tighter italic transition-colors"
        >
          <Trash2 size={10} /> Quitar
        </button>
      </div>
    </div>
  );
}
