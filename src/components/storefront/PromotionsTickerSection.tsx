import React, { useState, useMemo } from 'react';
import { Gift, Truck, Flame, Check, ChevronRight, X, Sparkles, Tag, Clock, ShoppingBag, Eye, Zap } from 'lucide-react';
import { PromotionItem, UserVoucher, FlowerProduct } from '../../types';
import { useStore } from '../../context/StoreContext';
import { useBodyScrollLock } from '../../utils/scrollLock';
import { useFlashSaleTimer } from '../../hooks/useFlashSaleTimer';
import { isVoucherVisibleOnStorefront } from '../../utils/voucherVisibility';

interface PromotionsTickerSectionProps {
  promotions: PromotionItem[];
  onCopyCode?: (code: string) => void;
  copiedCode?: string | null;
}

export const PromotionsTickerSection: React.FC<PromotionsTickerSectionProps> = ({
  promotions
}) => {
  const {
    customer,
    saveCustomerVoucher,
    showToast,
    setIsAuthModalOpen,
    setAuthModalMode,
    setIsCartOpen,
    setSelectedProduct,
    addToCart,
    products,
    isDoubleDaySimulated,
    isFlashSaleSimulated,
    isHolidaySimulated,
    searchQuery
  } = useStore();

  const [isAllVouchersModalOpen, setIsAllVouchersModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'ALL' | 'FREESHIP' | 'FLASH_DEAL' | 'FLOWER'>('ALL');

  useBodyScrollLock(isAllVouchersModalOpen);

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p).replace('₫', 'đ');
  };

  // Live Flash Sale Countdown Timer
  const flashTimer = useFlashSaleTimer(isFlashSaleSimulated);

  // Filter vouchers that are currently eligible for display according to calendar & real-time rules
  const visiblePromotions = useMemo(() => {
    return promotions.filter((p) =>
      isVoucherVisibleOnStorefront(p, {
        isDoubleDaySimulated,
        isFlashSaleSimulated,
        isHolidaySimulated
      })
    );
  }, [promotions, isDoubleDaySimulated, isFlashSaleSimulated, isHolidaySimulated]);

  // Dynamic 4 Flash Deal Products personalized to customer preferences & viewing/search history
  const flashDealProducts = useMemo(() => {
    let viewedIds: string[] = [];
    let searchKeywords: string[] = [];
    if (typeof window !== 'undefined') {
      try {
        const rawViewed = localStorage.getItem('vvf_recently_viewed_product_ids');
        if (rawViewed) viewedIds = JSON.parse(rawViewed);
      } catch {}
      try {
        const rawSearch = localStorage.getItem('vvf_search_history');
        if (rawSearch) searchKeywords = JSON.parse(rawSearch);
      } catch {}
    }

    if (searchQuery && searchQuery.trim()) {
      searchKeywords.unshift(searchQuery.trim().toLowerCase());
    }

    const preferredTokens = [
      ...(customer?.notes || '').toLowerCase().split(/[\s,;]+/),
      ...(customer?.favoriteFlowers || []).map((f) => f.toLowerCase()),
      ...(customer?.tags || []).map((t) => t.toLowerCase())
    ].filter((t: string) => t && t.length > 1);

    // Candidates: Products with modest discounts (10% - 20%) or top quality flowers
    const discounted = products.filter((p) => p.originalPrice && p.originalPrice > p.price);
    const pool = discounted.length >= 4 ? discounted : products;

    // Score and rank candidates based on customer profile & behavior
    const scored = pool.map((p) => {
      let score = 0;
      const lowerName = p.name.toLowerCase();
      const lowerCat = (p.categoryId || '').toLowerCase();
      const lowerDesc = (p.description || '').toLowerCase();
      const lowerFlowerTypes = (p.flowerTypes || []).map((ft) => ft.toLowerCase()).join(' ');

      // Priority 1: Direct viewing history or same category as recently viewed
      if (viewedIds.includes(p.id)) {
        score += 6;
      } else if (viewedIds.some((vId) => {
        const vp = products.find((x) => x.id === vId);
        return vp && vp.categoryId === p.categoryId;
      })) {
        score += 3;
      }

      // Priority 2: Matches customer's preferred styles/tones/notes
      for (const token of preferredTokens) {
        if (
          lowerName.includes(token) ||
          lowerCat.includes(token) ||
          lowerFlowerTypes.includes(token) ||
          lowerDesc.includes(token)
        ) {
          score += 4;
        }
      }

      // Priority 3: Matches search query / history
      for (const kw of searchKeywords) {
        if (kw && (lowerName.includes(kw) || lowerCat.includes(kw) || lowerDesc.includes(kw))) {
          score += 3;
        }
      }

      // Dynamic variation jitter
      const charSum = p.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
      const randomJitter = (charSum % 5) * 0.3 + Math.random() * 0.7;

      return { product: p, score: score + randomJitter };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 4).map((s) => s.product);
  }, [products, customer?.notes, customer?.favoriteFlowers, customer?.tags, searchQuery]);

  // Curated 2 - 3 Flash Deal Vouchers available during the 1-hour window
  const flashVouchers = useMemo(() => {
    return promotions.filter((p) => p.campaignType === 'FLASH_DEAL' && p.isActive).slice(0, 3);
  }, [promotions]);

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
        label: promo.campaignType === 'DOUBLE_DAY' ? 'Mã Ngày Đôi' : 'Mã Flash Deal',
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
    return customer.userVouchers.some((v) => v.code === code && !v.isUsed);
  };

  // Handle saving voucher into customer's wallet
  const handleSaveVoucher = (promo: PromotionItem) => {
    if (!customer) {
      showToast('🌸 Vui lòng đăng nhập số điện thoại để lưu voucher vào ví hội viên nha!', 'info');
      setAuthModalMode('customer');
      setIsAuthModalOpen(true);
      return;
    }

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

  // Curated vouchers on homepage (Up to 6)
  const homepagePromotions = visiblePromotions.slice(0, 6);

  // Filtered list inside popup modal
  const modalPromotions = visiblePromotions.filter((p) => {
    if (activeTab === 'ALL') return true;
    const cat = getVoucherCategory(p);
    return cat.type === activeTab;
  });

  return (
    <section id="promotions-vouchers-section" className="container pt-4 scroll-mt-20 space-y-6">
      {/* ========================================================================= */}
      {/* 1. KHU VỰC GIỜ VÀNG FLASH SALE VỚI ĐỒNG HỒ ĐẾM NGƯỢC & SẢN PHẨM DEAL VỪA PHẢI */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-[32px] p-[2px] bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 shadow-xl shadow-orange-500/10">
        <div className="bg-gradient-to-br from-amber-50/90 via-white to-rose-50/90 backdrop-blur-xl p-4 sm:p-7 rounded-[30px] space-y-5">
          {/* Header Flash Sale với Đồng Hồ Đếm Ngược */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5 pb-4 border-b border-orange-200/70">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-rose-600 text-white flex items-center justify-center shadow-md shadow-orange-500/25">
                  <Flame className="w-5 h-5 fill-white text-white animate-pulse" />
                </span>
                <h3 className="text-base sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                  <span>Giờ Vàng Flash Sale</span>
                  <span className="text-rose-600 font-extrabold">• Deal Hoa Tươi Giảm 10% - 17%</span>
                </h3>
                <span
                  className={`text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider ${
                    flashTimer.isLive
                      ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30 animate-pulse'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}
                >
                  <Zap className="w-3 h-3 fill-current" />
                  <span>{flashTimer.isLive ? 'Đang Diễn Ra' : 'Sắp Mở Bán'}</span>
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Khung giờ vàng ({flashTimer.activeSlot}) — Diễn ra trong 1h, số lượng deal giới hạn, hoa tươi chọn lọc theo sở thích của bạn
              </p>
            </div>

            {/* Đồng hồ số đếm ngược chuyên nghiệp chuẩn TMĐT */}
            <div className="flex items-center gap-2 self-start md:self-auto bg-white/95 px-3.5 py-2 rounded-2xl border border-orange-200 shadow-sm shrink-0">
              <Clock className="w-4 h-4 text-orange-600 shrink-0" />
              <span className="text-xs font-bold text-slate-700">
                {flashTimer.isLive ? 'Kết thúc trong:' : 'Bắt đầu sau:'}
              </span>
              <div className="flex items-center gap-1">
                <span className="px-2 py-1 rounded-lg bg-slate-900 text-amber-300 font-mono font-black text-xs sm:text-sm shadow-inner min-w-[28px] text-center">
                  {flashTimer.hours}
                </span>
                <span className="font-black text-orange-600">:</span>
                <span className="px-2 py-1 rounded-lg bg-slate-900 text-amber-300 font-mono font-black text-xs sm:text-sm shadow-inner min-w-[28px] text-center">
                  {flashTimer.minutes}
                </span>
                <span className="font-black text-orange-600">:</span>
                <span className="px-2 py-1 rounded-lg bg-slate-900 text-amber-300 font-mono font-black text-xs sm:text-sm shadow-inner min-w-[28px] text-center">
                  {flashTimer.seconds}
                </span>
              </div>
            </div>
          </div>

          {/* Lưới 4 Sản Phẩm Deal Giảm Giá Vừa Phải */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {flashDealProducts.map((p, idx) => {
              const baseOrig = p.originalPrice || p.price;
              const discountPct = Math.round(((baseOrig - p.price) / baseOrig) * 100);
              const soldCount = 14 + (idx * 3); // Mock nhịp điệu bán hàng sinh động

              return (
                <div
                  key={p.id}
                  className="group bg-white rounded-2xl p-2.5 sm:p-3.5 border border-orange-100 hover:border-orange-300 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-2 relative overflow-hidden"
                >
                  {/* Ảnh sản phẩm */}
                  <div
                    onClick={() => setSelectedProduct(p)}
                    className="relative aspect-square rounded-xl overflow-hidden bg-slate-50 cursor-pointer"
                  >
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    {/* Badge % Giảm giá vừa phải */}
                    <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-lg bg-rose-600 text-white font-black text-[10px] sm:text-xs shadow-md">
                      -{discountPct}%
                    </span>
                    <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[9px] font-semibold">
                      Deal Giờ Vàng
                    </span>
                  </div>

                  {/* Tên & Giá Deal */}
                  <div className="space-y-1">
                    <h4
                      onClick={() => setSelectedProduct(p)}
                      className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-rose-600 transition-colors cursor-pointer"
                      title={p.name}
                    >
                      {p.name}
                    </h4>

                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="text-sm sm:text-base font-black text-rose-600">
                        {formatPrice(p.price)}
                      </span>
                      {p.originalPrice && (
                        <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                          {formatPrice(p.originalPrice)}
                        </span>
                      )}
                    </div>

                    <div className="text-[9.5px] text-emerald-700 font-bold">
                      Tiết kiệm {formatPrice(baseOrig - p.price)}
                    </div>

                    {/* Thanh tiến độ số lượng bán ảo phong cách Shopee */}
                    <div className="pt-1">
                      <div className="w-full h-1.5 bg-orange-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 to-rose-600 rounded-full"
                          style={{ width: `${Math.min(95, (soldCount / 25) * 100)}%` }}
                        />
                      </div>
                      <span className="text-[8.5px] text-slate-500 font-semibold block mt-0.5">
                        🔥 Đã bán {soldCount}/25 bó
                      </span>
                    </div>
                  </div>

                  {/* Nút hành động */}
                  <div className="pt-1 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(p)}
                      className="flex-1 py-1.5 px-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 text-[11px] font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Xem mẫu</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        addToCart(p);
                        setIsCartOpen(true);
                        showToast(`Đã thêm "${p.name}" vào giỏ hàng với giá Flash Deal!`, 'success');
                      }}
                      className="py-1.5 px-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white text-[11px] font-bold shadow-2xs transition-all cursor-pointer active:scale-95 flex items-center justify-center"
                      title="Thêm vào giỏ hàng ngay"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cụm 2 - 3 Mã Deal Giờ Vàng (Chỉ 1h mỗi ca, Không hiển thị mã sao chép, chỉ Lưu & Dùng ngay theo đúng quy định) */}
          {flashVouchers.length > 0 && (
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                  <span>Mã Giảm Giá Giờ Vàng (Áp dụng trong 1h)</span>
                </span>
                <span className="text-[11px] text-orange-700 font-semibold">
                  Tối đa 1 mã / đơn hoa
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                {flashVouchers.map((voucher) => {
                  const isSaved = isVoucherSaved(voucher.code);
                  const isFreeship = voucher.discountType === 'FREESHIP' || voucher.voucherScope === 'SHIPPING';

                  return (
                    <div
                      key={voucher.id}
                      className="p-3 rounded-2xl bg-gradient-to-br from-white via-orange-50/50 to-amber-50/60 border border-orange-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between gap-2.5 relative overflow-hidden group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs sm:text-sm font-black text-rose-600">
                              {voucher.discountType === 'PERCENT'
                                ? `Giảm ${voucher.discountAmount}%`
                                : `Giảm ${formatPrice(voucher.discountAmount)}`}
                            </span>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-orange-100 text-orange-800 border border-orange-200">
                              {voucher.badge || 'Giờ Vàng 1H'}
                            </span>
                          </div>
                          <p className="text-[11px] font-medium text-slate-700 line-clamp-1">
                            {voucher.title}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            Đơn từ {formatPrice(voucher.minOrder)}
                          </p>
                        </div>

                        <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          {isFreeship ? <Truck className="w-4 h-4" /> : <Flame className="w-4 h-4" />}
                        </div>
                      </div>

                      {/* Nút Lưu / Dùng ngay - Không hiển thị mã thô hay nút sao chép theo đúng quy định mới */}
                      {isSaved ? (
                        <button
                          type="button"
                          onClick={() => {
                            setIsCartOpen(true);
                            showToast(`Voucher ${voucher.title} đã sẵn sàng trong giỏ hàng!`, 'info');
                          }}
                          className="w-full py-1.5 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer active:scale-95"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Đã lưu • Dùng ngay</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSaveVoucher(voucher)}
                          className="w-full py-1.5 px-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer active:scale-95"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Lưu mã</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. KHỐI VOUCHER THƯỜNG NHẬT & SỰ KIỆN HỢP LỆ (GỌN GÀNG, ĐÚNG NGÀY ĐÚNG LỊCH) */}
      {/* ========================================================================= */}
      <div className="glass-panel p-5 sm:p-8 rounded-[32px] border border-white/80 bg-gradient-to-r from-rose-50/70 via-white/80 to-amber-50/70 space-y-5 shadow-xs">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-rose-100/80">
          <div>
            <h3 className="text-base sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <Gift className="w-5 h-5 text-rose-600 shrink-0" />
              <span>Kho Voucher &amp; Ưu Đãi Độc Quyền</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Lưu mã vào ví hội viên để tự động giảm giá khi đặt hoa tại V&amp;V Florielle
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            {visiblePromotions.length > 6 && (
              <button
                type="button"
                onClick={() => setIsAllVouchersModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-rose-700 font-bold text-xs border border-rose-200/90 shadow-2xs transition-all cursor-pointer active:scale-95"
              >
                <span>Xem tất cả ({visiblePromotions.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
            <span className="text-[10.5px] font-bold text-rose-700 bg-rose-100/90 px-2.5 py-1 rounded-full">
              Ưu Đãi Hôm Nay
            </span>
          </div>
        </div>

        {/* Lưới Voucher Thường Nhật & Sự Kiện (Đã Lọc Sạch Những Mã Chưa Tới Ngày) */}
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
                    {promo.minOrder > 0 ? (
                      <span className="text-[9px] sm:text-[11px] font-semibold text-slate-500 truncate">
                        • Đơn từ {formatPrice(promo.minOrder)}
                      </span>
                    ) : (
                      <span className="text-[9px] sm:text-[11px] font-semibold text-emerald-600 truncate">
                        • Đơn từ 0₫
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-[10.5px] sm:text-xs text-slate-800 line-clamp-1">{promo.title}</h4>
                  <p className="text-[9.5px] sm:text-[11px] text-slate-500 line-clamp-1 sm:line-clamp-2 leading-relaxed">
                    {promo.description}
                  </p>
                </div>

                {/* Action Bar: Cụm Nút Thông Minh "Lưu" & "Sử dụng" */}
                <div className="pt-1.5 sm:pt-2 border-t border-slate-200/60 flex items-center justify-between gap-1 sm:gap-2">
                  <span className="text-[9px] sm:text-[10.5px] font-bold text-slate-600 flex items-center gap-0.5 sm:gap-1 truncate">
                    <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{promo.badge || 'Ưu đãi'}</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      if (saved) {
                        setIsCartOpen(true);
                        showToast('Voucher đã lưu trong ví, sẵn sàng sử dụng khi thanh toán!', 'info');
                      } else {
                        handleSaveVoucher(promo);
                      }
                    }}
                    className={`text-[9.5px] sm:text-xs py-1 sm:py-1.5 px-2 sm:px-3.5 rounded-lg sm:rounded-xl font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs shrink-0 ${
                      saved
                        ? 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white'
                        : `${cat.actionColor} active:scale-95`
                    }`}
                  >
                    {saved ? (
                      <>
                        <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span>Sử dụng</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                        <span>Lưu</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Mobile Trigger Button */}
        {visiblePromotions.length > 6 && (
          <div className="text-center pt-2 sm:hidden">
            <button
              type="button"
              onClick={() => setIsAllVouchersModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-rose-50 text-rose-700 font-bold text-xs border border-rose-200/90 shadow-2xs transition-all cursor-pointer w-full justify-center"
            >
              <span>Xem tất cả {visiblePromotions.length} voucher &amp; ưu đãi</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* POPUP NỔI TOÀN BỘ VOUCHER (Chuẩn thiết kế căn giữa & Lọc đúng lịch) */}
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
                Kho Voucher &amp; Ưu Đãi Đang Áp Dụng ({visiblePromotions.length})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Bấm "Lưu" để cất vào ví hội viên hoặc "Sử dụng" để tự động áp dụng khi thanh toán
              </p>

              {/* Categorization Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pt-3 text-xs w-full justify-center scrollbar-none">
                {[
                  { id: 'ALL', label: `Tất cả (${visiblePromotions.length})` },
                  { id: 'FREESHIP', label: '🚚 Mã Vận Chuyển' },
                  { id: 'FLASH_DEAL', label: '🔥 Flash Deal & Sự Kiện' },
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
                  Hiện chưa có mã ưu đãi trong danh mục này hôm nay.
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
                          {promo.minOrder > 0 ? (
                            <div className="text-[11px] font-semibold text-slate-500">
                              Đơn tối thiểu {formatPrice(promo.minOrder)}
                            </div>
                          ) : (
                            <div className="text-[11px] font-semibold text-emerald-600">
                              Đơn tối thiểu 0₫
                            </div>
                          )}
                          <div className="font-bold text-xs text-slate-800 mt-1 line-clamp-1">{promo.title}</div>
                          <div className="text-[10.5px] text-slate-500 line-clamp-2 mt-0.5">{promo.description}</div>
                        </div>

                        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold text-slate-500">
                            {promo.badge}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              if (saved) {
                                setIsAllVouchersModalOpen(false);
                                setIsCartOpen(true);
                                showToast('Voucher đã lưu trong ví, sẵn sàng sử dụng khi thanh toán!', 'info');
                              } else {
                                handleSaveVoucher(promo);
                              }
                            }}
                            className={`text-xs py-1.5 px-3.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                              saved
                                ? 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white'
                                : `${cat.actionColor} active:scale-95`
                            }`}
                          >
                            {saved ? (
                              <>
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>Sử dụng</span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Lưu</span>
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
              <span className="text-[11px] text-slate-500 truncate">
                {customer
                  ? `Ví của bạn: ${(customer.userVouchers || []).filter((v) => !v.isUsed).length} mã khả dụng`
                  : 'Đăng nhập để xem ví voucher cá nhân'}
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
