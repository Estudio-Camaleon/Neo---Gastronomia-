"use client";

import { useState } from "react";
import { CategorySelect } from "../ui/CategorySelect"; // Ruta relativa ajustada quirúrgicamente
import { guardarProducto } from "@/app/actions/productos";
import { toast } from "sonner";
import { X, Loader2 } from "lucide-react";

interface ProductModalProps {
  negocioId: string;
  onClose: () => void;
}

export function ProductModal({ negocioId, onClose }: ProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [categoriaId, setCategoriaId] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    if (!categoriaId) {
      toast.error("Por favor, selecciona una categoría.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      // Armamos el objeto con las claves exactas sanitizadas
      const data = {
        nombre: (formData.get("nombre") as string).trim(),
        precio: formData.get("precio") as string,
        descripcion: (formData.get("descripcion") as string)?.trim() || null,
        imagen_url: null, // Inicialización controlada sin foto
        categoria_id: categoriaId,
        disponible: true,
      };

      const res = await guardarProducto(negocioId, data);

      if (res.success) {
        toast.success("¡Producto creado con éxito! 🍔");
        onClose();
      } else {
        toast.error(`Error: ${res.error}`);
      }
    } catch {
      toast.error("Ocurrió un error inesperado al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-bg-darker w-full max-w-md rounded-super border-2 border-border dark:border-border-dark shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Cabecera del Modal */}
        <div className="p-6 flex justify-between items-center border-b-2 border-border dark:border-border-dark">
          <h2 className="text-xl font-black text-text-primary dark:text-text-inverse uppercase tracking-tighter italic">
            Nuevo Producto
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-text-primary dark:text-text-inverse hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cuerpo del Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-black text-text-muted tracking-widest ml-1">
              Nombre del Producto
            </label>
            <input
              required
              name="nombre"
              type="text"
              disabled={loading}
              placeholder="Ej: Burger Triple Cheddar"
              className="w-full bg-gray-50 dark:bg-black/20 border-2 border-border dark:border-border-dark p-3 rounded-xl focus:border-primary text-text-primary dark:text-text-inverse outline-none transition-all font-bold placeholder:font-normal uppercase text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-black text-text-muted tracking-widest ml-1">
                Precio ($)
              </label>
              <input
                required
                name="precio"
                type="number"
                step="any"
                disabled={loading}
                placeholder="0.00"
                className="w-full bg-gray-50 dark:bg-black/20 border-2 border-border dark:border-border-dark p-3 rounded-xl focus:border-primary text-text-primary dark:text-text-inverse outline-none transition-all font-bold text-sm font-mono"
              />
            </div>

            {/* Inyección segura del selector restringido al contexto del local */}
            <CategorySelect
              negocioId={negocioId}
              selectedId={categoriaId}
              onChange={setCategoriaId}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-black text-text-muted tracking-widest ml-1">
              Descripción (Opcional)
            </label>
            <textarea
              name="descripcion"
              rows={2}
              disabled={loading}
              placeholder="Detalla los ingredientes..."
              className="w-full bg-gray-50 dark:bg-black/20 border-2 border-border dark:border-border-dark p-3 rounded-xl focus:border-primary text-text-primary dark:text-text-inverse outline-none transition-all font-medium text-sm"
            />
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-primary hover:opacity-90 text-white p-4 rounded-neo font-black uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 border-t border-white/10"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Sincronizando...
              </>
            ) : (
              "Crear Producto 🚀"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
