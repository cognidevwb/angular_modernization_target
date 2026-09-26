# Tasks — slice `home.customers.dashboards.dashboard`

Units in S3 order; tasks in the order they run.

## 17. `home.customers.dashboards.dashboard` (route ui-router) — 2 tasks

`src/app/dashboard/dashboard.routes.js`

**T17.1** · change — Change route `home.customers.dashboards.dashboard` from a ui-router state to an Angular Router route.

- Source: `src/app/dashboard/dashboard.routes.js` L107
- Target: `the Angular route table`
- Now: ui-router state `home.customers.dashboards.dashboard` is defined at src/app/dashboard/dashboard.routes.js:107.
- After: An Angular `Routes` entry for `home.customers.dashboards.dashboard` shows the same view; the ui-router state is gone.
- Done by: code · Checked by: the `home.customers.dashboards.dashboard` page renders; `.state('home.customers.dashboards.dashboard'` is absent

**T17.2** · check — Check route `home.customers.dashboards.dashboard`: it compiles and behaves as before.

- Target: `src/app/dashboard/dashboard.routes.ts`
- Now: `home.customers.dashboards.dashboard` still runs as AngularJS.
- After: route `home.customers.dashboards.dashboard` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches

