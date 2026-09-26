# Idiom coverage — what this repo uses of AngularJS, against the catalog

Read from 274 JavaScript files and 201 templates under `src/app` (the registration files listed in .cognidev/understand/angular.json; 151 more .js files under the legacy root that the shard does not list were read too — see idioms.json files.jsNotInShard). The catalog (`idioms.yaml`) has 646 idioms: 278 the port rewrites (mechanical), 19 it rewrites with a note, 349 it leaves as a TODO(port) line for a decision.

| | idioms | uses |
|---|---|---|
| mechanical (the port rewrites it) | 120 | 9599 |
| note (rewritten, with a comment) | 11 | 366 |
| decision (a TODO(port) line) | 85 | 1875 |
| not in the catalog | 0 | 0 |

## Held for a decision

A name here is one somebody marked `pending: true` in `.cognidev/modernization-angular-v2/idioms.local.yaml`: the port refuses to run until it is settled. Names the shipped catalog does not place are NOT here — the scan defaults them (see the local catalog below) because the port keeps such code as written and marks the line whatever the file says. A `$`-prefixed token is a library's service; a plain one is a library's, or a name this repo never registers.

Nothing is held. Every idiom this repo uses is in the catalog, or decided in the local one.

## Decided in this repo's local catalog — 360 (356 of them defaulted by the scan, unread by anyone)

