import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import {
  PhoneCall,
  MessageSquare,
  X,
  MapPin,
  ExternalLink,
  Clock,
  Sparkles,
  Copy,
  Check,
  Send
} from 'lucide-react';
import { getStoreStatus } from '../utils/storeStatus';

export const FloatingContactWidget: React.FC = () => {
  const { settings, contactChannels, showToast } = useStore();
  const [storeStatus, setStoreStatus] = useState(() => getStoreStatus(settings));

  // Sync real-time store open/closed status every 30s
  useEffect(() => {
    setStoreStatus(getStoreStatus(settings));
    const interval = setInterval(() => {
      setStoreStatus(getStoreStatus(settings));
    }, 30000);
    return () => clearInterval(interval);
  }, [settings]);

  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Draggable position state
  const buttonSize = 46; // 46px on mobile, 48px on desktop
  const getSafeMargin = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 640 ? 24 : 16;
    }
    return 16;
  };

  const getDefaultPos = () => {
    if (typeof window !== 'undefined') {
      const margin = window.innerWidth >= 640 ? 24 : 16;
      return {
        x: Math.max(margin, window.innerWidth - buttonSize - margin),
        y: Math.round(window.innerHeight * 0.42),
      };
    }
    return { x: 320, y: 300 };
  };

  const [pos, setPos] = useState(getDefaultPos);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const hasMovedRef = useRef(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, initialX: 0, initialY: 0 });
  const lastToggleTimeRef = useRef(0);

  // Keep widget inside viewport on window resize & snap to closest edge
  useEffect(() => {
    const handleResize = () => {
      setPos((prev) => {
        const isLeftHalf = prev.x < window.innerWidth / 2;
        const margin = window.innerWidth >= 640 ? 24 : 16;
        return {
          x: isLeftHalf ? margin : Math.max(margin, window.innerWidth - buttonSize - margin),
          y: Math.max(75, Math.min(prev.y, window.innerHeight - buttonSize - 90)),
        };
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Pointer drag handling (mouse + touch unified, silky smooth 60fps)
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only drag with primary mouse button / touch
    if (e.button !== 0) return;

    isDraggingRef.current = true;
    setIsDragging(true);
    hasMovedRef.current = false;
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      initialX: pos.x,
      initialY: pos.y,
    };

    const handlePointerMove = (moveEvt: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const dx = moveEvt.clientX - dragStartRef.current.mouseX;
      const dy = moveEvt.clientY - dragStartRef.current.mouseY;

      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        hasMovedRef.current = true;
      }

      const newX = Math.max(8, Math.min(window.innerWidth - buttonSize - 8, dragStartRef.current.initialX + dx));
      const newY = Math.max(75, Math.min(window.innerHeight - buttonSize - 90, dragStartRef.current.initialY + dy));
      setPos({ x: newX, y: newY });
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
      setIsDragging(false);

      // Snap to closest edge (left or right)
      if (hasMovedRef.current) {
        lastToggleTimeRef.current = Date.now();
        setPos((currentPos) => {
          const isLeftHalf = currentPos.x < window.innerWidth / 2;
          const margin = window.innerWidth >= 640 ? 24 : 16;
          return {
            x: isLeftHalf ? margin : Math.max(margin, window.innerWidth - buttonSize - margin),
            y: Math.max(75, Math.min(currentPos.y, window.innerHeight - buttonSize - 90)),
          };
        });
      }

      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
  };

  const handleWidgetClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const now = Date.now();
    // Guard: ignore clicks immediately after drag
    if (now - lastToggleTimeRef.current < 300) return;
    if (!hasMovedRef.current) {
      setIsOpen((prev) => !prev);
    }
  };

  const cleanPhone = (settings.hotline || '0906.721.442').replace(/\D/g, '');
  const cleanZalo = (settings.zalo || '0906.721.442').replace(/\D/g, '');

  const copyHotline = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(settings.hotline || '0906.721.442');
    setIsCopied(true);
    showToast('Đã sao chép Hotline: ' + (settings.hotline || '0906.721.442'), 'success');
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <>
      {/* 1. SINGLE COMPACT FLOATING CONTACT BUTTON (Draggable, Edge-Snapping, Scroll-Dimming) */}
      <div
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          touchAction: 'none',
          transition: isDragging ? 'none' : 'left 0.35s cubic-bezier(0.16, 1, 0.3, 1), top 0.25s ease-out, opacity 0.3s ease',
        }}
        className="floating-contact-widget fixed z-40 select-none cursor-grab active:cursor-grabbing opacity-100 scale-100"
        onPointerDown={handlePointerDown}
        onClick={handleWidgetClick}
        title="Liên hệ tiệm hoa V&V Florielle"
      >
        <div className="relative group">
          {/* Subtle pulse ring waves */}
          <div className="absolute inset-[-3px] rounded-full border-2 border-rose-500 animate-ping opacity-40 pointer-events-none" />
          <div className="absolute inset-[-6px] rounded-full border border-pink-400 opacity-30 animate-pulse pointer-events-none" />

          {/* Real-time Store Status Badge on top of Contact Widget ("Mở Cửa" | "Tạm Nghỉ" | "Đóng Cửa") */}
          {!isOpen && (
            <div
              className="absolute -top-6 sm:-top-6.5 left-1/2 -translate-x-1/2 z-20 pointer-events-none transition-all duration-300"
              title={`Trạng thái: ${storeStatus.text} • Giờ mở cửa: ${settings.openingHours || '07:30 - 22:00'} hàng ngày`}
            >
              <div
                className={`flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-md border shadow-[0_2px_8px_rgba(0,0,0,0.12)] whitespace-nowrap select-none ${storeStatus.borderColor} ${storeStatus.textColor}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${storeStatus.dotColor}`}
                />
                <span className="text-[7.5px] sm:text-[8.5px] font-bold tracking-tight">
                  {storeStatus.text}
                </span>
              </div>
            </div>
          )}

          {/* Main Round Contact Orb */}
          <div
            className={`w-[46px] h-[46px] sm:w-[48px] sm:h-[48px] rounded-full flex flex-col items-center justify-center shadow-[0_8px_25px_rgba(225,29,72,0.42)] transition-all duration-300 relative border border-white/70 ${
              isOpen
                ? 'bg-gradient-to-tr from-emerald-800 to-teal-700 text-white scale-105 shadow-emerald-900/35'
                : 'bg-gradient-to-tr from-rose-600 via-red-600 to-pink-500 text-white hover:scale-108 active:scale-95 shadow-rose-600/50'
            }`}
          >
            {isOpen ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <div className="flex flex-col items-center justify-center leading-none">
                <PhoneCall className="w-4 h-4 text-white animate-bounce-subtle" />
                <span className="text-[7.5px] font-black uppercase tracking-tighter mt-0.5 text-white/95">
                  Liên Hệ
                </span>
              </div>
            )}
          </div>

          {/* Desktop Hover Hint Pill */}
          <div className="hidden sm:group-hover:flex absolute right-full top-1/2 -translate-y-1/2 mr-2.5 items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/20 shadow-xl text-[11px] font-bold text-white whitespace-nowrap pointer-events-none">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>Kênh liên hệ 24/7</span>
          </div>
        </div>
      </div>

      {/* 2. ELEGANT GLASS CONTACT MODAL POPUP */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9985] flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-white/95 backdrop-blur-2xl border border-white/80 shadow-[0_25px_60px_rgba(0,0,0,0.22)] p-5 relative text-slate-800 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-md shadow-rose-500/25">
                  <PhoneCall className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-[15px] font-extrabold text-slate-900 leading-tight">
                    Liên Hệ V&V Florielle
                  </h3>
                  <p className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Trực Hotline & Zalo 24/7 • Giao nhanh 15P
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Đóng bảng liên hệ"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Channels List */}
            <div className="mt-3.5 space-y-2.5">
              {/* Channel 1: Hotline Gọi Trực Tiếp */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-rose-50/90 to-red-50/70 border border-rose-200/80 flex items-center justify-between gap-2.5 group hover:border-rose-300 transition-all">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-red-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-600/30">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12px] font-bold text-slate-900">Hotline Đặt Hoa</span>
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full bg-rose-200 text-rose-800">
                        24/7
                      </span>
                    </div>
                    <p className="text-[13px] font-black text-rose-700 tracking-wide truncate">
                      {settings.hotline || '0906.721.442'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={copyHotline}
                    className="p-2 rounded-xl bg-white border border-rose-200 text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
                    title="Sao chép số điện thoại"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <a
                    href={`tel:${cleanPhone}`}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white text-[11px] font-extrabold flex items-center gap-1 shadow-sm transition-all"
                  >
                    <span>Gọi</span>
                  </a>
                </div>
              </div>

              {/* Channel 2: Zalo Chat Tư Vấn & Gửi Ảnh Thật */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-50/90 to-sky-50/70 border border-blue-200/80 flex items-center justify-between gap-2.5 group hover:border-blue-300 transition-all">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0068FF] to-[#0046B8] text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-600/30 font-black text-[11px]">
                    Zalo
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12px] font-bold text-slate-900">Chat Zalo Tiệm</span>
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full bg-blue-200 text-blue-800">
                        Online
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 truncate">
                      Gửi ảnh hoa thật chụp trước khi giao
                    </p>
                  </div>
                </div>
                <a
                  href={`https://zalo.me/${cleanZalo}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#0068FF] to-[#0046B8] hover:brightness-110 text-white text-[11px] font-extrabold flex items-center gap-1 shadow-sm transition-all shrink-0"
                >
                  <Send className="w-3 h-3" />
                  <span>Nhắn</span>
                </a>
              </div>

              {/* Dynamic Additional Channels from Settings (Facebook, TikTok, Instagram, etc.) */}
              {contactChannels && contactChannels.filter(c => c.isEnabled && c.type !== 'hotline' && c.type !== 'zalo').map((ch) => {
                const isMessenger = ch.type === 'messenger' || ch.type === 'facebook';
                const isTiktok = ch.type === 'tiktok';
                const channelTitle = ch.title || ch.label || 'Kênh Liên Hệ';
                const channelLink = ch.url || ch.link || '#';

                return (
                  <div
                    key={ch.id}
                    className="p-3 rounded-2xl bg-gradient-to-r from-sky-50/90 to-indigo-50/70 border border-sky-200/80 flex items-center justify-between gap-2.5 group hover:border-sky-300 transition-all"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-9 h-9 rounded-xl text-white flex items-center justify-center shrink-0 shadow-md ${
                        isTiktok
                          ? 'bg-gradient-to-tr from-slate-900 to-black shadow-slate-900/30'
                          : 'bg-gradient-to-tr from-[#00B2FF] to-[#006AFF] shadow-sky-500/30'
                      }`}>
                        {isMessenger ? <MessageSquare className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[12px] font-bold text-slate-900 truncate">{channelTitle}</span>
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full bg-sky-200 text-sky-800">
                            {ch.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 truncate">
                          {ch.value || settings.name || 'V&V Florielle'}
                        </p>
                      </div>
                    </div>
                    <a
                      href={channelLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:brightness-110 text-white text-[11px] font-extrabold flex items-center gap-1 shadow-sm transition-all shrink-0"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Truy cập</span>
                    </a>
                  </div>
                );
              })}

              {/* Showroom Address & Hours (Fully Dynamic) */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-50/90 to-teal-50/70 border border-emerald-200/80 flex items-center justify-between gap-2.5 group hover:border-emerald-300 transition-all">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-700 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/30">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12px] font-bold text-slate-900">Ghé Thăm Showroom</span>
                    </div>
                    <p className="text-[11px] text-slate-700 font-semibold truncate">
                      {settings.address || '105 Doãn Kế Thiện, Mai Dịch, Cầu Giấy, Hà Nội'}
                    </p>
                    <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-emerald-600" />
                      <span>Mở cửa: {settings.openingHours || '07:30 - 22:00'} (Mỗi ngày)</span>
                    </p>
                  </div>
                </div>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(settings.address || '105 Doãn Kế Thiện Cầu Giấy Hà Nội')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1.5 rounded-xl bg-white border border-emerald-300 hover:bg-emerald-50 text-emerald-800 text-[11px] font-extrabold flex items-center gap-1 shadow-sm transition-all shrink-0"
                >
                  <span>Chỉ đường</span>
                </a>
              </div>
            </div>

            {/* Footer note */}
            <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
              <span>🌸 Tiệm hoa V&V Florielle hân hạnh phục vụ bạn</span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="font-bold text-rose-600 hover:underline cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
