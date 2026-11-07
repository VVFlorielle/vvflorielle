import React, { useState } from 'react';
import { Megaphone, Plus, Edit3, Trash2, ArrowLeft } from 'lucide-react';
import { MarqueeItem } from '../../../types';
import { ActionConfirmModal } from '../ManagementModals';

interface MarqueeSubpageProps {
  marqueeAnnouncements: MarqueeItem[];
  onBackToDashboard: () => void;
  addMarqueeItem: (item: Omit<MarqueeItem, 'id'>) => void;
  updateMarqueeItem: (id: string, updates: Partial<MarqueeItem>) => void;
  toggleMarqueeItem: (id: string) => void;
  deleteMarqueeItem: (id: string) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  title?: string;
}

export const MarqueeSubpage: React.FC<MarqueeSubpageProps> = ({
  marqueeAnnouncements,
  onBackToDashboard,
  addMarqueeItem,
  updateMarqueeItem,
  toggleMarqueeItem,
  deleteMarqueeItem,
  showToast,
  title = 'Bảng Tin Chạy Chữ Khuyến Mãi Đỉnh Trang'
}) => {
  const [newMarqueeText, setNewMarqueeText] = useState('');
  const [newMarqueeTag, setNewMarqueeTag] = useState('ƯU ĐÃI');
  const [editingMarqueeId, setEditingMarqueeId] = useState<string | null>(null);
  const [editMarqueeText, setEditMarqueeText] = useState('');
  const [editMarqueeTag, setEditMarqueeTag] = useState('');
  const [marqueeToDelete, setMarqueeToDelete] = useState<MarqueeItem | null>(null);

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

      <div className="glass-panel p-5 sm:p-6 rounded-[28px] space-y-6 border border-purple-200/80 bg-white/80">
        {/* Header info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80">
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-purple-700" />
              <span>Quản Lý Bảng Tin Chạy &amp; Khuyến Mãi (Marquee Ticker)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Dòng chữ chạy liên tục ngay dưới thanh menu. Bật/tắt, thêm mới hoặc sửa dòng tin tức thì.
            </p>
          </div>
          <div className="text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200 self-start sm:self-auto">
            {marqueeAnnouncements.filter((m) => m.isEnabled).length} dòng tin đang chạy
          </div>
        </div>

        {/* Live Preview Box */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 block">Xem trước dòng chữ chạy thực tế:</label>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/90 overflow-hidden relative shadow-inner">
            <div className="flex items-center gap-6 whitespace-nowrap overflow-x-auto text-xs font-medium text-slate-700 py-1">
              {marqueeAnnouncements
                .filter((m) => m.isEnabled)
                .map((item) => (
                  <div key={item.id} className="inline-flex items-center gap-2 shrink-0">
                    {item.tag && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {item.tag}
                      </span>
                    )}
                    <span>{item.text}</span>
                    <span className="text-emerald-400 font-bold">•</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Form to Add New Marquee Announcement */}
        <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/80 space-y-3">
          <div className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-purple-700" />
            <span>Thêm Dòng Tin Chạy Mới</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-1">
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Thẻ nhãn (Tag)</label>
              <select
                value={newMarqueeTag}
                onChange={(e) => setNewMarqueeTag(e.target.value)}
                className="glass-input w-full text-xs py-2 px-3 rounded-xl border border-purple-200 bg-white"
              >
                <option value="ƯU ĐÃI">ƯU ĐÃI</option>
                <option value="CỬA HÀNG">CỬA HÀNG</option>
                <option value="HỘI VIÊN">HỘI VIÊN</option>
                <option value="GIAO HÀNG">GIAO HÀNG</option>
                <option value="THANH TOÁN">THANH TOÁN</option>
                <option value="HOT">HOT</option>
                <option value="THÔNG BÁO">THÔNG BÁO</option>
              </select>
            </div>
            <div className="sm:col-span-3">
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Nội dung dòng chữ chạy</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="VD: Tặng thiệp viết tay & nơ lụa cao cấp cho tất cả các đơn hoa khai trương, sinh nhật..."
                  value={newMarqueeText}
                  onChange={(e) => setNewMarqueeText(e.target.value)}
                  className="glass-input flex-1 text-xs py-2 px-3 rounded-xl border border-purple-200 bg-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!newMarqueeText.trim()) {
                      showToast('Vui lòng nhập nội dung dòng chữ chạy!', 'error');
                      return;
                    }
                    addMarqueeItem({
                      text: newMarqueeText.trim(),
                      tag: newMarqueeTag,
                      isEnabled: true,
                      order: marqueeAnnouncements.length + 1
                    });
                    setNewMarqueeText('');
                  }}
                  className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold shrink-0 shadow-sm transition-all cursor-pointer"
                >
                  Thêm Mới
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* List of Marquee Announcements */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-slate-700 block">
            Danh sách các dòng tin ({marqueeAnnouncements.length})
          </label>
          {marqueeAnnouncements.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
              Chưa có dòng tin nào. Hãy bấm "Thêm Mới" ở trên để tạo dòng tin đầu tiên.
            </div>
          ) : (
            marqueeAnnouncements.map((item, idx) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  item.isEnabled
                    ? 'bg-white border-slate-200 shadow-sm'
                    : 'bg-slate-50 border-slate-200/60 opacity-60'
                }`}
              >
                {editingMarqueeId === item.id ? (
                  /* Inline Edit Mode */
                  <div className="flex-1 space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      <input
                        type="text"
                        value={editMarqueeTag}
                        onChange={(e) => setEditMarqueeTag(e.target.value)}
                        placeholder="Tag (VD: ƯU ĐÃI)"
                        className="glass-input text-xs py-1.5 px-2.5 rounded-lg border border-purple-300"
                      />
                      <input
                        type="text"
                        value={editMarqueeText}
                        onChange={(e) => setEditMarqueeText(e.target.value)}
                        placeholder="Nội dung dòng tin"
                        className="glass-input sm:col-span-3 text-xs py-1.5 px-2.5 rounded-lg border border-purple-300"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (!editMarqueeText.trim()) return;
                          updateMarqueeItem(item.id, {
                            text: editMarqueeText.trim(),
                            tag: editMarqueeTag.trim()
                          });
                          setEditingMarqueeId(null);
                        }}
                        className="px-3 py-1 bg-purple-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Lưu thay đổi
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingMarqueeId(null)}
                        className="px-3 py-1 bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Display Mode */
                  <>
                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                      <span className="font-mono text-xs text-slate-400 font-bold shrink-0 mt-0.5">
                        #{idx + 1}
                      </span>
                      {item.tag && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 border border-purple-200 shrink-0">
                          {item.tag}
                        </span>
                      )}
                      <span className="text-xs text-slate-800 font-medium leading-relaxed">
                        {item.text}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {/* Toggle Switch */}
                      <button
                        type="button"
                        onClick={() => toggleMarqueeItem(item.id)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all border cursor-pointer ${
                          item.isEnabled
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                            : 'bg-slate-200 text-slate-600 border-slate-300 hover:bg-slate-300'
                        }`}
                        title="Bật hoặc tắt hiển thị dòng tin này"
                      >
                        {item.isEnabled ? 'Đang chạy' : 'Đã ẩn'}
                      </button>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setEditingMarqueeId(item.id);
                          setEditMarqueeText(item.text);
                          setEditMarqueeTag(item.tag || '');
                        }}
                        className="p-1.5 text-slate-400 hover:text-purple-700 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer"
                        title="Chỉnh sửa nội dung"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => setMarqueeToDelete(item)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Xóa dòng tin"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* In-App Action Confirm Modal: No Browser Dialogs! */}
      <ActionConfirmModal
        isOpen={Boolean(marqueeToDelete)}
        onClose={() => setMarqueeToDelete(null)}
        onConfirm={() => {
          if (marqueeToDelete) {
            deleteMarqueeItem(marqueeToDelete.id);
            setMarqueeToDelete(null);
          }
        }}
        title="Xóa Thông Báo Chạy Chữ"
        message={`Bạn có chắc muốn xóa dòng chữ chạy "${marqueeToDelete?.text}" khỏi thanh thông báo đỉnh trang không?`}
        confirmText="Xóa Dòng Tin"
        type="danger"
      />
    </div>
  );
};
