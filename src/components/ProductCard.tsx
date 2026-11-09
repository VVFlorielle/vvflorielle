import React, { useState } from 'react';
import { FlowerProduct } from '../types';
import { useStore } from '../context/StoreContext';
import { Star, ShoppingBag, Eye, Sparkles, Zap } from 'lucide-react';

interface ProductCardProps {
  product: FlowerProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, setSelectedProduct } = useStore();
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleAddToCartOnly = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.isAvailable) return;

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(25);
      } catch {
        // Safe ignore
      }
    }

    // openDrawer = false: chỉ thêm giỏ, thông báo toast góc phải tự tắt sau 2s, không mở drawer
    addToCart(product, 1, 'Đỏ Ruby', 'Chúc mừng hạnh phúc!', false);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.isAvailable) return;

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(25);
      } catch {
        // Safe ignore
      }
    }

    // openDrawer = true: thêm giỏ và mở thẳng drawer điền thông tin đặt hàng
    addToCart(product, 1, 'Đỏ Ruby', 'Chúc mừng hạnh phúc!', true);
  };

  return (
    <div
      onClick={() => setSelectedProduct(product)}
      className="glass-card rounded-[20px] sm:rounded-[24px] border border-white/80 bg-white/75 backdrop-blur-xl flex flex-col justify-between overflow-hidden cursor-pointer group hover:shadow-xl transition-all"
    >
      {/* Top Media Container - REAL PHOTOGRAPHY IMAGE */}
      <div className="relative p-2 sm:p-2.5">
        <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-slate-100 shadow-inner group">
          {!imageError && product.imageUrl ? (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/70 via-slate-100 to-teal-50/50 animate-pulse" />
              )}
              <img
                src={product.imageUrl}
                alt={product.name}
                className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-108 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50/90 via-teal-50/50 to-rose-50/70 text-emerald-800 p-3 text-center select-none relative overflow-hidden">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-100/80 border border-emerald-200/70 flex items-center justify-center text-emerald-700 shadow-inner mb-1.5 group-hover:scale-110 transition-transform">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 animate-pulse" />
              </div>
              <span className="text-[10.5px] sm:text-[11.5px] font-bold text-slate-700 tracking-wide">
                V&V Florielle Studio
              </span>
              <span className="text-[8.5px] sm:text-[9.5px] text-emerald-700/80 font-medium mt-0.5">
                Thiết Kế Thủ Công
              </span>
            </div>
          )}
        </div>

        {/* Tag Badges */}
        <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 flex flex-col gap-1 items-start">
          {product.tag && (
            <span
              className="text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full text-white shadow-sm"
              style={{ backgroundColor: product.gradientTheme?.tagBg || '#059669' }}
            >
              {product.tag}
            </span>
          )}
          {!product.isAvailable && (
            <span className="text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-slate-700 text-white shadow-sm">
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
              onClick={handleAddToCartOnly}
              className="p-2.5 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 shadow-md transition-all hover:scale-110"
              title="Thêm nhanh vào giỏ"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Card Info Body - Tối ưu tỷ lệ chuẩn Phototiinlove */}
      <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1 sm:gap-1.5 text-amber-500 mb-1">
            <div className="flex items-center">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
              <span className="ml-0.5 sm:ml-1 font-semibold text-slate-700 text-[11px] sm:text-xs">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-slate-400 text-[10px] sm:text-[11px]">({product.reviewCount} đánh giá)</span>
          </div>

          {/* Product Name */}
          <h3 className="font-bold text-xs sm:text-sm text-slate-800 line-clamp-2 leading-snug group-hover:text-emerald-700 transition-colors min-h-[32px] sm:min-h-[38px]">
            {product.name}
          </h3>

          {/* Flower Composition Pills - Compact Single-Line Tag + Counter Badge (Chống dồn ứ làm méo thẻ) */}
          <div className="flex items-center gap-1 mt-1 sm:mt-1.5 overflow-hidden">
            {product.flowerTypes.slice(0, 1).map((flower, idx) => (
              <span
                key={idx}
                className="text-[9px] sm:text-[10px] text-slate-600 bg-slate-100/90 px-1.5 py-0.5 rounded-md border border-slate-200/60 truncate max-w-[85px] sm:max-w-[120px] whitespace-nowrap"
                title={flower}
              >
                {flower}
              </span>
            ))}
            {product.flowerTypes.length > 1 && (
              <span className="text-[8.5px] sm:text-[9.5px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200/60 shrink-0">
                +{product.flowerTypes.length - 1}
              </span>
            )}
          </div>
        </div>

        {/* Price & Actions: 2 nút đặt bên dưới giá tiền để không bị ép ngang */}
        <div className="mt-2.5 sm:mt-3.5 pt-2 sm:pt-2.5 border-t border-slate-100 flex flex-col gap-2">
          {/* Hàng trên: Giá tiền to rõ ràng */}
          <div className="min-w-0">
            <div
              className={`font-extrabold text-emerald-800 leading-tight ${
                product.price >= 1000000 ? 'text-[13px] min-[375px]:text-sm sm:text-base' : 'text-sm sm:text-base'
              }`}
            >
              {formatPrice(product.price)}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="text-[10px] sm:text-[11px] text-slate-400 line-through">
                {formatPrice(product.originalPrice)}
              </div>
            )}
          </div>

          {/* Hàng dưới: 2 nút riêng biệt [🛒 Thêm giỏ] và [⚡ Đặt hoa] */}
          <div className="grid grid-cols-2 gap-1.5 w-full">
            <button
              type="button"
              onClick={handleAddToCartOnly}
              disabled={!product.isAvailable}
              className={`py-1.5 px-1.5 sm:px-2 rounded-xl border border-emerald-300/90 bg-emerald-50/90 hover:bg-emerald-100 text-emerald-800 font-bold text-[10px] min-[375px]:text-[11px] sm:text-xs flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer shadow-2xs ${
                !product.isAvailable ? 'opacity-50 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200' : ''
              }`}
              title="Thêm hoa vào giỏ để chọn tiếp nhiều bó"
            >
              <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 text-emerald-700" />
              <span className="truncate">Thêm giỏ</span>
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              disabled={!product.isAvailable}
              className={`py-1.5 px-1.5 sm:px-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-[10px] min-[375px]:text-[11px] sm:text-xs flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer shadow-sm shadow-emerald-600/20 ${
                !product.isAvailable ? 'opacity-50 cursor-not-allowed bg-slate-400' : ''
              }`}
              title="Đặt mua ngay 1 bó này và thanh toán"
            >
              <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 text-amber-300 fill-amber-300" />
              <span className="truncate">Đặt hoa</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
