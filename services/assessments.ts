import axios from "axios"
import type { Assessment, CreateAssessmentData, AssessmentTemplate } from "@/types/assessment"
import { assessmentTemplates } from "@/data/assessment-templates"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Datos simulados para desarrollo
const mockAssessments: Assessment[] = [
  {
    id: "1",
    patientId: "1",
    patientName: "Juan Carlos Pérez",
    type: "PHQ-9",
    date: "27/07/2025",
    score: 15,
    maxScore: 27,
    alerts: "Riesgo alto - Depresión moderadamente severa",
    status: "completed",
    interpretation: "Depresión moderadamente severa",
    recommendations: [
      "Terapia psicológica urgente",
      "Considerar evaluación psiquiátrica",
      "Seguimiento semanal",
      "Evaluación de riesgo suicida",
    ],
    riskLevel: "high",
    responses: [
      {
        questionId: "phq9_1",
        questionText: "Poco interés o placer en hacer cosas",
        answer: 2,
        answerText: "Más de la mitad de los días",
      },
      {
        questionId: "phq9_2",
        questionText: "Se ha sentido decaído(a), deprimido(a) o sin esperanzas",
        answer: 2,
        answerText: "Más de la mitad de los días",
      },
      {
        questionId: "phq9_3",
        questionText: "Dificultad para quedarse o permanecer dormido(a)",
        answer: 1,
        answerText: "Varios días",
      },
      {
        questionId: "phq9_4",
        questionText: "Se ha sentido cansado(a) o con poca energía",
        answer: 2,
        answerText: "Más de la mitad de los días",
      },
      {
        questionId: "phq9_5",
        questionText: "Falta de apetito o comer en exceso",
        answer: 1,
        answerText: "Varios días",
      },
      {
        questionId: "phq9_6",
        questionText: "Se ha sentido mal con usted mismo(a)",
        answer: 2,
        answerText: "Más de la mitad de los días",
      },
      {
        questionId: "phq9_7",
        questionText: "Dificultad para concentrarse",
        answer: 2,
        answerText: "Más de la mitad de los días",
      },
      { questionId: "phq9_8", questionText: "Se ha movido o hablado tan lento", answer: 1, answerText: "Varios días" },
      {
        questionId: "phq9_9",
        questionText: "Pensamientos de que estaría mejor muerto(a)",
        answer: 2,
        answerText: "Más de la mitad de los días",
      },
    ],
    createdAt: "2025-07-27T10:00:00Z",
    updatedAt: "2025-07-27T10:30:00Z",
  },
  {
    id: "2",
    patientId: "2",
    patientName: "María Elena Gómez",
    type: "GAD-7",
    date: "26/07/2025",
    score: 8,
    maxScore: 21,
    alerts: "Riesgo bajo - Ansiedad leve",
    status: "completed",
    interpretation: "Ansiedad leve",
    recommendations: [
      "Técnicas de respiración y relajación",
      "Psicoeducación sobre ansiedad",
      "Ejercicio regular",
      "Seguimiento en 6-8 semanas",
    ],
    riskLevel: "low",
    responses: [
      { questionId: "gad7_1", questionText: "Sentirse nervioso(a), ansioso(a)", answer: 1, answerText: "Varios días" },
      {
        questionId: "gad7_2",
        questionText: "No ser capaz de parar las preocupaciones",
        answer: 1,
        answerText: "Varios días",
      },
      {
        questionId: "gad7_3",
        questionText: "Preocuparse demasiado por diferentes cosas",
        answer: 2,
        answerText: "Más de la mitad de los días",
      },
      { questionId: "gad7_4", questionText: "Dificultad para relajarse", answer: 1, answerText: "Varios días" },
      { questionId: "gad7_5", questionText: "Estar tan inquieto(a)", answer: 1, answerText: "Varios días" },
      { questionId: "gad7_6", questionText: "Irritarse o enojarse fácilmente", answer: 1, answerText: "Varios días" },
      {
        questionId: "gad7_7",
        questionText: "Sentir miedo como si algo terrible fuera a suceder",
        answer: 1,
        answerText: "Varios días",
      },
    ],
    createdAt: "2025-07-26T14:00:00Z",
    updatedAt: "2025-07-26T14:20:00Z",
  },
  {
    id: "3",
    patientId: "3",
    patientName: "Ana Sofía Rodríguez",
    type: "PHQ-9",
    date: "25/07/2025",
    score: 22,
    maxScore: 27,
    alerts: "ALERTA CRÍTICA - Depresión severa",
    status: "completed",
    interpretation: "Depresión severa",
    recommendations: [
      "Intervención inmediata requerida",
      "Evaluación psiquiátrica urgente",
      "Considerar hospitalización si hay riesgo suicida",
      "Seguimiento diario inicial",
      "Protocolo de crisis activado",
    ],
    riskLevel: "critical",
    responses: [],
    createdAt: "2025-07-25T09:00:00Z",
    updatedAt: "2025-07-25T09:45:00Z",
  },
]

