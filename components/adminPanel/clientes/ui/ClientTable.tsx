"use client";

import { Users, TrendingUp, ShoppingBag } from "lucide-react";

interface ClienteResumen {
  nombre: string;
  totalGasto: number;
  pedidos: number;
}

interface ClientTableProps {
  clientes: ClienteResumen[];
}

export function ClientTable({ clientes }: ClientTableProps) {
  return (
    <div className="bg-white dark:bg-bg-darker rounded-super border-2 border-border dark:border-border-dark overflow-hidden shadow-sm animate-in fade-in duration-300">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 dark:bg-white/5 text-text-muted text-[10px] uppercase font-black tracking-widest border-b-2 border-border dark:border-border-dark font-mono">
            <tr>
              <th className="p-5">
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-primary" /> Cliente
                </div>
              </th>
              <th className="p-5">
                <div className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-primary" /> Inversión
                  Total
                </div>
              </th>
              <th className="p-5">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={14} className="text-primary" /> Frecuencia
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-border dark:divide-border-dark">
            {clientes.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="p-16 text-center text-text-muted font-bold italic uppercase text-xs"
                >
                  Aún no hay interacciones registradas en el radar.
                </td>
              </tr>
            ) : (
              clientes.map((cliente) => (
                <tr
                  key={cliente.nombre}
                  className="group hover:bg-primary/5 transition-colors duration-200"
                >
                  <td className="p-5 font-black text-text-primary dark:text-text-inverse uppercase tracking-tight italic text-sm">
                    {cliente.nombre}
                  </td>
                  <td className="p-5 font-mono font-bold text-text-primary dark:text-text-inverse text-lg">
                    $
                    {cliente.totalGasto.toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="p-5">
                    <span className="bg-gray-100 dark:bg-white/10 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-text-primary dark:text-text-inverse border border-border dark:border-border-dark">
                      {cliente.pedidos}{" "}
                      {cliente.pedidos === 1 ? "Pedido" : "Pedidos"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
