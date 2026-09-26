# modernization-angular-v2 — self-test

A deterministic, network-free, Node-free self-test of the two LLM-free tools that
ground this playbook, plus manifest/questionnaire validity.

```bash
cd playbooks-v2/modernization-angular-v2
bash selftest.sh        # exit 0 only if every check passes
```

## What it covers (27 checks)

**`detect-version` — classifies each real starting point**
- AngularJS 1.x (via `bower.json`) → band `angularjs-1x`, strategy `hybrid`.
- Angular 7 → band `angular-2-8`, strategy `stepwise`, flags the RxJS / Ivy /
  HttpClient / control-flow / zoneless cliffs.
- Angular 12 → band `angular-9-15`; Angular 18 → band `angular-16-21`.
- Angular 22 → strategy `current` (already on target).

**`scaffold-app` — the deterministic Angular 22 target skeleton**
- `package.json` / `angular.json` are valid JSON; pins `@angular/core ^22`,
  `typescript ~6`, the `@angular/build:application` builder, standalone
  `bootstrapApplication`.
- zone-based default ships `zone.js`; the zoneless variant emits
  `provideZonelessChangeDetection()` and drops `zone.js`.
- styling choice drives the style extension; no unsubstituted `{{vars}}`;
  re-running is idempotent (no-clobber).

**Manifest + questionnaire**
- `playbook.yaml`, `brownfield.json`, and every `questionnaire/*.yaml` parse.
- The full question flow validates against a complete answers file
  (`tools/questionnaire-flow/validate.py`).

## Fixtures

The script generates throwaway fixtures under a `mktemp` dir (cleaned on exit):
five `package.json`/`bower.json` shapes for the detector and two intent files for
the scaffolder. No fixtures are committed.

## Not covered here (needs a real toolchain)
- `ng build` green — requires Node 22 + `npm install`; run `scripts/verify.sh`
  inside a generated app on a Node 22 box.
- `playbook_validate.py check` — the LLM-backed rubric check (needs the `claude`
  CLI on PATH).
