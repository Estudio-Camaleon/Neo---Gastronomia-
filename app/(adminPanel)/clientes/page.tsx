import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Users } from "lucide-react";
import { ClientRadar } from "@/components/adminPanel/clientes/ClientRadar"; // Orquestador unificado

interface ClienteResumen {
  nombre: string;
  totalGasto: number;
  pedidos: number;
}

export default async function ClientesPage() {
  const supabase = await createClient();

  // Verificación estricta de sesión activa
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Obtención del contexto comercial del inquilino
  const { data: negocio } = await supabase
    .from("negocios")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!negocio) {
    return (
      <div className="p-12 text-center font-sans">
        <h2 className="text-xl font-black uppercase italic text-primary">
          Negocio no configurado
        </h2>
      </div>
    );
  }

  // Traemos los campos exactos requeridos de la tabla transaccional
  const { data: pedidos } = await supabase
    .from("pedidos")
    .select("cliente_nombre, total")
    .eq("negocio_id", negocio.id);

  // Agrupamiento analítico optimizado en el servidor
  const resumenClientes = (pedidos || []).reduce(
    (acc: Record<string, ClienteResumen>, pedido) => {
      const nombre = pedido.cliente_nombre?.trim() || "Consumidor Final";

      if (!acc[nombre]) {
        acc[nombre] = { nombre, totalGasto: 0, pedidos: 0 };
      }

      acc[nombre].totalGasto += Number(pedido.total || 0);
      acc[nombre].pedidos += 1;
      return acc;
    },
    {},
  );

  // Ordenamiento de mayor a menor inversión
  const listaClientes: ClienteResumen[] = Object.values(resumenClientes).sort(
    (a, b) => b.totalGasto - a.totalGasto,
  );

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen pb-32 font-sans space-y-10">
      {/* Cabecera Estética de Operaciones */}
      <header className="animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-2 mb-2">
          <Users className="text-primary w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">
            Community Analytics
          </span>
        </div>
        <h1 className="text-5xl font-black text-text-primary dark:text-text-inverse uppercase tracking-tighter italic leading-none">
          Tu Comunidad
        </h1>
        <p className="text-text-muted text-xs font-bold uppercase tracking-widest mt-2">
          Análisis de fidelidad y comportamiento de compra histórico
        </p>
      </header>

      {/* Renderizado de la sección interactiva */}
      <main className="animate-in fade-in duration-500 delay-150">
        <ClientRadar initialClientes={listaClientes} />
      </main>
    </div>
  );
}
