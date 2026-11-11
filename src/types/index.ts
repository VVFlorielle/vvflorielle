export type CategoryId = 'all' | 'khai-truong' | 'sinh-nhat' | 'tinh-yeu' | 'lan-ho-diep' | 'chuc-mung' | 'chia-buon' | string;

export interface FlowerCategory {
  id: CategoryId;
  name: string;
  icon: string;
  description: string;
  imageUrl?: string;
  bannerUrl?: string;
  tagline?: string;
  order?: number;
  isActive?: boolean;
}

export interface FlowerProduct {
  id: string;
  name: string;
  categoryId: CategoryId;
  price: number;
  originalPrice?: number;
  tag?: string;
  imageUrl: string;
  flowerTypes: string[]; // ví dụ: ['Hoa hồng Ecuador', 'Baby trắng', 'Lá bạc']
  description: string;
  meaning: string;
  gradientTheme: {
    bg: string;
    accent: string;
    tagBg: string;
  };
  isAvailable: boolean;
  rating: number;
  reviewCount: number;
  relatedProductIds?: string[];
}

export interface CartItem {
  product: FlowerProduct;
  quantity: number;
  ribbonColor: string;
  cardMessage: string;
}

export type OrderStatus = 'PENDING' | 'ARRANGING' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED';

export type PaymentType = 'COD' | 'VIETQR_FULL' | 'VIETQR_DEPOSIT_50';

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  ribbonColor: string;
  cardMessage: string;
}

export interface Order {
  id: string; // 6 số ngẫu nhiên duy nhất (ví dụ: '849201')
  senderName: string;
  senderPhone: string;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  deliveryDate: string;
  deliveryTimeSlot: string;
  cardMessage: string;
  items: OrderItem[];
  totalAmount: number; // Tổng giá hoa + Phí ship - Giảm giá
  flowerPrice: number; // Tổng tiền hoa gốc
  shippingDistanceKm: number; // Khoảng cách giao (km) tính từ 105 Doãn Kế Thiện
  shippingFee: number; // Phí ship tính theo km hoặc do admin điều chỉnh
  shippingFeeAdjusted?: boolean;
  discountAmount: number;
  voucherCode?: string;
  paymentMethod: 'COD' | 'BANK_TRANSFER';
  paymentType: PaymentType;
  depositAmount: number; // Số tiền cọc 50% hoặc 100%
  remainingAmount: number; // Số tiền còn lại thu khi giao
  paymentStatus: 'UNPAID' | 'PARTIAL_PAID' | 'PAID';
  isDepositPaid?: boolean;
  paymentBillImage?: string; // Ảnh biên lai khách gửi
  billImageDataUrl?: string; // Alias
  paymentBillUploadedAt?: string;
  paymentApprovedBy?: 'ADMIN' | 'AUTO_ASSISTANT';
  depositApprovedBy?: 'ADMIN' | 'AUTO_ASSISTANT'; // Alias
  paymentApprovedAt?: string;
  status: OrderStatus;
  createdAt: string;
  note?: string;
  pointsAwarded?: number;
  pointsAwardedAt?: string;
  isGiftDelivery?: boolean; // Khách chọn đặt gửi hoa tặng hộ
  revealSenderToRecipient?: boolean; // true = Tiết lộ tên người gửi, false = Tặng bí mật / Giấu tên
  senderAgreedOverDistance?: boolean; // Khách đã xác nhận tự chịu trách nhiệm khi giao xa > 20km
  weatherCondition?: string; // Tình trạng thời tiết khi tạo đơn
  weatherSurcharge?: number; // Phụ phí thời tiết xấu (+5k / +10k)
  specialHoursSurcharge?: number; // Phụ phí giao ngoài giờ hoạt động (+10k)
}

export type WeatherCondition = 'sunny' | 'rain' | 'cold' | 'storm';

export interface WeatherState {
  condition: WeatherCondition;
  surcharge: number; // 0, 5000, 10000, 15000
  label: string;
  note: string;
  mascotIcon: string;
  lastUpdated: string;
  lastPromptTime: number; // timestamp
}

export interface SavedAddress {
  id: string;
  name: string; // Tên gợi nhớ: "Nhà riêng", "Văn phòng công ty", "Người thân"...
  recipientName: string;
  recipientPhone: string;
  city?: string; // Mặc định 'Hà Nội'
  districtId?: string; // 'cau-giay', 'ba-dinh'...
  districtName?: string;
  wardName?: string;
  detailAddress?: string; // Số nhà, ngõ, ngách...
  recipientAddress: string; // Địa chỉ đầy đủ
  distanceKm?: number;
  note?: string;
  isDefault?: boolean;
}

export type CustomerTier = 'Thành viên mới' | 'Hội viên' | 'Bạc' | 'Vàng' | 'Kim Cương';

