// Hanoi Administrative Data & Google Maps Geocoding Distance Calculator
// Base origin showroom: 105 Doãn Kế Thiện, Mai Dịch, Cầu Giấy, Hà Nội (21.0402, 105.7778)

export interface HanoiDistrict {
  id: string;
  name: string;
  baseKm: number; // Khoảng cách trung bình từ 105 Doãn Kế Thiện
  wards: { name: string; kmOffset: number }[];
}

export const HANOI_DISTRICTS: HanoiDistrict[] = [
  {
    id: 'cau-giay',
    name: 'Quận Cầu Giấy',
    baseKm: 1.8,
    wards: [
      { name: 'Phường Mai Dịch', kmOffset: -0.8 },
      { name: 'Phường Dịch Vọng Hậu', kmOffset: -0.3 },
      { name: 'Phường Dịch Vọng', kmOffset: 0.2 },
      { name: 'Phường Nghĩa Tân', kmOffset: -0.2 },
      { name: 'Phường Nghĩa Đô', kmOffset: 0.5 },
      { name: 'Phường Quan Hoa', kmOffset: 0.6 },
      { name: 'Phường Yên Hòa', kmOffset: 0.8 },
      { name: 'Phường Trung Hòa', kmOffset: 1.2 },
    ]
  },
  {
    id: 'nam-tu-liem',
    name: 'Quận Nam Từ Liêm',
    baseKm: 3.5,
    wards: [
      { name: 'Phường Mỹ Đình 1', kmOffset: -0.6 },
      { name: 'Phường Mỹ Đình 2', kmOffset: -0.8 },
      { name: 'Phường Cầu Diễn', kmOffset: -0.7 },
      { name: 'Phường Mễ Trì', kmOffset: 0.2 },
      { name: 'Phường Phú Đô', kmOffset: 0.5 },
      { name: 'Phường Trung Văn', kmOffset: 1.2 },
      { name: 'Phường Tây Mỗ', kmOffset: 2.8 },
      { name: 'Phường Đại Mỗ', kmOffset: 2.5 },
      { name: 'Phường Xuân Phương', kmOffset: 1.0 },
      { name: 'Phường Phương Canh', kmOffset: 1.5 },
    ]
  },
  {
    id: 'bac-tu-liem',
    name: 'Quận Bắc Từ Liêm',
    baseKm: 4.2,
    wards: [
      { name: 'Phường Cổ Nhuế 1', kmOffset: -1.2 },
      { name: 'Phường Cổ Nhuế 2', kmOffset: -0.5 },
      { name: 'Phường Phú Diễn', kmOffset: -0.8 },
      { name: 'Phường Phúc Diễn', kmOffset: 0.2 },
      { name: 'Phường Xuân Đỉnh', kmOffset: 0.5 },
      { name: 'Phường Xuân Tảo', kmOffset: 0.6 },
      { name: 'Phường Đông Ngạc', kmOffset: 1.5 },
      { name: 'Phường Đức Thắng', kmOffset: 1.2 },
      { name: 'Phường Thụy Phương', kmOffset: 2.0 },
      { name: 'Phường Minh Khai', kmOffset: 1.8 },
      { name: 'Phường Tây Tựu', kmOffset: 3.0 },
      { name: 'Phường Thượng Cát', kmOffset: 4.0 },
    ]
  },
  {
    id: 'dong-da',
    name: 'Quận Đống Đa',
    baseKm: 5.8,
    wards: [
      { name: 'Phường Láng Thượng', kmOffset: -1.2 },
      { name: 'Phường Láng Hạ', kmOffset: -0.6 },
      { name: 'Phường Ô Chợ Dừa', kmOffset: 0.2 },
      { name: 'Phường Cát Linh', kmOffset: 0.3 },
      { name: 'Phường Trung Liệt', kmOffset: 0.0 },
      { name: 'Phường Quang Trung', kmOffset: 0.4 },
      { name: 'Phường Kim Liên', kmOffset: 0.8 },
      { name: 'Phường Phương Mai', kmOffset: 1.0 },
      { name: 'Phường Khâm Thiên', kmOffset: 0.7 },
      { name: 'Phường Nam Đồng', kmOffset: 0.5 },
      { name: 'Phường Thổ Quan', kmOffset: 0.8 },
      { name: 'Phường Văn Miếu', kmOffset: 0.6 },
    ]
  },
  {
    id: 'ba-dinh',
    name: 'Quận Ba Đình',
    baseKm: 6.2,
    wards: [
      { name: 'Phường Vĩnh Phúc', kmOffset: -1.5 },
      { name: 'Phường Cống Vị', kmOffset: -1.2 },
      { name: 'Phường Liễu Giai', kmOffset: -0.8 },
      { name: 'Phường Ngọc Hà', kmOffset: 0.0 },
      { name: 'Phường Đội Cấn', kmOffset: -0.2 },
      { name: 'Phường Giảng Võ', kmOffset: -0.5 },
      { name: 'Phường Kim Mã', kmOffset: -0.3 },
      { name: 'Phường Thành Công', kmOffset: -0.6 },
      { name: 'Phường Điện Biên', kmOffset: 0.5 },
      { name: 'Phường Quán Thánh', kmOffset: 0.8 },
      { name: 'Phường Trúc Bạch', kmOffset: 1.0 },
    ]
  },
  {
    id: 'tay-ho',
    name: 'Quận Tây Hồ',
    baseKm: 6.5,
    wards: [
      { name: 'Phường Bưởi', kmOffset: -1.8 },
      { name: 'Phường Xuân La', kmOffset: -1.2 },
      { name: 'Phường Thụy Khuê', kmOffset: -0.5 },
      { name: 'Phường Phú Thượng', kmOffset: 0.2 },
      { name: 'Phường Nhật Tân', kmOffset: 0.8 },
      { name: 'Phường Quảng An', kmOffset: 1.2 },
      { name: 'Phường Tứ Liên', kmOffset: 1.5 },
      { name: 'Phường Yên Phụ', kmOffset: 1.2 },
    ]
  },
  {
    id: 'thanh-xuan',
    name: 'Quận Thanh Xuân',
    baseKm: 6.8,
    wards: [
      { name: 'Phường Nhân Chính', kmOffset: -1.2 },
      { name: 'Phường Thanh Xuân Bắc', kmOffset: -0.6 },
      { name: 'Phường Thanh Xuân Trung', kmOffset: -0.2 },
      { name: 'Phường Thanh Xuân Nam', kmOffset: 0.0 },
      { name: 'Phường Khương Trung', kmOffset: 0.5 },
      { name: 'Phường Khương Mai', kmOffset: 0.8 },
      { name: 'Phường Hạ Đình', kmOffset: 0.6 },
      { name: 'Phường Phương Liệt', kmOffset: 1.2 },
      { name: 'Phường Kim Giang', kmOffset: 1.0 },
    ]
  },
  {
    id: 'hoan-kiem',
    name: 'Quận Hoàn Kiếm',
    baseKm: 8.8,
    wards: [
      { name: 'Phường Cửa Nam', kmOffset: -0.8 },
      { name: 'Phường Hàng Bông', kmOffset: -0.5 },
      { name: 'Phường Hàng Gai', kmOffset: 0.0 },
      { name: 'Phường Hàng Trống', kmOffset: 0.2 },
      { name: 'Phường Tràng Tiền', kmOffset: 0.5 },
      { name: 'Phường Hàng Bạc', kmOffset: 0.3 },
      { name: 'Phường Hàng Đào', kmOffset: 0.2 },
      { name: 'Phường Hàng Buồm', kmOffset: 0.4 },
      { name: 'Phường Phan Chu Trinh', kmOffset: 0.6 },
      { name: 'Phường Lý Thái Tổ', kmOffset: 0.5 },
      { name: 'Phường Chương Dương', kmOffset: 1.2 },
    ]
  },
  {
    id: 'hai-ba-trung',
    name: 'Quận Hai Bà Trưng',
    baseKm: 9.5,
    wards: [
      { name: 'Phường Lê Đại Hành', kmOffset: -0.5 },
      { name: 'Phường Phạm Đình Hổ', kmOffset: 0.0 },
      { name: 'Phường Phố Huế', kmOffset: 0.2 },
      { name: 'Phường Bách Khoa', kmOffset: 0.0 },
      { name: 'Phường Đồng Tâm', kmOffset: 0.3 },
      { name: 'Phường Bạch Mai', kmOffset: 0.5 },
      { name: 'Phường Thanh Nhàn', kmOffset: 0.6 },
      { name: 'Phường Minh Khai', kmOffset: 1.2 },
      { name: 'Phường Vĩnh Tuy', kmOffset: 1.5 },
      { name: 'Phường Trương Định', kmOffset: 0.8 },
    ]
  },
  {
    id: 'ha-dong',
    name: 'Quận Hà Đông',
    baseKm: 10.5,
    wards: [
      { name: 'Phường Mộ Lao', kmOffset: -1.5 },
      { name: 'Phường Văn Quán', kmOffset: -1.0 },
      { name: 'Phường Yết Kiêu', kmOffset: 0.0 },
      { name: 'Phường Quang Trung', kmOffset: 0.2 },
      { name: 'Phường Hà Cầu', kmOffset: 0.5 },
      { name: 'Phường La Khê', kmOffset: 0.3 },
      { name: 'Phường Vạn Phúc', kmOffset: -0.5 },
      { name: 'Phường Kiến Hưng', kmOffset: 1.5 },
      { name: 'Phường Phú Lãm', kmOffset: 2.2 },
      { name: 'Phường Yên Nghĩa', kmOffset: 2.5 },
      { name: 'Phường Dương Nội', kmOffset: 0.8 },
    ]
  },
  {
    id: 'hoang-mai',
    name: 'Quận Hoàng Mai',
    baseKm: 11.5,
    wards: [
      { name: 'Phường Định Công', kmOffset: -1.5 },
      { name: 'Phường Giáp Bát', kmOffset: -0.8 },
      { name: 'Phường Tương Mai', kmOffset: -0.5 },
      { name: 'Phường Tân Mai', kmOffset: 0.0 },
      { name: 'Phường Thịnh Liệt', kmOffset: 0.5 },
      { name: 'Phường Hoàng Liệt', kmOffset: 0.8 },
      { name: 'Phường Yên Sở', kmOffset: 2.0 },
      { name: 'Phường Vĩnh Hưng', kmOffset: 1.5 },
      { name: 'Phường Lĩnh Nam', kmOffset: 2.2 },
    ]
  },
  {
    id: 'long-bien',
    name: 'Quận Long Biên',
    baseKm: 14.5,
    wards: [
      { name: 'Phường Ngọc Lâm', kmOffset: -1.5 },
      { name: 'Phường Bồ Đề', kmOffset: -1.0 },
      { name: 'Phường Gia Thụy', kmOffset: -0.5 },
      { name: 'Phường Long Biên', kmOffset: 0.0 },
      { name: 'Phường Sài Đồng', kmOffset: 1.5 },
      { name: 'Phường Phúc Đồng', kmOffset: 1.8 },
      { name: 'Phường Việt Hưng', kmOffset: 1.2 },
      { name: 'Phường Thạch Bàn', kmOffset: 2.5 },
    ]
  },
  {
    id: 'ngoai-thanh',
    name: 'Huyện Ngoại Thành Hà Nội',
    baseKm: 22.0,
    wards: [
      { name: 'Huyện Hoài Đức', kmOffset: -10.0 }, // ~12km
      { name: 'Huyện Đan Phượng', kmOffset: -6.0 }, // ~16km
      { name: 'Huyện Đông Anh', kmOffset: -4.0 }, // ~18km
      { name: 'Huyện Thanh Trì', kmOffset: -6.0 }, // ~16km
      { name: 'Huyện Gia Lâm', kmOffset: 0.0 }, // ~22km
      { name: 'Huyện Mê Linh', kmOffset: 3.0 }, // ~25km
      { name: 'Huyện Thường Tín', kmOffset: 5.0 }, // ~27km
      { name: 'Huyện Sóc Sơn', kmOffset: 10.0 }, // ~32km
      { name: 'Thị xã Sơn Tây', kmOffset: 20.0 }, // ~42km
      { name: 'Huyện Ba Vì', kmOffset: 30.0 }, // ~52km
    ]
  }
];

/**
 * Tính toán số Km chính xác từ 105 Doãn Kế Thiện dựa trên Quận + Phường + Địa chỉ chi tiết
 */
export function calculatePreciseKm(districtId: string, wardName: string, detailAddress: string = ''): number {
  const dist = HANOI_DISTRICTS.find((d) => d.id === districtId);
  if (!dist) return 5; // fallback

  const ward = dist.wards.find((w) => w.name === wardName);
  let km = dist.baseKm + (ward ? ward.kmOffset : 0);

  // Phân tích chi tiết ngõ ngách nếu có:
  // Nếu có từ khóa ngõ xa hoặc ngách sâu -> tính thêm 0.2 - 0.5km
  const detailLower = detailAddress.toLowerCase();
  if (detailLower.includes('ngách') || detailLower.includes('hẻm')) {
    km += 0.3;
  } else if (detailLower.includes('ngõ')) {
    km += 0.15;
  }

  // Làm tròn 1 chữ số thập phân, tối thiểu 0.8km
  return Math.max(0.8, Math.round(km * 10) / 10);
}

/**
 * Tính cước phí ship chuẩn theo quy định tiệm V&V Florielle:
 * - < 2km: 10.000₫
 * - 2km đến < 5km: 20.000₫
 * - 5km đến < 10km: 30.000₫
 * - 10km đến 15km: 45.000₫
 * - > 15km: 45.000₫ + 5.000₫/km cho mỗi km vượt
 */
export function calculateStandardShippingFee(km: number, flowerPrice: number = 0): {
  fee: number;
  originalFee: number;
  isFreeShip: boolean;
  tierLabel: string;
} {
  let fee = 10000;
  let tierLabel = '< 2km';

  if (km < 2) {
    fee = 10000;
    tierLabel = 'Dưới 2km (Bán kính gần)';
  } else if (km < 5) {
    fee = 20000;
    tierLabel = 'Từ 2km đến dưới 5km';
  } else if (km < 10) {
    fee = 30000;
    tierLabel = 'Từ 5km đến dưới 10km';
  } else if (km <= 15) {
    fee = 45000;
    tierLabel = 'Từ 10km đến 15km';
  } else {
    // Trên 15km: 45.000đ + 5.000đ/km
    const extraKm = Math.ceil(km - 15);
    fee = 45000 + extraKm * 5000;
    tierLabel = `Trên 15km (+5.000đ/km)`;
  }

  // Khuyến mãi Freeship cho đơn lớn >= 1.500.000đ bán kính < 5km (nếu tiệm có chính sách)
  const isFreeShip = false; // Mặc định tính chuẩn theo bảng giá, voucher freeship xử lý riêng

  return {
    fee: isFreeShip ? 0 : fee,
    originalFee: fee,
    isFreeShip,
    tierLabel
  };
}

