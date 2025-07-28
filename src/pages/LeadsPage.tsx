import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import api from '@/services/api';

interface Lead {
  id: string;
  name: string;
  phone: string;
  status: string;
}

const LeadsPage: React.FC = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('');

  const { data: leads, isLoading } = useQuery<Lead[]>({
    queryKey: ['leads'],
    queryFn: async () => {
      const simulatedData: Lead[] = [
        { id: '1', name: 'Ana López', phone: '+584121234567', status: 'new' },
      ];
      try {
        const response = await api.get('/marketing/leads/');
        return response.data.length > 0 ? response.data : simulatedData;
      } catch {
        return simulatedData;
      }
    },
  });

  const filteredLeads = leads?.filter((lead) =>
    lead.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 bg-primary">
      <h1 className="text-2xl font-bold mb-4">{t('marketing.leads.title')}</h1>
      <div className="mb-4">
        <Input
          placeholder={t('marketing.leads.filter')}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('marketing.leads.name')}</TableHead>
            <TableHead>{t('marketing.leads.phone')}</TableHead>
            <TableHead>{t('marketing.leads.status')}</TableHead>
            <TableHead>{t('marketing.leads.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4}>Cargando...</TableCell>
            </TableRow>
          ) : (
            filteredLeads?.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>{lead.name}</TableCell>
                <TableCell>{lead.phone}</TableCell>
                <TableCell>{lead.status}</TableCell>
                <TableCell>
                  <Button variant="outline">{t('marketing.leads.actions')}</Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeadsPage;
