# Tasks — slice `login`

Units in S3 order; tasks in the order they run.

## 51. `LoginController` (angularjs controller) — 3 tasks

`src/app/login/index.js`

**T51.1** · create — Create Angular component `LoginComponent` for the screen that AngularJS controller `LoginController` drives.

- Source: `src/app/login/index.js` L29
- Target: `src/app/login/index.ts`
- Now: `LoginController` is registered at src/app/login/index.js:29 with `angular.module('thingsboard.login').controller(…)`.
- After: `src/app/login/index.ts` exports `LoginComponent`; no AngularJS registration of `LoginController` remains.
- Done by: code · Checked by: `LoginComponent` is exported from `src/app/login/index.ts`; `.controller('LoginController'` is absent; the project compiles

**T51.2** · add_bridge — Add a bridge so AngularJS `login` can keep using `LoginComponent` until they are migrated.

- Target: ``
- Now: `login` use AngularJS `LoginController`; no bridge to `LoginComponent` exists.
- After: AngularJS name `LoginController` is registered as `downgradeComponent(LoginComponent)`; `login` still work.
- Done by: code · Checked by: the registration is present; the screens of `login` still render

**T51.3** · check — Check `LoginComponent`: it compiles and behaves as before.

- Target: `src/app/login/index.ts`
- Now: `LoginController` still runs as AngularJS.
- After: `LoginComponent` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches; the `login` page renders


## 52. `ResetPasswordController` (angularjs controller) — 3 tasks

`src/app/login/index.js`

**T52.1** · create — Create Angular component `ResetPasswordComponent` for the screen that AngularJS controller `ResetPasswordController` drives.

- Source: `src/app/login/index.js` L29
- Target: `src/app/login/index.ts`
- Now: `ResetPasswordController` is registered at src/app/login/index.js:29 with `angular.module('thingsboard.login').controller(…)`.
- After: `src/app/login/index.ts` exports `ResetPasswordComponent`; no AngularJS registration of `ResetPasswordController` remains.
- Done by: code · Checked by: `ResetPasswordComponent` is exported from `src/app/login/index.ts`; `.controller('ResetPasswordController'` is absent; the project compiles

**T52.2** · add_bridge — Add a bridge so AngularJS `login.resetExpiredPassword`, `login.resetPassword` can keep using `ResetPasswordComponent` until they are migrated.

- Target: ``
- Now: `login.resetExpiredPassword`, `login.resetPassword` use AngularJS `ResetPasswordController`; no bridge to `ResetPasswordComponent` exists.
- After: AngularJS name `ResetPasswordController` is registered as `downgradeComponent(ResetPasswordComponent)`; `login.resetExpiredPassword`, `login.resetPassword` still work.
- Done by: code · Checked by: the registration is present; the screens of `login.resetExpiredPassword`, `login.resetPassword` still render

**T52.3** · check — Check `ResetPasswordComponent`: it compiles and behaves as before.

- Target: `src/app/login/index.ts`
- Now: `ResetPasswordController` still runs as AngularJS.
- After: `ResetPasswordComponent` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches; the `login.resetExpiredPassword` page renders


## 53. `login` (route ui-router) — 3 tasks

`src/app/login/login.routes.js`

**T53.1** · change — Change route `login` from a ui-router state to an Angular Router route.

- Source: `src/app/login/login.routes.js` L27
- Target: `the Angular route table`
- Now: ui-router state `login` is defined at src/app/login/login.routes.js:27.
- After: An Angular `Routes` entry for `login` shows the same view; the ui-router state is gone.
- Done by: code · Checked by: the `login` page renders; `.state('login'` is absent

**T53.2** · remove_bridge — Remove the bridge for `LoginComponent`: `login` was its last AngularJS user.

- Target: ``
- Now: AngularJS name `LoginController` is bridged to `LoginComponent`.
- After: No bridge registration for `LoginController` remains.
- Done by: code · Checked by: no registration of `LoginController` in ``; the project compiles

**T53.3** · check — Check route `login`: it compiles and behaves as before.

- Target: `src/app/login/login.routes.ts`
- Now: `login` still runs as AngularJS.
- After: route `login` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches

