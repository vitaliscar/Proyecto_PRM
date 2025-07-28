export interface Assessment {
  id: string
  patientId: string
  patientName: string
  type: AssessmentType
  date: string
  score: number
  maxScore: number
  alerts: string
  status: AssessmentStatus
  responses: AssessmentResponse[]
  interpretation: string
  recommendations: string[]
  riskLevel: RiskLevel
  createdAt: string
  updatedAt: string
}

export interface AssessmentResponse {
  questionId: string
  questionText: string
  answer: number
  answerText: string
}

export interface AssessmentTemplate {
  id: string
  name: string
  code: string
  description: string
  questions: AssessmentQuestion[]
  scoringRules: ScoringRule[]
  interpretationRules: InterpretationRule[]
  maxScore: number
  duration: string
  category: string
}

export interface AssessmentQuestion {
  id: string
  text: string
  type: "single_choice" | "multiple_choice" | "scale"
  options: AssessmentOption[]
  required: boolean
  order: number
}

export interface AssessmentOption {
  value: number
  text: string
  description?: string
}

export interface ScoringRule {
  questionIds: string[]
  weight: number
}

export interface InterpretationRule {
  minScore: number
  maxScore: number
  level: RiskLevel
  interpretation: string
  recommendations: string[]
  alertMessage?: string
}

export type AssessmentType = "PHQ-9" | "GAD-7" | "SDQ" | "DASS-21" | "PSS-10"
export type AssessmentStatus = "pending" | "in_progress" | "completed" | "cancelled"
export type RiskLevel = "low" | "medium" | "high" | "critical"

export interface CreateAssessmentData {
  patientId: string
  type: AssessmentType
  responses: { questionId: string; answer: number }[]
}
