import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Flower2,
  AlertCircle,
  Truck,
  Sparkles,
  ShoppingBag,
  Users,
  Gift,
  ShieldCheck
} from 'lucide-react';
import { CustomerUser, Order } from '../types';
import { ManagementOverviewHero } from '../components/management/ManagementOverviewHero';
import { ManagementFunctionalGrid, ManagementActionGroup } from '../components/management/ManagementFunctionalGrid';
import { ManagementRecentOrders } from '../components/management/ManagementRecentOrders';
import { ManagementBottomDock } from '../components/management/ManagementBottomDock';
import { AdminLoginForm } from '../components/management/AdminLoginForm';
import {
  SecurityModal,
  QuickVoucherModal,
  BillPreviewModal,
  EditShippingFeeModal,
  TempPasswordModal,
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

export const OwnerPortal: React.FC = () => {
  const {
    isAdmin,
    setCurrentView,
    orders,
    products,
    addProduct,
    deleteProduct,
    updateOrderStatus,
    approveOrderDeposit,
    adjustOrderShippingFee,
    completeOrder,
    customers,
    promotions,
    updatePromotions,
    showToast,
    changeAdminCredentials,
    adminEmail,
    saveGmailConfig,
    updateCustomerByAdmin,
    deleteCustomerByAdmin,
    adjustCustomerPoints,
    adminResetCustomerPassword,
    logoutAdmin,
    activeAdminTab: activeTab,
    setActiveAdminTab: setActiveTab
  } = useStore();

  const [orderSearchForSubpage, setOrderSearchForSubpage] = useState('');

  // Modals state
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showQuickVoucherModal, setShowQuickVoucherModal] = useState(false);
  const [viewingBillOrder, setViewingBillOrder] = useState<Order | null>(null);
  const [editShippingOrder, setEditShippingOrder] = useState<{ id: string; fee: number } | null>(null);
  const [tempPassModal, setTempPassModal] = useState<{ customerName: string; pass: string } | null>(null);
  const [isAddVoucherOpen, setIsAddVoucherOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerUser | null>(null);
  const [adjustingCustomer, setAdjustingCustomer] = useState<CustomerUser | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<CustomerUser | null>(null);

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

  // Action groups for Owner Functional Grid (phototiinlove style)
  const ownerActionGroups: ManagementActionGroup[] = [
    {
      groupTitle: '1. Vận Hành Tiệm Hoa & Kiểm Soát Cốt Lõi',
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
          onClick: () => setActiveTab('orders')
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
          onClick: () => setActiveTab('products')
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
          onClick: () => setActiveTab('customers')
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
          onClick: () => setActiveTab('vouchers')
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
    },
    {
      groupTitle: '3. Tài Khoản & Bảo Mật Chủ Quán',
      groupIcon: <ShieldCheck className="w-4 h-4 text-slate-700" />,
      badge: 'Bảo Mật',
      items: [
        {
          id: 'owner-security-modal',
          title: 'Đổi Mật Khẩu & Quản Lý PIN Chủ Tiệm',
          description: 'Bật popup cập nhật mật khẩu đăng nhập chủ quán và mã PIN thao tác bảo mật.',
          icon: <ShieldCheck className="w-5 h-5" />,
          iconBgColor: 'bg-slate-100 text-slate-700 border border-slate-200',
          badge: 'Chủ Quán',
          badgeColor: 'slate',
          actionType: 'modal',
          actionLabel: 'Mở Popup Đổi Mật Khẩu',
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
      {/* 1. TOP GREETING & 4 KPIS HERO (BRIGHT, ELEGANT PASTEL) */}
      <ManagementOverviewHero
        tag="Không Gian Điều Hành Tiệm Hoa • Florist Command Center"
        tagIcon={<Flower2 className="w-3.5 h-3.5 text-emerald-700" />}
        title="Bảng Vận Hành Tiệm Hoa V&V Florielle"
        subtitle="105 Doãn Kế Thiện, Cầu Giấy • Duyệt đơn cọc VietQR 1-chạm, kiểm soát còn hoa tức thì và chăm sóc khách hàng thân thiết."
        statusBadge="Tiệm đang mở cửa (06:30 - 21:30)"
        stats={[
          {
            id: 'deposit',
            title: 'Đơn Cần Duyệt Cọc',
            value: pendingDepositOrders.length,
            subtext: pendingDepositOrders.length > 0 ? '⚡ Cần xác nhận bill cọc 50%' : 'Đã duyệt hết',
            icon: <AlertCircle className="w-4 h-4 text-amber-700" />,
            color: 'amber',
            onClick: () => setActiveTab('orders')
          },
          {
            id: 'arranging',
            title: 'Đang Cắm Hoa',
            value: arrangingOrders.length,
            subtext: 'Florist đang hoàn thiện',
            icon: <Flower2 className="w-4 h-4 text-emerald-700" />,
            color: 'emerald',
            onClick: () => setActiveTab('orders')
          },
          {
            id: 'shipping',
            title: 'Đang Giao Hỏa Tốc',
            value: shippingOrders.length,
            subtext: 'Shipper đang trên đường',
            icon: <Truck className="w-4 h-4 text-sky-700" />,
            color: 'sky',
            onClick: () => setActiveTab('orders')
          },
          {
            id: 'revenue',
            title: 'Doanh Thu Hoàn Tất',
            value: formatPrice(totalRevenue),
            subtext: `${completedOrders.length} đơn hoàn thành`,
            icon: <Sparkles className="w-4 h-4 text-purple-700" />,
            color: 'purple'
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
            title="Danh Mục Chức Năng Chủ Quán"
            subtitle="Mô hình thẻ chức năng to như phototiinlove • Nhấp để mở phân hệ hoặc popup thao tác nhanh"
            groups={ownerActionGroups}
          />
        </div>
      )}

      {activeTab === 'orders' && (
        <OrdersSubpage
          orders={orders}
          onBackToDashboard={() => setActiveTab('dashboard')}
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

      {activeTab === 'products' && (
        <ProductsSubpage
          products={products}
          onBackToDashboard={() => setActiveTab('dashboard')}
          onOpenAddProduct={() => setIsAddProductOpen(true)}
          deleteProduct={deleteProduct}
          formatPrice={formatPrice}
          title="Kho Mẫu Hoa & Kiểm Soát Tồn Hoa Trong Ngày"
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
          title="Tra Cứu Khách Hàng VIP & Lịch Sử Đặt Hoa"
        />
      )}

      {activeTab === 'vouchers' && (
        <PromotionsSubpage
          promotions={promotions}
          onBackToDashboard={() => setActiveTab('dashboard')}
          onOpenAddVoucher={() => setIsAddVoucherOpen(true)}
          updatePromotions={updatePromotions}
          formatPrice={formatPrice}
          title="Quản Lý Voucher & Mã Khuyến Mại Tiệm Hoa"
        />
      )}

      {/* 4. MODALS & POPUPS */}
      <SecurityModal
        isOpen={showSecurityModal}
        onClose={() => setShowSecurityModal(false)}
        roleTitle="Chủ Quán"
        onSaveCredentials={changeAdminCredentials}
        adminEmail={adminEmail}
        onSaveEmailConfig={saveGmailConfig}
      />

      <QuickVoucherModal
        isOpen={showQuickVoucherModal}
        onClose={() => setShowQuickVoucherModal(false)}
        onCreateVoucher={(newPromo) => {
          updatePromotions([newPromo, ...promotions]);
          showToast(`Đã phát hành mã ưu đãi ${newPromo.code}!`, 'success');
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
