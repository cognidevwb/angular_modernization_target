"""One summary of the generated target: compiler diagnostics by file group and code, bundle result."""
import json, re, sys, collections
W, O = sys.argv[1:]
pat = re.compile(r'(.+?):(\d+):(\d+) - (\w+): (.*)')
lines = [l.rstrip("\n") for l in open(f"{O}/ng.txt")]
warnings = sum(1 for l in lines if " - warning " in l)
rows = sorted({m.groups() for m in (pat.match(l) for l in lines if " - warning " not in l) if m})
port = json.load(open(f"{W}/.cognidev/modernization-angular-v2/port/units.json"))
gen = set()
for u in port["units"]:
    if u.get("status") in ("written", "regenerated"):
        gen.add(u["target"]); gen.add(u.get("templateTarget") or "")
mine = [r for r in rows if r[0] in gen]
other = [r for r in rows if r[0] not in gen]
tpl = [r for r in mine if r[0].endswith(".html")]
code = [r for r in mine if not r[0].endswith(".html")]
wp = open(f"{O}/webpack.txt").read()
s = {"generated_ts_errors": len(code), "generated_template_errors": len(tpl),
     "files_with_errors": len({r[0] for r in mine}), "existing_app_errors": len(other),
     "warnings": warnings, "bundle": "ok" if "exit=0" in wp else "failed", "bundle_errors": len(re.findall(r"^ERROR", wp, re.M)),
     "by_code": collections.Counter(r[3] for r in mine).most_common(20)}
try:
    s["runtime_globals"] = json.load(open(f"{O}/globals.json"))["summary"]
except (OSError, ValueError, KeyError):
    pass
json.dump(s, open(f"{O}/summary.json", "w"), indent=1)
json.dump([dict(zip(("file", "line", "col", "code", "message"), r)) for r in mine], open(f"{O}/errors.json", "w"), indent=0)
print(json.dumps(s))
