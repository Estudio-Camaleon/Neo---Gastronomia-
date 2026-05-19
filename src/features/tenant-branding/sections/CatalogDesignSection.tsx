"use client";

import { Palette, Info } from "lucide-react";

interface CatalogDesignSectionProps {
  colorPrimary: string;
  onChange: (_val: string) => void;
}

const PRESET_COLORS = [
  "#34a35f", // Admin Accent (Verde Neo)
  "#145a30", // Verde Oscuro
  "#e3342f", // Rojo
  "#3b82f6", // Azul
  "#8b5cf6", // Azul Claro
  "#f59e0b", // Naranja
  "#000000", // Negro
];

export function CatalogDesignSection({
  colorPrimary,
  onChange,
}: CatalogDesignSectionProps) {
  return (
    <div className="admin-card h-full flex flex-col justify-between">
      <div className="space-y-5">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-2">
          <Palette size={18} className="text-[var(--admin-accent)]" />
          <h2 className="font-semibold text-gray-900">
            Diseño del Catálogo
          </h2>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative shrink-0 flex items-center justify-center">
              <div 
                className="w-12 h-12 rounded-full shadow-inner border border-gray-200 overflow-hidden relative cursor-pointer group"
                style={{ backgroundColor: colorPrimary }}
              >
                <input
                  type="color"
                  value={colorPrimary}
                  onChange={(e) => onChange(e.target.value)}
                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                />
              </div>
            </div>
            <div className="flex-1 space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                Color de Acento (HEX)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={colorPrimary}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-32 p-2 bg-white border border-gray-300 rounded-md font-mono text-sm uppercase text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]"
                  maxLength={7}
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
               Colores Sugeridos
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => onChange(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${colorPrimary.toLowerCase() === color.toLowerCase() ? 'border-gray-900 scale-110 shadow-sm' : 'border-transparent hover:scale-105'}`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3 flex gap-2 mt-6">
        <Info size={16} className="shrink-0 text-blue-500 mt-0.5" />
        <p className="text-xs text-blue-800 leading-relaxed">
          Este color se aplicará en los botones principales de compra, el carrito flotante, los badges de ofertas y detalles visuales del catálogo público para que coincida con tu identidad de marca.
        </p>
      </div>
    </div>
  );
}
