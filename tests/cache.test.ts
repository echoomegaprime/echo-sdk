import { describe, it, expect, vi, afterEach } from 'vitest';
import { EchoCache, cacheKey } from '../src/cache.js';

describe('cacheKey', () => {
  it('returns the bare path when there are no params', () => {
    expect(cacheKey('/engine/domains')).toBe('/engine/domains');
  });
  it('sorts params so key order does not affect the cache key', () => {
    const a = cacheKey('/search', { b: '2', a: '1' });
    const b = cacheKey('/search', { a: '1', b: '2' });
    expect(a).toBe(b);
    expect(a).toBe('/search?a=1&b=2');
  });
});

describe('EchoCache', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns undefined for a missing key', () => {
    const cache = new EchoCache();
    expect(cache.get('missing')).toBeUndefined();
  });

  it('stores and retrieves a value', () => {
    const cache = new EchoCache();
    cache.set('k', { hello: 'world' });
    expect(cache.get('k')).toEqual({ hello: 'world' });
  });

  it('expires a value after its TTL', () => {
    vi.useFakeTimers();
    const cache = new EchoCache();
    cache.set('k', 'v', 1000);
    expect(cache.get('k')).toBe('v');
    vi.advanceTimersByTime(1001);
    expect(cache.get('k')).toBeUndefined();
  });

  it('evicts the least-recently-accessed entry once maxEntries is exceeded', () => {
    vi.useFakeTimers();
    const cache = new EchoCache({ maxEntries: 2 });
    cache.set('a', 1);
    vi.advanceTimersByTime(10);
    cache.set('b', 2);
    vi.advanceTimersByTime(10);
    cache.get('a'); // touch 'a' so 'b' becomes the least-recently-accessed
    vi.advanceTimersByTime(10);
    cache.set('c', 3); // should evict 'b', not 'a'
    expect(cache.get('a')).toBe(1);
    expect(cache.get('b')).toBeUndefined();
    expect(cache.get('c')).toBe(3);
  });

  it('getOrSet computes and caches on miss, returns cached value on hit', async () => {
    const cache = new EchoCache();
    let calls = 0;
    const fetcher = async () => {
      calls++;
      return 'computed';
    };
    const first = await cache.getOrSet('k', fetcher);
    const second = await cache.getOrSet('k', fetcher);
    expect(first).toBe('computed');
    expect(second).toBe('computed');
    expect(calls).toBe(1);
  });

  it('deleteByPrefix removes only matching keys', () => {
    const cache = new EchoCache();
    cache.set('/engine/a', 1);
    cache.set('/engine/b', 2);
    cache.set('/knowledge/a', 3);
    const removed = cache.deleteByPrefix('/engine/');
    expect(removed).toBe(2);
    expect(cache.get('/engine/a')).toBeUndefined();
    expect(cache.get('/knowledge/a')).toBe(3);
  });

  it('prune removes only expired entries', () => {
    vi.useFakeTimers();
    const cache = new EchoCache();
    cache.set('short', 1, 100);
    cache.set('long', 2, 10000);
    vi.advanceTimersByTime(101);
    const pruned = cache.prune();
    expect(pruned).toBe(1);
    expect(cache.get('long')).toBe(2);
  });

  it('clear empties the cache', () => {
    const cache = new EchoCache();
    cache.set('k', 1);
    cache.clear();
    expect(cache.size).toBe(0);
  });
});
