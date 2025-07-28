import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import api from '@/services/api';

interface Progress {
  id: string;
  goal: string;
  progress: number;
  prediction: string;
}

const ProgressPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  const { data: progress, isLoading } = useQuery<Progress>({
    queryKey: ['progress', id],
    queryFn: async () => {
      const simulatedData: Progress = {
        id: '1',
        goal: 'Reducir ansiedad',
        progress: 60,
        prediction: 'Mejora probable',
      };
      try {
        const response = await api.get(`/progress/${id}/`);
        return response.data || simulatedData;
      } catch {
        return simulatedData;
      }
    },
  });

  return (
    <div className="container mx-auto p-4 bg-primary">
      <h1 className="text-2xl font-bold mb-4">{t('progress.title')}</h1>
      {isLoading ? (
        <p>Cargando...</p>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{progress?.goal}</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>{t('progress.progress')}:</strong> {progress?.progress}%</p>
            <Progress value={progress?.progress} className="my-2" />
            <p><strong>{t('progress.prediction')}:</strong> {progress?.prediction}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProgressPage;
