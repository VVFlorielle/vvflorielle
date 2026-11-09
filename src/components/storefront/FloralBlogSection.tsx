import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, ArrowRight, X, Sparkles, ChevronRight } from 'lucide-react';
import { BlogArticle } from '../../types';

interface FloralBlogSectionProps {
  articles: BlogArticle[];
  selectedArticle: BlogArticle | null;
  setSelectedArticle: (art: BlogArticle | null) => void;
}

export const FloralBlogSection: React.FC<FloralBlogSectionProps> = ({
  articles,
  selectedArticle,
  setSelectedArticle
}) => {
  // Mobile rotating hero article index (xoay tua mỗi 20 giây như khung tin tức)
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  useEffect(() => {
    if (articles.length <= 1) return;
    const interval = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % articles.length);
    }, 20000);
    return () => clearInterval(interval);
  }, [articles.length]);

  const heroArticle = articles[activeHeroIndex] || articles[0];
  const compactArticles = articles.filter((_, idx) => idx !== activeHeroIndex).slice(0, 4);

  return (
    <>
      <section className="container">
        <div className="flex items-center justify-between pb-3 sm:pb-4">
          <div>
            <h3 className="text-base sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
              <span>Cẩm Nang &amp; Ý Nghĩa Hoa Tươi</span>
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
              Kinh nghiệm chăm hoa, ý nghĩa các loài hoa và nghệ thuật tặng hoa tinh tế
            </p>
          </div>
        </div>

        {/* ========================================================
            1. MOBILE LAYOUT (< md): WIDGET TIN TỨC CHUẨN
            1 bài to nổi bật tự xoay tua mỗi 20s + 4 bài nhỏ xếp 2 cột
           ======================================================== */}
        <div className="md:hidden space-y-3">
          {/* A. 1 Bài to nổi bật tự xoay tua 20s */}
          {heroArticle && (
            <div
              onClick={() => setSelectedArticle(heroArticle)}
              className="glass-card rounded-[24px] overflow-hidden border border-emerald-200/90 shadow-sm active:scale-98 transition-all cursor-pointer bg-white/95"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                <img
                  src={heroArticle.imageUrl}
                  alt={heroArticle.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                <span className="absolute top-2.5 left-2.5 text-[9.5px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-600/95 text-white shadow-xs">
                  {heroArticle.category}
                </span>

                {/* Dots indicator for auto-rotating */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/40 backdrop-blur-xs px-2 py-1 rounded-full">
                  <span className="text-[9px] text-white font-bold">Tin {activeHeroIndex + 1}/{articles.length}</span>
                </div>

                <div className="absolute bottom-2.5 inset-x-3 text-white space-y-1">
                  <div className="flex items-center gap-2 text-[10px] text-emerald-200 font-medium">
                    <Clock className="w-3 h-3" />
                    <span>{heroArticle.readTime}</span>
                    <span>• {heroArticle.publishedAt}</span>
                  </div>
                  <h4 className="font-extrabold text-sm text-white line-clamp-2 leading-snug drop-shadow-sm">
                    {heroArticle.title}
                  </h4>
                </div>
              </div>
            </div>
          )}

          {/* B. 4 bài nhỏ xếp 2 cột mini gọn gàng */}
          <div className="grid grid-cols-2 gap-2">
            {compactArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => setSelectedArticle(art)}
                className="glass-card p-2 rounded-2xl border border-slate-200/80 bg-white/90 active:scale-95 transition-all cursor-pointer flex flex-col justify-between space-y-1.5"
              >
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-100">
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <span className="absolute top-1.5 left-1.5 text-[8.5px] font-bold px-1.5 py-0.2 rounded-md bg-slate-900/80 text-white">
                    {art.category}
                  </span>
                </div>
                <div className="space-y-1">
                  <h5 className="font-bold text-[11.5px] text-slate-800 line-clamp-2 leading-tight">
                    {art.title}
                  </h5>
                  <div className="flex items-center text-[9.5px] text-slate-400 gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    <span>{art.readTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================
            2. DESKTOP LAYOUT (>= md): LƯỚI 3 CỘT RỘNG RÃI
           ======================================================== */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          {articles.map((art) => (
            <div
              key={art.id}
              onClick={() => setSelectedArticle(art)}
              className="glass-card rounded-[24px] overflow-hidden border border-white/80 cursor-pointer group hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                <img
                  src={art.imageUrl}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-900/70 backdrop-blur-md text-white">
                  {art.category}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{art.readTime}</span>
                    <span>• {art.publishedAt}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                    {art.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {art.summary}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center text-xs font-semibold text-emerald-700 gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Đọc tiếp</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Selected Article Reading Modal */}
      {selectedArticle && (
        <div
          className="glass-overlay z-50 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="glass-modal-content max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {selectedArticle.category}
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900">{selectedArticle.title}</h2>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span>{selectedArticle.publishedAt}</span>
                <span>• {selectedArticle.readTime}</span>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden aspect-[16/9] w-full">
              <img
                src={selectedArticle.imageUrl}
                alt={selectedArticle.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-line space-y-3">
              {selectedArticle.content}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="btn-primary text-xs py-2 px-5 rounded-xl cursor-pointer"
              >
                Đóng bài viết
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
