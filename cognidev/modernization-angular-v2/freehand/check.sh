#!/bin/zsh
# Freehand check of the generated Angular target. Repeatable; every step reruns from S6.
#   freehand/check.sh <web-dir> [--no-regen]
# Writes <web-dir>/.cognidev/modernization-angular-v2/freehand/: ng.txt (every
# Angular compiler diagnostic, TS + template), webpack.txt, summary.json.
set -u
W=${1:?web dir}; shift
F=${0:A:h}; T=${F:h}/tools
O=$W/.cognidev/modernization-angular-v2/freehand; mkdir -p $O
if [[ ${1:-} != --no-regen ]]; then
  (cd $W && CW_WORKDIR=$W $T/scaffold-units/target/release/scaffold-units >/dev/null 2>$O/scaffold.err) || { echo "scaffold failed"; tail -3 $O/scaffold.err; exit 1; }
  (cd $W && CW_WORKDIR=$W $T/typecheck/target/release/typecheck >/dev/null 2>$O/typecheck.err)
fi
python3 $F/ngconfig.py $W $O
(cd $W && node $F/ng-diagnostics.mjs $O/tsconfig.ng.json $W/node_modules $W/src/client > $O/ng.txt 2>$O/ng.err)
(cd $W && npx webpack --config $O/webpack.generated.js --mode development > $O/webpack.log 2>&1); echo "exit=$?" >> $O/webpack.log
sed 's/\x1b\[[0-9;]*m//g' $O/webpack.log > $O/webpack.txt
# names read as globals that nothing defines at run time (needs probe-legacy.json from probe.mjs)
if [[ -f $O/probe-legacy.json ]]; then
  (cd $W && node $F/globals-audit.mjs $O/tsconfig.ng.json $W/node_modules $W/.cognidev/modernization-angular-v2/port/units.json $O/probe-legacy.json $O/globals.json > $O/globals.txt 2>&1)
fi
python3 $F/summary.py $W $O
