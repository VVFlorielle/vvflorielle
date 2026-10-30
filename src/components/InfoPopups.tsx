import React from 'react';
import {
  X,
  ShieldCheck,
  MapPin,
  PhoneCall,
  Gift,
  Droplets,
  Scissors,
  Sun,
  CheckCircle2,
  Flower2,
  Palette,
  Truck,
  Sparkles,
  Heart,
  Smartphone,
  Download,
  QrCode
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export type PopupType = 'guarantee' | 'voucher' | 'locations' | 'care' | 'promotions' | 'services' | 'about' | 'app-download' | null;

interface InfoPopupsProps {
  activePopup: PopupType;
  onClose: () => void;
}

export const InfoPopups: React.FC<InfoPopupsProps> = ({ activePopup, onClose }) => {
  const { settings, promotions, showToast, setCurrentView } = useStore();

  if (!activePopup) return null;

  return (
    <div className="glass-overlay z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div
        className={`glass-modal-content w-full relative transition-all duration-300 ${
          activePopup === 'services'
            ? 'max-w-2xl sm:max-w-3xl'
            : activePopup === 'app-download'
            ? 'max-w-lg'
            : 'max-w-md'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="glass-modal-header relative flex items-center justify-center text-center">
          <span className="text-xs sm:text-sm font-bold text-slate-800 text-center mx-auto">
            Thông Tin Dịch Vụ V&V Florielle
          </span>
          <button
            onClick={onClose}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
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

        {/* 5. DỊCH VỤ HOA TƯƠI V&V FLORIELLE (SPACIOUS LUXURY GRID) */}
        {activePopup === 'services' && (
          <div className="space-y-5">
            <div className="text-center space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-100 px-3 py-0.5 rounded-full">
                V&V Florielle Hà Nội
              </span>
              <h3 className="font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
                Dịch Vụ Hoa Tươi Nghệ Thuật Chuyên Nghiệp
              </h3>
              <p className="text-xs text-slate-500 max-w-lg mx-auto">
                105 Doãn Kế Thiện, Cầu Giấy • Đáp ứng trọn vẹn mọi nhu cầu quà tặng và sự kiện
              </p>
            </div>

            {/* 2x2 Spacious Luxury Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Card 1 */}
              <div className="p-4 rounded-2xl bg-white/95 border border-emerald-200/80 shadow-xs flex flex-col justify-between space-y-3 hover:shadow-md transition-shadow">
                <div className="space-y-1.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Flower2 className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">Hoa Tươi Thiết Kế Mẫu Sẵn</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Hàng trăm mẫu bó hoa Hàn Quốc, giỏ hoa khai trương, lan hồ điệp cắm mới mỗi sáng từ hoa loại 1 Đà Lạt.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setCurrentView('catalog');
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors text-center"
                >
                  Xem Tất Cả Mẫu Hoa →
                </button>
              </div>

              {/* Card 2 */}
              <div className="p-4 rounded-2xl bg-white/95 border border-rose-200/80 shadow-xs flex flex-col justify-between space-y-3 hover:shadow-md transition-shadow">
                <div className="space-y-1.5">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
                    <Palette className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">Hoa Thiết Kế Riêng Theo Yêu Cầu</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Florist tư vấn riêng theo tone màu phong thủy, loại hoa yêu thích và ngân sách của bạn để tạo tác phẩm độc bản.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setCurrentView('contact');
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold transition-colors text-center"
                >
                  Gửi Yêu Cầu Thiết Kế →
                </button>
              </div>

              {/* Card 3 */}
              <div className="p-4 rounded-2xl bg-white/95 border border-sky-200/80 shadow-xs flex flex-col justify-between space-y-3 hover:shadow-md transition-shadow">
                <div className="space-y-1.5">
                  <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center">
                    <Truck className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">Điện Hoa Hỏa Tốc 60 - 90 Phút</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Giao nhanh nội thành Hà Nội. Luôn chụp ảnh và gửi video thành phẩm qua Zalo cho bạn duyệt trước khi giao.
                  </p>
                </div>
                <a
                  href={`tel:${settings.hotline.replace(/[^0-9]/g, '')}`}
                  className="w-full py-2 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold transition-colors text-center block"
                >
                  Gọi Hotline Giao Gấp ({settings.hotline})
                </a>
              </div>

              {/* Card 4 */}
              <div className="p-4 rounded-2xl bg-white/95 border border-amber-200/80 shadow-xs flex flex-col justify-between space-y-3 hover:shadow-md transition-shadow">
                <div className="space-y-1.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">Hoa Cưới &amp; Sự Kiện Doanh Nghiệp</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Thiết kế trọn gói hoa cưới cầm tay, trang trí lễ đường, backdrop hoa tươi và lẵng hoa chúc mừng đối tác lớn.
                  </p>
                </div>
                <a
                  href={`https://zalo.me/${settings.hotline.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition-colors text-center block"
                >
                  Tư Vấn Zalo Sự Kiện →
                </a>
              </div>
            </div>

            {/* Bottom APK Download Card */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/90 border border-emerald-300/80 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-emerald-950 font-bold text-xs">Ứng Dụng V&V Florielle (Android APK)</strong>
                    <span className="text-[9px] bg-emerald-600 text-white font-black px-1.5 py-0.2 rounded-full">0.85MB</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">Cài đặt trực tiếp trên điện thoại: Tích điểm VIP, đặt hoa 1 chạm</p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href="/VVFlorielle.apk"
                  download="VVFlorielle.apk"
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải File APK</span>
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-2 rounded-xl bg-white text-slate-700 hover:bg-slate-100 text-xs font-bold border border-slate-200"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 6. GIỚI THIỆU VỀ V&V FLORIELLE */}
        {activePopup === 'about' && (
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-100 to-teal-100 text-emerald-800 flex items-center justify-center mx-auto shadow-md shadow-emerald-600/10 border border-emerald-200/50">
              <Heart className="w-7 h-7 text-emerald-700" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-base text-slate-900 tracking-tight">Về Tiệm Hoa V&V Florielle</h3>
              <p className="text-xs text-slate-500 mt-1">Nghệ Thuật Trao Gửi Yêu Thương • 105 Doãn Kế Thiện, Hà Nội</p>
            </div>
            <div className="space-y-3 text-xs text-slate-600 bg-slate-50/90 p-4 rounded-2xl border border-slate-200/60 leading-relaxed">
              <p>
                <strong>V&V Florielle</strong> là thương hiệu tiệm hoa tươi nghệ thuật cao cấp tọa lạc tại <strong>105 Doãn Kế Thiện, Cầu Giấy, Hà Nội</strong>. Chúng tôi tin rằng mỗi đóa hoa trao đi là một thông điệp chân thành của tình yêu, sự trân trọng và niềm tin.
              </p>
              <div className="space-y-2 pt-1 border-t border-slate-200/60">
                <div className="flex items-center gap-2 text-slate-800 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% hoa tươi loại 1 tuyển chọn mỗi sáng</span>
                </div>
                <div className="flex items-center gap-2 text-slate-800 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Chụp ảnh thật gửi duyệt qua Zalo trước khi giao</span>
                </div>
                <div className="flex items-center gap-2 text-slate-800 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Cam kết bảo hành đổi mới trong 2H nếu không ưng ý</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="btn-primary w-full text-xs py-2.5 rounded-xl shadow-md">
              Đóng
            </button>
          </div>
        )}

        {/* 7. APP DOWNLOAD MODAL (Android WebView APK) */}
        {activePopup === 'app-download' && (
          <div className="space-y-3.5 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-700 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/25 border-2 border-white overflow-hidden p-2">
              <img src="/logo-vvflorielle-square.png" alt="V&V Florielle App" className="w-full h-full object-contain" />
            </div>
            <div className="text-center">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider mb-1">
                <span>Android APK v1.0.0</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                <span>Siêu Nhẹ 0.85 MB</span>
              </div>
              <h3 className="font-extrabold text-base text-slate-900 tracking-tight">Tải Ứng Dụng V&V Florielle</h3>
              <p className="text-xs text-slate-500 mt-0.5">Tiệm Hoa Tươi Nghệ Thuật 105 Doãn Kế Thiện, Cầu Giấy, Hà Nội</p>
            </div>

            {/* App Features Grid */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700">
              <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-2">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900 leading-tight">Điện hoa 60-90P</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Chụp ảnh duyệt qua Zalo</div>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-100 flex items-start gap-2">
                <Gift className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900 leading-tight">Tích điểm VIP</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Freeship 100% quà tặng</div>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-sky-50/70 border border-sky-100 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900 leading-tight">Chuông Báo Đơn</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Cập nhật đơn hàng tức thì</div>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-100 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900 leading-tight">Cọc VietQR 2P</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Đối soát siêu tốc 24/7</div>
                </div>
              </div>
            </div>

            {/* Direct Download Action Button */}
            <a
              href="/VVFlorielle.apk"
              download="VVFlorielle.apk"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-transform active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Tải Xuống File APK (VVFlorielle.apk • 0.85 MB)</span>
            </a>

            {/* QR Code Section for Scanning from Desktop or Other Phones */}
            <div className="p-3 bg-slate-50/90 rounded-2xl border border-slate-200/70 flex items-center gap-3">
              <div className="p-1 bg-white rounded-xl border border-slate-200 shrink-0 shadow-2xs">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&margin=0&data=https://vvflorielle.pages.dev/VVFlorielle.apk"
                  alt="QR tải app V&V Florielle"
                  className="w-16 h-16 object-contain"
                />
              </div>
              <div className="text-[11px] text-slate-600 leading-snug">
                <div className="font-bold text-slate-900 flex items-center gap-1">
                  <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Quét QR để tải về điện thoại</span>
                </div>
                <p className="text-[10.5px] text-slate-500 mt-0.5">
                  Dùng camera hoặc Zalo trên điện thoại quét mã QR bên cạnh để tải trực tiếp file cài đặt APK.
                </p>
              </div>
            </div>

            {/* Fast Install Guide */}
            <div className="text-[10.5px] text-slate-500 space-y-1 bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-100/80">
              <div className="font-bold text-emerald-950">Hướng dẫn cài đặt nhanh:</div>
              <div>1. Bấm <strong>Tải Xuống File APK</strong> ở trên (hoặc quét mã QR).</div>
              <div>2. Mở file <code className="bg-white px-1 py-0.2 rounded border border-emerald-200 font-semibold">VVFlorielle.apk</code>, chọn <strong>Cho phép cài đặt từ nguồn này</strong>.</div>
              <div>3. Bấm <strong>Cài đặt</strong> và mở ứng dụng để trải nghiệm mua hoa nghệ thuật!</div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};
