import { z } from "zod"

// Validación de cédula venezolana
const cedulaRegex = /^[VEJPGvejpg]-?\d{7,8}$/

export const loginSchema = z.object({
  cedula: z
    .string()
    .min(1, "La cédula es requerida")
    .regex(cedulaRegex, "Formato de cédula inválido (ej: V-12345678)")
    .transform((val) =>
      val
        .toUpperCase()
        .replace("-", "")
        .replace(/^([VEJPG])/, "$1-"),
    ),
  password: z.string().min(1, "La contraseña es requerida").min(6, "La contraseña debe tener al menos 6 caracteres"),
})

export const roleUpdateSchema = z.object({
  userId: z.string().min(1, "ID de usuario requerido"),
  role: z.enum(["administrator", "psychologist", "receptionist", "patient"], {
    errorMap: () => ({ message: "Rol inválido" }),
  }),
  permissions: z.array(z.string()).optional(),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RoleUpdateFormData = z.infer<typeof roleUpdateSchema>
