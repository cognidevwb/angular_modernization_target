#!/bin/zsh
# The whole freehand run, from S6 to a checked, running target. Repeatable:
# every LLM answer is cached by prompt hash, so a rerun calls the model only for
# what changed.
#   freehand/run-all.sh <web-dir> [<legacy-build-dir>] [--rounds N]
# <legacy-build-dir>: a built copy of the legacy app (its dist/), for the
# runtime globals and the old-vs-new render comparison.
set -u
W=${1:?web dir}; LEGACY=${2:-}; ROUNDS=2
[[ ${3:-} == --rounds ]] && ROUNDS=${4:-2}
F=${0:A:h}; T=${F:h}/tools; O=$W/.cognidev/modernization-angular-v2/freehand
mkdir -p $O
if [[ -n $LEGACY && ! -f $O/probe-legacy.json ]]; then
  node $F/probe.mjs $LEGACY/dist $LEGACY $O/probe-legacy.json / 12000
fi
# 1. S6 + S6b, then the LLM rounds (the first check regenerates; the rest keep the edits)
$F/check.sh $W >/dev/null
for i in $(seq 1 $ROUNDS); do
  echo "== LLM round $i"
  $F/fix-round.sh $W --no-regen --jobs 8 | tail -1
done
# 2. the switch: the ported code in charge of the hybrid app
(cd $W && CW_WORKDIR=$W $T/cutover/target/release/cutover)
# 3. the app itself, built as the project builds it
(cd $W && rm -rf dist && npx webpack --mode development > $O/app-build.log 2>&1); echo "app build exit=$?"
# 4. at run time: the page, and every component rendered, old next to new
node $F/probe.mjs $W/dist $W $O/probe-new.json / 15000
node $F/render.mjs $W/dist $W $W/.cognidev/modernization-angular-v2/port/units.json $O/render-new.json
if [[ -n $LEGACY ]]; then
  node $F/render.mjs $LEGACY/dist $LEGACY $W/.cognidev/modernization-angular-v2/port/units.json $O/render-legacy.json
  python3 $F/render_compare.py $O/render-legacy.json $O/render-new.json
fi
