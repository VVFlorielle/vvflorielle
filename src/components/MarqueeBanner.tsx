import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, Megaphone, Tag, ChevronRight } from 'lucide-react';
import { PopupType } from './InfoPopups';

interface MarqueeBannerProps {
  onOpenPopup?: (type: PopupType) => void;
}

export const MarqueeBanner: React.FC<MarqueeBannerProps> = ({ onOpenPopup }) => {
  const { marqueeAnnouncements } = useStore();

  const activeItems = marqueeAnnouncements.filter((item) => item.isEnabled);

  if (activeItems.length === 0) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 select-none transition-all duration-300">
      <div className="rounded-2xl md:rounded-[22px] bg-white/80 hover:bg-white/90 backdrop-blur-2xl border border-white/95 shadow-[0_12px_32px_-4px_rgba(15,23,42,0.08),inset_0_1.5px_1px_rgba(255,255,255,1)] px-3.5 py-2 flex items-center gap-2.5 sm:gap-3.5 overflow-hidden transition-all group">
        {/* Left Indicator Pill */}
        <div
          onClick={() => onOpenPopup && onOpenPopup('promotions')}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-[11px] font-bold shadow-sm shrink-0 cursor-pointer hover:scale-105 transition-transform"
          title="Xem chi tiết các chương trình khuyến mãi"
        >
          <Megaphone className="w-3.5 h-3.5 animate-pulse" />
          <span className="hidden sm:inline">ƯU ĐÃI & TIN NỔI BẬT</span>
          <span className="sm:hidden">TIN MỚI</span>
        </div>

        {/* Marquee Ticker Track */}
        <div className="relative flex-1 overflow-hidden whitespace-nowrap mask-marquee">
          <div className="inline-flex items-center gap-8 animate-marquee group-hover:[animation-play-state:paused]">
            {activeItems.concat(activeItems).map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                onClick={() => {
                  if (item.text.includes('FREESHIP30K') || item.text.includes('Voucher')) {
                    if (onOpenPopup) onOpenPopup('voucher');
                  } else if (onOpenPopup) {
                    onOpenPopup('promotions');
                  }
                }}
                className="inline-flex items-center gap-2 text-xs text-slate-700 font-medium cursor-pointer hover:text-emerald-700 transition-colors"
              >
                {item.tag && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {item.tag}
                  </span>
                )}
                <span>{item.text}</span>
                <span className="text-emerald-400 font-bold">•</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Click Action */}
        {onOpenPopup && (
          <button
            onClick={() => onOpenPopup('promotions')}
            className="hidden md:flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 shrink-0 hover:underline"
          >
            <span>Chi tiết</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
