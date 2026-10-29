import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  ShoppingBag,
  ShoppingCart,
  User,
  ShieldCheck,
  PhoneCall,
  Search,
  Sparkles,
  LogOut,
  Flower2,
  Gift,
  MapPin,
  ChevronDown,
  Bell,
  CheckCircle2,
  Volume2,
  Trash2,
  X
} from 'lucide-react';
import { PopupType } from './InfoPopups';
import { CategoryId } from '../types';

interface HeaderProps {
  onOpenPopup?: (type: PopupType) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenPopup }) => {
  const {
    currentView,
    setCurrentView,
    cart,
    setIsCartOpen,
    customer,
    isAdmin,
    activeAdminUser,
    logoutCustomer,
    logoutAdmin,
    setIsAuthModalOpen,
    setAuthModalMode,
    searchQuery,
    setSearchQuery,
    settings,
    categories,
    setSelectedCategory,
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    clearAllNotifications,
    activeBannerNotification,
    dismissBannerNotification,
    pointsCelebrationModal,
    dismissPointsCelebrationModal,
    testCuteVoice
  } = useStore();

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isNotificationHubOpen, setIsNotificationHubOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    if (currentView !== 'store') {
      setCurrentView('store');
    }
  };

  const handleSelectCategory = (catId: CategoryId) => {
    setSelectedCategory(catId);
    if (currentView !== 'store') {
      setCurrentView('store');
    }
    setIsCategoryMenuOpen(false);
  };

  return (
    <>
      {/* 1. IN-APP FLOATING PUSH BANNER (iOS Luxury Dynamic Island Style) */}
      {activeBannerNotification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[94%] max-w-md animate-in slide-in-from-top-4 duration-300">
          <div className="rounded-2xl p-3.5 bg-white/95 backdrop-blur-2xl border border-emerald-300/80 shadow-2xl flex items-start gap-3 relative">
            <button
              onClick={dismissBannerNotification}
              className="absolute top-2.5 right-2.5 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              title="Đóng thông báo"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center shrink-0 shadow-md">
              <Flower2 className="w-5 h-5" />
            </div>
            <div className="flex-1 pr-6">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-slate-900">{activeBannerNotification.title}</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full">Mới</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-snug line-clamp-2">
                {activeBannerNotification.message}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <button
                  onClick={() => {
                    dismissBannerNotification();
                    if (activeBannerNotification.orderId) {
                      if (isAdmin) setCurrentView('admin');
                      else setCurrentView('customer');
                    }
                  }}
                  className="text-[11px] font-bold text-emerald-700 hover:underline"
                >
                  Xem chi tiết →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. POINTS CELEBRATION MODAL (Click outside to dismiss) */}
      {pointsCelebrationModal && pointsCelebrationModal.isOpen && (
        <div
          className="glass-overlay z-[110] flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={dismissPointsCelebrationModal}
        >
          <div
            className="glass-modal-content p-6 sm:p-7 max-w-sm w-full text-center relative rounded-[28px] shadow-2xl border border-emerald-200/80"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={dismissPointsCelebrationModal}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-900 mx-auto flex items-center justify-center shadow-lg shadow-amber-400/30 mb-3 animate-bounce-subtle">
              <Sparkles className="w-9 h-9" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Chúc Mừng Bạn!</h3>
            <p className="text-xs text-slate-500 mt-1">
              Đơn hàng hoa <span className="font-mono font-bold text-emerald-700">#{pointsCelebrationModal.orderId}</span> đã hoàn thành!
            </p>
            <div className="my-4 py-3 px-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/60 inline-block w-full">
              <div className="text-2xl font-black text-emerald-700 tracking-tight">
                +{pointsCelebrationModal.points} <span className="text-sm font-bold text-emerald-600">điểm thưởng</span>
              </div>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                Tương đương {new Intl.NumberFormat('vi-VN').format(pointsCelebrationModal.points * 100)}đ quy đổi sang Voucher Freeship!
              </p>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => {
                  dismissPointsCelebrationModal();
                  setCurrentView('customer');
                }}
                className="btn-primary w-full py-2.5 text-xs font-semibold rounded-xl"
              >
                Đến Ví Điểm & Đổi Voucher Ngay
              </button>
              <p className="text-[10px] text-slate-400">
                (Chạm vào bất kỳ đâu ngoài màn hình để đóng)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. FLOATING ROUNDED HEADER NAVBAR (3 DETACHED ISLANDS: LOGO, NAVIGATION, USER ACTIONS) */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between gap-2 sm:gap-3 w-full">
          {/* === ISLAND 1: BRAND LOGO (DETACHED LEFT ISLAND) === */}
          <div
            onClick={() => setCurrentView('store')}
            className="rounded-2xl md:rounded-[24px] glass-nav-luminous px-3 sm:px-4 py-2 sm:py-2.5 flex items-center shrink-0 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer select-none group"
            title="V&V Florielle - Tiệm hoa tươi nghệ thuật"
          >
            {/* Desktop Horizontal Brand Logo */}
            <div className="hidden sm:flex items-center gap-2">
              <img
                src="/logo-vvflorielle-horizontal.png"
                alt="Tiệm Hoa V&V Florielle"
                className="h-8 md:h-9 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </div>
            {/* Mobile Compact Emblem Logo */}
            <div className="flex items-center gap-2 sm:hidden">
              <img
                src="/logo-vvflorielle-square.png"
                alt="V&V Florielle"
                className="h-8 w-auto object-contain"
              />
              <div className="font-extrabold text-sm text-slate-800 tracking-tight leading-none">
                <span>V&V</span>
                <span className="text-emerald-700 font-semibold text-[10px] ml-1 px-1.5 py-0.2 rounded-full bg-emerald-50 border border-emerald-200">
                  FLORIELLE
                </span>
              </div>
            </div>
          </div>

          {/* === ISLAND 2: CENTER SEARCH & CATEGORIES (DETACHED CENTER ISLAND) === */}
          <div className="flex-1 rounded-2xl md:rounded-[24px] glass-nav-luminous px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2.5 min-w-0 transition-all duration-300 shadow-sm relative">
            {/* Search Input Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center flex-1 max-w-md relative"
            >
              <input
                type="text"
                placeholder="Tìm hoa khai trương, sinh nhật, lan hồ điệp..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="glass-input w-full pr-8 pl-3.5 text-xs py-1.5 sm:py-2 rounded-xl transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 text-slate-400 hover:text-emerald-600 p-1 rounded-lg hover:bg-emerald-50 transition-colors"
                title="Tìm kiếm"
              >
                <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </form>

            <div className="flex items-center gap-2 shrink-0">
              {/* Mega Categories Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                    isCategoryMenuOpen
                      ? 'glass-btn-emerald-pill !border-emerald-500 ring-2 ring-emerald-500/20'
                      : 'glass-btn-base'
                  }`}
                >
                  <Flower2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Danh Mục Hoa</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCategoryMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Categories Dropdown Grid (V&V Florielle Boutique Style) */}
                {isCategoryMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsCategoryMenuOpen(false)}
                    />
                    <div className="absolute top-full left-0 sm:left-auto sm:right-0 mt-2.5 w-72 sm:w-80 p-2.5 rounded-2xl bg-white/95 backdrop-blur-2xl border border-white/90 shadow-[0_20px_50px_rgba(0,0,0,0.18),inset_0_1.5px_1px_rgba(255,255,255,1)] z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
                        <span>Các Danh Mục Hoa Tươi</span>
                        <span className="text-[10px] text-emerald-700 font-semibold">{categories.length} danh mục</span>
                      </div>
                      <div className="grid grid-cols-1 gap-1 max-h-72 overflow-y-auto">
                        {categories.map((cat) => (
                          <div
                            key={cat.id}
                            onClick={() => handleSelectCategory(cat.id)}
                            className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-emerald-50/80 cursor-pointer transition-colors group"
                          >
                            {cat.imageUrl ? (
                              <img
                                src={cat.imageUrl}
                                alt={cat.name}
                                className="w-10 h-10 rounded-lg object-cover shadow-sm group-hover:scale-105 transition-transform shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                <Flower2 className="w-5 h-5" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-xs text-slate-800 group-hover:text-emerald-700 truncate">
                                {cat.name}
                              </div>
                              <div className="text-[10px] text-slate-400 truncate">{cat.description}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Promotions Button (Glowing Rose Glass Pill) */}
              {onOpenPopup && (
                <button
                  onClick={() => onOpenPopup('promotions')}
                  className="hidden lg:inline-flex px-3 py-1.5 rounded-xl text-xs font-semibold glass-btn-rose-pill"
                >
                  <Gift className="w-3.5 h-3.5 text-rose-600" />
                  <span>Khuyến mãi</span>
                </button>
              )}
            </div>
          </div>

          {/* === ISLAND 3: RIGHT USER ACTIONS & CART (DETACHED RIGHT ISLAND) === */}
          <div className="rounded-2xl md:rounded-[24px] glass-nav-luminous px-2 sm:px-3 py-1.5 sm:py-2 flex items-center gap-1.5 sm:gap-2 shrink-0 transition-all duration-300 shadow-sm relative">
              {/* Bell Hub (In-App Notification Center) */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationHubOpen(!isNotificationHubOpen)}
                  className={`relative p-2 rounded-xl text-xs font-semibold ${
                    isNotificationHubOpen
                      ? 'glass-btn-emerald-pill !border-emerald-500 ring-2 ring-emerald-500/20'
                      : 'glass-btn-base'
                  }`}
                  title="Trung tâm thông báo"
                >
                  <Bell className="w-4 h-4 text-slate-700" />
                  {unreadNotificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center shadow-md animate-pulse border border-white/80">
                      {unreadNotificationCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown Hub */}
                {isNotificationHubOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsNotificationHubOpen(false)}
                    />
                    <div className="absolute top-full right-0 mt-2.5 w-80 p-3.5 rounded-2xl bg-white/95 backdrop-blur-2xl border border-white/90 shadow-[0_20px_50px_rgba(0,0,0,0.18),inset_0_1.5px_1px_rgba(255,255,255,1)] z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <Bell className="w-4 h-4 text-emerald-700" />
                          <span className="font-bold text-xs text-slate-900">Trung Tâm Thông Báo</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full">
                            {notifications.length}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px]">
                          {notifications.length > 0 && (
                            <button
                              onClick={clearAllNotifications}
                              className="text-slate-400 hover:text-rose-600 flex items-center gap-0.5 transition-colors"
                              title="Xóa tất cả"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Xóa hết</span>
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1.5 max-h-72 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="py-6 text-center space-y-2">
                            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                              <Bell className="w-5 h-5" />
                            </div>
                            <p className="text-xs font-medium text-slate-600">Chưa có thông báo nào mới</p>
                            <p className="text-[10px] text-slate-400 leading-snug px-3">
                              Khi có đơn hoa, đối soát cọc VietQR, hoặc cộng điểm thưởng, hệ thống sẽ gửi chuông báo và giọng đọc tại đây.
                            </p>
                            <button
                              onClick={() => testCuteVoice()}
                              className="mt-1 px-3 py-1 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 text-[10px] font-bold flex items-center gap-1 mx-auto transition-colors"
                            >
                              <Volume2 className="w-3 h-3" />
                              <span>Thử giọng đọc AI nữ</span>
                            </button>
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n.id}
                              onClick={() => {
                                markNotificationAsRead(n.id);
                                if (n.orderId) {
                                  if (isAdmin) setCurrentView('admin');
                                  else setCurrentView('customer');
                                }
                              }}
                              className={`p-2.5 rounded-xl text-xs transition-colors cursor-pointer ${
                                n.isRead
                                  ? 'bg-slate-50/70 hover:bg-slate-100 text-slate-600'
                                  : 'bg-emerald-50/90 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/80 font-semibold'
                              }`}
                            >
                              <div className="flex items-center justify-between text-[11px] mb-0.5">
                                <span className="font-bold flex items-center gap-1">
                                  {!n.isRead && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />}
                                  <span>{n.title}</span>
                                </span>
                                <span className="text-[10px] text-slate-400">{n.createdAt}</span>
                              </div>
                              <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">{n.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Customer Account Button (Shown when Customer is logged in) */}
              {customer && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentView('customer')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                      currentView === 'customer'
                        ? 'glass-btn-emerald-pill ring-2 ring-emerald-500/30'
                        : 'glass-btn-emerald-pill'
                    }`}
                  >
                    <User className="w-3.5 h-3.5 text-emerald-700" />
                    <span className="hidden sm:inline max-w-[100px] truncate">{customer.fullName}</span>
                    <span className="text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded-full shadow-sm">
                      {customer.points}đ
                    </span>
                  </button>
                  <button
                    onClick={logoutCustomer}
                    title="Đăng xuất khách hàng"
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50/80 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Guest Login & Admin Access (When neither Customer nor Admin is logged in) */}
              {!customer && !isAdmin && (
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <button
                    onClick={() => {
                      setAuthModalMode('customer');
                      setIsAuthModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold glass-btn-base"
                  >
                    <User className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Đăng nhập</span>
                  </button>
                  <button
                    onClick={() => {
                      setAuthModalMode('admin');
                      setIsAuthModalOpen(true);
                    }}
                    className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-semibold glass-btn-base text-slate-700 hover:text-purple-700 hover:border-purple-300 transition-colors"
                    title="Cổng Quản Trị Viên (Admin & VVFlorielle)"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                    <span className="hidden xl:inline">Quản trị</span>
                  </button>
                </div>
              )}

              {/* Admin Portal Button (ONLY shown when Admin is logged in!) */}
              {isAdmin && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentView('admin')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                      currentView === 'admin'
                        ? 'glass-btn-purple-pill ring-2 ring-purple-500/30'
                        : 'glass-btn-purple-pill'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
                    <span>Quản Trị ({activeAdminUser === 'admin' ? 'Super' : 'Florist'})</span>
                  </button>
                  <button
                    onClick={logoutAdmin}
                    title="Thoát quyền Quản trị"
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50/80 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Cart Drawer Trigger (Supermarket Shopping Cart Orange Button with Luminous Border) */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 sm:px-2.5 sm:py-2 rounded-xl text-white bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 hover:from-orange-500 hover:to-amber-500 border border-white/90 shadow-[0_4px_16px_rgba(249,115,22,0.45),inset_0_1px_1px_rgba(255,255,255,0.8)] ring-2 ring-orange-300/40 group transition-all duration-200 active:scale-95 flex items-center gap-1.5"
                title="Giỏ hoa của bạn"
              >
                <ShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="hidden md:inline text-xs font-bold">Giỏ hoa</span>
                {totalCartCount > 0 && (
                  <span className="bg-white text-orange-600 text-[10px] font-black rounded-full px-1.5 py-0.2 shadow-sm animate-pulse border border-orange-200">
                    {totalCartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>
      </>
    );
  };
