import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useBodyScrollLock } from '../../utils/scrollLock';
import { Lock, KeyRound, ShieldAlert, LogOut, CheckCircle2, ShieldCheck } from 'lucide-react';

export const AdminLockScreenModal: React.FC = () => {
  const { isSessionLocked, unlockSessionWithPin, logoutAdmin, activeAdminUser } = useStore();
  const [pinInput, setPinInput] = useState('');

  useBodyScrollLock(isSessionLocked);

  if (!isSessionLocked) return null;

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) return;
    const success = unlockSessionWithPin(pinInput.trim());
    if (success) {
      setPinInput('');
    }
  };

  const isSuperAdmin = activeAdminUser === 'admin';

  return (
    <div className="fixed inset-0 z-[1000000] flex items-center justify-center p-3 sm:p-5 bg-slate-900/25 backdrop-blur-md select-none animate-in fade-in duration-300">
      <div className="max-w-md w-full bg-white/95 rounded-[32px] p-6 sm:p-8 shadow-[0_25px_70px_rgba(15,23,42,0.18)] border-2 border-emerald-300/90 text-center space-y-5 animate-in zoom-in-95 duration-200">
        <div className="relative mx-auto w-20 h-20">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-600 to-emerald-600 text-white flex items-center justify-center shadow-xl shadow-purple-600/20">
            <Lock className="w-10 h-10 animate-pulse" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 text-white border-2 border-white flex items-center justify-center shadow">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-[11px] font-bold mb-2">
            <span>{isSuperAdmin ? '👑 Super Admin' : '🌸 Chủ Tiệm'}</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Phiên Quản Trị Đang Tạm Khóa
          </h2>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Hệ thống đã tự động khóa bảo vệ an toàn dữ liệu kinh doanh sau 30 phút không có hoạt động.
          </p>
        </div>

        <form onSubmit={handleUnlockSubmit} className="space-y-4 text-xs text-left">
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">
              Nhập Mã PIN Quản Trị Để Mở Khóa *
            </label>
            <div className="relative">
              <input
                type="password"
                autoFocus
                required
                maxLength={8}
                placeholder="••••••••"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="glass-input w-full text-center font-mono tracking-widest text-base py-3 pl-10 pr-10 rounded-2xl border-2 border-emerald-300 focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all shadow-inner"
              />
              <KeyRound className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
            <span className="text-[10px] text-slate-400 block mt-1 text-center">
              Nhập mã PIN 6 số dùng chung của hệ thống để tiếp tục làm việc ngay
            </span>
          </div>

          <div className="pt-2 space-y-2">
            <button
              type="submit"
              className="w-full btn-primary text-xs py-3 rounded-2xl bg-purple-700 hover:bg-purple-800 font-bold shadow-lg shadow-purple-600/25 cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mở Khóa Phiên Làm Việc</span>
            </button>

            <button
              type="button"
              onClick={logoutAdmin}
              className="w-full py-2.5 rounded-2xl text-xs text-slate-500 hover:text-rose-600 hover:bg-rose-50 font-semibold cursor-pointer transition-colors flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng xuất thoát hẳn phiên quản trị</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
