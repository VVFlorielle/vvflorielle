import React, { useState } from 'react';
import { Gift, Smartphone, CheckCircle2, Download, Share2, Copy, Check, ExternalLink } from 'lucide-react';
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
  const [platform, setPlatform] = useState<'android' | 'ios'>('android');
  const [copied, setCopied] = useState(false);
  const { showToast } = useStore();

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://vvflorielle.pages.dev');
    setCopied(true);
    showToast('Đã sao chép đường dẫn: https://vvflorielle.pages.dev', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center mx-auto mb-2 shadow-md shrink-0">
          <Smartphone className="w-6 h-6" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10.5px] font-bold">
          <span>Phiên bản v1.0.0</span>
          <span className="w-1 h-1 rounded-full bg-emerald-500" />
          <span>Android APK &amp; iOS PWA</span>
        </div>
        <h3 className="font-extrabold text-lg text-slate-900 tracking-tight">
          Cài Đặt App V&amp;V Florielle
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Đặt hoa siêu tốc, theo dõi tiến độ cắm hoa theo thời gian thực và nhận thông báo tích điểm VIP
        </p>
      </div>

      {/* Tabs chuyển đổi Android vs iPhone (iOS) */}
      <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200">
        <button
          type="button"
          onClick={() => setPlatform('android')}
          className={`py-2 px-3 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
            platform === 'android'
              ? 'bg-white text-emerald-900 shadow-sm border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>🤖 Android (File APK)</span>
        </button>

        <button
          type="button"
          onClick={() => setPlatform('ios')}
          className={`py-2 px-3 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
            platform === 'ios'
              ? 'bg-white text-emerald-900 shadow-sm border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>🍏 iPhone (iOS WebClip)</span>
        </button>
      </div>

      {platform === 'android' ? (
        // ==================== TAB 1: ANDROID APK DIRECT ====================
        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5 text-xs text-slate-700">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="font-semibold text-slate-600">Dung lượng bộ cài:</span>
              <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg">Chỉ 0.85 MB</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="font-semibold text-slate-600">Hệ điều hành tương thích:</span>
              <span className="font-bold text-slate-800">Android 7.0 trở lên</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-600">Bảo mật ứng dụng:</span>
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Ký số an toàn 100% (Signed APK)</span>
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <a
              href="/VVFlorielle.apk"
              download="VVFlorielle.apk"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/25 transition-all cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Tải Xuống Trực Tiếp (VVFlorielle.apk - 0.85MB)</span>
            </a>
            <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/70 text-[11px] text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <span>💡 3 Bước Cài Đặt Trên Điện Thoại Android:</span>
              </div>
              <ol className="list-decimal list-inside space-y-0.5 text-amber-800">
                <li>Bấm nút xanh ở trên để tải file <code>VVFlorielle.apk</code> về máy.</li>
                <li>Mở file từ thanh thông báo hoặc thư mục Tải về (Download).</li>
                <li>Chọn <em>"Cài đặt"</em> (nếu máy hỏi, bật <em>"Cho phép từ nguồn này"</em>).</li>
              </ol>
            </div>
          </div>
        </div>
      ) : (
        // ==================== TAB 2: IPHONE / IOS PWA WEBCLIP GUIDE ====================
        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-950 space-y-2">
            <div className="font-extrabold text-sm text-emerald-900 flex items-center gap-1.5">
              <span>📱 Hướng Dẫn Cài Đặt Trên iPhone (Không Cần App Store)</span>
            </div>
            <p className="text-[11.5px] text-emerald-800 leading-relaxed">
              Apple không cho cài file APK trực tiếp. Tuy nhiên, bạn có thể thêm V&amp;V Florielle làm ứng dụng chính thức lên màn hình chính iPhone chỉ trong 10 giây bằng công nghệ Apple WebClip:
            </p>
          </div>

          {/* Các bước trên iPhone */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs text-slate-800">
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">1</span>
              <div>
                <span className="font-bold text-slate-900">Mở Safari:</span>
                <p className="text-[11px] text-slate-600 mt-0.5">Mở trình duyệt <strong>Safari</strong> trên iPhone và truy cập: <code className="bg-slate-200 px-1 py-0.5 rounded text-[10px]">vvflorielle.pages.dev</code></p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">2</span>
              <div>
                <span className="font-bold text-slate-900">Bấm nút Chia sẻ:</span>
                <p className="text-[11px] text-slate-600 mt-0.5">Nhấn vào biểu tượng <strong>Chia sẻ (Share <Share2 className="w-3 h-3 inline text-sky-600" />)</strong> ở thanh công cụ dưới đáy màn hình Safari.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">3</span>
              <div>
                <span className="font-bold text-slate-900">Thêm vào Màn hình chính:</span>
                <p className="text-[11px] text-slate-600 mt-0.5">Cuộn menu tìm và chọn <strong>"Thêm vào MH chính" (Add to Home Screen)</strong> rồi bấm <strong>"Thêm" (Add)</strong> ở góc trên bên phải.</p>
              </div>
            </div>
          </div>

          {/* Ưu điểm & Nút Sao chép Link */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-md"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã Sao Chép Link!' : 'Sao Chép Link Mở Safari'}</span>
            </button>

            <a
              href="https://vvflorielle.pages.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs flex items-center justify-center gap-1 transition-all"
            >
              <span>Mở Web</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <p className="text-[10px] text-center text-slate-400">
            ✨ Biểu tượng V&amp;V Florielle sẽ xuất hiện trên màn hình iPhone, mở ứng dụng tràn viền toàn màn hình không thanh địa chỉ như app App Store!
          </p>
        </div>
      )}
    </div>
  );
};
