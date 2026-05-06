"use client";

import React from "react";
import { NavbarDesktop } from "./NavbarDesktop";
import { NavbarMobile } from "./NavbarMobile";

interface PublicNavbarProps {
  nombre: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  direccion: string | null;
  colorConfig: string;
  horariosRaw: unknown; // Única prop necesaria para el cronograma
}

export function PublicNavbar({
  nombre,
  logoUrl,
  bannerUrl,
  direccion,
  colorConfig,
  horariosRaw,
}: PublicNavbarProps) {
  const finalColor =
    !colorConfig || colorConfig === "#000000" ? "#1c7a42" : colorConfig;

  return (
    <header className="w-full font-sans select-none mb-8">
      {/* VISTA DESKTOP & TABLET */}
      <NavbarDesktop
        nombre={nombre}
        logoUrl={logoUrl}
        bannerUrl={bannerUrl}
        direccion={direccion}
        finalColor={finalColor}
        horariosRaw={horariosRaw}
      />

      {/* VISTA MOBILE */}
      <NavbarMobile
        nombre={nombre}
        logoUrl={logoUrl}
        bannerUrl={bannerUrl}
        direccion={direccion}
        finalColor={finalColor}
        horariosRaw={horariosRaw}
      />
    </header>
  );
}
