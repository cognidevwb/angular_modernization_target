# Classification (S2b)

Model `jev-1.13.0` · question bank `2026-09-23.2` · 415 units: 234 by Jev, 181 by code.

Requests: 306 sent, 0 from cache · 72 units re-asked · 57 answers unresolved · 0 errors · tokens 860590 in / 112254 out · source sent whole for 226, as an excerpt for 8.

Thresholds, calibrated on 40 blind-labelled units (small sample — provisional): re-ask below confidence 0.6, unresolved below 0.4; a concern counts at p ≥ 0.5; mixed-concern at ≥ 7 concerns. Units by number of concerns — 0: 88 · 1: 49 · 2: 21 · 3: 19 · 4: 11 · 5: 15 · 6: 10 · 7: 15 · 8: 5 · 10: 1.

| Layer | Units | Mixed-concern |
|---|---|---|
| `application_orchestration` | 1 | 0 |
| `bootstrap_composition` | 142 | 0 |
| `data_access` | 19 | 2 |
| `domain_logic` | 2 | 0 |
| `external_integration` | 3 | 0 |
| `navigation_routing` | 36 | 0 |
| `platform_cross_cutting` | 4 | 1 |
| `presentation` | 199 | 18 |
| `shared_model_utility` | 4 | 0 |
| `state_management` | 1 | 0 |
| `unknown` | 4 | 0 |

## Errors — 0


## Mixed-concern units (split candidates) — 21

- `telemetryWebsocketService` factory — `src/app/api/telemetry-websocket.service.js` · service_kind=data_access_client · concerns: auth, business_rules, data_access, errors_logging, external_integration, shared_state, workflow · also reaches: platform_cross_cutting, application_orchestration, state_management, external_integration, domain_logic · service_state: shared_mutable_state 0.49 / other 0.47
- `userService` factory — `src/app/api/user.service.js` · service_kind=auth_session · concerns: auth, business_rules, data_access, errors_logging, navigation, shared_state, workflow · also reaches: navigation_routing, application_orchestration, state_management, data_access, domain_logic
- `widgetService` factory — `src/app/api/widget.service.js` · service_kind=data_access_client · concerns: business_rules, data_access, errors_logging, external_integration, formatting, shared_state, workflow · also reaches: application_orchestration, state_management, external_integration, domain_logic, platform_cross_cutting
- `tbConfirmOnExit` directive — `src/app/components/confirm-on-exit.directive.js` · directive_kind=attribute_behaviour · concerns: auth, business_rules, external_integration, formatting, navigation, shared_state, user_input, workflow · also reaches: navigation_routing, platform_cross_cutting, application_orchestration, state_management, external_integration, domain_logic
- `tbDashboard` directive — `src/app/components/dashboard.directive.js` · directive_kind=element_with_template · concerns: business_rules, data_access, external_integration, formatting, shared_state, ui_rendering, user_input, workflow · also reaches: application_orchestration, state_management, data_access, external_integration, domain_logic
- `tbDatasourceEntity` directive — `src/app/components/datasource-entity.directive.js` · directive_kind=dom_manipulation · concerns: business_rules, data_access, external_integration, ui_rendering, user_input, validation, workflow · also reaches: application_orchestration, data_access, external_integration, domain_logic · controller_kind: widget_controller 0.52 / form_controller 0.35
- `tbGatewayConfig` directive — `src/app/components/gateway/gateway-config.directive.js` · directive_kind=element_with_template · concerns: business_rules, errors_logging, external_integration, formatting, ui_rendering, user_input, validation, workflow · also reaches: application_orchestration, external_integration, domain_logic, platform_cross_cutting
- `tbGatewayForm` directive — `src/app/components/gateway/gateway-form.directive.js` · directive_kind=element_with_template · concerns: auth, business_rules, data_access, errors_logging, external_integration, formatting, shared_state, ui_rendering, user_input, workflow · also reaches: platform_cross_cutting, application_orchestration, state_management, data_access, external_integration, domain_logic
- `tbGrid` directive — `src/app/components/grid.directive.js` · directive_kind=element_with_template · concerns: auth, business_rules, data_access, formatting, ui_rendering, user_input, workflow · also reaches: platform_cross_cutting, application_orchestration, data_access, domain_logic
- `tbJsonContent` directive — `src/app/components/json-content.directive.js` · directive_kind=dom_manipulation · concerns: business_rules, errors_logging, external_integration, formatting, ui_rendering, user_input, validation · also reaches: external_integration, domain_logic, platform_cross_cutting
- `tbUserMenu` directive — `src/app/layout/user-menu.directive.js` · directive_kind=element_with_template · concerns: auth, business_rules, formatting, navigation, shared_state, ui_rendering, user_input · also reaches: navigation_routing, platform_cross_cutting, state_management, domain_logic
- `tbWidgetConfig` directive — `src/app/components/widget/widget-config.directive.js` · directive_kind=dom_manipulation · concerns: business_rules, external_integration, formatting, shared_state, ui_rendering, user_input, validation · also reaches: state_management, external_integration, domain_logic
- `tbAlarmsTableWidget` directive — `src/app/widget/lib/alarms-table-widget.js` · directive_kind=element_with_template · concerns: business_rules, data_access, external_integration, formatting, ui_rendering, user_input, workflow · also reaches: application_orchestration, data_access, external_integration, domain_logic
- `tbEntitiesHierarchyWidget` directive — `src/app/widget/lib/entities-hierarchy-widget.js` · directive_kind=element_with_template · concerns: business_rules, data_access, errors_logging, formatting, shared_state, ui_rendering, user_input, workflow · also reaches: application_orchestration, state_management, data_access, domain_logic, platform_cross_cutting
- `tbEntitiesTableWidget` directive — `src/app/widget/lib/entities-table-widget.js` · directive_kind=element_with_template · concerns: business_rules, external_integration, formatting, shared_state, ui_rendering, user_input, workflow · also reaches: application_orchestration, state_management, external_integration, domain_logic
- `tbMultipleInputWidget` directive — `src/app/widget/lib/multiple-input-widget.js` · directive_kind=element_with_template · concerns: business_rules, data_access, errors_logging, formatting, shared_state, ui_rendering, user_input, workflow · also reaches: application_orchestration, state_management, data_access, domain_logic, platform_cross_cutting
- `tbKnob` directive — `src/app/widget/lib/rpc/knob.directive.js` · directive_kind=dom_manipulation · concerns: business_rules, data_access, errors_logging, external_integration, formatting, ui_rendering, user_input · also reaches: data_access, external_integration, domain_logic, platform_cross_cutting · directive_kind: dom_manipulation 0.51 / element_with_template 0.49
- `tbRoundSwitch` directive — `src/app/widget/lib/rpc/round-switch.directive.js` · directive_kind=element_with_template · concerns: business_rules, data_access, errors_logging, formatting, ui_rendering, user_input, workflow · also reaches: application_orchestration, data_access, domain_logic, platform_cross_cutting
- `tbSwitch` directive — `src/app/widget/lib/rpc/switch.directive.js` · directive_kind=element_with_template · concerns: business_rules, data_access, errors_logging, formatting, ui_rendering, user_input, workflow · also reaches: application_orchestration, data_access, domain_logic, platform_cross_cutting
- `tripAnimation` directive — `src/app/widget/lib/tripAnimation/trip-animation-widget.js` · directive_kind=element_with_template · concerns: business_rules, data_access, external_integration, formatting, shared_state, ui_rendering, user_input · also reaches: state_management, data_access, external_integration, domain_logic
- `tbWebCameraWidget` directive — `src/app/widget/lib/web-camera-input-widget.js` · directive_kind=element_with_template · concerns: business_rules, data_access, external_integration, formatting, ui_rendering, user_input, workflow · also reaches: application_orchestration, data_access, external_integration, domain_logic

## Undecided subtypes — split between two options — 56

