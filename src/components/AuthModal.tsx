import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  User,
  ShieldCheck,
  Lock,
  Phone,
  Sparkles,
  ArrowLeft,
  Mail,
  Send,
  CheckCircle2,
  Eye,
  EyeOff,
  UserPlus,
  KeyRound
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    loginCustomer,
    registerCustomer,
    requestCustomerOtp,
    resetCustomerPasswordWithOtp,
    verifyAdminPin,
    loginAdmin,
    setCurrentView,
    showToast
  } = useStore();

  // Logo secret trigger for Admin
  const [logoClicks, setLogoClicks] = useState(0);

  // Customer Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState(''); // Phone or Email
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Customer Register Form State
  const [regFullName, setRegFullName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Forgot Password State
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [isForgotOtpSent, setIsForgotOtpSent] = useState(false);

  // 2-Step Admin Login State (Step 1: PIN, Step 2: Account & Password)
  const [adminStep, setAdminStep] = useState<'pin' | 'login'>('pin');
  const [adminPinInput, setAdminPinInput] = useState('');
  const [showAdminPin, setShowAdminPin] = useState(false);
  const [adminUsernameInput, setAdminUsernameInput] = useState('');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [keepSession, setKeepSession] = useState(true);
  const [rememberLogin, setRememberLogin] = useState(false);
  const [isUsingRememberedAuth, setIsUsingRememberedAuth] = useState(false);

  // Load remembered credentials on entering admin mode
  useEffect(() => {
    if (authModalMode === 'admin') {
      const hasRemembered = localStorage.getItem('vvf_admin_has_remembered') === 'true';
      if (hasRemembered) {
        setRememberLogin(true);
        const savedUser = localStorage.getItem('vvf_admin_remembered_user') || '';
        setAdminUsernameInput(savedUser);
        setAdminPasswordInput('••••••••');
        setIsUsingRememberedAuth(true);
      }
    }
  }, [authModalMode]);

  if (!isAuthModalOpen) return null;

  // Secret 3-click trigger to access Admin Login
  const handleLogoSecretClick = () => {
    const next = logoClicks + 1;
    if (next >= 3) {
      setLogoClicks(0);
      setAuthModalMode('admin');
      showToast('Đã kích hoạt lối vào Quản Trị Hệ Thống!', 'info');
    } else {
      setLogoClicks(next);
      setTimeout(() => setLogoClicks(0), 1200);
    }
  };

  // Customer Login Submit
  const handleCustomerLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) {
      showToast('Vui lòng nhập Số điện thoại hoặc Gmail!', 'error');
      return;
    }
    const success = loginCustomer(loginIdentifier.trim(), loginPassword || undefined);
    if (success) {
      setIsAuthModalOpen(false);
      setLoginIdentifier('');
      setLoginPassword('');
    }
  };

  // Customer Register Submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName.trim() || !regPhone.trim()) {
      showToast('Vui lòng nhập đầy đủ Họ tên và Số điện thoại!', 'error');
      return;
    }
    if (regPassword.length < 6) {
      showToast('Mật khẩu đăng ký tối thiểu 6 ký tự!', 'error');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      showToast('Mật khẩu xác nhận không khớp nhau!', 'error');
      return;
    }

    const success = registerCustomer(regFullName, regPhone, regEmail || undefined, regPassword);
    if (success) {
      setIsAuthModalOpen(false);
      setCurrentView('customer');
      setRegFullName('');
      setRegPhone('');
      setRegEmail('');
      setRegPassword('');
      setRegConfirmPassword('');
    }
  };

  // Forgot Password: Send OTP
  const handleSendForgotOtp = () => {
    if (!forgotIdentifier.trim()) {
      showToast('Vui lòng nhập SĐT hoặc Gmail để nhận OTP!', 'error');
      return;
    }
    requestCustomerOtp(forgotIdentifier.trim());
    setIsForgotOtpSent(true);
  };

  // Forgot Password: Submit Reset
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotIdentifier.trim() || !forgotOtp.trim() || !forgotNewPassword.trim()) {
      showToast('Vui lòng nhập đầy đủ thông tin mã OTP và mật khẩu mới!', 'error');
      return;
    }
    const success = resetCustomerPasswordWithOtp(forgotIdentifier.trim(), forgotOtp.trim(), forgotNewPassword.trim());
    if (success) {
      setAuthModalMode('customer');
      setLoginIdentifier(forgotIdentifier.trim());
      setIsForgotOtpSent(false);
      setForgotOtp('');
      setForgotNewPassword('');
    }
  };

  // Step 1: Submit PIN Verification
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPinInput.trim()) {
      showToast('Vui lòng nhập Mã PIN bảo mật cấp 2!', 'error');
      return;
    }
    const isValid = verifyAdminPin(adminPinInput.trim());
    if (isValid) {
      setAdminStep('login');
      showToast('Xác thực PIN thành công! Vui lòng nhập tài khoản & mật khẩu.', 'success');
    } else {
      showToast('Mã PIN bảo mật cấp 2 không chính xác!', 'error');
    }
  };

  // Step 2: Submit Account & Password Login
  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminUsernameInput.trim()) {
      showToast('Vui lòng nhập Tên tài khoản quản trị!', 'error');
      return;
    }

    let passwordToUse = adminPasswordInput;
    if (isUsingRememberedAuth) {
      const stored = localStorage.getItem('vvf_admin_remembered_auth');
      if (stored) {
        try {
          passwordToUse = atob(stored);
        } catch {
          passwordToUse = adminPasswordInput;
        }
      }
    }

    if (!passwordToUse.trim()) {
      showToast('Vui lòng nhập Mật khẩu quản trị!', 'error');
      return;
    }

    const success = loginAdmin(
      adminUsernameInput.trim(),
      passwordToUse.trim(),
      adminPinInput.trim(),
      keepSession,
      rememberLogin
    );

    if (success) {
      setIsAuthModalOpen(false);
      setAdminStep('pin');
      setAdminPinInput('');
      if (!rememberLogin) {
        setAdminUsernameInput('');
        setAdminPasswordInput('');
        setIsUsingRememberedAuth(false);
      }
    }
  };

  return (
    <div className="glass-overlay" onClick={() => setIsAuthModalOpen(false)}>
      <div
        className="glass-modal-content max-w-sm sm:max-w-md w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed Header with Tab Switcher (Customer / Register) & Discreet Admin Mode */}
        <div className="glass-modal-header">
          {authModalMode === 'admin' ? (
            <div className="flex items-center gap-2 flex-1 mr-3">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse" />
              <span className="text-xs font-black text-purple-900 uppercase tracking-wider">
                Xác Thực Quản Trị Hệ Thống
              </span>
              <button
                type="button"
                onClick={() => setAuthModalMode('customer')}
                className="ml-auto text-[11px] text-slate-500 hover:text-emerald-700 font-semibold"
              >
                Về Khách Hàng
              </button>
            </div>
          ) : (
            <div className="flex p-1 bg-slate-100/90 rounded-2xl border border-white/80 flex-1 mr-3">
              <button
                type="button"
                onClick={() => setAuthModalMode('customer')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  authModalMode === 'customer' || authModalMode === 'forgot'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Đăng Nhập</span>
              </button>
              <button
                type="button"
                onClick={() => setAuthModalMode('register')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  authModalMode === 'register'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Đăng Ký Mới</span>
              </button>
            </div>
          )}

          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 transition-colors cursor-pointer"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="glass-modal-body p-5 sm:p-6">
          {/* 1. CUSTOMER LOGIN MODE */}
          {authModalMode === 'customer' && (
          <div>
            <div className="text-center mb-5">
              <div
                onClick={handleLogoSecretClick}
                className="w-14 h-14 rounded-2xl bg-emerald-100/80 text-emerald-700 mx-auto flex items-center justify-center cursor-pointer select-none transition-transform hover:scale-105 active:scale-95 shadow-md shadow-emerald-600/10 border border-emerald-200/50"
                title="V&V Florielle Member"
              >
                <User className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mt-3">Đăng Nhập Thành Viên</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Nhập Số điện thoại hoặc Gmail để theo dõi đơn và tích lũy điểm
              </p>
            </div>

            <form onSubmit={handleCustomerLoginSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Số điện thoại hoặc Gmail
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="VD: 0912345678 hoặc email@gmail.com"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="glass-input w-full text-xs py-2.5 pl-9 rounded-xl"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">Mật khẩu</label>
                  <button
                    type="button"
                    onClick={() => setAuthModalMode('forgot')}
                    className="text-[11px] text-emerald-700 hover:underline font-medium"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    placeholder="Nhập mật khẩu của bạn"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="glass-input w-full text-xs py-2.5 pl-9 pr-9 rounded-xl"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="btn-primary w-full py-2.5 text-xs font-semibold rounded-xl shadow-md"
                >
                  Đăng Nhập Ngay
                </button>
              </div>

              <div className="text-center pt-2.5 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  Chưa có tài khoản?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthModalMode('register')}
                    className="text-emerald-700 font-bold hover:underline"
                  >
                    Đăng ký thành viên mới
                  </button>
                </p>
              </div>
            </form>
          </div>
        )}

        {/* 2. CUSTOMER REGISTRATION MODE */}
        {authModalMode === 'register' && (
          <div>
            <div className="text-center mb-4">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white mx-auto flex items-center justify-center mb-2 shadow-md">
                <UserPlus className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Đăng Ký Thành Viên V&V</h3>
              <div className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-800">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tặng 10 điểm khởi đầu & Voucher FREESHIP30K</span>
              </div>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-2.5">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">
                  Họ và tên <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Nguyễn Thu Thảo"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  className="glass-input w-full text-xs py-2 px-3 rounded-xl"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">
                  Số điện thoại (Định danh chính) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="VD: 0987654321"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="glass-input w-full text-xs py-2 px-3 rounded-xl"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">
                  Gmail (Để nhận thông báo đơn & OTP)
                </label>
                <input
                  type="email"
                  placeholder="VD: thuthao@gmail.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="glass-input w-full text-xs py-2 px-3 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">
                    Mật khẩu <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      placeholder="Tối thiểu 6 ký tự"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="glass-input w-full text-xs py-2 px-3 pr-8 rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-2 top-2 text-slate-400"
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">
                    Xác nhận mật khẩu <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="Nhập lại mật khẩu"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="glass-input w-full text-xs py-2 px-3 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="btn-primary w-full py-2.5 text-xs font-semibold rounded-xl shadow-md"
                >
                  Đăng Ký Ngay
                </button>
              </div>

              <div className="text-center pt-2.5 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  Đã có tài khoản?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthModalMode('customer')}
                    className="text-emerald-700 font-bold hover:underline"
                  >
                    Đăng nhập
                  </button>
                </p>
              </div>
            </form>
          </div>
        )}

        {/* 3. FORGOT PASSWORD MODE */}
        {authModalMode === 'forgot' && (
          <div>
            <button
              onClick={() => setAuthModalMode('customer')}
              className="inline-flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-900 font-semibold mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại đăng nhập</span>
            </button>

            <div className="text-center mb-4">
              <div className="w-13 h-13 rounded-2xl bg-sky-100 text-sky-700 mx-auto flex items-center justify-center mb-2 shadow-md">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Quên Mật Khẩu</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Nhận mã OTP 6 số để đặt lại mật khẩu mới
              </p>
            </div>

            <form onSubmit={handleForgotSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Số điện thoại hoặc Gmail tài khoản
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Nhập SĐT hoặc Gmail"
                    value={forgotIdentifier}
                    onChange={(e) => setForgotIdentifier(e.target.value)}
                    className="glass-input flex-1 text-xs py-2 px-3 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={handleSendForgotOtp}
                    className="px-3 py-2 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 rounded-xl text-xs font-semibold shrink-0"
                  >
                    {isForgotOtpSent ? 'Gửi lại' : 'Lấy mã OTP'}
                  </button>
                </div>
              </div>

              {isForgotOtpSent && (
                <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Mã OTP đã được tạo! Vui lòng kiểm tra thông báo.</span>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Mã OTP 6 số
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="Nhập 6 số OTP"
                  value={forgotOtp}
                  onChange={(e) => setForgotOtp(e.target.value)}
                  className="glass-input w-full text-center text-sm font-mono tracking-widest py-2 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Nhập mật khẩu mới"
                  value={forgotNewPassword}
                  onChange={(e) => setForgotNewPassword(e.target.value)}
                  className="glass-input w-full text-xs py-2 px-3 rounded-xl"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="btn-primary w-full py-2.5 text-xs font-semibold rounded-xl shadow-md"
                >
                  Đặt Lại Mật Khẩu
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 4. ADMIN LOGIN MODE (2-Step Verification: PIN -> Account & Password) */}
        {authModalMode === 'admin' && (
          <div>
            {adminStep === 'pin' ? (
              /* Step 1: Mã PIN bảo mật cấp 2 */
              <div>
                <div className="flex items-center justify-between mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalMode('customer');
                      setAdminPinInput('');
                    }}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Trở về</span>
                  </button>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Bước 1 / 2: Mã PIN
                  </span>
                </div>

                <div className="text-center mb-5">
                  <div className="w-13 h-13 rounded-2xl bg-slate-100 text-slate-700 mx-auto flex items-center justify-center mb-2 shadow-sm border border-slate-200">
                    <KeyRound className="w-6 h-6 text-slate-700" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900">Xác Thực Mã PIN Quản Trị</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Vui lòng nhập mã PIN bảo mật cấp 2 để mở khóa quyền truy cập
                  </p>
                </div>

                <form onSubmit={handlePinSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1.5 text-center">
                      Mã PIN Bảo Mật (6 - 8 số)
                    </label>
                    <div className="relative max-w-[260px] mx-auto">
                      <input
                        type={showAdminPin ? 'text' : 'password'}
                        required
                        autoFocus
                        maxLength={8}
                        placeholder="••••••••"
                        value={adminPinInput}
                        onChange={(e) => setAdminPinInput(e.target.value)}
                        className="glass-input w-full text-center text-lg font-mono tracking-[0.35em] py-2.5 px-9 rounded-xl shadow-inner border border-slate-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAdminPin(!showAdminPin)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                        title={showAdminPin ? 'Ẩn mã PIN' : 'Hiện mã PIN'}
                      >
                        {showAdminPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all shadow-md active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Xác Nhận & Tiếp Tục</span>
                      <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Step 2: Tài khoản & Mật khẩu Quản trị */
              <div>
                <div className="flex items-center justify-between mb-4">
                  <button
                    type="button"
                    onClick={() => setAdminStep('pin')}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Nhập lại PIN</span>
                  </button>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>PIN Hợp Lệ</span>
                  </span>
                </div>

                <div className="text-center mb-4">
                  <div className="w-13 h-13 rounded-2xl bg-purple-50 text-purple-700 mx-auto flex items-center justify-center mb-2 shadow-sm border border-purple-200">
                    <ShieldCheck className="w-6 h-6 text-purple-700" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900">Đăng Nhập Quản Trị V&V</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Nhập tài khoản và mật khẩu quản trị hệ thống
                  </p>
                </div>

                <form onSubmit={handleAdminSubmit} className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Tài khoản Quản trị
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="Nhập tên tài khoản"
                        value={adminUsernameInput}
                        onChange={(e) => {
                          setAdminUsernameInput(e.target.value);
                          if (isUsingRememberedAuth) {
                            setIsUsingRememberedAuth(false);
                            setAdminPasswordInput('');
                          }
                        }}
                        className="glass-input w-full text-xs py-2.5 pl-9 rounded-xl font-mono"
                      />
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Mật khẩu Quản trị
                      </label>
                      {isUsingRememberedAuth && (
                        <span className="text-[10px] text-emerald-600 font-medium">
                          Đã nạp mật khẩu đã lưu
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type={showAdminPassword && !isUsingRememberedAuth ? 'text' : 'password'}
                        required
                        placeholder="Nhập mật khẩu"
                        value={adminPasswordInput}
                        onChange={(e) => {
                          setAdminPasswordInput(e.target.value);
                          setIsUsingRememberedAuth(false);
                        }}
                        className="glass-input w-full text-xs py-2.5 pl-9 pr-9 rounded-xl font-mono"
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <button
                        type="button"
                        onClick={() => {
                          if (isUsingRememberedAuth) {
                            showToast('Mật khẩu đã ghi nhớ được che kín an toàn.', 'info');
                            return;
                          }
                          setShowAdminPassword(!showAdminPassword);
                        }}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                        title={showAdminPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                      >
                        {showAdminPassword && !isUsingRememberedAuth ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* 2 Checkboxes: Duy trì đăng nhập & Ghi nhớ đăng nhập */}
                  <div className="space-y-2 pt-1 border-t border-slate-100">
                    <label className="flex items-start gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={keepSession}
                        onChange={(e) => setKeepSession(e.target.checked)}
                        className="mt-0.5 w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500 cursor-pointer"
                      />
                      <div className="text-left leading-snug">
                        <span className="text-xs font-semibold text-slate-800 block">
                          Duy trì đăng nhập
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Giữ phiên làm việc liên tục đến khi chủ động đăng xuất (không tích sẽ tự động thoát sau 3 giờ)
                        </span>
                      </div>
                    </label>

                    <label className="flex items-start gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberLogin}
                        onChange={(e) => setRememberLogin(e.target.checked)}
                        className="mt-0.5 w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500 cursor-pointer"
                      />
                      <div className="text-left leading-snug">
                        <span className="text-xs font-semibold text-slate-800 block">
                          Ghi nhớ đăng nhập
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Ghi nhớ tài khoản cho lần sau (mật khẩu được bảo mật che kín)
                        </span>
                      </div>
                    </label>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all shadow-md hover:shadow-purple-700/20 active:scale-[0.99] cursor-pointer"
                    >
                      Đăng Nhập Quản Trị Hệ Thống
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
        </div>

        {/* Stealth Admin Entrance (Faint, discreet trigger at bottom-right corner) */}
        {authModalMode !== 'admin' && (
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('admin');
              setAdminStep('pin');
            }}
            className="absolute bottom-2.5 right-3 p-1 rounded text-slate-400 hover:text-slate-600 transition-opacity cursor-pointer focus:outline-none select-none"
            style={{ opacity: 0.12 }}
            aria-label="system-trigger"
            title=""
          >
            <span className="inline-block w-2.5 h-2.5 rounded-full border border-slate-400/80" />
          </button>
        )}
      </div>
    </div>
  );
};
