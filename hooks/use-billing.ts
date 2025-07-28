import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { billingService } from "@/services/billing"
import type { Invoice } from "@/types/billing"

export function useInvoices() {
  return useQuery({
    queryKey: ["invoices"],
    queryFn: billingService.getInvoices,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function usePayments() {
  return useQuery({
    queryKey: ["payments"],
    queryFn: billingService.getPayments,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useCreatePayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: billingService.createPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] })
      queryClient.invalidateQueries({ queryKey: ["invoices"] })
    },
  })
}

export function useUpdateInvoiceStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Invoice["status"] }) =>
      billingService.updateInvoiceStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] })
    },
  })
}
