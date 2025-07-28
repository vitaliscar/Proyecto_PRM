"use client"

import type React from "react"

import { useState } from "react"
import { MoreHorizontal, Shield, User, UserCheck, UserX, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUserRoles, useUpdateUserRole } from "@/hooks/use-auth"
import type { UserRole } from "@/types/auth"

const roleLabels: Record<UserRole, string> = {
  administrator: "Administrador",
  psychologist: "Psicólogo",
  receptionist: "Recepcionista",
  patient: "Paciente",
}

const roleColors: Record<UserRole, string> = {
  administrator: "bg-red-100 text-red-800 border-red-200",
  psychologist: "bg-blue-100 text-blue-800 border-blue-200",
  receptionist: "bg-green-100 text-green-800 border-green-200",
  patient: "bg-gray-100 text-gray-800 border-gray-200",
}

const roleIcons: Record<UserRole, React.ReactNode> = {
  administrator: <Shield className="w-3 h-3" />,
  psychologist: <UserCheck className="w-3 h-3" />,
  receptionist: <User className="w-3 h-3" />,
  patient: <UserX className="w-3 h-3" />,
}

export function RolesTable() {
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const { data: users, isLoading, error } = useUserRoles()
  const updateRoleMutation = useUpdateUserRole()

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    updateRoleMutation.mutate(
      { userId, role: newRole },
      {
        onSuccess: () => {
          setEditingUserId(null)
        },
      },
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-VE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Roles</CardTitle>
          <CardDescription>Configura los roles y permisos de los usuarios del sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-600">Cargando usuarios...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Roles</CardTitle>
          <CardDescription>Configura los roles y permisos de los usuarios del sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-2">
              <p className="text-red-600 font-medium">Error al cargar usuarios</p>
              <p className="text-gray-600 text-sm">{error instanceof Error ? error.message : "Error desconocido"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
        <CardTitle className="flex items-center space-x-2 text-blue-900">
          <Shield className="w-5 h-5" />
          <span>Gestión de Roles</span>
        </CardTitle>
        <CardDescription className="text-blue-700">
          Configura los roles y permisos de los usuarios del sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-900">Usuario</TableHead>
              <TableHead className="font-semibold text-gray-900">Cédula</TableHead>
              <TableHead className="font-semibold text-gray-900">Rol</TableHead>
              <TableHead className="font-semibold text-gray-900">Estado</TableHead>
              <TableHead className="font-semibold text-gray-900">Último Acceso</TableHead>
              <TableHead className="font-semibold text-gray-900">Permisos</TableHead>
              <TableHead className="font-semibold text-gray-900 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user.firstName.charAt(0)}
                        {user.lastName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{user.cedula}</span>
                </TableCell>
                <TableCell>
                  {editingUserId === user.id ? (
                    <Select
                      value={user.role}
                      onValueChange={(value: UserRole) => handleRoleChange(user.id, value)}
                      disabled={updateRoleMutation.isPending}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="administrator">
                          <div className="flex items-center space-x-2">
                            <Shield className="w-4 h-4 text-red-600" />
                            <span>Administrador</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="psychologist">
                          <div className="flex items-center space-x-2">
                            <UserCheck className="w-4 h-4 text-blue-600" />
                            <span>Psicólogo</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="receptionist">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-green-600" />
                            <span>Recepcionista</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="patient">
                          <div className="flex items-center space-x-2">
                            <UserX className="w-4 h-4 text-gray-600" />
                            <span>Paciente</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={`${roleColors[user.role]} flex items-center space-x-1 w-fit`}>
                      {roleIcons[user.role]}
                      <span>{roleLabels[user.role]}</span>
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={user.isActive ? "default" : "secondary"}>
                    {user.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">{user.lastLogin ? formatDate(user.lastLogin) : "Nunca"}</span>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {user.permissions.slice(0, 2).map((permission) => (
                      <Badge key={permission.id} variant="outline" className="text-xs">
                        {permission.name}
                      </Badge>
                    ))}
                    {user.permissions.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{user.permissions.length - 2} más
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setEditingUserId(user.id)} disabled={editingUserId === user.id}>
                        <Edit className="mr-2 h-4 w-4" />
                        Cambiar Rol
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        Ver Perfil
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <UserX className="mr-2 h-4 w-4" />
                        {user.isActive ? "Desactivar" : "Activar"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
