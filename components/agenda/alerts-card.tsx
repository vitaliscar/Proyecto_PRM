"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, AlertCircle, Info, CheckCircle, X, Clock, Lightbulb } from "lucide-react"
import type { AgendaAlert } from "@/types/agenda"
import { useResolveAlert } from "@/hooks/use-agenda"

interface AlertsCardProps {
  alerts: AgendaAlert[]
}

export function AlertsCard({ alerts }: AlertsCardProps) {
  const resolveAlertMutation = useResolveAlert()

  const getAlertIcon = (type: string, severity: string) => {
    if (severity === "critical") {
      return <AlertTriangle size={20} className="text-red-600" />
    }

    switch (type) {
      case "conflict":
        return <AlertTriangle size={20} className="text-red-600" />
      case "reminder":
        return <Clock size={20} className="text-blue-600" />
      case "warning":
        return <AlertCircle size={20} className="text-orange-600" />
      case "info":
        return <Info size={20} className="text-blue-600" />
      case "urgent":
        return <AlertTriangle size={20} className="text-red-600" />
      default:
        return <Info size={20} className="text-gray-600" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "border-l-red-600 bg-red-50"
      case "high":
        return "border-l-red-500 bg-red-50"
      case "medium":
        return "border-l-yellow-500 bg-yellow-50"
      case "low":
        return "border-l-blue-500 bg-blue-50"
      default:
        return "border-l-gray-300 bg-gray-50"
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge className="bg-red-100 text-red-800 animate-pulse">Crítica</Badge>
      case "high":
        return <Badge className="bg-red-100 text-red-800">Alta</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Media</Badge>
      case "low":
        return <Badge className="bg-blue-100 text-blue-800">Baja</Badge>
      default:
        return null
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "conflict":
        return <Badge className="bg-red-100 text-red-800">Conflicto</Badge>
      case "reminder":
        return <Badge className="bg-blue-100 text-blue-800">Recordatorio</Badge>
      case "warning":
        return <Badge className="bg-orange-100 text-orange-800">Advertencia</Badge>
      case "info":
        return <Badge className="bg-blue-100 text-blue-800">Información</Badge>
      case "urgent":
        return <Badge className="bg-red-100 text-red-800">Urgente</Badge>
      default:
        return null
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString("es-VE", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleResolveAlert = (alertId: string) => {
    resolveAlertMutation.mutate(alertId)
  }

  const activeAlerts = alerts.filter((alert) => !alert.resolved)
  const criticalAlerts = activeAlerts.filter((alert) => alert.severity === "critical")

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <CardTitle className="flex items-center justify-between text-gray-900">
          <div className="flex items-center">
            <AlertTriangle className="mr-2" size={20} />
            Alertas Inteligentes
          </div>
          <div className="text-sm font-normal">
            {criticalAlerts.length > 0 && (
              <>
                <span className="text-red-600 font-medium animate-pulse">{criticalAlerts.length} críticas</span>
                <span className="text-gray-400 mx-2">•</span>
              </>
            )}
            <span className="text-orange-600 font-medium">{activeAlerts.length} activas</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {activeAlerts.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <CheckCircle size={48} className="mx-auto mb-4 text-green-400" />
            <p className="text-lg font-medium text-green-600">¡Todo bajo control!</p>
            <p className="text-sm">No hay alertas activas en este momento.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 border-l-4 ${getSeverityColor(alert.severity)} transition-all duration-200`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {getAlertIcon(alert.type, alert.severity)}

                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{alert.message}</h3>
                      </div>

                      <div className="flex items-center space-x-2 mb-3">
                        {getTypeBadge(alert.type)}
                        {getSeverityBadge(alert.severity)}
                        <span className="text-xs text-gray-500">{formatTime(alert.timestamp)}</span>
                      </div>

                      {alert.suggestions && alert.suggestions.length > 0 && (
                        <div className="mt-3 p-3 bg-white border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Lightbulb size={16} className="text-yellow-600" />
                            <p className="text-sm font-medium text-gray-900">Sugerencias de IA:</p>
                          </div>
                          <ul className="space-y-1">
                            {alert.suggestions.map((suggestion, index) => (
                              <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                                <span className="text-blue-600 mt-1">•</span>
                                <span>{suggestion}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    {alert.actionRequired && (
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                        Actuar
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResolveAlert(alert.id)}
                      disabled={resolveAlertMutation.isPending}
                    >
                      <X size={14} className="mr-1" />
                      Resolver
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
