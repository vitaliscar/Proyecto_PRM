export interface ReportData {
  id: string
  title: string
  type: "bar" | "line" | "pie" | "doughnut"
  labels: string[]
  datasets: ReportDataset[]
  period: "daily" | "weekly" | "monthly" | "yearly"
  createdAt: string
  updatedAt: string
}

export interface ReportDataset {
  label: string
  data: number[]
  backgroundColor?: string | string[]
  borderColor?: string
  borderWidth?: number
  fill?: boolean
}

export interface ReportMetrics {
  totalPatients: number
  totalAppointments: number
  totalRevenue: number
  averageRating: number
  growthRate: number
  completionRate: number
}

export interface ChartConfig {
  responsive: boolean
  maintainAspectRatio: boolean
  plugins: {
    legend: {
      position: "top" | "bottom" | "left" | "right"
    }
    title: {
      display: boolean
      text: string
    }
  }
  scales?: {
    y: {
      beginAtZero: boolean
    }
  }
}
