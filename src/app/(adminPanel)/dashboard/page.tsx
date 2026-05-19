import { createClient } from "@/core/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { ShoppingBag, Users, TrendingUp, Package } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Obtener contexto del negocio (asumiendo función de utilidad o query directa)
  const { data: negocio } = await supabase
    .from("negocios")
    .select("id, nombre")
    .eq("user_id", user.id)
    .single();

  if (!negocio) redirect("/configuracion");

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard: {negocio.nombre}</h1>

      {/* Grid de KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPIWidget title="Pedidos Hoy" value="12" icon={<ShoppingBag />} />
        <KPIWidget title="Ventas" value="$45.000" icon={<TrendingUp />} />
        <KPIWidget title="Clientes" value="142" icon={<Users />} />
        <KPIWidget title="Productos" value="34" icon={<Package />} />
      </div>

      {/* Quick Actions (Navegación) */}
      <div className="border-2 border-black p-6 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-xl font-bold mb-4">Acceso Rápido</h2>
        <div className="flex gap-4">
          <a
            href="/productos"
            className="bg-green-500 p-4 font-bold border-2 border-black hover:translate-y-[-2px] transition-all"
          >
            Gestionar Menú
          </a>
          <a
            href="/pedidos"
            className="bg-yellow-400 p-4 font-bold border-2 border-black hover:translate-y-[-2px] transition-all"
          >
            Ver Pedidos
          </a>
        </div>
      </div>
    </div>
  );
}

function KPIWidget({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="p-4 border-2 border-black flex items-center justify-between">
      <div>
        <p className="text-sm opacity-70">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className="p-2 bg-gray-100 rounded-full">{icon}</div>
    </Card>
  );
}
