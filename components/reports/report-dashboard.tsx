"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useReports, useReportMetrics } from "@/hooks/use-reports"
import { ChartCard } from "./chart-card"
import { MetricsCards } from "./metrics-cards"
import { BarChart3, Download, RefreshCw, Calendar } from "lucide-react"
import { useState } from "react"

export function ReportDashboard() {
  const { data: reports = [], isLoading: reportsLoading, error: reportsError } = useReports()
  const { data: metrics, isLoading: metricsLoading, error: metricsError } = useReportMetrics()
  const [selectedPeriod, setSelectedPeriod] = useState("monthly")

  const filteredReports = reports.filter((report) => report.period === selectedPeriod)

  if (reportsLoading || metricsLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (reportsError || metricsError) {
    return (
      <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
        <CardContent className="p-6">
          <div className="text-center text-red-600">Error al cargar los reportes. Por favor, intenta nuevamente.</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2 text-green-800">
              <BarChart3 className="h-6 w-6" />
              <span>Dashboard de Reportes y Analítica</span>
            </CardTitle>
            <div className="flex items-center space-x-4">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-40 bg-white border-green-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Diario</SelectItem>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="monthly">Mensual</SelectItem>
                  <SelectItem value="yearly">Anual</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                className="border-green-200 text-green-600 hover:bg-green-50 bg-transparent"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-green-200 text-green-600 hover:bg-green-50 bg-transparent"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Metrics Cards */}
      {metrics && <MetricsCards metrics={metrics} />}

      {/* Period Info */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 text-green-800">
            <Calendar className="h-5 w-5" />
            <span className="font-medium">
              Mostrando datos del período:{" "}
              {selectedPeriod === "monthly"
                ? "Mensual"
                : selectedPeriod === "weekly"
                  ? "Semanal"
                  : selectedPeriod === "daily"
                    ? "Diario"
                    : "Anual"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredReports.map((report) => (
          <ChartCard key={report.id} report={report} />
        ))}
      </div>

      {/* Empty State */}
      {filteredReports.length === 0 && (
        <Card className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200">
          <CardContent className="p-8">
            <div className="text-center text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay reportes disponibles</h3>
              <p className="text-gray-600">No se encontraron reportes para el período seleccionado.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">Resumen del Período</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-800">{filteredReports.length}</div>
              <div className="text-sm text-green-600">Reportes Generados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-800">{metrics?.totalPatients || 0}</div>
              <div className="text-sm text-green-600">Pacientes Activos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-800">{metrics?.completionRate || 0}%</div>
              <div className="text-sm text-green-600">Tasa de Finalización</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
