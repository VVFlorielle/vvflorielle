import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  QrCode,
  Camera,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Star,
  Gift,
  AlertCircle,
  RefreshCw,
  Phone
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';
import { useBodyScrollLock } from '../utils/scrollLock';

interface CustomerOrderQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenReviewModal?: () => void;
}

export const CustomerOrderQrModal: React.FC<CustomerOrderQrModalProps> = ({
  isOpen,
  onClose,
  onOpenReviewModal
}) => {
  useBodyScrollLock(isOpen);
  const { customer, orders, updateCustomerProfile, showToast } = useStore();

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const [activeTab, setActiveTab] = useState<'my_qr' | 'scan_card'>('my_qr');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Camera QR scanner state for greeting card
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [manualCardCode, setManualCardCode] = useState('');
  const [isCardSuccess, setIsCardSuccess] = useState(false);

  // Filter orders of this customer
  const customerOrders = orders.filter((o) => {
    if (!customer) return false;
    const phoneMatch = customer.phone && (o.senderPhone === customer.phone || o.recipientPhone === customer.phone);
    const idMatch = o.customerId && o.customerId === customer.id;
    return phoneMatch || idMatch;
  });

  // Active orders being delivered or prepared
  const activeOrders = customerOrders.filter((o) => o.status !== 'CANCELLED');

  useEffect(() => {
    if (isOpen) {
      if (activeOrders.length > 0) {
        setSelectedOrder(activeOrders[0]);
      } else {
        setSelectedOrder(null);
      }
      setIsCardSuccess(false);
      setManualCardCode('');
    } else {
      stopCamera();
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleClose = () => {
    try {
      stopCamera();
    } catch (e) {
      console.error('Error stopping camera:', e);
    }
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setCameraError(null);
  };

  const startCamera = async () => {
    try {
      setCameraError(null);
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      if ('BarcodeDetector' in window) {
        const barcodeDetector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
        const intervalId = setInterval(async () => {
          if (!streamRef.current) {
            clearInterval(intervalId);
            return;
          }
          if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
            try {
              const barcodes = await barcodeDetector.detect(videoRef.current);
              if (barcodes.length > 0) {
                const rawValue = barcodes[0].rawValue;
                handleScanCardSuccess(rawValue);
                clearInterval(intervalId);
              }
            } catch (e) {}
          }
        }, 500);
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Trình duyệt chưa được cấp quyền Camera. Vui lòng cho phép quyền Camera để quét mã trên thiệp.'
          : 'Không thể mở camera trên thiết bị.'
      );
      setIsCameraActive(false);
    }
  };

  const handleScanCardSuccess = (code: string) => {
    stopCamera();
    setIsCardSuccess(true);
    // Award 50 V-Points
    if (customer) {
      updateCustomerProfile({ points: (customer.points || 0) + 50 });
    }
    showToast('Quét mã thiệp thành công! Bạn nhận được +50 điểm V-Points và chuẩn bị gửi đánh giá!', 'success');

    setTimeout(() => {
      onClose();
      if (onOpenReviewModal) {
        onOpenReviewModal();
      }
    }, 1200);
  };

  const handleManualCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCardCode.trim()) return;
    handleScanCardSuccess(manualCardCode.trim());
  };

  if (!isOpen) return null;

  // Generate SVG QR code pattern based on Order ID
  const orderId = selectedOrder?.id || '849201';
  const qrDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    `VVF-ORDER-${orderId}`
  )}&color=064e3b&bgcolor=ffffff&qzone=2`;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
      className="fixed inset-0 z-[100060] flex items-center justify-center p-3 sm:p-5 bg-slate-900/35 backdrop-blur-md animate-in fade-in duration-200 select-none cursor-pointer"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-[32px] shadow-2xl border border-white/70 p-5 sm:p-6 space-y-4 max-h-[92vh] overflow-y-auto cursor-default"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-2.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer z-10"
          title="Đóng (Phím Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-700/25 shrink-0">
            <QrCode className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-black text-base sm:text-lg text-emerald-950">
                Mã Nhận Đơn & Tích Điểm Hoa
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
                Thành Viên
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Xin chào {customer?.fullName || 'Quý khách'}! Đưa mã cho Shipper hoặc quét thiệp hoa
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex p-1 rounded-2xl bg-slate-100 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              stopCamera();
              setActiveTab('my_qr');
            }}
            className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'my_qr'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Mã Nhận Hoa Của Tôi</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('scan_card');
              startCamera();
            }}
            className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'scan_card'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Quét Thiệp Tích Điểm (+50đ)</span>
          </button>
        </div>

        {/* Tab 1: My Order QR Code for Shipper to Scan */}
        {activeTab === 'my_qr' && (
          <div className="space-y-4 pt-1">
            {selectedOrder ? (
              <div className="p-4 rounded-3xl bg-gradient-to-b from-emerald-50/90 to-teal-50/50 border border-emerald-200/90 text-center space-y-3">
                {/* Order Selector Dropdown if customer has multiple active orders */}
                {activeOrders.length > 1 && (
                  <div className="text-left">
                    <label className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                      Chọn đơn hoa cần nhận:
                    </label>
                    <select
                      value={selectedOrder.id}
                      onChange={(e) => {
                        const found = activeOrders.find((o) => o.id === e.target.value);
                        if (found) setSelectedOrder(found);
                      }}
                      className="glass-input w-full text-xs font-bold py-1.5 px-2 rounded-xl"
                    >
                      {activeOrders.map((o) => (
                        <option key={o.id} value={o.id}>
                          #{o.id} - {o.items?.[0]?.productName || 'Đơn hoa'} ({o.status})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Big Dynamic QR Code Container */}
                <div className="relative inline-block p-4 rounded-3xl bg-white shadow-xl border-2 border-emerald-300 mx-auto group">
                  <img
                    src={qrDataUrl}
                    alt={`Mã QR Đơn #${selectedOrder.id}`}
                    className="w-48 h-48 sm:w-52 sm:h-52 object-contain mx-auto rounded-xl"
                  />
                  <div className="mt-2 text-center">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">
                      Mã xác nhận nhận đơn
                    </span>
                    <span className="font-mono font-black text-xl text-emerald-950 tracking-wider">
                      #{selectedOrder.id}
                    </span>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-xs">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Trạng thái: {selectedOrder.status}</span>
                </div>

                {/* Instructions */}
                <div className="p-3 rounded-2xl bg-white/80 border border-emerald-100 text-left text-xs space-y-1 text-slate-700">
                  <div className="flex items-center gap-1.5 text-emerald-900 font-extrabold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Bảo Mật Giao Nhận Hoa 2 Chiều:</span>
                  </div>
                  <p className="text-[11.5px] leading-relaxed text-slate-600">
                    Khi shipper V&V Florielle giao hoa đến cửa, quý khách chỉ cần đưa mã QR này để shipper quét xác nhận. Hệ thống sẽ tự động kích hoạt <strong>bảo hành tươi mới 3 ngày</strong> và cộng điểm thưởng tích lũy ngay lập tức!
                  </p>
                </div>

                {/* Order summary row */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 text-xs">
                  <div className="text-left">
                    <span className="text-slate-500 text-[11px] block">Người nhận hoa:</span>
                    <span className="font-bold text-slate-800">{selectedOrder.recipientName} • {selectedOrder.recipientPhone}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 text-[11px] block">Tổng thanh toán:</span>
                    <span className="font-extrabold text-emerald-800">{formatPrice(selectedOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>
            ) : (
              /* No active orders found */
              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-3">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="font-bold text-sm text-slate-700">Chưa Có Đơn Hoa Nào Đang Giao</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Bạn chưa có đơn hoa nào đang trong tiến trình giao. Hãy dạo gian hàng và chọn cho mình một mẫu hoa yêu thích nhé!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Scan Greeting Card QR Code to Rate & Earn V-Points */}
        {activeTab === 'scan_card' && (
          <div className="space-y-4 pt-1">
            {isCardSuccess ? (
              <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-300 text-center space-y-3 animate-in zoom-in-95">
                <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-lg text-emerald-950">Quét Thiệp Thành Công!</h4>
                <p className="text-xs text-emerald-800">
                  Bạn đã nhận được <strong>+50 V-Points</strong> vào tài khoản! Đang mở bảng đánh giá 5 sao...
                </p>
              </div>
            ) : (
              <>
                {/* Camera Live Viewfinder */}
                {isCameraActive ? (
                  <div className="relative aspect-square max-w-[280px] mx-auto rounded-3xl bg-slate-900 border-4 border-emerald-400 overflow-hidden shadow-xl animate-in zoom-in-95">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 border-2 border-dashed border-white/60 m-8 rounded-2xl pointer-events-none" />
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-bounce-laser" />
                    <div className="absolute bottom-2 left-2 right-2 text-center text-[10px] text-white/90 bg-black/50 py-1 px-2 rounded-xl backdrop-blur-xs">
                      Hướng camera vào mã QR in trên thiệp hoa hoặc hóa đơn giấy
                    </div>
                  </div>
                ) : (
                  <div className="p-6 rounded-3xl bg-slate-100 border border-slate-200 text-center space-y-3">
                    <Camera className="w-10 h-10 text-slate-400 mx-auto" />
                    <p className="text-xs text-slate-600">
                      Nhấn nút bên dưới để mở camera và quét mã QR trên thiệp hoa của bạn
                    </p>
                    <button
                      type="button"
                      onClick={startCamera}
                      className="btn-primary py-2 px-5 text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Bật Camera Quét Mã
                    </button>
                  </div>
                )}

                {cameraError && (
                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-[11px] leading-relaxed">{cameraError}</p>
                  </div>
                )}

                {/* Benefits Banner */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                      <Gift className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-extrabold text-purple-950 block">Nhận Ngay 50 Điểm V-Points</span>
                      <span className="text-[11px] text-purple-700">Tương đương giảm 50.000₫ cho lần đặt hoa kế tiếp</span>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-full bg-purple-600 text-white font-mono font-black text-xs shrink-0">
                    +50đ
                  </span>
                </div>

                {/* Manual Input Alternative */}
                <form onSubmit={handleManualCardSubmit} className="space-y-1.5 pt-1">
                  <label className="text-[11px] font-bold text-slate-600 block">
                    Hoặc nhập mã số in dưới mã QR trên thiệp:
                  </label>
                  <div className="flex gap-2 text-xs">
                    <input
                      type="text"
                      value={manualCardCode}
                      onChange={(e) => setManualCardCode(e.target.value)}
                      placeholder="VD: THIEP-VVF8829..."
                      className="glass-input flex-1 py-2 px-3 rounded-xl text-xs font-mono font-bold"
                    />
                    <button
                      type="submit"
                      className="btn-primary py-2 px-4 text-xs font-extrabold rounded-xl whitespace-nowrap cursor-pointer"
                    >
                      Xác Nhận
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        )}

        {/* Bottom Close Button for Mobile Accessibility */}
        <div className="pt-2 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={handleClose}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <X className="w-3.5 h-3.5" />
            <span>Đóng Cửa Sổ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
