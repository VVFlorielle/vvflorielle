import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { restoreScrollPosition, saveTabScroll, getTabScroll } from '../utils/scrollRestoration';
import { playNewOrderChime } from '../utils/audioNotification';
import {
  Flower2,
  AlertCircle,
  Truck,
  Sparkles,
  ShoppingBag,
  Users,
  Gift,
  ShieldCheck,
  TrendingUp,
  Settings,
  Share2,
  Megaphone,
  LayoutTemplate,
  KeyRound,
  Palette,
  HardDrive,
  Star,
  ArrowLeft
} from 'lucide-react';
import { CustomerUser, Order, FlowerProduct, PromotionItem, ContactChannel } from '../types';
import { ManagementOverviewHero } from '../components/management/ManagementOverviewHero';
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
  CustomerDetailModal,
  AdjustPointsModal,
  CustomerFormModal
} from '../components/management/ManagementModals';
import { StorageManagerModal } from '../components/management/StorageManagerModal';
import { BroadcastBannerModal } from '../components/management/BroadcastBannerModal';

// Subpages
import { OrdersSubpage } from '../components/management/subpages/OrdersSubpage';
import { ProductsSubpage } from '../components/management/subpages/ProductsSubpage';
import { CustomersSubpage } from '../components/management/subpages/CustomersSubpage';
import { PromotionsSubpage } from '../components/management/subpages/PromotionsSubpage';
import { RevenueSubpage } from '../components/management/subpages/RevenueSubpage';
import { StoreConfigSubpage } from '../components/management/subpages/StoreConfigSubpage';
import { BrandingSubpage } from '../components/management/subpages/BrandingSubpage';
import { SecuritySubpage } from '../components/management/subpages/SecuritySubpage';
import { CmsLiveviewSubpage } from '../components/management/subpages/CmsLiveviewSubpage';
import { MarqueeSubpage } from '../components/management/subpages/MarqueeSubpage';
import { ReviewsSubpage } from '../components/management/subpages/ReviewsSubpage';

