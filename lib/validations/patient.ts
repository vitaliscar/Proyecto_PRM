import { z } from "zod"

// Regex para validar cédula venezolana
const cedulaRegex = /^[VE]-\d{7,8}$/

// Regex para validar teléfono venezolano
const phoneRegex = /^\+58-\d{3}-\d{7}$/

// Regex para validar fecha DD/MM/YYYY
const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/

export const patientSchema = z.object({
  cedula: z.string().min(1, "La cédula es requerida").regex(cedulaRegex, "Formato de cédula inválido (ej: V-12345678)"),

  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El nombre solo puede contener letras y espacios"),

  birthDate: z
    .string()
    .min(1, "La fecha de nacimiento es requerida")
    .regex(dateRegex, "Formato de fecha inválido (DD/MM/YYYY)")
    .refine((date) => {
      const [day, month, year] = date.split("/").map(Number)
      const birthDate = new Date(year, month - 1, day)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      return age >= 0 && age <= 120
    }, "La edad debe estar entre 0 y 120 años"),

  gender: z.enum(["male", "female", "other"], {
    required_error: "El género es requerido",
  }),

  phone: z
    .string()
    .min(1, "El teléfono es requerido")
    .regex(phoneRegex, "Formato de teléfono inválido (ej: +58-412-1234567)"),

  email: z.string().email("Formato de correo inválido").optional().or(z.literal("")),

  address: z.string().min(1, "La dirección es requerida").max(200, "La dirección no puede exceder 200 caracteres"),

  emergencyContact: z
    .string()
    .min(1, "El contacto de emergencia es requerido")
    .max(100, "El contacto de emergencia no puede exceder 100 caracteres"),

  medicalHistory: z.string().min(1, "La historia médica es requerida"),

  clinicalNotes: z.string().min(1, "Las notas clínicas son requeridas"),

  status: z.enum(["active", "inactive", "waiting"], {
    required_error: "El estado es requerido",
  }),
})

export type PatientFormData = z.infer<typeof patientSchema>
