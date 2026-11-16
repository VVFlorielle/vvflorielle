import React, { useState, useEffect } from 'react';
import { CustomerUser, SavedAddress } from '../../types';
import {
  X,
  User,
  Cake,
  MapPin,
  Save,
  BookmarkCheck,
  Star,
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  KeyRound,
  Phone,
  Mail,
  Lock,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Clock
} from 'lucide-react';

// 1. Edit Profile Modal
interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerUser;
  editFullName: string;
  setEditFullName: (v: string) => void;
  editBirthday: string;
  setEditBirthday: (v: string) => void;
  editAddress: string;
  setEditAddress: (v: string) => void;
  editNotes: string;
  setEditNotes: (v: string) => void;
  onSave: (e: React.FormEvent) => void;
  onOpenChangePass: () => void;
  onOpenChangePhone: () => void;
  onOpenChangeEmail: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  customer,
  editFullName,
  setEditFullName,
  editBirthday,
  setEditBirthday,
  editAddress,
  setEditAddress,
  editNotes,
  setEditNotes,
  onSave,
  onOpenChangePass,
  onOpenChangePhone,
  onOpenChangeEmail
}) => {
  if (!isOpen) return null;

  return (
    <div className="glass-overlay z-[120]" onClick={onClose}>
      <div
        className="glass-modal-content max-w-lg md:max-w-2xl w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="glass-modal-header">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight">
                Chỉnh Sửa Hồ Sơ Cá Nhân
              </h3>
              <p className="text-[11px] text-slate-500">
                Cập nhật thông tin để tiệm hoa phục vụ bạn chu đáo nhất
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSave} className="flex-1 flex flex-col overflow-hidden">
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
                  <span className="text-[10px] text-slate-400 font-normal ml-auto">(Quà &amp; freeship)</span>
                </label>
                {customer.birthday ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-100/90 border border-slate-200">
                      <div className="flex items-center gap-1 font-mono font-bold text-xs text-slate-800">
                        <Lock className="w-3.5 h-3.5 text-amber-600" />
                        <span>{customer.birthday.split('-')[2] || '01'}/{customer.birthday.split('-')[1] || '01'}</span>
                      </div>
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
                        Đã khóa ngày/tháng
                      </span>
                      <select
                        value={editBirthday.split('-')[0] || customer.birthday.split('-')[0]}
                        onChange={(e) => {
                          const parts = (editBirthday || customer.birthday || '2000-01-01').split('-');
                          const newDate = `${e.target.value}-${parts[1] || '01'}-${parts[2] || '01'}`;
                          setEditBirthday(newDate);
                        }}
                        className="ml-auto text-xs font-bold py-1 px-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 cursor-pointer"
                        title="Bạn có thể sửa lại năm sinh nếu nhập nhầm"
                      >
                        {Array.from({ length: 70 }, (_, i) => 2026 - 10 - i).map((year) => (
                          <option key={year} value={year}>
                            Năm {year}
                          </option>
                        ))}
                      </select>
                    </div>
                    <p className="text-[10px] text-amber-800/90 italic">
                      🔒 Để bảo vệ ưu đãi sinh nhật hàng năm, ngày &amp; tháng sinh được khóa cố định. Để thay đổi, vui lòng liên hệ tiệm.
                    </p>
                  </div>
                ) : (
                  <div>
                    <input
                      type="date"
                      value={editBirthday}
                      onChange={(e) => setEditBirthday(e.target.value)}
                      className="glass-input w-full text-xs py-2 px-3 rounded-xl text-slate-700"
                    />
                    <p className="text-[10px] text-slate-400 mt-1 italic">
                      * Lưu ý: Ngày &amp; tháng sinh sau khi lưu sẽ được khóa cố định để cấp ưu đãi hàng năm.
                    </p>
                  </div>
                )}
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

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Cập nhật tài khoản & bảo mật
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={onOpenChangePass}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-center font-medium transition-colors cursor-pointer"
                >
                  Đổi Mật Khẩu
                </button>
                <button
                  type="button"
                  onClick={onOpenChangePhone}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-center font-medium transition-colors cursor-pointer"
                >
                  Đổi SĐT (OTP)
                </button>
                <button
                  type="button"
                  onClick={onOpenChangeEmail}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-center font-medium transition-colors cursor-pointer"
                >
                  Đổi Gmail (OTP)
                </button>
              </div>
            </div>
          </div>

          <div className="glass-modal-footer">
            <button
              type="button"
              onClick={onClose}
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
  );
};

