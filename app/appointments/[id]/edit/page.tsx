"use client"

import { AppointmentForm } from "@/components/appointments/appointment-form"
import { useAppointment } from "@/hooks/use-appointments"

interface EditAppointmentPageProps {
  params: {
    id: string
  }
}

export default function EditAppointmentPage({ params }: EditAppointmentPageProps) {
  const { data: appointment, isLoading } = useAppointment(params.id)

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (!appointment) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="text-center text-red-600">Cita no encontrada</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <AppointmentForm appointment={appointment} mode="edit" />
    </div>
  )
}
