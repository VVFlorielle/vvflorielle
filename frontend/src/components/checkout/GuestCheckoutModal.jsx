import React, { useState } from 'react';
import { 
  X, 
  CheckCircle, 
  QrCode, 
  Banknote, 
  Lock, 
  Sparkles, 
  Clock, 
  MapPin, 
  User, 
  Phone,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function GuestCheckoutModal({ 
  customRecipe, 
  onClose, 
  onOrderSuccess 
}) {
  if (!customRecipe) return null;

  const [receiverName, setReceiverName] = useState('Nguyễn Thùy Linh');
  const [receiverPhone, setReceiverPhone] = useState('0912.888.345');
  const [address, setAddress] = useState('124 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM');
  const [timeSlot, setTimeSlot] = useState('Chiều nay (16:30 - 17:30)');
  const [senderName, setSenderName] = useState('Trần Văn Nam');
  const [senderPhone, setSenderPhone] = useState('0903.111.890');
  const [secretGift, setSecretGift] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('vietqr');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!receiverName || !receiverPhone || !address || !senderPhone) {
      alert('Vui lòng điền đầy đủ thông tin người nhận và số điện thoại người đặt!');
      return;
    }

    setIsSubmitting(true);

    const fullOrderPayload = {
      productId: customRecipe.product.id,
      productName: customRecipe.product.name,
      productSku: customRecipe.product.sku,
      productImage: customRecipe.product.images[0],
      totalPrice: customRecipe.totalPrice,
      recipe: {
        wrappingPaper: customRecipe.wrappingPaper,
        ribbon: customRecipe.ribbon,
        addons: customRecipe.addons,
        notes: customRecipe.notes
      },
      card: {
        message: customRecipe.cardMessage,
        bannerText: 'CHÚC MỪNG'
      },
      delivery: {
        timeSlot,
        receiverName,
        receiverPhone,
        address,
        secretGift
      },
      customer: {
        name: senderName,
        phone: senderPhone,
        notes: customRecipe.notes
      },
      payment: {
        method: paymentMethod === 'vietqr' ? 'VietQR (Quét mã tự động)' : 'Tiền mặt khi nhận hoa (COD)',
        status: paymentMethod === 'vietqr' ? 'paid' : 'pending'
      }
    };

    setTimeout(() => {
      setIsSubmitting(false);
      // Confetti effect
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}

      onOrderSuccess(fullOrderPayload);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="glass-panel w-full max-w-xl rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/80 relative max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-500 hover:text-slate-800 flex items-center justify-center shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="border-b border-slate-200/60 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">
              Xác Nhận Đặt Giao Hoa Tươi
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Đặt nhanh trong 1 phút • Không cần tài khoản • Tiệm nhận đơn ngay
          </p>
        </div>

        {/* Bảng Tóm tắt Vé chế tác đã tùy biến */}
        <div className="bg-rose-50/90 rounded-2xl p-4 text-xs space-y-1.5 border border-rose-200/70 mb-4 shadow-xs">
          <div className="flex items-center justify-between font-bold text-rose-700 text-sm">
            <span>{customRecipe.product.name} ({customRecipe.product.sku})</span>
            <span className="text-base">{customRecipe.totalPrice.toLocaleString('vi-VN')}₫</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-slate-700 pt-1">
            <div>• <strong>Giấy gói:</strong> {customRecipe.wrappingPaper}</div>
            <div>• <strong>Ruy băng:</strong> {customRecipe.ribbon}</div>
            {customRecipe.addons.length > 0 && (
              <div className="sm:col-span-2">• <strong>Thêm/Thay hoa:</strong> {customRecipe.addons.join(', ')}</div>
            )}
            <div className="sm:col-span-2">• <strong>Lời chúc thiệp:</strong> <span className="italic">"{customRecipe.cardMessage}"</span></div>
          </div>
        </div>

        {/* Form thông tin giao nhận */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* 1. THÔNG TIN NGƯỜI NHẬN */}
          <div className="space-y-3 bg-white/50 p-4 rounded-2xl border border-white">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-rose-500" />
              <span>1. Thông Tin Người Nhận Hoa</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Họ tên người nhận (*):</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                    className="glass-input w-full rounded-xl pl-8 pr-3 py-2 text-slate-800"
                    placeholder="Tên người nhận hoa..."
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Số điện thoại người nhận (*):</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={receiverPhone}
                    onChange={(e) => setReceiverPhone(e.target.value)}
                    className="glass-input w-full rounded-xl pl-8 pr-3 py-2 text-slate-800"
                    placeholder="0912..."
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Địa chỉ giao hoa chi tiết (*):</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="glass-input w-full rounded-xl px-3 py-2 text-slate-800"
                placeholder="Số nhà, tên đường, tòa nhà, phường, quận..."
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Khung thời gian giao hoa (*):</label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="glass-input w-full rounded-xl px-3 py-2 text-slate-800 font-medium"
              >
                <option value="Giao hỏa tốc sớm nhất (60-90 phút)">⚡ Giao hỏa tốc sớm nhất (60 - 90 phút)</option>
                <option value="Chiều nay (16:30 - 17:30)">Chiều nay (16:30 - 17:30)</option>
                <option value="Tối nay (19:00 - 20:30)">Tối nay (19:00 - 20:30)</option>
                <option value="Sáng mai (08:30 - 09:30)">Sáng mai (08:30 - 09:30)</option>
                <option value="Chiều mai (14:00 - 15:30)">Chiều mai (14:00 - 15:30)</option>
              </select>
            </div>
          </div>

          {/* 2. THÔNG TIN NGƯỜI ĐẶT (ĐỂ GỬI ẢNH DUYỆT) */}
          <div className="space-y-3 bg-white/50 p-4 rounded-2xl border border-white">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <User className="w-4 h-4 text-rose-500" />
              <span>2. Thông Tin Của Bạn (Người Đặt)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tên của bạn:</label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="glass-input w-full rounded-xl px-3 py-2 text-slate-800"
                  placeholder="Tên bạn..."
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  SĐT / Zalo (Để Nhận Ảnh Hoa Thật Duyệt) (*):
                </label>
                <input
                  type="tel"
                  required
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  className="glass-input w-full rounded-xl px-3 py-2 text-slate-800"
                  placeholder="0903..."
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1 text-slate-700">
              <input
                type="checkbox"
                checked={secretGift}
                onChange={(e) => setSecretGift(e.target.checked)}
                className="rounded text-rose-500 focus:ring-rose-400 w-4 h-4"
              />
              <span className="font-semibold">Tặng quà bí mật (Giấu tên người gửi, không in giá trên hóa đơn)</span>
            </label>
          </div>

          {/* 3. PHƯƠNG THỨC THANH TOÁN */}
          <div className="space-y-3 bg-white/50 p-4 rounded-2xl border border-white">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <Banknote className="w-4 h-4 text-emerald-600" />
              <span>3. Phương Thức Thanh Toán</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label 
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'vietqr' 
                    ? 'bg-rose-50 border-rose-400 text-rose-900 font-bold shadow-xs' 
                    : 'bg-white/60 border-white text-slate-700'
                }`}
                onClick={() => setPaymentMethod('vietqr')}
              >
                <QrCode className="w-5 h-5 text-rose-600" />
                <div>
                  <div>Quét mã VietQR (Tự động)</div>
                  <div className="text-[10px] text-slate-500 font-normal">Khuyên dùng • Khớp đơn tức thì</div>
                </div>
              </label>

              <label 
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'cod' 
                    ? 'bg-rose-50 border-rose-400 text-rose-900 font-bold shadow-xs' 
                    : 'bg-white/60 border-white text-slate-700'
                }`}
                onClick={() => setPaymentMethod('cod')}
              >
                <Banknote className="w-5 h-5 text-emerald-600" />
                <div>
                  <div>Tiền mặt khi nhận (COD)</div>
                  <div className="text-[10px] text-slate-500 font-normal">Thanh toán cho tài xế giao hoa</div>
                </div>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="glass-button w-full text-white font-black py-4 px-6 rounded-2xl text-sm shadow-xl flex items-center justify-center gap-2 hover:scale-102 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <span>Đang gửi đơn hàng về cho tiệm...</span>
              ) : (
                <>
                  <span>XÁC NHẬN ĐẶT HOA ({customRecipe.totalPrice.toLocaleString('vi-VN')}₫)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-slate-500 mt-2">
              Tiệm sẽ gọi xác nhận trong 5 phút & gửi ảnh hoa thật qua Zalo trước khi giao!
            </p>
          </div>

        </form>

      </div>
    </div>
  );
}
