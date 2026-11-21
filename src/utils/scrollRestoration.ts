/**
 * Scroll Restoration Engine (Replicated from Phototiinlove battle-tested navigation architecture)
 * Retries scroll position restoration smoothly to adapt to async component and layout rendering.
 * Provides a global Tab Scroll Memory to remember positions of each management subpage.
 */

let isRestoring = false;
let restoreTimer: any = null;

const tabScrollMemory: Record<string, number> = {};

export function isRestoringScroll(): boolean {
  return isRestoring;
}

/**
 * Lưu tọa độ cuộn hiện tại của một tab / trang quản trị
 */
export function saveTabScroll(tabKey: string, customY?: number) {
  if (typeof window === 'undefined') return;
  const y = typeof customY === 'number' ? customY : (window.scrollY || document.documentElement.scrollTop || 0);
  tabScrollMemory[tabKey] = Math.max(0, y);
}

/**
 * Lấy tọa độ cuộn đã lưu của một tab / trang quản trị
 */
export function getTabScroll(tabKey: string): number {
  return tabScrollMemory[tabKey] || 0;
}

/**
 * Xóa tọa độ cuộn của một tab hoặc toàn bộ
 */
export function clearTabScroll(tabKey?: string) {
  if (tabKey) {
    delete tabScrollMemory[tabKey];
  } else {
    Object.keys(tabScrollMemory).forEach((k) => delete tabScrollMemory[k]);
  }
}

/**
 * Khôi phục vị trí cuộn thông minh, kiên trì thử lại khi component mount và DOM nở ra chiều cao cũ
 */
export function restoreScrollPosition(targetY: number, onComplete?: () => void) {
  if (typeof window === 'undefined') return;

  if (restoreTimer) {
    clearInterval(restoreTimer);
    restoreTimer = null;
  }

  if (targetY <= 0) {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    onComplete?.();
    return;
  }

  isRestoring = true;
  if (document.body) {
    document.body.classList.add('is-restoring-scroll');
  }

  const applyScroll = () => {
    window.scrollTo({ top: targetY, behavior: 'instant' as ScrollBehavior });
    const currentY = window.scrollY || document.documentElement.scrollTop || 0;
    return Math.abs(currentY - targetY) <= 2;
  };

  applyScroll();

  let attempts = 0;
  const maxAttempts = 18; // 18 * 35ms = ~630ms, đủ thời gian cho toàn bộ danh sách/ảnh nở ra
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
        onComplete?.();
      }, 80);
    }
  }, 35);
}
