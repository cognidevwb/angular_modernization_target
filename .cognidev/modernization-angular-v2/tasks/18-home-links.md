# Tasks — slice `home.links`

Units in S3 order; tasks in the order they run.

## 27. `HomeLinksController` (angularjs controller) — 3 tasks

`src/app/home/index.js`

**T27.1** · create — Create Angular component `HomeLinksComponent` for the screen that AngularJS controller `HomeLinksController` drives.

- Source: `src/app/home/index.js` L21
- Target: `src/app/home/index.ts`
- Now: `HomeLinksController` is registered at src/app/home/index.js:21 with `angular.module('thingsboard.homeLinks').controller(…)`.
- After: `src/app/home/index.ts` exports `HomeLinksComponent`; no AngularJS registration of `HomeLinksController` remains.
- Done by: code · Checked by: `HomeLinksComponent` is exported from `src/app/home/index.ts`; `.controller('HomeLinksController'` is absent; the project compiles

**T27.2** · add_bridge — Add a bridge so AngularJS `home.links` can keep using `HomeLinksComponent` until they are migrated.

- Target: ``
- Now: `home.links` use AngularJS `HomeLinksController`; no bridge to `HomeLinksComponent` exists.
- After: AngularJS name `HomeLinksController` is registered as `downgradeComponent(HomeLinksComponent)`; `home.links` still work.
- Done by: code · Checked by: the registration is present; the screens of `home.links` still render

**T27.3** · check — Check `HomeLinksComponent`: it compiles and behaves as before.

- Target: `src/app/home/index.ts`
- Now: `HomeLinksController` still runs as AngularJS.
- After: `HomeLinksComponent` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches; the `home.links` page renders


## 28. `home.links` (route ui-router) — 3 tasks

`src/app/home/home-links.routes.js`

**T28.1** · change — Change route `home.links` from a ui-router state to an Angular Router route.

- Source: `src/app/home/home-links.routes.js` L26
- Target: `the Angular route table`
- Now: ui-router state `home.links` is defined at src/app/home/home-links.routes.js:26.
- After: An Angular `Routes` entry for `home.links` shows the same view; the ui-router state is gone.
- Done by: code · Checked by: the `home.links` page renders; `.state('home.links'` is absent

**T28.2** · remove_bridge — Remove the bridge for `HomeLinksComponent`: `home.links` was its last AngularJS user.

- Target: ``
- Now: AngularJS name `HomeLinksController` is bridged to `HomeLinksComponent`.
- After: No bridge registration for `HomeLinksController` remains.
- Done by: code · Checked by: no registration of `HomeLinksController` in ``; the project compiles

**T28.3** · check — Check route `home.links`: it compiles and behaves as before.

- Target: `src/app/home/home-links.routes.ts`
- Now: `home.links` still runs as AngularJS.
- After: route `home.links` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches

