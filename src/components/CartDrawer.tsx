import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  CreditCard,
  Banknote,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  MapPin,
  Upload,
  Camera,
  Timer,
  AlertTriangle,
  Gift,
  Eye,
  EyeOff,
  UserCheck,
  BookmarkCheck
} from 'lucide-react';
import { PaymentType } from '../types';

const DELIVERY_TIME_SLOTS = [
  '07:00 - 09:00 (Sáng sớm)',
  '09:00 - 11:30 (Buổi sáng)',
  '11:30 - 13:30 (Buổi trưa)',
  '13:30 - 16:30 (Buổi chiều)',
  '16:30 - 19:30 (Chiều tối)',
  '19:30 - 21:30 (Ban đêm)',
  'Giao hỏa tốc trong 2H'
];

export const CartDrawer: React.FC = () => {
  const {
    cart,
    updateCartItemQty,
    removeFromCart,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    createOrder,
    uploadOrderBill,
    settings,
    customer,
    promotions,
    showToast,
    setCurrentView
  } = useStore();

  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');

  // Checkout inputs
  const [senderName, setSenderName] = useState(customer?.fullName || '');
  const [senderPhone, setSenderPhone] = useState(customer?.phone || '');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientAddress, setRecipientAddress] = useState(customer?.address || '');
  const [shippingKm, setShippingKm] = useState<number>(2); // Default 2km in Cầu Giấy
  const [deliveryDate, setDeliveryDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState(DELIVERY_TIME_SLOTS[1]);
  const [generalCardMessage, setGeneralCardMessage] = useState('');
  const [orderNote, setOrderNote] = useState('');

  // Delivery radius thresholds from settings
  const warnRadius = settings.warnDeliveryRadiusKm || 20;
  const maxRadius = settings.maxDeliveryRadiusKm || 50;
  const [agreedOverDistance, setAgreedOverDistance] = useState(false);

  // Gift Delivery & Sender Privacy
  const [isGiftDelivery, setIsGiftDelivery] = useState(false);
  const [revealSenderToRecipient, setRevealSenderToRecipient] = useState(true);

  // Recipient selection mode for members ('self' | 'saved' | 'custom')
  const [recipientSource, setRecipientSource] = useState<'self' | 'saved' | 'custom'>(customer ? 'self' : 'custom');
  const [selectedSavedAddrId, setSelectedSavedAddrId] = useState<string>('');

  // Sync recipient info when customer or recipient source changes
  useEffect(() => {
    if (customer) {
      setSenderName(customer.fullName || '');
      setSenderPhone(customer.phone || '');
      if (recipientSource === 'self') {
        setRecipientName(customer.fullName || '');
        setRecipientPhone(customer.phone || '');
        setRecipientAddress(customer.address || '');
        setShippingKm(2);
        setIsGiftDelivery(false);
      }
    }
  }, [customer, recipientSource]);

  const handleSelectSavedAddress = (addrId: string) => {
    setSelectedSavedAddrId(addrId);
    const addr = customer?.savedAddresses?.find((a) => a.id === addrId);
    if (addr) {
      setRecipientName(addr.recipientName);
      setRecipientPhone(addr.recipientPhone);
      setRecipientAddress(addr.recipientAddress);
      if (addr.distanceKm) {
        setShippingKm(addr.distanceKm);
      }
      setIsGiftDelivery(true);
    }
  };

  // Payment choice
  // COD: Cọc 50% VietQR, 50% tiền mặt khi nhận hoa
  // VIETQR_DEPOSIT_50: Cọc 50% VietQR, 50% chuyển nốt trước khi giao
  // VIETQR_FULL: Trả trước 100% qua VietQR
  const [paymentChoice, setPaymentChoice] = useState<'COD' | 'VIETQR'>('VIETQR');
  const [vietQrOption, setVietQrOption] = useState<'DEPOSIT_50' | 'FULL'>('DEPOSIT_50');

  // Voucher apply
  const [voucherCodeInput, setVoucherCodeInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discountAmount: number } | null>(null);

  // Success order created
  const [createdOrder, setCreatedOrder] = useState<any>(null);
  const [billPreview, setBillPreview] = useState<string | null>(null);
  const [isBillUploaded, setIsBillUploaded] = useState(false);

  if (!isCartOpen) return null;

  // Pricing calculations
  const flowerPrice = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shippingFee = shippingKm * (settings.shippingFeePerKm || 10000);
  const discountAmount = appliedVoucher ? appliedVoucher.discountAmount : 0;
  const totalAmount = Math.max(0, flowerPrice + shippingFee - discountAmount);

  // Apply voucher logic
  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    const code = voucherCodeInput.trim().toUpperCase();
    if (!code) return;

    const matched = promotions.find((p) => p.code.toUpperCase() === code && p.isActive);
    if (!matched) {
      showToast('Mã voucher không tồn tại hoặc đã hết hạn!', 'error');
      return;
    }

    if (flowerPrice < matched.minOrder) {
      showToast(`Mã này chỉ áp dụng cho đơn hoa từ ${new Intl.NumberFormat('vi-VN').format(matched.minOrder)}đ!`, 'error');
      return;
    }

    // Check Welcome voucher: only for verified members
    if (matched.code === 'FREESHIP30K') {
      const discount = Math.min(30000, shippingFee);
      setAppliedVoucher({ code: matched.code, discountAmount: discount });
      showToast(`Áp dụng mã FREESHIP30K thành công! Giảm ${new Intl.NumberFormat('vi-VN').format(discount)}đ phí ship.`);
      return;
    }

    // Fixed or percentage
    let discount = matched.discountAmount;
    if (matched.discountType === 'PERCENT') {
      discount = Math.min(matched.maxDiscount || 100000, Math.round((flowerPrice * matched.discountAmount) / 100));
    } else if (matched.discountType === 'FREESHIP') {
      discount = Math.min(matched.discountAmount, shippingFee);
    }

    setAppliedVoucher({ code: matched.code, discountAmount: discount });
    showToast(`Áp dụng voucher ${matched.code} thành công! Giảm ${new Intl.NumberFormat('vi-VN').format(discount)}đ`);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!senderName.trim() || !senderPhone.trim()) {
      showToast('Vui lòng điền thông tin người gửi!', 'error');
      return;
    }

    if (!recipientName.trim() || !recipientPhone.trim() || !recipientAddress.trim()) {
      showToast('Vui lòng điền đầy đủ thông tin người nhận hoa tại Hà Nội!', 'error');
      return;
    }

    if (shippingKm > maxRadius) {
      showToast(`Vượt quá bán kính giao hoa tối đa (${maxRadius}km)! Tiệm hoa chỉ nhận đơn dưới ${maxRadius}km.`, 'error');
      return;
    }

    if (shippingKm > warnRadius && !agreedOverDistance) {
      showToast(`Vui lòng tích đồng ý tự chịu trách nhiệm về chất lượng hoa khi vận chuyển xa trên ${warnRadius}km!`, 'error');
      return;
    }

    const orderItems = cart.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      ribbonColor: item.ribbonColor,
      cardMessage: item.cardMessage || generalCardMessage
    }));

    // Determine Payment Type
    let finalPaymentType: PaymentType = 'VIETQR_DEPOSIT_50';
    let finalPaymentMethod: 'COD' | 'BANK_TRANSFER' = 'BANK_TRANSFER';

    if (paymentChoice === 'COD') {
      finalPaymentMethod = 'COD';
      finalPaymentType = 'COD';
    } else {
      finalPaymentMethod = 'BANK_TRANSFER';
      finalPaymentType = vietQrOption === 'FULL' ? 'VIETQR_FULL' : 'VIETQR_DEPOSIT_50';
    }

    const newOrder = createOrder({
      senderName: senderName.trim(),
      senderPhone: senderPhone.trim(),
      recipientName: recipientName.trim(),
      recipientPhone: recipientPhone.trim(),
      recipientAddress: recipientAddress.trim(),
      deliveryDate,
      deliveryTimeSlot,
      cardMessage: generalCardMessage || (cart[0]?.cardMessage || 'Chúc mừng!'),
      items: orderItems,
      flowerPrice,
      shippingDistanceKm: shippingKm,
      discountAmount,
      voucherCode: appliedVoucher?.code,
      paymentMethod: finalPaymentMethod,
      paymentType: finalPaymentType,
      note: orderNote.trim() || undefined,
      isGiftDelivery,
      revealSenderToRecipient: isGiftDelivery ? revealSenderToRecipient : true,
      senderAgreedOverDistance: shippingKm > warnRadius ? agreedOverDistance : undefined
    });

    setCreatedOrder(newOrder);
    setStep('success');
    clearCart();
    showToast('Tạo đơn hoa thành công! Vui lòng quét mã VietQR để cọc đơn.', 'success');
  };

  // Handle Bill Image Upload
  const handleBillFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setBillPreview(dataUrl);
        if (createdOrder) {
          uploadOrderBill(createdOrder.id, dataUrl);
          setIsBillUploaded(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClose = () => {
    setIsCartOpen(false);
    setTimeout(() => {
      setStep('cart');
      setBillPreview(null);
      setIsBillUploaded(false);
    }, 300);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Structured Memo: VVF [MÃ_6_SỐ] [SĐT_KHÁCH]
  const cleanPhone = (createdOrder?.senderPhone || senderPhone || '0900000000').replace(/\D/g, '');
  const memoText = `VVF ${createdOrder?.id || '849201'} ${cleanPhone}`;
  const depositVal = createdOrder?.depositAmount || Math.round(totalAmount * 0.5);

  const vietQrUrl = `https://img.vietqr.io/image/${settings.bankName}-${settings.bankAccount}-compact2.png?amount=${depositVal}&addInfo=${encodeURIComponent(
    memoText
  )}&accountName=${encodeURIComponent(settings.bankHolder)}`;

  return (
    <div className="glass-overlay" onClick={handleClose}>
      <div
        className="glass-drawer p-5 flex flex-col justify-between max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">
              {step === 'cart' && `Giỏ hoa của bạn (${cart.length})`}
              {step === 'checkout' && 'Thông tin nhận hoa & Cọc đơn'}
              {step === 'success' && 'Xác nhận đơn & Quét mã VietQR'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body Content */}
        <div className="flex-1 overflow-y-auto py-4">
          {/* STEP 1: CART ITEMS LIST */}
          {step === 'cart' && (
            <div>
              {cart.length === 0 ? (
                <div className="py-16 text-center text-slate-400 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-medium">Giỏ hoa hiện đang trống</p>
                  <button onClick={handleClose} className="btn-secondary text-xs py-2 px-4">
                    Khám phá mẫu hoa tươi ngay
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="p-3 rounded-2xl bg-white/80 border border-slate-200/80 shadow-sm flex items-start gap-3"
                    >
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-slate-800 line-clamp-1">{item.product.name}</h4>
                        <div className="text-emerald-700 font-bold text-xs mt-0.5">
                          {formatPrice(item.product.price)}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate mt-0.5">
                          Nơ: {item.ribbonColor}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                          <div className="flex items-center gap-1.5 border border-slate-200 rounded-lg p-0.5 bg-white">
                            <button
                              onClick={() => updateCartItemQty(item.product.id, item.quantity - 1)}
                              className="p-1 rounded text-slate-500 hover:bg-slate-100"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold px-1.5 min-w-[20px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartItemQty(item.product.id, item.quantity + 1)}
                              className="p-1 rounded text-slate-500 hover:bg-slate-100"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Xóa khỏi giỏ"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Summary Box */}
                  <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 space-y-1.5 text-xs text-slate-700 mt-4">
                    <div className="flex justify-between">
                      <span>Tiền hoa ({cart.length} mẫu):</span>
                      <strong className="text-slate-900">{formatPrice(flowerPrice)}</strong>
                    </div>
                    <div className="flex justify-between text-[11px] text-emerald-800">
                      <span>Tiệm hoa xuất phát:</span>
                      <span>105 Doãn Kế Thiện, Cầu Giấy</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: CHECKOUT & DISTANCE KM & PAYMENT CHOICE */}
          {step === 'checkout' && (
            <form onSubmit={handleCheckoutSubmit} className="space-y-3.5">
              {/* 1. THÔNG TIN NGƯỜI ĐẶT HOA (NGƯỜI GỬI) */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>1. Thông tin người đặt hoa (Người gửi)</span>
                  </div>
                  {customer ? (
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                      Tài khoản: {customer.fullName}
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400">Khách vãng lai</span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500 mb-0.5 block">Họ tên người gửi *</label>
                    <input
                      type="text"
                      required
                      placeholder="VD: Anh Minh"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="glass-input w-full text-xs py-1.5 px-2 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 mb-0.5 block">Số điện thoại *</label>
                    <input
                      type="tel"
                      required
                      placeholder="0912 345 678"
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      className="glass-input w-full text-xs py-1.5 px-2 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* 2. THÔNG TIN NGƯỜI NHẬN HOA TẠI HÀ NỘI */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                <div className="font-bold text-slate-800 text-xs flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>2. Thông tin nhận hoa tại Hà Nội</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 font-normal">Tiệm: 105 Doãn Kế Thiện</span>
                </div>

                {/* If Logged in Customer: Choice between Self, Saved Address Book (up to 3), or New Recipient */}
                {customer && (
                  <div className="space-y-2">
                    <div className="text-[10px] font-semibold text-slate-600">Chọn nguồn thông tin người nhận:</div>
                    <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setRecipientSource('self')}
                        className={`py-1.5 px-1 rounded-xl font-bold border transition-all text-center flex flex-col items-center gap-0.5 ${
                          recipientSource === 'self'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Giao cho tôi</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setRecipientSource('saved');
                          const firstAddr = customer.savedAddresses?.find((a) => a.isDefault) || customer.savedAddresses?.[0];
                          if (firstAddr) handleSelectSavedAddress(firstAddr.id);
                        }}
                        disabled={!customer.savedAddresses || customer.savedAddresses.length === 0}
                        className={`py-1.5 px-1 rounded-xl font-bold border transition-all text-center flex flex-col items-center gap-0.5 ${
                          recipientSource === 'saved'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : (!customer.savedAddresses || customer.savedAddresses.length === 0)
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <BookmarkCheck className="w-3.5 h-3.5" />
                        <span>Sổ địa chỉ ({customer.savedAddresses?.length || 0})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setRecipientSource('custom');
                          setRecipientName('');
                          setRecipientPhone('');
                          setRecipientAddress('');
                          setIsGiftDelivery(true);
                        }}
                        className={`py-1.5 px-1 rounded-xl font-bold border transition-all text-center flex flex-col items-center gap-0.5 ${
                          recipientSource === 'custom'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Người nhận mới</span>
                      </button>
                    </div>

                    {/* If Saved Address mode is active: display radio list of saved addresses */}
                    {recipientSource === 'saved' && customer.savedAddresses && customer.savedAddresses.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <div className="text-[10px] text-slate-500 font-medium">Chọn địa chỉ đã lưu trong sổ:</div>
                        {customer.savedAddresses.map((addr) => (
                          <div
                            key={addr.id}
                            onClick={() => handleSelectSavedAddress(addr.id)}
                            className={`p-2 rounded-xl border text-xs cursor-pointer transition-all flex items-start justify-between gap-2 ${
                              selectedSavedAddrId === addr.id
                                ? 'bg-emerald-50/80 border-emerald-500 text-emerald-950 font-medium shadow-xs'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <div className="space-y-0.5 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <strong className="text-slate-900">{addr.name}</strong>
                                {addr.isDefault && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-600 text-white font-bold">
                                    Mặc định
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-700">
                                {addr.recipientName} • {addr.recipientPhone}
                              </div>
                              <div className="text-[10px] text-slate-500 truncate">
                                {addr.recipientAddress}
                              </div>
                            </div>
                            {addr.distanceKm && (
                              <span className="text-[10px] font-bold text-emerald-700 whitespace-nowrap bg-emerald-100/60 px-1.5 py-0.5 rounded">
                                ~{addr.distanceKm}km
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Recipient inputs (Editable or auto-filled) */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500 mb-0.5 block">Tên người nhận hoa *</label>
                    <input
                      type="text"
                      required
                      placeholder="VD: Chị Hà"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="glass-input w-full text-xs py-1.5 px-2 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 mb-0.5 block">SĐT người nhận *</label>
                    <input
                      type="tel"
                      required
                      placeholder="0987 654 321"
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                      className="glass-input w-full text-xs py-1.5 px-2 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 mb-0.5 block">Địa chỉ giao chi tiết tại Hà Nội *</label>
                  <input
                    type="text"
                    required
                    placeholder="Số nhà, tòa nhà, ngõ/phố, quận Cầu Giấy / Hà Nội..."
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    className="glass-input w-full text-xs py-1.5 px-2 rounded-lg"
                  />
                </div>

                {/* GỬI HOA TẶNG HỘ / BẢO MẬT NGƯỜI GỬI */}
                <div className="pt-2 border-t border-slate-200/60 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={isGiftDelivery}
                      onChange={(e) => setIsGiftDelivery(e.target.checked)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                    />
                    <Gift className="w-3.5 h-3.5 text-rose-500" />
                    <span>Gửi hoa tặng hộ / Người nhận là người khác</span>
                  </label>

                  {isGiftDelivery && (
                    <div className="pl-6 space-y-2 pt-1">
                      <div className="text-[10px] text-slate-500 font-medium">Bảo mật thông tin người gửi:</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <label
                          className={`p-2 rounded-xl border cursor-pointer flex flex-col gap-0.5 transition-all ${
                            revealSenderToRecipient
                              ? 'bg-emerald-50/90 border-emerald-400 font-bold text-emerald-900 shadow-xs'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <input
                              type="radio"
                              name="revealSender"
                              checked={revealSenderToRecipient}
                              onChange={() => setRevealSenderToRecipient(true)}
                              className="text-emerald-600"
                            />
                            <Eye className="w-3 h-3 text-emerald-600" />
                            <span>Tiết lộ tên người gửi</span>
                          </div>
                          <span className="text-[9px] text-slate-500 font-normal pl-4">Ghi rõ tên & SĐT bạn lên thiệp</span>
                        </label>

                        <label
                          className={`p-2 rounded-xl border cursor-pointer flex flex-col gap-0.5 transition-all ${
                            !revealSenderToRecipient
                              ? 'bg-purple-50/90 border-purple-400 font-bold text-purple-900 shadow-xs'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <input
                              type="radio"
                              name="revealSender"
                              checked={!revealSenderToRecipient}
                              onChange={() => setRevealSenderToRecipient(false)}
                              className="text-purple-600"
                            />
                            <EyeOff className="w-3 h-3 text-purple-600" />
                            <span>Tặng bí mật (Ẩn danh)</span>
                          </div>
                          <span className="text-[9px] text-slate-500 font-normal pl-4">Tiệm giấu kín 100% người gửi</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* DISTANCE SELECTOR & POLICY (20KM WARNING, 50KM BLOCKING) */}
                <div className="pt-2 border-t border-slate-200/60 space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] text-slate-600 font-semibold flex items-center gap-1">
                      <span>Khoảng cách từ 105 Doãn Kế Thiện:</span>
                    </label>
                    <span className="text-[11px] font-bold text-emerald-700">
                      {shippingKm} km = {formatPrice(shippingFee)}
                    </span>
                  </div>

                  {/* Hanoi District Shortcuts */}
                  <div className="flex items-center gap-1 flex-wrap">
                    {[
                      { name: 'Cầu Giấy', km: 2 },
                      { name: 'Từ Liêm', km: 5 },
                      { name: 'Đống Đa', km: 6 },
                      { name: 'Ba Đình', km: 7 },
                      { name: 'Hoàn Kiếm', km: 9 },
                      { name: 'Thanh Xuân', km: 11 },
                      { name: 'Hà Đông', km: 15 },
                      { name: 'Gia Lâm', km: 22 },
                      { name: 'Sóc Sơn', km: 32 },
                      { name: 'Sơn Tây', km: 45 },
                      { name: 'Ngoại ô xa', km: 55 }
                    ].map((d) => (
                      <button
                        key={d.name}
                        type="button"
                        onClick={() => setShippingKm(d.km)}
                        className={`py-1 px-2 rounded-lg text-[10px] font-bold border transition-colors ${
                          shippingKm === d.km
                            ? d.km > 50
                              ? 'bg-rose-600 text-white border-rose-600'
                              : d.km > 20
                              ? 'bg-amber-600 text-white border-amber-600'
                              : 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {d.name} ({d.km}km)
                      </button>
                    ))}
                  </div>

                  {/* Direct KM number input */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] text-slate-500 whitespace-nowrap">Hoặc nhập số km cụ thể:</span>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={shippingKm}
                      onChange={(e) => setShippingKm(Math.max(1, Number(e.target.value) || 1))}
                      className="glass-input w-20 text-xs py-1 px-2 rounded-lg text-center font-bold"
                    />
                    <span className="text-[10px] text-slate-400">km (tính theo Google Maps)</span>
                  </div>

                  {/* WARNING > 20KM */}
                  {shippingKm > warnRadius && shippingKm <= maxRadius && (
                    <div className="p-3 rounded-2xl bg-amber-50/90 border border-amber-300 text-amber-900 text-xs space-y-2 mt-2">
                      <div className="flex items-center gap-2 font-bold text-amber-900">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Cảnh báo khoảng cách xa ({shippingKm} km &gt; {warnRadius} km)</span>
                      </div>
                      <p className="text-[11px] text-amber-800 leading-relaxed">
                        Vị trí giao hàng cách tiệm hơn {warnRadius}km. Chi phí vận chuyển sẽ cao ({formatPrice(shippingFee)}) và thời gian di chuyển dài có thể ảnh hưởng đến độ tươi nguyên bản của cánh hoa tươi.
                      </p>
                      <label className="flex items-start gap-2 pt-1 border-t border-amber-200/80 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={agreedOverDistance}
                          onChange={(e) => setAgreedOverDistance(e.target.checked)}
                          className="mt-0.5 rounded border-amber-400 text-amber-600 focus:ring-amber-500 w-4 h-4"
                        />
                        <span className="text-[11px] font-bold text-amber-950 leading-tight">
                          Tôi đã hiểu rõ và xác nhận đồng ý tự chịu trách nhiệm về chất lượng hoa khi vận chuyển xa trên {warnRadius}km.
                        </span>
                      </label>
                    </div>
                  )}

                  {/* BLOCKING > 50KM */}
                  {shippingKm > maxRadius && (
                    <div className="p-3 rounded-2xl bg-rose-50/90 border border-rose-300 text-rose-900 text-xs space-y-2 mt-2">
                      <div className="flex items-center gap-2 font-bold text-rose-900">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>Vượt quá bán kính giao hoa tối đa ({maxRadius}km)</span>
                      </div>
                      <p className="text-[11px] text-rose-800 leading-relaxed">
                        Vị trí giao hàng ({shippingKm}km) vượt quá giới hạn giao hoa trực tuyến {maxRadius}km của V&V Florielle. Tiệm chỉ nhận giao hoa trong khu vực Hà Nội và vùng lân cận để đảm bảo hoa tới nơi luôn tươi mới và nguyên vẹn.
                      </p>
                      <div className="pt-1 flex items-center justify-between text-[11px] border-t border-rose-200">
                        <span>Cần hỗ trợ giao xe riêng đường dài?</span>
                        <a href={`tel:${settings.hotline}`} className="font-bold text-rose-900 underline">
                          Hotline: {settings.hotline}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery Schedule & Card Message */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="font-bold text-slate-800 text-xs">3. Thời gian & Thông điệp thiệp</div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500 mb-0.5 block">Ngày giao</label>
                    <input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="glass-input w-full text-xs py-1.5 px-2 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 mb-0.5 block">Khung giờ</label>
                    <select
                      value={deliveryTimeSlot}
                      onChange={(e) => setDeliveryTimeSlot(e.target.value)}
                      className="glass-input w-full text-xs py-1.5 px-2 rounded-lg"
                    >
                      {DELIVERY_TIME_SLOTS.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 mb-0.5 block">Nội dung in thiệp / Ruy băng chúc mừng</label>
                  <input
                    type="text"
                    placeholder="VD: Chúc mừng sinh nhật chị yêu / Chúc mừng khai trương hồng phát"
                    value={generalCardMessage}
                    onChange={(e) => setGeneralCardMessage(e.target.value)}
                    className="glass-input w-full text-xs py-1.5 px-2 rounded-lg"
                  />
                </div>
              </div>

              {/* Voucher Input */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Mã giảm giá / Voucher</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nhập mã (VD: FREESHIP30K)"
                    value={voucherCodeInput}
                    onChange={(e) => setVoucherCodeInput(e.target.value.toUpperCase())}
                    className="glass-input flex-1 text-xs py-1.5 px-2 rounded-lg font-mono uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleApplyVoucher}
                    className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold shrink-0"
                  >
                    Áp dụng
                  </button>
                </div>
                {appliedVoucher && (
                  <div className="mt-1 text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Đã áp dụng mã {appliedVoucher.code}: -{formatPrice(appliedVoucher.discountAmount)}</span>
                  </div>
                )}
              </div>

              {/* Payment Choice (COD vs Direct VietQR) */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                <div className="font-bold text-slate-800 text-xs">4. Phương thức thanh toán & Đặt cọc</div>
                <div className="grid grid-cols-2 gap-2">
                  <div
                    onClick={() => setPaymentChoice('VIETQR')}
                    className={`p-2.5 rounded-xl border cursor-pointer text-xs flex flex-col justify-between transition-all ${
                      paymentChoice === 'VIETQR'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <CreditCard className="w-4 h-4 text-emerald-600" />
                      <span>Quét mã VietQR</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-normal">Cọc 50% hoặc Trả 100%</span>
                  </div>

                  <div
                    onClick={() => setPaymentChoice('COD')}
                    className={`p-2.5 rounded-xl border cursor-pointer text-xs flex flex-col justify-between transition-all ${
                      paymentChoice === 'COD'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Banknote className="w-4 h-4 text-amber-600" />
                      <span>Tiền mặt (COD)</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-normal">Cọc trước 50% VietQR</span>
                  </div>
                </div>

                {/* Sub-option for Direct VietQR */}
                {paymentChoice === 'VIETQR' && (
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-emerald-200 text-xs">
                    <button
                      type="button"
                      onClick={() => setVietQrOption('DEPOSIT_50')}
                      className={`flex-1 py-1.5 rounded-lg text-center font-semibold transition-all ${
                        vietQrOption === 'DEPOSIT_50'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Cọc trước 50%
                    </button>
                    <button
                      type="button"
                      onClick={() => setVietQrOption('FULL')}
                      className={`flex-1 py-1.5 rounded-lg text-center font-semibold transition-all ${
                        vietQrOption === 'FULL'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Thanh toán đủ 100%
                    </button>
                  </div>
                )}
              </div>

              {/* Total Calculation breakdown */}
              <div className="p-3.5 rounded-2xl bg-white border border-emerald-200/80 space-y-1.5 text-xs text-slate-700 shadow-sm">
                <div className="flex justify-between">
                  <span>Tiền hoa gốc:</span>
                  <span>{formatPrice(flowerPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí ship ({shippingKm} km):</span>
                  <span>+{formatPrice(shippingFee)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Voucher giảm giá:</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-100">
                  <span>Tổng thanh toán:</span>
                  <span className="text-emerald-700 text-base">{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-[11px] font-semibold text-amber-800 bg-amber-50 p-2 rounded-lg mt-1">
                  <span>Số tiền cọc cần quét ngay:</span>
                  <span>
                    {paymentChoice === 'COD' || vietQrOption === 'DEPOSIT_50'
                      ? formatPrice(Math.round(totalAmount * 0.5))
                      : formatPrice(totalAmount)}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Quay lại giỏ
                </button>
                <button
                  type="submit"
                  disabled={shippingKm > maxRadius || (shippingKm > warnRadius && !agreedOverDistance)}
                  className={`btn-primary flex-1 py-2.5 text-xs font-semibold rounded-xl shadow-md transition-all ${
                    shippingKm > maxRadius || (shippingKm > warnRadius && !agreedOverDistance)
                      ? 'opacity-50 cursor-not-allowed bg-slate-400'
                      : ''
                  }`}
                >
                  {shippingKm > maxRadius
                    ? `Vượt quá giới hạn (${maxRadius}km)`
                    : shippingKm > warnRadius && !agreedOverDistance
                    ? 'Chưa xác nhận đồng ý giao xa'
                    : 'Tiến Hành Quét Mã Cọc Đơn'}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: SUCCESS & VIETQR SCAN & BILL UPLOAD */}
          {step === 'success' && createdOrder && (
            <div className="py-3 space-y-4 text-center">
              <div className="w-13 h-13 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Đặt hoa thành công!</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mã đơn hàng: <strong className="font-mono text-emerald-700 text-sm font-black">#{createdOrder.id}</strong>
                </p>
                <p className="text-[11px] text-slate-500">
                  Vui lòng quét mã VietQR bên dưới để cọc đơn. Florist sẽ tiến hành cắm hoa ngay sau khi nhận cọc.
                </p>
              </div>

              {/* VietQR Box */}
              <div className="p-4 rounded-3xl bg-white border border-emerald-200/90 shadow-xl max-w-[270px] mx-auto text-center space-y-2.5">
                <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                  MÃ VIETQR TỰ ĐỘNG CHUYỂN CỌC
                </div>
                <img
                  src={vietQrUrl}
                  alt="Mã VietQR cọc đơn hoa"
                  className="w-full aspect-square object-contain rounded-xl border border-slate-100 p-1"
                />
                <div className="text-xs space-y-1">
                  <div className="flex justify-between text-slate-600">
                    <span>Số tiền cần cọc:</span>
                    <strong className="text-emerald-700 text-sm">{formatPrice(createdOrder.depositAmount)}</strong>
                  </div>
                  {createdOrder.remainingAmount > 0 && (
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Thu khi nhận hoa:</span>
                      <span>{formatPrice(createdOrder.remainingAmount)}</span>
                    </div>
                  )}
                  <div className="text-left bg-slate-50 p-2 rounded-lg text-[11px] border border-slate-200 font-mono">
                    <span className="text-slate-400 block text-[9px] uppercase font-sans">Nội dung chuyển khoản:</span>
                    <strong className="text-slate-800">{memoText}</strong>
                  </div>
                </div>
              </div>

              {/* Upload Payment Bill Section */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/70 text-left space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                  <Camera className="w-4 h-4 text-emerald-600" />
                  <span>Xác nhận đã thanh toán (Gửi ảnh Bill)</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Sau khi quét mã chuyển khoản, bạn vui lòng chụp lại màn hình biên lai và tải lên đây để được duyệt cọc nhanh nhất:
                </p>

                {billPreview ? (
                  <div className="space-y-2">
                    <div className="relative rounded-xl overflow-hidden border border-emerald-300 max-h-36">
                      <img src={billPreview} alt="Ảnh biên lai" className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Đã tải lên</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 p-2 rounded-lg bg-emerald-100/70 text-[11px] text-emerald-800 font-medium">
                      <Timer className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Trợ lý AI đang đối soát biên lai... Đơn sẽ tự động xác nhận trong vòng 2 phút nếu florist bận cắm hoa.</span>
                    </div>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-emerald-300 bg-white hover:bg-emerald-50 cursor-pointer text-xs font-semibold text-emerald-800 transition-colors">
                    <Upload className="w-4 h-4 text-emerald-600" />
                    <span>Bấm chọn ảnh biên lai chuyển khoản</span>
                    <input type="file" accept="image/*" onChange={handleBillFileChange} className="hidden" />
                  </label>
                )}
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => {
                    handleClose();
                    setCurrentView('customer');
                  }}
                  className="btn-primary flex-1 py-2.5 text-xs font-semibold rounded-xl"
                >
                  Xem Đơn Hàng Của Tôi
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer (Step 1 Cart Proceed) */}
        {step === 'cart' && cart.length > 0 && (
          <div className="pt-3.5 border-t border-slate-200 space-y-2.5">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-medium">Tạm tính tiền hoa:</span>
              <strong className="text-emerald-700 text-base">{formatPrice(flowerPrice)}</strong>
            </div>
            <button
              onClick={() => setStep('checkout')}
              className="btn-primary w-full py-2.5 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20"
            >
              <span>Tiếp tục đặt hoa</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
