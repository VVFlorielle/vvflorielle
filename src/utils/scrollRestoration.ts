/**
 * Scroll Restoration Engine (Replicated from Phototiinlove battle-tested navigation architecture)
 * Retries scroll position restoration smoothly over 420ms to adapt to async component and layout rendering.
 */

let isRestoring = false;
let restoreTimer: any = null;

export function isRestoringScroll(): boolean {
  return isRestoring;
}

export function restoreScrollPosition(targetY: number) {
  if (typeof window === 'undefined') return;

  if (restoreTimer) {
    clearInterval(restoreTimer);
    restoreTimer = null;
  }

  isRestoring = true;
  if (document.body) {
    document.body.classList.add('is-restoring-scroll');
  }

  const applyScroll = () => {
    window.scrollTo({ top: targetY, behavior: 'instant' as ScrollBehavior });
    const currentY = window.scrollY || document.documentElement.scrollTop || 0;
    return Math.abs(currentY - targetY) <= 1;
  };

  applyScroll();

  let attempts = 0;
  const maxAttempts = 12; // 12 * 35ms = 420ms max to synchronize when subpage/dashboard finishes rendering
  restoreTimer = setInterval(() => {
    attempts++;
    const reached = applyScroll();
    if (reached || attempts >= maxAttempts) {
      clearInterval(restoreTimer);
      restoreTimer = null;
      setTimeout(() => {
        isRestoring = false;
        if (document.body) {
          document.body.classList.remove('is-restoring-scroll');
        }
      }, 100);
    }
  }, 35);
}
