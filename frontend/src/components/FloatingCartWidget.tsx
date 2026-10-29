import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingCart } from 'lucide-react';

export const FloatingCartWidget: React.FC = () => {
  const { cart, setIsCartOpen } = useStore();
  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Initial draggable position (floating comfortably at bottom-right corner)
  const getDefaultPos = () => {
    if (typeof window !== 'undefined') {
      return {
        x: Math.max(20, window.innerWidth - 88),
        y: Math.max(100, window.innerHeight - 105),
      };
    }
    return { x: 1200, y: 720 };
  };

  const [pos, setPos] = useState(getDefaultPos);
  const isDraggingRef = useRef(false);
  const hasMovedRef = useRef(false);
  const hasUserMovedRef = useRef(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, initialX: 0, initialY: 0 });

  // Ensure initial placement is at bottom right corner on mount & track resize
  useEffect(() => {
    if (!hasUserMovedRef.current && typeof window !== 'undefined') {
      setPos({
        x: Math.max(20, window.innerWidth - 88),
        y: Math.max(100, window.innerHeight - 105),
      });
    }

    const handleResize = () => {
      if (!hasUserMovedRef.current) {
        setPos({
          x: Math.max(20, window.innerWidth - 88),
          y: Math.max(100, window.innerHeight - 105),
        });
      } else {
        setPos((prev) => ({
          x: Math.max(16, Math.min(prev.x, window.innerWidth - 82)),
          y: Math.max(65, Math.min(prev.y, window.innerHeight - 85)),
        }));
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Pointer drag event handler (Compatible with mouse & touch, exactly like Mascot)
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      initialX: pos.x,
      initialY: pos.y,
    };

    const handlePointerMove = (moveEvt: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const dx = moveEvt.clientX - dragStartRef.current.mouseX;
      const dy = moveEvt.clientY - dragStartRef.current.mouseY;

      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        hasMovedRef.current = true;
        hasUserMovedRef.current = true;
      }

      const newX = Math.max(16, Math.min(window.innerWidth - 82, dragStartRef.current.initialX + dx));
      const newY = Math.max(65, Math.min(window.innerHeight - 85, dragStartRef.current.initialY + dy));
      setPos({ x: newX, y: newY });
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
  };

  const handleCartClick = () => {
    if (!hasMovedRef.current) {
      setIsCartOpen(true);
    }
  };

  return (
    <div
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        touchAction: 'none',
      }}
      className="fixed z-[9980] hidden md:flex items-center justify-center select-none group cursor-grab active:cursor-grabbing transition-transform"
      onPointerDown={handlePointerDown}
      onClick={handleCartClick}
      title="Giỏ hoa của bạn (Bấm để xem / Kéo rê tùy ý)"
    >
      {/* Outer ambient glow animation */}
      <div className="absolute inset-[-4px] rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 blur-sm opacity-50 group-hover:opacity-80 transition-opacity animate-pulse" />

      {/* Main Draggable Cart Orb (Supermarket Orange, Frameless Glassmorphism) */}
      <div className="relative w-15 h-15 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white border-2 border-white/95 shadow-[0_10px_28px_rgba(249,115,22,0.48),inset_0_2px_4px_rgba(255,255,255,0.85)] flex items-center justify-center group-hover:scale-108 active:scale-95 transition-all duration-200">
        <ShoppingCart className="w-7 h-7 sm:w-7.5 sm:h-7.5 text-white filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] group-hover:scale-110 transition-transform" />

        {/* Badge Count */}
        {totalCartCount > 0 ? (
          <span className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] px-1 rounded-full bg-rose-600 text-white text-[11px] font-black flex items-center justify-center border-2 border-white shadow-md animate-bounce-subtle">
            {totalCartCount > 99 ? '99+' : totalCartCount}
          </span>
        ) : (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white shadow-sm" />
        )}
      </div>

      {/* Hover pill hint */}
      <div className="absolute -top-8 right-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap bg-slate-900/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg backdrop-blur-md border border-white/20">
        Giỏ hoa ({totalCartCount}) • Kéo thả
      </div>
    </div>
  );
};
