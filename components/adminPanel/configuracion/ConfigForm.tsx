"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Palette,
  Globe,
  Save,
  Loader2,
  Hash,
  Smartphone,
  MapPin,
  Image as ImageIcon,
  Upload,
  CheckCircle2,
} from "lucide-react";
import { ScheduleEditor } from "@/components/adminPanel/configuracion/ScheduleEditor";

interface ConfigFormProps {
  initialData: any;
  userId: string;
}

export function ConfigForm({ initialData, userId }: ConfigFormProps) {
  const supabase = createClient();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  // Estado sincronizado con las columnas de la tabla public.negocios
  const [formData, setFormData] = useState({
    nombre: initialData?.nombre || "",
    slug: initialData?.slug || "",
    whatsapp: initialData?.whatsapp || "",
    direccion: initialData?.direccion || "",
    color_primario: initialData?.color_primario || "#000000",
    logo_url: initialData?.logo_url || "",
    banner_url: initialData?.banner_url || "",
    horarios: initialData?.horarios || {},
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Gestión de carga de imágenes a Storage
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "logo_url" | "banner_url",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validación de peso (2MB)
    if (file.size > 2 * 1024 * 1024) {
      return toast.error("ARCHIVO DEMASIADO GRANDE", {
        description: "El límite permitido es de 2MB por imagen.",
      });
    }

    setUploading(field);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}-${field}-${Date.now()}.${fileExt}`;
      const filePath = `identidad/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("imagenes-negocios")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("imagenes-negocios").getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, [field]: publicUrl }));
      toast.success("IMAGEN CARGADA", {
        description:
          "Se ha actualizado la vista previa. No olvides guardar los cambios.",
      });
    } catch (error: any) {
      toast.error("ERROR DE ALMACENAMIENTO", { description: error.message });
    } finally {
      setUploading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    try {
      const { error } = await supabase
        .from("negocios")
        .update({
          nombre: formData.nombre,
          slug: formData.slug,
          whatsapp: formData.whatsapp,
          direccion: formData.direccion,
          color_primario: formData.color_primario,
          logo_url: formData.logo_url,
          banner_url: formData.banner_url,
          horarios: formData.horarios,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);

      if (error) throw error;

      toast.success("DATOS SINCRONIZADOS", {
        description: "La configuración ha sido actualizada correctamente.",
        icon: <CheckCircle2 className="text-green-500" />,
      });

      router.refresh();
    } catch (error: any) {
      toast.error("ERROR DE ACTUALIZACIÓN", {
        description: error.message || "Error al conectar con la base de datos.",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-10 animate-in fade-in duration-700"
    >
      {/* SECCIÓN: BRANDING & MEDIA */}
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
                {formData.logo_url ? (
                  <img
                    src={formData.logo_url}
                    className="w-full h-full object-contain"
                    alt="Logo preview"
                  />
                ) : (
                  <ImageIcon className="opacity-10" size={32} />
                )}
                {uploading === "logo_url" && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Loader2 className="animate-spin text-white" />
                  </div>
                )}
              </div>
              <label className="cursor-pointer bg-black text-white px-6 py-3 rounded-neo font-black text-[10px] uppercase hover:bg-primary transition-all flex items-center gap-2">
                <Upload size={14} />{" "}
                {uploading === "logo_url" ? "SUBIENDO..." : "SUBIR LOGO"}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "logo_url")}
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
              {formData.banner_url ? (
                <img
                  src={formData.banner_url}
                  className="w-full h-full object-cover"
                  alt="Banner preview"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center opacity-10 font-black text-[10px] uppercase tracking-tighter">
                  SIN PORTADA
                </div>
              )}
              {uploading === "banner_url" && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <Loader2 className="animate-spin text-white" />
                </div>
              )}
              <label className="absolute bottom-2 right-2 cursor-pointer bg-white/90 backdrop-blur text-black p-2 rounded-full hover:bg-primary hover:text-white transition-all shadow-xl">
                <Upload size={16} />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "banner_url")}
                />
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN: INFORMACIÓN GENERAL */}
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
              value={formData.nombre}
              onChange={handleChange}
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
                value={formData.slug}
                onChange={handleChange}
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
                value={formData.whatsapp}
                onChange={handleChange}
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
                value={formData.direccion}
                onChange={handleChange}
                className="w-full bg-bg-main p-4 pl-10 rounded-neo border-2 border-border focus:border-primary outline-none font-bold"
                placeholder="Calle, Número, Localidad"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN: HORARIOS OPERATIVOS */}
      <section className="bg-white dark:bg-bg-darker border-2 border-border rounded-super p-8 shadow-sm">
        <ScheduleEditor
          schedule={formData.horarios}
          onChange={(newSchedule) =>
            setFormData((prev) => ({ ...prev, horarios: newSchedule }))
          }
        />
      </section>

      {/* SECCIÓN: DISEÑO DE CATÁLOGO */}
      <section className="bg-white dark:bg-bg-darker border-2 border-border rounded-super p-8 space-y-8 shadow-sm">
        <div className="flex items-center gap-3">
          <Palette className="text-primary w-5 h-5" />
          <h2 className="font-black uppercase italic tracking-tight text-lg">
            Diseño de Catálogo
          </h2>
        </div>

        <div className="flex flex-col items-start gap-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">
            Color de Identidad (Acentos)
          </label>
          <div className="flex items-center gap-6">
            <input
              type="color"
              name="color_primario"
              value={formData.color_primario}
              onChange={handleChange}
              className="w-20 h-20 rounded-full border-4 border-white shadow-xl cursor-pointer"
            />
            <div className="space-y-1">
              <span className="font-mono text-xs font-black uppercase bg-bg-main px-4 py-2 rounded-neo border border-border">
                {formData.color_primario}
              </span>
              <p className="text-[9px] font-bold text-text-muted uppercase italic mt-2">
                Este tono se aplicará a botones y elementos interactivos
                públicos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BOTÓN DE GUARDADO FLOTANTE */}
      <div className="sticky bottom-10 z-50 flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="group relative flex items-center gap-4 bg-primary text-white px-14 py-6 rounded-full shadow-2xl shadow-primary/40 font-black uppercase tracking-[0.2em] border-4 border-white hover:scale-105 active:scale-95 transition-all disabled:opacity-70"
        >
          {isPending ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <Save size={24} />
          )}
          <span>{isPending ? "SINCRONIZANDO..." : "ACTUALIZAR NEGOCIO"}</span>
        </button>
      </div>
    </form>
  );
}
