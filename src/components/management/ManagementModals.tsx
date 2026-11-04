import React, { useState } from 'react';
import {
  X,
  Lock,
  KeyRound,
  Mail,
  ShieldCheck,
  Save,
  Truck,
  DollarSign,
  Gift,
  Sparkles,
  CheckCircle2,
  Phone,
  Eye,
  Camera,
  Layers,
  Check,
  Copy
} from 'lucide-react';
import { ShopSettings, PromotionItem, Order, CustomerUser, FlowerProduct, CategoryId, ContactChannel } from '../../types';
import { AVAILABLE_MASCOTS } from '../../data/mockData';

// 1. ADMIN & OWNER SECURITY MODAL
export interface SecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  roleTitle?: string;
  onSaveCredentials: (oldPass: string, oldPin: string, newPass: string, newPin: string) => boolean;
  adminEmail?: string;
  onSaveEmailConfig?: (email: string, appPass: string) => void;
}

export const SecurityModal: React.FC<SecurityModalProps> = ({
  isOpen,
  onClose,
  roleTitle = 'Super Admin',
  onSaveCredentials,
  adminEmail = 'vvflorielle@gmail.com',
  onSaveEmailConfig
}) => {
  const [oldPassword, setOldPassword] = useState('');
  const [oldPin, setOldPin] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPin, setNewPin] = useState('');
  const [email, setEmail] = useState(adminEmail);
  const [appPassword, setAppPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = onSaveCredentials(oldPassword, oldPin, newPassword, newPin);
    if (ok) {
      if (onSaveEmailConfig && email) {
        onSaveEmailConfig(email, appPassword);
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 p-6 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-xs">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-800">
                Bảo Mật &amp; Đổi Mật Khẩu ({roleTitle})
              </h3>
              <p className="text-xs text-slate-500">Quản lý mật khẩu đăng nhập, PIN cấp 2 và Gmail</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Mật khẩu hiện tại *</label>
              <input
                type="password"
                required
                placeholder="Nhập mật khẩu cũ..."
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="glass-input w-full py-2 px-3 rounded-xl"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Mã PIN cũ (nếu có)</label>
              <input
                type="password"
                placeholder="Nhập PIN cũ..."
                value={oldPin}
                onChange={(e) => setOldPin(e.target.value)}
                className="glass-input w-full py-2 px-3 rounded-xl"
              />
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <h4 className="font-bold text-slate-700 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-purple-600" />
              <span>Thiết lập thông tin bảo mật mới</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mật khẩu mới</label>
                <input
                  type="password"
                  placeholder="Để trống nếu không đổi"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="glass-input w-full py-2 px-3 rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mã PIN mới (6 - 8 số)</label>
                <input
                  type="password"
                  maxLength={8}
                  placeholder="Để trống nếu không đổi"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  className="glass-input w-full py-2 px-3 rounded-xl font-mono text-center tracking-widest"
                />
              </div>
            </div>
          </div>

          {onSaveEmailConfig && (
            <div className="p-3 rounded-2xl bg-sky-50 border border-sky-100 space-y-2">
              <h4 className="font-bold text-sky-800 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-sky-600" />
                <span>Gmail nhận mã OTP khôi phục</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Hòm thư Gmail</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vvflorielle@gmail.com"
                    className="glass-input w-full py-2 px-3 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Mật khẩu ứng dụng (16 ký tự)</label>
                  <input
                    type="password"
                    placeholder="xxxx xxxx xxxx xxxx"
                    value={appPassword}
                    onChange={(e) => setAppPassword(e.target.value)}
                    className="glass-input w-full py-2 px-3 rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 font-semibold"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold shadow-md flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Lưu Thiết Lập</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 2. SHIPPING & FREESHIP CONFIG MODAL
export interface ShippingConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ShopSettings;
  onSave: (newSettings: ShopSettings) => void;
}

export const ShippingConfigModal: React.FC<ShippingConfigModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave
}) => {
  const [formData, setFormData] = useState<ShopSettings>(settings);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 p-6 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-800">
                Cấu Hình Bảng Cước Vận Chuyển 4 Bậc &amp; Bán Kính
              </h3>
              <p className="text-xs text-slate-500">Thiết lập cước hỏa tốc từ 15 phút nội thành, 60 phút ngoại thành</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-2">
            <h4 className="font-bold text-emerald-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Chính sách Freeship &amp; Bán kính giao hàng</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Đơn hoa tối thiểu để Freeship (VNĐ)</label>
                <input
                  type="number"
                  value={formData.freeShipThreshold}
                  onChange={(e) => setFormData({ ...formData, freeShipThreshold: Number(e.target.value) })}
                  className="glass-input w-full py-2 px-3 rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Bán kính giao tối đa (km)</label>
                <input
                  type="number"
                  value={formData.maxDeliveryRadiusKm || 25}
                  onChange={(e) => setFormData({ ...formData, maxDeliveryRadiusKm: Number(e.target.value) })}
                  className="glass-input w-full py-2 px-3 rounded-xl"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-800">Biểu Phí Giao Hàng &amp; Cam Kết Hỏa Tốc</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="font-bold text-slate-700 block mb-1">Cước cơ bản (0 - 3km)</span>
                <input
                  type="number"
                  value={formData.standardShipFee}
                  onChange={(e) => setFormData({ ...formData, standardShipFee: Number(e.target.value) })}
                  className="glass-input w-full py-1.5 px-3 rounded-xl"
                />
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="font-bold text-slate-700 block mb-1">Cước phụ trội theo km (sau 3km)</span>
                <input
                  type="number"
                  value={formData.shippingFeePerKm}
                  onChange={(e) => setFormData({ ...formData, shippingFeePerKm: Number(e.target.value) })}
                  className="glass-input w-full py-1.5 px-3 rounded-xl"
                />
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="font-bold text-slate-700 block mb-1">Bán kính áp dụng Freeship (km)</span>
                <input
                  type="number"
                  value={formData.freeShipRadiusKm || 3}
                  onChange={(e) => setFormData({ ...formData, freeShipRadiusKm: Number(e.target.value) })}
                  className="glass-input w-full py-1.5 px-3 rounded-xl"
                />
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="font-bold text-slate-700 block mb-1">Cam kết thời gian giao</span>
                <input
                  type="text"
                  value={formData.deliveryTimeEstimate || 'Từ 15 phút nội thành, 60 phút ngoại thành'}
                  onChange={(e) => setFormData({ ...formData, deliveryTimeEstimate: e.target.value })}
                  className="glass-input w-full py-1.5 px-3 rounded-xl"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 font-semibold"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-md flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Lưu Cấu Hình Cước</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 3. QUICK VOUCHER MODAL (FOR HOLIDAYS)
export interface QuickVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateVoucher: (promo: PromotionItem) => void;
}

export const QuickVoucherModal: React.FC<QuickVoucherModalProps> = ({
  isOpen,
  onClose,
  onCreateVoucher
}) => {
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState(30000);
  const [minOrder, setMinOrder] = useState(400000);
  const [badge, setBadge] = useState('DỊP LỄ');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const newPromo: PromotionItem = {
      id: `promo-${Date.now()}`,
      code: code.trim().toUpperCase(),
      title: `Ưu Đãi Đặc Biệt: ${code.toUpperCase()}`,
      description: `Giảm ${new Intl.NumberFormat('vi-VN').format(discount)}đ cho đơn từ ${new Intl.NumberFormat('vi-VN').format(minOrder)}đ`,
      discountAmount: Number(discount),
      minOrder: Number(minOrder),
      badge,
      validUntil: '2026-12-31',
      discountType: 'FIXED',
      isActive: true
    };
    onCreateVoucher(newPromo);
    onClose();
  };

  const handleQuickPreset = (presetCode: string, disc: number, min: number, b: string) => {
    setCode(presetCode);
    setDiscount(disc);
    setMinOrder(min);
    setBadge(b);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-xs">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-800">Tạo Nhanh Voucher Dịp Lễ</h3>
              <p className="text-xs text-slate-500">Tạo mã ưu đãi cho ngày lễ trong 30 giây</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-600 block">Gợi ý tạo nhanh cho dịp lễ:</span>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickPreset('FLORAL83', 50000, 500000, 'QUỐC TẾ PHỤ NỮ')}
              className="px-2.5 py-1 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 text-xs font-semibold"
            >
              🌸 8/3 Giảm 50K
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('LOVE2010', 40000, 450000, '20/10 PHỤ NỮ VN')}
              className="px-2.5 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold"
            >
              🌹 20/10 Giảm 40K
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('SWEET1402', 60000, 600000, 'VALENTINE')}
              className="px-2.5 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-semibold"
            >
              💖 Valentine Giảm 60K
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('FREESHIP30K', 30000, 350000, 'FREESHIP')}
              className="px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold"
            >
              🚚 Freeship 30K
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Mã Voucher *</label>
            <input
              type="text"
              required
              placeholder="VD: VUONHOA50K"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="glass-input w-full py-2 px-3 rounded-xl font-mono tracking-wider uppercase font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Mức giảm (VNĐ) *</label>
              <input
                type="number"
                required
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="glass-input w-full py-2 px-3 rounded-xl"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Đơn tối thiểu (VNĐ)</label>
              <input
                type="number"
                required
                value={minOrder}
                onChange={(e) => setMinOrder(Number(e.target.value))}
                className="glass-input w-full py-2 px-3 rounded-xl"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 font-semibold"
            >
              Đóng
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md flex items-center gap-1.5"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Phát Hành Mã</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 4. MASCOT SELECTOR MODAL (6 MASCOTS)
export interface MascotSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMascotId?: string;
  onSelectMascot: (mascotId: string) => void;
}

