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
  QrCode,
  CreditCard,
  AlertCircle,
  Image as ImageIcon
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
  const [previewSampleImage, setPreviewSampleImage] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {/* Order Status Filters */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-semibold overflow-x-auto">
        {(['ALL', 'PENDING', 'WAITING_DEPOSIT', 'ARRANGING', 'SHIPPING', 'COMPLETED'] as const).map((st) => (
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
            {st === 'PENDING' && 'Chờ duyệt kho'}
            {st === 'WAITING_DEPOSIT' && 'Chờ cọc 50%'}
            {st === 'ARRANGING' && 'Đang cắm hoa'}
            {st === 'SHIPPING' && 'Đang giao'}
            {st === 'COMPLETED' && 'Đã hoàn tất'}
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
                : order.status === 'WAITING_DEPOSIT'
                ? 1
                : order.status === 'ARRANGING'
                ? 2
                : order.status === 'SHIPPING'
                ? 3
                : order.status === 'COMPLETED'
                ? 4
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
                    {order.isCustomDesign && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                        Thiết kế riêng
                      </span>
                    )}
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
                          : order.status === 'WAITING_DEPOSIT'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {order.status === 'PENDING' && 'Tiệm đang duyệt kho'}
                      {order.status === 'WAITING_DEPOSIT' && 'Chờ cọc 50%'}
                      {order.status === 'ARRANGING' && 'Đang cắm hoa'}
                      {order.status === 'SHIPPING' && 'Shipper đang giao'}
                      {order.status === 'COMPLETED' && 'Đã hoàn thành'}
                      {order.status === 'CANCELLED' && 'Tiệm từ chối / Đã hủy'}
                    </span>
                  </div>
                </div>

                {/* 5-Step Visual Progress Bar */}
                {order.status !== 'CANCELLED' && (
                  <div className="py-2">
                    <div className="grid grid-cols-5 gap-1.5 text-center">
                      {[
                        { label: 'Duyệt kho', icon: Clock },
                        { label: 'Cọc 50%', icon: CreditCard },
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
                              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mb-1 text-xs font-bold transition-all ${
                                isDone
                                  ? 'bg-emerald-600 text-white shadow-sm'
                                  : 'bg-slate-100 text-slate-400'
                              } ${isCurrent ? 'ring-2 ring-emerald-400 ring-offset-2' : ''}`}
                            >
                              <IconComp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </div>
                            <span
                              className={`text-[9px] sm:text-[10px] ${
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

                {/* Order Status Contextual Action Box */}
                {order.status === 'PENDING' && (
                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Tiệm đang kiểm tra kho hoa tươi &amp; lịch cắm (3-5 phút)</span>
                    </div>
                    <p className="text-[11px] text-amber-800">
                      Để đảm bảo hoa luôn tươi đẹp nhất, nghệ nhân đang đối soát kho hoa tươi. Khi tiệm duyệt nhận đơn, bạn sẽ nhận được thông báo để chuyển cọc 50%!
                    </p>
                  </div>
                )}

                {order.status === 'WAITING_DEPOSIT' && (
                  <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-xs space-y-2.5">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <div className="font-bold text-blue-900 flex items-center gap-1.5">
                          <CreditCard className="w-4 h-4 text-blue-600" />
                          <span>Tiệm đã duyệt nhận đơn! Mời bạn chuyển cọc 50%</span>
                        </div>
                        <p className="text-[11px] text-blue-800 mt-0.5">
                          Số tiền cọc: <strong className="text-emerald-700 font-extrabold">{formatPrice(order.depositAmount)}</strong> (50% tổng đơn)
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedQrOrder(order)}
                          className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1 cursor-pointer shadow-xs"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>Mở Mã VietQR Cọc</span>
                        </button>
                        <label className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1 cursor-pointer shadow-xs">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{order.paymentBillImage ? 'Gửi lại Bill' : 'Tải Ảnh Bill Cọc'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => onUploadBill(order.id, e)}
                          />
                        </label>
                      </div>
                    </div>

                    {order.depositStatus === 'REJECTED' && (
                      <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px] space-y-1">
                        <div className="font-bold flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Biên lai cọc trước đó chưa được duyệt:</span>
                        </div>
                        <div>{order.depositRejectReason || 'Số tiền cọc chưa khớp hoặc ảnh chụp không rõ ràng. Vui lòng chuyển đủ và gửi lại biên lai.'}</div>
                      </div>
                    )}

                    {order.paymentBillImage && order.depositStatus !== 'REJECTED' && (
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-100/70 text-emerald-800 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Đã gửi ảnh biên lai cọc • Đang chờ tiệm kiểm tra tài khoản</span>
                      </div>
                    )}
                  </div>
                )}

                {order.status === 'CANCELLED' && (
                  <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1">
                    <div className="font-bold flex items-center gap-1">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      <span>Tiệm tạm thời chưa thể nhận đơn này</span>
                    </div>
                    {order.cancellationReason && (
                      <p className="text-[11px] text-rose-800">
                        Lý do: <strong>{order.cancellationReason}</strong>
                      </p>
                    )}
                    <p className="text-[11px] text-slate-500 italic">
                      Đơn hàng chưa phát sinh chi phí cọc của quý khách. Rất mong quý khách thông cảm!
                    </p>
                  </div>
                )}

                {order.status === 'COMPLETED' && (
                  <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
                    <div className="flex items-center gap-1.5 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Giao hoa thành công!</span>
                    </div>
                    {order.pointsAwarded && order.pointsAwarded > 0 ? (
                      <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[11px]">
                        🎉 +{order.pointsAwarded} điểm thưởng
                      </span>
                    ) : null}
                  </div>
                )}

                {order.isBillArchived && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Biên lai cọc VietQR đã được kế toán đối soát & lưu trữ kho đám mây an toàn</span>
                  </div>
                )}

                {/* Custom Design Sample Image Button */}
                {order.customDesignSampleImage && (
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setPreviewSampleImage(order.customDesignSampleImage || null)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 hover:text-purple-900 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Xem ảnh mẫu hoa yêu cầu</span>
                    </button>
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

      {/* Modal Preview ảnh mẫu thiết kế riêng */}
      {previewSampleImage && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setPreviewSampleImage(null)}
        >
          <div
            className="bg-white p-4 rounded-3xl max-w-md w-full space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800">Ảnh mẫu hoa yêu cầu thiết kế</span>
              <button
                type="button"
                onClick={() => setPreviewSampleImage(null)}
                className="text-xs text-slate-400 hover:text-slate-800 font-bold"
              >
                Đóng
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden max-h-96 border border-slate-200">
              <img src={previewSampleImage} alt="Mẫu hoa yêu cầu" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
