"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Send, Phone, Mail, Bot, Users, Bell, Search, MoreHorizontal, Clock } from "lucide-react"

const conversations = [
  {
    id: 1,
    participant: "Ana María Rodríguez",
    lastMessage: "Gracias por la sesión de hoy, me siento mucho mejor",
    timestamp: "10:30 AM",
    unread: 0,
    type: "patient",
    status: "online",
  },
  {
    id: 2,
    participant: "Dr. Carlos Mendoza",
    lastMessage: "¿Podrías revisar el caso de María García?",
    timestamp: "9:45 AM",
    unread: 2,
    type: "colleague",
    status: "online",
  },
  {
    id: 3,
    participant: "María Fernanda García",
    lastMessage: "Necesito reagendar mi cita de mañana",
    timestamp: "Ayer",
    unread: 1,
    type: "patient",
    status: "offline",
  },
  {
    id: 4,
    participant: "Recepción",
    lastMessage: "Nuevo paciente registrado para evaluación",
    timestamp: "Ayer",
    unread: 0,
    type: "staff",
    status: "online",
  },
]

const chatbotConversations = [
  {
    id: 1,
    user: "Usuario Anónimo",
    query: "¿Qué servicios ofrecen para ansiedad?",
    response:
      "Ofrecemos terapia cognitivo-conductual, evaluaciones especializadas y seguimiento personalizado para trastornos de ansiedad.",
    timestamp: "11:20 AM",
    status: "resolved",
  },
  {
    id: 2,
    user: "Carlos R.",
    query: "¿Cuánto cuesta una consulta?",
    response: "Los precios varían según el tipo de consulta. Te conectaré con un especialista.",
    timestamp: "10:15 AM",
    status: "escalated",
  },
  {
    id: 3,
    user: "María S.",
    query: "Necesito ayuda urgente",
    response: "Entiendo tu preocupación. Te estoy conectando inmediatamente con un profesional.",
    timestamp: "9:30 AM",
    status: "escalated",
  },
]