export const OwnerPortal: React.FC = () => {
  const {
    isAdmin,
    setCurrentView,
    orders,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    applyBulkDiscount,
    restoreOriginalPrices,
    categories,
    updateOrderStatus,
    acceptOrderAndRequestDeposit,
    rejectOrder,
    approveOrderDeposit,
    rejectOrderDeposit,
    adjustOrderShippingFee,
    completeOrder,
    syncBillToGoogleDrive,
    customers,
    addCustomerByAdmin,
    promotions,
    updatePromotions,
    showToast,
    changeAdminCredentials,
    adminEmail,
    saveGmailConfig,
    requestPinResetOtp,
    contactChannels,
    toggleContactChannel,
    deleteContactChannel,
    addContactChannel,
    updateContactChannel,
    marqueeAnnouncements,
    addMarqueeItem,
    updateMarqueeItem,
    toggleMarqueeItem,
    deleteMarqueeItem,
    heroConfig,
    updateHeroConfig,
    updateCategories,
    updateArticles,
    articles,
    settings,
    updateSettings,
    updateCustomerByAdmin,
    deleteCustomerByAdmin,
    adjustCustomerPoints,
    adminResetCustomerPassword,
    logoutAdmin,
    broadcastStoreAnnouncement,
    clearStoreAnnouncement,
    activeBannerNotification,
    activeAdminTab: activeTab,
    setActiveAdminTab: setActiveTab,
    reviews
  } = useStore();

  const pendingReviewsCount = (reviews || []).filter((r) => r.status === 'PENDING').length;

  // Scroll Restoration Engine (Phototiinlove battle-tested navigation)
  const navigateToTab = (tab: any) => {
    saveTabScroll(activeTab);
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const targetHash = tab === 'dashboard' ? '#owner' : `#owner/${tab}`;
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
      window.history.pushState({ adminTab: 'dashboard' }, '', '#owner');
    }
    const dashboardY = getTabScroll('dashboard');
    restoreScrollPosition(dashboardY);
  };

  // Tự động khôi phục vị trí cuộn khi người dùng bấm nút Back trình duyệt / vuốt màn hình điện thoại
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      const hash = window.location.hash;
      let targetTab = 'dashboard';
      if (hash.startsWith('#owner/')) {
        targetTab = hash.replace('#owner/', '') || 'dashboard';
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

  // Helper formatting
  const formatPrice = (val: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  // Stats calculation
  const pendingDepositOrders = (orders || []).filter(
    (o) => !o.isDepositPaid && (o.status === 'WAITING_DEPOSIT' || o.status === 'PENDING')
  );
  const arrangingOrders = orders.filter((o) => o.status === 'ARRANGING');
  const shippingOrders = orders.filter((o) => o.status === 'SHIPPING');
  const completedOrders = orders.filter((o) => o.status === 'COMPLETED');
  const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.flowerPrice || o.totalAmount), 0);

  // Customer order history helper
  const getCustomerOrderHistory = (custPhone: string) => {
    return orders.filter((o) => o.senderPhone === custPhone || o.recipientPhone === custPhone);
  };

  // 4 ACTION GROUPS CHUẨN HÓA THEO CẤU TRÚC VẬN HÀNH TIỆM HOA (ĐỒNG BỘ 100% QUYỀN HẠN)
  const ownerActionGroups: ManagementActionGroup[] = [
    {
      groupId: 'operations',
      groupTitle: 'Vận Hành & Doanh Thu',
      groupIcon: <img src="/icons/icon-orders-3d.png" alt="Vận hành" className="w-4 h-4 object-contain shrink-0 drop-shadow-xs" />,
      items: [
        {
          id: 'owner-pricing',
          title: 'Bảng giá dịch vụ',
          description: 'Cập nhật loại hoa, giá bán công khai và quy cách hiển thị bảng giá.',
          icon: <img src="/icons/icon-pricing-3d.png" alt="Bảng giá" className="w-4 h-4 object-contain drop-shadow-xs" />,
          actionType: 'modal',
          actionLabel: 'Mở popup',
          onClick: () => setIsBulkDiscountOpen(true)
        },
        {
          id: 'owner-orders',
          title: 'Quản lý đơn hàng',
          description: 'Duyệt cọc 50%, phân công cắm hoa và vận chuyển hỏa tốc trong ngày.',
          icon: <img src="/icons/icon-orders-3d.png" alt="Đơn hàng" className="w-4 h-4 object-contain drop-shadow-xs" />,
          actionType: 'page',
          actionLabel: 'Truy cập',
          onClick: () => navigateToTab('orders')
        },
        {
          id: 'owner-vouchers',
          title: 'Quản lý Voucher',
          description: 'Quản lý loại voucher, điểm đổi, giá trị và thời hạn áp dụng.',
          icon: <img src="/icons/icon-gift-3d.png" alt="Voucher" className="w-4 h-4 object-contain drop-shadow-xs" />,
          actionType: 'page',
          actionLabel: 'Truy cập',
          onClick: () => navigateToTab('vouchers')
        },
        {
          id: 'owner-quick-voucher',
          title: 'Tạo nhanh Voucher dịp lễ',
          description: 'Bật popup tạo mã giảm giá ưu đãi ngày lễ chỉ trong 30 giây.',
          icon: <Sparkles className="w-4 h-4" />,
          actionType: 'modal',
          actionLabel: 'Mở popup',
          onClick: () => setShowQuickVoucherModal(true)
        },
        {
          id: 'owner-revenue',
          title: 'Doanh thu & Thống kê',
          description: 'Theo dõi dòng tiền thực tế, đối soát chuyển khoản và xuất Excel.',
          icon: <TrendingUp className="w-4 h-4" />,
          actionType: 'page',
          actionLabel: 'Truy cập',
          onClick: () => navigateToTab('revenue')
        },
        {
          id: 'owner-shipping',
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
          id: 'owner-customers',
          title: 'Khách hàng',
          description: 'Xem và hỗ trợ tài khoản khách, lịch sử đặt hoa và điểm tích lũy.',
          icon: <img src="/icons/icon-user-3d.png" alt="Khách hàng" className="w-4 h-4 object-contain drop-shadow-xs" />,
          actionType: 'page',
          actionLabel: 'Truy cập',
          onClick: () => navigateToTab('customers')
        },
        {
          id: 'owner-staff',
          title: 'Tài khoản nhân viên',
          description: 'Quản lý tài khoản cắm hoa, điều phối đơn và phân công trực tiệm.',
          icon: <img src="/icons/icon-user-3d.png" alt="Nhân viên" className="w-4 h-4 object-contain drop-shadow-xs" />,
          actionType: 'page',
          actionLabel: 'Truy cập',
          onClick: () => navigateToTab('security')
        },
        {
          id: 'owner-channels',
          title: 'Kênh CSKH & Hotline',
          description: 'Quản lý các nút liên hệ Hotline, chat Zalo, Messenger và Google Maps.',
          icon: <Share2 className="w-4 h-4" />,
          actionType: 'page',
          actionLabel: 'Truy cập',
          onClick: () => navigateToTab('channels')
        },
        {
          id: 'owner-reviews',
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
          id: 'owner-cms',
          title: 'Trình Quản Lý Giao Diện Website',
          description: 'Tùy biến nội dung, banner, cẩm nang và bố cục hiển thị trực tiếp trên web.',
          icon: <LayoutTemplate className="w-4 h-4" />,
          actionType: 'page',
          actionLabel: 'Truy cập',
          onClick: () => navigateToTab('cms')
        },
        {
          id: 'owner-branding',
          title: 'Branding & Hệ Màu Sắc',
          description: 'Quản lý Logo chính, Favicon tab trình duyệt, hệ màu tiệm hoa và font chữ.',
          icon: <Palette className="w-4 h-4" />,
          actionType: 'page',
          actionLabel: 'Truy cập',
          onClick: () => navigateToTab('branding')
        },
        {
          id: 'owner-mascot',
          title: 'Quản Lý Linh Vật',
          description: 'Bật popup xem và đổi tức thì linh vật hoạt họa trợ lý ảo Flori của tiệm.',
          icon: <Sparkles className="w-4 h-4" />,
          actionType: 'modal',
          actionLabel: 'Mở popup',
          onClick: () => setShowMascotModal(true)
        },
        {
          id: 'owner-marquee',
          title: 'Bảng tin chạy chữ đỉnh trang',
          description: 'Soạn thảo thông báo khuyến mãi và cam kết hoa tươi chạy mượt đầu website.',
          icon: <Megaphone className="w-4 h-4" />,
          actionType: 'page',
          actionLabel: 'Truy cập',
          onClick: () => navigateToTab('marquee')
        },
        {
          id: 'owner-broadcast-banner',
          title: 'Phát Thông Báo Khẩn Cấp Toàn Web',
          description: 'Cảnh báo thời tiết bão, tiệm quá tải đơn hoặc sự kiện x2 điểm chạy banner khẩn cấp toàn web.',
          icon: <Megaphone className="w-4 h-4 text-rose-600" />,
          actionType: 'modal',
          actionLabel: 'Phát sóng',
          onClick: () => setShowBroadcastModal(true)
        },
        {
          id: 'owner-settings',
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
          id: 'owner-security-modal',
          title: 'Đổi mật khẩu & PIN 6 số',
          description: 'Bật popup cập nhật mật khẩu đăng nhập chủ tiệm và mã PIN thao tác an toàn.',
          icon: <KeyRound className="w-4 h-4" />,
          actionType: 'modal',
          actionLabel: 'Mở popup',
          onClick: () => setShowSecurityModal(true)
        },
        {
          id: 'owner-security-subpage',
          title: 'Bảo Mật Hệ Thống & STK Ngân Hàng',
          description: 'Cấu hình bảo vệ tài khoản nhận tiền VietQR, đổi mật khẩu và mã PIN 6 số.',
          icon: <img src="/icons/icon-shield-3d.png" alt="Bảo mật" className="w-4 h-4 object-contain drop-shadow-xs" />,
          actionType: 'page',
          actionLabel: 'Truy cập',
          onClick: () => navigateToTab('security')
        },
        {
          id: 'owner-storage-manager',
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

  if (!isAdmin) {
    return <AdminLoginForm />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 pt-4 pb-14 sm:pb-16 space-y-6 select-none">
      {/* 1. TOP GREETING & 4 KPIS HERO (Chỉ hiển thị tại Dashboard Tổng Quan giống PhotoTiinLove, không đè lên CMS và trang con) */}
      {(activeTab === 'dashboard' || activeTab === 'pricing') && (
        <ManagementOverviewHero
          tag="Thông Tin Quản Trị"
          tagIcon={<img src="/icons/icon-catalog-3d.png" alt="Hoa" className="w-3.5 h-3.5 object-contain" />}
          statusBadge="Hệ thống vận hành ổn định"
          stats={[
            {
              id: 'deposit',
              title: 'Đơn Cần Duyệt Cọc',
              value: pendingDepositOrders.length,
              subtext: pendingDepositOrders.length > 0 ? '⚡ Cần xác nhận bill cọc 50%' : 'Đã duyệt hết',
              icon: <AlertCircle className="w-4 h-4 text-amber-700" />,
              color: 'amber',
              onClick: () => navigateToTab('orders')
            },
            {
              id: 'arranging',
              title: 'Đang Cắm Hoa',
              value: arrangingOrders.length,
              subtext: 'Florist đang hoàn thiện',
              icon: <img src="/icons/icon-catalog-3d.png" alt="Cắm hoa" className="w-4 h-4 object-contain" />,
              color: 'emerald',
              onClick: () => navigateToTab('orders')
            },
            {
              id: 'shipping',
              title: 'Đang Giao Hỏa Tốc',
              value: shippingOrders.length,
              subtext: 'Shipper đang trên đường',
              icon: <Truck className="w-4 h-4 text-sky-700" />,
              color: 'sky',
              onClick: () => navigateToTab('orders')
            },
            {
              id: 'revenue',
              title: 'Doanh Thu Hoàn Tất',
              value: formatPrice(totalRevenue),
              subtext: `${completedOrders.length} đơn hoàn thành`,
              icon: <TrendingUp className="w-4 h-4 text-purple-700" />,
              color: 'purple',
              onClick: () => navigateToTab('revenue')
            }
          ]}
        />
      )}

      {/* 2. SUBPAGE ROUTING & DASHBOARD */}
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
              showToast(`Đã duyệt cọc đơn #${id}!`, 'success');
            }}
            formatPrice={formatPrice}
          />

          <ManagementFunctionalGrid
            title="Danh Mục Chức Năng Quản Trị Hệ Thống"
            subtitle="Phân nhóm quản trị chuẩn hóa theo quy trình vận hành tiệm hoa"
            groups={ownerActionGroups}
          />
        </div>
      )}

      {activeTab === 'orders' && (
        <OrdersSubpage
          orders={orders}
          onBackToDashboard={handleBackToDashboard}
          role="OWNER"
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

      {activeTab === 'revenue' && (
        <RevenueSubpage
          orders={orders}
          customers={customers}
          onBackToDashboard={handleBackToDashboard}
          formatPrice={formatPrice}
          showToast={showToast}
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
          title="Kho Mẫu Hoa & Kiểm Soát Tồn Hoa Trong Ngày"
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
          title="Tra Cứu Khách Hàng VIP & Lịch Sử Đặt Hoa"
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
          title="Quản Lý Voucher & Mã Khuyến Mại Tiệm Hoa"
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
          title="Trình Quản Lý Giao Diện Website"
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

      {/* 3. MODALS & POPUPS */}
      <SecurityModal
        isOpen={showSecurityModal}
        onClose={() => setShowSecurityModal(false)}
        roleTitle="Chủ Tiệm"
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
