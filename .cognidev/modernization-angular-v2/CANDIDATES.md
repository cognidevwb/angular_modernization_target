# Candidate ledger (S2)

Source: `angular.json` spec 6 · flavor angularjs · merkle root `8cafda1475082c504ed86726d312fcd82ba7f4bcde48374934cc26a38b09f3ee`

**140 files need migration** (0 of them templates), out of 172 files and 440 units.

| Disposition | Units | Files | What happens |
|---|---|---|---|
| `legacy_migrate` | 415 | 140 | port to Angular |
| `parallel_implementations` | 0 | 0 | an Angular replacement exists; converge on one |
| `modern_exposed_to_legacy` | 0 | 0 | keep; drop its downgrade when the last AngularJS consumer is gone |
| `modern_target_upgrade` | 0 | 0 | keep; carried by the version upgrade |
| `bridge_glue` | 0 | 7 | delete when its last edge is gone |
| `exclude_orphaned` | 0 | 0 | never loaded; report for deletion |
| `exclude_vendor_or_generated` | 0 | 0 | not first-party source |
| `unresolved` | 25 | 25 | facts missing or conflicting; review |

## Not assessed yet

- modern_with_legacy_residue: angular.json has no per-file $scope / $q / upgraded-provider facts for Angular files
- incomplete_migration: needs a baseline build; this project has none recorded
- legacy_behind_wrapper: UpgradeComponent wrappers do not record which AngularJS directive they wrap; wrappers are listed as bridge_glue
- exclude_orphaned (dead code) below module level: S0's template edges miss attribute directives, ng-include / template-cache templates and upgrade wrappers, so `no_recorded_use` is not evidence of dead code (on AWB, 7 of 8 sampled units flagged this way are used)

## `legacy_migrate` — 415 units (port to Angular)

