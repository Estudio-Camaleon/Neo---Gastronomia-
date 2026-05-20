import { RegisterForm } from "@/features/auth-portal/components/RegisterForm";
import { Sparkles, Smartphone, LayoutDashboard } from "lucide-react";
import { TransitionLink } from "@/components/ui/transition-link";
import Image from "next/image";
// IMPORTAMOS EL CSS DEL ADMIN PANEL
import "@/app/(adminPanel)/style/admin-panel.css";

export default function RegisterPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--admin-bg)] text-[var(--admin-text)] antialiased font-sans">
      <div className="flex-1 grid lg:grid-cols-12 overflow-hidden">
        {/* === SECCIÓN IZQUIERDA: HERO DE BENEFICIOS === */}
        <section className="hidden lg:flex lg:col-span-7 bg-[var(--admin-surface)] relative p-16 flex-col justify-between items-center text-center overflow-hidden border-r border-[var(--admin-border)]">
          
          {/* Elementos Decorativos */}
          <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[var(--admin-accent)] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse z-0" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[var(--admin-border)] rounded-full mix-blend-multiply filter blur-[120px] opacity-40 z-0" />

          {/* Logo Superior */}
          <div className="w-full text-left z-10">
            <TransitionLink
              href="/"
              className="inline-block transition-transform hover:scale-105 active:scale-95"
            >
              <div className="relative h-10 w-32">
                <Image
                  src="/icons/neo_logo_negro.svg"
                  alt="NEO Logo"
                  fill
                  priority 
                  sizes="128px"
                  className="object-contain"
                />
              </div>
            </TransitionLink>
          </div>

          {/* Contenido Central */}
          <div className="flex-1 flex flex-col items-center justify-center space-y-12 max-w-xl z-10">
            <div className="space-y-6">
              <h1 className="text-5xl xl:text-6xl font-bold text-[var(--admin-text)] tracking-tight leading-tight">
                Tu menú digital <br />
                <span className="text-[var(--admin-accent)] font-light italic">en 5 minutos</span>
              </h1>
              <p className="text-[var(--admin-text-muted)] text-lg leading-relaxed max-w-md mx-auto font-medium">
                Únete a los negocios que ya están vendiendo de forma inteligente con NEO.
              </p>
            </div>

            {/* Tarjetas de Beneficios */}
            <div className="grid gap-4 w-full">
              {[
                {
                  icon: <Sparkles className="w-5 h-5" />,
                  text: "Sin comisiones por pedido",
                },
                {
                  icon: <Smartphone className="w-5 h-5" />,
                  text: "Optimizado para móviles",
                },
                {
                  icon: <LayoutDashboard className="w-5 h-5" />,
                  text: "Panel de gestión intuitivo",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="admin-card flex items-center gap-4 !p-5 group hover:border-[var(--admin-accent)]/50 cursor-default"
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[var(--admin-surface-accent)]/50 text-[var(--admin-accent)] group-hover:bg-[var(--admin-accent)] group-hover:text-white transition-colors duration-300">
                    {item.icon}
                  </div>
                  <span className="font-semibold text-[var(--admin-text)] text-sm">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* === SECCIÓN DERECHA: FORMULARIO DE REGISTRO === */}
        <section className="col-span-12 lg:col-span-5 flex flex-col justify-center items-center p-6 md:p-12 xl:p-20 relative bg-[var(--admin-surface)]">
          <div className="w-full max-w-md space-y-10 z-10">
            {/* Header del Formulario */}
            <div className="text-center lg:text-left space-y-3">
              <h2 className="text-3xl font-bold text-[var(--admin-text)] tracking-tight">
                Crea tu <span className="text-[var(--admin-accent)]">cuenta</span>
              </h2>
              <p className="text-[var(--admin-text-muted)] text-sm font-medium">
                Completa los datos para empezar tu transformación digital.
              </p>
            </div>

            <div className="admin-card !shadow-none !border-none !bg-transparent !p-0">
              <RegisterForm />
            </div>

            <div className="text-center lg:text-left pt-2">
              <p className="text-[var(--admin-text-muted)] text-sm font-medium">
                ¿Ya tienes una cuenta?{" "}
                <TransitionLink
                  href="/login"
                  className="text-[var(--admin-accent)] font-semibold hover:underline transition-colors ml-1 inline-block"
                >
                  Inicia sesión
                </TransitionLink>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
