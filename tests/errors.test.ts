import { describe, it, expect } from 'vitest';
import {
  EchoError,
  AuthError,
  RateLimitError,
  TimeoutError,
  NetworkError,
  ValidationError,
  NotFoundError,
  CircuitOpenError,
  ServerError,
  isRetryableStatus,
  isRetryableError,
  normalizeError,
} from '../src/errors.js';

describe('EchoError hierarchy', () => {
  it('AuthError is not retryable and carries status 401 by default', () => {
    const err = new AuthError('bad key');
    expect(err).toBeInstanceOf(EchoError);
    expect(err.status).toBe(401);
    expect(err.retryable).toBe(false);
  });

  it('RateLimitError is retryable and carries retryAfterMs', () => {
    const err = new RateLimitError('slow down', 5000);
    expect(err.status).toBe(429);
    expect(err.retryable).toBe(true);
    expect(err.retryAfterMs).toBe(5000);
  });

  it('TimeoutError is retryable', () => {
    expect(new TimeoutError().retryable).toBe(true);
  });

  it('NetworkError is retryable and preserves the cause message', () => {
    const cause = new Error('ECONNRESET');
    const err = new NetworkError('failed', cause);
    expect(err.retryable).toBe(true);
    expect(err.context.cause).toBe('ECONNRESET');
  });

  it('ValidationError is not retryable and carries the field name', () => {
    const err = new ValidationError('bad input', 'apiKey');
    expect(err.retryable).toBe(false);
    expect(err.field).toBe('apiKey');
  });

  it('NotFoundError formats a message with resource and id', () => {
    const err = new NotFoundError('scan', '42');
    expect(err.message).toBe("scan '42' not found");
    expect(err.status).toBe(404);
  });

  it('CircuitOpenError carries resetAtMs and is not retryable', () => {
    const resetAt = Date.now() + 60000;
    const err = new CircuitOpenError(resetAt);
    expect(err.status).toBe(503);
    expect(err.retryable).toBe(false);
    expect(err.resetAtMs).toBe(resetAt);
  });

  it('ServerError is retryable only for 5xx status codes', () => {
    expect(new ServerError('oops', 500).retryable).toBe(true);
    expect(new ServerError('bad request-ish', 499).retryable).toBe(false);
  });

  it('toJSON produces a serializable structured object', () => {
    const err = new AuthError('bad key');
    const json = err.toJSON();
    expect(json.name).toBe('AuthError');
    expect(json.code).toBe('AUTH_ERROR');
    expect(typeof json.timestamp).toBe('string');
  });
});

describe('isRetryableStatus', () => {
  it('marks 429/500/502/503/504 as retryable', () => {
    for (const status of [429, 500, 502, 503, 504]) {
      expect(isRetryableStatus(status)).toBe(true);
    }
  });
  it('marks other statuses as not retryable', () => {
    for (const status of [200, 400, 401, 403, 404, 422]) {
      expect(isRetryableStatus(status)).toBe(false);
    }
  });
});

describe('isRetryableError', () => {
  it('defers to the error.retryable flag for EchoError instances', () => {
    expect(isRetryableError(new RateLimitError('x'))).toBe(true);
    expect(isRetryableError(new AuthError('x'))).toBe(false);
  });
  it('treats AbortError as retryable', () => {
    const err = new Error('aborted');
    err.name = 'AbortError';
    expect(isRetryableError(err)).toBe(true);
  });
  it('treats an unknown non-Error value as not retryable', () => {
    expect(isRetryableError('just a string')).toBe(false);
  });
});

describe('normalizeError', () => {
  it('passes through an existing EchoError unchanged', () => {
    const err = new AuthError('bad key');
    expect(normalizeError(err)).toBe(err);
  });
  it('converts an AbortError into a TimeoutError', () => {
    const err = new Error('aborted');
    err.name = 'AbortError';
    expect(normalizeError(err)).toBeInstanceOf(TimeoutError);
  });
  it('converts a plain Error into a NetworkError', () => {
    const err = normalizeError(new Error('ECONNRESET'));
    expect(err).toBeInstanceOf(NetworkError);
    expect(err.message).toBe('ECONNRESET');
  });
  it('converts a non-Error value into a generic EchoError', () => {
    const err = normalizeError('weird failure');
    expect(err.code).toBe('UNKNOWN');
    expect(err.message).toBe('weird failure');
  });
});
