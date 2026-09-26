#!/usr/bin/env sh
# upgrade-major.sh <N> — one `ng update` step, from major N-1 to N, with the
# build run after it. Refuses to skip a major: at 19, the step for 21 waits.
# Waits while the AngularJS runtime is still in the tree (remove-angularjs
# records its removal), and stops as ENVIRONMENT NOT READY when the workspace,
# Node or TypeScript cannot carry the target. CW_DRY_RUN=1 prints the commands
# and writes the record without running anything.
#
# The version facts below were read from the registry on 2026-09-06 for 17-22
# and on 2026-09-09 for 6-16
# (`npm view @angular/compiler-cli@N peerDependencies.typescript`,
# `npm view @angular/cli@N engines.node`). A later major needs its own row.
set -u
N="${1:-${CW_UPGRADE_TO:-}}"
[ -n "$N" ] || { echo "upgrade-major: no target major given"; exit 1; }
ROOT="${CW_WORKDIR:-$PWD}"
DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
# The app is not always the repository — one resolver answers this for every
# script in this playbook (scripts/app-root.sh), from what detect-version
# recorded. Looking only at the workspace root made this step report a repo
# whose app is `Web/` as having no package.json / no CLI workspace at all.
# But only the BUILD lives in the app: every `.cognidev` file this step reads
# and writes belongs to the WORKSPACE. Resolving those relative to the app too
# read generation.json from a path that does not exist — so the chosen target
# version and the hybrid gate silently fell back to their defaults — and wrote
# this step's record into Web/.cognidev, where the playbook does not declare
# it. ROOT is the workspace; PROJECT is the app inside it; cwd is the app.
APP_REL=$(sh "$DIR/app-root.sh" "$ROOT")
ROOT=$(CDPATH= cd -- "$ROOT" 2>/dev/null && pwd) || { echo "upgrade-major: ENVIRONMENT NOT READY — workspace missing"; exit 2; }
PROJECT="$ROOT"; [ "$APP_REL" = "." ] || PROJECT="$ROOT/$APP_REL"
LOG="${CW_STEP_LOG:-/dev/stdout}"
say() { echo "$@" >> "$LOG"; }
cd "$PROJECT" || { say "upgrade-major: ENVIRONMENT NOT READY — workspace $PROJECT missing"; exit 2; }
REC="$ROOT/.cognidev/modernization-angular-v2/upgrade-$N.json"
mkdir -p "$ROOT/.cognidev/modernization-angular-v2"

# Each major's real TypeScript peer range (@angular/compiler-cli) and Node
# engine range (@angular/cli), read off the registry rather than remembered.
case "$N" in
  # `ng update` itself arrives with CLI 6. Below that a major is a hand
  # migration, so there is no row here and the guard above refuses it.
  6)  TS_RANGE='>=2.7.2 <2.10'; TS_FLOOR="2.7.2"; NODE_RANGE='>=8.9.0' ;;
  7)  TS_RANGE='>=3.1.1 <3.3'; TS_FLOOR="3.1.1"; NODE_RANGE='>=8.9.0' ;;
  8)  TS_RANGE='>=3.4 <3.6'; TS_FLOOR="3.4"; NODE_RANGE='>=10.9.0' ;;
  9)  TS_RANGE='>=3.6 <3.9'; TS_FLOOR="3.6"; NODE_RANGE='>=10.13.0' ;;
  10) TS_RANGE='>=3.9 <4.1'; TS_FLOOR="3.9"; NODE_RANGE='>=10.13.0' ;;
  11) TS_RANGE='>=4.0 <4.2'; TS_FLOOR="4.0"; NODE_RANGE='>=10.13.0' ;;
  12) TS_RANGE='>=4.2.3 <4.4'; TS_FLOOR="4.2.3"; NODE_RANGE='^12.14.1 || >=14.0.0' ;;
  13) TS_RANGE='>=4.4.2 <4.7'; TS_FLOOR="4.4.2"; NODE_RANGE='^12.20.0 || ^14.15.0 || >=16.10.0' ;;
  14) TS_RANGE='>=4.6.2 <4.9'; TS_FLOOR="4.6.2"; NODE_RANGE='^14.15.0 || >=16.10.0' ;;
  15) TS_RANGE='>=4.8.2 <5.0'; TS_FLOOR="4.8.2"; NODE_RANGE='^14.20.0 || ^16.13.0 || >=18.10.0' ;;
  16) TS_RANGE='>=4.9.3 <5.2'; TS_FLOOR="4.9.3"; NODE_RANGE='^16.14.0 || >=18.10.0' ;;
  17) TS_RANGE='>=5.2 <5.5'; TS_FLOOR="5.2"; NODE_RANGE='^18.13.0 || >=20.9.0' ;;
  18) TS_RANGE='>=5.4 <5.6'; TS_FLOOR="5.4"; NODE_RANGE='^18.19.1 || ^20.11.1 || >=22.0.0' ;;
  19) TS_RANGE='>=5.5 <5.9'; TS_FLOOR="5.5"; NODE_RANGE='^18.19.1 || ^20.11.1 || >=22.0.0' ;;
  20) TS_RANGE='>=5.8 <6.0'; TS_FLOOR="5.8"; NODE_RANGE='^20.19.0 || ^22.12.0 || >=24.0.0' ;;
  21) TS_RANGE='>=5.9 <6.1'; TS_FLOOR="5.9"; NODE_RANGE='^20.19.0 || ^22.12.0 || >=24.0.0' ;;
  22) TS_RANGE='>=6.0 <6.1'; TS_FLOOR="6.0"; NODE_RANGE='^22.22.3 || ^24.15.0 || >=26.0.0' ;;
  2|3|4|5)
    say "upgrade-major: Angular $N cannot be reached with \`ng update\` — the command arrives with Angular CLI 6, and 5 to 6 is the earliest step it can take. Getting a workspace below 5 up to 6 is a hand migration (RC-to-final API renames, \`@angular/http\` to \`HttpClient\`, the CLI 1.x to 6 workspace format). Do that first; the ladder here starts at 6."
    exit 2 ;;
  *) say "upgrade-major: no version facts for Angular $N in this script; add its TypeScript and Node ranges before running it"; exit 1 ;;
