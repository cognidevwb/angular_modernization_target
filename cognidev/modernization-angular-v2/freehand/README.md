# Freehand run to a production target

The steps the playbook will take over later, runnable today. From the web
folder of a migrated app (S0–S6 done):

    freehand/run-all.sh <web> <legacy-copy>     # everything, repeatable
    freehand/check.sh <web> [--no-regen]         # S6 + S6b + compile + bundle + runtime globals
    freehand/fix-round.sh <web> --no-regen       # one LLM round (cached by prompt hash)

| Tool | What it proves |
|---|---|
| `check.sh` → `ng-diagnostics.mjs` | every TS and template error of the generated code (ngc hides template errors while any TS error exists) |
| `check.sh` → webpack | every generated file bundles |
| `globals-audit.mjs` | every name read as a global exists at run time (the legacy page's globals, from `probe.mjs`) |
| `llm_fix.py` / `fix-round.sh` | the long tail, one call per unit; a file's edits kept only if its problems fell |
| `tools/cutover` | the ported code in charge: services downgraded, components behind AngularJS wrappers with the legacy bindings, route controllers replaced |
| `probe.mjs` | the built app boots in a browser; errors, API calls, globals |
| `render.mjs` + `render_compare.py` | every component rendered through its legacy markup, old app next to new; a component clean before must be clean after |

Outputs: `<web>/.cognidev/modernization-angular-v2/freehand/` (`summary.json`,
`errors.json`, `globals.json`, `llm-cache/`, `probe-*.json`, `render-*.json`).
The runtime tools need `playwright-core` outside the repo (`FREEHAND_NODE`,
default `~/Downloads/awb-v2-testbed/.freehand-node`) and a cached Chromium.
