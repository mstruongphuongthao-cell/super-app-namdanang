import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Smartphone,
  Apple,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Zap,
  Gift,
  QrCode
} from 'lucide-react';
import contentData from '../data/contentData.json';

interface AppDownloadSectionProps {
  onBackToHome: () => void;
}

export const AppDownloadSection: React.FC<AppDownloadSectionProps> = ({ onBackToHome }) => {
  const { appDownload, brand } = contentData;
  const [selectedPlatform, setSelectedPlatform] = useState<'both' | 'ios' | 'android'>('both');

  return (
    <div id="app-download-container" className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <button
          id="download-back-btn"
          onClick={onBackToHome}
          className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-[#004C97] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <span className="text-xs font-semibold text-[#004C97] uppercase tracking-wider">
            Tính năng 02
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Tải App VietinBank iPay
          </h1>
        </div>
      </div>

      {/* Hero Overview */}
      <div className="bg-gradient-to-br from-[#004C97] via-[#003B73] to-[#002447] text-white p-6 sm:p-8 rounded-2xl shadow-sm">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-cyan-200 text-xs font-semibold mb-3">
            <Smartphone className="w-4 h-4" />
            <span>Ngân hàng số vạn năng</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold">{appDownload.title}</h2>
          <p className="mt-2 text-xs sm:text-sm text-blue-100 leading-relaxed">
            {appDownload.description}
          </p>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-blue-100 font-medium">
            {appDownload.highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Filter Selector */}
      <div className="flex justify-center gap-2">
        <button
          id="btn-filter-all"
          onClick={() => setSelectedPlatform('both')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            selectedPlatform === 'both'
              ? 'bg-[#004C97] text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Tất cả thiết bị
        </button>
        <button
          id="btn-filter-ios"
          onClick={() => setSelectedPlatform('ios')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
            selectedPlatform === 'ios'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Apple className="w-4 h-4" />
          <span>iPhone / iPad</span>
        </button>
        <button
          id="btn-filter-android"
          onClick={() => setSelectedPlatform('android')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
            selectedPlatform === 'android'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Điện thoại Android</span>
        </button>
      </div>

      {/* Download QR Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* iOS Card */}
        {(selectedPlatform === 'both' || selectedPlatform === 'ios') && (
          <div
            id="ios-download-card"
            className="p-6 bg-white border border-slate-200 rounded-2xl shadow-2xs hover:shadow-md transition-all flex flex-col items-center text-center space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
              <Apple className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                {appDownload.ios.platform}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Quét mã QR bằng Camera của iPhone để mở App Store
              </p>
            </div>

            {/* QR Code */}
            <div className="p-4 bg-white border-2 border-slate-100 rounded-2xl shadow-inner inline-block">
              <QRCodeSVG
                value={appDownload.ios.url}
                size={180}
                level="H"
                includeMargin={true}
              />
            </div>

            <div className="w-full pt-2">
              <a
                id="btn-link-appstore"
                href={appDownload.ios.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                <Apple className="w-4 h-4" />
                <span>{appDownload.ios.badge}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            </div>
          </div>
        )}

        {/* Android Card */}
        {(selectedPlatform === 'both' || selectedPlatform === 'android') && (
          <div
            id="android-download-card"
            className="p-6 bg-white border border-slate-200 rounded-2xl shadow-2xs hover:shadow-md transition-all flex flex-col items-center text-center space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center">
              <Smartphone className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                {appDownload.android.platform}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Quét mã QR bằng Máy ảnh / Zalo / Google Lens để mở CH Play
              </p>
            </div>

            {/* QR Code */}
            <div className="p-4 bg-white border-2 border-slate-100 rounded-2xl shadow-inner inline-block">
              <QRCodeSVG
                value={appDownload.android.url}
                size={180}
                level="H"
                includeMargin={true}
              />
            </div>

            <div className="w-full pt-2">
              <a
                id="btn-link-googleplay"
                href={appDownload.android.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                <Smartphone className="w-4 h-4" />
                <span>{appDownload.android.badge}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Activation Steps Guide */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#004C97]" />
          <span>3 bước đơn giản kích hoạt tại quầy giao dịch</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80">
            <span className="font-bold text-[#004C97] block text-sm mb-1">1. Tải & Mở ứng dụng</span>
            <p className="text-slate-600">Quét mã QR ở trên để cài đặt VietinBank iPay chính thức.</p>
          </div>
          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80">
            <span className="font-bold text-[#004C97] block text-sm mb-1">2. Đăng nhập / Đăng ký</span>
            <p className="text-slate-600">Nhập số điện thoại đã đăng ký tại VietinBank hoặc eKYC mở tài khoản.</p>
          </div>
          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80">
            <span className="font-bold text-[#004C97] block text-sm mb-1">3. Cán bộ quầy hỗ trợ</span>
            <p className="text-slate-600">Nếu cần hỗ trợ mã kích hoạt, cán bộ quầy sẽ duyệt ngay trong 30 giây.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
