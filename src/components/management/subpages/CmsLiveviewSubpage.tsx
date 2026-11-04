import React, { useState } from 'react';
import {
  LayoutTemplate,
  Save,
  Monitor,
  Smartphone,
  ArrowLeft
} from 'lucide-react';
import { HeroBannerConfig, FlowerCategory, PromotionItem, BlogArticle } from '../../../types';

interface CmsLiveviewSubpageProps {
  onBackToDashboard: () => void;
  heroConfig: HeroBannerConfig;
  categories: FlowerCategory[];
  promotions: PromotionItem[];
  articles: BlogArticle[];
  updateHeroConfig: (cfg: Partial<HeroBannerConfig>) => void;
  updateCategories: (cats: FlowerCategory[]) => void;
  updatePromotions: (promos: PromotionItem[]) => void;
  updateArticles: (arts: BlogArticle[]) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  title?: string;
}

export const CmsLiveviewSubpage: React.FC<CmsLiveviewSubpageProps> = ({
  onBackToDashboard,
  heroConfig,
  categories,
  promotions,
  articles,
  updateHeroConfig,
  updateCategories,
  updatePromotions,
  updateArticles,
  showToast,
  title = 'Liveview Webview CMS Song Song 50/50'
}) => {
  const [cmsSection, setCmsSection] = useState<'hero' | 'categories' | 'promotions' | 'articles'>('hero');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  const [editHero, setEditHero] = useState<HeroBannerConfig>(heroConfig);
  const [editCategories, setEditCategories] = useState<FlowerCategory[]>(categories);
  const [editPromotions, setEditPromotions] = useState<PromotionItem[]>(promotions);
  const [editArticles, setEditArticles] = useState<BlogArticle[]>(articles);
  const [selectedEditCatId, setSelectedEditCatId] = useState<string>('khai-truong');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header and Back Button */}
      <div className="flex items-center gap-3 pb-3 border-b border-slate-200/80">
        <button
          type="button"
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại Tổng Quan</span>
        </button>
        <h2 className="font-bold text-base sm:text-lg text-slate-800">{title}</h2>
      </div>

      <div className="glass-panel p-5 rounded-[28px] flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-purple-200/80 bg-white/80">
        <div>
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-purple-700" />
            <span>Trình Chỉnh Sửa Giao Diện &amp; Live Webview (CMS)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Chỉnh sửa banner, ảnh danh mục, mã khuyến mại và xem trực tiếp trên màn hình mô phỏng thời gian thực.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              updateHeroConfig(editHero);
              updateCategories(editCategories);
              updatePromotions(editPromotions);
              updateArticles(editArticles);
              showToast('Đã lưu và áp dụng toàn bộ giao diện CMS!', 'success');
            }}
            className="btn-primary text-xs py-2 px-5 bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Lưu &amp; Áp Dụng Toàn Web</span>
          </button>
        </div>
      </div>

      {/* Split Screen Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANE: CMS CONTROLS (5 Cols) */}
        <div className="lg:col-span-5 glass-panel p-5 rounded-[28px] space-y-5 bg-white/85">
          <div className="flex border-b border-slate-200 pb-2 gap-1 overflow-x-auto text-xs">
            <button
              type="button"
              onClick={() => setCmsSection('hero')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                cmsSection === 'hero' ? 'bg-purple-700 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Banner Chính
            </button>
            <button
              type="button"
              onClick={() => setCmsSection('categories')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                cmsSection === 'categories' ? 'bg-purple-700 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Ảnh Danh Mục (6 Dịp)
            </button>
            <button
              type="button"
              onClick={() => setCmsSection('promotions')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                cmsSection === 'promotions' ? 'bg-purple-700 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Voucher
            </button>
            <button
              type="button"
              onClick={() => setCmsSection('articles')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                cmsSection === 'articles' ? 'bg-purple-700 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Cẩm Nang
            </button>
          </div>

          {/* 1. HERO BANNER CONTROLS */}
          {cmsSection === 'hero' && (
            <div className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Huy hiệu nhỏ (Badge)</label>
                <input
                  type="text"
                  value={editHero.badge}
                  onChange={(e) => setEditHero({ ...editHero, badge: e.target.value })}
                  className="glass-input w-full text-xs py-2 rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tiêu đề lớn (Title)</label>
                <input
                  type="text"
                  value={editHero.title}
                  onChange={(e) => setEditHero({ ...editHero, title: e.target.value })}
                  className="glass-input w-full text-xs py-2 rounded-xl font-bold"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mô tả phụ (Subtitle)</label>
                <textarea
                  rows={3}
                  value={editHero.subtitle}
                  onChange={(e) => setEditHero({ ...editHero, subtitle: e.target.value })}
                  className="glass-input w-full text-xs py-2 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nút chính (CTA)</label>
                  <input
                    type="text"
                    value={editHero.ctaText}
                    onChange={(e) => setEditHero({ ...editHero, ctaText: e.target.value })}
                    className="glass-input w-full text-xs py-2 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nút phụ (Hotline)</label>
                  <input
                    type="text"
                    value={editHero.ctaSecondaryText}
                    onChange={(e) => setEditHero({ ...editHero, ctaSecondaryText: e.target.value })}
                    className="glass-input w-full text-xs py-2 rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. CATEGORIES CONTROLS */}
          {cmsSection === 'categories' && (
            <div className="space-y-4 text-xs">
              <div className="flex gap-1.5 flex-wrap">
                {editCategories
                  .filter((c) => c.id !== 'all')
                  .map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedEditCatId(cat.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                        selectedEditCatId === cat.id
                          ? 'bg-purple-700 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
              </div>

              {(() => {
                const currentCat = editCategories.find((c) => c.id === selectedEditCatId);
                if (!currentCat) return null;

                const handleUpdateCurrentCat = (updates: Partial<FlowerCategory>) => {
                  setEditCategories(
                    editCategories.map((c) => (c.id === selectedEditCatId ? { ...c, ...updates } : c))
                  );
                };

                return (
                  <div className="space-y-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Tên danh mục</label>
                      <input
                        type="text"
                        value={currentCat.name}
                        onChange={(e) => handleUpdateCurrentCat({ name: e.target.value })}
                        className="glass-input w-full text-xs py-2 rounded-xl font-bold"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Mô tả ngắn</label>
                      <input
                        type="text"
                        value={currentCat.description}
                        onChange={(e) => handleUpdateCurrentCat({ description: e.target.value })}
                        className="glass-input w-full text-xs py-2 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">URL Ảnh Bìa Danh Mục</label>
                      <input
                        type="url"
                        value={currentCat.imageUrl}
                        onChange={(e) => handleUpdateCurrentCat({ imageUrl: e.target.value })}
                        className="glass-input w-full text-xs py-2 rounded-xl font-mono text-[11px]"
                      />
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* 3. PROMOTIONS CONTROLS */}
          {cmsSection === 'promotions' && (
            <div className="space-y-4 text-xs">
              <div className="font-bold text-slate-800 pb-1 border-b border-slate-100">
                Chỉnh Sửa Mã Khuyến Mại &amp; Voucher
              </div>
              {editPromotions.map((p, idx) => (
                <div key={p.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-purple-800 font-mono">{p.code}</span>
                    <input
                      type="text"
                      value={p.badge}
                      onChange={(e) => {
                        const copy = [...editPromotions];
                        copy[idx].badge = e.target.value;
                        setEditPromotions(copy);
                      }}
                      className="glass-input text-[10px] py-1 px-2 w-28 rounded-lg"
                    />
                  </div>
                  <input
                    type="text"
                    value={p.title}
                    onChange={(e) => {
                      const copy = [...editPromotions];
                      copy[idx].title = e.target.value;
                      setEditPromotions(copy);
                    }}
                    className="glass-input w-full text-xs py-1.5 rounded-xl font-semibold"
                  />
                </div>
              ))}
            </div>
          )}

          {/* 4. ARTICLES CONTROLS */}
          {cmsSection === 'articles' && (
            <div className="space-y-4 text-xs">
              <div className="font-bold text-slate-800 pb-1 border-b border-slate-100">
                Chỉnh Sửa Cẩm Nang &amp; Mẹo Chăm Hoa
              </div>
              {editArticles.map((art, idx) => (
                <div key={art.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <span className="text-[10px] text-slate-400">{art.publishedAt}</span>
                  <input
                    type="text"
                    value={art.title}
                    onChange={(e) => {
                      const copy = [...editArticles];
                      copy[idx].title = e.target.value;
                      setEditArticles(copy);
                    }}
                    className="glass-input w-full text-xs py-1.5 rounded-xl font-bold"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT PANE: LIVE WEBVIEW PREVIEW (7 Cols) */}
        <div className="lg:col-span-7 glass-panel p-4 sm:p-5 rounded-[28px] space-y-4 bg-slate-100/90 border border-slate-300/80">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <span className="text-[11px] font-mono text-slate-500 bg-white/80 px-2 py-0.5 rounded border border-slate-200">
                https://vvflorielle.vn/preview
              </span>
            </div>

            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  previewDevice === 'desktop' ? 'bg-purple-100 text-purple-800' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Xem bản Desktop"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  previewDevice === 'mobile' ? 'bg-purple-100 text-purple-800' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Xem bản Mobile"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mockup Canvas */}
          <div className={`mx-auto transition-all ${previewDevice === 'mobile' ? 'max-w-[375px]' : 'w-full'}`}>
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-200 p-4 space-y-4">
              {/* Mock Hero */}
              <div className="bg-gradient-to-r from-emerald-800 to-teal-700 text-white p-5 rounded-xl space-y-2">
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">{editHero.badge}</span>
                <h3 className="text-base font-extrabold leading-snug">{editHero.title}</h3>
                <p className="text-xs text-emerald-100 line-clamp-2">{editHero.subtitle}</p>
                <div className="pt-1 flex gap-2">
                  <span className="text-[11px] font-bold bg-white text-emerald-800 px-3 py-1 rounded-lg">
                    {editHero.ctaText}
                  </span>
                </div>
              </div>

              {/* Mock Categories */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-slate-800">Danh Mục Dịp Tặng Hoa</div>
                <div className="grid grid-cols-3 gap-2">
                  {editCategories
                    .filter((c) => c.id !== 'all')
                    .slice(0, 6)
                    .map((c) => (
                      <div key={c.id} className="text-center space-y-1">
                        <div className="aspect-square rounded-lg overflow-hidden bg-slate-100">
                          <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="text-[10px] font-semibold text-slate-700 truncate">{c.name}</div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Mock Vouchers */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-slate-800">Kho Voucher Đang Hoạt Động</div>
                <div className="space-y-1.5">
                  {editPromotions.slice(0, 2).map((p) => (
                    <div
                      key={p.id}
                      className="p-2 rounded-lg bg-rose-50/70 border border-rose-200 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-mono font-bold text-xs text-rose-700">{p.code}</div>
                        <div className="text-[10px] text-slate-600">{p.title}</div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                        {p.badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
