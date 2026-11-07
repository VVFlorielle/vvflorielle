import React, { useState } from 'react';
import {
  Save,
  Share2,
  Plus,
  Trash2,
  Pencil,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Flower2,
  ArrowLeft
} from 'lucide-react';
import { ShopSettings, ContactChannel } from '../../../types';
import { AVAILABLE_MASCOTS, AVAILABLE_FLORAL_CORNERS } from '../../../data/mockData';
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
      {/* Header and Back Button */}
      <div className="flex items-center gap-3 pb-3 border-b border-slate-200/80">
        <button
          type="button"
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại Tổng Quan</span>
        </button>
        <h2 className="font-bold text-base sm:text-lg text-slate-800">{title}</h2>
      </div>

      {/* 1. Main Store Configuration Form */}
      <form onSubmit={handleSubmit} className="glass-panel p-5 sm:p-6 space-y-6 rounded-[28px]">
        <div className="border-b border-slate-200 pb-3">
          <h3 className="font-bold text-base text-slate-800">Cấu Hình Cửa Hàng V&amp;V Florielle</h3>
          <p className="text-xs text-slate-500">
            Thông tin liên hệ tại 105 Doãn Kế Thiện, tài khoản ngân hàng và chính sách giao hoa
          </p>
        </div>

        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Tên thương hiệu</label>
              <input
                type="text"
                value={editSettings.name}
                onChange={(e) => setEditSettings({ ...editSettings, name: e.target.value })}
                className="glass-input w-full text-xs py-2 rounded-xl"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Khẩu hiệu / Slogan</label>
              <input
                type="text"
                value={editSettings.slogan}
                onChange={(e) => setEditSettings({ ...editSettings, slogan: e.target.value })}
                className="glass-input w-full text-xs py-2 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Hotline tư vấn</label>
              <input
                type="text"
                value={editSettings.hotline}
                onChange={(e) => setEditSettings({ ...editSettings, hotline: e.target.value })}
                className="glass-input w-full text-xs py-2 rounded-xl"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Số Zalo đặt hoa</label>
              <input
                type="text"
                value={editSettings.zalo}
                onChange={(e) => setEditSettings({ ...editSettings, zalo: e.target.value })}
                className="glass-input w-full text-xs py-2 rounded-xl"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Email cửa hàng</label>
              <input
                type="email"
                value={editSettings.email}
                onChange={(e) => setEditSettings({ ...editSettings, email: e.target.value })}
                className="glass-input w-full text-xs py-2 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-500 block mb-1">Địa chỉ Showroom (Trụ sở chính)</label>
            <input
              type="text"
              value={editSettings.address}
              onChange={(e) => setEditSettings({ ...editSettings, address: e.target.value })}
              className="glass-input w-full text-xs py-2 rounded-xl font-medium"
            />
          </div>

          {/* Bank VietQR Info */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
            <h4 className="font-bold text-xs text-slate-800">Tài Khoản Nhận Chuyển Khoản VietQR</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Ngân hàng</label>
                <input
                  type="text"
                  value={editSettings.bankName}
                  onChange={(e) => setEditSettings({ ...editSettings, bankName: e.target.value })}
                  className="glass-input w-full text-xs py-2 rounded-xl"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Số tài khoản</label>
                <input
                  type="text"
                  value={editSettings.bankAccount}
                  onChange={(e) => setEditSettings({ ...editSettings, bankAccount: e.target.value })}
                  className="glass-input w-full text-xs py-2 font-mono rounded-xl"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Tên chủ tài khoản</label>
                <input
                  type="text"
                  value={editSettings.bankHolder}
                  onChange={(e) => setEditSettings({ ...editSettings, bankHolder: e.target.value })}
                  className="glass-input w-full text-xs py-2 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Advanced Store Settings: Domain, Distance Shipping & Assistant */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
            <h4 className="font-bold text-xs text-slate-800">Cấu Hình Tên Miền Riêng, Vận Chuyển &amp; Trợ Lý AI</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Tên miền thương hiệu</label>
                <input
                  type="text"
                  value={editSettings.customDomain || ''}
                  onChange={(e) => setEditSettings({ ...editSettings, customDomain: e.target.value })}
                  placeholder="https://vvflorielle.vn"
                  className="glass-input w-full text-xs py-2 rounded-xl font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Thời gian giao hoa cam kết</label>
                <input
                  type="text"
                  value={editSettings.deliveryTimeEstimate || 'Từ 15 phút nội thành, 60 phút ngoại thành'}
                  onChange={(e) => setEditSettings({ ...editSettings, deliveryTimeEstimate: e.target.value })}
                  placeholder="Từ 15 phút nội thành, 60 phút ngoại thành"
                  className="glass-input w-full text-xs py-2 rounded-xl"
                />
                <span className="text-[10px] text-slate-400">Đồng bộ lên tiêu đề, popups và trợ lý ảo</span>
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Phí vận chuyển theo km (đ/km)</label>
                <input
                  type="number"
                  step={1000}
                  value={editSettings.shippingFeePerKm}
                  onChange={(e) => setEditSettings({ ...editSettings, shippingFeePerKm: Number(e.target.value) })}
                  className="glass-input w-full text-xs py-2 rounded-xl font-mono"
                />
                <span className="text-[10px] text-slate-400">Mặc định 10.000đ/km (tính ngoài 12km)</span>
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Ngưỡng đơn Freeship (đ)</label>
                <input
                  type="number"
                  step={50000}
                  value={editSettings.freeShipThreshold || 400000}
                  onChange={(e) => setEditSettings({ ...editSettings, freeShipThreshold: Number(e.target.value) })}
                  className="glass-input w-full text-xs py-2 rounded-xl font-mono"
                />
                <span className="text-[10px] text-slate-400">Đơn từ mức này được Freeship trong bán kính</span>
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Bán kính áp dụng Freeship (km)</label>
                <input
                  type="number"
                  min={1}
                  max={15}
                  value={editSettings.freeShipRadiusKm || 3}
                  onChange={(e) => setEditSettings({ ...editSettings, freeShipRadiusKm: Number(e.target.value) })}
                  className="glass-input w-full text-xs py-2 rounded-xl font-mono"
                />
                <span className="text-[10px] text-slate-400">Mặc định bán kính &le; 3km quanh 105 Doãn Kế Thiện</span>
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Thời gian AI tự duyệt bill (phút)</label>
                <input
                  type="number"
                  min={1}
                  max={15}
                  value={editSettings.autoApproveWaitMinutes}
                  onChange={(e) => setEditSettings({ ...editSettings, autoApproveWaitMinutes: Number(e.target.value) })}
                  className="glass-input w-full text-xs py-2 rounded-xl font-mono"
                />
                <span className="text-[10px] text-slate-400">Nếu admin bận cắm hoa sau 2 phút, trợ lý tự duyệt</span>
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Bán kính cảnh báo hoa giảm tươi (km)</label>
                <input
                  type="number"
                  min={5}
                  max={100}
                  value={editSettings.warnDeliveryRadiusKm || 20}
                  onChange={(e) => setEditSettings({ ...editSettings, warnDeliveryRadiusKm: Number(e.target.value) })}
                  className="glass-input w-full text-xs py-2 rounded-xl font-mono"
                />
                <span className="text-[10px] text-slate-400">Vượt số km này khách phải tích cam kết chịu trách nhiệm</span>
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Bán kính giao hoa tối đa (km)</label>
                <input
                  type="number"
                  min={10}
                  max={200}
                  value={editSettings.maxDeliveryRadiusKm || 50}
                  onChange={(e) => setEditSettings({ ...editSettings, maxDeliveryRadiusKm: Number(e.target.value) })}
                  className="glass-input w-full text-xs py-2 rounded-xl font-mono"
                />
                <span className="text-[10px] text-slate-400">Vượt quá sẽ chặn đặt online &amp; chuyển sang gọi Hotline</span>
              </div>
            </div>

            {/* Mascot Selection */}
            <div className="pt-3 border-t border-slate-200/60 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Chọn Linh Vật Trợ Lý Ảo Flori (Bộ 6 Mẫu Tách Nền)</span>
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Bấm vào bất kỳ linh vật nào bên dưới để đặt làm linh vật hiển thị chính thức của tiệm hoa.
                  </p>
                </div>
                {editSettings.mascotImageUrl && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-800">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Đang chọn 1 mẫu</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                {AVAILABLE_MASCOTS.map((m) => {
                  const isSelected = editSettings.mascotImageUrl === m.url;
                  return (
                    <div
                      key={m.id}
                      onClick={() => setEditSettings({ ...editSettings, mascotImageUrl: m.url })}
                      className={`p-2.5 rounded-2xl border transition-all cursor-pointer text-center relative flex flex-col items-center justify-between ${
                        isSelected
                          ? 'bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-500/30 shadow-md'
                          : 'bg-white/80 hover:bg-white border-slate-200 hover:border-emerald-300 hover:shadow-sm'
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] flex items-center justify-center font-bold">
                          ✓
                        </span>
                      )}
                      <div className="w-16 h-16 flex items-center justify-center overflow-hidden mb-1">
                        <img
                          src={m.url}
                          alt={m.name}
                          className="w-full h-full object-contain filter drop-shadow-sm transition-transform hover:scale-110"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-800 line-clamp-1">{m.name}</span>
                      <span
                        className={`text-[9px] mt-1 px-2 py-0.5 rounded-full font-bold ${
                          isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {isSelected ? 'Đang dùng' : 'Chọn mẫu'}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-2 items-center pt-1">
                <input
                  type="text"
                  placeholder="Hoặc dán URL ảnh linh vật tùy chỉnh khác..."
                  value={editSettings.mascotImageUrl || ''}
                  onChange={(e) => setEditSettings({ ...editSettings, mascotImageUrl: e.target.value })}
                  className="glass-input flex-1 text-xs py-2 rounded-xl font-mono"
                />
                {editSettings.mascotImageUrl && (
                  <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                    <img src={editSettings.mascotImageUrl} alt="Preview" className="w-7 h-7 object-contain" />
                  </div>
                )}
              </div>
            </div>

            {/* Floral Corners Preview */}
            <div className="pt-3 border-t border-slate-200/60 space-y-2">
              <div>
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Flower2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>Bộ 4 Tệp Ảnh Hoa Góc Trang Trí (E:\VVFlorielle\public\images\floral\)</span>
                </label>
                <p className="text-[11px] text-slate-500">
                  Cụm hoa nghệ thuật chụp thực tế đã được tách nền trong suốt 100%, trang trí nhẹ nhàng quanh Hero Banner.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {AVAILABLE_FLORAL_CORNERS.map((fc) => (
                  <div
                    key={fc.id}
                    className="p-3 rounded-2xl bg-white/80 border border-slate-200 flex items-center gap-3 shadow-2xs"
                  >
                    <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                      <img src={fc.webpUrl} alt={fc.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-xs text-slate-900 truncate">{fc.name}</h5>
                      <p className="text-[10px] text-slate-500 font-mono truncate mt-0.5">{fc.webpUrl}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          Đã tách nền sạch 100%
                        </span>
                        <span className="text-[9px] text-slate-400">WebP + PNG</span>
                      </div>
                    </div>
                  </div>
                ))}
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
