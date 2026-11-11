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

  // Notification popover state (nếu cần mở từ dock)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSoundMuted, setIsSoundMuted] = useState(false);

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

  // NÚT 2: TÙY THEO VAI TRÒ
  // - CHỦ TIỆM: BẢNG GIÁ DỊCH VỤ & GIẢM GIÁ
  // - SUPER ADMIN: QUẢN LÝ THÀNH VIÊN VIP & KHÁCH HÀNG
  const handleRoleAction = () => {
    setIsNotificationOpen(false);
    if (isOwner) {
      setCurrentView(targetAdminView);
      onSelectTab?.('pricing');
    } else {
      setCurrentView('admin');
      onSelectTab?.('customers');
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

  // NÚT 5: TÙY THEO VAI TRÒ (THAY THẾ NÚT THÔNG BÁO BỊ TRÙNG LẶP)
  // - CHỦ TIỆM: QUẢN LÝ ĐƠN HÀNG (KÈM SỐ ĐẾM ĐƠN CỌC CHỜ DUYỆT)
  // - SUPER ADMIN: QUẢN LÝ GIAO DIỆN / CMS
  const handleSlot5Action = () => {
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

  return (
    <>
      {/* ================================================================
          DOCK 1: THANH DOCK ẨN PHỤ MỞ RỘNG (CHỈ XUẤT HIỆN TRÊN MOBILE & KHI Ở TRANG WEB NGOÀI)
          - Chiều cao cố định chuẩn h-11 (44px) đúng bằng icon bánh răng, KHÔNG PHỒNG TO.
          - Hiệu ứng trượt êm ái tự nhiên, các icon nhỏ gọn vừa vặn hiển thị trọn vẹn 100%.
          ================================================================ */}
      {isStorefront && (
        <div
          className={`fixed left-2.5 bottom-[72px] sm:bottom-[78px] z-[75] md:hidden flex items-center pointer-events-auto transition-all duration-300 ${
            isNotificationOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          onTouchStart={resetAutoCollapse}
        >
          <div
            className={`flex items-center rounded-full bg-white/20 backdrop-blur-xl border border-white/60 shadow-[0_8px_24px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.85)] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden p-0 ${
              isUnfurlExpanded ? 'h-11 max-w-[calc(100vw-20px)]' : 'w-11 h-11'
            }`}
          >
            {/* Nút tròn bánh răng 44px tinh tế (Luôn tròn xoe 44x44, không bị ép dẹt) */}
            <button
              type="button"
              onClick={() => setIsUnfurlExpanded(!isUnfurlExpanded)}
              className="w-11 h-11 rounded-full aspect-square flex items-center justify-center bg-gradient-to-tr from-rose-500 to-pink-500 text-white shadow-md shrink-0 cursor-pointer p-0 hover:scale-105 active:scale-95 transition-all duration-300 select-none"
              title={isUnfurlExpanded ? 'Thu gọn menu' : 'Mở menu điều hướng website nhanh'}
            >
              <Settings className={`w-5 h-5 transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${isUnfurlExpanded ? 'rotate-90' : 'rotate-0'}`} />
            </button>

            {/* Dãy nút ngang nhỏ gọn trượt ra êm mượt, đồng chiều cao với bánh răng */}
            {isUnfurlExpanded && (
              <nav className="flex items-center gap-1 pl-1.5 pr-2 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">
                {/* 1. Trang Chủ */}
                <button
                  type="button"
                  onClick={() => {
                    setIsUnfurlExpanded(false);
                    setCurrentView('store');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="h-8 px-2.5 rounded-full hover:bg-white/70 active:scale-95 transition-all cursor-pointer flex items-center gap-1 shrink-0"
                  title="Về Trang Chủ"
                >
                  <img src="/icons/icon-home-3d.png" alt="Trang chủ" className="w-4 h-4 object-contain drop-shadow-xs shrink-0" />
                  <span className="text-[10.5px] font-bold text-slate-800 leading-none">Trang chủ</span>
                </button>

                {/* 2. Bảng Giá */}
                <button
                  type="button"
                  onClick={() => {
                    setIsUnfurlExpanded(false);
                    setCurrentView('catalog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="h-8 px-2.5 rounded-full hover:bg-white/70 active:scale-95 transition-all cursor-pointer flex items-center gap-1 shrink-0"
                  title="Xem Bảng Giá"
                >
                  <img src="/icons/icon-pricing-3d.png" alt="Bảng giá" className="w-4 h-4 object-contain drop-shadow-xs shrink-0" />
                  <span className="text-[10.5px] font-bold text-slate-800 leading-none">Bảng giá</span>
                </button>

                {/* 3. Mẫu Hoa */}
                <button
                  type="button"
                  onClick={() => {
                    setIsUnfurlExpanded(false);
                    setCurrentView('catalog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="h-8 px-2.5 rounded-full hover:bg-white/70 active:scale-95 transition-all cursor-pointer flex items-center gap-1 shrink-0"
                  title="Khám phá mẫu hoa nghệ thuật"
                >
                  <img src="/icons/icon-catalog-3d.png" alt="Mẫu hoa" className="w-4 h-4 object-contain drop-shadow-xs shrink-0" />
                  <span className="text-[10.5px] font-bold text-slate-800 leading-none">Mẫu hoa</span>
                </button>

                {/* 4. Dịch Vụ */}
                <button
                  type="button"
                  onClick={() => {
                    setIsUnfurlExpanded(false);
                    setCurrentView('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="h-8 px-2.5 rounded-full hover:bg-white/70 active:scale-95 transition-all cursor-pointer flex items-center gap-1 shrink-0"
                  title="Dịch vụ hoa cưới & thiết kế"
                >
                  <img src="/icons/icon-services-3d.png" alt="Dịch vụ" className="w-4 h-4 object-contain drop-shadow-xs shrink-0" />
                  <span className="text-[10.5px] font-bold text-slate-800 leading-none">Dịch vụ</span>
                </button>

                {/* 5. Cẩm Nang */}
                <button
                  type="button"
                  onClick={() => {
                    setIsUnfurlExpanded(false);
                    setCurrentView('care');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="h-8 px-2.5 rounded-full hover:bg-white/70 active:scale-95 transition-all cursor-pointer flex items-center gap-1 shrink-0"
                  title="Cẩm nang chăm sóc hoa tươi"
                >
                  <img src="/icons/icon-care-3d.png" alt="Cẩm nang" className="w-4 h-4 object-contain drop-shadow-xs shrink-0" />
                  <span className="text-[10.5px] font-bold text-slate-800 leading-none">Cẩm nang</span>
                </button>

                {/* 6. Liên Hệ */}
                <button
                  type="button"
                  onClick={() => {
                    setIsUnfurlExpanded(false);
                    setCurrentView('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="h-8 px-2.5 rounded-full hover:bg-white/70 active:scale-95 transition-all cursor-pointer flex items-center gap-1 shrink-0"
                  title="Liên hệ hotline & showroom"
                >
                  <img src="/icons/icon-contact-3d.png" alt="Liên hệ" className="w-4 h-4 object-contain drop-shadow-xs shrink-0" />
                  <span className="text-[10.5px] font-bold text-slate-800 leading-none">Liên hệ</span>
                </button>
              </nav>
            )}
          </div>
        </div>
      )}

      {/* ================================================================
          DOCK 2: THANH DOCK ĐIỀU HÀNH CHÍNH 5 NÚT CHUẨN
          HIỂN THỊ TRÊN CẢ MOBILE & DESKTOP KHI ĐÃ ĐĂNG NHẬP!
          - Nền kính trong suốt cố định 100%, khử khựng cuộn hoàn toàn.
          - 5 Nút: 
            [1. Quay lại]
            [2. Chủ tiệm: Bảng giá / Admin: Thành viên]
            [3. ⚡ Quét / Tạo QR cam tròn]
            [4. Đổi Quản trị ⮂ Trang web]
            [5. Chủ tiệm: Đơn hàng / Admin: Giao diện]
          ================================================================ */}
      <div className="fixed bottom-2 sm:bottom-4 inset-x-2 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-[70] select-none pointer-events-auto transition-all duration-200 opacity-100 scale-100 sm:w-auto sm:min-w-[480px]">
        <nav
          className="flex items-center justify-between sm:justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/55 shadow-[0_12px_32px_rgba(0,0,0,0.08),inset_0_1px_1.5px_rgba(255,255,255,0.85)] w-full sm:w-auto"
          aria-label="Thanh dock điều hướng quản trị 5 nút"
        >
          {/* NÚT 1: QUAY LẠI */}
          <button
            type="button"
            onClick={handleGoBack}
            className="flex-1 sm:flex-initial sm:w-[84px] h-[48px] sm:h-[54px] py-1 px-1 sm:px-2 rounded-2xl hover:bg-white/40 active:scale-95 transition-all cursor-pointer flex flex-col items-center justify-center shrink-0"
            title="Quay lại trang trước"
          >
            <img src="/icons/icon-back-3d.png" alt="Quay lại" className="w-5 h-5 sm:w-6 sm:h-6 object-contain drop-shadow-xs" />
            <span className="text-[9.5px] sm:text-[10.5px] font-bold text-slate-700 mt-0.5 leading-none whitespace-nowrap">
              Quay lại
            </span>
          </button>

          {/* NÚT 2: TÙY THEO VAI TRÒ (CHỦ TIỆM: BẢNG GIÁ, ADMIN: THÀNH VIÊN) */}
          <button
            type="button"
            onClick={handleRoleAction}
            className={`flex-1 sm:flex-initial sm:w-[84px] h-[48px] sm:h-[54px] py-1 px-1 sm:px-2 rounded-2xl hover:bg-white/40 active:scale-95 transition-all cursor-pointer flex flex-col items-center justify-center shrink-0 relative ${
              (!isStorefront && activeTab === 'pricing' && isOwner) || (!isStorefront && activeTab === 'customers' && !isOwner)
                ? 'bg-white/70 backdrop-blur-md border border-white/85 shadow-[0_2px_8px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,0.9)]'
                : ''
            }`}
            title={isOwner ? 'Bảng giá dịch vụ hoa tươi' : 'Quản lý thành viên & tích điểm VIP'}
          >
            <div className="relative">
              <img
                src={isOwner ? '/icons/icon-pricing-3d.png' : '/icons/icon-user-3d.png'}
                alt={isOwner ? 'Bảng giá' : 'Thành viên'}
                className="w-5 h-5 sm:w-6 sm:h-6 object-contain drop-shadow-xs"
              />
            </div>
            <span className="text-[9.5px] sm:text-[10.5px] font-bold text-slate-700 mt-0.5 leading-none whitespace-nowrap">
              {isOwner ? 'Bảng giá' : 'Thành viên'}
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
            className={`flex-1 sm:flex-initial sm:w-[84px] h-[48px] sm:h-[54px] py-1 px-1 sm:px-2 rounded-2xl hover:bg-white/40 active:scale-95 transition-all cursor-pointer flex flex-col items-center justify-center shrink-0 ${
              (!isStorefront && activeTab === 'dashboard') || isStorefront
                ? 'bg-white/70 backdrop-blur-md border border-white/85 shadow-[0_2px_8px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,0.9)]'
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

          {/* NÚT 5: TÙY THEO VAI TRÒ
              - CHỦ TIỆM: ĐƠN HÀNG (KÈM BADGE ĐƠN CHỜ DUYỆT)
              - SUPER ADMIN: GIAO DIỆN / CMS */}
          <button
            type="button"
            onClick={handleSlot5Action}
            className={`flex-1 sm:flex-initial sm:w-[84px] h-[48px] sm:h-[54px] py-1 px-1 sm:px-2 rounded-2xl hover:bg-white/40 active:scale-95 transition-all cursor-pointer flex flex-col items-center justify-center shrink-0 relative ${
              (!isStorefront && activeTab === 'orders' && isOwner) || (!isStorefront && activeTab === 'cms' && !isOwner)
                ? 'bg-white/70 backdrop-blur-md border border-white/85 shadow-[0_2px_8px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,0.9)]'
                : ''
            }`}
            title={isOwner ? 'Quản lý đơn hàng hoa & tiến độ cắm' : 'Quản lý giao diện, banner & CMS'}
          >
            <div className="relative">
              <img
                src={isOwner ? '/icons/icon-orders-3d.png' : '/icons/icon-cms-3d.png'}
                alt={isOwner ? 'Đơn hàng' : 'Giao diện'}
                className="w-5 h-5 sm:w-6 sm:h-6 object-contain drop-shadow-xs"
              />
              {isOwner && pendingOrdersCount > 0 && (
                <span className="absolute -top-1 -right-2 min-w-[15px] h-4 px-1 rounded-full bg-rose-600 text-white text-[8px] font-bold flex items-center justify-center shadow-md animate-pulse border border-white">
                  {pendingOrdersCount}
                </span>
              )}
            </div>
            <span className="text-[9.5px] sm:text-[10.5px] font-bold text-slate-700 mt-0.5 leading-none whitespace-nowrap">
              {isOwner ? 'Đơn hàng' : 'Giao diện'}
            </span>
          </button>
        </nav>
      </div>
    </>
  );
};
