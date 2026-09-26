#!/usr/bin/env sh
# setup-environment.sh — HARD environment gate for the Angular modernization run.
#
# Rule (non-negotiable): you do not build Angular without a Node toolchain that
# can run the target Angular CLI. This phase proves the toolchain is ready BEFORE
# a single LLM token is spent on planning or develop. It resolves a build mode:
#
#   1. Docker running  → mode=docker  (build inside node:<ver>, host Node is
#                                       irrelevant). Preferred.
#   2. Host Node >= req → mode=host    (use the machine's own Node).
#   3. Can auto-install (nvm/brew) → install Node, then mode=host.
#   4. None of the above → EXIT 1 (HARD STOP) with exactly what to do.
#
# The ONE pinned version is derived HERE from the captured target Angular version
# and written to .cognidev/env.json — the single source of truth that scaffold-app,
# typecheck.sh and verify.sh all read, so the toolchain that builds and the Node
# the scaffold pins can never drift (no "some on Node 20, some on 22").
set -u

PROJECT="${CW_WORKDIR:-$PWD}"
cd "$PROJECT" || exit 1
LOG="${CW_STEP_LOG:-/dev/stdout}"
say() { echo "$@" >> "$LOG"; }

# ── 0. Private registries: a scoped registry whose token is missing or unset
# fails `npm install` with E401 much later, after the plan is made. Read
# .npmrc (and ~/.npmrc, which npm merges) now. A token's value is never printed.
check_registries() {
  [ -f .npmrc ] || return 0
  grep -E '^@[^:]+:registry=' .npmrc | sed 's/^\(@[^:]*\):registry=\(.*\)$/\1 \2/' | while read -r scope url; do
    host=$(echo "$url" | sed -E 's#^https?://##; s#/.*$##')
    auth=$(grep -hE "^//$host/.*:_authToken=" .npmrc "${HOME:-/nonexistent}/.npmrc" 2>/dev/null | head -1 | sed 's/^[^=]*=//')
    if [ -z "$auth" ]; then
      say "✗ ENVIRONMENT NOT READY — $scope resolves from $url, but no //$host/:_authToken line is in .npmrc or ~/.npmrc; npm install will fail with E401. Add the line with a token issued by that registry. Never paste the token into a chat."
      exit 2
    fi
    case "$auth" in
      '${'*'}'*)
        var=$(echo "$auth" | sed 's/^\${\([^}]*\)}.*/\1/')
        eval "val=\${$var:-}"
        if [ -z "$val" ]; then
          say "✗ ENVIRONMENT NOT READY — $scope resolves from $url; its token is read from \$$var, which is not set in this environment. Export $var (from the registry's token page) and re-check."
          exit 2
        fi
        say "setup-environment: $scope → $url, token from \$$var (set)." ;;
      *) say "setup-environment: $scope → $url, token present in .npmrc (an E401 at install means it expired; issue a new one there)." ;;
    esac
  done || exit 2
}
check_registries

# ── Target Angular version → required Node major (the SINGLE source of truth).
# Angular 20+ needs Node 20.19+/22.12+ (we pin 22, the active LTS); 17–19 → 20.
ng_ver() {
  v=$(grep -oE '"target_version"[^0-9]*([0-9]+)' .cognidev/intent/answers.json 2>/dev/null | grep -oE '[0-9]+' | tail -1)
  [ -z "$v" ] && v=$(grep -oE 'target_version:[^0-9]*([0-9]+)' .cognidev/intent.yml 2>/dev/null | grep -oE '[0-9]+' | tail -1)
  [ -z "$v" ] && v=22
  echo "$v"
}
NG=$(ng_ver)
case "$NG" in
  ''|*[!0-9]*) NG=22 ;;
esac
if [ "$NG" -ge 20 ] 2>/dev/null; then REQ=22; elif [ "$NG" -ge 17 ] 2>/dev/null; then REQ=20; else REQ=18; fi
say "setup-environment: Angular ${NG} target → requires Node ${REQ}+."

write_env() { # mode  image  node_bin_dir
  mkdir -p .cognidev
  printf '{"mode":"%s","node":%s,"angular":%s,"image":"%s","node_bin":"%s"}\n' \
    "$1" "$REQ" "$NG" "${2:-}" "${3:-}" > .cognidev/env.json
}

