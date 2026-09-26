#!/usr/bin/env sh
# validate.sh — FINAL validation pipeline (step-by-step). Validation is NOT just
# "does it compile" — it is a short sequence of STANDARD tools with PUBLISHED
# rulesets, run in order, each with a clear PASS / FAIL / SKIP:
#
#   ① BUILD     the project's own production build     — it must compile.
#   ② LINT      ESLint + angular-eslint (recommended)   — coding-standard check.
#   ③ SECURITY  npm audit (high+critical)               — dependency CVEs.
#
# Honest framing: these check hygiene, they do NOT certify correctness. Criticals
# (build break, lint ERRORS, high/critical CVEs) fail the pipeline; style WARNINGS
# are reported, not fatal. A build that could not run is not a pass: without the
# Angular CLI the pipeline stops as ENVIRONMENT NOT READY (exit 2), because a
# green result with no build behind it would be read as one. Lint and audit
# still say SKIP when their tool is absent; the summary line names each.
#
# Build mode (docker/host) comes from .cognidev/env.json (the setup-environment gate).
set -u

ROOT="${1:-${CW_WORKDIR:-.}}"
DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
[ -d "$ROOT" ] || { echo "validate: ENVIRONMENT NOT READY — workspace $ROOT missing; nothing was validated"; exit 2; }
ROOT=$(CDPATH= cd -- "$ROOT" && pwd)
# The app is not always the repository. `Web/` in a Java estate is where the
# build lives, and looking only at the workspace root stopped this pipeline with
# "no package.json" on a repo that builds perfectly one folder down. One
# resolver answers this for every script (scripts/app-root.sh).
APP_REL=$(sh "$DIR/app-root.sh" "$ROOT")
APP="$ROOT"; [ "$APP_REL" = "." ] || APP="$ROOT/$APP_REL"
cd "$APP" 2>/dev/null || { echo "validate: ENVIRONMENT NOT READY — app directory $APP missing; nothing was validated"; exit 2; }
[ -f package.json ] || { echo "validate: ENVIRONMENT NOT READY — no package.json in $APP (the app folder for $ROOT); the build cannot run, so this result is not accepted"; exit 2; }
[ "$APP_REL" = "." ] || echo "validate: building in $APP_REL (the app folder of this workspace)"

# The environment gate records its answer at the WORKSPACE root, not the app's.
MODE=""; IMG=""
if [ -f "$ROOT/.cognidev/env.json" ]; then
  MODE=$(sed -n 's/.*"mode":"\([^"]*\)".*/\1/p' "$ROOT/.cognidev/env.json")
  IMG=$(sed -n 's/.*"image":"\([^"]*\)".*/\1/p' "$ROOT/.cognidev/env.json")
fi
[ -n "$IMG" ] || IMG="node:22-bookworm-slim"

# Run a command in the chosen environment (host, or inside the pinned container).
sh_in() {  # <shell-command-string>
  if [ "$MODE" = "docker" ] && command -v docker >/dev/null 2>&1; then
    WDIR=/work; [ "$APP_REL" = "." ] || WDIR="/work/$APP_REL"
    docker run --rm -v "$ROOT":/work -v cw-npm:/root/.npm -w "$WDIR" "$IMG" sh -c "$1" 2>&1
  else
    sh -c "$1" 2>&1
  fi
}

# Dependencies, in the SAME environment the build will run in. Installing on the
# host while the build runs in the container installs nothing the build can see:
# in docker mode this branch was skipped entirely and the container never ran an
# install either, so every build ran against an empty node_modules and failed
# naming a missing binary rather than a missing install.
# Existing node_modules is not the same as node_modules this environment can
# load. Installed on macOS and then loaded by a Linux container, esbuild's
# native package is the wrong platform and the CLI dies before it compiles a
# single file — which reads as "the app does not build". typecheck.sh already
# reinstalls inside the container when node_modules/@esbuild holds no linux
# build; validate did not, so every containerised validate here failed on
# esbuild and never reached the app's real errors.
NEED_INSTALL=0
[ -d node_modules ] || NEED_INSTALL=1
if [ "$MODE" = "docker" ] && [ -d node_modules ] \
   && ! ls node_modules/@esbuild 2>/dev/null | grep -q linux; then
  echo "validate: node_modules holds no linux esbuild — replacing it in the container the build runs in"
  # Installing over it is not enough. npm resolves against what is already
  # there, so a tree left by another platform — or by an upgrade that moved
  # node_modules and not the manifest — makes the install fail on peers it
  # would never have chosen from package.json alone. This tree is already known
  # wrong for the environment that will run the build, so it goes first.
  rm -rf node_modules
  NEED_INSTALL=1
fi

INSTALL_ERR=""
if [ "$NEED_INSTALL" -eq 1 ]; then
  echo "validate: installing dependencies (${MODE:-host}) — this can take a few minutes…"
  INSTALL_OUT=$(sh_in 'npm ci --no-audit --no-fund || npm install --no-audit --no-fund'); INSTALL_RC=$?
  # Whether the install worked is not answerable from the directory alone. A
  # node_modules left over from another platform is still a directory, so this
  # check passed while the install that was meant to replace it had failed, and
  # the build then ran against the very tree the install could not fix. The
  # install's own exit status is the signal; the directory test only still
  # catches an install that reported success and produced nothing.
  if [ "$INSTALL_RC" -ne 0 ] || [ ! -d node_modules ]; then
    # An install that could not run is not a broken migration. AWB's app pulls
    # `@accelq-inc/ui-components` from npm.pkg.github.com and the install ends
    # 401 without a token — reporting that as "FAIL — build errors" would put
    # the blame on the port for something no code change can fix.
    # Four lines of an npm failure name the code and almost never the conflict.
    # The whole thing is kept next to the build log so the reason is readable
    # after the run instead of only while it scrolled past.
    mkdir -p "$ROOT/.cognidev/run"
    NPM_LOG="$ROOT/.cognidev/run/npm-install.log"
    printf '%s\n' "$INSTALL_OUT" > "$NPM_LOG"
    INSTALL_ERR=$(grep -Ei 'npm error|401|403|E[A-Z]{3,}|not found|EAI_AGAIN' "$NPM_LOG" | head -4)
    [ -n "$INSTALL_ERR" ] || INSTALL_ERR=$(grep -v '^[[:space:]]*$' "$NPM_LOG" | tail -4)
    INSTALL_ERR=$(printf '%s\n%s\n' "$INSTALL_ERR" "full install output: .cognidev/run/npm-install.log ($(grep -c '' "$NPM_LOG") lines)")
  fi
fi

build=skip; lint=skip; sec=skip; fail=0; notready=0

echo "──────────────────────────────────────────────────────────"
echo " ① BUILD — the project's production build"
echo "──────────────────────────────────────────────────────────"
# Dependencies the build needs are not there, and we know why: NOT READY, with
# the reason, and no build attempted — a build with no node_modules only reports
# the first missing binary.
if [ -n "$INSTALL_ERR" ]; then
  echo "   NOT READY — dependencies did not install, so the build cannot run:"
  printf '%s\n' "$INSTALL_ERR" | sed 's/^/      /'
  build=notready; notready=1; BUILD_CMD=""
# The command is the project's own (build-command.py); a project that
# declares none is NOT READY.
elif BUILD_CMD=$(CW_WORKDIR="$APP" python3 "$DIR/build-command.py" prod 2>"$ROOT/.cognidev/build-command.err"); then
  echo "   command: $BUILD_CMD"
else
  echo "   NOT READY — $(cat "$ROOT/.cognidev/build-command.err")"; build=notready; notready=1; BUILD_CMD=""
fi
CHECK='set -- '"$BUILD_CMD"'; case "$1" in node_modules/*) [ -x "$1" ] || { echo "__notready__ $1 is not installed"; exit 0; };; esac'
if [ -z "$BUILD_CMD" ]; then
  :
elif out=$(sh_in "$CHECK; $BUILD_CMD"); then
  case "$out" in
    *__notready__*) echo "   NOT READY — ${out#*__notready__ }; the build did not run"; build=notready; notready=1 ;;
    *) echo "   PASS — the app builds"; build=pass ;;
  esac
