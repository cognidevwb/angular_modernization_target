/**
 * Ported from the AngularJS config block `index-config-27` (module `thingsboard.profile`) in src/app/profile/index.js:27.
 * Scaffolded by the playbook. TODO(port): a config block becomes provider configuration; a run block becomes an APP_INITIALIZER or a root service constructor. inject() below only works inside an injection context (an APP_INITIALIZER factory, a constructor).
 */
export function indexConfig27(): void {
  // TODO(port): '$stateProvider' — an AngularJS built-in with no Angular counterpart

  // TODO(port): the AngularJS code this class replaces, from src/app/profile/index.js:27. Port it, then delete this block.
  /* ORIGINAL
function ProfileRoutes($stateProvider) {

    $stateProvider
        .state('home.profile', {
            url: '/profile',
            module: 'private',
            auth: ['SYS_ADMIN', 'TENANT_ADMIN', 'CUSTOMER_USER'],
            views: {
                "content@home": {
                    templateUrl: profileTemplate,
                    controllerAs: 'vm',
                    controller: 'ProfileController'
                }
            },
            data: {
                pageTitle: 'profile.profile'
            },
            ncyBreadcrumb: {
                label: '{"icon": "account_circle", "label": "profile.profile"}'
            }
        });

}
  */
}
