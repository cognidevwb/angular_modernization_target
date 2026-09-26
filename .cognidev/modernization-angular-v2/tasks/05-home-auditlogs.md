# Tasks — slice `home.auditLogs`

Units in S3 order; tasks in the order they run.

## 11. `AuditLogsController` (angularjs controller) — 3 tasks

`src/app/audit/index.js`

**T11.1** · create — Create Angular component `AuditLogsComponent` for the screen that AngularJS controller `AuditLogsController` drives.

- Source: `src/app/audit/index.js` L23
- Target: `src/app/audit/index.ts`
- Now: `AuditLogsController` is registered at src/app/audit/index.js:23 with `angular.module('thingsboard.auditLog').controller(…)`.
- After: `src/app/audit/index.ts` exports `AuditLogsComponent`; no AngularJS registration of `AuditLogsController` remains.
- Done by: code · Checked by: `AuditLogsComponent` is exported from `src/app/audit/index.ts`; `.controller('AuditLogsController'` is absent; the project compiles

**T11.2** · add_bridge — Add a bridge so AngularJS `home.auditLogs` can keep using `AuditLogsComponent` until they are migrated.

- Target: ``
- Now: `home.auditLogs` use AngularJS `AuditLogsController`; no bridge to `AuditLogsComponent` exists.
- After: AngularJS name `AuditLogsController` is registered as `downgradeComponent(AuditLogsComponent)`; `home.auditLogs` still work.
- Done by: code · Checked by: the registration is present; the screens of `home.auditLogs` still render

**T11.3** · check — Check `AuditLogsComponent`: it compiles and behaves as before.

- Target: `src/app/audit/index.ts`
- Now: `AuditLogsController` still runs as AngularJS.
- After: `AuditLogsComponent` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches; the `home.auditLogs` page renders


## 12. `home.auditLogs` (route ui-router) — 3 tasks

`src/app/audit/audit-log.routes.js`

**T12.1** · change — Change route `home.auditLogs` from a ui-router state to an Angular Router route.

- Source: `src/app/audit/audit-log.routes.js` L25
- Target: `the Angular route table`
- Now: ui-router state `home.auditLogs` is defined at src/app/audit/audit-log.routes.js:25.
- After: An Angular `Routes` entry for `home.auditLogs` shows the same view; the ui-router state is gone.
- Done by: code · Checked by: the `home.auditLogs` page renders; `.state('home.auditLogs'` is absent

**T12.2** · remove_bridge — Remove the bridge for `AuditLogsComponent`: `home.auditLogs` was its last AngularJS user.

- Target: ``
- Now: AngularJS name `AuditLogsController` is bridged to `AuditLogsComponent`.
- After: No bridge registration for `AuditLogsController` remains.
- Done by: code · Checked by: no registration of `AuditLogsController` in ``; the project compiles

**T12.3** · check — Check route `home.auditLogs`: it compiles and behaves as before.

- Target: `src/app/audit/audit-log.routes.ts`
- Now: `home.auditLogs` still runs as AngularJS.
- After: route `home.auditLogs` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches

