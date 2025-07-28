"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useCreateCampaign } from "@/hooks/use-marketing"
import type { CampaignFormData } from "@/types/marketing"
import { Mail, MessageSquare, Phone, Send, Calendar, Users } from "lucide-react"

const campaignSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  type: z.enum(["email", "sms", "whatsapp"]),
  subject: z.string().optional(),
  content: z.string().min(1, "El contenido es requerido"),
  targetAudience: z.array(z.string()).min(1, "Selecciona al menos una audiencia"),
  scheduledDate: z.string().optional(),
})

const campaignTypes = [
  { value: "email", label: "Email", icon: Mail, description: "Envío masivo de correos electrónicos" },
  { value: "sms", label: "SMS", icon: MessageSquare, description: "Mensajes de texto a móviles" },
  { value: "whatsapp", label: "WhatsApp", icon: Phone, description: "Mensajes por WhatsApp Business" },
]

const audienceOptions = [
  { value: "new", label: "Leads Nuevos", description: "Personas que acaban de registrarse" },
  { value: "contacted", label: "Contactados", description: "Leads que ya fueron contactados" },
  { value: "qualified", label: "Calificados", description: "Leads con alta probabilidad de conversión" },
  { value: "converted", label: "Convertidos", description: "Clientes que ya agendaron citas" },
]

export function CampaignForm() {
  const createCampaign = useCreateCampaign()
  const [selectedType, setSelectedType] = useState<"email" | "sms" | "whatsapp">("email")

  const form = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: "",
      type: "email",
      subject: "",
      content: "",
      targetAudience: [],
      scheduledDate: "",
    },
  })

  const onSubmit = (data: CampaignFormData) => {
    createCampaign.mutate(data, {
      onSuccess: () => {
        form.reset()
      },
    })
  }

  const getContentPlaceholder = (type: string) => {
    switch (type) {
      case "email":
        return "Estimado/a {nombre},\n\nGracias por tu interés en nuestros servicios de psicología...\n\nSaludos cordiales,\nEquipo CRECES"
      case "sms":
        return "Hola {nombre}, recordatorio de tu cita el {fecha} a las {hora}. Confirma tu asistencia respondiendo SÍ."
      case "whatsapp":
        return "¡Hola {nombre}! 👋\n\nTe escribimos desde CRECES para recordarte tu próxima cita..."
      default:
        return ""
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-800">
            <Send className="h-6 w-6" />
            <span>Crear Nueva Campaña</span>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Form */}
      <Card className="bg-white border-blue-200">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Campaign Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-800 font-semibold">Nombre de la Campaña</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: Campaña de Bienvenida Enero 2025"
                        className="border-blue-200 focus:border-blue-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campaign Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-800 font-semibold">Tipo de Campaña</FormLabel>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {campaignTypes.map((type) => {
                        const Icon = type.icon
                        return (
                          <div
                            key={type.value}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              field.value === type.value
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-blue-300"
                            }`}
                            onClick={() => {
                              field.onChange(type.value)
                              setSelectedType(type.value as any)
                            }}
                          >
                            <div className="flex items-center space-x-3">
                              <Icon
                                className={`h-6 w-6 ${field.value === type.value ? "text-blue-600" : "text-gray-400"}`}
                              />
                              <div>
                                <div className="font-medium text-gray-900">{type.label}</div>
                                <div className="text-sm text-gray-500">{type.description}</div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Subject (only for email) */}
              {selectedType === "email" && (
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-800 font-semibold">Asunto del Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej: Bienvenido a CRECES - Tu bienestar es nuestra prioridad"
                          className="border-blue-200 focus:border-blue-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Content */}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-800 font-semibold">
                      Contenido del {selectedType === "email" ? "Email" : "Mensaje"}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={getContentPlaceholder(selectedType)}
                        className="min-h-32 border-blue-200 focus:border-blue-400"
                        {...field}
                      />
                    </FormControl>
                    <div className="text-sm text-gray-500">
                      Variables disponibles: {"{nombre}"}, {"{fecha}"}, {"{hora}"}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Target Audience */}
              <FormField
                control={form.control}
                name="targetAudience"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-blue-800 font-semibold flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>Audiencia Objetivo</span>
                    </FormLabel>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {audienceOptions.map((option) => (
                        <FormField
                          key={option.value}
                          control={form.control}
                          name="targetAudience"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(option.value)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, option.value])
                                      : field.onChange(field.value?.filter((value) => value !== option.value))
                                  }}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-sm font-medium">{option.label}</FormLabel>
                                <div className="text-xs text-gray-500">{option.description}</div>
                              </div>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Scheduled Date */}
              <FormField
                control={form.control}
                name="scheduledDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-800 font-semibold flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Programar Envío (Opcional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="datetime-local" className="border-blue-200 focus:border-blue-400" {...field} />
                    </FormControl>
                    <div className="text-sm text-gray-500">Deja vacío para enviar inmediatamente</div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  Limpiar
                </Button>
                <Button
                  type="submit"
                  disabled={createCampaign.isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {createCampaign.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creando...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Crear Campaña
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Success Message */}
      {createCampaign.isSuccess && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-green-800">
              <div className="h-2 w-2 bg-green-600 rounded-full"></div>
              <span className="font-medium">Campaña creada exitosamente</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
