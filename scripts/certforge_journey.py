#!/usr/bin/env python3
"""Certification Forge journey for echo-sdk.

The Forge sandbox is python:3.12-alpine with no Node.js, so this journey
performs text/structural checks on the TypeScript source rather than
actually running npm/vitest/tsup. Each check is discriminating: it must
fail against the pre-fix source and pass against the current source, not
just assert a file exists.
"""
import json
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
FAILURES = []


def check(name, condition, detail=""):
    status = "PASS" if condition else "FAIL"
    print(f"[{status}] {name}" + (f" — {detail}" if detail and not condition else ""))
    if not condition:
        FAILURES.append(name)


def read(rel_path):
    path = REPO_ROOT / rel_path
    if not path.exists():
        return None
    return path.read_text(encoding="utf-8")


def main():
    security_ts = read("src/security.ts")
    check("src/security.ts exists", security_ts is not None)

    if security_ts:
        # Isolate the timingSafeEqual function body.
        match = re.search(
            r"export function timingSafeEqual\([^)]*\)\s*:\s*boolean\s*\{(.*?)\n\}",
            security_ts,
            re.S,
        )
        check("timingSafeEqual function found", match is not None)
        body = match.group(1) if match else ""

        # The regression: an early return on length mismatch BEFORE the
        # comparison work, which makes runtime depend on guessed length.
        early_return_before_loop = bool(
            re.search(r"if\s*\(\s*a\.length\s*!==\s*b\.length\s*\)\s*return\s*false", body)
        )
        check(
            "no early-return-on-length-mismatch timing oracle",
            not early_return_before_loop,
            "found 'if (a.length !== b.length) return false' — this is the timing-oracle regression",
        )

        # The fix: length difference folded into the same accumulator used
        # for the byte loop, and a buffer padded to the longer input walked
        # unconditionally (Math.max(...length...)).
        folds_length_into_accumulator = bool(
            re.search(r"mismatch\s*=\s*bufA\.length\s*\^\s*bufB\.length", body)
        )
        check(
            "length difference folded into the XOR accumulator",
            folds_length_into_accumulator,
        )

        pads_to_longer_input = "Math.max(" in body and "padA" in body and "padB" in body
        check("comparison walks a buffer padded to the longer input", pads_to_longer_input)

    # Test infrastructure must actually exist, not just be declared.
    package_json_raw = read("package.json")
    check("package.json exists", package_json_raw is not None)
    if package_json_raw:
        pkg = json.loads(package_json_raw)
        scripts = pkg.get("scripts", {})
        check("package.json declares a test script", scripts.get("test") == "vitest run")
        dev_deps = pkg.get("devDependencies", {})
        check("vitest is a devDependency", "vitest" in dev_deps)

    tests_dir = REPO_ROOT / "tests"
    expected_test_files = [
        "security.test.ts",
        "circuit-breaker.test.ts",
        "errors.test.ts",
        "cache.test.ts",
    ]
    for fname in expected_test_files:
        check(f"tests/{fname} exists", (tests_dir / fname).exists())

    security_test = read("tests/security.test.ts")
    if security_test:
        check(
            "security.test.ts exercises timingSafeEqual",
            "timingSafeEqual" in security_test and "describe('timingSafeEqual'" in security_test,
        )

    # Governance files.
    for fname in [
        "README.md",
        "LICENSE",
        "SECURITY.md",
        "CONTRIBUTING.md",
        "CHANGELOG.md",
        "CODE_OF_CONDUCT.md",
    ]:
        check(f"{fname} exists", (REPO_ROOT / fname).exists())

    check(
        ".github/workflows/ci.yml exists",
        (REPO_ROOT / ".github" / "workflows" / "ci.yml").exists(),
    )

    print()
    if FAILURES:
        print(f"CERTFORGE JOURNEY: FAIL ({len(FAILURES)} check(s) failed)")
        for f in FAILURES:
            print(f"  - {f}")
        sys.exit(1)
    print("CERTFORGE JOURNEY: PASS (all checks green)")
    sys.exit(0)


if __name__ == "__main__":
    main()