- `SecuritySettingsController` controller — `src/app/admin/index.js` · controller_kind=unknown · concerns: auth · also reaches: platform_cross_cutting · controller_kind: unknown 0.86 / page_controller 0.11
- `tbAlarmRow` directive — `src/app/alarm/index.js` · directive_kind=unknown · concerns: ui_rendering · directive_kind: unknown 0.69 / attribute_behaviour 0.28
- `datasourceService` factory — `src/app/api/datasource.service.js` · service_kind=data_access_client · concerns: business_rules, data_access, external_integration, formatting, shared_state, workflow · also reaches: application_orchestration, state_management, external_integration, domain_logic · service_state: shared_mutable_state 0.45 / other 0.34
- `telemetryWebsocketService` factory — `src/app/api/telemetry-websocket.service.js` · service_kind=data_access_client · concerns: auth, business_rules, data_access, errors_logging, external_integration, shared_state, workflow · also reaches: platform_cross_cutting, application_orchestration, state_management, external_integration, domain_logic · service_state: shared_mutable_state 0.49 / other 0.47
- `AssetCardController` controller — `src/app/asset/index.js` · controller_kind=unknown · controller_kind: unknown 0.72 / widget_controller 0.21
- `AssetController` controller — `src/app/asset/index.js` · controller_kind=unknown · concerns: data_access · also reaches: data_access · controller_kind: unknown 0.76 / list_grid_controller 0.12
- `AuditLogsController` controller — `src/app/audit/index.js` · controller_kind=unknown · controller_kind: unknown 0.58 / list_grid_controller 0.26
- `clipboardService` factory — `src/app/services/clipboard.service.js` · service_kind=integration_wrapper · concerns: external_integration, user_input · service_state: shared_mutable_state 0.51 / stateless 0.39
- `ManageDashboardLayoutsController` controller — `src/app/dashboard/layouts/index.js` · controller_kind=unknown · controller_kind: unknown 0.90 / page_controller 0.07
- `ManageDashboardStatesController` controller — `src/app/dashboard/states/index.js` · controller_kind=unknown · controller_kind: unknown 0.86 / page_controller 0.10
- `SelectTargetStateController` controller — `src/app/dashboard/states/index.js` · controller_kind=unknown · controller_kind: unknown 0.78 / modal_controller 0.13
- `statesControllerService` factory — `src/app/dashboard/states/index.js` · service_kind=unknown · service_state: unknown 0.93 / stateless 0.06
- `AddDashboardsToCustomerController` controller — `src/app/dashboard/index.js` · controller_kind=unknown · controller_kind: unknown 0.75 / modal_controller 0.19
- `DashboardCardController` controller — `src/app/dashboard/index.js` · controller_kind=unknown · controller_kind: unknown 0.59 / list_grid_controller 0.22
- `DashboardSettingsController` controller — `src/app/dashboard/index.js` · controller_kind=unknown · controller_kind: unknown 0.81 / page_controller 0.10
- `ManageAssignedCustomersController` controller — `src/app/dashboard/index.js` · controller_kind=unknown · controller_kind: unknown 0.88 / modal_controller 0.06
- `AddDevicesToCustomerController` controller — `src/app/device/index.js` · controller_kind=unknown · controller_kind: unknown 0.81 / modal_controller 0.15
- `AssignDeviceToCustomerController` controller — `src/app/device/index.js` · controller_kind=unknown · controller_kind: unknown 0.83 / modal_controller 0.12
- `DeviceCardController` controller — `src/app/device/index.js` · controller_kind=unknown · controller_kind: unknown 0.73 / widget_controller 0.19
- `DeviceController` controller — `src/app/device/index.js` · controller_kind=unknown · concerns: data_access · also reaches: data_access · controller_kind: unknown 0.80 / page_controller 0.14
- `ManageDeviceCredentialsController` controller — `src/app/device/index.js` · controller_kind=unknown · concerns: auth · also reaches: platform_cross_cutting · controller_kind: unknown 0.86 / modal_controller 0.10
- `tbDatasourceEntity` directive — `src/app/components/datasource-entity.directive.js` · directive_kind=dom_manipulation · concerns: business_rules, data_access, external_integration, ui_rendering, user_input, validation, workflow · also reaches: application_orchestration, data_access, external_integration, domain_logic · controller_kind: widget_controller 0.52 / form_controller 0.35
- `<dynamic:tbEventDirectives>` directive — `src/app/components/tb-event-directives.js` · directive_kind=dom_manipulation · concerns: user_input · directive_kind: dom_manipulation 0.54 / attribute_behaviour 0.46
- `ItemCardController` controller — `src/app/components/grid.directive.js` · controller_kind=widget_controller · controller_kind: widget_controller 0.36 / other 0.29
- `tbGridCardContent` directive — `src/app/components/grid.directive.js` · directive_kind=dom_manipulation · concerns: ui_rendering · controller_kind: list_grid_controller 0.36 / other 0.32
- `tbNavTree` directive — `src/app/components/nav-tree.directive.js` · directive_kind=dom_manipulation · concerns: external_integration, ui_rendering, user_input · also reaches: external_integration · directive_kind: dom_manipulation 0.53 / element_with_template 0.47
- `AliasesEntitySelectPanelController` controller — `src/app/entity/index.js` · controller_kind=unknown · controller_kind: unknown 0.58 / widget_controller 0.28
- `EntityAliasesController` controller — `src/app/entity/index.js` · controller_kind=unknown · controller_kind: unknown 0.83 / list_grid_controller 0.08
- `tbEntityList` directive — `src/app/entity/index.js` · directive_kind=unknown · concerns: ui_rendering · directive_kind: unknown 0.66 / attribute_behaviour 0.29
- `tbEntitySubtypeList` directive — `src/app/entity/index.js` · directive_kind=unknown · concerns: ui_rendering · directive_kind: unknown 0.72 / attribute_behaviour 0.23
- `tbEntityTypeList` directive — `src/app/entity/index.js` · directive_kind=unknown · concerns: ui_rendering · directive_kind: unknown 0.75 / attribute_behaviour 0.20
- `tbRelationTable` directive — `src/app/entity/index.js` · directive_kind=unknown · concerns: ui_rendering · directive_kind: unknown 0.67 / attribute_behaviour 0.27
- `AddEntityViewsToCustomerController` controller — `src/app/entity-view/index.js` · controller_kind=unknown · controller_kind: unknown 0.87 / modal_controller 0.10
- `EntityViewCardController` controller — `src/app/entity-view/index.js` · controller_kind=unknown · controller_kind: unknown 0.75 / widget_controller 0.18
- `tbExtensionFormHttp` directive — `src/app/extension/index.js` · directive_kind=unknown · directive_kind: unknown 0.62 / attribute_behaviour 0.30
- `tbExtensionFormModbus` directive — `src/app/extension/index.js` · directive_kind=unknown · directive_kind: unknown 0.67 / attribute_behaviour 0.22
- `tbExtensionFormMqtt` directive — `src/app/extension/index.js` · directive_kind=unknown · directive_kind: unknown 0.69 / attribute_behaviour 0.24
- `tbExtensionFormOpc` directive — `src/app/extension/index.js` · directive_kind=unknown · directive_kind: unknown 0.62 / attribute_behaviour 0.30
- `tbExtensionTable` directive — `src/app/extension/index.js` · directive_kind=unknown · concerns: ui_rendering · directive_kind: unknown 0.67 / attribute_behaviour 0.24
- `HomeLinksController` controller — `src/app/home/index.js` · controller_kind=unknown · controller_kind: unknown 0.82 / page_controller 0.17
- `importExport` factory — `src/app/import-export/index.js` · service_kind=unknown · service_state: unknown 0.90 / stateless 0.09
- `bufferStore` factory — `src/app/services/item-buffer.service.js` · service_kind=state_store · concerns: external_integration, shared_state · also reaches: external_integration · service_state: stateless 0.54 / shared_mutable_state 0.40
- `itembuffer` factory — `src/app/services/item-buffer.service.js` · service_kind=workflow_coordinator · concerns: business_rules, shared_state, workflow · also reaches: state_management, domain_logic · service_kind: workflow_coordinator 0.47 / ui_helper 0.34
- `JsonFormController` controller — `src/app/jsonform/index.js` · controller_kind=unknown · controller_kind: unknown 0.79 / form_controller 0.11
- `LoginController` controller — `src/app/login/index.js` · controller_kind=entry_flow_controller · concerns: auth, data_access, user_input · also reaches: platform_cross_cutting, data_access · controller_kind: entry_flow_controller 0.38 / unknown 0.32
- `ResetPasswordController` controller — `src/app/login/index.js` · controller_kind=unknown · concerns: auth · also reaches: platform_cross_cutting · controller_kind: unknown 0.82 / page_controller 0.09
- `ResetPasswordRequestController` controller — `src/app/login/index.js` · controller_kind=unknown · concerns: auth · also reaches: platform_cross_cutting · controller_kind: unknown 0.61 / form_controller 0.33
- `tbQueueTypeList` directive — `src/app/components/queue/index.js` · directive_kind=unknown · concerns: ui_rendering · directive_kind: unknown 0.73 / attribute_behaviour 0.24
- `RuleChainsController` controller — `src/app/rulechain/index.js` · controller_kind=unknown · controller_kind: unknown 0.69 / list_grid_controller 0.20
- `ruleNodeScriptTest` factory — `src/app/rulechain/index.js` · service_kind=unknown · service_state: unknown 0.92 / stateless 0.07
- `ToastController` controller — `src/app/services/toast.js` · controller_kind=unknown · controller_kind: unknown 0.64 / modal_controller 0.19
- `toast` factory — `src/app/services/toast.js` · service_kind=unknown · service_kind: unknown 0.58 / ui_helper 0.32; service_state: unknown 0.87 / stateless 0.08
- `AddUserController` controller — `src/app/user/index.js` · controller_kind=unknown · controller_kind: unknown 0.82 / form_controller 0.11
- `SelectWidgetTypeController` controller — `src/app/widget/index.js` · controller_kind=unknown · controller_kind: unknown 0.76 / modal_controller 0.14
- `WidgetsBundleController` controller — `src/app/widget/index.js` · controller_kind=unknown · controller_kind: unknown 0.65 / page_controller 0.24
- `tbKnob` directive — `src/app/widget/lib/rpc/knob.directive.js` · directive_kind=dom_manipulation · concerns: business_rules, data_access, errors_logging, external_integration, formatting, ui_rendering, user_input · also reaches: data_access, external_integration, domain_logic, platform_cross_cutting · directive_kind: dom_manipulation 0.51 / element_with_template 0.49

