# Tasks — slice `home.tenants`

Units in S3 order; tasks in the order they run.

## 42. `TenantController` (angularjs controller) — 3 tasks

`src/app/tenant/index.js`

**T42.1** · create — Create Angular component `TenantComponent` for the screen that AngularJS controller `TenantController` drives.

- Source: `src/app/tenant/index.js` L26
- Target: `src/app/tenant/index.ts`
- Now: `TenantController` is registered at src/app/tenant/index.js:26 with `angular.module('thingsboard.tenant').controller(…)`.
- After: `src/app/tenant/index.ts` exports `TenantComponent`; no AngularJS registration of `TenantController` remains.
- Done by: code · Checked by: `TenantComponent` is exported from `src/app/tenant/index.ts`; `.controller('TenantController'` is absent; the project compiles

**T42.2** · add_bridge — Add a bridge so AngularJS `home.tenants` can keep using `TenantComponent` until they are migrated.

- Target: ``
- Now: `home.tenants` use AngularJS `TenantController`; no bridge to `TenantComponent` exists.
- After: AngularJS name `TenantController` is registered as `downgradeComponent(TenantComponent)`; `home.tenants` still work.
- Done by: code · Checked by: the registration is present; the screens of `home.tenants` still render

**T42.3** · check — Check `TenantComponent`: it compiles and behaves as before.

- Target: `src/app/tenant/index.ts`
- Now: `TenantController` still runs as AngularJS.
- After: `TenantComponent` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches; the `home.tenants` page renders


## 43. `home.tenants` (route ui-router) — 3 tasks

`src/app/tenant/tenant.routes.js`

**T43.1** · change — Change route `home.tenants` from a ui-router state to an Angular Router route.

- Source: `src/app/tenant/tenant.routes.js` L26
- Target: `the Angular route table`
- Now: ui-router state `home.tenants` is defined at src/app/tenant/tenant.routes.js:26.
- After: An Angular `Routes` entry for `home.tenants` shows the same view; the ui-router state is gone.
- Done by: code · Checked by: the `home.tenants` page renders; `.state('home.tenants'` is absent

**T43.2** · remove_bridge — Remove the bridge for `TenantComponent`: `home.tenants` was its last AngularJS user.

- Target: ``
- Now: AngularJS name `TenantController` is bridged to `TenantComponent`.
- After: No bridge registration for `TenantController` remains.
- Done by: code · Checked by: no registration of `TenantController` in ``; the project compiles

**T43.3** · check — Check route `home.tenants`: it compiles and behaves as before.

- Target: `src/app/tenant/tenant.routes.ts`
- Now: `home.tenants` still runs as AngularJS.
- After: route `home.tenants` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches

