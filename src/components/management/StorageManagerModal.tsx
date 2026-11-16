import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  HardDrive,
  Cloud,
  RefreshCw,
  Download,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Settings,
  Sparkles
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useBodyScrollLock } from '../../utils/scrollLock';
import { GOOGLE_APPS_SCRIPT_TEMPLATE, extractDriveFolderId } from '../../utils/googleDriveArchiver';

interface StorageManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StorageManagerModal: React.FC<StorageManagerModalProps> = ({ isOpen, onClose }) => {
  useBodyScrollLock(isOpen);

  const {
    settings,
    updateSettings,
    orders,
    getStorageUsageStats,
    archiveExpiredOrdersBills,
    exportBillsBackup,
    showToast
  } = useStore();

  const [stats, setStats] = useState(() => getStorageUsageStats());
  const [retentionDays, setRetentionDays] = useState<number>(settings.billArchiveRetentionDays || 7);
  const [autoPurge, setAutoPurge] = useState<boolean>(settings.autoPurgeLocalBase64Enabled ?? true);
  const [autoArchiveToDrive, setAutoArchiveToDrive] = useState<boolean>(settings.autoArchiveToDriveEnabled ?? true);
  const [webhookUrl, setWebhookUrl] = useState<string>(settings.googleDriveWebhookUrl || '');
  const [folderUrl, setFolderUrl] = useState<string>(settings.googleDriveFolderUrl || '');
  const [isCopied, setIsCopied] = useState(false);
  const [showScriptGuide, setShowScriptGuide] = useState(false);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStats(getStorageUsageStats());
      setRetentionDays(settings.billArchiveRetentionDays || 7);
      setAutoPurge(settings.autoPurgeLocalBase64Enabled ?? true);
      setAutoArchiveToDrive(settings.autoArchiveToDriveEnabled ?? true);
      setWebhookUrl(settings.googleDriveWebhookUrl || '');
      setFolderUrl(settings.googleDriveFolderUrl || '');
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const handleSaveSettings = () => {
    const extractedId = extractDriveFolderId(folderUrl);
    updateSettings({
      ...settings,
      billArchiveRetentionDays: retentionDays,
      autoPurgeLocalBase64Enabled: autoPurge,
      autoArchiveToDriveEnabled: autoArchiveToDrive,
      googleDriveWebhookUrl: webhookUrl.trim(),
      googleDriveFolderUrl: folderUrl.trim(),
      googleDriveFolderId: extractedId || undefined
    });
    showToast('Đã lưu cấu hình lưu trữ & đồng bộ Google Drive!', 'success');
  };

  const handleManualPurge = () => {
    const { archivedCount, freedBytes } = archiveExpiredOrdersBills(retentionDays);
    setStats(getStorageUsageStats());
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_TEMPLATE);
    setIsCopied(true);
    showToast('Đã sao chép toàn bộ mã Google Apps Script!', 'success');
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleTestWebhook = async () => {
    if (!webhookUrl.trim() || !webhookUrl.startsWith('http')) {
      showToast('Vui lòng nhập URL Webhook Google Apps Script hợp lệ!', 'error');
      return;
    }

    setIsTestingWebhook(true);
    try {
      // Send a ping test with tiny 1x1 dummy base64
      const testPayload = {
        orderId: 'TEST-PING',
        senderPhone: '0906721442',
        orderDate: new Date().toISOString(),
        base64Image: 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA=='
      };

      const res = await fetch(webhookUrl.trim(), {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(testPayload)
      });
      const data = await res.json();
      if (data.success) {
        showToast('Kết nối Google Drive thành công! Ảnh thử nghiệm đã tạo trong Drive.', 'success');
      } else {
        showToast(`Kết nối thất bại: ${data.error || 'Kiểm tra quyền truy cập Web App'}`, 'error');
      }
    } catch (err: any) {
      showToast(`Không thể kết nối tới URL Webhook: ${err.message}`, 'error');
    } finally {
      setIsTestingWebhook(false);
    }
  };

  return createPortal(
    <div
      className="glass-overlay z-[100050]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="glass-panel w-full max-w-lg md:max-w-2xl bg-white/95 backdrop-blur-2xl rounded-[32px] shadow-2xl border border-white/90 overflow-hidden flex flex-col max-h-[92dvh] sm:max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (Căn giữa chỉn chu) */}
        <div className="relative p-5 pb-3 border-b border-slate-100 shrink-0 bg-white/80 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer z-10"
            title="Đóng modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-xs mx-auto mb-1.5">
            <HardDrive className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider block mb-0.5">
            TỐI ƯU HÓA HẠ TẦNG WEB
          </span>
          <h3 className="font-extrabold text-base text-slate-800 tracking-tight">
            Quản Lý Bộ Nhớ &amp; Lưu Trữ Google Drive
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Theo dõi dung lượng cache ảnh bill và đồng bộ lưu trữ đám mây tự động
          </p>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 text-xs space-y-4 no-scrollbar">
          {/* 1. Storage Consumption Gauge */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Cloud className="w-4 h-4 text-emerald-600" />
                <span>Dung lượng bộ nhớ Web (localStorage):</span>
              </span>
              <strong className="text-slate-900 font-mono text-sm">
                {stats.usedFormatted} / {stats.totalCapacityFormatted}
              </strong>
            </div>

            {/* Visual Bar */}
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  stats.percentage < 60
                    ? 'bg-emerald-500'
                    : stats.percentage < 85
                    ? 'bg-amber-500'
                    : 'bg-rose-600'
                }`}
                style={{ width: `${Math.max(5, stats.percentage)}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Tỷ lệ sử dụng</span>
                <strong className="text-xs font-black text-slate-800">{stats.percentage}%</strong>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Biên lai trên web</span>
                <strong className="text-xs font-black text-purple-700">{stats.billImagesCount} ảnh</strong>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Đã giải phóng</span>
                <strong className="text-xs font-black text-emerald-700">{stats.archivedBillsCount} đơn</strong>
              </div>
            </div>
          </div>

