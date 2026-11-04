import React, { useState } from 'react';
import { Search, MapPin, Eye, CheckCircle2, Award, ArrowLeft } from 'lucide-react';
import { Order, OrderStatus } from '../../../types';

interface OrdersSubpageProps {
  orders: Order[];
  onBackToDashboard: () => void;
  title?: string;
  role?: 'ADMIN' | 'OWNER';
  formatPrice: (p: number) => string;
  updateOrderStatus: (id: string, st: OrderStatus) => void;
  approveOrderDeposit: (id: string, approvedBy?: 'ADMIN' | 'AUTO_ASSISTANT') => void;
  completeOrder: (id: string) => void;
  onViewBill: (order: Order) => void;
  onEditShipping: (order: { id: string; fee: number }) => void;
  initialSearch?: string;
}

export const OrdersSubpage: React.FC<OrdersSubpageProps> = ({
  orders,
  onBackToDashboard,
  title = 'Quản Lý Đơn Hàng & Vận Chuyển Hỏa Tốc',
  role = 'ADMIN',
  formatPrice,
  updateOrderStatus,
  approveOrderDeposit,
  completeOrder,
  onViewBill,
  onEditShipping,
  initialSearch = ''
}) => {
  const [orderSearch, setOrderSearch] = useState(initialSearch);
  const [orderStatusFilter, setOrderStatusFilter] = useState<'ALL' | OrderStatus>('ALL');

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.senderName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.senderPhone.includes(orderSearch) ||
      o.recipientName.toLowerCase().includes(orderSearch.toLowerCase());
    const matchStatus = orderStatusFilter === 'ALL' || o.status === orderStatusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="glass-panel p-5 sm:p-6 space-y-4 rounded-[28px] animate-in fade-in duration-200">
      {/* Back button & Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-slate-200/80">
        <button
          type="button"
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại Tổng Quan</span>
        </button>
        <h2 className="font-bold text-base sm:text-lg text-slate-800">{title}</h2>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/70">
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
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs py-1">
          {(['ALL', 'PENDING', 'ARRANGING', 'SHIPPING', 'COMPLETED', 'CANCELLED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setOrderStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
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
                    className="text-xs font-semibold py-1 px-3 rounded-xl border border-purple-200 bg-purple-50 text-purple-900 focus:outline-none cursor-pointer"
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
                      onClick={() => onEditShipping({ id: order.id, fee: order.shippingFee || 0 })}
                      className="text-[10px] text-purple-700 hover:text-purple-900 underline font-semibold ml-1 cursor-pointer"
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
                          : role === 'OWNER'
                          ? '🌸 Chủ Quán duyệt'
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
                      onClick={() => onViewBill(order)}
                      className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
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
                      className="btn-primary text-xs py-1.5 px-3.5 bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Duyệt cọc 50% &amp; Bắt đầu cắm hoa</span>
                    </button>
                  )}

                  {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
                    <button
                      type="button"
                      onClick={() => completeOrder(order.id)}
                      className="btn-primary text-xs py-1.5 px-3.5 bg-purple-700 hover:bg-purple-800 rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer"
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
  );
};
