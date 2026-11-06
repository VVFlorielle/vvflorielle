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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed right-3 sm:right-6 bottom-20 sm:bottom-28 z-[65] select-none pointer-events-auto transition-all duration-300 animate-in fade-in zoom-in-75 ${
        isScrolling ? 'opacity-40 hover:opacity-100 scale-95' : 'opacity-100 scale-100'
      }`}
    >
      <button
        type="button"
        onClick={scrollToTop}
        className="w-10 h-10 sm:w-11 sm:h-11 rounded-full aspect-square bg-white/94 backdrop-blur-2xl border border-emerald-300/80 shadow-[0_6px_20px_rgba(5,150,105,0.25)] text-emerald-800 hover:text-emerald-950 hover:bg-emerald-50 active:scale-95 transition-all flex items-center justify-center cursor-pointer group p-0"
        title="Cuộn lên đầu trang"
        aria-label="Cuộn lên đầu trang"
      >
        <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform text-emerald-700" />
      </button>
    </div>
  );
};
