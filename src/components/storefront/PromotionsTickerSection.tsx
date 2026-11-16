import React, { useState } from 'react';
import { Gift, Truck, Flame, Check, ChevronRight, X, Sparkles, Tag } from 'lucide-react';
import { PromotionItem, UserVoucher } from '../../types';
import { useStore } from '../../context/StoreContext';
import { useBodyScrollLock } from '../../utils/scrollLock';

interface PromotionsTickerSectionProps {
  promotions: PromotionItem[];
  onCopyCode?: (code: string) => void;
  copiedCode?: string | null;
}

export const PromotionsTickerSection: React.FC<PromotionsTickerSectionProps> = ({
  promotions
}) => {
  const { customer, saveCustomerVoucher, showToast, setIsAuthModalOpen } = useStore();
  const [isAllVouchersModalOpen, setIsAllVouchersModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'ALL' | 'FREESHIP' | 'FLASH_DEAL' | 'FLOWER'>('ALL');

  useBodyScrollLock(isAllVouchersModalOpen);

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p).replace('₫', 'đ');
  };

  // Only take active promotions that are set to show on public web
  const activePromotions = promotions.filter(p => p.isActive && p.showOnPublicWeb !== false);

  // Classify voucher types (Shopee style)
  const getVoucherCategory = (promo: PromotionItem) => {
    if (promo.discountType === 'FREESHIP' || promo.voucherScope === 'SHIPPING') {
      return {
        type: 'FREESHIP',
        label: 'Mã Vận Chuyển',
        icon: Truck,
        cardBorder: 'border-emerald-300/90 bg-emerald-50/60 hover:border-emerald-400 fixed-semantic',
        badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200/80 fixed-semantic',
        actionColor: 'bg-emerald-600 hover:bg-emerald-700 text-white fixed-semantic',
        iconColor: 'text-emerald-700 fixed-semantic'
      };
    }
    if (promo.campaignType === 'FLASH_DEAL' || promo.campaignType === 'DOUBLE_DAY') {
      return {
        type: 'FLASH_DEAL',
        label: 'Mã Flash Deal',
        icon: Flame,
        cardBorder: 'border-orange-300/90 bg-orange-50/60 hover:border-orange-400',
        badgeBg: 'bg-orange-100 text-orange-800 border-orange-200/80',
        actionColor: 'bg-orange-600 hover:bg-orange-700 text-white',
        iconColor: 'text-orange-700'
      };
    }
    return {
      type: 'FLOWER',
      label: 'Voucher Tiền Hoa',
      icon: Gift,
      cardBorder: 'border-rose-300/90 bg-rose-50/60 hover:border-rose-400',
      badgeBg: 'bg-rose-100 text-rose-800 border-rose-200/80',
      actionColor: 'bg-rose-600 hover:bg-rose-700 text-white',
      iconColor: 'text-rose-700'
    };
  };

  // Check if current user has saved this voucher
  const isVoucherSaved = (code: string) => {
    if (!customer?.userVouchers) return false;
    return customer.userVouchers.some(v => v.code === code && !v.isUsed);
  };

  // Handle saving voucher into customer's wallet
  const handleSaveVoucher = (promo: PromotionItem) => {
    const newVoucher: UserVoucher = {
      id: `uv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      code: promo.code,
      title: promo.title,
      discountAmount: promo.discountAmount,
      minOrder: promo.minOrder,
      validUntil: promo.validUntil,
      discountType: promo.discountType,
      voucherScope: promo.voucherScope,
      campaignType: promo.campaignType,
      maxDiscount: promo.maxDiscount,
      maxShippingRadiusKm: promo.maxShippingRadiusKm,
      isUsed: false,
      source: 'SYSTEM_AIRDROP'
    };

    saveCustomerVoucher(newVoucher);
  };

  // Curated 6 vouchers on homepage (2 rows)
  const homepagePromotions = activePromotions.slice(0, 6);

  // Filtered list inside popup modal
  const modalPromotions = activePromotions.filter(p => {
    if (activeTab === 'ALL') return true;
    const cat = getVoucherCategory(p);
    return cat.type === activeTab;
  });

  return (
    <section id="promotions-vouchers-section" className="container pt-4 scroll-mt-20">
      <div className="glass-panel p-5 sm:p-8 rounded-[32px] border border-white/80 bg-gradient-to-r from-rose-50/70 via-white/80 to-amber-50/70 space-y-5 shadow-xs">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-rose-100/80">
          <div>
            <h3 className="text-base sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <Gift className="w-5 h-5 text-rose-600 shrink-0" />
              <span>Chương Trình Khuyến Mãi &amp; Voucher Độc Quyền</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Lưu mã vào ví hội viên để tự động giảm giá khi đặt hoa tại V&amp;V Florielle
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            {activePromotions.length > 6 && (
              <button
                type="button"
                onClick={() => setIsAllVouchersModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-rose-700 font-bold text-xs border border-rose-200/90 shadow-2xs transition-all cursor-pointer active:scale-95"
              >
                <span>Xem tất cả voucher ({activePromotions.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
            <span className="text-[10.5px] font-bold text-rose-700 bg-rose-100/90 px-2.5 py-1 rounded-full">
              Ưu Đãi Hôm Nay
            </span>
          </div>
        </div>

        {/* Curated 2 Rows Grid (Max 6 Vouchers on Homepage - Lưới 2 Hàng 2 Cột Gọn Gàng trên Mobile) */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3.5">
          {homepagePromotions.map((promo) => {
            const cat = getVoucherCategory(promo);
            const CatIcon = cat.icon;
            const saved = isVoucherSaved(promo.code);

            return (
              <div
                key={promo.id}
                className={`p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border ${cat.cardBorder} shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-2 sm:space-y-3 relative overflow-hidden backdrop-blur-xs`}
              >
                {/* Category Badge & Expiry */}
                <div className="flex items-center justify-between gap-1 text-[9px] sm:text-[10px] font-bold">
                  <span className={`inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 rounded-full border ${cat.badgeBg} truncate max-w-[65%]`}>
                    <CatIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
                    <span className="truncate">{cat.label}</span>
                  </span>
                  <span className="text-slate-400 font-medium text-[8.5px] sm:text-[10px] shrink-0">HSD: {promo.validUntil}</span>
                </div>

                {/* Offer Value Highlight (Không để lộ mã thô) */}
                <div className="space-y-0.5 sm:space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-1.5">
                    <span className="text-xs sm:text-base lg:text-lg font-black text-slate-900 tracking-tight">
                      {promo.discountType === 'PERCENT'
                        ? `Giảm ${promo.discountAmount}%`
                        : `Giảm ${formatPrice(promo.discountAmount)}`}
                    </span>
                    {promo.minOrder > 0 && (
                      <span className="text-[9px] sm:text-[11px] font-semibold text-slate-500 truncate">
                        • Đơn từ {formatPrice(promo.minOrder)}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-[10.5px] sm:text-xs text-slate-800 line-clamp-1">{promo.title}</h4>
                  <p className="text-[9.5px] sm:text-[11px] text-slate-500 line-clamp-1 sm:line-clamp-2 leading-relaxed">
                    {promo.description}
                  </p>
                </div>

                {/* Action Bar: Nút Lưu Mã */}
                <div className="pt-1.5 sm:pt-2 border-t border-slate-200/60 flex items-center justify-between gap-1 sm:gap-2">
                  <span className="text-[9px] sm:text-[10.5px] font-bold text-slate-600 flex items-center gap-0.5 sm:gap-1 truncate">
                    <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{promo.badge || 'Ưu đãi'}</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => handleSaveVoucher(promo)}
                    className={`text-[9.5px] sm:text-xs py-1 sm:py-1.5 px-2 sm:px-3.5 rounded-lg sm:rounded-xl font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs shrink-0 ${
                      saved
                        ? 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                        : `${cat.actionColor} active:scale-95`
                    }`}
                  >
                    {saved ? (
                      <>
                        <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600" />
                        <span>✓ Đã lưu</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                        <span>Lưu mã</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Mobile Trigger Button */}
        {activePromotions.length > 6 && (
          <div className="text-center pt-2 sm:hidden">
            <button
              type="button"
              onClick={() => setIsAllVouchersModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-rose-50 text-rose-700 font-bold text-xs border border-rose-200/90 shadow-2xs transition-all cursor-pointer w-full justify-center"
            >
              <span>Xem tất cả {activePromotions.length} voucher &amp; ưu đãi</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* POPUP NỔI TOÀN BỘ VOUCHER (Chuẩn thiết kế căn giữa & Phân 3 màu Shopee) */}
      {isAllVouchersModalOpen && (
        <div
          className="fixed inset-0 z-[100000] flex items-center justify-center p-3 sm:p-5 bg-slate-900/25 backdrop-blur-sm select-none animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAllVouchersModalOpen(false);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="glass-panel w-full max-w-2xl bg-white/95 backdrop-blur-2xl rounded-[32px] shadow-2xl border border-white/90 overflow-hidden flex flex-col max-h-[92dvh] sm:max-h-[88vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Căn Giữa Chuẩn Chỉ */}
            <div className="relative p-5 pb-3 border-b border-slate-100 flex flex-col items-center text-center shrink-0 bg-white/80">
              <button
                type="button"
                onClick={() => setIsAllVouchersModalOpen(false)}
                className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
                title="Đóng popup"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shadow-xs mb-2">
                <Gift className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
                Kho Voucher &amp; Ưu Đãi Độc Quyền ({activePromotions.length})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Bấm "Lưu mã" để cất vào ví hội viên và tự động áp dụng khi thanh toán
              </p>

              {/* Categorization Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pt-3 text-xs w-full justify-center scrollbar-none">
                {[
                  { id: 'ALL', label: `Tất cả (${activePromotions.length})` },
                  { id: 'FREESHIP', label: '🚚 Mã Vận Chuyển' },
                  { id: 'FLASH_DEAL', label: '🔥 Mã Flash Deal' },
                  { id: 'FLOWER', label: '🎁 Tiền Hoa' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Voucher List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 no-scrollbar">
              {modalPromotions.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs font-semibold">
                  Hiện chưa có mã ưu đãi trong danh mục này.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {modalPromotions.map((promo) => {
                    const cat = getVoucherCategory(promo);
                    const CatIcon = cat.icon;
                    const saved = isVoucherSaved(promo.code);

                    return (
                      <div
                        key={promo.id}
                        className={`p-3.5 rounded-2xl border ${cat.cardBorder} shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-2.5`}
                      >
                        <div className="flex items-center justify-between gap-1 text-[10px] font-bold">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border ${cat.badgeBg}`}>
                            <CatIcon className="w-3 h-3" />
                            <span>{cat.label}</span>
                          </span>
                          <span className="text-slate-400 font-medium">HSD: {promo.validUntil}</span>
                        </div>

                        <div>
                          <div className="text-base font-black text-slate-900">
                            {promo.discountType === 'PERCENT'
                              ? `Giảm ${promo.discountAmount}%`
                              : `Giảm ${formatPrice(promo.discountAmount)}`}
                          </div>
                          {promo.minOrder > 0 && (
                            <div className="text-[11px] font-semibold text-slate-500">
                              Đơn tối thiểu {formatPrice(promo.minOrder)}
                            </div>
                          )}
                          <div className="font-bold text-xs text-slate-800 mt-1 line-clamp-1">{promo.title}</div>
                          <div className="text-[10.5px] text-slate-500 line-clamp-2 mt-0.5">{promo.description}</div>
                        </div>

                        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2">
                          <span className="text-[10px] font-mono text-slate-400">
                            {promo.badge}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleSaveVoucher(promo)}
                            className={`text-xs py-1.5 px-3 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                              saved
                                ? 'bg-slate-100 text-slate-500 border border-slate-200'
                                : `${cat.actionColor} active:scale-95`
                            }`}
                          >
                            {saved ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span>✓ Đã lưu</span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Lưu mã</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 sm:p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between gap-2 shrink-0">
              <span className="text-[11px] text-slate-500">
                {customer ? `Ví của bạn: ${(customer.userVouchers || []).filter(v => !v.isUsed).length} mã khả dụng` : 'Đăng nhập để xem ví voucher cá nhân'}
              </span>
              <button
                type="button"
                onClick={() => setIsAllVouchersModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
