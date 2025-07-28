"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, User, Lock, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useLogin } from "@/hooks/use-auth"
import { loginSchema, type LoginFormData } from "@/lib/validations/auth"

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const loginMutation = useLogin()

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      cedula: "",
      password: "",
    },
  })

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="space-y-4 pb-8">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold text-gray-900">Proyecto Creces y Asociados</CardTitle>
            <CardDescription className="text-gray-600">Sistema de Gestión de Relaciones con Pacientes</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="cedula"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Cédula de Identidad</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          {...field}
                          placeholder="V-12345678"
                          className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          disabled={loginMutation.isPending}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Contraseña</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Ingresa tu contraseña"
                          className="pl-10 pr-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          disabled={loginMutation.isPending}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={loginMutation.isPending}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Iniciando sesión...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <LogIn className="w-4 h-4" />
                    <span>Iniciar Sesión</span>
                  </div>
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center space-y-4">
            <div className="text-sm text-gray-600">
              <p className="font-medium">Credenciales de prueba:</p>
              <div className="mt-2 space-y-1 text-xs bg-gray-50 p-3 rounded-lg">
                <p>
                  <strong>Administrador:</strong> V-87654321 / 123456
                </p>
                <p>
                  <strong>Psicólogo:</strong> V-12345678 / 123456
                </p>
                <p>
                  <strong>Recepcionista:</strong> V-11223344 / 123456
                </p>
                <p>
                  <strong>Paciente:</strong> V-55667788 / 123456
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
