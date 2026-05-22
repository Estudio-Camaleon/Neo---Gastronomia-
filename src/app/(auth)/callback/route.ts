// src/app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/core/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const { origin, searchParams } = url;
  const code = searchParams.get("code");
  const access_token = searchParams.get("access_token");
  const refresh_token = searchParams.get("refresh_token");

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}/pedidos`);
    }
  } else if (access_token && refresh_token) {
    const { error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });
    if (!error) {
      return NextResponse.redirect(`${origin}/pedidos`);
    }
  } else {
    // Si no hay tokens ni código, redirigimos al login para que el usuario vuelva a intentar.
    return NextResponse.redirect(`${origin}/login?success=validar_correo`);
  }

  return NextResponse.redirect(
    `${origin}/login?error=Fallo_de_validacion_de_correo`,
  );
}
