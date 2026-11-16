import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useBodyScrollLock } from '../../utils/scrollLock';
import {
  Megaphone,
  X,
  Send,
  Trash2,
  AlertTriangle,
  Sparkles,
  CloudRain,
  Flame,
  CheckCircle2,
  BellRing
} from 'lucide-react';
import { AppNotification } from '../../types';

interface BroadcastBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAnnouncement?: string;
  onBroadcast: (title: string, message: string, type?: AppNotification['type']) => void;
  onClearAnnouncement: () => void;
}

export const BroadcastBannerModal: React.FC<BroadcastBannerModalProps> = ({
  isOpen,
  onClose,
  currentAnnouncement,
  onBroadcast,
  onClearAnnouncement
}) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<AppNotification['type']>('SYSTEM');
  const [successNotice, setSuccessNotice] = useState(false);

  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  const presets = [
    {
      label: 'Bão & Mưa Lớn',
      icon: CloudRain,
      title: 'THÔNG BÁO VẬN HÀNH THỜI TIẾT XẤU',
      message: 'Thời tiết mưa bão lớn, tiệm bọc màng bảo vệ 100% cánh hoa và đơn giao có thể trễ 15-30 phút để đảm bảo an toàn cho shipper. Kính mong Quý khách thông cảm!',
      type: 'SYSTEM' as const,
      color: 'border-blue-300 bg-blue-50/70 text-blue-900'
    },
    {
      label: 'Quá Tải Dịp Lễ',
      icon: Flame,
      title: 'TIỆM ĐANG QUÁ TẢI ĐƠN DỊP LỄ',
      message: 'Lượng đơn tăng cao kỷ lục, tiệm ưu tiên phục vụ các đơn hẹn giờ trước. Đơn hỏa tốc tạm thời cần thêm 20-40 phút chuẩn bị. Cảm ơn Quý khách!',
      type: 'SYSTEM' as const,
      color: 'border-rose-300 bg-rose-50/70 text-rose-900'
    },
    {
      label: 'Sự Kiện x2 Điểm',
      icon: Sparkles,
      title: 'ĐẠI TIỆC TRI ÂN: NHÂN ĐÔI TÍCH ĐIỂM TOÀN BỘ ĐƠN',
      message: 'Mọi đơn hàng thanh toán thành công trong ngày hôm nay đều được x2 điểm thưởng thành viên. Đổi ngay voucher giảm tới 100k!',
      type: 'PROMO' as const,
      color: 'border-amber-300 bg-amber-50/70 text-amber-900'
    },
    {
      label: 'Bảo Trì Nhẹ',
      icon: AlertTriangle,
      title: 'THÔNG BÁO NÂNG CẤP HỆ THỐNG',
      message: 'Hệ thống bảo trì máy chủ trong 15 phút. Các đơn hoa đã đặt vẫn được giao nhận đúng giờ cam kết, hotline 0969.862.062 luôn hỗ trợ 24/7.',
      type: 'SYSTEM' as const,
      color: 'border-slate-300 bg-slate-50/70 text-slate-800'
    }
  ];

  const handleApplyPreset = (p: typeof presets[0]) => {
    setTitle(p.title);
    setMessage(p.message);
    setType(p.type);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    onBroadcast(title.trim(), message.trim(), type);
    setSuccessNotice(true);
    setTimeout(() => {
      setSuccessNotice(false);
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    onClearAnnouncement();
    setSuccessNotice(true);
    setTimeout(() => {
      setSuccessNotice(false);
      onClose();
    }, 1000);
  };

  return createPortal(
    <div
      className="glass-overlay z-[100050]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white rounded-[32px] max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200/80 space-y-5 relative max-h-[92dvh] sm:max-h-[88vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer z-10"
          title="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1.5 border-b border-slate-100 pb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white shadow-md mx-auto flex items-center justify-center">
            <Megaphone className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold uppercase tracking-wider mb-1">
              <span>Toàn Hệ Thống</span>
            </div>
            <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
              Phát Thông Báo Khẩn Cấp Toàn Website
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Banner chạy chữ nổi bật trên đỉnh trang chủ, pop-up thông báo chuông và giọng đọc trợ lý cho khách
            </p>
          </div>
        </div>

        {/* Current Active Announcement Status */}
        {currentAnnouncement ? (
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-300 text-xs flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <BellRing className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 animate-bounce" />
              <div>
                <span className="font-bold text-amber-950 block">Đang phát sóng thông báo:</span>
                <p className="text-slate-700 mt-0.5 line-clamp-2">{currentAnnouncement}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 font-bold text-[11px] shrink-0 flex items-center gap-1 shadow-2xs transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Gỡ Bỏ</span>
            </button>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-300" />
            <span>Hiện tại không có thông báo khẩn nào đang phát sóng.</span>
          </div>
        )}

        {/* Quick Presets */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-2">Mẫu thông báo khẩn soạn sẵn (Bấm chọn nhanh):</label>
          <div className="grid grid-cols-2 gap-2">
            {presets.map((p, idx) => {
              const Icon = p.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2 hover:opacity-90 transition-all ${p.color}`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-bold truncate">{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Broadcast Form */}
        <form onSubmit={handleSend} className="space-y-3.5 text-xs">
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">Tiêu đề thông báo khẩn</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: THÔNG BÁO GIAO HOA THỜI TIẾT MƯA BÃO..."
              className="glass-input w-full text-xs py-2.5 rounded-xl font-bold uppercase text-slate-900"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">Nội dung chi tiết thông báo</label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập nội dung hiển thị cho toàn bộ khách hàng và shipper..."
              className="glass-input w-full text-xs py-2.5 rounded-xl text-slate-800 leading-relaxed"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Phân loại thông báo</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as AppNotification['type'])}
                className="glass-input w-full text-xs py-2 rounded-xl font-medium"
              >
                <option value="SYSTEM">Hệ Thống / Cảnh Báo Vận Hành</option>
                <option value="PROMO">Khuyến Mãi / Sự Kiện Đặc Biệt</option>
                <option value="ORDER_STATUS">Trạng Thái Đơn Hàng Chung</option>
              </select>
            </div>
          </div>

          {successNotice && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Đã phát sóng thông báo khẩn tới toàn bộ khách hàng thành công!</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold"
            >
              Đóng
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Phát Thông Báo Ngay</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
