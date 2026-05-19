"use client";

import Image from "next/image";
import { ImageIcon, Loader2, Upload, Camera } from "lucide-react";

interface BrandingSectionProps {
  logoUrl: string;
  bannerUrl: string;
  uploading: string | null;
  onImageUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "logo_url" | "banner_url",
  ) => void;
}

export function BrandingSection({
  logoUrl,
  bannerUrl,
  uploading,
  onImageUpload,
}: BrandingSectionProps) {
  return (
    <div className="admin-card !p-0 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-2">
          <Camera size={18} className="text-[var(--admin-accent)]" />
          <h2 className="font-semibold text-gray-900">
            Identidad Visual
          </h2>
        </div>
        <p className="text-sm text-gray-500 mt-1">Configura el logo y la portada de tu catálogo público.</p>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-gray-50/30">
        {/* LOGO DE MARCA */}
        <div className="lg:col-span-4 flex flex-col items-center">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Logo del Negocio
          </span>
          <div className="relative group">
            <div className="w-40 h-40 rounded-full border border-gray-200 bg-white overflow-hidden relative shadow-sm group-hover:border-[var(--admin-accent)] transition-colors">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  fill
                  className="object-contain p-2 animate-in zoom-in-95 duration-300"
                  alt="Logo corporativo"
                  sizes="160px"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 bg-gray-50">
                  <ImageIcon size={32} className="mb-2" />
                  <span className="text-xs font-medium text-gray-400">Sin logo</span>
                </div>
              )}
              {uploading === "logo_url" && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                  <Loader2 className="animate-spin text-[var(--admin-accent)]" size={24} />
                </div>
              )}
            </div>

            <label className="absolute bottom-2 right-2 bg-white text-gray-700 hover:text-[var(--admin-accent)] p-2.5 rounded-full border border-gray-200 shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-all z-20">
              <Upload size={16} />
              <input
                type="file"
                hidden
                accept="image/png, image/jpeg, image/webp"
                onChange={(e) => onImageUpload(e, "logo_url")}
                disabled={!!uploading}
              />
            </label>
          </div>
          <p className="text-xs text-gray-400 mt-4 text-center">
            Formato 1:1 (Cuadrado). <br/>Max 2MB. JPG o PNG.
          </p>
        </div>

        {/* PORTADA EN BANNER */}
        <div className="lg:col-span-8 flex flex-col h-full justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-end">
               <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                 Portada del Catálogo
               </span>
               <label className="text-xs font-medium text-[var(--admin-accent)] hover:text-[var(--admin-accent)]/80 flex items-center gap-1.5 cursor-pointer transition-colors bg-[var(--admin-accent)]/10 px-3 py-1.5 rounded-md">
                 <Upload size={14} /> Subir nueva
                 <input
                   type="file"
                   hidden
                   accept="image/png, image/jpeg, image/webp"
                   onChange={(e) => onImageUpload(e, "banner_url")}
                   disabled={!!uploading}
                 />
               </label>
            </div>
            
            <div className="relative w-full aspect-[21/8] rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm group hover:border-[var(--admin-accent)] transition-colors">
              {bannerUrl ? (
                <Image
                  src={bannerUrl}
                  fill
                  className="object-cover animate-in fade-in duration-500"
                  alt="Banner de catálogo"
                  sizes="(max-width: 768px) 100vw, 800px"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400">
                   <ImageIcon size={40} className="mb-2 opacity-50" />
                   <span className="text-sm font-medium">No se ha configurado una portada</span>
                </div>
              )}
              
              {uploading === "banner_url" && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
                  <Loader2 className="animate-spin text-[var(--admin-accent)]" size={32} />
                </div>
              )}
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
             <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400" />
             Recomendado: 1200x450px para mejor visualización.
          </p>
        </div>
      </div>
    </div>
  );
}
