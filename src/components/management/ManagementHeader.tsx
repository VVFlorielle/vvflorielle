import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  ShieldCheck,
  LogOut,
  AlertCircle
} from 'lucide-react';

interface ManagementHeaderProps {
  role: 'admin' | 'owner';
  onNavigateTab?: (tab: string) => void;
}

export const ManagementHeader: React.FC<ManagementHeaderProps> = ({ role, onNavigateTab }) => {
  const {
    setCurrentView,
    logoutAdmin,
    orders
  } = useStore();

  const isOwner = role === 'owner';
  const pendingDepositOrders = orders.filter(
    (o) => !o.isDepositPaid && o.status !== 'CANCELLED'
  ).length;

  const handleReturnToStore = () => {
    setCurrentView('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    logoutAdmin();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="w-full pt-3 pb-2 px-3 sm:px-6 select-none transition-all">
      {/* 3-column layout matching the exact content width below, logo 100% mathematically centered */}
      <div className="max-w-7xl mx-auto grid grid-cols-3 items-center gap-2 sm:gap-4 relative">
        {/* === LEFT: KHỐI THÔNG BÁO ĐƠN CỌC CHỜ DUYỆT (CHUYỂN TỪ BÊN PHẢI SANG, BỎ ĐỊA CHỈ/GIỜ MỞ CỬA) === */}
        <div className="flex items-center justify-start">
          {pendingDepositOrders > 0 ? (
            <button
              type="button"
              onClick={() => onNavigateTab?.('orders')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50/95 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold shadow-2xs animate-pulse cursor-pointer transition-all"
              title="Xem danh sách đơn cọc cần duyệt"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
              <span className="whitespace-nowrap">
                {pendingDepositOrders} đơn cọc<span className="hidden sm:inline"> chờ duyệt</span>
              </span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50/90 text-emerald-800 border border-emerald-200/80 text-xs font-semibold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="whitespace-nowrap">
                0 đơn<span className="hidden sm:inline"> chờ duyệt</span>
              </span>
            </div>
          )}
        </div>

        {/* === CENTER: LOGO CĂN CHÍNH XÁC Ở GIỮA === */}
        <div className="flex items-center justify-center">
          <div
            onClick={handleReturnToStore}
            className="inline-flex items-center justify-center cursor-pointer group py-1 px-4 sm:px-6 rounded-full bg-white/92 backdrop-blur-2xl border border-white/80 shadow-[0_4px_20px_rgba(5,150,105,0.12)] hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
            title="V&V Florielle - Bấm để chuyển nhanh ra xem giao diện cửa hàng"
          >
            <img
              src="/logo-vvflorielle-horizontal.png"
              alt="V&V Florielle"
              className="h-[44px] sm:h-[50px] max-w-none w-auto object-contain filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.06)]"
            />
          </div>
        </div>

        {/* === RIGHT: NÚT TÀI KHOẢN NGẮN GỌN (Admin / Chủ Quán) & ĐĂNG XUẤT === */}
        <div className="flex items-center justify-end gap-1.5 sm:gap-2.5">
          {/* Role Badge: Ngắn gọn Admin hoặc Chủ Quán, không có mở ngoặc hệ thống */}
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold border shadow-2xs ${
              isOwner
                ? 'bg-emerald-50/95 text-emerald-900 border-emerald-200'
                : 'bg-purple-50/95 text-purple-900 border-purple-200'
            }`}
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${isOwner ? 'text-emerald-700' : 'text-purple-700'} shrink-0`} />
            <span className="whitespace-nowrap">{isOwner ? 'Chủ Quán' : 'Admin'}</span>
          </div>

          {/* Đăng Xuất Button: Nơi an toàn duy nhất để đăng xuất */}
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full bg-rose-50/95 hover:bg-rose-100 text-rose-700 hover:text-rose-900 text-xs font-bold border border-rose-200 shadow-2xs transition-colors cursor-pointer"
            title="Đăng xuất khỏi quyền quản trị"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span className="hidden min-[480px]:inline whitespace-nowrap">Đăng Xuất</span>
          </button>
        </div>
      </div>
    </header>
  );
};
