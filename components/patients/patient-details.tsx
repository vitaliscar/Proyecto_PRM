"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Edit,
  Phone,
  Mail,
  MapPin,
  Calendar,
  User,
  FileText,
  AlertCircle,
  Download,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { usePatient } from "@/hooks/use-patients"

interface PatientDetailsProps {
  patientId: string
}

export function PatientDetails({ patientId }: PatientDetailsProps) {
  const router = useRouter()
  const { data: patient, isLoading, error } = usePatient(patientId)

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error || !patient) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">Error al cargar la información del paciente.</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800 border-green-200",
      inactive: "bg-gray-100 text-gray-800 border-gray-200",
      waiting: "bg-yellow-100 text-yellow-800 border-yellow-200",
    }

    const labels = {
      active: "Activo",
      inactive: "Inactivo",
      waiting: "En Espera",
    }

    return (
      <Badge className={variants[status as keyof typeof variants] || variants.inactive}>
        {labels[status as keyof typeof labels] || "Desconocido"}
      </Badge>
    )
  }

  const getConsentStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600" />
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

  const calculateAge = (birthDate: string) => {
    const [day, month, year] = birthDate.split("/").map(Number)
    const birth = new Date(year, month - 1, day)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }

    return age
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
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={`/placeholder.svg?height=64&width=64&query=${patient.name}`} alt={patient.name} />
              <AvatarFallback className="bg-blue-100 text-blue-700 text-xl font-semibold">
                {getInitials(patient.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{patient.name}</h1>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-gray-600">{patient.cedula}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">{calculateAge(patient.birthDate)} años</span>
                <span className="text-gray-400">•</span>
                {getStatusBadge(patient.status)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/patients/${patient.id}/edit`)}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Calendar className="w-4 h-4 mr-2" />
            Nueva Cita
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información Personal */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-blue-50 border-b border-blue-100">
              <CardTitle className="flex items-center text-lg">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-600">Cédula de Identidad</label>
                  <p className="text-lg font-mono text-gray-900 mt-1">{patient.cedula}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Fecha de Nacimiento</label>
                  <p className="text-lg text-gray-900 mt-1">{patient.birthDate}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Género</label>
                  <p className="text-lg text-gray-900 mt-1">
                    {patient.gender === "male" ? "Masculino" : patient.gender === "female" ? "Femenino" : "Otro"}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Estado</label>
                  <div className="mt-1">{getStatusBadge(patient.status)}</div>
                </div>
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
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <label className="text-sm font-medium text-gray-600">Teléfono</label>
                  <p className="text-lg text-gray-900">{patient.phone}</p>
                </div>
              </div>

              {patient.email && (
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <label className="text-sm font-medium text-gray-600">Correo Electrónico</label>
                    <p className="text-lg text-gray-900">{patient.email}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <label className="text-sm font-medium text-gray-600">Dirección</label>
                  <p className="text-lg text-gray-900">{patient.address}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-gray-400" />
                <div>
                  <label className="text-sm font-medium text-gray-600">Contacto de Emergencia</label>
                  <p className="text-lg text-gray-900">{patient.emergencyContact}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Historia Médica */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-blue-50 border-b border-blue-100">
              <CardTitle className="flex items-center text-lg">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                Historia Médica
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Historia Médica</label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-900 whitespace-pre-wrap">{patient.medicalHistory}</p>
                </div>
              </div>

              <Separator />

              <div>
                <label className="text-sm font-medium text-gray-600">Notas Clínicas</label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-900 whitespace-pre-wrap">{patient.clinicalNotes}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Acciones Rápidas */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-blue-50 border-b border-blue-100">
              <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Calendar className="w-4 h-4 mr-2" />
                Programar Cita
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <FileText className="w-4 h-4 mr-2" />
                Ver Historia Clínica
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Phone className="w-4 h-4 mr-2" />
                Llamar Paciente
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Mail className="w-4 h-4 mr-2" />
                Enviar Email
              </Button>
            </CardContent>
          </Card>

          {/* Consentimientos */}
          {patient.consents && patient.consents.length > 0 && (
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="bg-blue-50 border-b border-blue-100">
                <CardTitle className="flex items-center text-lg">
                  <AlertCircle className="w-5 h-5 mr-2 text-blue-600" />
                  Consentimientos
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {patient.consents.map((consent) => (
                    <div key={consent.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{consent.name}</h4>
                        {getConsentStatusIcon(consent.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Fecha: {consent.date}</p>
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
                      {consent.fileUrl && (
                        <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto text-blue-600">
                          <Download className="w-3 h-3 mr-1" />
                          Descargar
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Información del Sistema */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-blue-50 border-b border-blue-100">
              <CardTitle className="text-lg">Información del Sistema</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Fecha de Registro</label>
                <p className="text-sm text-gray-900 mt-1">{new Date(patient.createdAt).toLocaleDateString("es-VE")}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Última Actualización</label>
                <p className="text-sm text-gray-900 mt-1">{new Date(patient.updatedAt).toLocaleDateString("es-VE")}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
