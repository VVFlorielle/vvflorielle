import React, { useState, useEffect, useRef } from 'react';
import {
  Sun,
  CloudRain,
  Snowflake,
  CloudLightning,
  Clock,
  CheckCircle2,
  X,
  Sparkles,
  Info,
  ShieldCheck,
  Smile,
  Save,
  Moon,
  Sunrise,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { WeatherCondition } from '../../types';
import { useBodyScrollLock } from '../../utils/scrollLock';

export const AdminWeatherAssistant: React.FC = () => {
  const {
    weatherState,
    updateWeatherState,
    updateAdminWeatherMascotIcon,
    specialHoursSurchargeRate,
    updateSpecialHoursSurchargeRate,
    shiftHours,
    updateShiftHours,
    weatherSurcharges,
    updateWeatherConditionSurcharge,
    shiftSurcharges,
    updateShiftSurcharges
  } = useStore();

  // Initial draggable position (Exact matching public storefront mascot: left edge, vertically centered)
  const getDefaultPos = () => {
    if (typeof window !== 'undefined') {
      return {
        x: 12,
        y: Math.max(80, Math.round((window.innerHeight - 80) / 2)),
      };
    }
    return { x: 12, y: 340 };
  };

  const [pos, setPos] = useState(getDefaultPos);
  const [isOpen, setIsOpen] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isShiftFeeCustomOpen, setIsShiftFeeCustomOpen] = useState(false);
  const [isWeatherFeeCustomOpen, setIsWeatherFeeCustomOpen] = useState(false);
  const idleTimerRef = useRef<any>(null);

  // Lock body scroll behind modal
  useBodyScrollLock(isOpen);

  // Shift hours local form state for editing
  const [s1Start, setS1Start] = useState(shiftHours?.shift1Start || '07:30');
  const [s1End, setS1End] = useState(shiftHours?.shift1End || '11:30');
  const [s2Start, setS2Start] = useState(shiftHours?.shift2Start || '13:00');
  const [s2End, setS2End] = useState(shiftHours?.shift2End || '22:00');

  useEffect(() => {
    if (shiftHours) {
      setS1Start(shiftHours.shift1Start);
      setS1End(shiftHours.shift1End);
      setS2Start(shiftHours.shift2Start);
      setS2End(shiftHours.shift2End);
    }
  }, [shiftHours]);

  // Dragging refs
  const isDraggingRef = useRef(false);
  const hasMovedRef = useRef(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, initialX: 0, initialY: 0 });

  // Mobile idle auto-fade logic: Fades to subtle opacity when untouched for 4.5 seconds on mobile
  const resetIdleTimer = () => {
    setIsIdle(false);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      setIsIdle(true);
    }, 4500);
  };

  useEffect(() => {
    resetIdleTimer();
    const handleActivity = () => resetIdleTimer();
    window.addEventListener('touchstart', handleActivity, { passive: true });
    window.addEventListener('touchmove', handleActivity, { passive: true });
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('touchmove', handleActivity);
    };
  }, []);

  // Listen to Escape key to dismiss modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Check 1-hour prompt
  const isOneHourPassed = Date.now() - (weatherState.lastPromptTime || 0) >= 3600000;

  // Ultra-smooth pointer drag events (zero stutter / không bị khựng)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isOpen) return;
    isDraggingRef.current = true;
    setIsDragging(true);
    hasMovedRef.current = false;
    resetIdleTimer();

    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      initialX: pos.x,
      initialY: pos.y,
    };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const dx = moveEvent.clientX - dragStartRef.current.mouseX;
      const dy = moveEvent.clientY - dragStartRef.current.mouseY;

      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        hasMovedRef.current = true;
      }

      const newX = Math.max(8, Math.min(window.innerWidth - 75, dragStartRef.current.initialX + dx));
      const newY = Math.max(70, Math.min(window.innerHeight - 80, dragStartRef.current.initialY + dy));
      setPos({ x: newX, y: newY });
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
      setIsDragging(false);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasMovedRef.current) {
      setIsIdle(false);
      setIsOpen(true);
    }
  };

  // Save updated shift hours
  const handleSaveShiftHours = (e: React.FormEvent) => {
    e.preventDefault();
    updateShiftHours({
      shift1Start: s1Start,
      shift1End: s1End,
      shift2Start: s2Start,
      shift2End: s2End
    });
  };

  // Weather options with individually configurable surcharges
  const weatherOptions: {
    condition: WeatherCondition;
    label: string;
    icon: any;
    color: string;
    currentSurcharge: number;
    description: string;
  }[] = [
    {
      condition: 'sunny',
      label: 'Nắng ráo / Đẹp trời',
      icon: Sun,
      color: 'text-amber-500 bg-amber-50 border-amber-200',
      currentSurcharge: 0,
      description: 'Thời tiết chuẩn, giao hoa nhanh chóng và an toàn.'
    },
    {
      condition: 'rain',
      label: 'Mưa gió / Đường ướt',
      icon: CloudRain,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      currentSurcharge: weatherSurcharges?.rain ?? 5000,
      description: 'Hỗ trợ shipper bọc màng chống ướt chuyên dụng và đi lại an toàn.'
    },
    {
      condition: 'cold',
      label: 'Lạnh giá rét buốt',
      icon: Snowflake,
      color: 'text-cyan-600 bg-cyan-50 border-cyan-200',
      currentSurcharge: weatherSurcharges?.cold ?? 5000,
      description: 'Bọc túi chống sốc nhiệt bảo vệ cánh hoa nguyên bản.'
    },
    {
      condition: 'storm',
      label: 'Mưa bão lớn / Ngập lụt',
      icon: CloudLightning,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
      currentSurcharge: weatherSurcharges?.storm ?? 5000,
      description: 'Bọc túi bảo vệ hoa 2 lớp cao cấp và giao bằng xe ô tô chuyên dụng.'
    }
  ];

  // Mascot choices from /images/mascot/mascot-1.webp .. mascot-6.webp
  const mascotChoices = [
    { id: '1', url: '/images/mascot/mascot-1.webp', label: 'Tươi tắn' },
    { id: '2', url: '/images/mascot/mascot-2.webp', label: 'Yêu thương' },
    { id: '3', url: '/images/mascot/mascot-3.webp', label: 'Chu đáo' },
    { id: '4', url: '/images/mascot/mascot-4.webp', label: 'Che mưa' },
    { id: '5', url: '/images/mascot/mascot-5.webp', label: 'Tinh nghịch' },
    { id: '6', url: '/images/mascot/mascot-6.webp', label: 'Vẫy chào' },
  ];

  // Real-time operating hours check based on dynamic shift hours
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  const parseMin = (tStr: string, def: number) => {
    if (!tStr) return def;
    const parts = tStr.split(':');
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  };

  const s1StartMin = parseMin(s1Start, 450);
  const s1EndMin = parseMin(s1End, 690);
  const s2StartMin = parseMin(s2Start, 780);
  const s2EndMin = parseMin(s2End, 1320);

  const isStandardHours = (currentMinutes >= s1StartMin && currentMinutes <= s1EndMin) || (currentMinutes >= s2StartMin && currentMinutes <= s2EndMin);

  return (
    <>
      {/* 1. FLOATING DRAGGABLE MASCOT (TRANSPARENT CHARACTER - ZERO WHITE CIRCLE - SILKY SMOOTH) */}
      <div
        id="admin-weather-assistant"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          touchAction: 'none',
        }}
        className={`fixed z-40 select-none group cursor-grab active:cursor-grabbing ${
          isDragging ? '' : 'transition-opacity duration-300'
        } ${
          isIdle ? 'opacity-25 sm:opacity-90 hover:opacity-100 scale-90 sm:scale-100' : 'opacity-100 scale-100'
        }`}
        onPointerDown={handlePointerDown}
        onClick={handleClick}
        title="Trợ lý thời tiết & vận hành tiệm hoa (Bấm để cập nhật)"
      >
        {/* Transparent Buoyant Floating Mascot (1:1 identical to public storefront Flori, no white circle container) */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center select-none animate-mascot-float">
          <img
            src={weatherState.mascotIcon || '/images/mascot/mascot-4.webp'}
            alt="Trợ lý thời tiết"
            className="w-full h-full object-contain pointer-events-none filter drop-shadow-[0_6px_16px_rgba(5,150,105,0.28)] transition-transform duration-200 group-hover:scale-108 active:scale-95"
          />

          {/* Current weather badge (Bottom Right) */}
          <div className="absolute bottom-0 right-0 p-1 rounded-full bg-white/95 shadow-md border border-slate-200/80 pointer-events-none">
            {weatherState.condition === 'sunny' && <Sun className="w-3.5 h-3.5 text-amber-500" />}
            {weatherState.condition === 'rain' && <CloudRain className="w-3.5 h-3.5 text-blue-500" />}
            {weatherState.condition === 'cold' && <Snowflake className="w-3.5 h-3.5 text-cyan-500" />}
            {weatherState.condition === 'storm' && <CloudLightning className="w-3.5 h-3.5 text-purple-600" />}
          </div>

          {/* Surcharge tag if active (Top Right) */}
          {weatherState.surcharge > 0 && (
            <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[9.5px] font-black border border-white shadow-xs pointer-events-none">
              +{weatherState.surcharge / 1000}k
            </span>
          )}
        </div>

        {/* 1-Hour Reminder Bubble (Appears every 1h if not dismissed, Soft frosted glass with tail) */}
        {isOneHourPassed && !isOpen && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 bg-white/95 text-slate-800 text-[11px] font-bold py-1.5 px-3 rounded-2xl shadow-lg whitespace-nowrap pointer-events-none animate-bounce-subtle border border-emerald-300/90 flex items-center gap-1.5 backdrop-blur-md z-10">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />
            <span>Thời tiết Hà Nội sao rồi bạn ơi?</span>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-r border-b border-emerald-300/90 rotate-45" />
          </div>
        )}
      </div>

      {/* 2. MODAL DIALOG (HORIZONTAL 2-COLUMNS ON DESKTOP, VERTICAL WITH DOCK CLEARANCE ON MOBILE) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100000] flex items-center justify-center p-3 sm:p-5 pb-24 sm:pb-8 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 select-none overflow-y-auto"
          onClick={(e) => {
            // Dismiss automatically when clicking outside modal card
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div
            className="glass-panel w-full max-w-lg md:max-w-4xl lg:max-w-5xl rounded-[28px] sm:rounded-[32px] shadow-2xl border border-white/90 bg-white/95 overflow-hidden flex flex-col my-auto max-h-[calc(100dvh-120px)] sm:max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header (Fixed Top) */}
            <div className="p-4 sm:p-5 pb-3 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white/80">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100/80 flex items-center justify-center p-1 border border-emerald-200">
                  <img src={weatherState.mascotIcon || '/images/mascot/mascot-4.webp'} alt="Mascot" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-1.5">
                    <span>Trợ Lý Vận Hành &amp; Thời Tiết Tiệm Hoa Flori</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Cấu hình giờ mở cửa tiệm, phụ phí thời tiết &amp; phụ phí ngoài giờ giao hoa
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Đóng cửa sổ"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body (Scrollable, NO Scrollbar Protrusion, Horizontal 2-Column on Desktop) */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 no-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                
                {/* === CỘT 1 (LEFT COLUMN): GIỜ HOẠT ĐỘNG, PHỤ PHÍ THEO CA & CHỌN THỜI TIẾT === */}
                <div className="space-y-4">
                  {/* A. Cấu hình Giờ Hoạt Động Của Quán */}
                  <form onSubmit={handleSaveShiftHours} className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-emerald-700" />
                        <span>Giờ Hoạt Động Tiệm Hoa (2 Ca):</span>
                      </span>
                      <button
                        type="submit"
                        className="py-1 px-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                      >
                        <Save className="w-3 h-3" />
                        <span>Lưu giờ tiệm</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {/* Ca sáng */}
                      <div className="p-2.5 rounded-xl bg-white border border-emerald-100 space-y-1.5">
                        <span className="font-bold text-[11px] text-slate-700 flex items-center gap-1">
                          <Sunrise className="w-3.5 h-3.5 text-amber-500" />
                          <span>Ca Sáng:</span>
                        </span>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="time"
                            value={s1Start}
                            onChange={(e) => setS1Start(e.target.value)}
                            className="flex-1 min-w-0 text-xs font-mono font-bold py-1 px-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800"
                          />
                          <span className="text-slate-400 font-bold">-</span>
                          <input
                            type="time"
                            value={s1End}
                            onChange={(e) => setS1End(e.target.value)}
                            className="flex-1 min-w-0 text-xs font-mono font-bold py-1 px-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800"
                          />
                        </div>
                      </div>

                      {/* Ca chiều / tối */}
                      <div className="p-2.5 rounded-xl bg-white border border-emerald-100 space-y-1.5">
                        <span className="font-bold text-[11px] text-slate-700 flex items-center gap-1">
                          <Moon className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Ca Chiều/Tối:</span>
                        </span>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="time"
                            value={s2Start}
                            onChange={(e) => setS2Start(e.target.value)}
                            className="flex-1 min-w-0 text-xs font-mono font-bold py-1 px-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800"
                          />
                          <span className="text-slate-400 font-bold">-</span>
                          <input
                            type="time"
                            value={s2End}
                            onChange={(e) => setS2End(e.target.value)}
                            className="flex-1 min-w-0 text-xs font-mono font-bold py-1 px-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Live Operating Status Notice */}
                    <div className={`p-2 rounded-xl text-[11px] flex items-center gap-2 border ${
                      isStandardHours
                        ? 'bg-emerald-100/70 text-emerald-900 border-emerald-300/80 font-medium'
                        : 'bg-amber-100/80 text-amber-900 border-amber-300 font-bold'
                    }`}>
                      <span className={`w-2 h-2 rounded-full shrink-0 ${isStandardHours ? 'bg-emerald-600 animate-pulse' : 'bg-amber-600'}`} />
                      <span>
                        {isStandardHours
                          ? `Tiệm đang mở cửa tiêu chuẩn (${s1Start}-${s1End} & ${s2Start}-${s2End})`
                          : `Hiện đang ngoài giờ làm việc tiệm (+${(specialHoursSurchargeRate || 5000).toLocaleString('vi-VN')}₫ phụ phí ngoài giờ)`}
                      </span>
                    </div>
                  </form>

                  {/* B. Phụ Phí Khung Giờ Đặc Biệt (Thu gọn thông minh) */}
                  <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200/80 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span className="flex items-center gap-1.5 text-purple-950">
                        <Clock className="w-3.5 h-3.5 text-purple-600" />
                        <span>Phụ Phí Giao Giờ Đặc Biệt:</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsShiftFeeCustomOpen(!isShiftFeeCustomOpen)}
                        className="flex items-center gap-1 text-[11px] font-semibold text-purple-700 hover:text-purple-900 transition-colors cursor-pointer"
                      >
                        <span>{isShiftFeeCustomOpen ? 'Thu gọn' : 'Chỉnh chi tiết'}</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isShiftFeeCustomOpen ? 'rotate-180' : ''}`} />
                      </button>
                    </div>

                    {/* Dòng tóm tắt ngắn gọn */}
                    <div className="flex items-center justify-between text-[11px] text-purple-900 bg-white/80 py-1.5 px-3 rounded-xl border border-purple-100/90">
                      <span>Mức phụ phí tự động tính:</span>
                      <strong className="text-purple-700 font-extrabold text-xs">
                        +{(specialHoursSurchargeRate || 5000).toLocaleString('vi-VN')}₫
                      </strong>
                    </div>

                    {isShiftFeeCustomOpen && (
                      <div className="space-y-2 pt-1 border-t border-purple-100/90 animate-in fade-in duration-150">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] text-slate-600">
                            <span>Ca đêm (sau {s2End}) / Sáng sớm (trước {s1Start}):</span>
                            <strong className="text-purple-800 font-bold">
                              +{(shiftSurcharges?.nightEarly ?? 5000).toLocaleString('vi-VN')}₫
                            </strong>
                          </div>
                          <div className="flex gap-1.5">
                            {[5000, 10000, 15000, 20000].map((fee) => (
                              <button
                                key={fee}
                                type="button"
                                onClick={() => {
                                  updateShiftSurcharges({
                                    nightEarly: fee,
                                    noon: shiftSurcharges?.noon ?? 5000
                                  });
                                }}
                                className={`flex-1 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                                  (shiftSurcharges?.nightEarly ?? 5000) === fee
                                    ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                +{fee / 1000}k
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1 pt-1 border-t border-purple-100">
                          <div className="flex items-center justify-between text-[11px] text-slate-600">
                            <span>Ca nghỉ trưa ({s1End} - {s2Start}):</span>
                            <strong className="text-purple-800 font-bold">
                              +{(shiftSurcharges?.noon ?? 5000).toLocaleString('vi-VN')}₫
                            </strong>
                          </div>
                          <div className="flex gap-1.5">
                            {[5000, 10000, 15000, 20000].map((fee) => (
                              <button
                                key={fee}
                                type="button"
                                onClick={() => {
                                  updateShiftSurcharges({
                                    nightEarly: shiftSurcharges?.nightEarly ?? 5000,
                                    noon: fee
                                  });
                                }}
                                className={`flex-1 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                                  (shiftSurcharges?.noon ?? 5000) === fee
                                    ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                +{fee / 1000}k
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* C. Chọn Trạng Thái Thời Tiết Hiện Tại Tại Hà Nội */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-800 block">
                      Chọn trạng thái thời tiết hiện tại tại Hà Nội:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {weatherOptions.map((opt) => {
                        const Icon = opt.icon;
                        const isSelected = weatherState.condition === opt.condition;
                        return (
                          <button
                            key={opt.condition}
                            type="button"
                            onClick={() => updateWeatherState(opt.condition, opt.currentSurcharge, opt.label, opt.description)}
                            className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                              isSelected
                                ? 'bg-emerald-50/90 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20'
                                : 'bg-white border-slate-200 hover:border-emerald-200 hover:bg-slate-50'
                            }`}
                          >
                            <div className={`p-2 rounded-xl shrink-0 border ${opt.color}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs text-slate-900 truncate">{opt.label}</span>
                                {opt.currentSurcharge > 0 && (
                                  <span className="text-[10px] font-black text-rose-600 shrink-0 ml-1">
                                    +{opt.currentSurcharge.toLocaleString('vi-VN')}₫
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                                {opt.description}
                              </p>
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 self-center" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* === CỘT 2 (RIGHT COLUMN): CHỈNH MỨC PHÍ TỪNG THỜI TIẾT & CHỌN LINH VẬT === */}
                <div className="space-y-4">
                  {/* A. Chỉnh Từng Mức Phí Cho Từng Loại Thời Tiết (Thu gọn thông minh) */}
                  <div className="rounded-2xl bg-slate-50 border border-slate-200/80 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setIsWeatherFeeCustomOpen(!isWeatherFeeCustomOpen)}
                      className="w-full p-3 sm:p-3.5 flex items-center justify-between text-xs font-bold text-slate-800 hover:bg-slate-100/80 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <CloudRain className="w-4 h-4 text-blue-600" />
                        <span>Chỉnh Mức Phí Riêng Từng Thời Tiết:</span>
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                        <span>{isWeatherFeeCustomOpen ? 'Thu gọn' : 'Chỉnh chi tiết'}</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isWeatherFeeCustomOpen ? 'rotate-180' : ''}`} />
                      </span>
                    </button>

                    {isWeatherFeeCustomOpen && (
                      <div className="p-3 sm:p-3.5 pt-0 space-y-2.5 border-t border-slate-100 animate-in fade-in duration-150">
                        {/* Mưa gió */}
                        <div className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-blue-700 flex items-center gap-1">
                              <CloudRain className="w-3.5 h-3.5" />
                              <span>🌧️ Mưa gió / Đường ướt:</span>
                            </span>
                            <strong className="text-blue-900 font-extrabold text-xs">
                              +{(weatherSurcharges?.rain ?? 5000).toLocaleString('vi-VN')}₫
                            </strong>
                          </div>
                          <div className="flex gap-1.5">
                            {[5000, 10000, 15000, 20000].map((fee) => (
                              <button
                                key={fee}
                                type="button"
                                onClick={() => updateWeatherConditionSurcharge('rain', fee)}
                                className={`flex-1 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                                  (weatherSurcharges?.rain ?? 5000) === fee
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                +{fee / 1000}k
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Lạnh rét */}
                        <div className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-cyan-700 flex items-center gap-1">
                              <Snowflake className="w-3.5 h-3.5" />
                              <span>❄️ Lạnh giá rét buốt:</span>
                            </span>
                            <strong className="text-cyan-900 font-extrabold text-xs">
                              +{(weatherSurcharges?.cold ?? 5000).toLocaleString('vi-VN')}₫
                            </strong>
                          </div>
                          <div className="flex gap-1.5">
                            {[5000, 10000, 15000, 20000].map((fee) => (
                              <button
                                key={fee}
                                type="button"
                                onClick={() => updateWeatherConditionSurcharge('cold', fee)}
                                className={`flex-1 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                                  (weatherSurcharges?.cold ?? 5000) === fee
                                    ? 'bg-cyan-600 text-white border-cyan-600 shadow-xs'
                                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                +{fee / 1000}k
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Mưa bão lớn */}
                        <div className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-purple-700 flex items-center gap-1">
                              <CloudLightning className="w-3.5 h-3.5" />
                              <span>⛈️ Mưa bão lớn / Ngập lụt:</span>
                            </span>
                            <strong className="text-purple-900 font-extrabold text-xs">
                              +{(weatherSurcharges?.storm ?? 5000).toLocaleString('vi-VN')}₫
                            </strong>
                          </div>
                          <div className="flex gap-1.5">
                            {[5000, 10000, 15000, 20000].map((fee) => (
                              <button
                                key={fee}
                                type="button"
                                onClick={() => updateWeatherConditionSurcharge('storm', fee)}
                                className={`flex-1 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                                  (weatherSurcharges?.storm ?? 5000) === fee
                                    ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                +{fee / 1000}k
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* B. Chọn Biểu Cảm Linh Vật Trợ Lý Flori */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span className="flex items-center gap-1.5">
                        <Smile className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Chọn biểu cảm linh vật Flori:</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">Quản lý diện mạo</span>
                    </div>
                    <div className="grid grid-cols-6 gap-2">
                      {mascotChoices.map((m) => {
                        const isCur = weatherState.mascotIcon === m.url;
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => updateAdminWeatherMascotIcon(m.url)}
                            className={`p-1.5 rounded-2xl border transition-all flex flex-col items-center gap-1 cursor-pointer ${
                              isCur
                                ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/30'
                                : 'bg-slate-50 border-slate-200 hover:bg-white'
                            }`}
                            title={m.label}
                          >
                            <img src={m.url} alt={m.label} className="w-9 h-9 object-contain" />
                            <span className="text-[9px] font-semibold text-slate-600 truncate w-full text-center">
                              {m.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* C. Trạng Thái Đồng Bộ */}
                  <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 text-emerald-950 text-xs flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-[11px] leading-relaxed">
                      Toàn bộ cấu hình giờ mở cửa tiệm, phụ phí thời tiết &amp; phụ phí ngoài giờ tự động đồng bộ ngay lập tức ra giỏ hàng khách hàng.
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Footer (Fixed Bottom, Hidden on Mobile to maximize screen space) */}
            <div className="hidden sm:flex p-3 sm:p-4 border-t border-slate-100 items-center justify-between shrink-0 bg-slate-50/90 text-xs">
              <span className="text-slate-500 text-[11px]">
                Bấm ra ngoài vùng hộp thoại hoặc phím ESC để đóng
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="btn-primary text-xs py-2 px-6 rounded-xl cursor-pointer font-bold shadow-md"
              >
                Xong &amp; Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
