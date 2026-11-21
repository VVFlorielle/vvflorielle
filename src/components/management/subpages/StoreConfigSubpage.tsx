import React, { useState } from 'react';
import {
  Save,
  Share2,
  Plus,
  Trash2,
  Pencil,
  ExternalLink,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  Coins,
  CloudRain,
  Moon,
  Sun,
  AlertTriangle,
  Bot
} from 'lucide-react';
import { ShopSettings, ContactChannel } from '../../../types';
import { ActionConfirmModal } from '../ManagementModals';

interface StoreConfigSubpageProps {
  settings: ShopSettings;
  contactChannels: ContactChannel[];
  onBackToDashboard: () => void;
  onSaveSettings: (settings: ShopSettings) => void;
  onToggleContactChannel: (id: string) => void;
  onDeleteContactChannel: (id: string) => void;
  onOpenAddChannel: () => void;
  onOpenEditChannel?: (channel: ContactChannel) => void;
  title?: string;
}

export const StoreConfigSubpage: React.FC<StoreConfigSubpageProps> = ({
  settings,
  contactChannels,
  onBackToDashboard,
  onSaveSettings,
  onToggleContactChannel,
  onDeleteContactChannel,
  onOpenAddChannel,
  onOpenEditChannel,
  title = 'Cấu Hình Cửa Hàng, Bảng Cước & Bản Đồ'
}) => {
  const [editSettings, setEditSettings] = useState<ShopSettings>(settings);
  const [channelToDelete, setChannelToDelete] = useState<ContactChannel | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(editSettings);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header căn giữa chuẩn Phototiinlove kèm nút Trở về Bàn Làm Việc */}
      <div className="relative flex items-center justify-between min-h-[44px] pb-3 border-b border-slate-200/80">
        <button
          type="button"
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 font-bold text-xs border border-slate-200/80 transition-all cursor-pointer shrink-0"
          title="Quay về bàn làm việc quản trị"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Bàn làm việc</span>
        </button>
        <div className="text-center mx-auto px-2">
          <small className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
            CẤU HÌNH HỆ THỐNG
          </small>
          <h2 className="font-extrabold text-sm sm:text-lg text-slate-900 tracking-tight">
            {title}
          </h2>
        </div>
        <div className="w-10 sm:w-28 shrink-0" />
      </div>

      {/* 1. Main Store Configuration Form */}
      <form onSubmit={handleSubmit} className="glass-panel p-4 sm:p-6 space-y-5 rounded-[28px]">
        <div className="border-b border-slate-200 pb-3">
          <h3 className="font-bold text-base text-slate-800">Cấu Hình Cửa Hàng V&amp;V Florielle</h3>
          <p className="text-xs text-slate-500">
            Thông tin liên hệ tại 105 Doãn Kế Thiện, tài khoản ngân hàng và chính sách giao hoa
          </p>
        </div>

        <div className="space-y-3.5 text-xs">
          {/* Nhóm 1: Tên thương hiệu & Khẩu hiệu (2 cột) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Tên thương hiệu</label>
              <input
                type="text"
                value={editSettings.name}
                onChange={(e) => setEditSettings({ ...editSettings, name: e.target.value })}
                className="glass-input w-full text-xs py-2 rounded-xl"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Khẩu hiệu / Slogan</label>
              <input
                type="text"
                value={editSettings.slogan}
                onChange={(e) => setEditSettings({ ...editSettings, slogan: e.target.value })}
                className="glass-input w-full text-xs py-2 rounded-xl"
              />
            </div>
          </div>

          {/* Nhóm 2: Hotline & Zalo (2 cột song song ngay trên Mobile) */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Hotline tư vấn</label>
              <input
                type="text"
                value={editSettings.hotline}
                onChange={(e) => setEditSettings({ ...editSettings, hotline: e.target.value })}
                className="glass-input w-full text-xs py-2 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Số Zalo đặt hoa</label>
              <input
                type="text"
                value={editSettings.zalo}
                onChange={(e) => setEditSettings({ ...editSettings, zalo: e.target.value })}
                className="glass-input w-full text-xs py-2 rounded-xl font-mono"
              />
            </div>
          </div>

          {/* Nhóm 3: Email & Khung giờ mở cửa (2 cột song song) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Email tiệm gửi hóa đơn/OTP</label>
              <input
                type="email"
                value={editSettings.email}
                onChange={(e) => setEditSettings({ ...editSettings, email: e.target.value })}
                className="glass-input w-full text-xs py-2 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Khung giờ mở cửa hàng ngày</label>
              <input
                type="text"
                value={editSettings.openingHours || '07:30 - 22:00'}
                onChange={(e) => setEditSettings({ ...editSettings, openingHours: e.target.value })}
                placeholder="VD: 07:30 - 22:00"
                className="glass-input w-full text-xs py-2 rounded-xl font-mono"
              />
            </div>
          </div>

          {/* Nhóm 4: Địa chỉ Showroom & Trạng thái hoạt động */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
            <div className="sm:col-span-2">
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Địa chỉ Showroom (Trụ sở chính)</label>
              <input
                type="text"
                value={editSettings.address}
                onChange={(e) => setEditSettings({ ...editSettings, address: e.target.value })}
                className="glass-input w-full text-xs py-2 rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Trạng thái tiệm</label>
              <select
                value={editSettings.storeOperationalStatus || 'AUTO'}
                onChange={(e) => setEditSettings({ ...editSettings, storeOperationalStatus: e.target.value as any })}
                className="glass-input w-full text-xs py-2 rounded-xl font-semibold"
              >
                <option value="AUTO">⚡ Tự động theo giờ</option>
                <option value="OPEN">🟢 Mở Cửa</option>
                <option value="BREAK">🟠 Tạm Nghỉ</option>
                <option value="CLOSED">🔴 Đóng Cửa</option>
              </select>
            </div>
          </div>

          {/* Protected Bank & VietQR Redirection Notice */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-emerald-500/10 border border-amber-300/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                <span className="p-1 rounded-lg bg-amber-500/20 text-amber-700">🔒</span>
                <span>Tài Khoản Nhận Chuyển Khoản &amp; Mã QR Đã Được Khóa Bảo Vệ Cấp Cao</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed max-w-xl">
                Để ngăn ngừa triệt để nguy cơ tài khoản nhận tiền bị thay đổi trái phép khi mất quyền quản trị, mục cấu hình STK ngân hàng và mã VietQR đã được chuyển toàn bộ vào <strong>Phân hệ Bảo Mật Hệ Thống</strong> (yêu cầu xác thực bảo vệ cấp 2).
              </p>
            </div>
            <div className="text-[11px] font-mono text-emerald-800 bg-emerald-100/90 px-3 py-2 rounded-xl shrink-0 font-bold border border-emerald-300 shadow-2xs">
              {settings.bankName || 'Ngân hàng'} • {settings.bankAccount || 'Chưa thiết lập'}
            </div>
          </div>

          {/* Advanced Store Settings: Domain, Distance Shipping & Assistant (2 CỘT GỌN GÀNG) */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
            <h4 className="font-bold text-xs text-slate-800">Cấu Hình Tên Miền Riêng, Vận Chuyển &amp; Trợ Lý AI</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
              <div className="col-span-2 sm:col-span-1">
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Tên miền thương hiệu</label>
                <input
                  type="text"
                  value={editSettings.customDomain || ''}
                  onChange={(e) => setEditSettings({ ...editSettings, customDomain: e.target.value })}
                  placeholder="https://vvflorielle.vn"
                  className="glass-input w-full text-xs py-2 rounded-xl font-mono"
                />
              </div>
              <div className="col-span-2 sm:col-span-2">
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Thời gian giao hoa cam kết</label>
                <input
                  type="text"
                  value={editSettings.deliveryTimeEstimate || 'Từ 15 phút nội thành, 60 phút ngoại thành'}
                  onChange={(e) => setEditSettings({ ...editSettings, deliveryTimeEstimate: e.target.value })}
                  placeholder="Từ 15 phút nội thành, 60 phút ngoại thành"
                  className="glass-input w-full text-xs py-2 rounded-xl"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Phí km (đ/km)</label>
                <input
                  type="number"
                  step={1000}
                  value={editSettings.shippingFeePerKm}
                  onChange={(e) => setEditSettings({ ...editSettings, shippingFeePerKm: Number(e.target.value) })}
                  className="glass-input w-full text-xs py-2 rounded-xl font-mono"
                />
                <span className="text-[9px] text-slate-400 block mt-0.5">Ngoài 12km: 10.000đ/km</span>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Ngưỡng Freeship (đ)</label>
                <input
                  type="number"
                  step={50000}
                  value={editSettings.freeShipThreshold || 400000}
                  onChange={(e) => setEditSettings({ ...editSettings, freeShipThreshold: Number(e.target.value) })}
                  className="glass-input w-full text-xs py-2 rounded-xl font-mono"
                />
                <span className="text-[9px] text-slate-400 block mt-0.5">Mặc định: 400.000đ</span>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Bán kính Freeship (km)</label>
                <input
                  type="number"
                  min={1}
                  max={15}
                  value={editSettings.freeShipRadiusKm || 3}
                  onChange={(e) => setEditSettings({ ...editSettings, freeShipRadiusKm: Number(e.target.value) })}
                  className="glass-input w-full text-xs py-2 rounded-xl font-mono"
                />
                <span className="text-[9px] text-slate-400 block mt-0.5">&le; 3km quanh showroom</span>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">AI tự duyệt bill (phút)</label>
                <input
                  type="number"
                  min={1}
                  max={15}
                  value={editSettings.autoApproveWaitMinutes}
                  onChange={(e) => setEditSettings({ ...editSettings, autoApproveWaitMinutes: Number(e.target.value) })}
                  className="glass-input w-full text-xs py-2 rounded-xl font-mono"
                />
                <span className="text-[9px] text-slate-400 block mt-0.5">Chờ cắm hoa: 2 phút</span>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Cảnh báo hoa xa (km)</label>
                <input
                  type="number"
                  min={5}
                  max={100}
                  value={editSettings.warnDeliveryRadiusKm || 20}
                  onChange={(e) => setEditSettings({ ...editSettings, warnDeliveryRadiusKm: Number(e.target.value) })}
                  className="glass-input w-full text-xs py-2 rounded-xl font-mono"
                />
                <span className="text-[9px] text-slate-400 block mt-0.5">Khách cam kết tươi</span>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Giao tối đa (km)</label>
                <input
                  type="number"
                  min={10}
                  max={200}
                  value={editSettings.maxDeliveryRadiusKm || 50}
                  onChange={(e) => setEditSettings({ ...editSettings, maxDeliveryRadiusKm: Number(e.target.value) })}
                  className="glass-input w-full text-xs py-2 rounded-xl font-mono"
                />
                <span className="text-[9px] text-slate-400 block mt-0.5">Vượt mức gọi Hotline</span>
              </div>
            </div>

            {/* Deposit Policy & Financial Risk Controls */}
            <div className="pt-4 border-t border-slate-200/60 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Chính Sách Đặt Cọc &amp; Phòng Chống Gian Lận Bill VietQR</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Cấu hình tỷ lệ cọc bắt buộc, ngưỡng đơn áp dụng và cơ chế kiểm soát duyệt tiền chuyển khoản.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editSettings.depositRequired ?? true}
                      onChange={(e) => setEditSettings({ ...editSettings, depositRequired: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                  <span className="text-xs font-bold text-slate-800">
                    {editSettings.depositRequired !== false ? 'Bắt buộc cọc trước' : 'Không bắt cọc (COD 100%)'}
                  </span>
                </div>
              </div>

              {editSettings.depositRequired !== false ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-white/90 border border-slate-200/90 shadow-2xs">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Tỉ lệ đặt cọc đơn hàng
                    </label>
                    <div className="grid grid-cols-4 gap-1">
                      {[30, 50, 70, 100].map((rate) => {
                        const isSelected = (editSettings.depositRate ?? 50) === rate;
                        return (
                          <button
                            key={rate}
                            type="button"
                            onClick={() => setEditSettings({ ...editSettings, depositRate: rate })}
                            className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                              isSelected
                                ? 'bg-purple-700 text-white border-purple-700 shadow-xs'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {rate}%
                          </button>
                        );
                      })}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Khách cọc {editSettings.depositRate ?? 50}%, phần còn lại trả khi nhận hoa.
                    </span>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Ngưỡng đơn tối thiểu cần cọc (đ)
                    </label>
                    <input
                      type="number"
                      step={50000}
                      value={editSettings.minOrderForDeposit ?? 0}
                      onChange={(e) => setEditSettings({ ...editSettings, minOrderForDeposit: Number(e.target.value) })}
                      className="glass-input w-full text-xs py-2 rounded-xl font-mono"
                      placeholder="0 (Mọi đơn đều cần cọc)"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Đơn dưới mức này cho phép nhận hoa mới trả tiền (0đ = bắt buộc mọi đơn).
                    </span>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Chế độ duyệt cọc tự động
                    </label>
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="enableAutoApproveDepositToggle"
                        checked={editSettings.enableAutoApproveDeposit ?? false}
                        onChange={(e) =>
                          setEditSettings({ ...editSettings, enableAutoApproveDeposit: e.target.checked })
                        }
                        className="rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                      />
                      <label
                        htmlFor="enableAutoApproveDepositToggle"
                        className="text-xs font-bold text-slate-800 cursor-pointer"
                      >
                        Bật AI duyệt cọc tự động
                      </label>
                    </div>
                    {editSettings.geminiApiKey ? (
                      <span className="text-[10px] text-purple-700 font-semibold mt-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-purple-600 shrink-0" />
                        <span>Đã kết nối Google Gemini AI: Tự động đọc biên lai OCR &amp; duyệt cọc ngay lập tức khi khách tải ảnh lên.</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Chưa cấu hình API Key Gemini (Vào Quản trị &gt; Bảo mật cấp 2 để dán mã). Dự phòng: Hẹn giờ {editSettings.autoApproveWaitMinutes ?? 2} phút.
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Chính sách đang bật COD 100% cho mọi đơn: Khách hàng không cần thanh toán chuyển khoản trước khi tiệm cắm hoa.
                  </span>
                </div>
              )}

              {/* Security Advisory Callout */}
              <div
                className={`p-3.5 rounded-2xl border text-xs leading-relaxed flex items-start gap-3 ${
                  editSettings.enableAutoApproveDeposit
                    ? editSettings.geminiApiKey
                      ? 'bg-purple-50/90 border-purple-200 text-purple-950'
                      : 'bg-rose-50/90 border-rose-200 text-rose-900'
                    : 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
                }`}
              >
                {editSettings.enableAutoApproveDeposit ? (
                  editSettings.geminiApiKey ? (
                    <>
                      <Bot className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold text-purple-950 block mb-0.5">
                          🤖 Đang BẬT Trợ Lý Google Gemini AI Duyệt Cọc Tự Động:
                        </strong>
                        Khi khách hàng tải ảnh biên lai VietQR, mô hình Gemini Multimodal Vision sẽ quét ngay ảnh bill, trích xuất số tiền chuyển, ngân hàng và mã giao dịch. Nếu đủ tiền cọc (&gt;= 50%) và bill hợp lệ, hệ thống tự động duyệt sang <strong>Đang cắm hoa</strong>. Nếu số tiền không đủ hoặc ảnh bất thường, AI sẽ gửi cảnh báo và giữ lại cho chủ quán duyệt tay.
                      </div>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold text-rose-950 block mb-0.5">
                          ⚠️ Cảnh báo an toàn tài chính (Đang BẬT Tự Động Duyệt Cọc):
                        </strong>
                        Hệ thống sẽ tự động xác nhận đơn đã cọc tiền sau{' '}
                        <strong>{editSettings.autoApproveWaitMinutes ?? 2} phút</strong> ngay cả khi Chủ quán / Admin chưa
                        mở app ngân hàng Vietcombank để đối soát tiền thực. Chỉ nên bật khi tiệm quá tải đơn vào giờ cao
                        điểm và khách hàng là khách quen.
                      </div>
                    </>
                  )
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold text-emerald-900 block mb-0.5">
                        🛡️ Đang kích hoạt Chế Độ Kiểm Soát Chặt Chẽ (Khuyến nghị chuẩn):
                      </strong>
                      Mọi đơn hàng thanh toán cọc VietQR bắt buộc phải được Chủ quán hoặc Quản trị viên đối soát tài
                      khoản ngân hàng thực tế và bấm nút <strong>"Duyệt Cọc"</strong> trong Quản lý Đơn hàng trước khi
                      chuyển trạng thái sang cắm hoa. Đảm bảo triệt để 100% không bị bill giả mạo lừa gạt.
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Surcharges & Points Multiplier Card */}
            <div className="pt-4 border-t border-slate-200/60 space-y-4">
              <div>
                <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-amber-500" />
                  <span>Bảng Mức Phụ Phí Vận Hành &amp; Tỉ Lệ Tích Điểm Thưởng</span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  Tùy chỉnh định mức phụ thu thời tiết khắc nghiệt, ca giao đặc biệt và quy chế tích điểm cho khách.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 p-3.5 rounded-2xl bg-white/90 border border-slate-200/90 shadow-2xs">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 flex items-center gap-1 mb-1">
                    <CloudRain className="w-3.5 h-3.5 text-blue-500" />
                    <span>Phụ phí Mưa (đ)</span>
                  </label>
                  <input
                    type="number"
                    step={1000}
                    value={editSettings.rainSurcharge ?? 5000}
                    onChange={(e) => setEditSettings({ ...editSettings, rainSurcharge: Number(e.target.value) })}
                    className="glass-input w-full text-xs py-2 rounded-xl font-mono"
                  />
                  <span className="text-[10px] text-slate-400">Hỗ trợ bọc bạt che hoa</span>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 flex items-center gap-1 mb-1">
                    <CloudRain className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Phụ phí Rét lạnh (đ)</span>
                  </label>
                  <input
                    type="number"
                    step={1000}
                    value={editSettings.coldSurcharge ?? 5000}
                    onChange={(e) => setEditSettings({ ...editSettings, coldSurcharge: Number(e.target.value) })}
                    className="glass-input w-full text-xs py-2 rounded-xl font-mono"
                  />
                  <span className="text-[10px] text-slate-400">Giữ ấm cánh hoa tươi</span>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 flex items-center gap-1 mb-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                    <span>Phụ phí Bão gió (đ)</span>
                  </label>
                  <input
                    type="number"
                    step={1000}
                    value={editSettings.stormSurcharge ?? 10000}
                    onChange={(e) => setEditSettings({ ...editSettings, stormSurcharge: Number(e.target.value) })}
                    className="glass-input w-full text-xs py-2 rounded-xl font-mono"
                  />
                  <span className="text-[10px] text-slate-400">Giao hoa an toàn bão</span>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 flex items-center gap-1 mb-1">
                    <Moon className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Ca Đêm &gt;21h (đ)</span>
                  </label>
                  <input
                    type="number"
                    step={1000}
                    value={editSettings.nightShiftSurcharge ?? 10000}
                    onChange={(e) => setEditSettings({ ...editSettings, nightShiftSurcharge: Number(e.target.value) })}
                    className="glass-input w-full text-xs py-2 rounded-xl font-mono"
                  />
                  <span className="text-[10px] text-slate-400">Khung giờ 21:00 - 23:00</span>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 flex items-center gap-1 mb-1">
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>Ca Trưa 11h-13h (đ)</span>
                  </label>
                  <input
                    type="number"
                    step={1000}
                    value={editSettings.noonShiftSurcharge ?? 5000}
                    onChange={(e) => setEditSettings({ ...editSettings, noonShiftSurcharge: Number(e.target.value) })}
                    className="glass-input w-full text-xs py-2 rounded-xl font-mono"
                  />
                  <span className="text-[10px] text-slate-400">Khung giờ trưa gắt</span>
                </div>
              </div>

              {/* Point Earning Configuration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/70">
                <div>
                  <label className="text-[11px] font-bold text-amber-950 flex items-center gap-1 mb-1">
                    <Coins className="w-3.5 h-3.5 text-amber-600" />
                    <span>Mức chi tiêu quy đổi 1 điểm thưởng (đ)</span>
                  </label>
                  <input
                    type="number"
                    step={1000}
                    value={editSettings.pointsPerAmount ?? 10000}
                    onChange={(e) => setEditSettings({ ...editSettings, pointsPerAmount: Number(e.target.value) })}
                    className="glass-input w-full text-xs py-2 rounded-xl font-mono bg-white"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Mặc định 10.000đ = 1 điểm. Đơn 500.000đ tích được 50 điểm (~50.000đ khi đổi voucher).
                  </span>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-amber-950 flex items-center gap-1 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Hệ số nhân điểm sự kiện (Multiplier)</span>
                  </label>
                  <div className="flex gap-2">
                    {[1, 1.5, 2, 3].map((mul) => {
                      const isSel = (editSettings.pointsMultiplier ?? 1) === mul;
                      return (
                        <button
                          key={mul}
                          type="button"
                          onClick={() => setEditSettings({ ...editSettings, pointsMultiplier: mul })}
                          className={`flex-1 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                            isSel
                              ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                              : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-100/60'
                          }`}
                        >
                          x{mul}
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Chọn x2 vào các dịp lễ 14/2, 8/3, 20/10 để kích cầu khách đặt sớm.
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="voiceAlertsToggle"
                checked={editSettings.voiceAlertsEnabled}
                onChange={(e) => setEditSettings({ ...editSettings, voiceAlertsEnabled: e.target.checked })}
                className="rounded text-purple-700 focus:ring-purple-500 cursor-pointer"
              />
              <label htmlFor="voiceAlertsToggle" className="text-xs font-semibold text-slate-700 cursor-pointer">
                Bật âm thanh &amp; Giọng đọc AI nữ thông báo "Có đơn", "Đã duyệt cọc", "Cộng điểm"
              </label>
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="btn-primary text-xs py-2.5 px-6 rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>Lưu Thay Đổi Cấu Hình Tiệm</span>
            </button>
          </div>
        </div>
      </form>

      {/* 2. Contact Channels Management */}
      <div className="glass-panel p-5 sm:p-6 space-y-5 rounded-[28px]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-purple-700" />
              <span>Quản Lý Kênh Liên Hệ Đa Nền Tảng (Floating Contact Widget)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Các nút liên hệ nổi góc phải màn hình giúp khách hàng gọi hotline, chat Zalo, xem TikTok hoặc chỉ đường
              đến showroom tiệm hoa.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenAddChannel}
            className="btn-primary text-xs py-2 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Kênh Liên Hệ Mới</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {contactChannels.map((channel) => (
            <div
              key={channel.id}
              className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{channel.title || channel.label}</span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                      {channel.type}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 mt-1 font-mono">{channel.value}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 truncate max-w-xs">{channel.url || channel.link}</div>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleContactChannel(channel.id)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                    channel.isEnabled
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-slate-100 text-slate-500 border-slate-300'
                  }`}
                >
                  {channel.isEnabled ? 'Đang bật' : 'Đã tắt'}
                </button>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <a
                  href={channel.url || channel.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-purple-700 hover:text-purple-900 text-[11px] font-semibold flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Mở thử liên kết</span>
                </a>

                <div className="flex items-center gap-1.5">
                  {onOpenEditChannel && (
                    <button
                      type="button"
                      onClick={() => onOpenEditChannel(channel)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200/80 hover:border-purple-300 text-[11px] font-bold transition-all cursor-pointer"
                      title={`Chỉnh sửa nội dung kênh "${channel.title || channel.label}"`}
                    >
                      <Pencil className="w-3 h-3 text-purple-600" />
                      <span>Sửa</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setChannelToDelete(channel)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                    title="Xóa kênh"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* In-App Action Confirm Modal: No Browser Dialogs! */}
      <ActionConfirmModal
        isOpen={Boolean(channelToDelete)}
        onClose={() => setChannelToDelete(null)}
        onConfirm={() => {
          if (channelToDelete) {
            onDeleteContactChannel(channelToDelete.id);
            setChannelToDelete(null);
          }
        }}
        title="Xóa Kênh Liên Hệ"
        message={`Bạn có chắc muốn xóa kênh liên hệ "${channelToDelete?.title || channelToDelete?.label}"? Biểu tượng này sẽ không còn hiển thị trong widget liên hệ nổi.`}
        confirmText="Xóa Kênh"
        type="danger"
      />
    </div>
  );
};
