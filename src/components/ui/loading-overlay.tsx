"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  isActive: boolean;
  message?: string;
}

export function LoadingOverlay({ isActive, message = "Cargando..." }: LoadingOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isActive) {
      setIsVisible(true);
    } else {
      // Pequeño delay para que la animación de salida sea visible
      const timer = setTimeout(() => setIsVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop oscuro cinematográfico */}
      <div
        className={`fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm transition-opacity duration-300 ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      />

      {/* Contenedor central */}
      <div
        className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center p-4 transition-all duration-300 ${
          isActive ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Spinner principal enormous */}
        <div className="relative">
          {/* Anillo externo pulsante */}
          <div className="absolute inset-0 rounded-full border-4 border-[#A3FF00] opacity-20 animate-pulse" />

          {/* Anillo rotativo */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#A3FF00] border-r-[#A3FF00] animate-spin" />

          {/* Spinner interior */}
          <div className="relative h-32 w-32 flex items-center justify-center">
            <Loader2 className="h-20 w-20 animate-spin text-[#A3FF00]" strokeWidth={2} />
          </div>
        </div>

        {/* Mensaje de estado */}
        <div className="mt-8 text-center space-y-3">
          <h2 className="text-2xl font-black uppercase tracking-wider text-white italic">
            {message}
          </h2>
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#A3FF00]/70">
            Procesando tu solicitud...
          </p>
        </div>

        {/* Línea de progreso animada */}
        <div className="mt-12 w-32 h-1 bg-white/10 rounded-full overflow-hidden border border-[#A3FF00]/30">
          <div
            className="h-full bg-gradient-to-r from-transparent via-[#A3FF00] to-transparent animate-pulse"
            style={{
              animation: "shimmer 2s infinite",
            }}
          />
        </div>

        {/* Texto pequeño de referencia */}
        <div className="mt-8 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
            NEO<span className="text-[#A3FF00]">.</span>SYSTEM
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}
