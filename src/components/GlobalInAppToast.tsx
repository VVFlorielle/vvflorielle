import React from 'react';
import { CheckCircle2, AlertCircle, Sparkles, Bell } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const GlobalInAppToast: React.FC = () => {
  const {
    toasts,
    activeBannerNotification,
    dismissBannerNotification
  } = useStore();

  return (
    <>
      {/* 1. CENTER FLOATING HUD TOAST (Bóng kính màu trắng, chữ màu đen nổi thanh thoát, không khung cồng kềnh, xuyên click 100%, tối đa 3 hàng) */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000000] pointer-events-none flex flex-col items-center gap-2 select-none px-4 w-auto max-w-[92vw]"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.slice(-3).map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-none inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/85 backdrop-blur-md text-slate-800 text-xs sm:text-[13px] font-bold tracking-wide shadow-[0_8px_30px_rgba(0,0,0,0.14)] border border-white/90 ring-1 ring-slate-900/5 animate-in zoom-in-95 slide-in-from-bottom-2 fade-in duration-200 max-w-[90vw] sm:max-w-md text-center"
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            ) : (
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            )}
            <span className="leading-normal">
              {toast.message}
            </span>
          </div>
        ))}
      </div>

      {/* 2. URGENT SYSTEM BANNER MODAL (Chỉ hiện khi có activeBannerNotification từ hệ thống) */}
      {activeBannerNotification && (
        <div
          className="fixed inset-0 z-[1000000] flex items-center justify-center p-4 bg-slate-900/25 backdrop-blur-sm animate-in fade-in duration-200 select-none"
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
