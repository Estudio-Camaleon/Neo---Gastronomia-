import { LoginForm } from "@/features/auth-portal/components/LoginForm";
import {
  ChefHat,
  Coffee,
  Handbag,
  ShoppingBasket,
  Library,
  Link,
} from "lucide-react";
import { TransitionLink } from "@/components/ui/transition-link";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 antialiased font-sans">
      <div className="flex-1 grid lg:grid-cols-12 overflow-hidden">
        {/* === SECCIÓN IZQUIERDA: HERO === */}
        <section className="hidden lg:flex lg:col-span-7 relative p-16 flex-col justify-between items-center overflow-hidden bg-white border-r border-gray-200">
          {/* Fondo Integrado Sutil */}
          <div className="absolute inset-0 z-0 opacity-10">
            <Image
              src="/Neo_portada.webp"
              alt="Fondo Neo"
              fill
              className="object-cover mix-blend-overlay"
            />
          </div>

          {/* Elementos Decorativos */}
          <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-gray-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse z-0" />
          <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-[#34a35f] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 z-0" />

          <div className="w-full text-left z-10">
            <TransitionLink
              href="/"
              className="inline-block transition-transform hover:scale-105"
            >
              <div className="relative h-12 w-32">
                <Image
                  src="/icons/neo_logo_negro.svg"
                  alt="NEO Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </TransitionLink>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center space-y-12 max-w-xl z-10 text-gray-900">
            <div className="space-y-6 text-center">
              <h1 className="text-5xl xl:text-7xl font-bold tracking-tight leading-tight">
                Potencia tu negocio <br />
                <span className="font-light italic text-[#34a35f]">
                  con NEO
                </span>
              </h1>
              <p className="text-gray-500 text-xl leading-relaxed max-w-md mx-auto">
                Gestión digital de vanguardia diseñada para la eficiencia
                absoluta de tu flujo operativo.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              {[
                { i: <ChefHat size={18} />, n: "Restaurante" },
                { i: <Coffee size={18} />, n: "Cafetería" },
                { i: <Handbag size={18} />, n: "Tienda" },
                { i: <ShoppingBasket size={18} />, n: "Súper" },
                { i: <Library size={18} />, n: "Librería" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-gray-100/50 backdrop-blur-sm px-4 py-2.5 rounded-full border border-gray-200 text-gray-900 shadow-sm"
                >
                  <span className="opacity-80 text-[#34a35f]">{item.i}</span>
                  <span className="text-sm font-semibold tracking-wide">
                    {item.n}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* === SECCIÓN DERECHA: FORMULARIO === */}
        <section className="col-span-12 lg:col-span-5 flex flex-col justify-center items-center p-8 md:p-16 relative bg-white">
          <div className="w-full max-w-md space-y-10 relative z-10">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                Bienvenido a <span className="text-[#34a35f]">NEO</span>
              </h2>
              <p className="text-gray-500 font-medium">
                Inicia sesión para administrar tu negocio
              </p>
            </div>

            <div className="w-full">
              <LoginForm />
            </div>

            <div className="flex items-center gap-4 py-2">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                o continuar con
              </span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3 px-6 border border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all text-gray-700 font-semibold shadow-sm hover:shadow"
            >
              <div className="relative h-5 w-5">
                <Image
                  src="/icons/google.svg"
                  alt="Google"
                  fill
                  className="object-contain"
                />
              </div>
              Continuar con Google
            </button>

            <div className="text-center">
              <p className="text-gray-500 text-sm">
                ¿No tienes una cuenta?
                <Link
                  href="/registro"
                  className="text-[#34a35f] font-semibold hover:underline ml-1"
                >
                  Regístrate
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
