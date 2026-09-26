# Tasks — slice `home.widgets-bundles.widget-types.widget-type`

Units in S3 order; tasks in the order they run.

## 49. `WidgetEditorController` (angularjs controller) — 3 tasks

`src/app/widget/index.js`

**T49.1** · create — Create Angular component `WidgetEditorComponent` for the screen that AngularJS controller `WidgetEditorController` drives.

- Source: `src/app/widget/index.js` L40
- Target: `src/app/widget/index.ts`
- Now: `WidgetEditorController` is registered at src/app/widget/index.js:40 with `angular.module('thingsboard.widget-library').controller(…)`.
- After: `src/app/widget/index.ts` exports `WidgetEditorComponent`; no AngularJS registration of `WidgetEditorController` remains.
- Done by: code · Checked by: `WidgetEditorComponent` is exported from `src/app/widget/index.ts`; `.controller('WidgetEditorController'` is absent; the project compiles

**T49.2** · add_bridge — Add a bridge so AngularJS `home.widgets-bundles.widget-types.widget-type` can keep using `WidgetEditorComponent` until they are migrated.

- Target: ``
- Now: `home.widgets-bundles.widget-types.widget-type` use AngularJS `WidgetEditorController`; no bridge to `WidgetEditorComponent` exists.
- After: AngularJS name `WidgetEditorController` is registered as `downgradeComponent(WidgetEditorComponent)`; `home.widgets-bundles.widget-types.widget-type` still work.
- Done by: code · Checked by: the registration is present; the screens of `home.widgets-bundles.widget-types.widget-type` still render

**T49.3** · check — Check `WidgetEditorComponent`: it compiles and behaves as before.

- Target: `src/app/widget/index.ts`
- Now: `WidgetEditorController` still runs as AngularJS.
- After: `WidgetEditorComponent` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches; the `home.widgets-bundles.widget-types.widget-type` page renders


## 50. `home.widgets-bundles.widget-types.widget-type` (route ui-router) — 3 tasks

`src/app/widget/widget-library.routes.js`

**T50.1** · change — Change route `home.widgets-bundles.widget-types.widget-type` from a ui-router state to an Angular Router route.

- Source: `src/app/widget/widget-library.routes.js` L68
- Target: `the Angular route table`
- Now: ui-router state `home.widgets-bundles.widget-types.widget-type` is defined at src/app/widget/widget-library.routes.js:68.
- After: An Angular `Routes` entry for `home.widgets-bundles.widget-types.widget-type` shows the same view; the ui-router state is gone.
- Done by: code · Checked by: the `home.widgets-bundles.widget-types.widget-type` page renders; `.state('home.widgets-bundles.widget-types.widget-type'` is absent

**T50.2** · remove_bridge — Remove the bridge for `WidgetEditorComponent`: `home.widgets-bundles.widget-types.widget-type` was its last AngularJS user.

- Target: ``
- Now: AngularJS name `WidgetEditorController` is bridged to `WidgetEditorComponent`.
- After: No bridge registration for `WidgetEditorController` remains.
- Done by: code · Checked by: no registration of `WidgetEditorController` in ``; the project compiles

**T50.3** · check — Check route `home.widgets-bundles.widget-types.widget-type`: it compiles and behaves as before.

- Target: `src/app/widget/widget-library.routes.ts`
- Now: `home.widgets-bundles.widget-types.widget-type` still runs as AngularJS.
- After: route `home.widgets-bundles.widget-types.widget-type` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches

