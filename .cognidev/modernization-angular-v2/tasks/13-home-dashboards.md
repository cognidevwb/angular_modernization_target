# Tasks — slice `home.dashboards`

Units in S3 order; tasks in the order they run.

## 21. `home.dashboards` (route ui-router) — 3 tasks

`src/app/dashboard/dashboard.routes.js`

**T21.1** · change — Change route `home.dashboards` from a ui-router state to an Angular Router route.

- Source: `src/app/dashboard/dashboard.routes.js` L26
- Target: `the Angular route table`
- Now: ui-router state `home.dashboards` is defined at src/app/dashboard/dashboard.routes.js:26.
- After: An Angular `Routes` entry for `home.dashboards` shows the same view; the ui-router state is gone.
- Done by: code · Checked by: the `home.dashboards` page renders; `.state('home.dashboards'` is absent

**T21.2** · remove_bridge — Remove the bridge for `DashboardsComponent`: `home.dashboards` was its last AngularJS user.

- Target: ``
- Now: AngularJS name `DashboardsController` is bridged to `DashboardsComponent`.
- After: No bridge registration for `DashboardsController` remains.
- Done by: code · Checked by: no registration of `DashboardsController` in ``; the project compiles

**T21.3** · check — Check route `home.dashboards`: it compiles and behaves as before.

- Target: `src/app/dashboard/dashboard.routes.ts`
- Now: `home.dashboards` still runs as AngularJS.
- After: route `home.dashboards` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches

