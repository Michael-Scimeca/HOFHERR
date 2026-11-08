import { describe, it, expect } from 'vitest';
import {
  escapeHtml,
  isRateLimited,
  sanitizeInput,
  normalizePhoneNumber,
  hasAdminAccess,
  validateSecurityHeaders,
  RECOMMENDED_SECURITY_HEADERS,
} from '../src/lib/security';

describe('Website Security Unit Tests', () => {
  describe('XSS Input Sanitization & HTML Escaping', () => {
    it('should strip script tags from user inputs', () => {
      const malicious = '<script>alert("xss")</script>Hello World';
      const clean = sanitizeInput(malicious);
      expect(clean).not.toContain('<script>');
      expect(clean).not.toContain('</script>');
      expect(clean).toContain('Hello World');
    });

    it('should sanitize inline event handlers', () => {
      const malicious = '<img src="x" onerror="alert(1)">';
      const clean = sanitizeInput(malicious);
      expect(clean).not.toContain('onerror=');
    });

    it('should strip javascript: pseudo-protocol URLs', () => {
      const malicious = 'javascript:doEvilThings()';
      const clean = sanitizeInput(malicious);
      expect(clean).not.toContain('javascript:');
    });

    it('should escape HTML angle brackets and quotes', () => {
      const raw = '<b>Bold & "Quoted"</b>';
      expect(sanitizeInput('<b>Bold</b>')).toBe('&lt;b&gt;Bold&lt;/b&gt;');
      expect(escapeHtml(raw)).toBe('&lt;b&gt;Bold &amp; &quot;Quoted&quot;&lt;/b&gt;');
    });
  });

  describe('Rate Limiting', () => {
    it('should block requests exceeding the threshold within the window', () => {
      const ns = 'test-endpoint';
      const ip = '192.0.2.1';
      expect(isRateLimited(ns, ip, 2, 60_000)).toBe(false);
      expect(isRateLimited(ns, ip, 2, 60_000)).toBe(false);
      expect(isRateLimited(ns, ip, 2, 60_000)).toBe(true);
    });
  });

  describe('Phone Number Normalization & Validation', () => {
    it('should convert 10-digit US phone numbers to +1 E.164 format', () => {
      expect(normalizePhoneNumber('(555) 123-4567')).toBe('+15551234567');
      expect(normalizePhoneNumber('555-123-4567')).toBe('+15551234567');
      expect(normalizePhoneNumber('555.123.4567')).toBe('+15551234567');
    });

    it('should handle numbers already including country code', () => {
      expect(normalizePhoneNumber('15551234567')).toBe('+15551234567');
      expect(normalizePhoneNumber('+15551234567')).toBe('+15551234567');
    });

    it('should return empty string for null or empty phone inputs', () => {
      expect(normalizePhoneNumber(null)).toBe('');
      expect(normalizePhoneNumber(undefined)).toBe('');
      expect(normalizePhoneNumber('')).toBe('');
    });
  });

  describe('Role-Based Access Authorization', () => {
    it('should grant access to admin, owner, and manager roles', () => {
      expect(hasAdminAccess('admin')).toBe(true);
      expect(hasAdminAccess('OWNER')).toBe(true);
      expect(hasAdminAccess('Shop Manager')).toBe(true);
    });

    it('should deny access to regular customer roles', () => {
      expect(hasAdminAccess('customer')).toBe(false);
      expect(hasAdminAccess('guest')).toBe(false);
      expect(hasAdminAccess(null)).toBe(false);
    });
  });

  describe('Security Headers Compliance', () => {
    it('should validate complete security headers configuration', () => {
      const result = validateSecurityHeaders(RECOMMENDED_SECURITY_HEADERS);
      expect(result.isValid).toBe(true);
      expect(result.missing).toHaveLength(0);
    });

    it('should report missing security headers', () => {
      const incompleteHeaders = {
        'Content-Security-Policy': "default-src 'self'",
      };
      const result = validateSecurityHeaders(incompleteHeaders);
      expect(result.isValid).toBe(false);
      expect(result.missing).toContain('X-Frame-Options');
      expect(result.missing).toContain('X-Content-Type-Options');
    });
  });
});

