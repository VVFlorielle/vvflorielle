import React from 'react';

interface PeachBlossomTagProps {
  tag: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PeachBlossomTag: React.FC<PeachBlossomTagProps> = ({
  tag,
  size = 'md',
  className = ''
}) => {
  if (!tag) return null;

  // Split words for optimal centered typographic layout in the flower
  const words = tag.trim().split(/\s+/);
  const isMultiWord = words.length > 1;

  // Sizing definitions
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-11 h-11 sm:w-12 sm:h-12',
    lg: 'w-14 h-14 sm:w-16 sm:h-16'
  }[size];

  const textClasses = {
    sm: isMultiWord ? 'text-[7.5px] leading-[1.0]' : 'text-[9px]',
    md: isMultiWord ? 'text-[8.5px] sm:text-[9.5px] leading-[1.05]' : 'text-[10px] sm:text-[11px]',
    lg: isMultiWord ? 'text-[11px] sm:text-[12.5px] leading-[1.1]' : 'text-[13px] sm:text-[14px]'
  }[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none filter drop-shadow-[0_2.5px_4px_rgba(244,63,94,0.45)] hover:scale-105 active:scale-95 transition-all duration-200 ${sizeClasses} ${className}`}
      title={tag}
    >
      {/* Khung bông hoa đào 5 cánh bo tròn tự nhiên theo ảnh mẫu, chỉ có viền ngoài và nền màu hồng */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradient màu hồng hoa đào tự nhiên chuẩn ảnh mẫu */}
          <linearGradient id="peachBlossomPinkGrad" x1="10%" y1="5%" x2="90%" y2="95%">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="50%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#e11d48" />
          </linearGradient>
        </defs>

        {/* Khung bông hoa đào 5 cánh: Chỉ có viền bo tròn bên ngoài và nền bên trong để chữ, không có vòng tròn nhụy */}
        <path
          d="M 32.95,26.54 C 35.24,23.37 32.98,5.65 50.00,3.50 C 67.02,5.65 64.76,23.37 67.05,26.54 C 70.77,27.73 86.91,20.11 94.22,35.63 C 97.43,52.49 79.89,55.81 77.58,58.96 C 77.60,62.87 89.84,75.87 77.33,87.62 C 62.29,95.88 53.71,80.22 50.00,79.00 C 46.29,80.22 37.71,95.88 22.67,87.62 C 10.16,75.87 22.40,62.87 22.42,58.96 C 20.11,55.81 2.57,52.49 5.78,35.63 C 13.09,20.11 29.23,27.73 32.95,26.54 Z"
          fill="url(#peachBlossomPinkGrad)"
          stroke="#ffffff"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
      </svg>

      {/* Vị trí chữ đặt trực tiếp trên nền hoa đào màu hồng, chữ trắng nổi bật */}
      <div className={`absolute inset-0 flex flex-col items-center justify-center text-white font-black tracking-tight text-center px-1 pointer-events-none drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.65)] ${textClasses}`}>
        {isMultiWord ? (
          <>
            <span className="uppercase font-black text-white">{words[0]}</span>
            <span className="uppercase font-black text-amber-100">{words.slice(1).join(' ')}</span>
          </>
        ) : (
          <span className="uppercase font-black tracking-wider text-white">{tag}</span>
        )}
      </div>
    </div>
  );
};
