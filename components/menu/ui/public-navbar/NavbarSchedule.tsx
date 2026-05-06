"use client";

import React, { useState, useRef, useEffect } from "react";
import { Clock, ChevronDown, ChevronUp } from "lucide-react";

interface HorarioDia {
  inicio?: string;
  fin?: string;
}

interface NavbarScheduleProps {
  horariosRaw: unknown; // 🚀 SOLUCIÓN: Declaramos el tipado correcto para fulminar el rojo
  finalColor: string;
}

export function NavbarSchedule({
  horariosRaw,
  finalColor,
}: NavbarScheduleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Escuchador táctico para cerrar el dropdown si el usuario hace clic afuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const diasSemana = [
    { key: "lunes", label: "Lunes" },
    { key: "martes", label: "Martes" },
    { key: "miercoles", label: "Miércoles" },
    { key: "jueves", label: "Jueves" },
    { key: "viernes", label: "Viernes" },
    { key: "sabado", label: "Sábado" },
    { key: "domingo", label: "Domingo" },
  ];

  // Casteo seguro de tipos para evitar el 'any' implícito
  const horarios =
    (horariosRaw as Record<string, HorarioDia | undefined>) || {};

  // Calculamos el horario del día de hoy en tiempo real
  const diasIngles = [
    "domingo",
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado",
  ];
  const hoyIndex = new Date().getDay();
  const diaHoyKey = diasIngles[hoyIndex];
  const horarioHoy = horarios[diaHoyKey];

  const rangoHoy =
    horarioHoy && horarioHoy.inicio && horarioHoy.fin
      ? `${horarioHoy.inicio} - ${horarioHoy.fin}`
      : "Cerrado hoy";

  return (
    <div ref={dropdownRef} className="relative z-40">
      {/* BOTÓN DISPARADOR DEL DROPDOWN */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 text-left hover:opacity-80 transition-all cursor-pointer group select-none bg-transparent border-0 p-0"
      >
        {/* Icono del Reloj */}
        <div className="p-2 rounded-xl bg-white dark:bg-white/5 border-2 border-border dark:border-border-dark shadow-xs flex-shrink-0 group-hover:border-gray-400 dark:group-hover:border-border-dark/80 transition-colors">
          <Clock style={{ stroke: finalColor }} size={20} strokeWidth={2.5} />
        </div>

        {/* Textos de Estado */}
        <div className="flex flex-col select-none">
          <span className="font-sans font-black uppercase italic text-xs lg:text-sm tracking-tight text-text-primary dark:text-text-inverse leading-none flex items-center gap-1">
            {rangoHoy}
            {isOpen ? (
              <ChevronUp
                size={12}
                strokeWidth={3}
                className="text-text-muted flex-shrink-0"
              />
            ) : (
              <ChevronDown
                size={12}
                strokeWidth={3}
                className="text-text-muted flex-shrink-0"
              />
            )}
          </span>
          <span className="text-[10px] lg:text-[11px] font-bold text-text-secondary dark:text-text-muted tracking-wide mt-1">
            Ver horarios de la semana
          </span>
        </div>
      </button>

      {/* MENÚ DESPLEGABLE SEMANAL (Estilo Neo-Brutalista Puro) */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-60 bg-white dark:bg-bg-darker border-2 border-black dark:border-border-dark rounded-2xl p-4 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <p className="text-[9px] font-black uppercase text-text-muted tracking-widest mb-3 italic border-b border-dashed border-border dark:border-border-dark pb-1.5">
            Cronograma Semanal
          </p>

          <div className="space-y-2 font-mono text-xs">
            {diasSemana.map((dia) => {
              const infoDia = horarios[dia.key];
              const estaActivo = infoDia && infoDia.inicio && infoDia.fin;
              const esHoy = dia.key === diaHoyKey;

              return (
                <div
                  key={dia.key}
                  className={`flex items-center justify-between py-1 px-1.5 rounded-md transition-colors ${
                    esHoy ? "bg-gray-100 dark:bg-white/10 font-bold" : ""
                  }`}
                >
                  <span
                    className={`text-text-primary dark:text-text-inverse ${esHoy ? "italic" : ""}`}
                  >
                    {dia.label} {esHoy && "•"}
                  </span>

                  {estaActivo ? (
                    <span className="text-text-secondary dark:text-text-muted font-black">
                      {infoDia.inicio} - {infoDia.fin}
                    </span>
                  ) : (
                    <span className="text-error/70 font-black text-[10px] uppercase tracking-wider">
                      Cerrado
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
