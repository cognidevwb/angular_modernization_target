# Tasks — slice `home.jsonform`

Units in S3 order; tasks in the order they run.

## 25. `JsonFormController` (angularjs controller) — 3 tasks

`src/app/jsonform/index.js`

**T25.1** · create — Create Angular component `JsonFormComponent` for the screen that AngularJS controller `JsonFormController` drives.

- Source: `src/app/jsonform/index.js` L24
- Target: `src/app/jsonform/index.ts`
- Now: `JsonFormController` is registered at src/app/jsonform/index.js:24 with `angular.module('thingsboard.jsonform').controller(…)`.
- After: `src/app/jsonform/index.ts` exports `JsonFormComponent`; no AngularJS registration of `JsonFormController` remains.
- Done by: code · Checked by: `JsonFormComponent` is exported from `src/app/jsonform/index.ts`; `.controller('JsonFormController'` is absent; the project compiles

**T25.2** · add_bridge — Add a bridge so AngularJS `home.jsonform` can keep using `JsonFormComponent` until they are migrated.

- Target: ``
- Now: `home.jsonform` use AngularJS `JsonFormController`; no bridge to `JsonFormComponent` exists.
- After: AngularJS name `JsonFormController` is registered as `downgradeComponent(JsonFormComponent)`; `home.jsonform` still work.
- Done by: code · Checked by: the registration is present; the screens of `home.jsonform` still render

**T25.3** · check — Check `JsonFormComponent`: it compiles and behaves as before.

- Target: `src/app/jsonform/index.ts`
- Now: `JsonFormController` still runs as AngularJS.
- After: `JsonFormComponent` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches; the `home.jsonform` page renders


## 26. `home.jsonform` (route ui-router) — 3 tasks

`src/app/jsonform/jsonform.routes.js`

**T26.1** · change — Change route `home.jsonform` from a ui-router state to an Angular Router route.

- Source: `src/app/jsonform/jsonform.routes.js` L25
- Target: `the Angular route table`
- Now: ui-router state `home.jsonform` is defined at src/app/jsonform/jsonform.routes.js:25.
- After: An Angular `Routes` entry for `home.jsonform` shows the same view; the ui-router state is gone.
- Done by: code · Checked by: the `home.jsonform` page renders; `.state('home.jsonform'` is absent

**T26.2** · remove_bridge — Remove the bridge for `JsonFormComponent`: `home.jsonform` was its last AngularJS user.

- Target: ``
- Now: AngularJS name `JsonFormController` is bridged to `JsonFormComponent`.
- After: No bridge registration for `JsonFormController` remains.
- Done by: code · Checked by: no registration of `JsonFormController` in ``; the project compiles

**T26.3** · check — Check route `home.jsonform`: it compiles and behaves as before.

- Target: `src/app/jsonform/jsonform.routes.ts`
- Now: `home.jsonform` still runs as AngularJS.
- After: route `home.jsonform` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches

