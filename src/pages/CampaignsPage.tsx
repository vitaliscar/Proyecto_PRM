import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import api from '@/services/api';

interface CampaignFormData {
  name: string;
  channel: string;
  content: string;
}

const CampaignsPage: React.FC = () => {
  const { t } = useTranslation();
  const form = useForm<CampaignFormData>({
    defaultValues: {
      name: '',
      channel: 'email',
      content: '',
    },
  });

  const onSubmit = async (data: CampaignFormData) => {
    try {
      await api.post('/marketing/campaigns/', data);
      form.reset();
      alert('Campaña creada con éxito');
    } catch (error) {
      alert('Error al crear la campaña');
    }
  };

  return (
    <div className="container mx-auto p-4 bg-primary">
      <h1 className="text-2xl font-bold mb-4">{t('marketing.campaigns.title')}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('marketing.campaigns.name')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="channel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('marketing.campaigns.channel')}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un canal" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="email">Correo</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('marketing.campaigns.content')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">{t('marketing.campaigns.submit')}</Button>
        </form>
      </Form>
    </div>
  );
};

export default CampaignsPage;
