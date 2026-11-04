import React from 'react';
import { BookOpen, Clock, ArrowRight, X } from 'lucide-react';
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
  return (
    <>
      <section className="container">
        <div className="flex items-center justify-between pb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <span>Cẩm Nang &amp; Ý Nghĩa Hoa Tươi</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Kinh nghiệm chăm hoa, ý nghĩa các loài hoa và nghệ thuật tặng hoa tinh tế
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
