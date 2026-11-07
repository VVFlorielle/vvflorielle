/**
 * Web Audio API - Bộ phát chuông âm thanh thông báo đơn mới V&V Florielle
 * Tổng hợp giai điệu chuông đôi (Harmonic Floral Chime) trực tiếp từ trình duyệt
 * Không cần file .mp3 bên ngoài, không phụ thuộc kết nối mạng, độ trễ 0ms.
 */

const CHIME_STORAGE_KEY = 'vvf_order_chime_enabled';

/**
 * Kiểm tra trạng thái bật/tắt chuông báo đơn mới
 * Mặc định: true (Bật)
 */
export function isOrderChimeEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(CHIME_STORAGE_KEY) !== 'false';
}

/**
 * Cập nhật tùy chọn bật/tắt chuông báo vào localStorage
 */
export function setOrderChimeEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CHIME_STORAGE_KEY, enabled ? 'true' : 'false');
}

/**
 * Phát giai điệu chuông đôi cao cấp báo hiệu đơn mới
 * Tone 1: 587.33 Hz (D5) -> Tone 2: 880.00 Hz (A5)
 */
export function playNewOrderChime(force: boolean = false): void {
  if (typeof window === 'undefined') return;
  if (!force && !isOrderChimeEnabled()) return;

  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();

    // Hỗ trợ tự động resume AudioContext nếu trình duyệt tạm khóa
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    // --- TONE 1: D5 (587.33 Hz) - Chuông khởi đầu trong trẻo ---
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);

    // Envelope âm lượng: Tấn công nhanh (0.01s), ngân dịu và giảm dần
    gain1.gain.setValueAtTime(0.001, now);
    gain1.gain.linearRampToValueAtTime(0.22, now + 0.02);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.38);

    // --- TONE 2: A5 (880.00 Hz) - Chuông ngân vang chủ đạo (sau 0.12s) ---
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880.0, now + 0.12);

    gain2.gain.setValueAtTime(0.001, now + 0.12);
    gain2.gain.linearRampToValueAtTime(0.28, now + 0.14);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc2.start(now + 0.12);
    osc2.stop(now + 0.65);

    // Tự động giải phóng AudioContext sau khi âm thanh kết thúc
    setTimeout(() => {
      try {
        ctx.close().catch(() => {});
      } catch {}
    }, 750);
  } catch (error) {
    console.warn('[AudioNotification] Không thể phát âm thanh chuông:', error);
  }
}

/**
 * Thử chuông báo (Test âm thanh trực tiếp)
 */
export function testOrderChimeSound(): void {
  playNewOrderChime(true);
}
