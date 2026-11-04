import React from 'react';
import { CustomerUser } from '../../types';
import { Gift } from 'lucide-react';

interface CustomerRewardsTabProps {
  customer: CustomerUser;
  redeemVoucherWithPoints: (promoId: string) => void;
  formatPrice: (price: number) => string;
}

export const CustomerRewardsTab: React.FC<CustomerRewardsTabProps> = ({
  customer,
  redeemVoucherWithPoints,
  formatPrice
}) => {
  const rewardsList = [
    { id: 'promo-02', code: 'SHIP10K', title: 'Freeship 10.000₫', points: 100, minOrder: 150000 },
    { id: 'promo-03', code: 'SHIP20K', title: 'Freeship 20.000₫', points: 200, minOrder: 250000 },
    { id: 'promo-04', code: 'SHIP30K', title: 'Freeship 30.000₫', points: 300, minOrder: 350000 }
  ];

  return (
    <div className="glass-panel p-6 rounded-3xl space-y-4 border border-emerald-200/80 shadow-sm bg-gradient-to-br from-white/95 to-emerald-50/30">
      <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-base text-slate-900">Đổi Điểm Thưởng Lấy Voucher Freeship</h3>
        </div>
        <span className="text-xs text-slate-600">
          Số dư khả dụng: <strong className="text-emerald-700 font-bold">{customer.points} điểm</strong>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {rewardsList.map((item) => {
          const canAfford = customer.points >= item.points;
          return (
            <div
              key={item.code}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                canAfford
                  ? 'bg-gradient-to-br from-emerald-50/80 to-white border-emerald-300 shadow-sm'
                  : 'bg-slate-50/70 border-slate-200/60 opacity-80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono font-bold text-xs text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-md border border-emerald-200">
                    {item.code}
                  </span>
                  <span className="text-xs font-bold text-emerald-700">{item.points} điểm</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 mt-1">{item.title}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Áp dụng cho mọi đơn hoa từ {formatPrice(item.minOrder)} tại Hà Nội.
                </p>
              </div>

              <button
                onClick={() => redeemVoucherWithPoints(item.id)}
                disabled={!canAfford}
                className={`mt-4 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  canAfford
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm active:scale-95'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {canAfford ? 'Đổi Mã Ngay' : `Cần thêm ${item.points - customer.points} điểm`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
