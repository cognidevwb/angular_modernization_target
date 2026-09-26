# Tasks — slice `home.entityViews`

Units in S3 order; tasks in the order they run.

## 24. `home.entityViews` (route ui-router) — 3 tasks

`src/app/entity-view/entity-view.routes.js`

**T24.1** · change — Change route `home.entityViews` from a ui-router state to an Angular Router route.

- Source: `src/app/entity-view/entity-view.routes.js` L25
- Target: `the Angular route table`
- Now: ui-router state `home.entityViews` is defined at src/app/entity-view/entity-view.routes.js:25.
- After: An Angular `Routes` entry for `home.entityViews` shows the same view; the ui-router state is gone.
- Done by: code · Checked by: the `home.entityViews` page renders; `.state('home.entityViews'` is absent

**T24.2** · remove_bridge — Remove the bridge for `EntityViewComponent`: `home.entityViews` was its last AngularJS user.

- Target: ``
- Now: AngularJS name `EntityViewController` is bridged to `EntityViewComponent`.
- After: No bridge registration for `EntityViewController` remains.
- Done by: code · Checked by: no registration of `EntityViewController` in ``; the project compiles

**T24.3** · check — Check route `home.entityViews`: it compiles and behaves as before.

- Target: `src/app/entity-view/entity-view.routes.ts`
- Now: `home.entityViews` still runs as AngularJS.
- After: route `home.entityViews` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches

