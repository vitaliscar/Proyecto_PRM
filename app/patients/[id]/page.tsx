"use client"

import { PatientDetails } from "@/components/patients/patient-details"

interface PatientDetailsPageProps {
  params: {
    id: string
  }
}

export default function PatientDetailsPage({ params }: PatientDetailsPageProps) {
  return (
    <div className="container mx-auto py-6 px-4">
      <PatientDetails patientId={params.id} />
    </div>
  )
}
