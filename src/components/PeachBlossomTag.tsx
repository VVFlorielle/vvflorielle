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

  // Split words for optimal centered typographic layout in the flower core
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
    lg: isMultiWord ? 'text-[10.5px] sm:text-[12px] leading-[1.1]' : 'text-[13px] sm:text-[14px]'
  }[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none filter drop-shadow-[0_2.5px_4px_rgba(234,88,12,0.45)] hover:scale-105 active:scale-95 transition-all duration-200 ${sizeClasses} ${className}`}
      title={tag}
    >
      {/* Khung hình bông hoa đào 5 cánh nghệ thuật màu đỏ cam gradient */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradient màu đỏ cam hoa đào tươi tắn */}
          <linearGradient id="peachPetalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff5e36" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>

          {/* Gradient tâm nhụy hoa đào */}
          <radialGradient id="peachCoreGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffedd5" stopOpacity="0.3" />
            <stop offset="55%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#c2410c" />
          </radialGradient>
        </defs>

        {/* 5 Cánh hoa đào (Peach blossom petals) */}
        {[0, 72, 144, 216, 288].map((angle, idx) => (
          <g key={idx} transform={`rotate(${angle} 50 50)`}>
            {/* Cánh hoa xòe tròn có rãnh uốn lượn hình cánh hoa đào */}
            <path
              d="M 50,50 C 35,46 30,23 42,10 C 47,6 49,8 50,10 C 51,8 53,6 58,10 C 70,23 65,46 50,50 Z"
              fill="url(#peachPetalGrad)"
              stroke="#ffffff"
              strokeWidth="1.2"
              strokeOpacity="0.8"
            />
            {/* Gân cánh hoa mờ tinh tế */}
            <path
              d="M 50,42 Q 50,23 50,11"
              stroke="#ffedd5"
              strokeWidth="0.8"
              strokeOpacity="0.4"
              strokeLinecap="round"
            />
          </g>
        ))}

        {/* Vùng tâm hoa hình tròn ôm trọn nội dung chữ */}
        <circle cx="50" cy="50" r="24.5" fill="url(#peachCoreGrad)" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.85" />

        {/* Các chấm nhụy hoa đào màu vàng hoàng yến */}
        {[0, 72, 144, 216, 288].map((angle, idx) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <circle
              key={`stamen-${idx}`}
              cx={50 + 20 * Math.sin(rad)}
              cy={50 - 20 * Math.cos(rad)}
              r="1.4"
              fill="#fef08a"
              stroke="#ea580c"
              strokeWidth="0.4"
            />
          );
        })}
      </svg>

      {/* Nội dung chữ tag được căn chính giữa khung hoa đào */}
      <div className={`absolute inset-0 flex flex-col items-center justify-center text-white font-black tracking-tight text-center px-1 pointer-events-none drop-shadow-[0_1px_1.5px_rgba(0,0,0,0.6)] ${textClasses}`}>
        {isMultiWord ? (
          <>
            <span className="uppercase font-black text-white">{words[0]}</span>
            <span className="uppercase font-black text-amber-200">{words.slice(1).join(' ')}</span>
          </>
        ) : (
          <span className="uppercase font-black tracking-wider text-amber-100">{tag}</span>
        )}
      </div>
    </div>
  );
};
