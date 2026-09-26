"""The LLM pass over what the rules left: compile errors and names that are
undefined at run time, one call per generated unit (its .ts and .html
together). The model sees numbered windows of the new files, the problems,
and the legacy lines each lost name comes from; it answers with SEARCH/REPLACE
blocks. An edit applies only when its SEARCH text is in the file exactly once.

Every answer is cached by the hash of the files and problems it was asked
about, so a rerun after regeneration re-applies the same edits without a call.
Whether an edit is kept is decided afterwards by `check.sh` (see `keep`).

usage:
  python3 llm_fix.py ask  <web> [--limit N] [--jobs J] [--only substr]
  python3 llm_fix.py keep <web> <before-errors.json> <before-globals.json>
"""
import concurrent.futures as cf
import hashlib
import json
import os
import re
import subprocess
import sys
from collections import defaultdict

AROUND = 12
MAX_WINDOW_CHARS = 60_000
MODEL = os.environ.get("FIX_MODEL", "sonnet")

SYSTEM = """You fix an AngularJS→Angular 19 port, file by file. The Angular code was generated from the legacy AngularJS code by rules; what is listed below is what the rules left: compile errors (TypeScript and Angular template errors, strict tsconfig) and names the code reads that nothing defines at run time (they would throw a ReferenceError).

Rules:
- Keep the behaviour of the legacy code exactly. Do not refactor, rename, reformat, or improve. Change only the lines needed.
- Never comment code out and never delete behaviour to silence an error.
- Type-only fixes are preferred where they suffice: `any`, `as any`, a non-null `!`, an explicit parameter type.
- A lost name: restore it the way the legacy code had it (a local declared in the right scope, a parameter, a class member reached as this.x) — the legacy lines are given.
- An AngularJS service used as a global (qaToaster, aqHelper, $templateCache, …): at module level add `const <name>: any = legacyService('<AngularJS name>');` with `import { legacyService } from '<relative path to src/client/q-app/legacy-injector>';` and keep the code using <name>. legacyService looks the service up in the running app when first used, so it works in any class or function.
- A lost local that the legacy code declared at the factory's top level (a helper function, a constructor function used with `new`, a constant): declare it at module level in the new file, copied from the legacy lines, with parameters typed `?: any`.
- A legacy bug the port kept (a misspelt member, a switch that falls through, a duplicate key): keep the behaviour and silence it with `// @ts-expect-error legacy: <what>` on the line before (TypeScript files only).
- In a template, a member the component lacks: declare it in the class (`name: any;`) if the legacy template created it on the scope; otherwise follow the legacy code.
- Signals: inputs are signals (read as x()), models are signals (set with x.set(v)).

Answer only with blocks of this exact form, one per edit, nothing else:
FILE: <path as given>
<<<<<<< SEARCH
<exact lines from the file, copied without the line-number prefix>
=======
<replacement lines>
>>>>>>> REPLACE
If nothing can be fixed safely, answer NONE."""


def sha(*parts):
    h = hashlib.sha256()
    for p in parts:
        h.update(p.encode())
        h.update(b"\0")
    return h.hexdigest()[:24]


def windows(text, lines):
    src = text.splitlines()
    spans = sorted((max(1, l - AROUND), min(len(src), l + AROUND)) for l in lines)
    merged = []
    for a, b in spans:
        if merged and a <= merged[-1][1] + 1:
            merged[-1] = (merged[-1][0], max(merged[-1][1], b))
        else:
            merged.append((a, b))
    out = []
    for a, b in merged:
        out.append("\n".join(f"{i}| {src[i - 1]}" for i in range(a, b + 1)))
    return "\n…\n".join(out)


def legacy_context(web, unit, names):
    try:
        src = open(os.path.join(web, unit["file"])).read().splitlines()
    except OSError:
        return ""
    hits = []
    for n in sorted(names):
        rx = re.compile(r"(?<![\w$.])" + re.escape(n) + r"(?![\w$])")
        ls = [i + 1 for i, l in enumerate(src) if rx.search(l)][:4]
        hits.extend(ls)
    if not hits:
        return ""
    return f"Legacy file {unit['file']} (the lines naming {', '.join(sorted(names))}):\n" + windows("\n".join(src), hits)


