"use client";

import { Clock } from "lucide-react"; // Removemos Plus y Trash2 por no ser usados

// Estructura de bloque para un día de atención activo
interface HorarioDia {
  inicio: string;
  fin: string;
}

// Estructura del JSON completo indexado por el ID de cada día
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
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <Clock className="text-primary w-5 h-5" />
        <h2 className="font-black uppercase italic tracking-tight text-lg">
          Horarios de Atención
        </h2>
      </div>

      <div className="grid gap-3">
        {DIAS.map((dia) => {
          const dayConfig = schedule[dia.id];
          const isOpen = !!dayConfig;

          return (
            <div
              key={dia.id}
              className={`flex items-center justify-between p-4 rounded-neo border-2 transition-all ${
                isOpen
                  ? "border-primary/30 bg-primary/5"
                  : "border-border opacity-50"
              }`}
            >
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={isOpen}
                  onChange={(e) => updateDay(dia.id, e.target.checked)}
                  className="w-5 h-5 accent-primary cursor-pointer"
                />
                <span className="font-black uppercase italic text-xs w-20">
                  {dia.label}
                </span>
              </div>

              {isOpen && dayConfig && (
                <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2">
                  <input
                    type="time"
                    value={dayConfig.inicio}
                    onChange={(e) =>
                      updateTime(dia.id, "inicio", e.target.value)
                    }
                    className="bg-white dark:bg-bg-dark border-2 border-border p-2 rounded-lg text-xs font-bold outline-none focus:border-primary transition-colors"
                  />
                  <span className="text-[10px] font-black opacity-30">A</span>
                  <input
                    type="time"
                    value={dayConfig.fin}
                    onChange={(e) => updateTime(dia.id, "fin", e.target.value)}
                    className="bg-white dark:bg-bg-dark border-2 border-border p-2 rounded-lg text-xs font-bold outline-none focus:border-primary transition-colors"
                  />
                </div>
              )}

              {!isOpen && (
                <span className="text-[10px] font-black uppercase opacity-40 italic tracking-widest">
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