export interface CustomerUser {
  id: string;
  phone: string;
  fullName: string;
  email?: string;
  password?: string;
  address?: string;
  points: number;
  tier: CustomerTier;
  isVerified: boolean; // false = Thành viên thường (điểm 70%), true = Hội viên (điểm 100%)
  totalSpent: number;
  ordersCount: number;
  registeredAt?: string;
  birthday?: string; // Định dạng YYYY-MM-DD
  notes?: string;
  status?: 'ACTIVE' | 'BLOCKED';
  favoriteFlowers?: string[];
  savedAddresses?: SavedAddress[]; // Sổ địa chỉ người nhận (tối đa 4 địa chỉ)
  otpCode?: string;
  otpExpiresAt?: number;
}

export interface ContactChannel {
  id: string;
  type: 'zalo' | 'hotline' | 'tiktok' | 'facebook' | 'messenger' | 'telegram' | 'maps' | 'custom';
  label: string;
  title?: string;
  value: string;
  link: string;
  url?: string;
  iconColor?: string;
  badge?: string;
  isEnabled: boolean;
  order: number;
}

export interface ShopSettings {
  name: string;
  slogan: string;
  tagline?: string;
  hotline: string;
  zalo: string;
  address: string; // 105 Doãn Kế Thiện, Cầu Giấy, Hà Nội
  email: string;
  openingHours: string;
  shift1Start?: string; // Mặc định: '07:30'
  shift1End?: string;   // Mặc định: '11:30'
  shift2Start?: string; // Mặc định: '13:00'
  shift2End?: string;   // Mặc định: '22:00'
  rainSurcharge?: number;   // Mức phụ phí Mưa gió (mặc định: 5000)
  coldSurcharge?: number;   // Mức phụ phí Lạnh rét (mặc định: 5000)
  stormSurcharge?: number;  // Mức phụ phí Bão lũ (mặc định: 5000)
  nightShiftSurcharge?: number; // Ca đêm / Sáng sớm (mặc định: 5000)
  noonShiftSurcharge?: number;  // Ca trưa (mặc định: 5000)
  bankName: string;
  bankAccount: string;
  bankHolder: string;
  bankId?: string;
  bankQrImageUrl?: string;
  useAutoVietQr?: boolean;
  freeShipThreshold: number;
  freeShipRadiusKm?: number; // Bán kính áp dụng Freeship (mặc định 3km)
  standardShipFee: number;
  shippingFeePerKm: number; // 10.000đ/km
  warnDeliveryRadiusKm?: number; // Bán kính cảnh báo hoa giảm tươi (mặc định 20km)
  maxDeliveryRadiusKm?: number; // Bán kính giao tối đa (mặc định 50km)
  deliveryTimeEstimate?: string; // Thời gian giao hàng cam kết (mặc định: 'Từ 15 phút nội thành, 60 phút ngoại thành')
  mascotImageUrl?: string; // URL ảnh/gif linh vật AI tùy chỉnh
  floralCornerTopImage?: string; // URL ảnh hoa góc trên (Rose & Peony)
  floralCornerBottomImage?: string; // URL ảnh hoa góc dưới (Peach Lisianthus)
  customDomain?: string; // https://vvflorielle.vn
  voiceAlertsEnabled: boolean;
  autoApproveWaitMinutes: number; // Mặc định 2 phút
  gmailAppPassword?: string;
  gmailSenderEmail?: string;
}

export interface PromotionItem {
  id: string;
  code: string;
  title: string;
  description: string;
  discountAmount: number;
  minOrder: number;
  badge: string;
  validUntil: string;
  discountType: 'FIXED' | 'PERCENT' | 'FREESHIP';
  maxDiscount?: number;
  isActive: boolean;
  isWelcomeVoucher?: boolean;
  pointsToRedeem?: number; // Số điểm cần để đổi (100, 200, 300)
}

export interface BlogArticle {
  id: string;
  title: string;
  summary: string;
  category: string;
  readTime: string;
  publishedAt: string;
  imageUrl: string;
  content: string[];
}

export interface HeroBannerConfig {
  badge: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaSecondaryText: string;
  backgroundImage?: string;
  features?: string[];
}

export interface AppNotification {
  id: string;
  recipientRole: 'ADMIN' | 'CUSTOMER' | 'ALL';
  recipientId?: string; // SĐT hoặc ID khách hàng
  title: string;
  message: string;
  type: 'ORDER_NEW' | 'ORDER_STATUS' | 'PAYMENT_BILL' | 'POINTS_REWARD' | 'PROMO' | 'SYSTEM';
  orderId?: string;
  createdAt: string;
  isRead: boolean;
  avatarIcon?: string;
  actionUrl?: string;
}

export interface MarqueeItem {
  id: string;
  text: string;
  tag?: string;
  link?: string;
  isEnabled: boolean;
  order: number;
}

export type AdminAccountType = 'admin' | 'vvflorielle' | 'chuquan';
export type AdminViewMode = 'STUDIO_CMS' | 'BOUTIQUE_OPS';
export type SessionRole = 'ADMIN' | 'KHACHHANG' | 'GUEST';
export type StoreView = 'store' | 'catalog' | 'about' | 'contact' | 'care' | 'customer' | 'admin' | 'owner';

