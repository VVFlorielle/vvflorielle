import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Search,
  PackageCheck,
  Clock,
  CheckCircle2,
  Truck,
  Sparkles,
  Phone,
  MapPin,
  Camera,
  QrCode,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  FileText,
  Calendar
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Order, OrderStatus } from '../types';
import { useBodyScrollLock } from '../utils/scrollLock';

interface OrderLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderId?: string;
}

export const OrderLookupModal: React.FC<OrderLookupModalProps> = ({
  isOpen,
  onClose,
  initialOrderId = ''
}) => {
  useBodyScrollLock(isOpen);
  const { orders, products } = useStore();

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const [searchQuery, setSearchQuery] = useState(initialOrderId);
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Camera QR scanner state for greeting card / bill
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialOrderId) {
        setSearchQuery(initialOrderId);
        doSearch(initialOrderId);
      } else {
        setHasSearched(false);
        setSearchedOrder(null);
        setSearchError(null);
      }
    } else {
      stopCamera();
    }
  }, [isOpen, initialOrderId]);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

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

      // If BarcodeDetector is available, scan continuously
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
                handleCodeDetected(rawValue);
                clearInterval(intervalId);
              }
            } catch (e) {}
          }
        }, 500);
      }
    } catch (err: any) {
      console.error('Camera error:', err);
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Trình duyệt chưa được cấp quyền Camera. Vui lòng nhấn Cho phép (Allow) để quét mã QR.'
          : 'Không thể truy cập camera trên thiết bị này.'
      );
      setIsCameraActive(false);
    }
  };

  const handleCodeDetected = (text: string) => {
    stopCamera();
    // Parse order ID from URL or text (e.g. "VVF-ORDER-849201" or "849201" or URL with ?orderId=849201)
    let extracted = text.trim();
    if (extracted.includes('orderId=')) {
      const match = extracted.match(/orderId=([^&]+)/);
      if (match) extracted = match[1];
    } else if (extracted.includes('VVF-ORDER-')) {
      extracted = extracted.replace('VVF-ORDER-', '');
    } else if (extracted.includes('#')) {
      extracted = extracted.replace('#', '');
    }
    setSearchQuery(extracted);
    doSearch(extracted);
  };

  const doSearch = (query: string) => {
    setHasSearched(true);
    setSearchError(null);
    const q = query.trim().toLowerCase().replace('#', '').replace('vvf-order-', '');
    if (!q) {
      setSearchedOrder(null);
      setSearchError('Vui lòng nhập số điện thoại hoặc mã đơn hàng 6 chữ số!');
      return;
    }

    // Search by exact Order ID or sender/recipient phone number
    const found = orders.find((o) => {
      const idMatch = o.id.toLowerCase() === q;
      const senderPhoneMatch = (o.senderPhone || '').replace(/\s+/g, '') === q.replace(/\s+/g, '');
      const recipientPhoneMatch = (o.recipientPhone || '').replace(/\s+/g, '') === q.replace(/\s+/g, '');
      return idMatch || senderPhoneMatch || recipientPhoneMatch;
    });

    if (found) {
      setSearchedOrder(found);
      setSearchError(null);
    } else {
      setSearchedOrder(null);
      setSearchError(`Không tìm thấy đơn hàng nào khớp với "${query}". Vui lòng kiểm tra lại số điện thoại hoặc mã 6 số ghi trên thiệp hoa!`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doSearch(searchQuery);
  };

  if (!isOpen) return null;

  // Order timeline step definitions
  const steps: { status: OrderStatus; label: string; desc: string }[] = [
    { status: 'PENDING', label: 'Tiếp nhận', desc: 'Đã nhận đơn' },
    { status: 'WAITING_DEPOSIT', label: 'Duyệt cọc', desc: 'VietQR tự động' },
    { status: 'ARRANGING', label: 'Cắm hoa', desc: 'Florist tuyển chọn' },
    { status: 'SHIPPING', label: 'Đang giao', desc: 'Hỏa tốc Hà Nội' },
    { status: 'COMPLETED', label: 'Đã giao', desc: 'Kèm bảo hành 3 ngày' }
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return 0;
      case 'WAITING_DEPOSIT':
        return 1;
      case 'ARRANGING':
        return 2;
      case 'SHIPPING':
        return 3;
      case 'COMPLETED':
        return 4;
      case 'CANCELLED':
        return -1;
      default:
        return 0;
    }
  };

  const currentStepIdx = searchedOrder ? getStepIndex(searchedOrder.status) : 0;

  return (
    <div className="fixed inset-0 z-[100060] flex items-center justify-center p-3 sm:p-5 bg-slate-900/35 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-[32px] shadow-2xl border border-white/70 p-5 sm:p-6 space-y-4 max-h-[92vh] overflow-y-auto">
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
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 text-white flex items-center justify-center shadow-lg shadow-orange-500/25 shrink-0">
            <PackageCheck className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-black text-base sm:text-lg text-emerald-950">
                Tra Cứu Tiến Độ Đơn Hàng
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase">
                Tiện Ích 24/7
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Theo dõi lộ trình cắm hoa & giao hoa trực tiếp không cần đăng nhập
            </p>
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nhập SĐT đặt hoa (VD: 0829440654) hoặc Mã đơn 6 số..."
              className="glass-input w-full pl-10 pr-24 py-2.5 rounded-2xl text-xs font-semibold"
            />
            <button
              type="submit"
              className="absolute right-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-extrabold shadow-sm transition-all cursor-pointer"
            >
              Tra Cứu
            </button>
          </div>

          {/* Camera QR scan trigger */}
          <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500">
            <span>Hoặc quét mã in trên thiệp / hóa đơn:</span>
            {!isCameraActive ? (
              <button
                type="button"
                onClick={startCamera}
                className="flex items-center gap-1.5 text-orange-600 hover:text-orange-700 font-bold transition-colors cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Bật Camera Quét Mã QR</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={stopCamera}
                className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-bold transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Tắt Camera</span>
              </button>
            )}
          </div>
        </form>

        {/* Camera Live Stream Viewfinder */}
        {isCameraActive && (
          <div className="relative aspect-square max-w-[260px] mx-auto rounded-3xl bg-slate-900 border-4 border-orange-400/60 overflow-hidden shadow-xl animate-in zoom-in-95 duration-200">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 border-2 border-dashed border-white/60 m-8 rounded-2xl pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent shadow-[0_0_15px_#f97316] animate-bounce-laser" />
            <div className="absolute bottom-2 left-2 right-2 text-center text-[10px] text-white/90 bg-black/50 py-1 px-2 rounded-xl backdrop-blur-xs">
              Hướng camera vào mã QR in trên thiệp hoa hoặc bill
            </div>
          </div>
        )}

        {cameraError && (
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Lưu ý quyền Camera:</p>
              <p className="text-[11px] text-amber-700 mt-0.5">{cameraError}</p>
            </div>
          </div>
        )}

        {/* Quick Suggestion Chips (if available) */}
        {!hasSearched && orders.length > 0 && (
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Mã đơn mẫu tra cứu nhanh:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {orders.slice(0, 4).map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => {
                    setSearchQuery(o.id);
                    doSearch(o.id);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-300 text-slate-700 hover:text-orange-700 font-mono text-[11px] font-bold transition-colors cursor-pointer"
                >
                  #{o.id} ({o.recipientName})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error message */}
        {searchError && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold">Chưa tìm thấy đơn hàng</p>
              <p className="text-[11px] text-rose-700 mt-0.5">{searchError}</p>
            </div>
          </div>
        )}

        {/* Order Details Card */}
        {searchedOrder && (
          <div className="space-y-4 pt-1 animate-in fade-in duration-300">
            {/* Order Card Header */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white border border-emerald-200/80 space-y-3">
              <div className="flex items-center justify-between pb-2.5 border-b border-emerald-200/60">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                    Mã Đơn Hàng
                  </span>
                  <span className="font-mono font-black text-lg text-emerald-950">
                    #{searchedOrder.id}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-medium text-slate-500 block">
                    Thời gian đặt:
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    {searchedOrder.createdAt}
                  </span>
                </div>
              </div>

              {/* Stepper Timeline */}
              {searchedOrder.status !== 'CANCELLED' ? (
                <div className="py-2">
                  <div className="relative flex items-center justify-between">
                    <div className="absolute left-2 right-2 top-3 h-0.5 bg-slate-200 -z-0" />
                    <div
                      className="absolute left-2 top-3 h-0.5 bg-emerald-500 transition-all duration-500 -z-0"
                      style={{
                        width: `${(Math.max(0, currentStepIdx) / (steps.length - 1)) * 96}%`
                      }}
                    />

                    {steps.map((st, idx) => {
                      const isPast = idx < currentStepIdx;
                      const isCurrent = idx === currentStepIdx;
                      return (
                        <div key={st.status} className="flex flex-col items-center relative z-10">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all shadow-xs ${
                              isPast
                                ? 'bg-emerald-600 text-white'
                                : isCurrent
                                ? 'bg-orange-500 text-white ring-4 ring-orange-200 animate-pulse'
                                : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            {isPast ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                          </div>
                          <span
                            className={`text-[9.5px] mt-1 font-bold whitespace-nowrap ${
                              isCurrent
                                ? 'text-orange-600'
                                : isPast
                                ? 'text-emerald-800'
                                : 'text-slate-400'
                            }`}
                          >
                            {st.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-rose-100 text-rose-800 font-bold text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>Đơn hàng đã được hủy ({searchedOrder.cancellationReason || 'Theo yêu cầu khách hàng'})</span>
                </div>
              )}

              {/* Delivery Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 pt-1">
                <div className="p-2.5 rounded-xl bg-white/80 border border-slate-200/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Người Nhận:</span>
                  </div>
                  <p className="font-bold text-slate-900">{searchedOrder.recipientName} • {searchedOrder.recipientPhone}</p>
                  <p className="text-[11px] text-slate-600 line-clamp-2">{searchedOrder.recipientAddress}</p>
                </div>

                <div className="p-2.5 rounded-xl bg-white/80 border border-slate-200/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Lịch Giao Dự Kiến:</span>
                  </div>
                  <p className="font-bold text-slate-900">{searchedOrder.deliveryTimeSlot || 'Giao hỏa tốc 45 phút'}</p>
                  <p className="text-[11px] text-slate-600">{searchedOrder.deliveryDate || 'Hôm nay'}</p>
                </div>
              </div>

              {/* Florist Greeting Message Card */}
              {searchedOrder.cardMessage && (
                <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1 mb-0.5">
                    <FileText className="w-3 h-3 text-amber-600" />
                    Thông điệp thiệp hoa gửi kèm:
                  </span>
                  <p className="italic text-slate-800 text-[11.5px] font-medium">
                    "{searchedOrder.cardMessage}"
                  </p>
                </div>
              )}

              {/* Products in this order */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Sản phẩm đặt ({searchedOrder.items.length}):
                </span>
                <div className="space-y-1.5">
                  {searchedOrder.items.map((item, idx) => {
                    const prod = products.find((p) => p.id === item.productId);
                    const itemImage = prod?.imageUrl || '/products/fl-01.webp';
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-slate-200/80"
                      >
                        <img
                          src={itemImage}
                          alt={item.productName}
                          className="w-12 h-12 rounded-lg object-cover border border-slate-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-xs text-slate-900 truncate">
                            {item.productName}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            SL: x{item.quantity} • {formatPrice(item.price)}
                          </p>
                        </div>
                        <span className="font-bold text-xs text-emerald-800 shrink-0">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Financial summary */}
              <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Tổng tiền hoa:</span>
                  <span>{formatPrice(searchedOrder.flowerPrice || searchedOrder.totalAmount)}</span>
                </div>
                {searchedOrder.shippingFee > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Phí giao hoa ({searchedOrder.shippingDistanceKm || 2} km):</span>
                    <span>{formatPrice(searchedOrder.shippingFee)}</span>
                  </div>
                )}
                {searchedOrder.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Giảm giá voucher / hoa xu:</span>
                    <span>-{formatPrice(searchedOrder.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-100">
                  <span>Tổng thanh toán:</span>
                  <span className="text-sm font-extrabold text-emerald-900">
                    {formatPrice(searchedOrder.totalAmount)}
                  </span>
                </div>

                {searchedOrder.remainingAmount > 0 ? (
                  <div className="flex justify-between font-extrabold text-amber-900 bg-amber-100/90 px-2 py-1 rounded-lg border border-amber-300">
                    <span>Số tiền cần thanh toán nốt khi nhận:</span>
                    <span>{formatPrice(searchedOrder.remainingAmount)}</span>
                  </div>
                ) : (
                  <div className="text-[11px] text-emerald-700 font-bold text-right">
                    ✓ Đã thanh toán đầy đủ 100%
                  </div>
                )}
              </div>
            </div>

            {/* Support hotline */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
              <span className="text-slate-600 text-[11.5px]">Cần hỗ trợ gấp hoặc đổi địa chỉ?</span>
              <a
                href="tel:0829440654"
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1 text-[11px] shadow-xs cursor-pointer"
              >
                <Phone className="w-3 h-3" />
                <span>Hotline: 0829.440.654</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
