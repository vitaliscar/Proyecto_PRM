import type { AgendaData } from "@/types/agenda"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// Datos simulados para desarrollo
const mockAgendaData: AgendaData = {
  date: "27/07/2025",
  appointments: [
    {
      id: "1",
      time: "14:00",
      duration: 60,
      patient: "Juan Pérez",
      patientId: "pat-001",
      psychologist: "Dra. María González",
      psychologistId: "psy-001",
      type: "presencial",
      status: "confirmed",
      room: "Sala 1",
      notes: "Seguimiento de ansiedad",
      priority: "medium",
      reminderSent: true,
    },
    {
      id: "2",
      time: "14:00",
      duration: 45,
      patient: "Ana Rodríguez",
      patientId: "pat-002",
      psychologist: "Dr. Carlos Mendoza",
      psychologistId: "psy-002",
      type: "virtual",
      status: "scheduled",
      notes: "Primera consulta - evaluación inicial",
      priority: "high",
      reminderSent: false,
    },
    {
      id: "3",
      time: "15:30",
      duration: 60,
      patient: "Luis Martínez",
      patientId: "pat-003",
      psychologist: "Dra. María González",
      psychologistId: "psy-001",
      type: "presencial",
      status: "in_progress",
      room: "Sala 2",
      notes: "Terapia cognitivo-conductual",
      priority: "medium",
      reminderSent: true,
    },
    {
      id: "4",
      time: "16:30",
      duration: 45,
      patient: "Carmen Silva",
      patientId: "pat-004",
      psychologist: "Dr. José López",
      psychologistId: "psy-003",
      type: "telefonica",
      status: "scheduled",
      notes: "Seguimiento post-terapia",
      priority: "low",
      reminderSent: true,
    },
  ],
  rooms: [
    {
      id: "1",
      name: "Sala 1",
      status: "occupied",
      currentAppointment: {
        id: "1",
        patient: "Juan Pérez",
        endTime: "15:00",
      },
      nextAvailable: "15:00",
      capacity: 2,
      equipment: ["Escritorio", "Sillas cómodas", "Aire acondicionado"],
    },
    {
      id: "2",
      name: "Sala 2",
      status: "available",
      nextAvailable: "Ahora",
      capacity: 4,
      equipment: ["Mesa redonda", "Sillas múltiples", "Pizarra"],
    },
    {
      id: "3",
      name: "Sala 3",
      status: "maintenance",
      nextAvailable: "17:00",
      capacity: 2,
      equipment: ["Escritorio", "Computadora", "Impresora"],
    },
    {
      id: "4",
      name: "Sala Virtual",
      status: "available",
      nextAvailable: "Ahora",
      capacity: 10,
      equipment: ["Plataforma Zoom", "Grabación", "Chat"],
    },
  ],
  tasks: [
    {
      id: "1",
      description: "Revisar PHQ-9 de Ana Rodríguez",
      type: "evaluation",
      priority: "high",
      dueTime: "13:30",
      completed: false,
      assignedTo: "Dr. Carlos Mendoza",
      relatedPatient: "Ana Rodríguez",
      estimatedDuration: 15,
    },
    {
      id: "2",
      description: "Preparar informe mensual de pacientes",
      type: "administrative",
      priority: "medium",
      dueTime: "18:00",
      completed: false,
      assignedTo: "Dra. María González",
      estimatedDuration: 45,
    },
    {
      id: "3",
      description: "Llamar a Juan Pérez para confirmar próxima cita",
      type: "follow_up",
      priority: "medium",
      completed: true,
      assignedTo: "Recepción",
      relatedPatient: "Juan Pérez",
      estimatedDuration: 10,
    },
    {
      id: "4",
      description: "Actualizar historia clínica de Luis Martínez",
      type: "clinical",
      priority: "high",
      dueTime: "16:00",
      completed: false,
      assignedTo: "Dra. María González",
      relatedPatient: "Luis Martínez",
      estimatedDuration: 20,
    },
  ],
  alerts: [
    {
      id: "1",
      type: "conflict",
      message: "Conflicto de horario a las 14:00 - Dos citas programadas simultáneamente",
      severity: "critical",
      timestamp: "2025-07-27T13:45:00Z",
      resolved: false,
      actionRequired: true,
      suggestions: [
        "Reprogramar cita de Ana Rodríguez para las 14:30",
        "Cambiar cita de Juan Pérez a Sala 2",
        "Contactar a los pacientes para confirmar disponibilidad",
      ],
    },
    {
      id: "2",
      type: "reminder",
      message: "Ana Rodríguez no ha confirmado su cita de las 14:00",
      severity: "medium",
      timestamp: "2025-07-27T13:30:00Z",
      resolved: false,
      actionRequired: true,
      relatedAppointment: "2",
      suggestions: ["Llamar al paciente", "Enviar SMS de recordatorio"],
    },
    {
      id: "3",
      type: "warning",
      message: "Sala 3 en mantenimiento hasta las 17:00",
      severity: "medium",
      timestamp: "2025-07-27T08:00:00Z",
      resolved: false,
      actionRequired: false,
    },
    {
      id: "4",
      type: "info",
      message: "Nuevo protocolo de evaluación PHQ-9 disponible",
      severity: "low",
      timestamp: "2025-07-27T09:00:00Z",
      resolved: false,
      actionRequired: false,
    },
  ],
  stats: {
    totalAppointments: 4,
    completedAppointments: 0,
    availableRooms: 2,
    pendingTasks: 3,
    criticalAlerts: 1,
    efficiency: 85,
  },
}

export const agendaService = {
  async getAgendaData(date: string): Promise<AgendaData> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/agenda/?date=${date}`, {
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`, // Agregar cuando esté disponible
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.warn("API no disponible, usando datos simulados:", error)
      return mockAgendaData
    }
  },

  async resolveAlert(alertId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/agenda/alerts/${alertId}/resolve/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.warn("Error resolviendo alerta:", error)
    }
  },

  async completeTask(taskId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/agenda/tasks/${taskId}/complete/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.warn("Error completando tarea:", error)
    }
  },
}
