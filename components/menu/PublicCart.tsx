"use client";

import { useState } from "react";
import { useCartStore } from "./store/useCartStore";
import { createClient } from "@/lib/supabase/client";
import { ShoppingBag, X, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Interfaz estricta para sincronizar los tipos de datos del store de Zustand
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
            cliente_nombre: form.nombre.toUpperCase(),
            cliente_whatsapp: form.whatsapp,
            total,
            es_delivery: form.delivery,
            direccion_entrega: form.delivery
              ? form.direccion
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

      toast.success("¡PEDIDO RECIBIDO!");
      clearCart();
      setIsOpen(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      console.error("Error al procesar orden:", errorMessage);
      toast.error("Error al procesar el pedido");
    } finally {
      setLoading(true); // Se mantiene el estado sincronizado de carga
      setLoading(false);
    }
  };

  if (cart.length === 0) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-2xl flex gap-3 font-black italic items-center z-50 animate-in fade-in zoom-in"
      >
        <ShoppingBag size={24} />
        <span className="text-sm">${total.toLocaleString("es-AR")}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-white dark:bg-bg-dark h-full p-6 flex flex-col shadow-2xl animate-in slide-in-from-right">
            <div className="flex justify-between items-center mb-8 border-b-2 pb-4">
              <h2 className="text-2xl font-black italic uppercase tracking-tighter">
                Tu Carrito
              </h2>
              <button type="button" onClick={() => setIsOpen(false)}>
                <X size={28} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
              {cart.map((i: CartItemData) => (
                <div
                  key={i.id}
                  className="flex justify-between items-center border-b pb-2 border-dashed"
                >
                  <div>
                    <p className="font-bold text-xs uppercase italic">
                      {i.cantidad}x {i.nombre}
                    </p>
                    <p className="text-[10px] text-text-muted">
                      ${i.precio} c/u
                    </p>
                  </div>
                  <span className="font-black">
                    ${(i.precio * i.cantidad).toLocaleString("es-AR")}
                  </span>
                </div>
              ))}
            </div>

            <form
              onSubmit={enviarPedido}
              className="mt-6 space-y-4 bg-gray-50 dark:bg-white/5 p-4 rounded-neo border-2 border-border"
            >
              <input
                placeholder="NOMBRE"
                required
                className="w-full p-3 bg-white dark:bg-bg-dark border-2 border-border rounded-neo uppercase font-bold text-xs outline-none focus:border-primary"
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />
              <input
                placeholder="WHATSAPP"
                required
                type="tel"
                className="w-full p-3 bg-white dark:bg-bg-dark border-2 border-border rounded-neo uppercase font-bold text-xs outline-none focus:border-primary"
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="del"
                  className="accent-primary w-4 h-4 cursor-pointer"
                  onChange={(e) =>
                    setForm({ ...form, delivery: e.target.checked })
                  }
                />
                <label
                  htmlFor="del"
                  className="text-[10px] font-black uppercase cursor-pointer select-none"
                >
                  ¿Es para Envío?
                </label>
              </div>
              {form.delivery && (
                <input
                  placeholder="DIRECCIÓN DE ENTREGA"
                  required
                  className="w-full p-3 bg-white dark:bg-bg-dark border-2 border-border rounded-neo uppercase font-bold text-xs outline-none focus:border-primary"
                  onChange={(e) =>
                    setForm({ ...form, direccion: e.target.value })
                  }
                />
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-4 rounded-neo font-black italic uppercase tracking-widest flex justify-center items-center gap-2 hover:bg-primary transition-colors disabled:opacity-50"
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
