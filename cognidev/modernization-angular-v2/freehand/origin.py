"""For each app error in probe-new.json, where it was thrown (from PROBE_DEBUG's pauses).
usage: origin.py <probe.json>"""
import json, re, sys
r = json.load(open(sys.argv[1]))
for e in r["consoleErrors"] + r["pageErrors"]:
    m = re.search(r"injectable '(\w+)': (.+?)\n", e) or re.search(r"(Error|TypeError|ReferenceError): (.+?)\n", e)
    if not m or "404" in e or "monaco" in e:
        continue
    msg = m.group(2)
    hit = next((t for t in r.get("thrown", []) if msg[:60] in t["description"]), None)
    print("ERROR:", m.group(0).strip()[:200])
    if hit:
        print("  thrown at:", *hit["frames"][:5], sep="\n    ")
