import { Loader2 } from "lucide-react";

type LoadingVariant = "root" | "admin" | "auth" | "public";

type LoadingScreenProps = {
  variant?: LoadingVariant;
};

const variantConfig: Record<LoadingVariant, { title: string; subtitle: string }> = {
  root: {
    title: "Preparando NEO",
    subtitle: "Ajustando la interfaz mientras se carga la siguiente vista.",
  },
  admin: {
    title: "Cargando panel de control",
    subtitle: "Sincronizando pedidos, catálogo y configuración del negocio.",
  },
  auth: {
    title: "Validando acceso",
    subtitle: "Comprobando credenciales y recuperando tu sesión.",
  },
  public: {
    title: "Construyendo el menú",
    subtitle: "Leyendo la identidad visual y el contenido disponible.",
  },
};

function SkeletonLine({ className }: { className: string }) {
  return <div className={`neo-loading-shimmer ${className}`} />;
}

function SkeletonCard({ compact = false }: { compact?: boolean }) {
  return (
    <div className="rounded-3xl border-4 border-black bg-white p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <SkeletonLine className="h-5 w-28 rounded-full" />
      <SkeletonLine className={`mt-4 ${compact ? "h-24" : "h-32"} w-full rounded-2xl`} />
      <div className="mt-4 grid grid-cols-3 gap-3">
        <SkeletonLine className="h-3 rounded-full" />
        <SkeletonLine className="h-3 rounded-full" />
        <SkeletonLine className="h-3 rounded-full" />
      </div>
    </div>
  );
}

export function LoadingScreen({ variant = "root" }: LoadingScreenProps) {
  const config = variantConfig[variant];

  if (variant === "auth") {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(163,255,0,0.24),_transparent_35%),linear-gradient(180deg,#f8f8f8_0%,#ececec_100%)] text-black">
        <div className="absolute inset-0 neo-loading-grid opacity-30" />
        <div className="relative flex min-h-screen items-center justify-center p-6">
          <div className="w-full max-w-md rounded-[2rem] border-4 border-black bg-white/95 p-6 shadow-[14px_14px_0px_0px_rgba(0,0,0,1)] backdrop-blur-sm sm:p-8">
            <div className="flex items-center gap-3">
              <div className="neo-loading-breathe flex h-12 w-12 items-center justify-center rounded-2xl border-4 border-black bg-[#A3FF00]">
                <Loader2 className="h-6 w-6 animate-spin" strokeWidth={3} />
              </div>
              <div className="min-w-0">
                <SkeletonLine className="h-4 w-24 rounded-full" />
                <SkeletonLine className="mt-2 h-8 w-44 max-w-full rounded-full" />
              </div>
            </div>

            <p className="mt-5 max-w-sm text-sm font-medium leading-6 text-black/70">
              {config.subtitle}
            </p>

            <div className="mt-8 space-y-4">
              <SkeletonLine className="h-4 w-28 rounded-full" />
              <SkeletonLine className="h-14 w-full rounded-2xl" />
              <SkeletonLine className="h-4 w-24 rounded-full" />
              <SkeletonLine className="h-14 w-full rounded-2xl" />
              <SkeletonLine className="h-14 w-full rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(163,255,0,0.18),_transparent_30%),linear-gradient(180deg,#ffffff_0%,#f4f4f4_100%)] text-black">
      <div className="absolute inset-0 neo-loading-grid opacity-25" />
      <div className="absolute inset-x-0 top-0 h-1 bg-black/10">
        <div className="neo-loading-shimmer h-full w-1/2 bg-black/60" />
      </div>

      <main className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center gap-8 p-5 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-black/50">
              <span className="h-3 w-3 rounded-full bg-[#A3FF00] shadow-[0_0_0_4px_rgba(163,255,0,0.15)]" />
              {config.title}
            </div>
            <SkeletonLine className="h-10 w-full max-w-xl rounded-[1.5rem]" />
            <SkeletonLine className="h-5 w-full max-w-2xl rounded-full" />
          </div>

          <div className="flex items-center gap-3 self-start rounded-full border-4 border-black bg-white px-4 py-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <Loader2 className="h-5 w-5 animate-spin" strokeWidth={3} />
            <span className="text-xs font-black uppercase tracking-[0.25em]">Cargando</span>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard compact />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-3xl border-4 border-black bg-white p-5 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
              <SkeletonLine className="h-5 w-40 rounded-full" />
              <div className="mt-5 grid gap-3">
                <SkeletonLine className="h-12 rounded-2xl" />
                <SkeletonLine className="h-12 rounded-2xl" />
                <SkeletonLine className="h-12 rounded-2xl" />
              </div>
            </div>

            <div className="rounded-3xl border-4 border-black bg-[#A3FF00] p-5 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
              <SkeletonLine className="h-4 w-24 rounded-full bg-black/15" />
              <SkeletonLine className="mt-4 h-9 w-4/5 rounded-full bg-black/15" />
              <SkeletonLine className="mt-6 h-24 rounded-2xl bg-black/15" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}