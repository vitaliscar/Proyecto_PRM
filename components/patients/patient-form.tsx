"use client"

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
import { Save, ArrowLeft, User, Phone, FileText, AlertCircle } from "lucide-react"
import { patientSchema, type PatientFormData } from "@/lib/validations/patient"
import { useCreatePatient, useUpdatePatient } from "@/hooks/use-patients"
import type { Patient } from "@/types/patient"

interface PatientFormProps {
  patient?: Patient
  mode: "create" | "edit"
}

export function PatientForm({ patient, mode }: PatientFormProps) {
  const router = useRouter()
  const createPatient = useCreatePatient()
  const updatePatient = useUpdatePatient()

  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      cedula: patient?.cedula || "",
      name: patient?.name || "",
      birthDate: patient?.birthDate || "",
      gender: patient?.gender || "male",
      phone: patient?.phone || "",
      email: patient?.email || "",
      address: patient?.address || "",
      emergencyContact: patient?.emergencyContact || "",
      medicalHistory: patient?.medicalHistory || "",
      clinicalNotes: patient?.clinicalNotes || "",
      status: patient?.status || "active",
    },
  })

  const onSubmit = async (data: PatientFormData) => {
    try {
      if (mode === "create") {
        await createPatient.mutateAsync(data)
      } else if (patient) {
        await updatePatient.mutateAsync({ id: patient.id, data })
      }
      router.push("/patients")
    } catch (error) {
      console.error("Error saving patient:", error)
    }
  }

  const isLoading = createPatient.isPending || updatePatient.isPending

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
            <h1 className="text-2xl font-bold text-gray-900">
              {mode === "create" ? "Nuevo Paciente" : "Editar Paciente"}
            </h1>
            <p className="text-gray-600">
              {mode === "create" ? "Registra un nuevo paciente en el sistema" : "Actualiza la información del paciente"}
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Información Personal */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-blue-50 border-b border-blue-100">
              <CardTitle className="flex items-center text-lg">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Información Personal
              </CardTitle>
              <CardDescription>Datos básicos de identificación del paciente</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="cedula"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Cédula de Identidad *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="V-12345678"
                          {...field}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormDescription className="text-gray-500">
                        Formato: V-12345678 o E-12345678 para extranjeros
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Nombre Completo *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Juan Carlos Pérez"
                          {...field}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Fecha de Nacimiento *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="DD/MM/YYYY"
                          {...field}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormDescription className="text-gray-500">Formato: DD/MM/YYYY (ej: 15/03/1985)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Género *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                            <SelectValue placeholder="Selecciona el género" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Masculino</SelectItem>
                          <SelectItem value="female">Femenino</SelectItem>
                          <SelectItem value="other">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Información de Contacto */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-blue-50 border-b border-blue-100">
              <CardTitle className="flex items-center text-lg">
                <Phone className="w-5 h-5 mr-2 text-blue-600" />
                Información de Contacto
              </CardTitle>
              <CardDescription>Datos de contacto y ubicación del paciente</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Teléfono *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+58-412-1234567"
                          {...field}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormDescription className="text-gray-500">
                        Formato: +58-XXX-XXXXXXX (incluir WhatsApp si aplica)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Correo Electrónico</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="correo@ejemplo.com"
                          {...field}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormDescription className="text-gray-500">
                        Opcional - para envío de recordatorios
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Dirección *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Av. Libertador, Caracas, Miranda"
                        {...field}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-h-[80px]"
                      />
                    </FormControl>
                    <FormDescription className="text-gray-500">Incluir estado y municipio</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emergencyContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Contacto de Emergencia *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="María Pérez - +58-414-7654321"
                        {...field}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormDescription className="text-gray-500">
                      Nombre y teléfono de contacto de emergencia
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Información Médica */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-blue-50 border-b border-blue-100">
              <CardTitle className="flex items-center text-lg">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                Información Médica
              </CardTitle>
              <CardDescription>Historia médica y notas clínicas del paciente</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <FormField
                control={form.control}
                name="medicalHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Historia Médica *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Diagnósticos previos, tratamientos, alergias, medicación actual..."
                        {...field}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-h-[120px]"
                      />
                    </FormControl>
                    <FormDescription className="text-gray-500">
                      Incluir diagnósticos, tratamientos previos, alergias y medicación actual
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clinicalNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Notas Clínicas *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Observaciones del psicólogo, progreso, recomendaciones..."
                        {...field}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-h-[120px]"
                      />
                    </FormControl>
                    <FormDescription className="text-gray-500">
                      Observaciones profesionales y notas de seguimiento
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Estado del Paciente *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Selecciona el estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                            Activo
                          </div>
                        </SelectItem>
                        <SelectItem value="inactive">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-gray-500 rounded-full mr-2" />
                            Inactivo
                          </div>
                        </SelectItem>
                        <SelectItem value="waiting">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2" />
                            En Espera
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Información de Consentimientos */}
          {mode === "edit" && patient?.consents && patient.consents.length > 0 && (
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="bg-blue-50 border-b border-blue-100">
                <CardTitle className="flex items-center text-lg">
                  <AlertCircle className="w-5 h-5 mr-2 text-blue-600" />
                  Consentimientos
                </CardTitle>
                <CardDescription>Estado de los consentimientos del paciente</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {patient.consents.map((consent) => (
                    <div key={consent.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{consent.name}</h4>
                        <p className="text-sm text-gray-600">Fecha: {consent.date}</p>
                      </div>
                      <Badge
                        className={
                          consent.status === "approved"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : consent.status === "pending"
                              ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                              : "bg-red-100 text-red-800 border-red-200"
                        }
                      >
                        {consent.status === "approved"
                          ? "Aprobado"
                          : consent.status === "pending"
                            ? "Pendiente"
                            : "Rechazado"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Botones de Acción */}
          <Card className="border-gray-200 shadow-sm">
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
                      {mode === "create" ? "Crear Paciente" : "Actualizar Paciente"}
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
