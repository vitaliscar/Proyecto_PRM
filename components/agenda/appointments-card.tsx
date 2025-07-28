"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, MapPin, Video, Phone, User, AlertTriangle } from "lucide-react"
import type { AgendaAppointment } from "@/types/agenda"

interface AppointmentsCardProps {
  appointments: AgendaAppointment[]
}

export function AppointmentsCard({ appointments }: AppointmentsCardProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "presencial":
        return <MapPin size={16} className="text-blue-600" />
      case "virtual":
        return <Video size={16} className="text-green-600" />
      case "telefonica":
        return <Phone size={16} className="text-purple-600" />
      default:
        return <User size={16} className="text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Confirmada</Badge>
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800">Programada</Badge>
      case "in_progress":
        return <Badge className="bg-yellow-100 text-yellow-800">En Curso</Badge>
      case "completed":
        return <Badge className="bg-gray-100 text-gray-800">Completada</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelada</Badge>
      default:
        return null
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500"
      case "medium":
        return "border-l-yellow-500"
      case "low":
        return "border-l-green-500"
      default:
        return "border-l-gray-300"
    }
  }

  const sortedAppointments = [...appointments].sort((a, b) => a.time.localeCompare(b.time))

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <CardTitle className="flex items-center text-gray-900">
          <Clock className="mr-2" size={20} />
          Citas del Día ({appointments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {sortedAppointments.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Clock size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No hay citas programadas</p>
            <p className="text-sm">¡Perfecto día para ponerse al día con tareas administrativas!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {sortedAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className={`p-4 border-l-4 ${getPriorityColor(appointment.priority)} hover:bg-gray-50 transition-colors`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="text-center min-w-[60px]">
                      <p className="text-lg font-bold text-gray-900">{appointment.time}</p>
                      <p className="text-sm text-gray-600">{appointment.duration}min</p>
                    </div>

                    <Avatar className="mt-1">
                      <AvatarImage src={`/placeholder.svg?height=40&width=40&query=${appointment.patient}`} />
                      <AvatarFallback>
                        {appointment.patient
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{appointment.patient}</h3>
                        {!appointment.reminderSent && (
                          <AlertTriangle size={16} className="text-orange-500" title="Recordatorio no enviado" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{appointment.psychologist}</p>
                      {appointment.notes && <p className="text-sm text-gray-500">{appointment.notes}</p>}
                      {appointment.room && (
                        <div className="flex items-center mt-2 text-sm text-gray-600">
                          <MapPin size={14} className="mr-1" />
                          {appointment.room}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(appointment.type)}
                      {getStatusBadge(appointment.status)}
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="outline" size="sm">
                        Ver
                      </Button>
                      {appointment.status === "scheduled" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 hover:text-green-700 bg-transparent"
                        >
                          Confirmar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
