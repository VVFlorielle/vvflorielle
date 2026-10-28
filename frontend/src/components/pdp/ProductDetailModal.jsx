import React, { useState } from 'react';
import { 
  X, 
  ZoomIn, 
  Sparkles, 
  Palette, 
  Check, 
  Plus, 
  Clock, 
  ShieldCheck, 
  ShoppingBag,
  Layers,
  Heart
} from 'lucide-react';
import { defaultWrappingPapers, defaultRibbons, defaultAddons } from '../../data/defaultData';

export default function ProductDetailModal({ 
  product, 
  onClose, 
  onProceedToCheckout 
}) {
  if (!product) return null;

  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [selectedPaper, setSelectedPaper] = useState(product.defaultPaper || 'Trắng Mờ Sương');
  const [selectedRibbon, setSelectedRibbon] = useState(product.defaultRibbon || 'Satin Champagne');
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [cardMessage, setCardMessage] = useState('');
  const [notes, setNotes] = useState('');

  // Tính toán giá trực tiếp
  const calculateTotal = () => {
    let total = product.basePrice;
    
    // Ribbon custom text fee if selected
    const ribbonObj = defaultRibbons.find(r => r.name === selectedRibbon);
    if (ribbonObj && ribbonObj.price) total += ribbonObj.price;

    // Addons
    selectedAddons.forEach(addonId => {
      const addon = defaultAddons.find(a => a.id === addonId);
      if (addon && addon.price) total += addon.price;
    });

    return total;
  };

  const toggleAddon = (addonId) => {
    if (selectedAddons.includes(addonId)) {
      setSelectedAddons(selectedAddons.filter(id => id !== addonId));
    } else {
      setSelectedAddons([...selectedAddons, addonId]);
    }
  };

  // AI Wish Generator
  const generateAIWish = () => {
    const wishes = [
      "Chúc mừng sinh nhật em yêu! Chúc em luôn xinh đẹp rạng rỡ và hạnh phúc bên anh ❤️",
      "Kính chúc anh/chị sinh nhật nhiều niềm vui, vạn sự hanh thông và gặt hái thêm nhiều thành công mới!",
      "Chúc mừng khai trương đại hồng phát, kinh doanh thịnh vượng, tài lộc dồi dào!",
      "Cảm ơn mẹ vì tất cả những hy sinh và tình yêu thương vô bờ bến. Chúc mẹ luôn mạnh khỏe và bình an!",
      "Mừng ngày kỷ niệm tình yêu của chúng ta. Cảm ơn vì đã luôn đồng hành và yêu thương anh."
    ];
    const randomWish = wishes[Math.floor(Math.random() * wishes.length)];
    setCardMessage(randomWish);
  };

  const handleCheckout = () => {
    const addonNames = selectedAddons.map(id => {
      const a = defaultAddons.find(item => item.id === id);
      return a ? `${a.name} (+${a.price.toLocaleString('vi-VN')}₫)` : id;
    });

    const customRecipe = {
      product,
      wrappingPaper: selectedPaper,
      ribbon: selectedRibbon,
      addons: addonNames,
      cardMessage: cardMessage || 'Chúc mừng ngày đặc biệt!',
      notes: notes || 'Gói hoa cẩn thận, không dập cánh',
      totalPrice: calculateTotal()
    };

    onProceedToCheckout(customRecipe);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto animate-fadeIn">
      <div className="glass-panel w-full max-w-5xl rounded-3xl p-5 sm:p-7 shadow-2xl border border-white/80 relative max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-500 hover:text-slate-800 flex items-center justify-center shadow-md transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Grid: Left Gallery + Right Customizer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ======================================================== */}
          {/* CỘT TRÁI (7 CỘT): GALLERY ẢNH HD + ZOOM LÚP CẬN CẢNH     */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Header Product SKU & Badge */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                {product.sku}
              </span>
              <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                {product.leadTime}
              </span>
            </div>

            {/* Khung Zoom Ảnh Siêu Nét */}
            <div className="zoom-container rounded-2xl h-[340px] sm:h-[420px] bg-white/50 border border-white shadow-inner flex items-center justify-center relative group">
              <img 
                src={activeImage} 
                alt={product.name} 
                className="zoom-image w-full h-full object-cover"
              />
              <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[11px] px-2.5 py-1 rounded-full backdrop-blur-md flex items-center gap-1 opacity-90 group-hover:opacity-0 transition-opacity pointer-events-none">
                <ZoomIn className="w-3.5 h-3.5 text-rose-300" />
                <span>Rê chuột để phóng to cận cảnh cánh hoa</span>
              </div>
            </div>

            {/* Gallery Thumbnails */}
            <div className="grid grid-cols-4 gap-2.5">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`rounded-xl overflow-hidden h-20 border-2 transition-all shadow-sm ${
                    activeImage === img 
                      ? 'border-rose-500 ring-2 ring-rose-200 scale-102' 
                      : 'border-white/70 hover:border-rose-300 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Angle" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Bóc tách thành phần bó hoa */}
            {product.components && (
              <div className="glass-card rounded-2xl p-4 text-xs space-y-2 border border-white/70 text-slate-700">
                <div className="font-bold text-slate-800 flex items-center gap-1.5 text-sm">
                  <Layers className="w-4 h-4 text-rose-500" />
                  <span>Bóc Tách Thành Phần Trong Bó (Mẫu Gốc):</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 pt-1">
                  <div>• <strong>Hoa chính:</strong> {product.components.mainFlowers}</div>
                  <div>• <strong>Hoa phụ:</strong> {product.components.secondaryFlowers}</div>
                  <div>• <strong>Lá đệm:</strong> {product.components.foliage}</div>
                  <div>• <strong>Phong cách:</strong> {product.components.style}</div>
                </div>
              </div>
            )}

          </div>

          {/* ======================================================== */}
          {/* CỘT PHẢI (5 CỘT): PANEL TÙY BIẾN GIẤY, NƠ, HOA & ĐẶT MUA */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Title & Price */}
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-snug">
                {product.name}
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {product.description}
              </p>
              
              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-3xl font-black text-rose-600">
                  {calculateTotal().toLocaleString('vi-VN')}₫
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-slate-400 line-through">
                    {product.originalPrice.toLocaleString('vi-VN')}₫
                  </span>
                )}
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 border border-rose-200">
                  Cam kết hoa tươi 100%
                </span>
              </div>
            </div>

            <hr className="border-white/60" />

            {/* 1. CHỌN MÀU GIẤY GÓI (SWATCHES) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-800 flex items-center gap-1">
                  <Palette className="w-3.5 h-3.5 text-rose-500" />
                  <span>Màu Giấy Gói:</span>
                  <span className="font-semibold text-rose-600">{selectedPaper}</span>
                </label>
                <span className="text-[11px] text-slate-400">Đổi màu miễn phí</span>
              </div>
              
              <div className="flex flex-wrap items-center gap-2.5">
                {defaultWrappingPapers.map((paper) => (
                  <button
                    key={paper.id}
                    onClick={() => setSelectedPaper(paper.name)}
                    title={paper.name}
                    className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center shadow-md ${
                      selectedPaper === paper.name
                        ? 'border-rose-500 ring-2 ring-rose-300 ring-offset-2 scale-110'
                        : 'border-white hover:scale-105'
                    }`}
                    style={{ backgroundColor: paper.colorHex }}
                  >
                    {selectedPaper === paper.name && (
                      <Check className={`w-4 h-4 ${paper.colorHex === '#FFFFFF' ? 'text-rose-600' : 'text-slate-800'}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. CHỌN MÀU RUY BĂNG / NƠ */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-800 flex items-center gap-1">
                  <span>🎀 Màu Ruy Băng / Nơ:</span>
                  <span className="font-semibold text-rose-600">{selectedRibbon}</span>
                </label>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {defaultRibbons.map((ribbon) => (
                  <button
                    key={ribbon.id}
                    onClick={() => setSelectedRibbon(ribbon.name)}
                    className={`p-2 rounded-xl text-left border transition-all text-xs font-semibold ${
                      selectedRibbon === ribbon.name
                        ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                        : 'bg-white/60 text-slate-700 border-white hover:bg-white/90'
                    }`}
                  >
                    <div className="truncate">{ribbon.name}</div>
                    {ribbon.price > 0 && (
                      <div className={`text-[10px] ${selectedRibbon === ribbon.name ? 'text-rose-100' : 'text-rose-600'}`}>
                        +{ribbon.price.toLocaleString('vi-VN')}₫
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. THAY THẾ HOẶC THÊM HOA TRONG BÓ */}
            <div className="space-y-2">
              <label className="font-bold text-slate-800 text-xs flex items-center gap-1">
                <span>🌿 Thêm Cành Hoa / Thay Đổi Theo Sở Thích:</span>
              </label>

              <div className="space-y-2 text-xs max-h-36 overflow-y-auto pr-1">
                {defaultAddons.map((addon) => {
                  const isChecked = selectedAddons.includes(addon.id);
                  return (
                    <label
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-rose-50/90 border-rose-300 text-rose-900 font-semibold shadow-xs'
                          : 'bg-white/50 border-white/70 hover:bg-white/80 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-md flex items-center justify-center border ${isChecked ? 'bg-rose-500 border-rose-500 text-white' : 'border-slate-300 bg-white'}`}>
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <span>{addon.name}</span>
                      </div>
                      <span className={`text-xs font-bold ${addon.price > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {addon.price > 0 ? `+${addon.price.toLocaleString('vi-VN')}₫` : 'Miễn phí'}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 4. LỜI CHÚC TRÊN THIỆP / BANNER */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-800">💌 Lời chúc trên thiệp (Tặng kèm):</label>
                <button
                  type="button"
                  onClick={generateAIWish}
                  className="text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 text-[11px] transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>AI Gợi ý câu chúc</span>
                </button>
              </div>
              <input
                type="text"
                placeholder="Ví dụ: Chúc mừng sinh nhật em yêu, mãi xinh đẹp và hạnh phúc!"
                value={cardMessage}
                onChange={(e) => setCardMessage(e.target.value)}
                className="glass-input w-full text-xs rounded-xl px-3.5 py-2.5 text-slate-700"
              />
            </div>

            {/* 5. GHI CHÚ RIÊNG CHO THỢ HOA */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800 text-xs">📝 Ghi chú cho thợ bó hoa (Nếu có):</label>
              <input
                type="text"
                placeholder="Ví dụ: Thắt nơ to, chọn bông hồng nở vừa, giao trước 17h..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="glass-input w-full text-xs rounded-xl px-3.5 py-2 text-slate-700"
              />
            </div>

            {/* NÚT BẤM ĐẶT HÀNG NHANH */}
            <div className="pt-2">
              <button
                onClick={handleCheckout}
                className="glass-button w-full text-white font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 text-sm shadow-lg hover:scale-102 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>TIẾN HÀNH ĐẶT BÓ HOA NÀY ({calculateTotal().toLocaleString('vi-VN')}₫)</span>
              </button>
              <p className="text-[11px] text-center text-slate-500 mt-2 flex items-center justify-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Đặt nhanh không cần đăng nhập • Tiệm gửi ảnh hoa thật trước khi giao</span>
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
