# Old vs new, function by function (S7b)

708 pairs compared (0 too large to send). Jev requests: 390 sent, 0 from cache, 0 errors.

**Can the check fail?** 40 seeded breaks of real ports (a call dropped, a condition flipped, a literal changed, a `finally` removed). A pair fails below 0.3: 35 of the breaks fail, and 32 of 708 real pairs.

| Fail below | Breaks caught | Real pairs flagged |
|---|---|---|
| 0.1 | 27 of 40 | 6 of 708 |
| 0.2 | 33 of 40 | 12 of 708 |
| 0.3 | 35 of 40 | 32 of 708 |
| 0.4 | 35 of 40 | 72 of 708 |
| 0.5 | 39 of 40 | 122 of 708 |
| 0.6 | 40 of 40 | 190 of 708 |
| 0.7 | 40 of 40 | 310 of 708 |

| Break | Sent | Caught < 0.5 | Caught < 0.7 |
|---|---|---|---|
| change_literal | 11 | 11 | 11 |
| drop_call | 18 | 18 | 18 |
| flip_condition | 11 | 10 | 11 |

Pairs by band: {"fail":32,"pass":586,"review":90}. Pairs whose literals differ: 11.

## fail — 32

- `recompile` → `recompile` in `ReactSchemaForm` · score 0.29 · same_behaviour 0.29, nothing_missing 0.65, nothing_added 0.58
- `objectHashCode` → `objectHashCode` in `utils` · score 0.14 · same_behaviour 0.14, nothing_missing 0.24, nothing_added 0.51
- `cleanCopy` → `cleanCopy` in `utils` · score 0.20 · same_behaviour 0.20, nothing_missing 0.39, nothing_added 0.69
- `objToBase64` → `objToBase64` in `utils` · score 0.18 · same_behaviour 0.18, nothing_missing 0.25, nothing_added 0.67
- `base64toObj` → `base64toObj` in `utils` · score 0.18 · same_behaviour 0.18, nothing_missing 0.20, nothing_added 0.67
- `cancelPollAlarms` → `cancelPollAlarms` in `alarmService` · score 0.21 · same_behaviour 0.21, nothing_missing 0.29, nothing_added 0.65
- `unsubscribeFromAlarms` → `unsubscribeFromAlarms` in `alarmService` · score 0.28 · same_behaviour 0.28, nothing_missing 0.51, nothing_added 0.64
- `this.$get` → `$get` in `tbRaf` · score 0.08 · same_behaviour 0.11, nothing_missing 0.08, nothing_added 0.48
- `notifyUserLoaded` → `notifyUserLoaded` in `userService` · score 0.27 · same_behaviour 0.27, nothing_missing 0.68, nothing_added 0.69
- `onError` → `onError` in `telemetryWebsocketService` · score 0.27 · same_behaviour 0.27, nothing_missing 0.37, nothing_added 0.57, same_errors 0.30
- `eas.subscriptionCallback` → `subscriptionCallback` in `attributeService` · score 0.25 · same_behaviour 0.25, nothing_missing 0.51, nothing_added 0.43
- `eas.subscriptionCallback` → `subscriptionCallback` in `attributeService` · score 0.29 · same_behaviour 0.29, nothing_missing 0.56, nothing_added 0.44
- `onData` → `onData` in `datasourceService` · score 0.04 · same_behaviour 0.04, nothing_missing 0.04, nothing_added 0.16 · literals missing: 0, 1, _
- `createWidgetTypeFunction` → `createWidgetTypeFunction` in `widgetService` · score 0.22 · same_behaviour 0.22, nothing_missing 0.48, nothing_added 0.49, same_errors 0.60
- `serviceInstance.cancel` → `cancel` in `$mdpTimePicker` · score 0.02 · same_behaviour 0.04, nothing_missing 0.02, nothing_added 0.34
- `cancel` → `cancel` in `$mdpTimePicker` · score 0.16 · same_behaviour 0.16, nothing_missing 0.21, nothing_added 0.59
- `this.confirm` → `confirm` in `$mdpTimePicker` · score 0.04 · same_behaviour 0.07, nothing_missing 0.04, nothing_added 0.56
- `this.$get` → `$get` in `$mdpTimePicker` · score 0.03 · same_behaviour 0.04, nothing_missing 0.03, nothing_added 0.33 · literals missing: $timeout, </md-virtual-repeat-container>, <div class="mdp-datepicker-select-year mdp-animation-zoom" layout="column" layout-align="center start" ng-if="datepicker.selectingYear">, <div flex md-virtual-repeat="item in datepicker.yearItems" md-on-demand class="repeated-year">, <div layout="column" layout-align="start center">, <md-button ng-click="datepicker.cancel()" aria-label=", <md-button ng-click="datepicker.confirm()" class="md-primary" aria-label=", <md-dialog aria-label="" class="mdp-datepicker" ng-class="{ \'portrait\': !$mdMedia(\'gt-xs\') }">, <md-dialog-content layout="row" layout-wrap>, <md-toolbar layout-align="start start" flex class="mdp-datepicker-date-wrapper md-hue-1 md-primary" layout="column">, <md-virtual-repeat-container md-auto-shrink md-top-index="datepicker.yearTopIndex">, <mdp-calendar ng-if="!datepicker.selectingYear" class="mdp-animation-zoom" date="datepicker.date" min-date="datepicker.minDate" date-filter="datepicker.dateFilter" max-date="datepicker.maxDate"></mdp-calendar>, <span class="md-button" ng-click="datepicker.selectYear(item)" md-ink-ripple ng-class="{ \'md-primary current\': item == year }">{{ item }}</span>, <span class="mdp-datepicker-date" ng-click="datepicker.showCalendar()" ng-class="{ \'active\': !datepicker.selectingYear }">{{ datepicker.date.format(datepicker.displayFormat) }}</span> , <span class="mdp-datepicker-year" ng-click="datepicker.showYear()" ng-class="{ \'active\': datepicker.selectingYear }">{{ datepicker.date.format(\'YYYY\') }}</span>, currentDate, datepicker, options
- `this.$get` → `$get` in `$mdpTimePicker` · score 0.24 · same_behaviour 0.24, nothing_missing 0.33, nothing_added 0.43
- `scope.openEditMode` → `openEditMode` in `milliSecondsToTimeString` · score 0.29 · same_behaviour 0.29, nothing_missing 0.63, nothing_added 0.56 · literals missing: 0
- `isTimewindowDisabled` → `isTimewindowDisabled` in `milliSecondsToTimeString` · score 0.09 · same_behaviour 0.13, nothing_missing 0.09, nothing_added 0.35
- `onShowingCallback.onShowing` → `onShowing` in `tbAlarmsTableWidget` · score 0.16 · same_behaviour 0.16, nothing_missing 0.33, nothing_added 0.21
- `scope.keysSearch` → `keysSearch` in `tbDatakeyConfig` · score 0.25 · same_behaviour 0.25, nothing_missing 0.49, nothing_added 0.54
- `updateIsOpen` → `updateIsOpen` in `tbDetailsSidenav` · score 0.20 · same_behaviour 0.28, nothing_missing 0.20, nothing_added 0.60
- `renderExpandButton` → `renderExpandButton` in `tbExpandFullscreen` · score 0.24 · same_behaviour 0.24, nothing_missing 0.66, nothing_added 0.52
- `scope.updateView` → `updateView` in `tbGatewayConfigSelect` · score 0.28 · same_behaviour 0.28, nothing_missing 0.62
- `scope.validate` → `validate` in `tbJsonContent` · score 0.23 · same_behaviour 0.23, nothing_missing 0.42, nothing_added 0.48, same_errors 0.47
- `scope.minifyJSON` → `minifyJSON` in `tbJsonObjectEdit` · score 0.29 · same_behaviour 0.29, nothing_missing 0.39, nothing_added 0.67
- `scope.validate` → `validate` in `tbJsonObjectEdit` · score 0.15 · same_behaviour 0.15, nothing_missing 0.22, nothing_added 0.50, same_errors 0.42
- `into` → `into` in `tbJsonToString` · score 0.26 · same_behaviour 0.26, nothing_missing 0.44, nothing_added 0.66, same_errors 0.48
- `out` → `out` in `tbJsonToString` · score 0.24 · same_behaviour 0.24, nothing_missing 0.42, nothing_added 0.65, same_errors 0.51
- `scope.openEditMode` → `openEditMode` in `tbLegendConfig` · score 0.28 · same_behaviour 0.28, nothing_missing 0.58, nothing_added 0.57 · literals missing: 0

## review — 90

- `scope.openIconDialog` → `openIconDialog` in `ReactSchemaForm` · score 0.33 · same_behaviour 0.33, nothing_missing 0.59, nothing_added 0.64 · literals missing: 0
- `scope.updateValues` → `updateValues` in `ReactSchemaForm` · score 0.31 · same_behaviour 0.31, nothing_missing 0.63, nothing_added 0.57
- `getMaterialIcons` → `getMaterialIcons` in `utils` · score 0.39 · same_behaviour 0.44, nothing_missing 0.39
- `deleteNullProperties` → `deleteNullProperties` in `utils` · score 0.36 · same_behaviour 0.41, nothing_missing 0.36, nothing_added 0.67
- `getDefaultDatasource` → `getDefaultDatasource` in `utils` · score 0.43 · same_behaviour 0.43, nothing_missing 0.67
- `getDefaultDatasourceJson` → `getDefaultDatasourceJson` in `utils` · score 0.33 · same_behaviour 0.33, nothing_missing 0.45, nothing_added 0.65
- `initDefaultAlarmDataKeys` → `initDefaultAlarmDataKeys` in `utils` · score 0.42 · same_behaviour 0.42, nothing_missing 0.61, nothing_added 0.57
- `getDefaultAlarmDataKeys` → `getDefaultAlarmDataKeys` in `utils` · score 0.40 · same_behaviour 0.40
- `insertVariable` → `insertVariable` in `utils` · score 0.39 · same_behaviour 0.39, nothing_missing 0.54
- `checkUpdates` → `checkUpdates` in `adminService` · score 0.49 · same_behaviour 0.49, nothing_missing 0.62, nothing_added 0.69
- `subscribeForAlarms` → `subscribeForAlarms` in `alarmService` · score 0.41 · same_behaviour 0.41, nothing_missing 0.47
- `getCustomer` → `getCustomer` in `customerService` · score 0.49 · same_behaviour 0.49, nothing_missing 0.67
- `getDashboard` → `getDashboard` in `dashboardService` · score 0.47 · same_behaviour 0.47, nothing_missing 0.67, nothing_added 0.68
- `getDashboardInfo` → `getDashboardInfo` in `dashboardService` · score 0.37 · same_behaviour 0.37, nothing_missing 0.59, nothing_added 0.61
- `updateDashboardCustomers` → `updateDashboardCustomers` in `dashboardService` · score 0.48 · same_behaviour 0.48, nothing_missing 0.66, nothing_added 0.64
- `addDashboardCustomers` → `addDashboardCustomers` in `dashboardService` · score 0.45 · same_behaviour 0.45, nothing_missing 0.65, nothing_added 0.59
- `getTenantDashboards` → `getTenantDashboards` in `dashboardService` · score 0.46 · same_behaviour 0.46, nothing_missing 0.65
- `getCustomerDashboards` → `getCustomerDashboards` in `dashboardService` · score 0.46 · same_behaviour 0.46, nothing_missing 0.63
- `saveDashboard` → `saveDashboard` in `dashboardService` · score 0.48 · same_behaviour 0.48, nothing_missing 0.62
- `findInfoByFrom` → `findInfoByFrom` in `entityRelationService` · score 0.41 · same_behaviour 0.41, nothing_missing 0.61, nothing_added 0.63
- `resolveRuleNodeComponentUiResources` → `resolveRuleNodeComponentUiResources` in `ruleChainService` · score 0.35 · same_behaviour 0.35, nothing_missing 0.46, nothing_added 0.69, same_errors 0.45
- `resolveRuleNodeComponentsUiResources` → `resolveRuleNodeComponentsUiResources` in `ruleChainService` · score 0.38 · same_behaviour 0.38, nothing_missing 0.39, nothing_added 0.59, same_errors 0.66
- `getRuleNodeComponentByClazz` → `getRuleNodeComponentByClazz` in `ruleChainService` · score 0.35 · same_behaviour 0.35, nothing_missing 0.64, nothing_added 0.68
- `loadSystemParams` → `loadSystemParams` in `userService` · score 0.38 · same_behaviour 0.38, nothing_missing 0.41, nothing_added 0.62
- `gotoDefaultPlace` → `gotoDefaultPlace` in `userService` · score 0.35 · same_behaviour 0.35, nothing_missing 0.64
- `setUserFromJwtToken` → `setUserFromJwtToken` in `userService` · score 0.45 · same_behaviour 0.45, nothing_added 0.68
- `loadUser` → `loadUser` in `userService` · score 0.46 · same_behaviour 0.46, nothing_missing 0.64, same_errors 0.57
- `loginAsUser` → `loginAsUser` in `userService` · score 0.46 · same_behaviour 0.46, nothing_missing 0.65
- `getAssetTypes` → `getAssetTypes` in `assetService` · score 0.49 · same_behaviour 0.49, nothing_missing 0.58, nothing_added 0.67
- `onMessage` → `onMessage` in `telemetryWebsocketService` · score 0.49 · same_behaviour 0.49, nothing_missing 0.58
- `onOpen` → `onOpen` in `telemetryWebsocketService` · score 0.34 · same_behaviour 0.34, nothing_missing 0.48
- `tryOpenSocket` → `tryOpenSocket` in `telemetryWebsocketService` · score 0.40 · same_behaviour 0.40, nothing_missing 0.44, same_errors 0.65
- `eas.subscriptionCallback` → `subscriptionCallback` in `attributeService` · score 0.34 · same_behaviour 0.39, nothing_missing 0.34, nothing_added 0.54
- `subscribeToDatasource` → `subscribeToDatasource` in `datasourceService` · score 0.35 · same_behaviour 0.35, nothing_missing 0.68, nothing_added 0.51
- `getDevices` → `getDevices` in `deviceService` · score 0.49 · same_behaviour 0.49, nothing_missing 0.69
- `getDeviceCredentials` → `getDeviceCredentials` in `deviceService` · score 0.39 · same_behaviour 0.39, nothing_missing 0.45, nothing_added 0.65
- `getEntityPromise` → `getEntityPromise` in `entityService` · score 0.45 · same_behaviour 0.49, nothing_missing 0.45, nothing_added 0.58
- `getEntitiesByIdsPromise` → `getEntitiesByIdsPromise` in `entityService` · score 0.45 · same_behaviour 0.57, nothing_missing 0.45, same_errors 0.69
- `getEntitiesPromise` → `getEntitiesPromise` in `entityService` · score 0.37 · same_behaviour 0.37, nothing_missing 0.44, nothing_added 0.62
- `getEntitiesByPageLinkPromise` → `getEntitiesByPageLinkPromise` in `entityService` · score 0.42 · same_behaviour 0.51, nothing_missing 0.42
- `doSendPackedRequests` → `doSendPackedRequests` in `entityService` · score 0.31 · same_behaviour 0.41, nothing_missing 0.31, nothing_added 0.62, same_errors 0.66
- `deleteRelatedEntity` → `deleteRelatedEntity` in `entityService` · score 0.49 · same_behaviour 0.49, nothing_missing 0.59, same_errors 0.63
- `saveEntityParameters` → `saveEntityParameters` in `entityService` · score 0.33 · same_behaviour 0.39, nothing_missing 0.50, nothing_added 0.68, same_errors 0.33
- `addRelatedEntity` → `addRelatedEntity` in `entityService` · score 0.44 · same_behaviour 0.44, nothing_missing 0.65
- `getRelatedEntities` → `getRelatedEntities` in `entityService` · score 0.46 · same_behaviour 0.46, nothing_missing 0.58, nothing_added 0.68, same_errors 0.57
- `initWidgetPlaceholders` → `initWidgetPlaceholders` in `widgetService` · score 0.45 · same_behaviour 0.45, nothing_missing 0.69
- `processWidgetLoadError` → `processWidgetLoadError` in `widgetService` · score 0.39 · same_behaviour 0.39, nothing_missing 0.59, nothing_added 0.60
- `copyRuleNodes` → `copyRuleNodes` in `itembuffer` · score 0.31 · same_behaviour 0.31, nothing_missing 0.42, nothing_added 0.65
- `pasteRuleNodes` → `pasteRuleNodes` in `itembuffer` · score 0.46 · same_behaviour 0.46, nothing_missing 0.56
- `copyWidget` → `copyWidget` in `itembuffer` · score 0.40 · same_behaviour 0.40, nothing_missing 0.66
- `copyWidgetReference` → `copyWidgetReference` in `itembuffer` · score 0.41 · same_behaviour 0.41, nothing_missing 0.67
- `canPasteWidgetReference` → `canPasteWidgetReference` in `itembuffer` · score 0.38 · same_behaviour 0.38, nothing_missing 0.48
- `createEntityAliasName` → `createEntityAliasName` in `itembuffer` · score 0.36 · same_behaviour 0.36, nothing_missing 0.47, nothing_added 0.48
- `updateAliases` → `updateAliases` in `itembuffer` · score 0.48 · same_behaviour 0.48, nothing_missing 0.56
- `sectionHeight` → `sectionHeight` in `menu` · score 0.39 · same_behaviour 0.39, nothing_missing 0.64, nothing_added 0.50
- `sectionActive` → `sectionActive` in `menu` · score 0.47 · same_behaviour 0.47
- `scope.updateDisplayValue` → `updateDisplayValue` in `milliSecondsToTimeString` · score 0.49 · same_behaviour 0.49, nothing_missing 0.68
- `initContent` → `initContent` in `range` · score 0.31 · same_behaviour 0.31, nothing_missing 0.63, nothing_added 0.64
- `$window.onbeforeunload` → `onbeforeunload` in `tbConfirmOnExit` · score 0.48 · same_behaviour 0.48, nothing_missing 0.59
- `initSplitLayout` → `initSplitLayout` in `tbCustomActionPrettyEditor` · score 0.31 · same_behaviour 0.31, nothing_missing 0.48, nothing_added 0.63
- `toggleFullscreen` → `toggleFullscreen` in `tbCustomActionPrettyEditor` · score 0.42 · same_behaviour 0.42, nothing_missing 0.67, nothing_added 0.65
- `scope.fetchDashboards` → `fetchDashboards` in `tbDashboardAutocomplete` · score 0.44 · same_behaviour 0.44, nothing_missing 0.60, nothing_added 0.57, same_errors 0.69
- `scope.transformAlarmDataKeyChip` → `transformAlarmDataKeyChip` in `tbDatasourceEntity` · score 0.34 · same_behaviour 0.34, nothing_added 0.57
- `scope.editDataKey` → `editDataKey` in `tbDatasourceEntity` · score 0.40 · same_behaviour 0.40, nothing_missing 0.67 · literals missing: 0
- `onComplete` → `onComplete` in `tbDatasourceEntity` · score 0.30 · same_behaviour 0.34, nothing_missing 0.30
- `scope.dataKeysSearch` → `dataKeysSearch` in `tbDatasourceEntity` · score 0.34 · same_behaviour 0.34, nothing_missing 0.62, nothing_added 0.60, same_errors 0.63
- `scope.transformFuncDataKeyChip` → `transformFuncDataKeyChip` in `tbDatasourceFunc` · score 0.40 · same_behaviour 0.40
- `scope.transformAlarmDataKeyChip` → `transformAlarmDataKeyChip` in `tbDatasourceFunc` · score 0.38 · same_behaviour 0.38, nothing_added 0.67
- `scope.editDataKey` → `editDataKey` in `tbDatasourceFunc` · score 0.30 · same_behaviour 0.30, nothing_missing 0.60, nothing_added 0.68 · literals missing: 0
- `onComplete` → `onComplete` in `tbDatasourceFunc` · score 0.31 · same_behaviour 0.43, nothing_missing 0.31, nothing_added 0.67
- `scope.toggleDetailsEditMode` → `toggleDetailsEditMode` in `tbDetailsSidenav` · score 0.36 · same_behaviour 0.36, nothing_missing 0.68
- `scope.detailsApply` → `detailsApply` in `tbDetailsSidenav` · score 0.32 · same_behaviour 0.32, nothing_missing 0.52, nothing_added 0.67
- `scope.closeDetails` → `closeDetails` in `tbDetailsSidenav` · score 0.44 · same_behaviour 0.44, nothing_missing 0.69
- `scope.updateValidity` → `updateValidity` in `tbEntityAliasSelect` · score 0.45 · same_behaviour 0.45, nothing_missing 0.64, nothing_added 0.66
- `scope.createEntityAlias` → `createEntityAlias` in `tbEntityAliasSelect` · score 0.42 · same_behaviour 0.42, nothing_missing 0.57, same_errors 0.67
- `scope.updateValidity` → `updateValidity` in `tbGatewayConfigSelect` · score 0.41 · same_behaviour 0.41, nothing_missing 0.61
- `scope.createNewGatewayDialog` → `createNewGatewayDialog` in `tbGatewayConfigSelect` · score 0.39 · same_behaviour 0.39
- `scope.minifyJSON` → `minifyJSON` in `tbJsonContent` · score 0.43 · same_behaviour 0.51, nothing_missing 0.43, nothing_added 0.66
- `scope.beautifyJSON` → `beautifyJSON` in `tbJsonObjectEdit` · score 0.31 · same_behaviour 0.31, nothing_missing 0.41
- `ngModelCtrl.$render` → `$render` in `tbJsonObjectEdit` · score 0.32 · same_behaviour 0.32, nothing_missing 0.48
- `scope.showError` → `showError` in `tbJsonObjectEdit` · score 0.49 · same_behaviour 0.49
- `scope.update` → `update` in `tbLedLight` · score 0.41 · same_behaviour 0.41, nothing_added 0.58
- `scope.openIconDialog` → `openIconDialog` in `tbMaterialIconSelect` · score 0.35 · same_behaviour 0.35, nothing_missing 0.65, nothing_added 0.69 · literals missing: 0
- `loadFromWidgetInfo` → `loadFromWidgetInfo` in `tbWidget` · score 0.49 · same_behaviour 0.49
- `scope.updateSchemaForm` → `updateSchemaForm` in `tbWidgetConfig` · score 0.44 · same_behaviour 0.44, nothing_added 0.65
- `ngModelCtrl.$render` → `$render` in `tbWidgetConfig` · score 0.42 · same_behaviour 0.42, nothing_missing 0.59
- `scope.updateValidity` → `updateValidity` in `tbWidgetConfig` · score 0.31 · same_behaviour 0.31, nothing_missing 0.60, same_errors 0.67
- `scope.addDatasource` → `addDatasource` in `tbWidgetConfig` · score 0.48 · same_behaviour 0.48
- `vm.hide` → `hide` in `DatakeyConfigDialogController` · score 0.43 · same_behaviour 0.43, nothing_missing 0.65
- `vm.cancel` → `cancel` in `DatakeyConfigDialogController` · score 0.35 · same_behaviour 0.35, nothing_missing 0.62

