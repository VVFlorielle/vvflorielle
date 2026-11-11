import React, { useState, useEffect } from 'react';
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
  AlertCircle,
  Volume2,
  Trash2,
  X,
  Palette,
  Truck,
  Heart,
  BookOpen,
  Scissors,
  Smartphone,
  Download
} from 'lucide-react';
import { PopupType } from './InfoPopups';
import { CategoryId } from '../types';

const formatCustomerShortName = (name: string): string => {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length <= 1) return parts[0];
  if (parts.length === 2) return `${parts[0]} ${parts[1]}`;
  return `${parts[0]}..${parts[parts.length - 1]}`;
};

interface HeaderProps {
  onOpenPopup?: (type: PopupType) => void;
  isScrolled?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenPopup, isScrolled: propIsScrolled }) => {
  const {
    currentView,
    setCurrentView,
    cart,
    orders,
    products,
    setSelectedProduct,
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
  const pendingDepositOrders = (orders || []).filter(
    (o) => !o.isDepositPaid && o.status !== 'CANCELLED'
  ).length;
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isServiceMenuOpen, setIsServiceMenuOpen] = useState(false);
  const [isNotificationHubOpen, setIsNotificationHubOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isAccountPopoverOpen, setIsAccountPopoverOpen] = useState(false);

  // Scroll Dimming / Reveal effect for mobile header clusters (matching phototiinlove, 60fps rAF throttled)
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const shouldScroll = window.scrollY > 30;
          setIsScrolled((prev) => (prev !== shouldScroll ? shouldScroll : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isScrolledActive = propIsScrolled !== undefined ? propIsScrolled : isScrolled;
  const clusterGlassClass = 'glass-nav-luminous transition-all duration-300';

  // Auto-close Mobile Search after 5s idle (resets when typing)
  useEffect(() => {
    if (!isMobileSearchOpen) return;
    const timer = setTimeout(() => {
      setIsMobileSearchOpen(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [isMobileSearchOpen, localSearch]);

  // Auto-close Notification Hub after 5s idle
  useEffect(() => {
    if (!isNotificationHubOpen) return;
    const timer = setTimeout(() => {
      setIsNotificationHubOpen(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [isNotificationHubOpen]);

  // Live product search suggestions for Storefront
  const storefrontSearchSuggestions = !localSearch.trim()
    ? []
    : (products || [])
        .filter((p) => {
          const q = localSearch.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchFlower = p.flowerTypes?.some((f) => f.toLowerCase().includes(q));
          const matchTag = p.tag?.toLowerCase().includes(q);
          return matchName || matchFlower || matchTag;
        })
        .slice(0, 5);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    setIsMobileSearchOpen(false);
    if (currentView !== 'store') {
      setCurrentView('store');
    }
    setTimeout(() => {
      const el = document.getElementById('categories-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 80);
  };

  const handleSelectCategory = (catId: CategoryId) => {
    setSelectedCategory(catId);
    setCurrentView('catalog');
    setIsCategoryMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
                      if (isAdmin) {
                        const targetAdminView = (activeAdminUser === 'vvflorielle' || activeAdminUser === 'chuquan') ? 'owner' : 'admin';
                        setCurrentView(targetAdminView);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      } else {
                        setCurrentView('customer');
                      }
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

      {/* 3. FLOATING ROUNDED HEADER NAVBAR (STREAMLINED MOBILE & LUXURY DESKTOP) */}
      <header className="w-full max-w-7xl mx-auto px-2.5 sm:px-6">
        {/* === MOBILE HEADER (MD:HIDDEN): 3 CỤM ĐẢO BÓNG KÍNH ĐỘC LẬP (CHUẨN glass-nav-luminous, LOGO CĂN CHÍNH GIỮA MÀN HÌNH) === */}
        <div className="flex md:hidden flex-col w-full gap-2 transition-all duration-300">
          <div className="relative flex items-center justify-between gap-1.5 min-[375px]:gap-2 sm:gap-4 w-full h-12 min-[375px]:h-14">
            {/* Cụm 1 (Bên trái): NÚT THÔNG BÁO & NÚT TÌM KIẾM (Cân đối bằng đúng Cụm 3 bên phải) */}
            <div className="relative flex items-center justify-start shrink-0 z-10">
              <div className={`h-10 min-[375px]:h-11 w-[76px] min-[375px]:w-[86px] px-1 min-[375px]:px-1.5 rounded-full shrink-0 flex items-center justify-between ${clusterGlassClass}`}>
                {/* Nút thông báo */}
                <button
                  type="button"
                  onClick={() => setIsNotificationHubOpen(!isNotificationHubOpen)}
                  className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                    isNotificationHubOpen ? 'bg-white/70 shadow-xs' : 'hover:bg-white/70 text-slate-700'
                  }`}
                  title="Trung tâm thông báo"
                >
                  <img src="/icons/icon-bell-3d.png" alt="Thông báo" className="w-4 h-4 object-contain shrink-0" />
                  {(unreadNotificationCount > 0 || (isAdmin && pendingDepositOrders > 0)) && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-3.5 px-0.5 rounded-full bg-rose-600 text-white text-[8px] font-bold flex items-center justify-center shadow-md animate-pulse border border-white">
                      {unreadNotificationCount + (isAdmin ? pendingDepositOrders : 0)}
                    </span>
                  )}
                </button>

                {/* Nút tìm kiếm */}
                <button
                  type="button"
                  onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                    isMobileSearchOpen
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'hover:bg-white/70 text-slate-700'
                  }`}
                  title="Tìm kiếm mẫu hoa"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>

              {/* Popup Trung Tâm Thông Báo trên Mobile (Đã kích hoạt phản hồi tức thì) */}
              {isNotificationHubOpen && (
                <>
                  <div
                    className="fixed inset-0 z-[65] bg-transparent"
                    onClick={() => setIsNotificationHubOpen(false)}
                  />
                  <div className="absolute top-full left-0 mt-2 w-[calc(100vw-24px)] max-w-sm p-3.5 rounded-2xl bg-white/95 backdrop-blur-2xl border border-white/90 shadow-[0_20px_50px_rgba(0,0,0,0.18),inset_0_1.5px_1px_rgba(255,255,255,1)] z-[70] animate-in fade-in slide-in-from-top-2 duration-200 select-none">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <Bell className="w-4 h-4 text-emerald-700" />
                        <span className="font-bold text-xs text-slate-900">Trung Tâm Thông Báo</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full">
                          {notifications.length + (isAdmin ? pendingDepositOrders : 0)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px]">
                        {notifications.length > 0 && (
                          <button
                            type="button"
                            onClick={clearAllNotifications}
                            className="text-slate-400 hover:text-rose-600 flex items-center gap-0.5 transition-colors cursor-pointer"
                            title="Xóa tất cả"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Xóa hết</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setIsNotificationHubOpen(false)}
                          className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                          title="Đóng"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5 max-h-64 overflow-y-auto">
                      {/* Đơn hàng chờ duyệt cọc */}
                      {isAdmin && pendingDepositOrders > 0 && (
                        <div
                          onClick={() => {
                            setIsNotificationHubOpen(false);
                            const targetAdminView = (activeAdminUser === 'vvflorielle' || activeAdminUser === 'chuquan') ? 'owner' : 'admin';
                            setCurrentView(targetAdminView);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="p-2.5 rounded-2xl bg-amber-50/95 border border-amber-200/90 flex items-start gap-2.5 cursor-pointer hover:bg-amber-100/90 transition-all shadow-xs"
                        >
                          <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                            <AlertCircle className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-amber-950">Đơn hàng chờ duyệt cọc</span>
                              <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-900">
                                {pendingDepositOrders} đơn
                              </span>
                            </div>
                            <p className="text-[10px] text-amber-800/90 mt-0.5 line-clamp-1">
                              Cần xác nhận thanh toán cọc 50% để florist cắm hoa.
                            </p>
                          </div>
                        </div>
                      )}

                      {notifications.length === 0 && (!isAdmin || pendingDepositOrders === 0) ? (
                        isAdmin ? (
                          <div className="py-6 text-center space-y-2">
                            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                              <Bell className="w-5 h-5" />
                            </div>
                            <p className="text-xs font-medium text-slate-600">Chưa có thông báo nghiệp vụ nào mới</p>
                            <p className="text-[10px] text-slate-400 leading-snug px-3">
                              Hệ thống sẽ gửi chuông báo khi có đơn hoa mới hoặc giao dịch thanh toán cọc VietQR.
                            </p>
                          </div>
                        ) : (
                          <div className="p-3 text-left space-y-2.5">
                            <div className="p-3 rounded-2xl bg-gradient-to-tr from-emerald-50 via-teal-50 to-emerald-100/60 border border-emerald-200/90 shadow-xs">
                              <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-950">
                                <Gift className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>Voucher Chào Mừng Khách Mới</span>
                              </div>
                              <p className="text-[11px] text-emerald-800/90 mt-1 leading-snug">
                                Nhập mã <strong className="font-black text-emerald-950 bg-emerald-200/80 px-1 py-0.2 rounded">FREESHIP30K</strong> giảm 30.000đ phí giao hoa tốc hành cho đơn đặt hôm nay!
                              </p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-slate-500 text-[10.5px] leading-snug flex items-center gap-2">
                              <Flower2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span>Tiến độ cắm hoa &amp; giao hoa sẽ được cập nhật liên tục tại đây sau khi bạn đặt hoa.</span>
                            </div>
                          </div>
                        )
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => {
                              markNotificationAsRead(n.id);
                              if (n.orderId) {
                                if (isAdmin) {
                                  const targetAdminView = (activeAdminUser === 'vvflorielle' || activeAdminUser === 'chuquan') ? 'owner' : 'admin';
                                  setCurrentView(targetAdminView);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                } else {
                                  setCurrentView('customer');
                                }
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

            {/* Cụm 2 (Chính giữa): LOGO CĂN CHÍNH GIỮA TUYỆT ĐỐI MÀN HÌNH (z-20) - TO RÕ 170PX, ĐỔ BÓNG NỔI KHỐI */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto">
              <div
                onClick={() => {
                  setCurrentView('store');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="h-10 min-[375px]:h-11 w-auto max-w-[170px] flex items-center justify-center cursor-pointer select-none transition-transform hover:scale-105 active:scale-95 p-1"
                title="V&V Florielle - Tiệm hoa tươi nghệ thuật"
              >
                <img
                  src="/logo-vvflorielle-horizontal.webp"
                  alt="V&V Florielle"
                  className="h-10 min-[375px]:h-11 w-auto max-w-[170px] object-contain filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.12)] transition-transform duration-300"
                />
              </div>
            </div>

            {/* Cụm 3 (Bên phải): Cụm tài khoản & Admin (Kích thước bằng đúng Cụm 1 bên trái để cân đối tuyệt đối) */}
            <div className="flex items-center justify-end shrink-0 z-10">
              {customer && (
                <div className={`h-10 min-[375px]:h-11 w-[76px] min-[375px]:w-[86px] px-1 min-[375px]:px-1.5 rounded-full shrink-0 flex items-center justify-between ${clusterGlassClass}`}>
                  <button
                    type="button"
                    onClick={() => setCurrentView('customer')}
                    className="w-8 h-8 rounded-full hover:bg-white/70 active:scale-95 flex items-center justify-center transition-all shrink-0 cursor-pointer"
                    title={`Khách hàng: ${customer.fullName}`}
                  >
                    <img src="/icons/icon-user-3d.png" alt="Khách hàng" className="w-4 h-4 object-contain shrink-0" />
                  </button>
                  <button
                    type="button"
                    onClick={logoutCustomer}
                    title="Đăng xuất"
                    className="w-8 h-8 rounded-full text-slate-500 hover:text-rose-600 hover:bg-rose-50/80 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}

              {isAdmin && (
                <div className="relative shrink-0">
                  <div className={`h-10 min-[375px]:h-11 w-[76px] min-[375px]:w-[86px] px-1 min-[375px]:px-1.5 rounded-full shrink-0 flex items-center justify-between ${clusterGlassClass}`}>
                    <button
                      type="button"
                      onClick={() => setIsAccountPopoverOpen(!isAccountPopoverOpen)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                        isAccountPopoverOpen ? 'bg-white/70 shadow-xs' : 'hover:bg-white/70'
                      }`}
                      title="Thông tin quản trị viên & bảo mật"
                    >
                      <img src="/icons/icon-shield-3d.png" alt="Bảo mật" className="w-4 h-4 object-contain shrink-0 drop-shadow-xs" />
                    </button>
                    <button
                      type="button"
                      onClick={logoutAdmin}
                      title="Đăng xuất quản trị"
                      className="w-8 h-8 rounded-full text-slate-500 hover:text-rose-600 hover:bg-rose-50/80 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Popover on Mobile */}
                  {isAccountPopoverOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsAccountPopoverOpen(false)}
                      />
                      <div className="absolute top-full right-0 mt-2 w-60 p-3 rounded-2xl bg-white/95 backdrop-blur-2xl border border-white/90 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 select-none">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                          <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-200/80 flex items-center justify-center shrink-0">
                            <img src="/icons/icon-shield-3d.png" alt="Bảo mật" className="w-4 h-4 object-contain" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-xs text-slate-900 truncate">
                              {activeAdminUser === 'vvflorielle' || activeAdminUser === 'chuquan' ? 'Chủ Tiệm' : 'Super Admin'}
                            </div>
                            <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              <span>Phiên an toàn</span>
                            </p>
                          </div>
                        </div>
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setIsAccountPopoverOpen(false);
                              const targetAdminView = (activeAdminUser === 'vvflorielle' || activeAdminUser === 'chuquan') ? 'owner' : 'admin';
                              setCurrentView(targetAdminView);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="w-full py-1.5 px-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                          >
                            <img src="/icons/icon-grid-3d.png" alt="Quản trị" className="w-3.5 h-3.5 object-contain brightness-200" />
                            <span>Vào Bảng Quản Trị</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {!customer && !isAdmin && (
                <button
                  onClick={() => {
                    setAuthModalMode('customer');
                    setIsAuthModalOpen(true);
                  }}
                  className={`h-10 min-[375px]:h-11 px-2.5 min-[375px]:px-3.5 rounded-full shrink-0 flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:text-emerald-950 active:scale-95 transition-all cursor-pointer ${clusterGlassClass}`}
                  title="Đăng nhập tài khoản"
                >
                  <img src="/icons/icon-user-3d.png" alt="Đăng nhập" className="w-3.5 h-3.5 object-contain shrink-0" />
                  <span className="hidden min-[360px]:inline">Đăng nhập</span>
                </button>
              )}
            </div>
          </div>

          {/* Ô tìm kiếm dạng nổi (Floating Overlay) trên Mobile khi bấm nút kính lúp - Tuyệt đối không đẩy Marquee Banner */}
          {isMobileSearchOpen && (
            <>
              <div
                className="fixed inset-0 z-[65] bg-transparent"
                onClick={() => setIsMobileSearchOpen(false)}
              />
              <div className="absolute top-full left-2 right-2 mt-2 z-[70] animate-in fade-in slide-in-from-top-2 duration-200 pointer-events-auto">
                <form
                  onSubmit={(e) => {
                    handleSearchSubmit(e);
                  }}
                  className="flex items-center relative w-full p-1.5 rounded-2xl bg-white/95 backdrop-blur-2xl border border-white/95 shadow-[0_16px_36px_rgba(0,0,0,0.18),inset_0_1.5px_1px_rgba(255,255,255,1)]"
                >
                  <div className="relative flex-1 flex items-center">
                    <input
                      type="text"
                      autoFocus
                      placeholder="Tìm hoa khai trương, sinh nhật, lan hồ điệp..."
                      value={localSearch}
                      onChange={(e) => setLocalSearch(e.target.value)}
                      className="w-full pr-16 pl-3 text-xs py-2 rounded-xl bg-slate-50/90 border border-emerald-300/80 shadow-inner focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-slate-900 placeholder:text-slate-400"
                    />
                    {localSearch && (
                      <button
                        type="button"
                        onClick={() => {
                          setLocalSearch('');
                          setSearchQuery('');
                        }}
                        className="absolute right-9 p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                        title="Xóa tìm kiếm"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="submit"
                      className="absolute right-1.5 p-1.5 text-emerald-700 hover:bg-emerald-100/70 rounded-lg cursor-pointer transition-colors"
                      title="Tìm kiếm"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMobileSearchOpen(false)}
                    className="ml-1.5 px-2.5 py-1.5 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                  >
                    Đóng
                  </button>
                </form>

                {/* Danh sách gợi ý mẫu hoa trực quan khi gõ từ khóa (Bấm vào mở xem chi tiết ngay) */}
                {localSearch.trim() && (
                  <div className="mt-2 p-2 rounded-2xl bg-white/95 backdrop-blur-2xl border border-white/95 shadow-[0_16px_36px_rgba(0,0,0,0.18)] max-h-72 overflow-y-auto space-y-1">
                    <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                      <span>Mẫu hoa phù hợp</span>
                      <span className="text-emerald-700 font-semibold">{storefrontSearchSuggestions.length} mẫu</span>
                    </div>
                    {storefrontSearchSuggestions.length === 0 ? (
                      <div className="p-3 text-center text-xs text-slate-500">
                        Không tìm thấy mẫu hoa nào khớp với "{localSearch}". Bạn thử gõ "hồng", "lan", "sinh nhật"...
                      </div>
                    ) : (
                      storefrontSearchSuggestions.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsMobileSearchOpen(false);
                          }}
                          className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-emerald-50/80 cursor-pointer active:scale-98 transition-all"
                        >
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover shadow-xs shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-slate-900 truncate">{product.name}</div>
                            <div className="text-[11px] font-extrabold text-emerald-700">
                              {product.price.toLocaleString('vi-VN')}₫
                            </div>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold shrink-0">
                            Xem ngay
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* === DESKTOP HEADER (HIDDEN MD:FLEX): 3 ĐẢO BÓNG KÍNH ĐỘC LẬP (LOGO TO RÕ, ĐẦY ĐỦ CÁC MENU TRANG WEB, THAO TÁC NGƯỜI DÙNG) === */}
        <div className="hidden md:flex items-center justify-between gap-3 w-full">
          {/* === BRAND LOGO (FRAMELESS & PROMINENTLY ENLARGED) === */}
          <div
            onClick={() => {
              setCurrentView('store');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center shrink-0 cursor-pointer select-none group py-0.5 px-1 transition-transform hover:scale-[1.03] active:scale-95"
            title="V&V Florielle - Tiệm hoa tươi nghệ thuật"
          >
            <img
              src="/logo-vvflorielle-horizontal.webp"
              alt="Tiệm Hoa V&V Florielle"
              className="h-16 lg:h-20 xl:h-22 w-auto object-contain filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.15)] transition-transform duration-300"
            />
          </div>

          {/* === ISLAND 2: ĐẦY ĐỦ CÁC MENU CHỨC NĂNG (TRANG CHỦ, MẪU HOA, DỊCH VỤ, GIỚI THIỆU, TIN TỨC, LIÊN HỆ & TÌM KIẾM) === */}
          <div className={`flex-1 rounded-2xl md:rounded-[24px] px-2 sm:px-3 lg:px-3.5 py-1.5 sm:py-2 flex items-center justify-between gap-1 lg:gap-1.5 min-w-0 transition-all duration-300 relative ${
            isScrolledActive
              ? 'bg-white/12 backdrop-blur-md border border-white/40 shadow-none'
              : 'glass-nav-luminous shadow-sm'
          }`}>
            {/* 1. Trang Chủ */}
            <button
              onClick={() => {
                setCurrentView('store');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-2 lg:px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                currentView === 'store'
                  ? 'text-emerald-900 bg-white/70 font-bold border border-white/85 shadow-[0_2px_8px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,0.9)]'
                  : 'text-slate-700 hover:text-emerald-700 hover:bg-white/40'
              }`}
              title="Về trang chủ tiệm hoa"
            >
              <img src="/icons/icon-home-3d.png" alt="Trang chủ" className="w-4 h-4 object-contain shrink-0 drop-shadow-xs" />
              <span>Trang Chủ</span>
            </button>

            {/* 2. Mẫu Hoa Button & Dropdown */}
            <div className="relative shrink-0">
              <div
                className={`inline-flex items-center rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  currentView === 'catalog'
                    ? 'text-emerald-900 bg-white/70 font-bold border border-white/85 shadow-[0_2px_8px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,0.9)]'
                    : isCategoryMenuOpen
                    ? 'text-emerald-900 bg-white/70 font-bold border border-white/85 shadow-[0_2px_8px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,0.9)]'
                    : 'text-slate-700 hover:text-emerald-700 hover:bg-white/40'
                }`}
              >
                {/* Bấm vào chữ "Mẫu Hoa" mở trang Mẫu Hoa mặc định Tất Cả */}
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setCurrentView('catalog');
                    setIsCategoryMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-2 lg:px-2.5 py-1 flex items-center gap-1 cursor-pointer whitespace-nowrap"
                  title="Xem tất cả mẫu hoa nghệ thuật"
                >
                  <img src="/icons/icon-catalog-3d.png" alt="Mẫu hoa" className="w-4 h-4 object-contain shrink-0 drop-shadow-xs" />
                  <span>Mẫu Hoa</span>
                </button>
                {/* Bấm mũi tên mở menu chọn các dòng hoa khác */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCategoryMenuOpen(!isCategoryMenuOpen);
                    setIsServiceMenuOpen(false);
                  }}
                  className="pr-1.5 pl-0.5 py-1 text-slate-500 hover:text-emerald-700 cursor-pointer"
                  title="Danh mục các dòng hoa"
                >
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCategoryMenuOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {isCategoryMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsCategoryMenuOpen(false)} />
                  <div className="absolute top-full left-0 mt-2.5 w-72 p-2.5 rounded-2xl bg-white/95 backdrop-blur-2xl border border-white/90 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
                      <span>Các Dòng Hoa Tươi</span>
                      <span className="text-[10px] text-emerald-700 font-semibold">{categories.filter((c) => c.id !== 'all').length} danh mục</span>
                    </div>

                    <div className="grid grid-cols-1 gap-1 max-h-72 overflow-y-auto mt-1">
                      {categories
                        .filter((cat) => cat.id !== 'all')
                        .map((cat) => (
                          <div
                            key={cat.id}
                            onClick={() => {
                              handleSelectCategory(cat.id);
                              setIsCategoryMenuOpen(false);
                            }}
                            className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-emerald-50/80 cursor-pointer transition-colors group"
                          >
                            {cat.imageUrl ? (
                              <img src={cat.imageUrl} alt={cat.name} className="w-9 h-9 rounded-lg object-cover shadow-xs group-hover:scale-105 transition-transform shrink-0" />
                            ) : (
                              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                <img src="/icons/icon-catalog-3d.png" alt={cat.name} className="w-5 h-5 object-contain" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-xs text-slate-800 group-hover:text-emerald-700 truncate">{cat.name}</div>
                              <div className="text-[10px] text-slate-400 truncate">{cat.description}</div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* 3. Dịch Vụ Dropdown */}
            <div className="relative shrink-0">
              <button
                onClick={() => {
                  setIsServiceMenuOpen(!isServiceMenuOpen);
                  setIsCategoryMenuOpen(false);
                }}
                className={`px-2 lg:px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap ${
                  isServiceMenuOpen ? 'text-emerald-900 bg-white/70 font-bold border border-white/85 shadow-[0_2px_8px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,0.9)]' : 'text-slate-700 hover:text-emerald-700 hover:bg-white/40'
                }`}
              >
                <img src="/icons/icon-services-3d.png" alt="Dịch vụ" className="w-4 h-4 object-contain shrink-0 drop-shadow-xs" />
                <span>Dịch Vụ</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isServiceMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isServiceMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsServiceMenuOpen(false)} />
                  <div className="absolute top-full left-0 mt-2.5 w-72 p-2.5 rounded-2xl bg-white/95 backdrop-blur-2xl border border-white/90 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 space-y-1">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                      Dịch Vụ Hoa Chuyên Nghiệp
                    </div>
                    <div
                      onClick={() => {
                        setIsServiceMenuOpen(false);
                        setSelectedCategory('all');
                        setCurrentView('catalog');
                      }}
                      className="p-2 rounded-xl hover:bg-emerald-50/80 cursor-pointer flex items-center gap-2.5"
                    >
                      <img src="/icons/icon-catalog-3d.png" alt="Hoa mẫu sẵn" className="w-5 h-5 object-contain shrink-0" />
                      <div>
                        <div className="font-bold text-xs text-slate-800">Hoa Tươi Mẫu Sẵn</div>
                        <div className="text-[10px] text-slate-400">Các mẫu hoa thiết kế sẵn mới mỗi ngày</div>
                      </div>
                    </div>
                    <div
                      onClick={() => {
                        setIsServiceMenuOpen(false);
                        if (onOpenPopup) onOpenPopup('custom-design');
                      }}
                      className="p-2 rounded-xl hover:bg-emerald-50/80 cursor-pointer flex items-center gap-2.5"
                    >
                      <img src="/icons/icon-services-3d.png" alt="Thiết kế riêng" className="w-5 h-5 object-contain shrink-0" />
                      <div>
                        <div className="font-bold text-xs text-slate-800">Hoa Thiết Kế Theo Yêu Cầu</div>
                        <div className="text-[10px] text-slate-400">Tự phối hoa &amp; tư vấn tone màu riêng</div>
                      </div>
                    </div>
                    <div
                      onClick={() => {
                        setIsServiceMenuOpen(false);
                        if (onOpenPopup) onOpenPopup('shipping');
                      }}
                      className="p-2 rounded-xl hover:bg-emerald-50/80 cursor-pointer flex items-center gap-2.5"
                    >
                      <img src="/icons/icon-orders-3d.png" alt="Giao hỏa tốc" className="w-5 h-5 object-contain shrink-0" />
                      <div>
                        <div className="font-bold text-xs text-slate-800">Giao Hoa Hỏa Tốc (Từ 15P)</div>
                        <div className="text-[10px] text-slate-400">Từ 15P nội thành &amp; 60P ngoại thành Hà Nội</div>
                      </div>
                    </div>
                    <div
                      onClick={() => {
                        setIsServiceMenuOpen(false);
                        if (onOpenPopup) onOpenPopup('wedding-event');
                      }}
                      className="p-2 rounded-xl hover:bg-emerald-50/80 cursor-pointer flex items-center gap-2.5"
                    >
                      <img src="/icons/icon-pricing-3d.png" alt="Hoa cưới sự kiện" className="w-5 h-5 object-contain shrink-0" />
                      <div>
                        <div className="font-bold text-xs text-slate-800">Hoa Cưới &amp; Sự Kiện</div>
                        <div className="text-[10px] text-slate-400">Hoa cưới cầm tay, trang trí hội nghị &amp; xuất VAT</div>
                      </div>
                    </div>
                    <div
                      onClick={() => {
                        setIsServiceMenuOpen(false);
                        if (onOpenPopup) onOpenPopup('app-download');
                      }}
                      className="p-2 rounded-xl hover:bg-emerald-50/80 cursor-pointer flex items-center gap-2.5 border-t border-slate-100 bg-emerald-50/40"
                    >
                      <img src="/icons/icon-settings-3d.png" alt="Tải App APK" className="w-5 h-5 object-contain shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-emerald-950">Cài Đặt &amp; Tải App APK</span>
                          <span className="text-[9px] bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded-full">0.85MB</span>
                        </div>
                        <div className="text-[10px] text-slate-500">Tải file cài đặt Android hoặc quét QR</div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* 4. Giới Thiệu (Mở Trang Riêng) */}
            <button
              onClick={() => {
                setCurrentView('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-2 lg:px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                currentView === 'about'
                  ? 'text-emerald-900 bg-white/70 font-bold border border-white/85 shadow-[0_2px_8px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,0.9)]'
                  : 'text-slate-700 hover:text-emerald-700 hover:bg-white/40'
              }`}
              title="Về thương hiệu tiệm hoa V&V Florielle"
            >
              <img src="/icons/icon-store-3d.png" alt="Giới thiệu" className="w-4 h-4 object-contain shrink-0 drop-shadow-xs" />
              <span>Giới Thiệu</span>
            </button>

            {/* 5. Cẩm Nang / Tin Tức (Mở Popup Thư Viện Kiến Thức) */}
            <button
              onClick={() => {
                if (onOpenPopup) onOpenPopup('care');
              }}
              className="px-2 lg:px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 text-slate-700 hover:text-emerald-700 hover:bg-white/40 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              title="Cẩm nang chăm sóc và ý nghĩa loài hoa"
            >
              <img src="/icons/icon-care-3d.png" alt="Cẩm nang" className="w-4 h-4 object-contain shrink-0 drop-shadow-xs" />
              <span>Cẩm Nang</span>
            </button>

            {/* 6. Liên Hệ (Mở Trang Riêng) */}
            <button
              onClick={() => {
                setCurrentView('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-2 lg:px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                currentView === 'contact'
                  ? 'text-emerald-900 bg-white/70 font-bold border border-white/85 shadow-[0_2px_8px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,0.9)]'
                  : 'text-slate-700 hover:text-emerald-700 hover:bg-white/40'
              }`}
              title="Thông tin liên hệ & bản đồ showroom"
            >
              <img src="/icons/icon-contact-3d.png" alt="Liên hệ" className="w-4 h-4 object-contain shrink-0 drop-shadow-xs" />
              <span>Liên Hệ</span>
            </button>

            {/* 7. Ô Tìm Kiếm Gọn Gàng (Co giãn thông minh, không tràn ra khỏi khung) */}
            <form onSubmit={handleSearchSubmit} className="flex items-center relative flex-1 min-w-[95px] max-w-[155px] lg:max-w-[175px] shrink">
              <input
                type="text"
                placeholder="Tìm hoa tươi..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="glass-input w-full pr-9 pl-2.5 text-xs py-1 rounded-xl transition-all"
              />
              {localSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setLocalSearch('');
                    setSearchQuery('');
                  }}
                  className="absolute right-5 text-slate-400 hover:text-slate-600 p-0.5 rounded-md"
                  title="Xóa tìm kiếm"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-1 text-slate-400 hover:text-emerald-600 p-0.5 rounded-lg transition-colors"
                title="Tìm kiếm"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>


          {/* === ISLAND 3: RIGHT USER ACTIONS (LOGIN / PROFILE & NOTIFICATIONS) === */}
          <div className={`rounded-2xl md:rounded-[24px] px-2 sm:px-3 py-1.5 sm:py-2 flex items-center gap-1.5 sm:gap-2 shrink-0 transition-all duration-300 relative ${
            isScrolledActive
              ? 'bg-white/12 backdrop-blur-md border border-white/40 shadow-none'
              : 'glass-nav-luminous shadow-sm'
          }`}>
              {/* Bell Hub (In-App Notification Center) */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationHubOpen(!isNotificationHubOpen)}
                  className={`relative w-8 h-8 rounded-xl flex items-center justify-center text-xs font-semibold cursor-pointer ${
                    isNotificationHubOpen
                      ? 'bg-white/70 border border-white/85 shadow-[0_2px_8px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,0.9)]'
                      : 'glass-btn-base'
                  }`}
                  title="Trung tâm thông báo"
                >
                  <img src="/icons/icon-bell-3d.png" alt="Thông báo" className="w-[18px] h-[18px] object-contain shrink-0 drop-shadow-xs" />
                  {(unreadNotificationCount > 0 || (isAdmin && pendingDepositOrders > 0)) && (
                    <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center shadow-md animate-pulse border border-white/80">
                      {unreadNotificationCount + (isAdmin ? pendingDepositOrders : 0)}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown Hub */}
                {isNotificationHubOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-[65] bg-transparent"
                      onClick={() => setIsNotificationHubOpen(false)}
                    />
                    <div className="absolute top-full right-0 mt-2.5 w-80 p-3.5 rounded-2xl bg-white/95 backdrop-blur-2xl border border-white/90 shadow-[0_20px_50px_rgba(0,0,0,0.18),inset_0_1.5px_1px_rgba(255,255,255,1)] z-[70] animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <Bell className="w-4 h-4 text-emerald-700" />
                          <span className="font-bold text-xs text-slate-900">Trung Tâm Thông Báo</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full">
                            {notifications.length + (isAdmin ? pendingDepositOrders : 0)}
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
                        {/* Đồng bộ đơn cọc chờ duyệt như thanh dock */}
                        {isAdmin && pendingDepositOrders > 0 && (
                          <div
                            onClick={() => {
                              setIsNotificationHubOpen(false);
                              const targetAdminView = (activeAdminUser === 'vvflorielle' || activeAdminUser === 'chuquan') ? 'owner' : 'admin';
                              setCurrentView(targetAdminView);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="p-2.5 rounded-2xl bg-amber-50/95 border border-amber-200/90 flex items-start gap-2.5 cursor-pointer hover:bg-amber-100/90 transition-all shadow-xs"
                          >
                            <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                              <AlertCircle className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-amber-950">Đơn hàng chờ duyệt cọc</span>
                                <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-900">
                                  {pendingDepositOrders} đơn
                                </span>
                              </div>
                              <p className="text-[10px] text-amber-800/90 mt-0.5 line-clamp-1">
                                Cần xác nhận thanh toán cọc 50% để florist cắm hoa.
                              </p>
                            </div>
                          </div>
                        )}

                        {notifications.length === 0 && (!isAdmin || pendingDepositOrders === 0) ? (
                          isAdmin ? (
                            <div className="py-6 text-center space-y-2">
                              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                                <Bell className="w-5 h-5" />
                              </div>
                              <p className="text-xs font-medium text-slate-600">Chưa có thông báo nghiệp vụ nào mới</p>
                              <p className="text-[10px] text-slate-400 leading-snug px-3">
                                Hệ thống sẽ gửi chuông báo khi có đơn hoa mới hoặc giao dịch thanh toán cọc VietQR.
                              </p>
                            </div>
                          ) : (
                            <div className="p-3 text-left space-y-2.5">
                              <div className="p-3 rounded-2xl bg-gradient-to-tr from-emerald-50 via-teal-50 to-emerald-100/60 border border-emerald-200/90 shadow-xs">
                                <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-950">
                                  <Gift className="w-4 h-4 text-emerald-600 shrink-0" />
                                  <span>Voucher Chào Mừng Khách Mới</span>
                                </div>
                                <p className="text-[11px] text-emerald-800/90 mt-1 leading-snug">
                                  Nhập mã <strong className="font-black text-emerald-950 bg-emerald-200/80 px-1 py-0.2 rounded">FREESHIP30K</strong> giảm 30.000đ phí giao hoa tốc hành cho đơn đặt hôm nay!
                                </p>
                              </div>
                              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-slate-500 text-[10.5px] leading-snug flex items-center gap-2">
                                <Flower2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>Tiến độ cắm hoa &amp; giao hoa sẽ được cập nhật liên tục tại đây sau khi bạn đặt hoa.</span>
                              </div>
                            </div>
                          )
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n.id}
                              onClick={() => {
                                markNotificationAsRead(n.id);
                                if (n.orderId) {
                                  if (isAdmin) {
                                    const targetAdminView = (activeAdminUser === 'vvflorielle' || activeAdminUser === 'chuquan') ? 'owner' : 'admin';
                                    setCurrentView(targetAdminView);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  } else {
                                    setCurrentView('customer');
                                  }
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
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setCurrentView('customer')}
                    className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 ${
                      currentView === 'customer'
                        ? 'glass-btn-emerald-pill ring-2 ring-emerald-500/30'
                        : 'glass-btn-emerald-pill'
                    }`}
                  >
                    <img src="/icons/icon-user-3d.png" alt="Khách hàng" className="w-3.5 h-3.5 object-contain shrink-0" />
                    <span className="font-bold">{formatCustomerShortName(customer.fullName)}</span>
                    <span className="text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded-full shadow-sm">
                      {customer.points}đ
                    </span>
                  </button>
                  <button
                    onClick={logoutCustomer}
                    title="Đăng xuất khách hàng"
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50/80 transition-colors shrink-0 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Guest Login (When neither Customer nor Admin is logged in - Admin login is kept discreet like phototiinlove) */}
              {!customer && !isAdmin && (
                <button
                  onClick={() => {
                    setAuthModalMode('customer');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold glass-btn-base flex items-center gap-1.5 text-emerald-800 hover:border-emerald-300 shrink-0 cursor-pointer"
                  title="Đăng nhập tài khoản"
                >
                  <img src="/icons/icon-user-3d.png" alt="Đăng nhập" className="w-3.5 h-3.5 object-contain shrink-0" />
                  <span>Đăng nhập</span>
                </button>
              )}

              {/* Admin / Owner Account Block (Discreet 3D Shield Icon + Logout, opens Popover Profile on click) */}
              {isAdmin && (
                <div className="relative shrink-0">
                  <div className="inline-flex items-center gap-1 px-1.5 py-1 rounded-xl glass-btn-purple-pill">
                    <button
                      type="button"
                      onClick={() => setIsAccountPopoverOpen(!isAccountPopoverOpen)}
                      className="p-1 rounded-lg hover:bg-white/80 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                      title="Thông tin quản trị viên & bảo mật"
                    >
                      <img src="/icons/icon-shield-3d.png" alt="Bảo mật" className="w-4 h-4 object-contain drop-shadow-xs" />
                    </button>
                    <span className="w-px h-3.5 bg-purple-300/70 shrink-0" />
                    <button
                      type="button"
                      onClick={logoutAdmin}
                      title="Thoát quyền Quản trị"
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50/80 transition-colors cursor-pointer shrink-0"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Profile Popover under Shield Icon */}
                  {isAccountPopoverOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsAccountPopoverOpen(false)}
                      />
                      <div className="absolute top-full right-0 mt-2.5 w-64 p-3.5 rounded-2xl bg-white/95 backdrop-blur-2xl border border-white/90 shadow-[0_20px_50px_rgba(0,0,0,0.18),inset_0_1.5px_1px_rgba(255,255,255,1)] z-50 animate-in fade-in slide-in-from-top-2 duration-200 select-none">
                        <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
                          <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200/80 flex items-center justify-center shrink-0 shadow-xs">
                            <img src="/icons/icon-shield-3d.png" alt="Bảo mật" className="w-5 h-5 object-contain" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-xs text-slate-900 truncate">
                                {activeAdminUser === 'vvflorielle' || activeAdminUser === 'chuquan' ? 'Chủ Tiệm' : 'Super Admin'}
                              </span>
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                            </div>
                            <p className="text-[10px] text-slate-400 truncate">@{activeAdminUser || 'admin'}</p>
                          </div>
                        </div>

                        <div className="py-2.5 space-y-1.5 text-[11px] text-slate-600">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Trạng thái:</span>
                            <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 text-[10px]">
                              Đang hoạt động
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Quyền hạn:</span>
                            <span className="font-medium text-slate-700 text-[10.5px]">Toàn quyền hệ thống</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100 space-y-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setIsAccountPopoverOpen(false);
                              const targetAdminView = (activeAdminUser === 'vvflorielle' || activeAdminUser === 'chuquan') ? 'owner' : 'admin';
                              setCurrentView(targetAdminView);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-sm shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
                          >
                            <img src="/icons/icon-grid-3d.png" alt="Quản trị" className="w-3.5 h-3.5 object-contain brightness-200" />
                            <span>Vào Bảng Quản Trị</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>
      </>
    );
  };