// 2. Address Book Modal
interface AddressBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedAddresses?: SavedAddress[];
  onSetDefault: (id: string) => void;
  onEditAddress: (addr: SavedAddress) => void;
  onDeleteAddress: (id: string) => void;
  onOpenAddAddress: () => void;
}

export const AddressBookModal: React.FC<AddressBookModalProps> = ({
  isOpen,
  onClose,
  savedAddresses = [],
  onSetDefault,
  onEditAddress,
  onDeleteAddress,
  onOpenAddAddress
}) => {
  if (!isOpen) return null;

  return (
    <div className="glass-overlay z-[120]" onClick={onClose}>
      <div
        className="glass-modal-content max-w-lg md:max-w-2xl w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="glass-modal-header">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <BookmarkCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight">
                Sổ Địa Chỉ Người Nhận ({savedAddresses.length}/3)
              </h3>
              <p className="text-[11px] text-slate-500">
                Chọn nhanh người nhận khi đặt hoa hoặc gửi hoa giấu tên bí mật
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="glass-modal-body space-y-3">
          {savedAddresses.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <MapPin className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs font-semibold">Chưa có mẫu địa chỉ người nhận nào.</p>
              <p className="text-[11px] text-slate-400">
                Lưu sẵn địa chỉ người thân, người yêu, đối tác để 1 chạm là đặt ngay!
              </p>
            </div>
          ) : (
            savedAddresses.map((addr) => (
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
                          onClick={() => onSetDefault(addr.id)}
                          className="text-[10px] font-bold text-slate-500 hover:text-emerald-700 hover:bg-emerald-100 px-2 py-0.5 rounded-full border border-slate-200 hover:border-emerald-300 transition-colors cursor-pointer flex items-center gap-1"
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

                  <div className="flex items-center gap-1 shrink-0 pt-0.5">
                    <button
                      onClick={() => onEditAddress(addr)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                      title="Sửa địa chỉ này"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteAddress(addr.id)}
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

        <div className="glass-modal-footer justify-between">
          <span className="text-[11px] text-slate-500">Tối đa được lưu 3 địa chỉ</span>
          <button
            type="button"
            onClick={onOpenAddAddress}
            disabled={savedAddresses.length >= 3}
            className={`py-2 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              savedAddresses.length >= 3
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
  );
};

// 3. Add / Edit Address Sub-modal
interface AddEditAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  addrName: string;
  setAddrName: (v: string) => void;
  addrRecipientName: string;
  setAddrRecipientName: (v: string) => void;
  addrRecipientPhone: string;
  setAddrRecipientPhone: (v: string) => void;
  addrRecipientAddress: string;
  setAddrRecipientAddress: (v: string) => void;
  addrDistanceKm: number;
  setAddrDistanceKm: (v: number) => void;
  addrIsDefault: boolean;
  setAddrIsDefault: (v: boolean) => void;
  onSave: (e: React.FormEvent) => void;
}

export const AddEditAddressModal: React.FC<AddEditAddressModalProps> = ({
  isOpen,
  onClose,
  isEditing,
  addrName,
  setAddrName,
  addrRecipientName,
  setAddrRecipientName,
  addrRecipientPhone,
  setAddrRecipientPhone,
  addrRecipientAddress,
  setAddrRecipientAddress,
  addrDistanceKm,
  setAddrDistanceKm,
  addrIsDefault,
  setAddrIsDefault,
  onSave
}) => {
  if (!isOpen) return null;

  return (
    <div className="glass-overlay z-[130]" onClick={onClose}>
      <div
        className="glass-modal-content max-w-md w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="glass-modal-header">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <BookmarkCheck className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900">
              {isEditing ? 'Chỉnh Sửa Mẫu Người Nhận' : 'Thêm Mẫu Người Nhận Mới'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSave} className="flex-1 flex flex-col overflow-hidden">
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

          <div className="glass-modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 text-xs text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn-primary py-2 px-4 text-xs font-bold rounded-xl shadow-sm cursor-pointer"
            >
              {isEditing ? 'Lưu Cập Nhật' : 'Lưu Vào Sổ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 4. Customer OTP Modal
interface CustomerOtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  otpInput: string;
  setOtpInput: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const CustomerOtpModal: React.FC<CustomerOtpModalProps> = ({
  isOpen,
  onClose,
  otpInput,
  setOtpInput,
  onSubmit
}) => {
  if (!isOpen) return null;

  return (
    <div className="glass-overlay z-[140]" onClick={onClose}>
      <div className="glass-modal-content max-w-sm w-full relative" onClick={(e) => e.stopPropagation()}>
        <div className="glass-modal-header">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="font-bold text-sm text-slate-900">Xác Thực Hội Viên</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="glass-modal-body text-center space-y-3">
          <p className="text-xs text-slate-500">
            Nhập mã OTP 6 số đã được gửi qua thông báo (mã mẫu:{' '}
            <span className="font-mono font-bold text-emerald-700">190903</span>)
          </p>

          <form onSubmit={onSubmit} className="space-y-3">
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
                onClick={onClose}
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
  );
};

// 5. Change Password Modal
interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  oldPass: string;
  setOldPass: (v: string) => void;
  newPass: string;
  setNewPass: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  oldPass,
  setOldPass,
  newPass,
  setNewPass,
  onSubmit
}) => {
  if (!isOpen) return null;

  return (
    <div className="glass-overlay z-[140]" onClick={onClose}>
      <div className="glass-modal-content max-w-sm w-full relative" onClick={(e) => e.stopPropagation()}>
        <div className="glass-modal-header">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-purple-600" />
            <h3 className="font-bold text-sm text-slate-900">Đổi Mật Khẩu</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="glass-modal-body">
          <form onSubmit={onSubmit} className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">
                Mật khẩu hiện tại
              </label>
              <input
                type="password"
                required
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                className="glass-input w-full text-xs py-2 px-3 rounded-xl"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">
                Mật khẩu mới (Tối thiểu 6 ký tự)
              </label>
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
                onClick={onClose}
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
  );
};

// 6. Change Identity (Phone / Email) 2-Step Verification Modal
interface ChangeIdentityModalProps {
  isOpen: 'phone' | 'email' | null;
  onClose: () => void;
  currentValue?: string;
  onRequestStep1Otp: () => boolean;
  onVerifyStep1Otp: (otp: string) => boolean;
  onRequestStep2Otp: (type: 'phone' | 'email', val: string) => { success: boolean; message: string };
  onConfirmStep2: (type: 'phone' | 'email', val: string, otp: string) => boolean;
}

export const ChangeIdentityModal: React.FC<ChangeIdentityModalProps> = ({
  isOpen,
  onClose,
  currentValue,
  onRequestStep1Otp,
  onVerifyStep1Otp,
  onRequestStep2Otp,
  onConfirmStep2
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<1 | 2>(1);

  // Step 1: Verify current owner
  const [step1Otp, setStep1Otp] = useState('');
  const [step1OtpSent, setStep1OtpSent] = useState(false);
  const [step1Cooldown, setStep1Cooldown] = useState(0);

  // Step 2: Verify & bind new identifier
  const [newValue, setNewValue] = useState('');
  const [step2Otp, setStep2Otp] = useState('');
  const [step2OtpSent, setStep2OtpSent] = useState(false);
  const [step2Cooldown, setStep2Cooldown] = useState(0);

  useEffect(() => {
    if (step1Cooldown <= 0) return;
    const t = setInterval(() => setStep1Cooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [step1Cooldown]);

  useEffect(() => {
    if (step2Cooldown <= 0) return;
    const t = setInterval(() => setStep2Cooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [step2Cooldown]);

  const maskIdentifier = (val?: string) => {
    if (!val) return '***';
    if (val.includes('@')) {
      const [name, domain] = val.split('@');
      return `${name.slice(0, 2)}***@${domain}`;
    }
    if (val.length >= 7) {
      return `${val.slice(0, 3)}****${val.slice(-3)}`;
    }
    return val;
  };

  const handleSendStep1 = () => {
    const ok = onRequestStep1Otp();
    if (ok) {
      setStep1OtpSent(true);
      setStep1Cooldown(60);
    }
  };

  const handleVerifyStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!step1Otp.trim()) return;
    const ok = onVerifyStep1Otp(step1Otp.trim());
    if (ok) {
      setStep(2);
    }
  };

  const handleSendStep2 = () => {
    if (!newValue.trim()) return;
    const res = onRequestStep2Otp(isOpen, newValue.trim());
    if (res.success) {
      setStep2OtpSent(true);
      setStep2Cooldown(60);
    }
  };

  const handleConfirmStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newValue.trim() || !step2Otp.trim()) return;
    const ok = onConfirmStep2(isOpen, newValue.trim(), step2Otp.trim());
    if (ok) {
      onClose();
    }
  };

  return (
    <div className="glass-overlay z-[140]" onClick={onClose}>
      <div className="glass-modal-content max-w-sm w-full relative" onClick={(e) => e.stopPropagation()}>
        <div className="glass-modal-header">
          <div className="flex items-center gap-2">
            {isOpen === 'phone' ? (
              <Phone className="w-4 h-4 text-emerald-600" />
            ) : (
              <Mail className="w-4 h-4 text-emerald-600" />
            )}
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                {isOpen === 'phone' ? 'Đổi Số Điện Thoại' : 'Đổi Gmail Hội Viên'}
              </h3>
              <p className="text-[10px] text-emerald-700 font-medium">
                Xác thực an ninh 2 bước (Bước {step}/2)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="glass-modal-body space-y-3">
          {step === 1 ? (
            /* BƯỚC 1: XÁC THỰC CHỦ SỞ HỮU HIỆN TẠI */
            <form onSubmit={handleVerifyStep1} className="space-y-3">
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/70 text-xs text-amber-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>Bước 1: Xác thực chủ sở hữu</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Để đảm bảo an toàn, hệ thống cần gửi mã OTP về thông tin hiện tại ({maskIdentifier(currentValue)}) trước khi thay đổi.
                </p>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Mã xác thực gửi tới: <span className="font-bold text-slate-900">{maskIdentifier(currentValue)}</span>
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSendStep1}
                    disabled={step1Cooldown > 0}
                    className={`py-2 px-3 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                      step1Cooldown > 0
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                    }`}
                  >
                    {step1Cooldown > 0 ? `Gửi lại sau (${step1Cooldown}s)` : step1OtpSent ? 'Gửi lại OTP' : 'Gửi mã OTP'}
                  </button>
                </div>
              </div>

              {step1OtpSent && (
                <div className="animate-in fade-in space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700 block">
                    Nhập 6 số OTP (Mã mẫu: 190903)
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="VD: 190903"
                    value={step1Otp}
                    onChange={(e) => setStep1Otp(e.target.value)}
                    className="glass-input w-full text-center text-sm font-mono tracking-widest py-2 rounded-xl"
                  />
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2 text-xs text-slate-600 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={!step1OtpSent || !step1Otp.trim()}
                  className={`btn-primary flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer ${
                    !step1OtpSent || !step1Otp.trim() ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <span>Tiếp Tục Bước 2</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          ) : (
            /* BƯỚC 2: KÍCH HOẠT THÔNG TIN MỚI */
            <form onSubmit={handleConfirmStep2} className="space-y-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Bước 2: Kích hoạt {isOpen === 'phone' ? 'Số điện thoại' : 'Gmail'} mới</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Mỗi tài khoản chỉ duy trì duy nhất 1 Số điện thoại và 1 Gmail. Vui lòng nhập thông tin mới và xác thực mã kích hoạt.
                </p>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  {isOpen === 'phone' ? 'Số điện thoại mới' : 'Địa chỉ Gmail mới'}
                </label>
                <div className="flex gap-2">
                  <input
                    type={isOpen === 'phone' ? 'tel' : 'email'}
                    required
                    placeholder={isOpen === 'phone' ? 'VD: 0987654321' : 'VD: hotro@gmail.com'}
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="glass-input flex-1 text-xs py-2 px-3 rounded-xl font-medium"
                  />
                  <button
                    type="button"
                    onClick={handleSendStep2}
                    disabled={!newValue.trim() || step2Cooldown > 0}
                    className={`py-2 px-3 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                      !newValue.trim() || step2Cooldown > 0
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                    }`}
                  >
                    {step2Cooldown > 0 ? `Chờ (${step2Cooldown}s)` : 'Gửi mã'}
                  </button>
                </div>
              </div>

              {step2OtpSent && (
                <div className="animate-in fade-in space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700 block">
                    Nhập 6 số OTP kích hoạt gửi tới {newValue}
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="VD: 190903"
                    value={step2Otp}
                    onChange={(e) => setStep2Otp(e.target.value)}
                    className="glass-input w-full text-center text-sm font-mono tracking-widest py-2 rounded-xl"
                  />
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-2 px-3 text-xs text-slate-600 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  disabled={!step2OtpSent || !step2Otp.trim()}
                  className={`btn-primary flex-1 py-2 text-xs font-bold rounded-xl cursor-pointer ${
                    !step2OtpSent || !step2Otp.trim() ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Hoàn Tất Cập Nhật
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// 7. Right to Erasure & Data Portability (Nghị định 13/2023/NĐ-CP) Modal
interface AccountErasureModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerAccountCode?: string;
  customerTargetInfo: string;
  onRequestOtp: () => string;
  onConfirmErasure: (otp: string) => boolean;
}

export const AccountErasureModal: React.FC<AccountErasureModalProps> = ({
  isOpen,
  onClose,
  customerAccountCode,
  customerTargetInfo,
  onRequestOtp,
  onConfirmErasure
}) => {
  if (!isOpen) return null;

  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [hasAgreedTerms, setHasAgreedTerms] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const handleSendOtp = () => {
    const generated = onRequestOtp();
    if (generated) {
      setIsOtpSent(true);
      setCooldown(60);
    }
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim() || !hasAgreedTerms) return;
    const ok = onConfirmErasure(otp.trim());
    if (ok) {
      onClose();
    }
  };

  return (
    <div className="glass-overlay z-[140]" onClick={onClose}>
      <div className="glass-modal-content max-w-md w-full relative" onClick={(e) => e.stopPropagation()}>
        <div className="glass-modal-header bg-rose-50/80 border-b border-rose-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-rose-100 text-rose-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Xóa / Ẩn Danh Hóa Dữ Liệu Cá Nhân
              </h3>
              <p className="text-[10px] text-rose-700 font-medium">
                Tuân thủ Nghị định 13/2023/NĐ-CP về Bảo vệ Dữ liệu Cá nhân
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="glass-modal-body space-y-3.5">
          <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 space-y-2">
            <p className="font-bold flex items-center gap-1.5 text-amber-900">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Quyền Rút Lại Sự Đồng Ý &amp; Xóa Dữ Liệu:</span>
            </p>
            <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-700 leading-relaxed">
              <li>Toàn bộ <strong>Họ tên, SĐT, Email</strong> sẽ được ẩn danh hóa vĩnh viễn trên hệ thống.</li>
              <li>Toàn bộ <strong>Điểm tích lũy</strong> và <strong>Voucher đặc quyền</strong> sẽ bị hủy bỏ ngay lập tức.</li>
              <li>Lịch sử đơn hàng sẽ được lưu trữ dưới mã ẩn danh phục vụ nghĩa vụ lưu trữ chứng từ kế toán theo luật Thuế Việt Nam.</li>
            </ul>
          </div>

          <form onSubmit={handleConfirm} className="space-y-3">
            <label className="flex items-start gap-2 text-xs text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hasAgreedTerms}
                onChange={(e) => setHasAgreedTerms(e.target.checked)}
                className="mt-0.5 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
              />
              <span className="text-[11px] leading-relaxed">
                Tôi xác nhận yêu cầu xóa/ẩn danh hóa tài khoản <strong>{customerAccountCode}</strong> và đồng ý từ bỏ toàn bộ quyền lợi hội viên liên quan.
              </span>
            </label>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Xác thực chính chủ ({customerTargetInfo}):
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={!hasAgreedTerms || cooldown > 0}
                  className={`py-2 px-3 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                    !hasAgreedTerms || cooldown > 0
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
                  }`}
                >
                  {cooldown > 0 ? `Gửi lại sau (${cooldown}s)` : isOtpSent ? 'Gửi lại OTP' : 'Gửi mã OTP xác nhận'}
                </button>
              </div>
            </div>

            {isOtpSent && (
              <div className="animate-in fade-in space-y-1">
                <label className="text-[11px] font-semibold text-slate-700 block">
                  Nhập 6 số OTP (Mã mẫu: 190903)
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="VD: 190903"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="glass-input w-full text-center text-sm font-mono tracking-widest py-2 rounded-xl"
                />
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 text-xs text-slate-600 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50"
              >
                Giữ Lại Tài Khoản
              </button>
              <button
                type="submit"
                disabled={!hasAgreedTerms || !isOtpSent || !otp.trim()}
                className={`py-2 px-3 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-sm flex-1 cursor-pointer transition-all ${
                  !hasAgreedTerms || !isOtpSent || !otp.trim() ? 'opacity-40 cursor-not-allowed' : ''
                }`}
              >
                Xác Nhận Xóa Vĩnh Viễn
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
