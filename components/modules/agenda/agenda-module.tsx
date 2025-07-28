"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, MapPin, Video, CheckCircle, Users, Brain } from "lucide-react"

const todaySchedule = [
  {
    id: 1,
    time: "09:00",
    patient: "Ana María Rodríguez",
    type: "Consulta Individual",
    duration: 60,
    room: "Sala 1",
    status: "confirmed",
    notes: "Seguimiento de ansiedad",
    priority: "normal",
  },
  {
    id: 2,
    time: "10:30",
    patient: "Carlos Eduardo Mendoza",
    type: "Evaluación PHQ-9",
    duration: 45,
    room: "Virtual",
    status: "pending",
    notes: "Primera evaluación",
    priority: "high",
  },
  {
    id: 3,
    time: "12:00",
    patient: "Descanso",
    type: "break",
    duration: 60,
    room: null,
    status: "break",
    notes: "Almuerzo",
    priority: "normal",
  },
  {
    id: 4,
    time: "14:00",
    patient: "María Fernanda García",
    type: "Teleterapia",
    duration: 60,
    room: "Virtual",
    status: "confirmed",
    notes: "Sesión 5 - Terapia cognitiva",
    priority: "high",
  },
  {
    id: 5,
    time: "15:30",
    patient: "José Antonio López",
    type: "Seguimiento",
    duration: 45,
    room: "Sala 2",
    status: "completed",
    notes: "Revisión de progreso",
    priority: "normal",
  },
]

const aiSuggestions = [
  {
    id: 1,
    type: "optimization",
    message: "Considera reasignar la cita de 10:30 a Sala 2 para mejor flujo",
    priority: "medium",
  },
  {
    id: 2,
    type: "alert",
    message: "Paciente María García presenta alto riesgo - preparar protocolo de crisis",
    priority: "high",
  },
  {
    id: 3,
    type: "resource",
    message: "Sala 1 disponible para cita adicional entre 16:30-17:30",
    priority: "low",
  },
]

const roomStatus = [
  { name: "Sala 1", status: "occupied", nextAvailable: "10:30", currentPatient: "Ana Rodríguez" },
  { name: "Sala 2", status: "available", nextAvailable: "Ahora", currentPatient: null },
  { name: "Sala 3", status: "maintenance", nextAvailable: "15:00", currentPatient: null },
  { name: "Virtual", status: "available", nextAvailable: "Ahora", currentPatient: null },
]

export function AgendaModule() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="text-green-600" size={16} />
      case "pending":
        return <Clock className="text-yellow-600" size={16} />
      case "completed":
        return <CheckCircle className="text-blue-600" size={16} />
      case "break":
        return <Clock className="text-neutral-400" size={16} />
      default:
        return null
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">Alta</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Media</Badge>
      case "low":
        return <Badge className="bg-green-100 text-green-800">Baja</Badge>
      default:
        return null
    }
  }

  const getRoomStatusColor = (status: string) => {
    switch (status) {
      case "occupied":
        return "bg-red-100 text-red-800"
      case "available":
        return "bg-green-100 text-green-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Agenda Inteligente</h1>
          <p className="text-neutral-600 mt-1">Panel optimizado para tu día de trabajo - Lunes, 22 de Enero 2024</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Calendar size={16} className="mr-2" />
            Ver Semana
          </Button>
          <Button className="bg-primary-500 hover:bg-primary-600">
            <Users size={16} className="mr-2" />
            Nueva Cita
          </Button>
        </div>
      </div>

      {/* Daily Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Citas Hoy</p>
                <p className="text-2xl font-bold text-neutral-900">4</p>
                <p className="text-sm text-green-600">+1 vs ayer</p>
              </div>
              <Calendar className="text-blue-600" size={24} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Tiempo Total</p>
                <p className="text-2xl font-bold text-neutral-900">4.5h</p>
                <p className="text-sm text-neutral-500">de 8h disponibles</p>
              </div>
              <Clock className="text-purple-600" size={24} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Salas Activas</p>
                <p className="text-2xl font-bold text-neutral-900">2/4</p>
                <p className="text-sm text-green-600">Disponibilidad alta</p>
              </div>
              <MapPin className="text-green-600" size={24} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Eficiencia IA</p>
                <p className="text-2xl font-bold text-neutral-900">94%</p>
                <p className="text-sm text-blue-600">Optimización activa</p>
              </div>
              <Brain className="text-blue-600" size={24} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2" size={20} />
              Cronograma del Día
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todaySchedule.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-4 rounded-lg border-l-4 ${
                    item.type === "break"
                      ? "bg-neutral-50 border-neutral-300"
                      : item.priority === "high"
                        ? "bg-red-50 border-red-400"
                        : "bg-white border-blue-400"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-neutral-900">{item.time}</p>
                      <p className="text-sm text-neutral-600">{item.duration}min</p>
                    </div>

                    {item.type !== "break" && (
                      <Avatar>
                        <AvatarImage src={`/placeholder.svg?height=40&width=40&query=${item.patient}`} />
                        <AvatarFallback>
                          {item.patient
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div className="flex-1">
                      <h3
                        className={`font-semibold ${item.type === "break" ? "text-neutral-600" : "text-neutral-900"}`}
                      >
                        {item.patient}
                      </h3>
                      <p className="text-sm text-neutral-600">{item.type}</p>
                      <p className="text-sm text-neutral-500">{item.notes}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-1">
                        {item.room === "Virtual" ? <Video size={16} /> : <MapPin size={16} />}
                        <span className="text-sm text-neutral-600">{item.room || "Sin asignar"}</span>
                      </div>
                      {item.priority !== "normal" && getPriorityBadge(item.priority)}
                    </div>

                    <div className="flex items-center space-x-2">
                      {getStatusIcon(item.status)}
                      {item.type !== "break" && (
                        <Button variant="outline" size="sm">
                          Detalles
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* AI Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="mr-2" size={20} />
                Sugerencias de IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiSuggestions.map((suggestion) => (
                  <div key={suggestion.id} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          suggestion.priority === "high"
                            ? "bg-red-500"
                            : suggestion.priority === "medium"
                              ? "bg-yellow-500"
                              : "bg-blue-500"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-sm text-blue-900">{suggestion.message}</p>
                        <div className="flex justify-between items-center mt-2">
                          {getPriorityBadge(suggestion.priority)}
                          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                            Aplicar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Room Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2" size={20} />
                Estado de Salas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {roomStatus.map((room, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-neutral-900">{room.name}</h4>
                      {room.currentPatient && <p className="text-sm text-neutral-600">{room.currentPatient}</p>}
                    </div>
                    <div className="text-right">
                      <Badge className={getRoomStatusColor(room.status)}>
                        {room.status === "occupied"
                          ? "Ocupada"
                          : room.status === "available"
                            ? "Disponible"
                            : "Mantenimiento"}
                      </Badge>
                      <p className="text-xs text-neutral-500 mt-1">Disponible: {room.nextAvailable}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
