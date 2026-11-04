import React from 'react';
import { Truck, ShieldCheck, CheckCircle2, PhoneCall } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface ShippingPolicyModalProps {
  onClose: () => void;
}

export const ShippingPolicyModal: React.FC<ShippingPolicyModalProps> = ({ onClose }) => {
  const { settings } = useStore();

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="text-center space-y-1">
        <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center mx-auto mb-1.5 shadow-sm border border-sky-200 shrink-0">
          <Truck className="w-6 h-6" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-sky-100 text-sky-900 text-[10.5px] font-bold">
          <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
          <span>Dịch Vụ Giao Hoa Cấp Tốc Hà Nội</span>
          <span className="text-slate-400">•</span>
          <span>Từ 15P nội thành &amp; 60P ngoại thành</span>
        </div>
        <h3 className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
          Chính Sách &amp; Bảng Giá Cước Giao Hoa Hỏa Tốc
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Xuất phát từ Showroom <strong className="text-slate-700">{settings.address}</strong>
        </p>
      </div>

      {/* Bảng Giá Cước Theo Bán Kính (4 Tiers) */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>Bảng Cước Phí Vận Chuyển Theo Bán Kính</span>
          <span className="text-[10px] text-emerald-700 font-semibold lowercase">*tính theo Google Maps</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Tier 1: Dưới 3km */}
          <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-50/90 to-teal-50/70 border border-emerald-200/90 shadow-xs flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-emerald-950">Bán Kính &lt; 3km</span>
                <span className="text-[9px] bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded-full">
                  FREESHIP
                </span>
              </div>
              <p className="text-[10.5px] text-slate-600">
                Mai Dịch, Dịch Vọng, Nghĩa Tân, Mỹ Đình 2, Xuân Thủy
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="font-extrabold text-sm text-emerald-700">0₫ / 20.000₫</div>
              <div className="text-[9.5px] text-slate-400">(Miễn phí đơn từ 400k)</div>
            </div>
          </div>

          {/* Tier 2: 3 - 7km */}
          <div className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-slate-900">Bán Kính 3km - 7km</div>
              <p className="text-[10.5px] text-slate-500">
                Cầu Giấy, Ba Đình, Tây Hồ, Thanh Xuân, Nam Từ Liêm
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="font-extrabold text-sm text-slate-800">30.000₫ - 40.000₫</div>
              <div className="text-[9.5px] text-emerald-600 font-medium">Trợ giá 30k đơn 800k</div>
            </div>
          </div>

          {/* Tier 3: 7 - 12km */}
          <div className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-slate-900">Bán Kính 7km - 12km</div>
              <p className="text-[10.5px] text-slate-500">
                Đống Đa, Hoàn Kiếm, Hai Bà Trưng, Bắc Từ Liêm, Hà Đông
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="font-extrabold text-sm text-slate-800">45.000₫ - 60.000₫</div>
              <div className="text-[9.5px] text-slate-400">Giao xe máy thùng giữ dáng</div>
            </div>
          </div>

          {/* Tier 4: > 12km & Ngoại thành */}
          <div className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-slate-900">Trên 12km &amp; Ngoại Thành</div>
              <p className="text-[10.5px] text-slate-500">
                Long Biên, Hoàng Mai, Gia Lâm, Hoài Đức, Đông Anh...
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="font-extrabold text-sm text-slate-800">65.000₫ - 85.000₫</div>
              <div className="text-[9.5px] text-slate-400">Tối ưu chi phí thực tế</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Tiêu Chuẩn Giao Hàng Cấp Tốc Của V&V */}
      <div className="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200 space-y-2.5 text-xs text-slate-700">
        <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5 pb-1 border-b border-slate-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Quy Trình &amp; Cam Kết Vận Chuyển An Toàn</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] leading-relaxed">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong>Chụp ảnh duyệt trước:</strong> Florist hoàn thiện sản phẩm và gửi ảnh thực tế qua Zalo trước khi giao để quý khách duyệt.
            </div>
          </div>

          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong>Thùng cố định chuyên dụng:</strong> Xe máy chở hoa có giá đỡ chống nghiêng đổ, bọc màng bảo vệ cánh hoa khỏi gió bụi.
            </div>
          </div>

          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong>Tặng kèm túi dinh dưỡng:</strong> Mỗi sản phẩm đều được tặng kèm thiệp thiết kế riêng và gói dinh dưỡng hoa tươi lâu.
            </div>
          </div>

          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong>Bảo hành 1 đổi 1 tận nơi:</strong> Nếu hoa bị dập gãy trong quá trình vận chuyển, tiệm lập tức đổi bó hoa mới hoàn toàn miễn phí.
            </div>
          </div>
        </div>
      </div>

      <div className="pt-1 flex flex-col sm:flex-row gap-2 justify-center">
        <a
          href={`tel:${settings.hotline}`}
          className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
        >
          <PhoneCall className="w-4 h-4" />
          <span>Cần Giao Hỏa Tốc Ngay: {settings.hotline}</span>
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
