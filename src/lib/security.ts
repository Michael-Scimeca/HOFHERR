/**
 * Shared security utilities for the Hofherr website.
 * Provides HTML escaping, rate limiting, and input sanitization
 * helpers used across all API routes.
 */

// ── HTML Escape ──────────────────────────────────────────────────────────────
// Prevents XSS when interpolating user input into HTML email templates
export function escapeHtml(s: string): string {
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ── Generic Rate Limiter ─────────────────────────────────────────────────────
// In-memory rate limiting (per-serverless-instance). Sufficient for basic
// abuse prevention; for production at scale, swap with Redis/Upstash.

interface RateRecord {
    count: number;
    timestamp: number;
}

const rateLimitMaps = new Map<string, Map<string, RateRecord>>();

/**
 * Check if a request is rate-limited.
 * @param namespace  - A unique key per endpoint (e.g. 'chat', 'newsletter')
 * @param identifier - Typically the client IP
 * @param maxRequests - Max requests allowed in the window
 * @param windowMs   - Window duration in milliseconds (default 60 000 = 1 min)
 * @returns true if the request is BLOCKED (over limit)
 */
export function isRateLimited(
    namespace: string,
    identifier: string,
    maxRequests: number,
    windowMs = 60_000,
): boolean {
    if (!rateLimitMaps.has(namespace)) {
        rateLimitMaps.set(namespace, new Map());
    }
    const map = rateLimitMaps.get(namespace)!;
    const now = Date.now();
    const record = map.get(identifier) || { count: 0, timestamp: now };

    if (now - record.timestamp < windowMs) {
        if (record.count >= maxRequests) return true;
        record.count += 1;
    } else {
        record.count = 1;
        record.timestamp = now;
    }
    map.set(identifier, record);
    return false;
}

/**
 * Extract the best-effort client IP from a request.
 */
export function getClientIp(req: Request): string {
    return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

/**
 * Sanitizes user input string against XSS injections
 */
export function sanitizeInput(input: string | null | undefined): string {
    if (!input) return '';
    return String(input)
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/on\w+="[^"]*"/gi, '')
        .replace(/on\w+='[^']*'/gi, '')
        .replace(/javascript:[^\s"']*/gi, '')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

/**
 * Normalizes phone numbers to standard 10-digit format (E.164 compatible string)
 */
export function normalizePhoneNumber(phone: string | null | undefined): string {
    if (!phone) return '';
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10) {
        return `+1${digits}`;
    }
    if (digits.length === 11 && digits.startsWith('1')) {
        return `+${digits}`;
    }
    return digits ? `+${digits}` : '';
}

/**
 * Validates whether a user role has administrative access permissions
 */
export function hasAdminAccess(role: string | null | undefined): boolean {
    if (!role) return false;
    const normalizedRole = role.toLowerCase();
    return (
        normalizedRole === 'admin' ||
        normalizedRole === 'owner' ||
        normalizedRole.includes('manager')
    );
}

/**
 * Validates Security Headers configuration for web responses
 */
export const RECOMMENDED_SECURITY_HEADERS = {
    'Content-Security-Policy': "default-src 'self'",
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
};

export function validateSecurityHeaders(headers: Record<string, string>): {
    isValid: boolean;
    missing: string[];
} {
    const missing: string[] = [];
    for (const header of Object.keys(RECOMMENDED_SECURITY_HEADERS)) {
        if (!headers[header] && !headers[header.toLowerCase()]) {
            missing.push(header);
        }
    }
    return {
        isValid: missing.length === 0,
        missing,
    };
}

