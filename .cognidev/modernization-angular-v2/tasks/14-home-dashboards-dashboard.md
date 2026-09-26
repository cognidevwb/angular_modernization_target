# Tasks — slice `home.dashboards.dashboard`

Units in S3 order; tasks in the order they run.

## 22. `home.dashboards.dashboard` (route ui-router) — 2 tasks

`src/app/dashboard/dashboard.routes.js`

**T22.1** · change — Change route `home.dashboards.dashboard` from a ui-router state to an Angular Router route.

- Source: `src/app/dashboard/dashboard.routes.js` L68
- Target: `the Angular route table`
- Now: ui-router state `home.dashboards.dashboard` is defined at src/app/dashboard/dashboard.routes.js:68.
- After: An Angular `Routes` entry for `home.dashboards.dashboard` shows the same view; the ui-router state is gone.
- Done by: code · Checked by: the `home.dashboards.dashboard` page renders; `.state('home.dashboards.dashboard'` is absent

**T22.2** · check — Check route `home.dashboards.dashboard`: it compiles and behaves as before.

- Target: `src/app/dashboard/dashboard.routes.ts`
- Now: `home.dashboards.dashboard` still runs as AngularJS.
- After: route `home.dashboards.dashboard` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches

