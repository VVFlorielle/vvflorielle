import React from 'react';
import { X, ShieldCheck, MapPin, PhoneCall, Gift, Droplets, Scissors, Sun, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export type PopupType = 'guarantee' | 'voucher' | 'locations' | 'care' | 'promotions' | null;

interface InfoPopupsProps {
  activePopup: PopupType;
  onClose: () => void;
}

export const InfoPopups: React.FC<InfoPopupsProps> = ({ activePopup, onClose }) => {
  const { settings, promotions, showToast } = useStore();

  if (!activePopup) return null;

  return (
    <div className="glass-overlay z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="glass-modal-content max-w-md w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="glass-modal-header">
          <span className="text-xs font-bold text-slate-800">Thông Tin Dịch Vụ V&V Florielle</span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="glass-modal-body">
          {/* 1. FRESHNESS GUARANTEE POPUP */}
        {activePopup === 'guarantee' && (
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md shadow-emerald-600/10 border border-emerald-200/50">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-base text-slate-900 tracking-tight">Cam Kết Chất Lượng Hoa Tươi 100%</h3>
              <p className="text-xs text-slate-500 mt-1">Đặc quyền bảo hành chỉ có tại V&V Florielle Hà Nội</p>
            </div>
            <div className="space-y-3 text-xs text-slate-600 bg-slate-50/90 p-4 rounded-2xl border border-slate-200/60 leading-relaxed">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Tuyển chọn loại 1:</strong> Hoa nhập mới mỗi sáng từ vườn hoa tươi Đà Lạt & hoa ngoại nhập khẩu Ecuador cao cấp.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Chụp ảnh trước khi giao:</strong> Florist gửi hình ảnh thành phẩm thực tế qua Zalo cho quý khách duyệt ưng ý trước khi tiệm giao hoa đi.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Bảo hành đổi mới 100%:</strong> Nếu hoa dập nát do vận chuyển hoặc không đúng mẫu yêu cầu, đổi mới hoặc hoàn tiền ngay trong 2H.</span>
              </div>
            </div>
            <button onClick={onClose} className="btn-primary w-full text-xs py-2.5 rounded-xl shadow-md">
              Đã hiểu & Tiếp tục mua sắm
            </button>
          </div>
        )}

        {/* 2. WELCOME VOUCHER POPUP */}
        {activePopup === 'voucher' && (
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto shadow-md shadow-rose-600/10 border border-rose-200/50">
              <Gift className="w-7 h-7" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-base text-slate-900 tracking-tight">Voucher Chào Bạn Mới FREESHIP 30K</h3>
              <p className="text-xs text-slate-500 mt-1">Dành riêng cho khách hàng mới đã xác thực tài khoản</p>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50/80 to-amber-50/80 border border-rose-200 text-center space-y-2">
              <span className="text-[11px] font-semibold text-rose-700 tracking-wider uppercase">Mã Giảm Phí Giao Hàng</span>
              <div className="font-mono text-xl font-extrabold text-rose-700 tracking-widest bg-white py-2 px-4 rounded-xl border border-dashed border-rose-300 shadow-inner">
                FREESHIP30K
              </div>
              <p className="text-[11px] text-slate-600">Miễn phí vận chuyển tối đa 30.000đ cho đơn hoa từ 300.000đ. Đã kích hoạt trong ví voucher của hội viên mới!</p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText('FREESHIP30K');
                showToast('Đã sao chép mã FREESHIP30K!', 'success');
                onClose();
              }}
              className="btn-primary w-full text-xs py-2.5 bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md"
            >
              Sao chép mã & Đặt hoa ngay
            </button>
          </div>
        )}

        {/* PROMOTIONS LIST POPUP */}
        {activePopup === 'promotions' && (
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-100 to-amber-100 text-rose-700 flex items-center justify-center mx-auto shadow-md shadow-rose-600/10 border border-rose-200/50">
              <Gift className="w-7 h-7" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-base text-slate-900 tracking-tight">Kho Voucher & Ưu Đãi</h3>
              <p className="text-xs text-slate-500 mt-1">Áp dụng tại bước thanh toán hoặc đổi từ điểm tích lũy</p>
            </div>
            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {promotions.filter(p => p.isActive).map(promo => (
                <div key={promo.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-xs text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-lg border border-emerald-300">
                        {promo.code}
                      </span>
                      <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                        {promo.badge}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-800 mt-1">{promo.title}</div>
                    <div className="text-[11px] text-slate-500">{promo.description}</div>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(promo.code);
                      showToast(`Đã sao chép mã ${promo.code}!`, 'success');
                    }}
                    className="shrink-0 px-2.5 py-1 text-xs font-medium text-emerald-700 hover:text-white bg-emerald-50 hover:bg-emerald-600 rounded-lg border border-emerald-200 transition-colors"
                  >
                    Sao chép
                  </button>
                </div>
              ))}
            </div>
            <button onClick={onClose} className="btn-primary w-full text-xs py-2.5 rounded-xl shadow-md">
              Đóng
            </button>
          </div>
        )}

        {/* 3. SHOWROOM & HOTLINE */}
        {activePopup === 'locations' && (
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center mx-auto shadow-md shadow-sky-600/10 border border-sky-200/50">
              <MapPin className="w-7 h-7" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-base text-slate-900 tracking-tight">Boutique Showroom & Hotline</h3>
              <p className="text-xs text-slate-500 mt-1">V&V Florielle hân hạnh được phục vụ quý khách tại Hà Nội</p>
            </div>
            <div className="space-y-3 text-xs text-slate-700 bg-slate-50/90 p-4 rounded-2xl border border-slate-200/60">
              <div className="space-y-1 pb-2 border-b border-slate-200">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Showroom Cầu Giấy (Trụ sở chính)
                </div>
                <p className="text-slate-600 text-xs font-medium">{settings.address}</p>
                <p className="text-slate-500 text-[11px]">Giờ phục vụ: {settings.openingHours}</p>
                <p className="text-slate-500 text-[11px]">Giao hỏa tốc nội thành Hà Nội trong 60 - 90 phút</p>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-500">Hotline / Zalo tư vấn 24/7:</span>
                <a href={`tel:${settings.hotline}`} className="font-bold text-emerald-700 hover:underline">
                  {settings.hotline}
                </a>
              </div>
            </div>
            <a
              href={`tel:${settings.hotline}`}
              className="btn-primary w-full text-xs py-2.5 flex items-center justify-center gap-2 rounded-xl shadow-md"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Gọi tư vấn ngay: {settings.hotline}</span>
            </a>
          </div>
        )}

        {/* 4. FLOWER CARE GUIDE */}
        {activePopup === 'care' && (
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-md shadow-amber-600/10 border border-amber-200/50">
              <Droplets className="w-7 h-7" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-base text-slate-900 tracking-tight">Bí Quyết Giữ Hoa Tươi 5 - 7 Ngày</h3>
              <p className="text-xs text-slate-500 mt-1">Hướng dẫn từ nghệ nhân cắm hoa V&V Florielle</p>
            </div>
            <div className="space-y-2.5 text-xs text-slate-600 bg-slate-50/90 p-4 rounded-2xl border border-slate-200/60 leading-relaxed">
              <div className="flex items-start gap-2.5">
                <Scissors className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div><strong>Cắt tỉa gốc:</strong> Dùng kéo sắc cắt vát gốc cành hoa 45 độ trước khi cắm để tăng diện tích hút nước sạch.</div>
              </div>
              <div className="flex items-start gap-2.5">
                <Droplets className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div><strong>Thay nước sạch mỗi ngày:</strong> Giữ bình hoa sạch sẽ, thêm 1/2 gói dưỡng hoa tặng kèm hoặc vài giọt chanh tươi.</div>
              </div>
              <div className="flex items-start gap-2.5">
                <Sun className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div><strong>Vị trí đặt hoa:</strong> Tránh quạt gió thổi trực tiếp, tránh ánh nắng gắt nhiệt độ cao và hoa quả chín gần bình hoa.</div>
              </div>
            </div>
            <button onClick={onClose} className="btn-primary w-full text-xs py-2.5 rounded-xl shadow-md">
              Đã ghi nhớ
            </button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};