**src/app/**

- `app.js` — `thingsboard` module; `<config@107>` config; `globalInterceptor` factory; `<run@107>` run

**src/app/admin/**

- `admin.routes.js` — `home.settings.general` ui-router; `home.settings.outgoing-mail` ui-router; `home.settings.security-settings` ui-router; `home.settings` ui-router
- `index.js` — `thingsboard.admin` module; `<config@27>` config; `AdminController` controller; `SecuritySettingsController` controller

**src/app/alarm/**

- `index.js` — `thingsboard.alarm` module; `AlarmDetailsDialogController` controller; `tbAlarmHeader` directive; `tbAlarmRow` directive; `tbAlarmTable` directive

**src/app/api/**

- `admin.service.js` — `thingsboard.api.admin` module; `adminService` factory
- `alarm.service.js` — `thingsboard.api.alarm` module; `alarmService` factory
- `asset.service.js` — `thingsboard.api.asset` module; `assetService` factory
- `attribute.service.js` — `thingsboard.api.attribute` module; `attributeService` factory
- `audit-log.service.js` — `thingsboard.api.auditLog` module; `auditLogService` factory
- `component-descriptor.service.js` — `thingsboard.api.componentDescriptor` module; `componentDescriptorService` factory
- `customer.service.js` — `thingsboard.api.customer` module; `customerService` factory
- `dashboard.service.js` — `thingsboard.api.dashboard` module; `dashboardService` factory
- `datasource.service.js` — `thingsboard.api.datasource` module; `datasourceService` factory
- `device.service.js` — `thingsboard.api.device` module; `deviceService` factory
- `entity-relation.service.js` — `thingsboard.api.entityRelation` module; `entityRelationService` factory
- `entity-view.service.js` — `thingsboard.api.entityView` module; `entityViewService` factory
- `entity.service.js` — `thingsboard.api.entity` module; `entityService` factory
- `event.service.js` — `thingsboard.api.event` module; `eventService` factory
- `login.service.js` — `thingsboard.api.login` module; `loginService` factory
- `queue.service.js` — `thingsboard.api.queue` module; `queueService` factory
- `rule-chain.service.js` — `thingsboard.api.ruleChain` module; `ruleChainService` factory
- `telemetry-websocket.service.js` — `thingsboard.api.telemetryWebsocket` module; `telemetryWebsocketService` factory
- `tenant.service.js` — `thingsboard.api.tenant` module; `tenantService` factory
- `time.service.js` — `thingsboard.api.time` module; `timeService` factory
- `user.service.js` — `thingsboard.api.user` module; `userService` factory
- `widget.service.js` — `thingsboard.api.widget` module; `widgetService` factory

**src/app/asset/**

- `asset.routes.js` — `home.assets` ui-router; `home.customers.assets` ui-router
- `index.js` — `thingsboard.asset` module; `<config@28>` config; `AddAssetsToCustomerController` controller; `AssetCardController` controller; `AssetController` controller; `AssignAssetToCustomerController` controller; `tbAsset` directive

**src/app/audit/**

- `audit-log.routes.js` — `home.auditLogs` ui-router
- `index.js` — `thingsboard.auditLog` module; `<config@23>` config; `AuditLogDetailsDialogController` controller; `AuditLogsController` controller; `tbAuditLogHeader` directive; `tbAuditLogRow` directive; `tbAuditLogTable` directive

**src/app/common/**

- `dashboard-utils.service.js` — `thingsboard.dashboardUtils` module; `dashboardUtils` factory
- `raf.provider.js` — `thingsboard.raf` module; `tbRaf` provider
- `thirdparty-fix.js` — `thingsboard.thirdpartyFix` module; `$mdColorPicker` factory; `Fullscreen` factory; `$mdpDatePicker` provider; `$mdpTimePicker` provider
- `types.constant.js` — `thingsboard.types` module; `types` constant
- `utils.service.js` — `thingsboard.utils` module; `utils` factory

**src/app/components/**

- `circular-progress.directive.js` — `thingsboard.directives.circularProgress` module; `tbCircularProgress` directive
- `confirm-on-exit.directive.js` — `thingsboard.directives.confirmOnExit` module; `tbConfirmOnExit` directive
- `contact-short.filter.js` — `thingsboard.filters.contactShort` module; `contactShort` filter
- `contact.directive.js` — `thingsboard.directives.contact` module; `tbContact` directive
- `dashboard-autocomplete.directive.js` — `thingsboard.directives.dashboardAutocomplete` module; `tbDashboardAutocomplete` directive
- `dashboard-select.directive.js` — `thingsboard.directives.dashboardSelect` module; `DashboardSelectPanelController` controller; `tbDashboardSelect` directive
- `dashboard.directive.js` — `thingsboard.directives.dashboard` module; `tbDashboard` directive
- `datakey-config-dialog.controller.js` — `thingsboard.dialogs.datakeyConfigDialog` module; `DatakeyConfigDialogController` controller
- `datakey-config.directive.js` — `thingsboard.directives.datakeyConfig` module; `tbDatakeyConfig` directive
- `datasource-entity.directive.js` — `thingsboard.directives.datasourceEntity` module; `tbDatasourceEntity` directive
- `datasource-func.directive.js` — `thingsboard.directives.datasourceFunc` module; `tbDatasourceFunc` directive
- `datasource.directive.js` — `thingsboard.directives.datasource` module; `tbDatasource` directive
- `datetime-period.directive.js` — `thingsboard.directives.datetimePeriod` module; `tbDatetimePeriod` directive
- `details-sidenav.directive.js` — `thingsboard.directives.detailsSidenav` module; `tbDetailsSidenav` directive
- `entity-alias-select.directive.js` — `thingsboard.directives.entityAliasSelect` module; `tbEntityAliasSelect` directive
- `expand-fullscreen.directive.js` — `thingsboard.directives.expandFullscreen` module; `tbExpandFullscreen` directive
- `finish-render.directive.js` — `thingsboard.directives.finishRender` module; `tbOnFinishRender` directive
- `grid.directive.js` — `thingsboard.directives.grid` module; `AddItemController` controller; `ItemCardController` controller; `tbGrid` directive; `tbGridCardContent` directive; `range` filter
- `js-func.directive.js` — `thingsboard.directives.jsFunc` module; `tbJsFunc` directive
- `json-content.directive.js` — `thingsboard.directives.jsonContent` module; `tbJsonContent` directive
- `json-form.directive.js` — `thingsboard.directives.jsonForm` module; `MaterialIconsDialogController` controller · same name as 1 other; `tbJsonForm` directive; `ReactSchemaForm` value
- `json-object-edit.directive.js` — `thingsboard.directives.jsonObjectEdit` module; `tbJsonObjectEdit` directive
- `keyboard-shortcut.filter.js` — `thingsboard.filters.keyboardShortcut` module; `keyboardShortcut` filter
- `kv-map.directive.js` — `thingsboard.directives.keyValMap` module; `tbKeyValMap` directive
- `led-light.directive.js` — `thingsboard.directives.ledLight` module; `tbLedLight` directive
- `legend-config.directive.js` — `thingsboard.directives.legendConfig` module; `LegendConfigPanelController` controller; `tbLegendConfig` directive
- `legend.directive.js` — `thingsboard.directives.legend` module; `tbLegend` directive
- `material-icon-select.directive.js` — `thingsboard.directives.materialIconSelect` module; `MaterialIconsDialogController` controller · same name as 1 other; `tbMaterialIconSelect` directive
- `md-chip-draggable.directive.js` — `thingsboard.directives.mdChipDraggable` module; `tbChipDraggable` directive
- `menu-link.directive.js` — `thingsboard.directives.menuLink` module; `tbMenuLink` directive; `nospace` filter
- `mousepoint-menu.directive.js` — `thingsboard.directives.mousepointMenu` module; `tbMousepointMenu` directive
- `nav-tree.directive.js` — `thingsboard.directives.navTree` module; `tbNavTree` directive
- `no-animate.directive.js` — `thingsboard.directives.noAnimate` module; `tbNoAnimate` directive
- `related-entity-autocomplete.directive.js` — `thingsboard.directives.relatedEntityAutocomplete` module; `tbRelatedEntityAutocomplete` directive
- `scope-element.directive.js` — `thingsboard.directives.scopeElement` module; `tbScopeElement` directive
- `side-menu.directive.js` — `thingsboard.directives.sideMenu` module; `tbSideMenu` directive
- `socialshare-panel.directive.js` — `thingsboard.directives.socialsharePanel` module; `tbSocialSharePanel` directive
- `tb-event-directives.js` — `thingsboard.directives.event` module; `<dynamic:tbEventDirectives>` directive
- `tb-json-to-string.directive.js` — `tbJsonToString` module; `tbJsonToString` directive
- `timeinterval.directive.js` — `thingsboard.directives.timeinterval` module; `tbTimeinterval` directive
- `timewindow.directive.js` — `thingsboard.directives.timewindow` module; `TimewindowPanelController` controller; `tbTimewindow` directive; `milliSecondsToTimeString` filter
- `truncate.filter.js` — `thingsboard.filters.truncate` module; `truncate` filter
- `widgets-bundle-select.directive.js` — `thingsboard.directives.widgetsBundleSelect` module; `tbWidgetsBundleSelect` directive

**src/app/components/gateway/**

- `gateway-config-select.directive.js` — `thingsboard.directives.gatewayConfigSelect` module; `tbGatewayConfigSelect` directive
- `gateway-config.directive.js` — `thingsboard.directives.gatewayConfig` module; `tbGatewayConfig` directive
- `gateway-form.directive.js` — `thingsboard.directives.gatewayForm` module; `tbGatewayForm` directive

**src/app/components/queue/**

- `index.js` — `thingsboard.queue` module; `tbQueueTypeList` directive

**src/app/components/widget/**

- `widget-config.directive.js` — `thingsboard.directives.widgetConfig` module; `tbWidgetConfig` directive
- `widget.directive.js` — `thingsboard.directives.widget` module; `WidgetController` controller; `tbWidget` directive

**src/app/components/widget/action/**

- `custom-action-pretty-editor.directive.js` — `thingsboard.directives.customActionPrettyEditor` module; `tbCustomActionPrettyEditor` directive
- `manage-widget-actions.directive.js` — `thingsboard.directives.widgetActions` module; `WidgetActionDialogController` controller; `tbManageWidgetActions` directive

**src/app/customer/**

- `customer.routes.js` — `home.customers` ui-router
- `index.js` — `thingsboard.customer` module; `<config@26>` config; `CustomerController` controller; `tbCustomer` directive

**src/app/dashboard/**

- `dashboard.routes.js` — `dashboard` ui-router; `home.customers.dashboards.dashboard` ui-router; `home.customers.dashboards` ui-router; `home.dashboards.dashboard` ui-router; `home.dashboards` ui-router
- `index.js` — `thingsboard.dashboard` module; `<config@50>` config; `AddDashboardsToCustomerController` controller; `AddWidgetController` controller; `DashboardCardController` controller; `DashboardController` controller; `DashboardSettingsController` controller; `DashboardsController` controller; `MakeDashboardPublicDialogController` controller; `ManageAssignedCustomersController` controller; `tbDashboardDetails` directive; `tbDashboardToolbar` directive; `tbEditWidget` directive

**src/app/dashboard/layouts/**

- `index.js` — `thingsboard.dashboard.layouts` module; `ManageDashboardLayoutsController` controller; `SelectTargetLayoutController` controller; `tbDashboardLayout` directive

**src/app/dashboard/states/**

- `index.js` — `thingsboard.dashboard.states` module; `DashboardStateDialogController` controller; `ManageDashboardStatesController` controller; `SelectTargetStateController` controller; `tbStatesComponent` directive; `statesControllerService` factory

**src/app/device/**

- `device.routes.js` — `home.customers.devices` ui-router; `home.devices` ui-router
- `index.js` — `thingsboard.device` module; `<config@29>` config; `AddDevicesToCustomerController` controller; `AssignDeviceToCustomerController` controller; `DeviceCardController` controller; `DeviceController` controller; `ManageDeviceCredentialsController` controller; `tbDevice` directive

**src/app/entity/**

- `index.js` — `thingsboard.entity` module; `AddAttributeDialogController` controller; `AddWidgetToDashboardDialogController` controller; `AliasesEntitySelectPanelController` controller; `EntityAliasDialogController` controller; `EntityAliasesController` controller; `tbAliasesEntitySelect` directive; `tbAttributeTable` directive; `tbEntityAutocomplete` directive; `tbEntityFilter` directive; `tbEntityFilterView` directive; `tbEntityList` directive; `tbEntitySelect` directive; `tbEntitySubtypeAutocomplete` directive; `tbEntitySubtypeList` directive; `tbEntitySubtypeSelect` directive; `tbEntityTypeList` directive; `tbEntityTypeSelect` directive; `tbRelationFilters` directive; `tbRelationTable` directive; `tbRelationTypeAutocomplete` directive

**src/app/entity-view/**

- `entity-view.routes.js` — `home.customers.entityViews` ui-router; `home.entityViews` ui-router
- `index.js` — `thingsboard.entityView` module; `<config@28>` config; `AddEntityViewsToCustomerController` controller; `AssignEntityViewToCustomerController` controller; `EntityViewCardController` controller; `EntityViewController` controller; `tbEntityView` directive

**src/app/event/**

- `index.js` — `thingsboard.event` module; `EventContentDialogController` controller; `tbEventHeader` directive; `tbEventRow` directive; `tbEventTable` directive

**src/app/extension/**

- `index.js` — `thingsboard.extension` module; `parseToNull` directive; `tbExtensionFormHttp` directive; `tbExtensionFormModbus` directive; `tbExtensionFormMqtt` directive; `tbExtensionFormOpc` directive; `tbExtensionTable` directive

**src/app/help/**

- `help-links.constant.js` — `thingsboard.help` module; `helpLinks` constant
- `help.directive.js` — `thingsboard.directives.help` module; `tbHelp` directive

**src/app/home/**

- `home-links.routes.js` — `home.links` ui-router
- `index.js` — `thingsboard.homeLinks` module; `<config@21>` config; `HomeLinksController` controller

**src/app/import-export/**

- `index.js` — `thingsboard.importexport` module; `ImportDialogCSVController` controller; `ImportDialogController` controller; `tbTableColumnsAssignment` directive; `importExport` factory

**src/app/jsonform/**

- `index.js` — `thingsboard.jsonform` module; `<config@24>` config; `JsonFormController` controller
- `jsonform.routes.js` — `home.jsonform` ui-router

**src/app/layout/**

- `home.routes.js` — `home` ui-router
- `index.js` — `thingsboard.home` module; `<config@67>` config; `HomeController` controller; `breadcrumbIcon` filter; `breadcrumbLabel` filter
- `user-menu.directive.js` — `thingsboard.directives.usermenu` module; `tbUserMenu` directive

**src/app/locale/**

- `translate-handler.js` — `thingsboard.locale` module; `tbMissingTranslationHandler` factory

**src/app/login/**

- `index.js` — `thingsboard.login` module; `<config@29>` config; `CreatePasswordController` controller; `LoginController` controller; `ResetPasswordController` controller; `ResetPasswordRequestController` controller
- `login.routes.js` — `login.createPassword` ui-router; `login.resetExpiredPassword` ui-router; `login.resetPassword` ui-router; `login.resetPasswordRequest` ui-router; `login` ui-router

**src/app/profile/**

- `index.js` — `thingsboard.profile` module; `<config@27>` config; `ChangePasswordController` controller; `ProfileController` controller
- `profile.routes.js` — `home.profile` ui-router

**src/app/rulechain/**

- `index.js` — `thingsboard.ruleChain` module; `<config@28>` config; `AddRuleNodeController` controller; `AddRuleNodeLinkController` controller; `NodeScriptTestController` controller; `RuleChainController` controller; `RuleChainsController` controller; `tbMessageTypeAutocomplete` directive; `tbRuleChain` directive; `tbRuleNode` directive; `tbRuleNodeConfig` directive; `tbRuleNodeDefinedConfig` directive; `tbRuleNodeLink` directive; `ruleNodeScriptTest` factory
- `rulechain.routes.js` — `home.ruleChains.importRuleChain` ui-router; `home.ruleChains.ruleChain` ui-router; `home.ruleChains` ui-router

**src/app/services/**

- `clipboard.service.js` — `thingsboard.clipboard` module; `clipboardService` factory
- `item-buffer.service.js` — `thingsboard.itembuffer` module; `bufferStore` factory; `itembuffer` factory
- `menu.service.js` — `thingsboard.menu` module; `menu` factory
- `toast.js` — `thingsboard.toast` module; `ToastController` controller; `toast` factory

**src/app/tenant/**

- `index.js` — `thingsboard.tenant` module; `<config@26>` config; `TenantController` controller; `tbTenant` directive
- `tenant.routes.js` — `home.tenants` ui-router

**src/app/user/**

- `index.js` — `thingsboard.user` module; `<config@27>` config; `ActivationLinkDialogController` controller; `AddUserController` controller; `UserController` controller; `tbUser` directive
- `user.routes.js` — `home.customers.users` ui-router; `home.tenants.users` ui-router

**src/app/widget/**

- `index.js` — `thingsboard.widget-library` module; `<config@40>` config; `SaveWidgetTypeAsController` controller; `SelectWidgetTypeController` controller; `WidgetEditorController` controller; `WidgetLibraryController` controller; `WidgetsBundleController` controller; `tbWidgetsBundle` directive
- `widget-library.routes.js` — `home.widgets-bundles.widget-types.widget-type` ui-router; `home.widgets-bundles.widget-types` ui-router; `home.widgets-bundles` ui-router; `widgetEditor` ui-router

**src/app/widget/lib/**

- `alarms-table-widget.js` — `thingsboard.widgets.alarmsTableWidget` module; `tbAlarmsTableWidget` directive
- `entities-hierarchy-widget.js` — `thingsboard.widgets.entitiesHierarchyWidget` module; `tbEntitiesHierarchyWidget` directive
- `entities-table-widget.js` — `thingsboard.widgets.entitiesTableWidget` module; `tbEntitiesTableWidget` directive
- `extensions-table-widget.js` — `thingsboard.widgets.extensionsTableWidget` module; `tbExtensionsTableWidget` directive
- `multiple-input-widget.js` — `thingsboard.widgets.multipleInputWidget` module; `tbMultipleInputWidget` directive
- `timeseries-table-widget.js` — `thingsboard.widgets.timeseriesTableWidget` module; `tbTimeseriesTableWidget` directive
- `web-camera-input-widget.js` — `thingsboard.widgets.webCameraWidget` module; `tbWebCameraWidget` directive

**src/app/widget/lib/date-range-navigator/**

- `date-range-navigator.js` — `thingsboard.widgets.dateRangeNavigator` module; `dateRangeNavigatorWidget` directive

**src/app/widget/lib/rpc/**

- `index.js` — `thingsboard.widgets.rpc` module
- `knob.directive.js` — `thingsboard.widgets.rpc.knob` module; `tbKnob` directive
- `led-indicator.directive.js` — `thingsboard.widgets.rpc.ledIndicator` module; `tbLedIndicator` directive
- `round-switch.directive.js` — `thingsboard.widgets.rpc.roundSwitch` module; `tbRoundSwitch` directive
- `switch.directive.js` — `thingsboard.widgets.rpc.switch` module; `tbSwitch` directive

**src/app/widget/lib/tripAnimation/**

- `trip-animation-widget.js` — `thingsboard.widgets.tripAnimation` module; `tripAnimation` directive · same name as 1 other; `tripAnimation` filter · same name as 1 other


## `unresolved` — 25 units (facts missing or conflicting; review)

**./**

- `assetsTemplate` — `assetsTemplate` route-template
  - template file not found on disk: owned by route:angularjs:home.assets@src/app/asset/asset.routes.js:25 · owned by route:angularjs:home.customers.assets@src/app/asset/asset.routes.js:48 · reference status: missing
- `auditLogsTemplate` — `auditLogsTemplate` route-template
  - template file not found on disk: owned by route:angularjs:home.auditLogs@src/app/audit/audit-log.routes.js:25 · reference status: missing
- `createPasswordTemplate` — `createPasswordTemplate` route-template
  - template file not found on disk: owned by route:angularjs:login.createPassword@src/app/login/login.routes.js:80 · reference status: missing
- `customersTemplate` — `customersTemplate` route-template
  - template file not found on disk: owned by route:angularjs:home.customers@src/app/customer/customer.routes.js:26 · reference status: missing
- `dashboardTemplate` — `dashboardTemplate` route-template
  - template file not found on disk: owned by route:angularjs:dashboard@src/app/dashboard/dashboard.routes.js:89 · owned by route:angularjs:home.customers.dashboards.dashboard@src/app/dashboard/dashboard.routes.js:107 · owned by route:angularjs:home.dashboards.dashboard@src/app/dashboard/dashboard.routes.js:68 · owned by route:angularjs:widgetEditor@src/app/widget/widget-library.routes.js:90 · reference status: missing
- `dashboardsTemplate` — `dashboardsTemplate` route-template
  - template file not found on disk: owned by route:angularjs:home.customers.dashboards@src/app/dashboard/dashboard.routes.js:47 · owned by route:angularjs:home.dashboards@src/app/dashboard/dashboard.routes.js:26 · reference status: missing
- `devicesTemplate` — `devicesTemplate` route-template
  - template file not found on disk: owned by route:angularjs:home.customers.devices@src/app/device/device.routes.js:48 · owned by route:angularjs:home.devices@src/app/device/device.routes.js:25 · reference status: missing
- `entityViewsTemplate` — `entityViewsTemplate` route-template
  - template file not found on disk: owned by route:angularjs:home.customers.entityViews@src/app/entity-view/entity-view.routes.js:48 · owned by route:angularjs:home.entityViews@src/app/entity-view/entity-view.routes.js:25 · reference status: missing
- `generalSettingsTemplate` — `generalSettingsTemplate` route-template
  - template file not found on disk: owned by route:angularjs:home.settings.general@src/app/admin/admin.routes.js:36 · reference status: missing
- `homeLinksTemplate` — `homeLinksTemplate` route-template
  - template file not found on disk: owned by route:angularjs:home.links@src/app/home/home-links.routes.js:26 · reference status: missing
- `homeTemplate` — `homeTemplate` route-template
  - template file not found on disk: owned by route:angularjs:home@src/app/layout/home.routes.js:32 · reference status: missing
- `jsonFormTemplate` — `jsonFormTemplate` route-template
  - template file not found on disk: owned by route:angularjs:home.jsonform@src/app/jsonform/jsonform.routes.js:25 · reference status: missing
- `loginTemplate` — `loginTemplate` route-template
  - template file not found on disk: owned by route:angularjs:login@src/app/login/login.routes.js:27 · reference status: missing
- `outgoingMailSettingsTemplate` — `outgoingMailSettingsTemplate` route-template
  - template file not found on disk: owned by route:angularjs:home.settings.outgoing-mail@src/app/admin/admin.routes.js:55 · reference status: missing
- `profileTemplate` — `profileTemplate` route-template
  - template file not found on disk: owned by route:angularjs:home.profile@src/app/profile/profile.routes.js:26 · reference status: missing
- `resetPasswordRequestTemplate` — `resetPasswordRequestTemplate` route-template
  - template file not found on disk: owned by route:angularjs:login.resetPasswordRequest@src/app/login/login.routes.js:40 · reference status: missing
- `resetPasswordTemplate` — `resetPasswordTemplate` route-template
  - template file not found on disk: owned by route:angularjs:login.resetExpiredPassword@src/app/login/login.routes.js:66 · owned by route:angularjs:login.resetPassword@src/app/login/login.routes.js:53 · reference status: missing
- `ruleChainTemplate` — `ruleChainTemplate` route-template
  - template file not found on disk: owned by route:angularjs:home.ruleChains.importRuleChain@src/app/rulechain/rulechain.routes.js:86 · owned by route:angularjs:home.ruleChains.ruleChain@src/app/rulechain/rulechain.routes.js:49 · reference status: missing
- `ruleChainsTemplate` — `ruleChainsTemplate` route-template
  - template file not found on disk: owned by route:angularjs:home.ruleChains@src/app/rulechain/rulechain.routes.js:30 · reference status: missing
- `securitySettingsTemplate` — `securitySettingsTemplate` route-template
  - template file not found on disk: owned by route:angularjs:home.settings.security-settings@src/app/admin/admin.routes.js:74 · reference status: missing
- `tenantsTemplate` — `tenantsTemplate` route-template
  - template file not found on disk: owned by route:angularjs:home.tenants@src/app/tenant/tenant.routes.js:26 · reference status: missing
- `usersTemplate` — `usersTemplate` route-template
  - template file not found on disk: owned by route:angularjs:home.customers.users@src/app/user/user.routes.js:47 · owned by route:angularjs:home.tenants.users@src/app/user/user.routes.js:26 · reference status: missing
- `widgetEditorTemplate` — `widgetEditorTemplate` route-template
  - template file not found on disk: owned by route:angularjs:home.widgets-bundles.widget-types.widget-type@src/app/widget/widget-library.routes.js:68 · reference status: missing
- `widgetLibraryTemplate` — `widgetLibraryTemplate` route-template
  - template file not found on disk: owned by route:angularjs:home.widgets-bundles.widget-types@src/app/widget/widget-library.routes.js:48 · reference status: missing
- `widgetsBundlesTemplate` — `widgetsBundlesTemplate` route-template
  - template file not found on disk: owned by route:angularjs:home.widgets-bundles@src/app/widget/widget-library.routes.js:28 · reference status: missing

