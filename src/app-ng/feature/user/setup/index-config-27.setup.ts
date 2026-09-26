/**
 * Ported from the AngularJS config block `index-config-27` (module `thingsboard.user`) in src/app/user/index.js:27.
 * Scaffolded by the playbook. TODO(port): a config block becomes provider configuration; a run block becomes an APP_INITIALIZER or a root service constructor. inject() below only works inside an injection context (an APP_INITIALIZER factory, a constructor).
 */
export function indexConfig27(): void {
  // TODO(port): '$stateProvider' — an AngularJS built-in with no Angular counterpart

  // TODO(port): the AngularJS code this class replaces, from src/app/user/index.js:27. Port it, then delete this block.
  /* ORIGINAL
function UserRoutes($stateProvider) {

    $stateProvider
        .state('home.tenants.users', {
            url: '/:tenantId/users',
            params: {'topIndex': 0},
            module: 'private',
            auth: ['SYS_ADMIN'],
            views: {
                "content@home": {
                    templateUrl: usersTemplate,
                    controllerAs: 'vm',
                    controller: 'UserController'
                }
            },
            data: {
                usersType: 'tenant',
                searchEnabled: true,
                pageTitle: 'user.tenant-admins'
            },
            ncyBreadcrumb: {
                label: '{"icon": "account_circle", "label": "user.tenant-admins"}'
            }
        })
        .state('home.customers.users', {
            url: '/:customerId/users',
            params: {'topIndex': 0},
            module: 'private',
            auth: ['TENANT_ADMIN'],
            views: {
                "content@home": {
                    templateUrl: usersTemplate,
                    controllerAs: 'vm',
                    controller: 'UserController'
                }
            },
            data: {
                usersType: 'customer',
                searchEnabled: true,
                pageTitle: 'user.customer-users'
            },
            ncyBreadcrumb: {
                label: '{"icon": "account_circle", "label": "user.customer-users"}'
            }
        });

}
  */
}
