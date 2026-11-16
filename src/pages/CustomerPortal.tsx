import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { User, ShoppingBag, Gift, ShieldCheck, Download, Trash2, ShieldAlert, FileText } from 'lucide-react';
import { OrderStatus, SavedAddress } from '../types';
import { compressImage } from '../utils/imageCompressor';

import { CustomerHeroCard } from '../components/customer/CustomerHeroCard';
import { CustomerOrdersTab } from '../components/customer/CustomerOrdersTab';
import { CustomerRewardsTab } from '../components/customer/CustomerRewardsTab';
import {
  EditProfileModal,
  AddressBookModal,
  AddEditAddressModal,
  CustomerOtpModal,
  ChangePasswordModal,
  ChangeIdentityModal,
  AccountErasureModal
} from '../components/customer/CustomerModals';

export const CustomerPortal: React.FC = () => {
  const {
    customer,
    orders,
    addToCart,
    products,
    setCurrentView,
    setIsAuthModalOpen,
    setAuthModalMode,
    redeemVoucherWithPoints,
    requestCustomerOtp,
    verifyCustomerOtp,
    changeCustomerPassword,
    changeCustomerIdentityWithOtp,
    requestIdentityChangeStep1Otp,
    verifyIdentityChangeStep1Otp,
    requestIdentityChangeStep2Otp,
    confirmIdentityChangeStep2,
    requestCustomerAccountErasure,
    exportCustomerPersonalDataJson,
    uploadOrderBill,
    updateCustomerProfile,
    addSavedAddress,
    updateSavedAddress,
    deleteSavedAddress,
    setDefaultSavedAddress,
    showToast
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'rewards' | 'privacy'>('orders');
  const [statusFilter, setStatusFilter] = useState<'ALL' | OrderStatus>('ALL');

  // Modal display states
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isAddressBookModalOpen, setIsAddressBookModalOpen] = useState(false);
  const [isAddEditAddressFormOpen, setIsAddEditAddressFormOpen] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [pendingRedeemPromoId, setPendingRedeemPromoId] = useState<string | null>(null);
  const [isChangePassOpen, setIsChangePassOpen] = useState(false);
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [isChangeIdentityOpen, setIsChangeIdentityOpen] = useState<'phone' | 'email' | null>(null);
  const [isAccountErasureOpen, setIsAccountErasureOpen] = useState(false);

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

  useEffect(() => {
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
            className="btn-primary w-full text-xs py-2.5 rounded-xl shadow-md cursor-pointer"
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

  const defaultSavedAddress =
    customer.savedAddresses?.find((a) => a.isDefault) || customer.savedAddresses?.[0];

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

  const handleVerifyOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput.trim()) return;
    const ok = verifyCustomerOtp(otpInput.trim());
    if (ok) {
      if (pendingRedeemPromoId) {
        redeemVoucherWithPoints(pendingRedeemPromoId);
        setPendingRedeemPromoId(null);
      }
      setIsOtpModalOpen(false);
      setOtpInput('');
    }
  };

  const handleRequestHighValueOtp = (promoId: string) => {
    setPendingRedeemPromoId(promoId);
    requestCustomerOtp();
    setIsOtpModalOpen(true);
  };

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

  const handleUploadOrderBill = async (orderId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedDataUrl = await compressImage(file, 1000, 1000, 0.72);
        uploadOrderBill(orderId, compressedDataUrl);
      } catch (err) {
        console.error('Lỗi nén ảnh biên lai', err);
        showToast('Không thể nén ảnh biên lai, vui lòng thử lại!', 'error');
      }
    }
  };

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
    <div className="container pt-6 sm:pt-8 pb-32 sm:pb-16 space-y-6 max-w-6xl mx-auto px-4 sm:px-6">
      {/* 1. Unified Membership & Profile Card */}
      <CustomerHeroCard
        customer={customer}
        defaultSavedAddress={defaultSavedAddress}
        onOpenEditProfile={() => setIsEditProfileModalOpen(true)}
        onOpenAddressBook={() => setIsAddressBookModalOpen(true)}
        onOpenChangePass={() => setIsChangePassOpen(true)}
        onStartOtpVerification={() => {
          requestCustomerOtp();
          setIsOtpModalOpen(true);
        }}
        onOpenChangeIdentity={(mode) => {
          setIsChangeIdentityOpen(mode);
        }}
        onSwitchTab={(tab) => setActiveTab(tab)}
        activeTab={activeTab}
      />

      {/* 2. Tab Navigation Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-slate-200">
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
            <span>Theo Dõi Đơn Hoa ({customerOrders.length})</span>
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
            <span>Đổi Quà Freeship</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Quyền Riêng Tư (NĐ 13/2023)</span>
          </button>
        </div>
      </div>

      {/* 3. Tab Contents */}
      {activeTab === 'orders' && (
        <CustomerOrdersTab
          orders={customerOrders}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          formatPrice={formatPrice}
          onReorder={handleReorder}
          onUploadBill={handleUploadOrderBill}
          onGoToStore={() => setCurrentView('store')}
        />
      )}

      {activeTab === 'rewards' && (
        <CustomerRewardsTab
          customer={customer}
          redeemVoucherWithPoints={redeemVoucherWithPoints}
          onRequestHighValueOtp={handleRequestHighValueOtp}
          formatPrice={formatPrice}
        />
      )}

      {activeTab === 'privacy' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Header Card */}
          <div className="p-5 rounded-3xl bg-linear-to-r from-emerald-900 via-teal-900 to-slate-900 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Nghị định 13/2023/NĐ-CP về Bảo vệ Dữ liệu Cá nhân</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold">Minh Bạch &amp; Kiểm Soát Dữ Liệu Cá Nhân</h2>
              <p className="text-xs text-emerald-100/80 max-w-2xl leading-relaxed">
                Tiệm Hoa Tươi Nghệ Thuật V&amp;V Florielle cam kết bảo vệ dữ liệu cá nhân của quý khách theo các tiêu chuẩn pháp lý cao nhất của Việt Nam. Dữ liệu tài khoản của bạn được niêm phong chữ ký điện tử HMAC-SHA256 chống can thiệp trái phép.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card 1: Right to Data Portability */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Download className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm text-slate-900">Quyền Trích Xuất Dữ Liệu Cá Nhân (Data Portability)</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Tải về bản sao toàn bộ dữ liệu cá nhân của bạn đang lưu trữ trên hệ thống dưới định dạng JSON chuẩn: Hồ sơ hội viên, điểm thưởng, kho voucher, và toàn bộ lịch sử đơn đặt hoa.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={exportCustomerPersonalDataJson}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải Bản Sao Dữ Liệu (.JSON)</span>
                </button>
              </div>
            </div>

            {/* Card 2: Right to Erasure */}
            <div className="p-5 rounded-3xl bg-white border border-rose-100 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                  <Trash2 className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm text-slate-900">Quyền Xóa / Rút Lại Đồng Ý (Right to Erasure)</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Xóa toàn bộ hồ sơ nhận diện cá nhân (Họ tên, SĐT, Email, Sổ địa chỉ). Dữ liệu sẽ được ẩn danh hóa vĩnh viễn theo Điều 16 Nghị định 13/2023/NĐ-CP. Thao tác này yêu cầu xác thực OTP chính chủ.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsAccountErasureOpen(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Yêu Cầu Xóa / Ẩn Danh Hóa Tài Khoản</span>
                </button>
              </div>
            </div>
          </div>

          {/* Privacy Commitments */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Cam kết tuân thủ Nghị định 13/2023/NĐ-CP của V&amp;V Florielle:</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              1. Tiệm hoa chỉ thu thập thông tin cần thiết phục vụ giao nhận hoa tươi, thanh toán VietQR và chăm sóc hội viên.
              <br />
              2. Không chia sẻ, buôn bán dữ liệu cá nhân cho bên thứ ba dưới bất kỳ hình thức nào.
              <br />
              3. Chứng từ đơn hoa được lưu trữ phục vụ nghĩa vụ hóa đơn tài chính theo Luật Quản lý Thuế Việt Nam với các trường thông tin cá nhân được bảo vệ nghiêm ngặt.
            </p>
          </div>
        </div>
      )}

      {/* 4. Modals */}
      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        customer={customer}
        editFullName={editFullName}
        setEditFullName={setEditFullName}
        editBirthday={editBirthday}
        setEditBirthday={setEditBirthday}
        editAddress={editAddress}
        setEditAddress={setEditAddress}
        editNotes={editNotes}
        setEditNotes={setEditNotes}
        onSave={handleSaveProfile}
        onOpenChangePass={() => {
          setIsEditProfileModalOpen(false);
          setIsChangePassOpen(true);
        }}
        onOpenChangePhone={() => {
          setIsEditProfileModalOpen(false);
          setIsChangeIdentityOpen('phone');
        }}
        onOpenChangeEmail={() => {
          setIsEditProfileModalOpen(false);
          setIsChangeIdentityOpen('email');
        }}
      />

      <AddressBookModal
        isOpen={isAddressBookModalOpen}
        onClose={() => setIsAddressBookModalOpen(false)}
        savedAddresses={customer.savedAddresses}
        onSetDefault={(id) => setDefaultSavedAddress(id)}
        onEditAddress={handleOpenEditAddress}
        onDeleteAddress={(id) => deleteSavedAddress(id)}
        onOpenAddAddress={handleOpenAddAddress}
      />

      <AddEditAddressModal
        isOpen={isAddEditAddressFormOpen}
        onClose={() => setIsAddEditAddressFormOpen(false)}
        isEditing={!!editingAddressId}
        addrName={addrName}
        setAddrName={setAddrName}
        addrRecipientName={addrRecipientName}
        setAddrRecipientName={setAddrRecipientName}
        addrRecipientPhone={addrRecipientPhone}
        setAddrRecipientPhone={setAddrRecipientPhone}
        addrRecipientAddress={addrRecipientAddress}
        setAddrRecipientAddress={setAddrRecipientAddress}
        addrDistanceKm={addrDistanceKm}
        setAddrDistanceKm={setAddrDistanceKm}
        addrIsDefault={addrIsDefault}
        setAddrIsDefault={setAddrIsDefault}
        onSave={handleSaveAddressSubmit}
      />

      <CustomerOtpModal
        isOpen={isOtpModalOpen}
        onClose={() => {
          setIsOtpModalOpen(false);
          setPendingRedeemPromoId(null);
          setOtpInput('');
        }}
        otpInput={otpInput}
        setOtpInput={setOtpInput}
        onSubmit={handleVerifyOtpSubmit}
      />

      <ChangePasswordModal
        isOpen={isChangePassOpen}
        onClose={() => setIsChangePassOpen(false)}
        oldPass={oldPass}
        setOldPass={setOldPass}
        newPass={newPass}
        setNewPass={setNewPass}
        onSubmit={handleChangePassSubmit}
      />

      <ChangeIdentityModal
        isOpen={isChangeIdentityOpen}
        onClose={() => setIsChangeIdentityOpen(null)}
        currentValue={isChangeIdentityOpen === 'phone' ? customer.phone : customer.email}
        onRequestStep1Otp={requestIdentityChangeStep1Otp}
        onVerifyStep1Otp={verifyIdentityChangeStep1Otp}
        onRequestStep2Otp={requestIdentityChangeStep2Otp}
        onConfirmStep2={confirmIdentityChangeStep2}
      />

      <AccountErasureModal
        isOpen={isAccountErasureOpen}
        onClose={() => setIsAccountErasureOpen(false)}
        customerAccountCode={customer.accountCode}
        customerTargetInfo={customer.phone || customer.email || 'bạn'}
        onRequestOtp={() => requestCustomerOtp()}
        onConfirmErasure={(otp) => requestCustomerAccountErasure(otp)}
      />
    </div>
  );
};
