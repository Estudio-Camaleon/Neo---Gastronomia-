"use client";

import { MenuCard } from "./MenuCard";
import { PublicCart } from "./PublicCart";

export function MenuContent({
  negocioId,
  categorias,
}: {
  negocioId: string;
  categorias: any[];
}) {
  return (
    <div className="space-y-12">
      {categorias.map((cat) => (
        <section key={cat.id}>
          <h2 className="text-2xl font-black uppercase italic mb-6 border-l-4 border-primary pl-4">
            {cat.nombre}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cat.productos.map((prod: any) => (
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
