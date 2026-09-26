# Tasks — slice `home.customers.users`

Units in S3 order; tasks in the order they run.

## 20. `home.customers.users` (route ui-router) — 2 tasks

`src/app/user/user.routes.js`

**T20.1** · change — Change route `home.customers.users` from a ui-router state to an Angular Router route.

- Source: `src/app/user/user.routes.js` L47
- Target: `the Angular route table`
- Now: ui-router state `home.customers.users` is defined at src/app/user/user.routes.js:47.
- After: An Angular `Routes` entry for `home.customers.users` shows the same view; the ui-router state is gone.
- Done by: code · Checked by: the `home.customers.users` page renders; `.state('home.customers.users'` is absent

**T20.2** · check — Check route `home.customers.users`: it compiles and behaves as before.

- Target: `src/app/user/user.routes.ts`
- Now: `home.customers.users` still runs as AngularJS.
- After: route `home.customers.users` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches

