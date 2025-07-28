"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Plus, Clock, Video, MapPin, Phone, CheckCircle } from "lucide-react"

const appointments = [
  {
    id: 1,
    patient: "Ana María Rodríguez",
    date: "2024-01-22",
    time: "09:00",
    duration: 60,
    type: "individual",
    modality: "presencial",
    status: "confirmed",
    room: "Sala 1",
    notes: "Seguimiento de ansiedad",
  },
  {
    id: 2,
    patient: "Carlos Eduardo Mendoza",
    date: "2024-01-22",
    time: "10:30",
    duration: 45,
    type: "evaluation",
    modality: "virtual",
    status: "pending",
    room: null,
    notes: "Evaluación PHQ-9 inicial",
  },
  {
    id: 3,
    patient: "María Fernanda García",
    date: "2024-01-22",
    time: "14:00",
    duration: 60,
    type: "therapy",
    modality: "virtual",
    status: "confirmed",
    room: null,
    notes: "Teleterapia - sesión 5",
  },
  {
    id: 4,
    patient: "José Antonio López",
    date: "2024-01-22",
    time: "15:30",
    duration: 45,
    type: "followup",
    modality: "presencial",
    status: "completed",
    room: "Sala 2",
    notes: "Revisión de progreso",
  },
]

const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]

export function AppointmentsModule() {
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list")
  const [selectedDate, setSelectedDate] = useState("2024-01-22")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Confirmada</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Completada</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelada</Badge>
      default:
        return <Badge>Desconocido</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "individual":
        return "Consulta Individual"
      case "evaluation":
        return "Evaluación"
      case "therapy":
        return "Terapia"
      case "followup":
        return "Seguimiento"
      default:
        return "Consulta"
    }
  }

  const getModalityIcon = (modality: string) => {
    return modality === "virtual" ? <Video size={16} /> : <MapPin size={16} />
  }

  if (viewMode === "calendar") {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Calendario de Citas</h1>
            <p className="text-neutral-600 mt-1">Vista semanal de todas las citas programadas.</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setViewMode("list")}>
              Vista Lista
            </Button>
            <Button className="bg-primary-500 hover:bg-primary-600">
              <Plus size={16} className="mr-2" />
              Nueva Cita
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-8 gap-4">
              {/* Time column */}
              <div className="space-y-4">
                <div className="h-12"></div>
                {timeSlots.map((time) => (
                  <div key={time} className="h-16 flex items-center text-sm text-neutral-600">
                    {time}
                  </div>
                ))}
              </div>

              {/* Days columns */}
              {weekDays.map((day, dayIndex) => (
                <div key={day} className="space-y-4">
                  <div className="h-12 flex items-center justify-center font-semibold text-neutral-900 border-b">
                    {day}
                  </div>
                  {timeSlots.map((time, timeIndex) => {
                    const appointment = appointments.find(
                      (apt) => apt.time === time && dayIndex === 0, // Simulando que todas las citas son el lunes
                    )

                    return (
                      <div key={`${day}-${time}`} className="h-16 border border-neutral-200 rounded-lg p-2">
                        {appointment && (
                          <div className="bg-primary-50 border border-primary-200 rounded p-2 h-full">
                            <p className="text-xs font-medium text-primary-800 truncate">{appointment.patient}</p>
                            <p className="text-xs text-primary-600">{getTypeBadge(appointment.type)}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Gestión de Citas</h1>
          <p className="text-neutral-600 mt-1">Programa y administra las citas de tus pacientes.</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setViewMode("calendar")}>
            <Calendar size={16} className="mr-2" />
            Vista Calendario
          </Button>
          <Button className="bg-primary-500 hover:bg-primary-600">
            <Plus size={16} className="mr-2" />
            Nueva Cita
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Citas Hoy</p>
                <p className="text-2xl font-bold text-neutral-900">18</p>
              </div>
              <Calendar className="text-blue-600" size={24} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Confirmadas</p>
                <p className="text-2xl font-bold text-green-600">14</p>
              </div>
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-600">3</p>
              </div>
              <Clock className="text-yellow-600" size={24} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Virtuales</p>
                <p className="text-2xl font-bold text-purple-600">7</p>
              </div>
              <Video className="text-purple-600" size={24} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointments List */}
      <Card>
        <CardHeader>
          <CardTitle>Citas del Día - {selectedDate}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-neutral-900">{appointment.time}</p>
                    <p className="text-sm text-neutral-600">{appointment.duration}min</p>
                  </div>

                  <Avatar>
                    <AvatarImage src={`/placeholder.svg?height=40&width=40&query=${appointment.patient}`} />
                    <AvatarFallback>
                      {appointment.patient
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <h3 className="font-semibold text-neutral-900">{appointment.patient}</h3>
                    <p className="text-sm text-neutral-600">{getTypeBadge(appointment.type)}</p>
                    <p className="text-sm text-neutral-500">{appointment.notes}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-1">
                      {getModalityIcon(appointment.modality)}
                      <span className="text-sm text-neutral-600">
                        {appointment.modality === "virtual" ? "Virtual" : appointment.room}
                      </span>
                    </div>
                    {getStatusBadge(appointment.status)}
                  </div>

                  <div className="flex space-x-2">
                    {appointment.modality === "virtual" && (
                      <Button variant="outline" size="sm">
                        <Video size={14} className="mr-1" />
                        Unirse
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Phone size={14} className="mr-1" />
                      Llamar
                    </Button>
                    <Button variant="outline" size="sm">
                      Detalles
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
