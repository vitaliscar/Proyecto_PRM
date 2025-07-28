"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Users, Calendar, TrendingUp, AlertTriangle, Clock, CheckCircle, Plus, ClipboardList } from "lucide-react"

const stats = [
  {
    title: "Pacientes Activos",
    value: "247",
    change: "+12%",
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "Citas Hoy",
    value: "18",
    change: "+3",
    icon: Calendar,
    color: "text-green-600",
  },
  {
    title: "Evaluaciones Pendientes",
    value: "8",
    change: "-2",
    icon: AlertTriangle,
    color: "text-orange-600",
  },
  {
    title: "Tasa de Asistencia",
    value: "94%",
    change: "+2%",
    icon: TrendingUp,
    color: "text-purple-600",
  },
]

const recentAppointments = [
  {
    id: 1,
    patient: "Ana Rodríguez",
    time: "09:00",
    type: "Consulta Individual",
    status: "confirmed",
  },
  {
    id: 2,
    patient: "Carlos Mendoza",
    time: "10:30",
    type: "Evaluación PHQ-9",
    status: "pending",
  },
  {
    id: 3,
    patient: "María Fernández",
    time: "14:00",
    type: "Teleterapia",
    status: "confirmed",
  },
  {
    id: 4,
    patient: "José García",
    time: "15:30",
    type: "Seguimiento",
    status: "completed",
  },
]

const alerts = [
  {
    id: 1,
    type: "high-risk",
    message: "Paciente Ana Rodríguez presenta puntaje alto en GAD-7",
    time: "Hace 2 horas",
  },
  {
    id: 2,
    type: "appointment",
    message: "Recordatorio: Cita con Carlos Mendoza en 30 minutos",
    time: "Hace 5 minutos",
  },
  {
    id: 3,
    type: "system",
    message: "Backup automático completado exitosamente",
    time: "Hace 1 hora",
  },
]

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Panel Principal</h1>
          <p className="text-neutral-600 mt-1">Bienvenida, Dr. María González. Aquí tienes un resumen de tu día.</p>
        </div>
        <Button className="bg-primary-500 hover:bg-primary-600">
          <Plus size={16} className="mr-2" />
          Nueva Cita
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-neutral-900 mt-1">{stat.value}</p>
                    <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-neutral-100 ${stat.color}`}>
                    <Icon size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Appointments */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2" size={20} />
              Citas de Hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm font-medium text-neutral-900">{appointment.time}</div>
                    <div>
                      <p className="font-medium text-neutral-900">{appointment.patient}</p>
                      <p className="text-sm text-neutral-600">{appointment.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {appointment.status === "confirmed" && <CheckCircle className="text-green-600" size={16} />}
                    {appointment.status === "pending" && <Clock className="text-orange-600" size={16} />}
                    {appointment.status === "completed" && <CheckCircle className="text-blue-600" size={16} />}
                    <Button variant="outline" size="sm">
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts & Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2" size={20} />
              Alertas y Notificaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="p-3 bg-neutral-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        alert.type === "high-risk"
                          ? "bg-red-500"
                          : alert.type === "appointment"
                            ? "bg-orange-500"
                            : "bg-blue-500"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm text-neutral-900">{alert.message}</p>
                      <p className="text-xs text-neutral-500 mt-1">{alert.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Progreso Mensual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Citas Completadas</span>
                <span>156/180</span>
              </div>
              <Progress value={87} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Evaluaciones Realizadas</span>
                <span>42/50</span>
              </div>
              <Progress value={84} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Satisfacción del Paciente</span>
                <span>4.8/5.0</span>
              </div>
              <Progress value={96} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Users className="mr-2" size={16} />
              Registrar Nuevo Paciente
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Calendar className="mr-2" size={16} />
              Programar Cita
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <ClipboardList className="mr-2" size={16} />
              Crear Evaluación
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <TrendingUp className="mr-2" size={16} />
              Ver Reportes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
