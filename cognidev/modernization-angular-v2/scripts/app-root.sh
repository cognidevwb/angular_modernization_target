#!/usr/bin/env sh
# The directory that holds the Angular app, printed RELATIVE to the workspace
# ("." when the workspace is the app).
#
# A repository is not always its app: AWB is a Java estate whose Angular app is
# `Web/`, and every script that assumed workspace == app stopped the run on it
# ("no package.json in <root>; the build cannot run"). `detect-version` already
# finds and records the app; this reads its answer so there is ONE place that
# decides, and falls back to a shallow look for a manifest when the detector has
# not run yet.
#
# Usage: APP=$(sh scripts/app-root.sh "$ROOT")
set -u
ROOT="${1:-${CW_WORKDIR:-.}}"

GEN="$ROOT/.cognidev/angular/generation.json"
if [ -f "$GEN" ]; then
  REL=$(sed -n 's/.*"app_root"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' "$GEN" | head -1)
  if [ -n "${REL:-}" ] && [ -d "$ROOT/$REL" ]; then
    echo "$REL"
    exit 0
  fi
fi

# Without the detector's answer: an `angular.json` beats a bare `package.json`,
# and either at the root beats one a level down — so a Java estate with the app
# in `Web/` resolves there, and a repo that is its own app resolves to ".".
[ -f "$ROOT/angular.json" ] && { echo "."; exit 0; }
for d in "$ROOT"/*/; do
  [ -d "$d" ] || continue
  b=$(basename "$d")
  case "$b" in node_modules|dist|build|target|out|coverage|vendor|.*) continue ;; esac
  [ -f "$d/angular.json" ] && { echo "$b"; exit 0; }
done
[ -f "$ROOT/package.json" ] && { echo "."; exit 0; }
for d in "$ROOT"/*/; do
  [ -d "$d" ] || continue
  b=$(basename "$d")
  case "$b" in node_modules|dist|build|target|out|coverage|vendor|.*) continue ;; esac
  [ -f "$d/package.json" ] && { echo "$b"; exit 0; }
done
echo "."
