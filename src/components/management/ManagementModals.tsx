import React, { useState, useEffect, useRef } from 'react';
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
  Copy,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  Percent,
  Trash2,
  Pencil,
  Tag,
  AlertCircle,
  RotateCcw,
  Flower2,
  Plus
} from 'lucide-react';
import { ShopSettings, PromotionItem, Order, CustomerUser, FlowerProduct, CategoryId, ContactChannel, FlowerCategory } from '../../types';
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
  channelToEdit?: ContactChannel | null;
  onUpdateChannel?: (id: string, updates: Partial<ContactChannel>) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AddContactChannelModal: React.FC<AddContactChannelModalProps> = ({
  isOpen,
  onClose,
  onAddChannel,
  channelToEdit,
  onUpdateChannel,
  showToast
}) => {
  const isEditing = Boolean(channelToEdit && channelToEdit.id);
  const [newChannelType, setNewChannelType] = useState<ContactChannel['type']>('zalo');
  const [newChannelTitle, setNewChannelTitle] = useState('');
  const [newChannelValue, setNewChannelValue] = useState('');
  const [newChannelUrl, setNewChannelUrl] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    if (channelToEdit) {
      setNewChannelType(channelToEdit.type || 'zalo');
      setNewChannelTitle(channelToEdit.title || channelToEdit.label || '');
      setNewChannelValue(channelToEdit.value || '');
      setNewChannelUrl(channelToEdit.url || channelToEdit.link || '');
    } else {
      setNewChannelType('zalo');
      setNewChannelTitle('');
      setNewChannelValue('');
      setNewChannelUrl('');
    }
  }, [isOpen, channelToEdit]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelTitle.trim() || !newChannelUrl.trim()) {
      showToast('Vui lòng nhập tên kênh và đường dẫn!', 'error');
      return;
    }

    if (isEditing && channelToEdit && onUpdateChannel) {
      onUpdateChannel(channelToEdit.id, {
        type: newChannelType,
        label: newChannelTitle.trim(),
        title: newChannelTitle.trim(),
        value: newChannelValue.trim() || newChannelTitle.trim(),
        link: newChannelUrl.trim(),
        url: newChannelUrl.trim(),
      });
      showToast(`Đã cập nhật kênh liên hệ "${newChannelTitle.trim()}"!`, 'success');
    } else {
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
    }
    onClose();
  };

  return (
    <div className="glass-overlay" onClick={onClose}>
      <div
        className="glass-modal-content max-w-md rounded-[28px] sm:rounded-[36px] border border-white/80 bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="glass-modal-header">
          <h3 className="font-bold text-base text-slate-900">
            {isEditing ? 'Chỉnh Sửa Kênh Liên Hệ' : 'Thêm Kênh Liên Hệ Mới'}
          </h3>
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
                <option value="maps">Google Maps (Chỉ đường Showroom)</option>
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
              {isEditing ? 'Lưu Thay Đổi' : 'Thêm Kênh'}
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

// 10. PRODUCT FORM MODAL (FULL CRUD: CREATE & EDIT WITH DUAL IMAGE UPLOAD & DISCOUNT ENGINE)
export interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: FlowerProduct | null; // If passed, mode is EDIT; otherwise CREATE
  onSaveProduct: (product: FlowerProduct) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  categories?: FlowerCategory[];
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  product,
  onSaveProduct,
  showToast,
  categories = []
}) => {
  const isEditMode = Boolean(product && product.id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState<CategoryId>('khai-truong');
  const [originalPrice, setOriginalPrice] = useState<number>(750000);
  const [discountPercent, setDiscountPercent] = useState<number>(10);
  const [price, setPrice] = useState<number>(675000);
  const [imageMode, setImageMode] = useState<'file' | 'url'>('url');
  const [imageUrl, setImageUrl] = useState('');
  const [imageError, setImageError] = useState(false);
  const [flowers, setFlowers] = useState('Hồng Ecuador, Cẩm tú cầu, Baby trắng');
  const [meaning, setMeaning] = useState('');
  const [desc, setDesc] = useState('');
  const [tag, setTag] = useState('Mới');
  const [isAvailable, setIsAvailable] = useState(true);

  // Sync state whenever product or modal opens
  useEffect(() => {
    if (!isOpen) return;

    if (product) {
      setName(product.name || '');
      setCategoryId(product.categoryId || 'khai-truong');
      const baseOrig = product.originalPrice && product.originalPrice > product.price ? product.originalPrice : product.price;
      setOriginalPrice(baseOrig);
      setPrice(product.price);
      if (product.originalPrice && product.originalPrice > product.price) {
        setDiscountPercent(Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100));
      } else {
        setDiscountPercent(0);
      }
      setImageUrl(product.imageUrl || '');
      setImageError(false);
      setImageMode(product.imageUrl?.startsWith('data:') ? 'file' : 'url');
      setFlowers(product.flowerTypes?.join(', ') || '');
      setMeaning(product.meaning || '');
      setDesc(product.description || '');
      setTag(product.tag || '');
      setIsAvailable(product.isAvailable !== false);
    } else {
      // Default reset for new product
      setName('');
      setCategoryId('khai-truong');
      setOriginalPrice(750000);
      setDiscountPercent(10);
      setPrice(675000);
      setImageMode('url');
      setImageUrl('');
      setImageError(false);
      setFlowers('Hồng Ecuador, Cẩm tú cầu, Baby trắng');
      setMeaning('Mang lại may mắn, khởi đầu thịnh vượng và hanh thông tài lộc.');
      setDesc('Thiết kế tuyển chọn từ hoa tươi nhập khẩu loại 1, cắm theo phong cách hiện đại sang trọng.');
      setTag('Mới');
      setIsAvailable(true);
    }
  }, [isOpen, product]);

  // Recalculate price from originalPrice & discountPercent
  const handleDiscountPercentChange = (percent: number) => {
    const validPercent = Math.max(0, Math.min(90, percent));
    setDiscountPercent(validPercent);
    if (validPercent === 0) {
      setPrice(originalPrice);
    } else {
      const discounted = Math.round((originalPrice * (1 - validPercent / 100)) / 1000) * 1000;
      setPrice(Math.max(10000, discounted));
    }
  };

  const handleOriginalPriceChange = (orig: number) => {
    const validOrig = Math.max(0, orig);
    setOriginalPrice(validOrig);
    if (discountPercent > 0) {
      const discounted = Math.round((validOrig * (1 - discountPercent / 100)) / 1000) * 1000;
      setPrice(Math.max(10000, discounted));
    } else {
      setPrice(validOrig);
    }
  };

  const handlePriceChange = (newPrice: number) => {
    const validPrice = Math.max(0, newPrice);
    setPrice(validPrice);
    if (originalPrice > validPrice && validPrice > 0) {
      setDiscountPercent(Math.round(((originalPrice - validPrice) / originalPrice) * 100));
    } else {
      setDiscountPercent(0);
    }
  };

  // Handle local file upload (base64 data URL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Kích thước ảnh tối đa 5MB!', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setImageUrl(result);
        setImageError(false);
        showToast('Đã tải ảnh thiết kế lên thành công!', 'success');
      }
    };
    reader.onerror = () => {
      showToast('Không thể đọc file ảnh, vui lòng thử lại!', 'error');
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Vui lòng nhập tên mẫu hoa!', 'error');
      return;
    }
    if (price <= 0) {
      showToast('Giá bán phải lớn hơn 0đ!', 'error');
      return;
    }

    const finalOriginalPrice = discountPercent > 0 && originalPrice > price ? originalPrice : undefined;

    const savedProduct: FlowerProduct = {
      id: isEditMode && product ? product.id : `fl-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      categoryId,
      price,
      originalPrice: finalOriginalPrice,
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80',
      description: desc.trim(),
      meaning: meaning.trim(),
      flowerTypes: flowers.split(',').map((f) => f.trim()).filter(Boolean),
      isAvailable,
      tag: tag.trim() || (discountPercent > 0 ? `-${discountPercent}%` : undefined),
      gradientTheme: product?.gradientTheme || {
        bg: 'from-emerald-500/10 to-teal-500/10',
        accent: '#059669',
        tagBg: '#059669'
      },
      rating: isEditMode && product?.rating ? product.rating : 5.0,
      reviewCount: isEditMode && product?.reviewCount ? product.reviewCount : 1
    };

    onSaveProduct(savedProduct);
    onClose();
    showToast(isEditMode ? `Đã lưu cập nhật mẫu hoa "${savedProduct.name}"!` : `Đã thêm mẫu hoa mới "${savedProduct.name}"!`, 'success');
  };

  return (
    <div className="glass-overlay" onClick={onClose}>
      <div
        className="glass-modal-content max-w-3xl lg:max-w-4xl rounded-[28px] sm:rounded-[36px] border border-white/80 bg-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="glass-modal-header border-b border-slate-100 bg-gradient-to-r from-emerald-50/60 to-white px-5 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              {isEditMode ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-slate-900">
                {isEditMode ? `Chỉnh Sửa Mẫu Hoa: ${product?.name}` : 'Thêm Mẫu Hoa Thiết Kế Mới'}
              </h3>
              <p className="text-xs text-slate-500">
                {isEditMode
                  ? 'Cập nhật giá bán, mức giảm giá, ảnh chụp thật và hoa thành phần'
                  : 'Cập nhật mẫu hoa tươi mới vào catalog bán lẻ & bảng vận hành tiệm'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Đóng modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-y-auto">
          <div className="p-5 sm:p-6 space-y-5 text-xs">
            {/* Top row: Name & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="font-bold text-slate-700 flex items-center gap-1.5">
                  <span>Tên Mẫu Hoa Thiết Kế *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Bó Hoa Hồng Ecuador Đỏ Say Đắm..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="glass-input w-full text-xs py-2.5 px-3 rounded-xl font-bold border border-slate-200 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Dịp / Danh Mục Hoa *</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value as CategoryId)}
                  className="glass-input w-full text-xs py-2.5 px-3 rounded-xl font-medium border border-slate-200"
                >
                  <option value="khai-truong">Hoa Khai Trương</option>
                  <option value="sinh-nhat">Hoa Sinh Nhật</option>
                  <option value="tinh-yeu">Hoa Tình Yêu</option>
                  <option value="lan-ho-diep">Lan Hồ Điệp</option>
                  <option value="cam-on">Hoa Cảm Ơn &amp; Chúc Mừng</option>
                  <option value="chia-buon">Hoa Chia Buồn</option>
                </select>
              </div>
            </div>

            {/* Price & Discount Frame (Feature Highlight) */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-slate-50 border border-emerald-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-600 text-white">
                    <Percent className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-emerald-950">Giá Bán &amp; Thiết Lập Giảm Giá</h4>
                    <p className="text-[11px] text-slate-500">Tự động tính giá bán từ % giảm giá hoặc giá gốc niêm yết</p>
                  </div>
                </div>

                {discountPercent > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500 text-white text-[11px] font-extrabold shadow-sm">
                    <Sparkles className="w-3 h-3" />
                    Đang Giảm {discountPercent}%
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {/* Original Price */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Giá Gốc Niêm Yết (VNĐ) *</label>
                  <input
                    type="number"
                    step={10000}
                    min={10000}
                    required
                    value={originalPrice}
                    onChange={(e) => handleOriginalPriceChange(Number(e.target.value))}
                    className="glass-input w-full text-xs py-2 px-3 rounded-xl font-mono font-bold border border-slate-200"
                  />
                  <p className="text-[10px] text-slate-400">Giá gốc trước khi giảm</p>
                </div>

                {/* Discount % with quick presets */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-slate-700">% Giảm Giá</label>
                    <span className="text-[11px] font-bold text-rose-600">{discountPercent}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={0}
                      max={90}
                      value={discountPercent}
                      onChange={(e) => handleDiscountPercentChange(Number(e.target.value))}
                      className="glass-input w-20 text-xs py-2 px-2.5 rounded-xl font-mono font-bold text-center border border-slate-200"
                    />
                    <div className="flex items-center gap-1 flex-1 overflow-x-auto">
                      {[0, 10, 15, 20, 30].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => handleDiscountPercentChange(pct)}
                          className={`px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                            discountPercent === pct
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {pct === 0 ? 'Gốc' : `-${pct}%`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Final Selling Price */}
                <div className="space-y-1">
                  <label className="font-semibold text-emerald-900 block">Giá Bán Thực Tế (VNĐ) *</label>
                  <input
                    type="number"
                    step={10000}
                    min={10000}
                    required
                    value={price}
                    onChange={(e) => handlePriceChange(Number(e.target.value))}
                    className="glass-input w-full text-xs py-2 px-3 rounded-xl font-mono font-black text-emerald-700 bg-white border-2 border-emerald-400/80 shadow-xs"
                  />
                  <p className="text-[10px] text-emerald-700 font-medium">
                    {discountPercent > 0
                      ? `Tiết kiệm ${(originalPrice - price).toLocaleString('vi-VN')} đ`
                      : 'Bán theo đúng giá gốc'}
                  </p>
                </div>
              </div>
            </div>

            {/* DUAL IMAGE UPLOAD (FILE OR URL) */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-800 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-emerald-600" />
                    <span>Ảnh Chụp Thực Tế Mẫu Hoa (Đầy đủ cả 2 cách)</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">Tải file từ thiết bị hoặc dán link ảnh trực tuyến</p>
                </div>

                {/* Mode Selector */}
                <div className="inline-flex p-0.5 rounded-xl bg-slate-200/80 border border-slate-300">
                  <button
                    type="button"
                    onClick={() => setImageMode('file')}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      imageMode === 'file' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Upload className="w-3 h-3" />
                    <span>Tải file ảnh</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageMode('url')}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      imageMode === 'url' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <LinkIcon className="w-3 h-3" />
                    <span>Dán link ảnh</span>
                  </button>
                </div>
              </div>

              {/* Upload Input Area */}
              {imageMode === 'file' ? (
                <div className="space-y-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-2xl p-4 bg-emerald-50/50 hover:bg-emerald-50 transition-all flex flex-col items-center justify-center text-center cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-full bg-white shadow-xs flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform mb-1.5">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="font-bold text-xs text-emerald-950">Nhấp để chọn file ảnh từ máy tính / điện thoại</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Hỗ trợ JPG, PNG, WEBP (Tối đa 5MB) • Xem trước tức thì</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="relative">
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/... hoặc link ảnh bất kỳ"
                      value={imageUrl}
                      onChange={(e) => {
                        setImageUrl(e.target.value);
                        setImageError(false);
                      }}
                      className="glass-input w-full text-xs py-2.5 px-3 rounded-xl font-mono text-[11px] border border-slate-200"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-slate-400">Gợi ý mẫu ảnh đẹp:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl('https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80');
                        setImageError(false);
                      }}
                      className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md hover:bg-emerald-100 cursor-pointer font-medium"
                    >
                      Khai Trương Vàng
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl('https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=80');
                        setImageError(false);
                      }}
                      className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md hover:bg-emerald-100 cursor-pointer font-medium"
                    >
                      Hồng Đỏ Ecuador
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl('https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80');
                        setImageError(false);
                      }}
                      className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md hover:bg-emerald-100 cursor-pointer font-medium"
                    >
                      Pastel Sinh Nhật
                    </button>
                  </div>
                </div>
              )}

              {/* Preview Box */}
              {imageUrl && (
                <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 flex items-center gap-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative">
                    {!imageError ? (
                      <img
                        src={imageUrl}
                        alt="Xem trước"
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-rose-50 text-rose-500 p-1 text-center">
                        <AlertCircle className="w-4 h-4 mb-0.5" />
                        <span className="text-[8px] font-bold">Lỗi ảnh</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-slate-800 truncate">
                      {imageMode === 'file' ? 'Ảnh tải lên từ file thiết bị' : 'Ảnh từ link trực tuyến'}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate max-w-md">{imageUrl.slice(0, 70)}...</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                        ✓ Đã sẵn sàng hiển thị
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setImageUrl('');
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="text-[10px] text-rose-600 hover:underline cursor-pointer"
                      >
                        Gỡ ảnh này
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom details: Tag, Flowers, Meaning, Description */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                {/* Tag Presets */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Huy Hiệu Nổi Bật (Tag)</label>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {['Mới', 'Bán chạy', 'Hot', 'Giảm giá', 'VIP', 'Thiết kế riêng'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTag(t)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          tag === t
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Hoặc nhập tag riêng..."
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    className="glass-input w-full text-xs py-1.5 px-3 rounded-xl border border-slate-200 mt-1"
                  />
                </div>

                {/* Flowers Component */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Hoa Thành Phần (phân cách bằng dấu phẩy)</label>
                  <input
                    type="text"
                    placeholder="Hồng Ecuador, Cẩm tú cầu, Baby trắng..."
                    value={flowers}
                    onChange={(e) => setFlowers(e.target.value)}
                    className="glass-input w-full text-xs py-2 px-3 rounded-xl border border-slate-200"
                  />
                </div>

                {/* In Stock Toggle */}
                <div className="pt-1 flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <span className="font-bold text-xs text-slate-800 block">Tình Trạng Hoa Sẵn Sàng</span>
                    <span className="text-[10px] text-slate-500">Mẫu hoa có đủ nguyên liệu để cắm giao ngay</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAvailable(!isAvailable)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isAvailable ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        isAvailable ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {/* Meaning */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Ý Nghĩa &amp; Thông Điệp Thiết Kế</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Mang lại may mắn, phát tài phát lộc..."
                    value={meaning}
                    onChange={(e) => setMeaning(e.target.value)}
                    className="glass-input w-full text-xs py-2 px-3 rounded-xl border border-slate-200"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Mô Tả Chi Tiết Mẫu Hoa</label>
                  <textarea
                    rows={3}
                    placeholder="Mô tả kích thước hoa, xuất xứ hoa tươi nhập khẩu..."
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="glass-input w-full text-xs py-2 px-3 rounded-xl border border-slate-200 leading-relaxed"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="glass-modal-footer border-t border-slate-100 bg-slate-50/80 px-5 sm:px-6 py-3.5 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              * Mẫu hoa sẽ được đồng bộ ngay tức thì lên website bán lẻ và thanh dock.
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary text-xs py-2 px-4 rounded-xl cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="btn-primary text-xs py-2 px-5 rounded-xl cursor-pointer shadow-md flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>{isEditMode ? 'Lưu Thay Đổi' : 'Thêm Mẫu Hoa'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// Backward Compatibility Wrapper for AddProductModal
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
  return (
    <ProductFormModal
      isOpen={isOpen}
      onClose={onClose}
      product={null}
      onSaveProduct={onAddProduct}
      showToast={showToast}
    />
  );
};

// 10B. BULK DISCOUNT EVENT MODAL (STORE-WIDE OR CATEGORY-WIDE SALES CAMPAIGN)
export interface BulkDiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: FlowerCategory[];
  products: FlowerProduct[];
  onApplyDiscount: (percent: number, categoryId?: string, eventName?: string) => void;
  onRestorePrices: (categoryId?: string) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const BulkDiscountModal: React.FC<BulkDiscountModalProps> = ({
  isOpen,
  onClose,
  categories,
  products,
  onApplyDiscount,
  onRestorePrices,
  showToast
}) => {
  const [eventName, setEventName] = useState('Đại Lễ Quốc Tế Phụ Nữ 8/3');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [discountPercent, setDiscountPercent] = useState<number>(15);

  if (!isOpen) return null;

  // Count products in selected scope
  const targetProducts = selectedCategory === 'all'
    ? products
    : products.filter((p) => p.categoryId === selectedCategory);

  const discountedCount = targetProducts.filter((p) => p.originalPrice && p.originalPrice > p.price).length;

  const eventPresets = [
    { name: 'Đại Lễ Quốc Tế Phụ Nữ 8/3', percent: 15, tag: '8/3' },
    { name: 'Lễ Tình Nhân Valentine 14/2', percent: 10, tag: 'Valentine' },
    { name: 'Ngày Phụ Nữ Việt Nam 20/10', percent: 20, tag: '20/10' },
    { name: 'Tri Ân Ngày Nhà Giáo 20/11', percent: 15, tag: '20/11' },
    { name: 'Flash Sale Cuối Tuần Rực Rỡ', percent: 25, tag: 'Flash Sale' }
  ];

  const handleApply = () => {
    if (discountPercent <= 0) {
      showToast('Vui lòng chọn mức giảm giá lớn hơn 0%!', 'error');
      return;
    }
    onApplyDiscount(discountPercent, selectedCategory, eventName);
    onClose();
  };

  const handleRestore = () => {
    if (confirm(`Bạn có chắc muốn khôi phục giá gốc cho ${selectedCategory === 'all' ? 'toàn bộ kho hoa' : 'danh mục đã chọn'}?`)) {
      onRestorePrices(selectedCategory);
      onClose();
    }
  };

  return (
    <div className="glass-overlay" onClick={onClose}>
      <div
        className="glass-modal-content max-w-xl rounded-[28px] sm:rounded-[36px] border border-white/80 bg-white shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="glass-modal-header border-b border-slate-100 bg-gradient-to-r from-rose-50/70 via-amber-50/40 to-white px-5 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-slate-900">Sự Kiện Giảm Giá Đồng Loạt</h3>
              <p className="text-xs text-slate-500">Giảm giá % theo dịp lễ cho toàn tiệm hoặc từng danh mục</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-4 text-xs">
          {/* Quick Event Presets */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Dịp Lễ &amp; Sự Kiện Phổ Biến</span>
            </label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {eventPresets.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    setEventName(preset.name);
                    setDiscountPercent(preset.percent);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                    eventName === preset.name
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700'
                  }`}
                >
                  {preset.name} (-{preset.percent}%)
                </button>
              ))}
            </div>
          </div>

          {/* Event Name Input */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">Tên Sự Kiện / Chiến Dịch</label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Ví dụ: Tuần Lễ Hoa Tươi Yêu Thương..."
              className="glass-input w-full text-xs py-2 px-3 rounded-xl font-bold border border-slate-200"
            />
          </div>

          {/* Scope Select & Discount % */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">Phạm Vi Áp Dụng</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="glass-input w-full text-xs py-2 px-3 rounded-xl font-medium border border-slate-200"
              >
                <option value="all">🌸 Toàn bộ kho hoa tươi ({products.length} mẫu)</option>
                <option value="khai-truong">Hoa Khai Trương</option>
                <option value="sinh-nhat">Hoa Sinh Nhật</option>
                <option value="tinh-yeu">Hoa Tình Yêu</option>
                <option value="lan-ho-diep">Lan Hồ Điệp</option>
                <option value="cam-on">Hoa Cảm Ơn &amp; Chúc Mừng</option>
                <option value="chia-buon">Hoa Chia Buồn</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">Mức Giảm Giá (%)</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={1}
                  max={90}
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value))}
                  className="glass-input w-24 text-xs py-2 px-3 rounded-xl font-mono font-bold text-center border border-slate-200"
                />
                <div className="flex items-center gap-1 flex-1">
                  {[5, 10, 15, 20, 25, 30].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setDiscountPercent(pct)}
                      className={`px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        discountPercent === pct
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      -{pct}%
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Impact preview info box */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-teal-50/50 border border-emerald-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Xem Trước Tác Động Sự Kiện</span>
              </span>
              <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[11px]">
                {targetProducts.length} mẫu hoa áp dụng
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Hệ thống sẽ tự động lưu giá gốc hiện tại vào mục giá niêm yết, tính giá bán mới giảm <strong>{discountPercent}%</strong> và gắn huy hiệu <strong>-{discountPercent}%</strong> cho tất cả mẫu hoa được chọn.
            </p>
            {discountedCount > 0 && (
              <p className="text-[10px] text-amber-700 font-medium">
                ⚡ Hiện có {discountedCount} mẫu đang có giá giảm, sẽ được cập nhật theo tỷ lệ mới.
              </p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="glass-modal-footer border-t border-slate-100 bg-slate-50/80 px-5 sm:px-6 py-3.5 flex items-center justify-between">
          <button
            type="button"
            onClick={handleRestore}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-200/80 hover:bg-amber-100 text-slate-700 hover:text-amber-800 text-xs font-bold transition-colors cursor-pointer"
            title="Khôi phục về giá niêm yết ban đầu"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Khôi Phục Giá Gốc</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-xs py-2 px-4 rounded-xl cursor-pointer"
            >
              Đóng
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="btn-primary text-xs py-2 px-4 rounded-xl cursor-pointer shadow-md flex items-center gap-1.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold"
            >
              <Sparkles className="w-4 h-4" />
              <span>Áp Dụng Sự Kiện Giảm Giá</span>
            </button>
          </div>
        </div>
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

