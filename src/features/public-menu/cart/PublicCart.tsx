"use client";

import Image from "next/image";
import { useCartStore } from "./useCartStore";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  X,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { OrderForm } from "./OrderForm";

interface PublicCartProps {
  negocioId: string;
  isDrawer?: boolean;
  onCloseDrawer?: () => void;
  config?: {
    moneda_simbolo?: string;
    pedido_minimo?: number;
    costo_envio?: number;
  };
}

export function PublicCart({
  negocioId,
  isDrawer = false,
  onCloseDrawer,
  config = { moneda_simbolo: "$", pedido_minimo: 0, costo_envio: 0 },
}: PublicCartProps) {
  const { cart, addItem, removeItem, clearCart } = useCartStore(
    (state) => state,
  );
  const [showOrderForm, setShowOrderForm] = useState(false);

  const subtotal = cart.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0,
  );
  const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);

  const faltaParaMinimo = (config.pedido_minimo || 0) - subtotal;
  const esPedidoValido = subtotal >= (config.pedido_minimo || 0);

  const handleVaciar = () => {
    clearCart();
    toast.success("Carrito vaciado");
    if (isDrawer && onCloseDrawer) onCloseDrawer();
  };

  const renderCartContent = () => (
    <div className="flex h-full flex-col justify-between">
      {cart.length === 0 ? (
        <div className="flex flex-1 select-none flex-col items-center justify-center px-4 py-16 text-center">
          <div className="mb-4 rounded-full bg-[rgba(31,107,61,0.08)] p-4 text-[var(--color-custom)]">
            <ShoppingBag size={40} strokeWidth={1.5} />
          </div>
          <h4 className="text-lg font-extrabold uppercase tracking-tight text-[var(--color-custom-deep)]">
            Tu carrito está vacío
          </h4>
          <p className="mt-2 max-w-[220px] text-sm text-[rgba(0,0,0,0.48)]">
            Explora nuestro menú y agrega productos para comenzar.
          </p>
        </div>
      ) : !showOrderForm ? (
        <div className="flex h-full flex-col justify-between">
          <div className="max-h-[430px] overflow-y-auto pr-2 custom-scrollbar">
            {cart.map((item) => (
              <div
                key={item.id}
                className="mb-3 flex items-center gap-3 rounded-[18px] border border-[rgba(0,0,0,0.08)] bg-[#f8f6f0] p-2.5 animate-in fade-in duration-200"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[14px] bg-white border border-[rgba(0,0,0,0.06)]">
                  {item.imagen_url ? (
                    <Image
                      src={item.imagen_url}
                      alt={item.nombre}
                      width={56}
                      height={56}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ShoppingBag size={18} className="text-[rgba(0,0,0,0.2)]" />
                  )}
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <p className="truncate text-[10px] font-black uppercase italic tracking-[0.18em] text-[var(--color-custom)]">
                    {item.nombre}
                  </p>
                  {item.detalles && (
                    <p className="truncate text-[11px] text-[rgba(0,0,0,0.42)]">
                      Nota: {item.detalles}
                    </p>
                  )}
                  <p className="text-[11px] font-black text-[var(--color-custom)]">
                    {config.moneda_simbolo}{(item.precio * item.cantidad).toFixed(2)}
                  </p>
                </div>

                <div className="flex shrink-0 items-center overflow-hidden rounded-full bg-[var(--color-custom)] text-white shadow-[0_8px_18px_rgba(31,107,61,0.2)]">
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="flex h-7 w-7 items-center justify-center text-white/95 transition-opacity hover:opacity-80"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="min-w-6 px-1 text-center text-[11px] font-black leading-7">
                    {item.cantidad}
                  </span>
                  <button
                    type="button"
                    onClick={() => addItem({ ...item, cantidad: 1 })}
                    className="flex h-7 w-7 items-center justify-center text-white/95 transition-opacity hover:opacity-80"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto space-y-4 border-t border-[rgba(31,107,61,0.18)] pt-4">
            {!esPedidoValido && (
              <div className="flex items-start gap-3 rounded-[16px] border border-[rgba(31,107,61,0.12)] bg-[rgba(31,107,61,0.06)] p-3 text-sm text-[var(--color-custom-deep)]">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <p>
                  Agrega{" "}
                  <strong>
                    {config.moneda_simbolo}
                    {faltaParaMinimo.toFixed(2)}
                  </strong>{" "}
                  más para alcanzar el pedido mínimo.
                </p>
              </div>
            )}

            <div className="space-y-3 rounded-[18px] border border-[rgba(31,107,61,0.15)] bg-[#fbfaf6] p-4">
              <div className="flex items-center justify-between text-sm text-[rgba(0,0,0,0.52)]">
                <span className="font-semibold italic">Subtotal</span>
                <span className="font-black text-[var(--color-custom-deep)]">
                  {config.moneda_simbolo}{subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-[rgba(0,0,0,0.52)]">
                <span className="font-semibold italic">Descuento</span>
                <span className="font-black text-[var(--color-custom-deep)]">-{config.moneda_simbolo}0.00</span>
              </div>
              <div>
                <span className="block text-[12px] font-black uppercase italic tracking-[0.18em] text-[var(--color-custom)]">
                  Total
                </span>
                <p className="mt-1 text-3xl font-black italic tracking-tight text-[var(--color-custom)]">
                  {config.moneda_simbolo}{subtotal.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleVaciar}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[rgba(31,107,61,0.16)] bg-white px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-[rgba(0,0,0,0.54)] transition-colors hover:bg-[rgba(31,107,61,0.04)]"
              >
                <Trash2 size={14} /> Vaciar
              </button>

              <button
                type="button"
                disabled={!esPedidoValido}
                onClick={() => setShowOrderForm(true)}
                className={`inline-flex flex-[1.3] items-center justify-center gap-2 rounded-full px-4 py-3 text-xs font-black uppercase tracking-[0.18em] transition-all ${
                  esPedidoValido
                    ? "bg-[var(--color-custom)] text-white shadow-[0_12px_22px_rgba(31,107,61,0.2)]"
                    : "cursor-not-allowed bg-[rgba(0,0,0,0.08)] text-[rgba(0,0,0,0.34)]"
                }`}
              >
                Finalizar pedido <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col h-full justify-between">
          <OrderForm
            negocioId={negocioId}
            cart={cart}
            total={subtotal}
            config={config}
            onBack={() => setShowOrderForm(false)}
            onSuccess={() => {
              clearCart();
              if (isDrawer && onCloseDrawer) onCloseDrawer();
            }}
          />
        </div>
      )}
    </div>
  );

  if (isDrawer) {
    return (
      <div className="fixed inset-0 z-[99999] flex justify-end font-sans">
        <div
          className="absolute inset-0 bg-black/45 backdrop-blur-sm transition-opacity"
          onClick={onCloseDrawer}
        />
        <div className="relative flex h-full w-full max-w-[390px] flex-col bg-white p-5 shadow-2xl animate-in slide-in-from-right duration-300 sm:max-w-md">
          <div className="mb-4 flex items-center justify-between border-b border-[rgba(31,107,61,0.14)] pb-4">
            <h3 className="flex items-center gap-2 text-lg font-black italic uppercase tracking-tight text-[var(--color-custom)]">
              Tu pedido
              {totalItems > 0 && (
                <span className="rounded-full bg-[rgba(31,107,61,0.1)] px-2.5 py-0.5 text-xs font-black text-[var(--color-custom)]">
                  ({totalItems})
                </span>
              )}
            </h3>
            <button
              type="button"
              onClick={onCloseDrawer}
              className="rounded-full p-2 text-[rgba(0,0,0,0.4)] transition-colors hover:bg-[rgba(0,0,0,0.05)] hover:text-[rgba(0,0,0,0.75)]"
            >
              <X size={20} />
            </button>
          </div>
          {renderCartContent()}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col rounded-[28px] border border-[rgba(31,107,61,0.12)] bg-white p-5 shadow-[0_18px_36px_rgba(0,0,0,0.12)]">
      {renderCartContent()}
    </div>
  );
}
