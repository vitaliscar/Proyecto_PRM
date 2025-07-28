import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { appointmentsService } from "@/services/appointments"
import type { CreateAppointmentData } from "@/types/appointment"
import { toast } from "@/hooks/use-toast"

export const useAppointments = () => {
  return useQuery({
    queryKey: ["appointments"],
    queryFn: appointmentsService.getAppointments,
    staleTime: 2 * 60 * 1000, // 2 minutos
  })
}

export const useAppointment = (id: string) => {
  return useQuery({
    queryKey: ["appointment", id],
    queryFn: () => appointmentsService.getAppointment(id),
    enabled: !!id,
  })
}

export const useAppointmentsByDate = (date: string) => {
  return useQuery({
    queryKey: ["appointments", "date", date],
    queryFn: () => appointmentsService.getAppointmentsByDate(date),
    enabled: !!date,
    staleTime: 1 * 60 * 1000, // 1 minuto
  })
}

export const useAppointmentsByDateRange = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ["appointments", "range", startDate, endDate],
    queryFn: () => appointmentsService.getAppointmentsByDateRange(startDate, endDate),
    enabled: !!startDate && !!endDate,
    staleTime: 2 * 60 * 1000, // 2 minutos
  })
}

export const useCreateAppointment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: appointmentsService.createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] })
      toast({
        title: "Cita creada",
        description: "La cita ha sido programada exitosamente.",
        className: "bg-blue-50 border-blue-200 text-blue-800",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo crear la cita. Intenta nuevamente.",
        variant: "destructive",
      })
    },
  })
}

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateAppointmentData> }) =>
      appointmentsService.updateAppointment(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] })
      queryClient.invalidateQueries({ queryKey: ["appointment", id] })
      toast({
        title: "Cita actualizada",
        description: "Los datos de la cita han sido actualizados.",
        className: "bg-blue-50 border-blue-200 text-blue-800",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar la cita.",
        variant: "destructive",
      })
    },
  })
}

export const useDeleteAppointment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: appointmentsService.deleteAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] })
      toast({
        title: "Cita eliminada",
        description: "La cita ha sido eliminada del sistema.",
        className: "bg-blue-50 border-blue-200 text-blue-800",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo eliminar la cita.",
        variant: "destructive",
      })
    },
  })
}

export const useConfirmAppointment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: appointmentsService.confirmAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] })
      toast({
        title: "Cita confirmada",
        description: "La cita ha sido confirmada exitosamente.",
        className: "bg-green-50 border-green-200 text-green-800",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo confirmar la cita.",
        variant: "destructive",
      })
    },
  })
}

export const useCancelAppointment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => appointmentsService.cancelAppointment(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] })
      toast({
        title: "Cita cancelada",
        description: "La cita ha sido cancelada.",
        className: "bg-yellow-50 border-yellow-200 text-yellow-800",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo cancelar la cita.",
        variant: "destructive",
      })
    },
  })
}
