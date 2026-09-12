import React from 'react';
import { Phone, Clock, Home, ArrowLeft } from 'lucide-react';
import contentData from '../data/contentData.json';
import { FeatureId } from '../types';

interface HeaderProps {
  activeTab: FeatureId;
  onSelectTab: (tab: FeatureId) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onSelectTab }) => {
  const { brand } = contentData;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Branch Name */}
          <div className="flex items-center gap-3">
            {activeTab !== 'home' && (
              <button
                id="btn-back-home"
                onClick={() => onSelectTab('home')}
                className="p-2 -ml-2 rounded-xl text-slate-600 hover:text-[#004C97] hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                title="Quay lại trang chủ"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline text-xs font-semibold">Trang chủ</span>
              </button>
            )}

            <button
              id="header-brand-logo"
              onClick={() => onSelectTab('home')}
              className="flex items-center gap-3 text-left focus:outline-hidden group"
            >
              <img
                src={brand.logoUrl}
                alt="VietinBank Logo"
                referrerPolicy="no-referrer"
                className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-102"
              />
              <div className="hidden sm:block border-l border-slate-200 pl-3">
                <p className="text-xs font-bold tracking-wider uppercase text-[#004C97]">
                  {brand.branchName}
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  Quầy Giao Dịch Số Thông Minh
                </p>
              </div>
            </button>
          </div>

          {/* Quick Counter Advisor & Working Hours */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Working hours indicator */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-800 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>07:30 - 16:30 (T2 - T6)</span>
            </div>

            {/* Quick Hotline to Advisor Trung */}
            <a
              id="header-advisor-contact"
              href={`tel:${brand.advisor.phone}`}
              className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-[#ED1B2F] to-[#C71020] text-white rounded-xl shadow-xs hover:shadow-md transition-all text-xs font-semibold"
            >
              <Phone className="w-4 h-4" />
              <div className="text-left leading-tight hidden xs:block">
                <span className="block text-[10px] text-red-100 font-normal">Tư vấn tại quầy</span>
                <span>{brand.advisor.name}</span>
              </div>
              <span className="xs:hidden">{brand.advisor.phone}</span>
            </a>
          </div>
        </div>

        {/* Feature Navigation Bar for Quick Jump */}
        <nav className="flex items-center gap-1.5 overflow-x-auto py-2.5 scrollbar-none border-t border-slate-100 text-xs">
          <button
            id="nav-tab-home"
            onClick={() => onSelectTab('home')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'home'
                ? 'bg-[#004C97] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-[#004C97]'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Tất cả tính năng</span>
          </button>

          {contentData.features.map((feature) => (
            <button
              key={feature.id}
              id={`nav-tab-${feature.id}`}
              onClick={() => onSelectTab(feature.id as FeatureId)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all flex items-center gap-1.5 ${
                activeTab === feature.id
                  ? 'bg-[#004C97] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-[#004C97]'
              }`}
            >
              <span>{feature.number}. {feature.title}</span>
              {feature.highlight && (
                <span className="px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-red-500 text-white">
                  Hot
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};
