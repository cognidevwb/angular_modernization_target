# Tasks — slice `home`

Units in S3 order; tasks in the order they run.

## 3. `AssetController` (angularjs controller) — 3 tasks

`src/app/asset/index.js`

**T3.1** · create — Create Angular component `AssetComponent` for the screen that AngularJS controller `AssetController` drives.

- Source: `src/app/asset/index.js` L28
- Target: `src/app/asset/index.ts`
- Now: `AssetController` is registered at src/app/asset/index.js:28 with `angular.module('thingsboard.asset').controller(…)`.
- After: `src/app/asset/index.ts` exports `AssetComponent`; no AngularJS registration of `AssetController` remains.
- Done by: code · Checked by: `AssetComponent` is exported from `src/app/asset/index.ts`; `.controller('AssetController'` is absent; the project compiles

**T3.2** · add_bridge — Add a bridge so AngularJS `home.assets`, `home.customers.assets` can keep using `AssetComponent` until they are migrated.

- Target: ``
- Now: `home.assets`, `home.customers.assets` use AngularJS `AssetController`; no bridge to `AssetComponent` exists.
- After: AngularJS name `AssetController` is registered as `downgradeComponent(AssetComponent)`; `home.assets`, `home.customers.assets` still work.
- Done by: code · Checked by: the registration is present; the screens of `home.assets`, `home.customers.assets` still render

**T3.3** · check — Check `AssetComponent`: it compiles and behaves as before.

- Target: `src/app/asset/index.ts`
- Now: `AssetController` still runs as AngularJS.
- After: `AssetComponent` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches; the `home.assets` page renders


## 4. `DashboardsController` (angularjs controller) — 3 tasks

`src/app/dashboard/index.js`

**T4.1** · create — Create Angular component `DashboardsComponent` for the screen that AngularJS controller `DashboardsController` drives.

- Source: `src/app/dashboard/index.js` L50
- Target: `src/app/dashboard/index.ts`
- Now: `DashboardsController` is registered at src/app/dashboard/index.js:50 with `angular.module('thingsboard.dashboard').controller(…)`.
- After: `src/app/dashboard/index.ts` exports `DashboardsComponent`; no AngularJS registration of `DashboardsController` remains.
- Done by: code · Checked by: `DashboardsComponent` is exported from `src/app/dashboard/index.ts`; `.controller('DashboardsController'` is absent; the project compiles

**T4.2** · add_bridge — Add a bridge so AngularJS `home.customers.dashboards`, `home.dashboards` can keep using `DashboardsComponent` until they are migrated.

- Target: ``
- Now: `home.customers.dashboards`, `home.dashboards` use AngularJS `DashboardsController`; no bridge to `DashboardsComponent` exists.
- After: AngularJS name `DashboardsController` is registered as `downgradeComponent(DashboardsComponent)`; `home.customers.dashboards`, `home.dashboards` still work.
- Done by: code · Checked by: the registration is present; the screens of `home.customers.dashboards`, `home.dashboards` still render

**T4.3** · check — Check `DashboardsComponent`: it compiles and behaves as before.

- Target: `src/app/dashboard/index.ts`
- Now: `DashboardsController` still runs as AngularJS.
- After: `DashboardsComponent` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches; the `home.customers.dashboards` page renders


## 5. `DeviceController` (angularjs controller) — 3 tasks

`src/app/device/index.js`

**T5.1** · create — Create Angular component `DeviceComponent` for the screen that AngularJS controller `DeviceController` drives.

- Source: `src/app/device/index.js` L29
- Target: `src/app/device/index.ts`
- Now: `DeviceController` is registered at src/app/device/index.js:29 with `angular.module('thingsboard.device').controller(…)`.
- After: `src/app/device/index.ts` exports `DeviceComponent`; no AngularJS registration of `DeviceController` remains.
- Done by: code · Checked by: `DeviceComponent` is exported from `src/app/device/index.ts`; `.controller('DeviceController'` is absent; the project compiles

**T5.2** · add_bridge — Add a bridge so AngularJS `home.customers.devices`, `home.devices` can keep using `DeviceComponent` until they are migrated.

- Target: ``
- Now: `home.customers.devices`, `home.devices` use AngularJS `DeviceController`; no bridge to `DeviceComponent` exists.
- After: AngularJS name `DeviceController` is registered as `downgradeComponent(DeviceComponent)`; `home.customers.devices`, `home.devices` still work.
- Done by: code · Checked by: the registration is present; the screens of `home.customers.devices`, `home.devices` still render

**T5.3** · check — Check `DeviceComponent`: it compiles and behaves as before.

- Target: `src/app/device/index.ts`
- Now: `DeviceController` still runs as AngularJS.
- After: `DeviceComponent` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches; the `home.customers.devices` page renders


## 6. `EntityViewController` (angularjs controller) — 3 tasks

`src/app/entity-view/index.js`

**T6.1** · create — Create Angular component `EntityViewComponent` for the screen that AngularJS controller `EntityViewController` drives.

