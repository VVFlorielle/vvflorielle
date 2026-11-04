import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { User, ShoppingBag, Gift } from 'lucide-react';
import { OrderStatus, SavedAddress } from '../types';

import { CustomerHeroCard } from '../components/customer/CustomerHeroCard';
import { CustomerOrdersTab } from '../components/customer/CustomerOrdersTab';
import { CustomerRewardsTab } from '../components/customer/CustomerRewardsTab';
import {
  EditProfileModal,
  AddressBookModal,
  AddEditAddressModal,
  CustomerOtpModal,
  ChangePasswordModal,
  ChangeIdentityModal
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

  // Modal display states
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
      setIsOtpModalOpen(false);
      setOtpInput('');
    }
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

  const handleUploadOrderBill = (orderId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        uploadOrderBill(orderId, dataUrl);
      };
      reader.readAsDataURL(file);
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
    <div className="container py-6 sm:py-8 space-y-6 max-w-6xl mx-auto px-4 sm:px-6">
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
          setNewIdentityValue(mode === 'phone' ? customer.phone : customer.email || '');
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
          formatPrice={formatPrice}
        />
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
          setNewIdentityValue(customer.phone);
        }}
        onOpenChangeEmail={() => {
          setIsEditProfileModalOpen(false);
          setIsChangeIdentityOpen('email');
          setNewIdentityValue(customer.email || '');
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
        onClose={() => setIsOtpModalOpen(false)}
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
        newIdentityValue={newIdentityValue}
        setNewIdentityValue={setNewIdentityValue}
        identityOtp={identityOtp}
        setIdentityOtp={setIdentityOtp}
        isIdentityOtpSent={isIdentityOtpSent}
        onSendOtp={handleSendIdentityOtp}
        onSubmit={handleIdentitySubmit}
      />
    </div>
  );
};
