# Changelog

All notable changes to this project are documented in this file.

## [Unreleased]

### Fixed
- **Security:** `timingSafeEqual()` in `src/security.ts` no longer leaks a target string's
  length via timing. Previously returned early on `a.length !== b.length` before its
  constant-time byte-comparison loop, making length-mismatched comparisons complete faster than
  length-matched-but-wrong ones. Now always walks a buffer padded to the longer input's length.

### Added
- First test suite: `vitest`, 58 tests across `security.ts`, `circuit-breaker.ts`, `errors.ts`,
  and `cache.ts`. `npm test` is now runnable on a clean checkout (previously undeclared).
- `SECURITY.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, issue/PR templates, and a CI workflow.

### Changed
- Bumped `picomatch` (transitive, via `tsup`) resolving a high-severity `npm audit` finding.

## [3.2.0] and earlier

See git history — this file starts tracking from the current consolidation pass forward.
