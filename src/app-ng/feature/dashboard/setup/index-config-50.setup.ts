/**
 * Ported from the AngularJS config block `index-config-50` (module `thingsboard.dashboard`) in src/app/dashboard/index.js:50.
 * Scaffolded by the playbook. TODO(port): a config block becomes provider configuration; a run block becomes an APP_INITIALIZER or a root service constructor. inject() below only works inside an injection context (an APP_INITIALIZER factory, a constructor).
 */
export function indexConfig50(): void {
  // TODO(port): '$stateProvider' — an AngularJS built-in with no Angular counterpart

  // TODO(port): the AngularJS code this class replaces, from src/app/dashboard/index.js:50. Port it, then delete this block.
  /* ORIGINAL
function DashboardRoutes($stateProvider) {
    $stateProvider
        .state('home.dashboards', {
            url: '/dashboards',
            params: {'topIndex': 0},
            module: 'private',
            auth: ['TENANT_ADMIN', 'CUSTOMER_USER'],
            views: {
                "content@home": {
                    templateUrl: dashboardsTemplate,
                    controller: 'DashboardsController',
                    controllerAs: 'vm'
                }
            },
            data: {
                dashboardsType: 'tenant',
                searchEnabled: true,
                pageTitle: 'dashboard.dashboards'
            },
            ncyBreadcrumb: {
                label: '{"icon": "dashboard", "label": "dashboard.dashboards"}'
            }
        })
        .state('home.customers.dashboards', {
            url: '/:customerId/dashboards',
            params: {'topIndex': 0},
            module: 'private',
            auth: ['TENANT_ADMIN'],
            views: {
                "content@home": {
                    templateUrl: dashboardsTemplate,
                    controllerAs: 'vm',
                    controller: 'DashboardsController'
                }
            },
            data: {
                dashboardsType: 'customer',
                searchEnabled: true,
                pageTitle: 'customer.dashboards'
            },
            ncyBreadcrumb: {
                label: '{"icon": "dashboard", "label": "{{ vm.customerDashboardsTitle }}", "translate": "false"}'
            }
        })
        .state('home.dashboards.dashboard', {
            url: '/:dashboardId?state',
            reloadOnSearch: false,
            module: 'private',
            auth: ['TENANT_ADMIN', 'CUSTOMER_USER'],
            views: {
                "content@home": {
                    templateUrl: dashboardTemplate,
                    controller: 'DashboardController',
                    controllerAs: 'vm'
                }
            },
            data: {
                widgetEditMode: false,
                searchEnabled: false,
                pageTitle: 'dashboard.dashboard'
            },
            ncyBreadcrumb: {
                label: '{"icon": "dashboard", "label": "{{ vm.dashboard.title }}", "translate": "false"}'
            }
        })
        .state('dashboard', {
            url: '/dashboard/:dashboardId?state',
            reloadOnSearch: false,
            module: 'private',
            auth: ['TENANT_ADMIN', 'CUSTOMER_USER'],
            views: {
                "@": {
                    templateUrl: dashboardTemplate,
                    controller: 'DashboardController',
                    controllerAs: 'vm'
                }
            },
            data: {
                widgetEditMode: false,
                searchEnabled: false,
                pageTitle: 'dashboard.dashboard'
            }
        })
        .state('home.customers.dashboards.dashboard', {
            url: '/:dashboardId?state',
            reloadOnSearch: false,
            module: 'private',
            auth: ['TENANT_ADMIN', 'CUSTOMER_USER'],
            views: {
                "content@home": {
                    templateUrl: dashboardTemplate,
                    controller: 'DashboardController',
                    controllerAs: 'vm'
                }
            },
            data: {
                searchEnabled: false,
                pageTitle: 'customer.dashboard'
            },
            ncyBreadcrumb: {
                label: '{"icon": "dashboard", "label": "customer.dashboard"}'
            }
        })
}
  */
}
