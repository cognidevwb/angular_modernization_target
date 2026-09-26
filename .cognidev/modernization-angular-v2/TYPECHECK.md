# Type check of the generated files (S6b)

tsc with the project's tsconfig over 255 generated files: 1002 errors on the first run; 0 fixed without changing what runs (a non-null `!`, a unary `+`); 1002 left: 16 the old code has the same way, 986 the port must change (in the gap list).

## The port must change

| File | Line | Code | Error | Why |
|---|---|---|---|---|
| `src/app-ng/feature/admin/admin/admin.component.ts` | 47 | TS2349 | This expression is not callable. Type 'TranslateService' has no call signatures. |  |
| `src/app-ng/feature/admin/admin/admin.component.ts` | 56 | TS2339 | Property '$current' does not exist on type 'Router'. |  |
| `src/app-ng/feature/alarm/alarm-details-dialog/alarm-details-dialog.component.ts` | 25 | TS2304 | Cannot find name 'beautify'. |  |
| `src/app-ng/feature/alarm/alarm-details-dialog/alarm-details-dialog.component.ts` | 165 | TS2339 | Property 'hide' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/alarm/tb-alarm-header/tb-alarm-header.directive.ts` | 5 | TS2307 | Cannot find module '../../../../app/alarm/alarm-header.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/alarm/tb-alarm-row/tb-alarm-row.directive.ts` | 10 | TS2307 | Cannot find module '../../../../app/alarm/alarm-details-dialog.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/alarm/tb-alarm-row/tb-alarm-row.directive.ts` | 11 | TS2307 | Cannot find module '../../../../app/alarm/alarm-row.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/alarm/tb-alarm-row/tb-alarm-row.directive.ts` | 29 | TS2353 | Object literal may only specify known properties, and 'imports' does not exist in type 'Directive'. |  |
| `src/app-ng/feature/alarm/tb-alarm-row/tb-alarm-row.directive.ts` | 58 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/alarm/tb-alarm-table/tb-alarm-table.directive.ts` | 14 | TS2307 | Cannot find module '../../../../app/alarm/alarm-table.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/api/services/admin.service.ts` | 24 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/admin.service.ts` | 35 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/admin.service.ts` | 46 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/admin.service.ts` | 57 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/admin.service.ts` | 68 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/admin.service.ts` | 79 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/alarm.service.ts` | 53 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/alarm.service.ts` | 68 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/alarm.service.ts` | 83 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/alarm.service.ts` | 98 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/alarm.service.ts` | 113 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/alarm.service.ts` | 128 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/alarm.service.ts` | 162 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/alarm.service.ts` | 179 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/asset.service.ts` | 33 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/asset.service.ts` | 51 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/asset.service.ts` | 74 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/asset.service.ts` | 89 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/asset.service.ts` | 104 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/asset.service.ts` | 119 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/asset.service.ts` | 134 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/asset.service.ts` | 157 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/asset.service.ts` | 192 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/asset.service.ts` | 220 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/asset.service.ts` | 257 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/asset.service.ts` | 269 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/attribute.service.ts` | 39 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/attribute.service.ts` | 70 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/attribute.service.ts` | 84 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/attribute.service.ts` | 128 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/attribute.service.ts` | 226 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/attribute.service.ts` | 275 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/attribute.service.ts` | 317 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/attribute.service.ts` | 339 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/audit-log.service.ts` | 34 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/audit-log.service.ts` | 55 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/audit-log.service.ts` | 76 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/audit-log.service.ts` | 97 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/component-descriptor.service.ts` | 31 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/component-descriptor.service.ts` | 60 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/component-descriptor.service.ts` | 87 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/component-descriptor.service.ts` | 103 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/customer.service.ts` | 34 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/customer.service.ts` | 45 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/customer.service.ts` | 56 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/customer.service.ts` | 139 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/customer.service.ts` | 150 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/dashboard.service.ts` | 49 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/dashboard.service.ts` | 69 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/dashboard.service.ts` | 83 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/dashboard.service.ts` | 103 | TS2769 | No overload matches this call. The last overload gave the following error. Object literal may only specify known properties, and 'ignoreLoading' does not exist in type '{ observe?: "body"; responseType?: "json"; } & HttpClientCommonOptions'. |  |
| `src/app-ng/feature/api/services/dashboard.service.ts` | 103 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/dashboard.service.ts` | 118 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/dashboard.service.ts` | 129 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/dashboard.service.ts` | 140 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/dashboard.service.ts` | 151 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/dashboard.service.ts` | 162 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/dashboard.service.ts` | 173 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/dashboard.service.ts` | 184 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/dashboard.service.ts` | 195 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/dashboard.service.ts` | 206 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/dashboard.service.ts` | 217 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/dashboard.service.ts` | 228 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/dashboard.service.ts` | 237 | TS2339 | Property 'protocol' does not exist on type 'Router'. |  |
| `src/app-ng/feature/api/services/dashboard.service.ts` | 237 | TS2339 | Property 'host' does not exist on type 'Router'. |  |
| `src/app-ng/feature/api/services/dashboard.service.ts` | 238 | TS2339 | Property 'port' does not exist on type 'Router'. |  |
| `src/app-ng/feature/api/services/datasource.service.ts` | 46 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/api/services/datasource.service.ts` | 80 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/api/services/datasource.service.ts` | 398 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/api/services/datasource.service.ts` | 407 | TS2304 | Cannot find name 'DataAggregator'. |  |
| `src/app-ng/feature/api/services/datasource.service.ts` | 648 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/api/services/datasource.service.ts` | 718 | TS2350 | Only a void function can be called with the 'new' keyword. |  |
| `src/app-ng/feature/api/services/device.service.ts` | 46 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/device.service.ts` | 81 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/device.service.ts` | 109 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/device.service.ts` | 127 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/device.service.ts` | 147 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/device.service.ts` | 158 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/device.service.ts` | 182 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/device.service.ts` | 195 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/device.service.ts` | 206 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/device.service.ts` | 217 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/device.service.ts` | 228 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/device.service.ts` | 259 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/device.service.ts` | 270 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/device.service.ts` | 285 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/device.service.ts` | 296 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/device.service.ts` | 308 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/device.service.ts` | 321 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/device.service.ts` | 332 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/entity-relation.service.ts` | 24 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/entity-relation.service.ts` | 39 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/entity-relation.service.ts` | 51 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/entity-relation.service.ts` | 66 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/entity-relation.service.ts` | 78 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/entity-relation.service.ts` | 90 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/entity-relation.service.ts` | 103 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/entity-relation.service.ts` | 115 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/entity-relation.service.ts` | 127 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/entity-relation.service.ts` | 140 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/entity-relation.service.ts` | 151 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/entity-relation.service.ts` | 162 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/entity-view.service.ts` | 44 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/entity-view.service.ts` | 79 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/entity-view.service.ts` | 107 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/entity-view.service.ts` | 119 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/entity-view.service.ts` | 130 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/entity-view.service.ts` | 141 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/entity-view.service.ts` | 152 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/entity-view.service.ts` | 179 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/entity-view.service.ts` | 190 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/entity-view.service.ts` | 201 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/entity.service.ts` | 948 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/event.service.ts` | 34 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/login.service.ts` | 33 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/login.service.ts` | 46 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/login.service.ts` | 57 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/login.service.ts` | 68 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/login.service.ts` | 82 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/login.service.ts` | 93 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/login.service.ts` | 104 | TS2554 | Expected 2-3 arguments, but got 1. |  |
| `src/app-ng/feature/api/services/login.service.ts` | 104 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/queue.service.ts` | 25 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/rule-chain.service.ts` | 44 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/rule-chain.service.ts` | 55 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/rule-chain.service.ts` | 66 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/rule-chain.service.ts` | 77 | TS2554 | Expected 2-3 arguments, but got 1. |  |
| `src/app-ng/feature/api/services/rule-chain.service.ts` | 77 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/rule-chain.service.ts` | 88 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/rule-chain.service.ts` | 99 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/rule-chain.service.ts` | 110 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/rule-chain.service.ts` | 272 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/rule-chain.service.ts` | 283 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/tenant.service.ts` | 33 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/tenant.service.ts` | 44 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/tenant.service.ts` | 55 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/tenant.service.ts` | 66 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/time.service.ts` | 20 | TS2448 | Block-scoped variable 'DAY' used before its declaration. |  |
| `src/app-ng/feature/api/services/time.service.ts` | 22 | TS2448 | Block-scoped variable 'HOUR' used before its declaration. |  |
| `src/app-ng/feature/api/services/time.service.ts` | 54 | TS2769 | No overload matches this call. The last overload gave the following error. Object literal may only specify known properties, and 'ignoreLoading' does not exist in type '{ observe?: "body"; responseType?: "json"; } & HttpClientCommonOptions'. |  |
| `src/app-ng/feature/api/services/time.service.ts` | 54 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/user.service.ts` | 130 | TS2769 | No overload matches this call. The last overload gave the following error. Object literal may only specify known properties, and 'ignoreErrors' does not exist in type 'HttpClientCommonOptions'. |  |
| `src/app-ng/feature/api/services/user.service.ts` | 130 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/user.service.ts` | 200 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/user.service.ts` | 346 | TS2339 | Property 'search' does not exist on type 'Router'. |  |
| `src/app-ng/feature/api/services/user.service.ts` | 355 | TS2339 | Property 'search' does not exist on type 'Router'. |  |
| `src/app-ng/feature/api/services/user.service.ts` | 361 | TS2339 | Property 'search' does not exist on type 'Router'. |  |
| `src/app-ng/feature/api/services/user.service.ts` | 363 | TS2339 | Property 'search' does not exist on type 'Router'. |  |
| `src/app-ng/feature/api/services/user.service.ts` | 381 | TS2339 | Property 'search' does not exist on type 'Router'. |  |
| `src/app-ng/feature/api/services/user.service.ts` | 382 | TS2339 | Property 'search' does not exist on type 'Router'. |  |
| `src/app-ng/feature/api/services/user.service.ts` | 399 | TS2339 | Property 'search' does not exist on type 'Router'. |  |
| `src/app-ng/feature/api/services/user.service.ts` | 411 | TS2349 | This expression is not callable. Type 'TranslateService' has no call signatures. |  |
| `src/app-ng/feature/api/services/user.service.ts` | 413 | TS2339 | Property 'alert' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/api/services/user.service.ts` | 417 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/api/services/user.service.ts` | 425 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/user.service.ts` | 481 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/user.service.ts` | 501 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/user.service.ts` | 515 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/user.service.ts` | 529 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/user.service.ts` | 544 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/user.service.ts` | 555 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/user.service.ts` | 566 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/user.service.ts` | 577 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/user.service.ts` | 633 | TS2339 | Property 'go' does not exist on type 'Router'. |  |
| `src/app-ng/feature/api/services/user.service.ts` | 635 | TS2339 | Property 'go' does not exist on type 'Router'. |  |
| `src/app-ng/feature/api/services/user.service.ts` | 668 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/widget.service.ts` | 265 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/widget.service.ts` | 387 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/widget.service.ts` | 400 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/widget.service.ts` | 416 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/widget.service.ts` | 437 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/widget.service.ts` | 459 | TS2345 | Argument of type 'string' is not assignable to parameter of type 'number'. |  |
| `src/app-ng/feature/api/services/widget.service.ts` | 666 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/widget.service.ts` | 678 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/api/services/widget.service.ts` | 692 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/widget.service.ts` | 710 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/api/services/widget.service.ts` | 723 | TS2339 | Property 'then' does not exist on type 'Observable<Object>'. |  |
| `src/app-ng/feature/asset/add-assets-to-customer/add-assets-to-customer.component.ts` | 95 | TS2339 | Property 'cancel' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/asset/add-assets-to-customer/add-assets-to-customer.component.ts` | 104 | TS2339 | Property 'hide' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/asset/asset/asset.component.ts` | 24 | TS2307 | Cannot find module '../../../../app/asset/add-asset.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/asset/asset/asset.component.ts` | 25 | TS2307 | Cannot find module '../../../../app/asset/asset-card.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/asset/asset/asset.component.ts` | 26 | TS2307 | Cannot find module '../../../../app/asset/assign-to-customer.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/asset/asset/asset.component.ts` | 27 | TS2307 | Cannot find module '../../../../app/asset/add-assets-to-customer.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/asset/asset/asset.component.ts` | 136 | TS2339 | Property '$current' does not exist on type 'Router'. |  |
| `src/app-ng/feature/asset/asset/asset.component.ts` | 417 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/asset/asset/asset.component.ts` | 454 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/asset/asset/asset.component.ts` | 495 | TS2339 | Property 'confirm' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/asset/asset/asset.component.ts` | 502 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/asset/asset/asset.component.ts` | 510 | TS2339 | Property 'confirm' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/asset/asset/asset.component.ts` | 517 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/asset/asset/asset.component.ts` | 532 | TS2339 | Property 'confirm' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/asset/asset/asset.component.ts` | 539 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/asset/assign-asset-to-customer/assign-asset-to-customer.component.ts` | 98 | TS2339 | Property 'cancel' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/asset/assign-asset-to-customer/assign-asset-to-customer.component.ts` | 107 | TS2339 | Property 'hide' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/asset/tb-asset/tb-asset.directive.ts` | 12 | TS2307 | Cannot find module '../../../../app/asset/asset-fieldset.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/audit/audit-log-details-dialog/audit-log-details-dialog.component.ts` | 110 | TS2339 | Property 'hide' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/audit/tb-audit-log-header/tb-audit-log-header.directive.ts` | 7 | TS2307 | Cannot find module '../../../../app/audit/audit-log-header.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/audit/tb-audit-log-row/tb-audit-log-row.directive.ts` | 10 | TS2307 | Cannot find module '../../../../app/audit/audit-log-details-dialog.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/audit/tb-audit-log-row/tb-audit-log-row.directive.ts` | 11 | TS2307 | Cannot find module '../../../../app/audit/audit-log-row.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/audit/tb-audit-log-row/tb-audit-log-row.directive.ts` | 29 | TS2353 | Object literal may only specify known properties, and 'imports' does not exist in type 'Directive'. |  |
| `src/app-ng/feature/audit/tb-audit-log-row/tb-audit-log-row.directive.ts` | 60 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/audit/tb-audit-log-table/tb-audit-log-table.directive.ts` | 15 | TS2307 | Cannot find module '../../../../app/audit/audit-log-table.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/audit/tb-audit-log-table/tb-audit-log-table.directive.ts` | 159 | TS2769 | No overload matches this call. Overload 1 of 2, '(value: any, replacer?: (this: any, key: string, value: any) => any, space?: string \| number): string', gave the following error. Argument of type 'boolean' is not assignable to parameter of type '(this: any, key: string, value: any) => any'. Overload 2 of 2, '(value: any, replacer?: (string \| number)[], space?: string \| number): string', gave the following error. Argument of type 'boolean' is not assignable to parameter of type '(string \| number)[]'. |  |
| `src/app-ng/feature/common/services/$md-color-picker.service.ts` | 50 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/common/services/$md-color-picker.service.ts` | 59 | TS2339 | Property 'cancel' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/common/services/$md-color-picker.service.ts` | 63 | TS2339 | Property 'hide' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/common/services/$mdp-date-picker.service.ts` | 12 | TS2686 | 'moment' refers to a UMD global, but the current file is a module. Consider adding an import instead. |  |
| `src/app-ng/feature/common/services/$mdp-date-picker.service.ts` | 13 | TS2686 | 'moment' refers to a UMD global, but the current file is a module. Consider adding an import instead. |  |
| `src/app-ng/feature/common/services/$mdp-date-picker.service.ts` | 13 | TS2686 | 'moment' refers to a UMD global, but the current file is a module. Consider adding an import instead. |  |
| `src/app-ng/feature/common/services/$mdp-date-picker.service.ts` | 14 | TS2686 | 'moment' refers to a UMD global, but the current file is a module. Consider adding an import instead. |  |
| `src/app-ng/feature/common/services/$mdp-date-picker.service.ts` | 14 | TS2686 | 'moment' refers to a UMD global, but the current file is a module. Consider adding an import instead. |  |
| `src/app-ng/feature/common/services/$mdp-date-picker.service.ts` | 22 | TS2686 | 'moment' refers to a UMD global, but the current file is a module. Consider adding an import instead. |  |
| `src/app-ng/feature/common/services/$mdp-date-picker.service.ts` | 29 | TS2686 | 'moment' refers to a UMD global, but the current file is a module. Consider adding an import instead. |  |
| `src/app-ng/feature/common/services/$mdp-date-picker.service.ts` | 34 | TS2686 | 'moment' refers to a UMD global, but the current file is a module. Consider adding an import instead. |  |
| `src/app-ng/feature/common/services/$mdp-date-picker.service.ts` | 85 | TS2686 | 'moment' refers to a UMD global, but the current file is a module. Consider adding an import instead. |  |
| `src/app-ng/feature/common/services/$mdp-date-picker.service.ts` | 89 | TS2686 | 'moment' refers to a UMD global, but the current file is a module. Consider adding an import instead. |  |
| `src/app-ng/feature/common/services/$mdp-time-picker.service.ts` | 14 | TS2686 | 'moment' refers to a UMD global, but the current file is a module. Consider adding an import instead. |  |
| `src/app-ng/feature/common/services/utils.service.ts` | 6 | TS2307 | Cannot find module 'raw-loader!material-design-icons/iconfont/codepoints' or its corresponding type declarations. |  |
| `src/app-ng/feature/components/add-item/add-item.component.ts` | 33 | TS2339 | Property 'cancel' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/components/add-item/add-item.component.ts` | 40 | TS2339 | Property 'hide' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/components/datakey-config-dialog/datakey-config-dialog.component.ts` | 56 | TS2339 | Property 'hide' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/components/datakey-config-dialog/datakey-config-dialog.component.ts` | 60 | TS2339 | Property 'cancel' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/components/datakey-config-dialog/datakey-config-dialog.component.ts` | 92 | TS2339 | Property 'hide' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/components/material-icons-dialog/material-icons-dialog.component-2.ts` | 73 | TS2339 | Property 'cancel' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/components/material-icons-dialog/material-icons-dialog.component-2.ts` | 78 | TS2339 | Property 'hide' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/components/material-icons-dialog/material-icons-dialog.component.ts` | 56 | TS2339 | Property 'cancel' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/components/material-icons-dialog/material-icons-dialog.component.ts` | 61 | TS2339 | Property 'hide' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/components/pipes/contact-short.pipe.ts` | 37 | TS2304 | Cannot find name '$filter'. |  |
| `src/app-ng/feature/components/pipes/keyboard-shortcut.pipe.ts` | 12 | TS2304 | Cannot find name '$window'. |  |
| `src/app-ng/feature/components/pipes/milli-seconds-to-time-string.pipe.ts` | 16 | TS2339 | Property 'translate' does not exist on type 'MilliSecondsToTimeStringPipe'. |  |
| `src/app-ng/feature/components/pipes/milli-seconds-to-time-string.pipe.ts` | 21 | TS2339 | Property 'translate' does not exist on type 'MilliSecondsToTimeStringPipe'. |  |
| `src/app-ng/feature/components/pipes/milli-seconds-to-time-string.pipe.ts` | 27 | TS2339 | Property 'translate' does not exist on type 'MilliSecondsToTimeStringPipe'. |  |
| `src/app-ng/feature/components/pipes/milli-seconds-to-time-string.pipe.ts` | 33 | TS2339 | Property 'translate' does not exist on type 'MilliSecondsToTimeStringPipe'. |  |
| `src/app-ng/feature/components/tb-confirm-on-exit/tb-confirm-on-exit.directive.ts` | 49 | TS2339 | Property 'confirm' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/components/tb-confirm-on-exit/tb-confirm-on-exit.directive.ts` | 55 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/components/tb-confirm-on-exit/tb-confirm-on-exit.directive.ts` | 63 | TS2339 | Property 'go' does not exist on type 'Router'. |  |
| `src/app-ng/feature/components/tb-contact/tb-contact.directive.ts` | 6 | TS2307 | Cannot find module '../../../../app/components/contact.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/components/tb-custom-action-pretty-editor/tb-custom-action-pretty-editor.directive.ts` | 9 | TS2307 | Cannot find module '../../../../app/components/widget/action/custom-action-pretty-editor.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/components/tb-custom-action-pretty-editor/tb-custom-action-pretty-editor.directive.ts` | 29 | TS2304 | Cannot find name 'beautify'. |  |
| `src/app-ng/feature/components/tb-custom-action-pretty-editor/tb-custom-action-pretty-editor.directive.ts` | 31 | TS2304 | Cannot find name 'beautify'. |  |
| `src/app-ng/feature/components/tb-dashboard-autocomplete/tb-dashboard-autocomplete.directive.ts` | 7 | TS2307 | Cannot find module '../../../../app/components/dashboard-autocomplete.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/components/tb-dashboard-select/tb-dashboard-select.directive.ts` | 11 | TS2307 | Cannot find module '../../../../app/components/dashboard-select.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/components/tb-dashboard-select/tb-dashboard-select.directive.ts` | 12 | TS2307 | Cannot find module '../../../../app/components/dashboard-select-panel.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/components/tb-dashboard-select/tb-dashboard-select.directive.ts` | 93 | TS2349 | This expression is not callable. Type 'BreakpointObserver' has no call signatures. |  |
| `src/app-ng/feature/components/tb-dashboard-select/tb-dashboard-select.directive.ts` | 110 | TS2339 | Property 'newPanelPosition' does not exist on type 'Overlay'. |  |
| `src/app-ng/feature/components/tb-dashboard-select/tb-dashboard-select.directive.ts` | 136 | TS2339 | Property 'open' does not exist on type 'Overlay'. |  |
| `src/app-ng/feature/components/tb-dashboard/tb-dashboard.directive.ts` | 7 | TS2307 | Cannot find module '../../../../app/components/dashboard.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/components/tb-dashboard/tb-dashboard.directive.ts` | 26 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-dashboard/tb-dashboard.directive.ts` | 27 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-dashboard/tb-dashboard.directive.ts` | 33 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-dashboard/tb-dashboard.directive.ts` | 151 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-dashboard/tb-dashboard.directive.ts` | 158 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-dashboard/tb-dashboard.directive.ts` | 166 | TS2304 | Cannot find name 'addResizeListener'. |  |
| `src/app-ng/feature/components/tb-dashboard/tb-dashboard.directive.ts` | 169 | TS2304 | Cannot find name 'removeResizeListener'. |  |
| `src/app-ng/feature/components/tb-dashboard/tb-dashboard.directive.ts` | 250 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-dashboard/tb-dashboard.directive.ts` | 269 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-dashboard/tb-dashboard.directive.ts` | 287 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-dashboard/tb-dashboard.directive.ts` | 367 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-dashboard/tb-dashboard.directive.ts` | 369 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-dashboard/tb-dashboard.directive.ts` | 415 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-dashboard/tb-dashboard.directive.ts` | 427 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-dashboard/tb-dashboard.directive.ts` | 430 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-dashboard/tb-dashboard.directive.ts` | 489 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-dashboard/tb-dashboard.directive.ts` | 645 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-dashboard/tb-dashboard.directive.ts` | 647 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-dashboard/tb-dashboard.directive.ts` | 776 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-dashboard/tb-dashboard.directive.ts` | 819 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-dashboard/tb-dashboard.directive.ts` | 828 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-dashboard/tb-dashboard.directive.ts` | 877 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-dashboard/tb-dashboard.directive.ts` | 897 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-dashboard/tb-dashboard.directive.ts` | 907 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-dashboard/tb-dashboard.directive.ts` | 910 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-dashboard/tb-dashboard.directive.ts` | 956 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-dashboard/tb-dashboard.directive.ts` | 965 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-dashboard/tb-dashboard.directive.ts` | 975 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-dashboard/tb-dashboard.directive.ts` | 976 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-datakey-config/tb-datakey-config.directive.ts` | 6 | TS2307 | Cannot find module '../../../../app/components/datakey-config.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/components/tb-datakey-config/tb-datakey-config.directive.ts` | 138 | TS2339 | Property 'then' does not exist on type 'void'. |  |
| `src/app-ng/feature/components/tb-datasource-entity/tb-datasource-entity.directive.ts` | 8 | TS2307 | Cannot find module '../../../../app/components/datasource-entity.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/components/tb-datasource-entity/tb-datasource-entity.directive.ts` | 9 | TS2307 | Cannot find module '../../../../app/components/datakey-config-dialog.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/components/tb-datasource-entity/tb-datasource-entity.directive.ts` | 222 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/components/tb-datasource-entity/tb-datasource-entity.directive.ts` | 262 | TS2339 | Property 'then' does not exist on type 'void'. |  |
| `src/app-ng/feature/components/tb-datasource-func/tb-datasource-func.directive.ts` | 9 | TS2307 | Cannot find module '../../../../app/components/datasource-func.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/components/tb-datasource-func/tb-datasource-func.directive.ts` | 10 | TS2307 | Cannot find module '../../../../app/components/datakey-config-dialog.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/components/tb-datasource-func/tb-datasource-func.directive.ts` | 180 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/components/tb-datasource/tb-datasource.directive.ts` | 10 | TS2307 | Cannot find module '../../../../app/components/datasource.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/components/tb-datetime-period/tb-datetime-period.directive.ts` | 6 | TS2307 | Cannot find module '../../../../app/components/datetime-period.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/components/tb-entity-alias-select/tb-entity-alias-select.directive.ts` | 5 | TS2307 | Cannot find module '../../../../app/components/entity-alias-select.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/components/tb-expand-fullscreen/tb-expand-fullscreen.directive.ts` | 67 | TS2322 | Type 'void' is not assignable to type 'OutputEmitterRef<any>'. |  |
| `src/app-ng/feature/components/tb-expand-fullscreen/tb-expand-fullscreen.directive.ts` | 69 | TS2322 | Type 'string' is not assignable to type 'OutputEmitterRef<any>'. |  |
| `src/app-ng/feature/components/tb-expand-fullscreen/tb-expand-fullscreen.directive.ts` | 134 | TS1345 | An expression of type 'void' cannot be tested for truthiness. |  |
| `src/app-ng/feature/components/tb-expand-fullscreen/tb-expand-fullscreen.directive.ts` | 144 | TS1345 | An expression of type 'void' cannot be tested for truthiness. |  |
| `src/app-ng/feature/components/tb-gateway-config-select/tb-gateway-config-select.directive.ts` | 7 | TS2307 | Cannot find module '../../../../app/components/gateway/gateway-config-select.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/components/tb-gateway-config-select/tb-gateway-config-select.directive.ts` | 111 | TS2339 | Property 'confirm' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/components/tb-gateway-config-select/tb-gateway-config-select.directive.ts` | 118 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/components/tb-gateway-config/tb-gateway-config.directive.ts` | 4 | TS2307 | Cannot find module '../../../../app/components/gateway/gateway-config.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/components/tb-gateway-config/tb-gateway-config.directive.ts` | 44 | TS2304 | Cannot find name 'gatewayConfigDialogTemplate'. |  |
| `src/app-ng/feature/components/tb-gateway-config/tb-gateway-config.directive.ts` | 45 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-gateway-config/tb-gateway-config.directive.ts` | 56 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-gateway-config/tb-gateway-config.directive.ts` | 98 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-gateway-config/tb-gateway-config.directive.ts` | 104 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-gateway-config/tb-gateway-config.directive.ts` | 122 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-gateway-config/tb-gateway-config.directive.ts` | 131 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-gateway-config/tb-gateway-config.directive.ts` | 143 | TS2304 | Cannot find name 'beautify'. |  |
| `src/app-ng/feature/components/tb-gateway-form/tb-gateway-form.directive.ts` | 6 | TS2307 | Cannot find module '../../../../app/components/gateway/gateway-form.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/components/tb-gateway-form/tb-gateway-form.directive.ts` | 150 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-gateway-form/tb-gateway-form.directive.ts` | 168 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-gateway-form/tb-gateway-form.directive.ts` | 169 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-gateway-form/tb-gateway-form.directive.ts` | 172 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-gateway-form/tb-gateway-form.directive.ts` | 250 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-gateway-form/tb-gateway-form.directive.ts` | 326 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-gateway-form/tb-gateway-form.directive.ts` | 375 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-gateway-form/tb-gateway-form.directive.ts` | 403 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-grid/tb-grid.directive.ts` | 6 | TS2307 | Cannot find module '../../../../app/components/grid.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/components/tb-grid/tb-grid.directive.ts` | 397 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-grid/tb-grid.directive.ts` | 451 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-grid/tb-grid.directive.ts` | 518 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-grid/tb-grid.directive.ts` | 530 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-js-func/tb-js-func.directive.ts` | 13 | TS2307 | Cannot find module '../../../../app/components/js-func.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/components/tb-js-func/tb-js-func.directive.ts` | 26 | TS2304 | Cannot find name 'beautify'. |  |
| `src/app-ng/feature/components/tb-json-content/tb-json-content.directive.ts` | 13 | TS2307 | Cannot find module '../../../../app/components/json-content.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/components/tb-json-content/tb-json-content.directive.ts` | 24 | TS2304 | Cannot find name 'beautify'. |  |
| `src/app-ng/feature/components/tb-json-form/tb-json-form.directive.ts` | 9 | TS2307 | Cannot find module '../../../../app/components/json-form.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/components/tb-json-form/tb-json-form.directive.ts` | 11 | TS2307 | Cannot find module '../../../../app/components/material-icons-dialog.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/components/tb-json-form/tb-json-form.directive.ts` | 31 | TS2304 | Cannot find name 'ObjectPath'. |  |
| `src/app-ng/feature/components/tb-json-form/tb-json-form.directive.ts` | 226 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/components/tb-json-object-edit/tb-json-object-edit.directive.ts` | 10 | TS2307 | Cannot find module '../../../../app/components/json-object-edit.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/components/tb-json-object-edit/tb-json-object-edit.directive.ts` | 100 | TS2769 | No overload matches this call. Overload 1 of 2, '(value: any, replacer?: (this: any, key: string, value: any) => any, space?: string \| number): string', gave the following error. Argument of type 'boolean' is not assignable to parameter of type '(this: any, key: string, value: any) => any'. Overload 2 of 2, '(value: any, replacer?: (string \| number)[], space?: string \| number): string', gave the following error. Argument of type 'boolean' is not assignable to parameter of type '(string \| number)[]'. |  |
| `src/app-ng/feature/components/tb-json-object-edit/tb-json-object-edit.directive.ts` | 126 | TS2769 | No overload matches this call. Overload 1 of 2, '(value: any, replacer?: (this: any, key: string, value: any) => any, space?: string \| number): string', gave the following error. Argument of type 'number' is not assignable to parameter of type '(this: any, key: string, value: any) => any'. Overload 2 of 2, '(value: any, replacer?: (string \| number)[], space?: string \| number): string', gave the following error. Argument of type 'number' is not assignable to parameter of type '(string \| number)[]'. |  |
| `src/app-ng/feature/components/tb-key-val-map/tb-key-val-map.directive.ts` | 4 | TS2307 | Cannot find module '../../../../app/components/kv-map.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/components/tb-legend-config/tb-legend-config.directive.ts` | 7 | TS2307 | Cannot find module '../../../../app/components/legend-config-button.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/components/tb-legend-config/tb-legend-config.directive.ts` | 8 | TS2307 | Cannot find module '../../../../app/components/legend-config-panel.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/components/tb-legend-config/tb-legend-config.directive.ts` | 91 | TS2339 | Property 'newPanelPosition' does not exist on type 'Overlay'. |  |
| `src/app-ng/feature/components/tb-legend-config/tb-legend-config.directive.ts` | 114 | TS2339 | Property 'open' does not exist on type 'Overlay'. |  |
| `src/app-ng/feature/components/tb-legend/tb-legend.directive.ts` | 7 | TS2307 | Cannot find module '../../../../app/components/legend.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/components/tb-manage-widget-actions/tb-manage-widget-actions.directive.ts` | 3 | TS2307 | Cannot find module '../../../../app/components/widget/action/manage-widget-actions.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/components/tb-manage-widget-actions/tb-manage-widget-actions.directive.ts` | 52 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-manage-widget-actions/tb-manage-widget-actions.directive.ts` | 58 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-manage-widget-actions/tb-manage-widget-actions.directive.ts` | 153 | TS2304 | Cannot find name 'widgetActionDialogTemplate'. |  |
| `src/app-ng/feature/components/tb-manage-widget-actions/tb-manage-widget-actions.directive.ts` | 154 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-manage-widget-actions/tb-manage-widget-actions.directive.ts` | 157 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-manage-widget-actions/tb-manage-widget-actions.directive.ts` | 180 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-manage-widget-actions/tb-manage-widget-actions.directive.ts` | 220 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-material-icon-select/tb-material-icon-select.directive.ts` | 7 | TS2307 | Cannot find module '../../../../app/components/material-icon-select.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/components/tb-material-icon-select/tb-material-icon-select.directive.ts` | 8 | TS2307 | Cannot find module '../../../../app/components/material-icons-dialog.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/components/tb-material-icon-select/tb-material-icon-select.directive.ts` | 65 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/components/tb-menu-link/tb-menu-link.directive.ts` | 7 | TS2307 | Cannot find module '../../../../app/components/menu-link.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/components/tb-menu-link/tb-menu-link.directive.ts` | 8 | TS2307 | Cannot find module '../../../../app/components/menu-toggle.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/components/tb-nav-tree/tb-nav-tree.directive.ts` | 2 | TS2307 | Cannot find module '../../../../app/components/nav-tree.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/components/tb-nav-tree/tb-nav-tree.directive.ts` | 42 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/components/tb-queue-type-list/tb-queue-type-list.directive.ts` | 7 | TS2307 | Cannot find module '../../../../app/components/queue/queue-type-list.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/components/tb-related-entity-autocomplete/tb-related-entity-autocomplete.directive.ts` | 6 | TS2307 | Cannot find module '../../../../app/components/related-entity-autocomplete.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/components/tb-side-menu/tb-side-menu.directive.ts` | 8 | TS2307 | Cannot find module '../../../../app/components/side-menu.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/components/tb-social-share-panel/tb-social-share-panel.directive.ts` | 2 | TS2307 | Cannot find module '../../../../app/components/socialshare-panel.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/components/tb-timeinterval/tb-timeinterval.directive.ts` | 7 | TS2307 | Cannot find module '../../../../app/components/timeinterval.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/components/tb-timewindow/tb-timewindow.directive.ts` | 10 | TS2307 | Cannot find module '../../../../app/components/timewindow-button.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/components/tb-timewindow/tb-timewindow.directive.ts` | 11 | TS2307 | Cannot find module '../../../../app/components/timewindow.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/components/tb-timewindow/tb-timewindow.directive.ts` | 12 | TS2307 | Cannot find module '../../../../app/components/timewindow-panel.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/components/tb-timewindow/tb-timewindow.directive.ts` | 65 | TS2322 | Type 'boolean' is not assignable to type 'OutputEmitterRef<any>'. |  |
| `src/app-ng/feature/components/tb-timewindow/tb-timewindow.directive.ts` | 68 | TS2339 | Property 'onReady' does not exist on type 'TranslateService'. |  |
| `src/app-ng/feature/components/tb-timewindow/tb-timewindow.directive.ts` | 125 | TS2349 | This expression is not callable. Type 'BreakpointObserver' has no call signatures. |  |
| `src/app-ng/feature/components/tb-timewindow/tb-timewindow.directive.ts` | 134 | TS2349 | This expression is not callable. Type 'BreakpointObserver' has no call signatures. |  |
| `src/app-ng/feature/components/tb-timewindow/tb-timewindow.directive.ts` | 153 | TS2339 | Property 'newPanelPosition' does not exist on type 'Overlay'. |  |
| `src/app-ng/feature/components/tb-timewindow/tb-timewindow.directive.ts` | 157 | TS2339 | Property 'newPanelPosition' does not exist on type 'Overlay'. |  |
| `src/app-ng/feature/components/tb-timewindow/tb-timewindow.directive.ts` | 185 | TS2339 | Property 'open' does not exist on type 'Overlay'. |  |
| `src/app-ng/feature/components/tb-timewindow/tb-timewindow.directive.ts` | 224 | TS2339 | Property 'isReady' does not exist on type 'TranslateService'. |  |
| `src/app-ng/feature/components/tb-widget-config/tb-widget-config.directive.ts` | 10 | TS2307 | Cannot find module '../../../../app/components/widget/widget-config.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/components/tb-widget-config/tb-widget-config.directive.ts` | 151 | TS2769 | No overload matches this call. Overload 1 of 2, '(value: any, replacer?: (this: any, key: string, value: any) => any, space?: string \| number): string', gave the following error. Argument of type 'boolean' is not assignable to parameter of type '(this: any, key: string, value: any) => any'. Overload 2 of 2, '(value: any, replacer?: (string \| number)[], space?: string \| number): string', gave the following error. Argument of type 'boolean' is not assignable to parameter of type '(string \| number)[]'. |  |
| `src/app-ng/feature/components/tb-widget-config/tb-widget-config.directive.ts` | 156 | TS2769 | No overload matches this call. Overload 1 of 2, '(value: any, replacer?: (this: any, key: string, value: any) => any, space?: string \| number): string', gave the following error. Argument of type 'boolean' is not assignable to parameter of type '(this: any, key: string, value: any) => any'. Overload 2 of 2, '(value: any, replacer?: (string \| number)[], space?: string \| number): string', gave the following error. Argument of type 'boolean' is not assignable to parameter of type '(string \| number)[]'. |  |
| `src/app-ng/feature/components/tb-widgets-bundle-select/tb-widgets-bundle-select.directive.ts` | 8 | TS2307 | Cannot find module '../../../../app/components/widgets-bundle-select.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/components/widget-action-dialog/widget-action-dialog.component.ts` | 215 | TS2339 | Property 'cancel' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/components/widget-action-dialog/widget-action-dialog.component.ts` | 220 | TS2339 | Property 'hide' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/components/widget/widget.component.ts` | 576 | TS2339 | Property 'current' does not exist on type 'Router'. |  |
| `src/app-ng/feature/components/widget/widget.component.ts` | 577 | TS2339 | Property 'go' does not exist on type 'Router'. |  |
| `src/app-ng/feature/components/widget/widget.component.ts` | 579 | TS2339 | Property 'go' does not exist on type 'Router'. |  |
| `src/app-ng/feature/components/widget/widget.component.ts` | 952 | TS2349 | This expression is not callable. Type 'TbRafService' has no call signatures. |  |
| `src/app-ng/feature/components/widget/widget.component.ts` | 984 | TS2349 | This expression is not callable. Type 'TbRafService' has no call signatures. |  |
| `src/app-ng/feature/components/widget/widget.component.ts` | 1005 | TS2349 | This expression is not callable. Type 'TbRafService' has no call signatures. |  |
| `src/app-ng/feature/customer/customer/customer.component.ts` | 16 | TS2307 | Cannot find module '../../../../app/customer/add-customer.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/customer/customer/customer.component.ts` | 17 | TS2307 | Cannot find module '../../../../app/customer/customer-card.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/customer/customer/customer.component.ts` | 215 | TS2339 | Property 'go' does not exist on type 'Router'. |  |
| `src/app-ng/feature/customer/customer/customer.component.ts` | 222 | TS2339 | Property 'go' does not exist on type 'Router'. |  |
| `src/app-ng/feature/customer/customer/customer.component.ts` | 229 | TS2339 | Property 'go' does not exist on type 'Router'. |  |
| `src/app-ng/feature/customer/customer/customer.component.ts` | 236 | TS2339 | Property 'go' does not exist on type 'Router'. |  |
| `src/app-ng/feature/customer/tb-customer/tb-customer.directive.ts` | 9 | TS2307 | Cannot find module '../../../../app/customer/customer-fieldset.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/dashboard/add-dashboards-to-customer/add-dashboards-to-customer.component.ts` | 95 | TS2339 | Property 'cancel' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/dashboard/add-dashboards-to-customer/add-dashboards-to-customer.component.ts` | 104 | TS2339 | Property 'hide' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/dashboard/add-widget/add-widget.component.ts` | 13 | TS2307 | Cannot find module '../../../../app/entity/alias/entity-alias-dialog.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/dashboard/add-widget/add-widget.component.ts` | 123 | TS2339 | Property 'cancel' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/dashboard/add-widget/add-widget.component.ts` | 132 | TS2339 | Property 'hide' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/dashboard/add-widget/add-widget.component.ts` | 187 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/dashboard/dashboard-settings/dashboard-settings.component.ts` | 104 | TS2339 | Property 'cancel' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/dashboard/dashboard-settings/dashboard-settings.component.ts` | 136 | TS2339 | Property 'hide' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/dashboard/dashboard-state-dialog/dashboard-state-dialog.component.ts` | 96 | TS2339 | Property 'cancel' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/dashboard/dashboard-state-dialog/dashboard-state-dialog.component.ts` | 102 | TS2339 | Property 'hide' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/dashboard/dashboard/dashboard.component.ts` | 38 | TS2307 | Cannot find module '../../../../app/entity/alias/entity-aliases.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/dashboard/dashboard/dashboard.component.ts` | 39 | TS2307 | Cannot find module '../../../../app/dashboard/dashboard-settings.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/dashboard/dashboard/dashboard.component.ts` | 40 | TS2307 | Cannot find module '../../../../app/dashboard/layouts/manage-dashboard-layouts.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/dashboard/dashboard/dashboard.component.ts` | 41 | TS2307 | Cannot find module '../../../../app/dashboard/states/manage-dashboard-states.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/dashboard/dashboard/dashboard.component.ts` | 42 | TS2307 | Cannot find module '../../../../app/dashboard/add-widget.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/dashboard/dashboard/dashboard.component.ts` | 43 | TS2307 | Cannot find module '../../../../app/dashboard/layouts/select-target-layout.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/dashboard/dashboard/dashboard.component.ts` | 164 | TS2339 | Property '$current' does not exist on type 'Router'. |  |
| `src/app-ng/feature/dashboard/dashboard/dashboard.component.ts` | 186 | TS2349 | This expression is not callable. Type 'BreakpointObserver' has no call signatures. |  |
| `src/app-ng/feature/dashboard/dashboard/dashboard.component.ts` | 187 | TS2349 | This expression is not callable. Type 'BreakpointObserver' has no call signatures. |  |
| `src/app-ng/feature/dashboard/dashboard/dashboard.component.ts` | 270 | TS2339 | Property 'go' does not exist on type 'Router'. |  |
| `src/app-ng/feature/dashboard/dashboard/dashboard.component.ts` | 275 | TS2339 | Property 'current' does not exist on type 'Router'. |  |
| `src/app-ng/feature/dashboard/dashboard/dashboard.component.ts` | 276 | TS2339 | Property 'go' does not exist on type 'Router'. |  |
| `src/app-ng/feature/dashboard/dashboard/dashboard.component.ts` | 278 | TS2339 | Property 'go' does not exist on type 'Router'. |  |
| `src/app-ng/feature/dashboard/dashboard/dashboard.component.ts` | 534 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/dashboard/dashboard/dashboard.component.ts` | 564 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/dashboard/dashboard/dashboard.component.ts` | 588 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/dashboard/dashboard/dashboard.component.ts` | 610 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/dashboard/dashboard/dashboard.component.ts` | 908 | TS2339 | Property 'current' does not exist on type 'Router'. |  |
| `src/app-ng/feature/dashboard/dashboard/dashboard.component.ts` | 966 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/dashboard/dashboard/dashboard.component.ts` | 1029 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/dashboard/dashboard/dashboard.component.ts` | 1062 | TS2339 | Property 'confirm' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/dashboard/dashboard/dashboard.component.ts` | 1069 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/dashboard/dashboards/dashboards.component.ts` | 19 | TS2307 | Cannot find module '../../../../app/dashboard/add-dashboard.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/dashboard/dashboards/dashboards.component.ts` | 20 | TS2307 | Cannot find module '../../../../app/dashboard/dashboard-card.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/dashboard/dashboards/dashboards.component.ts` | 21 | TS2307 | Cannot find module '../../../../app/dashboard/add-dashboards-to-customer.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/dashboard/dashboards/dashboards.component.ts` | 22 | TS2307 | Cannot find module '../../../../app/dashboard/make-dashboard-public-dialog.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/dashboard/dashboards/dashboards.component.ts` | 23 | TS2307 | Cannot find module '../../../../app/dashboard/manage-assigned-customers.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/dashboard/dashboards/dashboards.component.ts` | 122 | TS2339 | Property '$current' does not exist on type 'Router'. |  |
| `src/app-ng/feature/dashboard/dashboards/dashboards.component.ts` | 465 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/dashboard/dashboards/dashboards.component.ts` | 499 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/dashboard/dashboards/dashboards.component.ts` | 523 | TS2339 | Property 'confirm' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/dashboard/dashboards/dashboards.component.ts` | 530 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/dashboard/dashboards/dashboards.component.ts` | 543 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/dashboard/dashboards/dashboards.component.ts` | 564 | TS2339 | Property 'confirm' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/dashboard/dashboards/dashboards.component.ts` | 571 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/dashboard/dashboards/dashboards.component.ts` | 584 | TS2339 | Property 'confirm' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/dashboard/dashboards/dashboards.component.ts` | 591 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/dashboard/dashboards/dashboards.component.ts` | 607 | TS2339 | Property 'go' does not exist on type 'Router'. |  |
| `src/app-ng/feature/dashboard/dashboards/dashboards.component.ts` | 612 | TS2339 | Property 'go' does not exist on type 'Router'. |  |
| `src/app-ng/feature/dashboard/make-dashboard-public-dialog/make-dashboard-public-dialog.component.ts` | 49 | TS2339 | Property 'hide' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/dashboard/manage-assigned-customers/manage-assigned-customers.component.ts` | 68 | TS2339 | Property 'cancel' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/dashboard/manage-assigned-customers/manage-assigned-customers.component.ts` | 86 | TS2339 | Property 'hide' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/dashboard/manage-dashboard-layouts/manage-dashboard-layouts.component.ts` | 9 | TS2307 | Cannot find module '../../../../app/dashboard/dashboard-settings.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/dashboard/manage-dashboard-layouts/manage-dashboard-layouts.component.ts` | 60 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/dashboard/manage-dashboard-layouts/manage-dashboard-layouts.component.ts` | 83 | TS2339 | Property 'cancel' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/dashboard/manage-dashboard-layouts/manage-dashboard-layouts.component.ts` | 95 | TS2339 | Property 'hide' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/dashboard/manage-dashboard-states/manage-dashboard-states.component.ts` | 9 | TS2307 | Cannot find module '../../../../app/dashboard/states/dashboard-state-dialog.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/dashboard/manage-dashboard-states/manage-dashboard-states.component.ts` | 132 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/dashboard/manage-dashboard-states/manage-dashboard-states.component.ts` | 182 | TS2339 | Property 'confirm' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/dashboard/manage-dashboard-states/manage-dashboard-states.component.ts` | 193 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/dashboard/manage-dashboard-states/manage-dashboard-states.component.ts` | 205 | TS2339 | Property 'cancel' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/dashboard/manage-dashboard-states/manage-dashboard-states.component.ts` | 217 | TS2339 | Property 'hide' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/dashboard/select-target-layout/select-target-layout.component.ts` | 35 | TS2339 | Property 'cancel' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/dashboard/select-target-layout/select-target-layout.component.ts` | 40 | TS2339 | Property 'hide' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/dashboard/select-target-state/select-target-state.component.ts` | 44 | TS2339 | Property 'cancel' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/dashboard/select-target-state/select-target-state.component.ts` | 49 | TS2339 | Property 'hide' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/dashboard/services/states-controller.service.ts` | 3 | TS2307 | Cannot find module '../../../../app/dashboard/states/default-state-controller.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/dashboard/services/states-controller.service.ts` | 4 | TS2307 | Cannot find module '../../../../app/dashboard/states/entity-state-controller.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/dashboard/tb-dashboard-details/tb-dashboard-details.directive.ts` | 11 | TS2307 | Cannot find module '../../../../app/dashboard/dashboard-fieldset.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/dashboard/tb-dashboard-layout/tb-dashboard-layout.directive.ts` | 4 | TS2307 | Cannot find module '../../../../app/dashboard/layouts/dashboard-layout.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/dashboard/tb-dashboard-layout/tb-dashboard-layout.directive.ts` | 146 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/dashboard/tb-dashboard-toolbar/tb-dashboard-toolbar.directive.ts` | 3 | TS2307 | Cannot find module '../../../../app/dashboard/dashboard-toolbar.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/dashboard/tb-dashboard-toolbar/tb-dashboard-toolbar.directive.ts` | 18 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/dashboard/tb-dashboard-toolbar/tb-dashboard-toolbar.directive.ts` | 22 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/dashboard/tb-dashboard-toolbar/tb-dashboard-toolbar.directive.ts` | 23 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/dashboard/tb-dashboard-toolbar/tb-dashboard-toolbar.directive.ts` | 32 | TS2304 | Cannot find name 'addResizeListener'. |  |
| `src/app-ng/feature/dashboard/tb-dashboard-toolbar/tb-dashboard-toolbar.directive.ts` | 35 | TS2304 | Cannot find name 'removeResizeListener'. |  |
| `src/app-ng/feature/dashboard/tb-dashboard-toolbar/tb-dashboard-toolbar.directive.ts` | 59 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/dashboard/tb-edit-widget/tb-edit-widget.directive.ts` | 12 | TS2307 | Cannot find module '../../../../app/entity/alias/entity-alias-dialog.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/dashboard/tb-edit-widget/tb-edit-widget.directive.ts` | 13 | TS2307 | Cannot find module '../../../../app/dashboard/edit-widget.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/dashboard/tb-edit-widget/tb-edit-widget.directive.ts` | 156 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/device/add-devices-to-customer/add-devices-to-customer.component.ts` | 95 | TS2339 | Property 'cancel' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/device/add-devices-to-customer/add-devices-to-customer.component.ts` | 104 | TS2339 | Property 'hide' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/device/assign-device-to-customer/assign-device-to-customer.component.ts` | 98 | TS2339 | Property 'cancel' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/device/assign-device-to-customer/assign-device-to-customer.component.ts` | 107 | TS2339 | Property 'hide' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/device/device/device.component.ts` | 25 | TS2307 | Cannot find module '../../../../app/device/add-device.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/device/device/device.component.ts` | 26 | TS2307 | Cannot find module '../../../../app/device/device-card.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/device/device/device.component.ts` | 27 | TS2307 | Cannot find module '../../../../app/device/assign-to-customer.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/device/device/device.component.ts` | 28 | TS2307 | Cannot find module '../../../../app/device/add-devices-to-customer.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/device/device/device.component.ts` | 29 | TS2307 | Cannot find module '../../../../app/device/device-credentials.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/device/device/device.component.ts` | 137 | TS2339 | Property '$current' does not exist on type 'Router'. |  |
| `src/app-ng/feature/device/device/device.component.ts` | 451 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/device/device/device.component.ts` | 488 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/device/device/device.component.ts` | 529 | TS2339 | Property 'confirm' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/device/device/device.component.ts` | 536 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/device/device/device.component.ts` | 544 | TS2339 | Property 'confirm' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/device/device/device.component.ts` | 551 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/device/device/device.component.ts` | 566 | TS2339 | Property 'confirm' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/device/device/device.component.ts` | 573 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/device/device/device.component.ts` | 585 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/device/manage-device-credentials/manage-device-credentials.component.ts` | 66 | TS2339 | Property 'cancel' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/device/manage-device-credentials/manage-device-credentials.component.ts` | 88 | TS2339 | Property 'hide' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/device/tb-device/tb-device.directive.ts` | 13 | TS2307 | Cannot find module '../../../../app/device/device-fieldset.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/entity-view/add-entity-views-to-customer/add-entity-views-to-customer.component.ts` | 95 | TS2339 | Property 'cancel' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/entity-view/add-entity-views-to-customer/add-entity-views-to-customer.component.ts` | 104 | TS2339 | Property 'hide' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/entity-view/assign-entity-view-to-customer/assign-entity-view-to-customer.component.ts` | 98 | TS2339 | Property 'cancel' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/entity-view/assign-entity-view-to-customer/assign-entity-view-to-customer.component.ts` | 107 | TS2339 | Property 'hide' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/entity-view/entity-view/entity-view.component.ts` | 23 | TS2307 | Cannot find module '../../../../app/entity-view/add-entity-view.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/entity-view/entity-view/entity-view.component.ts` | 24 | TS2307 | Cannot find module '../../../../app/entity-view/entity-view-card.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/entity-view/entity-view/entity-view.component.ts` | 25 | TS2307 | Cannot find module '../../../../app/entity-view/assign-to-customer.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/entity-view/entity-view/entity-view.component.ts` | 26 | TS2307 | Cannot find module '../../../../app/entity-view/add-entity-views-to-customer.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/entity-view/entity-view/entity-view.component.ts` | 110 | TS2339 | Property '$current' does not exist on type 'Router'. |  |
| `src/app-ng/feature/entity-view/entity-view/entity-view.component.ts` | 376 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/entity-view/entity-view/entity-view.component.ts` | 413 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/entity-view/entity-view/entity-view.component.ts` | 454 | TS2339 | Property 'confirm' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/entity-view/entity-view/entity-view.component.ts` | 461 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/entity-view/entity-view/entity-view.component.ts` | 469 | TS2339 | Property 'confirm' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/entity-view/entity-view/entity-view.component.ts` | 476 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/entity-view/entity-view/entity-view.component.ts` | 491 | TS2339 | Property 'confirm' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/entity-view/entity-view/entity-view.component.ts` | 498 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/entity-view/tb-entity-view/tb-entity-view.directive.ts` | 16 | TS2307 | Cannot find module '../../../../app/entity-view/entity-view-fieldset.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/entity/add-attribute-dialog/add-attribute-dialog.component.ts` | 8 | TS2307 | Cannot find module '../../../../app/entity/attribute/attribute-dialog-edit-json.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/entity/add-attribute-dialog/add-attribute-dialog.component.ts` | 69 | TS2339 | Property 'cancel' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/entity/add-attribute-dialog/add-attribute-dialog.component.ts` | 76 | TS2339 | Property 'hide' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/entity/add-attribute-dialog/add-attribute-dialog.component.ts` | 92 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/entity/add-widget-to-dashboard-dialog/add-widget-to-dashboard-dialog.component.ts` | 15 | TS2307 | Cannot find module '../../../../app/dashboard/states/select-target-state.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/entity/add-widget-to-dashboard-dialog/add-widget-to-dashboard-dialog.component.ts` | 16 | TS2307 | Cannot find module '../../../../app/dashboard/layouts/select-target-layout.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/entity/add-widget-to-dashboard-dialog/add-widget-to-dashboard-dialog.component.ts` | 73 | TS2339 | Property 'cancel' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/entity/add-widget-to-dashboard-dialog/add-widget-to-dashboard-dialog.component.ts` | 82 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/entity/add-widget-to-dashboard-dialog/add-widget-to-dashboard-dialog.component.ts` | 114 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/entity/add-widget-to-dashboard-dialog/add-widget-to-dashboard-dialog.component.ts` | 173 | TS2339 | Property 'hide' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/entity/add-widget-to-dashboard-dialog/add-widget-to-dashboard-dialog.component.ts` | 183 | TS2339 | Property 'go' does not exist on type 'Router'. |  |
| `src/app-ng/feature/entity/entity-alias-dialog/entity-alias-dialog.component.ts` | 126 | TS2339 | Property 'cancel' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/entity/entity-alias-dialog/entity-alias-dialog.component.ts` | 136 | TS2339 | Property 'hide' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/entity/entity-aliases/entity-aliases.component.ts` | 14 | TS2307 | Cannot find module '../../../../app/entity/alias/entity-alias-dialog.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/entity/entity-aliases/entity-aliases.component.ts` | 147 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/entity/entity-aliases/entity-aliases.component.ts` | 183 | TS2339 | Property 'alert' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/entity/entity-aliases/entity-aliases.component.ts` | 194 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/entity/entity-aliases/entity-aliases.component.ts` | 205 | TS2339 | Property 'cancel' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/entity/entity-aliases/entity-aliases.component.ts` | 235 | TS2339 | Property 'hide' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/entity/tb-aliases-entity-select/tb-aliases-entity-select.directive.ts` | 10 | TS2307 | Cannot find module '../../../../app/entity/alias/aliases-entity-select-button.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/entity/tb-aliases-entity-select/tb-aliases-entity-select.directive.ts` | 11 | TS2307 | Cannot find module '../../../../app/entity/alias/aliases-entity-select-panel.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/entity/tb-aliases-entity-select/tb-aliases-entity-select.directive.ts` | 69 | TS2349 | This expression is not callable. Type 'BreakpointObserver' has no call signatures. |  |
| `src/app-ng/feature/entity/tb-aliases-entity-select/tb-aliases-entity-select.directive.ts` | 86 | TS2339 | Property 'newPanelPosition' does not exist on type 'Overlay'. |  |
| `src/app-ng/feature/entity/tb-aliases-entity-select/tb-aliases-entity-select.directive.ts` | 108 | TS2339 | Property 'open' does not exist on type 'Overlay'. |  |
| `src/app-ng/feature/entity/tb-attribute-table/tb-attribute-table.directive.ts` | 21 | TS2307 | Cannot find module '../../../../app/entity/attribute/attribute-table.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/entity/tb-attribute-table/tb-attribute-table.directive.ts` | 22 | TS2307 | Cannot find module '../../../../app/entity/attribute/add-attribute-dialog.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/entity/tb-attribute-table/tb-attribute-table.directive.ts` | 23 | TS2307 | Cannot find module '../../../../app/entity/attribute/add-widget-to-dashboard-dialog.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/entity/tb-attribute-table/tb-attribute-table.directive.ts` | 24 | TS2307 | Cannot find module '../../../../app/entity/attribute/edit-attribute-value.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/entity/tb-attribute-table/tb-attribute-table.directive.ts` | 283 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/entity/tb-attribute-table/tb-attribute-table.directive.ts` | 304 | TS2339 | Property 'confirm' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/entity/tb-attribute-table/tb-attribute-table.directive.ts` | 311 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/entity/tb-attribute-table/tb-attribute-table.directive.ts` | 487 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/entity/tb-entity-autocomplete/tb-entity-autocomplete.directive.ts` | 8 | TS2307 | Cannot find module '../../../../app/entity/entity-autocomplete.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/entity/tb-entity-filter-view/tb-entity-filter-view.directive.ts` | 9 | TS2307 | Cannot find module '../../../../app/entity/entity-filter-view.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/entity/tb-entity-filter/tb-entity-filter.directive.ts` | 17 | TS2307 | Cannot find module '../../../../app/entity/entity-filter.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/entity/tb-entity-list/tb-entity-list.directive.ts` | 7 | TS2307 | Cannot find module '../../../../app/entity/entity-list.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/entity/tb-entity-select/tb-entity-select.directive.ts` | 10 | TS2307 | Cannot find module '../../../../app/entity/entity-select.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/entity/tb-entity-subtype-autocomplete/tb-entity-subtype-autocomplete.directive.ts` | 10 | TS2307 | Cannot find module '../../../../app/entity/entity-subtype-autocomplete.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/entity/tb-entity-subtype-list/tb-entity-subtype-list.directive.ts` | 11 | TS2307 | Cannot find module '../../../../app/entity/entity-subtype-list.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/entity/tb-entity-subtype-select/tb-entity-subtype-select.directive.ts` | 12 | TS2307 | Cannot find module '../../../../app/entity/entity-subtype-select.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/entity/tb-entity-type-list/tb-entity-type-list.directive.ts` | 9 | TS2307 | Cannot find module '../../../../app/entity/entity-type-list.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/entity/tb-entity-type-select/tb-entity-type-select.directive.ts` | 11 | TS2307 | Cannot find module '../../../../app/entity/entity-type-select.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/entity/tb-relation-filters/tb-relation-filters.directive.ts` | 8 | TS2307 | Cannot find module '../../../../app/entity/relation/relation-filters.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/entity/tb-relation-table/tb-relation-table.directive.ts` | 3 | TS2307 | Cannot find module '../../../../app/entity/relation/relation-table.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/entity/tb-relation-table/tb-relation-table.directive.ts` | 51 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/entity/tb-relation-table/tb-relation-table.directive.ts` | 57 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/entity/tb-relation-table/tb-relation-table.directive.ts` | 63 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/entity/tb-relation-table/tb-relation-table.directive.ts` | 69 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/entity/tb-relation-table/tb-relation-table.directive.ts` | 128 | TS2304 | Cannot find name 'RelationController'. |  |
| `src/app-ng/feature/entity/tb-relation-table/tb-relation-table.directive.ts` | 130 | TS2304 | Cannot find name 'relationTemplate'. |  |
| `src/app-ng/feature/entity/tb-relation-table/tb-relation-table.directive.ts` | 131 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/entity/tb-relation-type-autocomplete/tb-relation-type-autocomplete.directive.ts` | 10 | TS2307 | Cannot find module '../../../../app/entity/relation/relation-type-autocomplete.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/event/event-content-dialog/event-content-dialog.component.ts` | 19 | TS2304 | Cannot find name 'beautify'. |  |
| `src/app-ng/feature/event/event-content-dialog/event-content-dialog.component.ts` | 94 | TS2339 | Property 'hide' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/event/tb-event-header/tb-event-header.directive.ts` | 7 | TS2307 | Cannot find module '../../../../app/event/event-header-lc-event.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/event/tb-event-header/tb-event-header.directive.ts` | 8 | TS2307 | Cannot find module '../../../../app/event/event-header-stats.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/event/tb-event-header/tb-event-header.directive.ts` | 9 | TS2307 | Cannot find module '../../../../app/event/event-header-error.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/event/tb-event-header/tb-event-header.directive.ts` | 10 | TS2307 | Cannot find module '../../../../app/event/event-header-debug-rulenode.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/event/tb-event-row/tb-event-row.directive.ts` | 10 | TS2307 | Cannot find module '../../../../app/event/event-content-dialog.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/event/tb-event-row/tb-event-row.directive.ts` | 11 | TS2307 | Cannot find module '../../../../app/event/event-row-lc-event.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/event/tb-event-row/tb-event-row.directive.ts` | 12 | TS2307 | Cannot find module '../../../../app/event/event-row-stats.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/event/tb-event-row/tb-event-row.directive.ts` | 13 | TS2307 | Cannot find module '../../../../app/event/event-row-error.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/event/tb-event-row/tb-event-row.directive.ts` | 14 | TS2307 | Cannot find module '../../../../app/event/event-row-debug-rulenode.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/event/tb-event-row/tb-event-row.directive.ts` | 94 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/event/tb-event-table/tb-event-table.directive.ts` | 15 | TS2307 | Cannot find module '../../../../app/event/event-table.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/extension/tb-extension-form-http/tb-extension-form-http.directive.ts` | 9 | TS2307 | Cannot find module '../../../../app/extension/extensions-forms/extension-form-http.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/extension/tb-extension-form-http/tb-extension-form-http.directive.ts` | 30 | TS2353 | Object literal may only specify known properties, and 'imports' does not exist in type 'Directive'. |  |
| `src/app-ng/feature/extension/tb-extension-form-modbus/tb-extension-form-modbus.directive.ts` | 8 | TS2307 | Cannot find module '../../../../app/extension/extensions-forms/extension-form-modbus.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/extension/tb-extension-form-modbus/tb-extension-form-modbus.directive.ts` | 31 | TS2353 | Object literal may only specify known properties, and 'imports' does not exist in type 'Directive'. |  |
| `src/app-ng/feature/extension/tb-extension-form-mqtt/tb-extension-form-mqtt.directive.ts` | 10 | TS2307 | Cannot find module '../../../../app/extension/extensions-forms/extension-form-mqtt.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/extension/tb-extension-form-mqtt/tb-extension-form-mqtt.directive.ts` | 33 | TS2353 | Object literal may only specify known properties, and 'imports' does not exist in type 'Directive'. |  |
| `src/app-ng/feature/extension/tb-extension-form-opc/tb-extension-form-opc.directive.ts` | 9 | TS2307 | Cannot find module '../../../../app/extension/extensions-forms/extension-form-opc.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/extension/tb-extension-form-opc/tb-extension-form-opc.directive.ts` | 31 | TS2353 | Object literal may only specify known properties, and 'imports' does not exist in type 'Directive'. |  |
| `src/app-ng/feature/extension/tb-extension-table/tb-extension-table.directive.ts` | 4 | TS2307 | Cannot find module '../../../../app/extension/extension-table.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/extension/tb-extension-table/tb-extension-table.directive.ts` | 69 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/extension/tb-extension-table/tb-extension-table.directive.ts` | 115 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/extension/tb-extension-table/tb-extension-table.directive.ts` | 167 | TS2304 | Cannot find name 'ExtensionDialogController'. |  |
| `src/app-ng/feature/extension/tb-extension-table/tb-extension-table.directive.ts` | 169 | TS2304 | Cannot find name 'extensionDialogTemplate'. |  |
| `src/app-ng/feature/extension/tb-extension-table/tb-extension-table.directive.ts` | 170 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/extension/tb-extension-table/tb-extension-table.directive.ts` | 207 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/extension/tb-extension-table/tb-extension-table.directive.ts` | 233 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/extension/tb-extension-table/tb-extension-table.directive.ts` | 239 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/extension/tb-extension-table/tb-extension-table.directive.ts` | 257 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/extension/tb-extension-table/tb-extension-table.directive.ts` | 290 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/extension/tb-extension-table/tb-extension-table.directive.ts` | 354 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/extension/tb-extension-table/tb-extension-table.directive.ts` | 354 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 7 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 8 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 9 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 10 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 11 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 12 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 13 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 14 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 15 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 16 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 17 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 18 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 19 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 20 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 21 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 22 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 23 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 24 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 25 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 26 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 27 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 28 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 29 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 30 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 31 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 32 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 33 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 34 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 35 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 36 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 37 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 38 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 39 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 40 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 41 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 42 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 43 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 44 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 45 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 46 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 47 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 48 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 49 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 50 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 51 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 52 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 53 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 54 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 55 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 56 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 57 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 58 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 59 | TS2304 | Cannot find name 'helpBaseUrl'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 68 | TS2304 | Cannot find name 'ruleNodeClazzHelpLinkMap'. |  |
| `src/app-ng/feature/help/constants/help-links.ts` | 69 | TS2304 | Cannot find name 'ruleNodeClazzHelpLinkMap'. |  |
| `src/app-ng/feature/home/home-links/home-links.component.ts` | 37 | TS2349 | This expression is not callable. Type 'BreakpointObserver' has no call signatures. |  |
| `src/app-ng/feature/home/home-links/home-links.component.ts` | 40 | TS2349 | This expression is not callable. Type 'BreakpointObserver' has no call signatures. |  |
| `src/app-ng/feature/home/home-links/home-links.component.ts` | 49 | TS2349 | This expression is not callable. Type 'BreakpointObserver' has no call signatures. |  |
| `src/app-ng/feature/home/home-links/home-links.component.ts` | 52 | TS2349 | This expression is not callable. Type 'BreakpointObserver' has no call signatures. |  |
| `src/app-ng/feature/import-export/import-dialog-csv/import-dialog-csv.component.ts` | 274 | TS2339 | Property 'hide' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/import-export/import-dialog-csv/import-dialog-csv.component.ts` | 282 | TS2339 | Property 'hide' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/import-export/import-dialog-csv/import-dialog-csv.component.ts` | 284 | TS2339 | Property 'cancel' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/import-export/import-dialog/import-dialog.component.ts` | 50 | TS2339 | Property 'cancel' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/import-export/import-dialog/import-dialog.component.ts` | 85 | TS2339 | Property 'hide' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/import-export/services/import-export.service.ts` | 20 | TS2307 | Cannot find module '../../../../app/import-export/import-dialog.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/import-export/services/import-export.service.ts` | 21 | TS2307 | Cannot find module '../../../../app/import-export/import-dialog-csv.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/import-export/services/import-export.service.ts` | 22 | TS2307 | Cannot find module '../../../../app/entity/alias/entity-aliases.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/import-export/services/import-export.service.ts` | 632 | TS2339 | Property 'then' does not exist on type 'Observable<ArrayBuffer>'. |  |
| `src/app-ng/feature/import-export/services/import-export.service.ts` | 741 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/import-export/services/import-export.service.ts` | 912 | TS2769 | No overload matches this call. Overload 1 of 2, '(value: any, replacer?: (this: any, key: string, value: any) => any, space?: string \| number): string', gave the following error. Argument of type 'number' is not assignable to parameter of type '(this: any, key: string, value: any) => any'. Overload 2 of 2, '(value: any, replacer?: (string \| number)[], space?: string \| number): string', gave the following error. Argument of type 'number' is not assignable to parameter of type '(string \| number)[]'. |  |
| `src/app-ng/feature/import-export/services/import-export.service.ts` | 919 | TS2339 | Property 'msSaveOrOpenBlob' does not exist on type 'Navigator'. |  |
| `src/app-ng/feature/import-export/services/import-export.service.ts` | 920 | TS2339 | Property 'msSaveOrOpenBlob' does not exist on type 'Navigator'. |  |
| `src/app-ng/feature/import-export/services/import-export.service.ts` | 937 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/import-export/services/import-export.service.ts` | 960 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/import-export/services/import-export.service.ts` | 988 | TS2351 | This expression is not constructable. Type '{ default: JSZip; files: { [key: string]: JSZipObject; }; file(path: string): JSZipObject; file(path: RegExp): JSZipObject[]; file<T extends JSZip.InputType>(path: string, data: InputByType[T] \| Promise<...>, options?: JSZipFileOptions): JSZip; file<T extends JSZip.InputType>(path: string, data: null, options?: JSZi...' has no construct signatures. |  |
| `src/app-ng/feature/import-export/services/import-export.service.ts` | 1005 | TS2339 | Property 'msSaveOrOpenBlob' does not exist on type 'Navigator'. |  |
| `src/app-ng/feature/import-export/services/import-export.service.ts` | 1006 | TS2339 | Property 'msSaveOrOpenBlob' does not exist on type 'Navigator'. |  |
| `src/app-ng/feature/import-export/tb-table-columns-assignment/tb-table-columns-assignment.directive.ts` | 3 | TS2307 | Cannot find module '../../../../app/import-export/table-columns-assignment.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/import-export/tb-table-columns-assignment/tb-table-columns-assignment.directive.ts` | 87 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/jsonform/json-form/json-form.component.ts` | 104 | TS2769 | No overload matches this call. Overload 1 of 2, '(value: any, replacer?: (this: any, key: string, value: any) => any, space?: string \| number): string', gave the following error. Argument of type 'boolean' is not assignable to parameter of type '(this: any, key: string, value: any) => any'. Overload 2 of 2, '(value: any, replacer?: (string \| number)[], space?: string \| number): string', gave the following error. Argument of type 'boolean' is not assignable to parameter of type '(string \| number)[]'. |  |
| `src/app-ng/feature/layout/home/home.component.ts` | 19 | TS2307 | Cannot find module '../../../../svg/logo_title_white.svg' or its corresponding type declarations. |  |
| `src/app-ng/feature/layout/home/home.component.ts` | 118 | TS2349 | This expression is not callable. Type 'BreakpointObserver' has no call signatures. |  |
| `src/app-ng/feature/layout/home/home.component.ts` | 123 | TS2349 | This expression is not callable. Type 'BreakpointObserver' has no call signatures. |  |
| `src/app-ng/feature/layout/tb-user-menu/tb-user-menu.directive.ts` | 2 | TS2307 | Cannot find module '../../../../app/layout/user-menu.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/locale/services/tb-missing-translation-handler.service.ts` | 13 | TS2322 | Type '() => void' is not assignable to type 'TbMissingTranslationHandlerService'. |  |
| `src/app-ng/feature/locale/services/tb-missing-translation-handler.service.ts` | 13 | TS2409 | Return type of constructor signature must be assignable to the instance type of the class. |  |
| `src/app-ng/feature/login/login/login.component.ts` | 9 | TS2307 | Cannot find module '../../../../svg/logo_title_white.svg' or its corresponding type declarations. |  |
| `src/app-ng/feature/login/login/login.component.ts` | 67 | TS2339 | Property 'go' does not exist on type 'Router'. |  |
| `src/app-ng/feature/login/reset-password/reset-password.component.ts` | 47 | TS2339 | Property '$current' does not exist on type 'Router'. |  |
| `src/app-ng/feature/profile/change-password/change-password.component.ts` | 46 | TS2339 | Property 'cancel' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/profile/change-password/change-password.component.ts` | 55 | TS2339 | Property 'hide' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/profile/profile/profile.component.ts` | 11 | TS2307 | Cannot find module '../../../../app/profile/change-password.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/profile/profile/profile.component.ts` | 59 | TS2554 | Expected 1 arguments, but got 0. |  |
| `src/app-ng/feature/profile/profile/profile.component.ts` | 74 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/rulechain/add-rule-node-link/add-rule-node-link.component.ts` | 49 | TS2339 | Property 'cancel' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/rulechain/add-rule-node-link/add-rule-node-link.component.ts` | 54 | TS2339 | Property 'hide' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/rulechain/add-rule-node/add-rule-node.component.ts` | 47 | TS2339 | Property 'cancel' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/rulechain/add-rule-node/add-rule-node.component.ts` | 52 | TS2339 | Property 'hide' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/rulechain/node-script-test/node-script-test.component.ts` | 32 | TS2304 | Cannot find name 'beautify'. |  |
| `src/app-ng/feature/rulechain/node-script-test/node-script-test.component.ts` | 203 | TS2339 | Property 'cancel' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/rulechain/node-script-test/node-script-test.component.ts` | 209 | TS2339 | Property 'hide' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/rulechain/rule-chain/rule-chain.component.ts` | 20 | TS2307 | Cannot find module '../../../../app/rulechain/add-rulenode.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/rulechain/rule-chain/rule-chain.component.ts` | 21 | TS2307 | Cannot find module '../../../../app/rulechain/add-link.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/rulechain/rule-chain/rule-chain.component.ts` | 149 | TS2339 | Property 'current' does not exist on type 'Router'. |  |
| `src/app-ng/feature/rulechain/rule-chain/rule-chain.component.ts` | 150 | TS2339 | Property 'go' does not exist on type 'Router'. |  |
| `src/app-ng/feature/rulechain/rule-chain/rule-chain.component.ts` | 153 | TS2339 | Property 'current' does not exist on type 'Router'. |  |
| `src/app-ng/feature/rulechain/rule-chain/rule-chain.component.ts` | 1332 | TS2339 | Property 'go' does not exist on type 'Router'. |  |
| `src/app-ng/feature/rulechain/rule-chain/rule-chain.component.ts` | 1356 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/rulechain/rule-chain/rule-chain.component.ts` | 1393 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/rulechain/rule-chains/rule-chains.component.ts` | 19 | TS2307 | Cannot find module '../../../../app/rulechain/add-rulechain.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/rulechain/rule-chains/rule-chains.component.ts` | 20 | TS2307 | Cannot find module '../../../../app/rulechain/rulechain-card.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/rulechain/rule-chains/rule-chains.component.ts` | 104 | TS2339 | Property 'go' does not exist on type 'Router'. |  |
| `src/app-ng/feature/rulechain/rule-chains/rule-chains.component.ts` | 193 | TS2339 | Property 'go' does not exist on type 'Router'. |  |
| `src/app-ng/feature/rulechain/rule-chains/rule-chains.component.ts` | 219 | TS2339 | Property 'confirm' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/rulechain/rule-chains/rule-chains.component.ts` | 226 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/rulechain/services/rule-node-script-test.service.ts` | 9 | TS2307 | Cannot find module '../../../../app/rulechain/script/node-script-test.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/rulechain/services/rule-node-script-test.service.ts` | 109 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/rulechain/tb-message-type-autocomplete/tb-message-type-autocomplete.directive.ts` | 7 | TS2307 | Cannot find module '../../../../app/rulechain/message-type-autocomplete.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/rulechain/tb-rule-chain/tb-rule-chain.directive.ts` | 11 | TS2307 | Cannot find module '../../../../app/rulechain/rulechain-fieldset.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/rulechain/tb-rule-node-config/tb-rule-node-config.directive.ts` | 9 | TS2307 | Cannot find module '../../../../app/rulechain/rulenode-config.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/rulechain/tb-rule-node-link/tb-rule-node-link.directive.ts` | 7 | TS2307 | Cannot find module '../../../../app/rulechain/link-fieldset.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/rulechain/tb-rule-node/tb-rule-node.directive.ts` | 10 | TS2307 | Cannot find module '../../../../app/rulechain/rulenode-fieldset.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/services/clipboard.service.ts` | 27 | TS1345 | An expression of type 'void' cannot be tested for truthiness. |  |
| `src/app-ng/feature/services/menu.service.ts` | 351 | TS2339 | Property 'includes' does not exist on type 'Router'. |  |
| `src/app-ng/feature/services/menu.service.ts` | 360 | TS2339 | Property 'includes' does not exist on type 'Router'. |  |
| `src/app-ng/feature/services/toast.service.ts` | 7 | TS2307 | Cannot find module '../../../app/services/info-toast.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/services/toast.service.ts` | 8 | TS2307 | Cannot find module '../../../app/services/success-toast.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/services/toast.service.ts` | 9 | TS2307 | Cannot find module '../../../app/services/error-toast.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/services/toast.service.ts` | 39 | TS2339 | Property 'show' does not exist on type 'MatSnackBar'. |  |
| `src/app-ng/feature/services/toast.service.ts` | 60 | TS2339 | Property 'show' does not exist on type 'MatSnackBar'. |  |
| `src/app-ng/feature/services/toast.service.ts` | 78 | TS2339 | Property 'hide' does not exist on type 'MatSnackBar'. |  |
| `src/app-ng/feature/services/toast/toast.component.ts` | 31 | TS2339 | Property 'hide' does not exist on type 'MatSnackBar'. |  |
| `src/app-ng/feature/tenant/tb-tenant/tb-tenant.directive.ts` | 9 | TS2307 | Cannot find module '../../../../app/tenant/tenant-fieldset.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/tenant/tenant/tenant.component.ts` | 15 | TS2307 | Cannot find module '../../../../app/tenant/add-tenant.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/tenant/tenant/tenant.component.ts` | 16 | TS2307 | Cannot find module '../../../../app/tenant/tenant-card.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/tenant/tenant/tenant.component.ts` | 147 | TS2339 | Property 'go' does not exist on type 'Router'. |  |
| `src/app-ng/feature/user/activation-link-dialog/activation-link-dialog.component.ts` | 44 | TS2339 | Property 'hide' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/user/add-user/add-user.component.ts` | 11 | TS2307 | Cannot find module '../../../../app/user/activation-link.dialog.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/user/add-user/add-user.component.ts` | 58 | TS2339 | Property '$current' does not exist on type 'Router'. |  |
| `src/app-ng/feature/user/add-user/add-user.component.ts` | 65 | TS2339 | Property 'cancel' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/user/add-user/add-user.component.ts` | 94 | TS2339 | Property 'hide' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/user/add-user/add-user.component.ts` | 100 | TS2339 | Property 'hide' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/user/add-user/add-user.component.ts` | 108 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/user/tb-user/tb-user.directive.ts` | 9 | TS2307 | Cannot find module '../../../../app/user/user-fieldset.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/user/user/user.component.ts` | 17 | TS2307 | Cannot find module '../../../../app/user/add-user.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/user/user/user.component.ts` | 18 | TS2307 | Cannot find module '../../../../app/user/user-card.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/user/user/user.component.ts` | 19 | TS2307 | Cannot find module '../../../../app/user/activation-link.dialog.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/user/user/user.component.ts` | 58 | TS2339 | Property '$current' does not exist on type 'Router'. |  |
| `src/app-ng/feature/user/user/user.component.ts` | 218 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/widget/date-range-navigator-widget/date-range-navigator-widget.directive.ts` | 4 | TS2307 | Cannot find module '../../../../app/widget/lib/date-range-navigator/date-range-navigator.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/widget/date-range-navigator-widget/date-range-navigator-widget.directive.ts` | 195 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/date-range-navigator-widget/date-range-navigator-widget.directive.ts` | 273 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/pipes/trip-animation.pipe.ts` | 13 | TS2304 | Cannot find name '$filter'. |  |
| `src/app-ng/feature/widget/save-widget-type-as/save-widget-type-as.component.ts` | 49 | TS2339 | Property 'cancel' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/widget/save-widget-type-as/save-widget-type-as.component.ts` | 53 | TS2339 | Property 'hide' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/widget/select-widget-type/select-widget-type.component.ts` | 37 | TS2339 | Property 'cancel' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/widget/select-widget-type/select-widget-type.component.ts` | 41 | TS2339 | Property 'hide' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/widget/tb-alarms-table-widget/tb-alarms-table-widget.directive.ts` | 4 | TS2307 | Cannot find module '../../../../app/widget/lib/alarms-table-widget.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/widget/tb-alarms-table-widget/tb-alarms-table-widget.directive.ts` | 115 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-alarms-table-widget/tb-alarms-table-widget.directive.ts` | 158 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-alarms-table-widget/tb-alarms-table-widget.directive.ts` | 159 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-alarms-table-widget/tb-alarms-table-widget.directive.ts` | 160 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-alarms-table-widget/tb-alarms-table-widget.directive.ts` | 202 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-alarms-table-widget/tb-alarms-table-widget.directive.ts` | 203 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-alarms-table-widget/tb-alarms-table-widget.directive.ts` | 204 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-alarms-table-widget/tb-alarms-table-widget.directive.ts` | 205 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-alarms-table-widget/tb-alarms-table-widget.directive.ts` | 210 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-alarms-table-widget/tb-alarms-table-widget.directive.ts` | 213 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-alarms-table-widget/tb-alarms-table-widget.directive.ts` | 213 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-alarms-table-widget/tb-alarms-table-widget.directive.ts` | 230 | TS2304 | Cannot find name 'tinycolor'. |  |
| `src/app-ng/feature/widget/tb-alarms-table-widget/tb-alarms-table-widget.directive.ts` | 276 | TS2304 | Cannot find name 'cssjs'. |  |
| `src/app-ng/feature/widget/tb-alarms-table-widget/tb-alarms-table-widget.directive.ts` | 300 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-alarms-table-widget/tb-alarms-table-widget.directive.ts` | 385 | TS2304 | Cannot find name 'alarmDetailsDialogTemplate'. |  |
| `src/app-ng/feature/widget/tb-alarms-table-widget/tb-alarms-table-widget.directive.ts` | 393 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-alarms-table-widget/tb-alarms-table-widget.directive.ts` | 576 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-alarms-table-widget/tb-alarms-table-widget.directive.ts` | 596 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-alarms-table-widget/tb-alarms-table-widget.directive.ts` | 620 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-alarms-table-widget/tb-alarms-table-widget.directive.ts` | 655 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-alarms-table-widget/tb-alarms-table-widget.directive.ts` | 660 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-alarms-table-widget/tb-alarms-table-widget.directive.ts` | 663 | TS2304 | Cannot find name 'alarmStatusFilterPanelTemplate'. |  |
| `src/app-ng/feature/widget/tb-alarms-table-widget/tb-alarms-table-widget.directive.ts` | 679 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-alarms-table-widget/tb-alarms-table-widget.directive.ts` | 684 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-alarms-table-widget/tb-alarms-table-widget.directive.ts` | 687 | TS2304 | Cannot find name 'displayColumnsPanelTemplate'. |  |
| `src/app-ng/feature/widget/tb-alarms-table-widget/tb-alarms-table-widget.directive.ts` | 722 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-alarms-table-widget/tb-alarms-table-widget.directive.ts` | 742 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-alarms-table-widget/tb-alarms-table-widget.directive.ts` | 758 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-entities-hierarchy-widget/tb-entities-hierarchy-widget.directive.ts` | 4 | TS2307 | Cannot find module '../../../../app/widget/lib/entities-hierarchy-widget.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/widget/tb-entities-hierarchy-widget/tb-entities-hierarchy-widget.directive.ts` | 60 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-entities-hierarchy-widget/tb-entities-hierarchy-widget.directive.ts` | 88 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-entities-hierarchy-widget/tb-entities-hierarchy-widget.directive.ts` | 99 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-entities-hierarchy-widget/tb-entities-hierarchy-widget.directive.ts` | 115 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-entities-hierarchy-widget/tb-entities-hierarchy-widget.directive.ts` | 119 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-entities-hierarchy-widget/tb-entities-hierarchy-widget.directive.ts` | 133 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-entities-hierarchy-widget/tb-entities-hierarchy-widget.directive.ts` | 229 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-entities-hierarchy-widget/tb-entities-hierarchy-widget.directive.ts` | 234 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-entities-hierarchy-widget/tb-entities-hierarchy-widget.directive.ts` | 243 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-entities-hierarchy-widget/tb-entities-hierarchy-widget.directive.ts` | 297 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-entities-table-widget/tb-entities-table-widget.directive.ts` | 4 | TS2307 | Cannot find module '../../../../app/widget/lib/entities-table-widget.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/widget/tb-entities-table-widget/tb-entities-table-widget.directive.ts` | 99 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-entities-table-widget/tb-entities-table-widget.directive.ts` | 141 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-entities-table-widget/tb-entities-table-widget.directive.ts` | 142 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-entities-table-widget/tb-entities-table-widget.directive.ts` | 143 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-entities-table-widget/tb-entities-table-widget.directive.ts` | 144 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-entities-table-widget/tb-entities-table-widget.directive.ts` | 158 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-entities-table-widget/tb-entities-table-widget.directive.ts` | 159 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-entities-table-widget/tb-entities-table-widget.directive.ts` | 162 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-entities-table-widget/tb-entities-table-widget.directive.ts` | 162 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-entities-table-widget/tb-entities-table-widget.directive.ts` | 184 | TS2304 | Cannot find name 'tinycolor'. |  |
| `src/app-ng/feature/widget/tb-entities-table-widget/tb-entities-table-widget.directive.ts` | 232 | TS2304 | Cannot find name 'cssjs'. |  |
| `src/app-ng/feature/widget/tb-entities-table-widget/tb-entities-table-widget.directive.ts` | 256 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-entities-table-widget/tb-entities-table-widget.directive.ts` | 339 | TS2554 | Expected 0 arguments, but got 2. |  |
| `src/app-ng/feature/widget/tb-entities-table-widget/tb-entities-table-widget.directive.ts` | 359 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-entities-table-widget/tb-entities-table-widget.directive.ts` | 412 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-entities-table-widget/tb-entities-table-widget.directive.ts` | 417 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-entities-table-widget/tb-entities-table-widget.directive.ts` | 420 | TS2304 | Cannot find name 'displayColumnsPanelTemplate'. |  |
| `src/app-ng/feature/widget/tb-entities-table-widget/tb-entities-table-widget.directive.ts` | 506 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-entities-table-widget/tb-entities-table-widget.directive.ts` | 520 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-entities-table-widget/tb-entities-table-widget.directive.ts` | 540 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-entities-table-widget/tb-entities-table-widget.directive.ts` | 558 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-extensions-table-widget/tb-extensions-table-widget.directive.ts` | 4 | TS2307 | Cannot find module '../../../../app/widget/lib/extensions-table-widget.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/widget/tb-knob/tb-knob.directive.ts` | 3 | TS2307 | Cannot find module '../../../../app/widget/lib/rpc/knob.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/widget/tb-knob/tb-knob.directive.ts` | 16 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-knob/tb-knob.directive.ts` | 17 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-knob/tb-knob.directive.ts` | 38 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-knob/tb-knob.directive.ts` | 52 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-knob/tb-knob.directive.ts` | 53 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-knob/tb-knob.directive.ts` | 54 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-knob/tb-knob.directive.ts` | 72 | TS2304 | Cannot find name 'CanvasDigitalGauge'. |  |
| `src/app-ng/feature/widget/tb-knob/tb-knob.directive.ts` | 190 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-knob/tb-knob.directive.ts` | 262 | TS2304 | Cannot find name 'tinycolor'. |  |
| `src/app-ng/feature/widget/tb-knob/tb-knob.directive.ts` | 317 | TS2304 | Cannot find name 'isNumber'. |  |
| `src/app-ng/feature/widget/tb-led-indicator/tb-led-indicator.directive.ts` | 3 | TS2307 | Cannot find module '../../../../app/widget/lib/rpc/led-indicator.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/widget/tb-led-indicator/tb-led-indicator.directive.ts` | 26 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-led-indicator/tb-led-indicator.directive.ts` | 27 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-led-indicator/tb-led-indicator.directive.ts` | 28 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-led-indicator/tb-led-indicator.directive.ts` | 29 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-led-indicator/tb-led-indicator.directive.ts` | 30 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-led-indicator/tb-led-indicator.directive.ts` | 31 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-led-indicator/tb-led-indicator.directive.ts` | 32 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-led-indicator/tb-led-indicator.directive.ts` | 54 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-led-indicator/tb-led-indicator.directive.ts` | 57 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-led-indicator/tb-led-indicator.directive.ts` | 59 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-led-indicator/tb-led-indicator.directive.ts` | 61 | TS2304 | Cannot find name 'tinycolor'. |  |
| `src/app-ng/feature/widget/tb-led-indicator/tb-led-indicator.directive.ts` | 62 | TS2304 | Cannot find name 'tinycolor'. |  |
| `src/app-ng/feature/widget/tb-led-indicator/tb-led-indicator.directive.ts` | 63 | TS2304 | Cannot find name 'tinycolor'. |  |
| `src/app-ng/feature/widget/tb-led-indicator/tb-led-indicator.directive.ts` | 64 | TS2304 | Cannot find name 'tinycolor'. |  |
| `src/app-ng/feature/widget/tb-led-indicator/tb-led-indicator.directive.ts` | 70 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-led-indicator/tb-led-indicator.directive.ts` | 240 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-multiple-input-widget/tb-multiple-input-widget.directive.ts` | 4 | TS2307 | Cannot find module '../../../../app/widget/lib/multiple-input-widget.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/widget/tb-multiple-input-widget/tb-multiple-input-widget.directive.ts` | 66 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-multiple-input-widget/tb-multiple-input-widget.directive.ts` | 102 | TS2686 | 'moment' refers to a UMD global, but the current file is a module. Consider adding an import instead. |  |
| `src/app-ng/feature/widget/tb-multiple-input-widget/tb-multiple-input-widget.directive.ts` | 158 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-multiple-input-widget/tb-multiple-input-widget.directive.ts` | 163 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-multiple-input-widget/tb-multiple-input-widget.directive.ts` | 185 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-multiple-input-widget/tb-multiple-input-widget.directive.ts` | 188 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-multiple-input-widget/tb-multiple-input-widget.directive.ts` | 191 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-multiple-input-widget/tb-multiple-input-widget.directive.ts` | 225 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-multiple-input-widget/tb-multiple-input-widget.directive.ts` | 233 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-multiple-input-widget/tb-multiple-input-widget.directive.ts` | 241 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-multiple-input-widget/tb-multiple-input-widget.directive.ts` | 271 | TS2686 | 'moment' refers to a UMD global, but the current file is a module. Consider adding an import instead. |  |
| `src/app-ng/feature/widget/tb-multiple-input-widget/tb-multiple-input-widget.directive.ts` | 274 | TS2686 | 'moment' refers to a UMD global, but the current file is a module. Consider adding an import instead. |  |
| `src/app-ng/feature/widget/tb-round-switch/tb-round-switch.directive.ts` | 3 | TS2307 | Cannot find module '../../../../app/widget/lib/rpc/round-switch.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/widget/tb-round-switch/tb-round-switch.directive.ts` | 18 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-round-switch/tb-round-switch.directive.ts` | 19 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-round-switch/tb-round-switch.directive.ts` | 20 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-round-switch/tb-round-switch.directive.ts` | 21 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-round-switch/tb-round-switch.directive.ts` | 22 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-round-switch/tb-round-switch.directive.ts` | 23 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-round-switch/tb-round-switch.directive.ts` | 24 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-round-switch/tb-round-switch.directive.ts` | 25 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-round-switch/tb-round-switch.directive.ts` | 50 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-round-switch/tb-round-switch.directive.ts` | 56 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-round-switch/tb-round-switch.directive.ts` | 175 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-switch/tb-switch.directive.ts` | 4 | TS2307 | Cannot find module '../../../../app/widget/lib/rpc/switch.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/widget/tb-switch/tb-switch.directive.ts` | 18 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-switch/tb-switch.directive.ts` | 19 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-switch/tb-switch.directive.ts` | 20 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-switch/tb-switch.directive.ts` | 21 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-switch/tb-switch.directive.ts` | 22 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-switch/tb-switch.directive.ts` | 23 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-switch/tb-switch.directive.ts` | 24 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-switch/tb-switch.directive.ts` | 25 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-switch/tb-switch.directive.ts` | 26 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-switch/tb-switch.directive.ts` | 27 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-switch/tb-switch.directive.ts` | 28 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-switch/tb-switch.directive.ts` | 49 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-switch/tb-switch.directive.ts` | 51 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-switch/tb-switch.directive.ts` | 56 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-switch/tb-switch.directive.ts` | 138 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-switch/tb-switch.directive.ts` | 139 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-switch/tb-switch.directive.ts` | 194 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-timeseries-table-widget/tb-timeseries-table-widget.directive.ts` | 4 | TS2307 | Cannot find module '../../../../app/widget/lib/timeseries-table-widget.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/widget/tb-timeseries-table-widget/tb-timeseries-table-widget.directive.ts` | 43 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-timeseries-table-widget/tb-timeseries-table-widget.directive.ts` | 77 | TS2304 | Cannot find name 'tinycolor'. |  |
| `src/app-ng/feature/widget/tb-timeseries-table-widget/tb-timeseries-table-widget.directive.ts` | 114 | TS2304 | Cannot find name 'cssjs'. |  |
| `src/app-ng/feature/widget/tb-timeseries-table-widget/tb-timeseries-table-widget.directive.ts` | 121 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-timeseries-table-widget/tb-timeseries-table-widget.directive.ts` | 205 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-timeseries-table-widget/tb-timeseries-table-widget.directive.ts` | 299 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-timeseries-table-widget/tb-timeseries-table-widget.directive.ts` | 319 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/tb-web-camera-widget/tb-web-camera-widget.directive.ts` | 2 | TS2307 | Cannot find module '../../../../app/widget/lib/web-camera-input-widget.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/widget/tb-widgets-bundle/tb-widgets-bundle.directive.ts` | 6 | TS2307 | Cannot find module '../../../../app/widget/widgets-bundle-fieldset.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 4 | TS2307 | Cannot find module '../../../../app/widget/lib/tripAnimation/trip-animation-widget.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 170 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 178 | TS2304 | Cannot find name 'TbOpenStreetMap'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 195 | TS2304 | Cannot find name 'tinycolor'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 196 | TS2304 | Cannot find name 'tinycolor'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 197 | TS2304 | Cannot find name 'tinycolor'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 198 | TS2304 | Cannot find name 'tinycolor'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 223 | TS2304 | Cannot find name 'tinycolor'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 237 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 238 | TS2304 | Cannot find name 'tinycolor'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 239 | TS2304 | Cannot find name 'tinycolor'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 240 | TS2304 | Cannot find name 'tinycolor'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 248 | TS2304 | Cannot find name 'tinycolor'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 250 | TS2304 | Cannot find name 'L'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 261 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 262 | TS2304 | Cannot find name 'L'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 269 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 273 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 277 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 281 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 285 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 289 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 293 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 298 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 319 | TS2304 | Cannot find name 'L'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 368 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 376 | TS2304 | Cannot find name 'processPattern'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 378 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 394 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 402 | TS2304 | Cannot find name 'processPattern'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 404 | TS2304 | Cannot find name 'fillPatternWithActions'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 415 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 423 | TS2304 | Cannot find name 'processPattern'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 425 | TS2304 | Cannot find name 'fillPatternWithActions'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 436 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 444 | TS2304 | Cannot find name 'processPattern'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 446 | TS2304 | Cannot find name 'fillPatternWithActions'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 455 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 471 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 486 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 506 | TS2304 | Cannot find name 'L'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 561 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 561 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 570 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 577 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 579 | TS2304 | Cannot find name 'isNumber'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 580 | TS2304 | Cannot find name 'padValue'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 672 | TS2304 | Cannot find name 'L'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 682 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 688 | TS2304 | Cannot find name 'L'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 705 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 708 | TS2304 | Cannot find name 'L'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 714 | TS2304 | Cannot find name 'L'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 730 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 731 | TS2304 | Cannot find name 'L'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 743 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 752 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 753 | TS2304 | Cannot find name 'L'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 768 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 792 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 792 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 810 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 811 | TS2304 | Cannot find name 'angular'. |  |
| `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | 818 | TS2304 | Cannot find name 'L'. |  |
| `src/app-ng/feature/widget/widget-editor/widget-editor.component.ts` | 19 | TS2307 | Cannot find module '../../../../app/widget/save-widget-type-as.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/widget/widget-editor/widget-editor.component.ts` | 40 | TS2304 | Cannot find name 'beautify'. |  |
| `src/app-ng/feature/widget/widget-editor/widget-editor.component.ts` | 42 | TS2304 | Cannot find name 'beautify'. |  |
| `src/app-ng/feature/widget/widget-editor/widget-editor.component.ts` | 44 | TS2304 | Cannot find name 'beautify'. |  |
| `src/app-ng/feature/widget/widget-editor/widget-editor.component.ts` | 305 | TS2349 | This expression is not callable. Type 'TranslateService' has no call signatures. |  |
| `src/app-ng/feature/widget/widget-editor/widget-editor.component.ts` | 652 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/widget/widget-editor/widget-editor.component.ts` | 671 | TS2339 | Property 'go' does not exist on type 'Router'. |  |
| `src/app-ng/feature/widget/widget-library/widget-library.component.ts` | 18 | TS2307 | Cannot find module '../../../../app/widget/select-widget-type.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/widget/widget-library/widget-library.component.ts` | 208 | TS2339 | Property 'go' does not exist on type 'Router'. |  |
| `src/app-ng/feature/widget/widget-library/widget-library.component.ts` | 211 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/widget/widget-library/widget-library.component.ts` | 219 | TS2339 | Property 'go' does not exist on type 'Router'. |  |
| `src/app-ng/feature/widget/widget-library/widget-library.component.ts` | 235 | TS2339 | Property 'go' does not exist on type 'Router'. |  |
| `src/app-ng/feature/widget/widget-library/widget-library.component.ts` | 235 | TS2339 | Property 'current' does not exist on type 'Router'. |  |
| `src/app-ng/feature/widget/widget-library/widget-library.component.ts` | 235 | TS2339 | Property 'params' does not exist on type 'Router'. |  |
| `src/app-ng/feature/widget/widget-library/widget-library.component.ts` | 242 | TS2339 | Property 'confirm' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/widget/widget-library/widget-library.component.ts` | 249 | TS2339 | Property 'show' does not exist on type 'MatDialog'. |  |
| `src/app-ng/feature/widget/widgets-bundle/widgets-bundle.component.ts` | 11 | TS2307 | Cannot find module '../../../../app/widget/add-widgets-bundle.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/widget/widgets-bundle/widgets-bundle.component.ts` | 12 | TS2307 | Cannot find module '../../../../app/widget/widgets-bundle-card.tpl.html' or its corresponding type declarations. |  |
| `src/app-ng/feature/widget/widgets-bundle/widgets-bundle.component.ts` | 195 | TS2339 | Property 'go' does not exist on type 'Router'. |  |

