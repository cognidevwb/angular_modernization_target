#!/bin/zsh
# Switch, build the app as the project does, and load it: cutover → webpack → probe.
#   freehand/app-probe.sh <web-dir> [page] [--prod]
set -u
W=${1:?web dir}; PAGE=${2:-/}; MODE=development; [[ ${3:-} == --prod ]] && MODE=production
F=${0:A:h}; T=${F:h}/tools; O=$W/.cognidev/modernization-angular-v2/freehand
(cd $W && CW_WORKDIR=$W $T/cutover/target/release/cutover 2>&1 | cut -c1-160)
(cd $W && rm -rf dist && npx webpack --mode $MODE > $O/app-build.log 2>&1); echo "build ($MODE) exit=$?"
sed 's/\x1b\[[0-9;]*m//g' $O/app-build.log | grep -E "^ERROR" -A3 | head -12
node $F/probe.mjs $W/dist $W $O/probe-new.json $PAGE 15000
python3 - $O/probe-new.json <<'PY'
import json, sys
r = json.load(open(sys.argv[1]))
print("page errors:", [e[:400] for e in r["pageErrors"]][:4])
print("console errors:", [e[:700] for e in r["consoleErrors"] if "404" not in e and "monaco" not in e and "ensureError" not in e][:4])
print("text:", r["text"][:240].replace("\n", " | "))
PY
