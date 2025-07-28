import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import api from '@/services/api';

interface PaymentFormData {
  patient: string;
  amount: number;
  currency: string;
  method: string;
}

const PaymentsPage: React.FC = () => {
  const { t } = useTranslation();
  const form = useForm<PaymentFormData>({
    defaultValues: {
      patient: '',
      amount: 0,
      currency: 'USD',
      method: 'mobile',
    },
  });

  const onSubmit = async (data: PaymentFormData) => {
    try {
      await api.post('/billing/payments/', data);
      form.reset();
      alert('Pago registrado con éxito');
    } catch (error) {
      alert('Error al registrar el pago');
    }
  };

  return (
    <div className="container mx-auto p-4 bg-accent">
      <h1 className="text-2xl font-bold mb-4">{t('billing.payments.title')}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
          <FormField
            control={form.control}
            name="patient"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('billing.payments.patient')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('billing.payments.amount')}</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
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
                <FormLabel>{t('billing.payments.currency')}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una moneda" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="Bs">Bs</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="method"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('billing.payments.method')}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un método" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="mobile">Pago Móvil</SelectItem>
                    <SelectItem value="zelle">Zelle</SelectItem>
                    <SelectItem value="transfer">Transferencia</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">{t('billing.payments.submit')}</Button>
        </form>
      </Form>
    </div>
  );
};

export default PaymentsPage;
