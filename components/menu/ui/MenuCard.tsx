"use client";

import { useCartStore } from "../store/useCartStore"; // Ajustado para apuntar correctamente subiendo un nivel
import { Plus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface ProductoMenuData {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  imagen_url: string | null;
}

interface MenuCardProps {
  producto: ProductoMenuData;
}

export function MenuCard({ producto }: MenuCardProps) {
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
    <div className="bg-white dark:bg-bg-darker border-2 border-border dark:border-border-dark rounded-super overflow-hidden flex p-2 gap-4 shadow-sm animate-in fade-in duration-300">
      {/* Contenedor relativo para alojar la imagen optimizada */}
      <div className="relative w-24 h-24 bg-gray-100 dark:bg-black/20 shrink-0 rounded-lg overflow-hidden flex items-center justify-center">
        {producto.imagen_url ? (
          <Image
            src={producto.imagen_url}
            alt={producto.nombre}
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : (
          <ShoppingBag className="opacity-10 w-8 h-8 text-text-primary dark:text-text-inverse" />
        )}
      </div>

      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
          <h3 className="font-black uppercase italic text-sm text-text-primary dark:text-text-inverse">
            {producto.nombre}
          </h3>
          <p className="text-[10px] text-text-muted line-clamp-2 mt-0.5">
            {producto.descripcion || "Sin descripción disponible"}
          </p>
        </div>

        <div className="flex justify-between items-center">
          <span className="font-black italic text-lg text-text-primary dark:text-text-inverse font-mono">
            $
            {Number(producto.precio).toLocaleString("es-AR", {
              minimumFractionDigits: 2,
            })}
          </span>
          <button
            type="button"
            onClick={handleAdd}
            className="bg-black text-white dark:bg-primary dark:text-white p-2 rounded-neo hover:bg-primary dark:hover:bg-primary-hover transition-all active:scale-90"
            title="Agregar al carrito"
          >
            <Plus size={16} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
}
