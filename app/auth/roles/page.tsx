"use client"

import { RolesTable } from "@/components/auth/roles-table"

export default function RolesPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <RolesTable />
      </div>
    </div>
  )
}
