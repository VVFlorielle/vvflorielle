import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  Eye,
  LogOut,
  ShieldCheck,
  Flower2,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Store,
  Layers
} from 'lucide-react';

export const ManagementHeader: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    activeAdminUser,
    logoutAdmin,
    settings,
    orders
  } = useStore();

  const isOwner = currentView === 'owner' || activeAdminUser === 'vvflorielle' || activeAdminUser === 'chuquan';
  const pendingDepositOrders = orders.filter((o) => o.paymentStatus === 'PARTIAL_PAID' && o.depositApprovedBy !== 'ADMIN').length;

  const handleReturnToStore = () => {
    setCurrentView('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    logoutAdmin();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 text-white shadow-xl transition-all select-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 sm:h-18 flex items-center justify-between gap-3">
        {/* === LEFT: LOGO & WORKSPACE TITLE === */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <div
            onClick={handleReturnToStore}
            className="flex items-center gap-2.5 cursor-pointer group py-1"
            title="Bấm để xem giao diện khách hàng"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform shrink-0">
              {isOwner ? <Flower2 className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
            </div>
            <div className="hidden min-[420px]:block">
              <div className="flex items-center gap-2">
                <span className="font-serif font-black text-sm sm:text-base tracking-wide bg-gradient-to-r from-emerald-400 via-teal-200 to-white bg-clip-text text-transparent">
                  V&V Florielle
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {isOwner ? 'Boutique' : 'Studio'}
                </span>
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium">
                {isOwner ? 'Bảng Quản Lý Chủ Tiệm' : 'Trung Tâm Quản Trị Admin'}
              </div>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-700/80 hidden sm:block" />

          {/* Quick status badge for workspace */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-medium">
              {isOwner ? 'Vận Hành Tiệm Hoa • 105 Doãn Kế Thiện' : 'Hệ Thống & Liveview CMS Song Song'}
            </span>
          </div>
        </div>

        {/* === CENTER / BADGE === */}
        <div className="flex items-center gap-2">
          {pendingDepositOrders > 0 && isOwner && (
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold animate-pulse">
              <span>{pendingDepositOrders} đơn cọc chờ duyệt</span>
            </div>
          )}

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-semibold text-[11px] sm:text-xs">
              {isOwner ? 'Chủ Quán (Florist Ops)' : 'Super Admin (Kỹ Thuật)'}
            </span>
          </div>
        </div>

        {/* === RIGHT: ACTIONS === */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Nút Xem Cửa Hàng Khách */}
          <button
            onClick={handleReturnToStore}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
            title="Chuyển sang giao diện mua hoa của khách hàng"
          >
            <Eye className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="hidden sm:inline">Xem Cửa Hàng</span>
            <span className="sm:hidden">Xem Shop</span>
          </button>

          {/* Nút Đăng Xuất An Toàn */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 hover:text-rose-100 border border-rose-500/30 text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
            title="Đăng xuất khỏi phiên quản trị an toàn"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="hidden sm:inline">Đăng Xuất</span>
          </button>
        </div>
      </div>
    </header>
  );
};
