# Tasks — slice `home.customers.assets`

Units in S3 order; tasks in the order they run.

## 15. `home.customers.assets` (route ui-router) — 3 tasks

`src/app/asset/asset.routes.js`

**T15.1** · change — Change route `home.customers.assets` from a ui-router state to an Angular Router route.

- Source: `src/app/asset/asset.routes.js` L48
- Target: `the Angular route table`
- Now: ui-router state `home.customers.assets` is defined at src/app/asset/asset.routes.js:48.
- After: An Angular `Routes` entry for `home.customers.assets` shows the same view; the ui-router state is gone.
- Done by: code · Checked by: the `home.customers.assets` page renders; `.state('home.customers.assets'` is absent

**T15.2** · remove_bridge — Remove the bridge for `AssetComponent`: `home.customers.assets` was its last AngularJS user.

- Target: ``
- Now: AngularJS name `AssetController` is bridged to `AssetComponent`.
- After: No bridge registration for `AssetController` remains.
- Done by: code · Checked by: no registration of `AssetController` in ``; the project compiles

**T15.3** · check — Check route `home.customers.assets`: it compiles and behaves as before.

- Target: `src/app/asset/asset.routes.ts`
- Now: `home.customers.assets` still runs as AngularJS.
- After: route `home.customers.assets` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches

