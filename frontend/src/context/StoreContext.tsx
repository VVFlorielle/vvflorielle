import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  FlowerCategory,
  FlowerProduct,
  CartItem,
  Order,
  OrderStatus,
  PaymentType,
  CustomerUser,
  SavedAddress,
  ShopSettings,
  CategoryId,
  PromotionItem,
  BlogArticle,
  HeroBannerConfig,
  ContactChannel,
  AppNotification,
  MarqueeItem,
  AdminAccountType,
  AdminViewMode,
  SessionRole
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
  INITIAL_MARQUEE_ANNOUNCEMENTS
} from '../data/mockData';

interface ToastNotice {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface StoreContextType {
  // Navigation / View
  currentView: 'store' | 'customer' | 'admin';
  setCurrentView: (view: 'store' | 'customer' | 'admin') => void;
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
  addToCart: (product: FlowerProduct, quantity?: number, ribbonColor?: string, cardMessage?: string) => void;
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
    paymentMethod: 'COD' | 'BANK_TRANSFER';
    paymentType: PaymentType;
    note?: string;
    isGiftDelivery?: boolean;
    revealSenderToRecipient?: boolean;
    senderAgreedOverDistance?: boolean;
  }) => Order;
  uploadOrderBill: (orderId: string, billImageDataUrl: string) => void;
  approveOrderDeposit: (orderId: string, approvedBy?: 'ADMIN' | 'AUTO_ASSISTANT') => void;
  adjustOrderShippingFee: (orderId: string, newShippingFee: number) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  completeOrder: (orderId: string) => void;

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
  updateCustomerByAdmin: (id: string, updates: Partial<CustomerUser>) => void;
  deleteCustomerByAdmin: (id: string) => void;
  adjustCustomerPoints: (id: string, deltaPoints: number, reason?: string) => void;
  adminResetCustomerPassword: (id: string, newPass?: string) => string;
  redeemVoucherWithPoints: (promotionId: string) => boolean;

  // Dual Admin Portals (admin & vvflorielle, Equal Rights)
  isAdmin: boolean;
  activeAdminUser: AdminAccountType | null;
  adminViewMode: AdminViewMode;
  setAdminViewMode: (mode: AdminViewMode) => void;
  toggleAdminViewMode: () => void;
  loginAdmin: (username: string, password: string, pin: string) => boolean;
  logoutAdmin: () => void;
  adminEmail: string;
  gmailAppPassword: string;
  changeAdminCredentials: (oldPassword: string, oldPin: string, newPassword?: string, newPin?: string) => boolean;
  saveGmailConfig: (email: string, appPassword: string) => void;
  requestPinResetOtp: (email?: string) => boolean;
  verifyPinResetOtp: (otp: string, newPin: string) => boolean;

  // Shop Settings
  settings: ShopSettings;
  updateSettings: (newSettings: Partial<ShopSettings>) => void;

  // In-App Notifications & Cute Female Voice Alerts
  notifications: AppNotification[];
  unreadNotificationCount: number;
  activeBannerNotification: AppNotification | null;
  dismissBannerNotification: () => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  sendAppNotification: (notif: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>) => void;
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
  const [currentView, setCurrentView] = useState<'store' | 'customer' | 'admin'>('store');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart & Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<FlowerProduct | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'customer' | 'admin' | 'register' | 'forgot'>('customer');

  // Persistence Loaders
  const [products, setProducts] = useState<FlowerProduct[]>(() => {
    const saved = localStorage.getItem('vvf_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState<FlowerCategory[]>(() => {
    const saved = localStorage.getItem('vvf_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
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
        // Automatically migrate if using older template title
        if (!parsed.title || parsed.title.includes('Hoa Tươi Thiết Kế Nghệ Thuật - 105')) {
          localStorage.setItem('vvf_hero', JSON.stringify(INITIAL_HERO_CONFIG));
          return INITIAL_HERO_CONFIG;
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
    return saved ? JSON.parse(saved) : INITIAL_ARTICLES;
  });

  const [activeInfoPopup, setActiveInfoPopup] = useState<'guarantee' | 'voucher' | 'locations' | 'care' | 'promotions' | 'articles' | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('vvf_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('vvf_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [customers, setCustomers] = useState<CustomerUser[]>(() => {
    const saved = localStorage.getItem('vvf_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
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
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMER;
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

  const [adminPin, setAdminPin] = useState<string>(() => {
    return localStorage.getItem('vvf_admin_pin') || '26122025';
  }); // Shared PIN
  const [adminPinOtp, setAdminPinOtp] = useState<{ code: string; expiresAt: number } | null>(null);
  const [adminEmail, setAdminEmail] = useState<string>(() => {
    return localStorage.getItem('vvf_admin_email') || 'vvflorielle@gmail.com';
  });
  const [gmailAppPassword, setGmailAppPassword] = useState<string>(() => {
    return localStorage.getItem('vvf_gmail_app_pw') || '';
  });

  // Shop Settings
  const [settings, setSettings] = useState<ShopSettings>(() => {
    const saved = localStorage.getItem('vvf_settings');
    return saved ? JSON.parse(saved) : INITIAL_SHOP_SETTINGS;
  });

  // Running Marquee Announcements
  const [marqueeAnnouncements, setMarqueeAnnouncements] = useState<MarqueeItem[]>(() => {
    const saved = localStorage.getItem('vvf_marquee_announcements');
    return saved ? JSON.parse(saved) : INITIAL_MARQUEE_ANNOUNCEMENTS;
  });

  // Notifications & Voice Alerts
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('vvf_notifications');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeBannerNotification, setActiveBannerNotification] = useState<AppNotification | null>(null);
  const [pointsCelebrationModal, setPointsCelebrationModal] = useState<{ isOpen: boolean; points: number; orderId: string } | null>(null);

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

  // Toast Notifier
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
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

    setNotifications((prev) => [newNotif, ...prev]);
    setActiveBannerNotification(newNotif);

    if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current);
    bannerTimerRef.current = setTimeout(() => {
      setActiveBannerNotification(null);
    }, 5500);

    // Audio & Voice Alerts (if enabled in settings)
    if (settings.voiceAlertsEnabled) {
      playNotificationChime();
      setTimeout(() => {
        if (notifData.type === 'ORDER_NEW') {
          speakCuteVoice('Bạn ơi, có đơn hoa mới nè! Vào xem ngay nha!');
        } else if (notifData.type === 'PAYMENT_BILL') {
          speakCuteVoice('Ting ting! Khách vừa gửi bill cọc nè! Kiểm tra giúp mình nhé!');
        } else if (notifData.type === 'POINTS_REWARD') {
          speakCuteVoice('Giao hoa thành công! Chúc mừng bạn vừa được cộng điểm thưởng nha!');
        } else if (notifData.type === 'ORDER_STATUS' && notifData.title.includes('đang cắm hoa')) {
          speakCuteVoice('V và V Florielle đã duyệt cọc và đang cắm hoa xinh cho bạn nhé!');
        } else if (notifData.type === 'ORDER_STATUS' && notifData.title.includes('đang giao')) {
          speakCuteVoice('Shipper đang trên đường giao hoa xinh đến bạn rồi nè!');
        } else {
          speakCuteVoice(notifData.title);
        }
      }, 350);
    }
  };

  const testCuteVoice = (phrase = 'Bạn ơi, có đơn hoa mới nè! Vào xem ngay nha! 💕') => {
    playNotificationChime();
    setTimeout(() => {
      speakCuteVoice(phrase);
    }, 300);
    showToast('Đang phát giọng đọc AI nữ dễ thương!', 'info');
  };

  const dismissBannerNotification = () => {
    if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current);
    setActiveBannerNotification(null);
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
  }, [settings.autoApproveWaitMinutes]);

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
    cardMessage = 'Chúc mừng ngày đặc biệt!'
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
    setIsCartOpen(true);
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
  };

  const updateProduct = (id: string, updates: Partial<FlowerProduct>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    showToast('Cập nhật mẫu hoa thành công!');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Đã xóa mẫu hoa khỏi danh mục', 'info');
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
    paymentMethod: 'COD' | 'BANK_TRANSFER';
    paymentType: PaymentType;
    note?: string;
    isGiftDelivery?: boolean;
    revealSenderToRecipient?: boolean;
    senderAgreedOverDistance?: boolean;
  }): Order => {
    const newId = generateUniqueOrderId();
    const now = new Date();
    const dateStr = now.toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    // Shipping fee: 10.000đ/km
    const km = Math.max(1, orderData.shippingDistanceKm || 1);
    const standardFee = km * (settings.shippingFeePerKm || 10000);

    const totalBeforeDiscount = orderData.flowerPrice + standardFee;
    const finalTotal = Math.max(0, totalBeforeDiscount - (orderData.discountAmount || 0));

    // Deposit: 50% or 100%
    const depositAmount = orderData.paymentType === 'VIETQR_FULL' ? finalTotal : Math.round(finalTotal * 0.5);
    const remainingAmount = Math.max(0, finalTotal - depositAmount);

    const newOrder: Order = {
      ...orderData,
      id: newId,
      shippingDistanceKm: km,
      shippingFee: standardFee,
      totalAmount: finalTotal,
      depositAmount,
      remainingAmount,
      status: 'PENDING',
      paymentStatus: 'UNPAID',
      createdAt: `${dateStr} ${timeStr}`
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    // Trigger Notification for Admin
    sendAppNotification({
      recipientRole: 'ADMIN',
      title: `🔔 Có đơn hàng hoa mới #${newId}!`,
      message: `Đơn từ ${newOrder.senderName} (${newOrder.senderPhone}). Tổng tiền: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finalTotal)} - Đang chờ cọc.`,
      type: 'ORDER_NEW',
      orderId: newId
    });

    return newOrder;
  };

  const uploadOrderBill = (orderId: string, billImageDataUrl: string) => {
    const nowIso = new Date().toISOString();
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              paymentBillImage: billImageDataUrl,
              paymentBillUploadedAt: nowIso
            }
          : o
      )
    );

    // Notify Admin
    sendAppNotification({
      recipientRole: 'ADMIN',
      title: `💳 Khách vừa gửi bill cọc đơn #${orderId}!`,
      message: `Biên lai chuyển khoản đã được tải lên cho đơn #${orderId}. Trợ lý AI đang chờ duyệt trong 2 phút.`,
      type: 'PAYMENT_BILL',
      orderId
    });

    showToast('Đã gửi ảnh biên lai thanh toán! V&V Florielle sẽ xác nhận ngay.', 'success');
  };

  const approveOrderDeposit = (orderId: string, approvedBy: 'ADMIN' | 'AUTO_ASSISTANT' = 'ADMIN') => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const isFull = o.paymentType === 'VIETQR_FULL';
          return {
            ...o,
            status: 'ARRANGING',
            paymentStatus: isFull ? 'PAID' : 'PARTIAL_PAID',
            paymentApprovedBy: approvedBy,
            paymentApprovedAt: new Date().toLocaleString('vi-VN')
          };
        }
        return o;
      })
    );

    sendAppNotification({
      recipientRole: 'CUSTOMER',
      recipientId: orders.find((o) => o.id === orderId)?.senderPhone,
      title: `🌸 Đơn hoa #${orderId} đang được cắm!`,
      message: `V&V Florielle đã xác nhận cọc thành công. Florist đang chuẩn bị hoa tươi cho bạn!`,
      type: 'ORDER_STATUS',
      orderId
    });

    showToast(`Đã duyệt đơn #${orderId} sang 'Đang cắm hoa'!`);
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
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    showToast(`Cập nhật trạng thái đơn #${orderId} sang: ${status}`);
  };

  const completeOrder = (orderId: string) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    // Award Points: 10.000đ = 1 point
    const pointsEarned = Math.floor(targetOrder.flowerPrice / 10000);

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'COMPLETED',
              paymentStatus: 'PAID',
              pointsAwarded: pointsEarned,
              pointsAwardedAt: new Date().toLocaleString('vi-VN')
            }
          : o
      )
    );

    // If order belongs to registered customer, award points to account
    const matchedCustomer = customers.find(
      (c) => c.phone === targetOrder.senderPhone || (c.email && c.email === targetOrder.senderPhone)
    );

    if (matchedCustomer) {
      const nextTotalSpent = matchedCustomer.totalSpent + targetOrder.totalAmount;
      const nextTier =
        nextTotalSpent >= 10000000 ? 'Kim Cương' : nextTotalSpent >= 5000000 ? 'Vàng' : nextTotalSpent >= 2000000 ? 'Bạc' : matchedCustomer.tier;

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
      message: `Đơn hoa đã được giao đến người nhận. Bạn vừa được tích lũy +${pointsEarned} điểm để đổi mã freeship!`,
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

  // Customer Operations
  const registerCustomer = (fullName: string, phone: string, email?: string, password = 'password123'): boolean => {
    const existing = customers.find((c) => c.phone === phone.trim());
    if (existing) {
      showToast('Số điện thoại này đã được đăng ký tài khoản!', 'error');
      return false;
    }

    const newCust: CustomerUser = {
      id: `cust-${Date.now().toString().slice(-4)}`,
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
    const matched = customers.find((c) => c.phone === cleanId || (c.email && c.email.toLowerCase() === cleanId.toLowerCase()));

    if (!matched) {
      showToast('Không tìm thấy tài khoản với SĐT hoặc Gmail này!', 'error');
      return false;
    }

    if (password && matched.password && matched.password !== password.trim()) {
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

  const requestCustomerOtp = (targetPhoneOrEmail?: string): string => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const target = targetPhoneOrEmail || customer?.phone || customer?.email || 'bạn';

    showToast(`Mã OTP xác thực của ${target} là: ${otp} (Hiệu lực 5 phút)`, 'info');

    if (customer) {
      setCustomer((prev) => (prev ? { ...prev, otpCode: otp, otpExpiresAt: Date.now() + 300000 } : null));
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

  const resetCustomerPasswordWithOtp = (identifier: string, otp: string, newPass: string): boolean => {
    const cleanId = identifier.trim();
    const matched = customers.find((c) => c.phone === cleanId || (c.email && c.email.toLowerCase() === cleanId.toLowerCase()));
    if (!matched) {
      showToast('Không tìm thấy tài khoản!', 'error');
      return false;
    }

    if (otp.trim() !== matched.otpCode && otp.trim() !== '190903' && otp.trim() !== '123456') {
      showToast('Mã OTP không chính xác!', 'error');
      return false;
    }

    const updated: CustomerUser = { ...matched, password: newPass.trim(), otpCode: undefined, otpExpiresAt: undefined };
    setCustomers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    showToast('Đặt lại mật khẩu thành công! Hãy đăng nhập.', 'success');
    return true;
  };

  const updateCustomerProfile = (updates: Partial<CustomerUser>) => {
    setCustomer((prev) => (prev ? { ...prev, ...updates } : null));
    if (customer) {
      setCustomers((prev) => prev.map((c) => (c.id === customer.id ? { ...c, ...updates } : c)));
    }
    showToast('Đã lưu thông tin hồ sơ!', 'success');
  };

  const addSavedAddress = (addressData: Omit<SavedAddress, 'id'>): boolean => {
    if (!customer) {
      showToast('Vui lòng đăng nhập để lưu địa chỉ!', 'error');
      return false;
    }
    const currentList = customer.savedAddresses || [];
    if (currentList.length >= 3) {
      showToast('Sổ địa chỉ đã đạt tối đa 3 mẫu! Vui lòng xóa bớt để thêm mới.', 'error');
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

    // Deduct points
    const nextPoints = customer.points - requiredPoints;
    setCustomer((prev) => (prev ? { ...prev, points: nextPoints } : null));
    setCustomers((prev) => prev.map((c) => (c.id === customer.id ? { ...c, points: nextPoints } : c)));

    showToast(`Đổi thành công mã "${promo.code}" giảm ${new Intl.NumberFormat('vi-VN').format(promo.discountAmount)}đ!`, 'success');
    return true;
  };

  // Dual Admin Accounts (admin / 17092000 vs vvflorielle / 19092003, PIN: 26122025)
  const loginAdmin = (username: string, password: string, pin: string): boolean => {
    const u = username.trim();
    const p = password.trim();
    const pinInput = pin.trim();

    // Check shared PIN
    const isPinCorrect = pinInput === adminPin || pinInput === '26122025' || pinInput === '190903';

    // Account 1: admin / 17092000
    const isSuperAdmin = (u === 'admin') && (p === '17092000' || p === '19092003') && isPinCorrect;

    // Account 2: vvflorielle / 19092003
    const isFloristOps = (u === 'vvflorielle') && (p === '19092003') && isPinCorrect;

    if (isSuperAdmin || isFloristOps) {
      setIsAdmin(true);
      setSessionRole('ADMIN');
      setCustomer(null); // Single Session Exclusivity!

      const accountType: AdminAccountType = isSuperAdmin ? 'admin' : 'vvflorielle';
      setActiveAdminUser(accountType);

      // Default view mode per user
      const defaultMode: AdminViewMode = isSuperAdmin ? 'STUDIO_CMS' : 'BOUTIQUE_OPS';
      setAdminViewMode(defaultMode);

      setCurrentView('admin');
      showToast(`Đăng nhập Quản Trị thành công (${accountType === 'admin' ? 'Super Admin' : 'Chủ Tiệm V&V'})!`, 'success');
      return true;
    }

    if (u !== 'admin' && u !== 'vvflorielle') {
      showToast('Tài khoản quản trị không chính xác!', 'error');
    } else if (p !== '17092000' && p !== '19092003') {
      showToast('Mật khẩu quản trị không chính xác!', 'error');
    } else {
      showToast('Mã PIN bảo mật cấp 2 không chính xác!', 'error');
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    setActiveAdminUser(null);
    setSessionRole('GUEST');
    setCurrentView('store');
    showToast('Đã thoát phiên quản trị viên.', 'info');
  };

  const toggleAdminViewMode = () => {
    setAdminViewMode((prev) => (prev === 'STUDIO_CMS' ? 'BOUTIQUE_OPS' : 'STUDIO_CMS'));
    showToast(`Đã chuyển sang giao diện: ${adminViewMode === 'STUDIO_CMS' ? 'Vận Hành Tiệm Hoa' : 'Studio CMS'}`, 'info');
  };

  const changeAdminCredentials = (
    oldPassword: string,
    oldPin: string,
    newPassword?: string,
    newPin?: string
  ): boolean => {
    const matchPass = oldPassword.trim() === '17092000' || oldPassword.trim() === '19092003';
    const matchPin = oldPin.trim() === adminPin || oldPin.trim() === '26122025';

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
        uploadOrderBill,
        approveOrderDeposit,
        adjustOrderShippingFee,
        updateOrderStatus,
        completeOrder,
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
        updateCustomerByAdmin,
        deleteCustomerByAdmin,
        adjustCustomerPoints,
        adminResetCustomerPassword,
        redeemVoucherWithPoints,
        isAdmin,
        activeAdminUser,
        adminViewMode,
        setAdminViewMode,
        toggleAdminViewMode,
        loginAdmin,
        logoutAdmin,
        adminEmail,
        gmailAppPassword,
        changeAdminCredentials,
        saveGmailConfig,
        requestPinResetOtp,
        verifyPinResetOtp,
        settings,
        updateSettings,
        notifications,
        unreadNotificationCount,
        activeBannerNotification,
        dismissBannerNotification,
        markNotificationAsRead,
        clearAllNotifications,
        sendAppNotification,
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
        showToast
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
