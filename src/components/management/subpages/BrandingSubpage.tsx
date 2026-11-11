import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Save,
  RotateCcw,
  Palette,
  Image as ImageIcon,
  Type,
  CheckCircle2,
  Eye,
  Sliders,
  Flower2
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';

interface BrandingSubpageProps {
  onBackToDashboard: () => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
  title?: string;
}

export interface BrandingData {
  brandName: string;
  tagline: string;
  logoUrl: string;
  miniLogoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  bgColor: string;
  navGlassColor: string;
  fontFamily: string;
  customFontUrl?: string;
  customFontName?: string;
}

const PRESET_THEMES = [
  {
    id: 'emerald',
    name: '🌿 Ngọc Lục Bảo (Mặc định)',
    primary: '#059669',
    secondary: '#047857',
    bg: '#f0fdf4',
    navGlass: 'rgba(255, 255, 255, 0.94)'
  },
  {
    id: 'rose-pastel',
    name: '🌸 Hồng Phấn Lãng Mạn',
    primary: '#e11d48',
    secondary: '#be123c',
    bg: '#fff1f2',
    navGlass: 'rgba(255, 255, 255, 0.94)'
  },
  {
    id: 'honey-amber',
    name: '🍯 Vani & Hổ Phách Ấm',
    primary: '#d97706',
    secondary: '#b45309',
    bg: '#fffbeb',
    navGlass: 'rgba(255, 255, 255, 0.94)'
  },
  {
    id: 'lavender',
    name: '🍇 Tử Đinh Hương Quý Tộc',
    primary: '#7c3aed',
    secondary: '#6d28d9',
    bg: '#faf5ff',
    navGlass: 'rgba(255, 255, 255, 0.94)'
  }
];

const PRESET_FONTS = [
  { id: 'Playfair Display', label: 'Playfair Display (Quý phái & Cổ điển)' },
  { id: 'Great Vibes', label: 'Great Vibes (Thơ mộng & Chữ viết tay)' },
  { id: 'Quicksand', label: 'Quicksand (Tròn trịa & Dễ thương)' },
  { id: 'Nunito', label: 'Nunito (Chuẩn PhotoTiin & Dễ đọc)' },
  { id: 'Inter', label: 'Inter (Hiện đại & Tinh gọn)' }
];