export const MascotSelectorModal: React.FC<MascotSelectorModalProps> = ({
  isOpen,
  onClose,
  currentMascotId,
  onSelectMascot
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-800">Chọn Linh Vật Tiệm Hoa (6 Mascot Mới)</h3>
              <p className="text-xs text-slate-500">Admin có thể chọn và thay thế linh vật hiển thị trên giao diện</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          {AVAILABLE_MASCOTS.map((m) => {
            const isSelected = currentMascotId === m.url || currentMascotId === m.id;
            return (
              <div
                key={m.id}
                onClick={() => {
                  onSelectMascot(m.url);
                  onClose();
                }}
                className={`group relative p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-pink-50/90 border-pink-400 ring-2 ring-pink-200 shadow-md'
                    : 'bg-white/80 border-slate-200 hover:border-pink-300 hover:shadow-lg'
                }`}
              >
                <div className="relative w-24 h-24 mx-auto mb-2 overflow-hidden rounded-xl bg-pink-50/50 flex items-center justify-center">
                  <img
                    src={m.url}
                    alt={m.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  {isSelected && (
                    <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-pink-600 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                      ✓
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-xs text-slate-800 line-clamp-1">{m.name}</h4>
                <button
                  type="button"
                  className={`mt-2 w-full py-1 rounded-xl text-[11px] font-bold transition-colors ${
                    isSelected
                      ? 'bg-pink-600 text-white shadow-xs'
                      : 'bg-slate-100 group-hover:bg-pink-100 text-slate-600 group-hover:text-pink-700'
                  }`}
                >
                  {isSelected ? 'Đang Sử Dụng' : 'Chọn Linh Vật'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// 5. QUICK BILL PREVIEW MODAL
export interface BillPreviewModalProps {
  order: Order | null;
  onClose: () => void;
  onApproveDeposit: (orderId: string) => void;
}

export const BillPreviewModal: React.FC<BillPreviewModalProps> = ({
  order,
  onClose,
  onApproveDeposit
}) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
              Biên Lai Đặt Cọc 50% VietQR
            </span>
            <h3 className="font-bold text-base text-slate-800">
              Đơn hàng #{order.id}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          {/* Bill image */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 text-center max-h-72 flex items-center justify-center">
            {order.paymentBillImage ? (
              <img
                src={order.paymentBillImage}
                alt="Bill VietQR"
                className="max-h-72 w-auto object-contain mx-auto"
              />
            ) : (
              <div className="py-12 text-slate-400 space-y-1">
                <Camera className="w-8 h-8 mx-auto text-slate-300" />
                <p>Khách hàng chưa tải ảnh biên lai lên</p>
              </div>
            )}
          </div>

          {/* Order quick info */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-500">Khách đặt:</span>
              <span className="font-bold">{order.senderName} ({order.senderPhone})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Người nhận:</span>
              <span>{order.recipientName} ({order.recipientPhone})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Cọc 50% cần duyệt:</span>
              <span className="font-bold text-emerald-700 text-sm">
                {new Intl.NumberFormat('vi-VN').format(order.depositAmount || 0)}đ
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Trạng thái hiện tại:</span>
              <span className="font-semibold text-amber-700">{order.status}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
            <a
              href={`tel:${order.senderPhone}`}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Gọi Khách</span>
            </a>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 font-semibold"
              >
                Đóng
              </button>
              {order.status === 'PENDING' && (
                <button
                  type="button"
                  onClick={() => {
                    onApproveDeposit(order.id);
                    onClose();
                  }}
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-md flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Duyệt Cọc 1-Chạm</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 6. EDIT ORDER SHIPPING FEE MODAL
export interface EditShippingFeeModalProps {
  order: { id: string; fee: number } | null;
  onClose: () => void;
  onSave: (orderId: string, newFee: number) => void;
}

export const EditShippingFeeModal: React.FC<EditShippingFeeModalProps> = ({ order, onClose, onSave }) => {
  const [fee, setFee] = useState<number>(order ? order.fee : 0);

  if (!order) return null;

  return (
    <div className="glass-overlay" onClick={onClose}>
      <div
        className="glass-modal-content max-w-sm rounded-[28px] sm:rounded-[36px] border border-white/80 bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="glass-modal-header">
          <h3 className="font-bold text-base text-slate-900">Điều Chỉnh Phí Vận Chuyển</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="glass-modal-body space-y-4 text-xs">
          <p className="text-slate-600">
            Mã đơn hàng: <strong className="font-mono text-purple-700">#{order.id}</strong>
          </p>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Phí vận chuyển mới (VNĐ)</label>
            <input
              type="number"
              step={5000}
              value={fee}
              onChange={(e) => setFee(Number(e.target.value))}
              className="glass-input w-full text-sm font-bold font-mono py-2.5 rounded-xl"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Giá tổng đơn hàng sẽ tự động cập nhật lại = Giá hoa + Phí ship mới.
            </span>
          </div>
        </div>

        <div className="glass-modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary text-xs py-2 px-4 rounded-xl cursor-pointer"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={() => {
              onSave(order.id, fee);
              onClose();
            }}
            className="btn-primary text-xs py-2 px-4 rounded-xl cursor-pointer"
          >
            Lưu Phí Ship
          </button>
        </div>
      </div>
    </div>
  );
};

// 7. TEMPORARY PASSWORD RESET CONFIRMATION MODAL
export interface TempPasswordModalProps {
  data: { customerName: string; pass: string } | null;
  onClose: () => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const TempPasswordModal: React.FC<TempPasswordModalProps> = ({ data, onClose, showToast }) => {
  if (!data) return null;

  return (
    <div className="glass-overlay" onClick={onClose}>
      <div
        className="glass-modal-content max-w-sm rounded-[28px] sm:rounded-[36px] border border-white/80 bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="glass-modal-header">
          <h3 className="font-bold text-base text-slate-900">Đã Cấp Mật Khẩu Tạm</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="glass-modal-body space-y-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-1 shadow-md border border-amber-200">
            <KeyRound className="w-6 h-6" />
          </div>

          <div>
            <p className="text-xs text-slate-500">
              Khách hàng: <strong className="text-slate-800">{data.customerName}</strong>
            </p>
          </div>

          <div className="my-2 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-1">
            <span className="text-[11px] text-amber-800 font-medium">Mật khẩu tạm thời mới:</span>
            <div className="font-mono text-xl font-extrabold text-slate-900 tracking-wider">
              {data.pass}
            </div>
          </div>

          <p className="text-[11px] text-slate-500 text-center leading-relaxed">
            Hãy sao chép và gửi mật khẩu này cho khách hàng. Sau khi đăng nhập, khách có thể đổi lại mật khẩu trong trang cá nhân.
          </p>
        </div>

        <div className="glass-modal-footer">
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(data.pass);
              showToast('Đã sao chép mật khẩu tạm!', 'success');
              onClose();
            }}
            className="btn-primary w-full text-xs py-2.5 rounded-xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Copy className="w-4 h-4" />
            <span>Sao Chép Mật Khẩu &amp; Đóng</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// 8. ADD NEW CONTACT CHANNEL MODAL
export interface AddContactChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddChannel: (channel: Omit<ContactChannel, 'id'>) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AddContactChannelModal: React.FC<AddContactChannelModalProps> = ({
  isOpen,
  onClose,
  onAddChannel,
  showToast
}) => {
  const [newChannelType, setNewChannelType] = useState<ContactChannel['type']>('zalo');
  const [newChannelTitle, setNewChannelTitle] = useState('');
  const [newChannelValue, setNewChannelValue] = useState('');
  const [newChannelUrl, setNewChannelUrl] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelTitle.trim() || !newChannelUrl.trim()) {
      showToast('Vui lòng nhập tên kênh và đường dẫn!', 'error');
      return;
    }
    onAddChannel({
      type: newChannelType,
      label: newChannelTitle.trim(),
      title: newChannelTitle.trim(),
      value: newChannelValue.trim() || newChannelTitle.trim(),
      link: newChannelUrl.trim(),
      url: newChannelUrl.trim(),
      isEnabled: true,
      order: 99
    });
    onClose();
    setNewChannelTitle('');
    setNewChannelValue('');
    setNewChannelUrl('');
  };

  return (
    <div className="glass-overlay" onClick={onClose}>
      <div
        className="glass-modal-content max-w-md rounded-[28px] sm:rounded-[36px] border border-white/80 bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="glass-modal-header">
          <h3 className="font-bold text-base text-slate-900">Thêm Kênh Liên Hệ Mới</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="glass-modal-body space-y-3.5 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Loại kênh liên hệ</label>
              <select
                value={newChannelType}
                onChange={(e) => setNewChannelType(e.target.value as ContactChannel['type'])}
                className="glass-input w-full text-xs py-2 rounded-xl"
              >
                <option value="zalo">Zalo Chat</option>
                <option value="hotline">Hotline Gọi Ngay</option>
                <option value="tiktok">TikTok Kênh Video</option>
                <option value="facebook">Facebook Fanpage</option>
                <option value="messenger">Facebook Messenger</option>
                <option value="maps">Google Maps (105 Doãn Kế Thiện)</option>
                <option value="custom">Kênh Khác</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Tên hiển thị *</label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Chat Zalo Florist, Chỉ đường Showroom..."
                value={newChannelTitle}
                onChange={(e) => setNewChannelTitle(e.target.value)}
                className="glass-input w-full text-xs py-2 rounded-xl"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Giá trị hiển thị phụ</label>
              <input
                type="text"
                placeholder="Ví dụ: 0987.654.321 hoặc @vvflorielle"
                value={newChannelValue}
                onChange={(e) => setNewChannelValue(e.target.value)}
                className="glass-input w-full text-xs py-2 rounded-xl"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Đường dẫn liên kết (URL) *</label>
              <input
                type="text"
                required
                placeholder="https://zalo.me/... hoặc https://maps.google.com/..."
                value={newChannelUrl}
                onChange={(e) => setNewChannelUrl(e.target.value)}
                className="glass-input w-full text-xs py-2 rounded-xl font-mono"
              />
            </div>
          </div>

          <div className="glass-modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-xs py-2 px-4 rounded-xl cursor-pointer"
            >
              Hủy
            </button>
            <button type="submit" className="btn-primary text-xs py-2 px-4 rounded-xl cursor-pointer">
              Thêm Kênh
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 9. ADD NEW VOUCHER MODAL
export interface AddVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVoucher: (promo: PromotionItem) => void;
  formatPrice: (p: number) => string;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AddVoucherModal: React.FC<AddVoucherModalProps> = ({
  isOpen,
  onClose,
  onAddVoucher,
  formatPrice,
  showToast
}) => {
  const [newVoucherCode, setNewVoucherCode] = useState('');
  const [newVoucherTitle, setNewVoucherTitle] = useState('');
  const [newVoucherDesc, setNewVoucherDesc] = useState('');
  const [newVoucherDiscount, setNewVoucherDiscount] = useState(30000);
  const [newVoucherMinOrder, setNewVoucherMinOrder] = useState(300000);
  const [newVoucherBadge, setNewVoucherBadge] = useState('ƯU ĐÃI');
  const [newVoucherPoints, setNewVoucherPoints] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVoucherCode.trim() || !newVoucherTitle.trim()) {
      showToast('Vui lòng nhập mã và tiêu đề voucher!', 'error');
      return;
    }
    const newPromo: PromotionItem = {
      id: `promo_${Date.now()}`,
      code: newVoucherCode.trim().toUpperCase(),
      title: newVoucherTitle.trim(),
      description:
        newVoucherDesc.trim() ||
        `Giảm ${formatPrice(newVoucherDiscount)} cho đơn từ ${formatPrice(newVoucherMinOrder)}`,
      discountAmount: newVoucherDiscount,
      minOrder: newVoucherMinOrder,
      badge: newVoucherBadge.trim() || 'ƯU ĐÃI',
      validUntil: '31/12/2026',
      discountType: 'FREESHIP',
      isActive: true,
      pointsToRedeem: newVoucherPoints > 0 ? newVoucherPoints : undefined
    };
    onAddVoucher(newPromo);
    onClose();
    setNewVoucherCode('');
    setNewVoucherTitle('');
    setNewVoucherDesc('');
  };

  return (
    <div className="glass-overlay" onClick={onClose}>
      <div
        className="glass-modal-content max-w-lg md:max-w-xl rounded-[28px] sm:rounded-[36px] border border-white/80 bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="glass-modal-header">
          <h3 className="font-bold text-base sm:text-lg text-slate-900">Tạo Mã Giảm Giá / Voucher Mới</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="glass-modal-body space-y-3.5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mã Voucher *</label>
                <input
                  type="text"
                  required
                  placeholder="FREESHIP30K"
                  value={newVoucherCode}
                  onChange={(e) => setNewVoucherCode(e.target.value.toUpperCase())}
                  className="glass-input w-full text-xs py-2 rounded-xl font-mono font-bold"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nhãn / Badge</label>
                <input
                  type="text"
                  placeholder="FREESHIP, HOT, VIP"
                  value={newVoucherBadge}
                  onChange={(e) => setNewVoucherBadge(e.target.value)}
                  className="glass-input w-full text-xs py-2 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Tiêu đề voucher *</label>
              <input
                type="text"
                required
                placeholder="Miễn phí vận chuyển 30K..."
                value={newVoucherTitle}
                onChange={(e) => setNewVoucherTitle(e.target.value)}
                className="glass-input w-full text-xs py-2 rounded-xl"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Mô tả điều kiện áp dụng</label>
              <textarea
                rows={2}
                placeholder="Áp dụng cho đơn hoa từ 300.000đ..."
                value={newVoucherDesc}
                onChange={(e) => setNewVoucherDesc(e.target.value)}
                className="glass-input w-full text-xs py-2 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Số tiền giảm</label>
                <input
                  type="number"
                  step={5000}
                  value={newVoucherDiscount}
                  onChange={(e) => setNewVoucherDiscount(Number(e.target.value))}
                  className="glass-input w-full text-xs py-2 rounded-xl font-mono"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Đơn tối thiểu</label>
                <input
                  type="number"
                  step={10000}
                  value={newVoucherMinOrder}
                  onChange={(e) => setNewVoucherMinOrder(Number(e.target.value))}
                  className="glass-input w-full text-xs py-2 rounded-xl font-mono"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Điểm đổi (nếu có)</label>
                <input
                  type="number"
                  step={50}
                  value={newVoucherPoints}
                  onChange={(e) => setNewVoucherPoints(Number(e.target.value))}
                  className="glass-input w-full text-xs py-2 rounded-xl font-mono"
                />
              </div>
            </div>
          </div>

          <div className="glass-modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-xs py-2 px-4 rounded-xl cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn-primary text-xs py-2 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 cursor-pointer"
            >
              Tạo Voucher
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 10. ADD NEW FLOWER PRODUCT MODAL
export interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: FlowerProduct) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onAddProduct,
  showToast
}) => {
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<CategoryId>('khai-truong');
  const [newProdPrice, setNewProdPrice] = useState(650000);
  const [newProdOriginalPrice, setNewProdOriginalPrice] = useState<number | undefined>(750000);
  const [newProdImageUrl, setNewProdImageUrl] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdMeaning, setNewProdMeaning] = useState('');
  const [newProdFlowers, setNewProdFlowers] = useState('Hồng Ecuador, Cẩm tú cầu, Baby trắng');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) {
      showToast('Vui lòng nhập tên mẫu hoa!', 'error');
      return;
    }
    const newProd: FlowerProduct = {
      id: `flower_${Date.now()}`,
      name: newProdName.trim(),
      categoryId: newProdCategory,
      price: newProdPrice,
      originalPrice: newProdOriginalPrice,
      imageUrl: newProdImageUrl.trim() || 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80',
      description: newProdDesc.trim(),
      meaning: newProdMeaning.trim(),
      flowerTypes: newProdFlowers.split(',').map((f) => f.trim()).filter(Boolean),
      isAvailable: true,
      tag: 'Mới',
      gradientTheme: {
        bg: 'from-emerald-500/10 to-teal-500/10',
        accent: '#059669',
        tagBg: '#059669'
      },
      rating: 5.0,
      reviewCount: 1
    };
    onAddProduct(newProd);
    onClose();
    setNewProdName('');
    showToast('Đã thêm mẫu hoa mới vào catalog!', 'success');
  };

  return (
    <div className="glass-overlay" onClick={onClose}>
      <div
        className="glass-modal-content max-w-2xl lg:max-w-3xl rounded-[28px] sm:rounded-[36px] border border-white/80 bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="glass-modal-header">
          <div>
            <h3 className="font-bold text-base sm:text-lg text-slate-900">Thêm Mẫu Hoa Thiết Kế Mới</h3>
            <p className="text-xs text-slate-500">Cập nhật sản phẩm trực tiếp vào catalog V&amp;V Florielle</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="glass-modal-body space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="space-y-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tên mẫu hoa *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Lẵng Khai Trương Thịnh Vượng Vàng Gold..."
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    className="glass-input w-full text-xs py-2 rounded-xl font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Dịp tặng</label>
                    <select
                      value={newProdCategory}
                      onChange={(e) => setNewProdCategory(e.target.value as CategoryId)}
                      className="glass-input w-full text-xs py-2 rounded-xl"
                    >
                      <option value="khai-truong">Hoa Khai Trương</option>
                      <option value="sinh-nhat">Hoa Sinh Nhật</option>
                      <option value="tinh-yeu">Hoa Tình Yêu</option>
                      <option value="lan-ho-diep">Lan Hồ Điệp</option>
                      <option value="cam-on">Hoa Cảm Ơn &amp; Chúc Mừng</option>
                      <option value="chia-buon">Hoa Chia Buồn</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Giá bán (VNĐ) *</label>
                    <input
                      type="number"
                      step={10000}
                      required
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(Number(e.target.value))}
                      className="glass-input w-full text-xs py-2 rounded-xl font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">URL Ảnh Chụp Thật Sản Phẩm *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={newProdImageUrl}
                    onChange={(e) => setNewProdImageUrl(e.target.value)}
                    className="glass-input w-full text-xs py-2 rounded-xl font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Hoa thành phần (phân cách bằng dấu phẩy)</label>
                  <input
                    type="text"
                    placeholder="Hồng Ecuador, Cẩm tú cầu, Baby trắng..."
                    value={newProdFlowers}
                    onChange={(e) => setNewProdFlowers(e.target.value)}
                    className="glass-input w-full text-xs py-2 rounded-xl"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Ý nghĩa &amp; Thông điệp thiết kế</label>
                  <input
                    type="text"
                    placeholder="Thông điệp gửi gắm chúc mừng tài lộc..."
                    value={newProdMeaning}
                    onChange={(e) => setNewProdMeaning(e.target.value)}
                    className="glass-input w-full text-xs py-2 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Mô tả chi tiết</label>
                  <textarea
                    rows={3}
                    placeholder="Mô tả kích thước hoa, xuất xứ hoa tươi..."
                    value={newProdDesc}
                    onChange={(e) => setNewProdDesc(e.target.value)}
                    className="glass-input w-full text-xs py-2 rounded-xl"
                  />
                </div>

                {/* Image Preview Box */}
                {newProdImageUrl && (
                  <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 h-28 flex items-center justify-center">
                    <img
                      src={newProdImageUrl}
                      alt="Xem trước ảnh"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="glass-modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-xs py-2 px-4 rounded-xl cursor-pointer"
            >
              Hủy
            </button>
            <button type="submit" className="btn-primary text-xs py-2 px-4 rounded-xl cursor-pointer">
              Lưu Sản Phẩm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 11. CUSTOMER DETAIL & ORDER HISTORY MODAL
export interface CustomerDetailModalProps {
  customer: CustomerUser | null;
  onClose: () => void;
  orderHistory: Order[];
  formatPrice: (p: number) => string;
}

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  customer,
  onClose,
  orderHistory,
  formatPrice
}) => {
  if (!customer) return null;

  return (
    <div className="glass-overlay" onClick={onClose}>
      <div
        className="glass-modal-content max-w-2xl lg:max-w-4xl rounded-[28px] sm:rounded-[36px] border border-white/80 bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="glass-modal-header">
          <div>
            <h3 className="font-bold text-base sm:text-lg text-slate-900">Chi Tiết Hồ Sơ Khách Hàng</h3>
            <p className="text-xs text-slate-500">
              {customer.fullName} • <span className="font-mono">{customer.phone}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="glass-modal-body space-y-4 text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50/80 border border-slate-200">
            <div>
              <span className="text-slate-500 block">Hạng thành viên:</span>
              <div className="font-bold text-purple-700 mt-0.5 text-sm">{customer.tier}</div>
            </div>
            <div>
              <span className="text-slate-500 block">Trạng thái xác thực:</span>
              <div className="font-bold text-emerald-700 mt-0.5 text-xs">
                {customer.isVerified ? 'Hội viên đã xác thực' : 'Thành viên thường'}
              </div>
            </div>
            <div>
              <span className="text-slate-500 block">Ví điểm tích lũy:</span>
              <div className="font-extrabold text-sm text-emerald-800 mt-0.5">
                {customer.points} điểm
              </div>
            </div>
            <div>
              <span className="text-slate-500 block">Tổng chi tiêu:</span>
              <div className="font-extrabold text-sm text-slate-900 mt-0.5">
                {formatPrice(customer.totalSpent)}
              </div>
            </div>
          </div>

          {/* Extra Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 space-y-1.5">
              <span className="text-slate-500 font-semibold block">Thông Tin Cá Nhân &amp; Liên Hệ</span>
              <div className="flex justify-between">
                <span className="text-slate-400">Email:</span>
                <span className="font-medium text-slate-800">{customer.email || 'Chưa cung cấp'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Ngày sinh:</span>
                <span className="font-medium text-slate-800">{customer.birthday || 'Chưa cung cấp'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Địa chỉ hiện tại:</span>
                <span className="font-medium text-slate-800 text-right max-w-[220px] truncate">{customer.address || 'Chưa cung cấp'}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 space-y-1.5">
              <span className="text-slate-500 font-semibold block">Sở Thích &amp; Ghi Chú Florist</span>
              <div>
                <span className="text-slate-400">Hoa yêu thích: </span>
                <span className="font-medium text-purple-700">
                  {customer.favoriteFlowers?.length ? customer.favoriteFlowers.join(', ') : 'Chưa có'}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Ghi chú florist: </span>
                <span className="font-medium text-slate-700">{customer.notes || 'Không có ghi chú'}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-xs text-slate-800 mb-2 flex items-center justify-between">
              <span>Lịch Sử Mua Hàng ({orderHistory.length})</span>
              <span className="text-[11px] font-normal text-slate-400">Mới nhất lên đầu</span>
            </h4>
            <div className="space-y-2">
              {orderHistory.length === 0 ? (
                <div className="py-6 text-center text-slate-400 bg-slate-50 rounded-xl">Chưa có đơn hàng nào</div>
              ) : (
                orderHistory.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-3 rounded-xl bg-slate-50/80 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-purple-800">#{ord.id}</span>
                        <span className="text-[11px] text-slate-500">• {ord.createdAt}</span>
                      </div>
                      <div className="text-[11px] text-slate-600">
                        Người nhận: <strong>{ord.recipientName}</strong> ({ord.recipientPhone}) - {ord.recipientAddress}
                      </div>
                    </div>
                    <div className="text-right sm:shrink-0">
                      <div className="font-bold text-slate-900">{formatPrice(ord.totalAmount)}</div>
                      <span className="text-[10px] font-semibold text-emerald-700 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                        {ord.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="glass-modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary text-xs py-2 px-4 rounded-xl cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

// 12. ADJUST CUSTOMER POINTS MODAL
export interface AdjustPointsModalProps {
  customer: CustomerUser | null;
  onClose: () => void;
  onConfirm: (customerId: string, pointsDelta: number, reason: string) => void;
}

export const AdjustPointsModal: React.FC<AdjustPointsModalProps> = ({ customer, onClose, onConfirm }) => {
  const [delta, setDelta] = useState(50);
  const [reason, setReason] = useState('Thưởng thành viên tích cực');

  if (!customer) return null;

  return (
    <div className="glass-overlay" onClick={onClose}>
      <div
        className="glass-modal-content max-w-sm rounded-[28px] sm:rounded-[36px] border border-white/80 bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="glass-modal-header">
          <h3 className="font-bold text-base text-slate-900">Điều Chỉnh Điểm Tích Lũy</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="glass-modal-body space-y-3.5 text-xs">
          <p className="text-slate-600">
            Khách hàng: <strong>{customer.fullName}</strong>
            <br />
            Hiện có: <strong className="text-emerald-700">{customer.points} điểm</strong>
          </p>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Số điểm điều chỉnh (+ để cộng, - để trừ)
            </label>
            <input
              type="number"
              step={10}
              value={delta}
              onChange={(e) => setDelta(Number(e.target.value))}
              className="glass-input w-full text-sm font-bold font-mono py-2 rounded-xl"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Lý do điều chỉnh</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="glass-input w-full text-xs py-2 rounded-xl"
              placeholder="Ví dụ: Thưởng thành viên tích cực, hoàn điểm..."
            />
          </div>
        </div>

        <div className="glass-modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary text-xs py-2 px-4 rounded-xl cursor-pointer"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(customer.id, delta, reason);
              onClose();
            }}
            className="btn-primary text-xs py-2 px-4 rounded-xl cursor-pointer"
          >
            Xác Nhận
          </button>
        </div>
      </div>
    </div>
  );
};

// 13. EDIT CUSTOMER NOTES & FAVORITE FLOWERS MODAL
export interface EditCustomerNotesModalProps {
  customer: CustomerUser | null;
  onClose: () => void;
  onSave: (customerId: string, favoriteFlowers: string[], notes: string) => void;
}

export const EditCustomerNotesModal: React.FC<EditCustomerNotesModalProps> = ({
  customer,
  onClose,
  onSave
}) => {
  const [favFlowers, setFavFlowers] = useState(
    customer?.favoriteFlowers
      ? Array.isArray(customer.favoriteFlowers)
        ? customer.favoriteFlowers.join(', ')
        : customer.favoriteFlowers
      : ''
  );
  const [notes, setNotes] = useState(customer?.notes || '');

  if (!customer) return null;

  return (
    <div className="glass-overlay" onClick={onClose}>
      <div
        className="glass-modal-content max-w-md rounded-[28px] sm:rounded-[36px] border border-white/80 bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="glass-modal-header">
          <h3 className="font-bold text-base text-slate-900">Ghi Chú Sở Thích &amp; Florist</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="glass-modal-body space-y-3.5 text-xs">
          <p className="text-slate-600">
            Khách hàng: <strong className="text-slate-800">{customer.fullName}</strong> ({customer.phone})
          </p>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Hoa yêu thích / Tông màu mong muốn
            </label>
            <input
              type="text"
              value={favFlowers}
              onChange={(e) => setFavFlowers(e.target.value)}
              className="glass-input w-full text-xs py-2 rounded-xl"
              placeholder="Ví dụ: Hồng Ecuador pastel, Lan hồ điệp trắng, không thích hoa ly..."
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Ghi chú nội bộ cho florist</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="glass-input w-full text-xs py-2 rounded-xl"
              placeholder="Ghi chú về thói quen đặt hoa, giờ giao hàng yêu thích, dịp tặng..."
            />
          </div>
        </div>

        <div className="glass-modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary text-xs py-2 px-4 rounded-xl cursor-pointer"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={() => {
              onSave(
                customer.id,
                favFlowers.split(',').map((f) => f.trim()).filter(Boolean),
                notes.trim()
              );
              onClose();
            }}
            className="btn-primary text-xs py-2 px-4 rounded-xl cursor-pointer"
          >
            Lưu Ghi Chú
          </button>
        </div>
      </div>
    </div>
  );
};

