# Port ledger — the AngularJS side, unit by unit

Every registration under `src/app` and the Angular file that replaces it under `src/app-ng`. Written by scaffold-units; the shape of each file is final, the body is the original carried inside for the model pass. A `TODO(port)` count is what that pass has to resolve in the file.

| Kind | Registrations | Files written |
|---|---|---|
| config | 17 | 17 |
| constant | 2 | 2 |
| controller | 74 | 74 |
| directive | 112 | 111 |
| factory | 36 | 36 |
| filter | 9 | 9 |
| provider | 3 | 3 |
| run | 1 | 1 |
| value | 1 | 1 |

| Area | Registrations | TODO(port) marks | Dependencies without a counterpart |
|---|---|---|---|
| admin | 3 | 53 | 0 |
| alarm | 4 | 22 | 0 |
| api | 22 | 116 | 2 |
| asset | 6 | 29 | 0 |
| audit | 6 | 26 | 0 |
| common | 8 | 7 | 1 |
| components | 65 | 438 | 13 |
| customer | 3 | 17 | 0 |
| dashboard | 20 | 125 | 1 |
| device | 7 | 38 | 0 |
| entity | 20 | 256 | 0 |
| entity-view | 6 | 66 | 0 |
| event | 4 | 18 | 0 |
| extension | 6 | 289 | 0 |
| help | 2 | 4 | 0 |
| home | 2 | 16 | 0 |
| import-export | 4 | 39 | 0 |
| jsonform | 2 | 10 | 0 |
| layout | 5 | 22 | 0 |
| locale | 1 | 0 | 1 |
| login | 5 | 22 | 0 |
| profile | 3 | 6 | 0 |
| root | 3 | 21 | 2 |
| rulechain | 13 | 133 | 7 |
| services | 6 | 16 | 1 |
| tenant | 3 | 17 | 0 |
| user | 5 | 25 | 1 |
| widget | 21 | 101 | 1 |

## Dependency tokens with no counterpart yet

Injected on the legacy side, and neither an Angular built-in, a downgraded modern service, nor a legacy registration this tool ported. Each needs a home before the files that inject it compile.

- `hotkeys` — injected 3 time(s)
- `saveItemFunction` — injected 2 time(s)
- `store` — injected 2 time(s)
- `/*$log, types*/` — injected 1 time(s)
- `Modelfactory` — injected 1 time(s)
- `NodeTemplatePathProvider` — injected 1 time(s)
- `aliasController` — injected 1 time(s)
- `dashboard` — injected 1 time(s)
- `dashboardTimewindow` — injected 1 time(s)
- `dashboardTimewindowApi` — injected 1 time(s)
- `flowchartConstants` — injected 1 time(s)
- `icon` — injected 1 time(s)
- `isEdit` — injected 1 time(s)
- `isMobile` — injected 1 time(s)
- `jwtHelper` — injected 1 time(s)
- `mdColorPickerHistory` — injected 1 time(s)
- `ngMdIconServiceProvider` — injected 1 time(s)
- `ruleChain` — injected 1 time(s)
- `ruleChainMetaData` — injected 1 time(s)
- `ruleNodeComponents` — injected 1 time(s)
- `stateController` — injected 1 time(s)
- `storeProvider` — injected 1 time(s)
- `visibleRect` — injected 1 time(s)
- `widget` — injected 1 time(s)
- `widgetInfo` — injected 1 time(s)
- `widgetType` — injected 1 time(s)

## Template directives left in place

- `md-autocomplete` — 14 occurrence(s), each marked with a TODO(port) comment in the converted template
- `md-chip-template` — 4 occurrence(s), each marked with a TODO(port) comment in the converted template
- `md-chips` — 8 occurrence(s), each marked with a TODO(port) comment in the converted template
- `md-expansion-panel` — 8 occurrence(s), each marked with a TODO(port) comment in the converted template
- `md-expansion-panel-collapsed` — 8 occurrence(s), each marked with a TODO(port) comment in the converted template
- `md-expansion-panel-content` — 8 occurrence(s), each marked with a TODO(port) comment in the converted template
- `md-expansion-panel-expanded` — 8 occurrence(s), each marked with a TODO(port) comment in the converted template
- `md-expansion-panel-group` — 4 occurrence(s), each marked with a TODO(port) comment in the converted template
- `md-expansion-panel-header` — 8 occurrence(s), each marked with a TODO(port) comment in the converted template
- `md-expansion-panel-icon` — 16 occurrence(s), each marked with a TODO(port) comment in the converted template
- `md-fab-actions` — 4 occurrence(s), each marked with a TODO(port) comment in the converted template
- `md-fab-speed-dial` — 3 occurrence(s), each marked with a TODO(port) comment in the converted template
- `md-fab-trigger` — 4 occurrence(s), each marked with a TODO(port) comment in the converted template
- `md-grid-list` — 2 occurrence(s), each marked with a TODO(port) comment in the converted template
- `md-grid-tile` — 2 occurrence(s), each marked with a TODO(port) comment in the converted template
- `md-item-template` — 9 occurrence(s), each marked with a TODO(port) comment in the converted template
- `md-not-found` — 5 occurrence(s), each marked with a TODO(port) comment in the converted template
- `md-sidenav` — 4 occurrence(s), each marked with a TODO(port) comment in the converted template
- `md-step` — 5 occurrence(s), each marked with a TODO(port) comment in the converted template
- `md-step-actions` — 4 occurrence(s), each marked with a TODO(port) comment in the converted template
- `md-step-body` — 5 occurrence(s), each marked with a TODO(port) comment in the converted template
- `md-table-container` — 9 occurrence(s), each marked with a TODO(port) comment in the converted template
- `md-table-pagination` — 8 occurrence(s), each marked with a TODO(port) comment in the converted template
- `md-toast` — 1 occurrence(s), each marked with a TODO(port) comment in the converted template
- `md-virtual-repeat-container` — 11 occurrence(s), each marked with a TODO(port) comment in the converted template
- `ng-cloak` — 2 occurrence(s), each marked with a TODO(port) comment in the converted template
- `ng-false-value` — 1 occurrence(s), each marked with a TODO(port) comment in the converted template
- `ng-form` — 4 occurrence(s), each marked with a TODO(port) comment in the converted template
- `ng-include` — 1 occurrence(s), each marked with a TODO(port) comment in the converted template
- `ng-message` — 232 occurrence(s), each marked with a TODO(port) comment in the converted template
- `ng-messages` — 181 occurrence(s), each marked with a TODO(port) comment in the converted template
- `ng-model-options` — 1 occurrence(s), each marked with a TODO(port) comment in the converted template
- `ng-switch-when` — 1 occurrence(s), each marked with a TODO(port) comment in the converted template
- `ng-transclude` — 3 occurrence(s), each marked with a TODO(port) comment in the converted template
- `ng-true-value` — 1 occurrence(s), each marked with a TODO(port) comment in the converted template
- `ui-sref` — 6 occurrence(s), each marked with a TODO(port) comment in the converted template
- `ui-sref-active-eq` — 1 occurrence(s), each marked with a TODO(port) comment in the converted template

