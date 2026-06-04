"use client";

import { useState } from "react";
import { z } from "zod";
import {
  ShieldAlert,
  CheckCircle2,
  Loader2,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { updatePasswordAction } from "@/features/auth/actions";
import { useRouter } from "next/navigation";

const resetSchema = z
  .object({
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres."),
    confirm: z.string().min(1, "Confirmá la contraseña."),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Las contraseñas no coinciden.",
    path: ["confirm"],
  });

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const getStrength = (pass: string) => {
    if (pass.length === 0) return { score: 0, label: "", color: "" };
    let points = 0;
    if (pass.length >= 8) points++;
    if (/[A-Z]/.test(pass)) points++;
    if (/[0-9]/.test(pass)) points++;
    if (/[^A-Za-z0-9]/.test(pass)) points++;
    if (points <= 1) return { score: 1, label: "Insegura", color: "bg-red-400" };
    if (points <= 3) return { score: 2, label: "Moderada", color: "bg-amber-400" };
    return { score: 3, label: "Fuerte", color: "bg-[var(--auth-primary)]" };
  };

  const strength = getStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError("");

    const result = resetSchema.safeParse({ password, confirm });
    if (!result.success) {
      setError(result.error.issues[0]?.message || "Datos inválidos.");
      return;
    }

    setLoading(true);
    const res = await updatePasswordAction(password);
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen auth-layout-container flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--auth-text)]">
            Contraseña actualizada
          </h1>
          <p className="text-sm text-[var(--auth-text-muted)]">
            Tu contraseña se cambió correctamente. Redirigiendo al panel...
          </p>
          <button
            onClick={() => router.push("/pedidos")}
            className="auth-btn-primary max-w-xs mx-auto"
          >
            Ir al panel <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen auth-layout-container flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-[var(--auth-text)]">
            Nueva contraseña
          </h1>
          <p className="text-sm text-[var(--auth-text-muted)]">
            Elegí una contraseña segura para tu cuenta.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="auth-label">Nueva contraseña</label>
            <div className="relative">
              <Input
                required
                type={showPassword ? "text" : "password"}
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                className="auth-input pr-10"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--auth-text-muted)] hover:text-[var(--auth-text)]"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {password.length > 0 && (
              <div className="space-y-1.5">
                <div className="h-1.5 w-full bg-[#f3efe6] rounded-full overflow-hidden">
                  <div
                    className={`h-full ${strength.color} w-${strength.score === 1 ? "1/3" : strength.score === 2 ? "2/3" : "full"} transition-all duration-500`}
                  />
                </div>
                <span className="text-[10px] font-medium text-[var(--auth-text-muted)]">
                  Fortaleza: {strength.label}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="auth-label">Confirmar contraseña</label>
            <Input
              required
              type={showPassword ? "text" : "password"}
              disabled={loading}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repetí la contraseña"
              className={`auth-input ${confirm && password !== confirm ? "border-red-400" : confirm && password === confirm ? "border-green-400" : ""}`}
              autoComplete="new-password"
            />
          </div>

          {error && (
            <div className="auth-error-box">
              <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password || !confirm}
            className="auth-btn-primary"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Actualizando...
              </>
            ) : (
              <>
                <CheckCircle2 size={16} />
                Cambiar contraseña
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
