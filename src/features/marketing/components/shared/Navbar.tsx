"use client";

import { useState } from "react";
import { TransitionLink } from "@/components/ui/transition-link";
import { Menu, X, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useActiveSection } from "@/core/hooks/useActiveSection";
import { useIsScrolled } from "@/core/hooks/useIsScrolled";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // 1. Hook de ScrollSpy (qué sección se está viendo)
  const activeSection = useActiveSection([
    "hero",
    "features",
    "how-it-works",
    "planes",
    "testimonials",
  ]);

  // 2. Hook de Glassmorphism (si el usuario bajó de la cabecera)
  const isScrolled = useIsScrolled();

  // Añadimos el enlace al menú
  const navigationLinks = [
    { name: "Inicio", href: "#hero" },
    { name: "Beneficios", href: "#features" },
    { name: "Pasos", href: "#how-it-works" },
    { name: "Planes", href: "#planes" },
    { name: "Casos de éxito", href: "#testimonials" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full px-4 pt-4 sm:px-6 lg:px-8">
      <nav
        className={`mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8 flex items-center justify-between rounded-[20px] transition-all duration-500 ${
          isScrolled
            ? "glass-card shadow-lg"
            : "bg-transparent border border-transparent shadow-none"
        }`}
      >
        {/* Logo */}
        <TransitionLink href="/" className="flex items-center gap-2 group">
          <div className="neo-chip p-2 rounded-xl transition-transform group-hover:rotate-6 duration-300">
            <Image
              src="/icons/neo_logo_negro.webp"
              alt="NEO Brand Logo"
              width={75}
              height={75}
              priority
              className="object-contain"
            />
          </div>
        </TransitionLink>

        {/* Desktop Links (Con ScrollSpy Activo) */}
        <div className="hidden md:flex items-center gap-8">
          {navigationLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1); // ej: "hero" === "hero"

            return (
              <TransitionLink
                key={link.name}
                href={link.href}
                className={`text-sm transition-all duration-300 ${
                  isActive
                    ? "font-black text-[var(--theme-primary)] scale-105"
                    : "font-medium text-[var(--theme-text-muted)] hover:text-[var(--theme-primary)]"
                }`}
              >
                {link.name}
              </TransitionLink>
            );
          })}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <TransitionLink
            href="/login"
            className="text-sm font-bold text-[var(--theme-text)] hover:text-[var(--theme-primary)] transition-colors duration-200"
          >
            Ingresar
          </TransitionLink>
          <TransitionLink
            href="/registro"
            className="flex items-center gap-1.5 bg-[var(--theme-primary)] text-white text-sm font-black uppercase px-4 py-2 rounded-xl hover:opacity-90 transition-all duration-300 shadow-[0_4px_14px_rgba(31,107,61,0.16)]"
          >
            Crear local
            <ArrowRight className="w-4 h-4" />
          </TransitionLink>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-[var(--theme-text-muted)] hover:text-[var(--theme-primary)] focus:outline-none"
            aria-label="Alternar menú de navegación"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Dropdown */}
      {isOpen && (
        <div className="md:hidden mt-2 mx-auto max-w-7xl glass-card p-4 flex flex-col gap-4 border-t border-[var(--theme-border)] animate-slide-down opacity-0">
          {navigationLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <TransitionLink
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-base transition-colors py-1 ${
                  isActive
                    ? "font-black text-[var(--theme-primary)]"
                    : "font-medium text-[var(--theme-text-muted)] hover:text-[var(--theme-primary)]"
                }`}
              >
                {link.name}
              </TransitionLink>
            );
          })}
          <div className="h-[1px] bg-[var(--theme-border)] my-1" />
          <div className="flex flex-col gap-3">
            <TransitionLink
              href="/login"
              className="text-center text-sm font-bold text-[var(--theme-text)] py-2"
            >
              Ingresar
            </TransitionLink>
            <TransitionLink
              href="/registro"
              className="flex items-center justify-center gap-2 bg-[var(--theme-primary)] text-white text-sm font-black uppercase py-2.5 rounded-xl"
            >
              Crear local
              <ArrowRight className="w-4 h-4" />
            </TransitionLink>
          </div>
        </div>
      )}
    </header>
  );
}