| name | shape | class | target | decided by | uses | files | first seen |
|---|---|---|---|---|---|---|---|
| `aaria-label` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/widget/lib/web-camera-input-widget.tpl.html:34 |
| `alarm` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/alarm/alarm-table.tpl.html:49 |
| `allow-custom` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 2 | src/app/rulechain/add-link.tpl.html:34 |
| `allowed-labels` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 2 | src/app/rulechain/add-link.tpl.html:34 |
| `asset` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 2 | src/app/asset/add-asset.tpl.html:34 |
| `asset-scope` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/asset/assets.tpl.html:25 |
| `audit-log` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/audit/audit-log-table.tpl.html:60 |
| `audit-log-mode` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 10 | 9 | src/app/asset/assets.tpl.html:70 |
| `auto-confirm` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/widget/lib/date-range-navigator/date-range-navigator.tpl.html:24 |
| `auto-expand` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 3 | 3 | src/app/admin/security-settings.tpl.html:32 |
| `autofill-height` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/dashboard/layouts/dashboard-layout.tpl.html:37 |
| `automatic-resize` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 1 | src/app/rulechain/rulechain.tpl.html:92 |
| `callbacks` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 1 | src/app/rulechain/rulechain.tpl.html:92 |
| `change-alignment` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/components/gateway/gateway-form.tpl.html:199 |
| `columns` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 3 | 3 | src/app/dashboard/layouts/dashboard-layout.tpl.html:37 |
| `config` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 1 | src/app/extension/extension-dialog.tpl.html:62 |
| `configuration` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 1 | src/app/extension/extension-dialog.tpl.html:64 |
| `control` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 5 | 2 | src/app/components/widget/widget-config.tpl.html:93 |
| `ctx` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/widget/lib/extensions-table-widget.tpl.html:20 |
| `customer` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 2 | src/app/customer/add-customer.tpl.html:34 |
| `dashboard` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 3 | 3 | src/app/dashboard/add-dashboard.tpl.html:34 |
| `dashboard-ctrl` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 1 | src/app/dashboard/dashboard.tpl.html:101 |
| `dashboard-ctx` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 1 | src/app/dashboard/dashboard.tpl.html:136 |
| `dashboard-scope` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/dashboard/dashboards.tpl.html:25 |
| `dashboard-style` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/dashboard/layouts/dashboard-layout.tpl.html:37 |
| `dashboard-timewindow` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/dashboard/layouts/dashboard-layout.tpl.html:37 |
| `debug-event-types` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 2 | src/app/rulechain/rulechain.tpl.html:173 |
| `default-attribute-scope` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 12 | 6 | src/app/asset/assets.tpl.html:35 |
| `default-event-type` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 7 | 7 | src/app/asset/assets.tpl.html:57 |
| `device` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 2 | src/app/device/add-device.tpl.html:34 |
| `device-scope` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/device/devices.tpl.html:25 |
| `disable-attribute-scope-selection` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 6 | 6 | src/app/asset/assets.tpl.html:43 |
| `display-user-info` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 3 | 2 | src/app/dashboard/dashboard.tpl.html:32 |
| `drop-target-id` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/rulechain/rulechain.tpl.html:92 |
| `edge-style` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/rulechain/rulechain.tpl.html:107 |
| `edit-callbacks` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/widget/lib/entities-hierarchy-widget.tpl.html:41 |
| `enable-search` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/widget/lib/entities-hierarchy-widget.tpl.html:41 |
| `entity-id` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 38 | 9 | src/app/asset/assets.tpl.html:35 |
| `entity-name` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 13 | 6 | src/app/asset/assets.tpl.html:35 |
| `entity-view` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 2 | src/app/entity-view/add-entity-view.tpl.html:34 |
| `entity-view-scope` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/entity-view/entity-views.tpl.html:25 |
| `event` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/event/event-table.tpl.html:48 |
| `event-type` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 1 | src/app/event/event-table.tpl.html:38 |
| `expanded` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 9 | 5 | src/app/components/widget/widget-config.tpl.html:98 |
| `fc-connector` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 1 | src/app/rulechain/rulenode.tpl.html:38 |
| `fc-magnet` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 1 | src/app/rulechain/rulenode.tpl.html:36 |
| `first-day-of-week` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/widget/lib/date-range-navigator/date-range-navigator.tpl.html:24 |
| `fix-head` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 7 | 7 | src/app/components/widget/action/manage-widget-actions.tpl.html:59 |
| `flex` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 877 | 148 | src/app/admin/general-settings.tpl.html:26 |
| `flex-gt-sm` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 7 | 3 | src/app/admin/outgoing-mail-settings.tpl.html:48 |
| `flex-md` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 1 | src/app/dashboard/dashboard.tpl.html:25 |
| `flex-offset` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 2 | src/app/dashboard/dashboard.tpl.html:197 |
| `flex-sm` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 3 | 1 | src/app/dashboard/dashboard.tpl.html:85 |
| `flex-xs` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 3 | 1 | src/app/dashboard/dashboard.tpl.html:85 |
| `flow-attrs` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 7 | 5 | src/app/dashboard/dashboard-settings.tpl.html:161 |
| `flow-btn` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 7 | 5 | src/app/dashboard/dashboard-settings.tpl.html:161 |
| `flow-drop` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 7 | 5 | src/app/dashboard/dashboard-settings.tpl.html:159 |
| `flow-file-added` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 7 | 5 | src/app/dashboard/dashboard-settings.tpl.html:142 |
| `flow-init` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 7 | 5 | src/app/dashboard/dashboard-settings.tpl.html:142 |
| `force-fullscreen` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/dashboard/dashboard.tpl.html:22 |
| `fullscreen-background-style` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/components/dashboard.tpl.html:32 |
| `gateway-config` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/components/gateway/gateway-form.tpl.html:199 |
| `get_access_token` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/components/gateway/gateway-form.tpl.html:34 |
| `grid-configuration` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 9 | 9 | src/app/asset/assets.tpl.html:18 |
| `gridster` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/components/dashboard.tpl.html:28 |
| `gridster-item` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/components/dashboard.tpl.html:30 |
| `hide` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/components/widget/widget-config.tpl.html:120 |
| `hide-gt-md` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/components/dashboard-select.tpl.html:27 |
| `hide-gt-sm` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 4 | 4 | src/app/dashboard/dashboard.tpl.html:83 |
| `hide-label` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 4 | 2 | src/app/entity/entity-filter.tpl.html:262 |
| `hide-md` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 3 | 3 | src/app/components/dashboard-select.tpl.html:18 |
| `hide-print` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/layout/home.tpl.html:18 |
| `hide-sm` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 16 | 10 | src/app/components/dashboard-select.tpl.html:18 |
| `hide-xs` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 16 | 10 | src/app/components/dashboard-select.tpl.html:18 |
| `icon` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 129 | 71 | src/app/alarm/alarm-details-dialog.tpl.html:24 |
| `ignore-loading` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/dashboard/layouts/dashboard-layout.tpl.html:37 |
| `in-widget` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/widget/lib/extensions-table-widget.tpl.html:20 |
| `is-add` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 1 | src/app/extension/extension-dialog.tpl.html:62 |
| `is-edit-action-enabled` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 8 | 4 | src/app/dashboard/dashboard.tpl.html:212 |
| `is-export-action-enabled` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 2 | src/app/dashboard/layouts/dashboard-layout.tpl.html:37 |
| `is-mobile` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 8 | 2 | src/app/dashboard/dashboard.tpl.html:136 |
| `is-mobile-disabled` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 2 | src/app/dashboard/layouts/dashboard-layout.tpl.html:37 |
| `is-remove-action-enabled` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 8 | 4 | src/app/dashboard/dashboard.tpl.html:212 |
| `key-val-map` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/rulechain/script/node-script-test.tpl.html:66 |
| `layout` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 550 | 143 | src/app/admin/general-settings.tpl.html:45 |
| `layout-align` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 206 | 77 | src/app/admin/general-settings.tpl.html:45 |
| `layout-align-gt-sm` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 21 | 9 | src/app/audit/audit-log-table.tpl.html:20 |
| `layout-alignment` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/components/timewindow-panel.tpl.html:115 |
| `layout-ctx` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 1 | src/app/dashboard/dashboard.tpl.html:136 |
| `layout-fill` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 4 | 2 | src/app/components/widget/action/custom-action-pretty-editor.tpl.html:109 |
| `layout-gt-sm` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 24 | 14 | src/app/admin/outgoing-mail-settings.tpl.html:47 |
| `layout-margin` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/jsonform/jsonform.tpl.html:18 |
| `layout-padding` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 14 | 7 | src/app/components/widget/widget-config.tpl.html:223 |
| `layout-sm` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/dashboard/dashboard.tpl.html:24 |
| `layout-wrap` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 19 | 12 | src/app/admin/general-settings.tpl.html:45 |
| `layout-xs` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/dashboard/dashboard.tpl.html:24 |
| `load-nodes` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/widget/lib/entities-hierarchy-widget.tpl.html:41 |
| `load-widgets` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/widget/widget-library.tpl.html:30 |
| `localization-map` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/widget/lib/date-range-navigator/date-range-navigator.tpl.html:24 |
| `margins` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/dashboard/layouts/dashboard-layout.tpl.html:37 |
| `md-alternative` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/import-export/import-dialog-csv.tpl.html:33 |
| `md-auto-hide` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 7 | 2 | src/app/components/widget/widget-config.tpl.html:58 |
| `md-auto-select` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 6 | 6 | src/app/dashboard/states/manage-dashboard-states.tpl.html:84 |
| `md-autocomplete-snap` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 4 | 4 | src/app/entity/entity-list.tpl.html:19 |
| `md-autofocus` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/widget/lib/timeseries-table-widget.tpl.html:30 |
| `md-autoselect` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 2 | src/app/components/queue/queue-type-list.tpl.html:18 |
| `md-body` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 9 | 9 | src/app/components/widget/action/manage-widget-actions.tpl.html:68 |
| `md-border-bottom` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 18 | 16 | src/app/asset/assets.tpl.html:22 |
| `md-boundary-links` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 2 | src/app/widget/lib/alarms-table-widget.tpl.html:99 |
| `md-cell` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 31 | 9 | src/app/components/widget/action/manage-widget-actions.tpl.html:70 |
| `md-clear-button` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 2 | src/app/components/gateway/gateway-config-select.tpl.html:19 |
| `md-color-clear-button` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 7 | 3 | src/app/components/datakey-config.tpl.html:39 |
| `md-color-generic-palette` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 7 | 3 | src/app/components/datakey-config.tpl.html:39 |
| `md-color-history` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 7 | 3 | src/app/components/datakey-config.tpl.html:39 |
| `md-color-picker` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 7 | 3 | src/app/components/datakey-config.tpl.html:39 |
| `md-cols` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 1 | src/app/home/home-links.tpl.html:18 |
| `md-cols-gt-md` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/home/home-links.tpl.html:27 |
| `md-colspan` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/home/home-links.tpl.html:19 |
| `md-colspan-gt-sm` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/home/home-links.tpl.html:19 |
| `md-column` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 31 | 9 | src/app/components/widget/action/manage-widget-actions.tpl.html:61 |
| `md-component-id` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 15 | 7 | src/app/admin/security-settings.tpl.html:32 |
| `md-container-class` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/components/widgets-bundle-select.tpl.html:18 |
| `md-diameter` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 4 | 3 | src/app/components/dashboard.tpl.html:21 |
| `md-direction` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 177 | 49 | src/app/alarm/alarm-row.tpl.html:29 |
| `md-disable-backdrop` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 2 | src/app/components/details-sidenav.tpl.html:18 |
| `md-dynamic-height` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 5 | 3 | src/app/components/timewindow-panel.tpl.html:22 |
| `md-floating-label` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 9 | 9 | src/app/components/datakey-config.tpl.html:19 |
| `md-font-icon` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 5 | 1 | src/app/widget/lib/web-camera-input-widget.tpl.html:34 |
| `md-head` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 9 | 9 | src/app/components/widget/action/manage-widget-actions.tpl.html:59 |
| `md-highlight-flags` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 23 | 18 | src/app/components/dashboard-autocomplete.tpl.html:32 |
| `md-highlight-text` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 23 | 18 | src/app/components/dashboard-autocomplete.tpl.html:32 |
| `md-input-class` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/components/gateway/gateway-config-select.tpl.html:19 |
| `md-input-name` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 10 | 10 | src/app/components/dashboard-autocomplete.tpl.html:18 |
| `md-invert` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/widget/lib/multiple-input-widget.tpl.html:97 |
| `md-is-error` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 35 | 4 | src/app/extension/extension-dialog.tpl.html:39 |
| `md-is-locked-open` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 3 | 3 | src/app/dashboard/dashboard.tpl.html:143 |
| `md-is-open` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 4 | 4 | src/app/components/details-sidenav.tpl.html:18 |
| `md-item-size` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/components/grid.tpl.html:26 |
| `md-item-text` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 23 | 18 | src/app/components/dashboard-autocomplete.tpl.html:18 |
| `md-items` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 23 | 18 | src/app/components/dashboard-autocomplete.tpl.html:18 |
| `md-label` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 5 | 1 | src/app/import-export/import-dialog-csv.tpl.html:35 |
| `md-limit` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 8 | 8 | src/app/components/widget/action/manage-widget-actions.tpl.html:95 |
| `md-limit-options` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 8 | 8 | src/app/components/widget/action/manage-widget-actions.tpl.html:95 |
| `md-linear` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/import-export/import-dialog-csv.tpl.html:33 |
| `md-maxlength` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 4 | 2 | src/app/admin/outgoing-mail-settings.tpl.html:58 |
| `md-menu-align-target` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 9 | 4 | src/app/components/dashboard.tpl.html:138 |
| `md-menu-class` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 18 | 13 | src/app/components/dashboard-autocomplete.tpl.html:18 |
| `md-menu-container-class` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/components/gateway/gateway-config-select.tpl.html:19 |
| `md-menu-origin` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 2 | src/app/layout/user-menu.tpl.html:28 |
| `md-min-length` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 23 | 18 | src/app/components/dashboard-autocomplete.tpl.html:18 |
| `md-mobile-step-text` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/import-export/import-dialog-csv.tpl.html:33 |
| `md-mode` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 57 | 55 | src/app/admin/general-settings.tpl.html:25 |
| `md-no-cache` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 21 | 16 | src/app/components/datakey-config.tpl.html:19 |
| `md-no-float` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 8 | 6 | src/app/components/datasource-func.tpl.html:20 |
| `md-no-ink` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/widget/lib/rpc/switch.tpl.html:28 |
| `md-on-demand` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 11 | 11 | src/app/alarm/alarm-table.tpl.html:48 |
| `md-on-paginate` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 8 | 8 | src/app/components/widget/action/manage-widget-actions.tpl.html:95 |
| `md-on-reorder` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 8 | 8 | src/app/components/widget/action/manage-widget-actions.tpl.html:59 |
| `md-on-select` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 41 | 11 | src/app/asset/assets.tpl.html:34 |
| `md-open` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 4 | 4 | src/app/components/grid.tpl.html:103 |
| `md-order` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 8 | 8 | src/app/components/widget/action/manage-widget-actions.tpl.html:59 |
| `md-order-by` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 20 | 8 | src/app/components/widget/action/manage-widget-actions.tpl.html:61 |
| `md-page` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 8 | 8 | src/app/components/widget/action/manage-widget-actions.tpl.html:95 |
| `md-page-select` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 8 | 8 | src/app/components/widget/action/manage-widget-actions.tpl.html:95 |
| `md-position-mode` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 5 | 4 | src/app/components/dashboard.tpl.html:24 |
| `md-progress` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 3 | 3 | src/app/entity/attribute/attribute-table.tpl.html:126 |
| `md-require-match` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 8 | 6 | src/app/components/datasource-entity.tpl.html:27 |
| `md-row` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 18 | 9 | src/app/components/widget/action/manage-widget-actions.tpl.html:60 |
| `md-row-height` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 1 | src/app/home/home-links.tpl.html:18 |
| `md-row-select` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 4 | 4 | src/app/entity/attribute/attribute-table.tpl.html:126 |
| `md-scroll-y` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/components/gateway/gateway-form.tpl.html:18 |
| `md-search-text` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 23 | 18 | src/app/components/dashboard-autocomplete.tpl.html:18 |
| `md-search-text-change` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 7 | 7 | src/app/components/dashboard-autocomplete.tpl.html:18 |
| `md-select` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 6 | 6 | src/app/dashboard/states/manage-dashboard-states.tpl.html:84 |
| `md-select-id` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 6 | 6 | src/app/dashboard/states/manage-dashboard-states.tpl.html:84 |
| `md-select-on-focus` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 3 | 1 | src/app/widget/lib/multiple-input-widget.tpl.html:33 |
| `md-select-on-match` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 6 | 6 | src/app/components/queue/queue-type-list.tpl.html:18 |
| `md-selected` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 7 | 6 | src/app/components/timewindow-panel.tpl.html:22 |
| `md-selected-item` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 23 | 18 | src/app/components/dashboard-autocomplete.tpl.html:18 |
| `md-separator-keys` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 4 | 1 | src/app/entity-view/entity-view-fieldset.tpl.html:90 |
| `md-svg-icon` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 17 | 16 | src/app/asset/asset-fieldset.tpl.html:36 |
| `md-svg-src` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/layout/home.tpl.html:30 |
| `md-table` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 9 | 9 | src/app/components/widget/action/manage-widget-actions.tpl.html:58 |
| `md-theme` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 6 | 6 | src/app/layout/home.tpl.html:56 |
| `md-top-index` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 11 | 11 | src/app/alarm/alarm-table.tpl.html:47 |
| `md-total` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 8 | 8 | src/app/components/widget/action/manage-widget-actions.tpl.html:95 |
| `md-transform-chip` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 5 | 3 | src/app/components/datasource-entity.tpl.html:27 |
| `md-vertical` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/import-export/import-dialog-csv.tpl.html:33 |
| `md-virtual-repeat` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 11 | 11 | src/app/alarm/alarm-table.tpl.html:48 |
| `mdp-auto-switch` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 5 | 3 | src/app/components/datetime-period.tpl.html:22 |
| `mdp-disabled` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 1 | src/app/widget/lib/multiple-input-widget.tpl.html:112 |
| `mdp-max-date` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 1 | src/app/entity-view/entity-view-fieldset.tpl.html:190 |
| `mdp-min-date` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 1 | src/app/entity-view/entity-view-fieldset.tpl.html:199 |
| `mdp-placeholder` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 10 | 3 | src/app/components/datetime-period.tpl.html:20 |
| `mobile-autofill-height` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/dashboard/layouts/dashboard-layout.tpl.html:37 |
| `mobile-row-height` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/dashboard/layouts/dashboard-layout.tpl.html:37 |
| `ncy-breadcrumb` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/layout/home.tpl.html:54 |
| `ngclipboard` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 9 | 9 | src/app/asset/asset-fieldset.tpl.html:32 |
| `ngclipboard-success` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 9 | 9 | src/app/asset/asset-fieldset.tpl.html:32 |
| `node-definition` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/rulechain/rulenode-fieldset.tpl.html:39 |
| `node-height` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 1 | src/app/rulechain/rulechain.tpl.html:92 |
| `node-width` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 1 | src/app/rulechain/rulechain.tpl.html:92 |
| `open-on-input` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 7 | 3 | src/app/components/datakey-config.tpl.html:39 |
| `options` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 4 | 3 | src/app/components/details-sidenav.tpl.html:53 |
| `page-mode` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/audit/audit-logs.tpl.html:18 |
| `playsinline` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/widget/lib/web-camera-input-widget.tpl.html:29 |
| `prepare-dashboard-context-menu` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/dashboard/layouts/dashboard-layout.tpl.html:37 |
| `prepare-widget-context-menu` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/dashboard/layouts/dashboard-layout.tpl.html:37 |
| `props` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/components/json-form.tpl.html:19 |
| `rn-carousel` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/entity/attribute/attribute-table.tpl.html:150 |
| `rn-carousel-buffered` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/entity/attribute/attribute-table.tpl.html:150 |
| `rn-carousel-index` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 1 | src/app/entity/attribute/attribute-table.tpl.html:150 |
| `rn-carousel-indicators` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/entity/attribute/attribute-table.tpl.html:199 |
| `rn-carousel-transition` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/entity/attribute/attribute-table.tpl.html:150 |
| `rn-swipe-disabled` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/entity/attribute/attribute-table.tpl.html:150 |
| `rule-chain` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 2 | src/app/rulechain/add-rulechain.tpl.html:34 |
| `rule-chain-id` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 2 | src/app/rulechain/add-rulenode.tpl.html:34 |
| `rule-node` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 2 | src/app/rulechain/add-rulenode.tpl.html:34 |
| `rule-node-directive` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/rulechain/rulenode-config.tpl.html:18 |
| `rule-node-id` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 2 | src/app/rulechain/rulenode-config.tpl.html:18 |
| `search-callback` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/widget/lib/entities-hierarchy-widget.tpl.html:41 |
| `secondary-placeholder` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 2 | src/app/entity/entity-subtype-list.tpl.html:19 |
| `selected-objects` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 1 | src/app/rulechain/rulechain.tpl.html:92 |
| `share-hash-tags` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 2 | src/app/dashboard/dashboard-fieldset.tpl.html:45 |
| `share-link` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 2 | src/app/dashboard/dashboard-fieldset.tpl.html:45 |
| `share-text` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 2 | src/app/dashboard/dashboard-fieldset.tpl.html:45 |
| `share-title` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 2 | src/app/dashboard/dashboard-fieldset.tpl.html:45 |
| `show-gt-sm` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/components/widget/widget-config.tpl.html:120 |
| `show-template` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/widget/lib/date-range-navigator/date-range-navigator.tpl.html:24 |
| `slides` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/entity/attribute/attribute-table.tpl.html:199 |
| `socialshare` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 4 | 1 | src/app/components/socialshare-panel.tpl.html:19 |
| `socialshare-hashtags` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/components/socialshare-panel.tpl.html:30 |
| `socialshare-provider` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 4 | 1 | src/app/components/socialshare-panel.tpl.html:19 |
| `socialshare-text` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 4 | 1 | src/app/components/socialshare-panel.tpl.html:19 |
| `socialshare-title` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/components/socialshare-panel.tpl.html:19 |
| `socialshare-url` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 4 | 1 | src/app/components/socialshare-panel.tpl.html:19 |
| `state-controller` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/dashboard/layouts/dashboard-layout.tpl.html:37 |
| `states` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 1 | src/app/dashboard/dashboard.tpl.html:101 |
| `states-controller-id` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 1 | src/app/dashboard/dashboard.tpl.html:101 |
| `tb-contextmenu` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 3 | 2 | src/app/components/dashboard.tpl.html:25 |
| `tb-enable-backdrop` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 1 | src/app/rulechain/rulechain.tpl.html:142 |
| `tb-keydown` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 2 | src/app/components/entity-alias-select.tpl.html:19 |
| `tb-keypress` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 2 | src/app/components/entity-alias-select.tpl.html:19 |
| `tb-mousedown` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 1 | src/app/components/dashboard.tpl.html:32 |
| `tenant` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 2 | src/app/tenant/add-tenant.tpl.html:34 |
| `title-text` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/rulechain/script/node-script-test.tpl.html:66 |
| `toolbar-opened` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/dashboard/dashboard.tpl.html:22 |
| `translate-interpolation` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 7 | 7 | src/app/components/datasource-entity.tpl.html:176 |
| `translate-values` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 25 | 19 | src/app/components/dashboard-autocomplete.tpl.html:37 |
| `use-alias-entity-types` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 11 | 2 | src/app/entity/entity-filter.tpl.html:32 |
| `user` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 2 | src/app/user/add-user.tpl.html:34 |
| `user-id` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/user/users.tpl.html:35 |
| `watch-depth` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/components/json-form.tpl.html:19 |
| `widget` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/dashboard/dashboard.tpl.html:177 |
| `widget-actions` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/components/widget/widget-config.tpl.html:356 |
| `widget-edit-mode` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 3 | 1 | src/app/dashboard/dashboard.tpl.html:136 |
| `widget-layout` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/dashboard/dashboard.tpl.html:177 |
| `widget-layouts` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/dashboard/layouts/dashboard-layout.tpl.html:37 |
| `widgets` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 8 | 4 | src/app/dashboard/dashboard.tpl.html:212 |
| `widgets-bundle` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 2 | src/app/widget/add-widgets-bundle.tpl.html:34 |
| `ui-ace` | attribute | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 25 | 14 | src/app/alarm/alarm-details-dialog.tpl.html:79 |
| `details-buttons` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 12 | 11 | src/app/asset/assets.tpl.html:19 |
| `fc-canvas` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 1 | src/app/rulechain/rulechain.tpl.html:92 |
| `header-pane` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/dashboard/dashboard.tpl.html:194 |
| `md-autocomplete` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 23 | 18 | src/app/components/dashboard-autocomplete.tpl.html:18 |
| `md-button` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 492 | 128 | src/app/admin/general-settings.tpl.html:46 |
| `md-card` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 35 | 14 | src/app/admin/general-settings.tpl.html:19 |
| `md-card-actions` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/components/grid.tpl.html:47 |
| `md-card-content` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 35 | 14 | src/app/admin/general-settings.tpl.html:27 |
| `md-card-title` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 14 | 14 | src/app/admin/general-settings.tpl.html:20 |
| `md-card-title-text` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 14 | 13 | src/app/admin/general-settings.tpl.html:21 |
| `md-checkbox` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 60 | 35 | src/app/admin/general-settings.tpl.html:37 |
| `md-chip-template` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 8 | 6 | src/app/components/datasource-entity.tpl.html:79 |
| `md-chips` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 12 | 7 | src/app/components/datasource-entity.tpl.html:27 |
| `md-content` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 58 | 47 | src/app/alarm/alarm-table.tpl.html:18 |
| `md-date-range` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/widget/lib/date-range-navigator/date-range-navigator.tpl.html:24 |
| `md-dialog` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 49 | 49 | src/app/alarm/alarm-details-dialog.tpl.html:18 |
| `md-dialog-actions` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 47 | 47 | src/app/alarm/alarm-details-dialog.tpl.html:86 |
| `md-dialog-content` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 49 | 49 | src/app/alarm/alarm-details-dialog.tpl.html:28 |
| `md-divider` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 15 | 11 | src/app/alarm/alarm-table.tpl.html:43 |
| `md-edit-dialog` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/entity/attribute/edit-attribute-value.tpl.html:18 |
| `md-expansion-panel` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 8 | 4 | src/app/admin/security-settings.tpl.html:33 |
| `md-expansion-panel-collapsed` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 8 | 4 | src/app/admin/security-settings.tpl.html:34 |
| `md-expansion-panel-content` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 8 | 4 | src/app/admin/security-settings.tpl.html:43 |
| `md-expansion-panel-expanded` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 8 | 4 | src/app/admin/security-settings.tpl.html:38 |
| `md-expansion-panel-group` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 4 | 4 | src/app/admin/security-settings.tpl.html:32 |
| `md-expansion-panel-header` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 8 | 4 | src/app/admin/security-settings.tpl.html:39 |
| `md-expansion-panel-icon` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 16 | 4 | src/app/admin/security-settings.tpl.html:36 |
| `md-fab-actions` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 4 | 4 | src/app/components/grid.tpl.html:112 |
| `md-fab-speed-dial` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 3 | 3 | src/app/components/grid.tpl.html:103 |
| `md-fab-toolbar` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/dashboard/dashboard-toolbar.tpl.html:18 |
| `md-fab-trigger` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 4 | 4 | src/app/components/grid.tpl.html:104 |
| `md-grid-list` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 1 | src/app/home/home-links.tpl.html:18 |
| `md-grid-tile` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 1 | src/app/home/home-links.tpl.html:19 |
| `md-icon` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 217 | 80 | src/app/alarm/alarm-row.tpl.html:32 |
| `md-input-container` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 347 | 81 | src/app/admin/general-settings.tpl.html:30 |
| `md-item-template` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 13 | 13 | src/app/components/dashboard-autocomplete.tpl.html:30 |
| `md-list` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 17 | 11 | src/app/alarm/alarm-table.tpl.html:38 |
| `md-list-item` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 11 | 11 | src/app/alarm/alarm-table.tpl.html:48 |
| `md-menu` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 5 | 4 | src/app/components/dashboard.tpl.html:24 |
| `md-menu-content` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 5 | 4 | src/app/components/dashboard.tpl.html:134 |
| `md-menu-item` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 9 | 4 | src/app/components/dashboard.tpl.html:135 |
| `md-not-found` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 13 | 11 | src/app/components/dashboard-autocomplete.tpl.html:35 |
| `md-option` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 79 | 40 | src/app/admin/outgoing-mail-settings.tpl.html:42 |
| `md-progress-circular` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 4 | 3 | src/app/components/dashboard.tpl.html:21 |
| `md-progress-linear` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 53 | 53 | src/app/admin/general-settings.tpl.html:25 |
| `md-radio-button` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 5 | 3 | src/app/components/timewindow-panel.tpl.html:41 |
| `md-radio-group` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 3 | 3 | src/app/components/timewindow-panel.tpl.html:40 |
| `md-select` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 74 | 40 | src/app/admin/outgoing-mail-settings.tpl.html:41 |
| `md-sidenav` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 4 | 4 | src/app/components/details-sidenav.tpl.html:18 |
| `md-slider` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 2 | src/app/components/timewindow-panel.tpl.html:93 |
| `md-slider-container` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 2 | src/app/components/timewindow-panel.tpl.html:91 |
| `md-step` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 5 | 1 | src/app/import-export/import-dialog-csv.tpl.html:35 |
| `md-step-actions` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 4 | 1 | src/app/import-export/import-dialog-csv.tpl.html:74 |
| `md-step-body` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 5 | 1 | src/app/import-export/import-dialog-csv.tpl.html:36 |
| `md-stepper` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/import-export/import-dialog-csv.tpl.html:33 |
| `md-switch` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 15 | 8 | src/app/components/gateway/gateway-config.tpl.html:21 |
| `md-tab` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 74 | 16 | src/app/asset/assets.tpl.html:24 |
| `md-table-container` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 9 | 9 | src/app/components/widget/action/manage-widget-actions.tpl.html:57 |
| `md-table-pagination` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 8 | 8 | src/app/components/widget/action/manage-widget-actions.tpl.html:95 |
| `md-tabs` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 18 | 16 | src/app/asset/assets.tpl.html:22 |
| `md-toast` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 3 | 3 | src/app/services/error-toast.tpl.html:18 |
| `md-toolbar` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 75 | 62 | src/app/alarm/alarm-details-dialog.tpl.html:19 |
| `md-tooltip` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 184 | 51 | src/app/alarm/alarm-row.tpl.html:29 |
| `md-virtual-repeat-container` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 11 | 11 | src/app/alarm/alarm-table.tpl.html:47 |
| `mdp-date-picker` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 5 | 3 | src/app/components/datetime-period.tpl.html:20 |
| `mdp-time-picker` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 5 | 3 | src/app/components/datetime-period.tpl.html:22 |
| `ng-md-icon` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 122 | 69 | src/app/alarm/alarm-details-dialog.tpl.html:24 |
| `react-component` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/components/json-form.tpl.html:19 |
| `v-accordion` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 25 | 5 | src/app/components/widget/widget-config.tpl.html:93 |
| `v-pane` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 25 | 5 | src/app/components/widget/widget-config.tpl.html:98 |
| `v-pane-content` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 25 | 5 | src/app/components/widget/widget-config.tpl.html:109 |
| `v-pane-header` | element | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 25 | 5 | src/app/components/widget/widget-config.tpl.html:99 |
| `6` | filter | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 1 | src/app/admin/outgoing-mail-settings.tpl.html:58 |
| `65` | filter | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 1 | src/app/admin/outgoing-mail-settings.tpl.html:58 |
| `655` | filter | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 1 | src/app/admin/outgoing-mail-settings.tpl.html:58 |
| `6553` | filter | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 1 | src/app/admin/outgoing-mail-settings.tpl.html:58 |
| `translate` | filter | mechanical | \| translate: TranslatePipe from @ngx-translate/core | a person | 1246 | 168 | src/app/components/confirm-on-exit.directive.js:27 |
| `aliasController` | token | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/components/datakey-config-dialog.controller.js:23 |
| `autoSwitch` | token | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/common/thirdparty-fix.js:418 |
| `currentDate` | token | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/common/thirdparty-fix.js:320 |
| `dataKey` | token | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/components/datakey-config-dialog.controller.js:23 |
| `dataKeySettingsSchema` | token | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/components/datakey-config-dialog.controller.js:23 |
| `entityAlias` | token | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/components/datakey-config-dialog.controller.js:23 |
| `jwtHelper` | token | decision | angular-jwt: decode the token's payload (atob of the middle part) and read exp | a person | 1 | 1 | src/app/api/user.service.js:25 |
| `mdColorPickerHistory` | token | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/common/thirdparty-fix.js:97 |
| `options` | token | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 1 | src/app/common/thirdparty-fix.js:137 |
| `saveItemFunction` | token | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/components/grid.directive.js:697 |
| `store` | token | decision | angular-storage: localStorage get/set with JSON | a person | 2 | 2 | src/app/api/user.service.js:25 |
| `time` | token | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/common/thirdparty-fix.js:418 |
| `$mdColorPalette` | token | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 2 | 1 | src/app/common/utils.service.js:36 |
| `$mdConstant` | token | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 3 | 3 | src/app/components/datasource-entity.directive.js:39 |
| `$mdDialog` | token | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 17 | 14 | src/app/api/user.service.js:25 |
| `$mdExpansionPanel` | token | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/components/gateway/gateway-form.directive.js:47 |
| `$mdMedia` | token | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 10 | 7 | src/app/common/thirdparty-fix.js:320 |
| `$mdPanel` | token | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 5 | 5 | src/app/components/dashboard-select.directive.js:37 |
| `$mdUtil` | token | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 7 | 7 | src/app/api/telemetry-websocket.service.js:29 |
| `$ocLazyLoad` | token | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 3 | 2 | src/app/api/rule-chain.service.js:20 |
| `$translate` | token | mechanical | inject(TranslateService) from @ngx-translate/core: instant() is the same; $translate(key) → translate.get(key) (an Observable) | a person | 19 | 18 | src/app/api/entity.service.js:23 |
| `$websocket` | token | note | no rewrite is known — the port keeps it as written and marks the line | the scan | 1 | 1 | src/app/api/telemetry-websocket.service.js:29 |

