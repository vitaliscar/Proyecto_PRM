import type { Invoice, Payment, PaymentFormData } from "@/types/billing"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// Mock data
const mockInvoices: Invoice[] = [
  {
    id: "1",
    patient: "Juan Pérez",
    patientId: "1",
    amount: 50,
    currency: "USD",
    status: "pending",
    dueDate: "2025-02-15T00:00:00Z",
    createdAt: "2025-01-27T10:00:00Z",
    description: "Consulta psicológica individual",
    services: [
      {
        id: "s1",
        description: "Consulta psicológica individual",
        quantity: 1,
        unitPrice: 50,
        total: 50,
      },
    ],
  },
  {
    id: "2",
    patient: "María González",
    patientId: "2",
    amount: 1500000,
    currency: "VES",
    status: "paid",
    dueDate: "2025-01-30T00:00:00Z",
    createdAt: "2025-01-25T14:30:00Z",
    paidAt: "2025-01-26T09:15:00Z",
    description: "Terapia de pareja - 2 sesiones",
    services: [
      {
        id: "s2",
        description: "Terapia de pareja",
        quantity: 2,
        unitPrice: 750000,
        total: 1500000,
      },
    ],
    paymentMethod: "pago_movil",
    reference: "PM123456789",
  },
  {
    id: "3",
    patient: "Carlos Mendoza",
    patientId: "3",
    amount: 75,
    currency: "USD",
    status: "overdue",
    dueDate: "2025-01-20T00:00:00Z",
    createdAt: "2025-01-15T16:45:00Z",
    description: "Evaluación psicológica completa",
    services: [
      {
        id: "s3",
        description: "Evaluación psicológica completa",
        quantity: 1,
        unitPrice: 75,
        total: 75,
      },
    ],
  },
  {
    id: "4",
    patient: "Ana Rodríguez",
    patientId: "4",
    amount: 40,
    currency: "USD",
    status: "paid",
    dueDate: "2025-02-01T00:00:00Z",
    createdAt: "2025-01-22T11:20:00Z",
    paidAt: "2025-01-23T15:30:00Z",
    description: "Consulta de seguimiento",
    services: [
      {
        id: "s4",
        description: "Consulta de seguimiento",
        quantity: 1,
        unitPrice: 40,
        total: 40,
      },
    ],
    paymentMethod: "zelle",
    reference: "ZE987654321",
  },
]

const mockPayments: Payment[] = [
  {
    id: "1",
    invoiceId: "2",
    amount: 1500000,
    currency: "VES",
    method: "pago_movil",
    reference: "PM123456789",
    date: "2025-01-26T09:15:00Z",
    status: "confirmed",
    bank: "Banesco",
    phone: "+584121234567",
  },
  {
    id: "2",
    invoiceId: "4",
    amount: 40,
    currency: "USD",
    method: "zelle",
    reference: "ZE987654321",
    date: "2025-01-23T15:30:00Z",
    status: "confirmed",
    email: "ana.rodriguez@email.com",
  },
]

export const billingService = {
  async getInvoices(): Promise<Invoice[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/billing/invoices/`)
      if (!response.ok) throw new Error("Failed to fetch invoices")
      return await response.json()
    } catch (error) {
      console.warn("Using mock data for invoices:", error)
      return mockInvoices
    }
  },

  async getPayments(): Promise<Payment[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/billing/payments/`)
      if (!response.ok) throw new Error("Failed to fetch payments")
      return await response.json()
    } catch (error) {
      console.warn("Using mock data for payments:", error)
      return mockPayments
    }
  },

  async createPayment(data: PaymentFormData): Promise<Payment> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/billing/payments/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error("Failed to create payment")
      return await response.json()
    } catch (error) {
      console.warn("Using mock data for payment creation:", error)
      const newPayment: Payment = {
        id: Date.now().toString(),
        ...data,
        date: new Date().toISOString(),
        status: "pending",
      }
      return newPayment
    }
  },

  async updateInvoiceStatus(id: string, status: Invoice["status"]): Promise<Invoice> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/billing/invoices/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })
      if (!response.ok) throw new Error("Failed to update invoice")
      return await response.json()
    } catch (error) {
      console.warn("Using mock data for invoice update:", error)
      const invoice = mockInvoices.find((i) => i.id === id)
      if (invoice) {
        return { ...invoice, status }
      }
      throw error
    }
  },
}
