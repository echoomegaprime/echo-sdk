/** Echo Prime SDK v3.0 — Security utilities
 * CONTRACT §SEC-1 through §SEC-5. Zero external dependencies.
 */

const MAX_PAYLOAD_BYTES = 1_048_576; // 1 MB — CONTRACT §SEC-5

/** Patterns that must NEVER appear in log output — CONTRACT §SEC-4 */
const NEVER_LOG_PATTERNS = [
  /X-Echo-API-Key:\s*\S+/gi,
  /apiKey["']?\s*[:=]\s*["']\S+/gi,
  /Bearer\s+\S+/gi,
  /password["']?\s*[:=]\s*["']\S+/gi,
  /secret["']?\s*[:=]\s*["']\S+/gi,
  /token["']?\s*[:=]\s*["']\S+/gi,
];

/** Redact sensitive values from a string before logging */
export function redact(input: string): string {
  let result = input;
  for (const pattern of NEVER_LOG_PATTERNS) {
    result = result.replace(pattern, '[REDACTED]');
  }
  return result;
}

/** Validate that an API key looks syntactically correct */
export function validateApiKey(key: unknown): key is string {
  if (typeof key !== 'string') return false;
  if (key.length < 8) return false;
  if (key.length > 256) return false;
  return true;
}

/** Validate payload size — CONTRACT §SEC-5 */
export function validatePayloadSize(body: unknown): void {
  if (body === undefined || body === null) return;
  const serialized = typeof body === 'string' ? body : JSON.stringify(body);
  const byteLength = new TextEncoder().encode(serialized).byteLength;
  if (byteLength > MAX_PAYLOAD_BYTES) {
    throw new Error(`Payload exceeds ${MAX_PAYLOAD_BYTES} bytes (got ${byteLength})`);
  }
}

/** Sanitize user input — strip control characters, limit length */
export function sanitizeInput(input: string, maxLength = 10_000): string {
  // eslint-disable-next-line no-control-regex
  const cleaned = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  return cleaned.slice(0, maxLength);
}

/** Mask an API key for display (show first 4 and last 4) */
export function maskKey(key: string): string {
  if (key.length <= 12) return '****';
  return `${key.slice(0, 4)}${'*'.repeat(key.length - 8)}${key.slice(-4)}`;
}

/** Constant-time string comparison to prevent timing attacks — CONTRACT §SEC-3
 *
 * Runtime is independent of whether the inputs are the same length: a naive
 * `if (a.length !== b.length) return false` short-circuit (the previous
 * implementation here) makes a length-mismatched comparison return far
 * faster than a length-matched one, letting an attacker recover the target
 * string's length via timing before ever attacking its content. This
 * implementation folds the length difference into the same accumulator used
 * for the byte comparison and always walks the full padded buffer, so a
 * caller cannot distinguish "wrong length" from "right length, wrong bytes"
 * by timing alone.
 */
export function timingSafeEqual(a: string, b: string): boolean {
  const encoder = new TextEncoder();
  const bufA = encoder.encode(a);
  const bufB = encoder.encode(b);
  const len = Math.max(bufA.length, bufB.length, 1);
  const padA = new Uint8Array(len);
  const padB = new Uint8Array(len);
  padA.set(bufA);
  padB.set(bufB);
  let mismatch = bufA.length ^ bufB.length;
  for (let i = 0; i < len; i++) {
    mismatch |= padA[i] ^ padB[i];
  }
  return mismatch === 0;
}

/** Headers safe to log (strip auth headers) */
export function safeHeaders(headers: Record<string, string>): Record<string, string> {
  const safe: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    const lower = key.toLowerCase();
    if (lower === 'x-echo-api-key' || lower === 'authorization') {
      safe[key] = maskKey(value);
    } else {
      safe[key] = value;
    }
  }
  return safe;
}