esac

json() { python3 -c "import json,sys
try:
    d=json.load(open(sys.argv[1]))
except Exception:
    sys.exit(0)
for k in sys.argv[2].split('.'):
    d=d.get(k) if isinstance(d,dict) else None
print('' if d is None else d)" "$1" "$2" 2>/dev/null; }

CORE=$(json package.json dependencies.@angular/core); [ -n "$CORE" ] || CORE=$(json package.json devDependencies.@angular/core)
[ -n "$CORE" ] || { say "upgrade-major: no @angular/core in package.json; nothing to upgrade"; exit 0; }
CUR=$(echo "$CORE" | sed -E 's/^[^0-9]*([0-9]+).*/\1/')
TARGET=$(json "$ROOT/.cognidev/angular/generation.json" target_version); [ -n "$TARGET" ] || TARGET=22
if [ "$N" -gt "$TARGET" ] 2>/dev/null; then say "upgrade-major: $N is past the chosen target $TARGET; skipped"; exit 0; fi
if [ "$CUR" -ge "$N" ] 2>/dev/null; then say "upgrade-major: @angular/core $CORE is already at $CUR; the step for $N has nothing to do"; exit 0; fi
if [ "$CUR" -ne $((N - 1)) ] 2>/dev/null; then say "upgrade-major: @angular/core is at $CUR; the next major is $((CUR + 1)) — the step for $N waits its turn"; exit 0; fi
HYBRID=$(json "$ROOT/.cognidev/angular/generation.json" hybrid)
REMOVED=$(json "$ROOT/.cognidev/modernization-angular-v2/removed.json" done)
if [ "$HYBRID" = "True" ] && [ "$REMOVED" != "True" ]; then
  say "upgrade-major: the AngularJS runtime is still in the tree; the upgrade waits until remove-angularjs has removed it (its record: .cognidev/modernization-angular-v2/removed.json)"
  exit 0
fi
[ -f angular.json ] || { say "upgrade-major: ENVIRONMENT NOT READY — no angular.json: \`ng update\` needs a CLI workspace (repair-workspace listed what is missing)"; exit 2; }

in_range() { python3 -c "
import re,sys
v=sys.argv[1]; rng=sys.argv[2]
def parse(s):
    m=re.match(r'v?(\d+)\.(\d+)\.(\d+)', s); return tuple(int(x) for x in m.groups()) if m else None
def floor(s):
    m=re.match(r'(\d+)(?:\.(\d+))?(?:\.(\d+))?', s); return (int(m.group(1)), int(m.group(2) or 0), int(m.group(3) or 0))
cur=parse(v)
if cur is None: sys.exit(1)
ok=False
for alt in rng.split('||'):
    alt=alt.strip(); parts=alt.split()
    good=True
    for p in parts:
        if p.startswith('^'):
            f=floor(p[1:]); good &= cur>=f and cur[0]==f[0]
        elif p.startswith('>='): good &= cur>=floor(p[2:])
        elif p.startswith('<'): good &= cur<floor(p[1:])
        else: good &= cur>=floor(p)
    ok |= good
sys.exit(0 if ok else 1)" "$1" "$2"; }

NODE_V=$(node -v 2>/dev/null)
if [ -z "$NODE_V" ]; then say "upgrade-major: ENVIRONMENT NOT READY — no node on PATH"; exit 2; fi
if ! in_range "$NODE_V" "$NODE_RANGE"; then say "upgrade-major: ENVIRONMENT NOT READY — Angular $N needs Node $NODE_RANGE; this machine has $NODE_V"; exit 2; fi
TS_V=$(json node_modules/typescript/package.json version)
CMDS=""
if [ -z "$TS_V" ] || ! in_range "$TS_V" "$TS_RANGE"; then
  CMDS="npm install --save-dev \"typescript@$TS_RANGE\""
  say "upgrade-major: TypeScript ${TS_V:-not installed} is outside $TS_RANGE for Angular $N; it is bumped first"
fi
# A package outside @angular/* can pin the Angular major through a peer
# dependency — @ngrx/effects@19 peers on @angular/core@^19 — so a tree moved to
# 20 with that package left behind cannot install at all. `ng update` only moves
# what it is given, and it was given @angular/core and @angular/cli alone, so
# the conflict surfaced far downstream as an ERESOLVE that named no step. The
# blockers are read from installed metadata, and each is asked for at the target
# major only when the registry actually publishes that major; one that does not
# is named here instead of failing namelessly later.
BLOCKERS=$(python3 - "$N" <<'PYE'
import json, os, re, sys
n = int(sys.argv[1])
pkg = json.load(open('package.json'))
names = list(pkg.get('dependencies', {})) + list(pkg.get('devDependencies', {}))
def admits(rng, major):
    # A peer range admits the target when any of its alternatives can reach it.
    for alt in rng.split('||'):
        for m in re.finditer(r'(\^|~|>=|>)?\s*(\d+)', alt):
            op, v = m.group(1), int(m.group(2))
            if op in ('>=', '>') and major >= v: return True
            if op in ('^', '~') and major == v: return True
            if op is None and major == v: return True
    return False
out = []
for name in names:
    if name.startswith('@angular/'): continue
    man = os.path.join('node_modules', name, 'package.json')
    if not os.path.exists(man): continue
    try: peer = json.load(open(man)).get('peerDependencies', {}).get('@angular/core')
    except Exception: continue
    if peer and not admits(peer, n): out.append(f'{name}\t{peer}')
print('\n'.join(out))
PYE
)
EXTRA=""
if [ -n "$BLOCKERS" ]; then
  # Read from a file, not a pipe: a `while` in a pipeline runs in a subshell and
  # the EXTRA it builds would not survive the loop.
  BLOCK_LIST="$ROOT/.cognidev/modernization-angular-v2/peer-blockers-$N.tsv"
  printf '%s\n' "$BLOCKERS" > "$BLOCK_LIST"
  while IFS="$(printf '\t')" read -r name peer; do
    [ -n "$name" ] || continue
    say "upgrade-major: $name peers on @angular/core $peer, which does not admit $N"
    if npm view "$name@$N" version >/dev/null 2>&1; then
      EXTRA="$EXTRA $name@$N"
    else
      say "upgrade-major: $name has no $N release on the registry; it is left for the repair loop, and the install will not resolve until it moves"
    fi
  done < "$BLOCK_LIST"
  [ -n "$EXTRA" ] && say "upgrade-major: updating them with the framework:$EXTRA"
fi
# `npx` on PATH can resolve to a stale global shim (an old npm-global npx
# bundling npm@5) that breaks under current Node's fs API with
# `cb.apply is not a function`. `npm exec` always goes through the active npm.
UPDATE="npm exec --yes -- @angular/cli@$N update @angular/core@$N @angular/cli@$N$EXTRA --allow-dirty"
CMDS="${CMDS:+$CMDS
}$UPDATE"
BUILD="sh \"$DIR/typecheck.sh\""

if [ "${CW_DRY_RUN:-0}" = "1" ]; then
  say "upgrade-major: DRY RUN — Angular $CUR → $N would run:"
  echo "$CMDS" | while IFS= read -r c; do say "  $c"; done
  say "  $BUILD"
  python3 -c "import json,sys;json.dump({'dry_run':True,'from':int(sys.argv[1]),'to':int(sys.argv[2]),'commands':sys.argv[3].splitlines()+[sys.argv[4]]},open(sys.argv[5],'w'),indent=2)" "$CUR" "$N" "$CMDS" "$BUILD" "$REC"
  exit 0
fi

say "upgrade-major: Angular $CUR → $N"
echo "$CMDS" | while IFS= read -r c; do
  say "upgrade-major: \$ $c"
  if ! sh -c "$c" >>"$LOG" 2>&1; then
    say "upgrade-major: FAILED — $c (see the log above)"
    python3 -c "import json,sys;json.dump({'ok':False,'from':int(sys.argv[1]),'to':int(sys.argv[2]),'failed':sys.argv[3]},open(sys.argv[4],'w'),indent=2)" "$CUR" "$N" "$c" "$REC"
    exit 1
  fi
done || exit 1

# `ng update` decides "already up to date" by looking at node_modules, not at
# package.json. On a tree whose installed packages ran ahead of the manifest it
# therefore reports success, writes nothing, and every later step pays for it:
# the build is red, and the next `npm ci` — which resolves from the manifest —
# cannot even install. The manifest is what the next install reads, so the
# manifest is what proves the update happened.
NEWCORE=$(json package.json dependencies.@angular/core); [ -n "$NEWCORE" ] || NEWCORE=$(json package.json devDependencies.@angular/core)
NEWMAJ=$(echo "$NEWCORE" | sed -E 's/^[^0-9]*([0-9]+).*/\1/')
if [ "$NEWMAJ" != "$N" ] 2>/dev/null; then
  # Every installed @angular/* already at N means the update ran once and only
  # its manifest write was lost. Aligning the manifest to the tree ng update
  # itself produced is a copy, not a guess, so it is done here. Any other
  # disagreement is not something this step may resolve on its own.
  ALIGNED=$(python3 - "$N" <<'PYE'
import json, os, sys
n = sys.argv[1]
pkg = json.load(open('package.json'))
inst = {}
for name in list(pkg.get('dependencies', {})) + list(pkg.get('devDependencies', {})):
    if not name.startswith('@angular/'):
        continue
    m = os.path.join('node_modules', name, 'package.json')
    if not os.path.exists(m):
        print('missing ' + name); sys.exit(1)
    inst[name] = json.load(open(m))['version']
if not inst:
    print('no @angular packages installed'); sys.exit(1)
off = sorted(k for k, v in inst.items() if v.split('.')[0] != n)
if off:
    print('installed at another major: ' + ', '.join(f'{k}@{inst[k]}' for k in off[:4])); sys.exit(1)
for sec in ('dependencies', 'devDependencies'):
    for name in pkg.get(sec, {}):
        if name in inst:
            pkg[sec][name] = inst[name]
json.dump(pkg, open('package.json', 'w'), indent=2)
open('package.json', 'a').write('\n')
print(', '.join(f'{k}@{v}' for k, v in sorted(inst.items())))
PYE
) || {
    INST=$(json node_modules/@angular/core/package.json version)
    say "upgrade-major: FAILED — \`ng update\` reported success but package.json still declares @angular/core $NEWCORE (installed: ${INST:-none}); $ALIGNED. node_modules ran ahead of the manifest, so the update found nothing to do and the next install resolves the manifest and fails."
    python3 -c "import json,sys;json.dump({'ok':False,'from':int(sys.argv[1]),'to':int(sys.argv[2]),'failed':'ng update wrote nothing: package.json declares '+sys.argv[3]},open(sys.argv[4],'w'),indent=2)" "$CUR" "$N" "$NEWCORE" "$REC"
    exit 1
  }
  say "upgrade-major: \`ng update\` found node_modules already at $N and wrote nothing; package.json declared $NEWCORE. Manifest aligned to the installed tree: $ALIGNED"
fi

say "upgrade-major: build after the update"
if ! CW_WORKDIR="$ROOT" sh "$DIR/typecheck.sh"; then
  say "upgrade-major: the build is red after \`ng update\` to $N; the tree is left as the update wrote it for the repair loop"
  python3 -c "import json,sys;json.dump({'ok':False,'from':int(sys.argv[1]),'to':int(sys.argv[2]),'failed':'build after update'},open(sys.argv[3],'w'),indent=2)" "$CUR" "$N" "$REC"
  exit 1
fi
python3 -c "import json,sys;json.dump({'ok':True,'from':int(sys.argv[1]),'to':int(sys.argv[2]),'commands':sys.argv[3].splitlines()},open(sys.argv[4],'w'),indent=2)" "$CUR" "$N" "$CMDS" "$REC"
if [ "$N" -eq 22 ]; then
  for f in $(grep -rl --include='*.ts' 'platformBrowserDynamic' . 2>/dev/null | grep -v node_modules | head -10); do
    say "upgrade-major: TODO $f: platformBrowserDynamic is deprecated in Angular 22; with an AOT build, platformBrowser() from @angular/platform-browser replaces it"
  done
fi
say "upgrade-major: Angular $N — updated and green"
exit 0
