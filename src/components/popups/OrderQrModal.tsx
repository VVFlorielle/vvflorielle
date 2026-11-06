import React from 'react';
import { X, QrCode, Sparkles, CheckCircle2, ShieldCheck, Copy } from 'lucide-react';
import { Order } from '../../types';

interface OrderQrModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  formatPrice?: (amount: number) => string;
}

export const OrderQrModal: React.FC<OrderQrModalProps> = ({
  order,
  isOpen,
  onClose,
  formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p)
}) => {
  if (!isOpen || !order) return null;

  const pointsEarned = Math.floor((order.flowerPrice || order.totalAmount) / 10000);
  const remainingAmount = order.paymentType === 'VIETQR_DEPOSIT_50' && order.paymentStatus === 'PARTIAL_PAID'
    ? (order.remainingAmount || Math.ceil(order.totalAmount / 2))
    : 0;

  // QR Payload encode orderId and secure token
  const qrData = encodeURIComponent(`VVF_ORDER:${order.id}:${order.senderPhone || ''}`);
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${qrData}&margin=10`;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-sm bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 p-5 sm:p-6 space-y-4 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Tag */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200">
            <QrCode className="w-3.5 h-3.5 text-emerald-700" />
            <span>Mã QR Nhận Hoa & Tích Điểm</span>
          </div>
          <h3 className="font-serif font-bold text-lg text-slate-800">
            Đơn Hàng #{order.id}
          </h3>
          <p className="text-xs text-slate-500">
            Xuất trình mã này cho Florist hoặc Shipper khi nhận hoa để xác nhận giao hàng tức thì.
          </p>
        </div>

        {/* QR Code Container with Frame */}
        <div className="p-4 rounded-2xl bg-white border-2 border-dashed border-emerald-300 shadow-inner flex flex-col items-center justify-center relative group">
          <img
            src={qrImageUrl}
            alt={`Mã QR Đơn Hàng #${order.id}`}
            className="w-48 h-48 object-contain rounded-lg"
            loading="lazy"
          />
          <div className="mt-2 text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            ID: #{order.id}
          </div>
        </div>

        {/* Order Details Brief */}
        <div className="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 text-left text-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-600">
            <span>Người nhận:</span>
            <span className="font-bold text-slate-800 truncate max-w-[180px]">{order.recipientName}</span>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span>Tổng tiền:</span>
            <span className="font-extrabold text-emerald-700">{formatPrice(order.totalAmount)}</span>
          </div>
          {remainingAmount > 0 ? (
            <div className="flex items-center justify-between text-amber-700 font-bold bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
              <span>Thu nốt khi giao (50%):</span>
              <span>{formatPrice(remainingAmount)}</span>
            </div>
          ) : (
            <div className="flex items-center justify-between text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
              <span>Thanh toán:</span>
              <span>Đã thanh toán 100%</span>
            </div>
          )}
          <div className="flex items-center justify-between text-purple-700 font-semibold pt-1 border-t border-slate-200/60">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Điểm thưởng tích lũy:</span>
            </span>
            <span className="font-bold text-sm">+{pointsEarned} điểm</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
        >
          Đóng Mã QR
        </button>
      </div>
    </div>
  );
};