## This repo's own

Names registered in this repo and used as tokens, directives, filters or events. They are ported unit by unit (scaffold-units), not by the catalog.

- **$-prefixed fields this app names itself (jQuery objects, by convention)**: 15 distinct — `$scope` (20), `$container` (16), `$q` (13), `$current` (9), `$element` (8), `$containerParent` (7), `$timeout` (7), `$filter` (5), `$blockScrolling` (4), `$ctx` (3), `$mdExpansionPanel` (3), `$observe` (3), `$event` (1), `$parentNode` (1), `$stateful` (1)
- **$-prefixed fields this app put on a scope**: 17 distinct — `$setDirty` (34), `$setPristine` (32), `$setValidity` (21), `$mdChipsCtrl` (14), `$mdAutocompleteCtrl` (5), `$valid` (4), `$injector` (3), `$chip` (2), `$dirty` (2), `$mdMedia` (2), `$pristine` (2), `$invalid` (1), `$mdCloseMousepointMenu` (1), `$mdExpansionPanel` (1), `$mdOpenMousepointMenu` (1), `$q` (1), `$timeout` (1)
- **events ($on / $broadcast / $emit names)**: 43 distinct — `unauthenticated` (7), `form-submit` (6), `dashboardTimewindowChanged` (5), `entityAliasesChanged` (5), `update-ace-editor-size` (5), `authenticated` (4), `assetSaved` (3), `deviceSaved` (3), `entityViewSaved` (3), `filterMode` (3), `searchTextUpdated` (3), `selectedExtensions` (3), `userLoaded` (3), `widgetEditModeInited` (3), `addExtension` (2), `createImportEntityCompleted` (2), `entityAliasResolved` (2), `exportExtensions` (2), `forbidden` (2), `importExtensions` (2), `mobileModeChanged` (2), `refreshExtensions` (2), `searchEntitySubtypeUpdated` (2), `showSearch` (2), `toggleDashboardEditMode` (2), …
- **filters registered here**: 8 distinct — `truncate` (7), `breadcrumbIcon` (6), `breadcrumbLabel` (3), `keyboardShortcut` (3), `contactShort` (2), `milliSecondsToTimeString` (2), `nospace` (2), `range` (2)
- **injection tokens registered here**: 28 distinct — `types` (38), `utils` (24), `userService` (12), `toast` (8), `attributeService` (6), `entityService` (5), `timeService` (5), `customerService` (4), `dashboardService` (4), `$mdColorPicker` (3), `deviceService` (2), `entityRelationService` (2), `helpLinks` (2), `menu` (2), `ruleChainService` (2), `telemetryWebsocketService` (2), `widgetService` (2), `Fullscreen` (1), `adminService` (1), `alarmService` (1), `assetService` (1), `bufferStore` (1), `componentDescriptorService` (1), `dashboardUtils` (1), `entityViewService` (1), …
- **template attributes: directives registered here**: 22 distinct — `tb-help` (26), `tb-expand-fullscreen` (20), `tb-scope-element` (11), `tb-confirm-on-exit` (6), `parse-to-null` (4), `tb-chip-draggable` (4), `tb-mousepoint-menu` (3), `tb-circular-progress` (2), `tb-json-to-string` (2), `tb-alarm-header` (1), `tb-alarm-row` (1), `tb-audit-log-header` (1), `tb-audit-log-row` (1), `tb-event-header` (1), `tb-event-row` (1), `tb-extension-form-http` (1), `tb-extension-form-modbus` (1), `tb-extension-form-mqtt` (1), `tb-extension-form-opc` (1), `tb-no-animate` (1), `tb-on-finish-render` (1), `tb-widget` (1)
- **template attributes: inputs and attributes of directives registered here**: 75 distinct — `the-form` (66), `entity-type` (53), `is-edit` (42), `tb-required` (40), `help-container-id` (26), `alias-controller` (17), `expand-button-id` (16), `fullscreen-zindex` (10), `is-read-only` (10), `allowed-entity-types` (8), `tenant-id` (8), `datakey-settings-schema` (7), `fill-height` (6), `function-args` (6), `validation-args` (6), `widget-type` (6), `fetch-entity-keys` (5), `header-title` (5), `is-open` (5), `as-button` (4), `confirm-form` (4), `customer-id` (4), `functions-only` (4), `generate-data-key` (4), `header-subtitle` (4), …
- **template elements: components and directives registered here**: 71 distinct — `tb-attribute-table` (12), `tb-entity-select` (12), `tb-grid` (9), `tb-audit-log-table` (8), `tb-dashboard` (8), `tb-event-table` (7), `tb-alarm-table` (6), `tb-entity-subtype-autocomplete` (6), `tb-js-func` (6), `tb-relation-table` (6), `tb-timewindow` (6), `tb-details-sidenav` (5), `tb-relation-type-autocomplete` (5), `tb-dashboard-autocomplete` (4), `tb-timeinterval` (4), `tb-entity-subtype-list` (3), `tb-entity-type-select` (3), `tb-json-content` (3), `tb-user-menu` (3), `tb-widgets-bundle-select` (3), `tb-asset` (2), `tb-contact` (2), `tb-customer` (2), `tb-dashboard-details` (2), `tb-dashboard-layout` (2), …

