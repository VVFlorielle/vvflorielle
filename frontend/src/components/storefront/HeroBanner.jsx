import React from 'react';
import { Sparkles, Palette, Clock, CheckCircle2 } from 'lucide-react';

export default function HeroBanner({ onSelectFeatured }) {
  return (
    <section className="glass-panel rounded-3xl p-6 sm:p-8 mb-8 relative overflow-hidden shadow-lg border border-white/70">
      {/* Decorative gradient glow */}
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-rose-300/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-amber-300/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100/80 text-rose-700 text-xs font-bold border border-rose-200 backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          <span>BỘ SƯU TẬP HOA TƯƠI MỚI NHẤT HÔM NAY</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-800 tracking-tight leading-tight">
          Chọn Mẫu Hoa Có Sẵn & <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500">
            Tự Do Tùy Biến Giấy, Nơ Theo Ý Thích
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Mỗi bó hoa tại <strong>Hoa Tươi Linh Phương</strong> đều có ảnh chụp HD chân thực. Bạn có thể zoom cận cảnh từng cánh hoa, chọn màu giấy gói, đổi màu nơ hoặc thêm bớt cành hoa trước khi gửi đơn hàng trực tiếp về cho tiệm.
        </p>

        {/* Feature highlight tags */}
        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold text-slate-700">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/70 border border-white shadow-sm">
            <Palette className="w-4 h-4 text-rose-500" />
            Đổi màu giấy & nơ miễn phí
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/70 border border-white shadow-sm">
            <Clock className="w-4 h-4 text-amber-500" />
            Hỏa tốc 60-90 phút
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/70 border border-white shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Xem ảnh thật trước khi giao
          </span>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={onSelectFeatured}
            className="glass-button text-white font-bold px-6 py-3 rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-md hover:scale-105 transition-all"
          >
            <span>Trải Nghiệm Tùy Biến Bó Hoa Ánh Dương (LP-108)</span>
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
