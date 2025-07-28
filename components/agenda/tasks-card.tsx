"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckSquare, Clock, User, FileText, Phone, Brain, Settings, AlertTriangle } from "lucide-react"
import type { AgendaTask } from "@/types/agenda"
import { useCompleteTask } from "@/hooks/use-agenda"

interface TasksCardProps {
  tasks: AgendaTask[]
}

export function TasksCard({ tasks }: TasksCardProps) {
  const completeTaskMutation = useCompleteTask()

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "clinical":
        return <Brain size={16} className="text-blue-600" />
      case "administrative":
        return <FileText size={16} className="text-purple-600" />
      case "follow_up":
        return <Phone size={16} className="text-green-600" />
      case "evaluation":
        return <CheckSquare size={16} className="text-orange-600" />
      default:
        return <Settings size={16} className="text-gray-600" />
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "clinical":
        return <Badge className="bg-blue-100 text-blue-800">Clínica</Badge>
      case "administrative":
        return <Badge className="bg-purple-100 text-purple-800">Administrativa</Badge>
      case "follow_up":
        return <Badge className="bg-green-100 text-green-800">Seguimiento</Badge>
      case "evaluation":
        return <Badge className="bg-orange-100 text-orange-800">Evaluación</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">General</Badge>
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500"
      case "medium":
        return "border-l-yellow-500"
      case "low":
        return "border-l-green-500"
      default:
        return "border-l-gray-300"
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">Alta</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Media</Badge>
      case "low":
        return <Badge className="bg-green-100 text-green-800">Baja</Badge>
      default:
        return null
    }
  }

  const isOverdue = (dueTime?: string) => {
    if (!dueTime) return false
    const now = new Date()
    const due = new Date(`2025-07-27T${dueTime}:00`)
    return now > due
  }

  const handleCompleteTask = (taskId: string) => {
    completeTaskMutation.mutate(taskId)
  }

  const pendingTasks = tasks.filter((task) => !task.completed)
  const completedTasks = tasks.filter((task) => task.completed)

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <CardTitle className="flex items-center justify-between text-gray-900">
          <div className="flex items-center">
            <CheckSquare className="mr-2" size={20} />
            Tareas del Día
          </div>
          <div className="text-sm font-normal">
            <span className="text-orange-600 font-medium">{pendingTasks.length} pendientes</span>
            <span className="text-gray-400 mx-2">•</span>
            <span className="text-green-600 font-medium">{completedTasks.length} completadas</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {tasks.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <CheckSquare size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No hay tareas programadas</p>
            <p className="text-sm">¡Excelente! Día libre de tareas administrativas.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {/* Tareas Pendientes */}
            {pendingTasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 border-l-4 ${getPriorityColor(task.priority)} ${
                  isOverdue(task.dueTime) ? "bg-red-50" : "hover:bg-gray-50"
                } transition-colors`}
              >
                <div className="flex items-start space-x-4">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => handleCompleteTask(task.id)}
                    className="mt-1"
                  />

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {getTypeIcon(task.type)}
                          <h3 className="font-semibold text-gray-900">{task.description}</h3>
                          {isOverdue(task.dueTime) && (
                            <AlertTriangle size={16} className="text-red-500" title="Tarea vencida" />
                          )}
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center space-x-1">
                            <User size={14} />
                            <span>{task.assignedTo}</span>
                          </div>
                          {task.dueTime && (
                            <div className="flex items-center space-x-1">
                              <Clock size={14} />
                              <span className={isOverdue(task.dueTime) ? "text-red-600 font-medium" : ""}>
                                {task.dueTime}
                              </span>
                            </div>
                          )}
                          <span>~{task.estimatedDuration} min</span>
                        </div>

                        {task.relatedPatient && (
                          <p className="text-sm text-blue-600 mb-2">Paciente: {task.relatedPatient}</p>
                        )}
                      </div>

                      <div className="flex flex-col items-end space-y-2">
                        <div className="flex items-center space-x-2">
                          {getTypeBadge(task.type)}
                          {getPriorityBadge(task.priority)}
                        </div>
                        <Button variant="outline" size="sm">
                          Detalles
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Tareas Completadas */}
            {completedTasks.map((task) => (
              <div key={task.id} className="p-4 border-l-4 border-l-green-500 bg-green-50 opacity-75">
                <div className="flex items-start space-x-4">
                  <Checkbox checked={true} disabled className="mt-1" />

                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      {getTypeIcon(task.type)}
                      <h3 className="font-medium text-gray-700 line-through">{task.description}</h3>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User size={14} />
                        <span>{task.assignedTo}</span>
                      </div>
                      <span>Completada</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {getTypeBadge(task.type)}
                    <Badge className="bg-green-100 text-green-800">Completada</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
