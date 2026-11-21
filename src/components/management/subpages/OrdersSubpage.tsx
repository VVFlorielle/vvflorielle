import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useStore } from '../../../context/StoreContext';
import { useBodyScrollLock } from '../../../utils/scrollLock';
import {
  Search,
  MapPin,
  Eye,
  CheckCircle2,
  Award,
  ArrowLeft,
  Truck,
  AlertCircle,
  XCircle,
  X,
  Send,
  Image as ImageIcon,
  HardDrive,
  ExternalLink,
  Download,
  Printer,
  FileSpreadsheet,
  Calendar,
  Clock,
  Bot,
  RefreshCw,
  AlertTriangle,
  Trash2,
  CheckSquare,
  Square,
  Lock,
  KeyRound,
  ShieldCheck
} from 'lucide-react';
import { Order, OrderStatus } from '../../../types';
import { ActionConfirmModal } from '../ManagementModals';

interface OrdersSubpageProps {
  orders: Order[];
  onBackToDashboard: () => void;
  title?: string;
  role?: 'ADMIN' | 'OWNER';
  formatPrice: (p: number) => string;
  updateOrderStatus: (id: string, st: OrderStatus) => void;
  acceptOrderAndRequestDeposit?: (id: string) => void;
  rejectOrder?: (id: string, reason: string) => void;
  approveOrderDeposit: (id: string, approvedBy?: 'ADMIN' | 'AUTO_ASSISTANT') => void;
  rejectOrderDeposit?: (id: string, reason: string) => void;
  completeOrder: (id: string) => void;
  onViewBill: (order: Order) => void;
  onEditShipping: (order: { id: string; fee: number }) => void;
  initialSearch?: string;
  onOpenStorageManager?: () => void;
}

