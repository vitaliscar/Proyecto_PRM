"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Users, Settings, CheckCircle, AlertCircle } from "lucide-react"
import type { AgendaRoom } from "@/types/agenda"

interface RoomsCardProps {
  rooms: AgendaRoom[]
}

export function RoomsCard({ rooms }: RoomsCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <CheckCircle size={16} className="text-green-600" />
      case "occupied":
        return <Users size={16} className="text-blue-600" />
      case "maintenance":
        return <Settings size={16} className="text-orange-600" />
      case "reserved":
        return <Clock size={16} className="text-purple-600" />
      default:
        return <AlertCircle size={16} className="text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-100 text-green-800">Disponible</Badge>
      case "occupied":
        return <Badge className="bg-blue-100 text-blue-800">Ocupada</Badge>
      case "maintenance":
        return <Badge className="bg-orange-100 text-orange-800">Mantenimiento</Badge>
      case "reserved":
        return <Badge className="bg-purple-100 text-purple-800">Reservada</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Desconocido</Badge>
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "border-l-green-500"
      case "occupied":
        return "border-l-blue-500"
      case "maintenance":
        return "border-l-orange-500"
      case "reserved":
        return "border-l-purple-500"
      default:
        return "border-l-gray-300"
    }
  }

  const availableRooms = rooms.filter((room) => room.status === "available").length
  const occupiedRooms = rooms.filter((room) => room.status === "occupied").length

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <CardTitle className="flex items-center justify-between text-gray-900">
          <div className="flex items-center">
            <MapPin className="mr-2" size={20} />
            Estado de Salas
          </div>
          <div className="text-sm font-normal">
            <span className="text-green-600 font-medium">{availableRooms} disponibles</span>
            <span className="text-gray-400 mx-2">•</span>
            <span className="text-blue-600 font-medium">{occupiedRooms} ocupadas</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100">
          {rooms.map((room) => (
            <div
              key={room.id}
              className={`p-4 border-l-4 ${getStatusColor(room.status)} hover:bg-gray-50 transition-colors`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(room.status)}
                    <h3 className="font-semibold text-gray-900">{room.name}</h3>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Users size={14} />
                      <span>Cap. {room.capacity}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock size={14} />
                      <span>Disponible: {room.nextAvailable}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {getStatusBadge(room.status)}
                  <Button variant="outline" size="sm">
                    Detalles
                  </Button>
                </div>
              </div>

              {room.currentAppointment && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-900">Cita Actual</p>
                      <p className="text-sm text-blue-700">{room.currentAppointment.patient}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-blue-600">Termina a las</p>
                      <p className="text-sm font-medium text-blue-900">{room.currentAppointment.endTime}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-1">Equipamiento:</p>
                <div className="flex flex-wrap gap-1">
                  {room.equipment.map((item, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
