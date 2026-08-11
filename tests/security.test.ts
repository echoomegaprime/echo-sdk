import { describe, it, expect } from 'vitest';
import {
  redact,
  validateApiKey,
  validatePayloadSize,
  sanitizeInput,
  maskKey,
  timingSafeEqual,
  safeHeaders,
} from '../src/security.js';

describe('redact', () => {
  it('redacts an X-Echo-API-Key header value', () => {
    expect(redact('X-Echo-API-Key: abc123secret')).toBe('[REDACTED]');
  });
  it('redacts an apiKey field in JSON-like text', () => {
    expect(redact('{"apiKey": "sk-live-12345"}')).toContain('[REDACTED]');
  });
  it('redacts a Bearer token', () => {
    expect(redact('Authorization: Bearer eyJhbGciOi')).toContain('[REDACTED]');
  });
  it('leaves non-sensitive text untouched', () => {
    expect(redact('just a normal log line')).toBe('just a normal log line');
  });
});

describe('validateApiKey', () => {
  it('accepts a key within the 8-256 char range', () => {
    expect(validateApiKey('a'.repeat(32))).toBe(true);
  });
  it('rejects a key shorter than 8 chars', () => {
    expect(validateApiKey('short')).toBe(false);
  });
  it('rejects a key longer than 256 chars', () => {
    expect(validateApiKey('a'.repeat(257))).toBe(false);
  });
  it('rejects a non-string value', () => {
    expect(validateApiKey(12345)).toBe(false);
    expect(validateApiKey(undefined)).toBe(false);
    expect(validateApiKey(null)).toBe(false);
  });
});

describe('validatePayloadSize', () => {
  it('allows a payload under the 1MB limit', () => {
    expect(() => validatePayloadSize({ small: 'payload' })).not.toThrow();
  });
  it('throws for a payload over the 1MB limit', () => {
    const big = { data: 'x'.repeat(1_100_000) };
    expect(() => validatePayloadSize(big)).toThrow(/exceeds/);
  });
  it('is a no-op for undefined/null bodies', () => {
    expect(() => validatePayloadSize(undefined)).not.toThrow();
    expect(() => validatePayloadSize(null)).not.toThrow();
  });
});

describe('sanitizeInput', () => {
  it('strips control characters', () => {
    expect(sanitizeInput('hello\x00\x01world')).toBe('helloworld');
  });
  it('truncates to maxLength', () => {
    expect(sanitizeInput('abcdefgh', 4)).toBe('abcd');
  });
  it('leaves normal text untouched', () => {
    expect(sanitizeInput('normal input')).toBe('normal input');
  });
});

describe('maskKey', () => {
  it('shows first 4 and last 4 characters for a long key', () => {
    const key = 'sk-live-1234567890abcdef';
    expect(maskKey(key)).toBe(key.slice(0, 4) + '*'.repeat(key.length - 8) + key.slice(-4));
  });
  it('fully masks a short key', () => {
    expect(maskKey('shortkey')).toBe('****');
  });
});

describe('safeHeaders', () => {
  it('masks X-Echo-API-Key and Authorization, leaves other headers alone', () => {
    const out = safeHeaders({
      'X-Echo-API-Key': 'sk-live-1234567890abcdef',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9',
      'Content-Type': 'application/json',
    });
    expect(out['X-Echo-API-Key']).not.toBe('sk-live-1234567890abcdef');
    expect(out['X-Echo-API-Key']).toContain('*');
    expect(out.Authorization).toContain('*');
    expect(out['Content-Type']).toBe('application/json');
  });
});

describe('timingSafeEqual', () => {
  it('returns true for identical strings', () => {
    expect(timingSafeEqual('secret-value', 'secret-value')).toBe(true);
  });
  it('returns false for different strings of the same length', () => {
    expect(timingSafeEqual('secret-value', 'secret-vlaue')).toBe(false);
  });
  it('returns false for strings of different length', () => {
    expect(timingSafeEqual('short', 'a-much-longer-string')).toBe(false);
  });
  it('returns false comparing against an empty string', () => {
    expect(timingSafeEqual('nonempty', '')).toBe(false);
    expect(timingSafeEqual('', 'nonempty')).toBe(false);
  });
  it('handles two empty strings as equal', () => {
    expect(timingSafeEqual('', '')).toBe(true);
  });

  // These functional tests confirm behavior (equal -> true, unequal -> false),
  // including the length-mismatch case above -- but cannot themselves prove
  // the comparison is constant-time; a naive length-check-then-early-return
  // implementation would pass every assertion here too. The actual guard
  // against that regression (the previous implementation of this function)
  // is scripts/certforge_journey.py's text-anchored source check, not a
  // wall-clock timing assertion, which would be flaky in CI.
});