## `application_orchestration` — 1 units

- `itembuffer` factory — `src/app/services/item-buffer.service.js` · service_kind=workflow_coordinator · concerns: business_rules, shared_state, workflow · also reaches: state_management, domain_logic

## `bootstrap_composition` — 142 units

- `tbJsonToString` module — `src/app/components/tb-json-to-string.directive.js`
- `thingsboard.admin` module — `src/app/admin/index.js`
- `thingsboard.alarm` module — `src/app/alarm/index.js`
- `thingsboard.api.admin` module — `src/app/api/admin.service.js`
- `thingsboard.api.alarm` module — `src/app/api/alarm.service.js`
- `thingsboard.api.asset` module — `src/app/api/asset.service.js`
- `thingsboard.api.attribute` module — `src/app/api/attribute.service.js`
- `thingsboard.api.auditLog` module — `src/app/api/audit-log.service.js`
- `thingsboard.api.componentDescriptor` module — `src/app/api/component-descriptor.service.js`
- `thingsboard.api.customer` module — `src/app/api/customer.service.js`
- `thingsboard.api.dashboard` module — `src/app/api/dashboard.service.js`
- `thingsboard.api.datasource` module — `src/app/api/datasource.service.js`
- `thingsboard.api.device` module — `src/app/api/device.service.js`
- `thingsboard.api.entity` module — `src/app/api/entity.service.js`
- `thingsboard.api.entityRelation` module — `src/app/api/entity-relation.service.js`
- `thingsboard.api.entityView` module — `src/app/api/entity-view.service.js`
- `thingsboard.api.event` module — `src/app/api/event.service.js`
- `thingsboard.api.login` module — `src/app/api/login.service.js`
- `thingsboard.api.queue` module — `src/app/api/queue.service.js`
- `thingsboard.api.ruleChain` module — `src/app/api/rule-chain.service.js`
- `thingsboard.api.telemetryWebsocket` module — `src/app/api/telemetry-websocket.service.js`
- `thingsboard.api.tenant` module — `src/app/api/tenant.service.js`
- `thingsboard.api.time` module — `src/app/api/time.service.js`
- `thingsboard.api.user` module — `src/app/api/user.service.js`
- `thingsboard.api.widget` module — `src/app/api/widget.service.js`
- `thingsboard.asset` module — `src/app/asset/index.js`
- `thingsboard.auditLog` module — `src/app/audit/index.js`
- `thingsboard.clipboard` module — `src/app/services/clipboard.service.js`
- `thingsboard.customer` module — `src/app/customer/index.js`
- `thingsboard.dashboard.layouts` module — `src/app/dashboard/layouts/index.js`
- `thingsboard.dashboard.states` module — `src/app/dashboard/states/index.js`
- `thingsboard.dashboard` module — `src/app/dashboard/index.js`
- `thingsboard.dashboardUtils` module — `src/app/common/dashboard-utils.service.js`
- `thingsboard.device` module — `src/app/device/index.js`
- `thingsboard.dialogs.datakeyConfigDialog` module — `src/app/components/datakey-config-dialog.controller.js`
- `thingsboard.directives.circularProgress` module — `src/app/components/circular-progress.directive.js`
- `thingsboard.directives.confirmOnExit` module — `src/app/components/confirm-on-exit.directive.js`
- `thingsboard.directives.contact` module — `src/app/components/contact.directive.js`
- `thingsboard.directives.customActionPrettyEditor` module — `src/app/components/widget/action/custom-action-pretty-editor.directive.js`
- `thingsboard.directives.dashboard` module — `src/app/components/dashboard.directive.js`
- `thingsboard.directives.dashboardAutocomplete` module — `src/app/components/dashboard-autocomplete.directive.js`
- `thingsboard.directives.dashboardSelect` module — `src/app/components/dashboard-select.directive.js`
- `thingsboard.directives.datakeyConfig` module — `src/app/components/datakey-config.directive.js`
- `thingsboard.directives.datasource` module — `src/app/components/datasource.directive.js`
- `thingsboard.directives.datasourceEntity` module — `src/app/components/datasource-entity.directive.js`
- `thingsboard.directives.datasourceFunc` module — `src/app/components/datasource-func.directive.js`
- `thingsboard.directives.datetimePeriod` module — `src/app/components/datetime-period.directive.js`
- `thingsboard.directives.detailsSidenav` module — `src/app/components/details-sidenav.directive.js`
- `thingsboard.directives.entityAliasSelect` module — `src/app/components/entity-alias-select.directive.js`
- `thingsboard.directives.event` module — `src/app/components/tb-event-directives.js`
- `thingsboard.directives.expandFullscreen` module — `src/app/components/expand-fullscreen.directive.js`
- `thingsboard.directives.finishRender` module — `src/app/components/finish-render.directive.js`
- `thingsboard.directives.gatewayConfig` module — `src/app/components/gateway/gateway-config.directive.js`
- `thingsboard.directives.gatewayConfigSelect` module — `src/app/components/gateway/gateway-config-select.directive.js`
- `thingsboard.directives.gatewayForm` module — `src/app/components/gateway/gateway-form.directive.js`
- `thingsboard.directives.grid` module — `src/app/components/grid.directive.js`
- `thingsboard.directives.help` module — `src/app/help/help.directive.js`
- `thingsboard.directives.jsFunc` module — `src/app/components/js-func.directive.js`
- `thingsboard.directives.jsonContent` module — `src/app/components/json-content.directive.js`
- `thingsboard.directives.jsonForm` module — `src/app/components/json-form.directive.js`
- `thingsboard.directives.jsonObjectEdit` module — `src/app/components/json-object-edit.directive.js`
- `thingsboard.directives.keyValMap` module — `src/app/components/kv-map.directive.js`
- `thingsboard.directives.ledLight` module — `src/app/components/led-light.directive.js`
- `thingsboard.directives.legend` module — `src/app/components/legend.directive.js`
- `thingsboard.directives.legendConfig` module — `src/app/components/legend-config.directive.js`
- `thingsboard.directives.materialIconSelect` module — `src/app/components/material-icon-select.directive.js`
- `thingsboard.directives.mdChipDraggable` module — `src/app/components/md-chip-draggable.directive.js`
- `thingsboard.directives.menuLink` module — `src/app/components/menu-link.directive.js`
- `thingsboard.directives.mousepointMenu` module — `src/app/components/mousepoint-menu.directive.js`
- `thingsboard.directives.navTree` module — `src/app/components/nav-tree.directive.js`
- `thingsboard.directives.noAnimate` module — `src/app/components/no-animate.directive.js`
- `thingsboard.directives.relatedEntityAutocomplete` module — `src/app/components/related-entity-autocomplete.directive.js`
- `thingsboard.directives.scopeElement` module — `src/app/components/scope-element.directive.js`
- `thingsboard.directives.sideMenu` module — `src/app/components/side-menu.directive.js`
- `thingsboard.directives.socialsharePanel` module — `src/app/components/socialshare-panel.directive.js`
- `thingsboard.directives.timeinterval` module — `src/app/components/timeinterval.directive.js`
- `thingsboard.directives.timewindow` module — `src/app/components/timewindow.directive.js`
- `thingsboard.directives.usermenu` module — `src/app/layout/user-menu.directive.js`
- `thingsboard.directives.widget` module — `src/app/components/widget/widget.directive.js`
- `thingsboard.directives.widgetActions` module — `src/app/components/widget/action/manage-widget-actions.directive.js`
- `thingsboard.directives.widgetConfig` module — `src/app/components/widget/widget-config.directive.js`
- `thingsboard.directives.widgetsBundleSelect` module — `src/app/components/widgets-bundle-select.directive.js`
- `thingsboard.entity` module — `src/app/entity/index.js`
- `thingsboard.entityView` module — `src/app/entity-view/index.js`
- `thingsboard.event` module — `src/app/event/index.js`
- `thingsboard.extension` module — `src/app/extension/index.js`
- `thingsboard.filters.contactShort` module — `src/app/components/contact-short.filter.js`
- `thingsboard.filters.keyboardShortcut` module — `src/app/components/keyboard-shortcut.filter.js`
- `thingsboard.filters.truncate` module — `src/app/components/truncate.filter.js`
- `thingsboard.help` module — `src/app/help/help-links.constant.js`
- `thingsboard.home` module — `src/app/layout/index.js`
- `thingsboard.homeLinks` module — `src/app/home/index.js`
- `thingsboard.importexport` module — `src/app/import-export/index.js`
- `thingsboard.itembuffer` module — `src/app/services/item-buffer.service.js`
- `thingsboard.jsonform` module — `src/app/jsonform/index.js`
- `thingsboard.locale` module — `src/app/locale/translate-handler.js`
- `thingsboard.login` module — `src/app/login/index.js`
- `thingsboard.menu` module — `src/app/services/menu.service.js`
- `thingsboard.profile` module — `src/app/profile/index.js`
- `thingsboard.queue` module — `src/app/components/queue/index.js`
- `thingsboard.raf` module — `src/app/common/raf.provider.js`
- `thingsboard.ruleChain` module — `src/app/rulechain/index.js`
- `thingsboard.tenant` module — `src/app/tenant/index.js`
- `thingsboard.thirdpartyFix` module — `src/app/common/thirdparty-fix.js`
- `thingsboard.toast` module — `src/app/services/toast.js`
- `thingsboard.types` module — `src/app/common/types.constant.js`
- `thingsboard.user` module — `src/app/user/index.js`
- `thingsboard.utils` module — `src/app/common/utils.service.js`
- `thingsboard.widget-library` module — `src/app/widget/index.js`
- `thingsboard.widgets.alarmsTableWidget` module — `src/app/widget/lib/alarms-table-widget.js`
- `thingsboard.widgets.dateRangeNavigator` module — `src/app/widget/lib/date-range-navigator/date-range-navigator.js`
- `thingsboard.widgets.entitiesHierarchyWidget` module — `src/app/widget/lib/entities-hierarchy-widget.js`
- `thingsboard.widgets.entitiesTableWidget` module — `src/app/widget/lib/entities-table-widget.js`
- `thingsboard.widgets.extensionsTableWidget` module — `src/app/widget/lib/extensions-table-widget.js`
- `thingsboard.widgets.multipleInputWidget` module — `src/app/widget/lib/multiple-input-widget.js`
- `thingsboard.widgets.rpc.knob` module — `src/app/widget/lib/rpc/knob.directive.js`
- `thingsboard.widgets.rpc.ledIndicator` module — `src/app/widget/lib/rpc/led-indicator.directive.js`
- `thingsboard.widgets.rpc.roundSwitch` module — `src/app/widget/lib/rpc/round-switch.directive.js`
- `thingsboard.widgets.rpc.switch` module — `src/app/widget/lib/rpc/switch.directive.js`
- `thingsboard.widgets.rpc` module — `src/app/widget/lib/rpc/index.js`
- `thingsboard.widgets.timeseriesTableWidget` module — `src/app/widget/lib/timeseries-table-widget.js`
- `thingsboard.widgets.tripAnimation` module — `src/app/widget/lib/tripAnimation/trip-animation-widget.js`
- `thingsboard.widgets.webCameraWidget` module — `src/app/widget/lib/web-camera-input-widget.js`
- `thingsboard` module — `src/app/app.js`
- `<config@27>` config — `src/app/admin/index.js`
- `<config@28>` config — `src/app/asset/index.js`
- `<config@23>` config — `src/app/audit/index.js`
- `<config@26>` config — `src/app/customer/index.js`
- `<config@50>` config — `src/app/dashboard/index.js`
- `<config@29>` config — `src/app/device/index.js`
- `<config@28>` config — `src/app/entity-view/index.js`
- `<config@67>` config — `src/app/layout/index.js`
- `<config@21>` config — `src/app/home/index.js`
- `<config@24>` config — `src/app/jsonform/index.js`
- `<config@29>` config — `src/app/login/index.js`
- `<config@27>` config — `src/app/profile/index.js`
- `<config@28>` config — `src/app/rulechain/index.js`
- `<config@26>` config — `src/app/tenant/index.js`
- `<config@27>` config — `src/app/user/index.js`
- `<config@40>` config — `src/app/widget/index.js`
- `<config@107>` config — `src/app/app.js`
- `<run@107>` run — `src/app/app.js`

