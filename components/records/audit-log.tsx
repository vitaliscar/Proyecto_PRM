"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { AuditEntry, AuditAction } from "@/types/record"
import { Plus, Edit3, Trash2, Eye, Archive, RotateCcw, User, Clock, Globe } from "lucide-react"

interface AuditLogProps {
  auditEntries: AuditEntry[]
}

const actionConfig: Record<
  AuditAction,
  {
    icon: React.ComponentType<{ className?: string }>
    label: string
    color: string
    bgColor: string
  }
> = {
  create: {
    icon: Plus,
    label: "Creado",
    color: "text-green-700",
    bgColor: "bg-green-100",
  },
  edit: {
    icon: Edit3,
    label: "Editado",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
  },
  delete: {
    icon: Trash2,
    label: "Eliminado",
    color: "text-red-700",
    bgColor: "bg-red-100",
  },
  view: {
    icon: Eye,
    label: "Visualizado",
    color: "text-gray-700",
    bgColor: "bg-gray-100",
  },
  archive: {
    icon: Archive,
    label: "Archivado",
    color: "text-orange-700",
    bgColor: "bg-orange-100",
  },
  restore: {
    icon: RotateCcw,
    label: "Restaurado",
    color: "text-purple-700",
    bgColor: "bg-purple-100",
  },
}

export function AuditLog({ auditEntries }: AuditLogProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-VE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getRelativeTime = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Hace menos de 1 hora"
    if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? "s" : ""}`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `Hace ${diffInDays} día${diffInDays > 1 ? "s" : ""}`

    return formatDate(dateString)
  }

  return (
    <Card className="bg-gray-50 border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <Clock className="h-5 w-5 text-gray-600" />
          Registro de Auditoría
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {auditEntries.map((entry) => {
              const config = actionConfig[entry.action]
              const Icon = config.icon

              return (
                <div
                  key={entry.id}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${config.bgColor}`}>
                      <Icon className={`h-4 w-4 ${config.color}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className={`${config.color} ${config.bgColor} border-current`}>
                          {config.label}
                        </Badge>
                        {entry.section && (
                          <Badge variant="secondary" className="text-xs">
                            {entry.section}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <User className="h-4 w-4" />
                        <span className="font-medium">{entry.user}</span>
                        <span className="text-gray-400">•</span>
                        <span>{getRelativeTime(entry.timestamp)}</span>
                      </div>

                      {entry.changes.length > 0 && (
                        <div className="space-y-2">
                          {entry.changes.map((change, index) => (
                            <div key={index} className="bg-gray-50 rounded p-3 text-sm">
                              <div className="font-medium text-gray-700 mb-1">Campo: {change.field}</div>
                              {change.oldValue && (
                                <div className="mb-2">
                                  <span className="text-red-600 font-medium">Anterior:</span>
                                  <div className="bg-red-50 border border-red-200 rounded p-2 mt-1">
                                    <pre className="whitespace-pre-wrap text-xs text-red-700">
                                      {change.oldValue.length > 100
                                        ? `${change.oldValue.substring(0, 100)}...`
                                        : change.oldValue}
                                    </pre>
                                  </div>
                                </div>
                              )}
                              <div>
                                <span className="text-green-600 font-medium">Nuevo:</span>
                                <div className="bg-green-50 border border-green-200 rounded p-2 mt-1">
                                  <pre className="whitespace-pre-wrap text-xs text-green-700">
                                    {change.newValue.length > 100
                                      ? `${change.newValue.substring(0, 100)}...`
                                      : change.newValue}
                                  </pre>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {entry.ipAddress && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                          <Globe className="h-3 w-3" />
                          <span>IP: {entry.ipAddress}</span>
                          <span className="text-gray-400">•</span>
                          <span>{formatDate(entry.timestamp)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}

            {auditEntries.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No hay registros de auditoría disponibles</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
