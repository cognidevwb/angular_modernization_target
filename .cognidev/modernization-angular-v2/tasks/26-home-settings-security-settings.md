# Tasks — slice `home.settings.security-settings`

Units in S3 order; tasks in the order they run.

## 40. `SecuritySettingsController` (angularjs controller) — 3 tasks

`src/app/admin/index.js`

**T40.1** · create — Create Angular component `SecuritySettingsComponent` for the screen that AngularJS controller `SecuritySettingsController` drives.

- Source: `src/app/admin/index.js` L27
- Target: `src/app/admin/index.ts`
- Now: `SecuritySettingsController` is registered at src/app/admin/index.js:27 with `angular.module('thingsboard.admin').controller(…)`.
- After: `src/app/admin/index.ts` exports `SecuritySettingsComponent`; no AngularJS registration of `SecuritySettingsController` remains.
- Done by: code · Checked by: `SecuritySettingsComponent` is exported from `src/app/admin/index.ts`; `.controller('SecuritySettingsController'` is absent; the project compiles

**T40.2** · add_bridge — Add a bridge so AngularJS `home.settings.security-settings` can keep using `SecuritySettingsComponent` until they are migrated.

- Target: ``
- Now: `home.settings.security-settings` use AngularJS `SecuritySettingsController`; no bridge to `SecuritySettingsComponent` exists.
- After: AngularJS name `SecuritySettingsController` is registered as `downgradeComponent(SecuritySettingsComponent)`; `home.settings.security-settings` still work.
- Done by: code · Checked by: the registration is present; the screens of `home.settings.security-settings` still render

**T40.3** · check — Check `SecuritySettingsComponent`: it compiles and behaves as before.

- Target: `src/app/admin/index.ts`
- Now: `SecuritySettingsController` still runs as AngularJS.
- After: `SecuritySettingsComponent` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches; the `home.settings.security-settings` page renders


## 41. `home.settings.security-settings` (route ui-router) — 3 tasks

`src/app/admin/admin.routes.js`

**T41.1** · change — Change route `home.settings.security-settings` from a ui-router state to an Angular Router route.

- Source: `src/app/admin/admin.routes.js` L74
- Target: `the Angular route table`
- Now: ui-router state `home.settings.security-settings` is defined at src/app/admin/admin.routes.js:74.
- After: An Angular `Routes` entry for `home.settings.security-settings` shows the same view; the ui-router state is gone.
- Done by: code · Checked by: the `home.settings.security-settings` page renders; `.state('home.settings.security-settings'` is absent

**T41.2** · remove_bridge — Remove the bridge for `SecuritySettingsComponent`: `home.settings.security-settings` was its last AngularJS user.

- Target: ``
- Now: AngularJS name `SecuritySettingsController` is bridged to `SecuritySettingsComponent`.
- After: No bridge registration for `SecuritySettingsController` remains.
- Done by: code · Checked by: no registration of `SecuritySettingsController` in ``; the project compiles

**T41.3** · check — Check route `home.settings.security-settings`: it compiles and behaves as before.

- Target: `src/app/admin/admin.routes.ts`
- Now: `home.settings.security-settings` still runs as AngularJS.
- After: route `home.settings.security-settings` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches

