import React, { useState, useMemo } from 'react';
import { Gift, Plus, Trash2, ArrowLeft, Pencil, Send, Tag, Navigation, Flame, Clock, Users, Zap, Eye, EyeOff, Sparkles } from 'lucide-react';
import { PromotionItem } from '../../../types';
import { ActionConfirmModal } from '../ManagementModals';
import { PrivilegeVoucherModal } from '../PrivilegeVoucherModal';
import { useStore } from '../../../context/StoreContext';

interface PromotionsSubpageProps {
  promotions: PromotionItem[];
  onBackToDashboard: () => void;
  onOpenAddVoucher: () => void;
  onOpenEditVoucher?: (promo: PromotionItem) => void;
  updatePromotions: (promos: PromotionItem[]) => void;
  formatPrice: (p: number) => string;
  title?: string;
}

export const PromotionsSubpage: React.FC<PromotionsSubpageProps> = ({
  promotions,
  onBackToDashboard,
  onOpenAddVoucher,
  onOpenEditVoucher,
  updatePromotions,
  formatPrice,
  title = 'Quản Lý Voucher & Mã Ưu Đãi'
}) => {
  const { airdropVoucherToAllCustomers, showToast } = useStore();
  const [voucherToDelete, setVoucherToDelete] = useState<PromotionItem | null>(null);
  const [voucherToAirdrop, setVoucherToAirdrop] = useState<PromotionItem | null>(null);
  const [isPrivilegeModalOpen, setIsPrivilegeModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'ALL' | 'PUBLIC' | 'PRIVATE' | 'FLOWER' | 'SHIPPING'>('ALL');

  const filteredPromotions = useMemo(() => {
    return promotions.filter((p) => {
      if (activeTab === 'PUBLIC') return p.showOnPublicWeb !== false;
      if (activeTab === 'PRIVATE') return p.showOnPublicWeb === false;
      if (activeTab === 'FLOWER') return p.voucherScope === 'FLOWER' || (!p.voucherScope && p.discountType !== 'FREESHIP');
      if (activeTab === 'SHIPPING') return p.voucherScope === 'SHIPPING' || p.discountType === 'FREESHIP';
      return true;
    });
  }, [promotions, activeTab]);

  const counts = useMemo(() => {
    return {
      all: promotions.length,
      public: promotions.filter((p) => p.showOnPublicWeb !== false).length,
      private: promotions.filter((p) => p.showOnPublicWeb === false).length,
      flower: promotions.filter((p) => p.voucherScope === 'FLOWER' || (!p.voucherScope && p.discountType !== 'FREESHIP')).length,
      shipping: promotions.filter((p) => p.voucherScope === 'SHIPPING' || p.discountType === 'FREESHIP').length
    };
  }, [promotions]);

  return (
    <div className="glass-panel p-5 sm:p-6 space-y-5 rounded-[28px] animate-in fade-in duration-200">
      {/* 1. Header căn giữa chuẩn Phototiinlove */}
      <div className="pb-3 border-b border-slate-200/80 text-center">
        <small className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-rose-700">
          HỆ THỐNG VOUCHER &amp; ĐẶC QUYỀN HỘI VIÊN
        </small>
        <h2 className="font-extrabold text-sm sm:text-lg text-slate-900 tracking-tight">
          {title}
        </h2>
      </div>

      {/* 2. Tiêu đề phụ & Action Bar */}
      <div className="flex flex-col gap-3 border-b border-slate-200 pb-3">
        <div className="text-center space-y-0.5">
          <h3 className="font-bold text-base text-slate-800 flex items-center justify-center gap-2">
            <Gift className="w-5 h-5 text-rose-600" />
            <span>Quản Lý Voucher &amp; Mã Khuyến Mại ({promotions.length})</span>
          </h3>
          <p className="text-xs text-slate-500">
            Cấu hình voucher kép (Hoa &amp; Vận chuyển), Flash Deal khung giờ vàng, Ngày Đôi, Sinh Nhật &amp; Airdrop toàn dân.
          </p>
        </div>

        <div className="flex items-center justify-center sm:justify-end gap-2 flex-wrap shrink-0 pt-1">
          <button
            type="button"
            onClick={() => setIsPrivilegeModalOpen(true)}
            className="btn-primary text-xs py-2 px-3.5 rounded-xl bg-purple-700 hover:bg-purple-800 shadow-md flex items-center gap-1.5 cursor-pointer shrink-0 font-bold"
            title="Tạo voucher bí mật, quà sinh nhật hoặc đặc quyền cấp riêng vào ví"
          >
            <Sparkles className="w-4 h-4" />
            <span>Tạo Voucher Ẩn &amp; Đặc Quyền</span>
          </button>

          <button
            type="button"
            onClick={onOpenAddVoucher}
            className="btn-primary text-xs py-2 px-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 shadow-md flex items-center gap-1.5 cursor-pointer shrink-0 font-bold"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo Voucher Mới</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('ALL')}
          className={`py-1.5 px-3 rounded-xl transition-all cursor-pointer shrink-0 ${
            activeTab === 'ALL'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Tất cả ({counts.all})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('PUBLIC')}
          className={`py-1.5 px-3 rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
            activeTab === 'PUBLIC'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Công khai web ({counts.public})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('PRIVATE')}
          className={`py-1.5 px-3 rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
            activeTab === 'PRIVATE'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <EyeOff className="w-3.5 h-3.5" />
          <span>Mã ẩn / Sinh nhật ({counts.private})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('FLOWER')}
          className={`py-1.5 px-3 rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
            activeTab === 'FLOWER'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>🌸 Voucher Hoa Tươi ({counts.flower})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('SHIPPING')}
          className={`py-1.5 px-3 rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
            activeTab === 'SHIPPING'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>🚚 Voucher Vận Chuyển ({counts.shipping})</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPromotions.map((promo) => {
          const isShipping = promo.voucherScope === 'SHIPPING' || promo.discountType === 'FREESHIP';

          return (
            <div
              key={promo.id}
              className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3 flex flex-col justify-between hover:border-slate-300 transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-black text-xs text-emerald-900 bg-emerald-100/90 px-2 py-0.5 rounded-lg border border-emerald-300">
                      {promo.code}
                    </span>
                    <span
                      className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md ${
                        isShipping
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {isShipping ? 'VẬN CHUYỂN' : 'GIẢM GIÁ HOA'}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      promo.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {promo.isActive ? 'Đang áp dụng' : 'Tạm dừng'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  {promo.badge && (
                    <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                      {promo.badge}
                    </span>
                  )}
                  {promo.hourlyDealStart && (
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full flex items-center gap-0.5 border border-rose-200">
                      <Flame className="w-3 h-3 text-rose-600 fill-rose-600" />
                      <span>{promo.hourlyDealStart}-{promo.hourlyDealEnd}</span>
                    </span>
                  )}
                  {promo.showOnPublicWeb === false ? (
                    <span className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                      Mã ẩn / Ví hội viên
                    </span>
                  ) : (
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Công khai
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-xs text-slate-900 mt-2">{promo.title}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{promo.description}</p>

                <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Mức giảm:</span>
                    <strong className="text-rose-700 font-extrabold">{formatPrice(promo.discountAmount)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Đơn tối thiểu:</span>
                    <strong className="text-slate-800">{formatPrice(promo.minOrder)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Lượt đã dùng:</span>
                    <strong className="text-slate-700">
                      {promo.usedCount || 0} / {promo.usageLimit ? `${promo.usageLimit} lượt` : 'Không giới hạn'}
                    </strong>
                  </div>
                  {promo.maxShippingRadiusKm && (
                    <div className="flex justify-between text-blue-700">
                      <span>Bán kính ship tối đa:</span>
                      <strong>{promo.maxShippingRadiusKm} km</strong>
                    </div>
                  )}
                  {promo.pointsToRedeem && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Điểm đổi:</span>
                      <strong>{promo.pointsToRedeem} điểm</strong>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs gap-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const updated = promotions.map((p) => (p.id === promo.id ? { ...p, isActive: !p.isActive } : p));
                      updatePromotions(updated);
                    }}
                    className="text-purple-700 hover:text-purple-900 text-[11px] font-semibold cursor-pointer"
                  >
                    {promo.isActive ? 'Tạm dừng' : 'Kích hoạt'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setVoucherToAirdrop(promo)}
                    className="text-emerald-700 hover:text-emerald-900 text-[11px] font-bold flex items-center gap-0.5 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-200 cursor-pointer"
                    title="Phát trực tiếp vào ví tất cả khách hàng"
                  >
                    <Send className="w-3 h-3 text-emerald-600" />
                    <span>Airdrop</span>
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  {onOpenEditVoucher && (
                    <button
                      type="button"
                      onClick={() => onOpenEditVoucher(promo)}
                      className="p-1 rounded-lg text-slate-500 hover:text-purple-700 hover:bg-purple-50 cursor-pointer flex items-center gap-1 font-semibold text-[11px]"
                      title="Chỉnh sửa voucher"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Sửa</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setVoucherToDelete(promo)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                    title="Xóa voucher"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal xác nhận xóa */}
      <ActionConfirmModal
        isOpen={Boolean(voucherToDelete)}
        onClose={() => setVoucherToDelete(null)}
        onConfirm={() => {
          if (voucherToDelete) {
            const updated = promotions.filter((p) => p.id !== voucherToDelete.id);
            updatePromotions(updated);
            setVoucherToDelete(null);
          }
        }}
        title="Xóa Mã Giảm Giá / Voucher"
        message={`Bạn có chắc muốn xóa mã voucher "${voucherToDelete?.code}" (${voucherToDelete?.title}) khỏi hệ thống? Khách hàng sẽ không thể nhập hoặc đổi mã này nữa.`}
        confirmText="Xóa Voucher"
        type="danger"
      />

      {/* Modal xác nhận Airdrop toàn dân */}
      <ActionConfirmModal
        isOpen={Boolean(voucherToAirdrop)}
        onClose={() => setVoucherToAirdrop(null)}
        onConfirm={() => {
          if (voucherToAirdrop) {
            const count = airdropVoucherToAllCustomers(voucherToAirdrop);
            setVoucherToAirdrop(null);
          }
        }}
        title="Phát Hành Sự Kiện Toàn Dân (Airdrop)"
        message={`Bạn có chắc muốn phát hành voucher "${voucherToAirdrop?.code}" (${voucherToAirdrop?.title}) vào ví voucher cá nhân của TOÀN BỘ khách hàng đang hoạt động trong hệ thống? Khách hàng sẽ thấy mã này ngay trong giỏ hàng và trang cá nhân.`}
        confirmText="Phát Hành Airdrop"
        type="info"
      />

      {/* Modal Tạo Voucher Ẩn & Đặc Quyền */}
      <PrivilegeVoucherModal
        isOpen={isPrivilegeModalOpen}
        onClose={() => setIsPrivilegeModalOpen(false)}
      />
    </div>
  );
};
