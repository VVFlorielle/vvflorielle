import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  BookOpen,
  Sparkles,
  Heart,
  Droplet,
  Scissors,
  Sun,
  ShieldCheck,
  CheckCircle2,
  Home,
  Flower2
} from 'lucide-react';

export const CarePage: React.FC = () => {
  const { setCurrentView } = useStore();

  const TIPS = [
    {
      icon: Scissors,
      title: '1. Cắt vát gốc 45 độ trước khi cắm',
      desc: 'Dùng kéo hoặc dao sắc cắt vát chéo cành hoa một góc 45 độ dưới vòi nước chảy. Việc này giúp diện tích tiếp xúc với nước tăng tối đa, các mạch dẫn mao quản hút nước nhanh chóng và không bị bọt khí làm tắc nghẽn.'
    },
    {
      icon: Droplet,
      title: '2. Thay nước sạch mỗi ngày & Tỉa bớt lá',
      desc: 'Thay nước bình hoa mỗi ngày một lần vào buổi sáng. Nhớ ngắt bỏ toàn bộ những lá hoa nằm dưới ngấn nước cắm để ngăn vi khuẩn lên men làm đục nước và gây thối cuống hoa.'
    },
    {
      icon: Sun,
      title: '3. Đặt hoa nơi thoáng mát, tránh quạt trực tiếp',
      desc: 'Trưng bày bình hoa ở nơi râm mát, nhiệt độ phòng 22 - 26°C. Tránh luồng gió quạt hoặc điều hòa thổi thẳng vào cánh hoa, và tránh xa ánh nắng mặt trời gắt hoặc gần đĩa trái cây chín (khí ethylene làm hoa nhanh tàn).'
    },
    {
      icon: Sparkles,
      title: '4. Dưỡng ẩm cho Giỏ hoa & Lẵng hoa xốp OASIS',
      desc: 'Với giỏ hoa hoặc lẵng hoa cắm xốp OASIS, nhẹ nhàng rót khoảng 100 - 150ml nước sạch vào phần tâm mút xốp mỗi ngày một lần. Xốp giữ nước tốt sẽ giúp hoa tươi lâu từ 5 đến 7 ngày.'
    }
  ];

  const MEANINGS = [
    {
      flower: 'Hoa Hồng Đỏ',
      meaning: 'Biểu tượng kinh điển của tình yêu nồng cháy, say đắm và lòng thủy chung son sắt.'
    },
    {
      flower: 'Hoa Hồng Pastel / Kem Dâu',
      meaning: 'Sự ngọt ngào, dịu dàng, lời tỏ tình e ấp và tình cảm chân thành trong sáng.'
    },
    {
      flower: 'Hoa Lan Hồ Điệp',
      meaning: 'Sự vương giả, tài lộc, quý phái và thịnh vượng bền lâu, món quà tuyệt vời cho dịp khai trương.'
    },
    {
      flower: 'Hoa Hướng Dương',
      meaning: 'Niềm tin, sự lạc quan, hy vọng vươn lên và lời chúc thành công rực rỡ trong tương lai.'
    },
    {
      flower: 'Hoa Baby Trắng',
      meaning: 'Tình yêu ngây thơ, sự tinh khôi và gắn kết vĩnh cửu như hàng ngàn ngôi sao nhỏ.'
    },
    {
      flower: 'Hoa Cẩm Tú Cầu',
      meaning: 'Lời tri ân chân thành, sự viên mãn và lòng biết ơn sâu sắc đối với người nhận.'
    }
  ];

  return (
    <div className="container py-6 space-y-8 animate-in fade-in duration-300">
      {/* 1. HERO BANNER */}
      <div className="rounded-[36px] p-6 sm:p-10 bg-gradient-to-br from-emerald-50/95 via-white/95 to-amber-50/70 border border-emerald-200/80 shadow-xl relative overflow-hidden text-center flex flex-col items-center justify-center">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

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
            <span className="text-emerald-900 font-bold">Cẩm Nang Dưỡng Hoa</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-emerald-950 tracking-tight text-center">
            Bí Quyết Dưỡng Hoa Tươi Lâu & Ý Nghĩa Hoa
          </h1>
          <p className="text-xs sm:text-base text-slate-600 leading-relaxed max-w-2xl text-center mx-auto">
            Tổng hợp những kinh nghiệm thực tế từ các Florist lành nghề tại V&V Florielle 105 Doãn Kế Thiện, giúp hoa của bạn luôn rạng rỡ và tỏa hương thơm mát suốt cả tuần.
          </p>
        </div>
      </div>

      {/* 2. 4 NGUYÊN TẮC DƯỠNG HOA */}
      <div className="space-y-4">
        <div className="text-center max-w-lg mx-auto">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Kinh Nghiệm Florist</span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">4 Nguyên Tắc Vàng Giữ Hoa Tươi Suốt 7 Ngày</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TIPS.map((tip, idx) => {
            const Icon = tip.icon;
            return (
              <div key={idx} className="glass-panel p-6 rounded-3xl border border-emerald-200/70 shadow-sm space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">{tip.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{tip.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Ý NGHĨA CÁC LOÀI HOA THÔNG DỤNG */}
      <div className="glass-panel p-6 sm:p-8 rounded-[32px] border border-emerald-200/70 shadow-sm space-y-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-600" />
            <span>Ý Nghĩa Ngôn Ngữ Của Các Loài Hoa</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Hiểu được ý nghĩa loài hoa sẽ giúp món quà trao tặng thêm phần tinh tế và trọn vẹn yêu thương.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {MEANINGS.map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white/90 border border-slate-200/80 shadow-xs space-y-1">
              <h4 className="font-bold text-xs text-emerald-900 flex items-center gap-1.5">
                <Flower2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{item.flower}</span>
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">{item.meaning}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. FOOTER CTA */}
      <div className="rounded-3xl p-6 sm:p-8 bg-emerald-800 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <h3 className="text-lg font-bold">Cần Tư Vấn Chọn Hoa Theo Dịp Đặc Biệt?</h3>
          <p className="text-xs text-emerald-100">Florist tại V&V Florielle luôn sẵn sàng tư vấn mẫu hoa và viết thiệp chúc mừng riêng cho bạn.</p>
        </div>
        <button
          onClick={() => setCurrentView('catalog')}
          className="px-6 py-3 rounded-2xl bg-white text-emerald-900 font-extrabold text-xs shadow-md hover:bg-emerald-50 transition-all shrink-0"
        >
          Khám Phá Các Mẫu Hoa →
        </button>
      </div>
    </div>
  );
};
