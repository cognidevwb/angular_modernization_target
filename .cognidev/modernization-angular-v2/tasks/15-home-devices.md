# Tasks — slice `home.devices`

Units in S3 order; tasks in the order they run.

## 23. `home.devices` (route ui-router) — 3 tasks

`src/app/device/device.routes.js`

**T23.1** · change — Change route `home.devices` from a ui-router state to an Angular Router route.

- Source: `src/app/device/device.routes.js` L25
- Target: `the Angular route table`
- Now: ui-router state `home.devices` is defined at src/app/device/device.routes.js:25.
- After: An Angular `Routes` entry for `home.devices` shows the same view; the ui-router state is gone.
- Done by: code · Checked by: the `home.devices` page renders; `.state('home.devices'` is absent

**T23.2** · remove_bridge — Remove the bridge for `DeviceComponent`: `home.devices` was its last AngularJS user.

- Target: ``
- Now: AngularJS name `DeviceController` is bridged to `DeviceComponent`.
- After: No bridge registration for `DeviceController` remains.
- Done by: code · Checked by: no registration of `DeviceController` in ``; the project compiles

**T23.3** · check — Check route `home.devices`: it compiles and behaves as before.

- Target: `src/app/device/device.routes.ts`
- Now: `home.devices` still runs as AngularJS.
- After: route `home.devices` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches

