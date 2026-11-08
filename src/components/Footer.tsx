import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  PhoneCall,
  MapPin,
  Clock,
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
  const { settings, setSelectedCategory, setCurrentView } = useStore();

  return (
    <footer className="mt-4 pb-24 md:pb-10 text-slate-600 select-none">
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-6">
        {/* UNIFIED RESPONSIVE FOOTER: Identical 3-Column Studio Layout preserved across Mobile & Desktop */}
        <div className="rounded-[22px] sm:rounded-[36px] glass-nav-luminous p-2.5 sm:p-6 md:p-8 space-y-2.5 sm:space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.06),inset_0_1.5px_1px_rgba(255,255,255,1)] border border-white/80">
          
          {/* 1. TOP 4 COMMITMENT FEATURE CARDS (Compact row matching Desktop) */}
          <div className="grid grid-cols-2 min-[440px]:grid-cols-4 gap-1.5 sm:gap-3.5 md:gap-4">
            {/* Card 1: Giao Hỏa Tốc */}
            <div
              onClick={() => onOpenPopup && onOpenPopup('locations')}
              className="flex items-center sm:items-start gap-1.5 min-[375px]:gap-2 sm:gap-3 p-1.5 min-[375px]:p-2 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/70 hover:bg-white/90 backdrop-blur-md border border-white/90 shadow-2xs transition-all cursor-pointer hover:-translate-y-0.5 active:scale-98"
            >
              <div className="w-6 h-6 min-[375px]:w-7 min-[375px]:h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                <Truck className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-slate-800 text-[10px] min-[375px]:text-[11px] sm:text-sm leading-tight truncate">
                  Giao Hoả Tốc 15P
                </h4>
                <p className="text-[8.5px] min-[375px]:text-[9.5px] sm:text-xs text-slate-500 mt-0.5 truncate leading-relaxed">
                  15P nội &amp; 60P ngoại thành HN.
                </p>
              </div>
            </div>

            {/* Card 2: Hoa Tươi Mới 100% */}
            <div
              onClick={() => onOpenPopup && onOpenPopup('guarantee')}
              className="flex items-center sm:items-start gap-1.5 min-[375px]:gap-2 sm:gap-3 p-1.5 min-[375px]:p-2 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/70 hover:bg-white/90 backdrop-blur-md border border-white/90 shadow-2xs transition-all cursor-pointer hover:-translate-y-0.5 active:scale-98"
            >
              <div className="w-6 h-6 min-[375px]:w-7 min-[375px]:h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-rose-100/80 text-rose-700 flex items-center justify-center shrink-0 border border-rose-200">
                <HeartHandshake className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-slate-800 text-[10px] min-[375px]:text-[11px] sm:text-sm leading-tight truncate">
                  Hoa Tươi Mới 100%
                </h4>
                <p className="text-[8.5px] min-[375px]:text-[9.5px] sm:text-xs text-slate-500 mt-0.5 truncate leading-relaxed">
                  Nhập mới, đổi trả trong 2h.
                </p>
              </div>
            </div>

            {/* Card 3: Chụp Ảnh Trước Khi Giao */}
            <div
              onClick={() => onOpenPopup && onOpenPopup('guarantee')}
              className="flex items-center sm:items-start gap-1.5 min-[375px]:gap-2 sm:gap-3 p-1.5 min-[375px]:p-2 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/70 hover:bg-white/90 backdrop-blur-md border border-white/90 shadow-2xs transition-all cursor-pointer hover:-translate-y-0.5 active:scale-98"
            >
              <div className="w-6 h-6 min-[375px]:w-7 min-[375px]:h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-100/80 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-slate-800 text-[10px] min-[375px]:text-[11px] sm:text-sm leading-tight truncate">
                  Chụp Ảnh Zalo
                </h4>
                <p className="text-[8.5px] min-[375px]:text-[9.5px] sm:text-xs text-slate-500 mt-0.5 truncate leading-relaxed">
                  Duyệt ảnh thật trước khi giao.
                </p>
              </div>
            </div>

            {/* Card 4: Voucher Chào Mừng 30K */}
            <div
              onClick={() => onOpenPopup && onOpenPopup('voucher')}
              className="flex items-center sm:items-start gap-1.5 min-[375px]:gap-2 sm:gap-3 p-1.5 min-[375px]:p-2 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/70 hover:bg-white/90 backdrop-blur-md border border-white/90 shadow-2xs transition-all cursor-pointer hover:-translate-y-0.5 active:scale-98"
            >
              <div className="w-6 h-6 min-[375px]:w-7 min-[375px]:h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-purple-100/80 text-purple-700 flex items-center justify-center shrink-0 border border-purple-200">
                <Gift className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-slate-800 text-[10px] min-[375px]:text-[11px] sm:text-sm leading-tight truncate">
                  Voucher 30K
                </h4>
                <p className="text-[8.5px] min-[375px]:text-[9.5px] sm:text-xs text-slate-500 mt-0.5 truncate leading-relaxed">
                  Mã FREESHIP30K tặng bạn mới.
                </p>
              </div>
            </div>
          </div>

          {/* 2. THREE CONTENT CARDS: Giữ nguyên cấu trúc 3 cột như desktop, thu nhỏ gọn gàng chuẩn Phototiinlove */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-4 md:gap-5 text-xs sm:text-sm">
            {/* Card 1: Khung Thông Tin Tiệm Hoa */}
            <div className="rounded-xl sm:rounded-2xl bg-white/60 hover:bg-white/75 backdrop-blur-md border border-white/80 p-2 sm:p-5 shadow-2xs space-y-1.5 sm:space-y-3 transition-colors flex flex-col justify-between">
              <div>
                <img
                  src="/logo-vvflorielle-horizontal.png"
                  alt="V&V Florielle"
                  className="h-5 min-[375px]:h-6 sm:h-9 w-auto object-contain mb-1"
                />
                <div className="font-black text-[10px] min-[375px]:text-[11.5px] sm:text-base text-slate-900 tracking-tight flex items-center gap-1">
                  <span className="truncate">{settings.name}</span>
                </div>
                <p className="text-[8px] min-[375px]:text-[9px] sm:text-xs text-slate-500 leading-tight mt-0.5 line-clamp-2">
                  {settings.slogan}. Tiệm hoa tươi thiết kế cao cấp Hà Nội.
                </p>
              </div>

              <div className="space-y-1 sm:space-y-2 text-[8px] min-[375px]:text-[9px] sm:text-xs pt-1 sm:pt-2 border-t border-slate-100/80">
                <div
                  onClick={() => setCurrentView('contact')}
                  className="flex items-center gap-1 cursor-pointer hover:text-emerald-700 transition-colors truncate"
                  title={settings.address}
                >
                  <MapPin className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">105 Doãn Kế Thiện, CG</span>
                </div>
                <div className="flex items-center gap-1 truncate">
                  <PhoneCall className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-emerald-600 shrink-0" />
                  <a
                    href={`tel:${settings.hotline.replace(/[^0-9]/g, '')}`}
                    className="text-slate-900 font-bold hover:text-emerald-700 hover:underline truncate"
                  >
                    {settings.hotline}
                  </a>
                </div>
                <div className="flex items-center gap-1 truncate text-slate-500">
                  <Clock className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">06:30 - 21:30</span>
                </div>
              </div>
            </div>

            {/* Card 2: Khung Danh Mục Hoa Tiêu Biểu */}
            <div className="rounded-xl sm:rounded-2xl bg-white/60 hover:bg-white/75 backdrop-blur-md border border-white/80 p-2 sm:p-5 shadow-2xs space-y-1.5 sm:space-y-3 transition-colors flex flex-col justify-between">
              <div>
                <div className="font-bold text-[10px] min-[375px]:text-[11.5px] sm:text-sm text-slate-900 flex items-center gap-1 sm:gap-2">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span className="truncate">Danh Mục Hoa</span>
                </div>
                <ul className="space-y-1 sm:space-y-2 text-[8px] min-[375px]:text-[9px] sm:text-xs text-slate-600 mt-1 sm:mt-2">
                  <li
                    onClick={() => {
                      setSelectedCategory('khai-truong');
                      setCurrentView('store');
                    }}
                    className="hover:text-emerald-700 cursor-pointer transition-colors flex items-center gap-1 truncate"
                  >
                    <span className="text-emerald-600 shrink-0 text-[8px] sm:text-xs">❖</span>
                    <span className="truncate">Khai trương tài lộc</span>
                  </li>
                  <li
                    onClick={() => {
                      setSelectedCategory('sinh-nhat');
                      setCurrentView('store');
                    }}
                    className="hover:text-emerald-700 cursor-pointer transition-colors flex items-center gap-1 truncate"
                  >
                    <span className="text-emerald-600 shrink-0 text-[8px] sm:text-xs">❖</span>
                    <span className="truncate">Sinh nhật thiết kế</span>
                  </li>
                  <li
                    onClick={() => {
                      setSelectedCategory('tinh-yeu');
                      setCurrentView('store');
                    }}
                    className="hover:text-emerald-700 cursor-pointer transition-colors flex items-center gap-1 truncate"
                  >
                    <span className="text-emerald-600 shrink-0 text-[8px] sm:text-xs">❖</span>
                    <span className="truncate">Hoa tình yêu Ecuador</span>
                  </li>
                  <li
                    onClick={() => {
                      setSelectedCategory('lan-ho-diep');
                      setCurrentView('store');
                    }}
                    className="hover:text-emerald-700 cursor-pointer transition-colors flex items-center gap-1 truncate"
                  >
                    <span className="text-emerald-600 shrink-0 text-[8px] sm:text-xs">❖</span>
                    <span className="truncate">Lan Hồ Điệp đại sảnh</span>
                  </li>
                </ul>
              </div>

              <div
                onClick={() => {
                  if (onOpenPopup) onOpenPopup('care');
                }}
                className="hover:text-emerald-700 cursor-pointer transition-colors text-emerald-700 font-semibold pt-1 border-t border-slate-100/80 flex items-center gap-1 text-[8px] min-[375px]:text-[9px] sm:text-xs truncate"
              >
                <Droplets className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">Cẩm nang chăm hoa</span>
              </div>
            </div>

            {/* Card 3: Khung Thông Tin Thanh Toán Quét QR */}
            <div className="rounded-xl sm:rounded-2xl bg-white/60 hover:bg-white/75 backdrop-blur-md border border-white/80 p-2 sm:p-5 shadow-2xs space-y-1.5 sm:space-y-3 transition-colors flex flex-col justify-between">
              <div>
                <div className="font-bold text-[10px] min-[375px]:text-[11.5px] sm:text-sm text-slate-900 flex items-center justify-between gap-1">
                  <span className="flex items-center gap-1 truncate">
                    <QrCode className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
                    <span className="truncate">Quét VietQR</span>
                  </span>
                  <span className="text-[7.5px] min-[375px]:text-[8.5px] sm:text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1 sm:px-1.5 py-0.5 rounded-full shrink-0">
                    Cọc 50%
                  </span>
                </div>
                <div className="space-y-1 sm:space-y-1.5 text-[8px] min-[375px]:text-[9px] sm:text-xs mt-1 sm:mt-2">
                  <div className="truncate">
                    Ngân hàng: <strong className="text-slate-800">{settings.bankName}</strong>
                  </div>
                  <div className="truncate">
                    STK:{' '}
                    <strong className="text-emerald-700 font-mono text-[8.5px] min-[375px]:text-[9.5px] sm:text-sm font-black">
                      {settings.bankAccount}
                    </strong>
                  </div>
                  <div className="truncate">
                    Chủ TK: <strong className="text-slate-800 truncate">{settings.bankHolder}</strong>
                  </div>
                </div>
              </div>

              <div className="text-[7.5px] min-[375px]:text-[8.5px] sm:text-[11px] text-slate-500 pt-1 border-t border-slate-100/80 flex items-center justify-between gap-1">
                <span className="shrink-0">Cú pháp:</span>
                <span className="font-mono bg-white px-1 sm:px-2 py-0.5 rounded border border-slate-200 text-emerald-800 font-bold truncate text-[7.5px] min-[375px]:text-[8.5px] sm:text-xs">
                  VVF [Mã]
                </span>
              </div>
            </div>
          </div>

          {/* 3. BOTTOM COPYRIGHT */}
          <div className="pt-2 sm:pt-4 border-t border-white/80 flex flex-col sm:flex-row items-center justify-between text-[8.5px] min-[375px]:text-[9.5px] sm:text-xs text-slate-400 gap-1 sm:gap-2 text-center sm:text-left">
            <div className="truncate">
              © {new Date().getFullYear()} {settings.name}. Hệ thống đặt hoa tươi thiết kế trực tuyến cao cấp.
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-[8px] min-[375px]:text-[9px] sm:text-[11px] text-slate-500 font-medium shrink-0">
              <span>Boutique Florist</span>
              <span>•</span>
              <span>100% Hoa Tươi Loại 1</span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};
