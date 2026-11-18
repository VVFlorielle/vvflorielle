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

export interface ArchivedFlowerProduct {
  id: string;
  originalProduct: FlowerProduct;
  deletedAt: string;
  formattedDeletedAt: string;
  originalCategoryId: CategoryId;
  originalCategoryName: string;
  sizeFormatted: string;
  sizeBytes: number;
  driveBackedUp: boolean;
  driveFileId?: string;
  driveBackupDate?: string;
}

export interface CartItem {
  product: FlowerProduct;
  quantity: number;
  ribbonColor: string;
  cardMessage: string;
}

export type OrderStatus = 'PENDING' | 'WAITING_DEPOSIT' | 'ARRANGING' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED';

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
  customerId?: string; // ID khách hàng liên kết (nếu đã đăng nhập)
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
  flowerVoucherCode?: string; // Mã voucher giảm giá hoa (Tầng 1)
  flowerDiscountAmount?: number; // Số tiền giảm cho hoa
  shippingVoucherCode?: string; // Mã voucher vận chuyển (Tầng 2)
  shippingDiscountAmount?: number; // Số tiền giảm phí ship
  pointsUsed?: number; // Số điểm hoa xu áp dụng (1 điểm = 1.000đ, max 50% tiền hoa)
  pointsDiscountAmount?: number; // Số tiền giảm từ hoa xu
  paymentMethod: 'COD' | 'BANK_TRANSFER';
  paymentType: PaymentType;
  depositAmount: number; // Số tiền cọc 50% hoặc 100%
  remainingAmount: number; // Số tiền còn lại thu khi giao
  paymentStatus: 'UNPAID' | 'PARTIAL_PAID' | 'PAID';
  isDepositPaid?: boolean;
  depositStatus?: 'PENDING' | 'APPROVED' | 'REJECTED'; // Tình trạng xác thực cọc
  depositRejectReason?: string; // Lý do từ chối cọc (thiếu tiền, sai nội dung...)
  cancellationReason?: string; // Lý do từ chối nhận đơn / huỷ đơn (hết hoa tươi, quá tải...)
  paymentBillImage?: string; // Ảnh biên lai cọc chuyển khoản khách gửi
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
  isCustomDesign?: boolean; // Đơn thiết kế hoa theo yêu cầu
  customDesignSampleImage?: string; // Ảnh mẫu hoa khách yêu cầu thiết kế riêng
  customFlowerBudget?: number;
  customFlowerDescription?: string;
  isBillArchived?: boolean; // true = Đã giải phóng chuỗi base64 để tối ưu bộ nhớ web
  billArchivedAt?: string; // Thời gian chuyển dữ liệu sang kho lưu trữ
  billDriveUrl?: string; // Link xem ảnh biên lai trên Google Drive
  billDriveFileId?: string; // ID tệp trên Google Drive
  aiBillAnalysis?: {
    success: boolean;
    verifiedAt: string;
    isValidBill: boolean;
    isSuccess: boolean;
    bankName?: string;
    transferredAmount?: number;
    recipientName?: string;
    recipientAccountNumber?: string;
    transactionId?: string;
    transactionTime?: string;
    transferContent?: string;
    confidenceScore: number;
    decision: 'APPROVE' | 'REJECT' | 'NEEDS_REVIEW';
    summary: string;
    modelUsed?: string;
    error?: string;
  };
  isAiAnalyzingBill?: boolean; // Cờ đang gửi tới Gemini Multimodal Vision phân tích
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

export type VoucherScope = 'FLOWER' | 'SHIPPING';
export type CampaignType = 'WEEKLY' | 'MONTHLY' | 'DOUBLE_DAY' | 'FLASH_DEAL' | 'BIRTHDAY' | 'LOYALTY_REDEEM' | 'HOLIDAY' | 'STANDARD';

