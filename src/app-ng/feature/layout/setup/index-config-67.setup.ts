/**
 * Ported from the AngularJS config block `index-config-67` (module `thingsboard.home`) in src/app/layout/index.js:67.
 * Scaffolded by the playbook. TODO(port): a config block becomes provider configuration; a run block becomes an APP_INITIALIZER or a root service constructor. inject() below only works inside an injection context (an APP_INITIALIZER factory, a constructor).
 */
export function indexConfig67(): void {
  // TODO(port): '$stateProvider' — an AngularJS built-in with no Angular counterpart
  // TODO(port): '$breadcrumbProvider' — an AngularJS built-in with no Angular counterpart

  // TODO(port): the AngularJS code this class replaces, from src/app/layout/index.js:67. Port it, then delete this block.
  /* ORIGINAL
function HomeRoutes($stateProvider, $breadcrumbProvider) {

    $breadcrumbProvider.setOptions({
        prefixStateName: 'home',
        templateUrl: breadcrumbTemplate
    });

    $stateProvider
        .state('home', {
            url: '',
            module: 'private',
            auth: ['SYS_ADMIN', 'TENANT_ADMIN', 'CUSTOMER_USER'],
            views: {
                "@": {
                    controller: 'HomeController',
                    controllerAs: 'vm',
                    templateUrl: homeTemplate
                }
            },
            data: {
                pageTitle: 'home.home'
            },
            ncyBreadcrumb: {
                skip: true
            }
        });
}
  */
}
