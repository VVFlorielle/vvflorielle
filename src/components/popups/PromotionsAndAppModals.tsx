import React, { useState, useMemo } from 'react';
import {
  Gift,
  Smartphone,
  CheckCircle2,
  Download,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  ShoppingBag,
  Truck,
  Flame,
  Tag,
  Clock
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PromotionItem, UserVoucher } from '../../types';
import { useFlashSaleTimer } from '../../hooks/useFlashSaleTimer';
import { isVoucherVisibleOnStorefront } from '../../utils/voucherVisibility';

interface PromoModalProps {
  onClose: () => void;
}

// 1. Welcome Voucher Modal Content
export const VouchersModalContent: React.FC<PromoModalProps> = ({ onClose }) => {
  const { customer, saveCustomerVoucher, setIsAuthModalOpen, setAuthModalMode, setIsCartOpen, showToast } = useStore();
  const isSaved = Boolean(customer?.userVouchers?.some((v) => v.code === 'FREESHIP30K' && !v.isUsed));

  const handleAction = () => {
    if (isSaved) {
      onClose();
      setIsCartOpen(true);
      showToast('Voucher Freeship 30K đã sẵn sàng trong giỏ hàng!', 'info');
      return;
    }
    if (!customer) {
      showToast('🌸 Vui lòng đăng nhập số điện thoại để lưu ưu đãi vào ví hội viên nha!', 'info');
      onClose();
      setAuthModalMode('customer');
      setIsAuthModalOpen(true);
      return;
    }
    saveCustomerVoucher({
      id: `uv-${Date.now()}-welcome`,
      code: 'FREESHIP30K',
      title: 'Ưu Đãi Chào Bạn Mới (Freeship 30K)',
      discountAmount: 30000,
      minOrder: 300000,
      validUntil: '31/12/2026',
      discountType: 'FREESHIP',
      voucherScope: 'SHIPPING',
      campaignType: 'STANDARD',
      maxDiscount: 30000,
      isUsed: false,
      source: 'WELCOME'
    });
  };

  return (
    <div className="space-y-4 select-none">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-100 to-amber-100 text-rose-700 flex items-center justify-center mx-auto shadow-md shadow-rose-600/10 border border-rose-200/50 shrink-0">
        <Gift className="w-6 h-6" />
      </div>
      <div className="text-center">
        <h3 className="font-extrabold text-base text-slate-900 tracking-tight">Ưu Đãi Chào Bạn Mới</h3>
        <p className="text-xs text-slate-500 mt-1">Dành riêng cho khách hàng mới đã kích hoạt tài khoản</p>
      </div>
      <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50/80 to-amber-50/80 border border-rose-200 text-center space-y-2">
        <span className="text-[11px] font-bold text-rose-700 tracking-wider uppercase">Miễn Phí Vận Chuyển</span>
        <div className="text-2xl font-black text-rose-600 tracking-tight">
          Freeship 30.000₫
        </div>
        <p className="text-xs text-slate-600">
          Miễn phí vận chuyển tối đa 30.000₫ cho mọi đơn hàng hoa tươi từ 300.000₫ toàn Hà Nội.
        </p>
      </div>
      <button
        type="button"
        onClick={handleAction}
        className={`w-full text-xs py-3 rounded-xl shadow-md font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
          isSaved
            ? 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white'
            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
        }`}
      >
        {isSaved ? (
          <>
            <ShoppingBag className="w-4 h-4" />
            <span>Sử dụng ngay • Mở giỏ hàng</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>Lưu vào ví hội viên</span>
          </>
        )}
      </button>
    </div>
  );
};

