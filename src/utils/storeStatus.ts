export type StoreStatusType = 'OPEN' | 'BREAK' | 'CLOSED';

export interface StoreStatusResult {
  status: StoreStatusType;
  text: 'Mở Cửa' | 'Tạm Nghỉ' | 'Đóng Cửa';
  dotColor: string;
  textColor: string;
  borderColor: string;
}

export const getStoreStatus = (settings?: {
  openingHours?: string;
  shift1Start?: string;
  shift1End?: string;
  shift2Start?: string;
  shift2End?: string;
  storeOperationalStatus?: 'AUTO' | 'OPEN' | 'BREAK' | 'CLOSED';
}): StoreStatusResult => {
  // 1. Manual Override check from Settings
  if (settings?.storeOperationalStatus === 'OPEN') {
    return {
      status: 'OPEN',
      text: 'Mở Cửa',
      dotColor: 'bg-emerald-500 animate-pulse fixed-semantic',
      textColor: 'text-emerald-800 fixed-semantic',
      borderColor: 'border-emerald-300/90 fixed-semantic'
    };
  }

  if (settings?.storeOperationalStatus === 'BREAK') {
    return {
      status: 'BREAK',
      text: 'Tạm Nghỉ',
      dotColor: 'bg-amber-500',
      textColor: 'text-amber-800',
      borderColor: 'border-amber-300/90'
    };
  }

  if (settings?.storeOperationalStatus === 'CLOSED') {
    return {
      status: 'CLOSED',
      text: 'Đóng Cửa',
      dotColor: 'bg-rose-500',
      textColor: 'text-rose-800',
      borderColor: 'border-rose-300/90'
    };
  }

  // 2. Automatic time-based calculation (Default)
  try {
    const raw = (settings?.openingHours || '07:30 - 22:00').trim();
    const match = raw.match(/(\d{1,2})[:h](\d{2})\s*-\s*(\d{1,2})[:h](\d{2})/i);
    const now = new Date();
    const curMinutes = now.getHours() * 60 + now.getMinutes();

    let startM = 7 * 60 + 30; // 07:30
    let endM = 22 * 60;       // 22:00

    if (match) {
      startM = parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
      endM = parseInt(match[3], 10) * 60 + parseInt(match[4], 10);
    }

    // Midday break (Tạm Nghỉ) between shift 1 & shift 2 (Default: 11:30 - 13:00)
    let breakStart = 11 * 60 + 30;
    let breakEnd = 13 * 60;

    if (settings?.shift1End && settings?.shift2Start) {
      const [s1H, s1M] = settings.shift1End.split(':').map((v) => parseInt(v, 10));
      const [s2H, s2M] = settings.shift2Start.split(':').map((v) => parseInt(v, 10));
      if (!isNaN(s1H) && !isNaN(s2H)) {
        breakStart = s1H * 60 + (s1M || 0);
        breakEnd = s2H * 60 + (s2M || 0);
      }
    }

    // Outside operating hours -> Đóng Cửa
    if (curMinutes < startM || curMinutes > endM) {
      return {
        status: 'CLOSED',
        text: 'Đóng Cửa',
        dotColor: 'bg-rose-500',
        textColor: 'text-rose-800',
        borderColor: 'border-rose-300/90'
      };
    }

    // Between shifts -> Tạm Nghỉ
    if (curMinutes >= breakStart && curMinutes < breakEnd) {
      return {
        status: 'BREAK',
        text: 'Tạm Nghỉ',
        dotColor: 'bg-amber-500',
        textColor: 'text-amber-800',
        borderColor: 'border-amber-300/90'
      };
    }

    // Normal working hours -> Mở Cửa
    return {
      status: 'OPEN',
      text: 'Mở Cửa',
      dotColor: 'bg-emerald-500 animate-pulse fixed-semantic',
      textColor: 'text-emerald-800 fixed-semantic',
      borderColor: 'border-emerald-300/90 fixed-semantic'
    };
  } catch {
    return {
      status: 'OPEN',
      text: 'Mở Cửa',
      dotColor: 'bg-emerald-500 animate-pulse fixed-semantic',
      textColor: 'text-emerald-800 fixed-semantic',
      borderColor: 'border-emerald-300/90 fixed-semantic'
    };
  }
};
