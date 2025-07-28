import type { ReportData, ReportMetrics } from "@/types/reports"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// Mock data
const mockReports: ReportData[] = [
  {
    id: "1",
    title: "Citas por Mes",
    type: "bar",
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    datasets: [
      {
        label: "Citas Completadas",
        data: [45, 52, 38, 67, 73, 89],
        backgroundColor: "rgba(34, 197, 94, 0.8)",
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 1,
      },
      {
        label: "Citas Canceladas",
        data: [8, 12, 6, 15, 11, 9],
        backgroundColor: "rgba(239, 68, 68, 0.8)",
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 1,
      },
    ],
    period: "monthly",
    createdAt: "2025-01-27T10:00:00Z",
    updatedAt: "2025-01-27T10:00:00Z",
  },
  {
    id: "2",
    title: "Evolución de Pacientes",
    type: "line",
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    datasets: [
      {
        label: "Pacientes Activos",
        data: [120, 135, 148, 162, 178, 195],
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 2,
        fill: true,
      },
    ],
    period: "monthly",
    createdAt: "2025-01-27T10:00:00Z",
    updatedAt: "2025-01-27T10:00:00Z",
  },
  {
    id: "3",
    title: "Ingresos por Servicio",
    type: "pie",
    labels: ["Consulta Individual", "Terapia de Pareja", "Evaluación", "Terapia Familiar"],
    datasets: [
      {
        label: "Ingresos USD",
        data: [2500, 1800, 900, 1200],
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(168, 85, 247, 0.8)",
          "rgba(249, 115, 22, 0.8)",
        ],
      },
    ],
    period: "monthly",
    createdAt: "2025-01-27T10:00:00Z",
    updatedAt: "2025-01-27T10:00:00Z",
  },
  {
    id: "4",
    title: "Satisfacción del Paciente",
    type: "doughnut",
    labels: ["Muy Satisfecho", "Satisfecho", "Neutral", "Insatisfecho"],
    datasets: [
      {
        label: "Calificaciones",
        data: [65, 25, 8, 2],
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(249, 115, 22, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
      },
    ],
    period: "monthly",
    createdAt: "2025-01-27T10:00:00Z",
    updatedAt: "2025-01-27T10:00:00Z",
  },
]

const mockMetrics: ReportMetrics = {
  totalPatients: 247,
  totalAppointments: 1456,
  totalRevenue: 45750,
  averageRating: 4.7,
  growthRate: 12.5,
  completionRate: 89.3,
}

export const reportsService = {
  async getReports(): Promise<ReportData[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/reports/`)
      if (!response.ok) throw new Error("Failed to fetch reports")
      return await response.json()
    } catch (error) {
      console.warn("Using mock data for reports:", error)
      return mockReports
    }
  },

  async getMetrics(): Promise<ReportMetrics> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/reports/metrics/`)
      if (!response.ok) throw new Error("Failed to fetch metrics")
      return await response.json()
    } catch (error) {
      console.warn("Using mock data for metrics:", error)
      return mockMetrics
    }
  },

  async getReportById(id: string): Promise<ReportData> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/reports/${id}/`)
      if (!response.ok) throw new Error("Failed to fetch report")
      return await response.json()
    } catch (error) {
      console.warn("Using mock data for report:", error)
      const report = mockReports.find((r) => r.id === id)
      if (!report) throw new Error("Report not found")
      return report
    }
  },
}
