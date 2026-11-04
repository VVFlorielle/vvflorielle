import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Lock,
  KeyRound,
  ShieldCheck,
  Mail,
  ArrowLeft,
  ShoppingBag,
  Flower2,
  Users,
  Gift,
  Settings,
  Sparkles,
  Truck,
  Share2,
  Megaphone,
  LayoutTemplate
} from 'lucide-react';
import { CustomerUser, Order, OrderStatus } from '../types';
import { ManagementOverviewHero } from '../components/management/ManagementOverviewHero';
import { ManagementTabsBar } from '../components/management/ManagementTabsBar';
import { ManagementFunctionalGrid, ManagementActionGroup } from '../components/management/ManagementFunctionalGrid';
import { ManagementRecentOrders } from '../components/management/ManagementRecentOrders';
import { ManagementDock } from '../components/management/ManagementDock';
import {
  SecurityModal,
  ShippingConfigModal,
  QuickVoucherModal,
  MascotSelectorModal,
  BillPreviewModal,
  EditShippingFeeModal,
  TempPasswordModal,
  AddContactChannelModal,
  AddVoucherModal,
  AddProductModal,
  CustomerDetailModal,
  AdjustPointsModal,
  EditCustomerNotesModal
} from '../components/management/ManagementModals';

// Subpages
import { OrdersSubpage } from '../components/management/subpages/OrdersSubpage';
import { ProductsSubpage } from '../components/management/subpages/ProductsSubpage';
import { CustomersSubpage } from '../components/management/subpages/CustomersSubpage';
import { PromotionsSubpage } from '../components/management/subpages/PromotionsSubpage';
import { StoreConfigSubpage } from '../components/management/subpages/StoreConfigSubpage';
import { SecuritySubpage } from '../components/management/subpages/SecuritySubpage';
import { CmsLiveviewSubpage } from '../components/management/subpages/CmsLiveviewSubpage';
import { MarqueeSubpage } from '../components/management/subpages/MarqueeSubpage';

export const AdminPortal: React.FC = () => {
  const {
    isAdmin,
    loginAdmin,
    logoutAdmin,
    adminEmail,
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
    contactChannels,
    addContactChannel,
    deleteContactChannel,
    toggleContactChannel,
    marqueeAnnouncements,
    addMarqueeItem,
    updateMarqueeItem,
    deleteMarqueeItem,
    toggleMarqueeItem,
    showToast
  } = useStore();

  // Login form states
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginPin, setLoginPin] = useState('');
  const [loginMode, setLoginMode] = useState<'login' | 'forgot'>('login');

  // Forgot PIN OTP states
  const [recoveryEmail, setRecoveryEmail] = useState(adminEmail);
  const [otpCode, setOtpCode] = useState('');
  const [newOtpPin, setNewOtpPin] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  // Active view tab (Default: 'dashboard')
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'orders' | 'products' | 'customers' | 'vouchers' | 'channels' | 'settings' | 'security' | 'cms' | 'marquee'
  >('dashboard');
  const [orderSearchForSubpage, setOrderSearchForSubpage] = useState('');

  // Modals state
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [showQuickVoucherModal, setShowQuickVoucherModal] = useState(false);
  const [showMascotModal, setShowMascotModal] = useState(false);
  const [viewingBillOrder, setViewingBillOrder] = useState<Order | null>(null);
  const [editShippingOrder, setEditShippingOrder] = useState<{ id: string; fee: number } | null>(null);
  const [tempPassModal, setTempPassModal] = useState<{ customerName: string; pass: string } | null>(null);
  const [isAddingChannel, setIsAddingChannel] = useState(false);
  const [isAddVoucherOpen, setIsAddVoucherOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerUser | null>(null);
  const [adjustingCustomer, setAdjustingCustomer] = useState<CustomerUser | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<CustomerUser | null>(null);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // KPIs
  const totalRevenue = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const arrangingCount = orders.filter((o) => o.status === 'ARRANGING' || o.status === 'PENDING').length;
  const completedCount = orders.filter((o) => o.status === 'COMPLETED').length;

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(loginUsername, loginPassword, loginPin);
    if (success) {
      setLoginPassword('');
      setLoginPin('');
    }
  };

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

  // Customer order history helper
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
                  className="w-full btn-primary text-xs py-3 bg-purple-700 hover:bg-purple-800 rounded-xl shadow-md shadow-purple-600/20 cursor-pointer"
                >
                  Xác Thực &amp; Mở Khóa Quản Trị
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setLoginMode('forgot')}
                  className="text-xs text-purple-700 hover:text-purple-900 font-semibold inline-flex items-center gap-1 cursor-pointer"
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
                className="inline-flex items-center gap-1.5 text-xs text-purple-700 hover:text-purple-900 font-semibold cursor-pointer"
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
                  <button
                    type="submit"
                    className="w-full btn-primary text-xs py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 cursor-pointer"
                  >
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
                  <button
                    type="submit"
                    className="w-full btn-primary text-xs py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 cursor-pointer"
                  >
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

  // 4 ACTION GROUPS CHUẨN PHOTOTIINLOVE
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
          title: 'Bộ Chọn Linh Vật Trợ Lý Ảo Flori',
          description: 'Bật popup xem và đổi tức thì linh vật hoạt họa trong bộ 6 mẫu tách nền chính thức của tiệm.',
          icon: <Sparkles className="w-5 h-5" />,
          iconBgColor: 'bg-amber-100 text-amber-700 border border-amber-200',
          badge: '6 Linh Vật Tách Nền',
          badgeColor: 'amber',
          actionType: 'modal',
          actionLabel: 'Mở Popup Chọn Mascot',
          onClick: () => setShowMascotModal(true)
        },
        {
          id: 'action-security-modal',
          title: 'Đổi Mật Khẩu & Mã PIN Cấp 2 Super Admin',
          description: 'Bật popup đổi mật khẩu đăng nhập, PIN 6 số và cấu hình Gmail App Password nhận mã OTP khôi phục.',
          icon: <KeyRound className="w-5 h-5" />,
          iconBgColor: 'bg-purple-100 text-purple-700 border border-purple-200',
          badge: 'Bảo Vệ Cấp 2',
          badgeColor: 'purple',
          actionType: 'modal',
          actionLabel: 'Mở Popup Đổi PIN',
          onClick: () => setShowSecurityModal(true)
        }
      ]
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 pt-4 pb-20 space-y-6 select-none">
      {/* 1. TOP OVERVIEW HERO BANNER */}
      <ManagementOverviewHero
        tag="Bảng Quản Trị Hệ Thống • Super Admin Command Center"
        tagIcon={<ShieldCheck className="w-3.5 h-3.5 text-purple-700" />}
        title="Trung Tâm Điều Hành Toàn Diện V&V Florielle"
        subtitle="105 Doãn Kế Thiện, Cầu Giấy • Kiểm soát toàn bộ doanh thu, đơn hàng hỏa tốc, khách hàng VIP, bảng cước ship và giao diện website."
        statusBadge="Hệ thống vận hành ổn định"
        stats={[
          {
            id: 'revenue',
            title: 'Doanh Thu Hoa',
            value: formatPrice(totalRevenue),
            subtext: `${completedCount} đơn hoàn thành`,
            icon: <ShoppingBag className="w-3.5 h-3.5" />,
            color: 'purple',
            onClick: () => setActiveTab('orders')
          },
          {
            id: 'arranging',
            title: 'Đơn Đang Xử Lý',
            value: arrangingCount,
            subtext: 'Đang cắm & chờ duyệt',
            icon: <Flower2 className="w-3.5 h-3.5" />,
            color: 'emerald',
            onClick: () => setActiveTab('orders')
          },
          {
            id: 'customers',
            title: 'Khách Hàng VIP',
            value: customers.length,
            subtext: 'Hội viên thân thiết',
            icon: <Users className="w-3.5 h-3.5" />,
            color: 'sky',
            onClick: () => setActiveTab('customers')
          },
          {
            id: 'products',
            title: 'Mẫu Hoa Thiết Kế',
            value: products.length,
            subtext: 'Mẫu hoa đang bán',
            icon: <Gift className="w-3.5 h-3.5" />,
            color: 'amber',
            onClick: () => setActiveTab('products')
          }
        ]}
      />

      {/* 2. SUBPAGE ROUTING */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <ManagementRecentOrders
            orders={orders}
            onViewAllOrders={() => setActiveTab('orders')}
            onViewOrderDetail={(id) => {
              setOrderSearchForSubpage(id);
              setActiveTab('orders');
            }}
            onViewBill={(ord) => setViewingBillOrder(ord)}
            onApproveDeposit={(id) => {
              approveOrderDeposit(id);
              showToast(`Đã duyệt cọc đơn #${id}!`);
            }}
            formatPrice={formatPrice}
          />

          <ManagementFunctionalGrid
            title="Danh Mục Chức Năng Quản Trị Hệ Thống"
            subtitle="Mô hình thẻ chức năng to như phototiinlove • Nhấp để mở phân hệ quản trị hoặc popup thao tác nhanh"
            groups={adminActionGroups}
          />
        </div>
      )}

      {activeTab === 'orders' && (
        <OrdersSubpage
          orders={orders}
          onBackToDashboard={() => setActiveTab('dashboard')}
          role="ADMIN"
          formatPrice={formatPrice}
          updateOrderStatus={updateOrderStatus}
          approveOrderDeposit={approveOrderDeposit}
          completeOrder={completeOrder}
          onViewBill={(ord) => setViewingBillOrder(ord)}
          onEditShipping={(ord) => setEditShippingOrder(ord)}
          initialSearch={orderSearchForSubpage}
        />
      )}

      {activeTab === 'products' && (
        <ProductsSubpage
          products={products}
          onBackToDashboard={() => setActiveTab('dashboard')}
          onOpenAddProduct={() => setIsAddProductOpen(true)}
          deleteProduct={deleteProduct}
          formatPrice={formatPrice}
        />
      )}

      {activeTab === 'customers' && (
        <CustomersSubpage
          customers={customers}
          onBackToDashboard={() => setActiveTab('dashboard')}
          formatPrice={formatPrice}
          getCustomerOrderHistory={getCustomerOrderHistory}
          onSelectCustomer={(cust) => setSelectedCustomer(cust)}
          onAdjustPoints={(cust) => setAdjustingCustomer(cust)}
          onResetPassword={(cust) => {
            const pass = adminResetCustomerPassword(cust.id);
            setTempPassModal({ customerName: cust.fullName, pass });
          }}
          onEditNotes={(cust) => setEditingCustomer(cust)}
          onDeleteCustomer={(id) => deleteCustomerByAdmin(id)}
        />
      )}

      {activeTab === 'vouchers' && (
        <PromotionsSubpage
          promotions={promotions}
          onBackToDashboard={() => setActiveTab('dashboard')}
          onOpenAddVoucher={() => setIsAddVoucherOpen(true)}
          updatePromotions={updatePromotions}
          formatPrice={formatPrice}
        />
      )}

      {(activeTab === 'channels' || activeTab === 'settings') && (
        <StoreConfigSubpage
          settings={settings}
          contactChannels={contactChannels}
          onBackToDashboard={() => setActiveTab('dashboard')}
          onSaveSettings={(s) => {
            updateSettings(s);
            showToast('Đã lưu cấu hình cửa hàng!', 'success');
          }}
          onToggleContactChannel={toggleContactChannel}
          onDeleteContactChannel={deleteContactChannel}
          onOpenAddChannel={() => setIsAddingChannel(true)}
        />
      )}

      {activeTab === 'security' && (
        <SecuritySubpage
          onBackToDashboard={() => setActiveTab('dashboard')}
          adminEmail={adminEmail}
          changeAdminCredentials={changeAdminCredentials}
          saveGmailConfig={saveGmailConfig}
          requestPinResetOtp={requestPinResetOtp}
          showToast={showToast}
        />
      )}

      {activeTab === 'cms' && (
        <CmsLiveviewSubpage
          onBackToDashboard={() => setActiveTab('dashboard')}
          heroConfig={heroConfig}
          categories={categories}
          promotions={promotions}
          articles={articles}
          updateHeroConfig={updateHeroConfig}
          updateCategories={updateCategories}
          updatePromotions={updatePromotions}
          updateArticles={updateArticles}
          showToast={showToast}
        />
      )}

      {activeTab === 'marquee' && (
        <MarqueeSubpage
          marqueeAnnouncements={marqueeAnnouncements}
          onBackToDashboard={() => setActiveTab('dashboard')}
          addMarqueeItem={addMarqueeItem}
          updateMarqueeItem={updateMarqueeItem}
          toggleMarqueeItem={toggleMarqueeItem}
          deleteMarqueeItem={deleteMarqueeItem}
          showToast={showToast}
        />
      )}

      {/* 3. MANAGEMENT DOCK (DESKTOP & MOBILE) */}
      <ManagementDock role="admin" />

      {/* 4. MODALS & POPUPS */}
      <SecurityModal
        isOpen={showSecurityModal}
        onClose={() => setShowSecurityModal(false)}
        roleTitle="Super Admin"
        onSaveCredentials={changeAdminCredentials}
        adminEmail={adminEmail}
        onSaveEmailConfig={saveGmailConfig}
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

      <EditShippingFeeModal
        order={editShippingOrder}
        onClose={() => setEditShippingOrder(null)}
        onSave={(id, fee) => {
          adjustOrderShippingFee(id, fee);
          showToast(`Đã cập nhật phí vận chuyển đơn #${id}!`, 'success');
        }}
      />

      <TempPasswordModal
        data={tempPassModal}
        onClose={() => setTempPassModal(null)}
        showToast={showToast}
      />

      <AddContactChannelModal
        isOpen={isAddingChannel}
        onClose={() => setIsAddingChannel(false)}
        onAddChannel={(channel) => {
          addContactChannel(channel);
          showToast(`Đã thêm kênh liên hệ ${channel.label}!`, 'success');
        }}
        showToast={showToast}
      />

      <AddVoucherModal
        isOpen={isAddVoucherOpen}
        onClose={() => setIsAddVoucherOpen(false)}
        onAddVoucher={(promo) => {
          updatePromotions([...promotions, promo]);
          showToast(`Đã thêm voucher ${promo.code}!`, 'success');
        }}
        formatPrice={formatPrice}
        showToast={showToast}
      />

      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onAddProduct={(prod) => {
          addProduct(prod);
          showToast(`Đã thêm mẫu hoa ${prod.name}!`, 'success');
        }}
        showToast={showToast}
      />

      <CustomerDetailModal
        customer={selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        orderHistory={selectedCustomer ? getCustomerOrderHistory(selectedCustomer.phone) : []}
        formatPrice={formatPrice}
      />

      <AdjustPointsModal
        customer={adjustingCustomer}
        onClose={() => setAdjustingCustomer(null)}
        onConfirm={(id, delta, reason) => {
          adjustCustomerPoints(id, delta, reason);
          showToast(`Đã điều chỉnh điểm cho khách hàng!`, 'success');
        }}
      />

      <EditCustomerNotesModal
        customer={editingCustomer}
        onClose={() => setEditingCustomer(null)}
        onSave={(id, favFlowers, notes) => {
          updateCustomerByAdmin(id, { favoriteFlowers: favFlowers, notes });
          showToast('Đã lưu ghi chú khách hàng!', 'success');
        }}
      />
    </div>
  );
};
