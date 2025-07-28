"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, Plus, Eye, Edit, MoreHorizontal, Phone, Mail } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { usePatients } from "@/hooks/use-patients"
import type { Patient } from "@/types/patient"

interface PatientsTableProps {
  onPatientSelect?: (patient: Patient) => void
}

export function PatientsTable({ onPatientSelect }: PatientsTableProps) {
  const router = useRouter()
  const { data: patients = [], isLoading, error } = usePatients()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.cedula.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || patient.status === statusFilter

    return matchesSearch && matchesStatus
  })

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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleViewPatient = (id: string) => {
    router.push(`/patients/${id}`)
  }

  const handleEditPatient = (id: string) => {
    router.push(`/patients/${id}/edit`)
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
          <div className="text-center text-red-600">Error al cargar los pacientes. Por favor, intenta nuevamente.</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white border-gray-200 shadow-sm">
      <CardHeader className="bg-blue-50 border-b border-blue-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900">Gestión de Pacientes</CardTitle>
            <CardDescription className="text-gray-600">
              Administra la información de tus pacientes de manera segura
            </CardDescription>
          </div>
          <Button onClick={() => router.push("/patients/create")} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Paciente
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por nombre o cédula..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 border-gray-300">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="inactive">Inactivos</SelectItem>
              <SelectItem value="waiting">En Espera</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabla */}
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-semibold text-gray-900">Paciente</TableHead>
                <TableHead className="font-semibold text-gray-900">Cédula</TableHead>
                <TableHead className="font-semibold text-gray-900">Contacto</TableHead>
                <TableHead className="font-semibold text-gray-900">Estado</TableHead>
                <TableHead className="font-semibold text-gray-900 text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    {searchTerm || statusFilter !== "all"
                      ? "No se encontraron pacientes con los filtros aplicados"
                      : "No hay pacientes registrados"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredPatients.map((patient) => (
                  <TableRow
                    key={patient.id}
                    className="hover:bg-blue-50 transition-colors cursor-pointer"
                    onClick={() => onPatientSelect?.(patient)}
                  >
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage
                            src={`/placeholder.svg?height=40&width=40&query=${patient.name}`}
                            alt={patient.name}
                          />
                          <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">
                            {getInitials(patient.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">{patient.name}</div>
                          <div className="text-sm text-gray-500">
                            {new Date().getFullYear() -
                              new Date(patient.birthDate.split("/").reverse().join("-")).getFullYear()}{" "}
                            años
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="font-mono text-sm">{patient.cedula}</TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-3 h-3 mr-1" />
                          {patient.phone}
                        </div>
                        {patient.email && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="w-3 h-3 mr-1" />
                            {patient.email}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>{getStatusBadge(patient.status)}</TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleViewPatient(patient.id)
                          }}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => e.stopPropagation()}
                              className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewPatient(patient.id)}>
                              <Eye className="w-4 h-4 mr-2" />
                              Ver detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditPatient(patient.id)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Información de resultados */}
        {filteredPatients.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            Mostrando {filteredPatients.length} de {patients.length} pacientes
          </div>
        )}
      </CardContent>
    </Card>
  )
}