## Every registration

| Kind | Name | From | To | Status | TODO(port) |
|---|---|---|---|---|---|
| config | `<config@107>` | `src/app/app.js:107` | `src/app-ng/feature/root/setup/app-config-107.setup.ts` | written | 11 |
| config | `<config@21>` | `src/app/home/index.js:21` | `src/app-ng/feature/home/setup/index-config-21.setup.ts` | written | 3 |
| config | `<config@23>` | `src/app/audit/index.js:23` | `src/app-ng/feature/audit/setup/index-config-23.setup.ts` | written | 3 |
| config | `<config@24>` | `src/app/jsonform/index.js:24` | `src/app-ng/feature/jsonform/setup/index-config-24.setup.ts` | written | 3 |
| config | `<config@26>` | `src/app/customer/index.js:26` | `src/app-ng/feature/customer/setup/index-config-26.setup.ts` | written | 3 |
| config | `<config@26>` | `src/app/tenant/index.js:26` | `src/app-ng/feature/tenant/setup/index-config-26.setup.ts` | written | 3 |
| config | `<config@27>` | `src/app/admin/index.js:27` | `src/app-ng/feature/admin/setup/index-config-27.setup.ts` | written | 3 |
| config | `<config@27>` | `src/app/profile/index.js:27` | `src/app-ng/feature/profile/setup/index-config-27.setup.ts` | written | 3 |
| config | `<config@27>` | `src/app/user/index.js:27` | `src/app-ng/feature/user/setup/index-config-27.setup.ts` | written | 3 |
| config | `<config@28>` | `src/app/asset/index.js:28` | `src/app-ng/feature/asset/setup/index-config-28.setup.ts` | written | 3 |
| config | `<config@28>` | `src/app/entity-view/index.js:28` | `src/app-ng/feature/entity-view/setup/index-config-28.setup.ts` | written | 3 |
| config | `<config@28>` | `src/app/rulechain/index.js:28` | `src/app-ng/feature/rulechain/setup/index-config-28.setup.ts` | written | 4 |
| config | `<config@29>` | `src/app/device/index.js:29` | `src/app-ng/feature/device/setup/index-config-29.setup.ts` | written | 3 |
| config | `<config@29>` | `src/app/login/index.js:29` | `src/app-ng/feature/login/setup/index-config-29.setup.ts` | written | 3 |
| config | `<config@40>` | `src/app/widget/index.js:40` | `src/app-ng/feature/widget/setup/index-config-40.setup.ts` | written | 3 |
| config | `<config@50>` | `src/app/dashboard/index.js:50` | `src/app-ng/feature/dashboard/setup/index-config-50.setup.ts` | written | 3 |
| config | `<config@67>` | `src/app/layout/index.js:67` | `src/app-ng/feature/layout/setup/index-config-67.setup.ts` | written | 4 |
| constant | `helpLinks` | `src/app/help/help-links.constant.js:55` | `src/app-ng/feature/help/constants/help-links.ts` | written | 0 |
| constant | `types` | `src/app/common/types.constant.js:16` | `src/app-ng/feature/common/constants/types.ts` | written | 0 |
| controller | `ActivationLinkDialogController` | `src/app/user/index.js:27` | `src/app-ng/feature/user/activation-link-dialog/activation-link-dialog.component.ts` | written | 1 |
| controller | `AddAssetsToCustomerController` | `src/app/asset/index.js:28` | `src/app-ng/feature/asset/add-assets-to-customer/add-assets-to-customer.component.ts` | written | 4 |
| controller | `AddAttributeDialogController` | `src/app/entity/index.js:37` | `src/app-ng/feature/entity/add-attribute-dialog/add-attribute-dialog.component.ts` | written | 18 |
| controller | `AddDashboardsToCustomerController` | `src/app/dashboard/index.js:50` | `src/app-ng/feature/dashboard/add-dashboards-to-customer/add-dashboards-to-customer.component.ts` | written | 4 |
| controller | `AddDevicesToCustomerController` | `src/app/device/index.js:29` | `src/app-ng/feature/device/add-devices-to-customer/add-devices-to-customer.component.ts` | written | 4 |
| controller | `AddEntityViewsToCustomerController` | `src/app/entity-view/index.js:28` | `src/app-ng/feature/entity-view/add-entity-views-to-customer/add-entity-views-to-customer.component.ts` | written | 4 |
| controller | `AddItemController` | `src/app/components/grid.directive.js:27` | `src/app-ng/feature/components/add-item/add-item.component.ts` | written | 2 |
| controller | `AddRuleNodeController` | `src/app/rulechain/index.js:28` | `src/app-ng/feature/rulechain/add-rule-node/add-rule-node.component.ts` | written | 1 |
| controller | `AddRuleNodeLinkController` | `src/app/rulechain/index.js:28` | `src/app-ng/feature/rulechain/add-rule-node-link/add-rule-node-link.component.ts` | written | 1 |
| controller | `AddUserController` | `src/app/user/index.js:27` | `src/app-ng/feature/user/add-user/add-user.component.ts` | written | 6 |
| controller | `AddWidgetController` | `src/app/dashboard/index.js:50` | `src/app-ng/feature/dashboard/add-widget/add-widget.component.ts` | written | 7 |
| controller | `AddWidgetToDashboardDialogController` | `src/app/entity/index.js:37` | `src/app-ng/feature/entity/add-widget-to-dashboard-dialog/add-widget-to-dashboard-dialog.component.ts` | written | 9 |
| controller | `AdminController` | `src/app/admin/index.js:27` | `src/app-ng/feature/admin/admin/admin.component.ts` | written | 5 |
| controller | `AlarmDetailsDialogController` | `src/app/alarm/index.js:21` | `src/app-ng/feature/alarm/alarm-details-dialog/alarm-details-dialog.component.ts` | written | 2 |
| controller | `AliasesEntitySelectPanelController` | `src/app/entity/index.js:37` | `src/app-ng/feature/entity/aliases-entity-select-panel/aliases-entity-select-panel.component.ts` | written | 2 |
| controller | `AssetCardController` | `src/app/asset/index.js:28` | `src/app-ng/feature/asset/asset-card/asset-card.component.ts` | written | 1 |
| controller | `AssetController` | `src/app/asset/index.js:28` | `src/app-ng/feature/asset/asset/asset.component.ts` | written | 8 |
| controller | `AssignAssetToCustomerController` | `src/app/asset/index.js:28` | `src/app-ng/feature/asset/assign-asset-to-customer/assign-asset-to-customer.component.ts` | written | 4 |
| controller | `AssignDeviceToCustomerController` | `src/app/device/index.js:29` | `src/app-ng/feature/device/assign-device-to-customer/assign-device-to-customer.component.ts` | written | 4 |
| controller | `AssignEntityViewToCustomerController` | `src/app/entity-view/index.js:28` | `src/app-ng/feature/entity-view/assign-entity-view-to-customer/assign-entity-view-to-customer.component.ts` | written | 4 |
| controller | `AuditLogDetailsDialogController` | `src/app/audit/index.js:23` | `src/app-ng/feature/audit/audit-log-details-dialog/audit-log-details-dialog.component.ts` | written | 1 |
| controller | `AuditLogsController` | `src/app/audit/index.js:23` | `src/app-ng/feature/audit/audit-logs/audit-logs.component.ts` | written | 1 |
| controller | `ChangePasswordController` | `src/app/profile/index.js:27` | `src/app-ng/feature/profile/change-password/change-password.component.ts` | written | 1 |
| controller | `CreatePasswordController` | `src/app/login/index.js:29` | `src/app-ng/feature/login/create-password/create-password.component.ts` | written | 5 |
| controller | `CustomerController` | `src/app/customer/index.js:26` | `src/app-ng/feature/customer/customer/customer.component.ts` | written | 5 |
| controller | `DashboardCardController` | `src/app/dashboard/index.js:50` | `src/app-ng/feature/dashboard/dashboard-card/dashboard-card.component.ts` | written | 1 |
| controller | `DashboardController` | `src/app/dashboard/index.js:50` | `src/app-ng/feature/dashboard/dashboard/dashboard.component.ts` | written | 21 |
| controller | `DashboardSelectPanelController` | `src/app/components/dashboard-select.directive.js:31` | `src/app-ng/feature/components/dashboard-select-panel/dashboard-select-panel.component.ts` | written | 1 |
| controller | `DashboardSettingsController` | `src/app/dashboard/index.js:50` | `src/app-ng/feature/dashboard/dashboard-settings/dashboard-settings.component.ts` | written | 21 |
| controller | `DashboardStateDialogController` | `src/app/dashboard/states/index.js:22` | `src/app-ng/feature/dashboard/dashboard-state-dialog/dashboard-state-dialog.component.ts` | written | 13 |
| controller | `DashboardsController` | `src/app/dashboard/index.js:50` | `src/app-ng/feature/dashboard/dashboards/dashboards.component.ts` | written | 8 |
| controller | `DatakeyConfigDialogController` | `src/app/components/datakey-config-dialog.controller.js:18` | `src/app-ng/feature/components/datakey-config-dialog/datakey-config-dialog.component.ts` | written | 7 |
| controller | `DeviceCardController` | `src/app/device/index.js:29` | `src/app-ng/feature/device/device-card/device-card.component.ts` | written | 1 |
| controller | `DeviceController` | `src/app/device/index.js:29` | `src/app-ng/feature/device/device/device.component.ts` | written | 8 |
| controller | `EntityAliasDialogController` | `src/app/entity/index.js:37` | `src/app-ng/feature/entity/entity-alias-dialog/entity-alias-dialog.component.ts` | written | 14 |
| controller | `EntityAliasesController` | `src/app/entity/index.js:37` | `src/app-ng/feature/entity/entity-aliases/entity-aliases.component.ts` | written | 7 |
| controller | `EntityViewCardController` | `src/app/entity-view/index.js:28` | `src/app-ng/feature/entity-view/entity-view-card/entity-view-card.component.ts` | written | 1 |
| controller | `EntityViewController` | `src/app/entity-view/index.js:28` | `src/app-ng/feature/entity-view/entity-view/entity-view.component.ts` | written | 8 |
| controller | `EventContentDialogController` | `src/app/event/index.js:23` | `src/app-ng/feature/event/event-content-dialog/event-content-dialog.component.ts` | written | 1 |
| controller | `HomeController` | `src/app/layout/index.js:67` | `src/app-ng/feature/layout/home/home.component.ts` | written | 15 |
| controller | `HomeLinksController` | `src/app/home/index.js:21` | `src/app-ng/feature/home/home-links/home-links.component.ts` | written | 13 |
| controller | `ImportDialogCSVController` | `src/app/import-export/index.js:22` | `src/app-ng/feature/import-export/import-dialog-csv/import-dialog-csv.component.ts` | written | 25 |
| controller | `ImportDialogController` | `src/app/import-export/index.js:22` | `src/app-ng/feature/import-export/import-dialog/import-dialog.component.ts` | written | 3 |
| controller | `ItemCardController` | `src/app/components/grid.directive.js:27` | `src/app-ng/feature/components/item-card/item-card.component.ts` | written | 1 |
| controller | `JsonFormController` | `src/app/jsonform/index.js:24` | `src/app-ng/feature/jsonform/json-form/json-form.component.ts` | written | 7 |
| controller | `LegendConfigPanelController` | `src/app/components/legend-config.directive.js:30` | `src/app-ng/feature/components/legend-config-panel/legend-config-panel.component.ts` | written | 4 |
| controller | `LoginController` | `src/app/login/index.js:29` | `src/app-ng/feature/login/login/login.component.ts` | written | 6 |
| controller | `MakeDashboardPublicDialogController` | `src/app/dashboard/index.js:50` | `src/app-ng/feature/dashboard/make-dashboard-public-dialog/make-dashboard-public-dialog.component.ts` | written | 1 |
| controller | `ManageAssignedCustomersController` | `src/app/dashboard/index.js:50` | `src/app-ng/feature/dashboard/manage-assigned-customers/manage-assigned-customers.component.ts` | written | 1 |
| controller | `ManageDashboardLayoutsController` | `src/app/dashboard/layouts/index.js:20` | `src/app-ng/feature/dashboard/manage-dashboard-layouts/manage-dashboard-layouts.component.ts` | written | 1 |
| controller | `ManageDashboardStatesController` | `src/app/dashboard/states/index.js:22` | `src/app-ng/feature/dashboard/manage-dashboard-states/manage-dashboard-states.component.ts` | written | 11 |
| controller | `ManageDeviceCredentialsController` | `src/app/device/index.js:29` | `src/app-ng/feature/device/manage-device-credentials/manage-device-credentials.component.ts` | written | 9 |
| controller | `MaterialIconsDialogController` | `src/app/components/json-form.directive.js:28` | `src/app-ng/feature/components/material-icons-dialog/material-icons-dialog.component.ts` | written | 6 |
| controller | `MaterialIconsDialogController` | `src/app/components/material-icon-select.directive.js:28` | `src/app-ng/feature/components/material-icons-dialog/material-icons-dialog.component-2.ts` | written | 5 |
| controller | `NodeScriptTestController` | `src/app/rulechain/index.js:28` | `src/app-ng/feature/rulechain/node-script-test/node-script-test.component.ts` | written | 9 |
| controller | `ProfileController` | `src/app/profile/index.js:27` | `src/app-ng/feature/profile/profile/profile.component.ts` | written | 2 |
| controller | `ResetPasswordController` | `src/app/login/index.js:29` | `src/app-ng/feature/login/reset-password/reset-password.component.ts` | written | 5 |
| controller | `ResetPasswordRequestController` | `src/app/login/index.js:29` | `src/app-ng/feature/login/reset-password-request/reset-password-request.component.ts` | written | 3 |
| controller | `RuleChainController` | `src/app/rulechain/index.js:28` | `src/app-ng/feature/rulechain/rule-chain/rule-chain.component.ts` | written | 41 |
| controller | `RuleChainsController` | `src/app/rulechain/index.js:28` | `src/app-ng/feature/rulechain/rule-chains/rule-chains.component.ts` | written | 5 |
| controller | `SaveWidgetTypeAsController` | `src/app/widget/index.js:40` | `src/app-ng/feature/widget/save-widget-type-as/save-widget-type-as.component.ts` | written | 5 |
| controller | `SecuritySettingsController` | `src/app/admin/index.js:27` | `src/app-ng/feature/admin/security-settings/security-settings.component.ts` | written | 45 |
| controller | `SelectTargetLayoutController` | `src/app/dashboard/layouts/index.js:20` | `src/app-ng/feature/dashboard/select-target-layout/select-target-layout.component.ts` | written | 1 |
| controller | `SelectTargetStateController` | `src/app/dashboard/states/index.js:22` | `src/app-ng/feature/dashboard/select-target-state/select-target-state.component.ts` | written | 1 |
| controller | `SelectWidgetTypeController` | `src/app/widget/index.js:40` | `src/app-ng/feature/widget/select-widget-type/select-widget-type.component.ts` | written | 1 |
| controller | `TenantController` | `src/app/tenant/index.js:26` | `src/app-ng/feature/tenant/tenant/tenant.component.ts` | written | 5 |
| controller | `TimewindowPanelController` | `src/app/components/timewindow.directive.js:32` | `src/app-ng/feature/components/timewindow-panel/timewindow-panel.component.ts` | written | 5 |
| controller | `ToastController` | `src/app/services/toast.js:21` | `src/app-ng/feature/services/toast/toast.component.ts` | written | 4 |
| controller | `UserController` | `src/app/user/index.js:27` | `src/app-ng/feature/user/user/user.component.ts` | written | 4 |
| controller | `WidgetActionDialogController` | `src/app/components/widget/action/manage-widget-actions.directive.js:49` | `src/app-ng/feature/components/widget-action-dialog/widget-action-dialog.component.ts` | written | 24 |
| controller | `WidgetController` | `src/app/components/widget/widget.directive.js:24` | `src/app-ng/feature/components/widget/widget.component.ts` | written | 29 |
| controller | `WidgetEditorController` | `src/app/widget/index.js:40` | `src/app-ng/feature/widget/widget-editor/widget-editor.component.ts` | written | 17 |
| controller | `WidgetLibraryController` | `src/app/widget/index.js:40` | `src/app-ng/feature/widget/widget-library/widget-library.component.ts` | written | 16 |
| controller | `WidgetsBundleController` | `src/app/widget/index.js:40` | `src/app-ng/feature/widget/widgets-bundle/widgets-bundle.component.ts` | written | 4 |
| directive | `<dynamic:tbEventDirectives>` | `src/app/components/tb-event-directives.js:45` | `src/app-ng/feature/components/<dynamic:tb-event-directives>/<dynamic:tb-event-directives>.directive.ts` | not read — the registration was not found in the file, or the file did not parse | 0 |
| directive | `dateRangeNavigatorWidget` | `src/app/widget/lib/date-range-navigator/date-range-navigator.js:21` | `src/app-ng/feature/widget/date-range-navigator-widget/date-range-navigator-widget.directive.ts` | written | 2 |
| directive | `parseToNull` | `src/app/extension/index.js:24` | `src/app-ng/feature/extension/parse-to-null/parse-to-null.directive.ts` | written | 2 |
| directive | `tbAlarmHeader` | `src/app/alarm/index.js:21` | `src/app-ng/feature/alarm/tb-alarm-header/tb-alarm-header.directive.ts` | written | 5 |
| directive | `tbAlarmRow` | `src/app/alarm/index.js:21` | `src/app-ng/feature/alarm/tb-alarm-row/tb-alarm-row.directive.ts` | written | 6 |
| directive | `tbAlarmTable` | `src/app/alarm/index.js:21` | `src/app-ng/feature/alarm/tb-alarm-table/tb-alarm-table.directive.ts` | written | 9 |
| directive | `tbAlarmsTableWidget` | `src/app/widget/lib/alarms-table-widget.js:32` | `src/app-ng/feature/widget/tb-alarms-table-widget/tb-alarms-table-widget.directive.ts` | written | 6 |
| directive | `tbAliasesEntitySelect` | `src/app/entity/index.js:37` | `src/app-ng/feature/entity/tb-aliases-entity-select/tb-aliases-entity-select.directive.ts` | written | 5 |
| directive | `tbAsset` | `src/app/asset/index.js:28` | `src/app-ng/feature/asset/tb-asset/tb-asset.directive.ts` | written | 9 |
| directive | `tbAttributeTable` | `src/app/entity/index.js:37` | `src/app-ng/feature/entity/tb-attribute-table/tb-attribute-table.directive.ts` | written | 17 |
| directive | `tbAuditLogHeader` | `src/app/audit/index.js:23` | `src/app-ng/feature/audit/tb-audit-log-header/tb-audit-log-header.directive.ts` | written | 5 |
| directive | `tbAuditLogRow` | `src/app/audit/index.js:23` | `src/app-ng/feature/audit/tb-audit-log-row/tb-audit-log-row.directive.ts` | written | 6 |
| directive | `tbAuditLogTable` | `src/app/audit/index.js:23` | `src/app-ng/feature/audit/tb-audit-log-table/tb-audit-log-table.directive.ts` | written | 10 |
| directive | `tbChipDraggable` | `src/app/components/md-chip-draggable.directive.js:20` | `src/app-ng/feature/components/tb-chip-draggable/tb-chip-draggable.directive.ts` | written | 3 |
| directive | `tbCircularProgress` | `src/app/components/circular-progress.directive.js:18` | `src/app-ng/feature/components/tb-circular-progress/tb-circular-progress.directive.ts` | written | 3 |
| directive | `tbConfirmOnExit` | `src/app/components/confirm-on-exit.directive.js:16` | `src/app-ng/feature/components/tb-confirm-on-exit/tb-confirm-on-exit.directive.ts` | written | 8 |
| directive | `tbContact` | `src/app/components/contact.directive.js:22` | `src/app-ng/feature/components/tb-contact/tb-contact.directive.ts` | written | 10 |
| directive | `tbCustomActionPrettyEditor` | `src/app/components/widget/action/custom-action-pretty-editor.directive.js:33` | `src/app-ng/feature/components/tb-custom-action-pretty-editor/tb-custom-action-pretty-editor.directive.ts` | written | 10 |
| directive | `tbCustomer` | `src/app/customer/index.js:26` | `src/app-ng/feature/customer/tb-customer/tb-customer.directive.ts` | written | 9 |
| directive | `tbDashboard` | `src/app/components/dashboard.directive.js:36` | `src/app-ng/feature/components/tb-dashboard/tb-dashboard.directive.ts` | written | 5 |
| directive | `tbDashboardAutocomplete` | `src/app/components/dashboard-autocomplete.directive.js:28` | `src/app-ng/feature/components/tb-dashboard-autocomplete/tb-dashboard-autocomplete.directive.ts` | written | 8 |
| directive | `tbDashboardDetails` | `src/app/dashboard/index.js:50` | `src/app-ng/feature/dashboard/tb-dashboard-details/tb-dashboard-details.directive.ts` | written | 9 |
| directive | `tbDashboardLayout` | `src/app/dashboard/layouts/index.js:20` | `src/app-ng/feature/dashboard/tb-dashboard-layout/tb-dashboard-layout.directive.ts` | written | 1 |
| directive | `tbDashboardSelect` | `src/app/components/dashboard-select.directive.js:31` | `src/app-ng/feature/components/tb-dashboard-select/tb-dashboard-select.directive.ts` | written | 5 |
| directive | `tbDashboardToolbar` | `src/app/dashboard/index.js:50` | `src/app-ng/feature/dashboard/tb-dashboard-toolbar/tb-dashboard-toolbar.directive.ts` | written | 7 |
| directive | `tbDatakeyConfig` | `src/app/components/datakey-config.directive.js:28` | `src/app-ng/feature/components/tb-datakey-config/tb-datakey-config.directive.ts` | written | 8 |
| directive | `tbDatasource` | `src/app/components/datasource.directive.js:28` | `src/app-ng/feature/components/tb-datasource/tb-datasource.directive.ts` | written | 7 |
| directive | `tbDatasourceEntity` | `src/app/components/datasource-entity.directive.js:34` | `src/app-ng/feature/components/tb-datasource-entity/tb-datasource-entity.directive.ts` | written | 12 |
| directive | `tbDatasourceFunc` | `src/app/components/datasource-func.directive.js:34` | `src/app-ng/feature/components/tb-datasource-func/tb-datasource-func.directive.ts` | written | 8 |
| directive | `tbDatetimePeriod` | `src/app/components/datetime-period.directive.js:24` | `src/app-ng/feature/components/tb-datetime-period/tb-datetime-period.directive.ts` | written | 6 |
| directive | `tbDetailsSidenav` | `src/app/components/details-sidenav.directive.js:24` | `src/app-ng/feature/components/tb-details-sidenav/tb-details-sidenav.directive.ts` | written | 11 |
| directive | `tbDevice` | `src/app/device/index.js:29` | `src/app-ng/feature/device/tb-device/tb-device.directive.ts` | written | 9 |
| directive | `tbEditWidget` | `src/app/dashboard/index.js:50` | `src/app-ng/feature/dashboard/tb-edit-widget/tb-edit-widget.directive.ts` | written | 8 |
| directive | `tbEntitiesHierarchyWidget` | `src/app/widget/lib/entities-hierarchy-widget.js:24` | `src/app-ng/feature/widget/tb-entities-hierarchy-widget/tb-entities-hierarchy-widget.directive.ts` | written | 1 |
| directive | `tbEntitiesTableWidget` | `src/app/widget/lib/entities-table-widget.js:30` | `src/app-ng/feature/widget/tb-entities-table-widget/tb-entities-table-widget.directive.ts` | written | 6 |
| directive | `tbEntityAliasSelect` | `src/app/components/entity-alias-select.directive.js:29` | `src/app-ng/feature/components/tb-entity-alias-select/tb-entity-alias-select.directive.ts` | written | 7 |
| directive | `tbEntityAutocomplete` | `src/app/entity/index.js:37` | `src/app-ng/feature/entity/tb-entity-autocomplete/tb-entity-autocomplete.directive.ts` | written | 19 |
| directive | `tbEntityFilter` | `src/app/entity/index.js:37` | `src/app-ng/feature/entity/tb-entity-filter/tb-entity-filter.directive.ts` | written | 11 |
| directive | `tbEntityFilterView` | `src/app/entity/index.js:37` | `src/app-ng/feature/entity/tb-entity-filter-view/tb-entity-filter-view.directive.ts` | written | 5 |
| directive | `tbEntityList` | `src/app/entity/index.js:37` | `src/app-ng/feature/entity/tb-entity-list/tb-entity-list.directive.ts` | written | 24 |
| directive | `tbEntitySelect` | `src/app/entity/index.js:37` | `src/app-ng/feature/entity/tb-entity-select/tb-entity-select.directive.ts` | written | 6 |
| directive | `tbEntitySubtypeAutocomplete` | `src/app/entity/index.js:37` | `src/app-ng/feature/entity/tb-entity-subtype-autocomplete/tb-entity-subtype-autocomplete.directive.ts` | written | 18 |
| directive | `tbEntitySubtypeList` | `src/app/entity/index.js:37` | `src/app-ng/feature/entity/tb-entity-subtype-list/tb-entity-subtype-list.directive.ts` | written | 24 |
| directive | `tbEntitySubtypeSelect` | `src/app/entity/index.js:37` | `src/app-ng/feature/entity/tb-entity-subtype-select/tb-entity-subtype-select.directive.ts` | written | 10 |
| directive | `tbEntityTypeList` | `src/app/entity/index.js:37` | `src/app-ng/feature/entity/tb-entity-type-list/tb-entity-type-list.directive.ts` | written | 25 |
| directive | `tbEntityTypeSelect` | `src/app/entity/index.js:37` | `src/app-ng/feature/entity/tb-entity-type-select/tb-entity-type-select.directive.ts` | written | 10 |
| directive | `tbEntityView` | `src/app/entity-view/index.js:28` | `src/app-ng/feature/entity-view/tb-entity-view/tb-entity-view.directive.ts` | written | 46 |
| directive | `tbEventHeader` | `src/app/event/index.js:23` | `src/app-ng/feature/event/tb-event-header/tb-event-header.directive.ts` | written | 4 |
| directive | `tbEventRow` | `src/app/event/index.js:23` | `src/app-ng/feature/event/tb-event-row/tb-event-row.directive.ts` | written | 4 |
| directive | `tbEventTable` | `src/app/event/index.js:23` | `src/app-ng/feature/event/tb-event-table/tb-event-table.directive.ts` | written | 9 |
| directive | `tbExpandFullscreen` | `src/app/components/expand-fullscreen.directive.js:20` | `src/app-ng/feature/components/tb-expand-fullscreen/tb-expand-fullscreen.directive.ts` | written | 9 |
| directive | `tbExtensionFormHttp` | `src/app/extension/index.js:24` | `src/app-ng/feature/extension/tb-extension-form-http/tb-extension-form-http.directive.ts` | written | 32 |
| directive | `tbExtensionFormModbus` | `src/app/extension/index.js:24` | `src/app-ng/feature/extension/tb-extension-form-modbus/tb-extension-form-modbus.directive.ts` | written | 88 |
| directive | `tbExtensionFormMqtt` | `src/app/extension/index.js:24` | `src/app-ng/feature/extension/tb-extension-form-mqtt/tb-extension-form-mqtt.directive.ts` | written | 109 |
| directive | `tbExtensionFormOpc` | `src/app/extension/index.js:24` | `src/app-ng/feature/extension/tb-extension-form-opc/tb-extension-form-opc.directive.ts` | written | 52 |
| directive | `tbExtensionTable` | `src/app/extension/index.js:24` | `src/app-ng/feature/extension/tb-extension-table/tb-extension-table.directive.ts` | written | 6 |
| directive | `tbExtensionsTableWidget` | `src/app/widget/lib/extensions-table-widget.js:24` | `src/app-ng/feature/widget/tb-extensions-table-widget/tb-extensions-table-widget.directive.ts` | written | 1 |
| directive | `tbGatewayConfig` | `src/app/components/gateway/gateway-config.directive.js:27` | `src/app-ng/feature/components/tb-gateway-config/tb-gateway-config.directive.ts` | written | 12 |
| directive | `tbGatewayConfigSelect` | `src/app/components/gateway/gateway-config-select.directive.js:27` | `src/app-ng/feature/components/tb-gateway-config-select/tb-gateway-config-select.directive.ts` | written | 7 |
| directive | `tbGatewayForm` | `src/app/components/gateway/gateway-form.directive.js:23` | `src/app-ng/feature/components/tb-gateway-form/tb-gateway-form.directive.ts` | written | 62 |
| directive | `tbGrid` | `src/app/components/grid.directive.js:27` | `src/app-ng/feature/components/tb-grid/tb-grid.directive.ts` | written | 12 |
| directive | `tbGridCardContent` | `src/app/components/grid.directive.js:27` | `src/app-ng/feature/components/tb-grid-card-content/tb-grid-card-content.directive.ts` | written | 5 |
| directive | `tbHelp` | `src/app/help/help.directive.js:22` | `src/app-ng/feature/help/tb-help/tb-help.directive.ts` | written | 4 |
| directive | `tbJsFunc` | `src/app/components/js-func.directive.js:40` | `src/app-ng/feature/components/tb-js-func/tb-js-func.directive.ts` | written | 7 |
| directive | `tbJsonContent` | `src/app/components/json-content.directive.js:37` | `src/app-ng/feature/components/tb-json-content/tb-json-content.directive.ts` | written | 7 |
| directive | `tbJsonForm` | `src/app/components/json-form.directive.js:28` | `src/app-ng/feature/components/tb-json-form/tb-json-form.directive.ts` | written | 7 |
| directive | `tbJsonObjectEdit` | `src/app/components/json-object-edit.directive.js:31` | `src/app-ng/feature/components/tb-json-object-edit/tb-json-object-edit.directive.ts` | written | 6 |
| directive | `tbJsonToString` | `src/app/components/tb-json-to-string.directive.js:16` | `src/app-ng/feature/components/tb-json-to-string/tb-json-to-string.directive.ts` | written | 2 |
| directive | `tbKeyValMap` | `src/app/components/kv-map.directive.js:24` | `src/app-ng/feature/components/tb-key-val-map/tb-key-val-map.directive.ts` | written | 1 |
| directive | `tbKnob` | `src/app/widget/lib/rpc/knob.directive.js:29` | `src/app-ng/feature/widget/tb-knob/tb-knob.directive.ts` | written | 1 |
| directive | `tbLedIndicator` | `src/app/widget/lib/rpc/led-indicator.directive.js:26` | `src/app-ng/feature/widget/tb-led-indicator/tb-led-indicator.directive.ts` | written | 1 |
| directive | `tbLedLight` | `src/app/components/led-light.directive.js:22` | `src/app-ng/feature/components/tb-led-light/tb-led-light.directive.ts` | written | 4 |
| directive | `tbLegend` | `src/app/components/legend.directive.js:25` | `src/app-ng/feature/components/tb-legend/tb-legend.directive.ts` | written | 5 |
| directive | `tbLegendConfig` | `src/app/components/legend-config.directive.js:30` | `src/app-ng/feature/components/tb-legend-config/tb-legend-config.directive.ts` | written | 5 |
| directive | `tbManageWidgetActions` | `src/app/components/widget/action/manage-widget-actions.directive.js:49` | `src/app-ng/feature/components/tb-manage-widget-actions/tb-manage-widget-actions.directive.ts` | written | 8 |
| directive | `tbMaterialIconSelect` | `src/app/components/material-icon-select.directive.js:28` | `src/app-ng/feature/components/tb-material-icon-select/tb-material-icon-select.directive.ts` | written | 5 |
| directive | `tbMenuLink` | `src/app/components/menu-link.directive.js:27` | `src/app-ng/feature/components/tb-menu-link/tb-menu-link.directive.ts` | written | 8 |
| directive | `tbMessageTypeAutocomplete` | `src/app/rulechain/index.js:28` | `src/app-ng/feature/rulechain/tb-message-type-autocomplete/tb-message-type-autocomplete.directive.ts` | written | 18 |
| directive | `tbMousepointMenu` | `src/app/components/mousepoint-menu.directive.js:16` | `src/app-ng/feature/components/tb-mousepoint-menu/tb-mousepoint-menu.directive.ts` | written | 3 |
| directive | `tbMultipleInputWidget` | `src/app/widget/lib/multiple-input-widget.js:24` | `src/app-ng/feature/widget/tb-multiple-input-widget/tb-multiple-input-widget.directive.ts` | written | 16 |
| directive | `tbNavTree` | `src/app/components/nav-tree.directive.js:24` | `src/app-ng/feature/components/tb-nav-tree/tb-nav-tree.directive.ts` | written | 1 |
| directive | `tbNoAnimate` | `src/app/components/no-animate.directive.js:18` | `src/app-ng/feature/components/tb-no-animate/tb-no-animate.directive.ts` | written | 3 |
| directive | `tbOnFinishRender` | `src/app/components/finish-render.directive.js:16` | `src/app-ng/feature/components/tb-on-finish-render/tb-on-finish-render.directive.ts` | written | 2 |
| directive | `tbQueueTypeList` | `src/app/components/queue/index.js:19` | `src/app-ng/feature/components/tb-queue-type-list/tb-queue-type-list.directive.ts` | written | 18 |
| directive | `tbRelatedEntityAutocomplete` | `src/app/components/related-entity-autocomplete.directive.js:25` | `src/app-ng/feature/components/tb-related-entity-autocomplete/tb-related-entity-autocomplete.directive.ts` | written | 8 |
| directive | `tbRelationFilters` | `src/app/entity/index.js:37` | `src/app-ng/feature/entity/tb-relation-filters/tb-relation-filters.directive.ts` | written | 8 |
| directive | `tbRelationTable` | `src/app/entity/index.js:37` | `src/app-ng/feature/entity/tb-relation-table/tb-relation-table.directive.ts` | written | 6 |
| directive | `tbRelationTypeAutocomplete` | `src/app/entity/index.js:37` | `src/app-ng/feature/entity/tb-relation-type-autocomplete/tb-relation-type-autocomplete.directive.ts` | written | 18 |
| directive | `tbRoundSwitch` | `src/app/widget/lib/rpc/round-switch.directive.js:24` | `src/app-ng/feature/widget/tb-round-switch/tb-round-switch.directive.ts` | written | 1 |
| directive | `tbRuleChain` | `src/app/rulechain/index.js:28` | `src/app-ng/feature/rulechain/tb-rule-chain/tb-rule-chain.directive.ts` | written | 9 |
| directive | `tbRuleNode` | `src/app/rulechain/index.js:28` | `src/app-ng/feature/rulechain/tb-rule-node/tb-rule-node.directive.ts` | written | 9 |
| directive | `tbRuleNodeConfig` | `src/app/rulechain/index.js:28` | `src/app-ng/feature/rulechain/tb-rule-node-config/tb-rule-node-config.directive.ts` | written | 7 |
| directive | `tbRuleNodeDefinedConfig` | `src/app/rulechain/index.js:28` | `src/app-ng/feature/rulechain/tb-rule-node-defined-config/tb-rule-node-defined-config.directive.ts` | written | 5 |
| directive | `tbRuleNodeLink` | `src/app/rulechain/index.js:28` | `src/app-ng/feature/rulechain/tb-rule-node-link/tb-rule-node-link.directive.ts` | written | 21 |
| directive | `tbScopeElement` | `src/app/components/scope-element.directive.js:16` | `src/app-ng/feature/components/tb-scope-element/tb-scope-element.directive.ts` | written | 1 |
| directive | `tbSideMenu` | `src/app/components/side-menu.directive.js:27` | `src/app-ng/feature/components/tb-side-menu/tb-side-menu.directive.ts` | written | 5 |
| directive | `tbSocialSharePanel` | `src/app/components/socialshare-panel.directive.js:23` | `src/app-ng/feature/components/tb-social-share-panel/tb-social-share-panel.directive.ts` | written | 1 |
| directive | `tbStatesComponent` | `src/app/dashboard/states/index.js:22` | `src/app-ng/feature/dashboard/tb-states-component/tb-states-component.directive.ts` | written | 6 |
| directive | `tbSwitch` | `src/app/widget/lib/rpc/switch.directive.js:24` | `src/app-ng/feature/widget/tb-switch/tb-switch.directive.ts` | written | 1 |
| directive | `tbTableColumnsAssignment` | `src/app/import-export/index.js:22` | `src/app-ng/feature/import-export/tb-table-columns-assignment/tb-table-columns-assignment.directive.ts` | written | 4 |
| directive | `tbTenant` | `src/app/tenant/index.js:26` | `src/app-ng/feature/tenant/tb-tenant/tb-tenant.directive.ts` | written | 9 |
| directive | `tbTimeinterval` | `src/app/components/timeinterval.directive.js:24` | `src/app-ng/feature/components/tb-timeinterval/tb-timeinterval.directive.ts` | written | 5 |
| directive | `tbTimeseriesTableWidget` | `src/app/widget/lib/timeseries-table-widget.js:27` | `src/app-ng/feature/widget/tb-timeseries-table-widget/tb-timeseries-table-widget.directive.ts` | written | 6 |
| directive | `tbTimewindow` | `src/app/components/timewindow.directive.js:32` | `src/app-ng/feature/components/tb-timewindow/tb-timewindow.directive.ts` | written | 9 |
| directive | `tbUser` | `src/app/user/index.js:27` | `src/app-ng/feature/user/tb-user/tb-user.directive.ts` | written | 11 |
| directive | `tbUserMenu` | `src/app/layout/user-menu.directive.js:24` | `src/app-ng/feature/layout/tb-user-menu/tb-user-menu.directive.ts` | written | 1 |
| directive | `tbWebCameraWidget` | `src/app/widget/lib/web-camera-input-widget.js:22` | `src/app-ng/feature/widget/tb-web-camera-widget/tb-web-camera-widget.directive.ts` | written | 1 |
| directive | `tbWidget` | `src/app/components/widget/widget.directive.js:24` | `src/app-ng/feature/components/tb-widget/tb-widget.directive.ts` | written | 4 |
| directive | `tbWidgetConfig` | `src/app/components/widget/widget-config.directive.js:38` | `src/app-ng/feature/components/tb-widget-config/tb-widget-config.directive.ts` | written | 5 |
| directive | `tbWidgetsBundle` | `src/app/widget/index.js:40` | `src/app-ng/feature/widget/tb-widgets-bundle/tb-widgets-bundle.directive.ts` | written | 9 |
| directive | `tbWidgetsBundleSelect` | `src/app/components/widgets-bundle-select.directive.js:27` | `src/app-ng/feature/components/tb-widgets-bundle-select/tb-widgets-bundle-select.directive.ts` | written | 5 |
| directive | `tripAnimation` | `src/app/widget/lib/tripAnimation/trip-animation-widget.js:87` | `src/app-ng/feature/widget/trip-animation/trip-animation.directive.ts` | written | 3 |
| factory | `$mdColorPicker` | `src/app/common/thirdparty-fix.js:19` | `src/app-ng/feature/common/services/$md-color-picker.service.ts` | written | 1 |
| factory | `Fullscreen` | `src/app/common/thirdparty-fix.js:19` | `src/app-ng/feature/common/services/fullscreen.service.ts` | written | 0 |
| factory | `adminService` | `src/app/api/admin.service.js:16` | `src/app-ng/feature/api/services/admin.service.ts` | written | 4 |
| factory | `alarmService` | `src/app/api/alarm.service.js:16` | `src/app-ng/feature/api/services/alarm.service.ts` | written | 5 |
| factory | `assetService` | `src/app/api/asset.service.js:16` | `src/app-ng/feature/api/services/asset.service.ts` | written | 5 |
| factory | `attributeService` | `src/app/api/attribute.service.js:16` | `src/app-ng/feature/api/services/attribute.service.ts` | written | 6 |
| factory | `auditLogService` | `src/app/api/audit-log.service.js:16` | `src/app-ng/feature/api/services/audit-log.service.ts` | written | 4 |
| factory | `bufferStore` | `src/app/services/item-buffer.service.js:18` | `src/app-ng/feature/services/buffer-store.service.ts` | written | 1 |
| factory | `clipboardService` | `src/app/services/clipboard.service.js:16` | `src/app-ng/feature/services/clipboard.service.ts` | written | 3 |
| factory | `componentDescriptorService` | `src/app/api/component-descriptor.service.js:16` | `src/app-ng/feature/api/services/component-descriptor.service.ts` | written | 4 |
| factory | `customerService` | `src/app/api/customer.service.js:16` | `src/app-ng/feature/api/services/customer.service.ts` | written | 4 |
| factory | `dashboardService` | `src/app/api/dashboard.service.js:16` | `src/app-ng/feature/api/services/dashboard.service.ts` | written | 7 |
| factory | `dashboardUtils` | `src/app/common/dashboard-utils.service.js:16` | `src/app-ng/feature/common/services/dashboard-utils.service.ts` | written | 0 |
| factory | `datasourceService` | `src/app/api/datasource.service.js:22` | `src/app-ng/feature/api/services/datasource.service.ts` | written | 3 |
| factory | `deviceService` | `src/app/api/device.service.js:18` | `src/app-ng/feature/api/services/device.service.ts` | written | 6 |
| factory | `entityRelationService` | `src/app/api/entity-relation.service.js:16` | `src/app-ng/feature/api/services/entity-relation.service.ts` | written | 4 |
| factory | `entityService` | `src/app/api/entity.service.js:18` | `src/app-ng/feature/api/services/entity.service.ts` | written | 8 |
| factory | `entityViewService` | `src/app/api/entity-view.service.js:18` | `src/app-ng/feature/api/services/entity-view.service.ts` | written | 5 |
| factory | `eventService` | `src/app/api/event.service.js:16` | `src/app-ng/feature/api/services/event.service.ts` | written | 4 |
| factory | `globalInterceptor` | `src/app/app.js:107` | `src/app-ng/feature/root/services/global-interceptor.service.ts` | written | 3 |
| factory | `importExport` | `src/app/import-export/index.js:22` | `src/app-ng/feature/import-export/services/import-export.service.ts` | written | 7 |
| factory | `itembuffer` | `src/app/services/item-buffer.service.js:18` | `src/app-ng/feature/services/itembuffer.service.ts` | written | 5 |
| factory | `loginService` | `src/app/api/login.service.js:16` | `src/app-ng/feature/api/services/login.service.ts` | written | 4 |
| factory | `menu` | `src/app/services/menu.service.js:18` | `src/app-ng/feature/services/menu.service.ts` | written | 3 |
| factory | `queueService` | `src/app/api/queue.service.js:17` | `src/app-ng/feature/api/services/queue.service.ts` | written | 4 |
| factory | `ruleChainService` | `src/app/api/rule-chain.service.js:16` | `src/app-ng/feature/api/services/rule-chain.service.ts` | written | 6 |
| factory | `ruleNodeScriptTest` | `src/app/rulechain/index.js:28` | `src/app-ng/feature/rulechain/services/rule-node-script-test.service.ts` | written | 3 |
| factory | `statesControllerService` | `src/app/dashboard/states/index.js:22` | `src/app-ng/feature/dashboard/services/states-controller.service.ts` | written | 0 |
| factory | `tbMissingTranslationHandler` | `src/app/locale/translate-handler.js:16` | `src/app-ng/feature/locale/services/tb-missing-translation-handler.service.ts` | written | 0 |
| factory | `telemetryWebsocketService` | `src/app/api/telemetry-websocket.service.js:19` | `src/app-ng/feature/api/services/telemetry-websocket.service.ts` | written | 6 |
| factory | `tenantService` | `src/app/api/tenant.service.js:16` | `src/app-ng/feature/api/services/tenant.service.ts` | written | 4 |
| factory | `timeService` | `src/app/api/time.service.js:16` | `src/app-ng/feature/api/services/time.service.ts` | written | 4 |
| factory | `toast` | `src/app/services/toast.js:21` | `src/app-ng/feature/services/toast.service.ts` | written | 0 |
| factory | `userService` | `src/app/api/user.service.js:19` | `src/app-ng/feature/api/services/user.service.ts` | written | 10 |
| factory | `utils` | `src/app/common/utils.service.js:29` | `src/app-ng/feature/common/services/utils.service.ts` | written | 6 |
| factory | `widgetService` | `src/app/api/widget.service.js:53` | `src/app-ng/feature/api/services/widget.service.ts` | written | 9 |
| filter | `breadcrumbIcon` | `src/app/layout/index.js:67` | `src/app-ng/feature/layout/pipes/breadcrumb-icon.pipe.ts` | written | 0 |
| filter | `breadcrumbLabel` | `src/app/layout/index.js:67` | `src/app-ng/feature/layout/pipes/breadcrumb-label.pipe.ts` | written | 2 |
| filter | `contactShort` | `src/app/components/contact-short.filter.js:16` | `src/app-ng/feature/components/pipes/contact-short.pipe.ts` | written | 0 |
| filter | `keyboardShortcut` | `src/app/components/keyboard-shortcut.filter.js:16` | `src/app-ng/feature/components/pipes/keyboard-shortcut.pipe.ts` | written | 0 |
| filter | `milliSecondsToTimeString` | `src/app/components/timewindow.directive.js:32` | `src/app-ng/feature/components/pipes/milli-seconds-to-time-string.pipe.ts` | written | 0 |
| filter | `nospace` | `src/app/components/menu-link.directive.js:27` | `src/app-ng/feature/components/pipes/nospace.pipe.ts` | written | 0 |
| filter | `range` | `src/app/components/grid.directive.js:27` | `src/app-ng/feature/components/pipes/range.pipe.ts` | written | 0 |
| filter | `tripAnimation` | `src/app/widget/lib/tripAnimation/trip-animation-widget.js:87` | `src/app-ng/feature/widget/pipes/trip-animation.pipe.ts` | written | 0 |
| filter | `truncate` | `src/app/components/truncate.filter.js:16` | `src/app-ng/feature/components/pipes/truncate.pipe.ts` | written | 0 |
| provider | `$mdpDatePicker` | `src/app/common/thirdparty-fix.js:19` | `src/app-ng/feature/common/services/$mdp-date-picker.service.ts` | written | 0 |
| provider | `$mdpTimePicker` | `src/app/common/thirdparty-fix.js:19` | `src/app-ng/feature/common/services/$mdp-time-picker.service.ts` | written | 0 |
| provider | `tbRaf` | `src/app/common/raf.provider.js:16` | `src/app-ng/feature/common/services/tb-raf.service.ts` | written | 0 |
| run | `<run@107>` | `src/app/app.js:107` | `src/app-ng/feature/root/setup/app-run-107.setup.ts` | written | 7 |
| value | `ReactSchemaForm` | `src/app/components/json-form.directive.js:28` | `src/app-ng/feature/components/constants/react-schema-form.ts` | written | 1 |
