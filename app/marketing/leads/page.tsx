"use client"

import { LeadsTable } from "@/components/marketing/leads-table"

export default function LeadsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Leads</h1>
          <p className="text-gray-600 mt-2">Administra y da seguimiento a todos los leads potenciales</p>
        </div>

        <LeadsTable />
      </div>
    </div>
  )
}
