import React, { useState, useEffect, useRef } from 'react';
import {
  Store,
  ShieldCheck,
  ShoppingBag,
  ScanLine,
  Flower2,
  Users,
  ArrowLeft,
  Settings,
  Gift,
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
  const { currentView, setCurrentView, activeAdminUser } = useStore();
  const isStorefront = currentView === 'store' || currentView === 'care' || currentView === 'about' || currentView === 'contact' || currentView === 'catalog';
  const targetAdminView = (activeAdminUser === 'vvflorielle' || activeAdminUser === 'chuquan') ? 'owner' : 'admin';

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

  // Nút 1: Quay Lại thao tác trước
  const handleGoBack = () => {
    if (!isStorefront && activeTab !== 'dashboard') {
      // Đang ở trong subpage quản trị (ví dụ: kho hoa, đơn hàng, khách hàng) -> quay về Tổng Quan
      onSelectTab?.('dashboard');
    } else if (isStorefront) {
      // Đang ở ngoài Storefront -> quay trở lại trang quản trị
      setCurrentView(targetAdminView);
      onSelectTab?.('dashboard');
    } else {
      // Đang ở dashboard -> nếu có lịch sử trình duyệt thì back, nếu không thì ra store
      if (window.history.length > 1) {
        window.history.back();
      } else {
        setCurrentView('store');
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Nút 2: Chuyển đổi giữa Xem Shop và Vào Quản Trị
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
    if (isStorefront) {
      setCurrentView(targetAdminView);
    }
    onSelectTab?.('orders');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Nút 5: Kho Mẫu Hoa
  const handleNavigateProducts = () => {
    if (isStorefront) {
      setCurrentView(targetAdminView);
    }
    onSelectTab?.('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Nút 6: Khách Hàng
  const handleNavigateCustomers = () => {
    if (isStorefront) {
      setCurrentView(targetAdminView);
    }
    onSelectTab?.('customers');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* ================================================================
          DOCK 1: THANH DOCK ẨN MỞ RỘNG TRÊN MOBILE (UNFURL DOCK)
          Nút tròn bánh răng nổi ở góc trái bên trên dock chính ~10px.
          Bấm bung ra khay cuộn chức năng phụ (Voucher, Cài Đặt, Cẩm Nang...)
          ================================================================ */}
      <div
        className="fixed left-2 bottom-[68px] z-[75] flex items-center pointer-events-auto sm:hidden"
        onTouchStart={resetAutoCollapse}
      >
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/94 backdrop-blur-2xl border border-emerald-200/90 shadow-[0_8px_24px_rgba(5,150,105,0.2)] transition-all duration-300">
          {/* Nút tròn bánh răng mở rộng */}
          <button
            type="button"
            onClick={() => setIsUnfurlExpanded(!isUnfurlExpanded)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 cursor-pointer ${
              isUnfurlExpanded
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
            title={isUnfurlExpanded ? 'Thu gọn menu phụ' : 'Mở thanh dock chức năng phụ'}
          >
            <Settings className={`w-4 h-4 transition-transform duration-300 ${isUnfurlExpanded ? 'rotate-90' : ''}`} />
          </button>

          {/* Khay trượt Slide-out / Slide-in êm ái */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out flex items-center ${
              isUnfurlExpanded
                ? 'max-w-[calc(100vw-70px)] opacity-100 translate-x-0'
                : 'max-w-0 opacity-0 -translate-x-3 pointer-events-none'
            }`}
          >
            <nav className="flex items-center gap-1 px-1 py-0.5 whitespace-nowrap overflow-x-auto no-scrollbar">
              {/* Voucher */}
              <button
                type="button"
                onClick={() => {
                  setIsUnfurlExpanded(false);
                  if (isStorefront) setCurrentView(targetAdminView);
                  onSelectTab?.('vouchers');
                }}
                className="flex items-center gap-1 py-1 px-2.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 text-[10px] font-bold transition-colors shrink-0"
              >
                <Gift className="w-3 h-3 text-amber-600" />
                <span>Voucher</span>
              </button>

              {/* Kênh CSKH */}
              <button
                type="button"
                onClick={() => {
                  setIsUnfurlExpanded(false);
                  if (isStorefront) setCurrentView(targetAdminView);
                  onSelectTab?.('channels');
                }}
                className="flex items-center gap-1 py-1 px-2.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-900 text-[10px] font-bold transition-colors shrink-0"
              >
                <Phone className="w-3 h-3 text-sky-600" />
                <span>CSKH</span>
              </button>

              {/* Cài Đặt Tiệm */}
              <button
                type="button"
                onClick={() => {
                  setIsUnfurlExpanded(false);
                  if (isStorefront) setCurrentView(targetAdminView);
                  onSelectTab?.('settings');
                }}
                className="flex items-center gap-1 py-1 px-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-[10px] font-bold transition-colors shrink-0"
              >
                <Settings className="w-3 h-3 text-emerald-600" />
                <span>Cài Đặt</span>
              </button>

              {/* Cẩm Nang Dưỡng Hoa */}
              <button
                type="button"
                onClick={() => {
                  setIsUnfurlExpanded(false);
                  setCurrentView('care');
                }}
                className="flex items-center gap-1 py-1 px-2.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-900 text-[10px] font-bold transition-colors shrink-0"
              >
                <BookOpen className="w-3 h-3 text-rose-600" />
                <span>Cẩm Nang</span>
              </button>

              {/* Giới Thiệu Tiệm */}
              <button
                type="button"
                onClick={() => {
                  setIsUnfurlExpanded(false);
                  setCurrentView('about');
                }}
                className="flex items-center gap-1 py-1 px-2.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-900 text-[10px] font-bold transition-colors shrink-0"
              >
                <Info className="w-3 h-3 text-purple-600" />
                <span>Về Tiệm</span>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* ================================================================
          DOCK 2: THANH DOCK ĐIỀU HÀNH CHÍNH
          Mobile: Cách 2 mép 8px (left-2 right-2) để tối ưu không gian hiển thị
          Desktop: Tự co gọn căn chính xác giữa màn hình
          Gồm 5-6 nút: [Quay Lại] [Xem Shop] [Đơn Hàng] [⚡ QUÉT QR] [Kho Hoa] [Khách Hàng]
          TUYỆT ĐỐI KHÔNG CÓ NÚT ĐĂNG XUẤT ĐỂ TRÁNH BẤM NHẦM
          ================================================================ */}
      <div className="fixed bottom-2 sm:bottom-5 inset-x-2 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-[70] select-none pointer-events-auto">
        <nav
          className="flex items-center justify-between sm:justify-center gap-0.5 sm:gap-1.5 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/94 backdrop-blur-2xl border border-emerald-200/90 shadow-[0_12px_40px_-8px_rgba(5,150,105,0.22),0_4px_16px_rgba(0,0,0,0.06)] ring-1 ring-emerald-500/10 w-full sm:w-auto"
          aria-label="Thanh dock điều hướng quản trị"
        >
          {/* NÚT 1: QUAY LẠI THAO TÁC TRƯỚC */}
          <button
            type="button"
            onClick={handleGoBack}
            className="flex items-center gap-1 px-2 py-1.5 sm:px-3 sm:py-2 rounded-full text-xs font-bold text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/80 active:scale-95 transition-all cursor-pointer"
            title="Quay lại trang hoặc phân hệ thao tác trước"
          >
            <ArrowLeft className="w-4 h-4 shrink-0 text-slate-600" />
            <span className="hidden min-[480px]:inline whitespace-nowrap text-[11px] sm:text-xs">Quay Lại</span>
          </button>

          {/* NÚT 2: XEM CỬA HÀNG / VÀO QUẢN TRỊ (Bóng kính ngọc lục bảo mềm mại, không viền đen) */}
          <button
            type="button"
            onClick={handleToggleStoreOrAdmin}
            className={`flex items-center gap-1 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
              isStorefront
                ? 'bg-gradient-to-r from-emerald-700 to-teal-700 text-white shadow-md shadow-emerald-700/25 ring-2 ring-emerald-400/40'
                : 'text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/80 active:scale-95'
            }`}
            title={isStorefront ? 'Vào bảng điều hành quản trị' : 'Xem giao diện cửa hàng khách mua'}
          >
            {isStorefront ? (
              <>
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-200" />
                <span className="whitespace-nowrap text-[11px] sm:text-xs">Vào Quản Trị</span>
              </>
            ) : (
              <>
                <Store className="w-4 h-4 shrink-0 text-emerald-700" />
                <span className="hidden min-[420px]:inline whitespace-nowrap text-[11px] sm:text-xs">Xem Shop</span>
              </>
            )}
          </button>

          {/* NÚT 3: ĐƠN HÀNG (Kèm Badge Đơn Cọc Chờ Duyệt) */}
          <button
            type="button"
            onClick={handleNavigateOrders}
            className={`relative flex items-center gap-1 px-2 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
              !isStorefront && activeTab === 'orders'
                ? 'bg-gradient-to-r from-emerald-700 to-teal-700 text-white shadow-md shadow-emerald-700/25 ring-2 ring-emerald-400/40'
                : 'text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/80 active:scale-95'
            }`}
            title="Quản lý đơn hàng & duyệt cọc 50%"
          >
            <ShoppingBag className="w-4 h-4 shrink-0 text-slate-700" />
            <span className="hidden min-[440px]:inline whitespace-nowrap text-[11px] sm:text-xs">Đơn Hàng</span>

            {pendingOrdersCount > 0 && (
              <span className="absolute -top-1 -right-0.5 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-black flex items-center justify-center shadow-xs border border-white bg-amber-500 text-white animate-pulse">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          {/* NÚT 4: NÚT Ở GIỮA - QUÉT MÃ QR ĐƠN HÀNG (TO NHẤT, NỔI BẬT LỚN) */}
          <button
            type="button"
            onClick={onOpenQrScanner}
            className="relative -mt-2.5 sm:-mt-4 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 text-white shadow-[0_8px_25px_rgba(5,150,105,0.45)] ring-4 ring-white flex flex-col items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-200 cursor-pointer group shrink-0 mx-0.5 sm:mx-1"
            title="Quét mã QR đơn hàng giao hoa để xác nhận hoàn tất & cộng điểm ngay"
          >
            <ScanLine className="w-5 h-5 sm:w-5.5 sm:h-5.5 group-hover:animate-pulse" />
            <span className="sr-only">Quét QR Đơn Hàng</span>
          </button>

          {/* NÚT 5: KHO MẪU HOA TƯƠI */}
          <button
            type="button"
            onClick={handleNavigateProducts}
            className={`relative flex items-center gap-1 px-2 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
              !isStorefront && activeTab === 'products'
                ? 'bg-gradient-to-r from-emerald-700 to-teal-700 text-white shadow-md shadow-emerald-700/25 ring-2 ring-emerald-400/40'
                : 'text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/80 active:scale-95'
            }`}
            title="Quản lý kho mẫu hoa tươi & giá bán"
          >
            <Flower2 className="w-4 h-4 shrink-0 text-slate-700" />
            <span className="hidden min-[440px]:inline whitespace-nowrap text-[11px] sm:text-xs">Kho Hoa</span>

            {productsCount > 0 && (
              <span className="hidden sm:flex absolute -top-1 -right-0.5 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-black items-center justify-center shadow-xs border border-white bg-emerald-600 text-white">
                {productsCount}
              </span>
            )}
          </button>

          {/* NÚT 6: KHÁCH HÀNG VIP */}
          <button
            type="button"
            onClick={handleNavigateCustomers}
            className={`flex items-center gap-1 px-2 py-1.5 sm:px-3 sm:py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
              !isStorefront && activeTab === 'customers'
                ? 'bg-gradient-to-r from-emerald-700 to-teal-700 text-white shadow-md shadow-emerald-700/25 ring-2 ring-emerald-400/40'
                : 'text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/80 active:scale-95'
            }`}
            title="Khách hàng & hội viên VIP"
          >
            <Users className="w-4 h-4 shrink-0 text-slate-700" />
            <span className="hidden min-[500px]:inline whitespace-nowrap text-[11px] sm:text-xs">Khách Hàng</span>
          </button>
        </nav>
      </div>
    </>
  );
};
