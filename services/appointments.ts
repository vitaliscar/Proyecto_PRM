import axios from "axios"
import type { Appointment, CreateAppointmentData } from "@/types/appointment"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Datos simulados para desarrollo
const mockAppointments: Appointment[] = [
  {
    id: "1",
    patientId: "1",
    patientName: "Juan Carlos Pérez",
    psychologistId: "psy-1",
    psychologistName: "Dr. María González",
    date: "27/07/2025",
    time: "14:00",
    duration: 60,
    type: "virtual",
    status: "confirmed",
    virtualLink: "https://meet.google.com/abc-defg-hij",
    notes: "Primera consulta - evaluación inicial",
    reminderSent: true,
    createdAt: "2025-07-20T10:00:00Z",
    updatedAt: "2025-07-20T10:00:00Z",
  },
  {
    id: "2",
    patientId: "2",
    patientName: "María Elena Gómez",
    psychologistId: "psy-1",
    psychologistName: "Dr. María González",
    date: "27/07/2025",
    time: "09:00",
    duration: 45,
    type: "presencial",
    status: "scheduled",
    room: "Sala 1 - Consulta Individual",
    notes: "Seguimiento de terapia cognitivo-conductual",
    reminderSent: false,
    createdAt: "2025-07-25T14:00:00Z",
    updatedAt: "2025-07-25T14:00:00Z",
  },
  {
    id: "3",
    patientId: "3",
    patientName: "Ana Sofía Rodríguez",
    psychologistId: "psy-2",
    psychologistName: "Dr. Carlos Mendoza",
    date: "28/07/2025",
    time: "10:30",
    duration: 60,
    type: "presencial",
    status: "confirmed",
    room: "Sala 2 - Terapia Familiar",
    notes: "Sesión familiar - incluye padres",
    reminderSent: true,
    createdAt: "2025-07-22T16:00:00Z",
    updatedAt: "2025-07-26T09:00:00Z",
  },
  {
    id: "4",
    patientId: "1",
    patientName: "Juan Carlos Pérez",
    psychologistId: "psy-1",
    psychologistName: "Dr. María González",
    date: "29/07/2025",
    time: "15:30",
    duration: 45,
    type: "telefonica",
    status: "scheduled",
    notes: "Seguimiento telefónico - revisión de progreso",
    reminderSent: false,
    createdAt: "2025-07-26T11:00:00Z",
    updatedAt: "2025-07-26T11:00:00Z",
  },
  {
    id: "5",
    patientId: "4",
    patientName: "José Antonio López",
    psychologistId: "psy-2",
    psychologistName: "Dr. Carlos Mendoza",
    date: "30/07/2025",
    time: "11:00",
    duration: 60,
    type: "virtual",
    status: "confirmed",
    virtualLink: "https://zoom.us/j/123456789",
    notes: "Evaluación psicológica - aplicación de test",
    reminderSent: true,
    createdAt: "2025-07-24T13:00:00Z",
    updatedAt: "2025-07-25T15:00:00Z",
  },
  {
    id: "6",
    patientId: "2",
    patientName: "María Elena Gómez",
    psychologistId: "psy-1",
    psychologistName: "Dr. María González",
    date: "31/07/2025",
    time: "16:00",
    duration: 45,
    type: "presencial",
    status: "scheduled",
    room: "Sala 1 - Consulta Individual",
    notes: "Revisión de técnicas de relajación",
    reminderSent: false,
    createdAt: "2025-07-26T12:00:00Z",
    updatedAt: "2025-07-26T12:00:00Z",
  },
]

export const appointmentsService = {
  // Obtener todas las citas
  getAppointments: async (): Promise<Appointment[]> => {
    try {
      const response = await api.get("/api/v1/appointments/")
      return response.data
    } catch (error) {
      console.log("Using mock data for appointments")
      return mockAppointments
    }
  },

  // Obtener cita por ID
  getAppointment: async (id: string): Promise<Appointment | null> => {
    try {
      const response = await api.get(`/api/v1/appointments/${id}/`)
      return response.data
    } catch (error) {
      console.log("Using mock data for appointment")
      return mockAppointments.find((a) => a.id === id) || null
    }
  },

  // Obtener citas por fecha
  getAppointmentsByDate: async (date: string): Promise<Appointment[]> => {
    try {
      const response = await api.get(`/api/v1/appointments/?date=${date}`)
      return response.data
    } catch (error) {
      console.log("Using mock data for appointments by date")
      return mockAppointments.filter((a) => a.date === date)
    }
  },

  // Obtener citas por rango de fechas
  getAppointmentsByDateRange: async (startDate: string, endDate: string): Promise<Appointment[]> => {
    try {
      const response = await api.get(`/api/v1/appointments/?start_date=${startDate}&end_date=${endDate}`)
      return response.data
    } catch (error) {
      console.log("Using mock data for appointments by date range")
      return mockAppointments.filter((a) => {
        const appointmentDate = new Date(a.date.split("/").reverse().join("-"))
        const start = new Date(startDate)
        const end = new Date(endDate)
        return appointmentDate >= start && appointmentDate <= end
      })
    }
  },

  // Crear nueva cita
  createAppointment: async (data: CreateAppointmentData): Promise<Appointment> => {
    try {
      const response = await api.post("/api/v1/appointments/", data)
      return response.data
    } catch (error) {
      console.log("Simulating appointment creation")
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        ...data,
        patientName: "Paciente Simulado",
        psychologistName: "Dr. Simulado",
        status: "scheduled",
        reminderSent: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      return newAppointment
    }
  },

  // Actualizar cita
  updateAppointment: async (id: string, data: Partial<CreateAppointmentData>): Promise<Appointment> => {
    try {
      const response = await api.patch(`/api/v1/appointments/${id}/`, data)
      return response.data
    } catch (error) {
      console.log("Simulating appointment update")
      const existingAppointment = mockAppointments.find((a) => a.id === id)
      if (!existingAppointment) throw new Error("Appointment not found")

      return {
        ...existingAppointment,
        ...data,
        updatedAt: new Date().toISOString(),
      }
    }
  },

  // Eliminar cita
  deleteAppointment: async (id: string): Promise<void> => {
    try {
      await api.delete(`/api/v1/appointments/${id}/`)
    } catch (error) {
      console.log("Simulating appointment deletion")
    }
  },

  // Confirmar cita
  confirmAppointment: async (id: string): Promise<Appointment> => {
    try {
      const response = await api.patch(`/api/v1/appointments/${id}/confirm/`)
      return response.data
    } catch (error) {
      console.log("Simulating appointment confirmation")
      const existingAppointment = mockAppointments.find((a) => a.id === id)
      if (!existingAppointment) throw new Error("Appointment not found")

      return {
        ...existingAppointment,
        status: "confirmed",
        updatedAt: new Date().toISOString(),
      }
    }
  },

  // Cancelar cita
  cancelAppointment: async (id: string, reason?: string): Promise<Appointment> => {
    try {
      const response = await api.patch(`/api/v1/appointments/${id}/cancel/`, { reason })
      return response.data
    } catch (error) {
      console.log("Simulating appointment cancellation")
      const existingAppointment = mockAppointments.find((a) => a.id === id)
      if (!existingAppointment) throw new Error("Appointment not found")

      return {
        ...existingAppointment,
        status: "cancelled",
        updatedAt: new Date().toISOString(),
      }
    }
  },
}
