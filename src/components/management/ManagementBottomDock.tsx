import React from 'react';
import {
  Store,
  ShieldCheck,
  ShoppingBag,
  ScanLine,
  Flower2,
  Users,
  LogOut,
  Gift,
  ArrowLeft
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
  const { currentView, setCurrentView, logoutAdmin, activeAdminUser } = useStore();
  const isStorefront = currentView === 'store' || currentView === 'care';
  const targetAdminView = (activeAdminUser === 'vvflorielle' || activeAdminUser === 'chuquan') ? 'owner' : 'admin';

  const handleToggleStoreOrAdmin = () => {
    if (isStorefront) {
      setCurrentView(targetAdminView);
      onSelectTab?.('dashboard');
    } else {
      setCurrentView('store');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateOrders = () => {
    if (isStorefront) {
      setCurrentView(targetAdminView);
    }
    onSelectTab?.('orders');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateProducts = () => {
    if (isStorefront) {
      setCurrentView(targetAdminView);
    }
    onSelectTab?.('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateCustomers = () => {
    if (isStorefront) {
      setCurrentView(targetAdminView);
    }
    onSelectTab?.('customers');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    logoutAdmin();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-[70] max-w-[96vw] select-none pointer-events-auto">
      <nav
        className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-full bg-white/92 backdrop-blur-2xl border border-emerald-200/90 shadow-[0_12px_40px_-8px_rgba(5,150,105,0.25),0_4px_16px_rgba(0,0,0,0.08)] ring-1 ring-emerald-500/10"
        aria-label="Thanh dock điều hướng quản trị 5 nút"
      >
        {/* NÚT 1: Chuyển đổi giữa Xem Cửa Hàng và Vào Quản Trị */}
        <button
          onClick={handleToggleStoreOrAdmin}
          className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
            isStorefront
              ? 'bg-gradient-to-r from-emerald-700 to-teal-700 text-white shadow-md shadow-emerald-700/25 ring-2 ring-emerald-400/40'
              : 'text-slate-600 hover:text-emerald-800 hover:bg-emerald-50/80 active:scale-95'
          }`}
          title={isStorefront ? 'Vào bảng điều hành quản trị' : 'Xem giao diện cửa hàng khách mua'}
        >
          {isStorefront ? (
            <>
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-200" />
              <span className="whitespace-nowrap">Vào Quản Trị</span>
            </>
          ) : (
            <>
              <Store className="w-4 h-4 shrink-0 text-emerald-700" />
              <span className="hidden min-[480px]:inline whitespace-nowrap">Xem Cửa Hàng</span>
            </>
          )}
        </button>

        {/* NÚT 2: Đơn Hàng (Kèm Badge Đơn Cọc Chờ Duyệt) */}
        <button
          onClick={handleNavigateOrders}
          className={`relative flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
            !isStorefront && activeTab === 'orders'
              ? 'bg-gradient-to-r from-emerald-700 to-teal-700 text-white shadow-md shadow-emerald-700/25 ring-2 ring-emerald-400/40'
              : 'text-slate-600 hover:text-emerald-800 hover:bg-emerald-50/80 active:scale-95'
          }`}
          title="Quản lý đơn hàng & duyệt cọc 50%"
        >
          <ShoppingBag className="w-4 h-4 shrink-0" />
          <span className="hidden min-[520px]:inline whitespace-nowrap">Đơn Hàng</span>

          {pendingOrdersCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-black flex items-center justify-center shadow-xs border border-white bg-amber-500 text-white animate-pulse">
              {pendingOrdersCount}
            </span>
          )}
        </button>

        {/* NÚT 3: NÚT Ở GIỮA - QUÉT MÃ QR ĐƠN HÀNG (TO NHẤT, NỔI BẬT LỚN) */}
        <button
          onClick={onOpenQrScanner}
          className="relative -mt-3.5 sm:-mt-4.5 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 text-white shadow-[0_8px_25px_rgba(5,150,105,0.45)] ring-4 ring-white flex flex-col items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-200 cursor-pointer group"
          title="Quét mã QR đơn hàng giao hoa để xác nhận hoàn tất & cộng điểm ngay"
        >
          <ScanLine className="w-5 h-5 sm:w-6 sm:h-6 group-hover:animate-pulse" />
          <span className="sr-only">Quét QR Đơn Hàng</span>
        </button>

        {/* NÚT 4: Kho Mẫu Hoa Tươi */}
        <button
          onClick={handleNavigateProducts}
          className={`relative flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
            !isStorefront && activeTab === 'products'
              ? 'bg-gradient-to-r from-emerald-700 to-teal-700 text-white shadow-md shadow-emerald-700/25 ring-2 ring-emerald-400/40'
              : 'text-slate-600 hover:text-emerald-800 hover:bg-emerald-50/80 active:scale-95'
          }`}
          title="Quản lý kho mẫu hoa tươi & giá bán"
        >
          <Flower2 className="w-4 h-4 shrink-0" />
          <span className="hidden min-[520px]:inline whitespace-nowrap">Kho Hoa</span>

          {productsCount > 0 && (
            <span className="hidden sm:flex absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-black items-center justify-center shadow-xs border border-white bg-emerald-600 text-white">
              {productsCount}
            </span>
          )}
        </button>

        {/* NÚT 5: Khách Hàng VIP */}
        <button
          onClick={handleNavigateCustomers}
          className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
            !isStorefront && activeTab === 'customers'
              ? 'bg-gradient-to-r from-emerald-700 to-teal-700 text-white shadow-md shadow-emerald-700/25 ring-2 ring-emerald-400/40'
              : 'text-slate-600 hover:text-emerald-800 hover:bg-emerald-50/80 active:scale-95'
          }`}
          title="Khách hàng & hội viên VIP"
        >
          <Users className="w-4 h-4 shrink-0" />
          <span className="hidden min-[480px]:inline whitespace-nowrap">Khách Hàng</span>
        </button>

        {/* Divider */}
        <div className="h-5 w-px bg-slate-200 mx-0.5" />

        {/* NÚT PHỤ: Đăng Xuất */}
        <button
          onClick={handleLogout}
          className="p-1.5 sm:p-2 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          title="Đăng xuất quyền quản trị"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </nav>
    </div>
  );
};
