import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  MapPin,
  PhoneCall,
  Gift,
  Droplets,
  Scissors,
  Sun,
  CheckCircle2,
  Flower2,
  Palette,
  Truck,
  Sparkles,
  Heart,
  Smartphone,
  Download,
  QrCode,
  ImagePlus,
  Upload,
  Trash2,
  BookOpen,
  Send,
  MessageCircle,
  ExternalLink,
  Calendar,
  Info
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';

export type PopupType =
  | 'guarantee'
  | 'voucher'
  | 'locations'
  | 'care'
  | 'promotions'
  | 'services'
  | 'shipping'
  | 'wedding-event'
  | 'about'
  | 'app-download'
  | 'custom-design'
  | null;

interface InfoPopupsProps {
  activePopup: PopupType;
  onClose: () => void;
}

export const InfoPopups: React.FC<InfoPopupsProps> = ({ activePopup, onClose }) => {
  const { settings, promotions, showToast, setCurrentView, createCustomDesignRequest } = useStore();

  // Custom Design Form State
  const [cdName, setCdName] = useState('');
  const [cdPhone, setCdPhone] = useState('');
  const [cdOccasion, setCdOccasion] = useState('Sinh nhật');
  const [cdBudget, setCdBudget] = useState('500.000đ - 1.000.000đ');
  const [cdNotes, setCdNotes] = useState('');
  const [cdAddress, setCdAddress] = useState('');
  const [cdDate, setCdDate] = useState('');
  const [cdSampleImage, setCdSampleImage] = useState<string | null>(null);
  const [cdSubmittedOrder, setCdSubmittedOrder] = useState<Order | null>(null);

  // Cẩm Nang Library Tab State
  const [careTab, setCareTab] = useState<'tips' | 'meaning' | 'occasions'>('tips');

  if (!activePopup) return null;

  // Handle Image Upload for Custom Design
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast('Kích thước ảnh tối đa 5MB!', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setCdSampleImage(reader.result as string);
      showToast('Đã tải ảnh mẫu hoa lên thành công!', 'success');
    };
    reader.readAsDataURL(file);
  };

  // Submit Custom Design Request
  const handleCustomDesignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cdName.trim() || !cdPhone.trim()) {
      showToast('Vui lòng nhập Họ tên và Số điện thoại để tiệm liên hệ!', 'error');
      return;
    }

    try {
      const order = createCustomDesignRequest({
        senderName: cdName,
        senderPhone: cdPhone,
        occasion: cdOccasion,
        budget: cdBudget,
        sampleImage: cdSampleImage || undefined,
        notes: cdNotes,
        deliveryDate: cdDate || undefined,
        deliveryAddress: cdAddress || undefined
      });

      setCdSubmittedOrder(order);
      showToast('Đã gửi yêu cầu cắm hoa theo mẫu tới tiệm!', 'success');
    } catch {
      showToast('Có lỗi xảy ra khi gửi yêu cầu, vui lòng thử lại!', 'error');
    }
  };

  const getHeaderTitle = () => {
    switch (activePopup) {
      case 'custom-design':
        return 'Đặt Hoa Thiết Kế Theo Mẫu Riêng';
      case 'care':
        return 'Thư Viện Cẩm Nang & Ý Nghĩa Hoa';
      case 'services':
        return 'Dịch Vụ Hoa Tươi Chuyên Nghiệp V&V';
      case 'shipping':
        return 'Chính Sách & Bảng Giá Cước Giao Hoa Hỏa Tốc (Từ 15 Phút)';
      case 'wedding-event':
        return 'Dịch Vụ Hoa Cưới & Trang Trí Sự Kiện Doanh Nghiệp';
      case 'guarantee':
        return 'Cam Kết Chất Lượng Hoa Tươi 100%';
      case 'voucher':
        return 'Ưu Đãi & Quà Tặng Hội Viên';
      case 'promotions':
        return 'Kho Voucher & Khuyến Mãi';
      case 'locations':
        return 'Hệ Thống Tiệm Hoa & Hotline';
      case 'app-download':
        return 'Tải & Cài Đặt Ứng Dụng V&V Florielle';
      case 'about':
        return 'Về Tiệm Hoa V&V Florielle';
      default:
        return 'Thông Tin Dịch Vụ V&V Florielle';
    }
  };

  return (
    <div className="glass-overlay z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div
        className={`glass-modal-content w-full relative transition-all duration-300 ${
          activePopup === 'services' || activePopup === 'care' || activePopup === 'custom-design' || activePopup === 'shipping' || activePopup === 'wedding-event'
            ? 'max-w-2xl sm:max-w-3xl'
            : activePopup === 'app-download'
            ? 'max-w-lg'
            : 'max-w-md'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Centered Modal Header */}
        <div className="glass-modal-header relative flex items-center justify-center text-center">
          <span className="text-xs sm:text-sm font-extrabold text-slate-800 text-center mx-auto tracking-tight">
            {getHeaderTitle()}
          </span>
          <button
            onClick={onClose}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="glass-modal-body p-4 sm:p-6 max-h-[82vh] overflow-y-auto">
          {/* =========================================================================
              CUSTOM DESIGN FLOWER REQUEST POPUP (HÀNG MỚI ĐƯỢC YÊU CẦU)
              ========================================================================= */}
          {activePopup === 'custom-design' && (
            <div>
              {cdSubmittedOrder ? (
                /* Success Confirmation View */
                <div className="text-center py-6 px-3 sm:px-6 space-y-4 animate-in zoom-in-95">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-md border border-emerald-200 shrink-0">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      Đã Gửi Thành Công
                    </span>
                    <h3 className="font-extrabold text-xl sm:text-2xl text-slate-900">
                      Tiệm Hoa Đã Nhận Yêu Cầu!
                    </h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Mã đơn chờ duyệt: <strong className="text-slate-900 font-mono font-bold text-sm">#{cdSubmittedOrder.id}</strong>
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-left space-y-2 text-xs text-slate-700">
                    <div className="flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Quy trình thẩm định khả thi:</strong> Florist của tiệm sẽ xem xét mẫu hoa, kiểm tra lượng hoa tươi nhập mới tại vườn trong ngày để đảm bảo đúng chất lượng và tone màu mong muốn.
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <PhoneCall className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        Tiệm sẽ gọi điện hoặc nhắn tin Zalo tới số <strong className="font-bold text-emerald-900">{cdPhone}</strong> trong vòng <strong>5 - 10 phút</strong> để báo giá chính xác và xác nhận thực hiện.
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                      <div>
                        Nếu một số loài hoa đặc thù đang trái mùa không cắm được, tiệm sẽ tư vấn hoa thay thế tương đương cao cấp nhất cho bạn.
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
                    <a
                      href={`tel:${settings.hotline}`}
                      className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>Gọi Duyệt Gấp: {settings.hotline}</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setCdSubmittedOrder(null);
                        setCdNotes('');
                        setCdSampleImage(null);
                        onClose();
                      }}
                      className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
                    >
                      Hoàn Tất & Đóng
                    </button>
                  </div>
                </div>
              ) : (
                /* Request Form View */
                <form onSubmit={handleCustomDesignSubmit} className="space-y-4">
                  <div className="text-center space-y-1 mb-2">
                    <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 mx-auto flex items-center justify-center mb-1.5 shadow-sm border border-rose-200 shrink-0">
                      <Palette className="w-6 h-6" />
                    </div>
                    <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                      Yêu Cầu Thiết Kế Hoa Theo Mẫu Riêng
                    </h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Gửi thông tin và ảnh mẫu hoa bạn muốn cắm. Florist V&V sẽ duyệt mẫu, báo giá và phản hồi ngay!
                    </p>
                  </div>

                  {/* Customer Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Họ và tên của bạn <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={cdName}
                        onChange={(e) => setCdName(e.target.value)}
                        placeholder="VD: Nguyễn Thu Thảo"
                        className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Số điện thoại / Zalo <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={cdPhone}
                        onChange={(e) => setCdPhone(e.target.value)}
                        placeholder="VD: 0987654321"
                        className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Occasion & Budget */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Dịp tặng hoa
                      </label>
                      <select
                        value={cdOccasion}
                        onChange={(e) => setCdOccasion(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-700 font-semibold focus:outline-none cursor-pointer"
                      >
                        <option value="Sinh nhật">Hoa Sinh Nhật</option>
                        <option value="Tỏ tình / Cầu hôn">Tỏ Tình / Cầu Hôn / Kỷ Niệm</option>
                        <option value="Khai trương">Hoa Khai Trương Doanh Nghiệp</option>
                        <option value="Tốt nghiệp">Hoa Chúc Mừng Tốt Nghiệp</option>
                        <option value="Hoa cưới">Hoa Cưới / Sự Kiện</option>
                        <option value="Chia buồn">Kệ / Vòng Hoa Chia Buồn Lịch Sự</option>
                        <option value="Trang trí nhà">Hoa Tươi Bình / Bình Để Bàn</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Mức ngân sách dự kiến
                      </label>
                      <select
                        value={cdBudget}
                        onChange={(e) => setCdBudget(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-700 font-semibold focus:outline-none cursor-pointer"
                      >
                        <option value="300.000đ - 500.000đ">300.000đ - 500.000đ</option>
                        <option value="500.000đ - 1.000.000đ">500.000đ - 1.000.000đ</option>
                        <option value="1.000.000đ - 2.000.000đ">1.000.000đ - 2.000.000đ</option>
                        <option value="Trên 2.000.000đ">Cao cấp (Trên 2.000.000đ)</option>
                        <option value="Theo thỏa thuận">Theo thỏa thuận sau khi tư vấn</option>
                      </select>
                    </div>
                  </div>

                  {/* Sample Photo Attachment */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Đính kèm ảnh mẫu hoa tham khảo (Tùy chọn)
                    </label>

                    {cdSampleImage ? (
                      <div className="relative inline-block border-2 border-emerald-400 rounded-2xl overflow-hidden shadow-sm">
                        <img
                          src={cdSampleImage}
                          alt="Ảnh mẫu hoa đính kèm"
                          className="w-32 h-32 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setCdSampleImage(null)}
                          className="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-md"
                          title="Xóa ảnh này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer bg-slate-50/60 hover:bg-emerald-50/40 transition-colors">
                        <ImagePlus className="w-6 h-6 text-emerald-600" />
                        <span className="text-xs font-semibold text-slate-700">
                          Bấm để chọn ảnh mẫu từ điện thoại hoặc máy tính
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Hỗ trợ định dạng JPG, PNG, WEBP (Tối đa 5MB)
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {/* Specific notes */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Yêu cầu chi tiết & Lời dặn Florist
                    </label>
                    <textarea
                      rows={3}
                      value={cdNotes}
                      onChange={(e) => setCdNotes(e.target.value)}
                      placeholder="VD: Cần bó hoa tone màu hồng pastel nhạt, kèm lá bạc và nơ voan trắng. Bó to dáng Hàn Quốc để tặng bạn gái..."
                      className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-slate-800"
                    />
                  </div>

                  {/* Delivery Location & Time (Optional) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Ngày giờ cần hoa (Dự kiến)
                      </label>
                      <input
                        type="text"
                        value={cdDate}
                        onChange={(e) => setCdDate(e.target.value)}
                        placeholder="VD: 15h00 chiều mai"
                        className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Địa chỉ nhận hoa (Nếu giao tận nơi)
                      </label>
                      <input
                        type="text"
                        value={cdAddress}
                        onChange={(e) => setCdAddress(e.target.value)}
                        placeholder="VD: Số 20 Duy Tân, Cầu Giấy..."
                        className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white font-extrabold text-xs shadow-lg shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                    >
                      <Send className="w-4 h-4" />
                      <span>Gửi Yêu Cầu Cho Chủ Tiệm Duyệt Ngay</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* =========================================================================
              THƯ VIỆN CẨM NANG & Ý NGHĨA HOA (POPUP THAY VÌ TRANG RIÊNG THEO CHỈ ĐẠO)
              ========================================================================= */}
          {activePopup === 'care' && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center mb-1 shadow-sm border border-amber-200 shrink-0">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-lg sm:text-xl text-slate-900">
                  Thư Viện Cẩm Nang Chăm Sóc & Ý Nghĩa Hoa
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Kiến thức hữu ích từ các nghệ nhân cắm hoa V&V Florielle Hà Nội
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
                  💐 Ý Nghĩa Loài Hoa
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
                        Rửa sạch bình trước khi thay nước mới. Thêm 1/2 gói dưỡng hoa V&V tặng kèm hoặc 1 vài giọt nước cốt chanh để diệt khuẩn nước cắm.
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
                        Rót nhẹ 100 - 150ml nước sạch vào giữa miếng xốp cắm hoa mỗi ngày một lần để giữ ẩm đều, không tưới đẫm lên cánh hoa.
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
                      <span>Hoa Hồng Đỏ Ecuador</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Biểu tượng của tình yêu nồng cháy, sự say đắm và lời thề thủy chung son sắt.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-amber-900">
                      <Sun className="w-3.5 h-3.5 text-amber-600" />
                      <span>Hoa Hướng Dương</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Niềm tin kiên định, năng lượng tích cực và lời chúc tương lai rạng ngời thành công.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-200/80 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-purple-900">
                      <Flower2 className="w-3.5 h-3.5 text-purple-600" />
                      <span>Hoa Tulip Hà Lan</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Tượng trưng cho vẻ đẹp thanh lịch quý phái và một tình cảm hoàn hảo chân thành.
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

                  <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1">
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
                Đã Hiểu & Đóng Cửa Sổ
              </button>
            </div>
          )}

          {/* =========================================================================
              1. FRESHNESS GUARANTEE POPUP
              ========================================================================= */}
          {activePopup === 'guarantee' && (
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md shadow-emerald-600/10 border border-emerald-200/50 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-base text-slate-900 tracking-tight">Cam Kết Chất Lượng Hoa Tươi 100%</h3>
                <p className="text-xs text-slate-500 mt-1">Đặc quyền bảo hành chỉ có tại V&V Florielle Hà Nội</p>
              </div>
              <div className="space-y-3 text-xs text-slate-600 bg-slate-50/90 p-4 rounded-2xl border border-slate-200/60 leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Tuyển chọn loại 1:</strong> Hoa tươi loại 1 nhập mới mỗi ngày từ đơn vị vườn hoa & hoa ngoại nhập khẩu cao cấp.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Chụp ảnh trước khi giao:</strong> Florist gửi hình ảnh thành phẩm thực tế qua Zalo cho quý khách duyệt ưng ý trước khi tiệm giao hoa đi.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Bảo hành đổi mới 100%:</strong> Nếu hoa dập nát do vận chuyển hoặc không đúng mẫu yêu cầu, đổi mới hoặc hoàn tiền ngay trong 2H.</span>
                </div>
              </div>
              <button onClick={onClose} className="btn-primary w-full text-xs py-2.5 rounded-xl shadow-md">
                Đã hiểu & Tiếp tục mua sắm
              </button>
            </div>
          )}

          {/* =========================================================================
              2. WELCOME VOUCHER POPUP
              ========================================================================= */}
          {activePopup === 'voucher' && (
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto shadow-md shadow-rose-600/10 border border-rose-200/50 shrink-0">
                <Gift className="w-6 h-6" />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-base text-slate-900 tracking-tight">Voucher Chào Bạn Mới FREESHIP 30K</h3>
                <p className="text-xs text-slate-500 mt-1">Dành riêng cho khách hàng mới đã xác thực tài khoản</p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50/80 to-amber-50/80 border border-rose-200 text-center space-y-2">
                <span className="text-[11px] font-semibold text-rose-700 tracking-wider uppercase">Mã Giảm Phí Giao Hàng</span>
                <div className="font-mono text-xl font-extrabold text-rose-700 tracking-widest bg-white py-2 px-4 rounded-xl border border-dashed border-rose-300 shadow-inner">
                  FREESHIP30K
                </div>
                <p className="text-[11px] text-slate-600">Miễn phí vận chuyển tối đa 30.000đ cho đơn hoa từ 300.000đ. Đã kích hoạt trong ví voucher của hội viên mới!</p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText('FREESHIP30K');
                  showToast('Đã sao chép mã FREESHIP30K!', 'success');
                  onClose();
                }}
                className="btn-primary w-full text-xs py-2.5 bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md"
              >
                Sao chép mã & Đặt hoa ngay
              </button>
            </div>
          )}

          {/* =========================================================================
              PROMOTIONS LIST POPUP
              ========================================================================= */}
          {activePopup === 'promotions' && (
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-100 to-amber-100 text-rose-700 flex items-center justify-center mx-auto shadow-md shadow-rose-600/10 border border-rose-200/50 shrink-0">
                <Gift className="w-6 h-6" />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-base text-slate-900 tracking-tight">Kho Voucher & Ưu Đãi</h3>
                <p className="text-xs text-slate-500 mt-1">Áp dụng tại bước thanh toán hoặc đổi từ điểm tích lũy</p>
              </div>
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {promotions.filter(p => p.isActive).map(promo => (
                  <div key={promo.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-xs text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-lg border border-emerald-300">
                          {promo.code}
                        </span>
                        <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                          {promo.badge}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-800 mt-1">{promo.title}</div>
                      <div className="text-[11px] text-slate-500">{promo.description}</div>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(promo.code);
                        showToast(`Đã sao chép mã ${promo.code}!`, 'success');
                      }}
                      className="shrink-0 px-2.5 py-1 text-xs font-medium text-emerald-700 hover:text-white bg-emerald-50 hover:bg-emerald-600 rounded-lg border border-emerald-200 transition-colors"
                    >
                      Sao chép
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={onClose} className="btn-primary w-full text-xs py-2.5 rounded-xl shadow-md">
                Đóng
              </button>
            </div>
          )}

          {/* =========================================================================
              3. SHOWROOM & HOTLINE
              ========================================================================= */}
          {activePopup === 'locations' && (
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center mx-auto shadow-md shadow-sky-600/10 border border-sky-200/50 shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-base text-slate-900 tracking-tight">Boutique Showroom & Hotline</h3>
                <p className="text-xs text-slate-500 mt-1">V&V Florielle hân hạnh được phục vụ quý khách tại Hà Nội</p>
              </div>
              <div className="space-y-3 text-xs text-slate-700 bg-slate-50/90 p-4 rounded-2xl border border-slate-200/60">
                <div className="space-y-1 pb-2 border-b border-slate-200">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Showroom Cầu Giấy (Trụ sở chính)
                  </div>
                  <p className="text-slate-600 text-xs font-medium">{settings.address}</p>
                  <p className="text-slate-500 text-[11px]">Giờ phục vụ: {settings.openingHours}</p>
                  <p className="text-slate-500 text-[11px]">Giao hỏa tốc chỉ từ 15 phút nội thành &amp; 60 phút ngoại thành Hà Nội</p>
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
                className="btn-primary w-full text-xs py-2.5 flex items-center justify-center gap-2 rounded-xl shadow-md"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Gọi tư vấn ngay: {settings.hotline}</span>
              </a>
            </div>
          )}

          {/* =========================================================================
              5. DỊCH VỤ HOA TƯƠI V&V FLORIELLE (SPACIOUS LUXURY GRID)
              ========================================================================= */}
          {activePopup === 'services' && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-100 px-3 py-0.5 rounded-full">
                  V&V Florielle Hà Nội
                </span>
                <h3 className="font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
                  Dịch Vụ Hoa Tươi Nghệ Thuật Chuyên Nghiệp
                </h3>
                <p className="text-xs text-slate-500 max-w-lg mx-auto">
                  105 Doãn Kế Thiện, Cầu Giấy • Đáp ứng trọn vẹn mọi nhu cầu quà tặng và sự kiện
                </p>
              </div>

              {/* 2x2 Spacious Luxury Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Card 1: Hoa Tươi Mẫu Sẵn */}
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

                {/* Card 2: Hoa Thiết Kế Theo Mẫu */}
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
                      // Direct switch to custom-design modal
                      onClose();
                      setTimeout(() => {
                        const event = new CustomEvent('open-custom-design-modal');
                        window.dispatchEvent(event);
                      }, 50);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold transition-colors text-center cursor-pointer"
                  >
                    Gửi Yêu Cầu Thiết Kế →
                  </button>
                </div>

                {/* Card 3: Hỏa Tốc */}
                <div className="p-4 rounded-2xl bg-white/95 border border-sky-200/80 shadow-xs flex flex-col justify-between space-y-3 hover:shadow-md transition-shadow">
                  <div className="space-y-1.5">
                    <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center">
                      <Truck className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-sm text-slate-900">Giao Hoa Hỏa Tốc Từ 15 Phút</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Giao nhanh nội thành Hà Nội. Bảng giá cước minh bạch theo km, luôn chụp ảnh &amp; video 360° qua Zalo trước khi giao.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        setTimeout(() => {
                          const event = new CustomEvent('open-shipping-modal');
                          window.dispatchEvent(event);
                        }, 50);
                      }}
                      className="flex-1 py-2 px-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold transition-colors text-center cursor-pointer"
                    >
                      Bảng Giá Cước Ship →
                    </button>
                    <a
                      href={`tel:${settings.hotline.replace(/[^0-9]/g, '')}`}
                      className="py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors text-center shrink-0"
                    >
                      Gọi Ngay
                    </a>
                  </div>
                </div>

                {/* Card 4: Hoa Cưới & Sự Kiện */}
                <div className="p-4 rounded-2xl bg-white/95 border border-amber-200/80 shadow-xs flex flex-col justify-between space-y-3 hover:shadow-md transition-shadow">
                  <div className="space-y-1.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-sm text-slate-900">Hoa Cưới &amp; Sự Kiện Doanh Nghiệp</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Thiết kế trọn gói hoa cô dâu, trang trí xe hoa, backdrop lễ đường và lẵng hoa khai trương đại tiệc, xuất VAT điện tử.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        setTimeout(() => {
                          const event = new CustomEvent('open-wedding-event-modal');
                          window.dispatchEvent(event);
                        }, 50);
                      }}
                      className="flex-1 py-2 px-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition-colors text-center cursor-pointer"
                    >
                      Chi Tiết Gói Dịch Vụ →
                    </button>
                    <a
                      href={`https://zalo.me/${settings.hotline.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors text-center shrink-0"
                    >
                      Zalo
                    </a>
                  </div>
                </div>
              </div>

              {/* Bottom APK Download Card */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/90 border border-emerald-300/80 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-emerald-950 font-bold text-xs">Ứng Dụng V&V Florielle (Android APK)</strong>
                      <span className="text-[9px] bg-emerald-600 text-white font-black px-1.5 py-0.2 rounded-full">0.85MB</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">Cài đặt trực tiếp trên điện thoại: Tích điểm VIP, đặt hoa 1 chạm</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href="/VVFlorielle.apk"
                    download="VVFlorielle.apk"
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải File APK</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              SHIPPING RATES & DELIVERY POLICY POPUP (GIAO HOA CẤP TỐC 60 - 90 PHÚT)
              ========================================================================= */}
          {activePopup === 'shipping' && (
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
                  Xuất phát từ Showroom <strong className="text-slate-700">105 Doãn Kế Thiện, Mai Dịch, Cầu Giấy, Hà Nội</strong>
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
                        <span className="text-[9px] bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded-full">FREESHIP</span>
                      </div>
                      <p className="text-[10.5px] text-slate-600">
                        Mai Dịch, Dịch Vọng, Nghĩa Tân, Mỹ Đình 2, Xuân Thủy
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-extrabold text-sm text-emerald-700">0đ / 20.000đ</div>
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
                      <div className="font-extrabold text-sm text-slate-800">30.000đ - 40.000đ</div>
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
                      <div className="font-extrabold text-sm text-slate-800">45.000đ - 60.000đ</div>
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
                      <div className="font-extrabold text-sm text-slate-800">65.000đ - 85.000đ</div>
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
                      <strong>Duyệt ảnh trước khi giao:</strong> Florist gửi ảnh &amp; video 360° qua Zalo để bạn xem và duyệt ưng ý rồi mới cho shipper đi giao.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Đóng gói chống dập nát:</strong> Bọc màng bảo vệ, gắn túi dưỡng nước gốc hoa, cố định đế giỏ hoa vững chắc suốt quãng đường.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Tặng phụ kiện cao cấp:</strong> Miễn phí thiệp chúc mừng thiết kế riêng hoặc in băng rôn chữ nổi sang trọng theo yêu cầu.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Bảo hành đổi mới 100%:</strong> Nếu hoa bị dập gãy, héo úa do vận chuyển, tiệm sẽ cắm mới và giao lại ngay trong vòng 2 giờ.
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <a
                  href={`tel:${settings.hotline.replace(/[^0-9]/g, '')}`}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Gọi Giao Cấp Tốc Ngay: {settings.hotline}</span>
                </a>
                <a
                  href={`https://zalo.me/${settings.hotline.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat Zalo Báo Địa Chỉ &amp; Xem Mẫu</span>
                </a>
              </div>
            </div>
          )}

          {/* =========================================================================
              WEDDING & CORPORATE EVENT FLORAL POPUP
              ========================================================================= */}
          {activePopup === 'wedding-event' && (
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
                        Phối hoa Tulip Hà Lan, Hồng Ohara, Calla Lily, Cúc Mẫu Đơn theo dáng tròn hoặc dáng rơi hiện đại. Tặng kèm 02 hoa cài áo chú rể tone-sur-tone.
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
                        <span>🎪 Cổng Hoa &amp; Backdrop Lễ Đường</span>
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
                        <span>🎙️ Hoa Bục Phát Biểu &amp; Bàn Đại Biểu VIP</span>
                        <span className="text-[11px] text-sky-700 font-extrabold">Từ 450k</span>
                      </div>
                      <p className="text-[10.5px] text-slate-500 leading-relaxed">
                        Cắm dáng dài hoặc dáng thuyền thanh lịch, phối theo màu sắc logo thương hiệu của công ty, trang trọng và không che khuất tầm nhìn.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/90 border border-sky-100 space-y-1 shadow-2xs">
                      <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
                        <span>🧾 Đầy Đủ Hóa Đơn VAT &amp; Hợp Đồng</span>
                        <span className="text-[11px] text-emerald-700 font-extrabold">Xuất trong ngày</span>
                      </div>
                      <p className="text-[10.5px] text-slate-500 leading-relaxed">
                        Cung cấp báo giá cạnh tranh, xuất hóa đơn điện tử hợp lệ đầy đủ cho doanh nghiệp, hỗ trợ thanh toán công nợ chuyển khoản công ty.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <a
                  href={`https://zalo.me/${settings.hotline.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Tư Vấn Concept &amp; Gửi Báo Giá Zalo ({settings.hotline})</span>
                </a>
                <a
                  href={`tel:${settings.hotline.replace(/[^0-9]/g, '')}`}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Gọi Hotline Khảo Sát Tận Nơi</span>
                </a>
              </div>
            </div>
          )}

          {/* =========================================================================
              APP APK DOWNLOAD POPUP (0.85MB)
              ========================================================================= */}
          {activePopup === 'app-download' && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto mb-2 shadow-md shrink-0">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  <span>Phiên bản APK v1.0.0</span>
                  <span className="w-1 h-1 rounded-full bg-emerald-500" />
                  <span>Siêu nhẹ 0.85MB</span>
                </div>
                <h3 className="font-extrabold text-lg text-slate-900">
                  Cài Đặt App V&V Florielle Trên Điện Thoại
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Trải nghiệm đặt hoa mượt mà, theo dõi trạng thái đơn hàng theo thời gian thực và nhận thông báo tích điểm VIP
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 text-xs text-slate-700">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-semibold text-slate-600">Dung lượng bộ cài:</span>
                  <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg">Chỉ 0.85 MB</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-semibold text-slate-600">Hệ điều hành:</span>
                  <span className="font-bold text-slate-800">Android 7.0 trở lên</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-600">Bảo mật ứng dụng:</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>An toàn 100% (Signed APK)</span>
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <a
                  href="/VVFlorielle.apk"
                  download="VVFlorielle.apk"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải Xuống Trực Tiếp (VVFlorielle.apk - 0.85MB)</span>
                </a>
                <p className="text-[10.5px] text-center text-slate-400">
                  * Sau khi tải xong, nhấn vào file và chọn <em>"Cài đặt"</em> để sử dụng ngay trên điện thoại.
                </p>
              </div>
            </div>
          )}

          {/* =========================================================================
              ABOUT POPUP
              ========================================================================= */}
          {activePopup === 'about' && (
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md border border-emerald-200 shrink-0">
                <Flower2 className="w-6 h-6" />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-base text-slate-900 tracking-tight">Về V&V Florielle</h3>
                <p className="text-xs text-slate-500 mt-1">105 Doãn Kế Thiện, Mai Dịch, Cầu Giấy, Hà Nội</p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed text-center">
                V&V Florielle tự hào là thương hiệu hoa tươi nghệ thuật cao cấp, chuyên cung cấp các mẫu hoa bó, hoa giỏ, hoa chúc mừng và thiết kế theo yêu cầu riêng.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setCurrentView('about');
                }}
                className="btn-primary w-full text-xs py-2.5 rounded-xl shadow-md"
              >
                Xem Trang Giới Thiệu Đầy Đủ →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
