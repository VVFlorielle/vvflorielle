import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Flower2,
  CheckCircle2,
  Clock,
  Truck,
  Award,
  Search,
  Phone,
  MessageCircle,
  Eye,
  Calendar,
  MapPin,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Plus,
  Tag,
  Gift,
  AlertCircle,
  Volume2,
  Filter,
  Check,
  X,
  Send,
  Users,
  ShieldCheck,
  RefreshCw,
  Camera
} from 'lucide-react';
import { OrderStatus, FlowerProduct, PromotionItem, CustomerUser } from '../types';
import { ManagementOverviewHero } from '../components/management/ManagementOverviewHero';
import { ManagementTabsBar } from '../components/management/ManagementTabsBar';

export const OwnerPortal: React.FC = () => {
  const {
    orders,
    products,
    updateProduct,
    updateOrderStatus,
    approveOrderDeposit,
    completeOrder,
    customers,
    promotions,
    updatePromotions,
    settings,
    showToast
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'stock' | 'customers' | 'vouchers'>('orders');

  // Filter orders
  const [orderStatusFilter, setOrderStatusFilter] = useState<'ALL' | 'PENDING_DEPOSIT' | 'ARRANGING' | 'SHIPPING' | 'COMPLETED'>('ALL');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // Bill preview modal
  const [viewingBillOrder, setViewingBillOrder] = useState<any | null>(null);

  // Stock search
  const [stockSearchQuery, setStockSearchQuery] = useState('');
  const [stockCategoryFilter, setStockCategoryFilter] = useState<string>('ALL');

  // Customer search
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');

  // Voucher form state
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherDiscount, setVoucherDiscount] = useState<number>(30000);
  const [voucherMinOrder, setVoucherMinOrder] = useState<number>(400000);

  // Stats calculation
  const pendingDepositOrders = orders.filter((o) => !o.isDepositPaid && o.status !== 'CANCELLED');
  const arrangingOrders = orders.filter((o) => o.status === 'ARRANGING');
  const shippingOrders = orders.filter((o) => o.status === 'SHIPPING');
  const completedOrders = orders.filter((o) => o.status === 'COMPLETED');
  const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.flowerPrice || o.totalAmount), 0);

  // Filtered orders list
  const filteredOrders = orders.filter((o) => {
    // Status filter
    if (orderStatusFilter === 'PENDING_DEPOSIT' && o.isDepositPaid) return false;
    if (orderStatusFilter === 'ARRANGING' && o.status !== 'ARRANGING') return false;
    if (orderStatusFilter === 'SHIPPING' && o.status !== 'SHIPPING') return false;
    if (orderStatusFilter === 'COMPLETED' && o.status !== 'COMPLETED') return false;

    // Search query
    if (orderSearchQuery.trim()) {
      const q = orderSearchQuery.toLowerCase();
      const matchId = o.id.toLowerCase().includes(q);
      const matchSender = o.senderName?.toLowerCase().includes(q) || o.senderPhone?.includes(q);
      const matchRecipient = o.recipientName?.toLowerCase().includes(q) || o.recipientPhone?.includes(q);
      return matchId || matchSender || matchRecipient;
    }
    return true;
  });

  // Filtered stock
  const filteredProducts = products.filter((p) => {
    if (stockCategoryFilter !== 'ALL' && p.categoryId !== stockCategoryFilter) return false;
    if (stockSearchQuery.trim()) {
      const q = stockSearchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.flowerTypes?.some((f: string) => f.toLowerCase().includes(q));
    }
    return true;
  });

  // Filtered customers
  const filteredCustomers = customers.filter((c: CustomerUser) => {
    if (!customerSearchQuery.trim()) return true;
    const q = customerSearchQuery.toLowerCase();
    return c.fullName.toLowerCase().includes(q) || c.phone.includes(q);
  });

  // Helper formatting
  const formatPrice = (val: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  // Quick Holiday Voucher Presets
  const handleApplyPresetVoucher = (code: string, discount: number, minOrder: number) => {
    setVoucherCode(code);
    setVoucherDiscount(discount);
    setVoucherMinOrder(minOrder);
  };

  const handleCreateVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherCode.trim()) {
      showToast('Vui lòng nhập mã voucher!', 'error');
      return;
    }
    const newPromo: PromotionItem = {
      id: `promo-${Date.now()}`,
      code: voucherCode.trim().toUpperCase(),
      title: `Ưu Đãi Dịp Lễ: ${voucherCode.toUpperCase()}`,
      description: `Giảm ${formatPrice(voucherDiscount)} cho đơn từ ${formatPrice(voucherMinOrder)}`,
      discountAmount: Number(voucherDiscount),
      minOrder: Number(voucherMinOrder),
      badge: 'DỊP LỄ',
      validUntil: '2026-12-31',
      discountType: 'FIXED',
      isActive: true
    };
    updatePromotions([newPromo, ...promotions]);
    setVoucherCode('');
    showToast(`Đã tạo mã giảm giá ${newPromo.code} thành công!`, 'success');
  };

  const handleTogglePromo = (id: string) => {
    const updated = promotions.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p));
    updatePromotions(updated);
    showToast('Đã cập nhật trạng thái mã ưu đãi!', 'info');
  };

  const handleDeletePromo = (id: string) => {
    const updated = promotions.filter((p) => p.id !== id);
    updatePromotions(updated);
    showToast('Đã xóa mã ưu đãi!', 'info');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 pt-4 pb-16 space-y-6 select-none">
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
            onClick: () => {
              setActiveTab('orders');
              setOrderStatusFilter('PENDING_DEPOSIT');
            },
            isActive: activeTab === 'orders' && orderStatusFilter === 'PENDING_DEPOSIT'
          },
          {
            id: 'arranging',
            title: 'Đang Cắm Hoa',
            value: arrangingOrders.length,
            subtext: 'Florist đang hoàn thiện',
            icon: <Flower2 className="w-4 h-4 text-emerald-700" />,
            color: 'emerald',
            onClick: () => {
              setActiveTab('orders');
              setOrderStatusFilter('ARRANGING');
            },
            isActive: activeTab === 'orders' && orderStatusFilter === 'ARRANGING'
          },
          {
            id: 'shipping',
            title: 'Đang Giao Hỏa Tốc',
            value: shippingOrders.length,
            subtext: 'Shipper đang trên đường',
            icon: <Truck className="w-4 h-4 text-sky-700" />,
            color: 'sky',
            onClick: () => {
              setActiveTab('orders');
              setOrderStatusFilter('SHIPPING');
            },
            isActive: activeTab === 'orders' && orderStatusFilter === 'SHIPPING'
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

      {/* 2. MANAGEMENT TABS DOCK (STYLE ẢNH 1 PHOTOTIINLOVE) */}
      <ManagementTabsBar
        tabs={[
          {
            id: 'orders',
            label: 'Duyệt Đơn & Vận Hành',
            count: orders.length,
            icon: <Flower2 className="w-4 h-4" />
          },
          {
            id: 'stock',
            label: 'Bật/Tắt Còn Hoa 1-Chạm',
            count: products.length,
            icon: <ToggleRight className="w-4 h-4" />
          },
          {
            id: 'customers',
            label: 'Tra Cứu Khách VIP',
            count: customers.length,
            icon: <Users className="w-4 h-4" />
          },
          {
            id: 'vouchers',
            label: 'Tạo Mã Dịp Lễ',
            count: promotions.length,
            icon: <Tag className="w-4 h-4" />
          }
        ]}
        activeTab={activeTab}
        onSelectTab={(tabId) => setActiveTab(tabId as any)}
        accentColor="emerald"
      />

      {/* =========================================================================
          TAB 1: ORDERS & DEPOSIT MANAGEMENT WORKFLOW
          ========================================================================= */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Tìm mã đơn (#849201...), tên người nhận, SĐT..."
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-emerald-500 font-mono"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 md:pb-0">
              <button
                onClick={() => setOrderStatusFilter('ALL')}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all ${
                  orderStatusFilter === 'ALL'
                    ? 'bg-emerald-700 text-white font-bold shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Tất cả ({orders.length})
              </button>
              <button
                onClick={() => setOrderStatusFilter('PENDING_DEPOSIT')}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-bold transition-all ${
                  orderStatusFilter === 'PENDING_DEPOSIT'
                    ? 'bg-amber-500 text-white'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                }`}
              >
                ⚡ Chờ cọc ({pendingDepositOrders.length})
              </button>
              <button
                onClick={() => setOrderStatusFilter('ARRANGING')}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all ${
                  orderStatusFilter === 'ARRANGING'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                🌸 Đang cắm ({arrangingOrders.length})
              </button>
              <button
                onClick={() => setOrderStatusFilter('SHIPPING')}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all ${
                  orderStatusFilter === 'SHIPPING'
                    ? 'bg-sky-600 text-white font-bold'
                    : 'bg-sky-50 text-sky-800 hover:bg-sky-100'
                }`}
              >
                🚚 Đang giao ({shippingOrders.length})
              </button>
              <button
                onClick={() => setOrderStatusFilter('COMPLETED')}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all ${
                  orderStatusFilter === 'COMPLETED'
                    ? 'bg-teal-700 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                ✅ Hoàn tất ({completedOrders.length})
              </button>
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500">
              <Flower2 className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-sm">Không tìm thấy đơn hàng nào phù hợp bộ lọc.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const isDepositNeeded = !order.isDepositPaid && order.status !== 'CANCELLED';
                return (
                  <div
                    key={order.id}
                    className={`p-4 sm:p-5 rounded-3xl bg-white border transition-all ${
                      isDepositNeeded
                        ? 'border-amber-300 shadow-md ring-1 ring-amber-200'
                        : 'border-slate-200 shadow-xs'
                    }`}
                  >
                    {/* Header Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sm text-slate-900 bg-slate-100 px-2.5 py-1 rounded-xl">
                          #{order.id}
                        </span>
                        <span className="text-xs text-slate-400">
                          {order.createdAt || 'Hôm nay'}
                        </span>
                        {/* Deposit Status Badge */}
                        {order.isDepositPaid ? (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                            ✓ Đã Cọc 50% ({formatPrice(order.depositAmount || order.totalAmount / 2)})
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                            ⚡ Chờ Duyệt Cọc ({formatPrice(order.depositAmount || order.totalAmount / 2)})
                          </span>
                        )}
                      </div>

                      {/* Status Selector */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 font-medium">Trạng thái:</span>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className="text-xs font-bold py-1 px-2.5 rounded-xl border border-slate-300 bg-white"
                        >
                          <option value="PENDING">Chờ xử lý</option>
                          <option value="ARRANGING">Đang cắm hoa</option>
                          <option value="SHIPPING">Đang giao hàng</option>
                          <option value="COMPLETED">Đã hoàn thành</option>
                          <option value="CANCELLED">Đã hủy</option>
                        </select>
                      </div>
                    </div>

                    {/* Order Details Body */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-3.5 text-xs">
                      {/* Col 1: Recipient & Address */}
                      <div className="space-y-1.5">
                        <div className="font-bold text-slate-700 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-rose-500" />
                          <span>Người nhận: {order.recipientName}</span>
                        </div>
                        <div className="text-slate-600">
                          SĐT: <strong className="text-slate-900 font-mono">{order.recipientPhone}</strong>
                        </div>
                        <div className="text-slate-600 leading-relaxed">
                          Địa chỉ: {order.recipientAddress}
                        </div>
                        <div className="text-emerald-700 font-medium">
                          Khoảng cách: {order.shippingDistanceKm || 2} km (Từ 105 Doãn Kế Thiện)
                        </div>
                        <div className="text-slate-500">
                          Khung giờ: <strong>{order.deliveryTimeSlot || 'Giao hỏa tốc 15 - 60P'}</strong>
                        </div>
                      </div>

                      {/* Col 2: Sender & Card Message */}
                      <div className="space-y-1.5">
                        <div className="font-bold text-slate-700 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Người đặt: {order.senderName}</span>
                        </div>
                        <div className="text-slate-600 font-mono">
                          SĐT: {order.senderPhone}
                        </div>
                        {order.cardMessage && (
                          <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-slate-700">
                            <span className="font-bold text-amber-900 block text-[10px] uppercase">
                              Nội dung thiệp:
                            </span>
                            <span className="italic leading-snug">"{order.cardMessage}"</span>
                          </div>
                        )}
                      </div>

                      {/* Col 3: Items & Pricing */}
                      <div className="space-y-2">
                        <div className="font-bold text-slate-700">Mẫu hoa đã chọn:</div>
                        {order.items?.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-slate-50">
                            <span className="font-medium text-slate-800 truncate">
                              {item.quantity}x {item.productName}
                            </span>
                            <span className="font-mono text-slate-600 shrink-0">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between font-black text-sm text-emerald-900">
                          <span>Tổng cộng:</span>
                          <span className="text-base text-emerald-700">{formatPrice(order.totalAmount)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Operational Action Buttons Bar */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* 1-Click Approve Deposit */}
                        {!order.isDepositPaid && (
                          <button
                            type="button"
                            onClick={() => approveOrderDeposit(order.id, 'ADMIN')}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Duyệt Cọc 50% & Bắt Đầu Cắm Hoa</span>
                          </button>
                        )}

                        {/* View Receipt / Bill */}
                        <button
                          type="button"
                          onClick={() => setViewingBillOrder(order)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Xem Bill Cọc VietQR</span>
                        </button>

                        {/* Send preview via Zalo */}
                        <a
                          href={`https://zalo.me/${order.senderPhone}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Gửi Ảnh Hoa Đã Cắm Qua Zalo</span>
                        </a>
                      </div>

                      {/* Fast status step buttons */}
                      <div className="flex items-center gap-1.5">
                        {order.status === 'ARRANGING' && (
                          <button
                            type="button"
                            onClick={() => updateOrderStatus(order.id, 'SHIPPING')}
                            className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Giao Cho Shipper</span>
                          </button>
                        )}
                        {order.status === 'SHIPPING' && (
                          <button
                            type="button"
                            onClick={() => completeOrder(order.id)}
                            className="px-3 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>Hoàn Tất & Tích Điểm</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 2: QUICK STOCK TOGGLE (BẬT / TẮT CÒN HOA 1-CHẠM)
          ========================================================================= */}
      {activeTab === 'stock' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Tìm mẫu hoa để bật/tắt còn hàng..."
                value={stockSearchQuery}
                onChange={(e) => setStockSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-emerald-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Lọc theo dòng hoa:</span>
              <select
                value={stockCategoryFilter}
                onChange={(e) => setStockCategoryFilter(e.target.value)}
                className="text-xs font-bold py-1.5 px-3 rounded-xl border border-slate-300 bg-white"
              >
                <option value="ALL">Tất cả danh mục</option>
                <option value="khai-truong">Hoa Khai Trương</option>
                <option value="sinh-nhat">Hoa Sinh Nhật</option>
                <option value="tinh-yeu">Hoa Tình Yêu</option>
                <option value="lan-ho-diep">Lan Hồ Điệp</option>
                <option value="hoa-chia-buon">Hoa Chia Buồn</option>
              </select>
            </div>
          </div>

          {/* Grid of stock cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredProducts.map((p) => {
              const inStock = p.isAvailable !== false;
              return (
                <div
                  key={p.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center gap-3.5 ${
                    inStock ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-50/80 border-slate-300 opacity-75'
                  }`}
                >
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-xs text-slate-900 truncate">{p.name}</h3>
                    <div className="text-xs font-mono font-bold text-emerald-700 mt-0.5">
                      {formatPrice(p.price)}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          inStock
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {inStock ? '✓ Còn hoa' : '✕ Tạm hết'}
                      </span>
                    </div>
                  </div>

                  {/* 1-Click Toggle Button */}
                  <button
                    type="button"
                    onClick={() => {
                      updateProduct(p.id, { isAvailable: !inStock });
                      showToast(`Đã chuyển "${p.name}" sang: ${!inStock ? 'Còn hoa' : 'Tạm hết'}!`, 'info');
                    }}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform hover:scale-110 cursor-pointer ${
                      inStock
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                    }`}
                    title={inStock ? 'Bấm để tắt còn hoa' : 'Bấm để bật còn hoa'}
                  >
                    {inStock ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: VIP CUSTOMER LOOKUP & FLOWER PREFERENCES
          ========================================================================= */}
      {activeTab === 'customers' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Tra cứu SĐT hoặc tên khách hàng VIP..."
                value={customerSearchQuery}
                onChange={(e) => setCustomerSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-emerald-500 font-mono"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCustomers.map((c: CustomerUser) => (
              <div key={c.id} className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-black text-sm flex items-center justify-center">
                      {c.fullName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{c.fullName}</h4>
                      <div className="font-mono text-slate-500 text-[11px]">{c.phone}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                    VIP {c.tier}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 text-xs space-y-1">
                  <div className="flex justify-between text-slate-600">
                    <span>Tổng chi tiêu:</span>
                    <strong className="text-emerald-800 font-mono">{formatPrice(c.totalSpent)}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Điểm tích lũy:</span>
                    <strong className="text-amber-700 font-mono">{c.points} điểm</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Địa chỉ quen thuộc:</span>
                    <span className="truncate max-w-[140px]">{c.address || 'Chưa lưu'}</span>
                  </div>
                </div>

                {/* Direct Call / Zalo */}
                <div className="flex items-center gap-2 pt-1">
                  <a
                    href={`tel:${c.phone}`}
                    className="flex-1 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Gọi Ngay</span>
                  </a>
                  <a
                    href={`https://zalo.me/${c.phone}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Nhắn Zalo</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: HOLIDAY FLASH VOUCHERS CREATOR
          ========================================================================= */}
      {activeTab === 'vouchers' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Creator */}
          <div className="lg:col-span-1 p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Gift className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-sm text-slate-900">Tạo Mã Giảm Giá Dịp Lễ</h3>
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Mẫu nhanh các dịp lễ:
              </span>
              <div className="flex flex-wrap gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => handleApplyPresetVoucher('HOA30K', 30000, 350000)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold cursor-pointer"
                >
                  30K Đơn 350K
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPresetVoucher('VALENTINE50K', 50000, 500000)}
                  className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 hover:bg-rose-100 font-bold cursor-pointer"
                >
                  Valentine 50K
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPresetVoucher('VIP100K', 100000, 1200000)}
                  className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 font-bold cursor-pointer"
                >
                  VIP 100K
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateVoucher} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Mã Voucher (In hoa):</label>
                <input
                  type="text"
                  placeholder="VD: PHUNU83, FREESHIP50..."
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 font-mono font-bold uppercase"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Số tiền giảm (VNĐ):</label>
                <input
                  type="number"
                  step="5000"
                  value={voucherDiscount}
                  onChange={(e) => setVoucherDiscount(Number(e.target.value))}
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 font-mono"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Áp dụng cho đơn từ (VNĐ):</label>
                <input
                  type="number"
                  step="10000"
                  value={voucherMinOrder}
                  onChange={(e) => setVoucherMinOrder(Number(e.target.value))}
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 font-mono"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-transform hover:scale-[1.02] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Kích Hoạt Mã Giảm Giá Ngay</span>
              </button>
            </form>
          </div>

          {/* Vouchers List */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-bold text-sm text-slate-800">Danh Sách Mã Giảm Giá Đang Áp Dụng ({promotions.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {promotions.map((v: PromotionItem) => (
                <div key={v.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-sm text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                      {v.code}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleTogglePromo(v.id)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer ${
                          v.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {v.isActive ? 'Đang bật' : 'Tạm tắt'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePromo(v.id)}
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-rose-500 hover:bg-rose-50 cursor-pointer"
                        title="Xóa mã"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-slate-600 font-medium">{v.title}</div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Giảm: <strong>{formatPrice(v.discountAmount)}</strong> • Đơn từ:{' '}
                    <strong>{formatPrice(v.minOrder)}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* === BILL PREVIEW MODAL === */}
      {viewingBillOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setViewingBillOrder(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-black text-base text-slate-900">
              Biên Lai Chuyển Khoản Đơn #{viewingBillOrder.id}
            </h3>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Khách đặt:</span>
                <strong className="text-slate-800">{viewingBillOrder.senderName} ({viewingBillOrder.senderPhone})</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Số tiền cọc cần chuyển (50%):</span>
                <strong className="text-emerald-700 font-bold text-sm">
                  {formatPrice(viewingBillOrder.depositAmount || viewingBillOrder.totalAmount / 2)}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Trạng thái cọc:</span>
                <strong className={viewingBillOrder.isDepositPaid ? 'text-emerald-700' : 'text-amber-600'}>
                  {viewingBillOrder.isDepositPaid ? '✓ Đã xác nhận' : '⚡ Chờ xác nhận'}
                </strong>
              </div>
            </div>

            {viewingBillOrder.receiptImageUrl ? (
              <img
                src={viewingBillOrder.receiptImageUrl}
                alt="Ảnh biên lai"
                className="w-full max-h-72 object-contain rounded-xl border border-slate-200"
              />
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-xl text-slate-500 text-xs border border-dashed border-slate-300">
                <p>Khách hàng chuyển khoản trực tiếp qua mã VietQR Napas 24/7 theo mã đơn #{viewingBillOrder.id}.</p>
              </div>
            )}

            {!viewingBillOrder.isDepositPaid && (
              <button
                type="button"
                onClick={() => {
                  approveOrderDeposit(viewingBillOrder.id, 'ADMIN');
                  setViewingBillOrder(null);
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Xác Nhận Đã Nhận Đủ Tiền Cọc 50%</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerPortal;
