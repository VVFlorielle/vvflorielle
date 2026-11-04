import React, { useState } from 'react';
import {
  BookOpen,
  Scissors,
  Droplets,
  Sun,
  Sparkles,
  ShieldCheck,
  Heart
} from 'lucide-react';

interface FlowerCareModalProps {
  onClose: () => void;
}

export const FlowerCareModal: React.FC<FlowerCareModalProps> = ({ onClose }) => {
  const [careTab, setCareTab] = useState<'tips' | 'meaning' | 'occasions'>('tips');

  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center mb-1 shadow-sm border border-amber-200 shrink-0">
          <BookOpen className="w-6 h-6" />
        </div>
        <h3 className="font-extrabold text-lg sm:text-xl text-slate-900">
          Thư Viện Cẩm Nang Chăm Sóc &amp; Ý Nghĩa Hoa
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Kiến thức hữu ích từ các nghệ nhân cắm hoa V&amp;V Florielle Hà Nội
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex p-1 bg-slate-100/90 rounded-2xl border border-white max-w-md mx-auto">
        <button
          type="button"
          onClick={() => setCareTab('tips')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            careTab === 'tips' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          🌿 Giữ Hoa Tươi 7 Ngày
        </button>
        <button
          type="button"
          onClick={() => setCareTab('meaning')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            careTab === 'meaning' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          ✨ Ý Nghĩa Loài Hoa
        </button>
        <button
          type="button"
          onClick={() => setCareTab('occasions')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            careTab === 'occasions' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          🎁 Chọn Theo Dịp
        </button>
      </div>

      {/* Tab 1: Tips Chăm Sóc Hoa */}
      {careTab === 'tips' && (
        <div className="space-y-2.5">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Scissors className="w-4 h-4" />
            </div>
            <div className="text-xs text-slate-700 space-y-0.5">
              <strong className="text-slate-900 block">1. Cắt vát gốc 45 độ trước khi cắm:</strong>
              <p className="text-slate-500 leading-relaxed">
                Dùng kéo thật sắc cắt chéo gốc hoa 45 độ dưới dòng nước để mở rộng tiết diện hút nước và ngăn bọt khí tràn vào cuống hoa.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
              <Droplets className="w-4 h-4" />
            </div>
            <div className="text-xs text-slate-700 space-y-0.5">
              <strong className="text-slate-900 block">2. Thay nước sạch mỗi sáng:</strong>
              <p className="text-slate-500 leading-relaxed">
                Rửa sạch bình trước khi thay nước mới. Thêm 1/2 gói dưỡng hoa V&amp;V tặng kèm hoặc 1 vài giọt nước cốt chanh để diệt khuẩn nước cắm.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Sun className="w-4 h-4" />
            </div>
            <div className="text-xs text-slate-700 space-y-0.5">
              <strong className="text-slate-900 block">3. Vị trí trưng hoa lý tưởng:</strong>
              <p className="text-slate-500 leading-relaxed">
                Đặt bình hoa nơi thoáng mát (nhiệt độ 20 - 24°C). Tránh gió quạt/máy lạnh thổi trực diện và tránh ánh nắng gay gắt qua cửa kính.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-xs text-slate-700 space-y-0.5">
              <strong className="text-slate-900 block">4. Chăm sóc lẵng xốp / giỏ hoa:</strong>
              <p className="text-slate-500 leading-relaxed">
                Châm thêm 100ml - 150ml nước mát vào tâm miếng xốp cắm mỗi ngày. Phun sương nhẹ lên cánh hoa vào sáng sớm để hoa tươi lâu 5 - 7 ngày.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Ý Nghĩa Loài Hoa */}
      {careTab === 'meaning' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200/80 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-xs text-rose-900">
              <Heart className="w-3.5 h-3.5 text-rose-600" />
              <span>Hoa Hồng Ohara / Juliet</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Biểu tượng tình yêu ngọt ngào, vẻ đẹp quý phái kiêu sa và sự trân trọng tuyệt đối dành cho người phụ nữ đặc biệt.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-xs text-amber-900">
              <Sun className="w-3.5 h-3.5 text-amber-600" />
              <span>Hoa Hướng Dương Đà Lạt</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Niềm tin mãnh liệt, năng lượng tích cực rực rỡ và lời chúc tương lai tươi sáng, thịnh vượng bền vững.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-sky-50/70 border border-sky-200/80 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-xs text-sky-900">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>Hoa Cẩm Tú Cầu</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Lời cảm ơn chân thành, sự thấu hiểu sâu sắc và tấm lòng bao dung gắn kết.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-teal-50/70 border border-teal-200/80 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-xs text-teal-900">
              <Droplets className="w-3.5 h-3.5 text-teal-600" />
              <span>Hoa Baby Trắng</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Tình yêu thuần khiết ngây thơ, sự tinh khôi và vẻ đẹp mong manh rung động lòng người.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1 sm:col-span-2">
            <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-900">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Lan Hồ Điệp Hoàng Gia</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Đại diện cho tài lộc, vượng khí dồi dào, sự trường thọ và đẳng cấp vương giả.
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Chọn Hoa Theo Dịp */}
      {careTab === 'occasions' && (
        <div className="space-y-2.5 text-xs text-slate-700">
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
            <strong className="text-slate-900 font-bold flex items-center gap-1.5">
              🎂 Sinh Nhật Bạn Bè / Người Thân:
            </strong>
            <p className="text-slate-500">
              Ưu tiên tone màu pastel tươi tắn (hồng cam, vàng kem, tím nhạt) với hoa hồng, tulip, cẩm tú cầu mang lại niềm vui rộn rã.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
            <strong className="text-slate-900 font-bold flex items-center gap-1.5">
              🏢 Khai Trương Doanh Nghiệp / Cửa Hàng:
            </strong>
            <p className="text-slate-500">
              Chọn lẵng hoa hoặc kệ hoa màu sắc rực rỡ (đỏ may mắn, vàng kim tài lộc, cam phát đạt) như hướng dương, hồng đỏ, lan hồ điệp.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
            <strong className="text-slate-900 font-bold flex items-center gap-1.5">
              💍 Cầu Hôn / Kỷ Niệm Tình Yêu:
            </strong>
            <p className="text-slate-500">
              Bó hoa hồng đỏ nhung kích thước lớn (9 bông, 19 bông hoặc 99 bông) kết hợp hoa baby tạo không gian lãng mạn rung động trái tim.
            </p>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onClose}
        className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
      >
        Đã Hiểu &amp; Đóng Cửa Sổ
      </button>
    </div>
  );
};
