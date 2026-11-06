import React from 'react';
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

  const handleReturnToStore = () => {
    setCurrentView('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    logoutAdmin();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="w-full pt-2 sm:pt-3 pb-1.5 px-2 sm:px-6 select-none transition-all">
      {/* 
        Header 3 khối căn giữa đối xứng:
        - Bên trái: Khối thông báo đơn cọc chờ duyệt (khoảng ~88px)
        - Ở giữa: Khung bóng kính ôm Logo to hơn, cách viền vừa phải (~2-3px), căn giữa tuyệt đối
        - Bên phải: Gộp khối quyền Admin và nút Đăng Xuất thành 1 khối duy nhất, dài bằng khối bên trái (~90px)
        - Luôn có khoảng cách đệm an toàn 2 bên Logo, tuyệt đối không chạm dính trên mọi cỡ màn hình
      */}
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-1 min-[375px]:gap-2 sm:gap-4 relative w-full">
        {/* === LEFT: KHỐI THÔNG BÁO ĐƠN CỌC CHỜ DUYỆT === */}
        <div className="flex items-center justify-start shrink-0">
          {pendingDepositOrders > 0 ? (
            <button
              type="button"
              onClick={() => onNavigateTab?.('orders')}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full bg-amber-50/95 hover:bg-amber-100 border border-amber-300 text-amber-900 text-[11px] sm:text-xs font-bold shadow-2xs animate-pulse cursor-pointer transition-all active:scale-95 shrink-0"
              title="Xem danh sách đơn cọc cần duyệt"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
              <span className="whitespace-nowrap font-bold">
                {pendingDepositOrders} đơn cọc<span className="hidden sm:inline"> chờ duyệt</span>
              </span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full bg-emerald-50/90 text-emerald-800 border border-emerald-200/80 text-[11px] sm:text-xs font-semibold shadow-2xs shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="whitespace-nowrap font-medium">
                0 đơn<span className="hidden sm:inline"> chờ duyệt</span>
              </span>
            </div>
          )}
        </div>

        {/* === CENTER: KHỐI LOGO TO CHUẨN TRANG CHỦ, VIỀN CÁCH KHUNG 1-2PX, CĂN GIỮA TUYỆT ĐỐI === */}
        <div className="flex items-center justify-center shrink-0 mx-auto px-1 min-[375px]:px-2">
          <div
            onClick={handleReturnToStore}
            className="h-[60px] min-[375px]:h-[64px] sm:h-[72px] w-[142px] min-[375px]:w-[148px] sm:w-[175px] p-[1.5px] rounded-full bg-white/94 backdrop-blur-2xl border border-white/90 shadow-[0_4px_24px_rgba(5,150,105,0.15)] hover:shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer select-none group overflow-hidden"
            title="V&V Florielle - Bấm để chuyển nhanh ra xem giao diện cửa hàng"
          >
            <img
              src="/logo-vvflorielle-horizontal.png"
              alt="V&V Florielle"
              className="h-full w-full object-contain filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.1)] p-[1px]"
            />
          </div>
        </div>

        {/* === RIGHT: GỘP KHỐI ADMIN & ĐĂNG XUẤT THÀNH 1 KHỐI DUY NHẤT CÂN ĐỐI VỚI KHỐI TRÁI === */}
        <div className="flex items-center justify-end shrink-0">
          <div
            className={`inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full text-[11px] sm:text-xs font-bold border shadow-2xs transition-all shrink-0 ${
              isOwner
                ? 'bg-emerald-50/95 text-emerald-900 border-emerald-300/90'
                : 'bg-purple-50/95 text-purple-900 border-purple-300/90'
            }`}
          >
            {/* Tên quyền: Admin hoặc Chủ Quán */}
            <div className="flex items-center gap-1 whitespace-nowrap">
              <ShieldCheck className={`w-3.5 h-3.5 ${isOwner ? 'text-emerald-700' : 'text-purple-700'} shrink-0`} />
              <span>{isOwner ? 'Chủ Quán' : 'Admin'}</span>
            </div>

            {/* Dải phân cách dọc */}
            <span className={`w-px h-3 ${isOwner ? 'bg-emerald-300/80' : 'bg-purple-300/80'} shrink-0`} />

            {/* Nút Đăng Xuất tích hợp gọn gàng trong khối */}
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
        </div>
      </div>
    </header>
  );
};
