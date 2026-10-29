import React from 'react';
import { CategoryId } from '../types';

interface FlowerGraphicProps {
  categoryId?: CategoryId;
  productName?: string;
  className?: string;
  accentColor?: string;
}

export const FlowerGraphic: React.FC<FlowerGraphicProps> = ({
  categoryId = 'sinh-nhat',
  productName = '',
  className = '',
  accentColor
}) => {
  // Select illustration style based on category or name
  if (categoryId === 'lan-ho-diep' || productName.toLowerCase().includes('lan')) {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden rounded-xl ${className}`}
        style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', minHeight: '220px' }}
      >
        <svg viewBox="0 0 240 240" className="w-full h-full max-h-[220px] p-3" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Ceramic Pot */}
          <path d="M75 195 L90 225 H150 L165 195 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />
          <path d="M70 190 H170 V197 H70 Z" rx="2" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
          
          {/* Arching Stems */}
          <path d="M120 190 Q115 140 100 85 Q90 50 140 45" stroke="#15803d" strokeWidth="4" strokeLinecap="round" />
          <path d="M120 190 Q130 145 155 100 Q170 70 150 55" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" />
          
          {/* Support Sticks */}
          <line x1="120" y1="190" x2="110" y2="70" stroke="#a16207" strokeWidth="2" strokeDasharray="4 2" opacity="0.6" />
          <line x1="120" y1="190" x2="145" y2="80" stroke="#a16207" strokeWidth="2" strokeDasharray="4 2" opacity="0.6" />
          
          {/* Orchid Flowers along stem 1 */}
          <g transform="translate(100, 85)">
            <ellipse cx="0" cy="0" rx="14" ry="10" fill="#ffffff" stroke="#e2e8f0" />
            <ellipse cx="-10" cy="-6" rx="9" ry="12" fill="#ffffff" stroke="#e2e8f0" />
            <ellipse cx="10" cy="-6" rx="9" ry="12" fill="#ffffff" stroke="#e2e8f0" />
            <ellipse cx="-7" cy="8" rx="8" ry="10" fill="#ffffff" stroke="#e2e8f0" />
            <ellipse cx="7" cy="8" rx="8" ry="10" fill="#ffffff" stroke="#e2e8f0" />
            <circle cx="0" cy="1" r="5" fill="#fef08a" />
            <circle cx="0" cy="1" r="2.5" fill="#dc2626" />
          </g>

          <g transform="translate(125, 58)">
            <ellipse cx="0" cy="0" rx="15" ry="11" fill="#ffffff" stroke="#e2e8f0" />
            <ellipse cx="-11" cy="-7" rx="10" ry="13" fill="#ffffff" stroke="#e2e8f0" />
            <ellipse cx="11" cy="-7" rx="10" ry="13" fill="#ffffff" stroke="#e2e8f0" />
            <ellipse cx="-8" cy="9" rx="9" ry="11" fill="#ffffff" stroke="#e2e8f0" />
            <ellipse cx="8" cy="9" rx="9" ry="11" fill="#ffffff" stroke="#e2e8f0" />
            <circle cx="0" cy="1" r="5.5" fill="#fef08a" />
            <circle cx="0" cy="1" r="3" fill="#dc2626" />
          </g>

          {/* Orchid Flowers along stem 2 */}
          <g transform="translate(155, 95)">
            <ellipse cx="0" cy="0" rx="13" ry="9" fill="#ffffff" stroke="#e2e8f0" />
            <ellipse cx="-9" cy="-5" rx="8" ry="11" fill="#ffffff" stroke="#e2e8f0" />
            <ellipse cx="9" cy="-5" rx="8" ry="11" fill="#ffffff" stroke="#e2e8f0" />
            <ellipse cx="-6" cy="7" rx="7" ry="9" fill="#ffffff" stroke="#e2e8f0" />
            <ellipse cx="6" cy="7" rx="7" ry="9" fill="#ffffff" stroke="#e2e8f0" />
            <circle cx="0" cy="1" r="4.5" fill="#fef08a" />
            <circle cx="0" cy="1" r="2.2" fill="#ea580c" />
          </g>

          {/* Golden Ribbon Bow on pot */}
          <path d="M120 190 Q110 180 100 188 Q115 195 120 190 Z" fill="#d97706" />
          <path d="M120 190 Q130 180 140 188 Q125 195 120 190 Z" fill="#d97706" />
          <circle cx="120" cy="190" r="3" fill="#b45309" />
        </svg>
      </div>
    );
  }

  if (categoryId === 'khai-truong') {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden rounded-xl ${className}`}
        style={{ background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', minHeight: '220px' }}
      >
        <svg viewBox="0 0 240 240" className="w-full h-full max-h-[220px] p-3" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Wooden Easel / Stand */}
          <line x1="120" y1="35" x2="70" y2="230" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
          <line x1="120" y1="35" x2="170" y2="230" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
          <line x1="80" y1="165" x2="160" y2="165" stroke="#92400e" strokeWidth="3" />
          
          {/* Top Lush Floral Mass (Sunflowers & Red Anthurium) */}
          <circle cx="120" cy="85" r="45" fill="#15803d" opacity="0.35" />
          
          {/* Foliage leaves */}
          <path d="M85 75 Q65 60 75 45 Q95 55 85 75 Z" fill="#16a34a" />
          <path d="M155 75 Q175 60 165 45 Q145 55 155 75 Z" fill="#16a34a" />
          <path d="M120 50 Q120 30 135 25 Q135 45 120 50 Z" fill="#22c55e" />

          {/* Central Sunflower 1 */}
          <g transform="translate(120, 80)">
            {/* Petals */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <ellipse
                key={deg}
                cx="0"
                cy="-20"
                rx="6"
                ry="12"
                fill="#f59e0b"
                transform={`rotate(${deg})`}
              />
            ))}
            <circle cx="0" cy="0" r="14" fill="#78350f" />
            <circle cx="0" cy="0" r="11" fill="#451a03" />
          </g>

          {/* Red Anthurium on sides */}
          <path d="M92 95 Q80 115 72 105 Q70 85 92 95 Z" fill="#dc2626" />
          <line x1="83" y1="95" x2="77" y2="105" stroke="#fef08a" strokeWidth="2.5" strokeLinecap="round" />

          <path d="M148 95 Q160 115 168 105 Q170 85 148 95 Z" fill="#dc2626" />
          <line x1="157" y1="95" x2="163" y2="105" stroke="#fef08a" strokeWidth="2.5" strokeLinecap="round" />

          {/* Red Celebratory Banner */}
          <g transform="translate(65, 125)">
            <rect x="0" y="0" width="110" height="24" rx="4" fill="#b91c1c" />
            <rect x="2" y="2" width="106" height="20" rx="3" stroke="#fef08a" strokeWidth="1" fill="none" />
            <text x="55" y="16" fill="#fef08a" fontSize="9" fontWeight="bold" textAnchor="middle" letterSpacing="1">
              CHÚC MỪNG KHAI TRƯƠNG
            </text>
          </g>

          {/* Cascading Golden Ribbon */}
          <path d="M100 150 Q105 180 95 210" stroke="#f59e0b" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M140 150 Q135 180 145 210" stroke="#f59e0b" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  if (categoryId === 'tinh-yeu') {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden rounded-xl ${className}`}
        style={{ background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)', minHeight: '220px' }}
      >
        <svg viewBox="0 0 240 240" className="w-full h-full max-h-[220px] p-3" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Bouquet Paper Cone Wrapper (Black & Rose Gold Korean style) */}
          <path d="M120 225 L65 130 Q120 150 175 130 Z" fill="#1e293b" />
          <path d="M120 225 L75 135 Q120 155 165 135 Z" fill="#334155" opacity="0.6" />
          <path d="M55 125 L120 220 L185 125 Q120 140 55 125 Z" fill="rgba(255, 255, 255, 0.4)" />

          {/* Green Eucalyptus Sprigs */}
          <path d="M80 115 Q60 85 85 70" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="68" cy="85" r="5" fill="#10b981" opacity="0.8" />
          <circle cx="80" cy="73" r="5" fill="#10b981" opacity="0.8" />

          <path d="M160 115 Q180 85 155 70" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="172" cy="85" r="5" fill="#10b981" opacity="0.8" />
          <circle cx="160" cy="73" r="5" fill="#10b981" opacity="0.8" />

          {/* Baby's breath tiny white clusters */}
          {[
            [75, 95], [85, 80], [155, 80], [165, 95], [120, 60], [100, 70], [140, 70]
          ].map(([x, y], idx) => (
            <circle key={idx} cx={x} cy={y} r="3" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.5" />
          ))}

          {/* Big Crimson Ecuador Roses */}
          {/* Rose Center */}
          <g transform="translate(120, 95)">
            <circle cx="0" cy="0" r="22" fill="#be123c" />
            <path d="M-15 0 Q-10 -15 0 -18 Q10 -15 15 0 Q10 15 0 18 Q-10 15 -15 0 Z" fill="#e11d48" />
            <path d="M-8 -2 Q-4 -9 0 -10 Q4 -9 8 -2 Q4 7 0 8 Q-4 7 -8 -2 Z" fill="#9f1239" />
            <circle cx="0" cy="0" r="4" fill="#881337" />
          </g>

          {/* Rose Left */}
          <g transform="translate(92, 110)">
            <circle cx="0" cy="0" r="18" fill="#e11d48" />
            <path d="M-11 0 Q-7 -11 0 -13 Q7 -11 11 0 Q7 11 0 13 Q-7 11 -11 0 Z" fill="#f43f5e" />
            <circle cx="0" cy="0" r="4" fill="#9f1239" />
          </g>

          {/* Rose Right */}
          <g transform="translate(148, 110)">
            <circle cx="0" cy="0" r="18" fill="#e11d48" />
            <path d="M-11 0 Q-7 -11 0 -13 Q7 -11 11 0 Q7 11 0 13 Q-7 11 -11 0 Z" fill="#f43f5e" />
            <circle cx="0" cy="0" r="4" fill="#9f1239" />
          </g>

          {/* Red Satin Ribbon Tie */}
          <g transform="translate(120, 195)">
            <circle cx="0" cy="0" r="4" fill="#9f1239" />
            <path d="M0 0 Q-15 -10 -22 2 Q-10 10 0 0 Z" fill="#e11d48" />
            <path d="M0 0 Q15 -10 22 2 Q10 10 0 0 Z" fill="#e11d48" />
            <path d="M0 0 Q-5 18 -12 30" stroke="#be123c" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M0 0 Q5 18 10 30" stroke="#be123c" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        </svg>
      </div>
    );
  }

  // Default/Sinh nhật/Chúc mừng/Chia buồn (Pastel Garden Bouquet / Basket)
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-xl ${className}`}
      style={{
        background: accentColor
          ? `linear-gradient(135deg, ${accentColor}15 0%, ${accentColor}30 100%)`
          : 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
        minHeight: '220px'
      }}
    >
      <svg viewBox="0 0 240 240" className="w-full h-full max-h-[220px] p-3" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Flower Basket / Pot */}
        <path d="M80 150 L95 215 H145 L160 150 Z" fill="#fde68a" stroke="#d97706" strokeWidth="2" />
        {/* Wicker texture */}
        <line x1="85" y1="170" x2="155" y2="170" stroke="#b45309" strokeWidth="1.5" opacity="0.5" />
        <line x1="90" y1="190" x2="150" y2="190" stroke="#b45309" strokeWidth="1.5" opacity="0.5" />
        <line x1="120" y1="150" x2="120" y2="215" stroke="#b45309" strokeWidth="1.5" opacity="0.5" />

        {/* Basket Handle */}
        <path d="M80 150 Q120 75 160 150" stroke="#b45309" strokeWidth="3.5" fill="none" />

        {/* Lush Green Foliage */}
        <circle cx="120" cy="120" r="42" fill="#059669" opacity="0.3" />
        <path d="M70 135 Q50 120 60 105 Q80 115 70 135 Z" fill="#10b981" />
        <path d="M170 135 Q190 120 180 105 Q160 115 170 135 Z" fill="#10b981" />

        {/* Hydrangea Bloom (Pastel Blue/Purple) */}
        <g transform="translate(95, 110)">
          <circle cx="0" cy="0" r="16" fill="#818cf8" opacity="0.4" />
          <circle cx="-6" cy="-4" r="5" fill="#a5b4fc" />
          <circle cx="6" cy="-4" r="5" fill="#a5b4fc" />
          <circle cx="0" cy="6" r="5" fill="#c7d2fe" />
          <circle cx="0" cy="0" r="2.5" fill="#ffffff" />
        </g>

        {/* Central Peony / Rose (Pastel Pink) */}
        <g transform="translate(125, 105)">
          <circle cx="0" cy="0" r="20" fill="#f472b6" />
          <circle cx="0" cy="0" r="14" fill="#fb7185" />
          <circle cx="0" cy="0" r="8" fill="#fda4af" />
          <circle cx="0" cy="0" r="3" fill="#ffffff" />
        </g>

        {/* Yellow Daisy / Sunflower accent */}
        <g transform="translate(150, 125)">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <ellipse
              key={deg}
              cx="0"
              cy="-10"
              rx="3"
              ry="7"
              fill="#fbbf24"
              transform={`rotate(${deg})`}
            />
          ))}
          <circle cx="0" cy="0" r="5" fill="#78350f" />
        </g>

        {/* Ribbon Bow on Basket */}
        <g transform="translate(120, 155)">
          <circle cx="0" cy="0" r="3.5" fill="#047857" />
          <path d="M0 0 Q-12 -8 -16 2 Q-8 8 0 0 Z" fill="#059669" />
          <path d="M0 0 Q12 -8 16 2 Q8 8 0 0 Z" fill="#059669" />
          <path d="M0 0 Q-4 12 -8 20" stroke="#059669" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M0 0 Q4 12 8 20" stroke="#059669" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};
