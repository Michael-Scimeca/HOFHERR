/**
 * Normalizes any US phone string to its last 10 digits for reliable profile matching
 * across online checkout, walk-in POS orders, and account registration.
 */
export function normalizePhone(raw: unknown): string {
    if (typeof raw !== 'string') return '';
    const digits = raw.replace(/\D/g, '');
    if (digits.length === 11 && digits.startsWith('1')) {
        return digits.slice(1);
    }
    return digits.length >= 10 ? digits.slice(-10) : digits;
}

export function formatPhoneDisplay(digits: string): string {
    const clean = normalizePhone(digits);
    if (clean.length !== 10) return digits;
    return `(${clean.slice(0, 3)}) ${clean.slice(3, 6)}-${clean.slice(6)}`;
}
