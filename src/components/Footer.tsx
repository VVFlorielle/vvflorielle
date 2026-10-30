import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  PhoneCall,
  MapPin,
  Clock,
  Mail,
  ShieldCheck,
  Truck,
  HeartHandshake,
  QrCode,
  Gift,
  Droplets,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { PopupType } from './InfoPopups';

interface FooterProps {
  onOpenPopup?: (type: PopupType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPopup }) => {
  const { settings, setSelectedCategory, setCurrentView, setAuthModalMode, setIsAuthModalOpen } = useStore();

  return (
    <footer className="mt-16 pb-28 md:pb-12 text-slate-600 select-none">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6">
        {/* =========================================================================
            MOBILE FOOTER (MD:HIDDEN): MỖI THÔNG TIN TRÊN 1 KHUNG NGANG (GIỐNG PHOTOTIINLOVE)
            Tối ưu màn hình hẹp, không để nhiều khối to cồng kềnh, tinh gọn & thanh thoát
            ========================================================================= */}
        <div className="block md:hidden space-y-2.5">
          {/* 1. Header Khung Nhãn Hiệu & Slogan */}
          <div className="p-3.5 rounded-2xl glass-nav-luminous flex items-center justify-between gap-3 shadow-xs border border-white/90">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src="/logo-vvflorielle-horizontal.png"
                alt="V&V Florielle"
                className="h-7 w-auto object-contain shrink-0"
              />
              <div className="min-w-0">
                <div className="font-extrabold text-xs text-slate-900 truncate">V&V Florielle</div>
                <div className="text-[10px] text-slate-500 truncate">Hoa tươi nghệ thuật 105 Doãn Kế Thiện</div>
              </div>
            </div>
            <span className="text-[9.5px] font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full shrink-0">
              Hà Nội
            </span>
          </div>

          {/* 2. Khung Ngang 1: Địa chỉ Showroom (Mở trang Liên Hệ & Chỉ Đường) */}
          <div
            onClick={() => setCurrentView('contact')}
            className="p-3 rounded-xl bg-white/75 hover:bg-white/95 backdrop-blur-md border border-white/90 shadow-2xs flex items-center justify-between gap-2 text-xs cursor-pointer active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-2 min-w-0">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-slate-800 text-[11.5px] font-medium truncate">
                {settings.address}
              </span>
            </div>
            <span className="text-[10.5px] font-bold text-emerald-700 shrink-0 flex items-center gap-0.5">
              Bản đồ <ChevronRight className="w-3 h-3" />
            </span>
          </div>

          {/* 3. Khung Ngang 2: Hotline & Zalo Tư Vấn 24/7 */}
          <div className="p-3 rounded-xl bg-white/75 hover:bg-white/95 backdrop-blur-md border border-white/90 shadow-2xs flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <PhoneCall className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-slate-800 text-[11.5px] font-medium">
                Hotline / Zalo: <strong className="font-bold text-slate-900">{settings.hotline}</strong>
              </span>
            </div>
            <a
              href={`tel:${settings.hotline.replace(/[^0-9]/g, '')}`}
              className="text-[10.5px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-2.5 py-1 rounded-lg shrink-0 shadow-xs"
            >
              Gọi ngay
            </a>
          </div>

          {/* 4. Khung Ngang 3: Cam kết giao hỏa tốc 60-90p & Duyệt ảnh Zalo */}
          <div
            onClick={() => onOpenPopup && onOpenPopup('guarantee')}
            className="p-3 rounded-xl bg-white/75 hover:bg-white/95 backdrop-blur-md border border-white/90 shadow-2xs flex items-center justify-between gap-2 text-xs cursor-pointer active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-slate-800 text-[11.5px] font-medium truncate">
                Giao hoả tốc 60 - 90P Hà Nội • Chụp ảnh duyệt qua Zalo
              </span>
            </div>
            <span className="text-[10.5px] font-bold text-emerald-700 shrink-0 flex items-center gap-0.5">
              Cam kết <ChevronRight className="w-3 h-3" />
            </span>
          </div>

          {/* 5. Khung Ngang 4: VietQR MB Bank Cọc 50% tự động */}
          <div
            onClick={() => onOpenPopup && onOpenPopup('voucher')}
            className="p-3 rounded-xl bg-white/75 hover:bg-white/95 backdrop-blur-md border border-white/90 shadow-2xs flex items-center justify-between gap-2 text-xs cursor-pointer active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-2 min-w-0">
              <QrCode className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-slate-800 text-[11.5px] font-medium truncate">
                VietQR {settings.bankName} - <strong className="font-mono text-emerald-700">{settings.bankAccount}</strong> (Cọc 50%)
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
              Tự động 2P
            </span>
          </div>

          {/* 6. Khung Ngang 5: Giới Thiệu & Câu Chuyện V&V Florielle */}
          <div
            onClick={() => onOpenPopup && onOpenPopup('about')}
            className="p-3 rounded-xl bg-white/75 hover:bg-white/95 backdrop-blur-md border border-white/90 shadow-2xs flex items-center justify-between gap-2 text-xs cursor-pointer active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-2 min-w-0">
              <HeartHandshake className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-slate-800 text-[11.5px] font-medium truncate">
                Về tiệm hoa V&V Florielle • Nghệ thuật trao gửi yêu thương
              </span>
            </div>
            <span className="text-[10.5px] font-bold text-emerald-700 shrink-0 flex items-center gap-0.5">
              Chi tiết <ChevronRight className="w-3 h-3" />
            </span>
          </div>

          {/* 7. Copyright chân trang mobile */}
          <div className="pt-2 text-center text-[10.5px] text-slate-400 space-y-0.5">
            <div>© {new Date().getFullYear()} {settings.name} • 105 Doãn Kế Thiện, Cầu Giấy, Hà Nội</div>
            <div>Boutique Florist &amp; Thiết kế hoa nghệ thuật cao cấp</div>
          </div>
        </div>

        {/* =========================================================================
            DESKTOP FOOTER (HIDDEN MD:BLOCK): BỐ TRÍ ĐẦY ĐỦ 4 THẺ CAM KẾT & 3 CỘT NỘI DUNG
            ========================================================================= */}
        <div className="hidden md:block rounded-[36px] glass-nav-luminous p-7 md:p-8 space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.06),inset_0_1.5px_1px_rgba(255,255,255,1)]">
          {/* 1. TOP COMMITMENT FEATURE CARDS (4 Rounded Inner Cards) */}
          <div className="grid grid-cols-4 gap-4">
            <div
              onClick={() => onOpenPopup && onOpenPopup('locations')}
              className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/70 hover:bg-white/90 backdrop-blur-md border border-white/90 shadow-xs transition-all cursor-pointer hover:-translate-y-0.5"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Giao Hoả Tốc 60 - 90 Phút</h4>
                <p className="text-xs text-slate-500 mt-0.5">Nội thành Hà Nội từ 105 Doãn Kế Thiện, Cầu Giấy.</p>
              </div>
            </div>

            <div
              onClick={() => onOpenPopup && onOpenPopup('guarantee')}
              className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/70 hover:bg-white/90 backdrop-blur-md border border-white/90 shadow-xs transition-all cursor-pointer hover:-translate-y-0.5"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-100/80 text-rose-700 flex items-center justify-center shrink-0 border border-rose-200">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Hoa Tươi Mới 100%</h4>
                <p className="text-xs text-slate-500 mt-0.5">Nhập mới mỗi sáng, bảo hành đổi trả trong 2h.</p>
              </div>
            </div>

            <div
              onClick={() => onOpenPopup && onOpenPopup('guarantee')}
              className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/70 hover:bg-white/90 backdrop-blur-md border border-white/90 shadow-xs transition-all cursor-pointer hover:-translate-y-0.5"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100/80 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Chụp Ảnh Trước Khi Giao</h4>
                <p className="text-xs text-slate-500 mt-0.5">Khách hàng duyệt ảnh hoa thật qua Zalo trước khi giao.</p>
              </div>
            </div>

            <div
              onClick={() => onOpenPopup && onOpenPopup('voucher')}
              className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/70 hover:bg-white/90 backdrop-blur-md border border-white/90 shadow-xs transition-all cursor-pointer hover:-translate-y-0.5"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-100/80 text-purple-700 flex items-center justify-center shrink-0 border border-purple-200">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Voucher Chào Mừng 30K</h4>
                <p className="text-xs text-slate-500 mt-0.5">Mã FREESHIP30K tặng thành viên mới.</p>
              </div>
            </div>
          </div>

          {/* 2. THREE ROUNDED INNER CARDS FOR CONTENT */}
          <div className="grid grid-cols-3 gap-5 text-sm">
            {/* Card 1: Khung Thông Tin Tiệm Hoa */}
            <div className="rounded-2xl bg-white/60 hover:bg-white/75 backdrop-blur-md border border-white/80 p-5 shadow-xs space-y-3 transition-colors">
              <div>
                <img
                  src="/logo-vvflorielle-horizontal.png"
                  alt="V&V Florielle"
                  className="h-9 w-auto object-contain mb-2"
                />
                <div className="font-extrabold text-base text-slate-900 tracking-tight flex items-center gap-1.5">
                  <span>{settings.name}</span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                    Hà Nội
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">
                  {settings.slogan}. Tiệm hoa tươi thiết kế nghệ thuật cao cấp: khai trương tài lộc, sinh nhật yêu thương, hoa cưới và sự kiện.
                </p>
              </div>

              <div className="space-y-2 text-xs pt-1 border-t border-slate-100">
                <div
                  onClick={() => setCurrentView('contact')}
                  className="flex items-start gap-2 cursor-pointer hover:text-emerald-700 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{settings.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Hotline / Zalo: <strong className="text-slate-800">{settings.hotline}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{settings.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Mở cửa: {settings.openingHours}</span>
                </div>
              </div>
            </div>

            {/* Card 2: Khung Danh Mục Hoa Tiêu Biểu */}
            <div className="rounded-2xl bg-white/60 hover:bg-white/75 backdrop-blur-md border border-white/80 p-5 shadow-xs space-y-3 transition-colors">
              <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Danh Mục Hoa Tiêu Biểu</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li
                  onClick={() => {
                    setSelectedCategory('khai-truong');
                    setCurrentView('store');
                  }}
                  className="hover:text-emerald-700 cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  <span className="text-emerald-600">❖</span>
                  <span>Kệ hoa khai trương tài lộc &amp; hồng phát</span>
                </li>
                <li
                  onClick={() => {
                    setSelectedCategory('sinh-nhat');
                    setCurrentView('store');
                  }}
                  className="hover:text-emerald-700 cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  <span className="text-emerald-600">❖</span>
                  <span>Bó hoa sinh nhật thiết kế Hàn Quốc</span>
                </li>
                <li
                  onClick={() => {
                    setSelectedCategory('tinh-yeu');
                    setCurrentView('store');
                  }}
                  className="hover:text-emerald-700 cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  <span className="text-emerald-600">❖</span>
                  <span>Hoa tình yêu &amp; hoa hồng Ecuador sang trọng</span>
                </li>
                <li
                  onClick={() => {
                    setSelectedCategory('lan-ho-diep');
                    setCurrentView('store');
                  }}
                  className="hover:text-emerald-700 cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  <span className="text-emerald-600">❖</span>
                  <span>Chậu hoa Lan Hồ Điệp đại sảnh cao cấp</span>
                </li>
                <li
                  onClick={() => setCurrentView('care')}
                  className="hover:text-emerald-700 cursor-pointer transition-colors text-emerald-700 font-semibold pt-1 flex items-center gap-1"
                >
                  <Droplets className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Xem cẩm nang chăm sóc hoa 5-7 ngày</span>
                </li>
              </ul>
            </div>

            {/* Card 3: Khung Thông Tin Thanh Toán Quét QR */}
            <div className="rounded-2xl bg-white/60 hover:bg-white/75 backdrop-blur-md border border-white/80 p-5 shadow-xs space-y-3 transition-colors">
              <div className="font-bold text-sm text-slate-900 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-emerald-600" />
                  <span>Thanh Toán Quét VietQR</span>
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  Cọc 50%
                </span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div>Ngân hàng: <strong className="text-slate-800">{settings.bankName}</strong></div>
                <div>Số tài khoản: <strong className="text-emerald-700 font-mono text-sm font-black">{settings.bankAccount}</strong></div>
                <div>Chủ tài khoản: <strong className="text-slate-800">{settings.bankHolder}</strong></div>
                <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span>Cú pháp cọc:</span>
                  <span className="font-mono bg-white px-2 py-0.5 rounded-lg border border-slate-200 text-emerald-800 font-bold">
                    VVF [Mã Đơn] [SĐT]
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. BOTTOM COPYRIGHT */}
          <div className="pt-4 border-t border-white/80 flex items-center justify-between text-xs text-slate-400 gap-3">
            <div>
              © {new Date().getFullYear()} {settings.name}. Hệ thống đặt hoa trực tuyến cao cấp tại 105 Doãn Kế Thiện, Cầu Giấy, Hà Nội.
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
              <span>Boutique Florist &amp; Custom Design</span>
              <span>•</span>
              <span>100% Hoa Tươi Loại 1</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
