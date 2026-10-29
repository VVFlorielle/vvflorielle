import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Home,
  Sparkles,
  ShoppingCart,
  User,
  ShoppingBag,
  ShieldCheck,
  ChevronLeft,
  Search,
  Store,
  FileSearch,
  PackageCheck
} from 'lucide-react';
import { PopupType } from './InfoPopups';
import { CategoryId } from '../types';

interface MobileBottomDockProps {
  onOpenCategories?: () => void;
  onOpenPopup?: (type: PopupType) => void;
}

export const MobileBottomDock: React.FC<MobileBottomDockProps> = ({
  onOpenCategories,
  onOpenPopup,
}) => {
  const {
    currentView,
    setCurrentView,
    cart,
    setIsCartOpen,
    customer,
    isAdmin,
    setIsAuthModalOpen,
    setAuthModalMode,
    setSelectedCategory,
  } = useStore();

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const isLoggedIn = Boolean(customer || isAdmin);

  // Unfurl Dock 1 expanded state
  const [isExpanded, setIsExpanded] = useState(false);
  const autoCollapseTimer = useRef<any>(null);

  // Scroll Hide / Reveal state (matching phototiinlove)
  const [hidden, setHidden] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const touchTimer = useRef<any>(null);

  const handleUserInteract = () => {
    setIsTouched(true);
    setHidden(false);
    if (touchTimer.current) clearTimeout(touchTimer.current);
    touchTimer.current = setTimeout(() => setIsTouched(false), 2500);
  };

  const resetAutoCollapse = useCallback(() => {
    if (autoCollapseTimer.current) clearTimeout(autoCollapseTimer.current);
    autoCollapseTimer.current = setTimeout(() => {
      setIsExpanded(false);
    }, 20000); // 20s auto collapse
  }, []);

  // Auto-collapse Unfurl Dock when scrolling
  useEffect(() => {
    if (!isExpanded) {
      if (autoCollapseTimer.current) clearTimeout(autoCollapseTimer.current);
      return;
    }
    resetAutoCollapse();
    let lastY = window.scrollY;
    const handleScroll = () => {
      if (Math.abs(window.scrollY - lastY) > 20) {
        setIsExpanded(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (autoCollapseTimer.current) clearTimeout(autoCollapseTimer.current);
    };
  }, [isExpanded, resetAutoCollapse]);

  // Main Dock Scroll Hide / Reveal Effect (hides on scroll > 20, reappears on stop 350ms or touch/bottom mouse)
  useEffect(() => {
    let scrollStopTimer: any = null;
    const handleScroll = () => {
      const current = window.scrollY;
      if (current > 20) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      clearTimeout(scrollStopTimer);
      scrollStopTimer = setTimeout(() => {
        setHidden(false);
      }, 350);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY >= window.innerHeight - 100) {
        setHidden(false);
      }
    };

    const handleTouchStart = () => {
      setHidden(false);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      if (scrollStopTimer) clearTimeout(scrollStopTimer);
    };
  }, []);

  const handleBack = () => {
    handleUserInteract();
    if (currentView !== 'store') {
      setCurrentView('store');
    } else if (window.history.length > 1) {
      window.history.back();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectCategory = (catId: CategoryId) => {
    setIsExpanded(false);
    setSelectedCategory(catId);
    if (currentView !== 'store') {
      setCurrentView('store');
    }
    setTimeout(() => {
      const el = document.getElementById('featured-flowers') || document.getElementById('categories-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleOpenCare = () => {
    setIsExpanded(false);
    if (onOpenPopup) onOpenPopup('care');
  };

  const handleOpenVoucher = () => {
    setIsExpanded(false);
    if (onOpenPopup) onOpenPopup('voucher');
  };

  const handleCatalogClick = () => {
    handleUserInteract();
    if (onOpenCategories) {
      onOpenCategories();
    } else {
      setCurrentView('store');
      setTimeout(() => {
        const el = document.getElementById('categories-section') || document.getElementById('featured-flowers');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleOrderLookupClick = () => {
    handleUserInteract();
    setAuthModalMode('customer');
    setIsAuthModalOpen(true);
  };

  const handleOrdersClick = () => {
    handleUserInteract();
    if (isAdmin) {
      setCurrentView('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (customer) {
      setCurrentView('customer');
      setTimeout(() => {
        const el = document.getElementById('customer-orders-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      handleOrderLookupClick();
    }
  };

  const handleAccountSwitchClick = () => {
    handleUserInteract();
    if (isAdmin) {
      setCurrentView(currentView === 'admin' ? 'store' : 'admin');
    } else if (customer) {
      setCurrentView(currentView === 'customer' ? 'store' : 'customer');
    } else {
      setAuthModalMode('customer');
      setIsAuthModalOpen(true);
    }
  };

  return (
    <>
      {/* ================================================================
          DOCK 1: THANH PHỤ MỞ RỘNG (UNFURL DOCK) KHI ĐÃ ĐĂNG NHẬP (MOBILE)
          Nút tròn bánh răng bóng kính 44x44 nhô lên trên dock chính ~12px.
          Bấm bung ra thanh cuộn menu danh mục & cẩm nang, tự thu gọn sau 20s.
          ================================================================ */}
      {isLoggedIn && (
        <div
          className={`logged-in-nav-outer ${isExpanded ? 'is-expanded' : 'is-collapsed'}`}
          onTouchStart={resetAutoCollapse}
          onMouseEnter={resetAutoCollapse}
        >
          {isExpanded ? (
            <nav className="logged-in-public-dock-unfurl" aria-label="Menu duyệt hoa">
              <button
                type="button"
                className="dock-unfurl-gear-toggle active"
                onClick={() => setIsExpanded(false)}
                aria-label="Thu gọn menu duyệt hoa"
                title="Thu gọn"
              >
                <span className="gear-spin">⚙️</span>
              </button>

              <button
                type="button"
                className={`dock-unfurl-item ${currentView === 'store' ? 'active' : ''}`}
                onClick={() => {
                  setIsExpanded(false);
                  setCurrentView('store');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                title="Trang chủ"
              >
                <span className="dock-unfurl-icon">🏠</span>
                <span className="dock-unfurl-label">Trang chủ</span>
              </button>

              <button
                type="button"
                className="dock-unfurl-item"
                onClick={() => handleSelectCategory('khai-truong')}
                title="Khai Trương"
              >
                <span className="dock-unfurl-icon">💐</span>
                <span className="dock-unfurl-label">Khai Trương</span>
              </button>

              <button
                type="button"
                className="dock-unfurl-item"
                onClick={() => handleSelectCategory('sinh-nhat')}
                title="Sinh Nhật"
              >
                <span className="dock-unfurl-icon">🎂</span>
                <span className="dock-unfurl-label">Sinh Nhật</span>
              </button>

              <button
                type="button"
                className="dock-unfurl-item"
                onClick={() => handleSelectCategory('lan-ho-diep')}
                title="Lan Hồ Điệp"
              >
                <span className="dock-unfurl-icon">🪴</span>
                <span className="dock-unfurl-label">Hồ Điệp</span>
              </button>

              <button
                type="button"
                className="dock-unfurl-item"
                onClick={() => handleSelectCategory('tinh-yeu')}
                title="Hoa Tình Yêu"
              >
                <span className="dock-unfurl-icon">🌹</span>
                <span className="dock-unfurl-label">Tình Yêu</span>
              </button>

              <button
                type="button"
                className="dock-unfurl-item"
                onClick={handleOpenVoucher}
                title="Voucher 30K"
              >
                <span className="dock-unfurl-icon">🎁</span>
                <span className="dock-unfurl-label">Voucher</span>
              </button>

              <button
                type="button"
                className="dock-unfurl-item"
                onClick={handleOpenCare}
                title="Cẩm nang chăm sóc hoa"
              >
                <span className="dock-unfurl-icon">📖</span>
                <span className="dock-unfurl-label">Cẩm Nang</span>
              </button>
            </nav>
          ) : (
            <button
              type="button"
              className="dock-unfurl-gear-toggle"
              onClick={() => setIsExpanded(true)}
              aria-label="Mở menu danh mục hoa"
              title="Danh mục hoa & Cẩm nang"
            >
              <span className="gear-spin">⚙️</span>
            </button>
          )}
        </div>
      )}

      {/* ================================================================
          DOCK 2: THANH DOCK CHÍNH 5 NÚT (MOBILE TOÀN BỘ & DESKTOP TRANG QUẢN TRỊ)
          5 nút: Trở lại, Trang chủ, Giỏ hoa (FAB), Đơn hàng, Tài khoản / Quản trị.
          Hỗ trợ hiệu ứng lướt ẩn / dừng hiện & đồng bộ cấu trúc phototiinlove.
          ================================================================ */}
      <nav
        className={`management-bottom-nav ${hidden && !isTouched ? 'management-nav-hidden' : ''} ${
          currentView !== 'store' ? 'portal-desktop-nav' : ''
        }`}
        aria-label="Thanh điều hướng chính"
        onTouchStart={handleUserInteract}
        onMouseEnter={handleUserInteract}
      >
        {isLoggedIn ? (
          // ==================== ĐÃ ĐĂNG NHẬP (5 NÚT CÔNG CỤ CHỨC NĂNG) ====================
          <>
            {/* 1. Quay lại */}
            <button
              type="button"
              onClick={handleBack}
              className="min-w-0 flex-1 flex flex-col items-center justify-center h-full py-0.5 px-0.5 text-slate-500 hover:text-emerald-700 transition-all active:scale-95 group"
              title="Quay lại"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.4] group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-[9.5px] font-bold mt-0.5 leading-none truncate max-w-full text-center">Trở lại</span>
            </button>

            {/* 2. Trang chủ */}
            <button
              type="button"
              onClick={() => {
                handleUserInteract();
                setCurrentView('store');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`min-w-0 flex-1 flex flex-col items-center justify-center h-full py-0.5 px-0.5 transition-all active:scale-95 ${
                currentView === 'store' ? 'text-emerald-700 font-extrabold' : 'text-slate-500 hover:text-emerald-700'
              }`}
              title="Về tiệm hoa"
            >
              <Home className={`w-4.5 h-4.5 ${currentView === 'store' ? 'stroke-[2.5] text-emerald-700' : 'stroke-[2]'}`} />
              <span className={`text-[9.5px] mt-0.5 leading-none truncate max-w-full text-center ${currentView === 'store' ? 'font-black text-emerald-900' : 'font-bold'}`}>
                Trang chủ
              </span>
            </button>

            {/* 3. NÚT GIỎ HOA FAB TRUNG TÂM NỔI LÊN (SUPERMARKET ORANGE) */}
            <div className="min-w-0 flex-1 flex justify-center items-center h-full">
              <button
                type="button"
                onClick={() => {
                  handleUserInteract();
                  setIsCartOpen(true);
                }}
                className="w-13.5 h-13.5 -mt-5 shrink-0 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white border-2 border-white shadow-[0_8px_24px_rgba(249,115,22,0.52),inset_0_2px_3px_rgba(255,255,255,0.85)] flex items-center justify-center relative active:scale-90 transition-transform group"
                title="Giỏ hoa của bạn (Bấm để xem)"
              >
                <ShoppingCart className="w-6 h-6 text-white stroke-[2.2] group-hover:scale-110 transition-transform" />
                {totalCartCount > 0 ? (
                  <span className="absolute -top-1 -right-1 min-w-[19px] h-[19px] px-0.5 rounded-full bg-rose-600 text-white text-[9.5px] font-black flex items-center justify-center border-2 border-white shadow-md animate-bounce-subtle">
                    {totalCartCount > 99 ? '99+' : totalCartCount}
                  </span>
                ) : (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white" />
                )}
              </button>
            </div>

            {/* 4. Đơn hàng */}
            <button
              type="button"
              onClick={handleOrdersClick}
              className={`min-w-0 flex-1 flex flex-col items-center justify-center h-full py-0.5 px-0.5 transition-all active:scale-95 ${
                (currentView === 'customer' || currentView === 'admin') ? 'text-emerald-700 font-extrabold' : 'text-slate-500 hover:text-emerald-700'
              }`}
              title="Quản lý & Theo dõi đơn hàng"
            >
              <PackageCheck className="w-4.5 h-4.5 stroke-[2]" />
              <span className="text-[9.5px] font-bold mt-0.5 leading-none truncate max-w-full text-center">Đơn hàng</span>
            </button>

            {/* 5. Tài khoản / Quản trị (Chuyển đổi giao diện) */}
            <button
              type="button"
              onClick={handleAccountSwitchClick}
              className={`min-w-0 flex-1 flex flex-col items-center justify-center h-full py-0.5 px-0.5 transition-all active:scale-95 ${
                isAdmin
                  ? currentView === 'admin' ? 'text-purple-700 font-extrabold' : 'text-slate-600 hover:text-purple-700'
                  : currentView === 'customer' ? 'text-emerald-700 font-extrabold' : 'text-slate-500 hover:text-emerald-700'
              }`}
              title={isAdmin ? (currentView === 'admin' ? 'Chuyển sang Xem Web' : 'Vào Trang Quản Trị') : (currentView === 'customer' ? 'Chuyển sang Cửa Hàng' : 'Vào Trang Tài Khoản')}
            >
              {isAdmin ? (
                currentView === 'admin' ? (
                  <>
                    <Store className="w-4.5 h-4.5 stroke-[2.2] text-purple-700" />
                    <span className="text-[9.5px] font-bold mt-0.5 text-purple-900 leading-none truncate max-w-full text-center">Xem Web</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4.5 h-4.5 stroke-[2.2] text-purple-700" />
                    <span className="text-[9.5px] font-bold mt-0.5 text-purple-900 leading-none truncate max-w-full text-center">Quản trị</span>
                  </>
                )
              ) : currentView === 'customer' ? (
                <>
                  <Store className="w-4.5 h-4.5 stroke-[2.2] text-emerald-700" />
                  <span className="text-[9.5px] font-bold mt-0.5 text-emerald-900 leading-none truncate max-w-full text-center">Cửa hàng</span>
                </>
              ) : (
                <>
                  <User className="w-4.5 h-4.5 stroke-[2.2] text-emerald-700" />
                  <span className="text-[9.5px] font-bold mt-0.5 text-emerald-900 leading-none truncate max-w-full text-center">
                    {customer ? customer.fullName.split(' ').slice(-1)[0] : 'Tài khoản'}
                  </span>
                </>
              )}
            </button>
          </>
        ) : (
          // ==================== CHƯA ĐĂNG NHẬP (1 THANH CHÍNH 5 NÚT CÔNG KHAI) ====================
          <>
            {/* 1. Trang chủ */}
            <button
              type="button"
              onClick={() => {
                handleUserInteract();
                setCurrentView('store');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="min-w-0 flex-1 flex flex-col items-center justify-center h-full py-0.5 px-0.5 text-emerald-800 transition-all active:scale-95"
              title="Trang chủ tiệm hoa"
            >
              <Home className="w-4.5 h-4.5 stroke-[2.4] text-emerald-700" />
              <span className="text-[9.5px] font-bold mt-0.5 text-emerald-900 leading-none truncate max-w-full text-center">Trang chủ</span>
            </button>

            {/* 2. Danh mục mẫu hoa */}
            <button
              type="button"
              onClick={handleCatalogClick}
              className="min-w-0 flex-1 flex flex-col items-center justify-center h-full py-0.5 px-0.5 text-slate-500 hover:text-emerald-700 transition-all active:scale-95"
              title="Danh mục hoa tươi"
            >
              <Sparkles className="w-4.5 h-4.5 stroke-[2]" />
              <span className="text-[9.5px] font-bold mt-0.5 leading-none truncate max-w-full text-center">Danh mục</span>
            </button>

            {/* 3. NÚT GIỎ HOA FAB TRUNG TÂM NỔI LÊN (SUPERMARKET ORANGE) */}
            <div className="min-w-0 flex-1 flex justify-center items-center h-full">
              <button
                type="button"
                onClick={() => {
                  handleUserInteract();
                  setIsCartOpen(true);
                }}
                className="w-13.5 h-13.5 -mt-5 shrink-0 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white border-2 border-white shadow-[0_8px_24px_rgba(249,115,22,0.52),inset_0_2px_3px_rgba(255,255,255,0.85)] flex items-center justify-center relative active:scale-90 transition-transform group"
                title="Giỏ hoa của bạn (Bấm để xem)"
              >
                <ShoppingCart className="w-6 h-6 text-white stroke-[2.2] group-hover:scale-110 transition-transform" />
                {totalCartCount > 0 ? (
                  <span className="absolute -top-1 -right-1 min-w-[19px] h-[19px] px-0.5 rounded-full bg-rose-600 text-white text-[9.5px] font-black flex items-center justify-center border-2 border-white shadow-md animate-bounce-subtle">
                    {totalCartCount > 99 ? '99+' : totalCartCount}
                  </span>
                ) : (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white" />
                )}
              </button>
            </div>

            {/* 4. Tra cứu đơn hàng */}
            <button
              type="button"
              onClick={handleOrderLookupClick}
              className="min-w-0 flex-1 flex flex-col items-center justify-center h-full py-0.5 px-0.5 text-slate-500 hover:text-emerald-700 transition-all active:scale-95"
              title="Tra cứu tình trạng đơn hàng"
            >
              <FileSearch className="w-4.5 h-4.5 stroke-[2]" />
              <span className="text-[9.5px] font-bold mt-0.5 leading-none truncate max-w-full text-center">Tra cứu</span>
            </button>

            {/* 5. Đăng nhập */}
            <button
              type="button"
              onClick={() => {
                handleUserInteract();
                setAuthModalMode('customer');
                setIsAuthModalOpen(true);
              }}
              className="min-w-0 flex-1 flex flex-col items-center justify-center h-full py-0.5 px-0.5 text-slate-500 hover:text-emerald-700 transition-all active:scale-95"
              title="Đăng nhập tài khoản"
            >
              <User className="w-4.5 h-4.5 stroke-[2]" />
              <span className="text-[9.5px] font-bold mt-0.5 leading-none truncate max-w-full text-center">Đăng nhập</span>
            </button>
          </>
        )}
      </nav>
    </>
  );
};
