/**
 * V&V Florielle - Real-Time Dynamic Theme & Typography Engine
 * Applies font family and primary/secondary color changes across entire web & admin,
 * while strictly preserving fixed business semantic colors (Store status, Hotline, Freeship, Flash Deal, VietQR).
 */

export interface ThemeConfig {
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
}

const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return { r, g, b };
  }
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return { r, g, b };
  }
  return null;
};

const adjustBrightness = (hex: string, percent: number): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const factor = 1 + percent / 100;
  const r = Math.min(255, Math.max(0, Math.round(rgb.r * factor)));
  const g = Math.min(255, Math.max(0, Math.round(rgb.g * factor)));
  const b = Math.min(255, Math.max(0, Math.round(rgb.b * factor)));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
  const rgb = hexToRgb(hex) || { r: 5, g: 150, b: 105 };
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

const hslToHex = (h: number, s: number, l: number): string => {
  const sNorm = Math.max(0, Math.min(100, s)) / 100;
  const lNorm = Math.max(0, Math.min(100, l)) / 100;
  const a = sNorm * Math.min(lNorm, 1 - lNorm);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = lNorm - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

// Known Google Fonts that can be dynamically requested if not already present
const GOOGLE_FONTS_MAP: Record<string, string> = {
  'Pacifico': 'family=Pacifico',
  'Dancing Script': 'family=Dancing+Script:wght@400..700',
  'Caveat': 'family=Caveat:wght@400..700',
  'Comfortaa': 'family=Comfortaa:wght@300..700',
  'Satisfy': 'family=Satisfy',
  'Great Vibes': 'family=Great+Vibes',
  'Patrick Hand': 'family=Patrick+Hand',
  'Marck Script': 'family=Marck+Script',
  'Quicksand': 'family=Quicksand:wght@300..700',
  'Nunito': 'family=Nunito:ital,wght@0,300..900;1,300..900',
  'Playfair Display': 'family=Playfair+Display:ital,wght@0,400..900;1,400..900',
  'Plus Jakarta Sans': 'family=Plus+Jakarta+Sans:ital,wght@0,400..800;1,400..800',
  'Inter': 'family=Inter:wght@300..900',
  'Lora': 'family=Lora:ital,wght@0,400..700;1,400..700',
  'Montserrat': 'family=Montserrat:ital,wght@0,300..900;1,300..900',
  'Cinzel': 'family=Cinzel:wght@400..900',
  'Cormorant Garamond': 'family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700'
};

export const applyTheme = (config: ThemeConfig) => {
  if (typeof document === 'undefined') return;

  const primary = config.primaryColor?.trim() || '#059669';
  const secondary = config.secondaryColor?.trim() || adjustBrightness(primary, -15);
  const font = config.fontFamily?.trim() || 'Plus Jakarta Sans';

  const rgb = hexToRgb(primary) || { r: 5, g: 150, b: 105 };
  const light = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.08)`;
  const borderGentle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.35)`;
  const glow = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.28)`;
  const subtle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.04)`;

  // Tinh chỉnh gam màu ngọc lục bảo (Emerald Jewel Tone) theo chuẩn nút "Tất cả" ở bộ lọc khoảng giá (Ảnh 3):
  // Đậm đà, tươi sáng vừa phải, nổi bật chữ trắng tinh tế, TUYỆT ĐỐI KHÔNG CHÓI / KHÔNG NEON.
  const hsl = hexToHsl(primary);
  // Giới hạn độ bão hòa (Saturation) tối đa 80% để loại bỏ hoàn toàn ánh neon chói gắt
  const jewelSat = Math.min(hsl.s, 80);
  // Chân màu đậm đà (31-34% lightness) như #059669
  const jewelBaseLight = Math.max(30, Math.min(34, hsl.l));
  // Đầu màu sáng hơn chút (40-43% lightness) như #10b981
  const jewelBrightLight = Math.min(43, jewelBaseLight + 8);

  const jewelSolid = hslToHex(hsl.h, jewelSat, jewelBaseLight);       // Đậm đà nền (#059669)
  const jewelBright = hslToHex(hsl.h, jewelSat, jewelBrightLight);    // Sáng hơn một chút (#10b981)
  const jewelDeep = adjustBrightness(jewelSolid, -12);               // Hover sâu hơn (#047857)
  const jewelRgb = hexToRgb(jewelSolid) || rgb;
  const jewelGlow = `rgba(${jewelRgb.r}, ${jewelRgb.g}, ${jewelRgb.b}, 0.28)`;

  // 1. Ensure Google Font is loaded dynamically
  if (GOOGLE_FONTS_MAP[font]) {
    const fontLinkId = `google-font-${font.replace(/\s+/g, '-').toLowerCase()}`;
    if (!document.getElementById(fontLinkId)) {
      const link = document.createElement('link');
      link.id = fontLinkId;
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?${GOOGLE_FONTS_MAP[font]}&display=swap`;
      document.head.appendChild(link);
    }
  }

  // 2. Set root CSS custom properties
  const root = document.documentElement;
  root.style.setProperty('--primary-color', primary);
  root.style.setProperty('--primary-hover', secondary);
  root.style.setProperty('--primary-light', light);
  root.style.setProperty('--primary-border', borderGentle);
  root.style.setProperty('--primary-glow', glow);
  root.style.setProperty('--primary-subtle', subtle);
  root.style.setProperty('--brand-font', `'${font}', 'Plus Jakarta Sans', sans-serif`);

  // 3. Inject / Update High-Specificity Theme Stylesheet
  const styleId = 'vvf-dynamic-theme-style';
  let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = styleId;
    document.head.appendChild(styleEl);
  }

  styleEl.textContent = `
    /* ========================================================
       V&V Florielle - Dynamic Theme Engine Output
       Primary: ${primary} | Hover: ${secondary} | Font: ${font}
       ======================================================== */

    /* Typography across entire storefront and management portal */
    body, button, input, select, textarea, .brand-font {
      font-family: '${font}', 'Plus Jakarta Sans', sans-serif !important;
    }

    h1, h2, h3, h4, h5, h6, .brand-title, .font-serif {
      font-family: '${font}', 'Plus Jakarta Sans', serif !important;
    }

    /* Monospace elements stay readable */
    code, pre, kbd, samp, .font-mono {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace !important;
    }

    /* Primary CTA Buttons across storefront & admin */
    .btn-primary {
      background: linear-gradient(135deg, ${jewelBright} 0%, ${jewelSolid} 100%) !important;
      color: #ffffff !important;
      box-shadow: 0 4px 14px ${jewelGlow}, inset 0 1px 1px 0 rgba(255, 255, 255, 0.4) !important;
      border: 1px solid rgba(255, 255, 255, 0.35) !important;
    }

    .btn-primary:hover {
      background: linear-gradient(135deg, ${jewelSolid} 0%, ${jewelDeep} 100%) !important;
      box-shadow: 0 6px 18px ${jewelGlow} !important;
    }

    /* Product Card Action Buttons (Ảnh 1 & 2) */
    .btn-add-cart {
      border: 1.5px solid ${borderGentle} !important;
      background-color: ${light} !important;
      color: ${primary} !important;
      font-weight: 700 !important;
      transition: all 0.2s ease !important;
    }
    .btn-add-cart:hover {
      background-color: ${subtle} !important;
      border-color: ${primary} !important;
      color: ${primary} !important;
    }
    .btn-add-cart svg {
      color: ${primary} !important;
    }

    .btn-buy-now {
      background: linear-gradient(135deg, ${jewelBright} 0%, ${jewelSolid} 100%) !important;
      color: #ffffff !important;
      box-shadow: 0 4px 12px ${jewelGlow}, inset 0 1px 1px 0 rgba(255, 255, 255, 0.4) !important;
      border: 1px solid rgba(255, 255, 255, 0.3) !important;
      transition: all 0.2s ease !important;
    }
    .btn-buy-now:hover {
      background: linear-gradient(135deg, ${jewelSolid} 0%, ${jewelDeep} 100%) !important;
      box-shadow: 0 6px 16px ${jewelGlow} !important;
    }

    /* Large "Xem thêm tất cả 54 mẫu hoa" Button (Ảnh 1 & 2) */
    .btn-view-all-flowers {
      background: linear-gradient(135deg, ${jewelBright} 0%, ${jewelSolid} 100%) !important;
      color: #ffffff !important;
      box-shadow: 0 6px 18px ${jewelGlow}, inset 0 1px 1px 0 rgba(255, 255, 255, 0.4) !important;
      border: 1px solid rgba(255, 255, 255, 0.35) !important;
      transition: all 0.2s ease !important;
    }
    .btn-view-all-flowers:hover {
      background: linear-gradient(135deg, ${jewelSolid} 0%, ${jewelDeep} 100%) !important;
      box-shadow: 0 8px 24px ${jewelGlow} !important;
    }

    /* Management Action Buttons on Cards (Ảnh 4: "Mở popup", "Truy cập", "Phát sóng", "Mở Quản Lý") */
    .management-action-btn {
      border: 1.5px solid ${borderGentle} !important;
      background-color: ${light} !important;
      color: ${primary} !important;
      font-weight: 700 !important;
      display: inline-block !important;
      transition: all 0.2s ease !important;
    }
    .management-action-btn:hover {
      background-color: ${primary} !important;
      border-color: ${primary} !important;
      color: #ffffff !important;
      box-shadow: 0 4px 12px ${glow} !important;
    }

    /* Desktop Navigation Dropdown Menu (Ảnh 5) */
    .header-dropdown-item {
      transition: background-color 0.15s ease, color 0.15s ease !important;
    }
    .header-dropdown-item:hover,
    .header-dropdown-item.active {
      background-color: ${light} !important;
    }
    .header-dropdown-item:hover .item-title,
    .header-dropdown-item.active .item-title {
      color: ${primary} !important;
    }
    .header-dropdown-badge {
      color: ${primary} !important;
    }
    .header-dropdown-icon {
      background-color: ${light} !important;
      color: ${primary} !important;
    }
    .active-nav-pill {
      color: ${primary} !important;
      border-color: ${borderGentle} !important;
    }

    /* Product Price: Đỏ cam chuẩn thương mại điện tử - Không bị đổi theo màu branding (Ảnh 3) */
    .product-price,
    .fixed-price-red-orange {
      color: #ee4d2d !important;
      font-weight: 900 !important;
    }

    /* Scrollbars: Đồng bộ theo màu chủ đạo theme */
    ::-webkit-scrollbar-thumb {
      background-color: ${glow} !important;
      border-radius: 9999px !important;
    }
    ::-webkit-scrollbar-thumb:hover {
      background-color: ${primary} !important;
    }

    /* Dynamic Secondary Button Hover */
    .btn-secondary:hover {
      border-color: ${primary} !important;
      color: ${primary} !important;
    }

    /* Primary Accent Backgrounds (Excluding Fixed Semantic Badges) */
    button.bg-emerald-600:not(.fixed-semantic),
    button.bg-emerald-700:not(.fixed-semantic),
    a.bg-emerald-600:not(.fixed-semantic),
    a.bg-emerald-700:not(.fixed-semantic),
    .theme-active-tab {
      background-color: ${primary} !important;
      color: #ffffff !important;
    }

    /* Active Category Filter Pill (Chuẩn màu ngọc lục bảo sang trọng theo nút Tất Cả khoảng giá - Ảnh 3) */
    .active-category-pill {
      background: linear-gradient(135deg, ${jewelBright} 0%, ${jewelSolid} 100%) !important;
      color: #ffffff !important;
      border: 1px solid rgba(255, 255, 255, 0.45) !important;
      box-shadow: 0 4px 14px ${jewelGlow}, inset 0 1px 1px 0 rgba(255, 255, 255, 0.45) !important;
      font-weight: 800 !important;
    }
    .active-category-pill svg {
      color: #ffffff !important;
      stroke: #ffffff !important;
    }

    button.hover\\:bg-emerald-700:hover:not(.fixed-semantic),
    button.hover\\:bg-emerald-800:hover:not(.fixed-semantic),
    a.hover\\:bg-emerald-700:hover:not(.fixed-semantic),
    a.hover\\:bg-emerald-800:hover:not(.fixed-semantic) {
      background-color: ${secondary} !important;
    }

    /* Light Tints & Badges (Matches exact classes, avoiding hover modifiers) */
    .theme-light-bg,
    .bg-emerald-50,
    .bg-emerald-100,
    [class~="bg-emerald-50"],
    [class~="bg-emerald-100"] {
      background-color: ${light} !important;
    }

    /* Primary Text Highlights: Chỉ áp dụng cho chữ mang class text-emerald-700/800/900 trực tiếp,
       TUYỆT ĐỐI KHÔNG ép màu lên các nút mang hover:text-emerald-700 khi chưa hover (Ảnh 1 & 2 menu) */
    .theme-text-primary,
    .text-emerald-700:not(.fixed-semantic):not(.fixed-price-red-orange):not(.product-price),
    .text-emerald-800:not(.fixed-semantic):not(.fixed-price-red-orange):not(.product-price),
    .text-emerald-900:not(.fixed-semantic):not(.fixed-price-red-orange):not(.product-price),
    [class~="text-emerald-700"]:not(.fixed-semantic):not(.fixed-price-red-orange):not(.product-price),
    [class~="text-emerald-800"]:not(.fixed-semantic):not(.fixed-price-red-orange):not(.product-price),
    [class~="text-emerald-900"]:not(.fixed-semantic):not(.fixed-price-red-orange):not(.product-price) {
      color: ${primary} !important;
    }

    /* Hiệu ứng Hover chính xác cho chữ */
    .hover\\:text-emerald-700:hover:not(.fixed-semantic),
    .hover\\:text-emerald-800:hover:not(.fixed-semantic),
    [class~="hover:text-emerald-700"]:hover:not(.fixed-semantic),
    [class~="hover:text-emerald-800"]:hover:not(.fixed-semantic) {
      color: ${primary} !important;
    }

    /* Primary Border Accents */
    .theme-border-primary,
    .border-emerald-200:not(.fixed-semantic),
    .border-emerald-300:not(.fixed-semantic),
    .border-emerald-400:not(.fixed-semantic),
    .border-emerald-500:not(.fixed-semantic),
    [class~="border-emerald-200"]:not(.fixed-semantic),
    [class~="border-emerald-300"]:not(.fixed-semantic),
    [class~="border-emerald-400"]:not(.fixed-semantic),
    [class~="border-emerald-500"]:not(.fixed-semantic) {
      border-color: ${borderGentle} !important;
    }

    /* Floating Scroll To Top Button - Luôn đồng bộ chuẩn màu chủ đề viền & mũi tên (Ảnh 1) */
    .btn-scroll-to-top {
      border: 1.5px solid ${borderGentle} !important;
      background-color: rgba(255, 255, 255, 0.96) !important;
      color: ${primary} !important;
      box-shadow: 0 4px 16px ${glow} !important;
    }
    .btn-scroll-to-top:hover {
      background-color: ${light} !important;
      border-color: ${primary} !important;
      color: ${primary} !important;
    }
    .btn-scroll-to-top svg {
      color: ${primary} !important;
      stroke: ${primary} !important;
    }

    /* Desktop Navigation Menu Links Hover */
    .nav-menu-pill:hover {
      color: ${primary} !important;
      background-color: ${light} !important;
    }
    .nav-menu-pill:hover svg {
      color: ${primary} !important;
    }

    /* Ambient Background Layer Gradient Glow */
    .ambient-blob-1 {
      background: radial-gradient(circle, ${glow} 0%, ${subtle} 55%, transparent 75%) !important;
    }

    /* Text Selection & Inputs */
    ::selection {
      background-color: ${light} !important;
      color: ${primary} !important;
    }

    input:focus, select:focus, textarea:focus {
      border-color: ${primary} !important;
      outline-color: ${primary} !important;
    }
  `;
};
