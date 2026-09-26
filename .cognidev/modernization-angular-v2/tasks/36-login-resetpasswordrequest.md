# Tasks — slice `login.resetPasswordRequest`

Units in S3 order; tasks in the order they run.

## 58. `ResetPasswordRequestController` (angularjs controller) — 3 tasks

`src/app/login/index.js`

**T58.1** · create — Create Angular component `ResetPasswordRequestComponent` for the screen that AngularJS controller `ResetPasswordRequestController` drives.

- Source: `src/app/login/index.js` L29
- Target: `src/app/login/index.ts`
- Now: `ResetPasswordRequestController` is registered at src/app/login/index.js:29 with `angular.module('thingsboard.login').controller(…)`.
- After: `src/app/login/index.ts` exports `ResetPasswordRequestComponent`; no AngularJS registration of `ResetPasswordRequestController` remains.
- Done by: code · Checked by: `ResetPasswordRequestComponent` is exported from `src/app/login/index.ts`; `.controller('ResetPasswordRequestController'` is absent; the project compiles

**T58.2** · add_bridge — Add a bridge so AngularJS `login.resetPasswordRequest` can keep using `ResetPasswordRequestComponent` until they are migrated.

- Target: ``
- Now: `login.resetPasswordRequest` use AngularJS `ResetPasswordRequestController`; no bridge to `ResetPasswordRequestComponent` exists.
- After: AngularJS name `ResetPasswordRequestController` is registered as `downgradeComponent(ResetPasswordRequestComponent)`; `login.resetPasswordRequest` still work.
- Done by: code · Checked by: the registration is present; the screens of `login.resetPasswordRequest` still render

**T58.3** · check — Check `ResetPasswordRequestComponent`: it compiles and behaves as before.

- Target: `src/app/login/index.ts`
- Now: `ResetPasswordRequestController` still runs as AngularJS.
- After: `ResetPasswordRequestComponent` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches; the `login.resetPasswordRequest` page renders


## 59. `login.resetPasswordRequest` (route ui-router) — 3 tasks

`src/app/login/login.routes.js`

**T59.1** · change — Change route `login.resetPasswordRequest` from a ui-router state to an Angular Router route.

- Source: `src/app/login/login.routes.js` L40
- Target: `the Angular route table`
- Now: ui-router state `login.resetPasswordRequest` is defined at src/app/login/login.routes.js:40.
- After: An Angular `Routes` entry for `login.resetPasswordRequest` shows the same view; the ui-router state is gone.
- Done by: code · Checked by: the `login.resetPasswordRequest` page renders; `.state('login.resetPasswordRequest'` is absent

**T59.2** · remove_bridge — Remove the bridge for `ResetPasswordRequestComponent`: `login.resetPasswordRequest` was its last AngularJS user.

- Target: ``
- Now: AngularJS name `ResetPasswordRequestController` is bridged to `ResetPasswordRequestComponent`.
- After: No bridge registration for `ResetPasswordRequestController` remains.
- Done by: code · Checked by: no registration of `ResetPasswordRequestController` in ``; the project compiles

**T59.3** · check — Check route `login.resetPasswordRequest`: it compiles and behaves as before.

- Target: `src/app/login/login.routes.ts`
- Now: `login.resetPasswordRequest` still runs as AngularJS.
- After: route `login.resetPasswordRequest` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches

