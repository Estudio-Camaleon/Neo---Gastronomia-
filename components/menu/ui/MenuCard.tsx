"use client";

import Image from "next/image";
import { Plus, ShoppingBag } from "lucide-react";
import { useCartStore } from "../store/useCartStore";
import { toast } from "sonner";
import React from "react";

interface Producto {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  imagen_url: string | null;
  disponible: boolean;
}

interface MenuCardProps {
  producto: Producto;
  colorConfig: string; // Recibimos el color hexadecimal real inyectado desde el orquestador
}

export function MenuCard({ producto, colorConfig }: MenuCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  // Fallback de seguridad idéntico por si el string llega vacío o nulo
  const finalColor =
    !colorConfig || colorConfig === "#000000" ? "#1c7a42" : colorConfig;

  const handleAgregar = () => {
    if (!producto.disponible) {
      return toast.error("PRODUCTO NO DISPONIBLE", {
        description: "Lamentablemente nos quedamos sin stock por el momento.",
      });
    }

    addItem({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1,
    });

    toast.success("AGREGADO AL CARRITO", {
      description: `Se sumó 1x ${producto.nombre.toUpperCase()} a tu pedido.`,
      icon: <ShoppingBag style={{ stroke: finalColor }} size={16} />,
    });
  };

  return (
    <div
      className={`bg-white dark:bg-bg-darker border-2 border-border dark:border-border-dark rounded-super overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 group ${!producto.disponible ? "opacity-60 select-none" : ""}`}
    >
      {/* 1. SECCIÓN DE IMAGEN / BANNER DE PRODUCTO */}
      <div className="relative h-44 w-full bg-gray-50 dark:bg-white/5 overflow-hidden border-b-2 border-border dark:border-border-dark">
        {producto.imagen_url ? (
          <Image
            src={producto.imagen_url}
            alt={producto.nombre}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority={false}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-text-muted/40 gap-2 select-none">
            <ShoppingBag size={32} strokeWidth={1.5} />
            <span className="text-[9px] font-black uppercase tracking-widest font-mono">
              NEO IMAGE PLACEHOLDER
            </span>
          </div>
        )}

        {/* Badge Flotante de Stock Condicional */}
        {!producto.disponible && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-error text-white font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-full border-2 border-white">
              SIN STOCK
            </span>
          </div>
        )}
      </div>

      {/* 2. CUERPO DE DATOS E INFORMACIÓN GENERAL */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <h3
            style={{ color: finalColor }} // Título del producto acoplado al color real de Supabase
            className="font-black italic uppercase text-base tracking-tight leading-tight line-clamp-1 transition-colors"
          >
            {producto.nombre}
          </h3>
          {producto.descripcion && (
            <p className="text-text-secondary dark:text-text-muted text-xs font-medium leading-relaxed line-clamp-2">
              {producto.descripcion}
            </p>
          )}
        </div>

        {/* 3. FOOTER DE COMPRA CON INYECCIÓN DE ESTILO DIRECTO */}
        <div className="flex items-center justify-between pt-2 border-t border-dashed border-border/60 dark:border-border-dark/60">
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-widest text-text-muted font-mono leading-none">
              PRECIO
            </span>
            <span className="font-black text-lg tracking-tighter text-text-primary dark:text-text-inverse font-mono mt-0.5">
              $
              {Number(producto.precio).toLocaleString("es-AR", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAgregar}
            disabled={!producto.disponible}
            // Inyección nativa infalible para eludir el bug de variables estáticas de Tailwind v4
            style={{ backgroundColor: finalColor }}
            className="flex items-center gap-2 text-white px-4 py-2.5 rounded-xl font-black uppercase italic text-[10px] tracking-wider hover:opacity-90 active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none shadow-sm cursor-pointer border-t border-white/10"
          >
            AGREGAR <Plus size={14} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
}
