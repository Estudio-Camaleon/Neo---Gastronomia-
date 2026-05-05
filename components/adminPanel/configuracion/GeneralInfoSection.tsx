"use client";

import { Globe, Hash, Smartphone, MapPin } from "lucide-react";

interface GeneralInfoSectionProps {
  nombre: string;
  slug: string;
  whatsapp: string;
  direccion: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function GeneralInfoSection({
  nombre,
  slug,
  whatsapp,
  direccion,
  onChange,
}: GeneralInfoSectionProps) {
  return (
    <section className="bg-white dark:bg-bg-darker border-2 border-border rounded-super p-8 space-y-6 shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <Globe className="text-primary w-5 h-5" />
        <h2 className="font-black uppercase italic tracking-tight text-lg">
          Información General
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">
            Nombre Comercial
          </label>
          <input
            name="nombre"
            value={nombre}
            onChange={onChange}
            className="w-full bg-bg-main p-4 rounded-neo border-2 border-border focus:border-primary outline-none font-bold"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">
            Identificador de URL (Slug)
          </label>
          <div className="relative">
            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
            <input
              name="slug"
              value={slug}
              onChange={onChange}
              className="w-full bg-bg-main p-4 pl-10 rounded-neo border-2 border-border focus:border-primary outline-none font-black italic"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">
            WhatsApp de Pedidos
          </label>
          <div className="relative">
            <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
            <input
              name="whatsapp"
              value={whatsapp}
              onChange={onChange}
              className="w-full bg-bg-main p-4 pl-10 rounded-neo border-2 border-border focus:border-primary outline-none font-bold"
              placeholder="54381..."
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">
            Ubicación
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
            <input
              name="direccion"
              value={direccion}
              onChange={onChange}
              className="w-full bg-bg-main p-4 pl-10 rounded-neo border-2 border-border focus:border-primary outline-none font-bold"
              placeholder="Calle, Número, Localidad"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
