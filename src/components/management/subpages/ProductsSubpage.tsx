import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Pencil,
  ArrowLeft,
  Percent,
  Sparkles,
  Search,
  Flower2,
  AlertCircle,
  Tag as TagIcon
} from 'lucide-react';
import { FlowerProduct, FlowerCategory, CategoryId } from '../../../types';
import { ActionConfirmModal } from '../ManagementModals';

interface ProductsSubpageProps {
  products: FlowerProduct[];
  categories?: FlowerCategory[];
  onBackToDashboard: () => void;
  onOpenAddProduct: () => void;
  onOpenEditProduct: (product: FlowerProduct) => void;
  onOpenBulkDiscount: () => void;
  deleteProduct: (id: string) => void;
  formatPrice: (p: number) => string;
  title?: string;
}

// Subcomponent for safe image loading with zero broken icons
const ProductThumbnail: React.FC<{
  imageUrl?: string;
  name: string;
  tag?: string;
  discountPercent?: number;
  isAvailable?: boolean;
}> = ({ imageUrl, name, tag, discountPercent, isAvailable = true }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-100 relative group border border-slate-100">
      {!hasError && imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-gradient-to-br from-emerald-100/60 to-teal-50 text-emerald-800 select-none">
          <div className="w-9 h-9 rounded-full bg-white/80 shadow-2xs flex items-center justify-center text-emerald-700 mb-1">
            <Flower2 className="w-5 h-5 animate-pulse" />
          </div>
          <span className="text-[10px] font-bold text-emerald-950 line-clamp-1">{name}</span>
          <span className="text-[9px] text-emerald-700/80">V&amp;V Florielle Studio</span>
        </div>
      )}

      {/* Floating Badges */}
      <div className="absolute top-2 left-2 flex flex-col gap-1 items-start z-10 pointer-events-none">
        {tag && (
          <span className="bg-emerald-600/95 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            {tag}
          </span>
        )}
        {!isAvailable && (
          <span className="bg-slate-800/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
            Tạm hết hoa
          </span>
        )}
      </div>

      {discountPercent && discountPercent > 0 ? (
        <div className="absolute top-2 right-2 z-10 pointer-events-none">
          <span className="bg-rose-500/95 backdrop-blur-xs text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
            <Sparkles className="w-2.5 h-2.5" />
            <span>-{discountPercent}%</span>
          </span>
        </div>
      ) : null}
    </div>
  );
};

