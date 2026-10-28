import React from 'react';
import { Phone, Star, Palette, Clock, CheckCircle } from 'lucide-react';

export default function MobileFrame({ 
  products, 
  onSelectProduct, 
  onOpenTracking,
  onOpenCustomBuilder 
}) {
  return (
    <div className="max-w-sm mx-auto my-6 animate-fadeIn">
      {/* iPhone Shell Mockup */}
      <div className="w-full bg-slate-900 p-3.5 rounded-[48px] shadow-2xl border-4 border-slate-700">
        
        {/* Dynamic Island / Notch */}
        <div className="w-28 h-5 bg-black rounded-full mx-auto mb-2 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800 ml-auto mr-3"></div>
        </div>

        {/* Inner Phone Screen */}
        <div className="bg-rose-50/95 rounded-[36px] overflow-hidden min-h-[660px] flex flex-col justify-between relative text-slate-800 font-sans shadow-inner">
          
          {/* Mobile Top Header */}
          <div className="p-4 glass-panel border-b border-white/60 flex items-center justify-between">
            <div>
              <div className="font-black text-sm text-slate-800 tracking-tight">V&V FLORIELLE</div>
              <div className="text-[10px] text-rose-600 font-bold">Boutique Florist</div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenTracking}
                className="px-2.5 py-1 rounded-full bg-white/80 text-[10px] font-bold border border-white text-slate-700"
              >
                Tra cứu
              </button>
              <a 
                href="tel:0906721442" 
                className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md text-xs"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Scrollable Products List */}
          <div className="p-3.5 space-y-3.5 overflow-y-auto max-h-[520px]">
            
            {/* Horizontal Trust Banner */}
            <div className="p-2.5 rounded-2xl bg-white/80 border border-white text-[11px] text-slate-600 flex items-center justify-around shadow-xs">
              <span className="flex items-center gap-1 font-bold text-rose-600">⚡ Giao 2H</span>
              <span>•</span>
              <span className="flex items-center gap-1">📸 Gửi ảnh duyệt</span>
              <span>•</span>
              <span className="flex items-center gap-1">💌 Tặng thiệp</span>
            </div>

            {/* Custom Flower Builder CTA */}
            <button
              onClick={onOpenCustomBuilder}
              className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm hover:scale-102 transition-all"
            >
              <span>🌸 Tự Cắm Bó Hoa Riêng Theo Ý Thích</span>
            </button>

            {/* Featured Product Card */}
            {products[0] && (
              <div className="glass-panel rounded-2xl p-3 space-y-2 border border-white/80 shadow-sm">
                <div className="relative rounded-xl overflow-hidden h-44 shadow-inner">
                  <img src={products[0].images[0]} alt="Featured" className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md">
                    {products[0].sku}
                  </span>
                  <span className="absolute top-2 right-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                    Bán chạy
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs text-slate-800">{products[0].name}</div>
                  <div className="text-rose-600 font-bold text-sm">
                    {products[0].basePrice.toLocaleString('vi-VN')}₫
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 line-clamp-1">
                  {products[0].components?.mainFlowers || products[0].description}
                </div>

                <button
                  onClick={() => onSelectProduct(products[0])}
                  className="glass-button w-full text-white text-xs font-bold py-2.5 rounded-xl shadow flex items-center justify-center gap-1.5"
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Tùy Biến Giấy, Nơ & Đặt Ngay</span>
                </button>
              </div>
            )}

            {/* 2-Column Mobile Grid for rest of products */}
            <div className="grid grid-cols-2 gap-2.5">
              {products.slice(1).map((prod) => (
                <div 
                  key={prod.id}
                  onClick={() => onSelectProduct(prod)}
                  className="glass-card rounded-2xl p-2.5 space-y-1.5 cursor-pointer border border-white hover:scale-102 transition-all shadow-xs"
                >
                  <div className="rounded-xl overflow-hidden h-28 bg-slate-100 relative">
                    <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded-md font-mono">
                      {prod.sku}
                    </span>
                  </div>
                  <div className="font-bold text-[11px] text-slate-800 line-clamp-1">{prod.name}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-rose-600 font-black text-xs">
                      {prod.basePrice.toLocaleString('vi-VN')}₫
                    </span>
                    <span className="text-[10px] text-slate-400">Giao 1h</span>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Mobile Bottom Navigation Bar */}
          <div className="glass-panel p-2.5 border-t border-white/60 flex items-center justify-around text-[10px] text-slate-600 font-medium">
            <div className="text-rose-600 font-bold flex flex-col items-center">
              <span className="text-sm">🌸</span>
              <span>Đặt Hoa</span>
            </div>
            <div 
              onClick={onOpenCustomBuilder}
              className="flex flex-col items-center cursor-pointer hover:text-rose-600 font-medium"
            >
              <span className="text-sm">✨</span>
              <span>Tự Thiết Kế</span>
            </div>
            <div 
              onClick={onOpenTracking}
              className="flex flex-col items-center cursor-pointer hover:text-rose-600"
            >
              <span className="text-sm">📦</span>
              <span>Tra Cứu</span>
            </div>
            <a 
              href="tel:0906721442"
              className="flex flex-col items-center hover:text-rose-600"
            >
              <span className="text-sm">📞</span>
              <span>Gọi Shop</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
