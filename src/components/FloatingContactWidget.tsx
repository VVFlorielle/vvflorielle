import React, { useState, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import {
  PhoneCall,
  Phone,
  MessageSquare,
  Sparkles,
  X,
  MapPin,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const FloatingContactWidget: React.FC = () => {
  const { contactChannels, settings } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredChannelId, setHoveredChannelId] = useState<string | null>(null);
  const closeTimerRef = useRef<any>(null);

  // Filter channels
  const activeChannels = contactChannels
    .filter((c) => c.isEnabled)
    .sort((a, b) => a.order - b.order);

  // Channels to expand (excluding hotline & zalo since they are always pinned outside)
  const expandedChannels = activeChannels.filter((c) => c.type !== 'hotline' && c.type !== 'zalo');

  const handleMouseEnter = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
      setHoveredChannelId(null);
    }, 450);
  };

  const renderChannelIcon = (type: string) => {
    switch (type) {
      case 'zalo':
        return <span className="font-extrabold text-[11px] tracking-tighter">Zalo</span>;
      case 'hotline':
        return <PhoneCall className="w-4 h-4 animate-pulse" />;
      case 'tiktok':
        return <span className="font-extrabold text-[10px]">TikTok</span>;
      case 'facebook':
        return <span className="font-extrabold text-[11px]">FB</span>;
      case 'messenger':
        return <MessageSquare className="w-4 h-4" />;
      case 'maps':
        return <MapPin className="w-4 h-4" />;
      default:
        return <ExternalLink className="w-4 h-4" />;
    }
  };

  const getChannelColorGradient = (type: string) => {
    switch (type) {
      case 'zalo':
        return 'from-[#0068FF] to-[#0046B8] text-white shadow-blue-500/30';
      case 'hotline':
        return 'from-rose-600 via-red-600 to-rose-700 text-white shadow-red-500/30';
      case 'facebook':
        return 'from-[#1877F2] to-[#0D54B8] text-white shadow-blue-600/30';
      case 'messenger':
        return 'from-[#00B2FF] to-[#006AFF] text-white shadow-sky-500/30';
      case 'tiktok':
        return 'from-slate-950 via-slate-900 to-teal-500 text-white shadow-slate-900/40';
      case 'maps':
        return 'from-emerald-700 to-teal-600 text-white shadow-emerald-600/30';
      default:
        return 'from-emerald-700 to-teal-600 text-white shadow-emerald-600/30';
    }
  };

  const cleanPhone = (settings.hotline || '0906.721.442').replace(/\D/g, '');
  const cleanZalo = (settings.zalo || '0906.721.442').replace(/\D/g, '');

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="fixed right-3 sm:right-5 top-[38%] -translate-y-1/2 z-50 flex flex-col items-end gap-2 select-none"
    >
      {/* 1. MAIN TRIGGER BUTTON: RED GRADIENT PHONE BUTTON */}
      <div className="relative group">
        {/* Pulsing red ring wave */}
        <div className="absolute inset-[-4px] rounded-full border-2 border-rose-500 animate-ping opacity-60 pointer-events-none" />
        <div className="absolute inset-[-8px] rounded-full border border-pink-400 opacity-40 animate-pulse pointer-events-none" />

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-12 h-12 sm:w-13 sm:h-13 rounded-full flex flex-col items-center justify-center shadow-[0_8px_25px_rgba(225,29,72,0.45)] transition-all duration-300 relative border border-white/60 z-10 ${
            isOpen
              ? 'bg-slate-900 text-white scale-105 shadow-slate-900/40'
              : 'bg-gradient-to-tr from-red-600 via-rose-600 to-pink-500 text-white hover:scale-110 shadow-rose-600/50'
          }`}
          title={isOpen ? 'Đóng bớt kênh liên hệ' : 'Kênh liên hệ V&V Florielle'}
        >
          {isOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <div className="flex flex-col items-center justify-center leading-none">
              <PhoneCall className="w-4 h-4 sm:w-5 sm:h-5 animate-bounce-subtle" />
              <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-tighter mt-0.5">
                Liên hệ
              </span>
            </div>
          )}
        </button>

        {/* Small badge count */}
        {!isOpen && (
          <span className="absolute -top-1 -left-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-slate-900 text-white text-[9px] sm:text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-md z-20">
            {activeChannels.length}
          </span>
        )}

        {/* Tooltip on hover */}
        <div className="hidden sm:group-hover:flex absolute right-full top-1/2 -translate-y-1/2 mr-2.5 items-center gap-1 px-2.5 py-1 rounded-xl bg-white/95 backdrop-blur-xl border border-white/90 shadow-md text-[11px] font-bold text-slate-800 whitespace-nowrap pointer-events-none">
          <span>{isOpen ? 'Thu gọn liên hệ' : 'Bấm để mở danh sách kênh liên hệ'}</span>
          <ChevronDown className="w-3.5 h-3.5 text-rose-600" />
        </div>
      </div>

      {/* 2. EXPANDED CHANNELS: EXPANDS DOWNWARDS BELOW MAIN TRIGGER */}
      <div
        className={`flex flex-col items-end gap-2 transition-all duration-300 overflow-hidden ${
          isOpen
            ? 'max-h-96 opacity-100 translate-y-0 scale-100 pointer-events-auto my-1'
            : 'max-h-0 opacity-0 -translate-y-2 scale-95 pointer-events-none'
        }`}
      >
        {expandedChannels.map((channel) => (
          <div
            key={channel.id}
            onMouseEnter={() => setHoveredChannelId(channel.id)}
            onMouseLeave={() => setHoveredChannelId(null)}
            className="flex items-center gap-2 group relative"
          >
            {/* Left Tooltip Pill */}
            <div
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/95 backdrop-blur-xl border border-white/90 shadow-md text-[11px] font-bold text-slate-800 transition-all duration-200 pointer-events-none whitespace-nowrap ${
                hoveredChannelId === channel.id
                  ? 'opacity-100 -translate-x-1'
                  : 'opacity-0 translate-x-2'
              }`}
            >
              <span>{channel.label}</span>
              {channel.badge && (
                <span className="text-[9px] bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded-full font-extrabold border border-rose-200">
                  {channel.badge}
                </span>
              )}
            </div>

            {/* Circular Channel Action Button */}
            <a
              href={channel.link}
              target="_blank"
              rel="noreferrer"
              className={`w-10 h-10 rounded-full bg-gradient-to-tr ${getChannelColorGradient(
                channel.type
              )} flex items-center justify-center shadow-md hover:shadow-lg hover:scale-110 active:scale-95 transition-all border border-white/50`}
              title={`${channel.label}: ${channel.value}`}
            >
              {renderChannelIcon(channel.type)}
            </a>
          </div>
        ))}
      </div>

      {/* 3. TWO SMALL BLOCKS ALWAYS VISIBLE OUTSIDE (PHÍA DƯỚI): SĐT & ZALO */}
      <div className="flex flex-col items-end gap-1.5 pt-1">
        {/* Khối 1: Số Điện Thoại Hotline */}
        <div
          onMouseEnter={() => setHoveredChannelId('pinned-hotline')}
          onMouseLeave={() => setHoveredChannelId(null)}
          className="flex items-center gap-2 group relative"
        >
          {/* Tooltip on hover */}
          <div
            className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/95 backdrop-blur-xl border border-white/90 shadow-md text-[11px] font-bold text-rose-700 transition-all duration-200 pointer-events-none whitespace-nowrap ${
              hoveredChannelId === 'pinned-hotline' ? 'opacity-100 -translate-x-1' : 'opacity-0 translate-x-2'
            }`}
          >
            <span>Gọi Hotline: {settings.hotline}</span>
            <span className="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded-full">24/7</span>
          </div>

          <a
            href={`tel:${cleanPhone}`}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-rose-600 to-red-600 text-white flex items-center justify-center shadow-md hover:shadow-lg hover:scale-110 active:scale-95 transition-all border border-white/60 group"
            title={`Hotline Đặt Hoa: ${settings.hotline}`}
          >
            <PhoneCall className="w-4 h-4 animate-pulse" />
          </a>
        </div>

        {/* Khối 2: Zalo Tư Vấn Nhanh */}
        <div
          onMouseEnter={() => setHoveredChannelId('pinned-zalo')}
          onMouseLeave={() => setHoveredChannelId(null)}
          className="flex items-center gap-2 group relative"
        >
          {/* Tooltip on hover */}
          <div
            className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/95 backdrop-blur-xl border border-white/90 shadow-md text-[11px] font-bold text-blue-700 transition-all duration-200 pointer-events-none whitespace-nowrap ${
              hoveredChannelId === 'pinned-zalo' ? 'opacity-100 -translate-x-1' : 'opacity-0 translate-x-2'
            }`}
          >
            <span>Chat Zalo: {settings.zalo}</span>
            <span className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded-full">Online</span>
          </div>

          <a
            href={`https://zalo.me/${cleanZalo}`}
            target="_blank"
            rel="noreferrer"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-[#0068FF] to-[#0046B8] text-white flex items-center justify-center shadow-md hover:shadow-lg hover:scale-110 active:scale-95 transition-all border border-white/60 group"
            title={`Chat Zalo: ${settings.zalo}`}
          >
            <span className="font-black text-[11px] tracking-tighter">Zalo</span>
          </a>
        </div>
      </div>
    </div>
  );
};
