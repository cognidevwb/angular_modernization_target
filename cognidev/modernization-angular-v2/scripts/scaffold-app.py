#!/usr/bin/env python3
"""
scaffold-app — DETERMINISTIC modern Angular target skeleton generator (no LLM).

Fills the Angular {target} skeleton (package.json, angular.json, tsconfig*,
standalone zoneless/zone bootstrap, app.config / app.routes / root component,
index.html, styles, .gitignore, Dockerfile) from the captured intent. No-clobber
+ idempotent: an existing file is left untouched, so for an in-place stepwise
upgrade it only adds MISSING config (real package.json is never overwritten — that
is `ng update`'s job), and for a rewrite it lays the full target skeleton.

The LLM never writes this boilerplate; the develop step only updates business code.

Usage (the lifecycle sets CW_WORKDIR + CW_PLAYBOOK_ROOT): scaffold-app.py [workspace]
"""
import json, os, re, sys

try:
    import yaml
except ImportError:
    sys.exit("scaffold-app: needs PyYAML (pip install pyyaml)")

# Per-target version pins (mid-2026). Angular major → its TS range.
TS_FOR = {22: "~6.0.0", 21: "~5.9.0", 20: "~5.8.0"}
RXJS = "~7.8.0"
NODE = "22"
VITEST = "^3.2.0"


def load_intent(ws):
    p = os.path.join(ws, ".cognidev", "intent.yml")
    try:
        doc = yaml.safe_load(open(p)) or {}
    except FileNotFoundError:
        return {}
    return doc.get("answers", doc) if isinstance(doc, dict) else {}


def pinned_node(ws, default):
    """The ONE pinned Node major — the setup-environment gate wrote it to
    .cognidev/env.json. Reading it here (not a second hard-coded constant) is
    what keeps the scaffold's Node and the build toolchain from ever drifting."""
    import json
    try:
        env = json.load(open(os.path.join(ws, ".cognidev", "env.json")))
        return str(env.get("node") or default)
    except Exception:
        return default


def kebab(s):
    s = re.sub(r"[^A-Za-z0-9]+", "-", s.strip()).strip("-").lower()
    return s or "angular-app"


def titleize(s):
    parts = [p for p in re.split(r"[^A-Za-z0-9]+", s) if p]
    return " ".join(p.capitalize() for p in parts) or "Angular App"


def render(text, vars):
    for k, v in vars.items():
        text = text.replace("{{" + k + "}}", v)
    return text


# AngularJS itself and the libraries that only exist as AngularJS modules: the
# port replaces them (Angular Material, the Angular Router, ngx-translate …).
ANGULARJS_ONLY = re.compile(
    r"^(angular|angular-.*|@uirouter/angularjs|ng[A-Z].*|ng-.*|ngreact|ngclipboard|oclazyload|"
    r"md-.*|mdPickers|material-steppers|v-accordion|@flowjs/ng-flow|ngFlowchart)$"
)


# The Angular package that takes over from an AngularJS-only library the
# legacy app uses: the port writes against these.
REPLACEMENTS = {
    "angular-material": {"@angular/material": "{ng}", "@angular/cdk": "{ng}"},
    "angular-translate": {"@ngx-translate/core": "^18.0.0", "@ngx-translate/http-loader": "^18.0.0"},
}


def app_dir_of(ws):
    """The folder under src/ the Angular app is written to: the briefing's
    modern root (src/app, or src/app-ng when the legacy app already sits in
    src/app)."""
    try:
        a = json.load(open(os.path.join(ws, ".cognidev", "understand", "angular-assessment.json")))
        root = a["briefing"]["conformance"]["modern_root"]
    except (OSError, ValueError, KeyError, TypeError):
        root = ""
    return root[len("src/"):] if root.startswith("src/") and root != "src/" else "app"


def merged_manifest(angular, legacy):
    """The Angular manifest, plus the legacy runtime dependencies that are not
    AngularJS. The legacy build (webpack, babel …) is not carried: the Angular
    CLI builds the target."""
    deps = dict(angular.get("dependencies", {}))
    ng = deps.get("@angular/core", "")
    for legacy_name, packages in REPLACEMENTS.items():
        if legacy_name in (legacy.get("dependencies") or {}):
            for name, version in packages.items():
                deps[name] = version.replace("{ng}", ng)
    for name, version in (legacy.get("dependencies") or {}).items():
        if not ANGULARJS_ONLY.match(name) and name not in deps:
            deps[name] = version
    angular["dependencies"] = dict(sorted(deps.items()))
    angular["name"] = legacy.get("name") or angular.get("name")
    angular["version"] = legacy.get("version") or angular.get("version")
    return json.dumps(angular, indent=2) + "\n"


def rewrite_tsconfig(text):
    """The ported code is the legacy JavaScript, typed `any` where it was
    untyped: TypeScript's strict family is adopted file by file afterwards,
    not in the port. CommonJS packages (jquery, moment …) are default-imported
    as the legacy bundler did. The Angular template checks stay strict."""
    body = "\n".join(l for l in text.splitlines() if not l.lstrip().startswith("/*"))
    cfg = json.loads(body)
    co = cfg["compilerOptions"]
    co.update({"strict": False, "noImplicitAny": False, "noPropertyAccessFromIndexSignature": False,
               "noImplicitReturns": False, "esModuleInterop": True, "allowSyntheticDefaultImports": True,
               "allowJs": False})
    return "/* Angular rewrite of an AngularJS app: legacy JavaScript ported as TypeScript (strict adopted afterwards). */\n" + json.dumps(cfg, indent=2) + "\n"


def main():
    ws = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.environ.get("CW_WORKDIR") or ".")
    playbook_root = os.path.abspath(
        os.environ.get("CW_PLAYBOOK_ROOT") or os.path.join(os.path.dirname(__file__), "..")
    )
    tpl_root = os.path.join(playbook_root, "scaffolds", "app")

    # The skeleton is the target for an app that has none. A hybrid, or an
    # Angular app on an older major, already has its app: laying a second
    # `src/app` beside it would be a second application, not a migration.
    gen_path = os.path.join(ws, ".cognidev", "angular", "generation.json")
    try:
        with open(gen_path, encoding="utf-8") as f:
            band = str(json.load(f).get("band") or "")
    except (OSError, ValueError):
        band = ""
    if not band:
        # V2 has no detect step: the structural intelligence's flavor says it.
        try:
            flavor = json.load(open(os.path.join(ws, ".cognidev", "understand", "angular.json"))).get("flavor", "")
        except (OSError, ValueError):
            flavor = ""
        band = {"angularjs": "angularjs", "hybrid": "hybrid", "angular": "angular-current"}.get(flavor, "")
    if band == "hybrid" or band.startswith("angular-"):
        print(f"scaffold-app: an Angular app already exists (band {band}) — the target is in place; nothing scaffolded")
        return 0

    intent = load_intent(ws)
    try:
        target = int(str(intent.get("target_version") or 22))
    except ValueError:
        target = 22
    if target not in TS_FOR:
        target = 22

    idioms = intent.get("adopt_idioms") or []
    if isinstance(idioms, str):
        idioms = [idioms]
    zoneless = "zoneless" in idioms  # default OFF — zoneless is adopted LAST

    styling = str(intent.get("styling") or "scss")
    style_ext = "scss" if styling == "scss" else "css"  # tailwind uses css/postcss

    name_src = intent.get("app_name") or os.path.basename(ws)
    app_name = titleize(name_src)
    package_name = kebab(name_src)

    if zoneless:
        cd = {
            "cd_import": "provideZonelessChangeDetection",
            "cd_provider": "provideZonelessChangeDetection()",
            "cd_comment": "zoneless change detection (OnPush is the default)",
            "zone_dep": "",
            "polyfills": "",
        }
    else:
        cd = {
            "cd_import": "provideZoneChangeDetection",
            "cd_provider": "provideZoneChangeDetection({ eventCoalescing: true })",
            "cd_comment": "zone-based change detection (zoneless is adopted last)",
            "zone_dep": ',\n    "zone.js": "~0.15.0"',
            "polyfills": '"zone.js"',
        }

    vars = {
        "app_name": app_name,
        "package_name": package_name,
        "angular_version": f"^{target}.0.0",
        "angular_major": str(target),
        "typescript_version": TS_FOR[target],
        "node_version": pinned_node(ws, NODE),
        "rxjs_version": RXJS,
        "vitest_version": VITEST,
        "style_ext": style_ext,
        **cd,
    }

    vars["app_dir"] = app_dir_of(ws)

    # A pure AngularJS app (no Angular yet) is rewritten beside itself: its
    # manifest becomes the Angular workspace's, keeping every runtime library
    # that is not AngularJS, so the ported code still finds jQuery, moment…
    legacy_manifest = None
    if band.startswith("angularjs"):
        try:
            legacy_manifest = json.load(open(os.path.join(ws, "package.json")))
        except (OSError, ValueError):
            legacy_manifest = None

    created, skipped = [], []
    for root, _dirs, files in os.walk(tpl_root):
        for name in files:
            src = os.path.join(root, name)
            rel = render(os.path.relpath(src, tpl_root), vars)  # {{style_ext}} in paths
            dest = os.path.join(ws, rel)
            # the legacy page (ng-app, script tags) is the old app's; the new
            # one boots from <app-root>
            replaces_legacy = legacy_manifest is not None and rel in ("package.json", os.path.join("src", "index.html"))
            if os.path.exists(dest) and not replaces_legacy:
                skipped.append(rel)
                continue
            os.makedirs(os.path.dirname(dest), exist_ok=True)
            text = render(open(src).read(), vars)
            if rel == "package.json" and legacy_manifest is not None:
                text = merged_manifest(json.loads(text), legacy_manifest)
            if rel == "tsconfig.json" and legacy_manifest is not None:
                text = rewrite_tsconfig(text)
            with open(dest, "w") as f:
                f.write(text)
            created.append(rel)

    cd_mode = "zoneless" if zoneless else "zone-based"
    print(
        f"scaffold-app: Angular {target} target · TS {TS_FOR[target]} · Node {vars['node_version']} · "
        f"{style_ext} · {cd_mode} → {len(created)} file(s) written, {len(skipped)} kept (no-clobber)"
    )
    for c in sorted(created):
        print(f"  + {c}")


if __name__ == "__main__":
    main()
