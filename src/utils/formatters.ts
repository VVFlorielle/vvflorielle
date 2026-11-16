/**
 * Normalizes phone numbers to standard 10-digit Vietnamese format (e.g. 0912345678).
 * Strips whitespace, hyphens, dots, and transforms country code +84 / 84 to 0.
 */
export function normalizePhone(phone: string): string {
  if (!phone) return '';
  let cleaned = phone.trim().replace(/[\s\-\.\(\)]/g, '');
  if (cleaned.startsWith('+84')) {
    cleaned = '0' + cleaned.slice(3);
  } else if (cleaned.startsWith('84') && cleaned.length > 9) {
    cleaned = '0' + cleaned.slice(2);
  }
  return cleaned;
}

/**
 * Validates whether a phone number is a standard 10-digit Vietnamese phone number.
 */
export function isValidVietnamesePhone(phone: string): boolean {
  const normalized = normalizePhone(phone);
  return /^0[35789]\d{8}$/.test(normalized);
}

/**
 * Masks phone number for privacy under Nghị định 13/2023/NĐ-CP (e.g. 0912345678 -> 0912***678).
 */
export function maskPhone(phone: string): string {
  if (!phone) return '';
  const clean = normalizePhone(phone);
  if (clean.length < 7) return clean;
  return `${clean.slice(0, 4)}***${clean.slice(-3)}`;
}

/**
 * Masks email address for privacy (e.g. thuhang@gmail.com -> t***g@gmail.com).
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return email || '';
  const [local, domain] = email.split('@');
  if (local.length <= 2) {
    return `${local.charAt(0)}***@${domain}`;
  }
  return `${local.charAt(0)}***${local.slice(-1)}@${domain}`;
}

/**
 * Formats currency in VND (e.g. 350.000₫).
 */
export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}