export const ProductsSubpage: React.FC<ProductsSubpageProps> = ({
  products,
  categories = [],
  onBackToDashboard,
  onOpenAddProduct,
  onOpenEditProduct,
  onOpenBulkDiscount,
  deleteProduct,
  formatPrice,
  title = 'Quản Lý Danh Mục & Mẫu Hoa Tươi'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [productToDelete, setProductToDelete] = useState<FlowerProduct | null>(null);

  // Filter products by search and category
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.flowerTypes?.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategoryFilter === 'all' || p.categoryId === selectedCategoryFilter;

    return matchesSearch && matchesCategory;
  });

  const discountedCount = products.filter(
    (p) => p.originalPrice && p.originalPrice > p.price
  ).length;

  return (
    <div className="glass-panel p-5 sm:p-6 space-y-5 rounded-[28px] animate-in fade-in duration-200 select-none">
      {/* Header căn giữa chuẩn Phototiinlove */}
      <div className="relative flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
        <div className="hidden sm:block w-36 shrink-0" />
        <div className="text-center mx-auto px-2">
          <small className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">
            KHO HOA TƯƠI & BẢNG GIÁ
          </small>
          <h2 className="font-extrabold text-sm sm:text-lg text-slate-900 tracking-tight">
            {title}
          </h2>
        </div>

        {/* Action Buttons: Bulk Discount & Add Product */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Bulk Event Discount Button */}
          <button
            type="button"
            onClick={onOpenBulkDiscount}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-rose-50 via-amber-50 to-orange-50 border border-rose-200/90 hover:border-rose-400 text-rose-800 hover:text-rose-900 font-bold text-xs shadow-2xs transition-all cursor-pointer hover:shadow-sm"
            title="Thiết lập sự kiện giảm giá đồng loạt theo % cho toàn bộ kho hoa hoặc từng danh mục dịp lễ"
          >
            <Percent className="w-4 h-4 text-rose-600" />
            <span className="hidden sm:inline">Sự Kiện Giảm Giá</span>
            <span className="sm:hidden">Giảm Giá</span>
          </button>

          {/* Add New Product Button */}
          <button
            type="button"
            onClick={onOpenAddProduct}
            className="btn-primary text-xs py-1.5 sm:py-2 px-3 sm:px-4 rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer font-bold"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Thêm Mẫu Hoa Mới</span>
            <span className="sm:hidden">Thêm Hoa</span>
          </button>
        </div>
      </div>

      {/* 2. Control & Search Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50/90 border border-slate-200/70">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên mẫu hoa hoặc hoa thành phần..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-medium focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
          <button
            type="button"
            onClick={() => setSelectedCategoryFilter('all')}
            className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedCategoryFilter === 'all'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-200/80 border border-slate-200'
            }`}
          >
            Tất Cả ({products.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategoryFilter('khai-truong')}
            className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedCategoryFilter === 'khai-truong'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-200/80 border border-slate-200'
            }`}
          >
            Khai Trương
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategoryFilter('sinh-nhat')}
            className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedCategoryFilter === 'sinh-nhat'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-200/80 border border-slate-200'
            }`}
          >
            Sinh Nhật
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategoryFilter('tinh-yeu')}
            className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedCategoryFilter === 'tinh-yeu'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-200/80 border border-slate-200'
            }`}
          >
            Tình Yêu
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategoryFilter('lan-ho-diep')}
            className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedCategoryFilter === 'lan-ho-diep'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-200/80 border border-slate-200'
            }`}
          >
            Lan Hồ Điệp
          </button>
        </div>
      </div>

      {/* Summary stats strip */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <div className="flex items-center gap-3">
          <span>
            Hiển thị <strong>{filteredProducts.length}</strong> / {products.length} mẫu hoa
          </span>
          {discountedCount > 0 && (
            <span className="inline-flex items-center gap-1 text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/70 text-[11px]">
              <Sparkles className="w-3 h-3" />
              {discountedCount} mẫu đang ưu đãi
            </span>
          )}
        </div>
        <span className="text-[11px] text-slate-400">Bố cục 4 mẫu 1 hàng chuẩn desktop</span>
      </div>

      {/* 3. STRICT 4-COLUMN GRID (1 col mobile, 2 col sm, 3 col md, 4 col lg/desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => {
          const discountPercent =
            product.originalPrice && product.originalPrice > product.price
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : undefined;

          return (
            <div
              key={product.id}
              className="p-3 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-300 shadow-2xs hover:shadow-md transition-all space-y-2.5 flex flex-col justify-between group"
            >
              {/* Product Top: Thumbnail with safe error handling + badges */}
              <div className="space-y-2">
                <ProductThumbnail
                  imageUrl={product.imageUrl}
                  name={product.name}
                  tag={product.tag}
                  discountPercent={discountPercent}
                  isAvailable={product.isAvailable}
                />

                {/* Details */}
                <div>
                  <h4
                    className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1 group-hover:text-emerald-800 transition-colors"
                    title={product.name}
                  >
                    {product.name}
                  </h4>

                  {/* Price Row with Discount */}
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-black text-sm text-emerald-700">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-[11px] text-slate-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>

                  {/* Description / Flowers */}
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {product.flowerTypes?.join(', ') || product.description}
                  </p>
                </div>
              </div>

              {/* Product Footer: Dịp label + Action Buttons: Sửa & Xóa */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1 text-xs">
                <span className="text-[10px] text-slate-400 font-medium truncate max-w-[80px]">
                  Dịp: {product.categoryId}
                </span>

                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Sửa Button */}
                  <button
                    type="button"
                    onClick={() => onOpenEditProduct(product)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200/80 hover:border-emerald-300 text-[11px] font-bold transition-all cursor-pointer"
                    title={`Chỉnh sửa thông tin & giá mẫu hoa "${product.name}"`}
                  >
                    <Pencil className="w-3 h-3 text-emerald-600" />
                    <span>Sửa</span>
                  </button>

                  {/* Xóa Button */}
                  <button
                    type="button"
                    onClick={() => setProductToDelete(product)}
                    className="inline-flex items-center gap-1 p-1 sm:px-2 sm:py-1 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200/80 hover:border-rose-200 text-[11px] font-bold transition-all cursor-pointer"
                    title={`Xóa mẫu hoa "${product.name}"`}
                  >
                    <Trash2 className="w-3 h-3 text-rose-500" />
                    <span className="hidden sm:inline">Xóa</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="p-8 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-center space-y-2">
          <Flower2 className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="font-bold text-sm text-slate-700">Không tìm thấy mẫu hoa phù hợp</p>
          <p className="text-xs text-slate-500">
            Thử thay đổi từ khóa tìm kiếm hoặc bấm &quot;Thêm Mẫu Hoa Mới&quot; để tạo mẫu hoa thiết kế.
          </p>
        </div>
      )}

      {/* In-App Action Confirm Modal: No Browser Dialogs! */}
      <ActionConfirmModal
        isOpen={Boolean(productToDelete)}
        onClose={() => setProductToDelete(null)}
        onConfirm={() => {
          if (productToDelete) {
            deleteProduct(productToDelete.id);
            setProductToDelete(null);
          }
        }}
        title="Xóa Mẫu Hoa Khỏi Kho"
        message={`Bạn có chắc muốn xóa mẫu hoa "${productToDelete?.name}" khỏi kho? Mẫu hoa này sẽ không còn hiển thị trên website.`}
        confirmText="Xóa Mẫu Hoa"
        type="danger"
      />
    </div>
  );
};
