import React from 'react';
import { Filter } from 'lucide-react';
import { FlowerCategory, CategoryId } from '../../types';

interface CategoryPillFiltersProps {
  categories: FlowerCategory[];
  selectedCategory: CategoryId;
  setSelectedCategory: (id: CategoryId) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  priceFilter: 'all' | 'under-500' | '500-1000' | 'over-1000';
  setPriceFilter: (p: 'all' | 'under-500' | '500-1000' | 'over-1000') => void;
  sortOption: 'popular' | 'price-asc' | 'price-desc' | 'newest';
  setSortOption: (s: 'popular' | 'price-asc' | 'price-desc' | 'newest') => void;
  currentCategoryName: string;
  displayedCount: number;
  totalFilteredCount: number;
}

export const CategoryPillFilters: React.FC<CategoryPillFiltersProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  priceFilter,
  setPriceFilter,
  sortOption,
  setSortOption,
  currentCategoryName,
  displayedCount,
  totalFilteredCount
}) => {
  return (
    <section id="categories-section" className="container scroll-mt-20">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            {selectedCategory === 'all' ? 'Tất Cả Mẫu Hoa' : currentCategoryName}
          </h3>
          <span className="text-xs text-slate-400">
            ({displayedCount} mẫu hiển thị{totalFilteredCount > 8 ? ` / ${totalFilteredCount} mẫu` : ''})
          </span>
        </div>

        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-rose-600 hover:underline self-start sm:self-auto cursor-pointer"
          >
            Xóa tìm kiếm "{searchQuery}"
          </button>
        )}
      </div>

      {/* Category Filter Pills: 2-3 hàng tự co giãn flex-wrap trên mobile (Chuẩn theo ý bạn, không bị khuất ngang) */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-2 pb-3.5 px-1 -mt-1">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
            selectedCategory === 'all'
              ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/25 ring-2 ring-emerald-600/20'
              : 'bg-white/90 text-slate-700 border border-emerald-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 shadow-xs'
          }`}
        >
          🌿 Tất Cả Mẫu Hoa
        </button>
        {categories
          .filter((c) => c.id !== 'all')
          .map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/25 ring-2 ring-emerald-600/20 font-bold'
                  : 'bg-white/90 text-slate-700 border border-emerald-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 shadow-xs'
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
            className={`px-3 py-1 rounded-xl transition-all text-xs cursor-pointer ${
              priceFilter === 'all'
                ? 'glass-btn-emerald-jewel font-semibold'
                : 'glass-btn-base text-slate-600'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setPriceFilter('under-500')}
            className={`px-3 py-1 rounded-xl transition-all text-xs cursor-pointer ${
              priceFilter === 'under-500'
                ? 'glass-btn-emerald-jewel font-semibold'
                : 'glass-btn-base text-slate-600'
            }`}
          >
            Dưới 500k
          </button>
          <button
            onClick={() => setPriceFilter('500-1000')}
            className={`px-3 py-1 rounded-xl transition-all text-xs cursor-pointer ${
              priceFilter === '500-1000'
                ? 'glass-btn-emerald-jewel font-semibold'
                : 'glass-btn-base text-slate-600'
            }`}
          >
            500k - 1 triệu
          </button>
          <button
            onClick={() => setPriceFilter('over-1000')}
            className={`px-3 py-1 rounded-xl transition-all text-xs cursor-pointer ${
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
            className="glass-input text-xs py-1 px-3 rounded-xl border border-white/90 focus:outline-none cursor-pointer"
          >
            <option value="popular">Phổ biến nhất</option>
            <option value="price-asc">Giá tăng dần</option>
            <option value="price-desc">Giá giảm dần</option>
            <option value="newest">Mới cập nhật</option>
          </select>
        </div>
      </div>
    </section>
  );
};
