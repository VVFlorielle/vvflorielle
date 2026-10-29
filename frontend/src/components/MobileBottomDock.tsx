import React from 'react';
import { useStore } from '../context/StoreContext';
import { Home, Grid, ShoppingCart, Package, User, ShieldCheck } from 'lucide-react';

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

  const handleOrdersClick = () => {
    if (customer) {
      setCurrentView('customer');
    } else {
      setAuthModalMode('customer');
      setIsAuthModalOpen(true);
    }
  };

  const handleCategoriesClick = () => {
    if (onOpenCategories) {
      onOpenCategories();
    } else {
      setCurrentView('store');
      const el = document.getElementById('categories-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/75 backdrop-blur-2xl border-t border-white/85 shadow-[0_-8px_32px_rgba(15,23,42,0.1)] md:hidden py-1.5 px-3">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {/* 1. STORE / HOME */}
        <button
          onClick={() => setCurrentView('store')}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all ${
            currentView === 'store'
              ? 'bg-emerald-100/70 text-emerald-800 font-bold shadow-sm border border-emerald-200/50 scale-105'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className={`w-5 h-5 ${currentView === 'store' ? 'stroke-[2.4] text-emerald-700' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-0.5">Cửa hàng</span>
        </button>

        {/* 2. CATEGORIES */}
        <button
          onClick={handleCategoriesClick}
          className="flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl text-slate-500 hover:text-slate-800 transition-all"
        >
          <Grid className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] mt-0.5">Danh mục</span>
        </button>

        {/* 3. CART (FLOATING BADGE) */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl text-orange-600 hover:text-orange-700 transition-all"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 stroke-[2]" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-rose-600 text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-pulse">
                {totalCartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 font-bold">Giỏ hàng</span>
        </button>

        {/* 4. ORDERS */}
        <button
          onClick={handleOrdersClick}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all ${
            currentView === 'customer'
              ? 'bg-emerald-100/70 text-emerald-800 font-bold shadow-sm border border-emerald-200/50 scale-105'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className={`w-5 h-5 ${currentView === 'customer' ? 'stroke-[2.4] text-emerald-700' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-0.5">Đơn hoa</span>
        </button>

        {/* 5. ACCOUNT / MEMBER */}
        <button
          onClick={handleAccountClick}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all ${
            currentView === 'customer'
              ? 'text-emerald-700 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className={`w-5 h-5 ${customer ? 'text-emerald-600' : ''} stroke-[1.8]`} />
          <span className="text-[10px] mt-0.5">
            {customer ? customer.fullName.split(' ').slice(-1)[0] : 'Tài khoản'}
          </span>
        </button>

        {/* 6. ADMIN PILL (IF AUTHENTICATED) */}
        {isAdmin && (
          <button
            onClick={() => setCurrentView('admin')}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all ${
              currentView === 'admin'
                ? 'bg-purple-100 text-purple-900 font-bold shadow-sm border border-purple-200 scale-105'
                : 'text-purple-600 hover:text-purple-800'
            }`}
          >
            <ShieldCheck className="w-5 h-5 stroke-[2]" />
            <span className="text-[10px] mt-0.5">Quản trị</span>
          </button>
        )}
      </div>
    </nav>
  );
};
