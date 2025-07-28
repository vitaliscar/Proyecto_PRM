"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Filter,
  Plus,
  Calendar,
  Clock,
  MapPin,
  Video,
  Phone,
  User,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react"
import { useAppointments } from "@/hooks/use-appointments"
import type { AppointmentType, AppointmentStatus } from "@/types/appointment"

export function AppointmentsList() {
  const router = useRouter()
  const { data: appointments = [], isLoading, error } = useAppointments()
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.psychologistName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === "all" || appointment.type === typeFilter
    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusBadge = (status: AppointmentStatus) => {
    const variants = {
      scheduled: "bg-blue-100 text-blue-800 border-blue-200",
      confirmed: "bg-green-100 text-green-800 border-green-200",
      completed: "bg-gray-100 text-gray-800 border-gray-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
      no_show: "bg-orange-100 text-orange-800 border-orange-200",
    }

    const labels = {
      scheduled: "Programada",
      confirmed: "Confirmada",
      completed: "Completada",
      cancelled: "Cancelada",
      no_show: "No Asistió",
    }

    return <Badge className={variants[status]}>{labels[status]}</Badge>
  }

  const getTypeBadge = (type: AppointmentType) => {
    const variants = {
      presencial: "bg-green-100 text-green-800 border-green-200",
      virtual: "bg-blue-100 text-blue-800 border-blue-200",
      telefonica: "bg-purple-100 text-purple-800 border-purple-200",
    }

    const icons = {
      presencial: <MapPin className="w-3 h-3" />,
      virtual: <Video className="w-3 h-3" />,
      telefonica: <Phone className="w-3 h-3" />,
    }

    return (
      <Badge className={variants[type]}>
        {icons[type]}
        <span className="ml-1 capitalize">{type}</span>
      </Badge>
    )
  }

  const getStatusIcon = (status: AppointmentStatus) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "scheduled":
        return <Clock className="w-4 h-4 text-blue-600" />
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "completed":
        return <CheckCircle className="w-4 h-4 text-gray-600" />
      case "no_show":
        return <AlertTriangle className="w-4 h-4 text-orange-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">Error al cargar las citas. Por favor, intenta nuevamente.</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Citas</p>
                <p className="text-2xl font-bold text-blue-900">{appointments.length}</p>
                <p className="text-sm text-blue-600">Este mes</p>
              </div>
              <Calendar className="text-blue-600" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Confirmadas</p>
                <p className="text-2xl font-bold text-green-900">
                  {appointments.filter((a) => a.status === "confirmed").length}
                </p>
                <p className="text-sm text-green-600">Listas para realizar</p>
              </div>
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Virtuales</p>
                <p className="text-2xl font-bold text-purple-900">
                  {appointments.filter((a) => a.type === "virtual").length}
                </p>
                <p className="text-sm text-purple-600">Modalidad online</p>
              </div>
              <Video className="text-purple-600" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Pendientes</p>
                <p className="text-2xl font-bold text-orange-900">
                  {appointments.filter((a) => a.status === "scheduled").length}
                </p>
                <p className="text-sm text-orange-600">Por confirmar</p>
              </div>
              <Clock className="text-orange-600" size={24} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main List */}
      <Card className="bg-white border-blue-200 shadow-sm">
        <CardHeader className="bg-blue-50 border-b border-blue-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Gestión de Citas
              </CardTitle>
              <CardDescription className="text-gray-600">
                Administra y programa las citas de tus pacientes
              </CardDescription>
            </div>
            <Button
              onClick={() => router.push("/appointments/create")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Cita
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por paciente o psicólogo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-48 border-gray-300">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="presencial">Presencial</SelectItem>
                <SelectItem value="virtual">Virtual</SelectItem>
                <SelectItem value="telefonica">Telefónica</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 border-gray-300">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="scheduled">Programadas</SelectItem>
                <SelectItem value="confirmed">Confirmadas</SelectItem>
                <SelectItem value="completed">Completadas</SelectItem>
                <SelectItem value="cancelled">Canceladas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Lista de Citas */}
          <div className="space-y-4">
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>
                  {searchTerm || typeFilter !== "all" || statusFilter !== "all"
                    ? "No se encontraron citas con los filtros aplicados"
                    : "No hay citas programadas"}
                </p>
                <Button
                  variant="outline"
                  className="mt-4 bg-transparent"
                  onClick={() => router.push("/appointments/create")}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Programar Primera Cita
                </Button>
              </div>
            ) : (
              filteredAppointments
                .sort((a, b) => {
                  const dateA = new Date(`${a.date.split("/").reverse().join("-")}T${a.time}`)
                  const dateB = new Date(`${b.date.split("/").reverse().join("-")}T${b.time}`)
                  return dateA.getTime() - dateB.getTime()
                })
                .map((appointment) => (
                  <Card
                    key={appointment.id}
                    className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => router.push(`/appointments/${appointment.id}`)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <Avatar className="w-12 h-12">
                            <AvatarImage
                              src={`/placeholder.svg?height=48&width=48&query=${appointment.patientName}`}
                              alt={appointment.patientName}
                            />
                            <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">
                              {getInitials(appointment.patientName)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-gray-900 truncate">{appointment.patientName}</h3>
                              {getTypeBadge(appointment.type)}
                            </div>

                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3" />
                                <span>{appointment.date}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>
                                  {appointment.time} ({appointment.duration} min)
                                </span>
                              </div>
                              {appointment.room && (
                                <div className="flex items-center space-x-1">
                                  <MapPin className="w-3 h-3" />
                                  <span className="truncate">{appointment.room}</span>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <User className="w-3 h-3" />
                              <span>Con: {appointment.psychologistName}</span>
                            </div>

                            {appointment.notes && (
                              <p className="text-sm text-gray-600 mt-2 truncate">{appointment.notes}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col items-end space-y-2 ml-4">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(appointment.status)}
                            {getStatusBadge(appointment.status)}
                          </div>

                          {!appointment.reminderSent && appointment.status !== "cancelled" && (
                            <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                              Recordatorio pendiente
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </div>

          {/* Información de resultados */}
          {filteredAppointments.length > 0 && (
            <div className="mt-4 text-sm text-gray-600">
              Mostrando {filteredAppointments.length} de {appointments.length} citas
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
