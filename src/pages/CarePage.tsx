import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { PeachBlossomTag } from '../components/PeachBlossomTag';
import {
  Sparkles,
  Heart,
  Droplet,
  Scissors,
  Sun,
  ShieldCheck,
  Home,
  Flower2,
  Wind,
  Brush,
  ThermometerSnowflake,
  Layers,
  Sparkle
} from 'lucide-react';

type FlowerTypeFilter = 'all' | 'fresh' | 'soap' | 'silk';

interface CareTipItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  tag?: string;
}

export const CarePage: React.FC = () => {
  const { setCurrentView } = useStore();
  const [selectedType, setSelectedType] = useState<FlowerTypeFilter>('all');

  // 1. CẨM NANG HOA TƯƠI CẮT CÀNH & LẴNG HOA
  const FRESH_FLOWER_TIPS: CareTipItem[] = [
    {
      icon: Scissors,
      tag: 'Kích Thủy',
      title: '1. Cắt vát gốc 45° dưới vòi nước',
      desc: 'Dùng kéo hoặc dao thật sắc cắt vát chéo cuống hoa 45 độ. Thao tác dưới vòi nước chảy giúp tăng tối đa bề mặt tiếp xúc nước và chống bọt khí lọt vào mao mạch làm tắc nghẽn đường dẫn nước.'
    },
    {
      icon: Droplet,
      tag: 'Nước Sạch',
      title: '2. Thay nước sạch mỗi sáng & Tỉa sạch lá chân',
      desc: 'Thay nước bình hoa mỗi ngày một lần vào buổi sáng. Ngắt sạch toàn bộ lá hoa nằm dưới ngấn nước cắm để ngăn vi khuẩn lên men làm đục nước, bốc mùi và gây thối gốc hoa.'
    },
    {
      icon: ThermometerSnowflake,
      tag: 'Dưỡng Xốp',
      title: '3. Dưỡng Giỏ hoa & Lẵng hoa cắm xốp OASIS',
      desc: 'Với giỏ hoa hoặc kệ hoa cắm trên xốp ngậm nước OASIS, nhẹ nhàng rót khoảng 100 - 150ml nước sạch vào phần tâm mút xốp mỗi ngày một lần để giữ hoa tươi lâu 5 - 7 ngày.'
    },
    {
      icon: Sun,
      tag: 'Vị Trí',
      title: '4. Đặt nơi râm mát (22 - 26°C), tránh gió quạt',
      desc: 'Trưng bày bình hoa ở nơi thoáng mát. Tránh luồng gió quạt mạnh hoặc gió điều hòa thổi thẳng vào cánh hoa, và đặt cách xa ánh nắng gắt hoặc đĩa quả chín (khí ethylene làm hoa nhanh rụng).'
    }
  ];

  // 2. CẨM NANG HOA SÁP THƠM NGHỆ THUẬT
  const SOAP_FLOWER_TIPS: CareTipItem[] = [
    {
      icon: ShieldCheck,
      tag: 'Tuyệt Đối',
      title: '1. Tuyệt đối tránh nước & nơi có độ ẩm cao',
      desc: 'Cánh hoa sáp được chế tác từ sáp thơm tự nhiên tinh xảo. Nếu tiếp xúc với nước, sương mù hoặc đặt trong phòng ẩm mốc, cánh hoa sẽ bị mềm nhão, tan chảy và mất phom dáng ban đầu.'
    },
    {
      icon: Sparkles,
      tag: 'Lưu Hương',
      title: '2. Bí quyết giữ hương thơm nồng nàn suốt 3 - 5 năm',
      desc: 'Trưng bày hoa sáp trong hộp kính, tủ trưng bày hoặc phòng khách khô ráo ở nhiệt độ phòng. Hạn chế để hoa nơi có ánh nắng chiếu trực tiếp để cánh hoa không bị phai màu và bay mất tinh dầu thơm.'
    },
    {
      icon: Wind,
      tag: 'Vệ Sinh',
      title: '3. Vệ sinh bụi bằng chổi cọ mềm hoặc máy sấy mát',
      desc: 'Khi hoa sáp bám bụi sau một thời gian trưng bày, chỉ cần dùng cọ trang điểm lông mềm quét nhẹ hoặc bật máy sấy tóc ở CHẾ ĐỘ GIÓ MÁT (tuyệt đối không bật chế độ nóng) thổi nhẹ là hoa lại sạch bóng.'
    },
    {
      icon: Sparkle,
      tag: 'Bảo Quản',
      title: '4. Tránh va đập mạnh làm vỡ vụn cánh sáp',
      desc: 'Hoa sáp có độ giòn tự nhiên ở nhiệt độ thấp. Khi vận chuyển hoặc di chuyển vị trí trang trí, cần nhẹ tay để cánh hoa giữ nguyên các lớp cánh uốn lượn mềm mại hoàn hảo.'
    }
  ];

  // 3. CẨM NANG HOA LỤA NGHỆ THUẬT CAO CẤP
  const SILK_FLOWER_TIPS: CareTipItem[] = [
    {
      icon: Layers,
      tag: 'Chất Liệu',
      title: '1. Vải lụa ép nhiệt cao cấp - Bền đẹp vĩnh cửu',
      desc: 'Hoa lụa tại tiệm sử dụng chất liệu lụa phủ nano cao cấp, không bám bẩn sâu và giữ màu sắc rực rỡ như hoa thật qua nhiều năm tháng, là lựa chọn hoàn hảo cho không gian sang trọng.'
    },
    {
      icon: Brush,
      tag: 'Làm Sạch',
      title: '2. Vệ sinh định kỳ bằng khăn vi sợi hoặc cọ mềm',
      desc: 'Sau 1 - 2 tháng trưng bày, dùng chổi lông vũ hoặc khăn ẩm vi sợi lau nhẹ từng cánh hoa. Có thể dùng bình xịt khí nén chuyên dụng để thổi sạch các khe hoa uốn lượn sâu bên trong.'
    },
    {
      icon: Scissors,
      tag: 'Tạo Dáng',
      title: '3. Cách uốn nắn & định hình lại cành hoa linh hoạt',
      desc: 'Cành hoa lụa có lõi thép mềm bọc nhựa silicon cao cấp. Bạn có thể thoải mái uốn cong, xòe rộng cành hoặc gập ngắn cuống hoa để tạo dáng bình hoa mới mẻ theo từng góc nhà.'
    },
    {
      icon: Sun,
      tag: 'Màu Sắc',
      title: '4. Giữ màu sắc tươi mới không phai theo năm tháng',
      desc: 'Để màu hoa lụa luôn giữ được sắc thái rạng rỡ nhất, nên trưng bày hoa ở khu vực trong nhà, tránh ánh nắng mặt trời gắt chiếu trực diện kéo dài nhiều giờ trong ngày.'
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
      meaning: 'Lời tri nhân chân thành, sự viên mãn và lòng biết ơn sâu sắc đối với người nhận.'
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
              className="hover:underline flex items-center gap-1 text-slate-500 hover:text-emerald-700 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Trang chủ</span>
            </button>
            <span className="text-slate-300">/</span>
            <span className="text-emerald-900 font-bold">Cẩm Nang Dưỡng Hoa</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-emerald-950 tracking-tight text-center">
            Cẩm Nang Chăm Sóc Hoa Theo Từng Chủng Loại
          </h1>
          <p className="text-xs sm:text-base text-slate-600 leading-relaxed max-w-2xl text-center mx-auto">
            Tổng hợp kinh nghiệm thực tế từ Florist V&amp;V Florielle: Phân tách rõ ràng hướng dẫn dưỡng hoa tươi cắt cành, bảo quản hoa sáp thơm giữ hương 3-5 năm và vệ sinh hoa lụa cao cấp bền đẹp vĩnh cửu.
          </p>

          {/* Quick Category Filter Pills */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 select-none">
            <button
              type="button"
              onClick={() => setSelectedType('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedType === 'all'
                  ? 'bg-emerald-800 text-white shadow-md shadow-emerald-800/25 scale-105'
                  : 'bg-white/80 text-slate-600 hover:bg-white border border-slate-200/80 hover:text-emerald-800'
              }`}
            >
              🌸 Tất Cả ({FRESH_FLOWER_TIPS.length + SOAP_FLOWER_TIPS.length + SILK_FLOWER_TIPS.length} Bí Quyết)
            </button>
            <button
              type="button"
              onClick={() => setSelectedType('fresh')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedType === 'fresh'
                  ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/25 scale-105'
                  : 'bg-white/80 text-slate-600 hover:bg-white border border-slate-200/80 hover:text-emerald-700'
              }`}
            >
              🌿 Hoa Tươi Cắt Cành
            </button>
            <button
              type="button"
              onClick={() => setSelectedType('soap')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedType === 'soap'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25 scale-105'
                  : 'bg-white/80 text-slate-600 hover:bg-white border border-slate-200/80 hover:text-rose-600'
              }`}
            >
              🧼 Hoa Sáp Thơm
            </button>
            <button
              type="button"
              onClick={() => setSelectedType('silk')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedType === 'silk'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/25 scale-105'
                  : 'bg-white/80 text-slate-600 hover:bg-white border border-slate-200/80 hover:text-amber-700'
              }`}
            >
              🎀 Hoa Lụa Cao Cấp
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          PHẦN 1: CẨM NANG HOA TƯƠI CẮT CÀNH & LẴNG HOA
          ======================================================== */}
      {(selectedType === 'all' || selectedType === 'fresh') && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2 border-b border-emerald-100">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-800 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                Chuyên Mục 1
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                Bí Quyết Dưỡng Hoa Tươi Suốt 5 - 7 Ngày
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Dành cho bó hoa tươi, giỏ hoa &amp; lẵng hoa cắm xốp
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FRESH_FLOWER_TIPS.map((tip, idx) => {
              const Icon = tip.icon;
              return (
                <div
                  key={idx}
                  className="glass-panel p-5 sm:p-6 rounded-3xl border border-emerald-200/80 shadow-xs hover:shadow-md transition-all space-y-2.5 bg-gradient-to-br from-white/95 to-emerald-50/40"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    {tip.tag && (
                      <PeachBlossomTag tag={tip.tag} size="sm" />
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">{tip.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{tip.desc}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ========================================================
          PHẦN 2: CẨM NANG HOA SÁP THƠM NGHỆ THUẬT
          ======================================================== */}
      {(selectedType === 'all' || selectedType === 'soap') && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2 border-b border-rose-100">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-rose-700 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Chuyên Mục 2
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                Bảo Quản Hoa Sáp Thơm Giữ Hương 3 - 5 Năm
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Dành cho hoa sáp thơm nghệ thuật, hộp hoa sáp quà tặng
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SOAP_FLOWER_TIPS.map((tip, idx) => {
              const Icon = tip.icon;
              return (
                <div
                  key={idx}
                  className="glass-panel p-5 sm:p-6 rounded-3xl border border-rose-200/80 shadow-xs hover:shadow-md transition-all space-y-2.5 bg-gradient-to-br from-white/95 to-rose-50/40"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    {tip.tag && (
                      <PeachBlossomTag tag={tip.tag} size="sm" />
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">{tip.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{tip.desc}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ========================================================
          PHẦN 3: CẨM NANG HOA LỤA NGHỆ THUẬT CAO CẤP
          ======================================================== */}
      {(selectedType === 'all' || selectedType === 'silk') && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2 border-b border-amber-100">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-800 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-amber-600" />
                Chuyên Mục 3
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                Bảo Quản Hoa Lụa Cao Cấp Bền Đẹp Vĩnh Cửu
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Dành cho bình hoa lụa để bàn, hoa lụa phòng khách &amp; sự kiện
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SILK_FLOWER_TIPS.map((tip, idx) => {
              const Icon = tip.icon;
              return (
                <div
                  key={idx}
                  className="glass-panel p-5 sm:p-6 rounded-3xl border border-amber-200/80 shadow-xs hover:shadow-md transition-all space-y-2.5 bg-gradient-to-br from-white/95 to-amber-50/40"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    {tip.tag && (
                      <PeachBlossomTag tag={tip.tag} size="sm" />
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">{tip.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{tip.desc}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ========================================================
          PHẦN 4: Ý NGHĨA CÁC LOÀI HOA THÔNG DỤNG
          ======================================================== */}
      <div className="glass-panel p-6 sm:p-8 rounded-[32px] border border-emerald-200/70 shadow-sm space-y-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-600" />
            <span>Ý Nghĩa Ngôn Ngữ Của Các Loài Hoa</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Hiểu được thông điệp ẩn giấu sau từng loài hoa sẽ giúp món quà trao tặng thêm phần tinh tế, sâu lắng và trọn vẹn cảm xúc.
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

      {/* 5. FOOTER CTA */}
      <div className="rounded-3xl p-6 sm:p-8 bg-emerald-800 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <h3 className="text-lg font-bold">Cần Tư Vấn Chọn Hoa Theo Dịp Đặc Biệt?</h3>
          <p className="text-xs text-emerald-100">Florist tại V&amp;V Florielle luôn sẵn sàng tư vấn mẫu hoa và viết thiệp chúc mừng riêng cho bạn.</p>
        </div>
        <button
          onClick={() => setCurrentView('catalog')}
          className="px-6 py-3 rounded-2xl bg-white text-emerald-900 font-extrabold text-xs shadow-md hover:bg-emerald-50 transition-all shrink-0 cursor-pointer"
        >
          Khám Phá Các Mẫu Hoa →
        </button>
      </div>
    </div>
  );
};
