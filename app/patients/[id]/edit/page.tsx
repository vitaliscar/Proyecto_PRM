"use client"

import { PatientForm } from "@/components/patients/patient-form"
import { usePatient } from "@/hooks/use-patients"

interface EditPatientPageProps {
  params: {
    id: string
  }
}

export default function EditPatientPage({ params }: EditPatientPageProps) {
  const { data: patient, isLoading } = usePatient(params.id)

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="text-center text-red-600">Paciente no encontrado</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <PatientForm patient={patient} mode="edit" />
    </div>
  )
}