# Time-bounded `docker info` — the daemon-down case otherwise blocks for minutes.
docker_running() {
  command -v docker >/dev/null 2>&1 || return 1
  if command -v timeout >/dev/null 2>&1; then timeout 5 docker info >/dev/null 2>&1; return $?; fi
  if command -v gtimeout >/dev/null 2>&1; then gtimeout 5 docker info >/dev/null 2>&1; return $?; fi
  ( docker info >/dev/null 2>&1 ) & p=$!
  ( sleep 5; kill "$p" 2>/dev/null ) & w=$!
  wait "$p" 2>/dev/null; rc=$?
  kill "$w" 2>/dev/null
  return $rc
}

# ── 1. Docker (preferred — the build runs in a container with the exact Node) ──
if command -v docker >/dev/null 2>&1; then
  if docker_running; then
    IMG="node:${REQ}-bookworm-slim"
    say "setup-environment: Docker is running → build mode = docker (${IMG})."
    say "                   Host Node is irrelevant; the container provides Node ${REQ}."
    write_env docker "$IMG" ""
    exit 0
  fi
  say "setup-environment: docker is installed but the daemon is NOT running."
fi

# ── 2. Host Node already adequate? Read its REAL major; accept only if >= REQ. ──
host_node_ver() { node -v 2>/dev/null | sed -n 's/^v\([0-9][0-9]*\).*/\1/p' | head -1; }
use_host_if_ok() {
  cur=$(host_node_ver); case "$cur" in ''|*[!0-9]*) cur=0;; esac
  if [ "$cur" -ge "$REQ" ] 2>/dev/null; then
    say "setup-environment: host Node ${cur} satisfies Node ${REQ}+ → build mode = host."
    write_env host "" ""; return 0
  fi
  # nvm install of the required major, if nvm is present and not opted out.
  if [ "${CW_SETUP_NO_INSTALL:-0}" != "1" ] && [ -s "${NVM_DIR:-$HOME/.nvm}/nvm.sh" ]; then
    say "setup-environment: host Node ${cur} too old — installing Node ${REQ} via nvm…"
    # shellcheck disable=SC1090
    . "${NVM_DIR:-$HOME/.nvm}/nvm.sh"
    if nvm install "$REQ" >>"$LOG" 2>&1 && nvm use "$REQ" >>"$LOG" 2>&1; then
      cur=$(host_node_ver); case "$cur" in ''|*[!0-9]*) cur=0;; esac
      if [ "$cur" -ge "$REQ" ] 2>/dev/null; then
        say "setup-environment: nvm provided Node ${cur} → build mode = host."
        write_env host "" "$(dirname "$(command -v node)")"; return 0
      fi
    fi
  fi
  return 1
}
use_host_if_ok && exit 0

# ── 3. Best-effort install via brew (cask/formula), non-interactive ──
if [ "${CW_SETUP_NO_INSTALL:-0}" != "1" ] && command -v brew >/dev/null 2>&1; then
  say "setup-environment: no adequate Node — attempting 'brew install node@${REQ}'…"
  if brew install "node@${REQ}" >>"$LOG" 2>&1; then
    # brew keg-only node@N often isn't linked; expose it for this check.
    PREFIX=$(brew --prefix "node@${REQ}" 2>/dev/null)
    [ -n "$PREFIX" ] && PATH="$PREFIX/bin:$PATH" && export PATH
    use_host_if_ok && exit 0
  fi
  say "setup-environment: automatic Node install did not produce a usable Node ${REQ}."
fi

# ── 4. HARD STOP — the environment cannot build this project ──
say ""
say "✗ ENVIRONMENT NOT READY — cannot build an Angular ${NG} app on this machine."
say ""
say "  Do ONE of these, then re-run:"
say "    • Start Docker Desktop  (preferred — the build then runs in a Node ${REQ} container)"
say "    • Install Node ${REQ}:   nvm install ${REQ}   (or: brew install node@${REQ})"
say ""
say "  Refusing to plan/develop a migration the machine can't build."
exit 1
