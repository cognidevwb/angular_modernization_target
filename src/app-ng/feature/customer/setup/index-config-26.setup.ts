/**
 * Ported from the AngularJS config block `index-config-26` (module `thingsboard.customer`) in src/app/customer/index.js:26.
 * Scaffolded by the playbook. TODO(port): a config block becomes provider configuration; a run block becomes an APP_INITIALIZER or a root service constructor. inject() below only works inside an injection context (an APP_INITIALIZER factory, a constructor).
 */
export function indexConfig26(): void {
  // TODO(port): '$stateProvider' — an AngularJS built-in with no Angular counterpart

  // TODO(port): the AngularJS code this class replaces, from src/app/customer/index.js:26. Port it, then delete this block.
  /* ORIGINAL
function CustomerRoutes($stateProvider) {

    $stateProvider
        .state('home.customers', {
            url: '/customers',
            params: {'topIndex': 0},
            module: 'private',
            auth: ['TENANT_ADMIN'],
            views: {
                "content@home": {
                    templateUrl: customersTemplate,
                    controllerAs: 'vm',
                    controller: 'CustomerController'
                }
            },
            data: {
                searchEnabled: true,
                pageTitle: 'customer.customers'
            },
            ncyBreadcrumb: {
                label: '{"icon": "supervisor_account", "label": "customer.customers"}'
            }
        });

}
  */
}
