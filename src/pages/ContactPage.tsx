import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  MapPin,
  PhoneCall,
  Mail,
  Clock,
  Send,
  MessageCircle,
  ExternalLink,
  CheckCircle2,
  Home,
  Navigation,
  Sparkles
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings, showToast, setCurrentView } = useStore();

  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [senderOccasion, setSenderOccasion] = useState('Sinh nhật');
  const [senderBudget, setSenderBudget] = useState('500.000đ - 1.000.000đ');
  const [senderMessage, setSenderMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !senderPhone.trim()) {
      showToast('Vui lòng nhập Họ tên và Số điện thoại để tiệm liên hệ!', 'error');
      return;
    }
    setIsSubmitted(true);
    showToast('Cảm ơn bạn! Tiệm hoa V&V Florielle sẽ liên hệ tư vấn trong 5 phút.', 'success');
  };

  return (
    <div className="container py-4 sm:py-6 space-y-5 sm:space-y-6 animate-in fade-in duration-300">
      {/* 1. HERO BANNER */}
      <div className="rounded-[32px] sm:rounded-[36px] p-5 sm:p-10 bg-gradient-to-br from-emerald-50/95 via-white/95 to-teal-50/80 border border-emerald-200/80 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Breadcrumb: Sát gọn gần mép viền khung phía trên bên trái (Chuẩn Image 2) */}
        <div className="relative z-10 flex items-center justify-start gap-2 text-xs font-semibold text-emerald-800 mb-3 sm:mb-5">
          <button
            onClick={() => setCurrentView('store')}
            className="hover:underline flex items-center gap-1.5 text-slate-500 hover:text-emerald-700 transition-colors cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Trang chủ</span>
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-emerald-900 font-bold">Liên Hệ &amp; Ghé Tiệm</span>
        </div>

        {/* Tiêu đề to căn giữa */}
        <div className="relative z-10 max-w-3xl mx-auto space-y-2.5 text-center flex flex-col items-center">
          <span className="inline-flex items-center justify-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10.5px] font-black tracking-wider uppercase mx-auto">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            105 Doãn Kế Thiện, Cầu Giấy, Hà Nội
          </span>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-emerald-950 tracking-tight text-center">
            Liên Hệ V&amp;V Florielle
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl text-center mx-auto">
            Chúng mình luôn sẵn lòng lắng nghe và tư vấn mẫu hoa phù hợp nhất cho bạn. Ghé trực tiếp cửa hàng hoặc gửi lời nhắn để florist hỗ trợ ngay nhé!
          </p>
        </div>
      </div>

      {/* 2. THREE BALANCED MAIN BLOCKS (THÔNG TIN TIỆM - GỬI LỜI NHẮN - BẢN ĐỒ) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* KHỐI 1: THÔNG TIN CỬA HÀNG */}
        <div className="glass-panel p-5 sm:p-6 rounded-[28px] border border-emerald-200/70 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <MapPin className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900">Thông Tin Cửa Hàng</h3>
                <p className="text-[10.5px] text-slate-400">Trụ sở tiệm hoa tươi V&amp;V Florielle</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 block">Địa chỉ tiệm hoa:</strong>
                  <span className="text-slate-600 leading-relaxed">{settings.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <PhoneCall className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 block">Hotline &amp; Zalo tư vấn 24/7:</strong>
                  <a href={`tel:${settings.hotline}`} className="text-emerald-700 font-bold hover:underline">
                    {settings.hotline}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 block">Giờ mở cửa phục vụ:</strong>
                  <span className="text-slate-600">{settings.openingHours} (Cả tuần)</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 block">Email chăm sóc khách hàng:</strong>
                  <span className="text-slate-600">vvflorielle@gmail.com</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/60 text-[11px] text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Giao hoa hỏa tốc 60 - 90P nội thành Hà Nội. Chụp ảnh gửi duyệt Zalo trước khi giao.</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:${settings.hotline}`}
                className="py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Gọi Hotline</span>
              </a>
              <a
                href={`https://zalo.me/${settings.hotline.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat Zalo</span>
              </a>
            </div>
          </div>
        </div>

        {/* KHỐI 2: FORM GỬI LỜI NHẮN & TƯ VẤN */}
        <div className="glass-panel p-5 sm:p-6 rounded-[28px] border border-emerald-200/70 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center shrink-0">
                <Send className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900">Gửi Lời Nhắn Tư Vấn</h3>
                <p className="text-[10.5px] text-slate-400">Florist sẽ liên hệ tư vấn mẫu hoa</p>
              </div>
            </div>

            {isSubmitted ? (
              <div className="py-8 text-center rounded-2xl bg-emerald-50/90 border border-emerald-200 space-y-2.5 animate-in zoom-in-95">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white mx-auto flex items-center justify-center shadow-md">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-emerald-950">Đã Gửi Lời Nhắn Thành Công!</h4>
                <p className="text-xs text-emerald-800 px-4">
                  Cảm ơn bạn <strong className="font-semibold">{senderName}</strong>. Tiệm sẽ gọi điện tư vấn qua số <strong className="font-semibold">{senderPhone}</strong> trong ít phút.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setSenderName('');
                    setSenderPhone('');
                    setSenderMessage('');
                  }}
                  className="mt-2 text-xs text-emerald-700 font-bold hover:underline cursor-pointer"
                >
                  Gửi thêm yêu cầu khác
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Họ tên *</label>
                    <input
                      type="text"
                      required
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="VD: Thu Thảo"
                      className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Số điện thoại *</label>
                    <input
                      type="tel"
                      required
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      placeholder="VD: 0987654321"
                      className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Dịp tặng</label>
                    <select
                      value={senderOccasion}
                      onChange={(e) => setSenderOccasion(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-700 font-semibold focus:outline-none cursor-pointer"
                    >
                      <option value="Sinh nhật">Hoa Sinh Nhật</option>
                      <option value="Khai trương">Hoa Khai Trương</option>
                      <option value="Tình yêu">Bó Hoa Kỷ Niệm</option>
                      <option value="Chúc mừng">Hoa Chúc Mừng</option>
                      <option value="Hoa cưới">Hoa Cưới / Sự Kiện</option>
                      <option value="Chia buồn">Hoa Chia Buồn</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Ngân sách dự kiến</label>
                    <select
                      value={senderBudget}
                      onChange={(e) => setSenderBudget(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-700 font-semibold focus:outline-none cursor-pointer"
                    >
                      <option value="Dưới 500.000đ">Dưới 500.000đ</option>
                      <option value="500.000đ - 1.000.000đ">500k - 1 triệu</option>
                      <option value="1.000.000đ - 2.000.000đ">1 - 2 triệu</option>
                      <option value="Trên 2.000.000đ">Trên 2 triệu</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Lời nhắn / Yêu cầu riêng</label>
                  <textarea
                    rows={2}
                    value={senderMessage}
                    onChange={(e) => setSenderMessage(e.target.value)}
                    placeholder="VD: Cần bó hoa tone màu hồng pastel tặng bạn gái chiều nay..."
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-slate-800"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white font-bold text-xs shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.99]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Gửi Lời Nhắn Cho Tiệm</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* KHỐI 3: BẢN ĐỒ CHỈ ĐƯỜNG CẦU GIẤY (GỌN GÀNG, TỶ LỆ CHUẨN) */}
        <div className="glass-panel p-5 sm:p-6 rounded-[28px] border border-emerald-200/70 shadow-sm flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center shrink-0">
                  <Navigation className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">Bản Đồ Chỉ Đường</h3>
                  <p className="text-[10.5px] text-slate-400">105 Doãn Kế Thiện, Cầu Giấy, Hà Nội</p>
                </div>
              </div>

              <a
                href="https://maps.google.com/?q=105+Doan+Ke+Thien+Cau+Giay+Ha+Noi"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-[11px] font-bold flex items-center gap-1 transition-all"
                title="Mở trên ứng dụng Google Maps"
              >
                <span>Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Compact Map Embed */}
            <div className="w-full h-52 sm:h-56 lg:h-60 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 relative shadow-inner">
              <iframe
                title="Bản đồ chỉ đường 105 Doãn Kế Thiện"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.8978580045437!2d105.7744319758784!3d21.03677278750247!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313454b56839b369%3A0xe54ef99723ec0eb!2zMTA1IMSQb8OjbbiBL4bq_IFRoaeG7h24sIE1haSBE4buLY2gsIEPhuqd1IEdp4bqleSwgSMOgIE7hu5lp!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="pt-1">
            <p className="text-[11px] text-slate-500 text-center">
              📍 Vị trí mặt đường thuận tiện xe máy và ô tô đậu đỗ lấy hoa
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
