"use client";

import React from "react";
import Image from "next/image";
import { NavbarBrand } from "./NavbarBrand";
import { NavbarLocation } from "./NavbarLocation";
import { NavbarSchedule } from "./NavbarSchedule";
import { NavbarLogo } from "./NavbarLogo";

interface NavbarDesktopProps {
  nombre: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  direccion: string | null;
  finalColor: string;
  horariosRaw: unknown;
}

export function NavbarDesktop({
  nombre,
  logoUrl,
  bannerUrl,
  direccion,
  finalColor,
  horariosRaw,
}: NavbarDesktopProps) {
  return (
    /* 🚀 ADAPTACIÓN TABLET:
       - md:padding-derecho chico (pr-6) para tablets, lg:padding normal (pr-12) para monitores.
       - Items en flex con gap dinámico (gap-4 en tablet, gap-8/12 en pantallas grandes).
    */
    <div className="hidden md:flex w-full items-center justify-between min-h-[180px] pr-6 lg:pr-12 relative bg-bg-main dark:bg-bg-dark transition-all">
      {/* LADO IZQUIERDO: Tarjeta de la Marca con el Banner 
         🚀 ADAPTACIÓN TABLET:
         - En Tablets (md:) ocupa el 65% del ancho para darle aire al título largo.
         - En Monitores (lg:) vuelve al 55% para dejarle protagonismo a la metadata de la derecha.
         - El rounded-br se ajusta sutilmente.
      */}
      <div className="relative z-10 w-[65%] lg:w-[55%] h-[180px] flex items-center pl-8 lg:pl-12 pr-16 lg:pr-20 bg-gray-200 dark:bg-bg-darker border-b-4 border-r-4 border-border dark:border-border-dark rounded-br-[45px] lg:rounded-br-[60px] shadow-lg overflow-hidden">
        {bannerUrl ? (
          <Image
            src={bannerUrl}
            alt={`Banner de ${nombre}`}
            fill
            priority
            sizes="(max-width: 1024px) 70vw, 50vw"
            className="object-cover pointer-events-none"
          />
        ) : (
          <div
            style={{ backgroundColor: `${finalColor}15` }}
            className="absolute inset-0"
          />
        )}

        {/* Capa de contraste oscura encima del banner */}
        <div className="absolute inset-0 bg-black/35 z-0" />

        {/* Título de la marca */}
        <div className="relative z-10 flex items-center w-full justify-between">
          <NavbarBrand nombre={nombre} logoUrl={logoUrl} color="#FFFFFF" />
        </div>

        {/* El Logo: 
           🚀 ADAPTACIÓN TABLET:
           - Se mueve un poco usando right-10 en tablets (md:) para que no quede flotando afuera del corte.
           - En pantallas grandes (lg:) recupera el right-20 original del mockup.
        */}
        <div className="absolute right-10 lg:right-20 top-1/2 -translate-y-1/2 z-20">
          <NavbarLogo nombre={nombre} logoUrl={logoUrl} color={finalColor} />
        </div>
      </div>

      {/* LADO DERECHO: Metadata Táctica (Ubicación y Reloj)
         🚀 ADAPTACIÓN TABLET:
         - Agregamos gap-4 en tablets para que los bloques no se pisen.
         - Reducimos el padding izquierdo (pl-4) para aprovechar cada píxel disponible.
      */}
      <div className="flex items-center gap-4 lg:gap-12 flex-1 justify-end pl-4 lg:pl-16">
        <NavbarLocation direccion={direccion} color={finalColor} />
        <NavbarSchedule horariosRaw={horariosRaw} finalColor={finalColor} />
      </div>
    </div>
  );
}