## `data_access` — 19 units

- `adminService` factory — `src/app/api/admin.service.js` · service_kind=data_access_client · concerns: data_access
- `alarmService` factory — `src/app/api/alarm.service.js` · service_kind=data_access_client · concerns: business_rules, data_access, shared_state · also reaches: state_management, domain_logic
- `assetService` factory — `src/app/api/asset.service.js` · service_kind=data_access_client · concerns: auth, business_rules, data_access, workflow · also reaches: platform_cross_cutting, application_orchestration, domain_logic
- `attributeService` factory — `src/app/api/attribute.service.js` · service_kind=data_access_client · concerns: business_rules, data_access, external_integration, shared_state, workflow · also reaches: application_orchestration, state_management, external_integration, domain_logic
- `auditLogService` factory — `src/app/api/audit-log.service.js` · service_kind=data_access_client · concerns: data_access
- `componentDescriptorService` factory — `src/app/api/component-descriptor.service.js` · service_kind=data_access_client · concerns: data_access, shared_state · also reaches: state_management
- `customerService` factory — `src/app/api/customer.service.js` · service_kind=data_access_client · concerns: business_rules, data_access, workflow · also reaches: application_orchestration, domain_logic
- `dashboardService` factory — `src/app/api/dashboard.service.js` · service_kind=data_access_client · concerns: business_rules, data_access, formatting, shared_state · also reaches: state_management, domain_logic
- `datasourceService` factory — `src/app/api/datasource.service.js` · service_kind=data_access_client · concerns: business_rules, data_access, external_integration, formatting, shared_state, workflow · also reaches: application_orchestration, state_management, external_integration, domain_logic
- `deviceService` factory — `src/app/api/device.service.js` · service_kind=data_access_client · concerns: auth, data_access, shared_state, workflow · also reaches: platform_cross_cutting, application_orchestration, state_management
- `entityService` factory — `src/app/api/entity.service.js` · service_kind=data_access_client · concerns: business_rules, data_access, errors_logging, formatting, validation, workflow · also reaches: application_orchestration, domain_logic, platform_cross_cutting
- `entityRelationService` factory — `src/app/api/entity-relation.service.js` · service_kind=data_access_client · concerns: data_access
- `entityViewService` factory — `src/app/api/entity-view.service.js` · service_kind=data_access_client · concerns: data_access, shared_state, workflow · also reaches: application_orchestration, state_management
- `eventService` factory — `src/app/api/event.service.js` · service_kind=data_access_client · concerns: data_access
- `queueService` factory — `src/app/api/queue.service.js` · service_kind=data_access_client · concerns: data_access
- `ruleChainService` factory — `src/app/api/rule-chain.service.js` · service_kind=data_access_client · concerns: business_rules, data_access, errors_logging, shared_state, workflow · also reaches: application_orchestration, state_management, domain_logic, platform_cross_cutting
- `telemetryWebsocketService` factory — `src/app/api/telemetry-websocket.service.js` · service_kind=data_access_client · concerns: auth, business_rules, data_access, errors_logging, external_integration, shared_state, workflow · also reaches: platform_cross_cutting, application_orchestration, state_management, external_integration, domain_logic
- `tenantService` factory — `src/app/api/tenant.service.js` · service_kind=data_access_client · concerns: data_access
- `widgetService` factory — `src/app/api/widget.service.js` · service_kind=data_access_client · concerns: business_rules, data_access, errors_logging, external_integration, formatting, shared_state, workflow · also reaches: application_orchestration, state_management, external_integration, domain_logic, platform_cross_cutting

## `domain_logic` — 2 units

- `timeService` factory — `src/app/api/time.service.js` · service_kind=business_logic · concerns: business_rules, data_access, formatting, shared_state, validation · also reaches: state_management, data_access
- `dashboardUtils` factory — `src/app/common/dashboard-utils.service.js` · service_kind=business_logic · concerns: business_rules, validation, workflow · also reaches: application_orchestration

## `external_integration` — 3 units

- `clipboardService` factory — `src/app/services/clipboard.service.js` · service_kind=integration_wrapper · concerns: external_integration, user_input
- `tbRaf` provider — `src/app/common/raf.provider.js` · service_kind=integration_wrapper · concerns: external_integration
- `Fullscreen` factory — `src/app/common/thirdparty-fix.js` · service_kind=integration_wrapper · concerns: external_integration, shared_state · also reaches: state_management

## `navigation_routing` — 36 units

