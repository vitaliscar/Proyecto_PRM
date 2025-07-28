"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { ClinicalRecord } from "@/types/record"
import { User, Calendar, Clock, FileText, ArrowLeft, Download, Share2 } from "lucide-react"
import Link from "next/link"

interface RecordHeaderProps {
  record: ClinicalRecord
}

export function RecordHeader({ record }: RecordHeaderProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-VE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusConfig = (status: ClinicalRecord["status"]) => {
    switch (status) {
      case "active":
        return {
          label: "Activa",
          color: "bg-green-100 text-green-800 border-green-200",
        }
      case "archived":
        return {
          label: "Archivada",
          color: "bg-orange-100 text-orange-800 border-orange-200",
        }
      case "locked":
        return {
          label: "Bloqueada",
          color: "bg-red-100 text-red-800 border-red-200",
        }
      default:
        return {
          label: "Desconocido",
          color: "bg-gray-100 text-gray-800 border-gray-200",
        }
    }
  }

  const statusConfig = getStatusConfig(record.status)

  return (
    <div className="space-y-4">
      {/* Navegación */}
      <div className="flex items-center gap-4">
        <Link href="/patients">
          <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
            <ArrowLeft className="h-4 w-4" />
            Volver a Pacientes
          </Button>
        </Link>

        <div className="flex items-center gap-2 ml-auto">
          <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Exportar PDF
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
            <Share2 className="h-4 w-4" />
            Compartir
          </Button>
        </div>
      </div>

      {/* Header principal */}
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                <FileText className="h-8 w-8 text-gray-600" />
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">Historia Clínica</h1>
                  <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                </div>

                <div className="flex items-center gap-2 text-lg text-gray-700 mb-3">
                  <User className="h-5 w-5" />
                  <span className="font-semibold">{record.patientName}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">ID: {record.id}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Creada: {formatDate(record.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Actualizada: {formatDate(record.updatedAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Por: {record.lastModifiedBy}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">Secciones</div>
              <div className="text-2xl font-bold text-gray-900">{record.sections.length}</div>
            </div>
          </div>

          {record.content && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-2">Resumen</h3>
              <p className="text-gray-700 text-sm leading-relaxed">{record.content}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
