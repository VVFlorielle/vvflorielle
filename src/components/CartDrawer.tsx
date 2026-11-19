import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
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
  Building,
  Navigation,
  RefreshCw,
  Coins,
  Zap,
  Flame,
  Tag,
  Check,
  Info,
  ChevronRight
} from 'lucide-react';
import { PaymentType, SavedAddress } from '../types';
import { useBodyScrollLock } from '../utils/scrollLock';
import { compressImage } from '../utils/imageCompressor';
import { isValidVietnamesePhone } from '../utils/formatters';
import { resolveCurrentLocation, resolveCurrentLocationWithAddress } from '../utils/geolocation';
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

const isSlotPassedToday = (slot: string, selectedDate: string): boolean => {
  const todayStr = new Date().toLocaleDateString('en-CA');
  if (selectedDate !== todayStr) return false;

  if (slot.includes('Giao hỏa tốc')) {
    const nowHour = new Date().getHours();
    return nowHour >= 22;
  }

  const match = slot.match(/-\s*(\d{1,2}):(\d{2})/);
  if (!match) return false;
  const [_, endH, endM] = match;
  const now = new Date();
  const curMinutes = now.getHours() * 60 + now.getMinutes();
  const slotEndMinutes = parseInt(endH, 10) * 60 + parseInt(endM, 10);

  return curMinutes > slotEndMinutes - 30;
};

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
    shiftHours,
    validateVoucherForOrder,
    autoPickBestVouchers,
    calculateMaxAllowedPoints,
    isAdmin,
    activeAdminUser,
    setIsAuthModalOpen,
    setAuthModalMode
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

  // GPS Geolocation state
  const [isLocating, setIsLocating] = useState(false);
  const [gpsCustomKm, setGpsCustomKm] = useState<number | null>(null);

  const handleGetLocation = async () => {
    setIsLocating(true);
    try {
      const res = await resolveCurrentLocationWithAddress();
      const dist = HANOI_DISTRICTS.find((d) => d.id === res.districtId) || HANOI_DISTRICTS[0];
      setSelectedDistrictId(dist.id);

      const hasWard = dist.wards.some((w) => w.name === res.wardName);
      setSelectedWardName(hasWard ? res.wardName : (dist.wards[0]?.name || ''));
      setGpsCustomKm(res.distanceKm);

      if (res.detailedAddress) {
        setDetailStreet(res.detailedAddress);
      }

      const accInfo = res.accuracy ? ` (Độ chính xác: ±${Math.round(res.accuracy)}m)` : '';
      if (!res.isWithinHanoi) {
        showToast(
          `Vị trí hiện tại cách tiệm ${res.distanceKm}km (ngoài phạm vi giao hoa Hà Nội). Vui lòng chọn địa chỉ người nhận tại Hà Nội!`,
          'error'
        );
      } else if (res.warnOverDistance) {
        showToast(
          `Đã định vị & tự điền: ${res.detailedAddress || res.wardName}${accInfo} - ${res.distanceKm}km. Bạn có thể sửa thêm số phòng/ngõ nếu cần!`,
          'info'
        );
      } else {
        showToast(
          `Đã định vị & tự điền địa chỉ: ${res.detailedAddress || res.wardName}${accInfo} - ${res.distanceKm}km`,
          'success'
        );
      }
    } catch (err: any) {
      showToast(err?.message || 'Không thể lấy vị trí hiện tại.', 'error');
    } finally {
      setIsLocating(false);
    }
  };

  // If district changes, reset ward to first ward of that district
  const handleDistrictChange = (distId: string) => {
    setSelectedDistrictId(distId);
    setGpsCustomKm(null); // Reset custom GPS km on manual selection
    const dist = HANOI_DISTRICTS.find((d) => d.id === distId);
    if (dist && dist.wards.length > 0) {
      setSelectedWardName(dist.wards[0].name);
    }
  };

  // Precise Distance Calculation (Km)
  const shippingKm = useMemo(() => {
    if (gpsCustomKm !== null && gpsCustomKm > 0) {
      return gpsCustomKm;
    }
    return calculatePreciseKm(selectedDistrictId, selectedWardName, detailStreet);
  }, [selectedDistrictId, selectedWardName, detailStreet, gpsCustomKm]);

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
    return new Date().toLocaleDateString('en-CA');
  });
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState(() => {
    const todayStr = new Date().toLocaleDateString('en-CA');
    const valid = DELIVERY_TIME_SLOTS.find((s) => !isSlotPassedToday(s, todayStr));
    return valid || DELIVERY_TIME_SLOTS[DELIVERY_TIME_SLOTS.length - 1];
  });

  // Auto-switch to next available slot if current slot has passed
  useEffect(() => {
    const availableSlots = DELIVERY_TIME_SLOTS.filter((s) => !isSlotPassedToday(s, deliveryDate));
    if (availableSlots.length > 0 && isSlotPassedToday(deliveryTimeSlot, deliveryDate)) {
      setDeliveryTimeSlot(availableSlots[0]);
    }
  }, [deliveryDate]);
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
    setGpsCustomKm(null);
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

  // 2-Tier Voucher & Loyalty Point state (Shopee Standard)
  const [voucherCodeInput, setVoucherCodeInput] = useState('');
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [voucherModalTab, setVoucherModalTab] = useState<'FLOWER' | 'SHIPPING'>('FLOWER');

  // Tầng 1: Voucher Hoa Tươi
  const [appliedFlowerVoucher, setAppliedFlowerVoucher] = useState<{
    code: string;
    title: string;
    discountAmount: number;
  } | null>(null);

  // Tầng 2: Voucher Vận Chuyển
  const [appliedShippingVoucher, setAppliedShippingVoucher] = useState<{
    code: string;
    title: string;
    discountAmount: number;
  } | null>(null);

  // Điểm tích lũy / Hoa Xu (Cap 50% tiền hoa)
  const [isUsingPoints, setIsUsingPoints] = useState(false);

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

  // Account role detection for Cart experience
  const isOwnerAccount = Boolean(isAdmin && (activeAdminUser === 'chuquan' || activeAdminUser === 'vvflorielle'));
  const isTestAdminAccount = Boolean(isAdmin && activeAdminUser === 'admin');

  // Simulated points wallet for Admin test: 50,000 Xu
  const availablePoints = customer?.points || (isTestAdminAccount ? 50000 : 0);

  // 50% max cap on points
  const maxAllowedPoints = useMemo(() => {
    return calculateMaxAllowedPoints(flowerPrice, availablePoints);
  }, [calculateMaxAllowedPoints, flowerPrice, availablePoints]);

  const pointsDiscount = isUsingPoints && (customer || isTestAdminAccount) ? maxAllowedPoints.discountAmount : 0;
  const flowerVoucherDiscount = appliedFlowerVoucher ? appliedFlowerVoucher.discountAmount : 0;
  const shippingVoucherDiscount = appliedShippingVoucher ? appliedShippingVoucher.discountAmount : 0;

  const totalDiscountAmount = flowerVoucherDiscount + shippingVoucherDiscount + pointsDiscount;
  const finalFlowerCost = Math.max(0, flowerPrice - flowerVoucherDiscount - pointsDiscount);
  const finalShippingCost = Math.max(0, shippingFee + weatherSurcharge + specialHoursSurcharge - shippingVoucherDiscount);
  const totalAmount = finalFlowerCost + finalShippingCost;

  // Next voucher milestone for Shopee progress bar
  const nextVoucherMilestone = useMemo(() => {
    if (flowerPrice <= 0) return null;
    const candidates = promotions.filter(
      (p) => p.minOrder && p.minOrder > flowerPrice && p.isActive !== false && (p.voucherScope === 'FLOWER' || (!p.voucherScope && p.discountType !== 'FREESHIP'))
    );
    if (candidates.length === 0) return null;
    candidates.sort((a, b) => (a.minOrder || 0) - (b.minOrder || 0));
    const next = candidates[0];
    return {
      additionalNeeded: (next.minOrder || 0) - flowerPrice,
      discountAmount: next.discountAmount,
      code: next.code
    };
  }, [flowerPrice, promotions]);

  // 2-Tier Promo lists for Modal
  const flowerPromos = useMemo(() => {
    const list: Array<{
      code: string;
      title: string;
      discountAmount: number;
      discountType: string;
      minOrder: number;
      maxDiscount?: number;
      badge?: string;
      validUntil: string;
      usageLimit?: number;
      usedCount?: number;
      hourlyDealStart?: string;
      hourlyDealEnd?: string;
    }> = [];
    const seen = new Set<string>();

    if (customer?.userVouchers) {
      customer.userVouchers.forEach((uv) => {
        const isFlower = uv.voucherScope === 'FLOWER' || (!uv.voucherScope && uv.discountType !== 'FREESHIP');
        if (isFlower && !uv.isUsed && !seen.has(uv.code)) {
          seen.add(uv.code);
          list.push({
            code: uv.code,
            title: uv.title,
            discountAmount: uv.discountAmount,
            discountType: uv.discountType,
            minOrder: uv.minOrder,
            maxDiscount: uv.maxDiscount,
            badge: 'Ví Của Bạn',
            validUntil: uv.validUntil
          });
        }
      });
    }

    promotions.forEach((p) => {
      const isFlower = p.voucherScope === 'FLOWER' || (!p.voucherScope && p.discountType !== 'FREESHIP');
      if (isFlower && p.isActive && !seen.has(p.code)) {
        seen.add(p.code);
        list.push({
          code: p.code,
          title: p.title,
          discountAmount: p.discountAmount,
          discountType: p.discountType,
          minOrder: p.minOrder,
          maxDiscount: p.maxDiscount,
          badge: p.badge,
          validUntil: p.validUntil,
          usageLimit: p.usageLimit,
          usedCount: p.usedCount,
          hourlyDealStart: p.hourlyDealStart,
          hourlyDealEnd: p.hourlyDealEnd
        });
      }
    });

    return list;
  }, [customer?.userVouchers, promotions]);

  const shippingPromos = useMemo(() => {
    const list: Array<{
      code: string;
      title: string;
      discountAmount: number;
      discountType: string;
      minOrder: number;
      maxDiscount?: number;
      badge?: string;
      validUntil: string;
      usageLimit?: number;
      usedCount?: number;
      hourlyDealStart?: string;
      hourlyDealEnd?: string;
      maxShippingRadiusKm?: number;
    }> = [];
    const seen = new Set<string>();

    if (customer?.userVouchers) {
      customer.userVouchers.forEach((uv) => {
        const isShip = uv.voucherScope === 'SHIPPING' || uv.discountType === 'FREESHIP';
        if (isShip && !uv.isUsed && !seen.has(uv.code)) {
          seen.add(uv.code);
          list.push({
            code: uv.code,
            title: uv.title,
            discountAmount: uv.discountAmount,
            discountType: uv.discountType,
            minOrder: uv.minOrder,
            maxDiscount: uv.maxDiscount,
            badge: 'Ví Của Bạn',
            validUntil: uv.validUntil,
            maxShippingRadiusKm: uv.maxShippingRadiusKm
          });
        }
      });
    }

    promotions.forEach((p) => {
      const isShip = p.voucherScope === 'SHIPPING' || p.discountType === 'FREESHIP';
      if (isShip && p.isActive && !seen.has(p.code)) {
        seen.add(p.code);
        list.push({
          code: p.code,
          title: p.title,
          discountAmount: p.discountAmount,
          discountType: p.discountType,
          minOrder: p.minOrder,
          maxDiscount: p.maxDiscount,
          badge: p.badge,
          validUntil: p.validUntil,
          usageLimit: p.usageLimit,
          usedCount: p.usedCount,
          maxShippingRadiusKm: p.maxShippingRadiusKm
        });
      }
    });

    return list;
  }, [customer?.userVouchers, promotions]);

  // Apply single voucher code with 2-tier detection
  const handleApplyVoucherCode = (codeToApply?: string) => {
    const code = (codeToApply || voucherCodeInput).trim().toUpperCase();
    if (!code) return;

    // Item 6: Require customer login to apply voucher, preventing unauthorized anonymous usage
    if (!customer && !isAdmin) {
      showToast('🌸 Vui lòng đăng nhập số điện thoại để lưu mã và áp dụng ưu đãi này nha!', 'info');
      setIsVoucherModalOpen(false);
      setIsCartOpen(false);
      setAuthModalMode('customer');
      setIsAuthModalOpen(true);
      return;
    }

    const res = validateVoucherForOrder(code, {
      flowerPrice,
      shippingFee,
      itemCount: selectedCartItems.length,
      distanceKm: shippingKm,
      customer
    });

    if (!res.valid) {
      showToast(res.reason || 'Không thể áp dụng voucher này!', 'error');
      return;
    }

    if (res.voucherScope === 'SHIPPING') {
      setAppliedShippingVoucher({
        code: res.promo?.code || code,
        title: res.promo?.title || 'Ưu đãi phí vận chuyển',
        discountAmount: res.discountAmount
      });
      showToast(`Áp dụng mã vận chuyển ${res.promo?.code || code}: Giảm ${formatPrice(res.discountAmount)}`, 'success');
    } else {
      setAppliedFlowerVoucher({
        code: res.promo?.code || code,
        title: res.promo?.title || 'Ưu đãi hoa tươi',
        discountAmount: res.discountAmount
      });
      showToast(`Áp dụng mã hoa ${res.promo?.code || code}: Giảm ${formatPrice(res.discountAmount)}`, 'success');
    }

    setVoucherCodeInput('');
  };

  const handleRemoveFlowerVoucher = () => {
    setAppliedFlowerVoucher(null);
    showToast('Đã gỡ mã ưu đãi hoa', 'info');
  };

  const handleRemoveShippingVoucher = () => {
    setAppliedShippingVoucher(null);
    showToast('Đã gỡ mã ưu đãi vận chuyển', 'info');
  };

  // Auto-pick best 2 vouchers
  const handleAutoPickBest = () => {
    if (!customer && !isAdmin) {
      showToast('🌸 Vui lòng đăng nhập số điện thoại để tự động chọn voucher hời nhất nha!', 'info');
      setIsVoucherModalOpen(false);
      setIsCartOpen(false);
      setAuthModalMode('customer');
      setIsAuthModalOpen(true);
      return;
    }

    const best = autoPickBestVouchers(flowerPrice, shippingFee, selectedCartItems.length, shippingKm, customer);
    if (!best.flowerVoucher && !best.shippingVoucher) {
      showToast('Chưa có mã ưu đãi nào phù hợp với đơn hiện tại!', 'info');
      return;
    }
    let appliedCount = 0;
    if (best.flowerVoucher) {
      setAppliedFlowerVoucher({
        code: best.flowerVoucher.code,
        title: best.flowerVoucher.title,
        discountAmount: best.flowerDiscount
      });
      appliedCount++;
    }
    if (best.shippingVoucher) {
      setAppliedShippingVoucher({
        code: best.shippingVoucher.code,
        title: best.shippingVoucher.title,
        discountAmount: best.shippingDiscount
      });
      appliedCount++;
    }
    showToast(`⚡ Đã tự động áp dụng combo ${appliedCount} voucher hời nhất!`, 'success');
  };

  // Dynamic Voucher Re-validation
  useEffect(() => {
    if (appliedFlowerVoucher) {
      const res = validateVoucherForOrder(appliedFlowerVoucher.code, {
        flowerPrice,
        shippingFee,
        itemCount: selectedCartItems.length,
        distanceKm: shippingKm,
        customer
      });
      if (!res.valid) {
        setAppliedFlowerVoucher(null);
        showToast(`Mã hoa ${appliedFlowerVoucher.code} đã tự động gỡ do đơn không còn đủ điều kiện.`, 'info');
      } else if (res.discountAmount !== appliedFlowerVoucher.discountAmount) {
        setAppliedFlowerVoucher((prev) => (prev ? { ...prev, discountAmount: res.discountAmount } : null));
      }
    }
    if (appliedShippingVoucher) {
      const res = validateVoucherForOrder(appliedShippingVoucher.code, {
        flowerPrice,
        shippingFee,
        itemCount: selectedCartItems.length,
        distanceKm: shippingKm,
        customer
      });
      if (!res.valid) {
        setAppliedShippingVoucher(null);
        showToast(`Mã vận chuyển ${appliedShippingVoucher.code} đã tự động gỡ do đơn không còn đủ điều kiện.`, 'info');
      } else if (res.discountAmount !== appliedShippingVoucher.discountAmount) {
        setAppliedShippingVoucher((prev) => (prev ? { ...prev, discountAmount: res.discountAmount } : null));
      }
    }
  }, [flowerPrice, shippingFee, selectedCartItems.length, shippingKm, customer, validateVoucherForOrder, showToast]);

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

    const unavailableItem = selectedCartItems.find((item) => item.product.isAvailable === false);
    if (unavailableItem) {
      showToast(`Mẫu hoa "${unavailableItem.product.name}" hiện đang tạm hết hoa tươi! Vui lòng bỏ chọn để tiếp tục.`, 'error');
      return;
    }

    if (!senderName.trim() || !senderPhone.trim()) {
      showToast('Vui lòng điền họ tên và số điện thoại người gửi!', 'error');
      return;
    }

    if (!isValidVietnamesePhone(senderPhone.trim())) {
      showToast('Số điện thoại người gửi không hợp lệ! Vui lòng nhập đúng 10 số nhà mạng Việt Nam.', 'error');
      return;
    }

    const finalRecipientName = isGiftDelivery ? recipientName.trim() : senderName.trim();
    const finalRecipientPhone = isGiftDelivery ? recipientPhone.trim() : senderPhone.trim();

    if (!finalRecipientName || !finalRecipientPhone) {
      showToast('Vui lòng điền thông tin người nhận hoa!', 'error');
      return;
    }

    if (!isValidVietnamesePhone(finalRecipientPhone)) {
      showToast('Số điện thoại người nhận hoa không hợp lệ! Vui lòng nhập đúng 10 số nhà mạng Việt Nam.', 'error');
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
      discountAmount: totalDiscountAmount,
      voucherCode: [appliedFlowerVoucher?.code, appliedShippingVoucher?.code].filter(Boolean).join(' + ') || undefined,
      flowerVoucherCode: appliedFlowerVoucher?.code,
      flowerDiscountAmount: flowerVoucherDiscount,
      shippingVoucherCode: appliedShippingVoucher?.code,
      shippingDiscountAmount: shippingVoucherDiscount,
      pointsUsed: isUsingPoints ? maxAllowedPoints.maxPoints : 0,
      pointsDiscountAmount: pointsDiscount,
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

    showToast('Gửi đơn hoa thành công! Tiệm đang kiểm tra kho hoa và sẽ duyệt đơn cho bạn.', 'success');
  };

  const handleBillFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedDataUrl = await compressImage(file, 1000, 1000, 0.72);
        setBillPreview(compressedDataUrl);
        if (createdOrder) {
          uploadOrderBill(createdOrder.id, compressedDataUrl);
          setIsBillUploaded(true);
        }
      } catch (err) {
        console.error('Lỗi nén ảnh biên lai', err);
        showToast('Không thể nén ảnh biên lai, vui lòng thử lại!', 'error');
      }
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
      className="fixed inset-0 z-[100000] bg-slate-950/50 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl max-h-[92dvh] sm:max-h-[88vh] my-auto bg-white/95 backdrop-blur-3xl rounded-[28px] sm:rounded-[36px] border border-white/95 shadow-[0_25px_60px_rgba(0,0,0,0.28),inset_0_2px_4px_rgba(255,255,255,0.9)] p-4 sm:p-6 flex flex-col justify-between overflow-hidden animate-in zoom-in-95 duration-200 relative"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <select
                    value={selectedDistrictId}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full py-1.5 px-2.5 rounded-xl border border-emerald-300 bg-white font-bold text-xs text-slate-800 focus:outline-none shadow-2xs"
                  >
                    {HANOI_DISTRICTS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.baseKm}km)
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedWardName}
                    onChange={(e) => {
                      setSelectedWardName(e.target.value);
                      setGpsCustomKm(null);
                    }}
                    className="w-full py-1.5 px-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none shadow-2xs truncate"
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
                            <div className="text-[#ee4d2d] font-black text-xs mt-0.5 fixed-semantic product-price tracking-tight">
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

                  {/* Thanh nhắc nhở tiến trình mua thêm để đạt voucher hời hơn (chuẩn Shopee) */}
                  {nextVoucherMilestone && (
                    <div
                      onClick={() => {
                        setVoucherModalTab('FLOWER');
                        setIsVoucherModalOpen(true);
                      }}
                      className="p-2.5 rounded-xl bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-200/80 flex items-center justify-between text-xs text-rose-800 cursor-pointer hover:bg-rose-100/60 transition-colors shadow-2xs"
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Sparkles className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span className="truncate">
                          Mua thêm <strong>{formatPrice(nextVoucherMilestone.additionalNeeded)}</strong> để được dùng mã giảm <strong>{formatPrice(nextVoucherMilestone.discountAmount)}</strong>
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-rose-500 shrink-0 ml-1" />
                    </div>
                  )}



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

                    {appliedFlowerVoucher && (
                      <div className="flex justify-between text-rose-600 font-bold">
                        <span>Giảm giá hoa ({appliedFlowerVoucher.code}):</span>
                        <span>-{formatPrice(flowerVoucherDiscount)}</span>
                      </div>
                    )}

                    {appliedShippingVoucher && (
                      <div className="flex justify-between text-emerald-700 font-bold">
                        <span>Giảm phí vận chuyển ({appliedShippingVoucher.code}):</span>
                        <span>-{formatPrice(shippingVoucherDiscount)}</span>
                      </div>
                    )}

                    {pointsDiscount > 0 && (
                      <div className="flex justify-between text-amber-700 font-bold">
                        <span>Dùng Hoa Xu ({maxAllowedPoints.maxPoints} điểm):</span>
                        <span>-{formatPrice(pointsDiscount)}</span>
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

                    <div className="pt-2 border-t border-emerald-200/80 flex justify-between items-baseline text-sm">
                      <span className="font-extrabold text-slate-900">Tổng thanh toán:</span>
                      <div className="text-right">
                        <span className="font-black text-rose-600 text-base">{formatPrice(totalAmount)}</span>
                        {totalDiscountAmount > 0 && (
                          <span className="text-[10px] text-emerald-700 font-bold block">
                            (Tiết kiệm {formatPrice(totalDiscountAmount)})
                          </span>
                        )}
                      </div>
                    </div>
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
                  <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100/80 px-2 py-0.5 rounded-full shrink-0">
                    Xuất phát: {settings.address ? settings.address.replace(', Cầu Giấy, Hà Nội', '').replace(', Mai Dịch, Cầu Giấy, Hà Nội', '').replace(', Hà Nội', '') : '105 Doãn Kế Thiện'}
                  </span>
                </div>

                {/* Nút Lấy Vị Trí Hiện Tại (GPS Geolocation) */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 bg-emerald-50/90 border border-emerald-200 p-2.5 rounded-xl">
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-950 font-medium">
                    <Navigation className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Đang ở nơi nhận hoa? Bấm để tự động tính km chuẩn xác:</span>
                  </div>
                  <button
                    type="button"
                    disabled={isLocating}
                    onClick={handleGetLocation}
                    className="py-1 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer transition-colors disabled:opacity-50 shrink-0 shadow-2xs"
                    title="Lấy toạ độ GPS chính xác và tự động tính khoảng cách"
                  >
                    {isLocating ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Đang định vị...</span>
                      </>
                    ) : (
                      <>
                        <Navigation className="w-3 h-3" />
                        <span>📍 Lấy Vị Trí Hiện Tại</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Cascading dropdowns: District & Ward (2 hàng trên Mobile, 2 cột trên Desktop) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500 mb-0.5 block font-semibold">Quận / Huyện Hà Nội *</label>
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
                    <label className="text-[10px] text-slate-500 mb-0.5 block font-semibold">Phường / Xã *</label>
                    <select
                      value={selectedWardName}
                      onChange={(e) => {
                        setSelectedWardName(e.target.value);
                        setGpsCustomKm(null);
                      }}
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
                  <label className="text-[10px] text-slate-500 mb-0.5 block font-semibold">
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
                  <span className="text-slate-600 text-[11px] flex items-center gap-1">
                    {gpsCustomKm !== null ? (
                      <>
                        <Navigation className="w-3 h-3 text-emerald-600" />
                        <span className="font-semibold text-emerald-800">Khoảng cách từ GPS thiết bị:</span>
                      </>
                    ) : (
                      <span>Khoảng cách tính theo Google Maps:</span>
                    )}
                  </span>
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
                      min={new Date().toISOString().split('T')[0]}
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
                      {DELIVERY_TIME_SLOTS.map((slot) => {
                        const isPassed = isSlotPassedToday(slot, deliveryDate);
                        return (
                          <option key={slot} value={slot} disabled={isPassed}>
                            {slot} {isPassed ? '(Đã qua)' : ''}
                          </option>
                        );
                      })}
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
              {(() => {
                const isDepositRequired = (settings.depositRequired !== false) && totalAmount >= (settings.minOrderForDeposit ?? 0);
                const currentDepositRate = settings.depositRate ?? 50;
                const calculatedDepositAmount = Math.round(totalAmount * (currentDepositRate / 100));

                return (
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="font-bold text-slate-900 text-xs flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                        <span>4. Phương thức thanh toán &amp; Cọc đơn</span>
                      </span>
                      <span className="text-[10px] text-emerald-700 font-bold">
                        {isDepositRequired ? `Chính sách cọc ${currentDepositRate}%` : 'COD 100% (Không cần cọc)'}
                      </span>
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
                        <span>{isDepositRequired ? `COD (Cọc ${currentDepositRate}% VietQR)` : 'COD (Nhận hoa trả tiền)'}</span>
                      </button>
                    </div>

                    {paymentChoice === 'VIETQR' && (
                      <div className="pt-1 flex gap-2">
                        {isDepositRequired && (
                          <label className="flex-1 p-2 rounded-lg border bg-white cursor-pointer flex items-center gap-2 text-xs">
                            <input
                              type="radio"
                              name="vietqr"
                              checked={vietQrOption === 'DEPOSIT_50'}
                              onChange={() => setVietQrOption('DEPOSIT_50')}
                              className="text-emerald-600"
                            />
                            <span>Cọc {currentDepositRate}% ({formatPrice(calculatedDepositAmount)})</span>
                          </label>
                        )}

                        <label className="flex-1 p-2 rounded-lg border bg-white cursor-pointer flex items-center gap-2 text-xs">
                          <input
                            type="radio"
                            name="vietqr"
                            checked={!isDepositRequired || vietQrOption === 'FULL'}
                            onChange={() => setVietQrOption('FULL')}
                            className="text-emerald-600"
                          />
                          <span>Thanh toán 100% ({formatPrice(totalAmount)})</span>
                        </label>
                      </div>
                    )}
                  </div>
                );
              })()}

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
                  <span>Gửi đơn hoa tới tiệm kiểm tra &amp; duyệt</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: SUCCESS & BOUTIQUE PROCESS */}
          {step === 'success' && createdOrder && (
            <div className="space-y-3.5 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 mx-auto flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">Đã Gửi Đơn Hoa Tới Tiệm!</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Mã đơn hàng: <strong className="text-emerald-700 font-mono text-xs">#{createdOrder.id}</strong>
                </p>
              </div>

              {/* 3-Step Process Flow Visual */}
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-left space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Quy trình phục vụ chuẩn V&amp;V Florielle:</span>
                </div>
                <div className="space-y-1.5 text-[11px] text-amber-950 font-medium">
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                    <div><strong>Tiệm kiểm tra kho hoa &amp; lịch cắm:</strong> Florist đang xác nhận hoa trong kho và chuẩn bị phụ kiện (ước tính 3-5 phút).</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                    <div><strong>Tiệm duyệt đơn &amp; Báo cọc:</strong> Sau khi tiệm duyệt nhận đơn, hệ thống sẽ gửi thông báo để bạn quét mã VietQR cọc 50%.</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                    <div><strong>Cắm hoa &amp; Giao tận tay:</strong> Nhận cọc xong, florist tiến hành cắm hoa và shipper giao nhanh chóng.</div>
                  </div>
                </div>
              </div>

              {/* Collapsible VietQR Preview for Early Deposit */}
              <details className="text-left rounded-2xl bg-white border border-slate-200/90 p-3 shadow-xs">
                <summary className="text-xs font-bold text-slate-700 cursor-pointer hover:text-emerald-700 flex items-center justify-between">
                  <span>Xem trước thông tin VietQR (Nếu muốn cọc trước)</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </summary>

                <div className="mt-3 space-y-3 pt-2 border-t border-slate-100">
                  <div className="w-40 h-40 mx-auto rounded-2xl overflow-hidden border-2 border-emerald-500 p-1 bg-white shadow-inner">
                    <img src={displayedQrUrl} alt="VietQR" className="w-full h-full object-contain" />
                  </div>

                  <div className="space-y-1 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
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
                      <span className="text-slate-500 text-[11px]">Số tiền cọc 50%:</span>
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

                  {/* Bill Upload (Optional advance) */}
                  <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/70 text-left space-y-1.5">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-900">
                      <Camera className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Tải ảnh biên lai cọc (nếu đã chuyển khoản)</span>
                    </div>
                    {billPreview ? (
                      <div className="space-y-1">
                        <div className="relative rounded-lg overflow-hidden border border-emerald-300 max-h-28">
                          <img src={billPreview} alt="Ảnh biên lai" className="w-full h-full object-cover" />
                          <div className="absolute top-1 right-1 bg-emerald-700 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>Đã tải</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <label className="flex items-center justify-center gap-1.5 p-2 rounded-lg border border-dashed border-emerald-300 bg-white hover:bg-emerald-50 cursor-pointer text-[11px] font-semibold text-emerald-800 transition-colors">
                        <Upload className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Chọn ảnh biên lai</span>
                        <input type="file" accept="image/*" onChange={handleBillFileChange} className="hidden" />
                      </label>
                    )}
                  </div>
                </div>
              </details>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    setCurrentView('customer');
                  }}
                  className="btn-primary flex-1 py-2.5 text-xs font-semibold rounded-xl"
                >
                  Theo Dõi Đơn Hàng Của Tôi
                </button>
              </div>
            </div>
          )}
        </div>

        {/* CỤM ĐÁY 3 HÀNG CHUẨN SHOPEE (VOUCHER, HOA XU, MUA HÀNG) */}
        {step === 'cart' && cart.length > 0 && (
          <div className="pt-2.5 border-t border-slate-200 bg-white/95 -mx-4 -mb-4 sm:-mx-6 sm:-mb-6 px-4 sm:px-6 pb-3 space-y-2 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
            {/* HÀNG 1: VOUCHER TIỆM HOA BAR */}
            <div
              onClick={() => setIsVoucherModalOpen(true)}
              className="flex items-center justify-between py-2 px-3 rounded-xl bg-gradient-to-r from-amber-50/70 via-rose-50/50 to-orange-50/60 border border-amber-200/90 cursor-pointer hover:bg-amber-100/50 transition-colors"
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <Ticket className="w-4 h-4 text-rose-500 shrink-0" />
                <span className="text-xs font-bold text-slate-800">Voucher Tiệm Hoa (Mã Giảm + Freeship)</span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {appliedFlowerVoucher && (
                  <span className="text-[10px] font-extrabold text-rose-700 bg-rose-100/90 border border-rose-300 px-2 py-0.5 rounded-md">
                    -{formatPrice(flowerVoucherDiscount)}
                  </span>
                )}
                {appliedShippingVoucher && (
                  <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-2 py-0.5 rounded-md">
                    {shippingVoucherDiscount >= shippingFee ? 'Freeship' : `-${formatPrice(shippingVoucherDiscount)}`}
                  </span>
                )}
                {!appliedFlowerVoucher && !appliedShippingVoucher && (
                  <span className="text-xs text-rose-600 font-semibold">Chọn hoặc nhập mã</span>
                )}
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* HÀNG 2: HOA XU BAR WITH TOGGLE SWITCH */}
            <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-amber-50/60 border border-amber-200/80">
              <div className="flex items-center gap-1.5 min-w-0">
                <Coins className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-xs text-slate-700 font-semibold flex items-center gap-1 flex-wrap">
                  <span>
                    Dùng {customer ? `${maxAllowedPoints.maxPoints.toLocaleString('vi-VN')} Hoa Xu` : isTestAdminAccount ? `${maxAllowedPoints.maxPoints.toLocaleString('vi-VN')} Hoa Xu (Admin Test)` : 'Hoa Xu'}
                  </span>
                  {isUsingPoints && maxAllowedPoints.discountAmount > 0 && (
                    <strong className="text-rose-600 font-bold">(-{formatPrice(maxAllowedPoints.discountAmount)})</strong>
                  )}
                  <span
                    className="text-slate-400 hover:text-slate-600 cursor-help"
                    title="1 Xu = 1₫. Tối đa giảm 50% tiền hoa theo chính sách quán"
                  >
                    (?)
                  </span>
                </span>
              </div>

              {customer || isTestAdminAccount ? (
                <button
                  type="button"
                  disabled={maxAllowedPoints.maxPoints === 0}
                  onClick={() => setIsUsingPoints(!isUsingPoints)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                    isUsingPoints && maxAllowedPoints.maxPoints > 0 ? 'bg-amber-500' : 'bg-slate-300'
                  } ${maxAllowedPoints.maxPoints === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title={maxAllowedPoints.maxPoints === 0 ? 'Số dư không đủ điểm hoặc đã đạt giới hạn' : 'Bật/Tắt dùng Hoa Xu'}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                      isUsingPoints && maxAllowedPoints.maxPoints > 0 ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              ) : isOwnerAccount ? (
                <span className="text-[10px] text-emerald-800 font-semibold italic">
                  Chủ quán xem web
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    setAuthModalMode('customer');
                    setIsAuthModalOpen(true);
                  }}
                  className="text-xs text-rose-600 font-bold hover:underline cursor-pointer shrink-0"
                >
                  Đăng nhập &gt;
                </button>
              )}
            </div>

            {/* HÀNG 3: CHECKBOX TẤT CẢ, GIÁ TIỀN & NÚT MUA HÀNG */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="cart-select-all-bottom"
                  checked={cart.length > 0 && selectedItemIds.size === cart.length}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500 cursor-pointer"
                />
                <label htmlFor="cart-select-all-bottom" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Tất cả ({selectedItemIds.size})
                </label>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1.5 text-xs">
                    <span className="text-[11px] text-slate-500 hidden sm:inline">
                      🚚 {shippingFee === 0 ? '15k' : formatPrice(shippingFee)} |
                    </span>
                    <span className="font-black text-base sm:text-lg text-[#ee4d2d] fixed-semantic product-price tracking-tight">
                      {formatPrice(totalAmount)}
                    </span>
                  </div>
                  {totalDiscountAmount > 0 && (
                    <span className="text-[10px] text-rose-600 font-bold block">
                      Tiết kiệm {formatPrice(totalDiscountAmount)}
                    </span>
                  )}
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
                  className={`py-2 px-4 sm:px-5 text-xs font-black rounded-xl transition-all shadow-md active:scale-95 cursor-pointer ${
                    selectedItemIds.size > 0
                      ? 'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-rose-500/25'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Mua hàng ({selectedItemIds.size})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL KHO VOUCHER (CHUẨN SHOPEE: MÃ HOA + MÃ SHIP) */}
        {isVoucherModalOpen && typeof document !== 'undefined' && createPortal(
          <div className="fixed inset-0 z-[100010] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] w-full max-w-[420px] max-h-[85vh] flex flex-col shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden border border-slate-100">
              {/* Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                    <Ticket className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">Kho Voucher V&amp;V Florielle</h3>
                    <p className="text-[11px] text-slate-500">Áp dụng song song 1 mã hoa + 1 mã vận chuyển</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsVoucherModalOpen(false)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Input Code */}
              <div className="p-3 bg-amber-50/40 border-b border-amber-100 flex gap-2">
                <input
                  type="text"
                  placeholder="Nhập mã voucher (VD: VVF-WEEK10K, FREESHIP30K)..."
                  value={voucherCodeInput}
                  onChange={(e) => setVoucherCodeInput(e.target.value.toUpperCase())}
                  className="glass-input flex-1 text-xs py-2 px-3 rounded-xl uppercase font-bold"
                />
                <button
                  type="button"
                  onClick={() => handleApplyVoucherCode()}
                  className="btn-primary text-xs py-2 px-4 rounded-xl font-bold shrink-0 cursor-pointer"
                >
                  Áp dụng
                </button>
              </div>

              {/* 2 Tabs */}
              <div className="grid grid-cols-2 p-1.5 bg-slate-100/80 border-b border-slate-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setVoucherModalTab('FLOWER')}
                  className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    voucherModalTab === 'FLOWER'
                      ? 'bg-white text-rose-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Tag className="w-3.5 h-3.5 text-rose-500" />
                  <span>Voucher Hoa ({flowerPromos.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVoucherModalTab('SHIPPING')}
                  className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    voucherModalTab === 'SHIPPING'
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Vận Chuyển ({shippingPromos.length})</span>
                </button>
              </div>

              {/* List */}
              <div className="p-3 overflow-y-auto space-y-2.5 flex-1 divide-y divide-slate-100">
                {(voucherModalTab === 'FLOWER' ? flowerPromos : shippingPromos).map((promo) => {
                  const check = validateVoucherForOrder(promo.code, {
                    flowerPrice,
                    shippingFee,
                    itemCount: selectedCartItems.length,
                    distanceKm: shippingKm,
                    customer
                  });
                  const isSelected =
                    voucherModalTab === 'FLOWER'
                      ? appliedFlowerVoucher?.code === promo.code
                      : appliedShippingVoucher?.code === promo.code;

                  return (
                    <div
                      key={promo.code}
                      className={`pt-2.5 first:pt-0 p-3 rounded-2xl border transition-all flex flex-col justify-between gap-2 ${
                        isSelected
                          ? 'bg-emerald-50/80 border-emerald-400 ring-1 ring-emerald-400'
                          : check.valid
                          ? 'bg-white border-slate-200 hover:border-amber-300'
                          : 'bg-slate-50/70 border-slate-200/80 opacity-70'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-mono font-black text-slate-900 text-xs px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
                              {promo.code}
                            </span>
                            {promo.badge && (
                              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                                {promo.badge}
                              </span>
                            )}
                            {promo.hourlyDealStart && (
                              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Flame className="w-3 h-3 text-amber-600 fill-amber-600" />
                                <span>Flash {promo.hourlyDealStart}-{promo.hourlyDealEnd}</span>
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-xs text-slate-800">{promo.title}</h4>
                          <p className="text-[11px] text-slate-500">
                            Đơn tối thiểu {formatPrice(promo.minOrder)} • Hạn: {promo.validUntil}
                          </p>
                          {promo.usageLimit && (
                            <p className="text-[10px] text-slate-400">
                              Đã dùng {promo.usedCount || 0}/{promo.usageLimit} lượt toàn hệ thống
                            </p>
                          )}
                          {!check.valid && (
                            <p className="text-[11px] font-bold text-amber-700 flex items-center gap-1 mt-1">
                              <Info className="w-3 h-3 shrink-0" />
                              <span>{check.reason}</span>
                            </p>
                          )}
                        </div>

                        <div className="text-right shrink-0">
                          {isSelected ? (
                            <button
                              type="button"
                              onClick={() => {
                                if (voucherModalTab === 'FLOWER') handleRemoveFlowerVoucher();
                                else handleRemoveShippingVoucher();
                              }}
                              className="px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-100 hover:bg-rose-200 rounded-xl transition-colors cursor-pointer"
                            >
                              Gỡ mã
                            </button>
                          ) : check.valid ? (
                            <button
                              type="button"
                              onClick={() => {
                                handleApplyVoucherCode(promo.code);
                                if (customer || isAdmin) {
                                  setIsVoucherModalOpen(false);
                                }
                              }}
                              className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors cursor-pointer"
                            >
                              Dùng ngay
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled
                              className="px-3 py-1.5 text-xs font-semibold text-slate-400 bg-slate-200 rounded-xl cursor-not-allowed"
                            >
                              Chưa đủ đ/k
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Modal Footer */}
              <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  {voucherModalTab === 'FLOWER'
                    ? appliedFlowerVoucher
                      ? `Đang áp dụng: ${appliedFlowerVoucher.code}`
                      : 'Chưa chọn mã hoa'
                    : appliedShippingVoucher
                    ? `Đang áp dụng: ${appliedShippingVoucher.code}`
                    : 'Chưa chọn mã vận chuyển'}
                </span>
                <button
                  type="button"
                  onClick={() => setIsVoucherModalOpen(false)}
                  className="btn-primary text-xs py-1.5 px-4 rounded-xl cursor-pointer"
                >
                  Xong
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    </div>
  );
};
