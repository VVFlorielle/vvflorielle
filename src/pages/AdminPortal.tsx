import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  ShieldCheck,
  TrendingUp,
  ShoppingBag,
  Flower2,
  Users,
  Settings,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Phone,
  Search,
  Save,
  Lock,
  KeyRound,
  Mail,
  Edit3,
  Award,
  Sparkles,
  X,
  Eye,
  ArrowLeft,
  Calendar,
  MapPin,
  RefreshCw,
  LayoutTemplate,
  Monitor,
  Smartphone,
  Gift,
  Share2,
  ExternalLink,
  Copy,
  DollarSign,
  Volume2,
  Megaphone,
  ChevronRight,
  Truck
} from 'lucide-react';
import { OrderStatus, CategoryId, CustomerUser, Order, FlowerCategory, FlowerProduct, PromotionItem, BlogArticle, HeroBannerConfig, ContactChannel } from '../types';
import { AVAILABLE_MASCOTS, AVAILABLE_FLORAL_CORNERS } from '../data/mockData';
import { ManagementOverviewHero } from '../components/management/ManagementOverviewHero';
import { ManagementTabsBar } from '../components/management/ManagementTabsBar';
import { ManagementFunctionalGrid, ManagementActionGroup } from '../components/management/ManagementFunctionalGrid';
import {
  SecurityModal,
  ShippingConfigModal,
  QuickVoucherModal,
  MascotSelectorModal,
  BillPreviewModal
} from '../components/management/ManagementModals';

export const AdminPortal: React.FC = () => {
  const {
    isAdmin,
    loginAdmin,
    logoutAdmin,
    adminEmail,
    gmailAppPassword,
    changeAdminCredentials,
    saveGmailConfig,
    requestPinResetOtp,
    verifyPinResetOtp,
    orders,
    updateOrderStatus,
    approveOrderDeposit,
    adjustOrderShippingFee,
    completeOrder,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    categories,
    updateCategories,
    heroConfig,
    updateHeroConfig,
    promotions,
    updatePromotions,
    articles,
    updateArticles,
    settings,
    updateSettings,
    customers,
    updateCustomerByAdmin,
    deleteCustomerByAdmin,
    adjustCustomerPoints,
    adminResetCustomerPassword,
    activeAdminUser,
    adminViewMode,
    setAdminViewMode,
    toggleAdminViewMode,
    contactChannels,
    addContactChannel,
    updateContactChannel,
    deleteContactChannel,
    toggleContactChannel,
    marqueeAnnouncements,
    addMarqueeItem,
    updateMarqueeItem,
    deleteMarqueeItem,
    toggleMarqueeItem,
    testCuteVoice,
    showToast
  } = useStore();

  // Admin Login Credentials State (3 layers: username, password, pin)
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginPin, setLoginPin] = useState('');
  const [loginMode, setLoginMode] = useState<'login' | 'forgot'>('login');

  // Forgot PIN OTP state
  const [recoveryEmail, setRecoveryEmail] = useState(adminEmail);
  const [otpCode, setOtpCode] = useState('');
  const [newOtpPin, setNewOtpPin] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  // Active Tab (Default: 'dashboard' - Overview & Large Functional Cards grid phototiinlove style)
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'orders' | 'products' | 'customers' | 'vouchers' | 'channels' | 'settings' | 'security' | 'cms' | 'marquee'
  >('dashboard');

  // Popups & Modals state (phototiinlove style action popups)
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [showQuickVoucherModal, setShowQuickVoucherModal] = useState(false);
  const [showMascotModal, setShowMascotModal] = useState(false);

  // Marquee Announcement Editor States
  const [newMarqueeText, setNewMarqueeText] = useState('');
  const [newMarqueeTag, setNewMarqueeTag] = useState('ƯU ĐÃI');
  const [editingMarqueeId, setEditingMarqueeId] = useState<string | null>(null);
  const [editMarqueeText, setEditMarqueeText] = useState('');
  const [editMarqueeTag, setEditMarqueeTag] = useState('');

  // CMS Webview Editor States
  const [cmsSection, setCmsSection] = useState<'hero' | 'categories' | 'promotions' | 'articles'>('hero');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [editHero, setEditHero] = useState<HeroBannerConfig>(heroConfig);
  const [editCategories, setEditCategories] = useState<FlowerCategory[]>(categories);
  const [editPromotions, setEditPromotions] = useState<PromotionItem[]>(promotions);
  const [editArticles, setEditArticles] = useState<BlogArticle[]>(articles);
  const [selectedEditCatId, setSelectedEditCatId] = useState<CategoryId>('khai-truong');

  // Search & Filters in Orders
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'ALL' | OrderStatus>('ALL');

  // Customer Management States
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerTierFilter, setCustomerTierFilter] = useState<string>('ALL');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerUser | null>(null);
  const [adjustingCustomer, setAdjustingCustomer] = useState<CustomerUser | null>(null);
  const [pointsDelta, setPointsDelta] = useState<number>(50);
  const [pointsReason, setPointsReason] = useState<string>('Tặng điểm thành viên thân thiết');
  const [editingCustomer, setEditingCustomer] = useState<CustomerUser | null>(null);
  const [editNotes, setEditNotes] = useState<string>('');
  const [editFavFlowers, setEditFavFlowers] = useState<string>('');

  // Modals
  const [viewingBillOrder, setViewingBillOrder] = useState<Order | null>(null);
  const [editShippingOrder, setEditShippingOrder] = useState<{ id: string; fee: number } | null>(null);
  const [tempPassModal, setTempPassModal] = useState<{ customerName: string; pass: string } | null>(null);

  // Contact Channels Management State
  const [isAddingChannel, setIsAddingChannel] = useState(false);
  const [newChannelType, setNewChannelType] = useState<ContactChannel['type']>('zalo');
  const [newChannelTitle, setNewChannelTitle] = useState('');
  const [newChannelValue, setNewChannelValue] = useState('');
  const [newChannelUrl, setNewChannelUrl] = useState('');

  // Voucher Management State
  const [isAddVoucherOpen, setIsAddVoucherOpen] = useState(false);
  const [newVoucherCode, setNewVoucherCode] = useState('');
  const [newVoucherTitle, setNewVoucherTitle] = useState('');
  const [newVoucherDesc, setNewVoucherDesc] = useState('');
  const [newVoucherDiscount, setNewVoucherDiscount] = useState(30000);
  const [newVoucherMinOrder, setNewVoucherMinOrder] = useState(300000);
  const [newVoucherBadge, setNewVoucherBadge] = useState('FREESHIP');
  const [newVoucherPoints, setNewVoucherPoints] = useState(300);

  // New Product Modal State
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<CategoryId>('khai-truong');
  const [newProdPrice, setNewProdPrice] = useState(650000);
  const [newProdOriginalPrice, setNewProdOriginalPrice] = useState(750000);
  const [newProdFlowers, setNewProdFlowers] = useState('Hoa hồng đỏ Ecuador, Baby trắng, Lá bạc');
  const [newProdDesc, setNewProdDesc] = useState('Mẫu hoa thiết kế tinh tế, hoa tươi mới cắm trong ngày.');
  const [newProdMeaning, setNewProdMeaning] = useState('Tượng trưng cho thịnh vượng, may mắn và tài lộc.');
  const [newProdImageUrl, setNewProdImageUrl] = useState(
    'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=80'
  );

  // Store Settings edit state
  const [editSettings, setEditSettings] = useState(settings);

  // Security Form States
  const [currentPassForPass, setCurrentPassForPass] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [currentPassForPin, setCurrentPassForPin] = useState('');
  const [currentPinForPin, setCurrentPinForPin] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [editAdminEmail, setEditAdminEmail] = useState(adminEmail);
  const [editAppPassword, setEditAppPassword] = useState(gmailAppPassword);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // KPIs
  const totalRevenue = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const arrangingCount = orders.filter((o) => o.status === 'ARRANGING' || o.status === 'PENDING').length;
  const completedCount = orders.filter((o) => o.status === 'COMPLETED').length;

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    if (orderStatusFilter !== 'ALL' && order.status !== orderStatusFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      const matchId = order.id.toLowerCase().includes(q);
      const matchSender = order.senderName.toLowerCase().includes(q) || order.senderPhone.includes(q);
      const matchRecipient = order.recipientName.toLowerCase().includes(q) || order.recipientPhone.includes(q);
      return matchId || matchSender || matchRecipient;
    }
    return true;
  });

  // Filtered customers
  const filteredCustomers = customers.filter((cust) => {
    if (customerTierFilter !== 'ALL' && cust.tier !== customerTierFilter) return false;
    if (customerSearch.trim()) {
      const q = customerSearch.toLowerCase();
      return (
        cust.fullName.toLowerCase().includes(q) ||
        cust.phone.includes(q) ||
        (cust.email && cust.email.toLowerCase().includes(q)) ||
        (cust.notes && cust.notes.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Submit Admin Login
  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(loginUsername, loginPassword, loginPin);
    if (success) {
      setLoginPassword('');
      setLoginPin('');
    }
  };

  // Submit PIN Recovery Request
  const handleRequestPinRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail.trim()) {
      showToast('Vui lòng nhập địa chỉ Gmail!', 'error');
      return;
    }
    const success = requestPinResetOtp(recoveryEmail.trim());
    if (success) {
      setIsOtpSent(true);
    }
  };

  // Submit PIN Reset with OTP
  const handleVerifyOtpAndResetPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim() || newOtpPin.length !== 6) {
      showToast('Mã OTP và PIN mới gồm 6 chữ số!', 'error');
      return;
    }
    const success = verifyPinResetOtp(otpCode.trim(), newOtpPin.trim());
    if (success) {
      setLoginMode('login');
      setIsOtpSent(false);
      setOtpCode('');
      setNewOtpPin('');
    }
  };

  // Handle Save Shop Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(editSettings);
    showToast('Đã lưu cấu hình cửa hàng!', 'success');
  };

  // Customer Orders Sublist
  const getCustomerOrderHistory = (custPhone: string) => {
    return orders.filter((o) => o.senderPhone === custPhone || o.recipientPhone === custPhone);
  };

  // If NOT ADMIN, render login form
  if (!isAdmin) {
    return (
      <div className="w-full max-w-md mx-auto py-12 px-4 select-none">
        <div className="p-6 sm:p-8 space-y-5 rounded-[28px] shadow-xl border border-emerald-100/90 bg-white/95 backdrop-blur-2xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-700 mx-auto flex items-center justify-center shadow-md shadow-purple-600/10 border border-purple-200">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Cổng Quản Trị V&amp;V Florielle</h2>
            <p className="text-xs text-slate-500 mt-1">
              Khu vực bảo mật dành riêng cho Ban Điều Hành &amp; Chủ Tiệm
            </p>
          </div>

          {loginMode === 'login' ? (
            <form onSubmit={handleAdminLoginSubmit} className="space-y-3.5 text-left text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tài khoản quản trị *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Nhập tên tài khoản quản trị..."
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    className="glass-input w-full text-xs py-2.5 pl-9 rounded-xl"
                  />
                  <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mật khẩu bảo vệ *</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="Nhập mật khẩu..."
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="glass-input w-full text-xs py-2.5 pl-9 rounded-xl"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mã PIN bảo mật 6 số *</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    maxLength={8}
                    placeholder="••••••••"
                    value={loginPin}
                    onChange={(e) => setLoginPin(e.target.value)}
                    className="glass-input w-full text-center text-sm font-mono tracking-widest py-2.5 rounded-xl"
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full btn-primary text-xs py-3 bg-purple-700 hover:bg-purple-800 rounded-xl shadow-md shadow-purple-600/20"
                >
                  Xác Thực &amp; Mở Khóa Quản Trị
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setLoginMode('forgot')}
                  className="text-xs text-purple-700 hover:text-purple-900 font-semibold inline-flex items-center gap-1"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Quên mã PIN? Nhận mã OTP qua Gmail</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 text-left text-xs">
              <button
                type="button"
                onClick={() => setLoginMode('login')}
                className="inline-flex items-center gap-1.5 text-xs text-purple-700 hover:text-purple-900 font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Quay lại đăng nhập</span>
              </button>

              <div className="bg-sky-50/80 p-3.5 rounded-2xl border border-sky-100 text-sky-900 text-xs space-y-1">
                <strong>Khôi phục mã PIN qua Gmail:</strong>
                <p className="text-[11px] text-slate-600">
                  Hệ thống sẽ gửi mã xác thực OTP 6 số đến hòm thư quản trị đã thiết lập.
                </p>
              </div>

              {!isOtpSent ? (
                <form onSubmit={handleRequestPinRecovery} className="space-y-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Gmail quản trị</label>
                    <input
                      type="email"
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      placeholder="vvflorielle@gmail.com"
                      className="glass-input w-full text-xs py-2.5 rounded-xl"
                    />
                  </div>
                  <button type="submit" className="w-full btn-primary text-xs py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700">
                    Gửi Mã OTP Đến Gmail
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtpAndResetPin} className="space-y-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Mã OTP 6 số</label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="••••••"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="glass-input w-full text-center font-mono text-sm py-2 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Mã PIN mới (6 số)</label>
                    <input
                      type="password"
                      maxLength={6}
                      placeholder="••••••"
                      value={newOtpPin}
                      onChange={(e) => setNewOtpPin(e.target.value)}
                      className="glass-input w-full text-center font-mono text-sm py-2 rounded-xl"
                    />
                  </div>
                  <button type="submit" className="w-full btn-primary text-xs py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800">
                    Đặt Lại Mã PIN &amp; Đăng Nhập
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Action Groups for Large Functional Grid (phototiinlove style)
  const adminActionGroups: ManagementActionGroup[] = [
    {
      groupTitle: '1. Vận Hành Đơn Hàng & Mẫu Hoa Tươi',
      groupIcon: <ShoppingBag className="w-4 h-4 text-emerald-700" />,
      badge: 'Nghiệp Vụ Cốt Lõi',
      items: [
        {
          id: 'action-orders',
          title: 'Quản Lý Đơn Hàng & Vận Chuyển Hỏa Tốc',
          description: 'Xem toàn bộ đơn, lọc theo trạng thái, duyệt cọc 50%, điều chỉnh cước km và hoàn tất đơn hoa.',
          icon: <ShoppingBag className="w-5 h-5" />,
          iconBgColor: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
          badge: `${orders.length} Đơn`,
          badgeColor: 'emerald',
          actionType: 'page',
          actionLabel: 'Mở Quản Trị Đơn',
          onClick: () => setActiveTab('orders')
        },
        {
          id: 'action-products',
          title: 'Quản Lý Danh Mục & Mẫu Hoa Tươi',
          description: 'Thêm, sửa, xóa mẫu hoa tươi, cập nhật giá bán, tải ảnh hoa, phân loại danh mục và gán tag Best Seller.',
          icon: <Flower2 className="w-5 h-5" />,
          iconBgColor: 'bg-pink-100 text-pink-700 border border-pink-200',
          badge: `${products.length} Mẫu`,
          badgeColor: 'rose',
          actionType: 'page',
          actionLabel: 'Mở Danh Mục Hoa',
          onClick: () => setActiveTab('products')
        }
      ]
    },
    {
      groupTitle: '2. Khách Hàng & Dịch Vụ Khuyến Mãi',
      groupIcon: <Users className="w-4 h-4 text-purple-700" />,
      badge: 'Chăm Sóc & Ưu Đãi',
      items: [
        {
          id: 'action-customers',
          title: 'Quản Lý Khách Hàng & VIP Membership',
          description: 'Tra cứu danh sách thành viên, số đơn, tổng chi tiêu, điều chỉnh điểm thưởng và cấp lại mật khẩu tạm.',
          icon: <Users className="w-5 h-5" />,
          iconBgColor: 'bg-purple-100 text-purple-700 border border-purple-200',
          badge: `${customers.length} Thành Viên`,
          badgeColor: 'purple',
          actionType: 'page',
          actionLabel: 'Mở Khách Hàng',
          onClick: () => setActiveTab('customers')
        },
        {
          id: 'action-vouchers',
          title: 'Quản Lý Voucher & Mã Khuyến Mãi',
          description: 'Danh mục mã giảm giá, voucher đổi điểm, giới hạn đơn tối thiểu và thời hạn áp dụng voucher.',
          icon: <Gift className="w-5 h-5" />,
          iconBgColor: 'bg-amber-100 text-amber-700 border border-amber-200',
          badge: `${promotions.length} Mã`,
          badgeColor: 'amber',
          actionType: 'page',
          actionLabel: 'Mở Quản Lý Voucher',
          onClick: () => setActiveTab('vouchers')
        },
        {
          id: 'action-quick-voucher',
          title: 'Tạo Nhanh Voucher Dịp Lễ (8/3, 20/10...)',
          description: 'Bật popup tạo tức thì mã ưu đãi ngày lễ, thiết lập mức giảm VNĐ và đơn tối thiểu chỉ trong 30 giây.',
          icon: <Sparkles className="w-5 h-5" />,
          iconBgColor: 'bg-rose-100 text-rose-700 border border-rose-200',
          badge: 'Tạo Nhanh 30s',
          badgeColor: 'rose',
          actionType: 'modal',
          actionLabel: 'Mở Popup Tạo Voucher',
          onClick: () => setShowQuickVoucherModal(true)
        }
      ]
    },
    {
      groupTitle: '3. Cấu Hình Cửa Hàng, Bảng Cước & Kênh CSKH',
      groupIcon: <Settings className="w-4 h-4 text-slate-700" />,
      badge: 'Vận Hành Tiệm',
      items: [
        {
          id: 'action-settings',
          title: 'Cấu Hình Tiệm Hoa, Địa Chỉ & Bản Đồ',
          description: 'Thiết lập tên tiệm, địa chỉ 105 Doãn Kế Thiện, giờ mở cửa 06:30 - 21:30, số hotline chính và bán kính tối đa.',
          icon: <Settings className="w-5 h-5" />,
          iconBgColor: 'bg-slate-100 text-slate-700 border border-slate-200',
          badge: 'Cửa Hàng',
          badgeColor: 'slate',
          actionType: 'page',
          actionLabel: 'Mở Cấu Hình Tiệm',
          onClick: () => setActiveTab('settings')
        },
        {
          id: 'action-shipping-modal',
          title: 'Cấu Hình Bảng Cước 4 Bậc & Freeship',
          description: 'Bật popup chỉnh cước 4 bậc km (0-3km, 3-8km, 8-15km, 15-25km), ngưỡng freeship và cam kết hỏa tốc.',
          icon: <Truck className="w-5 h-5" />,
          iconBgColor: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
          badge: 'Hỏa Tốc 15p - 60p',
          badgeColor: 'emerald',
          actionType: 'modal',
          actionLabel: 'Mở Popup Cước Phí',
          onClick: () => setShowShippingModal(true)
        },
        {
          id: 'action-channels',
          title: 'Kênh Liên Hệ Hotline, Zalo & Messenger',
          description: 'Quản lý các nút gọi điện, chat Zalo, Messenger, chỉ đường Google Maps hiển thị cho khách hàng.',
          icon: <Share2 className="w-5 h-5" />,
          iconBgColor: 'bg-sky-100 text-sky-700 border border-sky-200',
          badge: `${contactChannels.length} Kênh`,
          badgeColor: 'sky',
          actionType: 'page',
          actionLabel: 'Mở Kênh CSKH',
          onClick: () => setActiveTab('channels')
        },
        {
          id: 'action-marquee',
          title: 'Bảng Tin Chạy Chữ Khuyến Mãi Đỉnh Trang',
          description: 'Soạn thảo, bật/tắt các dòng thông báo khuyến mãi, cam kết hoa tươi chạy mượt trên đỉnh website.',
          icon: <Megaphone className="w-5 h-5" />,
          iconBgColor: 'bg-amber-100 text-amber-700 border border-amber-200',
          badge: `${marqueeAnnouncements.length} Tin`,
          badgeColor: 'amber',
          actionType: 'page',
          actionLabel: 'Mở Bảng Tin Chạy',
          onClick: () => setActiveTab('marquee')
        }
      ]
    },
    {
      groupTitle: '4. Giao Diện Webview Live & Mascot Linh Vật',
      groupIcon: <LayoutTemplate className="w-4 h-4 text-purple-700" />,
      badge: 'Thương Hiệu & CMS',
      items: [
        {
          id: 'action-cms-liveview',
          title: 'Liveview Webview CMS Song Song 50/50',
          description: 'Xem trước giao diện khách hàng trên Desktop / Mobile và chỉnh sửa nội dung banner, danh mục theo thời gian thực.',
          icon: <LayoutTemplate className="w-5 h-5" />,
          iconBgColor: 'bg-purple-100 text-purple-700 border border-purple-200',
          badge: 'Live 50/50',
          badgeColor: 'purple',
          actionType: 'page',
          actionLabel: 'Mở CMS Liveview',
          onClick: () => setActiveTab('cms')
        },
        {
          id: 'action-mascot-modal',
          title: 'Chọn & Thay Thế 6 Mascot Linh Vật',
          description: 'Bật popup duyệt và chọn 1 trong 6 linh vật tiệm hoa mới cập nhật để hiển thị đại diện trên trang web.',
          icon: <Sparkles className="w-5 h-5" />,
          iconBgColor: 'bg-pink-100 text-pink-700 border border-pink-200',
          badge: '6 Mascot Mới',
          badgeColor: 'rose',
          actionType: 'modal',
          actionLabel: 'Mở Popup Linh Vật',
          onClick: () => setShowMascotModal(true)
        }
      ]
    },
    {
      groupTitle: '5. Bảo Mật & Quản Trị Hệ Thống',
      groupIcon: <KeyRound className="w-4 h-4 text-purple-700" />,
      badge: 'Bảo Mật Cấp 2',
      items: [
        {
          id: 'action-security-modal',
          title: 'Bảo Mật PIN & Đổi Mật Khẩu Super Admin',
          description: 'Bật popup đổi mật khẩu đăng nhập, thiết lập mã PIN 6 số cấp 2 và liên kết Gmail nhận mã OTP bảo mật.',
          icon: <Lock className="w-5 h-5" />,
          iconBgColor: 'bg-purple-100 text-purple-700 border border-purple-200',
          badge: 'Mã PIN Cấp 2',
          badgeColor: 'purple',
          actionType: 'modal',
          actionLabel: 'Mở Popup Bảo Mật',
          onClick: () => setShowSecurityModal(true)
        }
      ]
    }
  ];

  // Helper to render back button to Dashboard (phototiinlove style BackLink)
  const renderBackHeader = (tabName: string) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-2 border-b border-slate-200/80">
      <button
        type="button"
        onClick={() => setActiveTab('dashboard')}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-semibold border border-slate-200 hover:border-emerald-300 shadow-xs transition-all text-xs w-fit cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 text-emerald-600" />
        <span>Quay lại Dashboard Tổng Quan (Lưới Thẻ To)</span>
      </button>
      <div className="text-xs text-slate-500">
        Phân hệ quản trị: <strong className="text-slate-800">{tabName}</strong>
      </div>
    </div>
  );

  // LOGGED-IN ADMIN CONSOLE
  return (
    <div className="container py-8 space-y-8 px-4">
      {/* 1. TOP GREETING & 4 KPIS HERO (BRIGHT, ELEGANT PASTEL) */}
      <ManagementOverviewHero
        tag="Trung Tâm Quản Trị Hệ Thống • Studio System Admin"
        tagIcon={<ShieldCheck className="w-3.5 h-3.5 text-purple-700" />}
        title="Trung Tâm Quản Trị Hệ Thống V&V Florielle"
        subtitle="Quản lý toàn diện đơn hàng, danh mục hoa tươi, khách hàng, voucher, cấu hình cước hỏa tốc và liveview CMS giao diện."
        statusBadge="Hệ Thống Sẵn Sàng (Live 24/7)"
        stats={[
          {
            id: 'revenue',
            title: 'Tổng Doanh Thu',
            value: formatPrice(totalRevenue),
            subtext: `Theo ${orders.length} đơn hàng`,
            icon: <TrendingUp className="w-4 h-4 text-emerald-700" />,
            color: 'emerald'
          },
          {
            id: 'arranging',
            title: 'Cần Cắm & Duyệt',
            value: arrangingCount,
            subtext: 'Đơn hoa cần xử lý ngay',
            icon: <Clock className="w-4 h-4 text-amber-700" />,
            color: 'amber',
            onClick: () => {
              setActiveTab('orders');
              setOrderStatusFilter('ARRANGING');
            },
            isActive: activeTab === 'orders' && orderStatusFilter === 'ARRANGING'
          },
          {
            id: 'completed',
            title: 'Đã Giao Thành Công',
            value: completedCount,
            subtext: 'Đơn hàng hoàn tất',
            icon: <CheckCircle2 className="w-4 h-4 text-sky-700" />,
            color: 'sky',
            onClick: () => {
              setActiveTab('orders');
              setOrderStatusFilter('COMPLETED');
            },
            isActive: activeTab === 'orders' && orderStatusFilter === 'COMPLETED'
          },
          {
            id: 'customers',
            title: 'Khách Hàng Đã Lưu',
            value: customers.length,
            subtext: 'Thành viên thân thiết',
            icon: <Users className="w-4 h-4 text-purple-700" />,
            color: 'purple',
            onClick: () => setActiveTab('customers'),
            isActive: activeTab === 'customers'
          }
        ]}
      />

      {/* 2. MANAGEMENT TABS DOCK (STYLE ẢNH 1 PHOTOTIINLOVE) */}
      <ManagementTabsBar
        tabs={[
          {
            id: 'dashboard',
            label: 'Tổng Quan & Thẻ To',
            icon: <Sparkles className="w-4 h-4" />
          },
          {
            id: 'orders',
            label: 'Đơn Hàng',
            count: orders.length,
            icon: <ShoppingBag className="w-4 h-4" />
          },
          {
            id: 'products',
            label: 'Danh Mục Mẫu Hoa',
            count: products.length,
            icon: <Flower2 className="w-4 h-4" />
          },
          {
            id: 'customers',
            label: 'Khách Hàng',
            count: customers.length,
            icon: <Users className="w-4 h-4" />
          },
          {
            id: 'vouchers',
            label: 'Voucher',
            count: promotions.length,
            icon: <Gift className="w-4 h-4" />
          },
          {
            id: 'channels',
            label: 'Kênh Liên Hệ',
            count: contactChannels.length,
            icon: <Share2 className="w-4 h-4" />
          },
          {
            id: 'settings',
            label: 'Cấu Hình Shop',
            icon: <Settings className="w-4 h-4" />
          },
          {
            id: 'security',
            label: 'Bảo Mật & PIN',
            icon: <KeyRound className="w-4 h-4" />
          },
          {
            id: 'cms',
            label: 'Giao Diện & Webview Live',
            icon: <LayoutTemplate className="w-4 h-4" />
          },
          {
            id: 'marquee',
            label: 'Bảng Tin Chạy',
            count: marqueeAnnouncements.length,
            icon: <Megaphone className="w-4 h-4" />
          }
        ]}
        activeTab={activeTab}
        onSelectTab={(tabId) => setActiveTab(tabId as any)}
        accentColor="purple"
      />

      {/* =========================================================================
          TAB 0: DASHBOARD OVERVIEW & LARGE FUNCTIONAL CARDS GRID (PHOTOTIINLOVE)
          ========================================================================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Florist Quick Operations Box */}
          <div className="p-5 sm:p-6 rounded-[28px] bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
                  <Flower2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-800">
                    Bảng Vận Hành Tiệm Hoa V&amp;V Florielle
                  </h3>
                  <p className="text-xs text-slate-500">
                    105 Doãn Kế Thiện • Duyệt đơn cọc VietQR 1-chạm, kiểm soát còn hoa tức thì và chăm sóc khách hàng thân thiết.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 transition-colors w-fit cursor-pointer"
              >
                <span>Xem tất cả {orders.length} đơn hàng</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Orders List (Pending Deposit or Arranging) */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Mã Đơn</th>
                    <th className="py-2.5 px-3">Khách Đặt</th>
                    <th className="py-2.5 px-3">Mẫu Hoa</th>
                    <th className="py-2.5 px-3">Cọc 50%</th>
                    <th className="py-2.5 px-3">Trạng Thái</th>
                    <th className="py-2.5 px-3 text-right">Thao Tác Nhanh</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.slice(0, 4).map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-slate-800">
                        #{ord.id}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800">{ord.senderName}</div>
                        <div className="text-[11px] text-slate-500">{ord.senderPhone}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="line-clamp-1 font-medium text-slate-700">
                          {ord.items.map((i) => i.productName).join(', ')}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {ord.deliveryDate} • {ord.deliveryTimeSlot}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-emerald-700">
                          {formatPrice(ord.depositAmount || Math.round(ord.totalAmount * 0.5))}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {ord.paymentStatus === 'PAID' ? 'Đã thu 100%' : ord.paymentStatus === 'PARTIAL_PAID' ? 'Đã cọc 50%' : 'Chưa cọc'}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            ord.status === 'PENDING'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : ord.status === 'ARRANGING'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : ord.status === 'SHIPPING'
                              ? 'bg-sky-50 text-sky-800 border-sky-200'
                              : 'bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          {ord.status === 'PENDING' ? 'Chờ Duyệt Cọc' : ord.status === 'ARRANGING' ? 'Đang Cắm Hoa' : ord.status === 'SHIPPING' ? 'Đang Giao' : ord.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                        {ord.paymentBillImage && (
                          <button
                            type="button"
                            onClick={() => setViewingBillOrder(ord)}
                            className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-[11px] font-semibold cursor-pointer"
                          >
                            Xem Bill
                          </button>
                        )}
                        {ord.status === 'PENDING' && (
                          <button
                            type="button"
                            onClick={() => {
                              approveOrderDeposit(ord.id);
                              showToast(`Đã duyệt cọc đơn #${ord.id}!`);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs cursor-pointer"
                          >
                            Duyệt Cọc
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab('orders');
                            setOrderSearch(ord.id);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold cursor-pointer"
                        >
                          Chi Tiết
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Large Functional Cards Grid phototiinlove style */}
          <ManagementFunctionalGrid
            title="Danh Mục Chức Năng Quản Trị Hệ Thống"
            subtitle="Mô hình thẻ chức năng to như phototiinlove • Nhấp để mở phân hệ quản trị hoặc popup thao tác nhanh"
            groups={adminActionGroups}
          />
        </div>
      )}

      {/* =========================================================================
          TAB 1: ORDERS MANAGEMENT (6-DIGIT RANDOM IDS, 50% DEPOSIT, SHIPPING ADJUST)
          ========================================================================= */}
      {activeTab === 'orders' && (
        <div className="glass-panel p-6 space-y-4 rounded-[28px] animate-in fade-in duration-200">
          {renderBackHeader('Quản Lý Đơn Hàng & Vận Chuyển Hỏa Tốc')}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            {/* Search order */}
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                placeholder="Tìm mã đơn (#849201...), tên hoặc SĐT..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="glass-input w-full text-xs py-2 pl-8 rounded-xl font-mono"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              {(['ALL', 'PENDING', 'ARRANGING', 'SHIPPING', 'COMPLETED', 'CANCELLED'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                    orderStatusFilter === st
                      ? 'bg-purple-700 text-white font-semibold shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st === 'ALL' && 'Tất cả'}
                  {st === 'PENDING' && 'Chờ duyệt'}
                  {st === 'ARRANGING' && 'Đang cắm'}
                  {st === 'SHIPPING' && 'Đang giao'}
                  {st === 'COMPLETED' && 'Hoàn thành'}
                  {st === 'CANCELLED' && 'Đã hủy'}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table Cards */}
          <div className="space-y-3.5">
            {filteredOrders.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                Không tìm thấy đơn hàng nào phù hợp với bộ lọc.
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-2xl bg-white/95 border border-slate-200/80 shadow-sm space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-extrabold text-sm text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded-lg border border-purple-200">
                        #{order.id}
                      </span>
                      <span className="text-[11px] text-slate-400">({order.createdAt})</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          order.paymentStatus === 'PAID'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {order.paymentStatus === 'PAID' ? 'ĐÃ THANH TOÁN ĐỦ' : 'THANH TOÁN MỘT PHẦN / COD'}
                      </span>
                    </div>

                    {/* Status updater dropdown */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Trạng thái:</span>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className="text-xs font-semibold py-1 px-3 rounded-xl border border-purple-200 bg-purple-50 text-purple-900 focus:outline-none"
                      >
                        <option value="PENDING">Chờ tiệm xác nhận</option>
                        <option value="ARRANGING">Đang cắm hoa</option>
                        <option value="SHIPPING">Đang giao hàng</option>
                        <option value="COMPLETED">Đã hoàn thành</option>
                        <option value="CANCELLED">Đã hủy</option>
                      </select>
                    </div>
                  </div>

                  {/* Customer details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 bg-slate-50/70 p-3 rounded-xl">
                    <div>
                      <div className="font-semibold text-slate-800">
                        Người gửi: {order.senderName} ({order.senderPhone})
                      </div>
                      <div className="mt-1">
                        Người nhận: <strong className="text-slate-800">{order.recipientName}</strong> -{' '}
                        {order.recipientPhone}
                      </div>
                      <div className="text-slate-500 text-[11px] mt-0.5 flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>{order.recipientAddress}</span>
                      </div>

                      {order.isGiftDelivery && (
                        <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            order.revealSenderToRecipient
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {order.revealSenderToRecipient
                              ? '🎁 Đặt gửi tặng hộ (Công khai người gửi)'
                              : '🕵️ Tặng bí mật (Ẩn danh người tặng)'}
                          </span>
                        </div>
                      )}

                      {order.senderAgreedOverDistance && (
                        <div className="mt-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                            ⚠️ Giao xa {order.shippingDistanceKm}km - Khách đã ký cam kết tự chịu chất lượng hoa
                          </span>
                        </div>
                      )}
                    </div>

                    <div>
                      <div>
                        Giao ngày: <strong className="text-slate-800">{order.deliveryDate}</strong> (
                        {order.deliveryTimeSlot})
                      </div>
                      {order.cardMessage && (
                        <div className="text-emerald-800 bg-emerald-50/90 p-2 rounded-lg mt-1 border border-emerald-100/80">
                          <strong>Thiệp/Banner:</strong> "{order.cardMessage}"
                        </div>
                      )}
                      {order.note && (
                        <div className="text-[11px] text-amber-700 mt-1">
                          <strong>Lưu ý:</strong> {order.note}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="space-y-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="text-slate-700 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>{item.productName}</span>
                          <span className="text-slate-400 font-mono">x{item.quantity}</span>
                          <span className="text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                            ({item.ribbonColor})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Distance, Shipping Fee & Deposit Status Card */}
                  <div className="bg-slate-50/90 p-3 rounded-2xl border border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <div className="text-slate-500 text-[11px]">Khoảng cách &amp; Phí vận chuyển:</div>
                      <div className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                        <span>{order.shippingDistanceKm || 1} km</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-emerald-700 font-bold">{formatPrice(order.shippingFee || 0)}</span>
                        <button
                          type="button"
                          onClick={() => setEditShippingOrder({ id: order.id, fee: order.shippingFee || 0 })}
                          className="text-[10px] text-purple-700 hover:text-purple-900 underline font-semibold ml-1"
                        >
                          (Sửa phí)
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="text-slate-500 text-[11px]">Tiền cọc &amp; Phương thức:</div>
                      <div className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                        <span>{order.paymentMethod === 'BANK_TRANSFER' ? 'VietQR' : 'Tiền mặt (COD)'}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-rose-700 font-bold">
                          Cọc: {formatPrice(order.depositAmount || Math.round(order.flowerPrice * 0.5))}
                        </span>
                      </div>
                      <div className="mt-1">
                        {order.isDepositPaid ? (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                            ✓ Đã duyệt cọc (
                            {order.depositApprovedBy === 'AUTO_ASSISTANT'
                              ? '🤖 Trợ lý AI tự duyệt'
                              : '👑 Admin duyệt'}
                            )
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                            ⏳ Chờ duyệt cọc 50%
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col justify-center items-start sm:items-end">
                      {order.billImageDataUrl ? (
                        <button
                          type="button"
                          onClick={() => setViewingBillOrder(order)}
                          className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5 text-purple-600" />
                          <span>Xem Ảnh Bill Chuyển Khoản</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Khách chưa tải ảnh bill</span>
                      )}
                    </div>
                  </div>

                  {/* Actions & Total Summary */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      {!order.isDepositPaid && (
                        <button
                          type="button"
                          onClick={() => approveOrderDeposit(order.id, 'ADMIN')}
                          className="btn-primary text-xs py-1.5 px-3.5 bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Duyệt cọc 50% &amp; Bắt đầu cắm hoa</span>
                        </button>
                      )}

                      {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
                        <button
                          type="button"
                          onClick={() => completeOrder(order.id)}
                          className="btn-primary text-xs py-1.5 px-3.5 bg-purple-700 hover:bg-purple-800 rounded-xl shadow-sm flex items-center gap-1.5"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Hoàn thành đơn &amp; Tích lũy điểm</span>
                        </button>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="text-[11px] text-slate-400">
                        Giá hoa: {formatPrice(order.flowerPrice)} + Ship: {formatPrice(order.shippingFee || 0)}
                        {order.discountAmount > 0 && ` - Giảm: ${formatPrice(order.discountAmount)}`}
                      </div>
                      <div className="text-base font-extrabold text-purple-800">
                        Tổng cộng: {formatPrice(order.totalAmount)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: PRODUCTS CATALOG MANAGEMENT
          ========================================================================= */}
      {activeTab === 'products' && (
        <div className="glass-panel p-6 space-y-4 rounded-[28px] animate-in fade-in duration-200">
          {renderBackHeader('Quản Lý Danh Mục & Mẫu Hoa Tươi')}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="font-bold text-base text-slate-800">Kho Mẫu Hoa Tươi &amp; Danh Mục ({products.length})</h3>
              <p className="text-xs text-slate-500">Quản lý các thiết kế hoa thực tế, giá bán và hoa thành phần</p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddProductOpen(true)}
              className="btn-primary text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Mẫu Hoa Mới</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 relative">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                    {product.tag && (
                      <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                        {product.tag}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{product.name}</h4>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-extrabold text-sm text-emerald-700">{formatPrice(product.price)}</span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-xs text-slate-400 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{product.description}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400">Dịp: {product.categoryId}</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Bạn có chắc muốn xóa mẫu hoa "${product.name}"?`)) {
                        deleteProduct(product.id);
                      }
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                    title="Xóa mẫu hoa"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: CUSTOMERS MANAGEMENT CONSOLE
          ========================================================================= */}
      {activeTab === 'customers' && (
        <div className="glass-panel p-6 space-y-5 rounded-[28px] animate-in fade-in duration-200">
          {renderBackHeader('Quản Lý Khách Hàng & Hạng Thành Viên VIP')}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-800">
                Quản Lý Khách Hàng Thân Thiết ({customers.length})
              </h3>
              <p className="text-xs text-slate-500">
                Tra cứu hồ sơ khách hàng, phân hạng VIP, lịch sử chi tiêu và cấp lại mật khẩu tạm thời
              </p>
            </div>

            {/* Tier Filters */}
            <div className="flex items-center gap-1.5 flex-wrap text-xs">
              {['ALL', 'Thành viên mới', 'Bạc', 'Vàng', 'Kim Cương'].map((tier) => (
                <button
                  key={tier}
                  onClick={() => setCustomerTierFilter(tier)}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                    customerTierFilter === tier
                      ? 'bg-purple-700 text-white font-semibold shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tier === 'ALL' ? 'Tất cả hạng' : tier}
                </button>
              ))}
            </div>
          </div>

          {/* Search box */}
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Tìm theo tên, số điện thoại, ghi chú hoặc email..."
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
              className="glass-input w-full text-xs py-2.5 pl-9 rounded-xl"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>

          {/* Customers List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCustomers.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs col-span-2">
                Không tìm thấy khách hàng nào phù hợp với điều kiện tìm kiếm.
              </div>
            ) : (
              filteredCustomers.map((cust) => {
                const history = getCustomerOrderHistory(cust.phone);
                return (
                  <div
                    key={cust.id}
                    className="p-4 rounded-2xl bg-white/90 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-3.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white font-bold text-base flex items-center justify-center shadow-md shadow-purple-600/20">
                          {cust.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-sm text-slate-900">{cust.fullName}</h4>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                cust.tier === 'Kim Cương'
                                  ? 'bg-purple-100 text-purple-800'
                                  : cust.tier === 'Vàng'
                                  ? 'bg-amber-100 text-amber-800'
                                  : cust.tier === 'Bạc'
                                  ? 'bg-slate-100 text-slate-700'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {cust.tier}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                cust.isVerified
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}
                            >
                              {cust.isVerified ? 'Hội viên xác thực (100% điểm)' : 'Thành viên thường (70% điểm)'}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                            <span>{cust.phone}</span>
                            {cust.email && <span>• {cust.email}</span>}
                          </div>
                          {cust.address && (
                            <div className="text-[11px] text-slate-400 mt-0.5 truncate max-w-xs">{cust.address}</div>
                          )}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-sm font-extrabold text-emerald-700">
                          {cust.points} <span className="text-[10px] font-semibold">điểm</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {cust.ordersCount} đơn • {formatPrice(cust.totalSpent)}
                        </div>
                      </div>
                    </div>

                    {/* Florist Notes & Preferences */}
                    {(cust.notes || cust.favoriteFlowers) && (
                      <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 text-[11px] text-slate-600 space-y-0.5">
                        {cust.favoriteFlowers && (
                          <div>
                            <strong className="text-slate-700">Hoa yêu thích:</strong>{' '}
                            {Array.isArray(cust.favoriteFlowers)
                              ? cust.favoriteFlowers.join(', ')
                              : cust.favoriteFlowers}
                          </div>
                        )}
                        {cust.notes && (
                          <div className="text-slate-500 italic">
                            <strong className="text-slate-700 not-italic">Ghi chú florist:</strong> {cust.notes}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-slate-400">Đăng ký: {cust.registeredAt || 'Gần đây'}</span>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => setSelectedCustomer(cust)}
                          className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 font-semibold text-[11px] flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Chi tiết ({history.length} đơn)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setAdjustingCustomer(cust);
                            setPointsDelta(50);
                            setPointsReason('Cộng điểm thành viên');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-[11px] flex items-center gap-1"
                        >
                          <Award className="w-3 h-3" />
                          <span>+/- Điểm</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const tempPass = adminResetCustomerPassword(cust.id);
                            setTempPassModal({ customerName: cust.fullName, pass: tempPass });
                          }}
                          className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 font-semibold text-[11px] flex items-center gap-1 border border-amber-200"
                          title="Cấp lại mật khẩu tạm thời cho khách hàng"
                        >
                          <KeyRound className="w-3 h-3" />
                          <span>Cấp MK tạm</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingCustomer(cust);
                            setEditNotes(cust.notes || '');
                            setEditFavFlowers(
                              Array.isArray(cust.favoriteFlowers)
                                ? cust.favoriteFlowers.join(', ')
                                : cust.favoriteFlowers || ''
                            );
                          }}
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                          title="Sửa ghi chú"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Bạn có chắc chắn muốn xóa khách hàng "${cust.fullName}"?`)) {
                              deleteCustomerByAdmin(cust.id);
                            }
                          }}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Xóa khách hàng"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB: VOUCHERS & PROMOTIONS MANAGEMENT
          ========================================================================= */}
      {activeTab === 'vouchers' && (
        <div className="glass-panel p-6 space-y-5 rounded-[28px] animate-in fade-in duration-200">
          {renderBackHeader('Quản Lý Voucher & Mã Ưu Đãi')}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
                <Gift className="w-5 h-5 text-rose-600" />
                <span>Quản Lý Voucher &amp; Mã Khuyến Mại ({promotions.length})</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Cấu hình mã FREESHIP30K cho hội viên mới, voucher đổi bằng điểm tích lũy và voucher quà tặng sinh nhật.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddVoucherOpen(true)}
              className="btn-primary text-xs py-2 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo Voucher Mới</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {promotions.map((promo) => (
              <div
                key={promo.id}
                className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-bold text-sm text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-lg border border-emerald-300">
                      {promo.code}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        promo.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {promo.isActive ? 'Đang áp dụng' : 'Tạm dừng'}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-slate-900 mt-2">{promo.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{promo.description}</p>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                    <div>
                      Giảm tối đa: <strong className="text-rose-700">{formatPrice(promo.discountAmount)}</strong>
                    </div>
                    <div>
                      Đơn tối thiểu: <strong className="text-slate-800">{formatPrice(promo.minOrder)}</strong>
                    </div>
                    {promo.pointsToRedeem && (
                      <div className="text-emerald-700 font-semibold">
                        Cần: <strong>{promo.pointsToRedeem} điểm</strong> để đổi
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      const updated = promotions.map((p) => (p.id === promo.id ? { ...p, isActive: !p.isActive } : p));
                      updatePromotions(updated);
                    }}
                    className="text-purple-700 hover:text-purple-900 text-xs font-semibold"
                  >
                    {promo.isActive ? 'Tạm dừng mã' : 'Kích hoạt lại'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Bạn có chắc muốn xóa mã voucher "${promo.code}"?`)) {
                        const updated = promotions.filter((p) => p.id !== promo.id);
                        updatePromotions(updated);
                      }
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                    title="Xóa voucher"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB: CONTACT CHANNELS (Zalo, Hotline, TikTok, Facebook, Messenger, Maps)
          ========================================================================= */}
      {activeTab === 'channels' && (
        <div className="glass-panel p-6 space-y-5 rounded-[28px] animate-in fade-in duration-200">
          {renderBackHeader('Quản Lý Kênh Liên Hệ Hotline, Zalo & Messenger')}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-purple-700" />
                <span>Quản Lý Kênh Liên Hệ Đa Nền Tảng (Floating Contact Widget)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Các nút liên hệ nổi góc phải màn hình giúp khách hàng gọi hotline, chat Zalo, xem TikTok hoặc chỉ đường
                đến 105 Doãn Kế Thiện.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddingChannel(true)}
              className="btn-primary text-xs py-2 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Kênh Liên Hệ Mới</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {contactChannels.map((channel) => (
              <div
                key={channel.id}
                className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{channel.title || channel.label}</span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                        {channel.type}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 mt-1 font-mono">{channel.value}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 truncate max-w-xs">{channel.url || channel.link}</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleContactChannel(channel.id)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                      channel.isEnabled
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-slate-100 text-slate-500 border-slate-300'
                    }`}
                  >
                    {channel.isEnabled ? 'Đang bật' : 'Đã tắt'}
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <a
                    href={channel.url || channel.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-purple-700 hover:text-purple-900 text-[11px] font-semibold flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Mở thử liên kết</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Bạn có chắc muốn xóa kênh liên hệ "${channel.title || channel.label}"?`)) {
                        deleteContactChannel(channel.id);
                      }
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                    title="Xóa kênh"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: STORE SETTINGS
          ========================================================================= */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="glass-panel p-6 space-y-6 rounded-[28px] animate-in fade-in duration-200">
          {renderBackHeader('Cấu Hình Cửa Hàng, Bảng Cước & Bản Đồ')}
          <div className="border-b border-slate-200 pb-3">
            <h3 className="font-bold text-base text-slate-800">Cấu Hình Cửa Hàng V&amp;V Florielle</h3>
            <p className="text-xs text-slate-500">
              Thông tin liên hệ tại 105 Doãn Kế Thiện, tài khoản ngân hàng và chính sách giao hoa
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Tên thương hiệu</label>
                <input
                  type="text"
                  value={editSettings.name}
                  onChange={(e) => setEditSettings({ ...editSettings, name: e.target.value })}
                  className="glass-input w-full text-xs py-2 rounded-xl"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Khẩu hiệu / Slogan</label>
                <input
                  type="text"
                  value={editSettings.slogan}
                  onChange={(e) => setEditSettings({ ...editSettings, slogan: e.target.value })}
                  className="glass-input w-full text-xs py-2 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Hotline tư vấn</label>
                <input
                  type="text"
                  value={editSettings.hotline}
                  onChange={(e) => setEditSettings({ ...editSettings, hotline: e.target.value })}
                  className="glass-input w-full text-xs py-2 rounded-xl"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Số Zalo đặt hoa</label>
                <input
                  type="text"
                  value={editSettings.zalo}
                  onChange={(e) => setEditSettings({ ...editSettings, zalo: e.target.value })}
                  className="glass-input w-full text-xs py-2 rounded-xl"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Email cửa hàng</label>
                <input
                  type="email"
                  value={editSettings.email}
                  onChange={(e) => setEditSettings({ ...editSettings, email: e.target.value })}
                  className="glass-input w-full text-xs py-2 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Địa chỉ Showroom (Trụ sở chính)</label>
              <input
                type="text"
                value={editSettings.address}
                onChange={(e) => setEditSettings({ ...editSettings, address: e.target.value })}
                className="glass-input w-full text-xs py-2 rounded-xl font-medium"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
              <h4 className="font-bold text-xs text-slate-800">Tài Khoản Nhận Chuyển Khoản VietQR</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Ngân hàng</label>
                  <input
                    type="text"
                    value={editSettings.bankName}
                    onChange={(e) => setEditSettings({ ...editSettings, bankName: e.target.value })}
                    className="glass-input w-full text-xs py-2 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Số tài khoản</label>
                  <input
                    type="text"
                    value={editSettings.bankAccount}
                    onChange={(e) => setEditSettings({ ...editSettings, bankAccount: e.target.value })}
                    className="glass-input w-full text-xs py-2 font-mono rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Tên chủ tài khoản</label>
                  <input
                    type="text"
                    value={editSettings.bankHolder}
                    onChange={(e) => setEditSettings({ ...editSettings, bankHolder: e.target.value })}
                    className="glass-input w-full text-xs py-2 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Advanced Store Settings: Domain, Distance Shipping & Assistant */}
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
              <h4 className="font-bold text-xs text-slate-800">Cấu Hình Tên Miền Riêng, Vận Chuyển &amp; Trợ Lý AI</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Tên miền thương hiệu</label>
                  <input
                    type="text"
                    value={editSettings.customDomain || ''}
                    onChange={(e) => setEditSettings({ ...editSettings, customDomain: e.target.value })}
                    placeholder="https://vvflorielle.vn"
                    className="glass-input w-full text-xs py-2 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Thời gian giao hoa cam kết</label>
                  <input
                    type="text"
                    value={editSettings.deliveryTimeEstimate || 'Từ 15 phút nội thành, 60 phút ngoại thành'}
                    onChange={(e) => setEditSettings({ ...editSettings, deliveryTimeEstimate: e.target.value })}
                    placeholder="Từ 15 phút nội thành, 60 phút ngoại thành"
                    className="glass-input w-full text-xs py-2 rounded-xl"
                  />
                  <span className="text-[10px] text-slate-400">Đồng bộ lên tiêu đề, popups và trợ lý ảo</span>
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Phí vận chuyển theo km (đ/km)</label>
                  <input
                    type="number"
                    step={1000}
                    value={editSettings.shippingFeePerKm}
                    onChange={(e) => setEditSettings({ ...editSettings, shippingFeePerKm: Number(e.target.value) })}
                    className="glass-input w-full text-xs py-2 rounded-xl font-mono"
                  />
                  <span className="text-[10px] text-slate-400">Mặc định 10.000đ/km (tính ngoài 12km)</span>
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Ngưỡng đơn Freeship (đ)</label>
                  <input
                    type="number"
                    step={50000}
                    value={editSettings.freeShipThreshold || 400000}
                    onChange={(e) => setEditSettings({ ...editSettings, freeShipThreshold: Number(e.target.value) })}
                    className="glass-input w-full text-xs py-2 rounded-xl font-mono"
                  />
                  <span className="text-[10px] text-slate-400">Đơn từ mức này được Freeship trong bán kính</span>
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Bán kính áp dụng Freeship (km)</label>
                  <input
                    type="number"
                    min={1}
                    max={15}
                    value={editSettings.freeShipRadiusKm || 3}
                    onChange={(e) => setEditSettings({ ...editSettings, freeShipRadiusKm: Number(e.target.value) })}
                    className="glass-input w-full text-xs py-2 rounded-xl font-mono"
                  />
                  <span className="text-[10px] text-slate-400">Mặc định bán kính &le; 3km quanh 105 Doãn Kế Thiện</span>
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Thời gian AI tự duyệt bill (phút)</label>
                  <input
                    type="number"
                    min={1}
                    max={15}
                    value={editSettings.autoApproveWaitMinutes}
                    onChange={(e) => setEditSettings({ ...editSettings, autoApproveWaitMinutes: Number(e.target.value) })}
                    className="glass-input w-full text-xs py-2 rounded-xl font-mono"
                  />
                  <span className="text-[10px] text-slate-400">Nếu admin bận cắm hoa sau 2 phút, trợ lý tự duyệt</span>
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Bán kính cảnh báo hoa giảm tươi (km)</label>
                  <input
                    type="number"
                    min={5}
                    max={100}
                    value={editSettings.warnDeliveryRadiusKm || 20}
                    onChange={(e) => setEditSettings({ ...editSettings, warnDeliveryRadiusKm: Number(e.target.value) })}
                    className="glass-input w-full text-xs py-2 rounded-xl font-mono"
                  />
                  <span className="text-[10px] text-slate-400">Vượt số km này khách phải tích cam kết chịu trách nhiệm</span>
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Bán kính giao hoa tối đa (km)</label>
                  <input
                    type="number"
                    min={10}
                    max={200}
                    value={editSettings.maxDeliveryRadiusKm || 50}
                    onChange={(e) => setEditSettings({ ...editSettings, maxDeliveryRadiusKm: Number(e.target.value) })}
                    className="glass-input w-full text-xs py-2 rounded-xl font-mono"
                  />
                  <span className="text-[10px] text-slate-400">Vượt quá sẽ chặn đặt online &amp; chuyển sang gọi Hotline</span>
                </div>
              </div>

              {/* BỘ CHỌN 6 LINH VẬT HOẠT HỌA FLORI (MASCOT SELECTOR) */}
              <div className="pt-3 border-t border-slate-200/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Chọn Linh Vật Trợ Lý Ảo Flori (Bộ 6 Mẫu Tách Nền)</span>
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Bấm vào bất kỳ linh vật nào bên dưới để đặt làm linh vật hiển thị chính thức của tiệm hoa.
                    </p>
                  </div>
                  {editSettings.mascotImageUrl && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-800">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Đang chọn 1 mẫu</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                  {AVAILABLE_MASCOTS.map((m) => {
                    const isSelected = editSettings.mascotImageUrl === m.url;
                    return (
                      <div
                        key={m.id}
                        onClick={() => setEditSettings({ ...editSettings, mascotImageUrl: m.url })}
                        className={`p-2.5 rounded-2xl border transition-all cursor-pointer text-center relative flex flex-col items-center justify-between ${
                          isSelected
                            ? 'bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-500/30 shadow-md'
                            : 'bg-white/80 hover:bg-white border-slate-200 hover:border-emerald-300 hover:shadow-sm'
                        }`}
                      >
                        {isSelected && (
                          <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] flex items-center justify-center font-bold">
                            ✓
                          </span>
                        )}
                        <div className="w-16 h-16 flex items-center justify-center overflow-hidden mb-1">
                          <img
                            src={m.url}
                            alt={m.name}
                            className="w-full h-full object-contain filter drop-shadow-sm transition-transform hover:scale-110"
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-800 line-clamp-1">{m.name}</span>
                        <span className={`text-[9px] mt-1 px-2 py-0.5 rounded-full font-bold ${
                          isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {isSelected ? 'Đang dùng' : 'Chọn mẫu'}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-2 items-center pt-1">
                  <input
                    type="text"
                    placeholder="Hoặc dán URL ảnh linh vật tùy chỉnh khác..."
                    value={editSettings.mascotImageUrl || ''}
                    onChange={(e) => setEditSettings({ ...editSettings, mascotImageUrl: e.target.value })}
                    className="glass-input flex-1 text-xs py-2 rounded-xl font-mono"
                  />
                  {editSettings.mascotImageUrl && (
                    <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                      <img src={editSettings.mascotImageUrl} alt="Preview" className="w-7 h-7 object-contain" />
                    </div>
                  )}
                </div>
              </div>

              {/* KHU VỰC QUẢN LÝ 4 TỆP ẢNH HOA GÓC TRANG TRÍ (FLORAL CORNER ORNAMENTS) */}
              <div className="pt-3 border-t border-slate-200/60 space-y-2">
                <div>
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Flower2 className="w-3.5 h-3.5 text-rose-500" />
                    <span>Bộ 4 Tệp Ảnh Hoa Góc Trang Trí (E:\VVFlorielle\public\images\floral\)</span>
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Cụm hoa nghệ thuật chụp thực tế đã được tách nền trong suốt 100%, trang trí nhẹ nhàng quanh Hero Banner.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {AVAILABLE_FLORAL_CORNERS.map((fc) => (
                    <div
                      key={fc.id}
                      className="p-3 rounded-2xl bg-white/80 border border-slate-200 flex items-center gap-3 shadow-2xs"
                    >
                      <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                        <img src={fc.webpUrl} alt={fc.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-xs text-slate-900 truncate">{fc.name}</h5>
                        <p className="text-[10px] text-slate-500 font-mono truncate mt-0.5">{fc.webpUrl}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            Đã tách nền sạch 100%
                          </span>
                          <span className="text-[9px] text-slate-400">WebP + PNG</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="voiceAlertsToggle"
                  checked={editSettings.voiceAlertsEnabled}
                  onChange={(e) => setEditSettings({ ...editSettings, voiceAlertsEnabled: e.target.checked })}
                  className="rounded text-purple-700 focus:ring-purple-500"
                />
                <label htmlFor="voiceAlertsToggle" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Bật âm thanh &amp; Giọng đọc AI nữ thông báo "Có đơn", "Đã duyệt cọc", "Cộng điểm"
                </label>
              </div>
            </div>

            <div className="pt-3">
              <button type="submit" className="btn-primary text-xs py-2.5 px-6 rounded-xl flex items-center gap-2">
                <Save className="w-4 h-4" />
                <span>Lưu Thay Đổi Cấu Hình</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* =========================================================================
          TAB 5: SECURITY & CREDENTIALS MANAGEMENT
          ========================================================================= */}
      {activeTab === 'security' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {renderBackHeader('Bảo Mật PIN Cấp 2 & Đổi Mật Khẩu Admin')}
          {/* Card 1: Change Admin Password */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (newPasswordInput !== confirmPasswordInput) {
                showToast('Mật khẩu xác nhận không khớp!', 'error');
                return;
              }
              const success = changeAdminCredentials(currentPassForPass, undefined, newPasswordInput);
              if (success) {
                setCurrentPassForPass('');
                setNewPasswordInput('');
                setConfirmPasswordInput('');
              }
            }}
            className="glass-panel p-6 space-y-4 rounded-[28px]"
          >
            <div className="border-b border-slate-200 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-purple-700" />
                <span>Đổi Mật Khẩu Đăng Nhập Quản Trị</span>
              </h3>
              <p className="text-xs text-slate-500">Mật khẩu áp dụng cho tài khoản admin hiện tại</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Mật khẩu hiện tại</label>
                <input
                  type="password"
                  required
                  value={currentPassForPass}
                  onChange={(e) => setCurrentPassForPass(e.target.value)}
                  className="glass-input w-full text-xs py-2 rounded-xl"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Mật khẩu mới</label>
                <input
                  type="password"
                  required
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  className="glass-input w-full text-xs py-2 rounded-xl"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  required
                  value={confirmPasswordInput}
                  onChange={(e) => setConfirmPasswordInput(e.target.value)}
                  className="glass-input w-full text-xs py-2 rounded-xl"
                />
              </div>
            </div>

            <div>
              <button type="submit" className="btn-primary text-xs py-2 px-5 rounded-xl">
                Cập Nhật Mật Khẩu
              </button>
            </div>
          </form>

          {/* Card 2: Change PIN */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (newPinInput.length !== 8 && newPinInput.length !== 6) {
                showToast('Mã PIN gồm 6 hoặc 8 chữ số!', 'error');
                return;
              }
              if (newPinInput !== confirmPinInput) {
                showToast('Mã PIN xác nhận không khớp!', 'error');
                return;
              }
              const success = changeAdminCredentials(currentPassForPin, currentPinForPin, undefined, newPinInput);
              if (success) {
                setCurrentPassForPin('');
                setCurrentPinForPin('');
                setNewPinInput('');
                setConfirmPinInput('');
              }
            }}
            className="glass-panel p-6 space-y-4 rounded-[28px]"
          >
            <div className="border-b border-slate-200 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-purple-700" />
                <span>Đổi Mã PIN Bảo Mật Cấp 2</span>
              </h3>
              <p className="text-xs text-slate-500">Mã PIN 6 số bảo mật cấp 2 dùng chung cho hệ thống</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Mật khẩu quản trị</label>
                <input
                  type="password"
                  required
                  value={currentPassForPin}
                  onChange={(e) => setCurrentPassForPin(e.target.value)}
                  className="glass-input w-full text-xs py-2 rounded-xl"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Mã PIN hiện tại</label>
                <input
                  type="password"
                  required
                  value={currentPinForPin}
                  onChange={(e) => setCurrentPinForPin(e.target.value)}
                  className="glass-input w-full text-xs py-2 font-mono rounded-xl"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Mã PIN mới</label>
                <input
                  type="password"
                  required
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value)}
                  className="glass-input w-full text-xs py-2 font-mono rounded-xl"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Xác nhận PIN mới</label>
                <input
                  type="password"
                  required
                  value={confirmPinInput}
                  onChange={(e) => setConfirmPinInput(e.target.value)}
                  className="glass-input w-full text-xs py-2 font-mono rounded-xl"
                />
              </div>
            </div>

            <div>
              <button type="submit" className="btn-primary text-xs py-2 px-5 rounded-xl">
                Cập Nhật Mã PIN
              </button>
            </div>
          </form>

          {/* Card 3: Gmail App Password for OTP */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveGmailConfig(editAdminEmail.trim(), editAppPassword.trim());
            }}
            className="glass-panel p-6 space-y-4 rounded-[28px]"
          >
            <div className="border-b border-slate-200 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-700" />
                <span>Cấu Hình Gmail App Password Gửi OTP Khôi Phục</span>
              </h3>
              <p className="text-xs text-slate-500">Dùng để gửi mã OTP khi quên mật khẩu hoặc quên mã PIN</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Gmail gửi thư</label>
                <input
                  type="email"
                  value={editAdminEmail}
                  onChange={(e) => setEditAdminEmail(e.target.value)}
                  className="glass-input w-full text-xs py-2 rounded-xl"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Mật khẩu ứng dụng (16 ký tự)</label>
                <input
                  type="password"
                  value={editAppPassword}
                  onChange={(e) => setEditAppPassword(e.target.value)}
                  className="glass-input w-full text-xs py-2 font-mono rounded-xl"
                  placeholder="xxxx xxxx xxxx xxxx"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button type="submit" className="btn-primary text-xs py-2 px-5 rounded-xl">
                Lưu Cấu Hình Gmail
              </button>
              <button
                type="button"
                onClick={() => {
                  requestPinResetOtp(editAdminEmail);
                }}
                className="btn-secondary text-xs py-2 px-4 rounded-xl"
              >
                Gửi Thử Nghiệm OTP
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =========================================================================
          TAB 6: CMS LIVE WEBVIEW EDITOR (V&V FLORIELLE STUDIO ARCHITECTURE)
          ========================================================================= */}
      {activeTab === 'cms' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {renderBackHeader('Liveview Webview CMS Song Song 50/50')}
          <div className="glass-panel p-5 rounded-[28px] flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-purple-200/80 bg-white/80">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <LayoutTemplate className="w-5 h-5 text-purple-700" />
                <span>Trình Chỉnh Sửa Giao Diện &amp; Live Webview (CMS)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Chỉnh sửa banner, ảnh danh mục, mã khuyến mại và xem trực tiếp trên màn hình mô phỏng thời gian thực.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  updateHeroConfig(editHero);
                  updateCategories(editCategories);
                  updatePromotions(editPromotions);
                  updateArticles(editArticles);
                  showToast('Đã lưu và áp dụng toàn bộ giao diện CMS!', 'success');
                }}
                className="btn-primary text-xs py-2 px-5 bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Lưu &amp; Áp Dụng Toàn Web</span>
              </button>
            </div>
          </div>

          {/* Split Screen Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT PANE: CMS CONTROLS (5 Cols) */}
            <div className="lg:col-span-5 glass-panel p-5 rounded-[28px] space-y-5 bg-white/85">
              <div className="flex border-b border-slate-200 pb-2 gap-1 overflow-x-auto text-xs">
                <button
                  type="button"
                  onClick={() => setCmsSection('hero')}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                    cmsSection === 'hero' ? 'bg-purple-700 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Banner Chính
                </button>
                <button
                  type="button"
                  onClick={() => setCmsSection('categories')}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                    cmsSection === 'categories'
                      ? 'bg-purple-700 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Ảnh Danh Mục (6 Dịp)
                </button>
                <button
                  type="button"
                  onClick={() => setCmsSection('promotions')}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                    cmsSection === 'promotions'
                      ? 'bg-purple-700 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Voucher
                </button>
                <button
                  type="button"
                  onClick={() => setCmsSection('articles')}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                    cmsSection === 'articles'
                      ? 'bg-purple-700 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Cẩm Nang
                </button>
              </div>

              {/* 1. HERO BANNER CONTROLS */}
              {cmsSection === 'hero' && (
                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Huy hiệu nhỏ (Badge)</label>
                    <input
                      type="text"
                      value={editHero.badge}
                      onChange={(e) => setEditHero({ ...editHero, badge: e.target.value })}
                      className="glass-input w-full text-xs py-2 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Tiêu đề lớn (Title)</label>
                    <input
                      type="text"
                      value={editHero.title}
                      onChange={(e) => setEditHero({ ...editHero, title: e.target.value })}
                      className="glass-input w-full text-xs py-2 rounded-xl font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Mô tả phụ (Subtitle)</label>
                    <textarea
                      rows={3}
                      value={editHero.subtitle}
                      onChange={(e) => setEditHero({ ...editHero, subtitle: e.target.value })}
                      className="glass-input w-full text-xs py-2 rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Nút chính (CTA)</label>
                      <input
                        type="text"
                        value={editHero.ctaText}
                        onChange={(e) => setEditHero({ ...editHero, ctaText: e.target.value })}
                        className="glass-input w-full text-xs py-2 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Nút phụ (Hotline)</label>
                      <input
                        type="text"
                        value={editHero.ctaSecondaryText}
                        onChange={(e) => setEditHero({ ...editHero, ctaSecondaryText: e.target.value })}
                        className="glass-input w-full text-xs py-2 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 2. CATEGORIES CONTROLS */}
              {cmsSection === 'categories' && (
                <div className="space-y-4 text-xs">
                  <div className="flex gap-1.5 flex-wrap">
                    {editCategories
                      .filter((c) => c.id !== 'all')
                      .map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setSelectedEditCatId(cat.id)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                            selectedEditCatId === cat.id
                              ? 'bg-purple-700 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                  </div>

                  {(() => {
                    const currentCat = editCategories.find((c) => c.id === selectedEditCatId);
                    if (!currentCat) return null;

                    const handleUpdateCurrentCat = (updates: Partial<FlowerCategory>) => {
                      setEditCategories(
                        editCategories.map((c) => (c.id === selectedEditCatId ? { ...c, ...updates } : c))
                      );
                    };

                    return (
                      <div className="space-y-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">Tên danh mục</label>
                          <input
                            type="text"
                            value={currentCat.name}
                            onChange={(e) => handleUpdateCurrentCat({ name: e.target.value })}
                            className="glass-input w-full text-xs py-2 rounded-xl font-bold"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">Mô tả ngắn</label>
                          <input
                            type="text"
                            value={currentCat.description}
                            onChange={(e) => handleUpdateCurrentCat({ description: e.target.value })}
                            className="glass-input w-full text-xs py-2 rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">URL Ảnh Bìa Danh Mục</label>
                          <input
                            type="url"
                            value={currentCat.imageUrl}
                            onChange={(e) => handleUpdateCurrentCat({ imageUrl: e.target.value })}
                            className="glass-input w-full text-xs py-2 rounded-xl font-mono text-[11px]"
                          />
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* 3. PROMOTIONS CONTROLS */}
              {cmsSection === 'promotions' && (
                <div className="space-y-4 text-xs">
                  <div className="font-bold text-slate-800 pb-1 border-b border-slate-100">
                    Chỉnh Sửa Mã Khuyến Mại &amp; Voucher
                  </div>
                  {editPromotions.map((p, idx) => (
                    <div key={p.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-purple-800 font-mono">{p.code}</span>
                        <input
                          type="text"
                          value={p.badge}
                          onChange={(e) => {
                            const copy = [...editPromotions];
                            copy[idx].badge = e.target.value;
                            setEditPromotions(copy);
                          }}
                          className="glass-input text-[10px] py-1 px-2 w-28 rounded-lg"
                        />
                      </div>
                      <input
                        type="text"
                        value={p.title}
                        onChange={(e) => {
                          const copy = [...editPromotions];
                          copy[idx].title = e.target.value;
                          setEditPromotions(copy);
                        }}
                        className="glass-input w-full text-xs py-1.5 rounded-xl font-semibold"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* 4. ARTICLES CONTROLS */}
              {cmsSection === 'articles' && (
                <div className="space-y-4 text-xs">
                  <div className="font-bold text-slate-800 pb-1 border-b border-slate-100">
                    Chỉnh Sửa Cẩm Nang &amp; Mẹo Chăm Hoa
                  </div>
                  {editArticles.map((art, idx) => (
                    <div key={art.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <span className="text-[10px] text-slate-400">{art.publishedAt}</span>
                      <input
                        type="text"
                        value={art.title}
                        onChange={(e) => {
                          const copy = [...editArticles];
                          copy[idx].title = e.target.value;
                          setEditArticles(copy);
                        }}
                        className="glass-input w-full text-xs py-1.5 rounded-xl font-bold"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT PANE: LIVE WEBVIEW PREVIEW (7 Cols) */}
            <div className="lg:col-span-7 glass-panel p-4 sm:p-5 rounded-[28px] space-y-4 bg-slate-100/90 border border-slate-300/80">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 bg-white/80 px-2 py-0.5 rounded border border-slate-200">
                    https://vvflorielle.vn/preview
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('desktop')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      previewDevice === 'desktop' ? 'bg-purple-100 text-purple-800' : 'text-slate-400 hover:text-slate-700'
                    }`}
                    title="Xem bản Desktop"
                  >
                    <Monitor className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('mobile')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      previewDevice === 'mobile' ? 'bg-purple-100 text-purple-800' : 'text-slate-400 hover:text-slate-700'
                    }`}
                    title="Xem bản Mobile"
                  >
                    <Smartphone className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Mockup Canvas */}
              <div className={`mx-auto transition-all ${previewDevice === 'mobile' ? 'max-w-[375px]' : 'w-full'}`}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-200 p-4 space-y-4">
                  {/* Mock Hero */}
                  <div className="bg-gradient-to-r from-emerald-800 to-teal-700 text-white p-5 rounded-xl space-y-2">
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">{editHero.badge}</span>
                    <h3 className="text-base font-extrabold leading-snug">{editHero.title}</h3>
                    <p className="text-xs text-emerald-100 line-clamp-2">{editHero.subtitle}</p>
                    <div className="pt-1 flex gap-2">
                      <span className="text-[11px] font-bold bg-white text-emerald-800 px-3 py-1 rounded-lg">
                        {editHero.ctaText}
                      </span>
                    </div>
                  </div>

                  {/* Mock Categories */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-slate-800">Danh Mục Dịp Tặng Hoa</div>
                    <div className="grid grid-cols-3 gap-2">
                      {editCategories
                        .filter((c) => c.id !== 'all')
                        .slice(0, 6)
                        .map((c) => (
                          <div key={c.id} className="text-center space-y-1">
                            <div className="aspect-square rounded-lg overflow-hidden bg-slate-100">
                              <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="text-[10px] font-semibold text-slate-700 truncate">{c.name}</div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Mock Vouchers */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-slate-800">Kho Voucher Đang Hoạt Động</div>
                    <div className="space-y-1.5">
                      {editPromotions.slice(0, 2).map((p) => (
                        <div
                          key={p.id}
                          className="p-2 rounded-lg bg-rose-50/70 border border-rose-200 flex items-center justify-between"
                        >
                          <div>
                            <div className="font-mono font-bold text-xs text-rose-700">{p.code}</div>
                            <div className="text-[10px] text-slate-600">{p.title}</div>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                            {p.badge}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 7: MARQUEE ANNOUNCEMENTS (DÒNG CHỮ CHẠY DƯỚI MENU)
          ========================================================================= */}
      {activeTab === 'marquee' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {renderBackHeader('Bảng Tin Chạy Chữ Khuyến Mãi Đỉnh Trang')}
          <div className="glass-panel p-6 rounded-[28px] space-y-6 border border-purple-200/80 bg-white/80">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-purple-700" />
                  <span>Quản Lý Bảng Tin Chạy &amp; Khuyến Mãi (Marquee Ticker)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Dòng chữ chạy liên tục ngay dưới thanh menu. Cả Admin và Florist đều có thể thêm, sửa, bật/tắt hoặc xóa dòng tin.
                </p>
              </div>
              <div className="text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200 self-start sm:self-auto">
                {marqueeAnnouncements.filter((m) => m.isEnabled).length} dòng tin đang chạy
              </div>
            </div>

            {/* Live Preview Box */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Xem trước dòng chữ chạy thực tế:</label>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/90 overflow-hidden relative shadow-inner">
                <div className="flex items-center gap-6 whitespace-nowrap overflow-x-auto text-xs font-medium text-slate-700 py-1">
                  {marqueeAnnouncements
                    .filter((m) => m.isEnabled)
                    .map((item) => (
                      <div key={item.id} className="inline-flex items-center gap-2 shrink-0">
                        {item.tag && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                            {item.tag}
                          </span>
                        )}
                        <span>{item.text}</span>
                        <span className="text-emerald-400 font-bold">•</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Form to Add New Marquee Announcement */}
            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/80 space-y-3">
              <div className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-purple-700" />
                <span>Thêm Dòng Tin Chạy Mới</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-1">
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Thẻ nhãn (Tag)</label>
                  <select
                    value={newMarqueeTag}
                    onChange={(e) => setNewMarqueeTag(e.target.value)}
                    className="glass-input w-full text-xs py-2 px-3 rounded-xl border border-purple-200 bg-white"
                  >
                    <option value="ƯU ĐÃI">ƯU ĐÃI</option>
                    <option value="CỬA HÀNG">CỬA HÀNG</option>
                    <option value="HỘI VIÊN">HỘI VIÊN</option>
                    <option value="GIAO HÀNG">GIAO HÀNG</option>
                    <option value="THANH TOÁN">THANH TOÁN</option>
                    <option value="HOT">HOT</option>
                    <option value="THÔNG BÁO">THÔNG BÁO</option>
                  </select>
                </div>
                <div className="sm:col-span-3">
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Nội dung dòng chữ chạy</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="VD: Tặng thiệp viết tay & nơ lụa cao cấp cho tất cả các đơn hoa khai trương, sinh nhật..."
                      value={newMarqueeText}
                      onChange={(e) => setNewMarqueeText(e.target.value)}
                      className="glass-input flex-1 text-xs py-2 px-3 rounded-xl border border-purple-200 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newMarqueeText.trim()) {
                          showToast('Vui lòng nhập nội dung dòng chữ chạy!', 'error');
                          return;
                        }
                        addMarqueeItem({
                          text: newMarqueeText.trim(),
                          tag: newMarqueeTag,
                          isEnabled: true,
                          order: marqueeAnnouncements.length + 1
                        });
                        setNewMarqueeText('');
                      }}
                      className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold shrink-0 shadow-sm transition-all"
                    >
                      Thêm Mới
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* List of Marquee Announcements */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-700 block">
                Danh sách các dòng tin ({marqueeAnnouncements.length})
              </label>
              {marqueeAnnouncements.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
                  Chưa có dòng tin nào. Hãy bấm "Thêm Mới" ở trên để tạo dòng tin đầu tiên.
                </div>
              ) : (
                marqueeAnnouncements.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      item.isEnabled
                        ? 'bg-white border-slate-200 shadow-sm'
                        : 'bg-slate-50 border-slate-200/60 opacity-60'
                    }`}
                  >
                    {editingMarqueeId === item.id ? (
                      /* Inline Edit Mode */
                      <div className="flex-1 space-y-2">
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                          <input
                            type="text"
                            value={editMarqueeTag}
                            onChange={(e) => setEditMarqueeTag(e.target.value)}
                            placeholder="Tag (VD: ƯU ĐÃI)"
                            className="glass-input text-xs py-1.5 px-2.5 rounded-lg border border-purple-300"
                          />
                          <input
                            type="text"
                            value={editMarqueeText}
                            onChange={(e) => setEditMarqueeText(e.target.value)}
                            placeholder="Nội dung dòng tin"
                            className="glass-input sm:col-span-3 text-xs py-1.5 px-2.5 rounded-lg border border-purple-300"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (!editMarqueeText.trim()) return;
                              updateMarqueeItem(item.id, {
                                text: editMarqueeText.trim(),
                                tag: editMarqueeTag.trim()
                              });
                              setEditingMarqueeId(null);
                            }}
                            className="px-3 py-1 bg-purple-700 text-white rounded-lg text-xs font-semibold"
                          >
                            Lưu thay đổi
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingMarqueeId(null)}
                            className="px-3 py-1 bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                          >
                            Hủy
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Display Mode */
                      <>
                        <div className="flex items-start gap-2.5 flex-1 min-w-0">
                          <span className="font-mono text-xs text-slate-400 font-bold shrink-0 mt-0.5">
                            #{idx + 1}
                          </span>
                          {item.tag && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 border border-purple-200 shrink-0">
                              {item.tag}
                            </span>
                          )}
                          <span className="text-xs text-slate-800 font-medium leading-relaxed">
                            {item.text}
                          </span>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          {/* Toggle Switch */}
                          <button
                            type="button"
                            onClick={() => toggleMarqueeItem(item.id)}
                            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all border ${
                              item.isEnabled
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                                : 'bg-slate-200 text-slate-600 border-slate-300 hover:bg-slate-300'
                            }`}
                            title="Bật hoặc tắt hiển thị dòng tin này"
                          >
                            {item.isEnabled ? 'Đang chạy' : 'Đã ẩn'}
                          </button>

                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingMarqueeId(item.id);
                              setEditMarqueeText(item.text);
                              setEditMarqueeTag(item.tag || '');
                            }}
                            className="p-1.5 text-slate-400 hover:text-purple-700 rounded-lg hover:bg-purple-50 transition-colors"
                            title="Chỉnh sửa nội dung"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm('Bạn có chắc chắn muốn xóa dòng tin này không?')) {
                                deleteMarqueeItem(item.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                            title="Xóa dòng tin"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: VIEW BILL RECEIPT IMAGE & APPROVE DEPOSIT
          ========================================================================= */}
      {viewingBillOrder && (
        <div className="glass-overlay" onClick={() => setViewingBillOrder(null)}>
          <div
            className="glass-modal-content max-w-xl md:max-w-2xl rounded-[28px] sm:rounded-[36px] border border-white/80 bg-white/95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="glass-modal-header">
              <div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900">Chi Tiết Ảnh Bill Chuyển Khoản</h3>
                <p className="text-xs text-slate-500">
                  Mã đơn: <span className="font-mono font-bold text-purple-700">#{viewingBillOrder.id}</span> • Khách hàng: {viewingBillOrder.senderName}
                </p>
              </div>
              <button
                onClick={() => setViewingBillOrder(null)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="glass-modal-body space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div className="rounded-2xl overflow-hidden border border-slate-200 min-h-[240px] max-h-[350px] bg-slate-100 flex items-center justify-center shadow-inner">
                  {viewingBillOrder.billImageDataUrl ? (
                    <img
                      src={viewingBillOrder.billImageDataUrl}
                      alt={`Bill đơn #${viewingBillOrder.id}`}
                      className="max-h-[350px] w-auto object-contain"
                    />
                  ) : (
                    <div className="py-12 text-slate-400 text-xs">Không có hình ảnh bill</div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200 text-xs space-y-2">
                    <div className="flex justify-between items-center pb-1.5 border-b border-slate-200/60">
                      <span className="text-slate-500">Người chuyển / SĐT:</span>
                      <span className="font-semibold text-slate-800 text-right">
                        {viewingBillOrder.senderName} ({viewingBillOrder.senderPhone})
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-1.5 border-b border-slate-200/60">
                      <span className="text-slate-500">Cú pháp chuẩn:</span>
                      <span className="font-mono font-bold text-purple-700">
                        VVF {viewingBillOrder.id} {viewingBillOrder.senderPhone}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-1.5 border-b border-slate-200/60">
                      <span className="text-slate-500">Tiền cọc 50% yêu cầu:</span>
                      <span className="font-bold text-rose-700 text-sm">
                        {formatPrice(
                          viewingBillOrder.depositAmount || Math.round(viewingBillOrder.flowerPrice * 0.5)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Tổng giá trị đơn:</span>
                      <span className="font-bold text-slate-900 text-sm">{formatPrice(viewingBillOrder.totalAmount)}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200/80 text-[11px] text-purple-800">
                    Trạng thái cọc hiện tại:{' '}
                    <strong>{viewingBillOrder.isDepositPaid ? 'Đã thanh toán cọc' : 'Chờ xác nhận cọc'}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-modal-footer">
              <button
                type="button"
                onClick={() => setViewingBillOrder(null)}
                className="btn-secondary text-xs py-2 px-4 rounded-xl"
              >
                Đóng
              </button>
              {!viewingBillOrder.isDepositPaid && (
                <button
                  type="button"
                  onClick={() => {
                    approveOrderDeposit(viewingBillOrder.id, 'ADMIN');
                    setViewingBillOrder(null);
                  }}
                  className="btn-primary text-xs py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-md flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Duyệt Cọc 50% Ngay</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: EDIT ORDER SHIPPING FEE
          ========================================================================= */}
      {editShippingOrder && (
        <div className="glass-overlay" onClick={() => setEditShippingOrder(null)}>
          <div
            className="glass-modal-content max-w-sm rounded-[28px] sm:rounded-[36px] border border-white/80 bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="glass-modal-header">
              <h3 className="font-bold text-base text-slate-900">Điều Chỉnh Phí Vận Chuyển</h3>
              <button
                onClick={() => setEditShippingOrder(null)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="glass-modal-body space-y-4 text-xs">
              <p className="text-slate-600">
                Mã đơn hàng: <strong className="font-mono text-purple-700">#{editShippingOrder.id}</strong>
              </p>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Phí vận chuyển mới (VNĐ)</label>
                <input
                  type="number"
                  step={5000}
                  value={editShippingOrder.fee}
                  onChange={(e) => setEditShippingOrder({ ...editShippingOrder, fee: Number(e.target.value) })}
                  className="glass-input w-full text-sm font-bold font-mono py-2.5 rounded-xl"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Giá tổng đơn hàng sẽ tự động cập nhật lại = Giá hoa + Phí ship mới.
                </span>
              </div>
            </div>

            <div className="glass-modal-footer">
              <button
                type="button"
                onClick={() => setEditShippingOrder(null)}
                className="btn-secondary text-xs py-2 px-4 rounded-xl"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  adjustOrderShippingFee(editShippingOrder.id, editShippingOrder.fee);
                  setEditShippingOrder(null);
                }}
                className="btn-primary text-xs py-2 px-4 rounded-xl"
              >
                Lưu Phí Ship
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: TEMPORARY PASSWORD RESET CONFIRMATION
          ========================================================================= */}
      {tempPassModal && (
        <div className="glass-overlay" onClick={() => setTempPassModal(null)}>
          <div
            className="glass-modal-content max-w-sm rounded-[28px] sm:rounded-[36px] border border-white/80 bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="glass-modal-header">
              <h3 className="font-bold text-base text-slate-900">Đã Cấp Mật Khẩu Tạm</h3>
              <button
                onClick={() => setTempPassModal(null)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="glass-modal-body space-y-3 text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-1 shadow-md border border-amber-200">
                <KeyRound className="w-6 h-6" />
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Khách hàng: <strong className="text-slate-800">{tempPassModal.customerName}</strong>
                </p>
              </div>

              <div className="my-2 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-1">
                <span className="text-[11px] text-amber-800 font-medium">Mật khẩu tạm thời mới:</span>
                <div className="font-mono text-xl font-extrabold text-slate-900 tracking-wider">
                  {tempPassModal.pass}
                </div>
              </div>

              <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                Hãy sao chép và gửi mật khẩu này cho khách hàng. Sau khi đăng nhập, khách có thể đổi lại mật khẩu trong trang cá nhân.
              </p>
            </div>

            <div className="glass-modal-footer">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(tempPassModal.pass);
                  showToast('Đã sao chép mật khẩu tạm!', 'success');
                  setTempPassModal(null);
                }}
                className="btn-primary w-full text-xs py-2.5 rounded-xl shadow-md flex items-center justify-center gap-1.5"
              >
                <Copy className="w-4 h-4" />
                <span>Sao Chép Mật Khẩu &amp; Đóng</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD NEW CONTACT CHANNEL
          ========================================================================= */}
      {isAddingChannel && (
        <div className="glass-overlay" onClick={() => setIsAddingChannel(false)}>
          <div
            className="glass-modal-content max-w-md rounded-[28px] sm:rounded-[36px] border border-white/80 bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="glass-modal-header">
              <h3 className="font-bold text-base text-slate-900">Thêm Kênh Liên Hệ Mới</h3>
              <button
                onClick={() => setIsAddingChannel(false)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newChannelTitle.trim() || !newChannelUrl.trim()) {
                  showToast('Vui lòng nhập tên kênh và đường dẫn!', 'error');
                  return;
                }
                addContactChannel({
                  type: newChannelType,
                  label: newChannelTitle.trim(),
                  title: newChannelTitle.trim(),
                  value: newChannelValue.trim() || newChannelTitle.trim(),
                  link: newChannelUrl.trim(),
                  url: newChannelUrl.trim(),
                  isEnabled: true
                });
                setIsAddingChannel(false);
                setNewChannelTitle('');
                setNewChannelValue('');
                setNewChannelUrl('');
              }}
              className="flex flex-col flex-1 min-h-0"
            >
              <div className="glass-modal-body space-y-3.5 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Loại kênh liên hệ</label>
                  <select
                    value={newChannelType}
                    onChange={(e) => setNewChannelType(e.target.value as ContactChannel['type'])}
                    className="glass-input w-full text-xs py-2 rounded-xl"
                  >
                    <option value="zalo">Zalo Chat</option>
                    <option value="hotline">Hotline Gọi Ngay</option>
                    <option value="tiktok">TikTok Kênh Video</option>
                    <option value="facebook">Facebook Fanpage</option>
                    <option value="messenger">Facebook Messenger</option>
                    <option value="maps">Google Maps (105 Doãn Kế Thiện)</option>
                    <option value="custom">Kênh Khác</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tên hiển thị *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Chat Zalo Florist, Chỉ đường Showroom..."
                    value={newChannelTitle}
                    onChange={(e) => setNewChannelTitle(e.target.value)}
                    className="glass-input w-full text-xs py-2 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Giá trị hiển thị phụ</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 0987.654.321 hoặc @vvflorielle"
                    value={newChannelValue}
                    onChange={(e) => setNewChannelValue(e.target.value)}
                    className="glass-input w-full text-xs py-2 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Đường dẫn liên kết (URL) *</label>
                  <input
                    type="text"
                    required
                    placeholder="https://zalo.me/... hoặc https://maps.google.com/..."
                    value={newChannelUrl}
                    onChange={(e) => setNewChannelUrl(e.target.value)}
                    className="glass-input w-full text-xs py-2 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="glass-modal-footer">
                <button
                  type="button"
                  onClick={() => setIsAddingChannel(false)}
                  className="btn-secondary text-xs py-2 px-4 rounded-xl"
                >
                  Hủy
                </button>
                <button type="submit" className="btn-primary text-xs py-2 px-4 rounded-xl">
                  Thêm Kênh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD NEW PROMOTION VOUCHER
          ========================================================================= */}
      {isAddVoucherOpen && (
        <div className="glass-overlay" onClick={() => setIsAddVoucherOpen(false)}>
          <div
            className="glass-modal-content max-w-lg md:max-w-xl rounded-[28px] sm:rounded-[36px] border border-white/80 bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="glass-modal-header">
              <h3 className="font-bold text-base sm:text-lg text-slate-900">Tạo Mã Giảm Giá / Voucher Mới</h3>
              <button
                onClick={() => setIsAddVoucherOpen(false)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newVoucherCode.trim() || !newVoucherTitle.trim()) {
                  showToast('Vui lòng nhập mã và tiêu đề voucher!', 'error');
                  return;
                }
                const newPromo: PromotionItem = {
                  id: `promo_${Date.now()}`,
                  code: newVoucherCode.trim().toUpperCase(),
                  title: newVoucherTitle.trim(),
                  description:
                    newVoucherDesc.trim() ||
                    `Giảm ${formatPrice(newVoucherDiscount)} cho đơn từ ${formatPrice(newVoucherMinOrder)}`,
                  discountAmount: newVoucherDiscount,
                  minOrder: newVoucherMinOrder,
                  badge: newVoucherBadge.trim() || 'ƯU ĐÃI',
                  validUntil: '31/12/2026',
                  discountType: 'FREESHIP',
                  isActive: true,
                  pointsToRedeem: newVoucherPoints > 0 ? newVoucherPoints : undefined
                };
                updatePromotions([...promotions, newPromo]);
                setIsAddVoucherOpen(false);
                setNewVoucherCode('');
                setNewVoucherTitle('');
                setNewVoucherDesc('');
              }}
              className="flex flex-col flex-1 min-h-0"
            >
              <div className="glass-modal-body space-y-3.5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Mã Voucher *</label>
                    <input
                      type="text"
                      required
                      placeholder="FREESHIP30K"
                      value={newVoucherCode}
                      onChange={(e) => setNewVoucherCode(e.target.value.toUpperCase())}
                      className="glass-input w-full text-xs py-2 rounded-xl font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Nhãn / Badge</label>
                    <input
                      type="text"
                      placeholder="FREESHIP, HOT, VIP"
                      value={newVoucherBadge}
                      onChange={(e) => setNewVoucherBadge(e.target.value)}
                      className="glass-input w-full text-xs py-2 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tiêu đề voucher *</label>
                  <input
                    type="text"
                    required
                    placeholder="Miễn phí vận chuyển 30K..."
                    value={newVoucherTitle}
                    onChange={(e) => setNewVoucherTitle(e.target.value)}
                    className="glass-input w-full text-xs py-2 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Mô tả điều kiện áp dụng</label>
                  <textarea
                    rows={2}
                    placeholder="Áp dụng cho đơn hoa từ 300.000đ..."
                    value={newVoucherDesc}
                    onChange={(e) => setNewVoucherDesc(e.target.value)}
                    className="glass-input w-full text-xs py-2 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Số tiền giảm</label>
                    <input
                      type="number"
                      step={5000}
                      value={newVoucherDiscount}
                      onChange={(e) => setNewVoucherDiscount(Number(e.target.value))}
                      className="glass-input w-full text-xs py-2 rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Đơn tối thiểu</label>
                    <input
                      type="number"
                      step={10000}
                      value={newVoucherMinOrder}
                      onChange={(e) => setNewVoucherMinOrder(Number(e.target.value))}
                      className="glass-input w-full text-xs py-2 rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Điểm đổi (nếu có)</label>
                    <input
                      type="number"
                      step={50}
                      value={newVoucherPoints}
                      onChange={(e) => setNewVoucherPoints(Number(e.target.value))}
                      className="glass-input w-full text-xs py-2 rounded-xl font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="glass-modal-footer">
                <button
                  type="button"
                  onClick={() => setIsAddVoucherOpen(false)}
                  className="btn-secondary text-xs py-2 px-4 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-4 rounded-xl bg-rose-600 hover:bg-rose-700"
                >
                  Tạo Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD NEW FLOWER PRODUCT (EXPANDED DESKTOP 2-COLUMN GRID)
          ========================================================================= */}
      {isAddProductOpen && (
        <div className="glass-overlay" onClick={() => setIsAddProductOpen(false)}>
          <div
            className="glass-modal-content max-w-2xl lg:max-w-3xl rounded-[28px] sm:rounded-[36px] border border-white/80 bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="glass-modal-header">
              <div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900">Thêm Mẫu Hoa Thiết Kế Mới</h3>
                <p className="text-xs text-slate-500">Cập nhật sản phẩm trực tiếp vào catalog V&amp;V Florielle</p>
              </div>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newProdName.trim()) {
                  showToast('Vui lòng nhập tên mẫu hoa!', 'error');
                  return;
                }
                const newProd: FlowerProduct = {
                  id: `flower_${Date.now()}`,
                  name: newProdName.trim(),
                  categoryId: newProdCategory,
                  price: newProdPrice,
                  originalPrice: newProdOriginalPrice,
                  imageUrl: newProdImageUrl.trim(),
                  description: newProdDesc.trim(),
                  meaning: newProdMeaning.trim(),
                  flowerTypes: newProdFlowers.split(',').map((f) => f.trim()).filter(Boolean),
                  isAvailable: true,
                  tag: 'Mới',
                  gradientTheme: {
                    bg: 'from-emerald-500/10 to-teal-500/10',
                    accent: '#059669',
                    tagBg: '#059669'
                  },
                  rating: 5.0,
                  reviewCount: 1
                };
                addProduct(newProd);
                setIsAddProductOpen(false);
                setNewProdName('');
                showToast('Đã thêm mẫu hoa mới vào catalog!', 'success');
              }}
              className="flex flex-col flex-1 min-h-0"
            >
              <div className="glass-modal-body space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left Column */}
                  <div className="space-y-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Tên mẫu hoa *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ví dụ: Lẵng Khai Trương Thịnh Vượng Vàng Gold..."
                        value={newProdName}
                        onChange={(e) => setNewProdName(e.target.value)}
                        className="glass-input w-full text-xs py-2 rounded-xl font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Dịp tặng</label>
                        <select
                          value={newProdCategory}
                          onChange={(e) => setNewProdCategory(e.target.value as CategoryId)}
                          className="glass-input w-full text-xs py-2 rounded-xl"
                        >
                          <option value="khai-truong">Hoa Khai Trương</option>
                          <option value="sinh-nhat">Hoa Sinh Nhật</option>
                          <option value="tinh-yeu">Hoa Tình Yêu</option>
                          <option value="lan-ho-diep">Lan Hồ Điệp</option>
                          <option value="cam-on">Hoa Cảm Ơn &amp; Chúc Mừng</option>
                          <option value="chia-buon">Hoa Chia Buồn</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Giá bán (VNĐ) *</label>
                        <input
                          type="number"
                          step={10000}
                          required
                          value={newProdPrice}
                          onChange={(e) => setNewProdPrice(Number(e.target.value))}
                          className="glass-input w-full text-xs py-2 rounded-xl font-mono font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">URL Ảnh Chụp Thật Sản Phẩm *</label>
                      <input
                        type="url"
                        required
                        placeholder="https://images.unsplash.com/..."
                        value={newProdImageUrl}
                        onChange={(e) => setNewProdImageUrl(e.target.value)}
                        className="glass-input w-full text-xs py-2 rounded-xl font-mono text-[11px]"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Hoa thành phần (phân cách bằng dấu phẩy)</label>
                      <input
                        type="text"
                        placeholder="Hồng Ecuador, Cẩm tú cầu, Baby trắng..."
                        value={newProdFlowers}
                        onChange={(e) => setNewProdFlowers(e.target.value)}
                        className="glass-input w-full text-xs py-2 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Ý nghĩa &amp; Thông điệp thiết kế</label>
                      <input
                        type="text"
                        placeholder="Thông điệp gửi gắm chúc mừng tài lộc..."
                        value={newProdMeaning}
                        onChange={(e) => setNewProdMeaning(e.target.value)}
                        className="glass-input w-full text-xs py-2 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Mô tả chi tiết</label>
                      <textarea
                        rows={3}
                        placeholder="Mô tả kích thước hoa, xuất xứ hoa tươi..."
                        value={newProdDesc}
                        onChange={(e) => setNewProdDesc(e.target.value)}
                        className="glass-input w-full text-xs py-2 rounded-xl"
                      />
                    </div>

                    {/* Image Preview Box */}
                    {newProdImageUrl && (
                      <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 h-28 flex items-center justify-center">
                        <img
                          src={newProdImageUrl}
                          alt="Xem trước ảnh"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="glass-modal-footer">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="btn-secondary text-xs py-2 px-4 rounded-xl"
                >
                  Hủy
                </button>
                <button type="submit" className="btn-primary text-xs py-2 px-4 rounded-xl">
                  Lưu Sản Phẩm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: CUSTOMER DETAIL & ORDER HISTORY (EXPANDED DESKTOP WIDE VIEW)
          ========================================================================= */}
      {selectedCustomer && (
        <div className="glass-overlay" onClick={() => setSelectedCustomer(null)}>
          <div
            className="glass-modal-content max-w-2xl lg:max-w-4xl rounded-[28px] sm:rounded-[36px] border border-white/80 bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="glass-modal-header">
              <div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900">Chi Tiết Hồ Sơ Khách Hàng</h3>
                <p className="text-xs text-slate-500">
                  {selectedCustomer.fullName} • <span className="font-mono">{selectedCustomer.phone}</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="glass-modal-body space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50/80 border border-slate-200">
                <div>
                  <span className="text-slate-500 block">Hạng thành viên:</span>
                  <div className="font-bold text-purple-700 mt-0.5 text-sm">{selectedCustomer.tier}</div>
                </div>
                <div>
                  <span className="text-slate-500 block">Trạng thái xác thực:</span>
                  <div className="font-bold text-emerald-700 mt-0.5 text-xs">
                    {selectedCustomer.isVerified ? 'Hội viên đã xác thực' : 'Thành viên thường'}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 block">Ví điểm tích lũy:</span>
                  <div className="font-extrabold text-sm text-emerald-800 mt-0.5">
                    {selectedCustomer.points} điểm
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 block">Tổng chi tiêu:</span>
                  <div className="font-extrabold text-sm text-slate-900 mt-0.5">
                    {formatPrice(selectedCustomer.totalSpent)}
                  </div>
                </div>
              </div>

              {/* Extra Details on Desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 space-y-1.5">
                  <span className="text-slate-500 font-semibold block">Thông Tin Cá Nhân &amp; Liên Hệ</span>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Email:</span>
                    <span className="font-medium text-slate-800">{selectedCustomer.email || 'Chưa cung cấp'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Ngày sinh:</span>
                    <span className="font-medium text-slate-800">{selectedCustomer.birthday || 'Chưa cung cấp'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Địa chỉ hiện tại:</span>
                    <span className="font-medium text-slate-800 text-right max-w-[220px] truncate">{selectedCustomer.address || 'Chưa cung cấp'}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 space-y-1.5">
                  <span className="text-slate-500 font-semibold block">Sở Thích &amp; Ghi Chú Florist</span>
                  <div>
                    <span className="text-slate-400">Hoa yêu thích: </span>
                    <span className="font-medium text-purple-700">
                      {selectedCustomer.favoriteFlowers?.length ? selectedCustomer.favoriteFlowers.join(', ') : 'Chưa có'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Ghi chú florist: </span>
                    <span className="font-medium text-slate-700">{selectedCustomer.notes || 'Không có ghi chú'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-xs text-slate-800 mb-2 flex items-center justify-between">
                  <span>Lịch Sử Mua Hàng ({getCustomerOrderHistory(selectedCustomer.phone).length})</span>
                  <span className="text-[11px] font-normal text-slate-400">Mới nhất lên đầu</span>
                </h4>
                <div className="space-y-2">
                  {getCustomerOrderHistory(selectedCustomer.phone).length === 0 ? (
                    <div className="py-6 text-center text-slate-400 bg-slate-50 rounded-xl">Chưa có đơn hàng nào</div>
                  ) : (
                    getCustomerOrderHistory(selectedCustomer.phone).map((ord) => (
                      <div
                        key={ord.id}
                        className="p-3 rounded-xl bg-slate-50/80 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-purple-800">#{ord.id}</span>
                            <span className="text-[11px] text-slate-500">• {ord.createdAt}</span>
                          </div>
                          <div className="text-[11px] text-slate-600">
                            Người nhận: <strong>{ord.recipientName}</strong> ({ord.recipientPhone}) - {ord.recipientAddress}
                          </div>
                        </div>
                        <div className="text-right sm:shrink-0">
                          <div className="font-bold text-slate-900">{formatPrice(ord.totalAmount)}</div>
                          <span className="text-[10px] font-semibold text-emerald-700 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                            {ord.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="glass-modal-footer">
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="btn-secondary text-xs py-2 px-4 rounded-xl"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADJUST CUSTOMER POINTS
          ========================================================================= */}
      {adjustingCustomer && (
        <div className="glass-overlay" onClick={() => setAdjustingCustomer(null)}>
          <div
            className="glass-modal-content max-w-sm rounded-[28px] sm:rounded-[36px] border border-white/80 bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="glass-modal-header">
              <h3 className="font-bold text-base text-slate-900">Điều Chỉnh Điểm Tích Lũy</h3>
              <button
                onClick={() => setAdjustingCustomer(null)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="glass-modal-body space-y-3.5 text-xs">
              <p className="text-slate-600">
                Khách hàng: <strong>{adjustingCustomer.fullName}</strong>
                <br />
                Hiện có: <strong className="text-emerald-700">{adjustingCustomer.points} điểm</strong>
              </p>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Số điểm điều chỉnh (+ để cộng, - để trừ)
                </label>
                <input
                  type="number"
                  step={10}
                  value={pointsDelta}
                  onChange={(e) => setPointsDelta(Number(e.target.value))}
                  className="glass-input w-full text-sm font-bold font-mono py-2 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Lý do điều chỉnh</label>
                <input
                  type="text"
                  value={pointsReason}
                  onChange={(e) => setPointsReason(e.target.value)}
                  className="glass-input w-full text-xs py-2 rounded-xl"
                  placeholder="Ví dụ: Thưởng thành viên tích cực, hoàn điểm..."
                />
              </div>
            </div>

            <div className="glass-modal-footer">
              <button
                type="button"
                onClick={() => setAdjustingCustomer(null)}
                className="btn-secondary text-xs py-2 px-4 rounded-xl"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  adjustCustomerPoints(adjustingCustomer.id, pointsDelta, pointsReason);
                  setAdjustingCustomer(null);
                }}
                className="btn-primary text-xs py-2 px-4 rounded-xl"
              >
                Xác Nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: EDIT CUSTOMER NOTES & FAVORITE FLOWERS
          ========================================================================= */}
      {editingCustomer && (
        <div className="glass-overlay" onClick={() => setEditingCustomer(null)}>
          <div
            className="glass-modal-content max-w-md rounded-[28px] sm:rounded-[36px] border border-white/80 bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="glass-modal-header">
              <h3 className="font-bold text-base text-slate-900">Ghi Chú Sở Thích &amp; Florist</h3>
              <button
                onClick={() => setEditingCustomer(null)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="glass-modal-body space-y-3.5 text-xs">
              <p className="text-slate-600">
                Khách hàng: <strong className="text-slate-800">{editingCustomer.fullName}</strong> (
                {editingCustomer.phone})
              </p>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Hoa yêu thích / Tông màu mong muốn
                </label>
                <input
                  type="text"
                  value={editFavFlowers}
                  onChange={(e) => setEditFavFlowers(e.target.value)}
                  className="glass-input w-full text-xs py-2 rounded-xl"
                  placeholder="Ví dụ: Hồng Ecuador pastel, Lan hồ điệp trắng, không thích hoa ly..."
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Ghi chú nội bộ cho florist</label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="glass-input w-full text-xs py-2 rounded-xl"
                  placeholder="Ghi chú về thói quen đặt hoa, giờ giao hàng yêu thích, dịp tặng..."
                />
              </div>
            </div>

            <div className="glass-modal-footer">
              <button
                type="button"
                onClick={() => setEditingCustomer(null)}
                className="btn-secondary text-xs py-2 px-4 rounded-xl"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  updateCustomerByAdmin(editingCustomer.id, {
                    favoriteFlowers: editFavFlowers
                      .split(',')
                      .map((f) => f.trim())
                      .filter(Boolean),
                    notes: editNotes.trim()
                  });
                  setEditingCustomer(null);
                }}
                className="btn-primary text-xs py-2 px-4 rounded-xl"
              >
                Lưu Ghi Chú
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. POPUP MODALS (PHOTOTIINLOVE STYLE ACTION MODALS) */}
      <SecurityModal
        isOpen={showSecurityModal}
        onClose={() => setShowSecurityModal(false)}
        roleTitle="Super Admin"
        onSaveCredentials={(oldPass, oldPin, newPass, newPin) => {
          return changeAdminCredentials(oldPass, oldPin, newPass, newPin);
        }}
        adminEmail={adminEmail}
        onSaveEmailConfig={(email, appPass) => saveGmailConfig(email, appPass)}
      />

      <ShippingConfigModal
        isOpen={showShippingModal}
        onClose={() => setShowShippingModal(false)}
        settings={settings}
        onSave={(newSettings) => {
          updateSettings(newSettings);
          showToast('Đã lưu cấu hình bảng cước vận chuyển!', 'success');
        }}
      />

      <QuickVoucherModal
        isOpen={showQuickVoucherModal}
        onClose={() => setShowQuickVoucherModal(false)}
        onCreateVoucher={(newPromo) => {
          updatePromotions([newPromo, ...promotions]);
          showToast(`Đã phát hành mã ưu đãi ${newPromo.code}!`, 'success');
        }}
      />

      <MascotSelectorModal
        isOpen={showMascotModal}
        onClose={() => setShowMascotModal(false)}
        currentMascotId={settings.mascotImageUrl}
        onSelectMascot={(mascotUrl) => {
          updateSettings({ ...settings, mascotImageUrl: mascotUrl });
          showToast('Đã cập nhật linh vật tiệm hoa mới!', 'success');
        }}
      />

      <BillPreviewModal
        order={viewingBillOrder}
        onClose={() => setViewingBillOrder(null)}
        onApproveDeposit={(orderId) => {
          approveOrderDeposit(orderId);
          showToast(`Đã duyệt cọc đơn #${orderId}!`, 'success');
        }}
      />
    </div>
  );
};