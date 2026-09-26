# Tasks — slice `home.customers.dashboards`

Units in S3 order; tasks in the order they run.

## 16. `home.customers.dashboards` (route ui-router) — 2 tasks

`src/app/dashboard/dashboard.routes.js`

**T16.1** · change — Change route `home.customers.dashboards` from a ui-router state to an Angular Router route.

- Source: `src/app/dashboard/dashboard.routes.js` L47
- Target: `the Angular route table`
- Now: ui-router state `home.customers.dashboards` is defined at src/app/dashboard/dashboard.routes.js:47.
- After: An Angular `Routes` entry for `home.customers.dashboards` shows the same view; the ui-router state is gone.
- Done by: code · Checked by: the `home.customers.dashboards` page renders; `.state('home.customers.dashboards'` is absent

**T16.2** · check — Check route `home.customers.dashboards`: it compiles and behaves as before.

- Target: `src/app/dashboard/dashboard.routes.ts`
- Now: `home.customers.dashboards` still runs as AngularJS.
- After: route `home.customers.dashboards` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches

