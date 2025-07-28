"use client"

import { PaymentForm } from "@/components/billing/payment-form"

export default function PaymentsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Registro de Pagos</h1>
          <p className="text-gray-600 mt-2">Registra pagos móviles, Zelle y otros métodos de pago</p>
        </div>

        <PaymentForm />
      </div>
    </div>
  )
}
