import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Flower2,
  Layers,
  Store,
  LogOut,
  ShieldCheck,
  Clock,
  Sparkles
} from 'lucide-react';

interface ManagementHeaderProps {
  role: 'admin' | 'owner';
}

export const ManagementHeader: React.FC<ManagementHeaderProps> = ({ role }) => {
  const {
    isAdmin,
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
    <header className="sticky top-0 z-40 w-full bg-white/92 backdrop-blur-xl border-b border-emerald-100/90 shadow-xs select-none transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-15 sm:h-16 flex items-center justify-between gap-3">
        {/* === LEFT: BRAND & SUB-SYSTEM TITLE === */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            onClick={handleReturnToStore}
            className="flex items-center gap-2.5 cursor-pointer group py-1"
            title="Bấm để xem giao diện khách mua hoa"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform shrink-0 border border-white/80">
              {isOwner ? <Flower2 className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-serif font-black text-sm sm:text-base tracking-wide text-emerald-950">
                  V&amp;V Florielle
                </span>
                <span className="text-[9.5px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100/80 text-emerald-900 border border-emerald-200">
                  {isOwner ? 'Boutique Ops' : 'Studio CMS'}
                </span>
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
                {isOwner ? 'Bảng Quản Lý Chủ Tiệm Hoa' : 'Trung Tâm Quản Trị Hệ Thống'}
              </div>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-200 hidden md:block" />

          {/* Tiệm mở cửa badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-900">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-[11px]">
              {settings.address} • {settings.openingHours}
            </span>
          </div>
        </div>

        {/* === CENTER: OPERATIONAL STATUS BADGE === */}
        <div className="hidden sm:flex items-center gap-2">
          {pendingDepositOrders > 0 && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold animate-pulse shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>{pendingDepositOrders} đơn cọc chờ duyệt</span>
            </div>
          )}

          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border shadow-2xs ${
              isOwner
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                : 'bg-purple-50 text-purple-900 border-purple-200'
            }`}
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${isOwner ? 'text-emerald-700' : 'text-purple-700'} shrink-0`} />
            <span>{isOwner ? 'Chủ Quán (Florist Ops)' : 'Super Admin (Hệ Thống)'}</span>
          </div>
        </div>

        {/* === RIGHT: RETURN TO STORE & LOGOUT === */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleReturnToStore}
            className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 hover:text-slate-900 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Xem giao diện khách hàng"
          >
            <Store className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden min-[480px]:inline">Xem Cửa Hàng</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-900 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-rose-200"
            title="Đăng xuất quản trị"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-600" />
            <span>Đăng Xuất</span>
          </button>
        </div>
      </div>
    </header>
  );
};
