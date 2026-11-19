import { PromotionItem } from '../types';

export interface VoucherVisibilityConfig {
  isDoubleDaySimulated?: boolean;
  isFlashSaleSimulated?: boolean;
  isHolidaySimulated?: boolean;
}

/**
 * Kiểm tra xem hôm nay có phải là ngày đôi (01/01, 02/02... 11/11, 12/12) hay không
 */
export function isDoubleDayToday(simulated = false): boolean {
  if (simulated) return true;
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;
  return day === month;
}

/**
 * Tính toán trạng thái khung giờ vàng Flash Sale (12h-14h và 20h-22h)
 */
export interface FlashSaleState {
  isLive: boolean;
  activeSlot: '12:00 - 14:00' | '20:00 - 22:00';
  targetDate: Date;
  statusLabel: string;
}

export function getFlashSaleState(simulated = false): FlashSaleState {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const slot1Start = 12 * 60; // 12:00
  const slot1End = 14 * 60;   // 14:00
  const slot2Start = 20 * 60; // 20:00
  const slot2End = 22 * 60;   // 22:00

  if (simulated) {
    const end = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    return {
      isLive: true,
      activeSlot: '20:00 - 22:00',
      targetDate: end,
      statusLabel: 'Đang diễn ra Giờ Vàng (Thử nghiệm)'
    };
  }

  // Khung 1: 12h - 14h đang diễn ra
  if (currentMinutes >= slot1Start && currentMinutes < slot1End) {
    const target = new Date(now);
    target.setHours(14, 0, 0, 0);
    return {
      isLive: true,
      activeSlot: '12:00 - 14:00',
      targetDate: target,
      statusLabel: 'Đang diễn ra khung 12h - 14h'
    };
  }

  // Khung 2: 20h - 22h đang diễn ra
  if (currentMinutes >= slot2Start && currentMinutes < slot2End) {
    const target = new Date(now);
    target.setHours(22, 0, 0, 0);
    return {
      isLive: true,
      activeSlot: '20:00 - 22:00',
      targetDate: target,
      statusLabel: 'Đang diễn ra khung 20h - 22h'
    };
  }

  // Đang trước 12h -> Đếm ngược tới 12h trưa nay
  if (currentMinutes < slot1Start) {
    const target = new Date(now);
    target.setHours(12, 0, 0, 0);
    return {
      isLive: false,
      activeSlot: '12:00 - 14:00',
      targetDate: target,
      statusLabel: 'Sắp mở bán lúc 12:00 trưa nay'
    };
  }

  // Đang từ 14h đến 20h -> Đếm ngược tới 20h tối nay
  if (currentMinutes >= slot1End && currentMinutes < slot2Start) {
    const target = new Date(now);
    target.setHours(20, 0, 0, 0);
    return {
      isLive: false,
      activeSlot: '20:00 - 22:00',
      targetDate: target,
      statusLabel: 'Sắp mở bán lúc 20:00 tối nay'
    };
  }

  // Sau 22h đêm -> Đếm ngược tới 12h trưa mai
  const target = new Date(now);
  target.setDate(target.getDate() + 1);
  target.setHours(12, 0, 0, 0);
  return {
    isLive: false,
    activeSlot: '12:00 - 14:00',
    targetDate: target,
    statusLabel: 'Sắp mở bán lúc 12:00 trưa mai'
  };
}

/**
 * Kiểm tra xem voucher đặc biệt theo lịch có đủ điều kiện hiển thị hôm nay không
 */
export function isSpecialCalendarVoucherActive(code: string, simulated = false): boolean {
  if (simulated) return true;
  const now = new Date();
  const day = now.getDate();

  if (code === 'VVF-MUNG1') {
    // Chỉ kích hoạt ngày Mùng 1
    return day === 1;
  }
  if (code === 'VVF-RAM15') {
    // Chỉ kích hoạt ngày Rằm 15
    return day === 15;
  }
  if (code === 'VVF-PAYDAY') {
    // Chỉ kích hoạt dịp cuối tháng lương về (25 đến 31) hoặc đầu tháng (1 đến 5)
    return day >= 25 || day <= 5;
  }

  return true;
}

/**
 * Kiểm tra xem 1 voucher có đủ điều kiện hiển thị trên Storefront công khai hay không
 */
export function isVoucherVisibleOnStorefront(
  promo: PromotionItem,
  config: VoucherVisibilityConfig = {}
): boolean {
  if (!promo.isActive) return false;
  if (promo.showOnPublicWeb === false) return false;

  // 1. Voucher Ngày Đôi
  if (promo.campaignType === 'DOUBLE_DAY') {
    return isDoubleDayToday(config.isDoubleDaySimulated);
  }

  // 2. Voucher Flash Deal
  if (promo.campaignType === 'FLASH_DEAL') {
    if (config.isFlashSaleSimulated) return true;
    const flashState = getFlashSaleState(false);
    // Nếu đang trong khung giờ live tương ứng
    if (flashState.isLive) {
      if (promo.hourlyDealStart === '12:00' && flashState.activeSlot === '12:00 - 14:00') return true;
      if (promo.hourlyDealStart === '20:00' && flashState.activeSlot === '20:00 - 22:00') return true;
    }
    // Ngoài khung giờ live, không hiển thị mã sẵn sàng dùng (sẽ hiển thị teaser đếm ngược)
    return false;
  }

  // 3. Voucher Lịch đặc biệt (Mùng 1, Rằm 15, Payday)
  if (promo.code === 'VVF-MUNG1' || promo.code === 'VVF-RAM15' || promo.code === 'VVF-PAYDAY') {
    return isSpecialCalendarVoucherActive(promo.code, config.isHolidaySimulated);
  }

  // 4. Các voucher công khai thường trực (Freeship tuần, tháng, chào bạn mới, tri ân 10%)
  return true;
}
