import { useEffect } from 'react';

let lockCount = 0;
let savedScrollY = 0;

/**
 * Universal Body Scroll Lock (Gold-standard for iOS Safari, Android, and Desktop Chrome)
 * Locks the body in place without any layout shift or scrollbar gap jumping.
 */
export function lockBodyScroll(lock: boolean) {
  if (typeof window === 'undefined' || !document.body) return;

  if (lock) {
    lockCount++;
    if (lockCount === 1) {
      savedScrollY = window.scrollY || document.documentElement.scrollTop || 0;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${savedScrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.classList.add('is-body-scroll-locked');
    }
  } else {
    lockCount = Math.max(0, lockCount - 1);
    if (lockCount === 0) {
      const top = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.classList.remove('is-body-scroll-locked');

      if (top) {
        const y = Math.abs(parseInt(top, 10));
        window.scrollTo(0, y);
      } else {
        window.scrollTo(0, savedScrollY);
      }
    }
  }
}

/**
 * React hook to lock body scroll while a component or modal is mounted/open.
 */
export function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (isLocked) {
      lockBodyScroll(true);
      return () => {
        lockBodyScroll(false);
      };
    }
  }, [isLocked]);
}
