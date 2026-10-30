import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  MapPin,
  PhoneCall,
  Mail,
  Clock,
  Send,
  Sparkles,
  MessageCircle,
  ExternalLink,
  CheckCircle2,
  Home,
  Flower2
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
    <div className="container py-6 space-y-8 animate-in fade-in duration-300">
      {/* 1. HERO BANNER */}
      <div className="rounded-[36px] p-6 sm:p-10 bg-gradient-to-br from-emerald-50/95 via-white/95 to-teal-50/80 border border-emerald-200/80 shadow-xl relative overflow-hidden text-center sm:text-left">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-emerald-800">
            <button
              onClick={() => setCurrentView('store')}
              className="hover:underline flex items-center gap-1 text-slate-500 hover:text-emerald-700"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Trang chủ</span>
            </button>
            <span className="text-slate-300">/</span>
            <span className="text-emerald-900 font-bold">Liên Hệ & Ghé Tiệm</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-emerald-950 tracking-tight">
            Liên Hệ V&V Florielle
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Chúng mình luôn sẵn lòng lắng nghe và tư vấn mẫu hoa phù hợp nhất cho bạn. Ghé trực tiếp cửa hàng tại 105 Doãn Kế Thiện hoặc để lại lời nhắn để florist gọi lại hỗ trợ ngay nhé!
          </p>
        </div>
      </div>

      {/* 2. CONTACT DETAILS & CONSULTATION FORM */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Contact Info Cards (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel p-6 rounded-[28px] border border-emerald-200/70 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-700" />
              <span>Thông Tin Cửa Hàng</span>
            </h3>

            <div className="space-y-3.5 text-xs text-slate-600">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">Địa chỉ tiệm hoa:</p>
                  <p className="mt-0.5 text-slate-600 font-medium">105 Doãn Kế Thiện, Phường Mai Dịch, Quận Cầu Giấy, Hà Nội</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">Hotline & Zalo tư vấn 24/7:</p>
                  <a href={`tel:${settings.hotline}`} className="mt-0.5 text-emerald-700 font-bold hover:underline block">
                    {settings.hotline}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">Giờ mở cửa phục vụ:</p>
                  <p className="mt-0.5 text-slate-600">06:30 - 21:30 (Mở cửa tất cả các ngày trong tuần)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">Email chăm sóc khách hàng:</p>
                  <p className="mt-0.5 text-slate-600">vvflorielle@gmail.com</p>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="pt-2 grid grid-cols-2 gap-2">
              <a
                href={`tel:${settings.hotline}`}
                className="py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Gọi Hotline</span>
              </a>
              <a
                href={`https://zalo.me/${settings.hotline.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat Zalo</span>
              </a>
            </div>
          </div>

          {/* Guarantee Pill */}
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/60 text-xs text-emerald-900 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Giao hoa hỏa tốc trong 60 - 90 phút nội thành Hà Nội. Chụp ảnh gửi duyệt trước khi giao.</span>
          </div>
        </div>

        {/* Consultation Message Form (3 cols) */}
        <div className="lg:col-span-3">
          <div className="glass-panel p-6 sm:p-8 rounded-[28px] border border-emerald-200/70 shadow-sm">
            <h3 className="font-bold text-lg text-slate-900 mb-1">Gửi Lời Nhắn Tư Vấn Hoa Theo Yêu Cầu</h3>
            <p className="text-xs text-slate-500 mb-5">
              Bạn có yêu cầu đặc biệt về màu sắc, loài hoa hay ngân sách? Hãy để lại thông tin, Florist sẽ liên hệ ngay!
            </p>

            {isSubmitted ? (
              <div className="p-8 text-center rounded-2xl bg-emerald-50/90 border border-emerald-200 space-y-3 animate-in zoom-in-95">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white mx-auto flex items-center justify-center shadow-md">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-base text-emerald-950">Gửi Yêu Cầu Thành Công!</h4>
                <p className="text-xs text-emerald-800 max-w-sm mx-auto">
                  Cảm ơn bạn <strong className="font-semibold">{senderName}</strong>. Florist của V&V Florielle sẽ liên hệ qua số điện thoại <strong className="font-semibold">{senderPhone}</strong> trong vòng 5 phút nha!
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setSenderName('');
                    setSenderPhone('');
                    setSenderMessage('');
                  }}
                  className="mt-2 text-xs text-emerald-700 font-bold hover:underline"
                >
                  Gửi thêm lời nhắn khác
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Họ và tên của bạn *</label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="VD: Thu Thảo"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/90 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Số điện thoại / Zalo *</label>
                    <input
                      type="tel"
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      placeholder="VD: 0987654321"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/90 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Dịp tặng hoa</label>
                    <select
                      value={senderOccasion}
                      onChange={(e) => setSenderOccasion(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl text-xs bg-white/90 border border-slate-200 text-slate-700 font-semibold focus:outline-none cursor-pointer"
                    >
                      <option value="Sinh nhật">Hoa Sinh Nhật</option>
                      <option value="Khai trương">Hoa Khai Trương Doanh Nghiệp</option>
                      <option value="Tình yêu">Bó Hoa Tỏ Tình / Kỷ Niệm</option>
                      <option value="Chúc mừng">Hoa Chúc Mừng Thăng Chức / Tốt Nghiệp</option>
                      <option value="Hoa cưới">Hoa Cưới / Sự Kiện</option>
                      <option value="Chia buồn">Kệ Hoa Chia Buồn Lịch Sự</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ngân sách dự kiến</label>
                    <select
                      value={senderBudget}
                      onChange={(e) => setSenderBudget(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl text-xs bg-white/90 border border-slate-200 text-slate-700 font-semibold focus:outline-none cursor-pointer"
                    >
                      <option value="Dưới 500.000đ">Dưới 500.000đ</option>
                      <option value="500.000đ - 1.000.000đ">500.000đ - 1.000.000đ</option>
                      <option value="1.000.000đ - 2.000.000đ">1.000.000đ - 2.000.000đ</option>
                      <option value="Trên 2.000.000đ">Thiết kế cao cấp (Trên 2.000.000đ)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Lời nhắn / Yêu cầu chi tiết</label>
                  <textarea
                    rows={3}
                    value={senderMessage}
                    onChange={(e) => setSenderMessage(e.target.value)}
                    placeholder="VD: Cần bó hoa hồng pastel tặng bạn gái sinh nhật vào chiều nay, kèm thiệp viết tay lời chúc ngọt ngào..."
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/90 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-slate-800"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white font-extrabold text-xs shadow-lg shadow-emerald-700/20 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Gửi Yêu Cầu Tư Vấn Ngay</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* 3. GOOGLE MAPS EMBEDDED PREVIEW */}
      <div className="glass-panel p-4 sm:p-6 rounded-[32px] border border-emerald-200/70 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-5 h-5 text-emerald-700" />
              <span>Bản Đồ Chỉ Đường - 105 Doãn Kế Thiện, Cầu Giấy, Hà Nội</span>
            </h3>
            <p className="text-xs text-slate-500">
              Vị trí mặt tiền đường Doãn Kế Thiện, thuận tiện xe máy và ô tô đậu đỗ lấy hoa
            </p>
          </div>
          <a
            href="https://maps.google.com/?q=105+Doan+Ke+Thien+Cau+Giay+Ha+Noi"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
          >
            <span>Mở Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Responsive Map Container */}
        <div className="w-full h-72 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 relative shadow-inner">
          <iframe
            title="Bản đồ chỉ đường 105 Doãn Kế Thiện"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.8978580045437!2d105.7744319758784!3d21.03677278750247!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313454b56839b369%3A0xe54ef99723ec0eb!2zMTA1IMSQb8OjbbiBL4bq_IFRoaeG7h24sIE1haSBE4buLY2gsIEPhuqd1IEdp4bqleSwgSMOgIE7hu5lp!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s"
            className="w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
};
