#!/bin/zsh
# One LLM round over the generated target: regenerate + check, ask (cached),
# check, keep only the files whose problems fell, check again.
#   freehand/fix-round.sh <web-dir> [--limit N] [--jobs J] [--no-regen]
set -u
W=${1:?web dir}; shift
F=${0:A:h}; O=$W/.cognidev/modernization-angular-v2/freehand
REGEN=""; ARGS=()
for a in "$@"; do [[ $a == --no-regen ]] && REGEN=--no-regen || ARGS+=$a; done
$F/check.sh $W $REGEN >/dev/null
rm -rf $O/pre-llm; cp $O/errors.json $O/errors.before.json; cp $O/globals.json $O/globals.before.json
python3 $F/llm_fix.py ask $W ${=ARGS}
$F/check.sh $W --no-regen >/dev/null
python3 $F/llm_fix.py keep $W $O/errors.before.json $O/globals.before.json
$F/check.sh $W --no-regen
