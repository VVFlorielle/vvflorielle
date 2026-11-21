import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { restoreScrollPosition, saveTabScroll, getTabScroll } from '../utils/scrollRestoration';
import { playNewOrderChime } from '../utils/audioNotification';
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
  LayoutTemplate,
  TrendingUp,
  Palette,
  HardDrive,
  Star
} from 'lucide-react';
import { CustomerUser, Order, OrderStatus, FlowerProduct, ContactChannel, PromotionItem } from '../types';
import { ManagementOverviewHero } from '../components/management/ManagementOverviewHero';
import { ManagementTabsBar } from '../components/management/ManagementTabsBar';
import { ManagementFunctionalGrid, ManagementActionGroup } from '../components/management/ManagementFunctionalGrid';
import { ManagementRecentOrders } from '../components/management/ManagementRecentOrders';
import { ManagementBottomDock } from '../components/management/ManagementBottomDock';
import { AdminLoginForm } from '../components/management/AdminLoginForm';
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
  ProductFormModal,
  BulkDiscountModal,
  AddProductModal,
  CustomerDetailModal,
  AdjustPointsModal,
  EditCustomerNotesModal,
  CustomerFormModal
} from '../components/management/ManagementModals';
import { StorageManagerModal } from '../components/management/StorageManagerModal';
import { BroadcastBannerModal } from '../components/management/BroadcastBannerModal';

// Subpages
import { OrdersSubpage } from '../components/management/subpages/OrdersSubpage';
import { ProductsSubpage } from '../components/management/subpages/ProductsSubpage';
import { CustomersSubpage } from '../components/management/subpages/CustomersSubpage';
import { PromotionsSubpage } from '../components/management/subpages/PromotionsSubpage';
import { StoreConfigSubpage } from '../components/management/subpages/StoreConfigSubpage';
import { BrandingSubpage } from '../components/management/subpages/BrandingSubpage';
import { SecuritySubpage } from '../components/management/subpages/SecuritySubpage';
import { CmsLiveviewSubpage } from '../components/management/subpages/CmsLiveviewSubpage';
import { MarqueeSubpage } from '../components/management/subpages/MarqueeSubpage';
import { RevenueSubpage } from '../components/management/subpages/RevenueSubpage';
import { ReviewsSubpage } from '../components/management/subpages/ReviewsSubpage';