export const OrdersSubpage: React.FC<OrdersSubpageProps> = ({
  orders,
  onBackToDashboard,
  title = 'Quản Lý Đơn Hàng & Vận Chuyển Hỏa Tốc',
  role = 'ADMIN',
  formatPrice,
  updateOrderStatus,
  acceptOrderAndRequestDeposit,
  rejectOrder,
  approveOrderDeposit,
  rejectOrderDeposit,
  completeOrder,
  onViewBill,
  onEditShipping,
  initialSearch = '',
  onOpenStorageManager
}) => {
  const {
    settings,
    deleteOrder,
    forceDeleteOrder,
    deleteCancelledOrders,
    clearAllCancelledOrders,
    markDeliveryFailed,
    verifyAdminPin
  } = useStore();

  const [orderSearch, setOrderSearch] = useState(initialSearch);
  const [orderStatusFilter, setOrderStatusFilter] = useState<'ALL' | OrderStatus>('ALL');
  const [depositFilter, setDepositFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [orderToPrint, setOrderToPrint] = useState<Order | null>(null);
  const [viewMode, setViewMode] = useState<'LIST' | 'CALENDAR'>('LIST');

  // Cancelled Orders Multi-Select & Delete State
  const [selectedCancelledOrderIds, setSelectedCancelledOrderIds] = useState<string[]>([]);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isClearAllModalOpen, setIsClearAllModalOpen] = useState(false);

  // Level-2 PIN Override Modal for Dropdown
  const [pendingStatusOverride, setPendingStatusOverride] = useState<{ orderId: string; newStatus: OrderStatus; oldStatus: OrderStatus } | null>(null);
  const [overridePinInput, setOverridePinInput] = useState('');
  const [overridePinError, setOverridePinError] = useState('');

  // Confirm Successful Delivery Modal
  const [orderToConfirmDelivery, setOrderToConfirmDelivery] = useState<Order | null>(null);

  // Delivery Failed Modal (Reason required)
  const [orderToFailDelivery, setOrderToFailDelivery] = useState<Order | null>(null);
  const [failReason, setFailReason] = useState('Khách không nghe máy sau 3 cuộc gọi');

  // Force Delete Modal with Level-2 PIN
  const [orderToForceDelete, setOrderToForceDelete] = useState<Order | null>(null);
  const [forceDeletePinInput, setForceDeletePinInput] = useState('');
  const [forceDeletePinError, setForceDeletePinError] = useState('');

  // Reject / Reason Modal State
  const [rejectModalState, setRejectModalState] = useState<{
    isOpen: boolean;
    orderId: string | null;
    mode: 'ORDER_REJECT' | 'DEPOSIT_REJECT';
    reason: string;
  }>({
    isOpen: false,
    orderId: null,
    mode: 'ORDER_REJECT',
    reason: ''
  });

  // Guard against duplicate rapid completion clicks
  const [submittingOrderId, setSubmittingOrderId] = useState<string | null>(null);

  // Sample image modal
  const [previewSampleImage, setPreviewSampleImage] = useState<string | null>(null);

  // Khóa cuộn trang khi mở bất kỳ popup nào (Từ chối, Xem ảnh mẫu, In phiếu, Xóa đơn, PIN, Giao hàng)
  useBodyScrollLock(
    rejectModalState.isOpen ||
    Boolean(previewSampleImage) ||
    Boolean(orderToPrint) ||
    Boolean(orderToDelete) ||
    isBulkDeleteModalOpen ||
    isClearAllModalOpen ||
    Boolean(pendingStatusOverride) ||
    Boolean(orderToConfirmDelivery) ||
    Boolean(orderToFailDelivery) ||
    Boolean(orderToForceDelete)
  );

  // Tính số lượng thống kê chuẩn xác cho từng tab
  const totalOrdersCount = orders.length;
  const pendingCount = orders.filter((o) => o.status === 'PENDING').length;
  const waitingDepositCount = orders.filter((o) => o.status === 'WAITING_DEPOSIT').length;
  const arrangingCount = orders.filter((o) => o.status === 'ARRANGING').length;
  const shippingCount = orders.filter((o) => o.status === 'SHIPPING').length;
  const completedCount = orders.filter((o) => o.status === 'COMPLETED').length;
  const cancelledOrders = orders.filter((o) => o.status === 'CANCELLED');
  const cancelledCount = cancelledOrders.length;

  // Lọc cọc: Tính số lượng cọc cho các đơn chưa hủy
  const activeOrders = orders.filter((o) => o.status !== 'CANCELLED');
  const depositPendingCount = activeOrders.filter((o) => !o.isDepositPaid && o.depositStatus !== 'REJECTED').length;
  const depositApprovedCount = activeOrders.filter((o) => o.isDepositPaid || o.depositStatus === 'APPROVED').length;
  const depositRejectedCount = orders.filter((o) => o.depositStatus === 'REJECTED').length;

  // Đồng bộ hóa 2 chiều 2 hàng bộ lọc
  const handleSelectOrderStatus = (st: 'ALL' | OrderStatus) => {
    setOrderStatusFilter(st);
    if (st === 'WAITING_DEPOSIT') {
      setDepositFilter('PENDING');
    } else if (st === 'ARRANGING' || st === 'SHIPPING' || st === 'COMPLETED') {
      setDepositFilter('APPROVED');
    } else {
      setDepositFilter('ALL');
    }
  };

  const handleSelectDepositFilter = (dp: 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED') => {
    setDepositFilter(dp);
    if (dp === 'PENDING') {
      setOrderStatusFilter('WAITING_DEPOSIT');
    } else if (dp === 'APPROVED') {
      if (orderStatusFilter === 'ALL' || orderStatusFilter === 'WAITING_DEPOSIT' || orderStatusFilter === 'CANCELLED' || orderStatusFilter === 'PENDING') {
        setOrderStatusFilter('ARRANGING');
      }
    } else {
      setOrderStatusFilter('ALL');
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.senderName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.senderPhone.includes(orderSearch) ||
      o.recipientName.toLowerCase().includes(orderSearch.toLowerCase());

    if (o.status === 'CANCELLED') {
      return matchSearch && (orderStatusFilter === 'ALL' || orderStatusFilter === 'CANCELLED');
    }

    const matchStatus = orderStatusFilter === 'ALL' || o.status === orderStatusFilter;
    const matchDeposit =
      depositFilter === 'ALL' ||
      (depositFilter === 'APPROVED' && Boolean(o.isDepositPaid || o.depositStatus === 'APPROVED')) ||
      (depositFilter === 'REJECTED' && o.depositStatus === 'REJECTED') ||
      (depositFilter === 'PENDING' && !o.isDepositPaid && o.depositStatus !== 'REJECTED');

    return matchSearch && matchStatus && matchDeposit;
  });

  const filteredCancelledOrders = filteredOrders.filter((o) => o.status === 'CANCELLED');

  const handleToggleSelectCancelledOrder = (id: string) => {
    setSelectedCancelledOrderIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAllCancelled = () => {
    const allCancelledIds = filteredCancelledOrders.map((o) => o.id);
    if (selectedCancelledOrderIds.length === allCancelledIds.length && allCancelledIds.length > 0) {
      setSelectedCancelledOrderIds([]);
    } else {
      setSelectedCancelledOrderIds(allCancelledIds);
    }
  };

  // Xuất file CSV danh sách đơn hàng cho Admin & Chủ Tiệm
  const handleExportOrdersCsv = () => {
    if (filteredOrders.length === 0) return;
    const headers = [
      'Mã Đơn',
      'Thời Gian Đặt',
      'Người Đặt',
      'SĐT Người Đặt',
      'Người Nhận',
      'SĐT Người Nhận',
      'Địa Chỉ Giao',
      'Khoảng Cách (km)',
      'Hẹn Giao',
      'Sản Phẩm',
      'Lời Chúc Thiệp',
      'Tiền Hoa (VNĐ)',
      'Cước Vận Chuyển (VNĐ)',
      'Giảm Voucher (VNĐ)',
      'Tổng Tiền (VNĐ)',
      'Đã Cọc (VNĐ)',
      'Còn Lại COD (VNĐ)',
      'Thanh Toán',
      'Trạng Thái Đơn',
      'Trạng Thái Cọc'
    ];

    const rows = filteredOrders.map((o) => {
      const itemsStr = o.items.map((it) => `${it.productName} (x${it.quantity})`).join('; ');
      return [
        `"${o.id}"`,
        `"${o.createdAt || ''}"`,
        `"${o.senderName || ''}"`,
        `"${o.senderPhone || ''}"`,
        `"${o.recipientName || ''}"`,
        `"${o.recipientPhone || ''}"`,
        `"${(o.recipientAddress || '').replace(/"/g, '""')}"`,
        `"${o.shippingDistanceKm || 0}"`,
        `"${o.deliveryDate || ''} ${o.deliveryTimeSlot || ''}"`,
        `"${itemsStr.replace(/"/g, '""')}"`,
        `"${(o.cardMessage || '').replace(/"/g, '""')}"`,
        `"${o.flowerPrice || 0}"`,
        `"${o.shippingFee || 0}"`,
        `"${o.discountAmount || 0}"`,
        `"${o.totalAmount || 0}"`,
        `"${o.depositAmount || 0}"`,
        `"${o.remainingAmount || 0}"`,
        `"${o.paymentMethod || ''} - ${o.paymentType || ''}"`,
        `"${o.status}"`,
        `"${o.depositStatus || 'PENDING'}"`
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Danh_Sach_Don_Hoa_VVFlorielle_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleOpenRejectModal = (orderId: string, mode: 'ORDER_REJECT' | 'DEPOSIT_REJECT') => {
    setRejectModalState({
      isOpen: true,
      orderId,
      mode,
      reason: mode === 'ORDER_REJECT' ? 'Tạm hết loại hoa tươi theo mẫu trong kho' : 'Số tiền chuyển chưa đủ 50% tiền cọc'
    });
  };

  const handleConfirmReject = () => {
    if (!rejectModalState.orderId || !rejectModalState.reason.trim()) return;
    if (rejectModalState.mode === 'ORDER_REJECT') {
      rejectOrder?.(rejectModalState.orderId, rejectModalState.reason.trim());
    } else {
      rejectOrderDeposit?.(rejectModalState.orderId, rejectModalState.reason.trim());
    }
    setRejectModalState({ isOpen: false, orderId: null, mode: 'ORDER_REJECT', reason: '' });
  };

  const handleCompleteOrderGuarded = (orderId: string) => {
    if (submittingOrderId === orderId) return;
    setSubmittingOrderId(orderId);
    completeOrder(orderId);
    setTimeout(() => {
      setSubmittingOrderId(null);
    }, 1200);
  };

  // Group orders by deliveryDate for Calendar view
  const groupedOrdersByDate = React.useMemo(() => {
    const map: Record<string, Order[]> = {};
    filteredOrders.forEach((o) => {
      const d = o.deliveryDate || 'Chưa hẹn ngày';
      if (!map[d]) map[d] = [];
      map[d].push(o);
    });
    return Object.entries(map).sort(([d1], [d2]) => d1.localeCompare(d2));
  }, [filteredOrders]);

  const getDateBadge = (dateStr: string) => {
    const todayStr = new Date().toLocaleDateString('en-CA');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toLocaleDateString('en-CA');

    if (dateStr === todayStr) {
      return { label: '🌸 HÔM NAY', bg: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
    }
    if (dateStr === tomorrowStr) {
      return { label: '🌼 NGÀY MAI', bg: 'bg-blue-100 text-blue-900 border-blue-300' };
    }
    return { label: `📅 ${dateStr}`, bg: 'bg-slate-100 text-slate-800 border-slate-300' };
  };

  const getStatusLabel = (st: OrderStatus) => {
    switch (st) {
      case 'PENDING': return '1. Chờ tiệm duyệt kho';
      case 'WAITING_DEPOSIT': return '2. Chờ khách cọc 50%';
      case 'ARRANGING': return '3. Florist đang cắm hoa';
      case 'SHIPPING': return '4. Shipper đang giao';
      case 'COMPLETED': return '5. Đã hoàn thành';
      case 'CANCELLED': return 'Đã hủy / Từ chối';
      default: return st;
    }
  };

  const handleConfirmOverrideStatusWithPin = () => {
    if (!pendingStatusOverride) return;
    if (!verifyAdminPin(overridePinInput.trim())) {
      setOverridePinError('Mã PIN cấp 2 không chính xác. Vui lòng thử lại!');
      return;
    }
    updateOrderStatus(pendingStatusOverride.orderId, pendingStatusOverride.newStatus);
    setPendingStatusOverride(null);
    setOverridePinInput('');
    setOverridePinError('');
  };

  const handleConfirmDeliverySuccess = () => {
    if (!orderToConfirmDelivery) return;
    completeOrder(orderToConfirmDelivery.id);
    setOrderToConfirmDelivery(null);
  };

  const handleConfirmDeliveryFailed = () => {
    if (!orderToFailDelivery || !failReason.trim()) return;
    markDeliveryFailed(orderToFailDelivery.id, failReason.trim());
    setOrderToFailDelivery(null);
    setFailReason('Khách không nghe máy sau 3 cuộc gọi');
  };

  const handleConfirmForceDeleteWithPin = () => {
    if (!orderToForceDelete) return;
    const ok = forceDeleteOrder(orderToForceDelete.id, forceDeletePinInput.trim());
    if (ok) {
      setSelectedCancelledOrderIds((prev) => prev.filter((id) => id !== orderToForceDelete.id));
      setOrderToForceDelete(null);
      setForceDeletePinInput('');
      setForceDeletePinError('');
    } else {
      setForceDeletePinError('Mã PIN cấp 2 không chính xác!');
    }
  };

  const renderOrderCard = (order: Order, isCalendarView = false) => {
    const isCancelled = order.status === 'CANCELLED';
    const isSelected = selectedCancelledOrderIds.includes(order.id);

    return (
      <div
        key={order.id}
        className={`p-4 rounded-2xl bg-white/95 border transition-all space-y-3 ${
          isSelected
            ? 'border-rose-400 ring-2 ring-rose-300/40 shadow-md'
            : isCancelled
            ? 'border-rose-200/80 bg-rose-50/15 shadow-sm'
            : 'border-slate-200/80 shadow-sm'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2 flex-wrap">
            {isCancelled && (
              <button
                type="button"
                onClick={() => handleToggleSelectCancelledOrder(order.id)}
                className="p-0.5 text-slate-400 hover:text-rose-600 cursor-pointer transition-colors"
                title={isSelected ? 'Bỏ chọn đơn hủy này' : 'Tích chọn để xóa'}
              >
                {isSelected ? (
                  <CheckSquare className="w-4 h-4 text-rose-600" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400" />
                )}
              </button>
            )}
            <span className="font-mono font-extrabold text-sm text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded-lg border border-purple-200">
              #{order.id}
            </span>
          <span className="text-[11px] text-slate-400">({order.createdAt})</span>
          {isCalendarView && (
            <span className="font-extrabold text-xs text-purple-900 bg-purple-100/90 px-2.5 py-0.5 rounded-lg border border-purple-300 flex items-center gap-1 shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-purple-700" />
              <span>{order.deliveryTimeSlot || 'Chưa chọn giờ'}</span>
            </span>
          )}
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              order.status === 'CANCELLED'
                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                : order.paymentStatus === 'PAID'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {order.status === 'CANCELLED'
              ? 'ĐÃ HỦY ĐƠN'
              : order.paymentStatus === 'PAID'
              ? 'ĐÃ THANH TOÁN ĐỦ'
              : 'THANH TOÁN MỘT PHẦN / COD'}
          </span>
          {order.isCustomDesign && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
              Thiết kế riêng
            </span>
          )}
        </div>

        {/* Status updater dropdown & Print button & Force Delete */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOrderToPrint(order)}
            className="py-1 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
            title="In phiếu giao hoa bàn giao shipper kèm lời chúc thiệp"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">In Phiếu Giao</span>
            <span className="sm:hidden">In Phiếu</span>
          </button>

          <span className="text-xs text-slate-500">Quy trình:</span>
          <select
            value={order.status}
            onChange={(e) => {
              const nextStatus = e.target.value as OrderStatus;
              if (nextStatus === order.status) return;
              setPendingStatusOverride({ orderId: order.id, newStatus: nextStatus, oldStatus: order.status });
              setOverridePinInput('');
              setOverridePinError('');
            }}
            className="text-xs font-semibold py-1 px-3 rounded-xl border border-purple-200 bg-purple-50 text-purple-900 focus:outline-none cursor-pointer"
            title="Can thiệp quy trình thủ công (Yêu cầu mã PIN cấp 2)"
          >
            <option value="PENDING">1. Chờ tiệm duyệt kho</option>
            <option value="WAITING_DEPOSIT">2. Chờ khách cọc 50%</option>
            <option value="ARRANGING">3. Florist đang cắm hoa</option>
            <option value="SHIPPING">4. Shipper đang giao</option>
            <option value="COMPLETED">5. Đã hoàn thành</option>
            <option value="CANCELLED">Đã hủy / Từ chối</option>
          </select>

          {role === 'OWNER' && order.status !== 'CANCELLED' && (
            <button
              type="button"
              onClick={() => {
                setOrderToForceDelete(order);
                setForceDeletePinInput('');
                setForceDeletePinError('');
              }}
              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title={`Xóa cưỡng chế đơn #${order.id} (Yêu cầu mã PIN cấp 2)`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Customer details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 bg-slate-50/70 p-3 rounded-xl">
        <div>
          <div className="font-semibold text-slate-800">
            Người gửi: {order.senderName} (
            <a href={`tel:${order.senderPhone}`} className="text-emerald-700 hover:underline font-mono" title="Bấm để gọi người gửi">
              {order.senderPhone}
            </a>
            )
          </div>
          <div className="mt-1">
            Người nhận: <strong className="text-slate-800">{order.recipientName}</strong> -{' '}
            <a href={`tel:${order.recipientPhone}`} className="text-emerald-700 hover:underline font-mono font-bold" title="Bấm để gọi người nhận">
              {order.recipientPhone}
            </a>
          </div>
          <div className="text-slate-500 text-[11px] mt-0.5 flex items-start gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.recipientAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-emerald-700 hover:underline flex items-center gap-1 group"
              title="Mở Google Maps chỉ đường giao hoa"
            >
              <span>{order.recipientAddress}</span>
              <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-emerald-600 shrink-0" />
            </a>
          </div>

          {order.isGiftDelivery && (
            <div className="mt-1 flex items-center gap-1.5 flex-wrap">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  order.revealSenderToRecipient
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-purple-100 text-purple-800'
                }`}
              >
                {order.revealSenderToRecipient
                  ? '🎁 Đặt gửi tặng hộ (Công khai người gửi)'
                  : '🕵️ Tặng bí mật (Ẩn danh người tặng)'}
              </span>
            </div>
          )}

          {order.senderAgreedOverDistance && (
            <div className="mt-1">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                ⚠️ Giao xa {order.shippingDistanceKm}km - Khách cam kết tự chịu chất lượng hoa
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
          {order.customDesignSampleImage && (
            <div className="mt-1">
              <button
                type="button"
                onClick={() => setPreviewSampleImage(order.customDesignSampleImage || null)}
                className="text-[11px] font-bold text-purple-700 hover:text-purple-900 underline flex items-center gap-1 cursor-pointer"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Xem ảnh mẫu thiết kế khách gửi</span>
              </button>
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
              onClick={() => onEditShipping({ id: order.id, fee: order.shippingFee || 0 })}
              className="text-[10px] text-purple-700 hover:text-purple-900 underline font-semibold ml-1 cursor-pointer"
            >
              (Sửa phí)
            </button>
          </div>
        </div>

        <div>
          <div className="text-slate-500 text-[11px]">Tiền cọc &amp; Trạng thái cọc:</div>
          <div className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
            <span>{order.paymentMethod === 'BANK_TRANSFER' ? 'VietQR' : 'Tiền mặt (COD)'}</span>
            <span className="text-slate-400">•</span>
            <span className="text-rose-700 font-bold">
              Cọc 50%: {formatPrice(order.depositAmount || Math.round(order.flowerPrice * 0.5))}
            </span>
          </div>
          <div className="mt-1">
            {order.status === 'CANCELLED' ? (
              <span className="text-[10px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
                <span>🥀</span>
                <span>
                  Đơn đã hủy {order.isDepositPaid ? '(Đã cọc 50% - Cần đối soát)' : '(Chưa thu cọc)'}
                </span>
              </span>
            ) : order.status === 'COMPLETED' ? (
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                ✓ Đã thanh toán 100% (Đã cọc + Thu đủ khi giao)
              </span>
            ) : order.status === 'PENDING' ? (
              <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                ⏳ Chờ tiệm duyệt nhận đơn
              </span>
            ) : order.isDepositPaid ? (
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                ✓ Đã duyệt cọc (
                {order.depositApprovedBy === 'AUTO_ASSISTANT'
                  ? '🤖 Trợ lý AI tự duyệt'
                  : role === 'OWNER'
                  ? '🌸 Chủ Quán duyệt'
                  : '👑 Admin duyệt'}
                )
              </span>
            ) : order.depositStatus === 'REJECTED' ? (
              <span className="text-[10px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-200">
                ⚠️ Cọc bị từ chối ({order.depositRejectReason})
              </span>
            ) : (
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                ⏳ Chờ khách chuyển cọc 50%
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-center items-start sm:items-end">
          {order.isBillArchived ? (
            <div className="flex flex-col items-start sm:items-end gap-1">
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                📁 Đã lưu trữ Google Drive
              </span>
              <div className="flex items-center gap-1.5">
                {order.billDriveUrl ? (
                  <a
                    href={order.billDriveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 underline flex items-center gap-0.5 cursor-pointer"
                    title="Mở ảnh biên lai trên Google Drive"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Mở trên Drive</span>
                  </a>
                ) : null}
                <button
                  type="button"
                  onClick={() => onViewBill(order)}
                  className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 underline cursor-pointer"
                >
                  Chi tiết
                </button>
              </div>
            </div>
          ) : order.paymentBillImage || order.billImageDataUrl ? (
            <div className="flex flex-col items-start sm:items-end gap-1.5">
              <div className="flex items-center gap-1.5 flex-wrap justify-end">
                <button
                  type="button"
                  onClick={() => onViewBill(order)}
                  className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-purple-600" />
                  <span>Xem Ảnh Bill Chuyển Khoản</span>
                </button>
                {order.isAiAnalyzingBill ? (
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200/70 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                    <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                    <span>AI đang đọc...</span>
                  </span>
                ) : order.aiBillAnalysis ? (
                  order.aiBillAnalysis.decision === 'APPROVE' ? (
                    <span
                      className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-full flex items-center gap-1"
                      title={order.aiBillAnalysis.summary}
                    >
                      <Bot className="w-2.5 h-2.5 text-emerald-600" />
                      <span>AI: Khớp {new Intl.NumberFormat('vi-VN').format(order.aiBillAnalysis.transferredAmount || 0)}đ</span>
                    </span>
                  ) : (
                    <span
                      className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200/70 px-2 py-0.5 rounded-full flex items-center gap-1"
                      title={order.aiBillAnalysis.summary}
                    >
                      <AlertTriangle className="w-2.5 h-2.5 text-amber-600" />
                      <span>AI Cảnh báo</span>
                    </span>
                  )
                ) : null}
              </div>
              {order.billDriveUrl && (
                <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-1.5 py-0.2 rounded">
                  ✓ Đã sync Drive
                </span>
              )}
            </div>
          ) : (
            <span className="text-[11px] text-slate-400 italic">Khách chưa tải ảnh bill</span>
          )}
        </div>
      </div>

      {/* Actions & Total Summary */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* 1. Status PENDING */}
          {order.status === 'PENDING' && (
            <>
              <button
                type="button"
                onClick={() => acceptOrderAndRequestDeposit?.(order.id)}
                className="btn-primary text-xs py-1.5 px-3.5 bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer font-bold"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Duyệt Nhận Đơn (Báo Cọc 50%)</span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenRejectModal(order.id, 'ORDER_REJECT')}
                className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                <span>Hết Hoa / Từ Chối</span>
              </button>
            </>
          )}

          {/* 2. Status WAITING_DEPOSIT */}
          {order.status === 'WAITING_DEPOSIT' && (
            <>
              {order.paymentBillImage || order.billImageDataUrl ? (
                <>
                  <button
                    type="button"
                    onClick={() => approveOrderDeposit(order.id, role === 'OWNER' ? 'ADMIN' : 'ADMIN')}
                    className="btn-primary text-xs py-1.5 px-3.5 bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer font-bold"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Duyệt Cọc 50% &amp; Bắt Đầu Cắm Hoa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenRejectModal(order.id, 'DEPOSIT_REJECT')}
                    className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Báo Thiếu Cọc / Gửi Lại</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onViewBill(order)}
                    className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-purple-600" />
                    <span>Xem Bill</span>
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl text-xs font-medium flex items-center gap-1.5">
                    <span>⏳ Đang chờ khách quét VietQR cọc 50%</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => approveOrderDeposit(order.id, role === 'OWNER' ? 'ADMIN' : 'ADMIN')}
                    className="btn-primary text-xs py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm flex items-center gap-1 cursor-pointer font-bold"
                    title="Xác nhận cọc thủ công khi đã nhận được biến động số dư ngân hàng"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Duyệt Cọc Nhanh (Đã Nhận Tiền)</span>
                  </button>
                </div>
              )}
            </>
          )}

          {/* 3. Status ARRANGING */}
          {order.status === 'ARRANGING' && (
            <button
              type="button"
              onClick={() => updateOrderStatus(order.id, 'SHIPPING')}
              className="btn-primary text-xs py-1.5 px-3.5 bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer font-bold"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Bàn Giao Shipper &amp; Bắt Đầu Giao</span>
            </button>
          )}

          {/* 4. Status SHIPPING - CẶP NÚT GIAO THÀNH CÔNG & GIAO THẤT BẠI KÈM XÁC NHẬN */}
          {order.status === 'SHIPPING' && (
            <div className="flex items-center gap-2 flex-wrap">
              {/* Nút 1: Xác Nhận Giao Thành Công */}
              <button
                type="button"
                disabled={submittingOrderId === order.id}
                onClick={() => setOrderToConfirmDelivery(order)}
                className="btn-primary text-xs py-1.5 px-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer font-bold transition-all active:scale-95"
                title="Xác nhận shipper đã bàn giao hoa thành công đến tay người nhận"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Xác Nhận Đã Giao Thành Công</span>
              </button>

              {/* Nút 2: Báo Giao Thất Bại / Hủy Đơn */}
              <button
                type="button"
                onClick={() => {
                  setOrderToFailDelivery(order);
                  setFailReason('Khách không nghe máy sau 3 cuộc gọi');
                }}
                className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                title="Báo cáo shipper không giao được hoa (khách boom hàng, sai địa chỉ...)"
              >
                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                <span>Giao Thất Bại / Hủy Đơn</span>
              </button>
            </div>
          )}

          {/* 5. Status COMPLETED */}
          {order.status === 'COMPLETED' && (
            <span className="text-emerald-800 bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>✓ Đã giao thành công (+{order.pointsAwarded || 0} điểm)</span>
            </span>
          )}

          {/* 6. Status CANCELLED */}
          {order.status === 'CANCELLED' && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-rose-800 bg-rose-50 border border-rose-200 px-3 py-1 rounded-xl text-xs font-medium flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                <span>Đã hủy {order.cancellationReason ? `(${order.cancellationReason})` : ''}</span>
              </span>
              <button
                type="button"
                onClick={() => setOrderToDelete(order)}
                className="px-2.5 py-1 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-200 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                title={`Xóa vĩnh viễn đơn hủy #${order.id}`}
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Xóa đơn này</span>
              </button>
            </div>
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
  );
};

  return (
    <div className="glass-panel p-5 sm:p-6 space-y-4 rounded-[28px] animate-in fade-in duration-200">
      {/* 1. Header căn giữa chuẩn Phototiinlove */}
      <div className="pb-3 border-b border-slate-200/80 text-center">
        <small className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-amber-700">
          QUẢN LÝ ĐƠN HÀNG BOUTIQUE
        </small>
        <h2 className="font-extrabold text-sm sm:text-lg text-slate-900 tracking-tight">
          {title}
        </h2>
      </div>

      {/* 2. Action Toolbar: Ô tìm kiếm, Xuất CSV, Kho ảnh Drive & Bộ lọc */}
      <div className="flex flex-col gap-3 pb-3 border-b border-slate-200/70">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Search order (Không bị icon kính lúp đè chữ) */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <input
              type="text"
              placeholder="Tìm mã đơn (#849201...), tên hoặc SĐT..."
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
              className="glass-input w-full text-xs py-2 !pl-10 !pr-4 rounded-xl font-mono shadow-2xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleExportOrdersCsv}
              disabled={filteredOrders.length === 0}
              className={`btn-secondary py-1.5 px-3 text-xs rounded-xl flex items-center gap-1.5 cursor-pointer text-emerald-800 bg-emerald-50/90 border border-emerald-200/80 hover:bg-emerald-100 transition-colors shadow-2xs font-bold ${
                filteredOrders.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title="Xuất danh sách đơn hoa lọc được ra file CSV Excel"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="hidden sm:inline">Xuất CSV ({filteredOrders.length})</span>
              <span className="sm:hidden">CSV ({filteredOrders.length})</span>
            </button>

            {onOpenStorageManager && (
              <button
                type="button"
                onClick={onOpenStorageManager}
                className="btn-secondary py-1.5 px-3 text-xs rounded-xl flex items-center gap-1.5 cursor-pointer text-indigo-700 bg-indigo-50/90 border border-indigo-200/80 hover:bg-indigo-100 transition-colors shadow-2xs font-bold"
                title="Quản lý dung lượng ảnh bill và cấu hình đồng bộ Google Drive"
              >
                <HardDrive className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span className="hidden sm:inline">Kho Ảnh &amp; Drive</span>
                <span className="sm:hidden">Kho Ảnh</span>
              </button>
            )}
          </div>
        </div>

        {/* Status Filter (Hàng 1: Quy trình tiến độ) */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs py-1 scrollbar-none">
          <button
            type="button"
            onClick={() => handleSelectOrderStatus('ALL')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer font-medium ${
              orderStatusFilter === 'ALL'
                ? 'bg-purple-700 text-white font-semibold shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tất cả ({totalOrdersCount})
          </button>
          <button
            type="button"
            onClick={() => handleSelectOrderStatus('PENDING')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer font-medium ${
              orderStatusFilter === 'PENDING'
                ? 'bg-purple-700 text-white font-semibold shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Chờ duyệt kho ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => handleSelectOrderStatus('WAITING_DEPOSIT')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer font-medium ${
              orderStatusFilter === 'WAITING_DEPOSIT'
                ? 'bg-purple-700 text-white font-semibold shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Chờ cọc 50% ({waitingDepositCount})
          </button>
          <button
            type="button"
            onClick={() => handleSelectOrderStatus('ARRANGING')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer font-medium ${
              orderStatusFilter === 'ARRANGING'
                ? 'bg-purple-700 text-white font-semibold shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Đang cắm ({arrangingCount})
          </button>
          <button
            type="button"
            onClick={() => handleSelectOrderStatus('SHIPPING')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer font-medium ${
              orderStatusFilter === 'SHIPPING'
                ? 'bg-purple-700 text-white font-semibold shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Đang giao ({shippingCount})
          </button>
          <button
            type="button"
            onClick={() => handleSelectOrderStatus('COMPLETED')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer font-medium ${
              orderStatusFilter === 'COMPLETED'
                ? 'bg-purple-700 text-white font-semibold shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Hoàn thành ({completedCount})
          </button>
          <button
            type="button"
            onClick={() => handleSelectOrderStatus('CANCELLED')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer font-medium ${
              orderStatusFilter === 'CANCELLED'
                ? 'bg-rose-700 text-white font-semibold shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Đã hủy ({cancelledCount})
          </button>
        </div>
      </div>

      {/* Deposit Status Filter Sub-Bar (Hàng 2: Trạng thái cọc) */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs py-1 border-b border-slate-100 scrollbar-none">
        <span className="text-[11px] text-slate-400 font-semibold shrink-0">Lọc cọc:</span>
        <button
          type="button"
          onClick={() => handleSelectDepositFilter('ALL')}
          className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-all cursor-pointer font-medium text-[11px] ${
            depositFilter === 'ALL'
              ? 'bg-amber-600 text-white font-bold shadow-xs'
              : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
          }`}
        >
          Tất cả trạng thái cọc ({totalOrdersCount})
        </button>
        <button
          type="button"
          onClick={() => handleSelectDepositFilter('PENDING')}
          className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-all cursor-pointer font-medium text-[11px] ${
            depositFilter === 'PENDING'
              ? 'bg-amber-600 text-white font-bold shadow-xs'
              : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
          }`}
        >
          ⏳ Chờ duyệt cọc ({depositPendingCount})
        </button>
        <button
          type="button"
          onClick={() => handleSelectDepositFilter('APPROVED')}
          className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-all cursor-pointer font-medium text-[11px] ${
            depositFilter === 'APPROVED'
              ? 'bg-emerald-600 text-white font-bold shadow-xs'
              : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
          }`}
        >
          ✓ Đã duyệt cọc ({depositApprovedCount})
        </button>
        <button
          type="button"
          onClick={() => handleSelectDepositFilter('REJECTED')}
          className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-all cursor-pointer font-medium text-[11px] ${
            depositFilter === 'REJECTED'
              ? 'bg-rose-600 text-white font-bold shadow-xs'
              : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
          }`}
        >
          ⚠️ Cọc bị từ chối ({depositRejectedCount})
        </button>
      </div>

      {/* BULK ACTION BAR CHO ĐƠN HÀNG ĐÃ HỦY - TONE XANH NHẠT MỜ MƯỢT TƯƠI SÁNG & ROSE */}
      {(orderStatusFilter === 'CANCELLED' || selectedCancelledOrderIds.length > 0) && (
        <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-50/95 via-teal-50/90 to-emerald-100/95 backdrop-blur-md border border-emerald-200/90 text-slate-800 shadow-lg shadow-emerald-900/10 flex items-center justify-between gap-3 flex-wrap animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-black bg-rose-600 text-white px-3 py-1 rounded-xl shadow-xs">
              Đã chọn {selectedCancelledOrderIds.length}/{filteredCancelledOrders.length} đơn hủy
            </span>
            {filteredCancelledOrders.length > 0 && (
              <button
                type="button"
                onClick={handleToggleSelectAllCancelled}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline underline-offset-2 cursor-pointer transition-colors"
              >
                {selectedCancelledOrderIds.length === filteredCancelledOrders.length && filteredCancelledOrders.length > 0
                  ? 'Bỏ chọn tất cả'
                  : 'Chọn tất cả đơn hủy'}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {selectedCancelledOrderIds.length > 0 && (
              <button
                type="button"
                onClick={() => setIsBulkDeleteModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95"
                title="Xóa vĩnh viễn các đơn hủy đã chọn"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa {selectedCancelledOrderIds.length} đơn đã chọn</span>
              </button>
            )}

            {cancelledOrders.length > 0 && (
              <button
                type="button"
                onClick={() => setIsClearAllModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-white/90 hover:bg-rose-50 text-rose-700 hover:text-rose-900 border border-rose-200/90 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                title="Dọn sạch toàn bộ các đơn hàng đã bị hủy khỏi cơ sở dữ liệu"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                <span>Dọn sạch tất cả đơn hủy ({cancelledOrders.length})</span>
              </button>
            )}

            {selectedCancelledOrderIds.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedCancelledOrderIds([])}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-emerald-100/80 transition-colors cursor-pointer"
                title="Bỏ chọn"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* View Switcher: List vs Delivery Calendar */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200/80">
          <button
            type="button"
            onClick={() => setViewMode('LIST')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'LIST'
                ? 'bg-white text-purple-950 shadow-xs border border-slate-200/80'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            📋 Dạng Danh Sách ({filteredOrders.length})
          </button>
          <button
            type="button"
            onClick={() => setViewMode('CALENDAR')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'CALENDAR'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>📅 Lịch Giao Hoa Theo Khung Giờ</span>
          </button>
        </div>
      </div>

      {/* Orders Table Cards */}
      <div className="space-y-3.5">
        {filteredOrders.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            Không tìm thấy đơn hàng nào phù hợp với bộ lọc.
          </div>
        ) : viewMode === 'LIST' ? (
          filteredOrders.map((order) => renderOrderCard(order, false))
        ) : (
          /* CALENDAR VIEW (Grouped by Delivery Date & Time Slot) */
          groupedOrdersByDate.map(([dateStr, dateOrders]) => {
            const badge = getDateBadge(dateStr);
            const totalMoney = dateOrders.reduce((sum, o) => sum + o.totalAmount, 0);

            return (
              <div key={dateStr} className="p-4 rounded-3xl bg-slate-50/90 border border-slate-200/90 space-y-3 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-xl text-xs font-black border ${badge.bg}`}>
                      {badge.label}
                    </span>
                    <span className="text-xs font-bold text-slate-800">Lịch giao: {dateStr}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-600 flex items-center gap-3">
                    <span>
                      <strong className="text-purple-700">{dateOrders.length}</strong> đơn hoa hẹn giờ
                    </span>
                    <span>•</span>
                    <span>
                      Tổng doanh số: <strong className="text-emerald-700 font-extrabold">{formatPrice(totalMoney)}</strong>
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {dateOrders.map((order) => renderOrderCard(order, true))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Reject Modal (Dùng createPortal vào document.body để nổi hẳn lên toàn màn hình, căn giữa tuyệt đối) */}
      {rejectModalState.isOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[100050] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setRejectModalState({ isOpen: false, orderId: null, mode: 'ORDER_REJECT', reason: '' })}
        >
          <div
            className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl space-y-3.5 border border-slate-100 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>
                  {rejectModalState.mode === 'ORDER_REJECT' ? 'Từ chối nhận đơn hàng' : 'Báo thiếu cọc / Yêu cầu gửi lại'}
                </span>
              </h4>
              <button
                type="button"
                onClick={() => setRejectModalState({ isOpen: false, orderId: null, mode: 'ORDER_REJECT', reason: '' })}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              {rejectModalState.mode === 'ORDER_REJECT'
                ? 'Vui lòng chọn hoặc nhập lý do từ chối. Hệ thống sẽ gửi thông báo lịch sự đến khách hàng:'
                : 'Vui lòng chọn hoặc nhập lý do từ chối biên lai cọc. Khách hàng sẽ nhận thông báo để gửi lại:'}
            </p>

            <div className="space-y-1.5">
              {(rejectModalState.mode === 'ORDER_REJECT'
                ? [
                    'Tạm hết loại hoa tươi theo mẫu trong kho',
                    'Quá tải đơn hỏa tốc trong khung giờ này',
                    'Địa chỉ giao hoa nằm ngoài bán kính phục vụ',
                    'Không liên lạc được với khách để xác nhận'
                  ]
                : [
                    'Số tiền chuyển chưa đủ 50% tiền cọc',
                    'Sai nội dung cú pháp chuyển khoản',
                    'Ảnh biên lai mờ / không kiểm tra được mã GD',
                    'Tài khoản tiệm chưa nhận được tiền nổi'
                  ]
              ).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setRejectModalState((prev) => ({ ...prev, reason: preset }))}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors cursor-pointer border ${
                    rejectModalState.reason === preset
                      ? 'bg-purple-50 text-purple-900 border-purple-300 font-semibold shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                Lý do chi tiết gửi khách:
              </label>
              <textarea
                rows={2}
                value={rejectModalState.reason}
                onChange={(e) => setRejectModalState((prev) => ({ ...prev, reason: e.target.value }))}
                className="glass-input w-full text-xs p-2.5 rounded-xl border border-slate-200"
                placeholder="Nhập lý do cụ thể..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalState({ isOpen: false, orderId: null, mode: 'ORDER_REJECT', reason: '' })}
                className="btn-secondary py-2 px-4 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="py-2 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-sm active:scale-95 transition-all"
              >
                Xác Nhận Gửi Khách
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Preview sample image modal (Dùng createPortal vào document.body) */}
      {previewSampleImage && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[100050] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewSampleImage(null)}
        >
          <div
            className="bg-white p-4 rounded-3xl max-w-md w-full space-y-3 shadow-2xl border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800">Ảnh mẫu hoa khách gửi yêu cầu</span>
              <button
                type="button"
                onClick={() => setPreviewSampleImage(null)}
                className="text-xs text-slate-400 hover:text-slate-800 font-bold cursor-pointer"
              >
                Đóng
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden max-h-96 border border-slate-200">
              <img src={previewSampleImage} alt="Mẫu hoa yêu cầu" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL IN PHIẾU GIAO HOA NGHỆ THUẬT (Dùng createPortal vào document.body) */}
      {orderToPrint && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[100050] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 animate-fade-in print:p-0 print:bg-white print:fixed print:inset-0">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200 print:border-none print:shadow-none print:rounded-none max-h-[92vh] flex flex-col printable-delivery-slip">
            {/* Modal Actions Bar (Hidden when printing) */}
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between print:hidden print-hide">
              <span className="font-bold text-xs text-slate-700 flex items-center gap-1.5">
                <Printer className="w-4 h-4 text-purple-700" />
                <span>Xem Trước &amp; In Phiếu Giao Hoa</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn-primary py-1.5 px-3.5 text-xs rounded-xl flex items-center gap-1 font-bold cursor-pointer bg-purple-700 hover:bg-purple-800 text-white"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>In Ngay</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOrderToPrint(null)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Area */}
            <div className="p-6 space-y-4 overflow-y-auto text-xs text-slate-800 print:text-black">
              {/* Header with Square Logo */}
              <div className="text-center border-b border-dashed border-slate-300 pb-3 space-y-2">
                <div className="flex items-center justify-center gap-3">
                  <img
                    src={settings.logoVerticalUrl || settings.faviconUrl || '/logo.png'}
                    alt={settings.name || 'V&V Florielle'}
                    className="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-xl border border-slate-200/80 p-1 bg-white print:border-none shadow-xs shrink-0"
                  />
                  <div className="text-left space-y-0.5">
                    <h3 className="font-black text-sm tracking-wider uppercase text-slate-900">
                      {settings.name || 'V&V FLORIELLE'}
                    </h3>
                    <p className="text-[10.5px] text-slate-600 font-medium">Tiệm Hoa Nghệ Thuật &amp; Thiết Kế Hoa</p>
                    <p className="text-[10px] text-slate-500">{settings.address || '105 Doãn Kế Thiện, Mai Dịch, Cầu Giấy, Hà Nội'}</p>
                    <p className="text-[10px] text-slate-500">Hotline: {settings.hotline || '0906.721.442'} • Web: vvflorielle.vn</p>
                  </div>
                </div>
                <div className="pt-2 font-mono font-bold text-base text-purple-900 border-t border-slate-100">
                  PHIẾU GIAO HOA NGHỆ THUẬT
                </div>
                <div className="font-mono text-[11px] text-slate-600">
                  Mã đơn: #{orderToPrint.id} • Ngày tạo: {orderToPrint.createdAt}
                </div>
              </div>

              {/* Delivery info */}
              <div className="space-y-1.5 border-b border-dashed border-slate-300 pb-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-500 block">NGƯỜI ĐẶT HOA:</span>
                    <strong className="text-xs">{orderToPrint.senderName}</strong>
                    <span className="block font-mono text-[11px]">{orderToPrint.senderPhone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">NGƯỜI NHẬN HOA:</span>
                    <strong className="text-xs text-emerald-800">{orderToPrint.recipientName}</strong>
                    <span className="block font-mono text-[11px]">{orderToPrint.recipientPhone}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">ĐỊA CHỈ GIAO:</span>
                  <span className="font-medium">{orderToPrint.recipientAddress}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div>
                    <span className="text-slate-500">Hẹn giao:</span> <strong>{orderToPrint.deliveryDate}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Khung giờ:</span> <strong>{orderToPrint.deliveryTimeSlot}</strong>
                  </div>
                </div>
              </div>

              {/* Card message */}
              {orderToPrint.cardMessage && (
                <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-100 text-[11px] space-y-0.5">
                  <span className="font-bold text-rose-800 block">💌 LỜI CHÚC TRÊN THIỆP:</span>
                  <p className="italic text-slate-700">"{orderToPrint.cardMessage}"</p>
                </div>
              )}

              {/* Items Table */}
              <div className="space-y-1.5 border-b border-dashed border-slate-300 pb-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase">CHI TIẾT MẪU HOA:</span>
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-1">Mẫu hoa</th>
                      <th className="py-1 text-center">SL</th>
                      <th className="py-1 text-right">Đơn giá</th>
                      <th className="py-1 text-right">T.Tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orderToPrint.items.map((it, idx) => (
                      <tr key={idx}>
                        <td className="py-1 font-medium">{it.productName} ({it.ribbonColor})</td>
                        <td className="py-1 text-center font-mono">{it.quantity}</td>
                        <td className="py-1 text-right font-mono">{formatPrice(it.price)}</td>
                        <td className="py-1 text-right font-mono font-semibold">{formatPrice(it.price * it.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Price summary */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Tiền hoa:</span>
                  <span className="font-mono">{formatPrice(orderToPrint.flowerPrice)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Phí ship ({orderToPrint.shippingDistanceKm || 1} km):</span>
                  <span className="font-mono">{formatPrice(orderToPrint.shippingFee || 0)}</span>
                </div>
                {orderToPrint.discountAmount ? (
                  <div className="flex justify-between text-rose-600">
                    <span>Giảm voucher:</span>
                    <span className="font-mono">-{formatPrice(orderToPrint.discountAmount)}</span>
                  </div>
                ) : null}
                <div className="flex justify-between text-slate-800 font-bold pt-1 border-t border-slate-200">
                  <span>Tổng giá trị đơn:</span>
                  <span className="font-mono">{formatPrice(orderToPrint.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Đã thanh toán cọc:</span>
                  <span className="font-mono font-medium text-emerald-700">
                    {orderToPrint.paymentStatus === 'PAID'
                      ? formatPrice(orderToPrint.totalAmount)
                      : formatPrice(orderToPrint.depositAmount || 0)}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-300 flex justify-between items-center text-sm font-black mt-2">
                  <span className="uppercase text-slate-900">
                    {orderToPrint.paymentStatus === 'PAID' ? 'TIỀN CẦN THU:' : 'TIỀN CÒN LẠI CẦN THU (COD):'}
                  </span>
                  <span className="font-mono text-base text-rose-700">
                    {orderToPrint.paymentStatus === 'PAID' ? '0đ (ĐÃ THU ĐỦ)' : formatPrice(orderToPrint.remainingAmount || 0)}
                  </span>
                </div>
              </div>

              {/* Signature area */}
              <div className="grid grid-cols-2 gap-4 text-center pt-4 text-[11px] text-slate-600">
                <div className="space-y-8">
                  <span>Người giao hoa (Shipper)</span>
                  <span className="block text-[10px] text-slate-400">(Ký và ghi rõ họ tên)</span>
                </div>
                <div className="space-y-8">
                  <span>Người nhận hoa</span>
                  <span className="block text-[10px] text-slate-400">(Ký và ghi rõ họ tên)</span>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* 1. Modal Single Cancelled Order Delete Confirmation */}
      <ActionConfirmModal
        isOpen={Boolean(orderToDelete)}
        onClose={() => setOrderToDelete(null)}
        onConfirm={() => {
          if (orderToDelete) {
            deleteOrder(orderToDelete.id);
            setSelectedCancelledOrderIds((prev) => prev.filter((id) => id !== orderToDelete.id));
            setOrderToDelete(null);
          }
        }}
        title="Xóa Vĩnh Viễn Đơn Hủy"
        message={`Bạn có chắc chắn muốn xóa vĩnh viễn đơn hủy #${orderToDelete?.id} của khách "${orderToDelete?.senderName}" không? Thao tác này sẽ giải phóng bộ nhớ và không thể khôi phục lại.`}
        confirmText="Xóa Vĩnh Viễn"
        type="danger"
      />

      {/* 2. Modal Bulk Cancelled Orders Delete Confirmation */}
      <ActionConfirmModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={() => {
          deleteCancelledOrders(selectedCancelledOrderIds);
          setSelectedCancelledOrderIds([]);
          setIsBulkDeleteModalOpen(false);
        }}
        title="Xóa Hàng Loạt Đơn Hủy Đã Chọn"
        message={`Bạn có chắc chắn muốn xóa vĩnh viễn ${selectedCancelledOrderIds.length} đơn hủy đã chọn không? Toàn bộ dữ liệu của các đơn này sẽ được giải phóng hoàn toàn khỏi hệ thống.`}
        confirmText={`Xóa ${selectedCancelledOrderIds.length} Đơn Hủy`}
        type="danger"
      />

      {/* 3. Modal Clear All Cancelled Orders Confirmation */}
      <ActionConfirmModal
        isOpen={isClearAllModalOpen}
        onClose={() => setIsClearAllModalOpen(false)}
        onConfirm={() => {
          clearAllCancelledOrders();
          setSelectedCancelledOrderIds([]);
          setIsClearAllModalOpen(false);
        }}
        title="Dọn Sạch Toàn Bộ Đơn Hủy"
        message={`CẢNH BÁO: Thao tác này sẽ xóa vĩnh viễn toàn bộ ${cancelledOrders.length} đơn hàng đã bị hủy khỏi cơ sở dữ liệu để giải phóng bộ nhớ. Bạn có chắc chắn muốn dọn sạch tất cả không?`}
        confirmText={`Dọn Sạch ${cancelledOrders.length} Đơn`}
        type="danger"
      />

      {/* 4. Modal Confirm Successful Delivery */}
      <ActionConfirmModal
        isOpen={Boolean(orderToConfirmDelivery)}
        onClose={() => setOrderToConfirmDelivery(null)}
        onConfirm={handleConfirmDeliverySuccess}
        title="Xác Nhận Đã Giao Thành Công"
        message={`Bạn có chắc chắn mẫu hoa của đơn #${orderToConfirmDelivery?.id} đã được shipper bàn giao tận tay người nhận "${orderToConfirmDelivery?.recipientName}" và thu đủ tiền còn lại (nếu có)? Hệ thống sẽ chuyển trạng thái sang ĐÃ HOÀN THÀNH và tự động cộng điểm thưởng cho khách hàng.`}
        confirmText="Xác Nhận Đã Giao Thành Công"
        type="info"
      />

      {/* 5. Modal Delivery Failed with Reason Required */}
      {orderToFailDelivery && typeof document !== 'undefined' && createPortal(
        <div className="glass-overlay z-[100000] p-4 flex items-center justify-center animate-in fade-in duration-200" onClick={() => setOrderToFailDelivery(null)}>
          <div className="glass-modal-content max-w-md w-full rounded-[28px] border border-white/80 bg-white shadow-2xl overflow-hidden p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold shadow-xs">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">Báo Giao Thất Bại &amp; Hủy Đơn</h3>
                  <p className="text-[11px] text-slate-500">Đơn hàng #{orderToFailDelivery.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOrderToFailDelivery(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Lý do giao không thành công * (Lưu lại làm bằng chứng đối soát)
              </label>
              
              {/* Quick suggestion pills */}
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {[
                  'Khách không nghe máy sau 3 cuộc gọi',
                  'Khách từ chối nhận hoa / Hủy ngang',
                  'Địa chỉ giao không chính xác / Không tìm thấy',
                  'Hoa bị dập nát / Shipper hoàn đơn'
                ].map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => setFailReason(sug)}
                    className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      failReason === sug
                        ? 'bg-rose-100 text-rose-800 border-rose-300 font-bold'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {sug}
                  </button>
                ))}
              </div>

              <textarea
                rows={3}
                value={failReason}
                onChange={(e) => setFailReason(e.target.value)}
                placeholder="Nhập chi tiết lý do shipper không giao được hoa..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setOrderToFailDelivery(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={!failReason.trim()}
                onClick={handleConfirmDeliveryFailed}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs cursor-pointer disabled:opacity-50"
              >
                Xác Nhận Giao Thất Bại
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* 6. Modal Level-2 PIN Override for Dropdown */}
      {pendingStatusOverride && typeof document !== 'undefined' && createPortal(
        <div className="glass-overlay z-[100000] p-4 flex items-center justify-center animate-in fade-in duration-200" onClick={() => setPendingStatusOverride(null)}>
          <div className="glass-modal-content max-w-md w-full rounded-[28px] border border-white/80 bg-white shadow-2xl overflow-hidden p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold shadow-xs">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">Xác Nhận Can Thiệp Quy Trình</h3>
                  <p className="text-[11px] text-slate-500">Đơn hàng #{pendingStatusOverride.orderId}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPendingStatusOverride(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 space-y-1">
                <p>
                  Bạn đang can thiệp chuyển quy trình từ: <strong className="text-slate-900">{getStatusLabel(pendingStatusOverride.oldStatus)}</strong> sang: <strong className="text-purple-800">{getStatusLabel(pendingStatusOverride.newStatus)}</strong>.
                </p>
                <p className="text-[11px] text-amber-800">
                  * Thao tác này sẽ tự động đồng bộ lại toàn bộ dữ liệu tiền cọc và thanh toán bên dưới thẻ đơn.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nhập Mã PIN Quản Trị Cấp 2 (6 số) *
                </label>
                <input
                  type="password"
                  maxLength={8}
                  autoFocus
                  value={overridePinInput}
                  onChange={(e) => {
                    setOverridePinInput(e.target.value);
                    setOverridePinError('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleConfirmOverrideStatusWithPin();
                  }}
                  placeholder="Nhập mã PIN 6 số..."
                  className="w-full text-center tracking-widest text-base font-mono font-bold p-2.5 rounded-xl border border-slate-300 focus:border-purple-600 focus:outline-none"
                />
                {overridePinError && (
                  <p className="text-[11px] text-rose-600 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{overridePinError}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPendingStatusOverride(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={!overridePinInput.trim()}
                onClick={handleConfirmOverrideStatusWithPin}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-700 hover:bg-purple-800 text-white shadow-xs cursor-pointer disabled:opacity-50"
              >
                Xác Nhận Đổi Trạng Thái
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* 7. Modal Force Delete with Level-2 PIN */}
      {orderToForceDelete && typeof document !== 'undefined' && createPortal(
        <div className="glass-overlay z-[100000] p-4 flex items-center justify-center animate-in fade-in duration-200" onClick={() => setOrderToForceDelete(null)}>
          <div className="glass-modal-content max-w-md w-full rounded-[28px] border border-white/80 bg-white shadow-2xl overflow-hidden p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">Xóa Cưỡng Chế Đơn Hàng</h3>
                  <p className="text-[11px] text-slate-500">Đơn hàng #{orderToForceDelete.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOrderToForceDelete(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1">
                <p>
                  <strong>CẢNH BÁO NGUY HIỂM:</strong> Bạn đang chuẩn bị xóa cưỡng chế đơn #{orderToForceDelete.id} của khách "{orderToForceDelete.senderName}".
                </p>
                <p className="text-[11px] text-rose-800">
                  * Nếu đơn đã từng tặng điểm thưởng cho khách, hệ thống sẽ tự động thu hồi lại số điểm đó. Dữ liệu đơn sẽ bị xóa sạch khỏi bộ nhớ.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nhập Mã PIN Quản Trị Cấp 2 (6 số) để xác nhận xóa *
                </label>
                <input
                  type="password"
                  maxLength={8}
                  autoFocus
                  value={forceDeletePinInput}
                  onChange={(e) => {
                    setForceDeletePinInput(e.target.value);
                    setForceDeletePinError('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleConfirmForceDeleteWithPin();
                  }}
                  placeholder="Nhập mã PIN 6 số..."
                  className="w-full text-center tracking-widest text-base font-mono font-bold p-2.5 rounded-xl border border-slate-300 focus:border-rose-600 focus:outline-none"
                />
                {forceDeletePinError && (
                  <p className="text-[11px] text-rose-600 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{forceDeletePinError}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setOrderToForceDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={!forceDeletePinInput.trim()}
                onClick={handleConfirmForceDeleteWithPin}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs cursor-pointer disabled:opacity-50"
              >
                Xóa Cưỡng Chế Vĩnh Viễn
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
