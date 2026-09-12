import React from 'react';
import { Phone, MapPin, Clock, ShieldCheck, Heart } from 'lucide-react';
import contentData from '../data/contentData.json';
import { FeatureId } from '../types';

interface FooterProps {
  onSelectTab: (tab: FeatureId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  const { brand } = contentData;

  return (
    <footer className="mt-16 bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-xl font-extrabold text-white tracking-wider">
                VietinBank
              </span>
              <span className="text-xs px-2 py-0.5 bg-red-600 text-white font-bold rounded-md">
                Nam Đà Nẵng
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              {brand.fullName} • Chi nhánh Nam Đà Nẵng. Ứng dụng hỗ trợ trải nghiệm quầy số thông minh dành cho khách hàng giao dịch trực tiếp.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Bảo mật chuẩn ngân hàng nhà nước • Hỗ trợ tận tâm</span>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="space-y-2 text-xs">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Tiện ích quầy số
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button
                  onClick={() => onSelectTab('faq')}
                  className="hover:text-white transition-colors"
                >
                  1. Giải đáp thắc mắc khách hàng
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('download-app')}
                  className="hover:text-white transition-colors"
                >
                  2. Tải App VietinBank iPay
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('game')}
                  className="hover:text-white transition-colors"
                >
                  3. Mini Game nhận voucher xăng
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('deposit-calc')}
                  className="hover:text-white transition-colors"
                >
                  4. Tính lãi suất tiền gửi
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('loan-calc')}
                  className="hover:text-white transition-colors"
                >
                  5. Lịch trả nợ khoản vay
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('prominent-products')}
                  className="hover:text-white transition-colors"
                >
                  6. Sản phẩm dịch vụ nổi bật
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('branches')}
                  className="hover:text-white transition-colors"
                >
                  7. Mạng lưới điểm giao dịch
                </button>
              </li>
            </ul>
          </div>

          {/* Advisor Info */}
          <div className="space-y-2 text-xs">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Cán bộ tư vấn quầy
            </h4>
            <p className="text-slate-300 font-semibold">{brand.advisor.name}</p>
            <p className="text-slate-400">{brand.advisor.title}</p>
            <a
              href={`tel:${brand.advisor.phone}`}
              className="inline-flex items-center gap-1.5 text-red-400 font-bold hover:text-red-300 mt-1"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{brand.advisor.phone}</span>
            </a>
            <div className="pt-2 text-[11px] text-slate-500">
              Tổng đài VietinBank: 1900 558 868
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 VietinBank - Ngân hàng TMCP Công Thương Việt Nam. All rights reserved.</span>
          <span>Phục vụ khách hàng từ tâm • Nâng giá trị cuộc sống</span>
        </div>
      </div>
    </footer>
  );
};
