# Tasks — slice `login.resetExpiredPassword`

Units in S3 order; tasks in the order they run.

## 56. `login.resetExpiredPassword` (route ui-router) — 2 tasks

`src/app/login/login.routes.js`

**T56.1** · change — Change route `login.resetExpiredPassword` from a ui-router state to an Angular Router route.

- Source: `src/app/login/login.routes.js` L66
- Target: `the Angular route table`
- Now: ui-router state `login.resetExpiredPassword` is defined at src/app/login/login.routes.js:66.
- After: An Angular `Routes` entry for `login.resetExpiredPassword` shows the same view; the ui-router state is gone.
- Done by: code · Checked by: the `login.resetExpiredPassword` page renders; `.state('login.resetExpiredPassword'` is absent

**T56.2** · check — Check route `login.resetExpiredPassword`: it compiles and behaves as before.

- Target: `src/app/login/login.routes.ts`
- Now: `login.resetExpiredPassword` still runs as AngularJS.
- After: route `login.resetExpiredPassword` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches

