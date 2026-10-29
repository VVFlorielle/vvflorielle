import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  Home,
  Sparkles,
  ShoppingCart,
  Palette,
  User,
  Package,
  Gift,
  UserCheck,
  ShoppingBag,
  Tag,
  PlusCircle,
  LogOut,
  Store
} from 'lucide-react';

interface MobileBottomDockProps {
  onOpenCategories?: () => void;
}

export const MobileBottomDock: React.FC<MobileBottomDockProps> = ({ onOpenCategories }) => {
  const {
    currentView,
    setCurrentView,
    cart,
    setIsCartOpen,
    customer,
    isAdmin,
    logoutAdmin,
    setIsAuthModalOpen,
    setAuthModalMode
  } = useStore();

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleAccountClick = () => {
    if (customer) {
      setCurrentView('customer');
    } else {
      setAuthModalMode('customer');
      setIsAuthModalOpen(true);
    }
  };

  const handleCustomBuilderClick = () => {
    setCurrentView('store');
    setTimeout(() => {
      const el = document.getElementById('custom-builder-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleCatalogClick = () => {
    if (onOpenCategories) {
      onOpenCategories();
    } else {
      setCurrentView('store');
      setTimeout(() => {
        const el = document.getElementById('categories-section') || document.getElementById('featured-flowers');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  // ==========================================
  // VIEW 1: STOREFRONT / GIAO DIỆN NGOÀI (5 NÚT)
  // ==========================================
  if (currentView === 'store') {
    return (
      <nav
        className="mobile-bottom-dock"
        aria-label="Thanh điều hướng Mobile Tiệm Hoa"
      >
        {/* 1. Trang Chủ */}
        <button
          onClick={() => {
            setCurrentView('store');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="min-w-0 flex-1 flex flex-col items-center justify-center h-full py-0.5 px-0.5 text-emerald-800 transition-all active:scale-95"
          title="Trang chủ tiệm hoa"
        >
          <Home className="w-4.5 h-4.5 stroke-[2.4] text-emerald-700" />
          <span className="text-[9px] sm:text-[9.5px] font-bold mt-0.5 text-emerald-900 leading-none truncate max-w-full text-center">Trang chủ</span>
        </button>

        {/* 2. Mẫu Hoa */}
        <button
          onClick={handleCatalogClick}
          className="min-w-0 flex-1 flex flex-col items-center justify-center h-full py-0.5 px-0.5 text-slate-500 hover:text-emerald-700 transition-all active:scale-95"
          title="Danh mục hoa tươi"
        >
          <Sparkles className="w-4.5 h-4.5 stroke-[2]" />
          <span className="text-[9px] sm:text-[9.5px] font-bold mt-0.5 leading-none truncate max-w-full text-center">Mẫu hoa</span>
        </button>

        {/* 3. NÚT GIỎ HOA TRUNG TÂM TO HƠN HẲN & NHÔ NỔI LÊN (SUPERMARKET ORANGE) */}
        <div className="min-w-0 flex-1 flex justify-center items-center h-full">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-13 h-13 -mt-4.5 shrink-0 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white border-2 border-white shadow-[0_8px_24px_rgba(249,115,22,0.52),inset_0_2px_3px_rgba(255,255,255,0.85)] flex items-center justify-center relative active:scale-90 transition-transform group"
            title="Giỏ hoa của bạn"
          >
            <ShoppingCart className="w-6 h-6 text-white stroke-[2.2] group-hover:scale-110 transition-transform" />
            {totalCartCount > 0 ? (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-0.5 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center border-2 border-white shadow-md animate-bounce-subtle">
                {totalCartCount}
              </span>
            ) : (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white" />
            )}
          </button>
        </div>

        {/* 4. Tự Cắm Hoa */}
        <button
          onClick={handleCustomBuilderClick}
          className="min-w-0 flex-1 flex flex-col items-center justify-center h-full py-0.5 px-0.5 text-slate-500 hover:text-emerald-700 transition-all active:scale-95"
          title="Tự thiết kế & phối hoa"
        >
          <Palette className="w-4.5 h-4.5 stroke-[2]" />
          <span className="text-[9px] sm:text-[9.5px] font-bold mt-0.5 leading-none truncate max-w-full text-center">Tự cắm</span>
        </button>

        {/* 5. Tài Khoản / Hội Viên */}
        <button
          onClick={handleAccountClick}
          className="min-w-0 flex-1 flex flex-col items-center justify-center h-full py-0.5 px-0.5 text-slate-500 hover:text-emerald-700 transition-all active:scale-95"
          title="Tài khoản & điểm tích lũy"
        >
          <User className="w-4.5 h-4.5 stroke-[2]" />
          <span className="text-[9px] sm:text-[9.5px] font-bold mt-0.5 leading-none truncate max-w-full text-center">
            {customer ? customer.fullName.split(' ').slice(-1)[0] : 'Tài khoản'}
          </span>
        </button>
      </nav>
    );
  }

  // ==========================================
  // VIEW 2: TRANG QUẢN LÝ KHÁCH HÀNG (CUSTOMER PORTAL)
  // ==========================================
  if (currentView === 'customer') {
    return (
      <nav
        className="mobile-bottom-dock"
        aria-label="Thanh điều hướng Khách hàng"
      >
        {/* 1. Về Cửa Hàng */}
        <button
          onClick={() => setCurrentView('store')}
          className="min-w-0 flex-1 flex flex-col items-center justify-center h-full py-0.5 px-0.5 text-slate-500 hover:text-emerald-700 transition-all active:scale-95"
          title="Quay lại tiệm hoa"
        >
          <Store className="w-4.5 h-4.5 stroke-[2]" />
          <span className="text-[9px] sm:text-[9.5px] font-bold mt-0.5 leading-none truncate max-w-full text-center">Cửa hàng</span>
        </button>

        {/* 2. Đơn Hoa */}
        <button
          onClick={() => {
            const el = document.getElementById('customer-orders-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="min-w-0 flex-1 flex flex-col items-center justify-center h-full py-0.5 px-0.5 text-emerald-800 transition-all active:scale-95"
          title="Lịch sử đơn hoa"
        >
          <Package className="w-4.5 h-4.5 stroke-[2.4] text-emerald-700" />
          <span className="text-[9px] sm:text-[9.5px] font-bold mt-0.5 text-emerald-900 leading-none truncate max-w-full text-center">Đơn hoa</span>
        </button>

        {/* 3. NÚT GIỎ HOA TRUNG TÂM TO HƠN HẲN & NHÔ NỔI LÊN */}
        <div className="min-w-0 flex-1 flex justify-center items-center h-full">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-13 h-13 -mt-4.5 shrink-0 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white border-2 border-white shadow-[0_8px_24px_rgba(249,115,22,0.52),inset_0_2px_3px_rgba(255,255,255,0.85)] flex items-center justify-center relative active:scale-90 transition-transform group"
            title="Giỏ hoa của bạn"
          >
            <ShoppingCart className="w-6 h-6 text-white stroke-[2.2] group-hover:scale-110 transition-transform" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-0.5 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center border-2 border-white shadow-md animate-bounce-subtle">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>

        {/* 4. Ví Ưu Đãi / Điểm */}
        <button
          onClick={() => {
            const el = document.getElementById('customer-points-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="min-w-0 flex-1 flex flex-col items-center justify-center h-full py-0.5 px-0.5 text-slate-500 hover:text-emerald-700 transition-all active:scale-95"
          title="Ví điểm & Voucher"
        >
          <Gift className="w-4.5 h-4.5 stroke-[2]" />
          <span className="text-[9px] sm:text-[9.5px] font-bold mt-0.5 leading-none truncate max-w-full text-center">Voucher</span>
        </button>

        {/* 5. Hồ Sơ Cá Nhân */}
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="min-w-0 flex-1 flex flex-col items-center justify-center h-full py-0.5 px-0.5 text-slate-500 hover:text-emerald-700 transition-all active:scale-95"
          title="Hồ sơ & Sổ địa chỉ"
        >
          <UserCheck className="w-4.5 h-4.5 stroke-[2]" />
          <span className="text-[9px] sm:text-[9.5px] font-bold mt-0.5 leading-none truncate max-w-full text-center">Hồ sơ</span>
        </button>
      </nav>
    );
  }

  // ==========================================
  // VIEW 3: TRANG QUẢN TRỊ ADMIN (ADMIN PORTAL)
  // ==========================================
  return (
    <nav
      className="mobile-bottom-dock"
      aria-label="Thanh điều hướng Quản trị"
    >
      {/* 1. Xem Web Cửa Hàng */}
      <button
        onClick={() => setCurrentView('store')}
        className="min-w-0 flex-1 flex flex-col items-center justify-center h-full py-0.5 px-0.5 text-slate-500 hover:text-purple-700 transition-all active:scale-95"
        title="Xem trang bán hoa ngoài"
      >
        <Store className="w-4.5 h-4.5 stroke-[2]" />
        <span className="text-[9px] sm:text-[9.5px] font-bold mt-0.5 leading-none truncate max-w-full text-center">Xem Web</span>
      </button>

      {/* 2. Quản Lý Đơn Hàng */}
      <button
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="min-w-0 flex-1 flex flex-col items-center justify-center h-full py-0.5 px-0.5 text-purple-900 transition-all active:scale-95"
        title="Quản lý đơn hàng tiệm"
      >
        <ShoppingBag className="w-4.5 h-4.5 stroke-[2.4] text-purple-700" />
        <span className="text-[9px] sm:text-[9.5px] font-bold mt-0.5 text-purple-900 leading-none truncate max-w-full text-center">Đơn hàng</span>
      </button>

      {/* 3. NÚT TRUNG TÂM NỔI LÊN (TẠO ĐƠN / CẮM HOA) */}
      <div className="min-w-0 flex-1 flex justify-center items-center h-full">
        <button
          onClick={() => {
            const btn = document.getElementById('admin-create-order-btn');
            if (btn) btn.click();
            else {
              setCurrentView('store');
              setTimeout(() => {
                const el = document.getElementById('custom-builder-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }
          }}
          className="w-13 h-13 -mt-4.5 shrink-0 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white border-2 border-white shadow-[0_8px_24px_rgba(147,51,234,0.48),inset_0_2px_3px_rgba(255,255,255,0.85)] flex items-center justify-center relative active:scale-90 transition-transform group"
          title="Tạo đơn hoa / Cắm hoa mới"
        >
          <PlusCircle className="w-6 h-6 text-white stroke-[2.2] group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* 4. Quản Lý Kho & Giá Hoa */}
      <button
        onClick={() => {
          const tab = document.getElementById('admin-tab-pricing');
          if (tab) tab.click();
        }}
        className="min-w-0 flex-1 flex flex-col items-center justify-center h-full py-0.5 px-0.5 text-slate-500 hover:text-purple-700 transition-all active:scale-95"
        title="Kho & Bảng giá hoa"
      >
        <Tag className="w-4.5 h-4.5 stroke-[2]" />
        <span className="text-[9px] sm:text-[9.5px] font-bold mt-0.5 leading-none truncate max-w-full text-center">Kho & Giá</span>
      </button>

      {/* 5. Thoát Quản Trị */}
      <button
        onClick={logoutAdmin}
        className="min-w-0 flex-1 flex flex-col items-center justify-center h-full py-0.5 px-0.5 text-slate-500 hover:text-rose-600 transition-all active:scale-95"
        title="Thoát quyền Quản trị"
      >
        <LogOut className="w-4.5 h-4.5 stroke-[2]" />
        <span className="text-[9px] sm:text-[9.5px] font-bold mt-0.5 leading-none truncate max-w-full text-center">Thoát</span>
      </button>
    </nav>
  );
};
