"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ClipboardList, Plus, AlertTriangle, CheckCircle, Clock, Brain, Heart } from "lucide-react"

const assessments = [
  {
    id: 1,
    patient: "Ana María Rodríguez",
    type: "PHQ-9",
    date: "2024-01-20",
    score: 14,
    maxScore: 27,
    riskLevel: "medium",
    status: "completed",
    interpretation: "Depresión moderada",
  },
  {
    id: 2,
    patient: "Carlos Eduardo Mendoza",
    type: "GAD-7",
    date: "2024-01-18",
    score: 8,
    maxScore: 21,
    riskLevel: "low",
    status: "completed",
    interpretation: "Ansiedad leve",
  },
  {
    id: 3,
    patient: "María Fernanda García",
    type: "PHQ-9",
    date: "2024-01-15",
    score: 19,
    maxScore: 27,
    riskLevel: "high",
    status: "completed",
    interpretation: "Depresión moderadamente severa",
  },
  {
    id: 4,
    patient: "José Antonio López",
    type: "SDQ",
    date: "2024-01-22",
    score: 0,
    maxScore: 40,
    riskLevel: "pending",
    status: "pending",
    interpretation: "Evaluación pendiente",
  },
]

const assessmentTypes = [
  {
    id: "PHQ-9",
    name: "PHQ-9",
    description: "Cuestionario de Salud del Paciente - Depresión",
    questions: 9,
    duration: "5-10 min",
    icon: Brain,
  },
  {
    id: "GAD-7",
    name: "GAD-7",
    description: "Escala de Ansiedad Generalizada",
    questions: 7,
    duration: "3-5 min",
    icon: Heart,
  },
  {
    id: "SDQ",
    name: "SDQ",
    description: "Cuestionario de Capacidades y Dificultades",
    questions: 25,
    duration: "10-15 min",
    icon: ClipboardList,
  },
]

export function AssessmentsModule() {
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null)
  const [showNewAssessment, setShowNewAssessment] = useState(false)

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">Alto Riesgo</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Riesgo Medio</Badge>
      case "low":
        return <Badge className="bg-green-100 text-green-800">Bajo Riesgo</Badge>
      case "pending":
        return <Badge className="bg-gray-100 text-gray-800">Pendiente</Badge>
      default:
        return <Badge>Sin Evaluar</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Completada</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
      case "in_progress":
        return <Badge className="bg-purple-100 text-purple-800">En Progreso</Badge>
      default:
        return <Badge>Desconocido</Badge>
    }
  }

  const getScorePercentage = (score: number, maxScore: number) => {
    return (score / maxScore) * 100
  }

  if (showNewAssessment) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => setShowNewAssessment(false)}>
              ← Volver
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">Nueva Evaluación</h1>
              <p className="text-neutral-600">Selecciona el tipo de evaluación a realizar.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {assessmentTypes.map((type) => {
            const Icon = type.icon
            return (
              <Card key={type.id} className="card-hover cursor-pointer">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                      <Icon className="text-primary-600" size={32} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-neutral-900">{type.name}</h3>
                      <p className="text-sm text-neutral-600 mt-1">{type.description}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-600">Preguntas:</span>
                        <span className="font-medium">{type.questions}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-600">Duración:</span>
                        <span className="font-medium">{type.duration}</span>
                      </div>
                    </div>
                    <Button className="w-full bg-primary-500 hover:bg-primary-600">Iniciar Evaluación</Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    )
  }

  if (selectedAssessment) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => setSelectedAssessment(null)}>
              ← Volver
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">
                {selectedAssessment.type} - {selectedAssessment.patient}
              </h1>
              <p className="text-neutral-600">Resultados de la evaluación</p>
            </div>
          </div>
          <Button className="bg-primary-500 hover:bg-primary-600">Generar Reporte</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Resultados de la Evaluación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className="mx-auto w-32 h-32 relative">
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
                        selectedAssessment.riskLevel === "high"
                          ? "#EF4444"
                          : selectedAssessment.riskLevel === "medium"
                            ? "#F59E0B"
                            : "#10B981"
                      }
                      strokeWidth="3"
                      strokeDasharray={`${getScorePercentage(selectedAssessment.score, selectedAssessment.maxScore)}, 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-neutral-900">{selectedAssessment.score}</div>
                      <div className="text-sm text-neutral-600">de {selectedAssessment.maxScore}</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900">{selectedAssessment.interpretation}</h3>
                  {getRiskBadge(selectedAssessment.riskLevel)}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-neutral-900">Recomendaciones de IA</h4>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Brain className="text-blue-600 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-blue-800">Basado en los resultados, se recomienda:</p>
                      <ul className="text-sm text-blue-700 mt-2 space-y-1">
                        <li>• Programar sesiones de terapia cognitivo-conductual</li>
                        <li>• Considerar evaluación psiquiátrica</li>
                        <li>• Implementar técnicas de manejo del estrés</li>
                        <li>• Seguimiento semanal durante el primer mes</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Información de la Evaluación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-neutral-600">Paciente</label>
                <p className="text-lg font-semibold">{selectedAssessment.patient}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-600">Tipo de Evaluación</label>
                <p className="text-lg">{selectedAssessment.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-600">Fecha</label>
                <p className="text-lg">{selectedAssessment.date}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-600">Estado</label>
                <div className="mt-1">{getStatusBadge(selectedAssessment.status)}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-600">Nivel de Riesgo</label>
                <div className="mt-1">{getRiskBadge(selectedAssessment.riskLevel)}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Evaluaciones Psicológicas</h1>
          <p className="text-neutral-600 mt-1">Administra cuestionarios estandarizados y analiza resultados con IA.</p>
        </div>
        <Button className="bg-primary-500 hover:bg-primary-600" onClick={() => setShowNewAssessment(true)}>
          <Plus size={16} className="mr-2" />
          Nueva Evaluación
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Total Evaluaciones</p>
                <p className="text-2xl font-bold text-neutral-900">156</p>
              </div>
              <ClipboardList className="text-blue-600" size={24} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Alto Riesgo</p>
                <p className="text-2xl font-bold text-red-600">8</p>
              </div>
              <AlertTriangle className="text-red-600" size={24} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Completadas</p>
                <p className="text-2xl font-bold text-green-600">142</p>
              </div>
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-600">14</p>
              </div>
              <Clock className="text-yellow-600" size={24} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Assessments */}
      <Card>
        <CardHeader>
          <CardTitle>Evaluaciones Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assessments.map((assessment) => (
              <div
                key={assessment.id}
                className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
                onClick={() => setSelectedAssessment(assessment)}
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={`/placeholder.svg?height=40&width=40&query=${assessment.patient}`} />
                    <AvatarFallback>
                      {assessment.patient
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <h3 className="font-semibold text-neutral-900">{assessment.patient}</h3>
                    <p className="text-sm text-neutral-600">
                      {assessment.type} - {assessment.date}
                    </p>
                    <p className="text-sm text-neutral-500">{assessment.interpretation}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm text-neutral-600">Puntaje:</span>
                      <span className="font-bold text-lg">
                        {assessment.score}/{assessment.maxScore}
                      </span>
                    </div>
                    <Progress value={getScorePercentage(assessment.score, assessment.maxScore)} className="w-24 h-2" />
                  </div>

                  <div className="text-right space-y-2">
                    {getStatusBadge(assessment.status)}
                    {getRiskBadge(assessment.riskLevel)}
                  </div>

                  <Button variant="outline" size="sm">
                    Ver Detalles
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
