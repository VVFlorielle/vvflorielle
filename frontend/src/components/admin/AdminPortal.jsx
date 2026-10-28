import React, { useState } from 'react';
import { 
  ShieldCheck, 
  TrendingUp, 
  DollarSign, 
  Package, 
  Clock, 
  Camera, 
  Truck, 
  CheckCircle2, 
  Sparkles, 
  Edit3, 
  Search,
  Bell,
  RefreshCw,
  Plus,
  Layers,
  Image as ImageIcon,
  Check,
  X,
  Volume2
} from 'lucide-react';
import { looseFlowersInventory as defaultLoose } from '../../data/defaultData';

export default function AdminPortal({
  products,
  orders,
  looseFlowers = defaultLoose,
  onUpdateOrderStatus,
  onUploadFinishedPhoto,
  onUpdatePrice,
  onUpdateLooseFlowerPrice,
  onAddProduct,
  onSurgeHolidayPrice,
  onBackToStorefront
}) {
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeCatalogTab, setActiveCatalogTab] = useState('products'); // 'products' | 'loose'
  
  // Price editing state
  const [editingProduct, setEditingProduct] = useState(null);
  const [newPriceInput, setNewPriceInput] = useState('');
  const [editingLoose, setEditingLoose] = useState(null);
  const [newLoosePriceInput, setNewLoosePriceInput] = useState('');
  
  // Photo proof upload state
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [activePhotoOrderId, setActivePhotoOrderId] = useState(null);

  // Add new product modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    sku: 'MS: VV-' + Math.floor(300 + Math.random() * 600),
    category: 'Bó Hoa Sinh Nhật',
    basePrice: 650000,
    originalPrice: 750000,
    leadTime: 'Giao nhanh 60-90 phút',
    images: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1200&q=85',
    description: 'Bó hoa tươi nghệ thuật phối màu sang trọng, cành hoa tươi tuyển chọn.',
    mainFlowers: 'Hồng Ecuador & Cúc Tana',
    secondaryFlowers: 'Hoa Baby Trắng',
    foliage: 'Lá Bạc Eucalyptus',
    style: 'Bó tròn phong cách Hàn Quốc'
  });

  const samplePhotos = [
    "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=80"
  ];

  const filteredOrders = orders.filter(order => {
    if (filterStatus === 'all') return true;
    return order.status === filterStatus;
  });

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const pendingCount = orders.filter(o => o.status === 'pending' || o.status === 'preparing').length;

  const handlePriceSave = (productId) => {
    if (!newPriceInput || isNaN(newPriceInput)) return;
    onUpdatePrice(productId, Number(newPriceInput));
    setEditingProduct(null);
    setNewPriceInput('');
  };

  const handleLoosePriceSave = (looseId) => {
    if (!newLoosePriceInput || isNaN(newLoosePriceInput)) return;
    if (onUpdateLooseFlowerPrice) {
      onUpdateLooseFlowerPrice(looseId, Number(newLoosePriceInput));
    }
    setEditingLoose(null);
    setNewLoosePriceInput('');
  };

  const handleSendPhoto = (orderId, url) => {
    const finalUrl = url || customPhotoUrl || samplePhotos[0];
    onUploadFinishedPhoto(orderId, finalUrl);
    setActivePhotoOrderId(null);
    setCustomPhotoUrl('');
    alert(`📸 Đã tải ảnh thành phẩm cho đơn #${orderId}! Khách hàng có thể bấm duyệt ngay trên trang Tra cứu đơn.`);
  };

  const handleCreateProductSubmit = (e) => {
    e.preventDefault();
    if (!newProductForm.name || !newProductForm.basePrice) {
      alert('Vui lòng nhập tên và giá sản phẩm!');
      return;
    }

    const createdProduct = {
      id: 'VV-' + Math.floor(300 + Math.random() * 600),
      name: newProductForm.name,
      sku: newProductForm.sku,
      category: newProductForm.category,
      basePrice: Number(newProductForm.basePrice),
      originalPrice: Number(newProductForm.originalPrice || newProductForm.basePrice),
      badge: 'Mẫu Mới',
      rating: 5.0,
      reviewsCount: 1,
      leadTime: newProductForm.leadTime,
      description: newProductForm.description,
      images: [newProductForm.images],
      components: {
        mainFlowers: newProductForm.mainFlowers,
        secondaryFlowers: newProductForm.secondaryFlowers,
        foliage: newProductForm.foliage,
        style: newProductForm.style
      },
      defaultPaper: 'Trắng Mờ Sương',
      defaultRibbon: 'Satin Champagne'
    };

    if (onAddProduct) {
      onAddProduct(createdProduct);
    }
    setIsAddModalOpen(false);
    alert(`🎉 Đã thêm mẫu hoa mới: "${createdProduct.name}" vào danh mục trưng bày của tiệm!`);
  };

  const playChime = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch {}
  };

  return (
    <main className="space-y-6 pb-12 animate-fadeIn">
      
      {/* ADMIN TOP BAR */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/80 flex flex-wrap items-center justify-between gap-4 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
            <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              <span>ADMIN PORTAL - V&V FLORIELLE</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 font-mono">
                admin.vvflorielle.com
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Màn hình điều phối chế tác hoa, cập nhật giá thời gian thực & tải ảnh thành phẩm gửi khách
          </p>
        </div>

        {/* Quick actions for Shop Owner */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Sound alert test */}
          <button
            onClick={playChime}
            className="p-2 rounded-xl bg-white/70 hover:bg-white text-slate-700 border border-white shadow-xs text-xs font-semibold flex items-center gap-1.5"
            title="Thử chuông báo có đơn hàng mới"
          >
            <Volume2 className="w-4 h-4 text-rose-500" />
            <span className="hidden sm:inline">Chuông báo</span>
          </button>

          {/* Surge button */}
          <button
            onClick={() => {
              if (window.confirm('Bạn có chắc muốn TĂNG 20% GIÁ TOÀN BỘ HOA DỊP LỄ (14/2, 8/3, 20/10)?')) {
                onSurgeHolidayPrice(20);
                alert('⚡ Đã áp dụng tăng giá 20% cho toàn bộ sản phẩm trên Web khách hàng thành công!');
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>⚡ Tăng Giá Dịp Lễ (+20%)</span>
          </button>

          {/* Add product button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Mẫu Mới</span>
          </button>

          <button
            onClick={onBackToStorefront}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-300 shadow-sm"
          >
            Xem Trang Web Khách
          </button>
        </div>
      </div>

      {/* DASHBOARD STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-4 flex items-center justify-between border border-white">
          <div>
            <div className="text-xs font-semibold text-slate-500">Tổng Đơn Hôm Nay</div>
            <div className="text-2xl font-black text-slate-800 mt-1">{orders.length} Đơn</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 flex items-center justify-between border border-white">
          <div>
            <div className="text-xs font-semibold text-slate-500">Đơn Cần Gói & Chờ Duyệt</div>
            <div className="text-2xl font-black text-amber-600 mt-1">{pendingCount} Đơn</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 flex items-center justify-between border border-white">
          <div>
            <div className="text-xs font-semibold text-slate-500">Doanh Thu Dự Kiến</div>
            <div className="text-2xl font-black text-emerald-600 mt-1">
              {totalRevenue.toLocaleString('vi-VN')}₫
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* MAIN TWO COLUMNS: ORDERS (LEFT) & PRODUCT / FLOWER PRICE MANAGER (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ======================================================== */}
        {/* CỘT TRÁI (8 CỘT): DANH SÁCH VÉ CHẾ TÁC ĐƠN HÀNG          */}
        {/* ======================================================== */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
              <Package className="w-5 h-5 text-rose-500" />
              <span>Bảng Điều Phối Vé Chế Tác Đơn Hàng</span>
            </h2>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 text-xs bg-white/60 p-1 rounded-xl border border-white">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1 rounded-lg font-semibold ${filterStatus === 'all' ? 'bg-rose-500 text-white' : 'text-slate-600'}`}
              >
                Tất cả ({orders.length})
              </button>
              <button
                onClick={() => setFilterStatus('preparing')}
                className={`px-3 py-1 rounded-lg font-semibold ${filterStatus === 'preparing' ? 'bg-rose-500 text-white' : 'text-slate-600'}`}
              >
                Đang cắm ({orders.filter(o => o.status === 'preparing').length})
              </button>
              <button
                onClick={() => setFilterStatus('photo_sent')}
                className={`px-3 py-1 rounded-lg font-semibold ${filterStatus === 'photo_sent' ? 'bg-rose-500 text-white' : 'text-slate-600'}`}
              >
                Đã gửi ảnh ({orders.filter(o => o.status === 'photo_sent').length})
              </button>
            </div>
          </div>

          {/* Work Orders List */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="glass-card rounded-2xl p-8 text-center text-slate-500 text-xs">
                Chưa có đơn hàng nào trong trạng thái này.
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div 
                  key={order.id}
                  className="glass-card rounded-3xl p-5 border-l-4 border-l-rose-500 space-y-4 shadow-md border-white/80"
                >
                  {/* Ticket Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-rose-600 text-base">#{order.id}</span>
                      <span className="text-xs text-slate-500">
                        Hẹn giao: <strong className="text-slate-800">{order.delivery?.timeSlot}</strong>
                      </span>
                    </div>

                    {/* Status Badge */}
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === 'pending' || order.status === 'preparing' ? 'bg-amber-100 text-amber-700' :
                      order.status === 'photo_sent' ? 'bg-blue-100 text-blue-700 animate-pulse' :
                      order.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                      order.status === 'shipping' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {order.status === 'pending' && 'Đơn mới nhận'}
                      {order.status === 'preparing' && 'Thợ đang bó hoa'}
                      {order.status === 'photo_sent' && '📸 Đã gửi ảnh - Chờ khách duyệt'}
                      {order.status === 'approved' && '✅ Khách đã bấm duyệt ảnh'}
                      {order.status === 'shipping' && '🚚 Đang giao hàng'}
                      {order.status === 'completed' && '🎉 Hoàn tất'}
                    </span>
                  </div>

                  {/* VÉ CÔNG THỨC CHẾ TÁC CHO THỢ CẮM HOA */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Cột trái: Chi tiết bó hoa */}
                    <div className="bg-white/60 p-3.5 rounded-2xl border border-white space-y-1.5 text-slate-700">
                      <div className="font-bold text-rose-700 text-sm flex items-center justify-between">
                        <span>Mẫu: {order.productName} ({order.productSku})</span>
                        {order.recipe?.inspirationPhoto && (
                          <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-full">
                            Có ảnh mẫu khách
                          </span>
                        )}
                      </div>
                      <div>• <strong>Màu giấy gói:</strong> <span className="font-bold text-slate-900">{order.recipe?.wrappingPaper}</span></div>
                      <div>• <strong>Màu ruy băng:</strong> <span className="font-bold text-slate-900">{order.recipe?.ribbon}</span></div>
                      {order.recipe?.addons?.length > 0 && (
                        <div>• <strong>Yêu cầu hoa/phụ kiện:</strong> <span className="font-bold text-emerald-700">{order.recipe.addons.join(', ')}</span></div>
                      )}
                      <div>• <strong>Lời chúc thiệp:</strong> <span className="italic text-slate-800">"{order.card?.message}"</span></div>
                      {order.recipe?.notes && (
                        <div>• <strong>Ghi chú:</strong> <span className="text-rose-600 font-semibold">{order.recipe.notes}</span></div>
                      )}

                      {/* Customer inspiration image if provided */}
                      {order.recipe?.inspirationPhoto && (
                        <div className="pt-2 border-t border-slate-200/80">
                          <div className="text-[11px] font-bold text-slate-700 mb-1">Ảnh mẫu tham khảo của khách:</div>
                          <a href={order.recipe.inspirationPhoto} target="_blank" rel="noreferrer" className="inline-block rounded-xl overflow-hidden h-20 border border-rose-300 shadow-xs">
                            <img src={order.recipe.inspirationPhoto} alt="Inspiration" className="h-full object-cover" />
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Cột phải: Thông tin giao nhận */}
                    <div className="bg-white/60 p-3.5 rounded-2xl border border-white space-y-1.5 text-slate-700">
                      <div className="font-bold text-slate-800 text-sm">Thông Tin Giao Nhận</div>
                      <div>• <strong>Người nhận:</strong> {order.delivery?.receiverName} ({order.delivery?.receiverPhone})</div>
                      <div>• <strong>Địa chỉ giao:</strong> {order.delivery?.address}</div>
                      <div>• <strong>Người đặt:</strong> {order.customer?.name} ({order.customer?.phone})</div>
                      <div>• <strong>Thanh toán:</strong> {order.payment?.method}</div>
                      <div className="pt-1">
                        <strong>Tổng thu:</strong> <span className="text-base font-black text-rose-600">{order.totalPrice?.toLocaleString('vi-VN')}₫</span>
                      </div>
                    </div>
                  </div>

                  {/* THAO TÁC CỦA THỢ HOA & QUẢN TRỊ */}
                  <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center gap-2.5">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'preparing')}
                        className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-700 shadow-sm"
                      >
                        1. Bắt Đầu Bó Hoa
                      </button>
                    )}

                    {/* Nút Chụp & Gửi ảnh thật cho khách duyệt */}
                    <button
                      onClick={() => setActivePhotoOrderId(activePhotoOrderId === order.id ? null : order.id)}
                      className="px-4 py-2 rounded-xl bg-rose-500 text-white font-bold text-xs hover:bg-rose-600 shadow-sm flex items-center gap-1.5"
                    >
                      <Camera className="w-4 h-4" />
                      <span>2. Chụp/Tải Ảnh Hoa Thật Gửi Khách Duyệt</span>
                    </button>

                    {/* Bàn giao Shipper */}
                    {(order.status === 'approved' || order.status === 'photo_sent') && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'shipping')}
                        className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 shadow-sm flex items-center gap-1.5"
                      >
                        <Truck className="w-4 h-4" />
                        <span>3. Giao Shipper Hỏa Tốc</span>
                      </button>
                    )}

                    {/* Đã giao thành công */}
                    {order.status === 'shipping' && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'completed')}
                        className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-sm flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>4. Đã Giao Thành Công</span>
                      </button>
                    )}
                  </div>

                  {/* KHUNG TẢI ẢNH THÀNH PHẨM (MỞ RA KHI BẤM NÚT 2) */}
                  {activePhotoOrderId === order.id && (
                    <div className="p-4 bg-amber-50/90 rounded-2xl border border-amber-200 space-y-3 animate-fadeIn text-xs">
                      <div className="font-bold text-amber-800 flex items-center gap-1.5">
                        <Camera className="w-4 h-4 text-amber-600" />
                        <span>Tải Ảnh Chụp Bó Hoa Thực Tế Đã Cắm Xong (Cho Khách Duyệt)</span>
                      </div>

                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="Dán link ảnh chụp thực tế (https://...)" 
                          value={customPhotoUrl}
                          onChange={(e) => setCustomPhotoUrl(e.target.value)}
                          className="glass-input rounded-xl px-3 py-2 flex-1 text-slate-800"
                        />
                        <button
                          onClick={() => handleSendPhoto(order.id)}
                          className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 shadow-sm"
                        >
                          Gửi Ngay
                        </button>
                      </div>

                      <div className="text-[11px] text-slate-500">
                        Hoặc bấm chọn nhanh 1 trong các ảnh demo chụp góc chuẩn bên dưới:
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {samplePhotos.map((url, idx) => (
                          <div 
                            key={idx}
                            onClick={() => handleSendPhoto(order.id, url)}
                            className="cursor-pointer rounded-xl overflow-hidden h-20 border-2 border-white hover:border-amber-500 transition-all shadow-sm group relative"
                          >
                            <img src={url} alt="Proof" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity">
                              Gửi ảnh này
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ĐÃ CÓ ẢNH THÀNH PHẨM */}
                  {order.finishedPhotos?.length > 0 && (
                    <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs space-y-1.5">
                      <div className="font-bold text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Ảnh thành phẩm thực tế đã gửi cho khách:</span>
                      </div>
                      <div className="flex gap-2">
                        {order.finishedPhotos.map((img, i) => (
                          <img key={i} src={img} alt="Finished" className="w-16 h-16 rounded-xl object-cover border border-white shadow-xs" />
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              ))
            )}
          </div>

        </div>

        {/* ======================================================== */}
        {/* CỘT PHẢI (4 CỘT): QUẢN LÝ GIÁ SẢN PHẨM & HOA LẺ          */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-5 space-y-4 border border-white/80 shadow-md">
          
          {/* Header & Tabs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-rose-500" />
                <span>Bảng Giá Niêm Yết Cửa Hàng</span>
              </h2>
              <span className="text-[10px] text-slate-400">Đồng bộ Live</span>
            </div>

            {/* Sub-tab pills */}
            <div className="flex bg-white/60 p-1 rounded-xl border border-white text-xs">
              <button
                type="button"
                onClick={() => setActiveCatalogTab('products')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                  activeCatalogTab === 'products' ? 'bg-rose-500 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                Mẫu Sẵn Có ({products.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveCatalogTab('loose')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                  activeCatalogTab === 'loose' ? 'bg-rose-500 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                Hoa Lẻ Từng Cành ({looseFlowers.length})
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            {activeCatalogTab === 'products' 
              ? 'Chỉnh sửa giá các mẫu hoa có sẵn trên gian hàng.'
              : 'Chỉnh sửa đơn giá từng loại hoa lẻ cho khách đặt bó riêng theo cành.'}
          </p>

          {/* TAB 1: MẪU HOA CÓ SẴN */}
          {activeCatalogTab === 'products' && (
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {products.map((prod) => (
                <div 
                  key={prod.id}
                  className="p-3 rounded-2xl bg-white/70 border border-white space-y-2 text-xs hover:bg-white transition-all shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-slate-800 truncate pr-2">{prod.name}</div>
                    <span className="text-[10px] font-mono text-slate-400">{prod.sku}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-rose-600">
                      {prod.basePrice.toLocaleString('vi-VN')}₫
                    </span>

                    {editingProduct === prod.id ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          placeholder="Giá mới..."
                          value={newPriceInput}
                          onChange={(e) => setNewPriceInput(e.target.value)}
                          className="glass-input w-24 rounded-lg px-2 py-1 text-xs font-bold"
                          autoFocus
                        />
                        <button
                          onClick={() => handlePriceSave(prod.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px]"
                        >
                          Lưu
                        </button>
                        <button
                          onClick={() => setEditingProduct(null)}
                          className="px-2 py-1 rounded-lg bg-slate-200 text-slate-600 text-[11px]"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingProduct(prod.id);
                          setNewPriceInput(prod.basePrice);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-xs border border-rose-200 flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Sửa giá</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: HOA LẺ TỪNG CÀNH */}
          {activeCatalogTab === 'loose' && (
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {looseFlowers.map((flower) => (
                <div 
                  key={flower.id}
                  className="p-3 rounded-2xl bg-white/70 border border-white space-y-2 text-xs hover:bg-white transition-all shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <img src={flower.image} alt={flower.name} className="w-8 h-8 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-slate-800 truncate">{flower.name}</div>
                      <div className="text-[10px] text-slate-500">{flower.color} ({flower.unit})</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-rose-600">
                      {flower.unitPrice.toLocaleString('vi-VN')}₫ <span className="text-[10px] text-slate-400 font-normal">/{flower.unit}</span>
                    </span>

                    {editingLoose === flower.id ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          placeholder="Giá cành mới..."
                          value={newLoosePriceInput}
                          onChange={(e) => setNewLoosePriceInput(e.target.value)}
                          className="glass-input w-24 rounded-lg px-2 py-1 text-xs font-bold"
                          autoFocus
                        />
                        <button
                          onClick={() => handleLoosePriceSave(flower.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px]"
                        >
                          Lưu
                        </button>
                        <button
                          onClick={() => setEditingLoose(null)}
                          className="px-2 py-1 rounded-lg bg-slate-200 text-slate-600 text-[11px]"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingLoose(flower.id);
                          setNewLoosePriceInput(flower.unitPrice);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-xs border border-rose-200 flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Sửa giá cành</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Kho giấy gói & nơ */}
          <div className="pt-2 border-t border-slate-200/60 text-xs space-y-2">
            <div className="font-bold text-slate-800">Kho Tùy Biến (Giấy & Nơ):</div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/60">
              <span>Màu giấy gói hoạt động:</span>
              <span className="font-bold text-rose-600">6 màu (Đầy đủ)</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/60">
              <span>Màu ruy băng hoạt động:</span>
              <span className="font-bold text-rose-600">5 mẫu (Đầy đủ)</span>
            </div>
          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* MODAL: THÊM MẪU HOA MỚI VÀO CỬA HÀNG                      */}
      {/* ======================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-white relative max-h-[90vh] overflow-y-auto text-xs">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-500 hover:text-slate-800 flex items-center justify-center shadow-xs"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-black text-slate-800 mb-1 flex items-center gap-2">
              <Plus className="w-5 h-5 text-rose-500" />
              <span>Đăng Mẫu Hoa Mới Lên Web Khách</span>
            </h3>
            <p className="text-slate-500 mb-4">
              Mẫu hoa sẽ xuất hiện trực tiếp trên trang chủ để khách hàng có thể đặt ngay
            </p>

            <form onSubmit={handleCreateProductSubmit} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Tên Mẫu Hoa (*):</label>
                <input 
                  type="text" 
                  placeholder="Ví dụ: Bó Hoa Mẫu Đơn Hoàng Gia..." 
                  value={newProductForm.name}
                  onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                  className="glass-input w-full rounded-xl px-3 py-2 text-slate-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mã Sản Phẩm (SKU):</label>
                  <input 
                    type="text" 
                    value={newProductForm.sku}
                    onChange={(e) => setNewProductForm({ ...newProductForm, sku: e.target.value })}
                    className="glass-input w-full rounded-xl px-3 py-2 text-slate-800 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Danh Mục:</label>
                  <select
                    value={newProductForm.category}
                    onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                    className="glass-input w-full rounded-xl px-3 py-2 text-slate-800"
                  >
                    <option value="Bó Hoa Sinh Nhật">Bó Hoa Sinh Nhật</option>
                    <option value="Hoa Khai Trương">Hoa Khai Trương</option>
                    <option value="Bó Hoa Tình Yêu">Bó Hoa Tình Yêu</option>
                    <option value="Giỏ Hoa Để Bàn">Giỏ Hoa Để Bàn</option>
                    <option value="Lan Hồ Điệp">Lan Hồ Điệp</option>
                    <option value="Hoa Tốt Nghiệp">Hoa Tốt Nghiệp</option>
                    <option value="Hoa Chia Buồn">Hoa Chia Buồn</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Giá Bán Niêm Yết (₫):</label>
                  <input 
                    type="number" 
                    value={newProductForm.basePrice}
                    onChange={(e) => setNewProductForm({ ...newProductForm, basePrice: e.target.value })}
                    className="glass-input w-full rounded-xl px-3 py-2 text-slate-800 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Thời Gian Giao:</label>
                  <input 
                    type="text" 
                    value={newProductForm.leadTime}
                    onChange={(e) => setNewProductForm({ ...newProductForm, leadTime: e.target.value })}
                    className="glass-input w-full rounded-xl px-3 py-2 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Link Ảnh Sản Phẩm HD:</label>
                <input 
                  type="text" 
                  value={newProductForm.images}
                  onChange={(e) => setNewProductForm({ ...newProductForm, images: e.target.value })}
                  className="glass-input w-full rounded-xl px-3 py-2 text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mô Tả & Thành Phần:</label>
                <textarea 
                  rows="2"
                  value={newProductForm.description}
                  onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                  className="glass-input w-full rounded-xl p-2.5 text-slate-800 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-bold hover:bg-slate-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold shadow-sm"
                >
                  Đăng Lên Web
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}
