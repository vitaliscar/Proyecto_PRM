import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api from '@/services/api';

interface Invoice {
  id: string;
  patient: string;
  amount: number;
  currency: string;
  status: string;
}

const InvoicesPage: React.FC = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('');

  const { data: invoices, isLoading } = useQuery<Invoice[]>({
    queryKey: ['invoices'],
    queryFn: async () => {
      const simulatedData: Invoice[] = [
        { id: '1', patient: 'Juan Pérez', amount: 50, currency: 'USD', status: 'pending' },
      ];
      try {
        const response = await api.get('/billing/invoices/');
        return response.data.length > 0 ? response.data : simulatedData;
      } catch {
        return simulatedData;
      }
    },
  });

  const filteredInvoices = invoices?.filter((invoice) =>
    invoice.patient.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 bg-accent">
      <h1 className="text-2xl font-bold mb-4">{t('billing.invoices.title')}</h1>
      <div className="mb-4">
        <Input
          placeholder={t('billing.invoices.filter')}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('billing.invoices.patient')}</TableHead>
            <TableHead>{t('billing.invoices.amount')}</TableHead>
            <TableHead>{t('billing.invoices.status')}</TableHead>
            <TableHead>{t('billing.invoices.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4}>Cargando...</TableCell>
            </TableRow>
          ) : (
            filteredInvoices?.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.patient}</TableCell>
                <TableCell>
                  {invoice.amount} {invoice.currency}
                </TableCell>
                <TableCell className={invoice.status === 'paid' ? 'text-green-500' : 'text-red-500'}>
                  {invoice.status}
                </TableCell>
                <TableCell>
                  <Button variant="outline">{t('billing.invoices.actions')}</Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default InvoicesPage;
