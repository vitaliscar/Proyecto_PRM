import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import api from '@/services/api';

interface Thread {
  id: string;
  title: string;
  author: string;
}

const CommunityPage: React.FC = () => {
  const { t } = useTranslation();

  const { data: threads, isLoading } = useQuery<Thread[]>({
    queryKey: ['threads'],
    queryFn: async () => {
      const simulatedData: Thread[] = [
        { id: '1', title: 'Grupo de Apoyo', author: 'Juan Pérez' },
      ];
      try {
        const response = await api.get('/community/');
        return response.data.length > 0 ? response.data : simulatedData;
      } catch {
        return simulatedData;
      }
    },
  });

  return (
    <div className="container mx-auto p-4 bg-primary">
      <h1 className="text-2xl font-bold mb-4">{t('community.title')}</h1>
      <div className="space-y-4">
        {isLoading ? (
          <p>Cargando...</p>
        ) : (
          threads?.map((thread) => (
            <Card key={thread.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{thread.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p><strong>{t('community.author')}:</strong> {thread.author}</p>
                <Button variant="outline" className="mt-2">{t('community.messages')}</Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
export default CommunityPage;
