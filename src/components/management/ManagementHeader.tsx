import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  ShieldCheck,
  LogOut,
  Search,
  Bell,
  Trash2,
  AlertCircle,
  X,
  ChevronRight,
  Sparkles,
  KeyRound,
  Percent,
  Users,
  Coins,
  Palette,
  PackageCheck
} from 'lucide-react';

interface ManagementHeaderProps {
  role: 'admin' | 'owner';
  onNavigateTab?: (tab: string) => void;
}

interface AdminShortcut {
  id: string;
  label: string;
  tab: string;
  icon: any;
  keywords: string[];
}

const SYSTEM_SHORTCUTS: AdminShortcut[] = [
  {
    id: 'security',
    label: 'Cấu hình Bảo Mật, Mã PIN Cấp 2 & STK VietQR',
    tab: 'security',
    icon: KeyRound,
    keywords: ['pin', 'mật khẩu', 'stk', 'ngân hàng', 'bảo mật', 'tài khoản', 'bao mat', 'mat khau', 'ngan hang']
  },
  {
    id: 'promotions',
    label: 'Chiến Dịch Giảm Giá Đồng Loạt & Voucher 8/3',
    tab: 'promotions',
    icon: Percent,
    keywords: ['giảm giá', '8/3', 'khuyến mãi', 'sự kiện', 'voucher', 'freeship', 'giam gia', 'khuyen mai', 'su kien']
  },
  {
    id: 'customers',
    label: 'Quản Lý Thành Viên VIP & Lịch Sử Tích Điểm',
    tab: 'customers',
    icon: Users,
    keywords: ['thành viên', 'khách', 'vip', 'điểm', 'tích điểm', 'thanh vien', 'khach', 'tich diem']
  },
  {
    id: 'pricing',
    label: 'Quản Lý Bảng Giá Hoa & Điều Chỉnh Chiết Khấu',
    tab: 'pricing',
    icon: Coins,
    keywords: ['giá', 'bảng giá', 'chiết khấu', 'tăng giá', 'gia', 'bang gia', 'chiet khau']
  },
  {
    id: 'revenue',
    label: 'Báo Cáo Doanh Thu & Thống Kê Đơn Hoàn Tất',
    tab: 'revenue',
    icon: Sparkles,
    keywords: ['doanh thu', 'báo cáo', 'tiền', 'lợi nhuận', 'thống kê', 'doanh so', 'bao cao']
  },
  {
    id: 'cms',
    label: 'Quản Lý Giao Diện, Banner & Thông Báo Chạy Chữ',
    tab: 'cms',
    icon: Palette,
    keywords: ['giao diện', 'banner', 'chạy chữ', 'marquee', 'tin mới', 'giao dien', 'chay chu', 'cms']
  },
  {
    id: 'orders',
    label: 'Quản Lý Đơn Hàng & Tiến Độ Cắm Hoa',
    tab: 'orders',
    icon: PackageCheck,
    keywords: ['đơn hàng', 'đơn cọc', 'florist', 'shipper', 'don hang', 'don coc', 'cọc']
  }
];

