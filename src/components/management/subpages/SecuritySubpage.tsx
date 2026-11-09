import React, { useState, useRef } from 'react';
import {
  Lock,
  KeyRound,
  Mail,
  Building2,
  QrCode,
  Upload,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Image as ImageIcon,
  Copy,
  ExternalLink
} from 'lucide-react';
import { ShopSettings } from '../../../types';
import { VIETNAMESE_BANKS } from '../../../data/mockData';

interface SecuritySubpageProps {
  onBackToDashboard: () => void;
  adminEmail: string;
  changeAdminCredentials: (oldPass: string, oldPin?: string, newPass?: string, newPin?: string) => boolean;
  saveGmailConfig: (email: string, appPass: string) => void;
  requestPinResetOtp: (email: string) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  title?: string;
  settings?: ShopSettings;
  updateSettings?: (newSettings: Partial<ShopSettings>) => void;
}

export const SecuritySubpage: React.FC<SecuritySubpageProps> = ({
  onBackToDashboard,
  adminEmail,
  changeAdminCredentials,
  saveGmailConfig,
  requestPinResetOtp,
  showToast,
  title = 'Bảo Mật PIN Cấp 2, Mật Khẩu & Tài Khoản Ngân Hàng',
  settings,
  updateSettings
}) => {
  // Password state
  const [currentPassForPass, setCurrentPassForPass] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');

  // PIN state
  const [currentPassForPin, setCurrentPassForPin] = useState('');
  const [currentPinForPin, setCurrentPinForPin] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');

  // Gmail config state
  const [editAdminEmail, setEditAdminEmail] = useState(adminEmail);
  const [editAppPassword, setEditAppPassword] = useState('');

  // Bank & VietQR Protected Configuration state
  const [bankId, setBankId] = useState<string>(settings?.bankId || 'VCB');
  const [bankName, setBankName] = useState<string>(settings?.bankName || 'Vietcombank');
  const [bankAccount, setBankAccount] = useState<string>(settings?.bankAccount || '1029384756');
  const [bankHolder, setBankHolder] = useState<string>(settings?.bankHolder || 'V&V FLORIELLE');
  const [bankQrImageUrl, setBankQrImageUrl] = useState<string>(settings?.bankQrImageUrl || '');
  const [useAutoVietQr, setUseAutoVietQr] = useState<boolean>(
    settings?.useAutoVietQr !== undefined ? settings.useAutoVietQr : true
  );
  const [testAmount, setTestAmount] = useState<number>(340000);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBankSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = VIETNAMESE_BANKS.find((b) => b.id === e.target.value);
    if (selected) {
      setBankId(selected.id);
      setBankName(selected.shortName);
    }
  };

  const handleQrFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Ảnh không được vượt quá 5MB!', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (evt) => {
        const result = evt.target?.result as string;
        setBankQrImageUrl(result);
        setUseAutoVietQr(false);
        showToast('Đã tải ảnh mã QR lên thành công!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBankConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankAccount.trim()) {
      showToast('Vui lòng nhập số tài khoản ngân hàng!', 'error');
      return;
    }
    if (!bankHolder.trim()) {
      showToast('Vui lòng nhập tên chủ tài khoản!', 'error');
      return;
    }
    if (updateSettings) {
      updateSettings({
        bankId,
        bankName,
        bankAccount: bankAccount.trim(),
        bankHolder: bankHolder.trim().toUpperCase(),
        bankQrImageUrl: bankQrImageUrl.trim(),
        useAutoVietQr
      });
      showToast('Đã lưu cấu hình tài khoản ngân hàng & mã VietQR vào phân hệ bảo mật!', 'success');
    }
  };

  const demoMemo = 'VVF 849201 0906721442';
  const autoVietQrPreviewUrl = `https://img.vietqr.io/image/${bankId}-${bankAccount.trim() || '1029384756'}-compact2.png?amount=${testAmount}&addInfo=${encodeURIComponent(
    demoMemo
  )}&accountName=${encodeURIComponent(bankHolder.trim() || 'V&V FLORIELLE')}`;
  const currentQrPreview = !useAutoVietQr && bankQrImageUrl ? bankQrImageUrl : autoVietQrPreviewUrl;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header căn giữa */}
      <div className="relative flex items-center justify-between min-h-[44px] pb-3 border-b border-slate-200/80">
        <div className="w-10 sm:w-28 shrink-0" />
        <div className="text-center mx-auto px-2">
          <small className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-800">
            Hệ Thống &amp; An Toàn
          </small>
          <h2 className="font-extrabold text-sm sm:text-lg text-slate-900 tracking-tight">
            {title}
          </h2>
        </div>
        <div className="w-10 sm:w-28 shrink-0" />
      </div>

      {/* CARD 1: CẤU HÌNH TÀI KHOẢN NGÂN HÀNG & MÃ VIETQR */}
      <form onSubmit={handleSaveBankConfig} className="glass-panel p-5 sm:p-6 space-y-5 rounded-[28px] border-2 border-emerald-400/50 shadow-lg">
        <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Tài Khoản Thụ Hưởng</span>
            </div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-700" />
              <span>Tài Khoản Ngân Hàng &amp; Mã QR Thanh Toán</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Cấu hình thông tin tài khoản thụ hưởng và mã QR chuyển khoản khi khách đặt hoa.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500">Mã ngân hàng:</span>
            <span className="px-2.5 py-1 rounded-xl bg-slate-900 text-white font-mono text-xs font-bold">{bankId}</span>
          </div>
        </div>

        {/* 3 Columns for Bank Credentials */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              Ngân hàng thụ hưởng <span className="text-rose-500">*</span>
            </label>
            <select
              value={bankId}
              onChange={handleBankSelect}
              className="glass-input w-full text-xs py-2 rounded-xl bg-white font-medium cursor-pointer"
            >
              {VIETNAMESE_BANKS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.shortName} ({b.id}) - {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              Số tài khoản ngân hàng <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              placeholder="Ví dụ: 1029384756"
              className="glass-input w-full text-xs py-2 font-mono font-bold rounded-xl text-slate-900 bg-white"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              Tên chủ tài khoản (In hoa không dấu) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={bankHolder}
              onChange={(e) => setBankHolder(e.target.value.toUpperCase())}
              placeholder="Ví dụ: V&V FLORIELLE"
              className="glass-input w-full text-xs py-2 uppercase font-bold rounded-xl text-slate-900 bg-white"
            />
          </div>
        </div>

        {/* QR Mode Selection: Auto VietQR vs Custom Upload */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5 text-emerald-700" />
                <span>Phương Thức Hiển Thị Mã QR Cho Người Mua Quét Cọc</span>
              </span>
              <p className="text-[11px] text-slate-500">
                Lựa chọn cơ chế sinh mã QR khi khách bấm đặt hoa tại giỏ hàng
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setUseAutoVietQr(true)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  useAutoVietQr
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>⚡ Mã VietQR Tự Động (Khuyên dùng)</span>
              </button>
              <button
                type="button"
                onClick={() => setUseAutoVietQr(false)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  !useAutoVietQr
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>🖼️ Ảnh Mã QR Tải Lên</span>
              </button>
            </div>
          </div>

          {/* Mode Details & Upload */}
          {!useAutoVietQr ? (
            <div className="pt-2 border-t border-slate-200/80 space-y-3 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleQrFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Chọn Ảnh Mã QR Từ Máy Tính / Điện Thoại</span>
                </button>
                <div className="text-[11px] text-slate-500 flex-1">
                  Hoặc dán URL ảnh mã QR:
                  <input
                    type="url"
                    value={bankQrImageUrl}
                    onChange={(e) => setBankQrImageUrl(e.target.value)}
                    placeholder="https://example.com/qr-bank.png"
                    className="glass-input w-full text-xs py-1.5 px-3 rounded-xl mt-1 font-mono"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-200/80 text-[11px] text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Cơ chế tự động: Khi khách đặt hàng, hệ thống tự động sinh mã VietQR Napas 247 chính xác tuyệt đối với <strong>đúng STK, đúng số tiền cọc 50%</strong> và <strong>nội dung mã đơn hàng</strong>. Khách quét là chuyển ngay không lo sai sót.
              </span>
            </div>
          )}
        </div>

        {/* Live Preview Box & Simulator */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-5">
          <div className="shrink-0 text-center space-y-2">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
              BẢN XEM TRƯỚC MÃ QR TRÊN WEBSITE
            </span>
            <div className="w-48 h-48 sm:w-52 sm:h-52 bg-slate-50 rounded-2xl border-2 border-dashed border-emerald-400 p-2 flex items-center justify-center relative overflow-hidden">
              {currentQrPreview ? (
                <img
                  src={currentQrPreview}
                  alt="QR Code Preview"
                  className="w-full h-full object-contain rounded-xl"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="text-center p-3 text-slate-400 text-xs">
                  <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                  <span>Chưa có ảnh mã QR</span>
                </div>
              )}
            </div>
            <span className="text-[10px] text-slate-400 block font-mono">
              {useAutoVietQr ? 'VietQR Live API (Napas 247)' : 'Ảnh tĩnh tùy chỉnh'}
            </span>
          </div>

          <div className="flex-1 space-y-3 w-full text-xs">
            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-900">Mô phỏng thông tin hiển thị tại Giỏ hàng:</div>
              <p className="text-[11px] text-slate-500">Khách hàng sẽ nhìn thấy các thông tin sau kèm nút 1 chạm sao chép:</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Ngân hàng:</span>
                <strong className="text-slate-800">{bankName} ({bankId})</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Số tài khoản:</span>
                <strong className="text-slate-800 font-mono">{bankAccount || 'Chưa nhập'}</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Chủ tài khoản:</span>
                <strong className="text-slate-800">{bankHolder || 'Chưa nhập'}</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Cú pháp mẫu:</span>
                <strong className="text-emerald-700 font-mono">{demoMemo}</strong>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] text-slate-500">Thử nghiệm số tiền cọc:</span>
              <input
                type="number"
                step="10000"
                value={testAmount}
                onChange={(e) => setTestAmount(Number(e.target.value) || 0)}
                className="glass-input w-32 text-xs py-1 px-2 font-mono font-bold rounded-lg"
              />
              <span className="text-[11px] font-bold text-emerald-700">₫</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex items-center justify-between">
          <p className="text-[11px] text-rose-700 font-medium">
            ⚠️ Lưu ý: Mọi thay đổi tại đây sẽ cập nhật ngay lập tức đến toàn bộ mã QR thanh toán trên website.
          </p>
          <button
            type="submit"
            className="btn-primary text-xs py-2.5 px-6 rounded-xl cursor-pointer flex items-center gap-2 shadow-md hover:shadow-lg font-bold"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Lưu Cấu Hình Ngân Hàng &amp; QR Bảo Mật</span>
          </button>
        </div>
      </form>

      {/* CARD 2: ĐỔI MẬT KHẨU ĐĂNG NHẬP QUẢN TRỊ */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (newPasswordInput !== confirmPasswordInput) {
            showToast('Mật khẩu xác nhận không khớp!', 'error');
            return;
          }
          const success = changeAdminCredentials(currentPassForPass, undefined, newPasswordInput);
          if (success) {
            setCurrentPassForPass('');
            setNewPasswordInput('');
            setConfirmPasswordInput('');
          }
        }}
        className="glass-panel p-5 sm:p-6 space-y-4 rounded-[28px]"
      >
        <div className="border-b border-slate-200 pb-3">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-purple-700" />
            <span>Đổi Mật Khẩu Đăng Nhập Quản Trị</span>
          </h3>
          <p className="text-xs text-slate-500">Mật khẩu áp dụng cho tài khoản quản trị hiện tại</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">Mật khẩu hiện tại</label>
            <input
              type="password"
              required
              value={currentPassForPass}
              onChange={(e) => setCurrentPassForPass(e.target.value)}
              className="glass-input w-full text-xs py-2 rounded-xl"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">Mật khẩu mới</label>
            <input
              type="password"
              required
              value={newPasswordInput}
              onChange={(e) => setNewPasswordInput(e.target.value)}
              className="glass-input w-full text-xs py-2 rounded-xl"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">Xác nhận mật khẩu mới</label>
            <input
              type="password"
              required
              value={confirmPasswordInput}
              onChange={(e) => setConfirmPasswordInput(e.target.value)}
              className="glass-input w-full text-xs py-2 rounded-xl"
            />
          </div>
        </div>

        <div>
          <button type="submit" className="btn-primary text-xs py-2 px-5 rounded-xl cursor-pointer">
            Cập Nhật Mật Khẩu
          </button>
        </div>
      </form>

      {/* CARD 3: ĐỔI MÃ PIN BẢO MẬT CẤP 2 */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (newPinInput.length !== 8 && newPinInput.length !== 6) {
            showToast('Mã PIN gồm 6 hoặc 8 chữ số!', 'error');
            return;
          }
          if (newPinInput !== confirmPinInput) {
            showToast('Mã PIN xác nhận không khớp!', 'error');
            return;
          }
          const success = changeAdminCredentials(currentPassForPin, currentPinForPin, undefined, newPinInput);
          if (success) {
            setCurrentPassForPin('');
            setCurrentPinForPin('');
            setNewPinInput('');
            setConfirmPinInput('');
          }
        }}
        className="glass-panel p-5 sm:p-6 space-y-4 rounded-[28px]"
      >
        <div className="border-b border-slate-200 pb-3">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-purple-700" />
            <span>Đổi Mã PIN Bảo Mật Cấp 2</span>
          </h3>
          <p className="text-xs text-slate-500">Mã PIN 6 hoặc 8 số bảo mật cấp 2 dùng chung cho hệ thống</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">Mật khẩu quản trị</label>
            <input
              type="password"
              required
              value={currentPassForPin}
              onChange={(e) => setCurrentPassForPin(e.target.value)}
              className="glass-input w-full text-xs py-2 rounded-xl"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">Mã PIN hiện tại</label>
            <input
              type="password"
              required
              value={currentPinForPin}
              onChange={(e) => setCurrentPinForPin(e.target.value)}
              className="glass-input w-full text-xs py-2 font-mono rounded-xl"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">Mã PIN mới</label>
            <input
              type="password"
              required
              value={newPinInput}
              onChange={(e) => setNewPinInput(e.target.value)}
              className="glass-input w-full text-xs py-2 font-mono rounded-xl"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">Xác nhận PIN mới</label>
            <input
              type="password"
              required
              value={confirmPinInput}
              onChange={(e) => setConfirmPinInput(e.target.value)}
              className="glass-input w-full text-xs py-2 font-mono rounded-xl"
            />
          </div>
        </div>

        <div>
          <button type="submit" className="btn-primary text-xs py-2 px-5 rounded-xl cursor-pointer">
            Cập Nhật Mã PIN
          </button>
        </div>
      </form>

      {/* CARD 4: CẤU HÌNH GMAIL APP PASSWORD GỬI OTP */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          saveGmailConfig(editAdminEmail.trim(), editAppPassword.trim());
        }}
        className="glass-panel p-5 sm:p-6 space-y-4 rounded-[28px]"
      >
        <div className="border-b border-slate-200 pb-3">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Mail className="w-4 h-4 text-purple-700" />
            <span>Cấu Hình Gmail App Password Gửi OTP Khôi Phục</span>
          </h3>
          <p className="text-xs text-slate-500">Dùng để gửi mã OTP khi quên mật khẩu hoặc quên mã PIN</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">Gmail gửi thư</label>
            <input
              type="email"
              value={editAdminEmail}
              onChange={(e) => setEditAdminEmail(e.target.value)}
              className="glass-input w-full text-xs py-2 rounded-xl"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">Mật khẩu ứng dụng (16 ký tự)</label>
            <input
              type="password"
              value={editAppPassword}
              onChange={(e) => setEditAppPassword(e.target.value)}
              className="glass-input w-full text-xs py-2 font-mono rounded-xl"
              placeholder="xxxx xxxx xxxx xxxx"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button type="submit" className="btn-primary text-xs py-2 px-5 rounded-xl cursor-pointer">
            Lưu Cấu Hình Gmail
          </button>
          <button
            type="button"
            onClick={() => {
              requestPinResetOtp(editAdminEmail);
            }}
            className="btn-secondary text-xs py-2 px-4 rounded-xl cursor-pointer"
          >
            Gửi Thử Nghiệm OTP
          </button>
        </div>
      </form>
    </div>
  );
};
