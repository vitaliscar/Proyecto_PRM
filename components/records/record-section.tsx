"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { RecordSection, SectionType } from "@/types/record"
import { useUpdateSection } from "@/hooks/use-records"
import { FileText, Stethoscope, ClipboardList, BarChart3, Target, History, Edit3, Save, X, Loader2 } from "lucide-react"

interface RecordSectionProps {
  section: RecordSection
  recordId: string
  canEdit?: boolean
}

const sectionConfig: Record<
  SectionType,
  {
    icon: React.ComponentType<{ className?: string }>
    color: string
    bgColor: string
    borderColor: string
    placeholder: string
  }
> = {
  diagnosis: {
    icon: Stethoscope,
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    placeholder:
      "Ingrese el diagnóstico principal, criterios diagnósticos, diagnósticos diferenciales y comorbilidades...",
  },
  treatment: {
    icon: ClipboardList,
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    placeholder: "Describa el plan de tratamiento, objetivos terapéuticos, intervenciones y medicación...",
  },
  notes: {
    icon: FileText,
    color: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    placeholder: "Registre las notas de sesión, observaciones clínicas y evolución del paciente...",
  },
  evaluation: {
    icon: BarChart3,
    color: "text-purple-700",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    placeholder: "Documente las evaluaciones realizadas, escalas aplicadas y resultados obtenidos...",
  },
  plan: {
    icon: Target,
    color: "text-orange-700",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    placeholder: "Establezca el plan de seguimiento, objetivos a corto y largo plazo...",
  },
  history: {
    icon: History,
    color: "text-gray-700",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    placeholder: "Registre la historia clínica, antecedentes personales y familiares...",
  },
}

export function RecordSectionComponent({ section, recordId, canEdit = true }: RecordSectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState(section.content)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const updateSection = useUpdateSection()
  const config = sectionConfig[section.type]
  const Icon = config.icon

  useEffect(() => {
    setContent(section.content)
    setHasUnsavedChanges(false)
  }, [section.content])

  const handleContentChange = (value: string) => {
    setContent(value)
    setHasUnsavedChanges(value !== section.content)
  }

  const handleSave = async () => {
    if (!hasUnsavedChanges) return

    try {
      await updateSection.mutateAsync({
        recordId,
        sectionId: section.id,
        content,
      })
      setIsEditing(false)
      setHasUnsavedChanges(false)
    } catch (error) {
      console.error("Error al guardar:", error)
    }
  }

  const handleCancel = () => {
    setContent(section.content)
    setIsEditing(false)
    setHasUnsavedChanges(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-VE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className={`${config.bgColor} ${config.borderColor} border-2 transition-all duration-200 hover:shadow-md`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${config.bgColor} ${config.borderColor} border`}>
              <Icon className={`h-5 w-5 ${config.color}`} />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">{section.title}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-500">Modificado: {formatDate(section.lastModified)}</span>
                <span className="text-sm text-gray-400">•</span>
                <span className="text-sm text-gray-500">Por: {section.modifiedBy}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasUnsavedChanges && (
              <Badge variant="outline" className="text-orange-600 border-orange-300">
                Sin guardar
              </Badge>
            )}

            {canEdit && !isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2"
              >
                <Edit3 className="h-4 w-4" />
                Editar
              </Button>
            )}

            {isEditing && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleCancel} disabled={updateSection.isPending}>
                  <X className="h-4 w-4" />
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={!hasUnsavedChanges || updateSection.isPending}
                  className="flex items-center gap-2"
                >
                  {updateSection.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {updateSection.isPending ? "Guardando..." : "Guardar"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isEditing ? (
          <Textarea
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder={config.placeholder}
            className="min-h-[200px] resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            style={{ whiteSpace: "pre-wrap" }}
          />
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-4 min-h-[200px]">
            {content ? (
              <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed">{content}</pre>
            ) : (
              <p className="text-gray-400 italic">No hay contenido registrado para esta sección</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