- `dashboard` ui-router — `src/app/dashboard/dashboard.routes.js`
- `home.assets` ui-router — `src/app/asset/asset.routes.js`
- `home.auditLogs` ui-router — `src/app/audit/audit-log.routes.js`
- `home.customers.assets` ui-router — `src/app/asset/asset.routes.js`
- `home.customers.dashboards.dashboard` ui-router — `src/app/dashboard/dashboard.routes.js`
- `home.customers.dashboards` ui-router — `src/app/dashboard/dashboard.routes.js`
- `home.customers.devices` ui-router — `src/app/device/device.routes.js`
- `home.customers.entityViews` ui-router — `src/app/entity-view/entity-view.routes.js`
- `home.customers.users` ui-router — `src/app/user/user.routes.js`
- `home.customers` ui-router — `src/app/customer/customer.routes.js`
- `home.dashboards.dashboard` ui-router — `src/app/dashboard/dashboard.routes.js`
- `home.dashboards` ui-router — `src/app/dashboard/dashboard.routes.js`
- `home.devices` ui-router — `src/app/device/device.routes.js`
- `home.entityViews` ui-router — `src/app/entity-view/entity-view.routes.js`
- `home.jsonform` ui-router — `src/app/jsonform/jsonform.routes.js`
- `home.links` ui-router — `src/app/home/home-links.routes.js`
- `home.profile` ui-router — `src/app/profile/profile.routes.js`
- `home.ruleChains.importRuleChain` ui-router — `src/app/rulechain/rulechain.routes.js`
- `home.ruleChains.ruleChain` ui-router — `src/app/rulechain/rulechain.routes.js`
- `home.ruleChains` ui-router — `src/app/rulechain/rulechain.routes.js`
- `home.settings.general` ui-router — `src/app/admin/admin.routes.js`
- `home.settings.outgoing-mail` ui-router — `src/app/admin/admin.routes.js`
- `home.settings.security-settings` ui-router — `src/app/admin/admin.routes.js`
- `home.settings` ui-router — `src/app/admin/admin.routes.js`
- `home.tenants.users` ui-router — `src/app/user/user.routes.js`
- `home.tenants` ui-router — `src/app/tenant/tenant.routes.js`
- `home.widgets-bundles.widget-types.widget-type` ui-router — `src/app/widget/widget-library.routes.js`
- `home.widgets-bundles.widget-types` ui-router — `src/app/widget/widget-library.routes.js`
- `home.widgets-bundles` ui-router — `src/app/widget/widget-library.routes.js`
- `home` ui-router — `src/app/layout/home.routes.js`
- `login.createPassword` ui-router — `src/app/login/login.routes.js`
- `login.resetExpiredPassword` ui-router — `src/app/login/login.routes.js`
- `login.resetPassword` ui-router — `src/app/login/login.routes.js`
- `login.resetPasswordRequest` ui-router — `src/app/login/login.routes.js`
- `login` ui-router — `src/app/login/login.routes.js`
- `widgetEditor` ui-router — `src/app/widget/widget-library.routes.js`

## `platform_cross_cutting` — 4 units

- `loginService` factory — `src/app/api/login.service.js` · service_kind=auth_session · concerns: auth, data_access, shared_state · also reaches: state_management, data_access
- `userService` factory — `src/app/api/user.service.js` · service_kind=auth_session · concerns: auth, business_rules, data_access, errors_logging, navigation, shared_state, workflow · also reaches: navigation_routing, application_orchestration, state_management, data_access, domain_logic
- `tbMissingTranslationHandler` factory — `src/app/locale/translate-handler.js` · service_kind=infrastructure
- `globalInterceptor` factory — `src/app/app.js` · service_kind=infrastructure · concerns: auth, shared_state · also reaches: state_management

## `presentation` — 199 units

