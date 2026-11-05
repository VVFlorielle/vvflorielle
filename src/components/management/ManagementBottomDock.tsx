import React from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Flower2,
  Users,
  Gift,
  Settings,
  ShieldCheck,
  Store,
  LogOut,
  Palette
} from 'lucide-react';

export interface ManagementBottomDockProps {
  role: 'admin' | 'owner';
  activeTab: string;
  onSelectTab: (tab: any) => void;
  pendingOrdersCount?: number;
  productsCount?: number;
  onReturnToStore: () => void;
  onLogout: () => void;
}

export const ManagementBottomDock: React.FC<ManagementBottomDockProps> = ({
  role,
  activeTab,
  onSelectTab,
  pendingOrdersCount = 0,
  productsCount = 0,
  onReturnToStore,
  onLogout
}) => {
  const isOwner = role === 'owner';

  const dockItems = [
    {
      id: 'dashboard',
      label: 'Tổng Quan',
      icon: LayoutDashboard,
      badge: undefined
    },
    {
      id: 'orders',
      label: 'Đơn Hàng',
      icon: ShoppingBag,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
      badgeColor: 'bg-amber-500 text-white'
    },
    {
      id: 'products',
      label: 'Kho Mẫu Hoa',
      icon: Flower2,
      badge: productsCount > 0 ? productsCount : undefined,
      badgeColor: 'bg-emerald-600 text-white'
    },
    {
      id: 'customers',
      label: 'Khách Hàng',
      icon: Users,
      badge: undefined
    },
    {
      id: 'vouchers',
      label: 'Voucher',
      icon: Gift,
      badge: undefined
    },
    ...(isOwner
      ? [
          {
            id: 'settings',
            label: 'Cấu Hình Tiệm',
            icon: Settings,
            badge: undefined
          }
        ]
      : [
          {
            id: 'cms',
            label: 'CMS Liveview',
            icon: Palette,
            badge: undefined
          },
          {
            id: 'settings',
            label: 'Cài Đặt',
            icon: Settings,
            badge: undefined
          }
        ])
  ];

  return (
    <div className="fixed bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-50 max-w-[96vw] select-none pointer-events-auto">
      <nav
        className="flex items-center gap-1 sm:gap-1.5 p-1.5 sm:p-2 rounded-full bg-white/92 backdrop-blur-2xl border border-emerald-200/90 shadow-[0_12px_40px_-8px_rgba(5,150,105,0.22),0_4px_16px_rgba(0,0,0,0.06)] ring-1 ring-emerald-500/10"
        aria-label="Thanh điều hướng quản trị"
      >
        {dockItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`relative flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-700 to-teal-700 text-white shadow-md shadow-emerald-700/25 scale-105 ring-2 ring-emerald-400/40'
                  : 'text-slate-600 hover:text-emerald-800 hover:bg-emerald-50/80 active:scale-95'
              }`}
              title={item.label}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="hidden md:inline whitespace-nowrap">{item.label}</span>

              {item.badge !== undefined && (
                <span
                  className={`absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-black flex items-center justify-center shadow-xs border border-white ${
                    item.badgeColor || 'bg-rose-500 text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Divider */}
        <div className="h-5 w-px bg-slate-200 mx-0.5" />

        {/* Storefront Quick View */}
        <button
          onClick={onReturnToStore}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full text-xs font-bold text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 transition-colors cursor-pointer"
          title="Xem cửa hàng khách hàng"
        >
          <Store className="w-4 h-4 shrink-0 text-emerald-700" />
          <span className="hidden lg:inline whitespace-nowrap">Xem Shop</span>
        </button>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-full text-xs font-bold text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          title="Đăng xuất"
        >
          <LogOut className="w-4 h-4 shrink-0" />
        </button>
      </nav>
    </div>
  );
};
