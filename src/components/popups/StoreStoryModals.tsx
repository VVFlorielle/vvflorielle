import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Flower2,
  Palette,
  Truck,
  Heart,
  PhoneCall,
  MapPin
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface StoryModalProps {
  onClose: () => void;
}

// 1. Guarantee Modal Content
export const GuaranteeModalContent: React.FC<StoryModalProps> = ({ onClose }) => {
  return (
    <div className="space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md shadow-emerald-600/10 border border-emerald-200/50 shrink-0">
        <ShieldCheck className="w-6 h-6" />
      </div>
      <div className="text-center">
        <h3 className="font-bold text-base text-slate-900 tracking-tight">Cam Kết Chất Lượng Hoa Tươi 100%</h3>
        <p className="text-xs text-slate-500 mt-1">Đặc quyền bảo hành chỉ có tại V&amp;V Florielle Hà Nội</p>
      </div>
      <div className="space-y-3 text-xs text-slate-600 bg-slate-50/90 p-4 rounded-2xl border border-slate-200/60 leading-relaxed">
        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            <strong>Tuyển chọn loại 1:</strong> 100% hoa tươi loại một nhập mới mỗi ngày từ đơn vị vườn hoa &amp; hoa ngoại nhập khẩu cao cấp.
          </span>
        </div>
        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            <strong>Chụp ảnh trước khi giao:</strong> Florist hoàn thiện sản phẩm và gửi ảnh thực tế qua Zalo cho quý khách duyệt trước khi tiệm giao hoa đi.
          </span>
        </div>
        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            <strong>Bảo hành đổi mới 100%:</strong> Nếu hoa dập nát do vận chuyển hoặc không đúng mẫu yêu cầu, đổi mới hoặc hoàn tiền ngay trong 2H.
          </span>
        </div>
      </div>
      <button onClick={onClose} className="btn-primary w-full text-xs py-2.5 rounded-xl shadow-md cursor-pointer">
        Đã hiểu &amp; Tiếp tục mua sắm
      </button>
    </div>
  );
};

// 2. Locations Modal Content
export const LocationsModalContent: React.FC<StoryModalProps> = ({ onClose }) => {
  const { settings } = useStore();

  return (
    <div className="space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center mx-auto shadow-md shadow-sky-600/10 border border-sky-200/50 shrink-0">
        <MapPin className="w-6 h-6" />
      </div>
      <div className="text-center">
        <h3 className="font-bold text-base text-slate-900 tracking-tight">Boutique Showroom &amp; Hotline</h3>
        <p className="text-xs text-slate-500 mt-1">V&amp;V Florielle hân hạnh được phục vụ quý khách tại Hà Nội</p>
      </div>
      <div className="space-y-3 text-xs text-slate-700 bg-slate-50/90 p-4 rounded-2xl border border-slate-200/60">
        <div className="space-y-1 pb-2 border-b border-slate-200">
          <div className="font-bold text-slate-900 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Showroom Cầu Giấy (Trụ sở chính)
          </div>
          <p className="text-slate-600 text-xs font-medium">{settings.address}</p>
          <p className="text-slate-500 text-[11px]">Giờ phục vụ: {settings.openingHours}</p>
          <p className="text-slate-500 text-[11px]">
            Giao hỏa tốc chỉ từ 15 phút nội thành &amp; 60 phút ngoại thành Hà Nội
          </p>
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
        className="btn-primary w-full text-xs py-2.5 flex items-center justify-center gap-2 rounded-xl shadow-md cursor-pointer"
      >
        <PhoneCall className="w-4 h-4" />
        <span>Gọi tư vấn ngay: {settings.hotline}</span>
      </a>
    </div>
  );
};

