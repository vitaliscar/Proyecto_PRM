import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import LeadsPage from './pages/LeadsPage';
import CampaignsPage from './pages/CampaignsPage';
import InvoicesPage from './pages/InvoicesPage';
import PaymentsPage from './pages/PaymentsPage';
import ReportsPage from './pages/ReportsPage';
import ResourcesPage from './pages/ResourcesPage';
import CommunityPage from './pages/CommunityPage';
import TelehealthPage from './pages/TelehealthPage';
import GamificationPage from './pages/GamificationPage';
import ProgressPage from './pages/ProgressPage';
import './i18n';
import './styles/index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2, staleTime: 5 * 60 * 1000, cacheTime: 10 * 60 * 1000 },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/marketing/leads" element={<LeadsPage />} />
          <Route path="/marketing/campaigns" element={<CampaignsPage />} />
          <Route path="/billing/invoices" element={<InvoicesPage />} />
          <Route path="/billing/payments" element={<PaymentsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/telehealth/:id" element={<TelehealthPage />} />
          <Route path="/gamification" element={<GamificationPage />} />
          <Route path="/progress/:id" element={<ProgressPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
