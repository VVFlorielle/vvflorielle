import React, { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  Truck,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
  Clock,
  Sparkles,
  Banknote,
  Lock,
  EyeOff,
  UserCheck
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface StorePolicyModalProps {
  onClose: () => void;
}

export const StorePolicyModal: React.FC<StorePolicyModalProps> = ({ onClose }) => {
  const { settings } = useStore();
  const [activeTab, setActiveTab] = useState<'purchase' | 'privacy'>('purchase');

  return (
    <div className="space-y-4 max-h-[85vh] overflow-y-auto pr-1 no-scrollbar text-slate-700">
      {/* Header Banner */}
      <div className="text-center space-y-1">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-1.5 shadow-sm border border-emerald-200 shrink-0">
          <FileText className="w-6 h-6" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10.5px] font-bold border border-emerald-200">
          <Sparkles className="w-3 h-3 text-emerald-600" />
          <span>V&amp;V Florielle Boutique Policy</span>
          <span className="text-slate-300">•</span>
          <span>Áp dụng từ 2026</span>
        </div>
        <h3 className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
          Chính Sách Bảo Mật Và Chính Sách Mua Hàng
        </h3>
        <p className="text-xs text-slate-500 max-w-lg mx-auto">
          Quy định chính thức nhằm đảm bảo quyền lợi minh bạch và bảo mật thông tin giữa khách hàng và tiệm hoa nghệ thuật{' '}
          <strong className="text-slate-800">{settings.name || 'V&V Florielle'}</strong>
        </p>
      </div>

      {/* 2 Tabs Switcher */}
      <div className="flex items-center justify-center gap-2 p-1 bg-slate-100/80 rounded-2xl border border-slate-200/80 max-w-md mx-auto">
        <button
          type="button"
          onClick={() => setActiveTab('purchase')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'purchase'
              ? 'bg-white text-emerald-800 shadow-xs border border-white'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Banknote className="w-3.5 h-3.5" />
          <span>Chính Sách Mua Hàng &amp; Cọc</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('privacy')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'privacy'
              ? 'bg-white text-emerald-800 shadow-xs border border-white'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Chính Sách Bảo Mật Thông Tin</span>
        </button>
      </div>

      {/* TAB 1: CHÍNH SÁCH MUA HÀNG & CỌC */}
      {activeTab === 'purchase' && (
        <div className="space-y-3.5 animate-in fade-in duration-200">
          {/* Điều 1: Quy định đặt cọc 50% */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/50 border border-emerald-200/80 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs sm:text-sm">
              <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-black shrink-0">
                1
              </div>
              <h4>Vì Sao Đơn Hoa Thiết Kế Cần Đặt Cọc 50%?</h4>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600 pl-8 leading-relaxed">
              <p>
                • <strong>Đặc thù hoa tươi cao cấp:</strong> Hoa tươi là sản phẩm chế tác thủ công theo yêu cầu (custom-made), có vòng đời ngắn và được nhập mới mỗi ngày.
              </p>
              <p>
                • <strong>Cam kết xuất kho &amp; cắm hoa:</strong> Ngay sau khi quý khách xác nhận đặt hàng, tiệm tiến hành cắt tỉa các cành hoa thượng hạng và nghệ nhân Florist bắt đầu cắm riêng cho quý khách.
              </p>
              <p>
                • Khoản cọc <strong>50% giá trị đơn hàng</strong> là cam kết bảo đảm chi phí nguyên vật liệu tươi sống và công cắm hoa của nghệ nhân.
              </p>
            </div>
          </div>

          {/* Điều 2: Chính sách hoàn hủy đơn */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs sm:text-sm">
              <div className="w-6 h-6 rounded-lg bg-slate-800 text-white flex items-center justify-center text-xs font-black shrink-0">
                2
              </div>
              <h4>Quy Định Khi Khách Hàng Yêu Cầu Hủy Đơn</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pl-8 pt-1">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                <div className="font-bold text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Chưa Cắm Hoa</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Trạng thái <em>Chờ duyệt</em> hoặc <em>Chờ cọc</em>: Quý khách được <strong>hoàn 100% tiền cọc</strong> trong vòng 30 phút.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 space-y-1 text-xs">
                <div className="font-bold text-amber-900 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Đang Cắm Hoa</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Florist đã cắt tỉa hoa: Hỗ trợ <strong>bảo lưu 50% tiền cọc</strong> cho đơn mua lần sau (hoặc khấu trừ chi phí phụ liệu đã sử dụng).
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200/60 space-y-1 text-xs">
                <div className="font-bold text-rose-900 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>Đã Xong / Đang Giao</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Mẫu hoa đã hoàn thiện 100% hoặc shipper đang trên đường: <strong>Không hoàn cọc</strong> vì hoa tươi không thể tái sử dụng.
                </p>
              </div>
            </div>
          </div>

          {/* Điều 3: Xử lý khi Giao Hàng Không Thành Công */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-amber-50/70 via-white to-orange-50/60 border border-amber-200/90 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-amber-950 font-bold text-xs sm:text-sm">
              <div className="w-6 h-6 rounded-lg bg-amber-600 text-white flex items-center justify-center text-xs font-black shrink-0">
                3
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-amber-700" />
                <h4>Quy Định Xử Lý Khi Giao Hàng Không Thành Công (Giao Thất Bại)</h4>
              </div>
            </div>
            <div className="space-y-2 text-xs text-slate-700 pl-8 leading-relaxed">
              <p>
                Trường hợp Shipper giao đến nơi nhưng không liên lạc được với người nhận (gọi tối thiểu 3 cuộc cách nhau 5-10 phút), sai địa chỉ hoặc người nhận từ chối nhận:
              </p>
              <div className="p-2.5 rounded-xl bg-white/90 border border-amber-200 space-y-1 text-[11.5px]">
                <p>
                  • <strong>Bảo quản lưu kho:</strong> Mẫu hoa sẽ được Shipper mang quay trở lại bảo quản tại phòng lạnh showroom V&amp;V Florielle trong thời gian <strong>12 - 24 giờ</strong>.
                </p>
                <p>
                  • <strong>Yêu cầu giao lại:</strong> Nếu quý khách đổi khung giờ hoặc giao lại, quý khách vui lòng <strong>thanh toán thêm phí vận chuyển phát sinh</strong> cho lượt giao thứ 2 của tài xế.
                </p>
                <p>
                  • <strong>Trường hợp hủy đơn sau khi giao không thành công:</strong> Tiệm sẽ <strong>giữ lại 50% tiền cọc</strong> để bù đắp giá trị hoa tươi đã xuất kho.
                </p>
                <p>
                  • <strong>Quy định hoàn tiền đối với đơn đã thanh toán 100%:</strong> Quý khách cần <strong>thanh toán toàn bộ chi phí vận chuyển thực tế</strong> đã phát sinh (chiều đi &amp; chiều về). Số tiền hoàn lại được tính theo công thức:
                  <br />
                  <span className="font-mono bg-amber-100/80 px-2 py-0.5 rounded text-amber-900 font-bold inline-block mt-1">
                    Tiền hoàn lại = Tổng tiền đã trả - (50% giá trị hoa + Phí vận chuyển đã giao)
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Điều 4: Cam kết chất lượng & Bảo hành 2 giờ */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs sm:text-sm">
              <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-black shrink-0">
                4
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h4>Cam Kết Đổi Trả &amp; Bảo Hành Hoa Trong 2 Giờ</h4>
              </div>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600 pl-8 leading-relaxed">
              <p>
                • <strong>Chụp ảnh Zalo trước khi giao:</strong> Tiệm luôn gửi ảnh thực tế hoàn thiện cho người đặt duyệt trước khi giao.
              </p>
              <p>
                • <strong>Bảo hành 1 đổi 1 tận nơi:</strong> Nếu hoa bị dập gãy, héo úa hoặc không đúng mẫu chốt do lỗi vận chuyển, V&amp;V Florielle cam kết <strong>đổi mới bó hoa khác 100%</strong> hoặc hoàn tiền ngay trong vòng 2 giờ.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CHÍNH SÁCH BẢO MẬT THÔNG TIN */}
      {activeTab === 'privacy' && (
        <div className="space-y-3.5 animate-in fade-in duration-200">
          {/* Mục 1: Mục đích thu thập */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-sky-50/70 via-white to-indigo-50/50 border border-sky-200/80 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-sky-950 font-bold text-xs sm:text-sm">
              <div className="w-6 h-6 rounded-lg bg-sky-600 text-white flex items-center justify-center text-xs font-black shrink-0">
                1
              </div>
              <h4>Mục Đích Thu Thập Dữ Liệu Cá Nhân</h4>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600 pl-8 leading-relaxed">
              <p>
                • Chúng tôi chỉ thu thập các thông tin cần thiết phục vụ cho việc chuẩn bị và bàn giao hoa tươi: <strong>Họ tên, Số điện thoại người đặt, Địa chỉ giao hàng, Số điện thoại người nhận và Lời chúc trên thiệp</strong>.
              </p>
              <p>
                • Dữ liệu email chỉ dùng để gửi biên nhận điện tử, thông báo trạng thái đơn hàng và mã OTP khôi phục mật khẩu.
              </p>
            </div>
          </div>

          {/* Mục 2: Cam kết không chia sẻ dữ liệu */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs sm:text-sm">
              <div className="w-6 h-6 rounded-lg bg-slate-800 text-white flex items-center justify-center text-xs font-black shrink-0">
                2
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h4>Cam Kết Bảo Mật 100% - Tuyệt Đối Không Tiết Lộ Cho Bên Thứ Ba</h4>
              </div>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600 pl-8 leading-relaxed">
              <p>
                • V&amp;V Florielle cam kết <strong>không bán, không chuyển nhượng, không chia sẻ</strong> thông tin khách hàng hoặc người nhận cho bất kỳ tổ chức hay cá nhân bên thứ ba nào vì mục đích quảng cáo/thương mại.
              </p>
              <p>
                • Thông tin số điện thoại người nhận chỉ được cung cấp duy nhất cho tài xế giao hoa (Shipper) của tiệm trong quá trình liên hệ bàn giao đơn.
              </p>
            </div>
          </div>

          {/* Mục 3: Tặng hoa ẩn danh & Quyền riêng tư */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-purple-50/70 via-white to-pink-50/50 border border-purple-200/80 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-purple-950 font-bold text-xs sm:text-sm">
              <div className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center text-xs font-black shrink-0">
                3
              </div>
              <div className="flex items-center gap-1.5">
                <EyeOff className="w-4 h-4 text-purple-700" />
                <h4>Đặc Quyền Tặng Hoa Ẩn Danh (Giữ Kín Danh Tính Người Gửi)</h4>
              </div>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600 pl-8 leading-relaxed">
              <p>
                • Nếu quý khách có yêu cầu <strong>tặng hoa bí mật / ẩn danh</strong>, tiệm sẽ hoàn toàn bảo mật danh tính người đặt trên phiếu giao hàng và căn dặn shipper tuyệt đối không tiết lộ tên người tặng khi người nhận gặng hỏi.
              </p>
            </div>
          </div>

          {/* Mục 4: An toàn giao dịch VietQR */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs sm:text-sm">
              <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-black shrink-0">
                4
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-600" />
                <h4>Bảo Mật Giao Dịch Chuyển Khoản Ngân Hàng</h4>
              </div>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600 pl-8 leading-relaxed">
              <p>
                • Giao dịch quét mã <strong>VietQR</strong> được thực hiện trực tiếp giữa ứng dụng Mobile Banking của quý khách và cổng thanh toán liên ngân hàng Napas.
              </p>
              <p>
                • Hệ thống của tiệm hoàn toàn <strong>không lưu trữ mật khẩu, mã OTP hay thông tin thẻ ngân hàng</strong> của quý khách, bảo đảm mức an toàn tuyệt đối.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hotline Support & Action */}
      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 text-xs">
          <PhoneCall className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-slate-600">
            Hỗ trợ giải đáp chính sách: <strong className="text-emerald-700">{settings.hotline}</strong> (06:30 - 21:30)
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-full sm:w-auto px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm cursor-pointer transition-colors"
        >
          Đã Hiểu Chính Sách
        </button>
      </div>
    </div>
  );
};
