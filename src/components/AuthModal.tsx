import React, { useState } from 'react';
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

  // Admin Login Credentials State (admin / vvflorielle)
  const [adminUsernameInput, setAdminUsernameInput] = useState('');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminPinInput, setAdminPinInput] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);

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

  // Admin Login Submit (admin / vvflorielle)
  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminUsernameInput.trim() || !adminPasswordInput.trim() || !adminPinInput.trim()) {
      showToast('Vui lòng điền đủ Tên đăng nhập, Mật khẩu và Mã PIN cấp 2!', 'error');
      return;
    }

    const success = loginAdmin(
      adminUsernameInput.trim(),
      adminPasswordInput.trim(),
      adminPinInput.trim()
    );

    if (success) {
      setIsAuthModalOpen(false);
      setAdminUsernameInput('');
      setAdminPasswordInput('');
      setAdminPinInput('');
    }
  };

  return (
    <div className="glass-overlay" onClick={() => setIsAuthModalOpen(false)}>
      <div
        className="glass-modal-content p-6 sm:p-7 max-w-sm sm:max-w-md w-full relative rounded-[28px] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 transition-colors z-20"
          title="Đóng cửa sổ"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Role Switcher Tabs (Dễ Dàng Đăng Nhập Khách Hàng Hoặc Quản Trị) */}
        <div className="flex p-1 bg-slate-100/90 rounded-2xl mb-4 border border-white/80 pr-10">
          <button
            type="button"
            onClick={() => setAuthModalMode('customer')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              authModalMode === 'customer' || authModalMode === 'register' || authModalMode === 'forgot'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Khách Hàng</span>
          </button>
          <button
            type="button"
            onClick={() => setAuthModalMode('admin')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              authModalMode === 'admin'
                ? 'bg-purple-700 text-white shadow-sm'
                : 'text-slate-500 hover:text-purple-700'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Quản Trị Viên</span>
          </button>
        </div>

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

              <div className="text-center pt-2 border-t border-slate-100">
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

              <div className="text-center pt-2 border-t border-slate-100">
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

        {/* 4. ADMIN LOGIN MODE (admin / vvflorielle) */}
        {authModalMode === 'admin' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setAuthModalMode('customer')}
                className="inline-flex items-center gap-1 text-xs text-purple-700 hover:text-purple-900 font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Trang khách hàng</span>
              </button>
              <span className="text-[10px] uppercase font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                Hệ Thống Quản Trị
              </span>
            </div>

            <div className="text-center mb-3">
              <div className="w-13 h-13 rounded-2xl bg-purple-100 text-purple-700 mx-auto flex items-center justify-center mb-2 shadow-md border border-purple-200">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Đăng Nhập Quản Trị V&V</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Dành cho Quản trị viên Super Admin và Chủ tiệm Florist
              </p>
            </div>

            {/* Quick Presets for Admin Accounts */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                type="button"
                onClick={() => {
                  setAdminUsernameInput('admin');
                  setAdminPasswordInput('17092000');
                  setAdminPinInput('26122025');
                }}
                className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-left transition-all"
                title="Bấm để tự động điền tài khoản Super Admin"
              >
                <div className="text-[11px] font-bold text-purple-900 flex items-center justify-between">
                  <span>admin</span>
                  <span className="text-[9px] bg-purple-200 text-purple-800 px-1 rounded">Chủ tiệm</span>
                </div>
                <div className="text-[10px] text-purple-600 font-mono mt-0.5 truncate">Pass: 17092000</div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAdminUsernameInput('vvflorielle');
                  setAdminPasswordInput('19092003');
                  setAdminPinInput('26122025');
                }}
                className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-left transition-all"
                title="Bấm để tự động điền tài khoản Boutique Florist"
              >
                <div className="text-[11px] font-bold text-emerald-900 flex items-center justify-between">
                  <span>vvflorielle</span>
                  <span className="text-[9px] bg-emerald-200 text-emerald-800 px-1 rounded">Florist</span>
                </div>
                <div className="text-[10px] text-emerald-600 font-mono mt-0.5 truncate">Pass: 19092003</div>
              </button>
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
                    placeholder="admin hoặc vvflorielle"
                    value={adminUsernameInput}
                    onChange={(e) => setAdminUsernameInput(e.target.value)}
                    className="glass-input w-full text-xs py-2.5 pl-9 rounded-xl font-mono"
                  />
                  <User className="w-4 h-4 text-purple-500 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showAdminPassword ? 'text' : 'password'}
                    required
                    placeholder="Nhập mật khẩu"
                    value={adminPasswordInput}
                    onChange={(e) => setAdminPasswordInput(e.target.value)}
                    className="glass-input w-full text-xs py-2.5 pl-9 pr-9 rounded-xl font-mono"
                  />
                  <Lock className="w-4 h-4 text-purple-500 absolute left-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Mã PIN bảo mật cấp 2
                </label>
                <input
                  type="password"
                  required
                  maxLength={8}
                  placeholder="Nhập mã PIN bảo mật"
                  value={adminPinInput}
                  onChange={(e) => setAdminPinInput(e.target.value)}
                  className="glass-input w-full text-center text-sm font-mono tracking-widest py-2 rounded-xl"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold transition-all shadow-md hover:shadow-purple-700/20"
                >
                  Xác Thực & Mở Khóa Quản Trị
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