## Catalogued idioms this repo uses

### attribute — 45 idioms, 3240 uses

| idiom | class | uses | files | target | first seen |
|---|---|---|---|---|---|
| `attribute.ng-model` | mechanical | 570 | 126 | [(ngModel)] (FormsModule) | src/app/admin/general-settings.tpl.html:32 |
| `attribute.ng-click` | mechanical | 439 | 127 | (click) | src/app/admin/outgoing-mail-settings.tpl.html:138 |
| `attribute.ng-if` | mechanical | 383 | 78 | @if (...) { } | src/app/admin/outgoing-mail-settings.tpl.html:86 |
| `attribute.ng-show` | mechanical | 362 | 112 | [hidden]="!(...)" | src/app/admin/general-settings.tpl.html:25 |
| `attribute.ng-disabled` | mechanical | 357 | 112 | [disabled] | src/app/admin/general-settings.tpl.html:25 |
| `attribute.ng-message` | decision | 270 | 53 | @if (control.errors?.['x']) | src/app/admin/general-settings.tpl.html:34 |
| `attribute.ng-messages` | decision | 204 | 53 | @if over control.errors | src/app/admin/general-settings.tpl.html:33 |
| `attribute.ng-repeat` | mechanical | 157 | 66 | @for (x of xs; track ...) { } — the comprehension is parsed | src/app/admin/outgoing-mail-settings.tpl.html:42 |
| `attribute.ng-class` | mechanical | 81 | 45 | [ngClass] / [class.x] for an object literal | src/app/alarm/alarm-details-dialog.tpl.html:69 |
| `attribute.ng-value` | mechanical | 73 | 37 | [value] | src/app/alarm/alarm-table.tpl.html:23 |
| `attribute.ng-style` | mechanical | 56 | 23 | [ngStyle] | src/app/alarm/alarm-table.tpl.html:48 |
| `attribute.ng-required` | mechanical | 55 | 33 | [required] | src/app/components/dashboard-autocomplete.tpl.html:18 |
| `attribute.ng-submit` | mechanical | 53 | 53 | (ngSubmit) | src/app/admin/general-settings.tpl.html:28 |
| `attribute.ng-change` | mechanical | 40 | 23 | (ngModelChange) / (change) | src/app/asset/add-assets-to-customer.tpl.html:40 |
| `attribute.ng-pattern` | mechanical | 18 | 10 | [pattern] | src/app/admin/outgoing-mail-settings.tpl.html:58 |
| `attribute.ng-hide` | mechanical | 17 | 11 | [hidden]="..." | src/app/components/timewindow.tpl.html:25 |
| `attribute.ng-bind-html` | mechanical | 10 | 10 | [innerHTML] | src/app/components/dashboard.tpl.html:56 |
| `attribute.ng-checked` | mechanical | 10 | 9 | [checked] | src/app/asset/add-assets-to-customer.tpl.html:55 |
| `attribute.ng-readonly` | mechanical | 10 | 8 | [readonly] | src/app/components/js-func.tpl.html:28 |
| `attribute.ng-bind` | mechanical | 8 | 3 | {{ ... }} | src/app/extension/extensions-forms/extension-form-modbus.tpl.html:65 |
| `attribute.ng-form` | mechanical | 8 | 6 | ngModelGroup | src/app/components/gateway/gateway-config.tpl.html:19 |
| `attribute.ui-sref` | decision | 7 | 7 | [routerLink] — the state name maps to a path | src/app/components/menu-link.tpl.html:18 |
| `attribute.ng-mouseleave` | mechanical | 6 | 3 | (mouseleave) | src/app/components/dashboard.tpl.html:134 |
| `attribute.ng-transclude` | mechanical | 6 | 3 | <ng-content> / <ng-content select> | src/app/components/details-sidenav.tpl.html:29 |
| `attribute.ng-blur` | mechanical | 5 | 3 | (blur) | src/app/components/queue/queue-type-list.tpl.html:18 |
| `attribute.ng-mouseenter` | mechanical | 5 | 3 | (mouseenter) | src/app/event/event-row-debug-rulenode.tpl.html:22 |
| `attribute.ng-cloak` | mechanical | 3 | 2 | none (dropped) | src/app/layout/home.tpl.html:54 |
| `attribute.ng-init` | decision | 3 | 2 | a field initializer in the class | src/app/extension/extensions-forms/extension-form-mqtt.tpl.html:202 |
| `attribute.ng-switch-when` | mechanical | 3 | 2 | @case (...) { } | src/app/components/datasource.tpl.html:37 |
| `attribute.ng-dblclick` | mechanical | 2 | 2 | (dblclick) | src/app/rulechain/rulenode.tpl.html:18 |
| `attribute.ng-mousedown` | mechanical | 2 | 2 | (mousedown) | src/app/components/material-icon-select.tpl.html:22 |
| `attribute.ng-src` | mechanical | 2 | 1 | [src] | src/app/widget/lib/web-camera-input-widget.tpl.html:23 |
| `attribute.ng-switch` | mechanical | 2 | 2 | @switch (...) { } | src/app/components/datasource.tpl.html:26 |
| `attribute.ui-sref-active-eq` | mechanical | 2 | 2 | routerLinkActive with { exact: true } | src/app/components/menu-link.tpl.html:18 |
| `attribute.ng-attr` | mechanical | 1 | 1 | [attr.name] | src/app/rulechain/rulenode.tpl.html:18 |
| `attribute.ng-false-value` | decision | 1 | 1 | a mapping in the component | src/app/jsonform/jsonform.tpl.html:32 |
| `attribute.ng-href` | mechanical | 1 | 1 | [href] | src/app/login/login.tpl.html:54 |
| `attribute.ng-include` | decision | 1 | 1 | a child component per included template | src/app/components/dashboard.tpl.html:49 |
| `attribute.ng-keydown` | mechanical | 1 | 1 | (keydown) | src/app/rulechain/rulechain.tpl.html:18 |
| `attribute.ng-keyup` | mechanical | 1 | 1 | (keyup) | src/app/rulechain/rulechain.tpl.html:18 |
| `attribute.ng-model-options` | decision | 1 | 1 | [ngModelOptions] (updateOn); debounce is a decision | src/app/components/gateway/gateway-config.tpl.html:42 |
| `attribute.ng-selected` | mechanical | 1 | 1 | [selected] | src/app/components/gateway/gateway-form.tpl.html:99 |
| `attribute.ng-switch-default` | mechanical | 1 | 1 | @default { } | src/app/components/datasource.tpl.html:27 |
| `attribute.ng-true-value` | decision | 1 | 1 | a mapping in the component | src/app/jsonform/jsonform.tpl.html:32 |
| `attribute.ui-view` | mechanical | 1 | 1 | <router-outlet> / a named outlet | src/app/layout/home.tpl.html:82 |

