/**
 * Ported from the AngularJS config block `index-config-26` (module `thingsboard.tenant`) in src/app/tenant/index.js:26.
 * Scaffolded by the playbook. TODO(port): a config block becomes provider configuration; a run block becomes an APP_INITIALIZER or a root service constructor. inject() below only works inside an injection context (an APP_INITIALIZER factory, a constructor).
 */
export function indexConfig26(): void {
  // TODO(port): '$stateProvider' — an AngularJS built-in with no Angular counterpart

  // TODO(port): the AngularJS code this class replaces, from src/app/tenant/index.js:26. Port it, then delete this block.
  /* ORIGINAL
function TenantRoutes($stateProvider) {

    $stateProvider
        .state('home.tenants', {
            url: '/tenants',
            params: {'topIndex': 0},
            module: 'private',
            auth: ['SYS_ADMIN'],
            views: {
                "content@home": {
                    templateUrl: tenantsTemplate,
                    controllerAs: 'vm',
                    controller: 'TenantController'
                }
            },
            data: {
                searchEnabled: true,
                pageTitle: 'tenant.tenants'
            },
            ncyBreadcrumb: {
                label: '{"icon": "supervisor_account", "label": "tenant.tenants"}'
            }
        });
}
  */
}
