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
  CheckCircle2,
  X,
  AlertTriangle,
  RotateCcw,
  Palette,
  ExternalLink,
  Tag,
  Gift,
  ShieldCheck,
  Check,
  Pencil
} from 'lucide-react';
import { useBodyScrollLock } from '../../../utils/scrollLock';
import { HeroBannerConfig, FlowerCategory, PromotionItem, BlogArticle } from '../../../types';

export interface CmsPreviewEditor {
  selected: string;
  select: (target: string) => void;
}

export function CmsPreviewTarget({
  editor,
  target,
  label,
  children,
  className = ''
}: {
  editor?: CmsPreviewEditor;
  target: string;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  if (!editor) return <>{children}</>;
  const isSelected = editor.selected === target;
  return (
    <div
      data-cms-target={target}
      className={`group/target relative cursor-pointer transition-all duration-200 rounded-xl ${
        isSelected
          ? 'ring-2 ring-emerald-600 bg-emerald-500/10 shadow-lg shadow-emerald-500/10'
          : 'hover:ring-2 hover:ring-dashed hover:ring-emerald-400 hover:bg-emerald-50/20 active:ring-2 active:ring-emerald-500'
      } ${className}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        editor.select(target);
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          editor.select(target);
        }
      }}
    >
      {children}
      <span
        className={`absolute top-2 right-2 max-w-[calc(100%-1rem)] px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold tracking-wide transition-all z-20 pointer-events-none shadow-sm flex items-center gap-1 truncate ${
          isSelected
            ? 'bg-emerald-700 text-white opacity-100 scale-100 ring-2 ring-white/80'
            : 'bg-slate-900/85 text-white backdrop-blur-xs opacity-0 group-hover/target:opacity-100 scale-95 group-hover/target:scale-100'
        }`}
      >
        <span className="shrink-0">✎</span> <span className="truncate">{label}</span>
      </span>
    </div>
  );
}

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

type CmsPageId =
  | 'home'
  | 'products'
  | 'services'
  | 'articles'
  | 'about'
  | 'contact'
  | 'footer'
  | 'branding';

interface CmsPageMeta {
  key: CmsPageId;
  label: string;
  icon: string;
  description: string;
  itemCount: number;
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
  title = 'Trình Quản Lý Giao Diện & Live Webview (CMS Chuẩn Phototiinlove)'
}) => {
  // Navigation & Workspace State
  const [selectedPage, setSelectedPage] = useState<CmsPageId>('home');
  const [desktopWorkspaceOpen, setDesktopWorkspaceOpen] = useState(false);
  const [workspaceItem, setWorkspaceItem] = useState<string>('hero');
  const [mobileHomeInspectorOpen, setMobileHomeInspectorOpen] = useState(false);

  // Discard Confirmation Modal State (No window.confirm)
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  // Lock body scroll when workspace or modals are active
  useBodyScrollLock(desktopWorkspaceOpen || showDiscardConfirm || mobileHomeInspectorOpen);

  // Draft States
  const [draftHero, setDraftHero] = useState<HeroBannerConfig>(heroConfig);
  const [draftCategories, setDraftCategories] = useState<FlowerCategory[]>(categories);
  const [draftPromotions, setDraftPromotions] = useState<PromotionItem[]>(promotions);
  const [draftArticles, setDraftArticles] = useState<BlogArticle[]>(articles);

  // Additional sections draft (About, Services, Contact, Footer, Branding)
  const [draftServices, setDraftServices] = useState({
    title: 'Dịch Vụ Thiết Kế Hoa Tươi Cao Cấp',
    subtitle: 'Hoa cưới cầm tay, trang trí lễ đường, sự kiện doanh nghiệp và hội nghị sang trọng',
    weddingTitle: 'Gói Hoa Cưới Sang Trọng & Tinh Tế',
    weddingSubtitle: 'Thiết kế tone pastel theo yêu cầu cô dâu chú rể, hoa nhập khẩu Ecuador & Hà Lan',
    weddingCta: 'Đặt Lịch Tư Vấn Hoa Cưới'
  });

  const [draftAbout, setDraftAbout] = useState({
    badge: 'CÂU CHUYỆN THƯƠNG HIỆU',
    title: 'Nghệ Thuật Cắm Hoa V&V Florielle Hà Nội',
    subtitle: 'Từng cánh hoa được nâng niu tỉ mỉ, gửi trao cảm xúc chân thành và lời chúc an lành trọn vẹn',
    floristBadge: 'ĐỘI NGŨ FLORIST',
    floristTitle: 'Nghệ Nhân 10 Năm Kinh Nghiệm',
    floristSubtitle: 'Tốt nghiệp học viện cắm hoa quốc tế, sáng tạo phong cách hoa hiện đại trang nhã'
  });

  const [draftContact, setDraftContact] = useState({
    badge: 'KẾT NỐI VỚI V&V FLORIELLE',
    title: 'Showroom Hoa Tươi & Xưởng Cắm Hoa Nghệ Thuật',
    hotline: '0906.721.442',
    address: '105 Doãn Kế Thiện, Mai Dịch, Cầu Giấy, Hà Nội',
    openingHours: '06:30 - 21:30 (Mở cửa tất cả các ngày)',
    mapCta: 'Xem Chỉ Đường Google Maps'
  });

  const [draftFooter, setDraftFooter] = useState({
    brandName: 'V&V Florielle - Tiệm Hoa Tươi Nghệ Thuật',
    slogan: 'Hoa tươi thiết kế cao cấp, giao hỏa tốc 15 - 60 phút nội thành Hà Nội',
    hotlineText: 'Hotline CSKH: 0906.721.442',
    copyright: '© 2026 V&V Florielle. Bản quyền thuộc về Tiệm Hoa Nghệ Thuật V&V Florielle.'
  });

  const [draftBranding, setDraftBranding] = useState({
    brandName: 'V&V Florielle',
    brandSlogan: 'Tinh hoa hoa tươi nghệ thuật - Nâng tầm khoảnh khắc',
    primaryColor: '#059669',
    accentColor: '#f43f5e',
    mascotName: 'Bé Hoa Flori'
  });

  // Section Visibility Map
  const [sectionsVisibility, setSectionsVisibility] = useState<Record<string, boolean>>({
    hero: true,
    categories: true,
    bestseller: true,
    promotions: true,
    trustBadges: true,
    servicesIntro: true,
    servicesWedding: true,
    articles: true,
    aboutStory: true,
    aboutFlorist: true,
    contactHotline: true,
    contactMap: true,
    footerLinks: true,
    brandingInfo: true
  });

  // Check if draft has unsaved changes
  const hasUnsavedChanges =
    JSON.stringify(draftHero) !== JSON.stringify(heroConfig) ||
    JSON.stringify(draftCategories) !== JSON.stringify(categories) ||
    JSON.stringify(draftPromotions) !== JSON.stringify(promotions) ||
    JSON.stringify(draftArticles) !== JSON.stringify(articles);

  const toggleSection = (id: string) => {
    setSectionsVisibility((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Welcome Pages Meta Cards
  const cmsWelcomePages: CmsPageMeta[] = [
    {
      key: 'home',
      label: 'Trang Chủ (Home Page)',
      icon: '🌸',
      description: 'Hero banner, 6 dịp tặng hoa, sản phẩm bestseller, voucher khuyến mãi và cam kết hoa tươi 3h',
      itemCount: 5
    },
    {
      key: 'products',
      label: 'Mẫu Hoa & Bảng Giá (Catalog)',
      icon: '💐',
      description: 'Lưới mẫu hoa tươi nghệ thuật, bộ lọc dịp lễ, phân loại giá bán và huy hiệu Best Seller',
      itemCount: 3
    },
    {
      key: 'services',
      label: 'Dịch Vụ Cưới & Sự Kiện (Services)',
      icon: '💍',
      description: 'Hoa cưới cầm tay, trang trí lễ gia tiên, hoa bàn tiệc, hội nghị sự kiện doanh nghiệp',
      itemCount: 2
    },
    {
      key: 'articles',
      label: 'Cẩm Nang & Mẹo Chăm Sóc (Blog)',
      icon: '📖',
      description: 'Mẹo giữ hoa tươi 7 ngày, ý nghĩa các loài hoa nhập khẩu, xu hướng tone màu hoa 2026',
      itemCount: 3
    },
    {
      key: 'about',
      label: 'Giới Thiệu Thương Hiệu (About)',
      icon: '🌿',
      description: 'Câu chuyện tình yêu hoa tươi V&V Florielle, tâm huyết florist và tiêu chuẩn chọn hoa cành',
      itemCount: 2
    },
    {
      key: 'contact',
      label: 'Liên Hệ & Bản Đồ (Contact)',
      icon: '📍',
      description: 'Hotline 24/7, kênh Zalo CSKH, địa chỉ xưởng 105 Doãn Kế Thiện và widget Google Maps',
      itemCount: 2
    },
    {
      key: 'footer',
      label: 'Chân Trang Website (Footer)',
      icon: '⚓',
      description: 'Thông tin bản quyền thương hiệu, hotline khiếu nại, chính sách bảo hành hoa hỏng 100%',
      itemCount: 2
    },
    {
      key: 'branding',
      label: 'Nhận Diện Thương Hiệu (Branding)',
      icon: '🎨',
      description: 'Tên thương hiệu, slogan tiệm hoa, màu sắc nhận diện và trợ lý ảo linh vật Flori',
      itemCount: 2
    }
  ];

  // Component Tree Configuration per Page
  const pageTreeItems: Record<CmsPageId, { id: string; label: string; icon: string }[]> = {
    home: [
      { id: 'hero', label: 'Hero Banner Chính', icon: '🌸' },
      { id: 'categories', label: '6 Dịp Tặng Hoa Phổ Biến', icon: '🎀' },
      { id: 'bestseller', label: 'Bộ Sưu Tập Bestseller', icon: '👑' },
      { id: 'promotions', label: 'Voucher & Mã Ưu Đãi Đang Chạy', icon: '🎁' },
      { id: 'trustBadges', label: 'Cam Kết Hoa Tươi 3 Giờ & Freeship', icon: '⚡' }
    ],
    products: [
      { id: 'productsHeader', label: 'Tiêu Đề Danh Mục & Bảng Giá', icon: '💐' },
      { id: 'categoriesFilter', label: 'Thanh Phân Loại Dịp Tặng Hoa', icon: '🌺' },
      { id: 'productsGrid', label: 'Lưới Sản Phẩm Hoa Thiết Kế', icon: '📦' }
    ],
    services: [
      { id: 'servicesIntro', label: 'Giới Thiệu Dịch Vụ Thiết Kế Hoa', icon: '🎨' },
      { id: 'servicesWedding', label: 'Gói Hoa Cưới & Sự Kiện Cao Cấp', icon: '💍' }
    ],
    articles: [
      { id: 'articlesHeader', label: 'Tiêu Đề Cẩm Nang Hoa Tươi', icon: '📰' },
      { id: 'articlesList', label: 'Danh Sách Bài Viết Mẹo Chăm Hoa', icon: '📖' }
    ],
    about: [
      { id: 'aboutStory', label: 'Câu Chuyện Thương Hiệu Florielle', icon: '🌿' },
      { id: 'aboutFlorist', label: 'Đội Ngũ Nghệ Nhân Florist 10 Năm', icon: '✂️' }
    ],
    contact: [
      { id: 'contactHotline', label: 'Hotline 24/7 & Kênh Zalo CSKH', icon: '📞' },
      { id: 'contactMap', label: 'Bản Đồ Showroom 105 Doãn Kế Thiện', icon: '📍' }
    ],
    footer: [
      { id: 'footerLinks', label: 'Liên Kết Chân Trang & Bản Quyền', icon: '⚓' },
      { id: 'footerPolicy', label: 'Cam Kết Đổi Trả & Bảo Hành Hoa', icon: '🛡️' }
    ],
    branding: [
      { id: 'brandIdentity', label: 'Tên Thương Hiệu & Slogan Tiệm', icon: '🏷️' },
      { id: 'brandMascot', label: 'Linh Vật Trợ Lý Ảo Bé Hoa Flori', icon: '🧚' }
    ]
  };

  const currentTree = pageTreeItems[selectedPage] || pageTreeItems.home;

  const workspaceMetaMap: Record<CmsPageId, { title: string; shortTitle: string }> = {
    home: { title: 'CHỈNH SỬA TRANG CHỦ', shortTitle: 'Trang chủ' },
    products: { title: 'CHỈNH SỬA BẢNG GIÁ & CATALOG', shortTitle: 'Mẫu hoa' },
    services: { title: 'CHỈNH SỬA DỊCH VỤ & HOA CƯỚI', shortTitle: 'Dịch vụ' },
    articles: { title: 'CHỈNH SỬA CẨM NANG & TIN TỨC', shortTitle: 'Cẩm nang' },
    about: { title: 'CHỈNH SỬA GIỚI THIỆU THƯƠNG HIỆU', shortTitle: 'Giới thiệu' },
    contact: { title: 'CHỈNH SỬA LIÊN HỆ & SHOWROOM', shortTitle: 'Liên hệ' },
    footer: { title: 'CHỈNH SỬA CHÂN TRANG FOOTER', shortTitle: 'Chân trang' },
    branding: { title: 'QUẢN LÝ NHẬN DIỆN & LINH VẬT', shortTitle: 'Thương hiệu' }
  };

  const currentWorkspaceMeta = workspaceMetaMap[selectedPage] || workspaceMetaMap.home;

  const openWorkspace = (pageId: CmsPageId) => {
    setSelectedPage(pageId);
    const initialItem = pageTreeItems[pageId]?.[0]?.id || 'hero';
    setWorkspaceItem(initialItem);
    setMobileHomeInspectorOpen(false);
    setDesktopWorkspaceOpen(true);
    window.history.pushState({ cmsWorkspace: pageId }, '', window.location.hash);
  };

  const changeWorkspaceItem = (itemId: string) => {
    setWorkspaceItem(itemId);
    if (typeof window !== 'undefined' && window.innerWidth <= 1100) {
      setMobileHomeInspectorOpen(true);
      window.history.pushState({ cmsInspector: itemId }, '', window.location.hash);
    }
  };

  const handleCloseWorkspace = () => {
    if (hasUnsavedChanges) {
      setShowDiscardConfirm(true);
      return;
    }
    setMobileHomeInspectorOpen(false);
    setDesktopWorkspaceOpen(false);
  };

  const handleDiscardChanges = () => {
    setDraftHero(heroConfig);
    setDraftCategories(categories);
    setDraftPromotions(promotions);
    setDraftArticles(articles);
    setShowDiscardConfirm(false);
    setMobileHomeInspectorOpen(false);
    showToast('Đã khôi phục dữ liệu ban đầu!', 'info');
  };

  const handleSaveAndApply = () => {
    updateHeroConfig(draftHero);
    updateCategories(draftCategories);
    updatePromotions(draftPromotions);
    updateArticles(draftArticles);
    setMobileHomeInspectorOpen(false);
    setDesktopWorkspaceOpen(false);
    showToast('Đã lưu và áp dụng toàn bộ cấu hình giao diện website thành công! ✨', 'success');
  };

  // Popstate listener for mobile phone back button / browser back gesture
  React.useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (mobileHomeInspectorOpen) {
        setMobileHomeInspectorOpen(false);
        e.stopImmediatePropagation();
        return;
      }
      if (desktopWorkspaceOpen) {
        if (hasUnsavedChanges) {
          setShowDiscardConfirm(true);
        } else {
          setDesktopWorkspaceOpen(false);
        }
        e.stopImmediatePropagation();
        return;
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [mobileHomeInspectorOpen, desktopWorkspaceOpen, hasUnsavedChanges]);

  // Editor instance for CmsPreviewTarget
  const previewEditor: CmsPreviewEditor = {
    selected: workspaceItem,
    select: (target: string) => {
      setWorkspaceItem(target);
      if (typeof window !== 'undefined' && window.innerWidth <= 1100) {
        setMobileHomeInspectorOpen(true);
        window.history.pushState({ cmsInspector: target }, '', window.location.hash);
      }
    }
  };

  // ==========================================
  // RENDER MIDDLE PREVIEW CANVAS
  // ==========================================
  const renderCanvasPreview = () => {
    switch (selectedPage) {
      case 'home':
        return (
          <div className="space-y-6">
            {/* 1. Hero Banner Target */}
            {sectionsVisibility.hero && (
              <CmsPreviewTarget
                editor={previewEditor}
                target="hero"
                label="Hero Banner Chính (Bấm để sửa)"
              >
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white p-6 sm:p-10 shadow-md">
                  <div className="relative z-10 max-w-xl space-y-3">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      {draftHero.badge || 'Tiệm Hoa Tươi Nghệ Thuật V&V Florielle'}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight text-white">
                      {draftHero.title || 'Hoa Tươi Thiết Kế - Trao Cảm Xúc Yêu Thương'}
                    </h2>
                    <p className="text-sm text-emerald-100/90 leading-relaxed">
                      {draftHero.subtitle ||
                        'Mỗi bó hoa là một tác phẩm nghệ thuật, chọn lọc từ các nông trại hoa Đà Lạt và hoa nhập khẩu cao cấp.'}
                    </p>
                    <div className="pt-2 flex flex-wrap gap-2.5">
                      <button
                        type="button"
                        className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                      >
                        {draftHero.ctaText || 'Khám Phá Mẫu Hoa Ngay'}
                      </button>
                    </div>
                  </div>
                  {draftHero.backgroundImage && (
                    <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-30 pointer-events-none">
                      <img
                        src={draftHero.backgroundImage}
                        alt="Hero"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </CmsPreviewTarget>
            )}

            {/* 2. Categories Target */}
            {sectionsVisibility.categories && (
              <CmsPreviewTarget
                editor={previewEditor}
                target="categories"
                label="6 Dịp Tặng Hoa Phổ Biến (Bấm để sửa)"
              >
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-100 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                        DANH MỤC HOA THEO DỊP
                      </span>
                      <h3 className="text-base font-bold text-slate-800">
                        Chọn Hoa Phù Hợp Với Khoảnh Khắc Của Bạn
                      </h3>
                    </div>
                    <span className="text-xs text-slate-400">6 danh mục</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {draftCategories.slice(0, 6).map((cat) => (
                      <div
                        key={cat.id}
                        className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center gap-2.5"
                      >
                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-200">
                          <img
                            src={cat.imageUrl}
                            alt={cat.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-slate-800 truncate">{cat.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">{cat.description || cat.tagline}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CmsPreviewTarget>
            )}

            {/* 3. Bestseller Target */}
            {sectionsVisibility.bestseller && (
              <CmsPreviewTarget
                editor={previewEditor}
                target="bestseller"
                label="Bộ Sưu Tập Bestseller (Bấm để sửa)"
              >
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-100 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600">
                        HOA TƯƠI ĐƯỢC YÊU THÍCH NHẤT
                      </span>
                      <h3 className="text-base font-bold text-slate-800">Mẫu Hoa Bestseller Tiệm</h3>
                    </div>
                    <span className="text-xs text-emerald-600 font-medium">Xem tất cả ›</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="p-2 rounded-xl border border-slate-100 bg-slate-50/40 space-y-1.5"
                      >
                        <div className="aspect-square rounded-lg bg-pink-100/50 flex items-center justify-center text-pink-400 font-bold text-xs">
                          Mẫu Hoa #{i}
                        </div>
                        <p className="text-xs font-bold text-slate-700 truncate">
                          Bó Hoa Thiết Kế VIP #{i}
                        </p>
                        <p className="text-xs font-extrabold text-emerald-700">850.000₫</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CmsPreviewTarget>
            )}

            {/* 4. Promotions Target */}
            {sectionsVisibility.promotions && (
              <CmsPreviewTarget
                editor={previewEditor}
                target="promotions"
                label="Voucher & Mã Ưu Đãi (Bấm để sửa)"
              >
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 border border-amber-200/80 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                        ƯU ĐÃI ĐỘC QUYỀN
                      </span>
                      <h3 className="text-base font-bold text-slate-800">Mã Giảm Giá Đang Chạy</h3>
                    </div>
                    <span className="text-xs text-amber-700 font-bold">
                      {draftPromotions.length} Voucher
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {draftPromotions.slice(0, 2).map((promo) => (
                      <div
                        key={promo.id}
                        className="p-3 rounded-xl bg-white border border-amber-200 flex items-center justify-between shadow-xs"
                      >
                        <div>
                          <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-amber-100 text-amber-800">
                            {promo.code}
                          </span>
                          <p className="text-xs text-slate-600 mt-1">{promo.description}</p>
                        </div>
                        <span className="text-xs font-bold text-emerald-700">
                          -{new Intl.NumberFormat('vi-VN').format(promo.discountAmount)}₫
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CmsPreviewTarget>
            )}

            {/* 5. Trust Badges */}
            {sectionsVisibility.trustBadges && (
              <CmsPreviewTarget
                editor={previewEditor}
                target="trustBadges"
                label="Cam Kết Hoa Tươi 3 Giờ & Freeship (Bấm để sửa)"
              >
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                  <div className="text-center p-2">
                    <p className="text-base">⚡</p>
                    <p className="font-bold text-xs text-emerald-950 mt-1">Giao Nhanh 15-60P</p>
                    <p className="text-[10px] text-emerald-700">Nội thành Hà Nội</p>
                  </div>
                  <div className="text-center p-2">
                    <p className="text-base">🌸</p>
                    <p className="font-bold text-xs text-emerald-950 mt-1">Hoa Tươi Trong Ngày</p>
                    <p className="text-[10px] text-emerald-700">Đổi trả 100% nếu héo</p>
                  </div>
                  <div className="text-center p-2">
                    <p className="text-base">📸</p>
                    <p className="font-bold text-xs text-emerald-950 mt-1">Chụp Duyệt Ảnh Thật</p>
                    <p className="text-[10px] text-emerald-700">Trước khi giao</p>
                  </div>
                  <div className="text-center p-2">
                    <p className="text-base">🎁</p>
                    <p className="font-bold text-xs text-emerald-950 mt-1">Tặng Kèm Thiệp & Nơ</p>
                    <p className="text-[10px] text-emerald-700">In chữ nghệ thuật</p>
                  </div>
                </div>
              </CmsPreviewTarget>
            )}
          </div>
        );

      case 'products':
        return (
          <div className="space-y-6">
            <CmsPreviewTarget
              editor={previewEditor}
              target="productsHeader"
              label="Tiêu Đề & Bảng Giá Mẫu Hoa (Bấm để sửa)"
            >
              <div className="p-6 rounded-2xl bg-emerald-900 text-white space-y-2">
                <span className="text-xs uppercase tracking-wider text-emerald-300 font-bold">
                  BỘ SƯU TẬP HOA TƯƠI THIẾT KẾ
                </span>
                <h2 className="text-2xl font-bold">Khám Phá Các Mẫu Hoa Tươi Mới Nhất</h2>
                <p className="text-xs text-emerald-100">
                  Phân loại theo từng phong cách, gam màu pastel và mức giá minh bạch.
                </p>
              </div>
            </CmsPreviewTarget>
            <CmsPreviewTarget
              editor={previewEditor}
              target="categoriesFilter"
              label="Thanh Phân Loại Dịp Tặng Hoa (Bấm để sửa)"
            >
              <div className="flex gap-2 overflow-x-auto p-2 bg-white rounded-xl border border-slate-200">
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-bold text-xs shrink-0"
                >
                  Tất Cả Mẫu Hoa
                </button>
                {draftCategories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-medium text-xs shrink-0"
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </CmsPreviewTarget>
          </div>
        );

      case 'services':
        return (
          <div className="space-y-6">
            <CmsPreviewTarget
              editor={previewEditor}
              target="servicesIntro"
              label="Giới Thiệu Dịch Vụ Thiết Kế Hoa (Bấm để sửa)"
            >
              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
                <span className="text-xs font-bold text-emerald-700 uppercase">
                  DỊCH VỤ CHUYÊN NGHIỆP
                </span>
                <h3 className="text-xl font-bold text-slate-800">{draftServices.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{draftServices.subtitle}</p>
              </div>
            </CmsPreviewTarget>
            <CmsPreviewTarget
              editor={previewEditor}
              target="servicesWedding"
              label="Gói Hoa Cưới & Tiệc Sang Trọng (Bấm để sửa)"
            >
              <div className="p-6 rounded-2xl bg-pink-50/60 border border-pink-200 space-y-3">
                <span className="text-xs font-bold text-pink-700 uppercase">GÓI HOA CƯỚI 2026</span>
                <h3 className="text-lg font-bold text-slate-800">{draftServices.weddingTitle}</h3>
                <p className="text-xs text-slate-600">{draftServices.weddingSubtitle}</p>
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-pink-600 text-white font-bold text-xs"
                >
                  {draftServices.weddingCta}
                </button>
              </div>
            </CmsPreviewTarget>
          </div>
        );

      case 'articles':
        return (
          <div className="space-y-6">
            <CmsPreviewTarget
              editor={previewEditor}
              target="articlesHeader"
              label="Tiêu Đề Cẩm Nang Hoa Tươi (Bấm để sửa)"
            >
              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-purple-700 uppercase">
                  CẨM NANG & MẸO CHĂM HOA
                </span>
                <h3 className="text-xl font-bold text-slate-800">
                  Bí Quyết Giữ Hoa Tươi Lâu & Ý Nghĩa Từng Loài Hoa
                </h3>
                <p className="text-xs text-slate-600">
                  Chia sẻ từ chuyên gia cắm hoa nghệ thuật V&V Florielle Hà Nội.
                </p>
              </div>
            </CmsPreviewTarget>
            <CmsPreviewTarget
              editor={previewEditor}
              target="articlesList"
              label="Danh Sách Bài Viết (Bấm để sửa)"
            >
              <div className="space-y-3">
                {draftArticles.slice(0, 3).map((art) => (
                  <div
                    key={art.id}
                    className="p-3.5 rounded-xl bg-white border border-slate-100 flex gap-3 shadow-xs"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-200 shrink-0">
                      <img
                        src={art.imageUrl}
                        alt={art.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-slate-800 truncate">{art.title}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                        {art.summary}
                      </p>
                      <span className="text-[10px] text-emerald-700 font-bold mt-1 inline-block">
                        Đọc tiếp ›
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CmsPreviewTarget>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-6">
            <CmsPreviewTarget
              editor={previewEditor}
              target="aboutStory"
              label="Câu Chuyện Thương Hiệu (Bấm để sửa)"
            >
              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-emerald-700 uppercase">
                  {draftAbout.badge}
                </span>
                <h3 className="text-xl font-bold text-slate-800">{draftAbout.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{draftAbout.subtitle}</p>
              </div>
            </CmsPreviewTarget>
            <CmsPreviewTarget
              editor={previewEditor}
              target="aboutFlorist"
              label="Đội Ngũ Nghệ Nhân Florist (Bấm để sửa)"
            >
              <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                <span className="text-xs font-bold text-emerald-800 uppercase">
                  {draftAbout.floristBadge}
                </span>
                <h3 className="text-lg font-bold text-slate-800">{draftAbout.floristTitle}</h3>
                <p className="text-xs text-slate-600">{draftAbout.floristSubtitle}</p>
              </div>
            </CmsPreviewTarget>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-6">
            <CmsPreviewTarget
              editor={previewEditor}
              target="contactHotline"
              label="Hotline 24/7 & Showroom (Bấm để sửa)"
            >
              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-sky-700 uppercase">
                  {draftContact.badge}
                </span>
                <h3 className="text-xl font-bold text-slate-800">{draftContact.title}</h3>
                <div className="space-y-1 text-xs text-slate-700">
                  <p>
                    <strong>Hotline Đặt Hoa:</strong> {draftContact.hotline}
                  </p>
                  <p>
                    <strong>Địa chỉ:</strong> {draftContact.address}
                  </p>
                  <p>
                    <strong>Giờ mở cửa:</strong> {draftContact.openingHours}
                  </p>
                </div>
              </div>
            </CmsPreviewTarget>
            <CmsPreviewTarget
              editor={previewEditor}
              target="contactMap"
              label="Bản Đồ Showroom & Chỉ Đường (Bấm để sửa)"
            >
              <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-2">
                <h4 className="font-bold text-sm">Vị Trí Cửa Hàng Trên Bản Đồ</h4>
                <p className="text-xs text-slate-300">
                  105 Doãn Kế Thiện, Mai Dịch, Cầu Giấy, Hà Nội
                </p>
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs"
                >
                  {draftContact.mapCta}
                </button>
              </div>
            </CmsPreviewTarget>
          </div>
        );

      case 'footer':
        return (
          <div className="space-y-6">
            <CmsPreviewTarget
              editor={previewEditor}
              target="footerLinks"
              label="Chân Trang & Thông Tin Bản Quyền (Bấm để sửa)"
            >
              <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-3">
                <h3 className="text-lg font-bold text-emerald-400">{draftFooter.brandName}</h3>
                <p className="text-xs text-slate-300">{draftFooter.slogan}</p>
                <p className="text-xs text-slate-400">{draftFooter.hotlineText}</p>
                <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500">
                  {draftFooter.copyright}
                </div>
              </div>
            </CmsPreviewTarget>
          </div>
        );

      case 'branding':
        return (
          <div className="space-y-6">
            <CmsPreviewTarget
              editor={previewEditor}
              target="brandIdentity"
              label="Tên Thương Hiệu & Slogan (Bấm để sửa)"
            >
              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-emerald-700 uppercase">
                  NHẬN DIỆN THƯƠNG HIỆU
                </span>
                <h2 className="text-2xl font-black text-slate-900">{draftBranding.brandName}</h2>
                <p className="text-xs text-slate-600">{draftBranding.brandSlogan}</p>
              </div>
            </CmsPreviewTarget>
            <CmsPreviewTarget
              editor={previewEditor}
              target="brandMascot"
              label="Linh Vật Trợ Lý Ảo Flori (Bấm để sửa)"
            >
              <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white border border-amber-200 flex items-center justify-center text-3xl shadow-xs">
                  🌸
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800">{draftBranding.mascotName}</h4>
                  <p className="text-xs text-slate-600">
                    Linh vật hoạt họa hỗ trợ khách hàng, chọn hoa và nhận diện thương hiệu.
                  </p>
                </div>
              </div>
            </CmsPreviewTarget>
          </div>
        );

      default:
        return null;
    }
  };

  // ==========================================
  // RENDER RIGHT INSPECTOR FORM
  // ==========================================
  const renderInspector = () => {
    switch (workspaceItem) {
      case 'hero':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Huy hiệu nhỏ (Badge)</label>
              <input
                type="text"
                value={draftHero.badge || ''}
                onChange={(e) => setDraftHero({ ...draftHero, badge: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-emerald-600"
                placeholder="Tiệm Hoa Tươi Nghệ Thuật..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tiêu đề chính (Title)</label>
              <input
                type="text"
                value={draftHero.title || ''}
                onChange={(e) => setDraftHero({ ...draftHero, title: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-emerald-600"
                placeholder="Hoa Tươi Thiết Kế..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mô tả phụ (Subtitle)</label>
              <textarea
                rows={3}
                value={draftHero.subtitle || ''}
                onChange={(e) => setDraftHero({ ...draftHero, subtitle: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-emerald-600"
                placeholder="Mỗi bó hoa là một tác phẩm..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nút bấm chính (CTA Text)</label>
              <input
                type="text"
                value={draftHero.ctaText || ''}
                onChange={(e) => setDraftHero({ ...draftHero, ctaText: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-emerald-600"
                placeholder="Khám Phá Mẫu Hoa Ngay"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">URL Ảnh nền Hero</label>
              <input
                type="text"
                value={draftHero.backgroundImage || ''}
                onChange={(e) => setDraftHero({ ...draftHero, backgroundImage: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-emerald-600 font-mono"
                placeholder="https://..."
              />
            </div>
          </div>
        );

      case 'categories':
      case 'categoriesFilter':
        return (
          <div className="space-y-4">
            <p className="text-xs text-slate-600">
              Chỉnh sửa thông tin 6 dịp tặng hoa hiển thị trên trang chủ và bộ lọc:
            </p>
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {draftCategories.slice(0, 6).map((cat, idx) => (
                <div key={cat.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <span className="text-[10px] font-bold uppercase text-emerald-700">
                    Dịp #{idx + 1}: {cat.name}
                  </span>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600">Tên Dịp</label>
                    <input
                      type="text"
                      value={cat.name}
                      onChange={(e) => {
                        const updated = [...draftCategories];
                        updated[idx] = { ...updated[idx], name: e.target.value };
                        setDraftCategories(updated);
                      }}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600">Mô tả ngắn</label>
                    <input
                      type="text"
                      value={cat.description || ''}
                      onChange={(e) => {
                        const updated = [...draftCategories];
                        updated[idx] = { ...updated[idx], description: e.target.value };
                        setDraftCategories(updated);
                      }}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600">URL Ảnh đại diện</label>
                    <input
                      type="text"
                      value={cat.imageUrl || ''}
                      onChange={(e) => {
                        const updated = [...draftCategories];
                        updated[idx] = { ...updated[idx], imageUrl: e.target.value };
                        setDraftCategories(updated);
                      }}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white font-mono text-[10px]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'bestseller':
      case 'productsHeader':
      case 'productsGrid':
        return (
          <div className="space-y-4">
            <p className="text-xs text-slate-600">
              Khu vực hiển thị các mẫu hoa bán chạy nhất tiệm. Mẫu hoa được quản lý tự động từ phân hệ Kho Mẫu Hoa.
            </p>
            <div className="p-3.5 rounded-xl bg-pink-50/80 border border-pink-200 text-xs text-pink-900 space-y-1.5">
              <p className="font-bold">💡 Mẹo trưng bày Bestseller:</p>
              <p className="text-[11px] leading-relaxed">
                Để gán một mẫu hoa vào danh sách Bestseller xuất hiện ở vị trí ưu tiên trên trang chủ, bạn hãy vào <strong>Kho Mẫu Hoa</strong> và bật công tắc <strong>Best Seller</strong> của sản phẩm đó.
              </p>
            </div>
          </div>
        );

      case 'promotions':
        return (
          <div className="space-y-4">
            <p className="text-xs text-slate-600">
              Chỉnh sửa thông điệp ưu đãi của các mã voucher nổi bật hiển thị trên trang chủ:
            </p>
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {draftPromotions.slice(0, 3).map((promo, idx) => (
                <div key={promo.id} className="p-3 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
                  <span className="text-[10px] font-bold uppercase text-amber-800">
                    Voucher #{idx + 1}: {promo.code}
                  </span>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600">Mã Code</label>
                    <input
                      type="text"
                      value={promo.code}
                      onChange={(e) => {
                        const updated = [...draftPromotions];
                        updated[idx] = { ...updated[idx], code: e.target.value.toUpperCase() };
                        setDraftPromotions(updated);
                      }}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600">Mô tả hiển thị</label>
                    <input
                      type="text"
                      value={promo.description}
                      onChange={(e) => {
                        const updated = [...draftPromotions];
                        updated[idx] = { ...updated[idx], description: e.target.value };
                        setDraftPromotions(updated);
                      }}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600">Số tiền giảm (VNĐ)</label>
                    <input
                      type="number"
                      value={promo.discountAmount}
                      onChange={(e) => {
                        const updated = [...draftPromotions];
                        updated[idx] = { ...updated[idx], discountAmount: Number(e.target.value) };
                        setDraftPromotions(updated);
                      }}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'trustBadges':
        return (
          <div className="space-y-4">
            <p className="text-xs text-slate-600">
              Khu vực 4 cam kết chất lượng hoa tươi (Giao nhanh 15-60p, hoa tươi trong ngày, chụp ảnh thật, quà tặng thiệp & nơ).
            </p>
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
              <p className="font-bold">✅ Tiêu chuẩn cam kết V&V Florielle</p>
              <p className="text-[11px] text-emerald-800">
                Hiển thị nổi bật giúp tăng 45% tỷ lệ chốt đơn và sự tin cậy của khách hàng đặt hoa online.
              </p>
            </div>
          </div>
        );

      case 'servicesIntro':
      case 'servicesWedding':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tiêu đề dịch vụ chính</label>
              <input
                type="text"
                value={draftServices.title}
                onChange={(e) => setDraftServices({ ...draftServices, title: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mô tả dịch vụ</label>
              <textarea
                rows={3}
                value={draftServices.subtitle}
                onChange={(e) => setDraftServices({ ...draftServices, subtitle: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-emerald-600"
              />
            </div>
            <div className="pt-2 border-t border-slate-200 space-y-3">
              <span className="text-[11px] font-bold uppercase text-pink-700">Khối Hoa Cưới</span>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tiêu đề gói cưới</label>
                <input
                  type="text"
                  value={draftServices.weddingTitle}
                  onChange={(e) => setDraftServices({ ...draftServices, weddingTitle: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nút bấm đặt lịch</label>
                <input
                  type="text"
                  value={draftServices.weddingCta}
                  onChange={(e) => setDraftServices({ ...draftServices, weddingCta: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-emerald-600"
                />
              </div>
            </div>
          </div>
        );

      case 'aboutStory':
      case 'aboutFlorist':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Huy hiệu giới thiệu</label>
              <input
                type="text"
                value={draftAbout.badge}
                onChange={(e) => setDraftAbout({ ...draftAbout, badge: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tiêu đề câu chuyện</label>
              <input
                type="text"
                value={draftAbout.title}
                onChange={(e) => setDraftAbout({ ...draftAbout, title: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nội dung câu chuyện</label>
              <textarea
                rows={3}
                value={draftAbout.subtitle}
                onChange={(e) => setDraftAbout({ ...draftAbout, subtitle: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-emerald-600"
              />
            </div>
            <div className="pt-2 border-t border-slate-200 space-y-3">
              <span className="text-[11px] font-bold uppercase text-emerald-800">Khối Đội Ngũ Florist</span>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tiêu đề nghệ nhân</label>
                <input
                  type="text"
                  value={draftAbout.floristTitle}
                  onChange={(e) => setDraftAbout({ ...draftAbout, floristTitle: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-emerald-600"
                />
              </div>
            </div>
          </div>
        );

      case 'contactHotline':
      case 'contactMap':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tiêu đề liên hệ</label>
              <input
                type="text"
                value={draftContact.title}
                onChange={(e) => setDraftContact({ ...draftContact, title: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Hotline Đặt Hoa</label>
              <input
                type="text"
                value={draftContact.hotline}
                onChange={(e) => setDraftContact({ ...draftContact, hotline: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-emerald-600 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Địa chỉ showroom</label>
              <input
                type="text"
                value={draftContact.address}
                onChange={(e) => setDraftContact({ ...draftContact, address: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Giờ mở cửa</label>
              <input
                type="text"
                value={draftContact.openingHours}
                onChange={(e) => setDraftContact({ ...draftContact, openingHours: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-emerald-600"
              />
            </div>
          </div>
        );

      case 'footerLinks':
      case 'footerPolicy':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tên thương hiệu chân trang</label>
              <input
                type="text"
                value={draftFooter.brandName}
                onChange={(e) => setDraftFooter({ ...draftFooter, brandName: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Slogan chân trang</label>
              <input
                type="text"
                value={draftFooter.slogan}
                onChange={(e) => setDraftFooter({ ...draftFooter, slogan: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Dòng bản quyền (Copyright)</label>
              <input
                type="text"
                value={draftFooter.copyright}
                onChange={(e) => setDraftFooter({ ...draftFooter, copyright: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-emerald-600"
              />
            </div>
          </div>
        );

      case 'brandIdentity':
      case 'brandMascot':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tên thương hiệu</label>
              <input
                type="text"
                value={draftBranding.brandName}
                onChange={(e) => setDraftBranding({ ...draftBranding, brandName: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Slogan chính</label>
              <input
                type="text"
                value={draftBranding.brandSlogan}
                onChange={(e) => setDraftBranding({ ...draftBranding, brandSlogan: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tên linh vật tiệm hoa</label>
              <input
                type="text"
                value={draftBranding.mascotName}
                onChange={(e) => setDraftBranding({ ...draftBranding, mascotName: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-emerald-600"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8 text-slate-400 text-xs">
            Chọn một thành phần trên cây thư mục bên trái hoặc nhấp trực tiếp vào bản xem trước ở giữa để chỉnh sửa.
          </div>
        );
    }
  };

  return (
    <main className="portal cms-portal-container pb-28">
      {/* 1. CMS Welcome Section (Chưa mở Workspace) */}
      {!desktopWorkspaceOpen && (
        <section className="cms-editor-welcome" aria-label="Chọn khu vực muốn chỉnh sửa">
          <div className="cms-editor-welcome-watermark" aria-hidden="true">
            🌸
          </div>
          <span className="cms-editor-welcome-kicker">QUẢN LÝ NỘI DUNG PUBLIC</span>
          <h2>Chọn khu vực muốn chỉnh sửa</h2>
          <p>Chọn một khu vực để mở bản xem trước và chỉnh sửa từng thành phần trong giao diện Public.</p>
          {hasUnsavedChanges && (
            <span className="cms-editor-welcome-draft">● Có thay đổi chưa lưu</span>
          )}
          <div className="cms-editor-welcome-grid">
            {cmsWelcomePages.map(({ key, label, icon, description }) => (
              <button
                key={key}
                type="button"
                className="cms-editor-welcome-card"
                onClick={() => openWorkspace(key)}
              >
                <span className="cms-editor-welcome-card-icon">{icon}</span>
                <span className="cms-editor-welcome-card-copy">
                  <strong>{label}</strong>
                  <small>{description}</small>
                </span>
                <span className="cms-editor-welcome-card-arrow" aria-hidden="true">›</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* 2. Full-Screen CMS Editor Workspace Overlay (Chuẩn PhotoTiinLove) */}
      {desktopWorkspaceOpen && (
        <div
          className="cms-desktop-editor-backdrop"
          aria-label="Đóng cửa sổ chỉnh sửa"
          onClick={handleCloseWorkspace}
        />
      )}
      {desktopWorkspaceOpen && (
        <section
          className="cms-desktop-editor-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={currentWorkspaceMeta.title}
        >
          <header className="cms-desktop-editor-header">
            <div>
              <small>CHỈNH SỬA WEBSITE</small>
              <h2>{currentWorkspaceMeta.title}</h2>
            </div>
            <div className="cms-desktop-editor-header-actions">
              <span className="cms-preview-draft-badge">Bản nháp</span>
              <button
                type="button"
                className="secondary"
                aria-label="Đóng chỉnh sửa"
                onClick={handleCloseWorkspace}
              >
                Đóng
              </button>
            </div>
          </header>

          <div className="cms-desktop-editor-grid">
            {/* Column 1: Tree (Desktop left column | Mobile top horizontal scrollbar) */}
            <aside
              className="cms-desktop-editor-tree"
              aria-label={`Thành phần ${currentWorkspaceMeta.title}`}
            >
              <div className="cms-builder-pane-title">
                <span>☰</span>
                <strong>{currentWorkspaceMeta.shortTitle}</strong>
              </div>
              <div className="cms-builder-group">
                <span>THÀNH PHẦN</span>
                {currentTree.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={workspaceItem === item.id ? 'active' : ''}
                    onClick={() => changeWorkspaceItem(item.id)}
                  >
                    <span>•</span>
                    {item.label}
                  </button>
                ))}
              </div>
            </aside>

            {/* Column 2: Live Canvas (Desktop center | Mobile live scrollable canvas) */}
            <section
              className="cms-desktop-editor-preview"
              aria-label="Bản xem trước website"
            >
              <div className="cms-builder-preview-bar">
                <span>👆 Chọn thành phần để chỉnh sửa</span>
                <div className="cms-builder-preview-actions">
                  <span>Xem trước mở rộng</span>
                </div>
              </div>
              <div className="cms-desktop-editor-canvas">
                <div className="cms-desktop-editor-frame">
                  {renderCanvasPreview()}
                </div>
              </div>
            </section>

            {/* Mobile Inspector Backdrop (Div only, dark glass blur) */}
            {mobileHomeInspectorOpen && (
              <div
                className="cms-desktop-mobile-inspector-backdrop"
                aria-label="Đóng bảng chỉnh sửa"
                onClick={() => setMobileHomeInspectorOpen(false)}
              />
            )}

            {/* Column 3: Inspector (Desktop right panel | Mobile floating bottom sheet / popup) */}
            <aside
              className={`cms-desktop-editor-inspector ${mobileHomeInspectorOpen ? 'mobile-open' : ''}`}
              aria-label="Bảng chỉnh sửa"
            >
              <button
                type="button"
                className="cms-desktop-mobile-inspector-close"
                aria-label="Đóng bảng chỉnh sửa"
                onClick={() => setMobileHomeInspectorOpen(false)}
              >
                ×
              </button>
              <div className="cms-inspector-heading">
                <div>
                  <small>{currentWorkspaceMeta.shortTitle.toUpperCase()}</small>
                  <h3>{currentTree.find((item) => item.id === workspaceItem)?.label || 'Thuộc tính'}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => toggleSection(workspaceItem)}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 cursor-pointer"
                  title="Ẩn/hiện khối này trên web"
                >
                  {sectionsVisibility[workspaceItem] !== false ? '👁 Hiển thị' : '◉̸ Đang ẩn'}
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {renderInspector()}
              </div>

              <div className="cms-inspector-actions">
                <button
                  type="button"
                  className="secondary"
                  onClick={handleDiscardChanges}
                >
                  Hủy thay đổi
                </button>
                <button
                  type="button"
                  className="primary"
                  onClick={handleSaveAndApply}
                >
                  Lưu thay đổi
                </button>
              </div>
            </aside>
          </div>
        </section>
      )}

      {/* 3. In-App Discard Confirmation Modal (No window.confirm) */}
      {showDiscardConfirm && (
        <div className="fixed inset-0 z-[2010] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto text-xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-extrabold text-base text-slate-900">Hủy Các Thay Đổi?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Bạn đang có các thay đổi chưa được lưu vào hệ thống. Bạn có chắc chắn muốn hủy bỏ và đóng trình chỉnh sửa không?
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDiscardConfirm(false)}
                className="py-2.5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Tiếp tục sửa
              </button>
              <button
                type="button"
                onClick={handleDiscardChanges}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-colors cursor-pointer"
              >
                Hủy thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