else
  echo "   FAIL — build errors:"
  # A failure with nothing under it is unreadable. When none of the lines look
  # like a compiler error (a missing binary, a shell error, an OOM), show what
  # the build actually said instead of an empty list.
  # ng prints `✘ [ERROR] …` in ANSI colour and upper case, so a case-sensitive
  # grep for "Error" matched nothing. `\x1b` is a GNU sed extension — BSD sed
  # leaves the escapes in place — so the ESC is spelled with printf instead.
  # The CLI's own "See …/angular-errors.log for further details" names a file it
  # deletes when it exits: that line is not an error, it is a dead end, and when
  # it was the only match the whole failure read as one useless line. It is
  # dropped, and the complete output is kept on disk so a compiler crash — whose
  # detail appears nowhere else — is still readable after the run.
  ESC=$(printf '\033')
  mkdir -p "$ROOT/.cognidev/run"
  BUILD_LOG="$ROOT/.cognidev/run/build.log"
  printf '%s\n' "$out" | sed "s/${ESC}\[[0-9;]*m//g" > "$BUILD_LOG"
  errs=$(grep -Ei 'error|could not resolve|cannot find|TS[0-9]|NG[0-9]' "$BUILD_LOG" \
    | grep -v 'for further details' | head -8)
  [ -n "$errs" ] || errs=$(grep -v '^[[:space:]]*$' "$BUILD_LOG" | tail -20)
  printf '%s\n' "$errs" | sed 's/^/      /'
  echo "      full build output: .cognidev/run/build.log ($(grep -c '' "$BUILD_LOG") lines)"
  build=fail; fail=1
fi

echo "──────────────────────────────────────────────────────────"
echo " ② LINT — ESLint (angular-eslint / typescript-eslint recommended)"
echo "──────────────────────────────────────────────────────────"
HAS_CFG=0
for c in eslint.config.js eslint.config.mjs .eslintrc.json .eslintrc.js; do
  [ -f "$c" ] && HAS_CFG=1
done
if [ "$HAS_CFG" -eq 0 ]; then
  echo "   SKIP — no ESLint config in the project"
else
  # Errors fail; warnings are reported. --max-warnings=-1 keeps warnings non-fatal.
  if out=$(sh_in '[ -x node_modules/.bin/eslint ] || { echo __noeslint__; exit 0; }; node_modules/.bin/eslint . --max-warnings=-1'); then
    case "$out" in
      *__noeslint__*) echo "   SKIP — eslint not installed" ;;
      *) echo "   PASS — no lint errors"; [ -n "$out" ] && printf '%s\n' "$out" | grep -i warning | head -5 | sed 's/^/      /'; lint=pass ;;
    esac
  else
    echo "   FAIL — lint errors (coding-standard violations):"
    printf '%s\n' "$out" | grep -iE 'error' | head -8 | sed 's/^/      /'
    lint=fail; fail=1
  fi
fi

echo "──────────────────────────────────────────────────────────"
echo " ③ SECURITY — npm audit (high + critical dependency CVEs)"
echo "──────────────────────────────────────────────────────────"
if { command -v npm >/dev/null 2>&1 || [ "$MODE" = "docker" ]; } && [ -d node_modules ]; then
  out=$(sh_in 'npm audit --omit=dev --audit-level=high 2>&1'); rc=$?
  hi=$(printf '%s\n' "$out" | grep -oiE '[0-9]+ (high|critical)' | head -3 | tr '\n' ' ')
  if [ "$rc" -eq 0 ]; then
    echo "   PASS — no high/critical advisories"; sec=pass
  elif [ -n "$hi" ]; then
    echo "   FAIL — high/critical dependency advisories: ${hi}"
    sec=fail; fail=1
  else
    # npm audit errored for a reason other than a real finding (offline registry,
    # no lockfile, ENOAUDIT, etc.) — degrade to SKIP like the other steps do.
    echo "   SKIP — npm audit could not run (no advisory data — offline or unsupported):"
    printf '%s\n' "$out" | head -3 | sed 's/^/      /'
  fi
else
  echo "   SKIP — npm/node_modules not available"
fi

echo "──────────────────────────────────────────────────────────"
echo " validate: build=${build}  lint=${lint}  security=${sec}"
if [ "$notready" -eq 1 ]; then
  echo " validate: ENVIRONMENT NOT READY — the build did not run; this result is not accepted."
  exit 2
fi
if [ "$fail" -eq 0 ]; then
  echo " validate: PIPELINE OK (passed steps are real; skipped steps said so)."
  exit 0
fi
echo " validate: PIPELINE found critical issues above — not clean."
exit 1
