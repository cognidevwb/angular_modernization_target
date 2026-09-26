#!/usr/bin/env sh
# typecheck.sh — per-BATCH build gate for the Angular modernization develop loop.
#
# A batch is GREEN only if the project's own build (build-command.py: the CLI
# workspace when its entry exists, else the package.json build script, else
# tsc) accepts the tree — judged on EXIT CODE. The BUILD MODE was decided ONCE by the
# setup-environment gate and written to .cognidev/env.json: `docker` (build
# inside node:<ver>, host Node irrelevant) or `host` (a validated host Node).
# We never silently build with a too-old host Node and then blame the agent.
#
# NOTE: the vendored ng-develop already SKIPS calling this for non-source-only
# batches (a .sql/.yml write is never compiled). This script just runs the build.
set -u

ROOT="${CW_WORKDIR:-$PWD}"
DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
# The app is not always the repository — one resolver answers this for every
# script in this playbook (scripts/app-root.sh), from what detect-version
# recorded. Looking only at the workspace root made this step report a repo
# whose app is `Web/` as having no package.json / no CLI workspace at all.
# ROOT stays the WORKSPACE; PROJECT is the app inside it. They are not the same
# directory and the difference matters twice below: the environment gate is
# written at the workspace root, and the container mounts the workspace.
APP_REL=$(sh "$DIR/app-root.sh" "$ROOT")
ROOT=$(CDPATH= cd -- "$ROOT" 2>/dev/null && pwd) || exit 0
PROJECT="$ROOT"; [ "$APP_REL" = "." ] || PROJECT="$ROOT/$APP_REL"
cd "$PROJECT" || exit 0
LOG="${CW_STEP_LOG:-/dev/stdout}"
say() { echo "$@" >> "$LOG"; }

# Baseline pass: a fresh target skeleton has nothing pre-existing to record.
[ "${CW_VERIFY_BASELINE:-0}" = "1" ] && { say "typecheck: baseline — modern target, nothing to record"; exit 0; }

[ -f package.json ] || { say "typecheck: ENVIRONMENT NOT READY — no package.json in the workspace, so no build can gate this batch"; exit 2; }

# ── Build mode from the environment gate ──
# setup-environment writes this at the WORKSPACE root. Reading it from the app
# folder — which is where this script has just cd'd — found nothing on any repo
# whose app is a subdirectory, so MODE fell back to host and the docker branch
# below never ran, however the gate had decided.
MODE=""; IMG=""; REQ=""
if [ -f "$ROOT/.cognidev/env.json" ]; then
  MODE=$(sed -n 's/.*"mode":"\([^"]*\)".*/\1/p' "$ROOT/.cognidev/env.json")
  IMG=$(sed -n 's/.*"image":"\([^"]*\)".*/\1/p' "$ROOT/.cognidev/env.json")
  REQ=$(sed -n 's/.*"node":\([0-9]*\).*/\1/p' "$ROOT/.cognidev/env.json")
fi
# Where the app sits inside the mounted workspace.
WDIR=/work; [ "$APP_REL" = "." ] || WDIR="/work/$APP_REL"

# Run a shell command in the chosen environment (host, or the pinned container).
run_in_env() {  # <shell-command-string>
  if [ "$MODE" = "docker" ] && command -v docker >/dev/null 2>&1; then
    [ -n "$IMG" ] || IMG="node:22-bookworm-slim"
    docker run --rm -v "$ROOT":/work -v cw-npm:/root/.npm -w "$WDIR" "$IMG" sh -c "$1" 2>&1
  else
    sh -c "$1" 2>&1
  fi
}

