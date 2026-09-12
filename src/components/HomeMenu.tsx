import React from 'react';
import {
  HelpCircle,
  Smartphone,
  Gamepad2,
  PiggyBank,
  Calculator,
  Sparkles,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Gift,
  Clock,
  PhoneCall,
  ExternalLink,
} from 'lucide-react';
import contentData from '../data/contentData.json';
import { FeatureId } from '../types';

interface HomeMenuProps {
  onSelectFeature: (id: FeatureId) => void;
}

export const HomeMenu: React.FC<HomeMenuProps> = ({ onSelectFeature }) => {
  const { brand, features } = contentData;

  const advisorInitials = brand.advisor.name
    ? brand.advisor.name
        .split(' ')
        .filter(Boolean)
        .slice(-2)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'VB';

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'HelpCircle':
        return <HelpCircle className="w-6 h-6" />;
      case 'Smartphone':
        return <Smartphone className="w-6 h-6" />;
      case 'Gamepad2':
        return <Gamepad2 className="w-6 h-6" />;
      case 'PiggyBank':
        return <PiggyBank className="w-6 h-6" />;
      case 'Calculator':
        return <Calculator className="w-6 h-6" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6" />;
      case 'MapPin':
        return <MapPin className="w-6 h-6" />;
      default:
        return <ChevronRight className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner for Counter Tablet / Kiosk / Phone */}
      <section
        id="counter-welcome-banner"
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#004C97] via-[#003B73] to-[#002447] text-white p-6 sm:p-8 shadow-lg"
      >
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold backdrop-blur-md mb-4 text-cyan-200">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>Kính chào Quý khách đến với {brand.branchName}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            Quầy Giao Dịch Số Thông Minh
          </h1>
          <p className="mt-2 text-sm sm:text-base text-blue-100 max-w-2xl leading-relaxed">
            Hỗ trợ giải đáp nhanh các thủ tục ngân hàng số, tính toán lãi suất minh bạch,
            khám phá ưu đãi độc quyền và tham gia mini game nhận quà liền tay trong lúc chờ giao dịch.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              id="banner-btn-faq"
              onClick={() => onSelectFeature('faq')}
              className="px-4 py-2.5 bg-white text-[#004C97] font-semibold text-xs sm:text-sm rounded-xl shadow-xs hover:bg-blue-50 transition-all flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4 text-[#ED1B2F]" />
              <span>Giải đáp thắc mắc</span>
            </button>
            <button
              id="banner-btn-game"
              onClick={() => onSelectFeature('game')}
              className="px-4 py-2.5 bg-[#ED1B2F] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs hover:bg-red-700 transition-all flex items-center gap-2"
            >
              <Gift className="w-4 h-4" />
              <span>Chơi game nhận voucher xăng</span>
            </button>
          </div>
        </div>

        {/* Decorative background styling */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -top-16 right-1/4 w-60 h-60 bg-blue-400/10 rounded-full blur-2xl pointer-events-none"></div>
      </section>

      {/* Grid of 7 Core Features */}
      <section id="features-grid-section" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Danh mục tiện ích tại quầy
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Chạm vào bất kỳ tiện ích nào dưới đây để bắt đầu trải nghiệm
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-[#004C97] rounded-lg border border-blue-100">
            7 Tính năng
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((item) => {
            const isHighlighted = item.highlight;
            return (
              <button
                key={item.id}
                id={`feature-card-${item.id}`}
                onClick={() => onSelectFeature(item.id as FeatureId)}
                className={`group relative text-left p-5 rounded-2xl transition-all duration-200 border flex flex-col justify-between ${
                  isHighlighted
                    ? 'bg-gradient-to-br from-red-50/70 via-white to-blue-50/50 border-red-200 shadow-sm hover:shadow-md hover:border-red-400 ring-1 ring-red-100'
                    : 'bg-white border-slate-200/80 shadow-2xs hover:shadow-md hover:border-blue-300'
                }`}
              >
                {/* Header of card: Number Badge & Category Tag */}
                <div className="flex items-start justify-between gap-2">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                      isHighlighted
                        ? 'bg-red-100 text-[#ED1B2F]'
                        : item.id === 'game'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-blue-50 text-[#004C97]'
                    }`}
                  >
                    {getIcon(item.icon)}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                          isHighlighted
                            ? 'bg-[#ED1B2F] text-white'
                            : item.id === 'game'
                            ? 'bg-amber-500 text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    <span className="text-xs font-bold text-slate-300">
                      0{item.number}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="mt-4">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#004C97] transition-colors flex items-center gap-1.5">
                    <span>{item.title}</span>
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                    {item.shortDesc}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#004C97] group-hover:translate-x-0.5 transition-transform">
                  <span>Trải nghiệm ngay</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#004C97]" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Support & Counter Officer Info Card */}
      <section
        id="counter-advisor-card"
        className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs grid grid-cols-1 md:grid-cols-3 gap-6 items-center"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-[#004C97] flex items-center justify-center font-bold text-lg">
            {advisorInitials}
          </div>
          <div>
            <p className="text-xs font-bold text-[#004C97] uppercase tracking-wider">
              Cán bộ phụ trách quầy
            </p>
            <h4 className="text-sm font-bold text-slate-900">
              {brand.advisor.name}
            </h4>
            <p className="text-xs text-slate-500">{brand.advisor.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-6">
          <Clock className="w-5 h-5 text-slate-400 shrink-0" />
          <div className="text-xs text-slate-600">
            <span className="font-semibold text-slate-800">Giờ phục vụ:</span>{' '}
            {brand.operatingHours.morning} | {brand.operatingHours.afternoon}
          </div>
        </div>

        <div className="flex items-center justify-start md:justify-end gap-3 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-6">
          <a
            id="advisor-card-phone-link"
            href={`tel:${brand.advisor.phone}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            <PhoneCall className="w-4 h-4 text-emerald-400" />
            <span>Hotline: {brand.advisor.phone}</span>
          </a>
        </div>
      </section>
    </div>
  );
};
