# Tasks — slice `home.settings.outgoing-mail`

Units in S3 order; tasks in the order they run.

## 39. `home.settings.outgoing-mail` (route ui-router) — 3 tasks

`src/app/admin/admin.routes.js`

**T39.1** · change — Change route `home.settings.outgoing-mail` from a ui-router state to an Angular Router route.

- Source: `src/app/admin/admin.routes.js` L55
- Target: `the Angular route table`
- Now: ui-router state `home.settings.outgoing-mail` is defined at src/app/admin/admin.routes.js:55.
- After: An Angular `Routes` entry for `home.settings.outgoing-mail` shows the same view; the ui-router state is gone.
- Done by: code · Checked by: the `home.settings.outgoing-mail` page renders; `.state('home.settings.outgoing-mail'` is absent

**T39.2** · remove_bridge — Remove the bridge for `AdminComponent`: `home.settings.outgoing-mail` was its last AngularJS user.

- Target: ``
- Now: AngularJS name `AdminController` is bridged to `AdminComponent`.
- After: No bridge registration for `AdminController` remains.
- Done by: code · Checked by: no registration of `AdminController` in ``; the project compiles

**T39.3** · check — Check route `home.settings.outgoing-mail`: it compiles and behaves as before.

- Target: `src/app/admin/admin.routes.ts`
- Now: `home.settings.outgoing-mail` still runs as AngularJS.
- After: route `home.settings.outgoing-mail` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches

