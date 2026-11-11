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

export const FloatingContactWidget: React.FC = () => {
  const { settings, showToast } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // Scroll detection to subtly dim widget during fast scrolling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 450);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

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
        className={`fixed z-40 select-none cursor-grab active:cursor-grabbing ${
          isScrolling ? 'opacity-45 hover:opacity-100 scale-95' : 'opacity-100 scale-100'
        }`}
        onPointerDown={handlePointerDown}
        onClick={handleWidgetClick}
        title="Liên hệ tiệm hoa V&V Florielle"
      >
        <div className="relative group">
          {/* Subtle pulse ring waves */}
          <div className="absolute inset-[-3px] rounded-full border-2 border-rose-500 animate-ping opacity-40 pointer-events-none" />
          <div className="absolute inset-[-6px] rounded-full border border-pink-400 opacity-30 animate-pulse pointer-events-none" />

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

          {/* Online status indicator dot */}
          {!isOpen && (
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-sm flex items-center justify-center pointer-events-none">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping opacity-75" />
            </span>
          )}

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

              {/* Channel 3: Messenger Fanpage */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-sky-50/90 to-indigo-50/70 border border-sky-200/80 flex items-center justify-between gap-2.5 group hover:border-sky-300 transition-all">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00B2FF] to-[#006AFF] text-white flex items-center justify-center shrink-0 shadow-md shadow-sky-500/30">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12px] font-bold text-slate-900">Facebook Messenger</span>
                    </div>
                    <p className="text-[11px] text-slate-600 truncate">
                      V&V Florielle Boutique Florist
                    </p>
                  </div>
                </div>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#00B2FF] to-[#006AFF] hover:brightness-110 text-white text-[11px] font-extrabold flex items-center gap-1 shadow-sm transition-all shrink-0"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Chat</span>
                </a>
              </div>

              {/* Channel 4: Showroom Address & Hours */}
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
                      105 Doãn Kế Thiện, Cầu Giấy, Hà Nội
                    </p>
                    <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-emerald-600" />
                      Mở cửa: 06:30 - 21:30 (Mỗi ngày)
                    </p>
                  </div>
                </div>
                <a
                  href="https://maps.google.com/?q=105+Doan+Ke+Thien+Cau+Giay+Ha+Noi"
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
