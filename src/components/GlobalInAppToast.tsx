import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useBodyScrollLock } from '../utils/scrollLock';

export const GlobalInAppToast: React.FC = () => {
  const {
    toasts,
    activeBannerNotification,
    dismissBannerNotification,
    dismissToast
  } = useStore();

  // Active toast is the latest toast in the queue
  const currentToast = toasts.length > 0 ? toasts[toasts.length - 1] : null;
  const isVisible = Boolean(currentToast || activeBannerNotification);

  // Lock body scroll when notification is prominently displayed in center
  useBodyScrollLock(isVisible);

  // Handlers to dismiss
  const handleDismiss = () => {
    if (activeBannerNotification) {
      dismissBannerNotification();
    }
    dismissToast();
  };

  if (!isVisible) return null;

  const isBanner = Boolean(activeBannerNotification && !currentToast);
  const type = currentToast?.type || 'info';
  const title = isBanner
    ? activeBannerNotification?.title
    : type === 'success'
    ? 'Thành Công'
    : type === 'error'
    ? 'Thông Báo Lỗi'
    : 'Thông Báo Tiệm Hoa';
  const message = isBanner ? activeBannerNotification?.message : currentToast?.message;

  return (
    <div
      className="fixed inset-0 z-[100000] flex items-center justify-center p-4 animate-in fade-in duration-200 select-none"
      onClick={handleDismiss}
      role="dialog"
      aria-modal="true"
    >
      {/* 1. Translucent Frosted Glass Backdrop Overlay (Surrounds notification) */}
      <div className="fixed inset-0 bg-slate-950/45 backdrop-blur-md transition-opacity" />

      {/* 2. Floating Centered Notification Card */}
      <div
        className="relative z-10 w-full max-w-xs sm:max-w-sm rounded-[28px] sm:rounded-[32px] bg-white/95 backdrop-blur-2xl border border-white/90 shadow-[0_25px_60px_rgba(0,0,0,0.28),inset_0_2px_4px_rgba(255,255,255,0.9)] p-6 sm:p-7 text-center space-y-4 animate-in zoom-in-95 duration-200 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button Top Right */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 transition-colors cursor-pointer"
          title="Đóng thông báo"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Status Icon */}
        <div className="flex justify-center">
          {type === 'success' ? (
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 animate-bounce-subtle">
              <CheckCircle2 className="w-8 h-8" />
            </div>
          ) : type === 'error' ? (
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/25 animate-shake">
              <AlertCircle className="w-8 h-8" />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-sky-500/25">
              <Sparkles className="w-8 h-8" />
            </div>
          )}
        </div>

        {/* Text Content */}
        <div className="space-y-1.5">
          <h3 className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed px-1">
            {message}
          </p>
        </div>

        {/* Confirm Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleDismiss}
            className={`w-full py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white shadow-md transition-all active:scale-95 cursor-pointer ${
              type === 'success'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-600/20'
                : type === 'error'
                ? 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 shadow-rose-600/20'
                : 'bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black shadow-slate-900/20'
            }`}
          >
            Đã Hiểu
          </button>
        </div>
      </div>
    </div>
  );
};
