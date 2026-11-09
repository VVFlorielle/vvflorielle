import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { restoreScrollPosition } from '../utils/scrollRestoration';
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
  Palette
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
    approveOrderDeposit,
    adjustOrderShippingFee,
    completeOrder,
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
    showToast
  } = useStore();

  // Scroll Restoration Reference (Phototiinlove battle-tested navigation)
  const lastDashboardScrollYRef = useRef(0);

  const navigateToTab = (tab: any) => {
    if (activeTab === 'dashboard') {
      lastDashboardScrollYRef.current = window.scrollY || document.documentElement.scrollTop || 0;
    }
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const targetHash = tab === 'dashboard' ? '#admin' : `#admin/${tab}`;
      window.history.pushState({ adminTab: tab }, '', targetHash);
    }
    if (tab !== 'dashboard') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const handleBackToDashboard = () => {
    setActiveTab('dashboard');
    if (typeof window !== 'undefined') {
      window.history.replaceState({ adminTab: 'dashboard' }, '', '#admin');
    }
    restoreScrollPosition(lastDashboardScrollYRef.current);
  };

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

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // KPIs
  const totalRevenue = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const arrangingCount = orders.filter((o) => o.status === 'ARRANGING' || o.status === 'PENDING').length;
  const completedCount = orders.filter((o) => o.status === 'COMPLETED').length;
  const pendingDepositOrders = orders.filter((o) => !o.isDepositPaid && o.status !== 'CANCELLED').length;

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
      groupIcon: <ShoppingBag className="w-4 h-4 text-amber-700" />,
      items: [
        {
          id: 'action-pricing-modal',
          title: 'Bảng giá dịch vụ',
          description: 'Cập nhật loại hoa, giá bán công khai và quy cách hiển thị bảng giá.',
          icon: <Flower2 className="w-4 h-4" />,
          actionType: 'modal',
          actionLabel: 'Mở popup',
          onClick: () => setIsBulkDiscountOpen(true)
        },
        {
          id: 'action-orders',
          title: 'Quản lý đơn hàng',
          description: 'Xem toàn bộ đơn, duyệt trạng thái và phân công giao hoa hỏa tốc.',
          icon: <ShoppingBag className="w-4 h-4" />,
          actionType: 'page',
          actionLabel: 'Truy cập',
          onClick: () => navigateToTab('orders')
        },
        {
          id: 'action-vouchers',
          title: 'Quản lý Voucher',
          description: 'Quản lý loại voucher, điểm đổi, giá trị và thời hạn áp dụng.',
          icon: <Gift className="w-4 h-4" />,
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
          icon: <Truck className="w-4 h-4" />,
          actionType: 'modal',
          actionLabel: 'Mở popup',
          onClick: () => setShowShippingModal(true)
        }
      ]
    },
    {
      groupId: 'customers',
      groupTitle: 'Khách Hàng & Nhân Sự',
      groupIcon: <Users className="w-4 h-4 text-purple-700" />,
      items: [
        {
          id: 'action-customers',
          title: 'Khách hàng',
          description: 'Xem và hỗ trợ tài khoản khách, lịch sử đặt hoa và điểm tích lũy.',
          icon: <Users className="w-4 h-4" />,
          actionType: 'page',
          actionLabel: 'Truy cập',
          onClick: () => navigateToTab('customers')
        },
        {
          id: 'action-staff',
          title: 'Tài khoản nhân viên',
          description: 'Quản lý tài khoản cắm hoa, điều phối đơn và phân công trực tiệm.',
          icon: <Users className="w-4 h-4" />,
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
        }
      ]
    },
    {
      groupId: 'website',
      groupTitle: 'Giao Diện & Website',
      groupIcon: <LayoutTemplate className="w-4 h-4 text-sky-700" />,
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
          id: 'action-settings',
          title: 'Cấu hình showroom & Bản đồ',
          description: 'Thiết lập tên tiệm, địa chỉ showroom 105 Doãn Kế Thiện và giờ mở cửa.',
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
      groupIcon: <KeyRound className="w-4 h-4 text-rose-700" />,
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
          icon: <ShieldCheck className="w-4 h-4" />,
          actionType: 'page',
          actionLabel: 'Truy cập',
          onClick: () => navigateToTab('security')
        }
      ]
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 pt-4 pb-32 sm:pb-36 space-y-6 select-none">
      {/* 1. TOP OVERVIEW HERO BANNER (Chỉ hiển thị tại Dashboard Tổng Quan giống PhotoTiinLove, không đè lên CMS và trang con) */}
      {activeTab === 'dashboard' && (
        <ManagementOverviewHero
          tag="Thông Tin Quản Trị"
          tagIcon={<ShieldCheck className="w-3.5 h-3.5 text-purple-700" />}
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
              icon: <Flower2 className="w-3.5 h-3.5" />,
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
        isOpen={isBulkDiscountOpen}
        onClose={() => setIsBulkDiscountOpen(false)}
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
    </div>
  );
};
