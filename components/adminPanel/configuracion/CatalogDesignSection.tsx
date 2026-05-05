"use client";

import { Palette } from "lucide-react";

interface CatalogDesignSectionProps {
  colorPrimario: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CatalogDesignSection({
  colorPrimario,
  onChange,
}: CatalogDesignSectionProps) {
  return (
    <section className="bg-white dark:bg-bg-darker border-2 border-border rounded-super p-8 space-y-8 shadow-sm">
      <div className="flex items-center gap-3">
        <Palette className="text-primary w-5 h-5" />
        <h2 className="font-black uppercase italic tracking-tight text-lg">
          Diseño de Catálogo
        </h2>
      </div>

      <div className="flex flex-col items-start gap-4">
        <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">
          Color de Identidad (Acentos)
        </label>
        <div className="flex items-center gap-6">
          <input
            type="color"
            name="color_primario"
            value={colorPrimario}
            onChange={onChange}
            className="w-20 h-20 rounded-full border-4 border-white shadow-xl cursor-pointer"
          />
          <div className="space-y-1">
            <span className="font-mono text-xs font-black uppercase bg-bg-main px-4 py-2 rounded-neo border border-border">
              {colorPrimario}
            </span>
            <p className="text-[9px] font-bold text-text-muted uppercase italic mt-2">
              Este tono se aplicará a botones y elementos interactivos públicos.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
