"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/core/lib/supabase/client";
import { Loader2 } from "lucide-react";

interface Categoria {
  id: string;
  nombre: string;
}

interface CategorySelectProps {
  negocioId?: string;
  selectedId?: string;
  onChange: (id: string) => void;
}

export function CategorySelect({
  negocioId,
  selectedId,
  onChange,
}: CategorySelectProps) {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function cargarCategorias() {
      try {
        let consulta = supabase
          .from("categorias")
          .select("id, nombre")
          .order("nombre", { ascending: true });

        if (negocioId) {
          consulta = consulta.eq("negocio_id", negocioId);
        }

        const { data, error } = await consulta;
        if (error) throw error;
        setCategorias(data || []);
      } catch (err) {
        console.error("Fallo de lectura en categorías del local:", err);
      } finally {
        setLoading(false);
      }
    }

    cargarCategorias();
  }, [negocioId, supabase]);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-sm font-medium text-gray-700">
        Categoría
      </label>
      <div className="relative w-full">
        <select
          value={selectedId}
          onChange={(e) => onChange(e.target.value)}
          disabled={loading}
          className="w-full bg-white border border-gray-300 p-2.5 pr-10 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)] transition-all disabled:opacity-50 disabled:bg-gray-50 appearance-none"
          style={{
            backgroundImage:
              'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%236b7280%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e")',
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 0.75rem center",
            backgroundSize: "1rem",
          }}
        >
          <option value="" className="text-gray-500">
            {loading ? "Cargando secciones..." : "Seleccionar sección..."}
          </option>
          {categorias.map((cat) => (
            <option
              key={cat.id}
              value={cat.id}
              className="text-gray-900"
            >
              {cat.nombre}
            </option>
          ))}
        </select>
        
        {loading && (
          <div className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400">
            <Loader2 size={14} className="animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
