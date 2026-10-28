import React from 'react';
import { Phone, Mail, MapPin, Clock, Heart, ShieldAlert } from 'lucide-react';

export default function Footer({ onOpenAdmin }) {
  return (
    <footer className="glass-panel rounded-3xl p-6 sm:p-8 mt-12 text-xs text-slate-600 border border-white/70 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Cột 1: Thông tin tiệm */}
        <div className="space-y-2">
          <div className="text-base font-black text-slate-800 tracking-tight">
            HOA TƯƠI LINH PHƯƠNG
          </div>
          <p className="text-slate-500 leading-relaxed">
            Chuyên cung cấp hoa tươi khai trương, hoa sinh nhật, lan hồ điệp và hoa thiết kế theo yêu cầu tại TP. Hồ Chí Minh. Cam kết hoa tươi nhập mới mỗi ngày, giao hoa đúng giờ và gửi ảnh thật trước khi giao.
          </p>
          <div className="flex items-center gap-1.5 text-rose-600 font-semibold pt-1">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>Trao trọn yêu thương, vẹn tròn cảm xúc</span>
          </div>
        </div>

        {/* Cột 2: Thông tin liên hệ */}
        <div className="space-y-2">
          <div className="font-bold text-slate-800 text-sm">Liên Hệ & Đặt Hoa Nhanh</div>
          <div className="space-y-1.5 text-slate-600">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>43/19/4 Đường số 21, Phường 8, Gò Vấp, TP. Hồ Chí Minh</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-rose-500 shrink-0" />
              <span>Hotline / Zalo: 0906.721.442 - 0908.251.586</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-rose-500 shrink-0" />
              <span>Email: hoatuoilinhphuong@gmail.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-500 shrink-0" />
              <span>Giờ mở cửa: 06:00 - 22:00 (Cả ngày Lễ & Chủ Nhật)</span>
            </div>
          </div>
        </div>

        {/* Cột 3: Cam kết & Chính sách */}
        <div className="space-y-2">
          <div className="font-bold text-slate-800 text-sm">Chính Sách Khách Hàng</div>
          <ul className="space-y-1 text-slate-600 list-disc list-inside">
            <li>Miễn phí giao hoa nội thành TP.HCM (đơn từ 500k)</li>
            <li>Giao hỏa tốc trong 60 - 90 phút</li>
            <li>Chụp ảnh thành phẩm gửi khách duyệt qua Zalo trước khi giao</li>
            <li>Đổi trả hoặc cắm lại 100% nếu hoa bị héo dập khi vận chuyển</li>
            <li>Tặng kèm thiệp thiết kế & banner in màu nghệ thuật</li>
          </ul>

          <div className="pt-2">
            <button
              onClick={onOpenAdmin}
              className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors"
            >
              <ShieldAlert className="w-3 h-3" />
              <span>Cổng quản trị nội bộ chủ quán (Admin Portal)</span>
            </button>
          </div>
        </div>

      </div>

      <div className="border-t border-slate-200/50 pt-4 text-center text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <span>© 2026 Hoa Tươi Linh Phương. All rights reserved.</span>
        <span>Thiết kế giao diện Bóng Kính Glassmorphism • Tối ưu Web & WebView</span>
      </div>
    </footer>
  );
}