export const AdminPortal: React.FC = () => {
  const {
    isAdmin,
    setCurrentView,
    logoutAdmin,
    adminEmail,
    changeAdminCredentials,
    saveGmailConfig,
    requestPinResetOtp,
    verifyPinResetOtp,
    orders,
    updateOrderStatus,
    acceptOrderAndRequestDeposit,
    rejectOrder,
    approveOrderDeposit,
    rejectOrderDeposit,
    adjustOrderShippingFee,
    completeOrder,
    syncBillToGoogleDrive,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    applyBulkDiscount,
    restoreOriginalPrices,
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
    addCustomerByAdmin,
    updateCustomerByAdmin,
    deleteCustomerByAdmin,
    adjustCustomerPoints,
    adminResetCustomerPassword,
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
    activeAdminTab: activeTab,
    setActiveAdminTab: setActiveTab,
    broadcastStoreAnnouncement,
    clearStoreAnnouncement,
    activeBannerNotification,
    reviews,
    showToast
  } = useStore();

  const pendingReviewsCount = (reviews || []).filter((r) => r.status === 'PENDING').length;

  // Scroll Restoration Engine (Phototiinlove battle-tested navigation)
  const navigateToTab = (tab: any) => {
    saveTabScroll(activeTab);
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const targetHash = tab === 'dashboard' ? '#admin' : `#admin/${tab}`;
      window.history.pushState({ adminTab: tab }, '', targetHash);
    }
    const savedY = getTabScroll(tab);
    if (savedY > 0) {
      restoreScrollPosition(savedY);
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const handleBackToDashboard = () => {
    saveTabScroll(activeTab);
    setActiveTab('dashboard');
    if (typeof window !== 'undefined') {
      window.history.pushState({ adminTab: 'dashboard' }, '', '#admin');
    }
    const dashboardY = getTabScroll('dashboard');
    restoreScrollPosition(dashboardY);
  };

  // Tự động khôi phục vị trí cuộn khi người dùng bấm nút Back trình duyệt / vuốt màn hình điện thoại
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      const hash = window.location.hash;
      let targetTab = 'dashboard';
      if (hash.startsWith('#admin/')) {
        targetTab = hash.replace('#admin/', '') || 'dashboard';
      } else if (e.state && e.state.adminTab) {
        targetTab = e.state.adminTab;
      }
      setActiveTab(targetTab);
      const targetY = getTabScroll(targetTab);
      restoreScrollPosition(targetY);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setActiveTab]);

  // Tự động phát chuông khi có đơn hàng mới phát sinh (Chuẩn Florist)
  const previousOrderCountRef = useRef(orders.length);
  useEffect(() => {
    if (orders.length > previousOrderCountRef.current) {
      playNewOrderChime();
    }
    previousOrderCountRef.current = orders.length;
  }, [orders.length]);

  const [orderSearchForSubpage, setOrderSearchForSubpage] = useState('');

  // Modals state
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showStorageModal, setShowStorageModal] = useState(false);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [showQuickVoucherModal, setShowQuickVoucherModal] = useState(false);
  const [showMascotModal, setShowMascotModal] = useState(false);
  const [viewingBillOrder, setViewingBillOrder] = useState<Order | null>(null);
  const [editShippingOrder, setEditShippingOrder] = useState<{ id: string; fee: number } | null>(null);
  const [tempPassModal, setTempPassModal] = useState<{ customerName: string; pass: string } | null>(null);
  const [isAddingChannel, setIsAddingChannel] = useState(false);
  const [editingChannel, setEditingChannel] = useState<ContactChannel | null>(null);
  const [isAddVoucherOpen, setIsAddVoucherOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<PromotionItem | null>(null);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<FlowerProduct | null>(null);
  const [isBulkDiscountOpen, setIsBulkDiscountOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerUser | null>(null);
  const [adjustingCustomer, setAdjustingCustomer] = useState<CustomerUser | null>(null);
  const [customerForEditForm, setCustomerForEditForm] = useState<CustomerUser | null>(null);
  const [isCustomerFormOpen, setIsCustomerFormOpen] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // KPIs
  const totalRevenue = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const arrangingCount = orders.filter((o) => o.status === 'ARRANGING' || o.status === 'PENDING').length;
  const completedCount = orders.filter((o) => o.status === 'COMPLETED').length;
  const pendingDepositOrders = (orders || []).filter(
    (o) => !o.isDepositPaid && (o.status === 'WAITING_DEPOSIT' || o.status === 'PENDING')
  ).length;

  // Customer order history helper
  const getCustomerOrderHistory = (custPhone: string) => {
    return orders.filter((o) => o.senderPhone === custPhone || o.recipientPhone === custPhone);
  };

  // If NOT ADMIN, render unified smart login form
  if (!isAdmin) {
    return <AdminLoginForm />;
  }

  // 4 ACTION GROUPS CHUẨN HÓA THEO CẤU TRÚC VẬN HÀNH TIỆM HOA
  const adminActionGroups: ManagementActionGroup[] = [
    {
      groupId: 'operations',
      groupTitle: 'Vận Hành & Doanh Thu',
      groupIcon: <img src="/icons/icon-orders-3d.png" alt="Vận hành" className="w-4 h-4 object-contain shrink-0 drop-shadow-xs" />,
      items: [
        {
          id: 'action-pricing-modal',
          title: 'Bảng giá dịch vụ',
          description: 'Cập nhật loại hoa, giá bán công khai và quy cách hiển thị bảng giá.',
          icon: <img src="/icons/icon-pricing-3d.png" alt="Bảng giá" className="w-4 h-4 object-contain drop-shadow-xs" />,
          actionType: 'modal',
          actionLabel: 'Mở popup',
          onClick: () => setIsBulkDiscountOpen(true)
        },
        {
          id: 'action-orders',
          title: 'Quản lý đơn hàng',
          description: 'Xem toàn bộ đơn, duyệt trạng thái và phân công giao hoa hỏa tốc.',
          icon: <img src="/icons/icon-orders-3d.png" alt="Đơn hàng" className="w-4 h-4 object-contain drop-shadow-xs" />,
          actionType: 'page',
          actionLabel: 'Truy cập',
          onClick: () => navigateToTab('orders')
        },
        {
          id: 'action-vouchers',
          title: 'Quản lý Voucher',
          description: 'Quản lý loại voucher, điểm đổi, giá trị và thời hạn áp dụng.',
          icon: <img src="/icons/icon-gift-3d.png" alt="Voucher" className="w-4 h-4 object-contain drop-shadow-xs" />,
          actionType: 'page',
          actionLabel: 'Truy cập',
          onClick: () => navigateToTab('vouchers')
        },
        {
          id: 'action-quick-voucher',
          title: 'Tạo nhanh Voucher dịp lễ',
          description: 'Bật popup tạo mã giảm giá ưu đãi ngày lễ chỉ trong 30 giây.',
          icon: <Sparkles className="w-4 h-4" />,
          actionType: 'modal',
          actionLabel: 'Mở popup',
          onClick: () => setShowQuickVoucherModal(true)
        },
        {
          id: 'action-revenue',
          title: 'Doanh thu & Thống kê',
          description: 'Xem dòng tiền thực tế, đối soát chuyển khoản và xuất Excel.',
          icon: <TrendingUp className="w-4 h-4" />,
          actionType: 'page',
          actionLabel: 'Truy cập',
          onClick: () => navigateToTab('revenue')
        },
        {
          id: 'action-shipping-modal',
          title: 'Cấu hình cước phí 4 bậc',
          description: 'Thiết lập cước phí theo km (0-25km), ngưỡng freeship và cam kết hỏa tốc.',
          icon: <img src="/icons/icon-truck-3d.png" alt="Vận chuyển" className="w-4 h-4 object-contain drop-shadow-xs" />,
          actionType: 'modal',
          actionLabel: 'Mở popup',
          onClick: () => setShowShippingModal(true)
        }
      ]
    },
    {
      groupId: 'customers',
      groupTitle: 'Khách Hàng & Nhân Sự',
      groupIcon: <img src="/icons/icon-contact-3d.png" alt="Khách hàng" className="w-4 h-4 object-contain shrink-0 drop-shadow-xs" />,
      items: [
        {
          id: 'action-customers',
          title: 'Khách hàng',
          description: 'Xem và hỗ trợ tài khoản khách, lịch sử đặt hoa và điểm tích lũy.',
          icon: <img src="/icons/icon-user-3d.png" alt="Khách hàng" className="w-4 h-4 object-contain drop-shadow-xs" />,
          actionType: 'page',
          actionLabel: 'Truy cập',
          onClick: () => navigateToTab('customers')
        },
        {
          id: 'action-staff',
          title: 'Tài khoản nhân viên',
          description: 'Quản lý tài khoản cắm hoa, điều phối đơn và phân công trực tiệm.',
          icon: <img src="/icons/icon-user-3d.png" alt="Nhân viên" className="w-4 h-4 object-contain drop-shadow-xs" />,
          actionType: 'page',
          actionLabel: 'Truy cập',
          onClick: () => navigateToTab('security')
        },
        {
          id: 'action-channels',
          title: 'Kênh CSKH & Hotline',
          description: 'Quản lý các nút liên hệ Hotline, chat Zalo, Messenger và Google Maps.',
          icon: <Share2 className="w-4 h-4" />,
          actionType: 'page',
          actionLabel: 'Truy cập',
          onClick: () => navigateToTab('channels')
        },
        {
          id: 'action-reviews',
          title: 'Quản lý Đánh Giá & Vote Sao',
          description: 'Kiểm duyệt cảm nhận của khách, duyệt hiển thị trang chủ, ghim nổi bật và phản hồi.',
          icon: <Star className="w-4 h-4 text-amber-500 fill-amber-500" />,
          actionType: 'page',
          actionLabel: 'Truy cập',
          badge: pendingReviewsCount > 0 ? `${pendingReviewsCount} Chờ duyệt` : undefined,
          badgeColor: 'amber',
          onClick: () => navigateToTab('reviews')
        }
      ]
    },
    {
      groupId: 'website',
      groupTitle: 'Giao Diện & Website',
      groupIcon: <img src="/icons/icon-cms-3d.png" alt="Giao diện" className="w-4 h-4 object-contain shrink-0 drop-shadow-xs" />,
      items: [
        {
          id: 'action-cms-liveview',
          title: 'Trình Quản Lý Giao Diện Website',
          description: 'Tùy biến nội dung, banner, cẩm nang và bố cục hiển thị trực tiếp trên web.',
          icon: <LayoutTemplate className="w-4 h-4" />,
          actionType: 'page',
          actionLabel: 'Truy cập',
          onClick: () => navigateToTab('cms')
        },
        {
          id: 'action-branding',
          title: 'Branding & Hệ Màu Sắc',
          description: 'Quản lý Logo chính, Favicon tab trình duyệt, hệ màu tiệm hoa và font chữ.',
          icon: <Palette className="w-4 h-4" />,
          actionType: 'page',
          actionLabel: 'Truy cập',
          onClick: () => navigateToTab('branding')
        },
        {
          id: 'action-mascot-modal',
          title: 'Quản Lý Linh Vật',
          description: 'Bật popup xem và đổi tức thì linh vật hoạt họa trợ lý ảo Flori của tiệm.',
          icon: <Sparkles className="w-4 h-4" />,
          actionType: 'modal',
          actionLabel: 'Mở popup',
          onClick: () => setShowMascotModal(true)
        },
        {
          id: 'action-marquee',
          title: 'Bảng tin chạy chữ đỉnh trang',
          description: 'Soạn thảo thông báo khuyến mãi và cam kết hoa tươi chạy mượt đầu website.',
          icon: <Megaphone className="w-4 h-4" />,
          actionType: 'page',
          actionLabel: 'Truy cập',
          onClick: () => navigateToTab('marquee')
        },
        {
          id: 'action-broadcast-banner',
          title: 'Phát Thông Báo Khẩn Cấp Toàn Web',
          description: 'Cảnh báo thời tiết bão, tiệm quá tải đơn hoặc sự kiện x2 điểm chạy banner khẩn cấp toàn web.',
          icon: <Megaphone className="w-4 h-4 text-rose-600" />,
          actionType: 'modal',
          actionLabel: 'Phát sóng',
          onClick: () => setShowBroadcastModal(true)
        },
        {
          id: 'action-settings',
          title: 'Địa Chỉ, Hotline & Giờ Mở Cửa',
          description: 'Cập nhật địa chỉ tiệm, số điện thoại Hotline, Zalo, Email và khung giờ mở cửa toàn hệ thống.',
          icon: <Settings className="w-4 h-4" />,
          actionType: 'page',
          actionLabel: 'Truy cập',
          onClick: () => navigateToTab('settings')
        }
      ]
    },
    {
      groupId: 'security',
      groupTitle: 'Bảo Mật Hệ Thống',
      groupIcon: <img src="/icons/icon-settings-3d.png" alt="Bảo mật" className="w-4 h-4 object-contain shrink-0 drop-shadow-xs" />,
      items: [
        {
          id: 'action-security-modal',
          title: 'Đổi mật khẩu & PIN 6 số',
          description: 'Bật popup đổi mật khẩu quản trị, mã PIN xác nhận và Gmail khôi phục OTP.',
          icon: <KeyRound className="w-4 h-4" />,
          actionType: 'modal',
          actionLabel: 'Mở popup',
          onClick: () => setShowSecurityModal(true)
        },
        {
          id: 'action-security-subpage',
          title: 'Bảo Mật Hệ Thống & STK Ngân Hàng',
          description: 'Cấu hình bảo vệ tài khoản nhận tiền VietQR, đổi mật khẩu và mã PIN 6 số.',
          icon: <img src="/icons/icon-shield-3d.png" alt="Bảo mật" className="w-4 h-4 object-contain drop-shadow-xs" />,
          actionType: 'page',
          actionLabel: 'Truy cập',
          onClick: () => navigateToTab('security')
        },
        {
          id: 'action-storage-manager',
          title: 'Kho Ảnh Bill & Đồng Bộ Google Drive',
          description: 'Theo dõi dung lượng lưu trữ web (< 2MB), chu kỳ 5-10 ngày tự động dọn dẹp và sao lưu biên lai lên Google Drive.',
          icon: <HardDrive className="w-4 h-4 text-indigo-600" />,
          actionType: 'modal',
          actionLabel: 'Mở Quản Lý',
          onClick: () => setShowStorageModal(true)
        }
      ]
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 pt-4 pb-14 sm:pb-16 space-y-6 select-none">
      {/* 1. TOP OVERVIEW HERO BANNER (Chỉ hiển thị tại Dashboard Tổng Quan giống PhotoTiinLove, không đè lên CMS và trang con) */}
      {(activeTab === 'dashboard' || activeTab === 'pricing') && (
        <ManagementOverviewHero
          tag="Thông Tin Quản Trị"
          tagIcon={<img src="/icons/icon-shield-3d.png" alt="Bảo mật" className="w-3.5 h-3.5 object-contain" />}
          statusBadge="Hệ thống vận hành ổn định"
          stats={[
            {
              id: 'revenue',
              title: 'Doanh Thu Hoa',
              value: formatPrice(totalRevenue),
              subtext: `${completedCount} đơn hoàn thành`,
              icon: <TrendingUp className="w-3.5 h-3.5 text-purple-700" />,
              color: 'purple',
              onClick: () => navigateToTab('revenue')
            },
            {
              id: 'arranging',
              title: 'Đơn Đang Xử Lý',
              value: arrangingCount,
              subtext: 'Đang cắm & chờ duyệt',
              icon: <img src="/icons/icon-catalog-3d.png" alt="Cắm hoa" className="w-3.5 h-3.5 object-contain" />,
              color: 'emerald',
              onClick: () => navigateToTab('orders')
            },
            {
              id: 'customers',
              title: 'Khách Hàng VIP',
              value: customers.length,
              subtext: 'Hội viên thân thiết',
              icon: <Users className="w-3.5 h-3.5" />,
              color: 'sky',
              onClick: () => navigateToTab('customers')
            },
            {
              id: 'products',
              title: 'Mẫu Hoa Thiết Kế',
              value: products.length,
              subtext: 'Mẫu hoa đang bán',
              icon: <Gift className="w-3.5 h-3.5" />,
              color: 'amber',
              onClick: () => navigateToTab('products')
            }
          ]}
        />
      )}

      {/* 2. SUBPAGE ROUTING */}
      {(activeTab === 'dashboard' || activeTab === 'pricing') && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <ManagementRecentOrders
            orders={orders}
            onViewAllOrders={() => navigateToTab('orders')}
            onViewOrderDetail={(id) => {
              setOrderSearchForSubpage(id);
              navigateToTab('orders');
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
            subtitle="Phân nhóm quản trị chuẩn hóa theo quy trình vận hành tiệm hoa"
            groups={adminActionGroups}
          />
        </div>
      )}

      {activeTab === 'orders' && (
        <OrdersSubpage
          orders={orders}
          onBackToDashboard={handleBackToDashboard}
          role="ADMIN"
          formatPrice={formatPrice}
          updateOrderStatus={updateOrderStatus}
          acceptOrderAndRequestDeposit={acceptOrderAndRequestDeposit}
          rejectOrder={rejectOrder}
          approveOrderDeposit={approveOrderDeposit}
          rejectOrderDeposit={rejectOrderDeposit}
          completeOrder={completeOrder}
          onViewBill={(ord) => setViewingBillOrder(ord)}
          onEditShipping={(ord) => setEditShippingOrder(ord)}
          initialSearch={orderSearchForSubpage}
          onOpenStorageManager={() => setShowStorageModal(true)}
        />
      )}

      {activeTab === 'products' && (
        <ProductsSubpage
          products={products}
          categories={categories}
          onBackToDashboard={handleBackToDashboard}
          onOpenAddProduct={() => {
            setEditingProduct(null);
            setIsProductFormOpen(true);
          }}
          onOpenEditProduct={(prod) => {
            setEditingProduct(prod);
            setIsProductFormOpen(true);
          }}
          onOpenBulkDiscount={() => setIsBulkDiscountOpen(true)}
          deleteProduct={deleteProduct}
          formatPrice={formatPrice}
        />
      )}

      {activeTab === 'revenue' && (
        <RevenueSubpage
          orders={orders}
          customers={customers}
          onBackToDashboard={handleBackToDashboard}
          formatPrice={formatPrice}
          showToast={showToast}
        />
      )}

      {activeTab === 'customers' && (
        <CustomersSubpage
          customers={customers}
          onBackToDashboard={handleBackToDashboard}
          formatPrice={formatPrice}
          getCustomerOrderHistory={getCustomerOrderHistory}
          onSelectCustomer={(cust) => setSelectedCustomer(cust)}
          onAdjustPoints={(cust) => setAdjustingCustomer(cust)}
          onResetPassword={(cust) => {
            const pass = adminResetCustomerPassword(cust.id);
            setTempPassModal({ customerName: cust.fullName, pass });
          }}
          onEditNotes={(cust) => {
            setCustomerForEditForm(cust);
            setIsCustomerFormOpen(true);
          }}
          onEditCustomer={(cust) => {
            setCustomerForEditForm(cust);
            setIsCustomerFormOpen(true);
          }}
          onOpenAddCustomer={() => {
            setCustomerForEditForm(null);
            setIsCustomerFormOpen(true);
          }}
          onDeleteCustomer={(id) => deleteCustomerByAdmin(id)}
          onToggleBlockCustomer={(cust) => {
            const nextStatus = cust.status === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED';
            updateCustomerByAdmin(cust.id, { status: nextStatus });
            showToast(`Đã ${nextStatus === 'BLOCKED' ? 'tạm khóa' : 'mở khóa'} tài khoản "${cust.fullName}"`, 'info');
          }}
        />
      )}

      {activeTab === 'reviews' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleBackToDashboard}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>← Trở về Bàn Làm Việc</span>
            </button>
          </div>
          <ReviewsSubpage />
        </div>
      )}

      {activeTab === 'vouchers' && (
        <PromotionsSubpage
          promotions={promotions}
          onBackToDashboard={handleBackToDashboard}
          onOpenAddVoucher={() => {
            setEditingVoucher(null);
            setIsAddVoucherOpen(true);
          }}
          onOpenEditVoucher={(promo) => {
            setEditingVoucher(promo);
            setIsAddVoucherOpen(true);
          }}
          updatePromotions={updatePromotions}
          formatPrice={formatPrice}
        />
      )}

      {(activeTab === 'channels' || activeTab === 'settings') && (
        <StoreConfigSubpage
          settings={settings}
          contactChannels={contactChannels}
          onBackToDashboard={handleBackToDashboard}
          onSaveSettings={(s) => {
            updateSettings(s);
            showToast('Đã lưu cấu hình cửa hàng!', 'success');
          }}
          onToggleContactChannel={toggleContactChannel}
          onDeleteContactChannel={deleteContactChannel}
          onOpenAddChannel={() => {
            setEditingChannel(null);
            setIsAddingChannel(true);
          }}
          onOpenEditChannel={(channel) => {
            setEditingChannel(channel);
            setIsAddingChannel(true);
          }}
        />
      )}

      {activeTab === 'security' && (
        <SecuritySubpage
          onBackToDashboard={handleBackToDashboard}
          adminEmail={adminEmail}
          changeAdminCredentials={changeAdminCredentials}
          saveGmailConfig={saveGmailConfig}
          requestPinResetOtp={requestPinResetOtp}
          showToast={showToast}
          settings={settings}
          updateSettings={updateSettings}
        />
      )}

      {activeTab === 'cms' && (
        <CmsLiveviewSubpage
          onBackToDashboard={handleBackToDashboard}
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

      {activeTab === 'branding' && (
        <BrandingSubpage
          onBackToDashboard={handleBackToDashboard}
          showToast={showToast}
        />
      )}

      {activeTab === 'marquee' && (
        <MarqueeSubpage
          marqueeAnnouncements={marqueeAnnouncements}
          onBackToDashboard={handleBackToDashboard}
          addMarqueeItem={addMarqueeItem}
          updateMarqueeItem={updateMarqueeItem}
          toggleMarqueeItem={toggleMarqueeItem}
          deleteMarqueeItem={deleteMarqueeItem}
          showToast={showToast}
        />
      )}

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
        onRejectDeposit={(orderId, reason) => {
          rejectOrderDeposit(orderId, reason);
        }}
        onSyncBillToDrive={async (orderId) => {
          const res = await syncBillToGoogleDrive(orderId);
          return { success: res.success, driveUrl: res.url, error: res.error };
        }}
        isDriveConfigured={Boolean(settings.googleDriveWebhookUrl)}
      />

      <StorageManagerModal
        isOpen={showStorageModal}
        onClose={() => setShowStorageModal(false)}
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
        channelToEdit={editingChannel}
        onClose={() => {
          setIsAddingChannel(false);
          setEditingChannel(null);
        }}
        onAddChannel={(channel) => {
          addContactChannel(channel);
          showToast(`Đã thêm kênh liên hệ ${channel.label}!`, 'success');
        }}
        onUpdateChannel={(id, updates) => {
          updateContactChannel(id, updates);
        }}
        showToast={showToast}
      />

      <AddVoucherModal
        isOpen={isAddVoucherOpen}
        voucherToEdit={editingVoucher}
        onClose={() => {
          setIsAddVoucherOpen(false);
          setEditingVoucher(null);
        }}
        onAddVoucher={(promo) => {
          updatePromotions([...promotions, promo]);
          showToast(`Đã thêm voucher ${promo.code}!`, 'success');
        }}
        onSaveVoucher={(updatedPromo) => {
          updatePromotions(promotions.map(p => p.id === updatedPromo.id ? updatedPromo : p));
          showToast(`Đã cập nhật voucher ${updatedPromo.code}!`, 'success');
        }}
        formatPrice={formatPrice}
        showToast={showToast}
      />

      <ProductFormModal
        isOpen={isProductFormOpen}
        onClose={() => {
          setIsProductFormOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        onSaveProduct={(prod) => {
          if (editingProduct) {
            updateProduct(prod.id, prod);
          } else {
            addProduct(prod);
          }
        }}
        showToast={showToast}
        categories={categories}
      />

      <BulkDiscountModal
        isOpen={isBulkDiscountOpen || activeTab === 'pricing'}
        onClose={() => {
          setIsBulkDiscountOpen(false);
          if (activeTab === 'pricing') handleBackToDashboard();
        }}
        categories={categories}
        products={products}
        onApplyDiscount={(pct, cat, evt) => applyBulkDiscount(pct, cat, evt)}
        onRestorePrices={(cat) => restoreOriginalPrices(cat)}
        showToast={showToast}
      />

      <CustomerFormModal
        isOpen={isCustomerFormOpen}
        onClose={() => {
          setIsCustomerFormOpen(false);
          setCustomerForEditForm(null);
        }}
        customerToEdit={customerForEditForm}
        onSave={(data) => {
          if (customerForEditForm) {
            updateCustomerByAdmin(customerForEditForm.id, data);
            showToast(`Đã cập nhật thông tin khách hàng ${data.fullName || ''}!`, 'success');
          } else {
            addCustomerByAdmin(data);
            showToast(`Đã thêm khách hàng mới ${data.fullName || ''}!`, 'success');
          }
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

      <BroadcastBannerModal
        isOpen={showBroadcastModal}
        onClose={() => setShowBroadcastModal(false)}
        currentAnnouncement={activeBannerNotification?.message || activeBannerNotification?.title}
        onBroadcast={(title, msg, type) => {
          broadcastStoreAnnouncement(title, msg, type);
          showToast('Đã phát sóng thông báo khẩn cấp tới toàn bộ khách hàng!', 'success');
        }}
        onClearAnnouncement={() => {
          clearStoreAnnouncement();
          showToast('Đã gỡ thông báo khẩn cấp!', 'info');
        }}
      />
    </div>
  );
};
