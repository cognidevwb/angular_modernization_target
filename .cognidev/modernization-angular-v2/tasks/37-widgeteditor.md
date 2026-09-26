# Tasks — slice `widgetEditor`

Units in S3 order; tasks in the order they run.

## 60. `widgetEditor` (route ui-router) — 3 tasks

`src/app/widget/widget-library.routes.js`

**T60.1** · change — Change route `widgetEditor` from a ui-router state to an Angular Router route.

- Source: `src/app/widget/widget-library.routes.js` L90
- Target: `the Angular route table`
- Now: ui-router state `widgetEditor` is defined at src/app/widget/widget-library.routes.js:90.
- After: An Angular `Routes` entry for `widgetEditor` shows the same view; the ui-router state is gone.
- Done by: code · Checked by: the `widgetEditor` page renders; `.state('widgetEditor'` is absent

**T60.2** · remove_bridge — Remove the bridge for `DashboardComponent`: `widgetEditor` was its last AngularJS user.

- Target: ``
- Now: AngularJS name `DashboardController` is bridged to `DashboardComponent`.
- After: No bridge registration for `DashboardController` remains.
- Done by: code · Checked by: no registration of `DashboardController` in ``; the project compiles

**T60.3** · check — Check route `widgetEditor`: it compiles and behaves as before.

- Target: `src/app/widget/widget-library.routes.ts`
- Now: `widgetEditor` still runs as AngularJS.
- After: route `widgetEditor` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches

