"use client"

import { ReportDashboard } from "@/components/reports/report-dashboard"

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reportes y Analítica</h1>
          <p className="text-gray-600 mt-2">Dashboard con gráficos y métricas del centro psicológico</p>
        </div>

        <ReportDashboard />
      </div>
    </div>
  )
}
