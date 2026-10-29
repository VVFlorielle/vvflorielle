import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  User,
  Award,
  ShoppingBag,
  Clock,
  MapPin,
  Calendar,
  Phone,
  CheckCircle2,
  AlertCircle,
  Truck,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  KeyRound,
  Gift,
  Copy,
  ChevronRight,
  ExternalLink,
  Camera,
  Upload,
  Mail,
  Lock,
  Edit2,
  Plus,
  Trash2,
  BookmarkCheck,
  Cake,
  Save,
  Check
} from 'lucide-react';
import { OrderStatus, SavedAddress } from '../types';

export const CustomerPortal: React.FC = () => {
  const {
    customer,
    orders,
    addToCart,
    products,
    setCurrentView,
    setIsAuthModalOpen,
    setAuthModalMode,
    settings,
    promotions,
    redeemVoucherWithPoints,
    requestCustomerOtp,
    verifyCustomerOtp,
    changeCustomerPassword,
    changeCustomerIdentityWithOtp,
    uploadOrderBill,
    updateCustomerProfile,
    addSavedAddress,
    updateSavedAddress,
    deleteSavedAddress,
    setDefaultSavedAddress,
    showToast
  } = useStore();

  const [statusFilter, setStatusFilter] = useState<'ALL' | OrderStatus>('ALL');

  // Modals inside Customer Portal
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpInput, setOtpInput] = useState('');

  const [isChangePassOpen, setIsChangePassOpen] = useState(false);
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');

  const [isChangeIdentityOpen, setIsChangeIdentityOpen] = useState<'phone' | 'email' | null>(null);
  const [newIdentityValue, setNewIdentityValue] = useState('');
  const [identityOtp, setIdentityOtp] = useState('');
  const [isIdentityOtpSent, setIsIdentityOtpSent] = useState(false);

  // Upload bill for specific order
  const [activeUploadOrderId, setActiveUploadOrderId] = useState<string | null>(null);

  // Profile Form States
  const [editFullName, setEditFullName] = useState(customer?.fullName || '');
  const [editAddress, setEditAddress] = useState(customer?.address || '');
  const [editBirthday, setEditBirthday] = useState(customer?.birthday || '');
  const [editNotes, setEditNotes] = useState(customer?.notes || '');

  // Address Book Modal States
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addrName, setAddrName] = useState('');
  const [addrRecipientName, setAddrRecipientName] = useState('');
  const [addrRecipientPhone, setAddrRecipientPhone] = useState('');
  const [addrRecipientAddress, setAddrRecipientAddress] = useState('');
  const [addrDistanceKm, setAddrDistanceKm] = useState(2);
  const [addrIsDefault, setAddrIsDefault] = useState(false);

  if (!customer) {
    return (
      <div className="container py-16 text-center max-w-md mx-auto space-y-4">
        <div className="glass-panel p-8 space-y-4 rounded-[28px] shadow-xl">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Cổng Thông Tin Thành Viên</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Đăng nhập bằng Số điện thoại hoặc Gmail để xem điểm thưởng, đổi mã freeship và theo dõi tiến độ cắm - giao đơn hoa.
          </p>
          <button
            onClick={() => {
              setAuthModalMode('customer');
              setIsAuthModalOpen(true);
            }}
            className="btn-primary w-full text-xs py-2.5 rounded-xl shadow-md"
          >
            Đăng Nhập Hoặc Đăng Ký
          </button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Filter orders related to customer's phone or email
  const customerOrders = orders.filter((o) => {
    const isCustomerOrder =
      o.senderPhone === customer.phone ||
      o.recipientPhone === customer.phone ||
      (customer.email && (o.senderPhone === customer.email || o.recipientPhone === customer.email));
    if (statusFilter === 'ALL') return isCustomerOrder;
    return isCustomerOrder && o.status === statusFilter;
  });

  const handleReorder = (productId: string, ribbonColor: string, cardMessage: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      addToCart(product, 1, ribbonColor, cardMessage);
      setCurrentView('store');
    } else {
      showToast('Mẫu hoa này hiện tạm hết, vui lòng chọn mẫu khác!', 'error');
    }
  };

  // OTP Verification for 100% points value
  const handleStartOtpVerification = () => {
    requestCustomerOtp();
    setIsOtpModalOpen(true);
  };

  const handleVerifyOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput.trim()) return;
    const ok = verifyCustomerOtp(otpInput.trim());
    if (ok) {
      setIsOtpModalOpen(false);
      setOtpInput('');
    }
  };

  // Change Password
  const handleChangePassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPass || !newPass) return;
    const ok = changeCustomerPassword(oldPass, newPass);
    if (ok) {
      setIsChangePassOpen(false);
      setOldPass('');
      setNewPass('');
    }
  };

  // Change Identity (Phone / Email) with mandatory OTP
  const handleSendIdentityOtp = () => {
    if (!newIdentityValue.trim()) {
      showToast('Vui lòng nhập giá trị mới!', 'error');
      return;
    }
    requestCustomerOtp(newIdentityValue.trim());
    setIsIdentityOtpSent(true);
  };

  const handleIdentitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isChangeIdentityOpen || !newIdentityValue.trim() || !identityOtp.trim()) return;
    const ok = changeCustomerIdentityWithOtp(isChangeIdentityOpen, newIdentityValue.trim(), identityOtp.trim());
    if (ok) {
      setIsChangeIdentityOpen(null);
      setNewIdentityValue('');
      setIdentityOtp('');
      setIsIdentityOtpSent(false);
    }
  };

  // Order bill upload handler
  const handleUploadOrderBill = (orderId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        uploadOrderBill(orderId, dataUrl);
        setActiveUploadOrderId(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Sync profile fields when customer updates
  React.useEffect(() => {
    if (customer) {
      setEditFullName(customer.fullName || '');
      setEditAddress(customer.address || '');
      setEditBirthday(customer.birthday || '');
      setEditNotes(customer.notes || '');
    }
  }, [customer?.fullName, customer?.address, customer?.birthday, customer?.notes]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFullName.trim()) {
      showToast('Vui lòng nhập họ và tên!', 'error');
      return;
    }
    updateCustomerProfile({
      fullName: editFullName.trim(),
      address: editAddress.trim(),
      birthday: editBirthday.trim() || undefined,
      notes: editNotes.trim() || undefined
    });
  };

  const handleOpenAddAddress = () => {
    const currentCount = customer?.savedAddresses?.length || 0;
    if (currentCount >= 3) {
      showToast('Sổ địa chỉ đã đạt tối đa 3 mẫu! Vui lòng xóa bớt để thêm mới.', 'error');
      return;
    }
    setEditingAddressId(null);
    setAddrName('Nhà riêng');
    setAddrRecipientName(customer?.fullName || '');
    setAddrRecipientPhone(customer?.phone || '');
    setAddrRecipientAddress(customer?.address || '');
    setAddrDistanceKm(2);
    setAddrIsDefault(currentCount === 0);
    setIsAddressModalOpen(true);
  };

  const handleOpenEditAddress = (addr: SavedAddress) => {
    setEditingAddressId(addr.id);
    setAddrName(addr.name);
    setAddrRecipientName(addr.recipientName);
    setAddrRecipientPhone(addr.recipientPhone);
    setAddrRecipientAddress(addr.recipientAddress);
    setAddrDistanceKm(addr.distanceKm || 2);
    setAddrIsDefault(!!addr.isDefault);
    setIsAddressModalOpen(true);
  };

  const handleSaveAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrName.trim() || !addrRecipientName.trim() || !addrRecipientPhone.trim() || !addrRecipientAddress.trim()) {
      showToast('Vui lòng điền đủ thông tin địa chỉ người nhận!', 'error');
      return;
    }

    if (editingAddressId) {
      updateSavedAddress(editingAddressId, {
        name: addrName.trim(),
        recipientName: addrRecipientName.trim(),
        recipientPhone: addrRecipientPhone.trim(),
        recipientAddress: addrRecipientAddress.trim(),
        distanceKm: addrDistanceKm,
        isDefault: addrIsDefault
      });
    } else {
      addSavedAddress({
        name: addrName.trim(),
        recipientName: addrRecipientName.trim(),
        recipientPhone: addrRecipientPhone.trim(),
        recipientAddress: addrRecipientAddress.trim(),
        distanceKm: addrDistanceKm,
        isDefault: addrIsDefault
      });
    }
    setIsAddressModalOpen(false);
  };

  return (
    <div className="container py-6 sm:py-8 space-y-6">
      {/* 1. DIGITAL MEMBERSHIP CARD & POINTS WALLET */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Profile Card */}
        <div className="glass-panel p-5 rounded-3xl flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-start gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
              {customer.fullName.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="text-base font-bold text-slate-900 truncate">{customer.fullName}</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {customer.tier}
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
                <span>{customer.phone}</span>
              </div>
              {customer.email && (
                <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1 truncate">
                  <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{customer.email}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Tổng chi tiêu:</span>
            <strong className="text-emerald-800 font-bold">{formatPrice(customer.totalSpent)}</strong>
          </div>
        </div>

        {/* Loyalty Points & Verified Status Card */}
        <div className="glass-panel p-5 rounded-3xl bg-gradient-to-br from-emerald-50/90 via-white/80 to-teal-50/70 border-emerald-200/80 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Điểm Thưởng Tích Lũy</span>
              </span>
              {customer.isVerified ? (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>100% Giá trị</span>
                </span>
              ) : (
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>Chưa xác thực (70%)</span>
                </span>
              )}
            </div>

            <div className="my-2.5">
              <div className="text-3xl font-black text-emerald-700 tracking-tight">
                {customer.points}{' '}
                <span className="text-sm font-semibold text-emerald-600">điểm</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                {customer.isVerified
                  ? `Quy đổi tương đương ${formatPrice(customer.points * 100)} dùng để đổi mã Freeship!`
                  : `Tương đương ${formatPrice(Math.round(customer.points * 100 * 0.7))} (70% giá trị). Xác thực OTP để nhận 100%!`}
              </p>
            </div>
          </div>

          {!customer.isVerified ? (
            <button
              onClick={handleStartOtpVerification}
              className="w-full py-1.5 px-3 bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold rounded-xl flex items-center justify-center gap-1 shadow-sm transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Xác Thực OTP Mở Khóa 100% Điểm</span>
            </button>
          ) : (
            <div className="text-[11px] text-emerald-800 font-semibold bg-emerald-100/70 px-3 py-1.5 rounded-xl flex items-center justify-between">
              <span>Hội viên chính thức</span>
              <span>10.000đ = 1 điểm</span>
            </div>
          )}
        </div>

        {/* Quick Settings & Security Card */}
        <div className="glass-panel p-5 rounded-3xl flex flex-col justify-between shadow-sm">
          <div>
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5 mb-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Bảo Mật Tài Khoản</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <button
                onClick={() => setIsChangePassOpen(true)}
                className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                  <span>Đổi mật khẩu</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  setIsChangeIdentityOpen('phone');
                  setNewIdentityValue(customer.phone);
                }}
                className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Đổi Số điện thoại (Cần OTP)</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  setIsChangeIdentityOpen('email');
                  setNewIdentityValue(customer.email || '');
                }}
                className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Đổi Gmail nhận thông báo</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-100">
            Địa chỉ tiệm: 105 Doãn Kế Thiện, Cầu Giấy, Hà Nội
          </div>
        </div>
      </div>

      {/* 1.5. HỒ SƠ THÀNH VIÊN & SỔ ĐỊA CHỈ NGƯỜI NHẬN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (5 cols): Cập Nhật Thông Tin Cá Nhân */}
        <div className="lg:col-span-5 glass-panel p-5 rounded-3xl space-y-4 shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-sm text-slate-900">Thông Tin Cá Nhân & Nơi Nhận</h3>
            </div>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
              Tự động điền khi mua hoa
            </span>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Họ và tên của bạn *</label>
              <input
                type="text"
                required
                value={editFullName}
                onChange={(e) => setEditFullName(e.target.value)}
                placeholder="Nhập họ và tên..."
                className="glass-input w-full text-xs py-2 px-3 rounded-xl"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Địa chỉ nơi ở / nhận hoa tại Hà Nội</label>
              <div className="relative">
                <input
                  type="text"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  placeholder="Số nhà, ngõ/phố, phường, quận..."
                  className="glass-input w-full text-xs py-2 pl-8 pr-3 rounded-xl"
                />
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-0.5 flex items-center gap-1">
                  <Cake className="w-3 h-3 text-pink-500" />
                  <span>Ngày sinh nhật</span>
                </label>
                <input
                  type="date"
                  value={editBirthday}
                  onChange={(e) => setEditBirthday(e.target.value)}
                  className="glass-input w-full text-xs py-2 px-2.5 rounded-xl text-slate-700"
                />
                <span className="text-[9px] text-slate-400 block mt-0.5">Quà tặng điểm hoặc Freeship sinh nhật</span>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Sở thích hoa tươi</label>
                <input
                  type="text"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="VD: Tone pastel, hoa hồng..."
                  className="glass-input w-full text-xs py-2 px-3 rounded-xl text-slate-700"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="btn-primary w-full py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Lưu Thay Đổi Thông Tin</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column (7 cols): Sổ Địa Chỉ & Người Nhận (Tối đa 3 mẫu) */}
        <div className="lg:col-span-7 glass-panel p-5 rounded-3xl space-y-4 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Sổ Địa Chỉ Người Nhận ({customer.savedAddresses?.length || 0}/3)
                </h3>
              </div>
              <button
                type="button"
                onClick={handleOpenAddAddress}
                disabled={(customer.savedAddresses?.length || 0) >= 3}
                className={`text-[11px] font-bold py-1 px-2.5 rounded-xl flex items-center gap-1 transition-all ${
                  (customer.savedAddresses?.length || 0) >= 3
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm Mẫu Mới</span>
              </button>
            </div>

            {/* Note about verified status */}
            <div className="my-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-[11px] text-slate-600 flex items-center justify-between flex-wrap gap-1">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>
                  {customer.isVerified
                    ? 'Tài khoản đã xác thực: Được lưu tối đa 3 mẫu địa chỉ người nhận mà không cần nhập lại mã OTP.'
                    : 'Hãy xác thực OTP tài khoản để mở khóa toàn bộ đặc quyền lưu mẫu địa chỉ nhanh.'}
                </span>
              </span>
              <span className="font-bold text-emerald-700 whitespace-nowrap">Tối đa 3 mẫu</span>
            </div>

            {/* Address cards list */}
            {(!customer.savedAddresses || customer.savedAddresses.length === 0) ? (
              <div className="py-8 text-center text-slate-400 space-y-2">
                <MapPin className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs">Chưa có mẫu người nhận nào được lưu.</p>
                <p className="text-[11px] text-slate-400">
                  Thêm sẵn người thân, người yêu, đối tác để 1-click chọn nhanh khi đặt hoa tặng hộ!
                </p>
                <button
                  type="button"
                  onClick={handleOpenAddAddress}
                  className="mt-2 text-xs font-bold text-emerald-700 hover:text-emerald-900"
                >
                  + Thêm mẫu địa chỉ đầu tiên
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {customer.savedAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`p-3 rounded-2xl border transition-all ${
                      addr.isDefault
                        ? 'bg-emerald-50/50 border-emerald-300 shadow-xs'
                        : 'bg-white/80 border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-xs text-slate-900">{addr.name}</span>
                          {addr.isDefault && (
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                              Mặc định
                            </span>
                          )}
                          {addr.distanceKm && (
                            <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              ~{addr.distanceKm}km từ 105 Doãn Kế Thiện
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-slate-700 flex items-center gap-2 flex-wrap">
                          <strong>{addr.recipientName}</strong>
                          <span className="text-slate-400">•</span>
                          <span>{addr.recipientPhone}</span>
                        </div>

                        <p className="text-[11px] text-slate-600 truncate flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{addr.recipientAddress}</span>
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0 pt-0.5">
                        {!addr.isDefault && (
                          <button
                            type="button"
                            onClick={() => setDefaultSavedAddress(addr.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 text-[10px] font-semibold"
                            title="Đặt làm mặc định"
                          >
                            Mặc định
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleOpenEditAddress(addr)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                          title="Sửa thông tin"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteSavedAddress(addr.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Xóa mẫu này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. POINTS REDEMPTION FOR FREESHIP VOUCHERS */}
      <div className="glass-panel p-5 rounded-3xl space-y-3.5 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-900">Đổi Điểm Lấy Mã Miễn Phí Vận Chuyển</h3>
          </div>
          <span className="text-xs text-slate-500">
            Số dư khả dụng: <strong className="text-emerald-700">{customer.points} điểm</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'promo-02', code: 'SHIP10K', title: 'Freeship 10.000đ', points: 100, minOrder: 150000 },
            { id: 'promo-03', code: 'SHIP20K', title: 'Freeship 20.000đ', points: 200, minOrder: 250000 },
            { id: 'promo-04', code: 'SHIP30K', title: 'Freeship 30.000đ', points: 300, minOrder: 350000 }
          ].map((item) => {
            const canAfford = customer.points >= item.points;
            return (
              <div
                key={item.code}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                  canAfford
                    ? 'bg-gradient-to-br from-emerald-50/80 to-white border-emerald-200/80 shadow-sm'
                    : 'bg-slate-50/70 border-slate-200/60 opacity-80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-xs text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                      {item.code}
                    </span>
                    <span className="text-[11px] font-bold text-slate-700">{item.points} điểm</span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 mt-1">{item.title}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Áp dụng đơn từ {formatPrice(item.minOrder)}
                  </p>
                </div>

                <button
                  onClick={() => redeemVoucherWithPoints(item.id)}
                  disabled={!canAfford}
                  className={`mt-3 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all ${
                    canAfford
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {canAfford ? 'Đổi Mã Ngay' : `Cần thêm ${item.points - customer.points}đ`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. ORDER TRACKING TIMELINE & ORDERS LIST */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-base text-slate-900">
              Lịch Sử Đơn Hoa ({customerOrders.length})
            </h3>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-semibold overflow-x-auto">
            {(['ALL', 'PENDING', 'ARRANGING', 'SHIPPING', 'COMPLETED'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-xl transition-all whitespace-nowrap ${
                  statusFilter === st ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {st === 'ALL' && 'Tất cả'}
                {st === 'PENDING' && 'Chờ cọc'}
                {st === 'ARRANGING' && 'Đang cắm'}
                {st === 'SHIPPING' && 'Đang giao'}
                {st === 'COMPLETED' && 'Đã giao'}
              </button>
            ))}
          </div>
        </div>

        {customerOrders.length === 0 ? (
          <div className="glass-panel p-12 text-center text-slate-400 space-y-3 rounded-3xl">
            <ShoppingBag className="w-12 h-12 mx-auto text-slate-300" />
            <p className="text-sm font-medium">Chưa có đơn hoa nào trong mục này</p>
            <button
              onClick={() => setCurrentView('store')}
              className="btn-primary text-xs py-2 px-4 rounded-xl"
            >
              Đặt hoa tươi ngay
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {customerOrders.map((order) => {
              // Timeline step determination
              const stepIndex =
                order.status === 'PENDING'
                  ? 0
                  : order.status === 'ARRANGING'
                  ? 1
                  : order.status === 'SHIPPING'
                  ? 2
                  : order.status === 'COMPLETED'
                  ? 3
                  : -1;

              return (
                <div
                  key={order.id}
                  className="glass-panel p-5 rounded-3xl space-y-4 border border-slate-200/80 shadow-sm"
                >
                  {/* Order Top Meta */}
                  <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-emerald-800">
                        #{order.id}
                      </span>
                      <span className="text-xs text-slate-400">• {order.createdAt}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">
                        {formatPrice(order.totalAmount)}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          order.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.status === 'SHIPPING'
                            ? 'bg-sky-100 text-sky-800'
                            : order.status === 'ARRANGING'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {order.status === 'PENDING' && 'Chờ cọc / Chờ duyệt'}
                        {order.status === 'ARRANGING' && 'Đang cắm hoa'}
                        {order.status === 'SHIPPING' && 'Shipper đang giao'}
                        {order.status === 'COMPLETED' && 'Đã hoàn thành'}
                        {order.status === 'CANCELLED' && 'Đã hủy'}
                      </span>
                    </div>
                  </div>

                  {/* 4-Step Visual Progress Bar */}
                  {order.status !== 'CANCELLED' && (
                    <div className="py-2">
                      <div className="grid grid-cols-4 gap-2 text-center">
                        {[
                          { label: 'Chờ cọc', icon: Clock },
                          { label: 'Đang cắm', icon: Sparkles },
                          { label: 'Đang giao', icon: Truck },
                          { label: 'Đã giao', icon: CheckCircle2 }
                        ].map((s, idx) => {
                          const isDone = stepIndex >= idx;
                          const isCurrent = stepIndex === idx;
                          const IconComp = s.icon;
                          return (
                            <div key={s.label} className="flex flex-col items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 text-xs font-bold transition-all ${
                                  isDone
                                    ? 'bg-emerald-600 text-white shadow-sm'
                                    : 'bg-slate-100 text-slate-400'
                                } ${isCurrent ? 'ring-2 ring-emerald-400 ring-offset-2' : ''}`}
                              >
                                <IconComp className="w-4 h-4" />
                              </div>
                              <span
                                className={`text-[10px] ${
                                  isDone ? 'font-bold text-emerald-800' : 'text-slate-400'
                                }`}
                              >
                                {s.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Order Items */}
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs py-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-emerald-700">{item.quantity}x</span>
                          <span className="font-semibold text-slate-800">{item.productName}</span>
                          <span className="text-[11px] text-slate-400">({item.ribbonColor})</span>
                        </div>
                        <span className="font-bold text-slate-700">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Delivery & Recipient Meta */}
                  <div className="p-3 rounded-2xl bg-slate-50/90 text-xs text-slate-600 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>
                        Người nhận: <strong>{order.recipientName}</strong> ({order.recipientPhone}) — {order.recipientAddress}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Thời gian: {order.deliveryDate} ({order.deliveryTimeSlot})</span>
                    </div>
                    {order.cardMessage && (
                      <div className="text-[11px] text-slate-500 italic pl-5">
                        Thiệp: "{order.cardMessage}"
                      </div>
                    )}
                  </div>

                  {/* Bill Upload Prompt if Pending and No Bill */}
                  {order.status === 'PENDING' && !order.paymentBillImage && (
                    <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-2 flex-wrap">
                      <div className="text-xs text-amber-900">
                        <strong>Bạn đã quét mã cọc chưa?</strong> Vui lòng tải ảnh biên lai lên để tiệm duyệt đơn ngay!
                      </div>
                      <label className="py-1 px-3 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl cursor-pointer flex items-center gap-1 shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Tải ảnh biên lai</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleUploadOrderBill(order.id, e)}
                        />
                      </label>
                    </div>
                  )}

                  {/* Bill uploaded preview */}
                  {order.paymentBillImage && (
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50 text-xs text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        Đã tải biên lai • {order.paymentApprovedBy ? `Đã duyệt bởi ${order.paymentApprovedBy}` : 'Trợ lý AI đang đối soát (2 phút)'}
                      </span>
                    </div>
                  )}

                  {/* Reorder Action */}
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => handleReorder(order.items[0]?.productId, order.items[0]?.ribbonColor, order.cardMessage)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Đặt lại mẫu hoa này</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL: OTP VERIFICATION FOR 100% POINTS */}
      {isOtpModalOpen && (
        <div className="glass-overlay" onClick={() => setIsOtpModalOpen(false)}>
          <div className="glass-modal-content p-6 max-w-sm w-full rounded-3xl" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center mb-2">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Xác Thực Hội Viên</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Nhập mã OTP 6 số để mở khóa 100% giá trị điểm thưởng và nhận voucher FREESHIP30K
              </p>
            </div>

            <form onSubmit={handleVerifyOtpSubmit} className="space-y-3">
              <input
                type="text"
                required
                maxLength={6}
                placeholder="Nhập 6 số OTP"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                className="glass-input w-full text-center text-sm font-mono tracking-widest py-2 rounded-xl"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsOtpModalOpen(false)}
                  className="flex-1 py-2 text-xs text-slate-600 border border-slate-200 rounded-xl"
                >
                  Đóng
                </button>
                <button type="submit" className="btn-primary flex-1 py-2 text-xs font-bold rounded-xl">
                  Xác Thực Ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CHANGE PASSWORD */}
      {isChangePassOpen && (
        <div className="glass-overlay" onClick={() => setIsChangePassOpen(false)}>
          <div className="glass-modal-content p-6 max-w-sm w-full rounded-3xl" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-2">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Đổi Mật Khẩu</h3>
            </div>

            <form onSubmit={handleChangePassSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Mật khẩu hiện tại</label>
                <input
                  type="password"
                  required
                  placeholder="Nhập mật khẩu hiện tại"
                  value={oldPass}
                  onChange={(e) => setOldPass(e.target.value)}
                  className="glass-input w-full text-xs py-2 px-3 rounded-xl"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Mật khẩu mới</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Tối thiểu 6 ký tự"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="glass-input w-full text-xs py-2 px-3 rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsChangePassOpen(false)}
                  className="flex-1 py-2 text-xs text-slate-600 border border-slate-200 rounded-xl"
                >
                  Hủy
                </button>
                <button type="submit" className="btn-primary flex-1 py-2 text-xs font-bold rounded-xl">
                  Lưu Mật Khẩu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CHANGE IDENTITY (PHONE/EMAIL) WITH MANDATORY OTP */}
      {isChangeIdentityOpen && (
        <div className="glass-overlay" onClick={() => setIsChangeIdentityOpen(null)}>
          <div className="glass-modal-content p-6 max-w-sm w-full rounded-3xl" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-2">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">
                Đổi {isChangeIdentityOpen === 'phone' ? 'Số Điện Thoại' : 'Gmail'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Bắt buộc xác thực mã OTP trước khi cập nhật định danh
              </p>
            </div>

            <form onSubmit={handleIdentitySubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">
                  {isChangeIdentityOpen === 'phone' ? 'Số điện thoại mới' : 'Gmail mới'}
                </label>
                <div className="flex gap-2">
                  <input
                    type={isChangeIdentityOpen === 'phone' ? 'tel' : 'email'}
                    required
                    value={newIdentityValue}
                    onChange={(e) => setNewIdentityValue(e.target.value)}
                    className="glass-input flex-1 text-xs py-2 px-3 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={handleSendIdentityOtp}
                    className="px-3 py-2 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-xl shrink-0"
                  >
                    {isIdentityOtpSent ? 'Gửi lại' : 'Lấy OTP'}
                  </button>
                </div>
              </div>

              {isIdentityOtpSent && (
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Mã OTP 6 số</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="Nhập 6 số OTP"
                    value={identityOtp}
                    onChange={(e) => setIdentityOtp(e.target.value)}
                    className="glass-input w-full text-center text-sm font-mono tracking-widest py-2 rounded-xl"
                  />
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsChangeIdentityOpen(null)}
                  className="flex-1 py-2 text-xs text-slate-600 border border-slate-200 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={!isIdentityOtpSent}
                  className={`btn-primary flex-1 py-2 text-xs font-bold rounded-xl ${
                    !isIdentityOtpSent ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Lưu Thay Đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT SAVED ADDRESS (MAX 3) */}
      {isAddressModalOpen && (
        <div className="glass-overlay" onClick={() => setIsAddressModalOpen(false)}>
          <div className="glass-modal-content p-6 max-w-md w-full rounded-3xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <BookmarkCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    {editingAddressId ? 'Chỉnh Sửa Mẫu Người Nhận' : 'Thêm Mẫu Người Nhận Mới'}
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    Sổ địa chỉ giúp bạn chọn nhanh trong 1 chạm khi đặt hoa
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveAddressSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">
                  Tên gợi nhớ *
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Nhà riêng, Công ty, Người yêu..."
                  value={addrName}
                  onChange={(e) => setAddrName(e.target.value)}
                  className="glass-input w-full text-xs py-2 px-3 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">
                    Tên người nhận *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Chị Lan"
                    value={addrRecipientName}
                    onChange={(e) => setAddrRecipientName(e.target.value)}
                    className="glass-input w-full text-xs py-2 px-3 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0987 654 321"
                    value={addrRecipientPhone}
                    onChange={(e) => setAddrRecipientPhone(e.target.value)}
                    className="glass-input w-full text-xs py-2 px-3 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">
                  Địa chỉ chi tiết tại Hà Nội *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Số nhà, ngõ/phố, tòa nhà, quận tại Hà Nội..."
                  value={addrRecipientAddress}
                  onChange={(e) => setAddrRecipientAddress(e.target.value)}
                  className="glass-input w-full text-xs py-2 px-3 rounded-xl"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-semibold text-slate-700">
                    Khoảng cách từ 105 Doãn Kế Thiện:
                  </label>
                  <span className="text-[11px] font-bold text-emerald-700">
                    {addrDistanceKm} km
                  </span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[2, 5, 8, 12, 18, 25, 35].map((km) => (
                    <button
                      key={km}
                      type="button"
                      onClick={() => setAddrDistanceKm(km)}
                      className={`py-1 px-2.5 rounded-lg text-[10px] font-bold border transition-colors ${
                        addrDistanceKm === km
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {km} km
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={addrIsDefault}
                    onChange={(e) => setAddrIsDefault(e.target.checked)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span>Đặt làm địa chỉ nhận hoa mặc định</span>
                </label>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="flex-1 py-2 text-xs text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1 py-2 text-xs font-bold rounded-xl shadow-sm"
                >
                  {editingAddressId ? 'Lưu Cập Nhật' : 'Lưu Vào Sổ Địa Chỉ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
