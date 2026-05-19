"use client";

import { Globe, MapPin, Phone, Hash } from "lucide-react";
import { ConfigFormState } from "../components/ConfigForm";

interface GeneralInfoSectionProps {
  formData: ConfigFormState;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

export function GeneralInfoSection({
  formData,
  onChange,
}: GeneralInfoSectionProps) {
  return (
    <div className="admin-card space-y-6">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
        <Globe size={18} className="text-[var(--admin-accent)]" />
        <h2 className="font-semibold text-gray-900">
          Información General
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
        <div className="space-y-1.5">
          <label className="font-semibold text-gray-700">
            Nombre del Negocio
          </label>
          <input
            name="nombre"
            value={formData.nombre}
            onChange={onChange}
            className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]"
            placeholder="Ej: Burger King"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-gray-700">
            Ruta URL (Slug)
          </label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              name="slug"
              value={formData.slug}
              onChange={onChange}
              className="w-full p-2.5 pl-9 bg-gray-50 border border-gray-300 rounded-lg font-mono text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]"
              placeholder="burger-king"
              required
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Tus clientes accederán a:{" "}
            <span className="font-mono text-gray-600 bg-gray-100 px-1 py-0.5 rounded">
              neo.com/menú/<b>{formData.slug || "ruta"}</b>
            </span>
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-gray-700 flex items-center gap-2">
             <Phone size={14} className="text-gray-400" /> WhatsApp Principal
          </label>
          <input
            name="whatsapp"
            value={formData.whatsapp}
            onChange={onChange}
            type="tel"
            className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]"
            placeholder="5491123456789"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Aquí llegarán todos los pedidos en formato de comanda estructurada.
          </p>
        </div>
        
        <div className="space-y-1.5">
          <label className="font-semibold text-gray-700">
            Localidad / Ciudad
          </label>
          <input
            name="localidad"
            value={formData.localidad}
            onChange={onChange}
            className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]"
            placeholder="Ej: San Miguel de Tucumán"
          />
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <label className="font-semibold text-gray-700 flex items-center gap-2">
             <MapPin size={14} className="text-gray-400" /> Dirección del Local
          </label>
          <input
            name="direccion"
            value={formData.direccion}
            onChange={onChange}
            className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]"
            placeholder="Ej: Av. Mate de Luna 1234"
            required
          />
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <label className="font-semibold text-gray-700">
            Aclaraciones de ubicación (Opcional)
          </label>
          <textarea
            name="direccion_notas"
            value={formData.direccion_notas}
            onChange={onChange}
            className="w-full p-3 bg-white border border-gray-300 rounded-lg text-sm resize-none h-20 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]"
            placeholder="Ej: Local de la esquina, timbre verde..."
          />
        </div>
      </div>
    </div>
  );
}
