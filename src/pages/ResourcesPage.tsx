import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import api from '@/services/api';

interface Resource {
  id: string;
  type: string;
  name: string;
  status: string;
}

const ResourcesPage: React.FC = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('');

  const { data: resources, isLoading } = useQuery<Resource[]>({
    queryKey: ['resources'],
    queryFn: async () => {
      const simulatedData: Resource[] = [
        { id: '1', type: 'room', name: 'Sala 1', status: 'available' },
      ];
      try {
        const response = await api.get('/resources/');
        return response.data.length > 0 ? response.data : simulatedData;
      } catch {
        return simulatedData;
      }
    },
  });

  const filteredResources = resources?.filter((resource) =>
    resource.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 bg-neutral">
      <h1 className="text-2xl font-bold mb-4">{t('resources.title')}</h1>
      <div className="mb-4">
        <Input
          placeholder={t('resources.filter')}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <p>Cargando...</p>
        ) : (
          filteredResources?.map((resource) => (
            <Card key={resource.id}>
              <CardHeader>
                <CardTitle>{resource.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p><strong>{t('resources.type')}:</strong> {resource.type}</p>
                <p><strong>{t('resources.status')}:</strong> {resource.status}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ResourcesPage;
