import React from 'react';
import { CheckCircle2, AlertCircle, X, Sparkles, Bell } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const GlobalInAppToast: React.FC = () => {
  const {
    toasts,
    activeBannerNotification,
    dismissBannerNotification,
    dismissToast
  } = useStore();

  return (
    <>
      {/* 1. LIGHTWEIGHT FLOATING CORNER TOASTS (Chuẩn Phototiinlove: Nổi góc phải nhẹ nhàng, tự biến mất sau ~2s) */}
      <div
        className="fixed top-4 right-4 sm:top-5 sm:right-5 z-[100000] pointer-events-none flex flex-col gap-2 max-w-[340px] sm:max-w-sm w-full px-2"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl bg-white/95 backdrop-blur-xl border shadow-[0_10px_30px_rgba(0,0,0,0.12)] animate-in slide-in-from-top-3 fade-in duration-200 select-none ${
              toast.type === 'success'
                ? 'border-emerald-300/90 text-emerald-950'
                : toast.type === 'error'
                ? 'border-rose-300/90 text-rose-950'
                : 'border-slate-200 text-slate-900'
            }`}
          >
            <div className="shrink-0">
              {toast.type === 'success' ? (
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              ) : toast.type === 'error' ? (
                <div className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-xs">
                  <AlertCircle className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
            <p className="text-xs sm:text-[13px] font-semibold leading-snug flex-1">
              {toast.message}
            </p>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors cursor-pointer shrink-0"
              title="Đóng thông báo"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* 2. URGENT SYSTEM BANNER MODAL (Chỉ hiện khi có activeBannerNotification từ hệ thống) */}
      {activeBannerNotification && (
        <div
          className="fixed inset-0 z-[100001] flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-xs animate-in fade-in duration-200 select-none"
          onClick={dismissBannerNotification}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative z-10 w-full max-w-xs sm:max-w-sm rounded-[28px] bg-white p-6 text-center space-y-4 animate-in zoom-in-95 duration-200 shadow-2xl border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
              <Bell className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-900 text-base">
                {activeBannerNotification.title || 'Thông Báo'}
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {activeBannerNotification.message}
              </p>
            </div>
            <button
              type="button"
              onClick={dismissBannerNotification}
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Đã Hiểu
            </button>
          </div>
        </div>
      )}
    </>
  );
};
