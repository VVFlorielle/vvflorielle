import React, { useState, useEffect } from 'react';
import {
  X,
  QrCode,
  ScanLine,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Phone,
  MapPin,
  Clock,
  Camera,
  RefreshCw
} from 'lucide-react';
import { Order } from '../../types';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onCompleteOrder: (orderId: string) => void;
  formatPrice?: (amount: number) => string;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  isOpen,
  onClose,
  orders,
  onCompleteOrder,
  formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p)
}) => {
  const [activeTab, setActiveTab] = useState<'scan' | 'quick_list'>('scan');
  const [manualInput, setManualInput] = useState('');
  const [scannedOrder, setScannedOrder] = useState<Order | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Active delivery orders (not completed and not cancelled)
  const deliveryOrders = orders.filter((o) => o.status !== 'COMPLETED' && o.status !== 'CANCELLED');

  useEffect(() => {
    if (!isOpen) {
      setScannedOrder(null);
      setIsSuccess(false);
      setManualInput('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectOrderToConfirm = (order: Order) => {
    setScannedOrder(order);
    setIsSuccess(false);
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = manualInput.replace('#', '').trim().toLowerCase();
    const found = orders.find(
      (o) => o.id.toLowerCase() === cleanId || o.senderPhone === cleanId || o.recipientPhone === cleanId
    );
    if (found) {
      setScannedOrder(found);
    }
  };

  const handleConfirmDelivery = () => {
    if (!scannedOrder) return;
    onCompleteOrder(scannedOrder.id);
    setIsSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1400);
  };

  const pointsEarned = scannedOrder ? Math.floor((scannedOrder.flowerPrice || scannedOrder.totalAmount) / 10000) : 0;
  const remainingAmount = scannedOrder && scannedOrder.paymentType === 'VIETQR_DEPOSIT_50' && scannedOrder.paymentStatus === 'PARTIAL_PAID'
    ? (scannedOrder.remainingAmount || Math.ceil(scannedOrder.totalAmount / 2))
    : 0;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-[32px] shadow-2xl border border-white/60 p-5 sm:p-6 space-y-4 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-700/20 shrink-0">
            <ScanLine className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-serif font-black text-base sm:text-lg text-emerald-950">
              Quét Mã QR Đơn Hàng Giao Hoa
            </h3>
            <p className="text-xs text-slate-500">
              Xác nhận hoàn thành giao hoa và tự động tích điểm cho khách
            </p>
          </div>
        </div>

        {/* Scanner Tabs */}
        {!scannedOrder && (
          <div className="space-y-4">
            <div className="flex p-1 rounded-2xl bg-slate-100 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('scan')}
                className={`flex-1 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'scan' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>Khung Quét Camera</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('quick_list')}
                className={`flex-1 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'quick_list' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Đơn Cần Giao ({deliveryOrders.length})</span>
              </button>
            </div>

            {activeTab === 'scan' ? (
              <div className="space-y-3">
                {/* Simulated Laser Scanner */}
                <div className="relative aspect-square max-w-[280px] mx-auto rounded-3xl bg-slate-900 border-4 border-emerald-400/40 overflow-hidden flex flex-col items-center justify-center text-white shadow-xl">
                  {/* Laser line animation */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-bounce-laser" />

                  <QrCode className="w-24 h-24 text-white/30" />
                  <p className="text-[11px] text-emerald-300 font-medium mt-3 px-4 text-center">
                    Hướng camera vào mã QR trên đơn của khách hàng
                  </p>

                  <div className="absolute bottom-2 text-[10px] text-white/60 font-mono">
                    Hỗ trợ mã đơn #VV-8829, #VV-8830, #VV-8831...
                  </div>
                </div>

                {/* Manual Input Fallback */}
                <form onSubmit={handleManualSearch} className="flex gap-2 text-xs">
                  <input
                    type="text"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    placeholder="Nhập mã đơn (VD: VV-8831) hoặc SĐT khách..."
                    className="glass-input flex-1 py-2 px-3 rounded-xl text-xs"
                  />
                  <button
                    type="submit"
                    className="btn-primary py-2 px-4 text-xs font-bold rounded-xl whitespace-nowrap cursor-pointer"
                  >
                    Kiểm Tra
                  </button>
                </form>
              </div>
            ) : (
              /* Quick List of Active Orders for 1-Click Scan Test */
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {deliveryOrders.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    Hiện không có đơn nào đang cần giao.
                  </div>
                ) : (
                  deliveryOrders.map((ord) => (
                    <div
                      key={ord.id}
                      onClick={() => handleSelectOrderToConfirm(ord)}
                      className="p-3 rounded-2xl bg-white/80 hover:bg-emerald-50/80 border border-slate-200/80 hover:border-emerald-300 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                    >
                      <div className="space-y-0.5 text-xs text-left">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-emerald-800">#{ord.id}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                            {ord.status}
                          </span>
                        </div>
                        <div className="font-bold text-slate-800">{ord.recipientName} • {ord.recipientPhone}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[240px]">
                          {ord.items?.[0]?.productName || 'Bó hoa tươi'}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-extrabold text-xs text-emerald-700">{formatPrice(ord.totalAmount)}</div>
                        <button
                          type="button"
                          className="mt-1 text-[10.5px] font-bold text-emerald-700 group-hover:text-emerald-900 inline-flex items-center gap-0.5"
                        >
                          <span>Quét đơn này</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Scanned Order Confirmation Card */}
        {scannedOrder && (
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
            {isSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="font-bold text-lg text-emerald-950">Giao Hàng Thành Công!</h4>
                <p className="text-xs text-slate-600">
                  Đơn hàng <strong>#{scannedOrder.id}</strong> đã được đánh dấu hoàn tất và cộng <strong>+{pointsEarned} điểm</strong> vào tài khoản khách!
                </p>
              </div>
            ) : (
              <>
                <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200 space-y-3 text-left text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-200/80">
                    <div>
                      <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">Mã Đơn Đã Quét</span>
                      <span className="font-mono font-black text-base text-emerald-950">#{scannedOrder.id}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-bold text-[10.5px]">
                      {scannedOrder.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-slate-700">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span><strong>{scannedOrder.recipientName}</strong> • {scannedOrder.recipientPhone}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{scannedOrder.recipientAddress}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span className="truncate">{scannedOrder.items?.[0]?.productName || 'Bó hoa tươi nghệ thuật'}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-emerald-200/80 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Tổng giá trị đơn:</span>
                      <span className="font-bold">{formatPrice(scannedOrder.totalAmount)}</span>
                    </div>
                    {remainingAmount > 0 ? (
                      <div className="flex justify-between text-amber-900 font-bold bg-amber-100/90 px-2.5 py-1 rounded-xl border border-amber-300">
                        <span>Số tiền cần thu nốt khi giao:</span>
                        <span className="text-sm font-extrabold">{formatPrice(remainingAmount)}</span>
                      </div>
                    ) : (
                      <div className="flex justify-between text-emerald-800 font-bold">
                        <span>Tình trạng cọc:</span>
                        <span>Đã thanh toán 100%</span>
                      </div>
                    )}
                    <div className="flex justify-between text-purple-700 font-bold pt-1">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Điểm thưởng tích lũy cho khách:</span>
                      </span>
                      <span>+{pointsEarned} Điểm</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setScannedOrder(null)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Quét Đơn Khác
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDelivery}
                    className="flex-[2] py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Xác Nhận Đã Giao & Cộng {pointsEarned} Điểm</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
