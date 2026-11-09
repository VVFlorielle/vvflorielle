import React, { useState, useEffect, useRef } from 'react';
import {
  ScanLine,
  Settings,
  Bell,
  CheckCircle2,
  AlertCircle,
  Volume2,
  VolumeX,
  X
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
  const isStorefront =
    currentView === 'store' ||
    currentView === 'care' ||
    currentView === 'about' ||
    currentView === 'contact' ||
    currentView === 'catalog';

  const isOwner = role === 'owner' || activeAdminUser === 'vvflorielle' || activeAdminUser === 'chuquan';
  const targetAdminView = isOwner ? 'owner' : 'admin';

  // Mobile Unfurl Dock state (Thanh dock ẩn phụ mở rộng - chỉ xuất hiện ở Mobile khi ở trang web ngoài)
  const [isUnfurlExpanded, setIsUnfurlExpanded] = useState(false);
  const collapseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Notification popover state
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSoundMuted, setIsSoundMuted] = useState(false);

  // Scroll dimming effect
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 450);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  const resetAutoCollapse = () => {
    if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
    if (isUnfurlExpanded) {
      collapseTimerRef.current = setTimeout(() => {
        setIsUnfurlExpanded(false);
      }, 15000);
    }
  };

  useEffect(() => {
    resetAutoCollapse();
    return () => {
      if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
    };
  }, [isUnfurlExpanded]);

  // NÚT 1: QUAY LẠI
  const handleGoBack = () => {
    setIsNotificationOpen(false);
    if (!isStorefront && activeTab !== 'dashboard') {
      onSelectTab?.('dashboard');
    } else if (isStorefront) {
      setCurrentView(targetAdminView);
      onSelectTab?.('dashboard');
    } else {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        setCurrentView('store');
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // NÚT 2: TÙY THEO VAI TRÒ (CHỦ QUÁN: ĐƠN HÀNG, ADMIN: GIAO DIỆN CMS)
  const handleRoleAction = () => {
    setIsNotificationOpen(false);
    if (isOwner) {
      setCurrentView(targetAdminView);
      onSelectTab?.('orders');
    } else {
      setCurrentView('admin');
      onSelectTab?.('cms');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // NÚT 4: NÚT CHUYỂN ĐỔI THÔNG MINH 2 CHIỀU (QUẢN TRỊ <-> TRANG WEB)
  const handleSmartSwitch = () => {
    setIsNotificationOpen(false);
    if (isStorefront) {
      setCurrentView(targetAdminView);
      onSelectTab?.('dashboard');
    } else {
      setCurrentView('store');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // NÚT 5: THÔNG BÁO TIỆM HOA
  const handleToggleNotification = () => {
    setIsNotificationOpen((prev) => !prev);
  };

  return (
    <>
      {/* ================================================================
          DOCK 1: THANH DOCK ẨN PHỤ MỞ RỘNG (CHỈ XUẤT HIỆN TRÊN MOBILE & KHI Ở TRANG WEB NGOÀI)
          Tuyệt đối KHÔNG xuất hiện trên Desktop (Desktop đã có thanh menu trên đầu).
          Khi thu nhỏ: Chỉ duy nhất nút tròn bánh răng 44px trong suốt bóng kính.
          Khi mở rộng: Cuộn giấy trượt mượt mà sang phải, hiển thị icon 3D trên - chữ dưới.
          ================================================================ */}
      {isStorefront && (
        <div
          className={`fixed left-2.5 bottom-[72px] sm:bottom-[78px] z-[75] md:hidden flex items-center pointer-events-auto transition-all duration-300 ${
            isScrolling ? 'opacity-40 hover:opacity-100' : 'opacity-100'
          }`}
          onTouchStart={resetAutoCollapse}
        >
          {!isUnfurlExpanded ? (
            /* Nút tròn bánh răng 44px chuẩn PhotoTiinLove (Không khung thừa) */
            <button
              type="button"
              onClick={() => setIsUnfurlExpanded(true)}
              className="w-11 h-11 rounded-full aspect-square flex items-center justify-center bg-gradient-to-tr from-rose-500 to-pink-500 text-white shadow-[0_8px_24px_rgba(244,63,94,0.35)] ring-2 ring-white/90 hover:scale-105 active:scale-95 transition-all cursor-pointer p-0"
              title="Mở menu điều hướng website nhanh"
            >
              <Settings className="w-5 h-5 animate-spin-slow" />
            </button>
          ) : (
            /* Khung capsule bóng kính mở rộng (Frosted Glass Paper Scroll Unfurl) */
            <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-white/75 backdrop-blur-2xl border-[1.5px] border-white/90 shadow-[0_16px_40px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.9)] animate-in fade-in slide-in-from-left-4 duration-300 max-w-[calc(100vw-20px)]">
              {/* Nút đóng bánh răng quay 90 độ */}
              <button
                type="button"
                onClick={() => setIsUnfurlExpanded(false)}
                className="w-9 h-9 rounded-full aspect-square flex items-center justify-center bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-xs shrink-0 cursor-pointer p-0 hover:scale-105 active:scale-95 transition-all"
                title="Thu gọn menu"
              >
                <Settings className="w-4 h-4 rotate-90" />
              </button>

              {/* Dãy icon 3D mềm mại trên - tên dưới chuẩn PhotoTiinLove */}
              <nav className="flex items-center gap-1 px-1 py-0.5 overflow-x-auto no-scrollbar scroll-smooth">
                {/* 1. Trang Chủ */}
                <button
                  type="button"
                  onClick={() => {
                    setIsUnfurlExpanded(false);
                    setCurrentView('store');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl hover:bg-white/60 active:scale-95 transition-all cursor-pointer shrink-0"
                  title="Về Trang Chủ"
                >
                  <img src="/icons/icon-home-3d.png" alt="Trang chủ" className="w-6 h-6 object-contain drop-shadow-xs" />
                  <span className="text-[10px] font-bold text-amber-950 mt-0.5 leading-none">Trang chủ</span>
                </button>

                {/* 2. Bảng Giá */}
                <button
                  type="button"
                  onClick={() => {
                    setIsUnfurlExpanded(false);
                    setCurrentView('catalog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl hover:bg-white/60 active:scale-95 transition-all cursor-pointer shrink-0"
                  title="Xem Bảng Giá"
                >
                  <img src="/icons/icon-pricing-3d.png" alt="Bảng giá" className="w-6 h-6 object-contain drop-shadow-xs" />
                  <span className="text-[10px] font-bold text-amber-950 mt-0.5 leading-none">Bảng giá</span>
                </button>

                {/* 3. Mẫu Hoa */}
                <button
                  type="button"
                  onClick={() => {
                    setIsUnfurlExpanded(false);
                    setCurrentView('catalog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl hover:bg-white/60 active:scale-95 transition-all cursor-pointer shrink-0"
                  title="Khám phá mẫu hoa nghệ thuật"
                >
                  <img src="/icons/icon-catalog-3d.png" alt="Mẫu hoa" className="w-6 h-6 object-contain drop-shadow-xs" />
                  <span className="text-[10px] font-bold text-amber-950 mt-0.5 leading-none">Mẫu hoa</span>
                </button>

                {/* 4. Dịch Vụ */}
                <button
                  type="button"
                  onClick={() => {
                    setIsUnfurlExpanded(false);
                    setCurrentView('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl hover:bg-white/60 active:scale-95 transition-all cursor-pointer shrink-0"
                  title="Dịch vụ hoa cưới & thiết kế"
                >
                  <img src="/icons/icon-services-3d.png" alt="Dịch vụ" className="w-6 h-6 object-contain drop-shadow-xs" />
                  <span className="text-[10px] font-bold text-amber-950 mt-0.5 leading-none">Dịch vụ</span>
                </button>

                {/* 5. Cẩm Nang */}
                <button
                  type="button"
                  onClick={() => {
                    setIsUnfurlExpanded(false);
                    setCurrentView('care');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl hover:bg-white/60 active:scale-95 transition-all cursor-pointer shrink-0"
                  title="Cẩm nang chăm sóc hoa tươi"
                >
                  <img src="/icons/icon-care-3d.png" alt="Cẩm nang" className="w-6 h-6 object-contain drop-shadow-xs" />
                  <span className="text-[10px] font-bold text-amber-950 mt-0.5 leading-none">Cẩm nang</span>
                </button>

                {/* 6. Liên Hệ */}
                <button
                  type="button"
                  onClick={() => {
                    setIsUnfurlExpanded(false);
                    setCurrentView('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl hover:bg-white/60 active:scale-95 transition-all cursor-pointer shrink-0"
                  title="Liên hệ hotline & showroom"
                >
                  <img src="/icons/icon-contact-3d.png" alt="Liên hệ" className="w-6 h-6 object-contain drop-shadow-xs" />
                  <span className="text-[10px] font-bold text-amber-950 mt-0.5 leading-none">Liên hệ</span>
                </button>
              </nav>
            </div>
          )}
        </div>
      )}

      {/* ================================================================
          POPUP TRUNG TÂM THÔNG BÁO (KHI BẤM NÚT THÔNG BÁO TRÊN THANH DOCK)
          ================================================================ */}
      {isNotificationOpen && (
        <div className="fixed bottom-[74px] sm:bottom-[84px] right-2 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 z-[85] w-[calc(100vw-16px)] sm:w-[360px] p-4 rounded-3xl bg-white/90 backdrop-blur-2xl border-[1.5px] border-white/90 shadow-[0_20px_50px_rgba(0,0,0,0.18),inset_0_1px_2px_rgba(255,255,255,0.95)] animate-in fade-in slide-in-from-bottom-3 duration-250 select-none">
          {/* Header popup thông báo */}
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-700">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 leading-tight">Trung Tâm Thông Báo</h4>
                <p className="text-[10px] text-slate-500">Tiệm hoa V&V Florielle</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsSoundMuted(!isSoundMuted)}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600 cursor-pointer"
                title={isSoundMuted ? 'Bật chuông báo' : 'Tắt chuông báo'}
              >
                {isSoundMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-600" />}
              </button>
              <button
                type="button"
                onClick={() => setIsNotificationOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
                title="Đóng thông báo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Nội dung danh sách thông báo */}
          <div className="space-y-2 max-h-[220px] overflow-y-auto no-scrollbar">
            {pendingOrdersCount > 0 ? (
              <div
                onClick={() => {
                  setIsNotificationOpen(false);
                  setCurrentView(targetAdminView);
                  onSelectTab?.('orders');
                }}
                className="p-2.5 rounded-2xl bg-amber-50/90 border border-amber-200/80 flex items-start gap-2.5 cursor-pointer hover:bg-amber-100/80 transition-all shadow-xs"
              >
                <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-950">Đơn hàng chờ duyệt cọc</span>
                    <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-900">
                      {pendingOrdersCount} đơn
                    </span>
                  </div>
                  <p className="text-[10px] text-amber-800/90 mt-0.5 line-clamp-1">
                    Cần duyệt thanh toán cọc 50% để florist cắm hoa.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-2.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/70 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-[11px] font-semibold text-emerald-900">
                  Đã duyệt toàn bộ đơn cọc. Hệ thống ổn định.
                </span>
              </div>
            )}

            {/* Trạng thái tiệm hoa */}
            <div className="p-2.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10.5px] font-medium text-slate-700">Mẫu hoa sẵn sàng</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700">{productsCount} mẫu hoa</span>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================
          DOCK 2: THANH DOCK ĐIỀU HÀNH CHÍNH 5 NÚT CHUẨN PHOTOTIINLOVE
          HIỂN THỊ CẢ TRÊN DESKTOP VÀ MOBILE KHI ĐÃ ĐĂNG NHẬP!
          - Trên Desktop: Căn giữa đáy màn hình (bottom-4 left-1/2 -translate-x-1/2).
          - Trên Mobile: Căn đáy toàn màn hình (bottom-2 inset-x-2).
          - Hiệu ứng bóng kính trong suốt: bg-white/75 backdrop-blur-2xl border-[1.5px] border-white/85.
          - 5 Nút: [1. Quay lại] [2. Đơn hàng/Giao diện] [3. ⚡ Quét QR] [4. Quản trị/Trang web] [5. Thông báo]
          ================================================================ */}
      <div
        className={`fixed bottom-2 sm:bottom-4 inset-x-2 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-[70] select-none pointer-events-auto transition-all duration-300 sm:w-auto sm:min-w-[480px] ${
          isScrolling ? 'opacity-40 hover:opacity-100 scale-[0.98]' : 'opacity-100 scale-100'
        }`}
      >
        <nav
          className="flex items-center justify-between sm:justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/75 backdrop-blur-2xl border-[1.5px] border-white/85 shadow-[0_16px_40px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.9)] w-full sm:w-auto"
          aria-label="Thanh dock điều hướng quản trị 5 nút"
        >
          {/* NÚT 1: QUAY LẠI */}
          <button
            type="button"
            onClick={handleGoBack}
            className="flex-1 sm:flex-initial sm:w-[84px] h-[48px] sm:h-[54px] py-1 px-1 sm:px-2 rounded-2xl hover:bg-white/60 active:scale-95 transition-all cursor-pointer flex flex-col items-center justify-center shrink-0"
            title="Quay lại trang trước"
          >
            <img src="/icons/icon-back-3d.png" alt="Quay lại" className="w-5 h-5 sm:w-6 sm:h-6 object-contain drop-shadow-xs" />
            <span className="text-[9.5px] sm:text-[10.5px] font-bold text-slate-700 mt-0.5 leading-none whitespace-nowrap">
              Quay lại
            </span>
          </button>

          {/* NÚT 2: VAI TRÒ (CHỦ QUÁN: ĐƠN HÀNG KÈM BADGE, ADMIN: GIAO DIỆN CMS) */}
          <button
            type="button"
            onClick={handleRoleAction}
            className={`flex-1 sm:flex-initial sm:w-[84px] h-[48px] sm:h-[54px] py-1 px-1 sm:px-2 rounded-2xl hover:bg-white/60 active:scale-95 transition-all cursor-pointer flex flex-col items-center justify-center shrink-0 relative ${
              (!isStorefront && activeTab === 'orders' && isOwner) || (!isStorefront && activeTab === 'cms' && !isOwner)
                ? 'bg-white/80 shadow-xs'
                : ''
            }`}
            title={isOwner ? 'Quản lý đơn hàng & duyệt cọc' : 'Trình quản lý giao diện & Banner'}
          >
            <div className="relative">
              <img
                src={isOwner ? '/icons/icon-orders-3d.png' : '/icons/icon-cms-3d.png'}
                alt={isOwner ? 'Đơn hàng' : 'Giao diện'}
                className="w-5 h-5 sm:w-6 sm:h-6 object-contain drop-shadow-xs"
              />
              {isOwner && pendingOrdersCount > 0 && (
                <span className="absolute -top-1 -right-2 min-w-[15px] h-[15px] px-0.5 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center shadow-xs animate-bounce">
                  {pendingOrdersCount}
                </span>
              )}
            </div>
            <span className="text-[9.5px] sm:text-[10.5px] font-bold text-slate-700 mt-0.5 leading-none whitespace-nowrap">
              {isOwner ? 'Đơn hàng' : 'Giao diện'}
            </span>
          </button>

          {/* NÚT 3: TẠO QR / QUÉT QR (HERO BUTTON CHÍNH GIỮA) */}
          <button
            type="button"
            onClick={() => {
              setIsNotificationOpen(false);
              onOpenQrScanner();
            }}
            className="w-12 sm:w-14 h-12 sm:h-14 -mt-3.5 sm:-mt-4 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 text-white shadow-[0_8px_24px_rgba(249,115,22,0.45)] ring-3 sm:ring-4 ring-white/95 flex items-center justify-center hover:scale-108 active:scale-95 transition-transform duration-200 cursor-pointer group shrink-0 mx-0.5 sm:mx-1"
            title="Quét mã QR đơn hàng hoặc tạo QR thanh toán"
          >
            <ScanLine className="w-5 h-5 sm:w-6 sm:h-6 group-hover:animate-pulse" />
            <span className="sr-only">Tạo QR / Quét QR</span>
          </button>

          {/* NÚT 4: NÚT CHUYỂN ĐỔI THÔNG MINH (STOREFRONT -> QUẢN TRỊ, QUẢN TRỊ -> TRANG WEB) */}
          <button
            type="button"
            onClick={handleSmartSwitch}
            className={`flex-1 sm:flex-initial sm:w-[84px] h-[48px] sm:h-[54px] py-1 px-1 sm:px-2 rounded-2xl hover:bg-white/60 active:scale-95 transition-all cursor-pointer flex flex-col items-center justify-center shrink-0 ${
              (!isStorefront && activeTab === 'dashboard') || isStorefront
                ? 'bg-white/80 shadow-xs'
                : ''
            }`}
            title={isStorefront ? 'Chuyển vào trung tâm quản trị' : 'Xem trang web bán hoa công khai'}
          >
            <img
              src={isStorefront ? '/icons/icon-grid-3d.png' : '/icons/icon-store-3d.png'}
              alt={isStorefront ? 'Quản trị' : 'Trang web'}
              className="w-5 h-5 sm:w-6 sm:h-6 object-contain drop-shadow-xs"
            />
            <span className="text-[9.5px] sm:text-[10.5px] font-bold text-slate-700 mt-0.5 leading-none whitespace-nowrap">
              {isStorefront ? 'Quản trị' : 'Trang web'}
            </span>
          </button>

          {/* NÚT 5: THÔNG BÁO (THAY THẾ NÚT ĐĂNG XUẤT) */}
          <button
            type="button"
            onClick={handleToggleNotification}
            className={`flex-1 sm:flex-initial sm:w-[84px] h-[48px] sm:h-[54px] py-1 px-1 sm:px-2 rounded-2xl hover:bg-white/60 active:scale-95 transition-all cursor-pointer flex flex-col items-center justify-center shrink-0 relative ${
              isNotificationOpen ? 'bg-amber-100/80 shadow-xs' : ''
            }`}
            title="Xem trung tâm thông báo tiệm hoa"
          >
            <div className="relative">
              <img src="/icons/icon-bell-3d.png" alt="Thông báo" className="w-5 h-5 sm:w-6 sm:h-6 object-contain drop-shadow-xs" />
              {pendingOrdersCount > 0 && (
                <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              )}
            </div>
            <span className="text-[9.5px] sm:text-[10.5px] font-bold text-slate-700 mt-0.5 leading-none whitespace-nowrap">
              Thông báo
            </span>
          </button>
        </nav>
      </div>
    </>
  );
};