### binding — 5 idioms, 195 uses

| idiom | class | uses | files | target | first seen |
|---|---|---|---|---|---|
| `binding.two-way` | mechanical | 108 | 30 | model<any>() (two-way) | src/app/components/circular-progress.directive.js:69 |
| `binding.optional` | note | 34 | 17 | inputs are optional by default; an output is always there | src/app/components/dashboard-autocomplete.directive.js:140 |
| `binding.alias` | mechanical | 24 | 14 | input<any>(undefined, { alias }) | src/app/components/circular-progress.directive.js:69 |
| `binding.callback` | mechanical | 20 | 9 | output<any>(); a return value read by the parent is a decision | src/app/components/datakey-config.directive.js:162 |
| `binding.string` | mechanical | 9 | 5 | input<string>() | src/app/components/dashboard-autocomplete.directive.js:137 |

### ddo — 10 idioms, 269 uses

| idiom | class | uses | files | target | first seen |
|---|---|---|---|---|---|
| `ddo.restrict` | mechanical | 59 | 58 | the selector form: E → element, A → [attr], C → .class | src/app/components/circular-progress.directive.js:66 |
| `ddo.scope` | mechanical | 56 | 55 | inputs and outputs from the object; true/false → no isolate scope (note) | src/app/components/circular-progress.directive.js:68 |
| `ddo.link` | decision | 37 | 37 | ngAfterViewInit for DOM work; the element is ElementRef.nativeElement | src/app/components/circular-progress.directive.js:67 |
| `ddo.bindToController` | mechanical | 23 | 23 | inputs on the class (always so in Angular) | src/app/components/dashboard.directive.js:52 |
| `ddo.controller` | mechanical | 23 | 23 | the class body | src/app/components/dashboard.directive.js:83 |
| `ddo.controllerAs` | mechanical | 23 | 23 | none; the template refers to the class directly | src/app/components/dashboard.directive.js:84 |
| `ddo.templateUrl` | mechanical | 23 | 23 | templateUrl: (a string) / a function is a decision | src/app/components/dashboard.directive.js:85 |
| `ddo.require` | decision | 22 | 22 | inject(ParentComponent), NgModel/NgForm injection — see require.* | src/app/components/dashboard-autocomplete.directive.js:134 |
| `ddo.transclude` | decision | 2 | 2 | <ng-content> (true) / <ng-content select> per slot (an object) | src/app/components/details-sidenav.directive.js:131 |
| `ddo.compile` | decision | 1 | 1 | none; a structural directive if it rewrote the DOM | src/app/components/scope-element.directive.js:24 |

### event — 3 idioms, 19 uses

| idiom | class | uses | files | target | first seen |
|---|---|---|---|---|---|
| `event.$destroy` | mechanical | 13 | 13 | ngOnDestroy | src/app/components/dashboard.directive.js:238 |
| `event.$stateChangeStart` | decision | 4 | 4 | a CanActivate guard / NavigationStart | src/app/api/dashboard.service.js:24 |
| `event.$stateChangeSuccess` | decision | 2 | 2 | Router events NavigationEnd | src/app/app.run.js:152 |

### expression — 8 idioms, 3601 uses

| idiom | class | uses | files | target | first seen |
|---|---|---|---|---|---|
| `expression.interpolation` | mechanical | 2031 | 186 | {{ }} | src/app/admin/general-settings.tpl.html:37 |
| `expression.filter-chain` | mechanical | 1286 | 168 | \| pipe (args with : as in AngularJS) | src/app/admin/general-settings.tpl.html:37 |
| `expression.$event` | mechanical | 169 | 64 | $event | src/app/alarm/alarm-row.tpl.html:26 |
| `expression.repeat-key-value` | mechanical | 57 | 12 | @for over Object.entries / keyvalue pipe | src/app/components/widget/action/widget-action-dialog.tpl.html:38 |
| `expression.$index` | mechanical | 39 | 14 | $index | src/app/components/datasource-entity.tpl.html:84 |
| `expression.track-by` | mechanical | 13 | 10 | track | src/app/components/gateway/gateway-config.tpl.html:19 |
| `expression.$last` | mechanical | 4 | 2 | $last | src/app/dashboard/states/entity-state-controller.tpl.html:20 |
| `expression.one-time` | mechanical | 2 | 1 | none; drop the :: | src/app/extension/extensions-forms/extension-form-opc.tpl.html:140 |

### filter — 4 idioms, 46 uses

| idiom | class | uses | files | target | first seen |
|---|---|---|---|---|---|
| `filter.date` | mechanical | 18 | 14 | \| date (format names differ: a decision when a custom format is passed) | src/app/components/timewindow.directive.js:205 |
| `filter.filter` | decision | 13 | 10 | a computed() in the component, or a pipe written for it | src/app/api/alarm.service.js:318 |
| `filter.orderBy` | decision | 8 | 7 | a computed() sort in the component | src/app/api/alarm.service.js:214 |
| `filter.uppercase` | mechanical | 7 | 2 | \| uppercase | src/app/components/gateway/gateway-form.tpl.html:23 |

### helper — 20 idioms, 1065 uses