def problems(web):
    o = os.path.join(web, ".cognidev/modernization-angular-v2/freehand")
    errs = json.load(open(os.path.join(o, "errors.json")))
    glob = json.load(open(os.path.join(o, "globals.json")))
    units = json.load(open(os.path.join(web, ".cognidev/modernization-angular-v2/port/units.json")))["units"]
    by_file = {}
    for u in units:
        if u.get("status") in ("written", "regenerated"):
            by_file[u["target"]] = u
            if u.get("templateTarget"):
                by_file[u["templateTarget"]] = u
    per_unit = defaultdict(lambda: {"errors": [], "lost": []})
    for e in errs:
        u = by_file.get(e["file"])
        if u:
            per_unit[u["target"]]["errors"].append(e)
    for r in glob["rows"]:
        if r["kind"] == "window":
            continue
        for at in r["at"]:
            f, line = at.rsplit(":", 1)
            u = by_file.get(f)
            if u:
                per_unit[u["target"]]["lost"].append({"file": f, "line": int(line), "name": r["name"], "kind": r["kind"]})
    return per_unit, {u["target"]: u for u in units if u.get("status") in ("written", "regenerated")}


def prompt(web, unit, p):
    files = sorted({e["file"] for e in p["errors"]} | {x["file"] for x in p["lost"]})
    parts, texts = [], {}
    for f in files:
        text = open(os.path.join(web, f)).read()
        texts[f] = text
        lines = [int(e["line"]) for e in p["errors"] if e["file"] == f] + [x["line"] for x in p["lost"] if x["file"] == f]
        parts.append(f"=== {f} (numbered lines around the problems)\n{windows(text, lines)}")
    probs = [f"- {e['file']}:{e['line']} {e['code']}: {e['message'][:300]}" for e in p["errors"]]
    seen = set()
    for x in p["lost"]:
        key = (x["file"], x["line"], x["name"])
        if key not in seen:
            seen.add(key)
            what = {"lost": "undefined at run time (nothing declares it)", "angularjs": "an AngularJS built-in used as a global", "injectable": "an AngularJS service used as a global"}[x["kind"]]
            probs.append(f"- {x['file']}:{x['line']} `{x['name']}` is {what}")
    lost_names = {x["name"] for x in p["lost"] if x["kind"] == "lost"}
    body = f"Unit: {unit['kind']} `{unit['name']}` ported from {unit['file']}\n\nProblems:\n" + "\n".join(probs) + "\n\n" + "\n\n".join(parts)
    ctx = legacy_context(web, unit, lost_names)
    if ctx:
        body += "\n\n" + ctx
    # an earlier answer for these files was reverted: say why, so this one differs
    fb_path = os.path.join(web, ".cognidev/modernization-angular-v2/freehand/llm-feedback.json")
    fb = json.load(open(fb_path)) if os.path.exists(fb_path) else {}
    notes = [fb[f] for f in files if f in fb]
    if notes:
        body += "\n\nAn earlier edit of these files was reverted because it made things worse:\n" + "\n".join(notes)
    return body[:MAX_WINDOW_CHARS * 2], texts


def call(prompt_text):
    env = {k: v for k, v in os.environ.items() if k != "CLAUDECODE"}
    try:
        # a plain completion: no tools, no MCP servers, no project context
        r = subprocess.run(["claude", "-p", "--model", MODEL, "--tools", "", "--strict-mcp-config", "--system-prompt", SYSTEM], input=prompt_text, capture_output=True, text=True, env=env, timeout=900, cwd="/tmp")
    except subprocess.TimeoutExpired:
        return ""
    return r.stdout if r.returncode == 0 else ""


PER_CALL = 30


def chunks(p):
    """A unit's problems in calls of at most PER_CALL, in line order."""
    items = [("e", e) for e in sorted(p["errors"], key=lambda e: (e["file"], int(e["line"])))] + [("l", x) for x in sorted(p["lost"], key=lambda x: (x["file"], x["line"]))]
    for i in range(0, len(items), PER_CALL):
        part = items[i:i + PER_CALL]
        yield {"errors": [x for k, x in part if k == "e"], "lost": [x for k, x in part if k == "l"]}


BLOCK = re.compile(r"FILE: (.+?)\n<<<<<<< SEARCH\n(.*?)\n=======\n(.*?)\n?>>>>>>> REPLACE", re.S)


def apply_blocks(web, reply, allowed):
    """Applies each block whose SEARCH text is in its file exactly once. Returns {file: new text}, and counts."""
    out, applied, skipped = {}, 0, 0
    for f, search, repl in BLOCK.findall(reply):
        f = f.strip()
        if f not in allowed:
            skipped += 1
            continue
        text = out.get(f) or open(os.path.join(web, f)).read()
        search = re.sub(r"^\d+\| ", "", search, flags=re.M)
        if text.count(search) != 1 or not search.strip():
            skipped += 1
            continue
        # no commenting code out
        if all(l.strip().startswith("//") or not l.strip() for l in repl.splitlines()) and any(l.strip() and not l.strip().startswith("//") for l in search.splitlines()):
            skipped += 1
            continue
        out[f] = text.replace(search, repl, 1)
        applied += 1
    return out, applied, skipped


