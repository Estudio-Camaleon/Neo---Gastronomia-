"use client";

import { useState } from "react";
import { Plus, FolderPlus } from "lucide-react";
import { ProductModal } from "./modals/ProductModal";
import { CategoriaManager } from "./modals/CategoriaManager";
import { ProductTable } from "./ui/ProductTable"; // Importación unificada en la subcarpeta UI

interface AddProductSectionProps {
  negocioId: string;
}

export function AddProductSection({ negocioId }: AddProductSectionProps) {
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* barra de Acciones Superiores Estilo NEO */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-bg-darker p-4 rounded-super border-2 border-border dark:border-border-dark shadow-sm">
        <div className="flex flex-col">
          <h1 className="text-xl font-black uppercase italic tracking-tight text-text-primary dark:text-text-inverse">
            Gestión de Inventario
          </h1>
          <p className="text-xs text-text-muted font-mono">
            Administrá tus artículos, precios y categorías en tiempo real.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Botón Gestor de Categorías */}
          <button
            type="button"
            onClick={() => setIsCategoryOpen(true)}
            className="bg-white dark:bg-bg-dark border-2 border-border dark:border-border-dark text-text-primary dark:text-text-inverse px-5 py-3 rounded-neo text-xs font-black uppercase tracking-widest hover:border-primary hover:text-primary dark:hover:text-primary transition-all active:scale-95 flex items-center gap-2"
          >
            <FolderPlus size={16} />
            Categorías
          </button>

          {/* Botón Nuevo Producto */}
          <button
            type="button"
            onClick={() => setIsProductOpen(true)}
            className="bg-primary text-white px-5 py-3 rounded-neo text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 border-t border-white/10"
          >
            <Plus size={16} strokeWidth={3} />
            Nuevo Producto
          </button>
        </div>
      </div>

      {/* Tabla de Productos Integrada */}
      <div className="bg-white dark:bg-bg-darker rounded-super border-2 border-border dark:border-border-dark overflow-hidden shadow-sm">
        <ProductTable negocioId={negocioId} />
      </div>

      {/* Modales Flotantes Controlados */}
      {isProductOpen && (
        <ProductModal
          negocioId={negocioId}
          onClose={() => setIsProductOpen(false)}
        />
      )}

      {isCategoryOpen && (
        <CategoriaManager
          negocioId={negocioId}
          onClose={() => setIsCategoryOpen(false)}
        />
      )}
    </div>
  );
}
