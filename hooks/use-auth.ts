"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { authService } from "@/services/auth"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

export function useLogin() {
  const router = useRouter()

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      // Guardar tokens y usuario en localStorage
      localStorage.setItem("token", data.token)
      localStorage.setItem("refreshToken", data.refreshToken)
      localStorage.setItem("user", JSON.stringify(data.user))

      toast({
        title: "Inicio de sesión exitoso",
        description: `Bienvenido, ${data.user.firstName} ${data.user.lastName}`,
      })

      // Redirigir según el rol
      switch (data.user.role) {
        case "administrator":
          router.push("/dashboard")
          break
        case "psychologist":
          router.push("/patients")
          break
        case "receptionist":
          router.push("/appointments")
          break
        case "patient":
          router.push("/patient-portal")
          break
        default:
          router.push("/dashboard")
      }
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error de autenticación",
        description: error.message,
      })
    },
  })
}

export function useUserRoles() {
  return useQuery({
    queryKey: ["userRoles"],
    queryFn: authService.getUserRoles,
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
  })
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authService.updateUserRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userRoles"] })
      toast({
        title: "Rol actualizado",
        description: "El rol del usuario ha sido actualizado exitosamente",
      })
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error al actualizar rol",
        description: error.message,
      })
    },
  })
}

export function useLogout() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.clear()
      router.push("/auth/login")
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente",
      })
    },
  })
}

export function useCurrentUser() {
  const userStr = typeof window !== "undefined" ? localStorage.getItem("user") : null
  return userStr ? JSON.parse(userStr) : null
}

export function useIsAuthenticated() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  return !!token
}