## As in the old code (kept)

| File | Line | Code | Error | Why |
|---|---|---|---|---|
| `src/app-ng/feature/components/tb-dashboard-select/tb-dashboard-select.directive.ts` | 101 | TS2551 | Property 'yPosition' does not exist on type 'Overlay'. Did you mean 'position'? | a misspelt member the old code calls too (it fails there the same way) |
| `src/app-ng/feature/components/tb-dashboard-select/tb-dashboard-select.directive.ts` | 103 | TS2551 | Property 'yPosition' does not exist on type 'Overlay'. Did you mean 'position'? | a misspelt member the old code calls too (it fails there the same way) |
| `src/app-ng/feature/components/tb-dashboard-select/tb-dashboard-select.directive.ts` | 106 | TS2551 | Property 'xPosition' does not exist on type 'Overlay'. Did you mean 'position'? | a misspelt member the old code calls too (it fails there the same way) |
| `src/app-ng/feature/components/tb-dashboard-select/tb-dashboard-select.directive.ts` | 108 | TS2551 | Property 'xPosition' does not exist on type 'Overlay'. Did you mean 'position'? | a misspelt member the old code calls too (it fails there the same way) |
| `src/app-ng/feature/components/tb-legend-config/tb-legend-config.directive.ts` | 82 | TS2551 | Property 'yPosition' does not exist on type 'Overlay'. Did you mean 'position'? | a misspelt member the old code calls too (it fails there the same way) |
| `src/app-ng/feature/components/tb-legend-config/tb-legend-config.directive.ts` | 84 | TS2551 | Property 'yPosition' does not exist on type 'Overlay'. Did you mean 'position'? | a misspelt member the old code calls too (it fails there the same way) |
| `src/app-ng/feature/components/tb-legend-config/tb-legend-config.directive.ts` | 87 | TS2551 | Property 'xPosition' does not exist on type 'Overlay'. Did you mean 'position'? | a misspelt member the old code calls too (it fails there the same way) |
| `src/app-ng/feature/components/tb-legend-config/tb-legend-config.directive.ts` | 89 | TS2551 | Property 'xPosition' does not exist on type 'Overlay'. Did you mean 'position'? | a misspelt member the old code calls too (it fails there the same way) |
| `src/app-ng/feature/components/tb-timewindow/tb-timewindow.directive.ts` | 144 | TS2551 | Property 'yPosition' does not exist on type 'Overlay'. Did you mean 'position'? | a misspelt member the old code calls too (it fails there the same way) |
| `src/app-ng/feature/components/tb-timewindow/tb-timewindow.directive.ts` | 146 | TS2551 | Property 'yPosition' does not exist on type 'Overlay'. Did you mean 'position'? | a misspelt member the old code calls too (it fails there the same way) |
| `src/app-ng/feature/components/tb-timewindow/tb-timewindow.directive.ts` | 149 | TS2551 | Property 'xPosition' does not exist on type 'Overlay'. Did you mean 'position'? | a misspelt member the old code calls too (it fails there the same way) |
| `src/app-ng/feature/components/tb-timewindow/tb-timewindow.directive.ts` | 151 | TS2551 | Property 'xPosition' does not exist on type 'Overlay'. Did you mean 'position'? | a misspelt member the old code calls too (it fails there the same way) |
| `src/app-ng/feature/entity/tb-aliases-entity-select/tb-aliases-entity-select.directive.ts` | 77 | TS2551 | Property 'yPosition' does not exist on type 'Overlay'. Did you mean 'position'? | a misspelt member the old code calls too (it fails there the same way) |
| `src/app-ng/feature/entity/tb-aliases-entity-select/tb-aliases-entity-select.directive.ts` | 79 | TS2551 | Property 'yPosition' does not exist on type 'Overlay'. Did you mean 'position'? | a misspelt member the old code calls too (it fails there the same way) |
| `src/app-ng/feature/entity/tb-aliases-entity-select/tb-aliases-entity-select.directive.ts` | 82 | TS2551 | Property 'xPosition' does not exist on type 'Overlay'. Did you mean 'position'? | a misspelt member the old code calls too (it fails there the same way) |
| `src/app-ng/feature/entity/tb-aliases-entity-select/tb-aliases-entity-select.directive.ts` | 84 | TS2551 | Property 'xPosition' does not exist on type 'Overlay'. Did you mean 'position'? | a misspelt member the old code calls too (it fails there the same way) |