- Source: `src/app/entity-view/index.js` L28
- Target: `src/app/entity-view/index.ts`
- Now: `EntityViewController` is registered at src/app/entity-view/index.js:28 with `angular.module('thingsboard.entityView').controller(…)`.
- After: `src/app/entity-view/index.ts` exports `EntityViewComponent`; no AngularJS registration of `EntityViewController` remains.
- Done by: code · Checked by: `EntityViewComponent` is exported from `src/app/entity-view/index.ts`; `.controller('EntityViewController'` is absent; the project compiles

**T6.2** · add_bridge — Add a bridge so AngularJS `home.customers.entityViews`, `home.entityViews` can keep using `EntityViewComponent` until they are migrated.

- Target: ``
- Now: `home.customers.entityViews`, `home.entityViews` use AngularJS `EntityViewController`; no bridge to `EntityViewComponent` exists.
- After: AngularJS name `EntityViewController` is registered as `downgradeComponent(EntityViewComponent)`; `home.customers.entityViews`, `home.entityViews` still work.
- Done by: code · Checked by: the registration is present; the screens of `home.customers.entityViews`, `home.entityViews` still render

**T6.3** · check — Check `EntityViewComponent`: it compiles and behaves as before.

- Target: `src/app/entity-view/index.ts`
- Now: `EntityViewController` still runs as AngularJS.
- After: `EntityViewComponent` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches; the `home.customers.entityViews` page renders


## 7. `HomeController` (angularjs controller) — 3 tasks

`src/app/layout/index.js`

**T7.1** · create — Create Angular component `HomeComponent` for the screen that AngularJS controller `HomeController` drives.

- Source: `src/app/layout/index.js` L67
- Target: `src/app/layout/index.ts`
- Now: `HomeController` is registered at src/app/layout/index.js:67 with `angular.module('thingsboard.home').controller(…)`.
- After: `src/app/layout/index.ts` exports `HomeComponent`; no AngularJS registration of `HomeController` remains.
- Done by: code · Checked by: `HomeComponent` is exported from `src/app/layout/index.ts`; `.controller('HomeController'` is absent; the project compiles

**T7.2** · add_bridge — Add a bridge so AngularJS `home` can keep using `HomeComponent` until they are migrated.

- Target: ``
- Now: `home` use AngularJS `HomeController`; no bridge to `HomeComponent` exists.
- After: AngularJS name `HomeController` is registered as `downgradeComponent(HomeComponent)`; `home` still work.
- Done by: code · Checked by: the registration is present; the screens of `home` still render

**T7.3** · check — Check `HomeComponent`: it compiles and behaves as before.

- Target: `src/app/layout/index.ts`
- Now: `HomeController` still runs as AngularJS.
- After: `HomeComponent` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches; the `home` page renders


## 8. `UserController` (angularjs controller) — 3 tasks

`src/app/user/index.js`

**T8.1** · create — Create Angular component `UserComponent` for the screen that AngularJS controller `UserController` drives.

- Source: `src/app/user/index.js` L27
- Target: `src/app/user/index.ts`
- Now: `UserController` is registered at src/app/user/index.js:27 with `angular.module('thingsboard.user').controller(…)`.
- After: `src/app/user/index.ts` exports `UserComponent`; no AngularJS registration of `UserController` remains.
- Done by: code · Checked by: `UserComponent` is exported from `src/app/user/index.ts`; `.controller('UserController'` is absent; the project compiles

**T8.2** · add_bridge — Add a bridge so AngularJS `home.customers.users`, `home.tenants.users` can keep using `UserComponent` until they are migrated.

- Target: ``
- Now: `home.customers.users`, `home.tenants.users` use AngularJS `UserController`; no bridge to `UserComponent` exists.
- After: AngularJS name `UserController` is registered as `downgradeComponent(UserComponent)`; `home.customers.users`, `home.tenants.users` still work.
- Done by: code · Checked by: the registration is present; the screens of `home.customers.users`, `home.tenants.users` still render

**T8.3** · check — Check `UserComponent`: it compiles and behaves as before.

- Target: `src/app/user/index.ts`
- Now: `UserController` still runs as AngularJS.
- After: `UserComponent` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches; the `home.customers.users` page renders


## 9. `home` (route ui-router) — 3 tasks

`src/app/layout/home.routes.js`

**T9.1** · change — Change route `home` from a ui-router state to an Angular Router route.

- Source: `src/app/layout/home.routes.js` L32
- Target: `the Angular route table`
- Now: ui-router state `home` is defined at src/app/layout/home.routes.js:32.
- After: An Angular `Routes` entry for `home` shows the same view; the ui-router state is gone.
- Done by: code · Checked by: the `home` page renders; `.state('home'` is absent

**T9.2** · remove_bridge — Remove the bridge for `HomeComponent`: `home` was its last AngularJS user.

- Target: ``
- Now: AngularJS name `HomeController` is bridged to `HomeComponent`.
- After: No bridge registration for `HomeController` remains.
- Done by: code · Checked by: no registration of `HomeController` in ``; the project compiles

**T9.3** · check — Check route `home`: it compiles and behaves as before.

- Target: `src/app/layout/home.routes.ts`
- Now: `home` still runs as AngularJS.
- After: route `home` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches

