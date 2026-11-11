import React, { useState, useEffect, useMemo } from 'react';
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
  BookmarkCheck,
  Copy,
  Ticket,
  CheckSquare,
  Square,
  ChevronDown,
  CloudRain,
  Snowflake,
  ShieldCheck,
  Building
} from 'lucide-react';
import { PaymentType, SavedAddress } from '../types';
import { useBodyScrollLock } from '../utils/scrollLock';
import {
  HANOI_DISTRICTS,
  calculatePreciseKm,
  calculateStandardShippingFee,
  checkSpecialOperatingHours
} from '../data/hanoiLocations';

const DELIVERY_TIME_SLOTS = [
  '07:30 - 09:30 (Sáng sớm)',
  '09:30 - 11:30 (Buổi sáng)',
  '11:30 - 13:00 (Nghỉ trưa - Giờ đặc biệt)',
  '13:00 - 16:30 (Buổi chiều)',
  '16:30 - 19:30 (Chiều tối)',
  '19:30 - 22:00 (Buổi tối)',
  '22:00 - 23:30 (Đêm khuya - Giờ đặc biệt)',
  'Giao hỏa tốc trong 2H'
];

export const CartDrawer: React.FC = () => {
  const {
    cart,
    updateCartItemQty,
    removeFromCart,
    isCartOpen,
    setIsCartOpen,
    createOrder,
    uploadOrderBill,
    settings,
    customer,
    promotions,
    showToast,
    setCurrentView,
    weatherState,
    addSavedAddress,
    specialHoursSurchargeRate,
    shiftHours
  } = useStore();

  useBodyScrollLock(isCartOpen);

  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');

  // Shopee-style Item Selection: Track which items are checked
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(() => new Set(cart.map((i) => i.product.id)));

  // Sync selectedItemIds when cart items change
  useEffect(() => {
    setSelectedItemIds((prev) => {
      const next = new Set<string>();
      cart.forEach((item) => {
        if (prev.has(item.product.id) || prev.size === 0) {
          next.add(item.product.id);
        }
      });
      return next;
    });
  }, [cart]);

  const toggleItemSelection = (productId: string) => {
    setSelectedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedItemIds.size === cart.length) {
      setSelectedItemIds(new Set());
    } else {
      setSelectedItemIds(new Set(cart.map((i) => i.product.id)));
    }
  };

  // Cascading Address Selector for Hanoi
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('cau-giay');
  const currentDistrict = useMemo(() => {
    return HANOI_DISTRICTS.find((d) => d.id === selectedDistrictId) || HANOI_DISTRICTS[0];
  }, [selectedDistrictId]);

  const [selectedWardName, setSelectedWardName] = useState<string>(
    HANOI_DISTRICTS[0].wards[0].name
  );
  const [detailStreet, setDetailStreet] = useState<string>('');

  // If district changes, reset ward to first ward of that district
  const handleDistrictChange = (distId: string) => {
    setSelectedDistrictId(distId);
    const dist = HANOI_DISTRICTS.find((d) => d.id === distId);
    if (dist && dist.wards.length > 0) {
      setSelectedWardName(dist.wards[0].name);
    }
  };

  // Precise Distance Calculation (Km)
  const shippingKm = useMemo(() => {
    return calculatePreciseKm(selectedDistrictId, selectedWardName, detailStreet);
  }, [selectedDistrictId, selectedWardName, detailStreet]);

  // Checkout inputs
  const [senderName, setSenderName] = useState(customer?.fullName || '');
  const [senderPhone, setSenderPhone] = useState(customer?.phone || '');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');

  // Address book & defaults
  const [selectedSavedAddrId, setSelectedSavedAddrId] = useState<string>('');
  const [shouldSaveAsDefault, setShouldSaveAsDefault] = useState<boolean>(true);
  const [addressLabel, setAddressLabel] = useState<string>('Nhà riêng');

  // Gift Delivery / Alternate Recipient (Collapsible)
  const [isGiftDelivery, setIsGiftDelivery] = useState(false);
  const [revealSenderToRecipient, setRevealSenderToRecipient] = useState(true);

  // Delivery schedule
  const [deliveryDate, setDeliveryDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState(DELIVERY_TIME_SLOTS[1]);
  const [generalCardMessage, setGeneralCardMessage] = useState('');
  const [orderNote, setOrderNote] = useState('');

  // Radius thresholds
  const warnRadius = settings.warnDeliveryRadiusKm || 20;
  const maxRadius = settings.maxDeliveryRadiusKm || 50;
  const [agreedOverDistance, setAgreedOverDistance] = useState(false);

  // Auto-init logged-in customer info and saved address book
  useEffect(() => {
    if (customer) {
      setSenderName(customer.fullName || '');
      setSenderPhone(customer.phone || '');

      const addresses = customer.savedAddresses || [];
      if (addresses.length > 0) {
        const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
        setSelectedSavedAddrId(defaultAddr.id);
        if (defaultAddr.districtId) {
          setSelectedDistrictId(defaultAddr.districtId);
          if (defaultAddr.wardName) setSelectedWardName(defaultAddr.wardName);
          if (defaultAddr.detailAddress) setDetailStreet(defaultAddr.detailAddress);
        } else if (defaultAddr.recipientAddress) {
          setDetailStreet(defaultAddr.recipientAddress);
        }
      }
    }
  }, [customer]);

  const handleSelectSavedAddress = (addr: SavedAddress) => {
    setSelectedSavedAddrId(addr.id);
    if (addr.districtId) {
      setSelectedDistrictId(addr.districtId);
      if (addr.wardName) setSelectedWardName(addr.wardName);
      if (addr.detailAddress) setDetailStreet(addr.detailAddress);
    } else {
      setDetailStreet(addr.recipientAddress);
    }
    showToast(`Đã chọn địa chỉ: ${addr.name}`, 'info');
  };

  // Payment choice
  const [paymentChoice, setPaymentChoice] = useState<'COD' | 'VIETQR'>('VIETQR');
  const [vietQrOption, setVietQrOption] = useState<'DEPOSIT_50' | 'FULL'>('DEPOSIT_50');

  // Voucher apply
  const [voucherCodeInput, setVoucherCodeInput] = useState('');
  const [isVoucherPickerOpen, setIsVoucherPickerOpen] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discountAmount: number } | null>(null);

  // Calculations for selected items only
  const selectedCartItems = useMemo(() => {
    return cart.filter((item) => selectedItemIds.has(item.product.id));
  }, [cart, selectedItemIds]);

  const flowerPrice = useMemo(() => {
    return selectedCartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [selectedCartItems]);

  const shippingFeeCalc = useMemo(() => {
    return calculateStandardShippingFee(shippingKm, flowerPrice);
  }, [shippingKm, flowerPrice]);

  const shippingFee = shippingFeeCalc.fee;
  const weatherSurcharge = weatherState?.surcharge || 0;

  const specialHoursCheck = useMemo(() => {
    return checkSpecialOperatingHours(deliveryTimeSlot, deliveryDate, specialHoursSurchargeRate, shiftHours);
  }, [deliveryTimeSlot, deliveryDate, specialHoursSurchargeRate, shiftHours]);

  const specialHoursSurcharge = specialHoursCheck.surcharge;

  const discountAmount = appliedVoucher ? appliedVoucher.discountAmount : 0;
  const totalAmount = Math.max(0, flowerPrice + shippingFee + weatherSurcharge + specialHoursSurcharge - discountAmount);

  // Apply voucher logic
  const handleApplyVoucherCode = (codeToApply?: string) => {
    const code = (codeToApply || voucherCodeInput).trim().toUpperCase();
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

    let discount = matched.discountAmount;
    if (matched.code === 'FREESHIP30K' || matched.discountType === 'FREESHIP') {
      discount = Math.min(matched.discountAmount || 30000, shippingFee);
    } else if (matched.discountType === 'PERCENT') {
      discount = Math.min(matched.maxDiscount || 100000, Math.round((flowerPrice * matched.discountAmount) / 100));
    }

    setAppliedVoucher({ code: matched.code, discountAmount: discount });
    setIsVoucherPickerOpen(false);
    setVoucherCodeInput('');
    showToast(`Áp dụng voucher ${matched.code} thành công! Giảm ${new Intl.NumberFormat('vi-VN').format(discount)}đ`);
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    showToast('Đã gỡ mã ưu đãi', 'info');
  };

  // Success state
  const [createdOrder, setCreatedOrder] = useState<any>(null);
  const [billPreview, setBillPreview] = useState<string | null>(null);
  const [isBillUploaded, setIsBillUploaded] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(15 * 60);

  useEffect(() => {
    if (step !== 'success') return;
    const interval = setInterval(() => {
      setCountdownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  const triggerHaptic = (pattern: number | number[] = 20) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {}
    }
  };

  // Full composite address string
  const fullAddressString = useMemo(() => {
    const parts: string[] = [];
    if (detailStreet.trim()) parts.push(detailStreet.trim());
    if (selectedWardName) parts.push(selectedWardName);
    if (currentDistrict?.name) parts.push(currentDistrict.name);
    parts.push('Hà Nội');
    return parts.join(', ');
  }, [detailStreet, selectedWardName, currentDistrict]);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic([30, 40, 30]);

    if (selectedCartItems.length === 0) {
      showToast('Vui lòng chọn ít nhất 1 mẫu hoa để đặt mua!', 'error');
      return;
    }

    if (!senderName.trim() || !senderPhone.trim()) {
      showToast('Vui lòng điền họ tên và số điện thoại người gửi!', 'error');
      return;
    }

    const finalRecipientName = isGiftDelivery ? recipientName.trim() : senderName.trim();
    const finalRecipientPhone = isGiftDelivery ? recipientPhone.trim() : senderPhone.trim();

    if (!finalRecipientName || !finalRecipientPhone) {
      showToast('Vui lòng điền thông tin người nhận hoa!', 'error');
      return;
    }

    if (!detailStreet.trim()) {
      showToast('Vui lòng nhập số nhà, ngõ/ngách hoặc tên tòa nhà nhận hoa!', 'error');
      return;
    }

    if (shippingKm > maxRadius) {
      showToast(`Vượt quá bán kính giao hoa tối đa (${maxRadius}km)! Tiệm chỉ nhận đơn dưới ${maxRadius}km.`, 'error');
      return;
    }

    if (shippingKm > warnRadius && !agreedOverDistance) {
      showToast(`Vui lòng tích đồng ý tự chịu trách nhiệm về chất lượng hoa khi vận chuyển xa trên ${warnRadius}km!`, 'error');
      return;
    }

    // Auto-save address to customer's address book if logged in and requested
    if (customer && shouldSaveAsDefault && (!customer.savedAddresses || customer.savedAddresses.length < 4)) {
      addSavedAddress({
        name: addressLabel || 'Địa chỉ giao hoa',
        recipientName: finalRecipientName,
        recipientPhone: finalRecipientPhone,
        city: 'Hà Nội',
        districtId: selectedDistrictId,
        districtName: currentDistrict.name,
        wardName: selectedWardName,
        detailAddress: detailStreet.trim(),
        recipientAddress: fullAddressString,
        distanceKm: shippingKm,
        isDefault: !customer.savedAddresses || customer.savedAddresses.length === 0
      });
    }

    const orderItems = selectedCartItems.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      ribbonColor: item.ribbonColor,
      cardMessage: item.cardMessage || generalCardMessage
    }));

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
      recipientName: finalRecipientName,
      recipientPhone: finalRecipientPhone,
      recipientAddress: fullAddressString,
      deliveryDate,
      deliveryTimeSlot,
      cardMessage: generalCardMessage || (selectedCartItems[0]?.cardMessage || 'Chúc mừng!'),
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
      senderAgreedOverDistance: shippingKm > warnRadius ? agreedOverDistance : undefined,
      weatherCondition: weatherState?.condition,
      weatherSurcharge,
      specialHoursSurcharge
    });

    setCreatedOrder(newOrder);
    setStep('success');

    // Remove only the purchased items from cart (Shopee style)
    selectedCartItems.forEach((item) => removeFromCart(item.product.id));

    showToast('Tạo đơn hoa thành công! Vui lòng quét mã VietQR để cọc đơn.', 'success');
  };

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

  const cleanPhone = (createdOrder?.senderPhone || senderPhone || '0900000000').replace(/\D/g, '');
  const memoText = `VVF ${createdOrder?.id || '849201'} ${cleanPhone}`;
  const depositVal = createdOrder?.depositAmount || Math.round(totalAmount * 0.5);

  const bankCode = settings.bankId || 'VCB';
  const autoVietQrUrl = `https://img.vietqr.io/image/${bankCode}-${settings.bankAccount || '1029384756'}-compact2.png?amount=${depositVal}&addInfo=${encodeURIComponent(
    memoText
  )}&accountName=${encodeURIComponent(settings.bankHolder || 'V&V FLORIELLE')}`;

  const displayedQrUrl = !settings.useAutoVietQr && settings.bankQrImageUrl ? settings.bankQrImageUrl : autoVietQrUrl;

  const handleCopyText = (text: string, title: string) => {
    navigator.clipboard.writeText(text);
    showToast(`Đã sao chép ${title}!`, 'success');
  };

  if (!isCartOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100000] bg-slate-950/45 backdrop-blur-md flex items-center justify-center p-2.5 pb-28 sm:p-5 sm:pb-8 overflow-y-auto animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl max-h-[calc(100dvh-130px)] sm:max-h-[88vh] bg-white/95 backdrop-blur-3xl rounded-[28px] sm:rounded-[36px] border border-white/95 shadow-[0_25px_60px_rgba(0,0,0,0.28),inset_0_2px_4px_rgba(255,255,255,0.9)] p-4 sm:p-6 flex flex-col justify-between overflow-hidden animate-in zoom-in-95 duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="relative flex items-center justify-center pb-3 border-b border-slate-200 text-center">
          <div className="flex items-center justify-center gap-2 mx-auto">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-slate-900 text-base text-center">
              {step === 'cart' && `Giỏ hoa của bạn (${cart.length})`}
              {step === 'checkout' && 'Thông tin nhận hoa & Cọc đơn'}
              {step === 'success' && 'Xác nhận đơn & Quét mã VietQR'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Đóng giỏ hoa"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Body Content */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3.5 pr-0.5 no-scrollbar">
          {/* STEP 1: SHOPEE-STYLE CART ITEMS LIST */}
          {step === 'cart' && (
            <div className="space-y-3">
              {/* Top Banner: Vị trí nhận hàng & Cước ship Google Maps */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 border border-emerald-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span className="flex items-center gap-1.5 text-emerald-900">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Giao đến tại Hà Nội:</span>
                  </span>
                  <span className="text-[11px] font-black text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full">
                    {shippingKm} km • Cước ship: {formatPrice(shippingFee)}
                  </span>
                </div>

                {/* Quick District Selector Bar */}
                <div className="flex items-center gap-2 text-xs">
                  <select
                    value={selectedDistrictId}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="py-1.5 px-2.5 rounded-xl border border-emerald-300 bg-white font-bold text-xs text-slate-800 focus:outline-none shadow-2xs"
                  >
                    {HANOI_DISTRICTS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.baseKm}km)
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedWardName}
                    onChange={(e) => setSelectedWardName(e.target.value)}
                    className="flex-1 py-1.5 px-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none shadow-2xs truncate"
                  >
                    {currentDistrict.wards.map((w) => (
                      <option key={w.name} value={w.name}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Optional Quick Street detail */}
                <input
                  type="text"
                  placeholder="Nhập số nhà, ngõ/ngách (VD: Số 105 Doãn Kế Thiện...)"
                  value={detailStreet}
                  onChange={(e) => setDetailStreet(e.target.value)}
                  className="glass-input w-full text-xs py-1.5 px-2.5 rounded-xl"
                />
              </div>

              {cart.length === 0 ? (
                <div className="py-16 text-center text-slate-400 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-medium">Giỏ hoa hiện đang trống</p>
                  <button onClick={handleClose} className="btn-secondary text-xs py-2 px-4 rounded-xl">
                    Khám phá mẫu hoa tươi ngay
                  </button>
                </div>
              ) : (
                <>
                  {/* Select All Checkbox Header (Shopee Style) */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-bold text-slate-800">
                    <button
                      type="button"
                      onClick={toggleSelectAll}
                      className="flex items-center gap-2 hover:text-emerald-700 cursor-pointer"
                    >
                      {selectedItemIds.size === cart.length ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                      <span>Chọn tất cả ({cart.length} mẫu hoa)</span>
                    </button>
                    <span className="text-[11px] text-slate-500 font-normal">
                      Đã chọn: <strong className="text-emerald-800 font-bold">{selectedItemIds.size}</strong>/{cart.length}
                    </span>
                  </div>

                  {/* Cart Item Cards with individual Checkbox */}
                  <div className="space-y-2.5">
                    {cart.map((item) => {
                      const isChecked = selectedItemIds.has(item.product.id);
                      return (
                        <div
                          key={item.product.id}
                          className={`p-3 rounded-2xl border transition-all duration-200 flex items-start gap-2.5 ${
                            isChecked
                              ? 'bg-white border-emerald-300 shadow-sm ring-1 ring-emerald-500/10'
                              : 'bg-slate-50/70 border-slate-200 opacity-75'
                          }`}
                        >
                          {/* Checkbox */}
                          <button
                            type="button"
                            onClick={() => toggleItemSelection(item.product.id)}
                            className="mt-4 p-1 text-emerald-600 hover:scale-110 transition-transform cursor-pointer"
                            title={isChecked ? 'Bỏ chọn món này' : 'Tích chọn món này để mua'}
                          >
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-400" />
                            )}
                          </button>

                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-100"
                          />

                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-xs text-slate-800 line-clamp-1">{item.product.name}</h4>
                            <div className="text-emerald-700 font-extrabold text-xs mt-0.5">
                              {formatPrice(item.product.price)}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate mt-0.5">
                              Nơ: {item.ribbonColor}
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                              <div className="flex items-center gap-1.5 border border-slate-200 rounded-lg p-0.5 bg-white">
                                <button
                                  type="button"
                                  onClick={() => {
                                    triggerHaptic(15);
                                    updateCartItemQty(item.product.id, item.quantity - 1);
                                  }}
                                  className="p-1 rounded text-slate-500 hover:bg-slate-100"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-xs font-bold px-1.5 min-w-[20px] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    triggerHaptic(15);
                                    updateCartItemQty(item.product.id, item.quantity + 1);
                                  }}
                                  className="p-1 rounded text-slate-500 hover:bg-slate-100"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  triggerHaptic(25);
                                  removeFromCart(item.product.id);
                                }}
                                className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                                title="Xóa khỏi giỏ"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Shopee Voucher Selector */}
                  <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                        <Ticket className="w-4 h-4 text-amber-600" />
                        <span>V&amp;V Florielle Voucher</span>
                      </div>
                      {appliedVoucher ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">
                            {appliedVoucher.code} (-{formatPrice(appliedVoucher.discountAmount)})
                          </span>
                          <button
                            type="button"
                            onClick={handleRemoveVoucher}
                            className="p-0.5 text-slate-400 hover:text-rose-600"
                            title="Gỡ mã"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIsVoucherPickerOpen(!isVoucherPickerOpen)}
                          className="text-xs font-bold text-amber-800 hover:underline flex items-center gap-1"
                        >
                          <span>Chọn / Nhập mã</span>
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Voucher Picker Dropdown */}
                    {isVoucherPickerOpen && !appliedVoucher && (
                      <div className="space-y-2 pt-1 border-t border-amber-200">
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            placeholder="Nhập mã voucher (VD: FREESHIP30K)..."
                            value={voucherCodeInput}
                            onChange={(e) => setVoucherCodeInput(e.target.value.toUpperCase())}
                            className="glass-input flex-1 text-xs py-1.5 px-2.5 rounded-xl uppercase font-bold"
                          />
                          <button
                            type="button"
                            onClick={() => handleApplyVoucherCode()}
                            className="btn-primary text-xs py-1.5 px-3 rounded-xl"
                          >
                            Áp dụng
                          </button>
                        </div>

                        <div className="space-y-1.5 pt-1">
                          {promotions.filter((p) => p.isActive).map((p) => (
                            <div
                              key={p.id}
                              onClick={() => handleApplyVoucherCode(p.code)}
                              className="p-2 rounded-xl bg-white border border-amber-200 hover:border-amber-400 cursor-pointer flex items-center justify-between text-xs transition-colors"
                            >
                              <div>
                                <strong className="text-amber-900 font-extrabold">{p.code}</strong>
                                <span className="text-slate-500 text-[11px] block">{p.title}</span>
                              </div>
                              <span className="text-emerald-700 font-bold text-[11px]">Dùng ngay</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Summary Box with 4 Cost Breakdown Tiers */}
                  <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1.5 text-xs text-slate-700">
                    <div className="flex justify-between">
                      <span>Tiền hoa ({selectedItemIds.size} mẫu đã chọn):</span>
                      <strong className="text-slate-900">{formatPrice(flowerPrice)}</strong>
                    </div>

                    <div className="flex justify-between text-slate-600">
                      <span>Phí vận chuyển ({shippingKm} km):</span>
                      <span>{shippingFee === 0 ? <strong className="text-emerald-700 font-bold">Freeship</strong> : formatPrice(shippingFee)}</span>
                    </div>

                    {appliedVoucher && (
                      <div className="flex justify-between text-rose-600 font-bold">
                        <span>Giảm giá Voucher ({appliedVoucher.code}):</span>
                        <span>-{formatPrice(appliedVoucher.discountAmount)}</span>
                      </div>
                    )}

                    {weatherSurcharge > 0 && (
                      <div className="flex justify-between text-blue-700">
                        <span className="flex items-center gap-1">
                          <CloudRain className="w-3.5 h-3.5 text-blue-500" />
                          <span>Phụ phí thời tiết ({weatherState?.label}):</span>
                        </span>
                        <span className="font-bold">+{formatPrice(weatherSurcharge)}</span>
                      </div>
                    )}

                    {specialHoursSurcharge > 0 && (
                      <div className="flex justify-between text-purple-700">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-purple-500" />
                          <span>Phụ phí giao giờ đặc biệt:</span>
                        </span>
                        <span className="font-bold">+{formatPrice(specialHoursSurcharge)}</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* STEP 2: CHECKOUT & ADDRESS BOOK (MAX 4) */}
          {step === 'checkout' && (
            <form onSubmit={handleCheckoutSubmit} className="space-y-3.5">
              {/* 1. THÔNG TIN NGƯỜI ĐẶT HOA (NGƯỜI GỬI) */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      {customer ? `1. Thông tin người đặt hoa (${customer.fullName})` : '1. Thông tin người đặt hoa (Quý khách mua nhanh)'}
                    </span>
                  </div>
                  {customer ? (
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                      Hội viên V&amp;V
                    </span>
                  ) : (
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      🌸 Đặt hoa nhanh
                    </span>
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

                {/* SỔ ĐỊA CHỈ KHÁCH HÀNG (TỐI ĐA 4 ĐỊA CHỈ) */}
                {customer && (
                  <div className="pt-2 border-t border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                      <span className="flex items-center gap-1">
                        <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Sổ địa chỉ đã lưu ({customer.savedAddresses?.length || 0}/4):</span>
                      </span>
                      {(!customer.savedAddresses || customer.savedAddresses.length === 0) && (
                        <span className="text-[10px] text-amber-600 font-semibold">Chưa có sổ địa chỉ</span>
                      )}
                    </div>

                    {/* Address cards list */}
                    {customer.savedAddresses && customer.savedAddresses.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {customer.savedAddresses.map((addr) => {
                          const isSelected = selectedSavedAddrId === addr.id;
                          return (
                            <div
                              key={addr.id}
                              onClick={() => handleSelectSavedAddress(addr)}
                              className={`p-2.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                                isSelected
                                  ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/20 shadow-xs'
                                  : 'bg-white border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                                <span className="flex items-center gap-1">
                                  <Building className="w-3 h-3 text-emerald-600" />
                                  <span>{addr.name}</span>
                                </span>
                                {addr.isDefault && (
                                  <span className="text-[9px] font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-full">
                                    Mặc định
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-500 line-clamp-1 mt-1">
                                {addr.recipientAddress}
                              </p>
                              <div className="text-[10px] text-emerald-700 font-bold mt-1">
                                {addr.recipientName} • {addr.recipientPhone}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-[11px] text-amber-900 leading-snug">
                        💡 Bạn chưa lưu sổ địa chỉ. Hãy điền địa chỉ nhận hoa bên dưới, hệ thống sẽ lưu vào sổ địa chỉ tối đa 4 địa chỉ để tự động điền cho các lần đặt sau!
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 2. THÔNG TIN NHẬN HOA TẠI HÀ NỘI */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                <div className="font-bold text-slate-900 text-xs flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>2. Địa chỉ nhận hoa tại Hà Nội (Tính Km chuẩn Maps)</span>
                  </span>
                  <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100/80 px-2 py-0.5 rounded-full">
                    Xuất phát: 105 Doãn Kế Thiện
                  </span>
                </div>

                {/* Cascading dropdowns: District & Ward */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500 mb-0.5 block">Quận / Huyện Hà Nội *</label>
                    <select
                      value={selectedDistrictId}
                      onChange={(e) => handleDistrictChange(e.target.value)}
                      className="glass-input w-full text-xs py-1.5 px-2 rounded-lg font-bold"
                    >
                      {HANOI_DISTRICTS.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.baseKm}km)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 mb-0.5 block">Phường / Xã *</label>
                    <select
                      value={selectedWardName}
                      onChange={(e) => setSelectedWardName(e.target.value)}
                      className="glass-input w-full text-xs py-1.5 px-2 rounded-lg"
                    >
                      {currentDistrict.wards.map((w) => (
                        <option key={w.name} value={w.name}>
                          {w.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Detail Address */}
                <div>
                  <label className="text-[10px] text-slate-500 mb-0.5 block">
                    Địa chỉ chi tiết (Số nhà, tên ngõ, ngách, tên tòa nhà) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Số 105, Ngõ 20 Doãn Kế Thiện hoặc Tòa Landmark 72..."
                    value={detailStreet}
                    onChange={(e) => setDetailStreet(e.target.value)}
                    className="glass-input w-full text-xs py-1.5 px-2.5 rounded-lg"
                  />
                </div>

                {/* Auto Calculated Distance Badge */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 text-xs">
                  <span className="text-slate-600 text-[11px]">Khoảng cách tính theo Google Maps:</span>
                  <span className="font-extrabold text-emerald-800">
                    {shippingKm} km • Cước: {formatPrice(shippingFee)}
                  </span>
                </div>

                {/* Option to save to address book if logged in and < 4 addresses */}
                {customer && (!customer.savedAddresses || customer.savedAddresses.length < 4) && (
                  <div className="pt-1 flex items-center gap-2">
                    <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={shouldSaveAsDefault}
                        onChange={(e) => setShouldSaveAsDefault(e.target.checked)}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>Lưu địa chỉ này vào sổ địa chỉ (tối đa 4 địa chỉ)</span>
                    </label>
                    {shouldSaveAsDefault && (
                      <input
                        type="text"
                        placeholder="Tên gợi nhớ (Nhà, Cty...)"
                        value={addressLabel}
                        onChange={(e) => setAddressLabel(e.target.value)}
                        className="glass-input text-[11px] py-0.5 px-2 w-28 rounded-lg"
                      />
                    )}
                  </div>
                )}

                {/* TÙY CHỌN: GỬI HOA TẶNG HỘ / NGƯỜI NHẬN LÀ NGƯỜI KHÁC (COLLAPSIBLE) */}
                <div className="pt-2 border-t border-slate-200">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isGiftDelivery}
                      onChange={(e) => setIsGiftDelivery(e.target.checked)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                    />
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Gift className="w-4 h-4 text-emerald-600" />
                      <span>Gửi hoa tặng hộ / Người nhận là người khác</span>
                    </span>
                  </label>

                  {/* Collapsible Recipient Fields */}
                  {isGiftDelivery && (
                    <div className="mt-2.5 p-3 rounded-xl bg-white border border-emerald-200/80 space-y-2 animate-in fade-in duration-200">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-500 mb-0.5 block">Họ tên người nhận *</label>
                          <input
                            type="text"
                            required={isGiftDelivery}
                            placeholder="VD: Chị Lan"
                            value={recipientName}
                            onChange={(e) => setRecipientName(e.target.value)}
                            className="glass-input w-full text-xs py-1.5 px-2 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 mb-0.5 block">SĐT người nhận *</label>
                          <input
                            type="tel"
                            required={isGiftDelivery}
                            placeholder="0987 654 321"
                            value={recipientPhone}
                            onChange={(e) => setRecipientPhone(e.target.value)}
                            className="glass-input w-full text-xs py-1.5 px-2 rounded-lg"
                          />
                        </div>
                      </div>

                      <div className="pt-1 flex items-center justify-between text-xs text-slate-600">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={revealSenderToRecipient}
                            onChange={(e) => setRevealSenderToRecipient(e.target.checked)}
                            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                          />
                          <span>Tiết lộ tên người gửi cho người nhận</span>
                        </label>
                        {!revealSenderToRecipient && (
                          <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                            🎁 Tặng hoa giấu tên bí mật
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. THỜI GIAN & THÔNG ĐIỆP THIỆP */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>3. Thời gian &amp; Thông điệp thiệp</span>
                </div>
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
                    <label className="text-[10px] text-slate-500 mb-0.5 block">Khung giờ giao</label>
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
                  <label className="text-[10px] text-slate-500 mb-0.5 block">
                    Nội dung in thiệp / Ruy băng chúc mừng (Miễn phí)
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Chúc mừng sinh nhật chị yêu / Chúc mừng khai trương hồng phát..."
                    value={generalCardMessage}
                    onChange={(e) => setGeneralCardMessage(e.target.value)}
                    className="glass-input w-full text-xs py-1.5 px-2 rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 mb-0.5 block">Ghi chú thêm cho tiệm</label>
                  <input
                    type="text"
                    placeholder="VD: Giao trước 10h sáng, gọi trước khi giao 15 phút..."
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    className="glass-input w-full text-xs py-1.5 px-2 rounded-lg"
                  />
                </div>
              </div>

              {/* 4. PHƯƠNG THỨC THANH TOÁN & TIỀN CỌC */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="font-bold text-slate-900 text-xs flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                    <span>4. Phương thức thanh toán &amp; Cọc đơn</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold">Chính sách cọc 50%</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentChoice('VIETQR')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                      paymentChoice === 'VIETQR'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span>Chuyển khoản VietQR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentChoice('COD')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                      paymentChoice === 'COD'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-emerald-600" />
                    <span>COD (Cọc 50% VietQR)</span>
                  </button>
                </div>

                {paymentChoice === 'VIETQR' && (
                  <div className="pt-1 flex gap-2">
                    <label className="flex-1 p-2 rounded-lg border bg-white cursor-pointer flex items-center gap-2 text-xs">
                      <input
                        type="radio"
                        name="vietqr"
                        checked={vietQrOption === 'DEPOSIT_50'}
                        onChange={() => setVietQrOption('DEPOSIT_50')}
                        className="text-emerald-600"
                      />
                      <span>Cọc 50% ({formatPrice(Math.round(totalAmount * 0.5))})</span>
                    </label>

                    <label className="flex-1 p-2 rounded-lg border bg-white cursor-pointer flex items-center gap-2 text-xs">
                      <input
                        type="radio"
                        name="vietqr"
                        checked={vietQrOption === 'FULL'}
                        onChange={() => setVietQrOption('FULL')}
                        className="text-emerald-600"
                      />
                      <span>Thanh toán 100%</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="btn-secondary py-2.5 px-4 text-xs font-semibold rounded-xl flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Quay lại</span>
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1 py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20"
                >
                  <span>Xác nhận &amp; Quét mã VietQR cọc đơn</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: SUCCESS & VIETQR PAYMENT CODE */}
          {step === 'success' && createdOrder && (
            <div className="space-y-3.5 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 mx-auto flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">Đã tạo đơn hoa thành công!</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Mã đơn hàng: <strong className="text-emerald-700 font-mono text-xs">#{createdOrder.id}</strong>
                </p>
              </div>

              {/* VietQR Box */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-md space-y-3">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                  <span className="font-bold text-slate-700">Quét mã VietQR để cọc đơn:</span>
                  <span className="text-[10px] text-rose-600 font-mono font-bold flex items-center gap-1">
                    <Timer className="w-3.5 h-3.5" />
                    <span>Hết hạn: {Math.floor(countdownSeconds / 60)}:{(countdownSeconds % 60).toString().padStart(2, '0')}</span>
                  </span>
                </div>

                <div className="w-44 h-44 mx-auto rounded-2xl overflow-hidden border-2 border-emerald-500 p-1 bg-white shadow-inner">
                  <img src={displayedQrUrl} alt="VietQR" className="w-full h-full object-contain" />
                </div>

                <div className="space-y-1.5 text-xs text-left bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-[11px]">Ngân hàng:</span>
                    <strong className="text-slate-800">{settings.bankName || 'Vietcombank'}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-[11px]">Số tài khoản:</span>
                    <div className="flex items-center gap-1">
                      <strong className="text-slate-800 font-mono">{settings.bankAccount || '1029384756'}</strong>
                      <button
                        type="button"
                        onClick={() => handleCopyText(settings.bankAccount || '1029384756', 'STK ngân hàng')}
                        className="p-1 text-slate-400 hover:text-emerald-700"
                        title="Sao chép"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-[11px]">Số tiền cọc:</span>
                    <strong className="text-emerald-700 font-extrabold text-sm">{formatPrice(createdOrder.depositAmount)}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-[11px]">Cú pháp:</span>
                    <div className="flex items-center gap-1">
                      <strong className="text-slate-800 font-mono text-[11px]">{memoText}</strong>
                      <button
                        type="button"
                        onClick={() => handleCopyText(memoText, 'Cú pháp chuyển khoản')}
                        className="p-1 text-slate-400 hover:text-emerald-700"
                        title="Sao chép"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bill Upload */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/70 text-left space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                  <Camera className="w-4 h-4 text-emerald-600" />
                  <span>Xác nhận đã thanh toán (Gửi ảnh Bill)</span>
                </div>
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
                  type="button"
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

        {/* Drawer Footer (Step 1 Cart Proceed - Shopee Style) */}
        {step === 'cart' && cart.length > 0 && (
          <div className="pt-3 border-t border-slate-200 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">
                Tổng thanh toán ({selectedItemIds.size} mẫu đã chọn):
              </span>
              <strong className="text-emerald-700 text-base font-black">
                {formatPrice(totalAmount)}
              </strong>
            </div>

            <button
              type="button"
              disabled={selectedItemIds.size === 0}
              onClick={() => {
                if (selectedItemIds.size === 0) {
                  showToast('Vui lòng chọn ít nhất 1 mẫu hoa để đặt mua!', 'error');
                  return;
                }
                setStep('checkout');
              }}
              className={`w-full py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                selectedItemIds.size > 0
                  ? 'btn-primary shadow-md shadow-emerald-600/20 active:scale-98 cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Mua Hàng ({selectedItemIds.size} mẫu) - {formatPrice(totalAmount)}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
