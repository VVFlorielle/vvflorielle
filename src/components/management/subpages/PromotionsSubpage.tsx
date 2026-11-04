import React from 'react';
import { Gift, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { PromotionItem } from '../../../types';

interface PromotionsSubpageProps {
  promotions: PromotionItem[];
  onBackToDashboard: () => void;
  onOpenAddVoucher: () => void;
  updatePromotions: (promos: PromotionItem[]) => void;
  formatPrice: (p: number) => string;
  title?: string;
}

export const PromotionsSubpage: React.FC<PromotionsSubpageProps> = ({
  promotions,
  onBackToDashboard,
  onOpenAddVoucher,
  updatePromotions,
  formatPrice,
  title = 'Quản Lý Voucher & Mã Ưu Đãi'
}) => {
  return (
    <div className="glass-panel p-5 sm:p-6 space-y-5 rounded-[28px] animate-in fade-in duration-200">
      {/* Header and Back Button */}
      <div className="flex items-center gap-3 pb-3 border-b border-slate-200/80">
        <button
          type="button"
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại Tổng Quan</span>
        </button>
        <h2 className="font-bold text-base sm:text-lg text-slate-800">{title}</h2>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
            <Gift className="w-5 h-5 text-rose-600" />
            <span>Quản Lý Voucher &amp; Mã Khuyến Mại ({promotions.length})</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Cấu hình mã FREESHIP30K cho hội viên mới, voucher đổi bằng điểm tích lũy và voucher quà tặng sinh nhật.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAddVoucher}
          className="btn-primary text-xs py-2 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 shadow-md flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Voucher Mới</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {promotions.map((promo) => (
          <div
            key={promo.id}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono font-bold text-sm text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-lg border border-emerald-300">
                  {promo.code}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    promo.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {promo.isActive ? 'Đang áp dụng' : 'Tạm dừng'}
                </span>
              </div>

              <h4 className="font-bold text-xs text-slate-900 mt-2">{promo.title}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{promo.description}</p>

              <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                <div>
                  Giảm tối đa: <strong className="text-rose-700">{formatPrice(promo.discountAmount)}</strong>
                </div>
                <div>
                  Đơn tối thiểu: <strong className="text-slate-800">{formatPrice(promo.minOrder)}</strong>
                </div>
                {promo.pointsToRedeem && (
                  <div className="text-emerald-700 font-semibold">
                    Cần: <strong>{promo.pointsToRedeem} điểm</strong> để đổi
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => {
                  const updated = promotions.map((p) => (p.id === promo.id ? { ...p, isActive: !p.isActive } : p));
                  updatePromotions(updated);
                }}
                className="text-purple-700 hover:text-purple-900 text-xs font-semibold cursor-pointer"
              >
                {promo.isActive ? 'Tạm dừng mã' : 'Kích hoạt lại'}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm(`Bạn có chắc muốn xóa mã voucher "${promo.code}"?`)) {
                    const updated = promotions.filter((p) => p.id !== promo.id);
                    updatePromotions(updated);
                  }
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                title="Xóa voucher"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
