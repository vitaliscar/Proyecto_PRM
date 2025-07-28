"use client"

import { InvoicesTable } from "@/components/billing/invoices-table"

export default function InvoicesPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Facturas</h1>
          <p className="text-gray-600 mt-2">Administra facturas, pagos y estados de cuenta</p>
        </div>

        <InvoicesTable />
      </div>
    </div>
  )
}
