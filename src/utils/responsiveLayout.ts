import { useEffect, useState } from 'react';

/**
 * Standardized Device & Orientation Classification (Aspect Ratio standard)
 * 
 * Mobile/Portrait: aspectRatio < 1.15 (vertical viewport: phones, portrait tablets, narrow splits)
 * Desktop/Landscape: aspectRatio >= 1.15 and innerWidth >= 1024px (horizontal viewport)
 */

export interface ResponsiveLayoutState {
  isMobileLayout: boolean;
  isLandscape: boolean;
  aspectRatio: number;
  width: number;
  height: number;
  dockEffectiveHeight: number;
}

export function computeResponsiveLayout(): ResponsiveLayoutState {
  if (typeof window === 'undefined') {
    return {
      isMobileLayout: false,
      isLandscape: true,
      aspectRatio: 16 / 9,
      width: 1440,
      height: 900,
      dockEffectiveHeight: 0
    };
  }

  const width = window.innerWidth;
  const height = window.innerHeight;
  const aspectRatio = width / (height || 1);

  // Vertical orientation: phone, portrait tablet, or narrow window (< 1.15 aspect ratio or < 768px width)
  const isMobileLayout = aspectRatio < 1.15 || width < 768;
  const isLandscape = !isMobileLayout;
  const dockEffectiveHeight = isMobileLayout ? 72 : 0;

  return {
    isMobileLayout,
    isLandscape,
    aspectRatio,
    width,
    height,
    dockEffectiveHeight
  };
}

/**
 * Applies dynamic CSS variables to :root for seamless CSS styling
 */
export function applyLayoutCssVariables(): ResponsiveLayoutState {
  const state = computeResponsiveLayout();
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    root.style.setProperty('--app-aspect-ratio', state.aspectRatio.toFixed(3));
    root.style.setProperty('--app-orientation', state.isMobileLayout ? 'portrait' : 'landscape');
    root.style.setProperty('--is-mobile-layout', state.isMobileLayout ? '1' : '0');
    root.style.setProperty('--dock-effective-height', `${state.dockEffectiveHeight}px`);
    root.style.setProperty('--vh', `${state.height * 0.01}px`);
  }
  return state;
}

/**
 * React hook to subscribe to layout changes
 */
export function useResponsiveLayout(): ResponsiveLayoutState {
  const [state, setState] = useState<ResponsiveLayoutState>(computeResponsiveLayout);

  useEffect(() => {
    const handleResize = () => {
      const newState = applyLayoutCssVariables();
      setState(newState);
    };

    // Initial setup
    handleResize();

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return state;
}
