"use client";

import { useCartStore } from "./store/useCartStore";
import { Plus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

export function MenuCard({ producto }: { producto: any }) {
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAdd = () => {
    addToCart({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1,
    });
    toast.success(`${producto.nombre} agregado`);
  };

  return (
    <div className="bg-white border-2 border-border rounded-super overflow-hidden flex p-2 gap-4 shadow-sm">
      <div className="w-24 h-24 bg-gray-100 shrink-0 rounded-lg overflow-hidden">
        {producto.imagen_url ? (
          <img
            src={producto.imagen_url}
            className="w-full h-full object-cover"
            alt={producto.nombre}
          />
        ) : (
          <ShoppingBag className="m-auto h-full opacity-10" />
        )}
      </div>
      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
          <h3 className="font-black uppercase italic text-sm">
            {producto.nombre}
          </h3>
          <p className="text-[10px] text-text-muted line-clamp-2">
            {producto.descripcion}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-black italic text-lg">${producto.precio}</span>
          <button
            onClick={handleAdd}
            className="bg-black text-white p-2 rounded-neo hover:bg-primary transition-all active:scale-90"
          >
            <Plus size={16} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
}
