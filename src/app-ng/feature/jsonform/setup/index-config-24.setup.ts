/**
 * Ported from the AngularJS config block `index-config-24` (module `thingsboard.jsonform`) in src/app/jsonform/index.js:24.
 * Scaffolded by the playbook. TODO(port): a config block becomes provider configuration; a run block becomes an APP_INITIALIZER or a root service constructor. inject() below only works inside an injection context (an APP_INITIALIZER factory, a constructor).
 */
export function indexConfig24(): void {
  // TODO(port): '$stateProvider' — an AngularJS built-in with no Angular counterpart

  // TODO(port): the AngularJS code this class replaces, from src/app/jsonform/index.js:24. Port it, then delete this block.
  /* ORIGINAL
function JsonFormRoutes($stateProvider) {
    $stateProvider
        .state('home.jsonform', {
            url: '/jsonform',
            module: 'private',
            auth: ['SYS_ADMIN'],
            views: {
                "content@home": {
                    templateUrl: jsonFormTemplate,
                    controllerAs: 'vm',
                    controller: 'JsonFormController'
                }
            },
            data: {
                key: 'general',
                pageTitle: 'admin.general-settings'
            },
            ncyBreadcrumb: {
                label: '{"icon": "settings", "label": "admin.system-settings"}'
            }
        });
}
  */
}
