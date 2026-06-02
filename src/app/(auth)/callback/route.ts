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
    if (error) {
      console.error("[AUTH CALLBACK]: Error exchanging code:", error.message);
      return NextResponse.redirect(
        `${origin}/login?error=Fallo_de_validacion_de_correo`,
      );
    }
    return NextResponse.redirect(`${origin}/pedidos`);
  }

  if (access_token && refresh_token) {
    const { error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });
    if (error) {
      console.error("[AUTH CALLBACK]: Error setting session:", error.message);
      return NextResponse.redirect(
        `${origin}/login?error=Fallo_de_validacion_de_correo`,
      );
    }
    return NextResponse.redirect(`${origin}/pedidos`);
  }

  return NextResponse.redirect(`${origin}/login?message=correo_validado`);
}
