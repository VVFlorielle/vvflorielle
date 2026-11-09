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
  Sparkles
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
  const { currentView, setCurrentView, activeAdminUser, promotions } = useStore();
  const isStorefront =
    currentView === 'store' ||
    currentView === 'care' ||
    currentView === 'about' ||
    currentView === 'contact' ||
    currentView === 'catalog';

  const targetAdminView =
    activeAdminUser === 'vvflorielle' || activeAdminUser === 'chuquan' ? 'owner' : 'admin';

  const promotionsCount = promotions?.length || 0;

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
      }, 20000);
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

  // Nút 2: Xem Shop / Vào Quản Trị
  const handleToggleStoreOrAdmin = () => {
    if (isStorefront) {
      setCurrentView(targetAdminView);
      onSelectTab?.('dashboard');
    } else {
      setCurrentView('store');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Nút 3: Đơn Hàng
  const handleNavigateOrders = () => {
    if (isStorefront) setCurrentView(targetAdminView);
    onSelectTab?.('orders');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Nút 5: Kho Hoa
  const handleNavigateProducts = () => {
    if (isStorefront) setCurrentView(targetAdminView);
    onSelectTab?.('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Nút 6: Khách Hàng
  const handleNavigateCustomers = () => {
    if (isStorefront) setCurrentView(targetAdminView);
    onSelectTab?.('customers');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Nút 7: Voucher & Khuyến Mãi
  const handleNavigateVouchers = () => {
    if (isStorefront) setCurrentView(targetAdminView);
    onSelectTab?.('vouchers');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* ================================================================
          DOCK 1: THANH DOCK ẨN MỞ RỘNG TRÊN MOBILE (UNFURL DOCK)
          Khi chưa bấm: Nút tròn bánh răng 100% HOÀN TOÀN HÌNH TRÒN (Aspect-Square, Không Bị Viên Thuốc)
          Khi bấm: Trượt êm ái mở ra các nút chức năng phụ không bị tràn màn hình
          ================================================================ */}
      <div
        className={`fixed left-2 bottom-[74px] sm:bottom-[80px] z-[75] flex items-center pointer-events-auto sm:hidden transition-all duration-300 ${
          isScrolling ? 'opacity-40 hover:opacity-100' : 'opacity-100'
        }`}
        onTouchStart={resetAutoCollapse}
      >
        {!isUnfurlExpanded ? (
          /* Nút tròn bánh răng chuẩn hình tròn 100% (aspect-square) */
          <button
            type="button"
            onClick={() => setIsUnfurlExpanded(true)}
            className="w-10 h-10 rounded-full aspect-square flex items-center justify-center bg-white/95 backdrop-blur-2xl border border-emerald-300 shadow-[0_6px_20px_rgba(5,150,105,0.22)] text-emerald-800 hover:text-emerald-950 active:scale-95 transition-all cursor-pointer p-0"
            title="Mở menu chức năng phụ"
          >
            <Settings className="w-5 h-5 text-emerald-700" />
          </button>
        ) : (
          /* Khung trượt mở rộng gọn gàng, vừa vặn không tràn icon */
          <div className="flex items-center gap-1 p-1 rounded-full bg-white/95 backdrop-blur-2xl border border-emerald-300 shadow-[0_8px_28px_rgba(5,150,105,0.25)] animate-in fade-in slide-in-from-left duration-200 max-w-[calc(100vw-16px)]">
            <button
              type="button"
              onClick={() => setIsUnfurlExpanded(false)}
              className="w-8 h-8 rounded-full aspect-square flex items-center justify-center bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs shrink-0 cursor-pointer p-0"
              title="Thu gọn menu phụ"
            >
              <Settings className="w-4 h-4 rotate-90" />
            </button>

            <nav className="flex items-center gap-1 px-1 py-0.5 overflow-x-auto no-scrollbar scroll-smooth [mask-image:linear-gradient(to_right,black_88%,transparent_100%)]">
              {/* 1. Trang Chủ */}
              <button
                type="button"
                onClick={() => {
                  setIsUnfurlExpanded(false);
                  setCurrentView('store');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold border shrink-0 active:scale-95 transition-all cursor-pointer ${
                  currentView === 'store'
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                    : 'bg-emerald-50/90 hover:bg-emerald-100 text-emerald-900 border-emerald-200/90'
                }`}
                title="Về Trang Chủ Cửa Hàng"
              >
                <Home className="w-3 h-3 text-current" />
                <span>Trang Chủ</span>
              </button>

              {/* 2. Mẫu Hoa */}
              <button
                type="button"
                onClick={() => {
                  setIsUnfurlExpanded(false);
                  setCurrentView('catalog');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold border shrink-0 active:scale-95 transition-all cursor-pointer ${
                  currentView === 'catalog'
                    ? 'bg-teal-600 text-white border-teal-700 shadow-xs'
                    : 'bg-teal-50/90 hover:bg-teal-100 text-teal-900 border-teal-200/90'
                }`}
                title="Khám phá bộ sưu tập mẫu hoa tươi nghệ thuật"
              >
                <Flower2 className="w-3 h-3 text-current" />
                <span>Mẫu Hoa</span>
              </button>

              {/* 3. Dịch Vụ */}
              <button
                type="button"
                onClick={() => {
                  setIsUnfurlExpanded(false);
                  setCurrentView('catalog');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-1 py-1 px-2.5 rounded-xl bg-amber-50/90 hover:bg-amber-100 text-amber-900 text-[10px] font-bold border border-amber-200/90 shrink-0 active:scale-95 transition-all cursor-pointer"
                title="Dịch vụ hoa tươi & thiết kế theo yêu cầu"
              >
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>Dịch Vụ</span>
              </button>

              {/* 4. Giới Thiệu */}
              <button
                type="button"
                onClick={() => {
                  setIsUnfurlExpanded(false);
                  setCurrentView('about');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold border shrink-0 active:scale-95 transition-all cursor-pointer ${
                  currentView === 'about'
                    ? 'bg-purple-600 text-white border-purple-700 shadow-xs'
                    : 'bg-purple-50/90 hover:bg-purple-100 text-purple-900 border-purple-200/90'
                }`}
                title="Giới thiệu về tiệm hoa V&V Florielle"
              >
                <Info className="w-3 h-3 text-current" />
                <span>Giới Thiệu</span>
              </button>

              {/* 5. Cẩm Nang */}
              <button
                type="button"
                onClick={() => {
                  setIsUnfurlExpanded(false);
                  setCurrentView('care');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold border shrink-0 active:scale-95 transition-all cursor-pointer ${
                  currentView === 'care'
                    ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
                    : 'bg-rose-50/90 hover:bg-rose-100 text-rose-900 border-rose-200/90'
                }`}
                title="Cẩm nang chăm sóc hoa tươi 5-7 ngày"
              >
                <BookOpen className="w-3 h-3 text-current" />
                <span>Cẩm Nang</span>
              </button>

              {/* 6. Liên Hệ */}
              <button
                type="button"
                onClick={() => {
                  setIsUnfurlExpanded(false);
                  setCurrentView('contact');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold border shrink-0 active:scale-95 transition-all cursor-pointer ${
                  currentView === 'contact'
                    ? 'bg-sky-600 text-white border-sky-700 shadow-xs'
                    : 'bg-sky-50/90 hover:bg-sky-100 text-sky-900 border-sky-200/90'
                }`}
                title="Liên hệ & Chỉ đường showroom 105 Doãn Kế Thiện"
              >
                <Phone className="w-3 h-3 text-current" />
                <span>Liên Hệ</span>
              </button>

              {/* 7. Cài Đặt Hệ Thống */}
              <button
                type="button"
                onClick={() => {
                  setIsUnfurlExpanded(false);
                  if (isStorefront) setCurrentView(targetAdminView);
                  onSelectTab?.('settings');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-1 py-1 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold border border-slate-300/90 shrink-0 active:scale-95 transition-all cursor-pointer"
                title="Cài đặt thông tin tiệm hoa & hệ thống"
              >
                <Settings className="w-3 h-3 text-slate-700" />
                <span>Cài Đặt</span>
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* ================================================================
          DOCK 2: THANH DOCK ĐIỀU HÀNH CHÍNH 7 NÚT CÂN ĐỐI TỪ GIỮA RA
          Cụm 3 nút giữa: [Đơn Hàng] [⚡ QUÉT QR] [Kho Hoa]
          Bên trái 2 nút: [Trở Lại] [Xem Shop / Quản Trị]
          Bên phải 2 nút: [Khách Hàng] [Voucher]
          * Nút nào cũng có viền bao quanh (border border-slate-200/90)
          * Icon ở trên, chữ nhỏ ở dưới đồng bộ, gọn gàng, tinh tế
          * Không có nút Đăng Xuất để loại bỏ rủi ro bấm nhầm
          ================================================================ */}
      <div
        className={`fixed bottom-1.5 sm:bottom-4 inset-x-2 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-[70] select-none pointer-events-auto transition-all duration-300 ${
          isScrolling ? 'opacity-40 hover:opacity-100 scale-[0.98]' : 'opacity-100 scale-100'
        }`}
      >
        <nav
          className="flex items-center justify-between sm:justify-center gap-1 sm:gap-2 px-1.5 sm:px-4 py-1.5 sm:py-2.5 rounded-2xl sm:rounded-full bg-white/94 backdrop-blur-2xl border border-emerald-200/90 shadow-[0_12px_40px_-8px_rgba(5,150,105,0.22),0_4px_16px_rgba(0,0,0,0.06)] ring-1 ring-emerald-500/10 w-full sm:w-auto"
          aria-label="Thanh dock điều hướng quản trị 7 nút"
        >
          {/* NÚT 1: TRỞ LẠI (Desktop nới rộng 78px, Mobile 47px cân xứng không chạm viền) */}
          <button
            type="button"
            onClick={handleGoBack}
            className="w-[45px] min-[375px]:w-[47px] sm:w-[78px] sm:min-w-[78px] h-[46px] sm:h-[56px] p-1 sm:px-2.5 sm:py-1.5 rounded-xl sm:rounded-2xl border border-slate-200/90 hover:border-emerald-300 bg-white/80 hover:bg-emerald-50/80 active:scale-95 transition-all cursor-pointer shadow-2xs flex flex-col items-center justify-center shrink-0"
            title="Quay lại phân hệ hoặc trang trước"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
            <span className="text-[8.5px] sm:text-[11px] font-bold text-slate-600 mt-0.5 sm:mt-1 leading-none whitespace-nowrap">
              Trở Lại
            </span>
          </button>

          {/* NÚT 2: XEM SHOP / VÀO QUẢN TRỊ (Desktop nới rộng 78px, Mobile 47px cân xứng không chạm viền) */}
          <button
            type="button"
            onClick={handleToggleStoreOrAdmin}
            className={`w-[45px] min-[375px]:w-[47px] sm:w-[78px] sm:min-w-[78px] h-[46px] sm:h-[56px] p-1 sm:px-2.5 sm:py-1.5 rounded-xl sm:rounded-2xl border active:scale-95 transition-all cursor-pointer shadow-2xs flex flex-col items-center justify-center shrink-0 ${
              isStorefront
                ? 'border-emerald-500 bg-emerald-50/90 text-emerald-900 shadow-xs'
                : 'border-slate-200/90 hover:border-emerald-300 bg-white/80 hover:bg-emerald-50/80 text-slate-700'
            }`}
            title={isStorefront ? 'Vào bảng điều hành quản trị' : 'Xem giao diện cửa hàng'}
          >
            {isStorefront ? (
              <>
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-700" />
                <span className="text-[8.5px] sm:text-[11px] font-bold text-emerald-800 mt-0.5 sm:mt-1 leading-none whitespace-nowrap">
                  <span className="sm:hidden">Q.Trị</span>
                  <span className="hidden sm:inline">Quản Trị</span>
                </span>
              </>
            ) : (
              <>
                <Store className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-700" />
                <span className="text-[8.5px] sm:text-[11px] font-bold text-slate-700 mt-0.5 sm:mt-1 leading-none whitespace-nowrap">
                  <span className="sm:hidden">Shop</span>
                  <span className="hidden sm:inline">Xem Shop</span>
                </span>
              </>
            )}
          </button>

          {/* NÚT 3: ĐƠN HÀNG (Desktop nới rộng 78px, Mobile 47px cân xứng không chạm viền) */}
          <button
            type="button"
            onClick={handleNavigateOrders}
            className={`relative w-[45px] min-[375px]:w-[47px] sm:w-[78px] sm:min-w-[78px] h-[46px] sm:h-[56px] p-1 sm:px-2.5 sm:py-1.5 rounded-xl sm:rounded-2xl border active:scale-95 transition-all cursor-pointer shadow-2xs flex flex-col items-center justify-center shrink-0 ${
              !isStorefront && activeTab === 'orders'
                ? 'border-emerald-500 bg-emerald-50/90 text-emerald-900 shadow-xs'
                : 'border-slate-200/90 hover:border-emerald-300 bg-white/80 hover:bg-emerald-50/80 text-slate-700'
            }`}
            title="Quản lý đơn hàng & duyệt cọc 50%"
          >
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
            <span className="text-[8.5px] sm:text-[11px] font-bold text-slate-700 mt-0.5 sm:mt-1 leading-none whitespace-nowrap">
              Đơn Hàng
            </span>

            {pendingOrdersCount > 0 && (
              <span className="absolute -top-1 -right-0.5 min-w-[15px] sm:min-w-[17px] h-3.5 sm:h-4 px-0.5 sm:px-1 rounded-full text-[8px] sm:text-[9px] font-black flex items-center justify-center shadow-xs border border-white bg-amber-500 text-white animate-pulse">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          {/* NÚT 4 (CHÍNH GIỮA): QUÉT MÃ QR ĐƠN HÀNG (Nổi bật nhất tâm dock, to hơn trên desktop) */}
          <button
            type="button"
            onClick={onOpenQrScanner}
            className="relative -mt-2 sm:-mt-3.5 w-11 sm:w-14 h-11 sm:h-14 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 text-white shadow-[0_8px_22px_rgba(5,150,105,0.45)] ring-3 sm:ring-4 ring-white flex flex-col items-center justify-center hover:scale-108 active:scale-95 transition-transform duration-200 cursor-pointer group shrink-0 mx-0.5"
            title="Quét mã QR đơn hàng giao hoa để xác nhận hoàn tất & cộng điểm ngay"
          >
            <ScanLine className="w-5 h-5 sm:w-6 sm:h-6 group-hover:animate-pulse" />
            <span className="sr-only">Quét QR Đơn Hàng</span>
          </button>

          {/* NÚT 5: KHO HOA / MẪU HOA (Desktop nới rộng 78px, Mobile 47px cân xứng không chạm viền) */}
          <button
            type="button"
            onClick={handleNavigateProducts}
            className={`relative w-[45px] min-[375px]:w-[47px] sm:w-[78px] sm:min-w-[78px] h-[46px] sm:h-[56px] p-1 sm:px-2.5 sm:py-1.5 rounded-xl sm:rounded-2xl border active:scale-95 transition-all cursor-pointer shadow-2xs flex flex-col items-center justify-center shrink-0 ${
              !isStorefront && activeTab === 'products'
                ? 'border-emerald-500 bg-emerald-50/90 text-emerald-900 shadow-xs'
                : 'border-slate-200/90 hover:border-emerald-300 bg-white/80 hover:bg-emerald-50/80 text-slate-700'
            }`}
            title="Quản lý kho mẫu hoa tươi & giá bán"
          >
            <Flower2 className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
            <span className="text-[8.5px] sm:text-[11px] font-bold text-slate-700 mt-0.5 sm:mt-1 leading-none whitespace-nowrap">
              Kho Hoa
            </span>

            {productsCount > 0 && (
              <span className="absolute -top-1 -right-0.5 min-w-[15px] sm:min-w-[17px] h-3.5 sm:h-4 px-0.5 sm:px-1 rounded-full text-[8px] sm:text-[9px] font-black flex items-center justify-center shadow-xs border border-white bg-emerald-600 text-white">
                {productsCount}
              </span>
            )}
          </button>

          {/* NÚT 6: KHÁCH HÀNG (Desktop nới rộng 78px, Mobile 47px cân xứng không chạm viền) */}
          <button
            type="button"
            onClick={handleNavigateCustomers}
            className={`w-[45px] min-[375px]:w-[47px] sm:w-[78px] sm:min-w-[78px] h-[46px] sm:h-[56px] p-1 sm:px-2.5 sm:py-1.5 rounded-xl sm:rounded-2xl border active:scale-95 transition-all cursor-pointer shadow-2xs flex flex-col items-center justify-center shrink-0 ${
              !isStorefront && activeTab === 'customers'
                ? 'border-emerald-500 bg-emerald-50/90 text-emerald-900 shadow-xs'
                : 'border-slate-200/90 hover:border-emerald-300 bg-white/80 hover:bg-emerald-50/80 text-slate-700'
            }`}
            title="Khách hàng & hội viên VIP"
          >
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
            <span className="text-[8.5px] sm:text-[11px] font-bold text-slate-700 mt-0.5 sm:mt-1 leading-none whitespace-nowrap">
              <span className="sm:hidden">K.Hàng</span>
              <span className="hidden sm:inline">Khách Hàng</span>
            </span>
          </button>

          {/* NÚT 7: VOUCHER & MÃ GIẢM GIÁ (Desktop nới rộng 78px, Mobile 47px cân xứng không chạm viền) */}
          <button
            type="button"
            onClick={handleNavigateVouchers}
            className={`relative w-[45px] min-[375px]:w-[47px] sm:w-[78px] sm:min-w-[78px] h-[46px] sm:h-[56px] p-1 sm:px-2.5 sm:py-1.5 rounded-xl sm:rounded-2xl border active:scale-95 transition-all cursor-pointer shadow-2xs flex flex-col items-center justify-center shrink-0 ${
              !isStorefront && activeTab === 'vouchers'
                ? 'border-emerald-500 bg-emerald-50/90 text-emerald-900 shadow-xs'
                : 'border-slate-200/90 hover:border-emerald-300 bg-white/80 hover:bg-emerald-50/80 text-slate-700'
            }`}
            title="Quản lý mã giảm giá & voucher sự kiện"
          >
            <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
            <span className="text-[8.5px] sm:text-[11px] font-bold text-slate-700 mt-0.5 sm:mt-1 leading-none whitespace-nowrap">
              Voucher
            </span>

            {promotionsCount > 0 && (
              <span className="absolute -top-1 -right-0.5 min-w-[15px] sm:min-w-[17px] h-3.5 sm:h-4 px-0.5 sm:px-1 rounded-full text-[8px] sm:text-[9px] font-black flex items-center justify-center shadow-xs border border-white bg-purple-600 text-white">
                {promotionsCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </>
  );
};
