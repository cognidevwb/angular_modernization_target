# Tasks — slice `login.resetPassword`

Units in S3 order; tasks in the order they run.

## 57. `login.resetPassword` (route ui-router) — 3 tasks

`src/app/login/login.routes.js`

**T57.1** · change — Change route `login.resetPassword` from a ui-router state to an Angular Router route.

- Source: `src/app/login/login.routes.js` L53
- Target: `the Angular route table`
- Now: ui-router state `login.resetPassword` is defined at src/app/login/login.routes.js:53.
- After: An Angular `Routes` entry for `login.resetPassword` shows the same view; the ui-router state is gone.
- Done by: code · Checked by: the `login.resetPassword` page renders; `.state('login.resetPassword'` is absent

**T57.2** · remove_bridge — Remove the bridge for `ResetPasswordComponent`: `login.resetPassword` was its last AngularJS user.

- Target: ``
- Now: AngularJS name `ResetPasswordController` is bridged to `ResetPasswordComponent`.
- After: No bridge registration for `ResetPasswordController` remains.
- Done by: code · Checked by: no registration of `ResetPasswordController` in ``; the project compiles

**T57.3** · check — Check route `login.resetPassword`: it compiles and behaves as before.

- Target: `src/app/login/login.routes.ts`
- Now: `login.resetPassword` still runs as AngularJS.
- After: route `login.resetPassword` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches

