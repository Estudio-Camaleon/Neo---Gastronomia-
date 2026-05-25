"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Search,
  Smartphone,
  Plus,
  Minus,
  Image as ImageIcon,
  Clock,
  MapPin,
  ChevronDown,
} from "lucide-react";
import { useCartStore } from "@/features/public-menu/cart/useCartStore";
import { CartFloatingButton } from "@/features/public-menu/cart/CartFloatingButton";
import { PublicCart } from "@/features/public-menu/cart/PublicCart";

// 1. Exportamos los tipos para que page.tsx pueda consumirlos
export interface Producto {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  imagen_url: string | null;
  disponible: boolean;
}

export interface Categoria {
  id: string;
  nombre: string;
  slug: string;
  productos: Producto[];
}

export interface Turno {
  inicio: string;
  fin: string;
}

export interface HorarioDia {
  turnos: Turno[];
}

// Interfaz estricta para el negocio en la vista pública
export interface NegocioPublico {
  id: string;
  nombre: string;
  slug: string;
  color_primary: string | null;
  banner_url: string | null;
  logo_url: string | null;
  direccion: string | null;
  localidad: string | null;
  direccion_notas: string | null;
  whatsapp: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  tiktok_url: string | null;
  horarios: Record<string, HorarioDia> | null;
}

interface CatalogClientProps {
  negocio: NegocioPublico;
  categorias: Categoria[];
}

