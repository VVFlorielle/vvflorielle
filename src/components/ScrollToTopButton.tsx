import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 250);

      setIsScrolling(true);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 450);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial scroll
    setIsVisible(window.scrollY > 250);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  const scrollToTop = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(20);
      } catch {
        // Safe ignore
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed left-3.5 sm:left-auto sm:right-6 bottom-[86px] sm:bottom-[230px] min-[1024px]:bottom-52 z-40 select-none pointer-events-auto transition-all duration-300 animate-in fade-in zoom-in-75 ${
        isScrolling ? 'opacity-35 hover:opacity-100 scale-90' : 'opacity-90 hover:opacity-100 scale-100'
      }`}
    >
      <button
        type="button"
        onClick={scrollToTop}
        className="w-9 h-9 sm:w-11 sm:h-11 rounded-full aspect-square btn-scroll-to-top active:scale-90 flex items-center justify-center cursor-pointer group p-0"
        title="Cuộn lên đầu trang"
        aria-label="Cuộn lên đầu trang"
      >
        <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-y-0.5 transition-transform" />
      </button>
    </div>
  );
};
