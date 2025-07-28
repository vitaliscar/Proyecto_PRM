"use client"

import React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, AlertTriangle, CheckCircle, Brain, Clock, FileText, User, TrendingUp } from "lucide-react"
import { useAssessmentTemplates, useCreateAssessment } from "@/hooks/use-assessments"
import { usePatients } from "@/hooks/use-patients"
import type { AssessmentTemplate, CreateAssessmentData } from "@/types/assessment"

const assessmentFormSchema = z.object({
  patientId: z.string().min(1, "Debe seleccionar un paciente"),
  type: z.string().min(1, "Debe seleccionar un tipo de evaluación"),
  responses: z.record(z.number().min(0)),
})

type AssessmentFormData = z.infer<typeof assessmentFormSchema>

interface AssessmentFormProps {
  assessmentId?: string
}

export function AssessmentForm({ assessmentId }: AssessmentFormProps) {
  const router = useRouter()
  const { data: patients = [] } = usePatients()
  const { data: templates = [] } = useAssessmentTemplates()
  const createAssessment = useCreateAssessment()

  const [selectedTemplate, setSelectedTemplate] = useState<AssessmentTemplate | null>(null)
  const [currentScore, setCurrentScore] = useState(0)
  const [currentInterpretation, setCurrentInterpretation] = useState<any>(null)

  const form = useForm<AssessmentFormData>({
    resolver: zodResolver(assessmentFormSchema),
    defaultValues: {
      patientId: "",
      type: "",
      responses: {},
    },
  })

  const watchedResponses = form.watch("responses")
  const watchedType = form.watch("type")

  // Actualizar template seleccionado cuando cambia el tipo
  React.useEffect(() => {
    if (watchedType) {
      const template = templates.find((t) => t.code === watchedType)
      setSelectedTemplate(template || null)
      form.setValue("responses", {}) // Limpiar respuestas al cambiar tipo
    }
  }, [watchedType, templates, form])

  // Calcular puntaje en tiempo real
  React.useEffect(() => {
    if (selectedTemplate && Object.keys(watchedResponses).length > 0) {
      const score = Object.values(watchedResponses).reduce((sum, value) => sum + (value || 0), 0)
      setCurrentScore(score)

      // Encontrar interpretación actual
      const interpretation = selectedTemplate.interpretationRules.find(
        (rule) => score >= rule.minScore && score <= rule.maxScore,
      )
      setCurrentInterpretation(interpretation)
    }
  }, [watchedResponses, selectedTemplate])

  const onSubmit = async (data: AssessmentFormData) => {
    if (!selectedTemplate) return

    try {
      const responses = Object.entries(data.responses).map(([questionId, answer]) => ({
        questionId,
        answer,
      }))

      const createData: CreateAssessmentData = {
        patientId: data.patientId,
        type: data.type as any,
        responses,
      }

      await createAssessment.mutateAsync(createData)
      router.push("/assessments")
    } catch (error) {
      console.error("Error creating assessment:", error)
    }
  }

  const getProgressPercentage = () => {
    if (!selectedTemplate) return 0
    const totalQuestions = selectedTemplate.questions.length
    const answeredQuestions = Object.keys(watchedResponses).length
    return (answeredQuestions / totalQuestions) * 100
  }

  const getRiskColor = (level?: string) => {
    switch (level) {
      case "low":
        return "text-green-600 bg-green-50 border-green-200"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "high":
        return "text-red-600 bg-red-50 border-red-200"
      case "critical":
        return "text-red-800 bg-red-100 border-red-300"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const isLoading = createAssessment.isPending

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()} className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Nueva Evaluación Psicológica</h1>
            <p className="text-gray-600">Administra cuestionarios estandarizados con análisis automático</p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Selección de Paciente y Tipo */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-green-50 border-b border-green-100">
              <CardTitle className="flex items-center text-lg">
                <User className="w-5 h-5 mr-2 text-green-600" />
                Configuración de la Evaluación
              </CardTitle>
              <CardDescription>Selecciona el paciente y tipo de evaluación</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="patientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Paciente *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                            <SelectValue placeholder="Selecciona un paciente" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {patients.map((patient) => (
                            <SelectItem key={patient.id} value={patient.id}>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{patient.name}</span>
                                <span className="text-gray-500">({patient.cedula})</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Tipo de Evaluación *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                            <SelectValue placeholder="Selecciona una evaluación" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {templates.map((template) => (
                            <SelectItem key={template.id} value={template.code}>
                              <div className="space-y-1">
                                <div className="font-medium">{template.name}</div>
                                <div className="text-sm text-gray-500">{template.description}</div>
                                <div className="flex items-center space-x-2 text-xs text-gray-400">
                                  <Clock className="w-3 h-3" />
                                  <span>{template.duration}</span>
                                  <span>•</span>
                                  <span>{template.questions.length} preguntas</span>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {selectedTemplate && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Brain className="w-5 h-5 text-green-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-green-900">{selectedTemplate.name}</h4>
                      <p className="text-sm text-green-700 mt-1">{selectedTemplate.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-green-600">
                        <span>📊 {selectedTemplate.questions.length} preguntas</span>
                        <span>⏱️ {selectedTemplate.duration}</span>
                        <span>📈 Puntaje máximo: {selectedTemplate.maxScore}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Progreso y Puntaje Actual */}
          {selectedTemplate && (
            <Card className="border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Progreso</label>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>
                          {Object.keys(watchedResponses).length}/{selectedTemplate.questions.length}
                        </span>
                        <span>{Math.round(getProgressPercentage())}%</span>
                      </div>
                      <Progress value={getProgressPercentage()} className="h-2" />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Puntaje Actual</label>
                    <div className="mt-2">
                      <div className="text-2xl font-bold text-gray-900">
                        {currentScore}/{selectedTemplate.maxScore}
                      </div>
                      <div className="text-sm text-gray-500">
                        {Math.round((currentScore / selectedTemplate.maxScore) * 100)}% del total
                      </div>
                    </div>
                  </div>

                  {currentInterpretation && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Interpretación Preliminar</label>
                      <div className="mt-2">
                        <Badge className={getRiskColor(currentInterpretation.level)}>
                          {currentInterpretation.level === "low"
                            ? "Bajo Riesgo"
                            : currentInterpretation.level === "medium"
                              ? "Riesgo Medio"
                              : currentInterpretation.level === "high"
                                ? "Alto Riesgo"
                                : "Riesgo Crítico"}
                        </Badge>
                        <div className="text-sm text-gray-600 mt-1">{currentInterpretation.interpretation}</div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Alertas de Riesgo */}
          {currentInterpretation?.alertMessage && (
            <Alert
              className={`border-2 ${
                currentInterpretation.level === "critical"
                  ? "border-red-300 bg-red-50"
                  : currentInterpretation.level === "high"
                    ? "border-red-200 bg-red-50"
                    : "border-yellow-200 bg-yellow-50"
              }`}
            >
              <AlertTriangle
                className={`h-4 w-4 ${
                  currentInterpretation.level === "critical" || currentInterpretation.level === "high"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              />
              <AlertDescription
                className={`font-medium ${
                  currentInterpretation.level === "critical" || currentInterpretation.level === "high"
                    ? "text-red-800"
                    : "text-yellow-800"
                }`}
              >
                {currentInterpretation.alertMessage}
              </AlertDescription>
            </Alert>
          )}

          {/* Cuestionario */}
          {selectedTemplate && (
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="bg-green-50 border-b border-green-100">
                <CardTitle className="flex items-center text-lg">
                  <FileText className="w-5 h-5 mr-2 text-green-600" />
                  Cuestionario: {selectedTemplate.name}
                </CardTitle>
                <CardDescription>Responde todas las preguntas basándote en las últimas 2 semanas</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                {selectedTemplate.questions
                  .sort((a, b) => a.order - b.order)
                  .map((question, index) => (
                    <FormField
                      key={question.id}
                      control={form.control}
                      name={`responses.${question.id}`}
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <FormLabel className="text-base font-medium text-gray-900 leading-relaxed">
                                {question.text}
                              </FormLabel>
                              <FormDescription className="text-gray-600 mt-1">
                                Durante las últimas 2 semanas, ¿con qué frecuencia ha tenido molestias debido a este
                                problema?
                              </FormDescription>

                              <FormControl className="mt-4">
                                <RadioGroup
                                  onValueChange={(value) => field.onChange(Number.parseInt(value))}
                                  value={field.value?.toString()}
                                  className="space-y-3"
                                >
                                  {question.options.map((option) => (
                                    <div key={option.value} className="flex items-center space-x-3">
                                      <RadioGroupItem
                                        value={option.value.toString()}
                                        id={`${question.id}-${option.value}`}
                                        className="border-gray-300 text-green-600 focus:ring-green-500"
                                      />
                                      <Label
                                        htmlFor={`${question.id}-${option.value}`}
                                        className="flex-1 cursor-pointer"
                                      >
                                        <div className="flex items-center justify-between">
                                          <span className="text-gray-900">{option.text}</span>
                                          <div className="flex items-center space-x-2">
                                            {option.description && (
                                              <span className="text-sm text-gray-500">({option.description})</span>
                                            )}
                                            <Badge variant="outline" className="text-xs px-2 py-1">
                                              {option.value} pts
                                            </Badge>
                                          </div>
                                        </div>
                                      </Label>
                                    </div>
                                  ))}
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />
                  ))}
              </CardContent>
            </Card>
          )}

          {/* Recomendaciones Preliminares */}
          {currentInterpretation?.recommendations && (
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="bg-green-50 border-b border-green-100">
                <CardTitle className="flex items-center text-lg">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                  Recomendaciones Preliminares
                </CardTitle>
                <CardDescription>
                  Basadas en el puntaje actual - Se actualizarán al completar la evaluación
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {currentInterpretation.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{recommendation}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Botones de Acción */}
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={
                    isLoading ||
                    !selectedTemplate ||
                    Object.keys(watchedResponses).length !== selectedTemplate?.questions.length
                  }
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Procesando...
                    </div>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Completar Evaluación
                    </>
                  )}
                </Button>
              </div>

              {selectedTemplate && Object.keys(watchedResponses).length !== selectedTemplate.questions.length && (
                <div className="mt-4 text-sm text-gray-500 text-center">
                  Completa todas las preguntas para continuar ({Object.keys(watchedResponses).length}/
                  {selectedTemplate.questions.length} respondidas)
                </div>
              )}
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  )
}
