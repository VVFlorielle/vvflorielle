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
  Droplets
} from 'lucide-react';
import { PopupType } from './InfoPopups';

interface FooterProps {
  onOpenPopup?: (type: PopupType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPopup }) => {
  const { settings, setSelectedCategory, setCurrentView, setAuthModalMode, setIsAuthModalOpen } = useStore();

  return (
    <footer className="mt-16 pb-24 md:pb-12 text-slate-600 select-none">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        {/* FROSTED GLASS OUTER WRAPPER WITH GENTLE ROUNDED CORNERS (Synchronized Width with Header) */}
        <div className="rounded-3xl md:rounded-[36px] glass-nav-luminous p-5 sm:p-7 md:p-8 space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.06),inset_0_1.5px_1px_rgba(255,255,255,1)]">
          {/* 1. TOP COMMITMENT FEATURE CARDS (4 Rounded Inner Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 text-sm">
            {/* Card 1: Khung Thông Tin Tiệm Hoa */}
            <div className="rounded-2xl bg-white/60 hover:bg-white/75 backdrop-blur-md border border-white/80 p-5 shadow-xs space-y-3 transition-colors">
              <div>
                <img
                  src="/logo-vvflorielle-horizontal.png"
                  alt="V&V Florielle"
                  className="h-8 sm:h-9 w-auto object-contain mb-2"
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
                  onClick={() => onOpenPopup && onOpenPopup('locations')}
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
                  onClick={() => onOpenPopup && onOpenPopup('care')}
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

          {/* 3. BOTTOM COPYRIGHT & ADMIN PORTAL ACCESS */}
          <div className="pt-4 border-t border-white/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
            <div>
              © {new Date().getFullYear()} {settings.name}. Hệ thống đặt hoa trực tuyến cao cấp tại 105 Doãn Kế Thiện, Cầu Giấy, Hà Nội.
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setAuthModalMode('admin');
                  setIsAuthModalOpen(true);
                }}
                className="text-[11px] text-slate-500 hover:text-purple-700 flex items-center gap-1 transition-colors hover:underline font-semibold"
                title="Dành cho Quản trị viên (admin & vvflorielle)"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                <span>Cổng Quản Trị Viên</span>
              </button>
              <span>•</span>
              <span className="text-[11px]">Boutique Florist &amp; Custom Design</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
