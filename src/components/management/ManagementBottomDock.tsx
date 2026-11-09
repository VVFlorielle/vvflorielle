import React, { useState, useEffect, useRef } from 'react';
import {
  Store,
  ShieldCheck,
  ShoppingBag,
  ScanLine,
  Flower2,
  Users,
  Gift,
  ArrowLeft,
  Settings,
  Phone,
  BookOpen,
  Info,
  Home,
  Sparkles,
  LogOut,
  LayoutGrid
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export interface ManagementBottomDockProps {
  role?: 'admin' | 'owner';
  activeTab?: string;
  onSelectTab?: (tab: any) => void;
  pendingOrdersCount?: number;
  productsCount?: number;
  onOpenQrScanner: () => void;
}

export const ManagementBottomDock: React.FC<ManagementBottomDockProps> = ({
  role = 'admin',
  activeTab = 'dashboard',
  onSelectTab,
  pendingOrdersCount = 0,
  productsCount = 0,
  onOpenQrScanner
}) => {
  const { currentView, setCurrentView, activeAdminUser, logoutAdmin } = useStore();
  const isStorefront =
    currentView === 'store' ||
    currentView === 'care' ||
    currentView === 'about' ||
    currentView === 'contact' ||
    currentView === 'catalog';

  const targetAdminView =
    activeAdminUser === 'vvflorielle' || activeAdminUser === 'chuquan' ? 'owner' : 'admin';

  // Mobile Unfurl Dock state (Thanh dock ẩn phụ mở rộng)
  const [isUnfurlExpanded, setIsUnfurlExpanded] = useState(false);
  const collapseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hiệu ứng làm mờ nhẹ thanh dock khi lướt (Scroll-dimming effect)
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 450);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  const resetAutoCollapse = () => {
    if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
    if (isUnfurlExpanded) {
      collapseTimerRef.current = setTimeout(() => {
        setIsUnfurlExpanded(false);
      }, 15000);
    }
  };

  useEffect(() => {
    resetAutoCollapse();
    return () => {
      if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
    };
  }, [isUnfurlExpanded]);

  // Nút 1: Trở Lại
  const handleGoBack = () => {
    if (!isStorefront && activeTab !== 'dashboard') {
      onSelectTab?.('dashboard');
    } else if (isStorefront) {
      setCurrentView(targetAdminView);
      onSelectTab?.('dashboard');
    } else {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        setCurrentView('store');
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Nút 2: Vào Quản Trị
  const handleGoToAdmin = () => {
    if (isStorefront) {
      setCurrentView(targetAdminView);
    }
    onSelectTab?.('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Nút 4: Xem Trang Web
  const handleGoToStorefront = () => {
    setCurrentView('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Nút 5: Đăng Xuất An Toàn
  const handleLogout = () => {
    logoutAdmin();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* ================================================================
          DOCK 1: THANH DOCK ẨN MỞ RỘNG (PHƯƠNG ÁN 1: CHUẨN ẢNH 5 PHOTOTIINLOVE)
          Bên trái là nút tròn bánh răng.
          Dãy các nút xếp: ICON 3D MỀM MẠI Ở TRÊN - TÊN MỤC Ở DƯỚI.
          ================================================================ */}
      <div
        className={`fixed left-2 bottom-[72px] sm:bottom-[78px] z-[75] flex items-center pointer-events-auto transition-all duration-300 ${
          isScrolling ? 'opacity-40 hover:opacity-100' : 'opacity-100'
        }`}
        onTouchStart={resetAutoCollapse}
      >
        {!isUnfurlExpanded ? (
          /* Nút tròn bánh răng chuẩn hình tròn 100% (Aspect-Square) */
          <button
            type="button"
            onClick={() => setIsUnfurlExpanded(true)}
            className="w-10 h-10 rounded-full aspect-square flex items-center justify-center bg-gradient-to-tr from-rose-500 to-pink-500 text-white shadow-[0_6px_20px_rgba(244,63,94,0.35)] ring-2 ring-white hover:scale-105 active:scale-95 transition-all cursor-pointer p-0"
            title="Mở menu điều hướng website"
          >
            <Settings className="w-5 h-5 animate-spin-slow" />
          </button>
        ) : (
          /* Khung nổi capsule tròn mềm mại chuẩn PhotoTiin (Ảnh 5) */
          <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-[#fff9f4]/95 backdrop-blur-2xl border-2 border-amber-200/90 shadow-[0_10px_32px_rgba(251,146,60,0.22)] animate-in fade-in slide-in-from-left duration-200 max-w-[calc(100vw-16px)]">
            {/* Nút đóng bánh răng quay lại */}
            <button
              type="button"
              onClick={() => setIsUnfurlExpanded(false)}
              className="w-8 h-8 rounded-full aspect-square flex items-center justify-center bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-xs shrink-0 cursor-pointer p-0 hover:scale-105 active:scale-95"
              title="Thu gọn menu"
            >
              <Settings className="w-4 h-4 rotate-90" />
            </button>

            {/* Dãy icon trên - chữ dưới chuẩn Ảnh 5 */}
            <nav className="flex items-center gap-1 px-1 py-0.5 overflow-x-auto no-scrollbar scroll-smooth">
              {/* 1. Trang Chủ */}
              <button
                type="button"
                onClick={() => {
                  setIsUnfurlExpanded(false);
                  setCurrentView('store');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl hover:bg-amber-100/70 active:scale-95 transition-all cursor-pointer shrink-0"
                title="Về Trang Chủ"
              >
                <img src="/icons/icon-home-3d.png" alt="Trang chủ" className="w-6 h-6 object-contain" />
                <span className="text-[10px] font-bold text-amber-950 mt-0.5 leading-none">Trang chủ</span>
              </button>

              {/* 2. Bảng Giá */}
              <button
                type="button"
                onClick={() => {
                  setIsUnfurlExpanded(false);
                  setCurrentView('catalog');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl hover:bg-amber-100/70 active:scale-95 transition-all cursor-pointer shrink-0"
                title="Xem Bảng Giá"
              >
                <img src="/icons/icon-pricing-3d.png" alt="Bảng giá" className="w-6 h-6 object-contain" />
                <span className="text-[10px] font-bold text-amber-950 mt-0.5 leading-none">Bảng giá</span>
              </button>

              {/* 3. Mẫu Hoa */}
              <button
                type="button"
                onClick={() => {
                  setIsUnfurlExpanded(false);
                  setCurrentView('catalog');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl hover:bg-amber-100/70 active:scale-95 transition-all cursor-pointer shrink-0"
                title="Khám phá mẫu hoa nghệ thuật"
              >
                <img src="/icons/icon-catalog-3d.png" alt="Mẫu hoa" className="w-6 h-6 object-contain" />
                <span className="text-[10px] font-bold text-amber-950 mt-0.5 leading-none">Mẫu hoa</span>
              </button>

              {/* 4. Dịch Vụ */}
              <button
                type="button"
                onClick={() => {
                  setIsUnfurlExpanded(false);
                  setCurrentView('about');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl hover:bg-amber-100/70 active:scale-95 transition-all cursor-pointer shrink-0"
                title="Dịch vụ hoa cưới & thiết kế"
              >
                <img src="/icons/icon-services-3d.png" alt="Dịch vụ" className="w-6 h-6 object-contain" />
                <span className="text-[10px] font-bold text-amber-950 mt-0.5 leading-none">Dịch vụ</span>
              </button>

              {/* 5. Cẩm Nang */}
              <button
                type="button"
                onClick={() => {
                  setIsUnfurlExpanded(false);
                  setCurrentView('care');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl hover:bg-amber-100/70 active:scale-95 transition-all cursor-pointer shrink-0"
                title="Cẩm nang chăm sóc hoa tươi"
              >
                <img src="/icons/icon-care-3d.png" alt="Cẩm nang" className="w-6 h-6 object-contain" />
                <span className="text-[10px] font-bold text-amber-950 mt-0.5 leading-none">Cẩm nang</span>
              </button>

              {/* 6. Liên Hệ */}
              <button
                type="button"
                onClick={() => {
                  setIsUnfurlExpanded(false);
                  setCurrentView('contact');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl hover:bg-amber-100/70 active:scale-95 transition-all cursor-pointer shrink-0"
                title="Liên hệ hotline & showroom"
              >
                <img src="/icons/icon-contact-3d.png" alt="Liên hệ" className="w-6 h-6 object-contain" />
                <span className="text-[10px] font-bold text-amber-950 mt-0.5 leading-none">Liên hệ</span>
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* ================================================================
          DOCK 2: THANH DOCK ĐIỀU HÀNH CHÍNH 5 NÚT CHUẨN PHOTOTIINLOVE
          Đối xứng hoàn hảo: [Quay lại] [Quản trị] [⚡ TẠO QR / QUÉT QR] [Trang web] [Đăng xuất]
          ================================================================ */}
      <div
        className={`fixed bottom-2 sm:bottom-4 inset-x-2 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-[70] select-none pointer-events-auto transition-all duration-300 ${
          isScrolling ? 'opacity-40 hover:opacity-100 scale-[0.98]' : 'opacity-100 scale-100'
        }`}
      >
        <nav
          className="flex items-center justify-between sm:justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-2xl sm:rounded-full bg-white/95 backdrop-blur-2xl border border-amber-200/90 shadow-[0_12px_40px_-8px_rgba(251,146,60,0.22),0_4px_16px_rgba(0,0,0,0.06)] w-full sm:w-auto"
          aria-label="Thanh dock điều hướng quản trị 5 nút"
        >
          {/* NÚT 1: QUAY LẠI */}
          <button
            type="button"
            onClick={handleGoBack}
            className="w-[56px] min-[375px]:w-[62px] sm:w-[84px] h-[48px] sm:h-[56px] p-1 sm:px-2 sm:py-1.5 rounded-xl sm:rounded-2xl border border-slate-200/90 hover:border-amber-300 bg-white/90 hover:bg-amber-50/80 active:scale-95 transition-all cursor-pointer shadow-2xs flex flex-col items-center justify-center shrink-0"
            title="Quay lại trang trước"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
            <span className="text-[9.5px] sm:text-[11px] font-bold text-slate-600 mt-0.5 sm:mt-1 leading-none whitespace-nowrap">
              Quay lại
            </span>
          </button>

          {/* NÚT 2: QUẢN TRỊ */}
          <button
            type="button"
            onClick={handleGoToAdmin}
            className={`w-[56px] min-[375px]:w-[62px] sm:w-[84px] h-[48px] sm:h-[56px] p-1 sm:px-2 sm:py-1.5 rounded-xl sm:rounded-2xl border active:scale-95 transition-all cursor-pointer shadow-2xs flex flex-col items-center justify-center shrink-0 ${
              !isStorefront && activeTab === 'dashboard'
                ? 'border-emerald-500 bg-emerald-50/90 text-emerald-900 shadow-xs'
                : 'border-slate-200/90 hover:border-amber-300 bg-white/90 hover:bg-amber-50/80 text-slate-700'
            }`}
            title="Vào bảng quản trị chính"
          >
            <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-700" />
            <span className="text-[9.5px] sm:text-[11px] font-bold text-slate-700 mt-0.5 sm:mt-1 leading-none whitespace-nowrap">
              Quản trị
            </span>
          </button>

          {/* NÚT 3: TẠO QR / QUÉT QR (HERO BUTTON CHÍNH GIỮA) */}
          <button
            type="button"
            onClick={onOpenQrScanner}
            className="w-12 sm:w-14 h-12 sm:h-14 -mt-2 sm:-mt-3 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 text-white shadow-[0_8px_24px_rgba(249,115,22,0.45)] ring-3 sm:ring-4 ring-white flex flex-col items-center justify-center hover:scale-108 active:scale-95 transition-transform duration-200 cursor-pointer group shrink-0 mx-0.5"
            title="Quét mã QR đơn hàng hoặc tạo QR thanh toán"
          >
            <ScanLine className="w-5 h-5 sm:w-6 sm:h-6 group-hover:animate-pulse" />
            <span className="sr-only">Tạo QR / Quét QR</span>
          </button>

          {/* NÚT 4: TRANG WEB */}
          <button
            type="button"
            onClick={handleGoToStorefront}
            className={`w-[56px] min-[375px]:w-[62px] sm:w-[84px] h-[48px] sm:h-[56px] p-1 sm:px-2 sm:py-1.5 rounded-xl sm:rounded-2xl border active:scale-95 transition-all cursor-pointer shadow-2xs flex flex-col items-center justify-center shrink-0 ${
              isStorefront
                ? 'border-emerald-500 bg-emerald-50/90 text-emerald-900 shadow-xs'
                : 'border-slate-200/90 hover:border-amber-300 bg-white/90 hover:bg-amber-50/80 text-slate-700'
            }`}
            title="Xem trang web cửa hàng"
          >
            <Store className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
            <span className="text-[9.5px] sm:text-[11px] font-bold text-slate-700 mt-0.5 sm:mt-1 leading-none whitespace-nowrap">
              Trang web
            </span>
          </button>

          {/* NÚT 5: ĐĂNG XUẤT */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-[56px] min-[375px]:w-[62px] sm:w-[84px] h-[48px] sm:h-[56px] p-1 sm:px-2 sm:py-1.5 rounded-xl sm:rounded-2xl border border-slate-200/90 hover:border-rose-300 bg-white/90 hover:bg-rose-50/80 active:scale-95 transition-all cursor-pointer shadow-2xs flex flex-col items-center justify-center shrink-0"
            title="Đăng xuất khỏi phiên quản trị"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600" />
            <span className="text-[9.5px] sm:text-[11px] font-bold text-rose-600 mt-0.5 sm:mt-1 leading-none whitespace-nowrap">
              Đăng xuất
            </span>
          </button>
        </nav>
      </div>
    </>
  );
};
