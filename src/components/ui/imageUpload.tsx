"use client";

import { useState, useRef } from "react";
import { createClient } from "@/core/lib/supabase/client";
import { Loader2, X, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface ImageUploadProps {
  value: string | null;
  onChange: (_url: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Formato inválido", {
        description: "Por favor subí solo imágenes.",
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Archivo muy pesado", { description: "Límite máximo: 2MB." });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("media").getPublicUrl(filePath);

      onChange(publicUrl);
      toast.success("Imagen cargada");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error desconocido al subir la imagen";
      toast.error("Error de carga", { description: errorMessage });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = async () => {
    if (!value) return;

    try {
      if (value.includes("/media/")) {
        const path = value.split("/media/")[1];
        if (path) {
          await supabase.storage.from("media").remove([path]);
        }
      }

      onChange("");
      toast.info("Imagen eliminada", {
        description: "El archivo fue removido del servidor.",
      });
    } catch (error: unknown) {
      console.error("Error al borrar:", error);
      onChange("");
    }
  };

  return (
    <div className="space-y-2 h-full flex flex-col">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
        Fotografía del Producto
      </label>

      <div className="relative group flex-1 min-h-[250px]">
        {value ? (
          <div className="relative h-full w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-zinc-950 shadow-sm transition-all hover:border-[var(--admin-accent,#34a35f)]">
            <Image
              src={value}
              alt="Preview"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover animate-in fade-in zoom-in-95 duration-300"
            />

            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-1.5 bg-white text-gray-700 hover:text-red-600 rounded-full border border-gray-200 shadow-sm hover:scale-105 active:scale-95 transition-all z-10 dark:bg-zinc-900 dark:border-gray-800 dark:text-gray-300 dark:hover:text-red-500"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <label
            className={`
              flex flex-col items-center justify-center h-full w-full 
              rounded-xl border-2 border-dashed transition-all cursor-pointer select-none
              ${
                isUploading
                  ? "bg-gray-50 border-gray-300 dark:bg-zinc-900 dark:border-gray-700"
                  : "bg-gray-50 border-gray-300 hover:bg-gray-100 hover:border-gray-400 dark:bg-zinc-900 dark:border-gray-700 dark:hover:bg-zinc-800 dark:hover:border-gray-600"
              }
            `}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="animate-spin text-gray-500" size={24} />
                <span className="text-sm font-medium text-gray-500">
                  Subiendo...
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 p-6 text-center">
                <div className="p-3 bg-white dark:bg-zinc-950 rounded-full border border-gray-200 dark:border-gray-800 shadow-sm">
                  <UploadCloud
                    className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
                    size={24}
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                    Haga clic para subir una imagen
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 block">
                    MAX 2MB (JPG/PNG/WEBP)
                  </span>
                </div>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleUpload}
              disabled={isUploading}
            />
          </label>
        )}
      </div>
    </div>
  );
}
