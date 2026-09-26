#!/usr/bin/env python3
"""
detect-version — DETERMINISTIC Angular generation detector (no LLM).

Reads package.json / bower.json / angular.json / .angular-cli.json to classify the
app into a generation band, pin the current Angular major, recommend a migration
path, and list the known upgrade "cliffs" between here and the target. Writes
`.cognidev/angular/generation.json` — the single most important grounding fact for
the planner, since the whole path branches on it.

Usage (the lifecycle sets CW_WORKDIR): detect-version.py [workspace]
"""
import json, os, re, sys

TARGET_DEFAULT = 22


def read_json(path):
    try:
        with open(path) as f:
            return json.load(f)
    except (FileNotFoundError, ValueError):
        return None


def semver_major(spec):
    """First major number from a range like ^16.2.0 / ~1.7.9 / >=15 / 2.0.0-rc."""
    if not isinstance(spec, str):
        return None
    m = re.search(r"(\d+)", spec.lstrip("^~>=<v "))
    return int(m.group(1)) if m else None


def dep(pkg, name):
    for sect in ("dependencies", "devDependencies", "peerDependencies"):
        v = (pkg.get(sect) or {}).get(name) if pkg else None
        if v:
            return v
    return None


def band_for(major):
    if major is None:
        return None
    if major <= 8:
        return "angular-2-8"
    if major <= 15:
        return "angular-9-15"
    if major <= 21:
        return "angular-16-21"
    return "angular-22-plus"


def cliffs_between(major, target):
    """Known breaking cliffs crossed going from `major` up to `target`."""
    out = []
    if major is None:
        return out
    if major < 9:
        out.append("ivy-default-v9 + view-engine-removal-v13")
    if major < 13:
        out.append("rxjs-6-to-7")
    if major < 15:
        out.append("http-providers (HttpClientModule → provideHttpClient)")
    if major < 17:
        out.append("control-flow + standalone-default + esbuild-builder")
    if major < 20:
        out.append("zoneless-stable (v20.2)")
    if major < target:
        out.append(f"typescript + node bumps each step (→ TS 6 / Node 22 at v22)")
    return out


# Directories that never hold the app's own manifest.
SKIP_DIRS = {
    "node_modules", "bower_components", "vendor", "dist", "build", "out",
    "target", "coverage", "tmp",
}


def declares_angular(d):
    """True when directory `d` declares Angular or AngularJS ITSELF — its own
    manifest, not a parent's. Same signals `detect` reads below."""
    if os.path.isfile(os.path.join(d, "angular.json")) or os.path.isfile(
        os.path.join(d, ".angular-cli.json")
    ):
        return True
    pkg = read_json(os.path.join(d, "package.json"))
    if pkg and (dep(pkg, "@angular/core") or semver_major(dep(pkg, "angular")) == 1):
        return True
    bower = read_json(os.path.join(d, "bower.json"))
    return bool(bower and semver_major(dep(bower, "angular")) == 1)


def app_root(ws, depth=2):
    """The nearest directory that declares Angular: the workspace, else a child,
    breadth-first to `depth`.

    A repository is not always its app. AWB is a Java estate whose Angular app is
    `Web/`, and reading only the workspace root reported `band=unknown` with
    "no Angular signal found" on a repo holding an Angular 19 application — the
    one fact the whole path branches on, wrong. The IDE's own Angular check walks
    two levels for the same reason. Returns the workspace when nothing declares
    Angular anywhere, so the caller still reports what IS at the root.
    """
    level = [ws]
    for _ in range(depth + 1):
        for d in level:
            if declares_angular(d):
                return d
        nxt = []
        for d in level:
            try:
                entries = sorted(os.scandir(d), key=lambda e: e.name)
            except OSError:
                continue
            for e in entries:
                if e.is_dir(follow_symlinks=False) and not e.name.startswith(".") and e.name not in SKIP_DIRS:
                    nxt.append(e.path)
        if not nxt:
            break
        level = nxt
    return ws


