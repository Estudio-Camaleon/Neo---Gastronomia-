"use client";

import Image from "next/image";
import { ImageIcon, Loader2, Upload } from "lucide-react";

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
    <section className="bg-white dark:bg-bg-darker border-2 border-border rounded-super p-8 space-y-8 shadow-sm">
      <div className="flex items-center gap-3">
        <ImageIcon className="text-primary w-5 h-5" />
        <h2 className="font-black uppercase italic tracking-tight text-lg">
          Branding & Media
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Logo Upload */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">
            Logo del Negocio
          </label>
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 rounded-full border-4 border-border overflow-hidden bg-bg-main flex items-center justify-center shrink-0 shadow-inner">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  fill
                  sizes="96px"
                  className="object-contain"
                  alt="Logo preview"
                />
              ) : (
                <ImageIcon className="opacity-10" size={32} />
              )}
              {uploading === "logo_url" && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                  <Loader2 className="animate-spin text-white" />
                </div>
              )}
            </div>
            <label className="cursor-pointer bg-black text-white px-6 py-3 rounded-neo font-black text-[10px] uppercase hover:bg-primary transition-all flex items-center gap-2">
              <Upload size={14} />
              {uploading === "logo_url" ? "SUBIENDO..." : "SUBIR LOGO"}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => onImageUpload(e, "logo_url")}
              />
            </label>
          </div>
        </div>

        {/* Banner Upload */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">
            Banner de Portada
          </label>
          <div className="relative w-full h-24 rounded-neo border-4 border-border overflow-hidden bg-bg-main shadow-inner">
            {bannerUrl ? (
              <Image
                src={bannerUrl}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                alt="Banner preview"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center opacity-10 font-black text-[10px] uppercase tracking-tighter">
                SIN PORTADA
              </div>
            )}
            {uploading === "banner_url" && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                <Loader2 className="animate-spin text-white" />
              </div>
            )}
            <label className="absolute bottom-2 right-2 cursor-pointer bg-white/90 backdrop-blur text-black p-2 rounded-full hover:bg-primary hover:text-white transition-all shadow-xl z-20">
              <Upload size={16} />
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => onImageUpload(e, "banner_url")}
              />
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}
