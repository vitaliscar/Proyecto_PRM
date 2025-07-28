"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  FileText,
  User,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Brain,
  Download,
  Share,
  Clock,
  Target,
} from "lucide-react"
import { useAssessment } from "@/hooks/use-assessments"
import type { RiskLevel } from "@/types/assessment"

interface AssessmentDetailsProps {
  assessmentId: string
}

export function AssessmentDetails({ assessmentId }: AssessmentDetailsProps) {
  const router = useRouter()
  const { data: assessment, isLoading, error } = useAssessment(assessmentId)

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    )
  }

  if (error || !assessment) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">Error al cargar la evaluación.</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getRiskBadge = (risk: RiskLevel) => {
    const variants = {
      low: "bg-green-100 text-green-800 border-green-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      high: "bg-red-100 text-red-800 border-red-200",
      critical: "bg-red-200 text-red-900 border-red-300 font-semibold",
    }

    const labels = {
      low: "Bajo Riesgo",
      medium: "Riesgo Medio",
      high: "Alto Riesgo",
      critical: "Riesgo Crítico",
    }

    return <Badge className={variants[risk]}>{labels[risk]}</Badge>
  }

  const getScorePercentage = () => {
    return (assessment.score / assessment.maxScore) * 100
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()} className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Evaluación {assessment.type}</h1>
            <p className="text-gray-600 mt-1">
              {assessment.patientName} • {assessment.date}
            </p>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
          <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent">
            <Share className="w-4 h-4 mr-2" />
            Compartir
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <Calendar className="w-4 h-4 mr-2" />
            Programar Seguimiento
          </Button>
        </div>
      </div>

      {/* Alerta de Riesgo */}
      {(assessment.riskLevel === "high" || assessment.riskLevel === "critical") && (
        <Alert
          className={`border-2 ${
            assessment.riskLevel === "critical" ? "border-red-300 bg-red-50" : "border-red-200 bg-red-50"
          }`}
        >
          <AlertTriangle
            className={`h-4 w-4 ${assessment.riskLevel === "critical" ? "text-red-600" : "text-red-600"}`}
          />
          <AlertDescription
            className={`font-medium ${assessment.riskLevel === "critical" ? "text-red-800" : "text-red-800"}`}
          >
            {assessment.alerts}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resultados Principales */}
        <div className="lg:col-span-2 space-y-6">
          {/* Resumen de Resultados */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-green-50 border-b border-green-100">
              <CardTitle className="flex items-center text-lg">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Resultados de la Evaluación
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Puntaje */}
                <div className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#E5E7EB"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke={
                          assessment.riskLevel === "critical"
                            ? "#DC2626"
                            : assessment.riskLevel === "high"
                              ? "#EF4444"
                              : assessment.riskLevel === "medium"
                                ? "#F59E0B"
                                : "#10B981"
                        }
                        strokeWidth="3"
                        strokeDasharray={`${getScorePercentage()}, 100`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{assessment.score}</div>
                        <div className="text-sm text-gray-600">de {assessment.maxScore}</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">{Math.round(getScorePercentage())}% del puntaje máximo</div>
                </div>

                {/* Interpretación */}
                <div className="text-center">
                  <div className="mb-4">
                    <Brain className="w-16 h-16 mx-auto text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{assessment.interpretation}</h3>
                  {getRiskBadge(assessment.riskLevel)}
                </div>

                {/* Estado */}
                <div className="text-center">
                  <div className="mb-4">
                    <CheckCircle className="w-16 h-16 mx-auto text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Evaluación Completada</h3>
                  <div className="text-sm text-gray-600">{assessment.date}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recomendaciones */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-green-50 border-b border-green-100">
              <CardTitle className="flex items-center text-lg">
                <Target className="w-5 h-5 mr-2 text-green-600" />
                Recomendaciones Clínicas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {assessment.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900">{recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Respuestas Detalladas */}
          {assessment.responses.length > 0 && (
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="bg-green-50 border-b border-green-100">
                <CardTitle className="flex items-center text-lg">
                  <FileText className="w-5 h-5 mr-2 text-green-600" />
                  Respuestas Detalladas
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {assessment.responses.map((response, index) => (
                    <div key={response.questionId} className="border-b border-gray-100 pb-4 last:border-b-0">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-2">{response.questionText}</h4>
                          <div className="flex items-center justify-between">
                            <span className="text-green-700 font-medium">{response.answerText}</span>
                            <Badge variant="outline" className="text-xs">
                              {response.answer} pts
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Información del Paciente */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-green-50 border-b border-green-100">
              <CardTitle className="flex items-center text-lg">
                <User className="w-5 h-5 mr-2 text-green-600" />
                Información del Paciente
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage
                    src={`/placeholder.svg?height=48&width=48&query=${assessment.patientName}`}
                    alt={assessment.patientName}
                  />
                  <AvatarFallback className="bg-green-100 text-green-700 font-medium">
                    {getInitials(assessment.patientName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900">{assessment.patientName}</h3>
                  <p className="text-sm text-gray-600">ID: {assessment.patientId}</p>
                </div>
              </div>

              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <User className="w-4 h-4 mr-2" />
                  Ver Perfil Completo
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Calendar className="w-4 h-4 mr-2" />
                  Historial de Citas
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <FileText className="w-4 h-4 mr-2" />
                  Otras Evaluaciones
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Información de la Evaluación */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-green-50 border-b border-green-100">
              <CardTitle className="text-lg">Detalles de la Evaluación</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Tipo</label>
                <p className="text-lg font-semibold">{assessment.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Fecha de Aplicación</label>
                <p className="text-lg">{assessment.date}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Estado</label>
                <div className="mt-1">
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">Completada</Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Nivel de Riesgo</label>
                <div className="mt-1">{getRiskBadge(assessment.riskLevel)}</div>
              </div>
            </CardContent>
          </Card>

          {/* Información del Sistema */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-green-50 border-b border-green-100">
              <CardTitle className="flex items-center text-lg">
                <Clock className="w-5 h-5 mr-2 text-green-600" />
                Información del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Creada</label>
                <p className="text-sm text-gray-900">
                  {new Date(assessment.createdAt).toLocaleDateString("es-VE", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Última Actualización</label>
                <p className="text-sm text-gray-900">
                  {new Date(assessment.updatedAt).toLocaleDateString("es-VE", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
