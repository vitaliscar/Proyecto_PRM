export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  status: "new" | "contacted" | "qualified" | "converted" | "lost"
  source: string
  createdAt: string
  lastContact?: string
  notes?: string
  score: number
}

export interface Campaign {
  id: string
  name: string
  type: "email" | "sms" | "whatsapp"
  status: "draft" | "active" | "paused" | "completed"
  subject: string
  content: string
  targetAudience: string[]
  scheduledDate?: string
  sentCount: number
  openRate: number
  clickRate: number
  createdAt: string
}

export interface CampaignFormData {
  name: string
  type: "email" | "sms" | "whatsapp"
  subject: string
  content: string
  targetAudience: string[]
  scheduledDate?: string
}
