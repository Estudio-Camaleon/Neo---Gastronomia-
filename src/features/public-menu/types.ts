export interface ExtraItem {
  id: string;
  nombre: string;
  precio: number;
}

export interface ExtraGroup {
  id: string;
  titulo: string;
  requerido: boolean;
  multiple: boolean;
  items: ExtraItem[];
}

export interface ProductoConfiguracion {
  variantes?: Array<{ nombre: string; precio: number }>;
  grupos_opciones?: ExtraGroup[];
}

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  imagen_url: string | null;
  disponible: boolean;
  configuracion: ProductoConfiguracion | null;
}

export interface Categoria {
  id: string;
  nombre: string;
  slug: string;
  productos: Producto[];
}

export interface Turno {
  inicio: string;
  fin: string;
}

export interface HorarioDia {
  turnos: Turno[];
}

export interface NegocioPublico {
  id: string;
  nombre: string;
  slug: string;
  color_primary: string | null;
  banner_url: string | null;
  logo_url: string | null;
  direccion: string | null;
  localidad: string | null;
  direccion_notas: string | null;
  whatsapp: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  tiktok_url: string | null;
  horarios: Record<string, HorarioDia> | null;
}

export interface CatalogClientProps {
  negocio: NegocioPublico;
  categorias: Categoria[];
}
