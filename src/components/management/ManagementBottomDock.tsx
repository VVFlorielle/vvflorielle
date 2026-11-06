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
  Info
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
        className="fixed left-2 bottom-[74px] sm:bottom-[80px] z-[75] flex items-center pointer-events-auto sm:hidden"
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

            <nav className="flex items-center gap-1 px-1 py-0.5 overflow-x-auto no-scrollbar scroll-smooth">
              <button
                type="button"
                onClick={() => {
                  setIsUnfurlExpanded(false);
                  if (isStorefront) setCurrentView(targetAdminView);
                  onSelectTab?.('settings');
                }}
                className="flex items-center gap-1 py-1 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-[10px] font-bold border border-emerald-200/80 shrink-0 active:scale-95 transition-all"
              >
                <Settings className="w-3 h-3 text-emerald-600" />
                <span>Cài Đặt</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsUnfurlExpanded(false);
                  if (isStorefront) setCurrentView(targetAdminView);
                  onSelectTab?.('channels');
                }}
                className="flex items-center gap-1 py-1 px-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 text-[10px] font-bold border border-sky-200/80 shrink-0 active:scale-95 transition-all"
              >
                <Phone className="w-3 h-3 text-sky-600" />
                <span>CSKH</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsUnfurlExpanded(false);
                  setCurrentView('care');
                }}
                className="flex items-center gap-1 py-1 px-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-900 text-[10px] font-bold border border-rose-200/80 shrink-0 active:scale-95 transition-all"
              >
                <BookOpen className="w-3 h-3 text-rose-600" />
                <span>Cẩm Nang</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsUnfurlExpanded(false);
                  setCurrentView('about');
                }}
                className="flex items-center gap-1 py-1 px-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 text-[10px] font-bold border border-purple-200/80 shrink-0 active:scale-95 transition-all"
              >
                <Info className="w-3 h-3 text-purple-600" />
                <span>Về Tiệm</span>
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
      <div className="fixed bottom-1.5 sm:bottom-4 inset-x-2 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-[70] select-none pointer-events-auto">
        <nav
          className="flex items-center justify-between sm:justify-center gap-1 sm:gap-1.5 px-1.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl sm:rounded-full bg-white/94 backdrop-blur-2xl border border-emerald-200/90 shadow-[0_12px_40px_-8px_rgba(5,150,105,0.22),0_4px_16px_rgba(0,0,0,0.06)] ring-1 ring-emerald-500/10 w-full sm:w-auto"
          aria-label="Thanh dock điều hướng quản trị 7 nút"
        >
          {/* NÚT 1: TRỞ LẠI (Có viền bao quanh) */}
          <button
            type="button"
            onClick={handleGoBack}
            className="flex flex-col items-center justify-center p-1 sm:p-1.5 min-w-[38px] sm:min-w-[50px] rounded-xl sm:rounded-2xl border border-slate-200/90 hover:border-emerald-300 bg-white/80 hover:bg-emerald-50/80 active:scale-95 transition-all cursor-pointer shadow-2xs"
            title="Quay lại phân hệ hoặc trang trước"
          >
            <ArrowLeft className="w-4 h-4 text-slate-700" />
            <span className="text-[8.5px] sm:text-[10px] font-bold text-slate-600 mt-0.5 leading-none whitespace-nowrap">
              Trở Lại
            </span>
          </button>

          {/* NÚT 2: XEM SHOP / VÀO QUẢN TRỊ (Icon trên, chữ dưới, có viền bao quanh) */}
          <button
            type="button"
            onClick={handleToggleStoreOrAdmin}
            className={`flex flex-col items-center justify-center p-1 sm:p-1.5 min-w-[38px] sm:min-w-[50px] rounded-xl sm:rounded-2xl border active:scale-95 transition-all cursor-pointer shadow-2xs ${
              isStorefront
                ? 'border-emerald-500 bg-emerald-50/90 text-emerald-900 shadow-xs'
                : 'border-slate-200/90 hover:border-emerald-300 bg-white/80 hover:bg-emerald-50/80 text-slate-700'
            }`}
            title={isStorefront ? 'Vào bảng điều hành quản trị' : 'Xem giao diện cửa hàng'}
          >
            {isStorefront ? (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span className="text-[8.5px] sm:text-[10px] font-bold text-emerald-800 mt-0.5 leading-none whitespace-nowrap">
                  Quản Trị
                </span>
              </>
            ) : (
              <>
                <Store className="w-4 h-4 text-emerald-700" />
                <span className="text-[8.5px] sm:text-[10px] font-bold text-slate-700 mt-0.5 leading-none whitespace-nowrap">
                  Xem Shop
                </span>
              </>
            )}
          </button>

          {/* NÚT 3: ĐƠN HÀNG (Kèm Badge Đơn Cọc Chờ Duyệt) */}
          <button
            type="button"
            onClick={handleNavigateOrders}
            className={`relative flex flex-col items-center justify-center p-1 sm:p-1.5 min-w-[38px] sm:min-w-[50px] rounded-xl sm:rounded-2xl border active:scale-95 transition-all cursor-pointer shadow-2xs ${
              !isStorefront && activeTab === 'orders'
                ? 'border-emerald-500 bg-emerald-50/90 text-emerald-900 shadow-xs'
                : 'border-slate-200/90 hover:border-emerald-300 bg-white/80 hover:bg-emerald-50/80 text-slate-700'
            }`}
            title="Quản lý đơn hàng & duyệt cọc 50%"
          >
            <ShoppingBag className="w-4 h-4 text-slate-700" />
            <span className="text-[8.5px] sm:text-[10px] font-bold text-slate-700 mt-0.5 leading-none whitespace-nowrap">
              Đơn Hàng
            </span>

            {pendingOrdersCount > 0 && (
              <span className="absolute -top-1 -right-0.5 min-w-[15px] h-3.5 px-0.5 rounded-full text-[8px] font-black flex items-center justify-center shadow-xs border border-white bg-amber-500 text-white animate-pulse">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          {/* NÚT 4 (CHÍNH GIỮA): QUÉT MÃ QR ĐƠN HÀNG (Nổi bật nhất tâm dock) */}
          <button
            type="button"
            onClick={onOpenQrScanner}
            className="relative -mt-2 sm:-mt-3 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 text-white shadow-[0_8px_20px_rgba(5,150,105,0.4)] ring-3 ring-white flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer group shrink-0 mx-0.5"
            title="Quét mã QR đơn hàng giao hoa để xác nhận hoàn tất & cộng điểm ngay"
          >
            <ScanLine className="w-5 h-5 sm:w-5.5 sm:h-5.5 group-hover:animate-pulse" />
            <span className="sr-only">Quét QR Đơn Hàng</span>
          </button>

          {/* NÚT 5: KHO HOA / MẪU HOA (Kèm Badge Mẫu Hoa) */}
          <button
            type="button"
            onClick={handleNavigateProducts}
            className={`relative flex flex-col items-center justify-center p-1 sm:p-1.5 min-w-[38px] sm:min-w-[50px] rounded-xl sm:rounded-2xl border active:scale-95 transition-all cursor-pointer shadow-2xs ${
              !isStorefront && activeTab === 'products'
                ? 'border-emerald-500 bg-emerald-50/90 text-emerald-900 shadow-xs'
                : 'border-slate-200/90 hover:border-emerald-300 bg-white/80 hover:bg-emerald-50/80 text-slate-700'
            }`}
            title="Quản lý kho mẫu hoa tươi & giá bán"
          >
            <Flower2 className="w-4 h-4 text-slate-700" />
            <span className="text-[8.5px] sm:text-[10px] font-bold text-slate-700 mt-0.5 leading-none whitespace-nowrap">
              Kho Hoa
            </span>

            {productsCount > 0 && (
              <span className="absolute -top-1 -right-0.5 min-w-[15px] h-3.5 px-0.5 rounded-full text-[8px] font-black flex items-center justify-center shadow-xs border border-white bg-emerald-600 text-white">
                {productsCount}
              </span>
            )}
          </button>

          {/* NÚT 6: KHÁCH HÀNG (Có viền bao quanh) */}
          <button
            type="button"
            onClick={handleNavigateCustomers}
            className={`flex flex-col items-center justify-center p-1 sm:p-1.5 min-w-[38px] sm:min-w-[50px] rounded-xl sm:rounded-2xl border active:scale-95 transition-all cursor-pointer shadow-2xs ${
              !isStorefront && activeTab === 'customers'
                ? 'border-emerald-500 bg-emerald-50/90 text-emerald-900 shadow-xs'
                : 'border-slate-200/90 hover:border-emerald-300 bg-white/80 hover:bg-emerald-50/80 text-slate-700'
            }`}
            title="Khách hàng & hội viên VIP"
          >
            <Users className="w-4 h-4 text-slate-700" />
            <span className="text-[8.5px] sm:text-[10px] font-bold text-slate-700 mt-0.5 leading-none whitespace-nowrap">
              Khách Hàng
            </span>
          </button>

          {/* NÚT 7: VOUCHER & MÃ GIẢM GIÁ (Có viền bao quanh) */}
          <button
            type="button"
            onClick={handleNavigateVouchers}
            className={`relative flex flex-col items-center justify-center p-1 sm:p-1.5 min-w-[38px] sm:min-w-[50px] rounded-xl sm:rounded-2xl border active:scale-95 transition-all cursor-pointer shadow-2xs ${
              !isStorefront && activeTab === 'vouchers'
                ? 'border-emerald-500 bg-emerald-50/90 text-emerald-900 shadow-xs'
                : 'border-slate-200/90 hover:border-emerald-300 bg-white/80 hover:bg-emerald-50/80 text-slate-700'
            }`}
            title="Quản lý mã giảm giá & voucher sự kiện"
          >
            <Gift className="w-4 h-4 text-slate-700" />
            <span className="text-[8.5px] sm:text-[10px] font-bold text-slate-700 mt-0.5 leading-none whitespace-nowrap">
              Voucher
            </span>

            {promotionsCount > 0 && (
              <span className="absolute -top-1 -right-0.5 min-w-[15px] h-3.5 px-0.5 rounded-full text-[8px] font-black flex items-center justify-center shadow-xs border border-white bg-purple-600 text-white">
                {promotionsCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </>
  );
};
