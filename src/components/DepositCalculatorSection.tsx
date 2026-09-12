import React, { useState, useId } from 'react';
import {
  PiggyBank,
  ArrowLeft,
  DollarSign,
  Calendar,
  Percent,
  TrendingUp,
  AlertCircle,
  ExternalLink,
  Video,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import contentData from '../data/contentData.json';
import { formatVND, formatNumber, parseNumberInput } from '../utils/formatters';

interface DepositCalculatorSectionProps {
  onBackToHome: () => void;
}

export const DepositCalculatorSection: React.FC<DepositCalculatorSectionProps> = ({ onBackToHome }) => {
  const { depositCalculator, brand } = contentData;
  const depositAmountInputId = useId();
  const depositTermSelectId = useId();
  const depositRateInputId = useId();

  // State
  const [amount, setAmount] = useState<number>(depositCalculator.defaultAmount);
  const [rawAmountInput, setRawAmountInput] = useState<string>(formatNumber(depositCalculator.defaultAmount));
  const [selectedTermMonths, setSelectedTermMonths] = useState<number>(12);
  const [rate, setRate] = useState<number>(4.8);
  const [isCustomRate, setIsCustomRate] = useState<boolean>(false);

  // Errors
  const [errors, setErrors] = useState<{ amount?: string; term?: string; rate?: string }>({});

  // When amount input changes
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const parsed = parseNumberInput(val);
    setAmount(parsed);
    setRawAmountInput(parsed > 0 ? formatNumber(parsed) : '');

    if (parsed <= 0) {
      setErrors((prev) => ({ ...prev, amount: depositCalculator.validationErrors.amount }));
    } else if (parsed < depositCalculator.minAmount) {
      setErrors((prev) => ({
        ...prev,
        amount: `Số tiền gửi tối thiểu là ${formatVND(depositCalculator.minAmount)}.`
      }));
    } else {
      setErrors((prev) => ({ ...prev, amount: undefined }));
    }
  };

  // When term changes
  const handleTermChange = (months: number) => {
    setSelectedTermMonths(months);
    setErrors((prev) => ({ ...prev, term: undefined }));

    // Auto-update interest rate if not overridden by user
    if (!isCustomRate) {
      const termConfig = depositCalculator.terms.find((t) => t.months === months);
      if (termConfig) {
        setRate(termConfig.rate);
      }
    }
  };

  // When rate changes
  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setIsCustomRate(true);
    if (isNaN(val) || val < 0 || val > 20) {
      setRate(isNaN(val) ? 0 : val);
      setErrors((prev) => ({ ...prev, rate: depositCalculator.validationErrors.rate }));
    } else {
      setRate(val);
      setErrors((prev) => ({ ...prev, rate: undefined }));
    }
  };

  // Formula: Tiền lãi = Số tiền gửi * (Lãi suất / 100) * (Số tháng / 12)
  const calculateInterest = () => {
    if (amount <= 0 || rate < 0 || !selectedTermMonths) return 0;
    return (amount * (rate / 100) * selectedTermMonths) / 12;
  };

  const calculatedInterest = calculateInterest();
  const totalReceived = amount + calculatedInterest;

  return (
    <div id="deposit-calc-container" className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <button
          id="deposit-back-btn"
          onClick={onBackToHome}
          className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-[#004C97] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <span className="text-xs font-semibold text-[#004C97] uppercase tracking-wider">
            Tính năng 04
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            {depositCalculator.title}
          </h1>
          <p className="text-xs text-slate-500">{depositCalculator.subTitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Inputs */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <PiggyBank className="w-5 h-5 text-[#004C97]" />
              <span>Nhập thông tin tiền gửi</span>
            </h2>

            <button
              id="deposit-reset-btn"
              onClick={() => {
                setAmount(depositCalculator.defaultAmount);
                setRawAmountInput(formatNumber(depositCalculator.defaultAmount));
                setSelectedTermMonths(12);
                setRate(4.8);
                setIsCustomRate(false);
                setErrors({});
              }}
              className="text-xs text-slate-500 hover:text-[#004C97] flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Đặt lại</span>
            </button>
          </div>

          {/* Input 1: Số tiền gửi */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor={depositAmountInputId} className="text-xs font-bold text-slate-700">
                Tổng tiền gửi (VND) <span className="text-red-500">*</span>
              </label>
              <span className="text-xs font-mono font-semibold text-[#004C97]">
                {formatVND(amount)}
              </span>
            </div>

            <div className="relative">
              <input
                id={depositAmountInputId}
                type="text"
                inputMode="numeric"
                value={rawAmountInput}
                onChange={handleAmountChange}
                placeholder="Nhập số tiền gửi (ví dụ: 100.000.000)"
                className={`w-full px-4 py-3 bg-slate-50 rounded-xl border text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#004C97] focus:bg-white transition-all ${
                  errors.amount ? 'border-red-400 bg-red-50/50' : 'border-slate-200'
                }`}
              />
              <span className="absolute right-4 top-3 text-xs font-bold text-slate-400">
                VND
              </span>
            </div>

            {errors.amount && (
              <p className="text-xs text-red-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.amount}</span>
              </p>
            )}

            {/* Quick Amount Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[50000000, 100000000, 200000000, 500000000, 1000000000].map((quickAmt) => (
                <button
                  key={quickAmt}
                  type="button"
                  onClick={() => {
                    setAmount(quickAmt);
                    setRawAmountInput(formatNumber(quickAmt));
                    setErrors((prev) => ({ ...prev, amount: undefined }));
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    amount === quickAmt
                      ? 'bg-[#004C97] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {quickAmt >= 1000000000 ? `${quickAmt / 1000000000} Tỷ` : `${quickAmt / 1000000} Triệu`}
                </button>
              ))}
            </div>
          </div>

          {/* Input 2: Kỳ hạn gửi */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor={depositTermSelectId} className="text-xs font-bold text-slate-700">
                Kỳ hạn gửi <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-slate-500">
                Đã chọn: <strong className="text-slate-800">{selectedTermMonths} tháng</strong>
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
              {depositCalculator.terms.map((t) => (
                <button
                  key={t.months}
                  type="button"
                  onClick={() => handleTermChange(t.months)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    selectedTermMonths === t.months
                      ? 'border-[#004C97] bg-blue-50/70 text-[#004C97] font-bold shadow-xs'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700 font-medium'
                  }`}
                >
                  <div className="text-xs">{t.label}</div>
                  <div className="text-[11px] text-slate-500 font-semibold mt-0.5">
                    {t.rate}%/năm
                  </div>
                </button>
              ))}
            </div>
            {errors.term && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.term}</span>
              </p>
            )}
          </div>

          {/* Input 3: Lãi suất */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor={depositRateInputId} className="text-xs font-bold text-slate-700">
                Lãi suất áp dụng (%/năm) <span className="text-red-500">*</span>
              </label>
              {isCustomRate && (
                <button
                  onClick={() => {
                    setIsCustomRate(false);
                    const t = depositCalculator.terms.find((x) => x.months === selectedTermMonths);
                    if (t) setRate(t.rate);
                  }}
                  className="text-[11px] text-[#004C97] underline font-semibold"
                >
                  Dùng lãi suất niêm yết
                </button>
              )}
            </div>

            <div className="relative">
              <input
                id={depositRateInputId}
                type="number"
                step="0.05"
                min="0"
                max="20"
                value={rate}
                onChange={handleRateChange}
                className={`w-full px-4 py-3 bg-slate-50 rounded-xl border text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#004C97] focus:bg-white transition-all ${
                  errors.rate ? 'border-red-400 bg-red-50' : 'border-slate-200'
                }`}
              />
              <span className="absolute right-4 top-3 text-xs font-bold text-slate-400">
                %/năm
              </span>
            </div>
            {errors.rate && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.rate}</span>
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Calculation Results (Mandated UI layout from PDF 2) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-[#004C97] to-[#003366] text-white rounded-2xl p-6 shadow-md space-y-6">
            <div className="flex items-center justify-between border-b border-white/15 pb-4">
              <div>
                <span className="text-xs text-blue-200 font-semibold uppercase">
                  Kết quả dự tính
                </span>
                <h3 className="text-lg font-bold">Tiền gửi thông thường trả lãi sau</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
            </div>

            {/* Tiền gửi dự tính */}
            <div className="space-y-4">
              <div className="p-4 bg-white/10 rounded-xl border border-white/15">
                <span className="text-xs text-blue-200 block">Số tiền gửi ban đầu:</span>
                <span className="text-lg font-bold font-mono tracking-tight text-white">
                  {formatVND(amount)}
                </span>
              </div>

              {/* Tiền lãi dự tính */}
              <div className="p-4 bg-white/10 rounded-xl border border-white/15">
                <span className="text-xs text-blue-200 block">Số tiền lãi dự tính:</span>
                <span className="text-2xl font-extrabold font-mono text-emerald-300">
                  {formatVND(calculatedInterest)}
                </span>
                <span className="block text-[11px] text-blue-200 mt-1">
                  Kỳ hạn {selectedTermMonths} tháng • Lãi suất {rate}%/năm
                </span>
              </div>

              {/* Tổng tiền khi đáo hạn */}
              <div className="p-4 bg-emerald-500/20 rounded-xl border border-emerald-400/40">
                <span className="text-xs text-emerald-200 block">Tổng tiền thực nhận (Gốc + Lãi):</span>
                <span className="text-2xl font-extrabold font-mono text-white">
                  {formatVND(totalReceived)}
                </span>
              </div>
            </div>

            {/* Note & Advisor Reminder */}
            <div className="pt-2 text-[11px] text-blue-200/80 leading-relaxed border-t border-white/10">
              * Kết quả tính toán mang tính chất tham khảo. Lãi suất thực tế có thể được cộng thêm ưu đãi khi gửi online qua VietinBank iPay hoặc theo quy định từng thời kỳ.
            </div>
          </div>

          {/* Video hướng dẫn gửi tiết kiệm (from PDF 2) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Video className="w-4 h-4 text-rose-600" />
              <span>Video hướng dẫn gửi tiết kiệm VietinBank</span>
            </div>
            <p className="text-xs text-slate-500">
              Xem video hướng dẫn chi tiết các mẹo tối ưu hóa tiền gửi tiết kiệm và mở sổ online:
            </p>
            <a
              id="deposit-guide-video-link"
              href={depositCalculator.guideVideoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors w-full justify-center"
            >
              <Video className="w-4 h-4 text-emerald-400" />
              <span>Xem video trên TikTok @nguyentrangtkneu</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
