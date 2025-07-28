export interface Invoice {
  id: string
  patient: string
  patientId: string
  amount: number
  currency: "USD" | "VES"
  status: "pending" | "paid" | "overdue" | "cancelled"
  dueDate: string
  createdAt: string
  paidAt?: string
  description: string
  services: InvoiceService[]
  paymentMethod?: string
  reference?: string
}

export interface InvoiceService {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Payment {
  id: string
  invoiceId: string
  amount: number
  currency: "USD" | "VES"
  method: "pago_movil" | "zelle" | "transferencia" | "efectivo" | "tarjeta"
  reference: string
  date: string
  status: "pending" | "confirmed" | "rejected"
  bank?: string
  phone?: string
  email?: string
}

export interface PaymentFormData {
  invoiceId: string
  amount: number
  currency: "USD" | "VES"
  method: "pago_movil" | "zelle" | "transferencia" | "efectivo" | "tarjeta"
  reference: string
  bank?: string
  phone?: string
  email?: string
}
