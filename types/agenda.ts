export interface AgendaData {
  date: string
  appointments: AgendaAppointment[]
  rooms: AgendaRoom[]
  tasks: AgendaTask[]
  alerts: AgendaAlert[]
  stats: AgendaStats
}

export interface AgendaAppointment {
  id: string
  time: string
  duration: number
  patient: string
  patientId: string
  psychologist: string
  psychologistId: string
  type: "presencial" | "virtual" | "telefonica"
  status: "scheduled" | "confirmed" | "in_progress" | "completed" | "cancelled"
  room?: string
  notes?: string
  priority: "low" | "medium" | "high"
  reminderSent: boolean
}

export interface AgendaRoom {
  id: string
  name: string
  status: "available" | "occupied" | "maintenance" | "reserved"
  currentAppointment?: {
    id: string
    patient: string
    endTime: string
  }
  nextAvailable: string
  capacity: number
  equipment: string[]
}

export interface AgendaTask {
  id: string
  description: string
  type: "clinical" | "administrative" | "follow_up" | "evaluation"
  priority: "low" | "medium" | "high"
  dueTime?: string
  completed: boolean
  assignedTo: string
  relatedPatient?: string
  estimatedDuration: number
}

export interface AgendaAlert {
  id: string
  type: "conflict" | "reminder" | "warning" | "info" | "urgent"
  message: string
  severity: "low" | "medium" | "high" | "critical"
  timestamp: string
  resolved: boolean
  actionRequired: boolean
  relatedAppointment?: string
  suggestions?: string[]
}

export interface AgendaStats {
  totalAppointments: number
  completedAppointments: number
  availableRooms: number
  pendingTasks: number
  criticalAlerts: number
  efficiency: number
}
