"use client"

import { AppointmentDetails } from "@/components/appointments/appointment-details"

interface AppointmentDetailsPageProps {
  params: {
    id: string
  }
}

export default function AppointmentDetailsPage({ params }: AppointmentDetailsPageProps) {
  return (
    <div className="container mx-auto py-6 px-4">
      <AppointmentDetails appointmentId={params.id} />
    </div>
  )
}
