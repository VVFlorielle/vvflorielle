import React from 'react';
import { Star, Clock, Palette, Eye } from 'lucide-react';

export default function ProductCard({ product, onSelect }) {
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.basePrice) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="glass-card rounded-3xl p-4 flex flex-col justify-between group">
      <div>
        {/* Image Container with Badge */}
        <div className="relative rounded-2xl overflow-hidden h-60 bg-slate-100 mb-3 shadow-inner">
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {/* Top Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start">
            <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
              {product.sku}
            </span>
            {product.badge && (
              <span className="bg-rose-500/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                {product.badge}
              </span>
            )}
          </div>

          {/* Discount badge */}
          {discount > 0 && (
            <div className="absolute top-2.5 right-2.5 bg-amber-500/95 backdrop-blur-md text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow">
              -{discount}%
            </div>
          )}

          {/* Quick preview hover overlay */}
          <div 
            onClick={() => onSelect(product)}
            className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
          >
            <span className="px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-slate-800 text-xs font-bold shadow-lg flex items-center gap-1.5 scale-90 group-hover:scale-100 transition-transform">
              <Eye className="w-3.5 h-3.5 text-rose-500" />
              Xem & Tùy Biến
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              {product.leadTime}
            </span>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-600">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              {product.rating} ({product.reviewsCount})
            </span>
          </div>

          <h3 className="font-bold text-sm sm:text-base text-slate-800 group-hover:text-rose-600 transition-colors line-clamp-1">
            {product.name}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      {/* Footer: Price & CTA */}
      <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between gap-2">
        <div>
          <div className="text-base sm:text-lg font-black text-rose-600">
            {product.basePrice.toLocaleString('vi-VN')}₫
          </div>
          {product.originalPrice && (
            <div className="text-[11px] text-slate-400 line-through">
              {product.originalPrice.toLocaleString('vi-VN')}₫
            </div>
          )}
        </div>

        <button
          onClick={() => onSelect(product)}
          className="px-3.5 py-2 rounded-xl bg-white/80 hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold flex items-center gap-1 shadow-sm hover:border-rose-400 transition-all"
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Tùy Biến</span>
        </button>
      </div>
    </div>
  );
}
