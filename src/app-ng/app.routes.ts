// Scaffolded by the playbook from the ui-router states in the legacy route files; data carries each state's data, params, module, auth and breadcrumb.
import { Routes } from '@angular/router';
import { types } from './feature/common/constants/types';

export const routes: Routes = [
  {
    path: 'dashboard/:dashboardId',
    loadComponent: () => import('./feature/dashboard/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    data: { state: 'dashboard', module: 'private', auth: ['TENANT_ADMIN', 'CUSTOMER_USER'], template: 'src/app/dashboard/dashboard.tpl.html', ...{
                widgetEditMode: false,
                searchEnabled: false,
                pageTitle: 'dashboard.dashboard'
            } },
  },
  {
    path: 'login/createPassword',
    loadComponent: () => import('./feature/login/create-password/create-password.component').then((m) => m.CreatePasswordComponent),
    data: { state: 'login.createPassword', module: 'public', template: 'src/app/login/create-password.tpl.html', ...{
            pageTitle: 'login.create-password'
        } },
  },
  {
    path: 'login/resetExpiredPassword',
    loadComponent: () => import('./feature/login/reset-password/reset-password.component').then((m) => m.ResetPasswordComponent),
    data: { state: 'login.resetExpiredPassword', module: 'public', template: 'src/app/login/reset-password.tpl.html', ...{
            expiredPassword: true,
            pageTitle: 'login.reset-password'
        } },
  },
  {
    path: 'login/resetPassword',
    loadComponent: () => import('./feature/login/reset-password/reset-password.component').then((m) => m.ResetPasswordComponent),
    data: { state: 'login.resetPassword', module: 'public', template: 'src/app/login/reset-password.tpl.html', ...{
            pageTitle: 'login.reset-password'
        } },
  },
  {
    path: 'login/resetPasswordRequest',
    loadComponent: () => import('./feature/login/reset-password-request/reset-password-request.component').then((m) => m.ResetPasswordRequestComponent),
    data: { state: 'login.resetPasswordRequest', module: 'public', template: 'src/app/login/reset-password-request.tpl.html', ...{
            pageTitle: 'login.request-password-reset'
        } },
  },
  {
    path: 'login',
    loadComponent: () => import('./feature/login/login/login.component').then((m) => m.LoginComponent),
    data: { state: 'login', module: 'public', template: 'src/app/login/login.tpl.html', ...{
            pageTitle: 'login.login'
        } },
  },
  {
    path: 'widget-editor',
    loadComponent: () => import('./feature/dashboard/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    data: { state: 'widgetEditor', module: 'private', auth: ['SYS_ADMIN', 'TENANT_ADMIN'], template: 'src/app/dashboard/dashboard.tpl.html', ...{
                widgetEditMode: true,
                searchEnabled: false,
                pageTitle: 'widget.editor'
            } },
  },
  {
    path: '',
    loadComponent: () => import('./feature/layout/home/home.component').then((m) => m.HomeComponent),
    data: { state: 'home', module: 'private', auth: ['SYS_ADMIN', 'TENANT_ADMIN', 'CUSTOMER_USER'], template: 'src/app/layout/home.tpl.html', ...{
                pageTitle: 'home.home'
            } },
    children: [
      {
      path: 'settings/security-settings',
      loadComponent: () => import('./feature/admin/security-settings/security-settings.component').then((m) => m.SecuritySettingsComponent),
      data: { state: 'home.settings.security-settings', module: 'private', auth: ['SYS_ADMIN'], breadcrumb: '{"icon": "security", "label": "admin.security-settings"}', template: 'src/app/admin/security-settings.tpl.html', ...{
                  pageTitle: 'admin.security-settings'
              } },
    },
      {
      path: 'settings/outgoing-mail',
      loadComponent: () => import('./feature/admin/admin/admin.component').then((m) => m.AdminComponent),
      data: { state: 'home.settings.outgoing-mail', module: 'private', auth: ['SYS_ADMIN'], breadcrumb: '{"icon": "mail", "label": "admin.outgoing-mail"}', template: 'src/app/admin/outgoing-mail-settings.tpl.html', ...{
                  key: 'mail',
                  pageTitle: 'admin.outgoing-mail-settings'
              } },
    },
      {
      path: 'settings/general',
      loadComponent: () => import('./feature/admin/admin/admin.component').then((m) => m.AdminComponent),
      data: { state: 'home.settings.general', module: 'private', auth: ['SYS_ADMIN'], breadcrumb: '{"icon": "settings_applications", "label": "admin.general"}', template: 'src/app/admin/general-settings.tpl.html', ...{
                  key: 'general',
                  pageTitle: 'admin.general-settings'
              } },
    },
      { path: 'settings', redirectTo: '/settings/general', pathMatch: 'full' },
      {
      path: 'customers/:customerId/assets',
      loadComponent: () => import('./feature/asset/asset/asset.component').then((m) => m.AssetComponent),
      data: { state: 'home.customers.assets', module: 'private', auth: ['TENANT_ADMIN'], params: {'topIndex': 0}, breadcrumb: '{"icon": "domain", "label": "{{ vm.customerAssetsTitle }}", "translate": "false"}', template: 'src/app/asset/assets.tpl.html', ...{
                  assetsType: 'customer',
                  searchEnabled: true,
                  searchByEntitySubtype: true,
                  searchEntityType: types.entityType.asset,
                  pageTitle: 'customer.assets'
              } },
    },
      {
      path: 'assets',
      loadComponent: () => import('./feature/asset/asset/asset.component').then((m) => m.AssetComponent),
      data: { state: 'home.assets', module: 'private', auth: ['TENANT_ADMIN', 'CUSTOMER_USER'], params: {'topIndex': 0}, breadcrumb: '{"icon": "domain", "label": "asset.assets"}', template: 'src/app/asset/assets.tpl.html', ...{
                  assetsType: 'tenant',
                  searchEnabled: true,
                  searchByEntitySubtype: true,
                  searchEntityType: types.entityType.asset,
                  pageTitle: 'asset.assets'
              } },
    },
      {
      path: 'auditLogs',
      loadComponent: () => import('./feature/audit/audit-logs/audit-logs.component').then((m) => m.AuditLogsComponent),
      data: { state: 'home.auditLogs', module: 'private', auth: ['TENANT_ADMIN'], breadcrumb: '{"icon": "track_changes", "label": "audit-log.audit-logs"}', template: 'src/app/audit/audit-logs.tpl.html', ...{
                  searchEnabled: false,
                  pageTitle: 'audit-log.audit-logs'
              } },
    },
      {
      path: 'customers',
      loadComponent: () => import('./feature/customer/customer/customer.component').then((m) => m.CustomerComponent),
      data: { state: 'home.customers', module: 'private', auth: ['TENANT_ADMIN'], params: {'topIndex': 0}, breadcrumb: '{"icon": "supervisor_account", "label": "customer.customers"}', template: 'src/app/customer/customers.tpl.html', ...{
                  searchEnabled: true,
                  pageTitle: 'customer.customers'
              } },
    },
      {
      path: 'customers/:customerId/dashboards/:dashboardId',
      loadComponent: () => import('./feature/dashboard/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      data: { state: 'home.customers.dashboards.dashboard', module: 'private', auth: ['TENANT_ADMIN', 'CUSTOMER_USER'], breadcrumb: '{"icon": "dashboard", "label": "customer.dashboard"}', template: 'src/app/dashboard/dashboard.tpl.html', ...{
                  searchEnabled: false,
                  pageTitle: 'customer.dashboard'
              } },
    },
      {
      path: 'dashboards/:dashboardId',
      loadComponent: () => import('./feature/dashboard/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      data: { state: 'home.dashboards.dashboard', module: 'private', auth: ['TENANT_ADMIN', 'CUSTOMER_USER'], breadcrumb: '{"icon": "dashboard", "label": "{{ vm.dashboard.title }}", "translate": "false"}', template: 'src/app/dashboard/dashboard.tpl.html', ...{
                  widgetEditMode: false,
                  searchEnabled: false,
                  pageTitle: 'dashboard.dashboard'
              } },
    },
      {
      path: 'customers/:customerId/dashboards',
      loadComponent: () => import('./feature/dashboard/dashboards/dashboards.component').then((m) => m.DashboardsComponent),
      data: { state: 'home.customers.dashboards', module: 'private', auth: ['TENANT_ADMIN'], params: {'topIndex': 0}, breadcrumb: '{"icon": "dashboard", "label": "{{ vm.customerDashboardsTitle }}", "translate": "false"}', template: 'src/app/dashboard/dashboards.tpl.html', ...{
                  dashboardsType: 'customer',
                  searchEnabled: true,
                  pageTitle: 'customer.dashboards'
              } },
    },
      {
      path: 'dashboards',
      loadComponent: () => import('./feature/dashboard/dashboards/dashboards.component').then((m) => m.DashboardsComponent),
      data: { state: 'home.dashboards', module: 'private', auth: ['TENANT_ADMIN', 'CUSTOMER_USER'], params: {'topIndex': 0}, breadcrumb: '{"icon": "dashboard", "label": "dashboard.dashboards"}', template: 'src/app/dashboard/dashboards.tpl.html', ...{
                  dashboardsType: 'tenant',
                  searchEnabled: true,
                  pageTitle: 'dashboard.dashboards'
              } },
    },
      {
      path: 'customers/:customerId/devices',
      loadComponent: () => import('./feature/device/device/device.component').then((m) => m.DeviceComponent),
      data: { state: 'home.customers.devices', module: 'private', auth: ['TENANT_ADMIN'], params: {'topIndex': 0}, breadcrumb: '{"icon": "devices_other", "label": "{{ vm.customerDevicesTitle }}", "translate": "false"}', template: 'src/app/device/devices.tpl.html', ...{
                  devicesType: 'customer',
                  searchEnabled: true,
                  searchByEntitySubtype: true,
                  searchEntityType: types.entityType.device,
                  pageTitle: 'customer.devices'
              } },
    },
      {
      path: 'devices',
      loadComponent: () => import('./feature/device/device/device.component').then((m) => m.DeviceComponent),
      data: { state: 'home.devices', module: 'private', auth: ['TENANT_ADMIN', 'CUSTOMER_USER'], params: {'topIndex': 0}, breadcrumb: '{"icon": "devices_other", "label": "device.devices"}', template: 'src/app/device/devices.tpl.html', ...{
                  devicesType: 'tenant',
                  searchEnabled: true,
                  searchByEntitySubtype: true,
                  searchEntityType: types.entityType.device,
                  pageTitle: 'device.devices'
              } },
    },
      {
      path: 'customers/:customerId/entityViews',
      loadComponent: () => import('./feature/entity-view/entity-view/entity-view.component').then((m) => m.EntityViewComponent),
      data: { state: 'home.customers.entityViews', module: 'private', auth: ['TENANT_ADMIN'], params: {'topIndex': 0}, breadcrumb: '{"icon": "view_quilt", "label": "{{ vm.customerEntityViewsTitle }}", "translate": "false"}', template: 'src/app/entity-view/entity-views.tpl.html', ...{
                  entityViewsType: 'customer',
                  searchEnabled: true,
                  searchByEntitySubtype: true,
                  searchEntityType: types.entityType.entityView,
                  pageTitle: 'customer.entity-views'
              } },
    },
      {
      path: 'entityViews',
      loadComponent: () => import('./feature/entity-view/entity-view/entity-view.component').then((m) => m.EntityViewComponent),
      data: { state: 'home.entityViews', module: 'private', auth: ['TENANT_ADMIN', 'CUSTOMER_USER'], params: {'topIndex': 0}, breadcrumb: '{"icon": "view_quilt", "label": "entity-view.entity-views"}', template: 'src/app/entity-view/entity-views.tpl.html', ...{
                  entityViewsType: 'tenant',
                  searchEnabled: true,
                  searchByEntitySubtype: true,
                  searchEntityType: types.entityType.entityView,
                  pageTitle: 'entity-view.entity-views'
              } },
    },
      {
      path: 'home',
      loadComponent: () => import('./feature/home/home-links/home-links.component').then((m) => m.HomeLinksComponent),
      data: { state: 'home.links', module: 'private', auth: ['SYS_ADMIN', 'TENANT_ADMIN', 'CUSTOMER_USER'], breadcrumb: '{"icon": "home", "label": "home.home"}', template: 'src/app/home/home-links.tpl.html', ...{
                  pageTitle: 'home.home'
              } },
    },
      {
      path: 'jsonform',
      loadComponent: () => import('./feature/jsonform/json-form/json-form.component').then((m) => m.JsonFormComponent),
      data: { state: 'home.jsonform', module: 'private', auth: ['SYS_ADMIN'], breadcrumb: '{"icon": "settings", "label": "admin.system-settings"}', template: 'src/app/jsonform/jsonform.tpl.html', ...{
                  key: 'general',
                  pageTitle: 'admin.general-settings'
              } },
    },
      {
      path: 'profile',
      loadComponent: () => import('./feature/profile/profile/profile.component').then((m) => m.ProfileComponent),
      data: { state: 'home.profile', module: 'private', auth: ['SYS_ADMIN', 'TENANT_ADMIN', 'CUSTOMER_USER'], breadcrumb: '{"icon": "account_circle", "label": "profile.profile"}', template: 'src/app/profile/profile.tpl.html', ...{
                  pageTitle: 'profile.profile'
              } },
    },
      {
      path: 'ruleChains/ruleChain/import',
      loadComponent: () => import('./feature/rulechain/rule-chain/rule-chain.component').then((m) => m.RuleChainComponent),
      data: { state: 'home.ruleChains.importRuleChain', module: 'private', auth: ['SYS_ADMIN', 'TENANT_ADMIN'], params: {
              ruleChainImport: {}
          }, breadcrumb: '{"icon": "settings_ethernet", "label": "{{ (\'rulechain.import\' | translate) + \': \'+ vm.ruleChain.name }}", "translate": "false"}', template: 'src/app/rulechain/rulechain.tpl.html', ...{
              import: true,
              searchEnabled: true,
              pageTitle: 'rulechain.rulechain'
          } },
    },
      {
      path: 'ruleChains/:ruleChainId',
      loadComponent: () => import('./feature/rulechain/rule-chain/rule-chain.component').then((m) => m.RuleChainComponent),
      data: { state: 'home.ruleChains.ruleChain', module: 'private', auth: ['SYS_ADMIN', 'TENANT_ADMIN'], breadcrumb: '{"icon": "settings_ethernet", "label": "{{ vm.ruleChain.name + (vm.ruleChain.root ? (\' (\' + (\'rulechain.root\' | translate) + \')\') : \'\') }}", "translate": "false"}', template: 'src/app/rulechain/rulechain.tpl.html', ...{
                  import: false,
                  searchEnabled: true,
                  pageTitle: 'rulechain.rulechain'
              } },
    },
      {
      path: 'ruleChains',
      loadComponent: () => import('./feature/rulechain/rule-chains/rule-chains.component').then((m) => m.RuleChainsComponent),
      data: { state: 'home.ruleChains', module: 'private', auth: ['SYS_ADMIN', 'TENANT_ADMIN'], params: {'topIndex': 0}, breadcrumb: '{"icon": "settings_ethernet", "label": "rulechain.rulechains"}', template: 'src/app/rulechain/rulechains.tpl.html', ...{
                  searchEnabled: true,
                  pageTitle: 'rulechain.rulechains'
              } },
    },
      {
      path: 'tenants',
      loadComponent: () => import('./feature/tenant/tenant/tenant.component').then((m) => m.TenantComponent),
      data: { state: 'home.tenants', module: 'private', auth: ['SYS_ADMIN'], params: {'topIndex': 0}, breadcrumb: '{"icon": "supervisor_account", "label": "tenant.tenants"}', template: 'src/app/tenant/tenants.tpl.html', ...{
                  searchEnabled: true,
                  pageTitle: 'tenant.tenants'
              } },
    },
      {
      path: 'customers/:customerId/users',
      loadComponent: () => import('./feature/user/user/user.component').then((m) => m.UserComponent),
      data: { state: 'home.customers.users', module: 'private', auth: ['TENANT_ADMIN'], params: {'topIndex': 0}, breadcrumb: '{"icon": "account_circle", "label": "user.customer-users"}', template: 'src/app/user/users.tpl.html', ...{
                  usersType: 'customer',
                  searchEnabled: true,
                  pageTitle: 'user.customer-users'
              } },
    },
      {
      path: 'tenants/:tenantId/users',
      loadComponent: () => import('./feature/user/user/user.component').then((m) => m.UserComponent),
      data: { state: 'home.tenants.users', module: 'private', auth: ['SYS_ADMIN'], params: {'topIndex': 0}, breadcrumb: '{"icon": "account_circle", "label": "user.tenant-admins"}', template: 'src/app/user/users.tpl.html', ...{
                  usersType: 'tenant',
                  searchEnabled: true,
                  pageTitle: 'user.tenant-admins'
              } },
    },
      {
      path: 'widgets-bundles/:widgetsBundleId/widgetTypes/:widgetTypeId',
      loadComponent: () => import('./feature/widget/widget-editor/widget-editor.component').then((m) => m.WidgetEditorComponent),
      data: { state: 'home.widgets-bundles.widget-types.widget-type', module: 'private', auth: ['SYS_ADMIN', 'TENANT_ADMIN'], params: {
                  widgetType: null
              }, breadcrumb: '{"icon": "insert_chart", "label": "{{ vm.widget.widgetName }}", "translate": "false"}', template: 'src/app/widget/widget-editor.tpl.html', ...{
                  searchEnabled: false,
                  pageTitle: 'widget.editor'
              } },
    },
      {
      path: 'widgets-bundles/:widgetsBundleId/widgetTypes',
      loadComponent: () => import('./feature/widget/widget-library/widget-library.component').then((m) => m.WidgetLibraryComponent),
      data: { state: 'home.widgets-bundles.widget-types', module: 'private', auth: ['SYS_ADMIN', 'TENANT_ADMIN'], params: {'topIndex': 0}, breadcrumb: '{"icon": "now_widgets", "label": "{{ vm.widgetsBundle.title }}", "translate": "false"}', template: 'src/app/widget/widget-library.tpl.html', ...{
                  searchEnabled: false,
                  pageTitle: 'widget.widget-library'
              } },
    },
      {
      path: 'widgets-bundles',
      loadComponent: () => import('./feature/widget/widgets-bundle/widgets-bundle.component').then((m) => m.WidgetsBundleComponent),
      data: { state: 'home.widgets-bundles', module: 'private', auth: ['SYS_ADMIN', 'TENANT_ADMIN'], params: {'topIndex': 0}, breadcrumb: '{"icon": "now_widgets", "label": "widgets-bundle.widgets-bundles"}', template: 'src/app/widget/widgets-bundles.tpl.html', ...{
                  searchEnabled: true,
                  pageTitle: 'widgets-bundle.widgets-bundles'
              } },
    },
      { path: '', redirectTo: '/home', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '' },
];
