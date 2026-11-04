import React from 'react';
import { Sparkles, Heart, PhoneCall, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface WeddingEventModalProps {
  onClose: () => void;
}

export const WeddingEventModal: React.FC<WeddingEventModalProps> = ({ onClose }) => {
  const { settings } = useStore();

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="text-center space-y-1">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-1.5 shadow-sm border border-amber-200 shrink-0">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10.5px] font-bold">
          <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
          <span>Gói Dịch Vụ Hoa Cưới &amp; Sự Kiện Chuyên Nghiệp</span>
        </div>
        <h3 className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
          Hoa Cưới Nghệ Thuật &amp; Trang Trí Sự Kiện Doanh Nghiệp
        </h3>
        <p className="text-xs text-slate-500 max-w-lg mx-auto">
          Thiết kế theo tone màu nhận diện, hoa nhập khẩu cao cấp, có đầy đủ hợp đồng &amp; hóa đơn VAT
        </p>
      </div>

      {/* 2 Main Sections: Wedding vs Corporate */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Section 1: Hoa Cưới Hạnh Phúc */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-rose-50/70 to-pink-50/40 border border-rose-200/80 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-rose-200/60">
            <Heart className="w-4 h-4 text-rose-600 fill-rose-500" />
            <h4 className="font-extrabold text-xs sm:text-sm text-rose-950 uppercase tracking-wide">
              1. Gói Hoa Cưới Hạnh Phúc
            </h4>
          </div>

          <div className="space-y-2.5 text-xs text-slate-700">
            <div className="p-2.5 rounded-xl bg-white/90 border border-rose-100 space-y-1 shadow-2xs">
              <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
                <span>💐 Hoa Cầm Tay Cô Dâu + Cài Áo Chú Rể</span>
                <span className="text-[11px] text-rose-700 font-extrabold">Từ 850k</span>
              </div>
              <p className="text-[10.5px] text-slate-500 leading-relaxed">
                Phối hoa Tulip Hà Lan, Hồng Ohara, Calla Lily, Cúc Mẫu Đơn theo dáng tròn hoặc dáng rủ hiện đại. Tặng kèm 02 hoa cài áo chú rể tone-sur-tone.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-white/90 border border-rose-100 space-y-1 shadow-2xs">
              <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
                <span>🚗 Trang Trí Xe Hoa Rước Dâu</span>
                <span className="text-[11px] text-rose-700 font-extrabold">Từ 1.800k</span>
              </div>
              <p className="text-[10.5px] text-slate-500 leading-relaxed">
                Trang trí cụm hoa mui xe, nóc xe, gương và đuôi xe bằng hoa tươi 100%. Sử dụng đế hút chân không nam châm chuyên dụng bảo vệ tuyệt đối sơn xe.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-white/90 border border-rose-100 space-y-1 shadow-2xs">
              <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
                <span>💒 Cổng Hoa &amp; Backdrop Lễ Đường</span>
                <span className="text-[11px] text-rose-700 font-extrabold">Tư vấn theo quy mô</span>
              </div>
              <p className="text-[10.5px] text-slate-500 leading-relaxed">
                Cổng hoa tươi sang trọng, lối đi sân khấu, trang trí bàn gallery ảnh cưới theo phong cách Minimalism, Vintage hoặc Luxury Bohemian.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Sự Kiện & Hội Nghị Doanh Nghiệp */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-sky-50/70 to-blue-50/40 border border-sky-200/80 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-sky-200/60">
            <Sparkles className="w-4 h-4 text-sky-600" />
            <h4 className="font-extrabold text-xs sm:text-sm text-sky-950 uppercase tracking-wide">
              2. Sự Kiện Doanh Nghiệp &amp; Hội Nghị
            </h4>
          </div>

          <div className="space-y-2.5 text-xs text-slate-700">
            <div className="p-2.5 rounded-xl bg-white/90 border border-sky-100 space-y-1 shadow-2xs">
              <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
                <span>🏢 Kệ Hoa Khai Trương 2 - 3 Tầng</span>
                <span className="text-[11px] text-sky-700 font-extrabold">Từ 950k - 3.500k</span>
              </div>
              <p className="text-[10.5px] text-slate-500 leading-relaxed">
                Thiết kế hoành tráng, phối hoa hồng ngoại, lan hồ điệp, thiên điểu, hồng môn mang ý nghĩa tài lộc, phát tài phát lộc cho đối tác.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-white/90 border border-sky-100 space-y-1 shadow-2xs">
              <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
                <span>🎤 Hoa Bục Phát Biểu &amp; Bàn Đại Biểu VIP</span>
                <span className="text-[11px] text-sky-700 font-extrabold">Từ 450k</span>
              </div>
              <p className="text-[10.5px] text-slate-500 leading-relaxed">
                Cắm dáng dài hoặc dáng thuyền thanh lịch, phối theo màu sắc logo thương hiệu của công ty, trang trọng và không che khuất tầm nhìn.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-white/90 border border-sky-100 space-y-1 shadow-2xs">
              <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
                <span>📑 Đầy Đủ Hóa Đơn VAT &amp; Hợp Đồng</span>
                <span className="text-[11px] text-emerald-700 font-extrabold">Xuất trong ngày</span>
              </div>
              <p className="text-[10.5px] text-slate-500 leading-relaxed">
                Cung cấp báo giá cạnh tranh, xuất hóa đơn điện tử hợp lệ đầy đủ cho doanh nghiệp, hỗ trợ thanh toán công nợ chuyển khoản công ty.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
        <a
          href={`tel:${settings.hotline}`}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
        >
          <PhoneCall className="w-4 h-4" />
          <span>Tư Vấn Hoa Cưới &amp; Sự Kiện: {settings.hotline}</span>
        </a>
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer"
        >
          Đóng Cửa Sổ
        </button>
      </div>
    </div>
  );
};
