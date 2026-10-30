import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { CategoryId } from '../types';
import {
  Sparkles,
  Search,
  Filter,
  ArrowUpDown,
  Flower2,
  PhoneCall,
  CheckCircle2,
  ChevronRight,
  Home
} from 'lucide-react';

export const CatalogPage: React.FC = () => {
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    settings,
    setCurrentView
  } = useStore();

  const [priceSort, setPriceSort] = useState<'default' | 'asc' | 'desc'>('default');
  const [priceRange, setPriceRange] = useState<'all' | 'under500' | '500to1000' | 'over1000'>('all');

  // Filter products
  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchFlower = p.flowerTypes.some((f) => f.toLowerCase().includes(q));
      const matchDesc = p.description.toLowerCase().includes(q);
      if (!matchName && !matchFlower && !matchDesc) return false;
    }
    if (priceRange === 'under500' && p.price >= 500000) return false;
    if (priceRange === '500to1000' && (p.price < 500000 || p.price > 1000000)) return false;
    if (priceRange === 'over1000' && p.price <= 1000000) return false;
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (priceSort === 'asc') return a.price - b.price;
    if (priceSort === 'desc') return b.price - a.price;
    return 0;
  });

  return (
    <div className="container py-6 space-y-6 animate-in fade-in duration-300">
      {/* Breadcrumb & Title Hero */}
      <div className="rounded-[32px] p-6 sm:p-10 bg-gradient-to-br from-emerald-50/95 via-white/95 to-rose-50/70 border border-emerald-200/80 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <button
              onClick={() => setCurrentView('store')}
              className="hover:underline flex items-center gap-1 text-slate-500 hover:text-emerald-700"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Trang chủ</span>
            </button>
            <span className="text-slate-300">/</span>
            <span className="text-emerald-900 font-bold">Tất Cả Mẫu Hoa Nghệ Thuật</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-emerald-950 tracking-tight">
            Bộ Sưu Tập Mẫu Hoa Tươi Nghệ Thuật
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Tuyển chọn các thiết kế hoa tươi loại 1 từ Đà Lạt & hoa ngoại nhập khẩu Ecuador. Cắm hoa thủ công tinh tế, trao gửi trọn vẹn yêu thương và lời chúc tốt đẹp nhất.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-3xl border border-emerald-200/60 shadow-sm space-y-3">
        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                : 'bg-white/80 text-slate-700 hover:bg-emerald-50'
            }`}
          >
            🌸 Tất Cả ({products.length})
          </button>
          {categories.map((cat) => {
            const count = products.filter((p) => p.categoryId === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                    : 'bg-white/80 text-slate-700 hover:bg-emerald-50'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-200/60">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên hoa, loài hoa (hồng, baby, hướng dương...)"
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-white/90 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-slate-800"
            />
          </div>

          {/* Filters & Sorting */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Price Range Filter */}
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value as any)}
              className="py-2 px-3 rounded-xl text-xs bg-white/90 border border-slate-200 text-slate-700 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all">Khoảng giá: Tất cả</option>
              <option value="under500">Dưới 500.000đ</option>
              <option value="500to1000">500.000đ - 1.000.000đ</option>
              <option value="over1000">Trên 1.000.000đ</option>
            </select>

            {/* Price Sort */}
            <select
              value={priceSort}
              onChange={(e) => setPriceSort(e.target.value as any)}
              className="py-2 px-3 rounded-xl text-xs bg-white/90 border border-slate-200 text-slate-700 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="default">Sắp xếp: Mặc định</option>
              <option value="asc">Giá: Thấp đến cao</option>
              <option value="desc">Giá: Cao đến thấp</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div>
        <div className="flex items-center justify-between pb-3">
          <p className="text-xs font-bold text-slate-600">
            Hiển thị <span className="text-emerald-800 font-extrabold">{sortedProducts.length}</span> mẫu hoa phù hợp
          </p>
          {(selectedCategory !== 'all' || searchQuery || priceRange !== 'all') && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setPriceRange('all');
                setPriceSort('default');
              }}
              className="text-xs text-rose-600 hover:underline font-semibold"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>

        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 glass-panel rounded-3xl border border-dashed border-slate-300">
            <Flower2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-base text-slate-700">Không tìm thấy mẫu hoa phù hợp</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Thử tìm kiếm với từ khóa khác hoặc liên hệ tiệm hoa để được tư vấn cắm hoa theo yêu cầu riêng!
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setPriceRange('all');
              }}
              className="mt-4 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-md"
            >
              Xem tất cả mẫu hoa
            </button>
          </div>
        )}
      </div>

      {/* Custom Floral Banner CTA */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg sm:text-xl font-bold">Bạn Cần Thiết Kế Mẫu Hoa Riêng Biệt?</h3>
          <p className="text-xs text-emerald-100 max-w-md leading-relaxed">
            Florist tại V&V Florielle nhận thiết kế hoa theo tông màu phong thủy, hoa khai trương doanh nghiệp, hoa cưới và sự kiện theo ngân sách của bạn.
          </p>
        </div>
        <a
          href={`https://zalo.me/${settings.hotline.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-6 py-3 rounded-2xl bg-white text-emerald-900 font-extrabold text-xs shadow-lg hover:bg-emerald-50 transition-all flex items-center gap-2"
        >
          <PhoneCall className="w-4 h-4 text-emerald-700" />
          <span>Tư Vấn Zalo 24/7 ({settings.hotline})</span>
        </a>
      </div>
    </div>
  );
};
