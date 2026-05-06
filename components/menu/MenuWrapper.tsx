"use client";

import { MenuUnifiedView } from "./layout/MenuUnifiedView";
import React from "react";

interface Producto {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  imagen_url: string | null;
  disponible: boolean;
}

interface CategoriaConProductos {
  id: string;
  nombre: string;
  slug: string;
  productos: Producto[];
}

interface MenuWrapperProps {
  negocioId: string;
  categorias: CategoriaConProductos[];
  colorConfig: string;
}

export function MenuWrapper({
  negocioId,
  categorias,
  colorConfig,
}: MenuWrapperProps) {
  const finalColor =
    !colorConfig || colorConfig === "#000000" ? "#1c7a42" : colorConfig;

  // 🔍 LOG EN CLIENTE 1: Wrapper Maatriz
  console.log("=== 🚀 CLIENT LOG: MENU WRAPPER ===");
  console.log("Color prop recibido del Server:", colorConfig);
  console.log("Color final procesado en Wrapper:", finalColor);
  console.log("====================================");

  return (
    <div
      style={
        {
          "--custom-brand-color": finalColor,
          "--color-custom": finalColor,
        } as React.CSSProperties
      }
      className="w-full text-custom"
    >
      <MenuUnifiedView
        negocioId={negocioId}
        categorias={categorias}
        colorConfig={finalColor}
      />
    </div>
  );
}