/**
 * Kiểm tra khung giờ hoạt động của tiệm & tính phụ phí thời gian đặc biệt:
 * - Tiệm hoạt động: 07:30 - 11:30 và 13:00 - 22:00
 * - Khung giờ đặc biệt: 11:30 - 13:00 (nghỉ trưa) và 22:00 - 07:30 (đêm khuya/sáng sớm)
 * - Tự động tính dựa vào giờ giao dự kiến (Giờ đặt + 30-45 phút cắm hoa chuẩn bị + thời gian shipper di chuyển)
 */
export function checkSpecialOperatingHours(
  deliveryTimeSlot: string, 
  deliveryDateStr?: string,
  customSurcharge: number = 5000,
  customShifts?: {
    shift1Start?: string;
    shift1End?: string;
    shift2Start?: string;
    shift2End?: string;
  }
): {
  isSpecialHour: boolean;
  surcharge: number;
  reason: string;
} {
  const parseTimeToMin = (timeStr?: string, fallback: number = 0): number => {
    if (!timeStr) return fallback;
    const parts = timeStr.split(':');
    if (parts.length >= 2) {
      const h = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      if (!isNaN(h) && !isNaN(m)) return h * 60 + m;
    }
    return fallback;
  };

  const s1Start = parseTimeToMin(customShifts?.shift1Start, 450);  // 07:30
  const s1End = parseTimeToMin(customShifts?.shift1End, 690);      // 11:30
  const s2Start = parseTimeToMin(customShifts?.shift2Start, 780);  // 13:00
  const s2End = parseTimeToMin(customShifts?.shift2End, 1320);     // 22:00

  // Nếu khách chọn khung giờ đặt trước cụ thể:
  const slotLower = (deliveryTimeSlot || '').toLowerCase();
  
  if (slotLower.includes('đêm') || slotLower.includes('22:') || slotLower.includes('23:') || slotLower.includes('khuya') || slotLower.includes('sáng sớm') || slotLower.includes('06:') || slotLower.includes('trưa (11h30')) {
    return {
      isSpecialHour: true,
      surcharge: customSurcharge,
      reason: 'Giao khung giờ đặc biệt (Đêm khuya / Sáng sớm / Nghỉ trưa)'
    };
  }

  // Nếu là đơn giao gấp ngay bây giờ (kiểm tra giờ thực tế + 35 phút chuẩn bị cắm hoa):
  const now = new Date();
  const isToday = !deliveryDateStr || deliveryDateStr === now.toISOString().split('T')[0];
  
  if (isToday) {
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();
    const totalMinutesNow = currentHour * 60 + currentMin;
    const estDeliveryMinutes = totalMinutesNow + 40; // 35 phút gói hoa + 5-15 phút ship gần

    const isMorningShift = estDeliveryMinutes >= s1Start && estDeliveryMinutes <= s1End;
    const isAfternoonShift = estDeliveryMinutes >= s2Start && estDeliveryMinutes <= s2End;

    if (!isMorningShift && !isAfternoonShift) {
      return {
        isSpecialHour: true,
        surcharge: customSurcharge,
        reason: `Ước tính giao hoa ngoài giờ hoạt động tiêu chuẩn (${customShifts?.shift1Start || '07:30'}-${customShifts?.shift1End || '11:30'} & ${customShifts?.shift2Start || '13:00'}-${customShifts?.shift2End || '22:00'})`
      };
    }
  }

  return {
    isSpecialHour: false,
    surcharge: 0,
    reason: 'Trong khung giờ hoạt động tiêu chuẩn'
  };
}
