# Tasks — slice `home.widgets-bundles.widget-types`

Units in S3 order; tasks in the order they run.

## 47. `WidgetLibraryController` (angularjs controller) — 3 tasks

`src/app/widget/index.js`

**T47.1** · create — Create Angular component `WidgetLibraryComponent` for the screen that AngularJS controller `WidgetLibraryController` drives.

- Source: `src/app/widget/index.js` L40
- Target: `src/app/widget/index.ts`
- Now: `WidgetLibraryController` is registered at src/app/widget/index.js:40 with `angular.module('thingsboard.widget-library').controller(…)`.
- After: `src/app/widget/index.ts` exports `WidgetLibraryComponent`; no AngularJS registration of `WidgetLibraryController` remains.
- Done by: code · Checked by: `WidgetLibraryComponent` is exported from `src/app/widget/index.ts`; `.controller('WidgetLibraryController'` is absent; the project compiles

**T47.2** · add_bridge — Add a bridge so AngularJS `home.widgets-bundles.widget-types` can keep using `WidgetLibraryComponent` until they are migrated.

- Target: ``
- Now: `home.widgets-bundles.widget-types` use AngularJS `WidgetLibraryController`; no bridge to `WidgetLibraryComponent` exists.
- After: AngularJS name `WidgetLibraryController` is registered as `downgradeComponent(WidgetLibraryComponent)`; `home.widgets-bundles.widget-types` still work.
- Done by: code · Checked by: the registration is present; the screens of `home.widgets-bundles.widget-types` still render

**T47.3** · check — Check `WidgetLibraryComponent`: it compiles and behaves as before.

- Target: `src/app/widget/index.ts`
- Now: `WidgetLibraryController` still runs as AngularJS.
- After: `WidgetLibraryComponent` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches; the `home.widgets-bundles.widget-types` page renders


## 48. `home.widgets-bundles.widget-types` (route ui-router) — 3 tasks

`src/app/widget/widget-library.routes.js`

**T48.1** · change — Change route `home.widgets-bundles.widget-types` from a ui-router state to an Angular Router route.

- Source: `src/app/widget/widget-library.routes.js` L48
- Target: `the Angular route table`
- Now: ui-router state `home.widgets-bundles.widget-types` is defined at src/app/widget/widget-library.routes.js:48.
- After: An Angular `Routes` entry for `home.widgets-bundles.widget-types` shows the same view; the ui-router state is gone.
- Done by: code · Checked by: the `home.widgets-bundles.widget-types` page renders; `.state('home.widgets-bundles.widget-types'` is absent

**T48.2** · remove_bridge — Remove the bridge for `WidgetLibraryComponent`: `home.widgets-bundles.widget-types` was its last AngularJS user.

- Target: ``
- Now: AngularJS name `WidgetLibraryController` is bridged to `WidgetLibraryComponent`.
- After: No bridge registration for `WidgetLibraryController` remains.
- Done by: code · Checked by: no registration of `WidgetLibraryController` in ``; the project compiles

**T48.3** · check — Check route `home.widgets-bundles.widget-types`: it compiles and behaves as before.

- Target: `src/app/widget/widget-library.routes.ts`
- Now: `home.widgets-bundles.widget-types` still runs as AngularJS.
- After: route `home.widgets-bundles.widget-types` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches

