"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, Video, Phone, User, Plus } from "lucide-react"
import { useAppointments } from "@/hooks/use-appointments"
import {
  convertAppointmentsToEvents,
  getDaysInMonth,
  isToday,
  isSameDay,
  getWeekDays,
  getMonthNames,
} from "@/utils/calendar"
import type { AppointmentType, AppointmentStatus } from "@/types/appointment"

interface CalendarViewProps {
  onDateSelect?: (date: Date) => void
  onAppointmentSelect?: (appointmentId: string) => void
  onCreateAppointment?: (date?: Date) => void
}

export function CalendarView({ onDateSelect, onAppointmentSelect, onCreateAppointment }: CalendarViewProps) {
  const { data: appointments = [], isLoading } = useAppointments()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month")

  const events = convertAppointmentsToEvents(appointments)
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()
  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const weekDays = getWeekDays()
  const monthNames = getMonthNames()

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const goToToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(new Date())
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    onDateSelect?.(date)
  }

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => isSameDay(event.start, date))
  }

  const getTypeIcon = (type: AppointmentType) => {
    switch (type) {
      case "virtual":
        return <Video className="w-3 h-3" />
      case "presencial":
        return <MapPin className="w-3 h-3" />
      case "telefonica":
        return <Phone className="w-3 h-3" />
      default:
        return <Calendar className="w-3 h-3" />
    }
  }

  const getTypeColor = (type: AppointmentType) => {
    switch (type) {
      case "virtual":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "presencial":
        return "bg-green-100 text-green-800 border-green-200"
      case "telefonica":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case "confirmed":
        return "border-l-green-500"
      case "scheduled":
        return "border-l-blue-500"
      case "cancelled":
        return "border-l-red-500"
      case "completed":
        return "border-l-gray-500"
      case "no_show":
        return "border-l-orange-500"
      default:
        return "border-l-gray-300"
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header del Calendario */}
      <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth("prev")}
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <h2 className="text-xl font-semibold text-blue-900 min-w-[200px] text-center">
                  {monthNames[currentMonth]} {currentYear}
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth("next")}
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={goToToday}
                className="border-blue-300 text-blue-700 hover:bg-blue-50 bg-transparent"
              >
                Hoy
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Select value={viewMode} onValueChange={(value: "month" | "week" | "day") => setViewMode(value)}>
                <SelectTrigger className="w-32 border-blue-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Mes</SelectItem>
                  <SelectItem value="week">Semana</SelectItem>
                  <SelectItem value="day">Día</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={() => onCreateAppointment?.(selectedDate || new Date())}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nueva Cita
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Vista Mensual */}
      {viewMode === "month" && (
        <Card className="border-blue-200 shadow-sm">
          <CardContent className="p-6">
            {/* Encabezados de días */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {weekDays.map((day) => (
                <div key={day} className="p-3 text-center font-medium text-blue-700 bg-blue-50 rounded-lg">
                  {day}
                </div>
              ))}
            </div>

            {/* Días del calendario */}
            <div className="grid grid-cols-7 gap-1">
              {daysInMonth.map((date, index) => {
                const dayEvents = getEventsForDate(date)
                const isCurrentMonth = date.getMonth() === currentMonth
                const isTodayDate = isToday(date)
                const isSelected = selectedDate && isSameDay(date, selectedDate)

                return (
                  <div
                    key={index}
                    className={`min-h-[120px] p-2 border rounded-lg cursor-pointer transition-all hover:bg-blue-50 ${
                      isCurrentMonth ? "bg-white border-blue-200" : "bg-gray-50 border-gray-200"
                    } ${isTodayDate ? "ring-2 ring-blue-500 bg-blue-50" : ""} ${
                      isSelected ? "ring-2 ring-blue-400 bg-blue-100" : ""
                    }`}
                    onClick={() => handleDateClick(date)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-sm font-medium ${
                          isCurrentMonth ? "text-gray-900" : "text-gray-400"
                        } ${isTodayDate ? "text-blue-700 font-bold" : ""}`}
                      >
                        {date.getDate()}
                      </span>
                      {dayEvents.length > 0 && (
                        <Badge
                          variant="outline"
                          className="text-xs px-1 py-0 bg-blue-100 text-blue-700 border-blue-300"
                        >
                          {dayEvents.length}
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          className={`text-xs p-1 rounded border-l-2 bg-white hover:bg-blue-50 cursor-pointer ${getStatusColor(event.status)}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            onAppointmentSelect?.(event.id)
                          }}
                        >
                          <div className="flex items-center space-x-1">
                            {getTypeIcon(event.type)}
                            <span className="truncate font-medium">{event.patient}</span>
                          </div>
                          <div className="text-gray-600 flex items-center space-x-1">
                            <Clock className="w-2 h-2" />
                            <span>
                              {event.start.toLocaleTimeString("es-VE", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="text-xs text-blue-600 font-medium">+{dayEvents.length - 3} más</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vista Diaria */}
      {viewMode === "day" && selectedDate && (
        <Card className="border-blue-200 shadow-sm">
          <CardHeader className="bg-blue-50 border-b border-blue-100">
            <CardTitle className="flex items-center text-lg">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              {selectedDate.toLocaleDateString("es-VE", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {getEventsForDate(selectedDate).length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No hay citas programadas para este día</p>
                  <Button
                    variant="outline"
                    className="mt-4 bg-transparent"
                    onClick={() => onCreateAppointment?.(selectedDate)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Programar Cita
                  </Button>
                </div>
              ) : (
                getEventsForDate(selectedDate)
                  .sort((a, b) => a.start.getTime() - b.start.getTime())
                  .map((event) => (
                    <Card
                      key={event.id}
                      className={`border-l-4 hover:shadow-md transition-shadow cursor-pointer ${getStatusColor(event.status)}`}
                      onClick={() => onAppointmentSelect?.(event.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <User className="w-4 h-4 text-gray-600" />
                              <span className="font-semibold text-gray-900">{event.patient}</span>
                              <Badge className={getTypeColor(event.type)}>
                                {getTypeIcon(event.type)}
                                <span className="ml-1 capitalize">{event.type}</span>
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>
                                  {event.start.toLocaleTimeString("es-VE", { hour: "2-digit", minute: "2-digit" })} -
                                  {event.end.toLocaleTimeString("es-VE", { hour: "2-digit", minute: "2-digit" })}
                                </span>
                              </div>
                              {event.room && (
                                <div className="flex items-center space-x-1">
                                  <MapPin className="w-3 h-3" />
                                  <span>{event.room}</span>
                                </div>
                              )}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">Con: {event.psychologist}</div>
                          </div>
                          <Badge
                            variant="outline"
                            className={
                              event.status === "confirmed"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : event.status === "scheduled"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : "bg-gray-50 text-gray-700 border-gray-200"
                            }
                          >
                            {event.status === "confirmed"
                              ? "Confirmada"
                              : event.status === "scheduled"
                                ? "Programada"
                                : event.status === "cancelled"
                                  ? "Cancelada"
                                  : event.status === "completed"
                                    ? "Completada"
                                    : "Sin confirmar"}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leyenda */}
      <Card className="border-blue-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-700">Leyenda</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600">Confirmada</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-sm text-gray-600">Programada</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-sm text-gray-600">Cancelada</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-500 rounded"></div>
              <span className="text-sm text-gray-600">Completada</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <Video className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-600">Virtual</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-600">Presencial</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-purple-600" />
              <span className="text-sm text-gray-600">Telefónica</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
