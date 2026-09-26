# Tasks — slice `home.profile`

Units in S3 order; tasks in the order they run.

## 29. `ProfileController` (angularjs controller) — 3 tasks

`src/app/profile/index.js`

**T29.1** · create — Create Angular component `ProfileComponent` for the screen that AngularJS controller `ProfileController` drives.

- Source: `src/app/profile/index.js` L27
- Target: `src/app/profile/index.ts`
- Now: `ProfileController` is registered at src/app/profile/index.js:27 with `angular.module('thingsboard.profile').controller(…)`.
- After: `src/app/profile/index.ts` exports `ProfileComponent`; no AngularJS registration of `ProfileController` remains.
- Done by: code · Checked by: `ProfileComponent` is exported from `src/app/profile/index.ts`; `.controller('ProfileController'` is absent; the project compiles

**T29.2** · add_bridge — Add a bridge so AngularJS `home.profile` can keep using `ProfileComponent` until they are migrated.

- Target: ``
- Now: `home.profile` use AngularJS `ProfileController`; no bridge to `ProfileComponent` exists.
- After: AngularJS name `ProfileController` is registered as `downgradeComponent(ProfileComponent)`; `home.profile` still work.
- Done by: code · Checked by: the registration is present; the screens of `home.profile` still render

**T29.3** · check — Check `ProfileComponent`: it compiles and behaves as before.

- Target: `src/app/profile/index.ts`
- Now: `ProfileController` still runs as AngularJS.
- After: `ProfileComponent` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches; the `home.profile` page renders


## 30. `home.profile` (route ui-router) — 3 tasks

`src/app/profile/profile.routes.js`

**T30.1** · change — Change route `home.profile` from a ui-router state to an Angular Router route.

- Source: `src/app/profile/profile.routes.js` L26
- Target: `the Angular route table`
- Now: ui-router state `home.profile` is defined at src/app/profile/profile.routes.js:26.
- After: An Angular `Routes` entry for `home.profile` shows the same view; the ui-router state is gone.
- Done by: code · Checked by: the `home.profile` page renders; `.state('home.profile'` is absent

**T30.2** · remove_bridge — Remove the bridge for `ProfileComponent`: `home.profile` was its last AngularJS user.

- Target: ``
- Now: AngularJS name `ProfileController` is bridged to `ProfileComponent`.
- After: No bridge registration for `ProfileController` remains.
- Done by: code · Checked by: no registration of `ProfileController` in ``; the project compiles

**T30.3** · check — Check route `home.profile`: it compiles and behaves as before.

- Target: `src/app/profile/profile.routes.ts`
- Now: `home.profile` still runs as AngularJS.
- After: route `home.profile` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches

