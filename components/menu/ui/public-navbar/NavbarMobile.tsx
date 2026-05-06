"use client";

import React from "react";
import Image from "next/image";
import { NavbarBrand } from "./NavbarBrand";
import { NavbarLocation } from "./NavbarLocation";
import { NavbarSchedule } from "./NavbarSchedule";
import { NavbarLogo } from "./NavbarLogo";

interface NavbarMobileProps {
  nombre: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  direccion: string | null;
  finalColor: string;
  horariosRaw: unknown;
}

export function NavbarMobile({
  nombre,
  logoUrl,
  bannerUrl,
  direccion,
  finalColor,
  horariosRaw,
}: NavbarMobileProps) {
  return (
    /* 🚀 CORREGIDO: El contenedor padre ya NO usa overflow-hidden global para evitar cortar el logo flotante */
    <div className="flex md:hidden w-full flex-col bg-[#EFEFEF] dark:bg-bg-darker border-2 border-border dark:border-border-dark rounded-super shadow-md relative">
      {/* 1. CONTENEDOR DEL BANNER 
         🚀 CORREGIDO: Le quitamos overflow-hidden acá para que el logo absoluto pueda renderizarse completo hacia afuera.
      */}
      <div className="relative h-32 bg-gray-300 dark:bg-black/20">
        {/* Envoltorio interno con overflow-hidden y bordes redondeados superiores exclusivamente para la foto del banner */}
        <div className="absolute inset-0 overflow-hidden rounded-t-[inherit]">
          {bannerUrl ? (
            <Image
              src={bannerUrl}
              alt={nombre}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div
              style={{ backgroundColor: `${finalColor}20` }}
              className="absolute inset-0"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        {/* 🟢 EL LOGO EN MOBILE: Ahora flota libre y entero porque ningún padre lo asfixia con un overflow */}
        <div className="absolute -bottom-6 left-6 z-20 scale-90 origin-bottom-left">
          <NavbarLogo nombre={nombre} logoUrl={logoUrl} color={finalColor} />
        </div>
      </div>

      {/* 2. CUERPO DE DATOS */}
      {/* Mantenemos pt-10 para dejarle el espacio físico al logo que bajó */}
      <div className="pt-10 pb-5 px-5 space-y-4">
        <div>
          <NavbarBrand nombre={nombre} logoUrl={logoUrl} color={finalColor} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-dashed border-border/80 dark:border-border-dark/80">
          <div className="flex items-center">
            <NavbarLocation direccion={direccion} color={finalColor} />
          </div>

          <div className="flex items-center justify-start sm:justify-end">
            <NavbarSchedule horariosRaw={horariosRaw} finalColor={finalColor} />
          </div>
        </div>
      </div>
    </div>
  );
}
