import React, { useState } from 'react';
import { Sparkles, Clock, CheckCircle2, Volume2, VolumeX, Bell } from 'lucide-react';
import { isOrderChimeEnabled, setOrderChimeEnabled, testOrderChimeSound } from '../../utils/audioNotification';

export interface ManagementStatCardItem {
  id: string;
  title: string;
  value: string | number;
  subtext: string;
  icon: React.ReactNode;
  color: 'amber' | 'emerald' | 'sky' | 'purple';
  onClick?: () => void;
  isActive?: boolean;
}

interface ManagementOverviewHeroProps {
  tag: string;
  tagIcon?: React.ReactNode;
  title?: string;
  subtitle?: string;
  statusBadge?: string;
  stats: ManagementStatCardItem[];
}

export const ManagementOverviewHero: React.FC<ManagementOverviewHeroProps> = ({
  tag,
  tagIcon,
  title,
  subtitle,
  statusBadge = 'Hệ thống vận hành ổn định',
  stats
}) => {
  const [chimeOn, setChimeOn] = useState<boolean>(() => isOrderChimeEnabled());

  const handleToggleChime = () => {
    const next = !chimeOn;
    setChimeOn(next);
    setOrderChimeEnabled(next);
    if (next) {
      testOrderChimeSound();
    }
  };

  const handleTestChime = (e: React.MouseEvent) => {
    e.stopPropagation();
    testOrderChimeSound();
  };

  const getColorClasses = (color: 'amber' | 'emerald' | 'sky' | 'purple', isActive?: boolean) => {
    switch (color) {
      case 'amber':
        return {
          card: isActive
            ? 'bg-amber-100/90 border-amber-400 ring-2 ring-amber-400/40 shadow-sm'
            : 'bg-amber-50/70 border-amber-200/80 hover:bg-amber-100/60 shadow-2xs',
          title: 'text-amber-900',
          value: 'text-amber-800',
          subtext: 'text-amber-700/90',
          iconWrap: 'text-amber-700 bg-amber-100/80 border-amber-200'
        };
      case 'emerald':
        return {
          card: isActive
            ? 'bg-emerald-100/90 border-emerald-400 ring-2 ring-emerald-400/40 shadow-sm'
            : 'bg-emerald-50/70 border-emerald-200/80 hover:bg-emerald-100/60 shadow-2xs',
          title: 'text-emerald-900',
          value: 'text-emerald-800',
          subtext: 'text-emerald-700/90',
          iconWrap: 'text-emerald-700 bg-emerald-100/80 border-emerald-200'
        };
      case 'sky':
        return {
          card: isActive
            ? 'bg-sky-100/90 border-sky-400 ring-2 ring-sky-400/40 shadow-sm'
            : 'bg-sky-50/70 border-sky-200/80 hover:bg-sky-100/60 shadow-2xs',
          title: 'text-sky-900',
          value: 'text-sky-800',
          subtext: 'text-sky-700/90',
          iconWrap: 'text-sky-700 bg-sky-100/80 border-sky-200'
        };
      case 'purple':
      default:
        return {
          card: isActive
            ? 'bg-purple-100/90 border-purple-400 ring-2 ring-purple-400/40 shadow-sm'
            : 'bg-purple-50/70 border-purple-200/80 hover:bg-purple-100/60 shadow-2xs',
          title: 'text-purple-900',
          value: 'text-purple-800',
          subtext: 'text-purple-700/90',
          iconWrap: 'text-purple-700 bg-purple-100/80 border-purple-200'
        };
    }
  };

  return (
    <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-emerald-50/90 via-teal-50/50 to-white/95 border border-emerald-200/80 shadow-sm relative overflow-hidden select-none">
      {/* Soft background petal glow */}
      <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar Row: Tag Pill on Left & Sound Toggle + Status Badge on Right */}
      <div className="relative z-10 flex flex-row items-center justify-between gap-2 sm:gap-3">
        <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-300/90 text-emerald-900 text-xs sm:text-[13px] font-bold shadow-2xs">
          {tagIcon}
          <span>{tag}</span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Nút Bật/Tắt & Thử Chuông Báo Đơn Mới (Web Audio API) */}
          <div className="inline-flex items-center gap-1 bg-white/95 border border-emerald-200/90 rounded-full px-2 sm:px-2.5 py-1 text-xs text-emerald-900 shadow-2xs">
            <button
              type="button"
              onClick={handleToggleChime}
              className="flex items-center gap-1 font-semibold hover:text-emerald-700 transition-colors cursor-pointer"
              title={chimeOn ? 'Đang bật chuông đơn mới - Bấm để tắt' : 'Đang tắt chuông đơn - Bấm để bật'}
            >
              {chimeOn ? <Volume2 className="w-3.5 h-3.5 text-emerald-600" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
              <span className="text-[11px] sm:text-xs">{chimeOn ? 'Chuông: Bật' : 'Chuông: Tắt'}</span>
            </button>
            <button
              type="button"
              onClick={handleTestChime}
              className="p-1 rounded-full hover:bg-emerald-50 text-emerald-700 transition-colors cursor-pointer"
              title="Nghe thử âm thanh chuông báo"
            >
              <Bell className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
          </div>

          {statusBadge && (
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 border border-emerald-200 text-xs text-emerald-900 shadow-2xs font-semibold shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{statusBadge}</span>
            </span>
          )}
        </div>
      </div>

      {/* 4 Quick Stat Counters (Bright, Clean, Elegant Glass Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-5">
        {stats.map((stat) => {
          const classes = getColorClasses(stat.color, stat.isActive);
          return (
            <div
              key={stat.id}
              onClick={stat.onClick}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${classes.card} ${
                stat.onClick ? 'cursor-pointer hover:scale-[1.01]' : ''
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <span className={classes.title}>{stat.title}</span>
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center border ${classes.iconWrap}`}>
                  {stat.icon}
                </div>
              </div>
              <div className={`text-2xl sm:text-3xl font-black mt-1.5 truncate ${classes.value}`}>
                {stat.value}
              </div>
              <div className={`text-[11px] font-medium mt-1 ${classes.subtext}`}>
                {stat.subtext}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
