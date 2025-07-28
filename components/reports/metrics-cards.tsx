"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { ReportMetrics } from "@/types/reports"
import { Users, Calendar, DollarSign, Star, TrendingUp, CheckCircle } from "lucide-react"

interface MetricsCardsProps {
  metrics: ReportMetrics
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  const metricsData = [
    {
      title: "Total Pacientes",
      value: metrics.totalPatients.toLocaleString(),
      icon: Users,
      color: "blue",
      change: "+12%",
    },
    {
      title: "Total Citas",
      value: metrics.totalAppointments.toLocaleString(),
      icon: Calendar,
      color: "green",
      change: "+8%",
    },
    {
      title: "Ingresos Totales",
      value: `$${metrics.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "purple",
      change: "+15%",
    },
    {
      title: "Calificación Promedio",
      value: metrics.averageRating.toFixed(1),
      icon: Star,
      color: "yellow",
      change: "+0.2",
    },
    {
      title: "Tasa de Crecimiento",
      value: `${metrics.growthRate}%`,
      icon: TrendingUp,
      color: "indigo",
      change: "+2.5%",
    },
    {
      title: "Tasa de Finalización",
      value: `${metrics.completionRate}%`,
      icon: CheckCircle,
      color: "emerald",
      change: "+3.1%",
    },
  ]

  const colorClasses = {
    blue: {
      bg: "from-blue-50 to-indigo-50",
      border: "border-blue-200",
      icon: "text-blue-600",
      text: "text-blue-800",
      change: "text-blue-600",
    },
    green: {
      bg: "from-green-50 to-emerald-50",
      border: "border-green-200",
      icon: "text-green-600",
      text: "text-green-800",
      change: "text-green-600",
    },
    purple: {
      bg: "from-purple-50 to-violet-50",
      border: "border-purple-200",
      icon: "text-purple-600",
      text: "text-purple-800",
      change: "text-purple-600",
    },
    yellow: {
      bg: "from-yellow-50 to-amber-50",
      border: "border-yellow-200",
      icon: "text-yellow-600",
      text: "text-yellow-800",
      change: "text-yellow-600",
    },
    indigo: {
      bg: "from-indigo-50 to-blue-50",
      border: "border-indigo-200",
      icon: "text-indigo-600",
      text: "text-indigo-800",
      change: "text-indigo-600",
    },
    emerald: {
      bg: "from-emerald-50 to-green-50",
      border: "border-emerald-200",
      icon: "text-emerald-600",
      text: "text-emerald-800",
      change: "text-emerald-600",
    },
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metricsData.map((metric, index) => {
        const Icon = metric.icon
        const colors = colorClasses[metric.color as keyof typeof colorClasses]

        return (
          <Card key={index} className={`bg-gradient-to-r ${colors.bg} ${colors.border}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${colors.text}`}>{metric.title}</p>
                  <p className={`text-3xl font-bold ${colors.text} mt-2`}>{metric.value}</p>
                  <p className={`text-sm ${colors.change} mt-1`}>{metric.change} vs mes anterior</p>
                </div>
                <div className={`p-3 rounded-full bg-white/50`}>
                  <Icon className={`h-8 w-8 ${colors.icon}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
