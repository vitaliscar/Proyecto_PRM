"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useLeads, useUpdateLeadStatus } from "@/hooks/use-marketing"
import type { Lead } from "@/types/marketing"
import { Search, Phone, Mail, User, TrendingUp } from "lucide-react"

const statusColors = {
  new: "bg-blue-100 text-blue-800 border-blue-200",
  contacted: "bg-yellow-100 text-yellow-800 border-yellow-200",
  qualified: "bg-purple-100 text-purple-800 border-purple-200",
  converted: "bg-green-100 text-green-800 border-green-200",
  lost: "bg-red-100 text-red-800 border-red-200",
}

const statusLabels = {
  new: "Nuevo",
  contacted: "Contactado",
  qualified: "Calificado",
  converted: "Convertido",
  lost: "Perdido",
}

export function LeadsTable() {
  const { data: leads = [], isLoading, error } = useLeads()
  const updateLeadStatus = useUpdateLeadStatus()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sourceFilter, setSourceFilter] = useState<string>("all")

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm)
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter
    const matchesSource = sourceFilter === "all" || lead.source === sourceFilter

    return matchesSearch && matchesStatus && matchesSource
  })

  const handleStatusChange = (leadId: string, newStatus: Lead["status"]) => {
    updateLeadStatus.mutate({ id: leadId, status: newStatus })
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
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
      <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
        <CardContent className="p-6">
          <div className="text-center text-red-600">Error al cargar los leads. Por favor, intenta nuevamente.</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-600">Total Leads</p>
                <p className="text-2xl font-bold text-blue-800">{leads.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-600">Convertidos</p>
                <p className="text-2xl font-bold text-green-800">
                  {leads.filter((l) => l.status === "converted").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-600">Contactados</p>
                <p className="text-2xl font-bold text-yellow-800">
                  {leads.filter((l) => l.status === "contacted").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-purple-600">Calificados</p>
                <p className="text-2xl font-bold text-purple-800">
                  {leads.filter((l) => l.status === "qualified").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Gestión de Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nombre, email o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-blue-200 focus:border-blue-400"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 bg-white border-blue-200">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="new">Nuevos</SelectItem>
                <SelectItem value="contacted">Contactados</SelectItem>
                <SelectItem value="qualified">Calificados</SelectItem>
                <SelectItem value="converted">Convertidos</SelectItem>
                <SelectItem value="lost">Perdidos</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-full md:w-48 bg-white border-blue-200">
                <SelectValue placeholder="Filtrar por fuente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las fuentes</SelectItem>
                <SelectItem value="Website">Website</SelectItem>
                <SelectItem value="Referido">Referido</SelectItem>
                <SelectItem value="Redes Sociales">Redes Sociales</SelectItem>
                <SelectItem value="Google Ads">Google Ads</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-lg border border-blue-200 bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-50">
                  <TableHead className="text-blue-800 font-semibold">Nombre</TableHead>
                  <TableHead className="text-blue-800 font-semibold">Contacto</TableHead>
                  <TableHead className="text-blue-800 font-semibold">Estado</TableHead>
                  <TableHead className="text-blue-800 font-semibold">Fuente</TableHead>
                  <TableHead className="text-blue-800 font-semibold">Score</TableHead>
                  <TableHead className="text-blue-800 font-semibold">Último Contacto</TableHead>
                  <TableHead className="text-blue-800 font-semibold">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id} className="hover:bg-blue-50">
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{lead.name}</div>
                        {lead.notes && <div className="text-sm text-gray-500 truncate max-w-xs">{lead.notes}</div>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-3 w-3 mr-1" />
                          {lead.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-3 w-3 mr-1" />
                          {lead.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[lead.status]}>{statusLabels[lead.status]}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">{lead.source}</span>
                    </TableCell>
                    <TableCell>
                      <span className={`font-semibold ${getScoreColor(lead.score)}`}>{lead.score}%</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {lead.lastContact ? new Date(lead.lastContact).toLocaleDateString("es-VE") : "Sin contacto"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={lead.status}
                        onValueChange={(value) => handleStatusChange(lead.id, value as Lead["status"])}
                      >
                        <SelectTrigger className="w-32 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">Nuevo</SelectItem>
                          <SelectItem value="contacted">Contactado</SelectItem>
                          <SelectItem value="qualified">Calificado</SelectItem>
                          <SelectItem value="converted">Convertido</SelectItem>
                          <SelectItem value="lost">Perdido</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredLeads.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No se encontraron leads que coincidan con los filtros aplicados.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
