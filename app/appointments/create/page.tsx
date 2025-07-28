"use client"

import { AppointmentForm } from "@/components/appointments/appointment-form"

export default function CreateAppointmentPage() {
  return (
    <div className="container mx-auto py-6 px-4">
      <AppointmentForm mode="create" />
    </div>
  )
}
