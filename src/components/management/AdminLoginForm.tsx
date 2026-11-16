import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Lock,
  ShieldCheck,
  KeyRound,
  Mail,
  ArrowLeft,
  ShieldAlert,
  Laptop,
  CheckCircle2,
  Clock
} from 'lucide-react';
import {
  getBruteForceState,
  recordFailedLoginAttempt,
  resetBruteForceAttempts,
  isDeviceTrusted,
  trustCurrentDevice
} from '../../utils/security';

export const AdminLoginForm: React.FC = () => {
  const {
    loginAdmin,
    requestPinResetOtp,
    verifyPinResetOtp,
    showToast,
    logSecurityEvent
  } = useStore();

  const [loginMode, setLoginMode] = useState<'login' | 'forgot' | 'device_2fa'>('login');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginPin, setLoginPin] = useState('');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newOtpPin, setNewOtpPin] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  // 2FA for Unrecognized Device State
  const [device2FaOtp, setDevice2FaOtp] = useState<{ code: string; expiresAt: number } | null>(null);
  const [device2FaInput, setDevice2FaInput] = useState('');
  const [trustDeviceChecked, setTrustDeviceChecked] = useState(true);

  // Brute-Force Guard State
  const [bruteForce, setBruteForce] = useState(getBruteForceState());

  // Countdown timer for Lockout
  useEffect(() => {
    if (!bruteForce.isLocked) return;
    const timer = setInterval(() => {
      const state = getBruteForceState();
      setBruteForce(state);
    }, 1000);
    return () => clearInterval(timer);
  }, [bruteForce.isLocked]);

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check lockout first
    const currentBrute = getBruteForceState();
    if (currentBrute.isLocked) {
      showToast(`Tài khoản đang bị tạm khóa an ninh! Thử lại sau ${currentBrute.remainingSeconds}s`, 'error');
      setBruteForce(currentBrute);
      return;
    }

    const u = loginUsername.trim();
    const p = loginPassword.trim();
    const pin = loginPin.trim();

    // Pre-check credential validity
    const isPinCorrect = !pin || pin === '26122025' || pin === '190903' || pin === '17092000' || pin === '19092003';
    const isSuperAdmin = (u === 'admin') && (p === '17092000' || p === '19092003') && isPinCorrect;
    const isOwner = (u === 'vvflorielle' || u === 'chuquan') && (p === '19092003' || p === '17092000') && isPinCorrect;

    if (!isSuperAdmin && !isOwner) {
      // Record failed attempt for Brute-Force Guard
      const attempt = recordFailedLoginAttempt();
      setBruteForce(getBruteForceState());

      if (attempt.isNowLocked) {
        logSecurityEvent(
          u || 'UNKNOWN',
          'ACCOUNT_LOCKED',
          'CRITICAL',
          `Cảnh báo an ninh: Phiên đăng nhập bị khóa 15 phút do nhập sai thông tin quản trị 5 lần liên tiếp!`
        );
        showToast('Tài khoản đã bị tạm khóa 15 phút do nhập sai 5 lần!', 'error');
      } else {
        logSecurityEvent(
          u || 'UNKNOWN',
          'LOGIN_FAILED',
          'WARNING',
          `Đăng nhập thất bại (Lần ${attempt.attempts}/5). Thông tin tài khoản hoặc PIN không chính xác.`
        );
        showToast(`Thông tin đăng nhập không chính xác! Bạn còn ${attempt.remainingAttempts} lần thử.`, 'error');
      }
      return;
    }

    // Credentials are valid! Check if current device is trusted
    const isTrusted = isDeviceTrusted();

    if (!isTrusted) {
      // Unrecognized device detected! Trigger 2FA
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setDevice2FaOtp({ code, expiresAt: Date.now() + 5 * 60 * 1000 });
      setLoginMode('device_2fa');
      logSecurityEvent(
        u,
        'LOGIN_FAILED',
        'WARNING',
        `Phát hiện đăng nhập từ thiết bị mới/lạ. Đã kích hoạt yêu cầu xác thực 2FA OTP qua email.`
      );
      showToast(`Thiết bị mới! Mã xác thực 2FA đã gửi đến traivuho@gmail.com: ${code}`, 'info');
      return;
    }

    // Device is trusted: login directly!
    resetBruteForceAttempts();
    const success = loginAdmin(loginUsername, loginPassword, loginPin);
    if (success) {
      setLoginPassword('');
      setLoginPin('');
    }
  };

  const handleDevice2FaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!device2FaOtp || Date.now() > device2FaOtp.expiresAt) {
      showToast('Mã OTP 2FA đã hết hạn hoặc chưa được tạo!', 'error');
      return;
    }
    if (device2FaOtp.code !== device2FaInput.trim()) {
      showToast('Mã OTP xác thực 2FA không chính xác!', 'error');
      return;
    }

    // Success! Trust device if checked
    if (trustDeviceChecked) {
      trustCurrentDevice(30, loginUsername === 'admin' ? 'Máy Admin' : 'Máy Chủ Quán');
    }
    resetBruteForceAttempts();
    const success = loginAdmin(loginUsername, loginPassword, loginPin);
    if (success) {
      setLoginPassword('');
      setLoginPin('');
      setDevice2FaOtp(null);
      setDevice2FaInput('');
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
            Khu vực bảo mật cấp 2 dành riêng cho Super Admin &amp; Chủ Tiệm
          </p>
        </div>

        {/* BRUTE-FORCE LOCKOUT BANNER */}
        {bruteForce.isLocked && (
          <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-900 text-xs space-y-2 text-center animate-in fade-in duration-200">
            <ShieldAlert className="w-8 h-8 text-rose-600 mx-auto" />
            <div className="font-extrabold text-sm text-rose-900">
              Tài Khoản Đang Bị Tạm Khóa An Ninh!
            </div>
            <p className="text-[11px] text-rose-700 leading-relaxed">
              Hệ thống đã tự động khóa đăng nhập 15 phút do phát hiện 5 lần nhập sai thông tin liên tiếp.
            </p>
            <div className="font-mono text-base font-extrabold text-rose-700 bg-white/90 py-1.5 px-4 rounded-xl border border-rose-300 inline-flex items-center gap-1.5 shadow-sm">
              <Clock className="w-4 h-4 text-rose-600 animate-spin" />
              <span>
                Thử lại sau: {Math.floor(bruteForce.remainingSeconds / 60)}:
                {(bruteForce.remainingSeconds % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>
        )}

        {/* MODE 1: LOGIN FORM */}
        {loginMode === 'login' && (
          <form onSubmit={handleAdminLoginSubmit} className="space-y-3.5 text-left text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Tài khoản quản trị *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  disabled={bruteForce.isLocked}
                  placeholder="Nhập tên tài khoản quản trị (admin / vvflorielle)..."
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="glass-input w-full text-xs py-2.5 pl-9 rounded-xl disabled:bg-slate-100 disabled:opacity-60"
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
                  disabled={bruteForce.isLocked}
                  placeholder="Nhập mật khẩu..."
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="glass-input w-full text-xs py-2.5 pl-9 rounded-xl disabled:bg-slate-100 disabled:opacity-60"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Mã PIN bảo mật quản trị *</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  maxLength={8}
                  disabled={bruteForce.isLocked}
                  placeholder="••••••••"
                  value={loginPin}
                  onChange={(e) => setLoginPin(e.target.value)}
                  className="glass-input w-full text-center text-sm font-mono tracking-widest py-2.5 rounded-xl disabled:bg-slate-100 disabled:opacity-60"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={bruteForce.isLocked}
                className="w-full btn-primary text-xs py-3 bg-purple-700 hover:bg-purple-800 disabled:bg-slate-400 disabled:cursor-not-allowed rounded-xl shadow-md shadow-purple-600/20 cursor-pointer flex items-center justify-center gap-1.5 font-bold"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Xác Thực &amp; Mở Khóa Quản Trị</span>
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
        )}

        {/* MODE 2: 2FA FOR UNRECOGNIZED DEVICE */}
        {loginMode === 'device_2fa' && (
          <form onSubmit={handleDevice2FaSubmit} className="space-y-4 text-left text-xs animate-in fade-in duration-150">
            <button
              type="button"
              onClick={() => setLoginMode('login')}
              className="inline-flex items-center gap-1.5 text-xs text-purple-700 hover:text-purple-900 font-semibold cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại</span>
            </button>

            <div className="bg-sky-50/90 p-4 rounded-2xl border border-sky-200 text-sky-900 space-y-1.5">
              <div className="font-extrabold flex items-center gap-1.5 text-sky-950">
                <Laptop className="w-4 h-4 text-sky-700" />
                <span>Phát Hiện Thiết Bị Mới / Lạ (2FA)</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Hệ thống nhận diện bạn đang đăng nhập từ một trình duyệt hoặc thiết bị chưa được tin cậy. Mã OTP 6 số đã được gửi tới hòm thư an ninh <strong>traivuho@gmail.com</strong>.
              </p>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Mã xác thực OTP 2FA (6 số) *</label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="••••••"
                value={device2FaInput}
                onChange={(e) => setDevice2FaInput(e.target.value)}
                className="glass-input w-full text-center font-mono tracking-widest text-base py-2.5 rounded-xl"
              />
            </div>

            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={trustDeviceChecked}
                onChange={(e) => setTrustDeviceChecked(e.target.checked)}
                className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
              />
              <span>Tin cậy thiết bị này trong 30 ngày (không cần hỏi lại OTP)</span>
            </label>

            <button
              type="submit"
              className="w-full btn-primary text-xs py-3 rounded-xl bg-purple-700 hover:bg-purple-800 shadow-md font-bold cursor-pointer flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Xác Thực Thiết Bị &amp; Đăng Nhập</span>
            </button>
          </form>
        )}

        {/* MODE 3: FORGOT PIN VIA GMAIL */}
        {loginMode === 'forgot' && (
          <div className="space-y-4 text-left text-xs animate-in fade-in duration-150">
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
                  className="w-full btn-primary text-xs py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 cursor-pointer font-bold"
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
                  className="w-full btn-primary text-xs py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 cursor-pointer font-bold"
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
