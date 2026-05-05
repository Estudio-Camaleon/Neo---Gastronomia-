"use client";

import { MenuCard } from "./MenuCard";
import { PublicCart } from "./PublicCart";

// Interfaces estrictas locales para erradicar los 'any' por completo
interface ProductoMenu {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  imagen_url: string | null;
}

interface CategoriaConProductos {
  id: string;
  nombre: string;
  slug: string;
  productos: ProductoMenu[];
}

interface MenuContentProps {
  negocioId: string;
  categorias: CategoriaConProductos[];
}

export function MenuContent({ negocioId, categorias }: MenuContentProps) {
  return (
    <div className="space-y-12">
      {categorias.map((cat: CategoriaConProductos) => (
        <section key={cat.id} className="animate-in fade-in duration-500">
          <h2 className="text-2xl font-black uppercase italic mb-6 border-l-4 border-primary pl-4 tracking-tight">
            {cat.nombre}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cat.productos.map((prod: ProductoMenu) => (
              <MenuCard key={prod.id} producto={prod} />
            ))}
          </div>
        </section>
      ))}
      {/* El carrito flotante se queda al final */}
      <PublicCart negocioId={negocioId} />
    </div>
  );
}
