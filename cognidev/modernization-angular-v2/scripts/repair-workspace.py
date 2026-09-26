#!/usr/bin/env python3
"""repair-workspace — angular.json's build target pointed at files that exist.

`ng update` runs its migrations over the files the build target names: its
`tsConfig`, and the sources under `sourceRoot`. A workspace whose entries were
left behind by a custom bundler (AWB: `browser: src/main.ts` while the real
entries are `main.ts`, `admin-main.ts`, `runner-main.ts` at the root) makes the
migrations run over nothing, silently. This points each missing entry at the
one file that answers to it, and lists the rest for a reader.

A list entry — `styles`, `scripts`, `assets` — is different: there is no one
file that answers to a stylesheet, and `ng build` stops on the first one it
cannot resolve (AWB: `styles: ["src/styles.scss"]` with no such file anywhere in
the repository, at the baseline as much as after the port). A named file that
does not exist contributes nothing to the bundle, so dropping it takes nothing
out of the build; the entry is recorded so a reader can put it back if the file
was meant to be added. CW_DRY_RUN=1
prints and writes nothing. Exit 0 always: what it could not decide is on
record in .cognidev/modernization-angular-v2/workspace-repair.json.
"""
import json
import os
import sys

ws = sys.argv[1] if len(sys.argv) > 1 else os.environ.get("CW_WORKDIR", ".")
# angular.json is read from the app; the record belongs to the WORKSPACE, which
# is where the playbook declares it (scope: workspace). Writing it beside
# angular.json instead put it in Web/.cognidev on every repo whose app is a
# subfolder, and the step reported a missing declared output it had written.
root = sys.argv[2] if len(sys.argv) > 2 else ws
dry = os.environ.get("CW_DRY_RUN") == "1"
path = os.path.join(ws, "angular.json")
rec = {"changed": [], "todo": [], "workspace": os.path.exists(path)}


def exists(rel):
    return bool(rel) and os.path.exists(os.path.join(ws, rel))


def one_of(cands):
    found = [c for c in cands if exists(c)]
    return found[0] if len(found) >= 1 else None


def write_record():
    out = os.path.join(root, ".cognidev", "modernization-angular-v2", "workspace-repair.json")
    if not dry:
        os.makedirs(os.path.dirname(out), exist_ok=True)
        with open(out, "w") as f:
            json.dump(rec, f, indent=2)


if not os.path.exists(path):
    print("repair-workspace: no angular.json — this is not a CLI workspace; `ng update` needs one, so the upgrade steps stop as ENVIRONMENT NOT READY until a person adds it (ng new --create-application=false, then a project pointing at the entries)")
    rec["todo"].append("no angular.json: add a CLI workspace before the upgrade steps")
    write_record()
    sys.exit(0)

with open(path) as f:
    ws_json = json.load(f)

for name, project in (ws_json.get("projects") or {}).items():
    build = (project.get("architect") or project.get("targets") or {}).get("build") or {}
    opts = build.get("options") or {}
    main_key = "browser" if "browser" in opts else "main"
    main = opts.get(main_key)
    if main and not exists(main):
        pick = one_of(["main.ts", "src/main.ts", "src/main.tsx"])
        if pick:
            opts[main_key] = pick
            rec["changed"].append(f"{name}: {main_key} {main} → {pick}")
            src_root = project.get("sourceRoot")
            if src_root and not os.path.isdir(os.path.join(ws, src_root)):
                new_root = os.path.dirname(pick) or "."
                project["sourceRoot"] = new_root
                rec["changed"].append(f"{name}: sourceRoot {src_root} → {new_root}")
        else:
            rec["todo"].append(f"{name}: {main_key} {main} is missing and no main.ts answers to it; name the entry")
    ts = opts.get("tsConfig")
    if ts and not exists(ts):
        pick = one_of(["tsconfig.app.json", "tsconfig.json"])
        if pick:
            opts["tsConfig"] = pick
            rec["changed"].append(f"{name}: tsConfig {ts} → {pick}")
        else:
            rec["todo"].append(f"{name}: tsConfig {ts} is missing and no tsconfig at the root; the migrations would see no files")
    for key in ("styles", "scripts", "assets"):
        entries = opts.get(key)
        if not isinstance(entries, list):
            continue
        keep, dropped = [], []
        for e in entries:
            # A string is the path; an object names it under `input`.
            rel = e.get("input") if isinstance(e, dict) else e
            if isinstance(rel, str) and rel and not rel.startswith("node_modules/") and not exists(rel):
                dropped.append(rel)
            else:
                keep.append(e)
        if dropped:
            opts[key] = keep
            rec["changed"].append(f"{name}: {key} dropped {', '.join(dropped)} — named but not in the repository, so nothing was in the bundle to lose")
    index = opts.get("index")
    if index and not exists(index):
        pick = one_of(["index.html", "src/index.html"])
        if pick:
            opts["index"] = pick
            rec["changed"].append(f"{name}: index {index} → {pick}")
        else:
            rec["todo"].append(f"{name}: index {index} is missing; `ng build` needs one, `ng update` does not")

if rec["changed"] and not dry:
    with open(path, "w") as f:
        json.dump(ws_json, f, indent=2)
        f.write("\n")
for c in rec["changed"]:
    print(f"repair-workspace: {'would set' if dry else 'set'} {c}")
for t in rec["todo"]:
    print(f"repair-workspace: TODO {t}")
if not rec["changed"] and not rec["todo"]:
    print("repair-workspace: every build entry exists; nothing to repair")
write_record()