- `tbJsonToString` directive — `src/app/components/tb-json-to-string.directive.js` · directive_kind=attribute_behaviour · concerns: errors_logging, formatting, ui_rendering, user_input, validation · also reaches: platform_cross_cutting
- `AdminController` controller — `src/app/admin/index.js` · controller_kind=page_controller
- `SecuritySettingsController` controller — `src/app/admin/index.js` · controller_kind=unknown · concerns: auth · also reaches: platform_cross_cutting
- `AlarmDetailsDialogController` controller — `src/app/alarm/index.js` · controller_kind=modal_controller
- `tbAlarmHeader` directive — `src/app/alarm/index.js` · directive_kind=attribute_behaviour · concerns: ui_rendering
- `tbAlarmRow` directive — `src/app/alarm/index.js` · directive_kind=unknown · concerns: ui_rendering
- `tbAlarmTable` directive — `src/app/alarm/index.js` · directive_kind=attribute_behaviour · concerns: ui_rendering
- `AddAssetsToCustomerController` controller — `src/app/asset/index.js` · controller_kind=modal_controller
- `AssetCardController` controller — `src/app/asset/index.js` · controller_kind=unknown
- `AssetController` controller — `src/app/asset/index.js` · controller_kind=unknown · concerns: data_access · also reaches: data_access
- `AssignAssetToCustomerController` controller — `src/app/asset/index.js` · controller_kind=modal_controller
- `tbAsset` directive — `src/app/asset/index.js` · directive_kind=attribute_behaviour
- `AuditLogDetailsDialogController` controller — `src/app/audit/index.js` · controller_kind=modal_controller
- `AuditLogsController` controller — `src/app/audit/index.js` · controller_kind=unknown
- `tbAuditLogHeader` directive — `src/app/audit/index.js` · directive_kind=attribute_behaviour
- `tbAuditLogRow` directive — `src/app/audit/index.js` · directive_kind=attribute_behaviour
- `tbAuditLogTable` directive — `src/app/audit/index.js` · directive_kind=attribute_behaviour
- `CustomerController` controller — `src/app/customer/index.js` · controller_kind=page_controller
- `tbCustomer` directive — `src/app/customer/index.js` · directive_kind=attribute_behaviour
- `ManageDashboardLayoutsController` controller — `src/app/dashboard/layouts/index.js` · controller_kind=unknown
- `SelectTargetLayoutController` controller — `src/app/dashboard/layouts/index.js` · controller_kind=modal_controller
- `tbDashboardLayout` directive — `src/app/dashboard/layouts/index.js` · directive_kind=attribute_behaviour
- `DashboardStateDialogController` controller — `src/app/dashboard/states/index.js` · controller_kind=modal_controller
- `ManageDashboardStatesController` controller — `src/app/dashboard/states/index.js` · controller_kind=unknown
- `SelectTargetStateController` controller — `src/app/dashboard/states/index.js` · controller_kind=unknown
- `tbStatesComponent` directive — `src/app/dashboard/states/index.js` · directive_kind=attribute_behaviour · concerns: ui_rendering
- `AddDashboardsToCustomerController` controller — `src/app/dashboard/index.js` · controller_kind=unknown
- `AddWidgetController` controller — `src/app/dashboard/index.js` · controller_kind=modal_controller
- `DashboardCardController` controller — `src/app/dashboard/index.js` · controller_kind=unknown
- `DashboardController` controller — `src/app/dashboard/index.js` · controller_kind=page_controller · concerns: business_rules, data_access, user_input · also reaches: data_access, domain_logic
- `DashboardSettingsController` controller — `src/app/dashboard/index.js` · controller_kind=unknown
- `DashboardsController` controller — `src/app/dashboard/index.js` · controller_kind=page_controller · concerns: data_access · also reaches: data_access
- `MakeDashboardPublicDialogController` controller — `src/app/dashboard/index.js` · controller_kind=modal_controller
- `ManageAssignedCustomersController` controller — `src/app/dashboard/index.js` · controller_kind=unknown
- `tbDashboardDetails` directive — `src/app/dashboard/index.js` · directive_kind=attribute_behaviour · concerns: ui_rendering
- `tbDashboardToolbar` directive — `src/app/dashboard/index.js` · directive_kind=attribute_behaviour
- `tbEditWidget` directive — `src/app/dashboard/index.js` · directive_kind=attribute_behaviour · concerns: user_input
- `AddDevicesToCustomerController` controller — `src/app/device/index.js` · controller_kind=unknown
- `AssignDeviceToCustomerController` controller — `src/app/device/index.js` · controller_kind=unknown
- `DeviceCardController` controller — `src/app/device/index.js` · controller_kind=unknown
- `DeviceController` controller — `src/app/device/index.js` · controller_kind=unknown · concerns: data_access · also reaches: data_access
- `ManageDeviceCredentialsController` controller — `src/app/device/index.js` · controller_kind=unknown · concerns: auth · also reaches: platform_cross_cutting
- `tbDevice` directive — `src/app/device/index.js` · directive_kind=attribute_behaviour
- `DatakeyConfigDialogController` controller — `src/app/components/datakey-config-dialog.controller.js` · controller_kind=modal_controller · concerns: business_rules, data_access, user_input, validation, workflow · also reaches: application_orchestration, data_access, domain_logic
- `tbCircularProgress` directive — `src/app/components/circular-progress.directive.js` · directive_kind=dom_manipulation · concerns: external_integration, ui_rendering · also reaches: external_integration
- `tbConfirmOnExit` directive — `src/app/components/confirm-on-exit.directive.js` · directive_kind=attribute_behaviour · concerns: auth, business_rules, external_integration, formatting, navigation, shared_state, user_input, workflow · also reaches: navigation_routing, platform_cross_cutting, application_orchestration, state_management, external_integration, domain_logic
- `tbContact` directive — `src/app/components/contact.directive.js` · directive_kind=dom_manipulation · concerns: ui_rendering
- `tbCustomActionPrettyEditor` directive — `src/app/components/widget/action/custom-action-pretty-editor.directive.js` · directive_kind=dom_manipulation · concerns: external_integration, formatting, ui_rendering, user_input · also reaches: external_integration
- `tbDashboard` directive — `src/app/components/dashboard.directive.js` · directive_kind=element_with_template · concerns: business_rules, data_access, external_integration, formatting, shared_state, ui_rendering, user_input, workflow · also reaches: application_orchestration, state_management, data_access, external_integration, domain_logic
- `tbDashboardAutocomplete` directive — `src/app/components/dashboard-autocomplete.directive.js` · directive_kind=dom_manipulation · concerns: auth, business_rules, data_access, ui_rendering, workflow · also reaches: platform_cross_cutting, application_orchestration, data_access, domain_logic
- `DashboardSelectPanelController` controller — `src/app/components/dashboard-select.directive.js` · controller_kind=modal_controller · concerns: business_rules, ui_rendering, user_input · also reaches: domain_logic
- `tbDashboardSelect` directive — `src/app/components/dashboard-select.directive.js` · directive_kind=dom_manipulation · concerns: auth, business_rules, data_access, ui_rendering, user_input · also reaches: platform_cross_cutting, data_access, domain_logic
- `tbDatakeyConfig` directive — `src/app/components/datakey-config.directive.js` · directive_kind=dom_manipulation · concerns: business_rules, data_access, ui_rendering, user_input · also reaches: data_access, domain_logic
- `tbDatasource` directive — `src/app/components/datasource.directive.js` · directive_kind=dom_manipulation · concerns: business_rules, ui_rendering · also reaches: domain_logic
- `tbDatasourceEntity` directive — `src/app/components/datasource-entity.directive.js` · directive_kind=dom_manipulation · concerns: business_rules, data_access, external_integration, ui_rendering, user_input, validation, workflow · also reaches: application_orchestration, data_access, external_integration, domain_logic
- `tbDatasourceFunc` directive — `src/app/components/datasource-func.directive.js` · directive_kind=dom_manipulation · concerns: business_rules, external_integration, ui_rendering, user_input, validation, workflow · also reaches: application_orchestration, external_integration, domain_logic
- `tbDatetimePeriod` directive — `src/app/components/datetime-period.directive.js` · directive_kind=dom_manipulation · concerns: business_rules, ui_rendering, validation · also reaches: domain_logic
- `tbDetailsSidenav` directive — `src/app/components/details-sidenav.directive.js` · directive_kind=dom_manipulation · concerns: ui_rendering, user_input
- `tbEntityAliasSelect` directive — `src/app/components/entity-alias-select.directive.js` · directive_kind=dom_manipulation · concerns: business_rules, ui_rendering, user_input, validation · also reaches: domain_logic
- `<dynamic:tbEventDirectives>` directive — `src/app/components/tb-event-directives.js` · directive_kind=dom_manipulation · concerns: user_input
- `tbExpandFullscreen` directive — `src/app/components/expand-fullscreen.directive.js` · directive_kind=dom_manipulation · concerns: formatting, shared_state, ui_rendering, user_input · also reaches: state_management
- `tbOnFinishRender` directive — `src/app/components/finish-render.directive.js` · directive_kind=attribute_behaviour
- `tbGatewayConfig` directive — `src/app/components/gateway/gateway-config.directive.js` · directive_kind=element_with_template · concerns: business_rules, errors_logging, external_integration, formatting, ui_rendering, user_input, validation, workflow · also reaches: application_orchestration, external_integration, domain_logic, platform_cross_cutting
- `tbGatewayConfigSelect` directive — `src/app/components/gateway/gateway-config-select.directive.js` · directive_kind=dom_manipulation · concerns: business_rules, ui_rendering, user_input, validation, workflow · also reaches: application_orchestration, domain_logic
- `tbGatewayForm` directive — `src/app/components/gateway/gateway-form.directive.js` · directive_kind=element_with_template · concerns: auth, business_rules, data_access, errors_logging, external_integration, formatting, shared_state, ui_rendering, user_input, workflow · also reaches: platform_cross_cutting, application_orchestration, state_management, data_access, external_integration, domain_logic
- `AddItemController` controller — `src/app/components/grid.directive.js` · controller_kind=modal_controller · concerns: data_access, user_input, workflow · also reaches: application_orchestration, data_access
- `ItemCardController` controller — `src/app/components/grid.directive.js` · controller_kind=widget_controller
- `tbGrid` directive — `src/app/components/grid.directive.js` · directive_kind=element_with_template · concerns: auth, business_rules, data_access, formatting, ui_rendering, user_input, workflow · also reaches: platform_cross_cutting, application_orchestration, data_access, domain_logic
- `tbGridCardContent` directive — `src/app/components/grid.directive.js` · directive_kind=dom_manipulation · concerns: ui_rendering
- `range` filter — `src/app/components/grid.directive.js`
- `tbHelp` directive — `src/app/help/help.directive.js` · directive_kind=dom_manipulation · concerns: external_integration, ui_rendering, user_input · also reaches: external_integration
- `tbJsFunc` directive — `src/app/components/js-func.directive.js` · directive_kind=dom_manipulation · concerns: business_rules, errors_logging, external_integration, ui_rendering, user_input, validation · also reaches: external_integration, domain_logic, platform_cross_cutting
- `tbJsonContent` directive — `src/app/components/json-content.directive.js` · directive_kind=dom_manipulation · concerns: business_rules, errors_logging, external_integration, formatting, ui_rendering, user_input, validation · also reaches: external_integration, domain_logic, platform_cross_cutting
- `MaterialIconsDialogController` controller — `src/app/components/json-form.directive.js` · controller_kind=modal_controller · concerns: external_integration, ui_rendering, user_input · also reaches: external_integration
- `tbJsonForm` directive — `src/app/components/json-form.directive.js` · directive_kind=dom_manipulation · concerns: external_integration, ui_rendering, user_input, validation, workflow · also reaches: application_orchestration, external_integration
- `tbJsonObjectEdit` directive — `src/app/components/json-object-edit.directive.js` · directive_kind=dom_manipulation · concerns: errors_logging, external_integration, formatting, ui_rendering, user_input, validation · also reaches: external_integration, platform_cross_cutting
- `tbKeyValMap` directive — `src/app/components/kv-map.directive.js` · directive_kind=element_with_template · concerns: ui_rendering, user_input
- `tbLedLight` directive — `src/app/components/led-light.directive.js` · directive_kind=dom_manipulation · concerns: external_integration, ui_rendering · also reaches: external_integration
- `tbLegend` directive — `src/app/components/legend.directive.js` · directive_kind=dom_manipulation · concerns: business_rules, ui_rendering · also reaches: domain_logic
- `LegendConfigPanelController` controller — `src/app/components/legend-config.directive.js` · controller_kind=modal_controller
- `tbLegendConfig` directive — `src/app/components/legend-config.directive.js` · directive_kind=dom_manipulation · concerns: external_integration, ui_rendering, user_input · also reaches: external_integration
- `MaterialIconsDialogController` controller — `src/app/components/material-icon-select.directive.js` · controller_kind=modal_controller · concerns: external_integration · also reaches: external_integration
- `tbMaterialIconSelect` directive — `src/app/components/material-icon-select.directive.js` · directive_kind=dom_manipulation · concerns: external_integration, ui_rendering, user_input · also reaches: external_integration
- `tbChipDraggable` directive — `src/app/components/md-chip-draggable.directive.js` · directive_kind=attribute_behaviour · concerns: external_integration, shared_state, ui_rendering, user_input · also reaches: state_management, external_integration
- `tbMenuLink` directive — `src/app/components/menu-link.directive.js` · directive_kind=dom_manipulation · concerns: business_rules, ui_rendering · also reaches: domain_logic
- `nospace` filter — `src/app/components/menu-link.directive.js` · concerns: formatting
- `tbMousepointMenu` directive — `src/app/components/mousepoint-menu.directive.js` · directive_kind=attribute_behaviour · concerns: shared_state, user_input · also reaches: state_management
- `tbNavTree` directive — `src/app/components/nav-tree.directive.js` · directive_kind=dom_manipulation · concerns: external_integration, ui_rendering, user_input · also reaches: external_integration
- `tbNoAnimate` directive — `src/app/components/no-animate.directive.js` · directive_kind=attribute_behaviour
- `tbRelatedEntityAutocomplete` directive — `src/app/components/related-entity-autocomplete.directive.js` · directive_kind=dom_manipulation · concerns: business_rules, data_access, ui_rendering, workflow · also reaches: application_orchestration, data_access, domain_logic
- `tbScopeElement` directive — `src/app/components/scope-element.directive.js` · directive_kind=attribute_behaviour
- `tbSideMenu` directive — `src/app/components/side-menu.directive.js` · directive_kind=dom_manipulation · concerns: shared_state, ui_rendering · also reaches: state_management
- `tbSocialSharePanel` directive — `src/app/components/socialshare-panel.directive.js` · directive_kind=element_with_template · concerns: business_rules, ui_rendering · also reaches: domain_logic
- `tbTimeinterval` directive — `src/app/components/timeinterval.directive.js` · directive_kind=dom_manipulation · concerns: business_rules, formatting, ui_rendering, user_input, validation · also reaches: domain_logic
- `TimewindowPanelController` controller — `src/app/components/timewindow.directive.js` · controller_kind=modal_controller · concerns: business_rules, ui_rendering · also reaches: domain_logic
- `tbTimewindow` directive — `src/app/components/timewindow.directive.js` · directive_kind=dom_manipulation · concerns: business_rules, external_integration, formatting, ui_rendering, user_input, workflow · also reaches: application_orchestration, external_integration, domain_logic
- `milliSecondsToTimeString` filter — `src/app/components/timewindow.directive.js` · concerns: business_rules, formatting · also reaches: domain_logic
- `tbUserMenu` directive — `src/app/layout/user-menu.directive.js` · directive_kind=element_with_template · concerns: auth, business_rules, formatting, navigation, shared_state, ui_rendering, user_input · also reaches: navigation_routing, platform_cross_cutting, state_management, domain_logic
- `WidgetController` controller — `src/app/components/widget/widget.directive.js` · controller_kind=widget_controller
- `tbWidget` directive — `src/app/components/widget/widget.directive.js` · directive_kind=dom_manipulation · concerns: business_rules, data_access, workflow · also reaches: application_orchestration, data_access, domain_logic
- `WidgetActionDialogController` controller — `src/app/components/widget/action/manage-widget-actions.directive.js` · controller_kind=modal_controller · concerns: business_rules, formatting, ui_rendering, user_input, workflow · also reaches: application_orchestration, domain_logic
- `tbManageWidgetActions` directive — `src/app/components/widget/action/manage-widget-actions.directive.js` · directive_kind=element_with_template · concerns: business_rules, formatting, ui_rendering, user_input, workflow · also reaches: application_orchestration, domain_logic
- `tbWidgetConfig` directive — `src/app/components/widget/widget-config.directive.js` · directive_kind=dom_manipulation · concerns: business_rules, external_integration, formatting, shared_state, ui_rendering, user_input, validation · also reaches: state_management, external_integration, domain_logic
- `tbWidgetsBundleSelect` directive — `src/app/components/widgets-bundle-select.directive.js` · directive_kind=dom_manipulation · concerns: business_rules, data_access, ui_rendering · also reaches: data_access, domain_logic
- `AddAttributeDialogController` controller — `src/app/entity/index.js` · controller_kind=modal_controller
- `AddWidgetToDashboardDialogController` controller — `src/app/entity/index.js` · controller_kind=modal_controller
- `AliasesEntitySelectPanelController` controller — `src/app/entity/index.js` · controller_kind=unknown
- `EntityAliasDialogController` controller — `src/app/entity/index.js` · controller_kind=modal_controller
- `EntityAliasesController` controller — `src/app/entity/index.js` · controller_kind=unknown
- `tbAliasesEntitySelect` directive — `src/app/entity/index.js` · directive_kind=attribute_behaviour · concerns: ui_rendering
- `tbAttributeTable` directive — `src/app/entity/index.js` · directive_kind=attribute_behaviour · concerns: ui_rendering
- `tbEntityAutocomplete` directive — `src/app/entity/index.js` · directive_kind=attribute_behaviour · concerns: user_input
- `tbEntityFilter` directive — `src/app/entity/index.js` · directive_kind=attribute_behaviour
- `tbEntityFilterView` directive — `src/app/entity/index.js` · directive_kind=attribute_behaviour · concerns: ui_rendering
- `tbEntityList` directive — `src/app/entity/index.js` · directive_kind=unknown · concerns: ui_rendering
- `tbEntitySelect` directive — `src/app/entity/index.js` · directive_kind=attribute_behaviour · concerns: ui_rendering
- `tbEntitySubtypeAutocomplete` directive — `src/app/entity/index.js` · directive_kind=attribute_behaviour
- `tbEntitySubtypeList` directive — `src/app/entity/index.js` · directive_kind=unknown · concerns: ui_rendering
- `tbEntitySubtypeSelect` directive — `src/app/entity/index.js` · directive_kind=attribute_behaviour
- `tbEntityTypeList` directive — `src/app/entity/index.js` · directive_kind=unknown · concerns: ui_rendering
- `tbEntityTypeSelect` directive — `src/app/entity/index.js` · directive_kind=attribute_behaviour · concerns: ui_rendering
- `tbRelationFilters` directive — `src/app/entity/index.js` · directive_kind=attribute_behaviour · concerns: ui_rendering
- `tbRelationTable` directive — `src/app/entity/index.js` · directive_kind=unknown · concerns: ui_rendering
- `tbRelationTypeAutocomplete` directive — `src/app/entity/index.js` · directive_kind=attribute_behaviour
- `AddEntityViewsToCustomerController` controller — `src/app/entity-view/index.js` · controller_kind=unknown
- `AssignEntityViewToCustomerController` controller — `src/app/entity-view/index.js` · controller_kind=modal_controller
- `EntityViewCardController` controller — `src/app/entity-view/index.js` · controller_kind=unknown
- `EntityViewController` controller — `src/app/entity-view/index.js` · controller_kind=page_controller · concerns: data_access · also reaches: data_access
- `tbEntityView` directive — `src/app/entity-view/index.js` · directive_kind=attribute_behaviour · concerns: ui_rendering
- `EventContentDialogController` controller — `src/app/event/index.js` · controller_kind=modal_controller
- `tbEventHeader` directive — `src/app/event/index.js` · directive_kind=attribute_behaviour · concerns: ui_rendering
- `tbEventRow` directive — `src/app/event/index.js` · directive_kind=attribute_behaviour
- `tbEventTable` directive — `src/app/event/index.js` · directive_kind=attribute_behaviour · concerns: ui_rendering
- `parseToNull` directive — `src/app/extension/index.js` · directive_kind=attribute_behaviour
- `tbExtensionFormHttp` directive — `src/app/extension/index.js` · directive_kind=unknown
- `tbExtensionFormModbus` directive — `src/app/extension/index.js` · directive_kind=unknown
- `tbExtensionFormMqtt` directive — `src/app/extension/index.js` · directive_kind=unknown
- `tbExtensionFormOpc` directive — `src/app/extension/index.js` · directive_kind=unknown
- `tbExtensionTable` directive — `src/app/extension/index.js` · directive_kind=unknown · concerns: ui_rendering
- `contactShort` filter — `src/app/components/contact-short.filter.js` · concerns: business_rules, formatting · also reaches: domain_logic
- `keyboardShortcut` filter — `src/app/components/keyboard-shortcut.filter.js` · concerns: external_integration, formatting · also reaches: external_integration
- `truncate` filter — `src/app/components/truncate.filter.js` · concerns: formatting
- `HomeController` controller — `src/app/layout/index.js` · controller_kind=page_controller
- `breadcrumbIcon` filter — `src/app/layout/index.js` · concerns: formatting
- `breadcrumbLabel` filter — `src/app/layout/index.js` · concerns: formatting
- `HomeLinksController` controller — `src/app/home/index.js` · controller_kind=unknown
- `ImportDialogCSVController` controller — `src/app/import-export/index.js` · controller_kind=modal_controller
- `ImportDialogController` controller — `src/app/import-export/index.js` · controller_kind=modal_controller
- `tbTableColumnsAssignment` directive — `src/app/import-export/index.js` · directive_kind=attribute_behaviour
- `JsonFormController` controller — `src/app/jsonform/index.js` · controller_kind=unknown
- `CreatePasswordController` controller — `src/app/login/index.js` · controller_kind=form_controller · concerns: auth, data_access · also reaches: platform_cross_cutting, data_access
- `LoginController` controller — `src/app/login/index.js` · controller_kind=entry_flow_controller · concerns: auth, data_access, user_input · also reaches: platform_cross_cutting, data_access
- `ResetPasswordController` controller — `src/app/login/index.js` · controller_kind=unknown · concerns: auth · also reaches: platform_cross_cutting
- `ResetPasswordRequestController` controller — `src/app/login/index.js` · controller_kind=unknown · concerns: auth · also reaches: platform_cross_cutting
- `menu` factory — `src/app/services/menu.service.js` · service_kind=ui_helper · concerns: auth, business_rules, data_access, shared_state · also reaches: platform_cross_cutting, state_management, data_access, domain_logic
- `ChangePasswordController` controller — `src/app/profile/index.js` · controller_kind=form_controller · concerns: auth · also reaches: platform_cross_cutting
- `ProfileController` controller — `src/app/profile/index.js` · controller_kind=page_controller
- `tbQueueTypeList` directive — `src/app/components/queue/index.js` · directive_kind=unknown · concerns: ui_rendering
- `AddRuleNodeController` controller — `src/app/rulechain/index.js` · controller_kind=modal_controller
- `AddRuleNodeLinkController` controller — `src/app/rulechain/index.js` · controller_kind=modal_controller
- `NodeScriptTestController` controller — `src/app/rulechain/index.js` · controller_kind=other
- `RuleChainController` controller — `src/app/rulechain/index.js` · controller_kind=page_controller
- `RuleChainsController` controller — `src/app/rulechain/index.js` · controller_kind=unknown
- `tbMessageTypeAutocomplete` directive — `src/app/rulechain/index.js` · directive_kind=attribute_behaviour · concerns: user_input
- `tbRuleChain` directive — `src/app/rulechain/index.js` · directive_kind=attribute_behaviour
- `tbRuleNode` directive — `src/app/rulechain/index.js` · directive_kind=attribute_behaviour
- `tbRuleNodeConfig` directive — `src/app/rulechain/index.js` · directive_kind=attribute_behaviour
- `tbRuleNodeDefinedConfig` directive — `src/app/rulechain/index.js` · directive_kind=attribute_behaviour
- `tbRuleNodeLink` directive — `src/app/rulechain/index.js` · directive_kind=attribute_behaviour
- `TenantController` controller — `src/app/tenant/index.js` · controller_kind=page_controller
- `tbTenant` directive — `src/app/tenant/index.js` · directive_kind=attribute_behaviour
- `$mdColorPicker` factory — `src/app/common/thirdparty-fix.js` · service_kind=ui_helper · concerns: external_integration, shared_state, ui_rendering, user_input, workflow · also reaches: application_orchestration, state_management, external_integration
- `$mdpDatePicker` provider — `src/app/common/thirdparty-fix.js` · service_kind=ui_helper · concerns: formatting, shared_state, ui_rendering, user_input, validation · also reaches: state_management
- `$mdpTimePicker` provider — `src/app/common/thirdparty-fix.js` · service_kind=ui_helper · concerns: formatting, ui_rendering, user_input
- `ToastController` controller — `src/app/services/toast.js` · controller_kind=unknown
- `ActivationLinkDialogController` controller — `src/app/user/index.js` · controller_kind=modal_controller · concerns: auth · also reaches: platform_cross_cutting
- `AddUserController` controller — `src/app/user/index.js` · controller_kind=unknown
- `UserController` controller — `src/app/user/index.js` · controller_kind=page_controller
- `tbUser` directive — `src/app/user/index.js` · directive_kind=attribute_behaviour
- `SaveWidgetTypeAsController` controller — `src/app/widget/index.js` · controller_kind=modal_controller · concerns: data_access, user_input · also reaches: data_access
- `SelectWidgetTypeController` controller — `src/app/widget/index.js` · controller_kind=unknown
- `WidgetEditorController` controller — `src/app/widget/index.js` · controller_kind=page_controller · concerns: user_input
- `WidgetLibraryController` controller — `src/app/widget/index.js` · controller_kind=page_controller
- `WidgetsBundleController` controller — `src/app/widget/index.js` · controller_kind=unknown
- `tbWidgetsBundle` directive — `src/app/widget/index.js` · directive_kind=attribute_behaviour
- `tbAlarmsTableWidget` directive — `src/app/widget/lib/alarms-table-widget.js` · directive_kind=element_with_template · concerns: business_rules, data_access, external_integration, formatting, ui_rendering, user_input, workflow · also reaches: application_orchestration, data_access, external_integration, domain_logic
- `dateRangeNavigatorWidget` directive — `src/app/widget/lib/date-range-navigator/date-range-navigator.js` · directive_kind=element_with_template · concerns: business_rules, formatting, shared_state, ui_rendering, user_input, workflow · also reaches: application_orchestration, state_management, domain_logic
- `tbEntitiesHierarchyWidget` directive — `src/app/widget/lib/entities-hierarchy-widget.js` · directive_kind=element_with_template · concerns: business_rules, data_access, errors_logging, formatting, shared_state, ui_rendering, user_input, workflow · also reaches: application_orchestration, state_management, data_access, domain_logic, platform_cross_cutting
- `tbEntitiesTableWidget` directive — `src/app/widget/lib/entities-table-widget.js` · directive_kind=element_with_template · concerns: business_rules, external_integration, formatting, shared_state, ui_rendering, user_input, workflow · also reaches: application_orchestration, state_management, external_integration, domain_logic
- `tbExtensionsTableWidget` directive — `src/app/widget/lib/extensions-table-widget.js` · directive_kind=element_with_template · concerns: business_rules, formatting, ui_rendering, user_input · also reaches: domain_logic
- `tbMultipleInputWidget` directive — `src/app/widget/lib/multiple-input-widget.js` · directive_kind=element_with_template · concerns: business_rules, data_access, errors_logging, formatting, shared_state, ui_rendering, user_input, workflow · also reaches: application_orchestration, state_management, data_access, domain_logic, platform_cross_cutting
- `tbKnob` directive — `src/app/widget/lib/rpc/knob.directive.js` · directive_kind=dom_manipulation · concerns: business_rules, data_access, errors_logging, external_integration, formatting, ui_rendering, user_input · also reaches: data_access, external_integration, domain_logic, platform_cross_cutting
- `tbLedIndicator` directive — `src/app/widget/lib/rpc/led-indicator.directive.js` · directive_kind=element_with_template · concerns: business_rules, data_access, errors_logging, formatting, ui_rendering, workflow · also reaches: application_orchestration, data_access, domain_logic, platform_cross_cutting
- `tbRoundSwitch` directive — `src/app/widget/lib/rpc/round-switch.directive.js` · directive_kind=element_with_template · concerns: business_rules, data_access, errors_logging, formatting, ui_rendering, user_input, workflow · also reaches: application_orchestration, data_access, domain_logic, platform_cross_cutting
- `tbSwitch` directive — `src/app/widget/lib/rpc/switch.directive.js` · directive_kind=element_with_template · concerns: business_rules, data_access, errors_logging, formatting, ui_rendering, user_input, workflow · also reaches: application_orchestration, data_access, domain_logic, platform_cross_cutting
- `tbTimeseriesTableWidget` directive — `src/app/widget/lib/timeseries-table-widget.js` · directive_kind=element_with_template · concerns: business_rules, formatting, shared_state, ui_rendering, user_input · also reaches: state_management, domain_logic
- `tripAnimation` directive — `src/app/widget/lib/tripAnimation/trip-animation-widget.js` · directive_kind=element_with_template · concerns: business_rules, data_access, external_integration, formatting, shared_state, ui_rendering, user_input · also reaches: state_management, data_access, external_integration, domain_logic
- `tripAnimation` filter — `src/app/widget/lib/tripAnimation/trip-animation-widget.js` · concerns: business_rules, data_access, external_integration, formatting, ui_rendering, user_input · also reaches: data_access, external_integration, domain_logic
- `tbWebCameraWidget` directive — `src/app/widget/lib/web-camera-input-widget.js` · directive_kind=element_with_template · concerns: business_rules, data_access, external_integration, formatting, ui_rendering, user_input, workflow · also reaches: application_orchestration, data_access, external_integration, domain_logic

## `shared_model_utility` — 4 units

- `utils` factory — `src/app/common/utils.service.js` · service_kind=helper_utility · concerns: business_rules, errors_logging, external_integration, formatting, shared_state, validation · also reaches: state_management, external_integration, domain_logic, platform_cross_cutting
- `ReactSchemaForm` value — `src/app/components/json-form.directive.js`
- `helpLinks` constant — `src/app/help/help-links.constant.js`
- `types` constant — `src/app/common/types.constant.js`

## `state_management` — 1 units

- `bufferStore` factory — `src/app/services/item-buffer.service.js` · service_kind=state_store · concerns: external_integration, shared_state · also reaches: external_integration

## `unknown` — 4 units

- `statesControllerService` factory — `src/app/dashboard/states/index.js` · service_kind=unknown
- `importExport` factory — `src/app/import-export/index.js` · service_kind=unknown
- `ruleNodeScriptTest` factory — `src/app/rulechain/index.js` · service_kind=unknown
- `toast` factory — `src/app/services/toast.js` · service_kind=unknown