| idiom | class | uses | files | target | first seen |
|---|---|---|---|---|---|
| `helper.isDefined` | mechanical | 310 | 76 | x !== undefined | src/app/api/alarm.service.js:155 |
| `helper.element` | mechanical | 195 | 83 | $(x) when jQuery is a dependency; else ElementRef.nativeElement | src/app/components/circular-progress.directive.js:29 |
| `helper.module` | mechanical | 123 | 123 | the registration becomes the file | src/app/admin/index.js:27 |
| `helper.copy` | mechanical | 115 | 37 | structuredClone(x) | src/app/api/datasource.service.js:66 |
| `helper.equals` | decision | 86 | 49 | a deep comparison: lodash isEqual when present | src/app/api/entity.service.js:1511 |
| `helper.isUndefined` | mechanical | 77 | 21 | x === undefined | src/app/api/widget.service.js:640 |
| `helper.fromJson` | mechanical | 53 | 33 | JSON.parse(x) | src/app/api/device.service.js:199 |
| `helper.toJson` | mechanical | 39 | 20 | JSON.stringify(x) | src/app/common/utils.service.js:217 |
| `helper.lowercase` | decision | 18 | 9 | x.toLowerCase() | src/app/api/attribute.service.js:53 |
| `helper.isFunction` | mechanical | 10 | 6 | typeof x === 'function' | src/app/api/datasource.service.js:736 |
| `helper.isNumber` | mechanical | 9 | 7 | typeof x === 'number' | src/app/components/widget/widget-config.directive.js:290 |
| `helper.isString` | mechanical | 8 | 7 | typeof x === 'string' | src/app/common/dashboard-utils.service.js:71 |
| `helper.isObject` | decision | 7 | 5 | x !== null && typeof x === 'object' | src/app/common/thirdparty-fix.js:315 |
| `helper.isArray` | mechanical | 4 | 4 | Array.isArray(x) | src/app/common/dashboard-utils.service.js:197 |
| `helper.extend` | mechanical | 3 | 3 | Object.assign(...) | src/app/components/grid.directive.js:86 |
| `helper.forEach` | decision | 3 | 2 | for…of, or Object.entries() | src/app/common/utils.service.js:69 |
| `helper.isDate` | mechanical | 2 | 1 | x instanceof Date | src/app/common/thirdparty-fix.js:314 |
| `helper.bind` | decision | 1 | 1 | fn.bind(self, ...) | src/app/common/thirdparty-fix.js:45 |
| `helper.merge` | decision | 1 | 1 | a deep merge: write one, or lodash merge when present | src/app/import-export/import-export.service.js:844 |
| `helper.noop` | decision | 1 | 1 | () => {} | src/app/common/thirdparty-fix.js:287 |

### hook — 1 idioms, 2 uses

| idiom | class | uses | files | target | first seen |
|---|---|---|---|---|---|
| `hook.$onDestroy` | mechanical | 2 | 1 | ngOnDestroy | src/app/dashboard/states/states-component.directive.js:22 |

### jqlite — 24 idioms, 164 uses

| idiom | class | uses | files | target | first seen |
|---|---|---|---|---|---|
| `jqlite.index` | mechanical | 31 | 18 | ElementRef.nativeElement | src/app/common/thirdparty-fix.js:31 |
| `jqlite.html` | mechanical | 28 | 27 | innerHTML — with DomSanitizer | src/app/components/contact.directive.js:309 |
| `jqlite.contents` | mechanical | 27 | 27 | el.childNodes | src/app/components/contact.directive.js:311 |
| `jqlite.on` | mechanical | 12 | 4 | $(el).on / addEventListener; a host listener is the Angular shape | src/app/common/thirdparty-fix.js:40 |
| `jqlite.addClass` | mechanical | 10 | 6 | el.classList.add; a host class binding | src/app/components/expand-fullscreen.directive.js:70 |
| `jqlite.parent` | mechanical | 10 | 9 | el.parentElement | src/app/components/details-sidenav.directive.js:65 |
| `jqlite.removeClass` | mechanical | 10 | 2 | el.classList.remove | src/app/components/expand-fullscreen.directive.js:77 |
| `jqlite.find` | mechanical | 7 | 6 | $(el).find when jQuery is a dependency; else querySelectorAll | src/app/components/expand-fullscreen.directive.js:32 |
| `jqlite.attr` | mechanical | 5 | 2 | getAttribute/setAttribute; a host attribute binding | src/app/components/md-chip-draggable.directive.js:46 |
| `jqlite.off` | mechanical | 4 | 2 | $(el).off / removeEventListener | src/app/components/md-chip-draggable.directive.js:175 |
| `jqlite.css` | mechanical | 2 | 1 | el.style; a host style binding | src/app/widget/lib/rpc/switch.directive.js:170 |
| `jqlite.detach` | mechanical | 2 | 1 | el.remove() | src/app/components/expand-fullscreen.directive.js:62 |
| `jqlite.height` | mechanical | 2 | 2 | el.offsetHeight / el.style.height | src/app/alarm/alarm-details-dialog.controller.js:72 |
| `jqlite.offset` | mechanical | 2 | 2 | el.getBoundingClientRect() | src/app/components/mousepoint-menu.directive.js:27 |
| `jqlite.prop` | mechanical | 2 | 1 | el[prop] | src/app/components/circular-progress.directive.js:34 |
| `jqlite.ready` | decision | 2 | 2 | ngAfterViewInit | src/app/components/widget/action/custom-action-pretty-editor.directive.js:940 |
| `jqlite.animate` | decision | 1 | 1 | @angular/animations | src/app/extension/extension-dialog.controller.js:76 |
| `jqlite.append` | mechanical | 1 | 1 | el.append / a template | src/app/help/help.directive.js:66 |
| `jqlite.focus` | mechanical | 1 | 1 | el.focus() | src/app/layout/home.controller.js:136 |
| `jqlite.outerHeight` | mechanical | 1 | 1 | el.offsetHeight | src/app/components/dashboard.directive.js:716 |
| `jqlite.plugin` | decision | 1 | 1 | a jQuery plugin (popover, tooltip, sortable, datepicker, modal, dropdown, tab, collapse…): keep it behind jQuery, or replace it with a component | src/app/components/nav-tree.directive.js:82 |
| `jqlite.prepend` | mechanical | 1 | 1 | el.prepend | src/app/components/expand-fullscreen.directive.js:144 |
| `jqlite.scope` | decision | 1 | 1 | none; state lives on the class | src/app/dashboard/layouts/dashboard-layout.directive.js:170 |
| `jqlite.scrollTop` | mechanical | 1 | 1 | el.scrollTop | src/app/extension/extension-dialog.controller.js:70 |

### member — 35 idioms, 1879 uses

| idiom | class | uses | files | target | first seen |
|---|---|---|---|---|---|
| `member.$scope.field` | mechanical | 1205 | 47 | a field (or a signal) on the class | src/app/components/widget/action/custom-action-pretty-editor.directive.js:899 |
| `member.$q.defer` | decision | 206 | 30 | new Promise((resolve, reject) => …) | src/app/api/admin.service.js:35 |
| `member.$http.get` | note | 73 | 19 | this.http.get(url, { params }) — an Observable; the callers await via firstValueFrom | src/app/api/admin.service.js:37 |
| `member.$http.post` | note | 54 | 14 | this.http.post(url, body) | src/app/api/admin.service.js:48 |
| `member.$filter.call` | decision | 41 | 16 | inject the pipe and call transform() | src/app/api/alarm.service.js:214 |
| `member.$attrs.field` | decision | 39 | 11 | an input, or HostAttributeToken for a static attribute | src/app/components/timewindow.directive.js:72 |
| `member.$compile.call` | decision | 33 | 30 | ViewContainerRef.createComponent / createEmbeddedView | src/app/components/circular-progress.directive.js:31 |
| `member.$window.member` | mechanical | 32 | 10 | window.<member>; a name the legacy page set is declared in legacy-prototypes.d.ts | src/app/api/widget.service.js:64 |
| `member.$templateCache.get` | note | 28 | 26 | templateUrl on the component when the argument is a string; else a decision | src/app/components/contact.directive.js:307 |
| `member.$rootScope.field` | decision | 27 | 8 | a field on a root-provided service | src/app/api/dashboard.service.js:24 |
| `member.$timeout.call` | mechanical | 27 | 18 | setTimeout(fn, ms) | src/app/api/alarm.service.js:305 |
| `member.$http.delete` | note | 21 | 12 | this.http.delete(url) | src/app/api/alarm.service.js:143 |
| `member.$q.all` | mechanical | 20 | 10 | Promise.all | src/app/api/entity.service.js:108 |
| `member.$q.when` | mechanical | 11 | 7 | Promise.resolve | src/app/api/entity.service.js:938 |
| `member.$timeout.cancel` | mechanical | 10 | 4 | clearTimeout(handle) | src/app/api/telemetry-websocket.service.js:130 |
| `member.$location.search` | decision | 7 | 1 | this.route.snapshot.queryParams / navigate with { queryParams } | src/app/api/user.service.js:358 |
| `member.$rootScope.$broadcast` | decision | 6 | 2 | a root-provided service Subject | src/app/api/telemetry-websocket.service.js:320 |
| `member.$sce.trustAsHtml` | mechanical | 6 | 1 | this.sanitizer.bypassSecurityTrustHtml | src/app/widget/lib/tripAnimation/trip-animation-widget.js:460 |
| `member.$rootScope.$on` | decision | 5 | 4 | an rxjs Subject on a root-provided service | src/app/api/dashboard.service.js:24 |
| `member.$log.error` | mechanical | 4 | 1 | console.error | src/app/api/entity.service.js:78 |
| `member.$state.go` | decision | 4 | 3 | this.router.navigate([...]) — the state name maps to a path in the routes file | src/app/api/user.service.js:645 |
| `member.$animate.enabled` | decision | 2 | 1 | @.disabled binding | src/app/components/no-animate.directive.js:27 |
| `member.$controller.call` | decision | 2 | 2 | none | src/app/components/grid.directive.js:87 |
| `member.$interval.call` | mechanical | 2 | 1 | setInterval(fn, ms) | src/app/api/alarm.service.js:291 |
| `member.$interval.cancel` | mechanical | 2 | 1 | clearInterval(handle) | src/app/api/alarm.service.js:296 |
| `member.$parse.call` | decision | 2 | 2 | a function input | src/app/components/confirm-on-exit.directive.js:43 |
| `member.$state.includes` | decision | 2 | 1 | this.router.url.startsWith(...) | src/app/services/menu.service.js:363 |
| `member.$animate.enter` | decision | 1 | 1 | @angular/animations :enter | src/app/components/details-sidenav.directive.js:69 |
| `member.$animate.leave` | decision | 1 | 1 | @angular/animations :leave | src/app/components/details-sidenav.directive.js:70 |
| `member.$delegate.call` | decision | 1 | 1 | super(...) in the subclass | src/app/app.config.js:74 |
| `member.$location.host` | decision | 1 | 1 | window.location.host | src/app/api/dashboard.service.js:250 |
| `member.$location.port` | decision | 1 | 1 | window.location.port | src/app/api/dashboard.service.js:251 |
| `member.$location.protocol` | decision | 1 | 1 | window.location.protocol | src/app/api/dashboard.service.js:250 |
| `member.$log.warn` | mechanical | 1 | 1 | console.warn | src/app/api/telemetry-websocket.service.js:121 |
| `member.$rootScope.scope` | decision | 1 | 1 | see scope.*; app-wide state belongs in a root service | src/app/common/thirdparty-fix.js:36 |

### module — 10 idioms, 255 uses

