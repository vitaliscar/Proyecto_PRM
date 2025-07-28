import { useQuery } from "@tanstack/react-query"
import { reportsService } from "@/services/reports"

export function useReports() {
  return useQuery({
    queryKey: ["reports"],
    queryFn: reportsService.getReports,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useReportMetrics() {
  return useQuery({
    queryKey: ["report-metrics"],
    queryFn: reportsService.getMetrics,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useReport(id: string) {
  return useQuery({
    queryKey: ["report", id],
    queryFn: () => reportsService.getReportById(id),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!id,
  })
}
