"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Dashboard } from "@/components/dashboard/dashboard"
import { PatientsModule } from "@/components/modules/patients/patients-module"
import { AppointmentsModule } from "@/components/modules/appointments/appointments-module"
import { AssessmentsModule } from "@/components/modules/assessments/assessments-module"
import { AgendaModule } from "@/components/modules/agenda/agenda-module"
import { CommunicationModule } from "@/components/modules/communication/communication-module"

export default function Home() {
  const [activeModule, setActiveModule] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const renderModule = () => {
    switch (activeModule) {
      case "dashboard":
        return <Dashboard />
      case "patients":
        return <PatientsModule />
      case "appointments":
        return <AppointmentsModule />
      case "assessments":
        return <AssessmentsModule />
      case "agenda":
        return <AgendaModule />
      case "communication":
        return <CommunicationModule />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-neutral-100">
      <Sidebar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-neutral-50 p-6">{renderModule()}</main>
      </div>
    </div>
  )
}
