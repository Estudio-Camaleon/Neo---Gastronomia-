"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, X, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validación perimetral de seguridad: Máximo 2MB por archivo
    if (file.size > 2 * 1024 * 1024) {
      toast.error("ARCHIVO MUY PESADO", {
        description: "El límite máximo para imágenes de productos es de 2MB.",
      });
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("FORMATO NO VÁLIDO", {
        description:
          "Por favor, selecciona un archivo de imagen (JPG, PNG, WebP).",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Nombre de archivo único indexado por marca de tiempo para evitar colisiones en Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("media").getPublicUrl(filePath);

      onChange(publicUrl);
      toast.success("IMAGEN CARGADA", {
        description: "La foto se sincronizó correctamente en tu inventario.",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      console.error("Upload error:", error);
      toast.error("ERROR DE CARGA", {
        description: errorMessage || "No se pudo subir la imagen al bucket.",
      });
    } finally {
      setIsUploading(false);
      // Blanqueamos el valor del nodo para permitir re-subidas de archivos eliminados
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = () => {
    onChange("");
  };

  return (
    <div className="space-y-3 font-sans">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted italic flex items-center gap-2 ml-1 select-none">
        Imagen del Producto
      </label>

      <div className="relative group w-full">
        {value ? (
          /* ESCENARIO A: PREVISUALIZACIÓN MULTIMEDIA ACTIVA */
          <div className="relative aspect-square w-full rounded-neo overflow-hidden border-2 border-border dark:border-border-dark group-hover:border-primary transition-all shadow-md bg-bg-main dark:bg-bg-dark">
            <Image
              src={value}
              alt="Preview de carga"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover animate-in fade-in zoom-in-95 duration-500"
            />

            {/* Botón Flotante Destructivo */}
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-3 right-3 p-2 bg-error text-white rounded-full shadow-xl hover:scale-110 active:scale-90 transition-transform z-10"
              title="Eliminar imagen"
            >
              <X size={14} strokeWidth={3} />
            </button>

            {/* Overlay Informativo */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <p className="text-[10px] font-black text-white uppercase tracking-widest">
                Cambiar Fotografía 📷
              </p>
            </div>
          </div>
        ) : (
          /* ESCENARIO B: ENTRADA DE ARCHIVO / DROPZONE INERTE */
          <label
            className={`
              flex flex-col items-center justify-center aspect-square w-full 
              rounded-neo border-2 border-dashed transition-all cursor-pointer select-none
              ${
                isUploading
                  ? "bg-bg-main dark:bg-bg-dark/40 border-primary/40"
                  : "bg-bg-main dark:bg-bg-dark border-border dark:border-border-dark hover:bg-gray-50/50 dark:hover:bg-white/5 hover:border-primary dark:hover:border-primary"
              }
            `}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="animate-spin text-primary" size={28} />
                <span className="text-[9px] font-black uppercase tracking-widest text-primary animate-pulse font-mono">
                  Sincronizando...
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 p-6 text-center">
                <div className="p-4 bg-white dark:bg-bg-darker rounded-full border-2 border-border dark:border-border-dark group-hover:border-primary transition-all shadow-sm">
                  <UploadCloud
                    className="text-text-muted dark:text-border-dark group-hover:text-primary transition-colors"
                    size={24}
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-text-primary dark:text-text-inverse block">
                    Click para examinar
                  </span>
                  <span className="text-[8px] font-bold uppercase text-text-muted block opacity-60 font-mono tracking-wider">
                    JPG, PNG O WEBP (MÁX. 2MB)
                  </span>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleUpload}
              disabled={isUploading}
            />
          </label>
        )}
      </div>
    </div>
  );
}