export const ManagementHeader: React.FC<ManagementHeaderProps> = ({ role, onNavigateTab }) => {
  const {
    setCurrentView,
    logoutAdmin,
    orders,
    products,
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    clearAllNotifications,
    activeAdminUser
  } = useStore();

  const isOwner = role === 'owner';
  const pendingDepositOrders = orders.filter(
    (o) => !o.isDepositPaid && o.status !== 'CANCELLED'
  ).length;

  const [isAccountPopoverOpen, setIsAccountPopoverOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Auto-close Notification popover after 5s idle
  useEffect(() => {
    if (!isNotificationOpen) return;
    const timer = setTimeout(() => {
      setIsNotificationOpen(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [isNotificationOpen]);

  // Auto-close Search Command Palette after 5s idle (resets when typing)
  useEffect(() => {
    if (!isSearchOpen) return;
    const timer = setTimeout(() => {
      setIsSearchOpen(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [isSearchOpen, searchQuery]);

  const handleReturnToStore = () => {
    setCurrentView('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    logoutAdmin();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter Command Palette suggestions based on user input
  const cleanQ = searchQuery.trim().toLowerCase();
  const matchingOrders = cleanQ
    ? orders.filter(
        (o) =>
          o.id.toLowerCase().includes(cleanQ) ||
          (o.senderName && o.senderName.toLowerCase().includes(cleanQ)) ||
          (o.recipientName && o.recipientName.toLowerCase().includes(cleanQ)) ||
          (o.senderPhone && o.senderPhone.includes(cleanQ)) ||
          (o.recipientPhone && o.recipientPhone.includes(cleanQ))
      ).slice(0, 4)
    : [];

  const matchingProducts = cleanQ
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(cleanQ) ||
          (p.categoryId && p.categoryId.toLowerCase().includes(cleanQ))
      ).slice(0, 4)
    : [];

  const matchingShortcuts = cleanQ
    ? SYSTEM_SHORTCUTS.filter(
        (s) =>
          s.keywords.some((k) => cleanQ.includes(k) || k.includes(cleanQ)) ||
          s.label.toLowerCase().includes(cleanQ)
      ).slice(0, 3)
    : [];

  const handleSelectShortcut = (tab: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    onNavigateTab?.(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="w-full px-2 sm:px-6 select-none bg-transparent transition-all duration-200 ease-out opacity-100 scale-100">
      {/* 
        3 viên capsule độc lập nổi trên nền hoàn toàn trong suốt:
        - Bên trái: Khối [Chuông Thông Báo] + [Kính Lúp Tìm Kiếm Nhanh]
        - Ở giữa: Logo V&V Florielle to rõ 170px, không khung viền
        - Bên phải: Khối [Khiên Bảo Mật] + [Chủ Tiệm] + [Đăng Xuất]
      */}
      <div className="max-w-7xl mx-auto relative flex items-center justify-between w-full h-12 min-[375px]:h-14 sm:h-16 bg-transparent">
        {/* === LEFT: KHỐI CHUÔNG + KÍNH LÚP TÌM KIẾM QUẢN TRỊ NHANH (Z-30) === */}
        <div className="relative flex items-center justify-start shrink-0 z-30 pointer-events-auto">
          {/* On Mobile: Đồng bộ khối bóng kính tròn 2 nút đối xứng y hệt ngoài web */}
          <div className="sm:hidden">
            <div className="h-10 min-[375px]:h-11 w-[76px] min-[375px]:w-[86px] px-1 min-[375px]:px-1.5 rounded-full shrink-0 flex items-center justify-between glass-nav-luminous">
              {/* Nút Chuông Thông Báo */}
              <button
                type="button"
                onClick={() => {
                  setIsNotificationOpen(!isNotificationOpen);
                  setIsSearchOpen(false);
                }}
                className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                  isNotificationOpen ? 'bg-white/70 shadow-xs' : 'hover:bg-white/70'
                }`}
                title="Trung tâm thông báo quản trị"
              >
                <img src="/icons/icon-bell-3d.png" alt="Thông báo" className="w-4 h-4 object-contain shrink-0" />
                {(pendingDepositOrders > 0 || unreadNotificationCount > 0) && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-3.5 px-0.5 rounded-full bg-rose-600 text-white text-[8px] font-bold flex items-center justify-center shadow-md animate-pulse border border-white">
                    {pendingDepositOrders + unreadNotificationCount}
                  </span>
                )}
              </button>

              {/* Nút Kính Lúp Tìm Kiếm Quản Trị Nhanh (Command Palette) */}
              <button
                type="button"
                onClick={() => {
                  setIsSearchOpen(!isSearchOpen);
                  setIsNotificationOpen(false);
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                  isSearchOpen ? 'bg-emerald-600 text-white shadow-sm' : 'hover:bg-white/70 text-slate-700'
                }`}
                title="Tìm kiếm nhanh đơn hàng, khách hàng, mẫu hoa, cài đặt PIN/STK"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* On Desktop: Cụm Chuông + Kính Lúp + Badge đơn cọc chờ duyệt */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="h-10 px-2 rounded-full flex items-center gap-1 glass-nav-luminous shadow-sm">
              <button
                type="button"
                onClick={() => {
                  setIsNotificationOpen(!isNotificationOpen);
                  setIsSearchOpen(false);
                }}
                className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                  isNotificationOpen ? 'bg-white/70 shadow-xs' : 'hover:bg-white/60'
                }`}
                title="Trung tâm thông báo quản trị"
              >
                <img src="/icons/icon-bell-3d.png" alt="Thông báo" className="w-4 h-4 object-contain shrink-0" />
                {(pendingDepositOrders > 0 || unreadNotificationCount > 0) && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[15px] h-3.5 px-1 rounded-full bg-rose-600 text-white text-[8px] font-bold flex items-center justify-center shadow-md animate-pulse border border-white">
                    {pendingDepositOrders + unreadNotificationCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsSearchOpen(!isSearchOpen);
                  setIsNotificationOpen(false);
                }}
                className={`px-2.5 py-1 rounded-full flex items-center gap-1.5 text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  isSearchOpen ? 'bg-emerald-600 text-white shadow-sm' : 'hover:bg-white/60 text-slate-700'
                }`}
                title="Tìm kiếm nhanh quản trị (Command Palette)"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="text-[11px]">Tìm nhanh</span>
              </button>
            </div>

            {/* Badge Đơn cọc chờ duyệt */}
            {pendingDepositOrders > 0 && (
              <button
                type="button"
                onClick={() => onNavigateTab?.('orders')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 backdrop-blur-md hover:bg-amber-500/25 border border-amber-400/80 text-amber-950 text-xs font-bold shadow-[0_4px_16px_rgba(245,158,11,0.12),inset_0_1px_1px_rgba(255,255,255,0.8)] animate-pulse cursor-pointer transition-all active:scale-95 shrink-0"
                title="Xem danh sách đơn cọc cần duyệt"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                <span className="whitespace-nowrap font-bold">
                  {pendingDepositOrders} đơn cọc chờ duyệt
                </span>
              </button>
            )}
          </div>

          {/* ========================================================
              POPUP 1: TRUNG TÂM THÔNG BÁO QUẢN TRỊ (ĐÃ BỎ NÚT NGHE THỬ)
              ======================================================== */}
          {isNotificationOpen && (
            <>
              <div
                className="fixed inset-0 z-[65] bg-transparent"
                onClick={() => setIsNotificationOpen(false)}
              />
              <div className="absolute top-full left-0 mt-2.5 w-[calc(100vw-24px)] max-w-sm p-3.5 rounded-2xl bg-white/95 backdrop-blur-2xl border border-white/90 shadow-[0_20px_50px_rgba(0,0,0,0.18),inset_0_1.5px_1px_rgba(255,255,255,1)] z-[70] animate-in fade-in slide-in-from-top-2 duration-200 select-none">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-emerald-700" />
                    <span className="font-bold text-xs text-slate-900">Trung Tâm Thông Báo</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full">
                      {notifications.length + pendingDepositOrders}
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
                      onClick={() => setIsNotificationOpen(false)}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                      title="Đóng"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 max-h-72 overflow-y-auto">
                  {/* Đơn hàng chờ duyệt cọc */}
                  {pendingDepositOrders > 0 && (
                    <div
                      onClick={() => {
                        setIsNotificationOpen(false);
                        onNavigateTab?.('orders');
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

                  {notifications.length === 0 && pendingDepositOrders === 0 ? (
                    <div className="py-6 text-center space-y-1.5">
                      <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                        <Bell className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-medium text-slate-600">Chưa có thông báo nào mới</p>
                      <p className="text-[10px] text-slate-400 leading-snug px-3">
                        Khi có đơn hoa, đối soát cọc VietQR, hoặc cộng điểm thưởng, hệ thống sẽ gửi chuông báo tại đây.
                      </p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationAsRead(n.id);
                          if (n.orderId) {
                            onNavigateTab?.('orders');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                          n.isRead
                            ? 'bg-slate-50/80 border-slate-200/60 opacity-80'
                            : 'bg-emerald-50/90 border-emerald-200/80 shadow-xs'
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

          {/* =========================================================================
              POPUP 2: HỘP QUẢN TRỊ 1-CHẠM (COMMAND PALETTE - DẠNG NỔI KHÔNG ĐẨY LAYOUT)
              ========================================================================= */}
          {isSearchOpen && (
            <>
              <div
                className="fixed inset-0 z-[65] bg-transparent"
                onClick={() => setIsSearchOpen(false)}
              />
              <div className="absolute top-full left-0 mt-2.5 w-[calc(100vw-24px)] max-w-md p-3 rounded-2xl bg-white/95 backdrop-blur-2xl border border-white/95 shadow-[0_20px_50px_rgba(0,0,0,0.2),inset_0_1.5px_1px_rgba(255,255,255,1)] z-[70] animate-in fade-in slide-in-from-top-2 duration-200 select-none">
                {/* Ô Nhập Tìm Kiếm Nổi */}
                <div className="relative flex items-center mb-2.5">
                  <Search className="w-4 h-4 text-emerald-600 absolute left-3 shrink-0" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Tìm theo SĐT, tên khách, mã đơn, mẫu hoa, 'PIN', 'STK'..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pr-16 pl-9 text-xs py-2 rounded-xl bg-slate-50/90 border border-emerald-300/80 shadow-inner focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-slate-900 placeholder:text-slate-400"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-9 p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                      title="Xóa"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="absolute right-2 p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                    title="Đóng"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Khi chưa gõ: Hiện Gợi ý Phím Tắt 1-Chạm */}
                {!cleanQ && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                      Phím Tắt Quản Trị Nhanh
                    </p>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleSelectShortcut('orders')}
                        className="p-2 rounded-xl bg-amber-50/90 hover:bg-amber-100/90 border border-amber-200/80 text-left transition-all cursor-pointer flex items-center gap-2"
                      >
                        <PackageCheck className="w-4 h-4 text-amber-700 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-amber-950 truncate">Đơn cọc chờ duyệt</p>
                          <p className="text-[10px] text-amber-700">{pendingDepositOrders} đơn cần cọc 50%</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectShortcut('promotions')}
                        className="p-2 rounded-xl bg-rose-50/90 hover:bg-rose-100/90 border border-rose-200/80 text-left transition-all cursor-pointer flex items-center gap-2"
                      >
                        <Percent className="w-4 h-4 text-rose-700 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-rose-950 truncate">Sự kiện giảm giá 8/3</p>
                          <p className="text-[10px] text-rose-700">Giảm giá % đồng loạt</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectShortcut('security')}
                        className="p-2 rounded-xl bg-emerald-50/90 hover:bg-emerald-100/90 border border-emerald-200/80 text-left transition-all cursor-pointer flex items-center gap-2"
                      >
                        <KeyRound className="w-4 h-4 text-emerald-700 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-emerald-950 truncate">Đổi PIN &amp; STK</p>
                          <p className="text-[10px] text-emerald-700">Bảo mật cấp 2 &amp; VietQR</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectShortcut('revenue')}
                        className="p-2 rounded-xl bg-purple-50/90 hover:bg-purple-100/90 border border-purple-200/80 text-left transition-all cursor-pointer flex items-center gap-2"
                      >
                        <Sparkles className="w-4 h-4 text-purple-700 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-purple-950 truncate">Báo cáo doanh thu</p>
                          <p className="text-[10px] text-purple-700">Xem doanh số tiệm hoa</p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {/* Khi đã gõ: Hiển thị các HÀNG GỢI Ý BÊN DƯỚI */}
                {cleanQ && (
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {/* 1. Hàng gợi ý Mục Cài Đặt / Tính Năng */}
                    {matchingShortcuts.length > 0 && (
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">
                          Tính Năng Quản Trị
                        </p>
                        <div className="space-y-1">
                          {matchingShortcuts.map((s) => {
                            const IconComp = s.icon;
                            return (
                              <button
                                key={s.id}
                                type="button"
                                onClick={() => handleSelectShortcut(s.tab)}
                                className="w-full p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 border border-slate-200/60 text-left transition-all cursor-pointer flex items-center justify-between group"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <div className="w-7 h-7 rounded-lg bg-emerald-100/80 text-emerald-800 flex items-center justify-center shrink-0">
                                    <IconComp className="w-4 h-4" />
                                  </div>
                                  <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-900 truncate">
                                    {s.label}
                                  </span>
                                </div>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 shrink-0" />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* 2. Hàng gợi ý Đơn Hàng & Khách */}
                    {matchingOrders.length > 0 && (
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">
                          Đơn Hàng Khớp ({matchingOrders.length})
                        </p>
                        <div className="space-y-1">
                          {matchingOrders.map((o) => {
                            const customerName = o.senderName || o.recipientName || 'Khách hàng';
                            const customerPhone = o.senderPhone || o.recipientPhone || '';
                            return (
                              <button
                                key={o.id}
                                type="button"
                                onClick={() => handleSelectShortcut('orders')}
                                className="w-full p-2 rounded-xl bg-amber-50/70 hover:bg-amber-100/80 border border-amber-200/70 text-left transition-all cursor-pointer flex items-center justify-between group"
                              >
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold text-amber-950 font-mono">#{o.id}</span>
                                    <span className="text-xs font-semibold text-slate-800 truncate">• {customerName}</span>
                                  </div>
                                  <p className="text-[10px] text-slate-500 truncate mt-0.5">
                                    SĐT: {customerPhone || 'Chưa có'} • {o.isDepositPaid ? 'Đã cọc 50%' : 'Chờ duyệt cọc'}
                                  </p>
                                </div>
                                <span className="text-[10px] font-bold text-amber-800 px-2 py-0.5 rounded-md bg-amber-200/80 shrink-0 ml-2">
                                  Xem đơn
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* 3. Hàng gợi ý Mẫu Hoa */}
                    {matchingProducts.length > 0 && (
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">
                          Mẫu Hoa &amp; Sửa Giá ({matchingProducts.length})
                        </p>
                        <div className="space-y-1">
                          {matchingProducts.map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => handleSelectShortcut('pricing')}
                              className="w-full p-2 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-200/60 hover:border-rose-200/80 text-left transition-all cursor-pointer flex items-center justify-between group"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <img
                                  src={p.imageUrl || '/logo-vvflorielle-horizontal.webp'}
                                  alt={p.name}
                                  className="w-7 h-7 rounded-lg object-cover border border-slate-200 shrink-0"
                                />
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-slate-800 group-hover:text-rose-950 truncate">
                                    {p.name}
                                  </p>
                                  <p className="text-[10px] text-emerald-700 font-semibold">
                                    {new Intl.NumberFormat('vi-VN').format(p.price)}đ
                                  </p>
                                </div>
                              </div>
                              <span className="text-[10px] font-bold text-rose-700 px-2 py-0.5 rounded-md bg-rose-100 shrink-0 ml-2">
                                Sửa giá
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Khi không tìm thấy gì */}
                    {matchingShortcuts.length === 0 &&
                      matchingOrders.length === 0 &&
                      matchingProducts.length === 0 && (
                        <div className="py-6 text-center space-y-1">
                          <Search className="w-6 h-6 text-slate-300 mx-auto" />
                          <p className="text-xs font-medium text-slate-600">
                            Không tìm thấy kết quả nào cho "{searchQuery}"
                          </p>
                          <p className="text-[10px] text-slate-400">
                            Thử tìm bằng SĐT khách, tên hoa, hoặc từ khóa "PIN", "STK", "giảm giá"
                          </p>
                        </div>
                      )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* === CENTER: LOGO CĂN CHÍNH GIỮA TUYỆT ĐỐI MÀN HÌNH (Z-20) - TO RÕ 170PX, ĐỔ BÓNG NỔI KHỐI, KHÔNG KHUNG TRÁNH CHÌM VIỀN === */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto">
          <button
            type="button"
            onClick={handleReturnToStore}
            className="flex items-center justify-center cursor-pointer select-none group transition-transform hover:scale-105 active:scale-95 p-1"
            title="V&V Florielle - Bấm để chuyển nhanh ra xem giao diện website"
          >
            <img
              src="/logo-vvflorielle-horizontal.webp"
              alt="V&V Florielle"
              className="h-10 min-[375px]:h-11 sm:h-14 md:h-16 w-auto max-w-[170px] sm:max-w-[240px] md:max-w-[280px] object-contain filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.12)] transition-transform duration-300"
            />
          </button>
        </div>

        {/* === RIGHT: KHỐI TÀI KHOẢN (ICON KHIÊN 3D + "CHỦ TIỆM" + NÚT ĐĂNG XUẤT) === */}
        <div className="relative flex items-center justify-end shrink-0 z-30 pointer-events-auto">
          {/* On Mobile: Đồng bộ khối bóng kính tròn 2 nút đối xứng y hệt ngoài web */}
          <div className="sm:hidden">
            <div className="h-10 min-[375px]:h-11 w-[76px] min-[375px]:w-[86px] px-1 min-[375px]:px-1.5 rounded-full shrink-0 flex items-center justify-between glass-nav-luminous">
              {/* Nút Khiên 3D mở popover tài khoản */}
              <button
                type="button"
                onClick={() => {
                  setIsAccountPopoverOpen(!isAccountPopoverOpen);
                  setIsNotificationOpen(false);
                  setIsSearchOpen(false);
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                  isAccountPopoverOpen ? 'bg-white/70 shadow-xs' : 'hover:bg-white/70'
                }`}
                title="Thông tin quản trị viên & bảo mật"
              >
                <img src="/icons/icon-shield-3d.png" alt="Bảo mật" className="w-4 h-4 object-contain shrink-0 drop-shadow-xs" />
              </button>

              {/* Nút Đăng Xuất */}
              <button
                type="button"
                onClick={handleLogout}
                className="w-8 h-8 rounded-full text-slate-500 hover:text-rose-600 hover:bg-rose-50/80 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                title="Đăng xuất khỏi phiên quản trị"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* On Desktop: Giữ nguyên dạng thanh ngang chi tiết với "Chủ Tiệm" + Đăng xuất */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md transition-all shrink-0 bg-white/15 text-slate-900 border-white/55 shadow-[0_4px_16px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.8)]">
            <button
              type="button"
              onClick={() => {
                setIsAccountPopoverOpen(!isAccountPopoverOpen);
                setIsNotificationOpen(false);
                setIsSearchOpen(false);
              }}
              className="flex items-center gap-1.5 cursor-pointer hover:opacity-85 transition-opacity"
              title="Thông tin phiên làm việc quản trị"
            >
              <img src="/icons/icon-shield-3d.png" alt="Bảo mật" className="w-4 h-4 object-contain shrink-0 drop-shadow-xs" />
              <span className="font-bold">{isOwner ? 'Chủ Tiệm' : 'Super Admin'}</span>
            </button>
            <span className="w-px h-3.5 bg-slate-300/80 shrink-0" />
            <button
              type="button"
              onClick={handleLogout}
              className="p-1 rounded-full hover:bg-rose-100 text-rose-600 hover:text-rose-800 transition-colors cursor-pointer active:scale-95 shrink-0 flex items-center justify-center"
              title="Đăng xuất khỏi phiên quản trị"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              <span className="sr-only">Đăng Xuất</span>
            </button>
          </div>

          {/* Popover Hồ Sơ Quản Trị */}
          {isAccountPopoverOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsAccountPopoverOpen(false)}
              />
              <div className="absolute top-full right-0 mt-2.5 w-64 p-3.5 rounded-2xl bg-white/95 backdrop-blur-2xl border border-white/90 shadow-[0_20px_50px_rgba(0,0,0,0.18),inset_0_1.5px_1px_rgba(255,255,255,1)] z-50 animate-in fade-in slide-in-from-top-2 duration-200 select-none">
                <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs border ${
                    isOwner ? 'bg-emerald-50 border-emerald-200/80' : 'bg-purple-50 border-purple-200/80'
                  }`}>
                    <img src="/icons/icon-shield-3d.png" alt="Bảo mật" className="w-5 h-5 object-contain" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-slate-900 truncate">
                        {isOwner ? 'Chủ Tiệm' : 'Super Admin'}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">Phiên làm việc an toàn</p>
                  </div>
                </div>

                <div className="py-2.5 space-y-1.5 text-[11px] text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Trạng thái:</span>
                    <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 text-[10px]">
                      Đang quản trị
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Quyền hạn:</span>
                    <span className="font-medium text-slate-700 text-[10.5px]">Toàn quyền tiệm hoa</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAccountPopoverOpen(false);
                      handleReturnToStore();
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-sm shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
                  >
                    <img src="/icons/icon-store-3d.png" alt="Trang web" className="w-3.5 h-3.5 object-contain brightness-200" />
                    <span>Xem Giao Diện Cửa Hàng</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAccountPopoverOpen(false);
                      onNavigateTab?.('security');
                    }}
                    className="w-full py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <img src="/icons/icon-settings-3d.png" alt="Bảo mật" className="w-3.5 h-3.5 object-contain" />
                    <span>Bảo Mật &amp; Đổi PIN Cấp 2</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
