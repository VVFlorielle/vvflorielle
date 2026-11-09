import React from 'react';
import { Gift, Copy, Check } from 'lucide-react';
import { PromotionItem } from '../../types';

interface PromotionsTickerSectionProps {
  promotions: PromotionItem[];
  onCopyCode: (code: string) => void;
  copiedCode: string | null;
}

export const PromotionsTickerSection: React.FC<PromotionsTickerSectionProps> = ({
  promotions,
  onCopyCode,
  copiedCode
}) => {
  return (
    <section className="container pt-4">
      <div className="glass-panel p-6 sm:p-8 rounded-[32px] border border-white/80 bg-gradient-to-r from-rose-50/70 via-white/80 to-amber-50/70 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <Gift className="w-5 h-5 text-rose-600" />
              <span>Chương Trình Khuyến Mãi &amp; Mã Giảm Giá Độc Quyền</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Áp dụng trực tiếp tại giỏ hàng để nhận ưu đãi tốt nhất từ V&amp;V Florielle
            </p>
          </div>
          <span className="text-[11px] font-semibold text-rose-700 bg-rose-100/80 px-3 py-1 rounded-full self-start sm:self-auto">
            Ưu Đãi Hôm Nay
          </span>
        </div>

        <div className="grid grid-cols-2 min-[480px]:grid-cols-3 gap-2 sm:gap-4">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className="p-2.5 sm:p-4 rounded-2xl bg-white/90 border border-rose-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-2 relative overflow-hidden"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 uppercase tracking-wide truncate max-w-[90px] sm:max-w-none">
                    {promo.badge}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 whitespace-nowrap">HSD: {promo.validUntil}</span>
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug line-clamp-2">{promo.title}</h4>
                <p className="text-[10.5px] sm:text-xs text-slate-500 leading-relaxed line-clamp-2">{promo.description}</p>
              </div>

              <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between gap-1">
                <div className="font-mono font-extrabold text-xs sm:text-sm text-slate-900 tracking-wider bg-slate-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg border border-dashed border-rose-300 truncate">
                  {promo.code}
                </div>
                <button
                  onClick={() => onCopyCode(promo.code)}
                  className="btn-secondary text-[10px] sm:text-[11px] py-1 px-2 sm:px-3 rounded-xl flex items-center gap-1 border-rose-200 text-rose-700 hover:bg-rose-50 cursor-pointer shrink-0"
                >
                  {copiedCode === promo.code ? (
                    <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                  ) : (
                    <Copy className="w-3 h-3 shrink-0" />
                  )}
                  <span>{copiedCode === promo.code ? 'Đã chép' : 'Chép'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