export interface UserVoucher {
  id: string;
  code: string;
  title: string;
  discountAmount: number;
  minOrder: number;
  validUntil: string;
  discountType: 'FIXED' | 'PERCENT' | 'FREESHIP';
  voucherScope?: VoucherScope; // 'FLOWER' (giảm giá hoa) hoặc 'SHIPPING' (giảm phí ship)
  campaignType?: CampaignType;
  maxDiscount?: number;
  maxShippingRadiusKm?: number;
  isUsed: boolean;
  usedAt?: string;
  usedInOrderId?: string;
  source?: 'SYSTEM_AIRDROP' | 'LOYALTY_REDEEM' | 'WELCOME' | 'ADMIN_GRANTED';
}

export type CustomerTier = 'Thành viên mới' | 'Hội viên' | 'Bạc' | 'Vàng' | 'Kim Cương';

export interface CustomerUser {
  id: string;
  accountCode?: string; // Mã tài khoản định danh hội viên duy nhất (VD: 'VVF-CUST-849201')
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
  isBirthdateLocked?: boolean; // true = Ngày/tháng sinh đã khóa cố định, chỉ cho phép sửa năm sinh
  lastBirthdayVoucherYearUsed?: number; // Năm gần nhất đã áp dụng ưu đãi sinh nhật (chống dùng > 1 lần/năm)
  notes?: string;
  status?: 'ACTIVE' | 'BLOCKED' | 'DELETED';
  favoriteFlowers?: string[];
  tags?: string[]; // Nhãn phân loại khách hàng (VD: ['Doanh Nghiệp', 'VIP Khai Trương', 'Tone Pastel'])
  savedAddresses?: SavedAddress[]; // Sổ địa chỉ người nhận (tối đa 4 địa chỉ)
  userVouchers?: UserVoucher[]; // Danh sách voucher khách đã đổi bằng điểm
  otpCode?: string;
  otpExpiresAt?: number;
  integrityHash?: string; // HMAC SHA-256 Checksum niêm phong toàn vẹn dữ liệu điểm & chi tiêu (chống sửa F12)
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
  storeOperationalStatus?: 'AUTO' | 'OPEN' | 'BREAK' | 'CLOSED'; // Trạng thái tiệm: Tự động theo giờ, Mở Cửa, Tạm Nghỉ, Đóng Cửa
  logoHorizontalUrl?: string; // Logo ngang cho Header & Quản trị (/logo-vvflorielle-horizontal.webp)
  logoVerticalUrl?: string;   // Logo dọc / khối vuông cho Footer, Hóa đơn & Thiệp (/logo.png)
  faviconUrl?: string;        // Icon nhỏ của web / Favicon tab trình duyệt (/logo-vvflorielle-square.webp)
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
  floralCornerTopImage?: string; // URL ảnh hoa góc trên (mặc định chung)
  floralCornerTopLeftImage?: string; // URL ảnh hoa góc trên bên trái riêng biệt
  floralCornerTopRightImage?: string; // URL ảnh hoa góc trên bên phải riêng biệt
  floralCornerTopRightFlip?: boolean; // Tự động lật gương đối xứng cho góc phải (Mặc định: true)
  floralCornerBottomImage?: string; // URL ảnh hoa góc dưới (Peach Lisianthus)
  primaryColor?: string; // Màu thương hiệu chủ đạo (Mặc định: #059669)
  secondaryColor?: string; // Màu nhấn hover/active (Mặc định: #047857)
  fontFamily?: string; // Font chữ thương hiệu (Mặc định: Playfair Display)
  customDomain?: string; // https://vvflorielle.vn
  voiceAlertsEnabled: boolean;
  autoApproveWaitMinutes: number; // Mặc định 2 phút
  depositRate?: number; // Tỉ lệ cọc mặc định (Mặc định: 50, tùy chỉnh 30 - 100%)
  depositRequired?: boolean; // Bắt buộc cọc trước khi cắm hoa (Mặc định: true)
  minOrderForDeposit?: number; // Ngưỡng đơn tối thiểu cần cọc (Mặc định: 0đ; nếu > 0 đơn dưới mức này cho COD 100%)
  enableAutoApproveDeposit?: boolean; // Cho phép AI tự duyệt cọc (Mặc định: false để an toàn tài chính)
  pointsPerAmount?: number; // Số tiền quy đổi 1 điểm thưởng (Mặc định: 10.000đ = 1 điểm)
  pointsMultiplier?: number; // Hệ số nhân điểm thưởng (Mặc định: 1, lễ Tết x2)
  gmailAppPassword?: string;
  gmailSenderEmail?: string;
  googleDriveWebhookUrl?: string; // URL Google Apps Script Web App để tự động đẩy bill lên Google Drive
  googleDriveFolderUrl?: string; // Link chia sẻ thư mục Google Drive của tiệm
  googleDriveFolderId?: string; // ID thư mục trích xuất từ link chia sẻ
  billArchiveRetentionDays?: number; // Số ngày giữ ảnh bill trên web trước khi lưu trữ (Mặc định: 7 ngày)
  autoArchiveToDriveEnabled?: boolean; // Tự động đồng bộ lên Drive khi quá hạn
  autoPurgeLocalBase64Enabled?: boolean; // Tự động giải phóng base64 cục bộ để tránh tràn bộ nhớ web
  geminiApiKey?: string; // Khóa Google Gemini API dùng cho Trợ lý AI đọc bill & tự duyệt cọc và chatbot Flori
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
  voucherScope?: VoucherScope; // 'FLOWER' (giảm giá hoa) hoặc 'SHIPPING' (giảm phí ship)
  campaignType?: CampaignType; // Phân loại chiến dịch (WEEKLY, MONTHLY, DOUBLE_DAY, FLASH_DEAL, BIRTHDAY...)
  maxDiscount?: number;
  isActive: boolean;
  isWelcomeVoucher?: boolean;
  pointsToRedeem?: number; // Số điểm cần để đổi (100, 200, 300)
  usedByCustomerIds?: string[]; // Danh sách ID khách đã sử dụng voucher này
  showOnPublicWeb?: boolean; // Hiển thị trên popup / banner khuyến mãi chung
  usageLimit?: number; // Giới hạn tổng lượt dùng (VD: 50 lượt, 210 lượt)
  usedCount?: number; // Số lượt đã dùng thực tế
  hourlyDealStart?: string; // Giờ bắt đầu flash deal (VD: '12:00')
  hourlyDealEnd?: string; // Giờ kết thúc flash deal (VD: '14:00')
  minQuantity?: number; // Số lượng tối thiểu sản phẩm trong giỏ
  maxShippingRadiusKm?: number; // Giới hạn bán kính freeship (VD: 20km)
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

export type SecuritySeverity = 'INFO' | 'WARNING' | 'CRITICAL';
export type SecurityEventType =
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILED'
  | 'ACCOUNT_LOCKED'
  | 'VIETQR_BANK_CHANGE'
  | 'PIN_CHANGE'
  | 'PASSWORD_CHANGE'
  | 'POINT_ADJUSTMENT'
  | 'VOUCHER_DIRECT_DROP'
  | 'ORDER_STATUS_OVERRIDE'
  | 'DATA_ERASURE_REQUEST'
  | 'CUSTOMER_IDENTITY_CHANGED'
  | 'SESSION_TIMEOUT'
  | 'SETTINGS_CHANGE';

export interface SecurityAuditLogItem {
  id: string;
  timestamp: string;
  actor: string; // 'admin' | 'vvflorielle' | 'chuquan' | 'CUSTOMER:...' | 'SYSTEM'
  eventType: SecurityEventType;
  severity: SecuritySeverity;
  description: string;
  details?: Record<string, any>;
}

export type ReviewStatus = 'PENDING' | 'APPROVED' | 'HIDDEN';

export interface CustomerReview {
  id: string;
  customerName: string;
  customerPhone?: string; // Ẩn dạng 0829***654 khi hiển thị công khai
  customerAvatar?: string;
  rating: number; // 1 - 5 stars
  title?: string;
  comment: string;
  productName?: string;
  orderId?: string;
  images?: string[]; // Ảnh hoa thực tế do khách gửi
  createdAt: string;
  status: ReviewStatus; // 'PENDING' | 'APPROVED' | 'HIDDEN'
  isPinned?: boolean; // Ghim lên đầu trang chủ
  adminReply?: string; // Lời cảm ơn / phản hồi của tiệm
  adminRepliedAt?: string;
  source?: 'CUSTOMER_WEB' | 'ZALO_FEEDBACK' | 'HOTLINE';
}


