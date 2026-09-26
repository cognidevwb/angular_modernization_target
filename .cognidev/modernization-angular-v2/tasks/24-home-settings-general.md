# Tasks — slice `home.settings.general`

Units in S3 order; tasks in the order they run.

## 38. `home.settings.general` (route ui-router) — 2 tasks

`src/app/admin/admin.routes.js`

**T38.1** · change — Change route `home.settings.general` from a ui-router state to an Angular Router route.

- Source: `src/app/admin/admin.routes.js` L36
- Target: `the Angular route table`
- Now: ui-router state `home.settings.general` is defined at src/app/admin/admin.routes.js:36.
- After: An Angular `Routes` entry for `home.settings.general` shows the same view; the ui-router state is gone.
- Done by: code · Checked by: the `home.settings.general` page renders; `.state('home.settings.general'` is absent

**T38.2** · check — Check route `home.settings.general`: it compiles and behaves as before.

- Target: `src/app/admin/admin.routes.ts`
- Now: `home.settings.general` still runs as AngularJS.
- After: route `home.settings.general` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches

