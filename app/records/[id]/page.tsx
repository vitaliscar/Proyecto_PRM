"use client"

import { use } from "react"
import { useRecord, useAuditLog } from "@/hooks/use-records"
import { RecordHeader } from "@/components/records/record-header"
import { RecordSectionComponent } from "@/components/records/record-section"
import { AuditLog } from "@/components/records/audit-log"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, FileText } from "lucide-react"

interface RecordPageProps {
  params: Promise<{ id: string }>
}

export default function RecordPage({ params }: RecordPageProps) {
  const { id } = use(params)
  const { data: record, isLoading, error } = useRecord(id)
  const { data: auditEntries = [] } = useAuditLog(id)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header skeleton */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Skeleton className="h-14 w-14 rounded-lg" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-5 w-48" />
                  <div className="grid grid-cols-3 gap-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sections skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="bg-gray-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                  <Skeleton className="h-48 w-full rounded-lg" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error al cargar la historia clínica: {error instanceof Error ? error.message : "Error desconocido"}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  if (!record) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>No se encontró la historia clínica solicitada.</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  // Ordenar secciones por orden
  const sortedSections = [...record.sections].sort((a, b) => a.order - b.order)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <RecordHeader record={record} />

        {/* Contenido principal */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Secciones de la historia clínica */}
          <div className="xl:col-span-2 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sortedSections.map((section) => (
                <RecordSectionComponent
                  key={section.id}
                  section={section}
                  recordId={record.id}
                  canEdit={record.status === "active"}
                />
              ))}
            </div>

            {sortedSections.length === 0 && (
              <Card className="bg-white border-gray-200">
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay secciones registradas</h3>
                  <p className="text-gray-500">Esta historia clínica no tiene secciones configuradas.</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Panel lateral - Auditoría */}
          <div className="xl:col-span-1">
            <AuditLog auditEntries={auditEntries} />
          </div>
        </div>
      </div>
    </div>
  )
}