export const assessmentsService = {
  // Obtener todas las evaluaciones
  getAssessments: async (): Promise<Assessment[]> => {
    try {
      const response = await api.get("/api/v1/assessments/")
      return response.data
    } catch (error) {
      console.log("Using mock data for assessments")
      return mockAssessments
    }
  },

  // Obtener evaluación por ID
  getAssessment: async (id: string): Promise<Assessment | null> => {
    try {
      const response = await api.get(`/api/v1/assessments/${id}/`)
      return response.data
    } catch (error) {
      console.log("Using mock data for assessment")
      return mockAssessments.find((a) => a.id === id) || null
    }
  },

  // Obtener plantillas de evaluación
  getAssessmentTemplates: async (): Promise<AssessmentTemplate[]> => {
    try {
      const response = await api.get("/api/v1/assessment-templates/")
      return response.data
    } catch (error) {
      console.log("Using mock data for assessment templates")
      return assessmentTemplates
    }
  },

  // Crear nueva evaluación
  createAssessment: async (data: CreateAssessmentData): Promise<Assessment> => {
    try {
      const response = await api.post("/api/v1/assessments/", data)
      return response.data
    } catch (error) {
      console.log("Simulating assessment creation")

      // Simular cálculo de puntaje y interpretación
      const template = assessmentTemplates.find((t) => t.code === data.type)
      if (!template) throw new Error("Template not found")

      const totalScore = data.responses.reduce((sum, response) => sum + response.answer, 0)
      const interpretation = template.interpretationRules.find(
        (rule) => totalScore >= rule.minScore && totalScore <= rule.maxScore,
      )

      const newAssessment: Assessment = {
        id: Date.now().toString(),
        patientId: data.patientId,
        patientName: "Paciente Simulado",
        type: data.type,
        date: new Date().toLocaleDateString("es-VE"),
        score: totalScore,
        maxScore: template.maxScore,
        alerts: interpretation?.alertMessage || `${interpretation?.level} - ${interpretation?.interpretation}`,
        status: "completed",
        interpretation: interpretation?.interpretation || "Sin interpretación",
        recommendations: interpretation?.recommendations || [],
        riskLevel: interpretation?.level || "low",
        responses: data.responses.map((r) => {
          const question = template.questions.find((q) => q.id === r.questionId)
          const option = question?.options.find((o) => o.value === r.answer)
          return {
            questionId: r.questionId,
            questionText: question?.text || "",
            answer: r.answer,
            answerText: option?.text || "",
          }
        }),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      return newAssessment
    }
  },

  // Actualizar evaluación
  updateAssessment: async (id: string, data: Partial<CreateAssessmentData>): Promise<Assessment> => {
    try {
      const response = await api.patch(`/api/v1/assessments/${id}/`, data)
      return response.data
    } catch (error) {
      console.log("Simulating assessment update")
      const existingAssessment = mockAssessments.find((a) => a.id === id)
      if (!existingAssessment) throw new Error("Assessment not found")

      return {
        ...existingAssessment,
        updatedAt: new Date().toISOString(),
      }
    }
  },

  // Eliminar evaluación
  deleteAssessment: async (id: string): Promise<void> => {
    try {
      await api.delete(`/api/v1/assessments/${id}/`)
    } catch (error) {
      console.log("Simulating assessment deletion")
    }
  },
}
