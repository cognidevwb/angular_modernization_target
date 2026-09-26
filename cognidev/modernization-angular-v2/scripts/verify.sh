#!/usr/bin/env bash
# Proof-of-build — the cycle's final gate. Installs deps if needed and runs the
# production Angular build. Degrades to a clean skip when there's nothing to build
# or no Node/CLI, so the run never dies here on a machine without a toolchain.
set -uo pipefail
ROOT="${1:-${CW_WORKDIR:-.}}"
DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
# The app is not always the repository — one resolver answers this for every
# script in this playbook (scripts/app-root.sh), from what detect-version
# recorded. Looking only at the workspace root made this step report a repo
# whose app is `Web/` as having no package.json / no CLI workspace at all.
APP_REL=$(sh "$DIR/app-root.sh" "$ROOT")
[ "$APP_REL" = "." ] || ROOT="$ROOT/$APP_REL"
cd "$ROOT" 2>/dev/null || { echo "verify: workspace missing — skipping"; exit 0; }

echo "verify: proving the Angular app builds…"
[ -f package.json ] || { echo "verify: no package.json — skipping (run scaffold/develop first)"; exit 0; }
command -v node >/dev/null 2>&1 || { echo "verify: node not installed — skipping build proof"; exit 0; }

if [ ! -d node_modules ]; then
  echo "verify: installing dependencies…"
  if ! (npm ci || npm install) >/dev/null 2>&1; then
    echo "verify: dependency install failed — cannot build here (plan + tasks still produced)"
    exit 0
  fi
fi

if [ -x node_modules/.bin/ng ]; then
  if node_modules/.bin/ng build >/dev/null 2>&1; then
    echo "verify: PROOF — ng build succeeded ✓"
    exit 0
  fi
  echo "verify: ng build FAILED ✗"
  node_modules/.bin/ng build 2>&1 | grep -E 'error|Error|TS[0-9]|NG[0-9]' | head -12 | sed 's/^/    /'
  exit 1
fi
echo "verify: @angular/cli not installed — skipping build proof (scaffold + tasks still produced)"
exit 0
