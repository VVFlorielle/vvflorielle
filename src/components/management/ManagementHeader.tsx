import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  ShieldCheck,
  LogOut
} from 'lucide-react';

interface ManagementHeaderProps {
  role: 'admin' | 'owner';
  onNavigateTab?: (tab: string) => void;
}

export const ManagementHeader: React.FC<ManagementHeaderProps> = ({ role, onNavigateTab }) => {
  const {
    setCurrentView,
    logoutAdmin,
    orders
  } = useStore();

  const isOwner = role === 'owner';
  const pendingDepositOrders = orders.filter(
    (o) => !o.isDepositPaid && o.status !== 'CANCELLED'
  ).length;

  const [isScrolling, setIsScrolling] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let ticking = false;

    const handleScrollActivity = () => {
      setIsScrolling(true);
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsScrolling(false);
      }, 260);

      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 15);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScrollActivity, { passive: true });
    window.addEventListener('touchmove', handleScrollActivity, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScrollActivity);
      window.removeEventListener('touchmove', handleScrollActivity);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const handleReturnToStore = () => {
    setCurrentView('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    logoutAdmin();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`w-full px-2 sm:px-6 select-none transition-all duration-300 ease-out ${
        isScrolling
          ? 'opacity-40 sm:opacity-50 scale-[0.985] backdrop-blur-xs'
          : 'opacity-100 scale-100 backdrop-blur-2xl'
      } hover:opacity-100 active:opacity-100 focus-within:opacity-100`}
    >
      {/* 
        Header 3 khối dạng Popup nổi:
        - Bố cục relative, Logo căn giữa tuyệt đối 100% bằng absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
        - Khi lướt/vuốt trang: vẫn nổi trên đầu nhưng ẩn mờ nhẹ (opacity-40-50), nhả tay dừng lướt tự động hiện rõ nét 100%
        - Bên trái: Khối thông báo đơn cọc chờ duyệt dạng pill nổi
        - Ở giữa: Khung bóng kính ôm Logo căn giữa tuyệt đối, không lệch dù trái/phải lệch size
        - Bên phải: Khối quyền Admin/Chủ quán và nút Đăng xuất
      */}
      <div className="max-w-7xl mx-auto relative flex items-center justify-between w-full h-11 min-[375px]:h-12 sm:h-14">
        {/* === LEFT: KHỐI THÔNG BÁO ĐƠN CỌC CHỜ DUYỆT (Z-10) === */}
        <div className="flex items-center justify-start shrink-0 z-10 pointer-events-auto">
          {pendingDepositOrders > 0 ? (
            <button
              type="button"
              onClick={() => onNavigateTab?.('orders')}
              className="inline-flex items-center gap-1 min-[375px]:gap-1.5 px-2 min-[375px]:px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-amber-50/95 hover:bg-amber-100 border border-amber-300/90 text-amber-900 text-[10px] min-[375px]:text-[11px] sm:text-xs font-bold shadow-sm shadow-amber-500/15 animate-pulse cursor-pointer transition-all active:scale-95 shrink-0"
              title="Xem danh sách đơn cọc cần duyệt"
            >
              <span className="w-1.5 h-1.5 min-[375px]:w-2 min-[375px]:h-2 rounded-full bg-amber-500 shrink-0" />
              <span className="whitespace-nowrap font-bold">
                {pendingDepositOrders} đơn<span className="hidden sm:inline"> cọc chờ duyệt</span>
              </span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-1 min-[375px]:gap-1.5 px-2 min-[375px]:px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-emerald-50/90 text-emerald-800 border border-emerald-200/90 text-[10px] min-[375px]:text-[11px] sm:text-xs font-semibold shadow-xs shrink-0">
              <span className="w-1.5 h-1.5 min-[375px]:w-2 min-[375px]:h-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="whitespace-nowrap font-medium">
                0 đơn<span className="hidden sm:inline"> chờ duyệt</span>
              </span>
            </div>
          )}
        </div>

        {/* === CENTER: LOGO CĂN CHÍNH GIỮA TUYỆT ĐỐI MÀN HÌNH (Z-20) === */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto">
          <button
            type="button"
            onClick={handleReturnToStore}
            className="h-[44px] min-[375px]:h-[50px] sm:h-[66px] w-[110px] min-[375px]:w-[126px] sm:w-[168px] p-[1px] rounded-full bg-white/95 backdrop-blur-2xl border border-white/90 shadow-[0_4px_20px_rgba(5,150,105,0.18)] hover:shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer select-none group overflow-hidden"
            title="V&V Florielle - Bấm để chuyển nhanh ra xem giao diện cửa hàng"
          >
            <img
              src="/logo-vvflorielle-horizontal.png"
              alt="V&V Florielle"
              className="h-full w-full object-contain filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.1)] p-[1px]"
            />
          </button>
        </div>

        {/* === RIGHT: GỘP KHỐI ADMIN & ĐĂNG XUẤT THÀNH 1 KHỐI DUY NHẤT CÂN ĐỐI (Z-10) === */}
        <div className="flex items-center justify-end shrink-0 z-10 pointer-events-auto">
          <div
            className={`inline-flex items-center gap-1 min-[375px]:gap-1.5 pl-2 min-[375px]:pl-2.5 pr-1 min-[375px]:pr-1.5 py-0.5 min-[375px]:py-1 rounded-full text-[10px] min-[375px]:text-[11px] sm:text-xs font-bold border shadow-sm transition-all shrink-0 ${
              isOwner
                ? 'bg-emerald-50/95 text-emerald-900 border-emerald-300/90 shadow-emerald-500/15'
                : 'bg-purple-50/95 text-purple-900 border-purple-300/90 shadow-purple-500/15'
            }`}
          >
            {/* Tên quyền: Admin hoặc Chủ Quán */}
            <div className="flex items-center gap-1 whitespace-nowrap">
              <ShieldCheck className={`w-3 h-3 min-[375px]:w-3.5 min-[375px]:h-3.5 ${isOwner ? 'text-emerald-700' : 'text-purple-700'} shrink-0`} />
              <span>{isOwner ? 'Chủ Quán' : 'Admin'}</span>
            </div>

            {/* Dải phân cách dọc */}
            <span className={`w-px h-2.5 min-[375px]:h-3 ${isOwner ? 'bg-emerald-300/80' : 'bg-purple-300/80'} shrink-0`} />

            {/* Nút Đăng Xuất tích hợp gọn gàng trong khối */}
            <button
              type="button"
              onClick={handleLogout}
              className="p-1 rounded-full hover:bg-rose-100 text-rose-600 hover:text-rose-800 transition-colors cursor-pointer active:scale-95 shrink-0 flex items-center justify-center"
              title="Đăng xuất khỏi phiên quản trị"
            >
              <LogOut className="w-3 h-3 min-[375px]:w-3.5 min-[375px]:h-3.5 shrink-0" />
              <span className="sr-only">Đăng Xuất</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
