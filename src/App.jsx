import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BusinessProvider } from './context/BusinessContext';
import { ToastProvider } from './context/ToastContext';
import AppLayout from './components/layout/AppLayout';

// Pages
import Overview from './pages/Overview';
import MyBusinesses from './pages/MyBusinesses';
import GoogleBusiness from './pages/GoogleBusiness';
import LocalSEO from './pages/LocalSEO';
import CompetitorAnalysis from './pages/CompetitorAnalysis';
import ReviewsManagement from './pages/ReviewsManagement';
import AIContentStudio from './pages/AIContentStudio';
import SocialMedia from './pages/SocialMedia';
import CampaignManager from './pages/CampaignManager';
import AnalyticsReports from './pages/AnalyticsReports';
import Integrations from './pages/Integrations';
import BillingSubscription from './pages/BillingSubscription';
import Settings from './pages/Settings';

export default function App() {
  return (
    <ToastProvider>
      <BusinessProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Overview />} />
              <Route path="businesses" element={<MyBusinesses />} />
              <Route path="google-business" element={<GoogleBusiness />} />
              <Route path="local-seo" element={<LocalSEO />} />
              <Route path="competitors" element={<CompetitorAnalysis />} />
              <Route path="reviews" element={<ReviewsManagement />} />
              <Route path="ai-studio" element={<AIContentStudio />} />
              <Route path="social-media" element={<SocialMedia />} />
              <Route path="campaigns" element={<CampaignManager />} />
              <Route path="analytics" element={<AnalyticsReports />} />
              <Route path="integrations" element={<Integrations />} />
              <Route path="billing" element={<BillingSubscription />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </HashRouter>
      </BusinessProvider>
    </ToastProvider>
  );
}
