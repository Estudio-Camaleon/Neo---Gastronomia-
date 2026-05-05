"use client";

import { ShoppingBag } from "lucide-react";
import { useCartStore } from "../store/useCartStore"; // Conexión unificada al store de Zustand

interface CartFloatingButtonProps {
  disabled?: boolean;
}

export function CartFloatingButton({ disabled }: CartFloatingButtonProps) {
  // Extraemos los reactivos y selectores directamente desde Zustand
  const cart = useCartStore((state) => state.cart);

  // Calculamos totales de forma eficiente en base al store global
  const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0,
  );

  // Si no hay items o el local está cerrado, el botón no debe estorbar
  if (totalItems === 0 || disabled) return null;

  const handleOpenCart = () => {
    // Dispara el scroll suave hacia el contenedor del checkout o abre el sidebar en móvil
    const cartElement = document.getElementById("public-cart-container");
    if (cartElement) {
      cartElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] w-full px-6 md:hidden animate-in fade-in slide-in-from-bottom-6 duration-500">
      <button
        type="button"
        onClick={handleOpenCart}
        className="w-full bg-black text-white h-18 rounded-neo shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-between px-8 active:scale-[0.95] transition-all border-t-2 border-white/10 group"
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <ShoppingBag
              size={26}
              className="group-hover:rotate-12 transition-transform"
            />
            <span className="absolute -top-3 -right-3 bg-primary text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-black animate-bounce">
              {totalItems}
            </span>
          </div>
          <div className="flex flex-col items-start leading-none">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">
              Check-out
            </span>
            <span className="text-xs font-black uppercase italic tracking-tighter">
              Ver mi pedido
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end leading-none">
          <span className="text-[9px] font-bold uppercase opacity-50 mb-1">
            Subtotal
          </span>
          <span className="font-black text-xl italic tracking-tighter">
            ${totalPrice.toLocaleString("es-AR")}
          </span>
        </div>
      </button>
    </div>
  );
}
