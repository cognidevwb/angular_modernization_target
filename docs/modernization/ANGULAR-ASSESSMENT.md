# Angular assessment — AngularJS

Flavor: **angularjs**. Page owner: **angularjs**. Versions: angularjs 1.5.8 (package-lock.json); angularjs 1.5.8, declared only (package.json#dependencies).

## Ownership ledger

| | |
|---|---|
| Legacy routes | 36 |
| Routes owned by the modern half | 0 |
| Legacy routes with a static closure | 35 |
| Legacy units remaining | 255 in 123 files |
| Modern components / services | 0 / 0 |
| Bridge: angularjs-provider-lookup (angularjs-to-angular) | 26 |

- boots: angularjs ng-app in src/index.html:19

## The migrated half against the target pattern

Modern root `src/app-ng`, legacy root ``. Verdict: **none-yet** — nothing has been migrated yet; the target conventions come from this playbook's rules, not from the code.

- **di-style**: majority constructor DI (0 modules); differing: none
- **standalone**: majority standalone components (0 modules); differing: none

| Module | Files | Components | Standalone | Services | Specs | Defect files | Verdict |
|---|---|---|---|---|---|---|---|

### Fix-forward before replicating

Nothing: no defect check fired on the migrated half.

## Strangle order

35 routes movable by reading, 0 composed at runtime, 1 with no static closure. Batch 1, gate `build-and-suite`, router ownership `modern-owns`. Fix-forward tasks come first.

### Before the first route: the router hand-over

The modern half is to own the URL, and no Angular Router is wired under the modern root; a route moved before this has nowhere to land.
- Modern routes file: none found under the modern root
- Legacy router: `ui-router` in `src/app/admin/admin.routes.js`
- Upgrade bootstraps: none
- Files already importing `UpgradeModule`: none
- Location sync between the two routers: absent

| # | Route | Files | Legacy units | Modern units | Coupling signals | Unresolved |
|---|---|---|---|---|---|---|
| 1 | `dashboard` | 1 | 1 | 0 | 0 | 0 |
| 2 | `home` | 1 | 1 | 0 | 0 | 0 |
| 3 | `home.assets` | 1 | 1 | 0 | 0 | 0 |
| 4 | `home.auditLogs` | 1 | 1 | 0 | 0 | 0 |
| 5 | `home.customers` | 1 | 1 | 0 | 0 | 0 |
| 6 | `home.customers.assets` | 1 | 1 | 0 | 0 | 0 |
| 7 | `home.customers.dashboards` | 1 | 1 | 0 | 0 | 0 |
| 8 | `home.customers.dashboards.dashboard` | 1 | 1 | 0 | 0 | 0 |
| 9 | `home.customers.devices` | 1 | 1 | 0 | 0 | 0 |
| 10 | `home.customers.entityViews` | 1 | 1 | 0 | 0 | 0 |
| 11 | `home.customers.users` | 1 | 1 | 0 | 0 | 0 |
| 12 | `home.dashboards` | 1 | 1 | 0 | 0 | 0 |
| 13 | `home.dashboards.dashboard` | 1 | 1 | 0 | 0 | 0 |
| 14 | `home.devices` | 1 | 1 | 0 | 0 | 0 |
| 15 | `home.entityViews` | 1 | 1 | 0 | 0 | 0 |
| 16 | `home.jsonform` | 1 | 1 | 0 | 0 | 0 |
| 17 | `home.links` | 1 | 1 | 0 | 0 | 0 |
| 18 | `home.profile` | 1 | 1 | 0 | 0 | 0 |
| 19 | `home.ruleChains` | 1 | 1 | 0 | 0 | 0 |
| 20 | `home.ruleChains.importRuleChain` | 1 | 1 | 0 | 0 | 0 |
| 21 | `home.ruleChains.ruleChain` | 1 | 1 | 0 | 0 | 0 |
| 22 | `home.settings.general` | 1 | 1 | 0 | 0 | 0 |
| 23 | `home.settings.outgoing-mail` | 1 | 1 | 0 | 0 | 0 |
| 24 | `home.settings.security-settings` | 1 | 1 | 0 | 0 | 0 |
| 25 | `home.tenants` | 1 | 1 | 0 | 0 | 0 |
| 26 | `home.tenants.users` | 1 | 1 | 0 | 0 | 0 |
| 27 | `home.widgets-bundles` | 1 | 1 | 0 | 0 | 0 |
| 28 | `home.widgets-bundles.widget-types` | 1 | 1 | 0 | 0 | 0 |
| 29 | `home.widgets-bundles.widget-types.widget-type` | 1 | 1 | 0 | 0 | 0 |
| 30 | `login` | 1 | 1 | 0 | 0 | 0 |
| 31 | `login.createPassword` | 1 | 1 | 0 | 0 | 0 |
| 32 | `login.resetExpiredPassword` | 1 | 1 | 0 | 0 | 0 |
| 33 | `login.resetPassword` | 1 | 1 | 0 | 0 | 0 |
| 34 | `login.resetPasswordRequest` | 1 | 1 | 0 | 0 | 0 |
| 35 | `widgetEditor` | 1 | 1 | 0 | 0 | 0 |

### What no route reaches — 107 file(s), 168 unit(s)

The shell and what only the shell uses. Ported as file batches after the routes; no URL moves for them.

- `src/app/api/admin.service.js` — 1 factory
- `src/app/api/alarm.service.js` — 1 factory
- `src/app/api/asset.service.js` — 1 factory
- `src/app/api/attribute.service.js` — 1 factory
- `src/app/api/audit-log.service.js` — 1 factory
- `src/app/api/component-descriptor.service.js` — 1 factory
- `src/app/api/customer.service.js` — 1 factory
- `src/app/api/dashboard.service.js` — 1 factory
- `src/app/api/datasource.service.js` — 1 factory
- `src/app/api/device.service.js` — 1 factory
- `src/app/api/entity-relation.service.js` — 1 factory
- `src/app/api/entity-view.service.js` — 1 factory
- `src/app/api/entity.service.js` — 1 factory
- `src/app/api/event.service.js` — 1 factory
- `src/app/api/login.service.js` — 1 factory
- `src/app/api/queue.service.js` — 1 factory
- `src/app/api/rule-chain.service.js` — 1 factory
- `src/app/api/telemetry-websocket.service.js` — 1 factory
- `src/app/api/tenant.service.js` — 1 factory
- `src/app/api/time.service.js` — 1 factory
- … and 87 more

### No static closure

  - `home.settings`

## Analyzer findings

- warning · AngularJS DI or route tokens do not resolve to a captured registration
- info · some AngularJS registration implementations could not be resolved to a local function declaration
- warning · AngularJS registrations use parameter-name injection without an inline array or $inject annotation
- error · static component or route template references point to files that do not exist
- info · 2 vendored, minified, or generated source file(s) were excluded from the application graph
- info · some static routes have no controller, component, or template registration seed; inspect their runtime composition before treating the closure as complete
- warning · $compile/runtime compilation is present; static template analysis cannot fully resolve those views
