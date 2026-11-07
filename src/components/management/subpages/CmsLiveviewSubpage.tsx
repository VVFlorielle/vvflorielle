import React, { useState } from 'react';
import {
  LayoutTemplate,
  Save,
  Monitor,
  Smartphone,
  ArrowLeft,
  Eye,
  EyeOff,
  Home,
  Flower2,
  Sparkles,
  BookOpen,
  Info,
  Phone,
  Layers,
  ChevronRight,
  CheckCircle2
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

type CmsPageId = 'home' | 'products' | 'services' | 'articles' | 'about' | 'contact' | 'footer';

interface SectionItem {
  id: string;
  name: string;
  badge?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrl?: string;
  isVisible: boolean;
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
  title = 'Trình Quản Lý Giao Diện & Live Webview (CMS)'
}) => {
  const [selectedPage, setSelectedPage] = useState<CmsPageId>('home');
  const [activeSectionId, setActiveSectionId] = useState<string>('hero');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Draft states
  const [editHero, setEditHero] = useState<HeroBannerConfig>(heroConfig);
  const [editCategories, setEditCategories] = useState<FlowerCategory[]>(categories);
  const [editPromotions, setEditPromotions] = useState<PromotionItem[]>(promotions);
  const [editArticles, setEditArticles] = useState<BlogArticle[]>(articles);
  const [selectedEditCatId, setSelectedEditCatId] = useState<string>('khai-truong');

  // Page section visibility & content state (matching phototiinlove)
  const [sectionsState, setSectionsState] = useState<Record<string, boolean>>({
    hero: true,
    categories: true,
    bestseller: true,
    promotions: true,
    trustBadges: true,
    articles: true,
    servicesIntro: true,
    servicesWedding: true,
    aboutStory: true,
    aboutFlorist: true,
    contactHotline: true,
    contactMap: true,
    footerLinks: true
  });

  const toggleSection = (id: string) => {
    setSectionsState((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
    showToast(`Đã ${sectionsState[id] ? 'ẩn' : 'bật'} hiển thị khối "${id}"!`, 'info');
  };

  // Sections definitions per page
  const pageSections: Record<CmsPageId, { id: string; label: string; icon: string }[]> = {
    home: [
      { id: 'hero', label: 'Hero Banner Chính', icon: '🌸' },
      { id: 'categories', label: '6 Dịp Tặng Hoa Phổ Biến', icon: '🎀' },
      { id: 'bestseller', label: 'Bộ Sưu Tập Bestseller', icon: '👑' },
      { id: 'promotions', label: 'Mã Ưu Đãi & Voucher Đang Chạy', icon: '🎁' },
      { id: 'trustBadges', label: 'Cam Kết Hoa Tươi 3 Giờ & Freeship', icon: '⚡' }
    ],
    products: [
      { id: 'categories', label: 'Thanh Lọc Theo Dịp Hoa', icon: '🌺' },
      { id: 'bestseller', label: 'Lưới Sản Phẩm Hoa Thiết Kế', icon: '💐' }
    ],
    services: [
      { id: 'servicesIntro', label: 'Giới Thiệu Dịch Vụ Thiết Kế', icon: '🎨' },
      { id: 'servicesWedding', label: 'Hoa Cưới & Tiệc Sự Kiện Cao Cấp', icon: '💍' }
    ],
    articles: [
      { id: 'articles', label: 'Cẩm Nang & Mẹo Chăm Sóc Hoa', icon: '📖' }
    ],
    about: [
      { id: 'aboutStory', label: 'Câu Chuyện Thương Hiệu Florielle', icon: '🌿' },
      { id: 'aboutFlorist', label: 'Đội Ngũ Florist & Nghệ Thuật Cắm', icon: '✂️' }
    ],
    contact: [
      { id: 'contactHotline', label: 'Hotline, Zalo & Showroom Đặt Hoa', icon: '📞' },
      { id: 'contactMap', label: 'Bản Đồ Chỉ Đường & Giờ Mở Cửa', icon: '📍' }
    ],
    footer: [
      { id: 'footerLinks', label: 'Chân Trang & Thông Tin Bản Quyền', icon: '⚓' }
    ]
  };

  const currentSections = pageSections[selectedPage] || pageSections.home;

  const handleSaveAll = () => {
    updateHeroConfig(editHero);
    updateCategories(editCategories);
    updatePromotions(editPromotions);
    updateArticles(editArticles);
    showToast('Đã lưu và áp dụng toàn bộ giao diện CMS cho website! ✨', 'success');
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToDashboard}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại Tổng Quan</span>
          </button>
          <div>
            <h2 className="font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
              <LayoutTemplate className="w-5 h-5 text-purple-700" />
              <span>{title}</span>
            </h2>
            <p className="text-xs text-slate-500">
              Quản lý phân trang, bật/tắt khối section và chỉnh sửa nội dung giao diện theo chuẩn phototiinlove
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSaveAll}
          className="btn-primary text-xs py-2 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Lưu &amp; Áp Dụng Toàn Web</span>
        </button>
      </div>

      {/* Page Tabs Bar (phototiinlove Multi-Page Selector) */}
      <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
        {[
          { id: 'home', label: 'Trang Chủ', icon: <Home className="w-4 h-4" /> },
          { id: 'products', label: 'Mẫu Hoa', icon: <Flower2 className="w-4 h-4" /> },
          { id: 'services', label: 'Dịch Vụ', icon: <Sparkles className="w-4 h-4" /> },
          { id: 'articles', label: 'Cẩm Nang', icon: <BookOpen className="w-4 h-4" /> },
          { id: 'about', label: 'Giới Thiệu', icon: <Info className="w-4 h-4" /> },
          { id: 'contact', label: 'Liên Hệ', icon: <Phone className="w-4 h-4" /> },
          { id: 'footer', label: 'Chân Trang', icon: <Layers className="w-4 h-4" /> }
        ].map((tab) => {
          const isActive = selectedPage === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setSelectedPage(tab.id as CmsPageId);
                const firstSec = pageSections[tab.id as CmsPageId]?.[0]?.id;
                if (firstSec) setActiveSectionId(firstSec);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-purple-700 text-white shadow-xs scale-[1.01]'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Split Screen Workspace: Left Inspector + Right Liveview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT PANE: Section List + Inspector Form (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* 1. Sections List & Eye Toggle for current page */}
          <div className="glass-panel p-4 rounded-2xl bg-white/90 border border-slate-200 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-bold text-xs text-slate-800">Các Khối Trên Trang ({currentSections.length})</span>
              <span className="text-[11px] text-slate-500">Bấm 👁 để Ẩn / Hiện</span>
            </div>

            <div className="space-y-1.5">
              {currentSections.map((sec) => {
                const isVisible = sectionsState[sec.id] !== false;
                const isSelected = activeSectionId === sec.id;
                return (
                  <div
                    key={sec.id}
                    onClick={() => setActiveSectionId(sec.id)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-purple-500 bg-purple-50/90 text-purple-900 shadow-2xs ring-1 ring-purple-300'
                        : 'border-slate-200/80 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm shrink-0">{sec.icon}</span>
                      <span className="text-xs font-bold truncate">{sec.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSection(sec.id);
                        }}
                        className={`p-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          isVisible
                            ? 'text-emerald-700 hover:bg-emerald-50'
                            : 'text-slate-400 hover:bg-slate-100'
                        }`}
                        title={isVisible ? 'Đang hiện (Bấm để ẩn)' : 'Đang ẩn (Bấm để hiện)'}
                      >
                        {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Inspector Panel (Edit the active section's content) */}
          <div className="glass-panel p-5 rounded-2xl bg-white/95 border border-purple-200/80 shadow-2xs space-y-4">
            <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-purple-700 tracking-wider uppercase block">
                  Chỉnh Sửa Chi Tiết (Inspector)
                </span>
                <h4 className="font-bold text-sm text-slate-900">
                  {currentSections.find((s) => s.id === activeSectionId)?.label || 'Khối nội dung'}
                </h4>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  sectionsState[activeSectionId] !== false
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {sectionsState[activeSectionId] !== false ? 'Đang Hiển Thị' : 'Đang Ẩn'}
              </span>
            </div>

            {/* If active section is Hero */}
            {activeSectionId === 'hero' && (
              <div className="space-y-3 text-xs">
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
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Nút chính (CTA)</label>
                    <input
                      type="text"
                      value={editHero.ctaText}
                      onChange={(e) => setEditHero({ ...editHero, ctaText: e.target.value })}
                      className="glass-input w-full text-xs py-2 rounded-xl font-medium"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Nút phụ (Hotline)</label>
                    <input
                      type="text"
                      value={editHero.ctaSecondaryText}
                      onChange={(e) => setEditHero({ ...editHero, ctaSecondaryText: e.target.value })}
                      className="glass-input w-full text-xs py-2 rounded-xl font-medium"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* If active section is Categories */}
            {activeSectionId === 'categories' && (
              <div className="space-y-3.5 text-xs">
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
                    <div className="space-y-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Tên danh mục dịp</label>
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

            {/* If active section is Promotions */}
            {activeSectionId === 'promotions' && (
              <div className="space-y-3 text-xs">
                {editPromotions.slice(0, 3).map((p, idx) => (
                  <div key={p.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-purple-800">{p.code}</span>
                      <input
                        type="text"
                        value={p.badge}
                        onChange={(e) => {
                          const copy = [...editPromotions];
                          copy[idx].badge = e.target.value;
                          setEditPromotions(copy);
                        }}
                        className="glass-input text-[10px] py-1 px-2 w-24 rounded-lg"
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

            {/* If active section is Articles */}
            {activeSectionId === 'articles' && (
              <div className="space-y-3 text-xs">
                {editArticles.slice(0, 3).map((art, idx) => (
                  <div key={art.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
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

            {/* Generic placeholder for other sections */}
            {!['hero', 'categories', 'promotions', 'articles'].includes(activeSectionId) && (
              <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-500 space-y-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <p className="font-semibold text-slate-700">Khối giao diện đã sẵn sàng hiển thị</p>
                <p className="text-[11px] text-slate-400">
                  Bạn có thể bấm biểu tượng mắt 👁 ở danh sách bên trên để Bật hoặc Tắt khối này trên trang web bất cứ lúc nào.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANE: LIVE WEBVIEW PREVIEW (7 Cols) */}
        <div className="lg:col-span-7 glass-panel p-4 sm:p-5 rounded-[28px] space-y-4 bg-slate-100/90 border border-slate-300/80 sticky top-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex gap-1.5 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <span className="text-[11px] font-mono text-slate-500 bg-white/80 px-2 py-0.5 rounded border border-slate-200 truncate">
                https://vvflorielle.vn/{selectedPage === 'home' ? '' : selectedPage}
              </span>
            </div>

            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shrink-0">
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
              {/* Mock Hero (Shown only if hero is active) */}
              {sectionsState.hero !== false && (
                <div className="bg-gradient-to-r from-emerald-800 to-teal-700 text-white p-5 rounded-xl space-y-2 relative overflow-hidden">
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">{editHero.badge}</span>
                  <h3 className="text-base font-extrabold leading-snug">{editHero.title}</h3>
                  <p className="text-xs text-emerald-100 line-clamp-2">{editHero.subtitle}</p>
                  <div className="pt-1 flex gap-2">
                    <span className="text-[11px] font-bold bg-white text-emerald-800 px-3 py-1 rounded-lg">
                      {editHero.ctaText}
                    </span>
                  </div>
                </div>
              )}

              {/* Mock Categories (Shown only if categories is active) */}
              {sectionsState.categories !== false && (
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
              )}

              {/* Mock Vouchers (Shown only if promotions is active) */}
              {sectionsState.promotions !== false && (
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