run_build() {  # runs in $PROJECT; prints output, returns build exit code
  # The command is the project's own (angular.json entry that exists, else a
  # package.json build script, else tsc); a project that declares none is NOT
  # READY, never guessed at.
  BUILD_CMD=$(CW_WORKDIR="$PROJECT" python3 "$DIR/build-command.py" dev 2>"$PROJECT/.cognidev/build-command.err") \
    || { echo "__NOTREADY__ $(cat "$PROJECT/.cognidev/build-command.err")"; return 2; }
  echo "typecheck: build command → $BUILD_CMD"
  # A `node_modules/.bin/<tool>` command needs that tool installed; a missing
  # one is an environment block, not a build failure.
  CHECK='set -- '"$BUILD_CMD"'; case "$1" in node_modules/*) [ -x "$1" ] || { echo "__NOTREADY__ $1 is not installed"; exit 2; };; esac'
  if [ "$MODE" = "docker" ]; then
    [ -n "$IMG" ] || IMG="node:22-bookworm-slim"
    # -v cw-npm caches ~/.npm across batches so installs aren't cold every time.
    docker run --rm -v "$ROOT":/work -v cw-npm:/root/.npm -w "$WDIR" "$IMG" \
      sh -c 'if [ -d node_modules ] && ls node_modules/@esbuild 2>/dev/null | grep -q linux; then :; else rm -rf node_modules; (npm ci || npm install) 2>&1 | tail -20; fi; '"$CHECK"'; '"$BUILD_CMD" 2>&1
    return $?
  fi
  # host mode — require the validated Node major; never fall back to a too-old one.
  command -v node >/dev/null 2>&1 || { echo "__NOTREADY__ no node on host"; return 2; }
  cur=$(node -v 2>/dev/null | sed -n 's/^v\([0-9][0-9]*\).*/\1/p' | head -1)
  case "$cur" in ''|*[!0-9]*) cur=0 ;; esac
  if [ -n "$REQ" ] && [ "$cur" -lt "$REQ" ] 2>/dev/null; then
    echo "__NOTREADY__ host node $cur < required $REQ (env gate chose host; toolchain regressed)"; return 2
  fi
  [ -d node_modules ] || { echo "__NOTREADY__ node_modules absent — deps not installed"; return 2; }
  sh -c "$CHECK; $BUILD_CMD" 2>&1; return $?
}

# ── 1) COMPILE (hard gate) ──
out=$(run_build); rc=$?
# A gate that cannot run is not a pass. Without a compiler every task would be
# recorded green unbuilt, which is how a migration ships code nobody compiled.
# The stop signature hands the block to the user instead.
case "$out" in
  __NOTREADY__*) say "typecheck: ENVIRONMENT NOT READY — ${out#__NOTREADY__ }; this batch cannot be gated, so it is not accepted"; exit 2 ;;
esac
if [ "$rc" -ne 0 ]; then
  say "typecheck: ✗ build failed (mode=${MODE:-host}):"
  # Same failure-reading rules as validate.sh: `\x1b` is a GNU sed extension, so
  # the ESC comes from printf; the CLI's "See …/angular-errors.log for further
  # details" names a file it deletes when it exits, so that line is a dead end
  # rather than the error and it was all this printed on a compiler crash; and
  # the whole output is kept, because a batch that fails here is repaired from
  # what the build said and nothing else records it.
  ESC=$(printf '\033')
  mkdir -p "$ROOT/.cognidev/run"
  BUILD_LOG="$ROOT/.cognidev/run/typecheck-build.log"
  printf '%s\n' "$out" | sed "s/${ESC}\[[0-9;]*m//g" > "$BUILD_LOG"
  errs=$(grep -Ei 'error|could not resolve|cannot find|TS[0-9]|NG[0-9]' "$BUILD_LOG" \
    | grep -v 'for further details' | head -12)
  [ -n "$errs" ] || errs=$(grep -v '^[[:space:]]*$' "$BUILD_LOG" | tail -20)
  printf '%s\n' "$errs" | sed 's/^/    /' >> "$LOG"
  say "    full build output: .cognidev/run/typecheck-build.log ($(grep -c '' "$BUILD_LOG") lines)"
  exit 1
fi
say "typecheck: ✓ build passed (mode=${MODE:-host})."

# ── 2) LINT the files THIS batch changed (per-task static analysis, scoped) ──
# Validation isn't just compilation: ESLint (angular-eslint recommended) on the
# batch's own files. Lint ERRORS fail the batch (fed back to the fix loop);
# warnings are reported, not fatal. Degrades to a clean skip without config/eslint.
if [ -n "${CW_BATCH_FILES:-}" ] && { [ -f eslint.config.js ] || [ -f eslint.config.mjs ] || [ -f .eslintrc.json ]; }; then
  FILES=$(printf '%s' "$CW_BATCH_FILES" | tr '\n' ' ')
  lout=$(run_in_env "[ -x node_modules/.bin/eslint ] || { echo __noeslint__; exit 0; }; node_modules/.bin/eslint $FILES --max-warnings=-1")
  case "$lout" in
    *__noeslint__*) say "typecheck: lint skipped — eslint not installed" ;;
    *)
      if printf '%s\n' "$lout" | grep -qiE '[0-9]+ error|✖.*error'; then
        say "typecheck: ✗ lint errors (coding-standard) in this batch:"
        printf '%s\n' "$lout" | grep -iE 'error' | head -10 | sed 's/^/    /' >> "$LOG"
        exit 1
      fi
      say "typecheck: ✓ lint clean (angular-eslint) for this batch."
      ;;
  esac
fi
exit 0
