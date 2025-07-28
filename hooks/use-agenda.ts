import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { agendaService } from "@/services/agenda"
import type { AgendaData } from "@/types/agenda"

export function useAgenda(date: string) {
  return useQuery<AgendaData>({
    queryKey: ["agenda", date],
    queryFn: () => agendaService.getAgendaData(date),
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: 30 * 1000, // Refetch cada 30 segundos para datos en tiempo real
  })
}

export function useResolveAlert() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: agendaService.resolveAlert,
    onSuccess: () => {
      // Invalidar y refetch la agenda
      queryClient.invalidateQueries({ queryKey: ["agenda"] })
    },
  })
}

export function useCompleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: agendaService.completeTask,
    onSuccess: () => {
      // Invalidar y refetch la agenda
      queryClient.invalidateQueries({ queryKey: ["agenda"] })
    },
  })
}
