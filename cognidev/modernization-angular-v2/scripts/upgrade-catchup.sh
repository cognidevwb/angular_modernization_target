#!/usr/bin/env sh
# upgrade-catchup.sh — walk every major BELOW the fixed rungs, one at a time.
#
# The ladder in playbook.yaml has a phase per major from 17 up. A repo that
# starts at Angular 12 met only those phases, and each one refuses to skip a
# major ("the step for 17 waits its turn"), so the run finished green with the
# app still on 12 and nothing but check-request said so. This step is the rung
# below 17: it calls upgrade-major.sh for 13, 14, 15, 16 in turn, then hands a
# repo at 16 to the phase for 17.
#
# It owns no version facts and no update logic — every step is upgrade-major.sh,
# so a major is gated, recorded and built exactly as it is higher up the ladder.
#
# CW_UPGRADE_STOP_AFTER=<n> takes at most n majors and stops. The "upgrade one
# major" quick action is this script with n=1 — the same walk, the same gates,
# the same records, so the quick action and the full modernization cannot
# disagree about what one major means.
set -u
ROOT="${CW_WORKDIR:-$PWD}"
DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
APP_REL=$(sh "$DIR/app-root.sh" "$ROOT")
ROOT=$(CDPATH= cd -- "$ROOT" 2>/dev/null && pwd) || { echo "upgrade-catchup: ENVIRONMENT NOT READY — workspace missing"; exit 2; }
PROJECT="$ROOT"; [ "$APP_REL" = "." ] || PROJECT="$ROOT/$APP_REL"
LOG="${CW_STEP_LOG:-/dev/stdout}"
say() { echo "$@" >> "$LOG"; }
cd "$PROJECT" || { say "upgrade-catchup: ENVIRONMENT NOT READY — workspace $PROJECT missing"; exit 2; }
REC="$ROOT/.cognidev/modernization-angular-v2/upgrade-catchup.json"
mkdir -p "$ROOT/.cognidev/modernization-angular-v2"

json() { python3 -c "import json,sys
try:
    d=json.load(open(sys.argv[1]))
except Exception:
    sys.exit(0)
for k in sys.argv[2].split('.'):
    d=d.get(k) if isinstance(d,dict) else None
print('' if d is None else d)" "$1" "$2" 2>/dev/null; }

core_major() {
  c=$(json package.json dependencies.@angular/core); [ -n "$c" ] || c=$(json package.json devDependencies.@angular/core)
  [ -n "$c" ] || return 1
  echo "$c" | sed -E 's/^[^0-9]*([0-9]+).*/\1/'
}

record() {
  python3 -c "import json,sys;json.dump({'ok':sys.argv[1]=='1','from':int(sys.argv[2]),'reached':int(sys.argv[3]),'steps':[int(x) for x in sys.argv[4].split() if x],'note':sys.argv[5]},open(sys.argv[6],'w'),indent=2)" \
    "$1" "$2" "$3" "$4" "$5" "$REC"
}

CUR=$(core_major) || { say "upgrade-catchup: no @angular/core in package.json; nothing to upgrade"; exit 0; }
START="$CUR"
TARGET=$(json "$ROOT/.cognidev/angular/generation.json" target_version); [ -n "$TARGET" ] || TARGET=22

# The fixed rungs start at 17, so the full walk's job ends at 16. Asked for a
# bounded number of majors there are no later phases to hand to, so the ceiling
# is the chosen target.
STOP_AFTER="${CW_UPGRADE_STOP_AFTER:-0}"
LAST=16; [ "$STOP_AFTER" -gt 0 ] 2>/dev/null && LAST="$TARGET"
[ "$TARGET" -lt "$LAST" ] 2>/dev/null && LAST="$TARGET"
# Asked for a bounded number of majors there is no later phase to hand to, so
# the two cases do not get to share a sentence.
if [ "$STOP_AFTER" -gt 0 ] 2>/dev/null; then
  HANDOFF="it is already at the target $TARGET"
else
  HANDOFF="the per-major phases from 17 carry it from here"
fi

if [ "$CUR" -ge "$LAST" ] 2>/dev/null; then
  say "upgrade-catchup: @angular/core is at $CUR; $HANDOFF"
  record 1 "$START" "$CUR" "" "already at or past $LAST" ; exit 0
fi

# Below 6 there is no `ng update`; upgrade-major.sh holds that fact and the
# reason. Ask it for the next major so the message comes from one place.
if [ "$CUR" -lt 5 ] 2>/dev/null; then
  CW_WORKDIR="$ROOT" sh "$DIR/upgrade-major.sh" $((CUR + 1))
  rc=$?
  record 0 "$START" "$CUR" "" "Angular $CUR predates \`ng update\`" ; exit $rc
fi

TAKEN=0
STEPS=""
N=$((CUR + 1))
while [ "$N" -le "$LAST" ]; do
  if [ "$STOP_AFTER" -gt 0 ] 2>/dev/null && [ "$TAKEN" -ge "$STOP_AFTER" ]; then
    say "upgrade-catchup: $TAKEN major(s) taken, which is the limit asked for; @angular/core is at $CUR"
    record 1 "$START" "$CUR" "$STEPS" "stopped after $TAKEN of the limit $STOP_AFTER" ; exit 0
  fi
  say "upgrade-catchup: step $CUR → $N"
  CW_WORKDIR="$ROOT" sh "$DIR/upgrade-major.sh" "$N" || {
    rc=$?
    say "upgrade-catchup: stopped at $N (upgrade-major exit $rc); the majors already taken are recorded in their own upgrade-<n>.json"
    record 0 "$START" "$CUR" "$STEPS" "stopped at $N" ; exit $rc
  }
  NEW=$(core_major)
  # upgrade-major exits 0 both when it upgraded and when it deliberately stood
  # down (the AngularJS runtime is still in the tree, the target is lower, the
  # tree is already there). Re-read the manifest rather than assume: if the
  # major did not move, looping to N+1 would only collect "waits its turn".
  if [ "${NEW:-0}" -le "$CUR" ] 2>/dev/null; then
    say "upgrade-catchup: @angular/core is still $NEW after the step for $N — the step stood down, so the walk stops here rather than skipping a major"
    record 1 "$START" "$NEW" "$STEPS" "stood down at $N" ; exit 0
  fi
  CUR="$NEW"; STEPS="$STEPS $N"; TAKEN=$((TAKEN + 1)); N=$((CUR + 1))
done

say "upgrade-catchup: Angular $START → $CUR; $HANDOFF"
record 1 "$START" "$CUR" "$STEPS" "walked to $CUR"
exit 0
