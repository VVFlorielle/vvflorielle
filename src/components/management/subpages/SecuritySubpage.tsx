import React, { useState } from 'react';
import { Lock, KeyRound, Mail, ArrowLeft } from 'lucide-react';

interface SecuritySubpageProps {
  onBackToDashboard: () => void;
  adminEmail: string;
  changeAdminCredentials: (oldPass: string, oldPin?: string, newPass?: string, newPin?: string) => boolean;
  saveGmailConfig: (email: string, appPass: string) => void;
  requestPinResetOtp: (email: string) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  title?: string;
}

export const SecuritySubpage: React.FC<SecuritySubpageProps> = ({
  onBackToDashboard,
  adminEmail,
  changeAdminCredentials,
  saveGmailConfig,
  requestPinResetOtp,
  showToast,
  title = 'Bảo Mật PIN Cấp 2 & Đổi Mật Khẩu Admin'
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

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header and Back Button */}
      <div className="flex items-center gap-3 pb-3 border-b border-slate-200/80">
        <button
          type="button"
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại Tổng Quan</span>
        </button>
        <h2 className="font-bold text-base sm:text-lg text-slate-800">{title}</h2>
      </div>

      {/* Card 1: Change Admin Password */}
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

      {/* Card 2: Change PIN */}
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

      {/* Card 3: Gmail App Password for OTP */}
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
