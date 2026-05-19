"use client";

import { useState } from "react";
import { ClientTable } from "./ClientTable";
import { Search, Users } from "lucide-react";

export interface ClienteResumen {
  id: string;
  nombre: string;
  telefono: string | null;
  email: string | null;
  totalGasto: number;
  pedidos: number;
  notas: string | null;
}

interface ClientRadarProps {
  initialClientes: ClienteResumen[];
}

export function ClientRadar({ initialClientes }: ClientRadarProps) {
  const [busqueda, setBusqueda] = useState("");

  const clientesFiltrados = initialClientes.filter(
    (c) =>
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (c.telefono && c.telefono.includes(busqueda)),
  );

  return (
    <div className="space-y-6">
      <div className="admin-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-[var(--admin-text)] flex items-center gap-2">
            <Users className="h-6 w-6 text-[var(--admin-accent)]" /> 
            Radar de Clientes
          </h2>
          <p className="text-sm text-[var(--admin-text-muted)] font-medium">
            Ranking de fidelidad, volumen de transacciones y notas.
          </p>
        </div>

        <div className="relative group w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o teléfono..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-lg py-2.5 pl-10 pr-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)] transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="admin-card !p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--admin-border)] flex justify-between items-center bg-gray-50/50">
          <span className="font-semibold text-gray-700">Listado de Clientes</span>
          <span className="text-xs font-semibold bg-[var(--admin-accent)]/10 text-[var(--admin-accent)] px-2.5 py-1 rounded-full">
            {clientesFiltrados.length} Registros
          </span>
        </div>
        <ClientTable clientes={clientesFiltrados} />
      </div>
    </div>
  );
}
