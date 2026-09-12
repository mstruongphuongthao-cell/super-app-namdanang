import React, { useState, useMemo, useId } from 'react';
import {
  Calculator,
  ArrowLeft,
  Calendar,
  DollarSign,
  Percent,
  Clock,
  TrendingDown,
  X,
  FileSpreadsheet,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import contentData from '../data/contentData.json';
import { formatVND, formatNumber, parseNumberInput, formatDateVN } from '../utils/formatters';
import { LoanRepaymentRow } from '../types';

interface LoanCalculatorSectionProps {
  onBackToHome: () => void;
}

export const LoanCalculatorSection: React.FC<LoanCalculatorSectionProps> = ({ onBackToHome }) => {
  const { loanCalculator, brand } = contentData;
  const loanCollateralInputId = useId();
  const loanAmountInputId = useId();
  const loanTenureInputId = useId();
  const loanRateInputId = useId();
  const loanDisburseDateInputId = useId();
  const loanCycleSelectId = useId();
  const loanDueDaySelectId = useId();

  // Form Inputs (All inputs, NO sliders as strictly instructed in PDF 3)
  const [collateralValue, setCollateralValue] = useState<number>(loanCalculator.defaultCollateral);
  const [rawCollateralInput, setRawCollateralInput] = useState<string>(formatNumber(loanCalculator.defaultCollateral));

  const [loanAmount, setLoanAmount] = useState<number>(loanCalculator.defaultLoanAmount);
  const [rawLoanInput, setRawLoanInput] = useState<string>(formatNumber(loanCalculator.defaultLoanAmount));

  const [tenureMonths, setTenureMonths] = useState<number>(loanCalculator.defaultTenureMonths);
  const [annualRate, setAnnualRate] = useState<number>(loanCalculator.defaultRate);
  const [disbursementDate, setDisbursementDate] = useState<string>('2026-01-10');
  const [cycleId, setCycleId] = useState<string>('monthly');
  const [dueDayOfMonth, setDueDayOfMonth] = useState<number>(25);
  const [roundingUnit, setRoundingUnit] = useState<1 | 1000>(1);

  // Detail Modal view
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);

  // Selected cycle configuration
  const currentCycle = useMemo(() => {
    return loanCalculator.cycles.find((c) => c.id === cycleId) || loanCalculator.cycles[0];
  }, [cycleId, loanCalculator.cycles]);

  // Generate repayment schedule with diminishing balance logic (strictly from PDF 3)
  const scheduleData = useMemo(() => {
    if (loanAmount <= 0 || tenureMonths <= 0 || annualRate < 0) {
      return { rows: [], totalPrincipal: 0, totalInterest: 0, totalPayment: 0, numberOfPeriods: 0, firstPeriodPayment: 0 };
    }

    const periodMonths = currentCycle.periodMonths;
    const numberOfPeriods = Math.ceil(tenureMonths / periodMonths);
    const periodicRate = (annualRate / 100) / currentCycle.divisor;

    // Fixed principal per period
    const rawPrincipalPerPeriod = loanAmount / numberOfPeriods;
    const basePrincipal = roundingUnit === 1000
      ? Math.round(rawPrincipalPerPeriod / 1000) * 1000
      : Math.round(rawPrincipalPerPeriod);

    let remainingBalance = loanAmount;
    let totalPrincipalAcc = 0;
    let totalInterestAcc = 0;
    const rows: LoanRepaymentRow[] = [];

    // Parse disbursement date
    const [startYear, startMonth, startDay] = disbursementDate.split('-').map(Number);
    const disburseD = new Date(startYear, startMonth - 1, startDay);

    // Initial period 0 (Disbursement day)
    rows.push({
      period: 0,
      dueDate: formatDateVN(disburseD),
      openingBalance: remainingBalance,
      principal: 0,
      interest: 0,
      totalPayment: 0,
      closingBalance: remainingBalance
    });

    for (let p = 1; p <= numberOfPeriods; p++) {
      const openingBalance = remainingBalance;

      // Calculate next due date: Disburse month + p * periodMonths, with day set to dueDayOfMonth
      const nextDue = new Date(startYear, (startMonth - 1) + p * periodMonths, dueDayOfMonth);

      // Principal for this period (adjust last period for rounding errors)
      let periodPrincipal = basePrincipal;
      if (p === numberOfPeriods) {
        periodPrincipal = openingBalance; // Absorb remainder
      } else {
        periodPrincipal = Math.min(periodPrincipal, openingBalance);
      }

      // Interest for current period: Dư nợ đầu kỳ * Lãi suất kỳ
      let periodInterest = openingBalance * periodicRate;
      if (roundingUnit === 1000) {
        periodInterest = Math.round(periodInterest / 1000) * 1000;
      } else {
        periodPrincipal = Math.round(periodPrincipal);
        periodInterest = Math.round(periodInterest);
      }

      const totalPeriodPayment = periodPrincipal + periodInterest;
      remainingBalance = Math.max(0, openingBalance - periodPrincipal);

      totalPrincipalAcc += periodPrincipal;
      totalInterestAcc += periodInterest;

      rows.push({
        period: p,
        dueDate: formatDateVN(nextDue),
        openingBalance,
        principal: periodPrincipal,
        interest: periodInterest,
        totalPayment: totalPeriodPayment,
        closingBalance: remainingBalance
      });
    }

    const firstPeriodPayment = rows.length > 1 ? rows[1].totalPayment : 0;

    return {
      rows,
      totalPrincipal: totalPrincipalAcc,
      totalInterest: totalInterestAcc,
      totalPayment: totalPrincipalAcc + totalInterestAcc,
      numberOfPeriods,
      firstPeriodPayment
    };
  }, [loanAmount, tenureMonths, annualRate, currentCycle, disbursementDate, dueDayOfMonth, roundingUnit]);

  return (
    <div id="loan-calc-container" className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <button
          id="loan-back-btn"
          onClick={onBackToHome}
          className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-[#004C97] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <span className="text-xs font-semibold text-[#004C97] uppercase tracking-wider">
            Tính năng 05
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            {loanCalculator.title}
          </h1>
          <p className="text-xs text-slate-500">{loanCalculator.subTitle}</p>
        </div>
      </div>

      {/* Main Grid: Form Inputs (Left) and High-level Summary (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: All Input Fields */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#004C97]" />
              <span>Thông tin khoản vay</span>
            </h2>
            <span className="text-xs px-2.5 py-1 bg-blue-50 text-[#004C97] font-semibold rounded-lg">
              Dư nợ giảm dần
            </span>
          </div>

          {/* 1. Giá trị Bất động sản / Tài sản đảm bảo */}
          <div className="space-y-1.5">
            <label htmlFor={loanCollateralInputId} className="text-xs font-bold text-slate-700">
              Giá trị bất động sản / Tài sản đảm bảo (VND)
            </label>
            <div className="relative">
              <input
                id={loanCollateralInputId}
                type="text"
                inputMode="numeric"
                value={rawCollateralInput}
                onChange={(e) => {
                  const val = parseNumberInput(e.target.value);
                  setCollateralValue(val);
                  setRawCollateralInput(val > 0 ? formatNumber(val) : '');
                }}
                placeholder="Ví dụ: 1.000.000.000"
                className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-[#004C97] focus:bg-white transition-all"
              />
              <span className="absolute right-4 top-2.5 text-xs font-bold text-slate-400">
                VND
              </span>
            </div>
            {collateralValue > 0 && loanAmount > 0 && (
              <span className="text-[11px] text-slate-500 block">
                Tỷ lệ vay / Giá trị tài sản (LTV): <strong>{Math.round((loanAmount / collateralValue) * 100)}%</strong>
              </span>
            )}
          </div>

          {/* 2. Số tiền vay (Text Input format as requested) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor={loanAmountInputId} className="text-xs font-bold text-slate-700">
                Số tiền vay <span className="text-red-500">*</span>
              </label>
              <span className="text-xs font-mono font-bold text-[#004C97]">
                {formatVND(loanAmount)}
              </span>
            </div>
            <div className="relative">
              <input
                id={loanAmountInputId}
                type="text"
                inputMode="numeric"
                value={rawLoanInput}
                onChange={(e) => {
                  const val = parseNumberInput(e.target.value);
                  setLoanAmount(val);
                  setRawLoanInput(val > 0 ? formatNumber(val) : '');
                }}
                placeholder="Nhập số tiền muốn vay (VND)"
                className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-[#004C97] focus:bg-white transition-all"
              />
              <span className="absolute right-4 top-2.5 text-xs font-bold text-slate-400">
                VND
              </span>
            </div>

            {/* Shortcut amount pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[200000000, 500000000, 1000000000, 2000000000, 3000000000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setLoanAmount(amt);
                    setRawLoanInput(formatNumber(amt));
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    loanAmount === amt
                      ? 'bg-[#004C97] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {amt >= 1000000000 ? `${amt / 1000000000} Tỷ` : `${amt / 1000000} Triệu`}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Thời gian vay & Lãi suất năm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor={loanTenureInputId} className="text-xs font-bold text-slate-700">
                Thời gian vay (Tháng) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id={loanTenureInputId}
                  type="number"
                  min="1"
                  max="360"
                  value={tenureMonths}
                  onChange={(e) => setTenureMonths(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-[#004C97] focus:bg-white"
                />
                <span className="absolute right-4 top-2.5 text-xs font-bold text-slate-400">
                  Tháng ({Math.round((tenureMonths / 12) * 10) / 10} năm)
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor={loanRateInputId} className="text-xs font-bold text-slate-700">
                Lãi suất (%/Năm) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id={loanRateInputId}
                  type="number"
                  step="0.1"
                  min="0"
                  max="30"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-[#004C97] focus:bg-white"
                />
                <span className="absolute right-4 top-2.5 text-xs font-bold text-slate-400">
                  %/Năm
                </span>
              </div>
            </div>
          </div>

          {/* 4. Ngày giải ngân, Chu kỳ trả nợ & Ngày trả định kỳ */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label htmlFor={loanDisburseDateInputId} className="text-xs font-bold text-slate-700">
                Ngày giải ngân
              </label>
              <input
                id={loanDisburseDateInputId}
                type="date"
                value={disbursementDate}
                onChange={(e) => setDisbursementDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#004C97]"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor={loanCycleSelectId} className="text-xs font-bold text-slate-700">
                Chu kỳ trả nợ
              </label>
              <select
                id={loanCycleSelectId}
                value={cycleId}
                onChange={(e) => setCycleId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#004C97]"
              >
                {loanCalculator.cycles.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.divisor === 12 ? 'Lãi/12' : `Lãi/${c.divisor}`})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor={loanDueDaySelectId} className="text-xs font-bold text-slate-700">
                Ngày trả định kỳ
              </label>
              <select
                id={loanDueDaySelectId}
                value={dueDayOfMonth}
                onChange={(e) => setDueDayOfMonth(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#004C97]"
              >
                {[1, 5, 10, 15, 20, 25, 28].map((day) => (
                  <option key={day} value={day}>
                    Ngày {day} hằng kỳ
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 5. Quy tắc làm tròn số (Mandated in PDF 3) */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-600">
            <span>Quy tắc làm tròn:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRoundingUnit(1)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  roundingUnit === 1
                    ? 'bg-[#004C97] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Tròn đến 1 đồng
              </button>
              <button
                type="button"
                onClick={() => setRoundingUnit(1000)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  roundingUnit === 1000
                    ? 'bg-[#004C97] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Tròn đến 1.000 đồng
              </button>
            </div>
          </div>
        </div>

        {/* Right Summary Card (As shown in PDF 3 screenshot) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-[#002447] text-white rounded-2xl p-6 shadow-md space-y-5">
            <div className="border-b border-white/10 pb-3">
              <span className="text-xs text-blue-300 font-semibold uppercase">
                Ước tính nghĩa vụ trả nợ
              </span>
              <h3 className="text-lg font-bold">Số tiền trả từng kỳ</h3>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 bg-white/10 rounded-xl">
                <span className="text-xs text-slate-300 block">Số tiền trả kỳ đầu (cao nhất):</span>
                <span className="text-2xl font-extrabold text-emerald-400 font-mono">
                  {formatVND(scheduleData.firstPeriodPayment)}
                </span>
                <span className="text-[11px] text-slate-300 block mt-0.5">
                  Gốc: {formatVND(scheduleData.rows[1]?.principal || 0)} + Lãi: {formatVND(scheduleData.rows[1]?.interest || 0)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-slate-400 block">Tổng số kỳ trả:</span>
                  <span className="text-sm font-bold text-white mt-1 block">
                    {scheduleData.numberOfPeriods} kỳ ({currentCycle.name})
                  </span>
                </div>

                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-slate-400 block">Tổng lãi phải trả:</span>
                  <span className="text-sm font-bold text-amber-300 mt-1 block font-mono">
                    {formatVND(scheduleData.totalInterest)}
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-white/10 rounded-xl border border-white/15">
                <span className="text-xs text-slate-300 block">Tổng gốc và lãi cả kỳ:</span>
                <span className="text-xl font-extrabold text-white font-mono">
                  {formatVND(scheduleData.totalPayment)}
                </span>
              </div>
            </div>

            {/* "Xem chi tiết" Button (Mandated in PDF 3) */}
            <button
              id="loan-btn-view-detail"
              onClick={() => setShowDetailModal(true)}
              className="w-full py-3.5 bg-gradient-to-r from-[#ED1B2F] to-[#C71020] hover:from-red-600 hover:to-red-800 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Xem chi tiết lịch trả nợ</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Principle explanation box */}
          <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 text-xs text-slate-700 space-y-1.5">
            <h4 className="font-bold text-[#004C97] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Nguyên tắc trả nợ giảm dần:</span>
            </h4>
            <p>• <strong>Gốc trả mỗi kỳ</strong> = Số tiền vay / Tổng số kỳ trả nợ (cố định mỗi kỳ).</p>
            <p>• <strong>Lãi mỗi kỳ</strong> = Dư nợ đầu kỳ × Lãi suất kỳ (giảm dần theo thời gian).</p>
            <p>• Giúp Quý khách tiết kiệm tổng chi phí lãi so với trả góp niên kim cố định.</p>
          </div>
        </div>
      </div>

      {/* DETAIL MODAL: Bảng tính lịch trả nợ với dư nợ giảm dần (PDF 3 Step 2) */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-2xl">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Bảng tính lịch trả nợ với dư nợ giảm dần
                </h3>
                <p className="text-xs text-slate-500">
                  Khoản vay: {formatVND(loanAmount)} • Thời hạn: {tenureMonths} tháng • Lãi suất: {annualRate}%/năm
                </p>
              </div>

              <button
                id="loan-modal-close-btn"
                onClick={() => setShowDetailModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Table Content */}
            <div className="p-4 overflow-y-auto flex-1 scrollbar-thin">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-800 text-white font-semibold uppercase tracking-wider">
                      <th className="py-3 px-3 rounded-tl-lg">Kỳ (Stt)</th>
                      <th className="py-3 px-3">Kỳ trả nợ</th>
                      <th className="py-3 px-3 text-right">Số gốc còn lại</th>
                      <th className="py-3 px-3 text-right">Gốc</th>
                      <th className="py-3 px-3 text-right">Lãi</th>
                      <th className="py-3 px-3 text-right rounded-tr-lg">Tổng Gốc + Lãi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {scheduleData.rows.map((r) => (
                      <tr
                        key={r.period}
                        className={r.period === 0 ? 'bg-blue-50/50 font-semibold' : 'hover:bg-slate-50'}
                      >
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-700">
                          {r.period}
                        </td>
                        <td className="py-2.5 px-3 text-slate-700">
                          {r.dueDate}
                          {r.period === 0 && <span className="text-[10px] text-blue-600 block">(Giải ngân)</span>}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-800 font-medium">
                          {formatNumber(r.openingBalance)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-800">
                          {r.principal > 0 ? formatNumber(r.principal) : '-'}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-amber-700">
                          {r.interest > 0 ? formatNumber(r.interest) : '-'}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-[#004C97]">
                          {r.totalPayment > 0 ? formatNumber(r.totalPayment) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  {/* Footer Totals Row (Strictly matching PDF 3 screenshot) */}
                  <tfoot>
                    <tr className="bg-slate-800 text-white font-bold text-xs">
                      <td colSpan={3} className="py-3 px-3 uppercase tracking-wider rounded-bl-lg">
                        TỔNG CỘNG
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-emerald-300">
                        {formatNumber(scheduleData.totalPrincipal)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-amber-300">
                        {formatNumber(scheduleData.totalInterest)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-cyan-300 rounded-br-lg">
                        {formatNumber(scheduleData.totalPayment)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-slate-500">
                Sai lệch số lẻ làm tròn đã được chuẩn hóa tự động vào kỳ cuối cùng ({scheduleData.numberOfPeriods}).
              </span>

              <button
                id="loan-modal-confirm-btn"
                onClick={() => setShowDetailModal(false)}
                className="px-5 py-2 bg-[#004C97] hover:bg-blue-800 text-white font-semibold rounded-xl transition-colors"
              >
                Đóng bảng tính
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
