import type { Lead, Campaign, CampaignFormData } from "@/types/marketing"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// Mock data
const mockLeads: Lead[] = [
  {
    id: "1",
    name: "Ana López",
    email: "ana.lopez@email.com",
    phone: "+584121234567",
    status: "new",
    source: "Website",
    createdAt: "2025-01-27T10:00:00Z",
    score: 85,
    notes: "Interesada en terapia de ansiedad",
  },
  {
    id: "2",
    name: "Carlos Mendoza",
    email: "carlos.mendoza@email.com",
    phone: "+584141234567",
    status: "contacted",
    source: "Referido",
    createdAt: "2025-01-26T14:30:00Z",
    lastContact: "2025-01-27T09:00:00Z",
    score: 92,
    notes: "Busca terapia de pareja",
  },
  {
    id: "3",
    name: "María Rodríguez",
    email: "maria.rodriguez@email.com",
    phone: "+584161234567",
    status: "qualified",
    source: "Redes Sociales",
    createdAt: "2025-01-25T16:45:00Z",
    lastContact: "2025-01-26T11:30:00Z",
    score: 78,
    notes: "Interesada en terapia familiar",
  },
  {
    id: "4",
    name: "José García",
    email: "jose.garcia@email.com",
    phone: "+584121234568",
    status: "converted",
    source: "Google Ads",
    createdAt: "2025-01-24T08:15:00Z",
    lastContact: "2025-01-25T10:00:00Z",
    score: 95,
    notes: "Ya programó primera cita",
  },
]

const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Campaña de Bienvenida",
    type: "email",
    status: "active",
    subject: "Bienvenido a CRECES",
    content: "Gracias por tu interés en nuestros servicios...",
    targetAudience: ["new", "contacted"],
    sentCount: 150,
    openRate: 65,
    clickRate: 12,
    createdAt: "2025-01-20T10:00:00Z",
  },
  {
    id: "2",
    name: "Recordatorio de Cita",
    type: "sms",
    status: "active",
    subject: "",
    content: "Recordatorio: Tienes una cita mañana a las {time}",
    targetAudience: ["qualified", "converted"],
    sentCount: 45,
    openRate: 98,
    clickRate: 8,
    createdAt: "2025-01-22T15:30:00Z",
  },
]

export const marketingService = {
  async getLeads(): Promise<Lead[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/marketing/leads/`)
      if (!response.ok) throw new Error("Failed to fetch leads")
      return await response.json()
    } catch (error) {
      console.warn("Using mock data for leads:", error)
      return mockLeads
    }
  },

  async getCampaigns(): Promise<Campaign[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/marketing/campaigns/`)
      if (!response.ok) throw new Error("Failed to fetch campaigns")
      return await response.json()
    } catch (error) {
      console.warn("Using mock data for campaigns:", error)
      return mockCampaigns
    }
  },

  async createCampaign(data: CampaignFormData): Promise<Campaign> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/marketing/campaigns/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error("Failed to create campaign")
      return await response.json()
    } catch (error) {
      console.warn("Using mock data for campaign creation:", error)
      const newCampaign: Campaign = {
        id: Date.now().toString(),
        ...data,
        status: "draft",
        sentCount: 0,
        openRate: 0,
        clickRate: 0,
        createdAt: new Date().toISOString(),
      }
      return newCampaign
    }
  },

  async updateLeadStatus(id: string, status: Lead["status"]): Promise<Lead> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/marketing/leads/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })
      if (!response.ok) throw new Error("Failed to update lead")
      return await response.json()
    } catch (error) {
      console.warn("Using mock data for lead update:", error)
      const lead = mockLeads.find((l) => l.id === id)
      if (lead) {
        return { ...lead, status }
      }
      throw error
    }
  },
}
