import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { useBodyScrollLock } from '../../utils/scrollLock';
import {
  Sparkles,
  Gift,
  ShieldCheck,
  Send,
  KeyRound,
  CheckCircle2,
  Copy,
  Users,
  Calendar,
  X,
  Tag
} from 'lucide-react';
import { CustomerUser } from '../../types';

interface PrivilegeVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCustomerId?: string;
}

export const PrivilegeVoucherModal: React.FC<PrivilegeVoucherModalProps> = ({ isOpen, onClose, initialCustomerId }) => {
  const { customers, grantPrivilegeVoucher, showToast } = useStore();

  const [dropMethod, setDropMethod] = useState<'DIRECT_DROP' | 'TOKEN_16'>('DIRECT_DROP');
  const [targetType, setTargetType] = useState<'SPECIFIC_CUSTOMER' | 'BIRTHDAY_MONTH' | 'VIP_RUBY' | 'ALL_MEMBERS'>('SPECIFIC_CUSTOMER');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(initialCustomerId || customers[0]?.id || '');
  const [voucherName, setVoucherName] = useState('Đặc quyền Tri Ân V&V Florielle');
  const [voucherScope, setVoucherScope] = useState<'FLOWER' | 'SHIPPING'>('FLOWER');
  const [discountAmount, setDiscountAmount] = useState<number>(50000);
  const [minOrder, setMinOrder] = useState<number>(300000);
  const [expiryDays, setExpiryDays] = useState<number>(30);

  const [createdCodeResult, setCreatedCodeResult] = useState<string | null>(null);

  useEffect(() => {
    if (initialCustomerId) {
      setSelectedCustomerId(initialCustomerId);
      setTargetType('SPECIFIC_CUSTOMER');
    }
  }, [initialCustomerId, isOpen]);

  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherName.trim()) {
      showToast('Vui lòng nhập tên voucher đặc quyền!', 'error');
      return;
    }
    if (discountAmount <= 0) {
      showToast('Mức giảm phải lớn hơn 0đ!', 'error');
      return;
    }

    const res = grantPrivilegeVoucher({
      dropMethod,
      targetType,
      targetCustomerId: targetType === 'SPECIFIC_CUSTOMER' ? selectedCustomerId : undefined,
      voucherName: voucherName.trim(),
      voucherScope,
      discountAmount,
      minOrder,
      expiryDays
    });

    if (res.success) {
      if (dropMethod === 'TOKEN_16' && res.code) {
        setCreatedCodeResult(res.code);
      } else {
        onClose();
      }
    }
  };

  const handleCopyCode = () => {
    if (!createdCodeResult) return;
    navigator.clipboard.writeText(createdCodeResult);
    showToast(`Đã sao chép mã: ${createdCodeResult}`, 'success');
  };

  return (
    <div
      className="fixed inset-0 z-[100050] flex items-center justify-center p-3 sm:p-5 bg-slate-900/25 backdrop-blur-sm select-none animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative bg-white rounded-[32px] max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-purple-100 space-y-4 max-h-[92dvh] sm:max-h-[88vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer z-10"
          title="Đóng"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-1.5 pb-3 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 mx-auto flex items-center justify-center shadow-xs">
            <Sparkles className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-purple-900 font-extrabold text-base tracking-tight">
            Tạo Voucher Ẩn &amp; Đặc Quyền Bảo Mật
          </h3>
          <p className="text-xs text-slate-500">
            Cấp mã ưu đãi riêng cho khách VIP hoặc sự kiện tri ân kín đáo
          </p>
        </div>

        {createdCodeResult ? (
          <div className="py-6 space-y-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-700 mx-auto flex items-center justify-center border border-purple-200 shadow-md">
              <KeyRound className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-base">Đã Sinh Mã Token Bảo Mật Thành Công!</h3>
              <p className="text-xs text-slate-500 mt-1">
                Mã này được ẩn hoàn toàn trên web và chỉ có thể sử dụng bởi người được cấp.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/90 border-2 border-dashed border-purple-300 max-w-xs mx-auto space-y-2">
              <span className="text-[10px] uppercase font-bold text-purple-600 tracking-wider block">
                MÃ TOKEN 16 KÝ TỰ BẢO MẬT
              </span>
              <div className="font-mono text-base font-extrabold text-purple-900 tracking-widest select-all">
                {createdCodeResult}
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                className="btn-primary text-xs py-1.5 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Sao Chép Mã</span>
              </button>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setCreatedCodeResult(null);
                  onClose();
                }}
                className="btn-secondary text-xs py-2 px-6 rounded-xl font-bold cursor-pointer"
              >
                Hoàn tất &amp; Đóng
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Phương thức phát hành */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">1. Hình Thức Phát Hành *</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDropMethod('DIRECT_DROP')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    dropMethod === 'DIRECT_DROP'
                      ? 'border-purple-600 bg-purple-50/70 text-purple-900 ring-2 ring-purple-200'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5">
                    <span>🚀 Cấp Thẳng Vào Ví</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                    Không có mã chữ, tự động lưu vào ví voucher của khách. Chống rò rỉ mã 100%!
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setDropMethod('TOKEN_16')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    dropMethod === 'TOKEN_16'
                      ? 'border-purple-600 bg-purple-50/70 text-purple-900 ring-2 ring-purple-200'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5">
                    <span>🔐 Token 16 Ký Tự</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                    Sinh mã chữ ngẫu nhiên dài 16 ký tự, thích hợp in thiệp hoặc gửi riêng.
                  </p>
                </button>
              </div>
            </div>

            {/* Đối tượng thụ hưởng */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">2. Đối Tượng Nhận Đặc Quyền *</label>
              <select
                value={targetType}
                onChange={(e) => setTargetType(e.target.value as any)}
                className="glass-input w-full text-xs py-2 rounded-xl"
              >
                <option value="SPECIFIC_CUSTOMER">👤 Khách hàng cụ thể (Chọn theo tài khoản)</option>
                <option value="BIRTHDAY_MONTH">🎂 Hội viên có sinh nhật trong tháng này</option>
                <option value="VIP_RUBY">💎 Hội viên VIP Ruby &amp; Kim Cương</option>
                <option value="ALL_MEMBERS">🌟 Toàn bộ thành viên đã đăng ký</option>
              </select>

              {targetType === 'SPECIFIC_CUSTOMER' && (
                <div className="pt-1">
                  <label className="text-[11px] text-slate-500 block mb-1">Chọn tài khoản khách hàng:</label>
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    className="glass-input w-full text-xs py-2 rounded-xl"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.fullName} - {c.phone} ({c.accountCode || 'Chưa có mã'} - {c.tier})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Tên & Phạm vi voucher */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Tên Voucher Đặc Quyền *</label>
                <input
                  type="text"
                  required
                  value={voucherName}
                  onChange={(e) => setVoucherName(e.target.value)}
                  placeholder="VD: Quà tặng sinh nhật tháng 11..."
                  className="glass-input w-full text-xs py-2 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Phạm Vi Giảm Trừ *</label>
                <select
                  value={voucherScope}
                  onChange={(e) => setVoucherScope(e.target.value as any)}
                  className="glass-input w-full text-xs py-2 rounded-xl"
                >
                  <option value="FLOWER">🌸 Giảm Tiền Hoa (Trừ thẳng vào bó hoa)</option>
                  <option value="SHIPPING">🚚 Giảm Cước Vận Chuyển (Freeship)</option>
                </select>
              </div>
            </div>

            {/* Mức giảm & Đơn tối thiểu */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Mức Giảm (VNĐ) *</label>
                <input
                  type="number"
                  step="5000"
                  min="5000"
                  required
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(Number(e.target.value) || 0)}
                  className="glass-input w-full text-xs py-2 font-mono rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Đơn Tối Thiểu (VNĐ) *</label>
                <input
                  type="number"
                  step="10000"
                  min="0"
                  required
                  value={minOrder}
                  onChange={(e) => setMinOrder(Number(e.target.value) || 0)}
                  className="glass-input w-full text-xs py-2 font-mono rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Thời Hạn (Ngày) *</label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  required
                  value={expiryDays}
                  onChange={(e) => setExpiryDays(Number(e.target.value) || 30)}
                  className="glass-input w-full text-xs py-2 font-mono rounded-xl"
                />
              </div>
            </div>

            <div className="p-3 bg-purple-50/80 rounded-xl border border-purple-200 text-purple-900 text-[11px] space-y-1">
              <strong>Bảo Mật &amp; Kiểm Soát Ngân Sách:</strong>
              <p className="text-slate-600 leading-snug">
                Voucher đặc quyền sẽ không hiển thị trên website công khai, chống người ngoài đoán mã hoặc lạm dụng chiết khấu.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="btn-primary py-2 px-5 rounded-xl text-xs font-bold bg-purple-700 hover:bg-purple-800 flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Phát Hành Voucher Đặc Quyền</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
