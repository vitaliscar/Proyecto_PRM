import type { Room } from "@/types/appointment"

export const rooms: Room[] = [
  {
    id: "sala-1",
    name: "Sala 1 - Consulta Individual",
    capacity: 2,
    equipment: ["Escritorio", "Sillas cómodas", "Aire acondicionado", "Iluminación natural"],
    available: true,
  },
  {
    id: "sala-2",
    name: "Sala 2 - Terapia Familiar",
    capacity: 6,
    equipment: ["Mesa redonda", "Sillas múltiples", "Pizarra", "Aire acondicionado"],
    available: true,
  },
  {
    id: "sala-3",
    name: "Sala 3 - Evaluaciones",
    capacity: 2,
    equipment: ["Escritorio amplio", "Material de evaluación", "Computadora", "Impresora"],
    available: true,
  },
  {
    id: "sala-4",
    name: "Sala 4 - Terapia Grupal",
    capacity: 10,
    equipment: ["Círculo de sillas", "Proyector", "Sistema de audio", "Aire acondicionado"],
    available: false,
  },
]

export const timeSlots = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
]
