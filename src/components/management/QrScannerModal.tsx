import React, { useState, useEffect, useRef } from 'react';
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
  RefreshCw,
  AlertCircle,
  Upload,
  SwitchCamera
} from 'lucide-react';
import { Order } from '../../types';
import { useBodyScrollLock } from '../../utils/scrollLock';

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
  useBodyScrollLock(isOpen);
  const [activeTab, setActiveTab] = useState<'scan' | 'quick_list'>('scan');
  const [manualInput, setManualInput] = useState('');
  const [scannedOrder, setScannedOrder] = useState<Order | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Real Camera WebRTC Stream State
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  // Active delivery orders (not completed and not cancelled)
  const deliveryOrders = orders.filter((o) => o.status !== 'COMPLETED' && o.status !== 'CANCELLED');

  useEffect(() => {
    if (isOpen) {
      setScannedOrder(null);
      setIsSuccess(false);
      setManualInput('');
      if (activeTab === 'scan') {
        startCamera();
      }
    } else {
      stopCamera();
    }
  }, [isOpen, activeTab, facingMode]);

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
  };

  const startCamera = async () => {
    try {
      setCameraError(null);
      stopCamera();

      // Request real WebRTC camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      streamRef.current = stream;
      setIsCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }

      // Continuous QR code detection via BarcodeDetector API
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
        }, 400);
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setIsCameraActive(false);
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Trình duyệt chưa được cấp quyền Camera. Vui lòng bấm Cho phép (Allow) để Shipper quét mã đơn của khách.'
          : 'Không thể khởi động camera trên thiết bị này hoặc camera đang bận.'
      );
    }
  };

  const toggleCameraFacing = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleCodeDetected = (text: string) => {
    stopCamera();
    let cleaned = text.trim();
    if (cleaned.includes('orderId=')) {
      const m = cleaned.match(/orderId=([^&]+)/);
      if (m) cleaned = m[1];
    } else if (cleaned.includes('VVF-ORDER-')) {
      cleaned = cleaned.replace('VVF-ORDER-', '');
    } else if (cleaned.includes('#')) {
      cleaned = cleaned.replace('#', '');
    }

    const found = orders.find(
      (o) =>
        o.id.toLowerCase() === cleaned.toLowerCase() ||
        o.senderPhone === cleaned ||
        o.recipientPhone === cleaned
    );

    if (found) {
      setScannedOrder(found);
      setIsSuccess(false);
    } else {
      setManualInput(cleaned);
      setCameraError(`Đã đọc được mã "${cleaned}" nhưng không tìm thấy đơn hoa tương ứng trong hệ thống.`);
    }
  };

  // Image file QR scanner fallback
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if ('BarcodeDetector' in window) {
        const barcodeDetector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
        const img = new Image();
        img.src = URL.createObjectURL(file);
        await img.decode();
        const barcodes = await barcodeDetector.detect(img);
        if (barcodes.length > 0) {
          handleCodeDetected(barcodes[0].rawValue);
          return;
        }
      }
      setCameraError('Không tìm thấy mã QR hợp lệ trong ảnh vừa tải lên. Vui lòng chụp rõ hơn hoặc nhập mã 6 số bên dưới.');
    } catch (err) {
      setCameraError('Không thể giải mã ảnh QR. Vui lòng thử lại hoặc chọn đơn trong danh sách.');
    }
  };

  const handleSelectOrderToConfirm = (order: Order) => {
    stopCamera();
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
      stopCamera();
      setScannedOrder(found);
    } else {
      setCameraError(`Không tìm thấy đơn hàng khớp với "${manualInput}"`);
    }
  };

  const handleConfirmDelivery = () => {
    if (!scannedOrder || isSubmitting) return;
    setIsSubmitting(true);
    onCompleteOrder(scannedOrder.id);
    setIsSuccess(true);
    setTimeout(() => {
      onClose();
      setIsSubmitting(false);
    }, 1400);
  };

  const pointsEarned = scannedOrder ? Math.floor((scannedOrder.flowerPrice || scannedOrder.totalAmount) / 10000) : 0;
  const remainingAmount = scannedOrder && scannedOrder.paymentType === 'VIETQR_DEPOSIT_50' && scannedOrder.paymentStatus === 'PARTIAL_PAID'
    ? (scannedOrder.remainingAmount || Math.ceil(scannedOrder.totalAmount / 2))
    : 0;

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
      className="fixed inset-0 z-[100060] flex items-center justify-center p-3 sm:p-5 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200 select-none cursor-pointer"
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
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-700 text-white flex items-center justify-center shadow-lg shadow-emerald-700/25 shrink-0">
            <ScanLine className="w-6 h-6 stroke-[2.2] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-black text-base sm:text-lg text-emerald-950">
                Quét Mã QR Đơn Hàng Giao Hoa
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
                Shipper / Admin
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
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
                onClick={() => {
                  setActiveTab('scan');
                  startCamera();
                }}
                className={`flex-1 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'scan' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>Camera Quét Trực Tiếp</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  setActiveTab('quick_list');
                }}
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
                {/* Real WebRTC Live Camera Viewfinder */}
                <div className="relative aspect-square max-w-[280px] mx-auto rounded-3xl bg-slate-900 border-4 border-emerald-400/80 overflow-hidden shadow-xl flex flex-col items-center justify-center text-white">
                  {isCameraActive ? (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                      {/* Viewfinder Target Box */}
                      <div className="absolute inset-0 border-2 border-dashed border-emerald-300/70 m-10 rounded-2xl pointer-events-none" />
                      {/* Laser Line Animation */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-bounce-laser" />
                      {/* Flip Camera Button */}
                      <button
                        type="button"
                        onClick={toggleCameraFacing}
                        className="absolute top-2 right-2 p-2 rounded-full bg-black/50 text-white/90 hover:bg-black/70 backdrop-blur-xs transition-colors cursor-pointer"
                        title="Đổi camera trước/sau"
                      >
                        <SwitchCamera className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-2 text-[10px] text-white/90 bg-black/60 px-3 py-1 rounded-xl backdrop-blur-xs font-medium">
                        Hướng camera vào mã QR đơn của khách
                      </div>
                    </>
                  ) : (
                    <div className="p-6 text-center space-y-3">
                      <Camera className="w-12 h-12 text-slate-400 mx-auto animate-pulse" />
                      <p className="text-xs text-slate-300">
                        {cameraError ? 'Camera chưa được kích hoạt' : 'Đang kết nối camera thiết bị...'}
                      </p>
                      <button
                        type="button"
                        onClick={startCamera}
                        className="btn-primary py-2 px-4 text-xs font-bold rounded-xl cursor-pointer"
                      >
                        Thử Lại Camera
                      </button>
                    </div>
                  )}
                </div>

                {cameraError && (
                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Lưu ý camera:</p>
                      <p className="text-[11px] leading-relaxed mt-0.5">{cameraError}</p>
                    </div>
                  </div>
                )}

                {/* Photo Upload & Manual Input Fallback */}
                <div className="flex gap-2">
                  <label className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-slate-600" />
                    <span>Tải Ảnh Mã QR</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <form onSubmit={handleManualSearch} className="flex gap-2 text-xs pt-1">
                  <input
                    type="text"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    placeholder="Nhập mã đơn (VD: 849201) hoặc SĐT khách..."
                    className="glass-input flex-1 py-2 px-3 rounded-xl text-xs font-semibold"
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
                  <div className="p-8 text-center text-slate-400 text-xs">
                    <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
                    <span>Tuyệt vời! Hiện không có đơn hàng nào đang chờ giao.</span>
                  </div>
                ) : (
                  deliveryOrders.map((o) => (
                    <div
                      key={o.id}
                      onClick={() => handleSelectOrderToConfirm(o)}
                      className="p-3 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer flex items-center justify-between text-xs group"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-emerald-950">#{o.id}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            {o.status}
                          </span>
                        </div>
                        <p className="font-bold text-slate-800">{o.recipientName} • {o.recipientPhone}</p>
                        <p className="text-[11px] text-slate-500 truncate max-w-[200px] sm:max-w-xs">
                          {o.recipientAddress}
                        </p>
                      </div>
                      <div className="text-right shrink-0 flex items-center gap-2">
                        <div>
                          <span className="font-extrabold text-emerald-800 block">{formatPrice(o.totalAmount)}</span>
                          <span className="text-[10px] text-purple-700 font-semibold">+{Math.floor((o.flowerPrice || o.totalAmount) / 10000)}đ V-Points</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Scanned Order Details & Confirmation */}
        {scannedOrder && (
          <div className="space-y-4 pt-1 animate-in zoom-in-95 duration-200">
            {isSuccess ? (
              <div className="p-8 rounded-3xl bg-emerald-50 border border-emerald-300 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-600/30">
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
                    onClick={() => {
                      setScannedOrder(null);
                      startCamera();
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Quét Đơn Khác
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleConfirmDelivery}
                    className="flex-[2] py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isSubmitting ? 'Đang hoàn tất...' : `Xác Nhận Đã Giao & Cộng ${pointsEarned} Điểm`}</span>
                  </button>
                </div>
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
