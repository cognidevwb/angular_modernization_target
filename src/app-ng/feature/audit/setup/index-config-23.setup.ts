/**
 * Ported from the AngularJS config block `index-config-23` (module `thingsboard.auditLog`) in src/app/audit/index.js:23.
 * Scaffolded by the playbook. TODO(port): a config block becomes provider configuration; a run block becomes an APP_INITIALIZER or a root service constructor. inject() below only works inside an injection context (an APP_INITIALIZER factory, a constructor).
 */
export function indexConfig23(): void {
  // TODO(port): '$stateProvider' — an AngularJS built-in with no Angular counterpart

  // TODO(port): the AngularJS code this class replaces, from src/app/audit/index.js:23. Port it, then delete this block.
  /* ORIGINAL
function AuditLogRoutes($stateProvider) {
    $stateProvider
        .state('home.auditLogs', {
            url: '/auditLogs',
            module: 'private',
            auth: ['TENANT_ADMIN'],
            views: {
                "content@home": {
                    templateUrl: auditLogsTemplate,
                    controller: 'AuditLogsController',
                    controllerAs: 'vm'
                }
            },
            data: {
                searchEnabled: false,
                pageTitle: 'audit-log.audit-logs'
            },
            ncyBreadcrumb: {
                label: '{"icon": "track_changes", "label": "audit-log.audit-logs"}'
            }
        });
}
  */
}