          {/* 2. Retention Configuration (Hot vs Cold Storage) */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <div className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
              <Settings className="w-4 h-4 text-purple-600" />
              <span>Cấu hình tự động dọn dẹp &amp; phân tầng dữ liệu:</span>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block">
                    Thời gian giữ ảnh biên lai trên web:
                  </label>
                  <p className="text-[10px] text-slate-400">
                    Đơn hoàn tất sau số ngày này sẽ được chuyển sang Google Drive và xóa chuỗi ảnh base64 trên web
                  </p>
                </div>
                <select
                  value={retentionDays}
                  onChange={(e) => setRetentionDays(parseInt(e.target.value, 10))}
                  className="glass-input text-xs py-1.5 px-3 rounded-xl font-bold bg-purple-50 text-purple-900 border border-purple-200"
                >
                  <option value={5}>5 ngày</option>
                  <option value={7}>7 ngày (Khuyên dùng)</option>
                  <option value={10}>10 ngày</option>
                  <option value={15}>15 ngày</option>
                  <option value={30}>30 ngày</option>
                </select>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={autoPurge}
                  onChange={(e) => setAutoPurge(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-slate-700 font-medium">
                  Tự động dọn dẹp bộ nhớ định kỳ mỗi khi mở trang quản trị
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoArchiveToDrive}
                  onChange={(e) => setAutoArchiveToDrive(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-slate-700 font-medium">
                  Ưu tiên đồng bộ ảnh lên Google Drive trước khi giải phóng khỏi web
                </span>
              </label>
            </div>
          </div>

          {/* 3. Google Apps Script Webhook Configuration */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                <Cloud className="w-4 h-4 text-emerald-600" />
                <span>URL Webhook Google Drive (Google Apps Script):</span>
              </div>
              <button
                type="button"
                onClick={() => setShowScriptGuide(!showScriptGuide)}
                className="text-[11px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer"
              >
                <span>{showScriptGuide ? 'Ẩn hướng dẫn' : 'Xem hướng dẫn cài 60s'}</span>
                {showScriptGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://script.google.com/macros/s/.../exec"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="glass-input flex-1 text-xs py-2 px-3 rounded-xl font-mono"
                />
                <button
                  type="button"
                  disabled={isTestingWebhook || !webhookUrl.trim()}
                  onClick={handleTestWebhook}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-[11px] cursor-pointer shadow-xs disabled:opacity-50 shrink-0"
                >
                  {isTestingWebhook ? 'Đang test...' : 'Kiểm Tra'}
                </button>
              </div>

              {/* Optional Target Folder URL / ID */}
              <div className="pt-2 border-t border-slate-100">
                <label className="font-semibold text-slate-700 block text-[11px] mb-1">
                  Link chia sẻ thư mục Google Drive của bạn (Tùy chọn):
                </label>
                <input
                  type="text"
                  placeholder="https://drive.google.com/drive/folders/1ABC_XYZ... hoặc ID thư mục"
                  value={folderUrl}
                  onChange={(e) => setFolderUrl(e.target.value)}
                  className="glass-input w-full text-xs py-2 px-3 rounded-xl font-mono"
                />
                {extractDriveFolderId(folderUrl) ? (
                  <p className="text-[10px] text-emerald-700 mt-1 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>Đã nhận diện Thư mục ID: <code className="bg-emerald-100/70 text-emerald-900 px-1 py-0.2 rounded font-mono">{extractDriveFolderId(folderUrl)}</code>. Ảnh bill sẽ được tự động lưu vào thư mục này!</span>
                  </p>
                ) : folderUrl.trim() ? (
                  <p className="text-[10px] text-amber-700 mt-1 font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                    <span>Link chưa đúng định dạng thư mục Google Drive (cần chứa /folders/...).</span>
                  </p>
                ) : (
                  <p className="text-[10px] text-slate-400 mt-1">
                    Nếu để trống, hệ thống sẽ tự động tạo thư mục mang tên <strong>"V&V Florielle - Kho Biên Lai Cọc"</strong> trong Google Drive của bạn.
                  </p>
                )}
              </div>

              {/* Collapsible Script Setup Guide */}
              {showScriptGuide && (
                <div className="p-3 rounded-xl bg-purple-50/80 border border-purple-200 space-y-2.5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-900 text-xs">Mã Google Apps Script tự động tạo thư mục &amp; lưu bill:</span>
                    <button
                      type="button"
                      onClick={handleCopyScript}
                      className="px-2.5 py-1 rounded-lg bg-white border border-purple-300 text-purple-800 text-[10px] font-bold flex items-center gap-1 hover:bg-purple-100 cursor-pointer shadow-2xs"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{isCopied ? 'Đã chép mã!' : 'Sao chép mã'}</span>
                    </button>
                  </div>

                  <div className="text-[11px] text-purple-950 space-y-1 font-medium leading-relaxed">
                    <p>1. Truy cập <a href="https://script.google.com" target="_blank" rel="noreferrer" className="underline font-bold text-purple-700">script.google.com</a> (Gmail của tiệm hoa) $\rightarrow$ Tạo <strong>Dự án mới</strong>.</p>
                    <p>2. Xóa nội dung mặc định, bấm <strong>Sao chép mã</strong> ở trên và dán vào.</p>
                    <p>3. Bấm <strong>Triển khai (Deploy)</strong> $\rightarrow$ <strong>Tùy chọn triển khai mới (New deployment)</strong> $\rightarrow$ Chọn loại <strong>Ứng dụng web (Web app)</strong>.</p>
                    <p>4. Chọn <em>"Ai có quyền truy cập: Bất kỳ ai (Anyone)"</em> $\rightarrow$ Bấm <strong>Triển khai</strong> $\rightarrow$ Sao chép link dán vào ô URL bên trên.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 4. Manual Actions & Export */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleManualPurge}
                className="px-3.5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Quét &amp; Giải Phóng Bộ Nhớ Ngay</span>
              </button>

              <button
                type="button"
                onClick={exportBillsBackup}
                className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tải Bản Sao Lưu JSON</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleSaveSettings}
              className="btn-primary py-2 px-5 text-xs font-bold rounded-xl shadow-md cursor-pointer ml-auto"
            >
              Lưu Cấu Hình
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