export function CatalogClient({ negocio, categorias }: CatalogClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cart = useCartStore((state) => state.cart);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);

  const cartQuantityByProduct = useMemo(() => {
    const map = new Map<string, number>();
    cart.forEach((item) => {
      const current = map.get(item.producto_id) || 0;
      map.set(item.producto_id, current + item.cantidad);
    });
    return map;
  }, [cart]);

  // Filtrado reactivo
  const categoriasFiltradas = useMemo(() => {
    if (!searchQuery.trim()) {
      if (activeCategory === "all") return categorias;
      return categorias.filter((c) => c.id === activeCategory);
    }
    const query = searchQuery.toLowerCase();
    return categorias
      .map((cat) => ({
        ...cat,
        productos: cat.productos.filter(
          (p) =>
            p.nombre.toLowerCase().includes(query) ||
            (p.descripcion && p.descripcion.toLowerCase().includes(query)),
        ),
      }))
      .filter((cat) => cat.productos.length > 0);
  }, [categorias, searchQuery, activeCategory]);

  const scrollToCategory = (id: string) => {
    setActiveCategory(id);
    if (id !== "all") {
      const element = document.getElementById(`cat-${id}`);
      if (element) {
        const y = element.getBoundingClientRect().top + window.scrollY - 140;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  };

  const diasOrdenados = [
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado",
    "domingo",
  ];

  const menuConfig = {
    moneda_simbolo: "$",
    pedido_minimo: 0,
    costo_envio: 0,
  };

  return (
    <>
      <div className="min-h-screen bg-[linear-gradient(180deg,var(--color-custom-darker)_0%,var(--color-custom)_100%)] pb-20 text-[var(--color-custom-text)] selection:bg-[var(--color-custom)] selection:text-white">
        <div className="mx-auto max-w-[1480px] px-3 py-3 sm:px-4 lg:px-5 lg:py-4">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
            <section className="relative overflow-hidden rounded-[34px] bg-[var(--color-custom)] p-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.2)]">
              <div className="relative overflow-hidden rounded-[28px] border border-black/5 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,244,236,0.98))] px-4 pb-5 pt-4 sm:px-5 lg:px-6">
                <div className="absolute inset-0 pointer-events-none opacity-55" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, rgba(31,107,61,0.07) 0, rgba(31,107,61,0.07) 10px, transparent 10px), radial-gradient(circle at 80% 18%, rgba(31,107,61,0.07) 0, rgba(31,107,61,0.07) 10px, transparent 10px), radial-gradient(circle at 48% 12%, rgba(31,107,61,0.07) 0, rgba(31,107,61,0.07) 10px, transparent 10px), radial-gradient(circle at 72% 66%, rgba(31,107,61,0.07) 0, rgba(31,107,61,0.07) 10px, transparent 10px), radial-gradient(circle at 96% 84%, rgba(31,107,61,0.07) 0, rgba(31,107,61,0.07) 10px, transparent 10px)" }} />

                <div className="relative grid gap-4 lg:grid-cols-[minmax(0,1.7fr)_330px]">
                  <div className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(90deg,rgba(31,107,61,0.96),rgba(31,107,61,0.78))] shadow-[0_18px_40px_rgba(31,107,61,0.15)]">
                    <div className="absolute inset-0">
                      <Image
                        src={negocio.banner_url || "/images/Neo_portada.webp"}
                        alt={`Portada de ${negocio.nombre}`}
                        fill
                        priority
                        className="object-cover opacity-72"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,45,22,0.82),rgba(31,107,61,0.45),rgba(31,107,61,0.15))]" />
                    </div>

                    <div className="relative flex min-h-[175px] flex-col justify-between gap-4 px-4 py-4 sm:min-h-[185px] sm:px-5 sm:py-5 lg:min-h-[206px] lg:px-6 lg:py-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="max-w-[58%] sm:max-w-[62%] lg:max-w-[68%]">
                          <p className="text-[clamp(2.3rem,5vw,4.4rem)] font-black italic leading-[0.85] tracking-[-0.08em] text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.18)]">
                            {negocio.nombre}
                          </p>
                          <div className="mt-3 inline-flex rounded-full bg-white px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.22em] text-[var(--color-custom)] shadow-[0_10px_18px_rgba(0,0,0,0.12)] sm:text-[12px]">
                            Abierto ahora · Pedí por WP
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center justify-center rounded-full bg-white p-2.5 shadow-[0_12px_28px_rgba(0,0,0,0.16)] sm:p-3">
                          <Image
                            src="/icons/neo_logo_negro.svg"
                            alt="Estudio Camaleon"
                            width={54}
                            height={54}
                            className="h-10 w-10 object-contain sm:h-11 sm:w-11"
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap items-end justify-between gap-3 text-white">
                        <div className="flex items-center gap-2 text-white/90">
                          <MapPin className="h-4 w-4 shrink-0" />
                          <div className="leading-tight">
                            <p className="text-[12px] font-extrabold uppercase tracking-[0.12em]">
                              {negocio.localidad || "Sucursal Centro"}
                            </p>
                            <p className="text-[10px] font-medium text-white/80">
                              {negocio.direccion || "Av. Siempre viva 123"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-white/90">
                          <Clock className="h-4 w-4 shrink-0" />
                          <div className="leading-tight text-right">
                            <p className="text-[12px] font-extrabold uppercase tracking-[0.12em]">
                              11:00 - 23:00
                            </p>
                            <p className="text-[10px] font-medium text-white/80">
                              Lun - Dom
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-1">
                    <div className="rounded-[28px] bg-[#2b7b45] px-5 py-4 text-white shadow-[0_16px_34px_rgba(0,0,0,0.16)]">
                      <div className="flex items-center gap-2 text-white/85">
                        <MapPin className="h-4 w-4" />
                        <p className="text-[12px] font-black uppercase tracking-[0.16em]">Sucursal Centro</p>
                      </div>
                      <p className="mt-1 text-[12px] font-medium text-white/82">
                        {negocio.direccion || "Av. Siempre viva 123"}
                      </p>
                    </div>

                    <div className="rounded-[28px] bg-[#2b7b45] px-5 py-4 text-white shadow-[0_16px_34px_rgba(0,0,0,0.16)]">
                      <div className="flex items-center gap-2 text-white/85">
                        <Clock className="h-4 w-4" />
                        <p className="text-[12px] font-black uppercase tracking-[0.16em]">11:00 - 23:00</p>
                      </div>
                      <p className="mt-1 text-[12px] font-medium text-white/82">Lun - Dom</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_330px]">
                <div className="overflow-hidden rounded-[28px] bg-[#f7f4ec] p-4 shadow-[0_12px_30px_rgba(0,0,0,0.08)] sm:p-5 lg:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-[clamp(1.55rem,2.2vw,2.1rem)] font-black italic leading-none tracking-[-0.05em] text-[var(--color-custom-darker)]">
                        Menú
                      </p>
                      <p className="mt-1 text-[12px] font-semibold italic text-[rgba(0,0,0,0.35)]">
                        Elegí tu producto favorito
                      </p>
                    </div>

                    <div className="relative w-full sm:max-w-[250px]">
                      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgba(0,0,0,0.25)]" />
                      <input
                        type="text"
                        placeholder="Buscar producto..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-[14px] border border-[rgba(0,0,0,0.22)] bg-[#f7f4ec] py-2.5 pl-11 pr-4 text-[13px] font-medium text-[rgba(0,0,0,0.72)] outline-none placeholder:text-[rgba(0,0,0,0.28)]"
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <button
                      onClick={() => scrollToCategory("all")}
                      className={`whitespace-nowrap rounded-full px-4 py-1.5 text-[12px] font-black italic transition-all shrink-0 ${
                        activeCategory === "all"
                          ? "bg-[var(--color-custom)] text-white shadow-[0_8px_18px_rgba(31,107,61,0.22)]"
                          : "bg-[#2b7b45] text-white/95"
                      }`}
                    >
                      Todos
                    </button>
                    {categorias.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => scrollToCategory(cat.id)}
                        className={`whitespace-nowrap rounded-full px-4 py-1.5 text-[12px] font-black italic transition-all shrink-0 ${
                          activeCategory === cat.id
                            ? "bg-[var(--color-custom)] text-white shadow-[0_8px_18px_rgba(31,107,61,0.22)]"
                            : "bg-[#2b7b45] text-white/95"
                        }`}
                      >
                        {cat.nombre}
                      </button>
                    ))}
                  </div>

                  <div className="mt-5 space-y-8">
                    {categoriasFiltradas.length === 0 ? (
                      <div className="rounded-[24px] border border-dashed border-[rgba(31,107,61,0.16)] bg-white/55 py-20 text-center text-sm font-medium text-[rgba(0,0,0,0.42)]">
                        No encontramos productos para tu búsqueda.
                      </div>
                    ) : (
                      categoriasFiltradas.map((cat) => (
                        <section key={cat.id} id={`cat-${cat.id}`} className="space-y-4 pt-1">
                          <div className="flex items-center gap-3">
                            <span className="h-1.5 w-14 rounded-full bg-white" />
                            <span className="rounded-full bg-[var(--color-custom)] px-6 py-1.5 text-[12px] font-black italic uppercase tracking-[0.16em] text-white shadow-[0_8px_18px_rgba(31,107,61,0.2)]">
                              {cat.nombre}
                            </span>
                          </div>

                          <div className="grid gap-3">
                            {cat.productos.map((prod) => {
                              const cantidad = cartQuantityByProduct.get(prod.id) || 0;

                              return (
                                <article
                                  key={prod.id}
                                  className={`grid grid-cols-[92px_minmax(0,1fr)] gap-3 rounded-[18px] border border-[rgba(0,0,0,0.1)] bg-white p-2.5 shadow-[0_6px_18px_rgba(0,0,0,0.05)] sm:grid-cols-[104px_minmax(0,1fr)] ${
                                    !prod.disponible ? "opacity-50 grayscale" : ""
                                  }`}
                                >
                                  <div className="relative overflow-hidden rounded-[16px] bg-[#ece7dc]">
                                    {prod.imagen_url ? (
                                      <Image
                                        src={prod.imagen_url}
                                        alt={prod.nombre}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 92px, 104px"
                                      />
                                    ) : (
                                      <div className="flex h-full min-h-[92px] items-center justify-center text-[rgba(0,0,0,0.18)]">
                                        <ImageIcon size={28} />
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex min-w-0 flex-col justify-between gap-2 py-1 pr-1">
                                    <div className="min-w-0">
                                      <p className="truncate text-[11px] font-black uppercase italic tracking-[0.18em] text-[var(--color-custom)]">
                                        {prod.nombre}
                                      </p>
                                      <p className="mt-0.5 line-clamp-2 text-[10px] leading-relaxed text-[rgba(0,0,0,0.36)]">
                                        {prod.descripcion || "Producto disponible en el catálogo."}
                                      </p>
                                    </div>

                                    <div className="flex items-end justify-between gap-3">
                                      <div className="text-[11px] font-black uppercase italic text-[var(--color-custom)]">
                                        ${Number(prod.precio).toLocaleString("es", { minimumFractionDigits: 0 })}
                                      </div>

                                      {prod.disponible ? (
                                        <div className="flex items-center overflow-hidden rounded-full bg-[var(--color-custom)] text-white shadow-[0_8px_18px_rgba(31,107,61,0.2)]">
                                          <button
                                            type="button"
                                            onClick={() => removeItem(prod.id)}
                                            className="flex h-7 w-7 items-center justify-center text-white/95 transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
                                            disabled={cantidad === 0}
                                          >
                                            <Minus size={13} />
                                          </button>
                                          <span className="min-w-7 px-2 text-center text-[11px] font-black leading-7">
                                            {cantidad}
                                          </span>
                                          <button
                                            type="button"
                                            onClick={() =>
                                              addItem({
                                                id: prod.id,
                                                producto_id: prod.id,
                                                nombre: prod.nombre,
                                                imagen_url: prod.imagen_url,
                                                precio: prod.precio,
                                                cantidad: 1,
                                                detalles: null,
                                              })
                                            }
                                            className="flex h-7 w-7 items-center justify-center text-white/95 transition-opacity hover:opacity-80"
                                          >
                                            <Plus size={13} />
                                          </button>
                                        </div>
                                      ) : (
                                        <span className="rounded-full border border-[rgba(0,0,0,0.12)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[rgba(0,0,0,0.38)]">
                                          Agotado
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </article>
                              );
                            })}
                          </div>
                        </section>
                      ))
                    )}
                  </div>
                </div>

              </div>
            </section>

            <aside className="hidden xl:block xl:sticky xl:top-4">
              <PublicCart negocioId={negocio.id} config={menuConfig} />
            </aside>
          </div>
        </div>
      </div>

      <div className="xl:hidden">
        <CartFloatingButton onClick={() => setIsCartOpen(true)} />
        {isCartOpen && (
          <PublicCart
            negocioId={negocio.id}
            isDrawer
            config={menuConfig}
            onCloseDrawer={() => setIsCartOpen(false)}
          />
        )}
      </div>
    </>
  );
}
