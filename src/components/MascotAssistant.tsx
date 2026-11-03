import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Sparkles,
  X,
  Send,
  Volume2,
  PhoneCall,
  ShoppingBag,
  HelpCircle,
  MessageCircle,
  Flower2,
  ChevronRight,
  ShieldCheck,
  Truck,
  Gift,
  Move
} from 'lucide-react';

interface MascotMessage {
  id: string;
  sender: 'mascot' | 'user';
  text: string;
  time: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const FAQ_CHIPS = [
  {
    q: 'Giao hoa trong bao lâu?',
    a: 'V&V Florielle giao hoa hỏa tốc chỉ từ 15 phút tại nội thành và 60 phút ngoại thành Hà Nội. Trước khi shipper giao đi, Florist luôn chụp ảnh gửi mẫu hoàn thiện thực tế qua Zalo cho bạn duyệt ưng ý 100% mới xuất phát bạn nhé! 💕'
  },
  {
    q: 'Khoảng cách ship & phí giao?',
    a: 'Tiệm xuất phát từ 105 Doãn Kế Thiện, Cầu Giấy. Bán kính dưới 3km đơn từ 400.000đ được Miễn Phí Vận Chuyển (Freeship). Từ 3 - 7km: 35k; 7 - 12km: 50k. Từ 20 - 50km có cảnh báo chất lượng hoa tươi. Trên 50km vui lòng liên hệ Hotline tiệm để được phục vụ chuyến xe chuyên dụng!'
  },
  {
    q: 'Hoa có tươi mới loại 1 không?',
    a: '100% hoa tại V&V Florielle là hoa tuyển chọn loại 1 nhập mới mỗi ngày từ đơn vị vườn hoa & hoa ngoại nhập khẩu cao cấp. Tiệm cam kết bảo hành đổi mới 100% trong 2H nếu hoa bị dập nát hoặc không đúng mẫu yêu cầu!'
  },
  {
    q: 'Cách cọc đơn qua VietQR?',
    a: 'Sau khi chọn hoa và bấm Đặt hàng, bạn chỉ cần quét mã VietQR tự động. Tiệm hỗ trợ cọc trước 50% hoặc thanh toán đủ 100%. Trợ lý AI và Florist sẽ đối soát biên lai tự động trong 2 phút và chuyển sang cắm hoa ngay nha!'
  },
  {
    q: 'Gửi hoa tặng hộ & Giấu tên?',
    a: 'Bạn chỉ cần tích chọn "Gửi hoa tặng hộ", sau đó chọn "Tặng bí mật (Ẩn danh)". Tiệm hoa sẽ giữ kín 100% danh tính của bạn, người nhận sẽ không biết ai gửi hoa mà chỉ nhận được bó hoa xinh cùng lời chúc ngọt ngào!'
  },
  {
    q: 'Đặc quyền Hội viên & Tích điểm?',
    a: 'Mỗi 10.000đ khi mua hoa bạn được tích lũy 1 điểm. Xác thực OTP sẽ mở khóa 100% giá trị điểm để đổi mã Freeship, nhận quà sinh nhật 100% Freeship và lưu sẵn tối đa 3 mẫu địa chỉ người nhận không cần OTP lại!'
  },
  {
    q: 'Địa chỉ tiệm hoa ở đâu?',
    a: 'Tiệm hoa tươi nghệ thuật V&V Florielle tọa lạc tại: Số 105 Doãn Kế Thiện, Cầu Giấy, Hà Nội. Mở cửa đón khách từ 06:30 đến 21:30 tất cả các ngày trong tuần. Bạn ghé tiệm ngắm hoa nhé!'
  }
];

const MASCOT_TIPS = [
  '🌸 V&V Florielle 105 Doãn Kế Thiện chào bạn nha! 💕',
  '⚡ Giao hoa hỏa tốc chỉ từ 15 phút nội thành & 60 phút ngoại thành nè!',
  '🎁 Tặng Voucher Freeship 100% khi tích đủ 100 điểm thưởng!',
  '📸 Florist chụp ảnh gửi mẫu hoàn thiện qua Zalo trước khi giao nha!',
  '🎀 Tặng kèm thiệp chúc mừng viết tay & ruy băng lụa cao cấp!',
  '✨ Kéo rê tớ đi bất cứ đâu trên màn hình cũng được nha!',
  '🌷 Cậu cần tư vấn chọn hoa dịp gì? Chạm vào tớ nhé! 💬'
];

export const MascotAssistant: React.FC = () => {
  const {
    settings,
    testCuteVoice,
    setIsCartOpen,
    setCurrentView,
    setAuthModalMode,
    setIsAuthModalOpen
  } = useStore();

  const [isOpen, setIsOpen] = useState(false);
  // On mobile screens (< 768px), do not auto-show speech bubble to prevent covering hero content
  const [showBubble, setShowBubble] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 768 : false
  );
  const [tipIndex, setTipIndex] = useState(0);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<MascotMessage[]>([
    {
      id: 'msg-1',
      sender: 'mascot',
      text: 'Chào bạn nha! Mình là Flori 🌸 - Trợ lý ảo của Tiệm hoa nghệ thuật V&V Florielle 105 Doãn Kế Thiện. Bạn cần mình tư vấn chọn mẫu hoa, thời gian giao hàng hay chính sách cọc đơn nè?',
      time: 'Vừa xong'
    }
  ]);

  // Initial draggable position (Fixed at exact vertical center on the left edge)
  const getDefaultPos = () => ({
    x: 12,
    y: typeof window !== 'undefined' ? Math.round((window.innerHeight - 80) / 2) : 340,
  });

  const [pos, setPos] = useState(getDefaultPos);
  const [dimensions, setDimensions] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 375,
    height: typeof window !== 'undefined' ? window.innerHeight : 667,
  }));
  const isDraggingRef = useRef(false);
  const hasMovedRef = useRef(false);
  const lastToggleTimeRef = useRef(0);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, initialX: 0, initialY: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll messages in chat drawer
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Keep mascot inside viewport on window resize
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setDimensions({ width: w, height: h });
      setPos((prev) => ({
        x: Math.max(10, Math.min(prev.x, w - 75)),
        y: Math.max(65, Math.min(prev.y, h - 85)),
      }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Speech bubble cycling: rotates every 14s, visible for 4.5s, hides on page scroll
  useEffect(() => {
    // Only auto-show tip bubble on desktop to prevent obscuring mobile content
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setShowBubble(false);
      return;
    }

    let hideTimer: any = setTimeout(() => {
      setShowBubble(false);
    }, 4500);

    const cycleInterval = setInterval(() => {
      if (!isOpen && (typeof window === 'undefined' || window.innerWidth >= 768)) {
        setTipIndex((prev) => (prev + 1) % MASCOT_TIPS.length);
        setShowBubble(true);
        if (hideTimer) clearTimeout(hideTimer);
        hideTimer = setTimeout(() => {
          setShowBubble(false);
        }, 4500);
      }
    }, 14000);

    const handleScroll = () => {
      setShowBubble(false);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (hideTimer) clearTimeout(hideTimer);
      clearInterval(cycleInterval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen]);

  // Pointer drag event handler (Compatible with Mouse & Touch, matching phototiinlove)
  const handlePointerDown = (e: React.PointerEvent) => {
    // If clicked inside chat modal or close buttons, do not trigger drag
    if ((e.target as HTMLElement).closest('.mascot-modal-card')) return;

    isDraggingRef.current = true;
    hasMovedRef.current = false;
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      initialX: pos.x,
      initialY: pos.y,
    };

    const handlePointerMove = (moveEvt: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const dx = moveEvt.clientX - dragStartRef.current.mouseX;
      const dy = moveEvt.clientY - dragStartRef.current.mouseY;

      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        hasMovedRef.current = true;
      }

      const newX = Math.max(10, Math.min(window.innerWidth - 75, dragStartRef.current.initialX + dx));
      const newY = Math.max(65, Math.min(window.innerHeight - 85, dragStartRef.current.initialY + dy));
      setPos({ x: newX, y: newY });
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
      // If dragged, set a small timestamp to suppress false click trigger
      if (hasMovedRef.current) {
        lastToggleTimeRef.current = Date.now();
      }
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
  };

  const handleMascotClick = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const now = Date.now();
    // Debounce guard: strictly prevent dual-fire / rapid double click within 350ms
    if (now - lastToggleTimeRef.current < 350) {
      return;
    }

    // Only toggle if not dragged
    if (!hasMovedRef.current) {
      lastToggleTimeRef.current = now;
      setIsOpen((prev) => !prev);
      setShowBubble(false);
    }
  };

  const handleSendQuestion = (questionText: string, predefinedAnswer?: string) => {
    if (!questionText.trim()) return;

    const userMsg: MascotMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: questionText.trim(),
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Generate response
    setTimeout(() => {
      let replyText = predefinedAnswer;
      if (!replyText) {
        const lower = questionText.toLowerCase();
        const matchedFaq = FAQ_CHIPS.find((f) =>
          lower.includes(f.q.toLowerCase().slice(0, 8)) ||
          (lower.includes('ship') && f.q.includes('ship')) ||
          (lower.includes('giao') && f.q.includes('bao lâu')) ||
          (lower.includes('tươi') && f.q.includes('tươi')) ||
          (lower.includes('cọc') && f.q.includes('VietQR')) ||
          (lower.includes('tặng') && f.q.includes('tặng')) ||
          (lower.includes('điểm') && f.q.includes('Hội viên')) ||
          (lower.includes('địa chỉ') && f.q.includes('ở đâu'))
        );

        if (matchedFaq) {
          replyText = matchedFaq.a;
        } else if (lower.includes('giá') || lower.includes('bao nhiêu')) {
          replyText = 'Hoa tại V&V Florielle có mức giá niêm yết minh bạch từ 350.000đ đến hơn 2.000.000đ cho các dòng kệ khai trương, giỏ hoa thiết kế và lan hồ điệp. Bạn có thể duyệt các mẫu hoa ngay trên trang chủ nha! 💕';
        } else if (lower.includes('hotline') || lower.includes('liên hệ') || lower.includes('sđt') || lower.includes('zalo')) {
          replyText = `Hotline và Zalo tư vấn 24/7 của tiệm là: ${settings.hotline}. Bạn có thể bấm gọi ngay hoặc nhắn tin để Florist hỗ trợ thiết kế mẫu riêng nha!`;
        } else {
          replyText = `Cảm ơn bạn đã hỏi nè! Flori ghi nhận câu hỏi "${questionText}". Tiệm hoa tươi V&V Florielle 105 Doãn Kế Thiện luôn sẵn sàng hỗ trợ bạn giao hoa tươi 2H Hà Nội và tư vấn mẫu riêng qua Hotline: ${settings.hotline} nha! 💕`;
        }
      }

      const botMsg: MascotMessage = {
        id: `bot-${Date.now()}`,
        sender: 'mascot',
        text: replyText,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
    }, 400);
  };

  const handleSpeakMessage = (text: string) => {
    testCuteVoice(text);
  };

  // Determine if mascot is in the right half of the screen
  const isRightSide = pos.x > (typeof window !== 'undefined' ? window.innerWidth / 2 : 500);

  // Check screen width
  const isMobile = dimensions.width < 640;

  // Comfortable chat card dimensions:
  // Mobile: full-width feel with comfortable padding, max width 360px
  const cardWidth = isMobile ? Math.min(dimensions.width - 32, 360) : 380;
  // Mobile height: comfortable size (480px, capped at viewport height - 110 to ensure room for the flying mascot above)
  const maxAvailableCardHeight = Math.max(340, dimensions.height - 110);
  const cardHeight = isMobile ? Math.min(480, maxAvailableCardHeight) : 520;

  // Center the card on mobile
  const mobileCardLeft = Math.max(16, Math.round((dimensions.width - cardWidth) / 2));
  // Place card vertically: centered if screen is tall enough, but top is at least 74px so the mascot sits cleanly above it
  const mobileCardTop = Math.max(74, Math.round((dimensions.height - cardHeight) / 2));

  // Mascot dynamic position:
  // When chat opens on mobile, mascot smoothly flies to top-left OUTSIDE the chat frame!
  // X: aligned with card's left edge
  // Y: sits directly above the card's top edge (mobileCardTop - 68px)
  const targetX = isMobile && isOpen ? mobileCardLeft : pos.x;
  const targetY = isMobile && isOpen ? Math.max(6, mobileCardTop - 68) : pos.y;

  // Calculate smart desktop position for the chat window
  const chatLeft = Math.max(16, Math.min(dimensions.width - 400, isRightSide ? pos.x - 390 : pos.x + 80));
  const chatTop = Math.max(70, Math.min(dimensions.height - 540, pos.y - 180));

  return (
    <>
      {/* 1. DRAGGABLE FLOATING AI MASCOT (Matching phototiinlove) */}
      <div
        className="fixed z-[100] select-none touch-none flex items-center cursor-pointer group"
        style={{
          left: `${targetX}px`,
          top: `${targetY}px`,
          transitionProperty: 'left, top, transform',
          transitionDuration: '400ms',
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onPointerDown={handlePointerDown}
      >
        {/* Floating Greeting Speech Bubble (Dynamic Left / Right depending on screen position) */}
        {!isOpen && showBubble && (
          <div
            onClick={handleMascotClick}
            className={`absolute top-1/2 -translate-y-1/2 w-64 p-3 rounded-2xl bg-white/95 backdrop-blur-xl border border-emerald-300 shadow-xl text-xs text-slate-800 cursor-pointer animate-in fade-in zoom-in-95 duration-200 group hover:border-emerald-500 z-10 ${
              isRightSide ? 'right-full mr-3.5' : 'left-full ml-3.5'
            }`}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowBubble(false);
              }}
              className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-[10px]"
            >
              ×
            </button>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 mb-0.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
              <span>Flori trợ lý ảo</span>
              <span className="text-[9px] font-normal text-slate-400 ml-auto">Kéo rê tự do ⇄</span>
            </div>
            <p className="text-[11px] text-slate-700 leading-snug">
              {MASCOT_TIPS[tipIndex]}
            </p>

            {/* Bubble arrow pointing towards mascot */}
            <div
              className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white/95 border-emerald-300 rotate-45 ${
                isRightSide
                  ? '-right-1.5 border-t border-r'
                  : '-left-1.5 border-b border-l'
              }`}
            />
          </div>
        )}

        {/* Transparent Floating Mascot (NO Circular Container / Always shows brand logo) */}
        <div
          onClick={handleMascotClick}
          className="relative group cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95"
          title="Trợ lý ảo V&V Florielle (Bấm để mở hoặc ẩn khung trò chuyện)"
        >
          {/* Always display the transparent floral mascot logo (Never replaced or obscured by X) */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center select-none">
            <img
              src={settings.mascotImageUrl || '/images/mascot/mascot-1.png'}
              alt="Linh vật AI V&V Florielle"
              className={`w-full h-full object-contain pointer-events-none filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-300 ${
                isOpen ? 'scale-105 drop-shadow-[0_6px_16px_rgba(4,120,87,0.45)]' : ''
              }`}
            />
          </div>

          {/* Online status indicator dot (Emerald when idle, pulsing amber when chat is active) */}
          <span
            className={`absolute top-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm flex items-center justify-center pointer-events-none transition-colors duration-300 ${
              isOpen ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
          </span>
        </div>
      </div>

      {/* 2. INTERACTIVE AI MASCOT CHAT DRAWER / WINDOW (Anchored near Mascot) */}
      {isOpen && (
        <>
          {/* Backdrop on mobile for clean dismissal */}
          <div
            className="fixed inset-0 z-[80] bg-black/30 backdrop-blur-2xs sm:hidden"
            onClick={() => setIsOpen(false)}
          />

          <div
            className="mascot-modal-card fixed z-[90] flex flex-col bg-white/95 backdrop-blur-2xl rounded-3xl border border-white/90 shadow-[0_24px_60px_rgba(0,0,0,0.22),inset_0_1.5px_1px_rgba(255,255,255,1)] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            style={
              isMobile
                ? {
                    left: `${mobileCardLeft}px`,
                    top: `${mobileCardTop}px`,
                    width: `${cardWidth}px`,
                    height: `${cardHeight}px`,
                  }
                : {
                    left: `${chatLeft}px`,
                    top: `${chatTop}px`,
                    width: '380px',
                    height: '520px',
                    maxHeight: '85vh',
                  }
            }
          >
            {/* Header */}
            <div className="p-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-md items-center justify-center shadow-xs border border-white/30 overflow-hidden">
                  <img src={settings.mascotImageUrl || '/images/mascot/mascot-1.png'} alt="Flori" className="w-7 h-7 object-contain" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm">Flori Trợ Lý Ảo</h3>
                    <span className="text-[9px] font-black bg-white text-emerald-800 px-1.5 py-0.2 rounded-full">
                      AI 24/7
                    </span>
                  </div>
                  <p className="text-[10px] text-emerald-100 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                    <span>Giải đáp thông tin tiệm hoa &amp; dịch vụ</span>
                  </p>
                </div>
              </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => testCuteVoice('Chào bạn nha! Mình là trợ lý AI nữ của tiệm hoa V&V Florielle 105 Doãn Kế Thiện đây nè!')}
                    className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-colors"
                    title="Nghe thử giọng đọc AI nữ"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-colors"
                    title="Đóng trợ lý"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick FAQ Chips */}
              <div className="px-2.5 py-1.5 bg-slate-50 border-b border-slate-200/80 overflow-x-auto flex items-center gap-1 text-xs no-scrollbar">
                <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
                  <HelpCircle className="w-3 h-3 text-emerald-600" />
                  <span>Hỏi nhanh:</span>
                </span>
                {FAQ_CHIPS.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendQuestion(chip.q, chip.a)}
                    className="py-0.5 px-2 rounded-lg bg-white hover:bg-emerald-50 text-[10px] font-semibold text-slate-700 hover:text-emerald-800 border border-slate-200/80 hover:border-emerald-300 whitespace-nowrap shadow-2xs transition-all shrink-0"
                  >
                    {chip.q}
                  </button>
                ))}
              </div>

              {/* Chat Messages Body */}
              <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 items-start ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.sender === 'mascot' && (
                    <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 shadow-xs border border-emerald-200 overflow-hidden">
                      <img src={settings.mascotImageUrl || '/images/mascot/mascot-1.png'} alt="Flori" className="w-5 h-5 object-contain" />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] p-3 rounded-2xl leading-relaxed shadow-xs ${
                      msg.sender === 'user'
                        ? 'bg-emerald-600 text-white rounded-tr-none'
                        : 'bg-slate-100/90 text-slate-800 rounded-tl-none border border-slate-200/60'
                    }`}
                  >
                    <p className="text-xs leading-relaxed">{msg.text}</p>
                    <div
                      className={`mt-1 flex items-center justify-between text-[9px] ${
                        msg.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'
                      }`}
                    >
                      <span>{msg.time}</span>
                      {msg.sender === 'mascot' && (
                        <button
                          onClick={() => handleSpeakMessage(msg.text)}
                          className="hover:text-emerald-700 flex items-center gap-0.5 ml-2 font-semibold"
                          title="Đọc bằng giọng AI nữ"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>Nghe</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendQuestion(inputText);
              }}
              className="p-2.5 bg-white border-t border-slate-100 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Hỏi Flori về hoa, dịch vụ, giao hàng..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="glass-input flex-1 text-xs py-2 px-3 rounded-xl"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 transition-colors shadow-sm"
                title="Gửi câu hỏi"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </>
      )}
    </>
  );
};
