"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  Filter,
  Plus,
  Eye,
  AlertTriangle,
  CheckCircle,
  Brain,
  TrendingUp,
  FileText,
  Calendar,
} from "lucide-react"
import { useAssessments } from "@/hooks/use-assessments"
import type { RiskLevel } from "@/types/assessment"

export function AssessmentsTable() {
  const router = useRouter()
  const { data: assessments = [], isLoading, error } = useAssessments()
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [riskFilter, setRiskFilter] = useState<string>("all")

  const filteredAssessments = assessments.filter((assessment) => {
    const matchesSearch =
      assessment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.type.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === "all" || assessment.type === typeFilter
    const matchesRisk = riskFilter === "all" || assessment.riskLevel === riskFilter

    return matchesSearch && matchesType && matchesRisk
  })

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "bg-green-100 text-green-800 border-green-200",
      in_progress: "bg-blue-100 text-blue-800 border-blue-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      cancelled: "bg-gray-100 text-gray-800 border-gray-200",
    }

    const labels = {
      completed: "Completada",
      in_progress: "En Progreso",
      pending: "Pendiente",
      cancelled: "Cancelada",
    }

    return (
      <Badge className={variants[status as keyof typeof variants] || variants.pending}>
        {labels[status as keyof typeof labels] || "Desconocido"}
      </Badge>
    )
  }

  const getRiskBadge = (risk: RiskLevel, alerts: string) => {
    const variants = {
      low: "bg-green-100 text-green-800 border-green-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      high: "bg-red-100 text-red-800 border-red-200",
      critical: "bg-red-200 text-red-900 border-red-300 font-semibold animate-pulse",
    }

    const icons = {
      low: <CheckCircle className="w-3 h-3" />,
      medium: <AlertTriangle className="w-3 h-3" />,
      high: <AlertTriangle className="w-3 h-3" />,
      critical: <AlertTriangle className="w-3 h-3" />,
    }

    return (
      <Badge className={variants[risk]} title={alerts}>
        {icons[risk]}
        <span className="ml-1">
          {risk === "low" ? "Bajo" : risk === "medium" ? "Medio" : risk === "high" ? "Alto" : "Crítico"}
        </span>
      </Badge>
    )
  }

  const getScorePercentage = (score: number, maxScore: number) => {
    return (score / maxScore) * 100
  }

  const getScoreColor = (risk: RiskLevel) => {
    switch (risk) {
      case "low":
        return "bg-green-500"
      case "medium":
        return "bg-yellow-500"
      case "high":
        return "bg-red-500"
      case "critical":
        return "bg-red-600"
      default:
        return "bg-gray-500"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Error al cargar las evaluaciones. Por favor, intenta nuevamente.
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Total Evaluaciones</p>
                <p className="text-2xl font-bold text-green-900">{assessments.length}</p>
                <p className="text-sm text-green-600">Este mes</p>
              </div>
              <Brain className="text-green-600" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Completadas</p>
                <p className="text-2xl font-bold text-blue-900">
                  {assessments.filter((a) => a.status === "completed").length}
                </p>
                <p className="text-sm text-blue-600">
                  {Math.round((assessments.filter((a) => a.status === "completed").length / assessments.length) * 100)}%
                  del total
                </p>
              </div>
              <CheckCircle className="text-blue-600" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700">Alto Riesgo</p>
                <p className="text-2xl font-bold text-red-900">
                  {assessments.filter((a) => a.riskLevel === "high" || a.riskLevel === "critical").length}
                </p>
                <p className="text-sm text-red-600">Requieren atención</p>
              </div>
              <AlertTriangle className="text-red-600" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Promedio Puntaje</p>
                <p className="text-2xl font-bold text-purple-900">
                  {Math.round(
                    assessments.reduce((sum, a) => sum + (a.score / a.maxScore) * 100, 0) / assessments.length,
                  )}
                  %
                </p>
                <p className="text-sm text-purple-600">Índice general</p>
              </div>
              <TrendingUp className="text-purple-600" size={24} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader className="bg-green-50 border-b border-green-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-green-600" />
                Evaluaciones Psicológicas
              </CardTitle>
              <CardDescription className="text-gray-600">
                Administra cuestionarios estandarizados y analiza resultados
              </CardDescription>
            </div>
            <Button
              onClick={() => router.push("/assessments/new")}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Evaluación
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por paciente o tipo de evaluación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-48 border-gray-300">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="PHQ-9">PHQ-9 (Depresión)</SelectItem>
                <SelectItem value="GAD-7">GAD-7 (Ansiedad)</SelectItem>
                <SelectItem value="SDQ">SDQ (Capacidades)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-full sm:w-48 border-gray-300">
                <AlertTriangle className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Riesgo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los niveles</SelectItem>
                <SelectItem value="low">Bajo Riesgo</SelectItem>
                <SelectItem value="medium">Riesgo Medio</SelectItem>
                <SelectItem value="high">Alto Riesgo</SelectItem>
                <SelectItem value="critical">Riesgo Crítico</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabla */}
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-semibold text-gray-900">Paciente</TableHead>
                  <TableHead className="font-semibold text-gray-900">Evaluación</TableHead>
                  <TableHead className="font-semibold text-gray-900">Fecha</TableHead>
                  <TableHead className="font-semibold text-gray-900">Puntaje</TableHead>
                  <TableHead className="font-semibold text-gray-900">Nivel de Riesgo</TableHead>
                  <TableHead className="font-semibold text-gray-900">Estado</TableHead>
                  <TableHead className="font-semibold text-gray-900 text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssessments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      {searchTerm || typeFilter !== "all" || riskFilter !== "all"
                        ? "No se encontraron evaluaciones con los filtros aplicados"
                        : "No hay evaluaciones registradas"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAssessments.map((assessment) => (
                    <TableRow
                      key={assessment.id}
                      className="hover:bg-green-50 transition-colors cursor-pointer"
                      onClick={() => router.push(`/assessments/${assessment.id}`)}
                    >
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage
                              src={`/placeholder.svg?height=40&width=40&query=${assessment.patientName}`}
                              alt={assessment.patientName}
                            />
                            <AvatarFallback className="bg-green-100 text-green-700 font-medium">
                              {getInitials(assessment.patientName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-gray-900">{assessment.patientName}</div>
                            <div className="text-sm text-gray-500">ID: {assessment.patientId}</div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{assessment.type}</div>
                          <div className="text-sm text-gray-500">{assessment.interpretation}</div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-3 h-3 mr-1" />
                          {assessment.date}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">
                              {assessment.score}/{assessment.maxScore}
                            </span>
                            <span className="text-gray-500">
                              {Math.round(getScorePercentage(assessment.score, assessment.maxScore))}%
                            </span>
                          </div>
                          <Progress
                            value={getScorePercentage(assessment.score, assessment.maxScore)}
                            className="h-2"
                            style={{
                              background: `linear-gradient(to right, ${getScoreColor(assessment.riskLevel)} 0%, ${getScoreColor(assessment.riskLevel)} 100%)`,
                            }}
                          />
                        </div>
                      </TableCell>

                      <TableCell>{getRiskBadge(assessment.riskLevel, assessment.alerts)}</TableCell>

                      <TableCell>{getStatusBadge(assessment.status)}</TableCell>

                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/assessments/${assessment.id}`)
                          }}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Información de resultados */}
          {filteredAssessments.length > 0 && (
            <div className="mt-4 text-sm text-gray-600">
              Mostrando {filteredAssessments.length} de {assessments.length} evaluaciones
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
