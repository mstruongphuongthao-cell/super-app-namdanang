import React, { useState } from 'react';
import {
  KeyRound,
  CreditCard,
  ScanFace,
  Fingerprint,
  ChevronRight,
  ChevronLeft,
  Youtube,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  ArrowLeft,
  ExternalLink,
  MessageSquare,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import contentData from '../data/contentData.json';
import { FaqCategory } from '../types';

interface FaqSectionProps {
  onBackToHome: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onBackToHome }) => {
  const { faqData, brand } = contentData;
  const [selectedCategory, setSelectedCategory] = useState<FaqCategory | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'good' | 'need_help'>('idle');
  const [isSessionEnded, setIsSessionEnded] = useState<boolean>(false);

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'forgot-password':
        return <KeyRound className="w-6 h-6 text-amber-600" />;
      case 'close-card':
        return <CreditCard className="w-6 h-6 text-rose-600" />;
      case 'verify-cccd':
        return <Fingerprint className="w-6 h-6 text-[#004C97]" />;
      case 'biometrics':
        return <ScanFace className="w-6 h-6 text-emerald-600" />;
      default:
        return <KeyRound className="w-6 h-6 text-blue-600" />;
    }
  };

  const handleSelectCategory = (cat: FaqCategory) => {
    setSelectedCategory(cat);
    setCurrentStepIndex(0);
    setFeedbackStatus('idle');
    setIsSessionEnded(false);
  };

  const handleNextStep = () => {
    if (selectedCategory && currentStepIndex < selectedCategory.steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleEndSession = () => {
    setIsSessionEnded(true);
  };

  return (
    <div id="faq-section-container" className="space-y-6 animate-fadeIn">
      {/* Top Breadcrumb & Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <button
            id="faq-back-nav-btn"
            onClick={selectedCategory ? () => setSelectedCategory(null) : onBackToHome}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-[#004C97] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-xs font-semibold text-[#004C97] uppercase tracking-wider">
              Tính năng 01
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Giải đáp thắc mắc khách hàng
            </h1>
          </div>
        </div>

        {selectedCategory && (
          <button
            id="faq-change-topic-btn"
            onClick={() => setSelectedCategory(null)}
            className="text-xs font-semibold text-[#004C97] bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
          >
            Chọn câu hỏi khác
          </button>
        )}
      </div>

      {/* Main Question & 4 Cards List View */}
      {!selectedCategory && !isSessionEnded && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5 text-center">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              {faqData.question}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Chọn một chủ đề bên dưới để xem hướng dẫn từng bước chi tiết kèm hình ảnh minh họa và video
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {faqData.categories.map((cat, idx) => (
              <button
                key={cat.id}
                id={`faq-card-${cat.id}`}
                onClick={() => handleSelectCategory(cat as FaqCategory)}
                className="group text-left p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#004C97] hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center group-hover:scale-105 transition-transform border border-slate-100">
                      {getCategoryIcon(cat.id)}
                    </div>
                    <span className="text-xs font-bold text-slate-400">0{idx + 1}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#004C97] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                    {cat.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#004C97]">
                  <span>{cat.steps.length} bước thực hiện</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step-by-Step Instruction View */}
      {selectedCategory && !isSessionEnded && (
        <div className="space-y-6">
          {/* Active Topic Banner */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-[#004C97] uppercase">
                  Hướng dẫn chi tiết
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  {selectedCategory.title}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">{selectedCategory.desc}</p>
              </div>

              {/* YouTube Video Navigation Link */}
              <a
                id="faq-youtube-link-btn"
                href={selectedCategory.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors shrink-0"
              >
                <Youtube className="w-4 h-4" />
                <span>Xem video hướng dẫn trên YouTube</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            </div>

            {/* Step Indicators */}
            <div className="mt-6 flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {selectedCategory.steps.map((s, idx) => (
                <button
                  key={s.step}
                  onClick={() => {
                    setCurrentStepIndex(idx);
                    setFeedbackStatus('idle');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                    idx === currentStepIndex
                      ? 'bg-[#004C97] text-white shadow-xs'
                      : idx < currentStepIndex
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Bước {s.step}
                </button>
              ))}
            </div>
          </div>

          {/* Current Step Content Card */}
          {selectedCategory.steps[currentStepIndex] && (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs grid grid-cols-1 lg:grid-cols-12">
              {/* Left Column: Step Description & Instructions */}
              <div className="p-6 lg:col-span-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-[#004C97] text-xs font-bold rounded-full mb-3">
                    <span>Bước {selectedCategory.steps[currentStepIndex].step} trên {selectedCategory.steps.length}</span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">
                    {selectedCategory.steps[currentStepIndex].title}
                  </h3>

                  <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-sm sm:text-base text-slate-800 leading-relaxed whitespace-pre-line font-medium">
                      {selectedCategory.steps[currentStepIndex].desc}
                    </p>
                  </div>

                  <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      Lưu ý: Mọi giao dịch và thông tin OTP là bảo mật, tuyệt đối không chia sẻ mã OTP cho người khác.
                    </span>
                  </div>
                </div>

                {/* Step Navigation Controls */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    id="faq-step-prev-btn"
                    onClick={handlePrevStep}
                    disabled={currentStepIndex === 0}
                    className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 disabled:opacity-40 disabled:pointer-events-none hover:bg-slate-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Bước trước</span>
                  </button>

                  <span className="text-xs text-slate-500 font-medium">
                    {currentStepIndex + 1} / {selectedCategory.steps.length}
                  </span>

                  <button
                    id="faq-step-next-btn"
                    onClick={handleNextStep}
                    disabled={currentStepIndex === selectedCategory.steps.length - 1}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#004C97] text-white rounded-xl text-xs font-semibold disabled:opacity-40 disabled:pointer-events-none hover:bg-blue-800"
                  >
                    <span>Bước kế tiếp</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right Column: Step Image */}
              <div className="p-6 lg:col-span-6 bg-slate-50 flex flex-col items-center justify-center min-h-[380px]">
                <div className="w-full max-w-sm rounded-xl overflow-hidden border border-slate-200 bg-white shadow-xs p-2">
                  <div className="text-[11px] text-slate-400 font-medium text-center pb-2">
                    Hình ảnh minh họa bước {selectedCategory.steps[currentStepIndex].step}
                  </div>
                  <img
                    src={selectedCategory.steps[currentStepIndex].image}
                    alt={`Minh họa bước ${selectedCategory.steps[currentStepIndex].step}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-auto max-h-[360px] object-contain rounded-lg mx-auto"
                    onError={(e) => {
                      // Fallback if network blocks specific CDN image
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80';
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Feedback & Satisfaction Flow (Mandated in PDF 1) */}
          <div
            id="faq-feedback-flow-box"
            className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4"
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#004C97]" />
              <h4 className="text-sm sm:text-base font-bold text-slate-900">
                Anh/chị thực hiện ổn hay chưa?
              </h4>
            </div>

            {feedbackStatus === 'idle' && (
              <div className="flex flex-wrap gap-3">
                <button
                  id="faq-btn-feedback-good"
                  onClick={() => setFeedbackStatus('good')}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-colors shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Đã ổn, tôi làm được rồi!</span>
                </button>

                <button
                  id="faq-btn-feedback-need-help"
                  onClick={() => setFeedbackStatus('need_help')}
                  className="px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-colors"
                >
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>Chưa ổn, cần hỗ trợ thêm</span>
                </button>
              </div>
            )}

            {/* When customer says Good */}
            {feedbackStatus === 'good' && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3 animate-fadeIn">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Tuyệt vời! Cảm ơn Quý khách đã thao tác thành công.</span>
                </div>
                <p className="text-xs text-emerald-700">
                  Quý khách có thể quay lại danh mục chính để tra cứu thêm các dịch vụ khác hoặc kết thúc phiên giao dịch.
                </p>
              </div>
            )}

            {/* When customer says Need Help (Strictly required in PDF 1) */}
            {feedbackStatus === 'need_help' && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-3 animate-fadeIn">
                <div className="flex items-start gap-2 text-amber-900 font-medium text-xs sm:text-sm leading-relaxed">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <span>{brand.advisor.supportMessage}</span>
                </div>
                <div className="pt-2">
                  <a
                    id="faq-call-advisor-btn"
                    href={`tel:${brand.advisor.phone}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#ED1B2F] text-white rounded-xl text-xs font-semibold hover:bg-red-700 shadow-xs transition-colors"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Gọi Chuyên viên {brand.advisor.name} ({brand.advisor.phone})</span>
                  </a>
                </div>
              </div>
            )}

            {/* Action Buttons: "Quay lại menu chính" and "Kết thúc cuộc trò chuyện" */}
            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100">
              <button
                id="faq-btn-back-menu"
                onClick={onBackToHome}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Quay lại menu chính</span>
              </button>

              <button
                id="faq-btn-end-session"
                onClick={handleEndSession}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Kết thúc cuộc trò chuyện
              </button>
            </div>
          </div>
        </div>
      )}

      {/* End of Session Farewell Message (Strictly required in PDF 1) */}
      {isSessionEnded && (
        <div
          id="faq-farewell-card"
          className="p-8 bg-gradient-to-br from-blue-50 via-white to-slate-50 border border-blue-200 rounded-2xl text-center space-y-4 shadow-sm animate-fadeIn"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8" />
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
            {brand.advisor.farewellMessage}
          </h3>

          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Rất hân hạnh được phục vụ Quý khách tại {brand.fullName} - {brand.branchName}.
          </p>

          <div className="pt-4 flex justify-center gap-3">
            <button
              id="farewell-back-home-btn"
              onClick={onBackToHome}
              className="px-5 py-2.5 bg-[#004C97] hover:bg-blue-800 text-white font-semibold rounded-xl text-xs transition-colors"
            >
              Về màn hình chính
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
