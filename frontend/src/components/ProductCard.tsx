import React, { useState } from 'react';
import { FlowerProduct } from '../types';
import { useStore } from '../context/StoreContext';
import { Star, ShoppingBag, Eye, ImageOff } from 'lucide-react';

interface ProductCardProps {
  product: FlowerProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, setSelectedProduct } = useStore();
  const [imageError, setImageError] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.isAvailable) return;
    addToCart(product, 1, 'Đỏ Ruby', 'Chúc mừng hạnh phúc!');
  };

  return (
    <div
      onClick={() => setSelectedProduct(product)}
      className="glass-card rounded-[24px] border border-white/80 bg-white/75 backdrop-blur-xl flex flex-col justify-between overflow-hidden cursor-pointer group hover:shadow-xl transition-all"
    >
      {/* Top Media Container - REAL PHOTOGRAPHY IMAGE */}
      <div className="relative p-2.5">
        <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-slate-100 shadow-inner group">
          {!imageError && product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-emerald-50 text-emerald-800 p-4 text-center">
              <ImageOff className="w-8 h-8 opacity-40 mb-1" />
              <span className="text-[11px] font-medium text-slate-500">V&V Florielle Studio</span>
            </div>
          )}
        </div>

        {/* Tag Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start">
          {product.tag && (
            <span
              className="text-[11px] font-bold px-2 py-0.5 rounded-full text-white shadow-sm"
              style={{ backgroundColor: product.gradientTheme?.tagBg || '#059669' }}
            >
              {product.tag}
            </span>
          )}
          {!product.isAvailable && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-700 text-white shadow-sm">
              Tạm hết hoa
            </span>
          )}
        </div>

        {/* Hover Quick Action Buttons */}
        <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-xl m-2.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProduct(product);
            }}
            className="p-2.5 rounded-full bg-white/90 text-slate-800 hover:bg-white hover:text-emerald-700 shadow-md transition-all hover:scale-110"
            title="Xem chi tiết"
          >
            <Eye className="w-4 h-4" />
          </button>
          {product.isAvailable && (
            <button
              onClick={handleQuickAdd}
              className="p-2.5 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 shadow-md transition-all hover:scale-110"
              title="Thêm nhanh vào giỏ"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Card Info Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1.5 text-xs text-amber-500 mb-1.5">
            <div className="flex items-center">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="ml-1 font-semibold text-slate-700">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-slate-400 text-[11px]">({product.reviewCount} đánh giá)</span>
          </div>

          {/* Product Name */}
          <h3 className="font-bold text-sm text-slate-800 line-clamp-2 leading-snug group-hover:text-emerald-700 transition-colors">
            {product.name}
          </h3>

          {/* Flower Composition Pills */}
          <div className="flex flex-wrap gap-1 mt-2">
            {product.flowerTypes.slice(0, 2).map((flower, idx) => (
              <span
                key={idx}
                className="text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/60"
              >
                {flower}
              </span>
            ))}
            {product.flowerTypes.length > 2 && (
              <span className="text-[10px] text-slate-400 bg-slate-50 px-1 py-0.5 rounded">
                +{product.flowerTypes.length - 2}
              </span>
            )}
          </div>
        </div>

        {/* Price & Actions */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-base font-extrabold text-emerald-700 leading-tight">
              {formatPrice(product.price)}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="text-[11px] text-slate-400 line-through">
                {formatPrice(product.originalPrice)}
              </div>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={!product.isAvailable}
            className={`btn-primary text-xs py-1.5 px-3 flex items-center gap-1 shadow-sm ${
              !product.isAvailable ? 'opacity-50 cursor-not-allowed bg-slate-400 hover:bg-slate-400' : ''
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Đặt hoa</span>
          </button>
        </div>
      </div>
    </div>
  );
};
