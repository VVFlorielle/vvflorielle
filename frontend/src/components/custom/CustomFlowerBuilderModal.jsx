import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Plus, 
  Minus, 
  Upload, 
  Image as ImageIcon, 
  Layers, 
  Palette, 
  ArrowRight, 
  Info,
  Check,
  ShoppingBag,
  Wand2
} from 'lucide-react';
import { 
  looseFlowersInventory as defaultFlowers, 
  arrangementStyles as defaultStyles, 
  defaultWrappingPapers, 
  defaultRibbons 
} from '../../data/defaultData';

export default function CustomFlowerBuilderModal({ 
  onClose, 
  onProceedToCheckout,
  looseFlowers = defaultFlowers,
  arrangementStyles = defaultStyles
}) {
  // State for flower stem selections { [flowerId]: quantity }
  const [quantities, setQuantities] = useState({
    'fl-rose-red': 5,
    'fl-baby-white': 1,
    'fl-foliage-silver': 2
  });

  const [selectedStyleId, setSelectedStyleId] = useState('st-round');
  const [selectedPaper, setSelectedPaper] = useState('Trắng Mờ Sương');
  const [selectedRibbon, setSelectedRibbon] = useState('Satin Champagne');
  const [customerPhotoUrl, setCustomerPhotoUrl] = useState('');
  const [cardMessage, setCardMessage] = useState('');
  const [customNotes, setCustomNotes] = useState('');

  // Sample customer inspiration images
  const sampleInspirations = [
    { label: "Bó Vintage Nhã Nhặn", url: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80" },
    { label: "Bó Hồng Tone Dâu", url: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80" },
    { label: "Tone Trắng Xanh Tối Giản", url: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=80" }
  ];

  const updateQuantity = (flowerId, delta) => {
    setQuantities(prev => {
      const current = prev[flowerId] || 0;
      const updated = Math.max(0, current + delta);
      const nextState = { ...prev };
      if (updated === 0) {
        delete nextState[flowerId];
      } else {
        nextState[flowerId] = updated;
      }
      return nextState;
    });
  };

  // Calculations
  const selectedStyle = arrangementStyles.find(s => s.id === selectedStyleId) || arrangementStyles[0];
  
  let flowersTotal = 0;
  let totalStems = 0;
  const chosenFlowersList = [];

  Object.entries(quantities).forEach(([id, qty]) => {
    const item = looseFlowers.find(f => f.id === id);
    if (item && qty > 0) {
      const subtotal = item.unitPrice * qty;
      flowersTotal += subtotal;
      totalStems += qty;
      chosenFlowersList.push({
        ...item,
        quantity: qty,
        subtotal
      });
    }
  });

  const styleFee = selectedStyle ? selectedStyle.fee : 0;
  const grandTotal = flowersTotal + styleFee;

  // AI Wish Generator
  const generateAIWish = () => {
    const wishes = [
      "Chúc mừng sinh nhật em yêu! Bó hoa tự tay anh chọn từng bông, mong em luôn rạng rỡ và hạnh phúc ❤️",
      "Kính chúc anh/chị sinh nhật nhiều may mắn, công việc hanh thông, luôn vui vẻ và thành công rực rỡ!",
      "Chúc mừng khai trương hồng phát, kinh doanh thịnh vượng, tiền vào như nước!",
      "Gửi ngàn yêu thương tới người phụ nữ tuyệt vời nhất của cuộc đời con. Chúc Mẹ luôn mạnh khỏe, an yên!"
    ];
    setCardMessage(wishes[Math.floor(Math.random() * wishes.length)]);
  };

  const handleCheckout = () => {
    if (chosenFlowersList.length === 0) {
      alert('Vui lòng chọn ít nhất 1 loại hoa để tiệm tiến hành cắm hoa cho bạn!');
      return;
    }

    // Compose custom recipe
    const customRecipe = {
      product: {
        id: 'CUSTOM-' + Date.now().toString().slice(-4),
        name: `Bó Hoa Tự Thiết Kế (${totalStems} Cành)`,
        sku: 'MS: CUSTOM-DIY',
        images: [
          customerPhotoUrl || chosenFlowersList[0]?.image || 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1200&q=85'
        ],
        description: `Bó hoa thiết kế riêng theo yêu cầu của khách: ${chosenFlowersList.map(f => `${f.quantity} ${f.unit} ${f.name}`).join(', ')}.`
      },
      wrappingPaper: selectedPaper,
      ribbon: selectedRibbon,
      addons: chosenFlowersList.map(f => `${f.quantity} ${f.unit} ${f.name} (${f.subtotal.toLocaleString('vi-VN')}₫)`),
      arrangementStyle: selectedStyle.name,
      inspirationPhoto: customerPhotoUrl || null,
      cardMessage: cardMessage || 'Chúc mừng ngày tuyệt vời!',
      notes: (customNotes ? customNotes + ' | ' : '') + `Kiểu dáng: ${selectedStyle.name}. Khách chọn ${totalStems} cành hoa riêng.`,
      totalPrice: grandTotal
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

        {/* Modal Header */}
        <div className="border-b border-slate-200/60 pb-3 mb-5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              <span>🌸 TỰ THIẾT KẾ & ĐẶT HOA THEO Ý THÍCH</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold uppercase tracking-wider">
                Florist Customizer
              </span>
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Chọn từng loại hoa, số lượng cành, phối ảnh mẫu của bạn hoặc để thợ hoa cắm độc quyền theo ngân sách
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ======================================================== */}
          {/* CỘT TRÁI (7 CỘT): CHỌN HOA, ẢNH MẪU & KIỂU DÁNG         */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. CHỌN LOẠI HOA & SỐ CÀNH */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-rose-500" />
                  <span>1. Chọn Loại Hoa & Số Lượng Cành:</span>
                </label>
                <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                  Đã chọn: {totalStems} cành
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[290px] overflow-y-auto pr-1">
                {looseFlowers.map((flower) => {
                  const qty = quantities[flower.id] || 0;
                  return (
                    <div 
                      key={flower.id}
                      className={`p-2.5 rounded-2xl border transition-all flex items-center justify-between gap-2.5 ${
                        qty > 0 
                          ? 'bg-rose-50/80 border-rose-300 shadow-sm' 
                          : 'bg-white/60 border-white hover:bg-white/90'
                      }`}
                    >
                      {/* Demo Thumbnail & Info */}
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img 
                          src={flower.image} 
                          alt={flower.name} 
                          className="w-12 h-12 rounded-xl object-cover border border-white shadow-xs shrink-0" 
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-800 truncate" title={flower.name}>
                            {flower.name}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span 
                              className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0" 
                              style={{ backgroundColor: flower.colorHex }} 
                            />
                            <span className="text-[11px] text-slate-500 truncate">{flower.color}</span>
                          </div>
                          <div className="text-xs font-black text-rose-600 mt-0.5">
                            {flower.unitPrice.toLocaleString('vi-VN')}₫ <span className="text-[10px] font-normal text-slate-400">/{flower.unit}</span>
                          </div>
                        </div>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-1.5 bg-white rounded-xl p-1 border border-slate-200/80 shadow-xs shrink-0">
                        <button
                          type="button"
                          onClick={() => updateQuantity(flower.id, -1)}
                          disabled={qty === 0}
                          className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-rose-100 disabled:opacity-30 disabled:hover:bg-slate-100 text-slate-700 hover:text-rose-600 flex items-center justify-center font-bold text-xs transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center font-black text-xs text-slate-800">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(flower.id, 1)}
                          className="w-6 h-6 rounded-lg bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center font-bold text-xs shadow-xs transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. CHỌN KIỂU DÁNG CẮM */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-rose-500" />
                <span>2. Chọn Phong Cách Cắm:</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {arrangementStyles.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setSelectedStyleId(style.id)}
                    className={`p-3 rounded-2xl text-left border transition-all ${
                      selectedStyleId === style.id
                        ? 'bg-rose-500 text-white border-rose-600 shadow-md scale-101'
                        : 'bg-white/60 text-slate-700 hover:bg-white border-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{style.name}</span>
                      <span className={`text-[11px] font-bold ${selectedStyleId === style.id ? 'text-rose-100' : 'text-rose-600'}`}>
                        +{style.fee.toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                    <p className={`text-[11px] mt-1 line-clamp-1 ${selectedStyleId === style.id ? 'text-white/80' : 'text-slate-500'}`}>
                      {style.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. ĐÍNH KÈM ẢNH MẪU CỦA KHÁCH */}
            <div className="space-y-2.5 bg-white/50 p-4 rounded-2xl border border-white">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-rose-500" />
                <span>3. Gửi Ảnh Mẫu Bạn Yêu Thích (Tùy Chọn):</span>
              </label>
              <p className="text-[11px] text-slate-500">
                Bạn có ảnh mẫu bó hoa tìm trên Pinterest, Instagram hoặc mẫu cũ? Dán link ảnh hoặc chọn ảnh gợi ý bên dưới để thợ cắm hoa dựa theo:
              </p>

              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Dán link ảnh mẫu (https://...)" 
                  value={customerPhotoUrl}
                  onChange={(e) => setCustomerPhotoUrl(e.target.value)}
                  className="glass-input text-xs rounded-xl px-3 py-2 flex-1"
                />
                {customerPhotoUrl && (
                  <button
                    type="button"
                    onClick={() => setCustomerPhotoUrl('')}
                    className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-600"
                  >
                    Xóa
                  </button>
                )}
              </div>

              {/* Sample inspiration chips */}
              <div className="flex items-center gap-2 pt-1 overflow-x-auto pb-1 text-[11px]">
                <span className="text-slate-400 shrink-0">Mẫu gợi ý:</span>
                {sampleInspirations.map((samp, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCustomerPhotoUrl(samp.url)}
                    className="px-2.5 py-1 rounded-lg bg-white/80 hover:bg-white text-slate-600 border border-slate-200 shrink-0 font-medium transition-all"
                  >
                    {samp.label}
                  </button>
                ))}
              </div>

              {customerPhotoUrl && (
                <div className="relative mt-2 rounded-xl overflow-hidden h-36 border border-slate-200">
                  <img src={customerPhotoUrl} alt="Inspiration preview" className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Ảnh mẫu đính kèm cho thợ hoa
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* ======================================================== */}
          {/* CỘT PHẢI (5 CỘT): TÙY BIẾN GIẤY, NƠ, THIỆP & TỔNG KẾT     */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Tùy biến Giấy & Nơ */}
            <div className="glass-card rounded-2xl p-4 border border-white space-y-3.5">
              
              {/* Giấy Gói */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">Màu Giấy Gói:</span>
                  <span className="text-rose-600 font-semibold">{selectedPaper}</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {defaultWrappingPapers.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPaper(p.name)}
                      className={`relative w-8 h-8 rounded-full border-2 transition-all shadow-xs ${
                        selectedPaper === p.name 
                          ? 'border-rose-600 ring-2 ring-rose-300 scale-110' 
                          : 'border-slate-300 hover:scale-105'
                      }`}
                      style={{ backgroundColor: p.colorHex }}
                      title={p.name}
                    >
                      {selectedPaper === p.name && (
                        <Check className={`w-4 h-4 mx-auto ${p.id === 'wp-white' ? 'text-slate-800' : 'text-white'}`} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ruy Băng */}
              <div className="space-y-1.5 pt-2 border-t border-slate-200/50">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">Ruy Băng Buộc Nơ:</span>
                  <span className="text-rose-600 font-semibold">{selectedRibbon}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {defaultRibbons.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedRibbon(r.name)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all ${
                        selectedRibbon === r.name
                          ? 'bg-rose-500 text-white shadow-xs'
                          : 'bg-white/80 text-slate-700 hover:bg-white border border-slate-200'
                      }`}
                    >
                      {r.name}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Viết thiệp & Lời chúc AI */}
            <div className="glass-card rounded-2xl p-4 border border-white space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">Lời Chúc Thiệp Kèm Bó Hoa:</label>
                <button
                  type="button"
                  onClick={generateAIWish}
                  className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200"
                >
                  <Wand2 className="w-3 h-3" />
                  <span>AI Gợi Ý Lời Chúc</span>
                </button>
              </div>
              <textarea 
                rows="2"
                placeholder="Nhập nội dung thiệp chúc mừng..."
                value={cardMessage}
                onChange={(e) => setCardMessage(e.target.value)}
                className="glass-input w-full text-xs rounded-xl p-2.5 resize-none text-slate-700"
              />
              <input 
                type="text"
                placeholder="Ghi chú thêm cho thợ cắm hoa (nếu có)..."
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                className="glass-input w-full text-xs rounded-xl px-2.5 py-1.5 text-slate-700"
              />
            </div>

            {/* BẢNG TÍNH GIÁ ĐỘNG THEO THỜI GIAN THỰC */}
            <div className="bg-gradient-to-br from-rose-50 to-pink-50/70 rounded-2xl p-4 border border-rose-200/80 space-y-2.5 shadow-sm text-xs">
              <div className="font-bold text-slate-800 flex items-center justify-between border-b border-rose-200/60 pb-2">
                <span>Công Thức Tính Giá Bó Hoa:</span>
                <span className="text-[11px] text-slate-500 font-normal">Minh bạch 100%</span>
              </div>

              <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                {chosenFlowersList.length === 0 ? (
                  <div className="text-slate-400 italic text-center py-2">
                    Chưa chọn loại hoa nào. Hãy bấm [+] ở bên trái!
                  </div>
                ) : (
                  chosenFlowersList.map((item) => (
                    <div key={item.id} className="flex justify-between text-slate-600">
                      <span>• {item.name} ({item.quantity} {item.unit}):</span>
                      <span className="font-medium">{item.subtotal.toLocaleString('vi-VN')}₫</span>
                    </div>
                  ))
                )}
                <div className="flex justify-between text-slate-600 pt-1 border-t border-rose-200/40">
                  <span>• Phong cách {selectedStyle.name}:</span>
                  <span className="font-medium">+{selectedStyle.fee.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>• Giấy gói ({selectedPaper}) & Nơ:</span>
                  <span className="text-emerald-600 font-bold">Miễn phí</span>
                </div>
              </div>

              <div className="pt-2 border-t border-rose-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">Tổng Thanh Toán:</div>
                  <div className="text-xl font-black text-rose-600">
                    {grandTotal.toLocaleString('vi-VN')}₫
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={chosenFlowersList.length === 0}
                  className="glass-button text-white font-bold px-5 py-3 rounded-2xl text-xs flex items-center gap-2 shadow-md hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Tiến Hành Đặt Hoa</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
