# Target Angular architecture — pinned reference (mid-2026)

The migration MUST converge on this stack. Where a pin is marked **[verify]**,
confirm the exact patch on npm / the official release page before locking it —
the major is settled, the trailing patch drifts.

## The release & support picture (June 2026)
- **Angular 22** — current stable (GA 2026-06-03). Active support → Dec 2026, LTS → May 2028.
- **Angular 21** — LTS → May 2027. **Angular 20** — LTS → Nov 2026.
- **Angular 19 and older are UNSUPPORTED** (19 LTS ended 2026-05-19). AngularJS
  (1.x) has been EOL since Jan 2022.
- **Golden rule:** get to a *supported* version first, THEN adopt modern idioms.
  Combining a version jump with an idiom rewrite in one step is the #1 cause of
  failed Angular migrations.

## Target stack — pin these
- **@angular/* 22.x** (`^22.0.0`) — core, common, compiler, router, forms,
  platform-browser, etc. **@angular/cli 22.x** + **@angular/build 22.x** (the
  esbuild/Vite `application` builder; the Webpack builder is legacy).
- **TypeScript 6.0.x** (`~6.0.0`) — Angular 22 requires TS 6 (5.9 and below dropped).
- **Node.js 22 LTS** minimum (Node 20 dropped; Node 26 supported). `engines.node >= 22`.
- **RxJS ~7.8.0** — still first-class; coexists with signals (don't rip it out wholesale).
- **zone.js — OMIT for new/zoneless apps.** Angular 22 `ng new` is **zoneless by
  default**; keep zone.js ONLY while a hybrid still needs it, then remove it from
  polyfills to shrink the bundle.
- **Test runner: Vitest** (`@angular/build:unit-test`) — Karma/Jasmine is removed
  from new projects. **Playwright** for e2e.
- **Package manager:** npm / pnpm (pnpm preferred for monorepos).

## The 2026 idioms the target adopts (in this order)
1. **Standalone everything** — no `NgModule`. Components/directives/pipes are
   `standalone` (the default since v19; mandatory mindset in v22). Bootstrap with
   `bootstrapApplication(App, appConfig)`.
2. **Built-in control flow** — `@if` / `@for` (with mandatory `track`) / `@switch`
   in templates. `*ngIf` / `*ngFor` / `*ngSwitch` are migrated away.
3. **Signals-first state** — `signal()`, `computed()`, `effect()`,
   `linkedSignal()`; **signal inputs** `input()` / `input.required()`, **outputs**
   `output()`, two-way `model()`, and **signal queries** (`viewChild`,
   `contentChild`). **Signal Forms** are stable in v22 for new forms.
4. **`inject()` over constructor DI** — function injection; better types, works
   with the standalone migrations.
5. **Zoneless change detection** — `provideZonelessChangeDetection()`;
   **`ChangeDetectionStrategy.OnPush` is the default in v22**. Remove `zone.js`
   from polyfills once zoneless.
6. **Lazy routes** — `loadComponent` / `loadChildren` with the standalone Router;
   `provideRouter(routes, withComponentInputBinding())`.
7. **SSR/hydration when needed** — `@angular/ssr`, `provideClientHydration(withIncrementalHydration())`.
8. **selectorless components** (v22, opt-in) — import components directly in
   templates; adopt only on greenfield/leaf surfaces, not as a migration step.

## Hard rules for the plan
1. **One major at a time.** `ng update @angular/core@N+1 @angular/cli@N+1` for each
   step from the detected version up to 22; never skip a major. Run the bundled
   migration schematics after each jump.
2. **Schematics do the mechanical work** — prefer them over hand edits:
   `@angular/core:control-flow-migration`, `@angular/core:standalone` (run its 3
   steps IN ORDER: convert → remove NgModules → bootstrap), `@angular/core:inject`,
   `@angular/core:signal-input-migration`, `@angular/core:signal-queries-migration`,
   `@angular/core:output-migration`, `@angular/core:cleanup-unused-imports`,
   `@angular/core:self-closing-tags-migration`, `@angular/core:route-lazy-loading`.
3. **AngularJS 1.x is NOT `ng update`-able** — it's a rewrite or a hybrid
   (`@angular/upgrade` `UpgradeModule`). Choose per `migration_strategy`.
4. **Build must stay green** every step — `tsc --noEmit` / `ng build`. A red build
   blocks the next task.
5. **Pin every version** the plan names; carry **[verify]** flags forward.
