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
  Check,
  X,
  Star,
  Layers,
  Heart
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

  const [activeTab, setActiveTab] = useState<'orders' | 'rewards'>('orders');
  const [statusFilter, setStatusFilter] = useState<'ALL' | OrderStatus>('ALL');

  // Modals inside Customer Portal
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isAddressBookModalOpen, setIsAddressBookModalOpen] = useState(false);
  const [isAddEditAddressFormOpen, setIsAddEditAddressFormOpen] = useState(false);

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

  // Address Book Form States
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addrName, setAddrName] = useState('');
  const [addrRecipientName, setAddrRecipientName] = useState('');
  const [addrRecipientPhone, setAddrRecipientPhone] = useState('');
  const [addrRecipientAddress, setAddrRecipientAddress] = useState('');
  const [addrDistanceKm, setAddrDistanceKm] = useState(2);
  const [addrIsDefault, setAddrIsDefault] = useState(false);

  // Sync profile fields when customer updates
  React.useEffect(() => {
    if (customer) {
      setEditFullName(customer.fullName || '');
      setEditAddress(customer.address || '');
      setEditBirthday(customer.birthday || '');
      setEditNotes(customer.notes || '');
    }
  }, [customer?.fullName, customer?.address, customer?.birthday, customer?.notes]);

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

  // Default address resolution
  const defaultSavedAddress = customer.savedAddresses?.find((a) => a.isDefault) || customer.savedAddresses?.[0];

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

  // Save Profile Form
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
    setIsEditProfileModalOpen(false);
  };

  // Address Actions
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
    setIsAddEditAddressFormOpen(true);
  };

  const handleOpenEditAddress = (addr: SavedAddress) => {
    setEditingAddressId(addr.id);
    setAddrName(addr.name);
    setAddrRecipientName(addr.recipientName);
    setAddrRecipientPhone(addr.recipientPhone);
    setAddrRecipientAddress(addr.recipientAddress);
    setAddrDistanceKm(addr.distanceKm || 2);
    setAddrIsDefault(!!addr.isDefault);
    setIsAddEditAddressFormOpen(true);
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
    setIsAddEditAddressFormOpen(false);
  };

  return (
    <div className="container py-6 sm:py-8 space-y-6 max-w-6xl mx-auto px-4 sm:px-6">
      {/* ========================================================================= */}
      {/* 1. UNIFIED LUXURY MEMBERSHIP & PROFILE CARD (BỐ TRÍ KHOA HỌC GỌN GÀNG)   */}
      {/* ========================================================================= */}
      <div className="glass-panel p-6 sm:p-7 rounded-[30px] shadow-sm relative overflow-hidden border border-emerald-200/80 bg-gradient-to-br from-white/95 via-emerald-50/40 to-teal-50/50">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
          {/* Column A: Customer Identity & Details (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-3xl bg-gradient-to-tr from-emerald-700 via-teal-600 to-emerald-500 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-emerald-700/20 shrink-0 border-2 border-white/80">
                {customer.fullName.charAt(0)}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {customer.fullName}
                  </h2>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs">
                    {customer.tier}
                  </span>
                  {customer.isVerified ? (
                    <span className="text-[11px] font-bold text-emerald-700 bg-white/90 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200 shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Hội viên 100% Điểm</span>
                    </span>
                  ) : (
                    <button
                      onClick={handleStartOtpVerification}
                      className="text-[10px] font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-300 transition-colors cursor-pointer"
                      title="Bấm để nhận OTP mở khóa 100% giá trị điểm"
                    >
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      <span>Xác thực OTP (Nhận 100% Điểm)</span>
                    </button>
                  )}
                </div>

                {/* Metadata Pills Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 mt-2.5 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-slate-800">{customer.phone}</span>
                  </div>

                  <div className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{customer.email || 'Chưa liên kết Gmail'}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Cake className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                    <span>
                      {customer.birthday ? `Sinh nhật: ${customer.birthday}` : 'Chưa cập nhật ngày sinh'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="truncate" title={defaultSavedAddress ? defaultSavedAddress.recipientAddress : (customer.address || 'Hà Nội')}>
                      {defaultSavedAddress
                        ? `${defaultSavedAddress.recipientAddress} (${defaultSavedAddress.name})`
                        : (customer.address || '105 Doãn Kế Thiện, Cầu Giấy, Hà Nội')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS (GỌN GÀNG, RÕ RÀNG, BẤM LÀ RA POPUP NỔI) */}
            <div className="flex items-center gap-2.5 flex-wrap pt-1">
              <button
                onClick={() => setIsEditProfileModalOpen(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 bg-white/90 hover:bg-emerald-50 border border-slate-200/90 hover:border-emerald-300 shadow-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Chỉnh Sửa Hồ Sơ Cá Nhân</span>
              </button>

              <button
                onClick={() => setIsAddressBookModalOpen(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-900 bg-emerald-100/90 hover:bg-emerald-200/80 border border-emerald-300 shadow-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              >
                <BookmarkCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>
                  Sổ Địa Chỉ Nhận Hoa ({customer.savedAddresses?.length || 0}/3)
                </span>
                {defaultSavedAddress && (
                  <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded-full font-bold ml-1">
                    {defaultSavedAddress.name}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Column B: Loyalty Wallet & Spending Highlights (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="p-4 sm:p-5 rounded-2xl bg-white/90 border border-emerald-200/90 shadow-sm flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>Ví Điểm Thưởng Tích Lũy</span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-0.5 tracking-tight">
                  {customer.points}{' '}
                  <span className="text-xs font-bold text-emerald-600">điểm</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Quy đổi tương đương {formatPrice(customer.points * 100)} dùng để đổi mã Freeship!
                </p>
              </div>

              <button
                onClick={() => setActiveTab('rewards')}
                className="py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 whitespace-nowrap active:scale-95 transition-all"
              >
                Đổi Voucher
              </button>
            </div>

            <div className="p-3 px-4 rounded-xl bg-slate-50/80 border border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
              <span>Tổng tích lũy mua hoa:</span>
              <strong className="text-slate-900 font-bold">
                {formatPrice(customer.totalSpent)} ({customer.ordersCount || 0} đơn)
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TAB NAVIGATION (ĐIỀU HƯỚNG KHOA HỌC: ĐƠN HÀNG VS KHO VOUCHER)          */}
      {/* ========================================================================= */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-slate-200/80">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Lịch Sử Đơn Hoa ({customerOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('rewards')}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'rewards'
                ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>Kho Điểm & Voucher Ưu Đãi</span>
          </button>
        </div>

        {/* Order Status Filters (Shown when Tab Orders is active) */}
        {activeTab === 'orders' && (
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-semibold overflow-x-auto">
            {(['ALL', 'PENDING', 'ARRANGING', 'SHIPPING', 'COMPLETED'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  statusFilter === st ? 'bg-white text-emerald-800 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-900'
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
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. TAB 1: ORDER TRACKING TIMELINE & ORDERS LIST                          */}
      {/* ========================================================================= */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {customerOrders.length === 0 ? (
            <div className="glass-panel p-12 text-center text-slate-400 space-y-3 rounded-3xl border border-slate-200">
              <ShoppingBag className="w-12 h-12 mx-auto text-slate-300" />
              <p className="text-sm font-medium">Chưa có đơn hoa nào trong mục này</p>
              <button
                onClick={() => setCurrentView('store')}
                className="btn-primary text-xs py-2 px-5 rounded-xl cursor-pointer"
              >
                Khám phá mẫu hoa tươi ngay
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {customerOrders.map((order) => {
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
                    className="glass-panel p-5 rounded-3xl space-y-4 border border-slate-200/90 shadow-sm"
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
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer"
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
      )}

      {/* ========================================================================= */}
      {/* 4. TAB 2: POINTS REDEMPTION FOR FREESHIP VOUCHERS                         */}
      {/* ========================================================================= */}
      {activeTab === 'rewards' && (
        <div className="glass-panel p-6 rounded-3xl space-y-4 border border-emerald-200/80 shadow-sm bg-gradient-to-br from-white/95 to-emerald-50/30">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-base text-slate-900">Đổi Điểm Thưởng Lấy Voucher Freeship</h3>
            </div>
            <span className="text-xs text-slate-600">
              Số dư khả dụng: <strong className="text-emerald-700 font-bold">{customer.points} điểm</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { id: 'promo-02', code: 'SHIP10K', title: 'Freeship 10.000đ', points: 100, minOrder: 150000 },
              { id: 'promo-03', code: 'SHIP20K', title: 'Freeship 20.000đ', points: 200, minOrder: 250000 },
              { id: 'promo-04', code: 'SHIP30K', title: 'Freeship 30.000đ', points: 300, minOrder: 350000 }
            ].map((item) => {
              const canAfford = customer.points >= item.points;
              return (
                <div
                  key={item.code}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    canAfford
                      ? 'bg-gradient-to-br from-emerald-50/80 to-white border-emerald-300 shadow-sm'
                      : 'bg-slate-50/70 border-slate-200/60 opacity-80'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono font-bold text-xs text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-md border border-emerald-200">
                        {item.code}
                      </span>
                      <span className="text-xs font-bold text-emerald-700">{item.points} điểm</span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 mt-1">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Áp dụng cho mọi đơn hoa từ {formatPrice(item.minOrder)} tại Hà Nội.
                    </p>
                  </div>

                  <button
                    onClick={() => redeemVoucherWithPoints(item.id)}
                    disabled={!canAfford}
                    className={`mt-4 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      canAfford
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm active:scale-95'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? 'Đổi Mã Ngay' : `Cần thêm ${item.points - customer.points} điểm`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL 1: CHỈNH SỬA THÔNG TIN CÁ NHÂN (POPUP NỔI HIỆN ĐẠI)              */}
      {/* ========================================================================= */}
      {isEditProfileModalOpen && (
        <div className="glass-overlay z-[120]" onClick={() => setIsEditProfileModalOpen(false)}>
          <div
            className="glass-modal-content max-w-lg md:max-w-2xl w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Fixed Header */}
            <div className="glass-modal-header">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight">Chỉnh Sửa Hồ Sơ Cá Nhân</h3>
                  <p className="text-[11px] text-slate-500">Cập nhật thông tin để tiệm hoa phục vụ bạn chu đáo nhất</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditProfileModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Đóng cửa sổ"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <form onSubmit={handleSaveProfile} className="flex-1 flex flex-col overflow-hidden">
              <div className="glass-modal-body space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Họ và tên của bạn *
                    </label>
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
                    <label className="text-xs font-semibold text-slate-700 block mb-1 flex items-center gap-1">
                      <Cake className="w-3.5 h-3.5 text-pink-500" />
                      <span>Ngày sinh nhật</span>
                      <span className="text-[10px] text-slate-400 font-normal ml-auto">(Quà & freeship)</span>
                    </label>
                    <input
                      type="date"
                      value={editBirthday}
                      onChange={(e) => setEditBirthday(e.target.value)}
                      className="glass-input w-full text-xs py-2 px-3 rounded-xl text-slate-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>Địa chỉ nơi ở hiện tại / thường trú tại Hà Nội</span>
                  </label>
                  <input
                    type="text"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    placeholder="Số nhà, ngõ/phố, phường, quận tại Hà Nội..."
                    className="glass-input w-full text-xs py-2 px-3 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Sở thích / Phong cách hoa tươi ưa chuộng
                  </label>
                  <input
                    type="text"
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="VD: Tone pastel, hoa hồng Ohara, cúc họa mi..."
                    className="glass-input w-full text-xs py-2 px-3 rounded-xl"
                  />
                </div>

                {/* Sub-actions for Security */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Cập nhật tài khoản & bảo mật
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditProfileModalOpen(false);
                        setIsChangePassOpen(true);
                      }}
                      className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-center font-medium transition-colors cursor-pointer"
                    >
                      Đổi Mật Khẩu
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsEditProfileModalOpen(false);
                        setIsChangeIdentityOpen('phone');
                        setNewIdentityValue(customer.phone);
                      }}
                      className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-center font-medium transition-colors cursor-pointer"
                    >
                      Đổi SĐT (OTP)
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsEditProfileModalOpen(false);
                        setIsChangeIdentityOpen('email');
                        setNewIdentityValue(customer.email || '');
                      }}
                      className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-center font-medium transition-colors cursor-pointer"
                    >
                      Đổi Gmail (OTP)
                    </button>
                  </div>
                </div>
              </div>

              {/* Fixed Footer */}
              <div className="glass-modal-footer">
                <button
                  type="button"
                  onClick={() => setIsEditProfileModalOpen(false)}
                  className="py-2.5 px-4 text-xs text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn-primary py-2.5 px-5 text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu Hồ Sơ</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL 2: SỔ ĐỊA CHỈ NGƯỜI NHẬN & CHỌN ĐỊA CHỈ MẶC ĐỊNH (MAX 3 MẪU)    */}
      {/* ========================================================================= */}
      {isAddressBookModalOpen && (
        <div className="glass-overlay z-[120]" onClick={() => setIsAddressBookModalOpen(false)}>
          <div
            className="glass-modal-content max-w-lg md:max-w-2xl w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Fixed Header */}
            <div className="glass-modal-header">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <BookmarkCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight">
                    Sổ Địa Chỉ Người Nhận ({customer.savedAddresses?.length || 0}/3)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Chọn nhanh người nhận khi đặt hoa hoặc gửi hoa giấu tên bí mật
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddressBookModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Đóng cửa sổ"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Address List Body */}
            <div className="glass-modal-body space-y-3">
              {(!customer.savedAddresses || customer.savedAddresses.length === 0) ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <MapPin className="w-10 h-10 mx-auto text-slate-300" />
                  <p className="text-xs font-semibold">Chưa có mẫu địa chỉ người nhận nào.</p>
                  <p className="text-[11px] text-slate-400">
                    Lưu sẵn địa chỉ người thân, người yêu, đối tác để 1 chạm là đặt ngay!
                  </p>
                </div>
              ) : (
                customer.savedAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      addr.isDefault
                        ? 'bg-emerald-50/70 border-emerald-400 shadow-sm ring-1 ring-emerald-300'
                        : 'bg-white border-slate-200/90 hover:border-emerald-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-black text-xs text-slate-900">{addr.name}</span>
                          {addr.isDefault ? (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white flex items-center gap-1 shadow-xs">
                              <Star className="w-3 h-3 fill-white" />
                              <span>Mặc định</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => setDefaultSavedAddress(addr.id)}
                              className="text-[10px] font-bold text-slate-500 hover:text-emerald-700 hover:bg-emerald-100 px-2 py-0.5 rounded-full border border-slate-200 hover:border-emerald-300 transition-colors cursor-pointer flex items-center gap-1"
                              title="Bấm để đặt làm địa chỉ mặc định khi mua hoa"
                            >
                              <Star className="w-3 h-3" />
                              <span>Chọn làm mặc định</span>
                            </button>
                          )}
                          {addr.distanceKm && (
                            <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-medium">
                              ~{addr.distanceKm} km
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-slate-800 flex items-center gap-2 flex-wrap">
                          <span className="font-bold">{addr.recipientName}</span>
                          <span className="text-slate-400">•</span>
                          <span>{addr.recipientPhone}</span>
                        </div>

                        <p className="text-[11px] text-slate-600 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{addr.recipientAddress}</span>
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0 pt-0.5">
                        <button
                          onClick={() => handleOpenEditAddress(addr)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                          title="Sửa địa chỉ này"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteSavedAddress(addr.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                          title="Xóa địa chỉ này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Fixed Footer */}
            <div className="glass-modal-footer justify-between">
              <span className="text-[11px] text-slate-500">
                Tối đa được lưu 3 địa chỉ
              </span>
              <button
                type="button"
                onClick={handleOpenAddAddress}
                disabled={(customer.savedAddresses?.length || 0) >= 3}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  (customer.savedAddresses?.length || 0) >= 3
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm cursor-pointer'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Mẫu Mới</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. MODAL 3: FORM THÊM / CHỈNH SỬA ĐỊA CHỈ (SUB-POPUP)                      */}
      {/* ========================================================================= */}
      {isAddEditAddressFormOpen && (
        <div className="glass-overlay z-[130]" onClick={() => setIsAddEditAddressFormOpen(false)}>
          <div
            className="glass-modal-content max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Fixed Header */}
            <div className="glass-modal-header">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <BookmarkCheck className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900">
                  {editingAddressId ? 'Chỉnh Sửa Mẫu Người Nhận' : 'Thêm Mẫu Người Nhận Mới'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddEditAddressFormOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Đóng cửa sổ"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSaveAddressSubmit} className="flex-1 flex flex-col overflow-hidden">
              <div className="glass-modal-body space-y-3">
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
                      placeholder="VD: Chị Thảo"
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
                        className={`py-1 px-2.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
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
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                    />
                    <span>Đặt làm địa chỉ nhận hoa mặc định</span>
                  </label>
                </div>
              </div>

              {/* Fixed Footer */}
              <div className="glass-modal-footer">
                <button
                  type="button"
                  onClick={() => setIsAddEditAddressFormOpen(false)}
                  className="py-2 px-4 text-xs text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn-primary py-2 px-4 text-xs font-bold rounded-xl shadow-sm cursor-pointer"
                >
                  {editingAddressId ? 'Lưu Cập Nhật' : 'Lưu Vào Sổ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. MODAL 4: XÁC THỰC OTP HỘI VIÊN MỞ KHÓA 100% ĐIỂM                       */}
      {/* ========================================================================= */}
      {isOtpModalOpen && (
        <div className="glass-overlay z-[140]" onClick={() => setIsOtpModalOpen(false)}>
          <div className="glass-modal-content max-w-sm w-full relative" onClick={(e) => e.stopPropagation()}>
            <div className="glass-modal-header">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-sm text-slate-900">Xác Thực Hội Viên</h3>
              </div>
              <button
                onClick={() => setIsOtpModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="glass-modal-body text-center space-y-3">
              <p className="text-xs text-slate-500">
                Nhập mã OTP 6 số đã được gửi qua thông báo (mã mẫu: <span className="font-mono font-bold text-emerald-700">190903</span>)
              </p>

              <form onSubmit={handleVerifyOtpSubmit} className="space-y-3">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Nhập 6 số OTP"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  className="glass-input w-full text-center text-lg font-mono tracking-widest py-2.5 rounded-xl"
                />

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsOtpModalOpen(false)}
                    className="flex-1 py-2 text-xs text-slate-600 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50"
                  >
                    Đóng
                  </button>
                  <button type="submit" className="btn-primary flex-1 py-2 text-xs font-bold rounded-xl cursor-pointer">
                    Xác Thực Ngay
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. MODAL 5: ĐỔI MẬT KHẨU                                                  */}
      {/* ========================================================================= */}
      {isChangePassOpen && (
        <div className="glass-overlay z-[140]" onClick={() => setIsChangePassOpen(false)}>
          <div className="glass-modal-content max-w-sm w-full relative" onClick={(e) => e.stopPropagation()}>
            <div className="glass-modal-header">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-purple-600" />
                <h3 className="font-bold text-sm text-slate-900">Đổi Mật Khẩu</h3>
              </div>
              <button
                onClick={() => setIsChangePassOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="glass-modal-body">
              <form onSubmit={handleChangePassSubmit} className="space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    required
                    value={oldPass}
                    onChange={(e) => setOldPass(e.target.value)}
                    className="glass-input w-full text-xs py-2 px-3 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Mật khẩu mới (Tối thiểu 6 ký tự)</label>
                  <input
                    type="password"
                    required
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className="glass-input w-full text-xs py-2 px-3 rounded-xl"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsChangePassOpen(false)}
                    className="flex-1 py-2 text-xs text-slate-600 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50"
                  >
                    Hủy
                  </button>
                  <button type="submit" className="btn-primary flex-1 py-2 text-xs font-bold rounded-xl cursor-pointer">
                    Cập Nhật
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 10. MODAL 6: ĐỔI SĐT HOẶC GMAIL VỚI XÁC THỰC OTP                         */}
      {/* ========================================================================= */}
      {isChangeIdentityOpen && (
        <div className="glass-overlay z-[140]" onClick={() => setIsChangeIdentityOpen(null)}>
          <div className="glass-modal-content max-w-sm w-full relative" onClick={(e) => e.stopPropagation()}>
            <div className="glass-modal-header">
              <div className="flex items-center gap-2">
                {isChangeIdentityOpen === 'phone' ? <Phone className="w-4 h-4 text-emerald-600" /> : <Mail className="w-4 h-4 text-emerald-600" />}
                <h3 className="font-bold text-sm text-slate-900">
                  {isChangeIdentityOpen === 'phone' ? 'Đổi Số Điện Thoại' : 'Đổi Gmail Nhận Thông Báo'}
                </h3>
              </div>
              <button
                onClick={() => setIsChangeIdentityOpen(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="glass-modal-body space-y-3">
              <p className="text-[11px] text-slate-500">
                Để bảo vệ quyền lợi thành viên, bạn cần xác thực mã OTP trước khi thay đổi.
              </p>

              <form onSubmit={handleIdentitySubmit} className="space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">
                    {isChangeIdentityOpen === 'phone' ? 'Số điện thoại mới' : 'Địa chỉ Gmail mới'}
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
                      className="py-2 px-3 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[11px] font-bold rounded-xl whitespace-nowrap cursor-pointer"
                    >
                      Gửi OTP
                    </button>
                  </div>
                </div>

                {isIdentityOtpSent && (
                  <div className="animate-in fade-in">
                    <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">
                      Mã xác thực OTP (Mã mẫu: 190903)
                    </label>
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
                    className="flex-1 py-2 text-xs text-slate-600 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={!isIdentityOtpSent}
                    className={`btn-primary flex-1 py-2 text-xs font-bold rounded-xl cursor-pointer ${
                      !isIdentityOtpSent ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    Lưu Thay Đổi
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
