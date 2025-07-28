import type { ClinicalRecord, CreateRecordRequest, AuditEntry } from "@/types/record"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// Datos simulados para desarrollo
const mockRecord: ClinicalRecord = {
  id: "1",
  patientId: "1",
  patientName: "Juan Carlos Pérez",
  content: "Historia clínica completa del paciente Juan Carlos Pérez",
  status: "active",
  createdAt: "2025-01-15T09:00:00Z",
  updatedAt: "2025-01-27T14:30:00Z",
  createdBy: "Dr. María González",
  lastModifiedBy: "Dr. Carlos López",
  sections: [
    {
      id: "s1",
      title: "Diagnóstico Principal",
      content: `Trastorno de Ansiedad Generalizada (F41.1)

CRITERIOS DIAGNÓSTICOS DSM-5:
- Ansiedad y preocupación excesivas durante al menos 6 meses
- Dificultad para controlar la preocupación
- Síntomas físicos: inquietud, fatiga, dificultad de concentración
- Deterioro significativo en funcionamiento social y laboral

DIAGNÓSTICOS DIFERENCIALES:
- Trastorno de Pánico (F41.0) - Descartado
- Trastorno Depresivo Mayor - En evaluación
- Trastorno de Adaptación - Descartado

COMORBILIDADES:
- Insomnio primario (G47.0)
- Síntomas depresivos leves`,
      type: "diagnosis",
      order: 1,
      lastModified: "2025-01-27T14:30:00Z",
      modifiedBy: "Dr. Carlos López",
    },
    {
      id: "s2",
      title: "Plan de Tratamiento",
      content: `OBJETIVOS TERAPÉUTICOS:
1. Reducir síntomas de ansiedad en 40% (GAD-7 < 10)
2. Mejorar calidad del sueño
3. Desarrollar estrategias de afrontamiento
4. Mejorar funcionamiento social y laboral

INTERVENCIONES:
- Terapia Cognitivo-Conductual (TCC) - 12 sesiones
- Técnicas de relajación y mindfulness
- Reestructuración cognitiva
- Exposición gradual a situaciones temidas

MEDICACIÓN:
- Sertralina 50mg/día (evaluación psiquiátrica pendiente)
- Lorazepam 0.5mg PRN (máximo 3 veces/semana)

FRECUENCIA:
- Sesiones semanales por 8 semanas
- Luego quincenal por 4 sesiones
- Seguimiento mensual`,
      type: "treatment",
      order: 2,
      lastModified: "2025-01-26T11:15:00Z",
      modifiedBy: "Dr. Carlos López",
    },
    {
      id: "s3",
      title: "Notas de Sesión",
      content: `SESIÓN 1 (15/01/2025):
- Establecimiento de rapport
- Evaluación inicial con GAD-7 (puntuación: 15)
- Psicoeducación sobre ansiedad
- Tarea: Registro de pensamientos ansiosos

SESIÓN 2 (22/01/2025):
- Revisión de registro de pensamientos
- Identificación de patrones cognitivos disfuncionales
- Introducción a técnicas de respiración
- Progreso: Paciente más consciente de sus pensamientos

SESIÓN 3 (27/01/2025):
- Práctica de reestructuración cognitiva
- Trabajo con pensamientos catastróficos
- Técnicas de relajación muscular progresiva
- Tarea: Práctica diaria de relajación 10 min`,
      type: "notes",
      order: 3,
      lastModified: "2025-01-27T15:45:00Z",
      modifiedBy: "Dr. Carlos López",
    },
    {
      id: "s4",
      title: "Evaluaciones y Escalas",
      content: `EVALUACIÓN INICIAL (15/01/2025):
GAD-7 (Ansiedad): 15/21 - Ansiedad severa
PHQ-9 (Depresión): 8/27 - Síntomas depresivos leves
BAI (Beck Anxiety): 28/63 - Ansiedad moderada-severa

EVALUACIÓN INTERMEDIA (27/01/2025):
GAD-7: 12/21 - Ansiedad moderada (mejora de 3 puntos)
PHQ-9: 6/27 - Síntomas depresivos mínimos
Escala de Calidad del Sueño: 8/21 - Calidad pobre

OBSERVACIONES CLÍNICAS:
- Mejoría notable en síntomas físicos de ansiedad
- Mejor insight sobre patrones de pensamiento
- Aún presenta dificultades para conciliar el sueño
- Mayor motivación para el tratamiento

PRÓXIMA EVALUACIÓN: 10/02/2025`,
      type: "evaluation",
      order: 4,
      lastModified: "2025-01-27T16:00:00Z",
      modifiedBy: "Dr. Carlos López",
    },
    {
      id: "s5",
      title: "Plan de Seguimiento",
      content: `OBJETIVOS A CORTO PLAZO (1-2 meses):
- Reducir GAD-7 a menos de 10 puntos
- Implementar rutina de higiene del sueño
- Practicar técnicas de relajación diariamente
- Identificar y modificar pensamientos disfuncionales

OBJETIVOS A MEDIANO PLAZO (3-6 meses):
- Mantener síntomas de ansiedad en rango leve
- Retomar actividades sociales evitadas
- Mejorar rendimiento laboral
- Desarrollar red de apoyo social

OBJETIVOS A LARGO PLAZO (6-12 meses):
- Prevención de recaídas
- Autonomía en manejo de síntomas
- Calidad de vida óptima
- Alta terapéutica

INDICADORES DE PROGRESO:
- Escalas estandarizadas mensuales
- Autorregistros semanales
- Feedback de familiares
- Funcionamiento laboral/social

PLAN DE CONTINGENCIA:
- Sesiones adicionales si hay recaída
- Derivación psiquiátrica si empeoramiento
- Contacto de emergencia: Dr. López 0414-1234567`,
      type: "plan",
      order: 5,
      lastModified: "2025-01-25T10:30:00Z",
      modifiedBy: "Dr. Carlos López",
    },
    {
      id: "s6",
      title: "Historia y Antecedentes",
      content: `DATOS PERSONALES:
Edad: 32 años
Estado civil: Casado
Ocupación: Ingeniero de sistemas
Educación: Universitaria completa

MOTIVO DE CONSULTA:
"Me siento muy ansioso todo el tiempo, no puedo dormir y me preocupo por todo"

HISTORIA DE LA ENFERMEDAD ACTUAL:
Inicio de síntomas hace 8 meses, coincidiendo con cambio de trabajo y nacimiento de segundo hijo. Síntomas progresivos con empeoramiento en últimos 3 meses.

ANTECEDENTES PERSONALES:
- Episodio de ansiedad leve a los 25 años (resuelto sin tratamiento)
- No antecedentes de hospitalización psiquiátrica
- No consumo de sustancias
- Alergias: Penicilina

ANTECEDENTES FAMILIARES:
- Madre: Trastorno depresivo mayor
- Padre: Sin antecedentes psiquiátricos conocidos
- Hermana: Trastorno de ansiedad (en tratamiento)

HISTORIA MÉDICA:
- Hipertensión arterial leve (controlada con dieta)
- Gastritis crónica
- Última evaluación médica: Diciembre 2024 (normal)

HISTORIA SOCIAL:
- Relación marital estable
- Dos hijos (5 años y 8 meses)
- Red de apoyo familiar adecuada
- Situación económica estable`,
      type: "history",
      order: 6,
      lastModified: "2025-01-15T09:30:00Z",
      modifiedBy: "Dr. María González",
    },
  ],
  audit: [
    {
      id: "a1",
      user: "Dr. Carlos López",
      userId: "user-2",
      action: "edit",
      section: "Diagnóstico Principal",
      sectionId: "s1",
      changes: [
        {
          field: "content",
          oldValue: "Diagnóstico: Ansiedad",
          newValue: "Trastorno de Ansiedad Generalizada (F41.1)...",
        },
      ],
      date: "27/01/2025",
      timestamp: "2025-01-27T14:30:00Z",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
    {
      id: "a2",
      user: "Dr. Carlos López",
      userId: "user-2",
      action: "edit",
      section: "Notas de Sesión",
      sectionId: "s3",
      changes: [
        {
          field: "content",
          oldValue: "SESIÓN 3 (27/01/2025): Pendiente",
          newValue: "SESIÓN 3 (27/01/2025): Práctica de reestructuración cognitiva...",
        },
      ],
      date: "27/01/2025",
      timestamp: "2025-01-27T15:45:00Z",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
    {
      id: "a3",
      user: "Dr. Carlos López",
      userId: "user-2",
      action: "edit",
      section: "Evaluaciones y Escalas",
      sectionId: "s4",
      changes: [
        {
          field: "content",
          oldValue: "EVALUACIÓN INTERMEDIA: Pendiente",
          newValue: "EVALUACIÓN INTERMEDIA (27/01/2025): GAD-7: 12/21...",
        },
      ],
      date: "27/01/2025",
      timestamp: "2025-01-27T16:00:00Z",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
    {
      id: "a4",
      user: "Dr. María González",
      userId: "user-1",
      action: "create",
      changes: [
        {
          field: "record",
          oldValue: "",
          newValue: "Historia clínica creada para Juan Carlos Pérez",
        },
      ],
      date: "15/01/2025",
      timestamp: "2025-01-15T09:00:00Z",
      ipAddress: "192.168.1.50",
      userAgent: "Mozilla/5.0 (macOS; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    },
    {
      id: "a5",
      user: "Dr. Carlos López",
      userId: "user-2",
      action: "view",
      date: "27/01/2025",
      timestamp: "2025-01-27T13:15:00Z",
      changes: [],
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
  ],
}

export const recordsService = {
  async getRecord(id: string): Promise<ClinicalRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/records/${id}/`)
      if (!response.ok) {
        throw new Error("Error al cargar la historia clínica")
      }
      return await response.json()
    } catch (error) {
      console.warn("API no disponible, usando datos simulados:", error)
      return mockRecord
    }
  },

  async updateRecord(id: string, data: Partial<ClinicalRecord>): Promise<ClinicalRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/records/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new Error("Error al actualizar la historia clínica")
      }
      return await response.json()
    } catch (error) {
      console.warn("API no disponible, simulando actualización:", error)
      return { ...mockRecord, ...data, updatedAt: new Date().toISOString() }
    }
  },

  async updateSection(recordId: string, sectionId: string, content: string): Promise<ClinicalRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/records/${recordId}/sections/${sectionId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      })
      if (!response.ok) {
        throw new Error("Error al actualizar la sección")
      }
      return await response.json()
    } catch (error) {
      console.warn("API no disponible, simulando actualización de sección:", error)
      const updatedSections = mockRecord.sections.map((section) =>
        section.id === sectionId
          ? { ...section, content, lastModified: new Date().toISOString(), modifiedBy: "Dr. Carlos López" }
          : section,
      )
      return { ...mockRecord, sections: updatedSections, updatedAt: new Date().toISOString() }
    }
  },

  async getAuditLog(recordId: string): Promise<AuditEntry[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/records/${recordId}/audit/`)
      if (!response.ok) {
        throw new Error("Error al cargar el registro de auditoría")
      }
      return await response.json()
    } catch (error) {
      console.warn("API no disponible, usando datos simulados:", error)
      return mockRecord.audit
    }
  },

  async createRecord(data: CreateRecordRequest): Promise<ClinicalRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/records/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new Error("Error al crear la historia clínica")
      }
      return await response.json()
    } catch (error) {
      console.warn("API no disponible, simulando creación:", error)
      return {
        ...mockRecord,
        id: Math.random().toString(36).substr(2, 9),
        patientId: data.patientId,
        content: data.content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    }
  },
}
