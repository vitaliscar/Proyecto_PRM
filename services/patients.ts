import axios from "axios"
import type { Patient, CreatePatientData } from "@/types/patient"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Datos simulados para desarrollo
const mockPatients: Patient[] = [
  {
    id: "1",
    cedula: "V-12345678",
    name: "Juan Carlos Pérez",
    birthDate: "15/03/1985",
    gender: "male",
    phone: "+58-412-1234567",
    email: "juan.perez@email.com",
    address: "Av. Libertador, Caracas, Miranda",
    emergencyContact: "María Pérez - +58-414-7654321",
    medicalHistory: "Historial de ansiedad generalizada. Tratamiento previo con terapia cognitivo-conductual.",
    clinicalNotes: "Paciente colaborativo, muestra progreso en técnicas de relajación.",
    consents: [
      {
        id: "1",
        name: "Consentimiento Informado",
        status: "approved",
        date: "10/01/2024",
        fileUrl: "/documents/consent-1.pdf",
      },
    ],
    status: "active",
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-20T15:30:00Z",
  },
  {
    id: "2",
    cedula: "V-98765432",
    name: "María Elena Gómez",
    birthDate: "22/07/1992",
    gender: "female",
    phone: "+58-416-9876543",
    email: "maria.gomez@email.com",
    address: "Calle Real, Valencia, Carabobo",
    emergencyContact: "Carlos Gómez - +58-424-1234567",
    medicalHistory: "Episodios depresivos recurrentes. Medicación actual: Sertralina 50mg.",
    clinicalNotes: "Responde bien al tratamiento combinado. Requiere seguimiento mensual.",
    consents: [
      {
        id: "2",
        name: "Consentimiento Informado",
        status: "pending",
        date: "18/01/2024",
      },
    ],
    status: "inactive",
    createdAt: "2024-01-18T14:00:00Z",
    updatedAt: "2024-01-18T14:00:00Z",
  },
  {
    id: "3",
    cedula: "V-11223344",
    name: "Ana Sofía Rodríguez",
    birthDate: "08/11/1988",
    gender: "female",
    phone: "+58-414-1122334",
    email: "ana.rodriguez@email.com",
    address: "Urbanización Los Palos Grandes, Caracas",
    emergencyContact: "Luis Rodríguez - +58-412-9988776",
    medicalHistory: "Trastorno de pánico con agorafobia. Sin medicación actual.",
    clinicalNotes: "Progreso significativo en exposición gradual. Continuar con técnicas de mindfulness.",
    consents: [
      {
        id: "3",
        name: "Consentimiento Informado",
        status: "approved",
        date: "05/01/2024",
      },
    ],
    status: "active",
    createdAt: "2024-01-05T09:00:00Z",
    updatedAt: "2024-01-22T11:15:00Z",
  },
]

export const patientsService = {
  // Obtener todos los pacientes
  getPatients: async (): Promise<Patient[]> => {
    try {
      const response = await api.get("/api/v1/patients/")
      return response.data
    } catch (error) {
      console.log("Using mock data for patients")
      return mockPatients
    }
  },

  // Obtener paciente por ID
  getPatient: async (id: string): Promise<Patient | null> => {
    try {
      const response = await api.get(`/api/v1/patients/${id}/`)
      return response.data
    } catch (error) {
      console.log("Using mock data for patient")
      return mockPatients.find((p) => p.id === id) || null
    }
  },

  // Crear nuevo paciente
  createPatient: async (data: CreatePatientData): Promise<Patient> => {
    try {
      const response = await api.post("/api/v1/patients/", data)
      return response.data
    } catch (error) {
      console.log("Simulating patient creation")
      const newPatient: Patient = {
        id: Date.now().toString(),
        ...data,
        consents: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      return newPatient
    }
  },

  // Actualizar paciente
  updatePatient: async (id: string, data: Partial<CreatePatientData>): Promise<Patient> => {
    try {
      const response = await api.patch(`/api/v1/patients/${id}/`, data)
      return response.data
    } catch (error) {
      console.log("Simulating patient update")
      const existingPatient = mockPatients.find((p) => p.id === id)
      if (!existingPatient) throw new Error("Patient not found")

      return {
        ...existingPatient,
        ...data,
        updatedAt: new Date().toISOString(),
      }
    }
  },

  // Eliminar paciente
  deletePatient: async (id: string): Promise<void> => {
    try {
      await api.delete(`/api/v1/patients/${id}/`)
    } catch (error) {
      console.log("Simulating patient deletion")
    }
  },
}
