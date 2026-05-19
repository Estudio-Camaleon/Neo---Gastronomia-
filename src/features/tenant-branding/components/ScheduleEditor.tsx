"use client";

import { Trash2, Copy, Clock, Plus } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

export interface FranjaHoraria {
  inicio: string;
  fin: string;
}
export interface HorarioDia {
  turnos?: FranjaHoraria[];
}
export interface ScheduleData {
  [dayId: string]: HorarioDia | undefined;
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

export function ScheduleEditor({
  schedule = {},
  onChange,
}: {
  schedule: ScheduleData;
  onChange: (s: ScheduleData) => void;
}) {
  const getTurnos = (dayId: string) => schedule[dayId]?.turnos || [];

  const updateDay = (day: string, active: boolean) => {
    const updated = { ...schedule };
    if (active) updated[day] = { turnos: [{ inicio: "12:00", fin: "16:00" }] };
    else delete updated[day];
    onChange(updated);
  };

  const addFranja = (day: string) => {
    const turnos = getTurnos(day);
    if (turnos.length >= 2)
      return toast.error("Máximo 2 turnos por día permitidos.");
    const updated = {
      ...schedule,
      [day]: { turnos: [...turnos, { inicio: "20:00", fin: "00:00" }] },
    };
    onChange(updated);
  };

  const removeFranja = (day: string, index: number) => {
    const turnos = getTurnos(day).filter((_, i) => i !== index);
    const updated = { ...schedule };
    if (turnos.length === 0) delete updated[day];
    else updated[day] = { turnos };
    onChange(updated);
  };

  const updateTime = (
    day: string,
    index: number,
    field: keyof FranjaHoraria,
    value: string,
  ) => {
    const turnos = [...getTurnos(day)];
    turnos[index] = { ...turnos[index], [field]: value };
    onChange({ ...schedule, [day]: { turnos } });
  };

  const cloneToAll = (dayId: string) => {
    const source = getTurnos(dayId);
    if (!source.length)
      return toast.error("Define al menos un turno para poder replicarlo.");
    const newSchedule: ScheduleData = {};
    DIAS.forEach((d) => {
      newSchedule[d.id] = { turnos: source.map((t) => ({ ...t })) };
    });
    onChange(newSchedule);
    toast.success("Horario replicado a todos los días.");
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gray-50 border-b border-gray-200 px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Clock size={16} className="text-[var(--admin-accent)]" />
          <span>Configuración de Turnos Operativos</span>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {DIAS.map((dia) => {
          const turnos = getTurnos(dia.id);
          const isOpen = turnos.length > 0;

          return (
            <div
              key={dia.id}
              className={`flex flex-col md:flex-row items-stretch md:items-center transition-colors ${isOpen ? "bg-white" : "bg-gray-50/50"}`}
            >
              {/* TOGGLE DÍA */}
              <div className="w-full md:w-44 px-5 py-4 flex items-center justify-between md:justify-start gap-4 border-b md:border-b-0 md:border-r border-gray-100 shrink-0">
                <span className={`text-sm font-semibold ${isOpen ? "text-gray-900" : "text-gray-400"}`}>
                  {dia.label}
                </span>
                <Switch
                  checked={isOpen}
                  onCheckedChange={(checked) => updateDay(dia.id, checked)}
                />
              </div>

              {/* FRANJAS OPERATIVAS */}
              <div className="flex-1 px-5 py-3 flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 min-h-[72px]">
                {isOpen ? (
                  turnos.map((t, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-1.5 animate-in fade-in zoom-in-95">
                      <div className="flex items-center px-1">
                        <input
                          type="time"
                          value={t.inicio}
                          onChange={(e) =>
                            updateTime(dia.id, idx, "inicio", e.target.value)
                          }
                          className="bg-transparent text-sm font-medium outline-none cursor-pointer"
                        />
                        <span className="mx-2 text-xs font-semibold text-gray-400">
                          A
                        </span>
                        <input
                          type="time"
                          value={t.fin}
                          onChange={(e) =>
                            updateTime(dia.id, idx, "fin", e.target.value)
                          }
                          className="bg-transparent text-sm font-medium outline-none cursor-pointer"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFranja(dia.id, idx)}
                        className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors"
                        title="Eliminar turno"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                ) : (
                  <span className="text-xs font-medium text-gray-400 italic">
                    Cerrado
                  </span>
                )}
              </div>

              {/* ACCIONES DE LÍNEA */}
              <div className="px-5 py-3 flex items-center justify-end gap-2 shrink-0 md:w-[220px]">
                {isOpen && (
                  <>
                    {turnos.length < 2 && (
                      <button
                        type="button"
                        onClick={() => addFranja(dia.id)}
                        className="p-2 text-gray-600 hover:text-[var(--admin-accent)] hover:bg-[var(--admin-accent)]/10 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold border border-transparent hover:border-[var(--admin-accent)]/20"
                        title="Agregar turno de tarde"
                      >
                        <Plus size={14} /> <span className="hidden sm:inline">Turno</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => cloneToAll(dia.id)}
                      className="p-2 text-gray-600 hover:text-[var(--admin-accent)] hover:bg-[var(--admin-accent)]/10 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold border border-transparent hover:border-[var(--admin-accent)]/20"
                      title="Copiar este horario a todos los días"
                    >
                      <Copy size={14} /> <span className="hidden sm:inline">Copiar a todos</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
