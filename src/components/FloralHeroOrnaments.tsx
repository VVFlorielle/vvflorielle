import React from 'react';

/**
 * Botanical SVGs (Roses, Cherry Blossoms, Peonies, Orchids, Leaves & Petals)
 * Pure code-based botanical art with smooth gradients, shadows, and delicate contours.
 */

export const FloralCornerTopLeft: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 200 200"
    className={`pointer-events-none select-none ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      {/* Rose Gradients */}
      <radialGradient id="tlRoseOuter" cx="40%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#ffe4e6" />
        <stop offset="45%" stopColor="#fda4af" />
        <stop offset="85%" stopColor="#f43f5e" />
        <stop offset="100%" stopColor="#e11d48" />
      </radialGradient>
      <radialGradient id="tlRoseInner" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#fff1f2" />
        <stop offset="50%" stopColor="#fb7185" />
        <stop offset="100%" stopColor="#be123c" />
      </radialGradient>
      {/* Secondary Flower (Peach Blossom) */}
      <radialGradient id="tlPeachBlossom" cx="45%" cy="45%" r="55%">
        <stop offset="0%" stopColor="#fff7ed" />
        <stop offset="55%" stopColor="#fed7aa" />
        <stop offset="90%" stopColor="#fb923c" />
        <stop offset="100%" stopColor="#ea580c" />
      </radialGradient>
      {/* Leaves Gradients */}
      <linearGradient id="tlLeafGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6ee7b7" />
        <stop offset="60%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
      <linearGradient id="tlLeafGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a7f3d0" />
        <stop offset="65%" stopColor="#059669" />
        <stop offset="100%" stopColor="#065f46" />
      </linearGradient>
      <filter id="tlGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#f43f5e" floodOpacity="0.25" />
      </filter>
      <filter id="tlLeafShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#047857" floodOpacity="0.2" />
      </filter>
    </defs>

    {/* Background Leaf Sprays & Stems */}
    <g filter="url(#tlLeafShadow)">
      {/* Main Arching Stem */}
      <path
        d="M10 10 Q 55 25 110 50 Q 155 75 180 125"
        stroke="#065f46"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.85"
      />
      {/* Secondary Tendril */}
      <path
        d="M25 15 Q 40 80 75 135"
        stroke="#059669"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.75"
      />

      {/* Eucalyptus Leaf 1 (Top) */}
      <path
        d="M50 20 C 65 5 95 10 90 32 C 85 45 60 40 50 20 Z"
        fill="url(#tlLeafGrad1)"
        opacity="0.9"
      />
      <path d="M53 22 Q 72 26 87 31" stroke="#a7f3d0" strokeWidth="0.8" opacity="0.8" />

      {/* Eucalyptus Leaf 2 */}
      <path
        d="M95 42 C 120 30 145 42 140 65 C 132 80 108 70 95 42 Z"
        fill="url(#tlLeafGrad2)"
        opacity="0.92"
      />
      <path d="M98 44 Q 118 52 137 62" stroke="#a7f3d0" strokeWidth="0.8" opacity="0.8" />

      {/* Eucalyptus Leaf 3 (Outer edge) */}
      <path
        d="M135 70 C 165 65 185 85 175 105 C 162 118 140 100 135 70 Z"
        fill="url(#tlLeafGrad1)"
        opacity="0.85"
      />

      {/* Lower Leaf (Side) */}
      <path
        d="M32 55 C 20 85 35 115 55 110 C 70 102 60 75 32 55 Z"
        fill="url(#tlLeafGrad2)"
        opacity="0.88"
      />
    </g>

    {/* Secondary Flower: Delicate Peach Blossom (Top Right) */}
    <g transform="translate(125, 45) scale(0.65)" filter="url(#tlGlow)">
      {/* 5 Petals */}
      <path d="M0 -22 C 10 -35 25 -25 15 -10 C 10 -2 0 0 0 0 Z" fill="url(#tlPeachBlossom)" />
      <path d="M22 -5 C 35 5 25 22 10 15 C 2 10 0 0 0 0 Z" fill="url(#tlPeachBlossom)" />
      <path d="M14 20 C 5 35 -15 28 -10 12 C -5 4 0 0 0 0 Z" fill="url(#tlPeachBlossom)" />
      <path d="M-15 14 C -32 10 -28 -12 -12 -8 C -4 -2 0 0 0 0 Z" fill="url(#tlPeachBlossom)" />
      <path d="M-18 -15 C -25 -30 -5 -32 -2 -14 C 0 -4 0 0 0 0 Z" fill="url(#tlPeachBlossom)" />
      {/* Center Pistils */}
      <circle cx="0" cy="0" r="4" fill="#fde047" />
      <circle cx="0" cy="0" r="2" fill="#b45309" />
    </g>

    {/* Small Cherry Blossom Bud (Lower) */}
    <g transform="translate(50, 120) scale(0.55)">
      <circle cx="-6" cy="-6" r="10" fill="#fecdd3" opacity="0.9" />
      <circle cx="6" cy="-6" r="10" fill="#fecdd3" opacity="0.9" />
      <circle cx="8" cy="6" r="10" fill="#fecdd3" opacity="0.9" />
      <circle cx="-6" cy="8" r="10" fill="#fecdd3" opacity="0.9" />
      <circle cx="0" cy="0" r="5" fill="#fde047" />
    </g>

    {/* Main Lush Blooming Rose (Corner anchor) */}
    <g transform="translate(68, 68)" filter="url(#tlGlow)">
      {/* Outer Layer Petals */}
      <path
        d="M-38 -15 C -50 -40 -15 -52 10 -42 C 35 -48 55 -25 45 5 C 55 30 30 52 5 45 C -20 55 -48 35 -40 10 C -45 0 -40 -8 -38 -15 Z"
        fill="url(#tlRoseOuter)"
        opacity="0.96"
      />
      {/* Middle Velvet Petals */}
      <path
        d="M-28 -10 C -38 -28 -10 -38 8 -30 C 26 -35 40 -18 32 4 C 38 22 20 38 2 32 C -15 38 -34 24 -28 6 Z"
        fill="url(#tlRoseInner)"
      />
      {/* Inner Petal Swirls */}
      <path
        d="M-18 -5 C -22 -18 -5 -25 6 -20 C 18 -22 26 -10 20 4 C 24 16 12 25 0 20 C -10 24 -22 14 -18 4 Z"
        fill="#fda4af"
      />
      {/* Deep Rose Heart */}
      <path
        d="M-10 -2 C -12 -10 -2 -14 4 -10 C 10 -12 15 -5 11 2 C 13 9 6 14 0 11 C -6 13 -12 7 -10 -2 Z"
        fill="#9f1239"
      />
      <circle cx="0" cy="0" r="3" fill="#ffe4e6" />
    </g>

    {/* Sparkle Pollen Dots */}
    <circle cx="95" cy="18" r="1.8" fill="#fde047" opacity="0.9" />
    <circle cx="160" cy="60" r="2.2" fill="#fde047" opacity="0.85" />
    <circle cx="35" cy="85" r="1.5" fill="#fde047" opacity="0.8" />
  </svg>
);

export const FloralCornerTopRight: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 200 200"
    className={`pointer-events-none select-none ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      {/* Peony Gradients */}
      <radialGradient id="trPeonyOuter" cx="60%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#fdf2f8" />
        <stop offset="50%" stopColor="#f472b6" />
        <stop offset="85%" stopColor="#db2777" />
        <stop offset="100%" stopColor="#9d174d" />
      </radialGradient>
      <radialGradient id="trPeonyInner" cx="55%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#fff1f2" />
        <stop offset="55%" stopColor="#ec4899" />
        <stop offset="100%" stopColor="#831843" />
      </radialGradient>
      {/* Orchid White/Lilac Gradient */}
      <linearGradient id="trOrchidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="60%" stopColor="#f5d0fe" />
        <stop offset="100%" stopColor="#c084fc" />
      </linearGradient>
      {/* Emerald Foliage */}
      <linearGradient id="trLeafGrad1" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#a7f3d0" />
        <stop offset="55%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#065f46" />
      </linearGradient>
      <filter id="trGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#db2777" floodOpacity="0.25" />
      </filter>
    </defs>

    {/* Foliage Vines */}
    <g>
      {/* Main Arching Stem */}
      <path
        d="M190 10 Q 145 25 90 50 Q 45 75 20 125"
        stroke="#065f46"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M175 15 Q 160 80 125 135"
        stroke="#059669"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.75"
      />

      {/* Curved Leaf 1 (Top) */}
      <path
        d="M150 20 C 135 5 105 10 110 32 C 115 45 140 40 150 20 Z"
        fill="url(#trLeafGrad1)"
        opacity="0.9"
      />
      {/* Leaf 2 */}
      <path
        d="M105 42 C 80 30 55 42 60 65 C 68 80 92 70 105 42 Z"
        fill="url(#trLeafGrad1)"
        opacity="0.92"
      />
      {/* Lower Leaf */}
      <path
        d="M168 55 C 180 85 165 115 145 110 C 130 102 140 75 168 55 Z"
        fill="url(#trLeafGrad1)"
        opacity="0.88"
      />
    </g>

    {/* Secondary Flower: Delicate Orchid (Top Left) */}
    <g transform="translate(75, 45) scale(0.65)" filter="url(#trGlow)">
      <path d="M0 -22 C -12 -35 -25 -20 -15 -8 C -10 -2 0 0 0 0 Z" fill="url(#trOrchidGrad)" />
      <path d="M-22 -5 C -35 8 -22 24 -8 15 C -2 8 0 0 0 0 Z" fill="url(#trOrchidGrad)" />
      <path d="M-12 20 C -4 35 15 28 8 12 C 4 4 0 0 0 0 Z" fill="url(#trOrchidGrad)" />
      <path d="M15 14 C 32 10 26 -12 10 -8 C 3 -2 0 0 0 0 Z" fill="url(#trOrchidGrad)" />
      <path d="M18 -15 C 25 -30 4 -32 2 -14 C 0 -4 0 0 0 0 Z" fill="url(#trOrchidGrad)" />
      <circle cx="0" cy="0" r="4" fill="#fde047" />
    </g>

    {/* Main Lush Peony Blossom */}
    <g transform="translate(132, 68)" filter="url(#trGlow)">
      {/* Outer Layer */}
      <path
        d="M38 -15 C 50 -40 15 -52 -10 -42 C -35 -48 -55 -25 -45 5 C -55 30 -30 52 -5 45 C 20 55 48 35 40 10 C 45 0 40 -8 38 -15 Z"
        fill="url(#trPeonyOuter)"
        opacity="0.96"
      />
      {/* Middle Petals */}
      <path
        d="M28 -10 C 38 -28 10 -38 -8 -30 C -26 -35 -40 -18 -32 4 C -38 22 -20 38 -2 32 C 15 38 34 24 28 6 Z"
        fill="url(#trPeonyInner)"
      />
      {/* Inner Petal Swirls */}
      <path
        d="M18 -5 C 22 -18 5 -25 -6 -20 C -18 -22 -26 -10 -20 4 C -24 16 -12 25 0 20 C 10 24 22 14 18 4 Z"
        fill="#fbcfe8"
      />
      <circle cx="0" cy="0" r="3.5" fill="#ffe4e6" />
    </g>

    {/* Sparkle Pollen Dots */}
    <circle cx="105" cy="18" r="1.8" fill="#fde047" opacity="0.9" />
    <circle cx="40" cy="60" r="2.2" fill="#fde047" opacity="0.85" />
    <circle cx="165" cy="85" r="1.5" fill="#fde047" opacity="0.8" />
  </svg>
);

export const FloralCornerBottomLeft: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 180 180"
    className={`pointer-events-none select-none ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <radialGradient id="blRoseGrad" cx="45%" cy="50%" r="55%">
        <stop offset="0%" stopColor="#fff1f2" />
        <stop offset="50%" stopColor="#fb7185" />
        <stop offset="100%" stopColor="#be123c" />
      </radialGradient>
      <linearGradient id="blLeafGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#047857" />
        <stop offset="60%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#6ee7b7" />
      </linearGradient>
    </defs>

    {/* Curling Vines */}
    <path
      d="M10 170 Q 30 110 95 90 Q 140 75 170 50"
      stroke="#047857"
      strokeWidth="2.2"
      strokeLinecap="round"
      opacity="0.8"
    />
    {/* Leaves */}
    <path d="M40 140 C 25 118 45 95 70 105 C 80 120 60 148 40 140 Z" fill="url(#blLeafGrad)" opacity="0.9" />
    <path d="M90 95 C 105 75 130 82 128 102 C 118 115 95 110 90 95 Z" fill="url(#blLeafGrad)" opacity="0.85" />
    <path d="M135 68 C 150 48 172 55 168 74 C 158 85 138 80 135 68 Z" fill="url(#blLeafGrad)" opacity="0.85" />

    {/* Flower Blossom */}
    <g transform="translate(58, 125) scale(0.75)">
      <circle cx="-16" cy="0" r="14" fill="url(#blRoseGrad)" opacity="0.95" />
      <circle cx="16" cy="0" r="14" fill="url(#blRoseGrad)" opacity="0.95" />
      <circle cx="0" cy="-16" r="14" fill="url(#blRoseGrad)" opacity="0.95" />
      <circle cx="0" cy="16" r="14" fill="url(#blRoseGrad)" opacity="0.95" />
      <circle cx="0" cy="0" r="8" fill="#fff1f2" />
      <circle cx="0" cy="0" r="4" fill="#fde047" />
    </g>

    {/* Sparkle */}
    <circle cx="105" cy="75" r="1.5" fill="#fde047" opacity="0.85" />
  </svg>
);

export const FloralCornerBottomRight: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 180 180"
    className={`pointer-events-none select-none ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <radialGradient id="brCamelliaGrad" cx="50%" cy="50%" r="55%">
        <stop offset="0%" stopColor="#fff7ed" />
        <stop offset="50%" stopColor="#f472b6" />
        <stop offset="100%" stopColor="#9d174d" />
      </radialGradient>
      <linearGradient id="brLeafGrad" x1="100%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#047857" />
        <stop offset="60%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#a7f3d0" />
      </linearGradient>
    </defs>

    {/* Curling Vines */}
    <path
      d="M170 170 Q 150 110 85 90 Q 40 75 10 50"
      stroke="#047857"
      strokeWidth="2.2"
      strokeLinecap="round"
      opacity="0.8"
    />
    {/* Leaves */}
    <path d="M140 140 C 155 118 135 95 110 105 C 100 120 120 148 140 140 Z" fill="url(#brLeafGrad)" opacity="0.9" />
    <path d="M90 95 C 75 75 50 82 52 102 C 62 115 85 110 90 95 Z" fill="url(#brLeafGrad)" opacity="0.85" />
    <path d="M45 68 C 30 48 8 55 12 74 C 22 85 42 80 45 68 Z" fill="url(#brLeafGrad)" opacity="0.85" />

    {/* Camellia Flower */}
    <g transform="translate(122, 125) scale(0.75)">
      <circle cx="-16" cy="0" r="14" fill="url(#brCamelliaGrad)" opacity="0.95" />
      <circle cx="16" cy="0" r="14" fill="url(#brCamelliaGrad)" opacity="0.95" />
      <circle cx="0" cy="-16" r="14" fill="url(#brCamelliaGrad)" opacity="0.95" />
      <circle cx="0" cy="16" r="14" fill="url(#brCamelliaGrad)" opacity="0.95" />
      <circle cx="0" cy="0" r="8" fill="#fff7ed" />
      <circle cx="0" cy="0" r="4" fill="#fde047" />
    </g>

    {/* Sparkle */}
    <circle cx="75" cy="75" r="1.5" fill="#fde047" opacity="0.85" />
  </svg>
);

/**
 * Floating petals scattered delicately in the background
 */
export const FloatingPetals: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
    {/* Petal 1: Soft rose petal (top-left) */}
    <div className="absolute top-10 left-[18%] opacity-70 animate-float-gentle" style={{ animationDelay: '0s' }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M4 14 C 2 6 12 2 18 6 C 22 12 16 22 8 20 C 5 19 4 17 4 14 Z" fill="url(#petalGradRose)" />
      </svg>
    </div>

    {/* Petal 2: Fresh peach petal (top-right) */}
    <div className="absolute top-8 right-[20%] opacity-65 animate-float-gentle" style={{ animationDelay: '1.5s' }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="rotate-45">
        <path d="M6 16 C 3 8 10 3 17 6 C 21 11 17 21 9 19 C 7 18 6 17 6 16 Z" fill="url(#petalGradPeach)" />
      </svg>
    </div>

    {/* Petal 3: Delicate leaf petal (bottom-left) */}
    <div className="absolute bottom-14 left-[14%] opacity-60 animate-float-gentle" style={{ animationDelay: '3s' }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="-rotate-30">
        <path d="M4 20 C 4 10 12 4 20 4 C 20 14 14 20 4 20 Z" fill="url(#petalGradGreen)" />
      </svg>
    </div>

    {/* Petal 4: Soft pink petal (bottom-right) */}
    <div className="absolute bottom-12 right-[16%] opacity-70 animate-float-gentle" style={{ animationDelay: '2s' }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="rotate-12">
        <path d="M5 15 C 3 7 11 2 18 5 C 22 11 16 21 8 19 C 6 18 5 17 5 15 Z" fill="url(#petalGradRose)" />
      </svg>
    </div>

    {/* Petal 5: Golden star dust/pollen (mid right) */}
    <div className="absolute top-1/2 right-[8%] opacity-80 animate-pulse" style={{ animationDuration: '3s' }}>
      <div className="w-2 h-2 rounded-full bg-amber-300 shadow-sm shadow-amber-300/60" />
    </div>
    <div className="absolute top-1/3 left-[10%] opacity-75 animate-pulse" style={{ animationDuration: '4s' }}>
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/60" />
    </div>

    {/* Shared Petal Gradients SVG Defs */}
    <svg width="0" height="0" className="hidden">
      <defs>
        <linearGradient id="petalGradRose" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff1f2" />
          <stop offset="50%" stopColor="#fda4af" />
          <stop offset="100%" stopColor="#f43f5e" />
        </linearGradient>
        <linearGradient id="petalGradPeach" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff7ed" />
          <stop offset="60%" stopColor="#fed7aa" />
          <stop offset="100%" stopColor="#fb923c" />
        </linearGradient>
        <linearGradient id="petalGradGreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a7f3d0" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);
