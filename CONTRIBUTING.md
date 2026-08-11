# Contributing

## Setup

```bash
git clone https://github.com/echoomegaprime/echo-sdk.git
cd echo-sdk
npm install
```

## Development loop

```bash
npm test          # vitest run — must stay green
npm run typecheck  # tsc --noEmit — strict mode, no implicit any
npm run build      # tsup — dual CJS/ESM + per-module .d.ts, must succeed cleanly
```

Run all three before opening a PR. `npm run prepublishOnly` runs `build` + `test` together and
is what CI enforces.

## Adding a module

Each SDK module (`src/<module>.ts`) is its own `tsup` entry point and gets its own subpath
export in `package.json`'s `exports` map (`"./<module>"`) plus a corresponding line in the
`build` script's file list. Keep modules dependency-free — this SDK ships **zero runtime
dependencies** by design; do not add one without discussing it first (open an issue).

## Security-sensitive changes

Anything touching `src/security.ts`, `src/client.ts`'s auth handling, or credential redaction
needs a test that would fail without the fix, plus a note in `SECURITY.md` if it's a
vulnerability class (not just a bug). Constant-time comparison changes cannot be verified by
functional tests alone — see `SECURITY.md`'s note on `timingSafeEqual` for the reasoning and
`scripts/certforge_journey.py` for the source-anchored regression guard.

## Code style

- TypeScript strict mode, no `any` without a comment explaining why.
- No new runtime dependencies without discussion.
- Match the existing module shape: a thin class wrapping `EchoHttpClient.request()` calls,
  typed request/response interfaces, no business logic beyond request shaping.

## Commit messages

Conventional-commit style (`fix:`, `feat:`, `docs:`, `chore:`) is preferred but not enforced by
tooling.
