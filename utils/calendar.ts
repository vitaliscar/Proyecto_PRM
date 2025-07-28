import type { Appointment, CalendarEvent } from "@/types/appointment"

export const convertAppointmentsToEvents = (appointments: Appointment[]): CalendarEvent[] => {
  return appointments.map((appointment) => {
    const [day, month, year] = appointment.date.split("/").map(Number)
    const [hours, minutes] = appointment.time.split(":").map(Number)

    const start = new Date(year, month - 1, day, hours, minutes)
    const end = new Date(start.getTime() + appointment.duration * 60000)

    return {
      id: appointment.id,
      title: `${appointment.patientName} - ${appointment.type}`,
      start,
      end,
      type: appointment.type,
      status: appointment.status,
      patient: appointment.patientName,
      psychologist: appointment.psychologistName,
      room: appointment.room,
    }
  })
}

export const formatDateForDisplay = (date: Date): string => {
  return date.toLocaleDateString("es-VE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export const formatTimeForDisplay = (date: Date): string => {
  return date.toLocaleTimeString("es-VE", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

export const getDaysInMonth = (year: number, month: number): Date[] => {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const days: Date[] = []

  // Agregar días del mes anterior para completar la primera semana
  const firstDayOfWeek = firstDay.getDay()
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const prevDate = new Date(year, month, -i)
    days.push(prevDate)
  }

  // Agregar todos los días del mes actual
  for (let day = 1; day <= lastDay.getDate(); day++) {
    days.push(new Date(year, month, day))
  }

  // Agregar días del mes siguiente para completar la última semana
  const remainingDays = 42 - days.length // 6 semanas × 7 días
  for (let day = 1; day <= remainingDays; day++) {
    days.push(new Date(year, month + 1, day))
  }

  return days
}

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

export const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date())
}

export const formatDateToString = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, "0")
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

export const parseStringToDate = (dateString: string): Date => {
  const [day, month, year] = dateString.split("/").map(Number)
  return new Date(year, month - 1, day)
}

export const getWeekDays = (): string[] => {
  return ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
}

export const getMonthNames = (): string[] => {
  return [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]
}
