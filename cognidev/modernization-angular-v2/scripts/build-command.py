#!/usr/bin/env python3
"""
build-command — the command that builds THIS project, read off the project.

Usage: build-command.py [dev|prod]   (workspace from $CW_WORKDIR, else the cwd)

Prints one shell command on stdout and exits 0. Exits 2 with the reason on
stderr when the project declares no way to build, so the gate that asked can
stop as ENVIRONMENT NOT READY instead of guessing.

Order:
  1. An Angular CLI workspace whose build entry exists on disk → `ng build`.
     A workspace file left behind by `ng new` whose entry is gone is not a
     build; it is skipped with its reason kept for the message.
  2. A package.json build script: build-dev / build:dev / build for dev,
     build-prod / build:prod / build for prod.
  3. A tsconfig (tsconfig.app.json, then tsconfig.json) → `tsc --noEmit`.
"""
import json
import os
import sys


def load(path):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except (OSError, ValueError):
        return None


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 and sys.argv[1] in ("dev", "prod") else "dev"
    ws = os.environ.get("CW_WORKDIR") or os.getcwd()
    reasons = []

    ng = load(os.path.join(ws, "angular.json"))
    if isinstance(ng, dict):
        for name, proj in (ng.get("projects") or {}).items():
            arch = proj.get("architect") or proj.get("targets") or {}
            opts = (arch.get("build") or {}).get("options") or {}
            entry = opts.get("browser") or opts.get("main")
            if not entry:
                continue
            if os.path.isfile(os.path.join(ws, entry)):
                cfg = " --configuration development" if mode == "dev" else ""
                print(f"node_modules/.bin/ng build{cfg}")
                return 0
            reasons.append(f"angular.json project `{name}` builds `{entry}`, which does not exist")

    pkg = load(os.path.join(ws, "package.json"))
    scripts = (pkg.get("scripts") if isinstance(pkg, dict) else None) or {}
    order = ["build-dev", "build:dev", "build"] if mode == "dev" else ["build-prod", "build:prod", "build"]
    for name in order:
        if name in scripts:
            print(f"npm run {name}")
            return 0
    if scripts:
        reasons.append("package.json has no build script")
    else:
        reasons.append("package.json has no scripts")

    for tc in ("tsconfig.app.json", "tsconfig.json"):
        if os.path.isfile(os.path.join(ws, tc)):
            print(f"node_modules/.bin/tsc --noEmit -p {tc}")
            return 0
    reasons.append("no tsconfig")

    print("no build command for this project: " + "; ".join(reasons), file=sys.stderr)
    return 2


if __name__ == "__main__":
    sys.exit(main())
