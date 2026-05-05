"use client";

import { Clock } from "lucide-react";

interface HorarioDia {
  inicio: string;
  fin: string;
}

interface ScheduleData {
  [dayId: string]: HorarioDia | undefined;
}

interface ScheduleEditorProps {
  schedule: ScheduleData;
  onChange: (newSchedule: ScheduleData) => void;
}

const DIAS = [
  { id: "lunes", label: "Lunes" },
  { id: "martes", label: "Martes" },
  { id: "miercoles", label: "Miércoles" },
  { id: "jueves", label: "Jueves" },
  { id: "viernes", label: "Viernes" },
  { id: "sabado", label: "Sábado" },
  { id: "domingo", label: "Domingo" },
];

export function ScheduleEditor({ schedule, onChange }: ScheduleEditorProps) {
  const updateDay = (day: string, active: boolean) => {
    const newSchedule = { ...schedule };
    if (!active) {
      delete newSchedule[day];
    } else {
      newSchedule[day] = { inicio: "19:00", fin: "23:59" };
    }
    onChange(newSchedule);
  };

  const updateTime = (day: string, field: "inicio" | "fin", value: string) => {
    const dayData = schedule[day] || { inicio: "19:00", fin: "23:59" };
    onChange({
      ...schedule,
      [day]: { ...dayData, [field]: value },
    });
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Cabecera del Editor Horario */}
      <div className="flex items-center gap-3 mb-6">
        <Clock className="text-primary w-5 h-5" />
        <h2 className="font-black uppercase italic tracking-tight text-lg text-text-primary dark:text-text-inverse">
          Horarios de Atención
        </h2>
      </div>

      {/* Grilla Semanal */}
      <div className="grid gap-3">
        {DIAS.map((dia) => {
          const dayConfig = schedule[dia.id];
          const isOpen = !!dayConfig;

          return (
            <div
              key={dia.id}
              className={`flex items-center justify-between p-4 rounded-neo border-2 transition-all ${
                isOpen
                  ? "border-primary/30 dark:border-primary/40 bg-primary/5 dark:bg-primary/10"
                  : "border-border dark:border-border-dark opacity-50 bg-bg-main dark:bg-bg-dark/10"
              }`}
            >
              <div className="flex items-center gap-4 select-none">
                <input
                  type="checkbox"
                  id={`check-${dia.id}`}
                  checked={isOpen}
                  onChange={(e) => updateDay(dia.id, e.target.checked)}
                  className="w-5 h-5 accent-primary cursor-pointer rounded-sm border-2 border-border"
                />
                <label
                  htmlFor={`check-${dia.id}`}
                  className="font-black uppercase italic text-xs w-20 cursor-pointer text-text-primary dark:text-text-inverse"
                >
                  {dia.label}
                </label>
              </div>

              {/* Selectores de Horas Condicionales */}
              {isOpen && dayConfig && (
                <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-200">
                  <input
                    type="time"
                    value={dayConfig.inicio}
                    onChange={(e) =>
                      updateTime(dia.id, "inicio", e.target.value)
                    }
                    className="bg-white dark:bg-bg-dark border-2 border-border dark:border-border-dark p-2 rounded-lg text-xs font-bold font-mono outline-none focus:border-primary text-text-primary dark:text-text-inverse transition-colors"
                  />
                  <span className="text-[10px] font-black opacity-40 text-text-primary dark:text-text-inverse uppercase font-mono">
                    A
                  </span>
                  <input
                    type="time"
                    value={dayConfig.fin}
                    onChange={(e) => updateTime(dia.id, "fin", e.target.value)}
                    className="bg-white dark:bg-bg-dark border-2 border-border dark:border-border-dark p-2 rounded-lg text-xs font-bold font-mono outline-none focus:border-primary text-text-primary dark:text-text-inverse transition-colors"
                  />
                </div>
              )}

              {!isOpen && (
                <span className="text-[10px] font-black uppercase opacity-40 italic tracking-widest text-text-primary dark:text-text-inverse font-mono">
                  Cerrado
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
