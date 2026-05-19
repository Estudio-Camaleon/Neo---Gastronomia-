"use client";

import { useState } from "react";
import { createClient } from "@/core/lib/supabase/client";
import { z } from "zod";
import { ShieldAlert, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

const registerSchema = z.object({
  nombreNegocio: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Ingresa un correo válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombreNegocio, setNombreNegocio] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setErrorMsg("");

    const validation = registerSchema.safeParse({
      nombreNegocio,
      email,
      password,
    });
    if (!validation.success) {
      setErrorMsg(validation.error.issues[0]?.message || "Datos incorrectos.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/pedidos`,
          data: {
            nombre_negocio: nombreNegocio,
          },
        },
      });

      if (error) throw error;
      setIsSent(true);
    } catch (error) {
      setErrorMsg(
        error instanceof Error
          ? error.message
          : "Error fatal al crear la cuenta.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="bg-[var(--admin-surface)] p-8 rounded-2xl border border-[var(--admin-border)] shadow-lg text-center space-y-6 animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-[var(--admin-surface-accent)]/50 text-[var(--admin-accent)] rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[var(--admin-text)] tracking-tight mb-2">
            ¡Casi listo!
          </h2>
          <p className="text-[var(--admin-text-muted)] text-sm leading-relaxed">
            Hemos enviado un enlace de confirmación para tu negocio <br />
            <span className="font-semibold text-[var(--admin-text)] bg-[var(--admin-bg)] px-2 py-0.5 rounded-md mt-1 inline-block">
              {nombreNegocio}
            </span>{" "}
            <br />
            al correo: <span className="font-medium text-[var(--admin-text)]">{email}</span>
          </p>
        </div>
        <div className="p-4 bg-[var(--admin-accent)]/10 border border-[var(--admin-accent)]/20 rounded-xl text-xs font-medium text-[var(--admin-text)]">
          Por favor, revisa tu bandeja de entrada o la carpeta de spam para verificar tu cuenta y comenzar a usar NEO.
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleRegister} className="w-full space-y-5">
      <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-[var(--admin-text)]">
          Nombre de tu Negocio
        </label>
        <Input
          required
          type="text"
          disabled={loading}
          value={nombreNegocio}
          onChange={(e) => setNombreNegocio(e.target.value)}
          placeholder="Ej: Burger King"
          className="h-12 uppercase border-[var(--admin-border)]"
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-[var(--admin-text)]">
          Correo Electrónico
        </label>
        <Input
          required
          type="email"
          disabled={loading}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="socio@tu-negocio.com"
          className="h-12 border-[var(--admin-border)]"
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-[var(--admin-text)]">
          Contraseña
        </label>
        <Input
          required
          autoComplete="new-password"
          type="password"
          disabled={loading}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="h-12 border-[var(--admin-border)]"
        />
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 text-[var(--admin-danger)] bg-[var(--admin-danger)]/10 p-3 rounded-xl border border-[var(--admin-danger)]/20 text-sm font-medium animate-in fade-in duration-200">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <button
        disabled={loading}
        type="submit"
        className="w-full bg-[var(--admin-text)] hover:opacity-90 text-[var(--admin-surface)] font-bold text-sm py-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none transition-all flex items-center justify-center gap-2 mt-2 border border-[var(--admin-border)]"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" /> Creando cuenta...
          </>
        ) : (
          <>
            Crear cuenta ahora
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
