export interface Patient {
  id: string
  cedula: string
  name: string
  birthDate: string
  gender: "male" | "female" | "other"
  phone: string
  email?: string
  address: string
  emergencyContact: string
  medicalHistory: string
  clinicalNotes: string
  consents: Consent[]
  status: "active" | "inactive" | "waiting"
  createdAt: string
  updatedAt: string
}

export interface Consent {
  id: string
  name: string
  status: "pending" | "approved" | "rejected"
  date: string
  fileUrl?: string
}

export interface CreatePatientData {
  cedula: string
  name: string
  birthDate: string
  gender: "male" | "female" | "other"
  phone: string
  email?: string
  address: string
  emergencyContact: string
  medicalHistory: string
  clinicalNotes: string
  status: "active" | "inactive" | "waiting"
}
