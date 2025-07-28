import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { marketingService } from "@/services/marketing"
import type { Lead } from "@/types/marketing"

export function useLeads() {
  return useQuery({
    queryKey: ["leads"],
    queryFn: marketingService.getLeads,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useCampaigns() {
  return useQuery({
    queryKey: ["campaigns"],
    queryFn: marketingService.getCampaigns,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useCreateCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: marketingService.createCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] })
    },
  })
}

export function useUpdateLeadStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Lead["status"] }) =>
      marketingService.updateLeadStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] })
    },
  })
}
