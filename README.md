# angular_modernization_target — the same application on Angular 22 (target)

The target side of an AngularJS → Angular modernization. The source is
[`angular_modernization_source`](https://github.com/cognidevwb/angular_modernization_source):
the **ThingsBoard 2.5 web UI**, AngularJS 1.5.8. This repository is that
application rewritten as a plain **Angular 22** app. AngularJS is gone: no
`angular` package, no hybrid bootstrap, no `$injector`.

- **Upstream of the source:** [thingsboard/thingsboard](https://github.com/thingsboard/thingsboard),
  branch `release-2.5`, folder `ui/`. **License:** Apache License 2.0 (see `LICENSE`),
  Copyright © 2016-2020 The ThingsBoard Authors. The rewrite keeps that license.
- **History:** the first commits are the source as it was; every later commit is a
  step of the modernization (`git log`).

## Source → target

| | Source | Target |
|---|---|---|
| Framework | AngularJS 1.5.8 | Angular 22.2 (standalone components, zone change detection) |
| UI library | AngularJS Material 1.1 | Angular Material 22 (+ CDK) |
| Router | ui-router 0.3 (36 states) | Angular Router (35 lazily loaded routes, `src/app/app.routes.ts`) |
| i18n | angular-translate (+ MessageFormat) | ngx-translate 18 with the same locale files; plurals via MessageFormat |
| HTTP | `$http` + a global interceptor | `HttpClient` + a functional interceptor (`src/app/core/auth.interceptor.ts`) |
| Forms | `ng-model` directives with `require: 'ngModel'` | Angular forms; those directives are `ControlValueAccessor`s |
| Build | webpack 4, Babel | Angular CLI (`@angular/build`, esbuild) |
| Code | 255 registrations, 65.5k lines JS, 16k lines HTML | 297 TypeScript files (56k lines), 153 templates (12k lines) |

The 255 AngularJS registrations became 197 components, 17 directives, 43
injectable services and 9 pipes. Plain JavaScript libraries the application
already had (the widget libraries, gauges, maps, `subscription.js`) are kept as
they were, in `src/app/legacy-lib/`.

## How it was produced

With the CogniDev Workbench playbook **Modernize Angular V2**
(`modernization-angular-v2`) in its rewrite mode. The playbook's reports are in
`docs/modernization/`.

1. **Understand**: the structural intelligence of the source: every module,
   registration, template, route and dependency (`.cognidev/understand/`).
2. **Decide and order**: what needs migrating, classified with Jev, ordered by route
   slice (`CANDIDATES.md`, `CLASSIFICATION.md`, `ORDER.md`).
3. **Idioms**: every AngularJS API use matched against the idiom catalog
   (`docs/modernization/IDIOM-COVERAGE.md`); the repo's own decisions are in
   `.cognidev/modernization-angular-v2/idioms.local.yaml` (e.g. `$translate` → `TranslateService`).
4. **Workspace**: the Angular 22 workspace, the route table from the ui-router states,
   and the legacy page's assets, styles and translations carried over.
5. **Port by rules**: one Angular file per registration, by syntax tree, with no model.
   This covers classes, inputs and outputs, injections, bodies, templates, and
   AngularJS Material → Angular Material (`docs/modernization/PORT-LEDGER.md`).
   Compile errors across the generated code went from 4,818 to 2,000 with rules alone.
6. **Model on the residue**: gap filling one file at a time, then compile-and-runtime
   rounds. A file's edits were kept only when its problems fell. Large components
   (the entity grid, the widget runtime, the dashboard, the rule chain canvas)
   were finished component by component.
7. **Verify**: 0 TypeScript/template errors; a runtime-residue audit finds no
   AngularJS left in live code; then the app was run against a real backend,
   side by side with the original.

## Verification

Both UIs were driven by the same Playwright script against a ThingsBoard 2.5.6
backend (`thingsboard/tb-postgres:2.5.6`, demo data, tenant administrator): log in,
then open 13 screens (home, devices, assets, entity views, customers, customer users,
dashboards, a dashboard with live widgets, widget bundles, rule chains, the root rule
chain, audit logs, profile). A second script clicks through: device details and the
Attributes tab, the Add Device dialog, and a widget bundle.

| | Legacy (AngularJS) | Target (Angular 22) |
|---|---|---|
| Login | lands on `/home` | lands on `/home` |
| 13 screens: page errors / console errors / failed API calls | 0 / 0 / 0 | 0 / 0 / 0 |
| 8 interaction steps | pass | pass |

The results and screenshots of both runs are in `docs/modernization/runtime-compare/`
(`legacy/*.png` beside `new/*.png`).

## Run it

```bash
docker run -d --name tb25 -p 9090:9090 -e TB_QUEUE_TYPE=in-memory thingsboard/tb-postgres:2.5.6
npm install --legacy-peer-deps
npm start          # ng serve on :4200, /api proxied to :9090 (proxy.conf.json)
```

Sign in as `tenant@thingsboard.org` / `tenant`. `npm run build` builds for production
(`dist/`).

## Known gaps

What is not like the original yet:

- **Server-side AngularJS markup.** About 28 of the system widget types stored in the
  ThingsBoard database are written in AngularJS template markup (the GPIO panels,
  input widgets, the RPC button). They render their template as static HTML. The
  chart, gauge, map, table and card widgets work.
- **Rule node configuration forms.** ThingsBoard 2.5 serves these as an AngularJS
  bundle; the node details show a JSON editor for the configuration instead.
- **Widget action dialog.** The target-dashboard-state autocomplete in that dialog is
  not ported yet.
- **Adding a widget type from inside a bundle** is untested.
- **Visual differences.** Small ones only: Angular Material's paginator, header
  alignment in tables, checkbox offsets.
- **Transitional helpers** that keep behaviour exact are in `src/app/core/`:
  `$q`/`$timeout` on Promises, `NgModelController`, `RootState` for `$rootScope`,
  `state-paths.ts` for ui-router state names. They are plain TypeScript, and
  candidates for idiomatic rewrites (Observables, signals, typed forms).
- **TypeScript strictness.** `strict` is off: the port keeps JavaScript's types.
