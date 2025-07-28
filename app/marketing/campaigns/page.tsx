"use client"

import { CampaignForm } from "@/components/marketing/campaign-form"

export default function CampaignsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Campañas de Marketing</h1>
          <p className="text-gray-600 mt-2">Crea y gestiona campañas de email, SMS y WhatsApp</p>
        </div>

        <CampaignForm />
      </div>
    </div>
  )
}
