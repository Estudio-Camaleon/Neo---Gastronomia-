import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El correo es obligatorio")
    .email("El correo no tiene un formato válido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

export const registerSchema = z.object({
  email: z
    .string()
    .email("El correo no tiene un formato válido")
    .transform((v) => v.trim().toLowerCase()),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  nombreNegocio: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre es demasiado largo")
    .transform((v) => v.trim()),
  slug: z
    .string()
    .min(2, "El slug debe tener al menos 2 caracteres")
    .max(60, "El slug es demasiado largo")
    .regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones")
    .transform((v) => v.trim().toLowerCase()),
  whatsapp: z
    .string()
    .regex(
      /^\+?\d{7,15}$/,
      "Ingresa un número válido con código de país (ej: +5491123456789)",
    )
    .optional()
    .or(z.literal("")),
  direccion: z
    .string()
    .max(200, "La dirección es demasiado larga")
    .optional()
    .or(z.literal("")),
  color_primary: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Color inválido")
    .default("#10b981"),
});

const productVariantSchema = z.object({
  nombre: z.string().min(1, "El nombre de variante es requerido"),
  precio: z.number().min(0, "El precio no puede ser negativo"),
});

const extraItemSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  precio: z.number(),
});

const extraGroupSchema = z.object({
  id: z.string(),
  titulo: z.string(),
  requerido: z.boolean(),
  multiple: z.boolean(),
  items: z.array(extraItemSchema),
});

const productConfigSchema = z.object({
  variantes: z.array(productVariantSchema).default([]),
  grupos_opciones: z.array(extraGroupSchema).default([]),
});

export const upsertProductSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre del producto es requerido")
    .max(200, "El nombre es demasiado largo"),
  descripcion: z.string().nullable().optional(),
  precio: z.number().min(0, "El precio no puede ser negativo"),
  imagen_url: z.string().nullable().optional(),
  categoria_id: z.string().nullable().optional(),
  disponible: z.boolean(),
  configuracion: productConfigSchema,
});

export const orderStatusSchema = z.enum([
  "pendiente",
  "en_preparacion",
  "entregado",
  "cancelado",
]);

export const updateOrderStatusSchema = z.object({
  pedidoId: z.string().min(1, "ID de pedido requerido"),
  nuevoEstado: orderStatusSchema,
});

export const submitOrderSchema = z.object({
  negocio_id: z.string().min(1),
  cliente_nombre: z.string().min(1, "El nombre del cliente es requerido"),
  cliente_whatsapp: z.string().min(1, "El WhatsApp es requerido"),
  es_delivery: z.boolean(),
  direccion_entrega: z.string().nullable().optional(),
  metodo_pago: z.enum(["efectivo", "transferencia"]),
  notas: z.string().nullable().optional(),
  items: z
    .array(
      z.object({
        producto_id: z.string().min(1),
        cantidad: z.number().int().positive("La cantidad debe ser positiva"),
        detalles: z.string().nullable().optional(),
      }),
    )
    .min(1, "Debe haber al menos un item"),
});
