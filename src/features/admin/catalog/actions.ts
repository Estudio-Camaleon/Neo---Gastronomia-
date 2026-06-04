"use server";

import { createClient } from "@/core/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getAuthenticatedTenant } from "@/core/lib/tenant";
import { upsertProductSchema } from "@/core/lib/schemas";
import { logAuditEvent } from "@/core/lib/audit";
import { z } from "zod";

async function revalidateMenus(tenantId: string) {
  const supabase = await createClient();
  const { data: negocio } = await supabase
    .from("negocios")
    .select("slug")
    .eq("id", tenantId)
    .limit(1)
    .single();
  if (negocio?.slug) {
    revalidatePath(`/${negocio.slug}`);
  }
}

export async function upsertProductAction(
  payload: z.infer<typeof upsertProductSchema>,
  productId?: string,
) {
  const parsed = upsertProductSchema.safeParse(payload);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    throw new Error(
      `Datos inválidos: ${firstIssue.path.join(".")} - ${firstIssue.message}`,
    );
  }

  const supabase = await createClient();
  const { user } = (await supabase.auth.getUser()).data;
  const tenantId = await getAuthenticatedTenant(supabase);

  const productRow = {
    nombre: parsed.data.nombre,
    descripcion: parsed.data.descripcion ?? null,
    precio: parsed.data.precio,
    imagen_url: parsed.data.imagen_url ?? null,
    categoria_id: parsed.data.categoria_id ?? null,
    disponible: parsed.data.disponible,
    configuracion: parsed.data.configuracion,
    negocio_id: tenantId,
    ...(productId ? { id: productId } : {}),
  };

  const isUpdate = !!productId;
  if (isUpdate) {
    const { data: old } = await supabase
      .from("productos")
      .select("nombre, precio, disponible")
      .eq("id", productId)
      .limit(1)
      .single();
    const { error } = await supabase.from("productos").upsert(productRow);
    if (error) throw new Error(`Fallo de persistencia: ${error.message}`);
    logAuditEvent({
      negocio_id: tenantId,
      user_id: user?.id ?? "",
      accion: "update",
      entidad: "producto",
      entidad_id: productId,
      cambios_previos: old ?? undefined,
      cambios_nuevos: productRow as unknown as Record<string, unknown>,
    });
  } else {
    const { error } = await supabase.from("productos").upsert(productRow);
    if (error) throw new Error(`Fallo de persistencia: ${error.message}`);
  }

  revalidatePath("/productos");
  await revalidateMenus(tenantId);
  return { success: true };
}

const deleteProductSchema = z.string().min(1, "ID de producto requerido");

export async function deleteProductAction(productId: string) {
  const parsed = deleteProductSchema.safeParse(productId);
  if (!parsed.success) throw new Error("ID de producto inválido");

  const supabase = await createClient();
  const { user } = (await supabase.auth.getUser()).data;
  const tenantId = await getAuthenticatedTenant(supabase);

  const { data: old } = await supabase
    .from("productos")
    .select("nombre")
    .eq("id", parsed.data)
    .limit(1)
    .single();

  const { error } = await supabase
    .from("productos")
    .delete()
    .eq("id", parsed.data)
    .eq("negocio_id", tenantId);

  if (error) throw new Error(error.message);

  logAuditEvent({
    negocio_id: tenantId,
    user_id: user?.id ?? "",
    accion: "delete",
    entidad: "producto",
    entidad_id: parsed.data,
    cambios_previos: old ?? undefined,
  });

  revalidatePath("/productos");
  await revalidateMenus(tenantId);
  return { success: true };
}

const createCategorySchema = z.object({
  nombre: z.string().min(1, "Nombre de categoría requerido"),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Slug inválido: solo minúsculas, números y guiones"),
});

export async function createCategoryAction(nombre: string, slug: string) {
  const parsed = createCategorySchema.safeParse({ nombre, slug });
  if (!parsed.success) throw new Error("Datos de categoría inválidos");

  const supabase = await createClient();
  const { user } = (await supabase.auth.getUser()).data;
  const tenantId = await getAuthenticatedTenant(supabase);

  const { data: newCat, error } = await supabase
    .from("categorias")
    .insert({ nombre: parsed.data.nombre, slug: parsed.data.slug, negocio_id: tenantId })
    .select("id")
    .limit(1)
    .single();

  if (error) throw new Error(error.message);

  logAuditEvent({
    negocio_id: tenantId,
    user_id: user?.id ?? "",
    accion: "create",
    entidad: "categoria",
    entidad_id: newCat?.id,
    cambios_nuevos: { nombre: parsed.data.nombre, slug: parsed.data.slug },
  });

  revalidatePath("/productos");
  await revalidateMenus(tenantId);
  return { success: true };
}

export async function deleteCategoryAction(categoriaId: string) {
  const supabase = await createClient();
  const { user } = (await supabase.auth.getUser()).data;
  const tenantId = await getAuthenticatedTenant(supabase);

  const { data: old } = await supabase
    .from("categorias")
    .select("nombre")
    .eq("id", categoriaId)
    .limit(1)
    .single();

  const { error } = await supabase
    .from("categorias")
    .delete()
    .eq("id", categoriaId)
    .eq("negocio_id", tenantId);

  if (error) throw new Error(error.message);

  logAuditEvent({
    negocio_id: tenantId,
    user_id: user?.id ?? "",
    accion: "delete",
    entidad: "categoria",
    entidad_id: categoriaId,
    cambios_previos: old ?? undefined,
  });

  revalidatePath("/productos");
  await revalidateMenus(tenantId);
  return { success: true };
}
