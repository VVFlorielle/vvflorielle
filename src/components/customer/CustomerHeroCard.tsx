import React from 'react';
import { CustomerUser, SavedAddress } from '../../types';
import {
  User,
  Award,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  Edit2,
  Cake
} from 'lucide-react';

interface CustomerHeroCardProps {
  customer: CustomerUser;
  defaultSavedAddress?: SavedAddress;
  onOpenEditProfile: () => void;
  onOpenAddressBook: () => void;
  onOpenChangePass: () => void;
  onStartOtpVerification: () => void;
  onOpenChangeIdentity: (mode: 'phone' | 'email') => void;
  onSwitchTab: (tab: 'orders' | 'rewards') => void;
  activeTab: 'orders' | 'rewards';
}

export const CustomerHeroCard: React.FC<CustomerHeroCardProps> = ({
  customer,
  defaultSavedAddress,
  onOpenEditProfile,
  onOpenAddressBook,
  onOpenChangePass,
  onStartOtpVerification,
  onOpenChangeIdentity,
  onSwitchTab,
  activeTab
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="glass-panel p-6 sm:p-7 rounded-[30px] shadow-sm relative overflow-hidden border border-emerald-200/80 bg-gradient-to-br from-white/95 via-emerald-50/40 to-teal-50/50">
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        {/* Column A: Customer Identity & Details (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-3xl bg-gradient-to-tr from-emerald-700 via-teal-600 to-emerald-500 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-emerald-700/20 shrink-0 border-2 border-white/80">
              {customer.fullName.charAt(0)}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {customer.fullName}
                </h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs">
                  {customer.tier}
                </span>
                {customer.isVerified ? (
                  <span className="text-[11px] font-bold text-emerald-700 bg-white/90 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200 shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Hội viên 100% Điểm</span>
                  </span>
                ) : (
                  <button
                    onClick={onStartOtpVerification}
                    className="text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-amber-300 transition-colors cursor-pointer"
                    title="Xác thực OTP số điện thoại để mở khóa 100% quyền lợi tích điểm"
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Xác thực OTP (Nhận 100% điểm)</span>
                  </button>
                )}
              </div>

              {/* Contact and address metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 mt-2.5 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Phone className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span className="truncate">{customer.phone}</span>
                  <button
                    onClick={() => onOpenChangeIdentity('phone')}
                    className="text-[10px] text-emerald-700 hover:underline shrink-0 ml-1 cursor-pointer"
                  >
                    [Đổi]
                  </button>
                </div>

                <div className="flex items-center gap-1.5 min-w-0">
                  <Mail className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span className="truncate">{customer.email || 'Chưa liên kết Gmail'}</span>
                  <button
                    onClick={() => onOpenChangeIdentity('email')}
                    className="text-[10px] text-emerald-700 hover:underline shrink-0 ml-1 cursor-pointer"
                  >
                    [{customer.email ? 'Đổi' : 'Thêm'}]
                  </button>
                </div>

                <div className="flex items-center gap-1.5 min-w-0">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span className="truncate">
                    {defaultSavedAddress
                      ? `${defaultSavedAddress.name}: ${defaultSavedAddress.recipientAddress}`
                      : customer.address || 'Chưa thiết lập địa chỉ nhận hoa'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 min-w-0">
                  <Cake className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>
                    {customer.birthday ? `Sinh nhật: ${customer.birthday}` : 'Chưa cập nhật sinh nhật'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons row */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <button
              onClick={onOpenEditProfile}
              className="px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-700 hover:text-emerald-800 text-xs font-semibold border border-slate-200/80 shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Chỉnh Sửa Hồ Sơ</span>
            </button>

            <button
              onClick={onOpenAddressBook}
              className="px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-700 hover:text-emerald-800 text-xs font-semibold border border-slate-200/80 shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sổ Địa Chỉ ({customer.savedAddresses?.length || 0}/3)</span>
            </button>

            <button
              onClick={onOpenChangePass}
              className="px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-700 hover:text-emerald-800 text-xs font-semibold border border-slate-200/80 shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
              <span>Đổi Mật Khẩu</span>
            </button>
          </div>
        </div>

        {/* Column B: Loyalty Points & Total Spent (5 cols) */}
        <div className="lg:col-span-5 bg-white/80 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-emerald-200/70 shadow-xs flex flex-col justify-between gap-4">
          <div className="grid grid-cols-2 gap-3 divide-x divide-slate-100">
            <div className="pr-2">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Điểm Thưởng Tích Luỹ</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight">
                {customer.points.toLocaleString('vi-VN')}
                <span className="text-xs font-bold text-slate-500 ml-1">điểm</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">100 điểm = 10.000₫ freeship</p>
            </div>

            <div className="pl-3">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
                <Award className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tổng Chi Tiêu Hoa</span>
              </div>
              <div className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                {formatPrice(customer.totalSpent)}
              </div>
              <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                Hạng hiện tại: {customer.tier}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
            <span className="text-[11px] text-slate-500">Đổi điểm lấy mã Freeship 10k - 30k</span>
            <button
              onClick={() => onSwitchTab('rewards')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'rewards'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
              }`}
            >
              Đổi Mã Ngay →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
