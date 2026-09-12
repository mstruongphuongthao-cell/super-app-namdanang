import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomeMenu } from './components/HomeMenu';
import { FaqSection } from './components/FaqSection';
import { AppDownloadSection } from './components/AppDownloadSection';
import { GameFlappySection } from './components/GameFlappySection';
import { DepositCalculatorSection } from './components/DepositCalculatorSection';
import { LoanCalculatorSection } from './components/LoanCalculatorSection';
import { ProminentProductsSection } from './components/ProminentProductsSection';
import { BranchLocationsSection } from './components/BranchLocationsSection';
import { Footer } from './components/Footer';
import { FeatureId } from './types';
import contentData from './data/contentData.json';
import { PhoneCall, MessageCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<FeatureId>('home');

  // Scroll to top whenever tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-red-500 selection:text-white">
      {/* Header */}
      <Header activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'home' && (
          <HomeMenu onSelectFeature={(tab) => setActiveTab(tab)} />
        )}

        {activeTab === 'faq' && (
          <FaqSection onBackToHome={() => setActiveTab('home')} />
        )}

        {activeTab === 'download-app' && (
          <AppDownloadSection onBackToHome={() => setActiveTab('home')} />
        )}

        {activeTab === 'game' && (
          <GameFlappySection onBackToHome={() => setActiveTab('home')} />
        )}

        {activeTab === 'deposit-calc' && (
          <DepositCalculatorSection onBackToHome={() => setActiveTab('home')} />
        )}

        {activeTab === 'loan-calc' && (
          <LoanCalculatorSection onBackToHome={() => setActiveTab('home')} />
        )}

        {activeTab === 'prominent-products' && (
          <ProminentProductsSection onBackToHome={() => setActiveTab('home')} />
        )}

        {activeTab === 'branches' && (
          <BranchLocationsSection onBackToHome={() => setActiveTab('home')} />
        )}
      </main>

      {/* Floating Quick Advisor hotline button */}
      <aside aria-label="Hỗ trợ nhanh tại quầy" className="fixed bottom-5 right-5 z-40">
        <a
          id="floating-advisor-call-btn"
          href={`tel:${contentData.brand.advisor.phone}`}
          className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-[#ED1B2F] to-[#C71020] hover:from-red-600 hover:to-red-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all group scale-95 hover:scale-100"
          title={`Gọi Chuyên viên tư vấn ${contentData.brand.advisor.name}`}
        >
          <div className="relative">
            <PhoneCall className="w-5 h-5 animate-bounce" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full"></span>
          </div>
          <div className="text-left leading-tight hidden sm:block">
            <span className="block text-[10px] text-red-100 uppercase font-semibold">Tư vấn tại quầy</span>
            <span className="text-xs font-bold">{contentData.brand.advisor.name}</span>
          </div>
        </a>
      </aside>

      {/* Footer */}
      <Footer onSelectTab={setActiveTab} />
    </div>
  );
}
