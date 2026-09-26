# modernization-angular-v2

Bring any Angular-family app up to the **current supported release (Angular 22)** —
precisely, on the shared plan → tasks → develop → verify spine.

This is an **analyzer + planner + generator**. It does not blindly rewrite. A
deterministic detector reads `package.json` / `angular.json` / `bower.json` to pin
the starting generation and recommend the path; the LLM makes ONE grounded
planning call (structural shards + the detected generation in, a structured
`plan.json` out: the ordered migration steps, files to add/modify, idiom
adoptions); a deterministic scaffolder lays the modern Angular 22 target skeleton;
and each task is generated, BUILD-gated, and committed on `target-master`.

It handles the full spectrum people actually have:

- **AngularJS 1.x** (EOL) → hybrid (`@angular/upgrade` ngUpgrade) or rewrite.
- **A hybrid already running AngularJS and Angular together** behind
  `@angular/upgrade` → the briefing grades the migrated half and ranks the legacy
  routes; each run plans the one step that is next — the router hand-over while
  no Angular Router is wired under the modern root, the fix-forward files while
  any remain, else the next batch of legacy routes in the ranked order — and
  when the legacy router is empty, removes the bridge and steps the app to 22.
  "Hybrid" is a state the detector reports, not a separate playbook.
- **Angular 2–8 / 9–15** → stepwise `ng update` (one major at a time) across the
  RxJS / Ivy / HttpClient cliffs, then the idiom schematics.
- **Angular 16–21** → finish the jump to 22 + adopt standalone, control flow,
  signals, zoneless.

**Golden rule it enforces:** get to a *supported* version first, then modernize
idioms — never combine a version jump with a rewrite in one step.

## Lifecycle (what actually runs)

```
capture          questionnaire → .cognidev/intent.yml
detect-version   detect-version.sh → .cognidev/angular/generation.json (band, version, strategy, cliffs)
understand       structural-js → .cognidev/understand/angular.json (both halves, routes, closures, bridge)
briefing         assess-angular → ANGULAR-ASSESSMENT.md + .cognidev/understand/angular-assessment.json
plan-context     feature-plan → .cognidev/feature/context.md (the planner's input map) + request.md (this run's step, read off the briefing)
plan-migration   LLM (review-gated, own_schema) → .cognidev/feature/plan.json
scaffold-app     scaffold-app.sh → DETERMINISTIC modern Angular 22 skeleton (no LLM)
plan-apply       feature-plan → checks the plan (a modify of a missing file is dropped; a hand-over is held to the briefing's files), then new dirs + empty business-file stubs
plan-tasks       engine (review-gated) → ordered tasks.json + mapping.json
wire-router      wire-router → the router hand-over as a syntax-tree edit (no model, no packages); its tasks recorded done
idioms           scan-idioms → every AngularJS idiom the repo uses matched against idioms.yaml and the repo's own idioms.local.yaml: what has no decision yet is written there as pending; then what the port rewrites / notes / leaves for a decision → IDIOM-COVERAGE.md + idioms.json (no model). scaffold-units stops as NOT CATALOGUED while an entry is pending.
scaffold-units   scaffold-units → one Angular file per AngularJS registration under feature/<area>/, its body ported by syntax tree (fields, methods, signals, platform calls; legacy prototype and window additions declared once), a TODO(port) line where there is no equivalent + PORT-LEDGER.md (no model)
develop          ng-develop → per-batch edit → build (typecheck.sh, the project's own build command) → commit
compare-units    compare-units → every old unit against its new unit by structure (bindings, injections, members, template) → unit-compare.json + UNIT-COMPARE.md + VALIDATION-REPORT.html (no model)
flip-route       flip-route → the ported batch's screens move to the Angular Router: route entry, outlet shim in the legacy state, originals deleted (no model); stops as NOT PORTED until the batch is ported and NOT EQUIVALENT until it matches
understand-after structural-js again → the shard as the tree is now
ledger-after     assess-angular --ledger-only → ledger-after.json (routes legacy/moved/modern, legacy units) for the sign-off
remove-angularjs remove-angularjs → once nothing renders on AngularJS: bootstrap collapsed, bridge cut, legacy root deleted, packages dropped; refuses on record otherwise (no model)
repair-workspace scripts/repair-workspace.sh → angular.json's build target pointed at the files that exist, so `ng update` sees the code
upgrade-20/21/22 scripts/upgrade-major.sh N → one `ng update` per major, the build after each; waits its turn, waits for the removal, NOT READY without Node/workspace
check-request    check-request → request-result.json: did the run do the one step its request named (no model)
validate         scripts/validate.sh → production build → lint → audit (fails closed without a toolchain)
check-routes     scripts/check-routes.sh → one Playwright test per route with a URL against the running app (CW_APP_URL, CW_APP_STORAGE_STATE, CW_ROUTE_PARAMS; CW_RECORD=1 records); NOT READY without them
report           report-migration → docs/MIGRATION-REPORT.html (the tree tagged legacy / modern / bridge on the left, this run's diff on the right)
signoff          signoff-report → docs/SIGNOFF-REPORT.html + .cognidev/run/signoff.json (every claim against its artifact)
inventory        compare-units again → docs/VALIDATION-REPORT.html: the inventory checklist, one joined row per unit (old · new · difference · status · TODOs), grouped by folder
doc-pages        docs-pages → docs/cognidev/derived.json: this run as documentation pages — Migration, Validation, Sign-off, Status and next steps — in the documentation cycle's own page shape (no HTML, no model)
docs             the documentation cycle (`kind: docs`) → docs/: the same generator the Understand tab's Documentation lens runs, over the structural shards, plus the pages above — one cross-linked site
finalize         git-finalize → the git strategy chosen up front; adopting strategies need a signed-off run
```

## What you get to read

One folder: **`docs/`**, written by the documentation cycle — the same
generator the Understand tab's Documentation lens runs, so what you read on
disk is what the product shows.

| In the site | What it answers |
|---|---|
| Overview | What this system is: stack, size, the contents of the rest. |
| Use cases · Reading guide | What it does, and where to start reading. |
| Architecture · Domains · Types · Sequences | Its shape, in diagrams. |
| API · Data · Data access · Insights | Its surfaces, its data, what the graph says. |
| Dependencies · State · Files | The inventory. |
| **Migration** | What the application was, what it is now, and the one step this run took. |
| **Validation** | Every AngularJS unit beside the Angular unit that replaces it. |
| **Sign-off** | Every claim this playbook makes, against its evidence. |
| **Status and next steps** | The run step by step, what is not done, and what closes each of those. |

The first block is generated from the shards; the last four are this run's own,
written by `docs-pages` into `docs/cognidev/derived.json` and rendered by the
same cycle into the same rail. Three deep pages sit beside the site for the
row-by-row detail a page cannot hold — `MIGRATION-REPORT.html` (every file,
with its diff), `VALIDATION-REPORT.html` (every unit, with both files' source)
and `SIGNOFF-REPORT.html` — each linking back to it.

Plus `ANGULAR-ASSESSMENT.md`, `IDIOM-COVERAGE.md`, `PORT-LEDGER.md`,
`UNIT-COMPARE.md` and `GIT-FINALIZE-REPORT.md` at the repository root. No page
in any of it is written by a model.

## Scaffolding — deterministic, never the LLM

`scripts/scaffold-app.py` (the `scaffold-app` phase) generates and **fills** the
modern Angular 22 skeleton from the captured intent: `package.json` (Angular 22 /
TypeScript 6 / Node 22), `angular.json` (the `@angular/build:application` builder),
`tsconfig*`, the **standalone** `bootstrapApplication` entry, `app.config.ts`
(zoneless or zone-based per `adopt_idioms`), `app.routes.ts`, the OnPush root
component, `index.html`, styles (scss/css), `.gitignore`, `Dockerfile`. No-clobber
+ idempotent — so for a stepwise in-place upgrade it only adds MISSING config (your
real `package.json` is never overwritten; `ng update` owns that), and for a rewrite
it lays the full target. Templates live in `scaffolds/app/`.

Consequence: the LLM **only updates business files** (components, services,
templates, forms, routes) — it never writes build/config boilerplate.

## Validation — static analysis, not just compilation

Two tiers, both standard tools with **published rulesets**:

- **Per task cycle** (`scripts/typecheck.sh`): `ng build`/`tsc` (compile, hard
  gate) **+ ESLint (`angular-eslint` recommended) on the files the batch changed**
  — so a coding-standard violation is caught the moment it's written, scoped to
  the batch (the develop tool passes `CW_BATCH_FILES`). Lint *errors* fail the
  batch; warnings are reported.
- **Final pipeline** (`scripts/validate.sh`, the `validate` phase): step-by-step
  **① build → ② lint (coding standard) → ③ security (`npm audit`, high+critical
  CVEs)** — each a named tool with a clear PASS / FAIL / SKIP and a summary.

The published ruleset is scaffolded: `eslint.config.js` adopts
`typescript-eslint` + `angular-eslint` recommended (plus a few critical
error-level upgrades), and the dev deps are pinned in `package.json`.

Honest framing: criticals fail (build break, lint errors, high/critical CVEs);
style warnings are reported, not fatal; every step degrades to **SKIP** without a
toolchain (never a false red). This checks **hygiene** — it does not certify
behavioural parity with the legacy app. That's what tests are for, and migrating
tests is part of the plan.

## Develop loop — grouped batches, gated per batch (vendored, playbook-owned)

The develop step runs `tools/develop` (`ng-develop`) — this playbook's **own**
build of the loop, not a shared binary. It takes the flat per-file plan and
regroups it into small **(feature × layer) batches** (≤3 files), in dependency
order (`models → services → components → routing`). The model does bulk work over
a few related files at once; the gate fires **once per batch**, and **never after
a non-source batch** (a `.sql`/`.yml` write is committed without a compile).
`CW_DRY_PLAN=1 ng-develop` prints the batch plan with no model calls.

## Build environment — proven before any token is spent

`scripts/setup-environment.sh` (the `setup-environment` gate, before any LLM
phase) proves the Node/Angular toolchain — Docker (preferred, `node:<ver>`) or a
validated host Node — and **hard-stops** with instructions if neither can be made
ready. It derives the **one pinned Node version** from the target Angular version
and writes `.cognidev/env.json`, the single source the scaffold + both gates read
(so the toolchain that builds and the Node the scaffold pins never drift).

## Target reference

The pinned mid-2026 target stack is in `rules/angular/target-architecture-2026.md`
(Angular 22 / TS 6 / Node 22, standalone, signals, zoneless, control flow); the
path-selection method in `rules/angular/migration-method.md`; the modern
component/service shape in `rules/angular/angular-conventions.md`.

## Grounding — the planner reads real Angular structure

Two deterministic signals ground the plan:

- **`detect-version`** pins the *path* — the whole strategy branches on the
  detected band (AngularJS / 2–8 / 9–15 / 16–21), and that's tested across fixtures.
- **`structural-js` `angular.rs`** emits an `angular.json` shard that
  `feature-plan` folds into `context.md`: the Angular 2+ **components** (selector,
  standalone, constructor-DI flag, template kind), **services** (`providedIn`),
  **NgModules**, plus **AngularJS** `.controller`/`.service`/`.factory`/`.directive`
  units and `$scope` usage — and **modernization counts** (NgModules, non-standalone
  components, constructor DI, `*ngIf/*ngFor`, `@Input/@Output`, `HttpClientModule`)
  that drive the plan. The standalone flag is resolved against the real `@NgModule`
  `declarations:` — a legacy NgModule-declared component reads `standalone:false`,
  so the planner sees the actual migration surface, not a version-default guess.

So boundary recovery is grounded in the app's real component/service inventory and
its legacy-pattern load. Honest caveat: external `.html` templates aren't parsed
(only inline `template:` strings), so `*ngIf/*ngFor` counts cover inline templates;
flag low-confidence component boundaries on heavy dynamic-`$injector` AngularJS.

## Self-test

See `SELFTEST.md` — the detector is exercised across AngularJS / Angular 7 / 16 / 22
fixtures, and the scaffolder across the zone-based and zoneless variants.
