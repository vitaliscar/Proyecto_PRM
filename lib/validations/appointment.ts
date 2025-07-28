import { z } from "zod"

// Regex para validar hora en formato HH:MM
const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/

// Regex para validar fecha DD/MM/YYYY
const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/

export const appointmentSchema = z.object({
  patientId: z.string().min(1, "Debe seleccionar un paciente"),

  psychologistId: z.string().min(1, "Debe seleccionar un psicólogo"),

  date: z
    .string()
    .min(1, "La fecha es requerida")
    .regex(dateRegex, "Formato de fecha inválido (DD/MM/YYYY)")
    .refine((date) => {
      const [day, month, year] = date.split("/").map(Number)
      const appointmentDate = new Date(year, month - 1, day)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return appointmentDate >= today
    }, "La fecha no puede ser anterior a hoy"),

  time: z
    .string()
    .min(1, "La hora es requerida")
    .regex(timeRegex, "Formato de hora inválido (HH:MM)")
    .refine((time) => {
      const [hours, minutes] = time.split(":").map(Number)
      return hours >= 8 && hours <= 18
    }, "La hora debe estar entre 08:00 y 18:00"),

  duration: z
    .number()
    .min(15, "La duración mínima es 15 minutos")
    .max(180, "La duración máxima es 3 horas")
    .refine((duration) => duration % 15 === 0, "La duración debe ser múltiplo de 15 minutos"),

  type: z.enum(["presencial", "virtual", "telefonica"], {
    required_error: "Debe seleccionar el tipo de cita",
  }),

  room: z.string().optional(),

  virtualLink: z.string().url("Debe ser una URL válida").optional().or(z.literal("")),

  notes: z.string().max(500, "Las notas no pueden exceder 500 caracteres").optional(),
})

export type AppointmentFormData = z.infer<typeof appointmentSchema>

// Validación condicional para campos según tipo de cita
export const validateAppointmentByType = (data: AppointmentFormData) => {
  const errors: string[] = []

  if (data.type === "presencial" && !data.room) {
    errors.push("Debe seleccionar una sala para citas presenciales")
  }

  if (data.type === "virtual" && !data.virtualLink) {
    errors.push("Debe proporcionar un enlace para citas virtuales")
  }

  return errors
}
