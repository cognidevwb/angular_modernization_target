# Migration order (S3)

415 units in 39 slices (36 route slices). Order violations: 0. Cycles: 0. Rank taken from the kind (no S2b layer): 4.

**Rule.** A unit goes to the deepest route state that contains every route needing it (S0's route closures); units needed across top-level states go to the foundation. Slices run foundation → route states (parents before children) → no route evidence → bootstrap. Inside a slice, what a unit uses comes first; ties by rank (models → services → state → leaf UI → pages → routes), then units already using migrated code, then name. Templates follow the unit that loads them.

**Inside a unit** (the numbered list under it): a function comes before the functions written inside it — the controller becomes the class, then its members; among siblings, what is called comes first; ties by line.

**No route evidence (213):** S0 records no route that reaches these units — typically dynamic states, modals opened in code, or `ng-include`. They are ordered by the same rule, after the route slices.

| # | Slice | Units | Templates | Routes |
|---|---|---|---|---|
| 1 | `foundation` | 1 | 0 | 0 |
| 2 | `dashboard` | 1 | 0 | 1 |
| 3 | `home` | 7 | 0 | 1 |
| 4 | `home.assets` | 1 | 0 | 1 |
| 5 | `home.auditLogs` | 2 | 0 | 1 |
| 6 | `home.customers` | 2 | 0 | 1 |
| 7 | `home.customers.assets` | 1 | 0 | 1 |
| 8 | `home.customers.dashboards` | 1 | 0 | 1 |
| 9 | `home.customers.dashboards.dashboard` | 1 | 0 | 1 |
| 10 | `home.customers.devices` | 1 | 0 | 1 |
| 11 | `home.customers.entityViews` | 1 | 0 | 1 |
| 12 | `home.customers.users` | 1 | 0 | 1 |
| 13 | `home.dashboards` | 1 | 0 | 1 |
| 14 | `home.dashboards.dashboard` | 1 | 0 | 1 |
| 15 | `home.devices` | 1 | 0 | 1 |
| 16 | `home.entityViews` | 1 | 0 | 1 |
| 17 | `home.jsonform` | 2 | 0 | 1 |
| 18 | `home.links` | 2 | 0 | 1 |
| 19 | `home.profile` | 2 | 0 | 1 |
| 20 | `home.ruleChains` | 3 | 0 | 1 |
| 21 | `home.ruleChains.importRuleChain` | 1 | 0 | 1 |
| 22 | `home.ruleChains.ruleChain` | 1 | 0 | 1 |
| 23 | `home.settings` | 2 | 0 | 1 |
| 24 | `home.settings.general` | 1 | 0 | 1 |
| 25 | `home.settings.outgoing-mail` | 1 | 0 | 1 |
| 26 | `home.settings.security-settings` | 2 | 0 | 1 |
| 27 | `home.tenants` | 2 | 0 | 1 |
| 28 | `home.tenants.users` | 1 | 0 | 1 |
| 29 | `home.widgets-bundles` | 2 | 0 | 1 |
| 30 | `home.widgets-bundles.widget-types` | 2 | 0 | 1 |
| 31 | `home.widgets-bundles.widget-types.widget-type` | 2 | 0 | 1 |
| 32 | `login` | 3 | 0 | 1 |
| 33 | `login.createPassword` | 2 | 0 | 1 |
| 34 | `login.resetExpiredPassword` | 1 | 0 | 1 |
| 35 | `login.resetPassword` | 1 | 0 | 1 |
| 36 | `login.resetPasswordRequest` | 2 | 0 | 1 |
| 37 | `widgetEditor` | 1 | 0 | 1 |
| 38 | `no route evidence` | 213 | 0 | 0 |
| 39 | `bootstrap` | 142 | 0 | 0 |

## `foundation` — 1 units

1. `DashboardController` controller — `src/app/dashboard/index.js` · pages · uses 0 · used by 4

## `dashboard` — 1 units

2. `dashboard` ui-router — `src/app/dashboard/dashboard.routes.js` · routes · uses 1 · used by 0

## `home` — 7 units

3. `AssetController` controller — `src/app/asset/index.js` · pages · uses 0 · used by 2
4. `DashboardsController` controller — `src/app/dashboard/index.js` · pages · uses 0 · used by 2
5. `DeviceController` controller — `src/app/device/index.js` · pages · uses 0 · used by 2
6. `EntityViewController` controller — `src/app/entity-view/index.js` · pages · uses 0 · used by 2
7. `HomeController` controller — `src/app/layout/index.js` · pages · uses 0 · used by 1
8. `UserController` controller — `src/app/user/index.js` · pages · uses 0 · used by 2
9. `home` ui-router — `src/app/layout/home.routes.js` · routes · uses 1 · used by 0

## `home.assets` — 1 units

10. `home.assets` ui-router — `src/app/asset/asset.routes.js` · routes · uses 1 · used by 0

## `home.auditLogs` — 2 units

11. `AuditLogsController` controller — `src/app/audit/index.js` · pages · uses 0 · used by 1
12. `home.auditLogs` ui-router — `src/app/audit/audit-log.routes.js` · routes · uses 1 · used by 0

## `home.customers` — 2 units

13. `CustomerController` controller — `src/app/customer/index.js` · pages · uses 0 · used by 1
14. `home.customers` ui-router — `src/app/customer/customer.routes.js` · routes · uses 1 · used by 0

## `home.customers.assets` — 1 units

15. `home.customers.assets` ui-router — `src/app/asset/asset.routes.js` · routes · uses 1 · used by 0

## `home.customers.dashboards` — 1 units

16. `home.customers.dashboards` ui-router — `src/app/dashboard/dashboard.routes.js` · routes · uses 1 · used by 0

## `home.customers.dashboards.dashboard` — 1 units

17. `home.customers.dashboards.dashboard` ui-router — `src/app/dashboard/dashboard.routes.js` · routes · uses 1 · used by 0

## `home.customers.devices` — 1 units

18. `home.customers.devices` ui-router — `src/app/device/device.routes.js` · routes · uses 1 · used by 0

## `home.customers.entityViews` — 1 units

19. `home.customers.entityViews` ui-router — `src/app/entity-view/entity-view.routes.js` · routes · uses 1 · used by 0

## `home.customers.users` — 1 units

20. `home.customers.users` ui-router — `src/app/user/user.routes.js` · routes · uses 1 · used by 0

## `home.dashboards` — 1 units

21. `home.dashboards` ui-router — `src/app/dashboard/dashboard.routes.js` · routes · uses 1 · used by 0

## `home.dashboards.dashboard` — 1 units

22. `home.dashboards.dashboard` ui-router — `src/app/dashboard/dashboard.routes.js` · routes · uses 1 · used by 0

## `home.devices` — 1 units

23. `home.devices` ui-router — `src/app/device/device.routes.js` · routes · uses 1 · used by 0

## `home.entityViews` — 1 units

24. `home.entityViews` ui-router — `src/app/entity-view/entity-view.routes.js` · routes · uses 1 · used by 0

## `home.jsonform` — 2 units

25. `JsonFormController` controller — `src/app/jsonform/index.js` · pages · uses 0 · used by 1
26. `home.jsonform` ui-router — `src/app/jsonform/jsonform.routes.js` · routes · uses 1 · used by 0

## `home.links` — 2 units

27. `HomeLinksController` controller — `src/app/home/index.js` · pages · uses 0 · used by 1
28. `home.links` ui-router — `src/app/home/home-links.routes.js` · routes · uses 1 · used by 0

## `home.profile` — 2 units

29. `ProfileController` controller — `src/app/profile/index.js` · pages · uses 0 · used by 1
30. `home.profile` ui-router — `src/app/profile/profile.routes.js` · routes · uses 1 · used by 0

## `home.ruleChains` — 3 units

31. `RuleChainController` controller — `src/app/rulechain/index.js` · pages · uses 0 · used by 2
32. `RuleChainsController` controller — `src/app/rulechain/index.js` · pages · uses 0 · used by 1
33. `home.ruleChains` ui-router — `src/app/rulechain/rulechain.routes.js` · routes · uses 1 · used by 0

## `home.ruleChains.importRuleChain` — 1 units

34. `home.ruleChains.importRuleChain` ui-router — `src/app/rulechain/rulechain.routes.js` · routes · uses 1 · used by 0

## `home.ruleChains.ruleChain` — 1 units

35. `home.ruleChains.ruleChain` ui-router — `src/app/rulechain/rulechain.routes.js` · routes · uses 1 · used by 0

## `home.settings` — 2 units

36. `AdminController` controller — `src/app/admin/index.js` · pages · uses 0 · used by 2
37. `home.settings` ui-router — `src/app/admin/admin.routes.js` · routes · uses 0 · used by 0

## `home.settings.general` — 1 units

38. `home.settings.general` ui-router — `src/app/admin/admin.routes.js` · routes · uses 1 · used by 0

## `home.settings.outgoing-mail` — 1 units

39. `home.settings.outgoing-mail` ui-router — `src/app/admin/admin.routes.js` · routes · uses 1 · used by 0

## `home.settings.security-settings` — 2 units

40. `SecuritySettingsController` controller — `src/app/admin/index.js` · pages · uses 0 · used by 1
41. `home.settings.security-settings` ui-router — `src/app/admin/admin.routes.js` · routes · uses 1 · used by 0

## `home.tenants` — 2 units

42. `TenantController` controller — `src/app/tenant/index.js` · pages · uses 0 · used by 1
43. `home.tenants` ui-router — `src/app/tenant/tenant.routes.js` · routes · uses 1 · used by 0

## `home.tenants.users` — 1 units

44. `home.tenants.users` ui-router — `src/app/user/user.routes.js` · routes · uses 1 · used by 0

## `home.widgets-bundles` — 2 units

45. `WidgetsBundleController` controller — `src/app/widget/index.js` · pages · uses 0 · used by 1
46. `home.widgets-bundles` ui-router — `src/app/widget/widget-library.routes.js` · routes · uses 1 · used by 0

## `home.widgets-bundles.widget-types` — 2 units

47. `WidgetLibraryController` controller — `src/app/widget/index.js` · pages · uses 0 · used by 1
48. `home.widgets-bundles.widget-types` ui-router — `src/app/widget/widget-library.routes.js` · routes · uses 1 · used by 0

## `home.widgets-bundles.widget-types.widget-type` — 2 units

49. `WidgetEditorController` controller — `src/app/widget/index.js` · pages · uses 0 · used by 1
50. `home.widgets-bundles.widget-types.widget-type` ui-router — `src/app/widget/widget-library.routes.js` · routes · uses 1 · used by 0

## `login` — 3 units

51. `LoginController` controller — `src/app/login/index.js` · pages · uses 0 · used by 1
52. `ResetPasswordController` controller — `src/app/login/index.js` · pages · uses 0 · used by 2
53. `login` ui-router — `src/app/login/login.routes.js` · routes · uses 1 · used by 0

## `login.createPassword` — 2 units

54. `CreatePasswordController` controller — `src/app/login/index.js` · pages · uses 0 · used by 1
55. `login.createPassword` ui-router — `src/app/login/login.routes.js` · routes · uses 1 · used by 0

## `login.resetExpiredPassword` — 1 units

56. `login.resetExpiredPassword` ui-router — `src/app/login/login.routes.js` · routes · uses 1 · used by 0

## `login.resetPassword` — 1 units

57. `login.resetPassword` ui-router — `src/app/login/login.routes.js` · routes · uses 1 · used by 0

## `login.resetPasswordRequest` — 2 units

58. `ResetPasswordRequestController` controller — `src/app/login/index.js` · pages · uses 0 · used by 1
59. `login.resetPasswordRequest` ui-router — `src/app/login/login.routes.js` · routes · uses 1 · used by 0

## `widgetEditor` — 1 units

60. `widgetEditor` ui-router — `src/app/widget/widget-library.routes.js` · routes · uses 1 · used by 0

## `no route evidence` — 213 units

61. `ReactSchemaForm` value — `src/app/components/json-form.directive.js` · models and helpers · uses 0 · used by 0
  - 1. `setValue` L232–246
  - 2. `selectOrSet` L248–286 · calls `setValue`
  - 3. `JsonForm` L35–230 · calls `linker`
    - 4. `linker` L37–215 · calls `recompile`, `scope.validate`, `scope.updateValues`
      - 5. `destroyModelChangeWatches` L45–52
      - 6. `recompile` L70–76
      - 7. `scope.formProps.onModelChange` L87–93 · calls `selectOrSet`
      - 8. `scope.formProps.onToggleFullscreen` L100–103
      - 9. `scope.showColorPicker` L106–131
      - 10. `scope.formProps.onColorClick` L94–96 · calls `scope.showColorPicker`
      - 11. `scope.openIconDialog` L133–148
      - 12. `scope.formProps.onIconClick` L97–99 · calls `scope.openIconDialog`
      - 13. `scope.onFullscreenChanged` L150–150
      - 14. `scope.validate` L152–159
      - 15. `initModelChangeWatches` L54–68 · calls `scope.validate`, `scope.updateValues` · cycle
      - 16. `scope.updateValues` L161–184 · calls `destroyModelChangeWatches`, `initModelChangeWatches`, `recompile` · cycle
62. `helpLinks` constant — `src/app/help/help-links.constant.js` · models and helpers · uses 0 · used by 2
  - 1. `getRuleNodeLink` L113–126
63. `types` constant — `src/app/common/types.constant.js` · models and helpers · uses 0 · used by 24
64. `utils` factory — `src/app/common/utils.service.js` · models and helpers · uses 1 · used by 12
  - 1. `Utils` L36–619 · calls `getPredefinedFunctionsList`, `getPredefinedFunctionBody`, `getMaterialColor`, `getMaterialIcons`, `getCommonMaterialIcons`, `genMaterialColor`, `objectHashCode`, `parseException`, `processWidgetException`, `getDefaultDatasource`, `generateObjectFromJsonSchema`, `getDefaultDatasourceJson`, `getDefaultAlarmDataKeys`, `isDescriptorSchemaNotEmpty`, `filterSearchTextEntities`, `guid`, `cleanCopy`, `isLocalUrl`, `validateDatasources`, `createKey`, `createAdditionalDataKey`, `createLabelFromDatasource`, `insertVariable`, `customTranslation`, `objToBase64`, `base64toObj`, `loadImageAspect`, `sortObjectKeys`
    - 2. `getPredefinedFunctionsList` L159–161
    - 3. `getPredefinedFunctionBody` L163–165
    - 4. `getMaterialColor` L167–170
    - 5. `getMaterialIcons` L172–191
    - 6. `getCommonMaterialIcons` L193–195
    - 7. `hashCode` L202–212
    - 8. `genMaterialColor` L197–200 · calls `getMaterialColor`, `hashCode`
    - 9. `objectHashCode` L214–221 · calls `hashCode`
    - 10. `parseException` L223–258
    - 11. `processWidgetException` L260–268 · calls `parseException`
    - 12. `deleteNullProperties` L284–299
    - 13. `generateObjectFromJsonSchema` L278–282 · calls `deleteNullProperties`
    - 14. `getDefaultDatasource` L270–276 · calls `generateObjectFromJsonSchema`
    - 15. `getDefaultDatasourceJson` L301–303 · calls `getDefaultDatasource`
    - 16. `initDefaultAlarmDataKeys` L305–318 · calls `getMaterialColor`
    - 17. `getDefaultAlarmDataKeys` L320–325 · calls `initDefaultAlarmDataKeys`
    - 18. `isDescriptorSchemaNotEmpty` L327–336
    - 19. `filterSearchTextEntities` L338–394
    - 20. `guid` L396–404 · calls `s4`
      - 21. `s4` L397–401
    - 22. `cleanCopy` L406–414
    - 23. `genNextColor` L416–425 · calls `getMaterialColor`
    - 24. `isLocalUrl` L427–436
    - 25. `validateDatasources` L438–457
    - 26. `createKey` L459–494 · calls `genNextColor`
    - 27. `createLabelFromDatasource` L513–535
    - 28. `createAdditionalDataKey` L496–511 · calls `genNextColor`, `createLabelFromDatasource`
    - 29. `insertVariable` L537–549
    - 30. `customTranslation` L551–561
    - 31. `objToBase64` L563–568
    - 32. `base64toObj` L570–575
    - 33. `loadImageAspect` L577–607 · calls `hashCode`
      - 34. `testImage.onload` L587–592
      - 35. `testImage.onerror` L593–597
    - 36. `sortObjectKeys` L609–617
65. `Fullscreen` factory — `src/app/common/thirdparty-fix.js` · data and domain services · uses 0 · used by 0
66. `adminService` factory — `src/app/api/admin.service.js` · data and domain services · uses 0 · used by 1
  - 1. `AdminService` L21–99 · calls `getAdminSettings`, `saveAdminSettings`, `getSecuritySettings`, `saveSecuritySettings`, `sendTestMail`, `checkUpdates`
    - 2. `getAdminSettings` L34–43
    - 3. `saveAdminSettings` L45–54
    - 4. `getSecuritySettings` L56–65
    - 5. `saveSecuritySettings` L67–76
    - 6. `sendTestMail` L78–87
    - 7. `checkUpdates` L89–98
67. `alarmService` factory — `src/app/api/alarm.service.js` · data and domain services · uses 2 · used by 0
  - 1. `AlarmService` L21–356 · calls `getAlarm`, `getAlarmInfo`, `saveAlarm`, `ackAlarm`, `clearAlarm`, `deleteAlarm`, `getAlarms`, `getHighestAlarmSeverity`, `pollAlarms`, `cancelPollAlarms`, `subscribeForAlarms`, `unsubscribeFromAlarms`
    - 2. `getAlarm` L61–74
    - 3. `getAlarmInfo` L76–89
    - 4. `saveAlarm` L91–104
    - 5. `ackAlarm` L106–119
    - 6. `clearAlarm` L121–134
    - 7. `deleteAlarm` L136–149
    - 8. `getAlarms` L151–183
    - 9. `getHighestAlarmSeverity` L185–200
    - 10. `fetchAlarms` L202–233 · calls `getAlarms`
    - 11. `getAlarmsByQuery` L235–268 · calls `fetchAlarms`
    - 12. `onPollAlarms` L270–277 · calls `getAlarmsByQuery`, `alarmSourceListener.alarmsQuery.onAlarms` · cycle
    - 13. `subscribeForAlarms` L300–345 · calls `onPollAlarms` · cycle
      - 14. `alarmSourceListener.alarmsQuery.onAlarms` L329–339
    - 15. `pollAlarms` L279–292 · calls `onPollAlarms`
    - 16. `cancelPollAlarms` L294–298
    - 17. `unsubscribeFromAlarms` L347–355
68. `auditLogService` factory — `src/app/api/audit-log.service.js` · data and domain services · uses 0 · used by 0
  - 1. `AuditLogService` L21–116 · calls `getAuditLogsByEntityId`, `getAuditLogsByUserId`, `getAuditLogsByCustomerId`, `getAuditLogs`
    - 2. `getAuditLogsByEntityId` L32–51
    - 3. `getAuditLogsByUserId` L53–72
    - 4. `getAuditLogsByCustomerId` L74–93
    - 5. `getAuditLogs` L95–114
69. `clipboardService` factory — `src/app/services/clipboard.service.js` · data and domain services · uses 0 · used by 0
  - 1. `ClipboardService` L21–128 · calls `copyToClipboard`, `fakeHandlerCallback`
    - 2. `select` L84–124
    - 3. `copyToClipboard` L32–70 · calls `fakeHandlerCallback`, `removeFake`, `select` · cycle
      - 4. `fakeHandlerCallback` L36–36 · calls `removeFake`
    - 5. `removeFake` L72–82 · calls `fakeHandlerCallback` · cycle
70. `componentDescriptorService` factory — `src/app/api/component-descriptor.service.js` · data and domain services · uses 0 · used by 1
  - 1. `ComponentDescriptorService` L20–123 · calls `getComponentDescriptorsByType`, `getComponentDescriptorsByTypes`, `getComponentDescriptorByClazz`, `getPluginActionsByPluginClazz`
    - 2. `getComponentDescriptorsByType` L35–54
    - 3. `getComponentDescriptorsByTypes` L56–89
    - 4. `getComponentDescriptorByClazz` L91–105
    - 5. `getPluginActionsByPluginClazz` L107–121
71. `customerService` factory — `src/app/api/customer.service.js` · data and domain services · uses 1 · used by 4
  - 1. `CustomerService` L21–170 · calls `getCustomers`, `getCustomer`, `getShortCustomerInfo`, `applyAssignedCustomersInfo`, `applyAssignedCustomerInfo`, `saveCustomer`, `deleteCustomer`
    - 2. `getCustomers` L35–53
    - 3. `getCustomer` L55–64
    - 4. `getShortCustomerInfo` L66–75
    - 5. `applyAssignedCustomersInfo` L77–125 · calls `loadNextCustomerInfo`
      - 6. `loadNextCustomerInfoOrComplete` L80–87 · calls `loadNextCustomerInfo` · cycle
      - 7. `loadNextCustomerInfo` L89–118 · calls `getShortCustomerInfo`, `loadNextCustomerInfoOrComplete` · cycle
    - 8. `applyAssignedCustomerInfo` L127–146 · calls `getShortCustomerInfo`
    - 9. `saveCustomer` L148–157
    - 10. `deleteCustomer` L159–168
72. `dashboardService` factory — `src/app/api/dashboard.service.js` · data and domain services · uses 0 · used by 4
  - 1. `DashboardService` L20–295 · calls `getTenantDashboardsByTenantId`, `getTenantDashboards`, `getCustomerDashboards`, `getServerTimeDiff`, `getDashboard`, `getDashboardInfo`, `saveDashboard`, `deleteDashboard`, `assignDashboardToCustomer`, `unassignDashboardFromCustomer`, `updateDashboardCustomers`, `addDashboardCustomers`, `removeDashboardCustomers`, `makeDashboardPublic`, `makeDashboardPrivate`, `getPublicDashboardLink`
    - 2. `getServerTimeDiff` L108–126
    - 3. `deleteDashboard` L161–170
    - 4. `getPublicDashboardLink` L249–257
    - 5. `prepareDashboard` L268–286
    - 6. `getDashboard` L128–137 · calls `prepareDashboard`
    - 7. `getDashboardInfo` L139–148 · calls `prepareDashboard`
    - 8. `assignDashboardToCustomer` L172–181 · calls `prepareDashboard`
    - 9. `unassignDashboardFromCustomer` L183–192 · calls `prepareDashboard`
    - 10. `updateDashboardCustomers` L194–203 · calls `prepareDashboard`
    - 11. `addDashboardCustomers` L205–214 · calls `prepareDashboard`
    - 12. `removeDashboardCustomers` L216–225 · calls `prepareDashboard`
    - 13. `makeDashboardPublic` L227–236 · calls `prepareDashboard`
    - 14. `makeDashboardPrivate` L238–247 · calls `prepareDashboard`
    - 15. `prepareDashboards` L259–266 · calls `prepareDashboard`
    - 16. `getTenantDashboardsByTenantId` L50–68 · calls `prepareDashboards`
    - 17. `getTenantDashboards` L70–88 · calls `prepareDashboards`
    - 18. `getCustomerDashboards` L90–106 · calls `prepareDashboards`
    - 19. `cleanDashboard` L288–293
    - 20. `saveDashboard` L150–159 · calls `prepareDashboard`, `cleanDashboard`
73. `entityRelationService` factory — `src/app/api/entity-relation.service.js` · data and domain services · uses 0 · used by 1
  - 1. `EntityRelationService` L21–189 · calls `saveRelation`, `deleteRelation`, `deleteRelations`, `getRelation`, `findByFrom`, `findInfoByFrom`, `findByFromAndType`, `findByTo`, `findInfoByTo`, `findByToAndType`, `findByQuery`, `findInfoByQuery`
    - 2. `saveRelation` L40–49
    - 3. `deleteRelation` L51–64
    - 4. `deleteRelations` L66–76
    - 5. `getRelation` L78–91
    - 6. `findByFrom` L93–103
    - 7. `findInfoByFrom` L105–115
    - 8. `findByFromAndType` L117–128
    - 9. `findByTo` L130–140
    - 10. `findInfoByTo` L142–152
    - 11. `findByToAndType` L154–165
    - 12. `findByQuery` L167–176
    - 13. `findInfoByQuery` L178–187
74. `eventService` factory — `src/app/api/event.service.js` · data and domain services · uses 0 · used by 0
  - 1. `EventService` L21–50 · calls `getEvents`
    - 2. `getEvents` L29–48
75. `globalInterceptor` factory — `src/app/app.js` · data and domain services · uses 0 · used by 0
76. `importExport` factory — `src/app/import-export/index.js` · data and domain services (from kind) · uses 0 · used by 0
77. `loginService` factory — `src/app/api/login.service.js` · data and domain services · uses 0 · used by 1
  - 1. `LoginService` L21–125 · calls `hasUser`, `login`, `publicLogin`, `sendResetPasswordLink`, `resetPassword`, `activate`, `changePassword`, `loadOAuth2Clients`
    - 2. `hasUser` L36–38
    - 3. `login` L40–52
    - 4. `publicLogin` L54–65
    - 5. `sendResetPasswordLink` L67–76
    - 6. `resetPassword` L78–87
    - 7. `activate` L89–101
    - 8. `changePassword` L103–112
    - 9. `loadOAuth2Clients` L114–124
78. `queueService` factory — `src/app/api/queue.service.js` · data and domain services · uses 0 · used by 0
  - 1. `queueService` L22–40 · calls `getTenantQueuesByServiceType`
    - 2. `getTenantQueuesByServiceType` L29–39
79. `ruleChainService` factory — `src/app/api/rule-chain.service.js` · data and domain services · uses 2 · used by 2
  - 1. `RuleChainService` L20–302 · calls `getRuleChains`, `getRuleChain`, `saveRuleChain`, `setRootRuleChain`, `deleteRuleChain`, `getRuleChainMetaData`, `saveRuleChainMetaData`, `getRuleNodeSupportedLinks`, `ruleNodeAllowCustomLinks`, `getRuleNodeComponents`, `getRuleNodeComponentByClazz`, `resolveTargetRuleChains`, `testScript`, `getLatestRuleNodeDebugInput`
    - 2. `getRuleChains` L43–61
    - 3. `getRuleChain` L63–72
    - 4. `saveRuleChain` L74–83
    - 5. `setRootRuleChain` L85–94
    - 6. `deleteRuleChain` L96–105
    - 7. `getRuleChainMetaData` L107–116
    - 8. `saveRuleChainMetaData` L118–127
    - 9. `getRuleNodeSupportedLinks` L129–140
    - 10. `ruleNodeAllowCustomLinks` L142–144
    - 11. `resolveRuleNodeComponentUiResources` L201–223
    - 12. `resolveRuleNodeComponentsUiResources` L183–199 · calls `resolveRuleNodeComponentUiResources`
    - 13. `getRuleNodeComponentByClazz` L225–234
    - 14. `resolveRuleChain` L261–274 · calls `getRuleChain`
    - 15. `resolveTargetRuleChains` L236–259 · calls `resolveRuleChain`
    - 16. `loadRuleNodeComponents` L276–278
    - 17. `getRuleNodeComponents` L146–181 · calls `resolveRuleNodeComponentsUiResources`, `loadRuleNodeComponents`
    - 18. `testScript` L280–289
    - 19. `getLatestRuleNodeDebugInput` L291–300
80. `ruleNodeScriptTest` factory — `src/app/rulechain/index.js` · data and domain services (from kind) · uses 0 · used by 0
81. `statesControllerService` factory — `src/app/dashboard/states/index.js` · data and domain services (from kind) · uses 0 · used by 0
82. `tbMissingTranslationHandler` factory — `src/app/locale/translate-handler.js` · data and domain services · uses 0 · used by 0
  - 1. `ThingsboardMissingTranslateHandler` L21–29
83. `tbRaf` provider — `src/app/common/raf.provider.js` · data and domain services · uses 0 · used by 0
  - 1. `TbRAFProvider` L20–49
    - 2. `this.$get` L22–48
84. `tenantService` factory — `src/app/api/tenant.service.js` · data and domain services · uses 0 · used by 1
  - 1. `TenantService` L21–85 · calls `getTenants`, `getTenant`, `saveTenant`, `deleteTenant`
    - 2. `getTenants` L32–50
    - 3. `getTenant` L52–61
    - 4. `saveTenant` L63–72
    - 5. `deleteTenant` L74–83
85. `timeService` factory — `src/app/api/time.service.js` · data and domain services · uses 1 · used by 4
  - 1. `TimeService` L33–413 · calls `loadMaxDatapointsLimit`, `minIntervalLimit`, `maxIntervalLimit`, `boundMinInterval`, `boundMaxInterval`, `getIntervals`, `matchesExistingInterval`, `boundToPredefinedInterval`, `defaultTimewindow`, `toHistoryTimewindow`, `createSubscriptionTimewindow`, `createTimewindowForComparison`
    - 2. `service.getMaxDatapointsLimit` L51–53
    - 3. `service.getMinDatapointsLimit` L54–56
    - 4. `loadMaxDatapointsLimit` L61–74
    - 5. `toBound` L99–107
    - 6. `boundMinInterval` L91–93 · calls `toBound`
    - 7. `minIntervalLimit` L76–79 · calls `boundMinInterval`
    - 8. `avgInterval` L81–84 · calls `boundMinInterval`
    - 9. `boundMaxInterval` L95–97 · calls `toBound`
    - 10. `maxIntervalLimit` L86–89 · calls `boundMaxInterval`
    - 11. `initPredefIntervals` L123–204
    - 12. `getIntervals` L109–121 · calls `boundMinInterval`, `boundMaxInterval`, `initPredefIntervals`
    - 13. `matchesExistingInterval` L206–215 · calls `getIntervals`
    - 14. `boundToPredefinedInterval` L217–232 · calls `getIntervals`
    - 15. `defaultTimewindow` L234–261
    - 16. `boundIntervalToTimewindow` L376–388 · calls `minIntervalLimit`, `avgInterval`, `maxIntervalLimit`, `toBound`, `boundToPredefinedInterval`
    - 17. `toHistoryTimewindow` L263–301 · calls `boundIntervalToTimewindow`
    - 18. `createSubscriptionTimewindow` L303–374 · calls `boundIntervalToTimewindow`
    - 19. `createTimewindowForComparison` L390–412
86. `dashboardUtils` factory — `src/app/common/dashboard-utils.service.js` · data and domain services · uses 3 · used by 1
  - 1. `DashboardUtils` L21–566 · calls `validateAndUpdateWidget`, `createDefaultLayoutData`, `createDefaultState`, `validateAndUpdateDashboard`, `getRootStateId`, `createSingleWidgetDashboard`, `createSingleEntityFilter`, `getStateLayoutsData`, `setLayouts`, `updateLayoutSettings`, `addWidgetToLayout`, `removeWidgetFromLayout`, `isSingleLayoutDashboard`, `removeUnusedWidgets`, `getWidgetsArray`
    - 2. `validateAliasId` L70–93
    - 3. `validateAndUpdateDeviceAlias` L95–120 · calls `validateAliasId`
    - 4. `validateAndUpdateEntityAlias` L122–139 · calls `validateAliasId`
    - 5. `validateAndUpdateEntityAliases` L43–68 · calls `validateAndUpdateDeviceAlias`, `validateAndUpdateEntityAlias`
    - 6. `validateAndUpdateWidget` L141–162
    - 7. `createDefaultLayoutData` L164–175
    - 8. `createDefaultLayouts` L177–181 · calls `createDefaultLayoutData`
    - 9. `createDefaultState` L183–189 · calls `createDefaultLayouts`
    - 10. `validateAndUpdateDashboard` L191–324 · calls `validateAndUpdateEntityAliases`, `validateAndUpdateWidget`, `createDefaultState`
    - 11. `getRootStateId` L326–334
    - 12. `createSingleWidgetDashboard` L336–350 · calls `validateAndUpdateDashboard`
    - 13. `createSingleEntityFilter` L352–358
    - 14. `getStateLayoutsData` L360–386
    - 15. `updateLayoutSettings` L422–448
    - 16. `addWidgetToLayout` L450–504
    - 17. `isSingleLayoutDashboard` L515–531
    - 18. `removeUnusedWidgets` L533–554
    - 19. `setLayouts` L388–420 · calls `removeUnusedWidgets`
    - 20. `removeWidgetFromLayout` L506–513 · calls `removeUnusedWidgets`
    - 21. `getWidgetsArray` L556–565
87. `toast` factory — `src/app/services/toast.js` · data and domain services (from kind) · uses 0 · used by 5
88. `userService` factory — `src/app/api/user.service.js` · data and domain services · uses 5 · used by 9
  - 1. `UserService` L25–688 · calls `reloadUser`, `setUserFromJwtToken`, `isAuthenticated`, `getJwtToken`, `logout`, `clearJwtToken`, `isJwtTokenValid`, `validateJwtToken`, `refreshTokenPending`, `refreshJwtToken`, `getCurrentUser`, `getAuthority`, `isPublic`, `getPublicId`, `parsePublicId`, `isUserLoaded`, `updateAuthorizationHeader`, `setAuthorizationRequestHeader`, `getTenantAdmins`, `getCustomerUsers`, `saveUser`, `setUserCredentialsEnabled`, `getUser`, `deleteUser`, `sendActivationEmail`, `getActivationLink`, `forceDefaultPlace`, `setRedirectParams`, `gotoDefaultPlace`, `updateLastPublicDashboardId`, `isUserTokenAccessEnabled`, `loginAsUser`
    - 2. `updateAndValidateToken` L84–101
    - 3. `clearTokenData` L103–108
    - 4. `isAuthenticated` L136–138
    - 5. `getJwtToken` L140–142
    - 6. `isTokenValid` L160–163
    - 7. `isJwtTokenValid` L156–158 · calls `isTokenValid`
    - 8. `resolveRefreshTokenQueue` L184–189
    - 9. `rejectRefreshTokenQueue` L191–196
    - 10. `refreshTokenPending` L198–200
    - 11. `getCurrentUser` L229–231
    - 12. `getAuthority` L233–239
    - 13. `isPublic` L241–247
    - 14. `getPublicId` L249–255 · calls `isPublic`
    - 15. `parsePublicId` L257–266 · calls `getJwtToken`
    - 16. `isUserLoaded` L268–270
    - 17. `showLoginErrorDialog` L422–431
    - 18. `loadIsUserTokenAccessEnabled` L433–449
    - 19. `loadSystemParams` L451–456 · calls `loadIsUserTokenAccessEnabled`
    - 20. `notifyUserLoaded` L458–463
    - 21. `updateAuthorizationHeader` L465–471
    - 22. `setAuthorizationRequestHeader` L473–479
    - 23. `getTenantAdmins` L481–499
    - 24. `getCustomerUsers` L501–519
    - 25. `saveUser` L521–533
    - 26. `setUserCredentialsEnabled` L535–547
    - 27. `getUser` L549–562
    - 28. `deleteUser` L564–573
    - 29. `sendActivationEmail` L575–584
    - 30. `getActivationLink` L586–595
    - 31. `setRedirectParams` L619–621
    - 32. `userHasDefaultDashboard` L651–655
    - 33. `gotoDefaultPlace` L623–649 · calls `isAuthenticated`, `isPublic`, `userHasDefaultDashboard`
    - 34. `userForceFullscreen` L657–662
    - 35. `setUserFromJwtToken` L110–134 · calls `updateAndValidateToken`, `clearTokenData`, `loadUser` · cycle
    - 36. `logout` L144–150 · calls `clearJwtToken` · cycle
    - 37. `clearJwtToken` L152–154 · calls `setUserFromJwtToken` · cycle
    - 38. `validateJwtToken` L165–182 · calls `clearJwtToken`, `isTokenValid`, `refreshJwtToken` · cycle
    - 39. `refreshJwtToken` L202–227 · calls `setUserFromJwtToken`, `clearJwtToken`, `isTokenValid`, `resolveRefreshTokenQueue`, `rejectRefreshTokenQueue` · cycle
    - 40. `loadUser` L272–420 · calls `updateAndValidateToken`, `procceedJwtTokenValidate`, `showLoginErrorDialog` · cycle
      - 41. `fetchAllowedDashboardIds` L276–296
      - 42. `updateUserLang` L298–302
      - 43. `procceedJwtTokenValidate` L304–355 · calls `logout`, `validateJwtToken`, `fetchAllowedDashboardIds`, `updateUserLang`, `loadSystemParams`, `getUser`, `userForceFullscreen`
    - 44. `reloadUser` L75–82 · calls `loadUser`, `notifyUserLoaded`
    - 45. `userHasProfile` L664–666
    - 46. `forceDefaultPlace` L597–617 · calls `isAuthenticated`, `isPublic`, `userHasDefaultDashboard`, `userHasProfile`
    - 47. `updateLastPublicDashboardId` L668–672 · calls `isPublic`
    - 48. `isUserTokenAccessEnabled` L674–676
    - 49. `loginAsUser` L678–686 · calls `setUserFromJwtToken`
89. `assetService` factory — `src/app/api/asset.service.js` · data and domain services · uses 2 · used by 1
  - 1. `AssetService` L21–292 · calls `getAsset`, `getAssets`, `saveAsset`, `deleteAsset`, `assignAssetToCustomer`, `unassignAssetFromCustomer`, `makeAssetPublic`, `getTenantAssets`, `getCustomerAssets`, `findByQuery`, `fetchAssetsByNameFilter`, `getAssetTypes`, `findByName`
    - 2. `getAsset` L41–54
    - 3. `getAssets` L56–80
    - 4. `saveAsset` L82–95
    - 5. `deleteAsset` L97–110
    - 6. `assignAssetToCustomer` L112–125
    - 7. `unassignAssetFromCustomer` L127–140
    - 8. `makeAssetPublic` L142–155
    - 9. `getTenantAssets` L157–190
    - 10. `getCustomerAssets` L192–226
    - 11. `findByQuery` L228–241
    - 12. `fetchAssetsByNameFilter` L243–267 · calls `getTenantAssets`, `getCustomerAssets`
    - 13. `getAssetTypes` L269–278
    - 14. `findByName` L280–290
90. `telemetryWebsocketService` factory — `src/app/api/telemetry-websocket.service.js` · data and domain services · uses 3 · used by 2
  - 1. `TelemetryWebsocketService` L29–362 · calls `subscribe`, `unsubscribe`, `reset`
    - 2. `hasCommands` L92–96
    - 3. `popCmds` L109–116
    - 4. `preparePublishCommands` L98–107 · calls `popCmds`
    - 5. `onError` L118–124
    - 6. `showWsError` L198–208
    - 7. `fetchKeys` L210–217
    - 8. `nextCmdId` L219–222
    - 9. `closeSocket` L339–344
    - 10. `checkToClose` L301–307 · calls `closeSocket`
    - 11. `onMessage` L173–196 · calls `showWsError`, `fetchKeys`, `checkToClose`
    - 12. `reset` L346–361 · calls `closeSocket`
    - 13. `publishCommands` L83–90 · calls `hasCommands`, `preparePublishCommands`, `checkToClose`, `tryOpenSocket` · cycle
    - 14. `onOpen` L126–146 · calls `publishCommands`, `subscribe` · cycle
    - 15. `onClose` L148–171 · calls `showWsError`, `tryOpenSocket`, `reset` · cycle
    - 16. `subscribe` L224–253 · calls `publishCommands`, `nextCmdId` · cycle
    - 17. `tryOpenSocket` L309–329 · calls `openSocket` · cycle
    - 18. `openSocket` L331–337 · calls `onError`, `onOpen`, `onClose`, `onMessage` · cycle
    - 19. `unsubscribe` L255–299 · calls `publishCommands`
91. `attributeService` factory — `src/app/api/attribute.service.js` · data and domain services · uses 2 · used by 3
  - 1. `AttributeService` L21–356 · calls `getEntityKeys`, `getEntityTimeseriesValues`, `getEntityAttributesValues`, `getEntityAttributes`, `subscribeForEntityAttributes`, `unsubscribeForEntityAttributes`, `saveEntityAttributes`, `saveEntityTimeseries`, `deleteEntityAttributes`, `deleteEntityTimeseries`
    - 2. `getEntityKeys` L40–68
    - 3. `getEntityTimeseriesValues` L70–85
    - 4. `getEntityAttributesValues` L87–99
    - 5. `processAttributes` L101–115
    - 6. `getEntityAttributes` L117–144 · calls `processAttributes`
      - 7. `eas.subscriptionCallback` L124–126 · calls `processAttributes`
      - 8. `eas.subscriptionCallback` L128–133 · calls `processAttributes`
        - 9. `eas.subscriptionCallback` L130–132 · calls `processAttributes`
    - 10. `onSubscriptionData` L146–175
    - 11. `subscribeForEntityAttributes` L177–207
      - 12. `subscriber.onData` L193–197 · calls `onSubscriptionData`
    - 13. `unsubscribeForEntityAttributes` L209–215
    - 14. `deleteEntityAttributes` L315–332
    - 15. `saveEntityAttributes` L217–264 · calls `deleteEntityAttributes`
    - 16. `deleteEntityTimeseries` L334–354
    - 17. `saveEntityTimeseries` L266–313 · calls `deleteEntityTimeseries`
92. `datasourceService` factory — `src/app/api/datasource.service.js` · data and domain services · uses 3 · used by 0
  - 1. `DatasourceSubscription` L102–747 · calls `initializeSubscription`, `addListener`, `hasListeners`, `removeListener`, `syncListener`, `start`, `unsubscribe`
    - 2. `initializeSubscription` L133–178
    - 3. `hasListeners` L187–189
    - 4. `removeListener` L191–193
    - 5. `syncListener` L195–217
    - 6. `createFirstStateHistoryCommand` L452–463
    - 7. `updateFirstStateHistoryCommand` L465–468
    - 8. `updateRealtimeSubscriptionCommand` L513–519
    - 9. `unsubscribe` L521–540
    - 10. `generateSeries` L542–564
    - 11. `generateLatest` L566–586
    - 12. `currentTime` L589–592
    - 13. `onTick` L596–658 · calls `generateSeries`, `generateLatest`, `currentTime`
    - 14. `isNumeric` L660–662
    - 15. `convertValue` L664–670 · calls `isNumeric`
    - 16. `onData` L672–746 · calls `convertValue`
    - 17. `onStateHistoryData` L470–493 · calls `onData`
    - 18. `createRealtimeDataAggregator` L495–511 · calls `onData`
    - 19. `start` L219–450 · calls `hasListeners`, `createFirstStateHistoryCommand`, `createRealtimeDataAggregator`, `updateRealtimeSubscriptionCommand`, `currentTime`, `onTick`
      - 20. `subscriber.onData` L279–310 · calls `onStateHistoryData`, `onData`
      - 21. `subscriber.onReconnected` L311–311
      - 22. `subscriber.onData` L337–366 · calls `onStateHistoryData`
      - 23. `subscriber.onReconnected` L367–386 · calls `updateFirstStateHistoryCommand`, `updateRealtimeSubscriptionCommand`
      - 24. `subscriber.onReconnected` L388–388
      - 25. `subscriber.onData` L389–393 · calls `onData`
      - 26. `subscriber.onData` L413–417 · calls `onData`
      - 27. `subscriber.onReconnected` L418–418
    - 28. `addListener` L180–185 · calls `start`
  - 29. `DatasourceService` L29–100 · calls `subscribeToDatasource`, `unsubscribeFromDatasource`
    - 30. `subscribeToDatasource` L40–84 · calls `DatasourceSubscription`
    - 31. `unsubscribeFromDatasource` L86–98
93. `deviceService` factory — `src/app/api/device.service.js` · data and domain services · uses 4 · used by 1
  - 1. `DeviceService` L23–361 · calls `getTenantDevices`, `getCustomerDevices`, `getDevice`, `getDevices`, `saveDevice`, `deleteDevice`, `getDeviceCredentials`, `saveDeviceCredentials`, `assignDeviceToCustomer`, `unassignDeviceFromCustomer`, `makeDevicePublic`, `getDeviceAttributes`, `subscribeForDeviceAttributes`, `unsubscribeForDeviceAttributes`, `saveDeviceAttributes`, `deleteDeviceAttributes`, `sendOneWayRpcCommand`, `sendTwoWayRpcCommand`, `findByQuery`, `getDeviceTypes`, `findByName`, `claimDevice`, `unclaimDevice`
    - 2. `getTenantDevices` L53–86
    - 3. `getCustomerDevices` L88–122
    - 4. `getDevice` L124–137
    - 5. `getDevices` L139–163
    - 6. `saveDevice` L165–175
    - 7. `deleteDevice` L177–186
    - 8. `getDeviceCredentials` L188–211
    - 9. `saveDeviceCredentials` L213–223
    - 10. `assignDeviceToCustomer` L225–234
    - 11. `unassignDeviceFromCustomer` L236–245
    - 12. `makeDevicePublic` L247–256
    - 13. `getDeviceAttributes` L258–260
    - 14. `subscribeForDeviceAttributes` L262–264
    - 15. `unsubscribeForDeviceAttributes` L266–268
    - 16. `saveDeviceAttributes` L270–272
    - 17. `deleteDeviceAttributes` L274–276
    - 18. `sendOneWayRpcCommand` L278–287
    - 19. `sendTwoWayRpcCommand` L289–298
    - 20. `findByQuery` L300–313
    - 21. `getDeviceTypes` L315–324
    - 22. `findByName` L326–336
    - 23. `claimDevice` L338–349
    - 24. `unclaimDevice` L351–360
94. `entityViewService` factory — `src/app/api/entity-view.service.js` · data and domain services · uses 4 · used by 1
  - 1. `EntityViewService` L23–224 · calls `getTenantEntityViews`, `getCustomerEntityViews`, `getEntityView`, `saveEntityView`, `deleteEntityView`, `assignEntityViewToCustomer`, `unassignEntityViewFromCustomer`, `getEntityViewAttributes`, `subscribeForEntityViewAttributes`, `unsubscribeForEntityViewAttributes`, `findByQuery`, `getEntityViewTypes`, `makeEntityViewPublic`
    - 2. `getTenantEntityViews` L43–76
    - 3. `getCustomerEntityViews` L78–112
    - 4. `getEntityView` L114–127
    - 5. `saveEntityView` L129–139
    - 6. `deleteEntityView` L141–150
    - 7. `assignEntityViewToCustomer` L152–161
    - 8. `unassignEntityViewFromCustomer` L163–172
    - 9. `getEntityViewAttributes` L174–176
    - 10. `subscribeForEntityViewAttributes` L178–180
    - 11. `unsubscribeForEntityViewAttributes` L182–184
    - 12. `findByQuery` L186–199
    - 13. `getEntityViewTypes` L201–210
    - 14. `makeEntityViewPublic` L212–221
95. `entityService` factory — `src/app/api/entity.service.js` · data and domain services · uses 12 · used by 3
  - 1. `EntityService` L23–1616 · calls `getEntity`, `getEntities`, `getEntitiesByNameFilter`, `resolveAlias`, `resolveAliasFilter`, `filterAliasByEntityTypes`, `getAliasFilterTypesByEntityTypes`, `prepareAllowedEntityTypesList`, `checkEntityAlias`, `getEntityKeys`, `createDatasourcesFromSubscriptionsInfo`, `createAlarmSourceFromSubscriptionInfo`, `getRelatedEntities`, `saveRelatedEntity`, `saveEntityParameters`, `getRelatedEntity`, `deleteRelatedEntity`, `moveEntity`, `copyEntity`
    - 2. `getEntityPromise` L50–82
    - 3. `getEntity` L84–100 · calls `getEntityPromise`
    - 4. `getEntitiesByIdsPromise` L102–128
    - 5. `getEntitiesPromise` L130–164 · calls `getEntitiesByIdsPromise`
    - 6. `getEntities` L166–182 · calls `getEntitiesPromise`
    - 7. `getSingleTenantByPageLinkPromise` L184–206
    - 8. `getSingleCustomerByPageLinkPromise` L208–230
    - 9. `getEntitiesByPageLinkPromise` L232–290 · calls `getSingleTenantByPageLinkPromise`, `getSingleCustomerByPageLinkPromise`
    - 10. `getEntitiesByPageLink` L292–316 · calls `getEntitiesByPageLinkPromise`
    - 11. `getEntitiesByNameFilter` L318–345 · calls `getEntitiesByPageLinkPromise`, `getEntitiesByPageLink`
    - 12. `entityToEntityInfo` L347–356
    - 13. `entityRelationInfoToEntityInfoFunc` L358–372 · calls `getEntity`, `entityToEntityInfo`
    - 14. `entitiesToEntitiesInfo` L374–382 · calls `entityToEntityInfo`
    - 15. `doSendPackedRequests` L415–435
    - 16. `sendPackedRequests` L404–413 · calls `doSendPackedRequests`
    - 17. `entityRelationInfosToEntitiesInfo` L384–402 · calls `entityRelationInfoToEntityInfoFunc`, `sendPackedRequests`
    - 18. `resolveAliasEntityId` L462–479
    - 19. `getStateEntityInfo` L481–501 · calls `resolveAliasEntityId`
    - 20. `resolveAliasFilter` L503–726 · calls `getEntity`, `getEntities`, `getEntitiesByNameFilter`, `entitiesToEntitiesInfo`, `entityRelationInfosToEntitiesInfo`, `resolveAliasEntityId`, `getStateEntityInfo`
    - 21. `resolveAlias` L437–460 · calls `resolveAliasFilter`
    - 22. `filterAliasFilterTypeByEntityType` L778–804
    - 23. `filterAliasFilterTypeByEntityTypes` L806–815 · calls `filterAliasFilterTypeByEntityType`
    - 24. `filterAliasByEntityTypes` L728–776 · calls `filterAliasFilterTypeByEntityTypes`
    - 25. `getAliasFilterTypesByEntityTypes` L817–830 · calls `filterAliasFilterTypeByEntityTypes`
    - 26. `prepareAllowedEntityTypesList` L832–871
    - 27. `checkEntityAlias` L874–894 · calls `resolveAliasFilter`
    - 28. `getEntityFieldKeys` L896–934
    - 29. `getEntityKeys` L936–967 · calls `getEntityFieldKeys`
    - 30. `validateSubscriptionInfo` L1062–1077
    - 31. `createDatasourceKeys` L1112–1118
    - 32. `createDatasourceFromSubscription` L1079–1110 · calls `createDatasourceKeys`
    - 33. `createAlarmSourceFromSubscriptionInfo` L976–994 · calls `getEntity`, `createDatasourceFromSubscription`
    - 34. `processSubscriptionsInfo` L996–1060 · calls `getEntity`, `getEntities`, `getEntitiesByNameFilter`, `validateSubscriptionInfo`, `createDatasourceFromSubscription`
    - 35. `createDatasourcesFromSubscriptionsInfo` L969–974 · calls `processSubscriptionsInfo`
    - 36. `saveEntityRelation` L1171–1213
    - 37. `getEntitySavePromise` L1296–1307
    - 38. `deleteEntityPromise` L1329–1337
    - 39. `deleteRelatedEntity` L1339–1378 · calls `deleteEntityPromise`
    - 40. `moveEntity` L1380–1404
    - 41. `saveEntityPromise` L1432–1444
    - 42. `saveEntityParameters` L1215–1294 · calls `saveEntityRelation`, `getEntitySavePromise`, `saveEntityPromise`
    - 43. `updateEntityAttributes` L1527–1542
    - 44. `updateEntity` L1510–1525 · calls `saveEntityPromise`, `updateEntityAttributes`
    - 45. `addRelatedEntity` L1446–1481 · calls `saveEntityPromise`, `updateEntity`
    - 46. `updateRelatedEntity` L1483–1508 · calls `getEntityPromise`, `updateEntity`
    - 47. `saveRelatedEntity` L1158–1169 · calls `addRelatedEntity`, `updateRelatedEntity`
    - 48. `constructRelatedEntitiesSearchQuery` L1544–1579
    - 49. `getAttributeValue` L1607–1614
    - 50. `constructEntity` L1581–1605 · calls `getAttributeValue`
    - 51. `getRelatedEntities` L1120–1156 · calls `constructRelatedEntitiesSearchQuery`, `constructEntity`
    - 52. `getRelatedEntity` L1309–1327 · calls `getEntityPromise`, `constructEntity`
    - 53. `copyEntity` L1406–1430 · calls `saveRelatedEntity`, `getRelatedEntity`
96. `widgetService` factory — `src/app/api/widget.service.js` · data and domain services · uses 2 · used by 2
  - 1. `WidgetService` L62–832 · calls `initEditingWidgetType`, `initWidgetPlaceholders`, `toWidgetInfo`, `getWidgetTemplate`, `invalidateWidgetsBundleCache`, `getSystemWidgetsBundles`, `getTenantWidgetsBundles`, `getAllWidgetsBundles`, `getSystemWidgetsBundlesByPageLink`, `getTenantWidgetsBundlesByPageLink`, `getAllWidgetsBundlesByPageLink`, `getWidgetsBundleByAlias`, `saveWidgetsBundle`, `getWidgetsBundle`, `deleteWidgetsBundle`, `getBundleWidgetTypes`, `getInstantWidgetInfo`, `getWidgetInfo`, `getWidgetTypeFunction`, `getWidgetType`, `getWidgetTypeById`, `deleteWidgetType`, `saveWidgetType`, `saveImportedWidgetType`
    - 2. `initWidgetPlaceholders` L149–186
    - 3. `toWidgetInfo` L188–209
    - 4. `toWidgetType` L211–236
    - 5. `initEditingWidgetType` L129–147 · calls `toWidgetType`
    - 6. `createWidgetInfoCacheKey` L264–266
    - 7. `getWidgetInfoFromCache` L268–271 · calls `createWidgetInfoCacheKey`
    - 8. `getWidgetTypeFunctionFromCache` L273–276 · calls `createWidgetInfoCacheKey`
    - 9. `putWidgetInfoToCache` L278–281 · calls `createWidgetInfoCacheKey`
    - 10. `putWidgetTypeFunctionToCache` L283–286 · calls `createWidgetInfoCacheKey`
    - 11. `deleteWidgetInfoFromCache` L288–292 · calls `createWidgetInfoCacheKey`
    - 12. `deleteWidgetsBundleFromCache` L294–302
    - 13. `invalidateWidgetsBundleCache` L306–310
    - 14. `loadWidgetsBundleCache` L312–337
    - 15. `getSystemWidgetsBundles` L340–351 · calls `loadWidgetsBundleCache`
    - 16. `getTenantWidgetsBundles` L353–364 · calls `loadWidgetsBundleCache`
    - 17. `getAllWidgetsBundles` L366–377 · calls `loadWidgetsBundleCache`
    - 18. `getSystemWidgetsBundlesByPageLink` L379–390 · calls `loadWidgetsBundleCache`
    - 19. `getTenantWidgetsBundlesByPageLink` L392–403 · calls `loadWidgetsBundleCache`
    - 20. `getAllWidgetsBundlesByPageLink` L405–416 · calls `loadWidgetsBundleCache`
    - 21. `getWidgetsBundleByAlias` L418–434 · calls `loadWidgetsBundleCache`
    - 22. `saveWidgetsBundle` L436–446 · calls `invalidateWidgetsBundleCache`
    - 23. `getWidgetsBundle` L448–459
    - 24. `deleteWidgetsBundle` L461–483 · calls `deleteWidgetsBundleFromCache`, `invalidateWidgetsBundleCache`, `getWidgetsBundle`
    - 25. `getBundleWidgetTypes` L485–495
    - 26. `getInstantWidgetInfo` L499–506 · calls `getWidgetInfoFromCache`
    - 27. `resolveWidgetsInfoFetchQueue` L508–518
    - 28. `getWidgetTypeFunction` L550–553 · calls `getWidgetTypeFunctionFromCache`
    - 29. `createWidgetTypeFunction` L555–667
    - 30. `processWidgetLoadError` L669–678 · calls `resolveWidgetsInfoFetchQueue`
    - 31. `getWidgetType` L713–724
    - 32. `getWidgetTemplate` L238–260 · calls `toWidgetInfo`, `getWidgetType`
    - 33. `getWidgetTypeById` L726–736
    - 34. `deleteWidgetType` L738–755 · calls `deleteWidgetInfoFromCache`, `getWidgetType`
    - 35. `saveWidgetType` L757–769 · calls `toWidgetType`, `deleteWidgetInfoFromCache`
    - 36. `saveImportedWidgetType` L771–782 · calls `deleteWidgetInfoFromCache`
    - 37. `loadWidgetResources` L784–830 · calls `loadNext`
      - 38. `loadNextOrComplete` L793–804 · calls `loadNext` · cycle
      - 39. `loadNext` L806–821 · calls `loadNextOrComplete` · cycle
    - 40. `loadWidget` L680–711 · calls `toWidgetInfo`, `createWidgetInfoCacheKey`, `putWidgetInfoToCache`, `putWidgetTypeFunctionToCache`, `resolveWidgetsInfoFetchQueue`, `createWidgetTypeFunction`, `processWidgetLoadError`, `loadWidgetResources`
    - 41. `getWidgetInfo` L520–548 · calls `createWidgetInfoCacheKey`, `getWidgetInfoFromCache`, `resolveWidgetsInfoFetchQueue`, `loadWidget`, `getWidgetType`
97. `bufferStore` factory — `src/app/services/item-buffer.service.js` · state and workflow · uses 0 · used by 1
98. `itembuffer` factory — `src/app/services/item-buffer.service.js` · state and workflow · uses 5 · used by 0
  - 1. `ItemBuffer` L27–412 · calls `prepareWidgetItem`, `copyRuleNodes`, `hasRuleNodes`, `pasteRuleNodes`, `copyWidget`, `copyWidgetReference`, `hasWidget`, `canPasteWidgetReference`, `pasteWidgetReference`, `pasteWidget`, `addWidgetToDashboard`
    - 2. `prepareAliasInfo` L67–72
    - 3. `getOriginalColumns` L74–92
    - 4. `getOriginalSize` L94–101
    - 5. `prepareWidgetItem` L103–142 · calls `prepareAliasInfo`, `getOriginalColumns`, `getOriginalSize`
    - 6. `prepareWidgetReference` L144–156 · calls `getOriginalColumns`, `getOriginalSize`
    - 7. `copyRuleNodes` L158–201
    - 8. `hasRuleNodes` L203–205
    - 9. `pasteRuleNodes` L207–240
    - 10. `copyWidget` L242–245 · calls `prepareWidgetItem`
    - 11. `copyWidgetReference` L247–250 · calls `prepareWidgetReference`
    - 12. `hasWidget` L252–254
    - 13. `canPasteWidgetReference` L256–268
    - 14. `isEntityAliasEqual` L375–377
    - 15. `createEntityAliasName` L395–411
    - 16. `getEntityAliasId` L379–393 · calls `isEntityAliasEqual`, `createEntityAliasName`
    - 17. `updateAliases` L358–373 · calls `getEntityAliasId`
    - 18. `addWidgetToDashboard` L328–356 · calls `updateAliases`
    - 19. `pasteWidgetReference` L270–298 · calls `addWidgetToDashboard`
    - 20. `pasteWidget` L300–326 · calls `addWidgetToDashboard`
99. `$mdColorPicker` factory — `src/app/common/thirdparty-fix.js` · leaf UI · uses 0 · used by 3
100. `$mdpDatePicker` provider — `src/app/common/thirdparty-fix.js` · leaf UI · uses 0 · used by 0
101. `$mdpTimePicker` provider — `src/app/common/thirdparty-fix.js` · leaf UI · uses 0 · used by 0
  - 1. `Fullscreen` L27–94 · calls `serviceInstance.isEnabled`
    - 2. `serviceInstance.enable` L49–65
    - 3. `serviceInstance.all` L46–48 · calls `serviceInstance.enable`
    - 4. `serviceInstance.cancel` L66–76
    - 5. `serviceInstance.isEnabled` L77–80
    - 6. `serviceInstance.toggleAll` L81–83 · calls `serviceInstance.all`, `serviceInstance.cancel`, `serviceInstance.isEnabled`
    - 7. `serviceInstance.isSupported` L84–88
  - 8. `mdColorPicker` L97–197
    - 9. `hide` L188–190
    - 10. `show` L103–187 · calls `$scope.ok`, `hide`
      - 11. `$scope.close` L139–142
      - 12. `$scope.ok` L143–146 · calls `hide`
      - 13. `onShowing` L174–176
      - 14. `onComplete` L177–179
    - 15. `cancel` L191–193
  - 16. `DatePickerCtrl` L199–291
    - 17. `this.yearItems.getItemAtIndex` L233–238
    - 18. `this.yearItems.getLength` L239–244
    - 19. `this.showYear` L257–261
    - 20. `this.showCalendar` L263–265
    - 21. `this.cancel` L267–269
    - 22. `this.confirm` L271–283 · calls `hide`
    - 23. `this.animate` L285–290
    - 24. `this.selectYear` L250–255 · calls `this.animate`
  - 25. `mdpDatePicker` L294–360
    - 26. `this.setDisplayFormat` L299–301
    - 27. `this.setOKButtonLabel` L303–305
    - 28. `this.setCancelButtonLabel` L307–309
    - 29. `this.$get` L312–358 · calls `datePicker`
      - 30. `datePicker` L313–355 · calls `show`, `DatePickerCtrl`
  - 31. `TimePickerCtrl` L362–396
    - 32. `this.switchView` L375–377
    - 33. `this.setAM` L379–382
    - 34. `this.setPM` L384–387
    - 35. `this.cancel` L389–391
    - 36. `this.confirm` L393–395 · calls `hide`
  - 37. `mdpTimePicker` L399–458
    - 38. `this.setOKButtonLabel` L403–405
    - 39. `this.setCancelButtonLabel` L407–409
    - 40. `this.$get` L412–457 · calls `timePicker`
      - 41. `timePicker` L413–454 · calls `show`, `TimePickerCtrl`
102. `<dynamic:tbEventDirectives>` directive — `src/app/components/tb-event-directives.js` · leaf UI · uses 0 · used by 0
  - 1. `compile` L29–39 · calls `callback`
    - 2. `callback` L33–35
  - 3. `camelCase` L49–55
  - 4. `directiveNormalize` L57–59 · calls `camelCase`
103. `breadcrumbIcon` filter — `src/app/layout/index.js` · leaf UI · uses 0 · used by 0
104. `breadcrumbLabel` filter — `src/app/layout/index.js` · leaf UI · uses 0 · used by 0
105. `contactShort` filter — `src/app/components/contact-short.filter.js` · leaf UI · uses 0 · used by 0
  - 1. `ContactShort` L21–54
106. `dateRangeNavigatorWidget` directive — `src/app/widget/lib/date-range-navigator/date-range-navigator.js` · leaf UI · uses 0 · used by 0
  - 1. `DateRangeNavigatorWidgetController` L41–301 · calls `getLocalizationMap`, `triggerChange`, `widgetContextTimewindowSync`, `getFormattedDate`, `readFromStorage`, `goForth`, `goBack`, `changeInterval`
    - 2. `getLocalizationMap` L157–165
    - 3. `readFromStorage` L218–227
    - 4. `getDateDiff` L256–261
    - 5. `getFormattedDate` L191–216 · calls `getDateDiff`
    - 6. `updateTimewindow` L263–265
    - 7. `triggerChange` L167–169 · calls `updateTimewindow`
    - 8. `goForth` L229–237 · calls `updateTimewindow`
    - 9. `goBack` L239–247 · calls `updateTimewindow`
    - 10. `changeInterval` L249–254 · calls `updateTimewindow`
    - 11. `updateDateInterval` L267–282
    - 12. `updateAdvancedModel` L284–286 · calls `getFormattedDate`
    - 13. `saveIntoStorage` L296–300
    - 14. `updateStorageDate` L288–294 · calls `saveIntoStorage`
    - 15. `widgetContextTimewindowSync` L171–189 · calls `updateTimewindow`, `updateDateInterval`, `updateAdvancedModel`, `updateStorageDate`
  - 16. `DateRangeNavigatorWidget` L26–38 · calls `DateRangeNavigatorWidgetController`
107. `keyboardShortcut` filter — `src/app/components/keyboard-shortcut.filter.js` · leaf UI · uses 0 · used by 0
  - 1. `KeyboardShortcut` L21–40
108. `menu` factory — `src/app/services/menu.service.js` · leaf UI · uses 1 · used by 2
  - 1. `Menu` L23–374 · calls `getSections`, `getHomeSections`, `buildMenu`, `sectionHeight`, `sectionActive`
    - 2. `getSections` L47–49
    - 3. `getHomeSections` L51–53
    - 4. `buildMenu` L55–360
    - 5. `sectionHeight` L362–368
    - 6. `sectionActive` L370–372
109. `milliSecondsToTimeString` filter — `src/app/components/timewindow.directive.js` · leaf UI · uses 0 · used by 0
  - 1. `Timewindow` L40–274 · calls `linker`
    - 2. `linker` L42–261 · calls `scope.updateDisplayValue`, `isTimewindowDisabled`
      - 3. `scope.hideLabel` L76–78
      - 4. `scope.updateDisplayValue` L193–213
      - 5. `scope.updateView` L158–191 · calls `scope.updateDisplayValue`
      - 6. `scope.openEditMode` L99–156
        - 7. `onTimewindowUpdate` L145–148 · calls `scope.updateView`
      - 8. `isTimewindowDisabled` L215–217
      - 9. `ngModelCtrl.$render` L219–252 · calls `scope.updateDisplayValue`, `isTimewindowDisabled`
  - 10. `MillisecondsToTimeString` L277–306
110. `nospace` filter — `src/app/components/menu-link.directive.js` · leaf UI · uses 0 · used by 0
  - 1. `MenuLink` L33–70 · calls `linker`
    - 2. `linker` L35–61
      - 3. `scope.sectionActive` L49–51
      - 4. `scope.sectionHeight` L53–55
  - 5. `NoSpace` L72–76
111. `parseToNull` directive — `src/app/extension/index.js` · leaf UI · uses 0 · used by 0
112. `range` filter — `src/app/components/grid.directive.js` · leaf UI · uses 0 · used by 0
  - 1. `RangeFilter` L36–46
  - 2. `ItemCardController` L49–53
  - 3. `GridCardContent` L56–108 · calls `linker`
    - 4. `linker` L57–95 · calls `initContent`
      - 5. `initContent` L82–94
  - 6. `GridController` L128–694 · calls `vm.itemRows.getItemAtIndex`, `columnsUpdated`, `initGridConfiguration`, `reload`, `refreshList`, `addItem`, `openItem`, `isCurrentItem`, `onToggleDetailsEditMode`, `onCloseDetails`, `operatingItem`, `saveItem`, `deleteItem`, `deleteItems`, `toggleItemSelection`, `triggerResize`, `isTenantAdmin`, `moveToTop`, `noData`, `hasData`
    - 7. `vm.itemRows.getLength` L202–208
    - 8. `openItem` L513–527
    - 9. `isCurrentItem` L529–536
    - 10. `onToggleDetailsEditMode` L538–542
    - 11. `onCloseDetails` L544–546
    - 12. `operatingItem` L548–560
    - 13. `saveItem` L562–575
    - 14. `toggleItemSelection` L620–631
    - 15. `triggerResize` L633–636
    - 16. `isTenantAdmin` L638–640
    - 17. `moveToIndex` L646–684
    - 18. `vm.itemRows.getItemAtIndex` L194–200 · calls `vm.itemRows.fetchMoreItems_` · cycle
    - 19. `vm.itemRows.fetchMoreItems_` L210–255 · calls `reload`, `vm.items.loadCallback` · cycle
    - 20. `reload` L456–474 · calls `vm.itemRows.getItemAtIndex` · cycle
    - 21. `refreshList` L476–496 · calls `vm.itemRows.getItemAtIndex` · cycle
      - 22. `vm.items.loadCallback` L490–494 · calls `moveToIndex`
    - 23. `columnsUpdated` L258–285 · calls `vm.itemRows.getItemAtIndex`, `moveToIndex`
    - 24. `addItem` L498–511 · calls `refreshList`
    - 25. `deleteItem` L577–596 · calls `refreshList`
    - 26. `deleteItems` L598–617 · calls `refreshList`
    - 27. `initGridConfiguration` L287–442
      - 28. `onAction` L374–376 · calls `deleteItems`
      - 29. `name` L377–377
      - 30. `onAction` L388–390 · calls `addItem`
      - 31. `name` L391–391
      - 32. `details` L392–392
    - 33. `moveToTop` L642–644 · calls `moveToIndex`
    - 34. `noData` L686–688
    - 35. `hasData` L690–692
  - 36. `Grid` L111–125 · calls `GridController`
  - 37. `AddItemController` L697–718 · calls `cancel`, `add`
    - 38. `cancel` L707–709
    - 39. `add` L711–717
113. `tbAlarmHeader` directive — `src/app/alarm/index.js` · leaf UI · uses 0 · used by 0
114. `tbAlarmRow` directive — `src/app/alarm/index.js` · leaf UI · uses 0 · used by 0
115. `tbAlarmTable` directive — `src/app/alarm/index.js` · leaf UI · uses 0 · used by 0
116. `tbAlarmsTableWidget` directive — `src/app/widget/lib/alarms-table-widget.js` · leaf UI · uses 0 · used by 0
  - 1. `DisplayColumnsPanelController` L794–798
  - 2. `AlarmStatusFilterPanelController` L801–806
  - 3. `AlarmsTableWidgetController` L52–791 · calls `initializeConfig`, `enterFilterMode`, `exitFilterMode`, `onReorder`, `onPaginate`, `onRowClick`, `onActionButtonClick`, `actionEnabled`, `isCurrent`, `openAlarmDetails`, `ackAlarms`, `ackAlarm`, `clearAlarms`, `clearAlarm`, `updateAlarms`, `cellStyle`, `cellContent`, `editAlarmStatusFilter`, `editColumnsToDisplay`, `updateAlarmSource`
    - 4. `vm.searchAction.onAction` L91–93
    - 5. `columnDisplayAction.onAction` L100–102
    - 6. `statusFilterAction.onAction` L109–111
    - 7. `initializeConfig` L186–326 · calls `hashCode`
      - 8. `hashCode` L315–325
    - 9. `enterFilterMode` L328–334
    - 10. `onRowClick` L350–367
    - 11. `onActionButtonClick` L369–388
    - 12. `actionEnabled` L390–399
    - 13. `isCurrent` L401–404
    - 14. `openAlarmDetails` L406–439
      - 15. `onShowingCallback.onShowing` L412–412
      - 16. `onShowing` L429–431 · calls `onShowingCallback.onShowing`
    - 17. `ackAlarms` L441–472
    - 18. `ackAlarm` L474–491
    - 19. `clearAlarms` L493–524
    - 20. `clearAlarm` L526–543
    - 21. `updateAlarms` L545–578
    - 22. `exitFilterMode` L336–340 · calls `updateAlarms`
    - 23. `onReorder` L342–344 · calls `updateAlarms`
    - 24. `onPaginate` L346–348 · calls `updateAlarms`
    - 25. `defaultContent` L626–648
    - 26. `defaultStyle` L649–667
    - 27. `getDescendantProp` L669–671
    - 28. `getAlarmValue` L673–680 · calls `getDescendantProp`
    - 29. `cellStyle` L580–600 · calls `defaultStyle`, `getAlarmValue`
    - 30. `cellContent` L602–624 · calls `defaultContent`, `getAlarmValue`
    - 31. `editAlarmStatusFilter` L682–704 · calls `AlarmStatusFilterPanelController`
    - 32. `editColumnsToDisplay` L706–728 · calls `DisplayColumnsPanelController`
    - 33. `updateAlarmSource` L730–789
  - 34. `AlarmsTableWidget` L37–49 · calls `AlarmsTableWidgetController`
117. `tbAliasesEntitySelect` directive — `src/app/entity/index.js` · leaf UI · uses 0 · used by 0
118. `tbAsset` directive — `src/app/asset/index.js` · leaf UI · uses 0 · used by 0
119. `tbAttributeTable` directive — `src/app/entity/index.js` · leaf UI · uses 0 · used by 0
120. `tbAuditLogHeader` directive — `src/app/audit/index.js` · leaf UI · uses 0 · used by 0
121. `tbAuditLogRow` directive — `src/app/audit/index.js` · leaf UI · uses 0 · used by 0
122. `tbAuditLogTable` directive — `src/app/audit/index.js` · leaf UI · uses 0 · used by 0
123. `tbChipDraggable` directive — `src/app/components/md-chip-draggable.directive.js` · leaf UI · uses 0 · used by 0
  - 1. `move` L40–42
  - 2. `dragOverHandler` L85–126
  - 3. `dropHandler` L128–177
124. `tbCircularProgress` directive — `src/app/components/circular-progress.directive.js` · leaf UI · uses 0 · used by 0
  - 1. `CircularProgress` L25–72 · calls `linker`
    - 2. `linker` L27–63
125. `tbConfirmOnExit` directive — `src/app/components/confirm-on-exit.directive.js` · leaf UI · uses 1 · used by 0
  - 1. `ConfirmOnExit` L21–55
    - 2. `link` L23–52
      - 3. `$window.onbeforeunload` L25–29
126. `tbContact` directive — `src/app/components/contact.directive.js` · leaf UI · uses 0 · used by 0
  - 1. `Contact` L27–323 · calls `linker`
    - 2. `linker` L301–312
127. `tbCustomActionPrettyEditor` directive — `src/app/components/widget/action/custom-action-pretty-editor.directive.js` · leaf UI · uses 0 · used by 0
  - 1. `CustomActionPrettyEditor` L38–1006 · calls `linker`
    - 2. `linker` L40–996 · calls `removeResource`, `addResource`, `beautifyHtml`, `beautifyCss`, `toggleFullscreen`
      - 3. `scope.htmlEditorOptions.onLoad` L53–55
      - 4. `scope.cssEditorOptions.onLoad` L65–67
      - 5. `ngModelCtrl.$render` L902–909
      - 6. `removeResource` L911–916
      - 7. `addResource` L918–924
      - 8. `beautifyHtml` L926–929
      - 9. `beautifyCss` L931–934
      - 10. `onDividerDrag` L962–969
      - 11. `initSplitLayout` L971–993 · calls `onDividerDrag`
        - 12. `onDrag` L977–979 · calls `onDividerDrag`
      - 13. `toggleFullscreen` L936–960 · calls `initSplitLayout`
128. `tbCustomer` directive — `src/app/customer/index.js` · leaf UI · uses 0 · used by 0
129. `tbDashboard` directive — `src/app/components/dashboard.directive.js` · leaf UI · uses 0 · used by 0
  - 1. `DashboardController` L90–1093 · calls `onGridsterParentResize`, `updateMobileOpts`, `checkIsMobileSize`, `autofillHeight`, `detectRowSize`, `sortWidgets`, `reload`, `loadDashboard`, `updateGridsterParams`, `checkIsLocalGridsterElement`, `onWidgetFullscreenChanged`, `widgetMouseDown`, `widgetClicked`, `openDashboardContextMenu`, `openWidgetContextMenu`, `getEventGridPosition`, `editWidget`, `exportWidget`, `removeWidget`, `highlightWidget`, `selectWidget`, `getSelectedWidget`, `resetHighlight`, `isHighlighted`, `isNotHighlighted`, `widgetSizeX`, `widgetSizeY`, `widgetRow`, `widgetCol`, `widgetStyle`, `showWidgetTitle`, `showWidgetTitleIcon`, `hasWidgetTitleTemplate`, `widgetTitleTemplate`, `showWidgetTitlePanel`, `showWidgetActions`, `widgetTitleStyle`, `widgetTitle`, `widgetTitleIcon`, `widgetTitleIconStyle`, `widgetTitleTooltip`, `customWidgetHeaderActions`, `widgetActions`, `dropWidgetShadow`, `enableWidgetFullscreen`, `hasTimewindow`, `hasAggregation`, `setupGridster`, `loading`
    - 2. `vm.dashboardTimewindowApi.onResetTimewindow` L218–225
    - 3. `vm.dashboardTimewindowApi.onUpdateTimewindow` L226–233
    - 4. `checkIsMobileSize` L283–290
    - 5. `autofillHeight` L435–441
    - 6. `detectViewportHeight` L443–459
    - 7. `widgetOrder` L493–507
    - 8. `updateGridsterParams` L550–568
    - 9. `checkIsLocalGridsterElement` L611–613
    - 10. `onWidgetFullscreenChanged` L615–618
    - 11. `widgetMouseDown` L620–624
    - 12. `widgetClicked` L626–630
    - 13. `openDashboardContextMenu` L632–640
    - 14. `openWidgetContextMenu` L642–650
    - 15. `getEventGridPosition` L652–668
    - 16. `editWidget` L670–677
    - 17. `exportWidget` L679–686
    - 18. `removeWidget` L688–695
    - 19. `scrollToWidget` L712–728
    - 20. `highlightWidget` L697–703 · calls `scrollToWidget`
    - 21. `selectWidget` L705–710 · calls `scrollToWidget`
    - 22. `getSelectedWidget` L730–732
    - 23. `resetHighlight` L734–738
    - 24. `isHighlighted` L740–742
    - 25. `isNotHighlighted` L744–746
    - 26. `widgetSizeX` L748–754
    - 27. `get` L369–369 · calls `widgetSizeX`
    - 28. `setWidgetSizeX` L756–764
    - 29. `set` L370–370 · calls `setWidgetSizeX`
    - 30. `widgetSizeY` L766–787
    - 31. `get` L373–373 · calls `widgetSizeY`
    - 32. `setWidgetSizeY` L789–797
    - 33. `set` L374–374 · calls `setWidgetSizeY`
    - 34. `widgetRow` L799–805
    - 35. `get` L377–377 · calls `widgetRow`
    - 36. `detectRowSize` L461–491 · calls `autofillHeight`, `detectViewportHeight`, `widgetSizeY`, `widgetRow`
    - 37. `updateMobileOpts` L257–281 · calls `checkIsMobileSize`, `detectRowSize`
    - 38. `onGridsterParentResize` L242–246 · calls `updateMobileOpts`, `autofillHeight`
    - 39. `setWidgetRow` L807–815
    - 40. `set` L378–378 · calls `setWidgetRow`
    - 41. `widgetCol` L817–823
    - 42. `get` L381–381 · calls `widgetCol`
    - 43. `sortWidgets` L515–525 · calls `widgetOrder`, `widgetCol`
    - 44. `setWidgetCol` L825–833
    - 45. `set` L382–382 · calls `setWidgetCol`
    - 46. `widgetColor` L847–853
    - 47. `widgetBackgroundColor` L855–861
    - 48. `widgetPadding` L863–869
    - 49. `widgetMargin` L871–877
    - 50. `widgetStyle` L835–845 · calls `widgetColor`, `widgetBackgroundColor`, `widgetPadding`, `widgetMargin`
    - 51. `showWidgetTitle` L879–885
    - 52. `showWidgetTitleIcon` L887–893
    - 53. `widgetTitleStyle` L931–937
    - 54. `widgetTitleIcon` L949–955
    - 55. `widgetTitleIconStyle` L957–966
    - 56. `widgetContext` L996–1002
    - 57. `hasWidgetTitleTemplate` L895–902 · calls `widgetContext`
    - 58. `widgetTitleTemplate` L904–911 · calls `widgetContext`
    - 59. `showWidgetActions` L922–929 · calls `widgetContext`
    - 60. `widgetTitle` L939–947 · calls `widgetContext`
    - 61. `widgetTitleTooltip` L968–976 · calls `widgetContext`
    - 62. `customWidgetHeaderActions` L978–985 · calls `widgetContext`
    - 63. `widgetActions` L987–994 · calls `widgetContext`
    - 64. `dropWidgetShadow` L1004–1010
    - 65. `enableWidgetFullscreen` L1012–1018
    - 66. `hasTimewindow` L1020–1027
    - 67. `showWidgetTitlePanel` L913–920 · calls `showWidgetTitle`, `hasWidgetTitleTemplate`, `widgetContext`, `hasTimewindow`
    - 68. `hasAggregation` L1029–1031
    - 69. `adoptMaxRows` L1033–1043 · calls `widgetSizeY`, `widgetRow`
    - 70. `setupGridster` L1080–1087 · calls `gridster.moveOverlappingItems`
      - 71. `gridster.moveOverlappingItems` L1084–1084
    - 72. `dashboardLoaded` L1045–1078 · calls `adoptMaxRows`, `setupGridster`
    - 73. `loadDashboard` L531–548 · calls `dashboardLoaded`
    - 74. `reload` L527–529 · calls `loadDashboard`
    - 75. `loading` L1089–1091
  - 76. `Dashboard` L48–87 · calls `DashboardController`
130. `tbDashboardAutocomplete` directive — `src/app/components/dashboard-autocomplete.directive.js` · leaf UI · uses 2 · used by 0
  - 1. `DashboardAutocomplete` L33–146 · calls `linker`
    - 2. `linker` L35–130 · calls `scope.updateView`
      - 3. `scope.fetchDashboards` L43–74
      - 4. `scope.dashboardSearchTextChanged` L76–77
      - 5. `scope.updateView` L79–83
      - 6. `startWatchers` L104–115 · calls `scope.updateView`
      - 7. `ngModelCtrl.$render` L85–102 · calls `scope.updateView`, `startWatchers`
131. `tbDashboardDetails` directive — `src/app/dashboard/index.js` · leaf UI · uses 0 · used by 0
132. `tbDashboardLayout` directive — `src/app/dashboard/layouts/index.js` · leaf UI · uses 0 · used by 0
133. `tbDashboardSelect` directive — `src/app/components/dashboard-select.directive.js` · leaf UI · uses 3 · used by 0
  - 1. `DashboardSelect` L37–148 · calls `linker`
    - 2. `linker` L39–135 · calls `scope.updateView`
      - 3. `scope.updateView` L65–67
      - 4. `ngModelCtrl.$render` L69–75
      - 5. `scope.openDashboardSelectPanel` L81–132
        - 6. `onDashboardSelected` L117–122
134. `tbDashboardToolbar` directive — `src/app/dashboard/index.js` · leaf UI · uses 0 · used by 0
135. `tbDatakeyConfig` directive — `src/app/components/datakey-config.directive.js` · leaf UI · uses 1 · used by 0
  - 1. `DatakeyConfig` L33–167 · calls `linker`
    - 2. `linker` L35–155
      - 3. `ngModelCtrl.$render` L78–92
      - 4. `scope.createFilterForDataKey` L147–152
      - 5. `scope.keysSearch` L120–145 · calls `scope.createFilterForDataKey`
136. `tbDatasource` directive — `src/app/components/datasource.directive.js` · leaf UI · uses 2 · used by 0
  - 1. `Datasource` L33–96 · calls `linker`
    - 2. `linker` L35–78 · calls `scope.updateView`
      - 3. `scope.updateView` L48–53
      - 4. `ngModelCtrl.$render` L69–75
137. `tbDatasourceEntity` directive — `src/app/components/datasource-entity.directive.js` · leaf UI · uses 2 · used by 0
  - 1. `DatasourceEntity` L39–312 · calls `linker`
    - 2. `linker` L41–295 · calls `scope.updateValidity`, `updateDataKeys`, `scope.selectedEntityAliasChange`
      - 3. `scope.updateValidity` L59–78
      - 4. `updateDataKeys` L100–112 · calls `scope.updateValidity`
      - 5. `ngModelCtrl.$render` L114–136
      - 6. `scope.textIsNotEmpty` L138–140
      - 7. `scope.selectedEntityAliasChange` L142–149
      - 8. `scope.transformDataKeyChip` L151–165
      - 9. `scope.transformAlarmDataKeyChip` L167–173
      - 10. `scope.showColorPicker` L175–199
      - 11. `scope.editDataKey` L201–232
        - 12. `onComplete` L217–220
      - 13. `scope.createFilterForDataKey` L277–282
      - 14. `scope.dataKeysSearch` L234–275 · calls `scope.createFilterForDataKey`
      - 15. `scope.createKey` L284–292
138. `tbDatasourceFunc` directive — `src/app/components/datasource-func.directive.js` · leaf UI · uses 3 · used by 0
  - 1. `DatasourceFunc` L39–241 · calls `linker`
    - 2. `linker` L41–227 · calls `scope.updateValidity`, `updateDataKeys`
      - 3. `scope.updateValidity` L60–76
      - 4. `updateDataKeys` L86–98 · calls `scope.updateValidity`
      - 5. `ngModelCtrl.$render` L107–125
      - 6. `scope.transformFuncDataKeyChip` L127–133
      - 7. `scope.transformAlarmDataKeyChip` L135–137
      - 8. `scope.showColorPicker` L139–163
      - 9. `scope.editDataKey` L165–196
        - 10. `onComplete` L181–184
      - 11. `scope.textIsNotEmpty` L198–200
      - 12. `scope.createFilterForDataKey` L209–214
      - 13. `scope.dataKeysSearch` L202–207 · calls `scope.createFilterForDataKey`
      - 14. `scope.createKey` L216–224
139. `tbDatetimePeriod` directive — `src/app/components/datetime-period.directive.js` · leaf UI · uses 0 · used by 0
  - 1. `DatetimePeriod` L29–108 · calls `linker`
    - 2. `linker` L31–98 · calls `scope.updateMinMaxDates`, `scope.updateView`
      - 3. `ngModelCtrl.$render` L36–48
      - 4. `scope.updateMinMaxDates` L50–54
      - 5. `scope.updateView` L56–68
140. `tbDetailsSidenav` directive — `src/app/components/details-sidenav.directive.js` · leaf UI · uses 0 · used by 0
  - 1. `DetailsSidenav` L29–151 · calls `linker`
    - 2. `linker` L31–127 · calls `updateIsOpen`
      - 3. `updateContainerPositions` L76–100
      - 4. `updateIsOpen` L59–74 · calls `updateContainerPositions`
      - 5. `scope.toggleDetailsEditMode` L102–113
      - 6. `scope.detailsApply` L115–119
      - 7. `scope.closeDetails` L121–126
141. `tbDevice` directive — `src/app/device/index.js` · leaf UI · uses 0 · used by 0
142. `tbEditWidget` directive — `src/app/dashboard/index.js` · leaf UI · uses 0 · used by 0
143. `tbEntitiesHierarchyWidget` directive — `src/app/widget/lib/entities-hierarchy-widget.js` · leaf UI · uses 0 · used by 0
  - 1. `EntitiesHierarchyWidgetController` L44–529 · calls `initializeConfig`, `enterFilterMode`, `exitFilterMode`, `searchCallback`, `updateDatasources`, `updateSearchNodes`, `onNodesInserted`, `onNodeSelected`, `updateNodeData`
    - 2. `vm.searchAction.onAction` L63–65
    - 3. `loadNodeCtxFunction` L140–154
    - 4. `enterFilterMode` L156–162
    - 5. `searchCallback` L170–176
    - 6. `updateSearchNodes` L182–188
    - 7. `exitFilterMode` L164–168 · calls `updateSearchNodes`
    - 8. `onNodesInserted` L190–200
    - 9. `onNodeSelected` L202–219
    - 10. `showError` L323–326
    - 11. `prepareNodes` L328–332
    - 12. `resolveEntity` L403–424
    - 13. `defaultNodeRelationQueryFunction` L435–453
    - 14. `prepareNodeRelationQuery` L427–433 · calls `defaultNodeRelationQueryFunction`
    - 15. `materialIconHtml` L471–473
    - 16. `iconUrlHtml` L475–477
    - 17. `defaultNodeIconFunction` L479–516
    - 18. `prepareNodeIcon` L455–469 · calls `materialIconHtml`, `iconUrlHtml`, `defaultNodeIconFunction`
    - 19. `prepareNodeText` L276–281 · calls `prepareNodeIcon`
    - 20. `updateNodeStyle` L254–274 · calls `prepareNodeText`
    - 21. `updateNodeData` L221–252 · calls `updateNodeStyle`
      - 22. `vm.pendingUpdateNodeTasks[nodeId]` L247–249 · calls `updateNodeStyle`
    - 23. `datasourceToNode` L334–368 · calls `prepareNodeText`, `resolveEntity`
    - 24. `entityIdToNode` L370–401 · calls `datasourceToNode`
      - 25. `onDataUpdated` L385–387 · calls `updateNodeData`
    - 26. `loadNodes` L283–321 · calls `updateNodeData`, `showError`, `prepareNodes`, `datasourceToNode`, `entityIdToNode`, `prepareNodeRelationQuery`
    - 27. `updateDatasources` L178–180 · calls `loadNodes`
    - 28. `defaultNodeOpenedFunction` L518–520
    - 29. `defaultSortFunction` L522–528
    - 30. `initializeConfig` L100–138 · calls `loadNodeCtxFunction`, `defaultNodeRelationQueryFunction`, `defaultNodeIconFunction`, `defaultNodeOpenedFunction`, `defaultSortFunction`
  - 31. `EntitiesHierarchyWidget` L29–41 · calls `EntitiesHierarchyWidgetController`
144. `tbEntitiesTableWidget` directive — `src/app/widget/lib/entities-table-widget.js` · leaf UI · uses 0 · used by 0
  - 1. `DisplayColumnsPanelController` L629–633
  - 2. `EntitiesTableWidgetController` L50–626 · calls `initializeConfig`, `enterFilterMode`, `exitFilterMode`, `onReorder`, `onPaginate`, `onRowClick`, `onActionButtonClick`, `isCurrent`, `updateEntities`, `cellStyle`, `cellContent`, `updateEntitiesData`, `editColumnsToDisplay`, `updateDatasources`
    - 3. `vm.searchAction.onAction` L88–90
    - 4. `columnDisplayAction.onAction` L97–99
    - 5. `initializeConfig` L157–280 · calls `hashCode`
      - 6. `hashCode` L269–279
    - 7. `enterFilterMode` L282–288
    - 8. `onRowClick` L304–322
    - 9. `onActionButtonClick` L324–335
    - 10. `isCurrent` L337–340
    - 11. `updateEntities` L342–355
    - 12. `exitFilterMode` L290–294 · calls `updateEntities`
    - 13. `onReorder` L296–298 · calls `updateEntities`
    - 14. `onPaginate` L300–302 · calls `updateEntities`
    - 15. `defaultStyle` L409–411
    - 16. `getDescendantProp` L413–415
    - 17. `getEntityValue` L417–419 · calls `getDescendantProp`
    - 18. `cellStyle` L357–381 · calls `defaultStyle`, `getEntityValue`
    - 19. `cellContent` L383–407 · calls `getEntityValue`
    - 20. `updateEntitiesData` L421–438
    - 21. `editColumnsToDisplay` L440–462 · calls `DisplayColumnsPanelController`
    - 22. `updateDatasources` L464–624
  - 23. `EntitiesTableWidget` L35–47 · calls `EntitiesTableWidgetController`
145. `tbEntityAliasSelect` directive — `src/app/components/entity-alias-select.directive.js` · leaf UI · uses 1 · used by 0
  - 1. `EntityAliasSelect` L34–148 · calls `linker`
    - 2. `linker` L36–135 · calls `scope.updateView`
      - 3. `scope.updateValidity` L46–50
      - 4. `scope.createFilterForEntityAlias` L74–79
      - 5. `scope.entityAliasSearch` L69–72 · calls `scope.createFilterForEntityAlias`
      - 6. `scope.updateView` L81–84 · calls `scope.updateValidity`
      - 7. `ngModelCtrl.$render` L86–90
      - 8. `scope.textIsNotEmpty` L92–94
      - 9. `scope.createEntityAlias` L109–132
      - 10. `scope.entityAliasEnter` L96–107 · calls `scope.entityAliasSearch`, `scope.createEntityAlias`
146. `tbEntityAutocomplete` directive — `src/app/entity/index.js` · leaf UI · uses 0 · used by 0
147. `tbEntityFilter` directive — `src/app/entity/index.js` · leaf UI · uses 0 · used by 0
148. `tbEntityFilterView` directive — `src/app/entity/index.js` · leaf UI · uses 0 · used by 0
149. `tbEntityList` directive — `src/app/entity/index.js` · leaf UI · uses 0 · used by 0
150. `tbEntitySelect` directive — `src/app/entity/index.js` · leaf UI · uses 0 · used by 0
151. `tbEntitySubtypeAutocomplete` directive — `src/app/entity/index.js` · leaf UI · uses 0 · used by 0
152. `tbEntitySubtypeList` directive — `src/app/entity/index.js` · leaf UI · uses 0 · used by 0
153. `tbEntitySubtypeSelect` directive — `src/app/entity/index.js` · leaf UI · uses 0 · used by 0
154. `tbEntityTypeList` directive — `src/app/entity/index.js` · leaf UI · uses 0 · used by 0
155. `tbEntityTypeSelect` directive — `src/app/entity/index.js` · leaf UI · uses 0 · used by 0
156. `tbEntityView` directive — `src/app/entity-view/index.js` · leaf UI · uses 0 · used by 0
157. `tbEventHeader` directive — `src/app/event/index.js` · leaf UI · uses 0 · used by 0
158. `tbEventRow` directive — `src/app/event/index.js` · leaf UI · uses 0 · used by 0
159. `tbEventTable` directive — `src/app/event/index.js` · leaf UI · uses 0 · used by 0
160. `tbExpandFullscreen` directive — `src/app/components/expand-fullscreen.directive.js` · leaf UI · uses 0 · used by 0
  - 1. `ExpandFullscreen` L27–160 · calls `linker`
    - 2. `linker` L30–147 · calls `renderExpandButton`
      - 3. `scope.toggleExpand` L93–98
      - 4. `renderExpandButton` L123–146 · calls `scope.toggleExpand`
161. `tbExtensionFormHttp` directive — `src/app/extension/index.js` · leaf UI · uses 0 · used by 0
162. `tbExtensionFormModbus` directive — `src/app/extension/index.js` · leaf UI · uses 0 · used by 0
163. `tbExtensionFormMqtt` directive — `src/app/extension/index.js` · leaf UI · uses 0 · used by 0
164. `tbExtensionFormOpc` directive — `src/app/extension/index.js` · leaf UI · uses 0 · used by 0
165. `tbExtensionTable` directive — `src/app/extension/index.js` · leaf UI · uses 0 · used by 0
166. `tbExtensionsTableWidget` directive — `src/app/widget/lib/extensions-table-widget.js` · leaf UI · uses 0 · used by 0
  - 1. `ExtensionsTableWidgetController` L43–134 · calls `initializeConfig`, `updateDatasources`
    - 2. `initializeConfig` L59–69
    - 3. `updateDatasources` L71–76
    - 4. `vm.changeSelectedSource` L78–80
    - 5. `vm.searchAction.onAction` L85–87
    - 6. `vm.refreshAction.onAction` L94–96
    - 7. `vm.addAction.onAction` L103–105
    - 8. `vm.exportExtensionsAction.onAction` L112–114
    - 9. `vm.importExtensionsAction.onAction` L121–123
  - 10. `ExtensionsTableWidget` L29–40 · calls `ExtensionsTableWidgetController`
167. `tbGatewayConfig` directive — `src/app/components/gateway/gateway-config.directive.js` · leaf UI · uses 0 · used by 0
  - 1. `GatewayDialogController` L135–174
    - 2. `vm.configAreaOptions.onLoad` L147–149
    - 3. `vm.validateConfig` L152–161
    - 4. `vm.save` L163–165
    - 5. `vm.cancel` L167–169
    - 6. `vm.beautifyJson` L171–173
  - 7. `GatewayConfigController` L50–132
    - 8. `vm.removeConnector` L54–58
    - 9. `vm.addNewConnector` L60–67
    - 10. `vm.openConfigDialog` L69–95 · calls `GatewayDialogController`
    - 11. `generateConnectorName` L112–116
    - 12. `vm.changeConnectorType` L97–106 · calls `generateConnectorName`
    - 13. `validateConnectorName` L118–127
    - 14. `vm.changeConnectorName` L108–110 · calls `validateConnectorName`
    - 15. `vm.validateJSON` L129–131
  - 16. `GatewayConfig` L32–47 · calls `GatewayConfigController`
168. `tbGatewayConfigSelect` directive — `src/app/components/gateway/gateway-config-select.directive.js` · leaf UI · uses 0 · used by 0
  - 1. `GatewayConfigSelect` L32–139 · calls `linker`
    - 2. `linker` L34–125
      - 3. `scope.updateValidity` L42–46
      - 4. `scope.createFilterForGatewayName` L61–66
      - 5. `scope.gatewayNameSearch` L56–59 · calls `scope.createFilterForGatewayName`
      - 6. `scope.updateView` L68–72 · calls `scope.updateValidity`
      - 7. `startWatchers` L48–54 · calls `scope.updateView`
      - 8. `ngModelCtrl.$render` L74–79 · calls `startWatchers`
      - 9. `scope.textIsEmpty` L81–83
      - 10. `scope.createNewGatewayDialog` L95–123
      - 11. `scope.gatewayNameEnter` L85–93 · calls `scope.createNewGatewayDialog`
169. `tbGatewayForm` directive — `src/app/components/gateway/gateway-form.directive.js` · leaf UI · uses 0 · used by 0
  - 1. `GatewayFormController` L47–491 · calls `updateWidgetDisplaying`, `initializeConfig`
    - 2. `updateWidgetDisplaying` L117–121
    - 3. `initWidgetSettings` L123–146
    - 4. `vm.collapsePanel` L161–163
    - 5. `getAttribute` L216–218
    - 6. `saveAttribute` L220–226
    - 7. `getLogsConfig` L287–291
    - 8. `generateLogConfigFile` L283–285 · calls `getLogsConfig`
    - 9. `gatewayConnectorConfigJSON` L350–365
    - 10. `getDraftConnectorJSON` L367–379
    - 11. `processConfigurationDrafts` L429–442
    - 12. `processLoggingLevel` L444–452
    - 13. `setConfigGateway` L454–483
    - 14. `processCurrentConfiguration` L400–427 · calls `setConfigGateway`
    - 15. `getAttributes` L204–214 · calls `getAttribute`, `processCurrentConfiguration`, `processConfigurationDrafts`, `processLoggingLevel`
    - 16. `getDeviceCredentials` L165–172 · calls `getAttributes`
    - 17. `vm.getAccessToken` L155–159 · calls `getDeviceCredentials`
    - 18. `getGatewaysList` L381–398 · calls `vm.getAccessToken`
    - 19. `initializeConfig` L148–152 · calls `updateWidgetDisplaying`, `initWidgetSettings`, `getGatewaysList`
    - 20. `vm.createDevice` L174–192 · calls `getDeviceCredentials`, `getGatewaysList`
    - 21. `generateFileName` L485–490
    - 22. `generateYAMLConfigurationFile` L237–273 · calls `generateFileName`
    - 23. `generateConfigConnectorFiles` L275–281 · calls `generateFileName`
    - 24. `vm.exportConfig` L228–235 · calls `saveAttribute`, `generateYAMLConfigurationFile`, `generateConfigConnectorFiles`, `generateLogConfigFile`
    - 25. `gatewayMainConfigJSON` L300–348 · calls `getLogsConfig`, `generateFileName`
    - 26. `getGatewayConfigJSON` L293–298 · calls `gatewayMainConfigJSON`, `gatewayConnectorConfigJSON`
    - 27. `vm.saveAttributeConfig` L194–202 · calls `saveAttribute`, `getGatewayConfigJSON`, `getDraftConnectorJSON`
  - 28. `GatewayForm` L28–44 · calls `GatewayFormController`
170. `tbGrid` directive — `src/app/components/grid.directive.js` · leaf UI · uses 0 · used by 0
171. `tbGridCardContent` directive — `src/app/components/grid.directive.js` · leaf UI · uses 0 · used by 0
172. `tbHelp` directive — `src/app/help/help.directive.js` · leaf UI · uses 1 · used by 0
  - 1. `Help` L29–77 · calls `linker`
    - 2. `linker` L31–68
      - 3. `scope.gotoHelpPage` L33–45
173. `tbJsFunc` directive — `src/app/components/js-func.directive.js` · leaf UI · uses 2 · used by 0
  - 1. `JsFunc` L45–251 · calls `linker`
    - 2. `linker` L47–239 · calls `updateEditorSize`, `scope.cleanupJsErrors`, `scope.updateValidity`, `scope.validate`
      - 3. `scope.beautifyJs` L80–83
      - 4. `updateEditorSize` L85–90
      - 5. `scope.onFullscreenChanged` L76–78 · calls `updateEditorSize`
      - 6. `scope.cleanupJsErrors` L109–121
      - 7. `scope.jsEditorOptions.onLoad` L100–106 · calls `scope.cleanupJsErrors`
      - 8. `scope.updateValidity` L123–125
      - 9. `ngModelCtrl.$render` L135–137
      - 10. `scope.showError` L139–146
      - 11. `scope.validate` L148–221 · calls `scope.showError`
174. `tbJsonContent` directive — `src/app/components/json-content.directive.js` · leaf UI · uses 3 · used by 0
  - 1. `JsonContent` L42–191 · calls `linker`
    - 2. `linker` L44–177 · calls `updateEditorSize`, `scope.cleanupJsonErrors`, `scope.updateValidity`, `scope.validate`
      - 3. `scope.beautifyJSON` L60–62
      - 4. `scope.minifyJSON` L64–66
      - 5. `updateEditorSize` L68–73
      - 6. `scope.onFullscreenChanged` L56–58 · calls `updateEditorSize`
      - 7. `scope.cleanupJsonErrors` L111–113
      - 8. `scope.jsonEditorOptions.onLoad` L90–96 · calls `scope.cleanupJsonErrors`
      - 9. `scope.updateValidity` L115–117
      - 10. `ngModelCtrl.$render` L127–129
      - 11. `scope.showError` L131–134
      - 12. `scope.validate` L136–158 · calls `scope.showError`
175. `tbJsonForm` directive — `src/app/components/json-form.directive.js` · leaf UI · uses 1 · used by 0
176. `tbJsonObjectEdit` directive — `src/app/components/json-object-edit.directive.js` · leaf UI · uses 2 · used by 0
  - 1. `JsonObjectEdit` L36–192 · calls `linker`
    - 2. `linker` L38–180 · calls `updateEditorSize`, `scope.cleanupJsonErrors`, `scope.updateValidity`, `scope.showError`, `scope.validate`
      - 3. `scope.beautifyJSON` L53–55
      - 4. `scope.minifyJSON` L57–59
      - 5. `updateEditorSize` L61–66
      - 6. `scope.onFullscreenChanged` L49–51 · calls `updateEditorSize`
      - 7. `scope.cleanupJsonErrors` L85–87
      - 8. `scope.jsonEditorOptions.onLoad` L76–82 · calls `scope.cleanupJsonErrors`
      - 9. `scope.updateValidity` L89–91
      - 10. `ngModelCtrl.$render` L116–127
      - 11. `scope.showError` L129–132
      - 12. `scope.validate` L134–164
177. `tbJsonToString` directive — `src/app/components/tb-json-to-string.directive.js` · leaf UI · uses 0 · used by 0
  - 1. `InputJson` L20–45
    - 2. `link` L24–43 · calls `into`, `out`
      - 3. `into` L25–32
      - 4. `out` L33–40
178. `tbKeyValMap` directive — `src/app/components/kv-map.directive.js` · leaf UI · uses 0 · used by 0
  - 1. `KeyValMapController` L48–119 · calls `watchKvList`, `stopWatchKvList`, `removeKeyVal`, `addKeyVal`
    - 2. `watchKvList` L77–92
    - 3. `stopWatchKvList` L94–99
    - 4. `removeKeyVal` L102–106
    - 5. `addKeyVal` L108–118
  - 6. `KeyValMap` L29–45 · calls `KeyValMapController`
179. `tbKnob` directive — `src/app/widget/lib/rpc/knob.directive.js` · leaf UI · uses 0 · used by 0
  - 1. `KnobController` L48–393 · calls `init`
    - 2. `ratioToDegree` L256–258
    - 3. `degreeToRatio` L260–262
    - 4. `updateColor` L298–306
    - 5. `formatValue` L322–324
    - 6. `measureTextWidth` L344–348
    - 7. `setFontSize` L332–342 · calls `measureTextWidth`
    - 8. `onError` L315–320 · calls `setFontSize`
    - 9. `checkValueSize` L326–330 · calls `setFontSize`
    - 10. `resize` L264–275 · calls `checkValueSize`, `setFontSize`
    - 11. `setValue` L286–296 · calls `ratioToDegree`, `updateColor`, `formatValue`, `checkValueSize`
    - 12. `onValue` L308–313 · calls `formatValue`, `checkValueSize`
    - 13. `turn` L277–284 · calls `updateColor`, `onValue`
    - 14. `rpcRequestValue` L350–367 · calls `setValue`, `onError`
    - 15. `rpcUpdateValue` L369–392 · calls `onError`
    - 16. `init` L89–254 · calls `degreeToRatio`, `resize`, `turn`, `setValue`, `onError`, `rpcRequestValue`, `rpcUpdateValue`
  - 17. `Knob` L34–45 · calls `KnobController`
180. `tbLedIndicator` directive — `src/app/widget/lib/rpc/led-indicator.directive.js` · leaf UI · uses 0 · used by 0
  - 1. `LedIndicatorController` L45–297 · calls `init`, `resize`, `onDataUpdated`, `onDataUpdateError`
    - 2. `dataLoading` L58–58
    - 3. `updateColor` L172–183
    - 4. `setValue` L165–170 · calls `updateColor`
    - 5. `measureTextWidth` L201–205
    - 6. `setFontSize` L192–199 · calls `measureTextWidth`
    - 7. `resize` L152–163 · calls `setFontSize`
    - 8. `onError` L185–190 · calls `setFontSize`
    - 9. `subscribeForValue` L241–264
    - 10. `rpcCheckStatus` L207–239 · calls `onError`, `subscribeForValue`
    - 11. `init` L88–150 · calls `vm.parseValueFunction`, `resize`, `setValue`, `onError`, `rpcCheckStatus`, `subscribeForValue`
      - 12. `vm.parseValueFunction` L123–123
      - 13. `vm.parseValueFunction` L128–128
    - 14. `onDataUpdated` L266–286 · calls `vm.parseValueFunction`, `setValue`
    - 15. `onDataUpdateError` L288–295 · calls `onError`
  - 16. `LedIndicator` L31–42 · calls `LedIndicatorController`
181. `tbLedLight` directive — `src/app/components/led-light.directive.js` · leaf UI · uses 0 · used by 0
  - 1. `LedLight` L26–108 · calls `linker`
    - 2. `linker` L28–92 · calls `scope.draw`, `scope.update`
      - 3. `scope.draw` L40–74
      - 4. `scope.update` L76–89 · calls `scope.draw`
182. `tbLegend` directive — `src/app/components/legend.directive.js` · leaf UI · uses 1 · used by 0
  - 1. `Legend` L30–82 · calls `linker`
    - 2. `linker` L32–56
      - 3. `scope.displayHeader` L36–41
      - 4. `scope.toggleHideData` L48–52
183. `tbLegendConfig` directive — `src/app/components/legend-config.directive.js` · leaf UI · uses 1 · used by 0
  - 1. `LegendConfig` L37–151 · calls `linker`
    - 2. `linker` L39–140
      - 3. `scope.updateView` L102–112
      - 4. `scope.openEditMode` L54–100
        - 5. `onLegendConfigUpdate` L89–92 · calls `scope.updateView`
      - 6. `ngModelCtrl.$render` L114–137
184. `tbManageWidgetActions` directive — `src/app/components/widget/action/manage-widget-actions.directive.js` · leaf UI · uses 0 · used by 0
  - 1. `ManageWidgetActionsController` L74–298 · calls `enterFilterMode`, `exitFilterMode`, `onReorder`, `onPaginate`, `addAction`, `editAction`, `deleteAction`, `reloadActions`, `updateActions`
    - 2. `enterFilterMode` L115–124
    - 3. `getActionIndex` L225–231
    - 4. `saveAction` L233–266 · calls `getActionIndex`
    - 5. `updateActions` L289–297
    - 6. `exitFilterMode` L126–129 · calls `updateActions`
    - 7. `onReorder` L131–133 · calls `updateActions`
    - 8. `onPaginate` L135–137 · calls `updateActions`
    - 9. `deleteAction` L153–185 · calls `getActionIndex`, `updateActions`
    - 10. `openWidgetActionDialog` L187–223 · calls `saveAction`, `updateActions`
    - 11. `addAction` L139–144 · calls `openWidgetActionDialog`
    - 12. `editAction` L146–151 · calls `openWidgetActionDialog`
    - 13. `reloadActions` L268–287 · calls `updateActions`
  - 14. `ManageWidgetActions` L55–68 · calls `ManageWidgetActionsController`
185. `tbMaterialIconSelect` directive — `src/app/components/material-icon-select.directive.js` · leaf UI · uses 0 · used by 0
  - 1. `MaterialIconSelect` L34–89 · calls `linker`
    - 2. `linker` L36–79 · calls `scope.updateView`
      - 3. `scope.updateView` L43–45
      - 4. `ngModelCtrl.$render` L47–54
      - 5. `scope.openIconDialog` L60–76
186. `tbMenuLink` directive — `src/app/components/menu-link.directive.js` · leaf UI · uses 1 · used by 0
187. `tbMessageTypeAutocomplete` directive — `src/app/rulechain/index.js` · leaf UI · uses 0 · used by 0
188. `tbMousepointMenu` directive — `src/app/components/mousepoint-menu.directive.js` · leaf UI · uses 0 · used by 0
  - 1. `MousepointMenu` L21–55 · calls `linker`
    - 2. `linker` L23–48
      - 3. `$scope.$mdOpenMousepointMenu` L25–43
        - 4. `RightClickContextMenu.offsets` L26–41
      - 5. `$scope.$mdCloseMousepointMenu` L45–47
189. `tbMultipleInputWidget` directive — `src/app/widget/lib/multiple-input-widget.js` · leaf UI · uses 0 · used by 0
  - 1. `MultipleInputWidgetController` L44–344 · calls `discardAll`, `inputChanged`, `save`, `initializeConfig`, `updateDatasources`, `updateWidgetData`, `updateWidgetDisplaying`, `getGroupTitle`
    - 2. `discardAll` L82–89
    - 3. `inputChanged` L91–101
    - 4. `save` L103–197
    - 5. `updateDatasources` L231–284
    - 6. `updateWidgetData` L286–334
    - 7. `updateWidgetDisplaying` L336–339
    - 8. `initializeConfig` L199–229 · calls `updateWidgetDisplaying`
    - 9. `getGroupTitle` L341–343
  - 10. `MultipleInputWidget` L29–41 · calls `MultipleInputWidgetController`
190. `tbNavTree` directive — `src/app/components/nav-tree.directive.js` · leaf UI · uses 0 · used by 0
  - 1. `NavTreeController` L48–206 · calls `initTree`
    - 2. `initTree` L59–205 · calls `vm.editCallbacks.search`
      - 3. `config.search.search_callback` L78–78
      - 4. `vm.editCallbacks.selectNode` L98–104
      - 5. `vm.editCallbacks.deselectAll` L105–107
      - 6. `vm.editCallbacks.getNode` L108–111
      - 7. `vm.editCallbacks.getParentNodeId` L112–117
      - 8. `vm.editCallbacks.openNode` L118–123
      - 9. `vm.editCallbacks.nodeIsOpen` L124–131
      - 10. `vm.editCallbacks.nodeIsLoaded` L132–139
      - 11. `vm.editCallbacks.refreshNode` L140–155
      - 12. `vm.editCallbacks.updateNode` L156–161
      - 13. `vm.editCallbacks.createNode` L162–167
      - 14. `vm.editCallbacks.deleteNode` L168–173
      - 15. `vm.editCallbacks.disableNode` L174–179
      - 16. `vm.editCallbacks.enableNode` L180–185
      - 17. `vm.editCallbacks.setNodeHasChildren` L186–197
      - 18. `vm.editCallbacks.search` L198–200
      - 19. `vm.editCallbacks.clearSearch` L201–203
  - 20. `NavTree` L29–45 · calls `NavTreeController`
191. `tbNoAnimate` directive — `src/app/components/no-animate.directive.js` · leaf UI · uses 0 · used by 0
  - 1. `NoAnimate` L23–33
    - 2. `link` L26–31
192. `tbOnFinishRender` directive — `src/app/components/finish-render.directive.js` · leaf UI · uses 0 · used by 0
  - 1. `OnFinishRender` L21–32
    - 2. `link` L24–30
193. `tbQueueTypeList` directive — `src/app/components/queue/index.js` · leaf UI · uses 0 · used by 0
194. `tbRelatedEntityAutocomplete` directive — `src/app/components/related-entity-autocomplete.directive.js` · leaf UI · uses 1 · used by 0
  - 1. `RelatedEntityAutocomplete` L30–126 · calls `linker`
    - 2. `linker` L32–107 · calls `scope.updateView`
      - 3. `filterEntities` L69–72
      - 4. `scope.fetchEntities` L42–67 · calls `filterEntities`
      - 5. `scope.entitySearchTextChanged` L74–75
      - 6. `scope.updateView` L77–81
      - 7. `ngModelCtrl.$render` L83–96
195. `tbRelationFilters` directive — `src/app/entity/index.js` · leaf UI · uses 0 · used by 0
196. `tbRelationTable` directive — `src/app/entity/index.js` · leaf UI · uses 0 · used by 0
197. `tbRelationTypeAutocomplete` directive — `src/app/entity/index.js` · leaf UI · uses 0 · used by 0
198. `tbRoundSwitch` directive — `src/app/widget/lib/rpc/round-switch.directive.js` · leaf UI · uses 0 · used by 0
  - 1. `RoundSwitchController` L43–298 · calls `init`, `resize`, `onValue`
    - 2. `setValue` L230–233
    - 3. `measureTextWidth` L255–259
    - 4. `setFontSize` L246–253 · calls `measureTextWidth`
    - 5. `resize` L152–168 · calls `setFontSize`
    - 6. `onError` L239–244 · calls `setFontSize`
    - 7. `onDataUpdateError` L221–228 · calls `onError`
    - 8. `init` L82–150 · calls `vm.parseValueFunction`, `vm.convertValueFunction`, `resize`, `subscribeForValue`, `setValue`, `onError`, `rpcRequestValue` · cycle
      - 9. `vm.parseValueFunction` L113–113
      - 10. `vm.parseValueFunction` L118–118
      - 11. `vm.convertValueFunction` L122–122
      - 12. `vm.convertValueFunction` L127–127
    - 13. `subscribeForValue` L170–197 · calls `onDataUpdated`, `onDataUpdateError` · cycle
    - 14. `onDataUpdated` L199–219 · calls `vm.parseValueFunction`, `setValue` · cycle
    - 15. `rpcRequestValue` L261–272 · calls `vm.parseValueFunction`, `setValue`, `onError` · cycle
    - 16. `rpcUpdateValue` L274–297 · calls `vm.convertValueFunction`, `onError`
    - 17. `onValue` L235–237 · calls `rpcUpdateValue`
  - 18. `RoundSwitch` L29–40 · calls `RoundSwitchController`
199. `tbRuleChain` directive — `src/app/rulechain/index.js` · leaf UI · uses 0 · used by 0
200. `tbRuleNode` directive — `src/app/rulechain/index.js` · leaf UI · uses 0 · used by 0
201. `tbRuleNodeConfig` directive — `src/app/rulechain/index.js` · leaf UI · uses 0 · used by 0
202. `tbRuleNodeDefinedConfig` directive — `src/app/rulechain/index.js` · leaf UI · uses 0 · used by 0
203. `tbRuleNodeLink` directive — `src/app/rulechain/index.js` · leaf UI · uses 0 · used by 0
204. `tbScopeElement` directive — `src/app/components/scope-element.directive.js` · leaf UI · uses 0 · used by 0
  - 1. `ScopeElement` L21–33
    - 2. `directiveDefinitionObject.compile` L24–30
      - 3. `pre` L26–28
205. `tbSideMenu` directive — `src/app/components/side-menu.directive.js` · leaf UI · uses 1 · used by 0
  - 1. `SideMenu` L32–50 · calls `linker`
    - 2. `linker` L34–43
206. `tbSocialSharePanel` directive — `src/app/components/socialshare-panel.directive.js` · leaf UI · uses 0 · used by 0
  - 1. `SocialsharePanelController` L45–57
    - 2. `vm.isShareLinkLocal` L49–55
  - 3. `SocialsharePanel` L28–42 · calls `SocialsharePanelController`
207. `tbStatesComponent` directive — `src/app/dashboard/states/index.js` · leaf UI · uses 0 · used by 0
208. `tbSwitch` directive — `src/app/widget/lib/rpc/switch.directive.js` · leaf UI · uses 0 · used by 0
  - 1. `SwitchController` L43–314 · calls `init`, `onValue`
    - 2. `setValue` L247–249
    - 3. `measureTextWidth` L271–275
    - 4. `setFontSize` L262–269 · calls `measureTextWidth`
    - 5. `resize` L152–185 · calls `setFontSize`
    - 6. `onError` L255–260 · calls `setFontSize`
    - 7. `onDataUpdateError` L238–245 · calls `onError`
    - 8. `init` L79–148 · calls `vm.parseValueFunction`, `vm.convertValueFunction`, `resize`, `subscribeForValue`, `setValue`, `onError`, `rpcRequestValue` · cycle
      - 9. `vm.parseValueFunction` L111–111
      - 10. `vm.parseValueFunction` L116–116
      - 11. `vm.convertValueFunction` L120–120
      - 12. `vm.convertValueFunction` L125–125
    - 13. `subscribeForValue` L187–214 · calls `onDataUpdated`, `onDataUpdateError` · cycle
    - 14. `onDataUpdated` L216–236 · calls `vm.parseValueFunction`, `setValue` · cycle
    - 15. `rpcRequestValue` L277–288 · calls `vm.parseValueFunction`, `setValue`, `onError` · cycle
    - 16. `rpcUpdateValue` L290–313 · calls `vm.convertValueFunction`, `onError`
    - 17. `onValue` L251–253 · calls `rpcUpdateValue`
  - 18. `Switch` L29–40 · calls `SwitchController`
209. `tbTableColumnsAssignment` directive — `src/app/import-export/index.js` · leaf UI · uses 0 · used by 0
210. `tbTenant` directive — `src/app/tenant/index.js` · leaf UI · uses 0 · used by 0
211. `tbTimeinterval` directive — `src/app/components/timeinterval.directive.js` · leaf UI · uses 1 · used by 0
  - 1. `Timeinterval` L29–240 · calls `linker`
    - 2. `linker` L31–225 · calls `scope.boundInterval`, `scope.setIntervalMs`, `calculateIntervalMs`, `scope.updateView`
      - 3. `scope.setIntervalMs` L65–74
      - 4. `ngModelCtrl.$render` L76–85 · calls `scope.setIntervalMs`
      - 5. `calculateIntervalMs` L87–92
      - 6. `scope.boundInterval` L44–63 · calls `scope.setIntervalMs`, `scope.updateView` · cycle
      - 7. `scope.updateView` L94–116 · calls `scope.boundInterval`, `calculateIntervalMs` · cycle
212. `tbTimeseriesTableWidget` directive — `src/app/widget/lib/timeseries-table-widget.js` · leaf UI · uses 0 · used by 0
  - 1. `TimeseriesTableWidgetController` L47–445 · calls `enterFilterMode`, `exitFilterMode`, `initialize`, `dataUpdated`, `onRowClick`, `onActionButtonClick`, `updateActiveEntityInfo`, `updateSourceData`
    - 2. `enterFilterMode` L65–71
    - 3. `exitFilterMode` L73–76
    - 4. `vm.searchAction.onAction` L81–83
    - 5. `onRowClick` L187–198
    - 6. `onActionButtonClick` L200–208
    - 7. `vm.cellStyle` L211–224
    - 8. `vm.cellContent` L226–255
    - 9. `updateActiveEntityInfo` L264–281
    - 10. `updateDatasources` L283–367 · calls `updateActiveEntityInfo`
    - 11. `initialize` L97–161 · calls `hashCode`, `updateDatasources`
      - 12. `hashCode` L149–159
    - 13. `updatePage` L369–372
    - 14. `vm.onPaginate` L178–180 · calls `updatePage`
    - 15. `reorder` L374–399
    - 16. `vm.onReorder` L182–185 · calls `updatePage`, `reorder`
    - 17. `convertData` L401–436
    - 18. `updateSourceData` L438–443 · calls `updatePage`, `reorder`, `convertData`
    - 19. `dataUpdated` L169–176 · calls `updateSourceData`
  - 20. `TimeseriesTableWidget` L32–44 · calls `TimeseriesTableWidgetController`
213. `tbTimewindow` directive — `src/app/components/timewindow.directive.js` · leaf UI · uses 1 · used by 0
214. `tbUser` directive — `src/app/user/index.js` · leaf UI · uses 0 · used by 0
215. `tbUserMenu` directive — `src/app/layout/user-menu.directive.js` · leaf UI · uses 0 · used by 0
  - 1. `UserMenuController` L43–97 · calls `authorityName`, `userDisplayName`, `openProfile`, `logout`
    - 2. `authorityName` L54–67
    - 3. `userDisplayName` L69–88
    - 4. `openProfile` L90–92
    - 5. `logout` L94–96
  - 6. `UserMenu` L29–40 · calls `UserMenuController`
216. `tbWebCameraWidget` directive — `src/app/widget/lib/web-camera-input-widget.js` · leaf UI · uses 0 · used by 0
  - 1. `WebCameraWidgetController` L40–223 · calls `hasGetUserMedia`, `takePhoto`, `cancelPhoto`, `switchWebCamera`, `getDevices`, `gotDevices`, `getStream`, `createPhoto`, `closeCamera`, `savePhoto`
    - 2. `getVideoAspectRatio` L103–109 · calls `vm.videoWidth`, `vm.videoHeight` · cycle
    - 3. `vm.videoWidth` L111–114 · calls `getVideoAspectRatio` · cycle
    - 4. `vm.videoHeight` L116–119 · calls `getVideoAspectRatio` · cycle
    - 5. `hasGetUserMedia` L121–123
    - 6. `cancelPhoto` L134–137
    - 7. `getDevices` L145–147
    - 8. `gotDevices` L149–160
    - 9. `gotStream` L174–182
    - 10. `getStream` L162–172 · calls `gotStream`
    - 11. `takePhoto` L125–132 · calls `getStream`
    - 12. `switchWebCamera` L139–143 · calls `getStream`
    - 13. `createPhoto` L184–192 · calls `vm.videoWidth`, `vm.videoHeight`
    - 14. `closeCamera` L194–204
    - 15. `savePhoto` L206–222 · calls `closeCamera`
  - 16. `webCameraWidget` L27–38 · calls `WebCameraWidgetController`
217. `tbWidget` directive — `src/app/components/widget/widget.directive.js` · leaf UI · uses 1 · used by 0
  - 1. `Widget` L30–95
    - 2. `link` L33–93 · calls `loadFromWidgetInfo`
      - 3. `loadFromWidgetInfo` L71–92
218. `tbWidgetConfig` directive — `src/app/components/widget/widget-config.directive.js` · leaf UI · uses 2 · used by 0
  - 1. `WidgetConfig` L51–522 · calls `linker`
    - 2. `linker` L53–501 · calls `scope.updateValidity`
      - 3. `scope.styleEditorOptions.onLoad` L80–82
      - 4. `scope.displayAdvanced` L198–200
      - 5. `scope.updateSchemaForm` L202–214
      - 6. `ngModelCtrl.$render` L105–196 · calls `scope.updateSchemaForm`
      - 7. `scope.updateValidity` L216–246
      - 8. `scope.removeDatasource` L408–416
      - 9. `scope.genNextLabel` L458–483
      - 10. `scope.genNextColor` L485–498
      - 11. `scope.generateDataKey` L418–456 · calls `scope.genNextLabel`, `scope.genNextColor`
      - 12. `scope.addDatasource` L391–406 · calls `scope.generateDataKey`
219. `tbWidgetsBundle` directive — `src/app/widget/index.js` · leaf UI · uses 0 · used by 0
220. `tbWidgetsBundleSelect` directive — `src/app/components/widgets-bundle-select.directive.js` · leaf UI · uses 2 · used by 0
  - 1. `WidgetsBundleSelect` L32–117 · calls `linker`
    - 2. `linker` L34–103 · calls `selectWidgetsBundleByAlias`, `scope.updateView`
      - 3. `selectWidgetsBundleByAlias` L66–76
      - 4. `scope.isSystem` L78–80
      - 5. `scope.updateView` L82–84
      - 6. `ngModelCtrl.$render` L86–90
221. `tripAnimation` directive — `src/app/widget/lib/tripAnimation/trip-animation-widget.js` · leaf UI · uses 0 · used by 0
  - 1. `_initIcon` L46–48
  - 2. `_applyRotation` L55–70
  - 3. `_setPos` L50–53 · calls `_applyRotation`
  - 4. `setRotationAngle` L72–76
  - 5. `setRotationOrigin` L78–82
222. `tripAnimation` filter — `src/app/widget/lib/tripAnimation/trip-animation-widget.js` · leaf UI · uses 0 · used by 0
  - 1. `tripAnimationController` L122–985 · calls `initializeCallbacks`, `recalculateTrips`, `initialize`, `configureStaticSettings`, `showHideTooltip`
    - 2. `resize` L179–183
    - 3. `initCallback` L185–188
    - 4. `vm.stopPlay` L243–248
    - 5. `initialize` L268–295 · calls `initCallback`
    - 6. `configureStaticSettings` L297–442
    - 7. `fillPattern` L676–696
    - 8. `createNormalizedTime` L698–726
    - 9. `createNormalizedValue` L754–760
    - 10. `createNormalizedLatLngs` L762–776
    - 11. `createNormalizedTrips` L728–752 · calls `createNormalizedValue`, `createNormalizedLatLngs`
    - 12. `findAngle` L890–894
    - 13. `calculateCurrentDate` L867–888 · calls `findAngle`
    - 14. `calculateLabel` L470–494 · calls `fillPattern`, `calculateCurrentDate`
    - 15. `calculateTooltip` L496–515 · calls `fillPattern`, `calculateCurrentDate`
    - 16. `calculatePolygonTooltip` L517–536 · calls `fillPattern`, `calculateCurrentDate`
    - 17. `calculatePointTooltip` L538–557 · calls `fillPattern`, `calculateCurrentDate`
    - 18. `calculateColor` L559–573 · calls `calculateCurrentDate`
    - 19. `calculatePolygonColor` L575–589 · calls `calculateCurrentDate`
    - 20. `calculateIcon` L591–627 · calls `calculateCurrentDate`
    - 21. `configureTripSettings` L444–468 · calls `calculateLabel`, `calculateTooltip`, `calculatePolygonTooltip`, `calculateColor`, `calculatePolygonColor`, `calculateIcon`
    - 22. `createPointPopup` L778–783 · calls `calculatePointTooltip`
    - 23. `mapPolygonArray` L896–912
    - 24. `showHideTooltip` L940–953
    - 25. `moveMarker` L914–937 · calls `setRotationAngle`, `setRotationOrigin`, `configureTripSettings`, `calculateCurrentDate`, `showHideTooltip`
    - 26. `recalculateTrips` L262–266 · calls `moveMarker`
    - 27. `moveToIndex` L255–260 · calls `recalculateTrips`
    - 28. `vm.moveStart` L233–236 · calls `vm.stopPlay`, `moveToIndex`
    - 29. `vm.moveEnd` L238–241 · calls `vm.stopPlay`, `moveToIndex`
    - 30. `moveInc` L250–253 · calls `moveToIndex`
    - 31. `vm.playMove` L190–199 · calls `moveInc`
    - 32. `vm.moveNext` L201–215 · calls `vm.stopPlay`, `moveInc`, `moveToIndex`, `calculateCurrentDate`
    - 33. `vm.movePrev` L217–231 · calls `vm.stopPlay`, `moveInc`, `moveToIndex`, `calculateCurrentDate`
    - 34. `showHidePointTooltip` L955–971
    - 35. `showHidePolygonTooltip` L973–984
    - 36. `createTripsOnMap` L785–865 · calls `setRotationOrigin`, `configureTripSettings`, `calculatePointTooltip`, `createPointPopup`, `calculateCurrentDate`, `mapPolygonArray`, `moveMarker`, `showHideTooltip`, `showHidePointTooltip`, `showHidePolygonTooltip`
    - 37. `createUpdatePath` L629–674 · calls `createNormalizedTime`, `createNormalizedTrips`, `createTripsOnMap`
    - 38. `initializeCallbacks` L160–176
      - 39. `vm.self.onDataUpdated` L161–163 · calls `createUpdatePath`
      - 40. `vm.self.onResize` L165–167 · calls `resize`
      - 41. `vm.self.typeParameters` L169–174
  - 42. `tripAnimationWidget` L107–119 · calls `tripAnimationController`
223. `truncate` filter — `src/app/components/truncate.filter.js` · leaf UI · uses 0 · used by 0
  - 1. `Truncate` L21–43
224. `ActivationLinkDialogController` controller — `src/app/user/index.js` · pages · uses 0 · used by 0
225. `AddAssetsToCustomerController` controller — `src/app/asset/index.js` · pages · uses 0 · used by 0
226. `AddAttributeDialogController` controller — `src/app/entity/index.js` · pages · uses 0 · used by 0
227. `AddDashboardsToCustomerController` controller — `src/app/dashboard/index.js` · pages · uses 0 · used by 0
228. `AddDevicesToCustomerController` controller — `src/app/device/index.js` · pages · uses 0 · used by 0
229. `AddEntityViewsToCustomerController` controller — `src/app/entity-view/index.js` · pages · uses 0 · used by 0
230. `AddItemController` controller — `src/app/components/grid.directive.js` · pages · uses 1 · used by 0
231. `AddRuleNodeController` controller — `src/app/rulechain/index.js` · pages · uses 0 · used by 0
232. `AddRuleNodeLinkController` controller — `src/app/rulechain/index.js` · pages · uses 0 · used by 0
233. `AddUserController` controller — `src/app/user/index.js` · pages · uses 0 · used by 0
234. `AddWidgetController` controller — `src/app/dashboard/index.js` · pages · uses 0 · used by 0
235. `AddWidgetToDashboardDialogController` controller — `src/app/entity/index.js` · pages · uses 0 · used by 0
236. `AlarmDetailsDialogController` controller — `src/app/alarm/index.js` · pages · uses 0 · used by 0
237. `AliasesEntitySelectPanelController` controller — `src/app/entity/index.js` · pages · uses 0 · used by 0
238. `AssetCardController` controller — `src/app/asset/index.js` · pages · uses 0 · used by 0
239. `AssignAssetToCustomerController` controller — `src/app/asset/index.js` · pages · uses 0 · used by 0
240. `AssignDeviceToCustomerController` controller — `src/app/device/index.js` · pages · uses 0 · used by 0
241. `AssignEntityViewToCustomerController` controller — `src/app/entity-view/index.js` · pages · uses 0 · used by 0
242. `AuditLogDetailsDialogController` controller — `src/app/audit/index.js` · pages · uses 0 · used by 0
243. `ChangePasswordController` controller — `src/app/profile/index.js` · pages · uses 0 · used by 0
244. `DashboardCardController` controller — `src/app/dashboard/index.js` · pages · uses 0 · used by 0
245. `DashboardSelectPanelController` controller — `src/app/components/dashboard-select.directive.js` · pages · uses 0 · used by 0
246. `DashboardSettingsController` controller — `src/app/dashboard/index.js` · pages · uses 0 · used by 0
247. `DashboardStateDialogController` controller — `src/app/dashboard/states/index.js` · pages · uses 0 · used by 0
248. `DatakeyConfigDialogController` controller — `src/app/components/datakey-config-dialog.controller.js` · pages · uses 1 · used by 0
  - 1. `DatakeyConfigDialogController` L23–72
    - 2. `vm.hide` L32–34
    - 3. `vm.cancel` L36–38
    - 4. `vm.fetchEntityKeys` L40–63
    - 5. `vm.save` L65–71 · calls `vm.hide`
249. `DeviceCardController` controller — `src/app/device/index.js` · pages · uses 0 · used by 0
250. `EntityAliasDialogController` controller — `src/app/entity/index.js` · pages · uses 0 · used by 0
251. `EntityAliasesController` controller — `src/app/entity/index.js` · pages · uses 0 · used by 0
252. `EntityViewCardController` controller — `src/app/entity-view/index.js` · pages · uses 0 · used by 0
253. `EventContentDialogController` controller — `src/app/event/index.js` · pages · uses 0 · used by 0
254. `ImportDialogCSVController` controller — `src/app/import-export/index.js` · pages · uses 0 · used by 0
255. `ImportDialogController` controller — `src/app/import-export/index.js` · pages · uses 0 · used by 0
256. `ItemCardController` controller — `src/app/components/grid.directive.js` · pages · uses 0 · used by 0
257. `LegendConfigPanelController` controller — `src/app/components/legend-config.directive.js` · pages · uses 0 · used by 0
258. `MakeDashboardPublicDialogController` controller — `src/app/dashboard/index.js` · pages · uses 0 · used by 0
259. `ManageAssignedCustomersController` controller — `src/app/dashboard/index.js` · pages · uses 0 · used by 0
260. `ManageDashboardLayoutsController` controller — `src/app/dashboard/layouts/index.js` · pages · uses 0 · used by 0
261. `ManageDashboardStatesController` controller — `src/app/dashboard/states/index.js` · pages · uses 0 · used by 0
262. `ManageDeviceCredentialsController` controller — `src/app/device/index.js` · pages · uses 0 · used by 0
263. `MaterialIconsDialogController` controller — `src/app/components/json-form.directive.js` · pages · uses 0 · used by 0
264. `MaterialIconsDialogController` controller — `src/app/components/material-icon-select.directive.js` · pages · uses 0 · used by 0
265. `NodeScriptTestController` controller — `src/app/rulechain/index.js` · pages · uses 0 · used by 0
266. `SaveWidgetTypeAsController` controller — `src/app/widget/index.js` · pages · uses 0 · used by 0
267. `SelectTargetLayoutController` controller — `src/app/dashboard/layouts/index.js` · pages · uses 0 · used by 0
268. `SelectTargetStateController` controller — `src/app/dashboard/states/index.js` · pages · uses 0 · used by 0
269. `SelectWidgetTypeController` controller — `src/app/widget/index.js` · pages · uses 0 · used by 0
270. `TimewindowPanelController` controller — `src/app/components/timewindow.directive.js` · pages · uses 0 · used by 0
271. `ToastController` controller — `src/app/services/toast.js` · pages · uses 0 · used by 0
272. `WidgetActionDialogController` controller — `src/app/components/widget/action/manage-widget-actions.directive.js` · pages · uses 0 · used by 0
273. `WidgetController` controller — `src/app/components/widget/widget.directive.js` · pages · uses 0 · used by 0

## `bootstrap` — 142 units

274. `<config@107>` config — `src/app/app.js` · bootstrap · uses 0 · used by 0
275. `<config@21>` config — `src/app/home/index.js` · bootstrap · uses 0 · used by 0
276. `<config@23>` config — `src/app/audit/index.js` · bootstrap · uses 0 · used by 0
277. `<config@24>` config — `src/app/jsonform/index.js` · bootstrap · uses 0 · used by 0
278. `<config@26>` config — `src/app/customer/index.js` · bootstrap · uses 0 · used by 0
279. `<config@26>` config — `src/app/tenant/index.js` · bootstrap · uses 0 · used by 0
280. `<config@27>` config — `src/app/admin/index.js` · bootstrap · uses 0 · used by 0
281. `<config@27>` config — `src/app/profile/index.js` · bootstrap · uses 0 · used by 0
282. `<config@27>` config — `src/app/user/index.js` · bootstrap · uses 0 · used by 0
283. `<config@28>` config — `src/app/asset/index.js` · bootstrap · uses 0 · used by 0
284. `<config@28>` config — `src/app/entity-view/index.js` · bootstrap · uses 0 · used by 0
285. `<config@28>` config — `src/app/rulechain/index.js` · bootstrap · uses 0 · used by 0
286. `<config@29>` config — `src/app/device/index.js` · bootstrap · uses 0 · used by 0
287. `<config@29>` config — `src/app/login/index.js` · bootstrap · uses 0 · used by 0
288. `<config@40>` config — `src/app/widget/index.js` · bootstrap · uses 0 · used by 0
289. `<config@50>` config — `src/app/dashboard/index.js` · bootstrap · uses 0 · used by 0
290. `<config@67>` config — `src/app/layout/index.js` · bootstrap · uses 0 · used by 0
291. `<run@107>` run — `src/app/app.js` · bootstrap · uses 0 · used by 0
292. `tbJsonToString` module — `src/app/components/tb-json-to-string.directive.js` · bootstrap · uses 0 · used by 0
293. `thingsboard` module — `src/app/app.js` · bootstrap · uses 0 · used by 0
294. `thingsboard.admin` module — `src/app/admin/index.js` · bootstrap · uses 0 · used by 0
295. `thingsboard.alarm` module — `src/app/alarm/index.js` · bootstrap · uses 0 · used by 0
296. `thingsboard.api.admin` module — `src/app/api/admin.service.js` · bootstrap · uses 0 · used by 0
297. `thingsboard.api.alarm` module — `src/app/api/alarm.service.js` · bootstrap · uses 0 · used by 0
298. `thingsboard.api.asset` module — `src/app/api/asset.service.js` · bootstrap · uses 0 · used by 0
299. `thingsboard.api.attribute` module — `src/app/api/attribute.service.js` · bootstrap · uses 0 · used by 0
300. `thingsboard.api.auditLog` module — `src/app/api/audit-log.service.js` · bootstrap · uses 0 · used by 0
301. `thingsboard.api.componentDescriptor` module — `src/app/api/component-descriptor.service.js` · bootstrap · uses 0 · used by 0
302. `thingsboard.api.customer` module — `src/app/api/customer.service.js` · bootstrap · uses 0 · used by 0
303. `thingsboard.api.dashboard` module — `src/app/api/dashboard.service.js` · bootstrap · uses 0 · used by 0
304. `thingsboard.api.datasource` module — `src/app/api/datasource.service.js` · bootstrap · uses 0 · used by 0
305. `thingsboard.api.device` module — `src/app/api/device.service.js` · bootstrap · uses 0 · used by 0
306. `thingsboard.api.entity` module — `src/app/api/entity.service.js` · bootstrap · uses 0 · used by 0
307. `thingsboard.api.entityRelation` module — `src/app/api/entity-relation.service.js` · bootstrap · uses 0 · used by 0
308. `thingsboard.api.entityView` module — `src/app/api/entity-view.service.js` · bootstrap · uses 0 · used by 0
309. `thingsboard.api.event` module — `src/app/api/event.service.js` · bootstrap · uses 0 · used by 0
310. `thingsboard.api.login` module — `src/app/api/login.service.js` · bootstrap · uses 0 · used by 0
311. `thingsboard.api.queue` module — `src/app/api/queue.service.js` · bootstrap · uses 0 · used by 0
312. `thingsboard.api.ruleChain` module — `src/app/api/rule-chain.service.js` · bootstrap · uses 0 · used by 0
313. `thingsboard.api.telemetryWebsocket` module — `src/app/api/telemetry-websocket.service.js` · bootstrap · uses 0 · used by 0
314. `thingsboard.api.tenant` module — `src/app/api/tenant.service.js` · bootstrap · uses 0 · used by 0
315. `thingsboard.api.time` module — `src/app/api/time.service.js` · bootstrap · uses 0 · used by 0
316. `thingsboard.api.user` module — `src/app/api/user.service.js` · bootstrap · uses 0 · used by 0
317. `thingsboard.api.widget` module — `src/app/api/widget.service.js` · bootstrap · uses 0 · used by 0
318. `thingsboard.asset` module — `src/app/asset/index.js` · bootstrap · uses 0 · used by 0
319. `thingsboard.auditLog` module — `src/app/audit/index.js` · bootstrap · uses 0 · used by 0
320. `thingsboard.clipboard` module — `src/app/services/clipboard.service.js` · bootstrap · uses 0 · used by 0
321. `thingsboard.customer` module — `src/app/customer/index.js` · bootstrap · uses 0 · used by 0
322. `thingsboard.dashboard` module — `src/app/dashboard/index.js` · bootstrap · uses 0 · used by 0
323. `thingsboard.dashboard.layouts` module — `src/app/dashboard/layouts/index.js` · bootstrap · uses 0 · used by 0
324. `thingsboard.dashboard.states` module — `src/app/dashboard/states/index.js` · bootstrap · uses 0 · used by 0
325. `thingsboard.dashboardUtils` module — `src/app/common/dashboard-utils.service.js` · bootstrap · uses 0 · used by 0
326. `thingsboard.device` module — `src/app/device/index.js` · bootstrap · uses 0 · used by 0
327. `thingsboard.dialogs.datakeyConfigDialog` module — `src/app/components/datakey-config-dialog.controller.js` · bootstrap · uses 0 · used by 0
328. `thingsboard.directives.circularProgress` module — `src/app/components/circular-progress.directive.js` · bootstrap · uses 0 · used by 0
329. `thingsboard.directives.confirmOnExit` module — `src/app/components/confirm-on-exit.directive.js` · bootstrap · uses 0 · used by 0
330. `thingsboard.directives.contact` module — `src/app/components/contact.directive.js` · bootstrap · uses 0 · used by 0
331. `thingsboard.directives.customActionPrettyEditor` module — `src/app/components/widget/action/custom-action-pretty-editor.directive.js` · bootstrap · uses 0 · used by 0
332. `thingsboard.directives.dashboard` module — `src/app/components/dashboard.directive.js` · bootstrap · uses 0 · used by 0
333. `thingsboard.directives.dashboardAutocomplete` module — `src/app/components/dashboard-autocomplete.directive.js` · bootstrap · uses 0 · used by 0
334. `thingsboard.directives.dashboardSelect` module — `src/app/components/dashboard-select.directive.js` · bootstrap · uses 0 · used by 0
335. `thingsboard.directives.datakeyConfig` module — `src/app/components/datakey-config.directive.js` · bootstrap · uses 0 · used by 0
336. `thingsboard.directives.datasource` module — `src/app/components/datasource.directive.js` · bootstrap · uses 0 · used by 0
337. `thingsboard.directives.datasourceEntity` module — `src/app/components/datasource-entity.directive.js` · bootstrap · uses 0 · used by 0
338. `thingsboard.directives.datasourceFunc` module — `src/app/components/datasource-func.directive.js` · bootstrap · uses 0 · used by 0
339. `thingsboard.directives.datetimePeriod` module — `src/app/components/datetime-period.directive.js` · bootstrap · uses 0 · used by 0
340. `thingsboard.directives.detailsSidenav` module — `src/app/components/details-sidenav.directive.js` · bootstrap · uses 0 · used by 0
341. `thingsboard.directives.entityAliasSelect` module — `src/app/components/entity-alias-select.directive.js` · bootstrap · uses 0 · used by 0
342. `thingsboard.directives.event` module — `src/app/components/tb-event-directives.js` · bootstrap · uses 0 · used by 0
343. `thingsboard.directives.expandFullscreen` module — `src/app/components/expand-fullscreen.directive.js` · bootstrap · uses 0 · used by 0
344. `thingsboard.directives.finishRender` module — `src/app/components/finish-render.directive.js` · bootstrap · uses 0 · used by 0
345. `thingsboard.directives.gatewayConfig` module — `src/app/components/gateway/gateway-config.directive.js` · bootstrap · uses 0 · used by 0
346. `thingsboard.directives.gatewayConfigSelect` module — `src/app/components/gateway/gateway-config-select.directive.js` · bootstrap · uses 0 · used by 0
347. `thingsboard.directives.gatewayForm` module — `src/app/components/gateway/gateway-form.directive.js` · bootstrap · uses 0 · used by 0
348. `thingsboard.directives.grid` module — `src/app/components/grid.directive.js` · bootstrap · uses 0 · used by 0
349. `thingsboard.directives.help` module — `src/app/help/help.directive.js` · bootstrap · uses 0 · used by 0
350. `thingsboard.directives.jsFunc` module — `src/app/components/js-func.directive.js` · bootstrap · uses 0 · used by 0
351. `thingsboard.directives.jsonContent` module — `src/app/components/json-content.directive.js` · bootstrap · uses 0 · used by 0
352. `thingsboard.directives.jsonForm` module — `src/app/components/json-form.directive.js` · bootstrap · uses 0 · used by 0
353. `thingsboard.directives.jsonObjectEdit` module — `src/app/components/json-object-edit.directive.js` · bootstrap · uses 0 · used by 0
354. `thingsboard.directives.keyValMap` module — `src/app/components/kv-map.directive.js` · bootstrap · uses 0 · used by 0
355. `thingsboard.directives.ledLight` module — `src/app/components/led-light.directive.js` · bootstrap · uses 0 · used by 0
356. `thingsboard.directives.legend` module — `src/app/components/legend.directive.js` · bootstrap · uses 0 · used by 0
357. `thingsboard.directives.legendConfig` module — `src/app/components/legend-config.directive.js` · bootstrap · uses 0 · used by 0
358. `thingsboard.directives.materialIconSelect` module — `src/app/components/material-icon-select.directive.js` · bootstrap · uses 0 · used by 0
359. `thingsboard.directives.mdChipDraggable` module — `src/app/components/md-chip-draggable.directive.js` · bootstrap · uses 0 · used by 0
360. `thingsboard.directives.menuLink` module — `src/app/components/menu-link.directive.js` · bootstrap · uses 0 · used by 0
361. `thingsboard.directives.mousepointMenu` module — `src/app/components/mousepoint-menu.directive.js` · bootstrap · uses 0 · used by 0
362. `thingsboard.directives.navTree` module — `src/app/components/nav-tree.directive.js` · bootstrap · uses 0 · used by 0
363. `thingsboard.directives.noAnimate` module — `src/app/components/no-animate.directive.js` · bootstrap · uses 0 · used by 0
364. `thingsboard.directives.relatedEntityAutocomplete` module — `src/app/components/related-entity-autocomplete.directive.js` · bootstrap · uses 0 · used by 0
365. `thingsboard.directives.scopeElement` module — `src/app/components/scope-element.directive.js` · bootstrap · uses 0 · used by 0
366. `thingsboard.directives.sideMenu` module — `src/app/components/side-menu.directive.js` · bootstrap · uses 0 · used by 0
367. `thingsboard.directives.socialsharePanel` module — `src/app/components/socialshare-panel.directive.js` · bootstrap · uses 0 · used by 0
368. `thingsboard.directives.timeinterval` module — `src/app/components/timeinterval.directive.js` · bootstrap · uses 0 · used by 0
369. `thingsboard.directives.timewindow` module — `src/app/components/timewindow.directive.js` · bootstrap · uses 0 · used by 0
370. `thingsboard.directives.usermenu` module — `src/app/layout/user-menu.directive.js` · bootstrap · uses 0 · used by 0
371. `thingsboard.directives.widget` module — `src/app/components/widget/widget.directive.js` · bootstrap · uses 0 · used by 0
372. `thingsboard.directives.widgetActions` module — `src/app/components/widget/action/manage-widget-actions.directive.js` · bootstrap · uses 0 · used by 0
373. `thingsboard.directives.widgetConfig` module — `src/app/components/widget/widget-config.directive.js` · bootstrap · uses 0 · used by 0
374. `thingsboard.directives.widgetsBundleSelect` module — `src/app/components/widgets-bundle-select.directive.js` · bootstrap · uses 0 · used by 0
375. `thingsboard.entity` module — `src/app/entity/index.js` · bootstrap · uses 0 · used by 0
376. `thingsboard.entityView` module — `src/app/entity-view/index.js` · bootstrap · uses 0 · used by 0
377. `thingsboard.event` module — `src/app/event/index.js` · bootstrap · uses 0 · used by 0
378. `thingsboard.extension` module — `src/app/extension/index.js` · bootstrap · uses 0 · used by 0
379. `thingsboard.filters.contactShort` module — `src/app/components/contact-short.filter.js` · bootstrap · uses 0 · used by 0
380. `thingsboard.filters.keyboardShortcut` module — `src/app/components/keyboard-shortcut.filter.js` · bootstrap · uses 0 · used by 0
381. `thingsboard.filters.truncate` module — `src/app/components/truncate.filter.js` · bootstrap · uses 0 · used by 0
382. `thingsboard.help` module — `src/app/help/help-links.constant.js` · bootstrap · uses 0 · used by 0
383. `thingsboard.home` module — `src/app/layout/index.js` · bootstrap · uses 0 · used by 0
384. `thingsboard.homeLinks` module — `src/app/home/index.js` · bootstrap · uses 0 · used by 0
385. `thingsboard.importexport` module — `src/app/import-export/index.js` · bootstrap · uses 0 · used by 0
386. `thingsboard.itembuffer` module — `src/app/services/item-buffer.service.js` · bootstrap · uses 0 · used by 0
387. `thingsboard.jsonform` module — `src/app/jsonform/index.js` · bootstrap · uses 0 · used by 0
388. `thingsboard.locale` module — `src/app/locale/translate-handler.js` · bootstrap · uses 0 · used by 0
389. `thingsboard.login` module — `src/app/login/index.js` · bootstrap · uses 0 · used by 0
390. `thingsboard.menu` module — `src/app/services/menu.service.js` · bootstrap · uses 0 · used by 0
391. `thingsboard.profile` module — `src/app/profile/index.js` · bootstrap · uses 0 · used by 0
392. `thingsboard.queue` module — `src/app/components/queue/index.js` · bootstrap · uses 0 · used by 0
393. `thingsboard.raf` module — `src/app/common/raf.provider.js` · bootstrap · uses 0 · used by 0
394. `thingsboard.ruleChain` module — `src/app/rulechain/index.js` · bootstrap · uses 0 · used by 0
395. `thingsboard.tenant` module — `src/app/tenant/index.js` · bootstrap · uses 0 · used by 0
396. `thingsboard.thirdpartyFix` module — `src/app/common/thirdparty-fix.js` · bootstrap · uses 0 · used by 0
397. `thingsboard.toast` module — `src/app/services/toast.js` · bootstrap · uses 0 · used by 0
398. `thingsboard.types` module — `src/app/common/types.constant.js` · bootstrap · uses 0 · used by 0
399. `thingsboard.user` module — `src/app/user/index.js` · bootstrap · uses 0 · used by 0
400. `thingsboard.utils` module — `src/app/common/utils.service.js` · bootstrap · uses 0 · used by 0
401. `thingsboard.widget-library` module — `src/app/widget/index.js` · bootstrap · uses 0 · used by 0
402. `thingsboard.widgets.alarmsTableWidget` module — `src/app/widget/lib/alarms-table-widget.js` · bootstrap · uses 0 · used by 0
403. `thingsboard.widgets.dateRangeNavigator` module — `src/app/widget/lib/date-range-navigator/date-range-navigator.js` · bootstrap · uses 0 · used by 0
404. `thingsboard.widgets.entitiesHierarchyWidget` module — `src/app/widget/lib/entities-hierarchy-widget.js` · bootstrap · uses 0 · used by 0
405. `thingsboard.widgets.entitiesTableWidget` module — `src/app/widget/lib/entities-table-widget.js` · bootstrap · uses 0 · used by 0
406. `thingsboard.widgets.extensionsTableWidget` module — `src/app/widget/lib/extensions-table-widget.js` · bootstrap · uses 0 · used by 0
407. `thingsboard.widgets.multipleInputWidget` module — `src/app/widget/lib/multiple-input-widget.js` · bootstrap · uses 0 · used by 0
408. `thingsboard.widgets.rpc` module — `src/app/widget/lib/rpc/index.js` · bootstrap · uses 0 · used by 0
409. `thingsboard.widgets.rpc.knob` module — `src/app/widget/lib/rpc/knob.directive.js` · bootstrap · uses 0 · used by 0
410. `thingsboard.widgets.rpc.ledIndicator` module — `src/app/widget/lib/rpc/led-indicator.directive.js` · bootstrap · uses 0 · used by 0
411. `thingsboard.widgets.rpc.roundSwitch` module — `src/app/widget/lib/rpc/round-switch.directive.js` · bootstrap · uses 0 · used by 0
412. `thingsboard.widgets.rpc.switch` module — `src/app/widget/lib/rpc/switch.directive.js` · bootstrap · uses 0 · used by 0
413. `thingsboard.widgets.timeseriesTableWidget` module — `src/app/widget/lib/timeseries-table-widget.js` · bootstrap · uses 0 · used by 0
414. `thingsboard.widgets.tripAnimation` module — `src/app/widget/lib/tripAnimation/trip-animation-widget.js` · bootstrap · uses 0 · used by 0
415. `thingsboard.widgets.webCameraWidget` module — `src/app/widget/lib/web-camera-input-widget.js` · bootstrap · uses 0 · used by 0
