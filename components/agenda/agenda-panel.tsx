"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, CheckSquare, AlertTriangle, Brain, RefreshCw } from "lucide-react"
import { AppointmentsCard } from "./appointments-card"
import { RoomsCard } from "./rooms-card"
import { TasksCard } from "./tasks-card"
import { AlertsCard } from "./alerts-card"
import { useAgenda } from "@/hooks/use-agenda"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export function AgendaPanel() {
  const today = format(new Date(), "dd/MM/yyyy")
  const { data: agendaData, isLoading, error, refetch } = useAgenda(today)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto mb-4 text-blue-600" size={48} />
          <p className="text-lg font-medium text-gray-900">Cargando agenda inteligente...</p>
          <p className="text-sm text-gray-600">Analizando datos del día</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="mx-auto mb-4 text-red-500" size={48} />
          <p className="text-lg font-medium text-gray-900">Error al cargar la agenda</p>
          <p className="text-sm text-gray-600 mb-4">No se pudo conectar con el servidor</p>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw size={16} className="mr-2" />
            Reintentar
          </Button>
        </div>
      </div>
    )
  }

  if (!agendaData) {
    return null
  }

  const todayFormatted = format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agenda Inteligente</h1>
          <p className="text-gray-600 mt-1 capitalize">{todayFormatted}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw size={16} className="mr-2" />
            Actualizar
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Calendar size={16} className="mr-2" />
            Ver Calendario
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Citas Hoy</p>
                <p className="text-2xl font-bold text-gray-900">{agendaData.stats.totalAppointments}</p>
                <p className="text-sm text-blue-600">{agendaData.stats.completedAppointments} completadas</p>
              </div>
              <Calendar className="text-blue-600" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Salas Disponibles</p>
                <p className="text-2xl font-bold text-gray-900">{agendaData.stats.availableRooms}</p>
                <p className="text-sm text-green-600">de {agendaData.rooms.length} totales</p>
              </div>
              <MapPin className="text-green-600" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tareas Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">{agendaData.stats.pendingTasks}</p>
                <p className="text-sm text-orange-600">por completar</p>
              </div>
              <CheckSquare className="text-orange-600" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Alertas Críticas</p>
                <p className="text-2xl font-bold text-gray-900">{agendaData.stats.criticalAlerts}</p>
                <p className="text-sm text-red-600">requieren atención</p>
              </div>
              <AlertTriangle className="text-red-600" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Eficiencia IA</p>
                <p className="text-2xl font-bold text-gray-900">{agendaData.stats.efficiency}%</p>
                <p className="text-sm text-blue-600">optimización activa</p>
              </div>
              <Brain className="text-blue-600" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tiempo Activo</p>
                <p className="text-2xl font-bold text-gray-900">6.5h</p>
                <p className="text-sm text-purple-600">de 8h disponibles</p>
              </div>
              <Clock className="text-purple-600" size={24} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <AppointmentsCard appointments={agendaData.appointments} />
          <TasksCard tasks={agendaData.tasks} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <AlertsCard alerts={agendaData.alerts} />
          <RoomsCard rooms={agendaData.rooms} />
        </div>
      </div>
    </div>
  )
}
