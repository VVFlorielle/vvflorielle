import React, { useState, useRef, useEffect } from 'react';
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
  ExternalLink,
  ShieldAlert,
  AlertTriangle,
  History,
  Timer,
  Download,
  Laptop,
  Smartphone
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { ShopSettings } from '../../../types';
import { VIETNAMESE_BANKS } from '../../../data/mockData';
import { compressImage } from '../../../utils/imageCompressor';
import { useBodyScrollLock } from '../../../utils/scrollLock';

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
  const {
    requestBankChangeOtp,
    verifyBankChangeAndSave,
    securityAuditLogs,
    isSecurityUnlocked,
    unlockSecurityWithPin,
    lockSecurity
  } = useStore();

  const [securityPinInput, setSecurityPinInput] = useState('');
  const [showPinInput, setShowPinInput] = useState(false);

  const handleUnlockSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    const success = unlockSecurityWithPin(securityPinInput);
    if (success) {
      setSecurityPinInput('');
    }
  };

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

  // 2FA Bank Protection State (PIN + OTP Gmail)
  const [isBank2FaModalOpen, setIsBank2FaModalOpen] = useState(false);
  const [bankPinInput, setBankPinInput] = useState('');
  const [bankOtpInput, setBankOtpInput] = useState('');
  const [bankOtpCooldown, setBankOtpCooldown] = useState(0);

  useBodyScrollLock(isBank2FaModalOpen);

  useEffect(() => {
    if (bankOtpCooldown <= 0) return;
    const timer = setInterval(() => {
      setBankOtpCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [bankOtpCooldown]);

  // Audit Trail Filter & Export (Remediation)
  const [auditSeverityFilter, setAuditSeverityFilter] = useState<'ALL' | 'CRITICAL' | 'WARNING' | 'INFO'>('ALL');
  const [auditSearch, setAuditSearch] = useState('');

  const filteredAuditLogs = securityAuditLogs.filter((log) => {
    const matchSeverity = auditSeverityFilter === 'ALL' || log.severity === auditSeverityFilter;
    const matchSearch =
      !auditSearch.trim() ||
      log.actor.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.eventType.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.description.toLowerCase().includes(auditSearch.toLowerCase());
    return matchSeverity && matchSearch;
  });

  const handleExportAuditLogsCsv = () => {
    if (filteredAuditLogs.length === 0) return;
    const headers = ['Mã Bản Ghi', 'Thời Gian', 'Mức Độ', 'Loại Sự Kiện', 'Tác Nhân', 'Nội Dung Chi Tiết'];
    const rows = filteredAuditLogs.map((log) => [
      `"${log.id}"`,
      `"${log.timestamp}"`,
      `"${log.severity}"`,
      `"${log.eventType}"`,
      `"${log.actor}"`,
      `"${log.description.replace(/"/g, '""')}"`
    ].join(','));

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Nhat_Ky_An_Ninh_VVFlorielle_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Đã xuất file nhật ký an ninh CSV thành công!', 'success');
  };

  const handleRevokeTrustedDevices = () => {
    localStorage.removeItem('vvf_trusted_device');
    showToast('Đã thu hồi mọi thiết bị tin cậy! Mọi phiên đăng nhập sau sẽ bắt buộc xác thực OTP 2FA.', 'success');
  };

  const handleBankSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = VIETNAMESE_BANKS.find((b) => b.id === e.target.value);
    if (selected) {
      setBankId(selected.id);
      setBankName(selected.shortName);
    }
  };

  const handleQrFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showToast('Ảnh không được vượt quá 10MB!', 'error');
        return;
      }
      try {
        const compressed = await compressImage(file, {
          maxWidth: 1000,
          maxHeight: 1000,
          quality: 0.85,
          maxSizeBytes: 150 * 1024
        });
        setBankQrImageUrl(compressed);
        setUseAutoVietQr(false);
        showToast('Đã tải và tối ưu ảnh mã QR thành công!', 'success');
      } catch {
        const reader = new FileReader();
        reader.onload = (evt) => {
          const result = evt.target?.result as string;
          setBankQrImageUrl(result);
          setUseAutoVietQr(false);
          showToast('Đã tải ảnh mã QR lên thành công!', 'success');
        };
        reader.readAsDataURL(file);
      }
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
    // Open 2FA Verification Modal for Level 2 Protection!
    setIsBank2FaModalOpen(true);
  };

  const handleRequestBankOtp = () => {
    if (bankOtpCooldown > 0) return;
    const success = requestBankChangeOtp();
    if (success) {
      setBankOtpCooldown(60);
    }
  };

  const handleConfirmBank2FaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankPinInput.trim()) {
      showToast('Vui lòng nhập mã PIN bảo mật quản trị!', 'error');
      return;
    }
    if (!bankOtpInput.trim()) {
      showToast('Vui lòng nhập mã OTP 6 số xác thực!', 'error');
      return;
    }
    const newConfig: Partial<ShopSettings> = {
      bankId,
      bankName,
      bankAccount: bankAccount.trim(),
      bankHolder: bankHolder.trim().toUpperCase(),
      bankQrImageUrl: bankQrImageUrl.trim(),
      useAutoVietQr
    };
    const success = verifyBankChangeAndSave(bankPinInput.trim(), bankOtpInput.trim(), newConfig);
    if (success) {
      setIsBank2FaModalOpen(false);
      setBankPinInput('');
      setBankOtpInput('');
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
        <div className="w-10 sm:w-28 shrink-0">
          <button
            type="button"
            onClick={onBackToDashboard}
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 font-bold transition-colors cursor-pointer"
          >
            &larr; Tổng quan
          </button>
        </div>
        <div className="text-center mx-auto px-2">
          <small className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-800">
            Hệ Thống &amp; An Toàn
          </small>
          <h2 className="font-extrabold text-sm sm:text-lg text-slate-900 tracking-tight">
            {title}
          </h2>
        </div>
        <div className="w-auto sm:w-28 shrink-0 flex items-center justify-end">
          {isSecurityUnlocked && (
            <button
              type="button"
              onClick={lockSecurity}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
              title="Khóa lại khu vực an ninh ngay lập tức"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Khóa Lại</span>
            </button>
          )}
        </div>
      </div>

      {/* SECURITY GATE LOCK SCREEN WHEN NOT UNLOCKED */}
      {!isSecurityUnlocked ? (
        <div className="glass-panel p-6 sm:p-10 rounded-[32px] border-2 border-emerald-500/50 shadow-xl max-w-md mx-auto text-center space-y-5 animate-in zoom-in-95 duration-200 my-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <span className="inline-block text-[10px] font-black uppercase tracking-wider text-emerald-900 bg-emerald-100 border border-emerald-300 px-3 py-0.5 rounded-full">
              Khu Vực An Ninh Cấp 2
            </span>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              Xác Thực Mã Bảo Mật Cấp 2
            </h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              Vui lòng nhập Mã Bảo Mật Cấp 2 để mở khóa quyền cấu hình Mật khẩu, Tài khoản ngân hàng VietQR &amp; Gmail OTP.
            </p>
          </div>

          <form onSubmit={handleUnlockSecurity} className="space-y-4">
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPinInput ? 'text' : 'password'}
                value={securityPinInput}
                onChange={(e) => setSecurityPinInput(e.target.value)}
                placeholder="Nhập mã cấp 2 (Mặc định: 1909203)"
                className="w-full pl-10 pr-12 py-2.5 rounded-xl bg-white border border-slate-300 text-center font-mono font-bold tracking-widest text-slate-900 text-sm focus:border-emerald-500 focus:outline-none shadow-xs"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPinInput(!showPinInput)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
              >
                {showPinInput ? 'Ẩn' : 'Hiện'}
              </button>
            </div>

            {/* Quick Numpad for Touch & Mobile */}
            <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto pt-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setSecurityPinInput((prev) => prev + n.toString())}
                  className="py-2.5 rounded-xl bg-slate-100 hover:bg-emerald-50 active:bg-emerald-100 font-bold text-sm text-slate-800 border border-slate-200/80 transition-colors shadow-2xs cursor-pointer"
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setSecurityPinInput('')}
                className="py-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-rose-600 font-bold text-xs border border-slate-200/80 cursor-pointer"
              >
                Xóa
              </button>
              <button
                type="button"
                onClick={() => setSecurityPinInput((prev) => prev + '0')}
                className="py-2.5 rounded-xl bg-slate-100 hover:bg-emerald-50 font-bold text-sm text-slate-800 border border-slate-200/80 cursor-pointer"
              >
                0
              </button>
              <button
                type="button"
                onClick={() => setSecurityPinInput((prev) => prev.slice(0, -1))}
                className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-xs text-slate-700 border border-slate-200/80 cursor-pointer"
              >
                ←
              </button>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={onBackToDashboard}
                className="w-1/2 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Quay Lại
              </button>
              <button
                type="submit"
                className="w-1/2 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-md transition-all cursor-pointer"
              >
                Mở Khóa
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>

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
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-[11px] text-rose-700 font-medium flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
            <span>Khu vực tử huyệt dòng tiền: Mọi thay đổi STK thụ hưởng bắt buộc xác thực cấp 2 (Mã PIN + OTP qua Gmail).</span>
          </p>
          <button
            type="submit"
            className="btn-primary text-xs py-2.5 px-6 rounded-xl cursor-pointer flex items-center justify-center gap-2 shadow-md hover:shadow-lg font-bold shrink-0 bg-emerald-700 hover:bg-emerald-800"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Xác Thực Cấp 2 &amp; Lưu STK VietQR</span>
          </button>
        </div>
      </form>

      {/* 2FA MODAL XÁC THỰC THAY ĐỔI TÀI KHOẢN NGÂN HÀNG VIETQR */}
      {isBank2FaModalOpen && (
        <div
          className="fixed inset-0 z-[100050] flex items-center justify-center p-3 sm:p-5 bg-slate-900/25 backdrop-blur-sm select-none animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsBank2FaModalOpen(false);
          }}
        >
          <div
            className="relative bg-white rounded-[32px] max-w-md w-full p-5 sm:p-6 shadow-2xl border border-emerald-100 space-y-4 max-h-[92dvh] sm:max-h-[88vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsBank2FaModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Đóng"
            >
              ✕
            </button>

            <div className="text-center space-y-1.5 pb-2 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
                Bảo Mật Cấp 2 - Xác Thực Thay Đổi STK
              </h3>
              <p className="text-xs text-slate-500">
                Xác minh bảo mật nghiêm ngặt trước khi cập nhật số tài khoản nhận tiền
              </p>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-amber-700" />
                <span>Bảo Vệ Tử Huyệt Dòng Tiền V&amp;V Florielle</span>
              </p>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Để bảo vệ an toàn tuyệt đối cho số tài khoản thụ hưởng nhận cọc của tiệm, thao tác này bắt buộc xác thực qua <strong>Mã PIN Quản Trị</strong> và <strong>Mã OTP gửi về Gmail an ninh</strong> (traivuho@gmail.com).
              </p>
            </div>

            <form onSubmit={handleConfirmBank2FaSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  1. Mã PIN Quản Trị (6 số) *
                </label>
                <input
                  type="password"
                  required
                  maxLength={8}
                  placeholder="••••••"
                  value={bankPinInput}
                  onChange={(e) => setBankPinInput(e.target.value)}
                  className="glass-input w-full text-center font-mono tracking-widest text-sm py-2.5 rounded-xl"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">
                    2. Mã Xác Thực OTP 2FA (6 số) *
                  </label>
                  <button
                    type="button"
                    onClick={handleRequestBankOtp}
                    disabled={bankOtpCooldown > 0}
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-lg transition-all ${
                      bankOtpCooldown > 0
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 cursor-pointer'
                    }`}
                  >
                    {bankOtpCooldown > 0 ? `Gửi lại sau (${bankOtpCooldown}s)` : 'Gửi mã OTP qua Gmail'}
                  </button>
                </div>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="••••••"
                  value={bankOtpInput}
                  onChange={(e) => setBankOtpInput(e.target.value)}
                  className="glass-input w-full text-center font-mono tracking-widest text-sm py-2.5 rounded-xl"
                />
                <span className="text-[10px] text-slate-500 block mt-1">
                  Mã OTP có hiệu lực trong 5 phút. Vui lòng kiểm tra hộp thư đến của traivuho@gmail.com.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsBank2FaModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="btn-primary py-2 px-5 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Xác Nhận &amp; Cập Nhật STK</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

      {/* CARD 5: NHẬT KÝ AN NINH & KIỂM TOÁN HỆ THỐNG (SECURITY AUDIT TRAIL) */}
      <div className="glass-panel p-5 sm:p-6 space-y-4 rounded-[28px] border border-slate-200">
        <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-700" />
              <span>Nhật Ký An Ninh &amp; Kiểm Toán Hệ Thống (Security Audit Trail)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Ghi nhận tự động mọi biến động bảo mật, đăng nhập và thay đổi cấu hình trọng yếu
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleExportAuditLogsCsv}
              disabled={filteredAuditLogs.length === 0}
              className={`btn-secondary py-1.5 px-3 text-xs rounded-xl flex items-center gap-1.5 cursor-pointer text-emerald-800 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors shadow-2xs ${
                filteredAuditLogs.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title="Xuất file nhật ký an ninh ra CSV"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-bold">Xuất CSV ({filteredAuditLogs.length})</span>
            </button>

            <button
              type="button"
              onClick={handleRevokeTrustedDevices}
              className="btn-secondary py-1.5 px-3 text-xs rounded-xl flex items-center gap-1.5 cursor-pointer text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors shadow-2xs font-bold"
              title="Xóa bộ nhớ thiết bị tin cậy trên trình duyệt, buộc xác thực OTP 2FA cho phiên tiếp theo"
            >
              <Laptop className="w-3.5 h-3.5 text-rose-600" />
              <span>Thu Hồi Thiết Bị 2FA</span>
            </button>
          </div>
        </div>

        {/* Severity Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            {(['ALL', 'CRITICAL', 'WARNING', 'INFO'] as const).map((sev) => (
              <button
                key={sev}
                type="button"
                onClick={() => setAuditSeverityFilter(sev)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer text-[11px] ${
                  auditSeverityFilter === sev
                    ? sev === 'CRITICAL'
                      ? 'bg-rose-600 text-white shadow-2xs'
                      : sev === 'WARNING'
                      ? 'bg-amber-600 text-white shadow-2xs'
                      : sev === 'INFO'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-purple-700 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sev === 'ALL' && `Tất cả (${securityAuditLogs.length})`}
                {sev === 'CRITICAL' && '🔴 Báo động (CRITICAL)'}
                {sev === 'WARNING' && '🟡 Cảnh báo (WARNING)'}
                {sev === 'INFO' && '🟢 Thông tin (INFO)'}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Tìm theo tác nhân, sự kiện..."
              value={auditSearch}
              onChange={(e) => setAuditSearch(e.target.value)}
              className="glass-input w-full text-xs py-1.5 px-3 rounded-xl"
            />
          </div>
        </div>

        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {filteredAuditLogs.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400">
              Không tìm thấy bản ghi an ninh nào phù hợp với bộ lọc.
            </div>
          ) : (
            filteredAuditLogs.map((log) => {
              const badgeColor =
                log.severity === 'CRITICAL'
                  ? 'bg-rose-100 text-rose-800 border-rose-200'
                  : log.severity === 'WARNING'
                  ? 'bg-amber-100 text-amber-800 border-amber-200'
                  : 'bg-emerald-100 text-emerald-800 border-emerald-200';

              return (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-50/90 border border-slate-200/80 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 hover:bg-slate-100/70 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                        {log.severity}
                      </span>
                      <span className="font-semibold text-slate-800 font-mono text-[11px]">
                        [{log.eventType}]
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        Tác nhân: <strong className="text-slate-700">{log.actor}</strong>
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug">{log.description}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0 whitespace-nowrap self-end sm:self-center">
                    {log.timestamp}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
        </>
      )}
    </div>
  );
};
