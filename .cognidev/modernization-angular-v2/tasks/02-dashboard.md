# Tasks — slice `dashboard`

Units in S3 order; tasks in the order they run.

## 2. `dashboard` (route ui-router) — 2 tasks

`src/app/dashboard/dashboard.routes.js`

**T2.1** · change — Change route `dashboard` from a ui-router state to an Angular Router route.

- Source: `src/app/dashboard/dashboard.routes.js` L89
- Target: `the Angular route table`
- Now: ui-router state `dashboard` is defined at src/app/dashboard/dashboard.routes.js:89.
- After: An Angular `Routes` entry for `dashboard` shows the same view; the ui-router state is gone.
- Done by: code · Checked by: the `dashboard` page renders; `.state('dashboard'` is absent

**T2.2** · check — Check route `dashboard`: it compiles and behaves as before.

- Target: `src/app/dashboard/dashboard.routes.ts`
- Now: `dashboard` still runs as AngularJS.
- After: route `dashboard` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches

