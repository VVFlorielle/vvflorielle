import React, { useState, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { restoreScrollPosition } from '../utils/scrollRestoration';
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
  KeyRound
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

// Subpages
import { OrdersSubpage } from '../components/management/subpages/OrdersSubpage';
import { ProductsSubpage } from '../components/management/subpages/ProductsSubpage';
import { CustomersSubpage } from '../components/management/subpages/CustomersSubpage';
import { PromotionsSubpage } from '../components/management/subpages/PromotionsSubpage';
import { RevenueSubpage } from '../components/management/subpages/RevenueSubpage';
import { StoreConfigSubpage } from '../components/management/subpages/StoreConfigSubpage';
import { SecuritySubpage } from '../components/management/subpages/SecuritySubpage';
import { CmsLiveviewSubpage } from '../components/management/subpages/CmsLiveviewSubpage';
import { MarqueeSubpage } from '../components/management/subpages/MarqueeSubpage';

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
    approveOrderDeposit,
    adjustOrderShippingFee,
    completeOrder,
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
    activeAdminTab: activeTab,
    setActiveAdminTab: setActiveTab
  } = useStore();

  // Scroll Restoration Reference (Phototiinlove battle-tested navigation)
  const lastDashboardScrollYRef = useRef(0);

  const navigateToTab = (tab: any) => {
    if (activeTab === 'dashboard') {
      lastDashboardScrollYRef.current = window.scrollY || document.documentElement.scrollTop || 0;
    }
    setActiveTab(tab);
    if (tab !== 'dashboard') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const handleBackToDashboard = () => {
    setActiveTab('dashboard');
    restoreScrollPosition(lastDashboardScrollYRef.current);
  };

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

  // Helper formatting
  const formatPrice = (val: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  // Stats calculation
  const pendingDepositOrders = orders.filter((o) => !o.isDepositPaid && o.status !== 'CANCELLED');
  const arrangingOrders = orders.filter((o) => o.status === 'ARRANGING');
  const shippingOrders = orders.filter((o) => o.status === 'SHIPPING');
  const completedOrders = orders.filter((o) => o.status === 'COMPLETED');
  const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.flowerPrice || o.totalAmount), 0);

  // Customer order history helper
  const getCustomerOrderHistory = (custPhone: string) => {
    return orders.filter((o) => o.senderPhone === custPhone || o.recipientPhone === custPhone);
  };

  // KHUNG 1: VẬN HÀNH TIỆM HOA & NGHIỆP VỤ CỐT LÕI (6 chức năng)
  const floristCoreGroups: ManagementActionGroup[] = [
    {
      groupTitle: '1. Vận Hành Đơn Hàng & Doanh Thu Thực Tế',
      groupIcon: <Flower2 className="w-4 h-4 text-emerald-700" />,
      badge: 'Nghiệp Vụ Hằng Ngày',
      items: [
        {
          id: 'owner-orders',
          title: 'Duyệt Đơn Cọc 50% & Vận Chuyển Hỏa Tốc',
          description: 'Xem bill VietQR chuyển khoản, duyệt cọc 1-chạm sang đang cắm, chụp ảnh hoa hoàn thiện gửi Zalo duyệt mẫu trước khi giao.',
          icon: <ShoppingBag className="w-5 h-5" />,
          iconBgColor: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
          badge: `${pendingDepositOrders.length > 0 ? `${pendingDepositOrders.length} Đơn Cần Duyệt` : 'Ổn Định'}`,
          badgeColor: pendingDepositOrders.length > 0 ? 'amber' : 'emerald',
          actionType: 'page',
          actionLabel: 'Mở Xử Lý Đơn',
          onClick: () => navigateToTab('orders')
        },
        {
          id: 'owner-revenue',
          title: 'Quản Lý Doanh Thu & Báo Cáo Tài Chính',
          description: 'Theo dõi dòng tiền thực tế, tách bạch cọc VietQR và tiền mặt COD, phân tích kỳ kế toán và xuất Excel.',
          icon: <TrendingUp className="w-5 h-5" />,
          iconBgColor: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
          badge: 'Báo Cáo Excel',
          badgeColor: 'emerald',
          actionType: 'page',
          actionLabel: 'Xem Doanh Thu',
          onClick: () => navigateToTab('revenue')
        },
        {
          id: 'owner-stock',
          title: 'Kiểm Soát Còn Hoa 1-Chạm (Instant Stock)',
          description: 'Bật/tắt trạng thái Còn hàng hoặc Tạm hết của các mẫu hoa trong ngày chỉ với một thao tác chạm tức thì.',
          icon: <Flower2 className="w-5 h-5" />,
          iconBgColor: 'bg-pink-100 text-pink-700 border border-pink-200',
          badge: `${products.length} Mẫu Hoa`,
          badgeColor: 'rose',
          actionType: 'page',
          actionLabel: 'Mở Kho Hoa',
          onClick: () => navigateToTab('products')
        }
      ]
    },
    {
      groupTitle: '2. Khách Quen VIP & Khuyến Mãi Tiệm',
      groupIcon: <Users className="w-4 h-4 text-purple-700" />,
      badge: 'Chăm Sóc & Ưu Đãi',
      items: [
        {
          id: 'owner-customers',
          title: 'Tra Cứu Khách Hàng VIP & Lịch Sử Đặt Hoa',
          description: 'Xem danh sách khách quen, hạng thành viên, thói quen đặt hoa, sở thích màu ruy băng và lịch sử đặt hàng.',
          icon: <Users className="w-5 h-5" />,
          iconBgColor: 'bg-purple-100 text-purple-700 border border-purple-200',
          badge: `${customers.length} Khách Quen`,
          badgeColor: 'purple',
          actionType: 'page',
          actionLabel: 'Tra Cứu Khách VIP',
          onClick: () => navigateToTab('customers')
        },
        {
          id: 'owner-vouchers',
          title: 'Quản Lý Voucher & Mã Giảm Giá Tiệm',
          description: 'Theo dõi các mã ưu đãi đang hoạt động, số lượt sử dụng và điều kiện giảm giá đơn hàng.',
          icon: <Gift className="w-5 h-5" />,
          iconBgColor: 'bg-amber-100 text-amber-700 border border-amber-200',
          badge: `${promotions.length} Mã`,
          badgeColor: 'amber',
          actionType: 'page',
          actionLabel: 'Xem Mã Voucher',
          onClick: () => navigateToTab('vouchers')
        },
        {
          id: 'owner-quick-voucher',
          title: 'Tạo Nhanh Voucher Dịp Lễ (8/3, 20/10, Valentine)',
          description: 'Bật popup tạo tức thì mã ưu đãi dịp lễ, cài đặt giảm giá VNĐ và đơn tối thiểu trong 30 giây.',
          icon: <Sparkles className="w-5 h-5" />,
          iconBgColor: 'bg-rose-100 text-rose-700 border border-rose-200',
          badge: 'Tạo Nhanh 30s',
          badgeColor: 'rose',
          actionType: 'modal',
          actionLabel: 'Mở Popup Tạo Mã',
          onClick: () => setShowQuickVoucherModal(true)
        }
      ]
    }
  ];

  // KHUNG 2: QUẢN TRỊ HỆ THỐNG & GIAO DIỆN WEBSITE (7 chức năng)
  const webSystemGroups: ManagementActionGroup[] = [
    {
      groupTitle: '3. Cấu Hình Cửa Hàng, Bảng Cước & Kênh CSKH',
      groupIcon: <Settings className="w-4 h-4 text-slate-700" />,
      badge: 'Vận Hành Tiệm',
      items: [
        {
          id: 'owner-settings',
          title: 'Cấu Hình Tiệm Hoa, Địa Chỉ & Bản Đồ',
          description: 'Thiết lập tên tiệm, địa chỉ showroom, giờ mở cửa 06:30 - 21:30, số hotline chính và bán kính tối đa.',
          icon: <Settings className="w-5 h-5" />,
          iconBgColor: 'bg-slate-100 text-slate-700 border border-slate-200',
          badge: 'Cửa Hàng',
          badgeColor: 'slate',
          actionType: 'page',
          actionLabel: 'Mở Cấu Hình Tiệm',
          onClick: () => navigateToTab('settings')
        },
        {
          id: 'owner-shipping',
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
          id: 'owner-channels',
          title: 'Kênh Liên Hệ Hotline, Zalo & Messenger',
          description: 'Quản lý các nút gọi điện, chat Zalo, Messenger, chỉ đường Google Maps hiển thị cho khách hàng.',
          icon: <Share2 className="w-5 h-5" />,
          iconBgColor: 'bg-sky-100 text-sky-700 border border-sky-200',
          badge: `${contactChannels.length} Kênh`,
          badgeColor: 'sky',
          actionType: 'page',
          actionLabel: 'Mở Kênh CSKH',
          onClick: () => navigateToTab('channels')
        },
        {
          id: 'owner-marquee',
          title: 'Bảng Tin Chạy Chữ Khuyến Mãi Đỉnh Trang',
          description: 'Soạn thảo, bật/tắt các dòng thông báo khuyến mãi, cam kết hoa tươi chạy mượt trên đỉnh website.',
          icon: <Megaphone className="w-5 h-5" />,
          iconBgColor: 'bg-amber-100 text-amber-700 border border-amber-200',
          badge: `${marqueeAnnouncements.length} Tin`,
          badgeColor: 'amber',
          actionType: 'page',
          actionLabel: 'Mở Bảng Tin Chạy',
          onClick: () => navigateToTab('marquee')
        }
      ]
    },
    {
      groupTitle: '4. Giao Diện Website CMS & Mascot Linh Vật Tiệm',
      groupIcon: <LayoutTemplate className="w-4 h-4 text-purple-700" />,
      badge: 'Thương Hiệu & CMS',
      items: [
        {
          id: 'owner-cms',
          title: 'Trình Quản Lý Giao Diện Website (CMS Chuẩn Phototiinlove)',
          description: 'Chọn khu vực muốn chỉnh sửa, nhấp trực tiếp trên preview để chọn thành phần và cập nhật nội dung tức thì.',
          icon: <LayoutTemplate className="w-5 h-5" />,
          iconBgColor: 'bg-purple-100 text-purple-700 border border-purple-200',
          badge: 'CMS Chuẩn Phototiinlove',
          badgeColor: 'purple',
          actionType: 'page',
          actionLabel: 'Mở CMS Giao Diện',
          onClick: () => navigateToTab('cms')
        },
        {
          id: 'owner-mascot',
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
          id: 'owner-security',
          title: 'Đổi Mật Khẩu, Mã PIN & Bảo Mật Chủ Tiệm',
          description: 'Bật popup cập nhật mật khẩu đăng nhập chủ quán và mã PIN thao tác bảo mật an toàn.',
          icon: <KeyRound className="w-5 h-5" />,
          iconBgColor: 'bg-slate-100 text-slate-700 border border-slate-200',
          badge: 'Bảo Mật Chủ Quán',
          badgeColor: 'slate',
          actionType: 'modal',
          actionLabel: 'Mở Popup Đổi PIN',
          onClick: () => setShowSecurityModal(true)
        }
      ]
    }
  ];

  if (!isAdmin) {
    return <AdminLoginForm />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 pt-4 pb-20 space-y-6 select-none">
      {/* 1. TOP GREETING & 4 KPIS HERO */}
      <ManagementOverviewHero
        tag="Thông Tin Quản Trị"
        tagIcon={<Flower2 className="w-3.5 h-3.5 text-emerald-700" />}
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
            icon: <Flower2 className="w-4 h-4 text-emerald-700" />,
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

      {/* 2. SUBPAGE ROUTING & DASHBOARD */}
      {activeTab === 'dashboard' && (
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

          {/* KHUNG 1: QUẢN LÝ TIỆM HOA & NGHIỆP VỤ CỐT LÕI */}
          <div className="bg-gradient-to-br from-emerald-50/40 via-white to-pink-50/20 p-4 sm:p-6 rounded-3xl border border-emerald-100/80 shadow-sm space-y-4">
            <ManagementFunctionalGrid
              title="Quản Lý Tiệm Hoa & Nghiệp Vụ Cốt Lõi"
              subtitle="Các nghiệp vụ điều hành hàng ngày: duyệt đơn cọc, doanh thu thực tế, kiểm soát kho hoa và khách quen VIP"
              groups={floristCoreGroups}
            />
          </div>

          {/* KHUNG 2: QUẢN TRỊ HỆ THỐNG & GIAO DIỆN WEBSITE */}
          <div className="bg-gradient-to-br from-purple-50/30 via-white to-sky-50/20 p-4 sm:p-6 rounded-3xl border border-purple-100/80 shadow-sm space-y-4">
            <ManagementFunctionalGrid
              title="Quản Trị Hệ Thống & Giao Diện Website"
              subtitle="Tùy biến giao diện CMS chuẩn phototiinlove, bảng cước hỏa tốc, kênh liên hệ CSKH, linh vật và bảo mật"
              groups={webSystemGroups}
            />
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <OrdersSubpage
          orders={orders}
          onBackToDashboard={handleBackToDashboard}
          role="OWNER"
          formatPrice={formatPrice}
          updateOrderStatus={updateOrderStatus}
          approveOrderDeposit={approveOrderDeposit}
          completeOrder={completeOrder}
          onViewBill={(ord) => setViewingBillOrder(ord)}
          onEditShipping={(ord) => setEditShippingOrder(ord)}
          initialSearch={orderSearchForSubpage}
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
          title="Tra Cứu Khách Hàng VIP & Lịch Sử Đặt Hoa"
        />
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
          title="Trình Quản Lý Giao Diện Website (CMS Chuẩn Phototiinlove)"
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
        roleTitle="Chủ Quán"
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
        isOpen={isBulkDiscountOpen}
        onClose={() => setIsBulkDiscountOpen(false)}
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
    </div>
  );
};
