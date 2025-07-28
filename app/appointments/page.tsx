"use client"

import { useState } from "react"
import { CalendarView } from "@/components/appointments/calendar-view"
import { AppointmentsList } from "@/components/appointments/appointments-list"
import { Button } from "@/components/ui/button"
import { Calendar, List } from "lucide-react"

export default function AppointmentsPage() {
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar")

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      {/* Toggle View */}
      <div className="flex justify-center">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <Button
            variant={viewMode === "calendar" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("calendar")}
            className={viewMode === "calendar" ? "bg-blue-600 text-white" : "text-gray-600"}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Calendario
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "bg-blue-600 text-white" : "text-gray-600"}
          >
            <List className="w-4 h-4 mr-2" />
            Lista
          </Button>
        </div>
      </div>

      {/* Content */}
      {viewMode === "calendar" ? <CalendarView /> : <AppointmentsList />}
    </div>
  )
}
