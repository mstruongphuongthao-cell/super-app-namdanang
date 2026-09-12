import React from 'react';
import {
  MapPin,
  Clock,
  ExternalLink,
  Phone,
  Building2,
  ArrowLeft,
  Navigation,
  ShieldCheck
} from 'lucide-react';
import contentData from '../data/contentData.json';

interface BranchLocationsSectionProps {
  onBackToHome: () => void;
}

export const BranchLocationsSection: React.FC<BranchLocationsSectionProps> = ({ onBackToHome }) => {
  const { branchLocations } = contentData;

  return (
    <div id="branch-locations-container" className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <button
          id="branches-back-btn"
          onClick={onBackToHome}
          className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-[#004C97] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <span className="text-xs font-semibold text-[#004C97] uppercase tracking-wider">
            Tính năng 07
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            {branchLocations.title}
          </h1>
          <p className="text-xs text-slate-500">{branchLocations.subtitle}</p>
        </div>
      </div>

      {/* Working Hours Banner */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-white border border-blue-200 rounded-2xl p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#004C97] text-white flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Thời gian giao dịch phục vụ khách hàng
              </h3>
              <div className="mt-1 text-xs text-slate-600 space-y-0.5">
                <p>
                  <strong>{branchLocations.schedule.days}:</strong> {branchLocations.schedule.morning} | {branchLocations.schedule.afternoon}
                </p>
                <p className="text-amber-700 font-medium">
                  • {branchLocations.schedule.weekend}
                </p>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-emerald-800">
              Điểm giao dịch chuẩn quốc gia
            </span>
          </div>
        </div>
      </div>

      {/* List of 5 Branches (Cards with Image, Address, and Google Maps Button) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branchLocations.branches.map((b) => (
          <div
            key={b.stt}
            id={`branch-card-${b.stt}`}
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            {/* Real branch photo */}
            <div className="relative h-48 bg-slate-100 overflow-hidden">
              <img
                src={b.imageUrl}
                alt={b.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=600&auto=format&fit=crop&q=80';
                }}
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold rounded-lg flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-cyan-300" />
                <span>0{b.stt}</span>
              </div>
              {b.isHeadquarters && (
                <div className="absolute top-3 right-3 px-2.5 py-1 bg-[#ED1B2F] text-white text-[11px] font-bold rounded-lg shadow-sm">
                  Hội Sở Chi Nhánh
                </div>
              )}
            </div>

            {/* Branch info */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">
                  {b.name}
                </h3>

                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <MapPin className="w-4 h-4 text-[#ED1B2F] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{b.address}</span>
                </div>
              </div>

              {/* Google Maps link with Map Icon (Strictly mandated in PDF 1) */}
              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <a
                  id={`btn-map-link-${b.stt}`}
                  href={b.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#004C97] hover:bg-blue-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                >
                  <Navigation className="w-4 h-4 text-emerald-300" />
                  <span>Chỉ đường trên Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>

                {b.phone && (
                  <a
                    href={`tel:${b.phone}`}
                    className="inline-flex items-center justify-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 py-1"
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Điện thoại: {b.phone}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
