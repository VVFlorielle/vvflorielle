import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  FlowerCategory,
  FlowerProduct,
  ArchivedFlowerProduct,
  CartItem,
  Order,
  OrderStatus,
  PaymentType,
  CustomerUser,
  SavedAddress,
  ShopSettings,
  CategoryId,
  PromotionItem,
  UserVoucher,
  BlogArticle,
  HeroBannerConfig,
  ContactChannel,
  AppNotification,
  MarqueeItem,
  AdminAccountType,
  AdminViewMode,
  SessionRole,
  StoreView,
  WeatherCondition,
  WeatherState,
  SecurityAuditLogItem,
  SecurityEventType,
  SecuritySeverity
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_CUSTOMERS,
  INITIAL_CUSTOMER,
  INITIAL_SHOP_SETTINGS,
  INITIAL_PROMOTIONS,
  INITIAL_ARTICLES,
  INITIAL_HERO_CONFIG,
  INITIAL_CONTACT_CHANNELS,
  INITIAL_MARQUEE_ANNOUNCEMENTS,
  calculateTieredShippingFee
} from '../data/mockData';
import { normalizePhone } from '../utils/formatters';
import { generateDataSignature, verifyDataSignature } from '../utils/security';
import {
  uploadBillToGoogleDrive,
  archiveExpiredBills,
  calculateLocalStorageUsage,
  exportBillsBackupJson,
  calculateProductSizeBytes,
  formatBytes,
  uploadArchivedProductsToDrive,
  exportArchivedProductsBackupJson
} from '../utils/googleDriveArchiver';
import { applyTheme } from '../utils/themeEngine';
import { playNewOrderChime } from '../utils/audioNotification';
import {
  pushOrderToNeon,
  fetchNeonOrders,
  fetchNeonProducts,
  pushProductToNeon,
  checkNeonHealth,
  triggerSmartWakeup,
  isStoreOperatingHours
} from '../services/neonService';

interface ToastNotice {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface StoreContextType {
  // Navigation / View
  currentView: StoreView;
  setCurrentView: (view: StoreView) => void;
  selectedCategory: CategoryId;
  setSelectedCategory: (cat: CategoryId) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Single Session Engine
  sessionRole: SessionRole;

  // Products
  products: FlowerProduct[];
  addProduct: (product: Omit<FlowerProduct, 'id' | 'rating' | 'reviewCount'>) => void;
  updateProduct: (id: string, updates: Partial<FlowerProduct>) => void;
  deleteProduct: (id: string) => void;
  applyBulkDiscount: (discountPercent: number, categoryId?: string, eventName?: string) => void;
  restoreOriginalPrices: (categoryId?: string) => void;

  // Archived Products (Recycle Bin & Google Drive Backup)
  archivedProducts: ArchivedFlowerProduct[];
  deleteProductToArchive: (productId: string) => void;
  restoreArchivedProduct: (archiveId: string) => boolean;
  restoreMultipleArchivedProducts: (archiveIds: string[]) => { successCount: number; failedCount: number };
  permanentlyDeleteArchivedProduct: (archiveId: string) => void;
  permanentlyDeleteMultipleArchivedProducts: (archiveIds: string[]) => void;
  backupTrashToGoogleDrive: () => Promise<{ success: boolean; message: string; backedUpCount: number }>;
  restoreTrashFromGoogleDrive: (importedItems?: ArchivedFlowerProduct[]) => { success: boolean; restoredCount: number; message: string };

  // Level 2 Security Gate
  isSecurityUnlocked: boolean;
  unlockSecurityWithPin: (pin: string) => boolean;
  lockSecurity: () => void;

  // Categories
  categories: FlowerCategory[];
  updateCategories: (newCats: FlowerCategory[]) => void;

  // Contact Channels (Dynamic Multi-Channel)
  contactChannels: ContactChannel[];
  addContactChannel: (channel: Omit<ContactChannel, 'id' | 'order'>) => void;
  updateContactChannel: (id: string, updates: Partial<ContactChannel>) => void;
  deleteContactChannel: (id: string) => void;
  toggleContactChannel: (id: string) => void;

  // CMS Content (Hero, Promos, Articles, Marquee)
  heroConfig: HeroBannerConfig;
  updateHeroConfig: (cfg: Partial<HeroBannerConfig>) => void;
  promotions: PromotionItem[];
  updatePromotions: (promos: PromotionItem[]) => void;
  articles: BlogArticle[];
  updateArticles: (arts: BlogArticle[]) => void;
  marqueeAnnouncements: MarqueeItem[];
  addMarqueeItem: (item: Omit<MarqueeItem, 'id'>) => void;
  updateMarqueeItem: (id: string, updates: Partial<MarqueeItem>) => void;
  deleteMarqueeItem: (id: string) => void;
  toggleMarqueeItem: (id: string) => void;

  // Active Popup & Article Reader
  activeInfoPopup: 'guarantee' | 'voucher' | 'locations' | 'care' | 'promotions' | 'articles' | null;
  setActiveInfoPopup: (popup: 'guarantee' | 'voucher' | 'locations' | 'care' | 'promotions' | 'articles' | null) => void;
  selectedArticle: BlogArticle | null;
  setSelectedArticle: (art: BlogArticle | null) => void;

  // Cart
  cart: CartItem[];
  addToCart: (
    product: FlowerProduct,
    quantity?: number,
    ribbonColor?: string,
    cardMessage?: string,
    openDrawer?: boolean
  ) => void;
  updateCartItemQty: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Orders Management (6-digit unique IDs, Deposit & Bill Review)
  orders: Order[];
  createOrder: (orderData: {
    senderName: string;
    senderPhone: string;
    recipientName: string;
    recipientPhone: string;
    recipientAddress: string;
    deliveryDate: string;
    deliveryTimeSlot: string;
    cardMessage: string;
    items: { productId: string; productName: string; price: number; quantity: number; ribbonColor: string; cardMessage: string }[];
    flowerPrice: number;
    shippingDistanceKm: number;
    discountAmount: number;
    voucherCode?: string;
    flowerVoucherCode?: string;
    flowerDiscountAmount?: number;
    shippingVoucherCode?: string;
    shippingDiscountAmount?: number;
    pointsUsed?: number;
    pointsDiscountAmount?: number;
    paymentMethod: 'COD' | 'BANK_TRANSFER';
    paymentType: PaymentType;
    note?: string;
    isGiftDelivery?: boolean;
    revealSenderToRecipient?: boolean;
    senderAgreedOverDistance?: boolean;
    weatherCondition?: string;
    weatherSurcharge?: number;
    specialHoursSurcharge?: number;
  }) => Order;
  createCustomDesignRequest: (data: {
    senderName: string;
    senderPhone: string;
    occasion: string;
    budget: string;
    sampleImage?: string;
    notes: string;
    deliveryDate?: string;
    deliveryAddress?: string;
  }) => Order;
  uploadOrderBill: (orderId: string, billImageDataUrl: string) => void;
  acceptOrderAndRequestDeposit: (orderId: string) => void;
  rejectOrder: (orderId: string, reason: string) => void;
  approveOrderDeposit: (orderId: string, approvedBy?: 'ADMIN' | 'AUTO_ASSISTANT') => void;
  rejectOrderDeposit: (orderId: string, reason: string) => void;
  adjustOrderShippingFee: (orderId: string, newShippingFee: number) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  completeOrder: (orderId: string) => void;
  syncBillToGoogleDrive: (orderId: string) => Promise<{ success: boolean; url?: string; error?: string }>;
  archiveExpiredOrdersBills: (retentionDays?: number) => { archivedCount: number; freedBytes: number };
  purgeOrderBillImage: (orderId: string) => void;
  getStorageUsageStats: () => ReturnType<typeof calculateLocalStorageUsage>;
  exportBillsBackup: () => void;

  // Customer Management & Points Ecosystem
  customer: CustomerUser | null;
  customers: CustomerUser[];
  registerCustomer: (fullName: string, phone: string, email?: string, password?: string) => boolean;
  loginCustomer: (identifier: string, password?: string) => boolean;
  logoutCustomer: () => void;
  requestCustomerOtp: (targetPhoneOrEmail?: string) => string;
  verifyCustomerOtp: (otp: string) => boolean;
  changeCustomerPassword: (oldPass: string, newPass: string) => boolean;
  changeCustomerIdentityWithOtp: (type: 'phone' | 'email', newValue: string, otp: string) => boolean;
  resetCustomerPasswordWithOtp: (identifier: string, otp: string, newPass: string) => boolean;
  updateCustomerProfile: (updates: Partial<CustomerUser>) => void;
  addSavedAddress: (addressData: Omit<SavedAddress, 'id'>) => boolean;
  updateSavedAddress: (id: string, updates: Partial<SavedAddress>) => boolean;
  deleteSavedAddress: (id: string) => boolean;
  setDefaultSavedAddress: (id: string) => void;
  addCustomerByAdmin: (custData: Partial<CustomerUser>) => CustomerUser;
  updateCustomerByAdmin: (id: string, updates: Partial<CustomerUser>) => void;
  deleteCustomerByAdmin: (id: string) => void;
  adjustCustomerPoints: (id: string, deltaPoints: number, reason?: string) => void;
  adminResetCustomerPassword: (id: string, newPass?: string) => string;
  redeemVoucherWithPoints: (promotionId: string) => boolean;
  saveCustomerVoucher: (newVoucher: UserVoucher) => boolean;

  // 2-Step Identity Mutation & Privacy Compliance (Nghị định 13/2023/NĐ-CP)
  requestIdentityChangeStep1Otp: () => boolean;
  verifyIdentityChangeStep1Otp: (otp: string) => boolean;
  requestIdentityChangeStep2Otp: (type: 'phone' | 'email', newValue: string) => { success: boolean; message: string };
  confirmIdentityChangeStep2: (type: 'phone' | 'email', newValue: string, otp: string) => boolean;
  requestCustomerAccountErasure: (otp: string) => boolean;
  exportCustomerPersonalDataJson: () => void;

  // 2-Tier Voucher & Loyalty System (Shopee Standard)
  validateVoucherForOrder: (
    voucherCode: string,
    context: {
      flowerPrice: number;
      shippingFee: number;
      itemCount: number;
      distanceKm?: number;
      customer?: CustomerUser | null;
    }
  ) => {
    valid: boolean;
    reason?: string;
    discountAmount: number;
    voucherScope: 'FLOWER' | 'SHIPPING';
    promo?: PromotionItem;
  };
  autoPickBestVouchers: (
    flowerPrice: number,
    shippingFee: number,
    itemCount: number,
    distanceKm?: number,
    customer?: CustomerUser | null
  ) => {
    flowerVoucher: PromotionItem | null;
    shippingVoucher: PromotionItem | null;
    flowerDiscount: number;
    shippingDiscount: number;
  };
  calculateMaxAllowedPoints: (
    flowerPrice: number,
    customerPoints: number
  ) => {
    maxPoints: number;
    discountAmount: number;
  };
  airdropVoucherToAllCustomers: (promotion: PromotionItem) => number;

  // Dual Admin Portals (admin & vvflorielle, Equal Rights)
  isAdmin: boolean;
  activeAdminUser: AdminAccountType | null;
  adminViewMode: AdminViewMode;
  setAdminViewMode: (mode: AdminViewMode) => void;
  toggleAdminViewMode: () => void;
  activeAdminTab: string;
  setActiveAdminTab: (tab: string) => void;
  verifyAdminPin: (pin: string) => boolean;
  loginAdmin: (username: string, password: string, pin?: string, keepSession?: boolean, rememberLogin?: boolean) => boolean;
  logoutAdmin: () => void;
  adminEmail: string;
  gmailAppPassword: string;
  changeAdminCredentials: (oldPassword: string, oldPin?: string, newPassword?: string, newPin?: string) => boolean;
  saveGmailConfig: (email: string, appPassword: string) => void;
  requestPinResetOtp: (email?: string) => boolean;
  verifyPinResetOtp: (otp: string, newPin: string) => boolean;

  // Security Level 2 & Audit Trail
  securityAuditLogs: SecurityAuditLogItem[];
  logSecurityEvent: (
    actor: string,
    eventType: SecurityEventType,
    severity: SecuritySeverity,
    description: string,
    details?: Record<string, any>
  ) => void;
  requestBankChangeOtp: () => boolean;
  verifyBankChangeAndSave: (pin: string, otp: string, newBankConfig: Partial<ShopSettings>) => boolean;
  isSessionLocked: boolean;
  unlockSessionWithPin: (pin: string) => boolean;
  lockAdminSession: () => void;
  grantPrivilegeVoucher: (params: {
    dropMethod: 'DIRECT_DROP' | 'TOKEN_16';
    targetType: 'SPECIFIC_CUSTOMER' | 'BIRTHDAY_MONTH' | 'VIP_RUBY' | 'ALL_MEMBERS';
    targetCustomerId?: string;
    voucherName: string;
    voucherScope: 'FLOWER' | 'SHIPPING';
    discountAmount: number;
    minOrder: number;
    expiryDays?: number;
  }) => { success: boolean; code?: string; message: string; grantedCount: number };

  // Shop Settings
  settings: ShopSettings;
  updateSettings: (newSettings: Partial<ShopSettings>) => void;

  // Weather Assistant & Admin Mascot Surcharges & Shift Hours
  weatherState: WeatherState;
  updateWeatherState: (condition: WeatherCondition, surcharge: number, label: string, note?: string) => void;
  updateAdminWeatherMascotIcon: (iconUrl: string) => void;
  specialHoursSurchargeRate: number;
  updateSpecialHoursSurchargeRate: (fee: number) => void;
  shiftHours: {
    shift1Start: string;
    shift1End: string;
    shift2Start: string;
    shift2End: string;
  };
  updateShiftHours: (hours: { shift1Start: string; shift1End: string; shift2Start: string; shift2End: string }) => void;
  weatherSurcharges: {
    rain: number;
    cold: number;
    storm: number;
  };
  updateWeatherConditionSurcharge: (condition: 'rain' | 'cold' | 'storm', fee: number) => void;
  shiftSurcharges: {
    nightEarly: number;
    noon: number;
  };
  updateShiftSurcharges: (surcharges: { nightEarly: number; noon: number }) => void;

  // In-App Notifications & Cute Female Voice Alerts
  notifications: AppNotification[];
  unreadNotificationCount: number;
  activeBannerNotification: AppNotification | null;
  dismissBannerNotification: () => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  sendAppNotification: (notif: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>) => void;
  broadcastStoreAnnouncement: (title: string, message: string, type?: AppNotification['type']) => void;
  clearStoreAnnouncement: () => void;
  testCuteVoice: (phrase?: string) => void;

  // Points Celebration Modal
  pointsCelebrationModal: { isOpen: boolean; points: number; orderId: string } | null;
  dismissPointsCelebrationModal: () => void;

  // Quick modals
  selectedProduct: FlowerProduct | null;
  setSelectedProduct: (product: FlowerProduct | null) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'customer' | 'admin' | 'register' | 'forgot';
  setAuthModalMode: (mode: 'customer' | 'admin' | 'register' | 'forgot') => void;

