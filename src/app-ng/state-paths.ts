// Scaffolded by the playbook from the ui-router states: each state's Angular path.
import { Router, UrlTree } from '@angular/router';

export const STATE_PATHS: Record<string, string> = {
  'home.settings.security-settings': '/settings/security-settings',
  'home.settings.outgoing-mail': '/settings/outgoing-mail',
  'home.settings.general': '/settings/general',
  'home.settings': '/settings/general',
  'home.customers.assets': '/customers/:customerId/assets',
  'home.assets': '/assets',
  'home.auditLogs': '/auditLogs',
  'home.customers': '/customers',
  'home.customers.dashboards.dashboard': '/customers/:customerId/dashboards/:dashboardId',
  'dashboard': '/dashboard/:dashboardId',
  'home.dashboards.dashboard': '/dashboards/:dashboardId',
  'home.customers.dashboards': '/customers/:customerId/dashboards',
  'home.dashboards': '/dashboards',
  'home.customers.devices': '/customers/:customerId/devices',
  'home.devices': '/devices',
  'home.customers.entityViews': '/customers/:customerId/entityViews',
  'home.entityViews': '/entityViews',
  'home.links': '/home',
  'home.jsonform': '/jsonform',
  'home': '/',
  'login.createPassword': '/login/createPassword',
  'login.resetExpiredPassword': '/login/resetExpiredPassword',
  'login.resetPassword': '/login/resetPassword',
  'login.resetPasswordRequest': '/login/resetPasswordRequest',
  'login': '/login',
  'home.profile': '/profile',
  'home.ruleChains.importRuleChain': '/ruleChains/ruleChain/import',
  'home.ruleChains.ruleChain': '/ruleChains/:ruleChainId',
  'home.ruleChains': '/ruleChains',
  'home.tenants': '/tenants',
  'home.customers.users': '/customers/:customerId/users',
  'home.tenants.users': '/tenants/:tenantId/users',
  'widgetEditor': '/widget-editor',
  'home.widgets-bundles.widget-types.widget-type': '/widgets-bundles/:widgetsBundleId/widgetTypes/:widgetTypeId',
  'home.widgets-bundles.widget-types': '/widgets-bundles/:widgetsBundleId/widgetTypes',
  'home.widgets-bundles': '/widgets-bundles',
};

/** The URL tree of a state with its params: `:x` from params, the rest as query parameters. */
export function stateUrlTree(router: Router, name: string, params: Record<string, any> = {}): UrlTree {
  const pattern = STATE_PATHS[name] ?? '/';
  const query: Record<string, any> = {};
  const used = new Set<string>();
  const path = pattern.replace(/:([A-Za-z0-9_]+)/g, (_m, key) => {
    used.add(key);
    return encodeURIComponent(params?.[key] ?? '');
  });
  for (const [k, v] of Object.entries(params ?? {})) {
    if (!used.has(k) && v !== undefined && v !== null && typeof v !== 'object') {
      query[k] = v;
    }
  }
  return router.createUrlTree([path], { queryParams: query });
}

/** `$state.go(name, params)`. */
export function goState(router: Router, name: string, params: Record<string, any> = {}): Promise<boolean> {
  return router.navigateByUrl(stateUrlTree(router, name, params));
}

/** `$state.href(name, params)` / `ui-sref`: the path to link to. */
export function stateHref(router: Router, name: string, params: Record<string, any> = {}): string {
  return router.serializeUrl(stateUrlTree(router, name, params));
}