export const BrandingSubpage: React.FC<BrandingSubpageProps> = ({
  onBackToDashboard,
  showToast,
  title = 'Branding & Hệ Màu Sắc Website'
}) => {
  const { settings, updateSettings } = useStore();

  const [draft, setDraft] = useState<BrandingData>(() => {
    const saved = localStorage.getItem('vvf_branding_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      brandName: settings?.name || 'V&V Florielle',
      tagline: settings?.tagline || settings?.slogan || 'Flowers that speak from the heart',
      logoUrl: '/logo-vvflorielle-horizontal.webp',
      miniLogoUrl: '/logo-vvflorielle-square.webp',
      primaryColor: '#059669',
      secondaryColor: '#047857',
      bgColor: '#f0fdf4',
      navGlassColor: 'rgba(255, 255, 255, 0.94)',
      fontFamily: 'Playfair Display'
    };
  });

  const [saving, setSaving] = useState(false);

  // Apply font to DOM dynamically for preview
  const applyFont = (fontFamily: string, customDataUrl?: string, customName?: string) => {
    if (customDataUrl && customName) {
      const styleId = 'custom-brand-font-style';
      let styleTag = document.getElementById(styleId);
      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = styleId;
        document.head.appendChild(styleTag);
      }
      styleTag.textContent = `
        @font-face {
          font-family: '${customName}';
          src: url('${customDataUrl}') format('woff2');
          font-display: swap;
        }
      `;
      document.documentElement.style.setProperty('--brand-font', `'${customName}', serif`);
    } else {
      document.documentElement.style.setProperty('--brand-font', `'${fontFamily}', serif`);
    }
  };

  const handleApplyPreset = (preset: typeof PRESET_THEMES[0]) => {
    setDraft({
      ...draft,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      bgColor: preset.bg,
      navGlassColor: preset.navGlass
    });
    showToast?.(`Đã áp dụng bảng màu: ${preset.name}`, 'info');
  };

  const handleCustomLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2_000_000) {
      showToast?.('Vui lòng chọn ảnh logo dưới 2MB', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const res = event.target?.result as string;
      setDraft((prev) => ({ ...prev, logoUrl: res }));
      showToast?.('Đã nạp logo mới xem trước!', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleCustomMiniLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1_000_000) {
      showToast?.('Vui lòng chọn ảnh favicon dưới 1MB', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const res = event.target?.result as string;
      setDraft((prev) => ({ ...prev, miniLogoUrl: res }));
      showToast?.('Đã nạp Favicon mới xem trước!', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleCustomFontFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3_000_000) {
      showToast?.('Tệp font không quá 3MB (.woff2, .ttf, .otf)', 'error');
      return;
    }
    const fontName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '') || 'CustomBrandFont';
    const reader = new FileReader();
    reader.onload = (event) => {
      const res = event.target?.result as string;
      setDraft((prev) => ({
        ...prev,
        fontFamily: 'custom',
        customFontUrl: res,
        customFontName: fontName
      }));
      applyFont('custom', res, fontName);
      showToast?.(`Đã nạp font chữ riêng "${file.name}"!`, 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setSaving(true);
    try {
      localStorage.setItem('vvf_branding_config', JSON.stringify(draft));
      applyFont(draft.fontFamily, draft.customFontUrl, draft.customFontName);

      // Cập nhật cấu hình cửa hàng
      updateSettings({
        name: draft.brandName,
        slogan: draft.tagline,
        tagline: draft.tagline
      });

      showToast?.('Đã lưu cấu hình Branding & Hệ màu thành công! 🎉', 'success');
    } catch {
      showToast?.('Lỗi khi lưu cấu hình Branding', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    const def: BrandingData = {
      brandName: 'V&V Florielle',
      tagline: 'Flowers that speak from the heart',
      logoUrl: '/logo-vvflorielle-horizontal.webp',
      miniLogoUrl: '/logo-vvflorielle-square.webp',
      primaryColor: '#059669',
      secondaryColor: '#047857',
      bgColor: '#f0fdf4',
      navGlassColor: 'rgba(255, 255, 255, 0.94)',
      fontFamily: 'Playfair Display'
    };
    setDraft(def);
    localStorage.removeItem('vvf_branding_config');
    applyFont('Playfair Display');
    showToast?.('Đã khôi phục cài đặt nhận diện thương hiệu mặc định!', 'info');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 select-none pb-24">
      {/* 1. Header chuẩn PhotoTiinLove */}
      <div className="relative flex items-center justify-between min-h-[44px] pb-3 border-b border-slate-200/80">
        <div className="w-10 sm:w-28 shrink-0" />
        <div className="text-center mx-auto px-2">
          <small className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
            NHẬN DIỆN THƯƠNG HIỆU &amp; CMS
          </small>
          <h2 className="font-extrabold text-sm sm:text-lg text-slate-900 tracking-tight">
            {title}
          </h2>
        </div>
        <div className="w-10 sm:w-28 shrink-0" />
      </div>

      {/* 2. Interactive Live Preview Island */}
      <div className="glass-panel p-4 sm:p-5 rounded-[24px] border border-amber-200/80 bg-gradient-to-r from-amber-50/70 via-white to-emerald-50/70 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
            <Eye className="w-4 h-4 text-amber-600" />
            Mô Phỏng Trực Quan Thời Gian Thực (Live Preview)
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200 font-bold">
            Xem trước tức thì
          </span>
        </div>

        {/* Simulated Header Bar */}
        <div className="p-3 rounded-2xl bg-white/90 border border-slate-200/80 shadow-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="h-9 px-2 rounded-full bg-white border border-slate-200 shadow-2xs flex items-center justify-center overflow-hidden">
              <img src={draft.logoUrl} alt="Logo preview" className="h-7 w-auto object-contain" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 leading-none">{draft.brandName}</p>
              <p className="text-[10px] text-slate-500 italic mt-0.5">{draft.tagline}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="text-[11px] font-bold px-3 py-1 rounded-full text-white shadow-2xs"
              style={{ backgroundColor: draft.primaryColor }}
            >
              Đặt hoa ngay
            </span>
          </div>
        </div>

        {/* Simulated Browser Tab Favicon */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-t-xl bg-slate-200/80 border-t border-x border-slate-300 text-xs font-medium text-slate-700">
          <img src={draft.miniLogoUrl} alt="Favicon" className="w-4 h-4 rounded-full object-contain" />
          <span className="text-[11px] font-bold truncate max-w-[180px]">{draft.brandName} - Tiệm hoa tươi</span>
        </div>
      </div>

      {/* 3. Form Cấu Hình Branding */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Khối 1: Thông tin thương hiệu & Slogan */}
        <div className="glass-panel p-5 rounded-[24px] space-y-4 border border-slate-200/80 bg-white/90">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <Flower2 className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-slate-900">1. Thông Tin Thương Hiệu</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-600 font-bold mb-1">Tên Tiệm Hoa (Thương hiệu công khai)</label>
              <input
                type="text"
                value={draft.brandName}
                onChange={(e) => setDraft({ ...draft, brandName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none text-xs font-medium"
                placeholder="V&V Florielle"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1">Dòng Khẩu Hiệu / Slogan (Tagline)</label>
              <input
                type="text"
                value={draft.tagline}
                onChange={(e) => setDraft({ ...draft, tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none text-xs font-medium"
                placeholder="Flowers that speak from the heart"
              />
            </div>
          </div>
        </div>

        {/* Khối 2: Quản lý Logo chính & Favicon */}
        <div className="glass-panel p-5 rounded-[24px] space-y-4 border border-slate-200/80 bg-white/90">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
            <span className="p-1.5 rounded-lg bg-purple-100 text-purple-800">
              <ImageIcon className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-slate-900">2. Logo Chính &amp; Logo Mini (Favicon)</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-600 font-bold mb-1">Logo Chính (Main Logo - PNG, WebP)</label>
              <div className="flex items-center gap-3">
                <img src={draft.logoUrl} alt="Logo" className="h-10 w-28 object-contain rounded-lg border p-1 bg-white" />
                <label className="px-3 py-1.5 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold cursor-pointer transition-colors text-[11px]">
                  Tải ảnh mới
                  <input type="file" accept="image/*" onChange={handleCustomLogo} className="hidden" />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1">Logo Mini / Favicon Tab Trình Duyệt</label>
              <div className="flex items-center gap-3">
                <img src={draft.miniLogoUrl} alt="Favicon" className="h-9 w-9 object-contain rounded-full border p-1 bg-white" />
                <label className="px-3 py-1.5 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold cursor-pointer transition-colors text-[11px]">
                  Tải Favicon mới
                  <input type="file" accept="image/*" onChange={handleCustomMiniLogo} className="hidden" />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Khối 3: Hệ màu sắc chủ đạo */}
        <div className="glass-panel p-5 rounded-[24px] space-y-4 border border-slate-200/80 bg-white/90">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
              <Palette className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-slate-900">3. Bảng Màu Sắc Chủ Đạo</h3>
          </div>

          {/* Preset Buttons */}
          <div className="space-y-2">
            <label className="block text-[11px] text-slate-500 font-bold">Chọn Bảng Màu Mẫu Của Tiệm Hoa:</label>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => handleApplyPreset(theme)}
                  className="p-2 rounded-xl border border-slate-200 hover:border-amber-400 bg-white flex items-center gap-2 text-left transition-all active:scale-95 cursor-pointer shadow-2xs"
                >
                  <span className="w-4 h-4 rounded-full shrink-0 shadow-xs" style={{ backgroundColor: theme.primary }} />
                  <span className="text-[11px] font-bold text-slate-800 truncate">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Color Pickers */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
            <div>
              <label className="block text-[11px] text-slate-600 font-bold mb-1">Màu chính (Primary)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={draft.primaryColor}
                  onChange={(e) => setDraft({ ...draft, primaryColor: e.target.value })}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 p-0"
                />
                <span className="text-[11px] font-mono font-bold text-slate-700">{draft.primaryColor}</span>
              </div>
            </div>
            <div>
              <label className="block text-[11px] text-slate-600 font-bold mb-1">Màu phụ (Secondary)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={draft.secondaryColor}
                  onChange={(e) => setDraft({ ...draft, secondaryColor: e.target.value })}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 p-0"
                />
                <span className="text-[11px] font-mono font-bold text-slate-700">{draft.secondaryColor}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Khối 4: Font chữ thương hiệu */}
        <div className="glass-panel p-5 rounded-[24px] space-y-4 border border-slate-200/80 bg-white/90">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
            <span className="p-1.5 rounded-lg bg-sky-100 text-sky-800">
              <Type className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-slate-900">4. Font Chữ Thương Hiệu</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-600 font-bold mb-1">Chọn Font Chữ Nghệ Thuật:</label>
              <select
                value={draft.fontFamily}
                onChange={(e) => {
                  const val = e.target.value;
                  setDraft({ ...draft, fontFamily: val });
                  applyFont(val);
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-sky-500 focus:outline-none text-xs font-semibold bg-white"
              >
                {PRESET_FONTS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
                {draft.customFontName && (
                  <option value="custom">Font riêng: {draft.customFontName}</option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1">Hoặc tải lên tệp Font riêng (.woff2, .ttf, .otf):</label>
              <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold cursor-pointer transition-colors text-[11px]">
                Chọn tệp Font từ máy
                <input type="file" accept=".woff2,.ttf,.otf,.woff" onChange={handleCustomFontFile} className="hidden" />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Action Buttons Pinned at Bottom */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-200/80">
        <button
          type="button"
          onClick={handleResetDefaults}
          className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Khôi Phục Mặc Định</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBackToDashboard}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            Quay Lại
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 hover:from-emerald-700 hover:to-teal-700 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Đang lưu...' : 'Lưu Thay Đổi'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
