import React from 'react';

export interface PeachBlossomTagProps {
  tag: string;
  size?: 'sm' | 'md' | 'lg';
  flowerCount?: 1 | 2 | 3 | 4 | 'auto';
  theme?: 'pink' | 'rose' | 'amber' | 'emerald' | 'teal';
  iconPosition?: 'left' | 'right';
  className?: string;
}

// Đường vẽ bông hoa đào 5 cánh nghệ thuật đơn tinh xảo với nhụy hoa vàng
const PEACH_FLOWER_ICON = (
  <svg
    viewBox="0 0 100 100"
    className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 drop-shadow-xs"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M 50,22 C 53,12 62,6 71,11 C 79,16 79,27 72,34 C 82,34 91,41 90,51 C 89,60 79,66 71,63 C 74,73 68,83 58,85 C 49,87 43,79 43,71 C 36,78 26,79 19,72 C 12,65 14,54 22,49 C 14,44 13,33 20,26 C 27,19 38,22 43,30 C 44,24 47,22 50,22 Z" />
    <circle cx="50" cy="50" r="7" fill="#fef08a" />
  </svg>
);

export const PeachBlossomTag: React.FC<PeachBlossomTagProps> = ({
  tag,
  size = 'md',
  theme,
  iconPosition = 'left',
  className = ''
}) => {
  const cleanTag = (tag || '').trim();
  if (!cleanTag) return null;

  // Tự động nhận diện theme màu sắc nếu không truyền
  let effectiveTheme = theme;
  if (!effectiveTheme) {
    const lower = cleanTag.toLowerCase();
    if (lower.includes('sẵn') || lower.includes('san') || lower.includes('giao ngay')) {
      effectiveTheme = 'emerald';
    } else if (lower.includes('chờ') || lower.includes('cho') || lower.includes('cắm') || lower.includes('cam')) {
      effectiveTheme = 'rose';
    } else {
      effectiveTheme = 'pink';
    }
  }

  // Bảng phối màu liền khối cao cấp (viền trắng sắc nét, bóng kính sang trọng)
  const themeClasses = {
    pink: 'bg-gradient-to-r from-pink-500 via-rose-500 to-rose-600 text-white shadow-rose-500/25 border-white/80',
    rose: 'bg-gradient-to-r from-rose-500 via-orange-500 to-rose-600 text-white shadow-rose-500/25 border-white/80',
    amber: 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-orange-500/25 border-white/80',
    emerald: 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white shadow-emerald-500/25 border-white/80',
    teal: 'bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-600 text-white shadow-teal-500/25 border-white/80'
  }[effectiveTheme] || 'bg-gradient-to-r from-pink-500 via-rose-500 to-rose-600 text-white shadow-rose-500/25 border-white/80';

  // Kích thước chuẩn tỉ lệ
  const sizeClasses = {
    sm: 'h-[22px] px-2 text-[9.5px] sm:text-[10px] gap-1',
    md: 'h-[26px] px-2.5 text-[10.5px] sm:text-[11px] gap-1.5',
    lg: 'h-[32px] px-3.5 text-xs sm:text-[12.5px] gap-2'
  }[size];

  return (
    <div
      className={`inline-flex items-center justify-center font-black uppercase tracking-wider rounded-full border shadow-sm select-none transition-all duration-200 shrink-0 hover:scale-105 active:scale-95 leading-none whitespace-nowrap backdrop-blur-xs ${themeClasses} ${sizeClasses} ${className}`}
      title={cleanTag}
    >
      {iconPosition === 'left' && PEACH_FLOWER_ICON}
      <span className="drop-shadow-[0_1px_1.5px_rgba(0,0,0,0.4)] pt-[1px]">{cleanTag}</span>
      {iconPosition === 'right' && PEACH_FLOWER_ICON}
    </div>
  );
};
