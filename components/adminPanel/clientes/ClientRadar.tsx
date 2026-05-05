"use client";

import { useState } from "react";
import { ClientTable } from "./ui/ClientTable";
import { Search } from "lucide-react";

interface ClienteResumen {
  nombre: string;
  totalGasto: number;
  pedidos: number;
}

interface ClientRadarProps {
  initialClientes: ClienteResumen[];
}

export function ClientRadar({ initialClientes }: ClientRadarProps) {
  const [busqueda, setBusqueda] = useState("");

  // Filtro de búsqueda reactivo sobre la lista procesada
  const clientesFiltrados = initialClientes.filter((c) =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Barra de Filtros y Búsqueda Interactiva */}
      <div className="flex max-w-md bg-white dark:bg-bg-darker rounded-neo border-2 border-border dark:border-border-dark overflow-hidden transition-all focus-within:border-primary">
        <div className="p-4 flex items-center justify-center text-text-muted">
          <Search size={18} />
        </div>
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar cliente por nombre o apodo..."
          className="w-full bg-transparent p-4 pl-0 text-xs font-bold uppercase italic outline-none text-text-primary dark:text-text-inverse placeholder:normal-case placeholder:font-normal"
        />
      </div>

      {/* Inyección de la tabla de datos */}
      <ClientTable clientes={clientesFiltrados} />
    </div>
  );
}