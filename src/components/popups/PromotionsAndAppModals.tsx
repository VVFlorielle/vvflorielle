import React from 'react';
import { Gift, Smartphone, CheckCircle2, Download } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface PromoModalProps {
  onClose: () => void;
}

// 1. Welcome Voucher Modal Content
export const VouchersModalContent: React.FC<PromoModalProps> = ({ onClose }) => {
  const { showToast } = useStore();

  return (
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
        <p className="text-[11px] text-slate-600">
          Miễn phí vận chuyển tối đa 30.000₫ cho đơn hoa từ 300.000₫. Đã kích hoạt trong ví voucher của hội viên mới!
        </p>
      </div>
      <button
        onClick={() => {
          navigator.clipboard.writeText('FREESHIP30K');
          showToast('Đã sao chép mã FREESHIP30K!', 'success');
          onClose();
        }}
        className="btn-primary w-full text-xs py-2.5 bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md cursor-pointer"
      >
        Sao chép mã &amp; Đặt hoa ngay
      </button>
    </div>
  );
};

// 2. Promotions List Modal Content
export const PromotionsModalContent: React.FC<PromoModalProps> = ({ onClose }) => {
  const { promotions, showToast } = useStore();

  return (
    <div className="space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-100 to-amber-100 text-rose-700 flex items-center justify-center mx-auto shadow-md shadow-rose-600/10 border border-rose-200/50 shrink-0">
        <Gift className="w-6 h-6" />
      </div>
      <div className="text-center">
        <h3 className="font-bold text-base text-slate-900 tracking-tight">Kho Voucher &amp; Ưu Đãi</h3>
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
              className="shrink-0 px-2.5 py-1 text-xs font-medium text-emerald-700 hover:text-white bg-emerald-50 hover:bg-emerald-600 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
            >
              Sao chép
            </button>
          </div>
        ))}
      </div>
      <button onClick={onClose} className="btn-primary w-full text-xs py-2.5 rounded-xl shadow-md cursor-pointer">
        Đóng
      </button>
    </div>
  );
};

// 3. App Download Modal Content
export const AppDownloadModalContent: React.FC<PromoModalProps> = () => {
  return (
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
          Cài Đặt App V&amp;V Florielle Trên Điện Thoại
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
  );
};
