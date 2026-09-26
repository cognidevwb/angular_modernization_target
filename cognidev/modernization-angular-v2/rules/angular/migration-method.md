# Migration method — how to choose and sequence the path

The path is decided by the DETECTED starting generation
(`.cognidev/angular/generation.json`) and the chosen `migration_strategy`. Apply
these in order; never guess the start — read the detector.

## 0. Establish the starting point (deterministic)
The detector classifies the app into one of four bands and recommends a path:

| Band | Signal | Path |
|------|--------|------|
| **AngularJS 1.x** | `angular` `~1.x` in package.json/bower.json, `ng-app`, `.module()`, `$scope`, no `@angular/core` | **rewrite** or **hybrid** (not `ng update`-able) |
| **Angular 2–8** | `@angular/core` `2–8`, `NgModule`, `SystemJS`/early CLI, RxJS 5/6 | stepwise `ng update`, large gaps — budget for RxJS 6→7, Ivy (v9), View Engine removal |
| **Angular 9–15** | `@angular/core` `9–15`, Ivy, `NgModule`-based | stepwise `ng update` 9→…→22 + idiom schematics |
| **Angular 16–21** | `@angular/core` `16–21`, standalone/signals partially present | finish the jump to 22 + adopt remaining idioms |

## 1. AngularJS 1.x → Angular (rewrite vs hybrid)
AngularJS and Angular are different frameworks. Two supported routes:

- **Hybrid (incremental, `@angular/upgrade` UpgradeModule)** — run AngularJS and
  Angular side by side; migrate component-by-component and service-by-service.
  Bootstrap the hybrid, `downgradeComponent`/`upgradeProvider` at the seams,
  strangle the AngularJS app leaf-first. Best for large/business-critical apps
  (6–18 months). Order: shared services first (they're easiest to share via DI),
  then leaf components, then routes (`$routeProvider`/UI-Router → Angular Router),
  the root shell last.
- **Rewrite (greenfield target)** — stand up a fresh Angular 22 app
  (the deterministic scaffold) and port screens into it behind a feature flag /
  reverse proxy. Best for small apps or where a feature freeze is acceptable
  (weeks–months).

Mechanical mapping (both routes): `.controller`+`$scope` → standalone component
with signals; `.service`/`.factory` → injectable class (`inject()`); `.directive`
→ component or attribute directive; `$http` → `HttpClient`; `$q` → Promises/RxJS;
`ng-repeat`/`ng-if` → `@for`/`@if`; `$routeProvider`/UI-Router → Angular Router
with lazy `loadComponent`; filters → pipes; two-way `ng-model` → `model()` /
reactive (signal) forms. Put an **anti-corruption layer** at each seam so the new
model isn't polluted by `$scope` shapes.

## 2. Angular 2–21 → 22 (stepwise `ng update`)
- **One major at a time** — the CLI enforces it: `ng update @angular/core@N+1
  @angular/cli@N+1`, build green, commit, repeat to 22. Do NOT jump majors.
- **Cross every known cliff:** RxJS 6→7 (v13-ish), Ivy default (v9) + View Engine
  removal (v13), `HttpClientModule` → `provideHttpClient` (v15+), strict templates,
  Node/TS bumps each step. The detector flags which cliffs apply.
- **Run the migration schematics after the relevant jump** (v17+), in this order:
  1. `control-flow-migration` — `*ngIf/*ngFor/*ngSwitch` → `@if/@for/@switch`.
  2. `standalone` — its 3 steps IN ORDER: convert all → remove NgModules → bootstrap.
  3. `inject` — constructor DI → `inject()`.
  4. `signal-input-migration`, `signal-queries-migration`, `output-migration`.
  5. `cleanup-unused-imports`, `self-closing-tags-migration`, `route-lazy-loading`.
- **Go zoneless last** — once standalone + OnPush-clean, add
  `provideZonelessChangeDetection()` and remove `zone.js` from polyfills. Verify
  no code relied on Zone's implicit change detection (timers, manual DOM events).

## 3. Sequence every path the same shape (strangler order)
Leaf-first, dependencies before dependents, build green per step:
**config/bootstrap → shared services → leaf components → feature components →
routes/shells → templates (control flow) → forms → tests → zoneless cutover.**
Encode it in `depends_on` so tasks run in order.

## 4. Honest limits
- Static analysis under-resolves on heavy AngularJS DI / dynamic `$injector`
  usage and runtime-built templates. Flag low-confidence component boundaries
  rather than asserting them.
- A version jump that crosses RxJS or Ivy cliffs may need manual operator/import
  fixes the schematics can't do — surface them as explicit tasks, don't hide them.