def ask(web, limit, jobs, only):
    per_unit, units = problems(web)
    cache = os.path.join(web, ".cognidev/modernization-angular-v2/freehand/llm-cache")
    os.makedirs(cache, exist_ok=True)
    todo = [(t, c) for t, p in per_unit.items() if (not only or only in t) for c in chunks(p)]
    todo.sort(key=lambda tp: -(len(tp[1]["errors"]) + len(tp[1]["lost"])))
    log = {"units": len(todo), "cached": 0, "called": 0, "edits": 0, "skipped": 0, "files": []}

    def one(tp):
        target, p = tp
        pr, texts = prompt(web, units[target], p)
        key = sha(pr)
        path = os.path.join(cache, key + ".json")
        if os.path.exists(path):
            return target, json.load(open(path))["reply"], True, texts
        reply = call(pr)
        if reply.strip():
            json.dump({"target": target, "reply": reply, "prompt_chars": len(pr)}, open(path, "w"))
        return target, reply, False, texts

    calls = 0
    chosen = []
    for tp in todo:
        pr, _ = prompt(web, units[tp[0]], tp[1])
        cached = os.path.exists(os.path.join(cache, sha(pr) + ".json"))
        if not cached and calls >= limit:
            continue
        calls += 0 if cached else 1
        chosen.append(tp)
    with cf.ThreadPoolExecutor(max_workers=jobs) as ex:
        for target, reply, cached, texts in ex.map(one, chosen):
            log["cached" if cached else "called"] += 1
            if not reply or reply.strip() == "NONE":
                continue
            new, applied, skipped = apply_blocks(web, reply, set(texts))
            for f, t in new.items():
                b = os.path.join(web, ".cognidev/modernization-angular-v2/freehand/pre-llm", f)
                os.makedirs(os.path.dirname(b), exist_ok=True)
                if not os.path.exists(b):  # the text before the first edit of this round
                    open(b, "w").write(open(os.path.join(web, f)).read())
                open(os.path.join(web, f), "w").write(t)
                log["files"].append(f)
            log["edits"] += applied
            log["skipped"] += skipped
    json.dump(log, open(os.path.join(web, ".cognidev/modernization-angular-v2/freehand/llm-fix.json"), "w"), indent=1)
    print(json.dumps({k: v for k, v in log.items() if k != "files"}))


def keep(web, before_errors, before_globals):
    """After check.sh: a file the LLM edited is kept only if its problems fell
    (or are gone); otherwise it goes back to its pre-edit copy."""
    o = os.path.join(web, ".cognidev/modernization-angular-v2/freehand")
    log = json.load(open(os.path.join(o, "llm-fix.json")))
    backup = os.path.join(o, "pre-llm")
    def count(errs_path, glob_path):
        c = defaultdict(int)
        for e in json.load(open(errs_path)):
            c[e["file"]] += 1
        for r in json.load(open(glob_path))["rows"]:
            if r["kind"] != "window":
                for at in r["at"]:
                    c[at.rsplit(":", 1)[0]] += 1
        return c
    before = count(before_errors, before_globals)
    after = count(os.path.join(o, "errors.json"), os.path.join(o, "globals.json"))
    kept, reverted = [], []
    fb_path = os.path.join(o, "llm-feedback.json")
    fb = json.load(open(fb_path)) if os.path.exists(fb_path) else {}
    new_errors = defaultdict(list)
    for e in json.load(open(os.path.join(o, "errors.json"))):
        new_errors[e["file"]].append(f"{e['file']}:{e['line']} {e['code']}: {e['message'][:160]}")
    for f in sorted(set(log["files"])):
        if after[f] < before[f] or (after[f] == 0):
            kept.append(f)
            fb.pop(f, None)
        else:
            fb[f] = f"- {f}: problems went from {before[f]} to {after[f]}; after it: " + "; ".join(new_errors[f][:6])
            src = os.path.join(backup, f)
            if os.path.exists(src):
                open(os.path.join(web, f), "w").write(open(src).read())
            reverted.append(f)
    json.dump(fb, open(fb_path, "w"), indent=1)
    print(json.dumps({"kept": len(kept), "reverted": len(reverted), "reverted_files": reverted[:20]}))


if __name__ == "__main__":
    cmd, web = sys.argv[1], sys.argv[2]
    args = sys.argv[3:]
    opt = lambda k, d: args[args.index(k) + 1] if k in args else d
    if cmd == "ask":
        ask(web, int(opt("--limit", "1000")), int(opt("--jobs", "6")), opt("--only", ""))
    elif cmd == "keep":
        keep(web, args[0], args[1])
