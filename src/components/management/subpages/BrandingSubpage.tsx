import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Save,
  RotateCcw,
  Palette,
  Image as ImageIcon,
  Type,
  Check,
  CheckCircle2,
  Eye,
  Sliders,
  Flower2,
  Layout,
  Globe
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { applyTheme } from '../../../utils/themeEngine';
import { compressImage } from '../../../utils/imageCompressor';

interface BrandingSubpageProps {
  onBackToDashboard: () => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
  title?: string;
}

export interface BrandingData {
  brandName: string;
  tagline: string;
  logoHorizontalUrl: string; // Logo Ngang (Header Navbar, Desktop & Mobile)
  logoVerticalUrl: string;   // Logo Dọc / Vuông (Footer, Hóa đơn in ấn & Thiệp chúc mừng)
  faviconUrl: string;        // Icon nhỏ web (Favicon tab trình duyệt & PWA)
  floralCornerTopImage: string; // Cụm hoa góc trên trang chủ (Hero Corners chung)
  floralCornerTopLeftImage?: string; // Cụm hoa góc trái riêng biệt
  floralCornerTopRightImage?: string; // Cụm hoa góc phải riêng biệt
  floralCornerTopRightFlip?: boolean; // Tự động lật gương đối xứng góc phải
  primaryColor: string;
  secondaryColor: string;
  bgColor: string;
  navGlassColor: string;
  fontFamily: string;
  customFontUrl?: string;
  customFontName?: string;
}

const PRESET_FLORAL_CORNERS = [
  {
    id: 'rose-peony',
    name: '🌹 Hoa Hồng & Mẫu Đơn Pastel (Mặc định)',
    url: '/images/floral/floral-corner-rose-peony.webp',
    desc: 'Quý phái, thanh lịch, tạo cảm giác sang trọng hoàng gia'
  },
  {
    id: 'peach-lisianthus',
    name: '🌸 Cát Tường & Đào Mơ Dịu Dàng',
    url: '/images/floral/floral-corner-peach-lisianthus.webp',
    desc: 'Mềm mại, ấm áp, tone pastel nữ tính ngọt ngào'
  },
  {
    id: 'none',
    name: '🚫 Không hiển thị hoa góc (Tối giản)',
    url: '',
    desc: 'Giao diện phẳng tinh gọn theo phong cách Modern Minimalist'
  }
];

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
  },
  {
    id: 'ruby-wine',
    name: '🍷 Rượu Vang Ruby Tiệc Cưới',
    primary: '#9f1239',
    secondary: '#881337',
    bg: '#fff1f2',
    navGlass: 'rgba(255, 255, 255, 0.94)'
  },
  {
    id: 'ocean-sapphire',
    name: '🌊 Lam Ngọc Biển Sâu',
    primary: '#0284c7',
    secondary: '#0369a1',
    bg: '#f0f9ff',
    navGlass: 'rgba(255, 255, 255, 0.94)'
  },
  {
    id: 'coral-peach',
    name: '🍑 Trà Đào San Hô',
    primary: '#ea580c',
    secondary: '#c2410c',
    bg: '#fff7ed',
    navGlass: 'rgba(255, 255, 255, 0.94)'
  },
  {
    id: 'warm-terracotta',
    name: '☕ Nâu Đất Trầm Ấm Vintage',
    primary: '#78350f',
    secondary: '#451a03',
    bg: '#fffbeb',
    navGlass: 'rgba(255, 255, 255, 0.94)'
  },
  {
    id: 'imperial-gold',
    name: '👑 Vàng Kim Hoàng Gia',
    primary: '#ca8a04',
    secondary: '#a16207',
    bg: '#fefce8',
    navGlass: 'rgba(255, 255, 255, 0.94)'
  }
];

