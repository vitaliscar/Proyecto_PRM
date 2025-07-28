"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  Edit,
  Calendar,
  Clock,
  User,
  MapPin,
  Video,
  Phone,
  CheckCircle,
  XCircle,
  Copy,
  ExternalLink,
  MessageSquare,
  Bell,
} from "lucide-react"
import { useAppointment, useConfirmAppointment, useCancelAppointment } from "@/hooks/use-appointments"
import type { AppointmentType, AppointmentStatus } from "@/types/appointment"

interface AppointmentDetailsProps {
  appointmentId: string
}

export function AppointmentDetails({ appointmentId }: AppointmentDetailsProps) {
  const router = useRouter()
  const { data: appointment, isLoading, error } = useAppointment(appointmentId)
  const confirmAppointment = useConfirmAppointment()
  const cancelAppointment = useCancelAppointment()

  const [cancelReason, setCancelReason] = useState("")
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error || !appointment) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">Error al cargar la información de la cita.</div>
          </CardContent>
        </Card>
      </div>
    )
  }

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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleConfirm = async () => {
    try {
      await confirmAppointment.mutateAsync(appointment.id)
    } catch (error) {
      console.error("Error confirming appointment:", error)
    }
  }

  const handleCancel = async () => {
    try {
      await cancelAppointment.mutateAsync({ id: appointment.id, reason: cancelReason })
      setShowCancelDialog(false)
      setCancelReason("")
    } catch (error) {
      console.error("Error cancelling appointment:", error)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()} className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Detalles de la Cita</h1>
            <p className="text-gray-600 mt-1">
              {appointment.date} • {appointment.time}
            </p>
          </div>
        </div>

        <div className="flex space-x-2">
          {appointment.status === "scheduled" && (
            <Button
              onClick={handleConfirm}
              disabled={confirmAppointment.isPending}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Confirmar
            </Button>
          )}

          {(appointment.status === "scheduled" || appointment.status === "confirmed") && (
            <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50 bg-transparent">
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cancelar Cita</DialogTitle>
                  <DialogDescription>
                    ¿Estás seguro de que deseas cancelar esta cita? Esta acción no se puede deshacer.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Motivo de cancelación (opcional)</label>
                    <Textarea
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      placeholder="Describe el motivo de la cancelación..."
                      className="mt-1"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleCancel}
                      disabled={cancelAppointment.isPending}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Confirmar Cancelación
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}

          <Button
            variant="outline"
            onClick={() => router.push(`/appointments/${appointment.id}/edit`)}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
        </div>
      </div>

      {/* Alerta de Estado */}
      {appointment.status === "cancelled" && (
        <Alert className="border-red-200 bg-red-50">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Esta cita ha sido cancelada. No se realizará la sesión programada.
          </AlertDescription>
        </Alert>
      )}

      {appointment.status === "scheduled" && !appointment.reminderSent && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <Bell className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            Recordatorio pendiente de envío. El paciente será notificado 24 horas antes de la cita.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Detalles de la Cita */}
          <Card className="border-blue-200 shadow-sm">
            <CardHeader className="bg-blue-50 border-b border-blue-100">
              <CardTitle className="flex items-center text-lg">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Información de la Cita
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-600">Fecha</label>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{appointment.date}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Hora</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <p className="text-lg font-semibold text-gray-900">
                      {appointment.time} ({appointment.duration} min)
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Tipo de Cita</label>
                  <div className="mt-1">{getTypeBadge(appointment.type)}</div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Estado</label>
                  <div className="mt-1">{getStatusBadge(appointment.status)}</div>
                </div>

                {appointment.room && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Sala</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <p className="text-lg text-gray-900">{appointment.room}</p>
                    </div>
                  </div>
                )}

                {appointment.virtualLink && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Enlace Virtual</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Video className="w-4 h-4 text-gray-400" />
                      <a
                        href={appointment.virtualLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        Unirse a la reunión
                      </a>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(appointment.virtualLink!)}
                        className="p-1 h-auto"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(appointment.virtualLink, "_blank")}
                        className="p-1 h-auto"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {appointment.notes && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <label className="text-sm font-medium text-gray-600">Notas</label>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-900 whitespace-pre-wrap">{appointment.notes}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Información del Paciente */}
          <Card className="border-blue-200 shadow-sm">
            <CardHeader className="bg-blue-50 border-b border-blue-100">
              <CardTitle className="flex items-center text-lg">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Información del Paciente
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage
                    src={`/placeholder.svg?height=64&width=64&query=${appointment.patientName}`}
                    alt={appointment.patientName}
                  />
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-xl font-semibold">
                    {getInitials(appointment.patientName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{appointment.patientName}</h3>
                  <p className="text-gray-600">ID: {appointment.patientId}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button variant="outline" className="justify-start bg-transparent">
                  <User className="w-4 h-4 mr-2" />
                  Ver Perfil
                </Button>
                <Button variant="outline" className="justify-start bg-transparent">
                  <Calendar className="w-4 h-4 mr-2" />
                  Historial de Citas
                </Button>
                <Button variant="outline" className="justify-start bg-transparent">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Enviar Mensaje
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Información del Psicólogo */}
          <Card className="border-blue-200 shadow-sm">
            <CardHeader className="bg-blue-50 border-b border-blue-100">
              <CardTitle className="text-lg">Psicólogo Asignado</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage
                    src={`/placeholder.svg?height=48&width=48&query=${appointment.psychologistName}`}
                    alt={appointment.psychologistName}
                  />
                  <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">
                    {getInitials(appointment.psychologistName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900">{appointment.psychologistName}</h3>
                  <p className="text-sm text-gray-600">Psicología Clínica</p>
                </div>
              </div>

              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <User className="w-4 h-4 mr-2" />
                  Ver Perfil
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contactar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Acciones Rápidas */}
          <Card className="border-blue-200 shadow-sm">
            <CardHeader className="bg-blue-50 border-b border-blue-100">
              <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Calendar className="w-4 h-4 mr-2" />
                Reprogramar
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Copy className="w-4 h-4 mr-2" />
                Duplicar Cita
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Bell className="w-4 h-4 mr-2" />
                Enviar Recordatorio
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <MessageSquare className="w-4 h-4 mr-2" />
                Notas de Sesión
              </Button>
            </CardContent>
          </Card>

          {/* Información del Sistema */}
          <Card className="border-blue-200 shadow-sm">
            <CardHeader className="bg-blue-50 border-b border-blue-100">
              <CardTitle className="text-lg">Información del Sistema</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Creada</label>
                <p className="text-sm text-gray-900">
                  {new Date(appointment.createdAt).toLocaleDateString("es-VE", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Última Actualización</label>
                <p className="text-sm text-gray-900">
                  {new Date(appointment.updatedAt).toLocaleDateString("es-VE", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Recordatorio</label>
                <p className="text-sm text-gray-900">{appointment.reminderSent ? "Enviado" : "Pendiente"}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
