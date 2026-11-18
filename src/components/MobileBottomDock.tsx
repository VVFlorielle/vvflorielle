import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Home,
  Sparkles,
  ShoppingCart,
  User,
  ShoppingBag,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Search,
  Store,
  FileSearch,
  PackageCheck,
  Compass,
  Flower2,
  Palette,
  Truck,
  BookOpen,
  PhoneCall,
  Smartphone,
  Download,
  X,
  Settings,
  ScanLine
} from 'lucide-react';
import { PopupType } from './InfoPopups';
import { CategoryId } from '../types';
import { useBodyScrollLock } from '../utils/scrollLock';

interface MobileBottomDockProps {
  onOpenCategories?: () => void;
  onOpenPopup?: (type: PopupType) => void;
  onOpenQrScanner?: () => void;
}

export const MobileBottomDock: React.FC<MobileBottomDockProps> = ({
  onOpenCategories,
  onOpenPopup,
  onOpenQrScanner,
}) => {
  const {
    currentView,
    setCurrentView,
    cart,
    setIsCartOpen,
    customer,
    isAdmin,
    activeAdminUser,
    isAuthModalOpen,
    setIsAuthModalOpen,
    setAuthModalMode,
    setSelectedCategory,
    categories,
    settings,
  } = useStore();

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const isLoggedIn = Boolean(customer || isAdmin);

  // Unfurl Dock 1 expanded state (when logged in)
  const [isExpanded, setIsExpanded] = useState(false);
  const autoCollapseTimer = useRef<any>(null);

  // Mobile Drawer Sheets (when guest)
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
  const [isUtilityMenuOpen, setIsUtilityMenuOpen] = useState(false);

  // Lock background scroll when drawer is open
  useBodyScrollLock(isCategorySheetOpen || isUtilityMenuOpen);

  // Scroll Hide / Reveal state (matching phototiinlove)
  const [hidden, setHidden] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const touchTimer = useRef<any>(null);

  const handleUserInteract = () => {
    setIsTouched(true);
    setHidden(false);
    if (touchTimer.current) clearTimeout(touchTimer.current);
    touchTimer.current = setTimeout(() => setIsTouched(false), 600);
  };

  const resetAutoCollapse = useCallback(() => {
    if (autoCollapseTimer.current) clearTimeout(autoCollapseTimer.current);
    autoCollapseTimer.current = setTimeout(() => {
      setIsExpanded(false);
    }, 20000); // 20s auto collapse
  }, []);

  // Auto-collapse Unfurl Dock when scrolling
  useEffect(() => {
    if (!isExpanded) {
      if (autoCollapseTimer.current) clearTimeout(autoCollapseTimer.current);
      return;
    }
    resetAutoCollapse();
    let lastY = window.scrollY;
    const handleScroll = () => {
      if (Math.abs(window.scrollY - lastY) > 20) {
        setIsExpanded(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (autoCollapseTimer.current) clearTimeout(autoCollapseTimer.current);
    };
  }, [isExpanded, resetAutoCollapse]);

  // Main Dock Scroll Hide / Reveal Effect (hides on scroll, reappears instantly on stop 180ms or bottom mouse)
  useEffect(() => {
    let scrollStopTimer: any = null;
    let lastY = window.scrollY;

    const handleScroll = () => {
      const current = window.scrollY;
      if (Math.abs(current - lastY) > 4 && current > 20) {
        setHidden(true);
      }
      lastY = current;

      clearTimeout(scrollStopTimer);
      scrollStopTimer = setTimeout(() => {
        setHidden(false);
      }, 180);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY >= window.innerHeight - 100) {
        setHidden(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      if (scrollStopTimer) clearTimeout(scrollStopTimer);
    };
  }, []);

  const handleBack = () => {
    handleUserInteract();
    if (currentView !== 'store') {
      setCurrentView('store');
    } else if (window.history.length > 1) {
      window.history.back();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectCategory = (catId: CategoryId) => {
    setIsExpanded(false);
    setIsCategorySheetOpen(false);
    setSelectedCategory(catId);
    if (currentView !== 'store') {
      setCurrentView('store');
    }
    setTimeout(() => {
      const el = document.getElementById('featured-flowers') || document.getElementById('categories-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleCatalogClick = () => {
    handleUserInteract();
    setIsCategorySheetOpen(false);
    setIsUtilityMenuOpen(false);
    setSelectedCategory('all');
    setCurrentView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderLookupClick = () => {
    handleUserInteract();
    setIsCategorySheetOpen(false);
    setIsUtilityMenuOpen(false);
    setAuthModalMode('customer');
    setIsAuthModalOpen(true);
  };

  const handleOrdersClick = () => {
    handleUserInteract();
    setIsCategorySheetOpen(false);
    setIsUtilityMenuOpen(false);
    if (isAdmin) {
      const targetAdminView = (activeAdminUser === 'vvflorielle' || activeAdminUser === 'chuquan') ? 'owner' : 'admin';
      setCurrentView(targetAdminView);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (customer) {
      setCurrentView('customer');
      setTimeout(() => {
        const el = document.getElementById('customer-orders-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      handleOrderLookupClick();
    }
  };

  const handleAccountSwitchClick = () => {
    handleUserInteract();
    setIsCategorySheetOpen(false);
    setIsUtilityMenuOpen(false);
    if (isAdmin) {
      const targetAdminView = (activeAdminUser === 'vvflorielle' || activeAdminUser === 'chuquan') ? 'owner' : 'admin';
      setCurrentView(currentView === targetAdminView ? 'store' : targetAdminView);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (customer) {
      setCurrentView(currentView === 'customer' ? 'store' : 'customer');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setAuthModalMode('customer');
      setIsAuthModalOpen(true);
    }
  };

  return (
    <>
      {/* ================================================================
          DOCK 1: THANH PHỤ MỞ RỘNG (UNFURL DOCK) KHI ĐÃ ĐĂNG NHẬP (MOBILE)
          Nút tròn bánh răng bóng kính 44x44 nhô lên trên dock chính ~12px.
          Bấm bung ra thanh cuộn menu danh mục & cẩm nang, tự thu gọn sau 20s.
          ================================================================ */}
      {isLoggedIn && (
        <div
          className={`fixed left-[calc(14px+env(safe-area-inset-left,0px))] bottom-[calc(76px+env(safe-area-inset-bottom,0px))] z-[9991] md:hidden flex items-center pointer-events-auto transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            hidden ? 'translate-y-[120px] opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
          }`}
          onTouchStart={resetAutoCollapse}
          onMouseEnter={resetAutoCollapse}
        >
          <div className={`flex items-center rounded-full bg-white/20 backdrop-blur-xl border border-white/60 shadow-[0_8px_24px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.85)] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden p-0 ${
            isExpanded ? 'h-11 max-w-[calc(100vw-28px)]' : 'w-11 h-11'
          }`}>
            {/* Nút tròn bánh răng: Chạm để trượt mở hoặc trượt thu gọn (luôn tròn xoe 44x44, không bị ép dẹt) */}
            <button
              type="button"
              onClick={() => {
                handleUserInteract();
                setIsExpanded(!isExpanded);
              }}
              className={`w-11 h-11 rounded-full aspect-square flex items-center justify-center transition-all duration-300 shrink-0 cursor-pointer p-0 select-none ${
                isExpanded
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                  : 'bg-white/80 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700'
              }`}
              title={isExpanded ? 'Thu gọn menu' : 'Mở menu chức năng phụ'}
            >
              <Settings className={`w-5 h-5 transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${isExpanded ? 'rotate-90' : ''}`} />
            </button>

            {/* Khay trượt Slide-out / Slide-in êm ái, thích ứng không tràn viền, chiều cao bằng bánh răng */}
            <div
              className={`overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center ${
                isExpanded
                  ? 'max-w-[calc(100vw-80px)] opacity-100 translate-x-0'
                  : 'max-w-0 opacity-0 -translate-x-4 pointer-events-none'
              }`}
            >
              <nav
                className="flex items-center gap-1 pl-1.5 pr-2 whitespace-nowrap overflow-x-auto no-scrollbar scroll-smooth"
                aria-label="Menu chức năng mở rộng"
              >
                <button
                  type="button"
                  className="h-8 px-2.5 rounded-full hover:bg-white/70 text-slate-800 transition-colors shrink-0 cursor-pointer active:scale-95 flex items-center gap-1"
                  onClick={() => {
                    setIsExpanded(false);
                    handleCatalogClick();
                  }}
                  title="Mẫu hoa tươi"
                >
                  <img src="/icons/icon-catalog-3d.png" alt="Mẫu hoa" className="w-4 h-4 object-contain shrink-0" />
                  <span className="text-[10.5px] font-bold">Mẫu Hoa</span>
                </button>

                <button
                  type="button"
                  className="h-8 px-2.5 rounded-full hover:bg-white/70 text-slate-800 transition-colors shrink-0 cursor-pointer active:scale-95 flex items-center gap-1"
                  onClick={() => {
                    setIsExpanded(false);
                    setCurrentView('care');
                  }}
                  title="Cẩm nang dưỡng hoa"
                >
                  <img src="/icons/icon-care-3d.png" alt="Cẩm nang" className="w-4 h-4 object-contain shrink-0" />
                  <span className="text-[10.5px] font-bold">Cẩm Nang</span>
                </button>

                <button
                  type="button"
                  className="h-8 px-2.5 rounded-full hover:bg-white/70 text-slate-800 transition-colors shrink-0 cursor-pointer active:scale-95 flex items-center gap-1"
                  onClick={() => {
                    setIsExpanded(false);
                    setCurrentView('about');
                  }}
                  title="Giới thiệu tiệm hoa"
                >
                  <img src="/icons/icon-services-3d.png" alt="Giới thiệu" className="w-4 h-4 object-contain shrink-0" />
                  <span className="text-[10.5px] font-bold">Giới Thiệu</span>
                </button>

                <button
                  type="button"
                  className="h-8 px-2.5 rounded-full hover:bg-white/70 text-slate-800 transition-colors shrink-0 cursor-pointer active:scale-95 flex items-center gap-1"
                  onClick={() => {
                    setIsExpanded(false);
                    setCurrentView('contact');
                  }}
                  title="Liên hệ & Chỉ đường"
                >
                  <img src="/icons/icon-contact-3d.png" alt="Liên hệ" className="w-4 h-4 object-contain shrink-0" />
                  <span className="text-[10.5px] font-bold">Liên Hệ</span>
                </button>

                <button
                  type="button"
                  className="h-8 px-2.5 rounded-full hover:bg-white/70 text-slate-800 transition-colors shrink-0 cursor-pointer active:scale-95 flex items-center gap-1"
                  onClick={() => {
                    setIsExpanded(false);
                    if (onOpenPopup) onOpenPopup('voucher');
                  }}
                  title="Voucher & Tích điểm"
                >
                  <img src="/icons/icon-gift-3d.png" alt="Ưu đãi" className="w-4 h-4 object-contain shrink-0" />
                  <span className="text-[10.5px] font-bold">Ưu Đãi</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================
          POPOVER 1: MẪU HOA & DỊCH VỤ (FLOATING CARD TRÊN THANH DOCK)
          ================================================================ */}
      {isCategorySheetOpen && (
        <div className="md:hidden">
          {/* Backdrop mờ nhẹ, click vào đóng menu */}
          <div
            className="fixed inset-0 z-[9991] bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200 pointer-events-auto"
            onClick={() => setIsCategorySheetOpen(false)}
          />
          {/* Floating Card nổi ngay phía trên thanh Dock */}
          <div className="fixed bottom-[74px] sm:bottom-[82px] left-3 right-3 max-w-[420px] mx-auto z-[9992] p-4 bg-white/95 backdrop-blur-2xl rounded-[28px] border border-white/90 shadow-[0_16px_40px_rgba(0,0,0,0.18)] space-y-3 max-h-[74vh] overflow-y-auto animate-in fade-in zoom-in-95 slide-in-from-bottom-3 duration-200">
            {/* Header popup */}
            <div className="relative flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <img src="/icons/icon-catalog-3d.png" alt="Mẫu hoa" className="w-5 h-5 object-contain" />
                <span className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">Mẫu Hoa &amp; Dịch Vụ</span>
              </div>
              <button
                type="button"
                onClick={() => setIsCategorySheetOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                title="Đóng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mục 1: Tất Cả Mẫu Hoa (Mở Trang Riêng) */}
            <div
              onClick={() => {
                setIsCategorySheetOpen(false);
                setSelectedCategory('all');
                setCurrentView('catalog');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-800 text-white cursor-pointer shadow-md flex items-center justify-between hover:shadow-lg transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <img src="/icons/icon-catalog-3d.png" alt="Tất cả hoa" className="w-5 h-5 object-contain" />
                </div>
                <div>
                  <div className="font-black text-xs flex items-center gap-1.5">
                    <span>Tất Cả Mẫu Hoa</span>
                    <span className="text-[9px] bg-emerald-300 text-emerald-950 font-black px-1.5 py-0.2 rounded-full">Trang riêng</span>
                  </div>
                  <div className="text-[10px] text-emerald-100">Bộ lọc chi tiết, sắp xếp giá &amp; tìm kiếm hoa</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white shrink-0" />
            </div>

            {/* Mục 2: Danh Mục Mẫu Hoa Tươi */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">Danh Mục Mẫu Hoa</span>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => {
                      setIsCategorySheetOpen(false);
                      handleSelectCategory(cat.id);
                    }}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-100 flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
                  >
                    <Flower2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="text-xs font-semibold text-slate-800 truncate">{cat.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mục 3: Dịch Vụ Hoa Tươi Chuyên Nghiệp */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">Dịch Vụ Hoa Chuyên Nghiệp</span>
              <div className="space-y-2">
                <div
                  onClick={() => {
                    setIsCategorySheetOpen(false);
                    if (onOpenPopup) onOpenPopup('custom-design');
                  }}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-100 flex items-center justify-between cursor-pointer active:scale-95 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-rose-600 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-slate-800">Hoa Thiết Kế Riêng Theo Yêu Cầu</div>
                      <div className="text-[10px] text-slate-400">Gửi ảnh mẫu, chọn ngân sách &amp; duyệt mẫu</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 shrink-0">Mở mẫu →</span>
                </div>

                <div
                  onClick={() => {
                    setIsCategorySheetOpen(false);
                    if (onOpenPopup) onOpenPopup('shipping');
                  }}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-100 flex items-center justify-between cursor-pointer active:scale-95 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-sky-600 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-slate-800">Giao Hoa Hỏa Tốc (Từ 15P)</div>
                      <div className="text-[10px] text-slate-400">Từ 15P nội thành &amp; 60P ngoại thành Hà Nội</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-sky-700 shrink-0">Giá ship →</span>
                </div>

                <div
                  onClick={() => {
                    setIsCategorySheetOpen(false);
                    if (onOpenPopup) onOpenPopup('wedding-event');
                  }}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-100 flex items-center justify-between cursor-pointer active:scale-95 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-slate-800">Hoa Cưới &amp; Sự Kiện Doanh Nghiệp</div>
                      <div className="text-[10px] text-slate-400">Hoa cô dâu, trang trí xe hoa, hội nghị &amp; xuất VAT</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-amber-700 shrink-0">Chi tiết →</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================
          POPOVER 2: TIỆN ÍCH & TRA CỨU (FLOATING CARD TRÊN THANH DOCK)
          ================================================================ */}
      {isUtilityMenuOpen && (
        <div className="md:hidden">
          {/* Backdrop mờ nhẹ, click vào đóng menu */}
          <div
            className="fixed inset-0 z-[9991] bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200 pointer-events-auto"
            onClick={() => setIsUtilityMenuOpen(false)}
          />
          {/* Floating Card nổi ngay phía trên thanh Dock */}
          <div className="fixed bottom-[74px] sm:bottom-[82px] left-3 right-3 max-w-[420px] mx-auto z-[9992] p-4 bg-white/95 backdrop-blur-2xl rounded-[28px] border border-white/90 shadow-[0_16px_40px_rgba(0,0,0,0.18)] space-y-2.5 max-h-[74vh] overflow-y-auto animate-in fade-in zoom-in-95 slide-in-from-bottom-3 duration-200">
            {/* Header popup */}
            <div className="relative flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <img src="/icons/icon-services-3d.png" alt="Tiện ích" className="w-5 h-5 object-contain" />
                <span className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">Tiện Ích &amp; Thông Tin Tiệm</span>
              </div>
              <button
                type="button"
                onClick={() => setIsUtilityMenuOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                title="Đóng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 1. Giới Thiệu (Mở Trang Riêng) */}
            <div
              onClick={() => {
                setIsUtilityMenuOpen(false);
                setCurrentView('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-3 rounded-2xl bg-white hover:bg-emerald-50/80 border border-slate-200/80 flex items-center justify-between cursor-pointer active:scale-95 transition-all shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Flower2 className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">Giới Thiệu Tiệm Hoa V&V Florielle</div>
                  <div className="text-[10px] text-slate-500">Tiệm Hoa V&V Florielle • Câu chuyện nghệ thuật hoa</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            </div>

            {/* 2. Cẩm Nang Dưỡng Hoa (Mở Popup Thư Viện Kiến Thức) */}
            <div
              onClick={() => {
                setIsUtilityMenuOpen(false);
                if (onOpenPopup) onOpenPopup('care');
              }}
              className="p-3 rounded-2xl bg-white hover:bg-emerald-50/80 border border-slate-200/80 flex items-center justify-between cursor-pointer active:scale-95 transition-all shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">Cẩm Nang &amp; Ý Nghĩa Hoa</div>
                  <div className="text-[10px] text-slate-500">Bí quyết giữ hoa 7 ngày &amp; ý nghĩa các loài hoa</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            </div>

            {/* 3. Liên Hệ & Bản Đồ (Mở Trang Riêng) */}
            <div
              onClick={() => {
                setIsUtilityMenuOpen(false);
                setCurrentView('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-3 rounded-2xl bg-white hover:bg-emerald-50/80 border border-slate-200/80 flex items-center justify-between cursor-pointer active:scale-95 transition-all shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                  <PhoneCall className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">Liên Hệ &amp; Bản Đồ Chỉ Đường</div>
                  <div className="text-[10px] text-slate-500">Hotline: {settings.hotline} • Mở cửa 06:30 - 21:30</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            </div>

            {/* 4. Tra Cứu Đơn Hàng & VietQR */}
            <div
              onClick={() => {
                setIsUtilityMenuOpen(false);
                handleOrderLookupClick();
              }}
              className="p-3 rounded-2xl bg-white hover:bg-emerald-50/80 border border-slate-200/80 flex items-center justify-between cursor-pointer active:scale-95 transition-all shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                  <FileSearch className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">Tra Cứu Tình Trạng Đơn Hàng</div>
                  <div className="text-[10px] text-slate-500">Xem tiến độ cắm hoa &amp; đối soát cọc VietQR</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            </div>

            {/* 5. Cài Đặt & Tải App APK */}
            <div
              onClick={() => {
                setIsUtilityMenuOpen(false);
                if (onOpenPopup) onOpenPopup('app-download');
              }}
              className="p-3 rounded-2xl bg-emerald-50/90 border border-emerald-300 flex items-center justify-between cursor-pointer active:scale-95 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Smartphone className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-emerald-950">Cài Đặt &amp; Tải App APK</span>
                    <span className="text-[9px] bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded-full">0.85MB</span>
                  </div>
                  <div className="text-[10px] text-slate-600">File cài đặt Android chính thức cho điện thoại</div>
                </div>
              </div>
              <Download className="w-4 h-4 text-emerald-700 shrink-0" />
            </div>
          </div>
        </div>
      )}

      {/* ================================================================
          DOCK CHÍNH (5 NÚT CÔNG KHAI KHI GUEST / 5 NÚT ĐIỀU HÀNH KHI LOGGED IN)
          ================================================================ */}
      <nav
        className={`management-bottom-nav md:hidden ${hidden && !isTouched ? 'management-nav-hidden' : ''}`}
        aria-label="Thanh điều hướng chính"
        onTouchStart={handleUserInteract}
        onMouseEnter={handleUserInteract}
      >
        {isLoggedIn ? (
          // ==================== ĐÃ ĐĂNG NHẬP (QUẢN TRỊ / KHÁCH HÀNG) ====================
          <>
            {/* 1. Quay lại */}
            <button
              type="button"
              onClick={handleBack}
              className="min-w-0 flex-1 flex flex-col items-center justify-center h-[48px] py-0.5 px-0.5 rounded-2xl text-slate-600 hover:text-emerald-800 transition-all active:scale-95 cursor-pointer"
              title="Quay lại"
            >
              <img src="/icons/icon-back-3d.png" alt="Quay lại" className="w-6 h-6 object-contain drop-shadow-xs mb-0.5 shrink-0" />
              <span className="text-[10px] sm:text-[10.5px] font-bold leading-snug tracking-tight truncate max-w-full text-center">Quay Lại</span>
            </button>

            {/* 2. Mẫu hoa */}
            <button
              type="button"
              onClick={handleCatalogClick}
              className={`min-w-0 flex-1 flex flex-col items-center justify-center h-[48px] py-0.5 px-0.5 rounded-2xl transition-all active:scale-95 cursor-pointer ${
                currentView === 'catalog'
                  ? 'bg-white/75 backdrop-blur-md border border-white/90 shadow-[0_2px_8px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)] text-emerald-950 font-extrabold'
                  : 'text-slate-600 hover:text-emerald-800'
              }`}
              title="Khám phá mẫu hoa tươi"
            >
              <img src="/icons/icon-catalog-3d.png" alt="Mẫu hoa" className="w-6 h-6 object-contain drop-shadow-xs mb-0.5 shrink-0" />
              <span className="text-[10px] sm:text-[10.5px] font-bold leading-snug tracking-tight truncate max-w-full text-center">Mẫu Hoa</span>
            </button>

            {/* 3. NÚT QUÉT MÃ QR FAB TRUNG TÂM NỔI LÊN (SUPERMARKET ORANGE) */}
            <div className="min-w-0 flex-1 flex justify-center items-center h-full">
              <button
                type="button"
                onClick={() => {
                  handleUserInteract();
                  if (onOpenQrScanner) {
                    onOpenQrScanner();
                  } else {
                    handleOrderLookupClick();
                  }
                }}
                className="w-13 h-13 sm:w-14 sm:h-14 -mt-5 shrink-0 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white border-2 border-white shadow-[0_8px_20px_rgba(249,115,22,0.45),inset_0_2px_3px_rgba(255,255,255,0.85)] flex items-center justify-center relative active:scale-90 transition-transform group p-3 cursor-pointer"
                title="Quét mã QR (Tra cứu đơn hàng, cọc VietQR, thiệp hoa)"
              >
                <ScanLine className="w-6 h-6 text-white stroke-[2.2] group-hover:scale-110 transition-transform" />
              </button>
            </div>

            {/* 4. Đơn hàng */}
            <button
              type="button"
              onClick={handleOrdersClick}
              className={`min-w-0 flex-1 flex flex-col items-center justify-center h-[48px] py-0.5 px-0.5 rounded-2xl transition-all active:scale-95 cursor-pointer ${
                (currentView === 'customer' || currentView === 'admin' || currentView === 'owner')
                  ? 'bg-white/75 backdrop-blur-md border border-white/90 shadow-[0_2px_8px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)] text-emerald-950 font-extrabold'
                  : 'text-slate-600 hover:text-emerald-800'
              }`}
              title="Quản lý & Theo dõi đơn hàng"
            >
              <img src="/icons/icon-orders-3d.png" alt="Đơn hàng" className="w-6 h-6 object-contain drop-shadow-xs mb-0.5 shrink-0" />
              <span className="text-[10px] sm:text-[10.5px] font-bold leading-snug tracking-tight truncate max-w-full text-center">Đơn Hàng</span>
            </button>

            {/* 5. Tài khoản / Quản trị */}
            <button
              type="button"
              onClick={handleAccountSwitchClick}
              className="min-w-0 flex-1 flex flex-col items-center justify-center h-[48px] py-0.5 px-0.5 rounded-2xl text-slate-600 hover:text-emerald-800 transition-all active:scale-95 cursor-pointer"
              title={isAdmin ? ((currentView === 'admin' || currentView === 'owner') ? 'Chuyển sang Xem Web' : 'Vào Trang Quản Trị') : (currentView === 'customer' ? 'Chuyển sang Cửa Hàng' : 'Vào Trang Tài Khoản')}
            >
              {isAdmin ? (
                (currentView === 'admin' || currentView === 'owner') ? (
                  <>
                    <img src="/icons/icon-store-3d.png" alt="Xem Web" className="w-6 h-6 object-contain drop-shadow-xs mb-0.5 shrink-0" />
                    <span className="text-[10px] sm:text-[10.5px] font-bold text-purple-900 leading-snug tracking-tight truncate max-w-full text-center">Xem Web</span>
                  </>
                ) : (
                  <>
                    <img src="/icons/icon-shield-3d.png" alt="Quản trị" className="w-6 h-6 object-contain drop-shadow-xs mb-0.5 shrink-0" />
                    <span className="text-[10px] sm:text-[10.5px] font-bold text-purple-900 leading-snug tracking-tight truncate max-w-full text-center">Quản Trị</span>
                  </>
                )
              ) : currentView === 'customer' ? (
                <>
                  <img src="/icons/icon-store-3d.png" alt="Cửa hàng" className="w-6 h-6 object-contain drop-shadow-xs mb-0.5 shrink-0" />
                  <span className="text-[10px] sm:text-[10.5px] font-bold text-emerald-900 leading-snug tracking-tight truncate max-w-full text-center">Cửa Hàng</span>
                </>
              ) : (
                <>
                  <img src="/icons/icon-user-3d.png" alt="Tài khoản" className="w-6 h-6 object-contain drop-shadow-xs mb-0.5 shrink-0" />
                  <span className="text-[10px] sm:text-[10.5px] font-bold text-emerald-900 leading-snug tracking-tight truncate max-w-full text-center">
                    {customer ? customer.fullName.split(' ').slice(-1)[0] : 'Tài Khoản'}
                  </span>
                </>
              )}
            </button>
          </>
        ) : (
          // ==================== CHƯA ĐĂNG NHẬP (1 THANH CHÍNH 5 NÚT CÔNG KHAI) ====================
          <>
            {/* 1. Trang chủ */}
            <button
              type="button"
              onClick={() => {
                handleUserInteract();
                setIsCategorySheetOpen(false);
                setIsUtilityMenuOpen(false);
                setCurrentView('store');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`min-w-0 flex-1 flex flex-col items-center justify-center h-[48px] py-0.5 px-0.5 rounded-2xl transition-all active:scale-95 cursor-pointer ${
                currentView === 'store' && !isCategorySheetOpen && !isUtilityMenuOpen
                  ? 'bg-white/75 backdrop-blur-md border border-white/90 shadow-[0_2px_8px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)] text-emerald-950 font-extrabold'
                  : 'text-slate-600 hover:text-emerald-800'
              }`}
              title="Trang chủ tiệm hoa"
            >
              <img src="/icons/icon-home-3d.png" alt="Trang chủ" className="w-6 h-6 object-contain drop-shadow-xs mb-0.5 shrink-0" />
              <span className="text-[10px] sm:text-[10.5px] font-bold leading-snug tracking-tight truncate max-w-full text-center">Trang Chủ</span>
            </button>

            {/* 2. Danh mục & Dịch vụ mẫu hoa */}
            <button
              type="button"
              onClick={() => {
                handleUserInteract();
                setIsUtilityMenuOpen(false);
                setIsCategorySheetOpen(!isCategorySheetOpen);
              }}
              className={`min-w-0 flex-1 flex flex-col items-center justify-center h-[48px] py-0.5 px-0.5 rounded-2xl transition-all active:scale-95 cursor-pointer ${
                isCategorySheetOpen || currentView === 'catalog'
                  ? 'bg-white/75 backdrop-blur-md border border-white/90 shadow-[0_2px_8px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)] text-emerald-950 font-extrabold'
                  : 'text-slate-600 hover:text-emerald-800'
              }`}
              title="Mẫu hoa & Dịch vụ"
            >
              <img src="/icons/icon-catalog-3d.png" alt="Mẫu hoa" className="w-6 h-6 object-contain drop-shadow-xs mb-0.5 shrink-0" />
              <span className="text-[10px] sm:text-[10.5px] font-bold leading-snug tracking-tight truncate max-w-full text-center">Mẫu Hoa</span>
            </button>

            {/* 3. NÚT QUÉT MÃ QR FAB TRUNG TÂM NỔI LÊN (SUPERMARKET ORANGE - ĐỒNG BỘ CHUẨN GIAO DIỆN) */}
            <div className="min-w-0 flex-1 flex justify-center items-center h-full">
              <button
                type="button"
                onClick={() => {
                  handleUserInteract();
                  setIsCategorySheetOpen(false);
                  setIsUtilityMenuOpen(false);
                  if (onOpenQrScanner) {
                    onOpenQrScanner();
                  } else {
                    handleOrderLookupClick();
                  }
                }}
                className="w-13 h-13 sm:w-14 sm:h-14 -mt-5 shrink-0 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white border-2 border-white shadow-[0_8px_20px_rgba(249,115,22,0.45),inset_0_2px_3px_rgba(255,255,255,0.85)] flex items-center justify-center relative active:scale-90 transition-transform group p-3 cursor-pointer"
                title="Quét mã QR (Tra cứu đơn hàng, cọc VietQR, thiệp hoa)"
              >
                <ScanLine className="w-6 h-6 text-white stroke-[2.2] group-hover:scale-110 transition-transform" />
              </button>
            </div>

            {/* 4. Tiện ích (Giới thiệu, Cẩm nang, Liên hệ, Tra cứu) */}
            <button
              type="button"
              onClick={() => {
                handleUserInteract();
                setIsCategorySheetOpen(false);
                setIsUtilityMenuOpen(!isUtilityMenuOpen);
              }}
              className={`min-w-0 flex-1 flex flex-col items-center justify-center h-[48px] py-0.5 px-0.5 rounded-2xl transition-all active:scale-95 cursor-pointer ${
                isUtilityMenuOpen || currentView === 'about' || currentView === 'contact' || currentView === 'care'
                  ? 'bg-white/75 backdrop-blur-md border border-white/90 shadow-[0_2px_8px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)] text-emerald-950 font-extrabold'
                  : 'text-slate-600 hover:text-emerald-800'
              }`}
              title="Tiện ích & Tra cứu"
            >
              <img src="/icons/icon-services-3d.png" alt="Tiện ích" className="w-6 h-6 object-contain drop-shadow-xs mb-0.5 shrink-0" />
              <span className="text-[10px] sm:text-[10.5px] font-bold leading-snug tracking-tight truncate max-w-full text-center">Tiện Ích</span>
            </button>

            {/* 5. Đăng nhập */}
            <button
              type="button"
              onClick={() => {
                handleUserInteract();
                setIsCategorySheetOpen(false);
                setIsUtilityMenuOpen(false);
                setAuthModalMode('customer');
                setIsAuthModalOpen(true);
              }}
              className={`min-w-0 flex-1 flex flex-col items-center justify-center h-[48px] py-0.5 px-0.5 rounded-2xl transition-all active:scale-95 cursor-pointer ${
                isAuthModalOpen
                  ? 'bg-white/75 backdrop-blur-md border border-white/90 shadow-[0_2px_8px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)] text-emerald-950 font-extrabold'
                  : 'text-slate-600 hover:text-emerald-800'
              }`}
              title="Đăng nhập tài khoản"
            >
              <img src="/icons/icon-user-3d.png" alt="Đăng nhập" className="w-6 h-6 object-contain drop-shadow-xs mb-0.5 shrink-0" />
              <span className="text-[10px] sm:text-[10.5px] font-bold leading-snug tracking-tight truncate max-w-full text-center">Đăng Nhập</span>
            </button>
          </>
        )}
      </nav>
    </>
  );
};
