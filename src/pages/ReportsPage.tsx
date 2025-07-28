import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar } from 'react-chartjs-2';
import api from '@/services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ReportData {
  labels: string[];
  data: number[];
}

const ReportsPage: React.FC = () => {
  const { t } = useTranslation();

  const { data: reportData, isLoading } = useQuery<ReportData>({
    queryKey: ['reports'],
    queryFn: async () => {
      const simulatedData: ReportData = {
        labels: ['Ene', 'Feb'],
        data: [10, 20],
      };
      try {
        const response = await api.get('/reports/');
        return response.data || simulatedData;
      } catch {
        return simulatedData;
      }
    },
  });

  const chartData = {
    labels: reportData?.labels || ['Ene', 'Feb'],
    datasets: [
      {
        label: t('reports.patients'),
        data: reportData?.data || [10, 20],
        backgroundColor: '#E8F5E9',
        borderColor: '#4B6CB7',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: t('reports.title') },
    },
  };

  return (
    <div className="container mx-auto p-4 bg-secondary">
      <h1 className="text-2xl font-bold mb-4">{t('reports.title')}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t('reports.patients')}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Cargando...</p>
          ) : (
            <Bar data={chartData} options={options} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
export default ReportsPage;
