"use client";

import { useState } from "react";
import { createClient } from "@/core/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Save,
  Loader2,
  CheckCircle2,
  Settings,
  AlertTriangle,
} from "lucide-react";
import {
  updateTenantBrandingAction,
  type UpdateTenantBrandingPayload,
} from "../actions";

import { BrandingSection } from "../sections/BrandingSection";
import { GeneralInfoSection } from "../sections/GeneralInfoSection";
import { CatalogDesignSection } from "../sections/CatalogDesignSection";
import { SocialLinksSection } from "../sections/SocialLinksSection";
import { ScheduleEditor, type ScheduleData } from "./ScheduleEditor";

export interface NegocioInitialData {
  id: string;
  nombre: string;
  slug: string;
  whatsapp: string;
  direccion: string;
  localidad?: string;
  direccion_notas?: string;
  color_primary: string;
  logo_url: string;
  banner_url: string;
  instagram_url?: string;
  facebook_url?: string;
  tiktok_url?: string;
  horarios: Record<string, unknown>;
}

export interface ConfigFormState {
  nombre: string;
  slug: string;
  whatsapp: string;
  direccion: string;
  localidad: string;
  direccion_notas: string;
  color_primary: string;
  logo_url: string;
  banner_url: string;
  instagram_url: string;
  facebook_url: string;
  tiktok_url: string;
  horarios: ScheduleData;
}

export function ConfigForm({
  initialData,
  userId,
}: {
  initialData: NegocioInitialData | null;
  userId: string;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  const [formData, setFormData] = useState<ConfigFormState>({
    nombre: initialData?.nombre || "",
    slug: initialData?.slug || "",
    whatsapp: initialData?.whatsapp || "",
    direccion: initialData?.direccion || "",
    localidad: initialData?.localidad || "",
    direccion_notas: initialData?.direccion_notas || "",
    color_primary: initialData?.color_primary || "#34a35f",
    logo_url: initialData?.logo_url || "",
    banner_url: initialData?.banner_url || "",
    instagram_url: initialData?.instagram_url || "",
    facebook_url: initialData?.facebook_url || "",
    tiktok_url: initialData?.tiktok_url || "",
    horarios: (initialData?.horarios as unknown as ScheduleData) || {},
  });

  const hasSlugChanged =
    initialData?.slug !== undefined && initialData?.slug !== formData.slug;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "slug") {
      const sanitizedSlug = value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9-_]/g, "");

      setFormData((prev) => ({ ...prev, [name]: sanitizedSlug }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "logo_url" | "banner_url",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      return toast.error("El archivo excede el límite de 2MB");
    }

    setUploading(field);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}-${field}-${Date.now()}.${fileExt}`;
      const filePath = `identidad/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("imagenes-negocios")
        .upload(filePath, file, { upsert: true, cacheControl: "3600" });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("imagenes-negocios").getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, [field]: publicUrl }));
      toast.success("Imagen subida correctamente");
    } catch {
      toast.error("Error al subir la imagen");
    } finally {
      setUploading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!initialData?.id) {
      return toast.error("Error: ID del negocio no encontrado");
    }

    setIsPending(true);
    try {
      const payload: UpdateTenantBrandingPayload = {
        id: initialData.id,
        nombre: formData.nombre,
        slug: formData.slug,
        whatsapp: formData.whatsapp,
        direccion: formData.direccion,
        localidad: formData.localidad,
        direccion_notas: formData.direccion_notas,
        color_primary: formData.color_primary,
        logo_url: formData.logo_url,
        banner_url: formData.banner_url,
        instagram_url: formData.instagram_url,
        facebook_url: formData.facebook_url,
        tiktok_url: formData.tiktok_url,
        horarios: formData.horarios as Record<string, unknown>,
      };

      const res = await updateTenantBrandingAction(payload);

      setFormData((prev) => ({ ...prev, slug: res.slugSaneado }));
      toast.success("Configuración guardada", {
        icon: <CheckCircle2 className="text-[var(--admin-accent)]" />,
      });

      router.refresh();
    } catch {
      toast.error("Error al guardar la configuración");
    } finally {
      setFormData((prev) => ({ ...prev, slug: formData.slug.trim() }));
      setIsPending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-5xl"
    >
      {hasSlugChanged && (
        <div className="bg-red-50 text-red-900 border border-red-200 p-4 rounded-xl flex items-start gap-3 shadow-sm">
          <AlertTriangle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
          <div className="text-sm">
            <span className="font-semibold block mb-1">
              Atención: Estás cambiando la URL de tu menú
            </span>
            La URL antigua <span className="font-mono bg-red-100 px-1 rounded">/{initialData?.slug}</span> dejará de funcionar. 
            La nueva URL será <span className="font-mono bg-green-100 text-green-800 px-1 rounded">/{formData.slug}</span>.
          </div>
        </div>
      )}

      <BrandingSection
        logoUrl={formData.logo_url}
        bannerUrl={formData.banner_url}
        uploading={uploading}
        onImageUpload={handleImageUpload}
      />

      <div className="grid grid-cols-1 gap-6">
        <GeneralInfoSection formData={formData} onChange={handleChange} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <SocialLinksSection formData={formData} onChange={handleChange} />
          </div>
          <div className="lg:col-span-5">
            <CatalogDesignSection
              colorPrimary={formData.color_primary}
              onChange={(val) =>
                setFormData((p) => ({ ...p, color_primary: val }))
              }
            />
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h3 className="text-lg font-bold text-[var(--admin-text)] flex items-center gap-2 mb-4">
          <Settings className="h-5 w-5 text-[var(--admin-text-muted)]" /> Horarios de Atención
        </h3>
        <ScheduleEditor
          schedule={formData.horarios}
          onChange={(newSchedule) =>
            setFormData((p) => ({ ...p, horarios: newSchedule }))
          }
        />
      </div>

      <div className="sticky bottom-6 z-50 flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="bg-[var(--admin-accent)] hover:bg-[var(--admin-accent)]/90 text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isPending ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Save size={18} />
          )}
          <span>
            {isPending
              ? "Guardando cambios..."
              : "Guardar Configuración"}
          </span>
        </button>
      </div>
    </form>
  );
}
