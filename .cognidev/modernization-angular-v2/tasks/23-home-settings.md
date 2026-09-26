# Tasks — slice `home.settings`

Units in S3 order; tasks in the order they run.

## 36. `AdminController` (angularjs controller) — 3 tasks

`src/app/admin/index.js`

**T36.1** · create — Create Angular component `AdminComponent` for the screen that AngularJS controller `AdminController` drives.

- Source: `src/app/admin/index.js` L27
- Target: `src/app/admin/index.ts`
- Now: `AdminController` is registered at src/app/admin/index.js:27 with `angular.module('thingsboard.admin').controller(…)`.
- After: `src/app/admin/index.ts` exports `AdminComponent`; no AngularJS registration of `AdminController` remains.
- Done by: code · Checked by: `AdminComponent` is exported from `src/app/admin/index.ts`; `.controller('AdminController'` is absent; the project compiles

**T36.2** · add_bridge — Add a bridge so AngularJS `home.settings.general`, `home.settings.outgoing-mail` can keep using `AdminComponent` until they are migrated.

- Target: ``
- Now: `home.settings.general`, `home.settings.outgoing-mail` use AngularJS `AdminController`; no bridge to `AdminComponent` exists.
- After: AngularJS name `AdminController` is registered as `downgradeComponent(AdminComponent)`; `home.settings.general`, `home.settings.outgoing-mail` still work.
- Done by: code · Checked by: the registration is present; the screens of `home.settings.general`, `home.settings.outgoing-mail` still render

**T36.3** · check — Check `AdminComponent`: it compiles and behaves as before.

- Target: `src/app/admin/index.ts`
- Now: `AdminController` still runs as AngularJS.
- After: `AdminComponent` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches; the `home.settings.general` page renders


## 37. `home.settings` (route ui-router) — 2 tasks

`src/app/admin/admin.routes.js`

**T37.1** · change — Change route `home.settings` from a ui-router state to an Angular Router route.

- Source: `src/app/admin/admin.routes.js` L27
- Target: `the Angular route table`
- Now: ui-router state `home.settings` is defined at src/app/admin/admin.routes.js:27.
- After: An Angular `Routes` entry for `home.settings` shows the same view; the ui-router state is gone.
- Done by: code · Checked by: the `home.settings` page renders; `.state('home.settings'` is absent

**T37.2** · check — Check route `home.settings`: it compiles and behaves as before.

- Target: `src/app/admin/admin.routes.ts`
- Now: `home.settings` still runs as AngularJS.
- After: route `home.settings` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches

