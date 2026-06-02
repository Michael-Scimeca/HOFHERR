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
