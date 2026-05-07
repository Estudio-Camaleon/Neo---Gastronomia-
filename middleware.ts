// middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            // Actualizamos la respuesta para que los cambios en las cookies se mantengan
            response = NextResponse.next({
              request: { headers: request.headers },
            });
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  // --- REVISIÓN DE RUTAS (Auditoría de Acceso) ---

  // 1. Rutas estáticas públicas
  const publicStaticRoutes = ["/", "/login", "/registro", "/onboarding"];
  const isStaticPublic = publicStaticRoutes.includes(pathname);

  // 2. Rutas de API y archivos (No tocarlas)
  const isApiOrAsset = pathname.startsWith("/api/") || pathname.includes(".");

  /**
   * 3. EL PUNTO CIEGO: Rutas de Locales (Public Menu)
   * Si la ruta no empieza con (adminPanel), login o registro,
   * probablemente es el menú de un cliente (ej: /burgers-tucuman).
   * Necesitamos que sea pública.
   */
  const isReservedRoute =
    pathname.startsWith("/pedidos") ||
    pathname.startsWith("/productos") ||
    pathname.startsWith("/configuracion") ||
    pathname.startsWith("/admin");

  // Definimos si la ruta requiere autenticación
  const requiresAuth = !isStaticPublic && !isApiOrAsset && isReservedRoute;

  // --- LÓGICA DE REDIRECCIÓN ---

  // A. No hay usuario y la ruta requiere protección -> al login
  if (requiresAuth && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // B. Hay usuario pero intenta entrar a login/registro -> al panel
  if (user && (pathname === "/login" || pathname === "/registro")) {
    return NextResponse.redirect(new URL("/pedidos", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    // Excluir archivos estáticos internos de Next.js
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
