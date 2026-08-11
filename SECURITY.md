# Security Policy

## Supported Versions

Only the latest published `3.x` release of `@echo-omega-prime/sdk` receives security fixes.

## Reporting a Vulnerability

Do not open a public GitHub issue for a suspected vulnerability. Email **security@echo-ept.com**
with a description, reproduction steps, and affected version. We aim to acknowledge within 48
hours and to ship a fix or mitigation within 7 days for confirmed high-severity issues.

## Known Issues & Disposition

### `timingSafeEqual` timing oracle (fixed, this release)

`src/security.ts`'s `timingSafeEqual()` previously returned early on a length mismatch
(`if (a.length !== b.length) return false;`) *before* its constant-time byte comparison loop.
This made the function's runtime correlate with whether a caller's guess had the right length,
independent of whether the guessed content was correct — an attacker could recover a secret's
length via timing before ever attacking its bytes.

Fixed by folding the length difference into the same XOR accumulator used for the byte
comparison and always walking a buffer padded to the longer input's length, so total work (and
therefore wall-clock time) no longer depends on whether the lengths matched.

This class of regression is **not detectable by functional unit tests** — a length-check-then-
early-return implementation returns the same `true`/`false` results as the constant-time
version for every input. `scripts/certforge_journey.py` enforces this fix via a text-anchored
source check (rejects the presence of `a.length !== b.length` / `return false` immediately
before the comparison loop), not a wall-clock timing assertion, which would be flaky in CI.

### Missing test infrastructure (fixed, this release)

`package.json` declared no `test` script and no test framework dependency at all prior to this
release — `npm test` was not runnable on a clean checkout. Added `vitest` and a 58-test suite
covering `security.ts`, `circuit-breaker.ts`, `errors.ts`, and `cache.ts`.

### `esbuild` low-severity advisory (accepted risk)

A transitive dependency of `tsup` (dev-only build tool). The affected code path is `tsup`'s
local dev server, which this package never invokes — `esbuild` is not present in the published
`dist/` output. `npm audit fix --force` does not resolve this further without a `tsup` major
version bump; tracked for the next `tsup` upgrade rather than forced now.

### Default gateway `/health` endpoint returns 500 (upstream, tracked separately)

The SDK's default gateway (`https://echo-sdk-gateway.bmcii1976.workers.dev`, overridable via
the `gatewayUrl` client option) returns `500` on `GET /health` while every other probed route
correctly enforces auth (`401` for missing/invalid credentials). This indicates the gateway and
its auth layer are healthy — only the `/health` route itself is broken. No source for this
gateway ships in this repository. Tracked as build-queue ticket **#29636**
(`fix-echo-sdk-gateway-health-500`).

## Design Notes

- Zero runtime dependencies — no supply-chain surface beyond the Node.js/Web platform APIs
  (`fetch`, `crypto.subtle`, `TextEncoder`).
- `redact()` / `safeHeaders()` / `maskKey()` exist specifically to keep API keys and bearer
  tokens out of logs; every request path in `client.ts` routes error/debug logging through
  these before emitting anything via the configurable `logger` callback.
- `validatePayloadSize()` enforces a 1 MB request-body ceiling (`CONTRACT §SEC-5`) to bound
  memory use on untrusted or accidental oversized payloads.
