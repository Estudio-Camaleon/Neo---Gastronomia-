"use client";

import React from "react";

interface NavbarBrandProps {
  nombre: string;
  logoUrl: string | null; // 🚀 RE-AGREGADO: Declaramos la propiedad para fulminar el error en rojo
  color: string;
}

export function NavbarBrand({ nombre, color }: NavbarBrandProps) {
  return (
    <div className="flex-1 min-w-0 pr-4">
      {/* TÍTULO PRINCIPAL (Estilo exacto de tu mockup) */}
      <h1
        style={{ color }}
        className="font-sans font-black uppercase italic text-4xl lg:text-5xl tracking-tighter leading-none whitespace-nowrap truncate"
      >
        {nombre}
      </h1>

      {/* SUBTÍTULO NEO-BRUTALISTA */}
      <div className="bg-white text-black font-sans font-black uppercase italic text-[11px] lg:text-xs tracking-wider px-3 lg:px-4 py-1.5 rounded-md border border-black mt-2 max-w-max shadow-sm select-none">
        ABIERTO AHORA • PEDÍ POR WP 🟢
      </div>
    </div>
  );
}
