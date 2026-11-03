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
  Check
} from 'lucide-react';
import { ShopSettings, PromotionItem, Order } from '../../types';
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
