/**
 * Ported from the AngularJS config block `index-config-40` (module `thingsboard.widget-library`) in src/app/widget/index.js:40.
 * Scaffolded by the playbook. TODO(port): a config block becomes provider configuration; a run block becomes an APP_INITIALIZER or a root service constructor. inject() below only works inside an injection context (an APP_INITIALIZER factory, a constructor).
 */
export function indexConfig40(): void {
  // TODO(port): '$stateProvider' — an AngularJS built-in with no Angular counterpart

  // TODO(port): the AngularJS code this class replaces, from src/app/widget/index.js:40. Port it, then delete this block.
  /* ORIGINAL
function WidgetLibraryRoutes($stateProvider) {
    $stateProvider
        .state('home.widgets-bundles', {
            url: '/widgets-bundles',
            params: {'topIndex': 0},
            module: 'private',
            auth: ['SYS_ADMIN', 'TENANT_ADMIN'],
            views: {
                "content@home": {
                    templateUrl: widgetsBundlesTemplate,
                    controller: 'WidgetsBundleController',
                    controllerAs: 'vm'
                }
            },
            data: {
                searchEnabled: true,
                pageTitle: 'widgets-bundle.widgets-bundles'
            },
            ncyBreadcrumb: {
                label: '{"icon": "now_widgets", "label": "widgets-bundle.widgets-bundles"}'
            }
        })
        .state('home.widgets-bundles.widget-types', {
            url: '/:widgetsBundleId/widgetTypes',
            params: {'topIndex': 0},
            module: 'private',
            auth: ['SYS_ADMIN', 'TENANT_ADMIN'],
            views: {
                "content@home": {
                    templateUrl: widgetLibraryTemplate,
                    controller: 'WidgetLibraryController',
                    controllerAs: 'vm'
                }
            },
            data: {
                searchEnabled: false,
                pageTitle: 'widget.widget-library'
            },
            ncyBreadcrumb: {
                label: '{"icon": "now_widgets", "label": "{{ vm.widgetsBundle.title }}", "translate": "false"}'
            }
        })
        .state('home.widgets-bundles.widget-types.widget-type', {
            url: '/:widgetTypeId',
            module: 'private',
            auth: ['SYS_ADMIN', 'TENANT_ADMIN'],
            views: {
                "content@home": {
                    templateUrl: widgetEditorTemplate,
                    controller: 'WidgetEditorController',
                    controllerAs: 'vm'
                }
            },
            params: {
                widgetType: null
            },
            data: {
                searchEnabled: false,
                pageTitle: 'widget.editor'
            },
            ncyBreadcrumb: {
                label: '{"icon": "insert_chart", "label": "{{ vm.widget.widgetName }}", "translate": "false"}'
            }
        })
        .state('widgetEditor', {
            url: '/widget-editor',
            module: 'private',
            auth: ['SYS_ADMIN', 'TENANT_ADMIN'],
            views: {
                "@": {
                    templateUrl: dashboardTemplate,
                    controller: 'DashboardController',
                    controllerAs: 'vm'
                }
            },
            data: {
                widgetEditMode: true,
                searchEnabled: false,
                pageTitle: 'widget.editor'
            }
        })
}
  */
}
