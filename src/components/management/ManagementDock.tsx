import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Eye,
  LogOut,
  ShieldCheck,
  Flower2,
  Layers,
  Sparkles,
  Store,
  Clock,
  Lock
} from 'lucide-react';

interface ManagementDockProps {
  role: 'admin' | 'owner';
}

export const ManagementDock: React.FC<ManagementDockProps> = ({ role }) => {
  const {
    isAdmin,
    setCurrentView,
    logoutAdmin,
    orders
  } = useStore();

  const isOwner = role === 'owner';
  const pendingDepositOrders = orders.filter(
    (o) => o.paymentStatus === 'PARTIAL_PAID' && o.depositApprovedBy !== 'ADMIN'
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
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-emerald-100/80 shadow-xs select-none transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-15 sm:h-17 flex items-center justify-between gap-2 sm:gap-4">
        {/* === LEFT: LOGO & STATUS === */}
        <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
          <div
            onClick={handleReturnToStore}
            className="flex items-center gap-2 cursor-pointer group py-1"
            title="Bấm để xem giao diện khách mua hoa"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-700/15 group-hover:scale-105 transition-transform shrink-0">
              {isOwner ? <Flower2 className="w-4.5 h-4.5 sm:w-5 sm:h-5" /> : <Layers className="w-4.5 h-4.5 sm:w-5 sm:h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-serif font-black text-xs sm:text-base tracking-wide text-emerald-950">
                  V&amp;V Florielle
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                  {isOwner ? 'Boutique' : 'Studio'}
                </span>
              </div>
              <div className="text-[9.5px] sm:text-[11px] text-slate-500 font-medium">
                {isOwner ? 'Bảng Quản Lý Chủ Tiệm' : 'Trung Tâm Quản Trị'}
              </div>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-200 hidden md:block" />

          {/* Tiệm mở cửa badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50/80 border border-emerald-200/70 text-xs text-emerald-900">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-[11px]">
              {isOwner ? 'Vận Hành Tiệm Hoa • 105 Doãn Kế Thiện' : 'Hệ Thống & Liveview CMS Song Song'}
            </span>
          </div>
        </div>

        {/* === CENTER: ROLE & NOTIFICATION BADGES (RESPONSIVE) === */}
        {isAdmin && (
          <div className="hidden sm:flex items-center gap-2">
            {pendingDepositOrders > 0 && isOwner && (
              <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-[11px] sm:text-xs font-bold animate-pulse">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>{pendingDepositOrders} đơn cọc chờ duyệt</span>
              </div>
            )}

            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border shadow-2xs ${
                isOwner
                  ? 'bg-emerald-50/90 text-emerald-900 border-emerald-200'
                  : 'bg-purple-50/90 text-purple-900 border-purple-200'
              }`}
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${isOwner ? 'text-emerald-700' : 'text-purple-700'} shrink-0`} />
              <span>{isOwner ? 'Chủ Quán (Florist Ops)' : 'Super Admin (Hệ Thống)'}</span>
            </div>
          </div>
        )}

        {/* === RIGHT: ACTION BUTTONS === */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Nút Xem Cửa Hàng */}
          <button
            onClick={handleReturnToStore}
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-slate-100/90 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-200 text-xs font-bold shadow-2xs transition-all hover:scale-[1.02] cursor-pointer"
            title="Chuyển sang giao diện xem và mua hoa của khách hàng"
          >
            <Eye className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="hidden sm:inline">Xem Cửa Hàng</span>
            <span className="sm:hidden text-[11px]">Xem Shop</span>
          </button>

          {/* Nút Đăng Xuất An Toàn (Chỉ hiện khi đã đăng nhập) */}
          {isAdmin ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold shadow-2xs transition-all hover:scale-[1.02] cursor-pointer"
              title="Đăng xuất an toàn khỏi phiên làm việc quản trị"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span className="hidden sm:inline">Đăng Xuất</span>
              <span className="sm:hidden text-[11px]">Thoát</span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-bold">
              <Lock className="w-3 h-3" />
              <span>Cổng Đăng Nhập</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
