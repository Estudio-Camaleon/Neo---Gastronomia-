"use client";

import { useState } from "react";
import { useCartStore } from "../store/useCartStore";
import { createClient } from "@/lib/supabase/client";
import { ShoppingBag, X, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { OrderForm } from "./OrderForm"; // Conexión con el átomo de formulario recién modularizado

interface CartItemData {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
}

interface PublicCartProps {
  negocioId: string;
}

export function PublicCart({ negocioId }: PublicCartProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { cart, clearCart } = useCartStore();

  // Estado inicial unificado que calza de forma estricta con OrderForm
  const [form, setForm] = useState({
    nombre: "",
    whatsapp: "",
    delivery: false,
    direccion: "",
  });

  const supabase = createClient();
  const total = cart.reduce(
    (acc, i: CartItemData) => acc + i.precio * i.cantidad,
    0,
  );

  // Manejador centralizado para absorber los cambios de inputs de forma reactiva
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const enviarPedido = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setLoading(true);

    try {
      // 1. Crear el Pedido (Padre)
      const { data: pedido, error: pErr } = await supabase
        .from("pedidos")
        .insert([
          {
            negocio_id: negocioId,
            cliente_nombre: form.nombre.toUpperCase().trim(),
            cliente_whatsapp: form.whatsapp.trim(),
            total,
            es_delivery: form.delivery,
            direccion_entrega: form.delivery
              ? form.direccion.toUpperCase().trim()
              : "RETIRO EN LOCAL",
            estado: "pendiente",
          },
        ])
        .select()
        .single();

      if (pErr) throw pErr;

      // 2. Crear los Items del Pedido (Hijos) vinculados estrictamente
      const { error: iErr } = await supabase.from("pedido_items").insert(
        cart.map((i: CartItemData) => ({
          pedido_id: pedido.id,
          producto_id: i.id,
          nombre_producto: i.nombre,
          precio_unitario: i.precio,
          cantidad: i.cantidad,
        })),
      );

      if (iErr) throw iErr;

      toast.success("¡PEDIDO RECIBIDO! 🍔");
      clearCart();
      setIsOpen(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      console.error("Error al procesar orden:", errorMessage);
      toast.error("Error al procesar el pedido");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) return null;

  return (
    <>
      {/* Botón Flotante de Escritorio / Trigger de apertura */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-2xl flex gap-3 font-black italic items-center z-50 animate-in fade-in zoom-in group active:scale-95 transition-transform"
        title="Ver carrito de compras"
      >
        <ShoppingBag
          size={24}
          className="group-hover:rotate-12 transition-transform"
        />
        <span className="text-sm font-mono">
          ${total.toLocaleString("es-AR")}
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex justify-end">
          {/* Contenedor con ID unificado para el scroll reactivo del botón móvil */}
          <div
            id="public-cart-container"
            className="w-full max-w-md bg-white dark:bg-bg-dark h-full p-6 flex flex-col shadow-2xl animate-in slide-in-from-right"
          >
            {/* Cabecera del Drawer */}
            <div className="flex justify-between items-center mb-6 border-b-2 pb-4 border-border dark:border-border-dark">
              <h2 className="text-2xl font-black italic uppercase tracking-tighter text-text-primary dark:text-text-inverse">
                Tu Carrito
              </h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-text-primary dark:text-text-inverse p-1 hover:opacity-70 transition-opacity"
              >
                <X size={28} />
              </button>
            </div>

            {/* Listado Escroleable de Productos */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
              {cart.map((i: CartItemData) => (
                <div
                  key={i.id}
                  className="flex justify-between items-center border-b pb-2 border-dashed border-border dark:border-border-dark"
                >
                  <div>
                    <p className="font-bold text-xs uppercase italic text-text-primary dark:text-text-inverse">
                      {i.cantidad}x {i.nombre}
                    </p>
                    <p className="text-[10px] text-text-muted">
                      ${i.precio.toLocaleString("es-AR")} c/u
                    </p>
                  </div>
                  <span className="font-black font-mono text-text-primary dark:text-text-inverse">
                    ${(i.precio * i.cantidad).toLocaleString("es-AR")}
                  </span>
                </div>
              ))}
            </div>

            {/* Formulario Maestro de Envío y Despacho */}
            <form onSubmit={enviarPedido} className="mt-4">
              <OrderForm data={form} onChange={handleFormChange} />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white dark:bg-primary dark:text-white py-4 rounded-neo font-black italic uppercase tracking-widest flex justify-center items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <Send size={18} /> ENVIAR AL LOCAL
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
