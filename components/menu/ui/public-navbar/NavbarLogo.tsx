"use client";

import React from "react";
import Image from "next/image";

interface NavbarLogoProps {
  nombre: string;
  logoUrl: string | null;
  color: string;
}

export function NavbarLogo({ nombre, logoUrl, color }: NavbarLogoProps) {
  return (
    <div className="relative h-24 w-24 lg:h-28 lg:w-28 rounded-full border-4 border-white bg-white shadow-xl flex-shrink-0 overflow-hidden flex items-center justify-center select-none z-20">
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt={`Logo de ${nombre}`}
          fill
          sizes="(max-width: 768px) 96px, 112px"
          priority
          className="object-cover"
        />
      ) : (
        /* Si no hay logo, ponemos las iniciales con el color de la marca */
        <div
          style={{ backgroundColor: color }}
          className="absolute inset-0 flex items-center justify-center font-sans font-black text-white text-3xl lg:text-4xl italic"
        >
          {nombre.substring(0, 2).toUpperCase()}
        </div>
      )}
    </div>
  );
}