def detect(ws):
    pkg = read_json(os.path.join(ws, "package.json"))
    bower = read_json(os.path.join(ws, "bower.json"))
    has_angular_json = os.path.isfile(os.path.join(ws, "angular.json"))
    has_old_cli = os.path.isfile(os.path.join(ws, ".angular-cli.json"))
    has_systemjs = os.path.isfile(os.path.join(ws, "system.config.js")) or os.path.isfile(
        os.path.join(ws, "systemjs.config.js")
    )

    core = dep(pkg, "@angular/core") if pkg else None
    core_major = semver_major(core)

    # AngularJS 1.x: `angular` (NOT @angular/core) at ~1.x, in package.json or bower.
    ng1 = dep(pkg, "angular") if pkg else None
    ng1 = ng1 or (dep(bower, "angular") if bower else None)
    ng1_major = semver_major(ng1)
    is_angularjs = core_major is None and ng1_major == 1
    # Both at once: AngularJS 1.x hosting (or hosted by) Angular N behind
    # @angular/upgrade. Not a stepwise app — the legacy half has to be
    # strangled out first — and not a rewrite either: the modern half exists.
    upgrade = dep(pkg, "@angular/upgrade") if pkg else None
    is_hybrid = core_major is not None and ng1_major == 1

    evidence = []
    if core:
        evidence.append(f"@angular/core {core}")
    if ng1 and not core:
        evidence.append(f"angular {ng1} (AngularJS)")
    if is_hybrid:
        evidence.append(f"angular {ng1} (AngularJS) beside @angular/core {core}")
        if upgrade:
            evidence.append(f"@angular/upgrade {upgrade} (the ngUpgrade bridge)")
    if has_angular_json:
        evidence.append("angular.json")
    if has_old_cli:
        evidence.append(".angular-cli.json (Angular 2–5 CLI)")
    if has_systemjs:
        evidence.append("system.config.js (Angular 2 SystemJS)")
    if bower is not None:
        evidence.append("bower.json")

    target = TARGET_DEFAULT
    if is_hybrid:
        band = "hybrid"
        version = core
        strategy = "strangle-then-stepwise"
        cliffs = ["angularjs-removal (finish the strangle: every legacy route, then the bridge and UpgradeModule)"] + cliffs_between(core_major, target)
    elif is_angularjs:
        band = "angularjs-1x"
        version = ng1 or "1.x"
        strategy = "hybrid"  # safer default; rewrite is the alternative
        cliffs = ["framework-rewrite (AngularJS → Angular; not ng-update-able)"]
    elif core_major is not None:
        band = band_for(core_major)
        version = core
        strategy = "stepwise" if core_major < target else "current"
        cliffs = cliffs_between(core_major, target)
    else:
        band = "unknown"
        version = None
        strategy = "unknown"
        cliffs = []

    return {
        "spec_version": 1,
        "band": band,
        "angular_version": version,
        "angular_major": core_major if not is_angularjs else 1,
        "angularjs_version": ng1 if (is_angularjs or is_hybrid) else None,
        "hybrid": is_hybrid,
        "target_version": target,
        "recommended_strategy": strategy,
        "cliffs": cliffs,
        "evidence": evidence,
        "uses_angular_cli": has_angular_json or has_old_cli,
    }


def main():
    ws = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.environ.get("CW_WORKDIR") or ".")
    root = app_root(ws)
    result = detect(root)
    # Where the manifests were read from, relative to the workspace — "." when
    # the workspace is the app. Every later step needs this to find the app.
    result["app_root"] = os.path.relpath(root, ws)
    out_dir = os.path.join(ws, ".cognidev", "angular")
    os.makedirs(out_dir, exist_ok=True)
    with open(os.path.join(out_dir, "generation.json"), "w") as f:
        json.dump(result, f, indent=2, sort_keys=True)

    print(
        f"detect-version: band={result['band']} "
        f"version={result['angular_version'] or '(unknown)'} → target {result['target_version']} · "
        f"strategy={result['recommended_strategy']}"
        + (f" · app={result['app_root']}" if result["app_root"] != "." else "")
    )
    if result["evidence"]:
        print("  evidence: " + ", ".join(result["evidence"]))
    if result["cliffs"]:
        print("  cliffs: " + "; ".join(result["cliffs"]))
    if result["band"] in ("unknown",):
        print("  note: no Angular signal found in this folder or two levels below it — confirm this is an Angular app.")


if __name__ == "__main__":
    main()
