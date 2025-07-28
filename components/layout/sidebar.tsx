"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Users,
  Calendar,
  ClipboardList,
  LayoutDashboard,
  MessageSquare,
  FileText,
  TrendingUp,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface SidebarProps {
  activeModule: string
  setActiveModule: (module: string) => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const menuItems = [
  { id: "dashboard", label: "Panel Principal", icon: LayoutDashboard },
  { id: "patients", label: "Pacientes", icon: Users },
  { id: "appointments", label: "Citas", icon: Calendar },
  { id: "assessments", label: "Evaluaciones", icon: ClipboardList },
  { id: "agenda", label: "Agenda Inteligente", icon: TrendingUp },
  { id: "communication", label: "Comunicación", icon: MessageSquare },
  { id: "records", label: "Historias Clínicas", icon: FileText },
]

export function Sidebar({ activeModule, setActiveModule, isOpen, setIsOpen }: SidebarProps) {
  return (
    <div
      className={cn(
        "sidebar-gradient text-white transition-all duration-300 ease-in-out flex flex-col",
        isOpen ? "w-64" : "w-16",
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          {isOpen && (
            <div>
              <h1 className="text-lg font-bold">Proyecto Creces</h1>
              <p className="text-sm text-white/70">& Asociados</p>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="text-white hover:bg-white/10">
            {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "w-full justify-start text-white hover:bg-white/10 transition-colors",
                activeModule === item.id && "bg-white/20",
                !isOpen && "px-2",
              )}
              onClick={() => setActiveModule(item.id)}
            >
              <Icon size={20} />
              {isOpen && <span className="ml-3">{item.label}</span>}
            </Button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <Button variant="ghost" className={cn("w-full justify-start text-white hover:bg-white/10", !isOpen && "px-2")}>
          <Settings size={20} />
          {isOpen && <span className="ml-3">Configuración</span>}
        </Button>
        <Button variant="ghost" className={cn("w-full justify-start text-white hover:bg-white/10", !isOpen && "px-2")}>
          <LogOut size={20} />
          {isOpen && <span className="ml-3">Cerrar Sesión</span>}
        </Button>
      </div>
    </div>
  )
}
