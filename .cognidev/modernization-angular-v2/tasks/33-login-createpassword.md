# Tasks — slice `login.createPassword`

Units in S3 order; tasks in the order they run.

## 54. `CreatePasswordController` (angularjs controller) — 3 tasks

`src/app/login/index.js`

**T54.1** · create — Create Angular component `CreatePasswordComponent` for the screen that AngularJS controller `CreatePasswordController` drives.

- Source: `src/app/login/index.js` L29
- Target: `src/app/login/index.ts`
- Now: `CreatePasswordController` is registered at src/app/login/index.js:29 with `angular.module('thingsboard.login').controller(…)`.
- After: `src/app/login/index.ts` exports `CreatePasswordComponent`; no AngularJS registration of `CreatePasswordController` remains.
- Done by: code · Checked by: `CreatePasswordComponent` is exported from `src/app/login/index.ts`; `.controller('CreatePasswordController'` is absent; the project compiles

**T54.2** · add_bridge — Add a bridge so AngularJS `login.createPassword` can keep using `CreatePasswordComponent` until they are migrated.

- Target: ``
- Now: `login.createPassword` use AngularJS `CreatePasswordController`; no bridge to `CreatePasswordComponent` exists.
- After: AngularJS name `CreatePasswordController` is registered as `downgradeComponent(CreatePasswordComponent)`; `login.createPassword` still work.
- Done by: code · Checked by: the registration is present; the screens of `login.createPassword` still render

**T54.3** · check — Check `CreatePasswordComponent`: it compiles and behaves as before.

- Target: `src/app/login/index.ts`
- Now: `CreatePasswordController` still runs as AngularJS.
- After: `CreatePasswordComponent` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches; the `login.createPassword` page renders


## 55. `login.createPassword` (route ui-router) — 3 tasks

`src/app/login/login.routes.js`

**T55.1** · change — Change route `login.createPassword` from a ui-router state to an Angular Router route.

- Source: `src/app/login/login.routes.js` L80
- Target: `the Angular route table`
- Now: ui-router state `login.createPassword` is defined at src/app/login/login.routes.js:80.
- After: An Angular `Routes` entry for `login.createPassword` shows the same view; the ui-router state is gone.
- Done by: code · Checked by: the `login.createPassword` page renders; `.state('login.createPassword'` is absent

**T55.2** · remove_bridge — Remove the bridge for `CreatePasswordComponent`: `login.createPassword` was its last AngularJS user.

- Target: ``
- Now: AngularJS name `CreatePasswordController` is bridged to `CreatePasswordComponent`.
- After: No bridge registration for `CreatePasswordController` remains.
- Done by: code · Checked by: no registration of `CreatePasswordController` in ``; the project compiles

**T55.3** · check — Check route `login.createPassword`: it compiles and behaves as before.

- Target: `src/app/login/login.routes.ts`
- Now: `login.createPassword` still runs as AngularJS.
- After: route `login.createPassword` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches

