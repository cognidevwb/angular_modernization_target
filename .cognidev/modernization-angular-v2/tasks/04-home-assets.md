# Tasks — slice `home.assets`

Units in S3 order; tasks in the order they run.

## 10. `home.assets` (route ui-router) — 2 tasks

`src/app/asset/asset.routes.js`

**T10.1** · change — Change route `home.assets` from a ui-router state to an Angular Router route.

- Source: `src/app/asset/asset.routes.js` L25
- Target: `the Angular route table`
- Now: ui-router state `home.assets` is defined at src/app/asset/asset.routes.js:25.
- After: An Angular `Routes` entry for `home.assets` shows the same view; the ui-router state is gone.
- Done by: code · Checked by: the `home.assets` page renders; `.state('home.assets'` is absent

**T10.2** · check — Check route `home.assets`: it compiles and behaves as before.

- Target: `src/app/asset/asset.routes.ts`
- Now: `home.assets` still runs as AngularJS.
- After: route `home.assets` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches

