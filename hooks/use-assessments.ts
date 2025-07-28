import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { assessmentsService } from "@/services/assessments"
import type { CreateAssessmentData } from "@/types/assessment"
import { toast } from "@/hooks/use-toast"

export const useAssessments = () => {
  return useQuery({
    queryKey: ["assessments"],
    queryFn: assessmentsService.getAssessments,
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

export const useAssessment = (id: string) => {
  return useQuery({
    queryKey: ["assessment", id],
    queryFn: () => assessmentsService.getAssessment(id),
    enabled: !!id,
  })
}

export const useAssessmentTemplates = () => {
  return useQuery({
    queryKey: ["assessment-templates"],
    queryFn: assessmentsService.getAssessmentTemplates,
    staleTime: 30 * 60 * 1000, // 30 minutos - las plantillas cambian poco
  })
}

export const useCreateAssessment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: assessmentsService.createAssessment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] })
      toast({
        title: "Evaluación completada",
        description: "La evaluación ha sido procesada exitosamente.",
        className: "bg-green-50 border-green-200 text-green-800",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo completar la evaluación. Intenta nuevamente.",
        variant: "destructive",
      })
    },
  })
}

export const useUpdateAssessment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateAssessmentData> }) =>
      assessmentsService.updateAssessment(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] })
      queryClient.invalidateQueries({ queryKey: ["assessment", id] })
      toast({
        title: "Evaluación actualizada",
        description: "Los datos de la evaluación han sido actualizados.",
        className: "bg-green-50 border-green-200 text-green-800",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar la evaluación.",
        variant: "destructive",
      })
    },
  })
}

export const useDeleteAssessment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: assessmentsService.deleteAssessment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] })
      toast({
        title: "Evaluación eliminada",
        description: "La evaluación ha sido eliminada del sistema.",
        className: "bg-green-50 border-green-200 text-green-800",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo eliminar la evaluación.",
        variant: "destructive",
      })
    },
  })
}
