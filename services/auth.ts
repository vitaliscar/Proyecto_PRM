import type { LoginCredentials, LoginResponse, UserRoleConfig, RoleUpdateRequest } from "@/types/auth"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// Datos simulados para desarrollo
const mockUsers: UserRoleConfig[] = [
  {
    id: "1",
    cedula: "V-12345678",
    firstName: "Dr. Carlos",
    lastName: "Rodríguez",
    email: "carlos.rodriguez@creces.com",
    role: "psychologist",
    permissions: [
      {
        id: "1",
        name: "Gestión de Pacientes",
        description: "Crear, editar y ver pacientes",
        module: "patients",
        actions: ["create", "read", "update"],
      },
      {
        id: "2",
        name: "Evaluaciones Psicológicas",
        description: "Realizar y revisar evaluaciones",
        module: "assessments",
        actions: ["create", "read", "update"],
      },
    ],
    isActive: true,
    lastLogin: "2025-01-27T10:30:00Z",
    createdAt: "2024-01-15T08:00:00Z",
  },
  {
    id: "2",
    cedula: "V-87654321",
    firstName: "María",
    lastName: "González",
    email: "maria.gonzalez@creces.com",
    role: "administrator",
    permissions: [
      {
        id: "1",
        name: "Administración Completa",
        description: "Acceso total al sistema",
        module: "all",
        actions: ["create", "read", "update", "delete"],
      },
    ],
    isActive: true,
    lastLogin: "2025-01-27T09:15:00Z",
    createdAt: "2024-01-10T08:00:00Z",
  },
  {
    id: "3",
    cedula: "V-11223344",
    firstName: "Ana",
    lastName: "Martínez",
    email: "ana.martinez@creces.com",
    role: "receptionist",
    permissions: [
      {
        id: "3",
        name: "Gestión de Citas",
        description: "Programar y gestionar citas",
        module: "appointments",
        actions: ["create", "read", "update"],
      },
      {
        id: "4",
        name: "Recepción",
        description: "Funciones de recepción",
        module: "reception",
        actions: ["read", "update"],
      },
    ],
    isActive: true,
    lastLogin: "2025-01-27T08:45:00Z",
    createdAt: "2024-02-01T08:00:00Z",
  },
  {
    id: "4",
    cedula: "V-55667788",
    firstName: "Juan",
    lastName: "Pérez",
    email: "juan.perez@email.com",
    role: "patient",
    permissions: [
      {
        id: "5",
        name: "Portal del Paciente",
        description: "Ver información personal y citas",
        module: "patient-portal",
        actions: ["read"],
      },
    ],
    isActive: true,
    lastLogin: "2025-01-26T16:20:00Z",
    createdAt: "2024-03-15T10:30:00Z",
  },
]

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      // Intentar con API real primero
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        throw new Error("Error en el servidor")
      }

      return await response.json()
    } catch (error) {
      // Fallback a datos simulados
      console.warn("API no disponible, usando datos simulados:", error)

      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Buscar usuario por cédula
      const user = mockUsers.find((u) => u.cedula === credentials.cedula)

      if (!user) {
        throw new Error("Cédula no encontrada")
      }

      if (!user.isActive) {
        throw new Error("Usuario inactivo")
      }

      // Simular validación de contraseña (en producción sería hasheada)
      if (credentials.password !== "123456") {
        throw new Error("Contraseña incorrecta")
      }

      return {
        user: {
          id: user.id,
          cedula: user.cedula,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          updatedAt: new Date().toISOString(),
        },
        token: `mock-jwt-token-${user.id}`,
        refreshToken: `mock-refresh-token-${user.id}`,
        expiresIn: 3600,
      }
    }
  },

  async getUserRoles(): Promise<UserRoleConfig[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/users/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) {
        throw new Error("Error al obtener usuarios")
      }

      return await response.json()
    } catch (error) {
      console.warn("API no disponible, usando datos simulados:", error)
      await new Promise((resolve) => setTimeout(resolve, 500))
      return mockUsers
    }
  },

  async updateUserRole(request: RoleUpdateRequest): Promise<UserRoleConfig> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/users/${request.userId}/role/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error("Error al actualizar rol")
      }

      return await response.json()
    } catch (error) {
      console.warn("API no disponible, usando datos simulados:", error)
      await new Promise((resolve) => setTimeout(resolve, 800))

      const userIndex = mockUsers.findIndex((u) => u.id === request.userId)
      if (userIndex === -1) {
        throw new Error("Usuario no encontrado")
      }

      mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        role: request.role,
      }

      return mockUsers[userIndex]
    }
  },

  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/api/v1/auth/logout/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
    } catch (error) {
      console.warn("Error al hacer logout en el servidor:", error)
    } finally {
      localStorage.removeItem("token")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("user")
    }
  },
}
