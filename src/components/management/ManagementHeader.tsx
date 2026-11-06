import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  ShieldCheck,
  LogOut,
  Store,
  Sparkles
} from 'lucide-react';

interface ManagementHeaderProps {
  role: 'admin' | 'owner';
  onNavigateTab?: (tab: string) => void;
}

export const ManagementHeader: React.FC<ManagementHeaderProps> = ({ role, onNavigateTab }) => {
  const {
    setCurrentView,
    logoutAdmin,
    orders,
    settings
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
    <div className="w-full pt-3 pb-2 px-3 sm:px-6 select-none transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 relative">
        {/* === LEFT: TIỆM HOA BADGE (CÂN ĐỐI 2 BÊN) === */}
        <div className="w-auto sm:w-[220px] flex items-center gap-2">
          <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-xl border border-emerald-100 shadow-2xs text-xs text-emerald-950">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-[11px] truncate">
              {settings.address || '105 Doãn Kế Thiện'} • {settings.openingHours || '06:30 - 21:30'}
            </span>
          </div>

          <button
            onClick={handleReturnToStore}
            className="sm:hidden p-2 rounded-full bg-white/85 text-emerald-800 border border-emerald-200/80 shadow-2xs hover:bg-white"
            title="Xem cửa hàng khách mua"
          >
            <Store className="w-4 h-4" />
          </button>
        </div>

        {/* === CENTER: KHỐI LOGO CHÍNH GIỮA TO HƠN, BÓNG KÍNH NỔI BẬT === */}
        <div className="flex items-center justify-center">
          <div
            onClick={handleReturnToStore}
            className="flex items-center justify-center cursor-pointer group py-1.5 px-4 sm:px-6 rounded-full bg-white/92 backdrop-blur-2xl border border-white/80 shadow-[0_4px_20px_rgba(5,150,105,0.12)] hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
            title="V&V Florielle - Bấm để chuyển nhanh ra xem giao diện cửa hàng"
          >
            <img
              src="/logo-vvflorielle-horizontal.png"
              alt="V&V Florielle"
              className="h-[46px] sm:h-[54px] max-w-none w-auto object-contain filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.08)]"
            />
          </div>
        </div>

        {/* === RIGHT: CỤM 3 NÚT CHUẨN ẢNH 3 & ẢNH 4 === */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 justify-end w-auto sm:w-[380px]">
          {/* Nút 1: Đơn cọc chờ duyệt (Ảnh 3) */}
          {pendingDepositOrders > 0 && (
            <button
              onClick={() => onNavigateTab?.('orders')}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-amber-50/95 hover:bg-amber-100/90 border border-amber-300 text-amber-900 text-[11px] sm:text-xs font-bold shadow-2xs animate-pulse cursor-pointer transition-colors"
              title="Xem danh sách đơn cọc cần duyệt"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
              <span className="whitespace-nowrap">
                {pendingDepositOrders} đơn cọc
                <span className="hidden md:inline"> chờ duyệt</span>
              </span>
            </button>
          )}

          {/* Nút 2: Role Badge Super Admin / Chủ Quán (Ảnh 3) */}
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-bold border shadow-2xs ${
              isOwner
                ? 'bg-emerald-50/95 text-emerald-900 border-emerald-200'
                : 'bg-purple-50/95 text-purple-900 border-purple-200'
            }`}
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${isOwner ? 'text-emerald-700' : 'text-purple-700'} shrink-0`} />
            <span className="whitespace-nowrap">
              {isOwner ? 'Chủ Quán' : 'Super Admin'}
              <span className="hidden lg:inline">{isOwner ? ' (Florist Ops)' : ' (Hệ Thống)'}</span>
            </span>
          </div>

          {/* Nút 3: Đăng Xuất (Ảnh 4) */}
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full bg-rose-50/95 hover:bg-rose-100 text-rose-700 hover:text-rose-900 text-[11px] sm:text-xs font-bold border border-rose-200 shadow-2xs transition-colors cursor-pointer"
            title="Đăng xuất khỏi quyền quản trị"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span className="hidden min-[400px]:inline whitespace-nowrap">Đăng Xuất</span>
          </button>
        </div>
      </div>
    </div>
  );
};
