#!/bin/zsh
# Compile check of a rewrite target (a pure AngularJS app ported beside itself):
# every Angular compiler diagnostic, TS and template, over every file under the
# modern root — not only what the router reaches yet.
#   freehand/rewrite-check.sh <workspace>
# Writes <ws>/.cognidev/modernization-angular-v2/freehand/: ng.txt, errors.json, summary.json.
set -u
W=${1:?workspace}
F=${0:A:h}
O=$W/.cognidev/modernization-angular-v2/freehand; mkdir -p $O
ROOT=$(python3 -c "import json;print(json.load(open('$W/.cognidev/understand/angular-assessment.json'))['briefing']['conformance']['modern_root'])")
python3 - "$W" "$O" "$ROOT" <<'PY'
import json, sys
W, O, ROOT = sys.argv[1:]
json.dump({"extends": f"{W}/tsconfig.json",
           "compilerOptions": {"outDir": f"{O}/ngc-out", "rootDir": W, "skipLibCheck": True, "noEmit": True},
           "files": [f"{W}/src/main.ts"],
           "include": [f"{W}/{ROOT}/**/*.ts", f"{W}/src/**/*.d.ts"]},
          open(f"{O}/tsconfig.check.json", "w"), indent=1)
PY
(cd $W && node $F/ng-diagnostics.mjs $O/tsconfig.check.json $W/node_modules > $O/ng.txt 2>$O/ng.err)
python3 - "$W" "$O" <<'PY'
import json, re, sys, collections
W, O = sys.argv[1:]
pat = re.compile(r'(.+?):(\d+):(\d+) - (\w+): (.*)')
rows = [m.groups() for m in (pat.match(l.rstrip("\n")) for l in open(f"{O}/ng.txt")) if m and " - warning " not in m.group(0)]
tpl = [r for r in rows if r[0].endswith(".html")]
s = {"ts_errors": len(rows) - len(tpl), "template_errors": len(tpl), "files_with_errors": len({r[0] for r in rows}),
     "by_code": collections.Counter(r[3] for r in rows).most_common(25)}
json.dump(s, open(f"{O}/summary.json", "w"), indent=1)
json.dump([dict(zip(("file", "line", "col", "code", "message"), r)) for r in rows], open(f"{O}/errors.json", "w"), indent=0)
print(json.dumps(s))
PY