// 2. Promotions List Modal Content (Quy định hiển thị mới: Không để lộ mã thô, có nút Lưu & Sử dụng thông minh)
export const PromotionsModalContent: React.FC<PromoModalProps> = ({ onClose }) => {
  const {
    promotions,
    customer,
    saveCustomerVoucher,
    setIsAuthModalOpen,
    setAuthModalMode,
    setIsCartOpen,
    showToast,
    isDoubleDaySimulated,
    isFlashSaleSimulated,
    isHolidaySimulated
  } = useStore();

  const [activeTab, setActiveTab] = useState<'ALL' | 'FREESHIP' | 'DOUBLE_DAY' | 'FLOWER'>('ALL');

  const flashTimer = useFlashSaleTimer(isFlashSaleSimulated);

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p).replace('₫', 'đ');
  };

  const isVoucherSaved = (code: string) => {
    if (!customer?.userVouchers) return false;
    return customer.userVouchers.some((v) => v.code === code && !v.isUsed);
  };

  const handleSaveVoucher = (promo: PromotionItem) => {
    if (!customer) {
      showToast('🌸 Vui lòng đăng nhập số điện thoại để lưu voucher vào ví hội viên nha!', 'info');
      onClose();
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

  const activePromotions = useMemo(() => {
    return promotions.filter((p) =>
      isVoucherVisibleOnStorefront(p, {
        isDoubleDaySimulated,
        isFlashSaleSimulated,
        isHolidaySimulated
      })
    );
  }, [promotions, isDoubleDaySimulated, isFlashSaleSimulated, isHolidaySimulated]);

  const filteredPromotions = activePromotions.filter((p) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'FREESHIP') return p.voucherScope === 'SHIPPING' || p.discountType === 'FREESHIP';
    if (activeTab === 'DOUBLE_DAY') return p.campaignType === 'DOUBLE_DAY' || p.campaignType === 'FLASH_DEAL';
    if (activeTab === 'FLOWER') return p.voucherScope === 'FLOWER' && p.discountType !== 'FREESHIP' && p.campaignType !== 'DOUBLE_DAY';
    return true;
  });

  return (
    <div className="space-y-4 select-none">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-100 to-amber-100 text-rose-700 flex items-center justify-center mx-auto shadow-md shadow-rose-600/10 border border-rose-200/50 shrink-0">
        <Gift className="w-6 h-6" />
      </div>
      <div className="text-center">
        <h3 className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
          Kho Voucher &amp; Ưu Đãi Đang Áp Dụng ({activePromotions.length})
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Bấm "Lưu" để cất vào ví hội viên hoặc "Sử dụng" để tự động áp dụng khi thanh toán
        </p>
      </div>

      {/* Countdown Banner nếu đang ở tab Flash / Ngày Đôi */}
      {activeTab === 'DOUBLE_DAY' && (
        <div className="p-3 rounded-2xl bg-gradient-to-r from-orange-100/90 to-amber-100/90 border border-orange-200/90 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-orange-950">
            <Flame className="w-4 h-4 text-orange-600 fill-orange-600 animate-pulse" />
            <span>Giờ Vàng ({flashTimer.activeSlot}):</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-600">
              {flashTimer.isLive ? 'Kết thúc trong' : 'Bắt đầu sau'}:
            </span>
            <span className="font-mono font-black text-xs text-orange-900 bg-white px-2 py-0.5 rounded-lg border border-orange-300">
              {flashTimer.hours}:{flashTimer.minutes}:{flashTimer.seconds}
            </span>
          </div>
        </div>
      )}

      {/* Tabs Phân Loại Nhanh */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs justify-center scrollbar-none">
        {[
          { id: 'ALL', label: `Tất cả (${activePromotions.length})` },
          { id: 'FREESHIP', label: '🚚 Mã Vận Chuyển' },
          { id: 'DOUBLE_DAY', label: '🔥 Ngày Đôi & Flash' },
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

      {/* Voucher List */}
      <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1 no-scrollbar">
        {filteredPromotions.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs font-semibold">
            Hiện chưa có ưu đãi trong mục này.
          </div>
        ) : (
          filteredPromotions.map((promo) => {
            const saved = isVoucherSaved(promo.code);
            const isShipping = promo.voucherScope === 'SHIPPING' || promo.discountType === 'FREESHIP';
            const isDouble = promo.campaignType === 'DOUBLE_DAY' || promo.campaignType === 'FLASH_DEAL';

            return (
              <div
                key={promo.id}
                className={`p-3 sm:p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 shadow-2xs hover:shadow-xs ${
                  isShipping
                    ? 'border-emerald-200/90 bg-emerald-50/40'
                    : isDouble
                    ? 'border-orange-200/90 bg-orange-50/40'
                    : 'border-rose-200/90 bg-rose-50/40'
                }`}
              >
                <div className="space-y-1 min-w-0 flex-1">
                  {/* Badge & Discount Amount - TUYỆT ĐỐI KHÔNG HIỂN THỊ MÃ THÔ */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className={`text-xs sm:text-sm font-black tracking-tight ${
                        isShipping ? 'text-emerald-700' : isDouble ? 'text-orange-700' : 'text-rose-700'
                      }`}
                    >
                      {promo.discountType === 'PERCENT'
                        ? `Giảm ${promo.discountAmount}%`
                        : `Giảm ${formatPrice(promo.discountAmount)}`}
                    </span>
                    {promo.maxDiscount && promo.discountType === 'PERCENT' && (
                      <span className="text-[10.5px] font-bold text-slate-500">
                        (Tối đa {formatPrice(promo.maxDiscount)})
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                        isShipping
                          ? 'bg-emerald-100/80 text-emerald-800 border-emerald-300/80'
                          : isDouble
                          ? 'bg-orange-100/80 text-orange-800 border-orange-300/80'
                          : 'bg-rose-100/80 text-rose-800 border-rose-300/80'
                      }`}
                    >
                      {promo.badge}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-slate-800 truncate">{promo.title}</div>
                  <div className="text-[11px] text-slate-500 line-clamp-1">{promo.description}</div>

                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold pt-0.5 flex-wrap">
                    <span>
                      {promo.minOrder > 0 ? `Đơn tối thiểu ${formatPrice(promo.minOrder)}` : 'Đơn từ 0₫'}
                    </span>
                    <span>•</span>
                    <span>HSD: {promo.validUntil}</span>
                    {promo.usageLimit && (
                      <>
                        <span>•</span>
                        <span className="text-slate-500">Giới hạn {promo.usageLimit} lượt</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Smart Action Buttons: LƯU & SỬ DỤNG */}
                {saved ? (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      setIsCartOpen(true);
                      showToast('Voucher đã lưu trong ví, sẵn sàng sử dụng khi đặt hoa!', 'info');
                    }}
                    className="shrink-0 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                    title="Mở giỏ hàng để sử dụng mã này"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Sử dụng</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSaveVoucher(promo)}
                    className={`shrink-0 px-3.5 py-2 text-xs font-bold text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                      isShipping
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : isDouble
                        ? 'bg-orange-600 hover:bg-orange-700'
                        : 'bg-rose-600 hover:bg-rose-700'
                    }`}
                    title="Lưu voucher vào ví cá nhân"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Lưu</span>
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
        <span className="text-[11px] text-slate-500 truncate">
          {customer
            ? `Ví cá nhân: ${(customer.userVouchers || []).filter((v) => !v.isUsed).length} voucher khả dụng`
            : 'Đăng nhập để tự động lưu voucher'}
        </span>
        <button
          onClick={onClose}
          className="shrink-0 px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

// 3. App Download Modal Content
export const AppDownloadModalContent: React.FC<PromoModalProps> = () => {
  const [platform, setPlatform] = useState<'android' | 'ios'>('android');
  const [copied, setCopied] = useState(false);
  const { showToast } = useStore();

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://vvflorielle.pages.dev');
    setCopied(true);
    showToast('Đã sao chép đường dẫn: https://vvflorielle.pages.dev', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center mx-auto mb-2 shadow-md shrink-0">
          <Smartphone className="w-6 h-6" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10.5px] font-bold">
          <span>Phiên bản v1.0.0</span>
          <span className="w-1 h-1 rounded-full bg-emerald-500" />
          <span>Android APK &amp; iOS PWA</span>
        </div>
        <h3 className="font-extrabold text-lg text-slate-900 tracking-tight">
          Cài Đặt App V&amp;V Florielle
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Đặt hoa siêu tốc, theo dõi tiến độ cắm hoa theo thời gian thực và nhận thông báo tích điểm VIP
        </p>
      </div>

      {/* Tabs chuyển đổi Android vs iPhone (iOS) */}
      <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200">
        <button
          type="button"
          onClick={() => setPlatform('android')}
          className={`py-2 px-3 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
            platform === 'android'
              ? 'bg-white text-emerald-900 shadow-sm border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>🤖 Android (File APK)</span>
        </button>

        <button
          type="button"
          onClick={() => setPlatform('ios')}
          className={`py-2 px-3 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
            platform === 'ios'
              ? 'bg-white text-emerald-900 shadow-sm border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>🍏 iPhone (iOS WebClip)</span>
        </button>
      </div>

      {platform === 'android' ? (
        // ==================== TAB 1: ANDROID APK DIRECT ====================
        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5 text-xs text-slate-700">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="font-semibold text-slate-600">Dung lượng bộ cài:</span>
              <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg">Chỉ 0.85 MB</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="font-semibold text-slate-600">Hệ điều hành tương thích:</span>
              <span className="font-bold text-slate-800">Android 7.0 trở lên</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-600">Bảo mật ứng dụng:</span>
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Ký số an toàn 100% (Signed APK)</span>
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <a
              href="/VVFlorielle.apk"
              download="VVFlorielle.apk"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/25 transition-all cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Tải Xuống Trực Tiếp (VVFlorielle.apk - 0.85MB)</span>
            </a>
            <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/70 text-[11px] text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <span>💡 3 Bước Cài Đặt Trên Điện Thoại Android:</span>
              </div>
              <ol className="list-decimal list-inside space-y-0.5 text-amber-800">
                <li>Bấm nút xanh ở trên để tải file <code>VVFlorielle.apk</code> về máy.</li>
                <li>Mở file từ thanh thông báo hoặc thư mục Tải về (Download).</li>
                <li>Chọn <em>"Cài đặt"</em> (nếu máy hỏi, bật <em>"Cho phép từ nguồn này"</em>).</li>
              </ol>
            </div>
          </div>
        </div>
      ) : (
        // ==================== TAB 2: IPHONE / IOS PWA WEBCLIP GUIDE ====================
        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-950 space-y-2">
            <div className="font-extrabold text-sm text-emerald-900 flex items-center gap-1.5">
              <span>📱 Hướng Dẫn Cài Đặt Trên iPhone (Không Cần App Store)</span>
            </div>
            <p className="text-[11.5px] text-emerald-800 leading-relaxed">
              Apple không cho cài file APK trực tiếp. Tuy nhiên, bạn có thể thêm V&amp;V Florielle làm ứng dụng chính thức lên màn hình chính iPhone chỉ trong 10 giây bằng công nghệ Apple WebClip:
            </p>
          </div>

          {/* Các bước trên iPhone */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs text-slate-800">
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">1</span>
              <div>
                <span className="font-bold text-slate-900">Mở Safari:</span>
                <p className="text-[11px] text-slate-600 mt-0.5">Mở trình duyệt <strong>Safari</strong> trên iPhone và truy cập: <code className="bg-slate-200 px-1 py-0.5 rounded text-[10px]">vvflorielle.pages.dev</code></p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">2</span>
              <div>
                <span className="font-bold text-slate-900">Bấm nút Chia sẻ:</span>
                <p className="text-[11px] text-slate-600 mt-0.5">Nhấn vào biểu tượng <strong>Chia sẻ (Share <Share2 className="w-3 h-3 inline text-sky-600" />)</strong> ở thanh công cụ dưới đáy màn hình Safari.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">3</span>
              <div>
                <span className="font-bold text-slate-900">Thêm vào Màn hình chính:</span>
                <p className="text-[11px] text-slate-600 mt-0.5">Cuộn menu tìm và chọn <strong>"Thêm vào MH chính" (Add to Home Screen)</strong> rồi bấm <strong>"Thêm" (Add)</strong> ở góc trên bên phải.</p>
              </div>
            </div>
          </div>

          {/* Ưu điểm & Nút Sao chép Link */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-md"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã Sao Chép Link!' : 'Sao Chép Link Mở Safari'}</span>
            </button>

            <a
              href="https://vvflorielle.pages.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs flex items-center justify-center gap-1 transition-all"
            >
              <span>Mở Web</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <p className="text-[10px] text-center text-slate-400">
            ✨ Biểu tượng V&amp;V Florielle sẽ xuất hiện trên màn hình iPhone, mở ứng dụng tràn viền toàn màn hình không thanh địa chỉ như app App Store!
          </p>
        </div>
      )}
    </div>
  );
};
