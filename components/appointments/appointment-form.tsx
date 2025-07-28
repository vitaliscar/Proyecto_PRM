"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  Save,
  Calendar,
  Clock,
  User,
  MapPin,
  Video,
  Phone,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react"
import { appointmentSchema, validateAppointmentByType, type AppointmentFormData } from "@/lib/validations/appointment"
import { useCreateAppointment, useUpdateAppointment } from "@/hooks/use-appointments"
import { usePatients } from "@/hooks/use-patients"
import { rooms, timeSlots } from "@/data/rooms"
import type { Appointment } from "@/types/appointment"

interface AppointmentFormProps {
  appointment?: Appointment
  mode: "create" | "edit"
  initialDate?: Date
}

// Datos simulados de psicólogos
const psychologists = [
  { id: "psy-1", name: "Dr. María González", specialty: "Psicología Clínica", available: true },
  { id: "psy-2", name: "Dr. Carlos Mendoza", specialty: "Terapia Familiar", available: true },
  { id: "psy-3", name: "Dra. Ana Rodríguez", specialty: "Psicología Infantil", available: false },
]

export function AppointmentForm({ appointment, mode, initialDate }: AppointmentFormProps) {
  const router = useRouter()
  const { data: patients = [] } = usePatients()
  const createAppointment = useCreateAppointment()
  const updateAppointment = useUpdateAppointment()

  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [selectedType, setSelectedType] = useState<string>("")
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const formatDateToString = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patientId: appointment?.patientId || "",
      psychologistId: appointment?.psychologistId || "",
      date: appointment?.date || (initialDate ? formatDateToString(initialDate) : ""),
      time: appointment?.time || "",
      duration: appointment?.duration || 60,
      type: appointment?.type || "presencial",
      room: appointment?.room || "",
      virtualLink: appointment?.virtualLink || "",
      notes: appointment?.notes || "",
    },
  })

  const watchedDate = form.watch("date")
  const watchedPsychologist = form.watch("psychologistId")
  const watchedType = form.watch("type")

  // Simular disponibilidad de horarios
  useEffect(() => {
    if (watchedDate && watchedPsychologist) {
      // Simular algunos horarios ocupados
      const occupiedSlots = ["09:00", "14:00", "16:30"]
      const available = timeSlots.filter((slot) => !occupiedSlots.includes(slot))
      setAvailableSlots(available)
    }
  }, [watchedDate, watchedPsychologist])

  // Actualizar tipo seleccionado
  useEffect(() => {
    setSelectedType(watchedType)

    // Limpiar campos condicionales cuando cambia el tipo
    if (watchedType !== "presencial") {
      form.setValue("room", "")
    }
    if (watchedType !== "virtual") {
      form.setValue("virtualLink", "")
    }
  }, [watchedType, form])

  const onSubmit = async (data: AppointmentFormData) => {
    // Validación adicional por tipo
    const typeErrors = validateAppointmentByType(data)
    if (typeErrors.length > 0) {
      setValidationErrors(typeErrors)
      return
    }

    setValidationErrors([])

    try {
      if (mode === "create") {
        await createAppointment.mutateAsync(data)
      } else if (appointment) {
        await updateAppointment.mutateAsync({ id: appointment.id, data })
      }
      router.push("/appointments")
    } catch (error) {
      console.error("Error saving appointment:", error)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "virtual":
        return <Video className="w-4 h-4" />
      case "presencial":
        return <MapPin className="w-4 h-4" />
      case "telefonica":
        return <Phone className="w-4 h-4" />
      default:
        return <Calendar className="w-4 h-4" />
    }
  }

  const getTypeDescription = (type: string) => {
    switch (type) {
      case "virtual":
        return "Sesión por videollamada - Requiere enlace de reunión"
      case "presencial":
        return "Sesión en las instalaciones - Requiere asignación de sala"
      case "telefonica":
        return "Sesión por llamada telefónica - Sin requerimientos adicionales"
      default:
        return ""
    }
  }

  const isLoading = createAppointment.isPending || updateAppointment.isPending

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()} className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{mode === "create" ? "Nueva Cita" : "Editar Cita"}</h1>
            <p className="text-gray-600">
              {mode === "create" ? "Programa una nueva cita médica" : "Actualiza la información de la cita"}
            </p>
          </div>
        </div>
      </div>

      {/* Errores de validación */}
      {validationErrors.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <ul className="list-disc list-inside space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Información Básica */}
          <Card className="border-blue-200 shadow-sm">
            <CardHeader className="bg-blue-50 border-b border-blue-100">
              <CardTitle className="flex items-center text-lg">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Información Básica
              </CardTitle>
              <CardDescription>Selecciona el paciente y psicólogo para la cita</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="patientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Paciente *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                            <SelectValue placeholder="Selecciona un paciente" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {patients.map((patient) => (
                            <SelectItem key={patient.id} value={patient.id}>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{patient.name}</span>
                                <span className="text-gray-500">({patient.cedula})</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="psychologistId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Psicólogo *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                            <SelectValue placeholder="Selecciona un psicólogo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {psychologists.map((psychologist) => (
                            <SelectItem
                              key={psychologist.id}
                              value={psychologist.id}
                              disabled={!psychologist.available}
                            >
                              <div className="flex items-center justify-between w-full">
                                <div>
                                  <div className="font-medium">{psychologist.name}</div>
                                  <div className="text-sm text-gray-500">{psychologist.specialty}</div>
                                </div>
                                {!psychologist.available && (
                                  <Badge variant="outline" className="text-xs">
                                    No disponible
                                  </Badge>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Fecha y Hora */}
          <Card className="border-blue-200 shadow-sm">
            <CardHeader className="bg-blue-50 border-b border-blue-100">
              <CardTitle className="flex items-center text-lg">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Fecha y Hora
              </CardTitle>
              <CardDescription>Programa la fecha, hora y duración de la cita</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Fecha *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="DD/MM/YYYY"
                          {...field}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormDescription className="text-gray-500">Formato: DD/MM/YYYY (ej: 27/07/2025)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Hora *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                            <SelectValue placeholder="Selecciona la hora" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableSlots.map((slot) => (
                            <SelectItem key={slot} value={slot}>
                              <div className="flex items-center space-x-2">
                                <Clock className="w-3 h-3" />
                                <span>{slot}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-gray-500">
                        Horarios disponibles para el psicólogo seleccionado
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Duración (minutos) *</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                            <SelectValue placeholder="Duración" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="30">30 minutos</SelectItem>
                          <SelectItem value="45">45 minutos</SelectItem>
                          <SelectItem value="60">60 minutos</SelectItem>
                          <SelectItem value="90">90 minutos</SelectItem>
                          <SelectItem value="120">120 minutos</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Tipo de Cita */}
          <Card className="border-blue-200 shadow-sm">
            <CardHeader className="bg-blue-50 border-b border-blue-100">
              <CardTitle className="flex items-center text-lg">
                <Video className="w-5 h-5 mr-2 text-blue-600" />
                Tipo de Cita
              </CardTitle>
              <CardDescription>Selecciona la modalidad de la sesión</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                      >
                        {[
                          { value: "presencial", label: "Presencial", icon: MapPin },
                          { value: "virtual", label: "Virtual", icon: Video },
                          { value: "telefonica", label: "Telefónica", icon: Phone },
                        ].map((option) => {
                          const Icon = option.icon
                          return (
                            <div key={option.value}>
                              <RadioGroupItem value={option.value} id={option.value} className="peer sr-only" />
                              <Label
                                htmlFor={option.value}
                                className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300 peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-all"
                              >
                                <Icon className="w-8 h-8 mb-3 text-blue-600" />
                                <span className="font-medium text-gray-900">{option.label}</span>
                                <span className="text-sm text-gray-500 text-center mt-2">
                                  {getTypeDescription(option.value)}
                                </span>
                              </Label>
                            </div>
                          )
                        })}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Configuración Específica por Tipo */}
          {selectedType && (
            <Card className="border-blue-200 shadow-sm">
              <CardHeader className="bg-blue-50 border-b border-blue-100">
                <CardTitle className="flex items-center text-lg">
                  {getTypeIcon(selectedType)}
                  <span className="ml-2">
                    Configuración - {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {selectedType === "presencial" && (
                  <FormField
                    control={form.control}
                    name="room"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Sala *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                              <SelectValue placeholder="Selecciona una sala" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {rooms.map((room) => (
                              <SelectItem key={room.id} value={room.name} disabled={!room.available}>
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium">{room.name}</span>
                                    {!room.available && (
                                      <Badge variant="outline" className="text-xs">
                                        Ocupada
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="text-sm text-gray-500">Capacidad: {room.capacity} personas</div>
                                  <div className="text-xs text-gray-400">
                                    {room.equipment.slice(0, 2).join(", ")}
                                    {room.equipment.length > 2 && ` +${room.equipment.length - 2} más`}
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-gray-500">
                          Selecciona la sala donde se realizará la cita presencial
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {selectedType === "virtual" && (
                  <FormField
                    control={form.control}
                    name="virtualLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Enlace de Reunión *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://meet.google.com/abc-defg-hij"
                            {...field}
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormDescription className="text-gray-500">
                          URL de la videollamada (Google Meet, Zoom, Teams, etc.)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {selectedType === "telefonica" && (
                  <Alert className="border-blue-200 bg-blue-50">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      Para citas telefónicas, el psicólogo contactará al paciente en el número registrado en su perfil.
                      Asegúrate de que la información de contacto esté actualizada.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}

          {/* Notas Adicionales */}
          <Card className="border-blue-200 shadow-sm">
            <CardHeader className="bg-blue-50 border-b border-blue-100">
              <CardTitle className="flex items-center text-lg">
                <AlertTriangle className="w-5 h-5 mr-2 text-blue-600" />
                Notas Adicionales
              </CardTitle>
              <CardDescription>Información adicional sobre la cita</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Notas</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Motivo de la consulta, preparación especial, recordatorios..."
                        {...field}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-h-[100px]"
                      />
                    </FormControl>
                    <FormDescription className="text-gray-500">
                      Información adicional que pueda ser útil para la cita (máximo 500 caracteres)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Resumen de la Cita */}
          {form.watch("patientId") && form.watch("date") && form.watch("time") && (
            <Card className="border-green-200 bg-green-50 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-lg text-green-800">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Resumen de la Cita
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-green-700">Paciente:</span>
                    <span className="ml-2 text-green-800">
                      {patients.find((p) => p.id === form.watch("patientId"))?.name || "No seleccionado"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-green-700">Psicólogo:</span>
                    <span className="ml-2 text-green-800">
                      {psychologists.find((p) => p.id === form.watch("psychologistId"))?.name || "No seleccionado"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-green-700">Fecha:</span>
                    <span className="ml-2 text-green-800">{form.watch("date")}</span>
                  </div>
                  <div>
                    <span className="font-medium text-green-700">Hora:</span>
                    <span className="ml-2 text-green-800">
                      {form.watch("time")} ({form.watch("duration")} min)
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-green-700">Tipo:</span>
                    <span className="ml-2 text-green-800 capitalize">{form.watch("type")}</span>
                  </div>
                  {form.watch("room") && (
                    <div>
                      <span className="font-medium text-green-700">Sala:</span>
                      <span className="ml-2 text-green-800">{form.watch("room")}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Botones de Acción */}
          <Card className="border-blue-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Guardando...
                    </div>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {mode === "create" ? "Crear Cita" : "Actualizar Cita"}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  )
}
