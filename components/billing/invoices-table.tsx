"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useInvoices, useUpdateInvoiceStatus } from "@/hooks/use-billing"
import type { Invoice } from "@/types/billing"
import { Search, DollarSign, FileText, Calendar, CreditCard } from "lucide-react"

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  paid: "bg-green-100 text-green-800 border-green-200",
  overdue: "bg-red-100 text-red-800 border-red-200",
  cancelled: "bg-gray-100 text-gray-800 border-gray-200",
}

const statusLabels = {
  pending: "Pendiente",
  paid: "Pagado",
  overdue: "Vencido",
  cancelled: "Cancelado",
}

const currencySymbols = {
  USD: "$",
  VES: "Bs.",
}

export function InvoicesTable() {
  const { data: invoices = [], isLoading, error } = useInvoices()
  const updateInvoiceStatus = useUpdateInvoiceStatus()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currencyFilter, setCurrencyFilter] = useState<string>("all")

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.includes(searchTerm)
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter
    const matchesCurrency = currencyFilter === "all" || invoice.currency === currencyFilter

    return matchesSearch && matchesStatus && matchesCurrency
  })

  const handleStatusChange = (invoiceId: string, newStatus: Invoice["status"]) => {
    updateInvoiceStatus.mutate({ id: invoiceId, status: newStatus })
  }

  const formatAmount = (amount: number, currency: "USD" | "VES") => {
    const symbol = currencySymbols[currency]
    if (currency === "VES") {
      return `${symbol} ${amount.toLocaleString("es-VE")}`
    }
    return `${symbol} ${amount.toFixed(2)}`
  }

  const getTotalByStatus = (status: Invoice["status"]) => {
    return invoices.filter((i) => i.status === status).length
  }

  const getTotalAmount = (currency: "USD" | "VES") => {
    return invoices.filter((i) => i.currency === currency && i.status === "paid").reduce((sum, i) => sum + i.amount, 0)
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
          <div className="text-center text-red-600">Error al cargar las facturas. Por favor, intenta nuevamente.</div>
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
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-600">Total Facturas</p>
                <p className="text-2xl font-bold text-blue-800">{invoices.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-600">Pagadas</p>
                <p className="text-2xl font-bold text-green-800">{getTotalByStatus("paid")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-600">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-800">{getTotalByStatus("pending")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-600">Vencidas</p>
                <p className="text-2xl font-bold text-red-800">{getTotalByStatus("overdue")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Ingresos USD</p>
                <p className="text-2xl font-bold text-blue-800">${getTotalAmount("USD").toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Ingresos VES</p>
                <p className="text-2xl font-bold text-blue-800">Bs. {getTotalAmount("VES").toLocaleString("es-VE")}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Gestión de Facturas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por paciente, descripción o ID..."
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
                <SelectItem value="pending">Pendientes</SelectItem>
                <SelectItem value="paid">Pagadas</SelectItem>
                <SelectItem value="overdue">Vencidas</SelectItem>
                <SelectItem value="cancelled">Canceladas</SelectItem>
              </SelectContent>
            </Select>

            <Select value={currencyFilter} onValueChange={setCurrencyFilter}>
              <SelectTrigger className="w-full md:w-48 bg-white border-blue-200">
                <SelectValue placeholder="Filtrar por moneda" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las monedas</SelectItem>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="VES">VES (Bs.)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-lg border border-blue-200 bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-50">
                  <TableHead className="text-blue-800 font-semibold">ID</TableHead>
                  <TableHead className="text-blue-800 font-semibold">Paciente</TableHead>
                  <TableHead className="text-blue-800 font-semibold">Descripción</TableHead>
                  <TableHead className="text-blue-800 font-semibold">Monto</TableHead>
                  <TableHead className="text-blue-800 font-semibold">Estado</TableHead>
                  <TableHead className="text-blue-800 font-semibold">Vencimiento</TableHead>
                  <TableHead className="text-blue-800 font-semibold">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id} className="hover:bg-blue-50">
                    <TableCell>
                      <span className="font-mono text-sm text-gray-600">#{invoice.id}</span>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-gray-900">{invoice.patient}</div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate text-gray-600">{invoice.description}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-gray-900">
                        {formatAmount(invoice.amount, invoice.currency)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[invoice.status]}>{statusLabels[invoice.status]}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {new Date(invoice.dueDate).toLocaleDateString("es-VE")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={invoice.status}
                        onValueChange={(value) => handleStatusChange(invoice.id, value as Invoice["status"])}
                      >
                        <SelectTrigger className="w-32 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pendiente</SelectItem>
                          <SelectItem value="paid">Pagado</SelectItem>
                          <SelectItem value="overdue">Vencido</SelectItem>
                          <SelectItem value="cancelled">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredInvoices.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No se encontraron facturas que coincidan con los filtros aplicados.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
