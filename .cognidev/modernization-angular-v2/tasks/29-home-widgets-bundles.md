# Tasks — slice `home.widgets-bundles`

Units in S3 order; tasks in the order they run.

## 45. `WidgetsBundleController` (angularjs controller) — 3 tasks

`src/app/widget/index.js`

**T45.1** · create — Create Angular component `WidgetsBundleComponent` for the screen that AngularJS controller `WidgetsBundleController` drives.

- Source: `src/app/widget/index.js` L40
- Target: `src/app/widget/index.ts`
- Now: `WidgetsBundleController` is registered at src/app/widget/index.js:40 with `angular.module('thingsboard.widget-library').controller(…)`.
- After: `src/app/widget/index.ts` exports `WidgetsBundleComponent`; no AngularJS registration of `WidgetsBundleController` remains.
- Done by: code · Checked by: `WidgetsBundleComponent` is exported from `src/app/widget/index.ts`; `.controller('WidgetsBundleController'` is absent; the project compiles

**T45.2** · add_bridge — Add a bridge so AngularJS `home.widgets-bundles` can keep using `WidgetsBundleComponent` until they are migrated.

- Target: ``
- Now: `home.widgets-bundles` use AngularJS `WidgetsBundleController`; no bridge to `WidgetsBundleComponent` exists.
- After: AngularJS name `WidgetsBundleController` is registered as `downgradeComponent(WidgetsBundleComponent)`; `home.widgets-bundles` still work.
- Done by: code · Checked by: the registration is present; the screens of `home.widgets-bundles` still render

**T45.3** · check — Check `WidgetsBundleComponent`: it compiles and behaves as before.

- Target: `src/app/widget/index.ts`
- Now: `WidgetsBundleController` still runs as AngularJS.
- After: `WidgetsBundleComponent` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches; the `home.widgets-bundles` page renders


## 46. `home.widgets-bundles` (route ui-router) — 3 tasks

`src/app/widget/widget-library.routes.js`

**T46.1** · change — Change route `home.widgets-bundles` from a ui-router state to an Angular Router route.

- Source: `src/app/widget/widget-library.routes.js` L28
- Target: `the Angular route table`
- Now: ui-router state `home.widgets-bundles` is defined at src/app/widget/widget-library.routes.js:28.
- After: An Angular `Routes` entry for `home.widgets-bundles` shows the same view; the ui-router state is gone.
- Done by: code · Checked by: the `home.widgets-bundles` page renders; `.state('home.widgets-bundles'` is absent

**T46.2** · remove_bridge — Remove the bridge for `WidgetsBundleComponent`: `home.widgets-bundles` was its last AngularJS user.

- Target: ``
- Now: AngularJS name `WidgetsBundleController` is bridged to `WidgetsBundleComponent`.
- After: No bridge registration for `WidgetsBundleController` remains.
- Done by: code · Checked by: no registration of `WidgetsBundleController` in ``; the project compiles

**T46.3** · check — Check route `home.widgets-bundles`: it compiles and behaves as before.

- Target: `src/app/widget/widget-library.routes.ts`
- Now: `home.widgets-bundles` still runs as AngularJS.
- After: route `home.widgets-bundles` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches

