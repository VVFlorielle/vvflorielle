import React from 'react';
import { useStore } from '../context/StoreContext';

/**
 * Real Photographic Botanical Floral Corner Ornaments (No Vector SVGs)
 * Soft, pale, transparent background floral accents for the Hero header.
 */

export const FloralCornerTopLeft: React.FC<{ className?: string; src?: string }> = ({ className = '', src }) => {
  const { settings } = useStore();
  const imgSrc = src || settings.floralCornerTopImage || '/images/floral/floral-corner-rose-peony.webp';
  return (
    <div className={`pointer-events-none select-none overflow-hidden ${className}`}>
      <img
        src={imgSrc}
        alt="Hoa góc trên trái"
        className="w-full h-full object-contain opacity-90"
      />
    </div>
  );
};

export const FloralCornerTopRight: React.FC<{ className?: string; src?: string }> = ({ className = '', src }) => {
  const { settings } = useStore();
  const imgSrc = src || settings.floralCornerTopImage || '/images/floral/floral-corner-rose-peony.webp';
  return (
    <div className={`pointer-events-none select-none overflow-hidden ${className}`}>
      <img
        src={imgSrc}
        alt="Hoa góc trên phải"
        className="w-full h-full object-contain -scale-x-100 opacity-90"
      />
    </div>
  );
};

export const FloralCornerBottomLeft: React.FC<{ className?: string; src?: string }> = ({ className = '', src }) => {
  const { settings } = useStore();
  const imgSrc = src || settings.floralCornerBottomImage || '/images/floral/floral-corner-peach-lisianthus.webp';
  return (
    <div className={`pointer-events-none select-none overflow-hidden ${className}`}>
      <img
        src={imgSrc}
        alt="Hoa góc dưới trái"
        className="w-full h-full object-contain -scale-y-100 opacity-80"
      />
    </div>
  );
};

export const FloralCornerBottomRight: React.FC<{ className?: string; src?: string }> = ({ className = '', src }) => {
  const { settings } = useStore();
  const imgSrc = src || settings.floralCornerBottomImage || '/images/floral/floral-corner-peach-lisianthus.webp';
  return (
    <div className={`pointer-events-none select-none overflow-hidden ${className}`}>
      <img
        src={imgSrc}
        alt="Hoa góc dưới phải"
        className="w-full h-full object-contain -scale-x-100 -scale-y-100 opacity-80"
      />
    </div>
  );
};

/**
 * Gentle floating rose & peach petals in hero background
 */
export const FloatingPetals: React.FC = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden select-none">
      <div className="absolute top-1/4 left-1/6 w-3 h-5 bg-gradient-to-br from-rose-200/40 to-rose-300/20 rounded-full blur-[0.5px] rotate-45 animate-pulse" />
      <div className="absolute top-1/3 right-1/5 w-4 h-6 bg-gradient-to-br from-amber-200/40 to-rose-200/20 rounded-full blur-[0.5px] -rotate-12 animate-pulse" style={{ animationDelay: '1.2s' }} />
      <div className="absolute bottom-1/4 left-1/3 w-3 h-4 bg-gradient-to-br from-pink-200/30 to-pink-300/10 rounded-full blur-[0.5px] rotate-12 animate-pulse" style={{ animationDelay: '2.5s' }} />
      <div className="absolute bottom-1/3 right-1/4 w-3.5 h-5 bg-gradient-to-br from-rose-200/35 to-amber-100/20 rounded-full blur-[0.5px] 35deg animate-pulse" style={{ animationDelay: '1.8s' }} />
    </div>
  );
};