const PRESET_FONTS = [
  { id: 'Pacifico', name: 'Pacifico', tag: 'Dễ thương & Ngọt ngào' },
  { id: 'Dancing Script', name: 'Dancing Script', tag: 'Bay bổng & Lãng mạn' },
  { id: 'Caveat', name: 'Caveat', tag: 'Bút dạ & Tự nhiên' },
  { id: 'Comfortaa', name: 'Comfortaa', tag: 'Bo tròn xoe hiện đại' },
  { id: 'Satisfy', name: 'Satisfy', tag: 'Bút lông mềm mại' },
  { id: 'Great Vibes', name: 'Great Vibes', tag: 'Thư pháp quý phái' },
  { id: 'Patrick Hand', name: 'Patrick Hand', tag: 'Học trò ngộ nghĩnh' },
  { id: 'Marck Script', name: 'Marck Script', tag: 'Thanh lịch dịu dàng' },
  { id: 'Quicksand', name: 'Quicksand', tag: 'Bo tròn thanh nhã' },
  { id: 'Nunito', name: 'Nunito', tag: 'Chuẩn tiệm hoa dễ đọc' },
  { id: 'Playfair Display', name: 'Playfair Display', tag: 'Hoàng gia cổ điển' }
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
        const parsed = JSON.parse(saved);
        return {
          brandName: parsed.brandName || settings?.name || 'V&V Florielle',
          tagline: parsed.tagline || settings?.tagline || settings?.slogan || 'Flowers that speak from the heart',
          logoHorizontalUrl: parsed.logoHorizontalUrl || parsed.logoUrl || settings?.logoHorizontalUrl || '/logo-vvflorielle-horizontal.webp',
          logoVerticalUrl: parsed.logoVerticalUrl || settings?.logoVerticalUrl || '/logo.png',
          faviconUrl: parsed.faviconUrl || parsed.miniLogoUrl || settings?.faviconUrl || '/logo-vvflorielle-square.webp',
          floralCornerTopImage: parsed.floralCornerTopImage || settings?.floralCornerTopImage || '/images/floral/floral-corner-rose-peony.webp',
          floralCornerTopLeftImage: parsed.floralCornerTopLeftImage || settings?.floralCornerTopLeftImage || parsed.floralCornerTopImage || settings?.floralCornerTopImage || '/images/floral/floral-corner-rose-peony.webp',
          floralCornerTopRightImage: parsed.floralCornerTopRightImage || settings?.floralCornerTopRightImage || parsed.floralCornerTopImage || settings?.floralCornerTopImage || '/images/floral/floral-corner-rose-peony.webp',
          floralCornerTopRightFlip: parsed.floralCornerTopRightFlip !== undefined ? parsed.floralCornerTopRightFlip : settings?.floralCornerTopRightFlip !== undefined ? settings.floralCornerTopRightFlip : true,
          primaryColor: parsed.primaryColor || settings?.primaryColor || '#059669',
          secondaryColor: parsed.secondaryColor || settings?.secondaryColor || '#047857',
          bgColor: parsed.bgColor || '#f0fdf4',
          navGlassColor: parsed.navGlassColor || 'rgba(255, 255, 255, 0.94)',
          fontFamily: parsed.fontFamily || settings?.fontFamily || 'Playfair Display',
          customFontUrl: parsed.customFontUrl,
          customFontName: parsed.customFontName
        };
      } catch {}
    }
    return {
      brandName: settings?.name || 'V&V Florielle',
      tagline: settings?.tagline || settings?.slogan || 'Flowers that speak from the heart',
      logoHorizontalUrl: settings?.logoHorizontalUrl || '/logo-vvflorielle-horizontal.webp',
      logoVerticalUrl: settings?.logoVerticalUrl || '/logo.png',
      faviconUrl: settings?.faviconUrl || '/logo-vvflorielle-square.webp',
      floralCornerTopImage: settings?.floralCornerTopImage || '/images/floral/floral-corner-rose-peony.webp',
      floralCornerTopLeftImage: settings?.floralCornerTopLeftImage || settings?.floralCornerTopImage || '/images/floral/floral-corner-rose-peony.webp',
      floralCornerTopRightImage: settings?.floralCornerTopRightImage || settings?.floralCornerTopImage || '/images/floral/floral-corner-rose-peony.webp',
      floralCornerTopRightFlip: settings?.floralCornerTopRightFlip !== undefined ? settings.floralCornerTopRightFlip : true,
      primaryColor: settings?.primaryColor || '#059669',
      secondaryColor: settings?.secondaryColor || '#047857',
      bgColor: '#f0fdf4',
      navGlassColor: 'rgba(255, 255, 255, 0.94)',
      fontFamily: settings?.fontFamily || 'Playfair Display'
    };
  });

  const [saving, setSaving] = useState(false);
  const [activeFloralTab, setActiveFloralTab] = useState<'both' | 'left' | 'right'>('both');
  const [demoText, setDemoText] = useState('V&V Florielle - Tiệm Hoa Nghệ Thuật');

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
      applyTheme({
        primaryColor: draft.primaryColor,
        secondaryColor: draft.secondaryColor,
        fontFamily: customName
      });
    } else {
      applyTheme({
        primaryColor: draft.primaryColor,
        secondaryColor: draft.secondaryColor,
        fontFamily: fontFamily
      });
    }
  };

  const handleApplyPreset = (preset: typeof PRESET_THEMES[0]) => {
    setDraft((prev) => ({
      ...prev,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      bgColor: preset.bg,
      navGlassColor: preset.navGlass
    }));
    // Real-time live preview theme colors across entire app immediately!
    applyTheme({
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      fontFamily: draft.fontFamily
    });
    showToast?.(`Đã áp dụng bảng màu: ${preset.name}`, 'info');
  };

  // 1. Tải Logo Ngang Mới (Hỗ trợ ảnh tới 10MB - Tự động nén WebP giữ nguyên nền trong suốt)
  const handleCustomLogoHorizontal = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      showToast?.('Vui lòng chọn ảnh logo ngang dưới 10MB', 'error');
      return;
    }
    try {
      const compressedWebp = await compressImage(file, 1200, 600, 0.9);
      setDraft((prev) => ({ ...prev, logoHorizontalUrl: compressedWebp }));
      showToast?.('Đã chuyển đổi sang WebP & nạp Logo Ngang mới xem trước! 🖼️', 'success');
    } catch {
      showToast?.('Lỗi khi xử lý ảnh logo', 'error');
    }
  };

  // 2. Tải Logo Dọc / Vuông Mới (Hỗ trợ ảnh tới 10MB - Tự động nén WebP)
  const handleCustomLogoVertical = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      showToast?.('Vui lòng chọn ảnh logo dọc dưới 10MB', 'error');
      return;
    }
    try {
      const compressedWebp = await compressImage(file, 800, 800, 0.9);
      setDraft((prev) => ({ ...prev, logoVerticalUrl: compressedWebp }));
      showToast?.('Đã chuyển đổi sang WebP & nạp Logo Dọc mới xem trước! 🖼️', 'success');
    } catch {
      showToast?.('Lỗi khi xử lý ảnh logo', 'error');
    }
  };

  // 3. Tải Icon Nhỏ Của Web (Favicon Tab Trình Duyệt - Tối đa 10MB)
  const handleCustomFavicon = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      showToast?.('Vui lòng chọn ảnh favicon dưới 10MB', 'error');
      return;
    }
    try {
      const compressedWebp = await compressImage(file, 256, 256, 0.9);
      setDraft((prev) => ({ ...prev, faviconUrl: compressedWebp }));
      showToast?.('Đã chuyển đổi sang WebP & nạp Icon Web mới xem trước! 🌐', 'success');
    } catch {
      showToast?.('Lỗi khi xử lý ảnh icon', 'error');
    }
  };

  // 4. Tải Cụm Hoa Góc Đầu Trang Tùy Chỉnh (Hero Corner Flowers - Tối đa 10MB)
  const handleCustomFloralCorner = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      showToast?.('Vui lòng chọn ảnh hoa góc dưới 10MB (.png, .webp nền trong suốt)', 'error');
      return;
    }
    try {
      const compressedWebp = await compressImage(file, 1000, 1000, 0.88);
      if (activeFloralTab === 'both') {
        setDraft((prev) => ({
          ...prev,
          floralCornerTopImage: compressedWebp,
          floralCornerTopLeftImage: compressedWebp,
          floralCornerTopRightImage: compressedWebp
        }));
        showToast?.('Đã nạp cụm hoa mới cho cả 2 bên góc đầu trang! 🌸', 'success');
      } else if (activeFloralTab === 'left') {
        setDraft((prev) => ({
          ...prev,
          floralCornerTopLeftImage: compressedWebp
        }));
        showToast?.('Đã nạp cụm hoa riêng cho góc trên bên trái! 🌸', 'success');
      } else {
        setDraft((prev) => ({
          ...prev,
          floralCornerTopRightImage: compressedWebp
        }));
        showToast?.('Đã nạp cụm hoa riêng cho góc trên bên phải! 🌸', 'success');
      }
    } catch {
      showToast?.('Lỗi khi xử lý ảnh hoa góc', 'error');
    }
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

      // Cập nhật cấu hình cửa hàng toàn cục (Đồng bộ Logo Ngang, Dọc, Favicon, Hệ Màu, Font & Cụm Hoa Góc)
      updateSettings({
        name: draft.brandName,
        slogan: draft.tagline,
        tagline: draft.tagline,
        logoHorizontalUrl: draft.logoHorizontalUrl,
        logoVerticalUrl: draft.logoVerticalUrl,
        faviconUrl: draft.faviconUrl,
        floralCornerTopImage: draft.floralCornerTopImage,
        floralCornerTopLeftImage: draft.floralCornerTopLeftImage,
        floralCornerTopRightImage: draft.floralCornerTopRightImage,
        floralCornerTopRightFlip: draft.floralCornerTopRightFlip !== false,
        primaryColor: draft.primaryColor,
        secondaryColor: draft.secondaryColor,
        fontFamily: draft.fontFamily
      });

      // Áp dụng ngay lập tức bảng màu và font chữ lên toàn bộ hệ thống
      applyTheme({
        primaryColor: draft.primaryColor,
        secondaryColor: draft.secondaryColor,
        fontFamily: draft.fontFamily
      });

      // Cập nhật ngay lập tức icon trên tab trình duyệt (Favicon)
      if (typeof document !== 'undefined') {
        let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.head.appendChild(link);
        }
        link.href = draft.faviconUrl;
      }

      showToast?.('Đã lưu thành công Logo, Icon Web, Cụm Hoa Góc & Hệ Màu Nhận Diện! 🎉', 'success');
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
      logoHorizontalUrl: '/logo-vvflorielle-horizontal.webp',
      logoVerticalUrl: '/logo.png',
      faviconUrl: '/logo-vvflorielle-square.webp',
      floralCornerTopImage: '/images/floral/floral-corner-rose-peony.webp',
      floralCornerTopLeftImage: '/images/floral/floral-corner-rose-peony.webp',
      floralCornerTopRightImage: '/images/floral/floral-corner-rose-peony.webp',
      primaryColor: '#059669',
      secondaryColor: '#047857',
      bgColor: '#f0fdf4',
      navGlassColor: 'rgba(255, 255, 255, 0.94)',
      fontFamily: 'Playfair Display'
    };
    setDraft(def);
    localStorage.removeItem('vvf_branding_config');
    applyTheme({
      primaryColor: def.primaryColor,
      secondaryColor: def.secondaryColor,
      fontFamily: def.fontFamily
    });
    updateSettings({
      name: def.brandName,
      slogan: def.tagline,
      tagline: def.tagline,
      logoHorizontalUrl: def.logoHorizontalUrl,
      logoVerticalUrl: def.logoVerticalUrl,
      faviconUrl: def.faviconUrl,
      floralCornerTopImage: def.floralCornerTopImage,
      primaryColor: def.primaryColor,
      secondaryColor: def.secondaryColor,
      fontFamily: def.fontFamily
    });

    updateSettings({
      name: def.brandName,
      slogan: def.tagline,
      tagline: def.tagline,
      logoHorizontalUrl: def.logoHorizontalUrl,
      logoVerticalUrl: def.logoVerticalUrl,
      faviconUrl: def.faviconUrl
    });

    if (typeof document !== 'undefined') {
      let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      if (link) link.href = def.faviconUrl;
    }

    showToast?.('Đã khôi phục cài đặt nhận diện thương hiệu mặc định!', 'info');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 select-none pb-4">
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

      {/* 2. Interactive Live Preview Island (Mô phỏng cả Logo Ngang, Logo Dọc và Favicon Tab) */}
      <div className="glass-panel p-4 sm:p-5 rounded-[24px] border border-amber-200/80 bg-gradient-to-r from-amber-50/70 via-white to-emerald-50/70 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
            <Eye className="w-4 h-4 text-amber-600" />
            Mô Phỏng Trực Quan Thời Gian Thực (Live Preview Đầy Đủ)
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200 font-bold shadow-2xs">
            Xem trước tức thì
          </span>
        </div>

        {/* Row 1: Mô phỏng thanh Tab trình duyệt Google Chrome với Icon Nhỏ (Favicon) */}
        <div>
          <span className="text-[10.5px] font-bold text-slate-600 mb-1.5 block">
            1. Mô phỏng Tab Trình Duyệt (Hiển thị Icon nhỏ Favicon):
          </span>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-t-xl bg-slate-200/90 border-t border-x border-slate-300 text-xs font-semibold text-slate-700 shadow-2xs">
            <img src={draft.faviconUrl} alt="Favicon preview" className="w-4 h-4 rounded-full object-contain border border-slate-300 bg-white" />
            <span className="text-[11px] font-bold truncate max-w-[220px]">
              {draft.brandName} - Tiệm Hoa Nghệ Thuật &amp; Thiết Kế Hoa
            </span>
          </div>
        </div>

        {/* Row 2: Mô phỏng Header Website với Logo Ngang */}
        <div>
          <span className="text-[10.5px] font-bold text-slate-600 mb-1.5 block">
            2. Mô phỏng Thanh Điều Hướng (Header) với Logo Ngang:
          </span>
          <div className="p-3 sm:p-3.5 rounded-2xl bg-white/95 border border-slate-200/80 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="h-10 px-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center">
                <img src={draft.logoHorizontalUrl} alt="Logo Ngang preview" className="h-7 sm:h-8 w-auto max-w-[160px] object-contain" />
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-slate-800 leading-none">{draft.brandName}</p>
                <p className="text-[10px] text-slate-500 italic mt-0.5">{draft.tagline}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 font-semibold hidden md:inline">Trang chủ • Mẫu hoa • Dịch vụ</span>
              <span
                className="text-[11px] font-bold px-3 py-1 rounded-full text-white shadow-2xs"
                style={{ backgroundColor: draft.primaryColor }}
              >
                Đặt hoa ngay
              </span>
            </div>
          </div>
        </div>

        {/* Row 3: Mô phỏng Footer / Thiệp hoa với Logo Dọc */}
        <div>
          <span className="text-[10.5px] font-bold text-slate-600 mb-1.5 block">
            3. Mô phỏng Chân Trang (Footer) &amp; Thiệp Hoa với Logo Dọc / Khối Vuông:
          </span>
          <div className="p-3 rounded-2xl bg-slate-50/90 border border-slate-200/80 shadow-xs flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center p-1 shrink-0">
              <img src={draft.logoVerticalUrl} alt="Logo Dọc preview" className="w-full h-full object-contain" />
            </div>
            <div className="text-[11px] text-slate-600 leading-relaxed min-w-0">
              <p className="font-bold text-slate-800">{draft.brandName} • Tiệm Hoa Nghệ Thuật</p>
              <p className="text-[10px] text-slate-500">Logo dọc tối ưu in thiệp chúc mừng, phong bì và chân trang website.</p>
            </div>
          </div>
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

        {/* Khối 2: Quản lý Logo Ngang, Logo Dọc & Icon Nhỏ Web (Favicon) */}
        <div className="glass-panel p-5 rounded-[24px] space-y-4 border border-slate-200/80 bg-white/90">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
            <span className="p-1.5 rounded-lg bg-purple-100 text-purple-800">
              <ImageIcon className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-slate-900">2. Logo Ngang, Dọc &amp; Icon Nhỏ Của Web</h3>
          </div>

          <div className="space-y-4 text-xs">
            {/* 1. Logo Ngang (Header) */}
            <div className="p-3 rounded-2xl bg-purple-50/40 border border-purple-100 space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-slate-700 font-extrabold text-[11.5px]">
                  A. Logo Ngang (Horizontal Logo - Header Web)
                </label>
                <span className="text-[9.5px] text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full font-bold">
                  Desktop &amp; Mobile
                </span>
              </div>
              <p className="text-[10px] text-slate-500">
                Hiển thị trên thanh Header chính. Khuyên dùng ảnh PNG trong suốt hoặc WebP dạng ngang.
              </p>
              <div className="flex items-center gap-3 pt-1">
                <div className="h-10 w-28 rounded-lg border border-slate-200 p-1 bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                  <img src={draft.logoHorizontalUrl} alt="Logo Ngang" className="h-full w-auto max-w-full object-contain" />
                </div>
                <label className="px-3 py-1.5 rounded-xl border border-purple-300 bg-purple-100/80 hover:bg-purple-200 text-purple-900 font-bold cursor-pointer transition-colors text-[11px] shadow-2xs flex items-center gap-1">
                  <span>Tải Logo Ngang Mới</span>
                  <input type="file" accept="image/*" onChange={handleCustomLogoHorizontal} className="hidden" />
                </label>
              </div>
            </div>

            {/* 2. Logo Dọc / Vuông (Footer, Thiệp hoa, Hóa đơn) */}
            <div className="p-3 rounded-2xl bg-amber-50/40 border border-amber-100 space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-slate-700 font-extrabold text-[11.5px]">
                  B. Logo Dọc / Khối Vuông (Vertical / Square Logo)
                </label>
                <span className="text-[9.5px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-bold">
                  Footer &amp; In Ấn
                </span>
              </div>
              <p className="text-[10px] text-slate-500">
                Hiển thị tại Chân trang (Footer), thiệp chúc mừng, phiếu in và hóa đơn. Tỉ lệ vuông 1:1 hoặc dọc.
              </p>
              <div className="flex items-center gap-3 pt-1">
                <div className="w-12 h-12 rounded-xl border border-slate-200 p-1 bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                  <img src={draft.logoVerticalUrl} alt="Logo Dọc" className="w-full h-full object-contain" />
                </div>
                <label className="px-3 py-1.5 rounded-xl border border-amber-300 bg-amber-100/80 hover:bg-amber-200 text-amber-900 font-bold cursor-pointer transition-colors text-[11px] shadow-2xs flex items-center gap-1">
                  <span>Tải Logo Dọc Mới</span>
                  <input type="file" accept="image/*" onChange={handleCustomLogoVertical} className="hidden" />
                </label>
              </div>
            </div>

            {/* 3. Icon Nhỏ Của Web (Favicon Tab Trình Duyệt) */}
            <div className="p-3 rounded-2xl bg-sky-50/40 border border-sky-100 space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-slate-700 font-extrabold text-[11.5px]">
                  C. Icon Nhỏ Của Web (Favicon Tab Trình Duyệt)
                </label>
                <span className="text-[9.5px] text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full font-bold">
                  Browser Tab &amp; PWA
                </span>
              </div>
              <p className="text-[10px] text-slate-500">
                Biểu tượng nhỏ hiển thị ở góc tab trình duyệt web của khách hàng, Bookmark &amp; màn hình điện thoại.
              </p>
              <div className="flex items-center gap-3 pt-1">
                <div className="w-10 h-10 rounded-full border border-slate-200 p-1 bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                  <img src={draft.faviconUrl} alt="Favicon" className="w-full h-full object-contain rounded-full" />
                </div>
                <label className="px-3 py-1.5 rounded-xl border border-sky-300 bg-sky-100/80 hover:bg-sky-200 text-sky-900 font-bold cursor-pointer transition-colors text-[11px] shadow-2xs flex items-center gap-1">
                  <span>Tải Icon Web Mới</span>
                  <input type="file" accept="image/*,.ico" onChange={handleCustomFavicon} className="hidden" />
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
                  onChange={(e) => {
                    const val = e.target.value;
                    setDraft((prev) => ({ ...prev, primaryColor: val }));
                    applyTheme({
                      primaryColor: val,
                      secondaryColor: draft.secondaryColor,
                      fontFamily: draft.fontFamily
                    });
                  }}
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
                  onChange={(e) => {
                    const val = e.target.value;
                    setDraft((prev) => ({ ...prev, secondaryColor: val }));
                    applyTheme({
                      primaryColor: draft.primaryColor,
                      secondaryColor: val,
                      fontFamily: draft.fontFamily
                    });
                  }}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 p-0"
                />
                <span className="text-[11px] font-mono font-bold text-slate-700">{draft.secondaryColor}</span>
              </div>
            </div>
          </div>

          {/* Ghi chú tối ưu hệ thống: Giữ cố định màu nghiệp vụ */}
          <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed">
            <span className="font-bold">✨ Tối ưu nhận diện thông minh:</span> Bảng màu chủ đạo sẽ áp dụng cho các nút bấm chính, viền chọn, tiêu đề thương hiệu và màu nền. Các huy hiệu trạng thái nghiệp vụ (Đang mở cửa / Tạm nghỉ / Đóng cửa), nút Hotline đỏ, viền Freeship xe tải (xanh lá), Deal giảm giá (cam lửa) và mã VietQR luôn được giữ cố định theo chuẩn màu nghiệp vụ để đảm bảo nhận diện chính xác.
          </div>
        </div>

        {/* Khối 4: Font chữ thương hiệu (Visual Font Picker phong cách PhotoTiin) */}
        <div className="glass-panel p-5 rounded-[24px] space-y-4 border border-slate-200/80 bg-white/90">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-sky-100 text-sky-800">
                <Type className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900">4. Font Chữ Thương Hiệu &amp; Mẫu Xem Trước Trực Quan</h3>
                <p className="text-[11px] text-slate-500">Xem trước kiểu chữ thực tế trên từng mẫu font trước khi lựa chọn</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200 self-start sm:self-auto">
              Đang áp dụng: {draft.fontFamily}
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Live interactive demo text bar */}
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">
                Nhập văn bản mẫu để xem trước kiểu chữ:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={demoText}
                  onChange={(e) => setDemoText(e.target.value)}
                  placeholder="Ví dụ: V&V Florielle - Tiệm Hoa Nghệ Thuật Hà Nội"
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-sky-500 focus:outline-none bg-slate-50/80 font-medium text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => setDemoText('V&V Florielle - Tiệm Hoa Nghệ Thuật')}
                  className="px-3 py-2 text-[11px] rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold shrink-0 transition-colors cursor-pointer"
                >
                  Mặc định
                </button>
              </div>
            </div>

            {/* Visual Font Cards Grid - 3 Cột trên Mobile, 3-4 Cột trên Desktop (Khối nhỏ hiển thị vừa phải) */}
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-1.5 sm:gap-2.5 pt-1">
              {PRESET_FONTS.map((f) => {
                const isSelected = draft.fontFamily === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      setDraft({ ...draft, fontFamily: f.id });
                      applyFont(f.id);
                    }}
                    className={`py-2 px-1.5 sm:py-2.5 sm:px-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 min-h-[56px] sm:min-h-[64px] relative overflow-hidden ${
                      isSelected
                        ? 'border-sky-500 bg-sky-50/95 shadow-2xs ring-2 ring-sky-500/20'
                        : 'border-slate-200/90 hover:border-sky-300 hover:bg-slate-50/70 bg-white'
                    }`}
                    title={`${f.name} - ${f.tag}`}
                  >
                    {/* Badge tích chọn góc trên */}
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-2xs">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}

                    {/* Tên Font hiển thị bằng chính nét chữ của font đó */}
                    <span
                      className="text-xs sm:text-sm font-bold text-slate-900 truncate max-w-full px-0.5 leading-snug"
                      style={{ fontFamily: f.id }}
                    >
                      {f.name}
                    </span>

                    {/* Thẻ phụ nhỏ gọn hiển thị vừa phải */}
                    <span className="text-[8px] sm:text-[9.5px] text-slate-400 truncate max-w-full leading-none">
                      {f.tag}
                    </span>
                  </button>
                );
              })}

              {draft.customFontName && (
                <button
                  type="button"
                  onClick={() => {
                    setDraft({ ...draft, fontFamily: 'custom' });
                    applyFont('custom', draft.customFontUrl, draft.customFontName);
                  }}
                  className={`py-2 px-1.5 sm:py-2.5 sm:px-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 min-h-[56px] sm:min-h-[64px] relative overflow-hidden ${
                    draft.fontFamily === 'custom'
                      ? 'border-sky-500 bg-sky-50/95 shadow-2xs ring-2 ring-sky-500/20'
                      : 'border-slate-200/90 hover:border-sky-300 bg-white'
                  }`}
                  title={`Font Tùy Chỉnh: ${draft.customFontName}`}
                >
                  {draft.fontFamily === 'custom' && (
                    <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-2xs">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                  <span
                    className="text-xs sm:text-sm font-bold text-purple-900 truncate max-w-full px-0.5 leading-snug"
                    style={{ fontFamily: draft.customFontName }}
                  >
                    {draft.customFontName}
                  </span>
                  <span className="text-[8px] sm:text-[9.5px] text-purple-500 truncate max-w-full leading-none">
                    ⭐ Tùy chỉnh
                  </span>
                </button>
              )}
            </div>

            {/* Upload Custom Font File */}
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-0.5">Hoặc tải lên tệp Font riêng (.woff2, .ttf, .otf):</label>
                <p className="text-[10.5px] text-slate-500">Font riêng sẽ được nhúng cục bộ vào website tự động</p>
              </div>
              <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold cursor-pointer transition-colors text-xs shrink-0 shadow-2xs">
                <span>Chọn tệp Font từ máy</span>
                <input type="file" accept=".woff2,.ttf,.otf,.woff" onChange={handleCustomFontFile} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* Khối 5: Cụm hoa trang trí góc đầu trang (Hero Corner Flowers - Độc lập từng bên) */}
        <div className="glass-panel p-5 rounded-[24px] space-y-4 border border-slate-200/80 bg-white/90">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-rose-100 text-rose-800">
                <Flower2 className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900">5. Cụm Hoa Trang Trí Góc Đầu Trang (Hero Corner Flowers)</h3>
                <p className="text-[11px] text-slate-500">Tùy chỉnh linh hoạt hoa góc trái hoặc phải riêng biệt, hoặc đồng bộ cả 2 bên</p>
              </div>
            </div>

            {/* Segmented Tab: Cả 2 bên / Góc Trái / Góc Phải */}
            <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveFloralTab('both')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeFloralTab === 'both' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Cả 2 bên
              </button>
              <button
                type="button"
                onClick={() => setActiveFloralTab('left')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeFloralTab === 'left' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Góc Trái
              </button>
              <button
                type="button"
                onClick={() => setActiveFloralTab('right')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeFloralTab === 'right' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Góc Phải
              </button>
            </div>
          </div>

          {/* Mini Live Preview of Corners */}
          <div className="relative p-4 rounded-2xl bg-gradient-to-r from-emerald-50/70 via-rose-50/50 to-amber-50/60 border border-slate-200/80 overflow-hidden flex items-center justify-between min-h-[90px]">
            {/* Left preview ornament */}
            <div className="w-16 h-16 pointer-events-none flex items-center justify-center">
              {draft.floralCornerTopLeftImage && draft.floralCornerTopLeftImage !== 'none' ? (
                <img src={draft.floralCornerTopLeftImage} alt="Trái" className="w-full h-full object-contain" />
              ) : (
                <span className="text-[10px] text-slate-400 italic">Trống</span>
              )}
            </div>

            {/* Center title demo */}
            <div className="text-center px-2">
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-emerald-700 block">V&amp;V Florielle</span>
              <span className="text-xs sm:text-sm font-bold text-slate-800" style={{ fontFamily: draft.fontFamily }}>
                Mẫu Xem Trước Góc Đầu Trang
              </span>
            </div>

            {/* Right preview ornament */}
            <div className="w-16 h-16 pointer-events-none flex items-center justify-center">
              {draft.floralCornerTopRightImage && draft.floralCornerTopRightImage !== 'none' ? (
                <img
                  src={draft.floralCornerTopRightImage}
                  alt="Phải"
                  className={`w-full h-full object-contain ${draft.floralCornerTopRightFlip !== false ? '-scale-x-100' : ''}`}
                />
              ) : (
                <span className="text-[10px] text-slate-400 italic">Trống</span>
              )}
            </div>
          </div>

          {/* Tùy chọn lật gương khi chọn tab Góc Phải */}
          {activeFloralTab === 'right' && (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs">
              <div className="space-y-0.5">
                <div className="font-bold text-amber-950 flex items-center gap-1.5">
                  <span>Lật gương đối xứng (-scale-x-100)</span>
                  <span className="text-[10px] bg-amber-200/80 text-amber-900 font-black px-1.5 py-0.2 rounded-md">
                    {draft.floralCornerTopRightFlip !== false ? 'Đang Bật' : 'Đã Tắt'}
                  </span>
                </div>
                <p className="text-[10.5px] text-slate-600 leading-snug">
                  Bật khi dùng cụm hoa góc trái để tự động lật ôm viền phải. Tắt nếu ảnh tải lên đã được thiết kế sẵn theo chiều góc phải.
                </p>
              </div>
              <input
                type="checkbox"
                checked={draft.floralCornerTopRightFlip !== false}
                onChange={(e) => setDraft({ ...draft, floralCornerTopRightFlip: e.target.checked })}
                className="w-4.5 h-4.5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer shrink-0 ml-3"
              />
            </div>
          )}

          {/* Preset Floral Corners Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] text-slate-700 font-bold">
                Chọn Mẫu Hoa Cho {activeFloralTab === 'both' ? 'Cả 2 Bên (Đối Xứng)' : activeFloralTab === 'left' ? 'Góc Trên Bên Trái' : 'Góc Trên Bên Phải'}:
              </label>
              {activeFloralTab !== 'both' && (
                <button
                  type="button"
                  onClick={() => {
                    if (activeFloralTab === 'left') {
                      setDraft({ ...draft, floralCornerTopRightImage: draft.floralCornerTopLeftImage });
                      showToast?.('Đã sao chép hoa góc trái sang góc phải!', 'info');
                    } else {
                      setDraft({ ...draft, floralCornerTopLeftImage: draft.floralCornerTopRightImage });
                      showToast?.('Đã sao chép hoa góc phải sang góc trái!', 'info');
                    }
                  }}
                  className="text-[10.5px] font-bold text-emerald-700 hover:underline cursor-pointer"
                >
                  Sao chép sang bên còn lại
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {PRESET_FLORAL_CORNERS.map((preset) => {
                const targetUrl = activeFloralTab === 'left'
                  ? (draft.floralCornerTopLeftImage ?? draft.floralCornerTopImage)
                  : activeFloralTab === 'right'
                  ? (draft.floralCornerTopRightImage ?? draft.floralCornerTopImage)
                  : draft.floralCornerTopImage;

                const isSelected = targetUrl === preset.url;

                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      if (activeFloralTab === 'both') {
                        setDraft({
                          ...draft,
                          floralCornerTopImage: preset.url,
                          floralCornerTopLeftImage: preset.url,
                          floralCornerTopRightImage: preset.url
                        });
                      } else if (activeFloralTab === 'left') {
                        setDraft({ ...draft, floralCornerTopLeftImage: preset.url });
                      } else {
                        setDraft({ ...draft, floralCornerTopRightImage: preset.url });
                      }
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/80 shadow-xs ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-emerald-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{preset.name}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                    </div>
                    {preset.url ? (
                      <div className="h-16 w-full rounded-xl bg-slate-50 border border-slate-200/60 p-1 flex items-center justify-center overflow-hidden">
                        <img src={preset.url} alt={preset.name} className="h-full object-contain" />
                      </div>
                    ) : (
                      <div className="h-16 w-full rounded-xl bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-[11px] text-slate-500 font-medium">
                        Không dùng hoa góc
                      </div>
                    )}
                    <p className="text-[10px] text-slate-500 line-clamp-1">{preset.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upload Custom Floral Corner for selected target */}
          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-0.5">
                Tải lên ảnh cụm hoa riêng cho {activeFloralTab === 'both' ? 'cả 2 bên' : activeFloralTab === 'left' ? 'góc trái' : 'góc phải'}:
              </label>
              <p className="text-[10.5px] text-slate-500">Định dạng .png, .webp (nền trong suốt), tối đa 2MB</p>
            </div>
            <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold cursor-pointer transition-colors text-xs shrink-0 shadow-2xs">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Tải Hoa Riêng ({activeFloralTab === 'both' ? '2 Bên' : activeFloralTab === 'left' ? 'Góc Trái' : 'Góc Phải'})</span>
              <input type="file" accept="image/*" onChange={handleCustomFloralCorner} className="hidden" />
            </label>
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
