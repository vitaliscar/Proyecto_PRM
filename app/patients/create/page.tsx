"use client"

import { PatientForm } from "@/components/patients/patient-form"

export default function CreatePatientPage() {
  return (
    <div className="container mx-auto py-6 px-4">
      <PatientForm mode="create" />
    </div>
  )
}
