"use client";

import { useState } from "react";
import { createClient } from "@/core/lib/supabase/client";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { LogIn, AlertTriangle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  email: z.string().email("Ingresa un correo válido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setError(result.error.issues[0]?.message || "Datos inválidos");
      return;
    }

    setLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(
          signInError.message === "Invalid login credentials"
            ? "Correo o contraseña incorrectos"
            : signInError.message,
        );
      } else {
        router.refresh();
        router.push("/productos");
      }
    } catch {
      setError("Ocurrió un error inesperado en el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="w-full space-y-5">
      <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-[var(--admin-text)]">
          Correo Electrónico
        </label>
        <Input
          type="email"
          disabled={loading}
          placeholder="admin@tuimperio.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-12 border-[var(--admin-border)]"
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-semibold text-[var(--admin-text)]">
            Contraseña
          </label>
          <button
            type="button"
            className="text-xs font-semibold text-[var(--admin-accent)] hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>
        <Input
          type="password"
          disabled={loading}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="h-12 border-[var(--admin-border)]"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 text-[var(--admin-danger)] bg-[var(--admin-danger)]/10 p-3 rounded-xl border border-[var(--admin-danger)]/20 text-sm font-medium animate-in fade-in duration-200">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[var(--admin-accent)] hover:bg-[var(--admin-accent)]/90 text-white font-bold text-sm py-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none transition-all flex items-center justify-center gap-2 mt-2"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> Procesando...
          </>
        ) : (
          <>
            <LogIn className="h-5 w-5" />
            Ingresar a mi cuenta
          </>
        )}
      </button>
    </form>
  );
}
