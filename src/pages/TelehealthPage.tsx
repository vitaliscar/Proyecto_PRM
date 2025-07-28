import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import api from '@/services/api';

interface Session {
  id: string;
  platform: string;
  link: string;
}

const TelehealthPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  const { data: session, isLoading } = useQuery<Session>({
    queryKey: ['session', id],
    queryFn: async () => {
      const simulatedData: Session = {
        id: '1',
        platform: 'Zoom',
        link: 'https://zoom.us/j/123',
      };
      try {
        const response = await api.get(`/telehealth/${id}/`);
        return response.data || simulatedData;
      } catch {
        return simulatedData;
      }
    },
  });

  return (
    <div className="container mx-auto p-4 bg-accent">
      <h1 className="text-2xl font-bold mb-4">{t('telehealth.title')}</h1>
      {isLoading ? (
        <p>Cargando...</p>
      ) : (
        <div className="text-center">
          <p><strong>Plataforma:</strong> {session?.platform}</p>
          <Button asChild className="mt-4 bg-accent hover:bg-accent/80">
            <a href={session?.link} target="_blank" rel="noopener noreferrer">
              {t('telehealth.join')}
            </a>
          </Button>
        </div>
      )}
    </div>
  );
};

export default TelehealthPage;
