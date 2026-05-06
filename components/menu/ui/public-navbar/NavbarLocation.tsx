"use client";

import React from "react";
import { MapPin, ChevronDown } from "lucide-react";

interface NavbarLocationProps {
  direccion: string | null;
  color: string;
}

export function NavbarLocation({ direccion, color }: NavbarLocationProps) {
  return (
    <div className="flex items-center gap-3">
      {/* Icono encastrado */}
      <div className="p-2 rounded-xl bg-white dark:bg-white/5 border-2 border-border dark:border-border-dark shadow-xs flex-shrink-0">
        <MapPin style={{ stroke: color }} size={20} strokeWidth={2.5} />
      </div>

      {/* Metadata */}
      <div className="flex flex-col min-w-0">
        <button
          type="button"
          className="flex items-center gap-1 font-sans font-black uppercase italic text-xs lg:text-sm tracking-tight text-text-primary dark:text-text-inverse hover:opacity-80 transition-all cursor-pointer text-left"
        >
          Sucursal Centro{" "}
          <ChevronDown
            size={14}
            strokeWidth={3}
            className="text-text-muted flex-shrink-0"
          />
        </button>
        <p className="text-[11px] lg:text-xs font-bold text-text-secondary dark:text-text-muted truncate mt-0.5">
          {direccion || "Dirección no especificada"}
        </p>
      </div>
    </div>
  );
}
