# Tasks — slice `foundation`

Units in S3 order; tasks in the order they run.

## 1. `DashboardController` (angularjs controller) — 3 tasks

`src/app/dashboard/index.js`

**T1.1** · create — Create Angular component `DashboardComponent` for the screen that AngularJS controller `DashboardController` drives.

- Source: `src/app/dashboard/index.js` L50
- Target: `src/app/dashboard/index.ts`
- Now: `DashboardController` is registered at src/app/dashboard/index.js:50 with `angular.module('thingsboard.dashboard').controller(…)`.
- After: `src/app/dashboard/index.ts` exports `DashboardComponent`; no AngularJS registration of `DashboardController` remains.
- Done by: code · Checked by: `DashboardComponent` is exported from `src/app/dashboard/index.ts`; `.controller('DashboardController'` is absent; the project compiles

**T1.2** · add_bridge — Add a bridge so AngularJS `dashboard`, `home.customers.dashboards.dashboard`, `home.dashboards.dashboard` and 1 more can keep using `DashboardComponent` until they are migrated.

- Target: ``
- Now: `dashboard`, `home.customers.dashboards.dashboard`, `home.dashboards.dashboard` and 1 more use AngularJS `DashboardController`; no bridge to `DashboardComponent` exists.
- After: AngularJS name `DashboardController` is registered as `downgradeComponent(DashboardComponent)`; `dashboard`, `home.customers.dashboards.dashboard`, `home.dashboards.dashboard` and 1 more still work.
- Done by: code · Checked by: the registration is present; the screens of `dashboard`, `home.customers.dashboards.dashboard`, `home.dashboards.dashboard` and 1 more still render

**T1.3** · check — Check `DashboardComponent`: it compiles and behaves as before.

- Target: `src/app/dashboard/index.ts`
- Now: `DashboardController` still runs as AngularJS.
- After: `DashboardComponent` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches; the `dashboard` page renders

