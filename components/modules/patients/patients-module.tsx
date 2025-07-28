"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, Filter, MoreHorizontal, Phone, Mail, Calendar, FileText } from "lucide-react"

const patients = [
  {
    id: 1,
    cedula: "V-12345678",
    name: "Ana María Rodríguez",
    age: 28,
    phone: "+58-412-1234567",
    email: "ana.rodriguez@email.com",
    status: "active",
    lastVisit: "2024-01-15",
    nextAppointment: "2024-01-22",
    riskLevel: "medium",
  },
  {
    id: 2,
    cedula: "V-87654321",
    name: "Carlos Eduardo Mendoza",
    age: 35,
    phone: "+58-414-7654321",
    email: "carlos.mendoza@email.com",
    status: "active",
    lastVisit: "2024-01-10",
    nextAppointment: "2024-01-20",
    riskLevel: "low",
  },
  {
    id: 3,
    cedula: "V-11223344",
    name: "María Fernanda García",
    age: 42,
    phone: "+58-416-1122334",
    email: "maria.garcia@email.com",
    status: "inactive",
    lastVisit: "2023-12-20",
    nextAppointment: null,
    riskLevel: "high",
  },
  {
    id: 4,
    cedula: "V-55667788",
    name: "José Antonio López",
    age: 31,
    phone: "+58-424-5566778",
    email: "jose.lopez@email.com",
    status: "active",
    lastVisit: "2024-01-12",
    nextAppointment: "2024-01-25",
    riskLevel: "low",
  },
]

export function PatientsModule() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<any>(null)

  const filteredPatients = patients.filter(
    (patient) => patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || patient.cedula.includes(searchTerm),
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Activo</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactivo</Badge>
      default:
        return <Badge>Desconocido</Badge>
    }
  }

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">Alto Riesgo</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Riesgo Medio</Badge>
      case "low":
        return <Badge className="bg-green-100 text-green-800">Bajo Riesgo</Badge>
      default:
        return <Badge>Sin Evaluar</Badge>
    }
  }

  if (selectedPatient) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => setSelectedPatient(null)}>
              ← Volver
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">{selectedPatient.name}</h1>
              <p className="text-neutral-600">{selectedPatient.cedula}</p>
            </div>
          </div>
          <Button className="bg-primary-500 hover:bg-primary-600">
            <Calendar size={16} className="mr-2" />
            Nueva Cita
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Información del Paciente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-neutral-600">Edad</label>
                  <p className="text-lg font-semibold">{selectedPatient.age} años</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-600">Estado</label>
                  <div className="mt-1">{getStatusBadge(selectedPatient.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-600">Teléfono</label>
                  <p className="text-lg">{selectedPatient.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-600">Email</label>
                  <p className="text-lg">{selectedPatient.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-600">Última Visita</label>
                  <p className="text-lg">{selectedPatient.lastVisit}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-600">Nivel de Riesgo</label>
                  <div className="mt-1">{getRiskBadge(selectedPatient.riskLevel)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Calendar className="mr-2" size={16} />
                Programar Cita
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <FileText className="mr-2" size={16} />
                Ver Historia Clínica
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Phone className="mr-2" size={16} />
                Llamar Paciente
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Mail className="mr-2" size={16} />
                Enviar Email
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Gestión de Pacientes</h1>
          <p className="text-neutral-600 mt-1">
            Administra la información de tus pacientes de manera segura y eficiente.
          </p>
        </div>
        <Button className="bg-primary-500 hover:bg-primary-600">
          <Plus size={16} className="mr-2" />
          Nuevo Paciente
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
              <Input
                placeholder="Buscar por nombre o cédula..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter size={16} className="mr-2" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Patients List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="card-hover cursor-pointer" onClick={() => setSelectedPatient(patient)}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={`/placeholder.svg?height=40&width=40&query=${patient.name}`} />
                    <AvatarFallback>
                      {patient.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-neutral-900">{patient.name}</h3>
                    <p className="text-sm text-neutral-600">{patient.cedula}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal size={16} />
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Estado:</span>
                  {getStatusBadge(patient.status)}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Riesgo:</span>
                  {getRiskBadge(patient.riskLevel)}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Edad:</span>
                  <span className="text-sm font-medium">{patient.age} años</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Última visita:</span>
                  <span className="text-sm font-medium">{patient.lastVisit}</span>
                </div>

                {patient.nextAppointment && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-600">Próxima cita:</span>
                    <span className="text-sm font-medium text-primary-600">{patient.nextAppointment}</span>
                  </div>
                )}
              </div>

              <div className="flex space-x-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Phone size={14} className="mr-1" />
                  Llamar
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Mail size={14} className="mr-1" />
                  Email
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
