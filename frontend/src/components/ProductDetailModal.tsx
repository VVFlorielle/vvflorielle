import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Star,
  ShoppingBag,
  Truck,
  HeartHandshake,
  Camera,
  Check,
  Plus,
  Minus,
  Sparkles,
  ImageOff
} from 'lucide-react';

const RIBBON_OPTIONS = [
  { name: 'Đỏ Ruby', hex: '#be123c' },
  { name: 'Hồng Pastel', hex: '#f472b6' },
  { name: 'Vàng Ánh Kim', hex: '#d97706' },
  { name: 'Xanh Emerald', hex: '#059669' },
  { name: 'Trắng Tinh Khôi', hex: '#e2e8f0' }
];

const QUICK_MESSAGES = [
  'Chúc mừng Khai trương Hồng phát!',
  'Chúc Mừng Sinh Nhật Vui Vẻ!',
  'Mãi mãi yêu em - Happy Anniversary!',
  'Chúc mừng ngày Nhà Giáo Việt Nam!',
  'Vô cùng thương tiếc & Kính viếng'
];

export const ProductDetailModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct, addToCart, setIsCartOpen, products } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [selectedRibbon, setSelectedRibbon] = useState(RIBBON_OPTIONS[0].name);
  const [cardMessage, setCardMessage] = useState('');
  const [imageError, setImageError] = useState(false);

  if (!selectedProduct) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const relatedProducts = products
    .filter((p) => p.id !== selectedProduct.id && (p.categoryId === selectedProduct.categoryId || selectedProduct.categoryId === 'all'))
    .slice(0, 4);

  const handleAddToCart = (openCartImmediately = false) => {
    if (!selectedProduct.isAvailable) return;
    addToCart(selectedProduct, quantity, selectedRibbon, cardMessage);
    setSelectedProduct(null);
    if (openCartImmediately) {
      setIsCartOpen(true);
    }
  };

  return (
    <div className="glass-overlay" onClick={() => setSelectedProduct(null)}>
      <div
        className="glass-modal-content max-w-2xl lg:max-w-3xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed Header with Title & Close button */}
        <div className="glass-modal-header">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              Chi Tiết Mẫu Hoa Nghệ Thuật
            </span>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">105 Doãn Kế Thiện, Cầu Giấy</span>
          </div>
          <button
            onClick={() => setSelectedProduct(null)}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Đóng chi tiết"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="glass-modal-body space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Real Flower Photography & Guarantee */}
          <div>
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-100 shadow-md">
              {!imageError && selectedProduct.imageUrl ? (
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-emerald-50 text-emerald-800 p-4 text-center">
                  <ImageOff className="w-8 h-8 opacity-40 mb-1" />
                  <span className="text-xs font-semibold">V&V Florielle Studio</span>
                </div>
              )}

              {/* Tag Badge */}
              {selectedProduct.tag && (
                <div className="absolute top-3 left-3">
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full text-white shadow-md"
                    style={{ backgroundColor: selectedProduct.gradientTheme?.tagBg || '#059669' }}
                  >
                    {selectedProduct.tag}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Giao nhanh 60 - 90 phút nội thành Hà Nội</span>
              </div>
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Chụp hình mẫu hoa thật gửi Zalo trước khi giao</span>
              </div>
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Tặng kèm thiệp viết tay & banner in theo yêu cầu</span>
              </div>
            </div>
          </div>

          {/* Right: Info & Customization */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Rating */}
              <div className="flex items-center gap-1.5 text-xs text-amber-500 mb-1.5">
                <div className="flex items-center">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="ml-1 font-semibold text-slate-700">{selectedProduct.rating.toFixed(1)}</span>
                </div>
                <span className="text-slate-400">({selectedProduct.reviewCount} đánh giá từ khách hàng)</span>
              </div>

              {/* Title & Price */}
              <h2 className="text-lg font-bold text-slate-900 leading-snug mb-2">
                {selectedProduct.name}
              </h2>

              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-xl font-extrabold text-emerald-700">
                  {formatPrice(selectedProduct.price)}
                </span>
                {selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price && (
                  <span className="text-xs text-slate-400 line-through">
                    {formatPrice(selectedProduct.originalPrice)}
                  </span>
                )}
              </div>

              {/* Description & Meaning */}
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                {selectedProduct.description}
              </p>

              {selectedProduct.meaning && (
                <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-800 mb-4 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Ý nghĩa:</strong> {selectedProduct.meaning}</span>
                </div>
              )}

              {/* Composition */}
              <div className="mb-4">
                <span className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Hoa thành phần chính:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProduct.flowerTypes.map((flower, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/80"
                    >
                      {flower}
                    </span>
                  ))}
                </div>
              </div>

              {/* Ribbon Selection */}
              <div className="mb-4">
                <span className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Chọn màu ruy băng (Miễn phí):
                </span>
                <div className="flex flex-wrap gap-2">
                  {RIBBON_OPTIONS.map((ribbon) => (
                    <button
                      key={ribbon.name}
                      onClick={() => setSelectedRibbon(ribbon.name)}
                      className={`text-xs px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-all ${
                        selectedRibbon === ribbon.name
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-slate-300"
                        style={{ backgroundColor: ribbon.hex }}
                      />
                      <span>{ribbon.name}</span>
                      {selectedRibbon === ribbon.name && <Check className="w-3 h-3 text-emerald-600" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Card / Banner Message */}
              <div className="mb-4">
                <span className="text-xs font-semibold text-slate-700 block mb-1">
                  Nội dung thiệp hoặc băng rôn:
                </span>
                <input
                  type="text"
                  placeholder="Ví dụ: Chúc mừng sinh nhật em yêu..."
                  value={cardMessage}
                  onChange={(e) => setCardMessage(e.target.value)}
                  className="glass-input w-full text-xs py-1.5"
                />
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {QUICK_MESSAGES.slice(0, 3).map((msg, i) => (
                    <button
                      key={i}
                      onClick={() => setCardMessage(msg)}
                      className="text-[10px] text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 px-1.5 py-0.5 rounded border border-slate-200 transition-colors"
                    >
                      + {msg}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="pt-3 border-t border-slate-200 flex items-center gap-3">
              <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-xs font-bold text-slate-800">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => handleAddToCart(false)}
                className="btn-secondary text-xs py-2 px-3 flex-1 flex items-center justify-center gap-1.5 border border-emerald-600 text-emerald-700 hover:bg-emerald-50"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Thêm vào giỏ</span>
              </button>

              <button
                onClick={() => handleAddToCart(true)}
                className="btn-primary text-xs py-2 px-4 flex-1 flex items-center justify-center gap-1.5 shadow-md"
              >
                <span>Mua ngay</span>
              </button>
            </div>
          </div>
        </div>

        {/* RELATED / RECOMMENDED FLOWERS SECTION */}
        {relatedProducts.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Mẫu Hoa Cùng Danh Mục / Có Thể Bạn Thích</span>
              </h3>
              <span className="text-[11px] text-slate-400">Gợi ý từ Florist V&V</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => {
                    setSelectedProduct(rel);
                    setQuantity(1);
                  }}
                  className="p-2 rounded-2xl bg-white border border-slate-200/70 hover:border-emerald-300 hover:shadow-md cursor-pointer transition-all group flex flex-col justify-between"
                >
                  <div className="aspect-[3/4] w-full rounded-xl overflow-hidden bg-slate-100 shadow-inner">
                    <img
                      src={rel.imageUrl}
                      alt={rel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="mt-2 space-y-0.5">
                    <h4 className="text-[11px] font-bold text-slate-800 line-clamp-1 group-hover:text-emerald-700">
                      {rel.name}
                    </h4>
                    <div className="text-[11px] font-extrabold text-emerald-700">
                      {formatPrice(rel.price)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};
