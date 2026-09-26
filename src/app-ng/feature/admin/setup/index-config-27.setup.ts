/**
 * Ported from the AngularJS config block `index-config-27` (module `thingsboard.admin`) in src/app/admin/index.js:27.
 * Scaffolded by the playbook. TODO(port): a config block becomes provider configuration; a run block becomes an APP_INITIALIZER or a root service constructor. inject() below only works inside an injection context (an APP_INITIALIZER factory, a constructor).
 */
export function indexConfig27(): void {
  // TODO(port): '$stateProvider' — an AngularJS built-in with no Angular counterpart

  // TODO(port): the AngularJS code this class replaces, from src/app/admin/index.js:27. Port it, then delete this block.
  /* ORIGINAL
function AdminRoutes($stateProvider) {
    $stateProvider
        .state('home.settings', {
            url: '/settings',
            module: 'private',
            auth: ['SYS_ADMIN'],
            redirectTo: 'home.settings.general',
            ncyBreadcrumb: {
                label: '{"icon": "settings", "label": "admin.system-settings"}'
            }
        })
        .state('home.settings.general', {
            url: '/general',
            module: 'private',
            auth: ['SYS_ADMIN'],
            views: {
                "content@home": {
                    templateUrl: generalSettingsTemplate,
                    controllerAs: 'vm',
                    controller: 'AdminController'
                }
            },
            data: {
                key: 'general',
                pageTitle: 'admin.general-settings'
            },
            ncyBreadcrumb: {
                label: '{"icon": "settings_applications", "label": "admin.general"}'
            }
        })
        .state('home.settings.outgoing-mail', {
            url: '/outgoing-mail',
            module: 'private',
            auth: ['SYS_ADMIN'],
            views: {
                "content@home": {
                    templateUrl: outgoingMailSettingsTemplate,
                    controllerAs: 'vm',
                    controller: 'AdminController'
                }
            },
            data: {
                key: 'mail',
                pageTitle: 'admin.outgoing-mail-settings'
            },
            ncyBreadcrumb: {
                label: '{"icon": "mail", "label": "admin.outgoing-mail"}'
            }
        })
        .state('home.settings.security-settings', {
            url: '/security-settings',
            module: 'private',
            auth: ['SYS_ADMIN'],
            views: {
                "content@home": {
                    templateUrl: securitySettingsTemplate,
                    controllerAs: 'vm',
                    controller: 'SecuritySettingsController'
                }
            },
            data: {
                pageTitle: 'admin.security-settings'
            },
            ncyBreadcrumb: {
                label: '{"icon": "security", "label": "admin.security-settings"}'
            }
        });
}
  */
}
