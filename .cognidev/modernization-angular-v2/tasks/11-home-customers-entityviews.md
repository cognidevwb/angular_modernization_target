# Tasks — slice `home.customers.entityViews`

Units in S3 order; tasks in the order they run.

## 19. `home.customers.entityViews` (route ui-router) — 2 tasks

`src/app/entity-view/entity-view.routes.js`

**T19.1** · change — Change route `home.customers.entityViews` from a ui-router state to an Angular Router route.

- Source: `src/app/entity-view/entity-view.routes.js` L48
- Target: `the Angular route table`
- Now: ui-router state `home.customers.entityViews` is defined at src/app/entity-view/entity-view.routes.js:48.
- After: An Angular `Routes` entry for `home.customers.entityViews` shows the same view; the ui-router state is gone.
- Done by: code · Checked by: the `home.customers.entityViews` page renders; `.state('home.customers.entityViews'` is absent

**T19.2** · check — Check route `home.customers.entityViews`: it compiles and behaves as before.

- Target: `src/app/entity-view/entity-view.routes.ts`
- Now: `home.customers.entityViews` still runs as AngularJS.
- After: route `home.customers.entityViews` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches

