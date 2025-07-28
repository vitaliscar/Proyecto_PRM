import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { recordsService } from "@/services/records"
import type { ClinicalRecord } from "@/types/record"
import { toast } from "@/hooks/use-toast"

export function useRecord(id: string) {
  return useQuery({
    queryKey: ["record", id],
    queryFn: () => recordsService.getRecord(id),
    staleTime: 5 * 60 * 1000, // 5 minutos
    enabled: !!id,
  })
}

export function useUpdateRecord() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ClinicalRecord> }) => recordsService.updateRecord(id, data),
    onSuccess: (updatedRecord) => {
      queryClient.setQueryData(["record", updatedRecord.id], updatedRecord)
      queryClient.invalidateQueries({ queryKey: ["records"] })
      toast({
        title: "Historia actualizada",
        description: "Los cambios se han guardado correctamente",
      })
    },
    onError: (error) => {
      toast({
        title: "Error al actualizar",
        description: error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      })
    },
  })
}

export function useUpdateSection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ recordId, sectionId, content }: { recordId: string; sectionId: string; content: string }) =>
      recordsService.updateSection(recordId, sectionId, content),
    onMutate: async ({ recordId, sectionId, content }) => {
      // Cancelar queries en curso
      await queryClient.cancelQueries({ queryKey: ["record", recordId] })

      // Snapshot del estado anterior
      const previousRecord = queryClient.getQueryData<ClinicalRecord>(["record", recordId])

      // Actualización optimista
      if (previousRecord) {
        const updatedSections = previousRecord.sections.map((section) =>
          section.id === sectionId ? { ...section, content, hasUnsavedChanges: false } : section,
        )
        queryClient.setQueryData(["record", recordId], {
          ...previousRecord,
          sections: updatedSections,
        })
      }

      return { previousRecord }
    },
    onError: (error, variables, context) => {
      // Revertir en caso de error
      if (context?.previousRecord) {
        queryClient.setQueryData(["record", variables.recordId], context.previousRecord)
      }
      toast({
        title: "Error al guardar",
        description: error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      })
    },
    onSuccess: (updatedRecord) => {
      queryClient.setQueryData(["record", updatedRecord.id], updatedRecord)
      toast({
        title: "Sección actualizada",
        description: "Los cambios se han guardado correctamente",
      })
    },
  })
}

export function useAuditLog(recordId: string) {
  return useQuery({
    queryKey: ["audit", recordId],
    queryFn: () => recordsService.getAuditLog(recordId),
    staleTime: 2 * 60 * 1000, // 2 minutos
    enabled: !!recordId,
  })
}

export function useCreateRecord() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: recordsService.createRecord,
    onSuccess: (newRecord) => {
      queryClient.invalidateQueries({ queryKey: ["records"] })
      queryClient.setQueryData(["record", newRecord.id], newRecord)
      toast({
        title: "Historia creada",
        description: "La historia clínica se ha creado correctamente",
      })
    },
    onError: (error) => {
      toast({
        title: "Error al crear",
        description: error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      })
    },
  })
}
