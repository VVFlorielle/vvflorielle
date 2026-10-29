import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import {
  Sparkles,
  Search,
  Filter,
  CheckCircle,
  Truck,
  Heart,
  ShieldCheck,
  ChevronRight,
  PhoneCall,
  Gift,
  BookOpen,
  ArrowRight,
  Clock,
  Copy,
  Check,
  X,
  Layers,
  Award
} from 'lucide-react';
import { CategoryId, BlogArticle } from '../types';
import {
  FloralCornerTopLeft,
  FloralCornerTopRight,
  FloralCornerBottomLeft,
  FloralCornerBottomRight,
  FloatingPetals
} from '../components/FloralHeroOrnaments';

export const PublicStore: React.FC = () => {
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    settings,
    heroConfig,
    promotions,
    articles,
    selectedArticle,
    setSelectedArticle,
    showToast
  } = useStore();

  const [sortOption, setSortOption] = useState<'popular' | 'price-asc' | 'price-desc' | 'newest'>('popular');
  const [priceFilter, setPriceFilter] = useState<'all' | 'under-500' | '500-1000' | 'over-1000'>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Active Category Data
  const currentCategoryData = categories.find((c) => c.id === selectedCategory) || categories[0];

  // Filter products by category, search query, and price range
  const filteredProducts = products.filter((p) => {
    // Category match
    if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) {
      return false;
    }

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchFlower = p.flowerTypes.some((f) => f.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchFlower) {
        return false;
      }
    }

    // Price range match
    if (priceFilter === 'under-500' && p.price >= 500000) return false;
    if (priceFilter === '500-1000' && (p.price < 500000 || p.price > 1000000)) return false;
    if (priceFilter === 'over-1000' && p.price <= 1000000) return false;

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'price-asc') return a.price - b.price;
    if (sortOption === 'price-desc') return b.price - a.price;
    if (sortOption === 'newest') return (b.tag === 'Mới' ? 1 : 0) - (a.tag === 'Mới' ? 1 : 0);
    return b.rating * b.reviewCount - a.rating * a.reviewCount;
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Đã sao chép mã ưu đãi ${code}!`, 'success');
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="space-y-12 pb-20">
      {/* =========================================================================
          1. HERO BANNER OR DEDICATED CATEGORY BANNER
          ========================================================================= */}
      {selectedCategory === 'all' ? (
        /* HOME HERO BANNER (Welcoming, Centered & Lush Botanical Floral Borders) */
        <section className="container pt-4 sm:pt-6">
          <div className="glass-panel p-6 sm:p-12 relative overflow-hidden bg-gradient-to-br from-white/95 via-emerald-50/50 to-rose-50/30 backdrop-blur-2xl rounded-[32px] sm:rounded-[40px] border border-emerald-200/80 shadow-[0_25px_60px_-15px_rgba(5,150,105,0.16),inset_0_1.5px_2px_rgba(255,255,255,1),inset_0_0_24px_rgba(16,185,129,0.05)] text-center transition-all duration-300">
            {/* 1. ARTISTIC BOTANICAL CORNER FLOWERS (Roses, Peonies, Orchids & Leaves) */}
            <FloralCornerTopLeft className="absolute -top-1 -left-1 sm:top-0 sm:left-0 w-28 h-28 sm:w-44 sm:h-44 lg:w-52 lg:h-52 z-0 opacity-90 transition-transform duration-500 hover:scale-105" />
            <FloralCornerTopRight className="absolute -top-1 -right-1 sm:top-0 sm:right-0 w-28 h-28 sm:w-44 sm:h-44 lg:w-52 lg:h-52 z-0 opacity-90 transition-transform duration-500 hover:scale-105" />
            <FloralCornerBottomLeft className="absolute -bottom-1 -left-1 sm:bottom-0 sm:left-0 w-24 h-24 sm:w-36 sm:h-36 lg:w-44 lg:h-44 z-0 opacity-80 hidden sm:block transition-transform duration-500 hover:scale-105" />
            <FloralCornerBottomRight className="absolute -bottom-1 -right-1 sm:bottom-0 sm:right-0 w-24 h-24 sm:w-36 sm:h-36 lg:w-44 lg:h-44 z-0 opacity-80 hidden sm:block transition-transform duration-500 hover:scale-105" />

            {/* 2. GENTLE FLOATING FLOWER PETALS */}
            <FloatingPetals />

            {/* 3. HERO CONTENT CONTAINER */}
            <div className="relative z-10 max-w-3xl mx-auto space-y-4 sm:space-y-5">
              {/* Badge Centered */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/95 text-emerald-800 text-xs font-bold border border-emerald-300/80 shadow-xs mx-auto">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span>{heroConfig.badge || 'Tiệm Hoa Tươi Nghệ Thuật V&V Florielle'}</span>
              </div>

              {/* Welcome Title Centered - "Tiệm Hoa V&V Florielle" on its own single grand line */}
              <div className="space-y-1.5 sm:space-y-2.5">
                <div className="text-sm sm:text-lg md:text-xl font-bold text-slate-700 tracking-tight flex items-center justify-center gap-2">
                  <span className="text-emerald-500/70 text-xs sm:text-sm">✦</span>
                  <span>Chào Mừng Đến Với</span>
                  <span className="text-emerald-500/70 text-xs sm:text-sm">✦</span>
                </div>

                <div className="overflow-x-auto no-scrollbar py-0.5">
                  <h1 className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-800 via-emerald-600 to-teal-700 whitespace-nowrap inline-block drop-shadow-xs px-1">
                    Tiệm Hoa V&V Florielle
                  </h1>
                </div>

                {/* Subtitle / Slogan with delicate floral ornaments */}
                <div className="flex items-center justify-center gap-2 sm:gap-3 text-slate-700 font-semibold text-xs sm:text-base md:text-lg tracking-wide pt-0.5">
                  <span className="text-emerald-500/80 text-xs sm:text-sm">✤ ✿ ✤</span>
                  <span className="italic font-serif">Nghệ Thuật Trao Gửi Yêu Thương</span>
                  <span className="text-emerald-500/80 text-xs sm:text-sm">✤ ✿ ✤</span>
                </div>
              </div>

              {/* Subtitle Centered */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto px-2">
                {heroConfig.subtitle}
              </p>

              {/* Quick Hero Actions Centered */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setSelectedCategory('khai-truong')}
                  className="btn-primary text-xs py-3 px-6 rounded-2xl shadow-lg shadow-emerald-700/20 flex items-center gap-2 transition-transform hover:scale-105"
                >
                  <span>{heroConfig.ctaText}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <a
                  href={`tel:${settings.hotline}`}
                  className="btn-secondary text-xs py-3 px-6 rounded-2xl border border-slate-300/80 hover:bg-white flex items-center gap-2 transition-transform hover:scale-105"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{heroConfig.ctaSecondaryText}: {settings.hotline}</span>
                </a>
              </div>

              {/* 3 Key Trust Markers Centered */}
              <div className="pt-3 border-t border-emerald-100/80 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-[11px] sm:text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Hoa tươi loại 1 nhập mới mỗi sáng</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Giao hỏa tốc 60 - 90P Hà Nội</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>Chụp ảnh gửi duyệt qua Zalo</span>
                </div>
              </div>
            </div>

            {/* Subtle background ambient graphic decoration */}
            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[550px] h-[320px] rounded-full bg-gradient-to-tr from-emerald-300/20 via-pink-200/15 to-transparent blur-3xl pointer-events-none" />
          </div>
        </section>
      ) : (
        /* DEDICATED CATEGORY LANDING BANNER */
        <section className="container pt-6">
          <div className="relative rounded-[32px] overflow-hidden shadow-2xl border border-white/80 bg-slate-900 text-white min-h-[220px] sm:min-h-[260px] flex items-center">
            {/* Background Cover Photo */}
            <img
              src={currentCategoryData.bannerUrl || currentCategoryData.imageUrl}
              alt={currentCategoryData.name}
              className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/70 to-transparent" />

            <div className="relative z-10 p-6 sm:p-10 max-w-2xl space-y-3">
              {/* Breadcrumbs */}
              <div className="flex items-center gap-2 text-xs text-emerald-300 font-medium">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="hover:underline hover:text-white"
                >
                  Trang chủ
                </button>
                <span>/</span>
                <span className="text-white font-semibold">{currentCategoryData.name}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {currentCategoryData.name}
              </h1>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-lg">
                {currentCategoryData.description}. {currentCategoryData.tagline}
              </p>

              <div className="pt-2 flex items-center gap-3">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/40">
                  {filteredProducts.length} mẫu hoa tươi có sẵn
                </span>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="text-xs text-slate-300 hover:text-white underline"
                >
                  Xem tất cả danh mục
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          2. VISUAL CATEGORY CARDS ("KHÁM PHÁ THEO CHỦ ĐỀ & DỊP TẶNG")
          ========================================================================= */}
      {selectedCategory === 'all' && (
        <section className="container">
          <div className="flex items-center justify-between pb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-600" />
                <span>Danh Mục Hoa Tươi Nghệ Thuật</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Tuyển chọn theo từng sự kiện ý nghĩa, thiết kế sang trọng & hoa tươi mới mỗi sáng
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {categories.filter((c) => c.id !== 'all').map((cat) => {
              const count = products.filter((p) => p.categoryId === cat.id).length;
              return (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="glass-card rounded-[24px] overflow-hidden border border-white/80 p-2 cursor-pointer group hover:scale-[1.03] hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-100 shadow-inner">
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-2 right-2 bg-slate-900/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {count} mẫu
                    </div>
                  </div>

                  <div className="p-2 pt-2.5 text-center">
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                      {cat.tagline || cat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* =========================================================================
          3. SCROLLABLE CATEGORY PILLS BAR & FILTERS
          ========================================================================= */}
      <section id="categories-section" className="container scroll-mt-20">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {selectedCategory === 'all' ? 'Tất Cả Mẫu Hoa' : currentCategoryData.name}
            </h3>
            <span className="text-xs text-slate-400">
              ({sortedProducts.length} mẫu hiển thị)
            </span>
          </div>

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-rose-600 hover:underline self-start sm:self-auto"
            >
              Xóa tìm kiếm "{searchQuery}"
            </button>
          )}
        </div>

        {/* Scrollable Category Filter Pills */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-3 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? 'glass-btn-emerald-jewel scale-[1.02] shadow-md'
                  : 'glass-btn-base text-slate-700'
              }`}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Filter and Sorting Control Bar */}
        <div className="glass-panel p-3 sm:p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs rounded-2xl border border-white/90 shadow-md">
          {/* Price Filters */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-500 font-medium flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5 text-emerald-600" />
              <span>Khoảng giá:</span>
            </span>
            <button
              onClick={() => setPriceFilter('all')}
              className={`px-3 py-1 rounded-xl transition-all text-xs ${
                priceFilter === 'all'
                  ? 'glass-btn-emerald-jewel font-semibold'
                  : 'glass-btn-base text-slate-600'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setPriceFilter('under-500')}
              className={`px-3 py-1 rounded-xl transition-all text-xs ${
                priceFilter === 'under-500'
                  ? 'glass-btn-emerald-jewel font-semibold'
                  : 'glass-btn-base text-slate-600'
              }`}
            >
              Dưới 500k
            </button>
            <button
              onClick={() => setPriceFilter('500-1000')}
              className={`px-3 py-1 rounded-xl transition-all text-xs ${
                priceFilter === '500-1000'
                  ? 'glass-btn-emerald-jewel font-semibold'
                  : 'glass-btn-base text-slate-600'
              }`}
            >
              500k - 1 triệu
            </button>
            <button
              onClick={() => setPriceFilter('over-1000')}
              className={`px-3 py-1 rounded-xl transition-all text-xs ${
                priceFilter === 'over-1000'
                  ? 'glass-btn-emerald-jewel font-semibold'
                  : 'glass-btn-base text-slate-600'
              }`}
            >
              Trên 1 triệu
            </button>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Sắp xếp:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              className="glass-input text-xs py-1 px-3 rounded-xl border border-white/90 focus:outline-none"
            >
              <option value="popular">Phổ biến nhất</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
              <option value="newest">Mới cập nhật</option>
            </select>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. MAIN PRODUCTS GRID (LARGE ASPECT-3/4 PHOTOGRAPHY)
          ========================================================================= */}
      <section className="container">
        {sortedProducts.length === 0 ? (
          <div className="glass-panel p-12 text-center text-slate-500 space-y-3 rounded-3xl">
            <p className="text-sm">Không tìm thấy mẫu hoa phù hợp với tiêu chí lọc của bạn.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setPriceFilter('all');
              }}
              className="btn-secondary text-xs py-2 px-4 rounded-xl"
            >
              Đặt lại tất cả bộ lọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* =========================================================================
          5. PROMOTIONS & EXCLUSIVE VOUCHERS SECTION
          ========================================================================= */}
      <section className="container pt-4">
        <div className="glass-panel p-6 sm:p-8 rounded-[32px] border border-white/80 bg-gradient-to-r from-rose-50/70 via-white/80 to-amber-50/70 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <Gift className="w-5 h-5 text-rose-600" />
                <span>Chương Trình Khuyến Mại & Mã Giảm Giá Độc Quyền</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Áp dụng trực tiếp tại giỏ hàng để nhận ưu đãi tốt nhất từ V&V Florielle
              </p>
            </div>
            <span className="text-[11px] font-semibold text-rose-700 bg-rose-100/80 px-3 py-1 rounded-full self-start sm:self-auto">
              Ưu Đãi Hôm Nay
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {promotions.map((promo) => (
              <div
                key={promo.id}
                className="p-4 rounded-2xl bg-white/90 border border-rose-200/80 shadow-sm flex flex-col justify-between space-y-3 relative overflow-hidden"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 uppercase tracking-wide">
                      {promo.badge}
                    </span>
                    <span className="text-[10px] text-slate-400">HSD: {promo.validUntil}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 leading-snug">{promo.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{promo.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="font-mono font-extrabold text-sm text-slate-900 tracking-wider bg-slate-50 px-2 py-1 rounded-lg border border-dashed border-rose-300">
                    {promo.code}
                  </div>
                  <button
                    onClick={() => handleCopyCode(promo.code)}
                    className="btn-secondary text-[11px] py-1.5 px-3 rounded-xl flex items-center gap-1 border-rose-200 text-rose-700 hover:bg-rose-50"
                  >
                    {copiedCode === promo.code ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === promo.code ? 'Đã chép' : 'Sao chép'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. FLORIST BLOG & CẨM NANG HOA TƯƠI
          ========================================================================= */}
      <section className="container">
        <div className="flex items-center justify-between pb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <span>Cẩm Nang & Ý Nghĩa Hoa Tươi</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Kinh nghiệm chăm hoa, ý nghĩa các loài hoa và nghệ thuật tặng hoa tinh tế
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((art) => (
            <div
              key={art.id}
              onClick={() => setSelectedArticle(art)}
              className="glass-card rounded-[24px] overflow-hidden border border-white/80 cursor-pointer group hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                <img
                  src={art.imageUrl}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-900/70 backdrop-blur-md text-white">
                  {art.category}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{art.readTime}</span>
                    <span>• {art.publishedAt}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                    {art.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {art.summary}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center text-xs font-semibold text-emerald-700 gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Đọc tiếp</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          7. SERVICE PROMISE & COMMITMENT
          ========================================================================= */}
      <section className="container">
        <div className="glass-panel p-8 bg-gradient-to-r from-emerald-50/70 via-white/80 to-emerald-50/70 rounded-[32px] border border-white/80">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="text-lg font-bold text-slate-900">
              Quy Trình Phục Vụ Tại V&V Florielle
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Chuyên nghiệp, nhanh chóng và tận tâm trong từng cành hoa trao tay
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/60 shadow-sm space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center">
                1
              </div>
              <h4 className="font-bold text-slate-800">Chọn mẫu hoa</h4>
              <p className="text-slate-500 text-[11px]">
                Chọn mẫu có sẵn hoặc yêu cầu thiết kế theo tone màu và ngân sách của bạn.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/60 shadow-sm space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center">
                2
              </div>
              <h4 className="font-bold text-slate-800">Cắm hoa & In thiệp</h4>
              <p className="text-slate-500 text-[11px]">
                Florist lành nghề tiến hành cắm hoa tươi và in băng rôn chúc mừng sang trọng.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/60 shadow-sm space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center">
                3
              </div>
              <h4 className="font-bold text-slate-800">Duyệt ảnh thực tế</h4>
              <p className="text-slate-500 text-[11px]">
                Chụp ảnh hoa gửi qua Zalo cho bạn duyệt trước khi shipper lên đường giao.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/60 shadow-sm space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center">
                4
              </div>
              <h4 className="font-bold text-slate-800">Giao hoa tận tay</h4>
              <p className="text-slate-500 text-[11px]">
                Giao hoa đúng giờ hẹn, lịch sự và gửi thông báo xác nhận hoàn thành đơn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. ARTICLE READER MODAL
          ========================================================================= */}
      {selectedArticle && (
        <div className="glass-overlay" onClick={() => setSelectedArticle(null)}>
          <div
            className="glass-modal-content p-6 sm:p-8 max-w-2xl w-full rounded-[28px] border border-white/90 shadow-2xl bg-white/95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                {selectedArticle.category}
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                {selectedArticle.title}
              </h2>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span>{selectedArticle.publishedAt}</span>
                <span>• {selectedArticle.readTime}</span>
              </div>

              <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-100">
                <img
                  src={selectedArticle.imageUrl}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed pt-2">
                {selectedArticle.content.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">V&V Florielle Editorial</span>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="btn-primary text-xs py-2 px-4 rounded-xl"
                >
                  Đóng bài viết
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