export function CommunicationModule() {
  const [activeTab, setActiveTab] = useState<"messages" | "chatbot" | "portal">("messages")
  const [selectedConversation, setSelectedConversation] = useState<any>(null)
  const [newMessage, setNewMessage] = useState("")

  const getStatusColor = (status: string) => {
    return status === "online" ? "bg-green-500" : "bg-gray-400"
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "patient":
        return <Users className="text-blue-600" size={16} />
      case "colleague":
        return <MessageSquare className="text-purple-600" size={16} />
      case "staff":
        return <Bell className="text-green-600" size={16} />
      default:
        return <MessageSquare className="text-gray-600" size={16} />
    }
  }

  const getChatbotStatusBadge = (status: string) => {
    switch (status) {
      case "resolved":
        return <Badge className="bg-green-100 text-green-800">Resuelto</Badge>
      case "escalated":
        return <Badge className="bg-red-100 text-red-800">Escalado</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
      default:
        return <Badge>Desconocido</Badge>
    }
  }

  if (activeTab === "portal") {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Portal de Pacientes</h1>
            <p className="text-neutral-600 mt-1">Gestiona el acceso y recursos para tus pacientes.</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setActiveTab("messages")}>
              Mensajería
            </Button>
            <Button variant="outline" onClick={() => setActiveTab("chatbot")}>
              Chatbot
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Accesos Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { patient: "Ana Rodríguez", action: "Completó cuestionario PHQ-9", time: "2 horas" },
                  { patient: "Carlos Mendoza", action: "Descargó recursos de ansiedad", time: "4 horas" },
                  { patient: "María García", action: "Reagendó cita", time: "1 día" },
                  { patient: "José López", action: "Revisó progreso de metas", time: "2 días" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={`/placeholder.svg?height=32&width=32&query=${activity.patient}`} />
                        <AvatarFallback>
                          {activity.patient
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-neutral-900">{activity.patient}</p>
                        <p className="text-sm text-neutral-600">{activity.action}</p>
                      </div>
                    </div>
                    <span className="text-sm text-neutral-500">Hace {activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recursos Más Descargados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: "Técnicas de Respiración", downloads: 45, category: "Ansiedad" },
                  { title: "Diario de Emociones", downloads: 38, category: "Depresión" },
                  { title: "Ejercicios de Mindfulness", downloads: 32, category: "Bienestar" },
                  { title: "Guía de Sueño Saludable", downloads: 28, category: "Sueño" },
                ].map((resource, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <div>
                      <p className="font-medium text-neutral-900">{resource.title}</p>
                      <p className="text-sm text-neutral-600">{resource.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary-600">{resource.downloads}</p>
                      <p className="text-xs text-neutral-500">descargas</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (activeTab === "chatbot") {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Chatbot IA</h1>
            <p className="text-neutral-600 mt-1">Monitorea y gestiona las conversaciones del chatbot inteligente.</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setActiveTab("messages")}>
              Mensajería
            </Button>
            <Button variant="outline" onClick={() => setActiveTab("portal")}>
              Portal
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Consultas Hoy</p>
                  <p className="text-2xl font-bold text-neutral-900">47</p>
                </div>
                <Bot className="text-blue-600" size={24} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Resueltas por IA</p>
                  <p className="text-2xl font-bold text-green-600">38</p>
                </div>
                <MessageSquare className="text-green-600" size={24} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Escaladas</p>
                  <p className="text-2xl font-bold text-red-600">9</p>
                </div>
                <Phone className="text-red-600" size={24} />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Conversaciones Recientes del Chatbot</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chatbotConversations.map((conversation) => (
                <div key={conversation.id} className="p-4 border border-neutral-200 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>
                          <Bot size={16} />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-neutral-900">{conversation.user}</p>
                        <p className="text-sm text-neutral-500">{conversation.timestamp}</p>
                      </div>
                    </div>
                    {getChatbotStatusBadge(conversation.status)}
                  </div>

                  <div className="space-y-3">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-900">
                        <strong>Usuario:</strong> {conversation.query}
                      </p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-green-900">
                        <strong>IA:</strong> {conversation.response}
                      </p>
                    </div>
                  </div>

                  {conversation.status === "escalated" && (
                    <div className="mt-3 flex space-x-2">
                      <Button size="sm" className="bg-primary-500 hover:bg-primary-600">
                        Responder
                      </Button>
                      <Button variant="outline" size="sm">
                        Marcar Resuelto
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (selectedConversation) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => setSelectedConversation(null)}>
              ← Volver
            </Button>
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={`/placeholder.svg?height=40&width=40&query=${selectedConversation.participant}`} />
                <AvatarFallback>
                  {selectedConversation.participant
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">{selectedConversation.participant}</h1>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedConversation.status)}`} />
                  <span className="text-sm text-neutral-600">
                    {selectedConversation.status === "online" ? "En línea" : "Desconectado"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Phone size={16} className="mr-2" />
              Llamar
            </Button>
            <Button variant="outline">
              <Mail size={16} className="mr-2" />
              Email
            </Button>
          </div>
        </div>

        <Card className="h-96">
          <CardContent className="p-6 h-full flex flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto">
              {/* Mensajes simulados */}
              <div className="flex justify-end">
                <div className="bg-primary-500 text-white p-3 rounded-lg max-w-xs">
                  <p className="text-sm">Hola Ana, ¿cómo te sientes después de nuestra última sesión?</p>
                  <p className="text-xs opacity-75 mt-1">10:25 AM</p>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-neutral-100 p-3 rounded-lg max-w-xs">
                  <p className="text-sm">Mucho mejor, gracias. Las técnicas de respiración me han ayudado bastante.</p>
                  <p className="text-xs text-neutral-500 mt-1">10:30 AM</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-2 mt-4">
              <Input
                placeholder="Escribe tu mensaje..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1"
              />
              <Button className="bg-primary-500 hover:bg-primary-600">
                <Send size={16} />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Centro de Comunicación</h1>
          <p className="text-neutral-600 mt-1">Gestiona todas las comunicaciones con pacientes y equipo.</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setActiveTab("chatbot")}>
            <Bot size={16} className="mr-2" />
            Chatbot
          </Button>
          <Button variant="outline" onClick={() => setActiveTab("portal")}>
            <Users size={16} className="mr-2" />
            Portal
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Mensajes Hoy</p>
                <p className="text-2xl font-bold text-neutral-900">23</p>
              </div>
              <MessageSquare className="text-blue-600" size={24} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Sin Leer</p>
                <p className="text-2xl font-bold text-red-600">3</p>
              </div>
              <Bell className="text-red-600" size={24} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Respuesta Promedio</p>
                <p className="text-2xl font-bold text-green-600">12min</p>
              </div>
              <Clock className="text-green-600" size={24} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Satisfacción</p>
                <p className="text-2xl font-bold text-purple-600">4.8/5</p>
              </div>
              <Users className="text-purple-600" size={24} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversations List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Conversaciones</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
              <Input placeholder="Buscar conversaciones..." className="pl-10 w-64" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
                onClick={() => setSelectedConversation(conversation)}
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={`/placeholder.svg?height=40&width=40&query=${conversation.participant}`} />
                      <AvatarFallback>
                        {conversation.participant
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(conversation.status)}`}
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-neutral-900">{conversation.participant}</h3>
                      {getTypeIcon(conversation.type)}
                    </div>
                    <p className="text-sm text-neutral-600 truncate max-w-md">{conversation.lastMessage}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-neutral-500">{conversation.timestamp}</p>
                    {conversation.unread > 0 && (
                      <Badge className="bg-red-500 text-white mt-1">{conversation.unread}</Badge>
                    )}
                  </div>

                  <Button variant="ghost" size="sm">
                    <MoreHorizontal size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
