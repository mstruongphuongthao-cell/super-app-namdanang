import React, { useState } from 'react';
import {
  Sparkles,
  ArrowLeft,
  Heart,
  ChevronLeft,
  ChevronRight,
  Gift,
  Star,
  CheckCircle2,
  PhoneCall,
  X,
  ExternalLink,
  Layers,
  LayoutGrid
} from 'lucide-react';
import contentData from '../data/contentData.json';
import { ProductItem } from '../types';

interface ProminentProductsSectionProps {
  onBackToHome: () => void;
}

export const ProminentProductsSection: React.FC<ProminentProductsSectionProps> = ({ onBackToHome }) => {
  const { prominentProducts, brand } = contentData;
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [activeCarouselIndex, setActiveCarouselIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [interestedProduct, setInterestedProduct] = useState<ProductItem | null>(null);

  // Filter products
  const filteredProducts = prominentProducts.items.filter((item) => {
    if (selectedFilter === 'all') return true;
    return item.category === selectedFilter;
  });

  const handleNextPoster = () => {
    if (filteredProducts.length === 0) return;
    setActiveCarouselIndex((prev) => (prev + 1) % filteredProducts.length);
  };

  const handlePrevPoster = () => {
    if (filteredProducts.length === 0) return;
    setActiveCarouselIndex((prev) => (prev - 1 + filteredProducts.length) % filteredProducts.length);
  };

  const activeItem = filteredProducts[activeCarouselIndex] || filteredProducts[0];

  return (
    <div id="prominent-products-container" className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <button
            id="products-back-btn"
            onClick={onBackToHome}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-[#004C97] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#ED1B2F] uppercase tracking-wider">
                Tính năng 06
              </span>
              <span className="px-2 py-0.5 bg-red-100 text-[#ED1B2F] rounded-full text-[10px] font-bold">
                {prominentProducts.badgeText}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              {prominentProducts.title}
            </h1>
          </div>
        </div>

        {/* View mode toggle (Carousel vs Grid) */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            id="btn-view-carousel"
            onClick={() => setViewMode('carousel')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'carousel'
                ? 'bg-white text-[#004C97] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Dạng Carousel</span>
          </button>
          <button
            id="btn-view-grid"
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'grid'
                ? 'bg-white text-[#004C97] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Xem tất cả</span>
          </button>
        </div>
      </div>

      {/* Category Filter Chips (Mandated in PDF 4: Tất cả | Cá nhân | Hộ kinh doanh | Doanh nghiệp | Ưu đãi...) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {prominentProducts.filterTabs.map((tab) => (
          <button
            key={tab.id}
            id={`filter-chip-${tab.id}`}
            onClick={() => {
              setSelectedFilter(tab.id);
              setActiveCarouselIndex(0);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedFilter === tab.id
                ? 'bg-[#004C97] text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Mode 1: CAROUSEL POSTER VIEW (Recommended in PDF 4) */}
      {viewMode === 'carousel' && activeItem && (
        <div className="relative bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[460px]">
            {/* Left Column: Poster Image */}
            <div className="md:col-span-7 bg-slate-950 flex items-center justify-center p-4 relative group">
              <img
                src={activeItem.imageUrl}
                alt={activeItem.title}
                referrerPolicy="no-referrer"
                className="max-h-[440px] w-auto max-w-full object-contain rounded-lg shadow-md transition-transform group-hover:scale-101"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80';
                }}
              />

              {/* Navigation overlay arrows */}
              <button
                id="carousel-prev-btn"
                onClick={handlePrevPoster}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-[#004C97] transition-all shadow-md"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                id="carousel-next-btn"
                onClick={handleNextPoster}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-[#004C97] transition-all shadow-md"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Right Column: Poster Info & Action */}
            <div className="md:col-span-5 p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 bg-blue-50 text-[#004C97] border border-blue-100 rounded-full text-xs font-semibold">
                    {activeItem.categoryName}
                  </span>
                  {activeItem.isHot && (
                    <span className="px-2 py-0.5 bg-red-50 text-red-600 border border-red-100 rounded-full text-[10px] font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-red-600" />
                      <span>Hot</span>
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-slate-900 leading-snug">
                  {activeItem.title}
                </h3>

                <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {activeItem.desc}
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                {/* Nút "Tôi quan tâm" (Mandated in PDF 4) */}
                <button
                  id={`btn-interest-${activeItem.id}`}
                  onClick={() => setInterestedProduct(activeItem)}
                  className="w-full py-3.5 bg-gradient-to-r from-[#ED1B2F] to-[#C71020] hover:from-red-600 hover:to-red-800 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>Tôi quan tâm sản phẩm này</span>
                </button>

                {/* Counter index indicator */}
                <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span>Poster {activeCarouselIndex + 1} / {filteredProducts.length}</span>
                  <span className="text-[11px] text-slate-500">Chạm hoặc lướt mũi tên để xem tiếp</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: GRID VIEW */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="bg-slate-900 p-4 h-64 flex items-center justify-center relative">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="max-h-full w-auto object-contain rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80';
                  }}
                />
                <span className="absolute top-3 left-3 px-2 py-0.5 bg-white/90 text-slate-900 font-bold text-[10px] rounded-md backdrop-blur-xs">
                  {item.categoryName}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-500 line-clamp-3">
                    {item.desc}
                  </p>
                </div>

                <button
                  id={`grid-btn-interest-${item.id}`}
                  onClick={() => setInterestedProduct(item)}
                  className="w-full py-2.5 bg-[#ED1B2F] hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Heart className="w-3.5 h-3.5 fill-white" />
                  <span>Tôi quan tâm</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interest Confirmation Modal (Mandated in PDF 4) */}
      {interestedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-red-100 text-[#ED1B2F] flex items-center justify-center mx-auto">
              <Heart className="w-7 h-7 fill-red-600 text-red-600" />
            </div>

            <div>
              <span className="text-xs font-semibold text-[#004C97] uppercase">
                {interestedProduct.title}
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                Ghi nhận quan tâm thành công!
              </h3>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed text-left space-y-2">
              <p>{prominentProducts.interestModal.message}</p>
              <p className="font-semibold text-[#004C97]">
                {prominentProducts.interestModal.advisorText}
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <a
                id="modal-call-advisor-btn"
                href={`tel:${brand.advisor.phone}`}
                className="flex-1 py-3 bg-[#004C97] hover:bg-blue-800 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Gọi {brand.advisor.phone}</span>
              </a>

              <button
                id="modal-close-interest-btn"
                onClick={() => setInterestedProduct(null)}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
