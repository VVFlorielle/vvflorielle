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
  X
} from 'lucide-react';
import { PopupType } from './InfoPopups';
import { CategoryId } from '../types';

interface MobileBottomDockProps {
  onOpenCategories?: () => void;
  onOpenPopup?: (type: PopupType) => void;
}

export const MobileBottomDock: React.FC<MobileBottomDockProps> = ({
  onOpenCategories,
  onOpenPopup,
}) => {
  const {
    currentView,
    setCurrentView,
    cart,
    setIsCartOpen,
    customer,
    isAdmin,
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

  // Scroll Hide / Reveal state (matching phototiinlove)
  const [hidden, setHidden] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const touchTimer = useRef<any>(null);

  const handleUserInteract = () => {
    setIsTouched(true);
    setHidden(false);
    if (touchTimer.current) clearTimeout(touchTimer.current);
    touchTimer.current = setTimeout(() => setIsTouched(false), 2500);
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

  // Main Dock Scroll Hide / Reveal Effect (hides on scroll > 20, reappears on stop 350ms or touch/bottom mouse)
  useEffect(() => {
    let scrollStopTimer: any = null;
    const handleScroll = () => {
      const current = window.scrollY;
      if (current > 20) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      clearTimeout(scrollStopTimer);
      scrollStopTimer = setTimeout(() => {
        setHidden(false);
      }, 350);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY >= window.innerHeight - 100) {
        setHidden(false);
      }
    };

    const handleTouchStart = () => {
      setHidden(false);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
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
      setCurrentView('admin');
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
      setCurrentView(currentView === 'admin' ? 'store' : 'admin');
    } else if (customer) {
      setCurrentView(currentView === 'customer' ? 'store' : 'customer');
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
          className={`logged-in-nav-outer ${isExpanded ? 'is-expanded' : 'is-collapsed'}`}
          onTouchStart={resetAutoCollapse}
          onMouseEnter={resetAutoCollapse}
        >
          {isExpanded ? (
            <nav className="logged-in-public-dock-unfurl" aria-label="Menu chức năng mở rộng">
              <button
                type="button"
                className="dock-unfurl-gear-toggle active"
                onClick={() => setIsExpanded(false)}
                aria-label="Thu gọn menu duyệt hoa"
                title="Thu gọn"
              >
                <span className="gear-spin">⚙️</span>
              </button>

              <button
                type="button"
                className="dock-unfurl-item"
                onClick={() => {
                  setIsExpanded(false);
                  handleCatalogClick();
                }}
                title="Mẫu hoa tươi"
              >
                <span className="dock-unfurl-icon">💐</span>
                <span className="dock-unfurl-label">Mẫu Hoa</span>
              </button>

              <button
                type="button"
                className="dock-unfurl-item"
                onClick={() => {
                  setIsExpanded(false);
                  setCurrentView('care');
                }}
                title="Cẩm nang dưỡng hoa"
              >
                <span className="dock-unfurl-icon">📖</span>
                <span className="dock-unfurl-label">Cẩm Nang</span>
              </button>

              <button
                type="button"
                className="dock-unfurl-item"
                onClick={() => {
                  setIsExpanded(false);
                  setCurrentView('about');
                }}
                title="Giới thiệu tiệm hoa"
              >
                <span className="dock-unfurl-icon">🌸</span>
                <span className="dock-unfurl-label">Giới Thiệu</span>
              </button>

              <button
                type="button"
                className="dock-unfurl-item"
                onClick={() => {
                  setIsExpanded(false);
                  setCurrentView('contact');
                }}
                title="Liên hệ & Chỉ đường"
              >
                <span className="dock-unfurl-icon">📞</span>
                <span className="dock-unfurl-label">Liên Hệ</span>
              </button>

              <button
                type="button"
                className="dock-unfurl-item"
                onClick={() => {
                  setIsExpanded(false);
                  if (onOpenPopup) onOpenPopup('app-download');
                }}
                title="Cài đặt & Tải App APK"
              >
                <span className="dock-unfurl-icon">📱</span>
                <span className="dock-unfurl-label">Tải App</span>
              </button>

              <button
                type="button"
                className="dock-unfurl-item"
                onClick={() => {
                  setIsExpanded(false);
                  if (onOpenPopup) onOpenPopup('voucher');
                }}
                title="Voucher & Tích điểm"
              >
                <span className="dock-unfurl-icon">🎁</span>
                <span className="dock-unfurl-label">Ưu Đãi</span>
              </button>
            </nav>
          ) : (
            <button
              type="button"
              className="dock-unfurl-gear-toggle"
              onClick={() => {
                handleUserInteract();
                setIsExpanded(true);
              }}
              aria-label="Mở menu chức năng phụ"
              title="Khám phá tiện ích & danh mục"
            >
              <span className="gear-spin">⚙️</span>
            </button>
          )}
        </div>
      )}

      {/* ================================================================
          DRAWER 1: MẪU HOA & DỊCH VỤ (MOBILE POPUP KHI BẤM NÚT DANH MỤC)
          ================================================================ */}
      {isCategorySheetOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end md:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsCategorySheetOpen(false)}
          />
          <div className="relative z-10 w-full max-w-md mx-auto p-4 pb-8 bg-white/95 backdrop-blur-2xl rounded-t-[32px] border-t border-white/90 shadow-2xl space-y-3.5 max-h-[82vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            <div className="relative flex items-center justify-center pb-2 border-b border-slate-100 text-center">
              <div className="flex items-center justify-center gap-2 mx-auto">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">Mẫu Hoa &amp; Dịch Vụ</span>
              </div>
              <button
                onClick={() => setIsCategorySheetOpen(false)}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
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
              className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-800 text-white cursor-pointer shadow-md flex items-center justify-between hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-black text-xs flex items-center gap-1.5">
                    <span>Tất Cả Mẫu Hoa</span>
                    <span className="text-[9px] bg-emerald-300 text-emerald-950 font-black px-1.5 py-0.2 rounded-full">Trang riêng</span>
                  </div>
                  <div className="text-[10px] text-emerald-100">Bộ lọc chi tiết, sắp xếp giá &amp; tìm kiếm hoa</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white" />
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
                    <Palette className="w-4 h-4 text-rose-600" />
                    <div>
                      <div className="text-xs font-bold text-slate-800">Hoa Thiết Kế Riêng Theo Yêu Cầu</div>
                      <div className="text-[10px] text-slate-400">Gửi ảnh mẫu, chọn ngân sách &amp; duyệt mẫu</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700">Mở mẫu →</span>
                </div>

                <div
                  onClick={() => {
                    setIsCategorySheetOpen(false);
                    if (onOpenPopup) onOpenPopup('shipping');
                  }}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-100 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-sky-600" />
                    <div>
                      <div className="text-xs font-bold text-slate-800">Giao Hoa Cấp Tốc (60 - 90P)</div>
                      <div className="text-[10px] text-slate-400">Bảng giá cước &amp; giao hỏa tốc 105 Doãn Kế Thiện</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-sky-700">Giá ship →</span>
                </div>

                <div
                  onClick={() => {
                    setIsCategorySheetOpen(false);
                    if (onOpenPopup) onOpenPopup('wedding-event');
                  }}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-100 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <div>
                      <div className="text-xs font-bold text-slate-800">Hoa Cưới &amp; Sự Kiện Doanh Nghiệp</div>
                      <div className="text-[10px] text-slate-400">Hoa cô dâu, trang trí xe hoa, hội nghị &amp; xuất VAT</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-amber-700">Chi tiết →</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================
          DRAWER 2: TIỆN ÍCH & TRA CỨU (GIỚI THIỆU, CẨM NANG, LIÊN HỆ, TRA CỨU, APP)
          ================================================================ */}
      {isUtilityMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end md:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsUtilityMenuOpen(false)}
          />
          <div className="relative z-10 w-full max-w-md mx-auto p-4 pb-8 bg-white/95 backdrop-blur-2xl rounded-t-[32px] border-t border-white/90 shadow-2xl space-y-2.5 max-h-[82vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            <div className="relative flex items-center justify-center pb-2 border-b border-slate-100 text-center">
              <div className="flex items-center justify-center gap-2 mx-auto">
                <Compass className="w-4 h-4 text-emerald-600" />
                <span className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">Tiện Ích &amp; Thông Tin Tiệm</span>
              </div>
              <button
                onClick={() => setIsUtilityMenuOpen(false)}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
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
              className="p-3 rounded-2xl bg-white hover:bg-emerald-50/80 border border-slate-200/80 flex items-center justify-between cursor-pointer active:scale-95 transition-all shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Flower2 className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">Giới Thiệu Tiệm Hoa V&V Florielle</div>
                  <div className="text-[10px] text-slate-500">105 Doãn Kế Thiện • Câu chuyện nghệ thuật hoa</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            {/* 2. Cẩm Nang Dưỡng Hoa (Mở Popup Thư Viện Kiến Thức) */}
            <div
              onClick={() => {
                setIsUtilityMenuOpen(false);
                if (onOpenPopup) onOpenPopup('care');
              }}
              className="p-3 rounded-2xl bg-white hover:bg-emerald-50/80 border border-slate-200/80 flex items-center justify-between cursor-pointer active:scale-95 transition-all shadow-xs"
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
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            {/* 3. Liên Hệ & Bản Đồ (Mở Trang Riêng) */}
            <div
              onClick={() => {
                setIsUtilityMenuOpen(false);
                setCurrentView('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-3 rounded-2xl bg-white hover:bg-emerald-50/80 border border-slate-200/80 flex items-center justify-between cursor-pointer active:scale-95 transition-all shadow-xs"
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
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            {/* 4. Tra Cứu Đơn Hàng & VietQR */}
            <div
              onClick={() => {
                setIsUtilityMenuOpen(false);
                handleOrderLookupClick();
              }}
              className="p-3 rounded-2xl bg-white hover:bg-emerald-50/80 border border-slate-200/80 flex items-center justify-between cursor-pointer active:scale-95 transition-all shadow-xs"
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
              <ChevronRight className="w-4 h-4 text-slate-400" />
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
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
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
              <Download className="w-4 h-4 text-emerald-700" />
            </div>
          </div>
        </div>
      )}

      {/* ================================================================
          DOCK CHÍNH (5 NÚT CÔNG KHAI KHI GUEST / 5 NÚT ĐIỀU HÀNH KHI LOGGED IN)
          ================================================================ */}
      <nav
        className={`management-bottom-nav ${hidden && !isTouched ? 'management-nav-hidden' : ''}`}
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
              className="min-w-0 flex-1 flex flex-col items-center justify-center h-full py-0.5 px-0.5 text-slate-500 hover:text-emerald-700 transition-all active:scale-95"
              title="Quay lại"
            >
              <ChevronLeft className="w-4.5 h-4.5 stroke-[2.2]" />
              <span className="text-[9.5px] font-bold mt-0.5 leading-none truncate max-w-full text-center">Quay lại</span>
            </button>

            {/* 2. Mẫu hoa */}
            <button
              type="button"
              onClick={handleCatalogClick}
              className={`min-w-0 flex-1 flex flex-col items-center justify-center h-full py-0.5 px-0.5 transition-all active:scale-95 ${
                currentView === 'catalog' ? 'text-emerald-700 font-extrabold' : 'text-slate-500 hover:text-emerald-700'
              }`}
              title="Khám phá mẫu hoa tươi"
            >
              <Sparkles className="w-4.5 h-4.5 stroke-[2]" />
              <span className="text-[9.5px] font-bold mt-0.5 leading-none truncate max-w-full text-center">Mẫu hoa</span>
            </button>

            {/* 3. NÚT GIỎ HOA FAB TRUNG TÂM NỔI LÊN (SUPERMARKET ORANGE - TO RỘNG RÃI) */}
            <div className="min-w-0 flex-1 flex justify-center items-center h-full">
              <button
                type="button"
                onClick={() => {
                  handleUserInteract();
                  setIsCartOpen(true);
                }}
                className="w-15 h-15 sm:w-16 sm:h-16 -mt-6 shrink-0 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white border-2 border-white shadow-[0_8px_24px_rgba(249,115,22,0.48),inset_0_2px_3px_rgba(255,255,255,0.85)] flex items-center justify-center relative active:scale-90 transition-transform group p-3.5"
                title="Giỏ hoa của bạn (Bấm để xem)"
              >
                <ShoppingCart className="w-6.5 h-6.5 text-white stroke-[2.2] group-hover:scale-110 transition-transform" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center border-2 border-white shadow-md animate-bounce-subtle">
                    {totalCartCount > 99 ? '99+' : totalCartCount}
                  </span>
                )}
              </button>
            </div>

            {/* 4. Đơn hàng */}
            <button
              type="button"
              onClick={handleOrdersClick}
              className={`min-w-0 flex-1 flex flex-col items-center justify-center h-full py-0.5 px-0.5 transition-all active:scale-95 ${
                (currentView === 'customer' || currentView === 'admin') ? 'text-emerald-700 font-extrabold' : 'text-slate-500 hover:text-emerald-700'
              }`}
              title="Quản lý & Theo dõi đơn hàng"
            >
              <PackageCheck className="w-4.5 h-4.5 stroke-[2]" />
              <span className="text-[9.5px] font-bold mt-0.5 leading-none truncate max-w-full text-center">Đơn hàng</span>
            </button>

            {/* 5. Tài khoản / Quản trị */}
            <button
              type="button"
              onClick={handleAccountSwitchClick}
              className={`min-w-0 flex-1 flex flex-col items-center justify-center h-full py-0.5 px-0.5 transition-all active:scale-95 ${
                isAdmin
                  ? currentView === 'admin' ? 'text-purple-700 font-extrabold' : 'text-slate-600 hover:text-purple-700'
                  : currentView === 'customer' ? 'text-emerald-700 font-extrabold' : 'text-slate-500 hover:text-emerald-700'
              }`}
              title={isAdmin ? (currentView === 'admin' ? 'Chuyển sang Xem Web' : 'Vào Trang Quản Trị') : (currentView === 'customer' ? 'Chuyển sang Cửa Hàng' : 'Vào Trang Tài Khoản')}
            >
              {isAdmin ? (
                currentView === 'admin' ? (
                  <>
                    <Store className="w-4.5 h-4.5 stroke-[2.2] text-purple-700" />
                    <span className="text-[9.5px] font-bold mt-0.5 text-purple-900 leading-none truncate max-w-full text-center">Xem Web</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4.5 h-4.5 stroke-[2.2] text-purple-700" />
                    <span className="text-[9.5px] font-bold mt-0.5 text-purple-900 leading-none truncate max-w-full text-center">Quản trị</span>
                  </>
                )
              ) : currentView === 'customer' ? (
                <>
                  <Store className="w-4.5 h-4.5 stroke-[2.2] text-emerald-700" />
                  <span className="text-[9.5px] font-bold mt-0.5 text-emerald-900 leading-none truncate max-w-full text-center">Cửa hàng</span>
                </>
              ) : (
                <>
                  <User className="w-4.5 h-4.5 stroke-[2.2] text-emerald-700" />
                  <span className="text-[9.5px] font-bold mt-0.5 text-emerald-900 leading-none truncate max-w-full text-center">
                    {customer ? customer.fullName.split(' ').slice(-1)[0] : 'Tài khoản'}
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
              className={`min-w-0 flex-1 flex flex-col items-center justify-center h-full py-0.5 px-0.5 transition-all active:scale-95 ${
                currentView === 'store' ? 'text-emerald-800 font-extrabold' : 'text-slate-500 hover:text-emerald-700'
              }`}
              title="Trang chủ tiệm hoa"
            >
              <Home className="w-4.5 h-4.5 stroke-[2.4]" />
              <span className="text-[9.5px] font-bold mt-0.5 leading-none truncate max-w-full text-center">Trang chủ</span>
            </button>

            {/* 2. Danh mục & Dịch vụ mẫu hoa */}
            <button
              type="button"
              onClick={() => {
                handleUserInteract();
                setIsUtilityMenuOpen(false);
                setIsCategorySheetOpen(!isCategorySheetOpen);
              }}
              className={`min-w-0 flex-1 flex flex-col items-center justify-center h-full py-0.5 px-0.5 transition-all active:scale-95 ${
                isCategorySheetOpen || currentView === 'catalog'
                  ? 'text-emerald-800 font-extrabold'
                  : 'text-slate-500 hover:text-emerald-700'
              }`}
              title="Mẫu hoa & Dịch vụ"
            >
              <Sparkles className="w-4.5 h-4.5 stroke-[2]" />
              <span className="text-[9.5px] font-bold mt-0.5 leading-none truncate max-w-full text-center">Mẫu hoa</span>
            </button>

            {/* 3. NÚT GIỎ HOA FAB TRUNG TÂM NỔI LÊN (SUPERMARKET ORANGE - TO RỘNG RÃI SANG TRỌNG) */}
            <div className="min-w-0 flex-1 flex justify-center items-center h-full">
              <button
                type="button"
                onClick={() => {
                  handleUserInteract();
                  setIsCategorySheetOpen(false);
                  setIsUtilityMenuOpen(false);
                  setIsCartOpen(true);
                }}
                className="w-15 h-15 sm:w-16 sm:h-16 -mt-6 shrink-0 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white border-2 border-white shadow-[0_8px_24px_rgba(249,115,22,0.48),inset_0_2px_3px_rgba(255,255,255,0.85)] flex items-center justify-center relative active:scale-90 transition-transform group p-3.5"
                title="Giỏ hoa của bạn (Bấm để xem)"
              >
                <ShoppingCart className="w-6.5 h-6.5 text-white stroke-[2.2] group-hover:scale-110 transition-transform" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center border-2 border-white shadow-md animate-bounce-subtle">
                    {totalCartCount > 99 ? '99+' : totalCartCount}
                  </span>
                )}
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
              className={`min-w-0 flex-1 flex flex-col items-center justify-center h-full py-0.5 px-0.5 transition-all active:scale-95 ${
                isUtilityMenuOpen || currentView === 'about' || currentView === 'contact' || currentView === 'care'
                  ? 'text-emerald-800 font-extrabold'
                  : 'text-slate-500 hover:text-emerald-700'
              }`}
              title="Tiện ích & Tra cứu"
            >
              <Compass className="w-4.5 h-4.5 stroke-[2]" />
              <span className="text-[9.5px] font-bold mt-0.5 leading-none truncate max-w-full text-center">Tiện ích</span>
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
              className="min-w-0 flex-1 flex flex-col items-center justify-center h-full py-0.5 px-0.5 text-slate-500 hover:text-emerald-700 transition-all active:scale-95"
              title="Đăng nhập tài khoản"
            >
              <User className="w-4.5 h-4.5 stroke-[2]" />
              <span className="text-[9.5px] font-bold mt-0.5 leading-none truncate max-w-full text-center">Đăng nhập</span>
            </button>
          </>
        )}
      </nav>
    </>
  );
};
