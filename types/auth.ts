export interface User {
  id: string
  cedula: string
  firstName: string
  lastName: string
  email: string
  role: UserRole
  isActive: boolean
  lastLogin?: string
  createdAt: string
  updatedAt: string
}

export interface LoginCredentials {
  cedula: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
  refreshToken: string
  expiresIn: number
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export type UserRole = "administrator" | "psychologist" | "receptionist" | "patient"

export interface RolePermission {
  id: string
  name: string
  description: string
  module: string
  actions: string[]
}

export interface UserRoleConfig {
  id: string
  cedula: string
  firstName: string
  lastName: string
  email: string
  role: UserRole
  permissions: RolePermission[]
  isActive: boolean
  lastLogin?: string
  createdAt: string
}

export interface RoleUpdateRequest {
  userId: string
  role: UserRole
  permissions?: string[]
}
