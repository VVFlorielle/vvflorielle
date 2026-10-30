import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  Flower2,
  Sparkles,
  Heart,
  ShieldCheck,
  Truck,
  Award,
  CheckCircle2,
  Clock,
  MapPin,
  PhoneCall,
  Camera,
  Home,
  ChevronRight
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { settings, setCurrentView } = useStore();

  return (
    <div className="container py-6 space-y-8 animate-in fade-in duration-300">
      {/* 1. HERO BANNER */}
      <div className="rounded-[36px] p-6 sm:p-12 bg-gradient-to-br from-emerald-50/95 via-white/95 to-rose-50/80 border border-emerald-200/80 shadow-xl relative overflow-hidden text-center flex flex-col items-center justify-center">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-64 h-64 bg-rose-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-3.5 text-center flex flex-col items-center">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-emerald-800">
            <button
              onClick={() => setCurrentView('store')}
              className="hover:underline flex items-center gap-1 text-slate-500 hover:text-emerald-700"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Trang chủ</span>
            </button>
            <span className="text-slate-300">/</span>
            <span className="text-emerald-900 font-bold">Về V&V Florielle</span>
          </div>

          <span className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black tracking-wider uppercase mx-auto">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Nghệ Thuật Trao Gửi Yêu Thương
          </span>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-emerald-950 tracking-tight leading-tight text-center">
            Tiệm Hoa Tươi Nghệ Thuật <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-teal-600">
              V&V Florielle
            </span>
          </h1>

          <p className="text-xs sm:text-base text-slate-600 leading-relaxed text-center max-w-2xl mx-auto">
            Tọa lạc tại <strong className="text-slate-900">Số 105 Doãn Kế Thiện, Cầu Giấy, Hà Nội</strong>, V&V Florielle là không gian sáng tạo hoa nghệ thuật cao cấp. Chúng mình tin rằng mỗi bông hoa đều mang một tần số cảm xúc riêng biệt, kết nối tâm giao và lưu giữ trọn vẹn những khoảnh khắc ngọt ngào nhất.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setCurrentView('catalog')}
              className="px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-lg shadow-emerald-700/25 transition-all"
            >
              Khám Phá Các Mẫu Hoa →
            </button>
            <button
              onClick={() => setCurrentView('contact')}
              className="px-6 py-3 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-800 font-extrabold text-xs border border-emerald-300 shadow-sm transition-all"
            >
              Liên Hệ & Ghé Tiệm
            </button>
          </div>
        </div>
      </div>

      {/* 2. CÂU CHUYỆN THƯƠNG HIỆU & SỨ MỆNH */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 sm:p-8 rounded-[32px] border border-emerald-200/70 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-md">
            <Flower2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Câu Chuyện Của V&V Florielle</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Khởi nguồn từ niềm đam mê vô tận với vẻ đẹp tự nhiên của cỏ cây và hoa lá, V&V Florielle được thành lập với mong muốn mang nghệ thuật hoa đương đại đến gần hơn với nhịp sống thủ đô. Không chỉ đơn thuần là cắm hoa, chúng mình thiết kế từng tác phẩm bằng sự thấu hiểu câu chuyện và tâm ý của người gửi.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Dù là một bó hoa mừng sinh nhật giản dị, lẵng hoa khai trương sang trọng hồng phát hay bó hoa cưới tinh khôi trong ngày trọng đại, V&V Florielle luôn đặt trọn tâm huyết vào từng đường nét phối màu, giấy bọc và dải ruy băng lụa cao cấp.
          </p>
        </div>

        <div className="glass-panel p-6 sm:p-8 rounded-[32px] border border-emerald-200/70 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shadow-md">
            <Heart className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Sứ Mệnh Nghệ Thuật & Giá Trị</h2>
          <div className="space-y-3 pt-1">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-xs text-slate-800">Hoa Tươi Tuyển Chọn Mỗi Ngày</h4>
                <p className="text-[11px] text-slate-500">100% hoa nhập trực tiếp từ vườn hoa Đà Lạt loại 1 và hoa nhập khẩu cao cấp từ Ecuador, Hà Lan.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-xs text-slate-800">Cá Nhân Hóa Trải Nghiệm</h4>
                <p className="text-[11px] text-slate-500">Mỗi thiết kế đều được tư vấn theo tính cách người nhận, phong thủy bản mệnh và ngân sách của bạn.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-xs text-slate-800">Tận Tâm Phục Vụ 24/7</h4>
                <p className="text-[11px] text-slate-500">Florist chụp ảnh thành phẩm gửi qua Zalo cho bạn duyệt ưng ý 100% trước khi shipper xuất phát.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 4 CAM KẾT VÀNG TẠI V&V FLORIELLE */}
      <div>
        <div className="text-center max-w-xl mx-auto mb-6 space-y-1">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Tiêu Chuẩn Chất Lượng</span>
          <h3 className="text-xl sm:text-3xl font-black text-slate-900">4 Cam Kết Vàng Với Khách Hàng</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-5 rounded-3xl border border-white/80 shadow-sm text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center shadow-xs">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Hoa Tươi Loại 1</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Tuyển chọn từng bông hoa nở đẹp, cánh dày, giữ độ tươi tự nhiên suốt 3 - 7 ngày.
            </p>
          </div>

          <div className="glass-card p-5 rounded-3xl border border-white/80 shadow-sm text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 mx-auto flex items-center justify-center shadow-xs">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Giao Nhanh 60 - 90 Phút</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Điện hoa hỏa tốc tại nội thành Hà Nội, bảo quản chuyên dụng không dập nát.
            </p>
          </div>

          <div className="glass-card p-5 rounded-3xl border border-white/80 shadow-sm text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 mx-auto flex items-center justify-center shadow-xs">
              <Camera className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Chụp Ảnh Duyệt Mẫu</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Chụp ảnh và quay video thành phẩm thực tế gửi qua Zalo trước khi giao đi.
            </p>
          </div>

          <div className="glass-card p-5 rounded-3xl border border-white/80 shadow-sm text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-800 mx-auto flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Bảo Hành Đổi Mới 100%</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Đổi mới hoặc hoàn tiền ngay trong 2 giờ nếu hoa không tươi hoặc không đúng mẫu.
            </p>
          </div>
        </div>
      </div>

      {/* 4. WORKSHOP & ĐỊA CHỈ TIỆM */}
      <div className="rounded-[32px] p-6 sm:p-8 bg-slate-900 text-white relative overflow-hidden shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-lg text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
            <MapPin className="w-3.5 h-3.5" />
            <span>Ghé Thăm Tiệm Hoa Nghệ Thuật</span>
          </div>
          <h3 className="text-xl sm:text-3xl font-black tracking-tight">Số 105 Doãn Kế Thiện, Cầu Giấy, Hà Nội</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Tiệm hoa mở cửa đón khách từ <strong>06:30 đến 21:30</strong> hàng ngày. Kính mời bạn ghé thăm để tận mắt ngắm nhìn những đoá hoa thơm ngát và nhâm nhi tách trà cùng florist của tiệm!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <a
            href={`tel:${settings.hotline}`}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Gọi Hotline: {settings.hotline}</span>
          </a>
          <button
            onClick={() => setCurrentView('contact')}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all"
          >
            Xem Bản Đồ Chỉ Đường →
          </button>
        </div>
      </div>
    </div>
  );
};
