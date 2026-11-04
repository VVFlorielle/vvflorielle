import React from 'react';
import { Sparkles, ChevronRight, PhoneCall, CheckCircle, Truck, Heart } from 'lucide-react';
import {
  FloralCornerTopLeft,
  FloralCornerTopRight,
  FloatingPetals
} from '../FloralHeroOrnaments';
import { ShopSettings, HeroBannerConfig } from '../../types';

interface HeroBannerSectionProps {
  heroConfig: HeroBannerConfig;
  settings: ShopSettings;
  onExploreClick: () => void;
}

export const HeroBannerSection: React.FC<HeroBannerSectionProps> = ({
  heroConfig,
  settings,
  onExploreClick
}) => {
  return (
    <section className="container pt-4 sm:pt-6">
      <div className="glass-panel p-6 sm:p-12 relative overflow-hidden bg-gradient-to-br from-white/95 via-emerald-50/50 to-rose-50/30 backdrop-blur-2xl rounded-[32px] sm:rounded-[40px] border border-emerald-200/80 shadow-[0_25px_60px_-15px_rgba(5,150,105,0.16),inset_0_1.5px_2px_rgba(255,255,255,1),inset_0_0_24px_rgba(16,185,129,0.05)] text-center transition-all duration-300">
        {/* 1. ARTISTIC BOTANICAL CORNER FLOWERS (2 Top Corners: Roses, Peonies & Leaves) */}
        <FloralCornerTopLeft className="absolute -top-1 -left-1 sm:top-0 sm:left-0 w-28 h-28 sm:w-44 sm:h-44 lg:w-52 lg:h-52 z-0 opacity-90 transition-transform duration-500 hover:scale-105 pointer-events-none" />
        <FloralCornerTopRight className="absolute -top-1 -right-1 sm:top-0 sm:right-0 w-28 h-28 sm:w-44 sm:h-44 lg:w-52 lg:h-52 z-0 opacity-90 transition-transform duration-500 hover:scale-105 pointer-events-none" />

        {/* 2. GENTLE FLOATING FLOWER PETALS */}
        <FloatingPetals />

        {/* 3. HERO CONTENT CONTAINER */}
        <div className="relative z-10 max-w-4xl lg:max-w-5xl mx-auto space-y-4 sm:space-y-5">
          {/* Badge Centered */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/95 text-emerald-800 text-xs font-bold border border-emerald-300/80 shadow-xs mx-auto">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>{heroConfig.badge || 'Tiệm Hoa Tươi Nghệ Thuật V&V Florielle'}</span>
          </div>

          {/* Welcome Title Centered */}
          <div className="space-y-1.5 sm:space-y-2.5">
            <div className="text-sm sm:text-lg md:text-xl font-bold text-slate-700 tracking-tight flex items-center justify-center gap-2">
              <span className="text-emerald-500/70 text-xs sm:text-sm">✦</span>
              <span>Chào Mừng Đến Với</span>
              <span className="text-emerald-500/70 text-xs sm:text-sm">✦</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-normal leading-normal sm:leading-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-800 via-emerald-600 to-teal-700 inline-block drop-shadow-xs px-2 py-1">
              Tiệm Hoa V&amp;V Florielle
            </h1>

            {/* Subtitle / Slogan */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 text-slate-700 font-semibold text-xs sm:text-base md:text-lg tracking-wide pt-0.5">
              <span className="text-emerald-500/80 text-xs sm:text-sm">❖ ❖ ❖</span>
              <span className="italic font-serif">Nghệ Thuật Trao Gửi Yêu Thương</span>
              <span className="text-emerald-500/80 text-xs sm:text-sm">❖ ❖ ❖</span>
            </div>
          </div>

          {/* Subtitle Centered */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto px-2">
            {heroConfig.subtitle}
          </p>

          {/* Quick Hero Actions Centered */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onExploreClick}
              className="btn-primary text-xs py-3 px-6 rounded-2xl shadow-lg shadow-emerald-700/20 flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer"
            >
              <span>{heroConfig.ctaText}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <a
              href={`tel:${settings.hotline}`}
              className="btn-secondary text-xs py-3 px-6 rounded-2xl border border-slate-300/80 hover:bg-white flex items-center gap-2 transition-transform hover:scale-105"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
              <span>{heroConfig.ctaSecondaryText}: {settings.hotline}</span>
            </a>
          </div>

          {/* 3 Key Trust Markers Centered */}
          <div className="pt-3 border-t border-emerald-100/80 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-[11px] sm:text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Hoa tươi loại 1 nhập mới mỗi ngày</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Giao hỏa tốc chỉ từ 15P - 60P Hà Nội</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-500 shrink-0" />
              <span>Chụp ảnh gửi mẫu hoàn thiện qua Zalo</span>
            </div>
          </div>
        </div>

        {/* Subtle background ambient graphic decoration */}
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[550px] h-[320px] rounded-full bg-gradient-to-tr from-emerald-300/20 via-pink-200/15 to-transparent blur-3xl pointer-events-none" />
      </div>
    </section>
  );
};
