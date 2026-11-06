import React, { useState } from 'react';
import { Order, OrderStatus } from '../../types';
import {
  ShoppingBag,
  Clock,
  Sparkles,
  Truck,
  CheckCircle2,
  MapPin,
  Upload,
  RotateCcw,
  QrCode
} from 'lucide-react';
import { OrderQrModal } from '../popups/OrderQrModal';

interface CustomerOrdersTabProps {
  orders: Order[];
  statusFilter: 'ALL' | OrderStatus;
  setStatusFilter: (st: 'ALL' | OrderStatus) => void;
  formatPrice: (price: number) => string;
  onReorder: (productId: string, ribbonColor: string, cardMessage: string) => void;
  onUploadBill: (orderId: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  onGoToStore: () => void;
}

export const CustomerOrdersTab: React.FC<CustomerOrdersTabProps> = ({
  orders,
  statusFilter,
  setStatusFilter,
  formatPrice,
  onReorder,
  onUploadBill,
  onGoToStore
}) => {
  const [selectedQrOrder, setSelectedQrOrder] = useState<Order | null>(null);

  return (
    <div className="space-y-4">
      {/* Order Status Filters */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-semibold overflow-x-auto">
        {(['ALL', 'PENDING', 'ARRANGING', 'SHIPPING', 'COMPLETED'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              statusFilter === st
                ? 'bg-white text-emerald-800 shadow-sm font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {st === 'ALL' && 'Tất cả'}
            {st === 'PENDING' && 'Chờ cọc'}
            {st === 'ARRANGING' && 'Đang cắm'}
            {st === 'SHIPPING' && 'Đang giao'}
            {st === 'COMPLETED' && 'Đã giao'}
          </button>
        ))}
      </div>

      {/* Orders List Content */}
      {orders.length === 0 ? (
        <div className="glass-panel p-12 text-center text-slate-400 space-y-3 rounded-3xl border border-slate-200">
          <ShoppingBag className="w-12 h-12 mx-auto text-slate-300" />
          <p className="text-sm font-medium">Chưa có đơn hoa nào trong mục này</p>
          <button
            onClick={onGoToStore}
            className="btn-primary text-xs py-2 px-5 rounded-xl cursor-pointer"
          >
            Khám phá mẫu hoa tươi ngay
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const stepIndex =
              order.status === 'PENDING'
                ? 0
                : order.status === 'ARRANGING'
                ? 1
                : order.status === 'SHIPPING'
                ? 2
                : order.status === 'COMPLETED'
                ? 3
                : -1;

            return (
              <div
                key={order.id}
                className="glass-panel p-5 rounded-3xl space-y-4 border border-slate-200/90 shadow-sm"
              >
                {/* Order Top Meta */}
                <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm text-emerald-800">
                      #{order.id}
                    </span>
                    <span className="text-xs text-slate-400">• {order.createdAt}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">
                      {formatPrice(order.totalAmount)}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        order.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'SHIPPING'
                          ? 'bg-sky-100 text-sky-800'
                          : order.status === 'ARRANGING'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {order.status === 'PENDING' && 'Chờ cọc / Chờ duyệt'}
                      {order.status === 'ARRANGING' && 'Đang cắm hoa'}
                      {order.status === 'SHIPPING' && 'Shipper đang giao'}
                      {order.status === 'COMPLETED' && 'Đã hoàn thành'}
                      {order.status === 'CANCELLED' && 'Đã hủy'}
                    </span>
                  </div>
                </div>

                {/* 4-Step Visual Progress Bar */}
                {order.status !== 'CANCELLED' && (
                  <div className="py-2">
                    <div className="grid grid-cols-4 gap-2 text-center">
                      {[
                        { label: 'Chờ cọc', icon: Clock },
                        { label: 'Đang cắm', icon: Sparkles },
                        { label: 'Đang giao', icon: Truck },
                        { label: 'Đã giao', icon: CheckCircle2 }
                      ].map((s, idx) => {
                        const isDone = stepIndex >= idx;
                        const isCurrent = stepIndex === idx;
                        const IconComp = s.icon;
                        return (
                          <div key={s.label} className="flex flex-col items-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 text-xs font-bold transition-all ${
                                isDone
                                  ? 'bg-emerald-600 text-white shadow-sm'
                                  : 'bg-slate-100 text-slate-400'
                              } ${isCurrent ? 'ring-2 ring-emerald-400 ring-offset-2' : ''}`}
                            >
                              <IconComp className="w-4 h-4" />
                            </div>
                            <span
                              className={`text-[10px] ${
                                isDone ? 'font-bold text-emerald-800' : 'text-slate-400'
                              }`}
                            >
                              {s.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-700">{item.quantity}x</span>
                        <span className="font-semibold text-slate-800">{item.productName}</span>
                        <span className="text-[11px] text-slate-400">({item.ribbonColor})</span>
                      </div>
                      <span className="font-bold text-slate-700">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                {/* Delivery & Recipient Meta */}
                <div className="p-3 rounded-2xl bg-slate-50/90 text-xs text-slate-600 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>
                      Người nhận: <strong>{order.recipientName}</strong> ({order.recipientPhone}) • {order.recipientAddress}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Thời gian: {order.deliveryDate} ({order.deliveryTimeSlot})</span>
                  </div>
                  {order.cardMessage && (
                    <div className="text-[11px] text-slate-500 italic pl-5">
                      Thiệp: "{order.cardMessage}"
                    </div>
                  )}
                </div>

                {/* Bill Upload Prompt if Pending and No Bill */}
                {order.status === 'PENDING' && !order.paymentBillImage && (
                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-2 flex-wrap">
                    <div className="text-xs text-amber-900">
                      <strong>Bạn đã quét mã cọc chưa?</strong> Vui lòng tải ảnh biên lai lên để tiệm duyệt đơn ngay!
                    </div>
                    <label className="py-1 px-3 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl cursor-pointer flex items-center gap-1 shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Tải ảnh biên lai</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => onUploadBill(order.id, e)}
                      />
                    </label>
                  </div>
                )}

                {/* Bill uploaded preview */}
                {order.paymentBillImage && (
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50 text-xs text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      Đã tải biên lai • {order.paymentApprovedBy ? `Đã duyệt bởi ${order.paymentApprovedBy}` : 'Trợ lý AI đang đối soát (2 phút)'}
                    </span>
                  </div>
                )}

                {/* Actions: Mã QR Nhận Hoa & Reorder */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100 flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedQrOrder(order)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-colors cursor-pointer shadow-2xs"
                    title="Bấm để hiển thị mã QR xuất trình cho Florist/Shipper nhận hoa và tích điểm"
                  >
                    <QrCode className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Mã QR Nhận Hoa</span>
                  </button>

                  <button
                    onClick={() => onReorder(order.items[0]?.productId, order.items[0]?.ribbonColor, order.cardMessage)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Đặt lại mẫu hoa này</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal QR Code cho đơn hàng */}
      <OrderQrModal
        order={selectedQrOrder}
        isOpen={Boolean(selectedQrOrder)}
        onClose={() => setSelectedQrOrder(null)}
        formatPrice={formatPrice}
      />
    </div>
  );
};
