export interface Appointment {
  id: string
  patientId: string
  patientName: string
  psychologistId: string
  psychologistName: string
  date: string
  time: string
  duration: number
  type: AppointmentType
  status: AppointmentStatus
  room?: string
  virtualLink?: string
  notes?: string
  reminderSent: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateAppointmentData {
  patientId: string
  psychologistId: string
  date: string
  time: string
  duration: number
  type: AppointmentType
  room?: string
  virtualLink?: string
  notes?: string
}

export interface Room {
  id: string
  name: string
  capacity: number
  equipment: string[]
  available: boolean
}

export interface TimeSlot {
  time: string
  available: boolean
  appointmentId?: string
}

export type AppointmentType = "presencial" | "virtual" | "telefonica"
export type AppointmentStatus = "scheduled" | "confirmed" | "completed" | "cancelled" | "no_show"

export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  type: AppointmentType
  status: AppointmentStatus
  patient: string
  psychologist: string
  room?: string
}
