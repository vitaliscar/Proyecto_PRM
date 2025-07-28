"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ReportData, ChartConfig } from "@/types/reports"
import { BarChart3, TrendingUp, PieChart, Activity } from "lucide-react"

// Import Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2"

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
)

interface ChartCardProps {
  report: ReportData
}

const chartIcons = {
  bar: BarChart3,
  line: TrendingUp,
  pie: PieChart,
  doughnut: Activity,
}

export function ChartCard({ report }: ChartCardProps) {
  const Icon = chartIcons[report.type]

  const chartData = {
    labels: report.labels,
    datasets: report.datasets,
  }

  const chartConfig: ChartConfig = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
        text: report.title,
      },
    },
  }

  // Add scales for bar and line charts
  if (report.type === "bar" || report.type === "line") {
    chartConfig.scales = {
      y: {
        beginAtZero: true,
      },
    }
  }

  const renderChart = () => {
    switch (report.type) {
      case "bar":
        return <Bar data={chartData} options={chartConfig} />
      case "line":
        return <Line data={chartData} options={chartConfig} />
      case "pie":
        return <Pie data={chartData} options={chartConfig} />
      case "doughnut":
        return <Doughnut data={chartData} options={chartConfig} />
      default:
        return <div className="text-center text-gray-500">Tipo de gráfico no soportado</div>
    }
  }

  return (
    <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-green-800">
          <Icon className="h-5 w-5" />
          <span>{report.title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">{renderChart()}</div>
        <div className="mt-4 text-sm text-green-600">
          Período:{" "}
          {report.period === "monthly"
            ? "Mensual"
            : report.period === "weekly"
              ? "Semanal"
              : report.period === "daily"
                ? "Diario"
                : "Anual"}
        </div>
      </CardContent>
    </Card>
  )
}
