import React, { useState } from 'react';
import {
  CheckCircle2,
  Sparkles,
  PhoneCall,
  Info,
  Palette,
  ImagePlus,
  Trash2,
  Send
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';

interface CustomDesignModalProps {
  onClose: () => void;
}

export const CustomDesignModal: React.FC<CustomDesignModalProps> = ({ onClose }) => {
  const { settings, showToast, createCustomDesignRequest } = useStore();

  const [cdName, setCdName] = useState('');
  const [cdPhone, setCdPhone] = useState('');
  const [cdOccasion, setCdOccasion] = useState('Sinh nhật');
  const [cdBudget, setCdBudget] = useState('500.000₫ - 1.000.000₫');
  const [cdNotes, setCdNotes] = useState('');
  const [cdAddress, setCdAddress] = useState('');
  const [cdDate, setCdDate] = useState('');
  const [cdSampleImage, setCdSampleImage] = useState<string | null>(null);
  const [cdSubmittedOrder, setCdSubmittedOrder] = useState<Order | null>(null);

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

  if (cdSubmittedOrder) {
    return (
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
            Mã đơn chờ duyệt:{' '}
            <strong className="text-slate-900 font-mono font-bold text-sm">
              #{cdSubmittedOrder.id}
            </strong>
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
              Tiệm sẽ gọi điện hoặc nhắn tin Zalo tới số{' '}
              <strong className="font-bold text-emerald-900">{cdPhone}</strong> trong vòng{' '}
              <strong>5 - 10 phút</strong> để báo giá chính xác và xác nhận thực hiện.
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <div>
              Nếu một số loại hoa đặc thù đang trái mùa không cắm được, tiệm sẽ tư vấn hoa thay thế tương đương cao cấp nhất cho bạn.
            </div>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
          <a
            href={`tel:${settings.hotline}`}
            className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
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
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer"
          >
            Hoàn Tất & Đóng
          </button>
        </div>
      </div>
    );
  }

  return (
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Dịp tặng hoa</label>
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
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Mức ngân sách dự kiến</label>
          <select
            value={cdBudget}
            onChange={(e) => setCdBudget(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-700 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="300.000₫ - 500.000₫">300.000₫ - 500.000₫</option>
            <option value="500.000₫ - 1.000.000₫">500.000₫ - 1.000.000₫</option>
            <option value="1.000.000₫ - 2.000.000₫">1.000.000₫ - 2.000.000₫</option>
            <option value="Trên 2.000.000₫">Cao cấp (Trên 2.000.000₫)</option>
            <option value="Theo thỏa thuận">Theo thỏa thuận sau khi tư vấn</option>
          </select>
        </div>
      </div>

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
              className="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-md cursor-pointer"
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
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        )}
      </div>

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
  );
};
