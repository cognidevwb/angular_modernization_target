# Tasks — slice `home.customers`

Units in S3 order; tasks in the order they run.

## 13. `CustomerController` (angularjs controller) — 3 tasks

`src/app/customer/index.js`

**T13.1** · create — Create Angular component `CustomerComponent` for the screen that AngularJS controller `CustomerController` drives.

- Source: `src/app/customer/index.js` L26
- Target: `src/app/customer/index.ts`
- Now: `CustomerController` is registered at src/app/customer/index.js:26 with `angular.module('thingsboard.customer').controller(…)`.
- After: `src/app/customer/index.ts` exports `CustomerComponent`; no AngularJS registration of `CustomerController` remains.
- Done by: code · Checked by: `CustomerComponent` is exported from `src/app/customer/index.ts`; `.controller('CustomerController'` is absent; the project compiles

**T13.2** · add_bridge — Add a bridge so AngularJS `home.customers` can keep using `CustomerComponent` until they are migrated.

- Target: ``
- Now: `home.customers` use AngularJS `CustomerController`; no bridge to `CustomerComponent` exists.
- After: AngularJS name `CustomerController` is registered as `downgradeComponent(CustomerComponent)`; `home.customers` still work.
- Done by: code · Checked by: the registration is present; the screens of `home.customers` still render

**T13.3** · check — Check `CustomerComponent`: it compiles and behaves as before.

- Target: `src/app/customer/index.ts`
- Now: `CustomerController` still runs as AngularJS.
- After: `CustomerComponent` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches; the `home.customers` page renders


## 14. `home.customers` (route ui-router) — 3 tasks

`src/app/customer/customer.routes.js`

**T14.1** · change — Change route `home.customers` from a ui-router state to an Angular Router route.

- Source: `src/app/customer/customer.routes.js` L26
- Target: `the Angular route table`
- Now: ui-router state `home.customers` is defined at src/app/customer/customer.routes.js:26.
- After: An Angular `Routes` entry for `home.customers` shows the same view; the ui-router state is gone.
- Done by: code · Checked by: the `home.customers` page renders; `.state('home.customers'` is absent

**T14.2** · remove_bridge — Remove the bridge for `CustomerComponent`: `home.customers` was its last AngularJS user.

- Target: ``
- Now: AngularJS name `CustomerController` is bridged to `CustomerComponent`.
- After: No bridge registration for `CustomerController` remains.
- Done by: code · Checked by: no registration of `CustomerController` in ``; the project compiles

**T14.3** · check — Check route `home.customers`: it compiles and behaves as before.

- Target: `src/app/customer/customer.routes.ts`
- Now: `home.customers` still runs as AngularJS.
- After: route `home.customers` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches

