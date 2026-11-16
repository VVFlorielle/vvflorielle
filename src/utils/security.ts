// Security Utilities for V&V Florielle - Bảo Mật Cấp 2 Toàn Diện

/**
 * Standard SHA-256 implementation in pure TypeScript (Zero external dependency, fast & sync)
 */
export function sha256(ascii: string): string {
  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount));
  }

  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  let i: number, j: number;
  let result = '';

  const words: number[] = [];
  const asciiBitLength = ascii.length * 8;

  let hash: number[] = [];
  const k: number[] = [];
  let primeCounter = 0;

  const isComposite: Record<number, boolean> = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 300; i += candidate) {
        isComposite[i] = true;
      }
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }

  ascii += '\x80';
  while ((ascii.length % 64) - 56) ascii += '\x00';
  for (i = 0; i < ascii.length; i++) {
    j = ascii.charCodeAt(i);
    if (j >> 8) return ''; // Only ASCII
    words[i >> 2] |= j << (((3 - i) % 4) * 8);
  }
  words[words.length] = (asciiBitLength / maxWord) | 0;
  words[words.length] = asciiBitLength;

  for (j = 0; j < words.length; ) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash;
    hash = hash.slice(0, 8);

    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15],
        w2 = w[i - 2];
      const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
      const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
      w[i] =
        i < 16
          ? w[i]
          : (w[i - 16] + s0 + w[i - 7] + s1) | 0;

      const s1h = rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25);
      const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
      const temp1 = (hash[7] + s1h + ch + k[i] + w[i]) | 0;
      const s0h = rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22);
      const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
      const temp2 = (s0h + maj) | 0;

      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
    }

    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j + 1; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += (b < 16 ? '0' : '') + b.toString(16);
    }
  }
  return result;
}

// -------------------------------------------------------------
// 1. DEVICE FINGERPRINT & TRUSTED DEVICES (2FA)
// -------------------------------------------------------------

export interface TrustedAdminDevice {
  fingerprint: string;
  trustedAt: number;
  expiresAt: number;
  deviceName?: string;
}

export function getDeviceFingerprint(): string {
  if (typeof window === 'undefined') return 'server-env';
  const nav = window.navigator;
  const screen = window.screen;
  const raw = [
    nav.userAgent || '',
    nav.language || '',
    screen.width || 0,
    screen.height || 0,
    screen.colorDepth || 0,
    new Date().getTimezoneOffset()
  ].join('###');
  return sha256(raw).slice(0, 32);
}

export function isDeviceTrusted(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const currentFp = getDeviceFingerprint();
    const raw = localStorage.getItem('vvf_trusted_admin_devices');
    if (!raw) return false;
    const devices: TrustedAdminDevice[] = JSON.parse(raw);
    const now = Date.now();
    return devices.some((d) => d.fingerprint === currentFp && d.expiresAt > now);
  } catch (e) {
    return false;
  }
}

export function trustCurrentDevice(days = 30, deviceName?: string): void {
  if (typeof window === 'undefined') return;
  try {
    const currentFp = getDeviceFingerprint();
    const raw = localStorage.getItem('vvf_trusted_admin_devices');
    const devices: TrustedAdminDevice[] = raw ? JSON.parse(raw) : [];
    const now = Date.now();
    const filtered = devices.filter((d) => d.expiresAt > now && d.fingerprint !== currentFp);
    filtered.push({
      fingerprint: currentFp,
      trustedAt: now,
      expiresAt: now + days * 24 * 60 * 60 * 1000,
      deviceName: deviceName || 'Thiết bị Quản Trị V&V'
    });
    localStorage.setItem('vvf_trusted_admin_devices', JSON.stringify(filtered));
  } catch (e) {}
}

// -------------------------------------------------------------
// 2. BRUTE-FORCE GUARD (Khóa 15 phút khi gõ sai quá 5 lần)
// -------------------------------------------------------------

export interface BruteForceState {
  attempts: number;
  lockoutUntil: number | null;
  isLocked: boolean;
  remainingSeconds: number;
}

const BRUTE_FORCE_KEY_ATTEMPTS = 'vvf_admin_failed_attempts';
const BRUTE_FORCE_KEY_LOCKOUT = 'vvf_admin_lockout_until';
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 phút

export function getBruteForceState(): BruteForceState {
  if (typeof window === 'undefined') {
    return { attempts: 0, lockoutUntil: null, isLocked: false, remainingSeconds: 0 };
  }
  const attempts = Number(localStorage.getItem(BRUTE_FORCE_KEY_ATTEMPTS) || 0);
  const lockoutRaw = localStorage.getItem(BRUTE_FORCE_KEY_LOCKOUT);
  const lockoutUntil = lockoutRaw ? Number(lockoutRaw) : null;
  const now = Date.now();

  if (lockoutUntil && lockoutUntil > now) {
    const remainingSeconds = Math.ceil((lockoutUntil - now) / 1000);
    return { attempts, lockoutUntil, isLocked: true, remainingSeconds };
  }

  // If lockout expired, clear lockout
  if (lockoutUntil && lockoutUntil <= now) {
    localStorage.removeItem(BRUTE_FORCE_KEY_LOCKOUT);
    localStorage.removeItem(BRUTE_FORCE_KEY_ATTEMPTS);
    return { attempts: 0, lockoutUntil: null, isLocked: false, remainingSeconds: 0 };
  }

  return { attempts, lockoutUntil: null, isLocked: false, remainingSeconds: 0 };
}

export function recordFailedLoginAttempt(): { isNowLocked: boolean; attempts: number; remainingAttempts: number } {
  if (typeof window === 'undefined') return { isNowLocked: false, attempts: 1, remainingAttempts: 4 };
  const current = Number(localStorage.getItem(BRUTE_FORCE_KEY_ATTEMPTS) || 0);
  const next = current + 1;
  localStorage.setItem(BRUTE_FORCE_KEY_ATTEMPTS, next.toString());

  if (next >= MAX_FAILED_ATTEMPTS) {
    const lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
    localStorage.setItem(BRUTE_FORCE_KEY_LOCKOUT, lockoutUntil.toString());
    return { isNowLocked: true, attempts: next, remainingAttempts: 0 };
  }

  return { isNowLocked: false, attempts: next, remainingAttempts: MAX_FAILED_ATTEMPTS - next };
}

export function resetBruteForceAttempts(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(BRUTE_FORCE_KEY_ATTEMPTS);
  localStorage.removeItem(BRUTE_FORCE_KEY_LOCKOUT);
}

// -------------------------------------------------------------
// 3. HMAC DATA INTEGRITY CHECKSUM (Chống sửa điểm & voucher F12)
// -------------------------------------------------------------

const SECRET_INTEGRITY_SALT = 'VVF_SECURE_HMAC_SALT_2026_KEY_FLORIELLE';

export function generateDataSignature(data: {
  accountCode?: string;
  phone: string;
  points: number;
  totalSpent: number;
}): string {
  const payload = [
    data.accountCode || 'NO_CODE',
    data.phone || '',
    Math.round(data.points || 0),
    Math.round(data.totalSpent || 0),
    SECRET_INTEGRITY_SALT
  ].join(':::');
  return sha256(payload);
}

export function verifyDataSignature(
  data: { accountCode?: string; phone: string; points: number; totalSpent: number },
  existingHash?: string
): boolean {
  if (!existingHash) return true; // Legacy data backwards compatible
  const expected = generateDataSignature(data);
  return expected === existingHash;
}
