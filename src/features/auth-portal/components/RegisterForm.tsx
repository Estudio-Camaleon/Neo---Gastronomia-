"use client";

import { useState } from "react";
import { z } from "zod";
import { ShieldAlert, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

// Esquema de registro con Regex quirúrgico para fulminar inyecciones XSS
const registerSchema = z.object({
  nombreNegocio: z
    .string()
    .min(2, "El nombre comercial debe poseer al menos 2 caracteres.")
    .transform((val) => {
      return val
        .trim()
        .replace(/<\/?[^>]+(>|$)/g, "")
        .replace(/[<>]/g, "");
    }),
  email: z
    .string()
    .min(1, "El correo electrónico es mandatorio.")
    .email("Ingresa un formato de correo válido")
    .transform((val) => val.trim().toLowerCase()),
  password: z
    .string()
    .min(6, "La contraseña del administrador requiere mínimo 6 caracteres.")
    .transform((val) => val.trim()),
});

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombreNegocio, setNombreNegocio] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // --- HEURÍSTICA DE ENTROPÍA ULTRA-LIGHT ---
  const getPasswordStrength = (pass: string) => {
    if (pass.length === 0) {
      return { score: 0, label: "", color: "bg-transparent", width: "w-0" };
    }
    let points = 0;
    if (pass.length >= 6) points++;
    if (/[A-Z]/.test(pass)) points++;
    if (/[0-9]/.test(pass)) points++;
    if (/[^A-Za-z0-9]/.test(pass)) points++;

    if (points <= 1) {
      return {
        score: 1,
        label: "Insegura",
        color: "bg-red-400",
        width: "w-1/3",
      };
    }
    if (points === 2 || points === 3) {
      return {
        score: 2,
        label: "Moderada",
        color: "bg-amber-400",
        width: "w-2/3",
      };
    }
    return {
      score: 3,
      label: "Fuerte",
      color: "bg-[var(--auth-primary)]",
      width: "w-full",
    };
  };

  const strength = getPasswordStrength(password);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setErrorMsg("");

    const validation = registerSchema.safeParse({
      nombreNegocio,
      email,
      password,
    });

    if (!validation.success) {
      setErrorMsg(validation.error.issues[0]?.message || "Esquema inválido.");
      return;
    }

    setLoading(true);
    try {
      const { createClient } = await import("@/core/lib/supabase/client");
      const supabase = createClient();

      const { error } = await supabase.auth.signUp({
        email: validation.data.email,
        password: validation.data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/pedidos`,
          data: {
            nombre_negocio: validation.data.nombreNegocio,
          },
        },
      });

      if (error) throw error;
      setIsSent(true);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Fallo crítico de persistencia en la creación de credenciales.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="bg-[var(--auth-surface-form)] p-6 rounded-xl border border-[var(--auth-border)] text-center space-y-4 animate-in zoom-in-95 duration-200 select-none shadow-sm">
        <div className="w-12 h-12 bg-[var(--auth-primary-soft)] text-[var(--auth-primary)] rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-bold text-[var(--auth-accent)] tracking-tight">
            Enlace de Activación Despachado
          </h2>
          <p className="text-[var(--auth-text-muted)] text-sm leading-relaxed">
            Hemos enviado una firma de verificación para consolidar el local:{" "}
            <br />
            <span className="font-mono font-semibold text-[var(--auth-accent)] bg-[var(--auth-bg)] px-2 py-0.5 rounded text-xs mt-2 inline-block border border-[var(--auth-border)]">
              {nombreNegocio}
            </span>
          </p>
        </div>
        <div className="p-3 bg-[var(--auth-bg)] border border-[var(--auth-border)] rounded-lg text-xs text-[var(--auth-text-muted)] leading-normal">
          Por favor, valida tu bandeja de entrada o buzón de spam para habilitar
          tu infraestructura multi-tenant en NEO.
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleRegister} className="w-full space-y-5">
      <div className="space-y-2">
        <label className="auth-label">
          Nombre de tu Negocio
        </label>
        <Input
          required
          type="text"
          disabled={loading}
          value={nombreNegocio}
          onChange={(e) => setNombreNegocio(e.target.value)}
          placeholder="Ej: Burger Station"
          className="auth-input"
        />
      </div>

      <div className="space-y-2">
        <label className="auth-label">
          Correo Electrónico
        </label>
        <Input
          required
          type="email"
          disabled={loading}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="socio@tu-negocio.com"
          className="auth-input"
        />
      </div>

      {/* INPUT DE CONTRASEÑA CON ENTROPÍA PREMIUM INTEGRADA */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="auth-label">
            Contraseña Administrador
          </label>
          {password.length > 0 && (
            <span className="text-[10px] font-mono font-medium text-[var(--auth-text-muted)] animate-in fade-in duration-200">
              Fortaleza: {strength.label}
            </span>
          )}
        </div>
        <Input
          required
          autoComplete="new-password"
          type="password"
          disabled={loading}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mínimo 6 caracteres"
          className="auth-input mb-1.5"
        />

        {/* TRACKING VISUAL ADAPTATIVO */}
        <div className="h-1.5 w-full bg-[#f3efe6] rounded-full overflow-hidden transition-all duration-300">
          <div
            className={`h-full ${strength.color} ${strength.width} transition-all duration-500 ease-out`}
          />
        </div>
      </div>

      {errorMsg && (
        <div className="auth-error-box">
          <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <button
        disabled={loading}
        type="submit"
        className="auth-btn-primary mt-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Provisionando
            entorno...
          </>
        ) : (
          <>
            <span>Inicializar Mi Cuenta Comercial</span>
            <ArrowRight size={16} />
          </>
        )}
      </button>
    </form>
  );
}