| idiom | class | uses | files | target | first seen |
|---|---|---|---|---|---|
| `module.directive` | mechanical | 111 | 78 | @Component when it has a template, else @Directive | src/app/alarm/index.js:21 |
| `module.controller` | mechanical | 74 | 32 | @Component (the template that names it) | src/app/admin/index.js:27 |
| `module.factory` | mechanical | 36 | 34 | @Injectable({ providedIn: 'root' }); a returned constructor becomes the class | src/app/api/admin.service.js:16 |
| `module.config` | decision | 17 | 17 | providers / route config / APP_INITIALIZER — see provider.* | src/app/admin/index.js:27 |
| `module.filter` | mechanical | 9 | 8 | @Pipe | src/app/components/contact-short.filter.js:16 |
| `module.provider` | decision | 3 | 2 | @Injectable + an InjectionToken for the configured part | src/app/common/raf.provider.js:16 |
| `module.constant` | mechanical | 2 | 2 | an exported const | src/app/common/types.constant.js:16 |
| `module.decorator` | decision | 1 | 1 | a subclass provided in place of the class | src/app/app.config.js:63 |
| `module.run` | decision | 1 | 1 | APP_INITIALIZER, or a root service constructor | src/app/app.js:107 |
| `module.value` | mechanical | 1 | 1 | an exported const, or an InjectionToken | src/app/components/json-form.directive.js:28 |

### ngmodel — 11 idioms, 274 uses

| idiom | class | uses | files | target | first seen |
|---|---|---|---|---|---|
| `ngmodel.$viewValue` | decision | 133 | 37 | the control's value | src/app/components/dashboard-autocomplete.directive.js:86 |
| `ngmodel.$setViewValue` | decision | 41 | 33 | ControlValueAccessor onChange | src/app/components/dashboard-autocomplete.directive.js:81 |
| `ngmodel.$render` | decision | 37 | 37 | ControlValueAccessor.writeValue | src/app/components/dashboard-autocomplete.directive.js:85 |
| `ngmodel.$setValidity` | decision | 32 | 16 | control.setErrors | src/app/components/datasource-entity.directive.js:63 |
| `ngmodel.$setPristine` | decision | 13 | 6 | control.markAsPristine() | src/app/components/grid.directive.js:540 |
| `ngmodel.$setDirty` | decision | 10 | 4 | control.markAsDirty() | src/app/components/datasource-entity.directive.js:107 |
| `resource.$get` | decision | 3 | 2 | HttpClient.get ($resource) | src/app/common/raf.provider.js:22 |
| `ngmodel.$parsers` | decision | 2 | 2 | ControlValueAccessor: parse in onChange | src/app/components/tb-json-to-string.directive.js:41 |
| `ngmodel.$dirty` | decision | 1 | 1 | control.dirty | src/app/dashboard/dashboard.controller.js:818 |
| `ngmodel.$formatters` | decision | 1 | 1 | ControlValueAccessor: format in writeValue | src/app/components/tb-json-to-string.directive.js:42 |
| `ngmodel.$valid` | decision | 1 | 1 | control.valid | src/app/rulechain/rulechain.controller.js:423 |

### require — 3 idioms, 42 uses

| idiom | class | uses | files | target | first seen |
|---|---|---|---|---|---|
| `require.ngModel` | decision | 21 | 21 | inject(NgControl) / implement ControlValueAccessor | src/app/components/dashboard-autocomplete.directive.js:134 |
| `require.parent` | decision | 20 | 20 | inject(ParentClass) (host or ancestor) | src/app/components/dashboard-autocomplete.directive.js:134 |
| `require.self` | decision | 1 | 1 | inject(OwnClass) | src/app/components/mousepoint-menu.directive.js:53 |

### scope — 15 idioms, 416 uses

| idiom | class | uses | files | target | first seen |
|---|---|---|---|---|---|
| `scope.$watch` | decision | 223 | 98 | effect() over a signal, or ngOnChanges for an input | src/app/components/circular-progress.directive.js:40 |
| `scope.$on` | decision | 77 | 43 | an rxjs Subject on a shared service; $destroy → ngOnDestroy | src/app/api/dashboard.service.js:24 |
| `scope.$broadcast` | decision | 34 | 16 | a shared service Subject | src/app/api/telemetry-websocket.service.js:320 |
| `scope.$applyAsync` | mechanical | 13 | 9 | none (dropped, the callback runs) | src/app/components/widget/action/custom-action-pretty-editor.directive.js:984 |
| `scope.$apply` | mechanical | 12 | 11 | none; change detection is automatic (dropped, the callback runs) | src/app/common/utils.service.js:265 |
| `scope.$parent` | decision | 12 | 6 | an input from the parent, or a shared service | src/app/components/md-chip-draggable.directive.js:74 |
| `scope.$digest` | mechanical | 11 | 11 | none (dropped) | src/app/widget/lib/alarms-table-widget.js:157 |
| `scope.$emit` | decision | 10 | 7 | an output, or a shared service Subject | src/app/common/utils.service.js:264 |
| `scope.$eval` | decision | 8 | 4 | call the function directly; an expression string needs $parse | src/app/components/confirm-on-exit.directive.js:24 |
| `scope.$new` | decision | 4 | 4 | a child component, or an embedded view context | src/app/common/thirdparty-fix.js:36 |
| `scope.$root` | decision | 4 | 1 | a root-provided service | src/app/dashboard/dashboard.controller.js:364 |
| `scope.$destroy` | decision | 3 | 3 | ngOnDestroy / DestroyRef | src/app/components/json-form.directive.js:72 |
| `scope.$watchCollection` | decision | 3 | 3 | effect() over a signal; a computed() for derived lists | src/app/components/dashboard.directive.js:344 |
| `scope.$last` | mechanical | 1 | 1 | $last from the @for context, passed as an input | src/app/components/finish-render.directive.js:25 |
| `scope.$watchGroup` | decision | 1 | 1 | one effect() reading several signals | src/app/components/timewindow.directive.js:254 |

### token — 22 idioms, 373 uses

| idiom | class | uses | files | target | first seen |
|---|---|---|---|---|---|
| `token.$element` | mechanical | 72 | 28 | inject(ElementRef) | src/app/components/circular-progress.directive.js:37 |
| `token.$scope` | note | 64 | 56 | component state: fields and signals on the class | src/app/common/thirdparty-fix.js:137 |
| `token.$q` | note | 39 | 39 | Promise, or an Observable | src/app/api/admin.service.js:21 |
| `token.$compile` | decision | 30 | 30 | not in Angular: compose with components, ViewContainerRef.createComponent | src/app/components/circular-progress.directive.js:25 |
| `token.$templateCache` | note | 26 | 26 | templateUrl on the component | src/app/components/contact.directive.js:27 |
| `token.$filter` | decision | 24 | 19 | inject the pipe class and call transform() | src/app/api/alarm.service.js:21 |
| `token.$timeout` | mechanical | 22 | 21 | setTimeout (a call), or an rxjs timer | src/app/api/alarm.service.js:21 |
| `token.$http` | mechanical | 21 | 21 | inject(HttpClient) | src/app/api/admin.service.js:21 |
| `token.$window` | note | 20 | 16 | window | src/app/api/device.service.js:23 |
| `token.$document` | mechanical | 19 | 19 | inject(DOCUMENT) | src/app/common/thirdparty-fix.js:27 |
| `token.$rootScope` | decision | 12 | 12 | a root-provided service, or a signal in one | src/app/api/dashboard.service.js:20 |
| `token.$log` | mechanical | 5 | 4 | console | src/app/api/datasource.service.js:29 |
| `token.$state` | note | 5 | 5 | inject(Router); the members are decisions | src/app/api/user.service.js:25 |
| `token.$animate` | decision | 2 | 2 | @angular/animations, or AnimationBuilder | src/app/components/details-sidenav.directive.js:29 |
| `token.$controller` | decision | 2 | 2 | none; the controller is a component | src/app/components/grid.directive.js:56 |
| `token.$injector` | decision | 2 | 2 | inject(Injector) | src/app/components/gateway/gateway-form.directive.js:47 |
| `token.$location` | note | 2 | 2 | inject(Router) / Location; the members are decisions | src/app/api/dashboard.service.js:20 |
| `token.$parse` | decision | 2 | 2 | not in Angular: a function input, or a small evaluator | src/app/components/confirm-on-exit.directive.js:21 |
| `token.$attrs` | decision | 1 | 1 | inputs; HostAttributeToken for static attributes | src/app/components/details-sidenav.directive.js:48 |
| `token.$delegate` | decision | 1 | 1 | the decorated class, as a subclass provided in its place | src/app/app.config.js:63 |
| `token.$interval` | mechanical | 1 | 1 | setInterval (a call), or an rxjs interval | src/app/api/alarm.service.js:21 |
| `token.$sce` | mechanical | 1 | 1 | inject(DomSanitizer) | src/app/widget/lib/tripAnimation/trip-animation-widget.js:122 |

## Catalogued idioms this repo does not use

- **attribute** (40): `attribute.ng-app`, `attribute.ng-controller`, `attribute.ng-repeat-start`, `attribute.ng-repeat-end`, `attribute.ng-class-even`, `attribute.ng-class-odd`, `attribute.ng-mouseup`, `attribute.ng-mousemove`, `attribute.ng-mouseover`, `attribute.ng-keypress`, `attribute.ng-focus`, `attribute.ng-copy`, `attribute.ng-cut`, `attribute.ng-paste`, `attribute.ng-bind-template`, `attribute.ng-open`, `attribute.ng-srcset`, `attribute.ng-minlength`, `attribute.ng-maxlength`, `attribute.ng-list`, `attribute.ng-trim`, `attribute.ng-options`, `attribute.ng-non-bindable`, `attribute.ng-csp`, `attribute.ng-jq`, `attribute.ng-pluralize`, `attribute.ng-ref`, `attribute.ng-message-exp`, `attribute.ng-messages-include`, `attribute.ng-animate-children`, `attribute.ng-animate-swap`, `attribute.ng-swipe-left`, `attribute.ng-swipe-right`, `attribute.ng-view`, `attribute.ui-sref-active`, `attribute.ui-sref-opts`, `attribute.ui-state`, `attribute.ng-template-script`, `attribute.ng-container`, `attribute.ng-content`
- **binding** (1): `binding.one-way`
- **ddo** (9): `ddo.bindings`, `ddo.template`, `ddo.templateNamespace`, `ddo.replace`, `ddo.priority`, `ddo.terminal`, `ddo.multiElement`, `ddo.name`, `ddo.$canActivate`
- **event** (13): `event.$locationChangeStart`, `event.$locationChangeSuccess`, `event.$routeChangeStart`, `event.$routeChangeSuccess`, `event.$routeChangeError`, `event.$routeUpdate`, `event.$stateChangeError`, `event.$stateNotFound`, `event.$viewContentLoaded`, `event.$viewContentLoading`, `event.$includeContentLoaded`, `event.$includeContentRequested`, `event.$includeContentError`
- **expression** (8): `expression.repeat-alias`, `expression.$first`, `expression.$middle`, `expression.$even`, `expression.$odd`, `expression.$parent`, `expression.ng-options-comprehension`, `expression.controllerAs-prefix`
- **filter** (5): `filter.currency`, `filter.json`, `filter.limitTo`, `filter.lowercase`, `filter.number`
- **helper** (9): `helper.isElement`, `helper.identity`, `helper.uppercase`, `helper.bootstrap`, `helper.injector`, `helper.version`, `helper.errorHandlingConfig`, `helper.reloadWithDebugInfo`, `helper.mock`
- **hook** (4): `hook.$onInit`, `hook.$onChanges`, `hook.$postLink`, `hook.$doCheck`
- **jqlite** (90): `jqlite.bind`, `jqlite.unbind`, `jqlite.one`, `jqlite.toggleClass`, `jqlite.hasClass`, `jqlite.removeAttr`, `jqlite.text`, `jqlite.val`, `jqlite.after`, `jqlite.remove`, `jqlite.empty`, `jqlite.replaceWith`, `jqlite.wrap`, `jqlite.children`, `jqlite.next`, `jqlite.eq`, `jqlite.clone`, `jqlite.data`, `jqlite.removeData`, `jqlite.triggerHandler`, `jqlite.controller`, `jqlite.isolateScope`, `jqlite.injector`, `jqlite.inheritedData`, `jqlite.closest`, `jqlite.parents`, `jqlite.siblings`, `jqlite.prev`, `jqlite.first`, `jqlite.last`, `jqlite.filter`, `jqlite.not`, `jqlite.is`, `jqlite.each`, `jqlite.map`, `jqlite.get`, `jqlite.length`, `jqlite.width`, `jqlite.innerHeight`, `jqlite.innerWidth`, `jqlite.outerWidth`, `jqlite.position`, `jqlite.scrollLeft`, `jqlite.blur`, `jqlite.click`, `jqlite.trigger`, `jqlite.show`, `jqlite.hide`, `jqlite.toggle`, `jqlite.fadeIn`, `jqlite.fadeOut`, `jqlite.slideUp`, `jqlite.slideDown`, `jqlite.stop`, `jqlite.before`, `jqlite.insertAfter`, `jqlite.insertBefore`, `jqlite.appendTo`, `jqlite.prependTo`, `jqlite.hover`, `jqlite.keydown`, `jqlite.keyup`, `jqlite.change`, `jqlite.submit`, `jqlite.select`, `jqlite.serialize`, `jqlite.setAttribute`, `jqlite.getAttribute`, `jqlite.querySelector`, `jqlite.querySelectorAll`, `jqlite.addEventListener`, `jqlite.removeEventListener`, `jqlite.classList`, `jqlite.style`, `jqlite.innerHTML`, `jqlite.textContent`, `jqlite.value`, `jqlite.getBoundingClientRect`, `jqlite.scrollIntoView`, `jqlite.contains`, `jqlite.tagName`, `jqlite.id`, `jqlite.className`, `jqlite.parentNode`, `jqlite.parentElement`, `jqlite.childNodes`, `jqlite.firstChild`, `jqlite.nodeName`, `jqlite.dataset`, `jqlite.outerHTML`
- **member** (92): `member.$q.race`, `member.$q.resolve`, `member.$q.reject`, `member.$q.call`, `member.$http.put`, `member.$http.patch`, `member.$http.head`, `member.$http.jsonp`, `member.$http.call`, `member.$http.success`, `member.$http.error`, `member.$http.defaults`, `member.$http.pendingRequests`, `member.$log.log`, `member.$log.info`, `member.$log.debug`, `member.$location.path`, `member.$location.url`, `member.$location.hash`, `member.$location.absUrl`, `member.$location.replace`, `member.$location.state`, `member.$state.transitionTo`, `member.$state.href`, `member.$state.is`, `member.$state.reload`, `member.$state.get`, `member.$state.current`, `member.$state.params`, `member.$state.$current`, `member.$sce.trustAsResourceUrl`, `member.$sce.trustAsUrl`, `member.$sce.trustAsJs`, `member.$sce.trustAsCss`, `member.$sce.trustAs`, `member.$sce.getTrustedHtml`, `member.$sce.getTrustedResourceUrl`, `member.$sce.parseAsHtml`, `member.$sce.isEnabled`, `member.$templateCache.put`, `member.$templateCache.remove`, `member.$templateCache.removeAll`, `member.$cacheFactory.call`, `member.$interpolate.call`, `member.$injector.get`, `member.$injector.has`, `member.$injector.invoke`, `member.$injector.instantiate`, `member.$injector.annotate`, `member.$attrs.$observe`, `member.$attrs.$set`, `member.$attrs.$addClass`, `member.$attrs.$removeClass`, `member.$attrs.$updateClass`, `member.$attrs.$normalize`, `member.$attrs.$attr`, `member.$transclude.call`, `member.$transclude.isSlotFilled`, `member.$animate.addClass`, `member.$animate.removeClass`, `member.$animate.setClass`, `member.$animate.animate`, `member.$animate.on`, `member.$animate.off`, `member.$document.jqlite`, `member.$rootScope.$emit`, `member.$locale.field`, `member.$templateCache.field`, `member.$stateParams.field`, `member.$routeParams.field`, `member.$rootElement.jqlite`, `member.$delegate.field`, `member.$httpBackend.test`, `member.$exceptionHandler.call`, `member.$resource.call`, `member.$cookies.get`, `member.$cookies.put`, `member.$cookies.remove`, `member.$cookies.getObject`, `member.$cookies.putObject`, `member.$cookies.getAll`, `member.$anchorScroll.call`, `member.$route.reload`, `member.$route.current`, `member.$transitions.onStart`, `member.$transitions.onSuccess`, `member.$transitions.onBefore`, `member.$transitions.onError`, `member.$transitions.onExit`, `member.$transitions.onEnter`, `member.$transitions.onFinish`, `member.$transitions.onRetain`
- **module** (5): `module.component`, `module.service`, `module.animation`, `module.requires`, `module.info`
- **ngmodel** (33): `ngmodel.$modelValue`, `ngmodel.$validators`, `ngmodel.$asyncValidators`, `ngmodel.$validate`, `ngmodel.$isEmpty`, `ngmodel.$setTouched`, `ngmodel.$setUntouched`, `ngmodel.$rollbackViewValue`, `ngmodel.$commitViewValue`, `ngmodel.$viewChangeListeners`, `ngmodel.$error`, `ngmodel.$pending`, `ngmodel.$invalid`, `ngmodel.$pristine`, `ngmodel.$touched`, `ngmodel.$untouched`, `ngmodel.$name`, `ngmodel.$options`, `ngmodel.$overrideModelOptions`, `ngmodel.$processModelValue`, `form.$submitted`, `form.$setSubmitted`, `form.$addControl`, `form.$removeControl`, `form.$getControls`, `resource.$promise`, `resource.$resolved`, `resource.$save`, `resource.$delete`, `resource.$remove`, `resource.$query`, `resource.$update`, `resource.$cancelRequest`
- **provider** (45): `provider.$httpProvider.interceptors`, `provider.$httpProvider.defaults`, `provider.$httpProvider.useApplyAsync`, `provider.$httpProvider.useLegacyPromiseExtensions`, `provider.$httpProvider.responseInterceptors`, `provider.$locationProvider.html5Mode`, `provider.$locationProvider.hashPrefix`, `provider.$compileProvider.debugInfoEnabled`, `provider.$compileProvider.preAssignBindingsEnabled`, `provider.$compileProvider.aHrefSanitizationWhitelist`, `provider.$compileProvider.aHrefSanitizationTrustedUrlList`, `provider.$compileProvider.imgSrcSanitizationWhitelist`, `provider.$compileProvider.commentDirectivesEnabled`, `provider.$compileProvider.cssClassDirectivesEnabled`, `provider.$compileProvider.directive`, `provider.$compileProvider.component`, `provider.$controllerProvider.register`, `provider.$filterProvider.register`, `provider.$provide.decorator`, `provider.$provide.factory`, `provider.$provide.service`, `provider.$provide.value`, `provider.$provide.constant`, `provider.$provide.provider`, `provider.$animateProvider.classNameFilter`, `provider.$logProvider.debugEnabled`, `provider.$qProvider.errorOnUnhandledRejections`, `provider.$interpolateProvider.startSymbol`, `provider.$interpolateProvider.endSymbol`, `provider.$sceProvider.enabled`, `provider.$sceDelegateProvider.resourceUrlWhitelist`, `provider.$sceDelegateProvider.trustedResourceUrlList`, `provider.$stateProvider.state`, `provider.$stateProvider.decorator`, `provider.$urlRouterProvider.otherwise`, `provider.$urlRouterProvider.when`, `provider.$urlRouterProvider.rule`, `provider.$urlRouterProvider.deferIntercept`, `provider.$routeProvider.when`, `provider.$routeProvider.otherwise`, `provider.$urlMatcherFactoryProvider.strictMode`, `provider.$urlMatcherFactoryProvider.caseInsensitive`, `provider.$urlMatcherFactoryProvider.type`, `provider.$uiRouterProvider.plugin`, `provider.$anchorScrollProvider.disableAutoScrolling`
- **require** (3): `require.form`, `require.ancestor`, `require.optional`
- **scope** (16): `scope.$evalAsync`, `scope.$id`, `scope.$$phase`, `scope.$$postDigest`, `scope.$$destroyed`, `scope.$$listeners`, `scope.$$childHead`, `scope.$$childTail`, `scope.$$nextSibling`, `scope.$$prevSibling`, `scope.$$watchers`, `scope.$index`, `scope.$first`, `scope.$even`, `scope.$odd`, `scope.$middle`
- **token** (57): `token.$transclude`, `token.$httpBackend`, `token.$httpParamSerializer`, `token.$httpParamSerializerJQLike`, `token.$anchorScroll`, `token.$interpolate`, `token.$templateRequest`, `token.$cacheFactory`, `token.$sceDelegate`, `token.$exceptionHandler`, `token.$animateCss`, `token.$locale`, `token.$rootElement`, `token.$browser`, `token.$xhrFactory`, `token.$jsonpCallbacks`, `token.$$rAF`, `token.$route`, `token.$routeParams`, `token.$stateParams`, `token.$transitions`, `token.$transition$`, `token.$uiRouter`, `token.$uiRouterGlobals`, `token.$urlRouter`, `token.$urlService`, `token.$stateRegistry`, `token.$view`, `token.$trace`, `token.$resolve`, `token.$resource`, `token.$sanitize`, `token.$cookies`, `token.$cookieStore`, `token.$swipe`, `token.$aria`, `token.$provide`, `token.$httpProvider`, `token.$locationProvider`, `token.$compileProvider`, `token.$controllerProvider`, `token.$filterProvider`, `token.$animateProvider`, `token.$interpolateProvider`, `token.$logProvider`, `token.$parseProvider`, `token.$qProvider`, `token.$rootScopeProvider`, `token.$sceProvider`, `token.$sceDelegateProvider`, `token.$templateRequestProvider`, `token.$anchorScrollProvider`, `token.$stateProvider`, `token.$urlRouterProvider`, `token.$routeProvider`, `token.$urlMatcherFactoryProvider`, `token.$uiRouterProvider`

