# Tasks — slice `home.tenants.users`

Units in S3 order; tasks in the order they run.

## 44. `home.tenants.users` (route ui-router) — 3 tasks

`src/app/user/user.routes.js`

**T44.1** · change — Change route `home.tenants.users` from a ui-router state to an Angular Router route.

- Source: `src/app/user/user.routes.js` L26
- Target: `the Angular route table`
- Now: ui-router state `home.tenants.users` is defined at src/app/user/user.routes.js:26.
- After: An Angular `Routes` entry for `home.tenants.users` shows the same view; the ui-router state is gone.
- Done by: code · Checked by: the `home.tenants.users` page renders; `.state('home.tenants.users'` is absent

**T44.2** · remove_bridge — Remove the bridge for `UserComponent`: `home.tenants.users` was its last AngularJS user.

- Target: ``
- Now: AngularJS name `UserController` is bridged to `UserComponent`.
- After: No bridge registration for `UserController` remains.
- Done by: code · Checked by: no registration of `UserController` in ``; the project compiles

**T44.3** · check — Check route `home.tenants.users`: it compiles and behaves as before.

- Target: `src/app/user/user.routes.ts`
- Now: `home.tenants.users` still runs as AngularJS.
- After: route `home.tenants.users` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches

