"""Old vs new, component by component: a component the legacy app renders
without an error (apart from a missing backend) must render so in the new one.
usage: render_compare.py <render-legacy.json> <render-new.json>"""
import json, re, sys
BACKEND = re.compile(r"404|Failed to load resource|unhandled rejection|request failed|Http failure")
def verdicts(path):
    return {r["name"]: all(BACKEND.search(e) for e in r["errors"]) for r in json.load(open(path))["results"]}, {r["name"]: r for r in json.load(open(path))["results"]}
old, _ = verdicts(sys.argv[1])
new, rows = verdicts(sys.argv[2])
regressed = [n for n, ok in old.items() if ok and not new.get(n, False)]
fixed = [n for n, ok in old.items() if not ok and new.get(n, False)]
both = [n for n, ok in old.items() if not ok and not new.get(n, False)]
out = {"legacy_clean": sum(old.values()), "new_clean": sum(new.values()), "regressed": len(regressed), "clean_now_not_before": len(fixed), "fail_in_both": len(both)}
json.dump({"summary": out, "regressed": [{"name": n, "errors": rows[n]["errors"][:3]} for n in regressed]}, open(sys.argv[2].replace(".json", "-compare.json"), "w"), indent=1)
print(json.dumps(out))
for n in regressed[:15]:
    print("  regressed:", n, "|", (rows[n]["errors"] or [""])[0][:160])
