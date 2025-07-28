"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreatePayment, useInvoices } from "@/hooks/use-billing"
import type { PaymentFormData } from "@/types/billing"
import { CreditCard, Smartphone, Building, DollarSign, Hash } from "lucide-react"

const paymentSchema = z.object({
  invoiceId: z.string().min(1, "Selecciona una factura"),
  amount: z.number().min(0.01, "El monto debe ser mayor a 0"),
  currency: z.enum(["USD", "VES"]),
  method: z.enum(["pago_movil", "zelle", "transferencia", "efectivo", "tarjeta"]),
  reference: z.string().min(1, "La referencia es requerida"),
  bank: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
})

const paymentMethods = [
  {
    value: "pago_movil",
    label: "Pago Móvil",
    icon: Smartphone,
    description: "Transferencia desde app bancaria",
    fields: ["bank", "phone"],
  },
  {
    value: "zelle",
    label: "Zelle",
    icon: DollarSign,
    description: "Transferencia internacional USD",
    fields: ["email"],
  },
  {
    value: "transferencia",
    label: "Transferencia",
    icon: Building,
    description: "Transferencia bancaria tradicional",
    fields: ["bank"],
  },
  {
    value: "efectivo",
    label: "Efectivo",
    icon: DollarSign,
    description: "Pago en efectivo en oficina",
    fields: [],
  },
  {
    value: "tarjeta",
    label: "Tarjeta",
    icon: CreditCard,
    description: "Pago con tarjeta de débito/crédito",
    fields: [],
  },
]

const venezuelanBanks = [
  "Banesco",
  "Banco de Venezuela",
  "Banco Mercantil",
  "BBVA Provincial",
  "Banco Bicentenario",
  "Bancaribe",
  "Banco Exterior",
  "BOD",
  "Banco Plaza",
  "Banco Activo",
]

export function PaymentForm() {
  const { data: invoices = [] } = useInvoices()
  const createPayment = useCreatePayment()
  const [selectedMethod, setSelectedMethod] = useState<string>("")

  const pendingInvoices = invoices.filter((invoice) => invoice.status === "pending" || invoice.status === "overdue")

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      invoiceId: "",
      amount: 0,
      currency: "USD",
      method: "pago_movil",
      reference: "",
      bank: "",
      phone: "",
      email: "",
    },
  })

  const selectedInvoice = invoices.find((inv) => inv.id === form.watch("invoiceId"))

  const onSubmit = (data: PaymentFormData) => {
    createPayment.mutate(data, {
      onSuccess: () => {
        form.reset()
        setSelectedMethod("")
      },
    })
  }

  const getRequiredFields = (method: string) => {
    const methodConfig = paymentMethods.find((m) => m.value === method)
    return methodConfig?.fields || []
  }

  const formatAmount = (amount: number, currency: "USD" | "VES") => {
    if (currency === "VES") {
      return `Bs. ${amount.toLocaleString("es-VE")}`
    }
    return `$ ${amount.toFixed(2)}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-800">
            <CreditCard className="h-6 w-6" />
            <span>Registrar Pago</span>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Form */}
      <Card className="bg-white border-blue-200">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Invoice Selection */}
              <FormField
                control={form.control}
                name="invoiceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-800 font-semibold">Factura a Pagar</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        const invoice = invoices.find((inv) => inv.id === value)
                        if (invoice) {
                          form.setValue("amount", invoice.amount)
                          form.setValue("currency", invoice.currency)
                        }
                      }}
                    >
                      <FormControl>
                        <SelectTrigger className="border-blue-200 focus:border-blue-400">
                          <SelectValue placeholder="Selecciona una factura pendiente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {pendingInvoices.map((invoice) => (
                          <SelectItem key={invoice.id} value={invoice.id}>
                            <div className="flex justify-between items-center w-full">
                              <span>
                                #{invoice.id} - {invoice.patient}
                              </span>
                              <span className="ml-4 font-semibold">
                                {formatAmount(invoice.amount, invoice.currency)}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Invoice Details */}
              {selectedInvoice && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-blue-800">Paciente</p>
                        <p className="text-blue-900">{selectedInvoice.patient}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-800">Descripción</p>
                        <p className="text-blue-900">{selectedInvoice.description}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-800">Monto</p>
                        <p className="text-2xl font-bold text-blue-900">
                          {formatAmount(selectedInvoice.amount, selectedInvoice.currency)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-800">Vencimiento</p>
                        <p className="text-blue-900">{new Date(selectedInvoice.dueDate).toLocaleDateString("es-VE")}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Amount and Currency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-800 font-semibold">Monto</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="border-blue-200 focus:border-blue-400"
                          {...field}
                          onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-800 font-semibold">Moneda</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-blue-200 focus:border-blue-400">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="VES">VES (Bs.)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Payment Method */}
              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-800 font-semibold">Método de Pago</FormLabel>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {paymentMethods.map((method) => {
                        const Icon = method.icon
                        return (
                          <div
                            key={method.value}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              field.value === method.value
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-blue-300"
                            }`}
                            onClick={() => {
                              field.onChange(method.value)
                              setSelectedMethod(method.value)
                            }}
                          >
                            <div className="flex items-center space-x-3">
                              <Icon
                                className={`h-6 w-6 ${
                                  field.value === method.value ? "text-blue-600" : "text-gray-400"
                                }`}
                              />
                              <div>
                                <div className="font-medium text-gray-900">{method.label}</div>
                                <div className="text-sm text-gray-500">{method.description}</div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Reference */}
              <FormField
                control={form.control}
                name="reference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-800 font-semibold flex items-center space-x-2">
                      <Hash className="h-4 w-4" />
                      <span>Número de Referencia</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: 123456789 o REF-ABC123"
                        className="border-blue-200 focus:border-blue-400"
                        {...field}
                      />
                    </FormControl>
                    <div className="text-sm text-gray-500">Número de confirmación o referencia del pago</div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Conditional Fields */}
              {getRequiredFields(selectedMethod).includes("bank") && (
                <FormField
                  control={form.control}
                  name="bank"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-800 font-semibold">Banco</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="border-blue-200 focus:border-blue-400">
                            <SelectValue placeholder="Selecciona el banco" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {venezuelanBanks.map((bank) => (
                            <SelectItem key={bank} value={bank}>
                              {bank}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {getRequiredFields(selectedMethod).includes("phone") && (
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-800 font-semibold">Teléfono</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+584121234567"
                          className="border-blue-200 focus:border-blue-400"
                          {...field}
                        />
                      </FormControl>
                      <div className="text-sm text-gray-500">Teléfono desde el cual se realizó el pago móvil</div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {getRequiredFields(selectedMethod).includes("email") && (
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-800 font-semibold">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="usuario@email.com"
                          className="border-blue-200 focus:border-blue-400"
                          {...field}
                        />
                      </FormControl>
                      <div className="text-sm text-gray-500">Email asociado a la cuenta Zelle</div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  Limpiar
                </Button>
                <Button
                  type="submit"
                  disabled={createPayment.isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {createPayment.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Procesando...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Registrar Pago
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Success Message */}
      {createPayment.isSuccess && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-green-800">
              <div className="h-2 w-2 bg-green-600 rounded-full"></div>
              <span className="font-medium">Pago registrado exitosamente</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
