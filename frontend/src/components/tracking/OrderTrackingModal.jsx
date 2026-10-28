import React, { useState } from 'react';
import { 
  X, 
  Search, 
  CheckCircle2, 
  Clock, 
  Camera, 
  Truck, 
  Package, 
  ThumbsUp, 
  MessageSquare,
  AlertCircle
} from 'lucide-react';

export default function OrderTrackingModal({ 
  orders, 
  initialOrderId, 
  onClose, 
  onApprovePhoto 
}) {
  const [searchId, setSearchId] = useState(initialOrderId || '');
  const [currentOrder, setCurrentOrder] = useState(() => {
    if (initialOrderId) {
      return orders.find(o => o.id === initialOrderId) || orders[0];
    }
    return orders[0];
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const found = orders.find(o => o.id.toLowerCase() === searchId.trim().toLowerCase());
    if (found) {
      setCurrentOrder(found);
    } else {
      alert(`Không tìm thấy đơn hàng mã "${searchId}". Vui lòng kiểm tra lại!`);
    }
  };

  const getStepIndex = (status) => {
    switch (status) {
      case 'pending': return 1;
      case 'preparing': return 2;
      case 'photo_sent': return 3;
      case 'approved': return 4;
      case 'shipping': return 5;
      case 'completed': return 6;
      default: return 2;
    }
  };

  const step = currentOrder ? getStepIndex(currentOrder.status) : 2;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="glass-panel w-full max-w-2xl rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/80 relative max-h-[92vh] overflow-y-auto">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-500 hover:text-slate-800 flex items-center justify-center shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header & Search */}
        <div className="border-b border-slate-200/60 pb-4 mb-5">
          <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Package className="w-5 h-5 text-rose-500" />
            <span>Tra Cứu & Theo Dõi Tiến Độ Đơn Hoa</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Xem tiến trình thợ cắm hoa và duyệt ảnh chụp thật trước khi giao
          </p>

          <form onSubmit={handleSearch} className="flex gap-2 mt-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Nhập mã đơn (Ví dụ: DH-VV1082)..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="glass-input w-full text-xs rounded-xl pl-9 pr-3 py-2 text-slate-800 uppercase font-mono font-bold"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-rose-500 text-white text-xs font-bold shadow-sm hover:bg-rose-600 transition-colors"
            >
              Tra Cứu
            </button>
          </form>
        </div>

        {currentOrder ? (
          <div className="space-y-6">
            
            {/* Top Order Summary */}
            <div className="glass-card rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs border border-white">
              <div className="flex items-center gap-3">
                <img 
                  src={currentOrder.productImage} 
                  alt="Product" 
                  className="w-14 h-14 rounded-xl object-cover border border-white shadow-sm"
                />
                <div>
                  <div className="font-mono font-bold text-rose-600 text-sm">#{currentOrder.id}</div>
                  <div className="font-bold text-slate-800">{currentOrder.productName}</div>
                  <div className="text-slate-500 text-[11px]">
                    Đặt lúc: {new Date(currentOrder.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-base font-black text-rose-600">
                  {currentOrder.totalPrice.toLocaleString('vi-VN')}₫
                </div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                  {currentOrder.status === 'preparing' && 'Thợ đang bó hoa'}
                  {currentOrder.status === 'photo_sent' && '📸 Đã có ảnh hoa thật để duyệt'}
                  {currentOrder.status === 'approved' && '✅ Bạn đã duyệt thành phẩm'}
                  {currentOrder.status === 'shipping' && '🚚 Đang giao hàng'}
                  {currentOrder.status === 'completed' && '🎉 Đã giao thành công'}
                </span>
              </div>
            </div>

            {/* TIMELINE PROGRESS STEPPER */}
            <div className="space-y-2">
              <h3 className="font-bold text-xs text-slate-700 uppercase tracking-wider">Tiến Độ Thực Hiện:</h3>
              
              <div className="grid grid-cols-5 gap-1.5 text-center text-[10px]">
                {/* Step 1 */}
                <div className="space-y-1">
                  <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold transition-all ${
                    step >= 1 ? 'bg-rose-500 text-white shadow-md' : 'bg-slate-200 text-slate-500'
                  }`}>
                    1
                  </div>
                  <div className={`font-semibold ${step >= 1 ? 'text-rose-600' : 'text-slate-400'}`}>Đã nhận đơn</div>
                </div>

                {/* Step 2 */}
                <div className="space-y-1">
                  <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold transition-all ${
                    step >= 2 ? 'bg-rose-500 text-white shadow-md' : 'bg-slate-200 text-slate-500'
                  }`}>
                    2
                  </div>
                  <div className={`font-semibold ${step >= 2 ? 'text-rose-600' : 'text-slate-400'}`}>Đang cắm hoa</div>
                </div>

                {/* Step 3 (Crucial step: Photo Proof) */}
                <div className="space-y-1">
                  <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold transition-all ${
                    step >= 3 ? 'bg-amber-500 text-white shadow-md animate-bounce' : 'bg-slate-200 text-slate-500'
                  }`}>
                    <Camera className="w-4 h-4" />
                  </div>
                  <div className={`font-bold ${step >= 3 ? 'text-amber-600' : 'text-slate-400'}`}>Duyệt ảnh thật</div>
                </div>

                {/* Step 4 */}
                <div className="space-y-1">
                  <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold transition-all ${
                    step >= 5 ? 'bg-rose-500 text-white shadow-md' : 'bg-slate-200 text-slate-500'
                  }`}>
                    <Truck className="w-4 h-4" />
                  </div>
                  <div className={`font-semibold ${step >= 5 ? 'text-rose-600' : 'text-slate-400'}`}>Đang giao</div>
                </div>

                {/* Step 5 */}
                <div className="space-y-1">
                  <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold transition-all ${
                    step >= 6 ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-200 text-slate-500'
                  }`}>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className={`font-semibold ${step >= 6 ? 'text-emerald-600' : 'text-slate-400'}`}>Đã giao</div>
                </div>
              </div>
            </div>

            {/* KHU VỰC DUYỆT ẢNH HOA THẬT CỦA TIỆM (PHOTO PROOF SECTION) */}
            <div className="glass-card rounded-2xl p-4 space-y-3 border border-white">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-rose-500" />
                  <span>Ảnh Thành Phẩm Hoa Thật (Do Thợ Chụp Tại Tiệm):</span>
                </h4>
                <span className="text-[11px] text-slate-400">Kiểm tra trước khi giao</span>
              </div>

              {currentOrder.finishedPhotos && currentOrder.finishedPhotos.length > 0 ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {currentOrder.finishedPhotos.map((photo, i) => (
                      <div key={i} className="rounded-xl overflow-hidden h-44 bg-slate-100 border border-white shadow">
                        <img src={photo} alt="Finished Flower" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>

                  {currentOrder.status === 'photo_sent' && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex flex-wrap items-center justify-between gap-2">
                      <div className="text-xs text-amber-800 font-medium">
                        Bạn thấy bó hoa này thế nào? Hãy bấm xác nhận để tiệm điều tài xế giao ngay nhé!
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onApprovePhoto(currentOrder.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 hover:bg-emerald-700 shadow-sm"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>Đồng Ý - Cho Giao Ngay</span>
                        </button>
                        <a
                          href="https://zalo.me/0906721442"
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                          <span>Nhắn Zalo Yêu Cầu Chỉnh</span>
                        </a>
                      </div>
                    </div>
                  )}

                  {currentOrder.status === 'approved' && (
                    <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Bạn đã bấm DUYỆT ẢNH THÀNH PHẨM! Tiệm đang đóng gói để bàn giao Shipper.</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 rounded-xl bg-white/40 border border-dashed border-slate-300 text-center text-xs text-slate-500 space-y-1">
                  <div className="text-base font-bold text-slate-700">Thợ hoa đang cắm theo yêu cầu của bạn</div>
                  <p>Ngay khi cắm xong, ảnh hoa thật sẽ xuất hiện tại đây và gửi qua Zalo ({currentOrder.customer.phone}) để bạn duyệt trước khi giao.</p>
                </div>
              )}
            </div>

            {/* Chi tiết thông tin giao hoa */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
              <div className="bg-white/60 p-3.5 rounded-2xl border border-white space-y-1">
                <div className="font-bold text-slate-800 text-sm mb-1.5">Thông Tin Người Nhận</div>
                <div>• <strong>Người nhận:</strong> {currentOrder.delivery.receiverName} ({currentOrder.delivery.receiverPhone})</div>
                <div>• <strong>Địa chỉ:</strong> {currentOrder.delivery.address}</div>
                <div>• <strong>Thời gian giao:</strong> {currentOrder.delivery.timeSlot}</div>
              </div>

              <div className="bg-white/60 p-3.5 rounded-2xl border border-white space-y-1">
                <div className="font-bold text-slate-800 text-sm mb-1.5">Công Thức Tùy Biến Của Bó Hoa</div>
                <div>• <strong>Giấy gói:</strong> {currentOrder.recipe.wrappingPaper}</div>
                <div>• <strong>Ruy băng:</strong> {currentOrder.recipe.ribbon}</div>
                {currentOrder.recipe.addons?.length > 0 && (
                  <div>• <strong>Thêm/thay:</strong> {currentOrder.recipe.addons.join(', ')}</div>
                )}
                <div>• <strong>Thiệp:</strong> <span className="italic">"{currentOrder.card.message}"</span></div>
              </div>
            </div>

          </div>
        ) : (
          <div className="text-center py-8 text-slate-500 text-xs">
            Vui lòng nhập mã đơn hàng của bạn vào ô trên để tra cứu.
          </div>
        )}

      </div>
    </div>
  );
}