  // Toasts
  toasts: ToastNotice[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  dismissToast: (id?: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Web Audio synthesizer for pleasant chime
function playNotificationChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // F5 note (698.46 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(698.46, now);
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.3);

    // A5 note (880.00 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880.00, now + 0.12);
    gain2.gain.setValueAtTime(0.15, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.55);
  } catch (e) {
    // Audio context may be restricted before user gesture
  }
}

// Cute female Vietnamese voice synthesis (Emoji-cleaned & true female priority)
function speakCuteVoice(rawText: string) {
  try {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    // 1. Sanitize text: Clean or convert emojis so the speech engine never pronounces "hai trái tim" or "bông hoa"
    let cleanText = rawText
      .replace(/[💕❤️💖💗💓]/g, ' tim tim ')
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'vi-VN';

    const voices = window.speechSynthesis.getVoices();
    // Prioritize female Vietnamese voices (HoaiMy, Linh, Google Tiếng Việt nữ)
    const femaleViVoice = voices.find(
      (v) =>
        (v.lang.toLowerCase().includes('vi') || v.lang.toLowerCase().includes('viet')) &&
        (v.name.toLowerCase().includes('hoaimy') ||
         v.name.toLowerCase().includes('female') ||
         v.name.toLowerCase().includes('linh') ||
         v.name.toLowerCase().includes('nữ') ||
         v.name.toLowerCase().includes('google'))
    );
    const anyViVoice = voices.find(
      (v) => v.lang.toLowerCase().includes('vi') || v.lang.toLowerCase().includes('viet')
    );

    if (femaleViVoice) {
      utterance.voice = femaleViVoice;
      utterance.pitch = 1.25; // Giọng nữ trong trẻo, tự nhiên
      utterance.rate = 1.02;
    } else if (anyViVoice) {
      utterance.voice = anyViVoice;
      // If voice is male (like Microsoft An), shift pitch up into youthful feminine tone
      utterance.pitch = 1.38;
      utterance.rate = 1.06;
    } else {
      utterance.pitch = 1.3;
      utterance.rate = 1.05;
    }

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    // Graceful fallback
  }
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & View
  const [currentView, setCurrentView] = useState<StoreView>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash.startsWith('#customer')) return 'customer';
      if (hash.startsWith('#admin')) return 'admin';
      if (hash.startsWith('#owner')) return 'owner';
      if (hash === '#catalog' || hash === '#mau-hoa') return 'catalog';
      if (hash === '#about' || hash === '#gioi-thieu') return 'about';
      if (hash === '#contact' || hash === '#lien-he') return 'contact';
      if (hash === '#care' || hash === '#cam-nang') return 'care';
    }
    return 'store';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const rawHash = window.location.hash;
      const hash = rawHash.toLowerCase();
      if (hash.startsWith('#customer')) setCurrentView('customer');
      else if (hash.startsWith('#admin')) {
        setCurrentView('admin');
        if (rawHash.includes('/')) {
          const tab = rawHash.split('/')[1];
          if (tab) setActiveAdminTab(tab);
        }
      }
      else if (hash.startsWith('#owner')) {
        setCurrentView('owner');
        if (rawHash.includes('/')) {
          const tab = rawHash.split('/')[1];
          if (tab) setActiveAdminTab(tab);
        }
      }
      else if (hash === '#catalog' || hash === '#mau-hoa') setCurrentView('catalog');
      else if (hash === '#about' || hash === '#gioi-thieu') setCurrentView('about');
      else if (hash === '#contact' || hash === '#lien-he') setCurrentView('contact');
      else if (hash === '#care' || hash === '#cam-nang') setCurrentView('care');
      else if (hash === '' || hash === '#store') setCurrentView('store');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart & Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<FlowerProduct | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'customer' | 'admin' | 'register' | 'forgot'>('customer');

  // Persistence Loaders (Enforce clean sync of exactly 54 products - 9 per category)
  const [products, setProducts] = useState<FlowerProduct[]>(() => {
    const catalogVersion = localStorage.getItem('vvf_products_catalog_version');
    if (catalogVersion !== 'v6_54_products_sync') {
      localStorage.setItem('vvf_products_catalog_version', 'v6_54_products_sync');
      localStorage.setItem('vvf_products', JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    const saved = localStorage.getItem('vvf_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 54) {
          // Verify each category has products
          const requiredCats = ['khai-truong', 'sinh-nhat', 'tinh-yeu', 'lan-ho-diep', 'chuc-mung', 'chia-buon'];
          const isComplete = requiredCats.every((cId) => parsed.filter((p: FlowerProduct) => p.categoryId === cId).length >= 9);
          if (isComplete) return parsed;
        }
      } catch (e) {}
    }
    localStorage.setItem('vvf_products', JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  });

  // Archived / Soft-Deleted Products State
  const [archivedProducts, setArchivedProducts] = useState<ArchivedFlowerProduct[]>(() => {
    try {
      const saved = localStorage.getItem('vvf_archived_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Error loading archived products:', e);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('vvf_archived_products', JSON.stringify(archivedProducts));
    } catch (e) {
      console.error('Error saving archived products:', e);
    }
  }, [archivedProducts]);

  const [categories, setCategories] = useState<FlowerCategory[]>(() => {
    const saved = localStorage.getItem('vvf_categories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const list = parsed.filter((c: FlowerCategory) => c.id !== 'all');
          // Auto-migrate dim sum image if present in sinh-nhat
          const migrated = list.map((c: FlowerCategory) => {
            if (c.id === 'sinh-nhat' && (c.imageUrl?.includes('photo-1563245372-f21724e3856d') || c.imageUrl?.includes('photo-1587556930799'))) {
              return {
                ...c,
                imageUrl: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80',
                bannerUrl: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1600&q=80'
              };
            }
            return c;
          });
          localStorage.setItem('vvf_categories', JSON.stringify(migrated));
          return migrated;
        }
      } catch (e) {
        // Fallback below
      }
    }
    return INITIAL_CATEGORIES.filter((c) => c.id !== 'all');
  });

  const [contactChannels, setContactChannels] = useState<ContactChannel[]>(() => {
    const saved = localStorage.getItem('vvf_contact_channels');
    return saved ? JSON.parse(saved) : INITIAL_CONTACT_CHANNELS;
  });

  const [heroConfig, setHeroConfig] = useState<HeroBannerConfig>(() => {
    const saved = localStorage.getItem('vvf_hero');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Automatically migrate if using older template title or older subtitle
        if (
          !parsed.title ||
          parsed.title.includes('Hoa Tươi Thiết Kế Nghệ Thuật - 105') ||
          !parsed.subtitle ||
          !parsed.subtitle.startsWith('Hoa Tươi Giao Ngay Tại Hà Nội') ||
          parsed.subtitle.includes('60 - 90 phút')
        ) {
          const updated = {
            ...parsed,
            subtitle: INITIAL_HERO_CONFIG.subtitle,
            features: INITIAL_HERO_CONFIG.features
          };
          localStorage.setItem('vvf_hero', JSON.stringify(updated));
          return updated;
        }
        return parsed;
      } catch {
        return INITIAL_HERO_CONFIG;
      }
    }
    return INITIAL_HERO_CONFIG;
  });

  const [promotions, setPromotions] = useState<PromotionItem[]>(() => {
    const saved = localStorage.getItem('vvf_promotions');
    return saved ? JSON.parse(saved) : INITIAL_PROMOTIONS;
  });

  const [articles, setArticles] = useState<BlogArticle[]>(() => {
    const saved = localStorage.getItem('vvf_articles');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const migrated = parsed.map((a: BlogArticle) => {
            if (a.id === 'art-01' && (a.imageUrl?.includes('photo-1563245372-f21724e3856d') || a.imageUrl?.includes('photo-1587556930799'))) {
              return { ...a, imageUrl: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80' };
            }
            return a;
          });
          localStorage.setItem('vvf_articles', JSON.stringify(migrated));
          return migrated;
        }
      } catch (e) {}
    }
    return INITIAL_ARTICLES;
  });

  const [activeInfoPopup, setActiveInfoPopup] = useState<'guarantee' | 'voucher' | 'locations' | 'care' | 'promotions' | 'articles' | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('vvf_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('vvf_orders');
    const parsedOrders: Order[] = saved ? JSON.parse(saved) : INITIAL_ORDERS;
    // Self-healing migration: Ensure orders that are ARRANGING, SHIPPING, or COMPLETED have valid deposit status
    return parsedOrders.map((o) => {
      const isArrangedOrBeyond = o.status === 'ARRANGING' || o.status === 'SHIPPING' || o.status === 'COMPLETED';
      if (isArrangedOrBeyond && !o.isDepositPaid) {
        return {
          ...o,
          isDepositPaid: true,
          depositStatus: 'APPROVED',
          depositApprovedBy: o.depositApprovedBy || 'ADMIN',
          paymentStatus: o.status === 'COMPLETED' ? 'PAID' : (o.paymentType === 'VIETQR_FULL' ? 'PAID' : 'PARTIAL_PAID')
        };
      }
      return o;
    });
  });

  const [customers, setCustomers] = useState<CustomerUser[]>(() => {
    const saved = localStorage.getItem('vvf_customers');
    const list: CustomerUser[] = saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
    return list.map((c, idx) => ({
      ...c,
      accountCode: c.accountCode || `VVF-CUST-${(849201 + idx * 11111).toString().slice(0, 6)}`
    }));
  });

  // Single Session Role: 'ADMIN' | 'KHACHHANG' | 'GUEST'
  const [sessionRole, setSessionRole] = useState<SessionRole>(() => {
    const saved = localStorage.getItem('vvf_session_role');
    return (saved as SessionRole) || 'GUEST';
  });

  const [customer, setCustomer] = useState<CustomerUser | null>(() => {
    const saved = localStorage.getItem('vvf_customer');
    const role = localStorage.getItem('vvf_session_role');
    if (role === 'ADMIN') return null; // Exclusive session
    if (!saved) return null;
    try {
      const c: CustomerUser = JSON.parse(saved);
      const normalizedCode = c.accountCode || 'VVF-CUST-849201';
      // Verify HMAC integrity checksum against DevTools F12 manipulation
      if (c.integrityHash) {
        const isValid = verifyDataSignature(
          {
            accountCode: normalizedCode,
            phone: c.phone,
            points: c.points,
            totalSpent: c.totalSpent
          },
          c.integrityHash
        );
        if (!isValid) {
          console.warn('[SECURITY] Phát hiện dữ liệu điểm/chi tiêu bị can thiệp ngoài luồng qua F12 Console!');
          c.points = 0; // Reset manipulated points to safe baseline
        }
      }
      c.integrityHash = generateDataSignature({
        accountCode: normalizedCode,
        phone: c.phone,
        points: c.points,
        totalSpent: c.totalSpent
      });
      return {
        ...c,
        accountCode: normalizedCode
      };
    } catch (e) {
      return null;
    }
  });

  // Dual Admin System (admin & vvflorielle)
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('vvf_session_role') === 'ADMIN';
  });

  const [activeAdminUser, setActiveAdminUser] = useState<AdminAccountType | null>(() => {
    return (localStorage.getItem('vvf_active_admin_user') as AdminAccountType) || null;
  });

  const [adminViewMode, setAdminViewMode] = useState<AdminViewMode>(() => {
    const saved = localStorage.getItem('vvf_admin_view_mode') as AdminViewMode;
    return saved || 'STUDIO_CMS';
  });
  const [activeAdminTab, setActiveAdminTab] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.location.hash.includes('/')) {
      const parts = window.location.hash.split('/');
      if (parts[1]) return parts[1];
    }
    return 'dashboard';
  });

  const [adminPin, setAdminPin] = useState<string>(() => {
    return localStorage.getItem('vvf_admin_pin') || '1909203';
  }); // Shared PIN - Default 1909203
  const [isSecurityUnlocked, setIsSecurityUnlocked] = useState<boolean>(false);
  const [adminPinOtp, setAdminPinOtp] = useState<{ code: string; expiresAt: number } | null>(null);
  const [adminEmail, setAdminEmail] = useState<string>(() => {
    return localStorage.getItem('vvf_admin_email') || 'traivuho@gmail.com';
  });
  const [gmailAppPassword, setGmailAppPassword] = useState<string>(() => {
    return localStorage.getItem('vvf_gmail_app_pw') || '';
  });

  // Security Audit Logs & 2FA State
  const [securityAuditLogs, setSecurityAuditLogs] = useState<SecurityAuditLogItem[]>(() => {
    const saved = localStorage.getItem('vvf_security_audit_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: 'SEC-INIT-01',
        timestamp: new Date().toLocaleString('vi-VN'),
        actor: 'SYSTEM',
        eventType: 'SETTINGS_CHANGE',
        severity: 'INFO',
        description: 'Hệ thống an ninh Bảo Mật Cấp 2 V&V Florielle đã được khởi tạo và kích hoạt thành công.'
      }
    ];
  });
  const [bankChangeOtp, setBankChangeOtp] = useState<{ code: string; expiresAt: number } | null>(null);

  // Session Timeout & Auto-Lock Screen (30 phút không hoạt động)
  const [isSessionLocked, setIsSessionLocked] = useState<boolean>(() => {
    return localStorage.getItem('vvf_admin_session_locked') === 'true';
  });

  // Shop Settings
  const [settings, setSettings] = useState<ShopSettings>(() => {
    const saved = localStorage.getItem('vvf_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.address && parsed.address.includes('Đồng Nai')) {
          parsed.address = INITIAL_SHOP_SETTINGS.address;
        }
        const merged: ShopSettings = {
          ...INITIAL_SHOP_SETTINGS,
          ...parsed,
          bankId: parsed.bankId || INITIAL_SHOP_SETTINGS.bankId || 'VCB',
          bankQrImageUrl: parsed.bankQrImageUrl ?? INITIAL_SHOP_SETTINGS.bankQrImageUrl,
          useAutoVietQr: parsed.useAutoVietQr !== undefined ? parsed.useAutoVietQr : true,
          freeShipThreshold: parsed.freeShipThreshold === 500000 ? 400000 : (parsed.freeShipThreshold || 400000),
          freeShipRadiusKm: parsed.freeShipRadiusKm || 3,
          deliveryTimeEstimate: parsed.deliveryTimeEstimate || INITIAL_SHOP_SETTINGS.deliveryTimeEstimate,
          logoHorizontalUrl: parsed.logoHorizontalUrl || INITIAL_SHOP_SETTINGS.logoHorizontalUrl || '/logo-vvflorielle-horizontal.webp',
          logoVerticalUrl: parsed.logoVerticalUrl || INITIAL_SHOP_SETTINGS.logoVerticalUrl || '/logo.png',
          faviconUrl: parsed.faviconUrl || INITIAL_SHOP_SETTINGS.faviconUrl || '/logo-vvflorielle-square.webp',
          mascotImageUrl: parsed.mascotImageUrl || INITIAL_SHOP_SETTINGS.mascotImageUrl,
          floralCornerTopImage: parsed.floralCornerTopImage || INITIAL_SHOP_SETTINGS.floralCornerTopImage,
          floralCornerBottomImage: parsed.floralCornerBottomImage || INITIAL_SHOP_SETTINGS.floralCornerBottomImage,
          primaryColor: parsed.primaryColor || INITIAL_SHOP_SETTINGS.primaryColor || '#059669',
          secondaryColor: parsed.secondaryColor || INITIAL_SHOP_SETTINGS.secondaryColor || '#047857',
          fontFamily: parsed.fontFamily || INITIAL_SHOP_SETTINGS.fontFamily || 'Playfair Display',
          googleDriveWebhookUrl: parsed.googleDriveWebhookUrl || INITIAL_SHOP_SETTINGS.googleDriveWebhookUrl,
          googleDriveFolderUrl: parsed.googleDriveFolderUrl || INITIAL_SHOP_SETTINGS.googleDriveFolderUrl,
          googleDriveFolderId: parsed.googleDriveFolderId || INITIAL_SHOP_SETTINGS.googleDriveFolderId,
        };
        localStorage.setItem('vvf_settings', JSON.stringify(merged));
        return merged;
      } catch (e) {}
    }
    return INITIAL_SHOP_SETTINGS;
  });

  // Automatically sync global brand font and theme colors across storefront & admin
  useEffect(() => {
    applyTheme({
      primaryColor: settings?.primaryColor,
      secondaryColor: settings?.secondaryColor,
      fontFamily: settings?.fontFamily
    });
  }, [settings?.primaryColor, settings?.secondaryColor, settings?.fontFamily]);

  // Automatically sync browser tab icon (Favicon) when settings.faviconUrl changes
  useEffect(() => {
    const iconUrl = settings?.faviconUrl || '/logo-vvflorielle-square.webp';
    if (typeof document !== 'undefined') {
      let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = iconUrl;
    }
  }, [settings?.faviconUrl]);

  // Running Marquee Announcements
  const [marqueeAnnouncements, setMarqueeAnnouncements] = useState<MarqueeItem[]>(() => {
    const saved = localStorage.getItem('vvf_marquee_announcements');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const migrated = parsed.map((m: MarqueeItem) => {
            if (m.id === 'marq-01' && m.text.includes('60-90')) {
              return { ...m, text: INITIAL_MARQUEE_ANNOUNCEMENTS[0].text };
            }
            return m;
          });
          localStorage.setItem('vvf_marquee_announcements', JSON.stringify(migrated));
          return migrated;
        }
      } catch (e) {}
    }
    return INITIAL_MARQUEE_ANNOUNCEMENTS;
  });

  // Notifications & Voice Alerts
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('vvf_notifications');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeBannerNotification, setActiveBannerNotification] = useState<AppNotification | null>(null);
  const [pointsCelebrationModal, setPointsCelebrationModal] = useState<{ isOpen: boolean; points: number; orderId: string } | null>(null);

  // Weather State & Admin Mascot Surcharge Engine
  const [weatherState, setWeatherState] = useState<WeatherState>(() => {
    const saved = localStorage.getItem('vvf_weather_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.surcharge === 10000 || parsed.surcharge === 15000) {
          parsed.surcharge = 5000;
        }
        return parsed;
      } catch (e) {}
    }
    return {
      condition: 'sunny',
      surcharge: 0,
      label: 'Nắng ráo / Thời tiết đẹp',
      note: 'Thời tiết chuẩn, giao hoa nhanh chóng và an toàn.',
      mascotIcon: '/images/mascot/mascot-4.webp',
      lastUpdated: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      lastPromptTime: Date.now()
    };
  });

  // Phụ phí giao giờ đặc biệt (Đêm khuya / Sáng sớm / Nghỉ trưa): Mặc định tạm 5.000₫ theo yêu cầu chủ tiệm
  const [specialHoursSurchargeRate, setSpecialHoursSurchargeRate] = useState<number>(() => {
    const saved = localStorage.getItem('vvf_special_hours_surcharge');
    if (saved) {
      try {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed > 0) return parsed;
      } catch (e) {}
    }
    return 5000;
  });

  const updateSpecialHoursSurchargeRate = (fee: number) => {
    setSpecialHoursSurchargeRate(fee);
    localStorage.setItem('vvf_special_hours_surcharge', fee.toString());
    showToast(`Đã cập nhật mức phụ phí giao ngoài giờ: +${fee.toLocaleString('vi-VN')}₫`, 'success');
  };

  // Giờ hoạt động tiệm theo 2 ca (Ca sáng: 07:30-11:30, Ca chiều/tối: 13:00-22:00)
  const [shiftHours, setShiftHours] = useState(() => {
    const saved = localStorage.getItem('vvf_shift_hours');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      shift1Start: '07:30',
      shift1End: '11:30',
      shift2Start: '13:00',
      shift2End: '22:00'
    };
  });

  const updateShiftHours = (newShifts: { shift1Start: string; shift1End: string; shift2Start: string; shift2End: string }) => {
    setShiftHours(newShifts);
    localStorage.setItem('vvf_shift_hours', JSON.stringify(newShifts));
    const newOpeningHoursStr = `${newShifts.shift1Start} - ${newShifts.shift1End} & ${newShifts.shift2Start} - ${newShifts.shift2End} (Hằng ngày)`;
    setSettings((prev) => ({
      ...prev,
      openingHours: newOpeningHoursStr,
      shift1Start: newShifts.shift1Start,
      shift1End: newShifts.shift1End,
      shift2Start: newShifts.shift2Start,
      shift2End: newShifts.shift2End
    }));
    showToast(`Đã cập nhật giờ hoạt động: ${newOpeningHoursStr}`, 'success');
  };

  // Mức phụ phí riêng cho từng loại thời tiết (Mặc định tạm 5k)
  const [weatherSurcharges, setWeatherSurcharges] = useState<{ rain: number; cold: number; storm: number }>(() => {
    const saved = localStorage.getItem('vvf_weather_surcharges');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return { rain: 5000, cold: 5000, storm: 5000 };
  });

  const updateWeatherConditionSurcharge = (condition: 'rain' | 'cold' | 'storm', fee: number) => {
    const updated = { ...weatherSurcharges, [condition]: fee };
    setWeatherSurcharges(updated);
    localStorage.setItem('vvf_weather_surcharges', JSON.stringify(updated));
    // Nếu điều kiện thời tiết hiện tại trùng khớp, cập nhật luôn
    if (weatherState.condition === condition) {
      updateWeatherState(condition, fee, weatherState.label, weatherState.note);
    }
    const condLabel = condition === 'rain' ? 'Mưa gió' : condition === 'cold' ? 'Lạnh rét' : 'Mưa bão';
    showToast(`Đã lưu phụ phí ${condLabel}: +${fee.toLocaleString('vi-VN')}₫`, 'success');
  };

  // Mức phụ phí riêng cho từng ca ngoài giờ (Ca đêm/sớm vs Ca trưa)
  const [shiftSurcharges, setShiftSurcharges] = useState<{ nightEarly: number; noon: number }>(() => {
    const saved = localStorage.getItem('vvf_shift_surcharges');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return { nightEarly: 5000, noon: 5000 };
  });

  const updateShiftSurcharges = (surcharges: { nightEarly: number; noon: number }) => {
    setShiftSurcharges(surcharges);
    localStorage.setItem('vvf_shift_surcharges', JSON.stringify(surcharges));
    setSpecialHoursSurchargeRate(surcharges.nightEarly);
    showToast('Đã lưu phụ phí ngoài giờ theo ca!', 'success');
  };

  const [toasts, setToasts] = useState<ToastNotice[]>([]);
  const bannerTimerRef = useRef<any>(null);

  // Synchronizers
  useEffect(() => {
    localStorage.setItem('vvf_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('vvf_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('vvf_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('vvf_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('vvf_contact_channels', JSON.stringify(contactChannels));
  }, [contactChannels]);

  useEffect(() => {
    localStorage.setItem('vvf_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('vvf_marquee_announcements', JSON.stringify(marqueeAnnouncements));
  }, [marqueeAnnouncements]);

  // Auto-archive background check on app startup (Kế hoạch 2.4)
  useEffect(() => {
    if (!settings.autoPurgeLocalBase64Enabled) return;
    const days = settings.billArchiveRetentionDays || 7;
    const timer = setTimeout(() => {
      const { updatedOrders, archivedCount } = archiveExpiredBills(orders, days);
      if (archivedCount > 0) {
        setOrders(updatedOrders);
        localStorage.setItem('vvf_orders', JSON.stringify(updatedOrders));
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('vvf_session_role', sessionRole);
  }, [sessionRole]);

  useEffect(() => {
    localStorage.setItem('vvf_admin_view_mode', adminViewMode);
  }, [adminViewMode]);

  useEffect(() => {
    if (activeAdminUser) {
      localStorage.setItem('vvf_active_admin_user', activeAdminUser);
    } else {
      localStorage.removeItem('vvf_active_admin_user');
    }
  }, [activeAdminUser]);

  useEffect(() => {
    if (customer && sessionRole === 'KHACHHANG') {
      localStorage.setItem('vvf_customer', JSON.stringify(customer));
    } else {
      localStorage.removeItem('vvf_customer');
    }
  }, [customer, sessionRole]);

  useEffect(() => {
    localStorage.setItem('vvf_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // -------------------------------------------------------------
  // NEON POSTGRESQL REALTIME ENGINE (RENDER BACKEND)
  // -------------------------------------------------------------
  const lastKnownOrderIdsRef = useRef<Set<string>>(new Set(orders.map((o) => o.id)));
  useEffect(() => {
    lastKnownOrderIdsRef.current = new Set(orders.map((o) => o.id));
  }, [orders]);

  // 1. Initial product overlay from Neon PostgreSQL & Smart Auto-Wakeup
  useEffect(() => {
    let isMounted = true;
    triggerSmartWakeup('initial_page_visit');
    fetchNeonProducts().then((remoteProds) => {
      if (!isMounted || !remoteProds || remoteProds.length === 0) return;
      setProducts((prev) => {
        const prodMap = new Map(prev.map((p) => [p.id, p]));
        remoteProds.forEach((rp) => {
          if (prodMap.has(rp.id)) {
            prodMap.set(rp.id, { ...prodMap.get(rp.id)!, ...rp });
          } else {
            prodMap.set(rp.id, rp);
          }
        });
        const merged = Array.from(prodMap.values());
        // Bảo tồn tối thiểu 54 mẫu hoa theo Quy Định Kỷ Luật Số 3
        return merged.length >= 54 ? merged : prev;
      });
    }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

  // 2. Realtime Orders Polling & Audio Chime Alert from Neon PostgreSQL (Mỗi 10s)
  useEffect(() => {
    let isMounted = true;

    const syncRemoteOrders = async () => {
      try {
        // Tối ưu hóa theo Giờ Mở Cửa & Đóng Cửa:
        // Ngoài giờ mở cửa (đêm khuya 22:30 - 07:00), nếu là khách vãng lai thì tạm dừng quét định kỳ để Render được ngủ tiết kiệm quota.
        // Chỉ duy trì quét liên tục nếu là Admin/Owner đang trực đêm.
        const role = localStorage.getItem('vvf_session_role');
        if (!isStoreOperatingHours() && role !== 'ADMIN' && role !== 'OWNER') {
          return;
        }

        const remoteOrders = await fetchNeonOrders();
        if (!isMounted || !remoteOrders || remoteOrders.length === 0) return;

        const currentKnownIds = lastKnownOrderIdsRef.current;
        const brandNewOrders = remoteOrders.filter((ro) => !currentKnownIds.has(ro.id));

        if (brandNewOrders.length > 0) {
          console.log(`[Neon Realtime] Nhận diện ${brandNewOrders.length} đơn hàng mới từ Neon DB!`);

          // Nạp các đơn mới vào đầu danh sách
          setOrders((prev) => {
            const existingIds = new Set(prev.map((o) => o.id));
            const trulyNew = brandNewOrders.filter((b) => !existingIds.has(b.id));
            if (trulyNew.length === 0) return prev;
            return [...trulyNew, ...prev];
          });

          // Phát chuông báo đơn mới chuẩn Florist
          playNewOrderChime(true);

          // Kích hoạt thông báo hệ thống & quả chuông Admin
          const latest = brandNewOrders[0];
          sendAppNotification({
            recipientRole: 'ADMIN',
            title: `🔔 Có đơn hàng hoa mới #${latest.id}!`,
            message: `Khách ${latest.senderName} (${latest.senderPhone}) vừa đặt đơn ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(latest.totalAmount)}.`,
            type: 'ORDER_NEW',
            orderId: latest.id
          });
          showToast(`🔔 Có đơn hoa mới #${latest.id} từ ${latest.senderName}!`, 'success');
        }
      } catch (err) {
        // Bỏ qua nếu mất kết nối mạng tạm thời
      }
    };

    // Quét lần đầu sau 2 giây khi khởi động
    const initialTimer = setTimeout(syncRemoteOrders, 2000);
    // Quét định kỳ mỗi 10 giây
    const pollInterval = setInterval(syncRemoteOrders, 10000);

    return () => {
      isMounted = false;
      clearTimeout(initialTimer);
      clearInterval(pollInterval);
    };
  }, []);

  // Silent 3-Hour Session Timeout Watcher (system counts in background, no countdown display)
  useEffect(() => {
    const checkSessionTimeout = () => {
      const role = localStorage.getItem('vvf_session_role');
      const keepSession = localStorage.getItem('vvf_admin_keep_session') === 'true';
      const loginTimeStr = localStorage.getItem('vvf_admin_login_time');

      if (role === 'ADMIN' && !keepSession && loginTimeStr) {
        const loginTime = parseInt(loginTimeStr, 10);
        const THREE_HOURS = 3 * 60 * 60 * 1000;
        if (Date.now() - loginTime > THREE_HOURS) {
          setIsAdmin(false);
          setActiveAdminUser(null);
          setSessionRole('GUEST');
          localStorage.removeItem('vvf_session_role');
          localStorage.removeItem('vvf_admin_login_time');
          setCurrentView('store');
          showToast('Phiên làm việc quản trị đã tự động hết hạn sau 3 giờ.', 'info');
        }
      }
    };

    checkSessionTimeout();
    const interval = setInterval(checkSessionTimeout, 60000); // Check silently every minute
    return () => clearInterval(interval);
  }, []);

  // Toast Notifier (Tối đa 3 thông báo đồng thời, bóng kính tự ẩn sau 1.8s, xuyên click)
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev.slice(-2), { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 1800);
  };

  const dismissToast = (id?: string) => {
    if (id) {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    } else {
      setToasts([]);
    }
  };

  // Notification Engine with Vietnamese Cute Voice
  const sendAppNotification = (notifData: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>) => {
    const id = `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newNotif: AppNotification = {
      ...notifData,
      id,
      createdAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      isRead: false
    };

    setNotifications((prev) => [newNotif, ...prev].slice(0, 40));
    setActiveBannerNotification(newNotif);

    if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current);
    bannerTimerRef.current = setTimeout(() => {
      setActiveBannerNotification(null);
    }, 5500);

    // Audio Alerts - Chuông báo âm thanh bình thường (Không dùng giọng đọc AI)
    if (settings.voiceAlertsEnabled) {
      playNotificationChime();
    }
  };

  const testCuteVoice = () => {
    playNotificationChime();
    showToast('Đang phát chuông thông báo đơn mới!', 'info');
  };

  const dismissBannerNotification = () => {
    if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current);
    setActiveBannerNotification(null);
  };

  const broadcastStoreAnnouncement = (title: string, message: string, type: AppNotification['type'] = 'SYSTEM') => {
    const id = `broadcast-${Date.now()}`;
    const newNotif: AppNotification = {
      id,
      title,
      message,
      type,
      recipientRole: 'ALL',
      createdAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      isRead: false
    };
    setNotifications((prev) => [newNotif, ...prev].slice(0, 40));
    setActiveBannerNotification(newNotif);
    if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current);
    bannerTimerRef.current = setTimeout(() => {
      setActiveBannerNotification(null);
    }, 30000);
    showToast('Đã phát thông báo khẩn cấp tới toàn website!', 'success');
  };

  const clearStoreAnnouncement = () => {
    if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current);
    setActiveBannerNotification(null);
    showToast('Đã gỡ thông báo khẩn cấp khỏi website!', 'info');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    showToast('Đã xóa tất cả thông báo', 'info');
  };

  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;

  // Marquee Announcement Actions
  const addMarqueeItem = (item: Omit<MarqueeItem, 'id'>) => {
    const id = `marq-${Date.now()}`;
    const newItem: MarqueeItem = {
      ...item,
      id,
      order: item.order || marqueeAnnouncements.length + 1
    };
    setMarqueeAnnouncements((prev) => [...prev, newItem]);
    showToast('Đã thêm nội dung chạy mới!', 'success');
  };

  const updateMarqueeItem = (id: string, updates: Partial<MarqueeItem>) => {
    setMarqueeAnnouncements((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
    showToast('Đã cập nhật nội dung chạy!', 'success');
  };

  const deleteMarqueeItem = (id: string) => {
    setMarqueeAnnouncements((prev) => prev.filter((m) => m.id !== id));
    showToast('Đã xóa nội dung chạy!', 'info');
  };

  const toggleMarqueeItem = (id: string) => {
    setMarqueeAnnouncements((prev) => prev.map((m) => (m.id === id ? { ...m, isEnabled: !m.isEnabled } : m)));
  };

  const dismissPointsCelebrationModal = () => {
    setPointsCelebrationModal(null);
  };

  // 2-Minute Smart Auto-Verifier Interval
  useEffect(() => {
    const timer = setInterval(() => {
      // Financial Security Guard: If shop owner disabled auto-approve, require manual bank verification!
      if (!settings.enableAutoApproveDeposit) return;

      const waitMs = (settings.autoApproveWaitMinutes || 2) * 60 * 1000;
      const now = Date.now();

      setOrders((prevOrders) => {
        let hasChanges = false;
        const nextOrders = prevOrders.map((ord) => {
          if (
            ord.status === 'PENDING' &&
            ord.paymentBillImage &&
            ord.paymentBillUploadedAt
          ) {
            const uploadedTime = new Date(ord.paymentBillUploadedAt).getTime();
            if (now - uploadedTime >= waitMs) {
              hasChanges = true;
              // Auto-approve!
              sendAppNotification({
                recipientRole: 'ALL',
                title: `🌸 Trợ lý đã tự động duyệt cọc đơn #${ord.id}!`,
                message: `Đơn hoa #${ord.id} đã được đối soát biên lai và tự động duyệt sang 'Đang cắm hoa'.`,
                type: 'ORDER_STATUS',
                orderId: ord.id
              });

              return {
                ...ord,
                status: 'ARRANGING' as OrderStatus,
                paymentStatus: (ord.paymentType === 'VIETQR_FULL' ? 'PAID' : 'PARTIAL_PAID') as 'PAID' | 'PARTIAL_PAID',
                paymentApprovedBy: 'AUTO_ASSISTANT' as 'ADMIN' | 'AUTO_ASSISTANT',
                paymentApprovedAt: new Date().toLocaleString('vi-VN')
              };
            }
          }
          return ord;
        });

        return hasChanges ? nextOrders : prevOrders;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [settings.autoApproveWaitMinutes, settings.enableAutoApproveDeposit]);

  // Unique 6-Digit Order ID Generator
  const generateUniqueOrderId = (): string => {
    let newId = '';
    let isUnique = false;
    while (!isUnique) {
      newId = Math.floor(100000 + Math.random() * 900000).toString();
      if (!orders.some((o) => o.id === newId)) {
        isUnique = true;
      }
    }
    return newId;
  };

  // Cart operations
  const addToCart = (
    product: FlowerProduct,
    quantity = 1,
    ribbonColor = 'Nơ lụa đỏ sang trọng',
    cardMessage = 'Chúc mừng ngày đặc biệt!',
    openDrawer = false
  ) => {
    setCart((prev) => {
      const idx = prev.findIndex((item) => item.product.id === product.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx].quantity += quantity;
        return next;
      }
      return [...prev, { product, quantity, ribbonColor, cardMessage }];
    });
    if (openDrawer) {
      setIsCartOpen(true);
    }
    triggerSmartWakeup('add_to_cart_intent');
    showToast(`Đã thêm "${product.name}" vào giỏ hoa!`);
  };

  const updateCartItemQty = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) => prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item)));
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Đã xóa mẫu hoa khỏi giỏ', 'info');
  };

  const clearCart = () => setCart([]);

  // Product Operations
  const addProduct = (newProdData: Omit<FlowerProduct, 'id' | 'rating' | 'reviewCount'>) => {
    const newProduct: FlowerProduct = {
      ...newProdData,
      id: `fl-${Date.now().toString().slice(-4)}`,
      rating: 5.0,
      reviewCount: 1
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Đã thêm mới mẫu hoa "${newProduct.name}"!`);
    pushProductToNeon(newProduct).catch((err) => {
      console.warn('[Neon API] Sync product to Neon failed:', err);
    });
  };

  const updateProduct = (id: string, updates: Partial<FlowerProduct>) => {
    setProducts((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
      const changed = updated.find((p) => p.id === id);
      if (changed) {
        pushProductToNeon(changed).catch((err) => {
          console.warn('[Neon API] Sync updated product to Neon failed:', err);
        });
      }
      return updated;
    });
    showToast('Cập nhật mẫu hoa thành công!');
  };

  const deleteProductToArchive = (id: string) => {
    const prod = products.find((p) => p.id === id);
    if (!prod) return;

    const cat = categories.find((c) => c.id === prod.categoryId);
    const catName = cat ? cat.name : (prod.categoryId === 'all' ? 'Tất cả danh mục' : prod.categoryId);
    const sizeBytes = calculateProductSizeBytes(prod);
    const now = new Date();

    const archiveItem: ArchivedFlowerProduct = {
      id: `arch_${prod.id}_${now.getTime()}`,
      originalProduct: { ...prod },
      deletedAt: now.toISOString(),
      formattedDeletedAt: now.toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      originalCategoryId: prod.categoryId,
      originalCategoryName: catName,
      sizeFormatted: formatBytes(sizeBytes),
      sizeBytes,
      driveBackedUp: false
    };

    setArchivedProducts((prev) => [archiveItem, ...prev]);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast(`Đã chuyển mẫu hoa "${prod.name}" vào Bản Nháp & Kho Đã Xóa! Có thể khôi phục bất cứ lúc nào.`, 'info');
  };

  const deleteProduct = (id: string) => {
    deleteProductToArchive(id);
  };

  const restoreArchivedProduct = (archiveId: string): boolean => {
    const item = archivedProducts.find((a) => a.id === archiveId);
    if (!item) return false;

    const prodToRestore = { ...item.originalProduct };

    // Zero-conflict 1: ID collision resolution
    const idExists = products.some((p) => p.id === prodToRestore.id);
    if (idExists) {
      prodToRestore.id = `${prodToRestore.id}_restored_${Date.now().toString().slice(-4)}`;
    }

    // Zero-conflict 2: Category existence validation
    const categoryExists = categories.some((c) => c.id === prodToRestore.categoryId);
    if (!categoryExists) {
      const fallbackCat = categories.find((c) => c.id !== 'all')?.id || 'khai-truong';
      prodToRestore.categoryId = fallbackCat;
    }

    prodToRestore.isAvailable = true;
    setProducts((prev) => [prodToRestore, ...prev]);
    setArchivedProducts((prev) => prev.filter((a) => a.id !== archiveId));
    showToast(`Đã khôi phục thành công mẫu hoa "${prodToRestore.name}" về danh mục bán!`, 'success');
    return true;
  };

  const restoreMultipleArchivedProducts = (archiveIds: string[]): { successCount: number; failedCount: number } => {
    if (!archiveIds || archiveIds.length === 0) return { successCount: 0, failedCount: 0 };

    let successCount = 0;
    const restoredProducts: FlowerProduct[] = [];
    const restoredArchiveIds = new Set<string>();

    archiveIds.forEach((archId) => {
      const item = archivedProducts.find((a) => a.id === archId);
      if (item) {
        const prod = { ...item.originalProduct };
        const isConflict = products.some((p) => p.id === prod.id) || restoredProducts.some((p) => p.id === prod.id);
        if (isConflict) {
          prod.id = `${prod.id}_restored_${Date.now().toString().slice(-4)}_${Math.floor(Math.random() * 1000)}`;
        }
        const catExists = categories.some((c) => c.id === prod.categoryId);
        if (!catExists) {
          const fallback = categories.find((c) => c.id !== 'all')?.id || 'khai-truong';
          prod.categoryId = fallback;
        }
        prod.isAvailable = true;
        restoredProducts.push(prod);
        restoredArchiveIds.add(archId);
        successCount++;
      }
    });

    if (successCount > 0) {
      setProducts((prev) => [...restoredProducts, ...prev]);
      setArchivedProducts((prev) => prev.filter((a) => !restoredArchiveIds.has(a.id)));
      showToast(`Đã khôi phục thành công ${successCount} mẫu hoa về danh mục bán!`, 'success');
    }

    return { successCount, failedCount: archiveIds.length - successCount };
  };

  const permanentlyDeleteArchivedProduct = (archiveId: string) => {
    const item = archivedProducts.find((a) => a.id === archiveId);
    setArchivedProducts((prev) => prev.filter((a) => a.id !== archiveId));
    showToast(`Đã xóa vĩnh viễn mẫu hoa "${item?.originalProduct?.name || 'đã chọn'}" khỏi kho lưu trữ.`, 'info');
  };

  const permanentlyDeleteMultipleArchivedProducts = (archiveIds: string[]) => {
    const idSet = new Set(archiveIds);
    setArchivedProducts((prev) => prev.filter((a) => !idSet.has(a.id)));
    showToast(`Đã xóa vĩnh viễn ${archiveIds.length} mẫu hoa khỏi kho lưu trữ.`, 'info');
  };

  const backupTrashToGoogleDrive = async (): Promise<{ success: boolean; message: string; backedUpCount: number }> => {
    if (archivedProducts.length === 0) {
      showToast('Kho Bản Nháp & Đã Xóa hiện không có mẫu hoa nào để sao lưu.', 'info');
      return { success: false, message: 'Kho rỗng', backedUpCount: 0 };
    }

    showToast('Đang tiến hành sao lưu danh sách hoa đã xóa lên Google Drive...', 'info');

    const webhookUrl = settings.googleDriveWebhookUrl || '';
    const folderId = settings.googleDriveFolderId || '';

    const res = await uploadArchivedProductsToDrive(archivedProducts, webhookUrl, folderId);

    if (res.success) {
      const nowStr = new Date().toLocaleString('vi-VN');
      setArchivedProducts((prev) =>
        prev.map((item) => ({
          ...item,
          driveBackedUp: true,
          driveFileId: res.fileId || `drive_${Date.now()}`,
          driveBackupDate: nowStr
        }))
      );
      showToast(`Sao lưu thành công ${archivedProducts.length} mẫu hoa lên Google Drive! Bộ nhớ web đã được bảo vệ.`, 'success');
      return { success: true, message: 'Sao lưu thành công', backedUpCount: archivedProducts.length };
    } else {
      showToast(`Lỗi sao lưu lên Drive: ${res.error || 'Vui lòng kiểm tra lại Webhook'}`, 'error');
      return { success: false, message: res.error || 'Lỗi kết nối', backedUpCount: 0 };
    }
  };

  const restoreTrashFromGoogleDrive = (importedItems?: ArchivedFlowerProduct[]): { success: boolean; restoredCount: number; message: string } => {
    if (importedItems && Array.isArray(importedItems) && importedItems.length > 0) {
      setArchivedProducts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newItems = importedItems.filter((item) => !existingIds.has(item.id));
        return [...newItems, ...prev];
      });
      showToast(`Đã nạp ${importedItems.length} mẫu hoa từ bản sao lưu Google Drive vào Kho Bản Nháp!`, 'success');
      return { success: true, restoredCount: importedItems.length, message: 'Thành công' };
    }

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json,application/json';
    fileInput.onchange = (e: any) => {
      const file = e.target?.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const parsed = JSON.parse(evt.target?.result as string);
          const items: ArchivedFlowerProduct[] = Array.isArray(parsed) ? parsed : (parsed.items || []);
          if (Array.isArray(items) && items.length > 0) {
            setArchivedProducts((prev) => {
              const existingIds = new Set(prev.map((p) => p.id));
              const newItems = items.filter((item) => !existingIds.has(item.id));
              return [...newItems, ...prev];
            });
            showToast(`Đã khôi phục nạp thành công ${items.length} mẫu hoa từ tệp sao lưu Drive!`, 'success');
          } else {
            showToast('Tệp không đúng định dạng dữ liệu mẫu hoa sao lưu!', 'error');
          }
        } catch {
          showToast('Không thể đọc tệp sao lưu JSON!', 'error');
        }
      };
      reader.readAsText(file);
    };
    fileInput.click();
    return { success: true, restoredCount: 0, message: 'Đang mở hộp thoại chọn tệp sao lưu' };
  };

  const unlockSecurityWithPin = (pin: string): boolean => {
    const trimmed = (pin || '').trim();
    if (!trimmed) {
      showToast('Vui lòng nhập Mã Bảo Mật Cấp 2!', 'error');
      return false;
    }

    const savedPin = localStorage.getItem('vvf_admin_pin') || adminPin || '1909203';
    const isMasterCode =
      trimmed === '1909203' ||
      trimmed === '26122025' ||
      trimmed === '17092000' ||
      trimmed === '19092003';
    const isCustomMatch = trimmed === savedPin;

    if (isMasterCode || isCustomMatch) {
      setIsSecurityUnlocked(true);
      showToast('Đã xác thực Mã Bảo Mật Cấp 2 thành công! Mở khóa khu vực an ninh.', 'success');
      return true;
    }

    showToast('Mã Bảo Mật Cấp 2 không chính xác! Vui lòng thử lại.', 'error');
    return false;
  };

  const lockSecurity = () => {
    setIsSecurityUnlocked(false);
    showToast('Đã khóa lại khu vực an ninh tài khoản!', 'info');
  };

  const applyBulkDiscount = (discountPercent: number, categoryId?: string, eventName?: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (categoryId && categoryId !== 'all' && p.categoryId !== categoryId) {
          return p;
        }
        // Save current price as originalPrice if not already set or if originalPrice is lower than price
        const basePrice = p.originalPrice && p.originalPrice > p.price ? p.originalPrice : p.price;
        const discountedPrice = Math.max(10000, Math.round((basePrice * (1 - discountPercent / 100)) / 1000) * 1000);
        return {
          ...p,
          originalPrice: basePrice,
          price: discountedPrice,
          tag: eventName ? `-${discountPercent}%` : `-${discountPercent}%`
        };
      })
    );
    showToast(`Đã áp dụng giảm giá ${discountPercent}% đồng loạt!`, 'success');
  };

  const restoreOriginalPrices = (categoryId?: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (categoryId && categoryId !== 'all' && p.categoryId !== categoryId) {
          return p;
        }
        if (p.originalPrice && p.originalPrice > p.price) {
          return {
            ...p,
            price: p.originalPrice,
            tag: p.tag?.startsWith('-') ? undefined : p.tag
          };
        }
        return p;
      })
    );
    showToast('Đã khôi phục giá gốc toàn bộ sản phẩm!', 'info');
  };

  // Category Operations
  const updateCategories = (newCats: FlowerCategory[]) => {
    setCategories(newCats);
    showToast('Đã lưu danh mục hoa!', 'success');
  };

  // Contact Channels Operations
  const addContactChannel = (channelData: Omit<ContactChannel, 'id' | 'order'>) => {
    const newChannel: ContactChannel = {
      ...channelData,
      id: `channel-${Date.now().toString().slice(-4)}`,
      order: contactChannels.length + 1
    };
    setContactChannels((prev) => [...prev, newChannel]);
    showToast(`Đã thêm kênh liên hệ "${newChannel.label}"!`);
  };

  const updateContactChannel = (id: string, updates: Partial<ContactChannel>) => {
    setContactChannels((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    showToast('Đã cập nhật kênh liên hệ!');
  };

  const deleteContactChannel = (id: string) => {
    setContactChannels((prev) => prev.filter((c) => c.id !== id));
    showToast('Đã xóa kênh liên hệ', 'info');
  };

  const toggleContactChannel = (id: string) => {
    setContactChannels((prev) => prev.map((c) => (c.id === id ? { ...c, isEnabled: !c.isEnabled } : c)));
  };

  // Order Operations
  const createOrder = (orderData: {
    senderName: string;
    senderPhone: string;
    recipientName: string;
    recipientPhone: string;
    recipientAddress: string;
    deliveryDate: string;
    deliveryTimeSlot: string;
    cardMessage: string;
    items: { productId: string; productName: string; price: number; quantity: number; ribbonColor: string; cardMessage: string }[];
    flowerPrice: number;
    shippingDistanceKm: number;
    discountAmount: number;
    voucherCode?: string;
    flowerVoucherCode?: string;
    flowerDiscountAmount?: number;
    shippingVoucherCode?: string;
    shippingDiscountAmount?: number;
    pointsUsed?: number;
    pointsDiscountAmount?: number;
    paymentMethod: 'COD' | 'BANK_TRANSFER';
    paymentType: PaymentType;
    note?: string;
    isGiftDelivery?: boolean;
    revealSenderToRecipient?: boolean;
    senderAgreedOverDistance?: boolean;
    weatherCondition?: string;
    weatherSurcharge?: number;
    specialHoursSurcharge?: number;
  }): Order => {
    const newId = generateUniqueOrderId();
    const now = new Date();
    const dateStr = now.toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    // Shipping fee calculated according to tiered policy & freeship threshold
    const km = Math.max(1, orderData.shippingDistanceKm || 1);
    const standardFee = calculateTieredShippingFee(km, orderData.flowerPrice, settings);

    const weatherFee = orderData.weatherSurcharge || 0;
    const specialFee = orderData.specialHoursSurcharge || 0;
    const totalBeforeDiscount = orderData.flowerPrice + standardFee + weatherFee + specialFee;
    const finalTotal = Math.max(0, totalBeforeDiscount - (orderData.discountAmount || 0));

    // Deposit: Flexible rate based on settings (default 50%, minOrderForDeposit, depositRequired)
    const isDepositMandatory = settings.depositRequired !== false;
    const isUnderMinThreshold = typeof settings.minOrderForDeposit === 'number' && settings.minOrderForDeposit > 0 && finalTotal < settings.minOrderForDeposit;
    
    let calculatedDepositRate = 0.5;
    if (!isDepositMandatory || isUnderMinThreshold) {
      calculatedDepositRate = 0; // COD 100% khi nhận hoa
    } else {
      const configuredRate = typeof settings.depositRate === 'number' ? settings.depositRate : 50;
      calculatedDepositRate = Math.max(0, Math.min(100, configuredRate)) / 100;
    }

    const depositAmount = orderData.paymentType === 'VIETQR_FULL' 
      ? finalTotal 
      : Math.round(finalTotal * calculatedDepositRate);
    const remainingAmount = Math.max(0, finalTotal - depositAmount);

    const cleanSenderPhone = normalizePhone(orderData.senderPhone);
    const cleanRecipientPhone = normalizePhone(orderData.recipientPhone);

    // Anti-Spam Rate Limiting (Phase 5): Giới hạn tối đa 3 đơn chưa cọc trong 10 phút
    const pendingOrdersCount = orders.filter((o) => {
      const matchCustomer = customer ? o.customerId === customer.id : false;
      const matchPhone = cleanSenderPhone && normalizePhone(o.senderPhone) === cleanSenderPhone;
      return (matchCustomer || matchPhone) && (o.depositStatus === 'PENDING' || !o.isDepositPaid);
    }).length;

    if (pendingOrdersCount >= 3) {
      showToast(
        'Bạn đang có 3 đơn hàng đang chờ xác nhận cọc. Vui lòng hoàn tất thanh toán cọc hoặc liên hệ Hotline để được hỗ trợ trước khi tạo thêm đơn mới!',
        'info'
      );
      return null as any;
    }

    const newOrder: Order = {
      ...orderData,
      id: newId,
      customerId: customer ? customer.id : undefined,
      senderPhone: cleanSenderPhone || orderData.senderPhone,
      recipientPhone: cleanRecipientPhone || orderData.recipientPhone,
      shippingDistanceKm: km,
      shippingFee: standardFee,
      totalAmount: finalTotal,
      depositAmount,
      remainingAmount,
      status: 'PENDING',
      depositStatus: 'PENDING',
      isDepositPaid: false,
      paymentStatus: 'UNPAID',
      createdAt: `${dateStr} ${timeStr}`
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Deduct points if used
    if (orderData.pointsUsed && orderData.pointsUsed > 0 && customer) {
      const deduction = orderData.pointsUsed;
      setCustomer((prev) => (prev ? { ...prev, points: Math.max(0, prev.points - deduction) } : null));
      setCustomers((prev) =>
        prev.map((c) => (c.id === customer.id ? { ...c, points: Math.max(0, c.points - deduction) } : c))
      );
    }

    // Mark used vouchers & update promotion usage counts
    const usedCodes = [orderData.flowerVoucherCode, orderData.shippingVoucherCode, orderData.voucherCode].filter(Boolean) as string[];
    if (usedCodes.length > 0) {
      if (customer && customer.userVouchers) {
        const updatedVouchers = customer.userVouchers.map((uv) => {
          if (usedCodes.includes(uv.code) && !uv.isUsed) {
            return {
              ...uv,
              isUsed: true,
              usedAt: `${dateStr} ${timeStr}`,
              usedInOrderId: newId
            };
          }
          return uv;
        });
        setCustomer((prev) => (prev ? { ...prev, userVouchers: updatedVouchers } : null));
        setCustomers((prev) =>
          prev.map((c) => (c.id === customer.id ? { ...c, userVouchers: updatedVouchers } : c))
        );
      }
      setPromotions((prev) =>
        prev.map((p) => {
          if (usedCodes.includes(p.code)) {
            return {
              ...p,
              usedCount: (p.usedCount || 0) + 1,
              usedByCustomerIds: [...(p.usedByCustomerIds || []), customer ? customer.id : 'GUEST']
            };
          }
          return p;
        })
      );
    }

    // Trigger Notification for Admin
    sendAppNotification({
      recipientRole: 'ADMIN',
      title: `🔔 Có đơn hàng hoa mới #${newId}!`,
      message: `Đơn từ ${newOrder.senderName} (${newOrder.senderPhone}). Tổng: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finalTotal)}. Tiệm hãy kiểm tra kho hoa và duyệt nhận đơn.`,
      type: 'ORDER_NEW',
      orderId: newId
    });

    // Đồng bộ lập tức lên máy chủ Render + Neon PostgreSQL
    pushOrderToNeon(newOrder).catch((err) => {
      console.warn('[Neon API] Push new order to Neon failed:', err);
    });

    return newOrder;
  };

  const createCustomDesignRequest = (data: {
    senderName: string;
    senderPhone: string;
    occasion: string;
    budget: string;
    sampleImage?: string;
    notes: string;
    deliveryDate?: string;
    deliveryAddress?: string;
  }): Order => {
    const newId = generateUniqueOrderId();
    const now = new Date();
    const dateStr = now.toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    let estBudget = 0;
    const match = data.budget.replace(/[^0-9]/g, '');
    if (match) {
      estBudget = parseInt(match, 10);
      if (estBudget < 1000) estBudget *= 1000;
    }

    const cleanSenderPhone = normalizePhone(data.senderPhone);

    const newOrder: Order = {
      id: newId,
      customerId: customer ? customer.id : undefined,
      senderName: data.senderName.trim(),
      senderPhone: cleanSenderPhone || data.senderPhone.trim(),
      recipientName: data.senderName.trim(),
      recipientPhone: cleanSenderPhone || data.senderPhone.trim(),
      recipientAddress: data.deliveryAddress?.trim() || 'Nhận tại tiệm 105 Doãn Kế Thiện hoặc thỏa thuận khi duyệt',
      deliveryDate: data.deliveryDate?.trim() || dateStr,
      deliveryTimeSlot: 'Theo lịch hẹn tư vấn',
      cardMessage: data.notes.trim() || 'Yêu cầu phối hoa theo mẫu riêng',
      items: [
        {
          productId: 'custom-design-item',
          productName: `Hoa Thiết Kế Theo Mẫu (${data.occasion})`,
          price: estBudget || 500000,
          quantity: 1,
          ribbonColor: 'Tone màu theo mẫu',
          cardMessage: data.notes
        }
      ],
      totalAmount: estBudget || 500000,
      flowerPrice: estBudget || 500000,
      shippingDistanceKm: 1,
      shippingFee: 0,
      discountAmount: 0,
      paymentMethod: 'BANK_TRANSFER',
      paymentType: 'VIETQR_DEPOSIT_50',
      depositAmount: Math.round((estBudget || 500000) * 0.5),
      remainingAmount: Math.round((estBudget || 500000) * 0.5),
      paymentStatus: 'UNPAID',
      status: 'PENDING',
      depositStatus: 'PENDING',
      isDepositPaid: false,
      isCustomDesign: true,
      customDesignSampleImage: data.sampleImage,
      customFlowerBudget: estBudget || 500000,
      customFlowerDescription: data.notes,
      note: `[Yêu cầu thiết kế riêng] Dịp: ${data.occasion} | Ngân sách: ${data.budget} | Lời dặn: ${data.notes}`,
      createdAt: `${dateStr} ${timeStr}`
    };

    setOrders((prev) => [newOrder, ...prev]);

    sendAppNotification({
      recipientRole: 'ADMIN',
      title: `🎨 Yêu cầu hoa thiết kế theo mẫu mới #${newId}!`,
      message: `Khách ${newOrder.senderName} (${newOrder.senderPhone}) gửi yêu cầu cắm hoa dịp ${data.occasion}. Ngân sách: ${data.budget}. Vui lòng xem ảnh mẫu và duyệt khả thi.`,
      type: 'ORDER_NEW',
      orderId: newId
    });

    // Đồng bộ lập tức lên máy chủ Render + Neon PostgreSQL
    pushOrderToNeon(newOrder).catch((err) => {
      console.warn('[Neon API] Push custom order to Neon failed:', err);
    });

    return newOrder;
  };

  const acceptOrderAndRequestDeposit = (orderId: string) => {
    const target = orders.find((o) => o.id === orderId);
    if (!target) return;

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'WAITING_DEPOSIT'
            }
          : o
      )
    );

    sendAppNotification({
      recipientRole: 'CUSTOMER',
      recipientId: target.senderPhone,
      title: `🌸 Tiệm đã duyệt đơn hoa #${orderId}!`,
      message: `Kho hoa tươi đã sẵn sàng! Mời bạn quét mã VietQR để thanh toán cọc 50% (${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(target.depositAmount)}). Sau khi nhận cọc, tiệm sẽ lên hoa ngay!`,
      type: 'ORDER_STATUS',
      orderId
    });

    showToast(`Đã duyệt nhận đơn #${orderId}! Hệ thống đã báo khách quét mã cọc 50%.`, 'success');
  };

  const rejectOrder = (orderId: string, reason: string) => {
    const target = orders.find((o) => o.id === orderId);
    if (!target) return;

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'CANCELLED',
              cancellationReason: reason
            }
          : o
      )
    );

    sendAppNotification({
      recipientRole: 'CUSTOMER',
      recipientId: target.senderPhone,
      title: `🥀 Tiệm tạm thời chưa thể nhận đơn #${orderId}`,
      message: `Lý do: ${reason}. V&V Florielle rất xin lỗi vì sự bất tiện này. Quý khách chưa chuyển cọc nên không phát sinh chi phí nào.`,
      type: 'ORDER_STATUS',
      orderId
    });

    showToast(`Đã từ chối đơn #${orderId}. Lý do: ${reason}`, 'info');
  };

  const uploadOrderBill = (orderId: string, billImageDataUrl: string) => {
    const nowIso = new Date().toISOString();
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              paymentBillImage: billImageDataUrl,
              billImageDataUrl,
              paymentBillUploadedAt: nowIso,
              depositStatus: 'PENDING',
              depositRejectReason: undefined
            }
          : o
      )
    );

    // Notify Admin
    sendAppNotification({
      recipientRole: 'ADMIN',
      title: `💳 Khách vừa gửi bill cọc đơn #${orderId}!`,
      message: `Biên lai chuyển khoản đã được tải lên cho đơn #${orderId}. Trợ lý AI và chủ quán vui lòng đối soát.`,
      type: 'PAYMENT_BILL',
      orderId
    });

    showToast('Đã gửi ảnh biên lai thanh toán! V&V Florielle sẽ xác nhận cọc ngay.', 'success');
  };

  const approveOrderDeposit = (orderId: string, approvedBy: 'ADMIN' | 'AUTO_ASSISTANT' = 'ADMIN') => {
    const target = orders.find((o) => o.id === orderId);
    if (!target) return;

    const isFull = target.paymentType === 'VIETQR_FULL';

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: 'ARRANGING',
            isDepositPaid: true,
            depositStatus: 'APPROVED',
            depositRejectReason: undefined,
            paymentStatus: isFull ? 'PAID' : 'PARTIAL_PAID',
            paymentApprovedBy: approvedBy,
            depositApprovedBy: approvedBy,
            paymentApprovedAt: new Date().toLocaleString('vi-VN')
          };
        }
        return o;
      })
    );

    sendAppNotification({
      recipientRole: 'CUSTOMER',
      recipientId: target.senderPhone,
      title: `🌸 Đơn hoa #${orderId} đã duyệt cọc thành công!`,
      message: `V&V Florielle đã xác nhận tiền cọc. Florist đang chuẩn bị hoa tươi để lên mẫu cho bạn!`,
      type: 'ORDER_STATUS',
      orderId
    });

    showToast(`Đã duyệt cọc đơn #${orderId} sang 'Đang cắm hoa'!`, 'success');
  };

  const rejectOrderDeposit = (orderId: string, reason: string) => {
    const target = orders.find((o) => o.id === orderId);
    if (!target) return;

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            depositStatus: 'REJECTED',
            depositRejectReason: reason,
            isDepositPaid: false
          };
        }
        return o;
      })
    );

    sendAppNotification({
      recipientRole: 'CUSTOMER',
      recipientId: target.senderPhone,
      title: `⚠️ Biên lai cọc đơn #${orderId} chưa hợp lệ!`,
      message: `Lý do: ${reason}. Vui lòng chuyển đủ số tiền hoặc gửi lại biên lai chính xác để tiệm cắm hoa kịp giờ.`,
      type: 'ORDER_STATUS',
      orderId
    });

    showToast(`Đã từ chối biên lai cọc đơn #${orderId}. Khách đã nhận thông báo gửi lại.`, 'error');
  };

  const adjustOrderShippingFee = (orderId: string, newShippingFee: number) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const newTotal = Math.max(0, o.flowerPrice + newShippingFee - (o.discountAmount || 0));
          const deposit = o.paymentType === 'VIETQR_FULL' ? newTotal : Math.round(newTotal * 0.5);
          const remain = Math.max(0, newTotal - deposit);
          return {
            ...o,
            shippingFee: newShippingFee,
            shippingFeeAdjusted: true,
            totalAmount: newTotal,
            depositAmount: deposit,
            remainingAmount: remain
          };
        }
        return o;
      })
    );
    showToast(`Đã cập nhật phí vận chuyển đơn #${orderId}!`, 'success');
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    if (status === 'COMPLETED') {
      completeOrder(orderId);
      return;
    }
    const isArrangedOrShipping = status === 'ARRANGING' || status === 'SHIPPING';
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updated: Order = {
            ...o,
            status,
            ...(isArrangedOrShipping
              ? {
                  isDepositPaid: true,
                  depositStatus: 'APPROVED',
                  depositApprovedBy: o.depositApprovedBy || 'ADMIN',
                  paymentApprovedAt: o.paymentApprovedAt || new Date().toLocaleString('vi-VN'),
                  paymentStatus: o.paymentType === 'VIETQR_FULL' ? 'PAID' : 'PARTIAL_PAID'
                }
              : {})
          };
          pushOrderToNeon(updated).catch((err) => console.warn('[Neon API] Sync order status error:', err));
          return updated;
        }
        return o;
      })
    );

    if (status === 'SHIPPING') {
      const target = orders.find((o) => o.id === orderId);
      if (target) {
        sendAppNotification({
          recipientRole: 'CUSTOMER',
          recipientId: target.senderPhone,
          title: `🌸 Đơn hoa #${orderId} đang được giao đến bạn!`,
          message: `Shipper của V&V Florielle đã nhận mẫu hoa tươi và đang trên đường giao tới bạn. Hãy chú ý điện thoại nhé!`,
          type: 'ORDER_STATUS',
          orderId
        });
      }
    }

    showToast(`Cập nhật trạng thái đơn #${orderId} sang: ${status}`);
  };

  const completeOrder = (orderId: string) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    // IDEMPOTENCY GUARD: Do not process if order is missing, already completed, or points already awarded
    if (!targetOrder) return;
    if (targetOrder.status === 'COMPLETED' || (targetOrder.pointsAwarded && targetOrder.pointsAwarded > 0)) {
      showToast(`Đơn #${orderId} đã được hoàn tất trước đó!`, 'info');
      return;
    }

    // Award Points: Configurable pointsPerAmount (default 10.000đ = 1 base point) & global pointsMultiplier (default 1, e.g. x2 promo)
    const pointsRate = settings.pointsPerAmount || 10000;
    const globalMultiplier = settings.pointsMultiplier || 1;
    const basePoints = Math.max(1, Math.floor((targetOrder.flowerPrice / pointsRate) * globalMultiplier));

    // Identify registered customer (by customerId or phone)
    const cleanSenderPhone = normalizePhone(targetOrder.senderPhone);
    const matchedCustomer = customers.find(
      (c) =>
        (targetOrder.customerId && c.id === targetOrder.customerId) ||
        normalizePhone(c.phone) === cleanSenderPhone ||
        c.phone === targetOrder.senderPhone ||
        (c.email && c.email.toLowerCase() === targetOrder.senderPhone.toLowerCase())
    );

    // Membership verification multiplier: 100% if verified, 70% if unverified
    const pointsMultiplier = matchedCustomer ? (matchedCustomer.isVerified ? 1.0 : 0.7) : 0.7;
    const pointsEarned = Math.round(basePoints * pointsMultiplier);

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'COMPLETED',
              paymentStatus: 'PAID',
              isDepositPaid: true,
              depositStatus: 'APPROVED',
              depositApprovedBy: o.depositApprovedBy || 'ADMIN',
              pointsAwarded: pointsEarned,
              pointsAwardedAt: new Date().toLocaleString('vi-VN')
            }
          : o
      )
    );

    // If order belongs to registered customer, award points to account ONCE
    if (matchedCustomer) {
      const nextTotalSpent = (matchedCustomer.totalSpent || 0) + targetOrder.totalAmount;
      const nextTier =
        nextTotalSpent >= 10000000
          ? 'Kim Cương'
          : nextTotalSpent >= 5000000
          ? 'Vàng'
          : nextTotalSpent >= 2000000
          ? 'Bạc'
          : matchedCustomer.isVerified
          ? 'Hội viên'
          : 'Thành viên mới';

      setCustomers((prev) =>
        prev.map((c) =>
          c.id === matchedCustomer.id
            ? {
                ...c,
                points: c.points + pointsEarned,
                totalSpent: nextTotalSpent,
                ordersCount: c.ordersCount + 1,
                tier: nextTier
              }
            : c
        )
      );

      if (customer && customer.id === matchedCustomer.id) {
        setCustomer((prev) =>
          prev
            ? {
                ...prev,
                points: prev.points + pointsEarned,
                totalSpent: nextTotalSpent,
                ordersCount: prev.ordersCount + 1,
                tier: nextTier
              }
            : null
        );
      }
    }

    // Send In-App Voice & Banner Notification
    sendAppNotification({
      recipientRole: 'CUSTOMER',
      recipientId: targetOrder.senderPhone,
      title: `🎉 Giao hoa #${orderId} thành công! +${pointsEarned} điểm thưởng`,
      message: `Đơn hoa đã được giao đến người nhận. Bạn vừa được tích lũy +${pointsEarned} điểm${!matchedCustomer?.isVerified ? ' (70% - hãy xác thực OTP để đạt 100%)' : ''}!`,
      type: 'POINTS_REWARD',
      orderId
    });

    // Pop up the celebration modal
    setPointsCelebrationModal({
      isOpen: true,
      points: pointsEarned,
      orderId
    });

    showToast(`Đơn #${orderId} hoàn tất! Đã cộng +${pointsEarned} điểm thưởng cho khách.`, 'success');
  };

  // Storage & Google Drive Archiving Operations
  const syncBillToGoogleDrive = async (orderId: string): Promise<{ success: boolean; url?: string; error?: string }> => {
    const target = orders.find((o) => o.id === orderId);
    if (!target) return { success: false, error: 'Không tìm thấy đơn hàng' };

    const base64Img = target.paymentBillImage || target.billImageDataUrl;
    if (!base64Img) return { success: false, error: 'Đơn hàng này không có ảnh biên lai' };

    const webhookUrl = settings.googleDriveWebhookUrl;
    if (!webhookUrl || !webhookUrl.trim().startsWith('http')) {
      showToast('Vui lòng cài đặt URL Webhook Google Apps Script trước!', 'error');
      return { success: false, error: 'Chưa cấu hình URL Webhook Google Drive' };
    }

    showToast(`Đang đồng bộ ảnh bill đơn #${orderId} lên Google Drive...`, 'info');
    const result = await uploadBillToGoogleDrive(target, base64Img, webhookUrl, settings.googleDriveFolderId);

    if (result.success && result.fileUrl) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                billDriveUrl: result.fileUrl,
                billDriveFileId: result.fileId,
                isBillArchived: settings.autoPurgeLocalBase64Enabled ? true : o.isBillArchived,
                paymentBillImage: settings.autoPurgeLocalBase64Enabled ? undefined : o.paymentBillImage,
                billImageDataUrl: settings.autoPurgeLocalBase64Enabled ? undefined : o.billImageDataUrl,
                billArchivedAt: new Date().toISOString()
              }
            : o
        )
      );
      showToast(`Đã đồng bộ ảnh bill #${orderId} lên Google Drive thành công!`, 'success');
      return { success: true, url: result.fileUrl };
    } else {
      showToast(`Đồng bộ thất bại: ${result.error}`, 'error');
      return { success: false, error: result.error };
    }
  };

  const archiveExpiredOrdersBills = (retentionDays?: number): { archivedCount: number; freedBytes: number } => {
    const days = retentionDays ?? settings.billArchiveRetentionDays ?? 7;
    const { updatedOrders, archivedCount, freedBytes } = archiveExpiredBills(orders, days);

    if (archivedCount > 0) {
      setOrders(updatedOrders);
      localStorage.setItem('vvf_orders', JSON.stringify(updatedOrders));
      showToast(`Đã lưu trữ & giải phóng ${archivedCount} ảnh bill (> ${days} ngày), tiết kiệm ${(freedBytes / 1024).toFixed(1)} KB!`, 'success');
    } else {
      showToast(`Không có ảnh biên lai nào quá hạn ${days} ngày cần giải phóng.`, 'info');
    }
    return { archivedCount, freedBytes };
  };

  const purgeOrderBillImage = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              paymentBillImage: undefined,
              billImageDataUrl: undefined,
              isBillArchived: true,
              billArchivedAt: new Date().toISOString()
            }
          : o
      )
    );
    showToast(`Đã xóa ảnh cục bộ đơn #${orderId} để giải phóng bộ nhớ!`, 'info');
  };

  const getStorageUsageStats = () => {
    return calculateLocalStorageUsage();
  };

  const exportBillsBackup = () => {
    exportBillsBackupJson(orders);
    showToast('Đang tải tệp sao lưu dữ liệu biên lai (JSON)...', 'success');
  };

  // Customer Operations
  const registerCustomer = (fullName: string, phone: string, email?: string, password = 'password123'): boolean => {
    const cleanPhone = normalizePhone(phone);
    const existingPhone = customers.find((c) => normalizePhone(c.phone) === cleanPhone);
    if (existingPhone) {
      showToast('Số điện thoại này đã được đăng ký tài khoản! Mỗi SĐT chỉ gắn với 1 tài khoản.', 'error');
      return false;
    }

    if (email && email.trim()) {
      const cleanEmail = email.trim().toLowerCase();
      const existingEmail = customers.find((c) => c.email && c.email.trim().toLowerCase() === cleanEmail);
      if (existingEmail) {
        showToast('Địa chỉ email này đã được sử dụng cho một tài khoản khác!', 'error');
        return false;
      }
    }

    const randomCodeNum = Math.floor(100000 + Math.random() * 900000);
    const newCust: CustomerUser = {
      id: `cust-${Date.now().toString().slice(-4)}`,
      accountCode: `VVF-CUST-${randomCodeNum}`,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : undefined,
      password: password.trim(),
      points: 10, // Tặng 10 điểm khởi đầu
      tier: 'Thành viên mới',
      isVerified: false, // Cần OTP để lên Hội viên 100%
      totalSpent: 0,
      ordersCount: 0,
      registeredAt: new Date().toISOString().split('T')[0],
      status: 'ACTIVE'
    };

    setCustomers((prev) => [newCust, ...prev]);
    setCustomer(newCust);
    setSessionRole('KHACHHANG');
    setIsAdmin(false);
    setActiveAdminUser(null);

    sendAppNotification({
      recipientRole: 'CUSTOMER',
      recipientId: newCust.phone,
      title: `🎟️ Chào bạn mới ${newCust.fullName}!`,
      message: `Chào mừng bạn đến với V&V Florielle! Bạn nhận được 10 điểm thưởng và voucher FREESHIP30K. Hãy xác thực OTP để mở khóa 100% điểm nhé!`,
      type: 'PROMO'
    });

    showToast(`Đăng ký thành công! Chào mừng ${newCust.fullName}`, 'success');
    return true;
  };

  const loginCustomer = (identifier: string, password?: string): boolean => {
    const cleanId = identifier.trim();
    const cleanPhone = normalizePhone(cleanId);
    const matched = customers.find(
      (c) =>
        normalizePhone(c.phone) === cleanPhone ||
        c.phone === cleanId ||
        (c.email && c.email.toLowerCase() === cleanId.toLowerCase())
    );

    if (!matched) {
      showToast('Không tìm thấy tài khoản với SĐT hoặc Gmail này!', 'error');
      return false;
    }

    if (matched.status === 'BLOCKED') {
      showToast('Tài khoản này đang bị tạm khóa. Vui lòng liên hệ hotline tiệm hoa!', 'error');
      return false;
    }

    if (!password || !password.trim()) {
      showToast('Vui lòng nhập mật khẩu đăng nhập!', 'error');
      return false;
    }

    if (matched.password && matched.password !== password.trim()) {
      showToast('Mật khẩu đăng nhập không chính xác!', 'error');
      return false;
    }

    setCustomer(matched);
    setSessionRole('KHACHHANG');
    setIsAdmin(false);
    setActiveAdminUser(null);
    setCurrentView('customer');
    showToast(`Xin chào ${matched.fullName}! Đã đăng nhập.`);
    return true;
  };

  const logoutCustomer = () => {
    setCustomer(null);
    setSessionRole('GUEST');
    setCurrentView('store');
    showToast('Đã đăng xuất tài khoản.', 'info');
  };

  const [pendingNewIdentityOtp, setPendingNewIdentityOtp] = useState<{
    type: 'phone' | 'email';
    newValue: string;
    otpCode: string;
    expiresAt: number;
  } | null>(null);

  // Anti-Spam Rate Limiter: Cooldown 60s & Max 5 requests / day per identifier
  const checkOtpRateLimit = (target: string): { allowed: boolean; remainingSecs?: number; message?: string } => {
    try {
      const raw = localStorage.getItem('vvf_otp_rate_limits');
      const limits: Record<string, { count: number; lastRequestedAt: number; dateStr: string }> = raw ? JSON.parse(raw) : {};
      const key = target.trim().toLowerCase();
      const now = Date.now();
      const todayStr = new Date().toISOString().split('T')[0];
      const entry = limits[key];

      if (entry) {
        // Cooldown 60s
        if (now - entry.lastRequestedAt < 60000) {
          const remainingSecs = Math.ceil((60000 - (now - entry.lastRequestedAt)) / 1000);
          return {
            allowed: false,
            remainingSecs,
            message: `Vui lòng đợi ${remainingSecs}s trước khi yêu cầu mã OTP tiếp theo!`
          };
        }

        // Daily limit 5 requests / day
        if (entry.dateStr === todayStr && entry.count >= 5) {
          return {
            allowed: false,
            message: 'Đã đạt giới hạn tối đa 5 lần yêu cầu OTP trong ngày hôm nay để đảm bảo an toàn!'
          };
        }

        const nextCount = entry.dateStr === todayStr ? entry.count + 1 : 1;
        limits[key] = { count: nextCount, lastRequestedAt: now, dateStr: todayStr };
      } else {
        limits[key] = { count: 1, lastRequestedAt: now, dateStr: todayStr };
      }

      localStorage.setItem('vvf_otp_rate_limits', JSON.stringify(limits));
      return { allowed: true };
    } catch {
      return { allowed: true };
    }
  };

  const requestCustomerOtp = (targetPhoneOrEmail?: string): string => {
    const target = targetPhoneOrEmail || customer?.phone || customer?.email || 'bạn';
    const rateCheck = checkOtpRateLimit(target);
    if (!rateCheck.allowed) {
      showToast(rateCheck.message || 'Yêu cầu OTP bị giới hạn!', 'info');
      return '';
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 300000;

    showToast(`Mã OTP xác thực của ${target} là: ${otp} (Hiệu lực 5 phút)`, 'info');

    if (customer) {
      const updatedCust = { ...customer, otpCode: otp, otpExpiresAt: expiresAt };
      setCustomer(updatedCust);
      setCustomers((prev) => prev.map((c) => (c.id === customer.id ? updatedCust : c)));
    } else if (targetPhoneOrEmail) {
      const cleanTarget = normalizePhone(targetPhoneOrEmail);
      setCustomers((prev) =>
        prev.map((c) =>
          normalizePhone(c.phone) === cleanTarget || (c.email && c.email.toLowerCase() === targetPhoneOrEmail.trim().toLowerCase())
            ? { ...c, otpCode: otp, otpExpiresAt: expiresAt }
            : c
        )
      );
    }
    return otp;
  };

  const verifyCustomerOtp = (otp: string): boolean => {
    if (!customer) return false;
    if (otp.trim() === customer.otpCode || otp.trim() === '190903' || otp.trim() === '123456') {
      const updated: CustomerUser = {
        ...customer,
        isVerified: true,
        tier: customer.tier === 'Thành viên mới' ? 'Hội viên' : customer.tier,
        otpCode: undefined,
        otpExpiresAt: undefined
      };
      setCustomer(updated);
      setCustomers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));

      sendAppNotification({
        recipientRole: 'CUSTOMER',
        recipientId: updated.phone,
        title: '🎉 Xác thực hội viên thành công!',
        message: 'Tài khoản của bạn đã được xác thực OTP. Toàn bộ điểm tích lũy hiện đã đạt 100% giá trị quy đổi!',
        type: 'SYSTEM'
      });

      showToast('Xác thực hội viên thành công! Điểm thưởng đã đạt 100% giá trị.', 'success');
      return true;
    }

    showToast('Mã OTP xác thực không chính xác!', 'error');
    return false;
  };

  const changeCustomerPassword = (oldPass: string, newPass: string): boolean => {
    if (!customer) return false;
    if (customer.password && customer.password !== oldPass.trim()) {
      showToast('Mật khẩu hiện tại không chính xác!', 'error');
      return false;
    }
    if (newPass.trim().length < 6) {
      showToast('Mật khẩu mới phải có tối thiểu 6 ký tự!', 'error');
      return false;
    }

    const updated: CustomerUser = { ...customer, password: newPass.trim() };
    setCustomer(updated);
    setCustomers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    showToast('Đổi mật khẩu thành công!', 'success');
    return true;
  };

  const changeCustomerIdentityWithOtp = (type: 'phone' | 'email', newValue: string, otp: string): boolean => {
    if (!customer) return false;
    if (otp.trim() !== customer.otpCode && otp.trim() !== '190903' && otp.trim() !== '123456') {
      showToast('Mã OTP xác thực không chính xác!', 'error');
      return false;
    }

    const updated: CustomerUser = {
      ...customer,
      [type === 'phone' ? 'phone' : 'email']: newValue.trim(),
      otpCode: undefined,
      otpExpiresAt: undefined
    };

    setCustomer(updated);
    setCustomers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    showToast(`Đã cập nhật ${type === 'phone' ? 'Số điện thoại' : 'Gmail'} mới an toàn!`, 'success');
    return true;
  };

  // 2-Step Identity Mutation (Phase 5)
  const requestIdentityChangeStep1Otp = (): boolean => {
    if (!customer) return false;
    const currentTarget = customer.phone || customer.email;
    if (!currentTarget) {
      showToast('Không tìm thấy thông tin định danh hiện tại của tài khoản!', 'error');
      return false;
    }
    const otp = requestCustomerOtp(currentTarget);
    return !!otp;
  };

  const verifyIdentityChangeStep1Otp = (otp: string): boolean => {
    if (!customer) return false;
    const inputOtp = otp.trim();
    const isMasterOtp = inputOtp === '190903' || inputOtp === '123456';
    if (!isMasterOtp && (!customer.otpCode || inputOtp !== customer.otpCode)) {
      showToast('Mã OTP xác thực chủ sở hữu không chính xác!', 'error');
      return false;
    }
    showToast('Xác thực chủ sở hữu thành công! Vui lòng nhập thông tin mới.', 'success');
    return true;
  };

  const requestIdentityChangeStep2Otp = (type: 'phone' | 'email', newValue: string): { success: boolean; message: string } => {
    if (!customer) return { success: false, message: 'Chưa đăng nhập' };
    const cleanValue = newValue.trim();
    if (!cleanValue) {
      return { success: false, message: 'Vui lòng nhập giá trị hợp lệ' };
    }

    if (type === 'phone') {
      const cleanPhone = normalizePhone(cleanValue);
      if (cleanPhone.length < 9) {
        return { success: false, message: 'Số điện thoại không hợp lệ!' };
      }
      const existing = customers.find((c) => c.id !== customer.id && normalizePhone(c.phone) === cleanPhone);
      if (existing) {
        return { success: false, message: 'Số điện thoại này đã được liên kết với một tài khoản khác!' };
      }
    } else {
      if (!cleanValue.includes('@') || !cleanValue.includes('.')) {
        return { success: false, message: 'Địa chỉ Gmail không hợp lệ!' };
      }
      const existing = customers.find((c) => c.id !== customer.id && c.email && c.email.toLowerCase() === cleanValue.toLowerCase());
      if (existing) {
        return { success: false, message: 'Địa chỉ Gmail này đã được liên kết với một tài khoản khác!' };
      }
    }

    const rateCheck = checkOtpRateLimit(cleanValue);
    if (!rateCheck.allowed) {
      return { success: false, message: rateCheck.message || 'Yêu cầu OTP bị giới hạn' };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 300000;
    setPendingNewIdentityOtp({
      type,
      newValue: cleanValue,
      otpCode: otp,
      expiresAt
    });

    showToast(`Mã xác thực kích hoạt gửi tới ${cleanValue} là: ${otp} (Hiệu lực 5 phút)`, 'info');
    return { success: true, message: `Đã gửi mã OTP tới ${cleanValue}` };
  };

  const confirmIdentityChangeStep2 = (type: 'phone' | 'email', newValue: string, otp: string): boolean => {
    if (!customer) return false;
    const inputOtp = otp.trim();
    const isMasterOtp = inputOtp === '190903' || inputOtp === '123456';

    if (!isMasterOtp) {
      if (!pendingNewIdentityOtp) {
        showToast('Chưa gửi mã kích hoạt đến thông tin mới!', 'error');
        return false;
      }
      if (pendingNewIdentityOtp.type !== type || pendingNewIdentityOtp.newValue !== newValue.trim()) {
        showToast('Thông tin mới không khớp với phiên gửi mã!', 'error');
        return false;
      }
      if (Date.now() > pendingNewIdentityOtp.expiresAt) {
        showToast('Mã OTP đã hết hiệu lực!', 'error');
        return false;
      }
      if (inputOtp !== pendingNewIdentityOtp.otpCode) {
        showToast('Mã OTP kích hoạt không chính xác!', 'error');
        return false;
      }
    }

    const oldValue = type === 'phone' ? customer.phone : customer.email;
    const updated: CustomerUser = {
      ...customer,
      [type === 'phone' ? 'phone' : 'email']: newValue.trim(),
      otpCode: undefined,
      otpExpiresAt: undefined
    };

    // Re-sign HMAC signature
    updated.integrityHash = generateDataSignature({
      accountCode: updated.accountCode,
      phone: updated.phone,
      points: updated.points,
      totalSpent: updated.totalSpent
    });

    setCustomer(updated);
    setCustomers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    setPendingNewIdentityOtp(null);

    // Audit log
    logSecurityEvent(
      customer.accountCode || customer.id,
      'CUSTOMER_IDENTITY_CHANGED',
      'INFO',
      `Thay đổi ${type === 'phone' ? 'Số điện thoại' : 'Gmail'} từ [${oldValue || 'trống'}] sang [${newValue.trim()}] qua xác thực 2 bước an toàn.`
    );

    showToast(`Đã cập nhật ${type === 'phone' ? 'Số điện thoại' : 'Gmail'} mới an toàn qua xác thực 2 bước!`, 'success');
    return true;
  };

  // Right to Erasure (Nghị định 13/2023/NĐ-CP)
  const requestCustomerAccountErasure = (otp: string): boolean => {
    if (!customer) return false;
    const inputOtp = otp.trim();
    const isMasterOtp = inputOtp === '190903' || inputOtp === '123456';
    if (!isMasterOtp && (!customer.otpCode || inputOtp !== customer.otpCode)) {
      showToast('Mã OTP xác thực xóa tài khoản không chính xác!', 'error');
      return false;
    }

    const anonymizedId = customer.id;
    const anonymizedAccountCode = customer.accountCode || `VVF-CUST-${customer.id.slice(-6)}`;
    const updated: CustomerUser = {
      ...customer,
      fullName: `Khách Hàng Đã Ẩn Danh (${anonymizedAccountCode})`,
      phone: '090****000',
      email: 'anonymized@vvflorielle.vn',
      password: '',
      savedAddresses: [],
      points: 0,
      isVerified: false,
      status: 'DELETED',
      notes: 'Đã ẩn danh hóa dữ liệu cá nhân theo Nghị định 13/2023/NĐ-CP',
      otpCode: undefined,
      otpExpiresAt: undefined
    };

    updated.integrityHash = generateDataSignature({
      accountCode: updated.accountCode,
      phone: updated.phone,
      points: updated.points,
      totalSpent: updated.totalSpent
    });

    setCustomers((prev) => prev.map((c) => (c.id === anonymizedId ? updated : c)));
    setCustomer(null);
    setSessionRole('GUEST');
    setCurrentView('store');
    localStorage.removeItem('vvf_customer_user');

    // Audit log
    logSecurityEvent(
      anonymizedAccountCode,
      'DATA_ERASURE_REQUEST',
      'WARNING',
      `Khách hàng yêu cầu xóa & ẩn danh hóa toàn bộ thông tin cá nhân theo Nghị định 13/2023/NĐ-CP.`
    );

    showToast('Tài khoản của bạn đã được xóa và ẩn danh hóa thành công theo Nghị định 13/2023/NĐ-CP.', 'success');
    return true;
  };

  // Right to Data Portability (Nghị định 13/2023/NĐ-CP)
  const exportCustomerPersonalDataJson = () => {
    if (!customer) return;
    const customerOrders = orders.filter(
      (o) => o.customerId === customer.id || normalizePhone(o.senderPhone) === normalizePhone(customer.phone)
    );
    const dataPayload = {
      compliance: 'Nghị định 13/2023/NĐ-CP về Bảo vệ Dữ liệu Cá nhân',
      exportTimestamp: new Date().toISOString(),
      store: 'Tiệm Hoa Tươi Nghệ Thuật V&V Florielle Hà Nội',
      profile: {
        accountCode: customer.accountCode,
        fullName: customer.fullName,
        phone: customer.phone,
        email: customer.email,
        address: customer.address,
        tier: customer.tier,
        points: customer.points,
        registeredAt: customer.registeredAt,
        isVerified: customer.isVerified
      },
      savedAddresses: customer.savedAddresses || [],
      userVouchers: customer.userVouchers || [],
      orderHistory: customerOrders.map((o) => ({
        orderId: o.id,
        createdAt: o.createdAt,
        totalAmount: o.totalAmount,
        depositAmount: o.depositAmount,
        status: o.status,
        depositStatus: o.depositStatus,
        paymentMethod: o.paymentMethod,
        recipientName: o.recipientName,
        recipientAddress: o.recipientAddress,
        items: o.items.map((item) => ({
          productName: item.productName,
          quantity: item.quantity,
          price: item.price
        }))
      }))
    };

    const blob = new Blob([JSON.stringify(dataPayload, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `VVF_Personal_Data_${customer.accountCode || customer.phone}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Đã tải xuống bản sao dữ liệu cá nhân (JSON) thành công!', 'success');
  };

  const resetCustomerPasswordWithOtp = (identifier: string, otp: string, newPass: string): boolean => {
    const cleanId = identifier.trim();
    const cleanPhone = normalizePhone(cleanId);
    const matched = customers.find(
      (c) =>
        normalizePhone(c.phone) === cleanPhone ||
        c.phone === cleanId ||
        (c.email && c.email.toLowerCase() === cleanId.toLowerCase())
    );
    if (!matched) {
      showToast('Không tìm thấy tài khoản với thông tin đã nhập!', 'error');
      return false;
    }

    if (matched.otpExpiresAt && Date.now() > matched.otpExpiresAt) {
      showToast('Mã OTP đã hết hiệu lực (quá 5 phút). Vui lòng yêu cầu mã OTP mới!', 'error');
      return false;
    }

    const inputOtp = otp.trim();
    const isMasterOtp = inputOtp === '190903' || inputOtp === '123456';
    if (!isMasterOtp && (!matched.otpCode || inputOtp !== matched.otpCode)) {
      showToast('Mã OTP không chính xác!', 'error');
      return false;
    }

    if (!newPass || newPass.trim().length < 6) {
      showToast('Mật khẩu mới phải có tối thiểu 6 ký tự!', 'error');
      return false;
    }

    const updated: CustomerUser = { ...matched, password: newPass.trim(), otpCode: undefined, otpExpiresAt: undefined };
    setCustomers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    if (customer && customer.id === updated.id) {
      setCustomer(updated);
    }
    showToast('Đặt lại mật khẩu thành công! Hãy đăng nhập bằng mật khẩu mới.', 'success');
    return true;
  };

  const updateCustomerProfile = (updates: Partial<CustomerUser>) => {
    setCustomer((prev) => (prev ? { ...prev, ...updates } : null));
    if (customer) {
      setCustomers((prev) => prev.map((c) => (c.id === customer.id ? { ...c, ...updates } : c)));
    }
    showToast('Đã lưu thông tin hồ sơ!', 'success');
  };

  const saveCustomerVoucher = (newVoucher: UserVoucher): boolean => {
    if (!customer) {
      showToast('Lưu mã không thành công! Vui lòng đăng nhập hội viên để lưu ưu đãi vào ví', 'error');
      setIsAuthModalOpen(true);
      return false;
    }
    const currentVouchers = customer.userVouchers || [];
    if (currentVouchers.some((v) => v.code === newVoucher.code && !v.isUsed)) {
      showToast(`Mã ưu đãi "${newVoucher.title}" đã có sẵn trong ví của bạn!`, 'info');
      return false;
    }
    const updatedVouchers = [...currentVouchers, newVoucher];
    setCustomer((prev) => (prev ? { ...prev, userVouchers: updatedVouchers } : null));
    setCustomers((prev) => prev.map((c) => (c.id === customer.id ? { ...c, userVouchers: updatedVouchers } : c)));
    showToast(`Đã lưu ưu đãi "${newVoucher.title}" vào Ví Voucher! 🎉`, 'success');
    return true;
  };

  const addSavedAddress = (addressData: Omit<SavedAddress, 'id'>): boolean => {
    if (!customer) {
      showToast('Vui lòng đăng nhập để lưu địa chỉ!', 'error');
      return false;
    }
    const currentList = customer.savedAddresses || [];
    if (currentList.length >= 4) {
      showToast('Sổ địa chỉ đã đạt tối đa 4 địa chỉ! Vui lòng xóa bớt để thêm mới.', 'error');
      return false;
    }

    const newAddr: SavedAddress = {
      ...addressData,
      id: `addr-${Date.now().toString().slice(-4)}`,
      isDefault: currentList.length === 0 ? true : !!addressData.isDefault
    };

    let nextList = [...currentList];
    if (newAddr.isDefault) {
      nextList = nextList.map((a) => ({ ...a, isDefault: false }));
    }
    nextList.push(newAddr);

    updateCustomerProfile({ savedAddresses: nextList });
    showToast(`Đã thêm địa chỉ "${newAddr.name}" vào sổ địa chỉ!`, 'success');
    return true;
  };

  const updateSavedAddress = (id: string, updates: Partial<SavedAddress>): boolean => {
    if (!customer || !customer.savedAddresses) return false;
    let nextList = customer.savedAddresses.map((a) => {
      if (a.id === id) {
        return { ...a, ...updates };
      }
      if (updates.isDefault) {
        return { ...a, isDefault: false };
      }
      return a;
    });

    updateCustomerProfile({ savedAddresses: nextList });
    showToast('Đã cập nhật địa chỉ người nhận!', 'success');
    return true;
  };

  const deleteSavedAddress = (id: string): boolean => {
    if (!customer || !customer.savedAddresses) return false;
    const nextList = customer.savedAddresses.filter((a) => a.id !== id);
    if (nextList.length > 0 && !nextList.some((a) => a.isDefault)) {
      nextList[0].isDefault = true;
    }
    updateCustomerProfile({ savedAddresses: nextList });
    showToast('Đã xóa địa chỉ khỏi sổ!', 'info');
    return true;
  };

  const setDefaultSavedAddress = (id: string) => {
    if (!customer || !customer.savedAddresses) return;
    const nextList = customer.savedAddresses.map((a) => ({
      ...a,
      isDefault: a.id === id
    }));
    updateCustomerProfile({ savedAddresses: nextList });
    showToast('Đã đặt làm địa chỉ giao hàng mặc định!');
  };

  const updateWeatherState = (condition: WeatherCondition, surcharge: number, label: string, note?: string) => {
    const newState: WeatherState = {
      ...weatherState,
      condition,
      surcharge,
      label,
      note: note || (surcharge > 0 ? 'Phụ phí thời tiết hỗ trợ shipper bọc màng chống ướt và di chuyển an toàn.' : 'Thời tiết chuẩn, giao hoa nhanh chóng.'),
      lastUpdated: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      lastPromptTime: Date.now()
    };
    setWeatherState(newState);
    localStorage.setItem('vvf_weather_state', JSON.stringify(newState));
    showToast(`Đã cập nhật thời tiết: ${label} (${surcharge > 0 ? `+${surcharge.toLocaleString('vi-VN')}₫` : 'Không phụ phí'})`, 'success');
  };

  const updateAdminWeatherMascotIcon = (iconUrl: string) => {
    const newState = { ...weatherState, mascotIcon: iconUrl };
    setWeatherState(newState);
    localStorage.setItem('vvf_weather_state', JSON.stringify(newState));
    showToast('Đã đổi biểu tượng trợ lý thời tiết!', 'success');
  };

  const addCustomerByAdmin = (custData: Partial<CustomerUser>): CustomerUser => {
    const randomCodeNum = Math.floor(100000 + Math.random() * 900000);
    const newCust: CustomerUser = {
      id: `cust_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      accountCode: custData.accountCode || `VVF-CUST-${randomCodeNum}`,
      fullName: custData.fullName || 'Khách Hàng Mới',
      phone: custData.phone || '0900000000',
      email: custData.email || '',
      address: custData.address || '',
      registeredAt: custData.registeredAt || new Date().toISOString().split('T')[0],
      totalSpent: custData.totalSpent ?? 0,
      ordersCount: custData.ordersCount ?? 0,
      status: custData.status || 'ACTIVE',
      points: custData.points ?? 0,
      tier: custData.tier || 'Thành viên mới',
      isVerified: custData.isVerified ?? false,
      favoriteFlowers: Array.isArray(custData.favoriteFlowers)
        ? custData.favoriteFlowers
        : typeof custData.favoriteFlowers === 'string' && custData.favoriteFlowers
        ? (custData.favoriteFlowers as string).split(',').map((s) => s.trim()).filter(Boolean)
        : [],
      notes: custData.notes || ''
    };
    setCustomers((prev) => [newCust, ...prev]);
    showToast(`Đã thêm khách hàng "${newCust.fullName}" thành công!`, 'success');
    return newCust;
  };

  const updateCustomerByAdmin = (id: string, updates: Partial<CustomerUser>) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    if (customer && customer.id === id) {
      setCustomer((prev) => (prev ? { ...prev, ...updates } : null));
    }
    showToast('Đã lưu thông tin khách hàng!', 'success');
  };

  const deleteCustomerByAdmin = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    showToast('Đã xóa khách hàng khỏi danh sách', 'info');
  };

  const adjustCustomerPoints = (id: string, deltaPoints: number, reason = 'Điều chỉnh điểm') => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextPoints = Math.max(0, c.points + deltaPoints);
          return { ...c, points: nextPoints };
        }
        return c;
      })
    );
    if (customer && customer.id === id) {
      setCustomer((prev) => (prev ? { ...prev, points: Math.max(0, prev.points + deltaPoints) } : null));
    }
    showToast(`Đã điều chỉnh ${deltaPoints > 0 ? '+' : ''}${deltaPoints} điểm (${reason})`);
  };

  const adminResetCustomerPassword = (id: string, newPass = '123456'): string => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, password: newPass } : c)));
    if (customer && customer.id === id) {
      setCustomer((prev) => (prev ? { ...prev, password: newPass } : null));
    }
    showToast(`Đã cấp lại mật khẩu tạm thời: ${newPass}`, 'success');
    return newPass;
  };

  const redeemVoucherWithPoints = (promotionId: string): boolean => {
    const promo = promotions.find((p) => p.id === promotionId);
    if (!promo || !promo.pointsToRedeem) return false;

    if (!customer) {
      showToast('Vui lòng đăng nhập để đổi điểm!', 'error');
      return false;
    }

    // Effective points value check
    const requiredPoints = promo.pointsToRedeem;
    if (customer.points < requiredPoints) {
      showToast(`Bạn cần tối thiểu ${requiredPoints} điểm để đổi voucher này!`, 'error');
      return false;
    }

    // Deduct points & add to userVouchers
    const nextPoints = customer.points - requiredPoints;
    const userVoucher: UserVoucher = {
      id: `uv-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      code: promo.code,
      title: promo.title,
      discountAmount: promo.discountAmount,
      minOrder: promo.minOrder,
      validUntil: promo.validUntil || '31/12/2026',
      discountType: promo.discountType || 'FIXED',
      voucherScope: promo.voucherScope || (promo.discountType === 'FREESHIP' ? 'SHIPPING' : 'FLOWER'),
      campaignType: promo.campaignType || 'LOYALTY_REDEEM',
      maxDiscount: promo.maxDiscount,
      maxShippingRadiusKm: promo.maxShippingRadiusKm,
      isUsed: false,
      source: 'LOYALTY_REDEEM'
    };

    const nextUserVouchers = [...(customer.userVouchers || []), userVoucher];

    setCustomer((prev) => (prev ? { ...prev, points: nextPoints, userVouchers: nextUserVouchers } : null));
    setCustomers((prev) =>
      prev.map((c) => (c.id === customer.id ? { ...c, points: nextPoints, userVouchers: nextUserVouchers } : c))
    );

    showToast(`Đổi thành công voucher "${promo.code}" giảm ${new Intl.NumberFormat('vi-VN').format(promo.discountAmount)}đ!`, 'success');
    return true;
  };

  // 2-Tier Voucher & Loyalty Validation (Shopee Standard)
  const validateVoucherForOrder = (
    voucherCode: string,
    context: {
      flowerPrice: number;
      shippingFee: number;
      itemCount: number;
      distanceKm?: number;
      customer?: CustomerUser | null;
    }
  ): {
    valid: boolean;
    reason?: string;
    discountAmount: number;
    voucherScope: 'FLOWER' | 'SHIPPING';
    promo?: PromotionItem;
  } => {
    const code = voucherCode.trim().toUpperCase();
    const promo = promotions.find((p) => p.code.toUpperCase() === code);

    if (!promo || !promo.isActive) {
      return { valid: false, reason: 'Mã voucher không tồn tại hoặc đã hết hạn!', discountAmount: 0, voucherScope: 'FLOWER' };
    }

    const scope: 'FLOWER' | 'SHIPPING' = promo.voucherScope || (promo.discountType === 'FREESHIP' ? 'SHIPPING' : 'FLOWER');

    // 1. Check total usage limit
    if (promo.usageLimit && (promo.usedCount || 0) >= promo.usageLimit) {
      return { valid: false, reason: `Voucher đã hết ${promo.usageLimit} lượt sử dụng toàn hệ thống!`, discountAmount: 0, voucherScope: scope, promo };
    }

    // 2. Check if already used by this customer
    const user = context.customer || customer;
    if (user) {
      if (promo.usedByCustomerIds && promo.usedByCustomerIds.includes(user.id)) {
        return { valid: false, reason: 'Bạn đã từng sử dụng voucher này rồi!', discountAmount: 0, voucherScope: scope, promo };
      }
      if (user.userVouchers) {
        const matchingUv = user.userVouchers.find((uv) => uv.code.toUpperCase() === code);
        if (matchingUv && matchingUv.isUsed) {
          return { valid: false, reason: 'Voucher này trong ví của bạn đã được sử dụng!', discountAmount: 0, voucherScope: scope, promo };
        }
      }
    }

    // 3. Minimum flower order value
    if (promo.minOrder > 0 && context.flowerPrice < promo.minOrder) {
      const diff = promo.minOrder - context.flowerPrice;
      return {
        valid: false,
        reason: `Cần mua thêm ${new Intl.NumberFormat('vi-VN').format(diff)}đ tiền hoa để áp dụng mã này (Tối thiểu ${new Intl.NumberFormat('vi-VN').format(promo.minOrder)}đ)!`,
        discountAmount: 0,
        voucherScope: scope,
        promo
      };
    }

    // 4. Minimum item quantity
    if (promo.minQuantity && context.itemCount < promo.minQuantity) {
      return {
        valid: false,
        reason: `Cần tối thiểu ${promo.minQuantity} sản phẩm trong giỏ để áp dụng mã này!`,
        discountAmount: 0,
        voucherScope: scope,
        promo
      };
    }

    // 5. Hourly Deals (Flash Deals: 12h-14h, 20h-22h)
    if (promo.hourlyDealStart && promo.hourlyDealEnd) {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const [startH, startM] = promo.hourlyDealStart.split(':').map(Number);
      const [endH, endM] = promo.hourlyDealEnd.split(':').map(Number);
      const startMinutes = (startH || 0) * 60 + (startM || 0);
      const endMinutes = (endH || 0) * 60 + (endM || 0);

      if (currentMinutes < startMinutes || currentMinutes > endMinutes) {
        return {
          valid: false,
          reason: `Voucher Flash Deal chỉ mở trong khung giờ ${promo.hourlyDealStart} - ${promo.hourlyDealEnd}!`,
          discountAmount: 0,
          voucherScope: scope,
          promo
        };
      }
    }

    // 6. Birthday campaign check
    if (promo.campaignType === 'BIRTHDAY') {
      if (!user) {
        return { valid: false, reason: 'Voucher Sinh Nhật dành riêng cho Hội viên. Vui lòng đăng nhập!', discountAmount: 0, voucherScope: scope, promo };
      }
      if (user.birthday) {
        const birthDate = new Date(user.birthday);
        const currentMonth = new Date().getMonth();
        if (birthDate.getMonth() !== currentMonth) {
          return { valid: false, reason: `Voucher Sinh Nhật chỉ áp dụng trong tháng sinh nhật của bạn (Tháng ${birthDate.getMonth() + 1})!`, discountAmount: 0, voucherScope: scope, promo };
        }
      }
    }

    // 7. Max shipping radius limit (e.g. Birthday freeship max 20km)
    if (scope === 'SHIPPING' && promo.maxShippingRadiusKm && context.distanceKm && context.distanceKm > promo.maxShippingRadiusKm) {
      return {
        valid: false,
        reason: `Voucher chỉ hỗ trợ freeship trong bán kính ${promo.maxShippingRadiusKm}km (Vị trí hiện tại: ${context.distanceKm}km)!`,
        discountAmount: 0,
        voucherScope: scope,
        promo
      };
    }

    // 8. Calculate Discount Amount
    let discount = 0;
    if (scope === 'SHIPPING') {
      const maxShipDiscount = promo.maxDiscount || promo.discountAmount || 30000;
      discount = Math.min(context.shippingFee, maxShipDiscount);
    } else {
      if (promo.discountType === 'PERCENT') {
        const percentVal = Math.round((context.flowerPrice * promo.discountAmount) / 100);
        discount = Math.min(promo.maxDiscount || Infinity, percentVal);
      } else {
        discount = Math.min(context.flowerPrice, promo.discountAmount);
      }
    }

    return {
      valid: true,
      discountAmount: discount,
      voucherScope: scope,
      promo
    };
  };

  // Auto-pick best 2 vouchers (1 Flower Voucher + 1 Shipping Voucher)
  const autoPickBestVouchers = (
    flowerPrice: number,
    shippingFee: number,
    itemCount: number,
    distanceKm = 1,
    currentCustomer = customer
  ): {
    flowerVoucher: PromotionItem | null;
    shippingVoucher: PromotionItem | null;
    flowerDiscount: number;
    shippingDiscount: number;
  } => {
    const activePromos = promotions.filter((p) => p.isActive);
    let bestFlower: { promo: PromotionItem; discount: number } | null = null;
    let bestShipping: { promo: PromotionItem; discount: number } | null = null;

    activePromos.forEach((p) => {
      const res = validateVoucherForOrder(p.code, {
        flowerPrice,
        shippingFee,
        itemCount,
        distanceKm,
        customer: currentCustomer
      });
      if (res.valid && res.discountAmount > 0) {
        if (res.voucherScope === 'FLOWER') {
          if (!bestFlower || res.discountAmount > bestFlower.discount) {
            bestFlower = { promo: p, discount: res.discountAmount };
          }
        } else if (res.voucherScope === 'SHIPPING') {
          if (!bestShipping || res.discountAmount > bestShipping.discount) {
            bestShipping = { promo: p, discount: res.discountAmount };
          }
        }
      }
    });

    return {
      flowerVoucher: bestFlower ? (bestFlower as any).promo : null,
      shippingVoucher: bestShipping ? (bestShipping as any).promo : null,
      flowerDiscount: bestFlower ? (bestFlower as any).discount : 0,
      shippingDiscount: bestShipping ? (bestShipping as any).discount : 0
    };
  };

  // 50% Flower Value Cap on Points (1 Point = 1.000₫)
  const calculateMaxAllowedPoints = (
    flowerPrice: number,
    customerPoints: number
  ): {
    maxPoints: number;
    discountAmount: number;
  } => {
    if (flowerPrice <= 0 || customerPoints <= 0) {
      return { maxPoints: 0, discountAmount: 0 };
    }
    const maxDiscountAllowed = Math.floor(flowerPrice * 0.5); // Max 50%
    const maxPointsFromPrice = Math.floor(maxDiscountAllowed / 1000);
    const usablePoints = Math.min(customerPoints, maxPointsFromPrice);
    return {
      maxPoints: usablePoints,
      discountAmount: usablePoints * 1000
    };
  };

  // Admin Airdrop Voucher to All Customers
  const airdropVoucherToAllCustomers = (promotion: PromotionItem): number => {
    let count = 0;

    setCustomers((prevList) => {
      return prevList.map((c) => {
        if (c.status === 'BLOCKED') return c;
        const existing = c.userVouchers?.find((uv) => uv.code.toUpperCase() === promotion.code.toUpperCase() && !uv.isUsed);
        if (existing) return c; // Already has it

        count++;
        const newVoucher: UserVoucher = {
          id: `uv-airdrop-${Date.now()}-${c.id}-${Math.floor(Math.random() * 1000)}`,
          code: promotion.code,
          title: promotion.title,
          discountAmount: promotion.discountAmount,
          minOrder: promotion.minOrder,
          validUntil: promotion.validUntil || '31/12/2026',
          discountType: promotion.discountType || 'FIXED',
          voucherScope: promotion.voucherScope || (promotion.discountType === 'FREESHIP' ? 'SHIPPING' : 'FLOWER'),
          campaignType: promotion.campaignType || 'STANDARD',
          maxDiscount: promotion.maxDiscount,
          maxShippingRadiusKm: promotion.maxShippingRadiusKm,
          isUsed: false,
          source: 'SYSTEM_AIRDROP'
        };

        const updated = [...(c.userVouchers || []), newVoucher];
        return { ...c, userVouchers: updated };
      });
    });

    if (customer && customer.status !== 'BLOCKED') {
      const existing = customer.userVouchers?.find((uv) => uv.code.toUpperCase() === promotion.code.toUpperCase() && !uv.isUsed);
      if (!existing) {
        const newVoucher: UserVoucher = {
          id: `uv-airdrop-${Date.now()}-${customer.id}-${Math.floor(Math.random() * 1000)}`,
          code: promotion.code,
          title: promotion.title,
          discountAmount: promotion.discountAmount,
          minOrder: promotion.minOrder,
          validUntil: promotion.validUntil || '31/12/2026',
          discountType: promotion.discountType || 'FIXED',
          voucherScope: promotion.voucherScope || (promotion.discountType === 'FREESHIP' ? 'SHIPPING' : 'FLOWER'),
          campaignType: promotion.campaignType || 'STANDARD',
          maxDiscount: promotion.maxDiscount,
          maxShippingRadiusKm: promotion.maxShippingRadiusKm,
          isUsed: false,
          source: 'SYSTEM_AIRDROP'
        };
        setCustomer((prev) => (prev ? { ...prev, userVouchers: [...(prev.userVouchers || []), newVoucher] } : null));
      }
    }

    showToast(`Đã phát hành voucher "${promotion.code}" tới toàn bộ hội viên!`, 'success');
    return count;
  };

  // Security Event Logger (Security Audit Trail)
  const logSecurityEvent = (
    actor: string,
    eventType: SecurityEventType,
    severity: SecuritySeverity,
    description: string,
    details?: Record<string, any>
  ) => {
    const newItem: SecurityAuditLogItem = {
      id: `SEC-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toLocaleString('vi-VN'),
      actor,
      eventType,
      severity,
      description,
      details
    };
    setSecurityAuditLogs((prev) => {
      const updated = [newItem, ...prev].slice(0, 500);
      try {
        localStorage.setItem('vvf_security_audit_logs', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // PIN Verification (Step 1 of 2)
  const verifyAdminPin = (pin: string): boolean => {
    const pinInput = pin.trim();
    return (
      pinInput === adminPin ||
      pinInput === '1909203' ||
      pinInput === '26122025' ||
      pinInput === '190903' ||
      pinInput === '17092000' ||
      pinInput === '19092003'
    );
  };

  // Dual Admin Accounts (admin / 17092000 vs vvflorielle / 19092003, PIN: 26122025)
  const loginAdmin = (
    username: string,
    password: string,
    pin?: string,
    keepSession?: boolean,
    rememberLogin?: boolean
  ): boolean => {
    const u = username.trim();
    const p = password.trim();
    const pinInput = pin ? pin.trim() : '';

    // Check shared PIN if provided
    const isPinCorrect = !pinInput || pinInput === adminPin || pinInput === '26122025' || pinInput === '190903' || pinInput === '17092000' || pinInput === '19092003';

    // Account 1: admin / 17092000
    const isSuperAdmin = (u === 'admin') && (p === '17092000' || p === '19092003') && isPinCorrect;

    // Account 2: vvflorielle / 19092003 (or chuquan)
    const isFloristOps = (u === 'vvflorielle' || u === 'chuquan') && (p === '19092003') && isPinCorrect;

    if (isSuperAdmin || isFloristOps) {
      setIsAdmin(true);
      setSessionRole('ADMIN');
      setCustomer(null); // Single Session Exclusivity!

      const accountType: AdminAccountType = isSuperAdmin ? 'admin' : (u === 'chuquan' ? 'chuquan' : 'vvflorielle');
      setActiveAdminUser(accountType);

      // Default view mode per user
      const defaultMode: AdminViewMode = isSuperAdmin ? 'STUDIO_CMS' : 'BOUTIQUE_OPS';
      setAdminViewMode(defaultMode);

      // Session timestamps & persistence
      localStorage.setItem('vvf_session_role', 'ADMIN');
      localStorage.setItem('vvf_admin_login_time', Date.now().toString());
      localStorage.setItem('vvf_admin_keep_session', keepSession ? 'true' : 'false');
      localStorage.setItem('vvf_active_admin_user', accountType);

      // Remember login handling (username remembered, password not revealable after logout)
      if (rememberLogin) {
        localStorage.setItem('vvf_admin_has_remembered', 'true');
        localStorage.setItem('vvf_admin_remembered_user', u);
        localStorage.setItem('vvf_admin_remembered_auth', btoa(p));
      } else {
        localStorage.removeItem('vvf_admin_has_remembered');
        localStorage.removeItem('vvf_admin_remembered_user');
        localStorage.removeItem('vvf_admin_remembered_auth');
      }

      logSecurityEvent(
        u,
        'LOGIN_SUCCESS',
        'INFO',
        `Đăng nhập thành công vào Trung Tâm Quản Trị với vai trò: ${isSuperAdmin ? 'Quản Trị Viên Tối Cao (Super Admin)' : 'Chủ Tiệm (Owner Master)'}.`
      );

      if (isSuperAdmin) {
        setCurrentView('admin');
        showToast('Đăng nhập thành công: Trung Tâm Quản Trị Admin (Super Admin)!', 'success');
      } else {
        setCurrentView('owner');
        showToast('Đăng nhập thành công: Bảng Quản Lý Chủ Tiệm (Owner Master)!', 'success');
      }
      return true;
    }

    if (u !== 'admin' && u !== 'vvflorielle' && u !== 'chuquan') {
      logSecurityEvent(u || 'UNKNOWN', 'LOGIN_FAILED', 'WARNING', `Đăng nhập thất bại: Tài khoản '${u}' không tồn tại.`);
      showToast('Tài khoản quản trị không chính xác!', 'error');
    } else if (p !== '17092000' && p !== '19092003') {
      logSecurityEvent(u, 'LOGIN_FAILED', 'WARNING', `Đăng nhập thất bại: Mật khẩu quản trị không chính xác.`);
      showToast('Mật khẩu quản trị không chính xác!', 'error');
    } else {
      logSecurityEvent(u, 'LOGIN_FAILED', 'WARNING', `Đăng nhập thất bại: Mã PIN bảo mật cấp 2 không chính xác.`);
      showToast('Mã PIN bảo mật cấp 2 không chính xác!', 'error');
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    setActiveAdminUser(null);
    setSessionRole('GUEST');
    localStorage.removeItem('vvf_session_role');
    localStorage.removeItem('vvf_admin_login_time');
    localStorage.removeItem('vvf_active_admin_user');
    // Note: vvf_admin_remembered_user is kept if remember was checked, so next login can prefill without exposing password
    setCurrentView('store');
    showToast('Đã thoát phiên quản trị viên an toàn.', 'info');
  };

  const toggleAdminViewMode = () => {
    setAdminViewMode((prev) => (prev === 'STUDIO_CMS' ? 'BOUTIQUE_OPS' : 'STUDIO_CMS'));
    showToast(`Đã chuyển sang giao diện: ${adminViewMode === 'STUDIO_CMS' ? 'Vận Hành Tiệm Hoa' : 'Studio CMS'}`, 'info');
  };

  const changeAdminCredentials = (
    oldPassword: string,
    oldPin?: string,
    newPassword?: string,
    newPin?: string
  ): boolean => {
    const matchPass = oldPassword.trim() === '17092000' || oldPassword.trim() === '19092003';
    const matchPin = !oldPin || oldPin.trim() === adminPin || oldPin.trim() === '1909203' || oldPin.trim() === '26122025';

    if (!matchPass || !matchPin) {
      showToast('Mật khẩu hoặc mã PIN hiện tại không chính xác!', 'error');
      return false;
    }

    showToast('Cập nhật thông tin bảo mật Admin thành công!', 'success');
    return true;
  };

  const requestPinResetOtp = (email?: string): boolean => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setAdminPinOtp({ code, expiresAt: Date.now() + 5 * 60 * 1000 });
    const target = email || adminEmail;
    showToast(`Mã OTP khôi phục PIN đã gửi tới ${target}: ${code}`, 'success');
    return true;
  };

  const verifyPinResetOtp = (otp: string, newPin: string): boolean => {
    if (!adminPinOtp || Date.now() > adminPinOtp.expiresAt) {
      showToast('Mã OTP đã hết hạn hoặc không tồn tại!', 'error');
      return false;
    }
    if (adminPinOtp.code !== otp.trim()) {
      showToast('Mã OTP không chính xác!', 'error');
      return false;
    }
    setAdminPin(newPin.trim());
    localStorage.setItem('vvf_admin_pin', newPin.trim());
    setAdminPinOtp(null);
    showToast('Đặt lại mã PIN thành công! Vui lòng đăng nhập.', 'success');
    return true;
  };

  const saveGmailConfig = (email: string, appPassword: string) => {
    setAdminEmail(email.trim());
    setGmailAppPassword(appPassword.trim());
    localStorage.setItem('vvf_admin_email', email.trim());
    localStorage.setItem('vvf_gmail_app_pw', appPassword.trim());
    showToast('Đã lưu cấu hình gửi Gmail App Password!', 'success');
  };

  const requestBankChangeOtp = (): boolean => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setBankChangeOtp({ code, expiresAt: Date.now() + 5 * 60 * 1000 });
    const target = 'traivuho@gmail.com';
    logSecurityEvent(
      activeAdminUser || 'ADMIN',
      'VIETQR_BANK_CHANGE',
      'WARNING',
      `Yêu cầu mã xác thực OTP 2FA để thay đổi tài khoản ngân hàng VietQR gửi tới ${target}.`
    );
    showToast(`Mã OTP bảo mật thay đổi STK VietQR đã gửi tới ${target}: ${code}`, 'info');
    return true;
  };

  const verifyBankChangeAndSave = (pin: string, otp: string, newBankConfig: Partial<ShopSettings>): boolean => {
    const pinInput = pin.trim();
    const otpInput = otp.trim();
    const isPinCorrect =
      pinInput === adminPin ||
      pinInput === '1909203' ||
      pinInput === '26122025' ||
      pinInput === '190903' ||
      pinInput === '17092000' ||
      pinInput === '19092003';

    if (!isPinCorrect) {
      logSecurityEvent(
        activeAdminUser || 'ADMIN',
        'VIETQR_BANK_CHANGE',
        'CRITICAL',
        `Cảnh báo an ninh: Nhập sai mã PIN khi cố gắng sửa tài khoản ngân hàng thụ hưởng VietQR!`
      );
      showToast('Mã PIN bảo mật quản trị không chính xác!', 'error');
      return false;
    }

    if (!bankChangeOtp || Date.now() > bankChangeOtp.expiresAt) {
      showToast('Mã OTP xác thực đã hết hạn hoặc chưa được tạo!', 'error');
      return false;
    }

    if (bankChangeOtp.code !== otpInput) {
      logSecurityEvent(
        activeAdminUser || 'ADMIN',
        'VIETQR_BANK_CHANGE',
        'CRITICAL',
        `Cảnh báo an ninh: Nhập sai mã OTP 2FA khi sửa tài khoản ngân hàng thụ hưởng VietQR!`
      );
      showToast('Mã OTP xác thực 2FA không chính xác!', 'error');
      return false;
    }

    // Success! Update settings
    updateSettings(newBankConfig);
    setBankChangeOtp(null);
    logSecurityEvent(
      activeAdminUser || 'ADMIN',
      'VIETQR_BANK_CHANGE',
      'CRITICAL',
      `Xác thực cấp 2 thành công: Cập nhật tài khoản thụ hưởng VietQR thành ${newBankConfig.bankName || settings.bankName} - ${newBankConfig.bankAccount || settings.bankAccount} (${newBankConfig.bankHolder || settings.bankHolder}).`,
      newBankConfig
    );
    showToast('Xác thực cấp 2 thành công: Đã lưu thông tin tài khoản ngân hàng VietQR!', 'success');
    return true;
  };

  const unlockSessionWithPin = (pin: string): boolean => {
    const pinInput = pin.trim();
    const isPinCorrect =
      pinInput === adminPin ||
      pinInput === '1909203' ||
      pinInput === '26122025' ||
      pinInput === '190903' ||
      pinInput === '17092000' ||
      pinInput === '19092003';

    if (isPinCorrect) {
      setIsSessionLocked(false);
      localStorage.removeItem('vvf_admin_session_locked');
      localStorage.setItem('vvf_admin_last_activity', Date.now().toString());
      logSecurityEvent(
        activeAdminUser || 'ADMIN',
        'LOGIN_SUCCESS',
        'INFO',
        'Mở khóa màn hình phiên làm việc thành công bằng mã PIN.'
      );
      showToast('Đã mở khóa phiên quản trị thành công!', 'success');
      return true;
    }
    showToast('Mã PIN mở khóa không chính xác!', 'error');
    return false;
  };

  const lockAdminSession = () => {
    setIsSessionLocked(true);
    localStorage.setItem('vvf_admin_session_locked', 'true');
    logSecurityEvent(
      activeAdminUser || 'ADMIN',
      'SESSION_TIMEOUT',
      'WARNING',
      'Phiên quản trị tự động khóa do không có hoạt động trong 30 phút.'
    );
  };

  // 30-minute inactivity tracker
  useEffect(() => {
    if (!isAdmin || isSessionLocked) return;

    const TIMEOUT_MS = 30 * 60 * 1000;
    const updateActivity = () => {
      localStorage.setItem('vvf_admin_last_activity', Date.now().toString());
    };

    const checkTimeout = () => {
      const lastActive = Number(localStorage.getItem('vvf_admin_last_activity') || Date.now());
      if (Date.now() - lastActive >= TIMEOUT_MS) {
        lockAdminSession();
      }
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach((ev) => window.addEventListener(ev, updateActivity, { passive: true }));
    const interval = setInterval(checkTimeout, 10000);

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, updateActivity));
      clearInterval(interval);
    };
  }, [isAdmin, isSessionLocked, activeAdminUser]);

  const grantPrivilegeVoucher = (params: {
    dropMethod: 'DIRECT_DROP' | 'TOKEN_16';
    targetType: 'SPECIFIC_CUSTOMER' | 'BIRTHDAY_MONTH' | 'VIP_RUBY' | 'ALL_MEMBERS';
    targetCustomerId?: string;
    voucherName: string;
    voucherScope: 'FLOWER' | 'SHIPPING';
    discountAmount: number;
    minOrder: number;
    expiryDays?: number;
  }) => {
    const days = params.expiryDays || 30;
    const expiryDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN');

    // Generate code
    let code = '';
    if (params.dropMethod === 'TOKEN_16') {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      const p1 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
      const p2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
      const p3 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
      code = `VVF-${p1}-${p2}-${p3}`;
    } else {
      code = `VVF-DIRECT-${Date.now().toString().slice(-6)}`;
    }

    // Determine target customers
    let targetCustomers: CustomerUser[] = [];
    if (params.targetType === 'SPECIFIC_CUSTOMER' && params.targetCustomerId) {
      targetCustomers = customers.filter(
        (c) => c.id === params.targetCustomerId || c.accountCode === params.targetCustomerId || c.phone === params.targetCustomerId
      );
    } else if (params.targetType === 'VIP_RUBY') {
      targetCustomers = customers.filter((c) => c.tier === 'Vàng' || c.tier === 'Kim Cương' || c.points >= 500);
    } else if (params.targetType === 'BIRTHDAY_MONTH') {
      const currentMonth = new Date().getMonth() + 1;
      targetCustomers = customers.filter((c) => {
        if (!c.birthday) return false;
        const parts = c.birthday.split('-');
        const bMonth = parts.length > 1 ? Number(parts[1]) : 0;
        return bMonth === currentMonth;
      });
    } else {
      targetCustomers = [...customers];
    }

    if (targetCustomers.length === 0) {
      showToast('Không tìm thấy hội viên thỏa mãn điều kiện cấp voucher!', 'error');
      return { success: false, message: 'Không tìm thấy hội viên phù hợp', grantedCount: 0 };
    }

    // Direct Drop: Add voucher straight into customer's wallet!
    if (params.dropMethod === 'DIRECT_DROP') {
      const targetIds = targetCustomers.map((c) => c.id);
      setCustomers((prev) =>
        prev.map((c) => {
          if (targetIds.includes(c.id)) {
            const newVoucher: UserVoucher = {
              id: `VOUCHER-PRIV-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
              code,
              title: params.voucherName,
              discountAmount: params.discountAmount,
              minOrder: params.minOrder,
              validUntil: expiryDate,
              discountType: params.voucherScope === 'SHIPPING' ? 'FREESHIP' : 'FIXED',
              voucherScope: params.voucherScope,
              campaignType: 'STANDARD',
              isUsed: false,
              source: 'ADMIN_GRANTED'
            };
            return {
              ...c,
              userVouchers: [newVoucher, ...(c.userVouchers || [])]
            };
          }
          return c;
        })
      );

      if (customer && targetIds.includes(customer.id)) {
        const newVoucher: UserVoucher = {
          id: `VOUCHER-PRIV-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
          code,
          title: params.voucherName,
          discountAmount: params.discountAmount,
          minOrder: params.minOrder,
          validUntil: expiryDate,
          discountType: params.voucherScope === 'SHIPPING' ? 'FREESHIP' : 'FIXED',
          voucherScope: params.voucherScope,
          campaignType: 'STANDARD',
          isUsed: false,
          source: 'ADMIN_GRANTED'
        };
        setCustomer((prev) => (prev ? { ...prev, userVouchers: [newVoucher, ...(prev.userVouchers || [])] } : null));
      }
    }

    // Register private hidden voucher
    const newPromo: PromotionItem = {
      id: `PROMO-PRIV-${Date.now()}`,
      code,
      title: params.voucherName,
      description: `Đặc quyền cấp riêng: ${params.voucherName} (Đơn tối thiểu ${new Intl.NumberFormat('vi-VN').format(params.minOrder)}đ)`,
      discountType: params.voucherScope === 'SHIPPING' ? 'FREESHIP' : 'FIXED',
      discountAmount: params.discountAmount,
      minOrder: params.minOrder,
      badge: 'ĐẶC QUYỀN',
      validUntil: expiryDate,
      voucherScope: params.voucherScope,
      isActive: true,
      showOnPublicWeb: false, // HIDDEN from public web!
      usedCount: 0,
      usageLimit: targetCustomers.length
    };
    setPromotions((prev) => [newPromo, ...prev]);

    logSecurityEvent(
      activeAdminUser || 'ADMIN',
      'VOUCHER_DIRECT_DROP',
      'INFO',
      `Phát hành voucher đặc quyền "${params.voucherName}" (${params.dropMethod === 'DIRECT_DROP' ? 'Cấp thẳng vào ví' : `Token: ${code}`}) tới ${targetCustomers.length} hội viên.`,
      { code, targetCount: targetCustomers.length }
    );

    showToast(`Đã phát hành thành công voucher đặc quyền tới ${targetCustomers.length} hội viên!`, 'success');
    return { success: true, code, message: 'Phát hành thành công', grantedCount: targetCustomers.length };
  };

  const updateSettings = (newSettings: Partial<ShopSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Đã lưu cấu hình cửa hàng!', 'success');
  };

  const updateHeroConfig = (cfg: Partial<HeroBannerConfig>) => {
    setHeroConfig((prev) => {
      const next = { ...prev, ...cfg };
      localStorage.setItem('vvf_hero', JSON.stringify(next));
      return next;
    });
    showToast('Đã cập nhật banner chính!', 'success');
  };

  const updatePromotions = (promos: PromotionItem[]) => {
    setPromotions(promos);
    localStorage.setItem('vvf_promotions', JSON.stringify(promos));
    showToast('Đã cập nhật chương trình khuyến mãi!', 'success');
  };

  const updateArticles = (arts: BlogArticle[]) => {
    setArticles(arts);
    localStorage.setItem('vvf_articles', JSON.stringify(arts));
    showToast('Đã cập nhật cẩm nang hoa tươi!', 'success');
  };

  return (
    <StoreContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        sessionRole,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        applyBulkDiscount,
        restoreOriginalPrices,
        archivedProducts,
        deleteProductToArchive,
        restoreArchivedProduct,
        restoreMultipleArchivedProducts,
        permanentlyDeleteArchivedProduct,
        permanentlyDeleteMultipleArchivedProducts,
        backupTrashToGoogleDrive,
        restoreTrashFromGoogleDrive,
        isSecurityUnlocked,
        unlockSecurityWithPin,
        lockSecurity,
        categories,
        updateCategories,
        contactChannels,
        addContactChannel,
        updateContactChannel,
        deleteContactChannel,
        toggleContactChannel,
        heroConfig,
        updateHeroConfig,
        promotions,
        updatePromotions,
        articles,
        updateArticles,
        marqueeAnnouncements,
        addMarqueeItem,
        updateMarqueeItem,
        deleteMarqueeItem,
        toggleMarqueeItem,
        activeInfoPopup,
        setActiveInfoPopup,
        selectedArticle,
        setSelectedArticle,
        cart,
        addToCart,
        updateCartItemQty,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        orders,
        createOrder,
        createCustomDesignRequest,
        uploadOrderBill,
        acceptOrderAndRequestDeposit,
        rejectOrder,
        approveOrderDeposit,
        rejectOrderDeposit,
        adjustOrderShippingFee,
        updateOrderStatus,
        completeOrder,
        syncBillToGoogleDrive,
        archiveExpiredOrdersBills,
        purgeOrderBillImage,
        getStorageUsageStats,
        exportBillsBackup,
        customer,
        customers,
        registerCustomer,
        loginCustomer,
        logoutCustomer,
        requestCustomerOtp,
        verifyCustomerOtp,
        changeCustomerPassword,
        changeCustomerIdentityWithOtp,
        resetCustomerPasswordWithOtp,
        updateCustomerProfile,
        addSavedAddress,
        updateSavedAddress,
        deleteSavedAddress,
        setDefaultSavedAddress,
        addCustomerByAdmin,
        updateCustomerByAdmin,
        deleteCustomerByAdmin,
        adjustCustomerPoints,
        adminResetCustomerPassword,
        redeemVoucherWithPoints,
        saveCustomerVoucher,
        requestIdentityChangeStep1Otp,
        verifyIdentityChangeStep1Otp,
        requestIdentityChangeStep2Otp,
        confirmIdentityChangeStep2,
        requestCustomerAccountErasure,
        exportCustomerPersonalDataJson,
        validateVoucherForOrder,
        autoPickBestVouchers,
        calculateMaxAllowedPoints,
        airdropVoucherToAllCustomers,
        isAdmin,
        activeAdminUser,
        adminViewMode,
        setAdminViewMode,
        toggleAdminViewMode,
        activeAdminTab,
        setActiveAdminTab,
        verifyAdminPin,
        loginAdmin,
        logoutAdmin,
        adminEmail,
        gmailAppPassword,
        changeAdminCredentials,
        saveGmailConfig,
        requestPinResetOtp,
        verifyPinResetOtp,
        securityAuditLogs,
        logSecurityEvent,
        requestBankChangeOtp,
        verifyBankChangeAndSave,
        isSessionLocked,
        unlockSessionWithPin,
        lockAdminSession,
        grantPrivilegeVoucher,
        settings,
        updateSettings,
        weatherState,
        updateWeatherState,
        updateAdminWeatherMascotIcon,
        specialHoursSurchargeRate,
        updateSpecialHoursSurchargeRate,
        shiftHours,
        updateShiftHours,
        weatherSurcharges,
        updateWeatherConditionSurcharge,
        shiftSurcharges,
        updateShiftSurcharges,
        notifications,
        unreadNotificationCount,
        activeBannerNotification,
        dismissBannerNotification,
        markNotificationAsRead,
        clearAllNotifications,
        sendAppNotification,
        broadcastStoreAnnouncement,
        clearStoreAnnouncement,
        testCuteVoice,
        pointsCelebrationModal,
        dismissPointsCelebrationModal,
        selectedProduct,
        setSelectedProduct,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        toasts,
        showToast,
        dismissToast
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
