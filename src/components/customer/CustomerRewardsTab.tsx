import React from 'react';
import { CustomerUser, PromotionItem } from '../../types';
import { Gift, ShieldAlert, Sparkles, Truck, Tag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface CustomerRewardsTabProps {
  customer: CustomerUser;
  redeemVoucherWithPoints: (promoId: string) => void;
  onRequestHighValueOtp?: (promoId: string) => void;
  formatPrice: (price: number) => string;
}

export const CustomerRewardsTab: React.FC<CustomerRewardsTabProps> = ({
  customer,
  redeemVoucherWithPoints,
  onRequestHighValueOtp,
  formatPrice
}) => {
  const { promotions } = useStore();

  // Filter all promotions configured for points redemption
  const loyaltyPromos = promotions.filter(
    (p) => p.pointsToRedeem && p.pointsToRedeem > 0 && p.isActive !== false
  );

  const shippingRewards = loyaltyPromos.filter(
    (p) => p.voucherScope === 'SHIPPING' || p.discountType === 'FREESHIP'
  );

  const flowerRewards = loyaltyPromos.filter(
    (p) => p.voucherScope === 'FLOWER' || (!p.voucherScope && p.discountType !== 'FREESHIP')
  );

  const handleRedeemClick = (item: PromotionItem) => {
    const requiredPoints = item.pointsToRedeem || 0;
    if (customer.points < requiredPoints) return;

    if (requiredPoints >= 5000 && onRequestHighValueOtp) {
      onRequestHighValueOtp(item.id);
    } else {
      redeemVoucherWithPoints(item.id);
    }
  };

  const renderRewardCard = (item: PromotionItem) => {
    const requiredPoints = item.pointsToRedeem || 0;
    const canAfford = customer.points >= requiredPoints;
    const isHighValue = requiredPoints >= 5000;

    return (
      <div
        key={item.id}
        className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
          canAfford
            ? isHighValue
              ? 'bg-gradient-to-br from-amber-50/90 via-white to-amber-100/50 border-amber-300 shadow-md ring-1 ring-amber-400/30'
              : 'bg-gradient-to-br from-emerald-50/80 to-white border-emerald-300 shadow-sm'
            : 'bg-slate-50/70 border-slate-200/60 opacity-80'
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
            <span
              className={`font-mono font-bold text-xs px-2 py-0.5 rounded-md border ${
                isHighValue
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'text-emerald-800 bg-emerald-100/90 border-emerald-200'
              }`}
            >
              {item.code}
            </span>
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              {requiredPoints.toLocaleString('vi-VN')} điểm
            </span>
          </div>

          <h4 className="font-bold text-sm text-slate-900 mt-1">{item.title}</h4>

          <p className="text-[11px] text-slate-500 mt-0.5">
            Áp dụng cho đơn hoa từ {formatPrice(item.minOrder)} tại Hà Nội.
          </p>

          {isHighValue && (
            <div className="mt-2 text-[10px] text-amber-800 bg-amber-100/80 px-2 py-1 rounded-lg border border-amber-200 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-amber-700 shrink-0" />
              <span>Yêu cầu OTP xác thực bảo mật tài khoản khi đổi</span>
            </div>
          )}
        </div>

        <button
          onClick={() => handleRedeemClick(item)}
          disabled={!canAfford}
          className={`mt-4 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            canAfford
              ? isHighValue
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-md active:scale-95'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm active:scale-95'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          {canAfford
            ? isHighValue
              ? 'Xác thực OTP & Đổi'
              : 'Đổi Mã Ngay'
            : `Cần thêm ${(requiredPoints - customer.points).toLocaleString('vi-VN')} điểm`}
        </button>
      </div>
    );
  };

  return (
    <div className="glass-panel p-6 rounded-3xl space-y-6 border border-emerald-200/80 shadow-sm bg-gradient-to-br from-white/95 to-emerald-50/30">
      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-base text-slate-900">
            Kho Đổi Điểm Thưởng Lấy Voucher Đặc Quyền (Tối Đa 1.000.000₫)
          </h3>
        </div>
        <span className="text-xs text-slate-600">
          Số dư điểm: <strong className="text-emerald-700 font-bold">{customer.points.toLocaleString('vi-VN')} điểm</strong>
        </span>
      </div>

      {/* Group 1: Voucher Vận Chuyển */}
      {shippingRewards.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-sky-800">
            <Truck className="w-4 h-4 text-sky-600" />
            <span>🚚 Voucher Vận Chuyển (Freeship 10K - 30K)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {shippingRewards.map(renderRewardCard)}
          </div>
        </div>
      )}

      {/* Group 2: Voucher Hoa Tươi */}
      {flowerRewards.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
            <Tag className="w-4 h-4 text-emerald-600" />
            <span>🌸 Voucher Giảm Trực Tiếp Tiền Hoa (50K - 1.000.000₫)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {flowerRewards.map(renderRewardCard)}
          </div>
        </div>
      )}
    </div>
  );
};
