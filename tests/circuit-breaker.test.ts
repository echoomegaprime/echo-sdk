import { describe, it, expect, vi, afterEach } from 'vitest';
import { CircuitBreaker } from '../src/circuit-breaker.js';

describe('CircuitBreaker', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts CLOSED and allows execution', () => {
    const cb = new CircuitBreaker();
    expect(cb.getState()).toBe('CLOSED');
    expect(cb.canExecute()).toBe(true);
  });

  it('opens after the failure threshold is reached', () => {
    const cb = new CircuitBreaker({ failureThreshold: 3 });
    cb.recordFailure();
    cb.recordFailure();
    expect(cb.getState()).toBe('CLOSED');
    cb.recordFailure();
    expect(cb.getState()).toBe('OPEN');
    expect(cb.canExecute()).toBe(false);
  });

  it('a success resets the failure count while CLOSED', () => {
    const cb = new CircuitBreaker({ failureThreshold: 3 });
    cb.recordFailure();
    cb.recordFailure();
    cb.recordSuccess();
    cb.recordFailure();
    cb.recordFailure();
    expect(cb.getState()).toBe('CLOSED');
  });

  it('transitions OPEN -> HALF_OPEN after resetTimeoutMs elapses', () => {
    vi.useFakeTimers();
    const cb = new CircuitBreaker({ failureThreshold: 1, resetTimeoutMs: 1000 });
    cb.recordFailure();
    expect(cb.getState()).toBe('OPEN');
    vi.advanceTimersByTime(1001);
    expect(cb.getState()).toBe('HALF_OPEN');
    expect(cb.canExecute()).toBe(true);
  });

  it('closes after enough successes in HALF_OPEN', () => {
    vi.useFakeTimers();
    const cb = new CircuitBreaker({ failureThreshold: 1, resetTimeoutMs: 1000, halfOpenSuccesses: 2 });
    cb.recordFailure();
    vi.advanceTimersByTime(1001);
    expect(cb.getState()).toBe('HALF_OPEN');
    cb.recordSuccess();
    expect(cb.getState()).toBe('HALF_OPEN');
    cb.recordSuccess();
    expect(cb.getState()).toBe('CLOSED');
  });

  it('a failure in HALF_OPEN immediately reopens the circuit', () => {
    vi.useFakeTimers();
    const cb = new CircuitBreaker({ failureThreshold: 1, resetTimeoutMs: 1000 });
    cb.recordFailure();
    vi.advanceTimersByTime(1001);
    expect(cb.getState()).toBe('HALF_OPEN');
    cb.recordFailure();
    expect(cb.getState()).toBe('OPEN');
  });

  it('reset() forces the circuit back to CLOSED', () => {
    const cb = new CircuitBreaker({ failureThreshold: 1 });
    cb.recordFailure();
    expect(cb.getState()).toBe('OPEN');
    cb.reset();
    expect(cb.getState()).toBe('CLOSED');
    expect(cb.getInfo().failures).toBe(0);
  });

  it('getResetTime returns 0 when not OPEN', () => {
    const cb = new CircuitBreaker();
    expect(cb.getResetTime()).toBe(0);
  });
});