// 3. Services Modal Content
export const ServicesModalContent: React.FC<StoryModalProps> = ({ onClose }) => {
  const { settings, setCurrentView } = useStore();

  return (
    <div className="space-y-5">
      <div className="text-center space-y-1">
        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-100 px-3 py-0.5 rounded-full">
          V&amp;V Florielle Hà Nội
        </span>
        <h3 className="font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
          Dịch Vụ Hoa Tươi Nghệ Thuật Chuyên Nghiệp
        </h3>
        <p className="text-xs text-slate-500 max-w-lg mx-auto">
          {settings.address} • Đáp ứng trọn vẹn mọi nhu cầu quà tặng và sự kiện
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Card 1 */}
        <div className="p-4 rounded-2xl bg-white/95 border border-emerald-200/80 shadow-xs flex flex-col justify-between space-y-3 hover:shadow-md transition-shadow">
          <div className="space-y-1.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Flower2 className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Hoa Tươi Thiết Kế Mẫu Sẵn</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Hàng trăm mẫu bó hoa Hàn Quốc, giỏ hoa khai trương, lan hồ điệp cắm mới mỗi ngày từ hoa tuyển chọn loại 1.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              onClose();
              setCurrentView('catalog');
            }}
            className="w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors text-center cursor-pointer"
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
              setTimeout(() => {
                window.dispatchEvent(new CustomEvent('open-custom-design-modal'));
              }, 50);
            }}
            className="w-full py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold transition-colors text-center cursor-pointer"
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
            <h4 className="font-bold text-sm text-slate-900">Giao Hoa Hỏa Tốc Từ 15 Phút</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Giao nhanh nội thành Hà Nội. Bảng giá cước minh bạch theo km, luôn chụp ảnh &amp; video qua Zalo trước khi giao.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              onClose();
              setTimeout(() => {
                window.dispatchEvent(new CustomEvent('open-shipping-modal'));
              }, 50);
            }}
            className="w-full py-2 px-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold transition-colors text-center cursor-pointer"
          >
            Bảng Giá Cước Ship →
          </button>
        </div>

        {/* Card 4 */}
        <div className="p-4 rounded-2xl bg-white/95 border border-amber-200/80 shadow-xs flex flex-col justify-between space-y-3 hover:shadow-md transition-shadow">
          <div className="space-y-1.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Hoa Cưới &amp; Sự Kiện Doanh Nghiệp</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Trang trí xe hoa rước dâu, hoa cầm tay cô dâu, kệ hoa khai trương 2-3 tầng, hoa bục phát biểu có đầy đủ VAT.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              onClose();
              setTimeout(() => {
                window.dispatchEvent(new CustomEvent('open-wedding-event-modal'));
              }, 50);
            }}
            className="w-full py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition-colors text-center cursor-pointer"
          >
            Gói Hoa Cưới &amp; Sự Kiện →
          </button>
        </div>
      </div>
    </div>
  );
};

// 4. About Us Modal Content
export const AboutUsModalContent: React.FC<StoryModalProps> = ({ onClose }) => {
  const { settings, setCurrentView } = useStore();

  return (
    <div className="space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md border border-emerald-200 shrink-0">
        <Flower2 className="w-6 h-6" />
      </div>
      <div className="text-center">
        <h3 className="font-bold text-base text-slate-900 tracking-tight">Về V&amp;V Florielle</h3>
        <p className="text-xs text-slate-500 mt-1">{settings.address}</p>
      </div>
      <p className="text-xs text-slate-600 leading-relaxed text-center">
        V&amp;V Florielle tự hào là thương hiệu hoa tươi nghệ thuật cao cấp tại Hà Nội, chuyên cung cấp các mẫu hoa bó, hoa giỏ, hoa chúc mừng và thiết kế theo yêu cầu riêng với cam kết 100% hoa tươi loại một nhập mới mỗi ngày.
      </p>
      <button
        type="button"
        onClick={() => {
          onClose();
          setCurrentView('about');
        }}
        className="btn-primary w-full text-xs py-2.5 rounded-xl shadow-md cursor-pointer"
      >
        Xem Trang Giới Thiệu Đầy Đủ →
      </button>
    </div>
  );
};
