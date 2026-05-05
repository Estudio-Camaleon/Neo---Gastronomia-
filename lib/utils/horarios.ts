// Interfaces estrictas para evitar el 'any' y unificar el comportamiento con el panel de administración
interface HorarioDia {
  inicio: string;
  fin: string;
}

interface ScheduleData {
  [dayId: string]: HorarioDia | undefined;
}

/**
 * Evalúa si el negocio se encuentra actualmente abierto según su configuración horaria indexada.
 */
export function estaAbierto(
  horarios: ScheduleData | null | undefined,
): boolean {
  if (!horarios) return false;

  const ahora = new Date();
  const diasSemana = [
    "domingo",
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado",
  ];

  const diaActual = diasSemana[ahora.getDay()];
  const horarioHoy = horarios[diaActual];

  // Si el día no está configurado o está marcado como cerrado/undefined, retorna false
  if (!horarioHoy || !horarioHoy.inicio || !horarioHoy.fin) return false;

  const [horaInicio, minInicio] = horarioHoy.inicio.split(":").map(Number);
  const [horaFin, minFin] = horarioHoy.fin.split(":").map(Number);

  const ahoraEnMinutos = ahora.getHours() * 60 + ahora.getMinutes();
  const inicioEnMinutos = horaInicio * 60 + minInicio;
  const finEnMinutos = horaFin * 60 + minFin;

  return ahoraEnMinutos >= inicioEnMinutos && ahoraEnMinutos <= finEnMinutos;
}
