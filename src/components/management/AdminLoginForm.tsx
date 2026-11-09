import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Lock, ShieldCheck, KeyRound, Mail, ArrowLeft } from 'lucide-react';

export const AdminLoginForm: React.FC = () => {
  const {
    loginAdmin,
    requestPinResetOtp,
    verifyPinResetOtp,
    showToast
  } = useStore();

  const [loginMode, setLoginMode] = useState<'login' | 'forgot'>('login');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginPin, setLoginPin] = useState('');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newOtpPin, setNewOtpPin] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(loginUsername, loginPassword, loginPin);
    if (success) {
      setLoginPassword('');
      setLoginPin('');
    }
  };

  const handleRequestPinRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail.trim()) {
      showToast('Vui lòng nhập địa chỉ Gmail!', 'error');
      return;
    }
    const success = requestPinResetOtp(recoveryEmail.trim());
    if (success) {
      setIsOtpSent(true);
    }
  };

  const handleVerifyOtpAndResetPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim() || newOtpPin.length !== 6) {
      showToast('Mã OTP và PIN mới gồm 6 chữ số!', 'error');
      return;
    }
    const success = verifyPinResetOtp(otpCode.trim(), newOtpPin.trim());
    if (success) {
      setLoginMode('login');
      setIsOtpSent(false);
      setOtpCode('');
      setNewOtpPin('');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto py-12 px-4 select-none">
      <div className="p-6 sm:p-8 space-y-5 rounded-[28px] shadow-xl border border-emerald-100/90 bg-white/95 backdrop-blur-2xl text-center">
        <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-700 mx-auto flex items-center justify-center shadow-md shadow-purple-600/10 border border-purple-200">
          <Lock className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Cổng Quản Trị V&amp;V Florielle</h2>
          <p className="text-xs text-slate-500 mt-1">
            Khu vực bảo mật dành riêng cho Ban Điều Hành &amp; Chủ Tiệm
          </p>
        </div>

        {loginMode === 'login' ? (
          <form onSubmit={handleAdminLoginSubmit} className="space-y-3.5 text-left text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Tài khoản quản trị *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Nhập tên tài khoản quản trị..."
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="glass-input w-full text-xs py-2.5 pl-9 rounded-xl"
                />
                <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Mật khẩu bảo vệ *</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Nhập mật khẩu..."
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="glass-input w-full text-xs py-2.5 pl-9 rounded-xl"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Mã PIN bảo mật 6 số *</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  maxLength={8}
                  placeholder="••••••••"
                  value={loginPin}
                  onChange={(e) => setLoginPin(e.target.value)}
                  className="glass-input w-full text-center text-sm font-mono tracking-widest py-2.5 rounded-xl"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full btn-primary text-xs py-3 bg-purple-700 hover:bg-purple-800 rounded-xl shadow-md shadow-purple-600/20 cursor-pointer"
              >
                Xác Thực &amp; Mở Khóa Quản Trị
              </button>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setLoginMode('forgot')}
                className="text-xs text-purple-700 hover:text-purple-900 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Quên mã PIN? Nhận mã OTP qua Gmail</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 text-left text-xs">
            <button
              type="button"
              onClick={() => setLoginMode('login')}
              className="inline-flex items-center gap-1.5 text-xs text-purple-700 hover:text-purple-900 font-semibold cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại đăng nhập</span>
            </button>

            <div className="bg-sky-50/80 p-3.5 rounded-2xl border border-sky-100 text-sky-900 text-xs space-y-1">
              <strong>Khôi phục mã PIN qua Gmail:</strong>
              <p className="text-[11px] text-slate-600">
                Hệ thống sẽ gửi mã xác thực OTP 6 số đến hòm thư quản trị đã thiết lập.
              </p>
            </div>

            {!isOtpSent ? (
              <form onSubmit={handleRequestPinRecovery} className="space-y-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Gmail quản trị</label>
                  <input
                    type="email"
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    placeholder="traivuho@gmail.com"
                    className="glass-input w-full text-xs py-2.5 rounded-xl"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full btn-primary text-xs py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 cursor-pointer"
                >
                  Gửi Mã OTP Đến Gmail
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtpAndResetPin} className="space-y-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Mã OTP 6 số</label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="••••••"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="glass-input w-full text-center font-mono text-sm py-2 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Mã PIN mới (6 số)</label>
                  <input
                    type="password"
                    maxLength={6}
                    placeholder="••••••"
                    value={newOtpPin}
                    onChange={(e) => setNewOtpPin(e.target.value)}
                    className="glass-input w-full text-center font-mono text-sm py-2 rounded-xl"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full btn-primary text-xs py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 cursor-pointer"
                >
                  Đặt Lại Mã PIN &amp; Đăng Nhập
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
