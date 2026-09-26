#!/usr/bin/env sh
# check-routes.sh — every route with a URL opened in a browser, against the
# running app (CW_APP_URL), with a saved session (CW_APP_STORAGE_STATE) and
# route parameter values (CW_ROUTE_PARAMS). Generates the spec, runs it,
# writes .cognidev/modernization-angular-v2/route-check.json. Stops as
# ENVIRONMENT NOT READY without the app URL or Playwright. Exit 1 when a
# route failed; the failures are in the record, named.
set -u
PROJECT="${CW_WORKDIR:-$PWD}"
DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
LOG="${CW_STEP_LOG:-/dev/stdout}"
say() { echo "$@" >> "$LOG"; }
cd "$PROJECT" || { say "check-routes: ENVIRONMENT NOT READY — workspace $PROJECT missing"; exit 2; }
python3 "$DIR/check-routes.py" "$PROJECT" >> "$LOG" 2>&1 || { say "check-routes: the spec could not be generated (see above)"; exit 1; }
[ -n "${CW_APP_URL:-}" ] || { say "check-routes: ENVIRONMENT NOT READY — CW_APP_URL is not set. Start the application, then set CW_APP_URL (its origin), CW_APP_STORAGE_STATE (a Playwright storage state saved after logging in by hand: npx playwright codegen --save-storage=auth.json \$CW_APP_URL) and CW_ROUTE_PARAMS (JSON with a value per route parameter, e.g. {\"projectPid\":\"12\"}). CW_RECORD=1 records responses into e2e/cognidev/har for later runs without the backend."; exit 2; }
[ -d node_modules/@playwright/test ] || { say "check-routes: ENVIRONMENT NOT READY — @playwright/test is not installed: npm install --save-dev @playwright/test && npx playwright install chromium"; exit 2; }
RAW=.cognidev/modernization-angular-v2/route-check.raw.json
rm -f "$RAW"
npx playwright test --config e2e/cognidev/playwright.config.ts >> "$LOG" 2>&1
RC=$?
python3 - "$RAW" .cognidev/modernization-angular-v2/route-check.json <<'PY' >> "$LOG" 2>&1
import json, sys
raw, out = sys.argv[1], sys.argv[2]
try:
    d = json.load(open(raw))
except Exception:
    json.dump({"total": 0, "passed": 0, "failed": 0, "skipped": 0, "failures": [], "note": "playwright wrote no report"}, open(out, "w"), indent=2)
    sys.exit(0)
res = {"total": 0, "passed": 0, "failed": 0, "skipped": 0, "failures": []}
def walk(suites):
    for s in suites:
        for sp in s.get("specs", []):
            for t in sp.get("tests", []):
                res["total"] += 1
                status = t.get("status") or (t.get("results") or [{}])[-1].get("status")
                if status == "skipped":
                    res["skipped"] += 1
                elif status in ("expected", "passed"):
                    res["passed"] += 1
                else:
                    res["failed"] += 1
                    err = ((t.get("results") or [{}])[-1].get("error") or {}).get("message", "")
                    res["failures"].append({"test": sp.get("title"), "error": err[:400]})
        walk(s.get("suites", []))
walk(d.get("suites", []))
json.dump(res, open(out, "w"), indent=2)
print(f"check-routes: {res['passed']} passed, {res['failed']} failed, {res['skipped']} skipped of {res['total']}")
for f in res["failures"]:
    print(f"check-routes: FAILED {f['test']} — {f['error'].splitlines()[0] if f['error'] else ''}")
PY
[ "$RC" -eq 0 ] && exit 0
exit 1
