import React from 'react';

export interface PeachBlossomTagProps {
  tag: string;
  size?: 'sm' | 'md' | 'lg';
  flowerCount?: 1 | 2 | 3 | 4 | 'auto';
  className?: string;
}

const SINGLE_FLOWER_PATH =
  'M 32.95,26.54 C 35.24,23.37 32.98,5.65 50.00,3.50 C 67.02,5.65 64.76,23.37 67.05,26.54 C 70.77,27.73 86.91,20.11 94.22,35.63 C 97.43,52.49 79.89,55.81 77.58,58.96 C 77.60,62.87 89.84,75.87 77.33,87.62 C 62.29,95.88 53.71,80.22 50.00,79.00 C 46.29,80.22 37.71,95.88 22.67,87.62 C 10.16,75.87 22.40,62.87 22.42,58.96 C 20.11,55.81 2.57,52.49 5.78,35.63 C 13.09,20.11 29.23,27.73 32.95,26.54 Z';

export const PeachBlossomTag: React.FC<PeachBlossomTagProps> = ({
  tag,
  size = 'md',
  flowerCount = 'auto',
  className = ''
}) => {
  const cleanTag = (tag || '').trim();
  if (!cleanTag) return null;

  // Determine number of conjoined flowers (1, 2, 3, or 4)
  // 1 flower: short words (<= 4 chars, e.g. "MỚI", "HOT", "SALE")
  // 2 flowers: 5-8 chars (e.g. "MẸO HAY", "CẨM NANG")
  // 3 flowers: 9-13 chars (e.g. "Mẹo Cắm Hoa", "Ý Nghĩa Hoa")
  // 4 flowers: >= 14 chars (e.g. "Phong Thủy & Ý Nghĩa", "Cẩm Nang Tình Yêu")
  const autoCount = cleanTag.length <= 4 ? 1 : cleanTag.length <= 8 ? 2 : cleanTag.length <= 13 ? 3 : 4;
  const count = flowerCount && flowerCount !== 'auto' ? flowerCount : autoCount;

  const step = 58;
  const totalW = 100 + (count - 1) * step;

  // Dimensions based on size
  const height = size === 'sm' ? 26 : size === 'lg' ? 40 : 32;
  const width = Math.round(height * (totalW / 100));

  // Compute flower positions
  const positions: number[] = [];
  for (let i = 0; i < count; i++) {
    positions.push(i * step);
  }

  // Text size classes
  const getTextSizeClass = () => {
    if (count === 1) {
      return size === 'sm' ? 'text-[9px] sm:text-[9.5px]' : size === 'lg' ? 'text-[13px] sm:text-[14px]' : 'text-[10px] sm:text-[11px]';
    }
    if (count === 2) {
      return size === 'sm' ? 'text-[8px] sm:text-[8.5px]' : size === 'lg' ? 'text-[12px] sm:text-[13px]' : 'text-[9.5px] sm:text-[10px]';
    }
    if (count === 3) {
      return size === 'sm' ? 'text-[7.5px] sm:text-[8px]' : size === 'lg' ? 'text-[11px] sm:text-[11.5px]' : 'text-[9px] sm:text-[9.5px]';
    }
    return size === 'sm' ? 'text-[7px] sm:text-[7.5px]' : size === 'lg' ? 'text-[10px] sm:text-[10.5px]' : 'text-[8px] sm:text-[8.5px]';
  };

  return (
    <div
      style={{ width: `${width}px`, height: `${height}px` }}
      className={`relative inline-flex items-center justify-center select-none filter drop-shadow-[0_2.5px_4px_rgba(244,63,94,0.45)] hover:scale-105 active:scale-95 transition-all duration-200 shrink-0 ${className}`}
      title={cleanTag}
    >
      {/* Khung hoa đào gộp 1, 2, 3, 4 hoa thành 1 khối liền mạch */}
      <svg
        viewBox={`0 0 ${totalW} 100`}
        className="w-full h-full block"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradient màu hồng hoa đào chuẩn ảnh mẫu */}
          <linearGradient id="peachBlossomPinkGrad" x1="10%" y1="5%" x2="90%" y2="95%">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="50%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#e11d48" />
          </linearGradient>
        </defs>

        {/* 1. Lớp viền trắng bên ngoài chu vi khung hoa (stroke="#ffffff") */}
        <g stroke="#ffffff" strokeWidth="4.5" fill="#ffffff" strokeLinejoin="round" strokeLinecap="round">
          {positions.map((x, idx) => (
            <path key={idx} d={SINGLE_FLOWER_PATH} transform={`translate(${x}, 0)`} />
          ))}
        </g>

        {/* 2. Lớp thân nền màu hồng hoa đào phủ lên trên (che hoàn toàn nét vẽ bên trong ruột) */}
        <g fill="url(#peachBlossomPinkGrad)">
          {positions.map((x, idx) => (
            <path key={idx} d={SINGLE_FLOWER_PATH} transform={`translate(${x}, 0)`} />
          ))}
        </g>

        {/* 3. Đường gân cánh hoa tinh tế tại các điểm giao thoa giữa các bông hoa con */}
        {count > 1 &&
          positions.slice(1).map((x, idx) => (
            <path
              key={`seam-${idx}`}
              d={`M ${x + 23},32 C ${x + 20},48 ${x + 20},55 ${x + 23},70`}
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
            />
          ))}
      </svg>

      {/* Vị trí chữ đặt trực tiếp trên nền hoa đào màu hồng, chữ trắng nổi bật */}
      <div className="absolute inset-0 flex items-center justify-center px-1.5 pointer-events-none">
        <span
          className={`font-black uppercase tracking-wider text-white text-center drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.65)] whitespace-nowrap leading-none ${getTextSizeClass()}`}
        >
          {cleanTag}
        </span>
      </div>
    </div>
  );
};
