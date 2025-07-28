import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { patientsService } from "@/services/patients"
import type { CreatePatientData } from "@/types/patient"
import { toast } from "@/hooks/use-toast"

export const usePatients = () => {
  return useQuery({
    queryKey: ["patients"],
    queryFn: patientsService.getPatients,
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

export const usePatient = (id: string) => {
  return useQuery({
    queryKey: ["patient", id],
    queryFn: () => patientsService.getPatient(id),
    enabled: !!id,
  })
}

export const useCreatePatient = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: patientsService.createPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] })
      toast({
        title: "Paciente creado",
        description: "El paciente ha sido registrado exitosamente.",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo crear el paciente. Intenta nuevamente.",
        variant: "destructive",
      })
    },
  })
}

export const useUpdatePatient = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreatePatientData> }) =>
      patientsService.updatePatient(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["patients"] })
      queryClient.invalidateQueries({ queryKey: ["patient", id] })
      toast({
        title: "Paciente actualizado",
        description: "Los datos del paciente han sido actualizados.",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar el paciente.",
        variant: "destructive",
      })
    },
  })
}

export const useDeletePatient = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: patientsService.deletePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] })
      toast({
        title: "Paciente eliminado",
        description: "El paciente ha sido eliminado del sistema.",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo eliminar el paciente.",
        variant: "destructive",
      })
    },
  })
}
