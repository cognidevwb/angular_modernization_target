# Tasks — slice `home.customers.devices`

Units in S3 order; tasks in the order they run.

## 18. `home.customers.devices` (route ui-router) — 2 tasks

`src/app/device/device.routes.js`

**T18.1** · change — Change route `home.customers.devices` from a ui-router state to an Angular Router route.

- Source: `src/app/device/device.routes.js` L48
- Target: `the Angular route table`
- Now: ui-router state `home.customers.devices` is defined at src/app/device/device.routes.js:48.
- After: An Angular `Routes` entry for `home.customers.devices` shows the same view; the ui-router state is gone.
- Done by: code · Checked by: the `home.customers.devices` page renders; `.state('home.customers.devices'` is absent

**T18.2** · check — Check route `home.customers.devices`: it compiles and behaves as before.

- Target: `src/app/device/device.routes.ts`
- Now: `home.customers.devices` still runs as AngularJS.
- After: route `home.customers.devices` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches

