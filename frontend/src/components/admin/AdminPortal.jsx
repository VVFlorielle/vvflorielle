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
  Plus
} from 'lucide-react';

export default function AdminPortal({
  products,
  orders,
  onUpdateOrderStatus,
  onUploadFinishedPhoto,
  onUpdatePrice,
  onSurgeHolidayPrice,
  onBackToStorefront
}) {
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingProduct, setEditingProduct] = useState(null);
  const [newPriceInput, setNewPriceInput] = useState('');
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [activePhotoOrderId, setActivePhotoOrderId] = useState(null);

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

  const handleSendPhoto = (orderId, url) => {
    const finalUrl = url || customPhotoUrl || samplePhotos[0];
    onUploadFinishedPhoto(orderId, finalUrl);
    setActivePhotoOrderId(null);
    setCustomPhotoUrl('');
    alert(`📸 Đã tải ảnh thành phẩm cho đơn #${orderId}! Hệ thống đã tự động gửi link ảnh HD đến Zalo của khách hàng.`);
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
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-mono">
                admin.vvflorielle.com
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Màn hình độc lập nhận thông báo đơn hàng theo thời gian thực & điều phối thợ cắm hoa
          </p>
        </div>

        {/* Quick actions for Shop Owner */}
        <div className="flex flex-wrap items-center gap-2.5">
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

      {/* MAIN TWO COLUMNS: ORDERS (LEFT) & PRODUCT PRICE MANAGER (RIGHT) */}
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
                className={`px-3 py-1 rounded-lg font-semibold ${filterStatus === 'preparing' ? 'bg-amber-500 text-white' : 'text-slate-600'}`}
              >
                Đang cắm
              </button>
              <button
                onClick={() => setFilterStatus('photo_sent')}
                className={`px-3 py-1 rounded-lg font-semibold ${filterStatus === 'photo_sent' ? 'bg-blue-500 text-white' : 'text-slate-600'}`}
              >
                Chờ khách duyệt
              </button>
            </div>
          </div>

          {/* LIST OF FLORIST WORK ORDER TICKETS */}
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
                        Hẹn giao: <strong className="text-slate-800">{order.delivery.timeSlot}</strong>
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
                      <div className="font-bold text-rose-700 text-sm">
                        Mẫu: {order.productName} ({order.productSku})
                      </div>
                      <div>• <strong>Màu giấy gói:</strong> <span className="font-bold text-slate-900">{order.recipe.wrappingPaper}</span></div>
                      <div>• <strong>Màu ruy băng:</strong> <span className="font-bold text-slate-900">{order.recipe.ribbon}</span></div>
                      {order.recipe.addons?.length > 0 && (
                        <div>• <strong>Yêu cầu thêm/thay:</strong> <span className="font-bold text-emerald-700">{order.recipe.addons.join(', ')}</span></div>
                      )}
                      <div>• <strong>Lời chúc thiệp:</strong> <span className="italic text-slate-800">"{order.card.message}"</span></div>
                      {order.recipe.notes && (
                        <div>• <strong>Ghi chú khách:</strong> <span className="text-rose-600 font-semibold">{order.recipe.notes}</span></div>
                      )}
                    </div>

                    {/* Cột phải: Thông tin giao nhận */}
                    <div className="bg-white/60 p-3.5 rounded-2xl border border-white space-y-1.5 text-slate-700">
                      <div className="font-bold text-slate-800 text-sm">Thông Tin Giao Nhận</div>
                      <div>• <strong>Người nhận:</strong> {order.delivery.receiverName} ({order.delivery.receiverPhone})</div>
                      <div>• <strong>Địa chỉ giao:</strong> {order.delivery.address}</div>
                      <div>• <strong>Người đặt:</strong> {order.customer.name} ({order.customer.phone})</div>
                      <div>• <strong>Thanh toán:</strong> {order.payment.method}</div>
                      <div className="pt-1">
                        <strong>Tổng thu:</strong> <span className="text-base font-black text-rose-600">{order.totalPrice.toLocaleString('vi-VN')}₫</span>
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

                    {/* Bàn giao shipper */}
                    {(order.status === 'photo_sent' || order.status === 'approved') && (
                      <button
                        onClick={() => {
                          onUpdateOrderStatus(order.id, 'shipping');
                          alert(`Đã bàn giao đơn #${order.id} cho Shipper giao đến: ${order.delivery.address}`);
                        }}
                        className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 shadow-sm flex items-center gap-1.5"
                      >
                        <Truck className="w-4 h-4" />
                        <span>3. Bàn Giao Shipper</span>
                      </button>
                    )}

                    {/* Hoàn tất */}
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

                  {/* POPUP CHỌN HOẶC NHẬP URL ẢNH THÀNH PHẨM */}
                  {activePhotoOrderId === order.id && (
                    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-3 animate-fadeIn text-xs">
                      <div className="font-bold text-rose-800 flex items-center justify-between">
                        <span>📸 Chọn ảnh hoa thật vừa cắm xong để gửi khách ({order.customer.phone}):</span>
                        <button onClick={() => setActivePhotoOrderId(null)} className="text-slate-400 hover:text-slate-600">✕</button>
                      </div>

                      {/* Sample photos to click for demo */}
                      <div className="grid grid-cols-3 gap-2">
                        {samplePhotos.map((photo, pIdx) => (
                          <div 
                            key={pIdx}
                            onClick={() => handleSendPhoto(order.id, photo)}
                            className="rounded-xl overflow-hidden h-24 border-2 border-white hover:border-rose-500 cursor-pointer shadow group relative"
                          >
                            <img src={photo} alt="Demo" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            <span className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-bold text-[10px]">
                              Bấm để gửi ảnh này
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Hoặc nhập link ảnh khác */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Hoặc dán URL ảnh thành phẩm khác tại đây..."
                          value={customPhotoUrl}
                          onChange={(e) => setCustomPhotoUrl(e.target.value)}
                          className="glass-input flex-1 rounded-xl px-3 py-1.5 text-xs"
                        />
                        <button
                          onClick={() => handleSendPhoto(order.id, customPhotoUrl)}
                          className="px-4 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700"
                        >
                          Gửi Ảnh
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              ))
            )}
          </div>

        </div>

        {/* ======================================================== */}
        {/* CỘT PHẢI (4 CỘT): QUẢN LÝ GIÁ SẢN PHẨM TRÊN WEB KHÁCH    */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-5 space-y-4 border border-white/80 shadow-md">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-rose-500" />
              <span>Sửa Giá Trực Tiếp Trên Web Khách</span>
            </h2>
            <span className="text-[10px] text-slate-400">Tự động đồng bộ</span>
          </div>

          <p className="text-xs text-slate-500">
            Mọi thay đổi giá tại đây sẽ cập nhật ngay lập tức trên giao diện Web khách mà không cần build lại.
          </p>

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

    </main>
  );
}
